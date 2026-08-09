# Meteor Store 帮助中心重定位 · 设计文档

日期：2026-08-09  
状态：待实现

## 1. 背景与目标

当前 `/docs` 按产品分类重复展示产品名称、平台、简介和少量快速上手信息，卡片标题与“详情”最终仍跳回产品详情页。产品页已经承载快速上手、下载、截图、试玩和功能说明，因此 `/docs` 作为“产品目录副本”没有清晰的独立职责。

本次将 `/docs` 重新定位为面向用户的“帮助中心”：官方从 `/feedback` 收到的问题中筛选有普遍价值的内容，脱敏、核实并整理成静态帮助文章后发布。帮助内容不自动公开用户原文，也不改造反馈数据库或管理后台。

成功标准：

1. 用户可以从帮助中心按主题找到问题，并直接进入有稳定 URL 的独立答案页。
2. 首版发布 6 篇与站内真实交付流程一致的帮助文章。
3. 帮助文章可持续用 Markdown 维护，并允许后续加入截图指引。
4. 站内搜索与 sitemap 能发现每篇独立文章。
5. 没找到答案的用户可以进入现有反馈表单，并默认选择“问题”。

## 2. 范围与非目标

### 2.1 本次范围

- 重做 `/docs` 帮助中心首页。
- 新增 `/docs/[slug]` 独立帮助文章页。
- 新增 6 篇中英文静态帮助文章。
- 新增浏览器安全的帮助文章元数据源和服务端 Markdown 读取层。
- 同步 Header、Footer、首页帮助入口、Spotlight 搜索和 sitemap。
- 让 `/feedback?type=question` 预选反馈类型。
- 补充数据、搜索、sitemap 与内容约束测试。

### 2.2 非目标

- 不把用户反馈自动公开。
- 不新增官方回答、公开状态等数据库字段。
- 不给反馈管理后台增加文章发布器或富文本编辑器。
- 不删除或迁移首页 FAQ；帮助中心允许复用其中有价值的问题和答案。
- 不新增帮助中心全文搜索框。首版只有 6 篇，分类索引与现有 Spotlight 搜索足够。
- 不为每个产品建立完整使用手册，也不把产品详情页内容复制进帮助中心。
- 首版不制作截图，只预留稳定的图片组织与渲染方式。

## 3. 信息架构

### 3.1 帮助中心首页 `/docs`

首页不再读取或展示 `products`。页面结构为：

1. 眉标“Help Center”与主标题“帮助中心”。
2. 简短说明：这里收录用户常见问题和 Meteor Store 的官方解答。
3. 四个主题分区：
   - 安装与下载
   - 账户与授权
   - 购买与交付
   - 售后与支持
4. 每篇文章以可点击条目展示标题、摘要、更新时间和箭头。
5. 页面底部显示“没有找到答案？”行动区，链接到 `/feedback?type=question`。

首页直接承担全部文章的索引职责，不再额外新增 `/docs/questions` 集合页。

### 3.2 独立文章页 `/docs/[slug]`

详情页采用普通暗色正文，不给长文套玻璃卡片。结构为：

1. “帮助中心 / 分类 / 当前文章”的面包屑。
2. 分类、更新时间、文章标题和摘要。
3. Markdown 正文，支持标题、段落、步骤列表、链接、代码和图片。
4. 同分类相关问题，最多 3 篇。
5. “仍未解决？”行动区，链接到 `/feedback?type=question`。
6. 返回帮助中心入口。

未知 slug 使用 `notFound()` 返回 404，不回退到其他语言或相似文章，避免用户误以为打开了正确答案。

### 3.3 导航文案

- Header：`文档 / Docs` 改为 `帮助 / Help`。
- Footer：`文档 / Documentation` 改为 `帮助中心 / Help Center`。
- 首页及 Playground 中原来指向 `/docs` 的按钮保留 URL，但文案改为“查看帮助”“阅读帮助”等符合上下文的表达。
- `/docs` URL 保持不变，不做重定向，已有外链继续有效。

## 4. 内容模型与文件组织

### 4.1 元数据清单

新增浏览器安全的 `src/data/help-articles.ts`，用 TypeScript 保存所有文章的共享元数据：

```ts
type HelpCategory = 'installation' | 'account' | 'purchase' | 'support';

interface HelpArticleMeta {
  slug: string;
  category: HelpCategory;
  order: number;
  updatedAt: string;
  title: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  keywords: { zh: string[]; en: string[] };
}
```

元数据清单是标题、摘要、分类、排序、更新时间和搜索关键词的唯一数据源。它不导入 Node.js `fs`，因此 `/docs` 首页、Spotlight 客户端搜索和服务端路由都能安全复用。

设计讨论中原计划把这些字段写入 Markdown frontmatter；最终改为独立元数据清单，是因为现有 Spotlight 搜索运行在客户端，不能导入使用 `fs` 的 Markdown 加载器。避免为 6 篇文章引入生成脚本，也避免手写清单与 frontmatter 保存两份相同数据。

