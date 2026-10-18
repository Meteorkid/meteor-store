import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  sequence: 0, user: {} as Record<string, unknown>, passwordMatches: true, codeMatches: true,
  createSession: vi.fn(), compare: vi.fn(), update: vi.fn(), insert: vi.fn(), selects: 0,
  rateCalls: [] as Array<{ key: string; limit: number; windowMs: number; options: unknown }>,
}));
vi.mock('@/lib/auth', () => ({ createSession: state.createSession, getSession: async () => ({ userId: state.user.id, email: state.user.email, emailVerified: true }) }));
vi.mock('bcryptjs', () => ({ compare: async (...args: unknown[]) => { state.compare(...args); return state.passwordMatches; }, hash: async () => 'dummy-hash' }));
vi.mock('@/lib/redis', () => ({ getRedis: () => null }));
vi.mock('@/lib/rate-limit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/rate-limit')>();
  return { ...actual, getClientIp: (req: Request) => req.headers.get('x-test-ip') ?? '203.0.113.1',
    rateLimit: (...args: Parameters<typeof actual.rateLimit>) => {
      state.rateCalls.push({ key: args[0], limit: args[1], windowMs: args[2], options: args[3] });
      return actual.rateLimit(...args);
    },
  };
});
vi.mock('@/lib/totp', () => ({ decryptTotpSecret: () => 'SECRET', verifyTotp: () => state.codeMatches, hashRecoveryCode: () => 'hash', encryptTotpSecret: vi.fn(), generateRecoveryCodes: vi.fn(), generateTotpSecret: vi.fn() }));
vi.mock('@/lib/db', () => ({ db: {
  select: (columns?: Record<string, unknown>) => {
    state.selects++;
    return { from: () => ({ where: () => ({ limit: async () => columns && Object.keys(columns).length === 1 ? [] : [{ ...state.user }] }) }) };
  },
  update: () => ({ set: (values: unknown) => ({ where: async () => { state.update(values); } }) }),
  insert: () => ({ values: async (values: unknown) => { state.insert(values); } }),
} }));
vi.mock('@/lib/email-verification', () => ({ createEmailVerificationToken: async () => 'verify-token', createEmailVerificationResendTicket: async () => 'resend-ticket' }));
vi.mock('@/lib/email', () => ({ isEmailDeliveryConfigured: () => true, sendEmailVerification: vi.fn() }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: vi.fn() }));
vi.mock('@/lib/admin', () => ({ isAdminEmail: () => false, isAdminSession: () => true }));

import { POST as bind } from '../route';
import { POST as mfa } from '../../../mfa/route';
import { POST as login } from '../../../login/route';
import { POST as adminMfa } from '../../../../admin/mfa/route';
import { createWechatBindToken, WECHAT_BIND_COOKIE } from '@/lib/wechat-bind';
import { createMfaChallengeTicket, MFA_CHALLENGE_COOKIE } from '@/lib/admin-mfa';
import { TRUSTED_DEVICE_COOKIE } from '@/lib/trusted-device';
const transaction = 'A'.repeat(43);

