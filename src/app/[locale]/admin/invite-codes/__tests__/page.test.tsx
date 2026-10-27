import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ session: vi.fn(), admin: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn(), getTranslations: async () => (key: string) => ({ metaTitle: '历史邀请码', metaNotFound: 'Not found', title: '历史邀请码', legacyHint: '已发邀请码按原期限和次数继续有效', manageUsers: '前往账号管理赠送激活码' } as Record<string, string>)[key] ?? key }));
vi.mock('@/components/InviteCodeManager', () => ({ default: () => <div>历史列表</div> }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a> }));
import InviteCodesPage, { generateMetadata } from '../page';

beforeEach(() => { mocks.session.mockResolvedValue({ userId: 'admin' }); mocks.admin.mockReturnValue(true); });

describe('历史邀请码后台页', () => {
  it('直接访问可查看历史说明与账号管理链接，禁止搜索索引', async () => {
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    const html = renderToStaticMarkup(await InviteCodesPage(props));
    expect(html).toContain('已发邀请码按原期限和次数继续有效');
    expect(html).toContain('href="/admin/users"');
    expect(html).toContain('历史列表');
    expect((await generateMetadata(props)).robots).toEqual({ index: false, follow: false });
  });
  it('非管理员仍看不到后台和标题', async () => {
    mocks.admin.mockReturnValue(false);
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    await expect(InviteCodesPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    expect((await generateMetadata(props)).title).toBe('Not found');
  });
});
