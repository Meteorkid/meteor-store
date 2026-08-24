# Ex-Memory 新窗口全屏体验 Implementation Plan

> 日期：2026-08-23
>
> 设计依据：`docs/superpowers/specs/2026-08-23-ex-memory-fullscreen-experience-design.md`

## Goal

让产品页在线体验在新窗口打开；未登录直接进入登录页，登录后返回只包含全屏
Ex-Memory 的页面；用真实健康探测替代不可靠的浏览器 `offline` 事件判断。

## Constraints

- 保留 `/apps/ex-memory` 作为 Meteor Store session 门控，不把登录逻辑移进 Nginx。
- 保留现有 Nginx `auth_request`、iframe sandbox、ready/expired 消息协议。
- 不修改 Ex-Memory 用户映射、业务 API、数据目录或已有体验数据。
- 两个仓库的原有无关脏文件不修改、不暂存。
- 每个行为按 RED→GREEN 单独完成；实现代码未经用户确认不提交。

## Task 1：新窗口入口与未登录直跳

**Meteor Store files:**

- Modify: `src/app/[locale]/products/[id]/page.tsx`
- Modify: `src/data/__tests__/ex-memory-experience.test.ts`
- Modify/Create page behavior test as needed

1. 写失败测试验证在线体验链接包含 `_blank` 和安全 `rel`。
2. 写失败测试验证未登录 `/apps/ex-memory` 重定向到本地化登录页，并携带
   `next=/apps/ex-memory`。
3. 最小修改产品链接和服务端页面，使测试通过。

## Task 2：全屏体验容器

**Meteor Store files:**

- Modify: `src/app/[locale]/apps/ex-memory/page.tsx`
- Modify: `src/components/ExMemoryExperienceFrame.tsx`
- Modify related tests

1. 写失败测试验证已登录页面不再渲染 Header/Footer/介绍区。
2. 写失败测试验证 iframe 占用 `100vw × 100dvh`，没有容器边框、圆角和间距。
3. 最小修改页面和 frame；保留加载、重试、ready 与 session-expired 行为。

## Task 3：真实连通性检测

**Ex-Memory files:**

- Modify: `web/static/app.js`
- Modify: `tests/test_discover_page.py` 或新增聚焦静态行为测试

1. 写失败测试：`offline` 监听器不得直接显示横幅，必须调用同源健康探测。
2. 实现带短超时、`no-store` 的 `${BASE_PATH}/health` 请求；失败才进入离线态。
3. 写失败测试：任意 API 成功响应会清除离线态并在恢复时刷新离线队列。
4. 最小接入现有 API wrapper，使测试通过；不增加周期轮询。

## Task 4：回归与部署

1. Meteor Store：相关 Vitest、TypeScript、变更文件 ESLint、生产构建。
2. Ex-Memory：相关 pytest、Ruff、`node --check web/static/app.js`、生产 Docker 构建。
3. 先滚动更新 Ex-Memory 容器并验证 health/readiness，再更新 Meteor Store `.next`。
4. 线上验证新窗口属性、未登录直跳、全屏 iframe、API 200 时无离线横幅、运行时
   未登录仍为 401。
5. 更新 Obsidian 项目总结；报告回滚位置和未提交实现文件。
