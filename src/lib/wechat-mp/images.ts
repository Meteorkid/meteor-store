import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { getSiteUrl } from '@/lib/constants';
import { uploadContentImage, uploadPermanentImage, WechatMpError, type UploadedImage } from './client';
import { imagePlaceholder } from './config';

/**
 * 图片转存：微信图文正文不接受站外图片地址，必须先上传到微信素材库，
 * 用返回的 mmbiz.qpic.cn URL 替换 src；封面还必须是「永久素材」的 media_id。
 */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
};

export interface InlineImagesResult {
  html: string;
  uploaded: number;
  warnings: string[];
}

export interface CoverResult {
  mediaId: string;
  source: string;
  reused: boolean;
}

function normalizeMime(value: string | null): string | null {
  if (!value) return null;
  const mime = value.split(';')[0].trim().toLowerCase();
  return ALLOWED_MIMES.has(mime) ? mime : null;
}

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes.length >= 6 && bytes.slice(0, 3).every((b, i) => b === [0x47, 0x49, 0x46][i])) return 'image/gif';
  if (bytes.length >= 12 && bytes.slice(0, 4).every((b, i) => b === [0x52, 0x49, 0x46, 0x46][i])
    && bytes.slice(8, 12).every((b, i) => b === [0x57, 0x45, 0x42, 0x50][i])) return 'image/webp';
  return null;
}

function extensionFor(mime: string): string {
  return { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }[mime] ?? '.png';
}

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1' || host === '0.0.0.0') return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) return true;
  const match = /^172\.(\d+)\./.exec(host);
  if (match && Number(match[1]) >= 16 && Number(match[1]) <= 31) return true;
  return /^f[cd][0-9a-f]{2}:/i.test(host);
}

function imageError(message: string): WechatMpError {
  return new WechatMpError(message, 'image_load_failed');
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** dry-run 预览时用原图地址，让管理员在提交前看到真实排版 */
export function restorePreviewImages(html: string, sources: string[]): string {
  return html.replace(/WECHAT_MP_IMAGE_(\d+)_/g, (_match, index: string) => {
    return escapeHtml(sources[Number(index)] ?? '');
  });
}

async function readPublicImage(pathname: string): Promise<UploadedImage> {
  const publicDir = resolve(process.cwd(), 'public');
  const filePath = resolve(publicDir, `.${decodeURIComponent(pathname)}`);
  if (!filePath.startsWith(`${publicDir}/`)) throw imageError('图片路径越界');
  const bytes = new Uint8Array(await readFile(filePath));
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  const mime = MIME_BY_EXT[ext] ?? sniffMime(bytes);
  if (!mime) throw imageError(`无法识别图片格式：${basename(filePath)}`);
  return { bytes, mime, filename: basename(filePath) };
}

/** 支持 http(s) 绝对地址与站内 /public 路径（默认封面就是站内文件） */
export async function loadImage(source: string): Promise<UploadedImage> {
  let url: URL;
  try {
    url = new URL(source, getSiteUrl());
  } catch {
    throw imageError(`图片地址无效：${source}`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw imageError(`不支持的图片协议：${url.protocol}`);
  }
  if (isPrivateHost(url.hostname)) throw imageError('不允许从内网地址读取图片');

  const site = new URL(getSiteUrl());
  if (url.hostname === site.hostname && !url.pathname.startsWith('/api/')) {
    try {
      return await readPublicImage(url.pathname);
    } catch {
      // public 目录里没有就继续走 HTTP（部署形态差异下仍要能工作）
    }
  }

  let response: Response;
  try {
    response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  } catch (error) {
    throw imageError(`图片下载失败：${error instanceof Error ? error.message : String(error)}`);
  }
  if (!response.ok) throw imageError(`图片下载失败：HTTP ${response.status}`);
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) throw imageError('图片超过 5MB 上限');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw imageError('图片超过 5MB 上限');
  const mime = normalizeMime(response.headers.get('content-type')) ?? sniffMime(bytes);
  if (!mime) throw imageError('微信只接受 jpg / png / webp / gif 图片');
  const name = basename(url.pathname) || `image${extensionFor(mime)}`;
  return { bytes, mime, filename: name.includes('.') ? name : `image${extensionFor(mime)}` };
}

/** 串行上传，避免撞上微信的频率限制；单张失败不丢整篇草稿 */
export async function inlineImages(html: string, sources: string[]): Promise<InlineImagesResult> {
  let result = html;
  const warnings: string[] = [];
  let uploaded = 0;
  for (const [index, source] of sources.entries()) {
    const placeholder = imagePlaceholder(index);
    try {
      const url = await uploadContentImage(await loadImage(source));
      result = result.split(placeholder).join(escapeHtml(url));
      uploaded += 1;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      warnings.push(`第 ${index + 1} 张图片未能同步：${reason}`);
      // 直接留一个空 src 会在公众号里变成破图，把整个 img 换成可见提示
      const broken = new RegExp(`<img[^>]*${placeholder}[^>]*>`, 'g');
      result = result.replace(broken, '<span style="color:#999;font-size:13px;">[图片未能同步]</span>')
        .split(placeholder).join('');
    }
  }
  return { html: result, uploaded, warnings };
}

/**
 * 封面优先级：管理员显式指定 > 预置的永久素材 media_id > 正文第一张图 > 默认封面。
 * 配了 WECHAT_MP_COVER_MEDIA_ID 就不会每篇都往素材库里堆同一张图。
 */
export async function resolveCoverMediaId(coverHint: string | undefined, imageSources: string[]): Promise<CoverResult> {
  const explicit = coverHint?.trim();
  if (!explicit) {
    const preset = process.env.WECHAT_MP_COVER_MEDIA_ID?.trim();
    if (preset) return { mediaId: preset, source: 'WECHAT_MP_COVER_MEDIA_ID', reused: true };
  }
  const source = explicit || imageSources[0] || process.env.WECHAT_MP_DEFAULT_COVER?.trim() || '/og-image.png';
  const mediaId = await uploadPermanentImage(await loadImage(source));
  return { mediaId, source, reused: false };
}
