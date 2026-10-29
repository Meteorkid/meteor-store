import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdmissionsNoticeClient } from '../notice-client';
import type { MastersNotice } from '@/lib/masters/types';

const notice = { id: 'a'.repeat(64), readAt: null } as MastersNotice;
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
let request: ReturnType<typeof vi.fn>;
beforeEach(() => { request = vi.fn(); vi.stubGlobal('fetch', request); });
afterEach(() => vi.unstubAllGlobals());

describe('硕博提醒客户端隔离', () => {
  it('相同账号和通知ID仍分别请求、缓存，不互相去重', async () => {
    const masters = createAdmissionsNoticeClient('masters');
    const phd = createAdmissionsNoticeClient('phd');
    request.mockImplementation(async () => Response.json({ userId: 'user-a', notices: [notice] }));
    masters.ensureNotices('user-a'); masters.ensureNotices('user-a');
    phd.ensureNotices('user-a'); phd.ensureNotices('user-a');
    await flush();
    expect(request.mock.calls.map(call => call[0])).toEqual(['/api/masters/notices', '/api/phd/notices']);
    expect(masters.getNoticeState('user-a').notices).toEqual([notice]);
    expect(phd.getNoticeState('user-a').notices).toEqual([notice]);
    expect(phd.getNoticeState(null)).toBe(phd.EMPTY_NOTICES);
  });

  it('标记博士已读只使用博士归属头，不改硕士未读', async () => {
    const masters = createAdmissionsNoticeClient('masters');
    const phd = createAdmissionsNoticeClient('phd');
    request.mockImplementation(async () => Response.json({ userId: 'user-a', notices: [notice] }));
    masters.ensureNotices('user-a'); phd.ensureNotices('user-a'); await flush();
    request.mockResolvedValueOnce(Response.json({ userId: 'user-a', success: true }))
      .mockResolvedValueOnce(Response.json({ userId: 'user-a', notices: [] }));
    await phd.markRead('user-a', [notice.id]); await flush();
    expect(request.mock.calls[2]).toEqual(['/api/phd/notices', expect.objectContaining({
      method: 'PATCH', headers: { 'Content-Type': 'application/json', 'X-Phd-User': 'user-a' },
    })]);
    expect(phd.getNoticeState('user-a').notices).toEqual([]);
    expect(masters.getNoticeState('user-a').notices).toEqual([notice]);
  });

  it('博士响应账号不符时失败，不能暴露给新账号或影响硕士状态', async () => {
    const masters = createAdmissionsNoticeClient('masters');
    const phd = createAdmissionsNoticeClient('phd');
    request.mockResolvedValueOnce(Response.json({ userId: 'user-a', notices: [notice] }))
      .mockResolvedValueOnce(Response.json({ userId: 'user-b', notices: [notice] }));
    masters.ensureNotices('user-a'); phd.ensureNotices('user-a'); await flush();
    expect(phd.getNoticeState('user-a')).toMatchObject({ failed: true, notices: [] });
    expect(phd.getNoticeState('user-b')).toBe(phd.EMPTY_NOTICES);
    expect(masters.getNoticeState('user-a').notices).toEqual([notice]);
  });

  it('博士刷新后忽略旧请求，保留新的已读状态', async () => {
    const phd = createAdmissionsNoticeClient('phd');
    let resolveOld!: (response: Response) => void;
    request.mockReturnValueOnce(new Promise<Response>(resolve => { resolveOld = resolve; }))
      .mockResolvedValueOnce(Response.json({ userId: 'user-a', notices: [] }));
    phd.ensureNotices('user-a'); phd.ensureNotices('user-a', true); await flush();
    resolveOld(Response.json({ userId: 'user-a', notices: [notice] })); await flush();
    expect(phd.getNoticeState('user-a').notices).toEqual([]);
  });
});
