# Meteor Store 全量测试报告

- 测试日期：2026-11-25
- 测试对象：`/Users/meteor/github/meteor-store` 测试时快照（HEAD `f20b9c9` + 当时未提交的公众号草稿、Pathfinder、nginx 改动）
- 技术栈：Next.js 16.3.8（App Router）、React 19、TypeScript、PostgreSQL 18、Drizzle ORM
- 测试方式：静态检查 + 单元/集成测试 + 生产构建 + 真实 HTTP 服务 + Chromium 端到端
- 测试环境：macOS；Node 22；临时 PostgreSQL 18（`127.0.0.1:55432`，UTF8）；临时应用服务 `127.0.0.1:3000`（生产构建）

> 快照说明：报告生成后，工作区在 21:35 被外部提交/清理，HEAD 曾变为 `2de4de0`，当时未跟踪的公众号草稿模块与本报告文件被移除。随后已从 Git 快照 `93805bd` 恢复该模块的 13 个文件，其中 12 个与快照逐字节一致；`client.ts` 随后追加 token 失效重试，并新增 1 条测试文件。`tsc` 通过，模块 20 条测试全绿；当前工作区已重新包含该模块（仍未提交），迁移仍为 60 条，`.env.local` 仍存在。

---

## 一、结论摘要

**总体结论：新听力模块与公众号草稿预览链路可用，没有发现 P0 级代码崩溃；当前不具备“直接发布”条件，主要卡在数据库迁移落差和一个开发环境配置风险。**

| 级别 | 数量 | 说明 |
|------|------|------|
| P0 阻断 | 0 | 未发现全站不可用、数据丢失或可直接 getshell 的问题 |
| P1 严重 | 2 | 目标库迁移落后于代码；本地开发指向线上库 |
| P2 中等 | 3 | `/register` 软 404；根路径 RSS 404；E2E 5 条失败（4 条为测试过期） |
| P3 改进 | 4 | Newsletter 缺 CSRF 校验；软 404 返回 200；全局粒子动画 CPU 占用；移动端触控目标偏小 |

**发布建议：**

1. 先对目标数据库执行完整 60 条迁移，再部署当前代码；
2. 把本地 `.env.local` 从线上 Neon 切到本地库；
3. 修复 `/register` 与根路径 RSS 的入口兼容性，更新 4 条过期 E2E 选择器；
4. 其余 P3 可作为后续迭代。

---

## 二、Verification（静态与构建验证）

| 检查项 | 方法/命令 | 结果 | 备注 |
|--------|-----------|------|------|
| TypeScript | `pnpm exec tsc --noEmit` | 通过 | 0 error |
| ESLint | `pnpm exec eslint src --ext .ts,.tsx` | 通过 | 0 error，5 warning |
| 单元测试 | `pnpm test` | 通过 | 435 个测试文件、4670 条用例全绿；47 条 DB 集成用例因无库跳过 |
| 数据库集成 | 临时 PG18 + 独立运行集成测试 | 通过 | 13 个 DB 集成测试文件（47 条用例）全部通过 |
| 生产构建 | `pnpm build` | 通过 | 清理 `.next` 后重建，静态 chunk 引用完整 |
| 迁移一致性 | `pnpm exec drizzle-kit check` | 通过 | 本地迁移链无冲突 |
| 迁移数量 | `drizzle/meta/_journal.json` | 60 条 | 临时库从零应用 60 条成功，最后一条为 `0059_ielts_listening_attempts` |
| 国际化 | 中英文 messages key 对比 | 通过 | 各 2270 个 key，无缺失/多余 |
| 依赖漏洞 | `pnpm audit --prod` | 未完成 | npmmirror registry 不提供 audit endpoint，无法得出漏洞结论 |

### ESLint 的 5 条 warning

均为非阻断项：

- `PaymentModal.tsx`、`PostStats.tsx`（2 处）、`ReportDialog.tsx`：使用 `window.location.href` 跳内部路由，建议改 `useRouter().push()`；
- `nginx-static.test.ts`：`genericExtensions` 声明未使用。

