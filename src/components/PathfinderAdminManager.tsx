'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface SourceRow {
  id: string;
  name: string;
  enabled: boolean;
  autoPublish: boolean;
  canAutoPublish: boolean;
  trustLevel: string;
  lastSuccessAt: string | null;
  lastError: string | null;
  consecutiveFailures: number;
}

interface ItemRow {
  id: string;
  itemType: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  canonicalUrl: string;
  organization: string;
  organizationEn?: string;
  learningEligible: boolean;
  discoveredAt: string;
  status: AdminStatus;
  origin: 'static' | 'database';
  direction?: string;
  directions?: string;
  difficulty?: string;
  estimatedMinutes?: number | null;
  costCny?: number | null;
  costAmount?: number | null;
  costCurrency?: string | null;
  costLabelZh?: string | null;
  costLabelEn?: string | null;
  device?: string;
  network?: string;
  region?: string | null;
  regionZh?: string | null;
  regionEn?: string | null;
  remoteStatus?: string;
  eligibilityZh?: string;
  eligibilityEn?: string;
  deadlineText?: string | null;
  deadlineTextZh?: string | null;
  deadlineTextEn?: string | null;
  deadlineDate?: string | null;
  deadlineAt?: string | null;
  tags?: Partial<Record<'topic' | 'skill' | 'career' | 'format', string[]>>;
  inferredFields?: boolean;
  canPublishForPath?: boolean;
  requiresManualEligibilityCheck?: boolean;
}

/** 一次批量审核最多几条。与接口侧的上限保持一致。 */
const BATCH_LIMIT = 50;
/** busy 状态用的哨兵：批量操作不对应任何单个条目 id */
const BATCH_BUSY_KEY = '__batch__';

type AdminStatus = 'pending' | 'published' | 'stale' | 'expired' | 'archived';
const ADMIN_STATUSES: AdminStatus[] = ['pending', 'published', 'stale', 'expired', 'archived'];

