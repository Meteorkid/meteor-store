/**
 * 用户输入净化工具。
 *
 * 用于 feedback / topic-proposal 等纯文本写入接口：
 * 剥离字面 HTML 标签,防止存库内容在后续管理后台预览或邮件通知中被错误地当成 HTML 渲染。
 *
 * 设计选择:
 *  - 只剥离字面标签,不反转义 HTML 实体——避免把 &lt;script&gt; 还原成真正的 <script>
 *  - 不替代 Markdown 渲染管线的 rehype-sanitize(那里有完整的 XSS 防护)
 *  - 评论 / 投稿正文不调用此函数:评论渲染走 React 文本节点(自动转义),
 *    投稿正文走 Markdown 管线(rehype-sanitize 丢弃原生 HTML)
 *
 * 改动此函数要同步跑 src/lib/__tests__/sanitize.test.ts 的回归用例。
 */
export function sanitizeUserInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}
