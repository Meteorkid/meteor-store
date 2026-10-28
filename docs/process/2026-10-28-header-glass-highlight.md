# 一级导航玻璃高亮

状态：已于 2026-10-28 北京时间 21:33 上线。功能提交 `17b351ea08ba2cbf61e19ba5116d0e8bf58834c5`，生产浏览器验收完成。

## 改动

- 移除名称和箭头共用的灰色矩形底。当前栏目名称使用带细亮边、顶部反光和轻阴影的玻璃胶囊；悬停和菜单展开使用较弱高亮。
- 按下时立即强化反光，装饰层轻缩至 96%，文字保持原尺寸。箭头使用独立圆形反馈，已展开状态单独表示。
- 手机整行名称仍可点击，胶囊只包裹标题。当前栏目不会因聚焦或悬停而变暗。
- 减少动画时关闭伪元素变形与过渡；减少透明度时取消模糊并提供实底；增强对比度时加清晰边界。

实现只涉及 `src/components/Header.module.css`，无导航事件、数据源、依赖或数据库变化。材质放在名称/按钮叶子及伪元素上，没有给分组添加定位或滤镜，保留全宽下拉包含块。所有原生名称链接、独立箭头、键盘操作和触摸区域继续使用现有实现。

初次视觉对比发现：1024 英文粗指针布局中，一级名称稍增的 padding 使登录文字换行，即便 header.scrollWidth 没有超标。已在该媒体条件下恢复原 10px 总水平 padding，并将文字行数纳入浏览器核对。

## 参考与取舍

参考 Apple 的[材质指南](https://developer.apple.com/design/human-interface-guidelines/materials)和 [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)：圆润轮廓、边缘光线、触下反馈和功能层级。本次是 CSS 网页适配，没有引入原生光学折射渲染、持续动画或跨导航滑动所需的额外几何状态。

## 本地验证

基线 `6c1a522`，隔离副本只叠加本轮 CSS。29 项现有导航定向回归通过，完整生产构建和 TypeScript 通过；构建产物保留标准及 WebKit backdrop-filter、三项偏好媒体规则。浏览器验收使用本地候选 3187，旧导航样式对照 3186；两者 Header 源码与导航数据一致。

隔离环境没有连接真实数据库；匿名鉴权使用夹具，非 GET 和外源请求阻断。其内容读取失败不作为内容功能通过。上述为本地阶段，不代表生产上线、真实登录写入、实体手机或 Safari/Firefox 验收。

设计约定：[导航玻璃高亮方案](../superpowers/specs/2026-10-28-navigation-glass-highlight-design.md)。


最终浏览器 12/12 通过：9 组中英文桌面/触屏模拟导航，3 组减少动画、减少透明度及增强对比度（各含桌面与手机）。下拉仍为全宽并对齐 Header 底部；可见顶栏文字无换行回归，名称直达、箭头展开、焦点恢复、修饰键和手机关闭/滚动均正常。减少动画时实测伪元素 transform:none、transition:0s，普通按下只变形装饰层，文字仍为 transform:none。

没有 pageerror；HTTP 错误仅为隔离无数据库环境的 `/api/announcements` 500。本轮没有统计所有静态资源响应数，不据此宣称整站功能通过。初次测试工具误将 display:none 的桌面节点纳入手机尺寸断言，已修正仅检查可见节点，手机四组重跑通过；该失败没有引起源码更改。

[浏览器结果](header-glass-highlight-20261028/results.json)、[摘要](header-glass-highlight-20261028/summary.json)、[构建 CSS 检查](header-glass-highlight-20261028/css-build-check.json)、[稳定桌面截图](header-glass-highlight-20261028/selected-header-zh-1280.png)、[稳定手机截图](header-glass-highlight-20261028/mobile-selected-zh-375.png)。源码与证据使用 SHA-256 核对。

用户已批准“部署上线”。旧样式对照 3186 和候选 3187 已关闭，效果现可直接在生产站查看。


## 正式发布

- 干净副本构建本次已提交源码，使用生产公开配置及 SSH 只读数据库连接，完整 TypeScript 和 415 页静态生成通过；未使用无数据库的本地验收产物。包内排除 cache/dev，SHA-256 核对后固定服务器源码到 `17b351e`，沿用双锁、产品空闲检查和既有激活流程。
- 发布前完整备份：`/var/backups/meteor-store-glass-20261028-b6xm5DJ5`。数据库备份 `database/meteor-store-20261028-213056.dump` 已上传既有私有 R2 并回读校验。运行回滚目录：`/var/backups/meteor-store-runtime-nFP7dTGy`。
- PM2 的实际 Next PID `1591474` 自己持有 `127.0.0.1:3000`，应用、PostgreSQL、Redis 健康。生产环境、cron、Nginx/logrotate 配置及产品 catalog/job 内容均未变；无数据库迁移。
- 已核对服务器和公开返回的 `25_cr4f57lo2w.css` 均匹配构建 SHA-256 `9c4bb8b43aecedd2b041364e4a7f2e734c1a37e77ad545dabd572b7bf52fa000`。没有只凭重复的 BUILD_ID 判断新版本。
- 36 次封面预热全部成功；功能提交已同步 GitHub/Gitee/GitLab。构建临时连接信息已删除，SSH 数据库隧道已关闭。

## 线上验收

生产独立 Chrome、真实匿名鉴权，12/12 通过：9 组导航 + 3 组媒体偏好。按下仅缩放装饰层，文字不缩放；1024 英文登录入口保持单行，全宽下拉定位、名称直达、箭头和键盘/手机操作均正常。两张稳定截图已实际查看。

413 次 JS/CSS 响应（353 JS、60 CSS）状态和 MIME 全部有效，32 次 API 读取正常；HTTP 错误、pageerror 和其他 GET 失败为 0。185 次非 GET 由测试阻断，449 次 fetch/ERR_ABORTED 作为路由切换取消单独记录；未测试真实账号写入、实体手机、Safari/Firefox 或遥测投递。

[操作摘要](header-glass-highlight-20261028/release/operations.json) · [正式构建](header-glass-highlight-20261028/release/build-verification.json) · [线上统计](header-glass-highlight-20261028/release/summary.json) · [浏览器原始结果](header-glass-highlight-20261028/release/results.json) · [桌面效果](header-glass-highlight-20261028/release/selected-zh-1280.png) · [手机效果](header-glass-highlight-20261028/release/mobile-selected-zh-375.png)。归档遥测 URL 中的 key 已脱敏。

如需回滚，使用本次唯一备份并按[运行回滚流程](2026-10-23-runtime-operations-fix.md)执行；保留发布后新增业务数据，不用旧数据库覆盖。本文及验收附件的补交不改变运行功能版本 `17b351e`。
