// Directly test the approach used in markdown.ts vs help-markdown.ts
// Key difference: markdown.ts creates processor ONCE, help-markdown.ts creates per-call
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

// Pattern A: shared processor (like markdown.ts)
const sharedProcessor = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
  .use(rehypeSanitize, helpSchema)
  .use(() => (tree) => { visit(tree, 'element', (n) => { if (n.tagName === 'img') {} }); })
  .use(rehypeStringify);

console.log('Pattern A (shared processor):');
try {
  console.log('  Test 1:', String(sharedProcessor.processSync('Hello')).substring(0, 50));
  console.log('  Test 2:', String(sharedProcessor.processSync('## Title')).substring(0, 50));
  console.log('  Test 3:', String(sharedProcessor.processSync('<script>x</script>')).substring(0, 50));
  console.log('  All OK');
} catch(e) { console.log('  FAIL:', e.message); }

// Pattern B: new processor per call (like help-markdown.ts)
console.log('\nPattern B (new per call):');
try {
  const p = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeSanitize, helpSchema)
    .use(() => (tree) => { visit(tree, 'element', (n) => { if (n.tagName === 'img') {} }); })
    .use(rehypeStringify);
  console.log('  Test 1:', String(p.processSync('Hello')).substring(0, 50));
} catch(e) { console.log('  FAIL:', e.message); }
