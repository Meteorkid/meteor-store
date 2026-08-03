import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isAdminEmail, isAdminSession, getAdminEmails } from '../admin';

describe('isAdminEmail', () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });
  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it('未配置 ADMIN_EMAILS 时任何人都不是管理员', () => {
    expect(isAdminEmail('anyone@example.com')).toBe(false);
    expect(getAdminEmails()).toEqual([]);
  });

  it('配置为空串时同样没有管理员，而不是所有人都是', () => {
    process.env.ADMIN_EMAILS = '   ';
    expect(isAdminEmail('anyone@example.com')).toBe(false);
  });

  it('命中名单中的邮箱', () => {
    process.env.ADMIN_EMAILS = 'boss@example.com';
    expect(isAdminEmail('boss@example.com')).toBe(true);
  });

  it('大小写与首尾空格不影响判定', () => {
    process.env.ADMIN_EMAILS = '  Boss@Example.com  ';
    expect(isAdminEmail('BOSS@example.COM')).toBe(true);
    expect(isAdminEmail(' boss@example.com ')).toBe(true);
  });

  it('支持逗号分隔的多个管理员', () => {
    process.env.ADMIN_EMAILS = 'a@x.com, b@x.com ,c@x.com';
    ['a@x.com', 'b@x.com', 'c@x.com'].forEach((e) => expect(isAdminEmail(e)).toBe(true));
    expect(isAdminEmail('d@x.com')).toBe(false);
  });

  it('空值不会被误判为管理员', () => {
    process.env.ADMIN_EMAILS = 'a@x.com';
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail('')).toBe(false);
  });

  it('不做子串匹配，避免 evil-boss@example.com 混进来', () => {
    process.env.ADMIN_EMAILS = 'boss@example.com';
    expect(isAdminEmail('evil-boss@example.com')).toBe(false);
    expect(isAdminEmail('boss@example.com.evil.com')).toBe(false);
  });

  it('邮箱命中管理员名单但会话未验证时仍拒绝授权', () => {
    process.env.ADMIN_EMAILS = 'boss@example.com';

    expect(isAdminSession({ email: 'boss@example.com' })).toBe(false);
    expect(isAdminSession({ email: 'boss@example.com', emailVerified: true })).toBe(true);
  });
});
