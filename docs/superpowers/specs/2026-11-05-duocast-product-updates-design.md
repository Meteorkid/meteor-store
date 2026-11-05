# DuoCast ZIP 产品更新接入

用户要求把 DuoCast 的 ZIP 加入现有产品更新控制台，支持管理员先检查 GitHub 最新正式版，再对检查结果执行一键同步。保留原有的两步流程、固定来源、私有 R2、完整回读和失败不覆盖边界。

## 固定来源

来源固定为 `Meteorkid/duocast` GitHub Releases，版本必须是正式三段式版本，资产必须是唯一的 `DuoCast-${version}-macOS-arm64.zip`，下载条目稳定 ID 为 `macos-arm64`，R2 key 固定为 `releases/duocast/${version}/DuoCast-${version}-macOS-arm64.zip`。不接受 Windows、DMG、预览版、草稿或同名替身。

## ZIP 校验

ZIP 只在内存中解析，不调用外部解压程序，也不写入临时目录。上传前按“外层大小与sha256 → ZIP结构 → 内部应用身份”验证：

- 只允许单磁盘非 ZIP64、条目数不超过 1024、中央目录不超过 4 MiB、总解压不超过 128 MiB，单条目不超过 64 MiB。
- 条目仅允许 stored 或 raw DEFLATE；拒绝加密、strong encryption、masked central directory、ZIP64 extra 与未知 flags。
- ASCII 文件名是唯一解压路径；拒绝 Info-ZIP Unicode Path Extra `0x7075`，避免校验名与解压名不一致。
- 检查中央目录和本地头一致、data descriptor 完整、数据区间连续无重叠，并逐条计算 CRC-32。
- 拒绝绝对路径、反斜杠、空段、`.`、`..`、大小写冲突、符号链接、设备文件和其他特殊文件。
- 应用内容只允许 `DuoCast.app/`，以及对应的 `__MACOSX/DuoCast.app/` AppleDouble 元数据；必须有 `Info.plist` 和固定主程序。
- 主程序必须是 thin arm64 `MH_EXECUTE`，load command 范围不得越界。
- 主程序必须包含结构完整的 `LC_SEGMENT_64 __TEXT`，且命令数与命令区长度一致。

上传 MIME 固定为 `application/zip`；R2仍使用 `IfNoneMatch: '*'` 条件写入并在写入后完整回读sha256。

## 兼容与回滚

产品目录白名单加入 `duocast: ['macos-arm64']`。revision 纳入当前登记产品与 fileId 集合；上线后旧的四产品检查快照会自动失效，要求重新检查。

新代码能读取不含 DuoCast 的旧目录；一旦目录写入 DuoCast，回滚到旧代码会被旧白名单判为损坏。因此回滚包必须包含本接入，或先恢复到上一个合法目录，不能只回退代码。

帮助文章不再写死版本与sha256，改为使用产品页下载卡的当前文件名，并让完整校验值指向对应 GitHub Release；以后同步不更新文章也不会留下过期版本承诺。

## 验收

- 来源：DuoCast固定仓库、精确ZIP名、官方digest、release/asset复核和URL白名单。
- 容器：带签名/无签名data descriptor、stored/deflate、CRC、ZIP64、加密、路径穿越、符号链接、大小限制和arm64 Mach-O。
- 任务：DuoCast固定R2 key、`application/zip`、完整回读、目录原子切换和失败保留旧下载。
- 线上：当前v0.1.1只读检查应为current；真实ZIP为710738字节且sha256完全匹配。没有新版本时不制造伪更新，也不写生效目录。
