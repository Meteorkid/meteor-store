import type { Metadata } from 'next';
import mobile from '@/components/admin/AdminMobile.module.css';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { AUDIT_LOG_PAGE_SIZE, listAdminAuditLogs } from '@/lib/admin-audit';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminAuditLogsPage' });
  const session = await getAdminPageSession();
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
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const logs = await listAdminAuditLogs(AUDIT_LOG_PAGE_SIZE);

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="t-footnote mt-2 text-white/60">
          {t('subtitle', { count: AUDIT_LOG_PAGE_SIZE })}
        </p>
      </header>

      {logs.length === 0 ? (
        <p className="t-body mt-8 text-white/60">{t('empty')}</p>
      ) : (
        <div className={`mt-8 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] ${mobile.tableShell}`}>
          <table role="table" className={`w-full min-w-[720px] text-left text-sm ${mobile.responsiveTable}`}>
            <thead role="rowgroup">
              <tr role="row" className="border-b border-white/[0.07] text-white/60">
                <th className="t-footnote px-4 py-3">{t('colTime')}</th>
                <th className="t-footnote px-4 py-3">{t('colAdmin')}</th>
                <th className="t-footnote px-4 py-3">{t('colAction')}</th>
                <th className="t-footnote px-4 py-3">{t('colTarget')}</th>
                <th className="t-footnote px-4 py-3">{t('colDetail')}</th>
                <th className="t-footnote px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {logs.map((log) => (
                <tr role="row"
                  key={log.id}
                  className="border-b border-white/[0.04] text-white/70 last:border-b-0"
                >
                  <td role="cell" data-label={t('colTime')} className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/60"><div>
                    {formatTime(log.createdAt, locale)}
                  </div></td>
                  <td role="cell" data-label={t('colAdmin')} className="px-4 py-3"><div>{log.adminEmail}</div></td>
                  <td role="cell" data-label={t('colAction')} className="px-4 py-3"><div>
                    <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/80">
                      {log.action}
                    </code>
                  </div></td>
                  <td role="cell" data-label={t('colTarget')} className="px-4 py-3 font-mono text-xs"><div>
                    {log.targetType ? `${log.targetType}:${log.targetId ?? ''}` : '—'}
                  </div></td>
                  <td role="cell" data-label={t('colDetail')} className="max-w-[240px] truncate px-4 py-3 font-mono text-xs text-white/60"><div>
                    {log.detail ? <details><summary className="cursor-pointer text-violet-200">{t('viewDetail')}</summary><p className="mt-2 whitespace-pre-wrap break-all">{formatDetail(log.detail)}</p></details> : '—'}
                  </div></td>
                  <td role="cell" data-label="IP" className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/60"><div>
                    {log.ip ?? '—'}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
