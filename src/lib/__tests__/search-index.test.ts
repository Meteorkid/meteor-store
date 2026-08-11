import { describe, it, expect } from 'vitest';
import { localizeHelpArticles } from '@/data/help-articles';
import {
  buildIndex,
  searchEntries,
  searchEntriesWithBlogPosts,
  blogPostsToEntries,
  tryQuickMath,
  levenshtein,
  getBreadcrumb,
  type BlogPostSearchData,
} from '../search-index';

describe('buildIndex', () => {
  const index = buildIndex('zh');

  it('包含全部产品条目', () => {
    const productEntries = index.filter(e => e.group === '产品');
    expect(productEntries.length).toBeGreaterThanOrEqual(9);
    expect(productEntries.some(e => e.title === 'OmniCrawl')).toBe(true);
  });

  it('包含页面/帮助/彩蛋分组', () => {
    const groups = new Set(index.map(e => e.group));
    expect(groups.has('页面')).toBe(true);
    expect(groups.has('帮助')).toBe(true);
    expect(groups.has('彩蛋')).toBe(true);
  });

  it('将全部帮助文章索引到各自详情页', () => {
    const helpArticles = index.filter(e => e.id.startsWith('help-article-'));
    const visibleCount = localizeHelpArticles("zh").length;
    expect(helpArticles).toHaveLength(visibleCount);
    expect(helpArticles.every(e => e.group === '帮助')).toBe(true);
    expect(helpArticles.map(e => e.href)).toContain('/docs/macos-cannot-open-app');
  });

  it('帮助文章按当前语言建立索引', () => {
    const englishIndex = buildIndex('en');
    const english = englishIndex.find(e => e.id === 'help-article-macos-cannot-open-app');
    expect(english?.title).toMatch(/Mac|macOS/);
    expect(english?.href).toBe('/docs/macos-cannot-open-app');
    expect(englishIndex.find(e => e.id === 'page-docs')?.title).toBe('Help Center');
  });

  it('锚点条目带 hash 路由', () => {
    const faqAnchor = index.find(e => e.id === 'anchor-faq');
    expect(faqAnchor?.href).toBe('/#faq');
  });
});

describe('searchEntries', () => {
  it('空查询返回空', () => {
    expect(searchEntries('', 'zh')).toEqual([]);
    expect(searchEntries('   ', 'zh')).toEqual([]);
  });

  it('英文产品名前缀命中且排最前', () => {
    const results = searchEntries('omni', 'zh');
    expect(results[0]?.title).toBe('OmniCrawl');
  });

  it('中文子串匹配可用', () => {
    const results = searchEntries('爬虫', 'zh');
    expect(results.some(r => r.title === 'OmniCrawl')).toBe(true);
  });

  it('FAQ 答案文本可被搜到', () => {
    const results = searchEntries('技术支持', 'zh');
    expect(results.some(r => r.group === '帮助')).toBe(true);
  });

  it('用户问题可直达对应帮助文章', () => {
    const results = searchEntries('无法打开', 'zh');
    expect(results.some(r => r.href === '/docs/macos-cannot-open-app')).toBe(true);
  });

  it('彩蛋命令可被发现', () => {
    const results = searchEntries('hug', 'zh');
    const egg = results.find(r => r.group === '彩蛋');
    expect(egg?.href).toBe('/#terminal');
  });

  it('多词项 AND 语义：全部命中才返回', () => {
    const both = searchEntries('爬虫 框架', 'zh');
    expect(both.some(r => r.title === 'OmniCrawl')).toBe(true);
    expect(searchEntries('爬虫 不存在的词xyz', 'zh')).toEqual([]);
  });

  it('大小写不敏感', () => {
    expect(searchEntries('OMNI', 'zh')[0]?.title).toBe('OmniCrawl');
  });

  it('结果数不超过 limit', () => {
    expect(searchEntries('工具', 'zh', 3).length).toBeLessThanOrEqual(3);
  });

  it('小幅拼写错误可被模糊匹配兜底', () => {
    const results = searchEntries('omnicral', 'zh');
    expect(results.some(r => r.title === 'OmniCrawl')).toBe(true);
  });
});

