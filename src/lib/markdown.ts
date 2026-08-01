import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Markdown → HTML，输出用于 dangerouslySetInnerHTML。
 *
 * 之前是一份 148 行的手写解析器：只支持 Markdown 的一个子集，每加一种写法都要
 * 再手写一段解析，而且它的安全性等于「这段代码没写错」。换成 remark/rehype 之后，
 * 加能力 = 加插件，安全性交给 rehype-sanitize 的 allowlist。
 *
 * 安全模型：先把 Markdown 转成 HTML 树，再用 allowlist 过滤。正文里的原生 HTML
 * 会被 sanitize 丢弃（不是转义显示），所以渲染不受信任的内容也不会产生 XSS。
 */

/** 在默认 allowlist 基础上，放行代码块的语言标记 */
const schema: typeof defaultSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // 语法高亮要靠 class="language-xxx" 识别语言
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-./]],
    // rehype-external-links 加的属性要能活过 sanitize，否则外链的安全属性会被剥掉
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading'],
  },
};

/** next/image 优化的响应式宽度档位 */
const NEXT_IMAGE_WIDTHS = [640, 828, 1200, 1920];
const NEXT_IMAGE_DEFAULT_WIDTH = 1200;
const NEXT_IMAGE_QUALITY = 75;

/**
 * 把外链图片的 src 改写为 /_next/image?url=...&w=...&q=...，
 * 让原生 <img> 也能享受 next/image 的 webp/avif 转换和响应式尺寸。
 *
 * 必须放在 rehype-sanitize 之后：sanitize 已清理掉危险协议（javascript:/data:/vbscript:），
 * 这里只改写已经安全的 http/https 外链。相对路径和 data: 不动。
 *
 * 不需要 <Image> 组件：/_next/image 是 Next 的图片优化端点，原生 <img> 直接用。
 * 需要在 next.config.ts 的 images.remotePatterns 放行远程域名。
 */
function rehypeNextImage() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (typeof src !== 'string') return;
      // 只改写 http/https 外链，站内相对路径和 data: 不动
      if (!/^https?:\/\//.test(src)) return;

      const encoded = encodeURIComponent(src);
      node.properties.src = `/_next/image?url=${encoded}&w=${NEXT_IMAGE_DEFAULT_WIDTH}&q=${NEXT_IMAGE_QUALITY}`;
      node.properties.srcset = NEXT_IMAGE_WIDTHS.map(
        (w) => `/_next/image?url=${encoded}&w=${w}&q=${NEXT_IMAGE_QUALITY} ${w}w`,
      ).join(', ');
      node.properties.sizes = '(max-width: 768px) 100vw, 768px';
    });
  };
}

const processor = unified()
  .use(remarkParse)
  // GFM：表格、删除线、任务列表、自动链接
  .use(remarkGfm)
  // allowDangerousHtml 不开：正文里的原生 HTML 直接丢弃
  .use(remarkRehype)
  .use(rehypeExternalLinks, {
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
    // 只有 http(s) 外链才加，站内相对链接保持原样
    protocols: ['http', 'https'],
  })
  .use(rehypeSanitize, schema)
  // sanitize 之后改写图片 src，让原生 <img> 走 next/image 优化端点
  .use(rehypeNextImage)
  .use(rehypeStringify);

/**
 * 同步渲染。调用方都是 Server Component，同步能让调用点保持简单；
 * 当前插件链没有异步插件，processSync 可用。
 */
export function markdownToHtml(md: string): string {
  return String(processor.processSync(md));
}
