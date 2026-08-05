'use client';

import dynamic from 'next/dynamic';
import '@/apps/skeleton-anatomy/App.css';
import '@/apps/skeleton-anatomy/index.css';

/**
 * 人体骨骼 3D 图谱（Skeleton Anatomy）应用容器组件。
 * 源应用是 Vite + React 19 + Three.js (@react-three/fiber/drei + zustand) 应用，
 * 内部使用 window/document 与 WebGL，因此必须 ssr:false 只在客户端渲染。
 * .glb 模型路径已改写为 /apps/skeleton-anatomy/models/…（见 src/apps/skeleton-anatomy/）。
 */
const SkeletonAnatomyRoot = dynamic(
  () => import('@/apps/skeleton-anatomy/App'),
  { ssr: false },
);

export default function SkeletonAnatomyApp() {
  return (
    <div className="min-h-screen w-full bg-black">
      <SkeletonAnatomyRoot />
    </div>
  );
}