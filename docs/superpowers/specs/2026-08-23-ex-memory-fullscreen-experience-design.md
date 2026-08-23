# Ex-Memory 新窗口全屏体验设计

## 目标

将产品页的 Ex-Memory 在线体验调整为独立新窗口：未登录用户直接进入 Meteor Store
登录页，登录后返回全屏 Ex-Memory；体验窗口不显示商城页头、页尾、标题或容器装饰。
同时修复浏览器错误触发 `offline` 事件后长期显示“网络连接已断开”的问题。

## 已确认交互

1. 产品页「在线体验」链接仍指向本地化的 `/apps/ex-memory`，使用 `_blank` 新开窗口，
   并设置 `rel="noopener noreferrer"`。
2. `/apps/ex-memory` 服务端读取 Meteor Store session：
   - 未登录：直接重定向到本地化登录页，查询参数为 `next=/apps/ex-memory`。
   - 已登录：只渲染 Ex-Memory iframe，不渲染 Header、Footer、标题或返回链接。
3. iframe 覆盖整个可视区域，使用 `100vw × 100dvh`，无边框、圆角、阴影或外边距。
4. iframe 收到 `ex-memory:session-expired` 时刷新外层页面；服务端随后把失效 session
   重定向到登录页。

## 离线提示根因

生产访问日志显示截图发生期间，HTML、静态资源、`/api/exes` 和 `/api/stickers`
均返回 200，Ex-Memory 容器也保持健康。前端当前在收到浏览器 `offline` 事件后立即显示
持久横幅，只在后续 `online` 事件到来时隐藏。夸克浏览器产生了与实际连通性不一致的
`offline` 事件，因此横幅成为误报。

## 离线判定设计

- `offline` 事件仅触发一次主动连通性检查，不直接改变 UI。
- 连通性检查请求同源 `${BASE_PATH}/health`，使用短超时与 `cache: 'no-store'`。
- 健康请求成功时保持在线状态，不显示横幅。
- 健康请求失败时才显示离线横幅和 warning toast。
- `online` 事件以及任意 Ex-Memory API 成功响应都会清除离线状态；从离线恢复时执行
  `flushOfflineQueue()`。
- 不增加周期轮询，避免产生持续健康检查流量。

## 组件边界

### Meteor Store

- 产品页只负责新窗口链接属性。
- `/apps/ex-memory` 页面只负责 session 门控和全屏 frame 渲染。
- `ExMemoryExperienceFrame` 继续负责 ready、超时重试和 session 失效消息，但布局改为全屏。

### Ex-Memory

- `app.js` 负责经过健康探测的网络状态机。
- FastAPI、外部身份映射和 Nginx `auth_request` 协议保持不变。

## 测试与验收

- 产品入口测试：验证 `target="_blank"` 与安全 `rel`。
- 页面测试：验证未登录重定向目标；已登录页面不包含 Header/Footer，iframe 为全屏。
- 前端静态测试：验证 `offline` 回调不会直接显示横幅，健康探测失败才显示；API 成功会清除横幅。
- 回归运行 Meteor Store 相关 Vitest、TypeScript、变更文件 ESLint，以及 Ex-Memory
  相关 pytest/Ruff/JavaScript 语法检查。
- 线上验收：未登录新窗口直达登录页；登录后全屏加载；API 返回 200 时不显示离线横幅；
  Nginx 未登录运行时仍为 401，防伪身份头仍不可绕过。

## 部署与回滚

先部署 Ex-Memory 离线检测修复并确认容器健康，再部署 Meteor Store 全屏入口。
两边分别保留现有镜像和 `.next` 回滚产物；任一步验收失败时恢复对应产物，不修改用户
`data/` 与 `exes/`。
