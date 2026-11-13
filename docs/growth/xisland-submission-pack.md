# XIsland 目录站提交包（2026-11-13）

> **可直接复制使用**。所有文案已按撞名事实编写，链接一律指向本站地址。
> 背景与事实依据见 `xisland-differentiation.md`，入口清单见 `directory-submissions.md`。
>
> **核心纪律**：
> 1. 链接指向 `https://www.imagentx.top/zh/products/xisland` 或 `https://github.com/Meteorkid/XIsland`
> 2. **绝不指向 `xisland.app`**（那是同名竞品）
> 3. 必须主动声明与同名项目无关，否则会被当重复条目拒掉
> 4. 集成数量表述遵守 README 的诚实口径（「契约测试通过」≠「已完整支持」）

## 一、UStack 补录邮件（优先发这封）

**收件人**：`contact@ustack.app`
**主题**：Request to add a separate entry — XIsland (imagentx.top), distinct from the existing xisland.app listing

```
Hi UStack team,

Your directory currently has an entry for "xisland" that links to xisland.app.
I'd like to request a separate entry for a different, independently developed
project that happens to share the same name.

The two are unrelated:

- Existing entry: xisland.app, by github.com/bluedusk/xisland
- This request:  XIsland by Meteor Store, https://www.imagentx.top/zh/products/xisland
                 repository: https://github.com/Meteorkid/XIsland

They are separate codebases with separate authors, separate release channels,
and no shared affiliation.

What the Meteor Store XIsland is:

XIsland turns the macOS notch into a control tower for AI coding agents. It
lets you run many agent sessions at once and surfaces every permission request,
agent question, and task status in one panel — approve in place, then jump
straight back to the right terminal tab. Native Swift, non-activating, fully
local (no cloud, no account, no telemetry).

Key differentiators, all verifiable from the repository README:

- 30 agent integration routes (Claude Code, Codex, Gemini CLI, OpenCode, Cursor,
  Windsurf, Cline, Aider, Roo Code, Continue, Cody, Trae, Qoder, Kiro, Amp, Pi,
  Devin, Amazon Q, Tabnine, GitHub Copilot CLI, VS Code Copilot, Zed,
  JetBrains AI/Junie, Kimi Code, Qwen Code, DeepSeek-TUI, Factory Droid,
  CodeBuddy Code and more), versus 4 agents in the other project
- Interface localized in 5 languages (Chinese, English, Korean, Japanese, French)
- API quota tracking (Kimi / DeepSeek / GLM)
- SSH remote server management from the panel
- Approval context map: review task, plan, file changes and reasoning before
  approving, with node annotations and round-to-round diffs
- Every release ships a SHA256SUMS.txt for verification
- Actively maintained: latest release v2.0.18 (November 2026)

A note on accuracy: most integrations are at "contract tests passed, real client
verification pending" stage. Only Claude Code has been verified end-to-end so far.
I'd rather state that plainly than overclaim.

Suggested listing details:

- Name: XIsland (by Meteor Store)
- Website: https://www.imagentx.top/zh/products/xisland
- Repository: https://github.com/Meteorkid/XIsland
- Category: Developer Tools / AI Developer Tools
- Platforms: macOS 14.0+
- Pricing: Free (limited-time free license; 14-day trial without a license)

Please let me know if you need any additional information to verify this is a
separate project. Happy to provide the release artifacts and checksums.

Thank you,
Liu Xinyu
Meteor Store
```

## 二、英文提交物料（通用，可直接粘贴）

**Name**
```
XIsland (by Meteor Store)
```

**Tagline（40 字内）**
```
macOS Dynamic Island for 30+ AI coding agents — approve, monitor, and jump back, all locally.
```

**Short description（150 字内）**
```
XIsland turns the macOS notch into a control tower for AI coding agents. Run many
Claude Code, Codex, Gemini CLI, Cursor or Windsurf sessions at once and have every
permission request, agent question, and task status surface in one panel — approve
in place, then jump straight back to the right terminal tab. Native Swift, non-
activating, no cloud, no account, no telemetry. Free.

Note: independently developed by Meteor Store. Not affiliated with xisland.app,
a different same-named project by another author.
```

**Long description（用于支持长文本的站）**
```
XIsland turns the macOS notch into a control tower for AI coding agents.

When you run several agents at once — Claude Code in one tab, Codex in another,
Gemini CLI in a third — the bottleneck stops being the agents and starts being
your attention. XIsland collects every session into a single panel at the top of
your screen: live status dots, permission requests, agent questions, plan
reviews, and tool activity, with a click to jump back to the exact terminal tab
that needs you.

Core capabilities:
- Unified dashboard across all agent sessions
- Permission approval from the panel — no window switching
- Approval context map: review task, plan, file changes and reasoning before
  approving, with node annotations and round-to-round diffs
- Plan review and question answering inline
- Session titles from your first prompt, workspace folder as subtitle
- iTerm2 tab-level window jumping
- Subagent nesting with visual indentation
- Activity log with per-tool-call details
- API quota tracking (Kimi / DeepSeek / GLM)
- SSH remote server management from the panel
- Regex-based mute rules and quiet hours
- Five interface languages: Chinese, English, Korean, Japanese, French
- External monitor support — the panel follows your mouse between displays

Integration breadth is the main differentiator: 30 agent integration routes,
covering Claude Code, Codex, Gemini CLI, OpenCode, Cursor, Windsurf, Cline,
Aider, Roo Code, Continue, Cody, Trae, Qoder, Kiro, Amp, Pi, Devin, Amazon Q,
Tabnine, GitHub Copilot CLI, VS Code Copilot, Zed, JetBrains AI/Junie,
Kimi Code, Qwen Code, DeepSeek-TUI, Factory Droid and CodeBuddy Code.

Status honesty: most integrations have passed contract tests but are awaiting
real-client verification. Claude Code has been verified end-to-end, including
isolated native Read operations and island-side denial.

Technical: native Swift (SwiftUI + AppKit), macOS 14.0+, no Electron layer.
All communication between the panel and your CLI tools happens locally on your
Mac. Every release ships with a SHA256SUMS.txt for verification.

Pricing: free. A limited-time free license provides lifetime activation for up
to 3 devices; you can also try the full feature set for 14 days without a license.

Note: this is the XIsland by Meteor Store. It is NOT affiliated with xisland.app,
a different same-named project by another author.
```

