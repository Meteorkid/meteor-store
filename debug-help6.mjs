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

function rehypeHelpImages(slug) {
  return (tree) => {
    console.log('  images: tree.type=' + tree?.type + ' children=' + tree?.children?.length);
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
    });
    console.log('  images: visit OK');
  };
}

const content = '<script>alert(1)</script>\n\n正常段落';

// Step by step
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
const mdast = processor.parse(content);
console.log('1. parse OK, type:', mdast.type);

const hast = await processor.run(mdast);
console.log('2. run OK (remarkRehype only), type:', hast.type, 'children:', hast.children.length);

// Now apply sanitize
const sanitizer = unified().use(rehypeSanitize, helpSchema);
const clean = await sanitizer.run(hast);
console.log('3. sanitize OK, type:', clean.type, 'children:', clean.children.length);

// Now apply images
const imgProcessor = unified().use(rehypeHelpImages('test'));
const final = await imgProcessor.run(clean);
console.log('4. images OK');
