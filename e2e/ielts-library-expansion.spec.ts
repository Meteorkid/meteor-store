import { expect, test, type Page } from '@playwright/test';
import { curatedIeltsPairs } from '../src/data/ielts';

/**
 * 100 篇扩容的本地验收：必须先完成真实内容，并由调用方启动隔离服务。
 * 仅允许 loopback 站点，要求公开内容与精选库一致；不写数据库、不请求模型。
 * 使用同名专用 config，只连接已启动服务，不触发默认配置的 webServer。
 * 本脚本的页面验证不替代内容质量审阅或真实数据库状态合并测试。
 */
const pairs = curatedIeltsPairs.filter(pair => pair.status === 'published')
  .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
const cards = (page: Page) => page.locator('ul li a[href*="/study/ielts/"]');
const pageErrors = new WeakMap<Page, string[]>();
test.describe.configure({ timeout: 60_000 });

async function noOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
    .toBeLessThanOrEqual(1);
}

test.beforeEach(async ({ page, baseURL }) => {
  expect(['localhost', '127.0.0.1', '[::1]']).toContain(new URL(baseURL ?? '').hostname);
  expect(pairs, '先完成并接入 100 篇真实精选，再执行本次验收').toHaveLength(100);
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/ielts/word-lookup', route => route.abort('blockedbyclient'));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page) ?? [], '页面不应产生未捕获的 JavaScript 错误').toEqual([]);
});

test('100 篇先展示 24 篇，逐批加载后无重复或遗漏', async ({ page }) => {
  await page.goto('/zh/study/ielts');
  await expect(page.getByRole('heading', { level: 1, name: '雅思写作对照' })).toBeVisible();
  await expect(cards(page)).toHaveCount(24);
  await expect(page.getByRole('status').filter({ hasText: '找到 100 组对照' })).toHaveText('找到 100 组对照，已展示 24 组');
  for (let shown = 24; shown < 100; shown += 24) {
    const next = Math.min(24, 100 - shown);
    await page.getByRole('button', { name: `继续加载 ${next} 组`, exact: true }).click();
    await expect(cards(page)).toHaveCount(Math.min(100, shown + 24));
  }
  const slugs = await cards(page).evaluateAll(links => links.map(link => link.getAttribute('href')?.split('/').at(-1)));
  expect(slugs).toEqual(pairs.map(pair => pair.slug));
  expect(new Set(slugs).size).toBe(100);
  await expect(page.getByRole('button', { name: /^继续加载/ })).toHaveCount(0);
});

test('标题、题干和主题搜索包含末尾内容，清空后回到首批', async ({ page }) => {
  const last = pairs.at(-1)!;
  await page.goto('/zh/study/ielts');
  const search = page.getByRole('searchbox', { name: '搜索对照', exact: true });
  await page.getByRole('button', { name: '继续加载 24 组', exact: true }).click();
  await expect(cards(page)).toHaveCount(48);
  await search.fill(last.content.title.zh);
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toHaveAttribute('href', `/zh/study/ielts/${last.slug}`);
  await search.fill(last.content.prompt.zh);
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toHaveAttribute('href', `/zh/study/ielts/${last.slug}`);
  await search.fill('culture');
  await expect(cards(page)).toHaveCount(pairs.filter(pair => pair.topic === 'culture').length);
  await search.fill('不存在的搜索验收短语');
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByText('这个筛选下还没有对照，换一个条件看看。', { exact: true })).toBeVisible();
  await search.fill('');
  await expect(cards(page)).toHaveCount(24);
});

test('题型主题组合筛选准确，切换条件重新展示首批', async ({ page }) => {
  await page.goto('/zh/study/ielts');
  await page.getByRole('button', { name: '继续加载 24 组', exact: true }).click();
  await page.getByRole('button', { name: 'Task 2 大作文', exact: true }).click();
  await expect(cards(page)).toHaveCount(24);
  await page.getByRole('button', { name: '继续加载 24 组', exact: true }).click();
  await expect(cards(page)).toHaveCount(48);
  await page.getByRole('button', { name: '科学', exact: true }).click();
  const science = pairs.filter(pair => pair.task === 'task2' && pair.topic === 'science');
  await expect(cards(page)).toHaveCount(science.length);
  const slugs = await cards(page).evaluateAll(links => links.map(link => link.getAttribute('href')?.split('/').at(-1)));
  expect(slugs).toEqual(science.map(pair => pair.slug));
  await page.getByRole('button', { name: '全部', exact: true }).nth(1).click();
  await expect(cards(page)).toHaveCount(24);
  for (const [task, label] of [['task1-academic', 'Task 1 学术类'], ['task1-general', 'Task 1 书信（G 类）']] as const) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(cards(page)).toHaveCount(Math.min(24, pairs.filter(pair => pair.task === task).length));
    for (const card of await cards(page).all()) await expect(card).toContainText(label);
  }
});

