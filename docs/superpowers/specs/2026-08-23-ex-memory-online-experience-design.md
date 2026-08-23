# Ex-Memory 在线体验接入设计

> 日期：2026-08-23

## 目标

在现有 Ex-Memory 产品页 `/{locale}/products/ex-memory` 增加“在线体验”入口，跳转到保留 Meteor Store Header/Footer 的独立体验页 `/{locale}/apps/ex-memory`。体验页复用 Meteor Store 登录态，并通过同域 iframe 加载独立部署的 Ex-Memory 服务。

## 范围

本次包含：

- 产品页在线体验入口。
- Meteor Store 体验页及登录门禁。
- 同域 iframe 容器和加载失败状态。
- Ex-Memory 独立 Docker 服务部署。
- Nginx 同域反向代理和会话鉴权。
- Meteor Store 用户到 Ex-Memory 数据空间的稳定映射。
- 中英文入口、鉴权、安全隔离和部署验收。

本次不包含：

- 重写 Ex-Memory 前端为 Meteor Store React 组件。
- 独立子域或第二套账号系统。
- 修改 Ex-Memory 定价和购买模式。
- 将数据库密钥或本地解密快照上传到服务器。
- 重新构建现有 macOS 微信导出助手 DMG。

## 页面与路由

### 产品页入口

Ex-Memory 产品数据增加明确的在线体验地址，产品详情页在标题区显示“在线体验”主按钮。入口使用站内国际化导航，中文链接到 `/zh/apps/ex-memory`，英文链接到 `/en/apps/ex-memory`。

Ex-Memory 仍可保留 `coming_soon` 商业状态；该状态只控制出售和定价门禁，不应阻止已明确开放的在线体验入口。

### 体验页

体验页使用 Meteor Store 的 Header/Footer。主内容区包含：

- 未登录状态：登录说明和“登录后体验”按钮，不创建或加载 iframe。
- 已登录状态：加载中状态、同域 iframe 和服务不可用状态。
- iframe 使用足够的最小高度，并在移动端根据可用视口调整，避免内部页面和外层页面产生不可用的双重滚动。

登录按钮携带受约束的站内返回地址，使用户登录成功后回到当前语言的 Ex-Memory 体验页。

## 服务架构

```text
浏览器
  └─ https://imagentx.top/{locale}/apps/ex-memory
       ├─ Meteor Store：页面、Header/Footer、登录门禁
       └─ iframe: /ex-memory-runtime/
            └─ Nginx
                 ├─ 内部鉴权请求 → Meteor Store
                 └─ 鉴权通过 → 127.0.0.1 上的 Ex-Memory 容器
```

Ex-Memory 作为独立容器运行，只监听服务器回环地址，不直接暴露公网端口。其数据目录使用持久化卷，容器重建或重启不得丢失用户数据。

`/ex-memory-runtime/` 与体验页同属 `https://imagentx.top` Origin，因此浏览器会携带 Meteor Store 会话 Cookie，现有内置 `https://imagentx.top` Origin 的微信导出助手无需重建。

## 登录同步与身份映射

Meteor Store 服务端页面先调用现有 `getSession()`：

- 未登录时不渲染 iframe。
- 已登录时才允许浏览器请求运行时路径。

Nginx 对 `/ex-memory-runtime/` 的每次请求通过 `auth_request` 调用 Meteor Store 的 `GET /api/internal/ex-memory-auth`。该接口要求 Nginx 注入的内部共享凭据，校验当前会话后只返回 204 或 401；成功响应通过 `X-Ex-Memory-User-Id` 携带稳定的 Meteor Store 用户 ID。Nginx 必须先清除客户端提交的同名身份头和 `X-Ex-Memory-Proxy-Token`，再写入服务端配置值后转发。

Ex-Memory 的 Meteor Store 部署模式必须：

