import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultMastersYear } from '@/lib/masters/types';

const mocks = vi.hoisted(() => ({ session: vi.fn(), admin: vi.fn(), list: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/masters/service', () => ({ listAdminMastersRounds: mocks.list }));
vi.mock('@/components/admin/MastersManager', () => ({ default: () => null }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

import MastersAdminPage, { generateMetadata } from '../page';

describe('硕士申请日历后台页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ userId: 'admin-1' });
    mocks.admin.mockReturnValue(true);
    mocks.list.mockResolvedValue([]);
  });

  it('无管理权限时不泄露页面标题，也不预先读取申请数据', async () => {
    mocks.admin.mockReturnValue(false);
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    expect((await generateMetadata(props)).title).toBe('Not found');
    await expect(MastersAdminPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'])('%s页面使用默认入学年份且不允许索引', async locale => {
    const props = { params: Promise.resolve({ locale }) };
    const metadata = await generateMetadata(props);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toContain(locale === 'en' ? 'Masters' : '硕士申请');
    expect(await MastersAdminPage(props)).toBeTruthy();
    expect(mocks.list).toHaveBeenCalledWith(defaultMastersYear());
  });
});