for (const locale of ['zh', 'en'] as const) {
  const en = locale === 'en';
  test(`${locale} 对照库在 375px 可搜索加载，控件至少 44px 且无横向溢出`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/${locale}/study/ielts`);
    const search = page.getByRole('searchbox', { name: en ? 'Search the library' : '搜索对照', exact: true });
    const load = page.getByRole('button', { name: en ? 'Load 24 more' : '继续加载 24 组', exact: true });
    const task = page.getByRole('button', { name: en ? 'Task 2 essay' : 'Task 2 大作文', exact: true });
    await expect(cards(page)).toHaveCount(24);
    for (const control of [search, load, task]) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }
    await noOverflow(page);
    await load.click();
    await expect(cards(page)).toHaveCount(48);
    await noOverflow(page);
    await search.fill(pairs.at(-1)!.content.title[locale]);
    await expect(cards(page)).toHaveCount(1);
    await noOverflow(page);
  });

  for (const slug of [
    'task2-opinion-school-start-times',
    'task1-academic-table-library-branches',
    'task1-general-formal-room-enquiry',
  ]) {
    test(`${locale} 新增 ${slug} 的译文、表达块、生词与 375px 阅读`, async ({ page }) => {
      const pair = pairs.find(item => item.slug === slug);
      expect(pair, '必须验收本次新增的真实内容').toBeDefined();
      const content = pair!.content;
      await page.goto(`/${locale}/study/ielts/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(content.title[locale]);
      const toggle = page.getByRole('switch', { name: en ? 'Chinese translation' : '中文翻译', exact: true });
      await expect(toggle).toHaveAttribute('aria-checked', 'false');
      await expect(page.locator('[data-translation-side]')).toHaveCount(0);
      const paragraphCount = new Set(content.segments.map(segment => segment.paragraph)).size;
      await expect(page.locator('[data-expression-paragraph]')).toHaveCount(paragraphCount);
      await expect(page.locator('[data-expression-block]')).toHaveCount(content.segments.flatMap(segment => segment.expressionEdits ?? []).length);

      await toggle.click();
      for (const side of ['low', 'high'] as const) {
        const translations = page.locator(`[data-translation-side="${side}"]`);
        await expect(translations).toHaveCount(content.segments.length);
        expect((await translations.allTextContents()).map(text => text.replace(/^(中文翻译|Chinese translation)：/, '').trim()))
          .toEqual(content.segments.map(segment => segment.translationZh?.[side]));
      }
      const location = page.locator('[data-expression-block] a').first();
      const target = await location.getAttribute('href');
      expect(target).toMatch(/^#ielts-sentence-\d+$/);
      await location.click();
      await expect(page.locator(target!)).toHaveAttribute('data-note-open', 'true');
      await expect(toggle).toHaveAttribute('aria-checked', 'true');

      await page.setViewportSize({ width: 375, height: 812 });
      await noOverflow(page);
      await page.getByRole('button', { name: en ? 'Full essays' : '全文阅读', exact: true }).click();
      await expect(page.locator('[data-expression-block]')).toHaveCount(0);
      await expect(page.locator('[data-translation-side="low"]')).toHaveCount(content.segments.length);
      await expect(page.locator('[data-translation-side="high"]')).toHaveCount(content.segments.length);
      await noOverflow(page);

      await page.getByRole('link', { name: en ? 'Vocabulary & collocations' : '生词与搭配', exact: true }).click();
      const vocabulary = page.locator('[data-vocabulary]');
      expect(content.learning?.vocabulary.length).toBeGreaterThanOrEqual(6);
      await expect(vocabulary).toHaveCount(content.learning!.vocabulary.length);
      const firstWord = vocabulary.first();
      await firstWord.locator('summary').click();
      await expect(firstWord).toHaveAttribute('open', '');
      await expect(firstWord.locator('p[lang="en"]')).toBeVisible();
      await expect(firstWord.locator('p[lang="zh"]')).toBeVisible();
      await expect(firstWord.locator('p[lang="en"]')).toHaveText(content.learning!.vocabulary[0].example.en);
      await expect(firstWord.locator('p[lang="zh"]')).toHaveText(content.learning!.vocabulary[0].example.zh);
      await expect(firstWord.locator('dd[lang="en"]').first()).toHaveText(content.segments[content.learning!.vocabulary[0].segmentIndex].high);
      await noOverflow(page);
    });
  }
}
