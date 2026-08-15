import crypto from 'node:crypto';

/**
 * RFC 6238 TOTP（管理端 MFA）+ 恢复码。
 *
 * 零新依赖：HMAC-SHA1 用 node:crypto，base32 手写（RFC 4648）。
 * TOTP secret 落库前用 AES-256-GCM 加密（密钥优先从 TOTP_ENC_KEY 派生，见下方 encryptionKey），
 * 恢复码只存 SHA-256 哈希——数据库泄露拿不到可用凭据。
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

export function base32Decode(input: string): Buffer {
  const clean = input.replace(/=+$/, '').toUpperCase().replace(/\s/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error('invalid base32 character');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** 生成 160 位随机 TOTP secret（base32，32 字符）。 */
export function generateTotpSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

/** 按计数器算一个 6 位 HOTP 码（TOTP 的基础）。 */
function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter % 0x100000000, 4);
  const hmac = crypto.createHmac('sha1', secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, '0');
}

/**
 * 验证 6 位 TOTP 码，允许 ±1 个 30 秒窗口的时钟偏移。
 * 恒定时间比较，不短路。
 */
export function verifyTotp(secretBase32: string, code: string, window = 1): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const secret = base32Decode(secretBase32);
  const counter = Math.floor(Date.now() / 1000 / 30);
  let match = false;
  for (let drift = -window; drift <= window; drift++) {
    const expected = hotp(secret, counter + drift);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(code))) {
      match = true;
    }
  }
  return match;
}

/** 生成认证器 App 的 otpauth:// 链接（配二维码用）。 */
export function otpauthUrl(secretBase32: string, account: string, issuer = 'Meteor Store'): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// ---------- 恢复码 ----------

/** 生成 10 个恢复码，格式 xxxx-xxxx（去掉易混淆字符）。 */
export function generateRecoveryCodes(count = 10): string[] {
  // 去掉 0/1/O/I，剩 32 个字符正好可 5 bit 一组采样
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(8);
    let code = '';
    for (const byte of bytes) {
      code += alphabet[byte % alphabet.length];
    }
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
}

/** 恢复码只存哈希。 */
export function hashRecoveryCode(code: string): string {
  return crypto
    .createHash('sha256')
    .update(code.trim().toUpperCase())
    .digest('hex');
}

// ---------- secret 落库加密 ----------

type KeyVersion = 'v1' | 'v2';

/**
 * TOTP secret 的加密密钥。
 *
 * **v2（推荐）用独立的 `TOTP_ENC_KEY`**：`JWT_SECRET` 是会轮换的量——泄露后必须换，
 * 而它一换，所有已绑定用户的 TOTP 密文就永久解不开，只能靠恢复码找回并重新绑定。
 * 把两者解耦后，轮换会话密钥不再牵动 MFA。
 *
 * 未配置 `TOTP_ENC_KEY` 时退回 v1 的 `JWT_SECRET` 派生：历史密文就是这么加的，
 * 必须保持可读。解密两个版本都认，加密只在 v2 可用时才用 v2。
 */
function encryptionKey(version: KeyVersion): Buffer {
  const material =
    version === 'v2' ? process.env.TOTP_ENC_KEY : process.env.JWT_SECRET;
  if (!material) {
    throw new Error(version === 'v2' ? 'TOTP_ENC_KEY is not set' : 'JWT_SECRET is not set');
  }
  return crypto.createHash('sha256').update(`${material}:totp-encryption`).digest();
}

/** AES-256-GCM 加密 TOTP secret，输出 {版本}:iv:tag:ciphertext（base64 段）。 */
export function encryptTotpSecret(secretBase32: string): string {
  const version: KeyVersion = process.env.TOTP_ENC_KEY ? 'v2' : 'v1';
  if (version === 'v1') {
    console.warn(
      'TOTP_ENC_KEY 未配置，TOTP secret 回退到 JWT_SECRET 派生密钥加密；' +
        '轮换 JWT_SECRET 会让已绑定的两步验证全部失效（只能用恢复码找回）',
    );
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(version), iv);
  const ciphertext = Buffer.concat([
    cipher.update(secretBase32, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [version, iv.toString('base64'), tag.toString('base64'), ciphertext.toString('base64')].join(
    ':',
  );
}

export function decryptTotpSecret(encrypted: string): string | null {
  try {
    const [version, ivB64, tagB64, dataB64] = encrypted.split(':');
    if ((version !== 'v1' && version !== 'v2') || !ivB64 || !tagB64 || !dataB64) return null;
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      encryptionKey(version),
      Buffer.from(ivB64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    return null;
  }
}
