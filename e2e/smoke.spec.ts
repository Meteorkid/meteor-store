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

  test('客户端导航到隐私政策不崩溃', async ({ page }) => {
    // 回归：HeroCanvas/MeteorShower 曾把 isQuiet 的提前 return 放在 hooks 之前，
    // 客户端导航（首页 → privacy/terms 等静默页）时 hooks 数量变化触发
    // React #300，显示 global-error「应用出错了」。直接访问测不到，必须走客户端导航。
    // 显式走中文站：Playwright 默认浏览器语言是英文，goto('/') 会被重定向到 /en
    await page.goto('/zh');
    await page.locator('footer').getByText('隐私政策').click();
    await expect(page).toHaveURL(/\/zh\/privacy$/);
    await expect(page.getByText('应用出错了')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: '个人信息处理者' })).toBeVisible();
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
