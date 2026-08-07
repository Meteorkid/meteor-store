import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const notify = vi.fn();

vi.mock('@/lib/pass-expiry', () => ({
  notifyExpiringPasses: (...args: unknown[]) => notify(...args),
}));

vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '127.0.0.1',
  rateLimit: async () => ({ limited: false }),
}));

describe('Pass 到期提醒 cron 接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PASS_EXPIRY_CRON_SECRET = 'cron-secret';
  });

  it('带正确 token 时触发提醒并返回统计', async () => {
    const { POST } = await import('../route');
    notify.mockResolvedValueOnce({ checked: 3, reminded: 2, skipped: 1 });

    const request = new Request('https://www.imagentx.top/api/cron/pass-expiry', {
      method: 'POST',
      headers: { authorization: 'Bearer cron-secret' },
    }) as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      reminded: 2,
      skipped: 1,
    });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('缺少或错误 token 时返回 401', async () => {
    const { POST } = await import('../route');

    const bad = new Request('https://www.imagentx.top/api/cron/pass-expiry', {
      method: 'POST',
      headers: { authorization: 'Bearer wrong' },
    }) as unknown as NextRequest;

    const response = await POST(bad);
    expect(response.status).toBe(401);
    expect(notify).not.toHaveBeenCalled();
  });

  it('未配置 secret 时拒绝调用', async () => {
    const { POST } = await import('../route');
    delete process.env.PASS_EXPIRY_CRON_SECRET;

    const request = new Request('https://www.imagentx.top/api/cron/pass-expiry', {
      method: 'POST',
      headers: { authorization: 'Bearer cron-secret' },
    }) as unknown as NextRequest;

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});