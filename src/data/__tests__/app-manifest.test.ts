import { describe, expect, it } from 'vitest';
import { appIds, getAppTrialHref, isAppId, webAppCount } from '../app-manifest';
import { products } from '../products';

describe('站内应用清单', () => {
  it('数量由应用 ID 清单推导且没有重复项', () => {
    expect(webAppCount).toBe(appIds.length);
    expect(new Set(appIds).size).toBe(appIds.length);
  });

  it('与 products 中真实可打开的 Web 应用完全一致', () => {
    const productAppIds = products
      .filter((product) => product.appUrl)
      .map((product) => product.id)
      .sort();

    expect([...appIds].sort()).toEqual(productAppIds);

    for (const id of appIds) {
      const product = products.find((item) => item.id === id);
      expect(product?.appUrl).toBe(`/apps/${id}`);
    }
  });

  it('只为已注册应用生成独立全屏体验地址', () => {
    for (const id of appIds) {
      expect(isAppId(id)).toBe(true);
      expect(getAppTrialHref(id)).toBe(`/apps/${id}/trial`);
    }

    expect(isAppId('ex-memory')).toBe(false);
    expect(isAppId('unknown-product')).toBe(false);
  });
});
