'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTollowAccessLevel } from '../../core/access';
import type {
  TollowAnalyticsRange,
  TollowAnalyticsResponse,
} from '@/lib/tollow-analytics';
import '../../styles/TollowAnalytics.css';

const RANGES: Array<{ id: TollowAnalyticsRange; label: string }> = [
  { id: '7d', label: '7 天' },
  { id: '30d', label: '30 天' },
  { id: '90d', label: '90 天' },
  { id: 'all', label: '全部' },
];

function formatDuration(durationMs: number): string {
  const minutes = Math.round(durationMs / 60_000);
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} 小时 ${rest} 分` : `${hours} 小时`;
}

function formatDate(value: string, timeZone: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function productHref(): string {
  if (typeof window === 'undefined') return '/zh/products/tollow#pricing';
  const locale = window.location.pathname.split('/')[1] === 'en' ? 'en' : 'zh';
  return `/${locale}/products/tollow#pricing`;
}

function ProUpgrade() {
  return (
    <section className="tollow-pro-upgrade">
      <p className="tollow-analytics-kicker">TOLLOW PRO</p>
      <h1>把每一次练习，变成看得见的进步</h1>
      <p>Pro 提供云同步、跨设备进度、完整历史趋势、收藏与笔记同步，以及 CSV 和学习报告导出。</p>
      <div className="tollow-pro-feature-grid">
        <span>真实 WPM 与准确率趋势</span>
        <span>练习时长与字数分布</span>
        <span>当前与最长连续天数</span>
        <span>¥29 一次买断，永久使用</span>
      </div>
      <a className="tollow-primary-action" href={productHref()}>升级 Pro · ¥29 买断</a>
      <Link className="tollow-secondary-link" to="/practice">继续本地练习</Link>
    </section>
  );
}

