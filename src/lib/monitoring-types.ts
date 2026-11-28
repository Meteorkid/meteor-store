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
