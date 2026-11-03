# DuoCast 生产浏览器验收

目标：https://www.imagentx.top 。独立匿名 Chrome，正常 TLS（TLS 1.3，证书签发者 YE1），未导入个人会话；auth/API/下载均无夹具。只放行 GET，拦截 WebSocket、Service Worker 与非 GET；没有点击免费入库、登录、订单或其他写入动作。

## 验收结果

| 场景 | 结果 | 证据 |
|---|---|---|
| 中文桌面1280 | 功能通过，列表视频慢首载约12.8秒 | `production-desktop-diagnostic-01/results.json` |
| 英文手机375 | 通过 | `production-01/results.json` |
| 减少动画375 | 静态poster加载，无video | `production-01/results.json` |
| 首页、搜索、sitemap | 通过 | `production-01/results.json` |

产品列表13张，DuoCast可在实验室发现并进入详情；标题、macOS14.2+/Apple Silicon、v0.1.0、SHA前缀、ad-hoc/未经Apple公证与蓝牙限制可见。GitHub与本地化帮助链接有效。中英帮助显示完整校验值。首页原有5款主线顺序未变；中英搜索返回DuoCast产品与帮助，sitemap包含对应4条路径。

中英均触发真实浏览器download事件，下载API返回302与no-store，跳转到R2预签名地址，下载文件均为 **339310 B**，SHA-256：

`15e932bf5cbe9e29e46c998d58e5d481918a7db1ed1489922d79f56fd4b2edd1`

视频解码参数1280×800、5.4秒、静音、非循环。列表和详情均观察到currentTime推进及不同画面；减少动画时只保留静态poster。中文首屏/下载、英文下载/帮助/减少动画截图已目视检查，未见排版或入口异常。375px帮助页最终无横向溢出。

## 保留的首轮失败与诊断

首轮 `production-01` 为3通过/1失败：桌面列表视频在默认5秒内仍readyState=0，原始JSON和截图完整保留，没有把这次结果改绿。

经主任务授权，仅桌面做一次上限30秒的诊断，并保留5秒检查点：

- 5.147秒：readyState=0、networkState=2（加载中）、media error=null，静态poster正常显示。
- 媒体响应：206，`video/mp4`，`Content-Range: bytes 0-65374/65375`；1.164秒收到响应头，12.790秒请求完成。
- 12.838秒：readyState=4并开始播放；随后currentTime从0.0343推进到1.2402，两张间隔帧不同。
- 详情页同一媒体再次请求在273毫秒完成，中文下载及帮助流程完整通过。

因此将明确限时的真实播放与其余功能记为通过，同时保留**列表视频慢首载约12.8秒**的限制；不声称5秒内加载或高性能。

## 健康与边界

两轮生产记录中pageerror、HTTP错误与failed-get均为0，生产fixtures=0；所有签名/凭据/Sentry查询字段均脱敏，扫描通过。非GET拦截包括既有Sentry遥测与online heartbeat；这些拦截造成的console提示与页面异常分开记录。

375px仅为Chrome触控模拟。没有运行DuoCast应用、验证蓝牙设备组合、Apple公证或音频质量。没有修改源码、提交或部署。

机器可读汇总：`production-accepted-summary.json`。各目录保留截图、视频间隔帧、下载ZIP和原始JSON；首轮失败不覆盖。
