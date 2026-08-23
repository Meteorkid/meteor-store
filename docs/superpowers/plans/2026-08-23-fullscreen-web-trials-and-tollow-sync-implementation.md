# 站内应用全屏体验与 Tollow 账号同步 Implementation Plan

> 日期：2026-08-23
>
> 设计依据：`docs/superpowers/specs/2026-08-23-fullscreen-web-trials-and-tollow-sync-design.md`

## Goal

将 WebGL Fluid Sim、Skeleton Anatomy、Chakra Visualizer 和 Tollow 统一改为产品页新窗口打开的独立全屏体验；Tollow 要求 Meteor Store 登录，并将阅读进度、练习记录和完整文本收藏跨设备同步到账号。

## Constraints

- 交互应用范围只来自 `src/data/app-manifest.ts`，不把 `demo.mp4` 当成应用。
- 三个公开应用保持免登录；只有 Tollow trial 要求登录，且不要求购买授权。
- `/apps/{id}` 正式授权路由与现有 entitlement 判定不变。
- 产品视频演示保留；只移除 `ProductAppTrial` 的内嵌应用区块。
- 数据库迁移只新增表与索引，不修改或删除现有表。
- 生产回滚不删除 Tollow 用户数据表。
- 外部输入全部服务端校验，`userId` 只来自 session。
- 用户数据导出和账号注销必须与新写入一起上线。
- 现有未提交的 Ex-Memory 实现和其他脏文件不修改、不暂存。
- 每个行为按 RED → GREEN 单独完成；数据库生产迁移在部署前再单独确认。

## Task 1：统一产品页在线体验入口

**Files:**

- Modify: `src/app/[locale]/products/[id]/page.tsx`
- Modify: `src/data/app-manifest.ts`
- Modify/Delete: `src/components/ProductAppTrial.tsx`
- Create: `src/data/__tests__/fullscreen-app-trials.test.ts`
- Modify: 产品页相关测试

1. 写失败测试，验证 4 个 `appIds` 都推导出 `/{locale}/apps/{id}/trial`。
2. 写失败测试，验证产品页的体验链接使用 `_blank` 与 `noopener noreferrer`。
3. 写失败测试，验证非注册应用不出现可交互体验入口，Ex-Memory 现有 `experienceUrl` 入口不受影响。
4. 从轻量 `app-manifest` 导出可服务端使用的体验判定，避免产品页 import React 应用注册表。
5. 在产品页主行动区渲染全屏体验链接。
6. 移除 `<ProductAppTrial product={product} />` 及无消费方的组件文件；保留 `ProductDemoEmbed`。
7. 运行聚焦 Vitest 和 TypeScript。

## Task 2：将 trial 路由改为真正的全屏应用壳

**Files:**

- Modify: `src/app/[locale]/apps/[id]/trial/page.tsx`
- Create: `src/components/apps/FullscreenTrialShell.tsx` （仅在确有共用边界时）
- Create/Modify: `src/app/[locale]/apps/[id]/trial/__tests__/page.test.tsx`
- Modify: `src/lib/__tests__/proxy-nonce.test.ts`

1. 写失败测试：三个公开 app ID 未登录时直接渲染应用。
2. 写失败测试：Tollow 未登录重定向到当前 locale 登录页，`next=/apps/tollow/trial`。
3. 写失败测试：Tollow 已登录时渲染应用，不要求 entitlement。
4. 写失败测试：页面不包含 Header、Footer、标题和 `container`，根容器为 `h-dvh w-screen overflow-hidden`。
5. 在服务端完成 ID 注册表验证与 Tollow session 门控，再渲染应用。
6. 确认 CSP 和 `frame-ancestors` 仍允许现有同源 trial 路由，不扩大其他路由的 iframe 权限。
7. 用 375、768、1440 视口检查四个应用的滚动与高度。

## Task 3：新增 Tollow schema 与 additive migration

**Files:**

- Modify: `src/lib/db/schema.ts`
- Create: 下一个 Drizzle migration `drizzle/0035_*.sql`
- Modify: `drizzle/meta/_journal.json`
- Create/Modify: 对应 Drizzle snapshot
- Create: `src/lib/__tests__/tollow-schema.test.ts`
- Modify: `src/lib/__tests__/migration-journal.test.ts`

