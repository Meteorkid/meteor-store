import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { assertMatchingOrigin, buildAllowedOrigins } from '../csrf';

function makeRequest(origin: string | null): NextRequest {
  const url = new URL('http://localhost/api/test');
  const headers: Record<string, string> = {};
  if (origin) headers.origin = origin;
  return new NextRequest(url, { method: 'POST', headers });
}

describe('buildAllowedOrigins', () => {
  it('本地开发地址始终收录', () => {
    const set = buildAllowedOrigins();
    expect(set.has('http://localhost:3000')).toBe(true);
    expect(set.has('http://127.0.0.1:3000')).toBe(true);
  });

  it('NEXT_PUBLIC_SITE_URL 为 www 时自动收录非 www', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.imagentx.top');
    const set = buildAllowedOrigins();
    expect(set.has('https://www.imagentx.top')).toBe(true);
    expect(set.has('https://imagentx.top')).toBe(true);
    vi.unstubAllEnvs();
  });

  it('NEXT_PUBLIC_SITE_URL 为非 www 时自动收录 www', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://imagentx.top');
    const set = buildAllowedOrigins();
    expect(set.has('https://imagentx.top')).toBe(true);
    expect(set.has('https://www.imagentx.top')).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe('assertMatchingOrigin', () => {
  it('无 Origin 头放行（非浏览器客户端 / 服务端到服务端）', () => {
    expect(assertMatchingOrigin(makeRequest(null))).toBeNull();
  });

  it('本站 Origin 放行', () => {
    expect(assertMatchingOrigin(makeRequest('https://www.imagentx.top'))).toBeNull();
    expect(assertMatchingOrigin(makeRequest('https://imagentx.top'))).toBeNull();
  });

  it('本地开发地址放行', () => {
    expect(assertMatchingOrigin(makeRequest('http://localhost:3000'))).toBeNull();
  });

  it('跨站 Origin 返回 403', () => {
    const res = assertMatchingOrigin(makeRequest('https://evil.example.com'));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  it('Origin 大小写与尾斜杠不影响匹配', () => {
    expect(assertMatchingOrigin(makeRequest('HTTPS://WWW.IMAGENTX.TOP/'))).toBeNull();
  });
});