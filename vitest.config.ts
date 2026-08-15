import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    // e2e/ 属于 Playwright（见 playwright.config.ts），vitest 默认规则
    // 会收集 *.spec.ts 导致语法冲突；这里覆盖 exclude 时必须带上默认项
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      // 注意是配置**文件**（.config.*）不是同名目录，照抄 vitest 默认值，别改成 `/**`
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      'e2e/**',
    ],
  },
});
