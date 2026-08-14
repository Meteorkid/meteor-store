import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { listAdminAuditLogs } from '@/lib/admin-audit';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminAuditLogsPage' });
  const session = await getSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

function formatTime(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
}

function formatDetail(detail: Record<string, unknown> | null): string {
  if (!detail) return '';
  try {
    return JSON.stringify(detail);
  } catch {
    return '';
  }
}

export default async function AdminAuditLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminAuditLogsPage' });
  const session = await getSession();
  if (!session || !isAdminSession(session)) notFound();

  const logs = await listAdminAuditLogs(200);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="t-title-2">{t('title')}</h1>
            <p className="t-footnote mt-2 text-white/50">{t('subtitle')}</p>
          </header>

          <AdminNav />

          {logs.length === 0 ? (
            <p className="t-body mt-8 text-white/60">{t('empty')}</p>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-white/50">
                    <th className="t-footnote px-4 py-3">{t('colTime')}</th>
                    <th className="t-footnote px-4 py-3">{t('colAdmin')}</th>
                    <th className="t-footnote px-4 py-3">{t('colAction')}</th>
                    <th className="t-footnote px-4 py-3">{t('colTarget')}</th>
                    <th className="t-footnote px-4 py-3">{t('colDetail')}</th>
                    <th className="t-footnote px-4 py-3">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-white/[0.04] text-white/70 last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/50">
                        {formatTime(log.createdAt, locale)}
                      </td>
                      <td className="px-4 py-3">{log.adminEmail}</td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/80">
                          {log.action}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {log.targetType ? `${log.targetType}:${log.targetId ?? ''}` : '—'}
                      </td>
                      <td className="max-w-[240px] truncate px-4 py-3 font-mono text-xs text-white/50">
                        {formatDetail(log.detail) || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/50">
                        {log.ip ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
