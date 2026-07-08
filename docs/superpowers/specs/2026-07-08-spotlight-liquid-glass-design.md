# Meteor Store 二期规划：聚焦搜索 · 液态玻璃 · 苹果级动画

日期：2026-07-08
状态：待用户审阅

## 0. 全站体检结论（多角度）

| 维度 | 现状 | 结论 |
|---|---|---|
| 视觉/交互 | 一期改版后已有辨识度（ASCII环/流星雨/终端） | 材质语言不统一：毛玻璃仅 Header 用了，卡片是平面暗色 |
| 动画 | 各组件各自为政（ease/duration 不一） | 缺统一的缓动/时长体系，无页面过渡 |
| 导航效率 | 9 个产品 + docs/blog/story 靠人肉找 | **缺搜索**，这是最大 UX 空洞 |
| 性能 | Canvas 动效已有离屏暂停/降级 | backdrop-filter 大面积使用需谨慎（本期新风险点） |
| 无障碍 | 一期达标（reduced-motion/aria/键盘） | 新增材质需支持 prefers-reduced-transparency |
| 业务闭环 | 支付/发货/重试完整 | **缺 License 验证 API**（发了钥匙没锁孔）；无数据统计（卖了什么流量哪来一无所知） |
| 内容 | 博客空壳、文档单薄 | 内容是 SEO 和信任的燃料，长期补 |
| 测试 | 62 例，关键路径已覆盖 | 新功能同步补测试即可 |

## 1. P1 · Spotlight 聚焦搜索（本期主角）

### 交互设计（对标 macOS Spotlight）
- **唤起**：`⌘K` / `Ctrl+K`；Header 放大镜按钮；`/` 键（非输入框时）
- **形态**：屏幕上 1/3 处悬浮玻璃面板，唤起时 spring 缩放+上浮入场（scale 0.96→1，180ms）
- **核心细节（用户指定）**：**面板透明度随输入递增**——空态时高透明（背景隐约可见，轻盈），每输入一个字符背景不透明度上调，打字越多面板越实，保证正在输入的文字始终清晰可读。实现：`background: rgba(18,14,32, clamp(0.45, 0.45 + query.length * 0.05, 0.92))`，配 150ms 过渡
- **键盘全操作**：↑↓ 选择、Enter 跳转、Esc 关闭；鼠标 hover 同步高亮
- **结果分组**：产品 / 页面 / 文档 / 彩蛋命令（搜 "hug" 能发现终端彩蛋，搜索本身也是彩蛋入口）
- **精准定位**：支持锚点级跳转（如搜"定价"→ 首页 #pricing 区块；搜"FAQ 退款"→ FAQ 展开对应条目）
- 空态文案：「找产品、找文档，或者输入 meteor 试试」；无结果：「什么都没找到，但你可以去终端碰碰运气」

### 技术方案（零新增依赖）
- 静态索引：构建时从 `data/products.ts` + 页面注册表生成搜索索引（name/tagline/features/keywords + 路由/锚点）
- 匹配：自写轻量模糊匹配（拼音首字母可选，暂不做），按命中位置+权重排序
- 组件：`SpotlightSearch.tsx`（Portal 全局挂载）+ `lib/search-index.ts`（纯函数，可单测）
- 无障碍：`role="dialog"` + `aria-activedescendant`、focus trap、Esc 关闭

## 2. P2 · 液态玻璃材质系统（Liquid Glass）

对齐 Apple 2025 Liquid Glass 语言的 Web 近似实现：

### 材质配方（globals.css 工具类）
```css
.glass     → backdrop-filter: blur(20px) saturate(1.6);
             background: 半透明分层 + 顶部 1px 白色高光内描边
             （inset 0 1px 0 rgba(255,255,255,.12)）+ 柔和外阴影
.glass-lg  → blur(32px)，用于 Spotlight/Modal 等悬浮层
.glass-interactive → hover 时高光跟随光标（--mouse-x/y 驱动的径向高光），
             模拟镜面反射
```

### 应用范围与克制原则
- **必上**：Spotlight 面板、PaymentModal、Header（升级现有）、终端窗口、Toast、BackToTop
- **选择性**：产品卡/评论卡边框高光化（不整卡 backdrop-filter——9 张卡同屏模糊是性能自杀）
- **性能红线**：同屏 backdrop-filter 元素 ≤3 个大面积实例；移动端 blur 半径减半
- **无障碍**：`prefers-reduced-transparency` 时退化为实色面板；`prefers-contrast: more` 提高边框对比

## 3. P3 · 苹果级动画体系

- **统一缓动**：全站替换为 Apple 风格 spring 近似曲线 `cubic-bezier(0.32, 0.72, 0, 1)`（出场）与 `cubic-bezier(0.2, 0.9, 0.3, 1)`（入场回弹），CSS 变量化（--ease-out-spring 等）
- **时长阶梯**：120ms（微交互）/ 240ms（组件）/ 400ms（页面级），变量化统一管理
- **微交互**：按钮按下 scale(0.97)、卡片 hover 抬升带 spring 回弹、输入框聚焦光环扩散
- **页面过渡**：Next.js `viewTransition` 实验开关 + View Transitions API，路由切换淡入+轻微上移（浏览器不支持时自动无过渡，渐进增强）
- **滚动叙事**：现有 scroll-animate 迁移到 CSS `animation-timeline: view()`（支持的浏览器原生丝滑，不支持回退现有 IO 方案）

## 4. P4 · Backlog（本期不做，排期在册）

1. **License 验证 API**（`GET /api/license/verify`）——发了钥匙没锁孔，业务闭环缺口，优先级最高的后端项
2. **轻量统计**：自托管 Umami 或 Vercel Analytics——现在对流量/转化完全盲飞
3. **博客内容启动**：把 /story 的写作水准复制到 2-3 篇技术文（爬虫反爬实战、ASCII 渲染原理——素材现成）
4. 文档深化：每产品至少快速上手+FAQ
5. 拼音搜索、搜索历史
6. OG 图动态生成（产品页各自的分享卡）

## 5. 实施顺序与验收

| 阶段 | 内容 | 验收 |
|---|---|---|
| P1 | 搜索索引 lib + Spotlight 组件 + 快捷键 + Header 入口 | 单测（索引/匹配/排序）+ 键盘全流程 + 透明度渐变实测 |
| P2 | 玻璃工具类 + 六处应用 + 降级 | 同屏 blur 计数 ≤3、reduced-transparency 验证、移动端帧率 |
| P3 | 缓动变量 + 微交互 + View Transitions | 交互抽查 + 构建通过 |
| 回归 | vitest + tsc + build + Lighthouse | LCP 不劣化 >10% |

## 6. 风险

- backdrop-filter 在低端安卓的性能——移动端减半 blur + 帧率守卫已有模式可复用
- View Transitions 为实验特性——仅做渐进增强，不依赖
- Spotlight 键盘监听与终端/秘技监听共存——统一在输入框聚焦时豁免其他监听（现有模式已处理）
