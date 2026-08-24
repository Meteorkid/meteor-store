import type {
  PathfinderCatalogItem,
  PathfinderDifficulty,
  PathfinderItemType,
} from './catalog-types';
import { isCatalogItemFeasible } from './contract';
import { catalogDeadlineTimestamp } from './catalog-view';
import type { PathfinderProfile } from './schema';

export interface RankedPathfinderItem {
  item: PathfinderCatalogItem;
  score: number;
  reasons: string[];
}

export interface RankCatalogItemsOptions {
  now: Date;
  preferredItemId?: string;
}

const GOAL_TYPE_SCORES: Record<
  PathfinderProfile['goalType'],
  Record<PathfinderItemType, number>
> = {
  explore: { 'open-source': 28, competition: 12, internship: 10, 'ai-update': 0 },
  foundation: { 'open-source': 34, competition: 12, internship: 6, 'ai-update': 0 },
  project: { 'open-source': 34, competition: 18, internship: 10, 'ai-update': 0 },
  competition: { 'open-source': 20, competition: 38, internship: 6, 'ai-update': 0 },
  internship: { 'open-source': 18, competition: 10, internship: 38, 'ai-update': 0 },
  research: { 'open-source': 30, competition: 18, internship: 8, 'ai-update': 0 },
};

const FOUNDATION_DIFFICULTY_SCORES: Record<
  PathfinderProfile['foundation'],
  Record<PathfinderDifficulty, number>
> = {
  none: { beginner: 22, intermediate: 2, advanced: -18, all: 16 },
  beginner: { beginner: 20, intermediate: 10, advanced: -8, all: 16 },
  intermediate: { beginner: 8, intermediate: 22, advanced: 10, all: 16 },
  advanced: { beginner: 4, intermediate: 12, advanced: 22, all: 16 },
};

const GOAL_SIGNAL_GROUPS: ReadonlyArray<{
  goal: readonly string[];
  item: readonly string[];
}> = [
  { goal: ['rag', '检索增强', '知识库', '问答系统'], item: ['retrieval', '检索', 'langchain', 'llm-apps', '向量'] },
  { goal: ['图像', '视觉', '分类', '目标检测', 'computer vision'], item: ['vision', '视觉', '图像', 'multimodal', 'pytorch', 'deep-learning', 'transformers'] },
  { goal: ['智能体', 'agent', '工具调用'], item: ['agent', 'agents', 'tool use', '工具调用', 'langchain'] },
  { goal: ['大模型', 'llm', '生成式'], item: ['llm', 'foundation-models', 'transformers', '大模型', '预训练模型'] },
  { goal: ['数据分析', 'sql', '报表', '可视化'], item: ['data-analysis', 'analytics', 'sql', 'pandas', 'visualization', '数据分析'] },
  { goal: ['后端', 'api', '服务端'], item: ['backend', 'api', 'server', 'web-framework', '后端'] },
  { goal: ['前端', '网页', '界面', 'react', 'vue'], item: ['frontend', 'ui', 'react', 'vue', 'css', '前端'] },
];

function freshnessScore(item: PathfinderCatalogItem, now: Date): number {
  const verifiedAt = Date.parse(item.verifiedAt);
  if (!Number.isFinite(verifiedAt)) return 0;

  const ageDays = Math.max(0, Math.floor((now.getTime() - verifiedAt) / 86_400_000));
  if (ageDays <= 30) return 8;
  if (ageDays <= 90) return 6;
  if (ageDays <= 180) return 4;
  if (ageDays <= 365) return 2;
  return 0;
}

function goalRelevanceScore(goal: string, item: PathfinderCatalogItem): number {
  const normalizedGoal = goal.toLocaleLowerCase();
  const haystack = [
    item.title.zh,
    item.title.en,
    item.summary.zh,
    item.summary.en,
    ...Object.values(item.tags).flat(),
  ].join(' ').toLocaleLowerCase();
  let score = 0;

  const titles = [item.title.zh, item.title.en]
    .map((title) => title.toLocaleLowerCase().trim())
    .filter((title) => title.length >= 2);
  if (titles.some((title) => normalizedGoal.includes(title))) score += 32;

  const tagMatches = Object.values(item.tags).flat().filter((tag) => {
    const normalizedTag = tag.toLocaleLowerCase().trim();
    return normalizedTag.length >= 2 && normalizedGoal.includes(normalizedTag);
  }).length;
  score += Math.min(24, tagMatches * 8);

  for (const group of GOAL_SIGNAL_GROUPS) {
    if (
      group.goal.some((signal) => normalizedGoal.includes(signal))
      && group.item.some((signal) => haystack.includes(signal))
    ) {
      score += 28;
    }
  }
  return Math.min(60, score);
}

