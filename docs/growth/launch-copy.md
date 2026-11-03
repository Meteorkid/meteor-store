# Launch 文案包(可直接发布)

> ⚠️ **2026-11-03 起请改用 `launch-pack.md`。** 本文件的价格表述已过时
> （产品改成限时免费、领取即发永久激活码），仅保留作历史参考。

> 配套:`2026-11-03-卖软件方案.md`
> 所有功能描述均取自 `src/data/products.ts` 与 `promo/README.md`,未添加产品不具备的能力。
> 发布前请自己再核对一遍:文案里承诺的每个功能,用户装上后必须能在 30 秒内看到。

---

## 一、Show HN

**标题**(HN 标题不要带感叹号、不要营销词):

```
Show HN: XIsland – a macOS Dynamic Island for AI coding agents
```

**正文**(第一人称、讲构造不讲卖点):

```
I run several coding agents at once (Claude Code, Cursor, plus a couple of
long-running jobs). The problem wasn't starting them — it was not knowing
what any of them were doing without switching windows all day.

XIsland puts them in a Dynamic Island-style pill at the top of the screen.
Collapsed, it shows which agents are working, waiting for input, or done.
Expanded, it shows per-agent status and lets me answer an agent's question
from the island without going back to the terminal.

Some details that took longer than expected:

- The pill has to sit above full-screen apps and Spaces without stealing
  focus. That meant a borderless non-activating NSPanel, not a normal window.
- Agent status is inferred from process activity and output patterns, not a
  hook in each tool, so it works with agents I didn't write.
- It's native Swift, ~40MB RSS with four agents attached.

Free during the launch period — lifetime license, up to 3 Macs. macOS only. No account needed to try it.

https://imagentx.top/products/xisland

Happy to answer anything about the panel/focus behaviour or the status
detection heuristics.
```

**发布注意**:
- 时间:HN 流量高峰是美国东部周二至周四 8:00-10:00,即**北京时间周二至周四 20:00-22:00**
- 发出后 2 小时内必须盯评论并回复;前 2 小时的 upvote 速度决定能否上首页
- 不要请人刷票,HN 会检测并 bury

---

## 二、Product Hunt

**Tagline**(60 字符内):

```
A Dynamic Island that keeps every AI coding agent in view
```

**Description**:

```
XIsland turns the top of your Mac into a control tower for AI coding agents.

Run Claude Code, Cursor, or any long-running agent and the pill shows its
state at a glance — working, waiting on you, or finished. Expand it to see
every agent at once, or answer a question directly from the island without
jumping back to the terminal.

Built native in Swift. Sits above full-screen apps and Spaces without
stealing focus. ~40MB with four agents attached.

Free during the launch period, lifetime license, no account required. 14-day trial either way.
```

**First comment**(发布者自己发的第一条,PH 上很重要):

```
Maker here. I built this because I kept losing track of which agent was
stuck waiting for my input — the information was there, just buried in a
terminal I wasn't looking at.

Two things I'd especially like feedback on:

1. Status detection is heuristic (process activity + output patterns) rather
   than per-tool hooks, so it works with agents I don't control. It gets the
   common cases right but I'm sure there are edge cases — if it mislabels
   what your agent is doing, tell me what you were running.
2. The panel is non-activating, which means clicking it doesn't steal focus
   from your editor. Some people love this, some find it surprising. Curious
   which side you land on.
```

---

## 三、Reddit

### r/ClaudeAI

**标题**:

```
I got tired of alt-tabbing to check if Claude Code was waiting on me, so I built a Dynamic Island for it
```

**正文**:

```
I usually have 2-4 Claude Code sessions going plus a Cursor window. The
annoying part isn't starting them, it's that I can't tell from another
window whether one is working or sitting there waiting for my answer.

So I built XIsland. It's a pill at the top of the screen: collapsed it shows
per-agent state, expanded it shows all of them and lets me answer questions
inline.

Status comes from process activity and output patterns rather than a hook
inside Claude Code, so it also picks up other agents.

It's macOS only, native Swift. Free during the launch period — lifetime license, 14-day trial without an account.

https://imagentx.top/products/xisland

Mostly posting because I want to know whether other people run into the same
"which one is waiting on me" problem, or whether everyone just uses tabs and
I'm solving a non-problem.
```

