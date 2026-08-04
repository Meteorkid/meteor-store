import type { ReactNode } from 'react';

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
