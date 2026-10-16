import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getHeaderNavigation, isHeaderLinkActive } from '../header-navigation';
import { blogSections } from '../blog-sections';
import { productLineIds } from '../product-tracks';
import { dailyEditionChannels } from '@/lib/daily/channels';

function links(showPricing = true) {
  return getHeaderNavigation(showPricing).flatMap(group => [group.overview, ...group.sections.flatMap(section => section.links)]);
}

describe('全站二级导航', () => {
  it('保留五个清晰分组，每组包含总览和两到三列', () => {
    const groups = getHeaderNavigation(true);
    expect(groups.map(group => group.id)).toEqual(['products', 'daily', 'learn', 'content', 'help']);
    expect(links().length).toBeLessThanOrEqual(40);
    for (const group of groups) {
      expect(group.sections.length).toBeGreaterThanOrEqual(2);
      expect(group.sections.length).toBeLessThanOrEqual(3);
      expect(group.overview.href).toMatch(/^\//);
      const groupLinks = [group.overview, ...group.sections.flatMap(section => section.links)];
      expect(new Set(groupLinks.map(link => link.id)).size).toBe(groupLinks.length);
      expect(new Set(groupLinks.map(link => link.href)).size).toBe(groupLinks.length);
      for (const link of groupLinks) {
        expect(link.label.zh.trim()).not.toBe('');
        expect(link.label.en.trim()).not.toBe('');
      }
    }
  });

  it('主线五款可直达，实验室使用现有锚点，定价遵循开关', () => {
    const hrefs = links().map(link => link.href);
    for (const id of productLineIds) expect(hrefs).toContain(`/products/${id}`);
    expect(hrefs).toContain('/products#lab');
    expect(hrefs).not.toContain('/lab');
    expect(hrefs).toContain('/pricing');
    expect(links(false).map(link => link.href)).not.toContain('/pricing');
  });

  it('日刊从现有栏目生成完整深链，不受个人关注设置影响', () => {
    const daily = getHeaderNavigation(false).find(group => group.id === 'daily')!;
    const channelLinks = daily.sections.flatMap(section => section.links);
    expect(channelLinks.map(link => link.href)).toEqual(dailyEditionChannels.map(channel => `/daily?view=all#${channel.id}`));
    expect(channelLinks.map(link => link.label.zh)).toEqual(dailyEditionChannels.map(channel => channel.zh));
    expect(links().map(link => link.href)).toContain('/masters');
  });

  it('内容分区跟随唯一配置，不手写第二套分区', () => {
    const hrefs = links().map(link => link.href);
    expect(hrefs.filter(href => href.startsWith('/blog/section/'))).toEqual(blogSections.map(section => `/blog/section/${section.slug}`));
  });

  it('每个菜单目标都有实际页面，实验室锚点没有漂移', () => {
    const pages = path.join(__dirname, '..', '..', 'app', '[locale]');
    for (const link of links()) {
      const pathname = new URL(link.href, 'https://example.com').pathname;
      const route = pathname.replace(/^\/products\/[^/]+$/, '/products/[id]')
        .replace(/^\/blog\/section\/[^/]+$/, '/blog/section/[section]')
        .replace(/^\/pathfinder\/directions\/[^/]+$/, '/pathfinder/directions/[slug]');
      expect(existsSync(path.join(pages, route, 'page.tsx')), `导航指向不存在的页面 ${link.href}`).toBe(true);
    }
    expect(readFileSync(path.join(pages, 'products', 'page.tsx'), 'utf8')).toContain('id="lab"');
  });

  it('导航只依赖浏览器安全的轻量配置', () => {
    const source = readFileSync(path.join(__dirname, '..', 'header-navigation.ts'), 'utf8');
    const channels = readFileSync(path.join(__dirname, '..', '..', 'lib', 'daily', 'channels.ts'), 'utf8');
    expect(source).not.toMatch(/from ['"][^'"]*(?:\/products|daily\/types|\/db|server)['"]/);
    expect(channels).not.toMatch(/\bimport\b|\bzod\b|\bprocess\.env\b/);
  });
});

describe('导航当前页', () => {
  it('只匹配准确路径，避免总览和详情同时标为当前页', () => {
    expect(isHeaderLinkActive('/products', '/products')).toBe(true);
    expect(isHeaderLinkActive('/products', '/products/xisland')).toBe(false);
    expect(isHeaderLinkActive('/products/xisland', '/products/xisland')).toBe(true);
    expect(isHeaderLinkActive('/', '/')).toBe(true);
    expect(isHeaderLinkActive('/', '/daily')).toBe(false);
  });

  it('仅凭 pathname 不标记锚点或查询链接', () => {
    expect(isHeaderLinkActive('/daily?view=all#english', '/daily')).toBe(false);
    expect(isHeaderLinkActive('/products#lab', '/products')).toBe(false);
    expect(isHeaderLinkActive('/masters?year=2027', '/masters')).toBe(false);
  });
});
