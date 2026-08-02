# Meteor Store 完整邮箱验证与身份权限边界设计

> 日期：2026-08-03

## 目标

建立“邮箱所有权已验证”这一正式身份边界：注册只创建未验证账户，不签发会话；用户完成邮件验证后，才允许通过密码登录。管理员权限、历史授权码展示、邀请码兑换以及所有其他登录态能力统一依赖已验证会话。

同时阻止公开注册入口占用 `ADMIN_EMAILS` 中尚未注册的管理员邮箱，并在上线前只把已经存在、且命中生产管理员名单的账户回填为已验证，避免管理员被锁在后台之外。

## 当前根因

- `users.email_verified` 已存在且默认是 `false`，但仓库没有任何完成验证的流程。
- 注册接口插入用户后立即调用 `createSession()`，因此未验证账户直接获得 30 天正式会话。
- 管理员判定只比较会话中的邮箱字符串；历史授权码也只按用户邮箱关联。
- `getSession()` 只检查 `tokenVersion`，没有检查数据库中的 `emailVerified`。
- 项目已有 Resend、`jose`、身份接口 fail-closed 限流和动态 CSP，无需引入新依赖。

## 已确认决策

- 实现完整验证流程，不只做临时权限遮挡。
- 验证链接有效期为 24 小时。
- 验证成功后跳转登录页，用户重新输入密码；验证链接不自动登录。
- 未验证用户输入正确密码时返回明确状态，由用户主动点击重新发送邮件。
- 后续细节采用本文推荐项。
- 存量数据只回填已经存在且命中生产 `ADMIN_EMAILS` 的管理员账户，其他账户必须自行验证。

## 方案选择

采用无状态签名令牌，不新增验证令牌表。

### 验证令牌

- 使用 `JWT_SECRET + ':email-verification'` 派生独立 HMAC 密钥，与登录会话和 CAPTCHA 互不可替。
- JWT 包含 `sub=userId`、规范化邮箱、`typ=email-verification`、`iss=meteor-store`、对应 audience、签发时间和 24 小时过期时间。
- 令牌只通过验证邮件交付，不返回给注册接口调用方。
- 验证只把匹配用户更新为 `emailVerified=true`，不创建会话。有效链接被重复提交时返回幂等成功，因此重放不能转换成免密登录。

### 重发凭证

- 注册成功或“密码正确但邮箱未验证”时，服务端向浏览器返回一个 15 分钟有效的 `email-verification-resend` 签名凭证。
- 重发接口只接受该凭证，不接受任意邮箱地址。这样既不暴露账户是否存在，也不能被用于向任意地址发送邮件。
- 重发凭证只能触发邮件发送，不能把账户标记为已验证。
- 凭证过期后，用户重新输入邮箱和密码即可获得新凭证。

数据库哈希令牌方案虽然支持严格一次性消费与主动撤销，但需要新增表、清理策略，并引入 Neon HTTP 无事务下的消费补偿；Redis 方案会让核心身份流程依赖缓存可用性。由于验证链接不签发会话、项目也不支持修改登录邮箱，无状态令牌的风险更小、局部性更好。

## 架构与模块

### `src/lib/email-verification.ts`

负责：

- 签发和校验 24 小时邮箱验证令牌。
- 签发和校验 15 分钟重发凭证。
- 严格检查签名、过期时间、issuer、audience、用途、用户 ID 和规范化邮箱。
- 提供验证用户的服务函数：令牌合法且用户 ID、邮箱匹配时，把 `emailVerified` 条件更新为 `true`。

该模块不发送邮件、不写 cookie，也不读取 UI 文案。

### `src/lib/email.ts`

新增本地化的 `sendEmailVerification()`：

- 复用现有惰性 Resend 客户端和 HTML 转义规则。
- 邮件支持中文、英文两种主题与正文。
- 验证链接使用规范站点地址与合法 locale。
- token 放在 URL fragment 中，例如 `/zh/verify-email#token=...`。fragment 不会进入 HTTP 请求、服务器 access log 或 Referer。
- 未配置 `RESEND_API_KEY` 时抛出明确的配置错误；生产注册入口在插入用户前检查邮件基础设施，避免系统性地产生无法验证的账户。

