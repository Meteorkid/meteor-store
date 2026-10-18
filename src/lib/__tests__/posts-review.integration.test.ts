import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ db: undefined as NodePgDatabase | undefined }));
vi.mock('@/lib/db', () => ({
  db: new Proxy({}, {
    get(_target, key) {
      if (!state.db) throw new Error('测试数据库尚未连接');
      const value = Reflect.get(state.db, key);
      return typeof value === 'function' ? value.bind(state.db) : value;
    },
  }),
}));

import { createPost, reviewPost, submitPostVersioned, updatePost, withdrawPost } from '../posts';

// 显式指定本地测试库；所有服务写入会话临时表，并在每项测试后回滚。
const databaseUrl = process.env.POSTS_TEST_DATABASE_URL;
describe.skipIf(!databaseUrl)('投稿审核版本（真实 PostgreSQL）', () => {
  let client: Client;

  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || !url.pathname.endsWith('_test')) {
      throw new Error('POSTS_TEST_DATABASE_URL 必须指向本地且名称以 _test 结尾的测试库');
    }
    client = new Client({ connectionString: databaseUrl });
    await client.connect();
    state.db = drizzle(client);
  });

  beforeEach(async () => {
    await client.query('BEGIN');
    for (const table of ['posts', 'post_tags', 'post_sections']) {
      await client.query(`CREATE TEMP TABLE ${table} (LIKE public.${table} INCLUDING ALL) ON COMMIT DROP`);
    }
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-08-10T10:00:00.000Z'));
  });

  afterEach(async () => {
    vi.useRealTimers();
    await client.query('ROLLBACK');
  });

  afterAll(async () => {
    await client?.end();
  });

  async function pendingPost() {
    const created = await createPost({
      authorId: 'review-test-author',
      title: '审核版本 A',
      excerpt: '管理员看到的原始投稿摘要',
      content: '管理员看到的正文 A',
      sectionId: 'tech',
      tags: ['原稿'],
      status: 'draft',
    });
    const submitted = await submitPostVersioned({
      postId: created.id,
      authorId: 'review-test-author',
      expectedUpdatedAt: created.updatedAt,
      publish: false,
    });
    if (!submitted.ok) throw new Error('测试稿件提交失败');
    return { postId: created.id, expectedUpdatedAt: submitted.updatedAt };
  }

  it.each([true, false])('撤回、修改正文与标签、重提后，旧审核 approve=%s 失败', async (approve) => {
    const snapshot = await pendingPost();
    vi.setSystemTime(new Date('2026-08-10T11:00:00.000Z'));
    const withdrawn = await withdrawPost({ postId: snapshot.postId, authorId: 'review-test-author' });
    expect(withdrawn.ok).toBe(true);
    const edited = await updatePost({
      postId: snapshot.postId,
      authorId: 'review-test-author',
      content: '作者替换后的正文 B',
      tags: ['新稿'],
      submit: true,
    });
    expect(edited).toMatchObject({ ok: true, status: 'pending' });

    const changed = await reviewPost({ ...snapshot, reviewerId: 'review-test-admin', approve });

    expect(changed).toBe(false);
    const { rows } = await client.query('SELECT content, status, reviewer_id FROM posts WHERE id = $1', [snapshot.postId]);
    expect(rows[0]).toEqual({ content: '作者替换后的正文 B', status: 'pending', reviewer_id: null });
  });

  it.each([0, -1, -3_600_000])('撤回时钟偏移 %s 毫秒仍推进版本，旧审核不能命中重投稿', async (offset) => {
    const snapshot = await pendingPost();
    vi.setSystemTime(new Date(Date.parse(snapshot.expectedUpdatedAt) + offset));
    const withdrawn = await withdrawPost({ postId: snapshot.postId, authorId: 'review-test-author' });
    if (!withdrawn.ok) throw new Error('撤回失败');
    await updatePost({
      postId: snapshot.postId,
      authorId: 'review-test-author',
      content: '同毫秒或时钟回拨后的正文 B',
      submit: true,
    });

    expect(await reviewPost({ ...snapshot, reviewerId: 'review-test-admin', approve: true })).toBe(false);
    expect(withdrawn.updatedAt > snapshot.expectedUpdatedAt).toBe(true);
    expect(withdrawn.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it.each([true, false])('当前版本 approve=%s 正常处理，重复审核失败', async (approve) => {
    const snapshot = await pendingPost();
    const decision = { ...snapshot, reviewerId: 'review-test-admin', approve, note: '审核说明' };

    expect(await reviewPost(decision)).toBe(true);
    expect(await reviewPost(decision)).toBe(false);
    const { rows } = await client.query('SELECT status, reviewer_id, review_note, updated_at FROM posts WHERE id = $1', [snapshot.postId]);
    expect(rows[0]).toMatchObject({
      status: approve ? 'published' : 'rejected',
      reviewer_id: 'review-test-admin',
      review_note: '审核说明',
    });
    expect(rows[0].updated_at > snapshot.expectedUpdatedAt).toBe(true);
  });

  it('仅更改标签也推进版本，重新提交后必须重新审核', async () => {
    const snapshot = await pendingPost();
    const withdrawn = await withdrawPost({ postId: snapshot.postId, authorId: 'review-test-author' });
    if (!withdrawn.ok) throw new Error('撤回失败');
    expect(await updatePost({ postId: snapshot.postId, authorId: 'review-test-author', tags: ['新标签'] }))
      .toMatchObject({ ok: true, status: 'draft' });
    const { rows: [edited] } = await client.query('SELECT updated_at, content FROM posts WHERE id = $1', [snapshot.postId]);
    expect(edited.updated_at > withdrawn.updatedAt).toBe(true);
    expect(edited.content).toBe('管理员看到的正文 A');
    const submitted = await submitPostVersioned({
      postId: snapshot.postId,
      authorId: 'review-test-author',
      expectedUpdatedAt: edited.updated_at,
      publish: false,
    });
    if (!submitted.ok) throw new Error('重新提交失败');
    expect(submitted.updatedAt > edited.updated_at).toBe(true);

    expect(await reviewPost({ ...snapshot, reviewerId: 'review-test-admin', approve: true })).toBe(false);
    expect(await reviewPost({
      postId: snapshot.postId,
      expectedUpdatedAt: submitted.updatedAt,
      reviewerId: 'review-test-admin',
      approve: true,
    })).toBe(true);
  });

  it('撤回仍区分不存在、非作者和非待审状态', async () => {
    const snapshot = await pendingPost();
    expect(await withdrawPost({ postId: 'missing-post', authorId: 'review-test-author' }))
      .toEqual({ ok: false, reason: 'notFound' });
    expect(await withdrawPost({ postId: snapshot.postId, authorId: 'another-author' }))
      .toEqual({ ok: false, reason: 'notAuthor' });
    await reviewPost({ ...snapshot, reviewerId: 'review-test-admin', approve: true });
    expect(await withdrawPost({ postId: snapshot.postId, authorId: 'review-test-author' }))
      .toEqual({ ok: false, reason: 'notPending' });
  });
});
