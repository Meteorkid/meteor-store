import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  articleSummaryUrl,
  extractArticleSummary,
  extractMarkdownSummary,
} from '../ingestion/article-summary';
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
  it('是按来源选择性开启，不是全局默认', () => {
    /*
     * 这是抓取管线里唯一逐条拉正文的路径，每条一次 HTTP 请求。
     * 全局开启会给每个来源都加上这份开销。
     *
     * 这里**不写死来源清单**：新增一个确实拿不到 description 的来源是正常的，
     * 钉清单只会让合法改动变红。要保证的是它仍然是少数派。
     */
    const sources = [...PATHFINDER_SYNC_SOURCE_MAP.values()];
    const enabled = sources.filter((s) => s.articleSummary);
    expect(enabled.length).toBeGreaterThan(0);
    expect(enabled.length).toBeLessThan(sources.length / 2);
  });

  it('每个开启的来源都要声明抓取主机', () => {
    // 没有 fetchHost 就没法做白名单校验，等于允许抓任意地址
    for (const source of [...PATHFINDER_SYNC_SOURCE_MAP.values()].filter((s) => s.articleSummary)) {
      expect(source.articleSummary!.fetchHost, source.id).toBeTruthy();
    }
  });

  it('走镜像的来源，抓取主机与条目链接域名必须分开', () => {
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

/** AGI Hunt 日报 .md 的真实结构：一行出处、一级标题、章节标题、综述段、重点列表。 */
const daily = (paragraph: string) => `> 出处:AGI HUNT · https://agihunt.info · AI 资讯日报 2026-09-04

# AI 资讯日报 · 2026-09-04

## 今日总结

${paragraph}

- **OpenAI 正式发布 GPT-6 Astra** — 官方称其为目前最智能的旗舰。

## 与昨日对比
`;

describe('Markdown 正文取段', () => {
  const summary = '过去一天，讨论从 Astra 会不会发转到 GPT-6 Astra 已正式上线，'
    + '并叠上 Nvidia 以 129 亿美元收购 Hugging Face、多家消费级助手被报告同步宕机。';

  it('取指定标题下的第一段', () => {
    expect(extractMarkdownSummary(daily(summary), '## 今日总结')).toBe(summary);
  });

  it('跳过出处引用、标题与重点列表', () => {
    /*
     * 文件开头那行 `> 出处:…` 和随后的一级标题逐日不变，重点列表是
     * `- **X** — …` 的条目格式；三者都不是当天的综述。
     */
    const out = extractMarkdownSummary(daily(summary), '## 今日总结');
    expect(out).not.toContain('出处');
    expect(out.startsWith('-')).toBe(false);
    expect(out.startsWith('#')).toBe(false);
  });

  it('找不到标题时返回空，不退化成取第一段', () => {
    // 站点改了章节名就该显式失败，而不是把出处行当成综述发出去
    expect(extractMarkdownSummary(daily(summary), '## 不存在的章节')).toBe('');
  });

  it('过长的截断并加省略号', () => {
    const out = extractMarkdownSummary(daily('长'.repeat(500)), '## 今日总结');
    expect(out.length).toBe(320);
    expect(out.endsWith('…')).toBe(true);
  });

  it('太短的段落不算综述', () => {
    expect(extractMarkdownSummary(daily('太短。'), '## 今日总结')).toBe('');
  });
});

describe('抓取地址', () => {
  it('Markdown 模式在条目链接后面补后缀', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('agihunt-daily')!;
    expect(articleSummaryUrl(source, 'https://agihunt.info/daily/2026-09-04'))
      .toBe('https://agihunt.info/daily/2026-09-04.md');
  });

  it('镜像来源换回抓取主机', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('hugging-face-blog')!;
    expect(articleSummaryUrl(source, 'https://huggingface.co/blog/x'))
      .toBe('https://hf-mirror.com/blog/x');
  });

  it('未开启的来源没有抓取地址', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('openai-news')!;
    expect(articleSummaryUrl(source, 'https://openai.com/index/x/')).toBeNull();
  });
});

describe('要拉正文的来源都得限量', () => {
  it('凡开了 articleSummary 的来源都必须设 maxItemsPerSync', () => {
    /*
     * 正文补全跑在入库之前，整批同步共用 route 的 60 秒预算——超时就整条来源
     * 回滚，于是每小时重试、每次都超时，那条来源**永远进不来**。
     *
     * 这条断言原本只管 `replacesFeedSummary` 的来源，理由是「只有它们每条都拉」。
     * 那个理由是错的：`hugging-face-blog` 走的是「只填空缺」分支，而它的 feed
     * 一条 description 都不给，于是每一条都是空缺——**行为完全等同全量重取，
     * 却漏在了断言外面**，默认 30 条 × 约 1.5 秒 = 45 秒，只差一点就翻车。
     *
     * 所以判据改成「会不会拉正文」而不是「用哪个标志」。上限按各来源实测
     * 耗时分别定（见 sources.ts 的注释），这里只要求「设了，且不离谱」。
     */
    for (const source of [...PATHFINDER_SYNC_SOURCE_MAP.values()]) {
      if (!source.articleSummary) continue;
      expect(source.maxItemsPerSync, source.id).toBeDefined();
      expect(source.maxItemsPerSync!, source.id).toBeLessThanOrEqual(12);
    }
  });

  it('全量覆盖的来源要更紧', () => {
    // 这类来源连有摘要的条目也重取，同样条数下耗时是「只填空缺」的上界
    for (const source of [...PATHFINDER_SYNC_SOURCE_MAP.values()]) {
      if (!source.articleSummary?.replacesFeedSummary) continue;
      expect(source.maxItemsPerSync!, source.id).toBeLessThanOrEqual(5);
    }
  });
});

describe('Google DeepMind 正文抽取', () => {
  /*
   * 按 2026-09-06 抓下来的真实页面结构写：正文在 `uni-blog-article-container`
   * 里，页面顶部还有一段「Skip to main content + 标题」的 chrome。
   * 上游改版时这条会红——抽取失败本身是静默的（拿不到就保持原样），
   * 没有测试的话只会表现为「新条目又开始没有摘要了」，很难联想到是改版。
   */
  const deepmindPage = (body: string) => `<html><body>
    <div class="uni-article-paragraph"><p>Skip to main content Proactive cyber defense for governments and enterprises</p></div>
    <div class="uni-content uni-blog-article-container article-container__content">
      ${body}
    </div></body></html>`;

  it('取到正文首段而不是页面 chrome', () => {
    const html = deepmindPage(
      '<p>Defenders wanting to use advanced AI have faced a difficult dilemma: adopt enormous frontier models that could be expensive to deploy and difficult to control.</p>',
    );
    expect(extractArticleSummary(html, 'uni-blog-article-container'))
      .toMatch(/^Defenders wanting to use advanced AI/);
  });

  it('配置里的 containerMarker 与页面结构一致', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('google-deepmind-blog')!;
    expect(source.articleSummary).toBeDefined();
    expect(source.articleSummary!.mode).toBe('html');
    const marker = (source.articleSummary as { containerMarker: string }).containerMarker;
    expect(extractArticleSummary(deepmindPage('<p>' + 'x'.repeat(100) + '</p>'), marker).length)
      .toBeGreaterThan(0);
  });

  it('只填空缺，不覆盖 feed 已给的摘要', () => {
    // 37 条里 19 条 feed 是给了摘要的，覆盖掉没有好处
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('google-deepmind-blog')!;
    expect(source.articleSummary!.replacesFeedSummary).toBeUndefined();
  });
});
