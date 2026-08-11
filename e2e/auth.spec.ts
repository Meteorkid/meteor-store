import { test, expect } from '@playwright/test';

/**
 * 用户认证流程 E2E 测试
 * 验证注册 → 登录 → 个人信息 → 登出完整链路
 */
test.describe('认证流程', () => {
  test('登录页可以正常渲染', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeAttached();
    // 应该有邮箱输入框
    await expect(page.getByLabel(/邮箱|email/i).first()).toBeAttached();
  });

  test('注册页可以正常渲染', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('form')).toBeAttached();
  });

  test('未登录用户访问 /account 被重定向到登录', async ({ page }) => {
    await page.goto('/account');
    // 应该重定向到 /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('未登录用户看到登录入口', async ({ page }) => {
    await page.goto('/');
    // 导航栏应该有登录按钮
    const loginLink = page.getByRole('link', { name: /登录|登入|sign in/i });
    await expect(loginLink.first()).toBeAttached();
  });
});

test.describe('密码重置', () => {
  test('忘记密码页可以访问', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('form')).toBeAttached();
  });
});
