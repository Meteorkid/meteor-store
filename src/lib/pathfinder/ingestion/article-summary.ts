import { PATHFINDER_MAX_RESPONSE_BYTES } from './fetch-source';
import type { PathfinderArticleSummaryConfig, PathfinderSyncSource } from './types';

/**
 * 从正文里取一段摘要。
 *
 * 两种来源需要它，缺失的方式不同：Hugging Face 的镜像 feed 只给
 * guid/link/pubDate/title，压根没有 `<description>`（那 26 条在站内没有摘要、
 * 也生成不了解读，见 editorial.ts 的 canGenerateEditorialNote）；AGI Hunt 日报
 * 给的 description 则是一份逐日不变的样板文，比空着更糟。后者用
 * `replacesFeedSummary` 覆盖，前者只填空缺。
 *
 * **这是抓取管线里唯一会逐条拉正文的路径**，代价明确：每条一次 HTTP 请求、
 * 每页数百 KB。因此它是**按来源显式开启**的（`articleSummary` 配置）。
 *
 * 提取失败一律返回空字符串：没有摘要只是不好看，页面已有
 * 「官方来源未提供摘要」的兜底；而让抓取因此失败会丢掉整条来源。
 */

/** 单页抓取超时。比 feed 短：正文页只是锦上添花，不该拖慢整轮同步。 */
const ARTICLE_TIMEOUT_MS = 8_000;

/** 摘要的长度区间。太短说明没抓到正文，太长会撑坏卡片布局。 */
const MIN_SUMMARY_LENGTH = 60;
const MAX_SUMMARY_LENGTH = 320;

/**
 * 页面 chrome 的特征词。
 *
 * 正文容器的第一个 `<p>` 往往把面包屑、标题、发布时间、点赞按钮裹在一起
 * （实测 Hugging Face 是一个 1339 字的大块，以「Back to Articles」开头），
 * 真正的首段在它后面。按特征词跳过，而不是「取第二段」——不同文章的
 * 头部块数不一定相同。
 */
const CHROME_MARKERS = [
  'Back to Articles', 'Upvote', 'Published ', 'Sign up', 'Log in',
  'journey to advance', 'Models Datasets Spaces',
];

const ENTITIES: ReadonlyArray<readonly [RegExp, string]> = [
  [/&nbsp;/g, ' '], [/&lt;/g, '<'], [/&gt;/g, '>'],
  [/&quot;/g, '"'], [/&#39;|&apos;/g, "'"], [/&amp;/g, '&'],
];

function toPlainText(fragment: string): string {
  let text = fragment.replace(/<[^>]+>/g, ' ');
  for (const [pattern, replacement] of ENTITIES) text = text.replace(pattern, replacement);
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * 从整页 HTML 里取正文首段。导出以便对着真实页面钉测试。
 *
 * `containerMarker` 是正文容器 class 里的一个唯一片段（Hugging Face 是
 * `blog-content`）。用片段而不是完整选择器，是因为这些站点的 class 属性里
 * 混着 Tailwind 的方括号写法（`[&_h1]:mr-0!`），正经解析器反而更容易出错。
 */
export function extractArticleSummary(pageHtml: string, containerMarker: string): string {
  const markerAt = pageHtml.indexOf(containerMarker);
  if (markerAt < 0) return '';
  const bodyStart = pageHtml.indexOf('>', markerAt);
  if (bodyStart < 0) return '';

  const body = pageHtml.slice(bodyStart + 1, bodyStart + 1 + 60_000);
  for (const match of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const text = toPlainText(match[1]);
    if (text.length < MIN_SUMMARY_LENGTH) continue;
    if (CHROME_MARKERS.some((marker) => text.includes(marker))) continue;
    return text.length <= MAX_SUMMARY_LENGTH
      ? text
      : `${text.slice(0, MAX_SUMMARY_LENGTH - 1).trimEnd()}…`;
  }
  return '';
}

/**
 * 从站点提供的 Markdown 版正文里取一段。
 *
 * 比解析 HTML 可靠得多：AGI Hunt 的日报页是 448KB、正文段落埋在渲染出来的
 * 结构里，而 `/daily/{date}.md` 是同一份内容的纯文本版，`## 今日总结`
 * 这一节的首段就是当天的综述。
 *
 * 按标题定位而不是「取第一段」：文件开头是一行出处声明和一级标题，
 * 而正文首段是各来源里唯一逐日不同、真正有信息量的那段。
 */
export function extractMarkdownSummary(markdown: string, heading: string): string {
  const headingAt = markdown.indexOf(heading);
  if (headingAt < 0) return '';

  const body = markdown.slice(headingAt + heading.length, headingAt + heading.length + 60_000);
  for (const block of body.split(/\n\s*\n/)) {
    // 列表项与下一节标题都不是综述段落；`- **X** — …` 是日报的重点条目格式
    const text = block.trim();
    if (!text || text.startsWith('#') || text.startsWith('-') || text.startsWith('>')) continue;
    const plain = text.replace(/\s+/g, ' ');
    if (plain.length < MIN_SUMMARY_LENGTH) continue;
    return plain.length <= MAX_SUMMARY_LENGTH
      ? plain
      : `${plain.slice(0, MAX_SUMMARY_LENGTH - 1).trimEnd()}…`;
  }
  return '';
}

/**
 * 算出该抓哪个地址。
 *
 * 两处调整叠在一起，抽出来是因为同步管线与 `scripts/backfill-article-summaries.mts`
 * 都要用，而其中任何一处漏掉后缀或漏掉镜像改写，表现都是「静默抓不到摘要」。
 *
 * - 镜像来源的 canonicalUrl 已被 `rewriteItemHost` 改写成官方域名，抓取要换回镜像
 * - Markdown 模式要在条目链接后面补上后缀（如 `.md`）
 */
export function articleSummaryUrl(
  source: Pick<PathfinderSyncSource, 'rewriteItemHost' | 'articleSummary'>,
  canonicalUrl: string,
): string | null {
  const config = source.articleSummary;
  if (!config) return null;
  const onFetchHost = source.rewriteItemHost
    ? canonicalUrl.replace(source.rewriteItemHost.to, config.fetchHost)
    : canonicalUrl;
  return config.mode === 'markdown' ? `${onFetchHost}${config.urlSuffix}` : onFetchHost;
}

/**
 * 拉一次正文并提取摘要。
 *
 * 主机白名单在这里再验一次：条目链接可能已被 `rewriteItemHost` 改写成官方域名，
 * 而实际能抓到的是镜像——两者未必相同，所以不能直接信任条目的 canonicalUrl。
 */
export async function fetchArticleSummary(
  url: string,
  config: PathfinderArticleSummaryConfig,
): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return '';
  }
  if (parsed.protocol !== 'https:') return '';
  if (parsed.hostname !== config.fetchHost) return '';

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
      headers: { 'User-Agent': 'Meteor-Pathfinder/1.0' },
    });
    if (!response.ok) return '';

    const length = Number(response.headers.get('content-length'));
    if (Number.isFinite(length) && length > PATHFINDER_MAX_RESPONSE_BYTES) return '';

    const text = await response.text();
    if (text.length > PATHFINDER_MAX_RESPONSE_BYTES) return '';
    return config.mode === 'markdown'
      ? extractMarkdownSummary(text, config.heading)
      : extractArticleSummary(text, config.containerMarker);
  } catch {
    // 超时、网络异常、供应商故障都走这里：没有摘要，但抓取不受影响
    return '';
  }
}
