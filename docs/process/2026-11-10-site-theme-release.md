# 全站双主题与星云视角上线

日期：2026-11-10。

## 发布身份

- 发布前线上：`d175f43e969839973ad0d0f13cc75e79e583d975`。
- 发布提交：`51176f0cd1b9b0d33a6912b3a3038e288c4d6e7a`。
- 候选包 SHA-256：`068d31e9de12459f5259bb4be83cde410256ac0e7f860f274ee0b057d3ab6b18`。
- 项目固定 `deploymentId`，新旧构建复用 `build-TfctsWXpff2fKS`；版本必须同时看 Git SHA、候选包哈希和关键编译文件摘要。

## 发布范围

首页加入有限三维视角、拖拽惯性、自动巡视与星光/手机同步投影；新增“经典紫夜”和“星云星海”全站主题；游客存储本机偏好，登录账号通过 `users.theme_preference` 跨设备同步。星云主题映射全站紫/粉/靛蓝色阶，并统一导航、玻璃卡片、弹窗、星图、流星、帮助星场和背景云气。

## 备份与迁移

- 源码、旧 `.next`、数据库、PM2、环境、Nginx、logrotate、crontab 和未跟踪文件备份：`/var/backups/meteor-store-theme-20261110-laN0TcoU`。
- 即时数据库快照：45 张表；发布前后 `users=24`、`posts=23`、`orders=47`、`license_keys=16`。
- 构建使用刚从生产库导出的 PG18 副本，在副本上执行标准 Drizzle `0055`，账本 55→56；随后从只读副本构建。
- 构建日志中“读取投稿失败”、`timeout exceeded`、`Failed query` 均为 0。
- 生产在旧构建仍运行时执行同一迁移；核对 `users.theme_preference` 存在、账本 56，再激活新构建。

## 线上验收

- `RELEASE_SUCCESS=51176f0cd1b9b0d33a6912b3a3038e288c4d6e7a`，PM2 在线且受管 PID 直接持有回环端口。
- `/api/health` 为 `healthy`，self/database/redis 三项均 ok。
- 中英文首页、产品、日刊、学习、博客、帮助和定价均返回 200；375px 手机导航无横向溢出。
- 默认星云主题、经典主题切换、跨页面保持和刷新保持均通过；经典主题仍为紫色。
- 25 个线上 JS/CSS/首页图片资源与本地候选产物 SHA-256 一致。
- sitemap 含 394 条 loc，中文 Feed 15 条、英文 Feed 8 条，证明静态内容未使用数据库超时降级版。
- 匿名 `/api/account/appearance` 返回 401 且 `no-store`；匿名管理 API 返回 404。未修改真实用户的主题偏好，因此生产账号写入仍以隔离库集成和接口单测为验证边界。

## 配置与回退

- `.env.production`、Nginx、logrotate 和 crontab 发布前后逐字节一致；运行备份目录：`/var/backups/meteor-store-runtime-Ma2w8BXJ`。
- 回退脚本：`/var/backups/meteor-store-theme-20261110-laN0TcoU/rollback-theme.sh`，预检已通过，未执行实际回退。
- 回退只恢复 `d175f43` 源码和构建；保留新增列、迁移账本和业务数据，旧代码会忽略可空新列。
