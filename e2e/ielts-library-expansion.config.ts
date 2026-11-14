import { defineConfig, devices } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3100';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname)) {
  throw new Error('100 篇扩容验收只允许连接已启动的本地隔离服务');
}

// 使用本机现有 Chrome；不安装浏览器，不通过 webServer 启停应用或数据库。
export default defineConfig({
  testDir: '.',
  testMatch: ['ielts-library-expansion.spec.ts', 'ielts.spec.ts'],
  outputDir: process.env.E2E_OUTPUT_DIR ?? join(tmpdir(), `meteor-store-ielts100-${Date.now()}`),
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
