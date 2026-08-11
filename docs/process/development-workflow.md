# Meteor Store 开发流程

> 本文档描述从需求到上线的完整流程。每个阶段有明确的入口、出口和检查清单。

## 流程总览

```
需求 → 设计 → 开发 → 测试 → 部署 → 运维 → 迭代
  │      │      │      │      │      │      │
  PRD   设计   编码   单元   Staging 监控   反馈
  Issue  文档   PR     E2E    生产    告警   Backlog
         ADR          自审          日志
```

## 1. 需求阶段

### 入口
用户反馈、自己的想法、数据洞察

### 流程
1. **小需求 / Bug**：直接创建 GitHub Issue（`Bug Report` 或 `Feature Request` 模板）
2. **大功能**：先写 PRD（`PRD` Issue 模板），包含用户故事、验收标准、影响分析
3. **需求评审**（自审清单）：
   - [ ] 这个需求解决了谁的什么问题？
   - [ ] 不做会怎样？（拒绝比做更重要的能力）
   - [ ] 有没有更简单的方案？
   - [ ] 会影响哪些现有功能？

### 出口
- Issue 创建并打上标签
- PRD 中包含明确的验收标准

## 2. 设计阶段

### 入口
Approved 状态的 Issue / PRD

### 流程
1. **涉及 UI 的功能**：写设计文档（`docs/process/design-template.md`）
2. **涉及架构决策**：写 ADR（`docs/process/adr-template.md`），放在 `docs/process/adr.md`
3. **设计文档存于** `docs/superpowers/specs/`，命名格式 `YYYY-MM-DD-功能名-design.md`
4. **实施计划存于** `docs/superpowers/plans/`，命名格式 `YYYY-MM-DD-功能名-implementation.md`

### 设计自审清单
- [ ] 数据模型是否合理？（字段类型、默认值、索引）
- [ ] API 设计是否符合项目惯例？（RESTful、错误码、限流）
- [ ] 安全考量是否完备？（鉴权、输入校验、信息泄露）
- [ ] 是否考虑了边界情况？（空状态、错误状态、并发）
- [ ] 是否对现有功能有破坏性影响？
- [ ] 是否需要数据库迁移？（如有，写清楚回滚方案）

### 出口
- 设计文档完成
- 如有架构决策，ADR 已写入 `docs/process/adr.md`

## 3. 开发阶段

### 入口
设计文档完成，验收标准明确

