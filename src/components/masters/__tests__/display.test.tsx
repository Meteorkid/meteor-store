import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoundCard from '../RoundCard';
import MastersSummaryCard from '../MastersSummaryCard';
import MastersHub from '../MastersHub';
import MastersCalendar from '../MastersCalendar';
import MastersTimeline from '../MastersTimeline';
import { mastersText } from '../text';
import { mastersCalendarHue } from '@/lib/masters/calendar';
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
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[past, base]} userId={null} initialWatches={[]} watchedRounds={[]} initialMode="list" />);
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
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[later, near]} userId={null} initialWatches={[]} watchedRounds={[]} initialMode="list" />);
    const details = html.match(/<details([^>]*)><summary[^>]*>展开同项目其余 1 个轮次/);
    expect(details).not.toBeNull();
    expect(details![1]).not.toContain('open');
    expect(html.indexOf(`id="round-${near.id}"`)).toBeLessThan(html.indexOf('展开同项目其余 1 个轮次'));
    expect(html.indexOf('id="round-later-round"')).toBeGreaterThan(html.indexOf('展开同项目其余 1 个轮次'));
  });

  it('默认进日历视图，列表需显式切换', () => {
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[roundFixture()]} userId={null} initialWatches={[]} watchedRounds={[]} />);
    expect(html).toContain('aria-label="申请视图"');
    expect(html).toContain('申请日历');
    expect(html).toContain('本月 1 个开放 · 0 个截止');
    // 日历模式不渲染导出选择区：那是列表卡片的操作
    expect(html).not.toContain('加入日历导出');
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

