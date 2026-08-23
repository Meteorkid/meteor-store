# Ex-Memory 在线体验接入 Implementation Plan

> 日期：2026-08-23
>
> 设计依据：`docs/superpowers/specs/2026-08-23-ex-memory-online-experience-design.md`

## Goal

在现有 Ex-Memory 产品页增加在线体验入口，提供保留 Meteor Store Header/Footer 的 `/zh|en/apps/ex-memory` 页面；已登录用户通过同域 iframe 进入独立部署的 Ex-Memory 服务，未登录用户只看到登录引导。运行时必须复用 Meteor Store 会话并保持用户数据隔离。

## Architecture

- Meteor Store：产品入口、体验页、登录返回、内部鉴权接口。
- Nginx：`auth_request` 校验会话，清除伪造身份头，再代理 `/ex-memory-runtime/`。
- Ex-Memory：代理身份模式、外部身份到本地整数用户的映射、子路径 SPA。
- 阿里云：Ex-Memory Docker 服务只绑定 `127.0.0.1`，数据目录持久化。

## Global Constraints

- Meteor Store 仓库：`/Users/meteor/github/meteor-store`。
- Ex-Memory 仓库：`/Users/meteor/github/ex-memory`。
- 两个仓库各自遵循根目录 `AGENTS.md`；不修改或提交现有无关脏文件。
- Ex-Memory 保持 `coming_soon` 商业状态；在线体验不要求购买或 Pass entitlement。
- 体验路由只要求已验证的 Meteor Store 会话，不加载未登录 iframe。
- 外部身份不得直接替换 Ex-Memory 现有整数 `user_id`；通过唯一映射表获得本地整数 ID。
- 代理模式下禁用 Ex-Memory 自有注册、登录和退出，不回退 Bearer Token。
- 共享代理凭据只放服务器环境变量和 root-only Nginx include，不写仓库或日志。
- Ex-Memory 容器不开放公网端口，只绑定 `127.0.0.1`。
- 数据库密钥和本地解密快照继续留在用户 Mac。
- 所有核心逻辑先写失败测试，再做最小实现。
- 未获用户最终授权前不提交实现代码、不推送、不部署。

## Execution Preflight

- [ ] 分别运行两个仓库的 `git status --short --branch`、`git diff --name-only` 和 `git diff --cached --name-only`。
- [ ] 确认 Meteor Store 只有本任务文档提交和用户现有 `_gen_docx.py`；确认 Ex-Memory 的本任务前置提交及现有未跟踪文件。
- [ ] 记录阿里云当前 Nginx 配置、PM2 状态、磁盘空间和端口占用，不做写操作。
- [ ] 运行基线测试：

```bash
cd /Users/meteor/github/meteor-store
pnpm exec vitest run src/lib/__tests__/auth.test.ts src/lib/__tests__/proxy-matcher.test.ts

cd /Users/meteor/github/ex-memory
pytest -q tests/test_routes_auth.py tests/test_exe_access.py tests/test_middleware.py
ruff check .
```

## Task 1：Meteor Store 安全登录返回地址

**Files:**

- Create: `src/lib/login-return.ts`
- Create: `src/lib/__tests__/login-return.test.ts`
- Modify: `src/app/[locale]/login/page.tsx`
- Modify: `src/components/AuthForm.tsx`
- Modify: `src/app/api/auth/wechat/route.ts`
- Modify: `src/app/api/auth/wechat/callback/route.ts`
- Modify: `src/lib/wechat-bind.ts`
- Modify existing WeChat auth tests as required

- [ ] 写失败测试：只接受精确站内目标 `/apps/ex-memory`；拒绝完整 URL、`//host`、反斜杠、编码绕过和其它任意路径，非法值回退 `/`。
- [ ] 在登录页读取 `next`，经纯函数归一化后传给 `AuthForm`。
- [ ] 密码登录、注册后登录和 MFA 成功均跳到安全目标；已登录状态的按钮也指向该目标。
- [ ] 微信登录把安全目标写入已有签名/一次性 state 数据，而不是信任回调 query；已绑定用户登录成功后返回目标。
- [ ] 微信未绑定流程保持现有绑定语义，不因 `next` 绕过邮箱验证或 MFA。
- [ ] 运行：

