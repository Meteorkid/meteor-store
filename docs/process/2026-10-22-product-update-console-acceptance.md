# 2026-10-22 产品更新控制台验收

## 交付状态

实现已完成，2026-10-22 已获用户明确授权提交、部署，正在进行生产发布。生产安装包与生效下载版本未修改；已暂停的每日巡检未恢复，没有新增自动任务。

用户选择：后台按钮检查，先展示结果，再点击「一键同步」。不要求每次更新重新修改代码或重建网站。

## 实际发布核查

| 产品 | 当前网站基线 | 已确认来源 | 处理 |
|---|---|---|---|
| XIsland | 1.13.0 | GitHub v2.0.3，5,961,103 B | 可更新，待后台确认同步 |
| XNook | 1.3.16 | GitHub v1.3.17，3,745,748 B | 可更新，待后台确认同步 |
| Statux | 0.4.3 | GitHub v0.4.3，同版本不同 SHA | 阻止覆盖；现有 R2 两包实际回读与网站 SHA 相符 |
| OmniCrawl | 旧 PyPI 包名链接 404 | omnicrawl-core 0.3.0，Alpha 开发阶段 | 代码中纠正安装命令与链接；版本可由后台同步 |

XIsland SHA：`cf70fb204c768f965872ba7afe19be880b508540e55dc64a719172a29dd1eced`。

XNook SHA：`cc41e3407fc04b8de9c50189aac6fedcb86750a6dfa7d96b96b652fc8f8c526a`。

来源：[XIsland v2.0.3](https://github.com/Meteorkid/XIsland/releases/tag/v2.0.3)、[XNook v1.3.17](https://github.com/Meteorkid/XNook/releases/tag/v1.3.17)、[Statux v0.4.3](https://github.com/Meteorkid/statux/releases/tag/v0.4.3)、[omnicrawl-core](https://pypi.org/project/omnicrawl-core/)。

本机源码目录的未发布变更、Statux npm 0.6.0、Windows 测试包、Ex-Memory Web/Docker 版本均未当成新版 macOS 安装包。XIsland/XNook 仍不能宣称完成 Developer ID 签名公证。

## 已验证

- 定向 12 文件 262 项测试：来源白名单、正式版本/平台、缺 SHA、同版异 hash、权限保留、目录校验、过期/伪造 ID、并发、进程中断、日志打开失败、PID 复用、R2 条件写入/完整回读、部分失败保留旧下载。
- 全仓 275 个测试文件通过，1 个文件跳过；2,856 项通过，9 项跳过。ESLint 与 shell 语法检查通过。
- 类型检查与 Next 生产模式构建通过，构建使用隔离配置，不是可上传的生产配置产物。
- Chrome 真浏览器：1440 桌面、390 手机视口，中英文；原生 details 键盘 Enter、触屏 tap；静态资源无失败、无 pageerror。
- 实际管理页检查生成快照，未生成生效目录；以本机 PyPI 来源 fixture 缩小同步范围后，真实 POST 启动独立 Node worker，文件锁下完成同步，轮询刷新，产品页显示 0.3.0。
- 非管理员状态 API 404；跨站同步 403；私人响应 no-store；无登录后页面不显示管理信息。
- Node 22 独立加载 worker；实际 shell 锁第一进程通过、并发第二进程拒绝、退出后可再次获取。
- 服务器只读连通检查：GitHub 发布 API 200/0.57s，PyPI JSON 200/0.70s，XIsland 官方安装包 HEAD 跳转后 200/2.29s。

全量测试与最终构建日志随验收记录归档。第一次全量测试的两项 CSRF 失败来自隔离 runner 将站点域名设为 localhost，而旧测试断言默认正式域名；保持隔离数据库，仅恢复测试所需站点配置后全量通过，未修改 CSRF 逻辑。

## 待上线验证

- 本次未执行生产管理员点击或生产 R2 上传；R2 故障/回读用隔离 SDK fixture 验证。上线后的首次真实同步仍需管理员明确点击。
- 真实安装器安装、实体手机、Safari/Firefox 未验证。
- 部署前备份源码/产物及 `data/product-updates`（若存在），确认没有运行中同步；生产配置重建，按既有流程发布并验收。操作与回滚见 [运行说明](product-update-console.md)。

证据目录：`/Users/meteor/obsidian/项目总结/附件/2026-10-22-产品下载更新控制台/`。

## 发布准备

- 生产基线 `211a92fa8267c0b050802325bfac6ec813abb30a`，与本地 HEAD 一致；无运行中的同步，线上版本目录尚不存在。
- 已完成真实生产配置本地构建（完整 TypeScript 检查，421 个静态页面）；数据库经固定 SSH 隧道以只读选项连接，R2 图片来源配置与线上一致。
- 备份：`/root/meteor-product-updates-release-20261022/`，包含旧源码、旧产物、nginx/logrotate/crontab、环境文件 SHA、之前回滚产物；数据库 38 表备份并传至私有 R2 后回读校验。
- 独立发布审查无阻塞项，无新依赖或数据库迁移；不上传任何隔离 fixture 或状态目录。
