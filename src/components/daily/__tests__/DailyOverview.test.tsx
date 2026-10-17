import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { DailyEdition } from '@/lib/daily/types';
import DailyOverview from '../DailyOverview';
import { getDailyEditionEntries } from '../state';
import { dailyText } from '../text';

const base: DailyEdition = {
  id: 'papers', date: '2026-10-17', channel: 'papers', status: 'published', title: '值得读的论文', summary: '摘要',
  content: { kind: 'papers', items: [{ id: 'one', title: '模型评测的新方法', summary: '摘要', url: 'https://example.com/paper', sourceName: 'Source', sourceType: 'official' }] },
  publishedAt: '2026-10-17T00:40:00Z', sourceKey: null, updatedAt: '2026-10-17T00:40:00Z',
};

describe('日刊概览呈现', () => {
  it('保留四类状态，草稿或不可读记录的标题不泄漏到概览', () => {
    const editions: DailyEdition[] = [base,
      { ...base, channel: 'ai', status: 'failed', content: null, title: '内部失败标题' },
      { ...base, channel: 'events', status: 'empty', content: null },
      { ...base, channel: 'open-source', status: 'draft', content: null, title: '内部草稿标题' },
      { ...base, channel: 'internships', content: null, title: '不可读内容标题' },
    ];
    const entries = getDailyEditionEntries(base.date, ['papers', 'ai', 'events', 'open-source', 'internships'], editions, []);
    const html = renderToStaticMarkup(<DailyOverview entries={entries} isToday showMasters={false} locale="zh" copy={dailyText.zh} />);
    expect(html).toContain('aria-label="今日概览"');
    expect(html).toContain('模型评测的新方法');
    expect(html).not.toContain('值得读的论文');
    for (const state of ['本期更新暂不可用', '本期暂无新内容', '尚未发布']) expect(html).toContain(state);
    for (const hidden of ['内部失败标题', '内部草稿标题', '不可读内容标题']) expect(html).not.toContain(hidden);
  });

  it('阅读进度只计所选可读栏目，申请日历作为独立入口', () => {
    const entries = getDailyEditionEntries(base.date, ['papers', 'events', 'masters'], [base], [`${base.date}:papers`, `${base.date}:events`, `${base.date}:ai`]);
    const html = renderToStaticMarkup(<DailyOverview entries={entries} isToday showMasters locale="zh" copy={dailyText.zh} />);
    expect(html).toContain('已读 1/1');
    expect(html).toContain('href="#masters"');
    expect(html).toContain('全年更新 · 单独查看');
    expect(html).not.toContain('href="#ai"');
  });

  it('英语按一节练习呈现，不混成文章总数；历史标题明确', () => {
    const english: DailyEdition = { ...base, id: 'english', channel: 'english', title: 'Small steps', content: {
      kind: 'english', vocabulary: [{ term: 'step', meaning: '一步', example: 'Take a step.', translation: '迈出一步。' }],
      passage: 'Take a small step.', questions: [{ question: 'Choose a word', options: ['step', 'stop'], answerIndex: 0, explanation: 'Read it again.' }],
    } };
    const entries = getDailyEditionEntries(base.date, ['english', 'papers'], [base, english], []);
    const html = renderToStaticMarkup(<DailyOverview entries={entries} isToday={false} showMasters={false} locale="en" copy={dailyText.en} />);
    expect(html).toContain('aria-label="Edition overview"');
    expect(html).toContain('1 English lesson');
    expect(html).toContain('1 item');
    expect(html).toContain('Read 0/2');
    expect(html).toContain('href="#english"');
    expect(html).not.toContain('Today at a glance');
  });

  it('零发布不展示0/0阅读进度，无日刊时不生成空导航', () => {
    const entries = getDailyEditionEntries(base.date, ['papers'], [], []);
    const html = renderToStaticMarkup(<DailyOverview entries={entries} isToday showMasters={false} locale="zh" copy={dailyText.zh} />);
    expect(html).not.toContain('0/0');
    expect(html).toContain('尚未发布');
    expect(renderToStaticMarkup(<DailyOverview entries={[]} isToday showMasters locale="zh" copy={dailyText.zh} />)).toBe('');
  });
});