> ⚠️ 先在 r/ClaudeAI 用普通身份活跃几天再发,新账号直接带链接发产品会被当 spam 删。发之前读该 sub 的 self-promotion 规则。

### r/macapps

**标题**:

```
XIsland – a Dynamic Island that shows what your AI coding agents are doing
```

**正文**:用 Product Hunt 的 Description,去掉价格段更安全,结尾附 GitHub 链接。

---

## 四、小红书

> 中文线不要用上面那套英文文案。这里主推**申博/硕士申请工具**,不是 XIsland。

### 模板 A:时间线型(最容易起量)

**标题**:
```
港科大 PhD 申请倒计时:2028 fall 该做什么,我做了一张表
```

**正文**:
```
去年我一直在查"申博到底什么时候该干什么",查到的全是零散帖子。

后来干脆自己做了一张全年日历,把 HKPFS 截止、各院系网申开放、语言成绩
有效期倒推、套磁窗口全排进一条时间线上。

几个容易踩的坑:
· HKPFS 是 12 月 1 日硬截止,不是"大概年底"
· 雅思成绩 2 年有效,考太早等于白考
· 港科大广州和清水湾是两套独立系统,截止差半年

我把它做成了网页版,可以按你的入学年份倒推:
imagentx.top/phd

不用注册。有漏掉的时间点告诉我,我补上。
```

**发布要点**:
- 首图用日历截图,**不要用设计感海报**——工具类内容,截图比海报点击率高
- 评论区第一条自己补充一个细节(比如"补充:推荐信要提前 2 个月找老师"),把互动拉起来

### 模板 B:单点干货型

**标题**:
```
申请港科大 PhD,这 3 个截止日期记错一个就白忙一年
```

**正文**:只讲 3 个日期,每条 2-3 行,结尾一句指向工具。

### 模板 C:反常识型(互动最高)

**标题**:
```
本科学历申港科大 PhD,没有论文到底行不行
```

**正文**:给真实结论(港科大官方不要求论文、CCF 是中国大陆口径),结尾指向工具或博客文章。

> 这类内容的可信度来自"你是当事人"。不要写成营销号口吻,写成"我查完告诉你"。

---

## 五、即刻

短,一段话,带图:

```
把自己申博要查的时间点做成了个日历:HKPFS 12/1 硬截止、语言成绩有效期
倒推、两校区截止差半年。

本来是自己用,顺手放线上了,不用注册。
imagentx.top/phd
```

---

## 六、发布节奏(不要同一天全发)

| 时间 | 动作 |
|---|---|
| 第 1 周周四 | Show HN(北京 20:00-22:00) |
| 第 1 周周五 | Product Hunt |
| 第 2 周 | r/macapps + r/ClaudeAI(间隔 3 天) |
| 第 2-3 周 | 小红书模板 A |
| 第 3 周起 | 每周 1 条小红书,固定栏目 |

同一天全平台齐发会看起来像刷屏,而且你没有精力同时回评论——**评论回复质量比发布数量重要**。

---

## 七、发布前检查清单

- [ ] 试用流程真的能走通(没账号也能下载、安装、14 天可用)
- [ ] 落地页首屏 3 秒内说清"这是什么、给谁用"
- [ ] 下载按钮不需要登录
- [ ] 价格在首屏可见,不需要翻到定价页
- [ ] 英文页没有中文残留
- [ ] 演示视频无声也能看懂(大多数人是静音刷)
- [ ] Cloudflare/Umami 统计已生效,能看到 UV
- [ ] 有办法收到反馈(邮箱或 GitHub Issues,不要只留一个表单)
