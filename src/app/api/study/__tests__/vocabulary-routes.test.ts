import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { VocabularySnapshot } from '@/lib/study/vocabulary-types';

const mock = vi.hoisted(() => ({
  session: vi.fn(), limit: vi.fn(), list: vi.fn(), find: vi.fn(), save: vi.fn(), remove: vi.fn(), review: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mock.session }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => 'test-ip', rateLimit: mock.limit }));
vi.mock('@/lib/study/vocabulary-service', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/study/vocabulary-service')>(),
  listVocabulary: mock.list, findVocabularyBySourceKey: mock.find, saveVocabulary: mock.save,
  deleteVocabulary: mock.remove, reviewVocabulary: mock.review,
}));

import { GET, POST, DELETE } from '../vocabulary/route';
import { POST as reviewPost } from '../vocabulary/reviews/route';
import { issueVocabularyReceipt } from '@/lib/ielts/vocabulary-receipt';
import { VocabularyConflictError, VocabularyInputError } from '@/lib/study/vocabulary-service';

const id = '11111111-1111-4111-8111-111111111111';
const snapshot: VocabularySnapshot = {
  word: 'bank', lemma: 'bank', partOfSpeech: 'noun', meaningZh: '银行', usageZh: '', source: 'ai',
  sentence: 'The bank is open.', sentenceZh: null, pairSlug: 'local-banks',
  titleZh: '本地银行', titleEn: 'Local banks', side: 'high', segmentIndex: 0,
};
const entry = { id, snapshot, revision: 1 };
const review = { id, expectedRevision: 1, result: 'remembered' };
function req(method = 'GET', body?: unknown, headers: Record<string, string> = {}, query = '') {
  return new NextRequest(`http://127.0.0.1:3000/api/study/vocabulary${query}`, {
    method, headers: { Origin: 'http://127.0.0.1:3000', 'X-Study-User': 'user-a', ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
function saveInput() { return { saveToken: issueVocabularyReceipt(snapshot)!.saveToken }; }
async function expectError(response: Response, status: number, error: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toEqual({ error });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('JWT_SECRET', 'test-only-vocabulary-api-key');
  mock.session.mockResolvedValue({ userId: 'user-a' });
  mock.limit.mockResolvedValue({ limited: false });
  mock.list.mockResolvedValue({ entries: [entry], total: 1, dueCount: 0, nextCursor: null });
  mock.find.mockResolvedValue(entry);
  mock.save.mockResolvedValue({ entry, created: true });
  mock.remove.mockResolvedValue(true);
  mock.review.mockResolvedValue({ ...entry, revision: 2 });
});
afterEach(() => vi.unstubAllEnvs());

describe('生词API身份与凭据边界', () => {
  it('游客所有入口均401，响应均no-store', async () => {
    mock.session.mockResolvedValue(null);
    for (const response of await Promise.all([
      GET(req()), POST(req('POST', saveInput())), DELETE(req('DELETE', { id })), reviewPost(req('POST', review)),
    ])) await expectError(response, 401, 'unauthorized');
    expect(mock.list).not.toHaveBeenCalled();
    expect(mock.save).not.toHaveBeenCalled();
  });

  it.each([
    ['POST', POST, () => saveInput()], ['DELETE', DELETE, () => ({ id })], ['POST', reviewPost, () => review],
  ] as const)('%s写操作拒绝跨站及已切换账号', async (method, handler, input) => {
    await expectError(await handler(req(method, input(), { Origin: 'https://evil.test' })), 403, 'forbidden');
    await expectError(await handler(req(method, input(), { 'X-Study-User': 'other-user' })), 409, 'account_changed');
    await expectError(await handler(req(method, input(), { 'X-Study-User': '' })), 409, 'account_changed');
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.remove).not.toHaveBeenCalled();
    expect(mock.review).not.toHaveBeenCalled();
  });

  it('签名快照保存到当前会话账号，客户端不能附加快照或伪造userId', async () => {
    const input = saveInput();
    const response = await POST(req('POST', input));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 'user-a', entry, created: true });
    expect(mock.save).toHaveBeenCalledWith('user-a', snapshot);
    await expectError(await POST(req('POST', { ...input, snapshot })), 400, 'invalid');
    await expectError(await POST(req('POST', { ...input, userId: 'other-user' })), 400, 'invalid');
    expect(mock.save).toHaveBeenCalledTimes(1);
  });

  it('篡改或过期签名不落库；重复收藏返回created:false', async () => {
    await expectError(await POST(req('POST', { saveToken: `${saveInput().saveToken}x` })), 400, 'invalid_receipt');
    expect(mock.save).not.toHaveBeenCalled();
    mock.save.mockResolvedValue({ entry, created: false });
    expect(await (await POST(req('POST', saveInput()))).json()).toEqual({ userId: 'user-a', entry, created: false });
  });

  it('所有入口限流，未配置Redis也使用内存限流', async () => {
    mock.limit.mockResolvedValue({ limited: true });
    for (const response of await Promise.all([
      GET(req()), POST(req('POST', saveInput())), DELETE(req('DELETE', { id })), reviewPost(req('POST', review)),
    ])) await expectError(response, 429, 'rate_limited');
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.review).not.toHaveBeenCalled();
    for (const call of mock.limit.mock.calls) expect(call[3]).toEqual({ fallback: 'memory' });
  });
});

