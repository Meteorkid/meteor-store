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

function rehypeHelpImages(slug) {
  return (tree) => {
    console.log('  images got tree:', !!tree, 'type:', tree?.type);
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
    });
  };
}

const content = '<script>alert(1)</script>\n\n正常段落';

// Test 1: Full pipeline with XSS content
console.log('=== Test 1: Full pipeline with XSS ===');
try {
  const p = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeSanitize, helpSchema)
    .use(rehypeHelpImages('test'))
    .use(rehypeStringify);
  const r = p.processSync(content);
  console.log('OK:', String(r).substring(0, 100));
} catch(e) { console.log('FAIL:', e.message); }

// Test 2: Full pipeline with NORMAL content (no XSS)
console.log('\n=== Test 2: Full pipeline with normal content ===');
try {
  const p2 = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeSanitize, helpSchema)
    .use(rehypeHelpImages('test'))
    .use(rehypeStringify);
  const r2 = p2.processSync('## Hello\n\nWorld');
  console.log('OK:', String(r2).substring(0, 200));
} catch(e) { console.log('FAIL:', e.message); }

// Test 3: Pipeline WITHOUT sanitize (XSS content)
console.log('\n=== Test 3: Pipeline WITHOUT sanitize ===');
try {
  const p3 = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeHelpImages('test'))
    .use(rehypeStringify);
  const r3 = p3.processSync(content);
  console.log('OK:', String(r3).substring(0, 100));
} catch(e) { console.log('FAIL:', e.message); }
