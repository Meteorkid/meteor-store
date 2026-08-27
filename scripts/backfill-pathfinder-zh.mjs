#!/usr/bin/env node
/**
 * 给已入库的 Pathfinder 条目补中文标题与摘要。
 *
 * 起因：抓取管线在来源不给中文时用英文兜底，而 RSS 与 GitHub 从不给中文，
 * 于是兜底成了常态——实测 178 条已发布条目里 178 条标题、172 条摘要中英逐字相同。
 * 新条目已由同步流程翻译（见 src/lib/pathfinder/translate.ts），这个脚本处理存量。
 *
 * 用法（默认 dry-run，只报告不写库）：
 *   node --env-file=.env.production scripts/backfill-pathfinder-zh.mjs
 *   node --env-file=.env.production scripts/backfill-pathfinder-zh.mjs --apply
 *   node --env-file=.env.production scripts/backfill-pathfinder-zh.mjs --apply --limit=20
 *
 * 默认 dry-run 是因为这会花钱调 API：先看清要翻多少条、估算成本，再决定跑不跑。
 * dry-run 不发起任何 API 调用。
 *
 * 可以重复跑：每次只挑仍然「中英同值」的条目，已经翻好的不会再翻一遍。
 */
import { neon } from '@neondatabase/serverless';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const limitArg = args.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('缺少 DATABASE_URL');
  process.exit(1);
}
const apiKey = process.env.DEEPSEEK_API_KEY;
if (apply && !apiKey) {
  console.error('缺少 DEEPSEEK_API_KEY，无法翻译');
  process.exit(1);
}

const sql = neon(databaseUrl);
const BATCH = 10;
const ENDPOINT = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = [
  '你是技术内容的中英翻译。把给定的英文标题与摘要翻译成简体中文。',
  '要求：',
  '1. 保留技术术语的通用译法；广泛使用的英文缩写（LLM、RAG、API、GPU、PR、CI）保持英文不译。',
  '2. 产品名、公司名、仓库名、人名一律保持原文，不要音译。',
  '3. 标题按中文标题习惯写，不要句号结尾；摘要保持原意，不增删信息、不加评价。',
  '4. 译不出或原文本身就是中文时，原样返回原文。',
  '严格按 json 返回，形如：',
  '{"items":[{"id":"a1","title":"标题","summary":"摘要"}]}',
].join('\n');

const hasChinese = (text) => /[一-鿿぀-ヿ]/.test(text ?? '');

async function translate(batch) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(90_000),
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      max_tokens: 4000,
      response_format: { type: 'json_object' },
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            items: batch.map((r) => ({ id: r.id, title: r.title_en, summary: r.summary_en })),
          }),
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`DeepSeek ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }
  const payload = await response.json();
  const usage = payload.usage ?? {};
  const content = payload.choices?.[0]?.message?.content;
  let parsed;
  try {
    parsed = JSON.parse(content ?? '');
  } catch {
    throw new Error('返回不是合法 JSON');
  }
  const ids = new Set(batch.map((r) => r.id));
  const items = (parsed.items ?? []).filter((i) => ids.has(i.id));
  return { items, usage };
}

const rows = await sql`
  select id, title_en, summary_en, title_zh, summary_zh
  from pathfinder_items
  where status = 'published'
  order by discovered_at desc
`;
const pending = rows.filter((r) => (
  (!hasChinese(r.title_zh) && r.title_en) || (!hasChinese(r.summary_zh) && r.summary_en)
)).slice(0, limit);

console.log(`已发布 ${rows.length} 条，其中缺中文 ${pending.length} 条`);
if (pending.length === 0) process.exit(0);

if (!apply) {
  console.log('\n[dry-run] 未调用 API、未写库。抽 5 条待翻：');
  for (const r of pending.slice(0, 5)) console.log('  -', (r.title_en ?? '').slice(0, 70));
  console.log('\n加 --apply 才会真正翻译并写库。');
  process.exit(0);
}

let done = 0, failed = 0, promptTokens = 0, completionTokens = 0;
for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  try {
    const { items, usage } = await translate(batch);
    promptTokens += usage.prompt_tokens ?? 0;
    completionTokens += usage.completion_tokens ?? 0;
    for (const item of items) {
      const title = (item.title ?? '').trim().slice(0, 180);
      const summary = (item.summary ?? '').trim().slice(0, 320);
      if (!title && !summary) continue;
      // 条件更新：只覆盖仍然缺中文的行，避免与同步任务并发时把新译文盖回去
      await sql`
        update pathfinder_items
        set title_zh = case when ${title} <> '' then ${title} else title_zh end,
            summary_zh = case when ${summary} <> '' then ${summary} else summary_zh end
        where id = ${item.id}
      `;
      done += 1;
    }
    console.log(`  批 ${Math.floor(i / BATCH) + 1}: 写入 ${items.length} 条`);
  } catch (error) {
    failed += batch.length;
    console.error(`  批 ${Math.floor(i / BATCH) + 1} 失败：${error.message}`);
  }
}

console.log(`\n完成：写入 ${done} 条，失败 ${failed} 条`);
console.log(`token 用量：输入 ${promptTokens}，输出 ${completionTokens}`);