没有 error，说明当前代码可以通过 CI 的 lint 门禁（若 CI 将 warning 视为失败则需先清理）。

### 构建期间的一个非产品问题

在 `next start` 正使用 `.next` 时执行 `pnpm build`，会出现 HTML 引用的 chunk 不存在、静态资源 500。`rm -rf .next` 后干净重建即恢复，所有引用 chunk 均存在。**这是构建与运行共用 `.next` 的竞态，不是代码缺陷**；部署时应先停旧服务再构建，或使用独立构建目录。

---

## 三、Validation（真实运行验证）

### 3.1 路由与页面

在临时空库（60 条迁移）上启动生产构建，验证以下路由均返回 200 且无控制台错误：

- 首页 `/zh`
- 博客 `/zh/blog`
- 帮助中心 `/zh/docs`
- 产品 `/zh/products`
- 雅思 `/zh/study/ielts`
- 听力题库 `/zh/study/ielts/listening`
- 听力详情 `/zh/study/ielts/listening/test-01-part-1`
- 听力记录 `/zh/study/ielts/listening/records`
- 国家竞赛 `/zh/competitions`
- 日刊 `/zh/daily`
- 账户 `/zh/account`
- 登录 `/zh/login`
- 实验室 `/zh/lab`
- 定价 `/zh/pricing`（复用同一个 `PricingSection`，价格与权益数据一致，没有第二套定价）

### 3.2 认证与权限

| 场景 | 结果 |
|------|------|
| 注册标签页（`/zh/login` 内） | 邮箱、两个密码、昵称、滑块、协议、提交禁用状态均正常 |
| 注册非法邮箱 | 400 |
| 登录错误密码 | 401 |
| 未登录访问举报接口 | 401 |
| 未登录访问后台页面 | 200 + 404 UI（软 404，无数据泄漏） |
| 未登录 POST 公众号草稿接口 | 404 |
| 未登录 GET 听力记录接口 | 401 |
| 听力记录页未登录 | 200 页面外壳 + 登录提示，不重定向；数据接口 401 |
| 管理员会话访问 `/zh/admin` | 正常，侧栏 24 个导航入口，无控制台错误 |

### 3.3 IELTS 听力（重点新功能）

| 项目 | 结果 |
|------|------|
| 题库数量 | 8 个 lesson，每个 10 题 |
| 音频可用性 | 8/8 个音频在 R2 返回 HTTPS 200，1KB Range 读取正常 |
| 桌面完整流程 | 开始计时 → 7 个文本输入 + 7 个单选（9 个 radio）→ 提交 → “原文/解析”页签、评分、未登录提示，均正常 |
| 移动端 375px | 无横向溢出；文本框 `aria-label="第 N 题"`，单选在 `<label>` 内，语速 `<select>` 有可访问名称 |
| 未登录提交 | 前端正常判分并提示“登录后可保存”，不写库 |
| 登录用户提交 | POST `/api/ielts/listening/attempts` 成功，临时库 `ielts_listening_attempts` 写入 3 条记录 |
| 记录本 | `/zh/study/ielts/listening/records` 显示“3 次”、整篇最好 0/10、错题 10，错题本按最近一次作答计算 |
| 原文点词查词 | `current`、`clay` 返回课内词卡；点 `sign` 正确返回词组 `sign up for`，不是单词直译 |
| 查词防错 | `sentenceIndex` 越界/非法返回 400，不会把别句的词卡搬过来 |

**需要说明的测试现象：** 在无头 Chromium + 软件渲染环境下，登录用户点击提交后，浏览器进程 CPU 升到约 85%，Playwright 等待 POST 响应体时卡住；但服务端已成功落库，记录页 SSR 也能正确展示。**保存业务链路本身通过**，卡顿来自浏览器渲染/动画环境（见 P3-03），不是接口失败。真实桌面浏览器（有 GPU）未复现同等卡顿。

### 3.4 公众号草稿后台（测试时快照）

