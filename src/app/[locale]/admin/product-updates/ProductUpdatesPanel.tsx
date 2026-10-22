'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import type { ProductUpdateCheck, ProductUpdateJob, ProductUpdateState } from '@/lib/product-updates/types';

const text = {
  zh: {
    title: '产品更新', description: '检查官方稳定版，核对结果后，一键同步到网站下载。',
    boundary: '仅同步已登记的稳定安装包与 PyPI 包链接。检查不会更改网站下载，也不会启用定时同步。',
    check: '检查产品更新', checking: '正在检查…', sync: '一键同步', syncing: '正在启动同步…',
    loading: '正在读取产品更新状态…', retry: '重新读取状态', empty: '先检查产品更新，查看可同步的官方版本。',
    current: '当前下载版本', latest: '官方最新版本', checkedAt: '检查时间', publishedAt: '官方发布时间',
    source: '官方来源', files: '文件与校验信息', currentFiles: '当前下载', size: '大小', architecture: '架构',
    unknown: '尚未检查', updates: '个产品可同步', noUpdates: '本次检查没有可同步的更新。',
    previousCheck: '上次检查结果（需重新检查）', previousLatest: '上次检查的官方版本',
    stale: '下载目录已发生变化，请重新检查后再同步。', expired: '检查结果已超过一小时，请重新检查。',
    validity: '检查结果一小时内有效；同步前会再次核验同一版本与文件。',
    catalogError: '下载目录无法通过校验，当前显示基础版本。请修复目录后重新检查。',
    job: '同步进度', startedAt: '开始时间', updatedAt: '更新时间', finishedAt: '完成时间',
    refreshing: '同步任务会继续在后台运行，此处每两秒更新进度。',
    failed: '暂时无法读取状态，请重试。', requestFailed: '操作失败，请稍后重试。',
    conflict: '检查结果已失效或已有同步任务，请重新读取状态后再检查。', limited: '操作过于频繁，请稍后重试。',
    forbidden: '当前账号已无管理权限，请刷新页面。', partial: '部分产品同步失败，失败项继续保留原下载。',
    complete: '同步已完成，当前下载版本已刷新。', jobFailed: '同步失败，原下载保持可用。',
    status: { update: '可更新', current: '已是最新', blocked: '暂不可同步', error: '来源检查失败' },
    jobStatus: { queued: '等待启动', running: '同步中', completed: '同步完成', partial: '部分完成', failed: '同步失败' },
    progress: { pending: '等待处理', downloading: '正在下载', uploading: '正在上传', verified: '校验通过', synced: '已同步', skipped: '已跳过', failed: '失败' },
    rowMessage: { update: '发现可同步的稳定版本。', current: '当前下载与官方稳定版一致。', blocked: '版本或文件未通过同步检查。', error: '无法完成官方来源检查。' },
    channel: { 'github-stable': 'GitHub 稳定版', pypi: 'PyPI 软件包' },
  },
  en: {
    title: 'Product updates', description: 'Check official stable releases, review the results, then sync website downloads.',
    boundary: 'Only registered stable installers and PyPI package links are included. Checking does not change downloads or enable scheduled syncing.',
    check: 'Check product updates', checking: 'Checking…', sync: 'Sync all updates', syncing: 'Starting sync…',
    loading: 'Loading product updates…', retry: 'Reload status', empty: 'Check product updates to review available official releases.',
    current: 'Current download', latest: 'Latest official version', checkedAt: 'Checked', publishedAt: 'Official release date',
    source: 'Official source', files: 'Files and checksums', currentFiles: 'Current downloads', size: 'Size', architecture: 'Architecture',
    unknown: 'Not checked', updates: 'products ready to sync', noUpdates: 'This check found no updates ready to sync.',
    previousCheck: 'Previous check (check again)', previousLatest: 'Official version at last check',
    stale: 'The download catalog has changed. Check again before syncing.', expired: 'This check is more than one hour old. Check again.',
    validity: 'Checks are valid for one hour. The same release and files are verified again before syncing.',
    catalogError: 'The download catalog failed validation. Base versions are shown. Repair the catalog and check again.',
    job: 'Sync progress', startedAt: 'Started', updatedAt: 'Updated', finishedAt: 'Finished',
    refreshing: 'The job continues in the background. Progress refreshes every two seconds.',
    failed: 'Status is temporarily unavailable. Please retry.', requestFailed: 'The request failed. Please try again.',
    conflict: 'The check is no longer valid or another sync is active. Reload status and check again.', limited: 'Too many requests. Please try again shortly.',
    forbidden: 'This account no longer has admin access. Refresh the page.', partial: 'Some products failed to sync. Their existing downloads remain available.',
    complete: 'Sync completed. Current download versions have been refreshed.', jobFailed: 'Sync failed. Existing downloads remain available.',
    status: { update: 'Update available', current: 'Up to date', blocked: 'Sync blocked', error: 'Source check failed' },
    jobStatus: { queued: 'Queued', running: 'Syncing', completed: 'Completed', partial: 'Partially completed', failed: 'Failed' },
    progress: { pending: 'Pending', downloading: 'Downloading', uploading: 'Uploading', verified: 'Verified', synced: 'Synced', skipped: 'Skipped', failed: 'Failed' },
    rowMessage: { update: 'A stable release is ready to sync.', current: 'The download matches the official stable release.', blocked: 'The release or its files did not pass sync validation.', error: 'The official source could not be verified.' },
    channel: { 'github-stable': 'GitHub stable release', pypi: 'PyPI package' },
  },
};

