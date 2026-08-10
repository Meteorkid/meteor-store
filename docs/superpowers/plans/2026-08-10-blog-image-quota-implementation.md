# Meteor Store 博客图片配额实施计划

> 日期：2026-08-10  
> 设计依据：`docs/superpowers/specs/2026-08-10-blog-image-quota-design.md`

## 实施原则

- 按失败测试 → 最小实现 → 回归验证推进；并发配额、补偿与失败恢复先写测试。
- Cookie 与 PAT 图片入口必须共用同一配额服务、限流 key 和进程并发门控。
- 配额硬边界由 PostgreSQL 账本与账户计数器保证，不能依赖 R2 LIST、Redis 或应用内 SUM。
- R2 与数据库不能组成事务，所有中间状态必须 fail closed、可识别、可重试、可对账。
- 只增加 `0029` 表/列/约束/索引；生产迁移、回填、提交、push 和部署都在用户最终确认后执行。
- 在线只允许运行对账 dry-run；`--apply` 到最终 recalibrate 期间必须停 PM2 或冻结两个上传入口。
- 保留工作区已有博客发布 API 和其他用户改动，不覆盖、不重置、不顺手重构。

## Task 1：图片账本数据模型与 0029 迁移

涉及文件：

- 修改 `src/lib/db/schema.ts`
- 修改 `src/lib/db/index.ts`
- 新增 `drizzle/0029_*.sql`
- 新增 `drizzle/meta/0029_snapshot.json`
- 更新 `drizzle/meta/_journal.json`

步骤：

1. 为 `users` 增加 `blogImageBytes` bigint、默认 0、非空和非负检查。
2. 新增 `blogImages`，包含 reservation、对象 key、字节数、三态状态和时间字段，不加外键。
3. 增加对象 key 唯一索引、用户索引、状态/更新时间索引，以及 status/size 检查约束。
4. 先补 schema/迁移约束测试，再运行 `pnpm db:generate` 生成 0029，不手写 snapshot。
5. 检查迁移只做 ADD/CREATE，不删除或重写已有数据；运行 Drizzle check。

## Task 2：配额服务与原子 reservation 状态机

涉及文件：

- 新增 `src/lib/blog-image-quota.ts`
- 新增 `src/lib/__tests__/blog-image-quota.test.ts`
- 修改 `src/lib/blog-image-storage.ts`
- 更新 `src/lib/__tests__/blog-image-storage.test.ts`

步骤：

1. 定义普通 200 MiB、管理员 1 GiB、5,000,000 字节单图上限与 quota 结果类型。
2. 写完整 SHA-256 key、legacy 16 位 key 和同图 ready 复用测试。
3. 写唯一 `allocating` reservation 测试，断言相同 key 并发只有一个请求获得创建权。
4. 写原子额度占用测试：不同 key 并发对同一用户计数条件更新，任何结果都不超过额度。
5. 写额度不足测试：删除未计费 allocating，返回 used/limit/requested，不写 R2。
6. 写 R2 成功确认、失败原子释放、补偿失败 fail-closed 和计数不为负测试。
7. 写 stale allocating/reserved 修复测试：HEAD 存在转 ready，不存在释放。
8. 将 `uploadBlogImage` 收敛为“解析 key → reserve/reuse → PUT → confirm/release”，让两条入口自动共享。
9. 所有原子多表操作使用参数化 data-modifying CTE，不使用 Neon HTTP 不支持的跨请求事务。

## Task 3：共享上传限流与单进程并发门控

涉及文件：

- 新增 `src/lib/blog-image-upload-guard.ts`
- 新增 `src/lib/__tests__/blog-image-upload-guard.test.ts`

步骤：

1. 统一账户 key 为 `blog-image-upload:user:{userId}`，10 次/分钟。
2. 增加鉴权后才消费的固定全站 key，30 次/分钟。
3. 两项限流均在 Redis 异常时 fail closed、未配置 Redis 时 fallback memory。
4. 用 `globalThis` 保存每进程最多 4 个活动槽位，返回幂等 release 函数。
5. 覆盖第 5 个请求拒绝、释放后恢复、重复 release、异常 finally 和两入口共享状态测试。

## Task 4：Cookie 与 v1 图片路由合约

涉及文件：

- 修改 `src/app/api/blog/upload-image/route.ts`
- 修改 `src/app/api/v1/blog/images/route.ts`
- 新增/更新对应 route 测试
- 修改 `src/lib/blog-api-openapi.ts`
- 更新 `src/lib/__tests__/blog-api-docs.test.ts`

步骤：

1. 保留各自鉴权；鉴权成功后调用共享账户/全站限流，再在读取 body 前抢占并发槽位。
2. 所有解析、格式校验、quota/R2 调用都放在 `try/finally` 内释放槽位。
3. 成功响应增加 `quota.usedBytes/limitBytes/remainingBytes`，保持现有 `url` 字段兼容。
4. v1 映射 413 `storage_quota_exceeded`、409 `image_upload_in_progress`、429
   `rate_limited/upload_busy`、503 `storage_unavailable`，并返回适用的 `Retry-After`。
5. Cookie 路由返回对应稳定 code、中文错误和 quota 详情，不泄漏底层错误。
6. 覆盖额度边界、管理员额度、同图复用、R2 失败、全站/用户限流、并发槽位在 body 前拒绝。
7. 更新 OpenAPI schema、响应示例和错误合约测试。

