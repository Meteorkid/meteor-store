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
 * **默认 dry-run 是有意的**：百度的推送配额按天算，手滑跑两遍就把当天的额度
 * 花在重复地址上了。IndexNow 没有硬配额，但短时间重复提交同一批地址会被降权处理。
 *
 * **两家的量级差了两个数量级，别用同一条命令推**：
 *   IndexNow 一次收下整份 sitemap（664 条）没问题；
 *   百度新站每天只有 **10 条**（2026-08 实测，响应里的 `remain` 就是当天余额），
 *   随收录量增长才会涨。所以全量推只推 IndexNow，百度挑重点页面小批量推：
 *
 *   node scripts/submit-urls.mjs --only=indexnow --apply
 *   node scripts/submit-urls.mjs --only=baidu --filter=/zh/ --limit=8 --apply
 *
 * 百度只认中文内容，`--filter=/zh/` 把配额花在它真正会收的页面上，别推 /en。
 *
 * 环境变量（没配的那家自动跳过）：
 *   INDEXNOW_KEY       自己生成的 8–128 位十六进制字符串，同时要能从
 *                      https://www.imagentx.top/indexnow-key.txt 读到（由 route handler 下发）
 *   BAIDU_PUSH_TOKEN   百度站长平台 → 普通收录 → API 提交 里给的 token
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imagentx.top').replace(/\/+$/, '');
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
// 百度这个接口只有 http：443 上那张证书是百度主站的通配符证书，SAN 里没有
// data.zz.baidu.com（`*.baidu.com` 匹配不到三级域名），改成 https 会直接
// ERR_TLS_CERT_ALTNAME_INVALID。详见 src/lib/search-ping.ts 里的说明。
const BAIDU_ENDPOINT = 'http://data.zz.baidu.com/urls';

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
      // 403 有两种，别混为一谈：
      if (body.includes('SiteVerificationNotCompleted')) {
        console.error('  **不是密钥配置错误**，别去改 INDEXNOW_KEY。');
        console.error('  IndexNow 没法给一个 Bing 从没收录过的域名做自举：它要先「认识」这个站，');
        console.error('  才谈得上核对密钥文件。2026-08 首次接入时实测过——密钥文件对 bingbot 返回');
        console.error('  200 + text/plain + 内容完全一致、robots.txt 也没挡，等 10 分钟重试依然是这个错。');
        console.error('  解法是先去 https://www.bing.com/webmasters 添加并验证站点（可从 Search Console');
        console.error('  一键导入），登记好之后本脚本原样重跑即可。');
      } else {
        console.error(`  密钥校验失败：确认 ${SITE_URL}/indexnow-key.txt 能读到、且内容与 INDEXNOW_KEY 完全一致`);
      }
    }
  }
}

async function pushBaidu(urls) {
  const token = process.env.BAIDU_PUSH_TOKEN?.trim();
  if (!token) return console.log('· 百度：未配置 BAIDU_PUSH_TOKEN，跳过');

  for (const batch of chunk(urls, BATCH_SIZE)) {
    // site 不能编码，百度按字面匹配登记的站点；编码后会返回 400 site init fail。
    // 详见 src/lib/search-ping.ts 里的说明。
    const endpoint = `${BAIDU_ENDPOINT}?site=${SITE_URL}&token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: batch.join('\n'),
      signal: AbortSignal.timeout(30000),
    });
    // 百度即使 HTTP 200 也会在正文里报 over_quota / not_same_site，必须打出来看
    const body = (await res.text()).slice(0, 300);
    console.log(`· 百度：${batch.length} 条 → HTTP ${res.status} ${body}`);

    if (body.includes('site init fail')) {
      console.error('  `site` 参数与站长平台登记的站点对不上。注意它**不能 percent-encode**，');
      console.error(`  且要与后台完全一致（当前用的是 ${SITE_URL}）。`);
      return;
    }

    // remain 是**当天剩余可推条数**，新站通常只有 10 条，随着收录量增长才会涨。
    // 推完就停：后续批次只会拿到 over_quota，白跑而且把真正的结果冲出屏幕。
    let remain;
    try {
      remain = JSON.parse(body).remain;
    } catch {
      /* 非 JSON（网关错误页等）时不做配额判断 */
    }
    if (remain === 0) {
      console.log('  当天配额已用完（remain=0），停止后续批次。配额每天重置。');
      return;
    }
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
  // 两家分别兜异常：一家挂掉不该连累另一家，也不该把已经推成功的那家的结果
  // 淹没在一整屏堆栈里（实测过：百度的 TLS 报错会连证书内容一起打出来，
  // 而上面 IndexNow 的 200 就被冲到屏幕外了）
  if (args.only !== 'baidu') await pushIndexNow(urls).catch(reportFailure('IndexNow'));
  if (args.only !== 'indexnow') await pushBaidu(urls).catch(reportFailure('百度'));
}

function reportFailure(name) {
  return (error) => {
    console.error(`· ${name}：请求失败 —— ${error?.cause?.code || error?.code || error?.message || error}`);
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
