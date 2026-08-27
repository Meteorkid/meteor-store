#!/usr/bin/env node
/**
 * 用词表重算已入库条目的主题标签。
 *
 * 起因：主题改为词表驱动后（src/lib/pathfinder/ingestion/topics.ts），新逻辑只在
 * **抓取时**生效。存量条目的 pathfinder_item_tags 里仍是旧的原始标签——
 * AI(109)、OpenAI(42)、triaged(13)、bot-triaged(9)、oncall: distributed infra(8)。
 *
 * **光靠重新同步治不好存量**：同步只给本轮实际抓到的条目重建标签，而收紧后的
 * 查询（-linked:pr + 时间窗）与分桶重排会让大量存量条目不再被抓到，
 * 它们的旧标签会一直留着。所以需要这个一次性回填。
 *
 * 用法（默认 dry-run）：
 *   node --env-file=.env.production scripts/backfill-pathfinder-topics.mjs
 *   node --env-file=.env.production scripts/backfill-pathfinder-topics.mjs --apply
 *
 * 可以重复跑：识别时会把条目当前的标签一并喂回去，而词表认得出自己的产出
 * （见 topics.ts 里关于幂等的说明），所以第二次跑结果不变。
 */
import { neon } from '@neondatabase/serverless';
import { topicsForItem } from '../src/lib/pathfinder/ingestion/topics.ts';

const apply = process.argv.includes('--apply');
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('缺少 DATABASE_URL');
  process.exit(1);
}
const sql = neon(databaseUrl);

const rows = await sql`
  select i.id, i.title_zh, i.title_en, i.summary_zh, i.summary_en,
         coalesce(array_agg(t.tag) filter (where t.tag is not null), '{}') as labels
  from pathfinder_items i
  left join pathfinder_item_tags t on t.item_id = i.id and t.dimension = 'topic'
  where i.status = 'published'
  group by i.id
`;

const plan = rows.map((row) => {
  const before = [...row.labels].sort();
  const after = topicsForItem({
    // 中英都喂：译文里写「分布式」而原文写 distributed，两边都可能命中
    title: `${row.title_zh ?? ''} ${row.title_en ?? ''}`,
    summary: `${row.summary_zh ?? ''} ${row.summary_en ?? ''}`,
    labels: row.labels,
  });
  return { id: row.id, before, after, changed: before.join('|') !== [...after].sort().join('|') };
});

const changed = plan.filter((p) => p.changed);
const tally = new Map();
for (const p of plan) for (const tag of p.after) tally.set(tag, (tally.get(tag) ?? 0) + 1);

console.log(`已发布条目 ${rows.length} 条，标签需要变更的 ${changed.length} 条`);
console.log(`旧标签种类 ${new Set(plan.flatMap((p) => p.before)).size} → 新标签种类 ${tally.size}`);
console.log('\n新的主题分布：');
console.log('  ' + [...tally].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}(${n})`).join('  '));
console.log(`\n无主题的条目：${plan.filter((p) => p.after.length === 0).length} 条`);

if (!apply) {
  console.log('\n[dry-run] 未写库。抽 5 条变更示例：');
  for (const p of changed.slice(0, 5)) {
    console.log(`  ${p.id}`);
    console.log(`    旧: ${p.before.join(', ') || '(无)'}`);
    console.log(`    新: ${p.after.join(', ') || '(无)'}`);
  }
  console.log('\n加 --apply 才会写库。');
  process.exit(0);
}

let written = 0;
for (let i = 0; i < changed.length; i += 25) {
  const batch = changed.slice(i, i + 25);
  const ids = batch.map((p) => p.id);
  // 先删后插，与同步里重建标签的做法一致
  await sql`delete from pathfinder_item_tags where item_id = any(${ids}) and dimension = 'topic'`;
  const values = batch.flatMap((p) => p.after.map((tag) => ({ itemId: p.id, tag })));
  for (const v of values) {
    await sql`insert into pathfinder_item_tags (item_id, dimension, tag)
      values (${v.itemId}, 'topic', ${v.tag}) on conflict do nothing`;
  }
  written += batch.length;
  console.log(`  已处理 ${written}/${changed.length}`);
}
console.log(`\n完成：${written} 条条目的标签已重建`);
