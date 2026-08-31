/**
 * 产品线分组 —— 决定每款产品出现在哪里。**纯呈现层配置，不碰交易数据。**
 *
 * **收缩产品线时不要删或合并 `products` 数组的条目**：`orders` 表存的是 productId，
 * `getUserEntitlements`、`/api/download/[productId]`、订单页、成功页、邀请码后台
 * 全部按 id 查。删掉一个条目等于让已购用户的订单和授权同时失效，而且没有补救手段。
 * 想让某款产品不再主推，把它挪进 `lab` 就够了 —— 数据层 12 个条目一个不动。
 *
 * 三条线的分工：
 * - `flagship` 主线付费主体，站点唯一认真卖的东西
 * - `funnel`   同一条线上的免费入口，作用是把人引到主线，不是收钱
 * - `lab`      实验室，一律免费，作用是证明能力
 *
 * 三条线的并集必须等于 `products` 全集，由 `__tests__/product-tracks.test.ts` 钉住：
 * 新加产品忘了归类，CI 会红。
 */

export type ProductTrack = 'flagship' | 'funnel' | 'lab';

/** 主线的旗舰产品，产品线区块用它的名字作为品牌 */
export const FLAGSHIP_PRODUCT_ID = 'xisland';

export const flagshipProductIds = ['xisland', 'xnook'] as const;

export const funnelProductIds = [
  'statux',
  'claude-phone-control',
  'cursor-source-analyzer',
] as const;

export const labProductIds = [
  'omnicrawl',
  'skeleton-anatomy',
  'tollow',
  'chakra-visualizer',
  'webgl-fluid-sim',
  'ex-memory',
  'ui-design-system',
] as const;

/**
 * 主线在首页与 /products 上的完整阵容：付费主体在前，免费入口在后。
 * 顺序即展示顺序 —— 先让人看见要卖的，再给他免费的理由留下来。
 */
export const productLineIds = [...flagshipProductIds, ...funnelProductIds] as const;

const trackById = new Map<string, ProductTrack>([
  ...flagshipProductIds.map((id) => [id, 'flagship'] as const),
  ...funnelProductIds.map((id) => [id, 'funnel'] as const),
  ...labProductIds.map((id) => [id, 'lab'] as const),
]);

export function getProductTrack(id: string): ProductTrack | undefined {
  return trackById.get(id);
}

/** 按给定 id 顺序取产品；缺任何一个都抛错，避免页面静默少一张卡 */
function selectInOrder<T extends { id: string }>(
  allProducts: readonly T[],
  ids: readonly string[],
): T[] {
  const productsById = new Map(allProducts.map((product) => [product.id, product]));

  return ids.map((id) => {
    const product = productsById.get(id);
    if (!product) {
      throw new Error(`未找到产品：${id}`);
    }
    return product;
  });
}

/** 主线五款（付费主体 + 免费入口），首页产品线区块与 /products 主区块用 */
export function selectProductLine<T extends { id: string }>(allProducts: readonly T[]): T[] {
  return selectInOrder(allProducts, productLineIds);
}

/** 实验室七款，/lab 页面用 */
export function selectLabProducts<T extends { id: string }>(allProducts: readonly T[]): T[] {
  return selectInOrder(allProducts, labProductIds);
}
