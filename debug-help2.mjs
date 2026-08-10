import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const content = '<script>alert(1)</script>\n\n正常段落';

const tree1 = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).parse(content);
console.log('Before sanitize:');
console.log('  type:', tree1.type);
console.log('  children:', tree1.children.length);
for (let i = 0; i < tree1.children.length; i++) {
  const c = tree1.children[i];
  console.log(`  [${i}] type=${c?.type}, value=${c?.value?.substring(0,30)}, tagName=${c?.tagName}`);
  if (c?.children) {
    for (let j = 0; j < c.children.length; j++) {
      console.log(`    child[${j}] type=${c.children[j]?.type}`);
    }
  }
}

const tree2 = await unified().use(rehypeSanitize).run(tree1);
console.log('\nAfter sanitize:');
console.log('  type:', tree2.type);
console.log('  children:', tree2.children.length);
for (let i = 0; i < tree2.children.length; i++) {
  const c = tree2.children[i];
  console.log(`  [${i}] type=${c?.type}, value=${c?.value?.substring(0,30) || 'n/a'}`);
}