1. 写失败测试锁定 `tollow_book_progress`、`tollow_practice_sessions`、`tollow_text_favorites` 的表名、字段、复合唯一键与索引。
2. 在 `schema.ts` 增加三张表；时间字段继续使用项目的 ISO text 约定。
3. `tags` 使用 `text[]`；WPM/准确率使用能稳定表达小数的 Postgres 类型，在 API 边界转为 number。
4. 使用项目现有 Drizzle 命令生成 migration/snapshot，不手写伪 snapshot。
5. 检查 SQL 只有 `CREATE TABLE` / `CREATE INDEX` 等 additive 操作，不包含 `DROP`。
6. 运行 schema 和 migration journal 测试；开发库执行前保留可回滚的 SQL 审查点。

## Task 4：建立 Tollow 服务层与公共合约

**Files:**

- Create: `src/lib/tollow-contract.ts`
- Create: `src/lib/tollow.ts`
- Create: `src/lib/__tests__/tollow.test.ts`

1. 先定义进度、练习会话、收藏和导入批次的 Zod schema 与序列化类型。
2. 写失败测试覆盖：原文 10,000 字、笔记 2,000 字、10 个标签、标签 30 字、非负偏移与合法 ISO 时间。
3. 写失败测试覆盖阅读进度“较新 `updatedAt` 胜出”。
4. 写失败测试覆盖会话 `(userId, clientRecordId)` 幂等写入。
5. 实现按用户读写进度、会话和收藏的服务函数；更新/删除收藏必须使用 `id AND userId` 条件。
6. 收藏搜索只搜索当前用户的 quote/note，书籍/标签/排序参数使用白名单。
7. 服务层不记录 quote、note 或完整 import payload。

## Task 5：实现进度、会话与首次导入 API

**Files:**

- Create: `src/app/api/tollow/progress/route.ts`
- Create: `src/app/api/tollow/sessions/route.ts`
- Create: `src/app/api/tollow/import/route.ts`
- Create: `src/app/api/tollow/__tests__/progress.test.ts`
- Create: `src/app/api/tollow/__tests__/sessions.test.ts`
- Create: `src/app/api/tollow/__tests__/import.test.ts`

1. 每个路由先写 401 测试，确保无 session 时不调用服务层。
2. 写 400 测试覆盖非法进度、会话、时间和过大导入批次。
3. 写成功测试确认 API 传入的用户 ID 来自 session，客户端同名字段被忽略/拒绝。
4. 实现 `GET/PUT progress`、`GET/POST sessions`、`POST import`。
5. import 返回每批的 accepted/duplicate/rejected 计数，让客户端可恢复重试。
6. 在写入路由上增加用户 + IP 限流，区分常规高频进度与低频批量导入。
7. 运行路由测试、TypeScript 和变更文件 ESLint。

## Task 6：实现收藏 API

**Files:**

- Create: `src/app/api/tollow/favorites/route.ts`
- Create: `src/app/api/tollow/favorites/[id]/route.ts`
- Create: `src/app/api/tollow/__tests__/favorites.test.ts`

1. 写失败测试覆盖收藏列表的关键词、书籍、标签、排序和分页参数。
2. 写失败测试覆盖新增收藏的完整来源、长度上限和选区边界。
3. 写失败测试覆盖 PATCH 只允许改 note/tags，不允许篡改收藏所有者或来源。
4. 写失败测试覆盖跨用户读/改/删返回 404，不泄露 ID 是否存在。
5. 实现 `GET/POST favorites` 和 `PATCH/DELETE favorites/{id}`，增加用户 + IP 限流。
6. 运行收藏 API 与服务层回归。

## Task 7：建立 Tollow 客户端同步层

**Files:**

- Create: `src/apps/tollow/services/accountSyncService.ts`
- Create: `src/apps/tollow/hooks/useAccountSync.ts`
- Modify: `src/components/apps/TollowApp.tsx`
- Modify: `src/apps/tollow/services/bookProgressService.ts`
- Modify: `src/apps/tollow/services/progressService.ts`
- Create: `src/apps/tollow/services/__tests__/accountSyncService.test.ts`
- Modify/Create: book/progress service tests

1. 先写同步状态机测试：`synced → pending → synced/error`，同一队列项不并发重复发送。
2. 写失败测试：首次启动读取三个旧 storage key，按服务端批大小分批导入。
3. 写失败测试：中途失败不写完成标记、不删本地原数据；重试从未确认批次继续。
4. 写失败测试：阅读进度在本地/远端合并时较新 `updatedAt` 胜出。
5. 写失败测试：进度防抖写入，练习会话结束后写入；网络失败进本地 `tollow-account-sync-queue-v1`。
6. 实现一个统一同步服务，向业务层暴露小接口，不让 React 组件直接操作队列细节。
7. TollowApp mount 时启动首次合并和队列恢复，unmount 时清理 timer/listener。
8. 保留当前 localStorage 写入作为本地缓存，不把服务器 RTT 放进打字按键路径。

