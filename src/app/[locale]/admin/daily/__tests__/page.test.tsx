import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyDate } from '@/lib/daily/types';

const mocks = vi.hoisted(() => ({ session: vi.fn(), isAdmin: vi.fn(), list: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/daily/service', () => ({ listDailyEditions: mocks.list }));
vi.mock('@/components/admin/DailyManager', () => ({ default: () => null }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

import DailyAdminPage, { generateMetadata } from '../page';

describe('每日一新后台页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ userId: 'admin-1' });
    mocks.isAdmin.mockReturnValue(true);
    mocks.list.mockResolvedValue([]);
  });

  it('无权限时标题保密，页面在读取内容前就拒绝访问', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    expect((await generateMetadata(props)).title).toBe('Not found');
    await expect(DailyAdminPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'])('管理员可读取北京时间当天期刊，%s 页面禁止索引', async locale => {
    const props = { params: Promise.resolve({ locale }) };
    const metadata = await generateMetadata(props);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toContain(locale === 'zh' ? '每日一新' : 'Daily Fresh');
    expect(await DailyAdminPage(props)).toBeTruthy();
    expect(mocks.list).toHaveBeenCalledWith(dailyDate());
  });
});
