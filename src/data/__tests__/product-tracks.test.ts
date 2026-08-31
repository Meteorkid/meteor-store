import { describe, it, expect } from 'vitest';
import { products } from '../products';
import {
  FLAGSHIP_PRODUCT_ID,
  flagshipProductIds,
  funnelProductIds,
  labProductIds,
  getProductTrack,
  productLineIds,
  selectLabProducts,
  selectProductLine,
} from '../product-tracks';

const allTrackIds = [...flagshipProductIds, ...funnelProductIds, ...labProductIds];

describe('产品线分组', () => {
  it('三条线的并集正好等于 products 全集', () => {
    // 新加产品忘了归类，或分组里留了个已删除的 id，都在这里红
    expect([...allTrackIds].sort()).toEqual(products.map((p) => p.id).sort());
  });

  it('同一款产品不会同时出现在两条线里', () => {
    expect(new Set(allTrackIds).size).toBe(allTrackIds.length);
  });

  it('旗舰产品在主线付费主体里', () => {
    expect(flagshipProductIds).toContain(FLAGSHIP_PRODUCT_ID);
  });

  it('getProductTrack 认得每一款产品', () => {
    for (const product of products) {
      expect(getProductTrack(product.id)).toBeDefined();
    }
    expect(getProductTrack('nonexistent')).toBeUndefined();
  });
});

describe('实验室一律免费', () => {
  it('lab 里每一档的价格都是 0', () => {
    // 实验室的定位是「证明能做，不是收钱」。任何一档带价格，
    // 都会让 /lab 页面出现购买入口，和页面上写的「随便玩」自相矛盾
    for (const id of labProductIds) {
      const product = products.find((p) => p.id === id);
      expect(product, `产品 ${id} 不存在`).toBeDefined();

      for (const plan of product!.pricing) {
        expect(plan.price, `${id} 的 ${plan.id} 档不是免费`).toBe(0);
      }
    }
  });

  it('原价挪进 originalPrice 划掉展示，不是凭空抹掉', () => {
    // 曾经卖过钱的四款要保留原价：对已购用户体面，也让「限免」这件事看得见
    const previouslyPaid = ['omnicrawl', 'skeleton-anatomy', 'tollow', 'chakra-visualizer'];

    for (const id of previouslyPaid) {
      const product = products.find((p) => p.id === id);
      const withOriginal = product!.pricing.filter((plan) => (plan.originalPrice ?? 0) > 0);
      expect(withOriginal.length, `${id} 应保留划线原价`).toBeGreaterThan(0);
    }
  });
});

describe('选择函数', () => {
  it('主线取五款，顺序是付费主体在前', () => {
    const line = selectProductLine(products);

    expect(line.map((p) => p.id)).toEqual([...productLineIds]);
    expect(line[0].id).toBe(FLAGSHIP_PRODUCT_ID);
  });

  it('实验室取七款', () => {
    expect(selectLabProducts(products).map((p) => p.id)).toEqual([...labProductIds]);
  });

  it('产品缺失时抛错，不静默少一张卡', () => {
    expect(() => selectProductLine([{ id: 'xisland' }])).toThrow('未找到产品：xnook');
  });
});
