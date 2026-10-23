# 运行进程与日志轮转修复

状态：仓库补丁与隔离验收完成，用户已授权分批提交并部署；生产切换正在执行，结果另补上线记录。此记录只覆盖七项修复中的第4项。

## 变更与边界

- PM2直接启动 `node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000`。保留Node22、生产cwd、`.env.production`加载、IPv4优先、可信本机代理和1GiB内存阈值。
- 旧PM2 7注册只执行配置restart仍会保留旧`pm_exec_path`，已在隔离真实PM2中复现。`pm2-runtime.mjs`只有检测到旧入口不同于Next CLI时才删除本站那一个ID并按配置启动；后续同路径部署按配置restart。重复同名注册直接拒绝，不猜测或影响其他应用。
- 激活必须同时核对配置路径、cwd、解释器、关键环境、Linux `/proc/<pid>/exe`，并证明受管PID自己持有`127.0.0.1:3000`监听socket；再检查应用/数据库/Redis健康。仅PM2显示online不算通过。通过后才`pm2 save`。
- 本站Nginx两类日志移至 `/var/log/nginx/meteor-store/`，文件名不变。系统 `/etc/logrotate.d/nginx`及其他日志规则原样保留并核对SHA；不依赖生产3.14不支持的`ignoreduplicates`。
- PM2轮转回调用明确PATH、PM2_HOME及可执行路径调用`reloadLogs`，没有`reload/restart`和`|| true`。该PM2命令会重新打开同一daemon管理的所有日志，不重启任何应用；当前只有本站应用，夹具另验证了其他应用PID不变。
- 构建包附带`preflight-runtime.sh`，在git pull前通过stdin source，首次升级不依赖服务器已有新版helper。它持有部署锁FD9及与产品worker相同的`worker.lock` FD8，直到部署退出；使用旧版已存在的状态读取/进程身份函数，绝不调用会写回任务的`readJob`。配置修改前及停进程前再运行`assert-idle-product-updates.mjs`：queued/running一律拒绝；已结束记录但原worker仍活着、身份无法确认或状态损坏也拒绝。

## 正式部署一次生效

沿用现有发布授权与完整发布备份流程，不因为修复新增一套审批。未获得本次生产部署授权前，仅运行本地检查。

1. 发布前确认产品同步空闲且没有管理员正在发起同步。保留准确的发布前HEAD、源码归档、产物、环境摘要、运行目录和数据库备份。生产环境、数据库和cron本轮不改。
2. 本地使用真实生产公开配置构建并完成常规发布检查。推荐入口仍为`bash deploy/deploy-local.sh`；Actions的备用上传入口同样改为`bash deploy/activate-release.sh <已上传包>`。不要在2GB生产机重建；已弃用的`deploy.sh`仅保留同一运行配置与回滚逻辑。
3. 上传包包含同版本的`.next`和preflight脚本（排除cache/dev）；服务器只从包中读取守卫，不安装bootstrap文件，先取得FD9/FD8并确认空闲，才执行git pull/pnpm install。缺少包内守卫、旧状态模块缺失/损坏或worker持锁均拒绝，不能跳过首次升级保护。激活子脚本核对并复用继承的锁描述符。随后创建唯一私有目录 `/var/backups/meteor-store-runtime-XXXXXXXX/`（700）；保存旧Nginx/logrotate、默认Nginx规则SHA和本站PM2恢复配置（600，含环境，严禁打印、上传或提交）。
4. 日志迁移仅匹配 `imagentx.top.access.log` / `imagentx.top.error.log` 及已有日期/数字编号压缩历史。先对全部目标做冲突检查；符号链接、多硬链接或目标占用拒绝。备份每份文件的采样前缀、字节数、SHA256、权限、owner、inode/device；再用同文件系统硬链接+unlink移动，活动Nginx fd继续指向同一inode，迁移后的新增日志不会丢。活动文件的备份是有界前缀，不声称包含备份时刻之后的全部写入。
5. 安装本站新配置，执行整份`logrotate -d /etc/logrotate.conf`、默认规则SHA检查、`nginx -t`，通过才reload Nginx。没有强制轮转。此阶段旧应用仍运行；失败自动恢复配置和日志路径。
6. 再次运行产品同步守卫，通过后停本站PM2。旧`.next.rollback`移入该次备份的`previous-next-rollback`，当前`.next`移入`next-before`；展开新产物并归一公开静态权限。
7. 按真实执行路径完成一次性旧注册迁移或同路径配置restart；Linux进程/socket/健康验证通过后保存进程表。`.next.rollback`仅作为本次唯一`next-before`目录的指针，旧产物不会因下一次部署被无声删除。输出的私有回滚目录应写进本次发布记录。

