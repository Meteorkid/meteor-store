import { beforeEach, describe, expect, it, vi } from 'vitest';

// 追踪发出去的提醒邮件
const sentMails: Array<{ email: string; expiresAt: string }> = [];
const inserted: Array<{ email: string; expiresAt: string }> = [];

vi.mock('@/lib/email', () => ({
  sendPassExpiryReminder: async (data: { email: string; expiresAt: string }) => {
    sentMails.push(data);
  },
}));

// 可控的订单数据：即将到期的月付、买断(lifetime)、已撤销、已过期
let passOrders: Array<{
  email: string;
  grantedAt: string | null;
  billingPeriod: string;
  licenseStatus: string | null;
}> = [];

// 已存在的提醒记录（模拟幂等去重）
let existingReminders: Array<{ email: string; expiresAt: string }> = [];

// 用表对象身份区分两条查询：
//  - from(orders)          → leftJoin().where() 返回 passOrders
//  - from(passReminders)   → 直接 thenable 返回 existingReminders
const ORDERS_TABLE = { __table: 'orders' };
const PASS_REMINDERS_TABLE = { __table: 'pass_reminders' };

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: (table: { __table?: string }) => {
        if (table.__table === 'pass_reminders') {
          return Promise.resolve(existingReminders);
        }
        return {
          leftJoin: () => ({ where: async () => passOrders }),
        };
      },
    }),
    insert: () => ({
      values: async (row: { email: string; expiresAt: string }) => {
        inserted.push(row);
        return {};
      },
    }),
  },
}));

vi.mock('@/lib/db/schema', () => ({
  orders: ORDERS_TABLE,
  licenseKeys: {},
  passReminders: PASS_REMINDERS_TABLE,
}));

describe('Meteor Pass 到期提醒服务', () => {
  beforeEach(() => {
    sentMails.length = 0;
    inserted.length = 0;
    existingReminders = [];
  });

  it('只提醒即将到期的 Pass，跳过买断、已撤销与已过期', async () => {
    const { notifyExpiringPasses } = await import('@/lib/pass-expiry');

    const now = new Date('2026-08-07T00:00:00Z');
    passOrders = [
      // 月付，29 天前购买 → 剩 1 天到期，在 7 天窗口内 → 提醒
      {
        email: 'a@example.com',
        grantedAt: '2026-07-09T00:00:00Z',
        billingPeriod: 'monthly',
        licenseStatus: 'active',
      },
      // 买断 → 永久，不提醒
      {
        email: 'b@example.com',
        grantedAt: now.toISOString(),
        billingPeriod: 'lifetime',
        licenseStatus: 'active',
      },
      // 月付但授权码已撤销（退款）→ 跳过
      {
        email: 'c@example.com',
        grantedAt: '2026-07-09T00:00:00Z',
        billingPeriod: 'monthly',
        licenseStatus: 'revoked',
      },
      // 月付，60 天前购买 → 已过期 → 跳过
      {
        email: 'd@example.com',
        grantedAt: '2026-06-08T00:00:00Z',
        billingPeriod: 'monthly',
        licenseStatus: 'active',
      },
    ];

    const result = await notifyExpiringPasses(now);

    expect(result.checked).toBe(4);
    expect(result.reminded).toBe(1);
    expect(result.skipped).toBe(0);
    expect(sentMails).toHaveLength(1);
    expect(sentMails[0].email).toBe('a@example.com');
    expect(inserted).toHaveLength(1);
  });

  it('同一用户对同一到期日只提醒一次（幂等）', async () => {
    const { notifyExpiringPasses } = await import('@/lib/pass-expiry');

    const now = new Date('2026-08-07T00:00:00Z');
    // 同一用户两条月付订单，到期日相同 → 只提醒一次
    passOrders = [
      { email: 'x@example.com', grantedAt: '2026-07-09T00:00:00Z', billingPeriod: 'monthly', licenseStatus: 'active' },
      { email: 'x@example.com', grantedAt: '2026-07-09T00:00:00Z', billingPeriod: 'monthly', licenseStatus: 'active' },
    ];

    const result = await notifyExpiringPasses(now);

    expect(result.reminded).toBe(1);
    expect(sentMails).toHaveLength(1);
  });

  it('已提醒过的到期日不再重复发送', async () => {
    const { notifyExpiringPasses } = await import('@/lib/pass-expiry');

    const now = new Date('2026-08-07T00:00:00Z');
    passOrders = [
      { email: 'a@example.com', grantedAt: '2026-07-09T00:00:00Z', billingPeriod: 'monthly', licenseStatus: 'active' },
    ];
    // 该用户 + 该到期日已提醒过 → 跳过（月付自 07-09 起 1 个月 = 08-09 到期，toISOString 含 .000Z）
    existingReminders = [
      { email: 'a@example.com', expiresAt: '2026-08-09T00:00:00.000Z' },
    ];

    const result = await notifyExpiringPasses(now);

    expect(result.reminded).toBe(0);
    expect(result.skipped).toBe(1);
    expect(sentMails).toHaveLength(0);
  });
});