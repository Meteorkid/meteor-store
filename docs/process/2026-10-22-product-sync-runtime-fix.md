# 产品同步误报中断修复

## 根因与影响

用户点击同步后，后台提示“同步进程已中断”，但 Linux worker 实际仍存活。服务端构建在 Mac 完成；Next 16.3.8 的 Turbopack 将 `process.platform`（以及 `os.platform()`）按编译目标求值，产物仅保留 `ps -o lstart` 分支。未经过 Next 编译的原生 worker 在 Linux 使用 `boot_id:starttime`。两种身份格式不同，后台误判 PID 已复用并标记失败，前端停止轮询。

本次原任务 `028dd14d-dd2c-400c-a72d-547ff4259a19` 实际继续至 22:00:54：OmniCrawl 0.3.0 与 XIsland 2.0.4 同步成功，XNook 1.3.18 失败并保留 1.3.16。未回退成功项目，Statux 同版本异 SHA 保持阻止。

## 修复

直接读取运行时 `/proc/sys/kernel/random/boot_id`，只有该文件不存在才回退 `ps`。Linux 进程 stat 读取失败时返回未知，保守保留活跃任务，不混用另一种身份格式。真正 PID 复用与进程退出检测继续保留。

官方机制：[Turbopack OsPlatform 求值](https://github.com/vercel/next.js/blob/v16.3.8/turbopack/crates/turbopack-ecmascript/src/analyzer/well_known/mod.rs#L141)。

## 验证

- 新增 7 项回归：修复前 5 失败；修复后 7 项及原服务 18 项通过。
- 全仓 2,863 项通过、9 项跳过；完整生产配置构建和类型检查通过。
- 旧 Mac 产物无 `/proc` 分支；新产物 API 与 SSR 均保留运行时探测。
- 从真实新旧产物 AST 提取身份函数，在生产 Linux 只读运行：旧产物与原生 worker 不一致，新产物与原生 worker 完全一致。
- XNook 来源复核通过，重新只读下载 3,764,033 字节、SHA-256 `1ab1afbacd4c2ed5a904dd29288321926fc9dda6b33b798548b51a96d06973d6` 校验通过，用时246秒；私有R2目标key尚不存在。原失败详细网络/存储原因未记录，不能据此断言具体异常。

## 发布与恢复

已确认原 worker 结束后才备份和发布。回滚备份 `/root/meteor-product-sync-fix-20261022/` 包含旧源码/产物、已生效下载目录、配置和38表数据库；数据库副本已传私有R2并回读验证。

上线后仅重试用户已点击确认但失败的 XNook 1.3.18：固定原检查中的 release/asset/version/SHA 再次核验，将当前目录指纹绑定到新检查快照后启动。原来源发生变化时拒绝恢复，不扩大原授权范围，也不重复更新成功项。

## 下载时限的第二处修复

状态误报修复上线后，XNook 重试明确在下载阶段300秒截止，任务正确记录失败而非“进程中断”。此前源文件只读下载成功耗246秒；独立curl同源测试90秒收到1,549,114字节，平均约17KB/s，证实当前线路较慢。

单包下载时限调整为10分钟，整个任务预算30分钟；R2操作仍限5分钟，128MiB上限、来源白名单和完整SHA校验不变。新增“6分钟合法下载成功”和“10分钟中断”回归；旧实现2项失败，新实现通过。全仓2,865项通过、9项跳过，完整生产配置构建通过。

第二次发布前已备份66d550d版本及已成功目录至 `/root/meteor-product-sync-timeout-fix-20261022/`，不回退已同步的XIsland与OmniCrawl。
