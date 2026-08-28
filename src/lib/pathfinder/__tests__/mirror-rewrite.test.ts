import { describe, expect, it } from 'vitest';
import { cleanFeedSummary, rewriteHost, rewriteText } from '../ingestion/normalize';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion';

describe('镜像来源的回写', () => {
  it('只改主机名，路径原样保留', () => {
    expect(rewriteHost('https://hf-mirror.com/blog/train-multi-vector-encoder',
      { from: 'hf-mirror.com', to: 'huggingface.co' }))
      .toBe('https://huggingface.co/blog/train-multi-vector-encoder');
  });

  it('主机名必须精确相等才改', () => {
    // 后缀匹配会让 evil-hf-mirror.com 被当成 hf-mirror.com
    expect(rewriteHost('https://evil-hf-mirror.com/blog/x',
      { from: 'hf-mirror.com', to: 'huggingface.co' }))
      .toBe('https://evil-hf-mirror.com/blog/x');
  });

  it('没有规则或地址非法时原样返回', () => {
    expect(rewriteHost('https://a.com/x', undefined)).toBe('https://a.com/x');
    expect(rewriteHost('不是地址', { from: 'a', to: 'b' })).toBe('不是地址');
    expect(rewriteHost(null, { from: 'a', to: 'b' })).toBeNull();
  });

  it('把镜像替换掉的品牌名改回来', () => {
    /*
     * 镜像站不只改域名，还会把正文里的原站名换成自己的。实测抓到的 30 条里
     * 有 3 条标题写着「HF Mirror Inference Endpoints」，原文是「Hugging Face …」。
     * 链接已经改回官方了，正文再不改，就成了以「官方来源」的名义发布
     * 被篡改过的文本。
     */
    expect(rewriteText('How HF Mirror Inference Endpoints power search',
      [{ from: 'HF Mirror', to: 'Hugging Face' }]))
      .toBe('How Hugging Face Inference Endpoints power search');
  });

  it('没有规则时不动文本', () => {
    expect(rewriteText('原样', undefined)).toBe('原样');
    expect(rewriteText('', [{ from: 'a', to: 'b' }])).toBe('');
  });

  it('抓镜像的来源必须同时声明两条回写规则', () => {
    // 只改链接不改正文，或反过来，都会留下一半被篡改的内容
    for (const source of PATHFINDER_SYNC_SOURCE_MAP.values()) {
      if (!source.rewriteItemHost) continue;
      expect(source.rewriteItemText, `${source.id} 声明了链接回写却没有文本回写`)
        .toBeDefined();
      // 条目白名单必须写官方域名——回写发生在校验之前
      expect(source.allowedItemHosts).toContain(source.rewriteItemHost.to);
    }
  });
});

describe('feed 摘要的链接行', () => {
  it('去掉文章开头那一排跳转链接', () => {
    /*
     * 不少官方博客在正文最前面放一排链接。RSS 的 description 原样带进来，
     * 去掉 HTML 之后就是一串裸词——实测 Qwen 的 30 条摘要无一例外都以
     * 「Tech Report GitHub Hugging Face ModelScope DISCORD」开头。
     */
    expect(cleanFeedSummary(
      'Tech Report GitHub Hugging Face ModelScope DISCORD\nIntroduction We are excited to introduce Qwen3Guard.',
      200,
    )).toMatch(/^Introduction/);

    // 全大写短行几乎必然是链接行，这条也覆盖了标签表里没有的产品名
    expect(cleanFeedSummary(
      'QWEN CHAT GITHUB HUGGING FACE MODELSCOPE DISCORD\nWe are excited to introduce Qwen-Image-Edit.',
      200,
    )).toMatch(/^We are/);

    expect(cleanFeedSummary('论文 DISCORD\n介绍 强化学习（RL）已成为关键范式。', 200))
      .toMatch(/^介绍/);
  });

  it('不误删正文首句', () => {
    // 摘要的第一句往往是最重要的一句，判据必须保守
    for (const [text, start] of [
      ['Skala 1.1 is an updated functional from Microsoft Research.\nIt offers higher accuracy.', 'Skala'],
      ['A path, a fence, a knot.\nMindTopo sets a new benchmark.', 'A path'],
      ['大模型的推理成本一直是部署瓶颈。\n本文介绍一种新方法。', '大模型'],
      ['没有换行的单行摘要，不该动它', '没有换行'],
    ] as const) {
      expect(cleanFeedSummary(text, 200), text.slice(0, 20)).toMatch(new RegExp(`^${start}`));
    }
  });
});
