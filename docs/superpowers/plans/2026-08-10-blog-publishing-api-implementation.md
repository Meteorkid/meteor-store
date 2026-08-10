# Meteor Store 博客发布 API 实施计划

> 日期：2026-08-10
> 设计依据：`docs/superpowers/specs/2026-08-10-blog-publishing-api-design.md`

## 实施原则

- 按失败测试 → 最小实现 → 回归验证推进，安全边界和状态转换先写测试。
- 复用现有 `posts`、Markdown、R2、通知和缓存失效链路，不创建第三套内容模型。
- PAT 只形成当前用户身份，所有文章操作都带 `authorId`；管理员 PAT 绝不传 `asAdmin`。
- v1 对已发布文章只读，不改变现有网页编辑已发布文章的行为。
- Bearer 明文不进入数据库、日志、Sentry、URL、文档或长期客户端存储。
- 保留工作区现有 `AGENTS.md` 修改和其他用户文件，只对本功能需要的位置做手术式改动。
- 数据库迁移只新增表、检查约束和索引，不执行生产迁移、不部署、不写生产数据。

## Task 1：PAT 数据模型与迁移

涉及文件：

- 修改 `src/lib/db/schema.ts`
- 修改 `src/lib/db/index.ts`
- 新增下一份 `drizzle/0028_*.sql`
- 更新 `drizzle/meta/0028_snapshot.json`
- 更新 `drizzle/meta/_journal.json`

步骤：

1. 在 schema 中新增 `personalAccessTokens`，包含设计稿确定的字段、1–10 活跃槽位、检查约束和索引，不加外键。
2. `scopes` 使用 PostgreSQL `text[]`，时间字段继续沿用项目的 UTC ISO text 约定。
3. 把表加入 Drizzle schema 注册，保证查询类型可用。
4. 运行 `pnpm db:generate` 生成迁移，不手写 snapshot 或 journal。
5. 人工检查 SQL 只包含新建表、槽位检查约束、唯一索引和用户列表索引，无 DROP、ALTER 现有表或数据回填。
6. 运行 `pnpm exec drizzle-kit check`（若当前 drizzle-kit 版本支持）和 TypeScript 检查。

## Task 2：个人访问令牌服务

涉及文件：

- 新增 `src/lib/personal-access-tokens.ts`
- 新增 `src/lib/__tests__/personal-access-tokens.test.ts`

步骤：

1. 先写 scope 白名单、有效期白名单、状态推导和令牌格式测试。
2. 写创建测试：使用 32 字节随机值，返回 `msb_` 前缀明文，插入值只有 SHA-256 和展示前缀。
3. 写列表测试：只选择非敏感元数据，按创建时间倒序，不出现 `tokenHash`。
4. 写活跃令牌槽位测试：释放失效槽位，以 `generate_series(1,10)` 分配空槽，并由唯一索引处理并发冲突；禁止“先 count 再 insert”。
5. 写撤销测试：条件包含 `id + userId`，重复撤销幂等，跨用户不能命中。
6. 写最近使用时间测试：一小时内不重复写，超过一小时才条件更新。
7. 实现 `generate/create/list/revoke/touch/deriveStatus`，不为一次使用做额外仓储抽象。
8. 运行定向 Vitest、TypeScript 与该文件 ESLint。

## Task 3：Bearer 鉴权、响应工具与秘密脱敏

涉及文件：

- 新增 `src/lib/blog-api-auth.ts`
- 新增 `src/lib/blog-api-response.ts`
- 新增 `src/lib/sentry-scrub.ts`
- 新增 `src/lib/__tests__/blog-api-auth.test.ts`
- 新增 `src/lib/__tests__/blog-api-response.test.ts`
- 新增 `src/lib/__tests__/sentry-scrub.test.ts`
- 修改 `sentry.server.config.ts`
- 修改 `sentry.edge.config.ts`
- 修改 `src/instrumentation-client.ts`

步骤：

1. 先写严格 Bearer 解析测试：只接受单一 `Authorization: Bearer msb_...`，不接受其他 scheme 或空值。
2. 覆盖哈希不匹配、撤销、过期、用户不存在、邮箱未验证、`tokenVersion` 变化、scope 不足和数据库异常。
3. 覆盖管理员身份动态读取 `ADMIN_EMAILS`，PAT 记录不保存管理员状态。
4. 实现鉴权主体 `{ userId, email, name, scopes, tokenId, isAdmin }`；任何数据库异常均返回无效身份。
5. 实现统一成功/错误响应辅助：稳定错误码、`no-store`、`Vary: Authorization`、`WWW-Authenticate` 和 `Retry-After`。
6. 实现大小写无关的授权头清理和 `msb_` 秘密文本替换。
7. 把 Sentry scrubber 接入 Server、Edge 和 Client 的 `beforeSend`，保留现有采样与 `sendDefaultPii: false`。
8. 运行三组定向测试和 TypeScript 检查。

