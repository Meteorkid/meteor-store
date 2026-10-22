import { z } from 'zod';

export const MonitoringReasonSchema = z.enum(['network', 'http', 'invalid-response', 'degraded']);
const timestamp = z.string().datetime();
const identifier = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);

export const MonitoringEventSchema = z.object({
  id: identifier,
  kind: z.enum(['failure', 'recovery']),
  at: timestamp,
  incidentId: identifier,
  reason: MonitoringReasonSchema.nullable(),
});

export const MonitoringFileSchema = z.object({
  version: z.literal(1),
  checkedAt: timestamp,
  status: z.enum(['healthy', 'suspect', 'down']),
  consecutiveFailures: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  lastResult: z.object({
    healthy: z.boolean(),
    reason: MonitoringReasonSchema.nullable(),
    latencyMs: z.number().finite().nonnegative(),
  }),
  incident: z.object({ id: identifier, openedAt: timestamp, reason: MonitoringReasonSchema }).nullable(),
  events: z.array(MonitoringEventSchema).max(40),
}).refine(value => value.status === 'healthy'
  ? value.lastResult.healthy && value.lastResult.reason === null && value.consecutiveFailures === 0 && value.incident === null
  : !value.lastResult.healthy && value.lastResult.reason !== null && value.consecutiveFailures > 0
    && (value.status === 'down' ? value.incident !== null : value.incident === null));

export const MonitoringSnapshotSchema = z.object({
  status: z.enum(['not-configured', 'healthy', 'suspect', 'down', 'stale', 'unavailable']),
  checkedAt: timestamp.nullable(),
  consecutiveFailures: z.number().int().nonnegative(),
  latencyMs: z.number().finite().nonnegative().nullable(),
  reason: MonitoringReasonSchema.nullable(),
  incidentOpenedAt: timestamp.nullable(),
  events: z.array(MonitoringEventSchema).max(40),
});

export type MonitoringSnapshot = z.infer<typeof MonitoringSnapshotSchema>;
export type MonitoringEvent = z.infer<typeof MonitoringEventSchema>;

export function parseMonitoringResponse(value: unknown, userId: string): MonitoringSnapshot {
  const parsed = z.object({ userId: z.literal(userId), monitoring: MonitoringSnapshotSchema }).safeParse(value);
  if (!parsed.success) throw new Error('Monitoring response unavailable');
  return parsed.data.monitoring;
}

export const monitoringText = {
  zh: {
    title: '运行监控', description: '每分钟检查应用、数据库与 Redis。连续 3 次失败提醒一次，恢复后再提醒一次。',
    loading: '正在读取检测记录…', failed: '监控记录暂时无法读取，请稍后重试。',
    boundary: '检测与网站在同一台服务器上。整机宕机期间无法送达站内提醒，恢复后才能查看记录；这不代替独立的站外可用性监控。',
    checkedAt: '最后检测', latency: '检测耗时', failures: '连续失败', history: '最近故障与恢复',
    empty: '暂无达到提醒门槛的故障。', unread: '未读', read: '标为已读', detail: '查看运行监控',
    failure: '健康检测失败', recovery: '服务已恢复', incident: '故障确认时间',
    status: { 'not-configured': '尚未收到检测记录', healthy: '健康', suspect: '失败，等待连续检测确认', down: '检测到故障', stale: '检测记录已过期', unavailable: '监控记录不可用' },
    reason: { network: '连接失败或超时', http: '健康接口返回异常状态', 'invalid-response': '健康响应格式或内容无效', degraded: '健康检查组件未全部通过' },
    stale: '超过 3 分钟没有新检测，或记录时间异常。请核对定时任务。',
    missing: '尚未安装或运行健康检测任务；这里不会将缺少记录显示为健康。',
  },
  en: {
    title: 'Service monitoring', description: 'Checks the app, database and Redis every minute. Three consecutive failures trigger one alert, followed by one recovery notice.',
    loading: 'Loading health checks…', failed: 'Monitoring records are temporarily unavailable. Please try again later.',
    boundary: 'The checker runs on the same server as the site. In-app alerts are only available after a server outage ends; this does not replace independent external uptime monitoring.',
    checkedAt: 'Last check', latency: 'Check duration', failures: 'Consecutive failures', history: 'Recent incidents and recoveries',
    empty: 'No incidents have reached the alert threshold.', unread: 'Unread', read: 'Mark as read', detail: 'View service monitoring',
    failure: 'Health check failed', recovery: 'Service recovered', incident: 'Incident confirmed',
    status: { 'not-configured': 'No checks received yet', healthy: 'Healthy', suspect: 'Failed; awaiting confirmation', down: 'Incident detected', stale: 'Health check is overdue', unavailable: 'Monitoring unavailable' },
    reason: { network: 'Connection failed or timed out', http: 'Health endpoint returned an error status', 'invalid-response': 'Invalid health response', degraded: 'Some health checks did not pass' },
    stale: 'No new check for over 3 minutes, or the record has an unexpected timestamp. Check the scheduled task.',
    missing: 'The health check has not been installed or run yet. Missing records are not treated as healthy.',
  },
};
