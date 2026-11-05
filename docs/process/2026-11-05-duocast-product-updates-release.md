# 2026-11-05 DuoCast 产品更新控制台上线

状态：已上线并完成生产只读检查。运行提交 `e931582`，生产 `BUILD_ID=build-TfctsWXpff2fKS`，PM2 PID `2341616`。

## 已上线能力

- 后台“产品更新”现在固定登记 `Meteorkid/duocast` 的正式 GitHub Release；DuoCast 出现在五款可检查产品中。
- 检查只接受唯一的 `DuoCast-{version}-macOS-arm64.zip`，绑定 release ID、asset ID、文件名、大小和官方 SHA-256；发现更新后仍需管理员另行点击“一键同步”。
- 目录白名单只允许 `duocast / macos-arm64`，R2 key 固定为 `releases/duocast/{version}/DuoCast-{version}-macOS-arm64.zip`。
- ZIP 在内存解析，不调用外部解压程序。逐条核对中央目录、本地头、data descriptor、CRC-32、连续数据区间和大小上限；拒绝加密、ZIP64、Unicode Path Extra、符号链接/特殊文件、路径穿越和额外顶层内容。
- 包内必须只有一个 `DuoCast.app`，包含 `Info.plist` 与固定主程序；主程序必须是 thin arm64 `MH_EXECUTE`，load commands 结构完整并含 `LC_SEGMENT_64 __TEXT`。
- 同步上传 MIME 为 `application/zip`；继续使用 R2 `IfNoneMatch: '*'`、完整回读 SHA 和成功后的原子目录切换。
- catalog revision 纳入当前登记产品/fileId 集合；以后新增来源会令旧检查快照失效。帮助文档不再写死版本与 SHA，改为使用产品页当前文件名并链接对应 GitHub Release。

## 生产验收

- 部署前备份产品更新运行目录：`/var/backups/meteor-product-updates-duocast-20261105.dW4Y0t`，13 个文件均记录 SHA-256。
- 部署回滚目录：`/var/backups/meteor-store-runtime-bVUXrBEy`。
- 生产当前 revision：`cdc104c24706a3c4d619e15a30b10baa4fa4cf09f0a44188796a01062c732a51`。
- 后台真实检查返回五款：`duocast, omnicrawl, statux, xisland, xnook`。DuoCast 当前版本与官方最新版本均为 `0.1.1`，状态 `current`；官方资产 710,738 字节，SHA-256 `92efeae754d2da37459047d936bcca9855c9a5ec9b3fc74d19b4b3c9755eae28`，asset ID `709955805`。
- 验收只刷新 `check.json`，没有执行“一键同步”，没有写入新安装包，也没有改写生效 `catalog.json`。检查同时发现 XIsland 2.0.16 可更新，但本次未同步该无关版本。
- 生产 `/api/health` 为 healthy，数据库与 Redis 正常；DuoCast 公开下载仍返回 302、no-store 和 v0.1.1 私有对象。
- 完整单测 3,838 项通过、47 项跳过；TypeScript、改动文件 ESLint、worker/deploy shell 语法和 `git diff --check` 通过。生产构建生成 437 个路由。
- 真实官方 v0.1.1 ZIP 通过新校验器；构造的 Unicode Path Extra、错误 CRC、ZIP64、加密、符号链接、额外顶层内容、错误架构和非法 Mach-O 样本均被拒绝。
- 生产服务器用实际 worker 的 `downloadArtifact` 路径下载并解析官方包：710,738 字节、SHA-256 `92efeae…eae28`，未执行 R2 上传。

## 未覆盖

- 生产当前没有 DuoCast 新版本，因此“把未来 DuoCast 正式版实际写入生产 R2 并点击一键同步”没有执行；该路径由隔离 worker fixture 覆盖，会在真实新版本出现后按同一检查/确认流程执行。
- 本次没有在实体 Mac 上重新运行 DuoCast 或验证真实音频设备。
- 若未来自动同步写入 `duocast` 目录，回滚代码必须包含本次白名单；不能只退回不含 DuoCast 支持的旧提交。

证据：[核验摘要](duocast-product-updates-20261105/verification.json)。
