'use client';

import dynamic from 'next/dynamic';
import { LanguageProvider } from '@/apps/chakra-visualizer/LanguageContext';
import { GameProvider } from '@/apps/chakra-visualizer/GameContext';

import '@/apps/chakra-visualizer/style.css';

/**
 * 查克拉可视化（Chakra Visualizer）手势识别忍术特效应用容器组件。
 * 源应用是 Vite + React 19 + @mediapipe/hands 应用，内部使用 window/document、
 * 摄像头与 Canvas2D，因此必须 ssr:false 只在客户端渲染。
 * 静态资源路径已改写为 /apps/chakra-visualizer/assets/…（见 src/apps/chakra-visualizer/）。
 */
const ChakraVisualizerRoot = dynamic(
  () => import('@/apps/chakra-visualizer/App'),
  { ssr: false },
);

export default function ChakraVisualizerApp() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <LanguageProvider>
        <GameProvider>
          <ChakraVisualizerRoot />
        </GameProvider>
      </LanguageProvider>
    </div>
  );
}