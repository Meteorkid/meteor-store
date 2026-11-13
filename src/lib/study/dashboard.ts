import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { postFavorites, pathfinderSaves } from '@/lib/db/schema';
import { dailyDate } from '@/lib/daily/types';
import { getDailyEditions } from '@/lib/daily/service';
import { DAILY_EDITION_CHANNEL_IDS } from '@/lib/daily/channels';
import type { DailyEditionChannelId } from '@/lib/daily/types';
import { getMastersRoundState } from '@/lib/masters/dates';
import { getMastersRoundsByIds, getMastersWatches } from '@/lib/masters/service';
import { getPhdRoundsByIds, getPhdWatches } from '@/lib/phd/service';
import { getDeadlineState } from '@/lib/pathfinder/catalog-view';
import { getSavedPathfinderItems } from '@/lib/pathfinder/saves';
import { getUserPlan } from '@/lib/pathfinder/plan-store';
import { dueReviewProblems } from './review';
import { listStudyCourses, listStudyDeadlines, listStudyProblems } from './service';
import { studyDatePart, studyDaysUntil } from './format';
import type { StudyDeadline, StudyProblem } from './types';

/**
 * 学习工作台的分区数据。
 *
 * 每个分区独立加载：任何一处依赖故障（比如申请接口暂时不可用）
 * 只让该分区显示「读取失败」，不把整个工作台带崩。
 * 这里只做聚合与排序，不写任何数据。
 */

export interface DailySectionEntry {
  channel: DailyEditionChannelId;
  title: string;
}

export interface CourseDeadlineEntry {
  deadline: StudyDeadline;
  courseName: string | null;
  daysLeft: number | null;
  overdue: boolean;
}

export interface ApplicationDeadlineEntry {
  kind: 'masters' | 'phd';
  roundId: string;
  university: string;
  programme: string;
  roundName: string;
  deadlineText: string;
  daysLeft: number;
  intakeYear: number;
}

export interface SavedDeadlineEntry {
  itemId: string;
  title: string;
  daysLeft: number;
  href: string;
}

export interface PlanSection {
  title: string;
  week: number;
  totalWeeks: number;
  weekTitle: string;
  pending: Array<{ id: string; action: string; estimatedMinutes: number }>;
  completedCount: number;
  totalCount: number;
}

export interface SavedCounts {
  blog: number;
  pathfinder: number;
}

export async function loadDailySection(today = dailyDate()): Promise<DailySectionEntry[]> {
  const editions = await getDailyEditions(today);
  const published = new Map(editions.filter(edition => edition.status === 'published').map(edition => [edition.channel, edition]));
  return DAILY_EDITION_CHANNEL_IDS.flatMap(channel => {
    const edition = published.get(channel);
    return edition ? [{ channel, title: edition.title }] : [];
  });
}

/** 7 天内与已逾期的未完成课程事项；排序：逾期最前，其后按截止时间。 */
export async function loadCourseDeadlines(userId: string, today = dailyDate()): Promise<CourseDeadlineEntry[]> {
  const [deadlines, courses] = await Promise.all([listStudyDeadlines(userId), listStudyCourses(userId)]);
  const courseNames = new Map(courses.map(course => [course.id, course.name]));
  return deadlines
    .filter(deadline => deadline.status === 'open')
    .flatMap(deadline => {
      const daysLeft = studyDaysUntil(studyDatePart(deadline.dueAt), today);
      if (daysLeft === null) return [];
      if (daysLeft > 7) return [];
      return [{
        deadline,
        courseName: deadline.courseId ? courseNames.get(deadline.courseId) ?? null : null,
        daysLeft,
        overdue: daysLeft < 0,
      }];
    })
    .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
    .slice(0, 8);
}

/** 关注的申请轮次里 30 天内截止的（leadDays 不为空），硕士与博士合并按剩余天数排序。 */
export async function loadApplicationDeadlines(userId: string): Promise<ApplicationDeadlineEntry[]> {
  const [mastersWatches, phdWatches] = await Promise.all([getMastersWatches(userId), getPhdWatches(userId)]);
  const [mastersRounds, phdRounds] = await Promise.all([
    getMastersRoundsByIds(mastersWatches.map(watch => watch.roundId)),
    getPhdRoundsByIds(phdWatches.map(watch => watch.roundId)),
  ]);
  const now = new Date();
  const collect = (kind: 'masters' | 'phd', rounds: typeof mastersRounds): ApplicationDeadlineEntry[] =>
    rounds.flatMap(round => {
      const state = getMastersRoundState(round, now);
      if (state.leadDays === null || state.daysLeft === null) return [];
      return [{
        kind, roundId: round.id, university: round.details.university, programme: round.details.programme,
        roundName: round.details.roundName, deadlineText: round.details.deadlineText || round.details.deadlineOn || '',
        daysLeft: state.daysLeft, intakeYear: round.intakeYear,
      }];
    });
  return [...collect('masters', mastersRounds), ...collect('phd', phdRounds)]
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 6);
}

/** 收藏机会中 30 天内截止的条目（不含已过期）。 */
export async function loadSavedDeadlines(userId: string, locale: 'zh' | 'en'): Promise<SavedDeadlineEntry[]> {
  const saved = await getSavedPathfinderItems(userId);
  return saved.flatMap(({ item }) => {
    const state = getDeadlineState(item);
    if ((state.state !== 'urgent' && state.state !== 'soon') || state.daysLeft === null) return [];
    return [{ itemId: item.id, title: item.title[locale], daysLeft: state.daysLeft, href: `/pathfinder/items/${item.id}` }];
  })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);
}

export async function loadReviewSection(userId: string): Promise<StudyProblem[]> {
  return dueReviewProblems(await listStudyProblems(userId)).slice(0, 10);
}

/** 学习路径的当前周：第一个还有未完成任务的周；全部完成时展示最后一周。 */
export async function loadPlanSection(userId: string): Promise<PlanSection | null> {
  const stored = await getUserPlan(userId);
  if (!stored) return null;
  const { plan, completedTaskIds } = stored;
  const completed = new Set(completedTaskIds);
  const week = plan.weeks.find(candidate => candidate.tasks.some(task => !completed.has(task.id)))
    ?? plan.weeks[plan.weeks.length - 1];
  const totalCount = plan.weeks.reduce((sum, candidate) => sum + candidate.tasks.length, 0);
  return {
    title: plan.title,
    week: week.week,
    totalWeeks: plan.weeks.length,
    weekTitle: week.title,
    pending: week.tasks.filter(task => !completed.has(task.id))
      .map(task => ({ id: task.id, action: task.action, estimatedMinutes: task.estimatedMinutes })),
    completedCount: completedTaskIds.length,
    totalCount,
  };
}

export async function loadSavedCounts(userId: string): Promise<SavedCounts> {
  const [blog, pathfinder] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(postFavorites).where(eq(postFavorites.userId, userId)),
    db.select({ count: sql<number>`count(*)::int` }).from(pathfinderSaves).where(eq(pathfinderSaves.userId, userId)),
  ]);
  return { blog: blog[0]?.count ?? 0, pathfinder: pathfinder[0]?.count ?? 0 };
}
