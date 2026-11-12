import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CelestialField from '../CelestialField';
import ProductStarStory from '../ProductStarStory';

describe('产品页星象', () => {
  it('北斗七星使用固定坐标，不随渲染改变', () => {
    const html = renderToStaticMarkup(<ProductStarStory rgb="94 234 212" />);
    expect(html.match(/data-story-star=/g)).toHaveLength(7);
    expect(html).toContain('M168 259 L250 207 L326 236 L298 315 Z');
    expect(renderToStaticMarkup(<ProductStarStory rgb="94 234 212" />)).toBe(html);
  });

  it('背景星区只保留星点，不再生成随机跨区折线', () => {
    const html = renderToStaticMarkup(<CelestialField seed="products-atlas" rgb="94 234 212" count={4} />);
    expect(html.match(/<circle/g)).toHaveLength(4);
    expect(html).not.toContain('<path');
  });
});
