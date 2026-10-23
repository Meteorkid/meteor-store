import { z } from 'zod';

const timestamp = z.string().datetime();
const count = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
export const RecheckResultSchema = z.object({
  checked: count, skipped: count, verified: count, failed: count, doomed: count, archived: count,
  reason: z.enum(['configuration', 'database']).nullable(),
  failures: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
    reason: z.enum(['http', 'network', 'invalid-response']),
    httpStatus: z.number().int().min(100).max(599).nullable(),
  })).max(5),
}).refine(value => value.checked === value.skipped + value.verified + value.failed
  && value.doomed <= value.verified && value.archived <= value.doomed
  && value.failures.length <= value.failed);

export const RecheckFileSchema = z.object({
  version: z.literal(1), taskId: z.literal('pathfinder-recheck'),
  status: z.enum(['running', 'ok', 'partial', 'failed']),
  lastAttemptAt: timestamp, finishedAt: timestamp.nullable(),
  lastSuccessAt: timestamp.nullable(), dataUpdatedAt: timestamp.nullable(),
  consecutiveAnomalies: count,
  result: RecheckResultSchema.nullable(),
}).refine(value => value.status === 'running'
  ? value.finishedAt === null && value.result === null
  : value.finishedAt !== null && value.result !== null
    && (value.status === 'ok'
      ? value.result.reason === null && value.result.failed === 0 && value.consecutiveAnomalies === 0
      : value.consecutiveAnomalies > 0 && (value.status === 'partial'
        ? value.result.reason === null && value.result.failed > 0 && value.result.verified > 0
        : value.result.reason !== null || value.result.failed > 0 && value.result.verified === 0)));

export const RecheckSnapshotSchema = z.object({
  taskId: z.literal('pathfinder-recheck'),
  status: z.enum(['not-configured', 'unavailable', 'stale', 'running', 'ok', 'partial', 'failed']),
  lastAttemptAt: timestamp.nullable(), finishedAt: timestamp.nullable(),
  lastSuccessAt: timestamp.nullable(), dataUpdatedAt: timestamp.nullable(),
  consecutiveAnomalies: count, result: RecheckResultSchema.nullable(),
});
export type RecheckSnapshot = z.infer<typeof RecheckSnapshotSchema>;

export function parseTaskMonitoringResponse(value: unknown, userId: string): RecheckSnapshot | null {
  const parsed = z.object({ userId: z.literal(userId), task: z.unknown().optional() }).safeParse(value);
  if (!parsed.success) throw new Error('Task monitoring response unavailable');
  if (parsed.data.task === undefined) return null;
  const task = RecheckSnapshotSchema.safeParse(parsed.data.task);
  // 任务响应不可读也不应抹掉独立的服务健康结果。
  return task.success ? task.data : {
    taskId: 'pathfinder-recheck', status: 'unavailable', lastAttemptAt: null, finishedAt: null,
    lastSuccessAt: null, dataUpdatedAt: null, consecutiveAnomalies: 0, result: null,
  };
}

export const taskMonitoringText = {
  zh: {
    title: '开源条目回查', description: '记录现有每日回查任务的运行结果。任务异常与服务健康分开显示，不产生新的站内提醒。',
    status: { 'not-configured': '尚未收到任务记录', unavailable: '任务记录不可用', stale: '任务记录已过期', running: '正在运行', ok: '完整完成', partial: '部分失败', failed: '任务失败' },
    attempt: '最近尝试', success: '最近完整成功', updated: '最近归档写入', anomalies: '连续异常',
    counts: '本次结果', checked: '候选', verified: '已核验', skipped: '不适用', failed: '失败', archived: '已归档',
    empty: '本次没有待回查的公开条目。', skippedNote: '本次条目均为仓库入口，无需核验 issue。',
    samples: '失败样本（最多 5 条）', missing: '等待现有回查任务首次记录；缺少记录不代表成功。',
    stale: '超过 30 小时没有新尝试、运行超过 1 小时，或记录时间异常。请核对现有任务日志。',
    reason: { http: 'HTTP 异常', network: '连接失败或超时', 'invalid-response': '响应格式无效', configuration: '任务配置不完整', database: '数据库读取或归档失败' },
  },
  en: {
    title: 'Open-source issue recheck', description: 'Results from the existing daily recheck. Task issues are separate from service health and do not create new in-app alerts.',
    status: { 'not-configured': 'No task records yet', unavailable: 'Task records unavailable', stale: 'Task record overdue', running: 'Running', ok: 'Completed in full', partial: 'Partially failed', failed: 'Failed' },
    attempt: 'Last attempt', success: 'Last complete success', updated: 'Last archive write', anomalies: 'Consecutive issues',
    counts: 'Latest result', checked: 'Candidates', verified: 'Verified', skipped: 'Not applicable', failed: 'Failed', archived: 'Archived',
    empty: 'No published entries needed a recheck.', skippedNote: 'All entries were repository links; no issue checks were needed.',
    samples: 'Failure samples (up to 5)', missing: 'Waiting for the existing recheck task to record its first run. Missing records do not indicate success.',
    stale: 'No attempt for over 30 hours, a run lasting over 1 hour, or an unexpected timestamp. Check the existing task logs.',
    reason: { http: 'HTTP error', network: 'Connection failed or timed out', 'invalid-response': 'Invalid response', configuration: 'Incomplete task configuration', database: 'Database read or archive failed' },
  },
};
