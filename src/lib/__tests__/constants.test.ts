import { describe, expect, it, vi, afterEach } from 'vitest';
import { SITE_URL, getSiteUrl } from '../constants';

describe('getSiteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('NEXT_PUBLIC_SITE_URL 优先', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://new.example.com');
    expect(getSiteUrl()).toBe('https://new.example.com');
  });

  it('去掉 env 末尾斜杠', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://imagentx.top///');
    expect(getSiteUrl()).toBe('https://imagentx.top');
  });

  it('env 为空字符串时兜底 SITE_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(getSiteUrl()).toBe(SITE_URL);
  });

  it('env 未设置时兜底 SITE_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    expect(getSiteUrl()).toBe(SITE_URL);
  });
});
