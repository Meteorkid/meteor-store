import { isValidElement, type ComponentProps, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { licenseKeys, orders, postFavorites, posts, users } from '@/lib/db/schema';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  getPostById: vi.fn(),
  getPostsByAuthor: vi.fn(),
  getUserFavoritePosts: vi.fn(),
  isAdminSession: vi.fn(),
  select: vi.fn(),
  redirect: vi.fn(() => { throw new Error('REDIRECT'); }),
  notFound: vi.fn(() => { throw new Error('NOT_FOUND'); }),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/db', () => ({ db: { select: mocks.select } }));
vi.mock('@/lib/posts', () => ({
  getPostById: mocks.getPostById,
  getPostsByAuthor: mocks.getPostsByAuthor,
}));
vi.mock('@/lib/favorites', () => ({ getUserFavoritePosts: mocks.getUserFavoritePosts }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdminSession }));
vi.mock('@/lib/markdown', () => ({ markdownToHtml: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect, notFound: mocks.notFound }));
vi.mock('@/i18n/navigation', async () => {
  const { createElement } = await import('react');
  const { useLocale } = await import('next-intl');
  return {
    Link: function LocalizedLink({ href, ...props }: ComponentProps<'a'> & { href: string }) {
      const locale = useLocale();
      return createElement('a', { ...props, href: `/${locale}${href}` });
    },
    redirect: mocks.redirect,
  };
});
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/AccountForms', () => ({ default: () => null }));
vi.mock('@/components/BlogApiTokenManager', () => ({ default: () => null }));
vi.mock('@/components/GlassPreference', () => ({ default: () => null }));
vi.mock('@/components/WechatAccountBinding', () => ({ default: () => null }));
vi.mock('@/components/RedeemForm', () => ({ default: () => null }));
vi.mock('@/components/PostSubmitForm', () => ({ default: () => null }));
vi.mock('@/components/PostRowActions', () => ({ default: () => null }));

import AccountPage, { generateMetadata as accountMetadata } from '../account/page';
import OrdersPage, { generateMetadata as ordersMetadata } from '../orders/page';
import RedeemPage, { generateMetadata as redeemMetadata } from '../redeem/page';
import SubmitPage, { generateMetadata as submitMetadata } from '../blog/submit/page';
import MyPostsPage, { generateMetadata as myPostsMetadata } from '../blog/my-posts/page';
import FavoritesPage, { generateMetadata as favoritesMetadata } from '../blog/favorites/page';

const pages = [
  { path: '/account', page: AccountPage, metadata: accountMetadata },
  { path: '/orders', page: OrdersPage, metadata: ordersMetadata },
  { path: '/redeem', page: RedeemPage, metadata: redeemMetadata },
  { path: '/blog/submit', page: SubmitPage, metadata: submitMetadata },
  { path: '/blog/my-posts', page: MyPostsPage, metadata: myPostsMetadata },
  { path: '/blog/favorites', page: FavoritesPage, metadata: favoritesMetadata },
];

function pageProps(locale: string) {
  return { params: Promise.resolve({ locale }), searchParams: Promise.resolve({}) };
}

function renderLocalized(page: ReactNode, locale: string) {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={{}} timeZone="Asia/Shanghai">
      {page}
    </NextIntlClientProvider>,
  );
}

function queryResult(rows: unknown[]) {
  const result = Promise.resolve(rows);
  const query = {
    from: vi.fn(() => query),
    where: vi.fn(() => query),
    orderBy: vi.fn(() => query),
    limit: vi.fn(() => query),
    then: result.then.bind(result),
  };
  return query;
}

function expectNoPrivateQueries() {
  expect(mocks.select).not.toHaveBeenCalled();
  expect(mocks.getPostById).not.toHaveBeenCalled();
  expect(mocks.getPostsByAuthor).not.toHaveBeenCalled();
  expect(mocks.getUserFavoritePosts).not.toHaveBeenCalled();
}

