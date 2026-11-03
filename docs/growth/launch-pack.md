# 宣发执行包（2026-11-03）

> 取代 `launch-copy.md` 里的价格表述。配套 `github-checklist.md`（仓库侧）。
>
> 原文案有三处写着「14 天试用后 $12」，产品现在是**限时免费、领取即发永久激活码**，
> 照旧文案发出去会当场被评论区拆穿。

## 〇、发帖前必须对齐的六条事实

| # | 事实 | 依据 |
|---|---|---|
| 1 | 当前**限时免费**，领取永久激活码，最多 3 台设备，**无需付款** | `products.ts` pricing.price = 0 |
| 2 | 原价 ¥12（XNook ¥9），页面上是划线价 | `originalPrice` |
| 3 | 即使不领码，安装后也有 **14 天完整试用** | MSL1 试用机制 |
| 4 | 仅 macOS，原生 Swift，**不需要账号即可下载试用** | 下载接口 `gated:false` |
| 5 | **adhoc 签名**，首次打开需 `xattr -cr` 或右键「打开」 | 未买 Apple Developer |
| 6 | 官网 `imagentx.top`，GitHub `github.com/Meteorkid/XIsland` | — |

> 第 5 条最容易被骂。**主动写出来**远好过让用户自己撞上：
> 写出来是「开发者很坦诚」，不写就是「这软件是坏的」。

## 一、V2EX（今天就能发，优先级最高）

不需要 GitHub、不需要英文、不需要 karma，注册即可发；macOS 用户密度高，
是「免费 + 国人作品」最友好的社区。**这是唯一今天就能拿到真实用户的地方。**

**节点**：`/go/share`（分享创造）。不要发 `/go/promotions`，那里没人看。

**标题**：

```
做了个 macOS 灵动岛，把 Claude Code / Cursor 这些 AI 代理都收进一个岛里
```

**正文**：

```
平时同时开好几个 AI 编码代理：Claude Code 两三个会话、Cursor 一个窗口，
偶尔还有跑很久的任务。最烦的不是启动它们，是切回来才发现某个已经卡在
"要不要继续"的提问上，等了十分钟。

所以写了个工具，把这些代理收进屏幕顶部一个灵动岛里。

收起状态：显示有几个在跑、有没有在等你的
展开状态：每个代理一行，谁在跑、谁卡住、谁在等你，一眼看完
有代理提问的时候：直接在岛上按 ⌘1 / ⌘2 选，不用切回终端

状态是从进程活动和输出特征推断的，不是给每个工具写 hook，
所以我自己没适配过的代理也能识别。目前内置了 31 个代理的图标和识别。

技术上是原生 Swift，四个代理挂着大概 40MB 内存。面板是非激活窗口，
点它不会把你编辑器的焦点抢走。

现在限时免费，领一个永久激活码就行，最多 3 台设备，不用付款。
不领码也能先试用 14 天。

https://imagentx.top/products/xisland

两点先说明，免得你踩坑：
· 目前是 adhoc 签名，没买苹果开发者证书。第一次打开如果提示"已损坏"，
  在终端跑一下 xattr -cr /Applications/XIsland.app 就行
· 只支持 macOS 13 以上

想听听大家平时的用法——你们是开多个会话，还是一个会话干到底？
```

**发布要点**：

- 结尾那个问题**必须留**。纯推广帖会被踩，带真实问题的帖子会被当讨论。
- 发出后 **2 小时内**回每一条评论，V2EX 排序看回复活跃度。
- 有人骂「又是广告」不必辩解，回「是广告，自己做的，觉得有用就用」。
- 不要自己顶帖。

## 二、Show HN

**时间**：北京时间**周二至周四 20:00–22:00**（美东 8:00–10:00）。
发出后 2 小时守着回评论，前两小时的投票速度决定能不能上首页。

**标题**：

```
Show HN: XIsland – a macOS Dynamic Island for AI coding agents
```

**正文**：

