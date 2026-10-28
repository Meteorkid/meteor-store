import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getDailyEditions: vi.fn(), getDailyPreferencesState: vi.fn(), getLatestPublishedDailyDates: vi.fn(), getMastersSummary: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/daily/service', () => ({ getDailyEditions: mocks.getDailyEditions, getDailyPreferencesState: mocks.getDailyPreferencesState, getLatestPublishedDailyDates: mocks.getLatestPublishedDailyDates }));
vi.mock('@/lib/masters/service', () => ({ getMastersSummary: mocks.getMastersSummary }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NOT_FOUND'); } }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/daily/DailyHub', () => ({
  default: (props: Record<string, unknown>) => <pre>{JSON.stringify(props)}</pre>,
}));

import DailyPage from '../page';

describe('每日阅读服务端页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T01:00:00Z'));
    mocks.getSession.mockResolvedValue(null);
    mocks.getDailyEditions.mockResolvedValue([]);
    mocks.getDailyPreferencesState.mockResolvedValue({ preferences: null, revision: null });
    mocks.getLatestPublishedDailyDates.mockResolvedValue({ events: '2026-10-07' });
    mocks.getMastersSummary.mockResolvedValue({ intakeYear: 2027, total: 0, opening: 0, closingSoon: 0, changed: 0 });
  });
  afterEach(() => vi.useRealTimers());

  it.each(['2026-10-15', '2026-09-14', '2026-02-31', ['2026-10-14', '2026-10-13']])('拒绝越界或非法日期 %s', async date => {
    await expect(DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ date }) })).rejects.toThrow('NOT_FOUND');
    expect(mocks.getDailyEditions).not.toHaveBeenCalled();
  });

  it('游客默认读北京时间今天，不查询账号设置', async () => {
    await DailyPage({ params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({}) });
    expect(mocks.getDailyEditions).toHaveBeenCalledWith('2026-10-14');
    expect(mocks.getDailyPreferencesState).not.toHaveBeenCalled();
  });

  it('全栏目深链传递临时视图，不覆盖账号的明确空选', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-1' });
    mocks.getDailyPreferencesState.mockResolvedValue({ preferences: { channels: [], reminders: false }, revision: '2026-10-14T01:00:00.000Z' });
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ date: '2026-10-01', view: 'all' }) });
    const html = renderToStaticMarkup(page);
    expect(html).toContain('&quot;viewAll&quot;:true');
    expect(html).toContain('&quot;channels&quot;:[]');
    expect(html).toContain('&quot;initialPreferencesRevision&quot;:&quot;2026-10-14T01:00:00.000Z&quot;');
    expect(mocks.getDailyEditions).toHaveBeenCalledWith('2026-10-01');
  });

  it.each([undefined, 'following', ['all', 'following']])('普通或未知视图 %s 保持原有偏好行为', async view => {
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ view }) });
    expect(renderToStaticMarkup(page)).toContain('&quot;viewAll&quot;:false');
  });

  it('偏好加载失败不会伪装成正常未设置，公共阅读仍可返回', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-1' });
    mocks.getDailyPreferencesState.mockRejectedValue(new Error('database unavailable'));
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(page);
    expect(html).toContain('&quot;preferencesFailed&quot;:true');
    expect(html).toContain('&quot;loadFailed&quot;:false');
  });

  it('内容读取失败保留独立错误状态', async () => {
    mocks.getDailyEditions.mockRejectedValue(new Error('database unavailable'));
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({}) });
    expect(renderToStaticMarkup(page)).toContain('&quot;loadFailed&quot;:true');
  });

  it('历史日刊也读取当前申请汇总，而不是使用历史日刊日期', async () => {
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ date: '2026-10-01' }) });
    expect(mocks.getDailyEditions).toHaveBeenCalledWith('2026-10-01');
    expect(mocks.getMastersSummary).toHaveBeenCalledWith();
    expect(renderToStaticMarkup(page)).toContain('&quot;intakeYear&quot;:2027');
  });

  it('历史期次映射按所选日期读取，失败不影响本期正文', async () => {
    mocks.getSession.mockResolvedValue(null);
    mocks.getDailyEditions.mockResolvedValue([]);
    mocks.getLatestPublishedDailyDates.mockResolvedValue({ events: '2026-10-07' });
    const selected = '2026-10-12';
    const page = await DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ date: selected }) });
    expect(mocks.getLatestPublishedDailyDates).toHaveBeenCalledWith(selected);
    expect(renderToStaticMarkup(page)).toContain('&quot;previousPublishedDates&quot;:{&quot;events&quot;:&quot;2026-10-07&quot;}');
    mocks.getLatestPublishedDailyDates.mockRejectedValue(new Error('history unavailable'));
    const failed = await DailyPage({ params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({ date: selected }) });
    expect(renderToStaticMarkup(failed)).toContain('&quot;previousPublishedDatesFailed&quot;:true');
    expect(renderToStaticMarkup(failed)).toContain('&quot;loadFailed&quot;:false');
  });
});
