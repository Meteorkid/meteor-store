import snapshot from './product-releases.json';

/**
 * 产品更新日志的数据层。
 *
 * **为什么有快照**：正文来自 GitHub Releases，构建时要发一次网络请求。
 * 请求失败（限流、DNS 抖动、GitHub 故障）不能让页面变成一个空白日志——
 * 那比没有这一页更糟，因为它已经进了 sitemap。所以提交一份精简快照兜底：
 * 快照只有版本、日期、链接和摘要，没有完整正文。正常构建走网络拿全文。
 *
 * 快照刷新方式：`node scripts/sync-product-releases.mjs`（需要已登录的 gh）。
 * 不自动刷新是刻意的——它会写进 git，应该在发版后人工确认一次再提交。
 */

export interface ReleaseEntry {
  tag: string;
  name: string;
  published: string;
  url: string;
  prerelease: boolean;
  /** 运行时是完整 Markdown；快照兜底时是截断的摘要。页面不区分来源。 */
  body: string;
}

export type ReleaseSource = 'github' | 'snapshot';

/**
 * 只有这些产品生成 `/products/{id}/changelog`。
 *
 * 白名单而不是「所有带 github 字段的产品」：其余产品的 release 说明不是按用户
 * 可读的方式写的，直接铺成页面会是薄内容。要加产品，先确认正文可读。
 */
export const CHANGELOG_PRODUCT_IDS = ['xisland', 'xnook'] as const;
export type ChangelogProductId = (typeof CHANGELOG_PRODUCT_IDS)[number];

const REPO_BY_PRODUCT: Record<ChangelogProductId, string> = {
  xisland: 'Meteorkid/XIsland',
  xnook: 'Meteorkid/XNook',
};

export function isChangelogProduct(id: string): id is ChangelogProductId {
  return (CHANGELOG_PRODUCT_IDS as readonly string[]).includes(id);
}

/**
 * 正文里最多展示多少个版本的全文，其余只列摘要行。
 *
 * 定在 6 是实测出来的：10 个全文让页面 gzip 后约 110KB，是产品页（79KB）的 1.4 倍，
 * 移动端 LCP 会明显吃亏；6 个仍然覆盖最近一个季度的改动，更早的用一行摘要 + 原文链接
 * 承接，信息没有丢失，只是不在首屏竞争带宽。
 */
export const FULL_BODY_LIMIT = 6;

type RawRelease = {
  tag_name?: string;
  name?: string | null;
  published_at?: string | null;
  html_url?: string;
  prerelease?: boolean;
  draft?: boolean;
  body?: string | null;
};

function normalize(raw: RawRelease): ReleaseEntry {
  const tag = raw.tag_name ?? '';
  return {
    tag,
    name: raw.name || tag,
    published: (raw.published_at ?? '').slice(0, 10),
    url: raw.html_url ?? '',
    prerelease: Boolean(raw.prerelease),
    body: (raw.body ?? '').trim(),
  };
}

function fromSnapshot(productId: ChangelogProductId): ReleaseEntry[] {
  const rows = (snapshot as Record<string, Array<Record<string, unknown>>>)[productId] ?? [];
  return rows.map((row) => ({
    tag: String(row.tag ?? ''),
    name: String(row.name ?? row.tag ?? ''),
    published: String(row.published ?? ''),
    url: String(row.url ?? ''),
    prerelease: Boolean(row.prerelease),
    body: String(row.summary ?? ''),
  }));
}

/**
 * 取某个产品的 release 列表（按发布时间降序）。
 *
 * 网络请求带 1 小时 revalidate，页面本身也是 ISR，新发版最迟一小时内出现。
 * 失败一律回退快照，不抛错——更新日志读不到不该让整页 500。
 */
export async function getProductReleases(
  productId: ChangelogProductId,
): Promise<{ entries: ReleaseEntry[]; source: ReleaseSource }> {
  const repo = REPO_BY_PRODUCT[productId];
  const token = process.env.GITHUB_TOKEN?.trim();

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'meteor-store-changelog',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const raw = (await response.json()) as RawRelease[];
    const entries = raw
      .filter((item) => !item.draft && item.tag_name)
      .map(normalize)
      .sort((a, b) => b.published.localeCompare(a.published));
    if (entries.length === 0) throw new Error('GitHub 返回空列表');
    return { entries, source: 'github' };
  } catch {
    return { entries: fromSnapshot(productId), source: 'snapshot' };
  }
}