describe('私有页面的登录返回地址', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue(null);
    mocks.getPostsByAuthor.mockResolvedValue([]);
    mocks.getUserFavoritePosts.mockResolvedValue([]);
    mocks.isAdminSession.mockReturnValue(false);
  });

  it.each(pages)('$path 在 zh/en 下保留语言和目的地，游客不读取私有数据', async ({ path, page }) => {
    for (const locale of ['zh', 'en']) {
      await expect(page(pageProps(locale))).rejects.toThrow('REDIRECT');
      expect(mocks.redirect).toHaveBeenLastCalledWith({
        href: `/login?next=${encodeURIComponent(path)}`, locale,
      });
    }
    expectNoPrivateQueries();
  });

  it.each(pages)('$path 的 metadata 只读公共文案', async ({ metadata }) => {
    for (const locale of ['zh', 'en']) {
      expect(await metadata(pageProps(locale))).toHaveProperty('title');
    }
    expect(mocks.getSession).not.toHaveBeenCalled();
    expectNoPrivateQueries();
  });

  it.each([
    [{ id: 'Abc_123-defG' }, '/blog/submit?id=Abc_123-defG'],
    [{ id: 'Abc_123-defG', admin: '1', next: 'https://evil.example' }, '/blog/submit?id=Abc_123-defG&admin=1'],
    [{ id: 'https://evil.example', admin: '1' }, '/blog/submit'],
    [{ admin: '1', next: '//evil.example' }, '/blog/submit'],
  ])('投稿登录只保留白名单编辑参数：%j', async (query, returnTo) => {
    for (const locale of ['zh', 'en']) {
      await expect(SubmitPage({
        ...pageProps(locale), searchParams: Promise.resolve(query),
      })).rejects.toThrow('REDIRECT');
      expect(mocks.redirect).toHaveBeenLastCalledWith({
        href: `/login?next=${encodeURIComponent(returnTo)}`, locale,
      });
    }
    expectNoPrivateQueries();
  });

  it.each(['zh', 'en'])('账号已经不存在时仍保留 %s 返回地址', async (locale) => {
    mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    mocks.select.mockReturnValue(queryResult([]));
    await expect(AccountPage(pageProps(locale))).rejects.toThrow('REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({ href: '/login?next=%2Faccount', locale });
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });
});

