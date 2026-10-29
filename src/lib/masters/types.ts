import { z } from 'zod';
import { DailyDateSchema, dailyDate } from '@/lib/daily/types';

export const MASTERS_REGIONS = ['hong-kong', 'macau', 'singapore', 'uk', 'australia'] as const;
export const MastersRegionSchema = z.enum(MASTERS_REGIONS);
export type MastersRegion = z.infer<typeof MastersRegionSchema>;
export const mastersRegions = [
  { id: 'hong-kong', zh: '香港', en: 'Hong Kong' },
  { id: 'macau', zh: '澳门', en: 'Macao' },
  { id: 'singapore', zh: '新加坡', en: 'Singapore' },
  { id: 'uk', zh: '英国', en: 'United Kingdom' },
  { id: 'australia', zh: '澳洲', en: 'Australia' },
] as const;

const httpsUrl = z.string().url().max(2000).refine(value => new URL(value).protocol === 'https:', 'Use an HTTPS official source');
const label = z.string().trim().min(1).max(300);
const optionalDate = DailyDateSchema.nullable();
const optionalInstant = z.string().datetime({ offset: true }).nullable();
const timeZone = z.string().max(80).refine(value => {
  try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; }
}, 'Invalid time zone').nullable();

export const MastersRoundDetailsSchema = z.object({
  university: label,
  programme: label,
  subject: label.max(100),
  studyType: z.enum(['taught', 'research']),
  studyMode: label.max(100),
  intakeLabel: label.max(100),
  applicantGroup: label,
  roundName: label.max(100),
  eventType: z.enum(['application', 'documents', 'recommendation', 'scholarship']),
  opensOn: optionalDate,
  /** 服务端保存的首次开放核验证据，不是官方公布的开放日。 */
  firstObservedOpenOn: optionalDate.optional(),
  openingNote: z.string().trim().max(500),
  openingState: z.enum(['unknown', 'scheduled', 'open', 'closed']),
  deadlineStatus: z.enum(['confirmed', 'unannounced', 'unverified']),
  deadlineOn: optionalDate,
  deadlineAt: optionalInstant,
  deadlineTimeZone: timeZone,
  deadlineText: z.string().trim().max(500),
  rolling: z.boolean(),
  mayCloseEarly: z.boolean(),
  officialUrl: httpsUrl,
  sourceNote: z.string().trim().min(1).max(2000),
}).strict().superRefine((data, ctx) => {
  if (data.deadlineStatus === 'confirmed' && !data.deadlineOn) {
    ctx.addIssue({ code: 'custom', path: ['deadlineOn'], message: 'Confirmed deadlines need a calendar date' });
  }
  if (data.deadlineStatus !== 'confirmed' && (data.deadlineOn || data.deadlineAt)) {
    ctx.addIssue({ code: 'custom', path: ['deadlineStatus'], message: 'Unverified dates cannot be used as confirmed deadlines' });
  }
  if (data.deadlineAt && (!data.deadlineOn || !data.deadlineTimeZone)) {
    ctx.addIssue({ code: 'custom', path: ['deadlineAt'], message: 'An exact deadline needs a date and confirmed time zone' });
  }
  if (data.deadlineAt && data.deadlineTimeZone && data.deadlineOn) {
    try {
      const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: data.deadlineTimeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.deadlineAt));
      if (localDate !== data.deadlineOn) ctx.addIssue({ code: 'custom', path: ['deadlineAt'], message: 'Deadline instant does not match its local date' });
    } catch { ctx.addIssue({ code: 'custom', path: ['deadlineAt'], message: 'Invalid deadline instant' }); }
  }
  if (data.opensOn && data.deadlineOn && data.opensOn > data.deadlineOn) {
    ctx.addIssue({ code: 'custom', path: ['opensOn'], message: 'Opening date must not be after the deadline' });
  }
});
export type MastersRoundDetails = z.infer<typeof MastersRoundDetailsSchema>;

export const MastersRoundInputSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/).optional(),
  intakeYear: z.number().int().min(2020).max(2100),
  region: MastersRegionSchema,
  details: MastersRoundDetailsSchema,
  status: z.enum(['draft', 'published']),
  verifiedOn: optionalDate,
  expectedUpdatedAt: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((data, ctx) => {
  if (data.status === 'published' && (!data.verifiedOn || data.verifiedOn > dailyDate())) {
    ctx.addIssue({ code: 'custom', path: ['verifiedOn'], message: 'Publishing needs a non-future verification date' });
  }
});
export type MastersRoundInput = z.infer<typeof MastersRoundInputSchema>;
export interface MastersRound {
  id: string;
  intakeYear: number;
  region: MastersRegion;
  details: MastersRoundDetails;
  status: 'draft' | 'published';
  verifiedOn: string | null;
  revision: number;
  dateVersion: number;
  dateChangedAt: string | null;
  previousDeadlineText: string | null;
  createdAt: string;
  updatedAt: string;
}

export const MastersWatchInputSchema = z.object({
  roundId: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
  status: z.enum(['preparing', 'submitted', 'abandoned']),
  reminders: z.boolean(),
}).strict();
export type MastersWatchInput = z.infer<typeof MastersWatchInputSchema>;
export interface MastersWatch extends MastersWatchInput { updatedAt: string }
export interface MastersNotice {
  id: string;
  roundId: string;
  kind: 'deadline' | 'changed';
  leadDays: number | null;
  dateVersion: number;
  createdAt: string;
  readAt: string | null;
  round: MastersRound;
}
export interface MastersSummary { intakeYear: number; total: number; opening: number; closingSoon: number; changed: number }

export function defaultMastersYear(now = new Date()): number {
  const date = dailyDate(now);
  return Number(date.slice(0, 4)) + (Number(date.slice(5, 7)) >= 7 ? 1 : 0);
}
