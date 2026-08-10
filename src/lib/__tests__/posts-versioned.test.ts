import { PgDialect } from 'drizzle-orm/pg-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const dbState = vi.hoisted(() => ({
  updateResult: { rowCount: 1 },
  selectedRows: [] as Array<Record<string, unknown>>,
  selectResults: [] as Array<Array<Record<string, unknown>>>,
  insertedValues: [] as unknown[],
  updateValues: [] as Array<Record<string, unknown>>,
  updateWhereQueries: [] as unknown[],
  executedQueries: [] as unknown[],
  executeError: null as Error | null,
}));

const dbMock = vi.hoisted(() => ({
  update: vi.fn(() => ({
    set: vi.fn((values: Record<string, unknown>) => {
      dbState.updateValues.push(values);
      return {
        where: vi.fn(async (query: unknown) => {
          dbState.updateWhereQueries.push(query);
          return dbState.updateResult;
        }),
      };
    }),
  })),
  select: vi.fn(() => {
    let result: Array<Record<string, unknown>> | undefined;
    const takeResult = () => {
      result ??= dbState.selectResults.shift() ?? dbState.selectedRows;
      return result;
    };
    const query: Record<string, unknown> = {};
    query.from = vi.fn(() => query);
    query.leftJoin = vi.fn(() => query);
    query.where = vi.fn(() => query);
    query.orderBy = vi.fn(() => query);
    query.limit = vi.fn(async () => takeResult());
    query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(takeResult()).then(resolve, reject);
    return query;
  }),
  delete: vi.fn(() => ({
    where: vi.fn(async () => ({ rowCount: 1 })),
  })),
  insert: vi.fn(() => ({
    values: vi.fn(async (values: unknown) => {
      dbState.insertedValues.push(values);
      return { rowCount: 1 };
    }),
  })),
  execute: vi.fn(async (query: unknown) => {
    dbState.executedQueries.push(query);
    if (dbState.executeError) throw dbState.executeError;
    return {
      rowCount: dbState.updateResult.rowCount,
      rows: dbState.updateResult.rowCount > 0
        ? [{ id: 'P1', updated_at: '2026-08-10T09:00:00.000Z' }]
        : [],
    };
  }),
}));

vi.mock('@/lib/db', () => ({ db: dbMock }));

import {
  createPost,
  getPostByAuthor,
  submitPostVersioned,
  updatePost,
  updatePostDraftVersioned,
} from '../posts';

function compiledQuery(query: unknown) {
  return new PgDialect().sqlToQuery(
    query as Parameters<PgDialect['sqlToQuery']>[0],
  );
}

describe('createPost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.updateResult = { rowCount: 1 };
    dbState.selectedRows = [];
    dbState.selectResults = [];
    dbState.insertedValues = [];
    dbState.updateValues = [];
    dbState.updateWhereQueries = [];
    dbState.executedQueries = [];
    dbState.executeError = null;
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T09:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('用单条参数化 CTE 原子写入主行、分区和标签并返回版本', async () => {
    const result = await createPost({
      authorId: 'U1',
      title: '一篇完整文章',
      excerpt: '这是一段满足最小长度要求的摘要',
      content: '正文'.repeat(100),
      sectionId: 'tech',
      sections: ['story', 'tech'],
      tags: ['AI', 'ai'],
      status: 'draft',
      eventDate: null,
    });

    expect(result).toEqual({
      id: 'P1',
      updatedAt: '2026-08-10T09:00:00.000Z',
    });
    expect(dbMock.execute).toHaveBeenCalledOnce();
    expect(dbMock.insert).not.toHaveBeenCalled();
    expect(dbMock.delete).not.toHaveBeenCalled();
    expect(dbMock.update).not.toHaveBeenCalled();

    const query = compiledQuery(dbState.executedQueries[0]);
    const sqlText = query.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toMatch(/^with inserted_post as/);
    expect(sqlText).toContain('insert into "posts"');
    expect(sqlText).toContain('inserted_sections as ( insert into "post_sections"');
    expect(sqlText).toContain('inserted_tags as ( insert into "post_tags"');
    expect(sqlText).toContain('select "id", "updated_at" from inserted_post');
    expect(query.params).toEqual(expect.arrayContaining([
      'U1', '一篇完整文章', 'tech', 'story', 'ai', 'AI',
    ]));
    expect(query.sql).not.toContain('一篇完整文章');
  });

  it('任一关系写失败时只拒绝整条原子 SQL，不执行补偿写入', async () => {
    dbState.executeError = new Error('relation constraint failed');

    await expect(createPost({
      authorId: 'U1',
      title: '一篇完整文章',
      excerpt: '这是一段满足最小长度要求的摘要',
      content: '正文'.repeat(100),
      sectionId: 'tech',
      sections: ['tech'],
      tags: ['AI'],
      status: 'draft',
    })).rejects.toThrow('relation constraint failed');

    expect(dbMock.execute).toHaveBeenCalledOnce();
    expect(dbMock.insert).not.toHaveBeenCalled();
    expect(dbMock.delete).not.toHaveBeenCalled();
    expect(dbMock.update).not.toHaveBeenCalled();
  });
});

