# Meteor Store 博客图片配额设计

> 日期：2026-08-10  
> 状态：已确认，进入实施

## 背景

博客网页投稿和 `/api/v1/blog/images` 都允许已验证用户把图片上传到 Cloudflare R2。
现有实现有单图 5,000,000 字节、4000 万像素和每用户每分钟 10 次的限制，但数据库不记录
图片对象或累计用量。用户可以长期累积对象；两条入口的限流 key 也不同，无法形成账户级硬上限。

生产环境是单台 2 GB 内存服务器。R2 承担持久存储，服务器只处理请求体、Sharp 元数据校验和
R2 转发，因此账户总配额不占服务器磁盘；上线风险主要来自跨账户并发上传造成的瞬时内存与
CPU 压力。

## 目标

- 普通已验证用户最多占用 200 MiB 博客图片空间。
- 当前管理员最多占用 1 GiB；管理员身份继续从服务端会话或 PAT actor 动态计算。
- 同一用户重复上传相同字节时复用对象，不重复计费。
- 两条上传入口共享同一套配额、账户限流、全站限流和并发门控。
- 并发上传不能突破配额；R2 或进程失败不能永久造成无法解释的账实漂移。
- 兼容已有 `blog/{userId}/...` 对象，并提供默认 dry-run、可重复执行的回填与对账工具。
- 迁移和应用均可安全回滚，不删除已有图片。

## 非目标

- 首版不提供单图删除接口。图片 URL 可能已写入 Markdown，允许用户直接删除会制造历史文章裂图。
- 不追踪图片被哪篇文章引用，也不自动判断孤儿图片。
- 不把图片二进制写入 PostgreSQL、仓库或应用服务器磁盘。
- 不为不同套餐设计更多配额档位。

## 固定限制

| 项目 | 限制 |
|---|---:|
| 普通用户总配额 | 209,715,200 字节（200 MiB） |
| 管理员总配额 | 1,073,741,824 字节（1 GiB） |
| 单图上限 | 5,000,000 字节 |
| 单图像素上限 | 40,000,000 像素 |
| 每用户上传 | 10 次/分钟，两条入口共用同一 key |
| 全站上传 | 30 次/分钟，两条入口共用同一 key |
| 单进程并发 | 4 个正在处理的上传 |

管理员降级为普通用户后立即按 200 MiB 判断。已有图片不会删除；若当前用量超过新额度，后续
上传被拒绝，直至管理员协助清理或恢复管理员资格。

## 数据模型

### `users.blog_image_bytes`

在 `users` 增加非空、默认 0 的 `blog_image_bytes`，使用 PostgreSQL `bigint` 并约束为非负。
它是并发配额判断使用的账户计数器；使用 `bigint` 是为了允许回填意外超过当前配额的存量账户，
而不是暗中截断或删除其对象。

### `blog_images`

新增图片账本：

| 字段 | 说明 |
|---|---|
| `id` | 随机 reservation id，主键 |
| `user_id` | 对象所属账户，不加外键以匹配项目现有表约定 |
| `object_key` | R2 key，全局唯一 |
| `size_bytes` | 原始对象字节数，1–5,000,000 |
| `status` | `allocating`、`reserved` 或 `ready` |
| `created_at` | 首次登记时间 |
| `updated_at` | 状态更新时间，用于识别超时预占 |
| `uploaded_at` | R2 写入确认时间；未确认时为空 |

索引包括 `object_key` 唯一索引、`user_id` 索引，以及供修复脚本扫描的
`status + updated_at` 索引。数据库检查约束固定合法状态和字节范围。

三种状态的含义：

- `allocating`：已赢得相同对象 key 的唯一创建权，但尚未占用账户字节。
- `reserved`：账户字节已原子增加，R2 写入尚未确认。
- `ready`：R2 对象已确认可用，正常计入账户用量。

`allocating` 不计入 `blog_image_bytes`；`reserved` 和 `ready` 都计入。这样进程在任何一步退出都
会 fail closed，最多暂时少一部分可用空间，不会放宽配额。

## 上传数据流

所有配额与存储操作收敛到共享服务，Cookie 路由和 PAT 路由只负责各自鉴权与响应格式。

1. 完成鉴权后，依次检查统一的账户 10 次/分钟与全站 30 次/分钟限流。
2. 在读取 multipart 请求体前尝试占用进程级上传槽位；4 个槽位都在使用时立即返回 429。
3. 延续现有流式请求体字节上限、MIME 白名单和 Sharp 实际格式/像素校验。
4. 对原始字节计算完整 SHA-256，同时得到新的 64 位哈希 key 和现有算法使用的 16 位短哈希
   legacy key。新对象只使用 `blog/{encodeURIComponent(userId)}/{64位哈希}.{ext}`；已有短哈希
   URL 不改名。
