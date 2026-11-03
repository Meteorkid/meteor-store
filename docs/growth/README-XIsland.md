# XIsland（README 待粘贴稿）

> 把下面这段整体复制到 `github.com/Meteorkid/XIsland` 的 README.md。
> 图片那行需要你在网页编辑器里把 `docs/growth/assets/xisland-readme-demo.gif`
> **拖进正文**，GitHub 会自动换成 user-images 链接——不要用相对路径，仓库里没有这个文件。

---

```markdown
# XIsland

A macOS Dynamic Island-style control tower for all your AI coding agents.

<!-- 把 docs/growth/assets/xisland-readme-demo.gif 拖到这里，替换下面这行 -->
![XIsland demo](https://user-images.githubusercontent.com/REPLACE_ME/demo.gif)

[![platform](https://img.shields.io/badge/platform-macOS%2013%2B-lightgrey)](https://www.imagentx.top/en/products/xisland)
[![version](https://img.shields.io/badge/version-2.0.15-blue)](https://www.imagentx.top/en/products/xisland)

XIsland puts every AI coding agent you're running into one always-visible
island at the top of your screen. Collapsed, it tells you how many are working
and whether any is waiting on you. Expanded, it lists each agent with its state,
and when an agent asks a question you can answer it with ⌘1 / ⌘2 — without
going back to the terminal that spawned it.

Agent state is inferred from process activity and output patterns rather than
per-tool hooks, so it also covers agents it was never integrated with.
31 agents are recognised out of the box: Claude Code, Cursor, Codex, Copilot,
Windsurf, Trae, Gemini, Zed and more.

## Install

Download the DMG from [Releases](../../releases/latest), or from the
[official site](https://www.imagentx.top/en/products/xisland).

```bash
# First launch — the build is ad-hoc signed, not notarized yet.
# Without this macOS will say the app is damaged.
xattr -cr /Applications/XIsland.app
```

Requires macOS 13 or later.

## Features

- **Every agent in one place** — 31 agents recognised, plus custom CLI agents
- **Live state** — running / waiting for input / done, at a glance
- **Answer without switching** — pick an option with ⌘1 / ⌘2 on the island
- **Never steals focus** — non-activating panel, floats above Spaces and full-screen apps
- **Light** — native SwiftUI, ~40 MB with four agents attached
- **No account needed** — download, install, try it for 14 days

## Pricing

Free while the launch period lasts: claim a lifetime license for up to 3 Macs.
No payment, no account required to download.

## Notes

- The build is **ad-hoc signed** for now. First launch needs the `xattr` command
  above; notarization is in progress.
- State detection is heuristic. If it mislabels what your agent is doing,
  please [open an issue](../../issues) and tell us what you were running.

## License

See the [LICENSE](../../blob/main/LICENSE) in this repository.
```

---

## 仓库页另外两处（容易被忘）

**Description**（仓库页右上 About 那一行，会进搜索结果）：

```
A macOS Dynamic Island-style control tower for all your AI coding agents.
```

**Topics**（About 右侧 ⚙️，最多 20 个，**填满**）：

```
macos  swiftui  menu-bar  dynamic-island  notch  productivity
claude-code  cursor  ai-agents  llm  developer-tools  macos-app
notch-tools  agent-monitor  terminal  codex  ai  macos-apps
clipboard  quick-launch
```

> XNook 用另一组，别和 XIsland 抢同一批关键词：
> `macos  swiftui  menu-bar  dynamic-island  utility  tools  productivity  macos-app  notch  quick-launch  clipboard  media-control`
