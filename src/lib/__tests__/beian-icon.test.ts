import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 页脚的公安备案警徽是管局要核验的合规元素，必须无条件渲染。
 * 它已经因为同一个原因坏过两次，而且**只在 1x 屏上坏**——开发机基本都是
 * Retina，肉眼自查根本发现不了。
 *
 * 根因：next/image 会按 width 生成 `w=16 1x, w=32 2x` 的 srcset，而
 * /_next/image 只接受 imageSizes/deviceSizes 里的宽度。Next 16 的默认
 * imageSizes 最小是 32，于是 w=16 返回
 * `400 "w" parameter (width) of 16 is not allowed`，1x 屏直接裂图。
 *
 * 顺带一提，这张图走优化还是负收益：实测 /_next/image?w=32 回来 2051B，
 * 比原图 1403B 大 46%，格式也没变。
 */

const FOOTER = readFileSync(
  resolve(process.cwd(), 'src/components/FooterCopyright.tsx'),
  'utf8',
);

/** /_next/image 接受的最小宽度（Next 16 默认 imageSizes 的下界）。 */
const MIN_OPTIMIZER_WIDTH = 32;

describe('公安备案警徽', () => {
  it('用原生 img 渲染，不经过 next/image', () => {
    expect(FOOTER).toMatch(/<img\s[^>]*src="\/beian-police\.png"/);
    expect(FOOTER).not.toMatch(/<Image\s[^>]*beian-police/);
  });

  it('保持 36×40 的原始宽高比，且不撑高页脚那行小字', () => {
    const img = /<img\s[^>]*src="\/beian-police\.png"[^>]*>/.exec(FOOTER)?.[0] ?? '';
    const width = Number(/width=\{?(\d+)\}?/.exec(img)?.[1]);
    const height = Number(/height=\{?(\d+)\}?/.exec(img)?.[1]);

    expect(width).toBeGreaterThan(0);
    // 原图 36×40，宽高比 0.9——不是正方形，写成等宽高会把警徽压扁。
    // 容差放到 0.05：整数像素下取不到精确的 0.9（16×17.78 得写成 16×18 = 0.889），
    // 但正方形的 1.0 仍会被挡下，这正是要防的那种写法。
    expect(width / height).toBeCloseTo(36 / 40, 1);
    // 太小在 12px 小字里辨认不出警徽，管局核验要能看清；太大会撑高整行
    expect(width).toBeGreaterThanOrEqual(16);
    expect(width).toBeLessThanOrEqual(20);
  });

  it('合规元素不依赖会 400 的图片优化端点', () => {
    // 只要还用 <Image> 且 width < 32，1x 屏就会拿到 400。
    // 这条同时兜住「将来有人好心把它改回 next/image」。
    const optimized = [...FOOTER.matchAll(/<Image\s[^>]*?width=\{(\d+)\}[^>]*?>/g)];
    const tooSmall = optimized
      .map((m) => Number(m[1]))
      .filter((w) => w < MIN_OPTIMIZER_WIDTH);

    expect(
      tooSmall,
      `next/image 的 width 小于 ${MIN_OPTIMIZER_WIDTH} 时，1x 屏请求的 w=${tooSmall[0]} ` +
        '会被 /_next/image 拒绝（400），图片在非高清屏上裂开。改用原生 <img>。',
    ).toEqual([]);
  });
});
