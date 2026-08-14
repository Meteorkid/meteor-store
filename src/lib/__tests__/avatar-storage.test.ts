import { describe, it, expect, beforeAll } from 'vitest';
import { keyFromUrl } from '../avatar-storage';

const BASE = 'https://cdn.example.com';

beforeAll(() => {
  process.env.R2_ACCOUNT_ID = 'test-account';
  process.env.R2_ACCESS_KEY_ID = 'test-key';
  process.env.R2_SECRET_ACCESS_KEY = 'test-secret';
  process.env.R2_BUCKET = 'test-bucket';
  process.env.R2_PUBLIC_BASE = BASE;
});

describe('keyFromUrl 归属校验', () => {
  it('本人前缀下的 key 正常反解', () => {
    expect(keyFromUrl(`${BASE}/avatars/U1/abc123.webp`, 'U1')).toBe(
      'avatars/U1/abc123.webp',
    );
  });

  it('他人前缀返回 null——防跨用户删除头像对象', () => {
    expect(keyFromUrl(`${BASE}/avatars/U2/abc123.webp`, 'U1')).toBeNull();
  });

  it('外链返回 null', () => {
    expect(keyFromUrl('https://evil.example.com/avatars/U1/abc.webp', 'U1')).toBeNull();
  });

  it('data URL 返回 null', () => {
    expect(keyFromUrl('data:image/webp;base64,xxx', 'U1')).toBeNull();
  });

  it('非头像前缀返回 null——防误删 bucket 内其他对象', () => {
    expect(keyFromUrl(`${BASE}/blog/U1/abc.webp`, 'U1')).toBeNull();
    expect(keyFromUrl(`${BASE}/releases/statux/0.4.3/a.dmg`, 'U1')).toBeNull();
  });
});
