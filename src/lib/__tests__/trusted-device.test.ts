import { beforeEach, describe, expect, it } from 'vitest';
import { SignJWT } from 'jose';

import {
  createTrustedDeviceToken,
  isTrustedDeviceToken,
  trustedDeviceCookieOptions,
} from '../trusted-device';

const USER = 'U1';

describe('受信任设备令牌', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'jwt-secret-for-tests-0123456789ab';
  });

  it('本人 + 相同 tokenVersion 才认', async () => {
    const token = await createTrustedDeviceToken(USER, 3);
    await expect(isTrustedDeviceToken(token, USER, 3)).resolves.toBe(true);
  });

  it('换个用户在同一浏览器登录，不算受信任设备', async () => {
    const token = await createTrustedDeviceToken(USER, 3);
    await expect(isTrustedDeviceToken(token, 'U2', 3)).resolves.toBe(false);
  });

  it('改密码（tokenVersion 递增）后全部受信任设备失效', async () => {
    const token = await createTrustedDeviceToken(USER, 3);
    await expect(isTrustedDeviceToken(token, USER, 4)).resolves.toBe(false);
  });

  it('没有 cookie、空值、乱码都判为不可信', async () => {
    await expect(isTrustedDeviceToken(undefined, USER, 0)).resolves.toBe(false);
    await expect(isTrustedDeviceToken('', USER, 0)).resolves.toBe(false);
    await expect(isTrustedDeviceToken('garbage', USER, 0)).resolves.toBe(false);
  });

  it('轮换 JWT_SECRET 后旧设备令牌失效', async () => {
    const token = await createTrustedDeviceToken(USER, 0);
    process.env.JWT_SECRET = '轮换后的新密钥-0123456789abcdef';
    await expect(isTrustedDeviceToken(token, USER, 0)).resolves.toBe(false);
  });

  it('拿别种用途的令牌冒充设备令牌不成立（audience/密钥隔离）', async () => {
    // 用 MFA 挑战票的派生密钥和 audience 签一张，不能被设备校验接受
    const foreign = await new SignJWT({ tokenVersion: 0, typ: 'mfa-challenge' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('meteor-store')
      .setAudience('mfa-challenge')
      .setSubject(USER)
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(`${process.env.JWT_SECRET}:mfa-challenge`));

    await expect(isTrustedDeviceToken(foreign, USER, 0)).resolves.toBe(false);
  });

  it('cookie 是 httpOnly + lax，有效期 30 天', () => {
    const o = trustedDeviceCookieOptions();
    expect(o.httpOnly).toBe(true);
    expect(o.sameSite).toBe('lax');
    expect(o.maxAge).toBe(60 * 60 * 24 * 30);
  });
});