const englishReasons: Record<string, string> = {
  '官方来源返回了无效数据。': 'The official source returned invalid data.',
  '版本不是受支持的正式版本；预览版、测试版和非标准版本不会同步。': 'This is not a supported stable version. Preview, beta, and nonstandard versions cannot be synced.',
  '官方资产地址不在允许范围内。': 'The official asset URL is outside the allowed source list.',
  '官方来源出现了不允许的跳转。': 'The official source returned a redirect that is not allowed.',
  '官方资产跳转地址无效。': 'The official asset redirect URL is invalid.',
  '官方来源响应超过允许大小。': 'The official source response exceeds the size limit.',
  '官方来源返回了空响应。': 'The official source returned an empty response.',
  '官方资产跳转次数过多。': 'The official asset exceeded the redirect limit.',
  '官方来源请求超时。': 'The official source request timed out.',
  '无法读取官方来源，请稍后重试。': 'The official source could not be read. Please retry.',
  '无法检查官方来源，请稍后重试。': 'The official source could not be checked. Please retry.',
  '官方来源返回了无效 JSON。': 'The official source returned invalid JSON.',
  '来源是草稿或预览发布，不能同步到正式下载。': 'This release is a draft or preview and cannot replace a stable download.',
  '官方发布缺少有效的发布标识或发布时间。': 'The release has no valid release ID or publication date.',
  '官方发布没有资产列表。': 'The official release has no asset list.',
  '官方发布缺少已登记平台的唯一安装包或配对 SHA-256 校验文件。': 'The release is missing a unique installer or matching SHA-256 file for a registered platform.',
  '官方资产的标识、大小、状态或下载地址不符合固定来源规则。': 'The asset ID, size, state, or URL does not match the fixed source rules.',
  '官方资产没有有效的 SHA-256 校验值。': 'The official asset has no valid SHA-256 checksum.',
  '官方 SHA-256 校验文件超过允许大小。': 'The official SHA-256 file exceeds the size limit.',
  '官方 SHA-256 校验文件没有精确匹配安装包。': 'The official SHA-256 file does not exactly match the installer.',
  '没有唯一的已登记下载条目，不会新增或替换其他平台。': 'No unique registered download was found. Other platforms will not be added or replaced.',
  '当前下载缺少正式版本或有效校验值，需先核对现有条目。': 'The current download is missing a stable version or valid checksum. Review it before syncing.',
  '官方版本低于当前下载版本，已阻止降级。': 'The official release is older than the current download. Downgrading is blocked.',
  '同一版本的官方构建校验值与当前下载不同，需人工核对，不能覆盖。': 'The same version has a different official build checksum. Manual review is required; the current download cannot be overwritten.',
  '已找到正式发布文件及官方 SHA-256，同步时校验下载内容。': 'Official release files and SHA-256 values are available. Downloaded bytes will be verified during syncing.',
  '当前下载已是官方正式版本。': 'The current download is already the official stable version.',
  'PyPI 包名不匹配或发布已被撤回。': 'The PyPI package name does not match, or this release has been yanked.',
  'PyPI 发布版本尚无可安装文件。': 'The PyPI release has no installable files.',
  'PyPI 发布文件已被撤回。': 'The PyPI release files have been yanked.',
  'PyPI 发布文件的名称、地址、大小、校验值或时间无效。': 'A PyPI file has an invalid name, URL, size, checksum, or publication date.',
  '没有唯一的已登记 PyPI 下载条目。': 'No unique registered PyPI download was found.',
  'PyPI 版本低于当前下载版本，已阻止降级。': 'The PyPI release is older than the current download. Downgrading is blocked.',
  '已确认 omnicrawl-core 已发布包，可同步安装链接与版本。': 'The published omnicrawl-core package is verified. Its install link and version are ready to sync.',
  'PyPI 安装链接与已发布版本已是最新。': 'The PyPI install link and published version are up to date.',
  '等待同步': 'Waiting to sync.',
  '复核正式发布记录': 'Verifying the same official release again.',
  '下载并校验正式安装包': 'Downloading and verifying the official installer.',
  '上传到私有存储并完整回读校验': 'Uploading to private storage and reading the full file back for verification.',
  '校验通过，等待切换下载目录': 'Verification passed. Waiting to switch the download catalog.',
  '来源复核、下载或存储校验失败；此产品保留原下载': 'Source verification, download, or storage verification failed. This product keeps its existing download.',
  '已更新网站下载': 'The website download has been updated.',
  '下载目录未切换': 'The download catalog was not switched.',
  '无法启动同步进程，请检查服务器配置': 'The sync worker could not start. Check the server configuration.',
  '本次没有更新下载，请重新检查来源和私有存储配置': 'No downloads were updated. Check the official sources and private storage configuration.',
  '同步未能完成，请重新检查当前下载目录；已上传的包不会覆盖原文件': 'Sync could not finish. Check the current download catalog again. Uploaded packages do not overwrite existing files.',
  '同步进程已中断，请重新检查当前下载目录后再试': 'The sync worker stopped unexpectedly. Check the current download catalog before retrying.',
};

