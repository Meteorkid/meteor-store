import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';

function spyPlugin(name) {
  return (tree) => {
    console.log(name + ' got tree:', !!tree);
  };
}

const content = 'Hello world';

// Test: rehypeExternalLinks + another plugin
const p = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'], protocols: ['http', 'https'] })
  .use(spyPlugin('afterExtLinks'))
  .use(rehypeStringify);

console.log('With rehypeExternalLinks:');
try {
  p.processSync(content);
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }

// Test: without rehypeExternalLinks
const p2 = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(spyPlugin('noExtLinks'))
  .use(rehypeStringify);

console.log('\nWithout rehypeExternalLinks:');
try {
  p2.processSync(content);
  console.log('  OK');
} catch(e) { console.log('  FAIL:', e.message); }
