import { randomUUID } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { ieltsListeningAttempts } from '@/lib/db/schema';
import { getListeningLesson } from './catalog';
import {
  gradeListening, listeningQuestionLocations, normalizeListeningScope,
  LISTENING_QUESTION_COUNT, ListeningLessonSlugSchema,
} from './types';
/**
 * 雅思听力练习记录与错题本。
 *
 * 分数和错题号一律由这里按 gradeListening 重算后落库，客户端只交作答——
 * 分数不收客户端的，否则「10/10」可以随手写进来。
 *
 * 错题本的口径：每道题的状态取「最近一次做到它的那次练习」。整篇重练里做对了，
 * 它就从错题本里消失；只重练其中三道，另外七道保持原来的状态不变。
 */

export const LISTENING_ATTEMPT_RETENTION = 300;
export const LISTENING_ATTEMPT_MAX_DURATION_SEC = 3 * 60 * 60;

export type ListeningAttemptMode = 'full' | 'custom';

const QUESTION_KEY = /^(?:[1-9]|[1-3][0-9]|40)$/;

export const ListeningAttemptInputSchema = z.object({
  slug: ListeningLessonSlugSchema,
  /** 题号 → 作答；多选题每个题号的值是一个字母。 */
  answers: z.record(z.string(), z.string().max(80)),
  /** 本次实际作答的题号；省略表示整篇 10 题。 */
  scope: z.array(z.number().int().min(1).max(40)).min(1).max(LISTENING_QUESTION_COUNT).optional(),
  durationSec: z.number().int().min(0).max(LISTENING_ATTEMPT_MAX_DURATION_SEC),
}).strict().refine(input => Object.keys(input.answers).length <= LISTENING_QUESTION_COUNT
  && Object.keys(input.answers).every(key => QUESTION_KEY.test(key)), 'Invalid answers');
export type ListeningAttemptInput = z.infer<typeof ListeningAttemptInputSchema>;

export type ListeningAttemptErrorCode = 'invalid' | 'not_found' | 'unavailable';
const statusByCode: Record<ListeningAttemptErrorCode, number> = { invalid: 400, not_found: 404, unavailable: 503 };

export class ListeningAttemptError extends Error {
  readonly status: number;
  constructor(readonly code: ListeningAttemptErrorCode) {
    super(code);
    this.name = 'ListeningAttemptError';
    this.status = statusByCode[code];
  }
}

export interface ListeningAttemptRecord {
  id: string;
  lessonSlug: string;
  mode: ListeningAttemptMode;
  /** 本次实际作答的题号，升序。 */
  questionNumbers: number[];
  /** 本次判错的题号，升序。 */
  wrongNumbers: number[];
  score: number;
  total: number;
  durationSec: number;
  createdAt: string;
}

export interface ListeningWrongBookEntry {
  lessonSlug: string;
  attempts: number;
  /** 整篇练习的最好成绩；只做过错题重练时为 null。 */
  bestFullScore: number | null;
  lastPracticedAt: string;
  /** 最近一次做到时仍然答错的题号，升序。 */
  wrongNumbers: number[];
}

function numbersOf(value: unknown): number[] {
  return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item)) : [];
}

function toRecord(row: {
  id: string; lessonSlug: string; mode: string; questionNumbers: unknown; wrongNumbers: unknown;
  score: number; total: number; durationSec: number; createdAt: string;
}): ListeningAttemptRecord {
  return {
    id: row.id, lessonSlug: row.lessonSlug,
    mode: row.mode === 'full' ? 'full' : 'custom',
    questionNumbers: numbersOf(row.questionNumbers), wrongNumbers: numbersOf(row.wrongNumbers),
    score: row.score, total: row.total, durationSec: row.durationSec, createdAt: row.createdAt,
  };
}

/** 每人只保留最近 N 条：删掉本人不在这 N 条之内的记录。 */
export function listeningAttemptRetentionWhere(userId: string) {
  const recent = db.select({ id: ieltsListeningAttempts.id })
    .from(ieltsListeningAttempts)
    .where(eq(ieltsListeningAttempts.userId, userId))
    .orderBy(desc(ieltsListeningAttempts.createdAt), desc(ieltsListeningAttempts.id))
    .limit(LISTENING_ATTEMPT_RETENTION);
  return and(
    eq(ieltsListeningAttempts.userId, userId),
    sql`${ieltsListeningAttempts.id} NOT IN (${recent})`,
  );
}

