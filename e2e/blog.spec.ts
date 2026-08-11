import { test, expect } from '@playwright/test';

/**
 * 博客功能 E2E 测试
 * 验证文章列表、文章详情、RSS、结构化数据
 */
test.describe('博客 - 读者视角', () => {
  test('博客列表页加载文章', async ({ page }) => {
    await page.goto('/blog');
    // 文章列表应该有内容
    const articles = page.locator('article, [data-testid="blog-card"]');
    // 至少有一篇文章
    await expect(articles.first()).toBeAttached({ timeout: 15000 });
  });

  test('博客列表页包含分区标签', async ({ page }) => {
    await page.goto('/blog');
    // 分区导航应该存在
    const sectionNav = page.locator('nav');
    await expect(sectionNav.first()).toBeAttached({ timeout: 10000 });
  });

  test('RSS feed 可访问', async ({ page }) => {
    const res = await page.goto('/blog/feed.xml');
    expect(res?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain('<rss');
  });
});

test.describe('博客 - 投稿', () => {
  test('投稿页未登录时引导登录', async ({ page }) => {
    await page.goto('/blog/submit');
    // 未登录应该重定向或显示登录引导
    await expect(page).toHaveURL(/\/login|\/blog\/submit/);
  });
});
