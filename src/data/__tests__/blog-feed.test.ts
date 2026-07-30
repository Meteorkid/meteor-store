import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const getPublishedUserPosts = vi.fn();

vi.mock('@/lib/posts', () => ({
  getPublishedUserPosts: () => getPublishedUserPosts(),
}));

// 文件文章固定成两篇，测试只关心合并行为
vi.mock('../blog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../blog')>();
  return {
    ...actual,
    blogPosts: [
      {
        slug: 'file-new',
        title: '文件文章（新）',
        excerpt: '摘要',
        content: '正文',
        date: '2026-05-01',
        section: 'debate',
        readingTime: 2,
        tags: ['法律', 'AI'],
        draft: false,
      },
      {
        slug: 'file-old',
        title: '文件文章（旧）',
        excerpt: '摘要',
        content: '正文',
        date: '2026-01-01',
        section: 'tech',
        readingTime: 3,
        tags: ['AI'],
        draft: false,
      },
    ],
  };
});

const { getFeedPosts, getFeedTags, getSectionCounts, getFeedPostsByTag, findFeedTag } = await import(
  '../blog-feed'
);

function userPost(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'AbC123',
    authorId: 'U1',
    authorName: '张三',
    title: '一篇投稿',
    excerpt: '摘要',
    content: '正文内容',
    sectionId: 'debate',
    status: 'published',
    reviewNote: null,
    tags: ['法律'],
    publishedAt: '2026-03-15T08:00:00.000Z',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
    ...over,
  };
}

beforeEach(() => {
  getPublishedUserPosts.mockReset();
  getPublishedUserPosts.mockResolvedValue([]);
});

describe('getFeedPosts', () => {
  it('把投稿混进文件文章，整体按日期倒序', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const posts = await getFeedPosts();
    expect(posts.map((p) => p.slug)).toEqual(['file-new', 'AbC123', 'file-old']);
  });

  it('两种来源的地址规则不同', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const posts = await getFeedPosts();
    expect(posts.find((p) => p.slug === 'AbC123')!.href).toBe('/blog/p/AbC123');
    expect(posts.find((p) => p.slug === 'file-new')!.href).toBe('/blog/file-new');
  });

  it('投稿带作者名，站主的文章没有', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const posts = await getFeedPosts();
    expect(posts.find((p) => p.slug === 'AbC123')!.author).toBe('张三');
    expect(posts.find((p) => p.slug === 'file-new')!.author).toBeNull();
  });

  it('publishedAt 的时间戳被截成日期，排序才不会被时分秒干扰', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const posts = await getFeedPosts();
    expect(posts.find((p) => p.slug === 'AbC123')!.date).toBe('2026-03-15');
  });

  it('数据库读失败时降级为只有文件文章，而不是整个博客 500', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getPublishedUserPosts.mockRejectedValue(new Error('connection refused'));

    const posts = await getFeedPosts();
    expect(posts.map((p) => p.slug)).toEqual(['file-new', 'file-old']);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('getFeedTags', () => {
  it('两条来源的标签计数相加', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const tags = await getFeedTags();
    // 法律：文件 1 + 投稿 1；AI：文件 2。同数时按中文排序，汉字在拉丁字母前
    expect(tags.map((t) => [t.label, t.count])).toEqual([
      ['法律', 2],
      ['AI', 2],
    ]);
  });

  it('按数量降序，同数按中文排序', async () => {
    getPublishedUserPosts.mockResolvedValue([
      userPost({ id: 'p1', tags: ['法律'] }),
      userPost({ id: 'p2', tags: ['法律'] }),
    ]);
    const tags = await getFeedTags();
    expect(tags[0]).toMatchObject({ label: '法律', count: 3 });
  });

  it('大小写不同视为同一个标签', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost({ tags: ['ai'] })]);
    const tags = await getFeedTags();
    expect(tags.filter((t) => t.key === 'ai')).toHaveLength(1);
    expect(tags.find((t) => t.key === 'ai')!.count).toBe(3);
  });

  it('数据库挂掉时标签仍然可用', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getPublishedUserPosts.mockRejectedValue(new Error('down'));
    const tags = await getFeedTags();
    // 只剩文件文章：AI 出现 2 次、法律 1 次
    expect(tags.map((t) => [t.label, t.count])).toEqual([
      ['AI', 2],
      ['法律', 1],
    ]);
    spy.mockRestore();
  });
});

describe('getSectionCounts', () => {
  it('投稿计入所属分区', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    expect(await getSectionCounts()).toMatchObject({ debate: 2, tech: 1 });
  });
});

describe('getFeedPostsByTag / findFeedTag', () => {
  it('按标签取文章，跨来源', async () => {
    getPublishedUserPosts.mockResolvedValue([userPost()]);
    const posts = await getFeedPostsByTag('法律');
    expect(posts.map((p) => p.slug).sort()).toEqual(['AbC123', 'file-new']);
  });

  it('标签匹配忽略大小写与首尾空格', async () => {
    expect(await findFeedTag('  ai  ')).toMatchObject({ label: 'AI' });
    expect(await findFeedTag('不存在的标签')).toBeUndefined();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
