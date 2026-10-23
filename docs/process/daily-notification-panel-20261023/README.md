# 每日公告面板：真实浏览器验收

环境：本地独立 Next 生产构建 `http://127.0.0.1:3183`，独立 PostgreSQL，A/B 测试账号与预先种入的隔离日刊内容。浏览器使用本机 Chrome 的独立 headless contexts。本报告不代表生产迁移或部署已经完成。

执行脚本：`check-real.mjs`。结果：`real-browser-results.json`，`complete: true`，11组通过，`browserErrors: []`。

- 中英文分别检查 375、768、1280px 宽度；面板边界在视口内，scrollWidth 与 clientWidth 一致。
- 铃铛关闭时不请求预览，打开后每页1次；验证原生 details 展开、375px 触屏点击、正文点击、内部滚动、Tab/Enter、Escape 焦点恢复和外点关闭。
- A账号通过真实UI依次保存1/3/5个词及栏目顺序，第二浏览器context重开后读取相同设置。
- 第二context实际保存新revision，第一context旧草稿得到真实409；提示保留草稿，显式重读显示服务端新设置。
- 明确空选跨context保持为空；恢复默认保存null并继承英语/论文关注。
- A的面板写入不改变B设置，不改变A原有关注/提醒。
- 游客设置保存在浏览器本机；同一context登录A后显示A设置，退出后恢复游客设置，没有游客PUT账号接口。

截图：`zh/en-{375,768,1280}-content.png`、对应`settings.png`，以及`account-A-five-ordered.png`、`real-409-conflict.png`。已人工检查375中文内容、375英文设置及真实409截图。

测试结束已恢复A原始`settings: null`，原关注仍为`english,papers`；版本时间因真实保存正常前进。B未修改。所有浏览器contexts已关闭。

首轮脚本曾误用隔离基线不存在的`/help`入口，未找到铃铛；改为实际`/daily`入口后完成全部验收。`help-diagnostic.png`仅保留该脚本诊断，不是本次面板验收截图。
