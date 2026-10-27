# XNook / XIsland 授权服务

状态：本地实现与隔离 PostgreSQL 验证完成。生产迁移、密钥配置、客户端下载版本与部署需统一验收后执行。

## 发布顺序

1. 备份数据库与现有软件发布目录，部署前保持 `SOFTWARE_LICENSE_ENABLED` 未设置或 `false`。
2. 执行新增迁移 `0051_software_licenses.sql`。只增三张表，旧订单与旧授权结构不变。
3. 在仓库外生成并保管 Ed25519 私钥：`node scripts/software-license-keys.mjs generate /安全目录/software-license-private.pem`。脚本拒绝覆盖已有文件，只输出公钥。
4. 将 PEM 内容配置为服务器环境变量 `SOFTWARE_LICENSE_PRIVATE_KEY`（支持实际换行或字面 `\n`）。客户端只内嵌脚本输出的 32 字节公钥 Base64。**不要把私钥放入仓库、安装包或前端变量。**
5. 发布两款已经接入协议的新安装包，并确认本地、网站下载和 GitHub Release 使用同一批准产物。
6. 部署网站，验证未启用时保持原下载/商业行为，再设置 `SOFTWARE_LICENSE_ENABLED=true`。该开关启用新发码与 API；开关不是客户端解锁开关。
7. 通过实际支付/赠码、下载、激活、解绑与退款验收后开放销售。

回滚：关闭新销售/下载切换并回滚应用版本；保留新增三表，避免丢失已发出的码与设备记录。**不要在已有用户使用时长期关闭授权服务**：已有租约最多有效 7 天，关闭服务最终会令客户端锁定。长期回滚须保留兼容授权端点。旧订单状态仍由原支付/退款系统管理。

## 模型与有效期

- `license_keys` 继续一笔订单/赠送一条主授权。`software_license_codes` 是按产品展开的子码，唯一约束为来源授权 ID 与产品 ID，不重复计算 Pass。
- 新授权开关启用后，XNook、XIsland 与 Meteor Pass 的下单者须登录并验证邮箱，订单邮箱必须与会话邮箱一致；避免任填他人邮箱后借用其历史累计授权。管理员赠送仍可指定接收邮箱。
- 月付为 1 个日历月，年付为 12 个月，月末钳制。提前续费从原到期日顺延，过期后从付款日起算。永久优先，不被后续月/年码降级。旧单品无论旧 billing_period 内容如何均保留永久权益。
- 历史已购/已兑换在已验证账号查询、交付新订单、激活或刷新时幂等补齐。不能通过每次生成新码延长权益。
- 每次签发租约前重新读取有效来源：订单必须已付款，父授权必须 active，邀请码必须有兑换记录。退款后重新计算剩余有效授权。已签发离线租约最多还有 7 天，不承诺离线设备即时撤销。
- 设备名、不可逆硬件摘要和设备令牌摘要存储在服务端。每个邮箱身份、每款产品最多 3 台活跃设备；续费共享同一组设备。令牌只保存 SHA-256，不返回给网站列表或数据导出。
- 试用首次联网开始，连续 14×24 小时；卸载、解绑、换授权不删除原试用起点。账号注销删除设备名与邮箱绑定，保留不含邮箱的试用摘要以避免重置试用。
- 数据导出与注销根据新增表是否实际存在执行，不受销售开关影响；关闭开关回滚后仍能导出、清除已保存的设备资料。

## 客户端协议 MSL1

POST `/api/software-licenses/trial`：`{productId,deviceId,deviceName}`。

POST `/api/software-licenses/activate`：以上字段加 `code`。

POST `/api/software-licenses/refresh`、`/deactivate`：`{productId,deviceId,deviceToken}`。

productId 只允许 `xnook` 或 `xisland`，deviceId 是 64 位小写 SHA-256 hex，设备名最多 100 字。请求体上限 4 KiB。四个接口均不依赖网站 cookie。成功 trial/activate/refresh 返回 `{lease,deviceToken}`，解绑返回 `{success:true}`。响应一律 no-store。

lease 为 `MSL1.<base64url(JSON UTF-8)>.<base64url(Ed25519 signature)>`。签名输入为 ASCII `MSL1.` 与 payload 段的原始拼接，不能重新序列化 JSON 后验签。

payload 字段：`version:1, productId, deviceId, licenseId, kind, issuedAt, expiresAt, entitlementExpiresAt`。时间均为 Unix 秒；`kind` 为 trial/monthly/annual/lifetime。`expiresAt` 是离线租约终点，不超过签发后 7 天及实际授权到期点；`entitlementExpiresAt:null` 仅表示永久授权。

客户端必须检查签名、版本、产品、设备、签发时间与租约到期；遇到 403 授权错误清除使用权限；网络失败/5xx 只能继续使用尚未到期的已验证租约，不能自行延长。服务端停用/未配置密钥返回 503，不返回伪成功试用。

## 用户与管理员接口

- GET `/api/software-licenses`：已登录且邮箱已验证，返回 `{userId,licenses,devices}`。
- PATCH 同地址：`{action:'revoke-device',id}`，id 为设备记录 UUID。
- GET `/api/admin/software-licenses?email=...`：管理员查看指定邮箱的码与设备。
- POST 管理地址：`{email,productIds,kind,memo?,requestId}`，requestId 为每次赠送的 UUID 幂等键。
- PATCH 管理地址：`{action:'revoke-device',email,id}`。
- 所有管理写操作要求 `X-Software-License-User` 与当前 session.userId 一致，检查 Origin、限流，并保留管理员审计。管理员身份来自现有 ADMIN_EMAILS 与邮箱验证检查。

## 验证

常规：`pnpm exec vitest run src/lib/software-licenses/__tests__/policy.test.ts src/lib/software-licenses/__tests__/lease.test.ts`。

真实数据库：`SOFTWARE_LICENSE_INTEGRATION=1 pnpm exec vitest run src/lib/software-licenses/__tests__/service.integration.test.ts`。测试使用任务专属临时目录、Unix socket 与本地 PostgreSQL；不读取现有 DATABASE_URL；退出时停库并清理，仅需本机 initdb/pg_ctl。

跨语言夹具：`docs/process/software-licensing-test-fixture.json`，只含临时生成公钥与签名，未持久化私钥。测试时钟为 `2000000000` Unix 秒，勿用于生产配置。