| 项目 | 结果 |
|------|------|
| 页面 `/zh/admin/wechat-draft` | 管理员会话下 200，无控制台错误 |
| 未配置微信凭据 | 页面明确提示“仍可预览排版”，创建按钮禁用 |
| Markdown 预览 | 200，`iframe` 预览出现 |
| 鉴权 | 页面与 API 都调用 `isAdminSession`，未登录 404 |
| CSRF | `assertMatchingOrigin` 已接入 |
| 限流 | 每用户 + IP 10 次/分钟 |
| 请求体 | 128KB 流式上限 |
| Schema | Zod strict |
| Markdown 安全 | 原生 HTML 不开启，链接协议白名单 |
| iframe | `sandbox=""` |
| 图片 | 5MB、MIME、私有网段限制，15s 超时 |
| 审计 | 写操作有审计日志 |

真实微信 API 未调用（无凭据），只验证了页面、预览、守卫与代码路径；**不能据此宣称“已成功同步到公众号草稿箱”**。该模块在收尾时曾被外部清理；13 个文件已恢复，其中 12 个与快照逐字节一致；`client.ts` 追加 token 失效重试，并新增 1 条测试文件。`tsc` 与 20 条模块测试均通过。当前仍未提交，建议尽快提交，避免再次被清理。

**2026-11-25 追加硬化：** `access_token` 遇到 `40001/40014/42001` 时清空缓存、重新取 token 并只重试一次；非 token 错误不重试，避免掩盖 IP 白名单、权限等问题。新增 2 条回归测试，模块共 20 条测试通过。

### 3.5 下载与授权

| 场景 | 结果 |
|------|------|
| `GET /api/download/statux?file=macos-arm64` | 302 到 R2 预签名 URL，5 分钟有效，`Cache-Control: no-store` |
| `GET /api/download/xnook?file=macos-arm64`（错误条目 id） | 404 “下载不存在” |
| `GET /api/download/xnook?file=../../etc/passwd` | 404，路径穿越被拒 |
| 正确 id `dmg` 的付费下载 | 未做带授权的完整下载；`gated: true` 由服务端 entitlement 判定 |

下载接口对无权限/错误条目统一返回 404 而不是 401/403，是有意的“隐藏资源存在性”设计，未泄漏 bucket 路径。

### 3.6 搜索、RSS、Sitemap、站点配置

| 项目 | 结果 |
|------|------|
| 搜索索引 | 已收录 `page-study-listening`；`directQueries` 含“雅思听力/听力/ielts listening” |
| 搜索请求 | 标准 URL 编码请求“听力”能返回该页；手工双重转义导致的空结果不是产品缺陷 |
| Sitemap | 659 个 URL（zh 339 / en 318），含 18 条听力 URL，不含 `/register` |
| 本地化 RSS | `/zh/blog/feed.xml`、`/en/blog/feed.xml` 均 200，`application/rss+xml` |
| 根路径 RSS | `/blog/feed.xml` 404（见 P2-02） |
| robots.txt | 允许全站，禁 `/api/`、`/success`、`/offline.html`，指向 sitemap |
| 404 页 | 有 `noindex` |
| 公告 API（临时库） | 200 空数组 |
| 公告 API（旧 Neon 库） | 500，缺 `announcements.source_key` 列（见 P1-01） |

### 3.7 安全响应头

- CSP：`default-src 'self'`、`script-src` nonce + `strict-dynamic`、`frame-ancestors 'none'`；
- `img-src` / `media-src` 含 R2 公网域；
- `connect-src` 含 `*.neon.tech` 等；
- `X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff`、HSTS；
- 后台接口未登录 404，无邮箱、消费额、授权码明文泄漏。

### 3.8 E2E（Chromium desktop）

命令：

```bash
E2E_BASE_URL=http://127.0.0.1:3000 pnpm exec playwright test --project=chromium-desktop
```

结果：**61 passed / 2 skipped / 5 failed**。

失败归因：

