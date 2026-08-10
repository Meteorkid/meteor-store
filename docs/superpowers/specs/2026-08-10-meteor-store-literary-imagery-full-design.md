# Meteor Store 全站文学意象完整设计方案

> 状态：待审核 | 日期：2026-08-10

## 一、背景与目标

Meteor Store 已经形成了流星、恒星、星轨、二十八宿、北斗、七曜等一套星象视觉语言。但当前存在三项结构性问题：

1. 部分文化事实有误（斗宿说明混用北斗属性、七曜顺序与日期无关）。
2. 各页面意象密度与语义关系未成文，扩展时容易在同一个流星上承载互相冲突的含义。
3. `048fd33` 一次改动 18 个文件，混入事实修正、视觉新增与数据定义，难以独立验收与回滚。

本文档为后续所有星象相关改动提供唯一语法来源，并拆为五个独立可交付的阶段。

核心原则：**结构中国、表面现代；功能优先、意象退后；数据驱动、不拼凑装饰。**

## 二、全站语义契约

### 2.1 三层语法

"观象、授时"有传统天文学依据；"成章"明确标注为 Meteor Store 的品牌延伸，不冒充历史术语。[中科院自然科学史研究所](https://english.ihns.ac.cn/an/an/201310/t20131010_110579.html) 将观象与授时概括为中国古代天文学的重要主题。

| 层级 | 核心含义 | 站内表达 |
|------|----------|----------|
| 观象 | 辨认内容的方位与关系 | 二十八宿、四象用于博客分类与星图外缘；星点、连线、文字保持现代克制 |
| 授时 | 让日期、季节与进度可感知 | 北斗负责四时题记与导航；七曜按真实日期映射；漏刻表示正文阅读进度；月相表示订阅周期 |
| 成章 | 作品从书写走向公开、长久存在 | 文章公开后成为恒星；产品只在集合与定价语境中作为稳定星点，不分配虚构星名 |

中国传统星图以星点、连线和文字为主要视觉语言，因此无需加入卷轴、祥云或仿古纹样，现有暗色科技风可以自然承载。[国家天文台资料](https://www.nao.cas.cn/ncb/gz/202204/t20220406_6419883.html)

### 2.2 意象词典

| 意象 | 含义 | 禁止用法 |
|------|------|----------|
| 流星 | 人的行动、经过与低频庆祝；短暂的、方向的、一次性的 | 不代表作品本身；不为每次点击播放；不作为加载指示器 |
| 恒星 | 已经留下来的公开作品或文章 | 不分配虚构星名；不映射用户或商业实体 |
| 星轨 | 真实存在的时间、顺序或内容关系 | 不为纯装饰画线；不连接无关系的内容 |
| 二十八宿与四象 | 博客分类与内容方位 | 不参与导航筛选；不宣称精确天文坐标；不映射用户身份 |
| 北斗 | 四时题记与导航指向 | 不与斗宿（南斗六星所在的玄武星宿）混用 |
| 七曜 | 日期节律 | 不用作分类标签或运势符号 |
| 月相 | 订阅周期 | 不扩展为农历或天文月相计算 |
| 漏刻 | 正文阅读进度 | 不以古代计时器 UI 呈现；不显示百分比或章节锚点 |
| 小店、信、灯与伞 | 人的在场与真实交付 | 灯不取代产品展示、购买或客服入口 |

### 2.3 动作语法

功能词始终优先：按钮仍叫"收藏、购买、提交"，文学词只进入成功反馈、辅助题记与设计说明。

| 用户动作 | 功能名称 | 文学语义 | 出现位置 |
|----------|----------|----------|----------|
| 写文章 | 写文章 / Write | 起笔 | 不对外显示，仅设计说明 |
| 提交审核 | 提交审核 / Submit | 候审 | 投稿成功提示 |
| 公开发布 | 发布 / Publish | 成章 | 审核通过反馈；文章落款 |
| 收藏 | 收藏 / Favorite | 藏星 | 收藏成功后的微提示 |
| 购买 | 购买 / Buy | 添灯 | 支付成功页辅助文案 |
| 等待加载 | — | 候光 | LoadingQuip 已有文案，保持不变 |

彩蛋属于"偶遇流星"——双击召唤、滚到底划过、终端命令等。不为此新增奖励循环或连续触发机制。

以下内容**明确不进入**本系统：三垣映射、运势、生日星宿、吉凶、实时天象、星座性格、五行配色。

## 三、页面浓度分级

全站不铺统一星象装饰层，按页面职责分四级：

### 3.1 高浓度

页面：`/story`、博客星图（`/blog/stars`）、文章详情页、分区页（`/blog/section/[section]`）

表达：完整语法——二十八宿外缘、四象色边框、北斗四时落款、七曜时间轴节点、流星划线、星轨连线、小星官相关阅读。

约束：正文区不上玻璃；星象关系来自真实数据（标签、分区、日期），不拼凑装饰连线；`prefers-reduced-motion` 下保留静态星点与文字，关闭全部动画。

### 3.2 中浓度

页面：定价（`/pricing`、首页 `#pricing`）、支付成功（`/success`）、404

表达：各自一段明确意象，不引入旁系语法。

- 定价：三档为三颗主星，桌面横轨、移动端纵轨，月付/年付/买断的小副标沿用"月相一轮 / 斗转一周 / 长明不息"。
- 成功页：保留 `MeteorConfetti` 一次性 3.2 秒流星轨迹；辅助文案可包含"添灯"语义。
- 404：保留现有导航性北斗七星，不改动。

约束：不超过各页现有视觉密度；成功页只对真实 `paid` 订单触发流星。

### 3.3 低浓度

页面：Header、Footer

表达：Header 使用共享流星 `BrandMark`；Footer 以店灯收尾、低透明度星轨衬在版权行上方。移除 Footer 现有的火箭图标。

约束：Header 不加全局粒子层（粒子由 `MeteorShower` 在页面层统一管理）；店灯为极简 SVG、无动画循环；读屏用户可通过 `aria-label` 感知。

### 3.4 静默层

页面：登录、注册、支付失败、退款、法律（EULA、隐私、退款政策）、后台（全部 `/admin` 路由）、表单错误

表达：直白功能语言，不出现任何星象文案或动画。

约束：后台页面、验证失败与退款流程禁止加文化装饰；`generateMetadata` 也不得在标题中泄露后台信息。

### 3.5 新增意象的通用检查

每处新增需回答三个问题，全部通过才能加入：

1. 这个意象是否由用户数据驱动（而非纯装饰）？
2. 读屏用户能否通过 `aria-label` 或相邻可见文本理解当前状态？
3. `prefers-reduced-motion` 下是否保留了全部必要信息？

## 四、五阶段实施路线

每阶段独立验收、可回滚，后一阶段不依赖前一阶段未完成的部分。

### 4.1 P0：星象事实归位

**范围**：`src/data/blog-sections.ts`、`src/data/celestial.ts`、`src/components/BlogTimeline.tsx`、`src/lib/celestial-season.ts`、`content/blog/zh/meteor-store-literary-imagery-design-philosophy.md`、`content/blog/en/meteor-store-literary-imagery-design-philosophy.md` 及相关测试。

**改动**：

- 斗宿说明修正为："斗宿为北方玄武七宿之首，主体为南斗六星；本站取意另见品牌转译。"四时落款只归北斗，不与斗宿混淆。
- 七曜数组重新按日、月、火、水、木、金、土排布，使 index 对应星期天至星期六。
- `BlogTimeline` 节点改为根据 `eventDate` 计算真实星期几，以 `weekday % 7` 取曜；不再按文章数组索引分配。
- 双轴默认展示日期统一：发布时间模式用 `date`，事件时间模式用 `eventDate`。默认列表仍按发布日期排序，但时间轴节点标签使用对应模式的日期。
- 四时题记继续使用 02-04、05-05、08-07、11-07 四个固定公历边界，文档与文章正文均标注为"设计分季，不是精确节气或星历计算"。
- 同步修正中英文品牌文章：将七曜段落的"尚待校正"改为"曾有误，现已按星期次序与真实日期修正"；斗宿段落的"斗柄纪时"改为明确归属说明。

**测试**：

- 七天到七曜的精确映射（`2026-08-09` 星期日 → 日曜，`2026-08-10` 星期一 → 月曜，依此类推）。
- 斗宿归属断言：`MANSION_GROUPS` 中斗宿处于 `blackTortoise` 组，不处于 `vermilionBird`。
- 四时题记边界保持现有测试覆盖。

**验收**：`pnpm build` 通过；相关测试全部通过；中英文文章页面源码中不再出现"尚待校正"或"斗柄纪时"误写。

### 4.2 P1：全站语法契约

**范围**：本规格文件本身即为交付物。

**内容**：将第二、三两节中的语义契约、意象词典、动作语法、浓度分级与无障碍要求整理为独立文件，存入 `docs/superpowers/specs/`。该文件是后续全部星象改动的唯一评判依据。

**不在本阶段做**：批量改页面文案、新增全局 Context、在每一页铺统一装饰层。

**验收**：文件存在于仓库中，包含完整的意象词典、浓度表与检查清单；CI 无关联改动。

### 4.3 P2：全局壳层与流星雨

**范围**：`src/components/Header.tsx`、`src/components/Footer.tsx`、`src/components/MeteorShower.tsx`、`src/components/GlobalParticles.tsx`、`src/app/layout.tsx`、`src/components/HeroCanvas.tsx`、`src/components/EasterEggs.tsx`。

**改动**：

- 新建 `BrandMark` 共享组件：一枚流星 SVG，Header 与 Footer 共用；`aria-label` 包含"Meteor Store"语义。
- Header 使用 `BrandMark` 替换现有流星 emoji / 图标。
- Footer：移除火箭图标与相关文案；底部改为一座极简店灯 SVG（`aria-label` 含"店灯——仍有人在"），其上方保留现有低透明度五点星轨。
- 全局挂载 `MeteorShower`：从根布局引入，替换 `GlobalParticles` 的星空层；覆盖所有公开内容与商业页面。
- 首页 `HeroCanvas` 只保留 Hero 专属的粒子效果与文字交互，不再重复绘制星空背景或流星。
- 现有彩蛋入口（Konami、终端 `meteor` 命令、Logo 七连点、`meteor.secret()`）接通 `meteor:burst` 事件，触发 `MeteorShower` 的全屏流星雨爆发。
- 静止十秒后的许愿流星与北斗偶现在 `MeteorShower` 内部实现，不依赖独立挂载。
- 移动端（`< 768px`）自动降低粒子数量至桌面端的 40%，减少 GPU 压力；`prefers-reduced-motion` 下关闭全部粒子动画，保留静态星点。
- 后台（`/admin/*`）、登录、注册、支付失败、退款、法律页面不渲染 `MeteorShower`，通过路由判断或 layout 层级隔离。

**不挂载**：`MeteorShower` 当前已有全屏爆发、许愿流星与北斗偶现代码，本轮接通但不过度扩展新效果。

**验收**：`pnpm build` 通过；`BrandMark` 在 Header 与 Footer 中渲染一致；店灯 SVG 在 Footer 底部可见；`MeteorShower` 在首页与博客页可见，在 `/admin` 与 `/login` 不可见；移动端粒子密度明显降低；彩蛋命令触发全屏流星雨；`prefers-reduced-motion` 下无动画。

### 4.4 P3：相关阅读"小星官"与漏刻进度

**范围**：`src/components/RelatedPosts.tsx`（新建）、`src/components/BlogReadingProgress.tsx`、`src/app/[locale]/blog/[slug]/page.tsx`、`src/app/[locale]/blog/p/[id]/page.tsx`、`src/lib/posts.ts`（仅 revalidation 路径）、`src/app/globals.css`、`messages/zh.json`、`messages/en.json`。

**改动**：

- 新建 `RelatedPosts` 共享组件：
  - 输入：当前文章的 `sections: string[]`、`tags: string[]`、`href: string`，以及完整的公开 feed `FeedPostSummary[]`。
  - 排序：共同标签数降序 → 任一分区重叠 → 时间接近度 → `date` 降序兜底。
  - 排除自身（按 `href`），取最多 3 篇。
  - 功能主标题："继续读 / Continue reading"，文化题记为 `t-footnote` 的"小星官 / Little Asterism"。
  - 每条伴星显示：标题、日期、关联理由（如"共同标签：随笔"或"同属文学区"）。
  - 无障碍：标准链接列表；星点与连线 SVG 整体 `aria-hidden`。
  - 移动端：改为纵向小星轨（垂直排列的星点与连线），不依赖 hover。
  - 桌面端：当前文章为主星，三颗伴星围绕，连线仅在存在真实关系时绘制。
- 站主文章详情页接入 `RelatedPosts`：使用 `getFeedPosts()` 获取全量数据，替换现有的同分区最新三篇硬编码逻辑。
- 投稿详情页接入：仅在 `status === 'published'` 时渲染 `RelatedPosts`；预览模式不展示。
- 文章详情页动态路由失效：在 `revalidatePublishedPaths` 中纳入 `/blog/[slug]`（文件文章）与 `/blog/p/[id]`（投稿）的 `page` 级 revalidation，避免新投稿发布后旧文章的"小星官"长期过期。
- 阅读进度条改造：
  - 改为只计量正文区域（`article` 元素或 `.blog-prose`），不再包含 Footer 与评论区。
  - 在进度条最右侧以 `t-footnote` 字号、`text-white/25` 显示极淡刻度线，不使用"漏刻"文字。
  - `aria-hidden` 保持不变，纯视觉反馈。
  - `prefers-reduced-motion` 下进度条直接消失（`display: none`），不保留瞬移版本。

**验收**：`pnpm build` 通过；站主文章与已发布投稿下方均展示相关阅读；预览模式的投稿不展示；理由文字正确反映标签或分区关系；移动端纵向星轨可见；进度条仅跟踪正文；`prefers-reduced-motion` 下进度条隐藏。

### 4.5 P4：完整星图扩展与全站审计

**范围**：`src/components/StarMap.tsx`、`src/app/[locale]/blog/stars/page.tsx`、产品集合页、帮助中心等公开页面。

**改动**：

- `StarMap` 新增"时间 / 关系"视图切换按钮，默认仍为时间星轨。
- 关系视图：使用与 `RelatedPosts` 相同的排序逻辑，在共享标签或分区的文章之间绘制关系连线；连线颜色使用对应文章所在分区的四象色；无关系的文章保持独立星点。
- 关系视图同样按 `eventDate` 排布星点位置，不改变现有坐标算法。
- 修复 `sorted.length === 1` 时 `i / (length - 1)` 的除零边界。
- 对产品集合页（`/products`）与帮助中心（`/docs`）做一次审计：确认每页至多一处低浓度意象，不新增装饰。
- 不新增其他页面意象；不追加漏刻、星座或其他星象语义。

**验收**：`pnpm build` 通过；星图页面出现"时间 / 关系"切换；关系视图下有关联的文章出现连线，颜色与分区色一致；单篇文章时星图不崩溃。

## 五、设计规则与护栏

### 5.1 文化事实规则

- 任何公开文案中出现的星象名称，必须在 `src/data/celestial.ts` 中有对应定义，并有测试覆盖其归属与顺序。
- 四象色的 RGB 值是本站设计色，不是传统标准色；文档与文章正文不得暗示其为"传统色彩"或"天文标准色"。
- 二十八宿外缘刻度是设计示意，不是精确古星图或实时天图；组件整体 `aria-hidden`，不参与导航。
- 星宿徽章说明（`reason` 字段）必须标注为"本站文学取意"，不得暗示为传统释义或天文事实。

### 5.2 视觉规则

- 玻璃只用于 chrome（导航、浮层、交互卡片），正文区不上玻璃。
- `-webkit-backdrop-filter` 必须写在 `backdrop-filter` 之前。
- 悬浮效果包在 `@media (hover: hover) and (pointer: fine)` 里。
- `prefers-reduced-motion` 下同时关闭 transition 和 transform。
- 暗色主题为唯一主题，不跟随系统深浅色。

### 5.3 文案规则

- 功能词（按钮、链接、表单标签）使用直白语言，不替换为文学语义。
- 文学词只出现在：成功反馈、辅助题记（`t-footnote`）、设计文档与品牌文章。
- 中英文文案必须同步更新；英文不使用机器直译，保持叙事语气一致。

### 5.4 性能规则

- 全局粒子层使用 `requestAnimationFrame`，在页面不可见时暂停（`Page Visibility API`）。
- 移动端粒子数量不超过桌面端的 40%。
- 新引入的 SVG 均为内联，不发额外网络请求。
- 不为此方案引入新的第三方依赖。

## 六、与现有系统的关系

| 现有系统 | 本方案关系 |
|----------|------------|
| `src/data/celestial.ts` | P0 修正数据顺序与归属测试；其余阶段只读 |
| `src/data/blog-sections.ts` | P0 修正斗宿 reason；其余阶段只读 |
| `src/components/StarMap.tsx` | P4 增加关系视图；P0–P3 不动 |
| `src/components/BlogTimeline.tsx` | P0 修正曜日映射；P2 不涉及 |
| `src/components/PostSignature.tsx` | P0 确认四时边界标注；其余不动 |
| `src/components/PricingSection.tsx` | 已挂载星轨与三主星，不纳入本轮改动 |
| `src/components/MeteorConfetti.tsx` | 保持现状，不纳入本轮改动 |
| `src/components/LoadingQuip.tsx` | 保持现状，不纳入本轮改动 |
| `src/components/EasterEggs.tsx` | P2 接通 `meteor:burst` 至 `MeteorShower` |
| `src/lib/posts.ts` | P3 仅扩展 `revalidatePublishedPaths` |
| 博客发布 API 工作区改动 | P3 的 `RelatedPosts` 只依赖 `FeedPostSummary`，不与 `posts.ts` 核心逻辑冲突 |

## 七、文件清单

| 阶段 | 文件 | 操作 |
|------|------|------|
| P0 | `src/data/celestial.ts` | 修改七曜顺序 |
| P0 | `src/data/__tests__/celestial.test.ts` | 新增曜日映射与归属测试 |
| P0 | `src/data/blog-sections.ts` | 修正斗宿 reason |
| P0 | `src/components/BlogTimeline.tsx` | 曜日按真实日期映射 |
| P0 | `src/lib/celestial-season.ts` | 补充文档注释 |
| P0 | `content/blog/zh/meteor-store-literary-imagery-design-philosophy.md` | 修正待校正表述 |
| P0 | `content/blog/en/meteor-store-literary-imagery-design-philosophy.md` | 修正待校正表述 |
| P1 | `docs/superpowers/specs/2026-08-10-meteor-store-literary-imagery-full-design.md` | 本文件 |
| P2 | `src/components/BrandMark.tsx` | 新建 |
| P2 | `src/components/Header.tsx` | 替换品牌图标 |
| P2 | `src/components/Footer.tsx` | 火箭改店灯 |
| P2 | `src/components/MeteorShower.tsx` | 全局挂载适配 |
| P2 | `src/components/GlobalParticles.tsx` | 移除或简化 |
| P2 | `src/components/HeroCanvas.tsx` | 去除重复星空 |
| P2 | `src/components/EasterEggs.tsx` | 接通 meteor:burst |
| P2 | `src/app/layout.tsx` | 引入 MeteorShower |
| P2 | `messages/zh.json`、`messages/en.json` | 店灯 aria 文案 |
| P3 | `src/components/RelatedPosts.tsx` | 新建 |
| P3 | `src/components/BlogReadingProgress.tsx` | 改造为正文范围 |
| P3 | `src/app/[locale]/blog/[slug]/page.tsx` | 接入 RelatedPosts |
| P3 | `src/app/[locale]/blog/p/[id]/page.tsx` | 接入 RelatedPosts |
| P3 | `src/lib/posts.ts` | 扩展 revalidation |
| P3 | `src/app/globals.css` | 进度条刻度样式 |
| P3 | `messages/zh.json`、`messages/en.json` | 小星官与相关阅读文案 |
| P4 | `src/components/StarMap.tsx` | 新增关系视图 |
| P4 | `src/app/[locale]/blog/stars/page.tsx` | 视图切换入口 |

## 八、实施约束

- P0 先于 P1–P4 执行。斗宿与七曜修正会改动已发布的中英文品牌文章，需与博客文章更新同步提交。
- P3 的 `RelatedPosts` 只依赖 `FeedPostSummary` 类型，不与当前博客 API 重构工作区冲突。但文件文章详情页从纯静态改为消费 `getFeedPosts()` 后，需确认不会导致该页面退化为全动态渲染。
- P2 的全局 `MeteorShower` 替换 `GlobalParticles` 后，需验证首页 Hero 区域没有出现双重星空。
- 各阶段均应在独立分支上开发，通过 CI 后合并，不在同一分支上混入多个阶段的改动。
