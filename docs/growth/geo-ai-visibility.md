# GEO / AI 可见性现状（2026-11-12 首次系统性诊断）

> 目的：回答「SEO 和 GEO 重要吗、怎么让站点被搜索引擎和 AI 回答推荐」。
> 结论先放前面：**基础盘比预期好得多，通道完全畅通，问题不在"被看到"而在"被引用"。**

## 一、核心事实：AI 爬虫在大量抓取，没有任何拦截

用站点级日志统计（`/var/log/nginx/meteor-store/imagentx.top.access.log*`，
全量 `zcat`），34 天累计命中：

| 爬虫 | 次数 | 类型 |
|------|------|------|
| GPTBot | 22,374 | 训练语料 |
| OAI-SearchBot | 7,091 | **检索（决定 ChatGPT 搜索引不引你）** |
| ClaudeBot | 2,282 | 训练语料 |
| Amazonbot | 1,492 | 训练语料 |
| Claude-User | 539 | 用户触发 |
| Applebot | 387 | 检索 |
| ChatGPT-User | 200 | 用户触发 |
| PerplexityBot | 148 | **检索** |

状态码：**31,552 × 200**（99.3%）、166 × 307、90 × 404、77 × 500、6 × 502。

**nginx 配置里搜不到任何爬虫 UA 拦截规则**（`grep -rn "GPTBot\|ClaudeBot\|Bytespider..." deploy/` → 0 命中）。

### 抓取量最大的路径（颠覆原有判断）

| 路径 | 次数 |
|------|------|
| `/en/pathfinder/opportunities` | 2,416 |
| `/zh/pathfinder/opportunities` | 2,276 |
| `/en/pathfinder/plan` | 1,569 |
| `/zh/pathfinder/plan` | 1,345 |

**pathfinder 的聚合页（机会 / 规划）才是 AI 最感兴趣的内容**，超过博客和产品页。
注意这与「pathfinder 条目低质该收口」不矛盾——被 noindex 的是**条目详情页**
（`learningEligible=false` 的 104 字符摘要转载），聚合页是另一回事，两者要分开评估。

### 77 个 500 已消失（历史问题）

全部集中在 `/zh/blog/tag/*` 与 `/en/blog/tag/*`，是 Amazonbot 在 11-06 抓到的。
11-12 线上抽查 AI / 情感 / 关系 / essay 四个标签页均 200。**已修复，非现行问题。**

## 二、已具备的基础设施（不要重做）

- `src/app/robots.ts`：通配符 `Allow: /` → **等于对所有 AI 爬虫默认放行**，
  不需要逐个 UA 分组。刻意不加 UA 规则：加了反而容易在将来误封检索型爬虫
- `src/app/sitemap.ts`：动态路由，线上 398 条，pathfinder 占比已从 81% 收到 34%
- `[locale]/layout.tsx`：`Organization`（含 `@id`、logo、contactPoint）+ `WebSite`（含 publisher 引用）
- `blog/[slug]`：`BlogPosting`；`blog/p/[id]`：`BlogPosting`
- `docs/[slug]`：按 `article.kind` 输出 `FAQPage` / `HowTo`
- `src/lib/seo.ts` 的 `safeJsonLd()`：转义 `<` `>` `/`，防 `</script>` 注入
- IndexNow（`src/lib/search-ping.ts` + `/indexnow-key.txt` 路由）：Bing / Yandex / 百度
- `buildAlternateUrls()`：处理 www/非 www + zh/en 四地址的 canonical 与 hreflang

## 三、2026-11-12 补上的缺口

### 新增 `src/lib/structured-data.ts`

把 schema 构造集中起来（而不是散在页面里），理由是**可单测**：
schema 字段拼错、价格类型写成数字、`@id` 引用对不上，在浏览器里看不出来，
只有搜索引擎静默忽略。测试见 `src/lib/__tests__/structured-data.test.ts`（10 项）。

| 构造器 | 用途 |
|--------|------|
| `buildProductSchema()` | 产品页 `SoftwareApplication` + `Offer` |
| `buildBreadcrumbSchema()` | 面包屑 `BreadcrumbList` |

### 产品页补 `SoftwareApplication`

实测输出（`/zh/products/xisland`）：

