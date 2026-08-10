import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
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

const content = '<script>alert(1)</script>\n\n正常段落';

const tree1 = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).parse(content);

// Try visiting the raw tree (before sanitize)
console.log('visit on raw tree:');
try {
  visit(tree1, 'element', () => {});
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }

const tree2 = await unified().use(rehypeSanitize, helpSchema).run(tree1);

console.log('visit on sanitized tree:');
try {
  visit(tree2, 'element', () => {});
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }

// Let's also check what node type the sanitizer might leave behind
console.log('\nDeep inspect of sanitized tree:');
console.log(JSON.stringify(tree2, null, 2).substring(0, 500));
