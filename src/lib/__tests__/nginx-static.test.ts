import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * deploy/nginx.conf 会被 deploy-local.sh 原样 `cp` 到线上并 reload，
 * 但仓库里没有任何一步能跑 `nginx -t`（那需要装 nginx）。
 * 这里退而求其次，钉住几条**语义**约束——都是踩过或差点踩到的坑。
 */

const CONF = readFileSync(resolve(process.cwd(), 'deploy/nginx.conf'), 'utf8');

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
    for (const block of CONF.split(/(?=\n\s*location )/)) {
      if (!/^\s*location /m.test(block) || !block.includes('alias ')) continue;
      expect(block, 'alias + try_files 是 nginx 的已知路径拼接坑').not.toContain('try_files');
    }
  });

  it('同一个 location 不同时用 expires 和 add_header Cache-Control', () => {
    // 两者都会写 Cache-Control，同时出现就是两个同名响应头。
    for (const block of CONF.split(/(?=\n\s*location )/)) {
      if (!/^\s*location /m.test(block)) continue;
      const hasExpires = /^\s*expires\s/m.test(block);
      const hasCacheHeader = /add_header\s+Cache-Control/.test(block);
      expect(hasExpires && hasCacheHeader, `重复的 Cache-Control 头：\n${block.slice(0, 160)}`).toBe(false);
    }
  });

  it('try_files 的兜底目标 @app 确实存在', () => {
    expect(CONF).toContain('try_files $uri @app');
    expect(CONF).toMatch(/location\s+@app\s*\{/);
  });
});
