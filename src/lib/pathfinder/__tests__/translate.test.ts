import { describe, expect, it } from 'vitest';
import { needsTranslation, parseTranslationResponse } from '../translate';

describe('该不该翻', () => {
  it('英文要翻，中文不翻', () => {
    expect(needsTranslation('Introducing a new model')).toBe(true);
    // 来源偶尔本来就给中文，重复翻译既费钱又可能把已经通顺的原文改坏
    expect(needsTranslation('发布新模型')).toBe(false);
    expect(needsTranslation('OpenAI 发布新模型')).toBe(false);
  });

  it('空值不翻', () => {
    expect(needsTranslation('')).toBe(false);
    expect(needsTranslation(null)).toBe(false);
    expect(needsTranslation('   ')).toBe(false);
  });
});

describe('解析模型返回', () => {
  it('取出译文并按上限截断', () => {
    const parsed = parseTranslationResponse(JSON.stringify({
      items: [{ id: 'a', title: '  标题  ', summary: '摘要' }],
    }));
    expect(parsed).toEqual([{ id: 'a', titleZh: '标题', summaryZh: '摘要' }]);

    const long = parseTranslationResponse(JSON.stringify({
      items: [{ id: 'a', title: '标'.repeat(300), summary: '要'.repeat(500) }],
    }));
    expect(long[0].titleZh.length).toBe(180);
    expect(long[0].summaryZh.length).toBe(320);
  });

  it('结构不对时返回空数组，由调用方降级为英文', () => {
    // 翻译不了是「不好看」，抓取整批失败是「机会库空了」，不能让前者引发后者
    expect(parseTranslationResponse('不是 json')).toEqual([]);
    expect(parseTranslationResponse('')).toEqual([]);
    expect(parseTranslationResponse(null)).toEqual([]);
    expect(parseTranslationResponse(JSON.stringify({ items: [{ id: 'a' }] }))).toEqual([]);
    expect(parseTranslationResponse(JSON.stringify({ wrong: [] }))).toEqual([]);
  });
});
