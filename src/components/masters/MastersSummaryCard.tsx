import { Link } from '@/i18n/navigation';
import type { MastersSummary } from '@/lib/masters/types';

export default function MastersSummaryCard({ summary, year, issueDate, today, locale, failed = false }: {
  summary: MastersSummary | null;
  year: number;
  issueDate: string;
  today: string;
  locale: 'zh' | 'en';
  failed?: boolean;
}) {
  const zh = locale === 'zh';
  const intakeYear = summary?.intakeYear ?? year;
  return <section id="masters" className="scroll-mt-24 border-t border-white/10 py-9 sm:py-12" aria-labelledby="masters-summary-title">
    <p className="t-eyebrow text-violet-300">{zh ? '硕士申请' : 'MASTER’S APPLICATIONS'}</p>
    <h2 id="masters-summary-title" className="mt-4 t-title-2 text-white">{zh ? `${intakeYear} 入学 · 全年申请日历` : `${intakeYear} intake · Application calendar`}</h2>
    <p className="mt-3 t-body text-white/70">{zh ? '按学校、专业和轮次查看公开申请期限。关注具体轮次，记录准备进度。' : 'Explore application deadlines by university, subject and round. Follow specific rounds to track your progress.'}</p>
    <p className="mt-3 t-footnote text-white/60">{issueDate !== today
      ? zh ? `这里显示当前申请日历，不是 ${issueDate} 的历史快照；请以全年日历中的最新核验记录为准。` : `This is the current application calendar, not a snapshot from ${issueDate}. Consult the latest verified records in the calendar.`
      : zh ? '申请日历持续更新，不受日刊 30 天回看范围限制。' : 'The application calendar stays available beyond the daily reading history window.'}</p>
    {failed ? <p role="status" className="mt-5 t-footnote text-amber-200">{zh ? '汇总暂时无法读取，你仍可进入全年日历重试。' : 'The summary is temporarily unavailable. Open the full calendar to try again.'}</p>
      : summary && <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
        {([
          [summary.total, zh ? '已收录轮次' : 'Listed rounds'],
          [summary.opening, zh ? '未来 7 天开放' : 'Opening in 7 days'],
          [summary.closingSoon, zh ? '未来 30 天截止' : 'Due within 30 days'],
          [summary.changed, zh ? '近 7 天日期变更' : 'Date changes in 7 days'],
        ] as const).map(([value, label]) => <div key={label}><dt className="t-footnote text-white/60">{label}</dt><dd className="mt-2 t-title-3 tabular-nums text-white">{value}</dd></div>)}
      </dl>}
    <Link href={`/masters?year=${intakeYear}`} className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 py-2 text-sm font-semibold text-violet-200">{zh ? '打开全年申请日历' : 'Open application calendar'} →</Link>
    <p className="mt-3 t-footnote text-white/60">{zh ? '关注本栏目不会自动开启申请提醒；请在具体轮次中单独选择。' : 'Following this channel does not enable deadline reminders. Opt in on each application round.'}</p>
  </section>;
}
