'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { runCancellableTask } from '@/lib/cancellable-task';

interface AdminReport {
  id: string;
  targetType: 'comment' | 'post';
  targetId: string;
  reason: 'spam' | 'abuse' | 'nsfw' | 'illegal' | 'other';
  detail: string | null;
  status: 'pending' | 'resolved' | 'dismissed';
  reporterName: string | null;
  reporterEmail: string | null;
  createdAt: string;
  resolvedAt: string | null;
  targetPreview: string | null;
  targetStatus: string | null;
}

type FilterStatus = '' | 'pending' | 'resolved' | 'dismissed';
type Feedback = { type: 'success' | 'error'; message: string } | null;

const statusClass: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300',
  resolved: 'bg-emerald-500/15 text-emerald-300',
  dismissed: 'bg-white/10 text-white/60',
};

const statusKey: Record<string, string> = {
  pending: 'statusPending',
  resolved: 'statusResolved',
  dismissed: 'statusDismissed',
};

const reasonKey: Record<string, string> = {
  spam: 'reasonSpam',
  abuse: 'reasonAbuse',
  nsfw: 'reasonNsfw',
  illegal: 'reasonIllegal',
  other: 'reasonOther',
};

const targetTypeKey: Record<string, string> = {
  comment: 'targetComment',
  post: 'targetPost',
};

