# XIsland 仓库现状核查（2026-11-03 实测）

> 我之前的假设有一部分是错的：README 早就有英文正文、演示 GIF 和截图墙，
> Release 也一直在挂 DMG。**真正空着的只有 topics。**
> 下面是从 GitHub API 拉到的事实，不是推测。

## 一、实测数据

| 项 | XIsland | XNook |
|---|---|---|
| star / fork / watch | 1 / 0 / 0 | 1 / 0 / 0 |
| description | ✅ 已有，英文，准确 | ✅ 已有，英文 |
| **topics** | ❌ **空** | ❌ **空** |
| README | ✅ 英文 + `Assets/demo.gif` + 4 张截图 | — |
| Releases | ✅ 30 个，最新 `v2.0.15` 带 `XIsland-2.0.15.dmg` + `SHA256SUMS.txt` | — |
| homepage | `imagentx.top/zh/products/xisland` | `imagentx.top/zh/products/xnook` |
| license | Other / NOASSERTION | Other / NOASSERTION |

## 二、真正要改的只有三处

### 1. 填 topics（唯一的大洞，2 分钟）

两个仓库的 topics 都是空的——这意味着**在 GitHub 搜索里几乎不可能被搜到**。
仓库页右上 About 右侧 ⚙️ → Topics，最多 20 个，填满：

**XIsland**：

```
macos  swiftui  menu-bar  dynamic-island  notch  productivity
claude-code  cursor  codex  ai-agents  llm  developer-tools
macos-app  agent-monitor  terminal  claude  openai  automation
permission-management  widgets
```

**XNook**（换一组，别和 XIsland 抢同一个词）：

```
macos  swiftui  menu-bar  dynamic-island  utility  tools
productivity  macos-app  notch  quick-launch  clipboard  media-control
file-tray  calendar  airpods  battery  screenshot  focus-mode
window-manager  menu-bar-app
```

### 2. homepage 改成英文页

现在是 `/zh/products/xisland`。GitHub 是英文流量入口，点进去看到中文会掉一半人。
改成 `https://www.imagentx.top/en/products/xisland`（XNook 同理）。

### 3. README 首屏顺序（可选，收益中等）

现有 README 的内容质量够用，但**首屏的信息顺序把弱卖点放在了最前面**。

`A macOS Dynamic Island-style control tower for all your AI coding agents.`
——这句是对的，但「control tower」对没用过的人没有画面感。

建议把 `Core features` 里的第一条换成**权限批准**，因为那是唯一一个
「读到就懂、且别的工具没有」的卖点：

```markdown
- **Approve permissions from the island** — file writes and command execution
  get approved without switching to the terminal
- **Answer questions inline** — pick an option with ⌘1 / ⌘2
- **Plan review** — approve agent plans without leaving what you're doing
- **Jump to the exact tab** — click a session to focus its iTerm2 tab
- **Unified dashboard** — every agent in one place
```

顺序换了，读者的第一反应从「我好像不需要」变成「这个我天天遇到」。

## 三、一件已经做对的事，别改

README 里已经明确写了 Gatekeeper 的处理方式：

```bash
xattr -cr /Applications/X\ Island.app
```

**这是必须留着的。** adhoc 签名的包不写这句，一半人会在「已损坏，无法打开」
那一步放弃，而且不会告诉你。这条比任何推广文案都重要。

## 四、一个需要留意的风险

`v2.0.15` 的 Release 直接挂着 `XIsland-2.0.15.dmg`，任何人不经过官网就能下走。

- **限时免费期间**：这是好事，等于多一个分发渠道，不用动
- **恢复收费以后**：官网的门控就完全失效了，必须把 Release 里的 DMG 撤掉
  或换成不含授权校验的试用版

`src/data/products.ts` 里 `github` 字段的注释已经记了这一条。
