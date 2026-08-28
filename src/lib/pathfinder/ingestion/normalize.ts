import crypto from 'crypto';

const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
  'ref',
  'source',
]);

export function normalizeIngestionUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:') return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || TRACKING_PARAMS.has(key)) {
        url.searchParams.delete(key);
      }
    }
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    url.searchParams.sort();
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * 把镜像域名换回官方域名。
 *
 * 只在来源声明了 `rewriteItemHost` 时生效，且**只改主机名**——镜像的路径结构
 * 与官方一致（`hf-mirror.com/blog/x` ↔ `huggingface.co/blog/x`），改路径反而
 * 会造出不存在的地址。主机名必须精确相等才改，不做后缀匹配：
 * `evil-hf-mirror.com` 不该被当成 `hf-mirror.com`。
 */
export function rewriteHost(
  url: string | null,
  rule: { from: string; to: string } | undefined,
): string | null {
  if (!url || !rule) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== rule.from) return url;
    parsed.hostname = rule.to;
    return parsed.toString();
  } catch {
    return url;
  }
}

/** 按来源声明的规则做字面替换（镜像站会把原站名换成自己的）。 */
export function rewriteText(
  value: string,
  rules: ReadonlyArray<{ from: string; to: string }> | undefined,
): string {
  if (!rules?.length || !value) return value;
  return rules.reduce((text, rule) => text.split(rule.from).join(rule.to), value);
}

export function isAllowedHost(raw: string, allowedHosts: readonly string[]): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && allowedHosts.some((host) => (
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    ));
  } catch {
    return false;
  }
}

/**
 * 文章开头那一行「链接行」的标签词。
 *
 * 不少官方博客在正文最前面放一排跳转链接（技术报告 / GitHub / Hugging Face /
 * ModelScope / Discord）。RSS 的 description 把它们原样带进来，去掉 HTML 之后
 * 就变成一串裸词，于是每条摘要都以「Tech Report GitHub Hugging Face ModelScope
 * DISCORD」开头——实测 Qwen 的 30 条无一例外，摘要前 30 多个字符全是噪声。
 */
const LINK_ROW_LABELS = new Set([
  'github', 'hugging face', 'huggingface', 'modelscope', 'discord', 'twitter', 'x',
  'tech report', 'technical report', 'paper', 'papers', 'demo', 'api', 'blog', 'code',
  'colab', 'notebook', 'model', 'models', 'dataset', 'datasets', 'homepage', 'chat',
  'qwen chat', 'wechat', 'weibo', 'youtube',
  '技术报告', '论文', '演示', '主页', '代码', '模型', '数据集', '博客', '微信',
]);

/** 句末标点：出现即说明这一行是正文，不是链接行。 */
const SENTENCE_END = /[。．.!?！？]/;

/**
 * 去掉开头的链接行。
 *
 * 判据保守：只看**第一行**，且要求它不含句末标点、并且绝大部分词都是已知的
 * 链接标签。宁可漏掉几种没见过的写法，也不要把真正的首句当成链接行删掉——
 * 摘要的第一句往往是最重要的一句。
 */
export function stripLeadingLinkRow(text: string): string {
  const lines = text.split('\n');
  if (lines.length < 2) return text;

  const first = lines[0].trim();
  if (!first || first.length > 120 || SENTENCE_END.test(first)) return text;

  /*
   * 全大写的短行几乎必然是链接行：`QWEN CHAT GITHUB HUGGING FACE MODELSCOPE
   * DISCORD` 就是这种。正文首句极少全大写，再叠加「无句末标点 + 短」两个条件，
   * 误删风险很低。这条规则也覆盖了标签表里没有的产品名。
   */
  const letters = first.replace(/[^A-Za-z]/g, '');
  if (letters.length >= 4 && letters === letters.toUpperCase()) {
    return lines.slice(1).join('\n');
  }

  /*
   * 否则按已知标签剥离，看还剩多少。**必须按长度降序**：
   * 否则 `chat` 会先把 `qwen chat` 里的 chat 吃掉，导致多词标签再也匹配不上。
   */
  let rest = first.toLocaleLowerCase();
  for (const label of [...LINK_ROW_LABELS].sort((a, b) => b.length - a.length)) {
    rest = rest.split(label).join(' ');
  }
  const leftover = rest.replace(/[\s|·•,，、/\-—]+/g, '');
  // 剥完基本没剩东西才认定是链接行
  if (leftover.length > 2) return text;

  return lines.slice(1).join('\n');
}

/**
 * 清洗 feed 摘要。
 *
 * 与 `cleanExternalText` 的差别只有一处：在折叠空白**之前**先去掉开头的链接行。
 * 折叠之后行结构就没了，判断不出哪一段原本是独立的一行。
 */
export function cleanFeedSummary(raw: string, maxLength: number): string {
  const withoutCdata = raw.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '');
  const decoded = decodeXmlEntities(withoutCdata);
  // 去标签时把块级标签换成换行，保住行结构
  const text = decoded
    .replace(/<\/?(p|div|br|li|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, ' ');
  return cleanExternalText(stripLeadingLinkRow(text), maxLength);
}

export function cleanExternalText(raw: string, maxLength: number): string {
  const withoutCdata = raw.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '');
  const decoded = decodeXmlEntities(withoutCdata);
  const cleaned = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/**
 * 把 GitHub issue 正文（Markdown）压成可读的一句话摘要。
 *
 * `cleanExternalText` 是给 RSS 的 HTML 正文设计的，只剥标签；issue 正文是
 * Markdown，于是模板标题、代码围栏会原样漏到卡片上——线上实际出现过
 * 「### Version v23.6.0 ### Platform ```text Linux SMP Debian…」这样的摘要。
 *
 * 处理顺序有讲究：先整段删掉代码围栏（里面是日志和堆栈，永远不该当摘要），
 * 再去掉 issue 模板的固定结构（`### 小标题`、`_No response_`），
 * 最后才做行内标记的清理。剩下的正文太短就返回空，让卡片走
 * 「官方来源未提供摘要」那条如实说明的路径，而不是硬挤一段噪音出来。
 */
export function markdownToSummary(raw: string, maxLength: number): string {
  const withoutCode = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const lines = withoutCode.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    // issue 模板的骨架：小标题本身和「未填写」占位都不承载信息
    if (/^#{1,6}\s/.test(trimmed)) return false;
    if (/^_?no response_?$/i.test(trimmed)) return false;
    // issue 模板的勾选清单（「- [x] 我已搜索过既有 issue」）是提交者的自查项，
    // 不是内容；14 条真实摘要曾整段由它构成
    if (/^[-*+]\s*\[[ xX]\]/.test(trimmed)) return false;
    if (/^[-*_]{3,}$/.test(trimmed)) return false;
    if (/^\|.*\|$/.test(trimmed)) return false;
    return true;
  });

  const text = lines.join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*>+\s?/gm, '')
    .replace(/(\*\*|__|\*|~~)/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 剩下的还不足一句话时，宁可没有摘要
  if (text.length < 20) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function toIsoDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function contentHash(value: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function decodeXmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const hex = entity[1]?.toLowerCase() === 'x';
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}
