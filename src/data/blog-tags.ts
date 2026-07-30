
/**
 * 标签聚合。
 *
 * 分区（blog-sections）是稳定骨架，数量固定、可收藏、可 SEO；
 * 标签是动态层，数量会随内容无限增长，按热度排序。两者互补，不要合并。
 *
 * 这里只提供纯函数。文件文章与读者投稿的合并在 blog-feed，
 * 那一层是 async 的（要读数据库），下游一律从那里取标签。
 */

export interface TagSummary {
  /** 展示用的写法，取该标签出现次数最多的那种大小写 */
  label: string;
  /** 匹配用的归一化键 */
  key: string;
  count: number;
  href: string;
}

/** 大小写与首尾空格不应该把同一个标签拆成两个 */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/** 标签直接进 URL，中文与空格由 encodeURIComponent 处理 */
export function tagHref(label: string): string {
  return `/blog/tag/${encodeURIComponent(label)}`;
}

/** 输入是任何带 tags 的文章，来源不限 */
export function buildTagIndex(posts: { tags: string[] }[]): TagSummary[] {
  // key -> { 各种大小写写法的出现次数, 总数 }
  const buckets = new Map<string, { labels: Map<string, number>; count: number }>();

  for (const post of posts) {
    // 同一篇文章里重复写同一个标签只算一次
    const seen = new Set<string>();
    for (const raw of post.tags) {
      const key = normalizeTag(raw);
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const bucket = buckets.get(key) ?? { labels: new Map(), count: 0 };
      bucket.count += 1;
      bucket.labels.set(raw.trim(), (bucket.labels.get(raw.trim()) ?? 0) + 1);
      buckets.set(key, bucket);
    }
  }

  return Array.from(buckets.entries())
    .map(([key, { labels, count }]) => {
      const label = Array.from(labels.entries()).sort((a, b) => b[1] - a[1])[0][0];
      return { key, label, count, href: tagHref(label) };
    })
    // 热度降序；同热度按名称排，保证顺序稳定（否则每次构建顺序可能不同）
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh'));
}
