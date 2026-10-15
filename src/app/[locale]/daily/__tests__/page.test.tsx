import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getDailyEditions: vi.fn(), getDailyPreferences: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/daily/service', () => ({ getDailyEditions: mocks.getDailyEditions, getDailyPreferences: mocks.getDailyPreferences }));
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
    mocks.getDailyPreferences.mockResolvedValue(null);
  });
  afterEach(() => vi.useRealTimers());

  it.each(['2026-10-15', '2026-09-14', '2026-02-31', ['2026-10-14', '2026-10-13']])('拒绝越界或非法日期 %s', async date => {
    await expect(DailyPage({ params: Promise.resolve({ locale: 'zh' }), searchParams: Promise.resolve({ date }) })).rejects.toThrow('NOT_FOUND');
    expect(mocks.getDailyEditions).not.toHaveBeenCalled();
  });

  it('游客默认读北京时间今天，不查询账号设置', async () => {
    await DailyPage({ params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({}) });
    expect(mocks.getDailyEditions).toHaveBeenCalledWith('2026-10-14');
    expect(mocks.getDailyPreferences).not.toHaveBeenCalled();
  });

  it('偏好加载失败不会伪装成正常未设置，公共阅读仍可返回', async () => {
    mocks.getSession.mockResolvedValue({ userId: 'user-1' });
    mocks.getDailyPreferences.mockRejectedValue(new Error('database unavailable'));
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

});
