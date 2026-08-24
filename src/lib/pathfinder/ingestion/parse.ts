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
  if (source.adapterId === 'rss') return parseRss(source, body);
  if (source.adapterId === 'greenhouse') return parseGreenhouseJobs(source, body);
  return parseGithubSearch(source, body);
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

    // 已策展来源的方向由那条仓库条目背书；泛搜索只能从标题和标签里猜
    const direction = source.curated
      ? source.direction
      : inferDirection(`${repository} ${title} ${labels.join(' ')}`);
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
      // 泛搜索的 issue 可能来自任何仓库，能不能上手要人看过才知道；
      // 已策展仓库的贡献指南是公开的，没有需要逐人核对的个人资格条件
      requiresManualEligibilityCheck: !source.curated,
      tags: [...new Set(['good first issue', repository, ...labels].filter(Boolean))].slice(0, 12),
      contentHash: '',
    };
    item.contentHash = contentHash(item);
    return [item];
  });
}

/**
 * 只保留面向学生的岗位。
 *
 * 必须用词边界匹配：`International`、`Internal` 都包含 intern 子串，
 * 直接 includes 会把「国际会计经理」当成实习岗放进来（真实踩过）。
 */
const STUDENT_ROLE_PATTERN = /\b(intern|interns|internship|internships|new ?grad|new ?graduate|university (?:graduate|program)|campus)\b/i;

/** 一次同步最多接收的岗位数，避免大公司职位板一口气灌满目录。 */
const MAX_JOBS_PER_SYNC = 20;

/**
 * 解析 Greenhouse 公开职位板（`/v1/boards/{token}/jobs`）。
 *
 * 目录里原本只有「XX 集团招聘入口」这类门户，学生点进去还要自己在几百个岗位里翻；
 * 这里下沉到具体岗位：岗位名、地点、发布时间都来自雇主官方职位板。
 * 不请求 `content=true`：大公司职位板有上千个岗位，带正文会直接超过响应体上限。
 */
export function parseGreenhouseJobs(
  source: PathfinderSyncSource,
  json: string,
): IngestedPathfinderItem[] {
  let payload: unknown;
  try {
    payload = JSON.parse(json);
  } catch {
    throw new Error(`pathfinder source returned invalid JSON: ${source.id}`);
  }
  const jobs = isRecord(payload) && Array.isArray(payload.jobs) ? payload.jobs : [];

  return jobs.flatMap((raw) => {
    if (!isRecord(raw)) return [];
    const title = cleanExternalText(typeof raw.title === 'string' ? raw.title : '', 180);
    if (!title || !STUDENT_ROLE_PATTERN.test(title)) return [];

    const url = normalizeIngestionUrl(typeof raw.absolute_url === 'string' ? raw.absolute_url : '');
    if (!url || !isAllowedHost(url, source.allowedItemHosts)) return [];

    const location = isRecord(raw.location) && typeof raw.location.name === 'string'
      ? cleanExternalText(raw.location.name, 120)
      : '';
    const company = typeof raw.company_name === 'string' && raw.company_name.trim()
      ? cleanExternalText(raw.company_name, 120)
      : source.organization;
    const externalId = typeof raw.id === 'number' || typeof raw.id === 'string'
      ? String(raw.id)
      : url;
    const publishedAt = toIsoDate(
      (typeof raw.first_published === 'string' ? raw.first_published : null)
      ?? (typeof raw.updated_at === 'string' ? raw.updated_at : null),
    );
    const deadlineAt = toIsoDate(
      typeof raw.application_deadline === 'string' ? raw.application_deadline : null,
    );
    const remoteStatus = location && /\bremote\b/i.test(location) ? 'remote' : location ? 'onsite' : 'unspecified';

    const item: IngestedPathfinderItem = {
      sourceId: source.id,
      externalId,
      canonicalUrl: url,
      type: source.itemType,
      direction: source.direction,
      directions: [source.direction],
      titleZh: null,
      titleEn: title,
      // 职位板不带正文（带上会超响应体上限），摘要只由结构化字段拼出，不编造内容
      summaryZh: location
        ? `${company} 在${location}开放的学生岗位；职责、年级与工作许可要求以官方职位描述为准。`
        : `${company} 开放的学生岗位；职责、年级与工作许可要求以官方职位描述为准。`,
      summaryEn: location
        ? `Student role at ${company} in ${location}. Check the official listing for responsibilities and eligibility.`
        : `Student role at ${company}. Check the official listing for responsibilities and eligibility.`,
      organization: company,
      organizationEn: company,
      difficulty: 'all',
      estimatedMinutes: null,
      costCny: 0,
      costAmount: 0,
      costCurrency: 'CNY',
      costLabelZh: null,
      costLabelEn: null,
      device: 'computer',
      network: 'normal',
      region: location || 'unspecified',
      regionZh: location || null,
      regionEn: location || null,
      remoteStatus,
      eligibilityZh: '面向在读学生或应届毕业生；年级、地点与工作许可要求以官方职位描述为准，投递前请逐条核对。',
      eligibilityEn: 'For current students or recent graduates; verify graduation year, location, and work authorization in the official listing before applying.',
      deadlineAt,
      deadlineText: null,
      deadlineTextZh: null,
      deadlineTextEn: null,
      deadlineDate: null,
      publishedAt,
      learningEligible: source.learningEligible,
      // 工作许可、年级、地点都是画像收集不到的硬条件，只能由本人核对
      requiresManualEligibilityCheck: true,
      tags: [...new Set(['internship', company, location].filter(Boolean))].slice(0, 8),
      contentHash: '',
    };
    item.contentHash = contentHash(item);
    return [item];
  }).slice(0, MAX_JOBS_PER_SYNC);
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
