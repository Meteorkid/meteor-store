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
    // 扩容后书信类不再只有一篇；每张结果都应属于所选题型。
    await expect.poll(() => cards.count()).toBeGreaterThanOrEqual(1);
    for (const card of await cards.all()) await expect(card).toContainText('Task 1 书信（G 类）');

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
    const focus = page.getByRole('combobox', { name: '关注重点' });
    await focus.selectOption('lexis');
    await expect(focus).toHaveValue('lexis');
    await expect(page.locator('[data-focused="true"]').first()).toBeVisible();
    await focus.selectOption('all');
    await expect(page.locator('[data-focused="true"]')).toHaveCount(0);
  });

  test('两栏字体不同，词级标记可关闭且不改变正文', async ({ page }) => {
    await page.goto(PAIR);
    const low = page.locator('[data-essay-side="low"]').first();
    const high = page.locator('[data-essay-side="high"]').first();
    await expect(low).toBeVisible();
    await expect(high).toBeVisible();
    expect(await low.evaluate(node => getComputedStyle(node).fontFamily))
      .not.toBe(await high.evaluate(node => getComputedStyle(node).fontFamily));
    const before = { low: await low.innerText(), high: await high.innerText() };
    await page.getByRole('button', { name: '显示改动标记', exact: true }).click();
    await expect(page.locator('mark[data-change="removed"]').first()).toBeVisible();
    await expect(page.locator('mark[data-change="added"]').first()).toBeVisible();
    await page.getByRole('button', { name: '隐藏改动标记', exact: true }).click();
    await expect(page.locator('mark[data-change]')).toHaveCount(0);
    expect({ low: await low.innerText(), high: await high.innerText() }).toEqual(before);
    await page.getByRole('button', { name: '显示改动标记', exact: true }).click();
    await page.getByRole('button', { name: '全文阅读', exact: true }).click();
    await expect(page.locator('mark[data-change="added"]').first()).toBeVisible();
  });

  test('详细笔记、生词卡、原句和双语例句可读', async ({ page }) => {
    await page.goto(PAIR);
    await page.getByRole('link', { name: '详细学习笔记', exact: true }).click();
    await expect(page.getByRole('heading', { name: '逐段拆解', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '易错点与改进空间', exact: true })).toBeVisible();
    const words = page.locator('[data-vocabulary]');
    await expect(words).toHaveCount(8);
    const card = words.first();
    await card.locator('summary').click();
    await expect(card.getByText('用法与辨析', { exact: true })).toBeVisible();
    await expect(card.getByText('常用搭配', { exact: true })).toBeVisible();
    await expect(card.getByText('迁移例句', { exact: true })).toBeVisible();
    await expect(card.locator('p[lang="en"]')).toBeVisible();
    await expect(card.locator('p[lang="zh"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('逐句译文默认关闭，切换阅读模式保留选择，关闭不改变英文', async ({ page }) => {
    await page.goto(PAIR);
    const toggle = page.getByRole('switch', { name: '中文翻译', exact: true });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('[data-translation-side]')).toHaveCount(0);
    const english = async (side: string) => (await page.locator(`[data-essay-side="${side}"]`).allTextContents()).join(' ');
    const before = { low: await english('low'), high: await english('high') };
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-translation-side="low"]')).toHaveCount(15);
    await expect(page.locator('[data-translation-side="high"]')).toHaveCount(15);
    const lowTranslation = await page.locator('[data-translation-side="low"]').first().innerText();
    const highTranslation = await page.locator('[data-translation-side="high"]').first().innerText();
    expect(lowTranslation).not.toBe(highTranslation);
    expect({ low: await english('low'), high: await english('high') }).toEqual(before);
    await page.getByRole('button', { name: '全文阅读', exact: true }).click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-translation-side="low"]')).toHaveCount(15);
    expect({ low: await english('low'), high: await english('high') }).toEqual(before);
    await toggle.click();
    await expect(page.locator('[data-translation-side]')).toHaveCount(0);
    expect({ low: await english('low'), high: await english('high') }).toEqual(before);
    await page.getByRole('button', { name: '逐句对照', exact: true }).click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('中英设置和译文在窄屏可用，桌面两侧译文顶边对齐', async ({ page }) => {
    await page.goto('/en/study/ielts/task2-opinion-university-education');
    const toggle = page.getByRole('switch', { name: 'Chinese translation', exact: true });
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    const low = page.locator('[data-translation-side="low"]').first();
    const high = page.locator('[data-translation-side="high"]').first();
    await expect(low).toBeVisible();
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      const left = (await low.boundingBox())!;
      const right = (await high.boundingBox())!;
      expect(Math.abs(left.y - right.y)).toBeLessThanOrEqual(1);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(low).toBeVisible();
    await page.getByRole('button', { name: 'Show notes', exact: true }).click();
    const firstNote = page.locator('ol li button').first();
    await expect(firstNote).toHaveAttribute('aria-expanded', 'true');
    await firstNote.click();
    await expect(firstNote).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
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
