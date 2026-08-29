import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.join(__dirname, '..', '..');
const css = readFileSync(path.join(root, 'app', 'globals.css'), 'utf-8');

/**
 * `.glass-card` 的 `overflow: hidden` 会把负偏移的绝对定位子元素裁掉一半。
 * 下载卡右上角的「推荐」徽标（-top-2.5）实测被裁掉 9px，只露出下半截。
 *
 * 这个坑已经踩过两次：PricingCard 当初用内联 style 打了补丁，DownloadCard
 * 没同步到。所以钉在测试里。
 */
describe('卡片徽标不被裁切', () => {
  it('badge-safe 类必须定义在 .glass-card 之后', () => {
    // 两者特异性相同 (0,1,0)，靠源码顺序取胜；挪到前面去就不生效了
    const base = css.indexOf('.glass-card {');
    const safe = css.indexOf('.glass-card-badge-safe');
    expect(base).toBeGreaterThanOrEqual(0);
    expect(safe).toBeGreaterThan(base);
    expect(css.slice(safe, safe + 200)).toContain('overflow: visible');
  });

  it('带探出徽标的卡片都用了这个类', () => {
    for (const file of ['components/DownloadCard.tsx', 'components/PricingCard.tsx']) {
      const source = readFileSync(path.join(root, file), 'utf-8');
      // 有负偏移徽标就必须关掉 overflow，否则只会露出半截
      if (/absolute -top-/.test(source)) {
        expect(source, `${file} 有探出的徽标却没用 glass-card-badge-safe`)
          .toContain('glass-card-badge-safe');
      }
    }
  });

  it('不再用内联 style 打补丁', () => {
    // 内联样式没有名字，下一个人看不出为什么要关 overflow
    const pricing = readFileSync(path.join(root, 'components', 'PricingCard.tsx'), 'utf-8');
    expect(pricing).not.toMatch(/style=\{\{\s*overflow:\s*'visible'/);
  });
});
