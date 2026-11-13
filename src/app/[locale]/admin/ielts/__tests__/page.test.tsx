import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ session: vi.fn(), isAdmin: vi.fn(), rows: vi.fn(), pairs: vi.fn(), curated: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.isAdmin }));
vi.mock('@/lib/ielts/catalog', () => ({
  listIeltsPairRows: mocks.rows, listIeltsPairs: mocks.pairs, validCuratedPairs: mocks.curated,
}));
vi.mock('@/components/admin/AdminIeltsManager', () => ({ default: () => null }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

import IeltsAdminPage, { generateMetadata } from '../page';

/** 页面自己那道鉴权：无权限时既不泄露标题，也在取数之前就停下。 */
describe('雅思写作对照后台页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ userId: 'admin-1' });
    mocks.isAdmin.mockReturnValue(true);
    mocks.rows.mockResolvedValue([]);
    mocks.pairs.mockResolvedValue([]);
    mocks.curated.mockReturnValue([]);
  });

  it('无权限时标题保密，页面在读取内容前就拒绝访问', async () => {
    mocks.isAdmin.mockReturnValue(false);
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    expect((await generateMetadata(props)).title).toBe('Not found');
    await expect(IeltsAdminPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.rows).not.toHaveBeenCalled();
    expect(mocks.pairs).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'])('管理员可读取数据库行与公开列表，%s 页面禁止索引', async locale => {
    const props = { params: Promise.resolve({ locale }) };
    const metadata = await generateMetadata(props);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toContain(locale === 'zh' ? '雅思写作对照' : 'IELTS writing pairs');
    expect(await IeltsAdminPage(props)).toBeTruthy();
    expect(mocks.rows).toHaveBeenCalled();
    expect(mocks.pairs).toHaveBeenCalled();
  });
});
