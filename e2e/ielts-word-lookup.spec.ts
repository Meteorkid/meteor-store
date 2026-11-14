import { expect, test } from '@playwright/test';

const PAIR = '/zh/study/ielts/task2-opinion-university-education';
const endpoint = '**/api/ielts/word-lookup';
const result = (word: string, meaning = '测试用中文语境释义') => ({
  entry: { word, lemma: word, partOfSpeech: 'adverb', meaningZh: meaning, usageZh: '此处仅为界面回归测试内容。' }, source: 'ai',
});

test('点击教材词汇显示中文，Escape关闭并恢复到词', async ({ page }) => {
  await page.goto(PAIR);
  const word = page.locator('[data-essay-side="high"] [data-lookup-word="tuition"]').first();
  await word.click();
  const panel = page.getByRole('dialog');
  await expect(panel.getByRole('heading', { name: 'tuition', exact: true })).toBeVisible();
  await expect(panel.getByText('本文词汇', { exact: true })).toBeVisible();
  await expect(panel.getByText(/本篇指大学收取的学费/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(word).toBeFocused();
});

test('失败可重试，全文和关闭查义不改变英文', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => {
    requests += 1;
    const data = route.request().postDataJSON();
    return route.fulfill({ status: requests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify(requests === 1 ? { error: 'unavailable' } : result(data.word)) });
  });
  await page.goto(PAIR);
  const english = await page.locator('[data-essay-side="low"]').first().innerText();
  await page.locator('[data-lookup-word="nowadays"]').first().click();
  const panel = page.getByRole('dialog');
  await expect(panel.getByRole('alert')).toContainText('暂时不可用');
  await panel.getByRole('button', { name: '重试', exact: true }).click();
  await expect(panel.getByText('AI 语境释义', { exact: true })).toBeVisible();
  await panel.getByRole('button', { name: '关闭词语释义' }).click();
  await page.getByRole('switch', { name: '点词查义', exact: true }).click();
  await expect(page.locator('[data-lookup-word]')).toHaveCount(0);
  expect(await page.locator('[data-essay-side="low"]').first().innerText()).toBe(english);
  await expect(page.locator('mark[data-change]').first()).toBeVisible();
  await page.getByRole('switch', { name: '点词查义', exact: true }).click();
  await page.getByRole('button', { name: '全文阅读', exact: true }).click();
  await page.locator('[data-lookup-word="nowadays"]').first().click();
  await expect(panel.getByText('测试用中文语境释义')).toBeVisible();
});

test('连续切词后旧响应不能覆盖新词，关闭后不重开', async ({ page }) => {
  let release: () => void = () => undefined;
  let complete: () => void = () => undefined;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  const finished = new Promise<void>(resolve => { complete = resolve; });
  await page.route(endpoint, async route => {
    const { word } = route.request().postDataJSON();
    if (word === 'nowadays') {
      await blocked;
      await route.fulfill({ json: result(word, '过期结果不应出现') }).catch(() => undefined);
      complete();
    } else await route.fulfill({ json: result(word, '当前词的正确测试结果') });
  });
  await page.goto(PAIR);
  await page.locator('[data-lookup-word="nowadays"]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('[data-essay-side="low"] [data-lookup-word="many"]').first().click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'many', exact: true })).toBeVisible();
  await expect(page.getByText('当前词的正确测试结果')).toBeVisible();
  await page.getByRole('button', { name: '关闭词语释义' }).click();
  release();
  await finished;
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('过期结果不应出现')).toHaveCount(0);
});

test('正文拖选复制不会发起查词', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, async route => { requests += 1; await route.fulfill({ json: result('nowadays') }); });
  await page.goto(PAIR);
  const sentence = page.locator('[data-essay-side="low"]').first();
  await sentence.scrollIntoViewIfNeeded();
  const box = (await sentence.boundingBox())!;
  await page.mouse.move(box.x + 2, box.y + 14);
  await page.mouse.down();
  await page.mouse.move(box.x + Math.min(box.width - 4, 280), box.y + 14, { steps: 15 });
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString().length ?? 0)).toBeGreaterThan(5);
  expect(requests).toBe(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('方向键选词、发音仅在点击后开始，搜索可关闭浮层', async ({ page }) => {
  await page.addInitScript(() => {
    const spoken: string[] = [];
    Reflect.set(window, '__spokenWords', spoken);
    class FakeUtterance {
      lang = ''; voice: unknown; onend: (() => void) | null = null; onerror: (() => void) | null = null;
      constructor(public text: string) {}
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance });
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => [{ lang: 'en-US' }], cancel: () => undefined,
      speak: (item: FakeUtterance) => { spoken.push(item.text); queueMicrotask(() => item.onend?.()); },
    } });
  });
  await page.route(endpoint, route => route.fulfill({ json: result(route.request().postDataJSON().word) }));
  await page.goto(PAIR);
  const first = page.locator('[data-lookup-word="nowadays"]').first();
  await first.focus();
  await page.keyboard.press('ArrowRight');
  const many = page.locator('[data-essay-side="low"] [data-lookup-word="many"]').first();
  await expect(many).toBeFocused();
  await page.keyboard.press('Enter');
  const panel = page.getByRole('dialog');
  await expect(panel.getByRole('heading', { name: 'many', exact: true })).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, '__spokenWords'))).toEqual([]);
  await panel.getByRole('button', { name: '朗读', exact: true }).click();
  expect(await page.evaluate(() => Reflect.get(window, '__spokenWords'))).toEqual(['many']);
  await expect(panel.getByRole('status')).toContainText('朗读结束');
  await page.evaluate(() => window.dispatchEvent(new Event('spotlight:open')));
  await expect(panel).toHaveCount(0);
});

test('320px底部面板不溢出且没有英语语音时提示', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], cancel: () => undefined } });
  });
  await page.route(endpoint, route => route.fulfill({ json: result(route.request().postDataJSON().word) }));
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto(PAIR);
  await page.locator('[data-lookup-word="nowadays"]').first().click();
  const panel = page.getByRole('dialog');
  await expect(panel.getByText('测试用中文语境释义')).toBeVisible();
  const box = (await panel.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y + box.height).toBeLessThanOrEqual(812);
  await panel.getByRole('button', { name: '朗读', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText(/英语语音|不支持朗读/);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
