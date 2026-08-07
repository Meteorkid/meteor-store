# 博客双时间维度与右侧垂直时间轴 · 设计文档

日期：2026-08-08
状态：设计已确认（方案 A：锚点映射 + 连续插值 + 松手吸附）

## 1. 背景

博客文章目前只有「发布时间」一个时间维度，列表按它排序。但很多文章写的是过去发生的事件（游记、回顾、专题），读者更需要按「事件发生时间」来浏览。同时，当一页文章较多时，读者需要频繁滚动才能找到目标篇目。

本次引入两个能力：

1. **双时间维度**：每篇文章除了「发布时间」（`date`），再增加「事件时间」（`eventDate`），两个维度都可作为排序依据。
2. **右侧垂直时间轴**：以当前页文章节点为刻度，支持拖动滑块实时滚动到对应文章，松手后吸附到最近节点；普通页面滚动时把手反向跟随。

覆盖范围：博客首页、分区页、标签页全部使用 `BlogListClient` 的页面。

## 2. 交互方案（已确认）

选择**方案 A：文章锚点映射**，而不是 IntersectionObserver：

- 拖动、页面滚动、文章节点三者的位置关系由**同一套锚点坐标映射**控制，状态单一、行为稳定，更像浏览器滚动条。
- IntersectionObserver 只擅长回答「当前看到哪一篇」，不能简化拖动映射，反而引入第二套状态来源。

交互细则：

- **拖动过程**用 `requestAnimationFrame` 即时滚动，避免反复触发 `smooth` 动画造成滞后。
- **松手后**吸附到最近的文章节点（按把手位置与各锚点距离取最近）。
- **普通页面滚动时**，根据文章锚点反向更新把手位置（只读跟随，不写回滚动）。
- **点击节点、键盘操作**时才使用平滑滚动（`scrollTo({ behavior: 'smooth' })`）。

## 3. 数据模型

### 3.1 站主文件文章（`content/blog/*.md`）

