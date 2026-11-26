import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { getSiteUrl } from '@/lib/constants';
import { imagePlaceholder } from './config';

/**
 * Markdown → 微信公众号正文 HTML。
 *
 * 不复用 src/lib/markdown.ts 的 markdownToHtml()：那条管线会把外链图片改写成
 * /_next/image?url=...（微信抓不到），并给 <a> 加 target=_blank（微信正文不支持）。
 * 公众号编辑器还会丢弃 <style>、class、id，所以所有排版必须写成行内 style。
 *
 * 安全：remarkRehype 不开 allowDangerousHtml，Markdown 里的原生 HTML 只会变成文本；
 * 生成的标签和属性全部由本文件的 allowlist 决定，链接协议也被显式过滤。
 */

const STYLES = {
  section: 'font-size:16px;line-height:1.8;color:#3f3f3f;letter-spacing:0.3px;word-break:break-word;padding:0 2px;',
  h1: 'font-size:22px;font-weight:700;line-height:1.4;margin:28px 0 14px;color:#1a1a1a;',
  h2: 'font-size:20px;font-weight:700;line-height:1.4;margin:26px 0 12px;color:#1a1a1a;border-left:4px solid #7c5cff;padding-left:10px;',
  h3: 'font-size:18px;font-weight:700;line-height:1.45;margin:22px 0 10px;color:#1a1a1a;',
  h4: 'font-size:16px;font-weight:700;line-height:1.5;margin:20px 0 8px;color:#1a1a1a;',
  h5: 'font-size:15px;font-weight:700;line-height:1.5;margin:18px 0 8px;color:#1a1a1a;',
  h6: 'font-size:15px;font-weight:700;line-height:1.5;margin:18px 0 8px;color:#555;',
  p: 'margin:0 0 16px;line-height:1.8;',
  a: 'color:#576b95;text-decoration:none;',
  strong: 'font-weight:700;color:#1a1a1a;',
  em: 'font-style:italic;',
  ul: 'margin:0 0 16px;padding-left:22px;',
  ol: 'margin:0 0 16px;padding-left:22px;',
  li: 'margin:0 0 6px;line-height:1.8;',
  blockquote: 'margin:0 0 16px;padding:10px 14px;border-left:4px solid #d9d0ff;background:#f7f5ff;color:#555;',
  pre: 'margin:0 0 16px;padding:14px 16px;background:#f6f6f7;border-radius:6px;overflow-x:auto;',
  preCode: 'font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.65;white-space:pre-wrap;word-break:break-all;color:#333;',
  code: 'font-family:Menlo,Consolas,monospace;font-size:14px;background:#f2f2f4;padding:2px 5px;border-radius:3px;color:#c7254e;',
  img: 'max-width:100%;height:auto;display:block;margin:16px auto;border-radius:4px;',
  hr: 'border:none;border-top:1px solid #e5e5e5;margin:24px 0;',
  table: 'width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;',
  th: 'border:1px solid #e0e0e0;padding:8px 10px;background:#f7f7f8;text-align:left;font-weight:700;',
  td: 'border:1px solid #e0e0e0;padding:8px 10px;',
  del: 'color:#999;',
} as const;

const TAG_STYLE_KEYS: Record<string, keyof typeof STYLES> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  p: 'p', a: 'a', strong: 'strong', em: 'em', ul: 'ul', ol: 'ol', li: 'li',
  blockquote: 'blockquote', pre: 'pre', code: 'code', img: 'img', hr: 'hr',
  table: 'table', th: 'th', td: 'td', del: 'del',
};

const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

export interface WechatRenderResult {
  html: string;
  /** 按出现顺序去重后的原始图片地址，供后续上传微信素材 */
  imageSources: string[];
  /** 纯文本，用来兜底生成摘要 */
  plainText: string;
}

interface PluginContext {
  imageSources: string[];
  textParts: string[];
  siteUrl: string;
}

function absolutize(src: string, siteUrl: string): string | null {
  try {
    const url = new URL(src, siteUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function rehypeWechatStyles(ctx: PluginContext) {
  return (tree: Root) => {
    // 任务列表的 <input type="checkbox"> 微信不支持，改成可见文字
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'input' || !parent || index === undefined) return;
      if (node.properties?.type !== 'checkbox') return;
      const checked = Boolean(node.properties.checked);
      parent.children[index] = { type: 'text', value: checked ? '[x] ' : '[ ] ' };
    });

    visit(tree, 'text', (node) => {
      if (node.value.trim()) ctx.textParts.push(node.value);
    });

    visit(tree, 'element', (node: Element, _index, parent) => {
      const inPre = parent?.type === 'element' && (parent as Element).tagName === 'pre';
      const styleKey = TAG_STYLE_KEYS[node.tagName];
      if (styleKey) {
        node.properties.style = node.tagName === 'code' && inPre ? STYLES.preCode : STYLES[styleKey];
      }
      // 微信会剥掉这些属性，留着只会让预览和线上不一致
      delete node.properties.className;
      delete node.properties.id;
      delete node.properties.target;
      delete node.properties.rel;

      if (node.tagName === 'a') {
        const href = node.properties.href;
        if (typeof href === 'string') {
          const normalized = SAFE_LINK.test(href) ? href : absolutize(href, ctx.siteUrl);
          if (normalized) node.properties.href = normalized;
          else delete node.properties.href;
        } else {
          delete node.properties.href;
        }
        return;
      }

      if (node.tagName === 'img') {
        const src = node.properties.src;
        if (typeof src !== 'string') {
          node.properties.src = '';
          return;
        }
        const normalized = absolutize(src, ctx.siteUrl);
        if (!normalized) {
          node.properties.src = '';
          return;
        }
        let imageIndex = ctx.imageSources.indexOf(normalized);
        if (imageIndex === -1) {
          imageIndex = ctx.imageSources.length;
          ctx.imageSources.push(normalized);
        }
        node.properties.src = imagePlaceholder(imageIndex);
        delete node.properties.srcset;
        delete node.properties.sizes;
        delete node.properties.loading;
      }
    });
  };
}

export function renderWechatMarkdown(markdown: string, siteUrl = getSiteUrl()): WechatRenderResult {
  const ctx: PluginContext = { imageSources: [], textParts: [], siteUrl };
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => rehypeWechatStyles(ctx))
    .use(rehypeStringify);
  const body = String(processor.processSync(markdown));
  return {
    html: `<section style="${STYLES.section}">${body}</section>`,
    imageSources: ctx.imageSources,
    plainText: ctx.textParts.join(' ').replace(/\s+/g, ' ').trim(),
  };
}
