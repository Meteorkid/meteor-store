import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const verifyChallenge = vi.fn();
const createProof = vi.fn();

vi.mock('@/lib/captcha', () => ({
  verifyCaptchaChallenge: (...args: unknown[]) => verifyChallenge(...args),
  createCaptchaProof: (...args: unknown[]) => createProof(...args),
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.1',
  rateLimit: async () => ({ limited: false }),
}));

const CHALLENGE_ID = '123e4567-e89b-42d3-a456-426614174000';

function request(token = CHALLENGE_ID, x = 120): NextRequest {
  return new Request('https://www.imagentx.top/api/captcha/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, x }),
  }) as unknown as NextRequest;
}

describe('验证 CAPTCHA 拖动结果', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyChallenge.mockResolvedValue(true);
    createProof.mockResolvedValue('captcha-proof');
  });

  it('正确位置返回不含答案的一次性 proof', async () => {
    const { POST } = await import('../route');

    const response = await POST(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ proof: 'captcha-proof' });
    expect(verifyChallenge).toHaveBeenCalledWith(CHALLENGE_ID, 120);
  });

  it('错误位置不签发 proof', async () => {
    verifyChallenge.mockResolvedValue(false);
    const { POST } = await import('../route');

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(createProof).not.toHaveBeenCalled();
  });
});
