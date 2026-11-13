# XIsland 差异化基线（对抗同名竞品）

> **背景**：2026-11-13 核查发现，`xisland.app` 是**同名竞品**，不是本站的站。
> 此前 `directory-submissions.md` 里「XIsland 已被 5+ 目录站收录、应去认领」的判断
> 前提错误——那些条目属于竞品，本站无权认领。本文档重建事实基线。
>
> **用途**：所有对外文案（目录站提交、社区发帖、产品页）的措辞依据。
> 每个数字都可溯源到 README / GitHub API / 实测，**不得凭印象改写**。

## 一、事实核查：两个 XIsland 不是同一个东西

| 维度 | 竞品 | 本站 |
|---|---|---|
| 官网 | `xisland.app`（域名注册 **2015-06-25**） | `imagentx.top`（注册 2025-08-26） |
| 落地页仓库 | `github.com/bluedusk/xisland`（**17 stars**） | `github.com/Meteorkid/XIsland`（**1 star**） |
| 仓库创建 | **2026-04-10**（比本站早 35 天） | 2026-05-15 |
| 最后推送 | 2026-10-30 | 2026-11-06 |
| 版本号 | v0.18.0（2026-05-02 最后一次 release） | **v2.0.18**（2026-11-06） |
| 发行包名 | `XIsland.dmg`、`XIsland.zip` | `XIsland-2.0.18.dmg` + `SHA256SUMS.txt` |
| 作者 | Dan（`@danielhymn`，103 个仓库，全栈背景） | 刘鑫宇（个人开发者） |
| 定价 | 免费（无商业计划） | 限时免费 + 永久激活码体系 |

**竞品的领先项**：更早建仓（35 天）、更早抢到 `.app` 域名（10 年老域名）、
更多 stars（17 vs 1）、更成熟的落地页（含 blog、docs、buy 页）。

**竞品的弱项**：版本停在 0.18.0（**5 个月未发版**）、只支持 4 个代理、
无中文界面、无配额追踪、无远程管理。

## 二、核心差异化：集成广度（数量级差距）

这是**唯一不需要编造就能讲清的强项**。

| | 竞品 | 本站 |
|---|---|---|
| 集成目标总数 | **4 个代理** | **30 个**（README 表格逐行可数） |
| 覆盖范围 | Claude Code、Codex、Gemini CLI、OpenCode | 上述 4 个 + Cursor、Windsurf、Cline、Aider、Roo Code、Continue、Cody、Trae、Qoder、Kiro、Amp、Pi、Devin、Amazon Q、Tabnine、GitHub Copilot CLI、VS Code Copilot、Zed、JetBrains AI/Junie、Kimi Code、Qwen Code、DeepSeek-TUI、Factory Droid、CodeBuddy Code 等 |
| 终端/IDE | Ghostty、iTerm2、Terminal.app、Warp、WezTerm、Kaku、Cmux | iTerm2（**tab 级精度**）、VS Code、Cursor、Windsurf、Zed、JetBrains |

**表述纪律（重要）**：本站 README 对每个集成的状态措辞非常谨慎——
多为「Contract tests passed; real client verification pending」（契约测试通过、真机验收待完成），
只有 Claude Code 有「isolated native Read and island denial verified」。
**对外文案必须沿用这个诚实口径**，不能把「契约测试通过」说成「已完整支持」。
推荐措辞：**「30 条集成路线，其中 N 条已通过契约测试」**，而不是「支持 30 个代理」。

## 三、其他可讲的差异（均已核实）

1. **版本成熟度**：v2.0.18 vs 竞品 v0.18.0。竞品 5 个月未更新（最后 release 2026-05-02）。
2. **发布安全实践**：本站每个 release 附 `SHA256SUMS.txt` 供校验；竞品无。
3. **多语言界面**：中 / 英 / 韩 / 日 / 法 五种（竞品无中文界面）。
4. **配额追踪**：可查 Kimi / DeepSeek / GLM API 余额（竞品无）。
5. **SSH 远程管理**：可在面板内连接并监控远程服务器（竞品无）。
6. **审批上下文图谱**：审批前可看任务、计划、文件变更、变更理由，
   含节点标注与轮次 diff（竞品只有简单的允许/拒绝按钮）。
7. **子代理嵌套显示**：子会话可视化缩进与折叠。
8. **审批图谱 MCP**：代理可提议本地任务节点，用户逐个保留或丢弃；
   **不授予任何命令、文件或审批权限**（安全设计，可强调）。
9. **静音规则**：正则匹配代理类型 / 工具名 / 工作目录（竞品无）。
10. **在线试用**：本站有 14 天试用 + 激活码体系，用户无需先付款。

## 四、撞名带来的实际损失（实测，不是推测）

1. **目录站条目全是竞品的**。实测三个站的外链：

   | 站点 | 外链指向 | rel 属性 |
   |---|---|---|
   | ustack.app | `xisland.app` | `nofollow noopener` |
   | toolstory.ai | `github.com/bluedusk/xisland` | `nofollow noopener` |
   | hunted.space | `xisland.app/docs/` | `nofollow noopener noreferrer` |

   **全部 nofollow，且全部指向竞品。** 原文档「它们也给外链所以净正面」的结论**不成立**。

2. **本站产品在目录站生态里不存在**。用 `Meteorkid+XIsland`、`imagentx+XIsland`、
   `imagentx.top` 三个检索式均**搜不到结果**。

3. **搜索品牌词会被竞品截走**。搜 "XIsland" 时用户看到的是竞品的
   `.app` 域名、17 stars 的仓库、多个目录站条目。

## 五、策略结论

**不认领（无权）、不指望（nofollow）、不自乱（不改名）**，改为：

1. **主动提交**，把条目建到本站地址上——这是从零建立，不是「补全已有」。
   所有链接必须指向 `imagentx.top/zh/products/xisland` 或 `github.com/Meteorkid/XIsland`。
2. **文案一律带差异点**。竞品是 4 个代理、5 个月没更新、无中文；
   本站是 30 条集成路线、2.0.18 持续迭代、五语言界面。
   但**必须如实标注验证状态**，不夸大为「全支持」。
3. **提交时主动区分同名**。在描述里明确写「与 xisland.app 无关」是必要的——
   否则审核者会当成重复条目拒掉。推荐措辞见 `directory-submissions.md`。
4. **长期看，撞名是根本问题**。竞品占着 10 年老域名 + 更早的仓库，
   品牌词搜索上本站长期吃亏。若将来要投 Product Hunt 这类一次性资源，
   应先用差异化故事（集成广度）建立认知，而不是拼品牌名。
