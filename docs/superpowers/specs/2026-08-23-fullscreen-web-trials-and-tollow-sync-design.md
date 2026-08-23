# 站内应用全屏体验与 Tollow 账号同步设计

> 日期：2026-08-23  
> 状态：已确认，待实施

## 1. 背景与目标

Meteor Store 已有 4 个在 `appComponents` 注册的可交互 Web 应用：

- WebGL Fluid Sim
- Skeleton Anatomy
- Chakra Visualizer
- Tollow

它们当前可通过产品页内嵌 iframe 或 `/apps/{id}/trial` 试用。本次改造的目标是：

1. 四个产品统一使用“产品页入口 → 新窗口 → 独立全屏应用”的体验模式。
2. 产品页不再内嵌完整应用，但保留现有视频演示区。
3. WebGL Fluid Sim、Skeleton Anatomy 和 Chakra Visualizer 继续免登录试用。
4. Tollow 要求登录，以支持跨设备阅读进度、练习记录和文本收藏。
5. 将浏览器里已有的 Tollow 本地记录安全、幂等地合并到登录账号。

`products.ts` 中的 `demo.mp4` 仅是视频素材，不属于可交互应用，不纳入全屏体验范围。Ex-Memory 保持已有的独立代理运行时方案，不纳入通用 trial 页改造。

## 2. 路由与页面架构

### 2.1 路由约定

复用现有试用路由，不新增一组平行的 `/experience` 路由：

| 产品 | 全屏体验路由 | 访问规则 |
| --- | --- | --- |
| WebGL Fluid Sim | `/apps/webgl-fluid-sim/trial` | 免登录 |
| Skeleton Anatomy | `/apps/skeleton-anatomy/trial` | 免登录 |
| Chakra Visualizer | `/apps/chakra-visualizer/trial` | 免登录 |
| Tollow | `/apps/tollow/trial` | 必须登录 |

Tollow 未登录时服务端直接重定向到：

```text
/{locale}/login?next=%2Fapps%2Ftollow%2Ftrial
```

登录成功后返回同一全屏体验路由。Tollow 的试用路由只检查登录态，不检查购买授权；`/apps/{id}` 正式授权路由和商业门控保持不变。

### 2.2 全屏应用壳

`/[locale]/apps/[id]/trial` 只渲染注册表中的应用本体：

- 占满 `100dvh × 100vw`。
- 不渲染 Meteor Store Header、Footer、产品标题或 `container` 外围。
- 根容器使用暗色背景、`overflow: hidden`；应用自身决定内部滚动。
- 未在 `appComponents` 注册的 ID 返回 404。
- 不通过客户端隐藏来实现 Tollow 登录门控；路由在服务端确认 session 后才渲染 Tollow 组件。

### 2.3 产品页入口

对 `appComponents` 注册的 4 个产品：

- 页面主行动区显示“在线体验”。
- 链接使用 `target="_blank"` 和 `rel="noopener noreferrer"`。
- 目标地址是当前 locale 下的 `/apps/{id}/trial`。
- 移除 `ProductAppTrial` 的产品页 iframe 区块，不再二次渲染应用。
- `ProductDemoEmbed` 和产品媒体里的视频演示保留。

可体验状态以轻量 `app-manifest` 为唯一数据源，不让客户端产品页引入完整 React 应用注册表。

## 3. Tollow 用户数据模型

本次迁移只新增表和索引，不修改现有用户、订单、授权、博客和收藏表。与现有 UGC 表一致，不添加到 `users` 的数据库外键，删除与导出由账号服务显式处理。

### 3.1 `tollow_book_progress`

| 字段 | 用途 |
| --- | --- |
| `user_id` | Meteor Store 用户 ID |
| `book_id` | Tollow 书籍 ID |
| `section_id` | 章节 ID |
| `segment_index` | 文本段索引 |
| `offset` | grapheme 字符偏移 |
| `updated_at` | ISO 时间，用于冲突解决 |

复合主键为 `(user_id, book_id)`。同一本书只保留一个最新位置。

### 3.2 `tollow_practice_sessions`

