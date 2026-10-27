# XNook / XIsland 软件授权实施与发布流程

日期：2026-10-26。范围：两款 macOS 客户端、Meteor Store 发码/交付/设备管理。Windows 不在本轮范围。

## 已确认规则

- 官网开放安装包下载，不要求登录或付费。客户端首次启用联网登记，每款软件各有完整 14×24 小时试用。
- 单品购买保持现有买断价格；现有 Meteor Pass 月付、年付、永久档分别发放两款软件的独立激活码，不额外定义新价格。
- 月付按 1 个日历月、年付按 12 个日历月计时，月末钳制；提前续费保留余期，过期续费从付款时开始。永久授权不被后续限期授权降级。
- 每个购买者、每款产品最多 3 台活跃设备，续费新码共享同一设备名额；管理员可赠月/年/永久码，用户与管理员可解绑设备。
- 已激活软件每次联网核验服务器当前权益。签名离线许可最长 7 天，且不能超过试用/订阅的绝对到期时间；解绑、退款后离线旧设备最迟在当前许可到期时锁定。
- 到期停止受限功能和后台服务，保留激活、购买、退出与数据导出，不删除用户数据。
- 历史单品权益按永久承接，不把旧订单 monthly/annual 字段追溯解释为新收费期限。历史免费领取记录保留；新制度启用后关闭两款软件的零元永久领取入口。

## 源码位置与基线

- 网站：`/Users/meteor/github/meteor-store`；现有日刊等未提交工作保留。
- XNook 交付工作树：`/Users/meteor/.codex/worktrees/xnook-overview-header`，起点 `7a1522a`，版本 1.3.23，保留已接受的双岛联动和界面修复。旧主目录的 WorkBuddy 改动不作为发布基线。
- XIsland：`/Users/meteor/github/xisland`，起点 `788f958`，版本 2.0.11。
- 两仓 `Sources/MeteorLicenseCore` 为相同的独立 Swift 核心副本，不依赖兄弟仓库路径；各仓独立构建。

## 协议与关键实现

网页展示的是高熵 `MS-…` 兑换码；客户端必须向服务器兑换设备绑定的签名许可。它不同于旧 `MC-…` 站内主授权和旧 XNook `XNK1-…` 离线码。

- `POST /api/software-licenses/trial`：`productId, deviceId, deviceName`。
- `POST /api/software-licenses/activate`：上述字段加 `code`。
- `POST /api/software-licenses/refresh`、`deactivate`：`productId, deviceId, deviceToken`。
- 成功 trial/activate/refresh 返回 `lease, deviceToken`；解绑返回操作结果。
- `deviceId` 为设备标识的 SHA-256 摘要，不传原始硬件标识。设备凭证保存在 Keychain，服务器只保存 token hash。
- `MSL1.<base64url JSON>.<base64url Ed25519 signature>`，签名覆盖 ASCII `MSL1.` 加 payload 段。
- 载荷字段：`version, productId, deviceId, licenseId, kind, issuedAt, expiresAt, entitlementExpiresAt`。时间为 Unix 秒；永久的 entitlementExpiresAt 为 null，但离线 expiresAt 必须有限。
- 私钥配置：服务器 `SOFTWARE_LICENSE_PRIVATE_KEY`，Ed25519 PKCS#8 PEM，支持转义换行。私钥不能放在仓库、安装包或网页中。
- 客户端公钥：构建变量 `SOFTWARE_LICENSE_PUBLIC_KEY`，原始 32 字节公钥的 Base64，写入 Info.plist `SoftwareLicensePublicKey`。API 根地址由 `SoftwareLicenseAPIBaseURL` 配置，正式值为 `https://www.imagentx.top`。

数据库迁移 `drizzle/0051_software_licenses.sql` 只新增子码、设备和试用记录表，保留 `license_keys.order_id` 唯一约束。逐软件发码不增加主订单数量，防止同一 Pass 被按软件数量重复累计。源授权状态、订单退款和累计续费在激活/刷新时重新检查；历史来源会补齐，邮件重发不新增授权时长。

## 发布顺序与回滚

默认 `SOFTWARE_LICENSE_ENABLED` 关闭：旧购买与下载行为保留，新表不会在普通授权查询中被访问。代码构建通过不等于授权服务已经上线。