## Task 4：Cookie 会话下的令牌管理 API

涉及文件：

- 新增 `src/app/api/blog/tokens/route.ts`
- 新增 `src/app/api/blog/tokens/[id]/route.ts`
- 新增 `src/app/api/blog/tokens/__tests__/route.test.ts`
- 新增 `src/app/api/blog/tokens/__tests__/revoke.test.ts`

步骤：

1. 先写 `GET` 测试：未登录 401；已登录只返回自己的非敏感元数据；响应 `no-store`。
2. 先写 `POST` 测试：同源校验、已验证会话、当前密码、名称、scope、30/90/365 天、数量上限和 fail-closed 限流。
3. 创建成功返回 201 和一次性完整令牌；后续 `GET` 结果与错误响应均不含明文或哈希。
4. 写撤销测试：同源校验、当前用户所有权、每分钟 30 次 fail-closed 限流、重复撤销幂等、跨用户 404。
5. 管理端点只接受 Cookie 会话，不接受 PAT 创建或撤销 PAT。
6. 所有写路由文件直接调用 `rateLimit()`，通过全局写接口覆盖测试。
7. 运行令牌管理路由测试、CSRF 测试和限流覆盖测试。

## Task 5：账号页令牌管理 UI 与双语文案

涉及文件：

- 新增 `src/components/BlogApiTokenManager.tsx`
- 修改 `src/app/[locale]/account/page.tsx`
- 修改 `messages/zh.json`
- 修改 `messages/en.json`

步骤：

1. 服务端账号页只在已验证用户下渲染令牌管理组件；不把密码或令牌明文作为服务端属性传递。
2. 实现名称、四项 scope、有效期和当前密码表单，默认勾选全部 scope、默认 90 天。
3. 创建成功后只在组件内存 state 显示一次明文，提供复制按钮和明确的不可恢复提示。
4. 不使用 localStorage、sessionStorage、URL 或日志保存令牌；关闭一次性面板后只能重新创建。
5. 实现令牌列表、派生状态、到期/最后使用时间和撤销操作。
6. 所有交互状态使用现有字阶、暗色卡片、可见焦点、`role=status/alert` 和中英文文案。
7. 375、768、1280px 检查表单、scope 和长前缀不溢出。

## Task 6：账户注销、数据导出与安全回归

涉及文件：

- 修改 `src/lib/account-deletion.ts`
- 修改 `src/lib/user-data-export.ts`
- 修改 `src/lib/__tests__/account-deletion.test.ts`
- 新增或更新用户数据导出测试

步骤：

1. 先补账户注销测试，断言删除用户前显式清理其 PAT。
2. 将 `personalAccessTokens` 纳入现有子数据清理 Promise，不依赖外键级联。
3. 先补数据导出测试：导出名称、前缀、scope、状态与时间元数据。
4. 明确断言导出中不存在完整令牌、`tokenHash` 和内部 `tokenVersion`。
5. 保持现有订单授权、UGC 清理、R2 清理和缓存刷新行为不变。
6. 运行账户删除、导出和认证相关回归测试。

## Task 7：共享文章校验与版本化状态操作

涉及文件：

- 新增 `src/lib/post-validation.ts`
- 修改 `src/app/api/posts/route.ts`
- 修改 `src/app/api/posts/[id]/route.ts`
- 修改 `src/lib/posts.ts`
- 新增 `src/lib/__tests__/post-validation.test.ts`
- 新增 `src/lib/__tests__/posts-versioned.test.ts`
- 更新现有 posts 路由测试

步骤：