function request(path: string, body: Record<string, unknown>, ip = '203.0.113.1') {
  return new NextRequest(`http://localhost:3000/api/auth/${path}`, {
    method: 'POST', headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json', 'x-test-ip': `${state.sequence}-${ip}` }, body: JSON.stringify(body),
  });
}
async function bindRequest(body: Record<string, unknown> = {}, ip?: string) {
  const token = await createWechatBindToken({ openid: `openid-${state.sequence}` }, transaction);
  const req = request('wechat/bind', { token, email: state.user.email, password: 'password', ...body }, ip);
  req.cookies.set(WECHAT_BIND_COOKIE, transaction);
  return req;
}
async function ticket() {
  return createMfaChallengeTicket({ userId: state.user.id as string, email: state.user.email as string, tokenVersion: 0 });
}
beforeEach(() => {
  vi.clearAllMocks();
  state.sequence++;
  state.user = { id: `U-${state.sequence}`, email: `user-${state.sequence}@example.com`, name: 'Meteor', passwordHash: 'stored-hash', tokenVersion: 0, emailVerified: true, totpEnabled: false, totpSecretEnc: 'encrypted', totpRecoveryCodes: '[]' };
  state.passwordMatches = true; state.codeMatches = true; state.selects = 0; state.rateCalls.length = 0;
  process.env.JWT_SECRET = 'wechat-route-budget-test-secret';
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterEach(() => { vi.restoreAllMocks(); });

describe('微信绑定 API 的浏览器事务边界', () => {
  it.each(['missing', 'mismatch'])('转发最终绑定链接：%s cookie 时在查库和验密前拒绝', async (kind) => {
    const req = await bindRequest();
    if (kind === 'missing') req.cookies.delete(WECHAT_BIND_COOKIE);
    else req.cookies.set(WECHAT_BIND_COOKIE, 'B'.repeat(43));
    expect((await bind(req)).status).toBe(400);
    expect(state.selects).toBe(0);
    expect(state.compare).not.toHaveBeenCalled();
    expect(state.update).not.toHaveBeenCalled();
    expect(state.createSession).not.toHaveBeenCalled();
  });
  it('验密失败保留事务，重试成功绑定后清除 cookie', async () => {
    state.passwordMatches = false;
    const failed = await bind(await bindRequest());
    expect(failed.status).toBe(401);
    expect(failed.cookies.get(WECHAT_BIND_COOKIE)).toBeUndefined();
    state.passwordMatches = true;
    const success = await bind(await bindRequest());
    expect(success.status).toBe(200);
    expect(success.cookies.get(WECHAT_BIND_COOKIE)?.value).toBe('');
    expect(state.update).toHaveBeenCalledOnce();
    expect(state.createSession).toHaveBeenCalledOnce();
  });
  it('未验证邮箱不能绑定或签发会话', async () => {
    state.user.emailVerified = false;
    expect((await bind(await bindRequest())).status).toBe(403);
    expect(state.update).not.toHaveBeenCalled();
    expect(state.createSession).not.toHaveBeenCalled();
  });
  it('绑定开启 MFA 的账号必须完成第二因子，错误允许原事务重试', async () => {
    state.user.totpEnabled = true;
    expect((await bind(await bindRequest())).status).toBe(403);
    state.codeMatches = false;
    const wrong = await bind(await bindRequest({ mfaCode: '999999' }));
    expect(wrong.status).toBe(401);
    expect(wrong.cookies.get(WECHAT_BIND_COOKIE)).toBeUndefined();
    expect(state.createSession).not.toHaveBeenCalled();
    state.codeMatches = true;
    expect((await bind(await bindRequest({ mfaCode: '123456' }))).status).toBe(200);
    expect(state.rateCalls.filter(call => call.key === `mfa-verify:user:${state.user.id}`)).toHaveLength(2);
  });
  it('注册仍先验证邮箱，不签发会话，并清理完成的绑定事务', async () => {
    const res = await bind(await bindRequest({ mode: 'register' }));
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ verificationRequired: true, resendTicket: 'resend-ticket' });
    expect(state.insert).toHaveBeenCalledWith(expect.objectContaining({ emailVerified: false }));
    expect(state.createSession).not.toHaveBeenCalled();
    expect(res.cookies.get(WECHAT_BIND_COOKIE)?.value).toBe('');
  });
});

