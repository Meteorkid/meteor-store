import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 架构约束测试：全站只有暗色一套主题，不跟随系统深浅色。
 *
 * 这条约束此前只靠「记得别改」维持，结果 :root 里长期放的是浅色值、暗色值藏在
 * prefers-color-scheme 媒体查询里——浅色系统的机器上 --background 变成近白，
 * 而周围 bg-white/5、border-white/10 这些硬编码类不跟着翻转，整站白底白字。
 * 线上挂了一段时间才被在 iPad 上看到的人发现。
 *
 * 约束由四个文件共同承担，任何一处被改回去 CI 都会红。
 */

const SRC = join(process.cwd(), 'src');
const globals = readFileSync(join(SRC, 'app/globals.css'), 'utf8');
const rootLayout = readFileSync(join(SRC, 'app/layout.tsx'), 'utf8');
const globalError = readFileSync(join(SRC, 'app/global-error.tsx'), 'utf8');

/** 去掉 /* *\/ 注释，避免注释里提到的反例被误判成真实规则 */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function collectFiles(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === 'node_modules' ? [] : collectFiles(full, ext);
    }
    return ext.some((e) => entry.endsWith(e)) ? [full] : [];
  });
}

describe('全站暗色主题的固定', () => {
  it('globals.css 不含任何跟随系统深浅色的规则', () => {
    expect(stripComments(globals)).not.toMatch(/prefers-color-scheme/);
  });

  it('globals.css 声明 color-scheme: dark，让 UA 部件也走暗色', () => {
    expect(stripComments(globals)).toMatch(/color-scheme:\s*dark/);
  });

  it('语义 token 全部是暗色档', () => {
    const css = stripComments(globals);
    // --background/--foreground 反了就是全站白底白字
    expect(css).toMatch(/--background:\s*var\(--color-16\)/);
    expect(css).toMatch(/--foreground:\s*var\(--color-1\)/);
    // --secondary 驱动骨架屏/Footer 图标，留浅色值会在黑底上砸出近白方块
    expect(css).toMatch(/--secondary:\s*var\(--gray-8\)/);
    expect(css).toMatch(/--secondary-foreground:\s*var\(--gray-0\)/);
    // 浅色档的取值不该再出现在任何语义 token 上
    expect(css).not.toMatch(/--background:\s*var\(--color-1\)/);
    expect(css).not.toMatch(/--secondary:\s*var\(--gray-2\)/);
  });

  it('主 token 块用 :root:root 抬高特异性，不依赖与 tokens.css 的源码顺序', () => {
    const css = stripComments(globals);
    // tokens.css（自动生成）也用 :root 定义同名浅色 token，同特异性下只靠写在后面取胜。
    // 重新生成 tokens、给它包 @layer、或在上面再加一条 @import 都会让那个假设失效。
    const block = css.slice(css.indexOf(':root:root'), css.indexOf('@theme inline'));
    expect(block).toContain('color-scheme: dark');
    expect(block).toMatch(/--background:\s*var\(--color-16\)/);
  });

  it('viewport 挂在根布局上，覆盖所有路由', () => {
    // 挂在 [locale]/layout.tsx 的话，将来在它之外新增顶层段会静默丢掉这两个 meta
    expect(rootLayout).toMatch(/export const viewport:\s*Viewport/);
    expect(rootLayout).toMatch(/colorScheme:\s*['"]dark['"]/);
    expect(rootLayout).toMatch(/themeColor:/);
  });

  it('global-error 自带 color-scheme 并引入全局样式', () => {
    // 它会替换根布局，既拿不到 viewport 也拿不到 [locale]/layout.tsx 里的样式 import
    expect(globalError).toMatch(/colorScheme:\s*['"]dark['"]/);
    expect(globalError).toMatch(/import\s+['"]\.\/globals\.css['"]/);
  });

  it('组件里没有 dark: 变体', () => {
    // 只有一套主题，dark: 变体永远不生效，出现即是误解
    const offenders = collectFiles(SRC, ['.tsx', '.ts'])
      .filter((file) => /\bclassName=[^>]*\bdark:/.test(readFileSync(file, 'utf8')))
      .map((file) => file.replace(`${process.cwd()}/`, ''));
    expect(offenders).toEqual([]);
  });
});
