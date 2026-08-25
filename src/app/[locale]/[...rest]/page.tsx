import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * 兜底路由：让 /zh/任意不存在的路径 真正落到 [locale]/not-found.tsx。
 *
 * **没有这个文件的话，[locale]/not-found.tsx 永远不会被渲染。** Next 的路由解析
 * 在匹配不到任何 segment 时就失败了，压根进不了 [locale] 段，于是回退到框架内置的
 * 那个「404 | This page could not be found」黑屏页——站内自定义的 404 白做。
 * 这是 next-intl 文档里明确要求补的一环，不是可选优化。
 *
 * catch-all 的优先级最低，只有在所有具体路由都没匹配上时才轮到它，
 * 不会抢走任何现有页面。
 */

/**
 * **软 404 的补救：让爬虫别收录这些页面。**
 *
 * `notFound()` 触发的响应目前返回 HTTP 200 而不是 404。这是全站既存行为，
 * `/products/{不存在}`、`/blog/p/{不存在}` 也一样。
 *
 * **已经排除的两个猜想**（2026-08 在 Next 16.2.12 上逐个构建实测，别再重走）：
 *
 * 1. 「`[locale]/layout.tsx` 里的 `<Suspense>` 提前 flush 了 shell，状态码定死在 200」
 *    —— 不是。把那层 Suspense 整个拿掉重新构建，`notFound()` 依然返回 200。
 * 2. 「自定义的 `[locale]/not-found.tsx` 是客户端组件，吞掉了状态码」
 *    —— 也不是。把该文件移走、退回框架内置的 not-found，依然 200。
 *
 * 另外，普通路由里直接调 `notFound()` 同样返回 200，所以也**不是 catch-all 特有的**。
 * 剩下的嫌疑在路由结构本身：根布局不渲染 `<html>/<body>`（交给 `[locale]/layout.tsx`），
 * 且没有根级 `app/not-found.tsx`。要验证就得把 html/body 挪回根布局——那是全站改动，
 * 风险与收益不成比例。
 *
 * 而 SEO 上的实际危害是「不存在的页面被当成正常内容收录」，下面这个 noindex
 * 就挡住了这一层（线上已验证生效）。将来真修成 404 时这条可以保留，真 404 页加 noindex 无害。
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CatchAllNotFound() {
  notFound();
}
