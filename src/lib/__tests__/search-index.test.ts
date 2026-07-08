import { describe, it, expect } from 'vitest';
import { buildIndex, searchEntries } from '../search-index';

describe('buildIndex', () => {
  const index = buildIndex();

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

  it('锚点条目带 hash 路由', () => {
    const faqAnchor = index.find(e => e.id === 'anchor-faq');
    expect(faqAnchor?.href).toBe('/#faq');
  });
});

describe('searchEntries', () => {
  it('空查询返回空', () => {
    expect(searchEntries('')).toEqual([]);
    expect(searchEntries('   ')).toEqual([]);
  });

  it('英文产品名前缀命中且排最前', () => {
    const results = searchEntries('omni');
    expect(results[0]?.title).toBe('OmniCrawl');
  });

  it('中文子串匹配可用', () => {
    const results = searchEntries('爬虫');
    expect(results.some(r => r.title === 'OmniCrawl')).toBe(true);
  });

  it('FAQ 答案文本可被搜到（非商业 FAQ，不受 SHOW_PRICING 开关影响）', () => {
    const results = searchEntries('技术支持');
    expect(results.some(r => r.group === '帮助')).toBe(true);
  });

  it('彩蛋命令可被发现', () => {
    const results = searchEntries('hug');
    const egg = results.find(r => r.group === '彩蛋');
    expect(egg?.href).toBe('/#terminal');
  });

  it('多词项 AND 语义：全部命中才返回', () => {
    const both = searchEntries('爬虫 框架');
    expect(both.some(r => r.title === 'OmniCrawl')).toBe(true);
    expect(searchEntries('爬虫 不存在的词xyz')).toEqual([]);
  });

  it('大小写不敏感', () => {
    expect(searchEntries('OMNI')[0]?.title).toBe('OmniCrawl');
  });

  it('结果数不超过 limit', () => {
    expect(searchEntries('工具', 3).length).toBeLessThanOrEqual(3);
  });
});
