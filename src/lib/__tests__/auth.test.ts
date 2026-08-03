import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SignJWT } from 'jose';

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

const dbState = vi.hoisted(() => ({
  user: { tokenVersion: 0, emailVerified: true } as null | {
    tokenVersion: number;
    emailVerified: boolean;
  },
  throws: false,
}));

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => {
            if (dbState.throws) throw new Error('database unavailable');
            return dbState.user ? [dbState.user] : [];
          },
        }),
      }),
    }),
  },
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
    dbState.user = { tokenVersion: 0, emailVerified: true };
    dbState.throws = false;
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    vi.unstubAllEnvs();
  });

  it('签发的会话能被自己验回来', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', name: '小明', emailVerified: true });

    const session = await getSession();
    expect(session).toMatchObject({ userId: 'U1', email: 'a@b.com', name: '小明' });
  });

  it('运行时也拒绝为未验证邮箱签发会话', async () => {
    const { createSession } = await importAuth();

    await expect(
      createSession({ userId: 'U1', email: 'a@b.com', emailVerified: false } as never),
    ).rejects.toThrow('unverified email');
    expect(jar.has(COOKIE_NAME)).toBe(false);
  });

  it('数据库中的邮箱未验证时拒绝已有会话', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true, tokenVersion: 0 });
    dbState.user = { tokenVersion: 0, emailVerified: false };

    await expect(getSession()).resolves.toBeNull();
  });

  it('数据库故障时只有带已验证声明的新会话可以降级使用', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true, tokenVersion: 0 });
    dbState.throws = true;

    await expect(getSession()).resolves.toMatchObject({
      userId: 'U1',
      emailVerified: true,
    });
  });

  it('数据库故障时旧会话缺少验证声明会 fail closed', async () => {
    const legacyToken = await new SignJWT({
      userId: 'U1',
      email: 'a@b.com',
      tokenVersion: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(SECRET));
    jar.set(COOKIE_NAME, { value: legacyToken });
    dbState.throws = true;

    const { getSession } = await importAuth();
    await expect(getSession()).resolves.toBeNull();
  });

  it('cookie 必须是 httpOnly + sameSite lax + 全站路径', async () => {
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true });

    const options = jar.get(COOKIE_NAME)?.options;
    expect(options).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/' });
  });

  it('没有 cookie 时返回 null，而不是抛错', async () => {
    const { getSession } = await importAuth();
    expect(await getSession()).toBeNull();
  });

  it('token 被篡改后校验失败，返回 null', async () => {
    const { createSession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true });

    const token = jar.get(COOKIE_NAME)!.value;
    // 改动签名部分的第一个字符；末字符可能只落在 base64url 的未使用位，
    // 字符变化后解码字节仍相同，无法稳定构造篡改 token。
    const [header, payload, signature] = token.split('.');
    const tamperedSignature = (signature[0] === 'A' ? 'B' : 'A') + signature.slice(1);
    const tampered = `${header}.${payload}.${tamperedSignature}`;
    jar.set(COOKIE_NAME, { value: tampered });

    expect(await getSession()).toBeNull();
  });

  it('换一个密钥签发的 token 不被接受（防止密钥轮换后旧会话仍可用）', async () => {
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true });

    process.env.JWT_SECRET = 'a-completely-different-secret-key-32ch!!';
    const { getSession } = await importAuth();
    expect(await getSession()).toBeNull();
  });

  it('destroySession 清掉 cookie', async () => {
    const { createSession, destroySession, getSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true });
    await destroySession();

    expect(jar.has(COOKIE_NAME)).toBe(false);
    expect(await getSession()).toBeNull();
  });

  it('未配置 JWT_SECRET 时签发直接抛错，而不是用空密钥签出可伪造的 token', async () => {
    delete process.env.JWT_SECRET;
    const { createSession } = await importAuth();
    await expect(
      createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true }),
    ).rejects.toThrow('JWT_SECRET');
  });

  it('非 production 环境不加 secure 标记，否则本地 http 下 cookie 发不出去', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { createSession } = await importAuth();
    await createSession({ userId: 'U1', email: 'a@b.com', emailVerified: true });

    expect(jar.get(COOKIE_NAME)?.options).toMatchObject({ secure: false });
  });
});
