import { z } from 'zod';

export const DAILY_EDITION_CHANNEL_IDS = ['english', 'papers', 'ai', 'events', 'open-source', 'competitions', 'internships'] as const;
export const DAILY_CHANNEL_IDS = [...DAILY_EDITION_CHANNEL_IDS, 'masters'] as const;
export const DailyEditionChannelSchema = z.enum(DAILY_EDITION_CHANNEL_IDS);
export type DailyEditionChannelId = z.infer<typeof DailyEditionChannelSchema>;
export const DailyChannelSchema = z.enum(DAILY_CHANNEL_IDS);
export type DailyChannelId = z.infer<typeof DailyChannelSchema>;

export const dailyChannels = [
  { id: 'english', zh: '每日英语', en: 'Daily English', descriptionZh: '几个表达，一段阅读，一次小练习。', descriptionEn: 'Expressions, a short read and a quick quiz.' },
  { id: 'papers', zh: '每日论文', en: 'Daily Papers', descriptionZh: '从研究问题出发，找到值得读的论文。', descriptionEn: 'Research questions and papers worth reading.' },
  { id: 'ai', zh: 'AI 圈大事', en: 'AI Briefing', descriptionZh: '有出处的消息，读完再看原文。', descriptionEn: 'Sourced updates with links to the original.' },
  { id: 'events', zh: '发布会日历', en: 'Events', descriptionZh: '近期预告、当天活动与官方回放。', descriptionEn: 'Upcoming events, live sessions and replays.' },
  { id: 'open-source', zh: '每日开源项目', en: 'Open-source Pick', descriptionZh: '每天探索一个经过实时核验的开源项目。', descriptionEn: 'Explore one live-checked open-source project each day.' },
  { id: 'competitions', zh: '每日竞赛', en: 'Contest Watch', descriptionZh: '官方编程赛事、开赛时间与参与要求。', descriptionEn: 'Official programming contests, start times and requirements.' },
  { id: 'internships', zh: '每日实习', en: 'Internship Watch', descriptionZh: '仍在招聘的具体岗位，注明地点和申请要求。', descriptionEn: 'Active student roles with locations and eligibility details.' },
  { id: 'masters', zh: '硕士申请', en: 'Master’s applications', descriptionZh: '全年申请日历，关注项目与提交截止。', descriptionEn: 'Year-round application rounds and deadlines.' },
] as const;

export const dailyEditionChannels = dailyChannels.filter(channel => channel.id !== 'masters');

const safeUrl = z.string().url().max(2000).refine(value => new URL(value).protocol === 'https:', 'Use an HTTPS URL');
const text = z.string().trim().min(1).max(6000);
const dateTime = z.string().datetime({ offset: true });
export const DailyDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');

export const DailyLinkItemSchema = z.object({
  id: z.string().min(1).max(300),
  title: text.max(300), summary: text,
  originalAbstract: z.string().max(12000).optional(),
  url: safeUrl, sourceName: text.max(100),
  sourceType: z.enum(['official', 'aggregator']),
  sourcePublishedAt: dateTime.optional(),
  authors: z.array(z.string().min(1).max(200)).max(100).optional(),
  category: z.string().max(100).optional(),
  organization: text.max(200).optional(),
  location: text.max(300).optional(),
  eligibility: text.max(2000).optional(),
  verifiedAt: dateTime.optional(),
  difficulty: z.enum(['introductory', 'intermediate', 'advanced']).optional(),
  version: z.string().max(40).optional(),
  announcementType: z.enum(['new', 'cross', 'replace', 'replace-cross']).optional(),
  codeUrl: safeUrl.optional(), preprint: z.boolean().optional(),
  startAt: dateTime.optional(), timeZone: z.string().max(80).optional(),
  phase: z.enum(['upcoming', 'live', 'replay', 'announcement']).optional(),
});
export type DailyLinkItem = z.infer<typeof DailyLinkItemSchema>;

export const EnglishContentSchema = z.object({
  kind: z.literal('english'),
  vocabulary: z.array(z.object({ term: text.max(100), meaning: text.max(500), example: text.max(1000), translation: text.max(1000) })).min(1).max(10),
  passage: text,
  passageTranslation: z.string().max(6000).optional(),
  questions: z.array(z.object({
    question: text.max(1000), options: z.array(text.max(500)).min(2).max(6),
    answerIndex: z.number().int().min(0).max(5), explanation: text.max(2000),
  }).refine(q => q.answerIndex < q.options.length, 'Answer must match an option')).min(1).max(5),
});
export type EnglishContent = z.infer<typeof EnglishContentSchema>;
export const DailyContentSchema = z.discriminatedUnion('kind', [
  EnglishContentSchema,
  z.object({ kind: z.literal('papers'), items: z.array(DailyLinkItemSchema).min(1).max(3) }),
  z.object({ kind: z.literal('ai'), items: z.array(DailyLinkItemSchema).min(1).max(5) }),
  z.object({ kind: z.literal('events'), items: z.array(DailyLinkItemSchema).min(1).max(10) }),
  z.object({ kind: z.literal('open-source'), items: z.array(DailyLinkItemSchema).length(1) }),
  z.object({ kind: z.literal('competitions'), items: z.array(DailyLinkItemSchema).min(1).max(3) }),
  z.object({ kind: z.literal('internships'), items: z.array(DailyLinkItemSchema).min(1).max(3) }),
]);
export type DailyContent = z.infer<typeof DailyContentSchema>;
export type DailyStatus = 'draft' | 'published' | 'empty' | 'failed';
export interface DailyEdition {
  id: string; date: string; channel: DailyEditionChannelId; status: DailyStatus;
  title: string; summary: string; content: DailyContent | null;
  sourceKey: string | null; publishedAt: string | null; updatedAt: string;
  error?: string | null;
  automationPaused?: boolean;
}

export const DailyPreferencesSchema = z.object({
  channels: z.array(DailyChannelSchema).max(DAILY_CHANNEL_IDS.length).refine(ids => new Set(ids).size === ids.length, 'Duplicate channels'),
  reminders: z.boolean(),
}).strict();
export type DailyPreferences = z.infer<typeof DailyPreferencesSchema>;
export interface DailyReminder { date: string; channels: DailyChannelId[]; publishedAt: string }

export function dailyDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function shiftDailyDate(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function isDailyHistoryDate(date: string, today = dailyDate()): boolean {
  return DailyDateSchema.safeParse(date).success && date <= today && date >= shiftDailyDate(today, -29);
}
