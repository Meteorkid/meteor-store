import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/auth';
import { dailyDate } from '@/lib/daily/types';
import { listStudyCourses, listStudyDeadlines } from '@/lib/study/service';
import { coursesText } from '@/components/study/courses-text';
import CoursesManager from '@/components/study/CoursesManager';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = coursesText[locale === 'en' ? 'en' : 'zh'];
  // 登录后的私人页，不进搜索引擎；三个学习页同一约定。
  return { title: copy.metaTitle, description: copy.metaDescription, robots: { index: false, follow: false } };
}

/**
 * 课程与 GPA。
 *
 * 服务端取初始数据，两个分区独立降级（allSettled）：课程读取失败
 * 不拖累截止事项，反之亦然；页面把失败标记交给客户端显示重试入口。
 */
export default async function StudyCoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = coursesText[locale === 'en' ? 'en' : 'zh'];
  const typedLocale = (locale === 'en' ? 'en' : 'zh') as 'zh' | 'en';

  const session = await getSession();
  if (!session) {
    redirect({ href: { pathname: '/login', query: { next: '/study/courses' } }, locale });
  }
  const userId = session!.userId;

  const [coursesResult, deadlinesResult] = await Promise.allSettled([
    listStudyCourses(userId),
    listStudyDeadlines(userId),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 border-b border-white/10 pb-9">
        <p className="t-eyebrow text-violet-300">{copy.eyebrow}</p>
        <h1 className="mt-3 t-title-1 text-white">{copy.title}</h1>
        <p className="mt-4 max-w-3xl t-body text-white/60">{copy.description}</p>
      </header>
      <CoursesManager
        initialCourses={coursesResult.status === 'fulfilled' ? coursesResult.value : []}
        initialDeadlines={deadlinesResult.status === 'fulfilled' ? deadlinesResult.value : []}
        coursesFailed={coursesResult.status === 'rejected'}
        deadlinesFailed={deadlinesResult.status === 'rejected'}
        userId={userId}
        locale={typedLocale}
        today={dailyDate()}
      />
    </div>
  );
}
