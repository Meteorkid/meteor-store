import type { IngestedPathfinderItem, PathfinderSyncSource } from './types';
import {
  cleanExternalText,
  contentHash,
  isAllowedHost,
  normalizeIngestionUrl,
  toIsoDate,
} from './normalize';

export function parsePathfinderSource(
  source: PathfinderSyncSource,
  body: string,
): IngestedPathfinderItem[] {
  return source.adapterId === 'rss'
    ? parseRss(source, body)
    : parseGithubSearch(source, body);
}

export function parseRss(
  source: PathfinderSyncSource,
  xml: string,
): IngestedPathfinderItem[] {
  const blocks = [
    ...(xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []),
    ...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? []),
  ];

  return blocks.slice(0, 30).flatMap((block) => {
    const title = cleanExternalText(readTag(block, ['title']) ?? '', 180);
    const rawUrl = readAtomLink(block)
      ?? readTag(block, ['link'])
      ?? readTag(block, ['guid', 'id']);
    const url = rawUrl ? normalizeIngestionUrl(cleanExternalText(rawUrl, 800)) : null;
    if (!title || !url || !isAllowedHost(url, source.allowedItemHosts)) return [];

    const externalId = cleanExternalText(readTag(block, ['guid', 'id']) ?? url, 500);
    const summary = cleanExternalText(
      readTag(block, ['description', 'summary', 'content:encoded', 'content']) ?? '',
      320,
    );
    const publishedAt = toIsoDate(readTag(block, ['pubDate', 'published', 'updated', 'dc:date']));
    const hash = contentHash({ title, url, summary, publishedAt });

    return [{
      sourceId: source.id,
      externalId,
      canonicalUrl: url,
      type: source.itemType,
      direction: source.direction,
      directions: [source.direction],
      titleZh: null,
      titleEn: title,
      summaryZh: null,
      summaryEn: summary || null,
      organization: source.organization,
      organizationEn: source.organization,
      difficulty: 'all',
      estimatedMinutes: null,
      costCny: 0,
      costAmount: 0,
      costCurrency: 'CNY',
      costLabelZh: null,
      costLabelEn: null,
      device: 'either',
      network: 'normal',
      region: 'global',
      regionZh: '全球',
      regionEn: 'Global',
      remoteStatus: 'unspecified',
      eligibilityZh: null,
      eligibilityEn: null,
      deadlineAt: null,
      deadlineText: null,
      deadlineTextZh: null,
      deadlineTextEn: null,
      deadlineDate: null,
      publishedAt,
      learningEligible: source.learningEligible,
      requiresManualEligibilityCheck: false,
      tags: ['AI', source.organization],
      contentHash: hash,
    } satisfies IngestedPathfinderItem];
  });
}

export function parseGithubSearch(
  source: PathfinderSyncSource,
  json: string,
): IngestedPathfinderItem[] {
  let payload: unknown;
  try {
    payload = JSON.parse(json);
  } catch {
    throw new Error(`pathfinder source returned invalid JSON: ${source.id}`);
  }
  const items = isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];

  return items.slice(0, 30).flatMap((raw) => {
    if (!isRecord(raw)) return [];
    const rawUrl = typeof raw.html_url === 'string' ? raw.html_url : '';
    const url = normalizeIngestionUrl(rawUrl);
    const title = cleanExternalText(typeof raw.title === 'string' ? raw.title : '', 180);
    if (!title || !url || !isAllowedHost(url, source.allowedItemHosts)) return [];
    const repository = repositoryName(raw.repository_url);
    const labels = Array.isArray(raw.labels)
      ? raw.labels.flatMap((label) => isRecord(label) && typeof label.name === 'string' ? [label.name] : [])
      : [];
    const summary = cleanExternalText(typeof raw.body === 'string' ? raw.body : '', 320);
    const externalId = typeof raw.id === 'number' || typeof raw.id === 'string'
      ? String(raw.id)
      : url;
    const publishedAt = toIsoDate(typeof raw.created_at === 'string' ? raw.created_at : null);

    const direction = inferDirection(`${repository} ${title} ${labels.join(' ')}`);
    const item: IngestedPathfinderItem = {
      sourceId: source.id,
      externalId,
      canonicalUrl: url,
      type: source.itemType,
      direction,
      directions: [direction],
      titleZh: null,
      titleEn: title,
      summaryZh: null,
      summaryEn: summary || null,
      organization: repository || source.organization,
      organizationEn: repository || source.organization,
      difficulty: 'beginner',
      estimatedMinutes: 240,
      costCny: 0,
      costAmount: 0,
      costCurrency: 'CNY',
      costLabelZh: null,
      costLabelEn: null,
      device: 'computer',
      network: 'high',
      region: 'global',
      regionZh: '全球',
      regionEn: 'Global',
      remoteStatus: 'remote',
      eligibilityZh: '适合已掌握基础 Git 操作、愿意阅读项目贡献指南的大学生；提交前请先与维护者确认。',
      eligibilityEn: 'For students with basic Git skills who can follow the repository contribution guide; confirm with maintainers before starting.',
      deadlineAt: null,
      deadlineText: '以 Issue 当前开放状态为准',
      deadlineTextZh: '以 Issue 当前开放状态为准',
      deadlineTextEn: 'While the GitHub issue remains open',
      deadlineDate: null,
      publishedAt,
      learningEligible: source.learningEligible,
      requiresManualEligibilityCheck: true,
      tags: [...new Set(['good first issue', repository, ...labels].filter(Boolean))].slice(0, 12),
      contentHash: '',
    };
    item.contentHash = contentHash(item);
    return [item];
  });
}

function readTag(block: string, names: string[]): string | null {
  for (const name of names) {
    const escaped = name.replace(':', '\\:');
    const match = block.match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
    if (match?.[1]) return match[1];
  }
  return null;
}

function readAtomLink(block: string): string | null {
  const alternate = block.match(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*\bhref=["']([^"']+)["'][^>]*\/?\s*>/i);
  if (alternate?.[1]) return alternate[1];
  const any = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?\s*>/i);
  return any?.[1] ?? null;
}

function repositoryName(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = value.match(/\/repos\/([^/]+\/[^/]+)$/);
  return match?.[1] ?? '';
}

function inferDirection(value: string): IngestedPathfinderItem['direction'] {
  const normalized = value.toLowerCase();
  if (/\b(ai|ml|llm|model|transformer|pytorch|tensorflow|huggingface)\b/.test(normalized)) return 'ai';
  if (/\b(frontend|react|vue|svelte|css|ui|web)\b/.test(normalized)) return 'frontend';
  if (/\b(data|sql|analytics|pandas|spark)\b/.test(normalized)) return 'data';
  return 'backend';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
