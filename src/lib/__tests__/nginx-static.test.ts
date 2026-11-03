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

/** 抓出那条按后缀直发 public/ 的 location 的后缀名单。 */
function staticExtensions(): string[] {
  const match = /location\s+~\*\s+\^\/\.\+\\\.\(([^)]+)\)\$/.exec(CONF);
  if (!match) throw new Error('未找到 public/ 静态资源的 location 规则');
  return match[1].split('|');
}

describe('deploy/nginx.conf 的静态资源规则', () => {
  it('后缀名单里没有 js —— 否则 /blog/tag/Three.js 会被当成静态文件', () => {
    // 与 src/proxy.ts 的 matcher 同一个理由：标签是用户可自定义的，
    // Three.js 已经是现有文章的标签。public/ 里的脚本只有两个，按文件名单独处理。
    expect(staticExtensions()).not.toContain('js');
    expect(CONF).toMatch(/location\s+~\s+\^\/\(sw\\\.js\|/);
  });

  it('sw.js 那条规则排在通用后缀规则之前', () => {
    // 正则 location 按出现顺序匹配。写反了 sw.js 会被通用规则吃掉，
    // 拿到 1 天缓存——Service Worker 一旦被缓存住就没有补救手段了。
    const swRule = CONF.indexOf('location ~ ^/(sw\\.js');
    const genericRule = CONF.indexOf('location ~* ^/.+\\.(');
    expect(swRule).toBeGreaterThan(-1);
    expect(genericRule).toBeGreaterThan(-1);
    expect(swRule).toBeLessThan(genericRule);
  });

  it('sw.js 与它引用的文件不允许被长缓存', () => {
    const rule = CONF.slice(
      CONF.indexOf('location ~ ^/(sw\\.js'),
      CONF.indexOf('location ~* ^/.+\\.('),
    );
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
