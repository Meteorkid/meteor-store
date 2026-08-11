# Meteor Store - Agent 配置

## 项目概述

- **项目名称**: Meteor Store
- **技术栈**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **数据**: Neon Postgres + Drizzle ORM；限流用 Upstash Redis；错误监控用 Sentry
- **组成**: 三个子系统 —— 内容（博客/文档/开源展示）、商业（产品/支付/授权码）、身份（注册登录）

## 可用 Skills

### 设计相关 Skills

| Skill | 用途 | 状态 |
|-------|------|------|
| `ui-ux-pro` | UI/UX 设计与优化 | ✅ 可用 |
| `frontend-design` | 前端设计系统 | ✅ 可用 |
| `ui-ux-mastery` | UI/UX 精通最佳实践 | ✅ 可用 |
| `ui-ux-pro-max` | 高级 UI/UX 策略 | ✅ 可用 |
| `design-system` | 设计系统构建 | ✅ 可用 |
| `design-system-pro` | 高级设计系统 | ✅ 可用 |
| `ui-design-ux-enhanced` | 增强型 UI 设计 | ✅ 可用 |
| `ux-design` | UX 设计流程 | ✅ 可用 |
| `ux-optimizer` | UX 优化 | ✅ 可用 |
| `ui-review` | UI 审查 | ✅ 可用 |
| `ui-ux-architect` | UI/UX 架构师 | ✅ 可用 |

### 开发流程 Skills

| Skill | 用途 | 状态 |
|-------|------|------|
| `react-patterns` | React 最佳实践 | ✅ 可用 |
| `frontend-excellence` | 前端卓越实践 | ✅ 可用 |
| `performance-optimization` | 性能优化 | ✅ 可用 |

### GSD 项目管理 Skills

| Skill | 用途 | 状态 |
|-------|------|------|
| `gsd-new-project` | 新项目初始化 | ✅ 可用 |
| `gsd-plan-phase` | 阶段规划 | ✅ 可用 |
| `gsd-execute-phase` | 阶段执行 | ✅ 可用 |
| `gsd-surface` | 进度展示 | ✅ 可用 |

## 可用 MCP 服务器

### 全局 MCP（已启用）

| MCP | 用途 | 状态 |
|-----|------|------|
| `git` | Git 操作 | ✅ 已启用 |
| `filesystem` | 文件系统操作 | ✅ 已启用 |
| `memory` | 知识图谱 | ✅ 已启用 |
| `sequential-thinking` | 顺序思考 | ✅ 已启用 |
| `serena` | 代码智能 | ✅ 已启用 |

### 推荐项目级 MCP

| MCP | 用途 | 优先级 |
|-----|------|--------|
| `magic` | AI 设计生成 | ⭐⭐⭐ 高 |
| `chart` | 图表生成 | ⭐⭐ 中 |
| `awesome-design` | 设计资源 | ⭐⭐ 中 |

---

# 项目约定

> 以下是已经落地并有测试或 CI 兜住的约定。改动前先读这一节，别另起炉灶。

## 排版：全站字阶

定义在 `src/app/globals.css`。**尺寸、字重、行高、字距是成套定义的**，不要只改字号——
大字要负字距、小字要正字距，一个固定的 `letter-spacing` 在某个尺寸上一定是错的。

| 类名 | 字号 | 字重 | 行高 | 字距 | 用在哪 |
|------|------|------|------|------|--------|
| `t-display` | 36→80px | 700 | 1.02 | −0.035em | 页面主标题（产品页） |
| `t-title-1` | 30→48px | 700 | 1.12 | −0.025em | 章节标题、文章标题、头条 |
| `t-title-2` | 24→30px | 700 | 1.25 | −0.02em | 分区页标题、表单区块标题 |
| `t-title-3` | 18→22px | 600 | 1.35 | −0.015em | 列表条目标题 |
| `t-title-4` | 16px | 600 | 1.45 | −0.005em | 次级条目标题 |
| `t-body` | 17px | — | 1.75 | 0 | 正文 |
| `t-footnote` | 13px | — | 1.5 | +0.01em | 元信息、说明文字 |
| `t-eyebrow` | 11px | 600 | 1.4 | +0.24em | 眉标（大写字距拉开） |

改 clamp 斜率时**逐断点核对不要比改版前更小**（375 / 768 / 1024 / 1280）。
历史教训：`4vw` 的斜率曾让 768px 平板下所有章节标题缩小约 15%。

### 材质与颜色

- **全站只有暗色一套主题，不跟随系统深浅色。** 不要加 `@media (prefers-color-scheme: light)`、
  也不要加 `dark:` 变体——整套设计（玻璃、光晕、流星、粒子、`text-white/60` 的对比度基线）
  都以暗底为前提，翻转背景会直接白底白字。四个地方共同保证：
  `globals.css` 的 `:root:root` 固定暗色 token 并声明 `color-scheme: dark`、
  **根布局** `app/layout.tsx` 的 `viewport` 导出 `colorScheme: 'dark'` + `themeColor`、
  `global-error.tsx` 自带 `style={{ colorScheme: 'dark' }}` 并单独 `import './globals.css'`
  （它会替换根布局，viewport 和样式表都拿不到），
  以及 `src/lib/__tests__/dark-theme.test.ts` 把上述约束钉在 CI 上。
  历史教训：`:root` 曾只放浅色值、暗色值藏在 `prefers-color-scheme: dark` 里，
  于是浅色系统的机器上 `--background` 是近白而周围 `bg-white/5`、`border-white/10` 不变，整站不可读
- **选择器是 `:root:root` 不是 `:root`，别顺手改回去**：`tokens.css`（自动生成）也用 `:root`
  定义同名浅色 token，同特异性下只靠 globals 写在 `@import` 后面取胜。重新生成 tokens、
  给它包一层 `@layer`、或在上面再加一条 `@import` 都会让那个假设失效，代价是全站白底。
  多写一次 `:root` 把特异性抬到 (0,2,0)，覆盖关系就与源码顺序无关
- **`viewport` 必须挂在根布局**：Next 沿整条 segment 链收集 viewport，挂根上覆盖所有路由。
  挂在 `[locale]/layout.tsx` 的话，将来在它之外新增顶层段（根级 not-found、新顶层路由）
  会静默丢掉 `color-scheme` / `theme-color` 两个 meta
- **语义 token 要成套改，别只改 background/foreground**：`--secondary` / `--secondary-foreground`
  曾被漏在浅色档，于是骨架屏（`PageSkeleton` 15 处）、Footer 社交图标在黑底上是近白方块。
  加新 token 时 `:root:root` 和 `@theme inline` 两处都要写——真实构建实测过，
  只写前者 Tailwind 不生成对应工具类（产物里 0 处）。注意 dev server 的 Turbopack
  会缓存旧 CSS，验证这类改动必须跑 `pnpm build` 看产物，别信 dev 里看到的
- **`text-muted-foreground` / `bg-muted` 是有意留着不生效的**：70 处使用、构建产物 0 处生效。
  `:root:root` 和 `@theme inline` 两处都没有 muted，类名空转，这些说明文字继承正文的纯白、
  和标题同色。**这是看过前后对比后定的，不是待修的 bug**——别"顺手补上"token 和映射，
  那会一次性把全站 70 处说明文字变灰
