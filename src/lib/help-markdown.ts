import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Locale } from '@/i18n/routing';

export interface HelpHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

const helpSchema: typeof defaultSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-./]],
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      'loading',
      'width',
      'height',
      'decoding',
    ],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'figure',
    'figcaption',
  ],
};

function rehypeHelpHeadings() {
  const seen = new Map<string, number>();

  function slugify(text: string): string {
    const cleaned = text.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
    if (!cleaned) return 'section';
    return cleaned.replace(/\s+/g, '-');
  }

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const text = collectText(node);
      if (!text) return;

      const base = slugify(text);
      const count = seen.get(base) ?? 0;
      const id = count === 0 ? base : `${base}-${count + 1}`;
      seen.set(base, count + 1);

      node.properties = node.properties ?? {};
      node.properties.id = id;
    });
  };
}

function collectText(node: Element): string {
  const parts: string[] = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      parts.push((child as Text).value);
    } else if (child.type === 'element') {
      parts.push(collectText(child as Element));
    }
  }
  return parts.join('');
}

export function extractHeadings(html: string): HelpHeading[] {
  const headings: HelpHeading[] = [];
  const regex = /<(h[23])\s+id="([^"]*)"[^>]*>(.*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1].charAt(1), 10) as 2 | 3;
    const id = match[2];
    const rawText = match[3].replace(/<[^>]*>/g, '');
    headings.push({ level, id, text: rawText });
  }
  return headings;
}

function rehypeHelpExternalLinks(locale: Locale) {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return;
      const href = typeof node.properties?.href === 'string' ? node.properties.href : '';
      if (!/^https?:\/\//.test(href)) return;

      const indicator = ' ↗';
      node.children.push({ type: 'text' as const, value: indicator });
    });
  };
}

function isSafeImagePath(src: string, slug: string): boolean {
  if (!src.startsWith(`/help/${slug}/`)) return false;
  const decoded = decodeURIComponent(src);
  if (decoded.includes('..')) return false;
  if (!decoded.startsWith(`/help/${slug}/`)) return false;
  return true;
}

function rehypeHelpImages(slug: string) {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;
      const src = typeof node.properties?.src === 'string' ? node.properties.src : '';
      if (!isSafeImagePath(src, slug)) return;

      node.properties = node.properties ?? {};
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';

      const filePath = join(process.cwd(), 'public', src.slice(1));
      if (!existsSync(filePath)) return;

      try {
        // Use synchronous probe to get dimensions without full decode
        const { execSync } = require('child_process');
        // Fall back to just adding lazy/decoding without dimensions for now
        // Sharp dimensions will be added when processing actual images in Task 16
      } catch {
        // skip
      }
    });
  };
}

export interface RenderHelpMarkdownInput {
  content: string;
  slug: string;
  locale: Locale;
}

export interface RenderHelpMarkdownOutput {
  html: string;
  headings: HelpHeading[];
}

export function renderHelpMarkdown(
  input: RenderHelpMarkdownInput,
): RenderHelpMarkdownOutput {
  const { content, slug, locale } = input;

  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
      protocols: ['http', 'https'],
    })
    .use(rehypeSanitize, helpSchema)
    .use(rehypeHelpHeadings)
    .use(rehypeHelpImages, slug)
    .use(rehypeHelpExternalLinks, locale)
    .use(rehypeStringify)
    .processSync(content);

  const html = String(result);
  const headings = extractHeadings(html);

  return { html, headings };
}
