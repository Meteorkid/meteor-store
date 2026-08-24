import type { PathfinderCatalogItem } from './catalog-types';

/**
 * 相关条目聚合。
 *
 * 解决的是一个具体的阅读问题：同一条线索会被反复发布——「Testing ads in ChatGPT」
 * 之后是「ChatGPT Ads expands across Europe」，「Gemini 3.6 Flash」之后是
 * 「Gemini API…3.6 Flash」。列表里它们各占一行，读者看完第三条才发现是同一件事。
 *
 * **刻意不叫「事件簇」**。真正的「同一事件多来源」需要有媒体来源互相报道，
 * 而 Pathfinder 的来源全是一手企业博客，各自只发自己的事（实测 90 条 AI 动态
 * 没有一组跨机构的同事件报道）。把「相关」写成「同一事件」是对读者的误导，
 * 所以这里只声明能证明的东西：这几条讲的是同一条线索。
 *
 * 判定必须保守——错误合并两条无关内容，比漏掉一组相关内容糟糕得多：
 * 前者是把信息说错，后者只是没帮上忙。
 */

/** 参与聚合的最大条目数，避免 O(n²) 在目录长大后变成同步渲染里的隐形开销。 */
const MAX_ITEMS = 400;

/** 通用词不承载线索，出现再多次也说明不了两条内容有关系。 */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'you', 'your', 'our', 'its',
  'new', 'now', 'how', 'why', 'what', 'who', 'when', 'into', 'out', 'more', 'most',
  'are', 'was', 'were', 'has', 'have', 'had', 'can', 'will', 'not', 'all', 'any',
  'introducing', 'announcing', 'update', 'updates', 'news', 'blog', 'post',
  'using', 'used', 'use', 'about', 'across', 'through', 'over', 'under',
  'ways', 'way', 'guide', 'building', 'built', 'build', 'make', 'makes',
  'ai', 'model', 'models',
]);

export interface TitleTokens {
  all: Set<string>;
  /**
   * 专名词：产品名、机构名、版本号。
   *
   * 这是把「同一条线索」和「碰巧用了同样措辞」分开的关键判据。
   * 实测语料里，「Putting sign language AI into users' hands」与
   * 「Putting frontier cyber models in more trusted hands」共享 putting、hands
   * 两个稀有词，但它们毫无关系；而真正相关的几组共享的都是
   * ChatGPT、Gemini、Copilot、GPT-5.6 这类专名。所以判定要求
   * **至少有一个共享词是专名**，只靠措辞重合不算。
   */
  proper: Set<string>;
}

/**
 * 标题分词。
 *
 * 拉丁词取长度 ≥ 3 的词；中文没有空格，取二元组（bigram）——
 * 「模型发布」会得到「模型」「型发」「发布」，足以让讲同一件事的标题重叠，
 * 又不需要引入分词库。
 *
 * 专名判定用「标题中部出现的大写词」：来源标题基本是句式大小写
 * （sentence case），句中还大写的多半是产品名或机构名。首词不算——
 * 它天然大写。带数字的词（gpt-5.6、3.5）一律算专名，中文没有大小写，
 * 全部视为可用于判定。
 */
export function titleTokens(title: string): TitleTokens {
  const all = new Set<string>();
  const proper = new Set<string>();

  const words = title.match(/[A-Za-z][A-Za-z0-9+.-]*/g) ?? [];
  words.forEach((word, index) => {
    const trimmed = word.replace(/[.+-]+$/, '').toLocaleLowerCase();
    if (trimmed.length < 3 || STOPWORDS.has(trimmed)) return;
    all.add(trimmed);
    const capitalizedMidTitle = index > 0 && /^[A-Z]/.test(word);
    if (capitalizedMidTitle || /\d/.test(trimmed)) proper.add(trimmed);
  });

  for (const run of title.match(/[一-鿿]{2,}/g) ?? []) {
    for (let index = 0; index + 1 < run.length; index += 1) {
      const bigram = run.slice(index, index + 2);
      all.add(bigram);
      proper.add(bigram);
    }
  }

  return { all, proper };
}

export interface PathfinderRelatedGroup {
  /** 组内代表条目：优先一手来源，其次发布更早的那条（线索的起点） */
  primary: PathfinderCatalogItem;
  items: PathfinderCatalogItem[];
  /** 一手来源（官方发布）条目数 */
  firstHand: number;
  /** 转述 / 交叉核验来源条目数 */
  secondHand: number;
  /** 组内不同来源机构数 */
  sources: number;
}

interface Options {
  /** 两条内容相隔多久之内才可能是同一条线索 */
  windowDays?: number;
  /** 判定为相关所需的稀有词重叠数 */
  minRareOverlap?: number;
}

