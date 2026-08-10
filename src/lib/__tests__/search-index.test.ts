import { describe, it, expect } from 'vitest';
import { localizeHelpArticles } from '@/data/help-articles';
import { buildIndex, searchEntries } from '../search-index';

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

  it('FAQ 答案文本可被搜到（非商业 FAQ，不受 SHOW_PRICING 开关影响）', () => {
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
});
