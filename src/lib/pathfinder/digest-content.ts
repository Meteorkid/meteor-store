import { unstable_cache } from 'next/cache';
import { markdownToHtml } from '@/lib/markdown';

/**
 * 资讯摘要的全文。
 *
 * **不进数据库，渲染时现抓。** 这不是图省事：日报一期 320KB，按天累积一年约
 * 117MB，而整库现在只有 36MB、服务器 `shared_buffers` 是 128MB——存下来会让
 * 整库装不进内存，换来的只是一份我们自己不加工的副本。而且日报发布后内容不再变，
 * 缓存命中率接近 100%，抓取成本实际上落在「每天每期一次」。
 *
 * 也不需要像上游那样把每条快讯入库：他们存是因为要做聚类、热度排名、跨天事件线
 * 和 29,509 条 `/p/` 页面的收录，那是他们的产品；我们要的只是一份现成综述。
 */

/** 抓取超时。全文只是详情页的一部分，不该把整页拖死。 */
const DIGEST_TIMEOUT_MS = 10_000;

/** 单期上限。实测一期约 320KB，留几倍余量，同时挡住异常响应。 */
const MAX_DIGEST_BYTES = 2 * 1024 * 1024;

/** 缓存到明天：日报按天发布，发布后不再变。 */
const DIGEST_REVALIDATE_SECONDS = 86_400;

/**
 * 告警节流：同一个地址一小时最多报一次。
 *
 * 失败不进缓存（见 `loadDigest`），所以上游一旦挂掉，**每一次请求**都会走到
 * 失败分支。爬虫扫一遍 180 天窗口就是几百行日志，把 syslog 里真正的信号淹掉。
 * 进程内 Map、重启即清空——这是日志降噪，不承担正确性。
 */
const ALERT_WINDOW_MS = 3_600_000;
const lastAlertAt = new Map<string, number>();

type DigestFailure = 'request-failed' | 'http-error' | 'too-large' | 'parse-empty';

/**
 * 报一次全文不可用。
 *
 * **`parse-empty` 是这里面最要紧的一种**：它意味着抓到了内容却解析不出章节，
 * 也就是上游改了 `.md` 的结构（比如「今日总结」改名）。其余几种多半是
 * 一时的网络问题，会自己好；这一种不会，而且表现是页面安静地退回只显示摘要，
 * 不报警就只能等人某天偶然发现。
 *
 * 同一次改版还会同时打掉卡片摘要（sources.ts 里 articleSummary 的 heading
 * 也钉着「## 今日总结」），所以看到这条日志时两处都要检查。
 */
function reportDigestFailure(url: string, reason: DigestFailure, detail?: Record<string, unknown>) {
  const now = Date.now();
  const previous = lastAlertAt.get(url);
  if (previous !== undefined && now - previous < ALERT_WINDOW_MS) return;
  lastAlertAt.set(url, now);
  console.error({ event: 'pathfinder_digest_unavailable', reason, url, ...detail });
}

export interface DigestSubsection {
  heading: string;
  html: string;
  /** 该小节引用了多少条快讯。折叠状态下让人知道展开值不值得。 */
  itemCount: number;
}

export interface DigestSection {
  heading: string;
  /** 该节标题之下、第一个小节之前的正文 */
  html: string;
  subsections: DigestSubsection[];
  /**
   * 是否默认折叠。
   *
   * 实测一期 228,602 字里，「分频道观察」占 132,728、「分公司动态」占 88,464，
   * 两节合计 97%。全部铺开的话页面重到没法读，所以有小节的节按小节折叠。
   */
  collapsed: boolean;
}

export interface DigestContent {
  /** 上游 `.md` 顶部那行出处声明，必须原样展示 */
  attribution: string | null;
  sections: DigestSection[];
}

/** 出处声明是文件开头的引用行，形如 `> 出处:AGI HUNT · https://…` */
function readAttribution(markdown: string): string | null {
  const match = markdown.match(/^>\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/** 一串紧挨着的行内链接，中间只隔空白。 */
const LINK_RUN = /(?:\[[^\]\n]*\]\([^)\s]+\)[ \t]*)+/g;

/** 列表项开头的加粗小标题，形如 `- **标题** — 正文`。 */
const BOLD_LEAD = /^(\*\*[^*]+\*\*)\s*(?:—|--|-)?\s*/;

/**
 * 把行内链接提到行首，并按链接切成一行一条。
 *
 * 上游的写法是「一句话。[详情](u) 又一句话。[详情](u) [详情](u)」反复串成一整段——
 * 每个「详情」其实是一条独立快讯，但混在文字中间，连着出现时就成了
 * 「详情 详情 详情」，读者既分不清哪条链接对应哪句话，也找不到可点的位置。
 *
 * 改成在链接处切段、每段独占一行、链接统一放行首，可点区域就落在固定的左侧，
 * 一行一条也和「一个详情=一条新闻」对上了。
 *
 * 只重排、不增删：链接与文字原样保留，仅调整顺序与换行。
 */
function liftLinksToLineStart(body: string): string[] {
  const segments: Array<{ links: string; text: string }> = [];
  let cursor = 0;
  LINK_RUN.lastIndex = 0;
  for (let m = LINK_RUN.exec(body); m !== null; m = LINK_RUN.exec(body)) {
    segments.push({ links: m[0].trim(), text: body.slice(cursor, m.index).trim() });
    cursor = m.index + m[0].length;
  }
  // 末尾没有链接的残句也要保留，否则会丢正文
  const tail = body.slice(cursor).trim();
  if (tail) segments.push({ links: '', text: tail });

  return segments
    .filter((seg) => seg.links || seg.text)
    .map((seg) => [seg.links, seg.text].filter(Boolean).join(' '));
}