1. 把完整创建字段和网页 PATCH 字段约束抽到共享 Zod 模块，保持现有网页错误文案和提交字段。
2. 为 v1 创建、部分修改和版本请求建立 `.strict()` Schema，拒绝未知提权字段。
3. 网页路由改为导入共享 Schema，确保现有 `submit`、`asAdmin` 服务端判定和已发布编辑行为不变。
4. 新增只读取最近 100 篇摘要的作者查询，列表不选择正文。
5. 新增按 `id + authorId` 获取单篇文章的服务函数，避免先查后在路由里做可遗漏的所有权判断。
6. 新增版本化草稿更新：只允许 `draft/rejected`，条件包含 `id + authorId + status + updatedAt`。
7. 更新成功生成新的 `updatedAt`；`rejected` 编辑后回到 `draft` 并清除审核留痕。
8. 新增版本化提交：普通用户 `draft/rejected → pending`，管理员自己的文章 `draft/rejected → published`，禁止 `asAdmin`。
9. 条件更新未命中后区分 `notFound/invalidState/versionConflict`；并发请求最多一个成功。
10. 保持标签与分区归一化；正文乐观锁与关系重建放在同一条 data-modifying CTE 中，
    任何一步失败都由 PostgreSQL 原子回滚。
11. 创建时同样用单条 data-modifying CTE 写入主表、分区和标签，避免补偿删除留下孤儿关系。
12. 现有网页 `updatePost` 保持原状态策略，但最终写入也用预读的 `status + updatedAt` 做 CAS
    （普通作者另限 `authorId`）；有关系字段时与主表更新共用单条 CTE，CAS 失败返回并发冲突。
13. 运行服务层、现有网页 posts 路由和审核状态机测试。

## Task 8：v1 分区、文章读取与草稿写入 API

涉及文件：

- 新增 `src/app/api/v1/blog/sections/route.ts`
- 新增 `src/app/api/v1/blog/posts/route.ts`
- 新增 `src/app/api/v1/blog/posts/[id]/route.ts`
- 新增 `src/app/api/v1/blog/__tests__/sections.test.ts`
- 新增 `src/app/api/v1/blog/__tests__/posts.test.ts`
- 新增 `src/app/api/v1/blog/__tests__/post-id.test.ts`

步骤：

1. 每个端点先执行每 IP 每分钟 300 次的预鉴权限流，再执行 Bearer 鉴权和用户总量业务限流。
2. `GET /sections` 返回双语分区元数据和字段约束，要求 `blog:read`。
3. `GET /posts` 返回当前用户最近更新的 100 篇摘要，不含正文。
4. `GET /posts/{id}` 返回当前用户完整 Markdown、状态、`updatedAt` 和预览地址。
5. `POST /posts` 要求 `blog:write`，固定创建 `draft`，严格拒绝 `authorId/status/asAdmin/adminPublish/submit`。
6. `PATCH /posts/{id}` 要求 `blog:write + expectedUpdatedAt`，只更新自己的 `draft/rejected`。
7. 所有写操作只返回 `id/status/updatedAt/previewUrls`；完整正文必须另持 `blog:read` 调用 GET，scope 不隐式包含。
8. 跨用户或不存在统一 `404 post_not_found`；已发布或待审核统一 `409 invalid_state`；旧版本返回 `409 version_conflict`。
9. 私有响应统一带 `no-store` 与 `Vary: Authorization`。
10. 覆盖所有 scope、所有权、严格字段和响应头测试。

## Task 9：显式提交、撤回与公开缓存

涉及文件：

- 新增 `src/app/api/v1/blog/posts/[id]/submit/route.ts`
- 新增 `src/app/api/v1/blog/posts/[id]/withdraw/route.ts`
- 新增对应 v1 route 测试
- 修改 `src/app/api/posts/review/route.ts`
- 更新现有审核路由测试

步骤：

1. `submit` 只接受 `expectedUpdatedAt`，要求 `blog:submit`，使用版本化原子状态操作。
2. 普通用户成功进入 `pending` 并发送现有管理员通知；失败的并发或状态请求不发重复通知。
3. 管理员只对自己的文章获得 `published`，设置发布时间并调用 `revalidatePublishedPaths()`；
   缓存失效异常独立记录，不能把已成功发布伪装成 500。
4. 验证请求体任何管理员字段均被严格拒绝，路由从不传 `asAdmin`。
5. `withdraw` 要求 `blog:submit`，复用 `id + authorId + pending` 条件更新并清审核留痕。
6. 审核路由通过时统一调用 `revalidatePublishedPaths()`，删除只刷新主分区的手写逻辑。
7. 覆盖普通/管理员状态、通知、跨用户、并发 409、撤回和全部缓存路径回归。

## Task 10：预览与图片上传 API

涉及文件：

- 新增 `src/app/api/v1/blog/posts/[id]/preview/route.ts`
- 新增 `src/app/api/v1/blog/images/route.ts`
- 新增对应 v1 route 测试

