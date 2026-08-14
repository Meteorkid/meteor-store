# Meteor Store 全站「同时在线人数」设计

> 日期：2026-08-14

## 目标

在 Footer 底栏低调显示「当前 X 人在线」，仅当在线人数 > 50 时显示；≤ 50 或统计不可用时什么都不显示。用于向访客传达站点的活跃度，同时不打扰阅读、不影响任何现有页面性能。

## 当前根因

- 全站没有在线人数/活跃用户统计，也无任何 presence 代码。
- 现有浏览埋点（`page_views`）只覆盖文章页，且以 `ipHash` 去重，不适合做全站在线统计。
- 部署形态是阿里云单实例 + Vercel 双活，必须用分布式存储（Upstash Redis 已在用）才能跨实例去重计数。

## 已确认决策

- 「在线」= 浏览器在过去 10 分钟内有活跃心跳（行业惯例，人离开后最多多计 10 分钟）。
- 显示位置固定在 Footer 底栏（版权/备案行下方），低调小字，不做成抢眼的徽标。
- 匿名浏览器也统计：首次访问生成随机 UUID 存 localStorage，不存 IP、不存任何个人信息。
- 阈值 50 做成常量 `ONLINE_VISIBLE_THRESHOLD`，客户端与服务端共用一个来源。
- Redis 不可用时静默降级：心跳成功返回、计数返回 0、页面不显示，绝不拖垮网站。

## 方案选择

采用 Upstash Redis HyperLogLog 分桶心跳，不新增数据库表。

### 数据模型

- 5 分钟一个 HLL 桶：`online:hll:{floor(now/300000)}`，`EXPIRE 900s` 自动清理。
- 心跳：`PFADD` 当前桶 + `EXPIRE`；同一浏览器 UUID 天然去重（多标签页只算一人）。
- 计数：`PFCOUNT` 当前桶 + 上一个桶（约 10 分钟窗口，多桶合并去重），结果缓存 `online:count` 60 秒，避免并发读重复计算。

### API

- `POST /api/online/heartbeat`：body `{ visitorId }`（zod UUID 校验），按 IP 限流 30 次/分钟（与浏览埋点一致）；Redis 挂了也返回 `{ ok: true }`。
- `GET /api/online`：纯读不限流，返回 `{ count }`；Redis 挂了返回 `{ count: 0 }`。

### 前端

- `OnlineVisitors`（客户端组件）：挂载即心跳 + 拉计数，之后每 60 秒轮询；错误静默（沿用 `PostStats` 容错模式）；`count > ONLINE_VISIBLE_THRESHOLD` 才渲染 `t-footnote text-white/60` 小字，否则 null（避免 hydration 不一致，count 初始 null 挂载后才有值）。
- `FooterCopyright` 在备案行后挂载 `<OnlineVisitors />`，手术式改动。

### 文案

- zh：`当前 {count} 人在线`；en：`{count} people online now`（Footer 命名空间）。

## 验证

- 单测：心跳写桶与 TTL、跨 5 分钟边界、缓存命中/未命中、Redis 为 null 降级、阈值常量。
- `pnpm exec tsc --noEmit`、`pnpm exec eslint src`、`pnpm test`、`pnpm build`。
- 手工冒烟：本地起服务，GET /api/online 返回 count，心跳后计数不报错；Footer 正常渲染且 count≤50 时不显示。

## 非目标

- 不做后台在线人数图表/历史趋势。
- 不做登录用户与匿名用户的区分展示。
- 不做「当前在线」之外的实时推送（WebSocket/SSE）。
- 不把阈值做成可配置项（本期常量即可）。

## 完成标准

- 全站在线人数统计在 Redis 上跨实例可用，匿名/登录用户都算。
- Footer 仅当 count > 50 时显示，异常时静默隐藏。
- 心跳与计数接口在任何依赖故障下不产生 5xx。
- 测试覆盖正常、降级、限流路径，完整 CI 通过。
