import { describe, expect, it } from 'vitest';
import {
  BlogApiCreatePostSchema,
  BlogApiUpdatePostSchema,
  BlogApiVersionSchema,
  PostPatchSchema,
  PostSubmissionSchema,
} from '../post-validation';

const validPost = {
  title: '一篇合法的文章',
  excerpt: '这是一段满足最小长度要求的文章摘要',
  content: '正文'.repeat(100),
  sectionId: 'tech',
  sections: ['tech', 'story'],
  tags: ['TypeScript'],
  eventDate: '2026-08-10',
};

describe('PostSubmissionSchema', () => {
  it('保持网页投稿的默认草稿语义', () => {
    const parsed = PostSubmissionSchema.parse(validPost);

    expect(parsed).toMatchObject({ ...validPost, submit: false });
  });

  it('拒绝外形正确但不存在的日历日期', () => {
    expect(PostSubmissionSchema.safeParse({ ...validPost, eventDate: '2026-02-29' }).success)
      .toBe(false);
    expect(PostSubmissionSchema.safeParse({ ...validPost, eventDate: '2028-02-29' }).success)
      .toBe(true);
  });
});

describe('PostPatchSchema', () => {
  it('允许网页端用 action 撤回，且 update 是默认动作', () => {
    expect(PostPatchSchema.parse({ action: 'withdraw' })).toEqual({ action: 'withdraw' });
    expect(PostPatchSchema.parse({ title: '修改后的标题' })).toEqual({
      action: 'update',
      title: '修改后的标题',
    });
  });
});

describe('BlogApiCreatePostSchema', () => {
  it('创建固定为草稿，严格拒绝状态和提交字段', () => {
    expect(BlogApiCreatePostSchema.safeParse(validPost).success).toBe(true);
    expect(BlogApiCreatePostSchema.safeParse({ ...validPost, status: 'published' }).success).toBe(false);
    expect(BlogApiCreatePostSchema.safeParse({ ...validPost, submit: true }).success).toBe(false);
  });
});

describe('BlogApiUpdatePostSchema', () => {
  it('要求版本和至少一个可编辑字段，并拒绝提权字段', () => {
    const expectedUpdatedAt = '2026-08-10T08:00:00.000Z';

    expect(BlogApiUpdatePostSchema.safeParse({ expectedUpdatedAt, content: validPost.content }).success)
      .toBe(true);
    expect(BlogApiUpdatePostSchema.safeParse({ expectedUpdatedAt }).success).toBe(false);
    expect(BlogApiUpdatePostSchema.safeParse({ content: validPost.content }).success).toBe(false);
    expect(BlogApiUpdatePostSchema.safeParse({ expectedUpdatedAt, content: validPost.content, asAdmin: true }).success)
      .toBe(false);
  });
});

describe('BlogApiVersionSchema', () => {
  it('提交只接受 expectedUpdatedAt', () => {
    const body = { expectedUpdatedAt: '2026-08-10T08:00:00.000Z' };

    expect(BlogApiVersionSchema.safeParse(body).success).toBe(true);
    expect(BlogApiVersionSchema.safeParse({ ...body, adminPublish: true }).success).toBe(false);
  });
});
