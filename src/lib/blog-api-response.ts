import { NextResponse } from 'next/server';
import type { BlogApiAuthFailureReason } from './blog-api-auth';

export type BlogApiErrorCode =
  | 'invalid_request'
  | 'invalid_token'
  | 'insufficient_scope'
  | 'post_not_found'
  | 'invalid_state'
  | 'version_conflict'
  | 'invalid_image'
  | 'storage_quota_exceeded'
  | 'image_upload_in_progress'
  | 'upload_busy'
  | 'rate_limited'
  | 'storage_unavailable'
  | 'internal_error';

interface BlogApiErrorOptions {
  details?: Record<string, unknown>;
  retryAfter?: number;
  headers?: HeadersInit;
}

function privateHeaders(initial?: HeadersInit): Headers {
  const headers = new Headers(initial);
  headers.set('Cache-Control', 'no-store');

  const vary = headers.get('Vary');
  const values = vary?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
  if (!values.some((value) => value.toLowerCase() === 'authorization')) {
    values.push('Authorization');
  }
  headers.set('Vary', values.join(', '));
  return headers;
}

export function blogApiSuccess<T>(data: T, init: ResponseInit = {}): NextResponse<T> {
  return NextResponse.json(data, {
    ...init,
    headers: privateHeaders(init.headers),
  });
}

export function blogApiError(
  status: number,
  code: BlogApiErrorCode,
  message: string,
  options: BlogApiErrorOptions = {},
): NextResponse {
  const headers = privateHeaders(options.headers);
  if (status === 401) headers.set('WWW-Authenticate', 'Bearer');
  if (options.retryAfter !== undefined) {
    headers.set('Retry-After', String(Math.max(0, Math.ceil(options.retryAfter))));
  }

  return NextResponse.json({
    error: {
      code,
      message,
      details: options.details ?? {},
    },
  }, { status, headers });
}

export function blogApiAuthError(reason: BlogApiAuthFailureReason): NextResponse {
  if (reason === 'insufficient_scope') {
    return blogApiError(403, reason, '访问令牌缺少所需权限');
  }
  return blogApiError(401, reason, '访问令牌无效或已过期');
}
