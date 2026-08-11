import { test, expect } from '@playwright/test';

/**
 * 冒烟测试：验证核心页面可访问且无服务端错误
 * CI 部署后首先运行这组测试
 */
test.describe('冒烟测试 - 核心页面可访问', () => {
  const pages = [
    { path: '/', name: '首页' },
    { path: '/blog', name: '博客列表' },
    { path: '/docs', name: '帮助中心' },
    { path: '/login', name: '登录' },
    { path: '/register', name: '注册' },
    { path: '/privacy', name: '隐私政策' },
    { path: '/terms', name: '服务条款' },
  ];

  for (const { path, name } of pages) {
    test(`${name} (${path}) 可访问`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      // 确保页面不是空白
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }

  test('首页不包含明显的服务端错误', async ({ page }) => {
    await page.goto('/');
    // Next.js 错误页面特征
    await expect(page.locator('[data-nextjs-error-boundary]')).toHaveCount(0);
    await expect(page.getByText('Application error')).toHaveCount(0);
  });
});

test.describe('冒烟测试 - SEO / 结构化数据', () => {
  test('首页有 viewport meta', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="viewport"]');
    await expect(meta).toBeAttached();
  });

  test('博客列表页有 RSS link', async ({ page }) => {
    await page.goto('/blog');
    const rssLink = page.locator('link[type="application/rss+xml"]');
    await expect(rssLink.first()).toBeAttached();
  });
});