```bash
pnpm exec vitest run src/lib/__tests__/login-return.test.ts src/lib/__tests__/wechat-bind.test.ts
pnpm exec tsc --noEmit
```

## Task 2：Meteor Store 内部 Ex-Memory 鉴权接口

**Files:**

- Create: `src/app/api/internal/ex-memory-auth/route.ts`
- Create: `src/app/api/internal/ex-memory-auth/__tests__/route.test.ts`
- Modify: `.env.example`
- Modify: `docs/DEPLOYMENT.md`

- [ ] 写失败测试覆盖：缺少代理凭据 404/401、错误凭据拒绝、无会话 401、有效凭据和有效会话返回 204、成功时仅返回稳定用户 ID。
- [ ] 使用常量时间比较校验 `EX_MEMORY_PROXY_TOKEN`；未配置时 fail closed。
- [ ] 调用现有 `getSession()`，继续执行 tokenVersion 与邮箱验证检查。
- [ ] 成功响应只设置 `X-Ex-Memory-User-Id`，不返回邮箱、昵称、Cookie 或 JSON 用户资料。
- [ ] 响应设置 `Cache-Control: no-store`；日志不得打印代理凭据或完整用户 ID。
- [ ] 运行：

```bash
pnpm exec vitest run src/app/api/internal/ex-memory-auth/__tests__/route.test.ts src/lib/__tests__/auth.test.ts
```

## Task 3：产品入口与专属体验页

**Files:**

- Modify: `src/data/products.ts`
- Modify: `src/app/[locale]/products/[id]/page.tsx`
- Create: `src/app/[locale]/apps/ex-memory/page.tsx`
- Create: `src/components/ExMemoryExperienceFrame.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`
- Modify: `src/lib/__tests__/products.test.ts`
- Create: `src/app/[locale]/apps/ex-memory/__tests__/page.test.ts`

- [ ] 给产品模型增加可选 `experienceUrl`，本地化后保留；只为 Ex-Memory 设置 `/apps/ex-memory`。
- [ ] 写失败测试：中英文产品页均有在线体验入口，`coming_soon` 仍阻止定价购买但不阻止体验。
- [ ] 产品标题区使用 `next-intl` 站内 `Link` 渲染主按钮，不新开标签页。
- [ ] 专属静态路由优先于现有 `[id]` 通用付费应用页；它只校验登录，不检查 entitlement。
- [ ] 未登录页面不渲染 iframe，登录链接使用 `?next=/apps/ex-memory`。
- [ ] 已登录页面渲染 Header/Footer、应用说明和 `ExMemoryExperienceFrame`。
- [ ] 客户端 frame 管理加载、15 秒超时、重试和服务不可用提示；iframe 使用 `/ex-memory-runtime/`，sandbox 仅开放实际需要的能力。
- [ ] iframe 最小高度按可用视口计算；移动端避免不可用的双重滚动；reduced motion 不使用位移动画。
- [ ] 增加 `ExMemoryExperiencePage` 中英文文案命名空间。
- [ ] 运行：

```bash
pnpm exec vitest run src/lib/__tests__/products.test.ts 'src/app/[locale]/apps/ex-memory/__tests__/page.test.ts'
pnpm exec tsc --noEmit
```

## Task 4：Meteor Store CSP 与运行时边界

**Files:**

- Modify: `src/proxy.ts`
- Modify: `src/lib/__tests__/dark-theme.test.ts`
- Modify/add CSP tests

- [ ] 先用测试钉住：普通页面继续 `frame-ancestors 'none'`；现有 trial 路由保持同源可嵌入；Ex-Memory 外层页面允许同源 iframe，不扩大到第三方 Origin。
- [ ] `frame-src` 显式保持 `'self'`；不要加入 `*`、`data:` 或独立子域。
- [ ] 确保 `/ex-memory-runtime/` 由 Nginx 直接处理，不经过 next-intl 重定向。
- [ ] 运行 CSP、matcher 和暗色主题测试。

