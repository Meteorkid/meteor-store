# 雅思精读增强上线记录（2026-11-14）

## 发布范围

用户明确要求部署上线，本次包含累计验收的字体区分与词级标记、详细笔记与48词卡、74句对的148条可选译文，以及正文点词查义。没有数据库迁移、新依赖或新必需密钥。

应用提交：`01bb00ba953a1e4e4e84761fe4fb23137a6bbf48`。发布前合入已上线的 `21d639e / 51902ab / 8f001c2` 三项 XIsland 对比页、SEO 和帮助文章更新，无冲突。GitHub / Gitee / GitLab main 均已推送。文档收尾提交不改变运行代码。

## 验证与构建

- 合入最新主线后的全量测试：403 文件通过 / 4 跳过，4245 项通过 / 47 跳过；TypeScript 通过。
- 发布前本地生产构建与32项浏览器回归已通过；上线时从 GitHub main 独立克隆重新生产构建，使用 `deploy/deploy-local.sh` 激活。
- 构建连接显式设置 `PGOPTIONS=-c default_transaction_read_only=on`，以 pg 客户端检查 default_transaction_read_only / transaction_read_only 均为 on。
- 主工作目录 `/Users/meteor/github/meteor-store` 的微信草稿等未提交改动未纳入本批，也未改写。

## 备份与回滚

- 数据库及配置备份：`/var/backups/meteor-store-ielts-reader-20261114-ySdCx36E`。
- 数据库先写 `.partial`，通过 `pg_restore --list` 后改名为 `database.dump`；SHA-256：`e643f3bf3a828e7c2762f498236070c98a77b373abd233579da29e20e45f8dc5`。
- 同目录保留发布前源码版本、BUILD_ID、环境与 Nginx 配置、crontab，以及状态计数。
- 激活脚本的应用回滚目录：`/var/backups/meteor-store-runtime-2XP8XNOm`；脚本退出0，并记录 `pm2_runtime_verified`。
- BUILD_ID 仍为 `build-TfctsWXpff2fKS`，与此前相同，因此用源码 SHA、产物清单哈希、静态文件哈希和实际功能一起判定新版本。
- app-paths-manifest SHA-256：`53b6dba6ba1082659fa5421f267b359e65d760b43389f959f9ce705c0654508d`。

## 线上结果

- PM2 online，真实 Next 进程 PID 3230623，unstable restarts=0；13个产品封面×3种宽度已预热。
- 发布前后 users=26、posts=23、ielts_pairs=0、ielts_progress=0、迁移账本58，未执行生产测试写入。
- `.env.production`、Nginx配置哈希及 crontab 与发布前一致。Redis使用项目支持的兼容变量名，已确认配置可用。
- 健康接口 healthy，self/database/Redis 均正常（验收采样数据库1ms、Redis269ms）。
- 线上 Chromium 实测：对照库题型筛选、两栏不同字体、标记开关前后英文不变、逐句译文开关、全文模式保留译文选择、笔记和词卡均正常。
- 教材点词：点击 tuition 显示本文学费释义；Escape关闭并回到对应词。
- 真实线上 AI 查词：nowadays → 如今；现在，浏览器端从点击到结果约1458ms。仅证明本样本成功，不作为所有词的延迟保证。
- 英文页面、390px手机布局、底部词义浮层通过，无 pageerror。
- 逐页核对六篇，共148条可见译文、48个可见词卡。检查以可见节点为准，避免隐藏节点在页面更新期间被重复计数。
- 匿名 progress API=401，admin API=404，均no-store；无效单词查询=400；匿名后台预览无作文正文、标题Not found。
- 抽查4个CSS与6个页面JS文件，全部HTTP 200且哈希与本次构建一致；sitemap含14个雅思入口；已有XIsland对比页仍正常返回。

## 实测边界

生产账号写入、管理员生成完整新作文与发布、实体手机、Safari/Firefox、实际扬声器音质未复验。此前本地模型异常/声音播放回归包含模拟接口和设备桩，本次只对公开查词做一次真实AI查询。
