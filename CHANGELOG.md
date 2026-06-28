# Changelog

本文档记录 Meteor Store 网站的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.5.0] - 2026-06-28

### Added

- **SQLite 数据库**：Drizzle ORM + better-sqlite3，新建 orders 表持久化订单
- **产品查询工具**：`src/lib/products.ts`，从 `products.ts` 派生 ID/名称/价格查询
- **邮件发送**：Resend 集成，支付成功后自动发送确认邮件
- **成功页查单**：`/success` 从数据库查询订单真实性，显示真实状态

### Changed

- **产品数据单一源**：统一从 `products.ts` 获取产品 ID/名称/价格，删除 4 处重复映射
- **支付 API 重构**：订单创建时写入数据库，用 `products.ts` 替代硬编码 `PRICE_CNY_MAP`
- **PricingSection 重构**：从产品目录动态生成定价卡片，不再硬编码 3 个通用方案
- **PaymentModal 修复**：传递 `productId` 而非展示名，移除错误的 USD×7 汇率转换
- **成功页改造**：从静态页面改为 Server Component，查询数据库验证订单

### Fixed

- **产品 ID 不匹配**：前端发送展示名（如 "Ex-Memory"）但 API 期望 slug（如 "ex-memory"），现统一使用产品 ID
- **支付宝回调校验不完整**：增加 app_id 核对、金额校验、幂等处理
- **订单不持久化**：订单号生成后写入 SQLite 数据库
- **价格不一致**：统一从 `products.ts` 获取人民币价格，移除独立维护的价格表

### Removed

- `src/lib/lemonsqueezy.ts`（未使用的 Lemon Squeezy 集成）
- `src/app/checkout/page.tsx`（Lemon Squeezy checkout 页面）
- `payment.ts` 中重复的产品映射和价格表

## [0.4.0] - 2026-06-25

### Fixed

- **GlowButton 非法嵌套**：`<a>` 嵌套在 `<button>` 内（HTML5 非法），新增 `renderAs` prop 支持渲染为 `<a>` 标签，修复 HeroSection、CTASection 共 4 处
- **CSS transition 覆盖 hover 动画**：`.scroll-animate` 的 `transition` shorthand 覆盖了 Tailwind `hover:border-primary/50`，通过将 `.scroll-animate` 放入 `@layer base` 解决 CSS 层叠冲突
- **WechatPayModal 一帧闪烁**：`useEffect` 在绘制后重置 step，改为 `useLayoutEffect` 在绘制前同步执行
- **年付价格标签误导**：年付折扣价仍显示 `/月`，改为显示 `月 (年付)`

### Changed

- **合并 CTA 组件**：CTABanner + CTASection 合并为统一 CTASection，通过 `variant: 'bold' | 'subtle'` 区分样式，删除 CTABanner.tsx
- **合并 Features 组件**：FeaturesSection + FeaturesGrid + FeaturesList 合并为统一 FeaturesSection，通过 `layout: 'grid' | 'list'` 区分布局，删除 FeaturesGrid.tsx 和 FeaturesList.tsx

### Improved

- **ScrollAnimateInit 重构**：从每元素独立 IntersectionObserver 改为单一共享 observer，`Set` → `WeakSet` 自动清理，修复 observer 未 disconnect 的资源泄漏
- **BackToTop 节流**：scroll 监听器添加 `requestAnimationFrame` 节流，避免每帧触发 setState；添加 `{ passive: true }` 优化滚动性能

### Removed

- `CTABanner.tsx`（合并入 CTASection）
- `FeaturesGrid.tsx`（合并入 FeaturesSection）
- `FeaturesList.tsx`（合并入 FeaturesSection）

## [0.3.0] - 2026-06-24

### Fixed

- 首页定价→支付参数不匹配问题
- ScrollAnimateInit 6 个问题修复

### Added

- 产品演示区域
- 功能列表展示
- 支付流程（支付宝/微信）

## [0.2.0] - 2026-06-23

### Added

- 产品卡片组件
- 定价区域
- 功能对比表

## [0.1.0] - 2026-06-22

### Added

- 项目初始化
- Next.js 16 + TypeScript + Tailwind CSS 4
- 首页基础结构（Hero、Features、Footer）
