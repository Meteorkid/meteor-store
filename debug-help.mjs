import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
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
    try {
      visit(tree, 'element', (node) => {
        if (node.tagName !== 'img') return;
      });
    } catch(e) {
      console.log('visit inside images failed:', e.message);
      throw e;
    }
  };
}

const content = '<script>alert(1)</script>\n\n正常段落';

console.log('Test 1: sanitize+images');
try {
  const p = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeSanitize, helpSchema).use(rehypeHelpImages('test'));
  p.processSync(content);
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }

console.log('Test 2: extLinks+sanitize+images');
try {
  const p2 = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
    .use(rehypeSanitize, helpSchema).use(rehypeHelpImages('test'));
  p2.processSync(content);
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }
