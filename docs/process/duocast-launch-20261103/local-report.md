# DuoCast 本地浏览器验收

日期：2026-11-03。候选：http://127.0.0.1:3188。独立 Chrome 匿名上下文，未导入个人会话；仅 GET，屏蔽 WebSocket、Service Worker、外部来源。没有点击免费入库、登录、订单或其他写入动作。

## 验证边界

- `/api/auth/me` 使用 `{user:null}` 本地夹具；下载 API 使用既有审计 ZIP 夹具。这不是生产身份/R2分发证据。
- 其余同源 GET 实际访问本地候选；`/api/announcements` 的 500 单列为缺少本地数据库边界。
- 375px 是 Chrome 手机触控模拟，不是真实手机/音频硬件实验。
- 没有运行 DuoCast 应用或验证蓝牙耳机组合。

## 结果

- `local-01/results.json`：首页既有 5 款主线顺序不变且无 DuoCast；中英搜索同时返回产品/帮助；sitemap 含中英产品/帮助 4 条路径；减少动画时无 video，1280px poster 已加载。
- 首轮桌面/手机选择器假定带语言前缀而未命中，记录保留；实际卡片既有 href 为 `/products/duocast`。
- `local-02/results.json`：中文 1280px 完整通过。13 张产品卡，实验室发现并进入 DuoCast；标题、macOS 14.2+/Apple Silicon、0.1.0、SHA前缀、ad-hoc/未公证、蓝牙限制可见；帮助与 GitHub href 正确。
- 列表及详情视频 currentTime 推进，两张间隔帧像素不同；1280×800、5.4 秒、静音、非循环。目视可见 A 音量 78→70，C 仍等待设备。
- 中英均完成实际浏览器 download 事件（本地 ZIP 夹具），下载文件均为 339310 B、SHA-256 `15e932bf5cbe9e29e46c998d58e5d481918a7db1ed1489922d79f56fd4b2edd1`。
- 中英帮助均读到完整 SHA，手机帮助页无横向溢出；目视截图排版正常。
- 英文 375px 交互完成并停在 `/en/docs/duocast-first-play`，但健康门控失败：`Transition was aborted because of invalid state. Viewport size changed`。该异常来自既有全局 View Transitions；尚未建立旧产品基线复现，不把它定性为已知基线问题。保留为待主任务决定的例外。

## 证据

- `local-01/`：减少动画截图、首页/搜索/sitemap JSON、首轮失败截图。
- `local-02/`：中文/英文列表、详情、下载、帮助截图，4组间隔视频帧、2个下载 ZIP、原始结果 JSON。
- `check.cjs`：验收脚本；不传 local/production 参数时只显示待命提示，不访问网络。

生产阶段尚未执行，不能由本地夹具结果推断生产下载或生产匿名身份。

## 修复后手机复验（local-03）

候选重启后仅复验英文 375px。列表→详情、视频推进、ZIP download 事件/339310 B/完整 SHA、帮助完整校验值、375px无横向溢出仍通过，`functionalResult` 已完整保存。严格健康门控仍失败：同一 `Viewport size changed` 页面异常再次出现，pageerror=1。没有放宽门控、没有自行重试，也未将修复或本地验收标记为完成。

## 单次诊断复现（diagnostic-mobile-01）

按主任务要求加纯观察后仅复现一次；未 preventDefault、未吞异常。`unhandledrejection` 原因是原生 `DOMException` / `InvalidStateError`（`instanceof DOMException=true`，无 stack）。时点在点击列表卡片后的新文档初始化：列表 performance.now≈3142ms，详情错误时≈123ms，说明发生了跨文档导航。源码另有 `globals.css:741 @view-transition { navigation: auto; }`，与 TransitionLink 的同文档 ready 不是同一通道，具体修复由主任务另行定位。

同次记录还有两条 `https://127.0.0.1:3188/en/products/duocast` 的 `ERR_SSL_PROTOCOL_ERROR`；本地候选使用 HTTP，脚本此前把非 base origin 的 GET 失败统一记录为 `local-external-blocked-get`。这些原始错误仍在 JSON 中，不能把该分类理解为每一条均已确认是拦截器主动拦截。生产不适用本地例外，也不跳过 TLS。

错误发生时 layout/visual viewport 都为375×900；帮助加载后曾短暂出现 innerWidth409/clientWidth375，最终横向溢出断言回到375/375。保持严格 pageerror=1 的失败结果，无进一步盲重试。

## HTTPS 本地对照（diagnostic-https-mobile-01）

主任务提供 `https://127.0.0.1:3189` 代理到同一3188候选后，单次英文手机复验通过：pageerror=0、unhandledrejection=0、failed-get=0、healthIssues=0。列表点击 performance.now≈3272ms → 详情≈3461ms，未重置文档；不再出现HTTPS loopback SSL失败。视频、339310 B/完整SHA下载、帮助完整校验值及最终375px无横向溢出全部通过。该对照支持此前异常由本地HTTP+CSP升级/硬导航链路触发，无需将其泛化为生产动画缺陷。

仅本次本地任务自签证书由主任务明确授权 `ignoreHTTPSErrors=true`；脚本用 `--local-selfsigned` 显式标记，且拒绝对非loopback、非HTTPS或production模式启用。生产验收继续普通TLS、无API/auth夹具，仍待部署后通知。
