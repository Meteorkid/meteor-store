import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildAlternateUrls } from '../seo';
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
    expect(result?.languages.zh).toBe(`${SITE_URL}/zh/products/statux`);
    expect(result?.languages.en).toBe(`${SITE_URL}/en/products/statux`);
  });

  it('x-default 始终指向默认语言 zh', () => {
    expect(buildAlternateUrls('/en/blog')?.languages.xDefault).toBe(`${SITE_URL}/zh/blog`);
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
  it('只有 [locale]/layout.tsx 输出 canonical，页面不得自己再声明一份', () => {
    // 页面级 alternates 会整个顶掉布局层的（Next 的 metadata 是浅合并），
    // 于是任何一个页面声明 alternates.canonical 都意味着这条规则出现了两个来源。
    // 这条测试钉住「只有一处」，避免将来两处规则漂移后搜索引擎两条都忽略。
    const layout = readFileSync(
      join(process.cwd(), 'src/app/[locale]/layout.tsx'),
      'utf8',
    );
    expect(layout).toContain('rel="canonical"');
    expect(layout).toContain('hrefLang="x-default"');
  });
});