### 4.2 Markdown 正文

正文按语言与 slug 存放：

```text
content/help/
  zh/
    macos-cannot-open-app.md
    get-product-after-purchase.md
    use-license-key.md
    product-updates.md
    refund-policy.md
    technical-support.md
  en/
    ...同名 6 篇
```

Markdown 文件只保存正文，不再重复元数据。新增 `src/data/help.ts` 作为仅服务端使用的加载层，提供：

- `getHelpArticles(locale)`：返回本地化文章摘要列表，不读取正文。
- `getHelpArticle(locale, slug)`：读取并返回单篇 Markdown 正文。
- `getRelatedHelpArticles(locale, article)`：返回同分类的最多 3 篇相关文章。

slug 取自元数据清单，并直接决定 Markdown 文件名与路由地址。

### 4.3 图片指引

后续官方截图按文章存放：

```text
public/help/{slug}/image-name.webp
```

Markdown 使用站内绝对路径引用：

```md
![“隐私与安全性”中的“仍要打开”按钮](/help/macos-cannot-open-app/open-anyway.webp)
```

约束：

- 优先使用 WebP，控制尺寸，避免帮助页面加载超大原图。
- 每张承载信息的图片必须有非空替代文本。
- 截图只是辅助，关键操作步骤必须同时用文字表达。
- 图片随正文宽度响应式缩放，不固定超出正文栏的宽度。
- 首版不新增上传后台；官方截图直接随代码版本管理。图片明显增多后再评估迁移到 R2。

## 5. 首版文章内容

### 5.1 macOS 下载后无法打开

slug：`macos-cannot-open-app`

- 解释 Gatekeeper、开发者签名和 Apple 公证，不把问题简单归因于“没有上架 App Store”。
- 用户先尝试打开 App 一次，再进入“系统设置 → 隐私与安全性 → 安全性 → 仍要打开”。
- 说明按钮只会在尝试打开后的一段时间内出现。
- 不指导关闭 Gatekeeper、开启“任何来源”或执行 `xattr`、`spctl --master-disable` 等绕过命令。
- 如果提示“App 已损坏”或“将损害电脑”，不要继续绕过；应重新下载并联系支持。
- 链接 Apple 官方《在 Mac 上安全地打开 App》：`https://support.apple.com/zh-cn/102445`，英文页使用对应英文地址。
- 帮助文章是异常排查，不替代项目对 macOS 安装包签名与公证的发布要求。

### 5.2 购买后如何获取产品

slug：`get-product-after-purchase`

- 引导检查支付成功页、确认邮件、订单记录和账户中心。
- 站内应用从“我的产品”打开；安装包从对应产品页的下载区获取。
- 授权识别使用购买时相同且已验证的邮箱账户。
- 支付后超过 24 小时仍未收到交付信息时，链接技术支持和退款政策。

### 5.3 如何使用授权码

slug：`use-license-key`

- 授权码可在确认邮件、订单详情和账户中心查看。
- 站内应用与门控下载由登录账户自动识别授权，不虚构不存在的统一激活输入框。
- 只有具体产品自身提示时才输入授权码。
- 不展示真实授权码示例，不要求用户在反馈中提交完整授权码，并提醒不要公开分享。

### 5.4 如何获取产品更新

slug：`product-updates`

- 引导从对应产品页确认和获取当前可用版本。
- 不承诺项目尚未实现的自动更新或更新通知。
- 说明一次性购买通常包含由官方决定提供的免费小版本更新，大版本可能另行收费；最终以产品页和 EULA 为准。

### 5.5 如何申请退款

slug：`refund-policy`

- 只摘要说明退款条件，`/refund` 是最终完整政策。
- 引导用户提供订单号、购买邮箱、产品名和问题描述。
- 不要求提供密码或完整授权码。
- 不在帮助文章中创造比现有退款政策更宽或更窄的新承诺。

### 5.6 如何联系技术支持

slug：`technical-support`

- 引导进入 `/feedback?type=question`。
- 建议附上产品名、系统与版本、错误原文、复现步骤以及已尝试的方法。
- 提醒隐藏密码、完整授权码和其他敏感信息。
- 保留公开联系邮箱作为表单不可用时的备用方式。

## 6. 数据流

### 帮助中心首页

1. 服务端页面从浏览器安全的元数据清单读取文章。
2. 按当前 locale 本地化标题、摘要和关键词。
3. 按固定分类与 `order` 排序渲染。
4. 不读取 Markdown 正文，不向客户端发送全部文章内容。

### 帮助文章页

1. `generateStaticParams` 从元数据清单生成 `locale × slug`。
2. 页面用 locale 与 slug 查元数据并读取对应 Markdown。
3. 复用 `markdownToHtml` 进行 GFM 转换、外链安全属性补充与 sanitize。
4. 页面生成标题、摘要和 canonical/语言替代元数据。
5. 同分类元数据用于渲染相关文章。

