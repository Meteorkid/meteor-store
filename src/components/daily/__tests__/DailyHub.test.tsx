import type { AnchorHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/i18n/navigation', () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
  useRouter: () => mocks,
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'user-1' }, loading: false }) }));

import DailyHub, { type DailyHubProps } from '../DailyHub';
import { DAILY_EDITION_CHANNEL_IDS } from '@/lib/daily/channels';

const baseProps: DailyHubProps = {
  date: '2026-10-15', today: '2026-10-16', editions: [], userId: 'user-1',
  initialPreferences: { channels: [], reminders: false },
};

describe('日刊栏目深链', () => {
  beforeEach(() => vi.clearAllMocks());

  it('今日空刊显示首刊时间与保留全部视图的上一期入口', () => {
    const html = renderToStaticMarkup(<DailyHub {...baseProps} date={baseProps.today} viewAll />);
    expect(html).toContain('08:40');
    expect(html).toContain('阅读上一期');
    expect(html).toContain('href="/daily?date=2026-10-15&amp;view=all"');
    expect(html).not.toContain('本期内容更新于');
  });

  it('更新时间只取已发布正文，不把失败尝试当成功更新', () => {
    const editions: DailyHubProps['editions'] = [{ id: 'papers', date: baseProps.date, channel: 'papers', status: 'published', title: 'Paper', summary: '', content: { kind: 'papers', items: [] }, sourceKey: null, publishedAt: '2026-10-15T00:40:00Z', updatedAt: '2026-10-15T01:40:00Z' }, { id: 'ai', date: baseProps.date, channel: 'ai', status: 'failed', title: '', summary: '', content: null, sourceKey: null, publishedAt: null, updatedAt: '2026-10-15T10:40:00Z' }];
    const html = renderToStaticMarkup(<DailyHub {...baseProps} editions={editions} viewAll />);
    expect(html).toContain('dateTime="2026-10-15T01:40:00Z"');
    expect(html).not.toContain('dateTime="2026-10-15T10:40:00Z"');
  });

  it('全栏目深链的首屏就有每个目标，即使账号明确空选', () => {
    const preferences = { channels: [], reminders: false };
    const html = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={preferences} viewAll />);
    for (const channel of DAILY_EDITION_CHANNEL_IDS) expect(html).toContain(`id="${channel}"`);
    expect(preferences).toEqual({ channels: [], reminders: false });
    expect(html).toContain('href="/daily?view=all"');
  });

  it('普通访问仍尊重账号的空选或单栏目选择', () => {
    const empty = renderToStaticMarkup(<DailyHub {...baseProps} />);
    expect(empty).toContain('还没有关注任何栏目');
    expect(empty).not.toContain('id="english"');
    const following = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={{ channels: ['papers'], reminders: false }} />);
    expect(following).toContain('id="papers"');
    expect(following).not.toContain('id="english"');
  });

  it('本期概览直达可见正文，不覆盖历史日期或关注设置', () => {
    const html = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={{ channels: ['papers', 'ai'], reminders: false }} />);
    expect(html).toContain('aria-label="本期概览"');
    expect(html).toContain('href="#papers"');
    expect(html).toContain('href="#ai"');
    expect(html).not.toContain('href="#english"');
    expect(html).toContain('value="2026-10-15"');
  });

  it('读取失败不渲染概览中的空计数和不存在的正文锚点', () => {
    const html = renderToStaticMarkup(<DailyHub {...baseProps} viewAll loadFailed />);
    expect(html).toContain('今天的内容暂时无法读取');
    expect(html).not.toContain('aria-label="本期概览"');
    expect(html).not.toContain('href="#papers"');
  });

  it('只关注全年日历时没有日刊概览或0/0进度', () => {
    const html = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={{ channels: ['masters'], reminders: false }} />);
    expect(html).toContain('id="masters"');
    expect(html).not.toContain('aria-label="本期概览"');
    expect(html).not.toContain('0/0');
  });
});
