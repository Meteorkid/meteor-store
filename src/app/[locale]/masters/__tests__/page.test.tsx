import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), listMastersRounds: vi.fn(), getMastersWatches: vi.fn(), getMastersRoundsByIds: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/masters/service', () => ({ listMastersRounds: mocks.listMastersRounds, getMastersWatches: mocks.getMastersWatches, getMastersRoundsByIds: mocks.getMastersRoundsByIds }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND'); } }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/masters/MastersHub', () => ({ default: (props: Record<string, unknown>) => <pre>{JSON.stringify(props)}</pre> }));

import MastersPage from '../page';

describe('全年申请日历页面', () => {
  beforeEach(() => {
    vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-14T04:00:00Z'));
    mocks.getSession.mockResolvedValue(null);
    mocks.listMastersRounds.mockResolvedValue([]);
    mocks.getMastersWatches.mockResolvedValue([]);
    mocks.getMastersRoundsByIds.mockResolvedValue([]);
  });
  afterEach(() => vi.useRealTimers());

  it('游客默认看下一入学年，不查询私人关注', async () => {
    await MastersPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    expect(mocks.listMastersRounds).toHaveBeenCalledWith(2027);
    expect(mocks.getMastersWatches).not.toHaveBeenCalled();
  });

  it('支持往年入学项目，不受日刊30天窗口限制', async () => {
    await MastersPage({ params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({ year: '2024' }) });
    expect(mocks.listMastersRounds).toHaveBeenCalledWith(2024);
  });

  it.each(['2019', '2101', '2027abc', ''])('拒绝非法年份 %s', async year => {
    await expect(MastersPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ year }) })).rejects.toThrow('NOT_FOUND');
    expect(mocks.listMastersRounds).not.toHaveBeenCalled();
  });

  it('另外按关注ID读取跨年公开轮次', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getMastersWatches.mockResolvedValue([{ roundId: '2027-a' }, { roundId: '2028-b' }, { roundId: 'hidden' }]);
    await MastersPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ year: '2027' }) });
    expect(mocks.getMastersRoundsByIds).toHaveBeenCalledWith(['2027-a', '2028-b', 'hidden']);
  });

  it('关联轮次查询失败不伪装成全部下架', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getMastersWatches.mockResolvedValue([{ roundId: '2027-a' }]);
    mocks.getMastersRoundsByIds.mockRejectedValue(new Error('database unavailable'));
    const page = await MastersPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    expect(renderToStaticMarkup(page)).toContain('&quot;watchesFailed&quot;:true');
  });
});