**Categories**
```
Primary:   Developer Tools
Secondary: AI Developer Tools
Avoid:     Productivity (most rejections come from wrong category)
```

**Pricing field**
```
Free (limited-time free license; 14-day trial available without a license)
```

**Must-mention fields**
```
- Requires account registration to claim a free license
- Interface available in Chinese
- macOS 14.0+ only
```

## 三、中文提交物料

**名称**
```
XIsland（Meteor Store 出品）
```

**一句话（40 字内）**
```
macOS 刘海面板，统一监控并批准 30+ 种 AI 编程代理的权限请求，全程本地通信。
```

**短描述（150 字内）**
```
XIsland 把 macOS 刘海变成 AI 编程代理的控制台。同时跑多个 Claude Code、Codex、
Gemini CLI、Cursor、Windsurf 会话时，权限请求、代理提问、任务状态全部汇聚到刘海
面板，可以原地批准或拒绝，一键跳回对应终端标签页。原生 Swift，非激活窗口，不抢
编辑器焦点。本地通信，无云端、无账号、无遥测。免费。

说明：本产品由 Meteor Store 独立开发，与 xisland.app（另一位作者的同类项目）无关。
```

## 四、素材清单（可直接上传）

全部位于 `docs/growth/发布包-2026-11-05/图/`：

| 文件 | 用途 | 语言 |
|---|---|---|
| `xisland-00-封面-英文原图.png` | 封面 / banner | 英文 |
| `xisland-01-会话列表-英文2x.png` | 截图（2x 高清） | 英文 |
| `xisland-02-代理提问-英文2x.png` | 截图（2x 高清） | 英文 |
| `xisland-03-权限审批-中文.png` | 截图（体现中文界面） | 中文 |
| `xisland-04-会话列表-中文.png` | 截图（体现中文界面） | 中文 |
| `xisland-demo.gif` | 演示动图 | 英文 |

**上传建议**：英文站用英文截图；中文站（如适用）附一张中文截图证明有中文界面。
`xisland-03/04` 是**唯一的本地化证据**，投中文目录站时务必带上。

**另需准备的规格**（当前素材里没有）：
- **宽幅 banner 1200×630**：多数目录站要求。可用 `xisland-00-封面-英文原图.png` 裁切
- **正方形透明底 logo**：来源 `public/products/xisland/cover.webp` 或仓库 `Assets/app-icon.png`

## 五、数字溯源核对（2026-11-13 逐项验证）

文案里每个数字都必须能指到来源，**不得凭印象写**。本次核对结果：

| 文案表述 | 来源 | 状态 |
|---|---|---|
| 30 条集成路线 | README「AI integration targets」表格，逐行可数 | ✓ 精确 30 行 |
| v2.0.18 | GitHub API `releases/latest` | ✓ 2026-11-06 发布 |
| 五语言 zh/en/ko/ja/fr | README Language 设置项 | ✓ |
| 配额追踪 Kimi/DeepSeek/GLM | README「Quota tracking」 | ✓ |
| SSH 远程管理 | README「SSH Remote Manager」 | ✓ |
| 审批上下文图谱 | README「Approval context map」 | ✓ |
| 子代理嵌套 | README「Subagent nesting」 | ✓ |
| 正则静音规则 | README「Regex-based mute rules」 | ✓ |
| iTerm2 tab 级跳转 | README「iTerm2 tab-level precision」 | ✓ |
| 每个 release 附 SHA256SUMS | GitHub API release assets | ✓ |
| macOS 14.0+ | README Install 段 | ✓ |
| Claude Code 已端到端验证 | README「island denial verified」 | ✓ |

**⚠️ 已发现的陷阱**：README 正文里写的是 **v2.0.16**（Demo 视频链接），
但 GitHub 上最新 release 是 **v2.0.18**。**README 比实际发版旧**。
引用版本号时**以 GitHub API 为准，不要抄 README**：

```bash
curl -sL https://api.github.com/repos/Meteorkid/XIsland/releases/latest | grep tag_name
```

## 六、提交后必须做的事

每提交一个站，立刻记录并在 3-7 天后复查：

```bash
# 1. 确认条目已上线
curl -sL -o /dev/null -w "HTTP %{http_code}\n" "<条目URL>"

# 2. 确认外链指向本站（而不是竞品）
curl -sL "<条目URL>" | grep -oE '<a[^>]*imagentx\.top[^>]*>' | head -3

# 3. 确认是否 dofollow（看是否含 nofollow）
curl -sL "<条目URL>" | grep -oE '<a[^>]*imagentx\.top[^>]*>' | grep -c nofollow
```

**记录表**（建议直接追加到 `directory-submissions.md`）：

| 站点 | 提交日期 | 条目 URL | 状态 | 外链指向 | rel |
|---|---|---|---|---|---|
| | | | | | |

**为什么必须记录**：半年后不记得投过哪些，重复提交会被当 spam；
而「外链是否 dofollow」只能实测，第三方整理的 DR/dofollow 数据未必准确
（已实测：ustack / toolstory / hunted 三家宣称有外链，实际全是 nofollow 且指向竞品）。
