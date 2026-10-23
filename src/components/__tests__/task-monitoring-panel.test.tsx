import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RecheckTaskPanel from '@/app/[locale]/admin/monitoring/RecheckTaskPanel';
import type { RecheckSnapshot } from '@/lib/task-monitoring-types';

const task: RecheckSnapshot = { taskId: 'pathfinder-recheck', status: 'partial', lastAttemptAt: '2026-10-22T08:00:00.000Z', finishedAt: '2026-10-22T08:00:00.000Z', lastSuccessAt: null, dataUpdatedAt: null, consecutiveAnomalies: 2,
  result: { checked: 2, skipped: 0, verified: 1, failed: 1, doomed: 0, archived: 0, reason: null, failures: [{ id: 'pf_public', reason: 'http', httpStatus: 403 }] } };
describe('任务监控显示', () => {
  it.each(['zh', 'en'] as const)('%s 单独显示部分失败、成功时间与有限失败样本', locale => {
    const html = renderToStaticMarkup(<RecheckTaskPanel task={task} locale={locale} />);
    expect(html).toContain(locale === 'zh' ? '部分失败' : 'Partially failed');
    expect(html).toContain(locale === 'zh' ? '最近完整成功' : 'Last complete success');
    expect(html).toContain('pf_public'); expect(html).toContain('403');
    expect(html).not.toContain(locale === 'zh' ? '检测到故障' : 'Incident detected');
  });
  it('空任务和不适用明确显示，历史成功不会由 UI 猜测', () => {
    const html = renderToStaticMarkup(<RecheckTaskPanel locale="zh" task={{ ...task, status: 'ok', consecutiveAnomalies: 0, result: { ...task.result!, checked: 0, verified: 0, failed: 0, failures: [] } }} />);
    expect(html).toContain('本次没有待回查的公开条目');
    expect(html).toContain('—');
  });
});
