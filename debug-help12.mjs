import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

const helpSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'figure', 'figcaption'],
};

function rehypeHelpHeadings() {
  const seen = new Map();
  function slugify(text) {
    const cleaned = text.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
    if (!cleaned) return 'section';
    return cleaned.replace(/\s+/g, '-');
  }
  function collectText(node) {
    const parts = [];
    for (const child of node.children) {
      if (child.type === 'text') parts.push(child.value);
      else if (child.type === 'element') parts.push(collectText(child));
    }
    return parts.join('');
  }
  return (tree) => {
    visit(tree, 'element', (node) => {
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

function rehypeHelpImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
    });
  };
}

function rehypeHelpExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = typeof node.properties?.href === 'string' ? node.properties.href : '';
      if (!/^https?:\/\//.test(href)) return;
      node.children.push({ type: 'text', value: ' ↗' });
    });
  };
}

// Test: EXACT pipeline from help-markdown.ts but as shared processor
const processor = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
  .use(rehypeHelpHeadings)
  .use(rehypeSanitize, helpSchema)
  .use(rehypeHelpImages)
  .use(rehypeHelpExternalLinks)
  .use(rehypeStringify);

console.log('Shared processor:');
try {
  console.log('  Normal:', String(processor.processSync('## Hello\n\nWorld')).substring(0, 80));
  console.log('  XSS:', String(processor.processSync('<script>alert(1)</script>\n\nOK')).substring(0, 80));
  console.log('  JS link:', String(processor.processSync('[click](javascript:alert(1))')).substring(0, 80));
  console.log('  External:', String(processor.processSync('[Apple](https://apple.com)')).substring(0, 120));
  console.log('  Internal:', String(processor.processSync('[Help](/docs)')).substring(0, 120));
  console.log('  Dup:', String(processor.processSync('## 注册\n\n## 注册')).substring(0, 120));
  console.log('  Bold:', String(processor.processSync('## 如何**注册**账户')).substring(0, 120));
  console.log('  All OK!');
} catch(e) { console.log('  FAIL:', e.message); }

// Now test new processor per call
console.log('\nNew processor per call:');
try {
  const p = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeHelpHeadings)
    .use(rehypeSanitize, helpSchema)
    .use(rehypeHelpImages)
    .use(rehypeHelpExternalLinks)
    .use(rehypeStringify);
  console.log('  Normal:', String(p.processSync('## Hello\n\nWorld')).substring(0, 80));
  console.log('  XSS:', String(p.processSync('<script>alert(1)</script>\n\nOK')).substring(0, 80));
  console.log('  All OK!');
} catch(e) { console.log('  FAIL:', e.message); }
