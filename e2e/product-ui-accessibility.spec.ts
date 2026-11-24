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
  test(`${locale} 旧在线体验链接转到产品目录，可从产品页打开全屏应用`, async ({ page }) => {
    const response = await page.request.get(`/${locale}/playground`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location, response.url()).pathname).toBe(`/${locale}/products`);
    await page.goto(`/${locale}/playground`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/products$`));
    await page.locator('main a[href$="/products/tollow"]:visible').first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/products/tollow$`));
    const experience = page.locator(`main a[href="/${locale}/apps/tollow/trial"]`).first();
    await expect(experience).toBeVisible();
    await expect(experience).toHaveAttribute('target', '_blank');
  });
}
