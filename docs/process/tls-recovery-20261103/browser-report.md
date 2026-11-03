# HTTPS 恢复后的只读浏览器验收

- 结果：中文桌面 1280×900、英文手机模拟 375×900 两组最终均通过；浏览器 156.0.8078.80 已关闭。
- 线上基础地址：`https://www.imagentx.top`。普通 TLS 校验；未使用 `ignoreHTTPSErrors`、自定义信任证书或 TLS 绕过。
- Chrome 实际证书：TLS 1.3，颁发者 YE1，主体 imagentx.top，到期 2027-02-01T10:25:34+00:00。
- 首页均 HTTP 200；一级产品名称分别直达 `/zh/products`、`/en/products`；产品箭头仅展开菜单；Escape 关闭并恢复焦点。
- 手机名称跳转关闭菜单、恢复 body overflow；Escape 关闭也恢复滚动；文档高度 8040px、视口 900px，关闭后实际 `scrollY: 0 → 300`。触控目标 44×64px。
- 最终两组记录 52 个 JS/CSS 响应，全部为成功状态及正确 MIME；4 个真实 API GET，其中 2 个匿名 `/api/auth/me` 均 200、`user: null`、`no-store`；HTTP 错误、失败 GET、pageerror 均为 0。
- 截图等待字体及有限动画结束，未完成有限动画为 0；两张截图已人工目视检查，导航、正文与手机展开菜单正常可见。

## 证据与保留的测试脚本问题

- 完整最终证据：`accepted-cases.json`，显式记录来自哪轮的通过用例，不把失败轮汇总成通过。
- 桌面截图：`corrected-home-selector/desktop-zh-1280.png`。
- 手机截图：`mobile-scroll-wait/mobile-en-375.png`。
- 首轮 `results.json` 保留：首页源码没有 `<main>`，自建脚本误用该选择器，因此两例未执行导航；当轮 50 个静态请求正常且无网络/pageerror。
- 第二轮 `corrected-home-selector/results.json` 保留：桌面通过；手机交互、关闭与 overflow 恢复通过，额外滚动断言在一帧后读取 0。根因是全局 `scroll-behavior: smooth`。第三轮只复验手机，改用有界条件等待，实际到达 300。

## 验证边界

- 使用全新匿名上下文，没有真实登录、会话或认证夹具。允许的 GET 全部访问真实线上接口。
- 所有非 GET 请求和 WebSocket 均被拦截；最终两组共阻断 13 次 POST（在线心跳和 Sentry），未尝试 WebSocket。
- 控制台 13 条 ERR_BLOCKED_BY_CLIENT 来自上述主动拦截；另有 Service Worker 被测试工具阻断及 THREE.Clock 弃用提示，不是页面脚本异常。
- 禁用了 Service Worker，避免其绕过请求拦截；没有业务写入、源码修改、应用部署、提交或消息发送。
- 手机是 Chrome 触控模拟；滚动证明来自 DOM/CSS 与程序化滚动，未做物理手机手势验收。
