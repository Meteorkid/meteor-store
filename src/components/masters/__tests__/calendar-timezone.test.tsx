import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MastersCalendar from '../MastersCalendar';
import { mastersText } from '../text';
import { roundFixture } from './fixtures';

describe('月历北京时间边界', () => {
  it.each([
    ['2026-10-31T15:59:00Z', '2026 年 10 月', '31'],
    ['2026-10-31T16:00:00Z', '2026 年 11 月', '1'],
    ['2026-10-31T23:59:00Z', '2026 年 11 月', '1'],
    ['2026-11-01T00:00:00Z', '2026 年 11 月', '1'],
  ])('%s 的默认月份和今天标记保持北京时间一致', (now, month, day) => {
    const html = renderToStaticMarkup(<MastersCalendar year={2027} rounds={[roundFixture()]}
      now={new Date(now)} locale="zh" copy={mastersText.zh} onLocate={() => {}} />);
    expect(html).toContain(month);
    const today = html.match(/<p aria-current="date"[^>]*>([\s\S]*?)<\/p>/)?.[1];
    expect(today?.replace(/<[^>]*>/g, '')).toBe(day);
  });

  it('英文月历同样按北京时间跨月', () => {
    const html = renderToStaticMarkup(<MastersCalendar year={2027} rounds={[roundFixture()]}
      now={new Date('2026-10-31T17:00:00Z')} locale="en" copy={mastersText.en} onLocate={() => {}} />);
    expect(html).toContain('November 2026');
  });
});
