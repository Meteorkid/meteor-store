import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { extractArticleSummary } from '../ingestion/article-summary';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion';

const page = (body: string) => `<html><body>
  <div class="blog-content copiable-code-container [&_h1]:mr-0! prose">
    ${body}
  </div></body></html>`;

describe('正文首段提取', () => {
  it('跳过页面 chrome，取真正的首段', () => {
    /*
     * 正文容器的第一个 <p> 往往把面包屑、标题、发布时间裹在一起——实测
     * Hugging Face 是一个 1339 字的大块，以「Back to Articles」开头，
     * 真正的首段在它后面。按特征词跳过，而不是「取第二段」：
     * 不同文章的头部块数不一定相同。
     */
    const html = page(`
      <p>Back to Articles Some Title Published August 25, 2026 Upvote 12</p>
      <p>Finetuning multi-vector models involves several components: the model itself, datasets, and loss functions.</p>
    `);
    expect(extractArticleSummary(html, 'blog-content'))
      .toMatch(/^Finetuning multi-vector models/);
  });

  it('太短的段落不算正文', () => {
    expect(extractArticleSummary(page('<p>Short.</p>'), 'blog-content')).toBe('');
  });

  it('过长的截断并加省略号', () => {
    const long = 'A'.repeat(500);
    const out = extractArticleSummary(page(`<p>${long}</p>`), 'blog-content');
    expect(out.length).toBe(320);
    expect(out.endsWith('…')).toBe(true);
  });

  it('解码实体并压平空白', () => {
    const html = page(`<p>Tokens &amp; embeddings   are\n\ncompared with &quot;cosine&quot; similarity in this study of models.</p>`);
    expect(extractArticleSummary(html, 'blog-content'))
      .toBe('Tokens & embeddings are compared with "cosine" similarity in this study of models.');
  });

  it('找不到容器时返回空，不猜', () => {
    expect(extractArticleSummary('<html><p>正文很长很长很长很长很长很长很长很长很长很长很长很长</p></html>', 'blog-content'))
      .toBe('');
  });
});

describe('接线', () => {
  it('只有确实拿不到 description 的来源才开启', () => {
    /*
     * 这是抓取管线里唯一逐条拉文章页的路径，每条一次 HTTP 请求。
     * 全局开启会给每个来源都加上这份开销。
     */
    const enabled = [...PATHFINDER_SYNC_SOURCE_MAP.values()].filter((s) => s.articleSummary);
    expect(enabled.map((s) => s.id)).toEqual(['hugging-face-blog']);
  });

  it('抓取用的主机与条目链接的域名分开配置', () => {
    // 条目链接被 rewriteItemHost 改写成官方域名，而实际能抓到的是镜像
    const hf = PATHFINDER_SYNC_SOURCE_MAP.get('hugging-face-blog')!;
    expect(hf.articleSummary!.fetchHost).toBe('hf-mirror.com');
    expect(hf.rewriteItemHost!.to).toBe('huggingface.co');
    expect(hf.articleSummary!.fetchHost).not.toBe(hf.rewriteItemHost!.to);
  });

  it('补正文首段必须排在翻译之前', () => {
    // 反过来的话，补上的正文永远是英文——翻译已经跑完了
    const sync = readFileSync(path.join(__dirname, '..', 'ingestion', 'sync.ts'), 'utf-8');
    const article = sync.indexOf('await applyArticleSummaries(source, needsEnrichment)');
    const chinese = sync.indexOf('await applyChineseText(needsEnrichment)');
    expect(article).toBeGreaterThan(0);
    expect(article).toBeLessThan(chinese);
  });
});