```json
{
  "@type": "SoftwareApplication",
  "@id": "https://www.imagentx.top/zh/products/xisland#software",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "macOS",
  "softwareVersion": "2.0.15",
  "codeRepository": "https://github.com/Meteorkid/XIsland",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CNY" },
  "publisher": { "@id": "https://www.imagentx.top/#organization" }
}
```

三个关键设计决策：

1. **绝不输出 `aggregateRating` / `review`** —— 本站没有真实评分数据，
   编造分数构成垃圾结构化数据（spammy structured markup），
   惩罚是整站富媒体结果资格被撤。有测试钉住这一点
2. **`operatingSystem` 只认操作系统白名单前缀** —— `platforms` 是给人看的展示标签，
   混着 `CLI`、`Menu Bar`、`Three.js`。直接塞进 `operatingSystem` 会声明成
   `operatingSystem: CLI`，这是错信息，比不写更糟。认不出就整体省略该字段
3. **`showPricing` 关闭时不下发 `offer`** —— 声明一个页面上不存在的价格，
   属「结构化数据与可见内容不符」，是明确会被处罚的情形

`softwareVersion` 取自 `getProductWithCurrentDownloads()`（线上目录真源），
**不是源码兜底值**，所以反映的是用户实际拿到的包版本。

### 面包屑覆盖三处

| 页面 | 层级 |
|------|------|
| `products/[id]` | 首页 → 产品 → 产品名 |
| `blog/[slug]` | 首页 → 博客 →〔分区〕→ 文章标题 |
| `blog/p/[id]` | 同上，但地址指向**源语言**（与 canonical 一致） |
| `docs/[slug]` | 首页 → 帮助 → 分类 → 文章 |

- 层级文字复用 `Header` 命名空间的译名，**不另写一套**——两处不同步就是结构化数据在说谎
- docs 的分类在首页是锚点区块而非独立路由，所以用 `/docs#<categoryId>`，
  不能指向一个 404 的 `/docs/category/xxx`
- 无分区文章少一层，不硬凑空层

### 新增 `/llms.txt`

`src/app/llms.txt/route.ts`，从真实数据推导（产品 / 分区 / 文档），
不手工维护——手工清单必然漂移，而漂移的 llms.txt 比没有更糟。

**诚实预期**：截至 2026-11，**没有任何主流大模型厂商确认在生产回答链路读取该文件**，
Google 官方明确说不需要它。它**不是引用杠杆**，价值是「成本极低、面向 agent 的前瞻性投入」
（IDE 助手、MCP server、浏览器 agent 会当作机器可读索引）。优先级低于结构化数据。

放在顶层而不是 `public/`：`.txt` 已在 `proxy.ts` 的 matcher 白名单里
（`indexnow-key.txt` 线上 200 印证了这个模式），不会被 next-intl 重定向到 `/zh/`。

## 四、诚实结论：瓶颈是「没人」，不是「排名差」

补 schema 与做目录站解决的是**「当有人已经在找的时候，你能不能出现」**。
但当前基线（30 天）：商品页 28 次访问、`/api/download` 1 次、`/api/claim` 0 次、
注册用户 14。

**两者都不解决"没人"。** 真正带来下载的是 V2EX / linux.do 那种精准社区分发。
schema 是应该做的（成本低、一次做完长期有效），但别指望它带来流量。

## 五、维护要点

- **判断 AI 爬虫可见性只看站点级日志**（`/var/log/nginx/meteor-store/`），
  `/var/log/nginx/access.log` 只有 non-www→www 的 301，照它统计会误判
- **AI 爬虫 UA 会嵌在完整 Chrome UA 字符串里**（Amazonbot 就是），
  所以 `grep -i` 关键词统计可行；但**不要用 UA 判断真人 PV**（扫描器会伪造 UA）
- **查 schema 必须抓线上 HTML 解析，不能只看源码** —— layout 注入的块会混进来，
  且 `grep -c 'ld+json'` 数的是行不是块（多行 script 会误判）。
  正确姿势：Python 正则提取 `<script type="application/ld\+json">(.*?)</script>` 再 `json.loads`
- **新增 schema 后跑 `npx vitest run`**：`structured-data.test.ts` 会校验字段口径，
  `ex-memory-product-positioning.test.tsx` 会因 mock 不全而暴露「产品页引用了新常量」这类问题
