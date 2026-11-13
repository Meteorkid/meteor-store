import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dashboardText } from '@/components/study/dashboard-text';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(),
  loadCourseDeadlines: vi.fn(),
  loadApplicationDeadlines: vi.fn(),
  loadSavedDeadlines: vi.fn(),
  loadReviewSection: vi.fn(),
  loadDailySection: vi.fn(),
  loadPlanSection: vi.fn(),
  loadSavedCounts: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/i18n/navigation', () => ({
  Link: 'a',
  // 真实 redirect 会抛出 NEXT_REDIRECT；测试同样抛出，页面才会在跳转处停住。
  redirect: (target: unknown) => { mocks.redirect(target); throw new Error('NEXT_REDIRECT'); },
}));
vi.mock('@/lib/study/dashboard', () => ({
  loadCourseDeadlines: mocks.loadCourseDeadlines,
  loadApplicationDeadlines: mocks.loadApplicationDeadlines,
  loadSavedDeadlines: mocks.loadSavedDeadlines,
  loadReviewSection: mocks.loadReviewSection,
  loadDailySection: mocks.loadDailySection,
  loadPlanSection: mocks.loadPlanSection,
  loadSavedCounts: mocks.loadSavedCounts,
}));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/components/study/ReviewQueue', () => ({
  default: ({ initialProblems }: { initialProblems: Array<{ title: string }> }) => (
    <div>REVIEW_QUEUE:{initialProblems.map(problem => problem.title).join(',')}</div>
  ),
}));

import StudyDashboardPage, { dynamic } from '../page';

const copy = dashboardText.zh;

function deadlineEntry() {
  return [{
    deadline: { id: 'd1', courseId: null, title: '第三次作业', kind: 'assignment', dueAt: '2026-11-20', status: 'open', notes: null, createdAt: 'x', updatedAt: 'x' },
    courseName: '数据结构', daysLeft: 3, overdue: false,
  }];
}

function setupAll() {
  mocks.loadCourseDeadlines.mockResolvedValue(deadlineEntry());
  mocks.loadApplicationDeadlines.mockResolvedValue([]);
  mocks.loadSavedDeadlines.mockResolvedValue([]);
  mocks.loadReviewSection.mockResolvedValue([{ id: 'p1', title: '两数之和' }]);
  mocks.loadDailySection.mockResolvedValue([{ channel: 'english', title: '今日英语' }]);
  mocks.loadPlanSection.mockResolvedValue(null);
  mocks.loadSavedCounts.mockResolvedValue({ blog: 2, pathfinder: 1 });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ userId: 'user-a', emailVerified: true });
  setupAll();
});

describe('学习工作台页', () => {
  it('未登录时跳转登录并保留目的地', async () => {
    mocks.getSession.mockResolvedValue(null);
    await expect(StudyDashboardPage({ params: Promise.resolve({ locale: 'zh' }) })).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/login', query: { next: '/study' } },
      locale: 'zh',
    });
  });

  it('聚合各分区数据', async () => {
    const html = renderToStaticMarkup(await StudyDashboardPage({ params: Promise.resolve({ locale: 'zh' }) }));
    expect(html).toContain('第三次作业');
    expect(html).toContain('数据结构');
    expect(html).toContain('REVIEW_QUEUE:两数之和');
    expect(html).toContain('今日英语');
    expect(html).toContain(copy.planEmpty);
    expect(html).toContain('>2<');
    expect(html).toContain('>1<');
    expect(dynamic).toBe('force-dynamic');
  });

  it('单分区失败只降级该分区，不伪装成空数据', async () => {
    mocks.loadReviewSection.mockRejectedValue(new Error('offline'));
    mocks.loadDailySection.mockRejectedValue(new Error('offline'));
    const html = renderToStaticMarkup(await StudyDashboardPage({ params: Promise.resolve({ locale: 'zh' }) }));
    expect(html).toContain(copy.loadFailed);
    expect(html).not.toContain('REVIEW_QUEUE');
    expect(html).not.toContain(copy.dailyEmpty);
    // 其他分区不受影响
    expect(html).toContain('第三次作业');
    expect(html).toContain(copy.planEmpty);
  });

  it('截止分区任一来源失败都显示读取失败，不显示空状态', async () => {
    mocks.loadApplicationDeadlines.mockRejectedValue(new Error('offline'));
    const html = renderToStaticMarkup(await StudyDashboardPage({ params: Promise.resolve({ locale: 'zh' }) }));
    expect(html).toContain(copy.loadFailed);
    expect(html).not.toContain(copy.deadlinesEmpty);
  });
});
