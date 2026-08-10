import type { FeedPostSummary } from '@/data/blog-feed';

export interface RelatedPost extends FeedPostSummary {
  reason: string;
}

/**
 * 按共同标签优先、分区重叠、时间接近度排序，排除自身，取最多 limit 篇。
 * "小星官"相关阅读的数据层：真实关系驱动，不拼凑装饰连线。
 */
export function getRelatedPosts(
  current: { href: string; sections: string[]; tags: string[] },
  pool: FeedPostSummary[],
  limit = 3,
): RelatedPost[] {
  const candidates = pool.filter((p) => p.href !== current.href);

  const scored = candidates.map((p) => {
    const sharedTags = p.tags.filter((t) => current.tags.includes(t));
    const sharedSections = p.sections
      ? p.sections.filter((s: string) => current.sections.includes(s))
      : [];

    const tagScore = sharedTags.length * 100;
    const sectionScore = sharedSections.length * 50;
    // 时间接近度：越近分数越高，最多加 10 分
    const timeScore = Math.max(0, 10 - Math.abs(
      new Date(p.date).getTime() - new Date(current.href ? '' : '').getTime()
    ) / (1000 * 60 * 60 * 24 * 30)); // 每月差 1 分

    let reason = '';
    if (sharedTags.length > 0) reason = `tag:${sharedTags[0]}`;
    else if (sharedSections.length > 0) reason = `section:${sharedSections[0]}`;

    return {
      post: p,
      score: tagScore + sectionScore + timeScore,
      reason,
    };
  });

  scored.sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date));

  return scored.slice(0, limit).map(({ post, reason }) => ({
    ...post,
    reason,
  }));
}