### Spotlight 搜索

1. 客户端搜索只导入 `help-articles.ts`，不导入 `fs` 或 Markdown 正文。
2. 每篇文章生成一个 `帮助` 分组条目。
3. 搜索字段包含本地化标题、摘要和关键词。
4. 结果直接指向 `/docs/{slug}`。
5. 原 `page-docs` 条目改名为“帮助中心”，继续作为默认热门入口。

### 反馈入口

1. 文章或帮助首页链接到 `/feedback?type=question`。
2. Feedback 页面读取查询参数，仅接受现有允许值。
3. 合法的 `question` 作为 `FeedbackForm` 初始类型；非法值忽略并保持空选择。
4. 提交仍走现有 `/api/feedback`，限流、净化、数据库和后台处理逻辑不变。

## 7. SEO 与可访问性

- `/docs` 保持现有 sitemap 条目，页面名称和描述改为帮助中心语义。
- sitemap 自动为每篇文章生成中英文 URL 与语言替代地址，`lastModified` 使用 `updatedAt`。
- 文章页 `generateMetadata` 使用本地化标题与摘要。
- 每页只有一个 `h1`，正文标题从 `h2` 开始。
- 面包屑、分类和更新时间使用语义化元素。
- 所有可点击文章条目具有清晰焦点态，整张条目只有一个主要链接。
- 外链由现有 Markdown 管线添加 `noopener noreferrer`。
- 图片不能承担唯一信息来源，替代文本描述操作目标而不是写“截图”。
- 正文文字对比度不低于项目规定的 `white/60`。
- 长文正文不使用玻璃背景。

## 8. 异常与边界

- 元数据 slug 重复、日期格式非法、分类不在允许集合、排序重复或缺少任一语言正文时，测试失败并阻止上线。
- Markdown 正文为空时视为配置错误，不渲染空文章。
- 未知 slug 返回 404。
- 某个分类暂时没有文章时，不渲染空分区。
- 帮助文章与站内行为冲突时，以实际代码与法律页面为准，并在同一次变更中修正文档；不允许用帮助文档掩盖缺失交付物或未签名安装包。
- 用户反馈中含个人信息时，整理文章必须改写、脱敏，不引用邮箱、订单号、授权码或可识别原句。
- macOS 安全警告文案随系统版本变化时，优先核对 Apple 官方支持页面再更新步骤。

## 9. 测试与验证

### 9.1 自动化测试

- 元数据清单包含 6 个首版 slug，slug 唯一且格式合法。
- `category`、`order`、`updatedAt`、中英文标题、摘要和关键词完整合法。
- 每个 slug 都存在 `zh` 与 `en` Markdown，且正文非空。
- Markdown 中的本地图片路径必须以 `/help/{slug}/` 开头，图片文件真实存在。
- Markdown 图片的替代文本不能为空。
- 帮助文章能进入 Spotlight 的 `帮助` 分组，搜索结果指向独立详情页。
- `page-docs` 标题与关键词更新为帮助中心语义。
- sitemap 包含全部 `locale × slug`，语言替代地址正确，更新时间来自元数据。
- 反馈类型查询参数只接受现有允许值，`question` 能成为默认值。
- 现有 Markdown XSS 回归测试继续全部通过。

### 9.2 工程验证

```bash
pnpm exec tsc --noEmit
pnpm exec eslint src
pnpm test
pnpm build
```

### 9.3 手动验证

- 检查 375、768、1280px 下帮助首页与文章页，无横向溢出。
- 用键盘依次访问导航、文章条目、面包屑和反馈入口，焦点清晰。
- 切换中英文，确认 slug 稳定、正文与元数据均切换语言。
- 从 Spotlight 搜索 6 个问题，确认直接进入正确文章。
- 打开 `/feedback?type=question`，确认默认类型正确且仍可修改。
- 检查 Apple 外链、站内政策链接和相关文章链接。
- 后续加入图片时，额外检查窄屏缩放、替代文本及图片加载失败时的可理解性。

## 10. 预计改动范围

新增：

- `src/data/help-articles.ts`
- `src/data/help.ts`
- `content/help/zh/*.md`
- `content/help/en/*.md`
- `src/app/[locale]/docs/[slug]/page.tsx`
- 帮助内容与索引相关测试

修改：

- `src/app/[locale]/docs/page.tsx`
- `src/app/[locale]/feedback/page.tsx`
- `src/app/[locale]/feedback/FeedbackForm.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`
- `src/components/CTASection.tsx`
- `src/components/PlaygroundTabs.tsx`
- `src/lib/search-index.ts`
- `src/app/sitemap.ts`
- `messages/zh.json`
- `messages/en.json`

不修改数据库 schema、反馈 API、管理员反馈后台、产品数据、产品详情页和全局主题规则。