- **Open Props（`tokens.css`）带 3 条 `prefers-color-scheme: dark`**：1 条切 `--shadow-color`
  / `--shadow-strength` / `--inner-shadow-highlight`，已被 `:root:root` 盖住（`:where(html)`
  特异性为 0）；另 2 条重定义 `@keyframes fade-in-bloom` / `fade-out-bloom`——
  **keyframes 覆盖不了**，同名规则里媒体查询命中的那条直接生效。目前全站没用这两个动画所以无害，
  要用之前先确认。升级 Open Props 后变量和 keyframes 都要复查
- **`tokens.css` 的 `.dark, [data-theme="dark"]` 块是死代码**：源码顺序在前、特异性低于
  `:root:root`，给 `<html>` 加 `data-theme` 属性也不会生效。该文件头写着「自动生成，请勿手动编辑」，
  所以留着不动——但别被它误导，主题开关不在那里，也不要试图通过它做切换
- 液态玻璃用 `.glass`（chrome）/ `.glass-card`（可交互卡片）/ `.glass-lg`（浮层）
- **正文区域不上玻璃**：长文放半透明材质上会牺牲可读性，材质是给 chrome 用的
- 玻璃背后要有可折射的内容（光晕/渐变），纯黑底上 `backdrop-filter` 读不出来
- **`-webkit-backdrop-filter` 必须写在 `backdrop-filter` 之前**。Lightning CSS 去重时保留最后一条，顺序反了会把标准属性删掉，Firefox 全站玻璃失效
- 承载信息的文字对比度 ≥ `white/60`（7.37:1）；只有 `aria-hidden` 的分隔符可以更淡
- 悬浮效果包在 `@media (hover: hover) and (pointer: fine)` 里
- `prefers-reduced-motion` 下要同时关掉 transition **和** transform，只关前者等于把滑动变成瞬移

## 博客分区

分区配置的唯一数据源是 `src/data/blog-sections.ts`。**加/改分区只动这一个文件**，
类型、路由、导航、sitemap、RSS、搜索索引全部从它推导。

```ts
{ id, slug, label, description, channelId, rgb, allowProposals }
```

- `rgb` 是 RGB 三通道字符串，注入 CSS 变量 `--blog-accent` 驱动光晕/渐变/扫描线
- **变量名不要用 `--accent`**：那个已被设计系统 token 占用（见 `:root` 与 `@theme inline`），
  复用会让 `bg-accent` 之类的工具类静默失效
- 结构是两层：频道（`blogChannels`）→ 分区。分区页路由是 `/blog/section/{slug}`

### RSS 与 SEO

- 两个 RSS feed：全站 `/blog/feed.xml`、分区 `/blog/section/{slug}/feed.xml`，均 `force-static`，审核通过时由 `revalidatePath` 刷新
- RSS 入口已全站覆盖：Footer 链接、博客列表页/分区页的 `◉ RSS` 按钮、文章页/投稿页 `<head>` 里的 `<link rel="alternate" type="application/rss+xml">`（供阅读器自动发现，指向所属分区 feed）
- 文章页和投稿页注入 `BlogPosting` JSON-LD 结构化数据（`<script type="application/ld+json">`），含标题/日期/作者/分区/关键词
- 站点域名硬编码为 `https://imagentx.top`（JSON-LD 的 `url` 和 `mainEntityOfPage`），换域名时全局搜替换

## 内容流程

文章有**两条来源**：站主的在 `content/blog/*.md`，读者投稿在数据库 `posts` 表。

**读的时候只从 `src/data/blog-feed.ts` 取，不要直接 import `blogPosts`。**
直接 import 不会报错，只会静默漏掉全部读者投稿——列表少几篇、标签计数偏低，
而且没有任何测试会红。合并层是 async 的（要读数据库），所以消费它的
服务端组件和 route handler 都得是 async。

| 要什么 | 用哪个 |
|--------|--------|
| 全部公开文章 | `getFeedPosts()` |
| 某分区的文章 | `getFeedPostsBySection(id)` |
| 各分区篇数 | `getSectionCounts()` |
| 标签索引（热度降序） | `getFeedTags()` |
| 某标签下的文章 | `getFeedPostsByTag(input)` |

- 文章地址由 `href` 字段决定，**别自己拼 `/blog/${slug}`**：投稿是 `/blog/p/{id}`
- 数据库读失败时降级为只有文件文章，不抛错。投稿看不见 < 整个博客 500
- 传给客户端组件前过一次 `toFeedSummary()`，正文不进客户端 bundle

### 站主的文章

`content/blog/*.md`，构建时读取，**slug 取自文件名**。

```markdown
---
title: 标题
excerpt: 一句话摘要
date: 2026-07-30          # 必须 YYYY-MM-DD
section: literature        # 必须是已定义的分区 id
tags: [随笔]
draft: true                # 草稿只在开发环境可见
---
正文……
```

- frontmatter 走 zod 校验，**不合法直接抛错让构建失败**——宁可 CI 红，也不要静默上线一篇分区写错的文章
- `readingTime` 自动算（中文 400 字/分 + 英文 200 词/分），不要手填
- `draft: true` 可以安心提交进 git，生产构建会当它不存在
- 发布 = 一次部署。这是选文件而非数据库的代价，换来的是版本历史、可 diff、可离线写、不绑厂商

### 读者投稿

状态机 `draft → pending → published / rejected`，先审后发，`pending` 不公开可见。
服务层在 `src/lib/posts.ts`，页面是 `/blog/submit`、`/blog/my-posts`、`/admin/review`、`/blog/p/{id}`。

- **审核用条件更新**（`where(id AND status='pending')`），不要改成先查后写：
  两个管理员同时点会重复处理，命中不到就返回 409
- 标签存关联表 `post_tags` 而不是 JSON 列。标签会涨到成百上千，
  算热度要一次 `GROUP BY`；存 JSON 就得把全部文章拉进内存
- 投稿的 Markdown 走的是和正式文章**完全相同**的渲染管线，原生 HTML 被丢弃
- 通过审核后要 `revalidatePath` 的不止 `/blog`：还有分区页、`/blog/tags`、
  两个 RSS 和 `/sitemap.xml`。标签页用 `revalidatePath('/blog/tag/[tag]', 'page')`
  整条路由一起失效——规范地址的大小写来自索引，未必等于投稿里的写法，逐个失效会漏

### 收藏

