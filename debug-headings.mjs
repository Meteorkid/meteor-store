import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// Just remarkParse + remarkRehype, no heading plugin
const p = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

console.log('Just remarkRehype:');
console.log(String(p.processSync('## Hello')));
console.log();

// With allowDangerousHtml: false (default)
// Check what raw HTML does
console.log('With raw HTML:');
console.log(String(p.processSync('## Hello\n\n<script>x</script>')));
