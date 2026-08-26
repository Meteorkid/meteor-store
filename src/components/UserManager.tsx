'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type {
  AdminRosterEntry,
  AdminUserDetail,
  AdminUserFilter,
  AdminUserPage,
  AdminUserSummary,
} from '@/lib/admin-users';

const FILTERS: AdminUserFilter[] = [
  'all',
  'pass',
  'pass-expired',
  'admin',
  'unverified',
  'mfa',
  'wechat',
];

/*
 * 必须显式传 locale：这些日期在 SSR 阶段就渲染了（首屏数据由服务端给），
 * 不传的话 Node 端按服务器默认 locale/时区格式化、浏览器端按用户的，
 * 两边文本不同即 hydration mismatch。
 */
function formatDate(value: string | null, locale: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(locale);
}

function formatDateTime(value: string | null, locale: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale);
}

export default function UserManager({
  initial,
  roster,
}: {
  initial: AdminUserPage;
  roster: AdminRosterEntry[];
}) {
  const t = useTranslations('AdminUsersPage');
  const [data, setData] = useState(initial);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AdminUserFilter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, AdminUserDetail>>({});
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  // 首屏数据由服务端给了，挂载时不必再打一次接口
  const primed = useRef(false);
  /*
   * 列表请求的序号：只认最后一次发出的响应。
   * 没有它的话，快速点「下一页 → 下一页 → 上一页」时先发的慢响应后到，
   * 列表会停在被跳过的那一页，而页码指示器跟着 data.page 一起回退，
   * 与本地 page state 对不上。防抖只保护输入，翻页和切筛选不受保护。
   */
  const requestSeq = useRef(0);

  const load = useCallback(
    (next: { query: string; filter: AdminUserFilter; page: number }) => {
      const seq = ++requestSeq.current;
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        filter: next.filter,
        page: String(next.page),
      });
      if (next.query) params.set('q', next.query);
      fetch(`/api/admin/users?${params}`)
        .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
        .then(({ ok, body }) => {
          if (seq !== requestSeq.current) return;
          if (!ok) throw new Error(body?.error || t('operationFailed'));
          setData(body as AdminUserPage);
        })
        .catch((err: unknown) => {
          if (seq !== requestSeq.current) return;
          setError(err instanceof Error ? err.message : t('operationFailed'));
        })
        .finally(() => {
          if (seq === requestSeq.current) setLoading(false);
        });
    },
    [t],
  );

  // 搜索防抖：输入停下 300ms 再打接口
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    if (!primed.current) {
      primed.current = true;
      return;
    }
    load({ query, filter, page });
  }, [query, filter, page, load]);

  const refresh = () => load({ query, filter, page });

  const toggleDetail = (userId: string) => {
    if (expanded === userId) {
      setExpanded(null);
      return;
    }
    setExpanded(userId);
    if (details[userId]) return;
    setDetailErrors((current) => {
      if (!current[userId]) return current;
      const next = { ...current };
      delete next[userId];
      return next;
    });
    fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body?.error || t('operationFailed'));
        setDetails((current) => ({ ...current, [userId]: body.detail as AdminUserDetail }));
      })
      .catch((err: unknown) => {
        // 只 setError 的话展开区会永远渲染「加载中…」，用户看不出是失败了
        setDetailErrors((current) => ({
          ...current,
          [userId]: err instanceof Error ? err.message : t('operationFailed'),
        }));
      });
  };

  const act = async (key: string, body: Record<string, unknown>, onDone?: (data: { tokenVersion?: number }) => void) => {
    setBusy(key);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || t('operationFailed'));
      onDone?.(payload);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('operationFailed'));
    } finally {
      setBusy('');
    }
  };

  const pages = Math.max(Math.ceil(data.total / data.pageSize), 1);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <h2 className="t-title-4">{t('rosterTitle')}</h2>
        <p className="t-footnote mt-1 text-white/50">{t('rosterHint')}</p>
        {roster.length === 0 ? (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            {t('rosterEmpty')}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {roster.map((entry) => (
              <li
                key={entry.email}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm"
              >
                <span className="min-w-0 truncate font-mono text-white/80">{entry.email}</span>
                {entry.name && <span className="text-white/45">{entry.name}</span>}
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                    entry.effective
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-amber-500/15 text-amber-300'
                  }`}
                >
                  {entry.effective
                    ? t('rosterEffective')
                    : entry.registered
                      ? t('rosterUnverified')
                      : t('rosterUnregistered')}
                </span>
                {entry.totpEnabled && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                    {t('badgeMfa')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('search')}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none"
          />
          <span className="t-footnote tabular-nums text-white/50">
            {loading ? t('loading') : t('total', { count: data.total })}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => {
                setFilter(item);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                filter === item
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t(`filter_${item}`)}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300" role="status">
            {notice}
          </p>
        )}

        {data.users.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/45">{t('empty')}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {data.users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                busy={busy}
                expanded={expanded === user.id}
                detail={details[user.id]}
                detailError={detailErrors[user.id]}
                onToggle={() => toggleDetail(user.id)}
                onAct={act}
                onNotice={setNotice}
              />
            ))}
          </ul>
        )}

        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/[0.06] disabled:opacity-40"
            >
              {t('prev')}
            </button>
            <span className="t-footnote tabular-nums text-white/50">
              {t('pageIndicator', { page: data.page, pages })}
            </span>
            <button
              type="button"
              disabled={page >= pages || loading}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/[0.06] disabled:opacity-40"
            >
              {t('next')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function UserRow({
  user,
  busy,
  expanded,
  detail,
  detailError,
  onToggle,
  onAct,
  onNotice,
}: {
  user: AdminUserSummary;
  busy: string;
  expanded: boolean;
  detail: AdminUserDetail | undefined;
  detailError: string | undefined;
  onToggle: () => void;
  onAct: (
    key: string,
    body: Record<string, unknown>,
    onDone?: (data: { tokenVersion?: number }) => void,
  ) => void;
  onNotice: (message: string) => void;
}) {
  const t = useTranslations('AdminUsersPage');
  const locale = useLocale();
  const pass = user.pass;

  /*
   * 管理员的实际访问权和 Pass 无关：`getUserEntitlementSummary` 对
   * `ADMIN_EMAILS` 里的账号直接短路，返回全部产品。所以这里必须把「管理员」
   * 作为主状态显示——否则一个 Pass 过期的管理员在后台写着「会员已过期」，
   * 而他在 /apps 看到的是全部可用，正好是这页要避免的那种不一致。
   * 真实的 Pass 记录仍然显示在下面一行，只是标明它不是当前的放行依据。
   */
  const passLabel = user.isAdmin
    ? t('accessAdmin')
    : !pass
      ? t('passNone')
      : pass.active
        ? t('passActive')
        : t('passExpired');

  const passState = !pass
    ? null
    : pass.lifetime
      ? t('passLifetime')
      : pass.expiresAt
        ? t('passUntil', { date: formatDate(pass.expiresAt, locale) })
        : t('passUnknown');
  const passDetail = user.isAdmin
    ? pass
      ? t('passRecord', { state: `${pass.active ? t('passActive') : t('passExpired')} · ${passState}` })
      : null
    : passState;

  const stats: { label: string; value: string }[] = [
    { label: t('statOrders'), value: String(user.paidOrders) },
    { label: t('statSpent'), value: `¥${user.totalSpentCny}` },
    { label: t('statPosts'), value: String(user.postCount) },
    { label: t('statComments'), value: String(user.commentCount) },
    { label: t('statRedemptions'), value: String(user.redemptionCount) },
    { label: t('statTokens'), value: String(user.activeTokens) },
  ];

  return (
    <li className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-medium text-white/90">
            <span className="truncate">{user.name || user.email}</span>
            {user.isAdmin && (
              <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-300">
                {t('badgeAdmin')}
              </span>
            )}
            {!user.emailVerified && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">
                {t('badgeUnverified')}
              </span>
            )}
            {user.totpEnabled && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {t('badgeMfa')}
              </span>
            )}
            {user.hasWechat && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {t('badgeWechat')}
              </span>
            )}
            {user.isStudent && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {t('badgeStudent')}
              </span>
            )}
          </p>
          <p className="t-footnote mt-1 truncate text-white/50">{user.email}</p>
          <p className="t-footnote mt-1 truncate font-mono text-white/30">{user.id}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-sm font-medium ${
              user.isAdmin
                ? 'text-violet-300'
                : pass?.active ? 'text-emerald-400' : pass ? 'text-amber-400/80' : 'text-white/40'
            }`}
          >
            {passLabel}
            {!user.isAdmin && pass?.planId && (
              <span className="ml-2 text-white/45">{t(`plan_${pass.planId}`)}</span>
            )}
          </p>
          {passDetail && <p className="t-footnote mt-1 text-white/45">{passDetail}</p>}
          <p className="t-footnote mt-1 text-white/30">
            {t('joinedAt', { date: formatDate(user.createdAt, locale) })}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="t-footnote text-white/40">{stat.label}</dt>
            <dd className="mt-0.5 text-sm tabular-nums text-white/80">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/[0.06]"
        >
          {expanded ? t('detailHide') : t('detailShow')}
        </button>

        <button
          type="button"
          disabled={busy === `revoke:${user.id}`}
          onClick={() => {
            if (!window.confirm(t('actionRevokeConfirm'))) return;
            onAct(`revoke:${user.id}`, { action: 'revoke-sessions', userId: user.id }, (data) => {
              onNotice(t('revoked', { version: data.tokenVersion ?? '' }));
            });
          }}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/[0.06] disabled:opacity-50"
        >
          {t('actionRevoke')}
        </button>

        {user.totpEnabled && (
          <button
            type="button"
            disabled={busy === `mfa:${user.id}`}
            onClick={() => {
              if (!window.confirm(t('actionResetMfaConfirm'))) return;
              onAct(`mfa:${user.id}`, { action: 'reset-mfa', userId: user.id }, () => {
                onNotice(t('done'));
              });
            }}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/[0.06] disabled:opacity-50"
          >
            {t('actionResetMfa')}
          </button>
        )}

        {user.emailVerified ? (
          <button
            type="button"
            disabled={busy === `verify:${user.id}`}
            onClick={() => {
              if (!window.confirm(t('actionUnverifyConfirm'))) return;
              onAct(
                `verify:${user.id}`,
                { action: 'set-email-verified', userId: user.id, verified: false },
                () => onNotice(t('done')),
              );
            }}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {t('actionUnverify')}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy === `verify:${user.id}`}
            onClick={() =>
              onAct(
                `verify:${user.id}`,
                { action: 'set-email-verified', userId: user.id, verified: true },
                () => onNotice(t('done')),
              )
            }
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {t('actionVerify')}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-white/[0.07] pt-4">
          {detailError ? (
            <p className="t-footnote text-red-400" role="alert">
              {detailError}
              {' '}
              <button
                type="button"
                onClick={onToggle}
                className="underline underline-offset-2 hover:text-red-300"
              >
                {t('detailRetry')}
              </button>
            </p>
          ) : !detail ? (
            <p className="t-footnote text-white/45">{t('loading')}</p>
          ) : (
            <>
              <DetailBlock title={t('detailOrders')} empty={t('detailEmpty')} rows={detail.orders.map((o) => ({
                key: o.id,
                main: `${o.productId} · ${o.planName} · ¥${o.amountCny}`,
                meta: `${o.status} / ${o.deliveryStatus} · ${formatDateTime(o.paidAt ?? o.createdAt, locale)}`,
              }))} />
              <DetailBlock title={t('detailLicenses')} empty={t('detailEmpty')} rows={detail.licenses.map((l) => ({
                key: l.id,
                main: `${l.productId} · ${l.planName}`,
                meta: `${l.key} · ${l.status} · ${formatDateTime(l.createdAt, locale)}`,
              }))} />
              <DetailBlock title={t('detailRedemptions')} empty={t('detailEmpty')} rows={detail.redemptions.map((r) => ({
                key: r.id,
                main: `${r.code} → ${r.productId} · ${r.planName}`,
                meta: `${r.licenseKey} · ${formatDateTime(r.redeemedAt, locale)}`,
              }))} />
            </>
          )}
        </div>
      )}
    </li>
  );
}

function DetailBlock({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: { key: string; main: string; meta: string }[];
}) {
  return (
    <div>
      <h3 className="t-footnote text-white/45">{title}</h3>
      {rows.length === 0 ? (
        <p className="t-footnote mt-1 text-white/30">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map((row) => (
            <li key={row.key} className="rounded-lg bg-white/[0.03] px-3 py-2">
              <p className="truncate text-sm text-white/80">{row.main}</p>
              <p className="t-footnote mt-0.5 truncate font-mono text-white/40">{row.meta}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
