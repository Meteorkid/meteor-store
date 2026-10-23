import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoundCard from '../RoundCard';
import MastersSummaryCard from '../MastersSummaryCard';
import MastersHub from '../MastersHub';
import { mastersText } from '../text';
import { roundFixture, watchFixture } from './fixtures';

vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: null, loading: false }) }));

describe('申请日历展示', () => {
  it('收录范围按公开年份去重，不把筛选或私人关注计入学校项目数', () => {
    const base = roundFixture();
    const second = roundFixture({ id: 'second-round' });
    const otherYear = roundFixture({ id: 'other-year', intakeYear: 2028 });
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[base, second, otherYear]} userId={null} initialWatches={[]} watchedRounds={[]} />);
    expect(html).toContain('本年度已收录 1 所学校 · 1 个项目 · 2 个轮次');
    expect(html).toContain('目前有公开轮次的地区');
    expect(html).toContain('尚未收录不代表学校没有开放申请');
  });

  it('读取失败不把空数组误称为零覆盖', () => {
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[]} userId={null} initialWatches={[]} watchedRounds={[]} loadFailed />);
    expect(html).not.toContain('data-masters-coverage');
  });
  it('默认展示近期有效轮次，过期轮次仍可展开并保留官方信息', () => {
    const base = roundFixture();
    const past = roundFixture({ id: 'past-round', details: { ...base.details, deadlineOn: '2026-10-01' } });
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[past, base]} userId={null} initialWatches={[]} watchedRounds={[]} />);
    expect(html.indexOf(`id="round-${base.id}"`)).toBeLessThan(html.indexOf('id="round-past-round"'));
    const closedDetails = html.match(/<details([^>]*)><summary[^>]*>已过截止或官方关闭的轮次/);
    expect(closedDetails).not.toBeNull();
    expect(closedDetails![1]).not.toContain('open');
    expect(html).toContain('未来 30 天内');
    expect(html).toContain('未来 60 天内');
    expect(html).toContain('未来 90 天内');
    expect(html).toContain('href="https://example.edu/admissions"');
  });

  it('同项目后续轮次默认折叠，避免挤走其他项目的临近截止', () => {
    const near = roundFixture();
    const later = roundFixture({ id: 'later-round', details: { ...near.details, deadlineOn: '2027-02-01' } });
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[later, near]} userId={null} initialWatches={[]} watchedRounds={[]} />);
    const details = html.match(/<details([^>]*)><summary[^>]*>展开同项目其余 1 个轮次/);
    expect(details).not.toBeNull();
    expect(details![1]).not.toContain('open');
    expect(html.indexOf(`id="round-${near.id}"`)).toBeLessThan(html.indexOf('展开同项目其余 1 个轮次'));
    expect(html.indexOf('id="round-later-round"')).toBeGreaterThan(html.indexOf('展开同项目其余 1 个轮次'));
  });

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
