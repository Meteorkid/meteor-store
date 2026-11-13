import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { dailyDate } from '@/lib/daily/types';
import { listStudyProblems } from '@/lib/study/service';
import type { StudyProblem } from '@/lib/study/types';
import AlgorithmsManager from '@/components/study/AlgorithmsManager';
import { algorithmsText } from '@/components/study/algorithms-text';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = algorithmsText[locale === 'en' ? 'en' : 'zh'];
  // 登录后的私人页，不进搜索引擎；三个学习页同一约定。
  return { title: copy.metaTitle, description: copy.metaDescription, robots: { index: false, follow: false } };
}

/**
 * 算法训练页。
 *
 * 题目列表加载失败只降级为本页的失败提示（保留重试入口），
 * 未登录跳登录页并带上 next=/study/algorithms。
 * 今日复习队列由客户端管理器用 dueReviewProblems 从列表推导，
 * 服务端只负责把权威列表交给它。
 */
export default async function StudyAlgorithmsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = algorithmsText[locale === 'en' ? 'en' : 'zh'];
  const typedLocale = (locale === 'en' ? 'en' : 'zh') as 'zh' | 'en';

  const session = await getSession();
  if (!session) {
    redirect({ href: { pathname: '/login', query: { next: '/study/algorithms' } }, locale });
  }
  const userId = session!.userId;
  const today = dailyDate();

  const [problemsResult] = await Promise.allSettled([listStudyProblems(userId)]);
  const problems: StudyProblem[] | null = problemsResult.status === 'fulfilled' ? problemsResult.value : null;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 border-b border-white/10 pb-9">
        <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-4 max-w-3xl t-body text-white/60">{copy.description}</p>
      </header>

      {problems === null ? (
        <div role="status" className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-5 py-10 text-center">
          <h2 className="t-title-3 text-amber-100">{copy.loadFailedTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">{copy.loadFailedHint}</p>
          <Link
            href="/study/algorithms"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/[0.05]"
          >
            {copy.retry}
          </Link>
        </div>
      ) : (
        <AlgorithmsManager initialProblems={problems} userId={userId} locale={typedLocale} today={today} />
      )}
    </div>
  );
}
