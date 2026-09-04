import type { IngestedPathfinderItem, PathfinderSyncSource } from './types';
import {
  cleanExternalText,
  cleanFeedSummary,
  contentHash,
  markdownToSummary,
  isAllowedHost,
  normalizeIngestionUrl,
  rewriteHost,
  rewriteText,
  toIsoDate,
} from './normalize';
import { isActionableIssue } from './actionable';
import { isStudentRelevant } from './student-relevance';
import { topicsForItem } from './topics';

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
    // 镜像来源要把被替换掉的原站名改回来，否则等于以「官方来源」的名义
    // 发布被篡改过的文本（详见 types.ts 的 rewriteItemText）
    const title = rewriteText(
      cleanExternalText(readTag(block, ['title']) ?? '', 180),
      source.rewriteItemText,
    );
    const rawUrl = readAtomLink(block)
      ?? readTag(block, ['link'])
      ?? readTag(block, ['guid', 'id']);
    // 镜像抓取的来源要把链接改回官方域名，再走白名单校验
    const url = rawUrl
      ? rewriteHost(normalizeIngestionUrl(cleanExternalText(rawUrl, 800)), source.rewriteItemHost)
      : null;
    if (!title || !url || !isAllowedHost(url, source.allowedItemHosts)) return [];

    const externalId = cleanExternalText(readTag(block, ['guid', 'id']) ?? url, 500);
    const summary = rewriteText(
      // 用 cleanFeedSummary 而不是 cleanExternalText：要先去掉文章开头那一行
      // 跳转链接，折叠空白之后就分不出哪段原本是独立一行了
      cleanFeedSummary(
        readTag(block, ['description', 'summary', 'content:encoded', 'content']) ?? '',
        320,
      ),
      source.rewriteItemText,
    );

    /*
     * 企业博客把研究、产品营销和公关混在同一条 RSS 里。营销与公关对学生没有
     * 可操作性，只会稀释机会库的信噪比——实测 109 条 AI 动态里有 16 条属于此类
     * （「用 Google 搜索办一场完美晚宴的 5 种方式」「OpenAI 任命首席营收官」）。
     * 判据偏保守，实测 0 条研究被误杀，理由见 student-relevance.ts。
     */
    if (!isStudentRelevant(title, summary)) return [];
    const publishedAt = toIsoDate(readTag(block, ['pubDate', 'published', 'updated', 'dc:date']));
    const hash = contentHash({ title, url, summary, publishedAt });
    const isZh = source.language === 'zh';

    return [{
      sourceId: source.id,
      externalId,
      canonicalUrl: url,
      type: source.itemType,
      direction: source.direction,
      directions: [source.direction],
      // 中文来源的原文直接落中文列。写进 *_en 渲染上看不出问题
      // （localizeNullable 两个方向都兜底），但列名与内容不符
      titleZh: isZh ? title : null,
      titleEn: isZh ? null : title,
      summaryZh: isZh ? summary || null : null,
      summaryEn: isZh ? null : summary || null,
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
      // 机构名归「机构」维度；`AI` 挂在每一条 AI 动态上，等于没有筛选作用
      // （实测 104 条动态全部带它）。主题改为从标题与摘要里按词表识别
      tags: topicsForItem({ title, summary }),
      contentHash: hash,
    } satisfies IngestedPathfinderItem];
  });
}

/**
 * 崩溃 / 堆栈类 issue 的标题特征。
 *
 * 这类 issue 有时也被打上 good first issue（修复范围确实很小），但标题形如
 * 「FATAL ERROR: v8::ToLocalChecked Empty MaybeLocal」，对学生没有任何指引：
 * 看不出要做什么，正文往往是一段 core dump。命中即跳过。
 *
 * 规则刻意收窄到崩溃签名，不排除普通 bug 修复——那些恰恰是合适的入门任务。
 */
const CRASH_TITLE_PATTERN = /\b(fatal error|segmentation fault|sigsegv|sigabrt|core dumped|stack overflow at|panic:|assertion failed)\b/i;

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
    if (CRASH_TITLE_PATTERN.test(title)) return [];

    // 「开着的 issue」不等于「能上手的 issue」：查询层已挡掉已指派和有关联 PR 的，
    // 这里再按年龄与维护者是否回应过筛一遍，理由见 actionable.ts
    if (!isActionableIssue({
      createdAt: typeof raw.created_at === 'string' ? raw.created_at : null,
      updatedAt: typeof raw.updated_at === 'string' ? raw.updated_at : null,
      comments: typeof raw.comments === 'number' ? raw.comments : 0,
      isPullRequest: raw.pull_request !== undefined,
      hasAssignee: isRecord(raw.assignee)
        || (Array.isArray(raw.assignees) && raw.assignees.length > 0),
    })) return [];

    const repository = repositoryName(raw.repository_url);
    const labels = Array.isArray(raw.labels)
      ? raw.labels.flatMap((label) => isRecord(label) && typeof label.name === 'string' ? [label.name] : [])
      : [];
    // issue 正文是 Markdown，不能按 HTML 清洗
    const summary = markdownToSummary(typeof raw.body === 'string' ? raw.body : '', 320);
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
      // 仓库名归「机构」维度，原始标签大半是维护者的分诊记号；
      // 主题一律按词表从标题/摘要/标签里识别，噪声标签天然进不来
      tags: topicsForItem({ title, summary, labels }),
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
      // 地点已经存在 region 字段里、公司名归「机构」维度，都不进主题。
      // 职位板不带正文，只能从职位名识别方向（如「Machine Learning Intern」）
      tags: topicsForItem({ title }),
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