describe('已登录页面保持原有取数边界', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    mocks.getPostsByAuthor.mockResolvedValue([]);
    mocks.getUserFavoritePosts.mockResolvedValue([]);
    mocks.isAdminSession.mockReturnValue(false);
  });

  it.each(['zh', 'en'])('账号页 %s 只查询当前账号及原有六组数据', async (locale) => {
    const user = {
      id: 'user-1', email: 'user@example.com', name: 'Test', bio: '', avatarUrl: null,
      emailVerified: true, isStudent: false, createdAt: '2026-01-01', wechatOpenid: null,
    };
    const queries = [[user], [], [], [{ count: 0 }], [{ count: 0 }], []].map(queryResult);
    queries.forEach((query) => mocks.select.mockReturnValueOnce(query));
    expect(isValidElement(await AccountPage(pageProps(locale)))).toBe(true);
    const tables = [users, licenseKeys, posts, postFavorites, orders, orders];
    const conditions = [
      eq(users.id, user.id), eq(licenseKeys.email, user.email), eq(posts.authorId, user.id),
      eq(postFavorites.userId, user.id), eq(orders.email, user.email), eq(orders.email, user.email),
    ];
    queries.forEach((query, i) => {
      expect(query.from).toHaveBeenCalledWith(tables[i]);
      expect(query.where).toHaveBeenCalledWith(conditions[i]);
    });
    expect(mocks.select).toHaveBeenCalledTimes(6);
    expect(mocks.getSession).toHaveBeenCalledTimes(1);
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it('订单页只查询当前登录邮箱', async () => {
    const query = queryResult([]);
    mocks.select.mockReturnValue(query);
    expect(isValidElement(await OrdersPage(pageProps('en')))).toBe(true);
    expect(query.from).toHaveBeenCalledWith(orders);
    expect(query.where).toHaveBeenCalledWith(eq(orders.email, 'user@example.com'));
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });

  it.each(['zh', 'en'])('我的投稿与收藏 %s 使用原有用户 ID 和语言', async (locale) => {
    expect(isValidElement(await MyPostsPage(pageProps(locale)))).toBe(true);
    expect(isValidElement(await FavoritesPage(pageProps(locale)))).toBe(true);
    expect(mocks.getPostsByAuthor).toHaveBeenCalledExactlyOnceWith('user-1');
    expect(mocks.getUserFavoritePosts).toHaveBeenCalledExactlyOnceWith('user-1', locale);
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it('兑换页和新投稿页不会新增私有查询', async () => {
    expect(isValidElement(await RedeemPage(pageProps('en')))).toBe(true);
    expect(isValidElement(await SubmitPage(pageProps('en')))).toBe(true);
    expectNoPrivateQueries();
  });

  it('投稿编辑只查询一次原文章，admin=1 不绕过作者或管理员鉴权', async () => {
    mocks.getPostById.mockResolvedValue({ id: 'post-1', authorId: 'other-user', status: 'draft' });
    await expect(SubmitPage({
      ...pageProps('en'), searchParams: Promise.resolve({ id: 'post-1', admin: '1' }),
    })).rejects.toThrow('NOT_FOUND');
    expect(mocks.getPostById).toHaveBeenCalledExactlyOnceWith('post-1');
    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });

  it('本人仍可编辑草稿，管理员仍可编辑待审核文章', async () => {
    mocks.getPostById.mockResolvedValue({ id: 'post-1', authorId: 'user-1', status: 'draft' });
    expect(isValidElement(await SubmitPage({
      ...pageProps('en'), searchParams: Promise.resolve({ id: 'post-1' }),
    }))).toBe(true);
    mocks.getPostById.mockResolvedValue({ id: 'post-2', authorId: 'other-user', status: 'pending' });
    mocks.isAdminSession.mockReturnValue(true);
    expect(isValidElement(await SubmitPage({
      ...pageProps('en'), searchParams: Promise.resolve({ id: 'post-2', admin: '1' }),
    }))).toBe(true);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'])('普通作者编辑待审核文章时返回 %s 的我的投稿', async (locale) => {
    mocks.getPostById.mockResolvedValue({ id: 'post-1', authorId: 'user-1', status: 'pending' });
    await expect(SubmitPage({
      ...pageProps(locale), searchParams: Promise.resolve({ id: 'post-1' }),
    })).rejects.toThrow('REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({ href: '/blog/my-posts', locale });
  });
});

describe('博客私有页面的站内链接保留语言', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    mocks.isAdminSession.mockReturnValue(false);
  });

  it.each(['zh', 'en'])('投稿页 %s 的我的投稿与账号链接', async (locale) => {
    const html = renderLocalized(await SubmitPage(pageProps(locale)), locale);
    expect(html).toContain(`href="/${locale}/blog/my-posts"`);
    expect(html).toContain(`href="/${locale}/account"`);
  });

  it.each(['zh', 'en'])('我的投稿页 %s 的写作、账号与已发布文章链接', async (locale) => {
    mocks.getPostsByAuthor.mockResolvedValue([{
      id: 'post-1', title: 'Title', excerpt: 'Excerpt', sectionId: 'literature',
      status: 'published', updatedAt: '2026-10-01',
    }]);
    const html = renderLocalized(await MyPostsPage(pageProps(locale)), locale);
    expect(html).toContain(`href="/${locale}/blog/submit"`);
    expect(html).toContain(`href="/${locale}/account"`);
    expect(html).toContain(`href="/${locale}/blog/p/post-1"`);
  });

  it.each(['zh', 'en'])('收藏页 %s 的返回博客和空列表入口', async (locale) => {
    mocks.getUserFavoritePosts.mockResolvedValue([]);
    const html = renderLocalized(await FavoritesPage(pageProps(locale)), locale);
    expect(html.match(new RegExp(`href="/${locale}/blog"`, 'g'))).toHaveLength(2);
  });

  it.each(['zh', 'en'])('收藏页 %s 使用文章原 href 并添加当前语言', async (locale) => {
    mocks.getUserFavoritePosts.mockResolvedValue([{
      slug: 'post-1', href: '/blog/p/post-1', title: 'Title', excerpt: 'Excerpt',
      section: 'literature', date: '2026-10-01',
    }]);
    const html = renderLocalized(await FavoritesPage(pageProps(locale)), locale);
    expect(html).toContain(`href="/${locale}/blog"`);
    expect(html).toContain(`href="/${locale}/blog/p/post-1"`);
  });
});
