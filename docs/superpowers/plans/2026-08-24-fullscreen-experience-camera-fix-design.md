# 全屏体验与摄像头权限修复设计

## 目标

- 所有 `/apps/{id}/trial` 与 `/apps/ex-memory` 页面只呈现应用本体，不加载商城的颗粒、星空、流星、搜索和帮助浮层。
- Chakra Visualizer 与 WebGL Fluid Sim 的试用页允许当前站点请求摄像头，同时保持其他页面默认禁用摄像头。
- Ex-Memory 从产品页在新窗口打开；未登录先登录，登录后回到无商城导航的全屏体验页。

## 方案

在语言根布局中增加一个仅负责商城全局视觉层的客户端路由门控。门控识别全屏体验路径并跳过装饰与浮层，身份 Provider、国际化和 Service Worker 保持原有作用域。

安全响应头继续默认使用 `camera=()`；仅在 `/:locale/apps/:id/trial` 的具体规则中覆盖为 `camera=(self)`。这样摄像头权限只开放给同源试用页面，麦克风和定位仍保持关闭。

Ex-Memory 沿用专用 `/apps/ex-memory` 路由与同源 runtime iframe，入口补齐 `target="_blank"`，页面服务端校验登录并重定向，登录成功后 iframe 占满动态视口。

## 验证

- 路由识别单元测试覆盖中英文试用页、Ex-Memory 与普通商城页面。
- 静态配置测试锁定 trial 路由的摄像头响应头覆盖。
- Ex-Memory 页面与入口测试锁定新窗口、登录返回地址和全屏结构。
- 运行相关 Vitest、完整测试、TypeScript 检查和生产构建；部署后用线上响应头和页面 HTML 复核。
