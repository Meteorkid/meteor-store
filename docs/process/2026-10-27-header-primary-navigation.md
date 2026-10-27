# 2026-10-27 一级导航直达修复

状态：已获用户授权，功能提交 `9bb7b9e3ae70244d6b48009a51d0bd4efe3c3919` 已于 2026-10-27 北京时间 19:50 上线；线上导航复验完成。

## 问题与改动

一级名称原为展开按钮，点击不能进入对应总览。现在名称使用本地化链接，旁边独立箭头控制二级菜单；桌面保留悬停展开。

| 一级导航 | 总览路径（自动保留语言） |
| --- | --- |
| 产品 | `/products` |
| 每日一新 | `/daily` |
| 学习与机会 | `/pathfinder` |
| 内容 | `/blog` |
| 帮助 | `/docs` |

- 名称 Enter 直接跳转，名称和箭头均可 ArrowDown 进入菜单，Escape 返回实际键盘触发器。保留修饰键新标签行为。
- 手机名称点击后主动关闭导航并恢复滚动，包括点击当前页面；箭头只展开或收起。手机箭头触摸区为 44×64，桌面粗指针为 44×44。
- 浏览器复现了跳转重挂载 Header 后静止指针再次触发悬停的问题。现记录普通点击位置，在真实移动后恢复悬停；移到正文再返回原位置也能恢复，显式箭头操作不受影响。
- 一级目标继续读取 `src/data/header-navigation.ts` 的 `overview.href`，不新增导航数据源。

改动文件：`Header.tsx`、`Header.module.css`、两份 `header-navigation-*` 测试，以及设计文档和 AGENTS 导航约定。首页主体和其他业务功能未改动。

## 验证

隔离基线 `513a5c850dcb3813dfbae4c809498e6674365059`，只叠加本轮 4 个实现/测试文件。工作区、隔离副本和浏览器证据的 SHA-256 一致，见 [manifest](header-primary-navigation-20261027/manifest.json)。其他未提交日刊和支付变更保持原状。

- 定向 Vitest：3 个文件、29 项通过；新增直达与静止指针用例先在旧行为下失败，再通过。定向 ESLint 通过。
- 隔离生产构建和 TypeScript 通过，347 个静态页面生成完成。
- Chrome 156.0.8078.48：9 组通过，覆盖 1280/1024 桌面中英文、375/768 触屏模拟中英文，以及 1024 英文粗指针。验证五组单击目标、跨组悬停后首次点击、键盘进入/返回、箭头切换、Meta 新标签、同页关闭后触摸滚动和横向溢出。
- 重挂载后静止指针专项：5 次通过，共 221 次逐帧采样；真实移动恢复悬停、离开后返回原坐标、箭头鼠标与键盘操作均通过。
- 334 次 JS/CSS 响应成功，未记录 pageerror。两幅稳定截图已人工查看。

证据：[浏览器结果](header-primary-navigation-20261027/results.json)、[静止指针复验](header-primary-navigation-20261027/stationary-results.json)、[测试日志](header-primary-navigation-20261027/tests.log)、[构建摘要](header-primary-navigation-20261027/build-summary.log)、[桌面截图](header-primary-navigation-20261027/settled-desktop-en-1024.png)、[手机模拟截图](header-primary-navigation-20261027/settled-touch-zh-375.png)。脚本和文件校验值同目录保留。

## 验收边界与后续

这是本地隔离导航验收：`/api/auth/me` 使用匿名访客夹具，非 GET 请求全部阻断；数据库指向未启动的本地测试端口。因此 13 次公告 GET 返回 500 是已记录的隔离环境结果，不计为公告功能通过。54 个写请求被拦截，没有访问生产或写入真实账号数据。

上述阶段未覆盖生产；其本地验收服务 3185 已停止。随后获得用户明确的“提交并部署这批导航修复”授权，仅提交导航相关文件和 AGENTS 导航一段；其他日刊和支付改动继续留在原工作区。


## 正式发布与线上验收

- 功能提交：`9bb7b9e`。从干净副本使用生产公开配置重新构建，通过 SSH 只读连接生产库完成静态内容生成；完整 TypeScript 与 415 页生成通过。部署包排除 `.next/cache`、开发产物和本地夹具，没有使用此前隔离测试产物。
- 发布前取得部署与产品 worker 双锁，确认空闲，保存准确源码、产物、环境、cron、运行数据和数据库备份。数据库备份已上传既有私有 R2 并回读校验。本轮没有数据库迁移或业务数据写入。
- 上传包 SHA-256 核验后，服务器只快进到固定发布 SHA；核对源码版本后执行既有 `activate-release.sh`。环境、cron、Nginx/logrotate 配置，以及产品 `catalog.json`/`job.json` 内容均未变。
- PM2 实际 Next PID `1486416` 自己持有 `127.0.0.1:3000`，应用/数据库/Redis 健康。部署前后 BUILD_ID 都为 `build-TfctsWXpff2fKS`，因此额外核对实际导航脚本 `0kxfg6-scndwq.js` 的 SHA-256 与新包一致，不以 BUILD_ID 单独判断版本。
- 36 个产品封面预热请求全部 200。GitHub、Gitee、GitLab 的功能提交已同步。临时构建数据库隧道已关闭，含连接信息的本地临时环境文件已删除。

真实线上匿名 Chrome 验收：9 组导航流程全部通过，另有 5 次静止指针专项通过。桌面 1280/1024、触屏模拟 375/768、中英文及粗指针均覆盖；名称直达、独立箭头、键盘焦点返回、Meta 新标签、同页手机关闭与滚动恢复正常。

共 468 次 JS/CSS 响应通过状态及 MIME 核验，36 次真实 API GET 成功，未记录 HTTP 错误或 pageerror。209 次非 GET 被测试端阻断，不产生真实业务写入；405 条 `fetch / net::ERR_ABORTED` 均为 `_rsc` 请求，来自连续路由切换或关闭页面，API/静态请求取消为 0；事件保留，公开遥测 URL 中的 key 已脱敏。真实匿名鉴权未被夹具替换，未验收真实登录账号、实体触屏设备或 Safari/Firefox。

两幅展开状态补图等待有限动画结束并人工查看：[桌面英文](header-primary-navigation-20261027/release/stable-desktop-en-1024.png)、[手机中文模拟](header-primary-navigation-20261027/release/stable-mobile-zh-375.png)。补图过程另有 42 次静态和 4 次 API 读取通过，未计入上述主验收数字。

生产证据：[操作摘要](header-primary-navigation-20261027/release/operations.json)、[正式构建](header-primary-navigation-20261027/release/build-verification.json)、[9 组交互](header-primary-navigation-20261027/release/results.json)、[5 次专项](header-primary-navigation-20261027/release/stationary-results.json)、[导航脚本校验](header-primary-navigation-20261027/release/header-chunks.json)。此次记录补交仅含文档和证据，运行功能版本仍以 `9bb7b9e` 标识。

发布前完整备份：`/var/backups/meteor-store-header-20261027-uVki3aL1`；运行回滚目录：`/var/backups/meteor-store-runtime-0wJfRT7f`。如需回退，按 [运行与回滚流程](2026-10-23-runtime-operations-fix.md) 使用该次唯一备份，不恢复旧数据库覆盖新数据；自动激活回滚不包含源码和依赖回退。
