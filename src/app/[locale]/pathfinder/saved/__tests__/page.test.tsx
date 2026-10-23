import { renderToStaticMarkup } from 'react-dom/server';
import { createTranslator } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../../../../messages/zh.json';
import en from '../../../../../../messages/en.json';
import type { PathfinderCatalogItem } from '@/lib/pathfinder/catalog-types';
import { catalogItemFixture } from '@/lib/pathfinder/__tests__/fixtures';

const mocks = vi.hoisted(() => ({ getSavedPathfinderItems: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: async () => ({ userId: 'user-a' }) }));
vi.mock('@/lib/pathfinder/saves', () => ({ getSavedPathfinderItems: mocks.getSavedPathfinderItems }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', redirect: vi.fn() }));
vi.mock('@/components/pathfinder/ReminderToggle', () => ({ default: () => <span>REMINDER_CONTROL</span> }));
vi.mock('@/components/pathfinder/CatalogItemCard', () => ({
  default: ({ item, compact }: { item: PathfinderCatalogItem; compact: boolean }) => (
    <div>{item.title.zh}{!compact && item.summary.zh}</div>
  ),
}));
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async ({ locale }: { locale: string }) => createTranslator({
    locale, messages: locale === 'en' ? en : zh, namespace: 'PathfinderHub.saves',
  }),
}));

import SavedPage, { dynamic } from '../page';

describe('收藏页全过期与真正空列表', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it.each(['zh', 'en'] as const)('%s 全部过期仍展示历史摘要，不显示空收藏或提醒开关', async (locale) => {
    const item = catalogItemFixture({ deadlineAt: '2026-01-01T00:00:00Z' });
    mocks.getSavedPathfinderItems.mockResolvedValue([{ item, savedAt: '2025-12-01T00:00:00Z', remindDeadline: true }]);
    const html = renderToStaticMarkup(await SavedPage({ params: Promise.resolve({ locale }) }));
    const copy = (locale === 'en' ? en : zh).PathfinderHub.saves;
    expect(html).toContain(copy.noActive);
    expect(html).toContain(copy.expiredDescription);
    expect(html).toContain(item.summary.zh);
    expect(html).not.toContain(copy.emptyTitle);
    expect(html).not.toContain('REMINDER_CONTROL');
    expect(mocks.getSavedPathfinderItems).toHaveBeenCalledExactlyOnceWith('user-a');
    expect(dynamic).toBe('force-dynamic');
  });

  it('真正空收藏保留原有浏览引导', async () => {
    mocks.getSavedPathfinderItems.mockResolvedValue([]);
    const html = renderToStaticMarkup(await SavedPage({ params: Promise.resolve({ locale: 'zh' }) }));
    expect(html).toContain(zh.PathfinderHub.saves.emptyTitle);
    expect(html).not.toContain(zh.PathfinderHub.saves.noActive);
    expect(html).not.toContain(zh.PathfinderHub.saves.expiredDescription);
  });

  it.each(['zh', 'en'] as const)('%s 读取失败展示重新加载入口，不声称从未收藏', async (locale) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.getSavedPathfinderItems.mockRejectedValue(new Error('private-database-detail'));
    const html = renderToStaticMarkup(await SavedPage({ params: Promise.resolve({ locale }) }));
    const copy = (locale === 'en' ? en : zh).PathfinderHub.saves;
    expect(html).toContain(locale === 'zh' ? '收藏暂时无法读取' : 'Saved items are temporarily unavailable');
    expect(html).toContain(`href="/${locale}/pathfinder/saved"`);
    expect(html).not.toContain(copy.emptyTitle);
    expect(html).not.toContain(copy.noActive);
    expect(html).not.toContain('private-database-detail');
  });
});