describe('submitPostVersioned', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.updateResult = { rowCount: 1 };
    dbState.selectedRows = [];
    dbState.selectResults = [];
    dbState.insertedValues = [];
    dbState.updateValues = [];
    dbState.updateWhereQueries = [];
    dbState.executedQueries = [];
    dbState.executeError = null;
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T09:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('普通作者显式提交后进入 pending，并返回新版本', async () => {
    const result = await submitPostVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: false,
    });

    expect(result).toEqual({
      ok: true,
      status: 'pending',
      updatedAt: '2026-08-10T09:00:00.000Z',
    });
  });

  it('管理员只直发自己的文章，目标状态为 published', async () => {
    const result = await submitPostVersioned({
      postId: 'P1',
      authorId: 'U-admin',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: true,
    });

    expect(result).toEqual({
      ok: true,
      status: 'published',
      updatedAt: '2026-08-10T09:00:00.000Z',
    });
  });

  it('不存在或不属于当前作者时返回 notFound', async () => {
    dbState.updateResult = { rowCount: 0 };
    dbState.selectedRows = [];

    const result = await submitPostVersioned({
      postId: 'P-other',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: false,
    });

    expect(result).toEqual({ ok: false, reason: 'notFound' });
  });

  it('待审核或已发布文章返回 invalidState', async () => {
    dbState.updateResult = { rowCount: 0 };
    dbState.selectedRows = [{ status: 'published', updatedAt: '2026-08-10T08:00:00.000Z' }];

    const result = await submitPostVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: false,
    });

    expect(result).toEqual({ ok: false, reason: 'invalidState' });
  });

  it('草稿已被其他客户端更新时返回 versionConflict', async () => {
    dbState.updateResult = { rowCount: 0 };
    dbState.selectedRows = [{ status: 'draft', updatedAt: '2026-08-10T08:30:00.000Z' }];

    const result = await submitPostVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      publish: false,
    });

    expect(result).toEqual({ ok: false, reason: 'versionConflict' });
  });
});

