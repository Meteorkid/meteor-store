# 2026-11-05 DuoCast v0.1.1 上线

状态：已上线并完成公开下载验收。上线提交 `35b34c2`，生产 `BUILD_ID=build-TfctsWXpff2fKS`。

GitHub 最近的公开新产品仍是 `Meteorkid/duocast`。DuoCast 的 v0.1.0 页面已于 2026-11-03 上线；本次把官网下载更新到正式 Release v0.1.1，没有重复新增产品，也没有改动首页或账户流程。

## 上游发布

- Release：[v0.1.1 · 补上应用图标](https://github.com/Meteorkid/duocast/releases/tag/v0.1.1)，2026-11-04 23:21:20（北京时间），正式、非草稿、非预发布。
- 资产：`DuoCast-0.1.1-macOS-arm64.zip`，710,738 字节，SHA-256 `92efeae754d2da37459047d936bcca9855c9a5ec9b3fc74d19b4b3c9755eae28`。
- 包内 `CFBundleShortVersionString=0.1.1`、`CFBundleVersion=1`，主程序为 arm64，最低 macOS 14.2；新增 `AppIcon.icns`。
- 代码签名仍为 ad-hoc，`TeamIdentifier=not set`，没有 Apple 公证 ticket；`spctl --assess --type execute` 仍拒绝。产品页和指南保持明确披露，不写成已签名、已公证。

## 上线内容

- 下载配置切换到 `releases/duocast/0.1.1/DuoCast-0.1.1-macOS-arm64.zip`，只新增 R2 对象，没有覆盖 v0.1.0。上传后逐字节 GET 回读，大小和 SHA-256 与 GitHub 官方资产一致。
- 中英文产品页、产品列表、搜索和 sitemap 保持原有 DuoCast 入口；产品页标题去掉重复的 `| Meteor Store` 后缀。
- 中英文 `duocast-first-play` 指南更新文件名、版本和校验值；“已损坏，无法打开”分支只对 `/Applications/DuoCast.app` 移除 quarantine，并继续要求保持 Gatekeeper 开启。
- ZIP 下载现在也显示 macOS 未公证开箱提示，命令目标为实际包名 `DuoCast.app`。
- 修正 `deploy/deploy-local.sh` 在缺少镜像 remote 时把中文括号并入变量名的问题，改为 `${remote}`。这一修正只影响部署收尾的镜像同步，不改变生产运行逻辑。

## 验证

- 完整单测：363 个文件通过、4 个跳过；3,831 项通过、47 项跳过。本次相关测试 23 项通过。
- `tsc --noEmit` 通过；本次改动文件的 ESLint 通过。全仓 `pnpm lint` 仍有既有 vendor、生成脚本和文档检查脚本的 66 个错误，本轮没有新增 lint 错误。
- 生产构建成功，生成 437 个路由；激活后 PM2 健康，数据库与 Redis 正常。
- `https://www.imagentx.top/zh/products/duocast` 与英文页均显示 0.1.1 和完整 SHA-256；桌面 1440×1200、手机 390×844 截图确认下载卡、安装提示和标题布局正常。
- `/api/download/duocast?file=macos-arm64` 返回 302、`cache-control: no-store`，匿名下载最终得到 710,738 字节，SHA-256 `92efeae…eae28`，`unzip -tq` 无错误。
- 搜索同时命中产品与帮助文章，sitemap 包含中英文产品页和指南；封面 WebP、MP4 返回 200；`/api/health` 为 healthy。
- 回滚指针：`/var/backups/meteor-store-runtime-P5FbjxFp`。

## 未覆盖

- 没有在实体 Mac 上启动 DuoCast，也没有用真实耳机重新验证多路输出、蓝牙限制、快捷键或音频效果。
- 产品更新控制台目前仍只登记 XIsland、XNook、Statux 和 OmniCrawl；DuoCast 的 ZIP 尚未进入自动检查/一键同步白名单，后续版本仍需按本项目说明进行人工审核发布。
- 上游 tag 和 Release 不是 GitHub Immutable Release；本次信任边界为 Meteorkid 账户、固定资产名以及复算的字节哈希。

证据：[桌面截图](duocast-v011-20261105/desktop.png)、[手机截图](duocast-v011-20261105/mobile.png)、[线上核验摘要](duocast-v011-20261105/verification.json)。
