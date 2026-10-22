import { expect, test, type Page } from '@playwright/test';

const plan = {
  version: 2, title: 'PRIVATE_A_TEST_PLAN', summary: 'Synthetic fixture', durationWeeks: 4,
  generatedAt: '2026-10-22T00:00:00Z', warnings: [],
  weeks: Array.from({ length: 4 }, (_, i) => ({ week: i + 1, phase: 'practice', title: `Week ${i + 1}`,
    objective: 'Fixture objective', estimatedMinutes: 60,
    tasks: [{ id: `task-${i}`, action: 'Fixture task', itemId: 'fixture-item', estimatedMinutes: 60, evidence: 'Evidence', alternative: 'Alternative' }],
  })),
};
const legacy = { version: 2, savedAt: '2026-10-22T00:00:00Z', response: { kind: 'plan', source: 'deterministic', plan }, completedTaskIds: [] };
const actor = (id: string | null) => id ? { id, userId: id, email: `${id}@example.invalid`, name: `${id} fixture`, emailVerified: true, isAdmin: false } : null;
async function fixture(page: Page, id: string | null) {
  const state = { id, writes: 0 };
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: actor(state.id) } }));
  await page.route('**/api/pathfinder/plan/saved', route => {
    if (route.request().method() !== 'GET') state.writes += 1;
    return route.fulfill({ json: { userId: state.id, plan: null } });
  });
  return state;
}

test('无归属旧草稿不自动显示或上传到B', async ({ page }) => {
  const state = await fixture(page, 'B');
  await page.addInitScript(value => localStorage.setItem('meteor-pathfinder:plan:v2', JSON.stringify(value)), legacy);
  await page.goto('/zh/pathfinder/plan');
  await expect(page.getByRole('button', { name: '确认属于我，导入草稿' })).toBeEnabled();
  await expect(page.getByText(plan.title, { exact: true })).toHaveCount(0);
  expect(state.writes).toBe(0);
});

test('A的慢读取在切换到B后不能回填，表单状态一起重置', async ({ page }) => {
  const state = await fixture(page, 'A');
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let captured = false;
  await page.route('**/api/pathfinder/plan/saved', async route => {
    const id = state.id;
    if (id === 'A') { captured = true; await pending; }
    await route.fulfill({ json: { userId: id, plan: id === 'A' ? { plan, updatedAt: '2026-10-22T00:00:00Z', completedTaskIds: [], pinnedTaskIds: [], profile: null } : null } });
  });
  await page.goto('/zh/pathfinder/plan');
  await expect.poll(() => captured).toBe(true);
  state.id = 'B';
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('button', { name: '生成我的 4–8 周路径' })).toBeEnabled();
  release();
  await expect(page.getByText(plan.title, { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('你想在这段时间完成什么？')).toHaveValue('');
});

test('登出中的focus查询不能让成功登出仍保留A', async ({ page }) => {
  const state = await fixture(page, 'A');
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let started = false;
  await page.route('**/api/auth/logout', async route => {
    started = true; await pending; state.id = null;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto('/zh/pathfinder/plan');
  const userMenu = page.getByRole('button', { name: '用户菜单', exact: true });
  await expect(userMenu).toBeVisible(); await userMenu.click();
  await page.getByRole('button', { name: '退出登录', exact: true }).click();
  await expect.poll(() => started).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  release();
  await expect(page.getByRole('link', { name: '登录 / 注册', exact: true }).first()).toBeVisible();
  await expect(userMenu).toHaveCount(0);
});

test('生成时不能并行导入旧草稿，完成后恢复可操作', async ({ page }) => {
  await fixture(page, null);
  await page.addInitScript(value => localStorage.setItem('meteor-pathfinder:plan:v2', JSON.stringify(value)), legacy);
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let started = false;
  await page.route('**/api/pathfinder/plan', async route => {
    started = true; await pending;
    await route.fulfill({ json: { kind: 'plan', source: 'deterministic', plan: { ...plan, title: 'NEW_TEST_PLAN' } } });
  });
  await page.goto('/zh/pathfinder/plan');
  await expect(page.getByRole('button', { name: '生成我的 4–8 周路径' })).toBeEnabled();
  await page.getByLabel('你想在这段时间完成什么？').fill('学习前端项目');
  await page.getByRole('button', { name: '生成我的 4–8 周路径' }).click();
  await expect.poll(() => started).toBe(true);
  await expect(page.getByRole('button', { name: '确认属于我，导入草稿' })).toBeDisabled();
  release();
  await expect(page.getByText('NEW_TEST_PLAN', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '生成我的 4–8 周路径' })).toBeEnabled();
});

test('已登录用户可显式恢复旧安全提示，不把提示上传为计划', async ({ page }) => {
  const state = await fixture(page, 'B');
  await page.addInitScript(value => localStorage.setItem('meteor-pathfinder:plan:v2', JSON.stringify(value)), {
    ...legacy, response: { kind: 'safety', source: 'safety', message: 'SYNTHETIC_SUPPORT_NOTICE', actions: ['Ask someone you trust'] },
  });
  await page.goto('/zh/pathfinder/plan');
  await page.getByRole('button', { name: '确认属于我，导入草稿' }).click();
  await expect(page.getByText('SYNTHETIC_SUPPORT_NOTICE', { exact: true })).toBeVisible();
  expect(state.writes).toBe(0);
});
