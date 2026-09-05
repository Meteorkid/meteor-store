# Pathfinder 聚合运行手册

## 变更范围

Pathfinder 本身由迁移 `0037_glossy_grey_gargoyle.sql` 与 `0039_pathfinder_catalog_contract.sql` 创建和扩展：

- `pathfinder_sources`
- `pathfinder_items`
- `pathfinder_item_tags`
- 对应唯一约束、检查约束和查询索引
- 多方向、双语事实字段、原币费用、日期级截止与人工资格核验标记

当前迁移序列中间还包含 `0038_add_orders_plan_id.sql`。它会为现有 `orders` 表增加可空的 `plan_id`，并回填能确定套餐的 Tollow 订单；这不是 Pathfinder 变更。运行全量迁移前必须单独评估该影响，不能把 `pnpm db:migrate` 描述为完全不触碰现有业务数据。

公开页面通常可在数据库不可用时回退到仓库内 50 条静态可信种子；静态紧急下架记录另存 Upstash Redis。生产环境若数据库和 Redis 同时不可用会安全关闭目录，而不是让已下架内容复活。同步和后台审核依赖新表，因此迁移前调用会明确失败。

## 上线步骤

1. 在 Neon 创建恢复点或确认最近备份可用。
2. 停止 Pathfinder 定时同步；其他站点功能可继续运行。
3. 使用生产 `DATABASE_URL` 执行 `pnpm db:migrate`，确认 `0037`、`0038` 和 `0039` 依次成功。
4. 部署新应用并完成 `/zh/pathfinder`、`/en/pathfinder` 的静态种子冒烟检查。
5. 确认 Upstash Redis 的可写连接变量已配置；支持标准 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`，也兼容项目现有的 `UPSTASH_REDIS_KV_REST_API_URL` / `UPSTASH_REDIS_KV_REST_API_TOKEN`。它同时承担跨实例限流和静态下架保护。
6. 配置至少 32 字节随机值 `PATHFINDER_CRON_SECRET`；服务端会拒绝更短的误配置。
7. 可选配置只读 `GITHUB_TOKEN`，提高 GitHub Search API 额度；不要授予写权限。
8. 手动调用一次 `POST /api/cron/pathfinder-sync`，先在请求体中只传一个官方 RSS 来源：

   ```json
   { "sourceIds": ["openai-news"] }
   ```

   不要只检查 HTTP 200；响应中应明确包含 `openai-news` 的同步结果，并核对抓取、插入、更新、跳过和错误计数。

9. 在 `/zh/admin/pathfinder` 核对来源状态和待审条目，再启用完整定时任务。
10. 服务器 crontab 每小时调用一次受版本控制的包装脚本；密钥只由 Node 从权限为 `600` 的环境文件读取，不出现在 crontab 或进程参数中：

    ```cron
    27 * * * * /usr/bin/flock -n /run/lock/meteor-pathfinder-sync.lock /usr/bin/node --env-file=/var/www/meteor-store/.env.production /var/www/meteor-store/scripts/pathfinder-sync-cron.mjs 2>&1 | /usr/bin/logger -t meteor-pathfinder-sync
    ```

    包装脚本同时检查 HTTP 状态与响应中的 `success`，并只记录来源和数量摘要。接口内部串行处理来源、使用条件请求，并限制每个来源最多 30 条；全部来源失败返回 503，部分失败返回 200 但包装脚本仍以非零状态结束。

11. 截止提醒按天调用一次，同样走受版本控制的包装脚本。**必须在部署带有
    `/api/cron/pathfinder-deadlines` 的应用之后再加**，否则每天只会打出 404：

    ```cron
    17 9 * * * /usr/bin/flock -n /run/lock/meteor-pathfinder-deadlines.lock /usr/bin/node --env-file=/var/www/meteor-store/.env.production /var/www/meteor-store/scripts/pathfinder-deadlines-cron.mjs 2>&1 | /usr/bin/logger -t meteor-pathfinder-deadlines
    ```

    与同步任务共用 `PATHFINDER_CRON_SECRET`：两者是同一台调度器上的 Pathfinder
    维护任务，再拆一个密钥只会多一个要轮换的东西。选每天上午发是因为提醒的是
    「还剩几天」这类需要当天安排时间的事，深夜送达等于让人第二天在一堆通知里翻。

    幂等由 `pathfinder_deadline_reminders` 的 `(user_id, item_id, deadline)`
    唯一索引保证，同一个截止时间只发一次；官方改期后 deadline 变化才会再发一次。
    接口先占位再发信，发信失败会撤回占位交给下一轮重试——所以摘要里的 `skipped`
    同时包含「已提醒过」和「失败待重试」，持续偏高说明发信通道有问题。

    首次配置后可先手动跑一次确认连通：

    ```bash
    /usr/bin/node --env-file=/var/www/meteor-store/.env.production /var/www/meteor-store/scripts/pathfinder-deadlines-cron.mjs
    ```

## AI 动态解读（DeepSeek 起草 + 人工确认）

详情页的「这条动态对你意味着什么」由 DeepSeek 依据条目自身的来源材料起草，
**必须逐条人工确认后才会公开**。审核台在 `/zh/admin/pathfinder` 页面底部。

**为什么不是 Claude**：生产服务器在阿里云（深圳出口，AS37963），实测
`api.anthropic.com` 对该 IP 返回 `forbidden: Request not allowed`——
用无效 key 请求也拿不到 `authentication_error`，说明请求在鉴权前就被按来源拒绝。
同一个无效 key 从境内开发机请求则正常返回 `authentication_error`。
换 DeepSeek 后服务器直连、延迟更低、成本低一到两个数量级。

- 需要在 `.env.production` 配置 `DEEPSEEK_API_KEY`；未配置时后台显示「未启用」，
  已确认的解读仍正常展示，不会报错
- 模型 `deepseek-v4-flash`（不是 pro）：材料只有标题加一段摘要、字段也写死成四个，
  属于按给定材料改写，不是需要推理的任务
- **思考模式显式关掉**（`thinking: {type: 'disabled'}`）。DeepSeek 默认开启思考，
  且思考 token 按输出计费；这个任务开思考只增加成本，不提升质量
- **DeepSeek 只有 `json_object`，没有 `json_schema`**，所以有两条硬性前提：
  提示词里必须出现「json」字样并给出格式示例（官方文档要求，缺了会退化成普通文本），
  且返回值解析后**必须再过一次 zod**——它只保证是合法 JSON，不保证符合我们的结构
- 官方明确提示 JSON 模式偶尔返回空内容，代码把它当作可重试失败抛出，
  报错文案会提示重试，而不是抛一个看不懂的 JSON 语法错误
- 流程只有一条：生成初稿 → 人读一遍（可改）→ 确认发布。界面上**不提供
  「生成并发布」的合并动作**：两步并一步，人工确认就会退化成走过场
- 重新生成不会覆盖已确认的解读；要重做得先「退回草稿」
- 生成、编辑、确认、退回、删除全部写入管理员审计日志
- 成本参考（deepseek-v4-flash，关闭思考，按高峰价）：单条约 700 输入 + 450 输出 token，
  约 $0.0009 ≈ ¥0.007；全量补 90 条约 ¥0.6。生成接口限流 10 次/分钟/管理员
- 只为 `ai-update` 生成：竞赛、实习、开源任务的卡片已有资格、费用、截止时间
  这些结构化事实，学生看得懂该做什么

提示词里有三条硬规则，改动前请先读 `src/lib/pathfinder/editorial.ts` 的说明：
只用给定材料里的事实、不预测不评级、建议必须是本周能开始的具体一件事。
**改提示词就要改 `EDITORIAL_PROMPT_VERSION`**，否则无法分辨哪些解读该重做。
详情页会如实标注「由 AI 起草、经人工确认后发布」，这句不能去掉。

## 默认发布策略

- OpenAI、Google DeepMind、Google AI 和 GitHub AI 官方 RSS 可自动发布为 AI 动态，但永远不能进入学习路径。
- Hugging Face Blog 含社区内容，默认人工审核。
- **AGI Hunt 日报（`agihunt-daily`）是唯一的日更中文来源，自动发布。** 加它是因为其余动态来源全是企业官方博客，一周才发几篇——实测同步每小时准点跑，却连着 17 小时一条新条目都没带回来。它是聚合站不是官方信源（内容本身是 AI 从 X / Reddit 汇总的二次转述），所以 `trustLevel` 是 `verified` 而不是 `official`。
- **接的是日报，不是 AGI Hunt 的快讯流，别改。** 快讯流 `/feed.xml` 每 24 小时产出 5761 条（`/api/channels` 的 `count_24h` 合计），而 feed 只保留最新 50 条、实测跨度仅 20 分钟；RSS 适配器每轮最多取 30 条、同步每小时一次，等于每小时从约 240 条里随机采 30 条，覆盖率 12%，还要每天往待审队列灌 720 条——正是 `github-good-first-issues` 停用的那个失败模式，量级还大 4 倍。日报是站方按天汇总的一期，1 条/天。
- **日报不进机会库（`excludeFromCatalog: true`）。** 机会库的每张卡片都在回答「什么时候截止、我够不够资格、要花多少钱」，资讯摘要三个问题一个都答不上——`CatalogItemCard` 为 `ai-update` 专门关掉了截止时间与资格两块，卡片模型本身就说明这类条目不属于那个列表。它仍然出现在发现页的 AI 动态区、本周和 RSS，那几处本来就是按时间排的资讯位。想让它回到机会库之前，先想清楚这三个问题怎么答。
- **`isStudentRelevant` 现在有中文判据了，但它是 2026-09-05 才补的。** 在那之前拒绝判据与 `topics.ts` 的词表全是英文正则，中文来源既拿不到主题、也命中不了英文研究信号，等于整个闸门对中文不生效（日报实测 `topics` 是 `[]`，属于「过了闸门」而不是「被检查过」）。补的时候**四组必须一起补**：只加拒绝判据不加中文研究信号，中文真研究会失去「研究信号优先」那层保护而被整片误杀。
- **日报来源的 `maxItemsPerSync` 是 3，不要调大。** 它的 feed description 是模板套日期（30 条归一化后只有 1 种），所以开了 `replacesFeedSummary`，每条都要额外拉一次 `/daily/{date}.md` 取「今日总结」。实测约 1.7 秒/条，照默认 30 条要 51 秒；而正文补全跑在入库**之前**，超时就整条来源回滚，于是每小时重试、每次都超时，这条来源会永远进不来。
- **泛 GitHub 搜索来源（`github-good-first-issues`）已停用**：它扫全站、每小时带回约 30 条
  几乎不重复的 issue，实测一天累积 178 条全部滞留 pending 且从未被审核；仓库构成以赏金农场
  和训练营作业仓库为主，方向推断有 149/178 落到默认值。职责已由下一条接管。
- **策展仓库的 Good First Issue 自动发布**：来源由 `catalog-seeds.ts` 里已审过的 GitHub 仓库
  自动生成（见 `buildCuratedIssueSources`），按方向分桶，每桶一条来源。
  **要扩大覆盖就往 `catalog-seeds.ts` 加仓库条目，issue 会自动跟上**，不需要手写查询。
  桶数固定，新增仓库不会挪动已有仓库的来源归属；某个桶的查询超过 GitHub 的 256 字符上限时
  CI 会报错，届时把 `CURATED_ISSUE_BUCKETS` 调大一次即可。
- 竞赛和实习首版使用人工核验的官方入口，不运行通用网页爬虫。
- 6 条具体时效机会已核验到 2026-08-24。只有 Mitacs 与 OIST 公布了时区并保存绝对时间；其余条目只保存官方日期，筛选和排程可使用日期，但界面不会伪造时刻。
- 外币费用保留原币种与官方金额。系统不使用临时汇率推算人民币；用户未明确接受外币支出时，任何已知非零外币费用的机会都不会进入路径。
- GitHub 规则推断内容、AI 动态和带“人工资格核验”标记的机会即使公开，也由服务端强制禁止直接进入学习路径。
- 可学习的动态条目连续 30 天未再次核验会转为 `stale`；AI 动态保留 180 天公开窗口，之后归档，避免公开目录无界增长。

## 审核与紧急下架

- 后台可查看“待审核 / 已发布 / 待复核 / 已过期 / 已下架”，按条目 ID、外部 ID、标题、组织或 URL 搜索，并通过“加载更多”访问 100 条之后的动态内容。
- 审核卡完整显示方向、难度、资格、设备、网络、原币费用、双语截止与标签。普通发布默认只作为信息；只有明确核验字段后才可用于路径，推断内容不能绕过服务端限制。
- 已发布、待复核、已过期的动态条目和仓库内静态种子都可下架；操作前必须二次确认标题与 URL。静态种子同时写入 Redis tombstone 与数据库覆盖记录。
- 已下架动态条目可受审计地恢复到“待审核”，不会直接恢复公开；静态 tombstone 会继续保留，防止代码种子绕过复核复活。
- 下架、发布、驳回和同步维护都会失效 Pathfinder 页面、公开目录 API 与 sitemap 缓存。
- 自动发布资格由代码白名单硬限制；后台只能关闭白名单能力，不能把社区或机会来源提升为自动发布。

## 故障处理

- 单个来源失败不会中断其他来源；后台展示最近错误与连续失败次数。全部来源失败会返回 503，便于 crontab 或探针报警。
- 连续失败时先停用该来源，再检查官方 Feed 是否改址、限流或返回超大响应。
- 当前阿里云实例未配置可用的公网 IPv6，`ecosystem.config.cjs` 固定 Node 为 IPv4 优先；在确认服务器 IPv6 出站可用前不要移除该配置，否则部分 Feed 会把整个单来源超时预算耗在不可达地址上。
- 公开目录快照缓存 60 秒，审核和同步写入后按 tag 主动失效。数据库失败但 Redis 可用时回退已应用 tombstone 的静态种子；两个存储同时失败时生产环境返回空目录并记录错误。
- 不要把任意 URL 参数加到同步接口。抓取地址必须继续由 `ingestion/sources.ts` 的代码白名单管理。

## 回滚

1. 停止 crontab，防止旧应用回滚期间继续写新表。
2. 部署上一版本应用。
3. 三张新增表可以保留，不影响旧版本；无需在故障窗口执行破坏性 DROP。
4. 需要重新上线时从静态页面检查开始，再恢复同步。

如果确需删除新表，必须另行确认、备份并编写独立向下迁移；不要在普通应用回滚中直接删除数据。