## Task 5：Ex-Memory 外部身份映射

**Files:**

- Create: `migrations/002_external_identities.sql`
- Modify: `server/auth.py`
- Modify: `server/middleware.py`
- Modify: `config.py`
- Create: `tests/test_meteor_store_proxy_auth.py`
- Modify: `.env.example`
- Modify: `docs/DEPLOYMENT.md`

- [ ] 写失败测试覆盖代理模式的成功映射、重复访问稳定映射、不同外部用户不同本地 ID、缺失/错误代理 token、缺失用户头、Bearer 回退被禁用。
- [ ] 新增 `external_identities(provider, external_user_id, user_id)`，唯一约束覆盖 `(provider, external_user_id)`，并关联现有整数 `users.id`。
- [ ] 首次访问在事务中创建不可密码登录的影子用户和映射；并发唯一约束冲突后重新读取，不能创建两份空间。
- [ ] 影子用户名不包含邮箱；外部 ID 不写普通请求日志。
- [ ] 增加 `METEOR_STORE_SSO_ENABLED`、`METEOR_STORE_PROXY_TOKEN` 配置，未配置 token 时启动失败。
- [ ] 代理模式的 `require_auth` 只接受有效代理头并返回本地整数 ID；非代理模式保持现有 Bearer 行为。
- [ ] 代理模式下 `/api/auth/register|login|logout` 返回 404 或明确禁用状态。
- [ ] 运行：

```bash
pytest -q tests/test_meteor_store_proxy_auth.py tests/test_routes_auth.py tests/test_exe_access.py
ruff check server/auth.py server/middleware.py config.py tests/test_meteor_store_proxy_auth.py
```

## Task 6：Ex-Memory 子路径 SPA 与代理模式 UI

**Files:**

- Modify: `server/app.py`
- Modify: `web/static/index.html`
- Modify: `web/static/app.js`
- Modify: `web/static/wechat-helper.js`
- Modify: `web/static/sw.js`
- Modify: `web/static/manifest.json`
- Create/update subpath and frontend tests

- [ ] 写失败测试：根路径独立模式仍生成 `/api`/`/static` 语义；`PUBLIC_BASE_PATH=/ex-memory-runtime` 时 HTML、API、静态资源和 Service Worker 全部落在该前缀下。
- [ ] 由服务端向 HTML 的 `data-*` 标记注入经过校验的认证模式和 base path，不拼接用户输入、不使用内联可执行脚本。
- [ ] SPA 统一从一个 base-path helper 派生 API、静态资源、贴纸和通知图标 URL，删除散落的根路径常量。
- [ ] Service Worker 从 registration scope 派生缓存路径；代理模式不得拦截 Meteor Store 自己的 `/api` 或静态资源。
- [ ] 代理模式直接进入主界面，不显示 Ex-Memory 登录/注册 Tab，也不保存本地 Bearer Token。
- [ ] API 返回 401 时向父页面发送受限 `postMessage({type:'ex-memory:session-expired'})`；父页面只接受同源消息并显示重新登录门禁。
- [ ] 页面就绪时发送 `ex-memory:ready`，外层据此结束加载状态；不得把用户资料放进消息。
- [ ] 运行前端语法、子路径、认证模式和现有公共 SPA 测试。

## Task 7：容器化部署配置

**Files:**

- Modify: `Dockerfile`
- Create: `docker-compose.production.yml`
- Modify: `.dockerignore` if required
- Modify: `docs/DEPLOYMENT.md`

- [ ] 生产 Compose 只暴露 `127.0.0.1:18000:8000`，不启动重复 Gradio 服务。
- [ ] 持久化挂载至少覆盖 `/app/data` 与项目实际 `exes` 路径；启动用户保持非 root。
- [ ] 设置代理认证、base path、LLM/Embedding、可信代理和关闭注册环境变量。
- [ ] 健康检查直接请求容器根 `/health`，不经过公网鉴权代理。
- [ ] 确认构建上下文不包含 `.env`、真实聊天、数据库、日志、测试导出或密钥。
- [ ] 运行：

