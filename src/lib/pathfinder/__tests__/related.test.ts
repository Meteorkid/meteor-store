import { describe, expect, it } from 'vitest';
import { findRelatedItems, groupRelatedItems, titleTokens } from '../related';
import { catalogItemFixture } from './fixtures';

const update = (id: string, title: string, publishedAt: string, sourceId = 'openai-news') =>
  catalogItemFixture({
    id,
    itemType: 'ai-update',
    sourceId,
    title: { zh: title, en: title },
    publishedAt,
  });

describe('标题分词', () => {
  it('丢掉通用词，保留承载线索的词', () => {
    expect([...titleTokens('Introducing the new AI model').all]).toEqual([]);
  });

  it('句中大写词与带数字的词算专名，首词不算', () => {
    const tokens = titleTokens('Previewing Ultrafast mode: GPT-5.6 Sol at up to 14X the speed');
    expect(tokens.proper).toContain('ultrafast');
    expect(tokens.proper).toContain('gpt-5.6');
    expect(tokens.proper).toContain('sol');
    // 首词天然大写，不能当作专名证据
    expect(tokens.proper).not.toContain('previewing');
  });

  it('中文按二元组切分，且全部可用于判定', () => {
    const tokens = titleTokens('模型发布');
    expect([...tokens.all]).toEqual(['模型', '型发', '发布']);
    expect(tokens.proper.size).toBe(tokens.all.size);
  });
});

describe('相关条目聚合', () => {
  it('共享专名的同线索条目会聚到一起', () => {
    const groups = groupRelatedItems([
      update('a', 'Testing ads in ChatGPT', '2026-08-11T00:00:00.000Z'),
      update('b', 'ChatGPT Ads expands across Europe', '2026-08-18T00:00:00.000Z'),
      update('c', 'WeatherNext: AI model achieves breakthrough in forecasting cyclones', '2026-08-06T00:00:00.000Z'),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((item) => item.id).sort()).toEqual(['a', 'b']);
  });

  it('只共享通用措辞的条目绝不合并', () => {
    // 线上真实语料里的反例：这两条只共享 putting / hands，内容毫无关系。
    // 错误合并等于把信息说错，比漏掉一组相关内容严重得多。
    const groups = groupRelatedItems([
      update('sign', 'Putting sign language AI into users hands', '2026-08-12T00:00:00.000Z'),
      update('cyber', 'Putting frontier cyber models in more trusted hands', '2026-08-10T00:00:00.000Z'),
    ]);

    expect(groups).toEqual([]);
  });

  it('只共享一个专名不足以判定相关', () => {
    const groups = groupRelatedItems([
      update('x', 'Gemini and Pixel get closer to the game', '2026-08-17T00:00:00.000Z'),
      update('y', 'Gemini Robotics brings whole body intelligence to robots', '2026-07-28T00:00:00.000Z'),
    ]);

    expect(groups).toEqual([]);
  });

  it('超出时间窗的条目不算同一条线索', () => {
    const items = [
      update('old', 'Introducing Gemini 3.5 Flash Cyber', '2026-01-01T00:00:00.000Z'),
      update('new', 'Introducing Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber', '2026-08-13T00:00:00.000Z'),
    ];

    expect(groupRelatedItems(items, { windowDays: 30 })).toEqual([]);
    expect(groupRelatedItems(items, { windowDays: 400 })).toHaveLength(1);
  });

  it('统计一手来源与不同来源机构数', () => {
    const official = update('a', 'Testing ads in ChatGPT', '2026-08-11T00:00:00.000Z', 'openai-news');
    const secondHand = catalogItemFixture({
      id: 'b',
      itemType: 'ai-update',
      sourceId: 'hugging-face-blog',
      title: { zh: 'ChatGPT Ads expands across Europe', en: 'ChatGPT Ads expands across Europe' },
      publishedAt: '2026-08-18T00:00:00.000Z',
      source: { ...official.source, id: 'hugging-face-blog', trustLevel: 'verified' },
    });

    const [group] = groupRelatedItems([official, secondHand]);
    expect(group).toMatchObject({ firstHand: 1, secondHand: 1, sources: 2 });
    // 代表条目是一手来源里最早那条——线索的起点
    expect(group.primary.id).toBe('a');
  });

  it('未发布条目不参与聚合', () => {
    const groups = groupRelatedItems([
      update('a', 'Testing ads in ChatGPT', '2026-08-11T00:00:00.000Z'),
      catalogItemFixture({
        id: 'draft',
        itemType: 'ai-update',
        status: 'pending',
        title: { zh: 'ChatGPT Ads expands across Europe', en: 'ChatGPT Ads expands across Europe' },
        publishedAt: '2026-08-18T00:00:00.000Z',
      }),
    ]);

    expect(groups).toEqual([]);
  });

  it('查某条条目的相关项时不会把自己算进去', () => {
    const a = update('a', 'Testing ads in ChatGPT', '2026-08-11T00:00:00.000Z');
    const b = update('b', 'ChatGPT Ads expands across Europe', '2026-08-18T00:00:00.000Z');

    expect(findRelatedItems(a, [a, b]).map((item) => item.id)).toEqual(['b']);
    expect(findRelatedItems(update('lonely', 'A standalone WeatherNext forecast release', '2026-08-01T00:00:00.000Z'), [a, b]))
      .toEqual([]);
  });
});
