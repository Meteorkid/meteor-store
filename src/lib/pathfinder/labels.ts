/**
 * Pathfinder 用户输入 enum 的标识符与显示文本映射
 *
 * 标识符（英文 key）出现在：
 * - Zod schema（PathfinderInput）
 * - 客户端表单提交
 * - Reality Contract 的现实约束
 *
 * 显示文本：
 * - 服务端模型提示词固定使用中文（系统提示词与模型输出协议均为中文），
 *   因此 buildUserPrompt 需要把 key 翻译回中文喂给模型。
 * - 客户端 UI 走 next-intl 翻译文件（PathfinderEnums 命名空间），
 *   不依赖此处的中文映射，以支持英文界面。
 *
 * 改 key 时要同步：
 * - 此处的中文映射
 * - messages/zh.json 与 messages/en.json 的 PathfinderEnums 命名空间
 * - preset-cases.ts 中的字面值
 */

import type {
  STAGE_VALUES,
  DEVICE_VALUES,
  NETWORK_VALUES,
  CONSTRAINT_VALUES,
} from './schema';

/** 当前学习阶段的中文显示文本（用于模型提示词） */
export const STAGE_LABELS_ZH: Record<(typeof STAGE_VALUES)[number], string> = {
  'middle-school': '初中',
  'high-school': '高中',
  'college': '大学',
  'career-start': '职业起步',
};

/** 可用设备的中文显示文本（用于模型提示词） */
export const DEVICE_LABELS_ZH: Record<(typeof DEVICE_VALUES)[number], string> = {
  'phone-only': '仅手机',
  'phone-and-pc': '手机和电脑',
  'pc': '电脑',
};

/** 网络条件的中文显示文本（用于模型提示词） */
export const NETWORK_LABELS_ZH: Record<(typeof NETWORK_VALUES)[number], string> = {
  'limited-data': '流量有限',
  'normal': '普通网络',
  'stable': '稳定网络',
};

/** 现实限制的中文显示文本（用于模型提示词） */
export const CONSTRAINT_LABELS_ZH: Record<(typeof CONSTRAINT_VALUES)[number], string> = {
  'fragmented-time': '时间碎片化',
  'weak-foundation': '基础薄弱',
  'no-mentor': '缺少指导',
  'limited-budget': '预算有限',
};
