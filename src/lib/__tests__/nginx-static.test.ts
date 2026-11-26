import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * deploy/nginx.conf 会被 deploy-local.sh 原样 `cp` 到线上并 reload，
 * 但仓库里没有任何一步能跑 `nginx -t`（那需要装 nginx）。
 * 这里退而求其次，钉住几条**语义**约束——都是踩过或差点踩到的坑。
 */

const CONF = readFileSync(resolve(process.cwd(), 'deploy/nginx.conf'), 'utf8');

/** 配对花括号，避免把相邻 server 的注释或嵌套 types 块算进另一个 location。 */
function configBlocks(source: string, directive: 'server' | 'location') {
  const clean = source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*/g,
    (token) => token.startsWith('#') ? '' : token);
  const starts = new RegExp(`^[ \\t]*${directive}\\b[^\\n{]*\\{`, 'gm');
  return Array.from(clean.matchAll(starts), (match) => {
    const start = match.index + match[0].length;
    const tokens = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[{}]/g;
    tokens.lastIndex = start;
    let depth = 1;
    for (let token = tokens.exec(clean); token; token = tokens.exec(clean)) {
      if (token[0] === '{') depth++;
      if (token[0] === '}') depth--;
      if (depth === 0) {
        return {
          header: match[0].trim().slice(0, -1).trim(),
          body: clean.slice(start, token.index),
          text: clean.slice(match.index, tokens.lastIndex),
        };
      }
    }
    throw new Error(`配置块缺少结束括号：${match[0].trim()}`);
  });
}

function aliasConflicts(source: string) {
  return configBlocks(source, 'location').filter(({ body }) =>
    /(?:^|[;{}])\s*alias\s/.test(body) && /(?:^|[;{}])\s*try_files\s/.test(body));
}

/**
 * 抓出所有「按后缀直发 public/」的 location 的后缀名单。
 *
 * 现在有两条：重资源（glb/wasm/mp4…）与通用（png/css/txt…）。
 * 不能只取第一条——那会静默变成只检查重资源规则，
 * 通用规则里的 `js` 一旦被加回来就没人拦了。
 */
function allStaticExtensionLists(): string[][] {
  return Array.from(CONF.matchAll(/location\s+~\*\s+\^\/\.\+\\\.\(([^)]+)\)\$/g),
    (match) => match[1].split('|'));
}

/** 通用规则（图片/样式/文本）的后缀名单：不含大体积二进制的那一条。 */
function genericExtensions(): string[] {
  const lists = allStaticExtensionLists();
  const generic = lists.find((list) => list.includes('png'));
  if (!generic) throw new Error('未找到 public/ 通用静态资源的 location 规则');
  return generic;
}

/** 重资源规则（大体积二进制）的后缀名单。 */
function heavyExtensions(): string[] {
  const lists = allStaticExtensionLists();
  const heavy = lists.find((list) => list.includes('glb'));
  if (!heavy) throw new Error('未找到重资源（大体积二进制）的 location 规则');
  return heavy;
}

/**
 * 取某个 location 的**去注释**配置体。
 *
 * 不能直接用 `CONF.slice(indexOf(...), indexOf(...))` 做字符串断言——
 * 本项目习惯在注释里解释「为什么不加 valid_referers」，那些注释会让
 * `not.toContain('valid_referers')` 假失败、也会让 `toContain` 假通过。
 */
function locationBody(headerStartsWith: string): string {
  const block = configBlocks(CONF, 'location')
    .find(({ header }) => header.startsWith(headerStartsWith));
  if (!block) throw new Error(`未找到 location 规则：${headerStartsWith}`);
  return block.body;
}

