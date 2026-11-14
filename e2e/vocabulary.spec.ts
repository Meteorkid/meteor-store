import { test, expect, type Page } from '@playwright/test';
import { Client } from 'pg';
import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const databaseUrl = process.env.E2E_VOCABULARY_DB_URL;
const base = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const pair = '/zh/study/ielts/task2-opinion-university-education';
const password = 'Local-Vocabulary-QA-2026!';
const accounts = [0, 1].map(index => ({ id: randomUUID(), email: `vocab-qa-${randomUUID()}-${index}@example.com` }));
let db: Client;

// Chromium允许本机HTTP使用Secure Cookie，但APIRequestContext不会自动发送它。
// 仅在已限制的本地验收环境中，按真实浏览器cookie构造接口探针，不修改应用Cookie策略。
function api(page: Page) {
  const send = (method: string) => async (url: string, options: { headers?: Record<string, string>; data?: unknown } = {}) => {
    const cookies = await page.context().cookies();
    return page.request.fetch(url, { ...options, method, headers: {
      ...options.headers,
      ...(cookies.length ? { Cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ') } : {}),
    } });
  };
  return { get: send('GET'), post: send('POST'), delete: send('DELETE') };
}

test.describe('生词本隔离数据库验收', () => {
  test.skip(!databaseUrl, '需要显式提供隔离测试数据库');
  test.beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) || url.pathname !== '/meteor_ielts_verify'
      || !['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Only the isolated local verification environment is allowed');
    db = new Client({ connectionString: databaseUrl });
    await db.connect();
    for (const account of accounts) await db.query(
      'insert into users(id,email,password_hash,email_verified,created_at) values($1,$2,$3,true,$4)',
      [account.id, account.email, await hash(password, 10), new Date().toISOString()],
    );
  });
  // 本机夹具保留，失败后可检查快照和排期；不删除其它验收记录。
  test.afterAll(async () => { await db?.end(); });

  async function login(page: Page, index = 0) {
    const response = await api(page).post(`${base}/api/auth/login`, { headers: { Origin: base }, data: { email: accounts[index].email, password } });
    expect(response.status()).toBe(200);
  }
  const writeHeaders = (index = 0) => ({ Origin: base, 'X-Study-User': accounts[index].id });
  async function makeDue(id: string) {
    await db.query("update study_vocabulary set review_due_on=(now() at time zone 'Asia/Shanghai')::date::text where id=$1 and user_id=$2", [id, accounts[0].id]);
  }

  test('查词收藏、跨账号隔离、工作台/铃铛提醒、复习和删除', async ({ page, browser }) => {
    test.setTimeout(90000);
    await login(page);
    await page.goto(pair);
    await page.locator('[data-essay-side="high"] [data-lookup-word="tuition"]').first().click();
    const panel = page.getByRole('dialog');
    await panel.getByRole('button', { name: '加入生词本', exact: true }).click();
    await expect(panel.getByText('已加入生词本', { exact: true })).toBeVisible();
    const saved = await (await api(page).get(`${base}/api/study/vocabulary`)).json();
    expect(saved.userId).toBe(accounts[0].id);
    expect(saved.entries).toHaveLength(1);
    const entry = saved.entries[0];
    expect(entry.snapshot).toMatchObject({ word: 'tuition', source: 'lesson', pairSlug: 'task2-opinion-university-education', side: 'high' });
    expect(entry.snapshot.meaningZh).toContain('学费');
    expect(entry.snapshot.sentence).toContain('university tuition');
    expect(entry.reviewIntervalDays).toBe(1);
    expect(entry.revision).toBe(1);
    await panel.getByRole('link', { name: '打开生词本', exact: true }).click();
    await expect(page).toHaveURL(`${base}/zh/study/vocabulary`);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: '我的生词本' })).toBeVisible();
    await expect(page.getByText(entry.snapshot.sentence, { exact: true })).toBeVisible();
    await expect(page.getByText(entry.snapshot.meaningZh, { exact: true })).toBeVisible();

    const other = await browser.newContext({ baseURL: base });
    const otherPage = await other.newPage();
    await login(otherPage, 1);
    const otherList = await (await api(otherPage).get(`${base}/api/study/vocabulary`)).json();
    expect(otherList.entries).toEqual([]);
    const removeOther = await api(otherPage).delete(`${base}/api/study/vocabulary`, { headers: writeHeaders(1), data: { id: entry.id } });
    expect((await removeOther.json()).success).toBe(false);
    const reviewOther = await api(otherPage).post(`${base}/api/study/vocabulary/reviews`, { headers: writeHeaders(1), data: { id: entry.id, expectedRevision: 1, result: 'remembered' } });
    expect(reviewOther.status()).toBe(404);
    await otherPage.goto('/zh/study/vocabulary');
    await expect(otherPage.getByText('生词本还是空的。阅读雅思范文时，点选英文单词即可加入。')).toBeVisible();
    await other.close();

    await makeDue(entry.id);
    await page.goto('/zh/study');
    const section = page.getByRole('region', { name: '生词复习', exact: true });
    await expect(section.getByRole('heading', { name: 'tuition', exact: true })).toBeVisible();
    expect((await (await api(page).get(`${base}/api/study/summary`)).json()).dueVocabulary).toBe(1);
    await page.getByRole('button', { name: '查看公告', exact: true }).click();
    await page.getByRole('tab', { name: '提醒', exact: true }).click();
    await expect(page.getByRole('link', { name: '1 个生词今天待复习', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '关闭公告面板', exact: true }).click();
    await section.getByRole('button', { name: '查看释义', exact: true }).click();
    await expect(section.getByText(entry.snapshot.meaningZh, { exact: true })).toBeVisible();
    await section.getByRole('button', { name: '记得', exact: true }).click();
    await expect.poll(async () => (await (await api(page).get(`${base}/api/study/summary`)).json()).dueVocabulary).toBe(0);
    const reviewed = await (await api(page).get(`${base}/api/study/vocabulary`)).json();
    expect(reviewed.entries[0]).toMatchObject({ reviewStage: 1, reviewIntervalDays: 3, revision: 2 });
    await makeDue(entry.id);
    await page.goto('/zh/study/vocabulary');
    await page.getByRole('button', { name: '待复习', exact: true }).click();
    const queue = page.getByRole('region', { name: '生词复习', exact: true });
    await expect(queue.getByRole('button', { name: '查看释义', exact: true })).toBeVisible();
    await queue.getByRole('button', { name: '查看释义', exact: true }).click();
    await queue.getByRole('button', { name: '忘了', exact: true }).click();
    await expect.poll(async () => (await (await api(page).get(`${base}/api/study/vocabulary`)).json()).entries[0].reviewStage).toBe(0);
    await page.getByRole('button', { name: '全部生词', exact: true }).click();
    await page.getByRole('button', { name: '删除', exact: true }).click();
    await page.getByRole('button', { name: '取消', exact: true }).click();
    await expect(page.getByText(entry.snapshot.meaningZh, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '删除', exact: true }).click();
    await page.getByRole('button', { name: '确认删除', exact: true }).click();
    await expect.poll(async () => (await (await api(page).get(`${base}/api/study/vocabulary`)).json()).total).toBe(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('伪造快照不能保存，重复收藏保留进度，并发复习只推进一次', async ({ page }) => {
    await login(page);
    const lookup = await api(page).post(`${base}/api/ielts/word-lookup`, { headers: { Origin: base, 'X-Ielts-Lookup-Version': '2' }, data: { slug: 'task2-opinion-university-education', segmentIndex: 0, side: 'high', word: 'tuition' } });
    expect(lookup.status()).toBe(200);
    const result = await lookup.json();
    expect(result.saveToken).toBeTruthy();
    const invalid = await api(page).post(`${base}/api/study/vocabulary`, { headers: writeHeaders(), data: { saveToken: result.saveToken + 'x' } });
    expect(invalid.status()).toBe(400);
    const first = await (await api(page).post(`${base}/api/study/vocabulary`, { headers: writeHeaders(), data: { saveToken: result.saveToken } })).json();
    await makeDue(first.entry.id);
    const body = { id: first.entry.id, expectedRevision: first.entry.revision, result: 'remembered' };
    const responses = await Promise.all([0, 1].map(() => api(page).post(`${base}/api/study/vocabulary/reviews`, { headers: writeHeaders(), data: body })));
    expect(responses.map(response => response.status()).sort()).toEqual([200, 409]);
    const after = await (await api(page).get(`${base}/api/study/vocabulary`)).json();
    expect(after.entries[0]).toMatchObject({ reviewStage: 1, reviewIntervalDays: 3, revision: 2 });
    const duplicate = await (await api(page).post(`${base}/api/study/vocabulary`, { headers: writeHeaders(), data: { saveToken: result.saveToken } })).json();
    expect(duplicate.created).toBe(false);
    expect(duplicate.entry).toEqual(after.entries[0]);
    const changed = await api(page).post(`${base}/api/study/vocabulary`, { headers: writeHeaders(1), data: { saveToken: result.saveToken } });
    expect(changed.status()).toBe(409);
    const exported = await api(page).get(`${base}/api/auth/export`);
    expect(exported.status()).toBe(200);
    const exportedData = await exported.json();
    expect(exportedData.study.vocabulary).toHaveLength(1);
    expect(exportedData.study.vocabulary[0].snapshot).toEqual(after.entries[0].snapshot);
    expect(exported.headers()['cache-control']).toBe('no-store');
  });
});
