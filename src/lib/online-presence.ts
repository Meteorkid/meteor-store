/**
 * 同时在线人数。
 *
 * 线上是单个 PM2 fork，在线人数只是页脚的一个弱提示，不需要 Redis：
 * 每个打开的标签页每 5 分钟发一次心跳，常驻标签页会无限放大任何远程存储的
 * 写入量。这里用进程内 Map，按最后一次心跳保留 10 分钟；进程重启后归零是可接受的。
 *
 * 阈值以下前端不展示数字，避免「在线 1 人」这类冷启动噪音。
 */
export const ONLINE_VISIBLE_THRESHOLD = 50;

const ONLINE_WINDOW_MS = 10 * 60_000;
const CLEANUP_INTERVAL_MS = 60_000;
const MAX_TRACKED_VISITORS = 20_000;

/** visitorId → 最后一次心跳时间。Map 的插入顺序同时用作淘汰顺序。 */
const visitors = new Map<string, number>();
let lastCleanupAt = 0;

function prune(now: number): void {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS && visitors.size <= MAX_TRACKED_VISITORS) {
    return;
  }

  for (const [visitorId, lastSeenAt] of visitors) {
    if (lastSeenAt < now - ONLINE_WINDOW_MS) visitors.delete(visitorId);
  }
  lastCleanupAt = now;

  // 防御异常流量：UUID 可以伪造，不能被无限撑大进程内存。
  // 超过上限时淘汰最早写入的访客；被淘汰的真实访客下一次心跳会重新进入。
  if (visitors.size > MAX_TRACKED_VISITORS) {
    const excess = visitors.size - MAX_TRACKED_VISITORS;
    let removed = 0;
    for (const visitorId of visitors.keys()) {
      visitors.delete(visitorId);
      if (++removed >= excess) break;
    }
  }
}

/** 记录一次访客心跳；同一访客重复心跳只刷新时间，不重复计数。 */
export async function heartbeat(visitorId: string): Promise<void> {
  const now = Date.now();
  prune(now);
  // delete + set 让最近活跃的访客排到 Map 尾部，容量淘汰时优先移除最久未见的。
  visitors.delete(visitorId);
  visitors.set(visitorId, now);
}

/** 返回最近 10 分钟内有过心跳的独立访客数。 */
export async function getOnlineCount(): Promise<number> {
  const now = Date.now();
  prune(now);

  let count = 0;
  for (const lastSeenAt of visitors.values()) {
    if (lastSeenAt >= now - ONLINE_WINDOW_MS) count += 1;
  }
  return count;
}
