import { getSiteUrl } from '@/lib/constants';
import { dailyChannels } from '@/lib/daily/channels';
import { listDailyEditions } from '@/lib/daily/service';
import { DailyDateSchema, type DailyContent } from '@/lib/daily/types';
import { getPostById } from '@/lib/posts';
import { WechatMpError } from './client';

/**
 * 三种内容源统一成一份 DraftContent，后面的排版/上传链路不关心内容从哪来。
 * 博客文章只放行 status === 'published'，避免把审核中的稿件误同步到公众号。
 */

export type DraftSourceInput =
  | { kind: 'post'; postId: string }
  | {
      kind: 'markdown';
      markdown: string;
      title?: string;
      author?: string;
      digest?: string;
      sourceUrl?: string;
    }
  | { kind: 'daily'; date: string };

export interface DraftContent {
  title: string;
  author: string;
  digest: string;
  markdown: string;
  sourceUrl: string;
}

function inputError(message: string, code: string): WechatMpError {
  return new WechatMpError(message, code);
}

function dailyContentToMarkdown(content: DailyContent): string {
  if (content.kind === 'english') {
    const lines: string[] = ['### 今日表达', ''];
    for (const word of content.vocabulary) {
      lines.push(`- **${word.term}** — ${word.meaning}`);
      lines.push(`  - ${word.example}`);
      if (word.translation) lines.push(`  - ${word.translation}`);
    }
    lines.push('', '### 短文', '', content.passage);
    if (content.passageTranslation) lines.push('', content.passageTranslation);
    lines.push('', '### 小练习', '');
    content.questions.forEach((question, index) => {
      lines.push(`${index + 1}. ${question.question}`);
      question.options.forEach((option, optionIndex) => {
        lines.push(`   - ${String.fromCharCode(65 + optionIndex)}. ${option}`);
      });
    });
    return lines.join('\n');
  }
  return content.items.map((item, index) => {
    const meta = [item.sourceName, item.organization, item.location].filter(Boolean).join(' · ');
    const parts = [`${index + 1}. **${item.title}**${meta ? ` — ${meta}` : ''}`, '', `   ${item.summary}`, '', `   [查看原文](${item.url})`];
    return parts.join('\n');
  }).join('\n\n');
}

async function fromPost(postId: string): Promise<DraftContent> {
  const post = await getPostById(postId);
  if (!post) throw inputError('文章不存在或已被删除', 'post_not_found');
  if (post.status !== 'published') {
    throw inputError('只能同步已发布的文章，审核中的稿件请先在后台通过', 'post_not_published');
  }
  return {
    title: post.title,
    author: post.authorName ?? '',
    digest: post.excerpt,
    markdown: post.content,
    sourceUrl: `${getSiteUrl()}/blog/p/${post.id}`,
  };
}

function fromMarkdown(input: Extract<DraftSourceInput, { kind: 'markdown' }>): DraftContent {
  const markdown = input.markdown?.trim();
  if (!markdown) throw inputError('Markdown 正文不能为空', 'markdown_empty');
  const heading = /^\s*#\s+(.+)$/m.exec(markdown)?.[1]?.trim();
  const title = input.title?.trim() || heading;
  if (!title) throw inputError('请填写标题，或在 Markdown 里写一个 # 一级标题', 'title_missing');
  // 标题已经由草稿的 title 字段承载，正文里再留一个 h1 会重复
  const body = !input.title?.trim() && heading ? markdown.replace(/^\s*#\s+.+\n?/, '') : markdown;
  return {
    title,
    author: input.author?.trim() ?? '',
    digest: input.digest?.trim() ?? '',
    markdown: body,
    sourceUrl: input.sourceUrl?.trim() || getSiteUrl(),
  };
}

async function fromDaily(date: string): Promise<DraftContent> {
  if (!DailyDateSchema.safeParse(date).success) {
    throw inputError('日期格式应为 YYYY-MM-DD', 'invalid_date');
  }
  const rows = await listDailyEditions(date);
  const published = rows.filter((row) => row.status === 'published' && row.title.trim());
  if (published.length === 0) {
    throw inputError('该日期没有已发布的栏目内容', 'daily_empty');
  }
  const sections = published.map((row) => {
    const label = dailyChannels.find((channel) => channel.id === row.channel)?.zh ?? row.channel;
    const parts = [`## ${label}`, '', `**${row.title}**`, '', row.summary];
    if (row.content) parts.push('', dailyContentToMarkdown(row.content));
    return parts.join('\n');
  });
  const labels = published.map((row) => dailyChannels.find((channel) => channel.id === row.channel)?.zh ?? row.channel);
  return {
    title: `每日一新 · ${date}`,
    author: '',
    digest: `${date} 共 ${published.length} 个栏目：${labels.join('、')}`,
    markdown: sections.join('\n\n'),
    sourceUrl: `${getSiteUrl()}/daily?view=all`,
  };
}

export async function resolveDraftSource(input: DraftSourceInput): Promise<DraftContent> {
  switch (input.kind) {
    case 'post':
      return fromPost(input.postId);
    case 'markdown':
      return fromMarkdown(input);
    case 'daily':
      return fromDaily(input.date);
    default:
      throw inputError('未知的内容来源', 'unknown_source');
  }
}
