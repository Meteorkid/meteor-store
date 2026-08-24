import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Skeleton Anatomy 的在线体验质量约束。
 *
 * 源应用是 `@ts-nocheck` + `eslint-disable` 的移植代码，类型检查和 lint 都不覆盖它，
 * 而仓库测试环境是 node（没有 DOM，也没有 testing-library），所以这里用源码契约
 * 把结构性要求钉住：可访问名称、语义按钮、触控尺寸、折叠与减少动态效果。
 * 依据 docs/superpowers/specs/2026-08-24-online-experience-ui-quality-design.md。
 */
const appDir = path.join(__dirname, '..');
const read = (relative: string) => readFileSync(path.join(appDir, relative), 'utf-8');

const appSource = read('App.jsx');
const sidebarSource = read('components/Sidebar.jsx');
const infoPanelSource = read('components/InfoPanel.jsx');
const modelSource = read('components/SkeletonModel.jsx');
const css = read('App.css');

describe('骨骼列表是语义按钮', () => {
  it('列表项渲染为 button 并播报选中状态', () => {
    expect(sidebarSource).toMatch(/<button[\s\S]*?className={`bone-list-item/);
    expect(sidebarSource).toMatch(/aria-pressed={selectedBone === bone\.id}/);
  });

  it('不再用 div + onClick 承载列表项', () => {
    // div 上的 onClick 拿不到 Enter/Space、焦点和角色，读屏用户直接失去整份列表
    expect(sidebarSource).not.toMatch(/<div[^>]*className={`bone-list-item/);
  });

  it('列表项触控高度不小于 44px', () => {
    const rule = css.match(/\.bone-list-item \{[^}]*\}/)?.[0] ?? '';
    expect(rule).toMatch(/min-height:\s*44px/);
  });
});

describe('纯图标按钮有可访问名称', () => {
  it('移动端抽屉开关、主题切换、遮罩和关闭按钮都带 aria-label', () => {
    // 断言的是「这些按钮有可访问名称」这件结构性的事，不是具体文案——
    // 文案会随国际化改动，钉死字符串只会让翻译工作被测试挡住
    const labelled = (source: string, marker: string) => new RegExp(
      `${marker}[\\s\\S]{0,400}?aria-label=`,
    ).test(source);

    expect(appSource).toMatch(/onClick={toggleSidebar}[\s\S]{0,200}?aria-label=/);
    expect(appSource).toMatch(/onClick={toggleInfoPanel}[\s\S]{0,200}?aria-label=/);
    expect(appSource).toMatch(/onClick={toggleTheme}[\s\S]{0,200}?aria-label=/);
    expect(labelled(appSource, 'className={`mobile-overlay')).toBe(true);
    expect(labelled(sidebarSource, 'className="drawer-close"')).toBe(true);
    expect(labelled(infoPanelSource, 'className="drawer-close"')).toBe(true);
    expect(labelled(sidebarSource, 'className="search-clear"')).toBe(true);
  });

  it('抽屉开关声明展开状态与受控面板', () => {
    expect(appSource).toMatch(/aria-expanded={sidebarOpen}/);
    expect(appSource).toMatch(/aria-controls="skeleton-sidebar"/);
    expect(appSource).toMatch(/aria-expanded={infoPanelOpen}/);
    expect(appSource).toMatch(/aria-controls="skeleton-info-panel"/);
    expect(sidebarSource).toContain('id="skeleton-sidebar"');
    expect(infoPanelSource).toContain('id="skeleton-info-panel"');
  });

  it('图标按钮触控区不小于 44px', () => {
    const mobileToggle = css.match(/\.mobile-toggle \{[^}]*width:\s*44px[^}]*\}/)?.[0];
    expect(mobileToggle, '.mobile-toggle 需要 44px 触控区').toBeTruthy();
    expect(mobileToggle).toMatch(/height:\s*44px/);

    const drawerClose = css.match(/\.drawer-close \{[^}]*width:\s*44px[^}]*\}/)?.[0];
    expect(drawerClose, '.drawer-close 需要 44px 触控区').toBeTruthy();
    expect(drawerClose).toMatch(/height:\s*44px/);

    const searchClear = css.match(/\.search-clear \{[^}]*\}/)?.[0] ?? '';
    expect(searchClear).toMatch(/width:\s*44px/);
    expect(searchClear).toMatch(/height:\s*44px/);
  });
});

