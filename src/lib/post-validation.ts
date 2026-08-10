import { z } from 'zod';
import { blogSections } from '@/data/blog-sections';

const SECTION_IDS = blogSections.map((section) => section.id) as [string, ...string[]];

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

const eventDateSchema = z
  .string()
  .refine(isCalendarDate, '事件日期需为有效的 YYYY-MM-DD')
  .optional()
  .nullable();

const postFields = {
  title: z.string().trim().min(4, '标题太短了').max(80, '标题不要超过 80 字'),
  excerpt: z.string().trim().min(10, '摘要至少 10 个字').max(200, '摘要不要超过 200 字'),
  content: z.string().trim().min(200, '正文至少 200 字').max(50_000, '正文太长了'),
  sectionId: z.enum(SECTION_IDS),
  sections: z.array(z.enum(SECTION_IDS)).max(8, '分区不要超过 8 个').default([]),
  tags: z.array(z.string().trim().min(1).max(24)).max(8, '最多 8 个标签').default([]),
  eventDate: eventDateSchema,
};

/** 浏览器投稿接口使用的完整表单，保留原有 submit 默认值与中文错误。 */
export const PostSubmissionSchema = z.object({
  ...postFields,
  submit: z.boolean().default(false),
});

/** 浏览器编辑接口使用的部分表单，维持 action=update 的既有行为。 */
export const PostPatchSchema = z.object({
  action: z.enum(['update', 'withdraw']).default('update'),
  title: postFields.title.optional(),
  excerpt: postFields.excerpt.optional(),
  content: postFields.content.optional(),
  sectionId: postFields.sectionId.optional(),
  sections: z.array(z.enum(SECTION_IDS)).max(8, '分区不要超过 8 个').optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(8, '最多 8 个标签').optional(),
  eventDate: eventDateSchema,
  submit: z.boolean().optional(),
});

/** v1 创建接口不会接受任何状态字段，文章一律由服务端创建为 draft。 */
export const BlogApiCreatePostSchema = z.object(postFields).strict();

const expectedUpdatedAtSchema = z
  .string()
  .datetime({ offset: true, message: 'expectedUpdatedAt 必须是 ISO 时间' });

const blogApiUpdateFields = {
  title: postFields.title.optional(),
  excerpt: postFields.excerpt.optional(),
  content: postFields.content.optional(),
  sectionId: postFields.sectionId.optional(),
  sections: z.array(z.enum(SECTION_IDS)).max(8, '分区不要超过 8 个').optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(8, '最多 8 个标签').optional(),
  eventDate: eventDateSchema,
};

/** v1 草稿修改必须显式携带服务端返回的版本，并至少修改一个内容字段。 */
export const BlogApiUpdatePostSchema = z
  .object({
    expectedUpdatedAt: expectedUpdatedAtSchema,
    ...blogApiUpdateFields,
  })
  .strict()
  .refine(
    (value) => Object.keys(blogApiUpdateFields).some((field) => value[field as keyof typeof value] !== undefined),
    { message: '没有要修改的内容' },
  );

/** 提交操作只有版本字段，状态和管理员能力全部由服务端决定。 */
export const BlogApiVersionSchema = z
  .object({ expectedUpdatedAt: expectedUpdatedAtSchema })
  .strict();
