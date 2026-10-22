# 分钟级健康检测与站内管理员提醒

## 当前交付边界

2026-10-22：检测脚本、私有状态读取、管理员页面、铃铛提醒和 cron 模板已在本地实现。**没有安装生产 cron，没有部署，也没有在生产触发故障。** 本文中的安装步骤仍待部署负责人执行。

采用已批准的“站内管理员提醒”。不配置、不调用 webhook，不发送飞书、邮件、Slack 等外部消息；旧 `HEALTH_ALERT_WEBHOOK`、`HEALTH_CHECK_LOG_FILE` 变量不再使用。

## 检测与状态约定

- 默认经公网域名与 nginx HTTPS 每分钟 GET `https://www.imagentx.top/api/health`，整次请求最多 5 秒，响应最多 64 KiB，不跟随重定向。
- 健康必须同时满足 HTTP 200、有效且距当前时间不超过 5 分钟的 ISO 时间、`status: healthy`、`checks.self/database/redis` 全部为 `ok`，以及其它返回检查项均为 `ok`。200 HTML、损坏 JSON、缺少检查项与组件错误都算失败。
- 默认连续 3 次失败才生成一条故障事件。继续失败只更新连续次数，不重复提醒；下一次健康生成一条恢复事件。单次或两次失败后恢复不会制造提醒。
- `openedAt` 表示达到门槛、确认故障的时间，并不推断第一次故障的真实起点。
- 状态只保留最新结果、当前故障与最近 40 条故障/恢复事件（新到旧）。每次打印一行固定字段 JSON，由现有 journal/syslog 管理日志保留；脚本不维护无限增长的日志文件。
- 只保留 `network`、`http`、`invalid-response`、`degraded` 四类原因，不记录健康接口的原始错误、URL、数据库错误文本或凭据。

状态文件默认是仓库的 `data/monitoring/health.json`，目录 700、状态文件 600，由仓库的 `/data/monitoring/` 规则忽略。写入先创建同目录临时文件并同步，再原子 rename。已有状态损坏时退出 2，保留原文件，不清空故障历史或伪造恢复。应用读取只返回白名单字段，文件缺失显示“尚未收到检测记录”，损坏显示“监控记录不可用”；超过 3 分钟没有新记录或时间异常显示“检测记录已过期”。

## 调用与配置

本地手动调用（只应针对获准的环境）：

```sh
bash scripts/health-check.sh
# 兼容旧的站点URL位置参数，自动加 /api/health
bash scripts/health-check.sh http://127.0.0.1:3000
```

| 变量 | 默认 | 含义 |
| --- | --- | --- |
| `HEALTH_CHECK_STATE_FILE` | `<repo>/data/monitoring/health.json` | 检测进程与应用进程必须使用同一个绝对路径 |
| `HEALTH_CHECK_URL` | `https://www.imagentx.top/api/health` | 完整检测端点，只接受 http(s)，禁止 URL 内用户名/密码 |
| `HEALTH_CHECK_FAILURE_THRESHOLD` | `3` | 连续失败门槛，范围 1–10；默认站内说明按 3 次展示 |
| `HEALTH_CHECK_NODE` | `node` | shell 入口使用的 Node 二进制；生产使用 `/usr/local/bin/node` |

退出码：0 为健康或已由另一进程持锁而跳过，1 为健康检查失败（包括未达到提醒门槛），2 为配置、状态读取或状态写入失败。跳过时不打印检测成功记录。

shell 入口使用 `flock`；macOS 无该命令时使用现有 Python 3 标准库 `fcntl.flock`，无需安装包。锁由操作系统在进程退出时释放。直接调用 `scripts/health-check.mjs` 必须由调用方持锁，生产模板已套 `flock -n`。不要并行执行没有锁保护的 Node 入口。

## 管理员页面与提醒

- `/admin/monitoring` 复用现有后台布局；页面和 metadata 都校验管理员身份。
- `GET /api/admin/monitoring` 每次调用 `getSession()` 与 `isAdminSession()`，游客和普通账号返回 404。成功、404 和 503 均为 `Cache-Control: no-store`，响应附当前 `userId`。
- 普通用户的铃铛不发监控请求。管理员的桌面、手机铃铛与页面共用按账号隔离的请求、60 秒轮询和已读状态；恢复页面可见或焦点时也做节流刷新。浏览器挂起期间不保证定时器准时执行。
- 退出、换号或最后一个消费者离开后，取消请求并移除该身份缓存；旧响应无法回填到新身份。读取失败时清空旧内容，避免继续显示过时健康状态。
- 点击铃铛里的“查看运行监控”或页面的“标为已读”只在本浏览器、当前账号记录最后事件 ID。不会写业务数据库，也不会把 A 管理员的已读状态用于 B。

## 待执行的生产接入

1. 部署前检查应用进程的系统用户及工作目录，确保 cron 与应用都能访问同一个私有监控目录。不要用放宽为全员可读的方式解决权限问题。
2. 备份现有 root crontab：`crontab -l > /root/crontab.bak-monitoring-YYYYMMDD`。创建私有 `data/monitoring` 目录，再将 `deploy/monitoring.cron` 中一行合并到既有 crontab，保留所有备份、日刊、硕士、Pathfinder 任务。
3. 模板每分钟通过 `/usr/local/bin/node --env-file=/var/www/meteor-store/.env.production` 执行；没有密钥出现在命令行。若自定义 `HEALTH_CHECK_STATE_FILE`，同步调整模板的锁文件路径及应用环境，不能让手工入口和 cron 锁住不同文件。
4. 只做正常健康检查，检查状态文件权限、`checkedAt` 是否逐分钟更新，以及 `journalctl -t meteor-health --since today`。确认管理员可读取，匿名和普通账号得到 404、响应 no-store。不要在生产主动停库或制造故障。
5. 在部署记录和 `AGENTS.md` 的服务器任务表补上实际安装时间，只有完成以上证据才标记“已启用”。

回滚：从已备份 crontab 中只移除新增监控行，保留其它任务；回滚应用代码。保留私有状态文件便于排查，停止任务后页面会显示记录过期。

## 能力边界

检测器、状态文件和网站在同一台机器上。应用进程不可用而 cron 仍运行时，故障可以被记录，但管理员要等网站恢复后才能看到站内提醒。**整机断电、系统卡死或 cron 本身停摆时，检测器也无法运行；这段期间不能保证产生故障或恢复事件。** 现有记录过期可以暴露检测中断，但不是独立的站外可用性监控。

默认检测覆盖应用、数据库、Redis，不证明公网 DNS、TLS、nginx、支付回调、后台任务或业务结果全部正常。

## 本地验证

```sh
pnpm exec vitest run src/lib/__tests__/health-check-script.test.ts src/lib/__tests__/monitoring.test.ts src/lib/__tests__/monitoring-client.test.ts src/app/api/admin/monitoring/__tests__/route.test.ts src/components/__tests__/admin-entry.test.ts src/lib/__tests__/admin-authz.test.ts
bash -n scripts/health-check.sh
node --check scripts/health-check.mjs
```

隔离 HTTP fixture 覆盖连续失败门槛、持续故障去重、单次恢复、坏 JSON、200 中的失败组件、缺组件、网络断开、5 秒超时、并发锁、私有权限、历史上限及旧 webhook 无外发；接口覆盖未授权 404、owner 和 no-store；客户端覆盖双铃铛共享请求、账号隔离、旧响应拒收、失败清空和已读。
