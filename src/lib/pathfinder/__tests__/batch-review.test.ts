import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routeSource = readFileSync(
  path.join(__dirname, '..', '..', '..', 'app', 'api', 'admin', 'pathfinder', 'route.ts'),
  'utf-8',
);
const uiSource = readFileSync(
  path.join(__dirname, '..', '..', '..', 'components', 'PathfinderAdminManager.tsx'),
  'utf-8',
);

const batchBranch = routeSource.slice(
  routeSource.indexOf("if (parsed.data.action === 'review-batch')"),
  routeSource.indexOf("if (parsed.data.action === 'archive')"),
);

describe('批量审核', () => {
  it('逐条走与单条审核相同的路径，不写成一条批量 UPDATE', () => {
    /*
     * 图省事直接一条 `update ... where id = any(...)` 的话：
     * 两个管理员同时点会重复处理（单条审核用的是条件更新防并发），
     * 而且审计里只剩一条「批量」记录，事后查不出具体动了哪些条目。
     */
    expect(batchBranch).toContain('for (const id of parsed.data.ids)');
    expect(batchBranch).toContain('reviewPathfinderItem(');
    expect(batchBranch).toContain('logAdminAction(');
  });

  it('部分失败要如实返回条数', () => {
    // 只报成功数的话，用户只看到「少了几条」而不知道为什么
    expect(batchBranch).toMatch(/failed/);
    expect(uiSource).toContain('result.failed > 0');
  });

  it('批量上限在接口与界面两侧一致', () => {
    // 锚定数组的上限，别匹配到每个 id 字符串的 .max(100)
    // 贪婪匹配到行末最后一个 .max()，即数组的上限（不是每个 id 字符串的 .max(100)）
    const apiLimit = Number(routeSource.match(/ids: z\.array\(.*\.max\((\d+)\),/)?.[1]);
    const uiLimit = Number(uiSource.match(/BATCH_LIMIT = (\d+)/)?.[1]);
    expect(apiLimit).toBe(uiLimit);
    // 上限存在的理由：请求要在网关超时前返回，且一次批太多会让人工确认走过场
    expect(apiLimit).toBeLessThanOrEqual(50);
  });

  it('批量发布要二次确认', () => {
    // 对外可见的动作，误点没有一键撤销
    const fn = uiSource.slice(uiSource.indexOf('async function approveVisible'));
    expect(fn).toContain('window.confirm');
  });

  it('批量不替人决定「进入学习路径」', () => {
    // 那是需要逐条判断的事，与「这条内容能不能公开」不是同一个问题
    const fn = uiSource.slice(uiSource.indexOf('async function approveVisible'));
    expect(fn).toMatch(/learningEligible:\s*false/);
  });
});

describe('待处理徽标', () => {
  const statsSource = readFileSync(
    path.join(__dirname, '..', '..', 'admin-stats.ts'),
    'utf-8',
  );
  const navSource = readFileSync(
    path.join(__dirname, '..', '..', '..', 'components', 'AdminNav.tsx'),
    'utf-8',
  );

  it('Pathfinder 的两类待办合成一个数', () => {
    // 分成两个徽标会让侧栏出现两个几乎总是同时亮起的红点，而入口是同一个页面
    expect(statsSource).toContain('pending_pathfinder');
    expect(statsSource).toMatch(/pathfinder_items WHERE status = 'pending'/);
    expect(statsSource).toMatch(/pathfinder_item_notes WHERE status = 'draft'/);
  });

  it('计数仍压在单条 SQL 里', () => {
    // 挂在 admin 布局上、每次进后台都要跑；Neon HTTP 下每个 count 都是一次往返
    const fn = statsSource.slice(statsSource.indexOf('export async function getAdminBadgeCounts'));
    expect(fn.match(/db\.execute\(/g)?.length).toBe(1);
  });

  it('徽标接到导航项上，也计入总数', () => {
    expect(navSource).toMatch(/'\/admin\/pathfinder'[^\n]*badge: counts\?\.pendingPathfinder/);
    expect(navSource).toContain('counts?.pendingPathfinder ?? 0');
  });
});
