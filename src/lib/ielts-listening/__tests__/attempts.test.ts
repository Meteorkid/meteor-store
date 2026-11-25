import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listeningLessons } from '@/data/ielts-listening';
import { ieltsListeningAttempts } from '@/lib/db/schema';
import {
  buildListeningWrongBook, ListeningAttemptError, ListeningAttemptInputSchema,
  listeningAttemptRetentionWhere, LISTENING_ATTEMPT_RETENTION, listListeningAttempts,
  saveListeningAttempt,
  type ListeningAttemptRecord,
} from '../attempts';
import { normalizeListeningScope } from '../types';

/**
 * 练习记录的边界：分数与错题号只认服务端重算，范围只认本课题号，
 * 多选题不被拆开重练，错题本按「最近一次做到这道题」判定，旧记录清理只动本人且保留最近 N 条。
 */

const mock = vi.hoisted(() => ({ lesson: vi.fn() }));

vi.mock('@/lib/ielts-listening/catalog', () => ({ getListeningLesson: mock.lesson }));
// 真实的查询构造器：清理语句要对 .toSQL() 的输出断言，链式 mock 看不出 drizzle 改写了什么。
vi.mock('@/lib/db', async () => {
  const { drizzle } = await import('drizzle-orm/node-postgres');
  return { db: drizzle.mock() };
});

import { db } from '@/lib/db';

const part1 = listeningLessons.find(lesson => lesson.slug === 'test-01-part-1')!;
const part3 = listeningLessons.find(lesson => lesson.slug === 'test-01-part-3')!;

const allCorrect = { 1: 'Krause', 2: '12 May', 3: 'six', 4: '95', 5: 'A', 6: 'B', 7: 'B', 8: '30', 9: 'Thursday', 10: 'open studio' };

let insertValues: ReturnType<typeof vi.fn>;
let deleteWhere: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.restoreAllMocks();
  mock.lesson.mockReset();
  mock.lesson.mockReturnValue(part1);
  insertValues = vi.fn().mockResolvedValue(undefined);
  deleteWhere = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(db, 'insert').mockReturnValue({ values: insertValues } as never);
  vi.spyOn(db, 'delete').mockReturnValue({ where: deleteWhere } as never);
});

describe('请求校验与范围', () => {
  it('拒绝客户端自报的分数与错题号、超量作答和超长用时', () => {
    const base = { slug: 'test-01-part-1', answers: allCorrect, durationSec: 300 };
    expect(ListeningAttemptInputSchema.safeParse({ ...base, score: 10 }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, wrongNumbers: [] }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, answers: { 1: 'a', 41: 'b' } }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, answers: { abc: 'a' } }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, answers: { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'j', 12: 'k' } }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, durationSec: -1 }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, durationSec: 4 * 3600 }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse({ ...base, slug: 'test-01-part-5' }).success).toBe(false);
    expect(ListeningAttemptInputSchema.safeParse(base).success).toBe(true);
  });

  it('范围只保留本课题号并升序；多选题只勾一题时补齐整组', () => {
    expect(normalizeListeningScope(part1, [9, 2, 2, 11])).toEqual([2, 9]);
    expect(normalizeListeningScope(part3, [29])).toEqual([29, 30]);
    expect(normalizeListeningScope(part3, [30, 22])).toEqual([22, 29, 30]);
    expect(normalizeListeningScope(part1, [21])).toEqual([]);
  });
});

