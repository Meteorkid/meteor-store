# 2026-10-23 每日内容公告面板

状态：**2026-10-23 23:22（北京时间）已部署上线，0050生产迁移完成。** 用户明确授权提交与部署；功能提交`fc8db5e55f8d7fae3a7907a935caae9affbb458d`，BUILD_ID `build-TfctsWXpff2fKS`。

## 交付行为

右上角铃铛直接显示每日内容。英语默认3个单词及释义，例句/翻译可展开；论文、AI、发布会、开源、竞赛、实习显示真实标题、摘要及已有的关键日期。每个栏目可进入对应日期的完整日刊，无内容时区分未发布、无新增、获取失败，并提供有证据的历史期次入口。

自定义支持栏目开关和排序、1/3/5条（开源1条）、紧凑/详细、释义显示、例句/翻译默认展开、摘要/来源/日期开关、隐藏无内容栏目。登录后随账号保存；游客只存本机。默认继承日刊关注，明确空选不恢复全部；恢复默认重新跟随关注。修改面板不改变关注、提醒或09:30提醒快照。系统公告、硕士提醒和管理员告警保留。

## 实现边界

- 公开预览`GET /api/daily/preview`复用公开读取链路，保留当天岗位/赛事过滤。每栏最多5条，不返回英语全文/练习、论文原始摘要、草稿或私人设置；响应上限128KiB。历史查询失败只省略回看入口。
- 私人`GET/PUT /api/daily/panel-preferences`核对会话、owner、Origin、版本和输入，响应no-store。两台设备同时保存只接受一份，另一份409提示重读，保留草稿。超时不把迟到成功当作已确认保存。
- 面板打开才加载内容；桌面/手机共享请求，重新打开确认云端设置。按账号隔离缓存与草稿，游客设置不会自动导入账号。自动刷新不清冲突提示。
- `daily_preferences`增加两个可空字段，旧关注API只更新旧字段；设置纳入账号导出，注销按既有整行删除覆盖。

## 验收证据

基线`723b4d7b9bcc338c7a0d32e3d34e0af4f63c23f6`，仅叠加本批26个实现/测试/设计文件；哈希见[源码清单](daily-notification-panel-20261023/source-manifest.json)。构建位于独立临时副本，排除同时进行的Ex-Memory改动，原工作区`.next`未覆盖。AGENTS和本交付记录在验证后补记。

| 验证层 | 结果 |
| --- | --- |
| 全仓单测 | 307文件、3195通过、9跳过；初次隔离域名令2条既有CSRF测试失败，移除测试进程的站点覆盖后全套通过，未改测试绕过 |
| TypeScript与生产构建 | 通过，339静态页面；3条既有文件追踪警告保留 |
| CI口径源码ESLint | 0错误、5条既有警告；本批文件定向lint零告警 |
| 裸全仓lint | 35个既有错误，来自6个public游戏/第三方脚本；逐文件与基线字节一致，未修改它们 |
| 独立PostgreSQL 18与真实Next API | 14组通过：迁移兼容、401/no-store、owner/Origin、非法/超大输入、真实并发CAS、空选/重置、旧API兼容、账号隔离、公开裁剪、晚到内容与提醒独立、日期范围 |
| 独立Chrome真实页面 | 11组通过：中英×375/768/1280六组，真实1/3/5/排序与双context同步、真实409保草稿/重读、空选/重置、A/B与关注提醒隔离、游客登录退出隔离；0 pageerror |
| 交互细节 | 未开铃铛0次preview请求，打开后1次；六组无横向溢出；375触摸、正文点击、例句展开、内部滚动、Tab/Enter/Escape、外点关闭及焦点恢复通过 |
| 限定范围复核 | 新接口、DTO、客户端owner/CAS、导出/注销与迁移兼容复核未发现可确认新增缺陷；并非全仓安全审计 |

[API结果](daily-notification-panel-20261023/api-results.json) · [浏览器结果](daily-notification-panel-20261023/real-browser-results.json) · [复核报告](daily-notification-panel-20261023/final-review.md) · [单测日志](daily-notification-panel-20261023/full-tests-clean-env.log) · [构建日志](daily-notification-panel-20261023/build.log)

截图使用本地隔离种子，不是线上实际日刊：[手机单词](daily-notification-panel-20261023/zh-375-content.png)、[手机设置](daily-notification-panel-20261023/zh-375-settings.png)、[桌面排序](daily-notification-panel-20261023/account-A-five-ordered.png)、[真实版本冲突](daily-notification-panel-20261023/real-409-conflict.png)。

