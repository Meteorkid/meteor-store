import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SITE_URL } from '@/lib/constants';

const mocks = vi.hoisted(() => ({
  post: vi.fn(), session: vi.fn(), tags: { zh: [] as { label: string; key: string; href: string; count: number }[], en: [] as { label: string; key: string; href: string; count: number }[] },
}));
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => key, setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('not found'); } }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('@/lib/posts', () => ({ getPostById: mocks.post }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: () => false }));
vi.mock('@/lib/related-posts', () => ({ getRelatedPosts: () => [] }));
vi.mock('@/data/blog-feed', () => ({
  getFeedPosts: async () => [],
  getFeedTags: async (locale: 'zh' | 'en') => mocks.tags[locale],
  findFeedTag: async (locale: 'zh' | 'en', input: string) => mocks.tags[locale].find(tag => tag.key === input.toLowerCase()),
}));
import UserPostPage, { generateMetadata as postMetadata } from '../p/[id]/page';
import { generateMetadata as tagMetadata, generateStaticParams } from '../tag/[tag]/page';

type Node = ReactElement<Record<string, unknown>>;
const nodes = (node: unknown): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children)] : [];
const tag = (label: string) => ({ label, key: label.toLowerCase(), href: `/blog/tag/${encodeURIComponent(label)}`, count: 1 });
const publishedPost = { id: 'original', locale: 'zh', title: '原文', excerpt: '摘要', content: '正文', tags: ['中文标签'], sectionId: 'tech', authorId: 'author', status: 'published', publishedAt: '2026-10-23' };
beforeEach(() => {
  mocks.post.mockResolvedValue(publishedPost);
  mocks.session.mockResolvedValue(null);
  mocks.tags = { zh: [tag('中文标签'), tag('SHARED')], en: [tag('English'), tag('Shared')] };
});

describe('博客内容语言与界面语言的链接边界', () => {
  it('英文界面阅读中文原文时，标签回到原文语言集合', async () => {
    const tree = await UserPostPage({ params: Promise.resolve({ locale: 'en', id: 'original' }) });
    const link = nodes(tree).find(node => node.props.href === '/blog/tag/%E4%B8%AD%E6%96%87%E6%A0%87%E7%AD%BE');
    expect(link?.props.locale).toBe('zh');
    const metadata = await postMetadata({ params: Promise.resolve({ locale: 'en', id: 'original' }) });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/zh/blog/p/original`);
    expect(metadata.alternates?.languages).toEqual({ zh: `${SITE_URL}/zh/blog/p/original`, 'x-default': `${SITE_URL}/zh/blog/p/original` });
    expect(nodes(tree).some(node => node.props.locale === 'en' && node.props.sourceLanguage === 'zh')).toBe(true);
  });

  it('中文界面阅读英文原文同样使用英文标签及原文canonical', async () => {
    mocks.post.mockResolvedValue({ ...publishedPost, locale: 'en', tags: ['English'] });
    const params = Promise.resolve({ locale: 'zh', id: 'original' });
    const tree = await UserPostPage({ params });
    expect(nodes(tree).find(node => node.props.href === '/blog/tag/English')?.props.locale).toBe('en');
    expect((await postMetadata({ params })).alternates?.languages)
      .toEqual({ en: `${SITE_URL}/en/blog/p/original`, 'x-default': `${SITE_URL}/en/blog/p/original` });
  });

  it('静态标签参数按各语言真实集合生成', async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: 'zh', tag: '中文标签' }, { locale: 'zh', tag: 'SHARED' },
      { locale: 'en', tag: 'English' }, { locale: 'en', tag: 'Shared' },
    ]);
  });

  it('标签metadata只声明真实存在的候选，跨语言大小写按各自规范路径', async () => {
    const metadata = await tagMetadata({ params: Promise.resolve({ locale: 'zh', tag: 'SHARED' }), searchParams: Promise.resolve({}) });
    expect(metadata.alternates?.languages).toEqual({
      zh: `${SITE_URL}/zh/blog/tag/SHARED`, en: `${SITE_URL}/en/blog/tag/Shared`, 'x-default': `${SITE_URL}/zh/blog/tag/SHARED`,
    });
    const onlyZh = await tagMetadata({ params: Promise.resolve({ locale: 'zh', tag: '中文标签' }), searchParams: Promise.resolve({}) });
    expect(onlyZh.alternates?.languages).not.toHaveProperty('en');
    const onlyEn = await tagMetadata({ params: Promise.resolve({ locale: 'en', tag: 'English' }), searchParams: Promise.resolve({}) });
    expect(onlyEn.alternates?.languages).toEqual({ en: `${SITE_URL}/en/blog/tag/English`, 'x-default': `${SITE_URL}/en/blog/tag/English` });
  });

  it('缺失页面与私有预览不产生公开语言候选', async () => {
    const missing = await tagMetadata({ params: Promise.resolve({ locale: 'en', tag: '中文标签' }), searchParams: Promise.resolve({}) });
    expect(missing.robots).toEqual({ index: false, follow: false });
    expect(missing.alternates).toBeUndefined();
    mocks.post.mockResolvedValue({ id: 'draft', locale: 'zh', title: 'PRIVATE', excerpt: 'PRIVATE', authorId: 'author', status: 'draft', sectionId: 'tech' });
    const privatePost = await postMetadata({ params: Promise.resolve({ locale: 'en', id: 'draft' }) });
    expect(JSON.stringify(privatePost)).not.toContain('PRIVATE');
    expect(privatePost.robots).toEqual({ index: false, follow: false });
    mocks.session.mockResolvedValue({ userId: 'author' });
    const preview = await postMetadata({ params: Promise.resolve({ locale: 'en', id: 'draft' }) });
    expect(preview.robots).toEqual({ index: false, follow: false });
    expect(preview.alternates).toBeUndefined();
  });
});
