import { describe, expect, it } from 'vitest';
import {
  extractHeadings,
  renderHelpMarkdown,
} from '../help-markdown';

describe('renderHelpMarkdown', () => {
  it('为 h2/h3 生成 id 并提取目录', async () => {
    const { headings } = await renderHelpMarkdown({
      content: '## 注册账户\n\n内容\n\n### 下一步\n\n内容\n\n## 常见问题',
      slug: 'test',
    });

    expect(headings).toHaveLength(3);
    expect(headings[0].id).toBe('注册账户');
    expect(headings[0].level).toBe(2);
    expect(headings[1].id).toBe('下一步');
    expect(headings[1].level).toBe(3);
    expect(headings[2].id).toBe('常见问题');
  });

  it('同名标题追加后缀', async () => {
    const { headings } = await renderHelpMarkdown({
      content: '## 注册\n\n## 注册',
      slug: 'test',
    });

    expect(headings).toHaveLength(2);
    expect(headings[0].id).toBe('注册');
    expect(headings[1].id).toBe('注册-2');
  });

  it('行内格式不影响标题 id', async () => {
    const { headings } = await renderHelpMarkdown({
      content: '## 如何**注册**账户',
      slug: 'test',
    });

    expect(headings[0].id).toBe('如何注册账户');
  });

  it('空标题回退为 section', async () => {
    const { headings } = await renderHelpMarkdown({
      content: '## ',
      slug: 'test',
    });

    expect(headings).toHaveLength(0);
  });

  it('英文标题生成正确 id', async () => {
    const { headings } = await renderHelpMarkdown({
      content: '## Getting Started\n\n### Create an Account',
      slug: 'test',
    });

    expect(headings[0].id).toBe('Getting-Started');
    expect(headings[1].id).toBe('Create-an-Account');
  });

  it('外链追加视觉标识', async () => {
    const { html } = await renderHelpMarkdown({
      content: '[Apple 支持](https://support.apple.com/zh-cn/102445)',
      slug: 'test',
    });

    expect(html).toContain('href="https://support.apple.com/zh-cn/102445"');
    expect(html).toContain('noopener');
    expect(html).toContain('↗');
  });

  it('站内链接不加外链标识', async () => {
    const { html } = await renderHelpMarkdown({
      content: '[帮助中心](/docs)',
      slug: 'test',
    });

    expect(html).toContain('href="/docs"');
    expect(html).not.toMatch(/\/docs.*↗/);
  });

  it('XSS 攻击向量被清除', async () => {
    const { html } = await renderHelpMarkdown({
      content: '<script>alert(1)</script>\n\n正常段落',
      slug: 'test',
    });

    expect(html).not.toContain('<script');
    expect(html).toContain('正常段落');
  });

  it('危险链接被清除', async () => {
    const { html } = await renderHelpMarkdown({
      content: '[点击](javascript:alert(1))',
      slug: 'test',
    });

    expect(html).not.toContain('javascript');
  });

  it('extractHeadings 从 HTML 提取目录', () => {
    const html = '<h2 id="start">开始</h2><p>text</p><h3 id="step">步骤</h3>';
    const headings = extractHeadings(html);

    expect(headings).toHaveLength(2);
    expect(headings[0].id).toBe('start');
    expect(headings[0].level).toBe(2);
    expect(headings[1].id).toBe('step');
    expect(headings[1].level).toBe(3);
  });
});
