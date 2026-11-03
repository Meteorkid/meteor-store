# HTTPS 证书维护

2026-11-03 已恢复根域和 www 的 HTTPS。现有 Let's Encrypt 证书免费，续签不需要购买云厂商证书；域名和服务器套餐另按原服务计费。

## 当前配置

- 客户端：`/root/.acme.sh/acme.sh`，v3.1.5；复用已有 Let's Encrypt 账号和 ECC 域密钥。
- 双域名：`imagentx.top`、`www.imagentx.top`。
- HTTP 验证目录：`/var/lib/meteor-store-acme`，其 `.well-known/acme-challenge` 目录可供 Nginx 遍历，验证文件可读；不要使用已有 700 权限的 `/var/lib/meteor-store` 私有运行目录，也不要放宽该私有目录权限。
- 安装证书：`/etc/nginx/ssl/imagentx.top.pem`；私钥：同目录 `imagentx.top.key`。不直接让 Nginx 引用 ACME 内部工作文件。
- 安装后 hook：`/usr/sbin/nginx -t && /usr/sbin/nginx -s reload`。
- 域配置 `Le_Webroot='/var/lib/meteor-store-acme'`；旧 `Le_HTTPPort='80'` 即使仍保留，在 webroot 模式下也不会启动独占端口服务。

Nginx 模板 `deploy/nginx.conf` 的80端口保留独立 ACME location，普通路径仍301到规范 HTTPS www。**不能把 return 移到 server 级**，否则 location 匹配前就会跳转。

## 自动检查与日志

root crontab 仅替换原证书一行，其他任务原样保留：

```cron
15 2,8,14,20 * * * /bin/bash -o pipefail -c '/usr/bin/flock -n /var/lock/meteor-store-deploy.lock /root/.acme.sh/acme.sh --cron --request-v4 --home /root/.acme.sh 2>&1 | /usr/bin/logger -t meteor-acme'
```

服务器时区为北京时间。锁与网站部署共用，部署期间不会并行改证书；未到续期时间时正常跳过。失败信息进入系统日志，pipefail 保留失败退出状态。查看：

```sh
journalctl -t meteor-acme --since '2 days ago' --no-pager
openssl x509 -in /etc/nginx/ssl/imagentx.top.pem -noout -dates
```

2026-11-03 手动执行同一条任务退出0，日志显示下一次续期时间 `2027-01-02T23:18:47Z`（北京时间1月3日07:18:47）；实际由其后一次定时检查触发。新证书有效至 `2027-02-01T10:25:34Z`。没有为验证而强制重复签发。

## 应急处理与边界

先备份 ACME 目录、Nginx 配置/证书和 crontab到服务器私有目录，校验归档。确认证书过期、webroot可读且两个域名的 HTTP 验证文件可直接取到后，再由现有客户端续签。签发后验证有效期、SAN与密钥匹配，安装到固定路径，经 `nginx -t` 后 reload；不需要重建 Next 或重启数据库。

本次恢复中服务器直连 CA 曾出现 curl 35/28；使用临时 SSH SOCKS 通道完成签发，保留 CA TLS 校验。临时代理只传给单次命令，未持久化到配置；随后关闭通道，服务器独立执行上述续期检查通过。该检查因新证书未到期而跳过签发，不代表未来外部网络绝不会异常，后续失败应从 `meteor-acme` 日志定位。

本次备份：`/var/backups/meteor-store-tls-20261103-dEpVXul0`，包含私钥，禁止上传仓库。恢复时按需取出具体配置/证书，先校验再reload，保留当前新证书与业务数据；不要把整份Nginx旧归档覆盖到发生过后续变更的服务器。

恢复完成必须用正常 TLS 校验访问根域跳转、www页面、健康接口及真实浏览器资源，核对公网证书期限，并检查分钟监控的自然恢复记录。不要使用 `curl -k` 作为完成证据。到期前提醒和站外通知尚未新增。

参考：[Let's Encrypt 免费证书](https://letsencrypt.org/)、[acme.sh 官方使用说明](https://github.com/acmesh-official/acme.sh#readme)。