/**
 * 把 release 正文整理成可嵌入页面的 Markdown。
 *
 * 三件事，都是为了不让第三方文本破坏页面结构：
 * 1. 去掉开头的 `# 标题`——页面自己渲染版本标题，正文再来一个 H1 会出现两个主标题；
 * 2. 其余标题整体降两级（`##` → `####`），保证页面里 `h2` 只有本站写的那些；
 * 3. 去掉正文里的图片。release note 的截图没有 alt、尺寸不可控，铺进更新日志会把版面撑变形。
 */
export function prepareReleaseBody(body: string): string {
  const lines = body.split('\n');
  const out: string[] = [];
  let droppedTitle = false;
  // 代码块里也有以 # 开头的行（shell 注释、JSON 里的键说明），
  // 不跟踪围栏就会把它们降级成标题，渲染出来是一堆乱码。
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (!droppedTitle && /^#\s+/.test(line)) {
      droppedTitle = true;
      continue;
    }
    if (/^!\[[^\]]*\]\([^)]*\)\s*$/.test(line.trim())) continue;
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6);
      out.push(`${'#'.repeat(level)} ${heading[2]}`);
      continue;
    }
    out.push(line);
  }
  return out.join('\n').trim();
}

/** 取正文第一段可读文字，用于「更早的版本」列表里的一行摘要。 */
export function releaseSummary(body: string, limit = 110): string {
  const cleaned = prepareReleaseBody(body)
    .split('\n')
    // 跳过标题、列表符号、代码块围栏，只留真正的句子
    .map((line) => line.replace(/^[#>\-*\s]+/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('```'))
    .join(' ');
  return cleaned.length > limit ? `${cleaned.slice(0, limit)}…` : cleaned;
}

/** 页面文案。与数据同文件，避免版本数在多处各写一遍。 */
export const changelogCopy = {
  zh: {
    eyebrow: 'Changelog',
    title: (name: string) => `${name} 更新日志`,
    metaDescription: (name: string, count: number) =>
      `${name} 全部 ${count} 个版本的更新记录：每个版本改了什么、什么时候发布，逐条可核对到 GitHub Release。`,
    intro: (count: number) =>
      `这里记录 ${count} 个版本的改动，最新的排在前面。每一条都能点开对应的 GitHub Release 核对原文。`,
    latestLabel: '最近版本',
    olderLabel: '更早的版本',
    olderIntro: '早期版本的完整说明请点开对应版本查看，这里只保留一行摘要。',
    allReleases: '在 GitHub 查看全部版本',
    sourceGithub: '本页实时读取 GitHub Releases，缓存一小时。',
    sourceSnapshot: '暂时无法读取 GitHub，本页显示最近一次同步的快照（只含摘要）。',
    prerelease: '预发布',
    noDate: '未标注日期',
    backToProduct: '回到产品页',
  },
  en: {
    eyebrow: 'Changelog',
    title: (name: string) => `${name} changelog`,
    metaDescription: (name: string, count: number) =>
      `Every release of ${name} — ${count} versions, what changed in each and when it shipped, each one checkable against its GitHub Release.`,
    intro: (count: number) =>
      `All ${count} releases, newest first. Every entry links to the original GitHub Release so you can check the source.`,
    latestLabel: 'Recent releases',
    olderLabel: 'Earlier releases',
    olderIntro: 'Earlier notes are summarised to one line; open the release for the full text.',
    allReleases: 'See every release on GitHub',
    sourceGithub: 'This page reads GitHub Releases directly, cached for one hour.',
    sourceSnapshot: 'GitHub is unreachable right now, so this is the last synced snapshot (summaries only).',
    prerelease: 'Pre-release',
    noDate: 'No date',
    backToProduct: 'Back to the product page',
  },
} as const;