describe('移动抽屉可关闭且焦点可回归', () => {
  it('Escape 关闭抽屉', () => {
    expect(appSource).toMatch(/e\.key === 'Escape'[\s\S]*?closePanels\(\)/);
    expect(appSource).toMatch(/addEventListener\('keydown'/);
  });

  it('关闭后焦点回到打开它的按钮', () => {
    expect(appSource).toMatch(/previous === 'sidebar' \? sidebarTriggerRef\.current : infoTriggerRef\.current/);
    expect(appSource).toMatch(/trigger\?\.focus\(\)/);
  });

  it('打开后焦点进入抽屉', () => {
    expect(sidebarSource).toMatch(/if \(sidebarOpen\) closeButtonRef\.current\?\.focus\(\)/);
    expect(infoPanelSource).toMatch(/if \(infoPanelOpen\) closeButtonRef\.current\?\.focus\(\)/);
  });

  it('遮罩仍可点击关闭', () => {
    expect(appSource).toMatch(/className={`mobile-overlay[\s\S]*?onClick={closePanels}/);
  });
});

describe('未选择骨骼时折叠详情列', () => {
  it('无选中骨骼时加上 collapsed 类', () => {
    expect(infoPanelSource).toMatch(/bone \? '' : 'collapsed'/);
  });

  it('桌面端折叠为零宽，移动端抽屉仍占满宽度', () => {
    const desktop = css.match(/\.info-panel\.collapsed \{[^}]*\}/)?.[0] ?? '';
    expect(desktop).toMatch(/width:\s*0/);

    const mobileBlock = css.slice(css.indexOf('@media (max-width: 768px)'));
    const mobileCollapsed = mobileBlock.match(/\.info-panel\.collapsed \{[^}]*\}/)?.[0] ?? '';
    expect(mobileCollapsed).toMatch(/width:\s*100%/);
  });
});

describe('减少动态效果', () => {
  it('同时关闭循环动画与抽屉位移', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) and \(max-width: 768px\)[\s\S]*?transform:\s*none/,
    );
  });

  it('位移替换限制在移动端断点内，桌面两栏不会被整列隐藏', () => {
    // display:none 的抽屉替换若写在无断点的 reduce 块里，桌面端常驻侧栏会直接消失
    const bareReduce = css.match(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/,
    )?.[0] ?? '';
    expect(bareReduce).not.toMatch(/display:\s*none/);
  });

  it('3D 选中脉冲在减少动态效果时停止但保留选中反馈', () => {
    expect(modelSource).toMatch(/usePrefersReducedMotion/);
    expect(modelSource).toMatch(/if \(reduceMotion\) \{[\s\S]*?setScalar\(size\)/);
  });
});

describe('选中光晕表达定位而非装饰', () => {
  const selectedMaterial = modelSource.match(
    /<meshStandardMaterial[\s\S]*?\/>/,
  )?.[0] ?? '';

  it('发光强度与不透明度收敛', () => {
    expect(selectedMaterial).toMatch(/emissiveIntensity={0\.4}/);
    expect(selectedMaterial).toMatch(/opacity={0\.38}/);
  });

  it('光晕半径小于骨骼自身尺寸的一半', () => {
    const factor = Number(
      modelSource.match(/const indicatorSize = Math\.max\(0\.022, s \* ([\d.]+)\)/)?.[1],
    );
    expect(factor).toBeGreaterThan(0);
    expect(factor).toBeLessThan(0.5);
  });
});
