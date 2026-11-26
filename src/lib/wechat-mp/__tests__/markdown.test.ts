import { describe, expect, it } from 'vitest';
import { imagePlaceholder } from '../config';
import { renderWechatMarkdown } from '../markdown';

const SITE = 'https://example.com';

describe('renderWechatMarkdown', () => {
  it('所有排版都写成行内 style，不残留 class', () => {
    const { html } = renderWechatMarkdown('# 标题\n\n正文 **加粗** 和 *斜体*', SITE);
    expect(html).toContain('<h1 style=');
    expect(html).toContain('<strong style=');
    expect(html).toContain('加粗');
    expect(html).not.toContain('class=');
    expect(html.startsWith('<section style=')).toBe(true);
  });

  it('图片换成占位符，重复地址只记一次，相对路径转绝对', () => {
    const markdown = '![a](https://cdn.example.com/a.png)\n\n![b](/images/b.png)\n\n![a2](https://cdn.example.com/a.png)';
    const { html, imageSources } = renderWechatMarkdown(markdown, SITE);
    expect(imageSources).toEqual([
      'https://cdn.example.com/a.png',
      'https://example.com/images/b.png',
    ]);
    expect(html).toContain(imagePlaceholder(0));
    expect(html).toContain(imagePlaceholder(1));
    expect(html).not.toContain('cdn.example.com');
    expect(html).not.toContain('srcset=');
  });

  it('危险协议链接被删掉，站内链接补成绝对地址', () => {
    const html = renderWechatMarkdown('[危险](javascript:alert(1)) [站内](/blog/p/abc)', SITE).html;
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="https://example.com/blog/p/abc"');
  });

  it('代码块保留换行并带 pre-wrap 样式', () => {
    const html = renderWechatMarkdown('```ts\nconst a = 1;\nconst b = 2;\n```', SITE).html;
    expect(html).toContain('<pre style=');
    expect(html).toContain('white-space:pre-wrap');
    expect(html).toContain('const a = 1;');
  });

  it('纯文本可用于兜底生成摘要', () => {
    const { plainText } = renderWechatMarkdown('# 标题\n\n第一段 **内容**。\n\n- 列表项', SITE);
    expect(plainText).toContain('第一段');
    expect(plainText).toContain('列表项');
    expect(plainText).not.toContain('**');
  });
});
