import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';

// WITH the helpSchema including figure/figcaption
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
const tree2 = await unified().use(rehypeSanitize, helpSchema).run(tree1);

console.log('After sanitize with helpSchema:');
console.log('  type:', tree2.type);
console.log('  children:', tree2.children.length);
console.log('  children:', JSON.stringify(tree2.children.map(c => c?.type)));

// Manually traverse
console.log('\nManual traversal test:');
function safeVisit(node, depth) {
  const indent = '  '.repeat(depth);
  console.log(indent + 'node type:', node?.type, 'tagName:', node?.tagName);
  if (node && node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i];
      if (!c) {
        console.log(indent + `  [${i}] UNDEFINED NODE!`);
      } else {
        safeVisit(c, depth + 1);
      }
    }
  }
}
safeVisit(tree2, 0);
