import { getSiteUrl } from '@/lib/constants';
import { dailyChannels } from '@/lib/daily/channels';
import { listDailyEditions } from '@/lib/daily/service';
import { getPostById } from '@/lib/posts';
import {
  normalizeXhsTags,
  truncateChars,
  XHS_BODY_LIMIT,
  XHS_TITLE_LIMIT,
} from './limits';
import type {
  XiaohongshuGenerateSource,
  XiaohongshuNoteInput,
  XiaohongshuSourceKind,
} from './types';

export class XiaohongshuSourceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'XiaohongshuSourceError';
  }
}

export interface XiaohongshuComposedNote extends XiaohongshuNoteInput {
  sourceKind: XiaohongshuSourceKind;
}

/** Markdown 去格式后只留可读文字；小红书正文不需要保留标题标记和链接语法。 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}\d+\.\s+/gm, '')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function dailyLabel(channel: string): string {
  return dailyChannels.find((item) => item.id === channel)?.zh ?? channel;
}

function trimBody(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
  if (Array.from(normalized).length <= XHS_BODY_LIMIT) return normalized;
  return `${truncateChars(normalized, XHS_BODY_LIMIT - 1)}…`;
}

function trimTitle(value: string): string {
  const title = value.trim();
  if (Array.from(title).length <= XHS_TITLE_LIMIT) return title;
  return `${truncateChars(title, XHS_TITLE_LIMIT - 1)}…`;
}

async function fromDaily(date: string): Promise<XiaohongshuComposedNote> {
  const rows = await listDailyEditions(date);
  const published = rows.filter((row) => row.status === 'published' && row.title.trim());
  if (published.length === 0) {
    throw new XiaohongshuSourceError('daily_empty', '该日期没有已发布的日刊内容');
  }

  const labels = published.map((row) => dailyLabel(row.channel));
  const sections = published.map((row, index) => {
    const summary = trimBody(row.summary);
    return `【${labels[index]}】${row.title.trim()}\n${summary}`;
  });
  const body = trimBody(
    `${date} 的每日一新，今天整理了 ${published.length} 个栏目。\n\n${sections.join('\n\n')}\n\n完整内容在站内「每日一新」，每天更新。`,
  );

  return {
    title: trimTitle(`每日一新｜${date}`),
    body,
    tags: normalizeXhsTags(['每日一新', ...labels]),
    images: [],
    sourceKind: 'daily',
    sourceRef: date,
    sourceUrl: `${getSiteUrl()}/daily?view=all`,
    status: 'draft',
    publishedUrl: null,
  };
}

async function fromPost(postId: string): Promise<XiaohongshuComposedNote> {
  const post = await getPostById(postId);
  if (!post) throw new XiaohongshuSourceError('post_not_found', '文章不存在或已被删除');
  if (post.status !== 'published') {
    throw new XiaohongshuSourceError('post_not_published', '只能从已发布的文章生成笔记');
  }

  const plain = markdownToPlainText(post.content);
  const lead = post.excerpt.trim();
  const body = trimBody([
    lead,
    plain,
    '',
    '—— 来自 Meteor Store 的独立开发记录',
  ].filter((line, index, list) => line !== '' || index === list.length - 2).join('\n\n'));
  const tags = post.tags.length > 0
    ? normalizeXhsTags([...post.tags, '独立开发'])
    : normalizeXhsTags(['独立开发', 'AI工具']);

  return {
    title: trimTitle(post.title),
    body,
    tags,
    images: [],
    sourceKind: 'post',
    sourceRef: post.id,
    sourceUrl: `${getSiteUrl()}/blog/p/${post.id}`,
    status: 'draft',
    publishedUrl: null,
  };
}

export async function composeXiaohongshuNote(
  source: XiaohongshuGenerateSource,
): Promise<XiaohongshuComposedNote> {
  switch (source.kind) {
    case 'daily':
      return fromDaily(source.date);
    case 'post':
      return fromPost(source.postId);
    case 'manual':
      return {
        title: '',
        body: '',
        tags: [],
        images: [],
        sourceKind: 'manual',
        sourceRef: null,
        sourceUrl: null,
        status: 'draft',
        publishedUrl: null,
      };
    default:
      throw new XiaohongshuSourceError('unknown_source', '未知的内容来源');
  }
}
