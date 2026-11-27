import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildAlternateUrls, buildOpenGraphMetadata } from '../seo';
import { SITE_URL } from '../constants';

describe('buildAlternateUrls', () => {
  it('首页给出 canonical 与两种语言', () => {
    expect(buildAlternateUrls('/zh')).toEqual({
      canonical: `${SITE_URL}/zh`,
      languages: {
        zh: `${SITE_URL}/zh`,
        en: `${SITE_URL}/en`,
        xDefault: `${SITE_URL}/zh`,
      },
    });
  });

  it('深层路径保留后缀并只替换 locale 段', () => {
    const result = buildAlternateUrls('/en/products/statux');
    expect(result?.canonical).toBe(`${SITE_URL}/en/products/statux`);
    expect(result?.languages?.zh).toBe(`${SITE_URL}/zh/products/statux`);
    expect(result?.languages?.en).toBe(`${SITE_URL}/en/products/statux`);
  });

  it.each(['/en/blog/p/post-1', '/zh/blog/tag/Chinese', '/en/blog/tag/Three.js/'])('内容路由%s由页面决定真实语言候选', pathname => {
    const result = buildAlternateUrls(pathname);
    expect(result?.canonical).toBe(`${SITE_URL}${pathname.replace(/\/+$/, '')}`);
    expect(result?.languages).toBeNull();
  });

  it.each(['/en/blog/tags', '/zh/blog/section/tech', '/en/blog/tag/example/extra'])('仅排除确切内容路由，不改变%s', pathname => {
    expect(buildAlternateUrls(pathname)?.languages).not.toBeNull();
  });

  it('x-default 始终指向默认语言 zh', () => {
    expect(buildAlternateUrls('/en/blog')?.languages?.xDefault).toBe(`${SITE_URL}/zh/blog`);
  });

  it('末尾斜杠归一，避免 /zh/blog 与 /zh/blog/ 各自成为一份重复内容', () => {
    expect(buildAlternateUrls('/zh/blog/')?.canonical).toBe(`${SITE_URL}/zh/blog`);
    expect(buildAlternateUrls('/zh/blog//')?.canonical).toBe(`${SITE_URL}/zh/blog`);
  });

  it('认不出 locale 前缀时返回 null——宁可没有 canonical 也不要指错', () => {
    expect(buildAlternateUrls('/')).toBeNull();
    expect(buildAlternateUrls('/fr/blog')).toBeNull();
    expect(buildAlternateUrls('')).toBeNull();
    expect(buildAlternateUrls(null)).toBeNull();
    // 相对路径进不来，但真进来了也不能拼出个看起来像模像样的错地址
    expect(buildAlternateUrls('zh/blog')).toBeNull();
  });

  it('canonical 一律钉在 www 上：换主机名要连 nginx 的 301 一起改', () => {
    expect(SITE_URL).toBe('https://www.imagentx.top');
    const nginxConf = readFileSync(join(process.cwd(), 'deploy/nginx.conf'), 'utf8');
    // 非 www 必须 301 到 www，否则 canonical 指向的地址与实际可访问的地址各说各话
    expect(nginxConf).toMatch(/return\s+301\s+https:\/\/www\.imagentx\.top\$request_uri/);
    expect(nginxConf).toMatch(/server_name\s+imagentx\.top;/);
  });
});

describe('canonical 的下发位置', () => {
  it('普通页面由布局输出canonical，内容路由交给页面且不叠加两份', () => {
    const layout = readFileSync(
      join(process.cwd(), 'src/app/[locale]/layout.tsx'),
      'utf8',
    );
    expect(layout).toContain('<RouteAlternateLinks initialPathname={requestHeaders.get("x-pathname")} />');
    const links = readFileSync(join(process.cwd(), 'src/components/RouteAlternateLinks.tsx'), 'utf8');
    expect(links).toContain('rel="canonical"');
    expect(links).toContain('hrefLang="x-default"');
    expect(links).toContain('if (!alternates?.languages) return null');
  });
});

describe('buildOpenGraphMetadata', () => {
  it('产品页带自己的标题、描述、canonical 与相对封面', () => {
    const result = buildOpenGraphMetadata({
      title: 'XIsland - 面向 AI 的 macOS 灵动岛',
      description: '为所有 AI 编码代理打造的 macOS 灵动岛风格控制塔。',
      path: '/zh/products/xisland',
      locale: 'zh',
      image: '/products/xisland/cover-v2.webp',
    });
    expect(result.openGraph?.title).toBe('XIsland - 面向 AI 的 macOS 灵动岛');
    expect(result.openGraph?.url).toBe(`${SITE_URL}/zh/products/xisland`);
    expect(result.openGraph?.images).toEqual([expect.objectContaining({ url: `${SITE_URL}/products/xisland/cover-v2.webp` })]);
    expect(result.twitter?.title).toBe('XIsland - 面向 AI 的 macOS 灵动岛');
    expect(result.twitter?.images).toEqual([`${SITE_URL}/products/xisland/cover-v2.webp`]);
  });

  it('文章页使用 article 类型与英文 locale，缺省回落到站点分享图', () => {
    const result = buildOpenGraphMetadata({
      title: 'Post title',
      description: 'Post excerpt',
      path: '/en/blog/p/abc',
      locale: 'en',
      type: 'article',
      publishedTime: '2026-01-02T03:04:05.000Z',
      modifiedTime: '2026-02-03T04:05:06.000Z',
      authors: ['Meteor'],
    });
    expect(result.openGraph).toEqual(expect.objectContaining({
      type: 'article',
      locale: 'en_US',
      url: `${SITE_URL}/en/blog/p/abc`,
      publishedTime: '2026-01-02T03:04:05.000Z',
      modifiedTime: '2026-02-03T04:05:06.000Z',
      authors: ['Meteor'],
    }));
    expect(result.openGraph?.images).toEqual([expect.objectContaining({ url: `${SITE_URL}/og-image.png` })]);
  });
});