```
I run several coding agents at once (Claude Code, Cursor, plus a couple of
long-running jobs). The problem wasn't starting them — it was not knowing
which one was sitting there waiting for an answer while I was in another window.

XIsland puts them in a Dynamic Island-style pill at the top of the screen.
Collapsed, it shows how many are working and whether any is waiting on me.
Expanded, it lists every agent with its state, and when one asks a question
I can pick an option with ⌘1 / ⌘2 right there instead of going back to the
terminal that spawned it.

Two things that took longer than I expected:

- Agent state is inferred from process activity and output patterns, not from
  a hook in each tool. That means it also covers agents I never integrated
  with, but it's heuristic — it can mislabel an agent that's thinking hard
  as idle.

- The panel is a non-activating NSPanel, so clicking it doesn't steal focus
  from your editor. It has to float above full-screen apps and Spaces without
  ever taking key focus, which rules out a normal window.

Native Swift, ~40MB RSS with four agents attached.

It's macOS only. The build is ad-hoc signed for now (no Apple Developer
account yet), so first launch needs `xattr -cr /Applications/XIsland.app`.

Free while the launch period lasts: you claim a lifetime license, up to three
machines. No account needed to try it for 14 days.

https://imagentx.top/en/products/xisland

Happy to answer anything about the panel/focus behaviour or the state
detection heuristics.
```

**注意**：

- 6 小时后还没到 10 分，说明标题或首段没抓住，**不要重发**，等两周换角度。
- 被质疑 "why not just use tmux" 是常态，正常回，别防御。

## 三、Reddit

> 新号直接带链接发产品会被当广告删。发之前先用这个号在 sub 里正常回几天帖。

### r/macapps（最精准）

**标题**：

```
XIsland – a Dynamic Island that shows what your AI coding agents are doing
```

**正文**：

```
Built this for myself and figured other people running several coding agents
might want it.

It's a pill at the top of the screen, Dynamic Island style. Collapsed it shows
how many agents are running and whether any is waiting on input. Expanded it
lists each one with its state, and when an agent asks a question you can
answer it with ⌘1/⌘2 without switching back to the terminal.

Native Swift, ~40MB with four agents attached. The panel is non-activating,
so clicking it doesn't pull focus away from your editor.

macOS 13+. Ad-hoc signed for now — first launch needs
`xattr -cr /Applications/XIsland.app`.

Free during the launch period, lifetime license, up to 3 Macs:
https://imagentx.top/en/products/xisland

Curious whether this is a real problem for other people or I'm just bad at
window management.
```

### r/ClaudeAI

标题换成痛点视角：

```
I got tired of alt-tabbing to check if Claude Code was waiting on me, so I built a Dynamic Island for it
```

正文用 r/macapps 那版，最后一句改成「有没有人也遇到『不知道哪个会话在等我』这个问题」。

## 四、Product Hunt

**Tagline**（≤60 字符）：

```
A Dynamic Island that keeps every AI coding agent in view
```

**Description**：

```
XIsland turns the top of your Mac into a control tower for AI coding agents.

Run Claude Code, Cursor, or any long-running agent and the pill shows its
state at a glance — working, waiting on you, or finished. Expand it to see
every agent at once, or answer an agent's question with ⌘1/⌘2 without
jumping back to the terminal.

Built native in Swift. Sits above full-screen apps and Spaces without stealing
focus. ~40MB with four agents attached. 31 agents recognised out of the box.

Ad-hoc signed for now, so first launch needs a one-line xattr command.

Free during the launch period — lifetime license, up to 3 Macs.
```

**First comment**（发布者自己发的第一条，PH 上权重很高）：

```
Maker here.

I built this because I kept losing track of which agent was stuck waiting for
my input — the information existed, just buried in a terminal I wasn't looking at.

Two things I'd especially like feedback on:

1. State detection is heuristic (process activity + output patterns) rather
   than per-tool hooks, so it works with agents I don't control. It gets the
   common cases right but there are edge cases — if it mislabels what your
   agent is doing, tell me what you were running.

2. The panel is non-activating, so clicking it doesn't steal focus from your
   editor. Some people love this, some find it surprising. Curious which side
   you land on.
```

## 五、中文线：不要推 XIsland

小红书 / 即刻推**申博日历**。XIsland 的受众在 GitHub，不在小红书；
而你是申博当事人，做申请工具的内容可信度天然高于任何搬运号。

### 即刻（短，带视频）

```
把自己申博要查的时间点做成了日历：HKPFS 12/1 硬截止、语言成绩有效期倒推、
港科大清水湾和广州是两套系统、截止差半年。

本来是自己用，顺手放线上了，不用注册。
imagentx.top/phd
```

### 小红书（模板）

标题：`港科大 PhD 申请倒计时：2028 fall 该做什么，我做了一张表`

正文只写三个容易踩的坑（HKPFS 12/1 是硬截止 / 雅思 2 年有效别考太早 /
两校区两套系统差半年），结尾一句指向 `imagentx.top/phd`。