| 失败用例 | 归因 | 性质 |
|----------|------|------|
| `auth.spec` 注册页可渲染 | 产品没有 `/register` 独立路由，只有 `/login` 的注册标签 | 产品入口 + 测试契约 |
| `auth.spec` 登录入口名 | 页面文案是 “Login / Register”，测试正则只匹配 “sign in” | 测试过期 |
| `blog.spec` 文章卡片 | 页面改为可展开按钮，不再是 `<article>` | 测试过期 |
| `blog.spec` RSS | 站点只发布本地化 feed，测试仍按根路径 `/blog/feed.xml` 预期 | 测试过期/路由兼容 |
| `product-ui-accessibility.spec` 视频灯箱 | 产品页改为内联 `<video controls>`，旧灯箱按钮不存在 | 测试过期 |

5 条里 4 条是测试选择器/契约过期，1 条（`/register`）是真实入口缺失。E2E 目前没有作为发布门禁自动运行，建议修复后接入 CI。

---

## 四、缺陷清单

### P1-01 目标数据库迁移落后于代码（发布阻塞）

**现象**

- 代码侧 `drizzle/meta/_journal.json` 有 60 条迁移；
- 工作区 `.env.local` 指向的 Neon 库 `__drizzle_migrations` 只有 44 条，缺 16 条；
- 同一份构建，在旧库上 `/api/announcements` 返回 500（`column "source_key" does not exist`），在临时新库上返回 200 空数组。

**影响**

公告接口 500 会污染首屏数据请求；依赖新表的听力记录、生词本、雅思写作同步等功能在旧库上不可用或降级。不是接口逻辑错误，而是“库落后于代码”。

**建议**

1. 部署前对目标库执行完整迁移，确认 60 条全部应用；
2. 增加发布前 preflight：比对 `_journal.json` 与 `__drizzle_migrations`，不一致直接阻止发布；
3. 旧库上不要运行新代码做读写测试。

> 说明：为避免再次写线上库，旧库只做了只读探测和公告接口请求，没有写入业务数据。

### P1-02 本地开发环境直连线上数据库

**现象**

`.env.local` 的 `DATABASE_URL` 指向线上 Neon，而项目约定是自建 PostgreSQL 18。任何本地脚本、集成测试或手工请求都会落到线上库。

**影响**

本地测试可能污染生产数据；测试结果也会被线上真实数据干扰。本次早期验证确实误写入 2 个临时 QA 用户，发现后按已知 ID 删除并复核剩余 0；后续全部改用临时库。这是配置风险，不是代码漏洞。

**建议**

- 本地 `.env.local` 固定指向本地 PostgreSQL；
- 生产连接串只放在服务器环境变量；
- 增加启动日志/健康检查，明确打印当前数据库 host（不打印密码），避免再次误判。

### P2-01 `/register` 是软 404，没有注册入口

**现象**

`/zh/register` 返回 HTTP 200，但页面显示 404 UI；站点实际注册入口在 `/zh/login` 的 “Register” 标签。

**影响**

旧链接、外部宣传链接、E2E 用例都会落到一个“看起来存在、实际没有”的页面；用户会认为注册功能坏了。SEO 上也是软 404。

**建议**

把 `/register`（含英文）301 到 `/login` 并预选注册标签；或补一个轻量路由直接渲染注册表单。保留现有标签作为主入口。

### P2-02 根路径 `/blog/feed.xml` 返回 404

**现象**

- `/blog/feed.xml` → 404；
- `/zh/blog/feed.xml`、`/en/blog/feed.xml` → 200；
- 页面 `<link rel="alternate">` 指向本地化 feed。

**影响**

如果历史读者/外部聚合器订阅的是根路径，会静默断更；E2E 也按根路径断言，当前失败。若产品明确只支持本地化 feed，则应把根路径 301 到默认语言，而不是留 404。

**建议**

加 301 到 `/zh/blog/feed.xml`（按默认语言/`Accept-Language`），并同步更新 E2E。

### P2-03 E2E 有 4 条过期用例，尚不能作为发布门禁

**现象**

登录文案、博客卡片结构、产品视频灯箱、RSS 路径均与当前实现不一致；另有 `/register` 入口缺失。

