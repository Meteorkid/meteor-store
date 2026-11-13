'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { formatAdminTimestamp } from '@/lib/admin-date';
import type { IeltsPairSource, IeltsPairStatus, IeltsTask } from '@/lib/ielts/types';

/** 一条数据库行（GET /api/admin/ielts 的 rows；页面初始数据与接口同形）。 */
export interface AdminIeltsRow {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  status: IeltsPairStatus;
  source: IeltsPairSource;
  sortOrder: number;
  /** content 为空的行回落到文件精选的标题；两边都没有时为 null */
  title: { zh: string; en: string } | null;
  updatedAt: string;
  /** 这个 slug 是否也在文件精选里（决定「恢复文件版本」是否有意义） */
  inCurated: boolean;
}

/** 公开列表里的一组（GET 的 pairs）：用来补出「只有文件版本」的精选组。 */
export interface AdminIeltsPair {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  sortOrder: number;
  source: IeltsPairSource;
  title: { zh: string; en: string } | null;
  /** 当前公开的正文是否来自数据库行（false = 文件精选版本） */
  fromDatabase: boolean;
}

const inputClass =
  'w-full min-h-11 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors focus:border-violet-400 disabled:opacity-50';
const buttonClass =
  'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-3 text-sm text-white/85 transition-colors hover:bg-white/[0.06] disabled:opacity-50';
const primaryButton =
  'inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50';
const dangerButton =
  'inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/30 px-3 text-sm text-rose-200 transition-colors hover:bg-rose-500/[0.12] disabled:opacity-50';
const panelClass = 'rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5';

const TASKS: { value: IeltsTask; zh: string; en: string }[] = [
  { value: 'task2', zh: 'Task 2 大作文', en: 'Task 2 essay' },
  { value: 'task1-academic', zh: 'Task 1 学术类', en: 'Task 1 academic' },
  { value: 'task1-general', zh: 'Task 1 书信（G 类）', en: 'Task 1 letter (General)' },
];

interface ActionResponse {
  row?: AdminIeltsRow;
  wordCounts?: { low: number; high: number };
  slug?: string;
  status?: IeltsPairStatus;
  fileOverride?: boolean;
  inCurated?: boolean;
  error?: string;
  errorCode?: string;
}

type ActionResult = { ok: true; data: ActionResponse } | { ok: false; code: string; message?: string };