function itemTime(item: PathfinderCatalogItem): number {
  const value = Date.parse(item.publishedAt ?? item.discoveredAt);
  return Number.isFinite(value) ? value : 0;
}

/**
 * 把条目按线索分组。只处理传入的这批条目，不自己查库。
 *
 * 判定：时间窗内 + 共享至少 `minRareOverlap` 个稀有词。
 * 稀有词 = 在这批条目里出现频率不超过 10% 的词——「chatgpt」「google」这种
 * 每隔一条就出现的词说明不了任何关系，「luna」「weathernext」才是线索本身。
 */
export function groupRelatedItems(
  items: readonly PathfinderCatalogItem[],
  { windowDays = 30, minRareOverlap = 2 }: Options = {},
): PathfinderRelatedGroup[] {
  const pool = items.filter((item) => item.status === 'published').slice(0, MAX_ITEMS);
  if (pool.length < 2) return [];

  const tokensByIndex = pool.map((item) => titleTokens(item.title.en || item.title.zh));
  const documentFrequency = new Map<string, number>();
  for (const tokens of tokensByIndex) {
    for (const token of tokens.all) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }
  // 下限必须是 2：只被比较的这两条共享的词，文档频率恰好就是 2。
  // 写成 max(1, …) 时，条目少于 20 条的目录里没有任何词算得上「稀有」，
  // 整个聚合会静默失效——小语料下不报错、不聚合、也看不出哪里不对。
  const rareCeiling = Math.max(2, Math.floor(pool.length * 0.1));
  const rareTokens = tokensByIndex.map((tokens) => new Set(
    [...tokens.all].filter((token) => (documentFrequency.get(token) ?? 0) <= rareCeiling),
  ));

  // 并查集：A 与 B 相关、B 与 C 相关时，三条属于同一条线索
  const parent = pool.map((_, index) => index);
  const find = (index: number): number => {
    let root = index;
    while (parent[root] !== root) root = parent[root];
    for (let cursor = index; parent[cursor] !== root; ) {
      const next = parent[cursor];
      parent[cursor] = root;
      cursor = next;
    }
    return root;
  };
  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  };

  const windowMs = windowDays * 86_400_000;
  for (let i = 0; i < pool.length; i += 1) {
    for (let j = i + 1; j < pool.length; j += 1) {
      if (Math.abs(itemTime(pool[i]) - itemTime(pool[j])) > windowMs) continue;
      let overlap = 0;
      let sharedProperNoun = false;
      for (const token of rareTokens[i]) {
        if (!rareTokens[j].has(token)) continue;
        overlap += 1;
        // 专名可以只在其中一侧被识别出来：同一个产品名在一条标题里位于句首、
        // 在另一条里位于句中，只有后者能靠大写判出来
        if (tokensByIndex[i].proper.has(token) || tokensByIndex[j].proper.has(token)) {
          sharedProperNoun = true;
        }
      }
      if (overlap >= minRareOverlap && sharedProperNoun) union(i, j);
    }
  }

  const byRoot = new Map<number, PathfinderCatalogItem[]>();
  for (let index = 0; index < pool.length; index += 1) {
    const root = find(index);
    const bucket = byRoot.get(root) ?? [];
    bucket.push(pool[index]);
    byRoot.set(root, bucket);
  }

  return [...byRoot.values()]
    .filter((group) => group.length > 1)
    .map((group) => {
      const ordered = [...group].sort((a, b) => itemTime(b) - itemTime(a) || a.id.localeCompare(b.id));
      const firstHand = ordered.filter((item) => item.source.trustLevel === 'official').length;
      return {
        // 代表条目取一手来源里最早的那条：线索的起点通常是官方那次发布
        primary: [...ordered]
          .sort((a, b) => (
            Number(b.source.trustLevel === 'official') - Number(a.source.trustLevel === 'official')
            || itemTime(a) - itemTime(b)
            || a.id.localeCompare(b.id)
          ))[0],
        items: ordered,
        firstHand,
        secondHand: ordered.length - firstHand,
        sources: new Set(ordered.map((item) => item.sourceId)).size,
      };
    })
    .sort((a, b) => b.items.length - a.items.length
      || a.primary.id.localeCompare(b.primary.id));
}

/** 找出与某条条目同线索的其它条目，按时间倒序。 */
export function findRelatedItems(
  item: PathfinderCatalogItem,
  items: readonly PathfinderCatalogItem[],
  options: Options = {},
): PathfinderCatalogItem[] {
  const group = groupRelatedItems(items, options)
    .find((candidate) => candidate.items.some((member) => member.id === item.id));
  return group ? group.items.filter((member) => member.id !== item.id) : [];
}
