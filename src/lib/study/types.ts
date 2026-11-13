import { z } from 'zod';

/**
 * 学习工作台的数据协议。
 *
 * 三张私人表（课程 / 截止事项 / 算法题目）共用同一套校验：
 * 自由文本统一 trim + 长度上限，日期只接受真实日历日期或带时区的 ISO 时刻。
 * 金额、成绩等数值在服务端再收敛一次，客户端传来的内容一律不可信。
 */

export const StudyCourseStatusSchema = z.enum(['in-progress', 'completed']);
export type StudyCourseStatus = z.infer<typeof StudyCourseStatusSchema>;

export const StudyDeadlineKindSchema = z.enum(['assignment', 'exam', 'project', 'other']);
export type StudyDeadlineKind = z.infer<typeof StudyDeadlineKindSchema>;

export const StudyDeadlineStatusSchema = z.enum(['open', 'done']);
export type StudyDeadlineStatus = z.infer<typeof StudyDeadlineStatusSchema>;

export const StudyProblemDifficultySchema = z.enum(['easy', 'medium', 'hard']);
export type StudyProblemDifficulty = z.infer<typeof StudyProblemDifficultySchema>;

export const StudyProblemStatusSchema = z.enum(['todo', 'solved']);
export type StudyProblemStatus = z.infer<typeof StudyProblemStatusSchema>;

export const StudyReviewResultSchema = z.enum(['remembered', 'forgot']);
export type StudyReviewResult = z.infer<typeof StudyReviewResultSchema>;

export const STUDY_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** 与日刊同口径的真实日历日期校验，避免 2026-02-30 这类假日期入库。 */
export function isValidStudyDate(value: string): boolean {
  if (!STUDY_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

const dateOnly = z.string().regex(STUDY_DATE_PATTERN).refine(isValidStudyDate, 'Invalid calendar date');
const instant = z.string().datetime({ offset: true });
const shortText = z.string().trim().min(1).max(160);
const notesText = z.string().trim().max(2000);
const idText = z.string().regex(/^[0-9a-f-]{36}$/i, 'Invalid id');

export const StudyCourseInputSchema = z.object({
  id: idText.optional(),
  term: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(120),
  credits: z.number().min(0.5).max(20).multipleOf(0.5),
  score: z.number().min(0).max(100).nullable().optional(),
  status: StudyCourseStatusSchema.optional(),
}).strict();
export type StudyCourseInput = z.infer<typeof StudyCourseInputSchema>;

export const StudyDeadlineInputSchema = z.object({
  id: idText.optional(),
  courseId: idText.nullable().optional(),
  title: shortText,
  kind: StudyDeadlineKindSchema,
  /** 日期或 ISO 时刻；有明确时刻才存时刻，纯日期保持原样。 */
  dueAt: z.union([dateOnly, instant]),
  status: StudyDeadlineStatusSchema.optional(),
  notes: notesText.nullable().optional(),
}).strict();
export type StudyDeadlineInput = z.infer<typeof StudyDeadlineInputSchema>;

export const StudyProblemInputSchema = z.object({
  id: idText.optional(),
  title: shortText,
  topic: z.string().trim().max(60).optional(),
  difficulty: StudyProblemDifficultySchema,
  url: z.string().url().max(500).refine(value => new URL(value).protocol === 'https:', 'Use an HTTPS URL').nullable().optional(),
  status: StudyProblemStatusSchema.optional(),
  notes: notesText.nullable().optional(),
}).strict();
export type StudyProblemInput = z.infer<typeof StudyProblemInputSchema>;

export const StudyReviewInputSchema = z.object({
  id: idText,
  result: StudyReviewResultSchema,
}).strict();
export type StudyReviewInput = z.infer<typeof StudyReviewInputSchema>;

/** 客户端更新时只发送变化的字段，服务端按字段存在与否区分「不修改」。 */
export const StudyCoursePatchSchema = StudyCourseInputSchema.partial().required({ id: true });
export type StudyCoursePatch = z.infer<typeof StudyCoursePatchSchema>;

export const StudyDeadlinePatchSchema = StudyDeadlineInputSchema.partial().required({ id: true });
export type StudyDeadlinePatch = z.infer<typeof StudyDeadlinePatchSchema>;

export const StudyProblemPatchSchema = StudyProblemInputSchema.partial().required({ id: true });
export type StudyProblemPatch = z.infer<typeof StudyProblemPatchSchema>;

export const StudyIdSchema = z.object({ id: idText }).strict();

export interface StudyCourse {
  id: string;
  term: string;
  name: string;
  credits: number;
  score: number | null;
  status: StudyCourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudyDeadline {
  id: string;
  courseId: string | null;
  title: string;
  kind: StudyDeadlineKind;
  dueAt: string;
  status: StudyDeadlineStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudyProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: StudyProblemDifficulty;
  url: string | null;
  status: StudyProblemStatus;
  notes: string | null;
  reviewStage: number;
  reviewDueOn: string | null;
  reviewIntervalDays: number;
  lastReviewedOn: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STUDY_REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60] as const;
export const STUDY_REVIEW_MAX_STAGE = STUDY_REVIEW_INTERVALS_DAYS.length - 1;