function compareStable(a: RankedPathfinderItem, b: RankedPathfinderItem): number {
  if (a.score !== b.score) return b.score - a.score;

  const safeADeadline = catalogDeadlineTimestamp(a.item) ?? Number.POSITIVE_INFINITY;
  const safeBDeadline = catalogDeadlineTimestamp(b.item) ?? Number.POSITIVE_INFINITY;
  if (safeADeadline !== safeBDeadline) return safeADeadline - safeBDeadline;

  if (a.item.id < b.item.id) return -1;
  if (a.item.id > b.item.id) return 1;
  return 0;
}

/**
 * 对已经规范化的目录条目执行过滤和稳定排序。
 * 相同输入、相同 now 必定得到相同结果，不依赖模型或随机数。
 */
export function rankCatalogItems(
  items: readonly PathfinderCatalogItem[],
  profile: PathfinderProfile,
  options: RankCatalogItemsOptions,
): RankedPathfinderItem[] {
  const now = options.now;
  const weeklyMinutes = profile.weeklyHours * 60;
  const pathMinutes = weeklyMinutes * profile.durationWeeks;

  return items
    .filter((item) => isCatalogItemFeasible(item, profile, now))
    .map((item): RankedPathfinderItem => {
      const reasons: string[] = [];
      let score = 30;

      const goalScore = GOAL_TYPE_SCORES[profile.goalType][item.itemType];
      score += goalScore;
      reasons.push(`目标类型匹配 +${goalScore}`);

      const difficultyScore = FOUNDATION_DIFFICULTY_SCORES[profile.foundation][item.difficulty];
      score += difficultyScore;
      reasons.push(`难度衔接 ${difficultyScore >= 0 ? '+' : ''}${difficultyScore}`);

      const relevanceScore = goalRelevanceScore(profile.goal, item);
      score += relevanceScore;
      if (relevanceScore > 0) reasons.push(`目标关键词匹配 +${relevanceScore}`);

      if (profile.constraints.includes('weak-foundation')) {
        const weakFoundationScore = item.difficulty === 'beginner' || item.difficulty === 'all'
          ? 8
          : item.difficulty === 'advanced'
            ? -10
            : 0;
        score += weakFoundationScore;
        if (weakFoundationScore !== 0) {
          reasons.push(`弱基础适配 ${weakFoundationScore > 0 ? '+' : ''}${weakFoundationScore}`);
        }
      }

      const trustScore = item.source.trustLevel === 'official' ? 18 : 12;
      score += trustScore;
      reasons.push(`来源可信 +${trustScore}`);

      const verifiedFreshness = freshnessScore(item, now);
      score += verifiedFreshness;
      if (verifiedFreshness > 0) reasons.push(`近期核验 +${verifiedFreshness}`);

      if (item.cost.amount === 0) {
        const freeScore = profile.constraints.includes('limited-budget') ? 16 : 10;
        score += freeScore;
        reasons.push(`零费用 +${freeScore}`);
      } else if (item.cost.amount !== null && item.cost.currency === 'CNY') {
        const affordabilityScore = item.cost.amount <= profile.budgetCny / 2 ? 6 : 3;
        score += affordabilityScore;
        reasons.push(`预算适配 +${affordabilityScore}`);
      }

      if (item.estimatedMinutes !== null) {
        const timeScore = item.estimatedMinutes <= weeklyMinutes
          ? 8
          : item.estimatedMinutes <= pathMinutes
            ? 4
            : -6;
        score += timeScore;
        reasons.push(`时间适配 ${timeScore >= 0 ? '+' : ''}${timeScore}`);
      }

      if (profile.goalType === 'research' && item.tags.career.includes('research')) {
        score += 16;
        reasons.push('研究方向标签 +16');
      }

      if (options.preferredItemId === item.id) {
        score += 100;
        reasons.push('用户指定起点 +100');
      }

      return { item, score, reasons };
    })
    .sort(compareStable);
}
