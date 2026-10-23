import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { readMonitoringSnapshot } from '@/lib/monitoring';
import { readRecheckSnapshot } from '@/lib/task-monitoring';
import { monitoringText } from '@/lib/monitoring-types';
import MonitoringPanel from './MonitoringPanel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const session = await getAdminPageSession();
  return {
    title: session && isAdminSession(session) ? monitoringText[locale === 'en' ? 'en' : 'zh'].title : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function AdminMonitoringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();
  const [snapshot, task] = await Promise.all([readMonitoringSnapshot(), readRecheckSnapshot()]);
  return <MonitoringPanel userId={session.userId} initialSnapshot={snapshot} initialTask={task} />;
}
