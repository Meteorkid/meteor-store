import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reviewPathfinderItem } from '../admin-catalog';

const mocks = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({ from: () => ({ leftJoin: () => ({ where: () => ({ limit: mocks.read }) }) }) }),
    update: () => ({ set: () => ({ where: (predicate: SQL) => ({ returning: () => mocks.write(predicate) }) }) }),
  },
}));

const candidate = {
  sourceId: 'retired-github-source', adapter: 'github', itemType: 'open-source', contentHash: 'payment-v1:one',
  requiresManualEligibilityCheck: true, summaryEn: 'Buy now for 19 USDC',
};
const request = { id: 'example', decision: 'published' as const, reviewerId: 'editor', learningEligible: false };

describe('付款条目只能逐条核对当前版本', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.read.mockResolvedValue([candidate]);
    mocks.write.mockResolvedValue([{ id: request.id }]);
  });

  it('拒绝旧版本、批量批准和仍带旧版资格审核标记的付款招揽', async () => {
    expect(await reviewPathfinderItem({ ...request, contentHash: 'obsolete' })).toBeNull();
    expect(await reviewPathfinderItem({ ...request, batch: true, contentHash: candidate.contentHash })).toBeNull();
    mocks.read.mockResolvedValue([{ ...candidate, contentHash: 'legacy' }]);
    expect(await reviewPathfinderItem({ ...request, batch: true })).toBeNull();
    expect(mocks.write).not.toHaveBeenCalled();
  });

  it('最终的发布 SQL 也匹配已读版本和 pending 状态；并发修改返回冲突', async () => {
    mocks.write.mockResolvedValue([]);
    expect(await reviewPathfinderItem({ ...request, contentHash: candidate.contentHash })).toBeNull();
    const where = new PgDialect().sqlToQuery(mocks.write.mock.calls[0][0]);
    expect(where.sql).toMatch(/"content_hash" = \$3/);
    expect(where.params).toEqual([request.id, 'pending', candidate.contentHash]);
  });

  it('相同版本经逐条审核可以发布；旧客户端仍可批量批准普通条目', async () => {
    expect(await reviewPathfinderItem({ ...request, contentHash: candidate.contentHash })).toEqual({ id: request.id });
    mocks.read.mockResolvedValue([{ ...candidate, contentHash: 'legacy', summaryEn: 'Add tests.' }]);
    expect(await reviewPathfinderItem({ ...request, batch: true })).toEqual({ id: request.id });
  });
});
