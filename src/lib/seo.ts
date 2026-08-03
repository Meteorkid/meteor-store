/**
 * 把 JS 对象序列化为可安全内嵌到 <script type="application/ld+json"> 的字符串。
 *
 * JSON.stringify 不转义 <、>、/,读者投稿标题若含 </script><script>...
 * 可在 HTML 解析器眼里闭合脚本块并注入恶意脚本。CSP nonce 是纵深防御,
 * 这里做代码级修复:把可能闭合标签的字符替换成 Unicode 转义。
 *
 * 仅用于 dangerouslySetInnerHTML 的 __html,不要用于普通文本渲染。
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\//g, '\\u002f');
}
