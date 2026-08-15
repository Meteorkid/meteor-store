import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { decryptTotpSecret, encryptTotpSecret } from '../totp';

const SECRET = 'JBSWY3DPEHPK3PXP';

describe('TOTP secret 落库加密', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'jwt-secret-for-tests-0123456789ab';
    delete process.env.TOTP_ENC_KEY;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.TOTP_ENC_KEY;
  });

  it('配了 TOTP_ENC_KEY 时写 v2，并能解回原文', () => {
    process.env.TOTP_ENC_KEY = 'totp-enc-key-for-tests-0123456789';

    const encrypted = encryptTotpSecret(SECRET);

    expect(encrypted.startsWith('v2:')).toBe(true);
    expect(decryptTotpSecret(encrypted)).toBe(SECRET);
  });

  it('没配 TOTP_ENC_KEY 时退回 v1，并告警', () => {
    const encrypted = encryptTotpSecret(SECRET);

    expect(encrypted.startsWith('v1:')).toBe(true);
    expect(decryptTotpSecret(encrypted)).toBe(SECRET);
    expect(console.warn).toHaveBeenCalled();
  });

  it('补配 TOTP_ENC_KEY 之后，历史 v1 密文仍然解得开', () => {
    const legacy = encryptTotpSecret(SECRET);
    expect(legacy.startsWith('v1:')).toBe(true);

    process.env.TOTP_ENC_KEY = 'totp-enc-key-for-tests-0123456789';

    expect(decryptTotpSecret(legacy)).toBe(SECRET);
  });

  it('轮换 JWT_SECRET 不会废掉 v2 密文——这正是把两者拆开的目的', () => {
    process.env.TOTP_ENC_KEY = 'totp-enc-key-for-tests-0123456789';
    const encrypted = encryptTotpSecret(SECRET);

    process.env.JWT_SECRET = '轮换后的新会话密钥-0123456789abcdef';

    expect(decryptTotpSecret(encrypted)).toBe(SECRET);
  });

  it('轮换 JWT_SECRET 会让 v1 密文解不开（所以生产必须配 TOTP_ENC_KEY）', () => {
    const legacy = encryptTotpSecret(SECRET);

    process.env.JWT_SECRET = '轮换后的新会话密钥-0123456789abcdef';

    expect(decryptTotpSecret(legacy)).toBeNull();
  });

  it('密文被篡改时返回 null 而不是抛错', () => {
    process.env.TOTP_ENC_KEY = 'totp-enc-key-for-tests-0123456789';
    const encrypted = encryptTotpSecret(SECRET);
    const tampered = `${encrypted.slice(0, -4)}AAAA`;

    expect(decryptTotpSecret(tampered)).toBeNull();
    expect(decryptTotpSecret('garbage')).toBeNull();
  });
});