describe('列表、删除及复习协议', () => {
  it('服务器过滤和游标参数完整下传，列表带owner', async () => {
    const response = await GET(req('GET', undefined, {}, '?query=bank&dueOnly=1&cursor=opaque&limit=25'));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect((await response.json()).userId).toBe('user-a');
    expect(mock.list).toHaveBeenCalledWith('user-a', { query: 'bank', dueOnly: true, cursor: 'opaque', limit: 25 });
  });

  it('按来源键只找当前账号的收藏', async () => {
    const sourceKey = issueVocabularyReceipt(snapshot)!.sourceKey;
    const response = await GET(req('GET', undefined, {}, `?sourceKey=${sourceKey}`));
    expect(await response.json()).toEqual({ userId: 'user-a', entry });
    expect(mock.find).toHaveBeenCalledWith('user-a', sourceKey);
    expect(mock.list).not.toHaveBeenCalled();
    await expectError(await GET(req('GET', undefined, {}, '?sourceKey=bad')), 400, 'invalid');
  });

  it.each(['?limit=101', '?limit=no', '?dueOnly=maybe', '?cursor=', `?query=${'a'.repeat(121)}`])('非法筛选不访问服务 %s', async query => {
    await expectError(await GET(req('GET', undefined, {}, query)), 400, 'invalid');
    expect(mock.list).not.toHaveBeenCalled();
  });

  it('坏游标返回400、数据库和身份依赖故障返回503，不能伪装空列表', async () => {
    mock.list.mockRejectedValueOnce(new VocabularyInputError());
    await expectError(await GET(req()), 400, 'invalid');
    mock.list.mockRejectedValueOnce(new Error('private database detail'));
    await expectError(await GET(req()), 503, 'unavailable');
    mock.session.mockRejectedValueOnce(new Error('session backend unavailable'));
    await expectError(await DELETE(req('DELETE', { id })), 503, 'unavailable');
  });

  it('删除响应带owner，只向服务传递当前账号', async () => {
    expect(await (await DELETE(req('DELETE', { id }))).json()).toEqual({ userId: 'user-a', success: true });
    expect(mock.remove).toHaveBeenCalledWith('user-a', id);
  });

  it('复习必须携带版本号；找不到404、到期或版本冲突409', async () => {
    await expectError(await reviewPost(req('POST', { id, result: 'remembered' })), 400, 'invalid');
    await expectError(await reviewPost(req('POST', { ...review, expectedRevision: 0 })), 400, 'invalid');
    const response = await reviewPost(req('POST', review));
    expect(await response.json()).toEqual({ userId: 'user-a', entry: { ...entry, revision: 2 } });
    expect(mock.review).toHaveBeenCalledWith('user-a', review);
    mock.review.mockResolvedValueOnce(null);
    await expectError(await reviewPost(req('POST', review)), 404, 'not_found');
    mock.review.mockRejectedValueOnce(new VocabularyConflictError());
    await expectError(await reviewPost(req('POST', review)), 409, 'review_conflict');
  });
});

describe('有界流读取', () => {
  it.each([
    [POST, 16 * 1024 + 128], [DELETE, 1024], [reviewPost, 1024],
  ] as const)('无Content-Length的请求超限立即取消', async (handler, limit) => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) { controller.enqueue(new Uint8Array(limit + 1)); }, cancel,
    });
    const request = new Request('http://127.0.0.1:3000/api/study/vocabulary', {
      method: 'POST', headers: { Origin: 'http://127.0.0.1:3000', 'X-Study-User': 'user-a' }, body, duplex: 'half',
    } as RequestInit) as NextRequest;
    await expectError(await handler(request), 400, 'invalid');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.review).not.toHaveBeenCalled();
  });

  it('声明超限、空请求体、损坏JSON均400', async () => {
    await expectError(await POST(req('POST', saveInput(), { 'content-length': '20000' })), 400, 'invalid');
    await expectError(await DELETE(req('DELETE')), 400, 'invalid');
    const request = new NextRequest('http://127.0.0.1:3000/api/study/vocabulary', {
      method: 'POST', headers: { 'X-Study-User': 'user-a' }, body: '{',
    });
    await expectError(await reviewPost(request), 400, 'invalid');
  });
});
