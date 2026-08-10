import { describe, expect, it } from 'vitest';
import { searchHelpEntries } from '../help-search';
import type { HelpSearchEntry } from '../help-search';

const sampleEntries: HelpSearchEntry[] = [
  {
    slug: 'start-here',
    category: 'getting-started',
    categoryOrder: 1,
    order: 1,
    commercial: false,
    title: '第一次使用 Meteor Store',
    excerpt: '了解网站功能和入门路径',
    keywords: '入门 导航',
    initials: 'dycsyMeteorStore',
    fullPinyin: 'diyicishiyongMeteorStore',
  },
  {
    slug: 'create-and-verify-account',
    category: 'account',
    categoryOrder: 2,
    order: 1,
    commercial: false,
    title: '如何注册账户并验证邮箱',
    excerpt: '完成账户注册和邮箱验证',
    keywords: '注册 邮箱 captcha',
    initials: 'rhzczhyzyx',
    fullPinyin: 'ruhezhucezhanghubingyanzhengyouxiang',
  },
  {
    slug: 'claim-free-product',
    category: 'products',
    categoryOrder: 3,
    order: 5,
    commercial: false,
    title: '如何免费获取产品',
    excerpt: '登录后免费入库产品',
    keywords: '免费 入库 claim',
    initials: 'rhmfhqcp',
    fullPinyin: 'ruhemianfeihuoquchanpin',
  },
];

describe('帮助搜索', () => {
  it('标题精确匹配返回最高分', () => {
    const results = searchHelpEntries(sampleEntries, '注册');
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe('create-and-verify-account');
  });

  it('标题包含匹配', () => {
    const results = searchHelpEntries(sampleEntries, 'Meteor');
    expect(results.map((r) => r.slug)).toContain('start-here');
  });

  it('多词 AND 匹配', () => {
    const results = searchHelpEntries(sampleEntries, '注册 邮箱');
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe('create-and-verify-account');
  });

  it('多词部分命中返回空', () => {
    const results = searchHelpEntries(sampleEntries, '注册 不存在');
    expect(results).toHaveLength(0);
  });

  it('拼音首字母匹配', () => {
    const results = searchHelpEntries(sampleEntries, 'rhzc');
    expect(results.map((r) => r.slug)).toContain('create-and-verify-account');
  });

  it('全拼匹配', () => {
    const results = searchHelpEntries(sampleEntries, 'zhuce');
    expect(results.map((r) => r.slug)).toContain('create-and-verify-account');
  });

  it('摘要匹配', () => {
    const results = searchHelpEntries(sampleEntries, 'captcha');
    expect(results.map((r) => r.slug)).toContain('create-and-verify-account');
  });

  it('关键词匹配', () => {
    const results = searchHelpEntries(sampleEntries, '入库');
    expect(results.map((r) => r.slug)).toContain('claim-free-product');
  });

  it('无匹配返回空数组', () => {
    const results = searchHelpEntries(sampleEntries, '不存在的内容');
    expect(results).toEqual([]);
  });

  it('空查询返回空数组', () => {
    const results = searchHelpEntries(sampleEntries, '');
    expect(results).toEqual([]);
  });

  it('纯空格查询返回空数组', () => {
    const results = searchHelpEntries(sampleEntries, '   ');
    expect(results).toEqual([]);
  });
});