停止/启动仍沿用单实例fork部署，会有短暂不可用窗口；不声称零停机。不要在窗口内发起产品同步。源码同步和依赖安装发生在激活之前，自动恢复的范围见下一节。

互斥锁阻止worker执行，**不阻止旧应用API把新请求写成queued**。若在初检之后、最终检查之前排队，worker拿不到锁，最终守卫拒绝停机；catalog和job记录原样保留，部署不把它改成完成/失败。若排队恰好晚于最终检查，worker仍不能进入执行，但queued记录可能需要应用既有的中断恢复流程后重新检查再发起；不声称两个状态快照消除了API排队竞态。本批不修改产品同步服务或自动补跑任务。

## 回滚

### 激活过程中自动恢复

配置验证、解包、产物结构检查或新进程验收失败时，EXIT trap保留新失败产物至`failed-next`，恢复本次`next-before`及原`.next.rollback`，按清单把同一日志inode移回，再恢复旧Nginx/logrotate和本站PM2配置。不会覆盖日志迁移后的新增行，不回灌旧数据库，也不删除其他应用/日志。若原产物无法恢复，停止自动启动并保留所有备份，不拿错误产物强行启动。

**自动回滚不回退git pull后的源码或node_modules。** 应用可能已恢复旧构建，而工作区与cron脚本仍是新源码；发布必须标为失败。若要完整退回版本，使用发布前准确HEAD/源码归档做下面的版本回退，不能把自动恢复称为整站版本回退。

### 已成功部署后的人工回退步骤

只针对明确选定的本次备份目录；不要按目录名猜版本。先核对本次发布记录、源码/产物哈希和`.next.rollback`指向。如果已经发生后续部署，先重新定位对应唯一`next-before`，不能盲用全局`.next.rollback`。

1. 取得同一`/var/lock/meteor-store-deploy.lock`，用现有守卫确认产品同步空闲；备份当前源码、构建、运行目录与环境摘要，保留新用户数据。
2. 在停应用前执行只读预检：`/usr/local/bin/node deploy/migrate-nginx-logs.mjs check "$RUNTIME_BACKUP/logs"`。若已自然轮转造成inode变化、原路径出现新文件或目标冲突，脚本拒绝；先按两个明确日志前缀核对当前/历史文件和清单，制定保留新增日志的迁移，不覆盖或删除冲突文件。
3. 暂存当前`.next`至新的回滚留证目录，将所选备份`next-before`恢复到`.next`。恢复该次原`.next.rollback`只限本次创建的指针；不要删除其他部署留下的目录或指针。
4. 用该次备份的`logs/nginx-log-migration.json`恢复日志路径，再恢复该次`nginx.conf`与`logrotate.conf`并执行`nginx -t`及reload。旧版本轮转存在原已知问题，回退会同时恢复它；不要将旧配置的duplicate告警当作新版本修复仍生效。
5. `/usr/local/bin/node deploy/pm2-runtime.mjs restore "$RUNTIME_BACKUP/pm2-before.json"`只重建本站旧注册，检查原运行方式与健康后保存。旧配置可能是pnpm包装方式，恢复检查不会假装其受管PID直接持有监听socket。
6. **完整源码回退**：先对当前dirty/未跟踪工作做清单与备份，停应用并冻结需要一致源码的人工操作；将发布前归档解到新的同文件系统暂存目录，按发布前tracked文件清单与本次变更清单逐项恢复，保留`.env.production`、`data/`、下载目录及其他未跟踪文件。对只在新版本出现的tracked文件先移入回滚留证目录，不直接删；不要`git reset --hard`或`git clean`。复核目标HEAD对应的源码哈希、lockfile和构建哈希后，再从该快照的PM2配置启动。只回退源码/产物/配置，不恢复旧数据库覆盖新写入。

