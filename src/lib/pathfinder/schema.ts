import { z } from 'zod';

import { PATHFINDER_DIRECTIONS } from './catalog-types';

/** 大学生所在学习阶段。 */
export const PATHFINDER_STAGE_VALUES = [
  'freshman',
  'sophomore',
  'junior',
  'senior',
  'postgraduate',
] as const;

/** 本次路径希望解决的问题。 */
export const PATHFINDER_GOAL_TYPE_VALUES = [
  'explore',
  'foundation',
  'project',
  'competition',
  'internship',
  'research',
] as const;

/** 当前基础，用于控制条目难度的递进。 */
export const PATHFINDER_FOUNDATION_VALUES = [
  'none',
  'beginner',
  'intermediate',
  'advanced',
] as const;

/** 用户实际可使用的设备。 */
export const PATHFINDER_PROFILE_DEVICE_VALUES = [
  'phone-only',
  'phone-and-pc',
  'pc',
] as const;

/** 用户可承受的网络条件。 */
export const PATHFINDER_PROFILE_NETWORK_VALUES = [
  'limited-data',
  'normal',
  'stable',
] as const;

/** 会改变路径安排方式的现实限制。 */
export const PATHFINDER_CONSTRAINT_VALUES = [
  'fragmented-time',
  'weak-foundation',
  'no-mentor',
  'limited-budget',
] as const;

export const PATHFINDER_PHASE_VALUES = [
  'prepare',
  'practice',
  'real-action',
  'deliver',
  'review',
] as const;

export const PathfinderProfileSchema = z.object({
  goal: z
    .string()
    .trim()
    .min(2, '请描述你的目标，至少 2 个字')
    .max(280, '目标描述不超过 280 字'),
  goalType: z.enum(PATHFINDER_GOAL_TYPE_VALUES),
  direction: z.enum(PATHFINDER_DIRECTIONS),
  stage: z.enum(PATHFINDER_STAGE_VALUES),
  foundation: z.enum(PATHFINDER_FOUNDATION_VALUES),
  weeklyHours: z
    .number()
    .int('每周时间必须是整数小时')
    .min(1, '每周至少投入 1 小时')
    .max(30, '每周最多按 30 小时规划'),
  durationWeeks: z
    .number()
    .int('路径周数必须是整数')
    .min(4, '路径至少持续 4 周')
    .max(8, '路径最多持续 8 周')
    .default(6),
  device: z.enum(PATHFINDER_PROFILE_DEVICE_VALUES),
  budgetCny: z
    .number()
    .int('预算必须是整数元')
    .min(0, '预算不能小于 0')
    .max(100_000, '预算数值过大'),
  acceptForeignCurrencyCosts: z.boolean().default(false),
  network: z.enum(PATHFINDER_PROFILE_NETWORK_VALUES),
  constraints: z
    .array(z.enum(PATHFINDER_CONSTRAINT_VALUES))
    .max(PATHFINDER_CONSTRAINT_VALUES.length)
    .default([]),
});

export type PathfinderProfile = z.infer<typeof PathfinderProfileSchema>;

/** 新旧两个 POST 路由共享的请求契约。 */
export const PathfinderPlanRequestSchema = z.object({
  profile: PathfinderProfileSchema,
  preferredItemId: z.string().trim().min(1).max(160).optional(),
  locale: z.enum(['zh', 'en']).default('zh'),
});

export type PathfinderPlanRequest = z.infer<typeof PathfinderPlanRequestSchema>;

