# Meteor Store 完整邮箱验证实施计划

> 日期：2026-08-03
> 设计依据：`docs/superpowers/specs/2026-08-03-email-verification-design.md`

## 实施原则

- 按红灯 → 绿灯 → 重构推进；每个安全边界先建立失败测试。
- 不新增依赖，不新增数据库结构；复用 `jose`、Resend、现有 `emailVerified` 字段与限流模块。
- 保留工作区其他未提交改动，仅修改本计划列出的文件；与现有改动重叠时逐块检查。
- 管理员生产数据回填与代码部署解耦：先交付 dry-run 默认的数据脚本，不在错误环境下盲目写库。

## Task 1：签名令牌与验证服务

涉及文件：

- 新增 `src/lib/email-verification.ts`
- 新增 `src/lib/__tests__/email-verification.test.ts`

步骤：

1. 先写验证 token 的正确、篡改、错误 purpose、过期测试。
2. 写重发凭证的正确、过期、不能当验证 token 使用测试。
3. 实现独立派生密钥、issuer/audience/purpose 校验和 24 小时/15 分钟过期策略。
4. 添加数据库用户匹配与幂等验证服务测试，再实现条件更新。
5. 运行定向 Vitest、TypeScript 与相关 ESLint。

## Task 2：验证邮件

涉及文件：

- 修改 `src/lib/email.ts`
- 修改 `src/lib/__tests__/email.test.ts`

步骤：

1. 先补中英文主题、HTML 转义、URL fragment、站点 URL 归一化测试。
2. 实现 `isEmailDeliveryConfigured()` 与 `sendEmailVerification()`。
3. 覆盖 Resend 返回错误、抛错、缺配置三条失败路径。
4. 确认邮件 HTML 不包含 query-string token，不记录密钥或完整 token。

## Task 3：注册与登录边界

涉及文件：

- 新增 `src/app/api/auth/__tests__/register.test.ts`
- 新增 `src/app/api/auth/__tests__/login.test.ts`
- 修改 `src/app/api/auth/register/route.ts`
- 修改 `src/app/api/auth/login/route.ts`

步骤：

1. 注册测试先断言：保留管理员邮箱拒绝、未验证用户落库、无 `createSession()`、返回验证状态与重发凭证。
2. 覆盖邮件配置缺失时不插入用户，以及插入后临时发送失败仍可重发。
3. 登录测试先断言：已验证用户签会话；未验证用户密码正确仍返回 403；错误密码不泄露验证状态。
4. 实现结构化错误码与重发凭证，不改变现有限流和 dummy bcrypt 语义。

## Task 4：验证与重发 API

涉及文件：

- 新增 `src/app/api/auth/verify-email/route.ts`
- 新增 `src/app/api/auth/resend-verification/route.ts`
- 新增对应 route 测试
- 修改 `src/app/api/__tests__/rate-limit-coverage.test.ts` 仅当扫描规则需要显式说明

步骤：

1. 先写验证成功、幂等、篡改、过期、不匹配账户测试。
2. 实现 `POST /api/auth/verify-email`，不创建 session。
3. 先写重发凭证、用户/IP 双限流、已验证用户不发、Resend 失败测试。
4. 实现 `POST /api/auth/resend-verification`，只接受签名凭证，不接受邮箱。
5. 运行写接口限流覆盖测试。

## Task 5：会话与管理员权限统一

涉及文件：

- 修改 `src/lib/auth.ts` 及新增/更新测试
- 修改 `src/lib/admin.ts`、`src/lib/__tests__/admin.test.ts`
- 修改所有调用 `isAdminEmail(session.email)` 的页面与 API
- 修改 `src/app/api/auth/me/route.ts`

步骤：

1. 先写 `getSession()` 对未验证数据库用户返回 null、数据库异常时旧 JWT fail closed、新已验证 JWT 可回退的测试。
2. 让新 session 携带 `emailVerified: true`，数据库查询同时校验 `tokenVersion` 与 `emailVerified`。
3. 新增并测试 `isAdminSession()`：邮箱命中但未验证仍拒绝。
4. 机械替换管理员调用点，保持页面 404 与 API 现有错误语义。
5. 更新 `/api/auth/me`，客户端只看到已验证用户，后台入口使用统一权限函数。

## Task 6：前端验证体验

涉及文件：

- 修改 `src/components/AuthProvider.tsx`
- 修改 `src/components/AuthForm.tsx`
- 新增 `src/components/VerifyEmailClient.tsx`
- 新增 `src/app/[locale]/verify-email/page.tsx`
- 修改 `src/app/[locale]/login/page.tsx`
- 修改 `messages/zh.json`、`messages/en.json`

步骤：

1. 将登录/注册结果从单一错误字符串扩展为带 `code`、`verificationRequired`、`resendTicket` 的窄类型。
2. 注册成功与未验证登录进入“检查邮箱”状态；不写 AuthProvider 用户，不跳首页。
3. 重发按钮只提交 ticket，成功后冷却，失败时保留 ticket。
4. 验证页从 fragment 读取 token 后立即清除地址栏，再 POST 验证接口。
5. 验证成功跳到 `/login?verified=1`；无效/过期展示可返回登录并重新获取邮件的状态。
6. 核对中英文文案、键一致性、键盘焦点和 `aria-live` 状态。

## Task 7：授权码防御与管理员回填脚本

涉及文件：

- 修改 `src/app/[locale]/account/page.tsx`
- 新增 `scripts/verify-existing-admins.mjs`
- 新增或更新相关测试

步骤：

1. 账户页在查询 `license_keys` 前显式检查数据库 `emailVerified`；未验证时不返回任何授权码。
2. 确认邀请码兑换依赖严格 `getSession()` 后自然只允许已验证用户。
3. 脚本默认 dry-run，只输出管理员配置数、注册匹配数、待更新数。
4. `--apply` 使用规范化生产 `ADMIN_EMAILS`，只更新已存在且未验证的匹配账户。
5. 在没有正确生产管理员环境变量时禁止 apply；不打印邮箱和凭据。

## Task 8：集成验证与交付

步骤：

1. 运行所有新增定向测试。
2. 运行 `pnpm exec tsc --noEmit`。
3. 运行 `pnpm exec eslint src`，要求 0 error。
4. 运行 `pnpm test`。
5. 运行 `pnpm build`，记录 `.next` 被覆盖并提醒重启 dev server。
6. 运行 `git diff --check`，逐文件审查只包含本阶段改动。
7. 用正确生产环境对管理员脚本执行 dry-run；实际 `--apply` 前再次核对命中数量。
8. 更新项目 `AGENTS.md` 的邮箱验证不变量和 Obsidian 项目总结。
9. 经用户要求后再整理代码 commit；不自动 push 或部署。

## 验收清单

- [ ] 注册成功但没有 session cookie。
- [ ] 未验证用户即使密码正确也不能登录。
- [ ] 验证链接不出现在 query string 或服务端日志。
- [ ] 验证成功不自动登录，必须重新输入密码。
- [ ] 重发必须持有短期凭证，并受到用户/IP 双限流。
- [ ] 未验证邮箱不能访问管理员能力、历史授权码和邀请码兑换。
- [ ] 存量已注册管理员可在强制验证上线后继续登录后台。
- [ ] 完整 TypeScript、ESLint、Vitest、Next build 通过。
