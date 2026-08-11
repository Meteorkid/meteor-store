# 监控与告警指南

## 监控层次

| 层次 | 工具 | 检查内容 | 频率 |
|------|------|----------|------|
| 可用性 | `scripts/health-check.sh` + cron | 服务可达、DB/Redis 连通 | 每 5 分钟 |
| 错误 | Sentry | 服务端/客户端异常 | 实时 |
| 性能 | Neon Dashboard | 慢查询、连接数 | 每日 |
| 限流 | Upstash Dashboard | Redis 用量、限流命中 | 每周 |
| 业务 | `verify-apps-headless.mjs` | 站内应用可用性 | 每日 |

## 告警配置

### 1. Sentry 告警

Sentry 已集成，建议配置以下 Alert Rules：

| 规则 | 条件 | 通知方式 |
|------|------|----------|
| 关键错误激增 | 5 分钟内 error 超过 10 个 | 飞书 / 邮件 |
| 支付相关错误 | 含 `payment` / `order` tag 的 error | 飞书 |
| API 500 错误 | `status_code:500` | 飞书 |
| 数据库连接失败 | `NeonDbError` / `connection` | 飞书 |

配置路径：Sentry → Alerts → Create Alert Rule

### 2. 健康检查告警

```bash
# 服务器上配置 crontab
crontab -e

# 每 5 分钟检查一次
*/5 * * * * /bin/bash /var/www/meteor-store/scripts/health-check.sh

# 如果有飞书 webhook：
HEALTH_ALERT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx \
  /bin/bash /var/www/meteor-store/scripts/health-check.sh
```

### 3. 应用可用性巡检

```bash
# 每日检查站内应用是否正常
# 配置 cron：每天 9:00
0 9 * * * cd /var/www/meteor-store && node scripts/verify-apps-headless.mjs
```

## 关键指标

### 需要关注的 Sentry Issues

- `NeonDbError`：数据库连接问题
- `UpstashError`：Redis 限流服务异常
- `ResendError`：邮件发送失败
- `PaymentVerificationError`：支付回调校验失败
- `AuthorizationError`：授权判定异常

### 需要关注的数据库指标

- 连接数是否接近上限
- 慢查询（>1s）
- 磁盘使用率

## 应急响应

### 服务宕机

1. SSH 进服务器
2. `pm2 list` 检查进程状态
3. `pm2 logs meteor-store --lines 50` 查看日志
4. `pm2 restart meteor-store` 尝试重启
5. 如果重启失败，回滚：`mv .next.rollback .next && pm2 restart meteor-store`

### 数据库问题

1. 检查 Neon Console：https://console.neon.tech
2. 查看连接池状态
3. 必要时重启数据库实例

### 支付问题

1. 检查 `/api/payment/*` 相关 Sentry 错误
2. 检查订单表中是否有 `status='pending'` 超过 30 分钟的订单（支付超时）
3. 手动补单脚本（如需要）

## 日常巡检清单

每天：
- [ ] 浏览 Sentry Dashboard，看是否有新类型错误
- [ ] 检查 `/api/health` 响应

每周：
- [ ] 检查 Upstash Redis 用量
- [ ] 检查 Resend 邮件配额
- [ ] 检查 Neon 数据库连接数和存储

每月：
- [ ] 检查 SSL 证书有效期
- [ ] 检查域名续费
- [ ] 检查备份可用性
