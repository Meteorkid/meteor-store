import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * db 的查询按固定顺序发生，用一个队列按序返回结果：
 *   第 1 次 —— 按 orderId 查已有 key（幂等检查）
 *   之后每次 —— 按 key 查是否碰撞
 * 队列空了就返回 []（视为没查到）。
 */
const selectQueue: Record<string, unknown>[][] = [];
const inserted: Record<string, unknown>[] = [];

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => selectQueue.shift() ?? [],
        }),
      }),
    }),
    insert: () => ({
      values: async (row: Record<string, unknown>) => {
        inserted.push(row);
      },
    }),
  },
}));

import { createLicenseKey, getLicenseKeyByOrderId } from '../license';

const order = {
  orderId: 'MS123',
  productId: 'omnicrawl',
  planName: 'Starter',
  email: 'a@b.com',
};

const KEY_PATTERN = /^MC-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

describe('createLicenseKey', () => {
  beforeEach(() => {
    selectQueue.length = 0;
    inserted.length = 0;
  });

  it('同一订单已有 key 时直接返回，不重复插入（幂等）', async () => {
    selectQueue.push([{ key: 'MC-AAAA-BBBB-CCCC-DDDD' }]);

    const key = await createLicenseKey(order);

    expect(key).toBe('MC-AAAA-BBBB-CCCC-DDDD');
    expect(inserted).toHaveLength(0);
  });

  it('新订单生成符合格式的 key 并入库', async () => {
    selectQueue.push([], []); // 无已有 key，无碰撞

    const key = await createLicenseKey(order);

    expect(key).toMatch(KEY_PATTERN);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      orderId: 'MS123',
      productId: 'omnicrawl',
      planName: 'Starter',
      email: 'a@b.com',
      key,
      status: 'active',
    });
  });

  it('key 不含容易混淆的 I / O / 0 / 1', async () => {
    for (let i = 0; i < 30; i++) {
      selectQueue.length = 0;
      inserted.length = 0;
      selectQueue.push([], []);
      const key = await createLicenseKey(order);
      expect(key.slice(3)).not.toMatch(/[IO01]/);
    }
  });

  it('碰撞后换一个 key 重试，最终成功', async () => {
    selectQueue.push([], [{ key: 'dup' }], []); // 第一次碰撞，第二次通过

    const key = await createLicenseKey(order);

    expect(key).toMatch(KEY_PATTERN);
    expect(inserted).toHaveLength(1);
  });

  it('连续碰撞 5 次后抛错，不会插入半成品', async () => {
    selectQueue.push([], ...Array.from({ length: 5 }, () => [{ key: 'dup' }]));

    await expect(createLicenseKey(order)).rejects.toThrow('too many collisions');
    expect(inserted).toHaveLength(0);
  });

  it('每次生成的 key 不重复', async () => {
    const keys = new Set<string>();
    for (let i = 0; i < 50; i++) {
      selectQueue.length = 0;
      selectQueue.push([], []);
      keys.add(await createLicenseKey(order));
    }
    expect(keys.size).toBe(50);
  });
});

describe('getLicenseKeyByOrderId', () => {
  beforeEach(() => {
    selectQueue.length = 0;
  });

  it('查到时返回记录', async () => {
    selectQueue.push([{ orderId: 'MS123', key: 'MC-AAAA-BBBB-CCCC-DDDD' }]);
    await expect(getLicenseKeyByOrderId('MS123')).resolves.toMatchObject({ orderId: 'MS123' });
  });

  it('查不到时返回 null，而不是 undefined', async () => {
    selectQueue.push([]);
    await expect(getLicenseKeyByOrderId('NOPE')).resolves.toBeNull();
  });
});
