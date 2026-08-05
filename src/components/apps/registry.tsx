'use client';

import type { ReactNode } from 'react';
import WebGLFluidSim from './WebGLFluidSim';
import SkeletonAnatomyApp from './SkeletonAnatomyApp';
import ChakraVisualizerApp from './ChakraVisualizerApp';
import TollowApp from './TollowApp';

/**
 * 已接入的站内应用注册表：productId → 应用组件。
 * 付费页 /apps/[id] 与免费试用路由 /apps/[id]/trial 共用这份注册表，
 * 新增应用只在「注册表 + products.ts 的 appUrl」两处登记即可。
 */
export const appComponents: Record<string, () => ReactNode> = {
  'webgl-fluid-sim': () => <WebGLFluidSim />,
  'skeleton-anatomy': () => <SkeletonAnatomyApp />,
  'chakra-visualizer': () => <ChakraVisualizerApp />,
  'tollow': () => <TollowApp />,
};