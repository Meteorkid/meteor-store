import type { PathfinderCatalogItem } from './catalog-types';
import { catalogDeadlineTimestamp } from './catalog-view';
import type { PathfinderProfile } from './schema';

export type RealityRule =
  | 'publication'
  | 'learning-eligibility'
  | 'eligibility'
  | 'content-type'
  | 'deadline'
  | 'direction'
  | 'device'
  | 'network'
  | 'budget'
  | 'foundation'
  | 'stage';

export interface RealityViolation {
  rule: RealityRule;
  message: string;
}

const USER_NETWORK_CAPACITY: Record<PathfinderProfile['network'], number> = {
  'limited-data': 0,
  normal: 1,
  stable: 2,
};

const ITEM_NETWORK_REQUIREMENT: Record<PathfinderCatalogItem['network'], number> = {
  low: 0,
  normal: 1,
  high: 2,
};

const FOUNDATION_DIFFICULTY_ALLOWED: Record<
  PathfinderProfile['foundation'],
  ReadonlySet<PathfinderCatalogItem['difficulty']>
> = {
  none: new Set(['beginner', 'all']),
  beginner: new Set(['beginner', 'intermediate', 'all']),
  intermediate: new Set(['beginner', 'intermediate', 'advanced', 'all']),
  advanced: new Set(['beginner', 'intermediate', 'advanced', 'all']),
};

const STAGE_TAGS = new Set<PathfinderProfile['stage']>([
  'freshman',
  'sophomore',
  'junior',
  'senior',
  'postgraduate',
]);

function hasObviousStageMismatch(
  item: PathfinderCatalogItem,
  stage: PathfinderProfile['stage'],
): boolean {
  const careerTags = item.tags.career.map((tag) => tag.toLowerCase());
  const explicitStages = careerTags.filter(
    (tag): tag is PathfinderProfile['stage'] => STAGE_TAGS.has(tag as PathfinderProfile['stage']),
  );

  if (explicitStages.length > 0) return !explicitStages.includes(stage);

  if (careerTags.includes('postgraduate') && stage !== 'postgraduate') {
    return true;
  }
  if (careerTags.includes('undergraduate') && stage === 'postgraduate') {
    return true;
  }

  const eligibility = `${item.eligibility.zh} ${item.eligibility.en}`.toLowerCase();
  if (/仅限研究生|只面向研究生|postgraduates? only/.test(eligibility)) {
    return stage !== 'postgraduate';
  }
  if (/仅限本科生|只面向本科生|undergraduates? only/.test(eligibility)) {
    return stage === 'postgraduate';
  }

  return false;
}

/**
 * 检查一个目录条目能否在学生当前条件下成为路径任务。
 *
 * 这是确定性现实约束边界：只依据结构化目录事实，不猜测未知费用、资格或截止时间。
 */
export function catalogItemViolations(
  item: PathfinderCatalogItem,
  profile: PathfinderProfile,
  now: Date,
): RealityViolation[] {
  const violations: RealityViolation[] = [];

  if (item.status !== 'published') {
    violations.push({ rule: 'publication', message: '条目尚未发布。' });
  }
  if (!item.learningEligible) {
    violations.push({ rule: 'learning-eligibility', message: '条目未获准用于学习路径。' });
  }
  if (item.requiresManualEligibilityCheck) {
    violations.push({ rule: 'eligibility', message: '条目还有学校、毕业日期等画像未覆盖的硬资格，必须先在官网人工核对。' });
  }
  if (item.itemType === 'ai-update') {
    violations.push({ rule: 'content-type', message: 'AI 动态只用于了解方向，不作为学习任务。' });
  }
  if (!item.directions.includes(profile.direction)) {
    violations.push({ rule: 'direction', message: '条目方向与学生选择的方向不一致。' });
  }
  if (!FOUNDATION_DIFFICULTY_ALLOWED[profile.foundation].has(item.difficulty)) {
    violations.push({ rule: 'foundation', message: '条目难度超过学生当前基础，且目录中没有可验证的前置衔接。' });
  }

  const deadline = catalogDeadlineTimestamp(item, true);
  if (deadline !== null && deadline < now.getTime()) {
    violations.push({ rule: 'deadline', message: '条目截止时间已过。' });
  }

  if (profile.device === 'phone-only' && item.device === 'computer') {
    violations.push({ rule: 'device', message: '条目需要电脑，但学生当前只有手机。' });
  }

  if (ITEM_NETWORK_REQUIREMENT[item.network] > USER_NETWORK_CAPACITY[profile.network]) {
    violations.push({ rule: 'network', message: '条目所需网络条件超过学生当前可用条件。' });
  }

  if (
    item.cost.amount !== null
    && item.cost.amount > 0
    && item.cost.currency === 'CNY'
    && item.cost.amount > profile.budgetCny
  ) {
    violations.push({ rule: 'budget', message: '条目已知费用超过学生预算。' });
  }
  if (
    item.cost.amount !== null
    && item.cost.amount > 0
    && item.cost.currency !== 'CNY'
    && !profile.acceptForeignCurrencyCosts
  ) {
    violations.push({ rule: 'budget', message: '条目包含外币费用，但学生尚未明确接受外币支出。' });
  }

  if (hasObviousStageMismatch(item, profile.stage)) {
    violations.push({ rule: 'stage', message: '条目的明确资格与学生阶段不符。' });
  }

  return violations;
}

export function isCatalogItemFeasible(
  item: PathfinderCatalogItem,
  profile: PathfinderProfile,
  now: Date,
): boolean {
  return catalogItemViolations(item, profile, now).length === 0;
}
