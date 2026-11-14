import { expect, test } from '@playwright/test';

const PAIR = '/zh/study/ielts/task2-opinion-university-education';

test('表达块展示每段重点，定位原句打开说明并保留译文设置', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAIR);
  await expect(page.locator('[data-expression-paragraph]')).toHaveCount(4);
  await expect(page.locator('[data-expression-block][data-priority="primary"]')).toHaveCount(4);
  await expect(page.locator('mark[data-change]')).toHaveCount(0);
  const translation = page.getByRole('switch', { name: '中文翻译', exact: true });
  await translation.click();
  const link = page.locator('[data-expression-paragraph="1"] a').first();
  const target = await link.getAttribute('href');
  expect(target).toMatch(/^#ielts-sentence-\d+$/);
  await link.focus();
  await page.keyboard.press('Enter');
  const row = page.locator(target!);
  await expect(row).toHaveAttribute('data-note-open', 'true');
  await expect(row.getByRole('button', { name: /改动说明/ })).toBeFocused();
  await expect(row.locator('[id^="ielts-note-"]')).toBeVisible();
  await expect(translation).toHaveAttribute('aria-checked', 'true');
  await expect(row.locator('[data-translation-side]')).toHaveCount(2);
  await page.getByRole('button', { name: '全文阅读', exact: true }).click();
  await expect(page.locator('[data-expression-block]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '8 分档升级版' })).toBeVisible();
});

test('窄屏的表达块按原表达、升级表达顺序换行且不横溢出', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/study/ielts/task1-academic-table-energy');
  const block = page.locator('[data-expression-block]').first();
  await expect(block).toBeVisible();
  await expect(block.getByRole('link', { name: /See in context/ })).toBeVisible();
  const before = (await block.locator('[data-expression-side="before"]').boundingBox())!;
  const after = (await block.locator('[data-expression-side="after"]').boundingBox())!;
  expect(after.y).toBeGreaterThan(before.y + before.height);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