export default function ReportModeration() {
  const t = useTranslations('AdminReportsPage');
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fetchError, setFetchError] = useState(false);

  // 从 URL 读取初始过滤条件:支持从 admin/posts 列表点举报数跳转过来时
  // 自动定位到具体目标的举报 (?status=pending&targetType=post&targetId=xxx)。
  // 一旦用户手动切换 tab,就清掉 URL 参数回到全部视图。
  const [filter, setFilter] = useState<FilterStatus>(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const s = params.get('status');
    return s === 'pending' || s === 'resolved' || s === 'dismissed' ? (s as FilterStatus) : '';
  });

  // 读取 URL 上的 targetType/targetId,传给 API 过滤到具体目标。
  // 没有 targetType/targetId 时为 undefined,返回全部(或按 status 过滤的)举报。
  const [targetFilter, setTargetFilter] = useState<{ targetType?: string; targetId?: string }>(
    () => {
      if (typeof window === 'undefined') return {};
      const params = new URLSearchParams(window.location.search);
      return {
        targetType: params.get('targetType') ?? undefined,
        targetId: params.get('targetId') ?? undefined,
      };
    },
  );

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      if (targetFilter.targetType) params.set('targetType', targetFilter.targetType);
      if (targetFilter.targetId) params.set('targetId', targetFilter.targetId);
      const qs = params.toString();
      const res = await fetch(`/api/admin/reports${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch {
      setFetchError(true);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [filter, targetFilter]);

  // filter/targetFilter 变化时进入 loading：渲染期调整状态
  const [prevFetchKey, setPrevFetchKey] = useState(`${filter}:${targetFilter.targetType ?? ''}:${targetFilter.targetId ?? ''}`);
  const fetchKey = `${filter}:${targetFilter.targetType ?? ''}:${targetFilter.targetId ?? ''}`;
  if (fetchKey !== prevFetchKey) {
    setPrevFetchKey(fetchKey);
    setLoading(true);
    setFetchError(false);
  }

  // 拉取举报：内联 fetch + .then()，setState 都在异步回调里
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (targetFilter.targetType) params.set('targetType', targetFilter.targetType);
    if (targetFilter.targetId) params.set('targetId', targetFilter.targetId);
    const qs = params.toString();
    return runCancellableTask(
      fetch(`/api/admin/reports${qs ? `?${qs}` : ''}`).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      }),
      {
        onSuccess: (data) => setReports(data.reports ?? []),
        onError: () => {
          setFetchError(true);
          setReports([]);
        },
        onSettled: () => setLoading(false),
      },
    );
  }, [filter, targetFilter]);

  // 用户手动切 tab:清掉 targetFilter 和 URL 参数,回到全部视图
  function changeFilter(next: FilterStatus) {
    setFilter(next);
    setTargetFilter({});
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('targetType');
      url.searchParams.delete('targetId');
      url.searchParams.delete('status');
      if (next) url.searchParams.set('status', next);
      window.history.replaceState(null, '', url.toString());
    }
  }

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleAction(reportId: string, action: 'resolve' | 'dismiss') {
    setBusyId(reportId);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('operationFailed'));
      showFeedback('success', action === 'resolve' ? t('reportResolved') : t('reportDismissed'));
      fetchReports();
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : t('operationFailed'));
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { value: FilterStatus; labelKey: string }[] = [
    { value: '', labelKey: 'all' },
    { value: 'pending', labelKey: 'pending' },
    { value: 'resolved', labelKey: 'resolved' },
    { value: 'dismissed', labelKey: 'dismissed' },
  ];

  return (
    <div>
      {/* Feedback toast */}
      {feedback && (
        <div
          role="alert"
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-red-500/15 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* 当前聚焦在某个具体目标时,显示提示条 */}
      {targetFilter.targetType && targetFilter.targetId && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-2.5 text-sm">
          <span className="text-violet-200/90">
            {t('targetFilterHint')}{' '}
            <span className="font-mono text-violet-300/70">
              {targetFilter.targetType}/{targetFilter.targetId.slice(0, 12)}
              {targetFilter.targetId.length > 12 ? '…' : ''}
            </span>
          </span>
          <button
            type="button"
            onClick={() => changeFilter(filter)}
            className="text-violet-200/70 underline decoration-violet-200/30 underline-offset-4 transition-colors hover:text-violet-100"
          >
            {t('clearTargetFilter')}
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => {
          const active = !targetFilter.targetType && filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => changeFilter(tab.value)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                active
                  ? 'bg-violet-600/20 text-violet-300 ring-1 ring-violet-600/40'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
              <div className="mb-2 h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="t-body text-red-300">{t('operationFailed')}</p>
          <button
            type="button"
            onClick={fetchReports}
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      ) : reports.length === 0 ? (
        <p className="t-body py-16 text-center text-white/60">{t('empty')}</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">
                  {t(targetTypeKey[report.targetType])}
                </span>
                <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                  {t(reasonKey[report.reason])}
                </span>
                <span aria-hidden className="text-white/20">·</span>
                <span className="t-footnote text-white/60">
                  {t('reporterLabel')}: {report.reporterName || report.reporterEmail || t('anonymous')}
                </span>
                <span aria-hidden className="text-white/20">·</span>
                <time className="t-footnote tabular-nums text-white/60" dateTime={report.createdAt}>
                  {new Date(report.createdAt).toLocaleString()}
                </time>
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass[report.status] ?? 'bg-white/10 text-white/60'}`}
                >
                  {t(statusKey[report.status] ?? 'statusPending')}
                </span>
              </div>

              {/* 被举报内容预览 */}
              <div className="mb-3 rounded-xl border border-white/[0.06] bg-black/20 p-3">
                <p className="t-footnote mb-1 text-white/40">
                  {t('targetPreviewLabel')}
                  {report.targetStatus && (
                    <span className="ml-2 text-white/50">
                      · {t('targetStatusLabel')}: {report.targetStatus}
                    </span>
                  )}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-white/80 line-clamp-3">
                  {report.targetPreview ?? t('targetNotFound')}
                </p>
                {report.targetPreview && (
                  <Link
                    href={report.targetType === 'comment' ? '#' : `/blog/p/${report.targetId}`}
                    className="t-footnote mt-2 inline-block text-violet-300/70 underline decoration-violet-300/30 underline-offset-4 transition-colors hover:text-violet-300"
                  >
                    {t('viewTarget')}
                  </Link>
                )}
              </div>

              {/* 举报详情 */}
              {report.detail && (
                <p className="mb-4 text-[0.9375rem] leading-relaxed text-white/70">
                  <span className="t-footnote mr-2 text-white/40">{t('detailLabel')}:</span>
                  {report.detail}
                </p>
              )}

              {/* 操作按钮:只有 pending 状态才显示 */}
              {report.status === 'pending' && (
                <div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-4">
                  <button
                    type="button"
                    onClick={() => handleAction(report.id, 'resolve')}
                    disabled={busyId === report.id}
                    className="rounded-xl bg-emerald-400 px-4 py-2 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:opacity-40"
                  >
                    {t('resolve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(report.id, 'dismiss')}
                    disabled={busyId === report.id}
                    className="rounded-xl border border-white/10 px-4 py-2 text-[0.9375rem] font-semibold text-white/60 transition-colors duration-200 hover:bg-white/5 disabled:opacity-40"
                  >
                    {t('dismiss')}
                  </button>
                  <span className="self-center t-footnote text-white/40">
                    {t('actionHint')}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
