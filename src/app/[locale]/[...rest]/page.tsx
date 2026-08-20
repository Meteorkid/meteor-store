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
 * `notFound()` 触发的响应目前返回 HTTP 200 而不是 404（根布局里的 Suspense
 * 开启了流式渲染，shell 一 flush 状态码就固定了）。这是全站既存行为，
 * `/products/{不存在}`、`/blog/p/{不存在}` 也一样。
 *
 * 真 404 要动全站布局，风险不成比例；而 SEO 上的实际危害是「不存在的页面被当成
 * 正常内容收录」，noindex 就能挡住这一层。等哪天流式渲染那边理顺了，
 * 再把状态码修成 404，这条可以保留（真 404 页加 noindex 也无害）。
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CatchAllNotFound() {
  notFound();
}
