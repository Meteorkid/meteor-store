import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAccessTokenCache, uploadContentImage } from '../client';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('微信公众号 access_token 失效重试', () => {
  beforeEach(() => {
    resetAccessTokenCache();
    vi.stubEnv('WECHAT_MP_APPID', 'wx-test-appid');
    vi.stubEnv('WECHAT_MP_APPSECRET', 'test-secret');
  });

  afterEach(() => {
    resetAccessTokenCache();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('遇到 40001 时刷新 token 并重试一次请求', async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);

      if (url.includes('/cgi-bin/token')) {
        const tokenCalls = calls.filter((call) => call.includes('/cgi-bin/token')).length;
        return json({ access_token: tokenCalls === 1 ? 'stale-token' : 'fresh-token', expires_in: 7200 });
      }
      if (url.includes('access_token=stale-token')) {
        return json({ errcode: 40001, errmsg: 'invalid credential' });
      }
      return json({ url: 'https://mmbiz.qpic.cn/test-image.jpg' });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await uploadContentImage({
      bytes: new Uint8Array([1, 2, 3]),
      mime: 'image/png',
      filename: 'test.png',
    });

    expect(result).toBe('https://mmbiz.qpic.cn/test-image.jpg');
    expect(calls.filter((call) => call.includes('/cgi-bin/token'))).toHaveLength(2);
    expect(calls.at(-1)).toContain('access_token=fresh-token');
  });

  it('非 token 错误不刷新、不重试', async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes('/cgi-bin/token')) {
        return json({ access_token: 'valid-token', expires_in: 7200 });
      }
      return json({ errcode: 40164, errmsg: 'invalid ip' });
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(uploadContentImage({
      bytes: new Uint8Array([1, 2, 3]),
      mime: 'image/png',
      filename: 'test.png',
    })).rejects.toMatchObject({ code: 40164 });

    expect(calls.filter((call) => call.includes('/cgi-bin/token')).length).toBe(1);
    expect(calls.filter((call) => call.includes('/cgi-bin/media/uploadimg'))).toHaveLength(1);
  });
});