class RequestError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

async function readResponse<T extends { userId: string }>(response: Response, userId: string): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new RequestError(response.status, typeof data.error === 'string' ? data.error : '');
  if (data.userId !== userId) throw new RequestError(403, '');
  return data as T;
}

async function loadState(userId: string, signal: AbortSignal) {
  const response = await fetch('/api/admin/product-updates', { cache: 'no-store', signal });
  return (await readResponse<{ userId: string; state: ProductUpdateState }>(response, userId)).state;
}

function activeJob(job: ProductUpdateJob | null) {
  return job?.status === 'queued' || job?.status === 'running';
}

export default function ProductUpdatesPanel({ userId, initialState }: { userId: string; initialState: ProductUpdateState }) {
  const { user, loading } = useAuth();
  const activeId = loading ? userId : user?.isAdmin ? user.id ?? null : null;
  if (!activeId) return null;
  // 账号变化会卸载旧面板，从而取消轮询和写请求，不复用旧账号的状态。
  return <ProductUpdatesContent key={activeId} userId={activeId} initialState={activeId === userId ? initialState : null} />;
}

function ProductUpdatesContent({ userId, initialState }: { userId: string; initialState: ProductUpdateState | null }) {
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const copy = text[locale];
  const [state, setState] = useState(initialState);
  const [busy, setBusy] = useState<'check' | 'sync' | 'reload' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const actionPending = useRef(false);
  const requests = useRef(new Set<AbortController>());
  const running = activeJob(state?.job ?? null);
  const checkedAt = state?.check?.checkedAt;

  useEffect(() => {
    const controllers = requests.current;
    return () => controllers.forEach(controller => controller.abort());
  }, []);

  useEffect(() => {
    if (!checkedAt) return;
    const expiresIn = Date.parse(checkedAt) + 60 * 60_000 - Date.now();
    const timer = setTimeout(() => setNow(Date.now()), Math.max(0, expiresIn) + 1);
    return () => clearTimeout(timer);
  }, [checkedAt]);

  useEffect(() => {
    if (initialState && !running) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      try {
        const next = await loadState(userId, controller.signal);
        if (controller.signal.aborted) return;
        setState(next);
        setRefreshFailed(false);
        setError(null);
        if (activeJob(next.job)) timer = setTimeout(refresh, 2000);
      } catch (failure) {
        if (controller.signal.aborted) return;
        setRefreshFailed(true);
        const forbidden = failure instanceof RequestError && (failure.status === 403 || failure.status === 404);
        if (forbidden) setState(null);
        setError(forbidden ? copy.forbidden : copy.failed);
        if (running && !forbidden) timer = setTimeout(refresh, 2000);
      }
    }
    timer = setTimeout(refresh, running ? 2000 : 0);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [userId, initialState, running, copy.failed, copy.forbidden]);

  const check = state?.check;
  const updateCount = check?.rows.filter(row => row.status === 'update').length ?? 0;
  const stale = Boolean(check && check.baseRevision !== state?.currentRevision);
  const expired = Boolean(check && (!Number.isFinite(Date.parse(check.checkedAt)) || now >= Date.parse(check.checkedAt) + 60 * 60_000));
  const historical = stale || expired;
  const canSync = Boolean(check && updateCount > 0 && !stale && !expired && !running && !busy && !refreshFailed && !state?.catalogError);

  async function runAction(action: 'check' | 'sync' | 'reload') {
    if (actionPending.current || (action !== 'reload' && running) || (action === 'sync' && !canSync)) return;
    actionPending.current = true;
    setBusy(action);
    setError(null);
    const controller = new AbortController();
    requests.current.add(controller);
    try {
      if (action !== 'reload') {
        const response = await fetch(`/api/admin/product-updates/${action}`, {
          method: 'POST', cache: 'no-store', signal: controller.signal,
          ...(action === 'sync' ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checkId: check?.id }) } : {}),
        });
        const data = await readResponse<{ userId: string; check?: ProductUpdateCheck; job?: ProductUpdateJob }>(response, userId);
        if (controller.signal.aborted) return;
        setState(previous => previous ? { ...previous, ...(data.check ? { check: data.check } : {}), ...(data.job ? { job: data.job } : {}) } : previous);
      }
      const next = await loadState(userId, controller.signal);
      if (controller.signal.aborted) return;
      setState(next);
      setRefreshFailed(false);
      setNow(Date.now());
    } catch (failure) {
      if (controller.signal.aborted) return;
      setRefreshFailed(true);
      const status = failure instanceof RequestError ? failure.status : 0;
      if (status === 404 || status === 403) setState(null);
      setError(status === 404 || status === 403 ? copy.forbidden : status === 409 ? copy.conflict : status === 429 ? copy.limited
        : locale === 'zh' && failure instanceof RequestError && failure.message ? failure.message : copy.requestFailed);
    } finally {
      requests.current.delete(controller);
      actionPending.current = false;
      if (!controller.signal.aborted) setBusy(null);
    }
  }

  const formatTime = (value: string | null | undefined) => value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Shanghai',
  }).format(new Date(value)) : '—';
  const formatBytes = (bytes: number) => `${new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-CN', { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MiB`;
  const messageText = (message: string, fallback: string) => {
    if (locale === 'zh') return message || fallback;
    if (englishReasons[message]) return englishReasons[message];
    const developmentStage = message.match(/^(.*)项目元数据标注为 (Alpha|Beta) 开发阶段。$/);
    if (developmentStage && englishReasons[developmentStage[1]]) {
      return `${englishReasons[developmentStage[1]]} The project is classified as ${developmentStage[2]}.`;
    }
    const httpStatus = message.match(/^官方来源请求失败（HTTP (\d{3})）。$/)?.[1];
    if (httpStatus) return `The official source request failed (HTTP ${httpStatus}).`;
    if (/PyPI.*(?:Alpha|Beta)/i.test(message)) return 'The PyPI package is classified as Alpha or Beta and cannot replace a stable download.';
    return message ? `${fallback} (${message})` : fallback;
  };
  const buttonClass = 'min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300';

  return <>
    <header className="mb-8">
      <h1 className="t-title-2">{copy.title}</h1>
      <p className="mt-2 t-footnote text-white/70">{copy.description}</p>
      <p className="mt-3 max-w-3xl t-footnote text-white/60">{copy.boundary}</p>
    </header>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => void runAction('check')} disabled={Boolean(busy) || running || !state} className={buttonClass}>{busy === 'check' ? copy.checking : copy.check}</button>
      <button type="button" onClick={() => void runAction('sync')} disabled={!canSync} className={`${buttonClass} bg-violet-500/20 text-violet-100`}>{busy === 'sync' ? copy.syncing : copy.sync}{updateCount > 0 && !historical ? ` (${updateCount})` : ''}</button>
    </div>
    {error && <div role="alert" className="mt-5 rounded-xl border border-amber-300/20 p-4 text-amber-100">
      <p>{error}</p><button type="button" onClick={() => void runAction('reload')} disabled={Boolean(busy)} className={`${buttonClass} mt-3`}>{copy.retry}</button>
    </div>}
    {!state && !error && <p role="status" className="mt-6 t-body text-white/70">{copy.loading}</p>}
    {state && <>
      {state.catalogError && <p role="alert" className="mt-5 rounded-xl border border-amber-300/20 p-4 text-amber-100">{copy.catalogError}</p>}
      <div className="my-6 space-y-2 t-footnote text-white/70" aria-live="polite">
        {check ? <>
          <p>{copy.checkedAt} · UTC+8: {formatTime(check.checkedAt)}</p>
          <p>{historical ? copy.previousCheck : updateCount > 0 ? `${updateCount} ${copy.updates}` : copy.noUpdates}</p>
          <p className={stale || expired ? 'text-amber-100' : ''}>{stale ? copy.stale : expired ? copy.expired : copy.validity}</p>
        </> : <p>{copy.empty}</p>}
      </div>
      {state.job && <section aria-label={copy.job} className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="t-title-3">{copy.job}</h2>
        <p role="status" aria-live="polite" className={`mt-3 font-medium ${state.job.status === 'completed' ? 'text-emerald-200' : state.job.status === 'failed' || state.job.status === 'partial' ? 'text-amber-100' : 'text-violet-200'}`}>{copy.jobStatus[state.job.status]}</p>
        <p className="mt-2 t-footnote text-white/70">{running ? copy.refreshing : state.job.status === 'partial' ? copy.partial : state.job.status === 'completed' ? copy.complete : copy.jobFailed}</p>
        {state.job.error && <p className="mt-2 break-words t-footnote text-amber-100">{messageText(state.job.error, copy.jobFailed)}</p>}
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-white/60">{copy.startedAt} · UTC+8</dt><dd className="mt-1">{formatTime(state.job.startedAt)}</dd></div>
          <div><dt className="text-white/60">{copy.updatedAt} · UTC+8</dt><dd className="mt-1">{formatTime(state.job.updatedAt)}</dd></div>
          <div><dt className="text-white/60">{copy.finishedAt} · UTC+8</dt><dd className="mt-1">{formatTime(state.job.finishedAt)}</dd></div>
        </dl>
        <ul className="mt-5 divide-y divide-white/10">
          {state.job.rows.map(row => <li key={row.productId} className="py-3">
            <div className="flex flex-wrap justify-between gap-2 text-sm"><span>{state.current.find(product => product.productId === row.productId)?.name ?? row.productId}</span><span className={row.status === 'failed' ? 'text-amber-100' : 'text-white/70'}>{copy.progress[row.status]}</span></div>
            {row.message && <p className="mt-1 break-words t-footnote text-white/60">{messageText(row.message, copy.progress[row.status])}</p>}
          </li>)}
        </ul>
      </section>}
      <div className="space-y-4">
        {state.current.map(product => {
          const row = check?.rows.find(item => item.productId === product.productId);
          const currentVersion = [...new Set(product.downloads.map(download => download.version).filter(Boolean))].join(' / ') || '—';
          return <section key={product.productId} aria-label={product.name} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="t-title-3">{product.name}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${row?.status === 'update' ? 'bg-violet-500/20 text-violet-200' : row?.status === 'current' ? 'bg-emerald-500/10 text-emerald-200' : row ? 'bg-amber-500/10 text-amber-100' : 'bg-white/5 text-white/70'}`}>{row ? `${historical ? `${copy.previousCheck}: ` : ''}${copy.status[row.status]}` : copy.unknown}</span>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><dt className="t-footnote text-white/60">{copy.current}</dt><dd className="mt-1 break-words text-lg tabular-nums">{currentVersion}</dd></div>
              <div><dt className="t-footnote text-white/60">{historical ? copy.previousLatest : copy.latest}</dt><dd className="mt-1 break-words text-lg tabular-nums">{row?.latestVersion ?? '—'}</dd></div>
            </dl>
            {row && <>
              <p className="mt-4 break-words t-footnote text-white/70">{messageText(row.message, copy.rowMessage[row.status])}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 t-footnote text-white/60">
                <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="break-all text-violet-200 underline underline-offset-4">{copy.source} · {copy.channel[row.channel]}</a>
                <p>{copy.publishedAt} · UTC+8: {formatTime(row.publishedAt)}</p>
              </div>
            </>}
            <details className="mt-5 border-t border-white/10 pt-4">
              <summary className="min-h-11 cursor-pointer py-2 text-sm text-white/70 focus-visible:outline-2 focus-visible:outline-violet-300">{copy.files}{row?.assets.length ? ` (${row.assets.length})` : ''}</summary>
              <div className="mt-3 space-y-4 text-sm">
                {row?.assets.map(asset => <div key={asset.fileId} className="min-w-0 rounded-xl bg-white/[0.03] p-4">
                  <p className="break-all font-medium">{asset.name}</p>
                  <p className="mt-2 text-white/70">{copy.size}: {formatBytes(asset.bytes)} · {copy.architecture}: {asset.architecture}</p>
                  <p className="mt-2 text-white/60">SHA-256</p><code className="mt-1 block break-all text-xs text-white/80">{asset.sha256}</code>
                </div>)}
                {row?.link && <p className="break-all text-white/70">{row.link.packageName} · {row.link.version}<br /><a href={row.link.url} target="_blank" rel="noopener noreferrer" className="text-violet-200 underline underline-offset-4">{row.link.url}</a></p>}
                <div><h3 className="t-footnote text-white/60">{copy.currentFiles}</h3><ul className="mt-2 space-y-3">
                  {product.downloads.map(download => <li key={download.id} className="break-all text-white/70"><p>{download.id} · {download.version ?? '—'}</p>{download.sha256 && <code className="mt-1 block text-xs">SHA-256: {download.sha256}</code>}</li>)}
                </ul></div>
              </div>
            </details>
          </section>;
        })}
      </div>
    </>}
  </>;
}
