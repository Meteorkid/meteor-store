import { isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Announcement } from '@/lib/announcement-text';
import type { MastersNotice } from '@/lib/masters/types';
import { roundFixture } from '@/components/masters/__tests__/fixtures';

const fixture = vi.hoisted(() => ({
  open: true, hasOpened: true, tab: 'daily', stateIndex: 0, effects: [] as (() => void)[],
  userId: null as string | null, locale: 'zh', dailyFailed: false, dailyReminder: null as { date: string } | null,
  announcements: { items: null as Announcement[] | null, loading: false, failed: false, readAt: '' },
  mark: vi.fn(), retry: vi.fn(), retryDaily: vi.fn(), markDaily: vi.fn(), setOpen: vi.fn(),
  mastersNotices: [] as MastersNotice[], phdNotices: [] as MastersNotice[],
  markMasters: vi.fn(), markPhd: vi.fn(),
}));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(), useEffect: (effect: () => void) => { fixture.effects.push(effect); }, useId: () => 'notification-fixture',
  useRef: (initial: unknown) => ({ current: initial }), useState: () => {
    const index = fixture.stateIndex++;
    return index === 0 ? [fixture.open, (value: boolean) => { fixture.open = value; fixture.setOpen(value); }]
      : index === 1 ? [fixture.hasOpened, (value: boolean) => { fixture.hasOpened = value; }]
      : [fixture.tab, (value: string) => { fixture.tab = value; }];
  },
  useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
}));
vi.mock('next/dynamic', () => ({ default: () => () => <div>Daily preview fixture</div> }));
vi.mock('next-intl', () => ({ useLocale: () => fixture.locale, useTranslations: () => (key: string) => ({ ariaLabel: '查看公告', title: '公告', loading: '加载中', empty: '暂无公告' })[key as 'title'] }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: fixture.userId ? { id: fixture.userId } : null }) }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('@/lib/announcement-client', () => ({
  EMPTY_ANNOUNCEMENT_STATE: {}, subscribeAnnouncements: vi.fn(), watchAnnouncements: vi.fn(),
  getAnnouncementState: () => fixture.announcements, ensureAnnouncements: fixture.retry, markAnnouncementsRead: fixture.mark,
  announcementTimestamp: (item: Announcement) => item.publishedAt ?? item.createdAt,
  hasUnreadAnnouncements: () => fixture.announcements.items?.some(item => (item.publishedAt ?? item.createdAt) > fixture.announcements.readAt) ?? false,
}));
vi.mock('@/lib/daily/reminder-client', () => ({
  EMPTY_REMINDER_STATE: {}, subscribeDailyReminder: vi.fn(), ensureDailyReminder: fixture.retryDaily,
  getReminderState: () => ({ reminder: fixture.dailyReminder, readDate: '', failed: fixture.dailyFailed }), markDailyReminderRead: fixture.markDaily, syncDailyReminderRead: vi.fn(),
}));
vi.mock('@/lib/masters/notice-client', () => ({
  EMPTY_MASTERS_NOTICES: {}, subscribeMastersNotices: vi.fn(), getMastersNoticeState: () => ({ notices: fixture.mastersNotices, failed: false, marking: false }),
  ensureMastersNotices: vi.fn(), markMastersRead: fixture.markMasters,
}));
vi.mock('@/lib/phd/notice-client', () => ({
  EMPTY_PHD_NOTICES: {}, subscribePhdNotices: vi.fn(), getPhdNoticeState: () => ({ notices: fixture.phdNotices, failed: false, marking: false }),
  ensurePhdNotices: vi.fn(), markPhdRead: fixture.markPhd,
}));
vi.mock('@/lib/monitoring-client', () => ({
  EMPTY_MONITORING_STATE: {}, subscribeMonitoring: vi.fn(), getMonitoringState: () => ({}),
  hasUnreadMonitoring: () => false, markMonitoringRead: vi.fn(), watchMonitoring: vi.fn(),
}));
import NotificationBell from '../NotificationBell';
function renderBell() { fixture.stateIndex = 0; fixture.effects = []; return NotificationBell(); }

type Node = ReactElement<Record<string, unknown>>;
function find(node: unknown, predicate: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  return predicate(node) ? node : find(node.props.children, predicate);
}
const announcement: Announcement = {
  id: 'a', titleZh: '真实公告', titleEn: 'Announcement', bodyZh: '正文', bodyEn: 'Body', published: true,
  publishedAt: '2026-10-23T01:00:00Z', createdAt: '2026-10-23T01:00:00Z', updatedAt: '2026-10-23T01:00:00Z',
};
beforeEach(() => {
  fixture.open = true; fixture.hasOpened = true; fixture.tab = 'daily'; fixture.userId = null; fixture.locale = 'zh'; fixture.dailyFailed = false; fixture.dailyReminder = null;
  fixture.announcements = { items: null, loading: false, failed: false, readAt: '' };
  fixture.mastersNotices = []; fixture.phdNotices = [];
  vi.clearAllMocks();
});

