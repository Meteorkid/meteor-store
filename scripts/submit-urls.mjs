#!/usr/bin/env node
/**
 * 把站点地址批量推给 IndexNow（Bing / Yandex）和百度普通收录。
 *
 * 用途是「一次性的大批量推送」——刚接入站长平台时把 sitemap 里的全部地址推一遍，
 * 或者改版后重推某个目录。日常发文章由 src/lib/revalidate.ts 自动推列表页，
 * 不需要跑这个脚本。
 *
 * 使用：
 *   set -a && . ./.env.local && set +a && \
 *   node scripts/submit-urls.mjs                       # 默认 dry-run，只打印计划
 *   node scripts/submit-urls.mjs --apply               # 真的推送
 *   node scripts/submit-urls.mjs --filter=/blog/ --apply
 *   node scripts/submit-urls.mjs --limit=100 --apply
 *   node scripts/submit-urls.mjs --only=indexnow --apply
 *
 * **默认 dry-run 是有意的**：百度的推送配额按天算（新站通常每天几十到几百条），
 * 手滑跑两遍就把当天的额度花在重复地址上了。IndexNow 没有硬配额，但短时间重复
 * 提交同一批地址会被降权处理。
 *
 * 环境变量（没配的那家自动跳过）：
 *   INDEXNOW_KEY       自己生成的 8–128 位十六进制字符串，同时要能从
 *                      https://www.imagentx.top/indexnow-key.txt 读到（由 route handler 下发）
 *   BAIDU_PUSH_TOKEN   百度站长平台 → 普通收录 → API 提交 里给的 token
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imagentx.top').replace(/\/+$/, '');
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BAIDU_ENDPOINT = 'https://data.zz.baidu.com/urls';

/** IndexNow 协议单次上限 10000；百度单次建议 2000 以内，取小的那个做批大小 */
const BATCH_SIZE = 2000;

function parseArgs(argv) {
  const args = { apply: false, filter: '', limit: 0, only: '' };
  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--filter=')) args.filter = arg.slice('--filter='.length);
    else if (arg.startsWith('--limit=')) args.limit = Number(arg.slice('--limit='.length));
    else if (arg.startsWith('--only=')) args.only = arg.slice('--only='.length);
    else {
      console.error(`未知参数：${arg}`);
      process.exit(1);
    }
  }
  if (args.only && !['indexnow', 'baidu'].includes(args.only)) {
    console.error(`--only 只接受 indexnow 或 baidu，收到：${args.only}`);
    process.exit(1);
  }
  return args;
}

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`拉取 sitemap 失败：HTTP ${res.status}`);
  const xml = await res.text();
  // sitemap 里同时有 <loc> 和 <xhtml:link href>，只取 <loc>——
  // hreflang 的 href 是同一批地址的另一种写法，一起推等于把每条重复推三遍
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

async function pushIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return console.log('· IndexNow：未配置 INDEXNOW_KEY，跳过');

  for (const batch of chunk(urls, BATCH_SIZE)) {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: batch,
      }),
      signal: AbortSignal.timeout(30000),
    });
    const body = await res.text();
    console.log(`· IndexNow：${batch.length} 条 → HTTP ${res.status} ${body.slice(0, 200)}`);
    if (res.status === 403) {
      console.error('  403 通常是密钥校验失败：确认 ' + `${SITE_URL}/indexnow-key.txt` + ' 能读到、且内容与 INDEXNOW_KEY 完全一致');
    }
  }
}

async function pushBaidu(urls) {
  const token = process.env.BAIDU_PUSH_TOKEN?.trim();
  if (!token) return console.log('· 百度：未配置 BAIDU_PUSH_TOKEN，跳过');

  for (const batch of chunk(urls, BATCH_SIZE)) {
    const endpoint = `${BAIDU_ENDPOINT}?site=${encodeURIComponent(SITE_URL)}&token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: batch.join('\n'),
      signal: AbortSignal.timeout(30000),
    });
    // 百度即使 HTTP 200 也会在正文里报 over_quota / not_same_site，必须打出来看
    console.log(`· 百度：${batch.length} 条 → HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let urls = await fetchSitemapUrls();
  const total = urls.length;
  if (args.filter) urls = urls.filter((u) => u.includes(args.filter));
  if (args.limit > 0) urls = urls.slice(0, args.limit);

  console.log(`sitemap 共 ${total} 条，筛选后 ${urls.length} 条`);
  console.log(urls.slice(0, 5).map((u) => `  ${u}`).join('\n'));
  if (urls.length > 5) console.log(`  …… 其余 ${urls.length - 5} 条`);

  if (urls.length === 0) return;

  if (!args.apply) {
    console.log('\n[dry-run] 没有真的推送。确认无误后加 --apply。');
    return;
  }

  console.log('');
  if (args.only !== 'baidu') await pushIndexNow(urls);
  if (args.only !== 'indexnow') await pushBaidu(urls);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
