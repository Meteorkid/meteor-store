# 用户反馈流转指南

## 流程总览

```
用户提交反馈 → 管理员查看 → 分级 → Issue/帮助中心/忽略
                    │
                    ├── 🔴 Bug → GitHub Issue (bug-report)
                    ├── 🟡 功能建议 → GitHub Issue (feature-request)  或 暂存 backlog
                    ├── 🔵 常见问题 → 脱敏后补充到帮助中心 /docs
                    └── ⚪ 其他 → 已读归档
```

## 分级标准

### 🔴 立即处理（P0/P1）
- 支付流程出错（无法下单、付了钱没入库）
- 授权异常（买了产品打不开）
- 登录/注册阻断
- 安全漏洞

→ 直接创建 Bug Issue，打 `P0` 或 `P1` 标签

### 🟡 排期处理（P2）
- 功能改进建议
- UI/UX 优化
- 性能问题
- 内容错误

→ 创建 Feature Issue，放入 backlog，标 `P2`

### 🔵 帮助中心（P3）
- 使用问题（"怎么下载？"）
- 常见疑问（"支持退款吗？"）
- 环境配置问题

→ 脱敏后写入帮助中心 `/docs`，不创建 Issue

### ⚪ 忽略
- 垃圾/广告
- 无意义内容
- 已解决的问题（帮助中心已覆盖）

→ 标记 `resolved`，不创建 Issue

## 操作流程

### 1. 日常巡检

访问管理后台 `/admin/feedback`，查看未处理的反馈。
建议每天至少处理一次。

### 2. 分级决策

对每条反馈判断：
- 这是 bug 还是 feature request？
- 紧急程度如何？
- 帮助中心是否已覆盖？

### 3. 创建 Issue（如需要）

使用 GitHub Issue 模板手动创建，或使用辅助脚本：

```bash
# 把反馈转为 Issue（需要 GitHub CLI 和 token）
node scripts/feedback-to-issue.mjs --feedback-id=123 --type=bug --title="用户报：xxx"
```

### 4. 补充帮助中心（如需要）

在 `src/content/docs/` 下创建新的帮助文章（Markdown），
前端会自动出现在 `/docs` 列表中。

要求：
- **必须脱敏**：不得包含用户邮箱、IP、订单号等个人信息
- 问题标题要清晰、可搜索
- 回答要分步骤，让用户能照着做

### 5. 归档

处理完毕后，在管理后台将反馈标记为 `resolved`。

## 反馈分类参考

| 反馈内容示例 | 类型 | 行动 |
|-------------|------|------|
| "付款成功但没收到激活码" | Bug/P0 | Issue + 手动补单 |
| "注册时滑块验证一直失败" | Bug/P1 | Issue |
| "希望支持微信扫码登录" | Feature/P2 | Issue → backlog |
| "文章列表能不能加搜索" | Feature/P2 | Issue → backlog |
| "下载的 dmg 打不开提示已损坏" | 帮助中心 | 补充到 /docs |
| "怎么修改邮箱地址" | 帮助中心 | 补充到 /docs |
| "测试一下" | 忽略 | 归档 |
| "深夜有点emo" (night-whisper) | 树洞 | 已读归档 |

## 辅助脚本

`scripts/feedback-to-issue.mjs` 可以将已审核的反馈一键转为 GitHub Issue，
自动填充标题、标签和反馈原文（脱敏后）。

```bash
# 安装 GitHub CLI
brew install gh
gh auth login

# 运行
node scripts/feedback-to-issue.mjs --feedback-id=42
```
