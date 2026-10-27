import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { SOFTWARE_PRODUCT_IDS, SoftwareLicenseError } from './types';

export const DeviceSchema = z.object({
  productId: z.enum(SOFTWARE_PRODUCT_IDS),
  deviceId: z.string().regex(/^[a-f0-9]{64}$/),
  deviceName: z.string().trim().min(1).max(100),
});
export const TokenSchema = DeviceSchema.omit({ deviceName: true }).extend({ deviceToken: z.string().min(32).max(128) });
export const ActivationSchema = DeviceSchema.extend({ code: z.string().trim().min(10).max(200) });

export function privateJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export function softwareError(error: unknown) {
  if (error instanceof SoftwareLicenseError) return privateJson({ error: error.message, code: error.code }, { status: error.status });
  // 不记录请求内容：其中含设备凭证、激活码和邮箱。
  console.error('Software license operation failed', error instanceof Error ? error.name : 'unknown');
  return privateJson({ error: '授权服务暂不可用，请稍后重试', code: 'unavailable' }, { status: 503 });
}

export async function softwareRequestGuard(request: NextRequest, action: string, maximum = 30) {
  const originError = assertMatchingOrigin(request);
  if (originError) return privateJson({ error: '请求来源不允许', code: 'invalid_origin' }, { status: 403 });
  const { limited } = await rateLimit(`software-license:${action}:${getClientIp(request)}`, maximum, 60_000, { fallback: 'memory' });
  if (limited) return privateJson({ error: '请求过于频繁，请稍后重试', code: 'rate_limited' }, { status: 429 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 4096) return privateJson({ error: '请求内容过大', code: 'invalid_request' }, { status: 413 });
  return null;
}

export async function parseSoftwareBody<T>(request: NextRequest, schema: z.ZodType<T>): Promise<T> {
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) {
          await reader.cancel();
          throw new SoftwareLicenseError('invalid_request', '请求内容过大', 413);
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const text = Buffer.concat(chunks).toString('utf8');
  let json: unknown;
  try { json = JSON.parse(text); } catch { throw new SoftwareLicenseError('invalid_request', '请求格式无效'); }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new SoftwareLicenseError('invalid_request', '请求参数无效');
  return parsed.data;
}
