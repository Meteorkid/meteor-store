import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

function spyPlugin(name) {
  return (tree) => {
    console.log(name + ':');
    console.log('  typeof tree:', typeof tree);
    console.log('  tree === undefined:', tree === undefined);
    console.log('  tree === null:', tree === null);
    console.log('  String(tree):', String(tree));
    if (tree) {
      console.log('  tree.type:', tree.type);
      console.log('  tree.children.length:', tree.children.length);
    }
  };
}

const content = 'Hello world';

const p = unified()
  .use(remarkParse).use(remarkGfm).use(remarkRehype)
  .use(spyPlugin('test'))
  .use(rehypeStringify);

console.log('Full debug:');
try {
  const r = p.processSync(content);
  console.log('Result:', String(r));
} catch(e) { console.log('FAIL:', e.message); }
