import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import WechatDraftPanel from '@/components/WechatDraftPanel';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { dailyDate } from '@/lib/daily/types';
import { WECHAT_MP_BACKEND_URL, isWechatMpConfigured } from '@/lib/wechat-mp/config';
import { getDailyQueue } from '@/lib/wechat-mp/daily-queue';
import { listDailyDraftHistory } from '@/lib/wechat-mp/history';
import type { WechatDailyQueueItem } from '@/lib/wechat-mp/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminWechatDraftPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function WechatDraftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminWechatDraftPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const today = dailyDate();
  let dailyQueue: WechatDailyQueueItem[] = [];
  let dailyQueueError = false;
  try {
    dailyQueue = await getDailyQueue(today);
  } catch (error) {
    console.error('wechat daily queue read failed:', error);
    dailyQueueError = true;
  }
  const draftHistory = await listDailyDraftHistory();

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-400">{t('description')}</p>
      </header>
      <WechatDraftPanel
        configured={isWechatMpConfigured()}
        today={today}
        dailyQueue={dailyQueue}
        dailyQueueError={dailyQueueError}
        draftHistory={draftHistory}
        backendUrl={WECHAT_MP_BACKEND_URL}
      />
    </>
  );
}
