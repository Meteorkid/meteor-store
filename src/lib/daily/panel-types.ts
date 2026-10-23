import { z } from 'zod';
import { DAILY_EDITION_CHANNEL_IDS } from './channels';
import { DailyChannelSchema, DailyDateSchema, DailyEditionChannelSchema, type DailyChannelId } from './types';

const itemCount = z.union([z.literal(1), z.literal(3), z.literal(5)]);
export const DailyPanelSettingsSchema = z.object({
  version: z.literal(1),
  channels: z.array(DailyEditionChannelSchema).max(DAILY_EDITION_CHANNEL_IDS.length)
    .refine(value => new Set(value).size === value.length, 'Duplicate channels'),
  itemCounts: z.object({
    english: itemCount, papers: itemCount, ai: itemCount, events: itemCount,
    'open-source': z.literal(1), competitions: itemCount, internships: itemCount,
  }).strict(),
  density: z.enum(['compact', 'detailed']),
  english: z.object({ meaning: z.boolean(), example: z.boolean(), translation: z.boolean() }).strict(),
  showSummary: z.boolean(), showSource: z.boolean(), showDates: z.boolean(), hideEmpty: z.boolean(),
}).strict();
export type DailyPanelSettings = z.infer<typeof DailyPanelSettingsSchema>;

export function defaultDailyPanelSettings(followedChannels?: DailyChannelId[] | null): DailyPanelSettings {
  return {
    version: 1,
    channels: followedChannels == null ? [...DAILY_EDITION_CHANNEL_IDS]
      : followedChannels.filter(channel => channel !== 'masters'),
    itemCounts: { english: 3, papers: 1, ai: 1, events: 1, 'open-source': 1, competitions: 1, internships: 1 },
    density: 'compact', english: { meaning: true, example: false, translation: false },
    showSummary: true, showSource: true, showDates: true, hideEmpty: false,
  };
}

const revision = z.string().datetime({ offset: true });
export const SaveDailyPanelPreferencesSchema = z.object({
  settings: DailyPanelSettingsSchema.nullable(), expectedRevision: revision.nullable(),
}).strict();
export type SaveDailyPanelPreferences = z.infer<typeof SaveDailyPanelPreferencesSchema>;
export const DailyPanelPreferencesResponseSchema = z.object({
  userId: z.string().min(1), settings: DailyPanelSettingsSchema.nullable(), revision: revision.nullable(),
  followedChannels: z.array(DailyChannelSchema).max(8).nullable(),
}).strict();
export type DailyPanelPreferencesResponse = z.infer<typeof DailyPanelPreferencesResponseSchema>;

export const DAILY_PREVIEW_MAX_BYTES = 128 * 1024;
export const DAILY_PREVIEW_URL_MAX_BYTES = 2048;
const previewUrl = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password
    && new TextEncoder().encode(value).byteLength <= DAILY_PREVIEW_URL_MAX_BYTES;
}, 'Invalid preview URL');
const previewWord = z.object({
  term: z.string().max(100), meaning: z.string().max(200),
  example: z.string().max(400), translation: z.string().max(400),
}).strict();
export type DailyPreviewWord = z.infer<typeof previewWord>;
const previewItem = z.object({
  id: z.string().max(300), title: z.string().max(160), summary: z.string().max(240),
  url: previewUrl.optional(), sourceName: z.string().max(80), sourceType: z.enum(['official', 'aggregator']),
  sourcePublishedAt: revision.optional(), verifiedAt: revision.optional(),
  startAt: revision.optional(), timeZone: z.string().max(80).optional(),
  phase: z.enum(['upcoming', 'live', 'replay', 'announcement']).optional(),
  organization: z.string().max(120).optional(), location: z.string().max(160).optional(),
  roleType: z.enum(['internship', 'graduate', 'unknown']).optional(),
  remoteStatus: z.enum(['remote', 'hybrid', 'onsite', 'unknown']).optional(),
  difficulty: z.enum(['introductory', 'intermediate', 'advanced']).optional(), preprint: z.boolean().optional(),
}).strict();
export type DailyPreviewItem = z.infer<typeof previewItem>;
const previewContent = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('english'), vocabulary: z.array(previewWord).max(5) }).strict(),
  z.object({ kind: z.literal('papers'), items: z.array(previewItem).max(5) }).strict(),
  z.object({ kind: z.literal('ai'), items: z.array(previewItem).max(5) }).strict(),
  z.object({ kind: z.literal('events'), items: z.array(previewItem).max(5) }).strict(),
  z.object({ kind: z.literal('open-source'), items: z.array(previewItem).max(1) }).strict(),
  z.object({ kind: z.literal('competitions'), items: z.array(previewItem).max(5) }).strict(),
  z.object({ kind: z.literal('internships'), items: z.array(previewItem).max(5) }).strict(),
]);
export type DailyPreviewContent = z.infer<typeof previewContent>;
export const DailyPreviewEditionSchema = z.object({
  channel: DailyEditionChannelSchema, status: z.enum(['published', 'empty', 'failed', 'unpublished']),
  title: z.string().max(160), updatedAt: revision.nullable(), previousDate: DailyDateSchema.optional(),
  totalCount: z.number().int().min(0).max(10), content: previewContent.nullable(),
}).strict();
export type DailyPreviewEdition = z.infer<typeof DailyPreviewEditionSchema>;
export const DailyPreviewResponseSchema = z.object({
  date: DailyDateSchema, updatedAt: revision.nullable(),
  editions: z.array(DailyPreviewEditionSchema).max(DAILY_EDITION_CHANNEL_IDS.length),
}).strict();
export type DailyPreviewResponse = z.infer<typeof DailyPreviewResponseSchema>;
