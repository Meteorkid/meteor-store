import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import XiaohongshuPanel from '@/components/XiaohongshuPanel';
import { isAdminSession } from '@/lib/admin';
import { getAdminPageSession } from '@/lib/admin-session';
import { dailyDate } from '@/lib/daily/types';
import { getDailyQueue } from '@/lib/wechat-mp/daily-queue';
import { listDailyDraftHistory } from '@/lib/wechat-mp/history';
import { listXiaohongshuNotes } from '@/lib/xiaohongshu/service';
import type { XiaohongshuNote } from '@/lib/xiaohongshu/types';
import type { WechatDailyQueueItem, WechatDraftHistoryItem } from '@/lib/wechat-mp/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed
      ? (locale === 'en' ? 'RedNote studio · Admin' : '小红书工作台 · 管理后台')
      : (locale === 'en' ? 'Page not found' : '页面不存在'),
    robots: { index: false, follow: false },
  };
}

export default async function XiaohongshuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const today = dailyDate();
  let dailyQueue: WechatDailyQueueItem[] = [];
  let dailyQueueError = false;
  try {
    dailyQueue = await getDailyQueue(today);
  } catch (error) {
    console.error('xiaohongshu daily queue read failed:', error);
    dailyQueueError = true;
  }

  let draftHistory: WechatDraftHistoryItem[] = [];
  try {
    draftHistory = await listDailyDraftHistory();
  } catch (error) {
    console.error('xiaohongshu wechat history read failed:', error);
  }

  let initialNotes: XiaohongshuNote[] = [];
  let notesError = false;
  try {
    initialNotes = await listXiaohongshuNotes();
  } catch (error) {
    console.error('xiaohongshu note list failed:', error);
    notesError = true;
  }

  return (
    <>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="t-title-2">
            {locale === 'en' ? 'RedNote content studio' : '小红书内容工作台'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
            {locale === 'en'
              ? 'Turn a Daily Fresh edition or a published post into a RedNote draft. Check the 20-character title, 1000-character body and 3:4 cover, then copy the kit and open the official creator page to publish manually.'
              : '把每日一新或站内文章整理成小红书图文草稿：这里负责标题、正文、标签、3:4 封面和发布前检查，再用发布助手复制文案、打开官方创作服务平台，最后手动发布并记录链接。'}
          </p>
        </div>
        <a
          href={`/${locale}/admin/wechat-draft`}
          className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 py-2 text-sm text-violet-200 transition-colors hover:bg-white/10"
        >
          {locale === 'en' ? 'Open WeChat drafts →' : '打开公众号草稿 →'}
        </a>
      </header>
      <XiaohongshuPanel
        today={today}
        dailyQueue={dailyQueue}
        dailyQueueError={dailyQueueError}
        draftHistory={draftHistory}
        initialNotes={initialNotes}
        notesError={notesError}
      />
    </>
  );
}