> 首图用日历截图，不要用设计海报——工具类内容截图点击率更高。

## 六、7 天节奏（加快版）

| 天 | 动作 | 谁做 | 耗时 |
|---|---|---|---|
| **D0 今晚** | V2EX 发帖 + 守着回评论 | 你 | 40 min |
| D1 | GitHub README 首屏 + topics + description | 你（照 `github-checklist.md` 抄） | 30 min |
| D2 | 按 V2EX 评论改文案，r/macapps 发帖 | 你 | 30 min |
| D3 | r/ClaudeAI 发帖（与 r/macapps 隔一天） | 你 | 20 min |
| D4 | Show HN（周二或周三 20:00–22:00） | 你 | 2h 守评论 |
| D5 | 看报表，判断哪个渠道有真实下载 | 我 | 5 min |
| D6 | 把有效渠道的文案定版，其余渠道复用 | 我 | 20 min |

**不要同一天全平台齐发**：看起来像刷屏，而且你没有精力同时回四处评论。
评论回复质量比发布数量重要一个数量级。

## 七、发出去之后怎么看效果

```bash
ssh root@8.138.218.165 '/usr/local/bin/traffic-report.sh 1'
```

看三个数：

- **`站内真实页面` 的 PV/UV** → 有没有人真的来了
- **`/api/download/<product>`** → 有没有人真的下了（唯一有意义的转化）
- **`外部来源 referer`** → 是哪条帖子带来的

> `/` 的计数天然偏高（扫描器单次探测首页）。判断活动效果看
> **`/products/xisland` 的访问量 + `/api/download` 调用量**，不要看首页 PV。

## 八、被问到时怎么答（提前准备好）

| 质疑 | 回答 |
|---|---|
| 「为什么免费？是不是有坑」 | 直说：限时免费是为攒用户和口碑，以后会出付费版，但领到的永久码不会失效 |
| 「装不上，提示已损坏」 | adhoc 签名导致的，`xattr -cr /Applications/XIsland.app` 即可；正在买开发者证书 |
| 「和 NotchNook 有什么区别」 | 那类工具管媒体/日历/文件托盘，XIsland 管的是 **AI 代理的运行状态和问答**，不重叠 |
| 「为什么不用 tmux / 终端标签」 | tmux 能看输出，但不会在别的窗口提醒你「这个代理卡在提问上了」 |
| 「状态识别准吗」 | 诚实说：启发式，常见场景准，极端情况会误判，欢迎报 case |
| 「会不会上传我的代码」 | 说明数据流向：状态来自本地进程活动和输出，不上传 |

## 九、发布前 60 秒自检

- [ ] 帖子里的链接点开是 **200**，首屏 3 秒内能说清「这是什么」
- [ ] 下载按钮**不需要登录**
- [ ] 价格在首屏可见（现在显示「限时免费 + 划线价」）
- [ ] 英文页没有中文残留
- [ ] 帖子里写了 `xattr -cr` 这一行
- [ ] 演示 GIF 无声也能看懂（大多数人静音刷）
- [ ] 有地方收反馈（GitHub Issues 或邮箱，不要只留一个表单）

## 十、可用的素材

| 素材 | 路径 | 用途 |
|---|---|---|
| 英文版成片（24s / 1080p / 16MB） | `promo/xisland-landscape-en-1920x1080.mp4` | HN/Reddit 帖子正文里贴视频源 |
| README 用 GIF（9s / 880px / 7.2MB） | `docs/growth/assets/xisland-readme-demo.gif` | 粘进 GitHub README 首屏 |
| 中文版成片（24s） | `promo/xisland-landscape-1920x1080.mp4` | V2EX、小红书、即刻 |
| 中文长片（64s） | `promo/xisland-film-1920x1080.mp4` | 官网首屏、B 站 |

**GIF 怎么放进 README**：GitHub 网页编辑器里直接把文件拖进正文，它会自动上传并生成
`![](https://user-images.githubusercontent.com/...)` 链接。不要用相对路径引用——
XIsland 仓库里没有这个文件。

> 英文场景源文件：`promo/xisland/scene-en.html`（由 `scene.html` 换文案而来），
> 重新出片：`node promo/xisland/render.cjs --scene scene-en.html --all`。
> 注意 `promo/` 在 `.gitignore` 里（700M 素材），成片和 GIF 单独拷贝出去分发。