## Task 5：R2 回填与 reservation 对账脚本

涉及文件：

- 新增 `scripts/reconcile-blog-images.mjs`
- 新增脚本单元测试或抽出可测试纯函数模块

步骤：

1. 默认 dry-run；只有显式 `--apply` 才允许数据库写入，绝不自动删除 R2 对象。
2. 分页 LIST `blog/`，解析 URL 编码 userId、16/64 位哈希 key 与 Size。
3. 汇总并输出对象数、总字节、按用户用量、未知用户、异常 key、DB/R2 差异，不输出凭据。
4. apply 模式按 objectKey 幂等回填 ready 行，并从账本重新校准用户计数。
5. 修复超时 allocating；对超时 reserved 做 HEAD，存在转 ready，不存在原子释放。
6. 为参数解析、key 解析、幂等计划、未知用户和异常对象补测试。
7. 在部署文档中固定“停 PM2/冻结上传 → dry-run → apply → 再 dry-run”的操作顺序；
   说明单独 dry-run 可在线，而 `--apply` 与最终 recalibrate 绝不能与上传并发。

## Task 6：账户数据、文档与项目不变量

涉及文件：

- 修改 `src/lib/account-deletion.ts`
- 修改 `src/lib/user-data-export.ts`
- 更新对应测试
- 修改 `docs/blog-publishing-api.md`
- 修改 `AGENTS.md`
- 更新 Obsidian 项目总结

步骤：

1. 注销时在 users 之前显式删除 blogImages；保留现有 R2 best-effort 前缀清理。
2. 数据导出增加图片数量、用量、当前额度及非二进制账本元数据。
3. 指南说明额度、成功 quota 字段、错误恢复、无删除接口和重复图片复用。
4. 手术式追加 schema、原子预占、回填顺序和服务器门控不变量，不覆盖现有 AGENTS 修改。
5. 更新 Obsidian 总结的设计理由、账实窗口、验证和上线顺序。

## Task 7：全量验证与上线前只读核对

步骤：

1. 运行新增和受影响的 quota/storage/routes/account/migration/OpenAPI 测试。
2. 运行 `pnpm test`、`pnpm exec tsc --noEmit`、ESLint、`pnpm build`。
3. 运行 `pnpm exec drizzle-kit check` 与 `pnpm db:generate`，确认无 schema 漂移。
4. 运行 `git diff --check`、PAT 明文/Authorization 日志扫描、0028/0029 破坏性 SQL 扫描。
5. 核对生产目标、当前分支、origin 差异、Neon 数据库身份、R2 bucket、Redis、服务器与回滚构建，
   只输出脱敏结果。
6. 向用户报告精确迁移/回填/部署命令、影响范围与回滚点，并请求最终生产写入确认。
7. 未获最终确认前，不执行 `db:migrate`、回填 `--apply`、commit、push、SSH 或 PM2 操作。

## 生产执行顺序与回滚

1. 停止 PM2 或以等效方式冻结 Cookie/PAT 图片上传，并确认当前 `.next` 构建已保留。
2. 在停写状态下确认数据库备份或 Neon 恢复点可用。
3. 先执行 `0028`，确认成功后再执行 `0029`。
4. 运行 `node scripts/reconcile-blog-images.mjs` dry-run 并人工核对。
5. 明确确认后运行 `node scripts/reconcile-blog-images.mjs --apply`；在脚本最终 recalibrate 结束前不得恢复上传。
6. 立即二次 dry-run，确认 DB/R2 差异符合预期。
7. 部署新应用，restart PM2，执行健康检查、OpenAPI、PAT 创建和 Cookie/PAT 图片上传验收。

`--apply` 或二次 dry-run 失败时，保持 PM2/上传停止，不部署、不 restart；排除问题后从 dry-run 重新核对，
并利用按 `object_key` 幂等的回填逻辑安全重试 `--apply`。

`0028` 和 `0029` 都是只增表/列/索引/约束的 additive 迁移。新应用失败时可恢复上一份
`.next` 并 restart PM2，保留新数据库结构，不执行紧急 DROP。旧应用可运行，但 PAT 管理与
v1 博客 API 不可用。若回滚期间旧应用又写入新的 R2 博客图片，下次发布前必须重新执行停写对账流程。

## 验收清单

- [ ] 普通用户 200 MiB、管理员 1 GiB，额度只由服务端身份决定。
- [ ] 同一用户相同图片复用 ready URL，不重复计费或 PUT。
- [ ] 不同图片并发时账户计数永不超过额度。
- [ ] R2/进程失败只会 fail closed，并可通过 lazy repair 或脚本恢复。
- [ ] Cookie 与 PAT 入口共享每用户 10/min、全站 30/min 和单进程 4 并发。
- [ ] 请求体读取前即可拒绝第 5 个并发上传。
- [ ] 现有短哈希对象可回填和复用，新对象使用完整 SHA-256。
- [ ] 回填脚本默认 dry-run、apply 幂等、不删除未知对象、不输出秘密。
- [ ] 生产 `--apply` 与最终 recalibrate 全程停 PM2/冻结上传，dry-run → apply → 二次 dry-run 在同一停写窗口完成。
- [ ] 注销、数据导出、OpenAPI、调用指南和项目约束同步更新。
- [ ] TypeScript、ESLint、Vitest、生产构建、Drizzle 与安全扫描全部通过。
