# 第三方目录站清单（2026-11-05 调研）

> 目的：把「别人排在我们前面」的目录站变成自己的分发渠道。
> 结论先放前面：**XIsland 已经被 5 个以上目录站自动收录了，缺的不是"提交"，是"提交得更全 + 认领已有条目"。**

## 一、先纠正一个判断

原判断是「toolstory.ai / ustack.app 排在自家站前面，要去提交它们」。

实测后发现两件事：

1. **它们已经收录了 XIsland**，而且是从 `xisland.app`（独立官网，Cloudflare 托管，不在 meteor-store 仓库里）抓的
2. 这些页面本身在搜索里有排名，等于**替我们在抢品牌词**——但它们也给外链，所以是净正面

已确认收录的第三方页面：

| 站点 | 页面 | 状态 |
|---|---|---|
| ustack.app | `/zh-CN/products/xisland` | 200，含完整 FAQ、Pros/Cons |
| hunted.space | `/product/x-isiand` | 200，带用户评论 |
| toolstory.ai | `/tools/97064/xisland` | 301（路径变了，需重新确认） |
| mergeek.cn | `/projects/KvEVrAKYGRlm7POx/official_site` | 200，中文目录站 |
| clauday.com | `/article/f8f7e255-...` | 200，原创评测文章 |

**所以第一优先级的动作不是"提交"，是"认领 + 补全已有条目"**：
把 logo、截图、定价、中文描述补齐，让这些页面从"抓来的粗糙条目"变成"信息完整的官方条目"。

## 二、提交清单（按 ROI 排序）

### P0：免费 + dofollow 外链 + 审核快

| 站点 | 提交入口 | 成本 | 审核 | 备注 |
|---|---|---|---|---|
| UStack | `contact@ustack.app` 或官网提交表单 | 免费 | 每日审核 | 已收录，联系补全信息即可 |
| Toolfio | 站内提交 | 需页脚挂 badge | 3-5 天 | DR 61，dofollow |
| Wayfindio | 站内提交 | 需页脚挂 badge | 1-2 天 | DR 51，dofollow |
| AI Toolz Dir | 站内提交 | 需站内挂文本链接 | 1-2 天 | DR 68 |
| Launch Llama | `tools.launchllama.co` | 需给 5 个工具点赞 + 挂 badge | 约 4 周 | DR 67，背后有 6.5 万订阅的 newsletter |
| ProductCool | `productcool.com/submit` | 免费 | 24-48 小时 | 审核最快 |
| FreeAIO | `freeaio.com/submit-ai-tool` | 免费 | 未注明 | 聚焦免费工具，与"限时免费"定位契合 |

**关于页脚 badge**：多个目录要求挂它们的 badge 换免费 dofollow。**别全挂**——
页脚挂五个 badge 本身就是在损害自己的页面。挑 DR 最高、流量最实的 2-3 个。

### P1：有流量但要花钱或条件

| 站点 | 成本 | 说明 |
|---|---|---|
| There's An AI For That | 付费 | DR 77，AI 目录里搜索流量最大，"AI for X" 类查询必争 |
| Product Hunt | 免费 | DR 91，但**一次性机会**——需要 5 图 + 完整素材 + 英文化，建议等 star 数上来再发 |
| Futurepedia | 免费但审核严 | DR 78，按分类浏览 |
| AlternativeTo | 免费 | 非 AI 专用，但"alternative to XXX" 搜索量大，权重高（2009 年至今） |
| Uneed | 免费 | DR 75，有日榜周榜 |
| SaaSHub | 免费 | 对"X vs Y"对比类搜索排名好 |

### P2：性价比低或暂不做

| 站点 | 原因 |
|---|---|
| ToolDirectory.AI | 要按月订阅才能"被考虑"，DR 仅 47 |
| Appscribed | 无免费通道 |
| MicroLaunch / EarlyHunt | 免费通道要等数月，或 dofollow 只给赢家 |
| G2 / Capterra | 面向企业采购，与个人开发者工具定位不符；但**如果之后做团队版**值得回来做 |

## 三、提交物料（写一次，所有站复用）

按目录站的实际要求准备，避免每个站重写：

**一句话（40 字内）**
```
macOS 刘海面板，统一监控并批准 Claude Code、Codex、Gemini CLI 等 AI 编程代理的权限请求。
```

**短描述（150 字内）**
```
XIsland 把 macOS 刘海变成 AI 编程代理的控制台。同时跑多个 Claude Code、Codex、
Gemini CLI 会话时，权限请求、代理提问、任务状态全部汇聚到刘海面板，可以原地批准或
拒绝，一键跳回对应终端标签页。原生 Swift，非激活窗口，不抢编辑器焦点。本地通信，
无云端、无账号、无遥测。免费。
```

**分类**：Developer Tools / AI Developer Tools（**不要选 Productivity**，多数拒绝都因分类错）

**素材**（三件套）：
- logo：正方形，透明底
- 截图：产品使用中的真实界面（不要空状态）
- 宽幅 banner：1200×630

**定价表述**：限时免费，领永久激活码；不领码可试用 14 天。
**必须注明**：需注册才能领码；有中文界面。

## 四、执行顺序

1. **先联系 UStack**（已有条目，补全成本最低）
2. **提交 3 个免费 dofollow**：ProductCool、AI Toolz Dir、Toolfio
3. **Product Hunt 留到 star 数上来之后**——它是一次性资源，现在发浪费
4. **记录每个已上线的 URL**，否则半年后不记得投过哪些，重复提交会被当 spam

## 五、预期收益（诚实版）

参考同类案例：一次投 14 个目录站，30 天后 9 个上线，**总直接流量 340 次访问、2 个注册**。

**目录站不买客户，买的是外链信号。** 同一个案例里，referring domains 从 6 涨到 19，
三个月后自然搜索流量涨约 40%——那才是真正的收益来源。

对 meteor-store 的意义：**这是解决"站点权重低"的少数可控手段之一**。
但别指望它带来下载量，下载量要靠 V2EX / linux.do 那种精准社区。

## 六、待确认

- `toolstory.ai/tools/97064/xisland` 返回 301，需确认新路径是否还在收录
- 这些目录站的条目是自动抓取还是有人提交的？**如果是自动抓取，说明还有一批站会自动收录，
  值得系统性搜一遍**（用 `"XIsland" -site:imagentx.top -site:xisland.app` 之类的方式）