/** 同源 fetch 自带 cookie；失败一律转成可读的中文提示，不把原始错误抛到界面上。 */
async function postAction(body: Record<string, unknown>): Promise<ActionResult> {
  try {
    const response = await fetch('/api/admin/ielts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => ({}))) as ActionResponse;
    if (!response.ok) return { ok: false, code: data.errorCode ?? 'failed', message: data.error };
    return { ok: true, data };
  } catch {
    return { ok: false, code: 'failed' };
  }
}

function Badge({ tone, children }: { tone: 'emerald' | 'amber' | 'rose' | 'violet' | 'sky'; children: ReactNode }) {
  const tones = {
    emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    amber: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
    violet: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
    sky: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  } as const;
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] ${tones[tone]}`}>{children}</span>;
}

function PairCard({ title, subtitle, badges, facts, children }: {
  title: string;
  subtitle: string | null;
  badges: ReactNode;
  facts: { label: string; value: string }[];
  children: ReactNode;
}) {
  return (
    <article className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-title-4 break-words text-white">{title}</h3>
          {subtitle && <p className="mt-1 break-words t-footnote text-white/50">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-2">{badges}</div>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 t-footnote text-white/60">
        {facts.map(fact => (
          <div key={fact.label} className="flex gap-1.5">
            <dt className="text-white/40">{fact.label}</dt>
            <dd className="break-words">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </article>
  );
}

export default function AdminIeltsManager({ initialRows, initialPairs, locale }: {
  initialRows: AdminIeltsRow[];
  initialPairs: AdminIeltsPair[];
  locale: 'zh' | 'en';
}) {
  const en = locale === 'en';
  const t = (zh: string, english: string) => (en ? english : zh);
  const [rows, setRows] = useState(initialRows);
  const [pairs, setPairs] = useState(initialPairs);
  const [task, setTask] = useState<IeltsTask>('task2');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [generating, setGenerating] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const busy = generating || busySlug !== null;
  const rowSlugs = new Set(rows.map(row => row.slug));
  // 只有文件版本的精选组：数据库里没有行，列表里也要让管理员看到并能下架
  const fileOnly = pairs.filter(pair => pair.source === 'curated' && !rowSlugs.has(pair.slug));

  const taskLabel = (value: IeltsTask) => {
    const option = TASKS.find(item => item.value === value);
    return option ? (en ? option.en : option.zh) : value;
  };
  const statusBadge = (status: IeltsPairStatus) => status === 'published'
    ? <Badge tone="emerald">{t('公开', 'Public')}</Badge>
    : status === 'hidden'
      ? <Badge tone="rose">{t('已下架', 'Unpublished')}</Badge>
      : <Badge tone="amber">{t('草稿', 'Draft')}</Badge>;
  const sourceBadge = (source: IeltsPairSource) => source === 'curated'
    ? <Badge tone="violet">{t('来自文件精选', 'From file')}</Badge>
    : <Badge tone="sky">{t('后台生成', 'Generated')}</Badge>;

  function failureMessage(result: { code: string; message?: string }): string {
    // 生成失败的具体原因（模型超时、词数不达标等）只有服务端知道，直接展示比套模板有用
    if (result.code === 'generate_failed' && result.message) return result.message;
    return ({
      not_found: t('登录状态或管理权限已失效，请重新登录。', 'Your administrator session has expired. Sign in again.'),
      origin: t('请求来源校验失败，请从本站重新打开后台。', 'Request origin check failed. Reopen the admin page on this site.'),
      rate_limited: t('操作过于频繁，请稍后重试。', 'Too many requests. Try again shortly.'),
      invalid: t('请求不完整或格式不对，请检查后重试。', 'The request is incomplete or malformed.'),
      too_large: t('请求体过大。', 'The request body is too large.'),
      generate_unconfigured: t('未配置生成密钥（DEEPSEEK_API_KEY），无法生成对照。', 'DEEPSEEK_API_KEY is not configured, so generation is unavailable.'),
      load_failed: t('读取失败，请刷新页面重试。', 'Loading failed. Refresh the page and retry.'),
    } as Record<string, string>)[result.code] ?? t('操作失败，请稍后重试。', 'The request failed. Try again later.');
  }

  /** 写操作后回读服务端结果：可见性由合并层决定，本地推算容易和真实列表漂移。 */
  async function refresh(): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/ielts', { cache: 'no-store' });
      if (!response.ok) return false;
      const data = (await response.json()) as { rows?: AdminIeltsRow[]; pairs?: AdminIeltsPair[] };
      if (!Array.isArray(data.rows) || !Array.isArray(data.pairs)) return false;
      setRows(data.rows);
      setPairs(data.pairs);
      return true;
    } catch {
      return false;
    }
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const trimmedTopic = topic.trim();
    const trimmedCategory = category.trim();
    if (!trimmedTopic || !trimmedCategory) {
      setError(t('请先填写主题和题型分类。', 'Fill in the topic and category first.'));
      return;
    }
    setGenerating(true);
    setError('');
    setNotice('');
    const result = await postAction({ action: 'generate', task, topic: trimmedTopic, category: trimmedCategory });
    if (result.ok && result.data.row) {
      const row = result.data.row;
      // 新草稿直接插到列表顶部；其余字段以服务端返回为准
      setRows(current => [row, ...current.filter(item => item.slug !== row.slug)]);
      setNotice(t('已生成草稿，检查后发布。', 'Draft generated. Review it, then publish.'));
    } else if (!result.ok) {
      setError(failureMessage(result));
    }
    setGenerating(false);
  }

  async function publish(slug: string) {
    if (busy) return;
    setBusySlug(slug);
    setError('');
    setNotice('');
    const result = await postAction({ action: 'publish', slug });
    if (result.ok) {
      const synced = await refresh();
      setNotice(synced
        ? t('已发布，读者现在可以看到这组对照。', 'Published. Readers can now see this pair.')
        : t('已发布，但列表刷新失败，请重新载入页面。', 'Published, but refreshing the list failed. Reload the page.'));
    } else {
      setError(failureMessage(result));
    }
    setBusySlug(null);
  }

  async function hide(slug: string, fromFile: boolean) {
    if (busy) return;
    setBusySlug(slug);
    setError('');
    setNotice('');
    const result = await postAction({ action: 'hide', slug });
    if (result.ok) {
      const synced = await refresh();
      setNotice(synced
        ? fromFile
          ? t('已下架，文件里的精选版本也一并隐藏。', 'Unpublished; the file version is hidden as well.')
          : t('已下架，公开列表里看不到这组对照。', 'Unpublished. This pair is no longer public.')
        : t('已下架，但列表刷新失败，请重新载入页面。', 'Unpublished, but refreshing the list failed. Reload the page.'));
    } else {
      setError(failureMessage(result));
    }
    setBusySlug(null);
  }

  async function restore(slug: string) {
    if (busy) return;
    setBusySlug(slug);
    setError('');
    setNotice('');
    const result = await postAction({ action: 'restore', slug });
    if (result.ok) {
      const synced = await refresh();
      setNotice(synced
        ? t('已删除数据库行，文件里的精选版本回到公开列表。', 'Row removed; the file version is public again.')
        : t('已恢复文件版本，但列表刷新失败，请重新载入页面。', 'File version restored, but refreshing the list failed. Reload the page.'));
    } else {
      setError(failureMessage(result));
    }
    setBusySlug(null);
  }

  async function remove(slug: string) {
    if (busy) return;
    setBusySlug(slug);
    setError('');
    setNotice('');
    const result = await postAction({ action: 'delete', slug });
    if (result.ok) {
      setConfirmSlug(null);
      const synced = await refresh();
      setNotice(synced
        ? t('已删除数据库行。', 'Row deleted.')
        : t('已删除，但列表刷新失败，请重新载入页面。', 'Deleted, but refreshing the list failed. Reload the page.'));
    } else {
      setError(failureMessage(result));
    }
    setBusySlug(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={generate} className={panelClass}>
        <h2 className="t-title-3">{t('生成新对照', 'Generate a new pair')}</h2>
        <p className="mt-2 text-sm text-white/60">
          {t('生成的对照先保存为草稿，检查无误后点「发布」才公开。生成会调用模型，失败时给出具体原因。',
            'Generated pairs are saved as drafts; publish them after checking. Generation calls the model and reports the reason on failure.')}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block space-y-1.5 text-sm text-white/70">
            <span>{t('题型', 'Task')}</span>
            <select className={inputClass} value={task} disabled={busy} onChange={event => setTask(event.target.value as IeltsTask)}>
              {TASKS.map(option => <option key={option.value} value={option.value}>{en ? option.en : option.zh}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm text-white/70">
            <span>{t('主题', 'Topic')}</span>
            <input className={inputClass} value={topic} required maxLength={40} placeholder="education / environment" disabled={busy} onChange={event => setTopic(event.target.value)} />
          </label>
          <label className="block space-y-1.5 text-sm text-white/70">
            <span>{t('题型分类', 'Category')}</span>
            <input className={inputClass} value={category} required maxLength={40} placeholder="opinion / table / letter-formal" disabled={busy} onChange={event => setCategory(event.target.value)} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" className={primaryButton} disabled={busy}>
            {generating ? t('生成中…', 'Generating…') : t('生成新对照', 'Generate pair')}
          </button>
          <span className="t-footnote text-white/45">{t('一次生成通常需要十几秒，请勿重复点击。', 'One generation usually takes ten seconds or more; do not click twice.')}</span>
        </div>
      </form>

      {error && <p role="alert" className="rounded-lg border border-red-400/30 p-3 text-sm text-red-200">{error}</p>}
      {notice && <p role="status" className="text-sm text-emerald-300">{notice}</p>}

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="t-title-3">{t('对照列表', 'Pairs')}</h2>
          <p className="t-footnote text-white/50">
            {t(`数据库 ${rows.length} 行 · 仅文件版本 ${fileOnly.length} 组`, `${rows.length} database rows · ${fileOnly.length} file-only pairs`)}
          </p>
        </div>
        {rows.length === 0 && fileOnly.length === 0 && (
          <p className="t-body text-white/60">{t('还没有对照：用上面的表单生成，或把精选内容写进仓库文件。', 'No pairs yet. Generate one above, or add curated content to the repository files.')}</p>
        )}
        <ul className="grid gap-4">
          {rows.map(row => {
            const fromFile = row.inCurated;
            return (
              <li key={row.slug}>
                <PairCard
                  title={row.title ? row.title.zh : row.slug}
                  subtitle={row.title ? row.title.en : null}
                  badges={<>{statusBadge(row.status)}{sourceBadge(row.source)}</>}
                  facts={[
                    { label: t('题型', 'Task'), value: taskLabel(row.task) },
                    { label: t('主题', 'Topic'), value: row.topic },
                    { label: t('分类', 'Category'), value: row.category },
                    { label: t('排序', 'Order'), value: String(row.sortOrder) },
                    { label: t('更新时间', 'Updated'), value: formatAdminTimestamp(row.updatedAt, locale) },
                  ]}
                >
                  {row.status !== 'published' && (
                    <button type="button" className={buttonClass} disabled={busy} onClick={() => publish(row.slug)}>
                      {t('发布', 'Publish')}
                    </button>
                  )}
                  {row.status === 'published' && (
                    <button type="button" className={buttonClass} disabled={busy} onClick={() => hide(row.slug, fromFile)}>
                      {t('下架', 'Unpublish')}
                    </button>
                  )}
                  {fromFile ? (
                    <button type="button" className={buttonClass} disabled={busy} onClick={() => restore(row.slug)}>
                      {t('恢复文件版本', 'Restore file version')}
                    </button>
                  ) : (
                    <button type="button" className={dangerButton} disabled={busy} onClick={() => setConfirmSlug(row.slug)}>
                      {t('删除', 'Delete')}
                    </button>
                  )}
                  {confirmSlug === row.slug && (
                    <div role="alert" className="mt-1 w-full rounded-lg border border-rose-400/30 bg-rose-500/[0.06] p-3">
                      <p className="text-sm text-rose-100">
                        {t('删除数据库行后，这组对照从公开列表消失；生成的内容无法恢复，只能重新生成。',
                          'Deleting the row removes this pair from the public list. Generated content cannot be recovered and must be regenerated.')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" className={buttonClass} disabled={busy} onClick={() => setConfirmSlug(null)}>
                          {t('取消', 'Cancel')}
                        </button>
                        <button type="button" className={dangerButton} disabled={busy} onClick={() => remove(row.slug)}>
                          {t('确认删除', 'Confirm delete')}
                        </button>
                      </div>
                    </div>
                  )}
                </PairCard>
              </li>
            );
          })}
          {fileOnly.map(pair => (
            <li key={pair.slug}>
              <PairCard
                title={pair.title ? pair.title.zh : pair.slug}
                subtitle={pair.title ? pair.title.en : null}
                badges={<><Badge tone="emerald">{t('公开', 'Public')}</Badge>{sourceBadge(pair.source)}</>}
                facts={[
                  { label: t('题型', 'Task'), value: taskLabel(pair.task) },
                  { label: t('主题', 'Topic'), value: pair.topic },
                  { label: t('分类', 'Category'), value: pair.category },
                  { label: t('排序', 'Order'), value: String(pair.sortOrder) },
                ]}
              >
                <button type="button" className={buttonClass} disabled={busy} onClick={() => hide(pair.slug, true)}>
                  {t('下架', 'Unpublish')}
                </button>
              </PairCard>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
