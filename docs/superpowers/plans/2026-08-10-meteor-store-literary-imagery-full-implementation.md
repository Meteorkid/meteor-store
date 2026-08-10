# Meteor Store 全站文学意象完整实施计划

> 基于 [设计规格](../specs/2026-08-10-meteor-store-literary-imagery-full-design.md) | 日期：2026-08-10

## P0：星象事实归位

### 步骤 1：修正七曜数据顺序与测试

**文件**：`src/data/celestial.ts`

将 `SEVEN_LUMINARIES` 从当前 `[日, 月, 水, 金, 火, 木, 土]` 改为 `[日, 月, 火, 水, 木, 金, 土]`，使 index 0–6 对应周日到周六。

**文件**：`src/data/__tests__/celestial.test.ts`

新增测试：

```ts
it('七曜顺序对应星期天至星期六', () => {
  // 日曜=Sunday(0), 月曜=Monday(1), 火曜=Tuesday(2), 水曜=Wednesday(3),
  // 木曜=Thursday(4), 金曜=Friday(5), 土曜=Saturday(6)
  const expected = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
  SEVEN_LUMINARIES.forEach((luminary, i) => {
    expect(luminary.label.zh).toBe(expected[i]);
  });
});
```

新增测试：斗宿归属验证 —— `MANSION_GROUPS` 中 `blackTortoise.mansions[0]` 为 `'斗'`，且所有组中 `'斗'` 恰好出现一次。

### 步骤 2：修正斗宿说明

**文件**：`src/data/blog-sections.ts`

将 `story` 分区的 `star.reason` 从 `"斗柄纪时，取成长由岁月串成之意"` 改为 `"斗宿为北方玄武七宿之首，主体为南斗六星；取成长由岁月串成之意"`。

同步更新英文 `reason`：从 `"The Dipper marks time..."` 改为 `"The Dipper mansion heads the Black Tortoise; its main stars form the Southern Dipper — a story built across years."`

### 步骤 3：BlogTimeline 曜日按日期映射

**文件**：`src/components/BlogTimeline.tsx`

当前逻辑使用 `idx % 7` 分配曜日。改为：

```ts
const weekday = new Date(post.eventDate + 'T00:00:00').getUTCDay(); // 0=Sun
const luminary = SEVEN_LUMINARIES[weekday];
```

`eventDate` 可能缺省回退到 `date`，此逻辑在 `blog-feed.ts` 的 `toFeedSummary()` 中已处理，组件直接消费确保一致性。

### 步骤 4：四时题记标注

**文件**：`src/lib/celestial-season.ts`

在 JSDoc 中补充：`"四个边界 02-04 / 05-05 / 08-07 / 11-07 是设计分季，不是精确节气或星历计算。"`

### 步骤 5：同步修正中英文品牌文章

**文件**：`content/blog/zh/meteor-store-literary-imagery-design-philosophy.md`

- 七曜段落：将"目前它仍随文章在列表中的位置轮换，底层次序也尚未统一"改为"此前它随文章位置轮换，现已按星期次序与真实日期修正"。
- 斗宿段落：将"斗柄纪时"相关的北斗误写替换为斗宿归属（北方玄武、南斗六星）说明。

**文件**：`content/blog/en/meteor-store-literary-imagery-design-philosophy.md`

- 七曜段落：将 `At present, the labels still follow each post's position in the list...` 改为 `Previously the labels followed each post's position in the list; they have been corrected to match the day of the week and the actual date.`
- 斗宿段落：修正为与中文一致的归属说明。

### 步骤 6：验证

```bash
pnpm exec vitest run src/data/__tests__/celestial.test.ts src/lib/__tests__/celestial-season.test.ts
pnpm build
```

验收：构建通过；七曜映射与斗宿归属测试通过；中英文文章源码不含"尚待校正""斗柄纪时"误写。

---

## P1：全站语法契约

