import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

// Check if remark-rehype adds data.hProperties
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
const mdast = processor.parse('## Hello\n\nWorld');
const hast = await processor.run(mdast);

// Dump the h2 node
for (const c of hast.children) {
  if (c.type === 'element' && c.tagName === 'h2') {
    console.log('h2 node:');
    console.log('  properties:', JSON.stringify(c.properties));
    console.log('  data:', JSON.stringify(c.data));
    // Check ALL keys
    console.log('  all own keys:', Object.keys(c));
    console.log('  all keys (incl proto):', Object.getOwnPropertyNames(c));
  }
}