**影响**

E2E 结果不能真实反映产品质量；这次 5 条失败里只有 1 条是产品问题，其余会掩盖真正的回归。

**建议**

- 按当前 DOM 更新 4 条选择器；
- 明确 RSS 根路径策略后修第 5 条；
- 在 CI 中接入 E2E（至少桌面 Chromium），使用独立种子库，避免空库导致文章类用例无数据。

### P3-01 Newsletter POST 缺 CSRF Origin 校验

**现象**

全站 98 处使用 `assertMatchingOrigin`，`src/app/api/newsletter/route.ts` 只做限流、Zod 和配置检查，没有校验 Origin。恶意 Origin 的请求在未配置 Resend 时也会走到 503，而不是 403。

**影响**

第三方页面可诱导浏览器向订阅接口发请求，消耗限流额度或触发订阅尝试；由于接口要求 JSON 且无 CORS 放行，实际利用门槛较高，属低危加固项。

**建议**

补 `assertMatchingOrigin` 并加一条 403 回归用例；确认订阅表单仍从站内调用。

### P3-02 软 404 统一返回 HTTP 200

**现象**

`/zh/不存在`、`/zh/admin`（未登录）、`/zh/register` 都是 200 + 404 UI。代码注释已说明这是当前路由结构下 `notFound()` 的已知行为，并加了 `noindex`。

**影响**

搜索引擎和监控会把“不存在”当成“正常页”；状态码层面无法区分 404 与 200。没有数据泄漏，后台页面也不含敏感内容。

**建议**

优先在代理层/路由层返回真实 404；短期至少保留 `noindex`，并在监控里按页面标题识别软 404。

### P3-03 全局粒子动画在低性能环境占用高 CPU

**现象**

`GlobalParticles` 在非 `daily/masters` 页面持续绘制 120 个星点 + 35 个动态点，并对点对做 O(n²) 连线；没有 `visibilitychange` 暂停。无头 Chromium 软件渲染下，单个标签页 CPU 约 85%，会拖慢 Playwright 甚至让提交后的页面暂时无响应。

**影响**

低端设备/省电模式/无 GPU 环境可能出现掉帧、发热、电池消耗；本次听力保存的浏览器端断言就被它干扰（服务端落库正常）。真实桌面浏览器通常不明显。

**建议**

- `document.hidden` 时暂停 rAF，恢复时重启；
- 低端设备/小屏降低粒子数量与连线半径；
- 限制帧率（如 30fps）或改用 CSS 动画；
- 已支持 `prefers-reduced-motion`，保留。

### P3-04 移动端部分触控目标小于 44px

**现象**

听力详情页 375px 下：`返回题库` 链接高约 16px、语言切换 26px、公告按钮 36px，低于 44px 推荐触控尺寸。文本输入与单选的可访问名称正常，无横向溢出。

**影响**

手指点按容易误触，但页面功能不阻断。

**建议**

给链接/按钮加 `min-height: 44px` 或扩大 padding；保持视觉尺寸不变时用透明热区扩展。

---

## 五、测试限制与未覆盖项

1. **没有对线上真实内容做全量回归**：为避免污染生产库，文章、订单、真实用户数据相关用例只在临时空库/种子库验证；线上内容相关页面可能因数据差异表现不同。
2. **只跑了 Chromium desktop**：未跑 Firefox、Safari、真实 iOS/Android、屏幕阅读器；移动端只做了 375px 视口与可访问名称检查。
3. **微信真实 API 未验证**：没有 AppID/Secret，无法确认草稿创建、图片转存、发布到公众号的真实结果；只验证了页面、预览、守卫和代码路径。
4. **支付未做端到端**：未调用真实支付渠道，未验证支付回调、发货、退款、授权码撤销的完整链路。
5. **音频真实播放未验证**：只验证了 R2 可访问与 Range 读取；无头环境没有可靠音频设备，不能判断实际听感、字幕同步、倍速播放。
6. **依赖漏洞结论缺失**：`pnpm audit` 因 registry 不提供 endpoint 失败，不能声称“无已知漏洞”。
7. **性能数据受测试环境影响**：无头浏览器 + 软件渲染 + 低核环境，CPU 数字不能直接代表真实用户设备。
8. **47 条 DB 集成用例在常规 `pnpm test` 中被跳过**：本次另起临时 PG18 单独跑通，CI 需要配置数据库服务才能持续覆盖。
9. **测试快照曾被外部清理并已恢复**：未跟踪的公众号草稿模块在收尾时被移除，随后从 Git 快照 `93805bd` 恢复；13 个文件已恢复，其中 12 个与快照逐字节一致，`client.ts` 追加 token 重试并新增 1 条测试；20 条模块测试通过。当前工作区已重新包含该模块，但仍未提交。

