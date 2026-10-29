import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MastersCalendar from '../MastersCalendar';
import { mastersText } from '../text';
import { roundFixture } from './fixtures';

describe('月历按申请批次展示', () => {
  it('同校同项目的两个开放批次分别标出轮次、入学季和今天起的区间', () => {
    const base = roundFixture();
    const rounds = [
      { id: 'phase-2', name: '第2轮', end: '2026-11-29' },
      { id: 'phase-3', name: '第3轮', end: '2027-01-10' },
    ].map(item => roundFixture({ id: item.id, details: {
      ...base.details, opensOn: null, openingState: 'open', firstObservedOpenOn: '2026-10-12',
      roundName: item.name, intakeLabel: '2027/28 入学季', deadlineOn: item.end,
    } }));
    const html = renderToStaticMarkup(<MastersCalendar year={2027} rounds={rounds}
      now={new Date('2026-10-29T04:00:00Z')} locale="zh" copy={mastersText.zh} onSelectRound={() => {}} />);
    for (const item of rounds) {
      const row = html.match(new RegExp(`<li[^>]*data-calendar-round-id="${item.id}"[^>]*>([\\s\\S]*?)<\\/li>`))?.[1] ?? '';
      expect(row).toContain(item.details.roundName);
      expect(row).toContain('2027/28 入学季');
      expect(row).toContain(`2026-10-29 → ${item.details.deadlineOn}`);
    }
  });

  it('未来的官方申请区间明确显示尚未开放', () => {
    const base = roundFixture();
    const round = roundFixture({ details: { ...base.details, opensOn: '2026-10-30' } });
    const html = renderToStaticMarkup(<MastersCalendar year={2027} rounds={[round]}
      now={new Date('2026-10-29T04:00:00Z')} locale="zh" copy={mastersText.zh} onSelectRound={() => {}} />);
    const row = html.match(/<li[^>]*data-calendar-round-id="school-cs-2027-round1"[^>]*>([\s\S]*?)<\/li>/)?.[1] ?? '';
    expect(row).toContain('尚未开放');
  });

  it('超过六条并行色带时提供查看其余申请期的入口', () => {
    const base = roundFixture();
    const rounds = Array.from({ length: 7 }, (_, index) => roundFixture({ id: `phase-${index}`, details: {
      ...base.details, opensOn: null, openingState: 'open', roundName: `第${index + 1}轮`,
    } }));
    const html = renderToStaticMarkup(<MastersCalendar year={2027} rounds={rounds}
      now={new Date('2026-10-29T04:00:00Z')} locale="zh" copy={mastersText.zh} onSelectRound={() => {}} />);
    expect(html).toContain('2026-10-29 · 另有 1 个申请期，展开查看');
  });
});
