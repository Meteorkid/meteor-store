import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getHeaderNavigation } from '@/data/header-navigation';
import CelestialText, { getLetteringAspect } from '../home/CelestialText';

const homeCopy = [
  '星光不远', '让想念发光', '看见你', '回到星光', '作品', '指南',
  'METEOR', 'STORE', 'WORKS', 'GUIDE', 'PAUSE', 'PLAY',
  'BEHIND THE LIGHT', 'TO THE STARS', 'A LIGHT IS NEVER ALONE',
  'INDEPENDENT CREATIONS', 'MENU',
];

describe('首页自绘字形', () => {
  it.each(homeCopy)('服务端直接呈现已确认文案：%s', text => {
    const html = renderToStaticMarkup(<CelestialText text={text} />);
    expect(html).toContain('<path');
    expect(html).toContain(`aria-label="${text}"`);
    expect(html).not.toContain('<text');
    expect(html).not.toContain('data-celestial-fallback');
    expect(html).not.toContain('data-celestial-missing');
  });

  it('真实导航中英文名称全部可用，不用预览中的简化菜单代替', () => {
    for (const group of getHeaderNavigation(true)) {
      for (const text of Object.values(group.label)) {
        const html = renderToStaticMarkup(<CelestialText text={text} />);
        expect(html, text).toContain('<path');
        expect(html, text).not.toContain('data-celestial-fallback');
      }
    }
  });

  it('未支持的字符保留整段真实文字，不输出缺字框', () => {
    const html = renderToStaticMarkup(<CelestialText text="新的中文标题 🪐" />);
    expect(html).toContain('新的中文标题 🪐');
    expect(html).toContain('data-celestial-fallback="true"');
    expect(html).not.toContain('<svg');
  });

  it('装饰字形不重复父元素已有的无障碍名称', () => {
    const html = renderToStaticMarkup(<CelestialText text="METEOR" decorative />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('aria-label');
    expect(html).not.toContain('role="img"');
  });

  it('异常尺寸参数不会产生NaN或无限SVG，合法字距可改变占宽', () => {
    const html = renderToStaticMarkup(<CelestialText text="星光不远" spacing={NaN} weight={Infinity} />);
    expect(html).toContain('viewBox="0 0 412 100"');
    expect(html).not.toMatch(/NaN|Infinity/);
    expect(getLetteringAspect('星光不远', 20)).toBeGreaterThan(getLetteringAspect('星光不远'));
  });
});
