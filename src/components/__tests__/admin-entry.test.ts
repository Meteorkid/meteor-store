import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 后台入口的可达性约束。
 *
 * 这组测试是补一次真实问题：后台从 2 个页面长到 12 个，而桌面端用户菜单里
 * 始终只有当年那两条深链接（`/admin/review`、`/admin/invite-codes`），
 * 且没有任何一条通往总入口——管理员在桌面端只能手输网址才能进后台。
 *
 * 入口是最容易悄悄过期的东西：加页面的人不会想到去改菜单，而少一个入口
 * 既不报错也不会有人报障，只是用不上。所以这里钉三件事：
 * 每个后台页都能从后台导航到达、账号区有通往总入口的链接、
 * 菜单里不再散落会过期的深链接。
 */
const root = path.join(__dirname, '..', '..');
const adminDir = path.join(root, 'app', '[locale]', 'admin');

const adminNav = readFileSync(path.join(root, 'components', 'AdminNav.tsx'), 'utf-8');
const userMenu = readFileSync(path.join(root, 'components', 'UserMenu.tsx'), 'utf-8');
const header = readFileSync(path.join(root, 'components', 'Header.tsx'), 'utf-8');
const accountPage = readFileSync(
  path.join(root, 'app', '[locale]', 'account', 'page.tsx'),
  'utf-8',
);

/** 枚举实际存在的后台页面路由，而不是维护一份手写清单。 */
function adminRoutes(): string[] {
  return readdirSync(adminDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/admin/${entry.name}`)
    .sort();
}

describe('后台导航覆盖所有后台页面', () => {
  it('每个 /admin/* 页面都能从 AdminNav 到达', () => {
    for (const route of adminRoutes()) {
      // 漏掉的页面不会报错，只是永远没人点得到
      expect(adminNav, `${route} 不在 AdminNav 里，管理员无法从后台导航到达`)
        .toContain(`'${route}'`);
    }
  });

  it('AdminNav 里不含已经不存在的页面', () => {
    const existing = new Set([...adminRoutes(), '/admin']);
    const linked = [...adminNav.matchAll(/href: '(\/admin[^']*)'/g)].map((m) => m[1]);
    for (const href of linked) {
      expect(existing, `AdminNav 指向了不存在的页面 ${href}`).toContain(href);
    }
  });
});

describe('账号区能进入后台', () => {
  it('用户菜单为管理员提供通往后台总入口的链接', () => {
    expect(userMenu).toMatch(/user\.isAdmin[\s\S]{0,300}href="\/admin"/);
  });

  it('移动端菜单同样有总入口', () => {
    expect(header).toMatch(/user\.isAdmin[\s\S]{0,300}href="\/admin"/);
  });

  it('账号页的快捷入口里有后台，且按管理员身份门控', () => {
    expect(accountPage).toContain('isAdminSession');
    expect(accountPage).toMatch(/isAdmin \?[\s\S]{0,200}href: '\/admin'/);
  });

  it('用户菜单不再散落具体后台页的深链接', () => {
    /*
     * 深链接清单必然与后台页面漂移——原来那两条就是这么过期的。
     * 总入口页自带完整导航，新增后台页不需要回来改菜单。
     */
    const deepLinks = [...userMenu.matchAll(/href="(\/admin\/[^"]+)"/g)].map((m) => m[1]);
    expect(deepLinks, `用户菜单里出现了会过期的深链接：${deepLinks.join(', ')}`).toEqual([]);
  });
});
