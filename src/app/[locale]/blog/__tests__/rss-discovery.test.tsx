import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getPostById: vi.fn(), getBlogPosts: vi.fn() }));
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => key, setRequestLocale: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/posts', () => ({ getPostById: mocks.getPostById }));
vi.mock('@/data/blog', () => ({ getBlogPosts: mocks.getBlogPosts }));
vi.mock('@/data/blog-feed', () => ({ findFeedTags: async () => [], getFeedPosts: async () => [] }));
vi.mock('@/lib/related-posts', () => ({ getRelatedPosts: async () => [] }));
vi.mock('@/lib/admin', () => ({ isAdminSession: () => false }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/BlogList', () => ({ default: () => null }));
vi.mock('@/components/TopicProposalForm', () => ({ default: () => null }));
vi.mock('@/components/AdminGithubEditLink', () => ({ default: () => null }));

import BlogPage, { generateMetadata as blogMetadata } from '../page';
import SectionPage, { generateMetadata as sectionMetadata } from '../section/[section]/page';
import { generateMetadata as postMetadata } from '../p/[id]/page';
import { generateMetadata as filePostMetadata } from '../[slug]/page';

describe('博客 RSS 自动发现与可见订阅入口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue(null);
    mocks.getPostById.mockResolvedValue({ id: 'post-1', authorId: 'author-1', title: 'Article', excerpt: 'Summary', status: 'published', sectionId: 'tech' });
    mocks.getBlogPosts.mockReturnValue([{ slug: 'legacy-post', title: 'Article', excerpt: 'Summary', section: 'tech' }]);
  });

  it.each(['zh', 'en'])('%s 列表与分区的发现声明和实际链接指向相同语言', async locale => {
    const params = Promise.resolve({ locale });
    const list = await blogMetadata({ params });
    const html = renderToStaticMarkup(await BlogPage({ params, searchParams: Promise.resolve({}) }));
    expect(list.alternates?.types?.['application/rss+xml']).toBe(`/${locale}/blog/feed.xml`);
    expect(html).toContain(`href="/${locale}/blog/feed.xml"`);

    const sectionParams = Promise.resolve({ locale, section: 'tech' });
    const section = await sectionMetadata({ params: sectionParams, searchParams: Promise.resolve({}) });
    const sectionHtml = renderToStaticMarkup(await SectionPage({ params: sectionParams, searchParams: Promise.resolve({}) }));
    expect(section.alternates?.types?.['application/rss+xml']).toBe(`/${locale}/blog/section/tech/feed.xml`);
    expect(sectionHtml).toContain(`href="/${locale}/blog/section/tech/feed.xml"`);
  });

  it.each(['zh', 'en'])('%s 投稿和旧文件详情发现所属分区的同语言 RSS', async locale => {
    const published = await postMetadata({ params: Promise.resolve({ locale, id: 'post-1' }) });
    const legacy = await filePostMetadata({ params: Promise.resolve({ locale, slug: 'legacy-post' }) });
    for (const metadata of [published, legacy]) {
      expect(metadata.alternates?.types?.['application/rss+xml']).toBe(`/${locale}/blog/section/tech/feed.xml`);
    }
  });

  it('游客无法通过未发布投稿的 metadata 获取订阅信息', async () => {
    mocks.getPostById.mockResolvedValue({ status: 'draft', authorId: 'author-1', sectionId: 'tech' });
    const metadata = await postMetadata({ params: Promise.resolve({ locale: 'en', id: 'draft-1' }) });
    expect(metadata.alternates).toBeUndefined();
  });
});
