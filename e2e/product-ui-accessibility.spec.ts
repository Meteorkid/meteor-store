import { expect, test, type Page } from '@playwright/test';

// 公开页面交互验收只允许 GET；统计、遥测和业务写入均不发送。
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => route.request().method() === 'GET' ? route.continue() : route.abort());
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: null } }));
});

async function openProduct(page: Page) {
  const identity = page.waitForResponse(response => response.url().endsWith('/api/auth/me'));
  await page.goto('/en/products/xnook');
  await identity;
}

test('图片灯箱支持Space、焦点环绕、背景隔离和搜索交接', async ({ page }) => {
  await openProduct(page);
  const trigger = page.getByRole('button', { name: /^Zoom in:/ }).last();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.evaluate(() => { document.body.style.overflow = 'clip'; });
  await page.keyboard.press('Space');
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await trigger.evaluate(element => element.focus());
  await expect(trigger).not.toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('clip');

  await page.keyboard.press('Enter');
  await expect(close).toBeFocused();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('dialog', { name: 'Site-wide search' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('clip');
});

test('减少动画时视频灯箱保留控制条并等待用户播放', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openProduct(page);
  const trigger = page.getByRole('button', { name: 'Zoom in: XNook Live Demo', exact: true });
  await trigger.click();
  const video = page.getByRole('dialog').locator('video');
  await expect(video).toBeVisible();
  expect(await video.evaluate((element: HTMLVideoElement) => ({ autoplay: element.autoplay, paused: element.paused, controls: element.controls })))
    .toEqual({ autoplay: false, paused: true, controls: true });
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

for (const locale of ['en', 'zh']) {
  test(`${locale} Playground选中状态、翻译与静态演示`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const identity = page.waitForResponse(response => response.url().endsWith('/api/auth/me'));
    await page.goto(`/${locale}/playground`);
    await identity;
    for (const name of ['OmniCrawl', 'Ex-Memory', 'Statux', 'Tollow']) {
      const selector = page.getByRole('button', { name, exact: true });
      await selector.click();
      await expect(selector).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('main button[aria-pressed="true"]')).toHaveCount(1);
      await page.getByRole('button', { name: locale === 'en' ? 'Click to run the demo' : '点击运行演示' }).click();
      const content = await page.locator('main').innerText();
      expect(content).not.toContain('▌');
      if (locale === 'en') expect(content).not.toMatch(/[\u3400-\u9fff]/);
      else expect(content).toMatch(/[\u3400-\u9fff]/);
    }
  });
}