describe('saveListeningAttempt', () => {
  it('全对记 10/10：分数来自服务端判分，落库后清理本人旧记录', async () => {
    const record = await saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: allCorrect, durationSec: 512 });
    expect(record).toMatchObject({
      lessonSlug: 'test-01-part-1', mode: 'full', questionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      wrongNumbers: [], score: 10, total: 10, durationSec: 512,
    });
    expect(insertValues).toHaveBeenCalledTimes(1);
    expect(insertValues.mock.calls[0][0]).toMatchObject({ userId: 'u1', score: 10, wrongNumbers: [] });
    expect(deleteWhere).toHaveBeenCalledTimes(1);
  });

  it('填空按宽松书写比较，判错的题号由服务端算出', async () => {
    const record = await saveListeningAttempt('u1', {
      slug: 'test-01-part-1', durationSec: 100,
      answers: { ...allCorrect, 1: 'krause', 3: '7', 4: '95 pounds', 7: 'C', 10: 'Open  Studio' },
    });
    expect(record).toMatchObject({ score: 8, wrongNumbers: [3, 7] });
  });

  it('错题重练只记范围内的题，范围外的作答被丢弃', async () => {
    const record = await saveListeningAttempt('u1', {
      slug: 'test-01-part-1', durationSec: 60, scope: [9, 3], answers: { ...allCorrect, 3: 'seven', 10: 'anything' },
    });
    expect(record).toMatchObject({ mode: 'custom', questionNumbers: [3, 9], total: 2, score: 1, wrongNumbers: [3] });
    const saved = insertValues.mock.calls[0][0];
    expect(saved.answers).toEqual({ 3: 'seven', 9: 'Thursday' });
  });

  it('只重练多选题的一题时按整组记录，整组全对才得分', async () => {
    mock.lesson.mockReturnValue(part3);
    const right = await saveListeningAttempt('u1', { slug: 'test-01-part-3', durationSec: 30, scope: [29], answers: { 29: 'A', 30: 'D' } });
    expect(right).toMatchObject({ questionNumbers: [29, 30], score: 2, total: 2, mode: 'custom' });
    const half = await saveListeningAttempt('u1', { slug: 'test-01-part-3', durationSec: 30, scope: [29], answers: { 29: 'A', 30: 'E' } });
    expect(half).toMatchObject({ score: 0, wrongNumbers: [29, 30] });
  });

  it('请求不合法 400、课时不存在 404、写库失败 503', async () => {
    await expect(saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: {}, durationSec: 1, score: 9 }))
      .rejects.toMatchObject({ code: 'invalid', status: 400 });
    await expect(saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: allCorrect, durationSec: 1, scope: [11] }))
      .rejects.toMatchObject({ code: 'invalid', status: 400 });
    mock.lesson.mockReturnValue(null);
    await expect(saveListeningAttempt('u1', { slug: 'test-02-part-4', answers: {}, durationSec: 1 }))
      .rejects.toMatchObject({ code: 'not_found', status: 404 });
    expect(insertValues).not.toHaveBeenCalled();

    mock.lesson.mockImplementation(() => { throw new Error('catalog exploded'); });
    await expect(saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: allCorrect, durationSec: 1 }))
      .rejects.toBeInstanceOf(ListeningAttemptError);
    mock.lesson.mockReturnValue(part1);
    insertValues.mockRejectedValue(new Error('db down'));
    await expect(saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: allCorrect, durationSec: 1 }))
      .rejects.toMatchObject({ code: 'unavailable', status: 503 });
  });

  it('清理旧记录失败不算这次练习失败', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteWhere.mockRejectedValue(new Error('lock timeout'));
    await expect(saveListeningAttempt('u1', { slug: 'test-01-part-1', answers: allCorrect, durationSec: 1 }))
      .resolves.toMatchObject({ score: 10 });
    expect(error).toHaveBeenCalled();
  });
});

describe('清理语句', () => {
  it('只删本人的、且不在最近 N 条之内的记录', () => {
    // 用真实的查询构造器看渲染结果，不用 beforeEach 里为写库准备的 spy
    vi.restoreAllMocks();
    const query = db.delete(ieltsListeningAttempts).where(listeningAttemptRetentionWhere('u1')).toSQL();
    expect(query.sql).toBe(
      'delete from "ielts_listening_attempts" where ("ielts_listening_attempts"."user_id" = $1 and "ielts_listening_attempts"."id" NOT IN ((select "id" from "ielts_listening_attempts" where "ielts_listening_attempts"."user_id" = $2 order by "ielts_listening_attempts"."created_at" desc, "ielts_listening_attempts"."id" desc limit $3)))',
    );
    expect(query.params).toEqual(['u1', 'u1', LISTENING_ATTEMPT_RETENTION]);
  });
});

