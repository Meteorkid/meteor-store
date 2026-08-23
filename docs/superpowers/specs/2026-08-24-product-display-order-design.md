# 产品展示顺序设计

> 日期：2026-08-24

## 目标

为 Meteor Store 建立独立、可测试的产品展示顺序，使首页精选和产品总页突出站点的核心产品，同时不改变支付、邀请码、Footer 等业务代码依赖的 `products` 原始数组顺序。

## 展示顺序

完整产品展示顺序固定为：

1. Ex-Memory
2. XIsland
3. XNook
4. Statux
5. Tollow
6. Skeleton Anatomy
7. WebGL Fluid Sim
8. OmniCrawl
9. UI Design System
10. Chakra Visualizer
11. Claude Phone Control
12. Cursor Source Analyzer

首页保持六张精选卡片，取完整展示顺序的前六项。产品总页展示全部产品；分类筛选只缩小集合，不改变产品之间的相对顺序。

## 方案

新增独立的产品展示顺序模块，导出完整的产品 ID 顺序和排序函数。排序函数接收任意带 `id` 的产品数组，按运营配置返回新数组，不修改输入数组。

首页配置从完整顺序派生前六项，继续通过现有的 `selectHomeFeaturedProducts` 选择产品。产品总页先本地化产品，再使用统一排序函数，最后执行分类筛选。

不直接调整 `src/data/products.ts` 中的产品定义顺序，避免影响后台邀请码默认选项以及其他依赖 `products[0]` 或原始顺序的业务代码。

## 异常与约束

- 展示配置引用不存在的产品时直接抛错，避免上线后静默缺卡。
- 配置不得出现重复 ID。
- 配置必须覆盖当前全部产品，新增产品时测试会提醒补充展示位置。
- 排序函数不原地修改调用方数组。

## 测试

- 校验完整顺序无重复并覆盖 `products` 的全部 ID。
- 校验排序函数返回约定的完整顺序。
- 校验首页固定展示前六项。
- 校验不存在的产品 ID 会抛出明确错误。
- 运行相关 Vitest 测试与 TypeScript 检查；若完整检查受工作区既有改动影响，单独说明。

## 影响文件

- 新增 `src/data/product-order.ts`
- 修改 `src/data/homepage.ts`
- 修改 `src/app/[locale]/products/page.tsx`
- 修改 `src/data/__tests__/homepage.test.ts`
- 新增或扩展产品顺序测试