/** 记录一次练习并返回判分结果。范围、分数、错题号都以这里的计算为准。 */
export async function saveListeningAttempt(userId: string, raw: unknown): Promise<ListeningAttemptRecord> {
  const parsed = ListeningAttemptInputSchema.safeParse(raw);
  if (!parsed.success) throw new ListeningAttemptError('invalid');
  const input = parsed.data;

  let lesson: ReturnType<typeof getListeningLesson> = null;
  try { lesson = getListeningLesson(input.slug); } catch { throw new ListeningAttemptError('unavailable'); }
  if (!lesson) throw new ListeningAttemptError('not_found');

  const whole = listeningQuestionLocations(lesson).map(item => item.number);
  const scope = normalizeListeningScope(lesson, input.scope ?? whole);
  if (!scope.length) throw new ListeningAttemptError('invalid');

  // 只留下本次范围内的作答，范围外的键一律丢弃。
  const answers: Record<string, string> = {};
  scope.forEach(number => { answers[String(number)] = input.answers[String(number)] ?? ''; });
  const grade = gradeListening(lesson, answers, scope);
  const row = {
    id: randomUUID(), userId, lessonSlug: lesson.slug,
    mode: (scope.length === LISTENING_QUESTION_COUNT ? 'full' : 'custom') as ListeningAttemptMode,
    questionNumbers: scope, answers,
    wrongNumbers: grade.results.filter(item => !item.correct).map(item => item.number),
    score: grade.score, total: grade.total, durationSec: input.durationSec,
    createdAt: new Date().toISOString(),
  };
  try {
    await db.insert(ieltsListeningAttempts).values(row);
  } catch {
    throw new ListeningAttemptError('unavailable');
  }
  // 清理旧记录是附带动作：记录已经存下，清理失败不能把这次练习报成失败。
  try {
    await db.delete(ieltsListeningAttempts).where(listeningAttemptRetentionWhere(userId));
  } catch (error) {
    console.error('[ielts-listening] 清理旧练习记录失败', error);
  }
  return toRecord(row);
}

/** 最近 N 条，新的在前。 */
export async function listListeningAttempts(userId: string, limit = 50): Promise<ListeningAttemptRecord[]> {
  const size = Math.min(Math.max(Math.trunc(limit), 1), LISTENING_ATTEMPT_RETENTION);
  try {
    const rows = await db.select({
      id: ieltsListeningAttempts.id, lessonSlug: ieltsListeningAttempts.lessonSlug, mode: ieltsListeningAttempts.mode,
      questionNumbers: ieltsListeningAttempts.questionNumbers, wrongNumbers: ieltsListeningAttempts.wrongNumbers,
      score: ieltsListeningAttempts.score, total: ieltsListeningAttempts.total, durationSec: ieltsListeningAttempts.durationSec,
      createdAt: ieltsListeningAttempts.createdAt,
    }).from(ieltsListeningAttempts)
      .where(eq(ieltsListeningAttempts.userId, userId))
      .orderBy(desc(ieltsListeningAttempts.createdAt), desc(ieltsListeningAttempts.id))
      .limit(size);
    return rows.map(toRecord);
  } catch {
    throw new ListeningAttemptError('unavailable');
  }
}

/** 由练习记录（新的在前）算出错题本；每道题以最近一次做到它的练习为准。 */
export function buildListeningWrongBook(records: ListeningAttemptRecord[]): ListeningWrongBookEntry[] {
  const entries: ListeningWrongBookEntry[] = [];
  const decided = new Map<string, Map<number, boolean>>();
  for (const record of records) {
    let entry = entries.find(item => item.lessonSlug === record.lessonSlug);
    if (!entry) {
      entry = { lessonSlug: record.lessonSlug, attempts: 0, bestFullScore: null, lastPracticedAt: record.createdAt, wrongNumbers: [] };
      entries.push(entry);
      decided.set(record.lessonSlug, new Map());
    }
    entry.attempts += 1;
    if (record.mode === 'full' && (entry.bestFullScore === null || record.score > entry.bestFullScore)) {
      entry.bestFullScore = record.score;
    }
    const status = decided.get(record.lessonSlug)!;
    record.questionNumbers.forEach(number => {
      if (!status.has(number)) status.set(number, record.wrongNumbers.includes(number));
    });
  }
  return entries.map(entry => ({
    ...entry,
    wrongNumbers: [...decided.get(entry.lessonSlug)!].filter(([, wrong]) => wrong).map(([number]) => number).sort((a, b) => a - b),
  }));
}

export interface ListeningPracticeOverview {
  attempts: ListeningAttemptRecord[];
  wrongBook: ListeningWrongBookEntry[];
}

/** 记录页用的一次性读取：最近 50 条记录 + 全量（保留期内）记录算出的错题本。 */
export async function getListeningPracticeOverview(userId: string, recentLimit = 50): Promise<ListeningPracticeOverview> {
  const all = await listListeningAttempts(userId, LISTENING_ATTEMPT_RETENTION);
  return { attempts: all.slice(0, Math.min(Math.max(Math.trunc(recentLimit), 1), LISTENING_ATTEMPT_RETENTION)), wrongBook: buildListeningWrongBook(all) };
}
