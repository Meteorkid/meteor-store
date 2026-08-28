import { db } from '@/lib/db';
import { pathfinderSources } from '@/lib/db/schema';

/**
 * 来源健康度。
 *
 * 起因是一次静默故障：`hugging-face-blog` 自上线起 `last_success_at` 一直是 null——
 * 一条内容都没进来过，持续了很久，没有任何地方显示这件事。后来实测才发现
 * huggingface.co 从生产服务器（阿里云）出网不通，20 秒超时。
 *
 * 同步日志里其实有痕迹（`failedSources`），但那是一行 JSON，只有主动去翻才看得到，
 * 而「某个来源悄悄不工作了」恰恰是没人会主动去查的那类问题——目录看起来仍然有内容，
 * 只是少了一整个来源的份额。所以把它摆到后台首屏上。
 *
 * 判据只用同步流程已经在写的三个字段，不新增表也不新增写入点。
 */

/** 连续失败达到这个次数就算严重：偶发的网络抖动通常一两次内自愈。 */
const CRITICAL_FAILURES = 3;

/** 超过这么久没成功过就算可疑，即使当前没有连续失败计数。 */
const STALE_SUCCESS_HOURS = 48;

export type SourceHealthLevel = 'ok' | 'warning' | 'critical';

export interface SourceHealth {
  id: string;
  name: string;
  enabled: boolean;
  level: SourceHealthLevel;
  /** 中文说明，直接展示给管理员 */
  reason: string;
  consecutiveFailures: number;
  lastSuccessAt: string | null;
  lastError: string | null;
}

/**
 * 判定单条来源的健康度。
 *
 * 纯函数，便于把每条规则钉进测试——尤其是「从未成功」这一条，它正是当初
 * 漏掉的那种情况：`consecutiveFailures` 可能只有 1，看起来完全不严重。
 */
export function judgeSourceHealth(
  source: {
    id: string;
    name: string;
    enabled: boolean;
    consecutiveFailures: number;
    lastSuccessAt: string | null;
    lastError: string | null;
  },
  now = new Date(),
): SourceHealth {
  const base = { ...source, level: 'ok' as SourceHealthLevel, reason: '' };

  // 手动关闭的来源不算故障：关闭本身就是一个明确的决定
  if (!source.enabled) return { ...base, level: 'ok', reason: '已手动关闭' };

  if (!source.lastSuccessAt) {
    // 关键的一条：从未成功过。失败次数可能只有 1，光看计数完全不显眼
    return { ...base, level: 'critical', reason: '从未成功同步过' };
  }
  if (source.consecutiveFailures >= CRITICAL_FAILURES) {
    return { ...base, level: 'critical', reason: `连续失败 ${source.consecutiveFailures} 次` };
  }

  const parsed = Date.parse(source.lastSuccessAt);
  if (Number.isFinite(parsed)) {
    const hours = (now.getTime() - parsed) / 3_600_000;
    if (hours > STALE_SUCCESS_HOURS) {
      return { ...base, level: 'warning', reason: `已 ${Math.floor(hours / 24)} 天没有成功同步` };
    }
  }

  if (source.consecutiveFailures > 0) {
    return { ...base, level: 'warning', reason: `最近失败 ${source.consecutiveFailures} 次` };
  }
  return { ...base, level: 'ok', reason: '正常' };
}

/** 严重的排最前，其次警告——后台首屏要先看到坏的。 */
const LEVEL_ORDER: Record<SourceHealthLevel, number> = { critical: 0, warning: 1, ok: 2 };

export async function listSourceHealth(now = new Date()): Promise<SourceHealth[]> {
  const rows = await db.select({
    id: pathfinderSources.id,
    name: pathfinderSources.name,
    enabled: pathfinderSources.enabled,
    consecutiveFailures: pathfinderSources.consecutiveFailures,
    lastSuccessAt: pathfinderSources.lastSuccessAt,
    lastError: pathfinderSources.lastError,
  }).from(pathfinderSources);

  return rows
    .map((row) => judgeSourceHealth(row, now))
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.id.localeCompare(b.id));
}
