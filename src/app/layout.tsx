import type { ReactNode } from 'react';
import type { Viewport } from 'next';

/**
 * 全站固定暗色，不跟随系统深浅色设置。
 *
 * colorScheme 会渲染成 <meta name="color-scheme" content="dark">，在样式表下载完成前
 * 就让浏览器按暗色画首屏和 UA 部件，避免浅色系统下的白闪。
 * themeColor 让移动端浏览器地址栏也跟着变黑，否则页面是黑的、外框是白的。
 *
 * 放在根布局而不是 [locale]/layout.tsx：Next 沿整条 segment 链收集 viewport，
 * 挂在根上就覆盖所有路由。挂在 [locale] 下的话，将来在它之外新增顶层段
 * （根级 not-found、新的顶层路由）会静默丢掉这两个 meta。
 */
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
};

/**
 * 根布局：不渲染 <html>/<body>，只透传 children。
 *
 * next-intl 的 locale 路由要求 <html lang> 由 [locale]/layout.tsx 渲染，
 * 这样能按当前 locale 设置正确的 lang 属性。
 * next-intl proxy 会把 / 重定向到 /zh 或 /en，所以根路径不会真正渲染页面。
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
