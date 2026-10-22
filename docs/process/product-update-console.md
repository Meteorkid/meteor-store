# 产品下载更新控制台

入口：后台侧栏「商业 → 产品更新」，页面 `/zh/admin/product-updates`，英文 `/en/admin/product-updates`。

## 日常使用

1. 点击「检查产品更新」。只保存检查结果，网站下载不变。
2. 核对当前版本、官方版本、来源及文件校验信息。「暂不可同步」的项目不会进入同步。
3. 点击「一键同步」，同步本次检查中可更新的产品。离开页面后后台任务仍继续，重新进入可看进度。
4. 完成后产品页与下载 API 使用新目录。部分失败时成功项更新，失败项保留原下载；重新检查后再重试。

检查一小时内有效，目录发生变化后必须重查。后台执行时会重新核验同一 release ID、tag、asset ID、文件名、大小与 SHA；不会把检查后新出现的版本偷偷带入这次同步。

不安装新定时任务，不恢复已暂停的 Codex 每日巡检。新平台、新渠道需要扩展登记规则并验收，不能从网页请求指定任意来源。

## 覆盖范围

| 产品 | 来源 | 纳入范围 |
|---|---|---|
| XIsland | `Meteorkid/XIsland` GitHub Releases | 已登记的 macOS DMG |
| XNook | `Meteorkid/XNook` GitHub Releases | 已登记的 macOS DMG |
| Statux | `Meteorkid/statux` GitHub Releases | 已登记的 macOS arm64/x64 独立程序 |
| OmniCrawl | PyPI `omnicrawl-core` | 已发布包的版本和安装链接，开发阶段单独提示 |

Statux npm、Web/Docker、Ex-Memory helper Beta、Windows 测试包不是这些稳定安装包的替代来源。相同版本但 SHA 不同会阻止同步，不能把它当成当前文件已损坏。签名公证状态不会因为同步而改变。

## 运行要求与存储

- 现有单个 PM2 fork、Node 22.18+；生产通过 Linux `flock`，macOS 隔离验收用系统 Python `fcntl`。Node 原生剥离 TS 类型运行 worker，不依赖构建缓存。
- `R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_RELEASE_BUCKET`、`R2_BUCKET` 从现有服务环境继承。安装包桶必须独立且保持私有。凭据不写入状态文件、API 或日志。
- 二进制上限 128 MiB；单包下载限时 10 分钟、存储操作限时 5 分钟，任务上限 30 分钟。仅访问固定官方发布地址及官方资产 CDN，不执行安装包。
- `PutObject IfNoneMatch: '*'` 禁止覆盖已有对象，412 时只允许完整回读确认内容相同的幂等复用。新写入对象同样完整回读 SHA 验证，之后才切换目录。
- 价格、权限、fileId 从 `products.ts` 读取；动态目录只允许版本、SHA、固定私有对象路径或固定 PyPI URL。产品详情页与下载 API 共用读取层。
- 默认私有目录 `data/product-updates/`（目录 700、文件 600），可通过仅服务端的 `PRODUCT_UPDATES_DIR` 配置。`catalog.json` 是生效目录；`check.json` 是上次检查；`job.json` 是任务状态；`worker.log` 是最近一次启动日志；`history/` 保留最多 20 份旧目录。旧 R2 安装包不删除。
- 服务层排队适用于现有单实例部署。扩展到多 PM2 worker / 多主机前需统一跨进程任务队列与共享目录，不能直接横向扩容。

## 备份与回滚

数据库的 `pg_dump` **不包含版本目录**。部署前先在后台确认无 queued/running 任务，再在服务器的受保护备份目录保存 `data/product-updates`（如首次部署尚不存在则记录缺失）。该目录应随应用运行数据一并加入主机/异地备份；首次上线前明确备份位置。

代码回滚与版本目录分别管理：通常保留已通过校验的目录即可，旧代码不支持动态目录时会重新使用静态基线。需要恢复历史下载时，先确认无运行任务，备份当前目录，再将选定的合法历史 JSON 复制到同目录临时文件、设为 600，最后原子 `mv` 为 `catalog.json`。不要截断当前文件，也不要删除 R2 对象。恢复后在后台重新检查，并核对公开产品页及授权下载入口。

首次同步前目录为空，可以备份后移走 `catalog.json` 回到静态基线。恢复比当前版本旧的目录属于人工回滚，日常同步接口会拒绝降级。

## 故障排查

- 来源检查失败：其他来源仍独立显示；先重查网络及官方状态，不换不可信镜像。
- 同版本不同校验值：保留原文件，人工核查发布者是否替换资产；不要覆盖同一对象 key。
- 同步失败：检查私有桶配置、配额及 `worker.log`；失败项保留原下载。上传成功但目录切换失败会留下未引用对象，重试会校验复用。
- 目录校验失败：公开读取安全回到静态基线，后台停止同步；恢复合法备份后再检查。
- 进程中断：后台查询会检测退出/PID 复用并提示重查。任务终态在恢复时再次读取，避免把刚完成的任务误报失败。

## 验证命令

```bash
pnpm exec vitest run src/lib/product-updates src/app/api/admin/product-updates src/app/api/download 'src/app/[locale]/admin/product-updates'
pnpm exec tsc --noEmit
bash -n scripts/product-update-worker.sh
```

交互和同步写入测试使用隔离 PG、状态目录、来源及 R2 fixture。不要把测试目录带上生产，也不要把「构建通过」当作已完成生产同步。