### 身份会话

- `createSession()` 只用于已验证用户，签发的 JWT 带 `emailVerified: true`。
- `getSession()` 每次继续查询数据库，同时读取 `tokenVersion` 和 `emailVerified`。数据库值不是 `true` 时返回 `null`，从根上阻断所有未验证登录态。
- 数据库不可达时，只接受 JWT 中已经带有 `emailVerified: true` 的新会话；旧会话和缺少该声明的会话 fail closed。
- 新增 `isAdminSession(session)`，要求 `session.emailVerified === true` 且邮箱命中 `ADMIN_EMAILS`。所有管理员页面、API、编辑入口和 `/api/auth/me` 统一使用它，不再在调用点自行拼接条件。

## 数据流

### 注册

1. 按现有规则执行 IP fail-closed 限流、输入校验和 CAPTCHA 校验。
2. 规范化邮箱，检查重复账户。
3. 若邮箱命中 `ADMIN_EMAILS` 且账户尚不存在，拒绝公开注册并提示联系管理员。
4. 确认 Resend 关键配置存在，再执行 bcrypt 和用户插入；新用户保持 `emailVerified=false`。
5. 签发只供邮件使用的验证 token，并尝试发送验证邮件。
6. 不调用 `createSession()`。返回 `verificationRequired=true`、`emailSent` 和短期重发凭证。
7. 如果账户已创建但 Resend 临时发送失败，仍返回“账户已创建但邮件发送失败”的结构化结果；前端停留在待验证状态并提供重发按钮，避免用户重试注册后只得到“邮箱已存在”。

### 登录与重发

1. 登录保持现有 IP + 邮箱双维度 fail-closed 限流和 dummy hash 时序防枚举。
2. 密码错误仍统一返回“邮箱或密码错误”。
3. 密码正确但 `emailVerified=false` 时不创建 session，返回 `EMAIL_UNVERIFIED` 和 15 分钟重发凭证。
4. 用户显式点击重发后，`POST /api/auth/resend-verification` 校验凭证，再按用户和 IP 限流：用户维度 15 分钟 3 次、IP 维度 1 小时 20 次，均 `failClosed: true`。
5. 重发接口重新读取用户；用户不存在或已验证时不发送。有效未验证用户生成新的 24 小时验证 token 并发送邮件。

### 验证

1. 邮件链接打开本地化 `/verify-email` 页面。token 位于 fragment，不会随页面 GET 请求发送。
2. 客户端读取 fragment、立即从地址栏移除 token，并通过 `POST /api/auth/verify-email` 提交。
3. API 校验 token 后，以 `userId + email` 匹配用户并设置 `emailVerified=true`。
4. 已验证用户重复打开仍视为成功；不存在、邮箱不匹配、签名错误或过期返回统一的无效/过期错误。
5. 成功后跳转 `/login?verified=1`，显示“邮箱验证成功，请登录”，不签发会话。

### 管理员与授权码

- 上线前先执行管理员回填，再部署强制验证代码。
- 所有管理员权限使用 `isAdminSession()`；只命中邮箱但未验证时一律不是管理员。
- `getSession()` 不再向未验证账户返回登录态，因此账户页、邀请码兑换及其他登录能力天然被阻断。
- 账户页读取历史授权码前仍显式检查数据库用户的 `emailVerified`，防止未来会话策略调整时重新暴露按邮箱关联的授权码。

## API 与前端契约

### `POST /api/auth/register`

成功创建账户时返回：

```json
{
  "success": true,
  "verificationRequired": true,
  "emailSent": true,
  "resendTicket": "short-lived-signed-token"
}
```

不返回已登录用户对象，不写 session cookie。

### `POST /api/auth/login`

未验证且密码正确时返回 HTTP 403：

```json
{
  "error": "请先验证邮箱",
  "code": "EMAIL_UNVERIFIED",
  "resendTicket": "short-lived-signed-token"
}
```

### `POST /api/auth/resend-verification`

请求体只包含 `resendTicket`。成功发送返回 200；凭证无效返回 400；限流返回 429；已授权用户的实际邮件服务失败返回 503，并允许稍后用仍有效的凭证重试。

### `POST /api/auth/verify-email`

