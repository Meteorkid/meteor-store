import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ session: vi.fn(), admin: vi.fn(), state: vi.fn() }));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/product-updates/service', () => ({ getProductUpdateState: mocks.state }));
vi.mock('../ProductUpdatesPanel', () => ({ default: () => null }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

import ProductUpdatesPage, { generateMetadata } from '../page';

beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ userId: 'admin-a' });
  mocks.admin.mockReturnValue(true);
  mocks.state.mockResolvedValue({ check: null, job: null, current: [], currentRevision: 'initial', catalogError: false });
});

describe('产品更新后台页面', () => {
  it.each(['guest', 'member'])('%s 不泄露标题、不读取私有目录', async identity => {
    if (identity === 'guest') mocks.session.mockResolvedValue(null);
    else mocks.admin.mockReturnValue(false);
    const props = { params: Promise.resolve({ locale: 'zh' }) };
    expect((await generateMetadata(props)).title).toBe('Not found');
    await expect(ProductUpdatesPage(props)).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mocks.state).not.toHaveBeenCalled();
  });

  it.each(['zh', 'en'])('%s: 页面只渲染带账号的面板并禁止索引', async locale => {
    const props = { params: Promise.resolve({ locale }) };
    const metadata = await generateMetadata(props);
    expect(metadata.title).toBe(locale === 'en' ? 'Product updates' : '产品更新');
    expect(metadata.robots).toEqual({ index: false, follow: false });
    const page = await ProductUpdatesPage(props);
    expect(page.props.userId).toBe('admin-a');
    expect(page.props.initialState).toEqual(await mocks.state.mock.results[0].value);
    expect(mocks.admin).toHaveBeenCalledWith({ userId: 'admin-a' });
  });
});
