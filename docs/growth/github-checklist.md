# GitHub 侧优化清单（XIsland / XNook）

> 🔴 **2026-11-03 晚修正：本文部分假设已被实际核查证伪。**
> 当时我连不上 GitHub，是按「仓库大概是空的」写的。实测结果：
> README 已有完整英文正文 + 演示 GIF + 截图墙，description 已写好，
> Release 有 30 个且一直挂着 DMG。**真正空的只有 topics。**
> → 以 **`README-XIsland.md`（实测核查）** 为准；本文的 2.1 / 2.3 / 2.4 三节请只当参考。


> 2026-11-03。对应「补 GitHub 入口」这一步。
>
> 背景数据：近 30 天官网真实商品页浏览 **28 次**，`/api/download` 调用 **1 次**（自己测试），
> `stargazers_count: 1`。所以现在不是转化问题，是**发现**问题。
>
> 开发者找 macOS 工具的第一站是 GitHub 搜索，不是中文搜索引擎。这条路不需要花钱，
> 而且能累积（star 数会一直摆在那里，成为信任凭证）。

---

## 一、官网这边已经改好的

| 改动 | 文件 |
|---|---|
| 产品页主视觉区新增「在 GitHub 查看」按钮（`product.github` 有值才渲染） | `src/app/[locale]/products/[id]/page.tsx` |
| 新增 i18n：`viewOnGitHub`（zh/en） | `messages/zh.json`、`messages/en.json` |
| 纠正 `github` 字段注释：从「UI 不渲染」改为「产品页渲染」+ 恢复收费时的注意事项 | `src/data/products.ts` |

> ⚠️ **恢复收费前必查**：如果 GitHub Releases 里挂着和 R2 同一个 DMG，
> 那门控就形同虚设——任何人都能从 GitHub 直接下走付费包。免费期无所谓，
> 收费前必须删掉 Release 里的安装包，或改成放源码/构建脚本。

---

## 二、仓库这边要改的（我连不上 GitHub，需要你手动做）

### 2.1 README 首屏（决定 90% 的 star）

GitHub 仓库页首屏只有 600px 高，必须在里面回答三件事：**这是什么 / 长什么样 / 怎么装**。

**结构顺序（不要改）**：

```
1. 一句话定位（英文，一行）
2. 演示 GIF（宽度 ≥ 800px，≤ 8 秒，必须动）
3. 三个徽章：平台 / 版本 / License
4. 一段 30 秒读完的说明
5. Install（两行命令或 DMG 下载）
6. Features（3–5 条，每条一行）
```

**可直接抄的骨架**（把尖括号内容换掉）：

```markdown
# XIsland

A macOS Dynamic Island-style control tower for all your AI coding agents.

![demo](docs/demo.gif)

![platform](https://img.shields.io/badge/platform-macOS%2013%2B-lightgrey)
![version](https://img.shields.io/badge/version-2.0.15-blue)

XIsland puts every Claude Code / Cursor / Codex session into one always-visible
island at the top of your screen. See which agent is running, which one is stuck
waiting for input, and jump to it in one keystroke — without hunting through terminals.

## Install

Download the latest DMG from [Releases](https://github.com/Meteorkid/XIsland/releases/latest),
or from the [official site](https://www.imagentx.top/en/products/xisland).

```bash
# first launch (the build is ad-hoc signed, not notarized yet)
xattr -cr "/Applications/X Island.app"
```

## Features

- **All agents in one place** — Claude Code, Cursor, Codex, custom CLI agents
- **Live status** — running / waiting for input / done, at a glance
- **One-keystroke jump** — focus the right terminal instantly
- **Under 60 MB RAM** — native SwiftUI, no Electron
- **Free for now** — lifetime license while the free period lasts
```

**几个细节**：

- GIF 不要用截图代替。这类工具的价值 80% 在「动起来好看」，静态图说服力接近 0。
- `xattr -cr` 那行必须写。不写的话，一半人双击后看到「已损坏，无法打开」就走了，
  而且不会告诉你（详见第五节）。
