/**
 * 小红书笔记的发布前校验。
 *
 * 平台规则会变，而且英文、数字、emoji 的计数没有公开的官方口径；
 * 这里按「字符数」保守估算，只负责把明显超限/高风险的内容拦在复制之前，
 * 最终仍以 App 里的计数器和审核结果为准。
 */

export const XHS_TITLE_LIMIT = 20;
export const XHS_BODY_LIMIT = 1000;
export const XHS_BODY_RECOMMENDED = 800;
export const XHS_TAG_LIMIT = 10;
export const XHS_IMAGE_LIMIT = 18;
export const XHS_IMAGE_RECOMMENDED_MIN = 6;
export const XHS_IMAGE_RECOMMENDED_MAX = 9;

export type XhsIssueLevel = 'error' | 'warning';
export type XhsIssueField = 'title' | 'body' | 'tags' | 'images' | 'source';

export interface XhsValidationIssue {
  level: XhsIssueLevel;
  field: XhsIssueField;
  message: string;
}

export interface XhsValidationInput {
  title: string;
  body: string;
  tags: string[];
  images: string[];
  status?: 'draft' | 'ready' | 'published';
}

/** 按 Unicode code point 计数，中文与常见 emoji 都算 1 个字符。 */
export function countChars(value: string): number {
  return Array.from(value).length;
}

/** 截断到指定字符数，不把 emoji 从中间切开。 */
export function truncateChars(value: string, limit: number): string {
  const chars = Array.from(value);
  return chars.length <= limit ? value : chars.slice(0, limit).join('');
}

/** 去掉用户习惯输入的 #，只保留标签文本。 */
export function normalizeXhsTag(value: string): string {
  return value.trim().replace(/^#+/, '').replace(/\s+/g, ' ');
}

export function normalizeXhsTags(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const tag = normalizeXhsTag(value).slice(0, 24);
    if (!tag) continue;
    const key = tag.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
    if (result.length >= XHS_TAG_LIMIT) break;
  }
  return result;
}

function issue(level: XhsIssueLevel, field: XhsIssueField, message: string): XhsValidationIssue {
  return { level, field, message };
}

/**
 * 返回所有阻断项和提醒项。
 * `draft` 允许留空；`ready` / `published` 要求标题、正文、至少一张图齐全。
 */
export function validateXhsNote(input: XhsValidationInput): XhsValidationIssue[] {
  const issues: XhsValidationIssue[] = [];
  const titleLength = countChars(input.title.trim());
  const bodyLength = countChars(input.body.trim());
  const status = input.status ?? 'draft';

  if (titleLength > XHS_TITLE_LIMIT) {
    issues.push(issue('error', 'title', `标题 ${titleLength} 字，超过 ${XHS_TITLE_LIMIT} 字上限`));
  }
  if (bodyLength > XHS_BODY_LIMIT) {
    issues.push(issue('error', 'body', `正文 ${bodyLength} 字，超过 ${XHS_BODY_LIMIT} 字上限`));
  }
  if (input.tags.length > XHS_TAG_LIMIT) {
    issues.push(issue('error', 'tags', `标签 ${input.tags.length} 个，超过 ${XHS_TAG_LIMIT} 个上限`));
  }
  if (input.images.length > XHS_IMAGE_LIMIT) {
    issues.push(issue('error', 'images', `图片 ${input.images.length} 张，超过 ${XHS_IMAGE_LIMIT} 张上限`));
  }

  if (status !== 'draft') {
    if (titleLength === 0) issues.push(issue('error', 'title', '发布前需要标题'));
    if (bodyLength === 0) issues.push(issue('error', 'body', '发布前需要正文'));
    if (input.images.length === 0) issues.push(issue('error', 'images', '发布前至少需要 1 张图片'));
  } else {
    if (titleLength === 0) issues.push(issue('warning', 'title', '还没有标题'));
    if (bodyLength === 0) issues.push(issue('warning', 'body', '还没有正文'));
  }

  if (bodyLength > 0 && bodyLength < 80) {
    issues.push(issue('warning', 'body', '正文偏短，小红书通常 600–800 字更容易读完'));
  }
  if (bodyLength > XHS_BODY_RECOMMENDED) {
    issues.push(issue('warning', 'body', `正文已超过建议的 ${XHS_BODY_RECOMMENDED} 字，仍在上限内`));
  }

  if (input.images.length > 0 && input.images.length < XHS_IMAGE_RECOMMENDED_MIN) {
    issues.push(issue('warning', 'images', `目前 ${input.images.length} 张，建议 6–9 张`));
  }
  if (input.images.length > XHS_IMAGE_RECOMMENDED_MAX && input.images.length <= XHS_IMAGE_LIMIT) {
    issues.push(issue('warning', 'images', `目前 ${input.images.length} 张，超过常用的 9 张，请确认 App 端上限`));
  }

  const riskyTitle = input.title.match(/最佳|最好|最强|最高|最低|第一|顶级|唯一|首个|国家级|全网第一/);
  if (riskyTitle) {
    issues.push(issue('warning', 'title', `标题含「${riskyTitle[0]}」，可能触发绝对化用语审核`));
  }
  const contact = input.body.match(/微信|VX|vx|威信|加V|加v|手机号|电话|二维码|扫码|私信我|http:\/\/|https:\/\//);
  if (contact) {
    issues.push(issue('warning', 'body', `正文含「${contact[0]}」，小红书会限制导流外链/联系方式`));
  }

  return issues;
}

export function hasBlockingIssues(issues: XhsValidationIssue[]): boolean {
  return issues.some((item) => item.level === 'error');
}
