import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/middleware', () => ({
  default: () => (request: NextRequest) =>
    NextResponse.next({ request: { headers: request.headers } }),
}));

import { proxy } from '@/proxy';

describe('proxy CSP nonce 传播', () => {
  it('forwards the same nonce to rendering and the response CSP', () => {
    const response = proxy(new NextRequest('https://imagentx.top/zh'));
    const csp = response.headers.get('content-security-policy');
    const nonce = csp?.match(/'nonce-([^']+)'/)?.[1];

    expect(nonce).toBeTruthy();
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(nonce);
  });

  it('所有商城页面只允许加载同源 iframe，且普通页面禁止被嵌入', () => {
    const response = proxy(new NextRequest('https://imagentx.top/zh/apps/ex-memory'));
    const csp = response.headers.get('content-security-policy');

    expect(csp).toContain("frame-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain('frame-src *');
  });

  it('现有 trial 页面继续允许被同源产品页嵌入', () => {
    const response = proxy(new NextRequest('https://imagentx.top/zh/apps/tollow/trial'));
    expect(response.headers.get('content-security-policy')).toContain("frame-ancestors 'self'");
  });
});