5. 先检查完整 key，再检查 legacy key。如果任一账本行已是 `ready`，直接返回其原 URL 和当前
   用量，不再写 R2 或增加计数。这样回填后的历史图片重复上传也不会额外占用空间。
6. 若不存在，先以 `INSERT ... ON CONFLICT DO NOTHING` 创建唯一 `allocating` 行；并发请求只有
   一个能获得 reservation，其余根据最新状态返回复用结果或 `image_upload_in_progress`。
7. 用单条 data-modifying CTE 原子完成：
   - 确认 reservation 仍属于当前用户且是 `allocating`；
   - 条件更新 `users.blog_image_bytes += size`，要求新值不超过服务端计算的当前额度；
   - 把对应账本行改为 `reserved`。
8. 额度不足时删除未计费的 `allocating` 行并返回配额错误。
9. 把对象写入 R2；成功后按 `id + userId + status='reserved'` 条件更新为 `ready`。
10. R2 正常失败时用一条 CTE 删除本 reservation，并按其 `RETURNING size_bytes` 原子扣回用户
    计数。补偿失败只记录不含凭据的错误，留给对账流程处理。
11. 无论成功或失败，都在 `finally` 中释放进程上传槽位。

先创建唯一 `allocating` 行再扣账户计数，可同时解决两个并发问题：相同图片不会重复计费；不同
图片通过对同一用户计数行的条件 UPDATE 串行化，不能一起越过额度。不得改回 `SUM → INSERT`
或 `R2 LIST → PUT` 的先查后写流程。

## 失败恢复与对账

数据库和 R2 不能组成同一事务，允许存在两种可恢复窗口：

- `reserved` 但 R2 不存在：进程在 PUT 前退出，或 PUT 失败后的释放没有完成。
- `reserved` 且 R2 已存在：PUT 成功后、标记 `ready` 前退出。

提供 `scripts/reconcile-blog-images.mjs`，默认只读 dry-run，显式 `--apply` 才写数据库。脚本：

- 分页扫描 R2 `blog/` 前缀，解析 URL 编码后的用户 id、对象 key 和 Size；16 位历史哈希与
  64 位新哈希都视为合法对象。
- 报告总对象数、总字节、按用户用量、未知用户、异常 key 和 DB/R2 差异；不输出任何 R2 凭据。
- 回填已有对象为 `ready`，并从账本汇总校准 `users.blog_image_bytes`；按 `object_key` upsert，重复
  执行不重复累计。
- 对超时 `allocating` 行直接释放；对超时 `reserved` 行执行 R2 HEAD，存在则改为 `ready`，
  不存在则删除 reservation 并原子扣回计数。
- 对 R2 中属于已删除/未知用户的对象只报告，不自动删除。

dry-run 只执行 R2 LIST / HEAD 和数据库读取，可在线运行，但在线结果只是时点快照。
`--apply` 会先分步回填和修复账本，再以账本总和重算 `users.blog_image_bytes`；
如果这个窗口内仍有上传请求预占字节，最终 recalibrate 可能用另一个快照覆盖并发计数。
因此从 `--apply` 开始到 recalibrate 结束必须停止 PM2，或在反向代理/维护模式中冻结
Cookie 与 PAT 两个图片上传入口。不得在上传仍可达时运行 `--apply`。

应用上传路径遇到同 key 的超时 reservation 时也可执行相同的单对象 HEAD 修复，避免用户必须
等待人工运行全量脚本；全量脚本仍作为上线回填和运维对账工具。

## 服务器保护

- 两条路由统一使用 `blog-image-upload:user:{userId}`，避免交叉调用绕过每用户限制。
- 全站固定 key 在鉴权成功后计数，避免匿名请求耗尽全站额度。
- Redis 已配置但请求异常时 fail closed；Redis 未配置时退化为现有单进程内存限流。
- 并发计数放在 `globalThis` 级状态中，覆盖同一 Node 进程内两个 Route Handler，并通过幂等
  release 函数和 `finally` 防止槽位泄漏。
- 该 4 并发限制是“每进程”而不是全分布式集群限制。当前生产是单服务器单应用进程，符合目标；
  将来启用 PM2 cluster 或水平扩容时，每个进程各有 4 个槽位，全站 30 次/分钟仍由 Redis 共享。

## API 合约

### 成功

网页和 v1 成功结果都增加同形 quota 元数据，现有调用方可忽略新增字段：

