import { z } from 'zod';

const identifierSchema = z.string().trim().min(1).max(128);
const titleSchema = z.string().trim().min(1).max(300);
const optionalIdentifierSchema = identifierSchema.nullable().optional().default(null);
const optionalTitleSchema = z.string().trim().min(1).max(300).nullable().optional().default(null);
const isoDateSchema = z.string()
  .datetime({ offset: true })
  .transform((value) => new Date(value).toISOString());

export const tollowProgressSchema = z.object({
  bookId: identifierSchema,
  sectionId: identifierSchema,
  segmentIndex: z.number().int().min(0).max(1_000_000),
  offset: z.number().int().min(0).max(10_000_000),
  updatedAt: isoDateSchema,
}).strict();

export const tollowPracticeSessionSchema = z.object({
  clientRecordId: identifierSchema,
  bookId: optionalIdentifierSchema,
  bookTitle: titleSchema,
  startedAt: isoDateSchema,
  endedAt: isoDateSchema,
  durationMs: z.number().int().min(0).max(86_400_000),
  wordsTyped: z.number().int().min(0).max(10_000_000),
  wpm: z.number().finite().min(0).max(2_000),
  accuracy: z.number().finite().min(0).max(100),
  errorCount: z.number().int().min(0).max(10_000_000),
}).strict().refine(
  (value) => Date.parse(value.endedAt) >= Date.parse(value.startedAt),
  { message: 'endedAt 不能早于 startedAt', path: ['endedAt'] },
);

const tagsSchema = z.array(z.string().trim().min(1).max(30))
  .max(10)
  .transform((tags) => [...new Set(tags)]);

export const tollowFavoriteCreateSchema = z.object({
  clientRecordId: identifierSchema,
  bookId: optionalIdentifierSchema,
  bookTitle: titleSchema,
  sectionId: optionalIdentifierSchema,
  sectionTitle: optionalTitleSchema,
  segmentIndex: z.number().int().min(0).max(1_000_000).nullable().optional().default(null),
  startOffset: z.number().int().min(0).max(10_000_000),
  endOffset: z.number().int().min(0).max(10_000_000),
  quote: z.string().min(1).max(10_000),
  note: z.string().trim().max(2_000).nullable().optional().default(null),
  tags: tagsSchema.optional().default([]),
}).strict().refine(
  (value) => value.endOffset >= value.startOffset,
  { message: 'endOffset 不能小于 startOffset', path: ['endOffset'] },
);

export const tollowFavoritePatchSchema = z.object({
  note: z.string().trim().max(2_000).nullable().optional(),
  tags: tagsSchema.optional(),
}).strict().refine(
  (value) => value.note !== undefined || value.tags !== undefined,
  { message: '至少提供一个可修改字段' },
);

export const tollowSessionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export const tollowFavoritesQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  bookId: identifierSchema.optional(),
  tag: z.string().trim().min(1).max(30).optional(),
  sort: z.enum(['updated-desc', 'updated-asc', 'position']).default('updated-desc'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export const tollowImportSchema = z.object({
  progress: z.array(z.unknown()).max(100).default([]),
  sessions: z.array(z.unknown()).max(100).default([]),
}).strict().refine(
  (value) => value.progress.length + value.sessions.length <= 100,
  { message: '每批最多导入 100 条记录' },
);

export type TollowBookProgress = z.infer<typeof tollowProgressSchema>;
export type TollowPracticeSessionInput = z.infer<typeof tollowPracticeSessionSchema>;
export type TollowFavoriteCreateInput = z.infer<typeof tollowFavoriteCreateSchema>;
export type TollowFavoritePatchInput = z.infer<typeof tollowFavoritePatchSchema>;
export type TollowSessionsQuery = z.infer<typeof tollowSessionsQuerySchema>;
export type TollowFavoritesQuery = z.infer<typeof tollowFavoritesQuerySchema>;

export function mergeTollowBookProgress(
  first: TollowBookProgress | null,
  second: TollowBookProgress | null,
): TollowBookProgress | null {
  if (!first) return second;
  if (!second) return first;
  return Date.parse(second.updatedAt) > Date.parse(first.updatedAt) ? second : first;
}
