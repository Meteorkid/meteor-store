import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../../..');
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

describe('在线体验统一质量底线', () => {
  it('WebGL 默认收起设置并在移动端使用底部面板', () => {
    const source = read('src/lib/apps/webgl-fluid-sim/fluidSim.js');
    const css = read('src/components/apps/fluid-sim.css');

    expect(source).toContain('setControlPanelOpen(false)');
    expect(source).toContain("gui.addFolder(t('common'))");
    expect(source).toContain("gui.addFolder(t('advanced'))");
    expect(source).toContain(
      "commonFolder.domElement.parentElement.classList.add('fluid-common-section')",
    );
    expect(source).toContain(
      "advancedFolder.domElement.parentElement.classList.add('fluid-advanced-section')",
    );
    expect(source).not.toMatch(/(?:common|advanced)Folder\.__li/);
    expect(css).toMatch(/\.fluid-controls-toggle \{[\s\S]*?min-height:\s*44px/);
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?inset:\s*auto 0 0/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it('Chakra 首屏先给摄像头入口且展示真实忍术数', () => {
    const tutorial = read('src/apps/chakra-visualizer/components/Tutorial.jsx');
    const app = read('src/apps/chakra-visualizer/App.jsx');
    const css = read('src/apps/chakra-visualizer/components/Tutorial.css');

    expect(tutorial.indexOf('className="hero-action"')).toBeLessThan(
      tutorial.indexOf('className="hero-stats"'),
    );
    expect(tutorial).toContain('{JUTSU_IDS.length}');
    expect(app).toContain('await requestCameraAccess()');
    expect(tutorial).toContain('camera-permission-error');
    expect(css).toMatch(/\.character-img\.naruto-left,[\s\S]*?display:\s*none/);
  });

  it('Tollow 使用纸张品牌加载态并保留完整移动导航', () => {
    const wrapper = read('src/components/apps/TollowApp.tsx');
    const header = read('src/apps/tollow/shared/layout/Header.tsx');
    const css = read('src/apps/tollow/styles/Header.css');

    expect(wrapper).toContain('className="tollow-boot"');
    expect(wrapper).not.toContain('sync.ready.finally');
    expect(header).toContain('className="mobile-nav"');
    expect(header).toContain("to: '/practice'");
    expect(header).toContain("to: '/analytics'");
    expect(css).toContain('grid-template-columns: repeat(5, minmax(0, 1fr))');
    expect(css).toMatch(/\.mobile-nav-item \{[\s\S]*?min-height:\s*48px/);
  });

  it('每个全屏应用都有产品专属加载反馈', () => {
    expect(read('src/components/apps/WebGLFluidSim.tsx')).toContain('fluid-sim-loading');
    expect(read('src/components/apps/ChakraVisualizerApp.tsx')).toContain('chakra-app-loading');
    expect(read('src/components/apps/SkeletonAnatomyApp.tsx')).toContain('skeleton-app-loading');
    expect(read('src/components/apps/TollowApp.tsx')).toContain('tollow-boot');
  });
});
