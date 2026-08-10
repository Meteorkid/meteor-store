import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

// Test: with rehypeHelpHeadings, dump the HAST before stringify
function rehypeHelpHeadings() {
  const seen = new Map();
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      let text = '';
      for (const c of node.children) {
        if (c.type === 'text') text += c.value;
      }
      if (!text) return;
      const count = seen.get(text) ?? 0;
      const id = count === 0 ? text : `${text}-${count + 1}`;
      seen.set(text, count + 1);
      node.properties = node.properties ?? {};
      node.properties.id = id;
      console.log('Set id for', text, '→', id);
    });
  };
}

function dumpTree(tree, depth) {
  const indent = '  '.repeat(depth);
  console.log(indent + 'type:', tree.type, 'tag:', tree.tagName || '-', 'props:', JSON.stringify(tree.properties));
  if (tree.children) for (const c of tree.children) dumpTree(c, depth + 1);
}

const helpSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
  },
};

// Step by step
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
const mdast = processor.parse('## Hello\n\nWorld');

console.log('=== MD AST ===');
console.log(JSON.stringify(mdast, null, 2).substring(0, 500));

const hast1 = await processor.run(mdast);
console.log('\n=== HASt after remarkRehype ===');
dumpTree(hast1, 0);

// Apply headings
const h1 = unified().use(rehypeHelpHeadings);
const hast2 = await h1.run(hast1);
console.log('\n=== HASt after rehypeHelpHeadings ===');
dumpTree(hast2, 0);