步骤：

1. 预览要求 `blog:read` 和文章所有权，读取已保存正文并复用 `markdownToHtml`。
2. 返回 sanitize 后 HTML、`updatedAt` 和中英文浏览器预览地址；PAT 永不进入 URL。
3. 图片上传要求 `blog:image`，继续接受 `multipart/form-data` 的 `file`。
4. 复用 `uploadBlogImage` 和当前 R2 key；在解析 multipart 前限制总字节数，并用 Sharp
   核对 WebP/JPEG/PNG/GIF 真实格式、5MB/4000 万像素上限；R2 未配置或上传不可用返回 503。
5. 精确映射 413、415、503 和内部 500，不返回 R2 配置或底层异常。
6. 运行现有 Markdown XSS 测试、预览一致性测试和图片边界测试。

## Task 11：OpenAPI 与代理调用指南

涉及文件：

- 新增 `src/lib/blog-api-openapi.ts`
- 新增 `src/app/api/v1/blog/openapi.json/route.ts`
- 新增 OpenAPI 合约测试
- 新增 `docs/blog-publishing-api.md`

步骤：

1. 定义 OpenAPI 3.1 文档、Bearer security scheme、四项 scope、全部端点和稳定错误结构。
2. OpenAPI 示例只使用占位环境变量，不出现任何看似真实的秘密。
3. 测试文档端点公开可读、版本正确、列出的路径与实际 v1 route 文件一致。
4. 编写 `METEOR_BLOG_TOKEN` 安全设置、获取分区、创建、读取、修改、预览、图片和提交的完整 `curl` 流程。
5. 说明普通用户和管理员状态差异，以及 401/403/409/429 的恢复方式。
6. 明确已发布文章 API 只读、令牌不得写入仓库/`AGENTS.md`/提示词文件。

## Task 12：项目约定、完整验证与交付

涉及文件：

- 手术式更新 `AGENTS.md` 的博客发布 API 不变量（保留用户现有修改）
- 按模板新增 Obsidian 项目总结

步骤：

1. 运行所有新增定向测试和受影响的 auth/posts/markdown/account 测试。
2. 运行 `pnpm exec tsc --noEmit`。
3. 运行 `pnpm exec eslint src`，要求 0 error。
4. 运行 `pnpm test`。
5. 运行 `pnpm build`；说明 `.next` 已被覆盖，现有 dev server 需要重启。
6. 运行 `git diff --check`，搜索 `msb_`、`Authorization`、`tokenHash`，逐项确认无明文秘密、日志或错误泄漏。
7. 检查生成迁移没有破坏性 SQL；不在本任务中执行生产 `db:migrate` 或部署。
8. 手动走通：创建令牌 → 建草稿 → 修改 → 预览 → 普通提交；再验证管理员自己的直发。
9. 手动验证撤销、改密、scope 不足、跨用户访问和并发冲突。
10. 在 375、768、1280px 与中英文账号页检查令牌管理 UI。
11. 更新 `AGENTS.md` 时先审查其现有 diff，仅追加本功能约束，不覆盖已有内容。
12. 根据 Obsidian `模板/` 对应模板写入 `/Users/meteor/obsidian/项目总结/2026-08-10-Meteor-Store.md`。
13. 报告改动、验证、迁移上线顺序和已知限制，再询问是否 commit；不自动 push 或部署。

## 验收清单

- [x] 已验证用户可创建最多 10 枚、30/90/365 天有效、可分 scope 的 PAT。
- [x] 完整 PAT 只显示一次，数据库、列表、导出、日志与 Sentry 都不包含明文。
- [x] 撤销、改密、重置密码、取消验证或注销后旧 PAT 立即失效。
- [x] Claude Code/Codex 可通过 REST 完成建草稿、读取、修改、预览和显式提交。
- [x] 普通用户提交后进入审核，管理员只能直发自己的文章。
- [x] PAT 不能访问其他用户文章、后台、账户、订单或令牌管理能力。
- [x] 待审核和已发布文章不能通过 v1 修改；现有网页编辑行为不变。
- [x] 并发修改或提交不会静默覆盖，过旧版本返回 `version_conflict`。
- [x] 图片、Markdown、通知、分区、标签、RSS 和 sitemap 沿用现有链路。
- [x] OpenAPI 与调用指南足以让通用编码代理独立完成发布流程。
- [x] TypeScript、ESLint、Vitest 与生产构建全部通过。
