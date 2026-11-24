/**
 * 已接入的站内应用清单。
 *
 * 此模块只能包含轻量元数据，不能导入 React 组件或应用样式；首页会直接读取它。
 */
export const appIds = [
  'webgl-fluid-sim',
  'skeleton-anatomy',
  'chakra-visualizer',
  'tollow',
] as const;

export type AppId = (typeof appIds)[number];

export const webAppCount = appIds.length;

const appIdSet: ReadonlySet<string> = new Set(appIds);

export function isAppId(value: string): value is AppId {
  return appIdSet.has(value);
}

export function getAppTrialHref(id: string): string | null {
  return isAppId(id) ? `/apps/${id}/trial` : null;
}

/** 体验入口独立于账户产品库。Ex-Memory 的独立应用由产品目录声明地址。 */
export function getBrowserExperience(product: { id: string; experienceUrl?: string }) {
  const href = product.experienceUrl ?? getAppTrialHref(product.id);
  if (!href) return null;
  return { href, requiresLogin: product.id === 'ex-memory' || product.id === 'tollow' };
}
