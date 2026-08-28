'use client';

import { useSyncExternalStore } from 'react';

/**
 * 管理员待办角标，挂在头像上，全站可见。
 *
 * 侧栏那套徽标只在后台布局里算，而后台布局只有进了后台才渲染——人在博客页、
 * 产品页时根本不知道有新的待审内容。这个角标补的就是「人不在后台」的情况。
 *
 * **用模块级 store 而不是组件内 state**：Header 桌面版与移动版各渲染一个
 * UserMenu 实例，各自 fetch 会打两次接口、而且两个角标可能显示不同的数
 * （公告铃铛当初就踩过这个）。store 让两个实例共享同一份数据与同一次请求。
 */

interface PendingState {
  total: number;
  loaded: boolean;
}

let state: PendingState = { total: 0, loaded: false };
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

/**
 * 拉取待办数。
 *
 * 失败一律当作 0 且不重试：角标是辅助信息，静默失败远好过在每个页面上
 * 反复打一个会失败的接口。非管理员会拿到 404，同样走这条路径。
 */
function refresh(): Promise<void> {
  if (inflight) return inflight;
  inflight = fetch('/api/admin/pending', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { total?: number } | null) => {
      state = { total: typeof data?.total === 'number' ? data.total : 0, loaded: true };
      emit();
    })
    .catch(() => {
      state = { total: 0, loaded: true };
      emit();
    })
    .finally(() => { inflight = null; });
  return inflight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 首个订阅者触发拉取；后续实例复用同一次请求与同一份结果
  if (!state.loaded) void refresh();
  return () => { listeners.delete(listener); };
}

const getSnapshot = () => state;
// 服务端渲染时给一个稳定的空状态，避免 hydration 不一致
const serverSnapshot: PendingState = { total: 0, loaded: false };

/** 供其它组件在完成操作后刷新角标（比如批量审核之后）。 */
export function refreshAdminPending() {
  state = { ...state, loaded: false };
  void refresh();
}

export default function AdminPendingBadge({ label }: { label: string }) {
  const { total } = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  if (total <= 0) return null;

  return (
    <span
      // 角标本身是装饰，真正的信息由 aria-label 给读屏软件
      aria-label={`${label}: ${total}`}
      className="absolute -right-1 -top-1 flex min-w-[1.1rem] items-center justify-center rounded-full border border-black bg-amber-500 px-1 text-[0.65rem] font-bold leading-4 text-black"
    >
      {total > 99 ? '99+' : total}
    </span>
  );
}

/**
 * 菜单项里的数字，与头像角标共享同一份数据。
 *
 * 头像上那个红点告诉你「有事」，这个告诉你「有几件」——点开菜单时不必先跳进
 * 后台才知道规模。
 */
export function AdminPendingCount() {
  const { total } = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  if (total <= 0) return null;

  return (
    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-200">
      {total > 99 ? '99+' : total}
    </span>
  );
}
