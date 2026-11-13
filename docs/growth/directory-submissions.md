# 第三方目录站清单

> **2026-11-13 重大更正**：本文档原有的核心前提是**错的**。
> 原判断「XIsland 已被 5+ 目录站收录，应去认领并补全条目」——
> 实测发现 `xisland.app` 是**同名竞品**（`bluedusk/xisland`，17 stars，2026-04 建仓），
> **那些条目属于竞品，本站无权认领，也没有「已有条目」可补全。**
>
> 完整事实核查见 `xisland-differentiation.md`。本节保留原记录并标注错在哪，
> 避免以后有人重读时又被误导。

## 一、纠正记录：原判断错在哪

### 原判断（错误）

> 「它们已经收录了 XIsland，而且是从 `xisland.app`（独立官网）抓的」
> 「这些页面也给外链，所以是净正面」
> 「第一优先级的动作是认领 + 补全已有条目」

### 实测事实（2026-11-13）

**错误 1：把竞品当成了自己的独立站。**
`xisland.app` 的下载链接指向 `github.com/bluedusk/xisland/releases/latest/download/XIsland.dmg`，
作者 `bluedusk`（Dan，`@danielhymn`）。整站**没有任何一处提到 `Meteorkid`**。
它是同名竞品，不是本站的另一个域名。

**错误 2：「给外链所以净正面」不成立。**
实测三个站的外链，**全部 nofollow，且全部指向竞品**：

| 站点 | 条目 URL | 外链指向 | rel |
|---|---|---|---|
| ustack.app | `/zh-CN/products/xisland` | `xisland.app` | `nofollow noopener` |
| toolstory.ai | `/tools/97064/xisland/` | `github.com/bluedusk/xisland` | `nofollow noopener` |
| hunted.space | `/product/x-isiand` | `xisland.app/docs/` | `nofollow noopener noreferrer` |

nofollow 不传递权重，指向竞品更谈不上正面。**这些外链对本站价值为零。**

**错误 3：本站产品在目录站生态里根本不存在。**
用 `Meteorkid+XIsland`、`imagentx+XIsland`、`imagentx.top` 三个检索式
在搜索引擎均**查不到结果**。原文档说的「已被 5+ 目录站收录」，
收录的是竞品，不是本站。

### 结论修正

| 原判断 | 修正后 |
|---|---|
| 已有条目，去认领补全 | **没有条目，要从零提交**（认领无权，条目不属本站） |
| 已有外链，是净正面 | **外链是竞品的、nofollow，价值为零** |
| 边际收益比补 schema 高一个量级 | **原估的「高一个量级」基于错误前提，实际是从零开始** |

## 二、仍然成立的观察（这些是对的）

1. **撞名是真实的竞争劣势**。竞品占着 2015 年注册的 `.app` 老域名、
   更早的仓库（早 35 天）、更多 stars（17 vs 1），
   搜品牌词 "XIsland" 时用户先看到的是它。
2. **目录站值得投**，但逻辑变了：不是「认领已有」，是「**建立自己的**」。
   价值来自外链信号（若 dofollow）与品牌曝光，不来自「补全」。
3. **mergeek.cn 已降级**：对所有人（含浏览器 UA）302 到 `xisland.app`，
   不渲染内容页 → 不值得投入。这条观察仍然有效。
4. **toolstory.ai 的 301 已恢复**为 200（带尾斜杠），条目保留竞品信息。

## 三、行动方向的根本调整

| | 原方案（错） | 新方案 |
|---|---|---|
| 动作 | 认领竞品条目、补全信息 | **从零提交自己的条目** |
| 链接 | 沿用 `xisland.app` | **必须指向 `imagentx.top/zh/products/xisland` 或 `Meteorkid/XIsland`** |
| 文案 | 通用描述 | **必须带差异化 + 主动声明与 xisland.app 无关**（否则会被当重复条目拒掉） |
| 预期 | 补全即可见效 | 从零建立，周期更长，且要接受撞名的长期劣势 |

具体的提交物料见本文档第五节，差异化事实见 `xisland-differentiation.md`。

## 四、历史记录（2026-11-05 调研原文，保留供追溯）

> 目的：把「别人排在我们前面」的目录站变成自己的分发渠道。

