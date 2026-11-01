# 手机后台逐页优化与验收

日期：2026-11-01。部署前基线：f5c4c06e7cd75146fb216f25175f2f1ea4c7d390。

## 改动

手机文章、审计表格改为字段卡片；统一44px触控区、16px表单字号、长内容换行。管理菜单竖排展开并限高滚动，保留概述直达。日刊/硕士/博士/公告打开编辑自动定位，保存区易触达，反馈紧邻操作；日刊内联确认避免误丢修改。文章详情/编辑在本页打开，后台编辑保存后回文章管理。举报可展开评论全文并定位到评论管理。修复非空反馈/订单日期水合不一致以及文章统计翻译缺少count参数。

## 验收范围

18页：概述、文章、审核、日刊、硕士、博士、评论、举报、账号、反馈、订单授权、产品更新、公告、监控、Pathfinder、审计、两步验证、历史邀请码。

- 本地独立PostgreSQL与合成管理员/记录，390px逐页检查；生产模式构建下320px逐页检查，均无整页横向溢出、可见主要按钮不足44px的问题。文章/审计隐藏表头仍保留语义，几何扫描中的TH/TR超界由裁剪隐藏处理，不产生页面溢出。
- 768/1024px复核文章/审计表格，英文文章管理及编辑返回入口正常。
- 浏览器实际操作：文章详情→编辑→保存→后台列表；审核驳回输入校验；日刊编辑→取消离开→保存→返回；硕士/博士保存草稿返回；公告保存；举报全文→评论定位（焦点落在目标，距顶96px）；账号明细、产品安装包详情、审计全文展开；管理菜单展开/Escape恢复焦点。
- 危险动作仅检查展示与已有测试，不执行真实退款、授权撤销、强制下线、MFA变更。生产不会创建测试账号或写测试内容。
- 全套测试3801通过、47跳过；TypeScript通过；本地生产构建通过。改动文件lint无错误，PostStats中两条未修改的旧导航写法告警仍保留。浏览器最终error日志为空。
- 本地夹具产物明确标记NOT_FOR_DEPLOYMENT，部署另从提交后的干净源码和生产只读数据库构建。

## 证据

忽略目录 `test-results/admin-mobile-audit-20261031/`：`tests-final.log`、`types-final.log`、`local-production-build.log`、`pages-390.json`、`pages-320-production-mode.json`、`additional-breakpoints.json`、`browser-flows-final.json`、`browser-errors-final.json`、`api-local-result.json`、`posts-mobile-final.png`、`daily-saved.png`。

产品更新夹具使用无效的same状态，造成历史状态文案undefined；属夹具数据问题，未修改真实状态枚举或产品更新逻辑。原始夹具保留供排查，随后仅将本地夹具更正为类型定义中的current状态并复核正常。

## 发布

已部署运行提交：`28ca76082a57d2b007dd72e55958d5f1f482d70d`。无数据库迁移、依赖或环境配置变更。

- 生产只读构建确认default_transaction_read_only和transaction_read_only均为on，使用生产数据读取生成公开静态页，测试夹具未上传。
- 构建包SHA-256：`2bff2cfd8a9fd2c6cea3d00f4597824746b755109b841b328345fa5d26eb6051`，23215073字节；2416个运行产物文件校验一致。
- 源码、配置、旧产物备份：`/var/backups/meteor-store-mobile-20261101-qtpD2YQH`；运行目录备份：`/var/backups/meteor-store-runtime-PZRQdyYJ`。回滚脚本为前者内`activate-mobile.sh rollback`，回到本轮f5c4c06基线，不回退到博士功能之前。
- PM2 pid1987165，托管进程拥有127.0.0.1:3000，health通过；环境文件、ecosystem配置和crontab前后一致。
- 线上57项HTTP校验通过：6个公开/健康地址、18个受保护页面、9个管理GET接口、24个JS/CSS请求。静态资源200且与候选哈希一致。后台页面在HTTP404或Next流式404语义下拒绝访问，抽查API均404。
- 390px线上浏览器：菜单可打开，第四项为博客，游客无管理入口，直接访问后台显示404；console error为空。
- 后台编辑写入只在本地合成数据环境执行。线上未使用真实管理员进行内容修改、退款、授权或安全设置操作；此次服务器/页面/API三层权限代码保持原样，相关测试通过。

线上证据：`deploy.log`、`online-verification.json`、`online-browser.json`、`online-mobile-menu.png`、`release-metadata.json`、`candidate-runtime.sha256`。