P1 无代码改动。规格文件 [2026-08-10-meteor-store-literary-imagery-full-design.md](../specs/2026-08-10-meteor-store-literary-imagery-full-design.md) 已在 P0 启动前完成并提交。本阶段仅确认：

- 规格文件在 `main` 分支存在且内容完整。
- 所有后续 P2–P4 改动以此规格为唯一评判来源。

---

## P2：全局壳层与流星雨

### 步骤 1：新建 BrandMark 组件

**文件**：`src/components/BrandMark.tsx`（新建）

```tsx
// 流星 SVG，约 24×24 viewBox，包含一条斜向流星轨迹 + 星点
// aria-label="Meteor Store"
// 接受 className 用于 Header/Footer 不同尺寸
```

从现有 Header 中提取流星图形，统一为一枚 SVG。

### 步骤 2：替换 Header 品牌图标

**文件**：`src/components/Header.tsx`

- 移除现有流星 emoji / SVG 图标。
- 引入 `<BrandMark className="h-7 w-7" />`。
- 保留现有的链接行为与 `aria-label`。

### 步骤 3：Footer 店灯改造

**文件**：`src/components/Footer.tsx`

- 移除火箭 emoji/SVG 与相关文案。
- 在版权行上方新建一座极简店灯 SVG（参考经典油灯轮廓，3–4 条路径，约 16×20 viewBox）。
- `aria-label` 使用 i18n key `footer.lampLabel`（zh: "店灯——仍有人在"，en: "The lamp is still lit"）。
- 保留现有五点星轨装饰线，位置不变。

**文件**：`messages/zh.json`、`messages/en.json`

新增 `footer.lampLabel`。

### 步骤 4：全局挂载 MeteorShower

**文件**：`src/components/MeteorShower.tsx`

当前组件已包含：全屏流星雨爆发、许愿流星（静止十秒后出现）、北斗偶现。本轮改动：

- 将组件从纯命令式（依赖 `meteor:burst` 事件和手动挂载）改为同时支持页面级自动背景：
  - 新增 prop `mode: 'background' | 'burst'`，默认 `'background'`。
  - `background` 模式：渲染极淡星空（约 60–80 颗静态星点 + 每 8–15 秒一颗随机流星）。
  - `burst` 模式：由 `meteor:burst` 事件触发，播放约 3 秒的高密度流星雨后回到 `background`。
- 移动端（`< 768px`）：`background` 模式星点降至 30 颗，流星间隔拉长至 20–30 秒。
- `prefers-reduced-motion`：关闭全部动画与随机流星，保留 30 颗静态星点。
- 使用 `Page Visibility API`：页面不可见时暂停 `requestAnimationFrame`，切回时恢复。

**文件**：`src/components/GlobalParticles.tsx`

`GlobalParticles` 当前渲染星空粒子与鼠标交互轨迹。由于 `MeteorShower` 接管星空层，需决策：

- 如果 `GlobalParticles` 仅用于首页 Hero，可将其逻辑并入 `HeroCanvas` 或保留为 Hero 专属组件。
- 如果它被多个页面引用，则精简为只保留 Hero 专属的交互粒子，去掉星空背景层。

当前用法检查：`rg "GlobalParticles" src` 确认引用范围后决定。若仅在首页 layout，则保留但去掉星空；若全局引用，则以 `MeteorShower` 替换其全局实例。

**文件**：`src/components/HeroCanvas.tsx`

去除重复的星空背景渲染，只保留 Hero 专属的 Canvas 文字交互效果。

### 步骤 5：接通彩蛋入口

**文件**：`src/components/EasterEggs.tsx`

当前 `meteor:burst` 事件已发送但无监听者。确认 `MeteorShower` 挂载后监听该事件：

```ts
// 在 MeteorShower 的 useEffect 中
const handler = () => setMode('burst');
window.addEventListener('meteor:burst', handler);
return () => window.removeEventListener('meteor:burst', handler);
```

### 步骤 6：路由级隔离

**文件**：`src/app/layout.tsx`

在根布局中引入 `MeteorShower`，但通过路由判断跳过静默层：