describe('blogPostsToEntries', () => {
  it('将博客文章转为搜索条目', () => {
    const posts: BlogPostSearchData[] = [
      {
        title: 'React Server Components 深入解析',
        excerpt: '了解 RSC 的工作原理与最佳实践',
        href: '/blog/react-server-components',
        tags: ['React', '前端'],
      },
      {
        title: '我的第一篇博客',
        excerpt: '关于 Meteor Store 的诞生',
        href: '/blog/p/abc123',
        tags: ['随笔'],
      },
    ];

    const entries = blogPostsToEntries(posts);
    expect(entries).toHaveLength(2);
    expect(entries[0].group).toBe('博客');
    expect(entries[0].title).toBe('React Server Components 深入解析');
    expect(entries[0].href).toBe('/blog/react-server-components');
    expect(entries[0].keywords).toContain('react');
    expect(entries[0].keywords).toContain('前端');
    expect(entries[0].keywords).toContain('博客');
    expect(entries[1].href).toBe('/blog/p/abc123');
  });

  it('空数组返回空', () => {
    expect(blogPostsToEntries([])).toEqual([]);
  });
});

describe('searchEntriesWithBlogPosts', () => {
  const blogPosts: BlogPostSearchData[] = [
    { title: 'React Server Components 深入解析', excerpt: '了解 RSC', href: '/blog/rsc', tags: ['React', '前端'] },
    { title: '我的第一篇博客', excerpt: '关于 Meteor Store', href: '/blog/p/abc', tags: ['随笔'] },
  ];

  it('空查询返回空', () => {
    expect(searchEntriesWithBlogPosts('', 'zh', blogPosts)).toEqual([]);
  });

  it('可按标题搜到博客文章', () => {
    const results = searchEntriesWithBlogPosts('React', 'zh', blogPosts);
    expect(results.some(r => r.title === 'React Server Components 深入解析')).toBe(true);
    expect(results.some(r => r.group === '博客')).toBe(true);
  });

  it('可按标签搜到博客文章', () => {
    const results = searchEntriesWithBlogPosts('前端', 'zh', blogPosts);
    expect(results.some(r => r.title === 'React Server Components 深入解析')).toBe(true);
  });

  it('可按摘要内容搜到', () => {
    const results = searchEntriesWithBlogPosts('Meteor Store', 'zh', blogPosts);
    expect(results.some(r => r.title === '我的第一篇博客')).toBe(true);
  });

  it('博客文章与基础索引同时生效', () => {
    const results = searchEntriesWithBlogPosts('omni', 'zh', blogPosts);
    expect(results.some(r => r.title === 'OmniCrawl')).toBe(true);
  });

  it('多词项 AND 语义同样适用', () => {
    expect(searchEntriesWithBlogPosts('React 不存在', 'zh', blogPosts)).toEqual([]);
  });
});

describe('tryQuickMath', () => {
  it('计算加法', () => {
    expect(tryQuickMath('2+3')?.result).toBe('5');
  });

  it('计算乘法', () => {
    expect(tryQuickMath('39 * 12')?.result).toBe('468');
  });

  it('计算除法（保留精度）', () => {
    expect(tryQuickMath('100/3')?.result).toBe('33.3333333333');
  });

  it('纯数字不算', () => {
    expect(tryQuickMath('123')).toBeNull();
  });

  it('纯文字不算', () => {
    expect(tryQuickMath('hello')).toBeNull();
  });

  it('不安全表达式不算', () => {
    expect(tryQuickMath('alert(1)')).toBeNull();
  });

  it('幂运算', () => {
    expect(tryQuickMath('2^10')?.result).toBe('1024');
  });

  it('必须有运算符', () => {
    expect(tryQuickMath('3.14')).toBeNull();
  });
});

describe('levenshtein', () => {
  it('相同字符串距离为 0', () => {
    expect(levenshtein('hello', 'hello')).toBe(0);
  });

  it('单字符替换距离为 1', () => {
    expect(levenshtein('omnicrawl', 'omnicral')).toBe(1);
  });

  it('空字符串距离等于另一字符串长度', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });

  it('两个字符差异', () => {
    expect(levenshtein('kitten', 'sitten')).toBe(1);
    expect(levenshtein('kitten', 'sittin')).toBe(2);
  });
});

describe('getBreadcrumb', () => {
  it('产品条目返回产品面包屑', () => {
    const bc = getBreadcrumb({ group: '产品' } as any);
    expect(bc?.label).toBe('全部产品');
    expect(bc?.href).toBe('/products');
  });

  it('帮助条目返回帮助中心面包屑', () => {
    const bc = getBreadcrumb({ group: '帮助' } as any);
    expect(bc?.label).toBe('帮助中心');
    expect(bc?.href).toBe('/docs');
  });

  it('页面条目面包屑为空', () => {
    const bc = getBreadcrumb({ group: '页面' } as any);
    expect(bc?.label).toBe('');
  });

  it('博客条目返回博客面包屑', () => {
    const bc = getBreadcrumb({ group: '博客' } as any);
    expect(bc?.label).toBe('博客');
    expect(bc?.href).toBe('/blog');
  });
});