已确认收录的第三方页面（**2026-11-12 复测**）：

| 站点 | 页面 | 状态（11-12 实测） | 归属 |
|---|---|---|---|
| ustack.app | `/zh-CN/products/xisland` | 200，含完整 FAQ、Pros/Cons | ⚠️ **竞品** |
| hunted.space | `/product/x-isiand` | 200，带用户评论 | ⚠️ **竞品** |
| toolstory.ai | `/tools/97064/xisland/` | 200（此前 301，已恢复） | ⚠️ **竞品** |
| mergeek.cn | `/projects/KvEVrAKYGRlm7POx/official_site` | 302 → `xisland.app` | ⚠️ **竞品** |
| clauday.com | `/article/f8f7e255-...` | 200，原创评测文章 | 待确认归属 |

**注**：ustack 条目的内容质量其实不差（含概览/核心功能/使用场景/Pros&Cons/FAQ），
但它描述的是竞品，且外链 nofollow。**不要因为「内容完整」就以为可以接手。**

## 五、提交清单（按 ROI 排序）

> 所有动作都是**从零提交**，不是「补全已有条目」。物料文案见第六节。

### P0：免费 + 审核快（入口已实测可达）

| 站点 | 提交入口 | 成本 | 审核 | 备注 |
|---|---|---|---|---|
| UStack | `contact@ustack.app` | 免费 | 每日审核 | ⚠️ 已有条目属**竞品**，需**新提交**本站产品并声明区别，不是「补全」 |
| Toolfio | `https://www.toolfio.com/submit`（实测 200） | 需页脚挂 badge | 3-5 天 | DR 61，宣称 dofollow |
| Wayfindio | `https://wayfindio.com/submit`（实测 200） | 需页脚挂 badge | 1-2 天 | DR 51，宣称 dofollow |
| AI Toolz Dir | `https://aitoolzdir.com/submit`（实测 200） | 需站内挂文本链接 | 1-2 天 | DR 68 |
| Launch Llama | `https://tools.launchllama.co/submit`（实测 200） | 需给 5 个工具点赞 + 挂 badge | 约 4 周 | DR 67，背后有 6.5 万订阅 newsletter |
| ProductCool | `https://productcool.com/submit`（实测 200） | 免费 | 24-48 小时 | 审核最快 |
| FreeAIO | `https://freeaio.com/submit-ai-tool/`（**注意尾斜杠**，实测 301 → 200） | 免费 | 未注明 | 聚焦免费工具，与「限时免费」定位契合 |

**关于页脚 badge**：多个目录要求挂它们的 badge 换免费 dofollow。**别全挂**——
页脚挂五个 badge 本身就是在损害自己的页面。挑 DR 最高、流量最实的 2-3 个。

**关于 dofollow 宣称**：上表的「dofollow」来自第三方整理，**本站未逐个实测验证**。
提交后应实际抓取条目页检查 `rel` 属性（方法：`curl -sL <条目URL> | grep -o '<a[^>]*href="<你的域名>"[^>]*>'`，
看是否含 `nofollow`）。已验证的实情是：**ustack / toolstory / hunted 三家全是 nofollow**。

### P1：有流量但要花钱或条件

| 站点 | 入口 | 成本 | 说明 |
|---|---|---|---|
| There's An AI For That | 站内提交 | 付费 | DR 77，AI 目录里搜索流量最大，"AI for X" 类查询必争 |
| Product Hunt | 站内 | 免费 | DR 91，但**一次性机会**——需 5 图 + 完整素材 + 英文化。**建议等 star 数上来再发** |
| Futurepedia | 需先登录（导航只有 `/login`、`/register`，**提交页未登录不可见，不要猜路径**） | 免费但审核严 | DR 78，按分类浏览 |
| AlternativeTo | 站内（未登录访问返回 403，需注册后操作） | 免费 | 「alternative to XXX」搜索量大，2009 年至今权重高 |
| Uneed | `https://www.uneed.best/submit-a-tool`（实测 200） | 免费 | DR 75，有日榜周榜 |
| SaaSHub | `https://www.saashub.com/submit`（实测 200） | 免费 | 对「X vs Y」对比类搜索排名好 |

### P2：性价比低或暂不做

