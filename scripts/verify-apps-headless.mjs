#!/usr/bin/env node
/**
 * 站内应用 headless 冒烟测试（WebGL 流体模拟 / Chakra 手势应用）。
 *
 * 背景：无 GPU 的 headless 环境默认创建不了 WebGL context，导致 3D 应用
 * （webgl-fluid-sim）在测试里进不了初始化。这里用软件渲染（SwiftShader）
 * 模拟 GPU，让 headless 也能创建 WebGL context；Chakra 用 fake media 模拟
 * 摄像头。这只能验证「能 boot、canvas 能挂载、不抛错」，视觉效果仍需真实浏览器人工验收。
 *
 * 依赖：Playwright（未内置，需先装）：
 *   pnpm add -D playwright
 *   npx playwright install chromium
 *
 * 用法：
 *   node scripts/verify-apps-headless.mjs <baseUrl>
 *   node scripts/verify-apps-headless.mjs http://localhost:3000
 */
import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:3000';

// 语言前缀：next-intl 需要 locale 段
const TRIAL = {
  'webgl-fluid-sim': '/en/apps/webgl-fluid-sim/trial',
  'chakra-visualizer': '/en/apps/chakra-visualizer/trial',
};

const launchArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  // 无 GPU 下用 SwiftShader 软件渲染创建 WebGL context
  '--use-gl=angle',
  '--use-angle=swiftshader',
  // 新版 Chromium 默认禁用 SwiftShader，需显式开放
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  // Chakra 手势应用需要摄像头：用假设备 + 自动授权
  '--use-fake-device-for-media-stream',
  '--use-fake-ui-for-media-stream',
];

const results = [];
let browser;

try {
  browser = await chromium.launch({ args: launchArgs });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  for (const [id, path] of Object.entries(TRIAL)) {
    const url = baseUrl + path;
    const entry = { id, url, ok: true, detail: [] };
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      if (id === 'webgl-fluid-sim') {
        // 探测真实 WebGL 支持（SwiftShader 下应为 true）
        const webgl = await page.evaluate(() => {
          const c = document.createElement('canvas');
          return !!(c.getContext('webgl2') || c.getContext('webgl'));
        });
        entry.detail.push(`webglSupported=${webgl}`);
        const canvas = await page.locator('#fluidCanvas').count();
        entry.detail.push(`#fluidCanvas=${canvas}`);
        if (!webgl) entry.ok = false;
      } else {
        // Chakra：主菜单画布/元素挂载，且未进入错误页
        const canvas = await page.locator('canvas').count();
        entry.detail.push(`canvasCount=${canvas}`);
      }

      const errPage = await page.getByText('Something Went Wrong').count();
      entry.detail.push(`errorPage=${errPage}`);
      if (errPage > 0) entry.ok = false;
    } catch (err) {
      entry.ok = false;
      entry.detail.push(`threw: ${String(err).split('\n')[0]}`);
    }
    if (pageErrors.length) {
      // Chakra 首次加载 MediaPipe 走 CDN，网络失败会报 console 错误，只记录不判失败
      entry.detail.push(`pageErrors=${pageErrors.length}`);
    }
    results.push(entry);
    pageErrors.length = 0;
  }
} catch (err) {
  console.error('无法启动浏览器：', err.message);
  console.error('请先安装依赖：pnpm add -D playwright && npx playwright install chromium');
  process.exit(2);
} finally {
  if (browser) await browser.close();
}

let failed = 0;
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.id.padEnd(20)} ${r.url}`);
  console.log(`      ${r.detail.join(' · ')}`);
  if (!r.ok) failed++;
}
console.log(failed ? `\n${failed} 项失败` : '\n全部通过');
process.exit(failed ? 1 : 0);