## Task 8：实现 Tollow 文本收藏客户端

**Files:**

- Create: `src/apps/tollow/services/favoriteService.ts`
- Create: `src/apps/tollow/features/favorites/FavoriteComposer.tsx`
- Create: `src/apps/tollow/features/favorites/FavoritesDrawer.tsx`
- Create: `src/apps/tollow/features/favorites/FavoriteList.tsx`
- Create: `src/apps/tollow/features/favorites/FavoriteEditor.tsx`
- Create: `src/apps/tollow/features/favorites/favorites.css`
- Modify: `src/apps/tollow/features/typing/Practice.tsx`
- Modify: `src/apps/tollow/shared/layout/Header.tsx`
- Modify: `src/apps/tollow/styles/index.css`
- Create: 相关 Vitest 组件/服务测试

1. 先为“选中文本”和“无选区收藏当前段落”写失败测试，使用 `bookId/sectionId/segmentIndex/offsets` 作为稳定位置。
2. 实现选区浮动工具条；默认一键收藏，可展开笔记与标签。
3. 为乐观新增、编辑和删除写失败测试，服务器失败时进待同步队列并保留可见状态。
4. 实现桌面右侧抽屉与移动全屏面板；最小宽度、safe-area 和滚动不覆盖打字主区。
5. 实现关键词、书籍、标签筛选与最新/最早/原文位置排序；查询参数与 API 合约一致。
6. 实现编辑笔记/标签、复制原文与二次确认删除。
7. 为“跳回原文”写失败测试：正常来源切书/章节、定位并高亮；失效来源显示快照但禁用跳转。
8. 完成焦点圈、Escape 关闭、焦点返还、键盘操作与 reduced-motion 处理。
9. Header 增加“我的收藏”和 `synced/pending/error` 状态，不使用全局断网横幅。

## Task 9：纳入用户数据导出与账号注销

**Files:**

- Modify: `src/lib/user-data-export.ts`
- Modify: `src/lib/account-deletion.ts`
- Modify: `src/lib/__tests__/user-data-export.test.ts`
- Modify: `src/lib/__tests__/account-deletion.test.ts`

1. 写失败测试：用户导出包含 Tollow 进度、会话和收藏，不包含他人数据。
2. 实现三个按 `userId` 的导出查询，收藏保留原文/笔记/标签供本人导出。
3. 写失败测试：账号注销在删除 `users` 之前删除三张 Tollow 表中该用户数据。
4. 实现删除顺序；保持订单/授权的现有法定留存策略不变。
5. 运行账号数据权利聚焦测试和完整回归。

## Task 10：整体回归、数据库上线与线上验收

1. 执行聚焦测试：trial 路由、产品入口、schema/migration、Tollow 服务/API/同步/收藏、用户数据导出/注销。
2. 执行 `pnpm test`、`pnpm exec tsc --noEmit`、变更文件 ESLint、`git diff --check`、`pnpm build`。
3. 审查生产 migration SQL 只包含 additive 操作，确认影响范围与回滚策略后，在获得生产数据库写入确认后执行迁移。
4. 先部署包含 API、导出和注销支持的 Meteor Store 产物，再开放 Tollow 客户端写入。如果同一产物部署，数据库迁移必须在重启前完成。
5. 线上检查：
   - 四个产品页入口使用新窗口和正确 locale。
   - 三个公开应用在无登录 session 下全屏可用。
   - Tollow 未登录跳登录，登录后返回全屏应用。
   - 本地进度/会话首次导入只合并一次，刷新不重复。
   - 另一浏览器登录同账号可看到进度、会话和收藏。
   - 收藏创建、搜索/筛选、编辑、复制、删除与跳回原文闭环可用。
   - 导出文件包含 Tollow 数据；受控测试账号注销后新表无残留行。
6. 保留 `.next` 与数据库迁移前状态作为回滚点；应用回滚时不删除 Tollow 表。
7. 更新 `/Users/meteor/obsidian/项目总结/` 中的 Meteor Store/Tollow 项目总结，记录同步冲突规则、数据边界、迁移/回滚点和线上验收结果。
8. 实现完成后列出精确改动文件，与仓库原有脏改动分开；获得用户确认后再创建实现提交。