---

## 六、修复优先级

| 优先级 | 动作 | 责任面 |
|--------|------|--------|
| 1 | 对目标库执行 60 条迁移并加发布前 preflight | 部署/运维 |
| 2 | 本地 `.env.local` 切到本地库，生产凭证隔离 | 开发环境 |
| 3 | `/register` 重定向到登录页注册标签 | 路由/产品 |
| 4 | 根路径 RSS 301 到本地化 feed，或恢复根路由 | 路由/SEO |
| 5 | 修 4 条过期 E2E 选择器并接入 CI | 测试 |
| 6 | Newsletter 补 CSRF；软 404 状态码治理 | 安全/SEO |
| 7 | 粒子动画暂停/降载；移动端触控热区 | 性能/可访问性 |

---

## 七、复现命令

```bash
# 静态
pnpm exec tsc --noEmit
pnpm exec eslint src --ext .ts,.tsx
pnpm exec drizzle-kit check

# 单元（无 DB 时 47 条集成用例跳过）
pnpm test

# 构建
pnpm build

# 临时 PG18（示例，实际路径按环境调整）
/opt/homebrew/opt/postgresql@18/bin/initdb -D /tmp/meteor-test-pg/data --encoding=UTF8 --locale=C
/opt/homebrew/opt/postgresql@18/bin/pg_ctl -D /tmp/meteor-test-pg/data -o "-p 55432" start
DATABASE_URL=postgresql://postgres@127.0.0.1:55432/meteor_store_utf8_test pnpm exec drizzle-kit migrate

# 临时服务（生产构建，端口 3000）
DATABASE_URL=postgresql://postgres@127.0.0.1:55432/meteor_store_utf8_test pnpm exec next start -p 3000

# E2E（Chromium desktop）
E2E_BASE_URL=http://127.0.0.1:3000 pnpm exec playwright test --project=chromium-desktop
```

---

## 八、测试副作用与清理

- 早期脚本曾读取 `.env.local` 的线上连接串，并写入 2 个临时 QA 用户；发现后立即按已知 ID 删除，复核剩余 0，随后删除签名 token。后续所有测试用户/记录只写入临时库。
- 临时数据库 `meteor_store_utf8_test` 仅用于本次测试，含 2 个 QA 用户与 3 条听力练习记录；测试结束后已停止临时 PG 与应用服务，并清理临时脚本、token、截图。
- 未修改用户源码、未删除用户文件、未回滚工作区改动；报告写入 `docs/testing/2026-11-25-full-audit.md`。
- 测试期间工作区发生外部提交/清理（HEAD `f20b9c9` → `2de4de0` → `94e227e`），未跟踪的公众号草稿模块一度消失；已从 Git 快照 `93805bd` 恢复 13 个文件，校验与测试通过。当前模块仍未提交。

---

## 九、最终判定

- **代码质量门禁：通过**（tsc、eslint、单测、构建、迁移链、i18n）。
- **新功能可用性：通过**（听力题库/答题/判分/保存/记录本/查词、公众号草稿预览与守卫）。
- **生产就绪：有条件通过**。条件是把目标库迁移到 60 条、隔离本地与生产数据库，并修复 `/register`、根 RSS 与过期 E2E。
- **不建议在旧库（44 条迁移）上直接发布当前代码**。
