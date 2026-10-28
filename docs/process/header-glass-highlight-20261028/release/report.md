# Header 玻璃导航生产验收

结论：12/12 通过，0 失败。此次为真实生产匿名 Chrome 验收，未使用 auth/API 夹具，未沿用本地无数据库豁免。

- 生产地址：`https://www.imagentx.top`
- Release：`17b351ea08ba2cbf61e19ba5116d0e8bf58834c5`
- 执行时间：2026-10-28 21:34:06–21:35:59 北京时间（13:34:06–13:35:59 UTC）
- 浏览器：Chrome 156.0.8078.48，headless；12 个独立、初始 cookie 为空的 context。执行结束已关闭浏览器。
- 复用：本轮 `header-glass-check.cjs` 的检查逻辑，以及前轮 `production-observer.cjs` 的生产只读观察器。实际脚本为同目录 `production-glass-check.cjs`。

## 覆盖与结果

| 分组 | 组合 | 结果 |
| --- | --- | --- |
| 桌面 | 中文/英文 × 1280/1024 | 4/4 |
| 触屏模拟 | 中文/英文 × 375/768 | 4/4 |
| coarse 指针模拟 | 英文 1024 | 1/1 |
| 媒体偏好 | reduced-motion、reduced-transparency、contrast: more，各含桌面和手机布局 | 3/3 |

桌面与手机选中装饰层 opacity=1；桌面悬停 opacity=0.65。按下时 `::before` 的 transform 为 `matrix(0.96, 0, 0, 0.96, 0, 0)`，文字叶子与分组保持 `transform: none`。减少动态时装饰层 transform=none、transition=0s；减少透明度时顶栏、面板与装饰层 backdrop-filter=none；增强对比度时装饰层白色 1px 边框通过。

全宽下拉面板左边缘为 0、宽度与视口一致；分组保持 static、无 transform/backdrop-filter。全部布局未发现水平溢出或名称文字压缩；英文 1024 的 `Login / Register` 实测单行。

五组名称分别直达 `/products`、`/daily`、`/pathfinder`、`/blog`、`/docs`；独立箭头 Enter/Space/指针展开不改变路由；ArrowDown/Escape 恢复实际名称或箭头焦点；跨组悬停后子链接第一次点击、Meta 点击均通过。手机名称跳转后面板关闭并恢复滚动，Escape 恢复汉堡按钮焦点；coarse 1024 箭头点击区域至少 44px。

## 网络证据与只读边界

- 413 次 JS/CSS 响应：353 次 JS、60 次 CSS，共 27 个唯一静态 URL；成功状态及 MIME 全部有效。
- 32 次真实 API GET：`/api/auth/me` 16 次、`/api/announcements` 16 次，全部 200。16 次 auth 响应均为 user=null 且 no-store。
- 0 个 pageerror、0 个 HTTP 错误、0 个非中止 GET 失败、0 个静态 MIME/状态异常。
- 449 次 `net::ERR_ABORTED` 均为含 `_rsc` 的 fetch，在多轮导航中取消；单独保留，不计为成功响应或 API 成功，也未作为数据库错误豁免。
- 185 次非 GET 被拦截：Sentry envelope 128 次、online heartbeat 57 次。WebSocket 全量拦截规则已启用，观察到 0 次 WS 请求；Service Worker 被禁用。
- 结果 JSON 中 URL 的公开 telemetry key 已替换为 `[REDACTED]`。

额外以一次公开 GET 校验实际部署 CSS `25_cr4f57lo2w.css`，SHA-256 为 `9c4bb8b43aecedd2b041364e4a7f2e734c1a37e77ad545dabd572b7bf52fa000`，与部署方提供的构建产物哈希一致。源码 Header.module.css SHA-256 为 `88c7bdcd923c6a35e26ead5a983259a69648f10eb57aaad3d0da7db572fd6255`，与本轮 manifest 一致。

## 截图与产物

两张截图均等待字体就绪与有限动画结束后捕获，并已逐张查看：桌面产品玻璃选中态完整；手机产品选中态、导航文字及登录按钮布局完整。

- `selected-zh-1280.png`：1280px 中文顶栏局部。
- `mobile-selected-zh-375.png`：375px 中文手机导航。
- `results.json`：每组计算样式、几何信息、行为记录与脱敏网络事件。
- `summary.json`：准确汇总、CSS 校验与截图哈希。
- `deployed-header.css`：生产 CSS 公开 GET 校验副本。
- `run.log`：12 组通过日志。
- `sha256sums.txt`：交付文件哈希。

触屏/coarse 与媒体偏好为 Chrome 模拟；验收覆盖匿名线上导航，未执行登录账户或商业写入。未修改源码、提交或部署。
