import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  invite: {
    id: 'invite-id',
    code: 'INV-AAAA-BBBB-CCCC',
    productId: 'omnicrawl',
    planId: 'starter',
    planName: 'Starter',
    maxUses: 1,
    usedCount: 0,
    memo: null,
    expiresAt: null,
    createdBy: 'admin@example.com',
    status: 'active',
    createdAt: '2026-08-04T00:00:00.000Z',
  },
  selectCount: 0,
  insertError: null as Error | null,
}));

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => {
            state.selectCount += 1;
            return state.selectCount === 1 ? [{ ...state.invite }] : [];
          },
        }),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          if (values.status === 'active') {
            state.invite.usedCount = Math.max(state.invite.usedCount - 1, 0);
            state.invite.status = 'active';
          } else {
            state.invite.usedCount += 1;
            state.invite.status = state.invite.usedCount >= state.invite.maxUses
              ? 'exhausted'
              : 'active';
          }
          return { rowCount: 1 };
        },
      }),
    }),
    insert: () => ({
      values: async () => {
        if (state.insertError) throw state.insertError;
      },
    }),
  },
}));

const createKey = vi.fn();
const removeKey = vi.fn();
vi.mock('../license', () => ({
  createLicenseKey: (...args: unknown[]) => createKey(...args),
  removeLicenseKey: (...args: unknown[]) => removeKey(...args),
}));

describe('邀请码兑换补偿', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.invite.usedCount = 0;
    state.invite.status = 'active';
    state.selectCount = 0;
    state.insertError = new Error('unique violation');
    createKey.mockResolvedValue('MC-AAAA-BBBB-CCCC-DDDD');
    removeKey.mockResolvedValue(true);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('最后一个名额写兑换记录失败时恢复 active 并删除孤儿授权码', async () => {
    const { redeemInviteCode } = await import('../invite');

    const result = await redeemInviteCode(
      'INV-AAAA-BBBB-CCCC',
      'user-id',
      'buyer@example.com',
    );

    expect(result).toEqual({ success: false, error: '你已经使用过该邀请码' });
    expect(state.invite.usedCount).toBe(0);
    expect(state.invite.status).toBe('active');
    expect(removeKey).toHaveBeenCalledWith(
      createKey.mock.calls[0][0].orderId,
      'MC-AAAA-BBBB-CCCC-DDDD',
    );
  });

  it('授权码生成失败时恢复最后一个名额', async () => {
    createKey.mockRejectedValueOnce(new Error('license unavailable'));
    const { redeemInviteCode } = await import('../invite');

    const result = await redeemInviteCode(
      'INV-AAAA-BBBB-CCCC',
      'user-id',
      'buyer@example.com',
    );

    expect(result).toEqual({ success: false, error: '激活码生成失败，请稍后重试' });
    expect(state.invite.usedCount).toBe(0);
    expect(state.invite.status).toBe('active');
    expect(removeKey).not.toHaveBeenCalled();
  });

  it('兑换成功时保留 exhausted 状态且不执行补偿', async () => {
    state.insertError = null;
    const { redeemInviteCode } = await import('../invite');

    const result = await redeemInviteCode(
      'INV-AAAA-BBBB-CCCC',
      'user-id',
      'buyer@example.com',
    );

    expect(result).toMatchObject({
      success: true,
      licenseKey: 'MC-AAAA-BBBB-CCCC-DDDD',
      productId: 'omnicrawl',
      planName: 'Starter',
    });
    expect(state.invite.usedCount).toBe(1);
    expect(state.invite.status).toBe('exhausted');
    expect(removeKey).not.toHaveBeenCalled();
  });
});