```tsx
// 伪代码
const pathname = headers().get('x-pathname') ?? '';
const isQuiet = /^\/(admin|login|register|forgot-password|reset-password|verify-email|refund|terms|privacy|eula)/.test(pathname);
if (!isQuiet) {
  // 渲染 MeteorShower
}
```

实际实现可用 Next.js middleware 设置 header，或在对应 layout 层级选择不渲染。

### 步骤 7：验证

```bash
pnpm build
```

- 验证 BrandMark 在 Header/Footer 均可见。
- 验证店灯 SVG 在 Footer 底部。
- 验证 `/admin` 和 `/login` 不渲染 MeteorShower（DOM 中无对应元素）。
- 验证移动端视口下粒子密度降低。
- 在桌面端触发 Konami 或终端 `meteor` 命令，确认全屏流星雨播放。
- 开启 `prefers-reduced-motion` 确认无动画、静态星点仍在。

---

## P3：相关阅读"小星官"与漏刻进度

### 步骤 1：新建排序工具函数

**文件**：`src/lib/related-posts.ts`（新建）

```ts
import type { FeedPostSummary } from '@/data/blog-feed';

export function getRelatedPosts(
  current: { href: string; sections: string[]; tags: string[] },
  pool: FeedPostSummary[],
  limit = 3,
): Array<FeedPostSummary & { reason: string }> {
  // 1. 排除自身（按 href）
  // 2. 按共同标签数降序
  // 3. 按任一分区重叠
  // 4. 按日期接近度
  // 5. 按 date 降序兜底
  // 6. 取前 limit 篇，每条附 reason 文案
}
```

**文件**：`src/lib/__tests__/related-posts.test.ts`（新建）

覆盖：排除自身、标签优先级高于分区、跨来源文章混合排序、空池返回空数组、仅一篇候选时返回一篇。

### 步骤 2：新建 RelatedPosts 组件

**文件**：`src/components/RelatedPosts.tsx`（新建）

- 接收 `currentHref`、`currentSections`、`currentTags`、`feedPosts`。
- 服务端调用 `getRelatedPosts`，客户端渲染。
- 桌面端布局：主星（当前文章，灰白色、稍大）+ 最多三颗伴星，SVG 连线仅在 `reason` 存在时渲染。
- 移动端（`< 768px`）：纵向排列，星点加缩小连线。
- 每条伴星显示：标题链接、日期、关联理由 `t-footnote`。
- 功能标题 `t-title-4`："继续读 / Continue reading"。
- 文化题记 `t-footnote text-white/30`："小星官 / Little Asterism"。
- 伴星 SVG：使用分区对应的四象色（从 `blog-sections.ts` 读取），无分区的投稿使用默认灰白色。
- 全组件 `aria-label` 包含"相关阅读"语义；星点与连线 SVG `aria-hidden`。

**文件**：`messages/zh.json`、`messages/en.json`

新增 key：`RelatedPosts.title`、`RelatedPosts.asterism`、`RelatedPosts.reasonTag`、`RelatedPosts.reasonSection`。

### 步骤 3：站主文章页接入

**文件**：`src/app/[locale]/blog/[slug]/page.tsx`

- 将现有的同分区三篇逻辑替换为 `getFeedPosts()` + `RelatedPosts`。
- 当前文章的分区从 frontmatter 的 `section` 取得；若文章属于多个分区（从 `blog-sections.ts` 推导），则传入所有重合分区。
- 改为调用 `getFeedPosts()` 可能导致该页从静态变为动态。需确认——如果该页已是 `force-static` 以外的方式渲染，此改动不影响性能基线。

### 步骤 4：投稿详情页接入

**文件**：`src/app/[locale]/blog/p/[id]/page.tsx`

- 在 `status === 'published'` 时，在评论区块之前渲染 `RelatedPosts`。
- 从当前投稿的 `tags` 和 `section`（投稿同属一个主分区）构建输入。
- 投稿详情页已是动态渲染，不影响构建策略。