请求体只包含邮件令牌。成功或已经验证返回 200；无效、过期或找不到匹配账户统一返回 400。

### 前端状态

- 注册成功后不跳首页，切换为“检查邮箱”状态，显示目标邮箱的掩码形式和重发按钮。
- 未验证登录显示同一待验证状态，不把用户写入 `AuthProvider`。
- 重发成功后按钮进入冷却提示；失败保留凭证并允许稍后重试。
- 验证页包含处理中、成功跳转、无效/过期三种可访问状态。

## 存量管理员迁移与发布顺序

新增 `scripts/verify-existing-admins.mjs`：

- 从运行环境读取 `DATABASE_URL` 和生产 `ADMIN_EMAILS`。
- 默认 dry-run，只输出配置管理员数量、已注册匹配数量、待更新数量，不打印邮箱、密钥或其他用户字段。
- `--apply` 时只更新 `email IN ADMIN_EMAILS AND email_verified=false` 的现有用户。
- 未匹配的管理员邮箱不自动创建账户，公开注册入口仍会保留它们，后续需通过受控方式建号。

发布顺序：

1. 用生产环境变量执行 dry-run，确认至少命中已注册管理员。
2. 执行 `--apply`，再次确认更新数量。
3. 部署强制邮箱验证代码。
4. 用管理员账户登录并验证后台访问，再验证新用户注册闭环。

回滚只需回退应用代码；管理员被标记为已验证是向前兼容且符合真实身份的数据，不需要把该字段恢复为 `false`。

## 安全与异常处理

- 验证 token 和重发凭证使用独立 purpose/audience，任何一种都不能当登录 JWT 使用。
- 验证 token 不进入 query string、服务端日志或分析系统。
- 所有新增 POST 接口调用 `rateLimit()`，满足写接口覆盖测试。
- 重发必须持有注册或正确密码登录后得到的短期凭证，避免账户枚举和邮件轰炸。
- 密码错误路径与不存在账户继续走 dummy bcrypt，响应语义不变。
- 未验证旧 session 会在下一次 `getSession()` 时失效；管理员因提前回填不被锁死。
- 服务端日志只记录错误类别和内部用户 ID，不记录 token、完整邮箱或 Resend 凭据。
- 本地及备份 `.env*` 已被 gitignore；已在终端输出中暴露过的 Resend 密钥应在本阶段完成后旋转。

## 测试设计

### 单元测试

- 验证 token：正确、篡改、过期、错误 purpose/audience、用户或邮箱不匹配、重复验证。
- 重发凭证：正确、过期、不能用于验证。
- 邮件：中英文内容、HTML 转义、fragment 链接、缺配置和 Resend 错误。
- 管理员：仅邮箱命中不足以授权，必须是已验证 session。

### Route 测试

- 注册：保留邮箱拒绝、账户重复、创建后不签会话、发送成功、发送失败可重发。
- 登录：已验证用户签会话；未验证用户即使密码正确也不签会话并返回重发凭证；错误密码不泄露状态。
- 重发：凭证校验、用户/IP 双限流、已验证用户不发、邮件失败。
- 验证：成功更新、幂等、过期/篡改/不存在账户。
- 写接口限流覆盖测试继续通过。

### 集成验证

- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src`
- `pnpm test`
- `pnpm build`
- 手工冒烟：注册 → 收信 → 点击链接 → 验证成功 → 重新登录 → 查看账户；未验证登录 → 显式重发；管理员回填后登录后台。

## 非目标

- 本阶段不实现修改登录邮箱、忘记密码、Magic Link 登录或 OAuth。
- 不把管理员身份迁移到数据库字段。
- 不复用学生邮箱认证流程。
- 不新增令牌表、后台令牌管理页或定时清理任务。

## 完成标准

- 任何 `emailVerified=false` 的账户都无法获得或继续使用正式会话。
- 未验证邮箱不能获得管理员能力、查看历史授权码或兑换邀请码。
- 新用户可以完成注册、收信、验证、重新登录的完整闭环，并能显式重发。
- 已注册管理员在强制验证上线前完成安全回填，后台访问不中断。
- 测试覆盖正常、失败、过期、重放、限流和邮件异常路径，完整 CI 通过。
