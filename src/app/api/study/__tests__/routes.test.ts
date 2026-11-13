import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mock = vi.hoisted(() => ({
  session: vi.fn(), limit: vi.fn(),
  listCourses: vi.fn(), createCourse: vi.fn(), updateCourse: vi.fn(), deleteCourse: vi.fn(),
  listDeadlines: vi.fn(), createDeadline: vi.fn(), updateDeadline: vi.fn(), deleteDeadline: vi.fn(),
  listProblems: vi.fn(), createProblem: vi.fn(), updateProblem: vi.fn(), deleteProblem: vi.fn(),
  reviewProblem: vi.fn(), summary: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mock.session }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => 'test', rateLimit: mock.limit }));
vi.mock('@/lib/study/service', () => ({
  listStudyCourses: mock.listCourses, createStudyCourse: mock.createCourse,
  updateStudyCourse: mock.updateCourse, deleteStudyCourse: mock.deleteCourse,
  listStudyDeadlines: mock.listDeadlines, createStudyDeadline: mock.createDeadline,
  updateStudyDeadline: mock.updateDeadline, deleteStudyDeadline: mock.deleteDeadline,
  listStudyProblems: mock.listProblems, createStudyProblem: mock.createProblem,
  updateStudyProblem: mock.updateProblem, deleteStudyProblem: mock.deleteProblem,
  reviewStudyProblem: mock.reviewProblem, getStudySummary: mock.summary,
}));
import { GET as coursesGet, POST as coursesPost, PATCH as coursesPatch, DELETE as coursesDelete } from '../courses/route';
import { POST as deadlinesPost, PATCH as deadlinesPatch, DELETE as deadlinesDelete } from '../deadlines/route';
import { POST as problemsPost, PATCH as problemsPatch, DELETE as problemsDelete } from '../problems/route';
import { POST as reviewsPost } from '../reviews/route';
import { GET as summaryGet } from '../summary/route';

const courseId = '11111111-1111-4111-8111-111111111111';
const problemId = '22222222-2222-4222-8222-222222222222';
const course = { id: courseId, term: '2026-2027-1', name: '数据结构', credits: 4, score: null, status: 'in-progress', createdAt: 'x', updatedAt: 'x' };
const problem = { id: problemId, title: '两数之和', topic: '数组', difficulty: 'easy', url: null, status: 'solved', notes: null, reviewStage: 0, reviewDueOn: '2026-11-14', reviewIntervalDays: 1, lastReviewedOn: null, createdAt: 'x', updatedAt: 'x' };

