import { rateLimit } from './rate-limit';

const WINDOW_MS = 60_000;
const USER_UPLOADS_PER_WINDOW = 10;
const GLOBAL_UPLOADS_PER_WINDOW = 30;
const MAX_CONCURRENT_UPLOADS = 4;

type RateLimitScope = 'user' | 'global';

export type BlogImageUploadRateLimitResult = {
  limited: boolean;
  scope: RateLimitScope | null;
  resetAt: number;
};

interface UploadSlotState {
  active: number;
}

const globalForUploadGuard = globalThis as typeof globalThis & {
  __meteorBlogImageUploadSlots?: UploadSlotState;
};

function getUploadSlotState(): UploadSlotState {
  if (!globalForUploadGuard.__meteorBlogImageUploadSlots) {
    globalForUploadGuard.__meteorBlogImageUploadSlots = { active: 0 };
  }
  return globalForUploadGuard.__meteorBlogImageUploadSlots;
}

/**
 * 两条博客图片上传入口共用同一组用户与全站限流键。
 * Redis 已配置但异常时关闭失败；未配置时降级到单实例内存窗口。
 */
export async function checkBlogImageUploadRateLimit(
  userId: string,
): Promise<BlogImageUploadRateLimitResult> {
  const options = { failClosed: true, fallback: 'memory' as const };
  const userLimit = await rateLimit(
    `blog-image-upload:user:${userId}`,
    USER_UPLOADS_PER_WINDOW,
    WINDOW_MS,
    options,
  );
  if (userLimit.limited) {
    return { limited: true, scope: 'user', resetAt: userLimit.resetAt };
  }

  const globalLimit = await rateLimit(
    'blog-image-upload:global',
    GLOBAL_UPLOADS_PER_WINDOW,
    WINDOW_MS,
    options,
  );
  if (globalLimit.limited) {
    return { limited: true, scope: 'global', resetAt: globalLimit.resetAt };
  }

  return { limited: false, scope: null, resetAt: globalLimit.resetAt };
}

/**
 * 限制单个 Node 进程同时解析/解码/上传的图片数，保护内存与 Sharp 工作线程。
 * 返回的释放函数可重复调用；超过上限时返回 null。
 */
export function acquireBlogImageUploadSlot(): (() => void) | null {
  const state = getUploadSlotState();
  if (state.active >= MAX_CONCURRENT_UPLOADS) return null;

  state.active += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.active = Math.max(0, state.active - 1);
  };
}