function TrendChart({
  title,
  values,
  color,
  suffix,
}: {
  title: string;
  values: Array<{ label: string; value: number }>;
  color: string;
  suffix: string;
}) {
  const width = 720;
  const height = 220;
  const padding = 28;
  const max = Math.max(...values.map((item) => item.value), 1);
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  const points = values.map((item, index) => ({
    ...item,
    x: padding + index * step,
    y: height - padding - (item.value / max) * (height - padding * 2),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const latest = values.at(-1)?.value ?? 0;

  return (
    <article className="tollow-chart-card">
      <div className="tollow-chart-heading">
        <h2>{title}</h2>
        <strong>{latest.toFixed(1)}{suffix}</strong>
      </div>
      <svg role="img" aria-label={`${title}趋势`} viewBox={`0 0 ${width} ${height}`}>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1={padding} x2={width - padding} y1={height * ratio} y2={height * ratio} className="tollow-chart-grid" />
        ))}
        {points.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
        {points.map((point, index) => (
          <circle key={`${point.label}-${index}`} cx={point.x} cy={point.y} r="2.7" fill={color} />
        ))}
      </svg>
      <div className="tollow-chart-axis">
        <span>{values[0]?.label ?? '—'}</span>
        <span>{values.at(-1)?.label ?? '—'}</span>
      </div>
    </article>
  );
}

function VolumeChart({ data }: { data: TollowAnalyticsResponse['trend'] }) {
  const max = Math.max(...data.map((item) => item.durationMs), 1);
  return (
    <article className="tollow-volume-card">
      <div className="tollow-chart-heading">
        <h2>练习投入</h2>
        <span>按日/月份汇总</span>
      </div>
      <div className="tollow-volume-bars" aria-label="练习时长分布">
        {data.map((item) => (
          <div className="tollow-volume-column" key={item.bucket} title={`${item.bucket} · ${formatDuration(item.durationMs)}`}>
            <div style={{ height: `${Math.max(2, (item.durationMs / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="tollow-chart-axis">
        <span>{data[0]?.bucket ?? '—'}</span>
        <span>{data.at(-1)?.bucket ?? '—'}</span>
      </div>
    </article>
  );
}

export default function TollowAnalyticsDashboard() {
  const accessLevel = useTollowAccessLevel();
  const [range, setRange] = useState<TollowAnalyticsRange>('30d');
  const [reloadKey, setReloadKey] = useState(0);
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai', []);
  const requestKey = `${accessLevel}:${range}:${timeZone}:${reloadKey}`;
  const [requestState, setRequestState] = useState<{
    key: string;
    data: TollowAnalyticsResponse | null;
    error: string;
    denied: boolean;
  }>({ key: '', data: null, error: '', denied: false });
  const currentState = requestState.key === requestKey ? requestState : null;
  const data = currentState?.data ?? null;
  const error = currentState?.error ?? '';
  const serverDenied = currentState?.denied ?? false;
  const loading = accessLevel === 'pro' && currentState === null;

  useEffect(() => {
    if (accessLevel !== 'pro') return;
    const controller = new AbortController();
    fetch(`/api/tollow/analytics?range=${range}&timeZone=${encodeURIComponent(timeZone)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as (TollowAnalyticsResponse & { error?: string; code?: string }) | null;
        if (response.status === 403 && body?.code === 'TOLLOW_PRO_REQUIRED') {
          setRequestState({ key: requestKey, data: null, error: '', denied: true });
          return;
        }
        if (!response.ok || !body) throw new Error(body?.error || '统计数据暂时不可用');
        setRequestState({ key: requestKey, data: body, error: '', denied: false });
      })
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setRequestState({
          key: requestKey,
          data: null,
          error: reason instanceof Error ? reason.message : '统计数据暂时不可用',
          denied: false,
        });
      });
    return () => controller.abort();
  }, [accessLevel, range, requestKey, timeZone]);

  if (accessLevel !== 'pro' || serverDenied) return <ProUpgrade />;

  const summaryCards = data ? [
    ['练习时长', formatDuration(data.summary.totalDurationMs)],
    ['输入字数', data.summary.totalWordsTyped.toLocaleString('zh-CN')],
    ['平均 WPM', data.summary.averageWpm.toFixed(1)],
    ['最佳 WPM', data.summary.bestWpm.toFixed(1)],
    ['平均准确率', `${data.summary.averageAccuracy.toFixed(1)}%`],
    ['总错误数', data.summary.totalErrors.toLocaleString('zh-CN')],
    ['练习天数', `${data.summary.practiceDays} 天`],
    ['当前连续', `${data.summary.currentStreak} 天`],
    ['历史最长', `${data.summary.longestStreak} 天`],
  ] : [];

  return (
    <section className="tollow-analytics-page">
      <header className="tollow-analytics-hero">
        <div>
          <p className="tollow-analytics-kicker">PRACTICE REPORT</p>
          <h1>练习分析</h1>
          <p>所有指标都来自你的真实练习记录，按 {timeZone} 统计。</p>
        </div>
        <div className="tollow-analytics-actions tollow-print-hidden">
          <a className="tollow-action-button" href="/api/tollow/export/sessions.csv">导出 CSV</a>
          <button className="tollow-action-button primary" type="button" onClick={() => window.print()} disabled={!data}>打印学习报告</button>
        </div>
      </header>

      <div className="tollow-range-tabs tollow-print-hidden" aria-label="统计时间范围">
        {RANGES.map((item) => (
          <button key={item.id} type="button" aria-pressed={range === item.id} onClick={() => setRange(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {loading && !data ? <div className="tollow-analytics-state">正在整理练习记录…</div> : null}
      {error ? (
        <div className="tollow-analytics-state error">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((current) => current + 1)}>重新加载</button>
        </div>
      ) : null}

      {data ? (
        <div className="tollow-report-sheet">
          <div className="tollow-print-title">
            <h1>Tollow 学习报告</h1>
            <p>{RANGES.find((item) => item.id === range)?.label} · 生成于 {formatDate(data.generatedAt, data.timeZone)}</p>
          </div>

          <div className="tollow-summary-grid">
            {summaryCards.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          {data.summary.totalWordsTyped === 0 ? (
            <div className="tollow-analytics-empty">
              <h2>这个范围内还没有练习记录</h2>
              <p>完成一次练习后，WPM、准确率和投入趋势会出现在这里。</p>
              <Link to="/practice">开始练习</Link>
            </div>
          ) : (
            <>
              <div className="tollow-chart-grid-layout">
                <TrendChart
                  title="WPM"
                  color="#8e2318"
                  suffix=""
                  values={data.trend.map((item) => ({ label: item.bucket, value: item.averageWpm }))}
                />
                <TrendChart
                  title="准确率"
                  color="#1f6b3a"
                  suffix="%"
                  values={data.trend.map((item) => ({ label: item.bucket, value: item.averageAccuracy }))}
                />
              </div>
              <VolumeChart data={data.trend} />

              <div className="tollow-detail-grid">
                <article className="tollow-detail-card">
                  <div className="tollow-section-heading">
                    <h2>书籍分布</h2>
                    <span>{data.books.length} 项内容</span>
                  </div>
                  <div className="tollow-book-breakdown">
                    {data.books.map((book) => (
                      <div key={book.bookId ?? book.bookTitle}>
                        <div><strong>{book.bookTitle}</strong><span>{book.sessionCount} 次</span></div>
                        <p>{formatDuration(book.durationMs)} · {book.wordsTyped.toLocaleString('zh-CN')} 字</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="tollow-detail-card recent">
                  <div className="tollow-section-heading">
                    <h2>最近练习</h2>
                    <span>最近 {data.recentSessions.length} 次</span>
                  </div>
                  <div className="tollow-session-table-wrap">
                    <table>
                      <thead><tr><th>时间</th><th>内容</th><th>WPM</th><th>准确率</th><th>错误</th></tr></thead>
                      <tbody>
                        {data.recentSessions.map((session) => (
                          <tr key={session.id}>
                            <td>{formatDate(session.startedAt, data.timeZone)}</td>
                            <td>{session.bookTitle}</td>
                            <td>{session.wpm.toFixed(1)}</td>
                            <td>{session.accuracy.toFixed(1)}%</td>
                            <td>{session.errorCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
