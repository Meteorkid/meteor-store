import { SITE_URL } from './constants';

/**
 * 主动把「这些地址变了」告诉搜索引擎，不必干等爬虫自己回来。
 *
 * 两条协议各自独立，配了哪条就走哪条，都没配就整体空转：
 *
 * - **IndexNow**（`INDEXNOW_KEY`）：Bing / Yandex / Seznam 共用的开放协议，
 *   一次提交多家生效，通常几分钟内就会来抓。Google 不参与。
 * - **百度普通收录推送**（`BAIDU_PUSH_TOKEN`）：百度站长后台「普通收录 → API 提交」
 *   给的 token。百度对主动推送的响应远好于等待自然抓取，但**每天有配额**，
 *   超了会返回 `over_quota`，所以只在内容真的变了时才推。
 *
 * Google 没有等价接口（Indexing API 只对招聘和直播结构化数据开放），
 * 只能靠 sitemap + Search Console，这里不做。
 */

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * **百度这个接口只有 http，不要"顺手改成 https"。**
 *
 * `data.zz.baidu.com` 上确实监听了 443，但证书是百度主站那张通配符证书，
 * SAN 里没有 `data.zz.baidu.com`（`*.baidu.com` 匹配不到三级域名 `data.zz`）。
 * 用 https 请求会直接 `ERR_TLS_CERT_ALTNAME_INVALID`，2026-08 实测过。
 *
 * 代价是 `BAIDU_PUSH_TOKEN` 以明文过网。可接受：这个 token 的权限只有
 * "为本站提交待收录地址"，泄露的后果上限是有人替我们消耗每天的推送配额，
 * 拿不到任何数据、也改不了站点。真出问题在百度站长平台点一下就能重置。
 */
const BAIDU_ENDPOINT = 'http://data.zz.baidu.com/urls';

/** IndexNow 密钥的对外地址。密钥本身不是机密（协议要求公开可读），走环境变量只是免得换密钥要改代码 */
export const INDEXNOW_KEY_PATH = '/indexnow-key.txt';

/** 单次提交上限。IndexNow 协议允许 10000，这里留足余量即可 */
const MAX_URLS = 1000;

/** 网络超时。推送是「顺手做的事」，不值得让调用方等 */
const TIMEOUT_MS = 8000;

export type PingOutcome = {
  target: 'indexnow' | 'baidu';
  ok: boolean;
  /** 未配置 token 时为 'skipped'，便于调用方区分「没配」与「推失败」 */
  status: number | 'skipped' | 'error';
  detail?: string;
};

function normalize(urls: string[]): string[] {
  // 只推本站地址：IndexNow 会因为 host 不匹配整批拒绝，
  // 百度则会把越权的那条算进当天配额然后丢掉
  const seen = new Set<string>();
  for (const url of urls) {
    if (url.startsWith(`${SITE_URL}/`) || url === SITE_URL) seen.add(url);
  }
  return [...seen].slice(0, MAX_URLS);
}

async function pingIndexNow(urls: string[]): Promise<PingOutcome> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return { target: 'indexnow', ok: false, status: 'skipped' };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // 200 已接受、202 已接受待验证密钥，都算成功
    return { target: 'indexnow', ok: res.ok, status: res.status };
  } catch (error) {
    return { target: 'indexnow', ok: false, status: 'error', detail: String(error) };
  }
}

async function pingBaidu(urls: string[]): Promise<PingOutcome> {
  const token = process.env.BAIDU_PUSH_TOKEN?.trim();
  if (!token) return { target: 'baidu', ok: false, status: 'skipped' };

  // **`site` 不能 encodeURIComponent**：百度是拿这个参数按字面去匹配站长平台里登记的站点，
  // 编码成 `https%3A%2F%2F…` 那种形式会匹配不上，返回 400 `site init fail`。
  // `:` 和 `/` 出现在 query 值里本来就合法（RFC 3986），不编码没有副作用。
  // token 是字母数字，编不编码都一样，保留编码以防将来换成含特殊字符的值。
  const endpoint = `${BAIDU_ENDPOINT}?site=${SITE_URL}&token=${encodeURIComponent(token)}`;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: urls.join('\n'),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // 百度即使 HTTP 200 也可能在响应体里报 over_quota / not_same_site，
    // 所以正文要带回去，否则配额早就用完了也看不出来
    const detail = (await res.text()).slice(0, 300);
    return { target: 'baidu', ok: res.ok && !detail.includes('error'), status: res.status, detail };
  } catch (error) {
    return { target: 'baidu', ok: false, status: 'error', detail: String(error) };
  }
}

/**
 * 推送一批地址。**永远不抛异常**——调用方多半是刚刚成功发布完内容，
 * 推送失败不该把一次成功的发布变成 500（同 AGENTS.md 里缓存失效那条约定）。
 */
export async function pingSearchEngines(urls: string[]): Promise<PingOutcome[]> {
  const list = normalize(urls);
  if (list.length === 0) return [];

  const outcomes = await Promise.all([pingIndexNow(list), pingBaidu(list)]);
  for (const outcome of outcomes) {
    if (!outcome.ok && outcome.status !== 'skipped') {
      console.warn(`[search-ping] ${outcome.target} 推送失败`, outcome.status, outcome.detail ?? '');
    }
  }
  return outcomes;
}
