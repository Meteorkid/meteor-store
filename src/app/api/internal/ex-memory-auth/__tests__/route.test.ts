import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const getSession = vi.fn();
vi.mock('@/lib/auth', () => ({ getSession: () => getSession() }));

import { GET } from '../route';

function request(token?: string) {
  return new NextRequest('https://imagentx.top/api/internal/ex-memory-auth', {
    headers: token ? { 'x-ex-memory-proxy-token': token } : undefined,
  });
}

describe('Ex-Memory 内部代理鉴权', () => {
  beforeEach(() => {
    process.env.EX_MEMORY_PROXY_TOKEN = 'proxy-secret-for-tests';
    getSession.mockReset();
  });

  it('拒绝缺失或错误的服务间密钥，且不会读取用户会话', async () => {
    for (const token of [undefined, 'wrong']) {
      const response = await GET(request(token));
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(getSession).not.toHaveBeenCalled();
  });

  it('密钥正确但没有商城会话时返回 401', async () => {
    getSession.mockResolvedValue(null);
    const response = await GET(request('proxy-secret-for-tests'));
    expect(response.status).toBe(401);
    expect(response.headers.get('x-ex-memory-user-id')).toBeNull();
  });

  it('密钥与商城会话都有效时只透出不可变用户 ID', async () => {
    getSession.mockResolvedValue({
      userId: 'user_123',
      email: 'private@example.com',
      name: '私密昵称',
      emailVerified: true,
    });

    const response = await GET(request('proxy-secret-for-tests'));

    expect(response.status).toBe(204);
    expect(response.headers.get('x-ex-memory-user-id')).toBe('user_123');
    expect([...response.headers.values()].join('\n')).not.toContain('private@example.com');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('服务端未配置密钥时失败关闭', async () => {
    delete process.env.EX_MEMORY_PROXY_TOKEN;
    const response = await GET(request('proxy-secret-for-tests'));
    expect(response.status).toBe(503);
    expect(getSession).not.toHaveBeenCalled();
  });
});
