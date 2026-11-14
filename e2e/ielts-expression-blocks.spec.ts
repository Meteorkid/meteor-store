import { expect, test, type Locator, type Page } from '@playwright/test';

const PAIR = '/zh/study/ielts/task2-opinion-university-education';

async function paint(locator: Locator) {
  return locator.evaluate(node => {
    const style = getComputedStyle(node);
    const parent = node.parentElement ? getComputedStyle(node.parentElement) : style;
    return {
      color: style.color,
      background: style.backgroundColor,
      decorationColor: style.textDecorationColor,
      parentBackground: parent.backgroundColor,
    };
  });
}

async function bodyPaint(page: Page) {
  return {
    low: await paint(page.locator('mark[data-change="removed"]').first()),
    high: await paint(page.locator('mark[data-change="added"]').first()),
  };
}

async function expressionPaint(page: Page) {
  return {
    before: await paint(page.locator('[data-expression-side="before"]').first()),
    after: await paint(page.locator('[data-expression-side="after"]').first()),
  };
}

test('表达块展示每段重点，定位原句打开说明并保留译文设置', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAIR);
  await expect(page.locator('[data-expression-paragraph]')).toHaveCount(4);
  await expect(page.locator('[data-expression-block][data-priority="primary"]')).toHaveCount(4);
  await expect(page.locator('mark[data-change="removed"]').first()).toBeVisible();
  await expect(page.locator('mark[data-change="added"]').first()).toBeVisible();
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
  await expect(page.locator('mark[data-change="removed"]').first()).toBeVisible();
  await expect(page.locator('mark[data-change="added"]').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '8 分档升级版' })).toBeVisible();
});

for (const width of [1440, 375]) {
  test(`${width}px表达块各占完整一行，保持前后表达顺序且无横溢出`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/study/ielts/task2-opinion-university-education');
    await expect(page.locator('[data-expression-paragraph]')).toHaveCount(4);
    let comparedRows = 0;
    for (const group of await page.locator('[data-expression-paragraph]').all()) {
      const blocks = group.locator('[data-expression-block]');
      const boxes = await blocks.evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        const container = node.parentElement!.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, containerX: container.x, containerWidth: container.width };
      }));
      for (const [index, box] of boxes.entries()) {
        expect(Math.abs(box.x - box.containerX)).toBeLessThanOrEqual(2);
        expect(Math.abs(box.width - box.containerWidth)).toBeLessThanOrEqual(2);
        if (index > 0) {
          expect(box.y).toBeGreaterThanOrEqual(boxes[index - 1].y + boxes[index - 1].height - 1);
          comparedRows++;
        }
      }
      for (const block of await blocks.all()) {
        await expect(block.getByRole('link', { name: /See in context/ })).toBeVisible();
        expect(await block.evaluate(node => {
          const before = node.querySelector('[data-expression-side="before"]')!;
          const after = node.querySelector('[data-expression-side="after"]')!;
          return Boolean(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING);
        })).toBe(true);
        const before = (await block.locator('[data-expression-side="before"]').boundingBox())!;
        const after = (await block.locator('[data-expression-side="after"]').boundingBox())!;
        const verticalOverlap = Math.min(before.y + before.height, after.y + after.height) - Math.max(before.y, after.y);
        // 同行时从左至右，换行时允许自然折行；不强制手机把两段文字排成两整行。
        if (verticalOverlap > 1) expect(after.x).toBeGreaterThanOrEqual(before.x - 1);
        else expect(after.y).toBeGreaterThanOrEqual(before.y);
      }
    }
    expect(comparedRows, '使用有多处重点的真实段落，避免空测堆叠布局').toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

for (const locale of ['zh', 'en'] as const) {
  test(`${locale}高亮配色作用于表达块和两种正文模式，并在刷新后保留`, async ({ page }) => {
    const labels = locale === 'zh'
      ? { palette: '高亮配色', full: '全文阅读', segments: '逐句对照', hide: '隐藏改动标记', show: '显示改动标记' }
      : { palette: 'Highlight colors', full: 'Full essays', segments: 'Sentence by sentence', hide: 'Hide changes', show: 'Show changes' };
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${locale}/study/ielts/task2-opinion-university-education`);
    const reader = page.locator('[data-highlight-palette]').first();
    const palette = page.getByRole('combobox', { name: labels.palette, exact: true });
    await expect(palette).toHaveValue('amber-mint');
    await expect(reader).toHaveAttribute('data-highlight-palette', 'amber-mint');
    expect((await palette.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).sort())
      .toEqual(['amber-mint', 'rose-sky', 'violet-gold', 'yellow-cyan'].sort());
    await expect(page.getByRole('button', { name: labels.hide, exact: true })).toHaveAttribute('aria-pressed', 'true');

    let currentBody = await bodyPaint(page);
    let currentExpressions = await expressionPaint(page);
    for (const value of ['rose-sky', 'violet-gold', 'yellow-cyan']) {
      await palette.selectOption(value);
      await expect(reader).toHaveAttribute('data-highlight-palette', value);
      await expect.poll(async () => (await bodyPaint(page)).low).not.toEqual(currentBody.low);
      await expect.poll(async () => (await bodyPaint(page)).high).not.toEqual(currentBody.high);
      await expect.poll(async () => (await expressionPaint(page)).before).not.toEqual(currentExpressions.before);
      await expect.poll(async () => (await expressionPaint(page)).after).not.toEqual(currentExpressions.after);
      currentBody = await bodyPaint(page);
      currentExpressions = await expressionPaint(page);
      await expect(page.locator('mark[data-change="removed"]').first()).toHaveCSS('text-decoration-style', 'dashed');
      await expect(page.locator('mark[data-change="added"]').first()).toHaveCSS('text-decoration-style', 'solid');
    }

    await page.getByRole('button', { name: labels.full, exact: true }).click();
    await expect(palette).toHaveValue('yellow-cyan');
    await expect.poll(() => bodyPaint(page)).toEqual(currentBody);
    await page.reload();
    await expect(palette).toHaveValue('yellow-cyan');
    await expect(reader).toHaveAttribute('data-highlight-palette', 'yellow-cyan');
    await page.getByRole('button', { name: labels.segments, exact: true }).click();
    await expect.poll(() => bodyPaint(page)).toEqual(currentBody);
    await expect.poll(() => expressionPaint(page)).toEqual(currentExpressions);

    await page.getByRole('button', { name: labels.hide, exact: true }).click();
    await expect(page.locator('mark[data-change]')).toHaveCount(0);
    expect(await expressionPaint(page)).toEqual(currentExpressions);
    await page.getByRole('button', { name: labels.show, exact: true }).click();
    await expect.poll(() => bodyPaint(page)).toEqual(currentBody);
    await page.setViewportSize({ width: 375, height: 812 });
    expect((await palette.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}
