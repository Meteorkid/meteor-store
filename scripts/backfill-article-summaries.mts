#!/usr/bin/env node
/**
 * 给缺摘要的条目补上正文首段。
 *
 * 抓取管线只对**新增条目**拉文章页（见 sync.ts 的 applyArticleSummaries），
 * 存量条目要靠这个脚本补。起因是 Hugging Face 的镜像 feed 只给
 * guid/link/pubDate/title，那 26 条在站内没有摘要、也生成不了解读。
 *
 * 用法（默认 dry-run，只抓不写库）：
 *   pnpm exec tsx scripts/backfill-article-summaries.mts
 *   pnpm exec tsx scripts/backfill-article-summaries.mts --apply
 *
 * 用 tsx 而不是 node --experimental-strip-types：后者解析不了无扩展名的传递
 * 依赖（article-summary.ts 引了 ./fetch-source）。DATABASE_URL 从 .env.local 读。
 * 可以重复跑：只挑仍然缺摘要的条目。
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
import { fetchArticleSummary } from '../src/lib/pathfinder/ingestion/article-summary';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../src/lib/pathfinder/ingestion/sources';

const apply = process.argv.includes('--apply');
/**
 * 连接串来源：环境变量 → .env.production → .env.local。
 *
 * 在服务器上跑时用 .env.production（生产是自建 PostgreSQL），本地开发用
 * .env.local。**别只认 .env.local**——生产早已从 Neon 迁到自建库，
 * 只读本地文件会把写操作发到已经废弃的那个库去。
 */
function readEnvFile(file: string): string | undefined {
  try {
    return readFileSync(file, 'utf8').match(/^DATABASE_URL=(.*)$/m)?.[1]
      ?.trim().replace(/^["']|["']$/g, '');
  } catch {
    return undefined;
  }
}
const databaseUrl = process.env.DATABASE_URL
  ?? readEnvFile('.env.production')
  ?? readEnvFile('.env.local');
if (!databaseUrl) {
  console.error('缺少 DATABASE_URL');
  process.exit(1);
}
const sql = neon(databaseUrl);

const rows = await sql`
  select id, source_id, canonical_url, title_en
  from pathfinder_items
  where status = 'published'
    and coalesce(nullif(trim(summary_zh), ''), nullif(trim(summary_en), '')) is null
  order by source_id, published_at desc
`;

// 只处理来源显式开启了 articleSummary 的条目
const targets = rows.filter((r) => PATHFINDER_SYNC_SOURCE_MAP.get(r.source_id)?.articleSummary);
const skipped = rows.length - targets.length;
console.log(`缺摘要的已发布条目 ${rows.length} 条，其中来源支持正文提取的 ${targets.length} 条`);
if (skipped > 0) console.log(`  （另有 ${skipped} 条的来源未开启 articleSummary，跳过）`);
if (targets.length === 0) process.exit(0);

let got = 0;
const results = [];
for (const row of targets) {
  const source = PATHFINDER_SYNC_SOURCE_MAP.get(row.source_id);
  const cfg = source?.articleSummary;
  // targets 已按此过滤过，这里只是让类型收窄
  if (!source || !cfg) continue;
  // 抓的是镜像域名，而 canonicalUrl 已被改写成官方域名
  const fetchUrl = source.rewriteItemHost
    ? row.canonical_url.replace(source.rewriteItemHost.to, cfg.fetchHost)
    : row.canonical_url;

  const summary = await fetchArticleSummary(fetchUrl, {
    containerMarker: cfg.containerMarker,
    allowedHosts: [cfg.fetchHost],
  });
  if (summary) got += 1;
  results.push({ id: row.id, title: row.title_en, summary });
  // 礼貌间隔：连着拉几十页容易被限流
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\n抓取完成：${got}/${targets.length} 条拿到正文首段`);
if (!apply) {
  console.log('\n[dry-run] 未写库。抽 3 条：');
  for (const r of results.filter((x) => x.summary).slice(0, 3)) {
    console.log(`  · ${(r.title ?? '').slice(0, 56)}`);
    console.log(`    ${r.summary.slice(0, 100)}`);
  }
  console.log('\n加 --apply 才会写库。');
  process.exit(0);
}

let written = 0;
for (const r of results) {
  if (!r.summary) continue;
  // 条件更新：只写仍然缺摘要的行，避免覆盖同步刚补上的内容
  const updated = await sql`
    update pathfinder_items set summary_en = ${r.summary}
    where id = ${r.id}
      and coalesce(nullif(trim(summary_zh), ''), nullif(trim(summary_en), '')) is null
    returning id
  `;
  written += updated.length;
}
console.log(`\n已写入 ${written} 条。中文摘要由下一轮同步的翻译补上，或手动跑 backfill-pathfinder-zh.mjs`);
