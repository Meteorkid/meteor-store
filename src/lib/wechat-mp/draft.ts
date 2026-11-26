import { addDraft, WechatMpError, WechatMpConfigError } from './client';
import { isWechatMpConfigured, WECHAT_MP_BACKEND_URL, WECHAT_MP_MODE } from './config';
import { inlineImages, resolveCoverMediaId, restorePreviewImages } from './images';
import { renderWechatMarkdown } from './markdown';
import { resolveDraftSource, type DraftSourceInput } from './sources';

/** 微信草稿字段的长度上限（超出会被接口拒绝，提前截断并让管理员在预览里看到） */
const LIMITS = { title: 64, author: 20, digest: 120, content: 200_000 } as const;

function clip(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export interface CreateDraftInput {
  source: DraftSourceInput;
  /** true 时只做转换与预览，不读凭据、不调用任何微信接口 */
  dryRun: boolean;
  /** 保留字段：当前恒为 false，个人主体账号没有发表接口权限 */
  publish: boolean;
  cover?: string;
  overrides?: {
    title?: string;
    author?: string;
    digest?: string;
    sourceUrl?: string;
  };
}

export interface DraftResult {
  mode: 'preview' | 'created';
  accountMode: typeof WECHAT_MP_MODE;
  title: string;
  author: string;
  digest: string;
  sourceUrl: string;
  html: string;
  imageSources: string[];
  warnings: string[];
  mediaId?: string;
  coverSource?: string;
  uploadedImages?: number;
  backendUrl: string;
  nextStep: string;
}

/**
 * 内容源 → 微信正文 HTML → 图片/封面转存 → 草稿箱。
 * dry-run 路径完全离线，配好 AppID/AppSecret 之前就能验证排版。
 */
export async function createWechatDraft(input: CreateDraftInput): Promise<DraftResult> {
  if (input.publish) {
    throw new WechatMpError(
      '当前只创建草稿，不调用发表接口。个人主体订阅号自 2025 年 7 月起已被回收 freepublish 权限，最后一步请在公众号后台手动点「发表」。',
      'publish_unsupported',
    );
  }

  const source = await resolveDraftSource(input.source);
  const title = clip(input.overrides?.title?.trim() || source.title, LIMITS.title);
  const author = clip(input.overrides?.author?.trim() || source.author, LIMITS.author);
  const digest = clip(input.overrides?.digest?.trim() || source.digest, LIMITS.digest);
  const sourceUrl = input.overrides?.sourceUrl?.trim() || source.sourceUrl;
  if (!title) throw new WechatMpError('标题不能为空', 'title_missing');

  const rendered = renderWechatMarkdown(source.markdown);
  const common = {
    accountMode: WECHAT_MP_MODE,
    title,
    author,
    digest: clip(digest || rendered.plainText, LIMITS.digest),
    sourceUrl,
    imageSources: rendered.imageSources,
    backendUrl: WECHAT_MP_BACKEND_URL,
  };

  if (input.dryRun) {
    return {
      ...common,
      mode: 'preview',
      html: restorePreviewImages(rendered.html, rendered.imageSources),
      warnings: [],
      nextStep: '这是预览，还没有写入公众号。确认排版后点「创建草稿」；正文图片会在提交时转存到微信素材库。',
    };
  }

  if (!isWechatMpConfigured()) {
    throw new WechatMpConfigError('公众号 AppID / AppSecret 未配置，无法创建草稿（预览不受影响）');
  }

  const inlined = await inlineImages(rendered.html, rendered.imageSources);
  const cover = await resolveCoverMediaId(input.cover, rendered.imageSources);
  if (inlined.html.length > LIMITS.content) {
    throw new WechatMpError('正文超过微信图文长度上限，请拆分文章', 'content_too_long');
  }

  const mediaId = await addDraft({
    title,
    author,
    digest: common.digest,
    content: inlined.html,
    content_source_url: sourceUrl,
    thumb_media_id: cover.mediaId,
  });

  return {
    ...common,
    mode: 'created',
    html: inlined.html,
    warnings: inlined.warnings,
    mediaId,
    coverSource: cover.source,
    uploadedImages: inlined.uploaded,
    nextStep: '草稿已创建。请到公众号后台「内容与互动 → 草稿箱」核对标题、封面和排版，再手动点「发表」。',
  };
}
