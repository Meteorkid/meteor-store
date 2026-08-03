import { describe, it, expect } from 'vitest';
import { sanitizeUserInput } from '../sanitize';

describe('sanitizeUserInput', () => {
  it('剥离字面 HTML 标签', () => {
    expect(sanitizeUserInput('<script>alert(1)</script>hello')).toBe('alert(1)hello');
  });

  it('剥离成对标签,保留标签内文本', () => {
    expect(sanitizeUserInput('<b>标题</b>')).toBe('标题');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeUserInput('  hello world  ')).toBe('hello world');
  });

  it('不把 HTML 实体编码还原成真标签', () => {
    // 回归测试:旧实现会把这段实体编码文本反转义成真正的 <script> 标签
    const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
    const result = sanitizeUserInput(input);
    expect(result).not.toContain('<script>');
    expect(result).toBe(input);
  });

  it('整条都是标签时清空,供路由拦截', () => {
    expect(sanitizeUserInput('<div></div>')).toBe('');
  });

  it('leaves plain text untouched', () => {
    expect(sanitizeUserInput('这是一段正常的反馈内容')).toBe('这是一段正常的反馈内容');
  });

  it('保留普通标点与中文', () => {
    expect(sanitizeUserInput('你好,世界!这是测试。')).toBe('你好,世界!这是测试。');
  });

  it('保留 HTML 实体编码的纯文本(不还原)', () => {
    // 用户字面输入的 &lt; 不应该被还原成 <
    expect(sanitizeUserInput('a &lt; b &amp;&amp; c &gt; d')).toBe('a &lt; b &amp;&amp; c &gt; d');
  });
});
