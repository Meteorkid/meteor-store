import type { ReactNode } from 'react';
import WebGLFluidSim from './WebGLFluidSim';
import SkeletonAnatomyApp from './SkeletonAnatomyApp';
import ChakraVisualizerApp from './ChakraVisualizerApp';
import TollowApp from './TollowApp';
import type { AppId } from '@/data/app-manifest';

type AppRenderer = () => ReactNode;

/**
 * 已接入的站内应用注册表：productId → 应用组件。
 * 付费页 /apps/[id] 与免费试用路由 /apps/[id]/trial 共用这份注册表，
 * 新增应用需要同步登记注册表、app-manifest 与 products.ts 的 appUrl；
 * 类型检查和数据测试会阻止三处配置发生漂移。
 *
 * 注意：这里不能标 'use client'。该注册表会被服务端组件（/apps/[id]、
 * /apps/[id]/trial）直接 import 并枚举 Object.keys。若标了 'use client'，
 * 服务端拿到的是客户端模块引用代理，对象键会被清空，导致应用渲染失败
 * （/apps 静默落到占位符、/apps/trial 直接 404）。去掉 'use client' 后
 * 它成为服务端模块，而它包装的各个 App 组件自身仍是客户端组件，不受影响。
 */
const registeredAppComponents = {
  'webgl-fluid-sim': () => <WebGLFluidSim />,
  'skeleton-anatomy': () => <SkeletonAnatomyApp />,
  'chakra-visualizer': () => <ChakraVisualizerApp />,
  'tollow': () => <TollowApp />,
} satisfies Record<AppId, AppRenderer>;

export const appComponents: Readonly<Record<string, AppRenderer>> = registeredAppComponents;