| 字段 | 用途 |
| --- | --- |
| `id` | 服务端记录 ID |
| `user_id` | Meteor Store 用户 ID |
| `client_record_id` | 本地会话 ID，用于幂等导入 |
| `book_id` / `book_title` | 练习来源 |
| `started_at` / `ended_at` | 开始和结束时间 |
| `duration_ms` | 练习时长 |
| `words_typed` | 完成字数 |
| `wpm` | 每分钟字数 |
| `accuracy` | 准确率 |
| `error_count` | 错误数 |
| `created_at` | 入库时间 |

`(user_id, client_record_id)` 唯一，防止重试和重复导入产生多份会话。按 `(user_id, started_at)` 建立索引，支持历史和趋势查询。

### 3.3 `tollow_text_favorites`

| 字段 | 用途 |
| --- | --- |
| `id` | 收藏 ID |
| `user_id` | Meteor Store 用户 ID |
| `book_id` / `book_title` | 书籍快照 |
| `section_id` / `section_title` | 章节快照 |
| `segment_index` | 段落索引 |
| `start_offset` / `end_offset` | 选区边界 |
| `quote` | 收藏原文快照 |
| `note` | 个人笔记 |
| `tags` | 标签数组 |
| `created_at` / `updated_at` | 创建和编辑时间 |

按 `(user_id, updated_at)` 和 `(user_id, book_id)` 建立索引。标签数量预期很小，首版使用 Postgres `text[]`，不额外引入标签关联表。

## 4. Tollow API 设计

| 方法与路径 | 行为 |
| --- | --- |
| `GET /api/tollow/progress` | 获取当前用户的全部书籍进度 |
| `PUT /api/tollow/progress` | 幂等更新单本书进度 |
| `GET /api/tollow/sessions` | 分页获取练习历史 |
| `POST /api/tollow/sessions` | 幂等新增练习记录 |
| `GET /api/tollow/favorites` | 搜索、筛选和分页查询收藏 |
| `POST /api/tollow/favorites` | 新增文本收藏 |
| `PATCH /api/tollow/favorites/{id}` | 修改当前用户收藏的笔记和标签 |
| `DELETE /api/tollow/favorites/{id}` | 删除当前用户的收藏 |
| `POST /api/tollow/import` | 分批幂等导入本地进度和练习记录 |

所有 API 遵循以下约束：

- 必须有 Meteor Store session；未登录返回 401。
- `userId` 只从服务端 session 读取，不接受客户端用户 ID。
- 查询、修改和删除条件都显式带 `user_id`。
- 外部输入经 Zod 校验。
- 原文上限 10,000 字，笔记上限 2,000 字；最多 10 个标签，每个最多 30 字。
- 导入与常规写入应使用项目现有的用户 + IP 限流策略；导入在客户端分批，避免大请求。

## 5. 同步与首次导入

### 5.1 导入范围

首次登录 Tollow 时读取：

- `tollow-book-progress-v1`
- `tollow_learning_progress`
- `tollow_practice_sessions`

只导入已确认的阅读位置和练习会话。主题、语言、快捷键、推荐偏好和学习目标继续保存在本机，不进入账号同步范围。

### 5.2 合并规则

- 阅读进度：服务器和本地都有记录时，`updatedAt` 较新者胜出。
- 练习会话：按 `(userId, clientRecordId)` 幂等插入。
- 导入成功后写入本地 `tollow-account-import-v1` 标记；未成功的批次可继续重试。
- 导入不删除原 `localStorage` 数据，本地副本作为离线缓存保留。

### 5.3 日常同步

- 阅读进度使用防抖写入，避免每次按键都请求服务器。
- 练习会话在会话结束时写入。
- 收藏操作使用乐观 UI，服务器失败时回滚或标记待同步。
- 网络失败的写入进入本地待同步队列，页面恢复连通或下次打开 Tollow 时重试。
- 同步状态是 `synced | pending | error`，仅在 Tollow 内以轻量文案呈现，不使用全局断网横幅。

## 6. Tollow 文本收藏交互

### 6.1 创建收藏

- 用户可选中任意文本；没有选区时可收藏当前段落。
- 选区后显示轻量浮动工具条，主操作为“收藏”。
- 默认可一步保存；展开后可同时填写笔记和标签。
- 保存选区起止位置和原文快照，保证书籍内容后续变化时仍能查看当时收藏的文字。

