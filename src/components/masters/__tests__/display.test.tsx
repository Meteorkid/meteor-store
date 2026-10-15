import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoundCard from '../RoundCard';
import MastersSummaryCard from '../MastersSummaryCard';
import { mastersText } from '../text';
import { roundFixture, watchFixture } from './fixtures';

vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));

describe('申请日历展示', () => {
  it('rolling与轮次并列，截止已过仍保留官方入口', () => {
    const round = roundFixture();
    const html = renderToStaticMarkup(<RoundCard round={{ ...round, details: { ...round.details, rolling: true, mayCloseEarly: true } }}
      now={new Date('2026-12-02T04:00:00Z')} locale="zh" copy={mastersText.zh}
      signedIn watchesReady busy={false} selected={false} selectionFull={false}
      onSelect={() => {}} onSave={() => {}} onRemove={() => {}} />);
    expect(html).toContain('Round 1');
    expect(html).toContain('滚动审理');
    expect(html).toContain('可能提前满额关闭');
    expect(html).toContain('截止日期已过');
    expect(html).not.toContain('官方已关闭');
    expect(html).not.toContain('官方确认正在接受申请');
    expect(html).toContain('href="https://example.edu/admissions"');
    expect(html).toContain('未披露精确时刻');
  });

  it('已有关注展示进度和独立提醒开关', () => {
    const html = renderToStaticMarkup(<RoundCard round={roundFixture()} watch={watchFixture()}
      now={new Date('2026-10-14T04:00:00Z')} locale="en" copy={mastersText.en}
      signedIn watchesReady busy={false} selected={false} selectionFull={false}
      onSelect={() => {}} onSave={() => {}} onRemove={() => {}} />);
    expect(html).toContain('Submitted');
    expect(html).toContain('No longer applying');
    expect(html).toContain('30, 7 and 1 day');
    expect(html).not.toContain('checked=""');
  });

  it('历史日刊第五入口明确是当前年度汇总', () => {
    const html = renderToStaticMarkup(<MastersSummaryCard year={2027} issueDate="2026-09-20" today="2026-10-14" locale="zh"
      summary={{ intakeYear: 2027, total: 5, opening: 2, closingSoon: 1, changed: 0 }} />);
    expect(html).toContain('不是 2026-09-20 的历史快照');
    expect(html).toContain('href="/masters?year=2027"');
    expect(html).toContain('不会自动开启申请提醒');
  });
});