| 站点 | 原因 |
|---|---|
| ToolDirectory.AI | 要按月订阅才能「被考虑」，DR 仅 47 |
| Appscribed | 无免费通道 |
| MicroLaunch / EarlyHunt | 免费通道要等数月，或 dofollow 只给赢家 |
| G2 / Capterra | 面向企业采购，与个人开发者工具定位不符；但**如果之后做团队版**值得回来做 |
| mergeek.cn | 条目已降级为 302 跳转，且属竞品，**不值得投入** |

## 六、提交物料（2026-11-13 重写，含撞名声明）

**核心纪律**：所有链接指向 `imagentx.top/zh/products/xisland` 或 `github.com/Meteorkid/XIsland`，
**绝不指向 `xisland.app`**。必须主动声明与同名竞品无关，否则会被当重复条目拒掉。

**一句话（40 字内，英文版）**
```
macOS Dynamic Island for 30+ AI coding agents — approve, monitor, and jump back, all locally.
```
**一句话（中文版）**
```
macOS 刘海面板，统一监控并批准 30+ 种 AI 编程代理的权限请求，全程本地通信。
```

**短描述（150 字内，英文版）**
```
XIsland turns the macOS notch into a control tower for AI coding agents. Run many
Claude Code, Codex, Gemini CLI, Cursor or Windsurf sessions at once and have every
permission request, agent question, and task status surface in one panel — approve
in place, then jump straight back to the right terminal tab. Native Swift, non-
activating, no cloud, no account, no telemetry. Free.

Note: this is the independently developed XIsland from Meteor Store
(imagentx.top). It is NOT affiliated with xisland.app — a different, same-named
project by another author.
```

**短描述（中文版）**
```
XIsland 把 macOS 刘海变成 AI 编程代理的控制台。同时跑多个 Claude Code、Codex、
Gemini CLI、Cursor、Windsurf 会话时，权限请求、代理提问、任务状态全部汇聚到刘海
面板，可以原地批准或拒绝，一键跳回对应终端标签页。原生 Swift，非激活窗口，不抢
编辑器焦点。本地通信，无云端、无账号、无遥测。免费。

说明：本产品是 Meteor Store（imagentx.top）独立开发的 XIsland，与 xisland.app
（另一位作者的同类项目）无关。
```

**差异化要点（用于长描述或补充字段，均已在 README 中核实）**
- **30 条集成路线**，覆盖 Claude Code、Codex、Gemini CLI、OpenCode、Cursor、
  Windsurf、Cline、Aider、Roo Code、Continue、Cody、Trae、Qoder、Kiro、Amp、
  Pi、Devin、Amazon Q、Tabnine、GitHub Copilot CLI、VS Code Copilot、Zed、
  JetBrains AI/Junie、Kimi Code、Qwen Code、DeepSeek-TUI、Factory Droid、
  CodeBuddy Code 等
- **五语言界面**：中文 / 英文 / 韩文 / 日文 / 法文
- **配额追踪**：可查 Kimi / DeepSeek / GLM API 余额
- **SSH 远程管理**：可在面板内连接并监控远程服务器
- **审批上下文图谱**：审批前查看任务、计划、文件变更与变更理由，含轮次 diff
- **审批图谱 MCP**：代理可提议本地任务节点，用户逐个保留或丢弃；**不授予任何命令、文件或审批权限**
- **发布包附 SHA-256 校验文件**
- **子代理嵌套显示**、**正则静音规则**、**iTerm2 tab 级跳转**

**⚠️ 表述纪律（必须遵守）**
README 对多数集成的状态是「Contract tests passed; real client verification pending」
（契约测试通过、真机验收待完成），只有 Claude Code 已验证到「isolated native Read
and island denial verified」。**对外文案不得把「契约测试通过」写成「已完整支持」**。
推荐措辞：「30 条集成路线，其中 N 条已通过契约测试」。

**分类**：Developer Tools / AI Developer Tools（**不要选 Productivity**，多数拒绝都因分类错）

**素材**（三件套，来源见 `发布包-2026-11-05/图`）：
- logo：正方形，透明底
- 截图：产品使用中的真实界面（不要空状态）
- 宽幅 banner：1200×630

