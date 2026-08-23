import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' };

function tokensMatch(actual: string | null, expected: string): boolean {
  if (!actual) return false;
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length
    && crypto.timingSafeEqual(actualBytes, expectedBytes);
}

/** 仅供同机 Nginx auth_request 调用，不是浏览器身份接口。 */
export async function GET(req: NextRequest) {
  const expectedToken = process.env.EX_MEMORY_PROXY_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Ex-Memory proxy auth is not configured' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (!tokensMatch(req.headers.get('x-ex-memory-proxy-token'), expectedToken)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Login required' },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      ...NO_STORE_HEADERS,
      'X-Ex-Memory-User-Id': session.userId,
    },
  });
}