describe('没有 Redis 时仍共享账号预算', () => {
  it('微信绑定和主登录共用规范化邮箱的 10 次 / 15 分钟预算，换 IP 无效', async () => {
    state.passwordMatches = false;
    const email = `  ${(state.user.email as string).toUpperCase()} `;
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = attempt % 2 === 0
        ? await bind(await bindRequest({ email }, `ip-${attempt}`))
        : await login(request('login', { email, password: 'wrong' }, `ip-${attempt}`));
      expect(response.status).toBe(401);
    }
    expect(state.compare).toHaveBeenCalledTimes(10);
    expect((await bind(await bindRequest({ email }, 'last-bind'))).status).toBe(429);
    expect((await login(request('login', { email, password: 'wrong' }, 'last-login'))).status).toBe(429);
    expect(state.compare).toHaveBeenCalledTimes(10);
    expect(state.rateCalls.filter(call => call.key === `login:email:${state.user.email}`)).toHaveLength(12);
    expect(state.rateCalls.find(call => call.key === `login:email:${state.user.email}`)).toMatchObject({ limit: 10, windowMs: 900_000, options: { failClosed: true, fallback: 'memory' } });
  });
  it('挑战票 body/cookie 与微信绑定共用第二因子用户预算，每次仅扣一次', async () => {
    state.user.totpEnabled = true; state.codeMatches = false;
    const challenge = await ticket();
    for (let attempt = 0; attempt < 10; attempt++) {
      let res;
      if (attempt % 2 === 0) res = await bind(await bindRequest({ mfaCode: '999999' }, `ip-${attempt}`));
      else {
        const req = request('mfa', { code: '999999', ...(attempt % 4 === 1 ? { mfaTicket: challenge } : {}) }, `ip-${attempt}`);
        req.cookies.set(MFA_CHALLENGE_COOKIE, challenge);
        res = await mfa(req);
      }
      expect(res.status).toBe(401);
    }
    expect((await mfa(request('mfa', { mfaTicket: challenge, code: '999999' }, 'last-mfa'))).status).toBe(429);
    expect((await bind(await bindRequest({ mfaCode: '999999' }, 'last-bind'))).status).toBe(429);
    expect(state.rateCalls.filter(call => call.key === `mfa-verify:user:${state.user.id}`)).toHaveLength(12);
    expect(state.update).not.toHaveBeenCalled();
    expect(state.createSession).not.toHaveBeenCalled();
  });
  it('主登录 IP 耗尽后拒绝请求，不再为攻击者提交的新邮箱创建窗口', async () => {
    state.passwordMatches = false;
    for (let i = 0; i < 30; i++) {
      const res = await login(request('login', { email: `filler-${i}@example.com`, password: 'wrong' }));
      expect(res.status).toBe(i < 10 ? 401 : 429);
    }
    expect(state.rateCalls.filter(call => call.key.startsWith('login:email:'))).toHaveLength(10);
    expect(state.compare).toHaveBeenCalledTimes(10);
  });
  it('登录 MFA 耗尽账号预算后，管理员关闭动作也不能换 IP 绕过', async () => {
    state.user.totpEnabled = true; state.codeMatches = false;
    const challenge = await ticket();
    for (let i = 0; i < 10; i++) {
      expect((await mfa(request('mfa', { mfaTicket: challenge, code: '999999' }, `mfa-${i}`))).status).toBe(401);
    }
    // 即使这次带有效验证码，耗尽后的关闭入口也必须先拒绝。
    state.codeMatches = true;
    for (let i = 0; i < 2; i++) {
      const req = request('unused', { action: 'disable', code: '123456' }, `admin-${i}`);
      expect((await adminMfa(req)).status).toBe(429);
    }
    expect(state.update).not.toHaveBeenCalled();
    expect(state.rateCalls.filter(call => call.key === `mfa-verify:user:${state.user.id}`)).toHaveLength(12);
  });
  it('单来源 IP 预算保留，不能无限切换邮箱尝试', async () => {
    state.passwordMatches = false;
    for (let i = 0; i < 10; i++) expect((await bind(await bindRequest({ email: `other${i}@example.com` }))).status).toBe(401);
    expect((await bind(await bindRequest({ email: 'last@example.com' }))).status).toBe(429);
    expect(state.compare).toHaveBeenCalledTimes(10);
  });
});

describe('MFA 挑战合法行为与身份重查', () => {
  it('无效 ticket 不产生任何账号预算或查询', async () => {
    expect((await mfa(request('mfa', { mfaTicket: 'bad-ticket', code: '123456' }))).status).toBe(401);
    expect(state.selects).toBe(0);
    expect(state.rateCalls.some(call => call.key.startsWith('mfa-verify:user:'))).toBe(false);
  });
  it('账号版本过期或邮箱未验证时不能用旧挑战恢复会话', async () => {
    const challenge = await ticket();
    state.user.tokenVersion = 1;
    expect((await mfa(request('mfa', { mfaTicket: challenge, code: '123456' }))).status).toBe(401);
    state.user.tokenVersion = 0; state.user.emailVerified = false;
    expect((await mfa(request('mfa', { mfaTicket: challenge, code: '123456' }))).status).toBe(401);
    expect(state.createSession).not.toHaveBeenCalled();
  });
  it('真正通过第二因子才签发受信任设备，关闭 MFA 的兼容分支不发', async () => {
    state.user.totpEnabled = true;
    const challenge = await ticket();
    const verified = await mfa(request('mfa', { mfaTicket: challenge, code: '123456', rememberDevice: true }));
    expect(verified.status).toBe(200);
    expect(verified.cookies.get(TRUSTED_DEVICE_COOKIE)?.value).toBeTruthy();
    expect(verified.cookies.get(MFA_CHALLENGE_COOKIE)?.value).toBe('');
    state.user.totpEnabled = false;
    const disabled = await mfa(request('mfa', { mfaTicket: challenge, code: '123456', rememberDevice: true }));
    expect(disabled.status).toBe(200);
    expect(disabled.cookies.get(TRUSTED_DEVICE_COOKIE)).toBeUndefined();
  });
});
