#!/usr/bin/env node
/**
 * 对已入库的开源任务重新做一次「能不能上手」判定。
 *
 * 抓取阶段的判定（src/lib/pathfinder/ingestion/actionable.ts）只作用于新抓到的
 * 条目。存量条目是在收紧判据之前入库的，而判定需要的 `comments` / `updated_at`
 * 并没有存进数据库，只能回查 GitHub——**这需要 GITHUB_TOKEN**：未授权时
 * REST 配额只有 60 次/小时，几十条就打满了。
 *
 * 用法（默认 dry-run）：
 *   node --experimental-strip-types --env-file=.env.production scripts/recheck-pathfinder-issues.mjs
 *   node --experimental-strip-types --env-file=.env.production scripts/recheck-pathfinder-issues.mjs --apply
 *
 * `--apply` 把判定不通过的条目置为 archived（不是删除：可逆、保留记录，
 * 而且同步不会把 archived 复活，见 changedPathfinderStatus）。
 */
import { neon } from '@neondatabase/serverless';
import { notActionableReason } from '../src/lib/pathfinder/ingestion/actionable.ts';

const apply = process.argv.includes('--apply');
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) { console.error('缺少 DATABASE_URL'); process.exit(1); }
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('缺少 GITHUB_TOKEN：未授权配额只有 60 次/小时，不足以回查全部条目');
  process.exit(1);
}
const sql = neon(databaseUrl);

/** 从 issue 页面地址反推 REST 接口地址。 */
function apiUrlOf(canonicalUrl) {
  const m = canonicalUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  return m ? `https://api.github.com/repos/${m[1]}/${m[2]}/issues/${m[3]}` : null;
}

const rows = await sql`
  select id, canonical_url, title_en from pathfinder_items
  where item_type = 'open-source' and status = 'published'
  order by published_at asc
`;
console.log(`公开的开源条目 ${rows.length} 条，开始回查 GitHub…\n`);

const doomed = [];
let skipped = 0;
for (const row of rows) {
  const api = apiUrlOf(row.canonical_url);
  // 仓库入口（不是具体 issue）不适用这套判据，跳过
  if (!api) { skipped += 1; continue; }

  const response = await fetch(api, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Meteor-Pathfinder/1.0',
    },
  });
  if (!response.ok) {
    // 404 通常意味着 issue 被删或转移；保守起见不动它，只报出来
    console.log(`  ?  HTTP ${response.status}  ${(row.title_en ?? '').slice(0, 55)}`);
    continue;
  }
  const raw = await response.json();
  const reason = notActionableReason({
    createdAt: raw.created_at ?? null,
    updatedAt: raw.updated_at ?? null,
    comments: typeof raw.comments === 'number' ? raw.comments : 0,
    isPullRequest: raw.pull_request !== undefined,
    hasAssignee: Boolean(raw.assignee) || (Array.isArray(raw.assignees) && raw.assignees.length > 0),
  });
  // issue 已关闭同样不该再推荐
  const closed = raw.state === 'closed';
  const verdict = closed ? 'closed' : reason;
  if (verdict) {
    doomed.push({ id: row.id, title: row.title_en, verdict });
    console.log(`  ✗ [${verdict}] ${(row.title_en ?? '').slice(0, 55)}`);
  }
}

console.log(`\n回查完成：${rows.length} 条中 ${doomed.length} 条不再符合「可直接上手」，跳过 ${skipped} 条仓库入口`);
const byReason = new Map();
for (const d of doomed) byReason.set(d.verdict, (byReason.get(d.verdict) ?? 0) + 1);
console.log('原因分布:', [...byReason].map(([k, v]) => `${k}=${v}`).join('  ') || '无');

if (!apply) {
  console.log('\n[dry-run] 未写库。加 --apply 才会把这些条目置为 archived。');
  process.exit(0);
}
if (doomed.length === 0) process.exit(0);

const now = new Date().toISOString();
// 条件更新：只动仍是 published 的行，与同步任务并发时不会盖掉别的状态
const updated = await sql`
  update pathfinder_items set status = 'archived', reviewed_at = ${now}, updated_at = ${now}
  where id = any(${doomed.map((d) => d.id)}) and status = 'published'
  returning id
`;
console.log(`\n已归档 ${updated.length} 条`);
