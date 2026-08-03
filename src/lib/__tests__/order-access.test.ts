import { beforeEach, describe, expect, it, vi } from 'vitest';

const jar = new Map<string, { value: string; options?: Record<string, unknown> }>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)!.value } : undefined),
    set: (name: string, value: string, options?: Record<string, unknown>) => {
      jar.set(name, { value, options });
    },
  }),
}));

const ORDER_ID = 'b3f1c2d4-0000-4000-8000-000000000001';

describe('支付后订单访问凭证', () => {
  beforeEach(() => {
    jar.clear();
    process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long!!';
  });

  it('签发 HttpOnly 短时 cookie 后只能读取同一订单', async () => {
    const { createOrderAccess, getOrderAccess } = await import('../order-access');

    await createOrderAccess(ORDER_ID);

    await expect(getOrderAccess()).resolves.toEqual({ orderId: ORDER_ID });
    expect(jar.get('ms_order_access')?.options).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  });
});