- 只信任来自本机反向代理、同时携带有效 `X-Ex-Memory-Proxy-Token` 的身份头。
- 身份缺失或验证失败时返回 401，不创建匿名用户。
- 以稳定用户 ID 建立或查找用户空间。
- 关闭 Ex-Memory 自有注册、登录和退出入口。
- 不以邮箱或昵称作为数据归属键。

共享凭据只存在于服务器环境变量，不进入仓库、浏览器响应或日志。

## 隐私和安全边界

- Ex-Memory 的上传内容、镜像、会话和导出结果按 Meteor Store 用户 ID 隔离。
- 所有受保护接口继续执行 owner 校验，不能只依赖前端隐藏。
- 数据库密钥和本地解密快照继续留在用户 Mac，不上传服务器。
- Nginx 不记录 Cookie、共享凭据或完整身份头。
- iframe 只允许同源运行时；Meteor Store CSP 仅对 Ex-Memory 体验路由增加最小必要的 `frame-src` / `frame-ancestors` 放行。
- 直接访问运行时路径、伪造身份头或会话过期均不能获得应用数据。

## 错误处理

- Ex-Memory 服务未启动、健康检查失败或代理超时：外层页面显示“服务暂时不可用”，提供重试和返回产品页入口。
- iframe 超过限定时间未就绪：停止无限加载动画并展示可恢复错误。
- Meteor Store 会话过期：运行时返回 401，外层页面提示重新登录；登录后返回原体验页。
- 身份头缺失、共享凭据错误或用户 ID 非法：Ex-Memory 拒绝请求，不降级匿名模式。
- 上传、解析或模型调用失败：Ex-Memory 返回用户可理解的业务错误，不暴露服务器路径、密钥或内部堆栈。
- 服务重启：持久化数据保留；无法恢复的临时任务明确标记失败或可重试。

## 部署配置

部署需要：

- Ex-Memory 独立 Docker 服务及持久化数据卷。
- 仅绑定 `127.0.0.1` 的应用端口。
- LLM、Embedding、日志级别和受信代理等现有环境变量。
- Meteor Store 身份代理模式和共享凭据环境变量。
- Nginx `/ex-memory-runtime/` 代理、内部鉴权和超时配置。
- Ex-Memory 健康检查与重启策略。

发布顺序为：先部署并验证 Ex-Memory 回环服务，再配置 Nginx 鉴权代理，最后上线 Meteor Store 入口和体验页。任一步失败都不应影响现有产品页和商城主流程。

## 测试与验收

### Meteor Store

- Ex-Memory 中英文产品页均显示本地化在线体验入口。
- 入口跳转到相同语言的 `/apps/ex-memory`。
- 未登录用户看不到 iframe，登录按钮包含安全的站内返回地址。
- 已登录用户加载体验容器。
- 服务不可用和 iframe 超时状态可恢复。
- Header/Footer、暗色主题和移动端布局正常。

### 鉴权与隔离

- 无会话直接访问 `/ex-memory-runtime/` 返回 401。
- 客户端伪造身份头不能改变实际用户。
- 同一 Meteor Store 用户重复访问映射到同一 Ex-Memory 空间。
- 两个测试用户不能互相访问镜像、会话、上传文件或导出结果。
- 会话过期后运行时访问立即失效。

### 部署与回归

- Ex-Memory 健康检查、容器重启和持久化卷验证通过。
- `nginx -t` 通过，代理支持页面、静态资源、API 和必要的长请求。
- Meteor Store 测试与生产构建通过。
- Ex-Memory pytest 与 Ruff 通过。
- 浏览器完成“产品页 → 体验入口 → 登录 → 返回体验页 → 加载应用”的端到端验收。

## 完成标准

用户可以从现有 Ex-Memory 产品页进入保留商城 Header/Footer 的独立体验页。已登录用户无需再次登录即可进入自己的 Ex-Memory 数据空间；未登录用户只能看到登录引导。运行时无法绕过 Meteor Store 会话，用户数据严格隔离，现有 macOS 微信导出助手继续接受同一正式 Origin。
