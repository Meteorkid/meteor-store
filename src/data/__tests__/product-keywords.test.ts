import { describe, expect, it } from 'vitest';
import { products, localizeProduct } from '@/data/products';

/**
 * 产品关键词的不变量。
 *
 * 这些断言的目的不是「测出关键词有用」——meta keywords 对 Google 排名无效，
 * 这是 Google 2009 年就公开说明的。它们守的是另外三件事：
 * 1. **不静默丢失**：`products.ts` 的 keywords 写错形状或 `localizeProduct`
 *    忘记拍平，页面上只是少一个 meta 标签，没有任何运行时报错。
 * 2. **不堆砌**：重复词、空词、整句塞进关键词，是搜索引擎明确列为
 *    keyword stuffing 的形态，代价大于收益。
 * 3. **覆盖机制词**：XIsland 的检索意图是「Claude Code hooks 怎么看状态」，
 *    不是「好看的 macOS 应用」。这组词一旦被换成形容词，等于白做。
 */

const CONFIGURED = products.filter((product) => product.keywords);
const MAX_KEYWORD_LENGTH = 40;

describe('产品关键词', () => {
  it('中文与英文两套都存在且不为空', () => {
    for (const product of CONFIGURED) {
      expect(product.keywords!.zh.length, `${product.id} 缺中文关键词`).toBeGreaterThan(0);
      expect(product.keywords!.en.length, `${product.id} 缺英文关键词`).toBeGreaterThan(0);
    }
  });

  it('单个产品内不重复，且没有空白词或超长整句', () => {
    for (const product of CONFIGURED) {
      for (const locale of ['zh', 'en'] as const) {
        const list = product.keywords![locale];
        // 大小写不敏感去重：'Claude Code' 与 'claude code' 在检索里是同一个词，
        // 同时出现只会稀释权重，不会扩大覆盖
        const normalized = list.map((keyword) => keyword.trim().toLowerCase());
        expect(new Set(normalized).size, `${product.id}/${locale} 存在重复关键词`).toBe(list.length);
        for (const keyword of list) {
          expect(keyword.trim(), `${product.id}/${locale} 有空关键词`).not.toBe('');
          expect(
            keyword.length,
            `${product.id}/${locale} 的关键词过长（疑似整句）：${keyword}`,
          ).toBeLessThanOrEqual(MAX_KEYWORD_LENGTH);
        }
      }
    }
  });

  it('localizeProduct 拍平出对应语言的关键词', () => {
    for (const product of CONFIGURED) {
      expect(localizeProduct(product, 'zh').keywords).toEqual(product.keywords!.zh);
      expect(localizeProduct(product, 'en').keywords).toEqual(product.keywords!.en);
    }
  });

  it('没配关键词的产品得到空数组，而不是 undefined', () => {
    const plain = products.find((product) => !product.keywords);
    expect(plain, '这条断言需要至少一个未配关键词的产品').toBeDefined();
    expect(localizeProduct(plain!, 'zh').keywords).toEqual([]);
  });

  it('XIsland 必须覆盖 hook 机制词，中英文都不缺', () => {
    const xisland = products.find((product) => product.id === 'xisland');
    expect(xisland?.keywords).toBeDefined();
    const zh = xisland!.keywords!.zh.join(' ').toLowerCase();
    const en = xisland!.keywords!.en.join(' ').toLowerCase();

    // 机制词是这款产品的检索入口，缺了就退化成「又一个 macOS 小工具」
    for (const term of ['hooks', 'hooks.json', 'pretooluse']) {
      expect(zh, `中文关键词缺 ${term}`).toContain(term);
      expect(en, `英文关键词缺 ${term}`).toContain(term);
    }
    // 主流客户端名要覆盖到，否则搜具体代理名时召回不到
    for (const agent of ['claude code', 'codex', 'cursor', 'gemini']) {
      expect(zh).toContain(agent);
      expect(en).toContain(agent);
    }
  });
});