function req(path: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`http://127.0.0.1:3000${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', 'X-Study-User': 'user-a', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.session.mockResolvedValue({ userId: 'user-a', emailVerified: true });
  mock.limit.mockResolvedValue({ limited: false });
  mock.listCourses.mockResolvedValue([]);
  mock.createCourse.mockResolvedValue(course);
  mock.updateCourse.mockResolvedValue(course);
  mock.deleteCourse.mockResolvedValue(true);
  mock.listDeadlines.mockResolvedValue([]);
  mock.createDeadline.mockResolvedValue({ id: 'd1' });
  mock.updateDeadline.mockResolvedValue({ id: 'd1' });
  mock.deleteDeadline.mockResolvedValue(true);
  mock.listProblems.mockResolvedValue([]);
  mock.createProblem.mockResolvedValue(problem);
  mock.updateProblem.mockResolvedValue(problem);
  mock.deleteProblem.mockResolvedValue(true);
  mock.reviewProblem.mockResolvedValue({ ...problem, reviewStage: 1 });
  mock.summary.mockResolvedValue({ dueReviews: 3, upcomingDeadlines: 1 });
});

describe('学习数据接口的身份边界', () => {
  it('游客不能读取或写入任何学习数据', async () => {
    mock.session.mockResolvedValue(null);
    const responses = await Promise.all([
      coursesGet(),
      coursesPost(req('/api/study/courses', 'POST', { term: 't', name: 'n', credits: 3 })),
      coursesPatch(req('/api/study/courses', 'PATCH', { id: courseId, name: 'n2' })),
      coursesDelete(req('/api/study/courses', 'DELETE', { id: courseId })),
      deadlinesPost(req('/api/study/deadlines', 'POST', { title: 't', kind: 'assignment', dueAt: '2026-11-20' })),
      problemsPost(req('/api/study/problems', 'POST', { title: 't', difficulty: 'easy' })),
      reviewsPost(req('/api/study/reviews', 'POST', { id: problemId, result: 'remembered' })),
      summaryGet(),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(mock.createCourse).not.toHaveBeenCalled();
    expect(mock.reviewProblem).not.toHaveBeenCalled();
  });

  it('账号切换与跨站请求不能写入', async () => {
    const wrongOwner = await coursesPost(req('/api/study/courses', 'POST', { term: 't', name: 'n', credits: 3 }, { 'X-Study-User': 'other' }));
    expect(wrongOwner.status).toBe(409);
    const crossSite = await problemsPost(req('/api/study/problems', 'POST', { title: 't', difficulty: 'easy' }, { Origin: 'https://evil.test' }));
    expect(crossSite.status).toBe(403);
    expect(mock.createCourse).not.toHaveBeenCalled();
    expect(mock.createProblem).not.toHaveBeenCalled();
  });

  it('限流生效时不落库', async () => {
    mock.limit.mockResolvedValue({ limited: true });
    expect((await coursesPost(req('/api/study/courses', 'POST', { term: 't', name: 'n', credits: 3 }))).status).toBe(429);
    expect((await reviewsPost(req('/api/study/reviews', 'POST', { id: problemId, result: 'forgot' }))).status).toBe(429);
    expect(mock.createCourse).not.toHaveBeenCalled();
    expect(mock.reviewProblem).not.toHaveBeenCalled();
  });

  it('GET 只返回会话账号的数据且不缓存', async () => {
    const response = await coursesGet();
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect((await response.json()).userId).toBe('user-a');
    expect(mock.listCourses).toHaveBeenCalledWith('user-a');
  });
});

describe('学习数据接口的校验与错误映射', () => {
  it('无效输入返回 400 且不调用服务层', async () => {
    expect((await coursesPost(req('/api/study/courses', 'POST', { term: '', name: 'n', credits: 3 }))).status).toBe(400);
    expect((await coursesPost(req('/api/study/courses', 'POST', { term: 't', name: 'n', credits: 0.3 }))).status).toBe(400);
    expect((await deadlinesPost(req('/api/study/deadlines', 'POST', { title: 't', kind: 'exam', dueAt: '2026-02-30' }))).status).toBe(400);
    expect((await problemsPost(req('/api/study/problems', 'POST', { title: 't', difficulty: 'hard', url: 'http://insecure.test' }))).status).toBe(400);
    expect((await reviewsPost(req('/api/study/reviews', 'POST', { id: problemId, result: 'later' }))).status).toBe(400);
    expect((await coursesPatch(req('/api/study/courses', 'PATCH', { name: '没有 id' }))).status).toBe(400);
    expect(mock.createCourse).not.toHaveBeenCalled();
    expect(mock.createDeadline).not.toHaveBeenCalled();
    expect(mock.createProblem).not.toHaveBeenCalled();
    expect(mock.reviewProblem).not.toHaveBeenCalled();
  });

  it('归属不符或不存在时返回 404', async () => {
    mock.updateCourse.mockResolvedValue(null);
    mock.createDeadline.mockResolvedValue(null);
    mock.updateProblem.mockResolvedValue(null);
    mock.reviewProblem.mockResolvedValue(null);
    expect((await coursesPatch(req('/api/study/courses', 'PATCH', { id: courseId, name: 'n2' }))).status).toBe(404);
    expect((await deadlinesPost(req('/api/study/deadlines', 'POST', { title: 't', kind: 'assignment', dueAt: '2026-11-20', courseId }))).status).toBe(404);
    expect((await problemsPatch(req('/api/study/problems', 'PATCH', { id: problemId, status: 'solved' }))).status).toBe(404);
    expect((await reviewsPost(req('/api/study/reviews', 'POST', { id: problemId, result: 'remembered' }))).status).toBe(404);
  });

  it('服务层异常返回 503，不伪装成空数据', async () => {
    mock.listCourses.mockRejectedValue(new Error('offline'));
    const response = await coursesGet();
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('合法写入落到会话账号', async () => {
    const created = await coursesPost(req('/api/study/courses', 'POST', { term: '2026-2027-1', name: '数据结构', credits: 4 }));
    expect(created.status).toBe(200);
    expect(mock.createCourse).toHaveBeenCalledWith('user-a', expect.objectContaining({ name: '数据结构' }));
    const reviewed = await reviewsPost(req('/api/study/reviews', 'POST', { id: problemId, result: 'remembered' }));
    expect(reviewed.status).toBe(200);
    expect(mock.reviewProblem).toHaveBeenCalledWith('user-a', { id: problemId, result: 'remembered' });
    const deleted = await deadlinesDelete(req('/api/study/deadlines', 'DELETE', { id: courseId }));
    expect(deleted.status).toBe(200);
    expect(mock.deleteDeadline).toHaveBeenCalledWith('user-a', courseId);
    const patchedDeadline = await deadlinesPatch(req('/api/study/deadlines', 'PATCH', { id: courseId, status: 'done' }));
    expect(patchedDeadline.status).toBe(200);
    expect(mock.updateDeadline).toHaveBeenCalledWith('user-a', { id: courseId, status: 'done' });
    const deletedProblem = await problemsDelete(req('/api/study/problems', 'DELETE', { id: problemId }));
    expect(deletedProblem.status).toBe(200);
    expect(mock.deleteProblem).toHaveBeenCalledWith('user-a', problemId);
  });

  it('摘要只返回当前账号的计数', async () => {
    const response = await summaryGet();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 'user-a', dueReviews: 3, upcomingDeadlines: 1 });
    expect(mock.summary).toHaveBeenCalledWith('user-a');
  });
});

afterEach(() => vi.unstubAllEnvs());