**定价表述**：限时免费，领永久激活码；不领码可试用 14 天。
**必须注明**：需注册才能领码；有中文界面。

## 七、执行顺序（已按撞名事实重排）

1. **先发邮件给 UStack**（`contact@ustack.app`）说明情况：
   说明本站产品与已收录的 `xisland.app` 是**两个不同项目**，请求新增独立条目。
   这是唯一有明确人工通道的站，值得优先做。
2. **提交 4 个入口已实测可达的站**：ProductCool、AI Toolz Dir、Toolfio、Wayfindio。
3. **Product Hunt 留到 star 数上来之后**——它是一次性资源，现在发浪费。
4. **每提交一个，立刻记录条目 URL 并抓取 `rel` 属性**，确认是否 dofollow。
   否则半年后不记得投过哪些，重复提交会被当 spam。
5. **不要碰 mergeek.cn**（竞品条目 + 302 降级）。

## 八、预期收益（诚实版，已剔除错误前提）

原文档引用「一次投 14 个目录站，30 天后 9 个上线，总直接流量 340 次访问、2 个注册」。
这个数字**仍然可用**（它是同类案例的参考值），但要注意：

- **本站没有「已有条目」可以搭便车**，一切从零开始，周期比原估更长
- **撞名会让审核更慢**：审核者可能把本站条目当成 `xisland.app` 的重复提交而拒掉，
  所以文案里的「与 xisland.app 无关」声明不是可选项，是必需项
- **收益仍然是外链信号，不是下载量**。参考案例里 referring domains 从 6 涨到 19、
  三个月后自然搜索涨约 40%，那才是真正的收益来源

对 meteor-store 的意义：**这是解决「站点权重低」的少数可控手段之一**，
但别指望它带来下载量，下载量要靠 V2EX / linux.do 那种精准社区。

## 九、待确认（2026-11-13 更新）

- ~~`toolstory.ai` 返回 301，新路径是否还在收录~~
  → **已解决**：`/tools/97064/xisland/` 返回 200，但**条目属竞品**，无补全入口
- ~~条目是自动抓取还是有人提交的~~
  → **已解决**：toolstory.ai 与 hunted.space 是自动抓取产物（信息全部来自 `xisland.app`）。
    **但抓的是竞品的站**，所以「系统性搜自动收录站」这个方向对本站无意义——
    那些站抓的是 `xisland.app`，不会自动抓到本站。
- **新增待确认**：上表标「dofollow」的站（Toolfio / Wayfindio 等）是否真的 dofollow？
  第三方整理的数据未必准确，**需提交后实测**。
- **新增待确认**：clauday.com 那篇评测文章写的是本站产品还是竞品？
  若是竞品，也不存在「认领」可能。

## 十、与 GEO 的关系（2026-11-12 补充）

补 schema（`SoftwareApplication` + `BreadcrumbList`）与做目录站，解决的是**两件不同的事**：

| 手段 | 解决什么 | 见效速度 |
|---|---|---|
| 结构化数据 | 让 AI 与搜索引擎**准确理解**页面是什么（价格、平台、版本、层级） | 慢，但一次做完长期有效 |
| 目录站外链 | 提升**站点权重**，让页面在竞争词里有排名 | 慢，且不直接带来下载量 |

**两者都不解决「没人」的问题。** 当前基线（30 天商品页 28 次访问、下载 1 次、注册 14）说明
瓶颈在**分发**而非可见性——AI 爬虫 34 天内已抓取 3 万余次且 99.3% 成功，
通道完全畅通。真正带来下载的是 V2EX / linux.do 那种精准社区，不是目录站。

## 十一、最该先做的事：撞名

比提交目录站更根本的问题是**品牌撞名**（详见 `xisland-differentiation.md`）：

- 竞品占着 2015 年注册的 `xisland.app` 老域名、早 35 天建仓、17 stars（本站 1）
- 搜品牌词 "XIsland" 时用户先看到竞品
- 目录站生态里本站产品**完全不存在**（三个检索式均搜不到）

**本站能打的是集成广度**：30 条集成路线 vs 竞品 4 个代理；
版本 2.0.18 持续迭代 vs 竞品停在 0.18.0 五个月未更新。
文案应围绕这个差异，而不是拼品牌名。
