import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// Simplest possible rehype plugin
function simplePlugin() {
  return (tree) => {
    console.log('simplePlugin got tree:', !!tree, 'type:', tree?.type, 'children:', tree?.children?.length);
  };
}

const p = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(simplePlugin)
  .use(rehypeStringify);

console.log('processSync with simple plugin:');
try {
  const r = p.processSync('Hello world');
  console.log('OK:', String(r));
} catch(e) { console.log('FAIL:', e.message); }

// Now try with TWO rehype plugins
function pluginA() {
  return (tree) => {
    console.log('pluginA: tree exists:', !!tree);
  };
}
function pluginB() {
  return (tree) => {
    console.log('pluginB: tree exists:', !!tree);
  };
}

const p2 = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(pluginA)
  .use(pluginB)
  .use(rehypeStringify);

console.log('\nprocessSync with two rehype plugins:');
try {
  const r2 = p2.processSync('Hello world');
  console.log('OK:', String(r2));
} catch(e) { console.log('FAIL:', e.message); }