describe('可视化日历', () => {
  const calendar = (rounds: Parameters<typeof MastersCalendar>[0]['rounds'], now = new Date('2026-10-14T04:00:00Z')) =>
    renderToStaticMarkup(<MastersCalendar year={2027} rounds={rounds} now={now} locale="zh" copy={mastersText.zh} onLocate={() => {}} />);

  it('把轮次投影到对应日期格，并标出开放与截止', () => {
    const html = calendar([roundFixture()]);
    expect(html).toContain('申请日历');
    expect(html).toContain('2026 年 10 月');
    // 开放日 2026-10-01 与截止日 2026-12-01 分属不同月份，10 月只显示开放
    expect(html).toContain('开放 · Example University');
    expect(html).toContain('本月 1 个开放 · 0 个截止');
  });

  it('默认停在今天所在月，越界时贴到有内容的月份', () => {
    // 今天 2026-10 在范围内 → 停在 10 月
    expect(calendar([roundFixture()])).toContain('2026 年 10 月');
    // 全部节点都在 12 月 → 贴到 2026 年 12 月
    const december = roundFixture({ details: { ...roundFixture().details, opensOn: null, deadlineOn: '2026-12-01' } });
    expect(calendar([december])).toContain('2026 年 12 月');
  });

  it('未公布截止的轮次单独列出，不画进网格', () => {
    const base = roundFixture();
    const pending = roundFixture({ id: 'pending', details: { ...base.details, deadlineStatus: 'unannounced', deadlineOn: null, opensOn: null } });
    const html = calendar([pending]);
    expect(html).toContain('日期待确认 (1)');
    expect(html).toContain('截止未公布');
    expect(html).toContain('不进网格');
  });

  it('提供翻月控件与图例', () => {
    const html = calendar([roundFixture()]);
    expect(html).toContain('aria-label="上一个月"');
    expect(html).toContain('aria-label="下一个月"');
    expect(html).toContain('图例');
    expect(html).toContain('按北京时间归入当天');
  });

  it('官方公布开放日时画出确定起点的申请期色带', () => {
    const base = roundFixture();
    const html = calendar([base]);
    // 色带用 hsl 内联色，同校稳定；起点收口、末日收口
    expect(html).toContain('data-span-lane');
    expect(html).toContain('hsl(');
    expect(html).toContain('Example University · MSc Computer Science');
    expect(html).toContain('本月 1 段申请期');
  });

  it('起点未公布时从核验日起画并标为未知，不虚构开放日', () => {
    const base = roundFixture();
    const openEnded = roundFixture({
      details: { ...base.details, opensOn: null, openingState: 'open' },
      verifiedOn: '2026-10-05',
    });
    const html = calendar([openEnded]);
    // 起点未知用斜纹淡出，展开面板写明是持续中
    expect(html).toContain('repeating-linear-gradient');
    expect(html).toContain('起止日均已公布');
    expect(html).toContain('起点未公布，从核验日画起');
    // 不把核验日说成开放日
    expect(html).not.toContain('开放 · Example University');
  });

  it('只有截止日、开放状态未知的轮次不画色带', () => {
    const base = roundFixture();
    const deadlineOnly = roundFixture({ details: { ...base.details, opensOn: null, openingState: 'unknown' } });
    const html = calendar([deadlineOnly]);
    expect(html).not.toContain('data-span-lane');
    // 摘要行只在该月有申请期时才出现
    expect(html).not.toContain('本月 1 段申请期');
    // 截止节点仍然照常显示
    expect(html).toContain('本月 0 个开放 · 1 个截止');
  });

  it('同项目重叠轮次合并成一条色带，各轮截止保留刻度', () => {
    const base = roundFixture();
    const later = roundFixture({ id: 'later', details: { ...base.details, deadlineOn: '2027-02-01' } });
    const html = calendar([base, later]);
    // 两轮同项目且区间重叠 → 合并为一段，不是两条叠色
    expect(html).toContain('本月 1 段申请期');
    expect(html).toContain('2 个节点');
  });

  it('同校在任何月份用同一色相，颜色不随渲染顺序漂移', () => {
    const base = roundFixture();
    const hue = (html: string) => (html.match(/hsl\((\d+)/) ?? [])[1];
    const forward = hue(calendar([base, roundFixture({ id: 'other', details: { ...base.details, university: '另一所大学' } })]));
    const reversed = hue(calendar([roundFixture({ id: 'other', details: { ...base.details, university: '另一所大学' } }), base]));
    expect(forward).toBe(reversed);
  });
});

describe('申请期甘特总览', () => {
  const timeline = (rounds: Parameters<typeof MastersTimeline>[0]['rounds'], now = new Date('2026-10-14T04:00:00Z')) =>
    renderToStaticMarkup(<MastersTimeline rounds={rounds} now={now} locale="zh" copy={mastersText.zh} onLocate={() => {}} />);

  it('一行一个申请期，学校、项目与起止日期都在行内', () => {
    const html = timeline([roundFixture()]);
    expect(html).toContain('申请期甘特总览');
    expect(html).toContain('Example University');
    expect(html).toContain('MSc Computer Science');
    // 摘要行给出轴范围与轮次数，逐行再给一次起止
    expect(html).toContain('共 1 个申请期 · 1 个轮次 · 2026-10-01 → 2026-12-31');
    expect(html).toContain('· 2026-10-01 → 2026-12-01"');
  });

  it('手机左列放不下整段日期：两个日期各自 nowrap，只在箭头前换行', () => {
    const html = timeline([roundFixture()]);
    // 左列内容区 151px，而整段区间要 176px；不分组会从日期中间断开（2027- / 01-31）
    expect(html).toMatch(/whitespace-nowrap">2026-10-01</);
    expect(html).toMatch(/whitespace-nowrap"><span[^>]*>→<\/span> 2026-12-01</);
  });

  it('条形按真实天数定位，末端补一天让截止日整日落进条内', () => {
    const html = timeline([roundFixture()]);
    // 轴 2026-10-01 → 2026-12-31（92 天），条形 10-01 → 12-02（62 天）
    expect(html).toContain('left:0%');
    expect(html).toContain('width:67.3913043478261%');
  });

  it('今天落在轴上时标出竖线与标签', () => {
    const html = timeline([roundFixture()]);
    expect(html).toContain('今天');
    expect(html).toContain('left:14.130434782608695%');
  });

  it('今天落在轴外时不画今天线', () => {
    const html = timeline([roundFixture()], new Date('2027-06-01T04:00:00Z'));
    expect(html).not.toContain('bg-violet-300/70');
  });

  it('同校不同项目各占一行且同色', () => {
    const base = roundFixture();
    const second = roundFixture({ id: 'second', details: { ...base.details, programme: 'MSc Data Science', opensOn: '2026-11-01', deadlineOn: '2027-02-01' } });
    const html = timeline([base, second]);
    expect(html).toContain('共 2 个申请期 · 2 个轮次');
    expect(html).toContain('MSc Data Science');
    // 同校同色相：两行都应该用这一个色相（图例另有固定色块，不能直接数色相种类）
    const hue = mastersCalendarHue({ region: base.region, university: base.details.university });
    expect([...html.matchAll(new RegExp(`hsl\\(${hue} 70% 52%`, 'g'))]).toHaveLength(2);
  });

  it('没有可用日期时给空状态，不渲染空表格', () => {
    const base = roundFixture();
    const html = timeline([roundFixture({ details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: null, deadlineStatus: 'unannounced' } })]);
    expect(html).toContain('没有可以画出的申请期');
    expect(html).not.toContain('个申请期 ·');
    // 有轮次但排不进轴，要在文案里说清楚，不能静默丢
    expect(html).toContain('另有 1 个轮次没有可用的日历日期');
  });

  it('只有截止日的项目成行并标出截止点，不画时长条', () => {
    const base = roundFixture();
    const html = timeline([roundFixture({ details: { ...base.details, opensOn: null, openingState: 'unknown', deadlineOn: '2027-03-15' } })]);
    expect(html).toContain('截止 2027-03-15');
    expect(html).toContain('其中 1 个只公布了截止日');
    // 没有时长条：条形用的 h-7 定位块不应出现
    expect(html).not.toContain('h-7 -translate-y-1/2 overflow-hidden rounded-md');
  });

  it('两个项目同时开放时画出重叠带并给出天数', () => {
    const base = roundFixture();
    const wide = roundFixture({ id: 'a', details: { ...base.details, programme: 'MSc A', opensOn: '2026-10-01', deadlineOn: '2026-12-20' } });
    const late = roundFixture({ id: 'b', details: { ...base.details, programme: 'MSc B', opensOn: '2026-11-01', deadlineOn: '2027-01-15' } });
    const html = timeline([wide, late]);
    expect(html).toContain('50 天里有两个及以上项目同时开放');
    // 只有重叠带用这个组合（图例色块是 h-2.5 w-6 rounded-sm）
    expect(html).toContain('absolute inset-y-0 bg-white/[0.09]');
  });

  it('Hub 的视图切换包含甘特，且可设为初始视图', () => {
    const html = renderToStaticMarkup(<MastersHub year={2027} nowIso="2026-10-14T04:00:00Z" rounds={[roundFixture()]} userId={null} initialWatches={[]} watchedRounds={[]} initialMode="timeline" />);
    expect(html).toContain('甘特');
    expect(html).toContain('申请期甘特总览');
  });
});
