import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { curatedIeltsPairs } from '@/data/ielts';
import type { IeltsPairRow } from '@/lib/ielts/catalog';

const mocks = vi.hoisted(() => ({ session: vi.fn(), isAdmin: vi.fn(), row: vi.fn(), curated: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/ielts/catalog', () => ({ findIeltsPairRow: mocks.row, validCuratedPairs: mocks.curated }));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, locale, children, ...props }: { href: string; locale: string; children: ReactNode }) =>
    <a href={`/${locale}${href}`} {...props}>{children}</a>,
}));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

import IeltsPreviewPage, { generateMetadata } from '../page';

const seed = curatedIeltsPairs[0];
const draft: IeltsPairRow = { ...seed, slug: 'generated-draft', source: 'generated', status: 'draft' };
const props = (locale = 'zh', slug = draft.slug) => ({ params: Promise.resolve({ locale, slug }) });
const escaped = (text: string) => renderToStaticMarkup(<>{text}</>);

describe('雅思后台正文预览', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ userId: 'admin-1' });
    mocks.isAdmin.mockReturnValue(true);
    mocks.row.mockResolvedValue(draft);
    mocks.curated.mockReturnValue([]);
  });

  it.each(['guest', 'member'])('%s 在读取草稿正文前被拒绝，metadata 不泄露后台标题', async identity => {
    if (identity === 'guest') mocks.session.mockResolvedValue(null);
    else mocks.isAdmin.mockReturnValue(false);
    const metadata = await generateMetadata(props());
    expect(metadata.title).toBe('Not found');
    expect(metadata.robots).toEqual({ index: false, follow: false });
    await expect(IeltsPreviewPage(props())).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.row).not.toHaveBeenCalled();
    expect(mocks.curated).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'] as const)('管理员可预览 %s 草稿的题干、真实逐句对照、四项说明与表达', async locale => {
    const metadata = await generateMetadata(props(locale));
    expect(metadata.robots).toEqual({ index: false, follow: false });
    const html = renderToStaticMarkup(await IeltsPreviewPage(props(locale)));
    expect(mocks.row).toHaveBeenCalledWith(draft.slug);
    expect(html).toContain(escaped(seed.content.title[locale]));
    expect(html).toContain(escaped(seed.content.prompt[locale]));
    expect(html).toContain(escaped(seed.content.prompt[locale === 'zh' ? 'en' : 'zh']));
    for (const segment of seed.content.segments) {
      expect(html).toContain(escaped(segment.low));
      expect(html).toContain(escaped(segment.high));
      expect(html).toContain(escaped(segment.note[locale]));
    }
    for (const criterion of seed.content.criteria) expect(html).toContain(escaped(criterion.note[locale]));
    for (const takeaway of seed.content.takeaways[locale]) expect(html).toContain(escaped(takeaway));
    expect(html).toContain(`href="/${locale}/admin/ielts"`);
    expect(html).toContain(locale === 'zh' ? '草稿' : 'Draft');
    expect(html).toContain(locale === 'zh' ? '全文阅读' : 'Full essays');
  });

  it('下架行仍可预览，数据库正文优先于同名文件内容', async () => {
    mocks.row.mockResolvedValue({ ...draft, slug: seed.slug, status: 'hidden', content: {
      ...seed.content, title: { zh: '数据库覆盖标题', en: 'Database override title' },
    } });
    mocks.curated.mockReturnValue([seed]);
    const html = renderToStaticMarkup(await IeltsPreviewPage(props('zh', seed.slug)));
    expect(html).toContain('数据库覆盖标题');
    expect(html).not.toContain(escaped(seed.content.title.zh));
    expect(html).toContain('已下架');
  });

  it.each([null, { ...draft, slug: seed.slug, content: null }])('正文为空时可读取同名文件精选', async row => {
    mocks.row.mockResolvedValue(row);
    mocks.curated.mockReturnValue([seed]);
    const html = renderToStaticMarkup(await IeltsPreviewPage(props('zh', seed.slug)));
    expect(html).toContain(escaped(seed.content.title.zh));
    expect(html).toContain(escaped(seed.content.segments[0].high));
  });

  it.each([null, { ...draft, content: null }])('数据库和文件都无正文时返回 404', async row => {
    mocks.row.mockResolvedValue(row);
    await expect(IeltsPreviewPage(props())).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('无效 slug 不触发数据库查询', async () => {
    await expect(IeltsPreviewPage(props('zh', '../invalid'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.row).not.toHaveBeenCalled();
  });
});