/** select → from → where → orderBy → limit 链，await 时给出 rows。每一步都返回同一个可等待对象。 */
interface SelectChain {
  (selection?: unknown): SelectChain;
  from: (table?: unknown) => SelectChain;
  where: (condition?: unknown) => SelectChain;
  orderBy: (...args: unknown[]) => SelectChain;
  limit: (size: number) => SelectChain;
  then: (resolve: (value: unknown) => unknown) => Promise<unknown>;
}
function chain(rows: unknown[]) {
  const select = vi.fn() as unknown as SelectChain;
  const self = () => select;
  Object.assign(select, {
    from: vi.fn(self), where: vi.fn(self), orderBy: vi.fn(self), limit: vi.fn(self),
    then: (resolve: (value: unknown) => unknown) => Promise.resolve(rows).then(resolve),
  });
  vi.spyOn(db, 'select').mockReturnValue(select as never);
  return select;
}

describe('listListeningAttempts', () => {
  it('读取本人记录并归一 JSONB 字段与模式', async () => {
    const select = chain([
      { id: 'a', lessonSlug: 'test-01-part-1', mode: 'weird', questionNumbers: [3, 'x', 9], wrongNumbers: null, score: 1, total: 2, durationSec: 30, createdAt: '2026-11-24T10:00:00.000Z' },
    ]);
    const rows = await listListeningAttempts('u1', 5000);
    expect(select.limit).toHaveBeenCalledWith(LISTENING_ATTEMPT_RETENTION);
    expect(rows).toEqual([{
      id: 'a', lessonSlug: 'test-01-part-1', mode: 'custom', questionNumbers: [3, 9], wrongNumbers: [],
      score: 1, total: 2, durationSec: 30, createdAt: '2026-11-24T10:00:00.000Z',
    }]);
    chain([]);
    await expect(listListeningAttempts('u1', 0)).resolves.toEqual([]);
  });

  it('读库失败抛 unavailable，不伪装成空列表', async () => {
    vi.spyOn(db, 'select').mockImplementation((() => { throw new Error('db down'); }) as never);
    await expect(listListeningAttempts('u1')).rejects.toMatchObject({ code: 'unavailable', status: 503 });
  });
});

describe('buildListeningWrongBook', () => {
  const record = (partial: Partial<ListeningAttemptRecord> & Pick<ListeningAttemptRecord, 'lessonSlug' | 'questionNumbers' | 'wrongNumbers'>): ListeningAttemptRecord => ({
    id: 'x', mode: 'full', score: 0, total: partial.questionNumbers.length, durationSec: 0,
    createdAt: '2026-11-24T10:00:00.000Z', ...partial,
  });

  it('每道题以最近一次做到它的练习为准；只做过重练的课没有整篇最好成绩', () => {
    const book = buildListeningWrongBook([
      record({ lessonSlug: 'test-01-part-1', mode: 'custom', questionNumbers: [3], wrongNumbers: [], score: 1, createdAt: '2026-11-24T12:00:00.000Z' }),
      record({ lessonSlug: 'test-01-part-4', mode: 'custom', questionNumbers: [37, 38], wrongNumbers: [38], score: 1, createdAt: '2026-11-24T11:30:00.000Z' }),
      record({ lessonSlug: 'test-01-part-1', mode: 'full', questionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], wrongNumbers: [3, 7], score: 8, createdAt: '2026-11-24T10:00:00.000Z' }),
      record({ lessonSlug: 'test-01-part-1', mode: 'full', questionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], wrongNumbers: [3, 5, 7], score: 7, createdAt: '2026-11-23T10:00:00.000Z' }),
    ]);
    expect(book).toEqual([
      { lessonSlug: 'test-01-part-1', attempts: 3, bestFullScore: 8, lastPracticedAt: '2026-11-24T12:00:00.000Z', wrongNumbers: [7] },
      { lessonSlug: 'test-01-part-4', attempts: 1, bestFullScore: null, lastPracticedAt: '2026-11-24T11:30:00.000Z', wrongNumbers: [38] },
    ]);
  });

  it('错题号升序，没有记录就是空本', () => {
    expect(buildListeningWrongBook([
      record({ lessonSlug: 'test-02-part-1', questionNumbers: [2, 5, 9], wrongNumbers: [9, 2, 5] }),
    ])[0].wrongNumbers).toEqual([2, 5, 9]);
    expect(buildListeningWrongBook([])).toEqual([]);
  });
});
