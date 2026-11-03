# 2026-11-03 HTTPS 证书过期诊断

状态：用户确认后已完成备份、续签、安装及自动续期配置修复；网站公网 HTTPS 已恢复。下文先保留诊断时证据，末节记录恢复结果。

## 结论

根域与 www 的证书于 **2026-11-03 15:11:52 北京时间**过期。正常校验证书的 curl 对两个域名均退出 60，错误为 `SSL certificate problem: certificate has expired`。这是当前浏览器无法访问的直接原因。

服务器应用仍在运行：Nginx、PostgreSQL active，PM2 实际 Next PID 2142022 自己持有 127.0.0.1:3000；本机 `/api/health` 200，self/database/redis 全部 ok，本机 `/zh` 200。磁盘 68%，内存无明显耗尽迹象。没有证据表明本次是应用部署崩溃。

线上 HEAD 与 GitHub origin/main 同为 `4242e746bad49d271be3a3e74c2f7c68c7577dc7`。本地 HEAD `2ad9dc0`，另有 `bca88ba`、`4f604ad`、`2ad9dc0` 尚未推送到该远端/部署；其中包含限时免费领取和产品 GitHub 入口。这是独立的版本交付状态，不是证书过期的原因。

## 证书与续期证据

- 生产与 ACME 工作目录证书一致，签发者 Let's Encrypt YE1，SAN 覆盖 imagentx.top 与 www.imagentx.top。
- notBefore：2026-08-05 07:11:53 UTC；notAfter：2026-11-03 07:11:52 UTC。
- SHA-256 指纹：`F5:AD:AC:CE:67:84:56:6C:BF:20:80:B3:DB:9A:AF:89:1B:CF:FC:FA:A4:23:49:09:B4:65:17:1F:61:DE:6C:70`。
- acme.sh v3.1.5 保存在 `/root/.acme.sh`。域配置 `Le_Webroot='no'`、`Le_HTTPPort='80'`，即 standalone；pre/post/renew hook 为空，证书安装路径为 `/etc/nginx/ssl/imagentx.top.pem` 与 `.key`，reload hook 已存在但本轮未执行。
- crontab 每天 02:15/08:15/14:15/20:15 执行 `acme.sh --cron`。crond 日志证明 11 月 2、3 日任务确实启动；stdout 被丢弃，没有取得历次续期错误原文。
- `ss` 确认 Nginx 同时监听 IPv4/IPv6 的 80 端口。服务器 acme.sh 的端口检查源码会在 standalone 目标端口已用时返回失败，要求先停止占用者。当前保存模式和 Nginx 常驻监听之间存在确定的配置冲突；不是单纯漏装 cron。
- 既有分钟监控状态已为 down，取样时连续失败 227 次。提醒只显示在站内，本站因 TLS 阻断时无法查看；没有证书到期前预警逻辑。

协议依据：[acme.sh 官方 standalone、Nginx 与安装说明](https://github.com/acmesh-official/acme.sh#readme)。独占模式需要空闲端口；已有 Nginx 可通过 Nginx/webroot 模式验证。安装命令和 reload hook 负责将更新证书写入固定服务路径。

## 已准备的修复方案

1. 在服务器私有目录备份 ACME 配置、现有证书/私钥、Nginx 配置和 cron；不把私钥下载或写入仓库。
2. 复用已有 ACME 账号、Let's Encrypt 与 ECC 双域名，切换为可与现有 Nginx 共存的验证模式；优先采用 acme.sh Nginx 模式，签发期间检查它的临时配置及恢复行为。
3. 新证书校验期限、双域名 SAN、证书与私钥公钥匹配后，通过既有固定路径安装，执行 `nginx -t` 并仅 reload Nginx；不需要重新构建网站或修改数据库。
4. 保留续期失败日志，验证下一次调度所用模式不再独占 80。若采用持久 webroot 规则，必须同时更新仓库 `deploy/nginx.conf`，因为每次应用部署都会覆盖生产站点配置。
5. 用正常 TLS 验证根域跳转、www 页面、健康接口、浏览器资源与导航；读取公网新证书期限，等待分钟监控自然记录恢复。不能以 `curl -k` 结果宣布恢复。

上述方案已获用户确认。实际采用固定 webroot，避免现有 server 级301覆盖 acme.sh Nginx模式临时插入的验证location。到期预警、站外通知和本地未推送的新功能未混入本次恢复。


## 恢复结果

- 私有备份：`/var/backups/meteor-store-tls-20261103-dEpVXul0`，ACME、Nginx/证书与cron均已归档校验，私钥留在服务器。
- 新证书免费续签，双域名SAN和密钥匹配校验通过，公网指纹与安装证书一致；到期为北京时间 **2027-02-01 18:25:34**。证书notBefore早于实际安装时间，不作为实际上线时间。
- 验证改为 `/var/lib/meteor-store-acme` webroot；独立HTTP验证目录与普通HTTPS跳转均保留。首次预检发现已有 `/var/lib/meteor-store` 为700私有目录，自动恢复配置后改用独立目录，未放宽私有权限；两域名公网验证文件均成功取到。
- 服务器直连CA出现TLS握手中断和超时；域名已验证后，通过仅此次命令使用的临时SSH SOCKS通道完成签发，TLS校验全程保留。通道已关闭、代理未持久化；随后的独立续期检查正常退出0，因新证书尚未到期而跳过签发。
- 保留原每日4次检查，仅证书cron一行增加部署互斥锁、IPv4请求、pipefail和`meteor-acme`系统日志，其余任务未变。下一次续期时间为北京时间2027-01-03 07:18:47，由之后的检查触发。正常到期续签尚未实际发生，不把当前skip检查称为未来签发保证。
- 仅reload Nginx。应用HEAD仍4242e74，Next PID仍2142022，环境、数据库未修改；本地未推送功能没有被顺带部署。
- 普通TLS的根域跳转、www页面与健康接口全部200；分钟监控于北京时间 **19:25:02** 自然记录恢复，连续失败归零。
- Chrome中文桌面与英文手机模拟两组通过，52个JS/CSS状态/MIME正常、4个真实API GET成功、HTTP/GET/pageerror均0。13次写请求被测试阻断；未测试真实账号写入或实体手机。两次测试工具的选择器/平滑滚动等待问题保留在原始证据，最终通过用例单独汇总。
- Nginx静态配置与自托管回归11/11通过；修正既有测试把跨server注释误判为alias指令的问题，新增ACME和普通重定向约束。真实生产还执行了nginx -t及双域名HTTP验证。

证据：[操作摘要](tls-recovery-20261103/operations.json)、[公网证书](tls-recovery-20261103/public-certificates.json)、[HTTPS回查](tls-recovery-20261103/https-restored.json)、[浏览器最终用例](tls-recovery-20261103/browser-accepted.json)、[测试](tls-recovery-20261103/tests.log)。维护方式见[证书续期操作说明](tls-renewal.md)。

生产修复已生效；仓库Nginx模板、回归测试与记录纳入本次DuoCast发布，防止应用部署覆盖HTTP验证入口。原工作区的未推送商业改动不纳入此修复提交。
