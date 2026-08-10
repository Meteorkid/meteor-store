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
};

function spyBeforeSanitize() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        console.log('BEFORE sanitize:', node.tagName, 'props:', JSON.stringify(node.properties));
      }
    });
  };
}

function spyAfterSanitize() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        console.log('AFTER sanitize:', node.tagName, 'props:', JSON.stringify(node.properties));
      }
    });
  };
}

function rehypeHelpHeadings() {
  const seen = new Map();
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      let text = '';
      for (const c of node.children) {
        if (c.type === 'text') text += c.value;
        else if (c.type === 'element') {
          for (const cc of c.children) if (cc.type === 'text') text += cc.value;
        }
      }
      if (!text) return;
      const count = seen.get(text) ?? 0;
      const id = count === 0 ? text : `${text}-${count + 1}`;
      seen.set(text, count + 1);
      node.properties = node.properties ?? {};
      node.properties.id = id;
    });
  };
}

// Test: headings → spy → sanitize → spy
const p = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'], protocols: ['http', 'https'] })
  .use(rehypeHelpHeadings)
  .use(spyBeforeSanitize)
  .use(rehypeSanitize, helpSchema)
  .use(spyAfterSanitize)
  .use(rehypeStringify);

console.log('\nHTML output:');
console.log(String(p.processSync('## 注册账户\n\n内容\n\n### 下一步')));
