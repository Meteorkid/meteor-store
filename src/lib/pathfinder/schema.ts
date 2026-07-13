/**
 * Meteor Pathfinder 输入与输出 Schema
 *
 * 使用 Zod 同时校验客户端表单提交与服务端接收的数据。
 */

import { z } from 'zod';
import { getTrustedModelProvider } from './model-providers';

/** 当前学习阶段 */
export const STAGE_VALUES = ['初中', '高中', '大学', '职业起步'] as const;
/** 可用设备 */
export const DEVICE_VALUES = ['仅手机', '手机和电脑', '电脑'] as const;
/** 网络条件 */
export const NETWORK_VALUES = ['流量有限', '普通网络', '稳定网络'] as const;
/** 现实限制（可多选） */
export const CONSTRAINT_VALUES = [
  '时间碎片化',
  '基础薄弱',
  '缺少指导',
  '预算有限',
] as const;

/** 用户输入表单 Schema */
export const PathfinderInputSchema = z.object({
  /** 学习或成长目标，最多 280 字 */
  goal: z.string().trim().min(2, '请描述你的目标，至少 2 个字').max(280, '目标描述不超过 280 字'),
  stage: z.enum(STAGE_VALUES),
  device: z.enum(DEVICE_VALUES),
  /** 每周可投入小时数，1–20 */
  weeklyHours: z.number().int().min(1, '每周至少 1 小时').max(20, '每周不超过 20 小时'),
  network: z.enum(NETWORK_VALUES),
  /** 现实限制，可多选但不能为空 */
  constraints: z
    .array(z.enum(CONSTRAINT_VALUES))
    .min(1, '至少选择一个现实限制'),
});

export type PathfinderInput = z.infer<typeof PathfinderInputSchema>;

/**
 * 用户自带的模型配置。
 * 仅保存在浏览器当前会话，并在单次生成请求中转发；不得持久化或记录日志。
 * Base URL 必须命中服务端白名单，防止将应用变成任意网络请求代理。
 */
export const PathfinderModelConfigSchema = z.object({
  apiKey: z.string().trim().min(1, '请填写 API Key').max(512, 'API Key 格式不正确'),
  baseUrl: z
    .string()
    .trim()
    .url('请填写有效的 API Base URL')
    .max(500, 'API Base URL 过长')
    .refine((value) => getTrustedModelProvider(value) !== null, '请选择支持的模型服务商'),
  model: z
    .string()
    .trim()
    .min(1, '请填写模型名称')
    .max(128, '模型名称过长')
    .regex(/^[A-Za-z0-9._:/-]+$/, '模型名称仅支持字母、数字和 . _ : / -'),
});

export type PathfinderModelConfig = z.infer<typeof PathfinderModelConfigSchema>;

/** 生成接口的完整请求体；模型配置对危机引导路径可选。 */
export const PathfinderGenerateRequestSchema = z.object({
  input: PathfinderInputSchema,
  modelConfig: PathfinderModelConfigSchema.optional(),
});

export type PathfinderGenerateRequest = z.infer<typeof PathfinderGenerateRequestSchema>;

/** 模型期望输出的结构（用于解析与校验） */
export const PathfinderPlanSchema = z.object({
  /** 整体路径说明 */
  summary: z.string().min(1).max(500),
  /** 今天就能开始的 3 个小任务 */
  todaySteps: z.array(z.string().min(1).max(200)).min(3).max(3),
  /** 7 天行动计划 */
  weekPlan: z
    .array(
      z.object({
        day: z.number().int().min(1).max(7),
        title: z.string().min(1).max(80),
        /** 预计耗时（分钟） */
        minutes: z.number().int().min(5).max(240),
      }),
    )
    .min(1)
    .max(7),
  /** 资源 id 列表（必须命中本地资源库） */
  resourceIds: z.array(z.string()).max(8),
  /** 鼓励语 */
  encouragement: z.string().min(1).max(200),
});

export type PathfinderPlan = z.infer<typeof PathfinderPlanSchema>;

/**
 * 危机或医疗相关关键词检测
 * 命中时模型应只建议联系可信任成年人或专业服务，不进行诊断
 */
export const CRISIS_KEYWORDS = [
  '自杀', '想死', '活不下去', '伤害自己', '自残',
  '抑郁', '焦虑症', '精神病', '吃药', '想哭',
  '霸凌', '被欺负', '被打', '受虐待',
] as const;

/** 判断输入目标是否疑似危机或医疗问题 */
export function looksLikeCrisis(goal: string): boolean {
  return CRISIS_KEYWORDS.some((kw) => goal.includes(kw));
}
