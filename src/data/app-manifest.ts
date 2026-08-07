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
