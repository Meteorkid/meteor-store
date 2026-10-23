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


describe('空栏目回看与覆盖范围', () => {
  it('空栏目直达最近有内容期次，临时全部视图不写关注设置', () => {
    const html = renderToStaticMarkup(<DailyHub {...baseProps} viewAll previousPublishedDates={{ events: '2026-10-10' }} editions={[{
      id: 'empty-events', date: baseProps.date, channel: 'events', status: 'empty', title: '', summary: '', content: null,
      sourceKey: null, publishedAt: null, updatedAt: '2026-10-15T00:00:00Z',
    }]} />);
    expect(html).toContain('href="/daily?date=2026-10-10&amp;view=all#events"');
    expect(html).toContain('阅读最近有内容的一期');
    expect(html).toContain('已核验的接入来源中暂无未入选的新内容');
    expect(html).toContain('Codeforces');
    expect(html).toContain('Databricks');
    expect(html).toContain('Scale AI');
    expect(html).toContain('主要覆盖海外');
    expect(html).toContain('OpenAI');
  });

  it('旧刊的通用实习标题也按新栏目名称呈现，不改写历史记录', () => {
    const edition: DailyHubProps['editions'][number] = {
      id: 'old-internships', date: baseProps.date, channel: 'internships', status: 'published', title: '每日实习机会', summary: '',
      content: { kind: 'internships', items: [{ id: 'role', title: 'New Grad Engineer', summary: '岗位摘要', url: 'https://example.com/job', sourceName: 'Employer', sourceType: 'official' }] },
      sourceKey: null, publishedAt: '2026-10-15T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z',
    };
    const html = renderToStaticMarkup(<DailyHub {...baseProps} viewAll editions={[edition]} />);
    expect(html).not.toContain('每日实习机会');
    expect(html).toContain('实习与应届机会');
    expect(edition.title).toBe('每日实习机会');
  });

  it('没有历史、历史读取失败和本期更新失败保留不同状态', () => {
    const empty = renderToStaticMarkup(<DailyHub {...baseProps} viewAll />);
    expect(empty).toContain('可回看范围内没有更早的已发布期次');
    const failed = renderToStaticMarkup(<DailyHub {...baseProps} viewAll previousPublishedDatesFailed editions={[{
      id: 'failed-events', date: baseProps.date, channel: 'events', status: 'failed', title: '', summary: '', content: null,
      sourceKey: null, publishedAt: null, updatedAt: '2026-10-15T00:00:00Z',
    }]} />);
    expect(failed).toContain('历史期次暂时无法读取');
    expect(failed).toContain('内容获取遇到问题');
    expect(failed).not.toContain('已核验的接入来源中暂无未入选的新内容');
  });
});
