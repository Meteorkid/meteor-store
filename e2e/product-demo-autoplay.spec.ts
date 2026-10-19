import { expect, test } from '@playwright/test';

const ids = ['xisland', 'xnook', 'statux', 'claude-phone-control', 'cursor-source-analyzer', 'omnicrawl', 'skeleton-anatomy', 'tollow', 'chakra-visualizer', 'webgl-fluid-sim', 'ex-memory', 'ui-design-system'];

test.describe('原型操作动画封面', () => {
  test('12段新短片确实播放，离屏释放，播放结束可悬停重播', async ({ page }, testInfo) => {
    test.setTimeout(60000);
    const oldMedia: string[] = [];
    page.on('request', (request) => {
      if (/\/products\/[^/]+\/(demo\.mp4|demo\.gif)/.test(decodeURIComponent(request.url()))) oldMedia.push(request.url());
    });
    await page.goto('/zh/products');
    await expect(page.locator('[data-product-cover]')).toHaveCount(12);
    expect(await page.locator('[data-motion-video]').count()).toBeLessThan(12);
    for (const id of ids) {
      const cover = page.locator(`[data-product-cover="${id}"]`);
      await cover.scrollIntoViewIfNeeded();
      const video = cover.locator('[data-motion-video]');
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1);
      await expect(video).toHaveAttribute('data-ready', 'true');
      const state = await video.evaluate((v: HTMLVideoElement) => ({ width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop }));
      expect(state).toEqual({ width: 1280, height: 800, muted: true, loop: false });
      await cover.screenshot({ path: testInfo.outputPath(`${id}.png`) });
    }
    const first = page.locator('[data-product-cover="xisland"]');
    await expect(first.locator('video')).toHaveCount(0);
    await first.scrollIntoViewIfNeeded();
    const video = first.locator('video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended), { timeout: 10000 }).toBe(true);
    await page.mouse.move(0, 0);
    await video.hover();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime < 2)).toBe(true);
    await page.locator('[data-product-cover="ui-design-system"]').scrollIntoViewIfNeeded();
    await expect(first.locator('video')).toHaveCount(0);
    expect(oldMedia).toEqual([]);
  });

  test('减少动态效果不加载短片，英文卡片仍正确跳转', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const movies: string[] = [];
    page.on('request', (r) => { if (r.url().includes('cover-motion.mp4')) movies.push(r.url()); });
    await page.goto('/en/products');
    const cover = page.locator('[data-product-cover="xisland"]');
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toHaveAttribute('data-active', 'false');
    await expect(page.locator('[data-motion-video]')).toHaveCount(0);
    await expect(cover).toHaveAttribute('aria-label', /XIsland product interaction animation/);
    await cover.click();
    await expect(page).toHaveURL(/\/en\/products\/xisland/);
    expect(movies).toEqual([]);
  });

  test('新短片加载失败仍可看到静态回退', async ({ page }) => {
    await page.route((url) => url.pathname === '/products/xisland/cover-motion.mp4', (route) => route.abort());
    await page.goto('/zh/products');
    const cover = page.locator('[data-product-cover="xisland"]');
    await cover.scrollIntoViewIfNeeded();
    await expect(cover.locator('video')).toHaveAttribute('data-failed', 'true');
    await expect(cover.locator('video')).toHaveCSS('display', 'none');
    await expect.poll(() => cover.locator('[data-cover-frame="poster"]').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  });

  test('服务端输出12张回退图，不提前插入播放器', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${baseURL}/zh/products`);
    await expect(page.locator('[data-product-cover]')).toHaveCount(12);
    await expect(page.locator('[data-motion-video]')).toHaveCount(0);
    for (const id of ids) {
      const cover = page.locator(`[data-product-cover="${id}"]`);
      await expect(cover).toHaveAttribute('aria-label', /原型操作动画/);
      const src = await cover.locator('[data-cover-frame="poster"]').getAttribute('src');
      expect(src).toContain(`/products/${id}/cover-motion.webp`);
      const response = await context.request.get(`${baseURL}${src}`);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toMatch(/^image\//);
    }
    await context.close();
  });
});
