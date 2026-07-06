import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../route';

describe('sanitizeInput', () => {
  it('strips literal HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>hello')).toBe('alert(1)hello');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('does not resurrect HTML-entity-encoded tags into real tags', () => {
    // 回归测试：旧实现会把这段实体编码文本反转义成真正的 <script> 标签
    const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<script>');
    expect(result).toBe(input);
  });

  it('leaves plain text untouched', () => {
    expect(sanitizeInput('这是一段正常的反馈内容')).toBe('这是一段正常的反馈内容');
  });
});