export default function PathfinderAdminManager() {
  const locale = useLocale();
  const zh = locale === 'zh';
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [status, setStatus] = useState<AdminStatus>('pending');
  const [query, setQuery] = useState('');
  const [draftQuery, setDraftQuery] = useState('');
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback((input: {
    status: AdminStatus;
    query: string;
    offset: number;
    append: boolean;
  }) => {
    let active = true;
    if (input.append) setLoadingMore(true);
    else setLoading(true);
    const params = new URLSearchParams({
      status: input.status,
      offset: String(input.offset),
      limit: '30',
    });
    if (input.query) params.set('q', input.query);
    fetch(`/api/admin/pathfinder?${params}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Request failed');
        if (active) {
          setSources(payload.sources);
          const pageItems = [...(payload.staticItems ?? []), ...payload.items];
          setItems((current) => input.append ? [...current, ...pageItems] : pageItems);
          setNextOffset(payload.nextOffset);
        }
      })
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setLoadingMore(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let cancelRequest: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      cancelRequest = load({ status: 'pending', query: '', offset: 0, append: false });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      cancelRequest?.();
    };
  }, [load]);

  const applyList = (nextStatus: AdminStatus, nextQuery: string) => {
    setStatus(nextStatus);
    setQuery(nextQuery);
    setError('');
    load({ status: nextStatus, query: nextQuery, offset: 0, append: false });
  };

  async function patch(payload: Record<string, unknown>) {
    const id = String(payload.id ?? '');
    setBusyId(id);
    setError('');
    try {
      const response = await fetch('/api/admin/pathfinder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      if (payload.action === 'review') {
        // 当前视图只展示一种状态；处理完成后应立即移除，避免重复审核。
        setItems((current) => current.filter((item) => item.id !== id));
      } else if (payload.action === 'archive' || payload.action === 'restore') {
        setItems((current) => current.filter((item) => item.id !== id));
      } else {
        setSources((current) => current.map((source) => source.id === id ? result.source : source));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusyId(null);
    }
  }

  /**
   * 批量通过当前列表里的待审条目。
   *
   * 一次最多 BATCH_LIMIT 条（与接口侧一致）：请求要在网关超时前返回，
   * 而且一次批太多会让「人工过一眼」退化成走过场。所以按钮上写清楚这次会处理
   * 多少条，并要求二次确认——批量发布是对外可见的动作，误点没有一键撤销。
   */
  async function approveVisible() {
    const ids = items.filter((item) => item.status === 'pending').slice(0, BATCH_LIMIT).map((item) => item.id);
    if (ids.length === 0) return;

    const message = zh
      ? `确认发布这 ${ids.length} 条待审内容？\n\n发布后立即对所有访客可见。`
      : `Publish these ${ids.length} pending entries?\n\nThey become visible to everyone immediately.`;
    if (!window.confirm(message)) return;

    setBusyId(BATCH_BUSY_KEY);
    setError('');
    try {
      const response = await fetch('/api/admin/pathfinder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review-batch',
          ids,
          decision: 'published',
          // 与逐条审核的默认一致：进入学习路径要单独判断，批量不替人做这个决定
          learningEligible: false,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      // 部分失败要说出来，否则用户只看到「少了几条」而不知道为什么
      if (result.failed > 0) {
        setError(zh
          ? `${result.failed} 条未能处理（可能已被其他管理员处理）`
          : `${result.failed} could not be processed (possibly handled by another admin)`);
      }
      const doneIds = new Set(ids);
      setItems((current) => current.filter((item) => !doneIds.has(item.id)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusyId(null);
    }
  }

  function confirmArchive(item: ItemRow) {
    const title = zh ? item.titleZh || item.titleEn : item.titleEn || item.titleZh;
    const message = zh
      ? `确认下架这条内容？\n\n${title}\n${item.canonicalUrl}`
      : `Take down this item?\n\n${title}\n${item.canonicalUrl}`;
    if (window.confirm(message)) patch({ action: 'archive', id: item.id });
  }

  if (loading) return <p className="text-sm text-white/60">{zh ? '正在读取目录…' : 'Loading catalog…'}</p>;

  return (
    <div className="space-y-10">
      {error && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="t-title-3">{zh ? '同步来源' : 'Sync sources'}</h2>
            <p className="mt-1 text-sm text-white/60">{zh ? '抓取地址固定在服务端白名单，这里只控制启停和自动发布。' : 'Fetch URLs are code allowlisted; only enablement and auto-publish are configurable here.'}</p>
          </div>
          <span className="t-footnote text-white/60">{sources.length}</span>
        </div>
        <div className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          {sources.map((source) => (
            <div key={source.id} className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{source.name}</p>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/60">{source.trustLevel}</span>
                  {source.consecutiveFailures > 0 && <span className="text-xs text-amber-300">{zh ? `连续失败 ${source.consecutiveFailures} 次` : `${source.consecutiveFailures} consecutive failures`}</span>}
                </div>
                <p className="mt-1 truncate text-xs text-white/60">{source.lastError || source.lastSuccessAt || (zh ? '尚未同步' : 'Not synced yet')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busyId === source.id}
                  onClick={() => patch({ action: 'source', id: source.id, enabled: !source.enabled })}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 disabled:opacity-40"
                >
                  {source.enabled ? (zh ? '已启用' : 'Enabled') : (zh ? '已停用' : 'Disabled')}
                </button>
                <button
                  type="button"
                  disabled={busyId === source.id || !source.canAutoPublish}
                  onClick={() => patch({ action: 'source', id: source.id, autoPublish: !source.autoPublish })}
                  title={!source.canAutoPublish ? (zh ? '此来源始终需要人工审核' : 'This source always requires manual review') : undefined}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {source.autoPublish ? (zh ? '自动发布' : 'Auto publish') : (zh ? '人工审核' : 'Manual review')}
                </button>
              </div>
            </div>
          ))}
          {sources.length === 0 && <p className="p-5 text-sm text-white/60">{zh ? '首次运行同步任务后会建立来源记录。' : 'Source rows are created by the first sync run.'}</p>}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="t-title-3">{zh ? '内容审核与下架' : 'Review and takedown'}</h2>
            <p className="mt-1 text-sm text-white/60">{zh ? '待审内容核对原文后发布；已发布内容发现失效或错误时可立即下架。' : 'Verify pending entries before publishing, and take down published entries immediately if they become invalid or incorrect.'}</p>
          </div>
          <div className="flex items-center gap-3">
            {status === 'pending' && items.some((item) => item.status === 'pending') && (
              <button
                type="button"
                disabled={busyId !== null}
                onClick={approveVisible}
                className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-50"
              >
                {busyId === BATCH_BUSY_KEY
                  ? (zh ? '发布中…' : 'Publishing…')
                  : (zh
                    ? `批量发布前 ${Math.min(BATCH_LIMIT, items.filter((i) => i.status === 'pending').length)} 条`
                    : `Publish first ${Math.min(BATCH_LIMIT, items.filter((i) => i.status === 'pending').length)}`)}
              </button>
            )}
            <span className="t-footnote text-white/60">{items.length}</span>
          </div>
        </div>
        <div className="mb-5 grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <select
            value={status}
            onChange={(event) => applyList(event.target.value as AdminStatus, query)}
            aria-label={zh ? '目录状态' : 'Catalog status'}
            className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
          >
            {ADMIN_STATUSES.map((value) => (
              <option key={value} value={value}>{statusLabel(value, zh)}</option>
            ))}
          </select>
          <input
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') applyList(status, draftQuery.trim());
            }}
            maxLength={160}
            placeholder={zh ? '按 ID、标题、组织或 URL 搜索' : 'Search ID, title, organization, or URL'}
            className="min-w-0 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none placeholder:text-white/60 focus:border-violet-400/50"
          />
          <button
            type="button"
            onClick={() => applyList(status, draftQuery.trim())}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >{zh ? '搜索' : 'Search'}</button>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span>{item.itemType}</span><span aria-hidden>·</span><span>{zh ? item.organization : item.organizationEn || item.organization}</span><span aria-hidden>·</span><span>{item.origin === 'static' ? (zh ? '内置种子' : 'Built-in seed') : (zh ? '动态目录' : 'Dynamic catalog')}</span><span aria-hidden>·</span><span>{statusLabel(item.status, zh)}</span><span aria-hidden>·</span><time>{new Date(item.discoveredAt).toLocaleString(locale)}</time>
              </div>
              <h3 className="t-title-4 mt-2">{zh ? item.titleZh || item.titleEn : item.titleEn || item.titleZh}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/65">{zh ? item.summaryZh || item.summaryEn : item.summaryEn || item.summaryZh}</p>
              {(item.inferredFields || item.requiresManualEligibilityCheck) && (
                <p className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
                  {item.inferredFields
                    ? (zh ? '方向、难度与资格条件由采集规则推断，必须对照原文；该来源在服务端禁止直接进入学习路径。' : 'Direction, difficulty, and eligibility were inferred. This source is server-blocked from learning paths until edited.')
                    : (zh ? '资格条件包含人工核验标记，请在用于学习路径前逐项核对原文。' : 'Eligibility requires manual verification before this item is used in a learning path.')}
                </p>
              )}
              <dl className="mt-4 grid gap-x-5 gap-y-2 rounded-xl border border-white/[0.07] bg-black/20 p-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                <Fact label={zh ? '方向 / 难度' : 'Direction / difficulty'} value={`${formatAdminDirections(item)} · ${item.difficulty ?? '—'}`} />
                <Fact label={zh ? '时间 / 费用' : 'Time / cost'} value={`${item.estimatedMinutes ?? '—'} min · ${formatAdminCost(item, zh)}`} />
                <Fact label={zh ? '设备 / 网络' : 'Device / network'} value={[item.device, item.network].filter(Boolean).join(' · ')} />
                <Fact label={zh ? '地区 / 形式' : 'Region / mode'} value={[zh ? item.regionZh || item.region : item.regionEn || item.region, item.remoteStatus].filter(Boolean).join(' · ')} />
                <Fact label={zh ? '截止' : 'Deadline'} value={(zh ? item.deadlineTextZh || item.deadlineText : item.deadlineTextEn || item.deadlineText) || item.deadlineAt || item.deadlineDate || '—'} />
                <Fact label={zh ? '标签' : 'Tags'} value={Object.values(item.tags ?? {}).flat().join(' · ') || '—'} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <dt className="text-white/60">{zh ? '资格条件' : 'Eligibility'}</dt>
                  <dd className="mt-0.5 leading-5 text-white/75">{zh ? item.eligibilityZh || item.eligibilityEn || '—' : item.eligibilityEn || item.eligibilityZh || '—'}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={item.canonicalUrl} target="_blank" rel="noreferrer" className="mr-auto text-sm text-sky-300 hover:text-sky-200">{zh ? '核对原文 ↗' : 'Verify source ↗'}</a>
                {item.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => patch({ action: 'review', id: item.id, decision: 'rejected', learningEligible: false })}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/65 disabled:opacity-40"
                    >{zh ? '驳回' : 'Reject'}</button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => patch({ action: 'review', id: item.id, decision: 'published', learningEligible: false })}
                      className="rounded-lg border border-violet-300/25 bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-100 disabled:opacity-40"
                    >{zh ? '发布为信息' : 'Publish as information'}</button>
                    {item.canPublishForPath && (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => patch({ action: 'review', id: item.id, decision: 'published', learningEligible: true })}
                        className="rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                      >{zh ? '已核验字段，发布并用于路径' : 'Verified: publish for paths'}</button>
                    )}
                  </>
                ) : item.status === 'archived' ? (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => patch({ action: 'restore', id: item.id })}
                    className="rounded-lg border border-emerald-300/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100 disabled:opacity-40"
                  >{zh ? '恢复到待审核' : 'Restore to pending'}</button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => confirmArchive(item)}
                    className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-100 disabled:opacity-40"
                  >{zh ? '立即下架' : 'Take down'}</button>
                )}
              </div>
            </article>
          ))}
          {items.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/60">{zh ? '当前没有动态目录条目。' : 'No dynamic catalog items.'}</p>}
          {nextOffset !== null && (
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => load({ status, query, offset: nextOffset, append: true })}
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 hover:text-white disabled:opacity-50"
            >{loadingMore ? (zh ? '正在加载…' : 'Loading…') : (zh ? '加载更多' : 'Load more')}</button>
          )}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/60">{label}</dt>
      <dd className="mt-0.5 break-words text-white/75">{value || '—'}</dd>
    </div>
  );
}

function statusLabel(status: AdminStatus, zh: boolean) {
  const labels: Record<AdminStatus, [string, string]> = {
    pending: ['待审核', 'Pending'],
    published: ['已发布', 'Published'],
    stale: ['待复核', 'Stale'],
    expired: ['已过期', 'Expired'],
    archived: ['已下架', 'Archived'],
  };
  return labels[status][zh ? 0 : 1];
}

function formatAdminDirections(item: ItemRow) {
  if (!item.directions) return item.direction ?? '—';
  try {
    const values: unknown = JSON.parse(item.directions);
    if (Array.isArray(values)) {
      const directions = values.filter((value): value is string => typeof value === 'string');
      if (directions.length > 0) return [...new Set(directions)].join(' · ');
    }
  } catch {
    // 旧行或人工数据损坏时仍显示主方向，避免审核页整体失败。
  }
  return item.direction ?? '—';
}

function formatAdminCost(item: ItemRow, zh: boolean) {
  const label = zh ? item.costLabelZh || item.costLabelEn : item.costLabelEn || item.costLabelZh;
  if (label) return label;
  if (item.costAmount !== null && item.costAmount !== undefined && item.costCurrency) {
    return `${item.costCurrency} ${item.costAmount}`;
  }
  if (item.costCny !== null && item.costCny !== undefined) return `CNY ${item.costCny}`;
  return '—';
}
