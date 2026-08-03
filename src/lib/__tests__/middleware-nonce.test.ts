import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/middleware', () => ({
  default: () => (request: NextRequest) =>
    NextResponse.next({ request: { headers: request.headers } }),
}));

import { middleware } from '@/middleware';

describe('middleware CSP nonce', () => {
  it('forwards the same nonce to rendering and the response CSP', () => {
    const response = middleware(new NextRequest('https://imagentx.top/zh'));
    const csp = response.headers.get('content-security-policy');
    const nonce = csp?.match(/'nonce-([^']+)'/)?.[1];

    expect(nonce).toBeTruthy();
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(nonce);
  });
});