```json
{
  "url": "https://images.example/blog/user/hash.webp",
  "quota": {
    "usedBytes": 5242880,
    "limitBytes": 209715200,
    "remainingBytes": 204472320
  }
}
```

### 错误

| HTTP | v1 `error.code` | 场景 |
|---:|---|---|
| 413 | `storage_quota_exceeded` | 本次唯一图片会超过账户总配额 |
| 409 | `image_upload_in_progress` | 相同对象 key 正在由另一请求上传 |
| 429 | `rate_limited` | 账户或全站分钟限流 |
| 429 | `upload_busy` | 当前进程 4 个上传槽位已满 |
| 503 | `storage_unavailable` | R2 或配额持久化暂不可用 |

413 详情包含 `usedBytes`、`limitBytes`、`requestedBytes`；409/429 响应带可用的
`Retry-After`。网页路由返回对应中文错误、稳定 `code` 和 quota 详情。底层数据库、R2 endpoint、
bucket 名与凭据不进入响应。

## 账户数据与安全

- 注销账户时，在删除 `users` 前删除该用户的 `blog_images` 账本；R2 前缀删除继续保持现有
  best-effort 行为，失败对象留给孤儿清理。
- 数据导出新增博客图片数量、当前用量、当前额度及对象 key/大小/状态元数据，不导出二进制。
- 额度由服务端依据当前管理员身份决定，客户端不能传额度或管理员标志。
- PAT 只允许已有 `blog:image` scope 调用；新增 quota 元数据不泄漏文章正文或其他 scope 数据。
- 日志和 Sentry 继续经过现有令牌脱敏，不记录 Authorization 或完整 PAT。

## 迁移与部署

生成独立 `0029` 迁移。生产上线顺序固定为：

1. 停止 PM2（或以等效方式冻结全部图片上传），并确认当前线上 `.next` 已保留为应用回滚点。
2. 在停写状态下确认生产数据库备份/Neon 恢复点可用。
3. 先执行 `0028`（PAT），确认成功后再执行 `0029`（图片账本/计数），不得交换顺序。
4. 运行 R2 回填脚本 dry-run，人工核对对象数、字节数、未知用户、异常 key 和 DB/R2 差异。
5. 明确确认后运行 `node scripts/reconcile-blog-images.mjs --apply`；PM2/上传必须继续保持停止，
   直到脚本最终 recalibrate 成功结束。
6. 立即二次 dry-run，确认 DB/R2 汇总一致，且没有未解释的 unknown/malformed/差异。
7. 部署包含博客发布 API 和配额的新应用构建。
8. restart PM2，再验证健康检查、OpenAPI、PAT 创建、Cookie/PAT 草稿上传与 quota 返回。

如果 `--apply` 或二次 dry-run 失败，保持 PM2/上传停止，不得继续部署。保留脱敏日志，排除问题后
从 dry-run 重新核对；回填按 `object_key` 幂等，可在同一停写窗口内重试 `--apply`。

数据库迁移只新增表、列、索引和检查约束，是 additive 变更。若新应用部署或验证失败，
恢复上一份 `.next` 并 restart PM2，保留新增数据库结构；不要在紧急回滚时 DROP 表或列。
旧应用可忽略这些结构并恢复原有站点，但不提供新 PAT 管理/v1 API，因此 PAT 功能在回滚期间不可用。
旧应用也不维护新图片账本；若回滚期间放开图片上传，下次尝试上线前必须在停写状态下重新执行
dry-run → `--apply` → 二次 dry-run。

## 测试与验收

- 服务层：额度边界、管理员额度、不同图片并发、同图并发、重复 ready 复用、R2 失败释放、
  stale reservation 两种 HEAD 结果、计数永不为负。
- 路由：Cookie 与 PAT 共用用户/全站限流，4 并发门控在解析 body 前执行，所有 `finally` 路径
  释放槽位，413/409/429/503 合约一致。
- 安全：跨用户不能复用/读取账本；客户端额度或管理员字段无效；错误不泄漏存储配置。
- 数据：账户注销清理账本，数据导出不含二进制，回填脚本默认 dry-run 且重复运行幂等。
- 合约：更新 OpenAPI、`docs/blog-publishing-api.md` 和 `AGENTS.md` 不变量。
- 回归：运行博客图片、PAT、账户、迁移日志、限流覆盖、Markdown XSS 测试，以及完整
  `pnpm test`、`pnpm exec tsc --noEmit`、ESLint、`pnpm build`、Drizzle check/generate。

验收标准：并发测试中账户用量从不超过服务端额度；同一图片只占一次空间；任何可模拟失败都不
会静默放宽配额；2 GB 单进程服务器同时最多处理 4 个图片请求；生产回填前后 R2 与数据库汇总
一致。
