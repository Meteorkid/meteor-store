import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/** 用一个内存 cookie jar 替代 next/headers，能观察写入的属性 */
const jar = new Map<string, { value: string; options?: Record<string, unknown> }>();
const mockCookies = {
  get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)!.value } : undefined),
  set: (name: string, value: string, options?: Record<string, unknown>) => {
    jar.set(name, { value, options });
  },
  delete: (name: string) => {
    jar.delete(name);
  },
};

vi.mock('next/headers', () => ({
  cookies: async () => mockCookies,
}));

const COOKIE_NAME = 'ms_session';
const SECRET = 'test-secret-at-least-32-characters-long!!';

async function importAuth() {
  vi.resetModules();
  return import('../auth');
}

describe('auth session', () => {
  beforeEach(() => {
    jar.clear();
    process.env.JWT_SECRET = SECRET;
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    vi.unstubAllEnvs();
  });

  it('签发的会话能被自己验回来', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', name: '小明' });

    const session = await getSession();
    expect(session).toMatchObject({ userId: 'U1', email: 'a@b.com', name: '小明' });
  });

  it('cookie 必须是 httpOnly + sameSite lax + 全站路径', async () => {
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com' });

    const options = jar.get(COOKIE_NAME)?.options;
    expect(options).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/' });
  });

  it('没有 cookie 时返回 null，而不是抛错', async () => {
    const { getSession } = await importAuth();
    expect(await getSession()).toBeNull();
  });

  it('token 被篡改后校验失败，返回 null', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com' });

    const token = jar.get(COOKIE_NAME)!.value;
    // 改动签名部分的最后一个字符
    const tampered = token.slice(0, -1) + (token.at(-1) === 'A' ? 'B' : 'A');
    jar.set(COOKIE_NAME, { value: tampered });

    expect(await getSession()).toBeNull();
  });

  it('换一个密钥签发的 token 不被接受（防止密钥轮换后旧会话仍可用）', async () => {
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com' });

    process.env.JWT_SECRET = 'a-completely-different-secret-key-32ch!!';
    const { getSession } = await importAuth();
    expect(await getSession()).toBeNull();
  });

  it('destroySession 清掉 cookie', async () => {
    const { createSession, destroySession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com' });
    await destroySession();

    expect(jar.has(COOKIE_NAME)).toBe(false);
    expect(await getSession()).toBeNull();
  });

  it('未配置 JWT_SECRET 时签发直接抛错，而不是用空密钥签出可伪造的 token', async () => {
    delete process.env.JWT_SECRET;
    const { createSession } = await importAuth();
    await expect(createSession({ userId: 'U1', email: 'a@b.com' })).rejects.toThrow('JWT_SECRET');
  });

  it('非 production 环境不加 secure 标记，否则本地 http 下 cookie 发不出去', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com' });

    expect(jar.get(COOKIE_NAME)?.options).toMatchObject({ secure: false });
  });
});
