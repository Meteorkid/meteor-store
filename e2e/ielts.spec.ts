import { expect, test } from '@playwright/test';

/**
 * 雅思写作对照的公开页回归。
 *
 * 这一页游客可见，所以不需要登录：断言的是「对照确实成立」——
 * 两栏都在、点一句能看到说明、筛选能收窄、手机上不横向溢出。
 */

const PAIR = '/zh/study/ielts/task2-opinion-university-education';

test.describe('雅思写作对照', () => {
  test('对照库列出公开内容并按题型筛选', async ({ page }) => {
    await page.goto('/zh/study/ielts');
    await expect(page.getByRole('heading', { level: 1, name: '雅思写作对照' })).toBeVisible();

    const cards = page.locator('ul li a[href*="/study/ielts/"]');
    await expect.poll(() => cards.count()).toBeGreaterThanOrEqual(6);

    await page.getByRole('button', { name: 'Task 1 书信（G 类）' }).click();
    await expect.poll(() => cards.count()).toBe(1);
    await expect(cards.first()).toContainText('书信');

    await page.getByRole('button', { name: '全部' }).first().click();
    await expect.poll(() => cards.count()).toBeGreaterThanOrEqual(6);
  });

  test('逐句对照可以点开说明，全文模式两栏都在', async ({ page }) => {
    await page.goto(PAIR);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('大学');

    // 默认逐句模式：第一句两版都能看到，说明默认收起
    const firstRow = page.locator('ol li button').first();
    await expect(firstRow).toHaveAttribute('aria-expanded', 'false');
    await firstRow.click();
    await expect(firstRow).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('ol li div[id^="ielts-note-"]').first()).toBeVisible();

    // 全文模式：两栏标题都在，正文按段落渲染
    await page.getByRole('button', { name: '全文阅读' }).click();
    await expect(page.getByRole('heading', { name: '5 分档原文' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '8 分档升级版' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '5 分档原文' })).toBeVisible();

    // 四项评分维度与可抄走的写法都在
    await expect(page.getByRole('heading', { name: '四项评分维度怎么拉开差距' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '可以直接抄走的写法' })).toBeVisible();
  });

  test('升级维度筛选可以切换', async ({ page }) => {
    await page.goto(PAIR);
    const chip = page.getByRole('button', { name: '词汇' }).first();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  test('未登录时给登录入口而不是按钮', async ({ page }) => {
    await page.goto(PAIR);
    await expect(page.getByRole('link', { name: '登录后保存学习状态' })).toBeVisible();
  });

  test('英文页可读', async ({ page }) => {
    await page.goto('/en/study/ielts');
    await expect(page.getByRole('heading', { level: 1, name: 'IELTS writing, side by side' })).toBeVisible();
  });

  test('手机宽度不横向溢出，两版句子都在', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAIR);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // 水合过程中会出现一两帧的瞬时溢出（客户端组件挂载时），所以轮询到稳定值再判定；
    // 真正溢出的页面永远不会满足这个条件，断言依然有效。
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), { timeout: 10_000 })
      .toBeLessThanOrEqual(1);
    await expect(page.getByText('5 分版').first()).toBeVisible();
    await expect(page.getByText('8 分版').first()).toBeVisible();
  });
});
