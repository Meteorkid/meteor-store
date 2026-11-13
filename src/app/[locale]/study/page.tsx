import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { dailyDate } from '@/lib/daily/types';
import { dailyChannels } from '@/lib/daily/channels';
import { dashboardText } from '@/components/study/dashboard-text';
import ReviewQueue from '@/components/study/ReviewQueue';
import { studyDatePart, studyRelativeDays } from '@/lib/study/format';
import {
  loadApplicationDeadlines, loadCourseDeadlines, loadDailySection,
  loadPlanSection, loadReviewSection, loadSavedCounts, loadSavedDeadlines,
} from '@/lib/study/dashboard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = dashboardText[locale === 'en' ? 'en' : 'zh'];
  // 登录后的私人面板，不进搜索引擎；三个学习页同一约定。
  return { title: copy.metaTitle, description: copy.metaDescription, robots: { index: false, follow: false } };
}

/**
 * 学习工作台。
 *
 * 每个分区独立加载（allSettled），一处依赖故障只让该分区显示读取失败。
 * 未登录时跳登录页并带上 next=/study，登录后回到这里。
 */
export default async function StudyDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = dashboardText[locale === 'en' ? 'en' : 'zh'];
  const typedLocale = (locale === 'en' ? 'en' : 'zh') as 'zh' | 'en';

  const session = await getSession();
  if (!session) {
    redirect({ href: { pathname: '/login', query: { next: '/study' } }, locale });
  }
  const userId = session!.userId;
  const today = dailyDate();

  const [courseResult, applicationResult, savedResult, reviewResult, dailyResult, planResult, countsResult] = await Promise.allSettled([
    loadCourseDeadlines(userId, today),
    loadApplicationDeadlines(userId),
    loadSavedDeadlines(userId, typedLocale),
    loadReviewSection(userId),
    loadDailySection(today),
    loadPlanSection(userId),
    loadSavedCounts(userId),
  ]);

  const courseDeadlines = courseResult.status === 'fulfilled' ? courseResult.value : null;
  const applicationDeadlines = applicationResult.status === 'fulfilled' ? applicationResult.value : null;
  const savedDeadlines = savedResult.status === 'fulfilled' ? savedResult.value : null;
  const reviews = reviewResult.status === 'fulfilled' ? reviewResult.value : null;
  const daily = dailyResult.status === 'fulfilled' ? dailyResult.value : null;
  const plan = planResult.status === 'fulfilled' ? planResult.value : undefined;
  const counts = countsResult.status === 'fulfilled' ? countsResult.value : null;
  const deadlinesFailed = courseDeadlines === null || applicationDeadlines === null || savedDeadlines === null;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 border-b border-white/10 pb-9">
        <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-4 max-w-3xl t-body text-white/60">{copy.description}</p>
        <p className="mt-3 t-footnote text-white/60">{copy.todayLabel} · {today}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="study-deadlines" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="study-deadlines" className="t-title-3 text-white">{copy.deadlinesTitle}</h2>
            <Link href="/study/courses" className="inline-flex min-h-10 items-center t-footnote text-violet-200 underline underline-offset-4">{copy.openCourses} →</Link>
          </div>
          {deadlinesFailed ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed}</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {courseDeadlines!.map(entry => (
                <li key={entry.deadline.id} className="py-3">
                  <p className="t-footnote text-violet-300">{copy.courseDeadline}{entry.courseName ? ` · ${entry.courseName}` : ''}</p>
                  <p className="mt-1 t-title-4 text-white">{entry.deadline.title}</p>
                  <p className="mt-1 t-footnote text-white/70">
                    {entry.overdue ? <span className="text-amber-200">{copy.overdue}</span> : studyRelativeDays(entry.daysLeft, typedLocale)}
                    {entry.deadline.dueAt.length > 10 ? ` · ${studyDatePart(entry.deadline.dueAt)}` : ''}
                  </p>
                </li>
              ))}
              {applicationDeadlines!.map(entry => (
                <li key={`${entry.kind}-${entry.roundId}`} className="py-3">
                  <p className="t-footnote text-violet-300">{copy.applicationDeadline}</p>
                  <p className="mt-1 t-title-4 text-white">{entry.university} · {entry.programme}</p>
                  <p className="mt-1 t-footnote text-white/70">
                    {studyRelativeDays(entry.daysLeft, typedLocale)}
                    {entry.deadlineText ? ` · ${entry.deadlineText}` : ''}
                  </p>
                </li>
              ))}
              {savedDeadlines!.map(entry => (
                <li key={entry.itemId} className="py-3">
                  <p className="t-footnote text-violet-300">{copy.savedDeadline}</p>
                  <Link href={entry.href} className="mt-1 block t-title-4 text-white underline-offset-4 hover:underline">{entry.title}</Link>
                  <p className="mt-1 t-footnote text-white/70">{studyRelativeDays(entry.daysLeft, typedLocale)}</p>
                </li>
              ))}
              {courseDeadlines!.length === 0 && applicationDeadlines!.length === 0 && savedDeadlines!.length === 0 && (
                <li className="py-3 t-footnote text-white/60">{copy.deadlinesEmpty}</li>
              )}
            </ul>
          )}
        </section>

        <section aria-labelledby="study-reviews" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="study-reviews" className="t-title-3 text-white">{copy.reviewsTitle}</h2>
            <Link href="/study/algorithms" className="inline-flex min-h-10 items-center t-footnote text-violet-200 underline underline-offset-4">{copy.openAlgorithms} →</Link>
          </div>
          {reviews === null ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed}</p>
          ) : (
            <div className="mt-2">
              <ReviewQueue initialProblems={reviews} ownerId={userId} locale={typedLocale} />
            </div>
          )}
        </section>

        <section aria-labelledby="study-daily" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="study-daily" className="t-title-3 text-white">{copy.dailyTitle}</h2>
            <Link href="/daily" className="inline-flex min-h-10 items-center t-footnote text-violet-200 underline underline-offset-4">{copy.dailyOpen} →</Link>
          </div>
          {daily === null ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed}</p>
          ) : daily.length === 0 ? (
            <p className="mt-4 t-footnote text-white/60">{copy.dailyEmpty}</p>
          ) : (
            <>
              <p className="mt-4 t-footnote text-white/70">{copy.dailyChannelCount.replace('{count}', String(daily.length))}</p>
              <ul className="mt-2 divide-y divide-white/10">
                {daily.map(entry => {
                  const channel = dailyChannels.find(candidate => candidate.id === entry.channel);
                  return (
                    <li key={entry.channel} className="py-2.5">
                      <Link href={`/daily?view=all#${entry.channel}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="t-footnote text-violet-300">{channel?.[typedLocale] ?? entry.channel}</span>
                        <span className="t-title-4 text-white">{entry.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        <section aria-labelledby="study-plan" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="study-plan" className="t-title-3 text-white">{copy.planTitle}</h2>
            <Link href="/pathfinder/plan" className="inline-flex min-h-10 items-center t-footnote text-violet-200 underline underline-offset-4">{copy.planOpen} →</Link>
          </div>
          {plan === undefined ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed}</p>
          ) : plan === null ? (
            <p className="mt-4 t-footnote text-white/60">{copy.planEmpty}</p>
          ) : (
            <>
              <p className="mt-4 t-title-4 text-white">{copy.planWeek
                .replace('{week}', String(plan.week)).replace('{total}', String(plan.totalWeeks)).replace('{title}', plan.weekTitle)}</p>
              <p className="mt-1 t-footnote text-white/70">{copy.planProgress
                .replace('{done}', String(plan.completedCount)).replace('{total}', String(plan.totalCount))}</p>
              {plan.pending.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {plan.pending.slice(0, 4).map(task => (
                    <li key={task.id} className="flex items-baseline justify-between gap-3 border-t border-white/10 pt-2">
                      <span className="min-w-0 text-sm leading-6 text-white/85">{task.action}</span>
                      <span className="shrink-0 t-footnote tabular-nums text-white/60">{task.estimatedMinutes} min</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>

      <section aria-labelledby="study-saved" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 id="study-saved" className="t-title-3 text-white">{copy.savedTitle}</h2>
        {counts === null ? (
          <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed}</p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <Link href="/blog/favorites" className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-4 hover:bg-white/[0.05]">
              <span className="t-footnote text-white/60">{copy.savedBlog}</span>
              <span className="t-title-3 tabular-nums text-white">{counts.blog}</span>
            </Link>
            <Link href="/pathfinder/saved" className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-4 hover:bg-white/[0.05]">
              <span className="t-footnote text-white/60">{copy.savedPathfinder}</span>
              <span className="t-title-3 tabular-nums text-white">{counts.pathfinder}</span>
            </Link>
          </div>
        )}
        <p className="mt-4 t-footnote text-white/55">{copy.savedHint}</p>
      </section>
    </div>
  );
}
