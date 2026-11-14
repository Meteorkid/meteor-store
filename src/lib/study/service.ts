import { countDueVocabulary } from './vocabulary-service';
import { randomUUID } from 'node:crypto';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { studyCourses, studyDeadlines, studyProblems } from '@/lib/db/schema';
import { dailyDate } from '@/lib/daily/types';
import { initialReviewSchedule, nextReviewSchedule } from './review';
import type {
  StudyCourse,
  StudyCourseInput,
  StudyCoursePatch,
  StudyDeadline,
  StudyDeadlineInput,
  StudyDeadlinePatch,
  StudyProblem,
  StudyProblemInput,
  StudyProblemPatch,
  StudyReviewInput,
} from './types';

/**
 * 学习工作台的服务层。
 *
 * 所有查询都带 userId 归属条件：三张表是纯私人数据，没有跨用户读取路径，
 * 任何一次忘记归属过滤都会变成越权读写。更新与删除返回受影响行，
 * 命中不到（不是本人 / 不存在）由路由层映射为 404。
 */

const courseColumns = {
  id: studyCourses.id, term: studyCourses.term, name: studyCourses.name,
  credits: studyCourses.credits, score: studyCourses.score, status: studyCourses.status,
  createdAt: studyCourses.createdAt, updatedAt: studyCourses.updatedAt,
};
const deadlineColumns = {
  id: studyDeadlines.id, courseId: studyDeadlines.courseId, title: studyDeadlines.title,
  kind: studyDeadlines.kind, dueAt: studyDeadlines.dueAt, status: studyDeadlines.status,
  notes: studyDeadlines.notes, createdAt: studyDeadlines.createdAt, updatedAt: studyDeadlines.updatedAt,
};
const problemColumns = {
  id: studyProblems.id, title: studyProblems.title, topic: studyProblems.topic,
  difficulty: studyProblems.difficulty, url: studyProblems.url, status: studyProblems.status,
  notes: studyProblems.notes, reviewStage: studyProblems.reviewStage,
  reviewDueOn: studyProblems.reviewDueOn, reviewIntervalDays: studyProblems.reviewIntervalDays,
  lastReviewedOn: studyProblems.lastReviewedOn, createdAt: studyProblems.createdAt, updatedAt: studyProblems.updatedAt,
};

export async function listStudyCourses(userId: string): Promise<StudyCourse[]> {
  return db.select(courseColumns).from(studyCourses)
    .where(eq(studyCourses.userId, userId))
    .orderBy(asc(studyCourses.term), asc(studyCourses.createdAt));
}

export async function createStudyCourse(userId: string, input: StudyCourseInput): Promise<StudyCourse> {
  const now = new Date().toISOString();
  const [saved] = await db.insert(studyCourses).values({
    id: randomUUID(), userId, term: input.term, name: input.name, credits: input.credits,
    score: input.score ?? null, status: input.status ?? (input.score != null ? 'completed' : 'in-progress'),
    createdAt: now, updatedAt: now,
  }).returning(courseColumns);
  return saved;
}

export async function updateStudyCourse(userId: string, input: StudyCoursePatch): Promise<StudyCourse | null> {
  const [saved] = await db.update(studyCourses).set({
    ...(input.term !== undefined ? { term: input.term } : {}),
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.credits !== undefined ? { credits: input.credits } : {}),
    ...(input.score !== undefined ? { score: input.score } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedAt: new Date().toISOString(),
  }).where(and(eq(studyCourses.id, input.id), eq(studyCourses.userId, userId))).returning(courseColumns);
  return saved ?? null;
}

/** 删除课程不清掉关联截止事项：把它们的 courseId 置空，保留用户自己写的事项。 */
export async function deleteStudyCourse(userId: string, id: string): Promise<boolean> {
  return db.transaction(async tx => {
    const rows = await tx.delete(studyCourses)
      .where(and(eq(studyCourses.id, id), eq(studyCourses.userId, userId)))
      .returning({ id: studyCourses.id });
    if (!rows.length) return false;
    await tx.update(studyDeadlines).set({ courseId: null })
      .where(and(eq(studyDeadlines.userId, userId), eq(studyDeadlines.courseId, id)));
    return true;
  });
}

export async function listStudyDeadlines(userId: string): Promise<StudyDeadline[]> {
  return db.select(deadlineColumns).from(studyDeadlines)
    .where(eq(studyDeadlines.userId, userId))
    .orderBy(asc(studyDeadlines.dueAt));
}

/** courseId 只接受本人课程；返回 null 表示引用了不属于本账号的课程。 */
async function courseOwned(userId: string, courseId: string): Promise<boolean> {
  const [row] = await db.select({ id: studyCourses.id }).from(studyCourses)
    .where(and(eq(studyCourses.id, courseId), eq(studyCourses.userId, userId))).limit(1);
  return Boolean(row);
}

export async function createStudyDeadline(userId: string, input: StudyDeadlineInput): Promise<StudyDeadline | null> {
  if (input.courseId && !await courseOwned(userId, input.courseId)) return null;
  const now = new Date().toISOString();
  const [saved] = await db.insert(studyDeadlines).values({
    id: randomUUID(), userId, courseId: input.courseId ?? null, title: input.title,
    kind: input.kind, dueAt: input.dueAt, status: input.status ?? 'open',
    notes: input.notes ?? null, createdAt: now, updatedAt: now,
  }).returning(deadlineColumns);
  return saved;
}

