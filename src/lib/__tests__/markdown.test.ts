import { describe, it, expect } from 'vitest';
import { markdownToHtml } from '../markdown';

describe('markdownToHtml', () => {
  it('渲染标题、段落与加粗', () => {
    const html = markdownToHtml('## 标题\n\n这是**重点**。');
    expect(html).toContain('<h2>标题</h2>');
    expect(html).toContain('<strong>重点</strong>');
  });

  it('渲染引用块，连续行合并为一段', () => {
    const html = markdownToHtml('> 第一行\n> 第二行');
    expect(html).toBe('<blockquote><p>第一行</p><p>第二行</p></blockquote>');
  });

  it('渲染分割线与列表', () => {
    expect(markdownToHtml('---')).toBe('<hr />');
    expect(markdownToHtml('- a\n- b')).toBe('<ul><li>a</li><li>b</li></ul>');
    expect(markdownToHtml('1. a\n2. b')).toBe('<ol><li>a</li><li>b</li></ol>');
  });

  it('外链带 noopener，站内链接不带 target', () => {
    expect(markdownToHtml('[站外](https://example.com)')).toContain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">站外</a>',
    );
    expect(markdownToHtml('[站内](/products)')).toBe('<p><a href="/products">站内</a></p>');
  });

  it('转义正文里的 HTML，不产生可执行标签', () => {
    const html = markdownToHtml('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('拒绝 javascript: 协议的链接，降级为纯文本', () => {
    const html = markdownToHtml('[点我](javascript:alert(1))');
    expect(html).not.toContain('href');
    expect(html).toContain('javascript:alert(1)');
  });

  it('图片同样走 URL 白名单', () => {
    expect(markdownToHtml('![图](https://example.com/a.png)')).toContain(
      '<img src="https://example.com/a.png" alt="图" loading="lazy" />',
    );
    expect(markdownToHtml('![图](javascript:alert(1))')).not.toContain('<img');
  });

  it('代码块内容被转义且保留语言标记', () => {
    const html = markdownToHtml('```html\n<div>&</div>\n```');
    expect(html).toContain('class="language-html"');
    expect(html).toContain('&lt;div&gt;&amp;&lt;/div&gt;');
  });

  it('渲染表格并跳过分隔行', () => {
    const html = markdownToHtml('| A | B |\n|---|---|\n| 1 | 2 |');
    expect(html).toContain('<th>A</th><th>B</th>');
    expect(html).toContain('<td>1</td><td>2</td>');
    expect(html).not.toContain('---');
  });
});