上述恢复必须由持有准确发布备份的人执行；备份内PM2配置含环境，不得粘贴进聊天/工单。运行目录与日志备份暂不自动清理，待发布验收和保留边界确认后按具体目录处理。

## 验证证据与尚未完成的生产门槛

- 定向Vitest：3个文件23项通过，覆盖日志白名单/文件完整性/活动fd/幂等、冲突与symlink拒绝、中断回滚、新日志保护、PM2选择/迁移和快照、产品同步active/真实PID/复用PID/身份不可读守卫，以及自托管/Nginx既有约束；相关ESLint与逐文件shell/Node语法检查通过。
- 本机真实PM2 7.0.3来自生产安装包的只读副本，使用独立临时PM2_HOME：复现普通配置restart不换script；实际调用仓库迁移函数后受管PID等于模拟工作PID；最小PATH下reloadLogs后PID/启动时间不变、新日志写入、旧日志停止增长；受控低内存阈值确实重启工作PID；快照恢复旧包装进程，另一个模拟应用PID未变化。夹具daemon已关闭。
- 真实shell/tar/文件系统、模拟PM2/nginx操作的五组激活夹具：成功、配置失败、损坏压缩包、缺BUILD_ID、启动验收失败，均核对产物与之前回滚产物保留。
- 首次bootstrap及并发夹具使用真实macOS内核flock（Python标准库仅代替缺失的flock CLI）：已有worker锁让部署在源码/依赖修改前拒绝；持锁期间插入queued后，worker不能执行、最终守卫拒绝停机，catalog/job字节保持；部署退出后内核释放锁。此结果不替代Linux正式部署描述符继承验收。
- 锁身份最终使用`stat(expected)`与`fstat(继承FD)`的device/inode，不能把`/proc/fd`路径字符串与`/var/lock`直接比较。真实父目录symlink夹具覆盖部署锁和worker目录别名，并拒绝错误inode；另在生产Linux/Node22.23.2只读打开既有文件，实际验证`/var/lock`与`/run/lock`别名匹配及不同inode拒绝，全程没有取得生产flock或写文件。
- 生产logrotate3.14使用匿名内存配置及`-d -s /dev/null`解析完整候选规则，11组日志处理、退出0、默认Nginx规则原样保留；没有落盘配置、修改状态或执行轮转。初次`/dev/stdin`因不是regular file被忽略，不计作验收。
- 这些不是Linux生产新进程验收。正式上线后仍需执行实际受管PID/Node22/socket/环境/健康检查，查看新日志位置；等下一次自然轮转核对旧文件停止增长、新文件持续写入、PM2/Next PID不变、logrotate无异常退出。不要生产压内存、停库、伪造故障或强制轮转。

本次临时隔离证据与复现脚本：`/tmp/meteor-seven-fixes-20261023/ops/`。未运行生产构建、未修改生产、未提交或推送本批代码。

定向回归命令：

```sh
pnpm exec vitest run src/lib/__tests__/deployment-ops.test.ts src/lib/__tests__/self-hosting-config.test.ts src/lib/__tests__/nginx-static.test.ts
for script in deploy/preflight-runtime.sh deploy/activate-release.sh deploy/runtime-common.sh deploy/deploy-local.sh deploy/deploy.sh; do bash -n "$script" || exit; done
```

本批提交文件为`ecosystem.config.cjs`、两个Nginx/logrotate模板、三个部署入口（含Actions）、六个部署辅助脚本、两份ops测试与本文。临时PM2副本/daemon目录不提交；交付验收材料仅取`evidence-checksums.json`列出的脚本和脱敏结果，不打包整个临时目录。
