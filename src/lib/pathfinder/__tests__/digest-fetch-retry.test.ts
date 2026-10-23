import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }));

describe('全文失败重试边界', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-22T00:00:00Z'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('403失败在重试间隔内只发一次，间隔后允许恢复', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 403 }));
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    const url = 'https://agihunt.info/daily/2026-10-22.md';
    expect(await fetchDigestContent(url, 'agihunt.info')).toBeNull();
    expect(await fetchDigestContent(url, 'agihunt.info')).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.setSystemTime(new Date('2026-10-22T00:06:00Z'));
    fetchMock.mockResolvedValue(new Response('## 今日总结\n\n正文已恢复。'));
    expect(await fetchDigestContent(url, 'agihunt.info')).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('同一来源的并发访问共用正在进行的请求', async () => {
    let resolve!: (response: Response) => void;
    const response = new Promise<Response>((done) => { resolve = done; });
    const fetchMock = vi.fn(() => response);
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    const first = fetchDigestContent('https://agihunt.info/daily/2026-10-21.md', 'agihunt.info');
    const second = fetchDigestContent('https://agihunt.info/daily/2026-10-21.md', 'agihunt.info');
    resolve(new Response('', { status: 403 }));
    expect(await Promise.all([first, second])).toEqual([null, null]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(['network', 'parse-empty'])('%s 也按短间隔重试', async (failure) => {
    const fetchMock = failure === 'network'
      ? vi.fn().mockRejectedValue(new Error('timeout'))
      : vi.fn().mockImplementation(async () => new Response('没有正文结构'));
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    await fetchDigestContent('https://agihunt.info/daily/failure.md', 'agihunt.info');
    await fetchDigestContent('https://agihunt.info/daily/failure.md', 'agihunt.info');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('负缓存容量有上限，旧来源被逐出后可重试', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => new Response('', { status: 403 }));
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    for (let index = 0; index <= 512; index++) {
      await fetchDigestContent(`https://agihunt.info/daily/${index}.md`, 'agihunt.info');
    }
    await fetchDigestContent('https://agihunt.info/daily/0.md', 'agihunt.info');
    expect(fetchMock).toHaveBeenCalledTimes(514);
  });

  it('不同地址的并发连接也有上限，释放后可再次请求', async () => {
    let resolve!: (response: Response) => void;
    const response = new Promise<Response>((done) => { resolve = done; });
    const fetchMock = vi.fn(() => response);
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    const pending = Array.from({ length: 32 }, (_, index) => fetchDigestContent(
      `https://agihunt.info/daily/${index}.md`, 'agihunt.info',
    ));
    expect(await fetchDigestContent('https://agihunt.info/daily/overflow.md', 'agihunt.info')).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(32);
    resolve(new Response('', { status: 403 }));
    await Promise.all(pending);
    await fetchDigestContent('https://agihunt.info/daily/overflow.md', 'agihunt.info');
    expect(fetchMock).toHaveBeenCalledTimes(33);
  });

  it.each([
    'https://user:password@agihunt.info/daily/x.md',
    'https://agihunt.info:8443/daily/x.md',
  ])('拒绝携带凭据或额外端口的地址 %s', async (url) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    expect(await fetchDigestContent(url, 'agihunt.info')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('不跟随跳转、不替换来源，也不把失败响应存入一天的 fetch 缓存', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('redirect'));
    vi.stubGlobal('fetch', fetchMock);
    const { fetchDigestContent } = await import('../digest-content');
    expect(await fetchDigestContent('https://agihunt.info/daily/x.md', 'agihunt.info')).toBeNull();
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('https://agihunt.info/daily/x.md', expect.objectContaining({
      redirect: 'error', cache: 'no-store',
    }));
  });

  it('按UTF-8字节限制流式读取，不能用中文字符数绕过2MiB上限', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(`## 总结\n\n${'中'.repeat(800_000)}`)));
    const { fetchDigestContent } = await import('../digest-content');
    expect(await fetchDigestContent('https://agihunt.info/daily/large.md', 'agihunt.info')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(expect.objectContaining({ reason: 'too-large' }));
  });
});