登录用户可以收藏任何文章（站主文件文章 + 读者投稿都覆盖）。
服务层在 [src/lib/favorites.ts](file:///Users/meteor/github/meteor-store/src/lib/favorites.ts)，
API 是 `GET/POST /api/blog/favorites`，页面 `/blog/favorites`，UI 入口在 `PostStats` 心形按钮。

- `post_favorites` 表复合主键 `(targetId, userId)` 天然防重复收藏。
  **`targetId` 复用 views/likes 的约定**：文件文章用 slug，数据库投稿用 `post.id`，
  两个空间不会撞——投稿是 base64url 短 id，文件 slug 是 kebab-case
- `toggleFavorite` 内部先 SELECT 再 INSERT/DELETE：Neon HTTP 不支持事务，
  复合主键兜底并发（两人同时收藏同一篇，最坏情况是其中一人收到唯一约束错误，
  调用方应捕获并重试一次读取状态）
- **列表页收藏数走批量查询** `getFavoriteCounts(targetIds[])`：N 篇文章一次 `GROUP BY`，
  不要改成每条都打一次数据库。`BlogList` 服务端取好后以 `Record<string, number>`
  传入客户端组件（**Map 不能跨 RSC 边界**，必须 `Object.fromEntries`）
- **「我的收藏」页**用 `getUserFavoritePosts(userId, locale)`：拿到 targetId 后两边来源都筛一遍，
  按收藏时间倒序。已下架/删除的文章自然筛不到（收藏记录保留，但不显示）——
  作者重新发布或改 slug 后无法自动恢复，这是可接受的代价
- 收藏切换接口限流 30 次/分钟/用户+IP，与点赞一致；未登录返回 401
- 切换收藏状态**不需要 revalidatePath**：收藏数和状态都由 `PostStats` 客户端组件
  挂载时 fetch，列表页收藏数也是动态渲染。和点赞一样是「读时不缓存，写时不失效」

### UGC 举报

覆盖评论与读者投稿两种 UGC 内容。站主自己的文件文章不走举报——有问题直接 GitHub PR。
服务层在 [src/lib/reports.ts](file:///Users/meteor/github/meteor-store/src/lib/reports.ts)，
用户提交 API `POST /api/reports`，管理员审核 API `GET/PATCH /api/admin/reports`，
审核页 `/admin/reports`，UI 入口在每条评论旁和投稿详情页头部。

- `reports` 表字段：`targetType`（comment|post）、`targetId`、`reporterId`、
  `reason`（spam|abuse|nsfw|illegal|other）、`detail`、`status`（pending|resolved|dismissed）、
  `resolverId`、`resolvedAt`。**无外键**——与全站其它表保持一致，
  注销用户/下架文章后举报记录保留作留痕
- **不做"同一用户对同一目标只能举报一次"约束**：用户可能因新增违规内容再次举报。
  队列由管理员侧按 `(targetType, targetId)` 聚合查看，重复举报不挤压队列
- **目标存在性校验**：评论必须存在（任意状态可举报，pending 的评论管理员可能还没看到问题）；
  投稿必须存在且只在 `published` 状态可举报（pending 投稿管理员本来就正在审，无需举报）
- **`resolveReport` 用条件更新**（`where(id AND status='pending')`）：避免两个管理员同时处理同一举报
- **举报提交只改举报记录状态，不会自动删除/驳回被举报内容**——
  删除评论走 `/api/admin/comments`、驳回投稿走 `/api/admin/posts`。
  让管理员显式做这两个动作，避免"举报即删"被人当武器
- 提交举报接口限流 5 次/分钟/用户+IP（比点赞/收藏 30 次更严），
  举报不是高频操作且队列是人工处理，被刷会让管理员看不过来；未登录返回 401
- 管理员审核页用 `listReports(status?)` 查询，**批量取被举报内容预览**：
  两种 targetType 分别用 `inArray` 一次拉，避免每条都打数据库
- 管理员首页 `pendingReports` 计数纳入 `getAdminStats`，与 pendingPosts/pendingComments 并列

### PostStats 聚合接口

文章页的统计组件 `PostStats` 挂载时一次性拉取 views/likes/comments/favorites 计数
和当前用户的 liked/favorited 状态，**用聚合接口 `GET /api/post-stats`** 替代原本的
4 个独立 fetch（views/likes/comments/favorites 各一个），减少请求数和 RTT。

- 接口在 [src/app/api/post-stats/route.ts](file:///Users/meteor/github/meteor-store/src/app/api/post-stats/route.ts)，
  6 个查询并行执行（view count / like count / like status / comment count / favorite count / favorite status）
- **GET 不限流**：所有数据本来就对公众可见，计数查询走索引开销很小
- 评论数只统计 `status='approved'`（与 `/api/comments` GET 的过滤一致）
- 点赞/收藏状态查询当前用户命中：未登录时跳过那两个查询（用 `Promise.resolve([{count:0}])` 占位保持并行结构）

### 作者落款（个性签名）

文章末尾的作者落款分两种，对应两条来源：

- **站主文件文章** `/blog/[slug]`：末尾自动渲染 `PostSignature` 组件（流星划线 + Dancing Script 手写体 "Meteor" + "—— 店主"），样式参考 `/story` 页面。站主无需在 markdown 里手写签名——组件自动注入，每篇文章都有。组件在 [src/components/PostSignature.tsx](file:///Users/meteor/github/meteor-store/src/components/PostSignature.tsx)
- **读者投稿** `/blog/p/[id]`：末尾自动渲染作者落款区块（头像 + 昵称 + bio）。bio 来自 `users.bio` 字段，用户在 `/account` 页面设置（label 显示为「个性签名」）。`posts.ts` 的 `postColumns` 已 JOIN `users.bio` 和 `users.avatarUrl`，`UserPost` 类型带 `authorBio` / `authorAvatarUrl`

**bio 字段就是个性签名**，不是单独的字段。200 字上限，profile 接口已支持更新。
改 bio 不需要 revalidate——投稿详情页是动态渲染的。

### 管理员

`ADMIN_EMAILS` 环境变量，逗号分隔。**故意不放数据库字段**：加一个 `isAdmin` 列
等于让任何能写 `users` 的路径都成为提权面。未配置时任何人都不是管理员。

- `/api/auth/me` 附带的 `isAdmin` **只决定显不显示入口**，每次请求现算不进 JWT
  （进了 token，撤销管理员就得等它过期）。真正的鉴权在页面和写接口里各有一道
- 后台对非管理员返回 **404 而非 403**，且 `generateMetadata` 也要跟着权限走——
  写成静态 `metadata` 的话，标题栏会写着「待审核」，等于告诉他这里有个后台
- **管理员越权编辑投稿**：`/admin/posts` 表里每条投稿旁有「编辑」链接，
  跳到 `/blog/submit?id={postId}&admin=1`。该页用 `isAdminEmail(session.email)` 校验后，
  调 `updatePost({ ..., asAdmin: true })`。`asAdmin` 让 `where` 只用 `id` 不带 `authorId`，
  并允许编辑 `pending` 状态（审核中需要修正的情况）。
  API 层 `src/app/api/posts/[id]/route.ts` 必须先验 `isAdminEmail` 再传 `asAdmin`，
  **绝不能让前端直接传 `asAdmin: true`**
- 站主文件文章的「编辑」链接直接指向 GitHub 仓库 `content/blog/{slug}.md` 的 web 编辑器
  （仓库 owner 是 `Meteorkid`，不是 `meteor-store`——这是历史命名，别改）
- 管理员直发模式 `adminPublish`：投稿由管理员创建时跳过审核直接发布；已发布文章编辑后
  保持 `published` 不下架。仅 `asAdmin` 路径下生效，普通作者走 `submit` 流程

### 邀请码

管理员创建邀请码 → 用户兑换 → 自动生成授权码（license key）。
服务层在 `src/lib/invite.ts`，管理后台 `/admin/invite-codes`，兑换页 `/redeem`。

- 邀请码格式 `INV-XXXX-XXXX-XXXX`，和 license key 用同一个字符集
- `invite_codes` 表记录码的元信息（产品、套餐、可用次数、过期时间、备注）
- `invite_redemptions` 表记录谁兑换了哪个码、拿到哪个 key
- **兑换用条件更新**（`WHERE id AND status='active' AND used_count < max_uses`），原子操作防竞态
- 兑换生成 license key 时，`orderId` 写 `INV-{redemptionId}` 以与购买订单区分
- 需要登录才能兑换；管理后台同样走 404-非-403 模式
- 管理后台的产品下拉里 **Meteor Pass 排第一**（发 Pass 是最常用的赠码场景），单品在后
- 用户侧两个兑换入口共用 `RedeemForm`：定价区的「有邀请码？点此兑换」按钮打开
  `RedeemDialog` 弹窗（未登录时引导登录），以及独立页 `/redeem`——
  **`/redeem` 别删**，兑换成功邮件里发的是那个链接

## 商业模式：Meteor Pass + 单品

全站**只有一个定价区块**：首页 `#pricing` 的 `PricingSection`，卖全站会员 **Meteor Pass**。
历史上首页并排放过两个：`PricingSection` 拼三个不同产品的中间档当成三个档位卖
（¥79/月、¥19/月、¥49/**年** 并排，单位都不统一，三张卡全标「推荐」，年付开关只对月付档生效），
外加一个 `FeaturesComparison` 渲染完全虚构的 Basic/Pro/Enterprise——
两个都和后端的真实模型对不上，已删除，**不要再加回来**。

价格与权益的唯一数据源是 [src/data/pass.ts](file:///Users/meteor/github/meteor-store/src/data/pass.ts)，
**改价只动这一个文件**：

| 档位 | plan id | 价格 | 有效期 |
|------|---------|------|--------|
| 月付 | `monthly` | ¥39/月 | 1 个月 |
| 年付 | `annual` | ¥299/年 | 12 个月 |
| 买断 | `lifetime` | ¥899 | 永久 |

- **Pass 不进 `products` 数组**：它不是产品，没有产品页、不进 sitemap、`/apps/meteor-pass` 是 404。
  `findProduct` 只认真实产品；订单页 / 成功页 / 确认邮件这些「要显示买了什么」的地方用 `findPurchasable`
- **Pass 不套 `ANNUAL_DISCOUNT`**：三个档位本身就是计费周期，价格是直接定的。
  支付接口的 Pass 分支**忽略**客户端传来的 `isAnnual`
- 档位 id 存进 `orders.billing_period`（`monthly`/`annual`/`lifetime`），`plan_name` 存中文档位名；
  邀请码发的 Pass 则把档位存在 `invite_codes.plan_id`
- **只有 Pass 会过期**。单品订单沿用历史行为：付了就一直可用，没有到期概念——
  两者不一致是有意为之，给单品补上到期会追溯性地收回老客户已有的访问权
- 有效期算在 `getPassCoverage`，返回 `lifetime | until | unknown` **三种**结果。
  别再合并成 `string | null`：null 曾同时表示「永久」和「算不出来」，
  于是任何一条脏 `billing_period`（手工补单、导入脚本、改档位 id）都静默兑换成
  永久免费的全站会员。现在档位查不到按**最短档**兜底并 `console.warn`，
  起算时间缺失/非法判为 `unknown` 直接不放行
- 月末下单要钳到目标月最后一天（1/31 + 1 个月 = 2/28，不是 3/3），否则每次都白送两三天
- **多条 Pass 授权按时间顺序叠加**（`accumulatePass`）：续费从「现有到期时间」与
  「本次发放时间」里更晚的那个起算。取「最新一条」的写法会让提前一周续费白丢一周，
  也会让年付用户兑一张月付邀请码后看到到期时间不升反降
- **单品授权优先于 Pass**：自己买断的产品不该显示成「靠会员在用」，Pass 只填补没被单品覆盖的产品。
  Pass 展开的条目带 `viaPass: true`，`/apps` 靠它避免把档位后缀追加成「年付 · 年付」；
  档位本身走 `passPlanId` 由页面本地化，**别把中文档位名塞进 `planName`**，英文站会漏出来
- **权益文案不能写得比实际交付更满**：12 款产品里只有 4 款（`appComponents` 注册表里的）
  真能在浏览器打开，其余是发授权码。定价页的两个数字由服务端从
  `products.length` 和 `Object.keys(appComponents).length` 算出来传给 `PricingSection`，
  不要写死，也不要让客户端组件 import 整个 products（800 行会被打进 bundle）。
  `src/data/__tests__/pass.test.ts` 把「不得再出现『无需下载』『解锁全部站内应用』」钉在 CI 上

### 免费档与「免费入库」

**¥0 档位一律走 `POST /api/claim` 入库，不要再跳 `/products/{id}#download`。**
免费产品以前是条死路：多数产品根本没有下载区，站内应用又要 entitlement 才放行，
免费用户永远拿不到——免费档等于既买不到也用不了。

- 入库实现上复用 `orders`：写一条 ¥0 的 `status='paid'` 订单，
  `getUserEntitlements` 照常认，「我的产品」「订单记录」都不用改
- **不发授权码、不发邮件**，`delivery_status` 用 `'not_required'`：
  既绕开 `/api/payment/delivery-retry` 的重试队列（它只捞 failed/pending/processing），
  又能通过授权判定里「未交付订单不查授权码状态」那条。
  写成 `'pending'` 会给每次免费入库发一封信，写成 `'emailed'` 会因为查不到授权码
  而让入库的产品在 `/apps` 里直接消失
- 入库接口按 `product.pricing` 里**当前**是否存在 ¥0 档判定，
  限免产品的原价在 `originalPrice` 里，不参与判断；Pass 不在 `products` 里，天然拿不到

### 限免：`pricing[].originalPrice`

某个档位「先免费开放、以后再收费」时，把原价挪进 `originalPrice`、`price` 置 0。
定价卡会把原价划掉、旁边标「限免」。判断能不能免费拿只看 `price`，
所以支付接口的零价拦截、列表页的 `minPrice`、入库接口全都自动正确，无需额外分支。

当前状态（2026-08）：`ex-memory`、`ui-design-system` 限免；
`statux` 公开免费（安装包不门控，不登录也能下）；
`xnook` 纯付费（¥9 买断，安装包走 R2 门控）；`xisland` 免费档 + ¥12 买断，安装包走 R2 门控。

### 安装包分发（Cloudflare R2 + 预签名 URL）

安装包放在**独立的私有 bucket**（`R2_RELEASE_BUCKET`），与头像/博客图片的公开
bucket 完全隔离。服务层在
[src/lib/release-storage.ts](file:///Users/meteor/github/meteor-store/src/lib/release-storage.ts)，
下载接口 `GET /api/download/[productId]?file={下载条目 id}`，
上传走 [scripts/upload-release.mjs](file:///Users/meteor/github/meteor-store/scripts/upload-release.mjs)。

- **安装包绝不能走公开 URL（免费产品也一样）**：公开 bucket 让对象本身暴露，
  猜中 `releases/{product}/{version}/{文件名}` 就能绕过购买门控直接拖走付费 dmg。
  更不能用公开 bucket + 预签名「伪装门控」——预签名只护链接时效，护不了对象本体。
  私有 bucket 必须不绑定公开域名、不开 r2.dev，只接受预签名 URL
- **绝不能把文件读出来由 route handler 转发**：Vercel serverless 响应体上限约 4.5MB，
  dmg 动辄几十 MB，必然失败。接口只做三件事：校验授权、签一条 5 分钟有效的预签名 URL、
  302 过去让浏览器直连 R2。R2 出网流量免费，分发二进制的带宽成本为零
- **也不能放 `public/`**：那里完全公开，付费产品的门控就白做了，二进制进 git 还会撑大部署包
- 对象 key 是 `releases/{productId}/{version}/{文件名}`，**带版本号**：
  已发布的构建产物不该被新版悄悄覆盖
- **`file` 参数是下载条目 id，不是路径**：对象 key 一律由服务端从 products.ts 查出来，
  客户端传什么都变不成 bucket 里的任意对象
- **`gated: true` 必须配 `r2Key`**：挂在 GitHub/Gitee 公开链接上的「门控」是自欺欺人，
  接口宁可返回 503 也不放行。测试钉住了这条
- 签名链接的 302 响应带 `Cache-Control: no-store`，被 CDN 缓存下来等于门控作废
- **免费产品（statux）也走预签名**：非门控的 `r2Key` 条目同样由接口签短时效链接，
  只是不校验登录/授权。这样免费安装包同样没有公开落点，猜路径也拖不走
- 门控判定用的是 entitlement（购买 / 免费入库 / Pass / 邀请码 / 管理员都算），
  所以有免费档的产品「入库」后同样能下
- `DownloadCard` 里那段登录/授权判断**只是显示层**，真关卡在接口——
  安装包地址从头到尾没进过页面。这和 `/apps/{id}` 必须服务端门控不矛盾：
  那里渲染的是应用本体，藏在客户端等于没藏

**macOS 分发前必须签名 + 公证**，否则用户下载后被 Gatekeeper 拦下，比没有下载更糟。
上传前自查：`spctl -a -t open --context context:primary-signature -v X.dmg`
与 `xcrun stapler validate X.dmg`。

### 站内应用的门控必须在服务端

`/apps/{id}` 直接在服务端组件里 `getSession()` + `getUserEntitlements()`，
没权限就**不渲染应用组件**。原来套的客户端 `PaywallGate`（已删除）只是「不显示」，
应用本体照样进 RSC 负载，扒一眼网络响应就能拿到。Pass 会过期，是全站第一个
真正需要「收回已授予访问权」的场景，客户端隐藏这个强度不够。
代价是该页从静态变成按请求渲染——它本来就因人而异，可以接受。
`/apps/{id}/trial` 是有意免门控的试用路由，不受此约束。

### 授权来源有三条，`getUserEntitlements` 必须全认

管理员（`ADMIN_EMAILS`）、已支付订单、**已兑换的邀请码**。

第三条以前是漏的：兑换只写 `license_keys` 不写 `orders`，而授权判定只查 `orders`，
于是兑换过的用户拿到 key 却打不开应用。现在按 `invite_redemptions` 关联查，
并要求对应授权码 `status='active'`。

**撤销授权码对两条来源都要生效**，否则退款后没有任何手段收回访问权
（¥899 买断 Pass 尤其扎眼）。订单侧用 `delivery_status` 区分窗口期：
已 `emailed` 的订单要求授权码仍是 active，未交付的照常放行——
一律要求授权码会把刚付完钱、还没发码的人挡在门外。

### 注册滑块验证

注册表单集成了拼图滑块 CAPTCHA，防止批量注册。

- 服务端 `src/lib/captcha.ts` 用 Sharp 栅格化背景与拼图块，目标 X 坐标只存 Redis；
  客户端只拿 PNG、目标 Y 坐标和不承载答案的随机挑战 ID
- 用户松开滑块后由 `/api/captcha/verify` 服务端核验（容差 5px），成功后换取
  HMAC-SHA256 签名的短期 proof；注册 API 只接受 proof，不再接收坐标答案
- 挑战与 proof 都有效 120 秒，并分别原子消费一次，不能重放
- 注册 API 在密码校验后、查重前验证 CAPTCHA，失败返回 400
- 登录不走 CAPTCHA——已有按邮箱 + IP 双维度限流

### 邮箱验证与正式身份

注册账户默认 `emailVerified=false`，必须通过 Resend 邮件完成验证后才能登录。
令牌服务在 `src/lib/email-verification.ts`，验证 API 是 `POST /api/auth/verify-email`，
重发 API 是 `POST /api/auth/resend-verification`，页面是 `/verify-email`。

- **注册后不签发 session**：注册接口只返回待验证状态和 15 分钟重发凭证；
  密码正确但邮箱未验证时，登录接口同样不签 session
- 验证 token 有效期 24 小时，使用 `JWT_SECRET + ':email-verification'` 派生密钥；
  token 放在 URL fragment，不能改成 query string，避免进入 access log / Referer
- 验证成功只设置 `users.email_verified=true`，**不自动登录**；用户回登录页重新输入密码
- 重发接口不接收任意邮箱，只接收注册成功或正确密码登录后签发的短期凭证；
  验证 token 与重发凭证的 audience/purpose 必须严格隔离
- `getSession()` 同时校验 `tokenVersion` 和数据库 `emailVerified`；未验证旧会话立即失效，
  数据库故障时缺少 `emailVerified: true` 声明的旧 JWT 必须 fail closed
- 管理员调用点统一使用 `isAdminSession(session)`，不要退回只比较邮箱的 `isAdminEmail`；
  `isAdminEmail` 仅用于保留公开注册入口中的管理员邮箱
- 历史授权码按邮箱归属，账户页查询前必须显式检查数据库 `emailVerified`
- 存量管理员回填用 `scripts/verify-existing-admins.mjs`：默认 dry-run；上线顺序是先用生产
  `ADMIN_EMAILS` 回填已注册管理员，再部署强制验证代码

### Markdown 渲染

`src/lib/markdown.ts`，管线是 `unified + remark-gfm + rehype-sanitize`。

- **加能力 = 加插件**，不要回去手写解析
- 正文里的原生 HTML 会被 sanitize **丢弃**（不是转义显示），所以渲染不受信任的内容也安全
- 动了插件链就要跑 `src/lib/__tests__/markdown.test.ts`，那里有 10 个 XSS 攻击向量的回归用例

### 帮助中心

`/docs` 是帮助中心索引，独立问题页是 `/docs/{slug}`。官方从 `/feedback` 中筛选有普遍价值的
问题，脱敏并核实后整理成静态文章；**不要自动公开用户原文**，也不要为此给反馈表加公开回答字段。

- 文章标题、摘要、分类、排序、更新时间与关键词的唯一数据源是
  `src/data/help-articles.ts`。Spotlight 在客户端运行，因此这个文件必须保持浏览器安全，
  **不能导入 `fs` 或服务端 Markdown 加载器**
- 正文放在 `content/help/{locale}/{slug}.md`，中英文必须同名成对存在；slug 只取自元数据清单。
  新增文章时同时补元数据、两种语言正文，并跑 `src/data/__tests__/help.test.ts`
- 正文继续复用 `markdownToHtml`。后续截图放 `public/help/{slug}/`，优先 WebP，必须有非空 alt；
  关键操作不能只画在图里，文字步骤也要完整
- “仍未解决”统一链接 `/feedback?type=question`，只预选现有问题类型，不新增提交接口
- macOS 安全提示以 Apple 官方指引为准：可以说明“隐私与安全性 → 仍要打开”，
  **不要指导关闭 Gatekeeper、开启任何来源或运行绕过命令**。帮助文档不能替代安装包签名与公证

### 头像对象存储（Cloudflare R2）

头像走 S3 兼容的 Cloudflare R2，避免 base64 data URL 入库膨胀 `users` 表。
服务层在 [src/lib/avatar-storage.ts](file:///Users/meteor/github/meteor-store/src/lib/avatar-storage.ts)，
上传接口 `POST /api/avatar/upload`，profile 接口按 R2 是否配置切换校验规则。

- **客户端不直接持有 R2 写凭证**：客户端先把 base64 上传到我们的 API，API 校验后再写 R2，
  返回公开 URL 写入 `users.avatar_url`
- 对象 key 是 `avatars/{userId}/{内容哈希}.{ext}`，更换头像时新 key 与旧 key 不同，
  上传成功后由 API 删除旧对象避免孤儿堆积
- 未配置 R2 时（`isR2Configured()` 返回 false）整体降级为 data URL 入库，开发环境可用；
  生产环境必须配齐 `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_BASE`
- **`R2_PUBLIC_BASE` 必须和 bucket 绑定的自定义域名一致**：中间件会读取它注入 CSP `img-src` 白名单，
  profile 接口用它反解 key 来删旧对象；不一致会让头像加载被 CSP 拦截或删除接口静默失效
- **清空头像**走 `PATCH /api/auth/profile` 传 `avatar: ""`，profile 接口负责删旧对象；
  **替换头像**走 upload 接口，upload 接口负责删旧对象——两个入口都要管，单改一处会留孤儿
- 历史存量 data URL 头像用 [scripts/migrate-avatars-to-r2.mjs](file:///Users/meteor/github/meteor-store/scripts/migrate-avatars-to-r2.mjs)
  一次性迁移：条件更新防并发覆盖，失败行下次重跑会重试

### 博客图片对象存储（Cloudflare R2）

复用头像的 R2 配置和共享客户端（[src/lib/r2-client.ts](file:///Users/meteor/github/meteor-store/src/lib/r2-client.ts)），
服务层在 [src/lib/blog-image-storage.ts](file:///Users/meteor/github/meteor-store/src/lib/blog-image-storage.ts)，
上传接口 `POST /api/blog/upload-image`，接受 `multipart/form-data`，field name 为 `file`。

- **key = `blog/{userId}/{内容哈希}.{ext}`**：用 userId 而非 slug/postId 作前缀——
  投稿在审核中还没有最终 id，且作者可能频繁编辑换图；用 userId 便于按用户清理
- **不做删除接口**：博客图片 URL 写进 Markdown 后就和文章绑定，
  替换/删除图片会导致历史文章裂图。孤儿对象靠后续清理脚本处理（与头像不同）
- **配额由 PostgreSQL 硬保证**：普通已验证用户 200 MiB、当前管理员 1 GiB。`users.blog_image_bytes`
  是并发判断计数器，`blog_images` 是对象账本；上传必须走 `allocating → reserved → ready`，
  不能用 R2 LIST、应用内 SUM 或 Redis 当持久配额。相同 ready 图片复用 URL，不重复计费
- **两条入口共用门控**：Cookie 与 PAT 都使用同一个每用户 10 次/分钟、全站 30 次/分钟限流 key，
  且读取 multipart 前先拿单进程 4 并发槽位。Redis 异常 fail closed，未配置时退化为内存限流；
  release 必须放 `finally`
- **格式与大小校验在服务端做**：WebP / JPEG / PNG / GIF，最大 5MB / 4000 万像素；
  用 Sharp 解码确认真实格式，不信任客户端 MIME，multipart 也要在解析前限制总字节数
- **未配置 R2 时返回 503**：不降级到 data URL——博客正文里嵌 base64 会撑爆 `posts.content`
- **R2 与数据库失败窗口要可对账**：新对象使用完整 SHA-256 key，历史 16 位 key 继续识别；
  `scripts/reconcile-blog-images.mjs` 默认 dry-run，只有 `--apply` 才回填/修复账本，永不自动删
  R2 对象。单独 dry-run 只做 LIST / SELECT / HEAD，可在线运行，但结果只是当时快照
- **`reconcile --apply` 不得与上传并发**：它会分步回填/修复账本，最后重算
  `users.blog_image_bytes`。从 `--apply` 开始到最终 recalibrate 完成必须停止 PM2
  或用等效方式冻结两个图片上传入口，否则并发预占可能被重算覆盖而短暂放宽配额
- **生产顺序固定**：停 PM2/冻结上传 → 确认备份或 Neon 恢复点 → 先 `0028`、
  再 `0029` → dry-run → `--apply` → 二次 dry-run → 部署新应用 → restart PM2 并做健康检查。
  `--apply` 或二次 dry-run 失败时保持停写，不得部署或 restart，排障后从 dry-run 重新核对。
  两个迁移都是 additive，新应用失败可回滚旧应用并保留新表/列，但旧应用不提供 PAT 功能；
  回滚窗口产生的新 R2 图片必须在下次发布前重新对账
- **站主的文章**（`content/blog/*.md`）也通过同一接口上传图片：登录后用 `/blog/submit` 页面
  上传拿 URL，再在本地 `.md` 文件里写。这是为了不在仓库里引入二进制资源
- **Markdown 渲染管线已放行 `loading` 属性**（见 [src/lib/markdown.ts](file:///Users/meteor/github/meteor-store/src/lib/markdown.ts)
  的 `schema.attributes.img`），R2 URL 走 `R2_PUBLIC_BASE` CSP 白名单无需额外配置
- **next/image 优化已启用**：`rehypeNextImage` 插件在 sanitize 之后把外链 img 的 src
  改写为 `/_next/image?url=...&w=...&q=75`，生成多尺寸 srcset（640/828/1200/1920w）。
  原生 `<img>` 直接走 Next 图片优化端点，享受 webp/avif 转换和响应式尺寸，
  无需 `<Image>` 组件。`next.config.ts` 的 `images.remotePatterns` 从 `R2_PUBLIC_BASE`
  构建时自动派生。相对路径图片不被改写。Vercel Hobby 计划每月 1000 次免费优化额度

### 博客发布 API（个人访问令牌）

Codex、Claude Code 等本地工具通过 `/api/v1/blog/*` 管理**当前用户自己的数据库投稿**；
不会操作 `content/blog/*.md`。调用指南在 `docs/blog-publishing-api.md`，机器合约在
`GET /api/v1/blog/openapi.json`。

- PAT 表是 `personal_access_tokens`。令牌格式为 `msb_...`，完整值只在创建成功时返回一次；
  数据库只存 SHA-256、显示前缀、scope 和时间元数据。令牌不能进 URL、日志、Sentry、仓库、
  `AGENTS.md` 或长期提示词
- 每用户最多 10 枚有效 PAT 由 nullable `slot`、1–10 检查约束和 `(user_id, slot)` 唯一索引保证；
  创建前按数据库当前 `users.token_version` 释放已撤销/过期/版本失效记录的槽位，再原子选择空槽，
  插入时重新确认邮箱仍已验证且版本未变化。不要退回会并发穿透的
  “先 count 再 insert”
- 令牌管理接口 `/api/blog/tokens` 使用正常 Cookie 会话；创建还要复核当前密码，写操作做
  Origin 校验。v1 内容接口只接受 `Authorization: Bearer`，不复用 Cookie
- 四项 scope 独立：`blog:read`、`blog:write`、`blog:submit`、`blog:image`。改密造成
  `tokenVersion` 变化、撤销、过期、邮箱取消验证或账户删除后，旧 PAT 立即失效
- 创建文章永远是 `draft`；提交必须单独调用 `/submit`。普通用户进入 `pending`，管理员也只能
  直发**自己的**文章，PAT 路径永远不能传 `asAdmin` / `adminPublish`
- v1 的 `PATCH` 只改本人 `draft/rejected`，`published` 首版只读。修改和提交必须携带服务端最近
  返回的 `expectedUpdatedAt`；正文行与 `post_tags` / `post_sections` 必须在同一原子数据库语句中
  更新，创建也必须在单条 data-modifying CTE 中写完主表与关系，不能退回多语句补偿或
  “先改 posts、再删建关系”的竞态实现
- 现有 Cookie 网页编辑虽然保持原状态策略，也必须把预读的 `status + updatedAt` 带入最终
  UPDATE（普通作者另带 `authorId`），并让主表与关系写共享一条 CTE；否则会与提交、审核或
  另一客户端保存交错，覆盖审核中内容。CAS 失败统一按并发冲突处理
- 四项 scope 不隐式包含：POST/PATCH/submit/withdraw 只返回 `id/status/updatedAt/previewUrls`，
  完整正文只能由 `blog:read` 的 GET 读取。发布主状态写入成功后，缓存失效异常只记录告警，
  不得把已成功发布伪装成 500
- 私有响应统一 `Cache-Control: no-store` + `Vary: Authorization`，错误分支使用稳定 `error.code`。
  图片上传在 multipart 解析前限制请求体，并按实际解码格式校验，不信任客户端 MIME
- 部署顺序是**先执行 `0028` 数据库迁移，再部署引用 PAT 表的应用代码**；应用启动不会自动迁移

## 安全约束

### 所有写接口必须限流

由 `src/app/api/__tests__/rate-limit-coverage.test.ts` 强制：扫描所有 `route.ts`，
有 `POST/PUT/PATCH/DELETE` 就必须调用 `rateLimit()`，豁免要在该测试的 `EXEMPT` 里写明理由。

**新加写接口忘了限流，CI 会红。** 这条约束之前只靠「记得加」维持，结果 login/register
长期完全没有限流——恰好是全站计算最贵的两个端点。需要让多个入口共用同一个限流 key 时，
可调用经该测试显式登记的共享 guard；测试必须同时钉住 Route 调用和 guard 内部的 `rateLimit()`，
不能把共享 helper 当成无条件豁免。

选项怎么选：

| 场景 | 参数 | 理由 |
|------|------|------|
| 身份接口（login/register） | `{ failClosed: true }` | Redis 挂了宁可拒绝，不留「先打挂 Redis 再撞库」的窗口 |
| 普通公开写接口 | `{ fallback: 'memory' }` | 未配 Redis 时至少有单实例限流，不至于完全不设防 |
| 什么都不传 | 未配 Redis 时**完全不限流** | 别这么用 |

登录额外按**邮箱**也限一次——只按 IP 拦不住换 IP 针对同一账号的爆破。

### 其他

- 限流数据在 Upstash Redis，`Ratelimit` 带进程内 `ephemeralCache`：调限流时**光清 Redis 不够，必须重启进程**
- 密钥不进仓库；`NEXT_PUBLIC_` 前缀的变量会被内联进客户端包，只放公开值（如 Sentry DSN）
- 改 `NEXT_PUBLIC_*` 后**必须重新构建**才生效，不是重启
- **CSP 由 proxy 动态生成**（[src/proxy.ts](file:///Users/meteor/github/meteor-store/src/proxy.ts)），不要回到 `next.config.ts` 写静态 CSP。
  inline 脚本走 nonce + `'strict-dynamic'`，不要再加 `'unsafe-inline'`；
  img-src 会从 `R2_PUBLIC_BASE` 自动注入域名白名单，新加图片源域名时改 proxy，别在响应头里覆盖
- **改密踢会话**靠 `users.token_version`：会话 JWT 携带签发时的版本号，`getSession` 比对当前数据库值，
  不一致即视为过期。改密递增该字段；改昵称/头像**不要**递增——会把其他设备无辜踢下线
- CAPTCHA 答案与防重放状态走 Redis（`src/lib/captcha.ts`）：挑战用 GETDEL 原子认领，
  proof 用 SET NX 原子消费；Vercel 多实例下不能依赖进程内 Map
- **React 19 `react-hooks/refs` 规则**：不要在渲染期间写 ref（`ref.current = value`），
  会触发 ESLint error。写 ref 必须放进 `useEffect`。EasterEggs 和 MeteorShower 的 `tRef` 已修
- **Hook 调用顺序**：`useCallback`/`useMemo`/`useEffect` 等所有 Hook 必须在任何 `if (...) return` 之前调用，
  条件调用 Hook 会触发 `react-hooks/rules-of-hooks` error

## 经营主体信息（个体工商户合规）

主体信息的唯一数据源是 `src/lib/constants.ts` 的 **`OPERATOR`**。
**i18n 里只放标签文案，不要放主体信息的值**——曾经把值散在 4 个命名空间 × 2 种语言里，
回填时必漏；`[待填写：XXX]` 占位符还因此被挂到线上，管局按「未准确悬挂备案号」驳回过一次。

| 字段 | 展示位置 |
|------|---------|
| `name` 执照名称 | 页脚版权行、`/contact`、`/terms` 第 1 节、`/privacy` 第 1 节 |
| `creditCode` 统一社会信用代码 | `/contact`、`/terms` 第 1 节 |
| `address` 经营地址 | `/contact`、`/terms` 第 1 节、`/privacy` 第 1 节 |
| `icp` ICP 备案号 | 全站页脚，链接 beian.miit.gov.cn |
| `police` 公安备案号 | 全站页脚，链接 beian.mps.gov.cn |
| `jurisdiction` 管辖法院所在地 | `/terms` 第 11 节 |

- **空字符串 = 该项未取得，对应展示行不渲染**。宁可不显示也不要挂占位符：
  管局审核会逐页核对，占位符等于「信息不实」
- **经营者姓名不进这个对象，也不对外公示**。《电子商务法》第 15 条要的是执照信息
  （名称 + 统一社会信用代码），不含经营者姓名
- 页脚版权行用 `copyrightOperator`（品牌 + 主体名），hover 眨眼那行用
  `copyrightOperatorAlt`——**两行都必须带主体名**。next-intl 会把整个消息包
  序列化进页面，任何不含主体的 `©` 字符串都会留在 HTML 源码里，
  管局明确要求「版权所有需与备案主体一致」，已经因此驳回过一次。
  连点 5 次的 toast 是临时提示、不构成版权声明，可以随便玩

- **法律页面共 4 个**：`/privacy`（13 节，PIPL 口径）、`/terms`（12 节）、`/eula`、`/refund`，
  四个页面都在 Footer 的 `legalLinks` 里，也都进了 `sitemap.ts` 的 `staticPages`（自动生成双语条目）
- **注册必须勾选同意**：`AuthForm` 的 `agreed` state 与 captcha 一起门控注册按钮
  （`disabled={loading || (mode === 'register' && (!captcha || !agreed))}`）。
  这是《个人信息保护法》要求的「同意」处理依据，不要改回被动告知文案
- 支付宝商户签约审核会逐项打开这些页面核对，缺页或信息不实是常见驳回原因

## 验证与 CI

`.github/workflows/ci.yml` 在 push 到 main 和所有 PR 上跑：

```bash
pnpm exec tsc --noEmit      # 类型
pnpm exec eslint src        # 0 error
pnpm test                   # vitest
pnpm build                  # 构建
```

改完至少跑 `pnpm test` 和 `pnpm build`。注意 **`pnpm build` 会覆盖 `.next`，跑完 dev server 要重启**。

## 待触发的事项（现在别做）

| 事项 | 触发信号 |
|------|----------|
| 分页与归档 | 文章超过 20 篇 |
| 话题提议后台页 | 收到第一条真实提议（现在只发邮件通知） |
| `series` 字段 | 辩论区真的开始成对写正反两篇 |
| 标签筛选/搜索、博客全文搜索 | 标签超过 30 个，或文章超过 20 篇。现在 18 个标签一屏放得下 |
| `posts.author_id` 加外键 | 出现孤儿投稿（作者注销但文章还在）时再说 |
| 给所有表加外键约束 | 出现孤儿评论/点赞/收藏/举报记录时。当前全站无外键,设计上已预期 |
| 评论树形查询优化 | 评论量增长后服务端按层级返回,加 `parentId` 索引 |
| /admin/comments 也加举报联动入口 | 评论量大后,目前仅 /admin/posts 有,且评论侧已有逐条举报按钮 |
| Pass 到期提醒与续费 | 卖出第一笔月付/年付 Pass。支付宝走的是单次付款不是代扣,到期后是**静默失效**,至少要在到期前发封邮件（`/apps` 的过期空态已经会提示,但用户得自己来看） |
| 后台加订单状态流转（paid → refunded） | 出现第一笔退款。目前只能靠撤销授权码间接收回访问权,订单本身还停在 paid |
| 上传 xnook / xisland / statux 的安装包 | 分发链路已就绪,但**还没有任何产品配了 `r2Key`**——签名公证好 dmg 后跑 `scripts/upload-release.mjs`,把它打印的条目粘进 products.ts 即可上线。xnook 在此之前是「付了 ¥9 拿不到东西」 |
| 限免产品恢复收费 | ex-memory / ui-design-system 想开始收费时,把 `originalPrice` 挪回 `price` 即可;在那之前它们也没有实际交付物,需要一并解决 |

**已完成的待办**（从上表移除,留作记录）：
- ✅ 阅读进度条（`BlogReadingProgress` 已上线,挂在 `/blog/[slug]` 和 `/blog/p/[id]`）
- ✅ 投稿的编辑与撤回（`updatePost`/`withdrawPost`/`deletePost` + `PostRowActions`）
- ✅ 评论（`comments` 表 + `CommentSection` + `/api/comments` + `/admin/comments` 审核页）
- ✅ `/eula` 和 `/refund` 页面（已创建,Footer 链接有效）
- ✅ 管理员越权编辑投稿（`asAdmin` 参数 + `/blog/submit?id=&admin=1`）
- ✅ 博客收藏功能（`post_favorites` 表 + `/api/blog/favorites` + `/blog/favorites` 页）
- ✅ `feedback`/`topics/propose` 输入净化统一（抽 `src/lib/sanitize.ts` 的 `sanitizeUserInput`,旧 `sanitizeInput` re-export 标 @deprecated）
- ✅ 用户协议 UGC 条款（EULA 第 8 节:8.1 内容授权 / 8.2 内容责任 / 8.3 审核与下架;提交表单与评论输入区加入「提交即同意」链接到 /eula）
- ✅ 修完全部 `react-hooks/set-state-in-effect` warning（实际 15 处,非原记的 7 处）,`eslint.config.mjs` 的 warn 覆盖已删,恢复为 error。改法:`useSyncExternalStore` 用于 matchMedia/深夜判定/locale/random quip 等外部状态;"渲染期调整状态"用于依赖变化重置派生状态(SpotlightSearch/InviteCodeManager/TerminalSection);fetch-on-mount 改用内联 fetch + `.then()` 回调,setState 全部异步,并保留事件处理器用的 `fetchXxx` wrapper

**开放 UGC 前还没做的合规项**：（已全部完成）用户协议 UGC 条款、举报入口均已上线。

---

## 工作流程

1. **使用 GSD 管理项目**
   - `/gsd-new-project --auto` - 初始化项目
   - `/gsd-plan-phase N` - 规划阶段
   - `/gsd-execute-phase` - 执行阶段

2. **设计审查流程**
   - 使用 `ui-review` 审查 UI
   - 使用 `ux-optimizer` 优化 UX
   - 使用 `frontend-design` 验证设计系统

3. **代码质量保证**
   - 使用 `react-patterns` 确保 React 最佳实践
   - 使用 `performance-optimization` 优化性能
   - 使用 `frontend-excellence` 确保代码质量

## 部署配置

- **平台**: Vercel
- **域名**: imagentx.top
- **自动部署**: 推送到 main 分支自动部署

## 联系方式

- **开发者**: meteor
- **邮箱**: meteor@stu.gpnu.edu.cn
- **网站**: https://imagentx.top


<claude-mem-context>
# Memory Context

# [meteor-store] recent context, 2026-08-12 1:04am GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 1 obs (66t read) | 22,855t work | 100% savings

### Jul 31, 2026
42 3:14p ⚖️ 个人主页功能优化需求确立
S29 优化个人主页功能，添加头像修改、联网搜索其他个人主页设计作为参考 (Jul 31 at 11:11 PM)
**Investigated**: 主会话正在调查项目现状：读取了 AuthProvider.tsx 了解认证上下文（User 接口含 id/email/name/isAdmin）；检查了 /api/auth/me 路由（isAdmin 每次请求现算不存 JWT）；查看了 products 页面结构；确认了 license_keys 表结构；搜索了 bio/个人简介相关字段（未找到任何引用）。

**Learned**: 项目 meteor-store 是 Next.js 电商项目（Drizzle ORM + PostgreSQL）。User 接口目前只有 id/email/name/isAdmin 四个字段。数据库 users 表已有 avatarUrl 字段但前端未使用。无 bio/个人简介字段。当前个人主页功能包括：首字母头像、昵称展示、邮箱、加入时间、邮箱验证状态、学生身份标识、修改昵称、修改密码。

**Completed**: 尚在调研阶段，未开始编码。已派研究代理在后台搜索个人主页设计参考。已完整梳理现有功能缺口。

**Next Steps**: 等待研究代理返回设计参考结果，然后开始实现：头像上传/修改功能（利用已有的 avatarUrl 字段）、bio 个人简介字段、授权码列表展示、投稿记录展示等个人主页功能完善。


Access 23k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
