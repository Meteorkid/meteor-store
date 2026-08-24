import crypto from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import type { PathfinderCatalogItem } from '../catalog-types';

vi.mock('../catalog-db', () => ({
  listDatabaseCatalogItems: vi.fn(),
}));
vi.mock('../static-tombstones', () => ({
  readStaticPathfinderTombstones: vi.fn(),
}));

import { listDatabaseCatalogItems } from '../catalog-db';
import { readStaticPathfinderTombstones } from '../static-tombstones';
import {
  getCatalogItem,
  isCatalogItemPublicAt,
  listCatalogItems,
  mergeCatalogItems,
  normalizeCatalogUrl,
} from '../catalog';

const listDatabaseItems = vi.mocked(listDatabaseCatalogItems);
const readTombstones = vi.mocked(readStaticPathfinderTombstones);

describe('Pathfinder catalog repository', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    listDatabaseItems.mockReset();
    listDatabaseItems.mockResolvedValue([]);
    readTombstones.mockResolvedValue({ ids: [], available: true });
  });

  it('数据库无动态条目时返回完整静态目录', async () => {
    const items = await listCatalogItems();

    expect(items).toHaveLength(STATIC_PATHFINDER_ITEMS.length);
    expect(items.every((item) => item.origin === 'static')).toBe(true);
  });

  it('规范 URL 相同时数据库条目覆盖静态种子', async () => {
    const databaseItem = fromDatabase(STATIC_PATHFINDER_ITEMS[0], {
      id: 'database-nextjs',
      canonicalUrl: `${STATIC_PATHFINDER_ITEMS[0].canonicalUrl}/?utm_source=sync#readme`,
      title: { zh: '数据库中的 Next.js', en: 'Next.js from database' },
    });
    listDatabaseItems.mockResolvedValue([databaseItem]);

    const items = await listCatalogItems();

    expect(items).toHaveLength(STATIC_PATHFINDER_ITEMS.length);
    expect(items.find((item) => item.id === databaseItem.id)?.origin).toBe('database');
    expect(items.find((item) => item.id === STATIC_PATHFINDER_ITEMS[0].id)).toBeUndefined();
  });

  it('数据库读取失败但独立 tombstone store 可用时安全回退静态种子', async () => {
    const error = new Error('database unavailable');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listDatabaseItems.mockRejectedValue(error);

    const items = await listCatalogItems();

    expect(items).toHaveLength(STATIC_PATHFINDER_ITEMS.length);
    expect(consoleError).toHaveBeenCalledWith(
      '[pathfinder] 读取动态目录失败，本次尝试安全回退',
      error,
    );
  });

  it('数据库故障时仍由独立 tombstone 抑制已下架静态种子', async () => {
    const target = STATIC_PATHFINDER_ITEMS[0];
    listDatabaseItems.mockRejectedValue(new Error('database unavailable'));
    readTombstones.mockResolvedValue({ ids: [target.id], available: true });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const items = await listCatalogItems();

    expect(items.some((item) => item.id === target.id)).toBe(false);
    expect(items).toHaveLength(STATIC_PATHFINDER_ITEMS.length - 1);
  });

  it('URL 哈希 tombstone 在静态 ID 调整后仍能阻止同一链接复活', async () => {
    const target = STATIC_PATHFINDER_ITEMS[0];
    const urlHash = crypto.createHash('sha256').update(normalizeCatalogUrl(target.canonicalUrl)).digest('hex');
    listDatabaseItems.mockRejectedValue(new Error('database unavailable'));
    readTombstones.mockResolvedValue({ ids: [`url:${urlHash}`], available: true });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect((await listCatalogItems()).some((item) => item.id === target.id)).toBe(false);
  });

  it('下架或失效的动态记录会压住同链接静态种子，待审记录不会提前遮挡', async () => {
    const base = STATIC_PATHFINDER_ITEMS[0];
    const stale = fromDatabase(base, { id: 'database-stale', status: 'stale' });
    listDatabaseItems.mockResolvedValue([stale]);
    expect((await listCatalogItems()).some((item) => item.canonicalUrl === base.canonicalUrl)).toBe(false);

    const pending = fromDatabase(base, { id: 'database-pending', status: 'pending' });
    listDatabaseItems.mockResolvedValue([pending]);
    expect((await listCatalogItems()).find((item) => item.canonicalUrl === base.canonicalUrl)?.id)
      .toBe(base.id);
  });

  it('组合筛选只返回符合条件的公开条目并应用上限', async () => {
    const items = await listCatalogItems({
      type: 'open-source',
      direction: 'data',
      difficulty: ['intermediate', 'advanced'],
      learningEligible: true,
      limit: 3,
    });

    expect(items).toHaveLength(3);
    expect(items.every((item) => (
      item.itemType === 'open-source'
      && item.direction === 'data'
      && item.learningEligible
    ))).toBe(true);
  });

  it('可按合并后的目录 ID 读取单条公开信息', async () => {
    const target = fromDatabase(STATIC_PATHFINDER_ITEMS[0], {
      id: 'database-only-item',
      canonicalUrl: 'https://example.edu.cn/pathfinder/opportunity',
    });
    listDatabaseItems.mockResolvedValue([target]);

    await expect(getCatalogItem(target.id)).resolves.toEqual(target);
    await expect(getCatalogItem('missing')).resolves.toBeNull();
    await expect(getCatalogItem('   ')).resolves.toBeNull();
  });

  it('合并函数也会去除数据库内部的规范 URL 重复', () => {
    const original = fromDatabase(STATIC_PATHFINDER_ITEMS[0], {
      id: 'database-original',
      canonicalUrl: 'https://example.com/jobs?a=1&b=2',
    });
    const duplicate = fromDatabase(STATIC_PATHFINDER_ITEMS[1], {
      id: 'database-duplicate',
      canonicalUrl: 'https://EXAMPLE.com/jobs/?b=2&utm_campaign=test&a=1#apply',
    });

    expect(mergeCatalogItems([], [original, duplicate])).toEqual([duplicate]);
  });

  it('URL 规范化移除追踪参数、片段与尾斜杠差异', () => {
    expect(normalizeCatalogUrl('https://EXAMPLE.com/jobs/?b=2&utm_source=test&a=1#apply'))
      .toBe('https://example.com/jobs?a=1&b=2');
  });

  it('静态时效机会在截止后不会继续出现在目录或 sitemap 数据源', () => {
    const exact = { ...STATIC_PATHFINDER_ITEMS[0], deadlineAt: '2026-09-01T00:00:00.000Z' };
    const dateOnly = {
      ...STATIC_PATHFINDER_ITEMS[0],
      deadlineAt: null,
      deadlineText: { zh: '2026-09-01（官方未披露时区）', en: '2026-09-01 (time zone not stated)' },
      deadlineDate: '2026-09-01',
    };

    expect(isCatalogItemPublicAt(exact, new Date('2026-09-02T00:00:00.000Z'))).toBe(false);
    expect(isCatalogItemPublicAt(dateOnly, new Date('2026-09-02T11:00:00.000Z'))).toBe(true);
    expect(isCatalogItemPublicAt(dateOnly, new Date('2026-09-02T12:01:00.000Z'))).toBe(false);
  });
});

function fromDatabase(
  base: PathfinderCatalogItem,
  overrides: Partial<PathfinderCatalogItem>,
): PathfinderCatalogItem {
  return {
    ...base,
    ...overrides,
    source: {
      ...base.source,
      id: 'database-source',
      origin: 'database',
    },
    sourceId: 'database-source',
    origin: 'database',
  };
}