describe('updatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.updateResult = { rowCount: 1 };
    dbState.selectedRows = [];
    dbState.selectResults = [[{
      authorId: 'U1',
      status: 'draft',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];
    dbState.insertedValues = [];
    dbState.updateValues = [];
    dbState.updateWhereQueries = [];
    dbState.executedQueries = [];
    dbState.executeError = null;
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T09:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('关系字段与主表更新共享一条原子 SQL', async () => {
    const result = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      sectionId: 'story',
      sections: ['story', 'tech'],
      tags: ['AI'],
    });

    expect(result).toMatchObject({ ok: true, status: 'draft' });
    expect(dbMock.execute).toHaveBeenCalledOnce();
    expect(dbMock.update).not.toHaveBeenCalled();
    expect(dbMock.delete).not.toHaveBeenCalled();
    expect(dbMock.insert).not.toHaveBeenCalled();

    const query = compiledQuery(dbState.executedQueries[0]);
    const sqlText = query.sql.replace(/\s+/g, ' ').trim().toLowerCase();
    expect(sqlText).toMatch(/^with updated_post as/);
    expect(sqlText).toContain('update "posts"');
    expect(sqlText).toContain('delete from "post_tags"');
    expect(sqlText).toContain('insert into "post_tags"');
    expect(sqlText).toContain('delete from "post_sections"');
    expect(sqlText).toContain('insert into "post_sections"');
    expect(query.params).toEqual(expect.arrayContaining(['P1', 'U1', 'draft', 'ai', 'AI', 'story', 'tech']));
  });

  it('预读后文章被 v1 提交时旧更新返回 concurrentUpdate', async () => {
    dbState.updateResult = { rowCount: 0 };
    dbState.selectResults = [
      [{
        authorId: 'U1',
        status: 'draft',
        sectionId: 'tech',
        updatedAt: '2026-08-10T08:00:00.000Z',
      }],
      [{ authorId: 'U1', status: 'pending' }],
    ];

    const result = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '旧客户端保存',
    });

    expect(result).toEqual({ ok: false, reason: 'concurrentUpdate' });
    const where = compiledQuery(dbState.updateWhereQueries[0]);
    expect(where.sql).toContain('"posts"."author_id"');
    expect(where.sql).toContain('"posts"."status"');
    expect(where.sql).toContain('"posts"."updated_at"');
    expect(where.params).toEqual(expect.arrayContaining([
      'P1',
      'U1',
      'draft',
      '2026-08-10T08:00:00.000Z',
    ]));
  });

  it('初始状态就是 pending 时普通作者仍收到 pendingCannotEdit', async () => {
    dbState.selectResults = [[{
      authorId: 'U1',
      status: 'pending',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];

    const result = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '审核中修改',
    });

    expect(result).toEqual({ ok: false, reason: 'pendingCannotEdit' });
    expect(dbMock.update).not.toHaveBeenCalled();
    expect(dbMock.execute).not.toHaveBeenCalled();
  });

  it('文章仍为 draft 但版本已变化时返回 concurrentUpdate', async () => {
    dbState.updateResult = { rowCount: 0 };
    dbState.selectResults = [
      [{
        authorId: 'U1',
        status: 'draft',
        sectionId: 'tech',
        updatedAt: '2026-08-10T08:00:00.000Z',
      }],
      [{ authorId: 'U1', status: 'draft' }],
    ];

    const result = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '旧客户端保存',
    });

    expect(result).toEqual({ ok: false, reason: 'concurrentUpdate' });
  });

  it('同毫秒或服务器时钟回拨时仍生成严格递增的 updatedAt', async () => {
    vi.setSystemTime(new Date('2026-08-10T07:00:00.000Z'));

    await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '同毫秒保存',
    });

    expect(dbState.updateValues[0]).toMatchObject({
      updatedAt: '2026-08-10T08:00:00.001Z',
    });
  });

  it('管理员可越权直发 pending，但仍锁定预读状态和版本', async () => {
    dbState.selectResults = [[{
      authorId: 'U-other',
      status: 'pending',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];

    const result = await updatePost({
      postId: 'P1',
      authorId: 'U-admin',
      title: '管理员修订',
      tags: ['AI'],
      submit: true,
      adminPublish: true,
      asAdmin: true,
    });

    expect(result).toMatchObject({
      ok: true,
      status: 'published',
      wasPublished: false,
    });
    const query = compiledQuery(dbState.executedQueries[0]);
    expect(query.sql).not.toContain('"author_id"');
    expect(query.sql).toContain('AND "status" =');
    expect(query.sql).toContain('AND "updated_at" =');
    expect(query.params).toEqual(expect.arrayContaining([
      'pending',
      '2026-08-10T08:00:00.000Z',
    ]));
    expect(query.params).not.toContain('U-admin');
  });

  it('管理员无关系字段更新同样省略 authorId 并锁定状态和版本', async () => {
    dbState.selectResults = [[{
      authorId: 'U-other',
      status: 'pending',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];

    const result = await updatePost({
      postId: 'P1',
      authorId: 'U-admin',
      title: '管理员修订',
      submit: true,
      adminPublish: true,
      asAdmin: true,
    });

    expect(result).toMatchObject({ ok: true, status: 'published' });
    const where = compiledQuery(dbState.updateWhereQueries[0]);
    expect(where.sql).not.toContain('"author_id"');
    expect(where.sql).toContain('"posts"."status"');
    expect(where.sql).toContain('"posts"."updated_at"');
    expect(where.params).toEqual(expect.arrayContaining([
      'pending',
      '2026-08-10T08:00:00.000Z',
    ]));
    expect(where.params).not.toContain('U-admin');
  });

  it('普通作者即使传入内部 adminPublish 标志也只能进入 pending', async () => {
    const result = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '普通作者提交',
      submit: true,
      adminPublish: true,
    });

    expect(result).toMatchObject({ ok: true, status: 'pending', wasPublished: false });
    expect(dbState.updateValues[0]).toMatchObject({ status: 'pending' });
  });

  it('普通作者编辑 published 会下架重审，管理员编辑则保持 published', async () => {
    dbState.selectResults = [[{
      authorId: 'U1',
      status: 'published',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];

    const authorResult = await updatePost({
      postId: 'P1',
      authorId: 'U1',
      title: '作者修订',
    });

    expect(authorResult).toMatchObject({ ok: true, status: 'pending', wasPublished: true });
    expect(dbState.updateValues[0]).toMatchObject({ status: 'pending', publishedAt: null });

    vi.clearAllMocks();
    dbState.selectResults = [[{
      authorId: 'U-other',
      status: 'published',
      sectionId: 'tech',
      updatedAt: '2026-08-10T08:00:00.000Z',
    }]];
    dbState.updateValues = [];
    dbState.updateWhereQueries = [];

    const adminResult = await updatePost({
      postId: 'P1',
      authorId: 'U-admin',
      title: '管理员修订',
      adminPublish: true,
      asAdmin: true,
    });

    expect(adminResult).toMatchObject({ ok: true, status: 'published', wasPublished: true });
    expect(dbState.updateValues[0]).toMatchObject({ status: 'published' });
    expect(dbState.updateValues[0]).not.toHaveProperty('publishedAt');
  });
});

describe('updatePostDraftVersioned', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.updateResult = { rowCount: 1 };
    dbState.selectedRows = [];
    dbState.selectResults = [];
    dbState.insertedValues = [];
    dbState.updateValues = [];
    dbState.updateWhereQueries = [];
    dbState.executedQueries = [];
    dbState.executeError = null;
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T09:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('用 expectedUpdatedAt 更新草稿并返回新版本', async () => {
    const result = await updatePostDraftVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      title: '修改后的标题',
    });

    expect(result).toEqual({
      ok: true,
      status: 'draft',
      updatedAt: '2026-08-10T09:00:00.000Z',
    });
    expect(dbMock.update).toHaveBeenCalledOnce();
    expect(dbMock.execute).not.toHaveBeenCalled();
  });

  it('更新标签和分区时沿用现有归一化规则', async () => {
    await updatePostDraftVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      sectionId: 'story',
      sections: ['tech', 'story', 'tech'],
      tags: ['AI', 'ai'],
    });

    expect(dbMock.execute).toHaveBeenCalledOnce();
    expect(dbMock.update).not.toHaveBeenCalled();
    expect(dbMock.delete).not.toHaveBeenCalled();
    expect(dbMock.insert).not.toHaveBeenCalled();

    const query = compiledQuery(dbState.executedQueries[0]);
    const sqlText = query.sql.toLowerCase();
    expect(sqlText).toMatch(/with\s+updated_post as/);
    expect(sqlText).toContain('delete from "post_tags"');
    expect(sqlText).toContain('insert into "post_tags"');
    expect(sqlText).toContain('delete from "post_sections"');
    expect(sqlText).toContain('insert into "post_sections"');
    expect(query.params).toEqual(expect.arrayContaining(['ai', 'AI', 'story', 'tech']));
  });

  it('只更新 sections 时保留数据库主分区，并把它排在关系首位', async () => {
    dbState.selectResults = [
      [{ sectionId: 'tech' }],
      [{ sectionId: 'tech' }, { sectionId: 'story' }],
    ];

    await updatePostDraftVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      sections: ['literature'],
    });

    const query = compiledQuery(dbState.executedQueries[0]);
    expect(query.params).toEqual(expect.arrayContaining(['tech', 'literature']));
  });

  it('只更新主分区时以新主分区开头，并保留现有分区关系', async () => {
    dbState.selectResults = [
      [{ sectionId: 'tech' }],
      [{ sectionId: 'tech' }, { sectionId: 'story' }],
    ];

    await updatePostDraftVersioned({
      postId: 'P1',
      authorId: 'U1',
      expectedUpdatedAt: '2026-08-10T08:00:00.000Z',
      sectionId: 'literature',
    });

    const query = compiledQuery(dbState.executedQueries[0]);
    expect(query.sql).toContain('"section_id" =');
    expect(query.params).toEqual(expect.arrayContaining(['literature', 'tech', 'story']));
  });
});

describe('getPostByAuthor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.selectedRows = [];
    dbState.selectResults = [];
  });

  it('无论关系查询顺序如何，都把主分区排在首位并去重', async () => {
    dbState.selectResults = [
      [{
        id: 'P1',
        authorId: 'U1',
        authorName: '作者',
        authorBio: null,
        authorAvatarUrl: null,
        title: '文章标题',
        excerpt: '文章摘要',
        content: '正文',
        sectionId: 'tech',
        status: 'draft',
        reviewNote: null,
        publishedAt: null,
        createdAt: '2026-08-10T08:00:00.000Z',
        updatedAt: '2026-08-10T08:00:00.000Z',
        eventDate: null,
      }],
      [],
      [
        { postId: 'P1', sectionId: 'story' },
        { postId: 'P1', sectionId: 'tech' },
        { postId: 'P1', sectionId: 'literature' },
        { postId: 'P1', sectionId: 'story' },
      ],
    ];

    const post = await getPostByAuthor('P1', 'U1');

    expect(post?.sections).toEqual(['tech', 'story', 'literature']);
  });
});
