import { renderToStaticMarkup } from 'react-dom/server';
import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../../../messages/zh.json';
import en from '../../../../../messages/en.json';
const state = vi.hoisted(() => ({ locale: 'zh', allowed: true, getStats: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('not_found'); } }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn(), getTranslations: async () => (key: string) => (state.locale === 'en' ? en : zh).AdminDashboardPage[key as keyof typeof zh.AdminDashboardPage] }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} href={`/${state.locale}${href}`} /> }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: async () => ({ userId: 'admin' }) }));
vi.mock('@/lib/admin', () => ({ isAdminSession: () => state.allowed }));
vi.mock('@/lib/admin-stats', () => ({ getAdminStats: state.getStats }));
import Page from '../page';
const stats = { totalPosts: 9, publishedPosts: 6, pendingPosts: 3, totalComments: 5, pendingComments: 2, pendingReports: 1, pendingFeedback: 4, totalUsers: 8, activePassCount: 7, passMonthly: 3, passAnnual: 2, passLifetime: 2, inviteRedemptionCount: 1 };
const targets = ['/admin/posts', '/admin/posts', '/admin/review', '/admin/comments', '/admin/comments', '/admin/reports?status=pending', '/admin/feedback', '/admin/users', '/admin/commerce', '/admin/commerce', '/admin/commerce', '/admin/commerce', '/admin/users'];
beforeEach(() => { state.locale = 'zh'; state.allowed = true; state.getStats.mockReset().mockResolvedValue(stats); });
describe('后台概述统计卡片跳转', () => {
  it.each(['zh', 'en'])('%s 每张完整卡片均是对应管理模块的本地化链接', async locale => {
    state.locale = locale;
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ locale }) }));
    const cards = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(cards.map(card => card[1])).toEqual(targets.map(href => `/${locale}${href}`));
    for (const card of cards) {
      expect(card[2]).toMatch(/<p[^>]*>\d+<\/p>/);
      expect(card[2]).toContain('aria-hidden="true"');
    }
    expect(html).toContain(locale === 'en' ? 'View details' : '查看详情');
  });
  it('统计为0仍然能进入列表，不把管理入口禁用', async () => {
    state.getStats.mockResolvedValue(Object.fromEntries(Object.keys(stats).map(key => [key, 0])));
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ locale: 'zh' }) }));
    expect([...html.matchAll(/<a\b/g)]).toHaveLength(13);
    expect(html).not.toContain('aria-disabled');
  });
  it('非管理员在取统计和渲染跳转前被拒绝', async () => {
    state.allowed = false;
    await expect(Page({ params: Promise.resolve({ locale: 'zh' }) })).rejects.toThrow('not_found');
    expect(state.getStats).not.toHaveBeenCalled();
  });
});