### 6.2 收藏列表

- Tollow 顶部提供“我的收藏”和同步状态入口。
- 桌面端使用右侧抽屉，移动端使用全屏面板。
- 支持原文与笔记关键词搜索、书籍筛选、标签筛选。
- 支持按最新、最早和原文位置排序。
- 详情操作包含：跳回原文、编辑笔记/标签、复制原文和删除。
- 删除需要二次确认，所有操作可用键盘完成。

### 6.3 定位降级

跳转时按 `bookId → sectionId → segmentIndex → offsets` 定位并高亮原文。如果书籍或章节已不存在，收藏仍显示原文快照、笔记和标签，但禁用“跳回原文”并说明原因。

## 7. 错误处理与隐私

- 首次导入失败不删除本地数据，不阻塞阅读与练习。
- 服务器返回个别越界或无效记录时，客户端忽略异常项并保留可用数据，不让整个应用崩溃。
- 用户数据导出加入 Tollow 进度、练习会话和收藏。
- 注销账号时显式删除三张 Tollow 表中该用户的数据。
- 日志不记录完整收藏原文、笔记内容或用户本地导入载荷。
- 账号注销与批量删除在单次部署中应按“先代码支持、再开放写入”的顺序上线，避免新数据无法随账号删除。

## 8. 迁移、上线与回滚

### 8.1 上线顺序

1. 对新表执行 additive migration，确认表和索引存在。
2. 部署 API、用户数据导出/注销支持和 Tollow 同步服务。
3. 部署产品页入口与全屏 trial 路由。
4. 线上验证三个公开应用、Tollow 登录返回、本地导入和收藏闭环。

### 8.2 回滚

- 应用代码可回滚到不读写 Tollow 新表的版本。
- 回滚时不删除新表，保留已同步的用户数据。
- 需重新上线时继续复用原表，幂等键防止重复导入。
- 只有在确认无任何有效用户数据且单独审批后，才可考虑后续删表；不属于本次回滚流程。

## 9. 测试与验收标准

### 9.1 路由与 UI

- 四个产品页的在线体验入口使用正确 locale 路径、新窗口和 `noopener noreferrer`。
- 产品页不再渲染交互应用 iframe，视频演示仍可用。
- 全屏试用页不包含 Header、Footer、标题或限宽容器。
- 三个公开应用未登录可访问；Tollow 未登录按 locale 跳登录并带安全 `next`。
- 四个应用在桌面和移动视口均占满可见区域，没有商城 chrome。

### 9.2 同步与数据

- 阅读进度在本地/服务器冲突时使用较新 `updatedAt`。
- 练习会话重试和重复导入不产生重复行。
- 本地数据导入可中断后继续，失败不会清除原数据。
- 新写入在网络失败时进入待同步队列，恢复后幂等补发。

### 9.3 收藏

- 可收藏选区或当前段落，保存完整来源与快照。
- 搜索、书籍/标签筛选、排序、编辑、复制、删除和跳转均可用。
- 失效来源仍显示快照，不发生无效跳转。
- 越权读、改、删其他用户收藏必须失败。
- 长度、标签数量、非法 ID 和批次大小越界必须返回明确 400。

### 9.4 账号数据权利

- 用户数据导出包含 Tollow 三类数据。
- 注销账号后三张 Tollow 表不再有该 `userId` 的记录。

### 9.5 回归

- 数据 schema、迁移 journal、API、同步服务、Tollow 关键交互和路由行为均有自动测试。
- TypeScript、ESLint、完整 Vitest 和 Next.js 生产构建通过。
- 线上手工验证四个新窗口入口、Tollow 登录返回、跨设备同步和收藏跳回原文。

## 10. 非目标

本次不包含：

- 将产品视频演示转为可交互应用。
- 修改 `/apps/{id}` 的付费授权逻辑。
- 要求三个公开试用应用登录。
- 同步 Tollow 主题、语言、快捷键、推荐偏好或学习目标。
- 收藏分享、公开收藏夹、协作批注或 AI 自动摘要。
- 对收藏标签建立全站公共词库。
- 在本次发布或回滚中删除 Tollow 用户数据表。