describe('deploy/nginx.conf 的静态资源规则', () => {
  it('后缀名单里没有 js —— 否则 /blog/tag/Three.js 会被当成静态文件', () => {
    // 与 src/proxy.ts 的 matcher 同一个理由：标签是用户可自定义的，
    // Three.js 已经是现有文章的标签。public/ 里的脚本只有两个，按文件名单独处理。
    // **两条规则的名单都要查**：新增重资源规则时最容易顺手把 js 加进去。
    for (const list of allStaticExtensionLists()) {
      expect(list).not.toContain('js');
    }
    expect(CONF).toMatch(/location\s+~\s+\^\/\(sw\\\.js\|/);
  });

  it('重资源规则不收录 .data / .binarypb —— 只由 mediapipe 目录单独兜住', () => {
    // 这两个后缀一旦放开到全站，与「用户自定义博客标签」撞车的风险远大于收益。
    expect(heavyExtensions()).not.toContain('data');
    expect(heavyExtensions()).not.toContain('binarypb');
    // 而 mediapipe 那条 `^~` 规则必须自己带上防护——它绕过所有正则 location。
    const mediapipe = locationBody('location ^~ /vendor/mediapipe/');
    expect(mediapipe).toContain('valid_referers');
    expect(mediapipe).toContain('limit_conn');
  });

  it('sw.js 那条规则排在所有后缀规则之前', () => {
    // 正则 location 按出现顺序匹配。写反了 sw.js 会被通用规则吃掉，
    // 拿到 1 天缓存——Service Worker 一旦被缓存住就没有补救手段了。
    const swRule = CONF.indexOf('location ~ ^/(sw\\.js');
    expect(swRule).toBeGreaterThan(-1);
    for (const match of CONF.matchAll(/location\s+~\*\s+\^\/\.\+\\\.\(/g)) {
      expect(swRule).toBeLessThan(match.index!);
    }
  });

  it('重资源规则排在通用规则之前 —— 否则 limit_conn / valid_referers 全部失效', () => {
    const heavy = CONF.indexOf('location ~* ^/.+\\.(glb');
    const generic = CONF.indexOf('location ~* ^/.+\\.(png');
    expect(heavy).toBeGreaterThan(-1);
    expect(generic).toBeGreaterThan(-1);
    expect(heavy).toBeLessThan(generic);
  });

  it('重资源规则带防盗链与限速，且允许无 Referer 的爬虫', () => {
    const heavy = locationBody('location ~* ^/.+\\.(glb');
    expect(heavy).toContain('valid_referers');
    expect(heavy).toContain('limit_conn');
    expect(heavy).toContain('limit_rate');
    // `none` 不能少：搜索引擎与 AI 爬虫抓取时不带 Referer，
    // 挡住它们等于自断收录与 AI 可见性。DMG 下载也全是无 Referer 的直连。
    expect(heavy).toMatch(/valid_referers\s+none\b/);
    // server_names 让本站域名自动进白名单，省得手写 www/非 www 两种形态。
    expect(heavy).toContain('server_names');
  });

  it('防盗链的 403 不写进缓存头 —— 否则被误伤的用户整天打不开', () => {
    // Cache-Control 带 always 时 nginx 会给 4xx/5xx 也加上这个头，
    // 浏览器与中间缓存会把 403 记住一整天。
    const heavy = locationBody('location ~* ^/.+\\.(glb');
    expect(heavy).toMatch(/add_header\s+Cache-Control\s+"[^"]+"\s*;/);
    expect(heavy).not.toMatch(/add_header\s+Cache-Control\s+"[^"]+"\s+always\s*;/);
  });

  it('限速 zone 在 server 块之前声明 —— limit_conn_zone 只允许 http 上下文', () => {
    // 本文件被 nginx.conf 的 include 放进 http 块，所以写在 server 前才合法。
    const zone = CONF.indexOf('limit_conn_zone');
    const firstServer = CONF.indexOf('server {');
    expect(zone).toBeGreaterThan(-1);
    expect(firstServer).toBeGreaterThan(-1);
    expect(zone).toBeLessThan(firstServer);
  });

  it('图片不参与防盗链 —— og-image.png 要被社交平台以外域 Referer 抓取', () => {
    // 对图片加防盗链会让微信/Twitter 的分享卡片直接裂图。
    const generic = locationBody('location ~* ^/.+\\.(png');
    expect(generic).not.toContain('valid_referers');
  });

  it('DMG 下载目录不设防盗链 —— 用户会把直链贴到任何地方', () => {
    // 安装包没有「热链盗用」场景，加防盗链收益极小、误伤面很大。
    const downloads = locationBody('location ^~ /downloads/ex-memory/');
    expect(downloads).not.toContain('valid_referers');
    // 但带宽与并发限制要在。
    expect(downloads).toContain('limit_conn');
    expect(downloads).toContain('limit_rate');
  });

  it('sw.js 与它引用的文件不允许被长缓存', () => {
    // 取到**第一条**后缀规则为止。重资源规则（glb）现在排在最前，
    // 但无论先出现哪一条，这段区间都必须只覆盖 sw.js 那条规则。
    const nextRegexRule = /location\s+~\*\s+\^\/\.\+\\\.\(/g;
    nextRegexRule.lastIndex = CONF.indexOf('location ~ ^/(sw\\.js');
    const end = nextRegexRule.exec(CONF)!.index;
    const rule = CONF.slice(CONF.indexOf('location ~ ^/(sw\\.js'), end);
    expect(rule).toContain('max-age=0');
    expect(rule).toContain('must-revalidate');
  });

  it('alias 的 location 里不写 try_files —— 两者同用时 nginx 会算错路径', () => {
    expect(aliasConflicts(CONF), 'alias + try_files 是 nginx 的已知路径拼接坑').toEqual([]);
  });

  it('alias 检查忽略跨块注释，仍能识别嵌套块之后的真实冲突', () => {
    const conflicts = aliasConflicts(`
server {
    location /challenge/ { root /acme; try_files $uri =404; }
}
# alias 与 try_files 不应同用；注释中的 { 不应影响配对。
server {
    location /static/ { alias /static/; }
    location /broken/ {
        alias /downloads/;
        types { application/json json; }
        try_files $uri =404;
    }
}
`);
    expect(conflicts.map(({ header }) => header)).toEqual(['location /broken/']);
  });

  it('同一个 location 不同时用 expires 和 add_header Cache-Control', () => {
    // 两者都会写 Cache-Control，同时出现就是两个同名响应头。
    for (const { body } of configBlocks(CONF, 'location')) {
      const hasExpires = /^\s*expires\s/m.test(body);
      const hasCacheHeader = /^\s*add_header\s+Cache-Control\s/m.test(body);
      expect(hasExpires && hasCacheHeader, `重复的 Cache-Control 头：\n${body.slice(0, 160)}`).toBe(false);
    }
  });

  it('try_files 的兜底目标 @app 确实存在', () => {
    expect(CONF).toContain('try_files $uri @app');
    expect(CONF).toMatch(/location\s+@app\s*\{/);
  });
});

describe('deploy/nginx.conf 的证书续期规则', () => {
  it('HTTP 双域名直出 ACME webroot，只有普通路径跳到 www HTTPS', () => {
    const httpServers = configBlocks(CONF, 'server')
      .filter(({ body }) => /^\s*listen\s+80\s*;/m.test(body));
    expect(httpServers).toHaveLength(1);
    const { body } = httpServers[0];
    const names = /^\s*server_name\s+([^;]+);/m.exec(body)?.[1].trim().split(/\s+/);
    expect(names).toEqual(expect.arrayContaining(['www.imagentx.top', 'imagentx.top']));

    const locations = configBlocks(body, 'location');
    const challenge = locations.find(({ header }) => header === 'location ^~ /.well-known/acme-challenge/');
    expect(challenge?.body).toMatch(/^\s*root\s+\/var\/lib\/meteor-store-acme\s*;/m);
    expect(challenge?.body).toMatch(/^\s*try_files\s+\$uri\s+=404\s*;/m);
    expect(challenge?.body).not.toMatch(/(?:^|[;{}])\s*return\s/);

    const serverDirectives = locations.reduce((text, location) => text.replace(location.text, ''), body);
    expect(serverDirectives, 'server 级 return 会先于 ACME location 执行').not.toMatch(/(?:^|[;{}])\s*return\s/);
    const redirect = locations.find(({ header }) => header === 'location /');
    expect(redirect?.body).toMatch(/^\s*return\s+301\s+https:\/\/www\.imagentx\.top\$request_uri\s*;/m);
  });
});
