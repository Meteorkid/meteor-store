/** 新制作的原型操作短片；不复用旧 demo.mp4 或截图平移动画。 */
const motionProductIds = [
  'xisland', 'xnook', 'statux', 'claude-phone-control', 'cursor-source-analyzer',
  'omnicrawl', 'skeleton-anatomy', 'tollow', 'chakra-visualizer', 'webgl-fluid-sim',
  'ex-memory', 'ui-design-system',
] as const;

export interface ProductCoverSource {
  poster: string;
  video?: string;
}

export const productCoverSources: Record<string, ProductCoverSource> = Object.fromEntries(
  motionProductIds.map((id) => [id, {
    poster: `/products/${id}/cover-motion.webp`,
    video: `/products/${id}/cover-motion.mp4`,
  }]),
);

export function getProductCoverSource(id: string): ProductCoverSource {
  return productCoverSources[id] ?? { poster: `/products/${id}/cover.webp` };
}
