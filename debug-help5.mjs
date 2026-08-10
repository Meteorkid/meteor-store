import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
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
    console.log('  rehypeHelpImages: tree.type=' + tree.type + ' children=' + tree.children.length);
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
    });
    console.log('  rehypeHelpImages: visit OK');
  };
}

const content = '<script>alert(1)</script>\n\n正常段落';

// Use runSync instead of processSync
const p = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize, helpSchema)
  .use(rehypeHelpImages('test'))
  .use(rehypeStringify);

console.log('runSync + stringify:');
try {
  const tree = p.parse(content);
  console.log('  parse OK, type:', tree.type);
  const hast = await p.run(tree);
  console.log('  run OK, type:', hast.type, 'children:', hast.children.length);
  const html = p.stringify(hast);
  console.log('  stringify OK:', html.substring(0, 100));
} catch(e) { console.log('  FAIL:', e.message); }

console.log('\nprocessSync:');
try {
  const p2 = unified()
    .use(remarkParse).use(remarkGfm).use(remarkRehype)
    .use(rehypeSanitize, helpSchema)
    .use(rehypeHelpImages('test'))
    .use(rehypeStringify);
  const result = p2.processSync(content);
  console.log('  OK:', String(result).substring(0, 100));
} catch(e) { console.log('  FAIL:', e.message); }
