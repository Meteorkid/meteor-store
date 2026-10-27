# 一级导航生产只读验收

功能版本：`9bb7b9e3ae70244d6b48009a51d0bd4efe3c3919`；站点：https://www.imagentx.top。
时间：2026-10-27 19:50:36–19:52:44（北京时间）。Chrome 156.0.8078.48，独立 headless 浏览器及全新匿名 context。

- 导航 9/9 通过：1280/1024 桌面中英文、375/768 触屏模拟中英文、1024 英文粗指针。覆盖五组名称直达、跨组首次单击、箭头切换、键盘返回、Meta 新页及手机同页关闭后真实触摸滚动。
- 静止指针 5/5 通过，220 次逐帧采样；5 次均观察到旧 Header 卸载，真实移动、离开正文再回原坐标与显式箭头操作均正常。
- JS/CSS 468 次响应全部 200 且 MIME 正确（402 JS、66 CSS）；真实 API 36 次全部 200（auth/me 与 announcements 各 18 次）。18 次真实鉴权均为匿名 user:null、no-store，无伪造响应。
- pageerror、HTTP>=400、非导航 GET 失败均为 0。209 次非 GET 请求全部在浏览器出网前阻断（心跳与Sentry），没有放行业务写入。
- 两组分别记录 337 与 68 次 `net::ERR_ABORTED`，总计 405 次，逐条核对均为 `fetch` 且带 `_rsc` 参数的页面路由请求，API/JS/CSS 各 0。与脚本连续切页、原生页面预取和关闭上下文一致，归为预期导航取消，未混入生产 API/资源失败。
- 已人工查看稳定补图 `stable-desktop-en-1024.png` 与 `stable-mobile-zh-375.png`：桌面产品下拉正文、手机产品折叠区及页头布局正常，没有可见遮挡或横向溢出；两图均等待动画完成，箭头 transform 为完整 180°，运行中动画为 0。另查看 `stationary-final.png` 与 `mobile-final-zh-375.png`。
- 两次脚本均 exit 0；所有任务 context 和浏览器经 finally 关闭。没有扩大测试范围或修改仓库源码。

未覆盖真实登录账号、实体手机、Safari/Firefox、付款与管理员/业务写入；被主动阻断的心跳和 Sentry 投递不能据此验收。

证据：`results.json`、`stationary-results.json`、`summary.json`、两份运行日志及本目录截图。部署进程、数据库/Redis和版本验证由根任务另行留证。

补图独立记录：只新开两个匿名 context 截图，没有重跑测试；额外 42 次 JS/CSS 和 4 次 API 读取均 200、无错误，8 次非 GET 已拦截。额外 47 次取消同样全部为 `_rsc` fetch 的 `net::ERR_ABORTED`。补图浏览器已关闭。上述 9+5 主验收统计保持原值，补图数据见 `stable-screenshots-results.json` 与 `summary.json.screenshotOnlyRun`。
