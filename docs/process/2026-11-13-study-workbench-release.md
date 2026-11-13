# 学习工作台三件套验收记录（2026-11-13）

按用户确认的顺序交付：① 学习工作台 ② 课程 Deadline + GPA ③ 算法训练和间隔复习。
设计文档见 `docs/superpowers/specs/2026-11-13-study-workbench-design.md`。

## 交付内容

### 数据层（迁移 0056，只新增表）

- `study_courses`（学期/名称/学分/成绩/状态）、`study_deadlines`（类型/截止/状态/关联课程）、`study_problems`（难度/主题/链接/复习 stage、到期日、间隔、上次复习）。
- 无外键、userId 归属、ISO 文本时间戳，与全站约定一致；索引 `(user_id, term)`、`(user_id, due_at)`、`(user_id, status)`、`(user_id, review_due_on)`。
- 账号导出与注销均已覆盖三张表（`user-data-export.ts`、`account-deletion.ts`，含字段白名单断言）。

### 服务与 API

- `src/lib/study/service.ts`：CRUD 全部带 userId 条件；删除课程在同一事务里把本人关联截止事项的 courseId 置空；题目 `todo → solved` 且未排期时写入初始复习（1 天后）；复习动作只对已解决题目生效。
- `/api/study/{courses,deadlines,problems}`：GET/POST/PATCH/DELETE；`/api/study/reviews`（POST 记录复习）；`/api/study/summary`（铃铛只读计数）。全部核对 `X-Study-User`、`assertMatchingOrigin`、限流、`Cache-Control: no-store`。

### 页面

- `/study` 工作台：要交的（课程截止 7 天/逾期 + 硕士/博士关注轮次 30 天内截止 + 收藏机会 30 天内截止）、要复习的（今日队列，可直接记录「记得/忘了」）、今日日刊各栏目发布状态、学习路径当前周、收藏计数。分区各自 `allSettled`，单区失败只降级该区。
- `/study/courses`：GPA 概览（加权平均、4.0 参考、学分/课程进度，附换算规则说明）、课程按学期分组 CRUD、截止事项 CRUD（日期或日期+北京时间时刻、关联课程、完成状态）。
- `/study/algorithms`：统计（总数/已解决/今日待复习）、今日复习队列（ReviewQueue 复用）、题目 CRUD 与筛选（全部/待解决/已解决/今日待复习）、复习进度（档位/间隔/下次日期/上次复习）。
- 导航「学习与机会」组新增第一分区「我的学习」三入口；`login-return` 白名单加入三条路径；三页 metadata noindex。

### 提醒集成

铃铛「提醒」标签新增只读「学习提醒」分区：今日复习数 + 7 天内课程截止数（单复数正确），链接到工作台；不产生未读状态。

## 验证

### 自动化

- `pnpm test`：385 个文件，4029 通过 / 47 跳过（含新增 review 8 例、gpa 14 例、study 服务 7 例、study 路由 9 例、工作台页面 4 例、导出/注销新增断言）。
- `pnpm exec eslint src`：0 error（4 个既有文件 warning 与本次无关）。
- `pnpm exec tsc --noEmit`：0 错误。
- `pnpm build`：通过，产物含 3 个页面与 5 个 API 路由。

### 本地浏览器验收（隔离环境）

环境：本机 PostgreSQL 18 独立库 `meteor_study_verify`（端口 5432，与生产无连接）、生产构建 `next start` 于 `127.0.0.1:3186`、两个专用测试账号（`study-verify@example.com` / `study-verify-2@example.com`），Playwright 浏览器操作。

已实测：

- 未登录访问三个页面 → 307 到 `/login?next=...`，登录后回跳原页面（实测 `/zh/study/courses` 回跳成功，标题「课程与 GPA」）。
- 课程：新增（数据结构 4 学分 92 分 → 加权 92、GPA 4.0 即时显示）→ 编辑（88 分、已完成 → 加权 88、GPA 3.7）→ 删除（确认弹窗文案正确；关联截止事项保留且解除关联，实测截止仍在列表）。
- 截止事项：新增（关联课程、日期）→ 工作台「要交的」出现「课程 · 数据结构 / 第三章作业 / 2 天后」→ 标记完成 → 从工作台消失；删除成功。
- 算法：新增（接雨水/动态规划/困难/链接）→ 标记已解决 → 显示「下次复习：明天复习·第 1 档 · 间隔 1 天」→ 到期后（本地改库模拟次日）出现在今日队列与工作台 → 点「记得」→ 队列清空、统计归零、数据库 `stage=1、interval=3、due=2026-11-16、last_reviewed=2026-11-13` → 列表显示「第 2 档 · 间隔 3 天 · 上次复习」→ 改回待解决 → 复习信息消失 → 删除成功。
- 工作台：截止、复习、日刊（本地库无日刊数据，显示空态）、学习路径（无计划空态）、收藏计数均按预期渲染；英文页（`/en/study` 等）文案与相对时间正确。
- 账号隔离：第二个账号三个页面与 `/api/study/summary`、`/api/study/courses` 均读不到第一个账号的数据（空列表、计数 0）。
- 铃铛：中文「学习提醒 / 1 道题今天待复习 / 7 天内 1 项课程截止」；英文「Study reminders / 1 problem due for review / 1 course deadline within 7 days」。
- 移动端 390×844：三个页面无横向溢出（scrollWidth = clientWidth）。
- 导航：桌面悬停「学习与机会」出现「我的学习」三分区入口，链接与描述正确。

### 未覆盖 / 边界

- 未在生产部署与验证；迁移 0056 尚未在线上执行。
- 未测试真实移动设备触屏、Safari/Firefox。
- 工作台的硕士/博士申请截止分区依赖生产数据，本地库无申请数据，仅验证了降级与空态路径；上线后需补看真实申请数据的展示。
- 铃铛学习分区在本地库用制造数据验证；未验证与真实日刊提醒同时出现时的布局。

## 回滚

- 迁移只新增三张表与索引；回滚保留数据，旧代码不读新表即可。部署顺序：先迁移后切应用。