- 不要写 "coming soon"、"work in progress" 之类的自我贬低，首屏只放现状。

### 2.2 Topics（GitHub 搜索的唯一入口）

仓库页右上角 ⚙️ → Topics，**最多 20 个，必须全填满**。建议：

```
macos  swiftui  menu-bar  dynamic-island  notch  productivity
claude-code  cursor  ai-agents  llm  developer-tools  macos-app
notch-tools  agent-monitor  terminal  codex  ai  macos-apps
```

搜索逻辑是精确匹配 topic 和 repo name，填 `macos` + `dynamic-island` 就能被
「macos dynamic island」这类查询捞到。**空着等于不存在。**

XNook 用另一组，避免自家两个仓库互相抢同一个关键词：

```
macos  swiftui  menu-bar  dynamic-island  utility  tools
productivity  macos-app  notch  quick-launch  clipboard  media-control
```

### 2.3 Release

每次发版都要有 Release，哪怕只是打个 tag：

- 标题：`v2.0.15`
- 正文：3–5 条变更（**用英文**，中文放最后一段）
- 附件：**不要挂 DMG**（见第一节的警告）。要挂就挂源码 zip

### 2.4 仓库描述（Description）

仓库页顶部那行，会出现在搜索结果里。必须是一句完整的英文：

> A macOS Dynamic Island-style control tower for all your AI coding agents.

不要写中文，不要写 "my project"，不要留空。

---

## 三、提交顺序（避免白干）

1. README + topics + description（**先做这个**，否则后面推广来的流量全浪费）
2. 官网新按钮部署上线
3. 再开始对外发帖（V2EX → Reddit → HN）

---

## 四、不要做的事

| 做法 | 为什么不做 |
|---|---|
| 到处发「求 star」 | 换来的是死 star，不带来任何下载，还会被社区标记为 spam |
| 买 star / 互 star 群 | GitHub 会清理，且 star/fork 比例异常会被识别 |
| README 放一堆 badge 徽章墙 | 首屏 600px 被徽章吃掉，演示 GIF 被挤到折叠线以下 |
| 用中文写 README 主体 | 目标用户九成在英文圈；中文可以放 `README.zh-CN.md` |

---

## 五、还没解决的漏斗杀手：签名

**这件事比任何推广都重要，但现在做不了（要花钱）。**

两个 DMG 都是 adhoc 签名，没有 Apple Developer ID，也没有 notarize。后果：

- 用户下载后双击 → macOS 弹「无法打开，因为 Apple 无法验证」
- 想装必须：右键 → 打开 → 再点「打开」，或者终端跑 `xattr -cr`
- 对熟人这是一步操作；对**从 GitHub 点进来的陌生人，这是直接关掉**

$99/年 Apple Developer Program 是这门生意里唯一确定值得花的钱。买了之后：

```
Developer ID Application 证书 → codesign 签名 → notarytool 提交公证 → staple
```

做完这一步，「装不上」这个流失点才会消失。在此之前，README 里那行 `xattr -cr`
是唯一的缓解办法，**必须写**。

---

## 六、验收标准

| 时间 | 指标 | 怎么查 |
|---|---|---|
| 1 周 | README + topics + description 全部改完 | 手动看仓库页 |
| 2 周 | `/api/download` 真实调用 ≥ 50 次 | `traffic-report.sh 14` |
| 1 个月 | GitHub star ≥ 100，真实下载 ≥ 200 | GitHub 页面 + `traffic-report.sh 30` |
| 3 个月 | 收到 ≥ 20 条真实用户反馈 | Issues / 邮件 |

`traffic-report.sh` 在服务器 `/usr/local/bin/`，源码在 `deploy/traffic-report.sh`。
它不需要前端埋点：`/api/download` 和 `/api/claim` 本身就是服务端请求，nginx 已经记了。