```bash
docker compose -f docker-compose.production.yml config
docker build -t ex-memory:online-experience .
```

## Task 8：本地跨服务集成验证

- [ ] 启动 Meteor Store、Ex-Memory 容器和本地 Nginx 等价代理。
- [ ] 用两个测试账户验证：未登录 401、登录后自动进入、重复访问稳定映射、跨账户访问 403。
- [ ] 验证客户端伪造 `X-Ex-Memory-User-Id` 和代理 token 均无法改变身份。
- [ ] 验证密码登录、MFA、已绑定微信登录都能返回当前语言体验页。
- [ ] 验证 iframe ready、超时、服务停止、会话过期和重试状态。
- [ ] 验证本地助手配置接口仍返回正式 DMG，Origin 仍为 `https://imagentx.top`。

## Task 9：阿里云部署

- [ ] 只读核对服务器磁盘、端口、现有 PM2/Nginx 和备份路径。
- [ ] 生成强随机代理 token，分别写入 Meteor Store、Ex-Memory 私有环境文件和 root-only Nginx include；任何终端输出只显示“已配置”。
- [ ] 上传/拉取两个已验证提交，构建 Ex-Memory 镜像并启动回环服务。
- [ ] 先通过 `127.0.0.1` 健康检查验证容器，再修改 Nginx。
- [ ] Nginx 新增：
  - internal auth location → Meteor Store `/api/internal/ex-memory-auth`；
  - `/ex-memory-runtime/` → Ex-Memory 回环端口；
  - 清除客户端身份头并注入鉴权结果与代理 token；
  - 页面/API/流式响应的合理超时和禁用代理缓冲策略。
- [ ] 修改前创建带时间戳备份；`nginx -t` 失败自动回滚；成功后 reload，不重启整机。
- [ ] 重启 Meteor Store 使内部鉴权环境变量生效，并确认原站健康。
- [ ] 不在生产创建真实聊天内容；只使用专用测试账户和脱敏最小数据。

## Task 10：最终验证与交付

- [ ] Meteor Store：定向 Vitest、`tsc --noEmit`、ESLint、`pnpm build`。
- [ ] Ex-Memory：完整 `pytest -q`、`ruff check .`、Docker 健康检查。
- [ ] 生产浏览器验收中文和英文完整路径。
- [ ] 核对 Nginx 日志不含 Cookie、代理 token、完整身份头或聊天正文。
- [ ] 核对两个测试用户的数据隔离及容器重启后的持久化。
- [ ] 核对 Meteor Store 其它产品、下载、支付、博客和现有站内应用无回归。
- [ ] 按模板写入 Obsidian 项目总结，记录部署地址、备份位置、验证结果与回滚步骤。
- [ ] 向用户汇报两个仓库改动、测试、线上状态和未解决风险；收到确认后分别提交实现代码。

## Rollback

1. 从产品数据移除 `experienceUrl` 或回滚 Meteor Store 实现提交，使入口立即消失。
2. 恢复带时间戳的 Nginx 配置，执行 `nginx -t` 后 reload。
3. 停止 Ex-Memory 生产容器，但保留持久化卷供恢复。
4. 恢复 Meteor Store 部署前环境文件并重启 PM2。
5. 不删除用户持久化数据；如确需删除，必须另行确认并先备份。

## Completion Criteria

- 产品页中英文在线体验入口可用。
- 未登录用户不能加载运行时；登录后回到体验页。
- 已登录用户无需 Ex-Memory 二次登录。
- 同一用户映射稳定，不同用户数据隔离。
- 直接访问、伪造头和过期会话均被拒绝。
- Ex-Memory 以同域子路径稳定运行，Header/Footer 与移动端体验正常。
- 两仓测试、构建、Nginx 校验、容器健康和生产端到端验收全部通过。
