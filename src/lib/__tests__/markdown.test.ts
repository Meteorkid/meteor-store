import { describe, it, expect } from 'vitest';
import { markdownToHtml } from '../markdown';

describe('markdownToHtml', () => {
  describe('基础语法', () => {
    it('渲染标题、段落与加粗', () => {
      const html = markdownToHtml('## 标题\n\n这是**重点**。');
      expect(html).toContain('<h2>标题</h2>');
      expect(html).toContain('<strong>重点</strong>');
    });

    it('渲染引用块', () => {
      expect(markdownToHtml('> 第一行\n> 第二行')).toContain('<blockquote>');
    });

    it('渲染分割线与列表', () => {
      expect(markdownToHtml('---')).toContain('<hr>');
      expect(markdownToHtml('- a\n- b')).toContain('<ul>');
      expect(markdownToHtml('1. a\n2. b')).toContain('<ol>');
    });

    it('代码块保留语言标记，内容被转义', () => {
      const html = markdownToHtml('```html\n<div>&</div>\n```');
      expect(html).toContain('class="language-html"');
      expect(html).not.toContain('<div>&</div>');
      expect(html).toContain('#x3C;div'); // < 已转义
    });
  });

  describe('GFM 扩展（旧的手写解析器不支持）', () => {
    it('表格', () => {
      const html = markdownToHtml('| A | B |\n|---|---|\n| 1 | 2 |');
      expect(html).toContain('<th>A</th>');
      expect(html).toContain('<td>1</td>');
    });

    it('删除线', () => {
      expect(markdownToHtml('~~删掉~~')).toContain('<del>删掉</del>');
    });

    it('任务列表', () => {
      const html = markdownToHtml('- [x] 做完了\n- [ ] 没做');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
    });
  });

  describe('链接与图片', () => {
    it('外链带 target 与 noopener', () => {
      const html = markdownToHtml('[站外](https://example.com)');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('站内链接不加 target，避免站内跳转开新窗口', () => {
      const html = markdownToHtml('[站内](/products)');
      expect(html).toContain('href="/products"');
      expect(html).not.toContain('target=');
    });

    it('图片正常渲染', () => {
      const html = markdownToHtml('![图](https://example.com/a.png)');
      expect(html).toContain('src="https://example.com/a.png"');
      expect(html).toContain('alt="图"');
    });
  });

  /**
   * 这一组是安全回归网。正文将来可能来自不受信任的来源（话题提议被采用后改写、
   * 约稿等），所以每一条都要保证净化后不残留可执行内容。
   */
  describe('XSS 防护', () => {
    const attacks: [string, string][] = [
      ['原生 script 标签', '<script>alert(1)</script>'],
      ['onerror 属性注入', '<img src=x onerror=alert(1)>'],
      ['iframe', '<iframe src="https://evil.com"></iframe>'],
      ['svg onload', '<svg onload="alert(1)"></svg>'],
      ['style 里的 javascript:', '<div style="background:url(javascript:alert(1))">x</div>'],
      ['链接用 javascript: 协议', '[点我](javascript:alert(1))'],
      ['大小写混淆的 javascript:', '[点我](JaVaScRiPt:alert(1))'],
      ['链接用 data: 协议', '[点我](data:text/html,<script>alert(1)</script>)'],
      ['链接用 vbscript: 协议', '[点我](vbscript:msgbox(1))'],
      ['图片用 javascript: 协议', '![图](javascript:alert(1))'],
    ];

    it.each(attacks)('净化：%s', (_name, md) => {
      const html = markdownToHtml(md);
      expect(html).not.toMatch(/<script|<iframe|<svg/i);
      // 不能出现未转义的事件处理器属性
      expect(html).not.toMatch(/\son\w+\s*=\s*["']?[^"'&]/i);
      // 危险协议不能出现在 href/src 里
      expect(html).not.toMatch(/(href|src)\s*=\s*["']?\s*(javascript|data|vbscript):/i);
    });

    it('危险协议的链接保留文字但去掉 href，读者看得到内容点不动', () => {
      expect(markdownToHtml('[点我](javascript:alert(1))')).toContain('点我');
    });

    it('正文里的原生 HTML 被丢弃，不影响同文档的其余内容', () => {
      const html = markdownToHtml('<script>alert(1)</script>\n\n正常段落');
      expect(html).toContain('正常段落');
      expect(html).not.toContain('alert(1)');
    });

    it('属性里的引号被转义，无法逃逸出属性造成注入', () => {
      const html = markdownToHtml('![x](https://e.com/a.png "title\\" onerror=\\"alert(1)")');
      // onerror 只作为 title 的字面内容存在，引号已实体化
      expect(html).toContain('&#x22;');
      expect(html).not.toMatch(/"\s+onerror="/);
    });
  });

  it('空输入返回空字符串，不抛错', () => {
    expect(markdownToHtml('')).toBe('');
  });
});
