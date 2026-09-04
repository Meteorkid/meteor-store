#!/usr/bin/env node
/**
 * 给缺摘要的条目补上正文首段。
 *
 * 抓取管线只对**新增条目**拉正文（见 sync.ts 的 applyArticleSummaries），
 * 存量条目要靠这个脚本补。
 *
 * 用法（默认 dry-run，只抓不写库）：
 *   ./node_modules/.bin/tsx scripts/backfill-article-summaries.mts
 *   ./node_modules/.bin/tsx scripts/backfill-article-summaries.mts --apply
 *
 * **驱动必须是 pg，不能用 @neondatabase/serverless**：生产已从 Neon 迁到
 * 与应用同机的 PostgreSQL（只监听 127.0.0.1），neon-http 走 HTTP、连不上它，
 * 会把 `127.0.0.1` 拼成 `https://api.0.0.1/sql` 这种荒唐地址。
 *
 * 连接串按 环境变量 → .env.production → .env.local 顺序取：在服务器上跑时
 * 取到的是自建库。**别只认 .env.local**——那里可能还留着废弃的 Neon 串。
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';
import {
  articleSummaryUrl,
  fetchArticleSummary,
} from '../src/lib/pathfinder/ingestion/article-summary';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../src/lib/pathfinder/ingestion/sources';

const apply = process.argv.includes('--apply');

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

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

const { rows } = await client.query<{
  id: string; source_id: string; canonical_url: string; title_en: string | null;
}>(`
  select id, source_id, canonical_url, title_en
  from pathfinder_items
  where status = 'published'
    and coalesce(nullif(trim(summary_zh), ''), nullif(trim(summary_en), '')) is null
  order by source_id, published_at desc nulls last
`);

// 只处理来源显式开启了 articleSummary 的条目
const targets = rows.filter((r) => PATHFINDER_SYNC_SOURCE_MAP.get(r.source_id)?.articleSummary);
console.log(`缺摘要的已发布条目 ${rows.length} 条，其中来源支持正文提取的 ${targets.length} 条`);
const skipped = rows.length - targets.length;
if (skipped > 0) console.log(`  （另有 ${skipped} 条的来源未开启 articleSummary，跳过）`);

const results: Array<{ id: string; title: string | null; summary: string }> = [];
for (const row of targets) {
  const source = PATHFINDER_SYNC_SOURCE_MAP.get(row.source_id)!;
  const url = articleSummaryUrl(source, row.canonical_url);
  const summary = url ? await fetchArticleSummary(url, source.articleSummary!) : '';
  results.push({ id: row.id, title: row.title_en, summary });
  // 礼貌间隔：连着拉几十页容易被限流
  await new Promise((r) => setTimeout(r, 300));
}

const got = results.filter((r) => r.summary).length;
console.log(`\n抓取完成：${got}/${targets.length} 条拿到正文首段`);

if (!apply) {
  console.log('\n[dry-run] 未写库。抽 3 条：');
  for (const r of results.filter((x) => x.summary).slice(0, 3)) {
    console.log(`  · ${(r.title ?? '').slice(0, 56)}`);
    console.log(`    ${r.summary.slice(0, 100)}`);
  }
  console.log('\n加 --apply 才会写库。');
  await client.end();
  process.exit(0);
}

let written = 0;
for (const r of results) {
  if (!r.summary) continue;
  // 条件更新：只写仍然缺摘要的行，避免覆盖同步刚补上的内容
  const res = await client.query(
    `update pathfinder_items set summary_en = $1
     where id = $2
       and coalesce(nullif(trim(summary_zh), ''), nullif(trim(summary_en), '')) is null`,
    [r.summary, r.id],
  );
  written += res.rowCount ?? 0;
}
console.log(`\n已写入 ${written} 条。中文摘要由下一轮同步的翻译补上，或跑 backfill-pathfinder-zh.mjs`);
await client.end();
