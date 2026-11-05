import { renderToStaticMarkup } from 'react-dom/server';
import { createTranslator } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../../../../../messages/zh.json';
import en from '../../../../../../../messages/en.json';
import { catalogItemFixture } from '@/lib/pathfinder/__tests__/fixtures';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), getCatalogItem: vi.fn(), getSavedPathfinderItem: vi.fn(),
  fetchDigestContent: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/pathfinder/catalog', () => ({ getCatalogItem: mocks.getCatalogItem, listCatalogItems: async () => [] }));
vi.mock('@/lib/pathfinder/saves', () => ({ getSavedPathfinderItem: mocks.getSavedPathfinderItem, listPathfinderSaves: async () => [] }));
vi.mock('@/lib/pathfinder/digest-content', () => ({ fetchDigestContent: mocks.fetchDigestContent }));
vi.mock('@/lib/pathfinder/editorial-store', () => ({ getApprovedEditorialNote: async () => null }));
vi.mock('@/components/pathfinder/CatalogItemCard', () => ({ default: () => null }));
vi.mock('@/components/pathfinder/SaveButton', () => ({ default: () => null }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND'); } }));
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async ({ locale }: { locale: string }) => createTranslator({
    locale, messages: locale === 'en' ? en : zh, namespace: 'PathfinderHub.itemPage',
  }),
}));

import ItemPage, { dynamic, generateMetadata } from '../page';

const digestItem = catalogItemFixture({
  sourceId: 'agihunt-daily', itemType: 'ai-update',
  canonicalUrl: 'https://agihunt.info/daily/2026-10-22',
  summary: { zh: '已经收录的摘要', en: 'Previously saved summary' },
});

describe('全文降级和私人历史详情', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue(null);
    mocks.getCatalogItem.mockResolvedValue(digestItem);
    mocks.getSavedPathfinderItem.mockResolvedValue(null);
    mocks.fetchDigestContent.mockResolvedValue(null);
  });

  it.each(['zh', 'en'] as const)('%s 全文失败保留摘要、明确状态和原文入口', async (locale) => {
    const html = renderToStaticMarkup(await ItemPage({ params: Promise.resolve({ locale, id: digestItem.id }) }));
    const copy = (locale === 'en' ? en : zh).PathfinderHub.itemPage;
    expect(html).toContain(copy.digestUnavailableTitle);
    expect(html).toContain(copy.digestUnavailableDescription);
    expect(html).toContain(copy.entryVerifiedAt);
    expect(html).toContain(digestItem.summary[locale]);
    expect(html).toContain(`href="${digestItem.canonicalUrl}"`);
    expect(html).not.toContain(copy.digestTitle);
  });

  it('全文恢复后展示正文与可用状态，不再重复摘要或失败提示', async () => {
    mocks.fetchDigestContent.mockResolvedValue({ attribution: null, sections: [], itemCount: 3 });
    const html = renderToStaticMarkup(await ItemPage({ params: Promise.resolve({ locale: 'zh', id: digestItem.id }) }));
    expect(html).toContain(zh.PathfinderHub.itemPage.digestAvailable);
    expect(html).toContain(zh.PathfinderHub.itemPage.digestTitle);
    expect(html).not.toContain(digestItem.summary.zh);
    expect(html).not.toContain(zh.PathfinderHub.itemPage.digestUnavailableTitle);
  });

  it.each([null, { userId: 'user-b' }])('游客与其他用户都不能读取历史正文或metadata %j', async (session) => {
    mocks.getCatalogItem.mockResolvedValue(null);
    mocks.getSession.mockResolvedValue(session);
    const params = Promise.resolve({ locale: 'zh', id: digestItem.id });
    expect(await generateMetadata({ params })).toEqual({});
    await expect(ItemPage({ params })).rejects.toThrow('NOT_FOUND');
    expect(mocks.fetchDigestContent).not.toHaveBeenCalled();
    if (!session) expect(mocks.getSavedPathfinderItem).not.toHaveBeenCalled();
  });

  it('本人历史详情标记截止、禁止索引且不展示继续加入计划入口', async () => {
    const item = catalogItemFixture({ deadlineAt: '2026-01-01T00:00:00Z' });
    mocks.getCatalogItem.mockResolvedValue(null);
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getSavedPathfinderItem.mockResolvedValue(item);
    const params = Promise.resolve({ locale: 'zh', id: item.id });
    expect((await generateMetadata({ params })).robots).toEqual({ index: false, follow: false });
    const html = renderToStaticMarkup(await ItemPage({ params }));
    expect(html).toContain(zh.PathfinderHub.itemPage.savedHistoryNotice);
    expect(html).not.toContain('/pathfinder/plan?item=');
    expect(mocks.getSavedPathfinderItem).toHaveBeenCalledWith('user-a', item.id);
    expect(dynamic).toBe('force-dynamic');
  });

  // 2026-11-05：sitemap 收口只挡「主动提交」，站内链接仍会让爬虫发现这些地址，
  // 所以低质条目必须在 metadata 里显式 noindex。
  it('可上手的公开条目不加 robots，保持可索引', async () => {
    mocks.getCatalogItem.mockResolvedValue(catalogItemFixture({ learningEligible: true }));
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'zh', id: digestItem.id }) });
    expect(metadata.robots).toBeUndefined();
  });

  it('不可上手的公开条目禁止索引但保留 follow，页面本身仍可访问', async () => {
    const item = catalogItemFixture({ learningEligible: false, itemType: 'ai-update' });
    mocks.getCatalogItem.mockResolvedValue(item);
    const params = Promise.resolve({ locale: 'zh', id: item.id });
    expect((await generateMetadata({ params })).robots).toEqual({ index: false, follow: true });
    // 站内导航价值保留：正文照常渲染，不是 404。
    const html = renderToStaticMarkup(await ItemPage({ params }));
    expect(html).toContain(item.summary.zh);
  });

  it('历史读取不可用时metadata和详情均交给安全错误边界，不获取正文', async () => {
    mocks.getCatalogItem.mockResolvedValue(null);
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getSavedPathfinderItem.mockRejectedValue(new Error('Saved Pathfinder content is temporarily unavailable'));
    const params = Promise.resolve({ locale: 'zh', id: digestItem.id });
    await expect(generateMetadata({ params })).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    await expect(ItemPage({ params })).rejects.toThrow('Saved Pathfinder content is temporarily unavailable');
    expect(mocks.fetchDigestContent).not.toHaveBeenCalled();
  });
});