export const PathfinderPlanTaskSchema = z.object({
  id: z.string().min(1).max(240),
  action: z.string().min(1).max(500),
  estimatedMinutes: z.number().int().min(5).max(1_800),
  /** 必须引用目录中已发布且可学习的条目。 */
  itemId: z.string().min(1).max(160),
  evidence: z.string().min(1).max(300),
  alternative: z.string().min(1).max(500),
  deadlineAt: z.string().datetime({ offset: true }).optional(),
  deadlineDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type PathfinderPlanTask = z.infer<typeof PathfinderPlanTaskSchema>;

export const PathfinderPlanWeekSchema = z.object({
  week: z.number().int().min(1).max(8),
  phase: z.enum(PATHFINDER_PHASE_VALUES),
  title: z.string().min(1).max(160),
  objective: z.string().min(1).max(500),
  estimatedMinutes: z.number().int().min(5).max(1_800),
  tasks: z.array(PathfinderPlanTaskSchema).min(1).max(4),
});

export type PathfinderPlanWeek = z.infer<typeof PathfinderPlanWeekSchema>;

export const PathfinderPlanSchema = z.object({
  version: z.literal(2),
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(800),
  durationWeeks: z.number().int().min(4).max(8),
  generatedAt: z.string().datetime({ offset: true }),
  warnings: z.array(z.string().min(1).max(500)).max(20),
  weeks: z.array(PathfinderPlanWeekSchema).min(4).max(8),
}).superRefine((plan, context) => {
  if (plan.weeks.length !== plan.durationWeeks) {
    context.addIssue({
      code: 'custom',
      path: ['weeks'],
      message: '周计划数量必须与路径周数一致',
    });
  }

  for (const week of plan.weeks) {
    const taskMinutes = week.tasks.reduce(
      (total, task) => total + task.estimatedMinutes,
      0,
    );
    if (taskMinutes !== week.estimatedMinutes) {
      context.addIssue({
        code: 'custom',
        path: ['weeks', week.week - 1, 'estimatedMinutes'],
        message: '每周预计时间必须等于任务时间之和',
      });
    }
  }
});

export type PathfinderPlan = z.infer<typeof PathfinderPlanSchema>;

export const PathfinderSafetyResponseSchema = z.object({
  kind: z.literal('safety'),
  source: z.literal('safety'),
  message: z.string().min(1),
  actions: z.array(z.string().min(1)).min(1),
});

export type PathfinderSafetyResponse = z.infer<typeof PathfinderSafetyResponseSchema>;

export const PathfinderPlanResponseSchema = z.object({
  kind: z.literal('plan'),
  source: z.literal('deterministic'),
  plan: PathfinderPlanSchema,
});

export const PathfinderApiResponseSchema = z.discriminatedUnion('kind', [
  PathfinderPlanResponseSchema,
  PathfinderSafetyResponseSchema,
]);

export type PathfinderPlanResponse = z.infer<typeof PathfinderPlanResponseSchema>;
export type PathfinderApiResponse = z.infer<typeof PathfinderApiResponseSchema>;

/**
 * 危机与医疗关键词只用于阻止系统继续做学习或职业规划，不用于诊断。
 * 保留中英文词是为了让两个 locale 的自由文本目标都能被本地拦截。
 */
export const CRISIS_KEYWORDS = [
  '自杀',
  '想死',
  '活不下去',
  '伤害自己',
  '自残',
  '抑郁',
  '抑郁症',
  '焦虑症',
  '精神病',
  '吃药',
  '想哭',
  '受虐待',
  '霸凌',
  '被霸凌',
  '被欺负',
  '被打',
  'suicide',
  'kill myself',
  'self-harm',
  'hurt myself',
  'abused',
] as const;

export function looksLikeCrisis(goal: string): boolean {
  const normalizedGoal = goal.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalizedGoal.includes(keyword));
}

export function buildSafetyResponse(locale: 'zh' | 'en' = 'zh'): PathfinderSafetyResponse {
  if (locale === 'en') {
    return {
      kind: 'safety',
      source: 'safety',
      message: 'Your safety matters more than a study plan. Please contact someone you trust or a qualified professional now.',
      actions: [
        'If you may hurt yourself or someone else soon, call 110 or 120, or go to the nearest emergency department.',
        'Contact China’s 12356 mental health assistance hotline and follow the local operator’s guidance.',
        'Tell a trusted friend, family member, teacher, or counsellor what is happening and ask them to stay with you.',
      ],
    };
  }

  return {
    kind: 'safety',
    source: 'safety',
    message: '你的安全比学习路径更重要。此时不适合继续做学习或职业规划，请尽快联系可信任的人或专业支持。',
    actions: [
      '如果你可能马上伤害自己或他人，请拨打 110 或 120，或前往最近的急诊。',
      '可以拨打全国统一心理援助热线 12356，并按所在地接线人员的指引求助。',
      '把目前的情况告诉可信任的家人、朋友、老师或辅导员，请对方陪在你身边。',
    ],
  };
}