### 步骤 5：扩展 revalidation

**文件**：`src/lib/posts.ts`

在 `revalidatePublishedPaths` 中新增：

```ts
revalidatePath('/blog/[slug]', 'page');
revalidatePath('/blog/p/[id]', 'page');
```

确保新投稿发布或旧投稿标签变更后，相关文件文章与投稿的"小星官"同步刷新。

### 步骤 6：阅读进度条改造

**文件**：`src/components/BlogReadingProgress.tsx`

- 将可滚动高度从 `document.documentElement.scrollHeight` 改为 `article` 或 `.blog-prose` 的底部位置。
- 进度条最右侧追加一个极淡刻度标记（CSS `::after` 伪元素或独立 `<span>`），使用 `text-white/25`、`t-footnote`。
- `aria-hidden` 保持。
- `prefers-reduced-motion` 下 `display: none`。

**文件**：`src/app/globals.css`

新增 `.blog-progress::after` 样式（若有）。

### 步骤 7：验证

```bash
pnpm exec vitest run src/lib/__tests__/related-posts.test.ts
pnpm build
```

- 站主文章与投稿下方均展示"继续读"区块。
- 预览模式投稿不展示。
- 关联理由文字正确。
- 移动端纵向排列。
- 进度条仅跟踪正文，刻度可见。

---

## P4：完整星图扩展与全站审计

### 步骤 1：StarMap 关系视图

**文件**：`src/components/StarMap.tsx`

- 新增 `viewMode` state：`'time' | 'relation'`，默认 `'time'`。
- 关系视图复用 `getRelatedPosts` 的逻辑：遍历所有文章，若两篇共享标签或分区，则在它们之间绘制连线。
- 连线颜色使用 `from` 文章所在分区的四象色；若文章无分区映射，使用默认 `rgba(167,139,250,0.3)`。
- 星点位置算法不变（仍按 `eventDate` 排序 + 正弦蜿蜒 + slug 哈希）。
- 修复 `sorted.length === 1` 时 `i / 0` 的边界：空节点提前返回 `[]`，连线渲染条件改为 `nodes.length > 1`。

### 步骤 2：星图页视图切换

**文件**：`src/app/[locale]/blog/stars/page.tsx`

- 在现有星图上方添加视图切换：两个 `button`（"时间星轨 / Timeline""关系星图 / Relations"），使用 `t-footnote`。
- 切换按钮 `aria-pressed` 绑定当前视图状态。

### 步骤 3：全站审计

逐页检查以下公开页面，确认至多一处低浓度意象：

- `/products`：产品集合页 —— 当前无星象元素，可保留空白或加入一条极淡星轨分隔线。不新增产品星名映射。
- `/docs`：帮助中心 —— 当前无星象元素，不需改动。
- `/open-source`：开源展示 —— 当前无星象元素，不需改动。

### 步骤 4：验证

```bash
pnpm build
```

- 星图页出现"时间星轨 / 关系星图"切换。
- 关系视图下有关联的文章出现连线。
- 单篇文章时星图不崩溃（现有文章数量 > 1，需手动创建边界测试或代码审查确认）。

---

## 跨阶段注意事项

- P0 的品牌文章修正会改动已发布内容，提交后需走完整部署流程（与 `6775ff2` 相同路径）。
- P2 和 P3 共享 `messages/*.json`，如在相邻分支并行开发需处理合并冲突。
- 当前工作区有 `src/data/__tests__/help.test.ts` 和 `src/data/help-articles.ts` 的未提交改动，与本方案无关，各阶段分支均应从 `main` 的干净 HEAD 创建。
- 当前工作区另有博客发布 API 的大量未提交改动（覆盖 `src/lib/posts.ts`、`messages/*.json` 等），P3 的 `revalidatePublishedPaths` 扩展需与之协调。建议：等博客 API 重构落定后再执行 P3，或 P3 在独立分支上仅改 `revalidatePublishedPaths` 的路径数组，不重构函数体。
