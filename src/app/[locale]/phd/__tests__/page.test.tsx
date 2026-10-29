import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), listPhdRounds: vi.fn(), getPhdWatches: vi.fn(), getPhdRoundsByIds: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/phd/service', () => ({ listPhdRounds: mocks.listPhdRounds, getPhdWatches: mocks.getPhdWatches, getPhdRoundsByIds: mocks.getPhdRoundsByIds }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND'); } }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/masters/MastersHub', () => ({ default: (props: Record<string, unknown>) => <pre>{JSON.stringify(props)}</pre> }));

import PhdPage, { generateMetadata } from '../page';

describe('博士申请日历页面', () => {
  it.each(['zh', 'en'])('%s元数据使用博士标题与独立范围', async locale => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
    expect(metadata.title).toContain(locale === 'en' ? 'PhD' : '博士');
    expect(metadata.description).toContain(locale === 'en' ? 'computer science and AI' : '计算机与人工智能');
  });
  beforeEach(() => {
    vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-14T04:00:00Z'));
    mocks.getSession.mockResolvedValue(null);
    mocks.listPhdRounds.mockResolvedValue([]);
    mocks.getPhdWatches.mockResolvedValue([]);
    mocks.getPhdRoundsByIds.mockResolvedValue([]);
  });
  afterEach(() => vi.useRealTimers());

  it('游客默认看下一入学年，不查询私人关注', async () => {
    const page = await PhdPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    expect(renderToStaticMarkup(page)).toContain('&quot;kind&quot;:&quot;phd&quot;');
    expect(mocks.listPhdRounds).toHaveBeenCalledWith(2027);
    expect(mocks.getPhdWatches).not.toHaveBeenCalled();
  });

  it('支持往年入学项目，不受日刊30天窗口限制', async () => {
    await PhdPage({ params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({ year: '2024' }) });
    expect(mocks.listPhdRounds).toHaveBeenCalledWith(2024);
  });

  it.each(['2019', '2101', '2027abc', ''])('拒绝非法年份 %s', async year => {
    await expect(PhdPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ year }) })).rejects.toThrow('NOT_FOUND');
    expect(mocks.listPhdRounds).not.toHaveBeenCalled();
  });

  it('另外按关注ID读取跨年公开轮次', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getPhdWatches.mockResolvedValue([{ roundId: '2027-a' }, { roundId: '2028-b' }, { roundId: 'hidden' }]);
    await PhdPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ year: '2027' }) });
    expect(mocks.getPhdRoundsByIds).toHaveBeenCalledWith(['2027-a', '2028-b', 'hidden']);
  });

  it('关联轮次查询失败不伪装成全部下架', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-a' });
    mocks.getPhdWatches.mockResolvedValue([{ roundId: '2027-a' }]);
    mocks.getPhdRoundsByIds.mockRejectedValue(new Error('database unavailable'));
    const page = await PhdPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    expect(renderToStaticMarkup(page)).toContain('&quot;watchesFailed&quot;:true');
  });
});