### 流程
1. 从 `main` 创建功能分支：`feature/xxx`、`fix/xxx`、`refactor/xxx`
2. 编码时遵循 `AGENTS.md` 中的所有约定
3. 写完代码后做**代码自审**（见 [代码自审清单](#代码自审清单)）
4. 提交 PR，填写 PR 模板
5. CI 自动运行：类型检查 → Lint → 单元测试 → 构建

### 开发规范速查
- 排版：改字号必须同时改字重、行高、字距（见 AGENTS.md 字阶表）
- 颜色：全站暗色一套，`:root:root` 不要改成 `:root`
- 数据：博客文章统一走 `src/data/blog-feed.ts`，不要直接 `import blogPosts`
- 鉴权：后台对非管理员返回 404，`generateMetadata` 也要跟权限走
- 条件更新：避免 TOCTOU，用 `WHERE id AND status='pending'`

### 出口
- PR 创建，CI 全部通过
- 手动测试关键路径通过

## 4. 测试阶段

### 测试层次

| 层次 | 工具 | 覆盖范围 | 运行时机 |
|------|------|----------|----------|
| 单元测试 | Vitest | 工具函数、服务层逻辑 | CI 每次提交 |
| E2E 测试 | Playwright | 关键用户流程 | CI / 发布前 |
| 手动测试 | 人工 | 新功能、UI 细节 | 每个 PR |

### 测试要求
- **核心逻辑**：必须写单元测试（auth、支付、授权、博客渲染）
- **关键流程**：必须有 E2E 测试（注册→验证→登录→购买→下载）
- **XSS/安全**：Markdown 渲染、输入校验必须有回归用例
- **暗色主题**：CI 有 `dark-theme.test.ts` 钉住，不要绕过

### 手动测试清单
- [ ] Chrome / Safari / Firefox 各过一遍关键路径
- [ ] 移动端响应式（375px / 768px）
- [ ] 未登录、已登录、管理员三种视角
- [ ] 空数据状态
- [ ] 错误状态（网络断开、API 报错）
- [ ] `prefers-reduced-motion` 下动画是否关闭

### 出口
- 所有自动化测试通过
- 手动测试清单完成

## 5. 部署阶段

### 两条部署路径

| 路径 | 触发方式 | 适用场景 |
|------|----------|----------|
| Vercel | 推 `main` 自动部署 | 前端页面、静态内容 |
| 阿里云 | `deploy/deploy-local.sh` 或 GitHub Actions 手动触发 | 全栈功能、需要服务端 |

### 部署流程
1. **Staging 验证**：先在 staging 环境（如有）验证
2. **部署到生产**：
   ```bash
   # 本地半自动（推荐）
   bash deploy/deploy-local.sh
   ```
3. **部署后验证**：
   ```bash
   # 运行冒烟测试
   node scripts/verify-apps-headless.mjs
   ```
4. **监控观察**：部署后 30 分钟内关注 Sentry 错误数、关键页面可访问性

### 回滚方案
```bash
# 阿里云：恢复上一版 .next
ssh server "cd /var/www/meteor-store && mv .next.rollback .next && pm2 restart meteor-store"
```

### 出口
- 部署完成，`verify-apps-headless.mjs` 通过
- Sentry 无异常错误激增

## 6. 运维阶段

### 日常运维
- **错误监控**：Sentry Dashboard 每日查看
- **限流监控**：Upstash Redis 用量
- **数据库**：Neon 控制台查看慢查询、连接数
- **备份**：Neon 自动备份，确认最近备份可用

### 告警
- Sentry 错误数超过阈值时告警
- 支付/授权相关错误需立即响应
- 见 `docs/process/monitoring.md`

### 出口
- 正常运行，无积压告警

## 7. 迭代阶段

### 反馈收集
- 用户反馈 → `/feedback` 页面
- 管理员定期检查反馈列表
- 有普遍价值的反馈 → 创建 GitHub Issue
- 有普遍价值的问题 → 脱敏后补充到帮助中心 `/docs`

### 版本发布
1. 更新 `CHANGELOG.md`（遵循 Keep a Changelog）
2. 更新版本号（`package.json`）
3. 打 tag：`git tag v0.x.0`
4. 发布 Release Notes

### 项目总结
- 每次重大功能完成后，写项目总结存入 Obsidian vault
- 路径：`/Users/meteor/obsidian/项目总结/`
- 命名：`YYYY-MM-DD-功能名.md`

---

## 代码自审清单

每个 PR 提交前，逐项自审：

### 正确性
- [ ] 边界情况都处理了吗？（null、空数组、超长输入）
- [ ] 并发安全吗？（条件 UPDATE 而非先查后写）
- [ ] 错误处理是否完备？（不静默吞异常）

### 安全性
- [ ] 输入校验是否完备？
- [ ] 鉴权是否正确？（后台 404 非 403）
- [ ] 是否有信息泄露？（错误消息、API 响应）
- [ ] 限流是否配置？

### 性能
- [ ] 有没有 N+1 查询？
- [ ] 列表数据是否批量查询？
- [ ] 客户端组件是否避免了不必要的依赖？

### 代码质量
- [ ] 命名是否表达业务含义？
- [ ] 是否有不必要的抽象？
- [ ] 是否遵循了 AGENTS.md 的约定？
- [ ] 注释写了「为什么」而非「是什么」？

### 副作用
- [ ] 是否需要 `revalidatePath`？
- [ ] 是否影响 sitemap / RSS / JSON-LD？
- [ ] 是否需要数据库迁移？
- [ ] 部署顺序是否有要求？

---

## 相关文档

- [代码规范](../../AGENTS.md)（项目根目录）
- [设计模板](design-template.md)
- [ADR 模板](adr-template.md)
- [PRD Issue 模板](../../.github/ISSUE_TEMPLATE/prd.md)
- [PR 模板](../../.github/PULL_REQUEST_TEMPLATE.md)
