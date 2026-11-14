# 生词本与表达块：生产发布记录

> 发布日期：2026-11-14；用户明确授权“提交并部署这版”。

## 提交与范围

- `f544077`：私人生词快照、HMAC保存凭据、复习API与0058迁移。
- `1616555`：查词收藏、生词本、工作台/铃铛提醒、账号导出注销及跳转滚动修复。
- `8c5897f9b7a6247c263b4490b26331dfaa34a1f4`：39处表达块、完整句定位、生成协议与验收记录；此为运行代码版本。
- 提交后rebase到最新主线，保留 `eda3eb5` 至 `8f06648` 六项已上线内容/SEO/部署修复。GitHub / Gitee / GitLab三端已同步。
- 主目录 `/Users/meteor/github/meteor-store` 的微信草稿、Nginx等未提交工作未纳入本批。

## 迁移与回滚

- 备份目录：`/var/backups/meteor-store-vocabulary-20261114-PArFhbzE`，含数据库、配置、crontab及发布前版本信息。
- 数据库先写 `.partial`，通过 `pg_restore --list` 后改名 `database.dump`。SHA-256：`e27efea4ff490941c772ba5ac581c6b8996bb4997c2b2830d15fde8364f1efc0`。
- 先执行0058，再切应用。账本58→59；迁移hash `7e593fed8c3dd4807427c9338a2fad09bfa8d24e3372e02c4d0fe3d9afe71c4d`，when `1794646086665`。
- 仅新增study_vocabulary及三个索引/七个检查约束，迁移后0行；users=26、posts=23、ielts_pairs=0、ielts_progress=0与发布前相同。
- 应用回滚目录：`/var/backups/meteor-store-runtime-CLh62Ssl`。应用回滚时保留新表与快照，不删除用户收藏。

## 构建与运行

- 合入主线后的完整测试：411文件通过/4跳过，4328项通过/47跳过；TypeScript通过。前一阶段40项隔离数据库与浏览器回归记录仍保留。
- 独立克隆本地构建；生产数据库构建连接显式设置只读，pg客户端查询default_transaction_read_only及transaction_read_only均为on。
- 首次构建启动早于依赖安装完成，`next: command not found`导致脚本在上传前中止；依赖安装退出0、确认Next可执行后重试。第二次正常编译并完成472个静态页面，没有使用非零退出的产物兜底分支。
- 激活脚本退出0，记录pm2_runtime_verified；真实Next PID=3247200，PM2 online、unstable restarts=0，产品封面13×3规格已预热。
- BUILD_ID仍为`build-TfctsWXpff2fKS`，不单独作为版本依据。服务器Git SHA为`8c5897f`；app-paths-manifest SHA-256为`249023cbf0f0a72b6efdcc0fc107a15f9bc8facc44813ec544464b4b1ffe2775`。
- 环境、Nginx配置哈希与crontab逐字校验一致；没有新增密钥或定时任务。

## 线上验收

- 使用本机已安装Chrome的独立headless上下文；Playwright缓存浏览器缺失后改用系统Chrome，未操作用户浏览器会话。
- 六篇27段39个可见表达块确认，重点卡/支持卡、键盘定位并展开原句、译文选择保持、英文及390px布局通过，无pageerror。
- 教材词tuition查义正常；游客看到“登录后加入生词本”，回跳指向原作文。
- 查词v1只返回entry/source；v2返回saveToken/sourceKey，公开快照中的单词、原句定位及学费释义核对一致。
- 生词列表、收藏和复习API在匿名状态下均401/no-store；中文与英文私有页面均回跳对应语言登录页，next为/study/vocabulary。
- 私人生词本不进入sitemap；雅思公开入口仍14个。10个页面JS/CSS全部200，SHA-256与本次产物一致；既有竞赛入口仍返回200。
- 公开健康接口healthy，self/database/Redis正常（采样数据库2ms、Redis80ms）。

## 边界

线上未创建测试账号、未写入私人收藏、未调用新作文生成。收藏、复习、并发保护、账号隔离和导出的写入证据来自此前真实隔离PostgreSQL+浏览器验收。实体手机、Safari/Firefox和真实声音未补测。

本记录的后续文档提交无需重新部署，不改变上述运行代码版本。
