export const PATHFINDER_ITEM_TYPES = [
  'open-source',
  'competition',
  'internship',
  'ai-update',
] as const;

export const PATHFINDER_DIRECTIONS = ['ai', 'frontend', 'backend', 'data'] as const;
export const PATHFINDER_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'all'] as const;
export const PATHFINDER_DEVICES = ['phone', 'computer', 'either'] as const;
export const PATHFINDER_NETWORKS = ['low', 'normal', 'high'] as const;
export const PATHFINDER_REMOTE_STATUSES = ['remote', 'onsite', 'hybrid', 'unspecified'] as const;
export const PATHFINDER_ITEM_STATUSES = [
  'pending',
  'published',
  'rejected',
  'archived',
  'stale',
  'expired',
] as const;
export const PATHFINDER_TAG_DIMENSIONS = ['topic', 'skill', 'career', 'format'] as const;

export type PathfinderItemType = (typeof PATHFINDER_ITEM_TYPES)[number];
export type PathfinderDirection = (typeof PATHFINDER_DIRECTIONS)[number];
export type PathfinderDifficulty = (typeof PATHFINDER_DIFFICULTIES)[number];
export type PathfinderDevice = (typeof PATHFINDER_DEVICES)[number];
export type PathfinderNetwork = (typeof PATHFINDER_NETWORKS)[number];
export type PathfinderRemoteStatus = (typeof PATHFINDER_REMOTE_STATUSES)[number];
export type PathfinderItemStatus = (typeof PATHFINDER_ITEM_STATUSES)[number];
export type PathfinderTagDimension = (typeof PATHFINDER_TAG_DIMENSIONS)[number];
export type PathfinderCatalogOrigin = 'static' | 'database';
export type PathfinderSourceAdapter = 'manual' | 'github' | 'rss' | 'atom';
export type PathfinderSourceType = 'manual' | 'api' | 'rss' | 'atom' | 'html';
export type PathfinderTrustLevel = 'official' | 'verified';

export interface PathfinderLocalizedText {
  zh: string;
  en: string;
}

export interface PathfinderCatalogCost {
  /** null 表示官方未披露；0 表示免费。 */
  amount: number | null;
  /** ISO 4217 货币代码；金额未知时为 null。 */
  currency: string | null;
  /** 官方费用的补充说明，例如“不可退”；无补充时为 null。 */
  label: PathfinderLocalizedText | null;
}

export type PathfinderCatalogTags = Record<PathfinderTagDimension, string[]>;

export interface PathfinderCatalogSource {
  id: string;
  name: PathfinderLocalizedText;
  adapter: PathfinderSourceAdapter;
  siteUrl: string;
  sourceType: PathfinderSourceType;
  trustLevel: PathfinderTrustLevel;
  enabled: boolean;
  autoPublish: boolean;
  syncIntervalMinutes: number;
  lastSuccessAt: string | null;
  lastError: string | null;
  consecutiveFailures: number;
  origin: PathfinderCatalogOrigin;
}

export interface PathfinderCatalogItem {
  id: string;
  sourceId: string;
  source: PathfinderCatalogSource;
  externalId: string;
  canonicalUrl: string;
  itemType: PathfinderItemType;
  title: PathfinderLocalizedText;
  summary: PathfinderLocalizedText;
  organization: PathfinderLocalizedText;
  /** 主方向用于稳定排序和旧数据兼容；筛选与约束使用 directions。 */
  direction: PathfinderDirection;
  directions: PathfinderDirection[];
  difficulty: PathfinderDifficulty;
  estimatedMinutes: number | null;
  costCny: number | null;
  cost: PathfinderCatalogCost;
  device: PathfinderDevice;
  network: PathfinderNetwork;
  region: PathfinderLocalizedText | null;
  remoteStatus: PathfinderRemoteStatus;
  eligibility: PathfinderLocalizedText;
  deadlineText: PathfinderLocalizedText | null;
  /** 官方只公布日期时保存 YYYY-MM-DD，不伪造时刻或时区。 */
  deadlineDate: string | null;
  deadlineAt: string | null;
  publishedAt: string | null;
  discoveredAt: string;
  verifiedAt: string;
  status: PathfinderItemStatus;
  learningEligible: boolean;
  /** 资格包含画像未收集的学校、毕业日期等硬条件时，只供发现，不自动判定可行。 */
  requiresManualEligibilityCheck: boolean;
  tags: PathfinderCatalogTags;
  origin: PathfinderCatalogOrigin;
}

type OneOrMany<T> = T | readonly T[];

export interface ListCatalogItemsOptions {
  type?: OneOrMany<PathfinderItemType>;
  direction?: OneOrMany<PathfinderDirection>;
  difficulty?: OneOrMany<PathfinderDifficulty>;
  remoteStatus?: OneOrMany<PathfinderRemoteStatus>;
  learningEligible?: boolean;
  /** 只返回不晚于该 ISO 时间截止的条目；没有截止时间的条目会被排除。 */
  deadlineBefore?: string;
  /** 结果上限。非正数返回空数组；省略时不截断。 */
  limit?: number;
}

export function emptyPathfinderTags(): PathfinderCatalogTags {
  return { topic: [], skill: [], career: [], format: [] };
}
