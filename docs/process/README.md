# 开发流程文档

## 流程指南

| 文档 | 说明 |
|------|------|
| [development-workflow.md](development-workflow.md) | 完整开发流程（需求→设计→开发→测试→部署→运维→迭代） |
| [feedback-triage.md](feedback-triage.md) | 用户反馈分级与流转指南 |
| [monitoring.md](monitoring.md) | 监控告警配置与应急响应 |
| [search-engine-indexing.md](search-engine-indexing.md) | 搜索引擎收录：站长平台验证与 sitemap 提交 |

## 模板

| 模板 | 说明 |
|------|------|
| [design-template.md](design-template.md) | 功能设计方案模板 |
| [adr-template.md](adr-template.md) | 架构决策记录模板 |

## 架构决策记录

| 文档 | 说明 |
|------|------|
| [adr.md](adr.md) | ADR 索引与使用指南 |

## GitHub 模板

| 模板 | 说明 |
|------|------|
| [Bug Report](../../.github/ISSUE_TEMPLATE/bug-report.md) | Bug 报告 Issue 模板 |
| [Feature Request](../../.github/ISSUE_TEMPLATE/feature-request.md) | 功能请求 Issue 模板 |
| [PRD](../../.github/ISSUE_TEMPLATE/prd.md) | 产品需求文档模板 |
| [PR](../../.github/PULL_REQUEST_TEMPLATE.md) | Pull Request 模板 |

## 工具脚本

| 脚本 | 说明 |
|------|------|
| `scripts/feedback-to-issue.mjs` | 反馈转为 GitHub Issue |
| `scripts/health-check.sh` | 健康检查（cron） |
| `scripts/verify-apps-headless.mjs` | 站内应用可用性巡检 |
| `deploy/deploy-staging.sh` | Staging 环境部署 |
| `deploy/deploy-local.sh` | 生产环境本地部署 |