在 [src/data/blog.ts](file:///Users/meteor/github/meteor-store/src/data/blog.ts)：

- `FrontmatterSchema` 增加可选 `eventDate`，校验 `YYYY-MM-DD`；缺省时 `eventDate` 回落到 `date`。
- `BlogPost` 接口新增 `eventDate: string`。
- `toSummary` 增加 `eventDate` 透传。

```ts
const FrontmatterSchema = z.object({
  // ...现有字段
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '事件日期需为 YYYY-MM-DD')
    .optional(),
});

export interface BlogPost {
  // ...现有字段
  eventDate: string; // 事件时间，缺省回落到 date
}
```

### 3.2 读者投稿（数据库）

在 [src/lib/db/schema.ts](file:///Users/meteor/github/meteor-store/src/lib/db/schema.ts) 的 `posts` 表新增列：

```ts
eventDate: text('event_date'), // 事件时间，缺省回落到 publishedAt
```

对应 drizzle 迁移脚本 `drizzle/0025_add_post_event_date.sql`：

```sql
ALTER TABLE posts ADD COLUMN event_date TEXT;
```

在 [src/lib/posts.ts](file:///Users/meteor/github/meteor-store/src/lib/posts.ts)：

- `UserPost` 与 `PostRow` 增加 `eventDate: string | null`。
- `postColumns` 增加 `eventDate: posts.eventDate`。
- `createPost` / `updatePost` 的入参与写入增加 `eventDate`（可选，存 `YYYY-MM-DD` 或 null）。

### 3.3 合并层（[src/data/blog-feed.ts](file:///Users/meteor/github/meteor-store/src/data/blog-feed.ts)）

- `FeedPost` / `FeedPostSummary` 增加 `eventDate: string`。
- `fromFile` 与投稿映射处统一兜底：`eventDate: post.eventDate ?? post.date`（文件文章已在 parsing 层兜底，投稿在合并层兜底）。
- `toFeedSummary` 增加 `eventDate` 透传。

## 4. 排序逻辑

在 [src/components/BlogListClient.tsx](file:///Users/meteor/github/meteor-store/src/components/BlogListClient.tsx) 扩展现有 `SortMode`：

```ts
type SortMode = 'newest' | 'oldest' | 'reading-time' | 'event-newest' | 'event-oldest';
```

- `event-newest`：按 `eventDate` 倒序。
- `event-oldest`：按 `eventDate` 正序。

排序选项分组展示：现有「最新 / 最旧 / 最短」为「发布时间 / 阅读时长」组，新增「按事件时间」组（事件最新 / 事件最旧）。文案在 `messages/zh.json` / `messages/en.json` 的 `BlogList` 命名空间新增 `sortEventNewest`、`sortEventOldest`。

## 5. 垂直时间轴组件（`src/components/BlogTimeline.tsx`）

新增客户端组件，接收：`posts: FeedPostSummary[]`、`activeSlug`、`onSelect`。

### 5.1 锚点采集

- 列表项通过 `useRef` 回调或 `data-slug` 属性注册：每篇文章的 `offsetTop`（相对滚动容器/页面顶部）。
- 锚点数组 `anchors: { slug, top }[]`，按页面实际顺序记录。

### 5.2 坐标映射

- 时间轴把手位置 `p ∈ [0, 1]` 与滚动位置 `scrollTop` 通过锚点线性映射。
- **拖动**：把手位置 → 反查最近两个锚点 → 线性插值得到目标 `scrollTop` → `requestAnimationFrame` 内 `window.scrollTo(0, target)`（即时滚动，不 smooth）。
- **松手吸附**：把手位置 → 找最近锚点 → 平滑滚动到该锚点。
- **页面滚动**：`scroll` 事件（throttle 到 rAF）→ 当前 `scrollTop` 落在哪个锚点区间 → 反推把手位置 → 更新把手。

### 5.3 无障碍与键盘

- 时间轴为带 `role="slider"` 的可聚焦把手，`aria-valuemin/max/now`。
- 键盘上下键步进到相邻锚点，`Home`/`End` 到首末，均使用平滑滚动。
- `prefers-reduced-motion` 下关闭 `smooth`（含过渡与 transform）。

### 5.4 样式

- 固定于视口右侧（与服务端/分区文中已有的 `BlogReadingProgress` 不冲突，需核对右侧空间）。
- 玻璃材质（`.glass`），节点为圆点，当前高亮使用分区主题色 `--blog-accent`。
- 悬挂效果与 `@media (hover: hover) and (pointer: fine)` 一致。
- 移动端（窄屏）隐藏或收窄，避免遮挡内容；具体断点与现有博客布局对齐。

## 6. 投稿表单

`/blog/submit` 的 `PostSubmitForm` 增加「事件时间」输入：

- 可选输入，`YYYY-MM-DD`，缺省不填（投稿时事件时间回落到发布时间）。
- 提交参数走既有 `createPost` / `updatePost` 的 `eventDate` 字段。

## 7. 边界与异常

- `eventDate` 缺省一律回落到 `date`（文件文章）或 `publishedAt 日期部分`（投稿），保证任意排序都可用，不出现空值排序。
- 投稿的 `eventDate` 为 null 时，合并层兜底；不要求投稿必填事件时间。
- `BlogPost` 的 zod 校验对非法 `eventDate` 抛错让构建失败，与 `date` 行为一致。
- 时间轴在文章数 < 2 时不渲染（单节点无吸附意义）。
- 数据库迁移用新增列，不破坏既有行；老数据 `event_date` 为 null，由合并层兜底，无需回填。

## 8. 测试与验证

### 自动化测试

- `toSummary` / `toFeedSummary` 透传 `eventDate`。
- 文件文章缺省 `eventDate` 回落到 `date`。
- 投稿 `eventDate` 为 null 时合并层兜底到 `publishedAt` 日期部分。
- 排序：`event-newest` / `event-oldest` 结果正确。
- frontmatter 非法 `eventDate` 抛错。

### 构建与手动验证

- 运行 `pnpm test` 与 `pnpm build`。
- 首页 / 分区页 / 标签页：切换「按事件时间」排序正确。
- 拖动时间轴把手：页面即时跟随；松手吸附到最近文章。
- 页面滚动：把手反向跟随；点击节点平滑滚动。
- 键盘操作与 `prefers-reduced-motion` 行为。
- 1440 / 768 / 390px 下时间轴无横向溢出、不遮挡正文。

## 9. 预计改动范围

- 修改 `src/data/blog.ts`（frontmatter + `BlogPost` + `toSummary`）。
- 修改 `src/lib/db/schema.ts` 与新增 drizzle 迁移脚本。
- 修改 `src/lib/posts.ts`（`UserPost` / `PostRow` / `postColumns` / `createPost` / `updatePost`）。
- 修改 `src/data/blog-feed.ts`（`FeedPost` / 兜底 / `toFeedSummary`）。
- 修改 `src/components/BlogListClient.tsx`（排序逻辑 + 挂载时间轴）。
- 新增 `src/components/BlogTimeline.tsx`。
- 修改投稿表单 `PostSubmitForm`。
- 修改 `messages/zh.json` / `messages/en.json`（排序文案 / 事件时间 label）。
- 新增或更新数据层与排序相关测试。

不修改两类排序之外的既有文章渲染、两个 RSS、sitemap 与收藏/点赞逻辑。