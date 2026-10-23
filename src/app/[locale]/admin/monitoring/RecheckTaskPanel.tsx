import { taskMonitoringText, type RecheckSnapshot } from '@/lib/task-monitoring-types';

export default function RecheckTaskPanel({ task, locale }: { task: RecheckSnapshot; locale: 'en' | 'zh' }) {
  const copy = taskMonitoringText[locale];
  const formatTime = (value: string | null) => value ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Shanghai',
  }).format(new Date(value)) : '—';
  return <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6" aria-label={copy.title}>
    <h2 className="t-title-3">{copy.title}</h2>
    <p className="mt-2 t-footnote text-white/70">{copy.description}</p>
    <p className={`mt-4 t-title-4 ${task.status === 'ok' ? 'text-emerald-200' : 'text-amber-100'}`}>{copy.status[task.status]}</p>
    {task.status === 'not-configured' && <p className="mt-2 t-footnote text-white/70">{copy.missing}</p>}
    {task.status === 'stale' && <p className="mt-2 t-footnote text-white/70">{copy.stale}</p>}
    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
      {([[copy.attempt, formatTime(task.lastAttemptAt)], [copy.success, formatTime(task.lastSuccessAt)],
        [copy.updated, formatTime(task.dataUpdatedAt)], [copy.anomalies, task.consecutiveAnomalies]] as const).map(([label, value]) => <div key={label}>
        <dt className="t-footnote text-white/60">{label}{label !== copy.anomalies ? ' · UTC+8' : ''}</dt>
        <dd className="mt-1 text-sm text-white">{value}</dd>
      </div>)}
    </dl>
    {task.result && <div className="mt-5">
      <h3 className="t-title-4">{copy.counts}</h3>
      <p className="mt-2 t-footnote text-white/70">{copy.checked} {task.result.checked} · {copy.verified} {task.result.verified} · {copy.skipped} {task.result.skipped} · {copy.failed} {task.result.failed} · {copy.archived} {task.result.archived}</p>
      {task.result.reason ? <p className="mt-2 t-footnote text-amber-100">{copy.reason[task.result.reason]}</p>
        : task.result.checked === 0 ? <p className="mt-2 t-footnote text-white/70">{copy.empty}</p>
          : task.result.checked === task.result.skipped && <p className="mt-2 t-footnote text-white/70">{copy.skippedNote}</p>}
      {task.result.failures.length > 0 && <>
        <h3 className="mt-4 t-footnote text-white/70">{copy.samples}</h3>
        <ul className="mt-2 space-y-2 t-footnote text-white/70">
          {task.result.failures.map(failure => <li key={failure.id}><code className="break-all">{failure.id}</code>{' '}<span className="inline-block">· {copy.reason[failure.reason]}{failure.httpStatus !== null ? ` (${failure.httpStatus})` : ''}</span></li>)}
        </ul>
      </>}
    </div>}
  </section>;
}