/**
 * 重排一节正文里的链接。
 *
 * 逐行处理，只动「含行内链接」的列表项与段落；标题、代码块、无链接的导语
 * 一律原样透传——重排的目的是让可点位置固定，不是重写别人的排版。
 */
export function restructureDigestBody(markdown: string): string {
  const out: string[] = [];
  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('- ');
    const hasLink = /\[[^\]\n]*\]\([^)\s]+\)/.test(trimmed);
    if (!hasLink || trimmed.startsWith('#') || trimmed.startsWith('>')) {
      out.push(line);
      continue;
    }

    const content = isBullet ? trimmed.slice(2) : trimmed;
    const lead = content.match(BOLD_LEAD);
    const body = lead ? content.slice(lead[0].length) : content;
    const lines = liftLinksToLineStart(body);
    // 切不出多段时不动它：单条链接原样留在句尾比硬拆更好读
    if (lines.length <= 1 && !lead) {
      out.push(line);
      continue;
    }

    if (lead) out.push(`- ${lead[1]}`);
    const indent = lead ? '  ' : '';
    for (const item of lines) out.push(`${indent}- ${item}`);
    out.push('');
  }
  return out.join('\n');
}

/**
 * 把一期日报拆成章节树。
 *
 * 按 `##` / `###` 切分而不是整篇丢给 markdownToHtml，是因为要按小节折叠——
 * 渲染成一大块 HTML 之后就没有可以挂折叠的边界了。
 */
export function parseDigestMarkdown(markdown: string): DigestContent {
  const attribution = readAttribution(markdown);
  const sections: DigestSection[] = [];

  // 第一块是出处与 H1，正文从第一个 `##` 开始
  for (const block of markdown.split(/^## /m).slice(1)) {
    const newlineAt = block.indexOf('\n');
    if (newlineAt < 0) continue;
    const heading = block.slice(0, newlineAt).trim();
    const rest = block.slice(newlineAt + 1);

    const [lead, ...subBlocks] = rest.split(/^### /m);
    const subsections = subBlocks.flatMap((sub) => {
      const at = sub.indexOf('\n');
      if (at < 0) return [];
      const text = sub.slice(at + 1).trim();
      if (!text) return [];
      // 每条快讯是一个 /p/ 链接；同一条可能被引用多次，按去重后计数
      const itemCount = new Set(text.match(/\/p\/[0-9a-f]+/g) ?? []).size;
      return [{ heading: sub.slice(0, at).trim(), html: markdownToHtml(restructureDigestBody(text)), itemCount }];
    });

    sections.push({
      heading,
      html: lead.trim() ? markdownToHtml(restructureDigestBody(lead.trim())) : '',
      subsections,
      collapsed: subsections.length > 0,
    });
  }

  return { attribution, sections };
}

/**
 * 缓存的是**渲染结果**，不只是抓取。
 *
 * 详情页是 `force-dynamic`，不缓存的话每次请求都要把一期日报重新解析一遍——
 * 实测 79ms，而且 `markdownToHtml` 走的是 `processSync`，同步阻塞事件循环。
 * AI 动态有 180 天公开窗口，爬虫扫一遍就是上百个这样的页面。
 *
 * **失败时抛异常而不是返回 null**：`unstable_cache` 不缓存被拒绝的 Promise，
 * 这样上游一次抽风不会被钉住一整天，下次请求就会重试。
 */
const loadDigest = unstable_cache(
  // 缓存键就是 url：主机校验已在调用前做过，再传一遍不增加区分度
  async (url: string): Promise<DigestContent> => {
    const content = await requestDigest(url);
    if (!content) throw new Error(`digest unavailable: ${url}`);
    return content;
  },
  ['pathfinder-digest'],
  { revalidate: DIGEST_REVALIDATE_SECONDS },
);

export async function fetchDigestContent(
  url: string,
  allowedHost: string,
): Promise<DigestContent | null> {
  // 地址校验放在缓存外：非法地址不该在缓存里占一个键
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' || parsed.hostname !== allowedHost) return null;

  try {
    return await loadDigest(url);
  } catch {
    return null;
  }
}

/**
 * 抓取并解析一期日报。
 *
 * 失败一律返回 null：全文拿不到时详情页照常展示摘要与来源，不该整页 500。
 * 主机白名单已在 `fetchDigestContent` 校验过——地址由条目的 canonicalUrl 推导，
 * 而那是抓取管线写进数据库的值，不该被当成可信输入直接 fetch。
 */
async function requestDigest(url: string): Promise<DigestContent | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(DIGEST_TIMEOUT_MS),
      headers: { 'User-Agent': 'Meteor-Pathfinder/1.0' },
      next: { revalidate: DIGEST_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      reportDigestFailure(url, 'http-error', { status: response.status });
      return null;
    }

    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > MAX_DIGEST_BYTES) {
      reportDigestFailure(url, 'too-large', { bytes: declared });
      return null;
    }

    const text = await response.text();
    if (text.length > MAX_DIGEST_BYTES) {
      reportDigestFailure(url, 'too-large', { bytes: text.length });
      return null;
    }

    const content = parseDigestMarkdown(text);
    if (content.sections.length === 0) {
      // 抓到了内容却切不出章节 = 上游改版，不会自愈
      reportDigestFailure(url, 'parse-empty', { bytes: text.length });
      return null;
    }
    return content;
  } catch (error) {
    // 超时与网络异常走这里：没有全文，但详情页其余部分照常
    reportDigestFailure(url, 'request-failed', {
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