export async function updateStudyDeadline(userId: string, input: StudyDeadlinePatch): Promise<StudyDeadline | null> {
  if (input.courseId && !await courseOwned(userId, input.courseId)) return null;
  const [saved] = await db.update(studyDeadlines).set({
    ...(input.courseId !== undefined ? { courseId: input.courseId } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(input.dueAt !== undefined ? { dueAt: input.dueAt } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
    updatedAt: new Date().toISOString(),
  }).where(and(eq(studyDeadlines.id, input.id), eq(studyDeadlines.userId, userId))).returning(deadlineColumns);
  return saved ?? null;
}

export async function deleteStudyDeadline(userId: string, id: string): Promise<boolean> {
  const rows = await db.delete(studyDeadlines)
    .where(and(eq(studyDeadlines.id, id), eq(studyDeadlines.userId, userId)))
    .returning({ id: studyDeadlines.id });
  return rows.length > 0;
}

export async function listStudyProblems(userId: string): Promise<StudyProblem[]> {
  return db.select(problemColumns).from(studyProblems)
    .where(eq(studyProblems.userId, userId))
    .orderBy(desc(studyProblems.createdAt));
}

export async function createStudyProblem(userId: string, input: StudyProblemInput): Promise<StudyProblem> {
  const now = new Date().toISOString();
  const solved = input.status === 'solved';
  const schedule = solved ? initialReviewSchedule() : null;
  const [saved] = await db.insert(studyProblems).values({
    id: randomUUID(), userId, title: input.title, topic: input.topic ?? '',
    difficulty: input.difficulty, url: input.url ?? null, status: input.status ?? 'todo',
    notes: input.notes ?? null,
    reviewStage: schedule?.stage ?? 0,
    reviewDueOn: schedule?.dueOn ?? null,
    reviewIntervalDays: schedule?.intervalDays ?? 1,
    lastReviewedOn: null, createdAt: now, updatedAt: now,
  }).returning(problemColumns);
  return saved;
}

/**
 * 更新题目；状态切换在这里处理复习队列：
 * - 首次标记「已解决」（还没排过复习）→ 明天第一次复习；
 * - 重新标记已解决 → 保留既有进度，不把复习历史清零；
 * - 改回「未解决」→ 字段保留，查询按 status 过滤即不再出现（见 review.ts 注释）。
 */
export async function updateStudyProblem(userId: string, input: StudyProblemPatch): Promise<StudyProblem | null> {
  const [existing] = await db.select(problemColumns).from(studyProblems)
    .where(and(eq(studyProblems.id, input.id), eq(studyProblems.userId, userId))).limit(1);
  if (!existing) return null;

  const nextStatus = input.status ?? existing.status;
  const enteringQueue = existing.status !== 'solved' && nextStatus === 'solved' && existing.reviewDueOn === null;
  const schedule = enteringQueue ? initialReviewSchedule(dailyDate()) : null;

  const [saved] = await db.update(studyProblems).set({
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.topic !== undefined ? { topic: input.topic } : {}),
    ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
    ...(input.url !== undefined ? { url: input.url } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(schedule ? { reviewStage: schedule.stage, reviewDueOn: schedule.dueOn, reviewIntervalDays: schedule.intervalDays } : {}),
    updatedAt: new Date().toISOString(),
  }).where(and(eq(studyProblems.id, input.id), eq(studyProblems.userId, userId))).returning(problemColumns);
  return saved ?? null;
}

export async function deleteStudyProblem(userId: string, id: string): Promise<boolean> {
  const rows = await db.delete(studyProblems)
    .where(and(eq(studyProblems.id, id), eq(studyProblems.userId, userId)))
    .returning({ id: studyProblems.id });
  return rows.length > 0;
}

/** 记录一次复习。只有「已解决」的题目在复习队列里，未解决返回 null。 */
export async function reviewStudyProblem(userId: string, input: StudyReviewInput): Promise<StudyProblem | null> {
  const [existing] = await db.select(problemColumns).from(studyProblems)
    .where(and(eq(studyProblems.id, input.id), eq(studyProblems.userId, userId))).limit(1);
  if (!existing || existing.status !== 'solved') return null;

  const schedule = nextReviewSchedule({ stage: existing.reviewStage }, input.result, dailyDate());
  const [saved] = await db.update(studyProblems).set({
    reviewStage: schedule.stage,
    reviewDueOn: schedule.dueOn,
    reviewIntervalDays: schedule.intervalDays,
    lastReviewedOn: schedule.lastReviewedOn,
    updatedAt: new Date().toISOString(),
  }).where(and(eq(studyProblems.id, input.id), eq(studyProblems.userId, userId))).returning(problemColumns);
  return saved ?? null;
}

/** 工作台铃铛的轻量摘要：今日复习数 + 7 天内课程截止数。 */
export async function getStudySummary(userId: string): Promise<{ dueReviews: number; upcomingDeadlines: number; dueVocabulary: number }> {
  const today = dailyDate();
  const [reviews, deadlines, dueVocabulary] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(studyProblems)
      .where(and(eq(studyProblems.userId, userId), eq(studyProblems.status, 'solved'),
        sql`${studyProblems.reviewDueOn} IS NOT NULL AND ${studyProblems.reviewDueOn} <= ${today}`)),
    db.select({ count: sql<number>`count(*)::int` }).from(studyDeadlines)
      .where(and(eq(studyDeadlines.userId, userId), eq(studyDeadlines.status, 'open'),
        // dueAt 可能是日期或 ISO 时刻：统一截到日期段再比，避免带时刻的第 7 天被漏掉
        sql`left(${studyDeadlines.dueAt}, 10) <= ${shiftDate(today, 7)}`)),
    countDueVocabulary(userId, today),
  ]);
  return { dueReviews: reviews[0]?.count ?? 0, upcomingDeadlines: deadlines[0]?.count ?? 0, dueVocabulary };
}

function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
