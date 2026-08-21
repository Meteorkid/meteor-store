import { readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

// 只取 config，但模块顶层会 import next-intl/middleware——在 vitest 环境下解析失败，
// 与 proxy-nonce.test.ts 用同一份桩替掉。
vi.mock('next-intl/middleware', () => ({
  default: () => (request: NextRequest) =>
    NextResponse.next({ request: { headers: request.headers } }),
}));

import { config } from '@/proxy';

/**
 * proxy matcher 必须把 public/ 下的每一个静态文件排除在中间件之外。
 *
 * 漏掉一个的表现极其隐蔽：请求被 next-intl 重定向到 /zh/<原路径>，那里落到
 * catch-all 404，于是**返回一个 HTTP 200 的 HTML 页面**。浏览器把 HTML 当
 * 视频/模型/JSON 去解析，只报一个语焉不详的解码错误，根因完全看不出来。
 * mp4（chakra 特效视频）、glb（骨骼模型）、json（tollow 的 i18n 文案）
 * 都这样在生产静默坏过。
 *
 * 反方向同样要钉住：排除规则不能宽到误伤页面路由。博客标签是用户可自定义的，
 * `Three.js` 已经是现有文章的标签——一旦拿 `js` 后缀一刀切，那个标签页就会
 * 绕开中间件、连 CSP 头都发不出来。
 */

const PUBLIC_DIR = resolve(process.cwd(), 'public');

/** 把 Next 的 matcher 字符串编译成可直接测试的正则。 */
function compileMatcher(pattern: string): RegExp {
  return new RegExp(`^${pattern}$`);
}

/**
 * 列出 public/ 下每个文件对外的请求路径。
 *
 * 跳过 node_modules：那是本地工具（如 vite）留下的残留，被 .gitignore 挡在仓库外，
 * 永远不会部署，不该反过来要求 matcher 为它放行——放行了才是问题。
 */
function collectPublicPaths(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPublicPaths(full, found);
      continue;
    }
    found.push(`/${relative(PUBLIC_DIR, full).split(sep).join('/')}`);
  }
  return found;
}

describe('proxy matcher 的静态资源排除', () => {
  const matcher = compileMatcher(config.matcher[0]);

  it('public/ 下的每个文件都被排除在中间件之外', () => {
    const paths = collectPublicPaths(PUBLIC_DIR);
    expect(paths.length).toBeGreaterThan(0);

    // 同一种扩展名只报一个代表路径，避免 979 个 .txt 把失败信息淹掉
    const leakedByExt = new Map<string, string>();
    for (const path of paths) {
      if (!matcher.test(path)) continue;
      const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
      if (!leakedByExt.has(ext)) leakedByExt.set(ext, path);
    }

    expect(
      [...leakedByExt.values()],
      '以下静态文件会被 next-intl 重定向成 /zh/... 并返回 404 页的 HTML。' +
        '请补进 src/proxy.ts 的 matcher——或者确认这类文件本就不该放在 public/。',
    ).toEqual([]);
  });

  it('页面路由仍然经过中间件', () => {
    for (const path of ['/', '/zh', '/en/blog', '/zh/products/statux', '/zh/blog/p/6BnBgpSxIYY']) {
      expect(matcher.test(path), `${path} 应当交给 next-intl 处理`).toBe(true);
    }
  });

  it('含点的标签路由不被误当成静态资源', () => {
    // Three.js 是现有文章的真实标签；投稿人还能造出别的带点标签。
    // 这类路径必须继续走中间件，否则响应里不会有 CSP 头。
    for (const path of ['/zh/blog/tag/Three.js', '/en/blog/tag/Node.js', '/zh/blog/tag/Vue.js']) {
      expect(matcher.test(path), `${path} 应当交给 next-intl 处理`).toBe(true);
    }
  });
});
