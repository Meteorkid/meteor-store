import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AnchorHTMLAttributes } from 'react';
import { defaultDailyPanelSettings, type DailyPreviewResponse } from '@/lib/daily/panel-types';
import { dailyEntryHref, dailyWordHref } from '@/lib/daily/navigation';

vi.mock('@/i18n/navigation', () => ({ Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));
vi.mock('@/lib/daily/panel-client', () => ({ useDailyPanel: vi.fn() }));
import { DailyPanelContent } from '../DailyNotificationPanel';

const preview: DailyPreviewResponse = {
  date: '2026-10-23', updatedAt: '2026-10-23T01:10:00Z', editions: [
    { channel: 'english', status: 'published', title: 'Daily English', updatedAt: null, totalCount: 5,
      content: { kind: 'english', vocabulary: Array.from({ length: 5 }, (_, index) => ({
        term: `word-${index + 1}`, meaning: `释义-${index + 1}`, example: `Example ${index + 1}.`, translation: `例句翻译 ${index + 1}。`,
      })) } },
    { channel: 'competitions', status: 'published', title: 'Contest Watch', updatedAt: null, totalCount: 1,
      content: { kind: 'competitions', items: [{ id: 'contest', title: 'Programming Round', summary: '官方编程赛事摘要。',
        url: 'https://codeforces.com/contests/1234', sourceName: 'Codeforces', sourceType: 'official', startAt: '2026-10-24T12:00:00Z', timeZone: 'UTC' }] } },
    { channel: 'internships', status: 'published', title: 'Internship', updatedAt: null, totalCount: 1,
      content: { kind: 'internships', items: [{ id: 'job', title: 'Software Intern', summary: '岗位摘要。', sourceName: 'Employer', sourceType: 'official',
        organization: 'Example Company', location: 'London', remoteStatus: 'hybrid', roleType: 'internship', verifiedAt: '2026-10-23T01:00:00Z' }] } },
    { channel: 'papers', status: 'unpublished', title: '', updatedAt: null, previousDate: '2026-10-21', totalCount: 0, content: null },
    { channel: 'ai', status: 'empty', title: '', updatedAt: null, totalCount: 0, content: null },
    { channel: 'events', status: 'failed', title: '', updatedAt: null, totalCount: 0, content: null },
  ],
};

describe('铃铛每日真实内容', () => {
  it('默认直接展示3词释义，例句与翻译在可展开的原生details内', () => {
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={defaultDailyPanelSettings()} locale="zh" />);
    expect(html).toContain('word-3');
    expect(html).not.toContain('word-4');
    expect(html).toContain('释义-1');
    expect(html).toContain('<details>');
    expect(html).not.toContain('<details open');
    expect(html).toContain('Example 1.');
    expect(html).toContain('例句翻译 1。');
    expect(html).not.toContain('answerIndex');
    expect(html).not.toContain('passage');
  });

  it('自定义词数和字段生效，默认展开例句与翻译后不再重复折叠', () => {
    const settings = defaultDailyPanelSettings(['english']);
    settings.itemCounts.english = 1;
    settings.english = { meaning: false, example: true, translation: true };
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={settings} locale="en" />);
    expect(html).toContain('word-1');
    expect(html).not.toContain('word-2');
    expect(html).not.toContain('释义-1');
    expect(html).toContain('Example 1.');
    expect(html).not.toContain('<details');
  });

  it('竞赛明确标为开赛时间，岗位展示真实地点，详情保持日期与全栏目视图', () => {
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={defaultDailyPanelSettings()} locale="zh" />);
    expect(html).toContain('开赛时间');
    expect(html).not.toContain('报名截止');
    expect(html).toContain('London');
    expect(html).toContain('混合办公');
    expect(html).toContain('Example Company');
    expect(html).toContain('date=2026-10-23&amp;view=all#competitions');
    expect(html).toContain('href="https://codeforces.com/contests/1234"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('区分未发布、无新增和获取失败，历史回看明确标注原日期', () => {
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={defaultDailyPanelSettings()} locale="zh" />);
    expect(html).toContain('本期尚未发布');
    expect(html).toContain('本期暂无新增');
    expect(html).toContain('本期内容获取失败');
    expect(html).toContain('回看 2026-10-21 期');
    expect(html).toContain('date=2026-10-21&amp;view=all#papers');
  });

  it('明确空选保持为空，设置顺序直接决定展示顺序', () => {
    const empty = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={defaultDailyPanelSettings([])} locale="zh" />);
    expect(empty).toContain('还没有选择展示栏目');
    expect(empty).not.toContain('word-1');
    const ordered = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={defaultDailyPanelSettings(['internships', 'english'])} locale="zh" />);
    expect(ordered.indexOf('Software Intern')).toBeLessThan(ordered.indexOf('word-1'));
  });

  it('关闭摘要来源日期只影响展示，缺失原文URL仍有站内详情', () => {
    const settings = { ...defaultDailyPanelSettings(['internships']), showSummary: false, showSource: false, showDates: false };
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={settings} locale="en" />);
    expect(html).toContain('Software Intern');
    expect(html).toContain('date=2026-10-23&amp;view=all#internships');
    expect(html).not.toContain('岗位摘要');
    expect(html).not.toContain('London');
    expect(html).not.toContain('Employer');
    expect(html).not.toContain('undefined');
  });

  it('隐藏无内容栏目后保留已发布栏目', () => {
    const settings = { ...defaultDailyPanelSettings(), hideEmpty: true };
    const html = renderToStaticMarkup(<DailyPanelContent preview={preview} settings={settings} locale="zh" />);
    expect(html).toContain('word-1');
    expect(html).not.toContain('每日论文');
    expect(html).toContain('本期内容获取失败');
  });

  it('最近一期始终标注原日期与当日状态，词汇与条目链接使用原期次和精确锚点', () => {
    const settings = { ...defaultDailyPanelSettings(['english', 'internships']), showDates: false };
    const recent: DailyPreviewResponse = { ...preview, date: '2026-10-24', editions: preview.editions.map(edition => ({
      ...edition, contentDate: '2026-10-23', currentStatus: 'unpublished',
    })) };
    const html = renderToStaticMarkup(<DailyPanelContent preview={recent} settings={settings} locale="zh" />);
    expect(html).toContain('最近一期');
    expect(html).toContain('dateTime="2026-10-23"');
    expect(html).toContain('2026-10-24 ·');
    expect(html).toContain('本期尚未发布');
    expect(html).toContain(dailyWordHref('2026-10-23', 'word-1', 0).replaceAll('&', '&amp;'));
    expect(html).toContain(dailyEntryHref('2026-10-23', 'internships', 'job').replaceAll('&', '&amp;'));
  });

  it('隐藏空栏目不会隐藏当日失败，最近一期仍可阅读', () => {
    const settings = { ...defaultDailyPanelSettings(['english']), hideEmpty: true };
    const recent: DailyPreviewResponse = { ...preview, date: '2026-10-24', editions: [{
      ...preview.editions[0], contentDate: '2026-10-23', currentStatus: 'failed',
    }] };
    const html = renderToStaticMarkup(<DailyPanelContent preview={recent} settings={settings} locale="zh" />);
    expect(html).toContain('本期内容获取失败'); expect(html).toContain('word-1');
    expect(html).not.toContain('无内容栏目已隐藏');
  });

  it('核验时间排在来源初次日期之前，中文时区显示北京时间', () => {
    const edition = preview.editions.find(item => item.channel === 'internships')!;
    const opportunity: DailyPreviewResponse = { ...preview, editions: [{ ...edition, content: {
      kind: 'internships', items: [{ id: 'job', title: 'Graduate Role', summary: '机会', sourceName: 'Employer', sourceType: 'official',
        sourcePublishedAt: '2023-01-01T00:00:00Z', verifiedAt: '2026-10-23T01:00:00Z' }],
    } }] };
    const html = renderToStaticMarkup(<DailyPanelContent preview={opportunity} settings={defaultDailyPanelSettings(['internships'])} locale="zh" />);
    expect(html.indexOf('核验时间')).toBeLessThan(html.indexOf('来源日期'));
    expect(html).toContain('北京时间'); expect(html).not.toContain('Asia/Shanghai');
  });
});