describe('铃铛系统公告状态与明确已读动作', () => {
  it('同ID硕博提醒分组链接与已读操作互相隔离', () => {
    fixture.userId = 'A'; fixture.tab = 'reminders';
    const notice: MastersNotice = { id: 'a'.repeat(64), roundId: 'shared-round', kind: 'deadline', leadDays: 7,
      dateVersion: 1, createdAt: '2026-10-29T00:00:00Z', readAt: null, round: roundFixture({ id: 'shared-round' }) };
    fixture.mastersNotices = [notice]; fixture.phdNotices = [notice];
    const tree = renderBell();
    const phd = find(tree, node => node.props['aria-label'] === '博士申请提醒')!;
    const masters = find(tree, node => node.props['aria-label'] === '硕士申请提醒')!;
    expect(renderToStaticMarkup(phd)).toContain('/zh/phd?year=2027#round-shared-round');
    expect(renderToStaticMarkup(masters)).toContain('/zh/masters?year=2027#round-shared-round');
    const mark = find(phd, node => node.type === 'button' && node.props.children === '将这些申请提醒标为已读')!;
    (mark.props.onClick as () => void)();
    expect(fixture.markPhd).toHaveBeenCalledWith('A', [notice.id]);
    expect(fixture.markMasters).not.toHaveBeenCalled();
    expect(renderToStaticMarkup(tree)).not.toContain('当前没有申请提醒。');
  });
  it('打开铃铛不标记系统公告，只有明确动作提交当前渲染快照', () => {
    fixture.announcements.items = [announcement]; fixture.open = false;
    const closed = renderBell();
    const bell = find(closed, node => node.type === 'button' && node.props['aria-label'] === '查看公告')!;
    (bell.props.onClick as () => void)();
    expect(fixture.mark).not.toHaveBeenCalled();
    fixture.open = true;
    const opened = renderBell();
    const mark = find(opened, node => node.type === 'button' && node.props.children === '将这些公告标为已读')!;
    (mark.props.onClick as () => void)();
    expect(fixture.mark).toHaveBeenCalledWith(fixture.announcements.items);
  });

  it('失败显示独立错误和重试，不显示暂无公告；有缓存时正文继续可读', () => {
    fixture.announcements.failed = true;
    let tree = renderBell();
    let html = renderToStaticMarkup(tree);
    expect(html).toContain('系统公告读取失败'); expect(html).not.toContain('暂无公告');
    const retry = find(tree, node => node.type === 'button' && node.props.children === '重试公告')!;
    (retry.props.onClick as () => void)(); expect(fixture.retry).toHaveBeenCalledWith(true);
    fixture.announcements.items = [announcement];
    tree = renderBell(); html = renderToStaticMarkup(tree);
    expect(html).toContain('系统公告读取失败'); expect(html).toContain('真实公告');
  });

  it('只有成功空列表显示暂无公告；提醒失败与内容预览分别展示', () => {
    fixture.announcements.items = [];
    let html = renderToStaticMarkup(renderBell()); expect(html).toContain('暂无公告');
    fixture.userId = 'A'; fixture.dailyFailed = true;
    const tree = renderBell(); html = renderToStaticMarkup(tree);
    expect(html).toContain('日刊提醒状态读取失败'); expect(html).toContain('Daily preview fixture');
    const retry = find(tree, node => node.type === 'button' && node.props.children === '重试提醒')!;
    (retry.props.onClick as () => void)(); expect(fixture.retryDaily).toHaveBeenCalledWith('A', true);
  });

  it('首次打开前不挂载每日组件，关闭后保留隐藏实例并设为inactive', () => {
    fixture.open = false; fixture.hasOpened = false;
    let tree = renderBell();
    expect(find(tree, node => node.props.role === 'region')).toBeUndefined();
    const bell = find(tree, node => node.props['aria-label'] === '查看公告')!;
    (bell.props.onClick as () => void)();
    tree = renderBell();
    expect(find(tree, node => node.props.userId === null && node.props.locale === 'zh')?.props.active).toBe(true);
    fixture.open = false; tree = renderBell();
    expect(find(tree, node => node.props.role === 'region')?.props.hidden).toBe(true);
    expect(find(tree, node => node.props.userId === null && node.props.locale === 'zh')?.props.active).toBe(false);
  });

  it('三分区隐藏非当前内容，箭头按标准tab顺序切换', () => {
    let tree = renderBell();
    const announcements = find(tree, node => node.props.role === 'tab' && node.props['aria-label'] === '系统公告')!;
    (announcements.props.onClick as () => void)();
    tree = renderBell();
    expect(find(tree, node => node.props.id === 'notification-fixture-daily')?.props.hidden).toBe(true);
    expect(find(tree, node => node.props.id === 'notification-fixture-announcements')?.props.hidden).toBe(false);
    const selected = find(tree, node => node.props.role === 'tab' && node.props['aria-label'] === '系统公告')!;
    const preventDefault = vi.fn();
    (selected.props.onKeyDown as (event: unknown) => void)({ key: 'ArrowLeft', preventDefault });
    expect(fixture.tab).toBe('daily'); expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('日刊提醒只有每日分区真正展开时才标读，公告分区与关闭状态不标读', () => {
    fixture.userId = 'A'; fixture.dailyReminder = { date: '2026-10-24' }; fixture.tab = 'announcements';
    renderBell(); fixture.effects.at(-1)!(); expect(fixture.markDaily).not.toHaveBeenCalled();
    fixture.tab = 'daily'; renderBell(); fixture.effects.at(-1)!(); expect(fixture.markDaily).toHaveBeenCalledWith('A');
    fixture.open = false; renderBell(); fixture.effects.at(-1)!(); expect(fixture.markDaily).toHaveBeenCalledOnce();
  });
});