验证环境为本机`127.0.0.1:3183`、独立库`meteor_daily_panel`（55445），模拟A/B账号。Redis使用隔离夹具，限流Lua不支持时走项目内存降级；未验证真实Upstash。两个browserContext证明服务端持久化与独立会话同步，未宣称实体多设备、Safari/Firefox或生产账号写入验收。验证完成关闭独立Chrome和临时Next/PG，保留夹具与证据可复现。

## 提交与上线准备

1. 按本批文件清单提交；保留并排除工作区Ex-Memory任务。无需修改依赖、内容来源、自动发刊调度或首页主体。
2. 获得上线确认后，核对生产版本/迁移账本；备份数据库及当前产物。**先在事务内执行0050迁移并登记账本，再切换新应用**，避免新查询先访问不存在的列。0050仅增加`panel_settings jsonb`与`panel_updated_at text`，没有回填、删除或修改已有关注/提醒；短暂DDL锁需设锁等待上限，超时中止重试。
3. 从已提交的干净版本重新构建正式产物，按现有部署锁、备份与激活流程上线。**本次本地隔离构建含虚构数据与站点地址，不能拿来部署。**
4. 验证线上预览、静态资源、铃铛和未登录401。登录设置写入只用获准会话/隔离测试账户，不改真实用户偏好。
5. 应用异常可切回已备份版本；保留新增两列及用户设置，不做DROP回滚，不恢复整库覆盖新写入。

原始可复现脚本和临时环境保留于`/tmp/meteor-daily-notice-20261023/`，可能随系统清理；稳定结果、源码哈希和截图已归档到本目录；归档日志已移除进度回车、行尾空白与多余末尾空行，原始日志仍在临时目录。


## 生产上线与复验

- 只提交本批46个文件，工作区同时进行的Ex-Memory改动未提交、未覆盖。GitHub、Gitee、GitLab功能版本均同步到`fc8db5e`。
- 从该提交的干净副本，使用生产公开配置重新构建；不复制旧本地.env，不连接历史Neon或测试库。正式构建包含完整TypeScript检查；发布前确认没有夹具词句、3183地址或隔离密钥，Sentry release与提交一致。原工作区.next未覆盖，上传包排除cache/dev。
- 在既有部署锁与下载worker锁内先备份，再拉取精确提交、安装锁定依赖、事务迁移，最后由项目activate-release切应用。0050的两列和迁移账本在单PG连接的同一事务中完成；锁等待5秒、语句30秒。旧偏好字段在表锁内迁移前后指纹相同，未回填或改写。
- 生产Drizzle账本51条逐一核对SQL SHA256和journal.when通过。新列jsonb/text均nullable，无默认值；没有改生产用户面板设置。
- 新备份`/root/meteor-daily-panel-release-20261023/`保留旧源码、产物与数据库。dump为504425字节、38张表数据目录可解析且关键表齐全；R2上传后对象大小回读一致，未执行整库恢复演练。运行回滚目录`/var/backups/meteor-store-runtime-D34VzFAF`，两条更早回滚链也保留。
- 生产运行PID1115002直接持有127.0.0.1:3000，PM2与/proc内存统计一致。self/database/redis健康，分钟监控healthy、连续失败0；部署锁已释放，env、crontab和下载worker状态指纹不变。
- **线上10项HTTP/内容检查通过**：预览与完整日刊逐栏核对一致，响应6948字节；英语3词、论文3条、AI3条、开源1条、实习3条已发布，活动/竞赛暂无新内容。未登录设置接口401且no-store，非法日期400；中英首页/日刊可访问。
- **真实Chrome线上4组交互通过**（中英×375/1280）：今日词组`sort out / run out of / take turns`、释义、例句/翻译，其他标题摘要，游客1条/空选/恢复默认、重载保持、触摸、滚动、Escape与焦点恢复、外点关闭。最终0 pageerror、0 console error/warning、0 JS/CSS加载失败、0业务写请求。
- 首次浏览器脚本将网站既有在线人数heartbeat也判成业务写入，四组交互实际完成但总判定失败。随后只在验收浏览器中为heartbeat返回模拟成功，继续拦截其他写请求，复验通过；没有修改网站源码或生产在线统计。账号跨设备与冲突保存已在真实Next+独立PG验证，生产复验未写真实账号偏好，实体手机/Safari/Firefox仍未测。

[生产API证据](daily-notification-panel-20261023/release/http-verification.json) · [生产浏览器证据](daily-notification-panel-20261023/release/production-browser-results.json) · [数据库复验](daily-notification-panel-20261023/release/db-final.md) · [运行状态](daily-notification-panel-20261023/release/operations.json) · [线上手机截图](daily-notification-panel-20261023/release/zh-375-content.png)

上线记录后续文档提交不重新构建；功能产物持续对应fc8db5e，避免把文档同步误记为第二次功能发布。