1. 先备份生产数据库与运行时下载目录，确认迁移 0051 与现有迁移台账一致；生产迁移需单独确认。
2. 在受控位置生成并备份正式 Ed25519 私钥，配置服务器环境。只把公钥交给两款客户端构建。
3. 构建新版本安装包，核对 public key、API origin、版本号、签名状态和 SHA-256；测试密钥构建只能用于验收，不能发布给用户。
4. 上传相同安装包到官网分发存储和 GitHub Releases，更新官网运行时版本目录。仅改网站不会改变旧安装包行为。
5. 在测试环境完整验证购买、发码、激活、续费、赠送、解绑和退款后，再启用 `SOFTWARE_LICENSE_ENABLED=true`；同时开放两款软件试用下载并阻止旧零元领取入口。
6. 生产真实支付、真实设备和发布渠道验收单独记录，不能用隔离测试替代。

回滚关闭开关并回退网站代码/下载目录；保留新增表及已发码记录，不 DROP、不抹除试用历史。已经发布的新客户端需要授权服务，不能把关闭开关当作长期回滚方案：应恢复兼容服务，避免已购买用户的离线许可到期后无法刷新。

## 验证命令

网站：`pnpm test`、`pnpm exec tsc --noEmit`、`pnpm build`。

服务端真实隔离 PostgreSQL：`SOFTWARE_LICENSE_INTEGRATION=1 pnpm exec vitest run src/lib/software-licenses/__tests__`。测试只创建独立临时数据库、使用测试密钥，不读取现有 DATABASE_URL，结束后清理任务自己的目录。

跨语言验签：XNook 工作树中设置 `METEOR_LICENSE_FIXTURE_PATH` 指向网站的 `docs/process/software-licensing-test-fixture.json`，运行 `swift test --filter SoftwareLicenseTests`。夹具仅含测试公钥、签名和固定测试时间，无私钥。

本轮提交、生产迁移、正式密钥配置、安装替换、上传与发布均需与本地实现区分记录。

## 2026-10-27 本地完成记录

- 网站最终全量：322 个测试文件通过，3360 项通过、19 项跳过；显式启用的临时 PostgreSQL 集成测试另行通过。TypeScript 与生产构建通过。
- XNook：1148 项应用测试（88 项环境/可选项跳过）、17 项共享核心测试，0 失败；最后笔记保护调整后 19 项定向回归通过。
- XIsland：1826 项应用测试（19 项跳过）、17 项共享核心测试，0 失败。隔离 Release 验证测试参数不能启动未授权监控。
- 两款 App/DMG 均构建完成，ad-hoc 签名与 DMG 校验通过，核心源码逐文件 SHA 一致。候选只内嵌测试公钥，不可作为正式产品发布。
- 真实前端组件在本地模拟 HTTP 中完成年度双码赠送、响应中断重试复用幂等键、设备解绑检查，截图见 `software-licensing-ui/admin-gift-preview.png`。这不代表生产支付或真实三台设备验收。
- 增加软件购买/兑换的已验证邮箱与会话归属校验；避免旧游客邮箱流程误聚合同邮箱历史权益。新界面隐藏不适用于客户端的 MC 父凭证；月/年用户可提前续费。
- 原有 PricingCard 免费领取的完整导航保留，ESLint 有 1 条既有 warning、0 error；未为本任务修改无关导航。
- [完整验证与源码哈希](software-licensing-validation-2026-10-27.json)。未生成正式私钥、未执行生产迁移、未安装替换、未发布，也未提交本次代码。

## 2026-10-27 账号管理定向赠送入口

- `/admin/users` 每个账号旁新增“赠送激活码”。面板锁定该账号邮箱，支持 XNook、XIsland 或两者，以及月度/年度/永久期限。
- POST 带 `recipientUserId`，后台核对目标 ID 与邮箱；用户不存在返回 404、邮箱变化返回 409。未验证接收人仅提示验证后到账户页领取，不自动改写其验证状态。
- 未确认赠送的幂等键保留在当前浏览器模块内；面板关闭后的旧响应不得读取并清除新面板的重试状态。重开后相同选项继续使用同一请求 ID。授权结果同时绑定当前管理员和接收邮箱。
- 软件授权开关关闭时入口不显示；原商业管理按邮箱赠码仍可用。赠送直接生成软件码并记入账户，不额外发出邮件或修改账号权限。
- 最终全站测试 3370 项通过、19 跳过，生产构建与 TypeScript 通过；定向 ESLint 无警告。真实组件加模拟 HTTP 验证延迟 4 秒的 POST 关闭重开、重试复用与 A/B 账号隔离。
- [本次验证与文件哈希](software-account-gift-validation-2026-10-27.json)，截图 `software-licensing-ui/account-gift-preview.png`。未提交、未上线、未给真实账号发码。
