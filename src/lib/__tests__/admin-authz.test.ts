import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 后台鉴权的覆盖约束。
 *
 * 管理端的权限散在两处：页面各自 `isAdminSession` + `notFound()`，接口各自
 * `isAdminSession` + 404。两处都是「写的时候记得加」，而漏掉既不报错、
 * 也不会有人报障——只会安静地敞着。所以把它钉成测试：
 *
 * 1. `/admin` 布局必须有一道兜底鉴权，这样新增的后台页即使忘了写检查也进不去；
 * 2. 每个后台页仍要自己检查一次（取数在渲染前，且 metadata 也要跟着权限走）；
 * 3. `/api/admin/**` 的**每一个**导出 handler 都要单独检查——
 *    整个文件里有一处 `isAdminSession` 不代表新加的那个 handler 也调了。
 */
const root = path.join(__dirname, '..', '..');
const adminPagesDir = path.join(root, 'app', '[locale]', 'admin');
const adminApiDir = path.join(root, 'app', 'api', 'admin');

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : pageFiles(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : routeFiles(full);
    return entry.name === 'route.ts' ? [full] : [];
  });
}

const pages = pageFiles(adminPagesDir);
const routes = routeFiles(adminApiDir);
const rel = (file: string) => path.relative(root, file);

describe('后台页面的鉴权', () => {
  it('扫描到了后台页面（防止扫描逻辑失效导致测试空跑）', () => {
    expect(pages.length).toBeGreaterThan(5);
  });

  it('/admin 布局有一道兜底鉴权', () => {
    const layout = readFileSync(path.join(adminPagesDir, 'layout.tsx'), 'utf-8');
    expect(layout).toMatch(/isAdminSession\(session\)/);
    expect(layout).toMatch(/notFound\(\)/);
  });

  it.each(pages.map(rel))('%s 自己也检查一次管理员身份', (file) => {
    const source = readFileSync(path.join(root, file), 'utf-8');
    expect(source, `${file} 没有调用 isAdminSession`).toMatch(/isAdminSession\(/);
    expect(source, `${file} 没有在无权限时 notFound()`).toMatch(/notFound\(\)/);
  });

  it.each(pages.map(rel))('%s 的标题也跟着权限走', (file) => {
    const source = readFileSync(path.join(root, file), 'utf-8');
    /*
     * 写成静态 metadata 的话，未授权访问者看到的是 404 页面，
     * 标题栏却写着「待审核」——等于告诉他这里有个后台。
     */
    expect(source, `${file} 应当用 generateMetadata 按权限给标题`)
      .toMatch(/export async function generateMetadata/);
  });
});

describe('后台接口的鉴权', () => {
  it('扫描到了后台接口', () => {
    expect(routes.length).toBeGreaterThan(5);
  });

  it.each(routes.map(rel))('%s 的每个 handler 都单独检查管理员身份', (file) => {
    const source = readFileSync(path.join(root, file), 'utf-8');
    const handlers = [...source.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)\b/g)];
    expect(handlers.length, `${file} 里没有导出任何 handler`).toBeGreaterThan(0);

    for (const [index, match] of handlers.entries()) {
      const start = match.index ?? 0;
      const end = handlers[index + 1]?.index ?? source.length;
      expect(
        source.slice(start, end),
        `${file} 的 ${match[1]} 没有调用 isAdminSession——整个文件里别处有不算数`,
      ).toMatch(/isAdminSession\(/);
    }
  });
});

describe('侧边导航', () => {
  const nav = readFileSync(path.join(root, 'components', 'AdminNav.tsx'), 'utf-8');

  it('是竖排侧栏而不是横向排列', () => {
    /*
     * 后台已经 13 个页面，横排要么换行把正文顶下去、要么横向滚动把后面几项藏起来。
     * 这条钉住「别改回 flex 横排」。
     */
    expect(nav).not.toMatch(/className="flex overflow-x-auto flex-wrap/);
    expect(nav).toMatch(/<nav\b[\s\S]*?className="hidden w-56 shrink-0 lg:block/);
  });

  it('账号管理在导航里', () => {
    expect(nav).toContain("'/admin/users'");
  });
});
