# awesome 列表收录（2026-11-05 调研）

## 一、先给结论

| 仓库 | 结论 | 原因 |
|---|---|---|
| `jaywcjlove/awesome-mac`（117k star） | **值得投，本周就能提** | 接受 PR，只要求条目格式和字母序；我们满足全部条件 |
| `hesreallyhim/awesome-claude-code`（57k star） | **暂时别投** | 官方 CONTRIBUTING 明写「产品需要注册或付费，是 review 的 blocker」，我们领码必须注册 |

## 二、awesome-mac：一个必须先知道的事实

我拉下 README 全文核过，**「刘海 + AI 编程代理」这个位置已经很挤了**，光 `Menu Bar Tools` 和 `AI Tools` 两节就有：

| 已有条目 | 它写的卖点 |
|---|---|
| Agent Island | 刘海显示 Claude Code / Codex 会话状态，自动续跑长任务 |
| CodexIsland | 刘海显示 rate limit 和花费 |
| **Perch** | 键盘优先的刘海应用，**「answer from the notch」**，支持 Claude Code / Codex / OpenCode |
| **Topnotchers** | 刘海作为会话入口，**「questions and permission prompts answered from the notch」** |
| HeyMate | 刘海里跑 agent，**「after you approve their plan」** |
| Notchly | 轻量灵动岛 + AI 编程代理通知 |
| cctop | 菜单栏监视会话状态，跳回终端面板 |

**结论：不能把「在刘海上审批」当唯一卖点写进条目。** Perch 和 Topnotchers 已经这么写了，维护者会直接以「重复」关掉 PR。

我们真正剩下的差异只有两条，都必须在**一句话**里说清：

1. **覆盖广度**：30+ 个客户端，含 Kimi / 通义千问 / DeepSeek / GLM / CodeBuddy / Trae 国内版——上表里没有任何一个覆盖中文工具
2. **能力分层公开**：每个客户端明确标「能审批 / 只能观察」，而不是笼统写「supports」

## 三、条目（英文，放进 `Menu Bar Tools`）

位置：`Agent Island` 开头那段是按字母序排的（Agent Island → AI Footprint → … → Perch → SaneBar → Sharptooth），
**插在 `Sharptooth` 之后、`BeardedSpice` 之前**（X 在 S 之后）。

```markdown
* [XIsland](https://www.imagentx.top/en/products/xisland) - Menu bar panel for 30+ AI coding agents, approving file writes and command execution from the notch, including Chinese clients such as Kimi, Qwen, DeepSeek, GLM, CodeBuddy and Trae CN; each client is documented as either approval-capable or observe-only.
```

**为什么这么写：**

- 一句话，不吹（CONTRIBUTING 要求 description 简短、不用营销语）
- 把「30+」和「中文客户端」放最前，因为这是唯一没被占的位置
- 结尾那句「每格标能审批还是只观察」是差异化，也是我们唯一拿得出手的工程证据
- **不加 `![Freeware][Freeware Icon]`**：现在是限时免费，之后 12 美元买断，标 Freeware 是错的，维护者会挑

## 四、中文条目（同一 PR 里更新 `README-zh.md`）

```markdown
* [XIsland](https://www.imagentx.top/zh/products/xisland) - 把 30 多个 AI 编程代理收进 Mac 刘海面板，可在岛上批准文件写入与命令执行，覆盖 Kimi、通义千问、DeepSeek、GLM、CodeBuddy、Trae 国内版；每个客户端都标注了是「可审批」还是「仅观察」。
```

要不要顺手同步 `README-ja.md` / `README-ko.md`？仓库的 AI 助手说明里提到四个语言文件应当同步，但人类贡献指南只要求改 `README.md`。
**建议只改 en + zh 两个**，日韩版由维护者的自动流程处理；多改两个语种反而增加被要求修改的概率。

## 五、PR 标题与正文

标题（仓库要求格式 `[List Name](link)` 的风格，最简即可）：

```
Add XIsland to Menu Bar Tools
```

正文：

```markdown
Adds XIsland to Menu Bar Tools.

XIsland puts AI coding agent sessions in the MacBook notch / menu bar and can
approve file writes and command execution from there, instead of switching back
to the terminal. It covers 30+ clients, including Chinese ones that the existing
entries don't list (Kimi, Qwen, DeepSeek, GLM, CodeBuddy, Trae CN).

The differentiation from the notch apps already listed is coverage and
granularity: each client is documented as approval-capable or observe-only, and
the compatibility matrix ships in the repo (`docs/compatibility/agent-matrix.json`).
Not every client is at the same stage — the matrix records how far each one is
verified rather than a yes/no.

Placed alphabetically after Sharptooth. Updated README.md and README-zh.md.
```

**注意**：不要在 PR 里写「我们比 Perch 好」这类比较。维护者最讨厌在 PR 里打竞品，只描述自己做了什么、和已有条目的**位置差异**在哪。

## 六、awesome-claude-code：为什么不投

我把它的 CONTRIBUTING 全文读了。三个硬条件：

1. **不能提 PR，也不能用 `gh` 命令行。** 原文：`ALL RECOMMENDATIONS MUST BE MADE USING THE WEB UI ISSUE FORM TEMPLATE, OR YOU RISK BEING RESTRICTED`，并明确写了 `It is not possible to submit a resource recommendation using the gh CLI`
2. 门槛是「14 天以上且持续开发」**或**「100 star」。这条我们过（仓库 2026-05 创建、11-04 还在提交）
3. 但接着这句是致命的：

> if your project is closed-source, that presents a barrier to reviewing it; **if your project requires any form of signup or payment, this is a blocker for reviewing it** — I can only recommend such a resource on the basis of community adoption signals.

我们的激活码必须注册账号才能领，**正好踩在 blocker 上**。而且 1 star 意味着「community adoption signals」也拿不出来。

同一个文件里还有一句很直白的劝退：

> Build something awesome → Get users → Submit it to Awesome Claude Code

**结论：等 star 过 100 再投，或者干脆先让它自己被发现。** 现在就投，最好的结果是石沉大海，最坏的结果是被打上「推广」标签。

如果想早一点够条件，有个副作用小的做法：在 README 里加一段 "How it compares"，把 XIsland 和 Perch / Agent Island / Topnotchers 的差异讲清楚（谁支持审批、谁只读、各自覆盖多少客户端）。这段对**所有**渠道都有用，而且本身就是收录评审会看的东西。

## 七、提交步骤（awesome-mac）

1. Fork `jaywcjlove/awesome-mac`
2. 改两处：`README.md`（Sharptooth 之后）、`README-zh.md`（对应位置）
3. 检查：行尾无多余空格、只有一句话、没有 emoji、没有 freeware 图标
4. commit message：`Add XIsland to Menu Bar Tools`
5. 开 PR，正文用第五节的模板
6. 开完在 PR 里**不要再催**。这个仓库合并周期大约几天到两周

## 八、这件事的真实收益

不要指望 PR 被合并就来量。参考值：awesome-mac 的流量主要来自仓库内搜索和 Google 长尾，一条收录带来的通常是**每月个位数到几十次**点击。

它的价值不在量，在两点：

1. **永久入口**：帖子会沉，README 不会
2. **可信度背书**：以后在 V2EX / 小众软件被人问「凭什么用你的」，可以答「在 awesome-mac 的菜单栏工具里」，这比自吹有用

所以：**成本一次 PR，收益慢但不会消失。** 值得做，但不该排在发帖前面。

