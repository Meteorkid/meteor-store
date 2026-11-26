'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { WechatDailyQueueItem, WechatDraftHistoryItem } from '@/lib/wechat-mp/types';

type SourceKind = 'post' | 'markdown' | 'daily';
type DailySource = { kind: 'daily'; date: string };

interface PostOption {
  id: string;
  title: string;
  status: string | null;
  source: 'file' | 'database';
}

interface DraftResult {
  mode: 'preview' | 'created';
  title: string;
  author: string;
  digest: string;
  sourceUrl: string;
  html: string;
  imageSources: string[];
  warnings: string[];
  mediaId?: string;
  coverSource?: string;
  uploadedImages?: number;
  backendUrl: string;
  nextStep: string;
}

interface WechatDraftPanelProps {
  configured: boolean;
  today: string;
  dailyQueue: WechatDailyQueueItem[];
  dailyQueueError: boolean;
  draftHistory: WechatDraftHistoryItem[];
  backendUrl: string;
}

const inputClass = 'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-violet-500/50';
const labelClass = 'mb-1 block text-sm text-white/70';
const primaryButton = 'min-h-11 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300';
const secondaryButton = 'min-h-11 rounded-xl border border-white/15 px-5 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300';

export default function WechatDraftPanel({ configured, today, dailyQueue, dailyQueueError, draftHistory, backendUrl }: WechatDraftPanelProps) {
  const t = useTranslations('AdminWechatDraftPage');
  const router = useRouter();
  const [kind, setKind] = useState<SourceKind>(dailyQueue[0]?.count ? 'daily' : 'post');
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [postsFailed, setPostsFailed] = useState(false);
  const [postId, setPostId] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [digest, setDigest] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [cover, setCover] = useState('');
  const [result, setResult] = useState<DraftResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'preview' | 'create' | null>(null);
  const submitLock = useRef(false);
  const [localDrafts, setLocalDrafts] = useState<Record<string, WechatDraftHistoryItem>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/posts', { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('failed'))))
      .then((data: { posts?: PostOption[] }) => {
        setPosts((data.posts ?? []).filter((post) => post.source === 'database' && post.status === 'published'));
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setPostsFailed(true);
      });
    return () => controller.abort();
  }, []);

  function buildBody(dryRun: boolean, dailyOverride?: DailySource) {
    const useOverrides = !dailyOverride;
    const overrides = useOverrides ? {
      ...(title.trim() ? { title: title.trim() } : {}),
      ...(author.trim() ? { author: author.trim() } : {}),
      ...(digest.trim() ? { digest: digest.trim() } : {}),
      ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
    } : {};
    const source = dailyOverride
      ?? (kind === 'post'
        ? { kind: 'post' as const, postId }
        : kind === 'markdown'
          ? { kind: 'markdown' as const, markdown }
          : { kind: 'daily' as const, date });
    return {
      source,
      dryRun,
      ...(useOverrides && cover.trim() ? { cover: cover.trim() } : {}),
      ...(Object.keys(overrides).length ? { overrides } : {}),
    };
  }

  async function submit(dryRun: boolean, dailyOverride?: DailySource) {
    if (submitLock.current) return;
    submitLock.current = true;
    setError('');
    setBusy(dryRun ? 'preview' : 'create');
    try {
      const body = buildBody(dryRun, dailyOverride);
      const response = await fetch('/api/admin/wechat-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json() as { result?: DraftResult; error?: string; hint?: string };
      const nextResult = data.result;
      if (!response.ok || !nextResult) {
        setError([data.error, data.hint].filter(Boolean).join(' — ') || t('submitFailed'));
        return;
      }
      setResult(nextResult);
      if (nextResult.mode === 'created' && body.source.kind === 'daily') {
        const sourceKey = `daily:${body.source.date}`;
        setLocalDrafts((current) => ({
          ...current,
          [sourceKey]: {
            mediaId: nextResult.mediaId ?? '',
            sourceKey,
            title: nextResult.title,
            createdAt: new Date().toISOString(),
          },
        }));
      }
    } catch {
      setError(t('submitFailed'));
    } finally {
      submitLock.current = false;
      setBusy(null);
    }
  }

  async function quickCreate(date: string) {
    if (busy !== null) return;
    setKind('daily');
    setDate(date);
    await submit(false, { kind: 'daily', date });
  }

  function draftFor(date: string): WechatDraftHistoryItem | undefined {
    const sourceKey = `daily:${date}`;
    return localDrafts[sourceKey] ?? draftHistory.find((item) => item.sourceKey === sourceKey);
  }

  const todayItem = dailyQueue.find((item) => item.date === today);
  const todayDraft = draftFor(today);

  const sourceMissing = (kind === 'post' && !postId) || (kind === 'markdown' && !markdown.trim()) || (kind === 'daily' && !date);
  const disabled = busy !== null || sourceMissing;

  const previewDoc = result
    ? `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:20px;background:#fff;color:#222;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;">${result.html}</body></html>`
    : '';

  return (
    <div className="space-y-6">
      <div role="status" className="rounded-xl border border-violet-300/20 bg-violet-500/[0.06] p-4 text-sm leading-relaxed text-violet-100">
        {t('modeNotice')}
      </div>

      {!configured && (
        <div role="alert" className="rounded-xl border border-amber-300/20 bg-amber-500/[0.06] p-4 text-sm leading-relaxed text-amber-100">
          <p className="font-medium">{t('configMissing')}</p>
          <p className="mt-1 text-amber-100/80">{t('configMissingHint')}</p>
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="t-title-3 text-white">{t('dailyQueueTitle')}</h2>
            <p className="t-footnote mt-1 text-white/60">{t('dailyQueueHint')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={secondaryButton}
              disabled={busy !== null}
              onClick={() => router.refresh()}
            >
              {t('refreshDailyQueue')}
            </button>
            <button
              type="button"
              className={primaryButton}
              disabled={busy !== null || !configured || !todayItem?.count || Boolean(todayDraft)}
              onClick={() => void quickCreate(today)}
            >
              {todayDraft ? t('draftCreated') : busy === 'create' ? t('busyCreate') : t('createTodayDraft')}
            </button>
          </div>
        </div>
        {dailyQueueError ? (
          <p role="alert" className="t-footnote text-amber-200/80">{t('dailyQueueError')}</p>
        ) : dailyQueue.length === 0 ? (
          <p className="t-footnote text-white/50">{t('dailyEmpty')}</p>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
            {dailyQueue.map((item) => {
              const draft = draftFor(item.date);
              const isToday = item.date === today;
              return (
                <div
                  key={item.date}
                  className={`rounded-xl border p-3 ${isToday ? 'border-violet-300/30 bg-violet-500/[0.06]' : 'border-white/[0.06] bg-black/10'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{isToday ? t('todayLabel') : item.date.slice(5)}</span>
                    <span className="t-footnote text-white/50">{item.count ? t('dailyPublished', { count: item.count }) : t('dailyEmpty')}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-white/50" title={item.channels.join('、')}>
                    {item.channels.join('、') || t('dailyEmpty')}
                  </p>
                  {draft ? (
                    <a
                      href={backendUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-11 items-center text-xs font-medium text-violet-200 underline underline-offset-4 hover:text-violet-100"
                    >
                      {t('viewDraft')}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 min-h-11 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={busy !== null || !configured || item.count === 0}
                      onClick={() => void quickCreate(item.date)}
                    >
                      {t('createDailyDraft')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div>
          <span className={labelClass}>{t('sourceLabel')}</span>
          <div className="flex flex-wrap gap-2">
            {(['post', 'markdown', 'daily'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setKind(option); setResult(null); setError(''); }}
                className={`min-h-10 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  kind === option ? 'border-violet-400/60 bg-violet-500/15 text-white' : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option === 'post' ? t('sourcePost') : option === 'markdown' ? t('sourceMarkdown') : t('sourceDaily')}
              </button>
            ))}
          </div>
        </div>

        {kind === 'post' && (
          <div>
            <label htmlFor="wechat-draft-post" className={labelClass}>{t('postLabel')}</label>
            <select id="wechat-draft-post" value={postId} onChange={(event) => setPostId(event.target.value)} className={inputClass}>
              <option value="">{posts.length === 0 ? t('postLoading') : t('postEmpty')}</option>
              {posts.map((post) => <option key={post.id} value={post.id}>{post.title}</option>)}
            </select>
            {postsFailed && <p className="mt-2 text-sm text-amber-300">{t('loadPostsFailed')}</p>}
          </div>
        )}

        {kind === 'markdown' && (
          <div>
            <label htmlFor="wechat-draft-markdown" className={labelClass}>{t('markdownLabel')}</label>
            <textarea
              id="wechat-draft-markdown"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              rows={12}
              placeholder={t('markdownPlaceholder')}
              className={`${inputClass} font-mono leading-relaxed`}
            />
          </div>
        )}

        {kind === 'daily' && (
          <div>
            <label htmlFor="wechat-draft-date" className={labelClass}>{t('dateLabel')}</label>
            <input id="wechat-draft-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-sm font-medium text-white/80">{t('overridesHeading')}</p>
          <p className="t-footnote mt-1 text-white/50">{t('overridesHint')}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="wechat-draft-title" className={labelClass}>{t('fieldTitle')}</label>
              <input id="wechat-draft-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={64} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wechat-draft-author" className={labelClass}>{t('fieldAuthor')}</label>
              <input id="wechat-draft-author" value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={20} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wechat-draft-digest" className={labelClass}>{t('fieldDigest')}</label>
              <input id="wechat-draft-digest" value={digest} onChange={(event) => setDigest(event.target.value)} maxLength={120} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wechat-draft-source-url" className={labelClass}>{t('fieldSourceUrl')}</label>
              <input id="wechat-draft-source-url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} maxLength={2000} className={inputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="wechat-draft-cover" className={labelClass}>{t('fieldCover')}</label>
            <input id="wechat-draft-cover" value={cover} onChange={(event) => setCover(event.target.value)} maxLength={2000} className={inputClass} />
            <p className="t-footnote mt-1 text-white/50">{t('coverHint')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" disabled={disabled} onClick={() => void submit(true)} className={secondaryButton}>
            {busy === 'preview' ? t('busyPreview') : t('previewButton')}
          </button>
          <button type="button" disabled={disabled || !configured} onClick={() => void submit(false)} className={primaryButton}>
            {busy === 'create' ? t('busyCreate') : t('createButton')}
          </button>
        </div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </section>

      {result && (
        <section className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="t-title-3 text-white">{result.mode === 'created' ? t('createdHeading') : t('previewHeading')}</h2>
              <span className="t-footnote text-white/60">{t('imagesLabel', { count: result.imageSources.length })}</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{result.title}</p>
            {result.digest && <p className="mt-1 text-sm text-white/50">{result.digest}</p>}

            {result.mode === 'created' && (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  <dt className="text-white/50">{t('mediaIdLabel')}</dt>
                  <dd className="break-all font-mono text-violet-200">{result.mediaId}</dd>
                </div>
                {result.coverSource && (
                  <div className="flex flex-wrap gap-2">
                    <dt className="text-white/50">{t('coverLabel')}</dt>
                    <dd className="break-all text-white/80">{result.coverSource}</dd>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <dt className="text-white/50">{t('uploadedLabel')}</dt>
                  <dd className="text-white/80">{result.uploadedImages ?? 0}</dd>
                </div>
              </dl>
            )}

            {result.warnings.length > 0 && (
              <div role="alert" className="mt-4 rounded-xl border border-amber-300/20 p-3 text-sm text-amber-100">
                <p className="font-medium">{t('warningsHeading')}</p>
                <ul className="mt-1 list-disc pl-5">
                  {result.warnings.map((warning) => <li key={warning}>{warning}</li>)}
                </ul>
              </div>
            )}

            <p role="status" className="mt-4 text-sm leading-relaxed text-emerald-200">{result.nextStep}</p>
            {result.mode === 'created' && (
              <a href={result.backendUrl} target="_blank" rel="noopener noreferrer" className={`${primaryButton} mt-4 inline-block`}>
                {t('openBackend')}
              </a>
            )}
          </div>

          <iframe
            title={t('previewHeading')}
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={previewDoc}
            className="h-[520px] w-full rounded-2xl border border-white/[0.07] bg-white"
          />
        </section>
      )}
    </div>
  );
}
