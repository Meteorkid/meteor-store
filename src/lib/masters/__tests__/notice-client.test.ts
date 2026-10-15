import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MastersNotice } from '../types';

let client: typeof import('../notice-client');
let fetchMock: ReturnType<typeof vi.fn>;
const notice = { id: 'a'.repeat(64), readAt: null } as MastersNotice;
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
beforeEach(async () => {
  vi.resetModules();
  fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
  client = await import('../notice-client');
});
afterEach(() => vi.unstubAllGlobals());

describe('申请提醒客户端', () => {
  it('双铃铛共享请求，同一事件只强制刷新一次', async () => {
    fetchMock.mockResolvedValue(Response.json({ userId: 'a', notices: [notice] }));
    client.ensureMastersNotices('a', true); client.ensureMastersNotices('a', true);
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.getMastersNoticeState('a').notices).toEqual([notice]);
  });
  it('不接受其他账号响应，也不暴露给游客', async () => {
    fetchMock.mockResolvedValue(Response.json({ userId: 'b', notices: [notice] }));
    client.ensureMastersNotices('a'); await flush();
    expect(client.getMastersNoticeState('a')).toMatchObject({ notices: [], failed: true });
    expect(client.getMastersNoticeState(null)).toBe(client.EMPTY_MASTERS_NOTICES);
  });
  it('较旧请求不能覆盖强制刷新后的新内容', async () => {
    let resolveOld!: (response: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise<Response>(resolve => { resolveOld = resolve; }))
      .mockResolvedValueOnce(Response.json({ userId: 'a', notices: [notice] }));
    client.ensureMastersNotices('a'); client.ensureMastersNotices('a', true); await flush();
    resolveOld(Response.json({ userId: 'a', notices: [] })); await flush();
    expect(client.getMastersNoticeState('a').notices).toEqual([notice]);
  });
  it('标记后重新读取剩余未读页，并发送账号归属头', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ userId: 'a', notices: [notice] }));
    client.ensureMastersNotices('a'); await flush();
    const next = { ...notice, id: 'b'.repeat(64) };
    fetchMock.mockResolvedValueOnce(Response.json({ userId: 'a', success: true }))
      .mockResolvedValueOnce(Response.json({ userId: 'a', notices: [next] }));
    await client.markMastersRead('a', [notice.id]); await flush();
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'PATCH', headers: { 'X-Masters-User': 'a' } });
    expect(client.getMastersNoticeState('a').notices).toEqual([next]);
  });
  it('写入失败不伪装已读', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ userId: 'a', notices: [notice] }));
    client.ensureMastersNotices('a'); await flush();
    fetchMock.mockResolvedValueOnce(Response.json({ error: 'failed' }, { status: 503 }));
    await client.markMastersRead('a', [notice.id]);
    expect(client.getMastersNoticeState('a')).toEqual({ notices: [notice], failed: true, marking: false });
  });
});
