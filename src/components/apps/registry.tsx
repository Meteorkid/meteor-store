import type { ReactNode } from 'react';
import WebGLFluidSim from './WebGLFluidSim';
import SkeletonAnatomyApp from './SkeletonAnatomyApp';
import ChakraVisualizerApp from './ChakraVisualizerApp';
import TollowApp from './TollowApp';

/**
 * 已接入的站内应用注册表：productId → 应用组件。
 * 付费页 /apps/[id] 与免费试用路由 /apps/[id]/trial 共用这份注册表，
 * 新增应用只在「注册表 + products.ts 的 appUrl」两处登记即可。
 *
 * 注意：这里不能标 'use client'。该注册表会被服务端组件（/apps/[id]、
 * /apps/[id]/trial）直接 import 并枚举 Object.keys。若标了 'use client'，
 * 服务端拿到的是客户端模块引用代理，对象键会被清空，导致应用渲染失败
 * （/apps 静默落到占位符、/apps/trial 直接 404）。去掉 'use client' 后
 * 它成为服务端模块，而它包装的各个 App 组件自身仍是客户端组件，不受影响。
 */
export const appComponents: Record<string, () => ReactNode> = {
  'webgl-fluid-sim': () => <WebGLFluidSim />,
  'skeleton-anatomy': () => <SkeletonAnatomyApp />,
  'chakra-visualizer': () => <ChakraVisualizerApp />,
  'tollow': () => <TollowApp />,
};