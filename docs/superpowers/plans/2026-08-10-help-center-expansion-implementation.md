# Meteor Store 帮助中心扩展 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有 6 篇问题型帮助文章扩展为包含 26 篇中英文教程、5 条新手路径、独立搜索、文章目录和反馈闭环的完整帮助中心。

**Architecture:** 保留“浏览器安全元数据 + 服务端 Markdown 正文”的现有边界。首页只接收当前语言、当前可见文章的摘要索引；详情页在服务端安全渲染 Markdown、生成目录并补充本地截图尺寸。`SHOW_PRICING` 通过同一个纯函数控制首页、路径、搜索、详情、Spotlight、静态参数和 sitemap。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、next-intl、Tailwind CSS 4、unified/remark/rehype、Sharp、Vitest。

## Global Constraints

- 设计依据：`docs/superpowers/specs/2026-08-10-help-center-expansion-design.md`。
- 保留 `/docs` 和现有 6 个 slug，不做重定向或 URL 迁移。
- 最终必须有 26 个 slug、52 份非空 Markdown；中英文事实和标题层级等价。
- 首页 FAQ 的可见内容、顺序和布局保持不变，只抽取共享数据。
- 浏览器模块不得导入 `fs`、`path`、Sharp 或其他 Node API；首页不得读取 Markdown 正文。
- `SHOW_PRICING=false` 时，两篇商业文章不得出现在任何索引中，直接访问返回 404。
- 不增加新依赖；使用项目已有 `pinyin-pro`、Sharp 和 unified 插件。
- 不修改数据库 schema、反馈 API、支付、授权、产品数据或博客审核状态机。
- macOS 教程不得指导关闭 Gatekeeper、开启“任何来源”或运行 `xattr`、`spctl --master-disable`。
- 截图必须来自真实界面并脱敏；没有安全测试状态时停止该截图，不创建生产测试数据。
- 所有 hover 位移只在 `@media (hover: hover) and (pointer: fine)` 生效；reduced motion 同时关闭 transition、transform 和平滑滚动。
- 当前工作区已有博客发布 API 改动。每次修改重叠文件前重读最新 diff，只应用帮助中心相关块。
- 仓库规则优先于上游 skill：本计划记录每个逻辑提交边界，但实现代码在用户最终确认前不执行 `git commit`；本次只有计划文档提交已获授权。

---

## File Structure

### 数据与搜索

- `src/data/help-articles.ts`：分类、文章、路径元数据；本地化、可见性和路径纯函数。
- `src/data/help.ts`：仅服务端读取 Markdown；显式相关文章与分类回退。
- `src/data/faqs.ts`：首页和帮助中心共用的双语 FAQ 数据。
- `src/data/help-search.ts`：客户端安全的搜索类型、打分和排序，不生成拼音。
- `src/data/help-search.server.ts`：仅服务端用 `pinyin-pro` 生成当前语言搜索索引。

### 渲染与组件

- `src/lib/markdown.ts`：现有通用安全 Markdown 管线；只抽取最小共享 builder，保持 `markdownToHtml()` 输出兼容。
- `src/lib/help-markdown.ts`：仅服务端的帮助标题、目录、外链提示和截图尺寸插件。
- `src/components/help/HelpCenterSearch.tsx`：唯一需要客户端状态的帮助首页搜索组件。
- `src/components/help/HelpJourneyGrid.tsx`：服务端渲染 5 条路径卡片。
- `src/components/help/HelpPopularFaqs.tsx`：服务端传入数据、客户端使用原生 `<details>` 的热门 FAQ。
- `src/components/help/HelpArticleLibrary.tsx`：服务端渲染六个纵向分类及文章列表。
- `src/components/help/HelpArticleToc.tsx`：服务端渲染桌面目录和移动 `<details>`。

### 页面与集成

- `src/app/[locale]/docs/page.tsx`：组合搜索、路径、FAQ、分类和反馈入口。
- `src/app/[locale]/docs/[slug]/page.tsx`：详情、目录、路径进度、相关文章、SEO 和 JSON-LD。
- `src/app/[locale]/feedback/page.tsx`、`FeedbackForm.tsx`：从白名单文章生成安全预填内容。
- `src/lib/search-index.ts`：Spotlight 复用 FAQ 和可见帮助元数据。
- `src/app/sitemap.ts`：为可见帮助文章生成本地化 URL。
- `messages/zh.json`、`messages/en.json`：帮助 UI 与反馈预填文案；只修改相关 namespace。
- `src/app/globals.css`：帮助页响应式、精细指针 hover 和 reduced-motion 规则。

### 内容、图片与测试

- `content/help/{zh,en}/{slug}.md`：26 篇双语正文。
- `public/help/{slug}/{shared|zh|en}/*.webp`：9 个关键流程的真实截图。
- `src/data/__tests__/help.test.ts`：元数据、正文配对、路径、关联和图片约束。
- `src/data/__tests__/help-search.test.ts`：帮助搜索打分与可见性。
- `src/lib/__tests__/help-markdown.test.ts`：标题 id、目录、图片和外链安全。
- `src/lib/__tests__/markdown.test.ts`：通用 Markdown 与 XSS 回归。
- `src/lib/__tests__/search-index.test.ts`：Spotlight 帮助与 FAQ 索引。
- `src/app/__tests__/sitemap.test.ts`：帮助 sitemap 与商业过滤。
- `src/lib/__tests__/dark-theme.test.ts`：暗色与 reduced-motion 全局约束。

## Execution Preflight

- [ ] 运行 `git status --short --branch`、`git diff --name-only` 和 `git diff --cached --name-only`，记录现有用户改动。
- [ ] 查看 `messages/zh.json`、`messages/en.json`、`AGENTS.md` 的当前 diff；对重叠 namespace 使用局部 patch。
- [ ] 运行基线测试：

```bash
pnpm exec vitest run \
  src/data/__tests__/help.test.ts \
  src/lib/__tests__/search-index.test.ts \
  src/app/__tests__/sitemap.test.ts \
  src/lib/__tests__/markdown.test.ts \
  src/lib/__tests__/dark-theme.test.ts
```

预期：全部 PASS；若失败，先记录为基线问题，不在帮助任务中顺手修改无关代码。

### Task 1: 扩展现有帮助元数据与商业可见性

**Files:**
- Modify: `src/data/help-articles.ts`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: `HelpArticleKind`、扩展后的 `HelpArticleMeta`/`LocalizedHelpArticle`。
- Produces: `isHelpArticleVisible(article, showPricing): boolean`。
- Produces: `localizeHelpArticles(locale, showPricing): LocalizedHelpArticle[]`。
- Produces: `findLocalizedHelpArticle(slug, locale, showPricing): LocalizedHelpArticle | undefined`。

- [ ] **Step 1: 写失败测试锁定扩展类型和基线兼容**

```ts
const BASELINE_SLUGS = [
  'macos-cannot-open-app',
  'get-product-after-purchase',
  'use-license-key',
  'product-updates',
  'refund-policy',
  'technical-support',
];

expect(helpArticles.map((article) => article.slug))
  .toEqual(expect.arrayContaining(BASELINE_SLUGS));
for (const article of helpArticles) {
  expect(['tutorial', 'how-to', 'troubleshooting', 'policy']).toContain(article.kind);
  expect(Number.isInteger(article.readingMinutes)).toBe(true);
  expect(article.readingMinutes).toBeGreaterThan(0);
}
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，提示 `kind` 或 `readingMinutes` 不存在，或分类仍为旧四类。

- [ ] **Step 3: 实现六分类、四类型和纯可见性函数**

```ts
export type HelpCategory =
  | 'getting-started' | 'account' | 'products'
  | 'community' | 'tools' | 'support';
export type HelpArticleKind =
  | 'tutorial' | 'how-to' | 'troubleshooting' | 'policy';

export interface HelpArticleMeta {
  slug: string;
  category: HelpCategory;
  kind: HelpArticleKind;
  order: number;
  readingMinutes: number;
  updatedAt: string;
  featured?: boolean;
  commercial?: boolean;
  relatedSlugs?: string[];
  title: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  keywords: { zh: string[]; en: string[] };
}

export function isHelpArticleVisible(
  article: Pick<HelpArticleMeta, 'commercial'>,
  showPricing: boolean,
): boolean {
  return showPricing || article.commercial !== true;
}
```

把现有 6 篇迁移到新分类并补齐字段；此任务不提前登记尚未创建正文的 20 篇，保证动态正文配对测试持续通过。

- [ ] **Step 4: 覆盖开关与排序并运行定向验证**

```ts
const commercialFixture = { commercial: true };
expect(isHelpArticleVisible(commercialFixture, true)).toBe(true);
expect(isHelpArticleVisible(commercialFixture, false)).toBe(false);
```

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts && pnpm exec tsc --noEmit`

Expected: PASS。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`test(help): 扩展帮助元数据与可见性约束`；本阶段不执行 commit。

### Task 2: 抽取双语 FAQ 单一数据源

**Files:**
- Create: `src/data/faqs.ts`
- Modify: `src/components/FAQSection.tsx`
- Modify: `src/lib/search-index.ts`
- Modify: `src/lib/__tests__/search-index.test.ts`

**Interfaces:**
- Produces: `FaqMeta`、`faqItems`、`localizeFaqs(locale, showPricing)`。
- Consumed by: 首页 FAQ、Task 14 帮助热门问题、Spotlight。

- [ ] **Step 1: 写失败测试记录当前 FAQ 的内容和顺序**

```ts
expect(localizeFaqs('zh', true).map((faq) => faq.id)).toEqual([
  'purchase', 'delivery', 'refund', 'updates', 'support', 'enterprise',
]);
expect(localizeFaqs('zh', false).every((faq) => !faq.commercial)).toBe(true);
expect(localizeFaqs('en', true)[0].question).toBe('How to purchase products?');
```

- [ ] **Step 2: 运行测试确认模块缺失**

Run: `pnpm exec vitest run src/lib/__tests__/search-index.test.ts`

Expected: FAIL，提示无法导入 `@/data/faqs` 或 `localizeFaqs` 未定义。

- [ ] **Step 3: 搬移当前中英文 FAQ 文案并保留展示行为**

```ts
export interface FaqMeta {
  id: string;
  commercial: boolean;
  helpSlug?: string;
  question: { zh: string; en: string };
  answer: { zh: string; en: string };
}

export interface LocalizedFaq {
  id: string;
  commercial: boolean;
  helpSlug?: string;
  question: string;
  answer: string;
}
```

`FAQSection` 使用 `useLocale()` 选择数据；保留原有顺序、展开状态、DOM 和 CSS。删除组件导出的 `allFaqs`，Spotlight 改为导入 `localizeFaqs()`。

- [ ] **Step 4: 运行搜索和页面静态检查**

Run: `pnpm exec vitest run src/lib/__tests__/search-index.test.ts && pnpm exec eslint src/data/faqs.ts src/components/FAQSection.tsx src/lib/search-index.ts`

Expected: PASS，首页 FAQ 可见内容无变化。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`refactor(faq): 提取首页与帮助中心共享数据`；本阶段不执行 commit。

### Task 3: 建立帮助中心专用搜索内核

**Files:**
- Create: `src/data/help-search.ts`
- Create: `src/data/help-search.server.ts`
- Create: `src/data/__tests__/help-search.test.ts`

**Interfaces:**
- Produces: `HelpSearchEntry`。
- Produces: `buildHelpSearchEntries(locale, showPricing): HelpSearchEntry[]`，仅服务端。
- Produces: `searchHelpEntries(entries, query): HelpSearchEntry[]`，客户端安全。

```ts
export interface HelpSearchEntry {
  slug: string;
  category: HelpCategory;
  categoryOrder: number;
  order: number;
  commercial: boolean;
  title: string;
  excerpt: string;
  keywords: string;
  initials: string;
  fullPinyin: string;
}
```

- [ ] **Step 1: 写失败测试覆盖直接文本、拼音与多词 AND**

```ts
const entries: HelpSearchEntry[] = [{
  slug: 'create-and-verify-account',
  category: 'account',
  categoryOrder: 2,
  order: 1,
  title: '注册并验证邮箱',
  excerpt: '完成账户注册和邮箱验证',
  keywords: '注册 邮箱 captcha',
  initials: 'zcyzyx',
  fullPinyin: 'zhucebingyanzhengyouxiang',
}];
expect(searchHelpEntries(entries, '验证 邮箱')).toHaveLength(1);
expect(searchHelpEntries(entries, 'zcyz')[0].slug).toBe('create-and-verify-account');
expect(searchHelpEntries(entries, '不存在')).toEqual([]);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help-search.test.ts`

Expected: FAIL，提示搜索模块不存在。

- [ ] **Step 3: 实现客户端打分和服务端拼音生成**

客户端模块只比较预计算字符串；服务端模块导入 `pinyin-pro`，把标题、摘要和关键词转换为 initials/fullPinyin。多词必须全部命中；同分按 `categoryOrder → order → slug`。

```ts
export function searchHelpEntries(
  entries: HelpSearchEntry[],
  query: string,
): HelpSearchEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return entries
    .map((entry) => {
      let total = 0;
      for (const term of terms) {
        const title = entry.title.toLowerCase();
        const score = title.startsWith(term) ? 100
          : title.includes(term) ? 60
            : entry.initials.includes(term) ? 55
              : entry.fullPinyin.includes(term) ? 35
                : entry.excerpt.toLowerCase().includes(term) ? 30
                  : entry.keywords.includes(term) ? 20 : 0;
        if (score === 0) return null;
        total += score;
      }
      return { entry, total };
    })
    .filter((result): result is { entry: HelpSearchEntry; total: number } => result !== null)
    .sort((a, b) => b.total - a.total
      || a.entry.categoryOrder - b.entry.categoryOrder
      || a.entry.order - b.entry.order
      || a.entry.slug.localeCompare(b.entry.slug))
    .map(({ entry }) => entry);
}
```

- [ ] **Step 4: 验证商业过滤和客户端边界**

```ts
expect(buildHelpSearchEntries('zh', false).every((entry) => !entry.commercial)).toBe(true);
```

Run: `pnpm exec vitest run src/data/__tests__/help-search.test.ts && rg -n "from '(fs|path|sharp)'" src/data/help-search.ts`

Expected: 测试 PASS；`rg` 无输出。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`feat(help): 增加帮助中心搜索内核`；本阶段不执行 commit。

### Task 4: 增加安全目录与截图 Markdown 渲染

**Files:**
- Modify: `src/lib/markdown.ts`
- Create: `src/lib/help-markdown.ts`
- Create: `src/lib/__tests__/help-markdown.test.ts`
- Modify: `src/lib/__tests__/markdown.test.ts`

**Interfaces:**
- Produces: `HelpHeading { id: string; level: 2 | 3; text: string }`。
- Produces: `renderHelpMarkdown({ content, slug, locale }): Promise<{ html: string; headings: HelpHeading[] }>`。
- Preserves: `markdownToHtml(md): string` exact public behavior.

- [ ] **Step 1: 写失败测试覆盖标题 id、重名与 XSS**

```ts
const rendered = await renderHelpMarkdown({
  content: '## 注册账户\n\n### 下一步\n\n## 注册账户',
  slug: 'create-and-verify-account',
  locale: 'zh',
});
expect(rendered.headings.map((h) => h.id)).toEqual(['注册账户', '下一步', '注册账户-1']);
expect(rendered.html).toContain('<h2 id="注册账户">');
expect(rendered.html).not.toContain('<script');
```

- [ ] **Step 2: 运行测试确认失败，并锁定通用回归**

Run: `pnpm exec vitest run src/lib/__tests__/help-markdown.test.ts src/lib/__tests__/markdown.test.ts`

Expected: 新测试 FAIL（模块不存在），现有 Markdown 测试 PASS。

- [ ] **Step 3: 实现帮助专用 HAST 插件**

从 HAST 提取 `h2/h3` 纯文本，使用 Unicode 字母/数字与连字符生成 id，空结果回退 `section`，同名追加 `-1/-2`。目录写入当前 VFile，不保存到模块级可变变量。

- [ ] **Step 4: 实现受控图片与外链增强**

```ts
export interface RenderHelpMarkdownInput {
  content: string;
  slug: string;
  locale: Locale;
}
```

本地图片必须以 `/help/${slug}/` 开头；解码路径后再次检查仍位于 `public/help/${slug}`。Sharp 补 `width/height`，插件补 `loading="lazy"`、`decoding="async"`；title 生成 `figcaption`。外链保留 `target="_blank" rel="noopener noreferrer"`，追加 `↗` 和本地化 sr-only 提示。

- [ ] **Step 5: 运行安全与类型回归**

Run: `pnpm exec vitest run src/lib/__tests__/help-markdown.test.ts src/lib/__tests__/markdown.test.ts && pnpm exec tsc --noEmit`

Expected: 全部 PASS，现有 `markdownToHtml` 快照不变。

- [ ] **Step 6: 记录逻辑提交边界**

建议提交：`feat(help): 增加文章目录与安全截图渲染`；本阶段不执行 commit。

### Task 5: 安全预填帮助反馈上下文

**Files:**
- Modify: `src/data/help.ts`
- Modify: `src/data/__tests__/help.test.ts`
- Modify: `src/app/[locale]/feedback/page.tsx`
- Modify: `src/app/[locale]/feedback/FeedbackForm.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

**Interfaces:**
- Produces: `getHelpFeedbackArticle(locale, source, article, showPricing)`。
- Extends: `FeedbackFormProps` with `initialContent?: string`。

```ts
export function getHelpFeedbackArticle(
  locale: Locale,
  source: string | string[] | undefined,
  article: string | string[] | undefined,
  showPricing: boolean,
): LocalizedHelpArticle | undefined;
```

- [ ] **Step 1: 写失败测试拒绝任意和重复查询参数**

```ts
expect(getHelpFeedbackArticle('zh', 'help', 'technical-support', true)?.slug)
  .toBe('technical-support');
expect(getHelpFeedbackArticle('zh', 'help', ['technical-support'], true)).toBeUndefined();
expect(getHelpFeedbackArticle('zh', 'other', 'technical-support', true)).toBeUndefined();
expect(getHelpFeedbackArticle('zh', 'help', '../secret', true)).toBeUndefined();
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，函数不存在。

- [ ] **Step 3: 实现白名单解析和表单初始值**

页面只在 `source === 'help'` 且 article 是单一字符串时查元数据；预填模板只由本地化文章标题和 `/${locale}/docs/${slug}` 生成。`FeedbackForm` 用 `useState(initialContent)` 初始化，不用 effect。

- [ ] **Step 4: 验证旧入口和深夜树洞不变**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts && pnpm exec eslint 'src/app/[locale]/feedback/page.tsx' 'src/app/[locale]/feedback/FeedbackForm.tsx'`

Expected: PASS；`/feedback?type=question` 仍只预选问题类型。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`feat(help): 安全预填文章反馈上下文`；本阶段不执行 commit。

### Task 6: 新增初识与导航 4 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/start-here.md`
- Create: `content/help/en/start-here.md`
- Create: `content/help/zh/navigate-and-search.md`
- Create: `content/help/en/navigate-and-search.md`
- Create: `content/help/zh/understand-product-types.md`
- Create: `content/help/en/understand-product-types.md`
- Create: `content/help/zh/online-trial-vs-full-access.md`
- Create: `content/help/en/online-trial-vs-full-access.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 4 个新 slug 的元数据和正文；动态目录配对测试从 6 增至 10 篇。

- [ ] **Step 1: 先把 4 个 slug 加入期望测试并确认失败**

```ts
expect(helpArticles.map((article) => article.slug)).toEqual(expect.arrayContaining([
  'start-here', 'navigate-and-search',
  'understand-product-types', 'online-trial-vs-full-access',
]));
```

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，缺少 4 个 slug。

- [ ] **Step 2: 同时增加元数据与完整中英文正文**

每篇正文从 `h2` 开始，包含目标、操作/判断、成功标志和下一步。`start-here` 覆盖产品、帮助、博客、开源、联系和反馈入口；导航教程覆盖 Header、语言切换和 Spotlight；产品类型区分站内应用、安装包、命令行/外部项目；试玩文章明确 `/trial` 与正式权益的差别。

- [ ] **Step 3: 运行正文配对、标题和安全检查**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/lib/__tests__/markdown.test.ts`

Expected: PASS，zh/en 目录都正好包含当前 10 个元数据文件。

- [ ] **Step 4: 记录逻辑提交边界**

建议提交：`docs(help): 增加初识与导航教程`；本阶段不执行 commit。

### Task 7: 新增账户与资格 5 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/create-and-verify-account.md`
- Create: `content/help/en/create-and-verify-account.md`
- Create: `content/help/zh/login-and-reset-password.md`
- Create: `content/help/en/login-and-reset-password.md`
- Create: `content/help/zh/edit-profile.md`
- Create: `content/help/en/edit-profile.md`
- Create: `content/help/zh/manage-account-data.md`
- Create: `content/help/en/manage-account-data.md`
- Create: `content/help/zh/student-plan.md`
- Create: `content/help/en/student-plan.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 5 个账户类 slug；动态目录从 10 增至 15 篇。

- [ ] **Step 1: 写失败测试锁定 5 个 slug 和账户分类顺序**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，缺少账户教程。

- [ ] **Step 2: 编写注册、登录和资料正文**

注册教程必须写明滑块验证、24 小时邮箱验证 token、注册后不自动登录；登录教程写明未验证账户不会获得 session、忘记密码入口和重置后重新登录；资料教程覆盖昵称、头像和 200 字 bio/个性签名。

- [ ] **Step 3: 编写数据权利和学生计划正文**

账户数据教程覆盖修改密码、数据导出和不可逆注销；学生计划只描述当前教育邮箱验证、24 小时链接和页面现有人工联系兜底，不新增回复时限。

- [ ] **Step 4: 运行帮助与认证相关回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/lib/__tests__/email-verification.test.ts src/lib/__tests__/password-reset.test.ts src/lib/__tests__/student-verification.test.ts`

Expected: PASS。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 增加账户与资格教程`；本阶段不执行 commit。

### Task 8: 新增非商业产品获取 4 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/browse-and-compare-products.md`
- Create: `content/help/en/browse-and-compare-products.md`
- Create: `content/help/zh/claim-free-product.md`
- Create: `content/help/en/claim-free-product.md`
- Create: `content/help/zh/redeem-invitation-code.md`
- Create: `content/help/en/redeem-invitation-code.md`
- Create: `content/help/zh/open-or-download-owned-product.md`
- Create: `content/help/en/open-or-download-owned-product.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 4 个产品使用 slug；动态目录从 15 增至 19 篇。

- [ ] **Step 1: 写失败测试并运行**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，缺少 4 个产品获取 slug。

- [ ] **Step 2: 编写浏览和免费入库教程**

浏览教程只描述当前产品列表、分类、价格显示和详情页可选区块；免费教程区分公开免费下载与登录后 `POST /api/claim` 入库，明确免费入库不发邮件、不发授权码。

- [ ] **Step 3: 编写邀请码和“我的产品”教程**

邀请码教程写明必须登录、兑换后获得权益和授权码但两种码用途不同；“我的产品”教程区分站内应用、产品页安装包和外部项目，不能声称全部在浏览器打开。

- [ ] **Step 4: 运行帮助、免费入库和邀请回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/data/__tests__/pass.test.ts`

Expected: PASS；正文不包含“全部产品都能在线打开”。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 增加产品获取教程`；本阶段不执行 commit。

### Task 9: 新增商业购买与 Meteor Pass 2 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/buy-product-or-meteor-pass.md`
- Create: `content/help/en/buy-product-or-meteor-pass.md`
- Create: `content/help/zh/meteor-pass-access-and-renewal.md`
- Create: `content/help/en/meteor-pass-access-and-renewal.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 2 个 `commercial: true` slug；目录从 19 增至 21 篇。

- [ ] **Step 1: 写失败测试锁定商业可见性**

```ts
expect(localizeHelpArticles('zh', true).map((article) => article.slug))
  .toEqual(expect.arrayContaining(['buy-product-or-meteor-pass', 'meteor-pass-access-and-renewal']));
expect(localizeHelpArticles('zh', false).map((article) => article.slug))
  .not.toContain('buy-product-or-meteor-pass');
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，商业 slug 不存在。

- [ ] **Step 3: 编写购买和 Pass 正文**

购买教程区分游客下单与登录购买，只引用当前单品/Pass 流程；Pass 教程写明 monthly ¥39、annual ¥299、lifetime ¥899，不自动续费，月/年会到期，买断永久，Pass 不是 `/apps/meteor-pass` 产品。

- [ ] **Step 4: 运行商业规则回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/data/__tests__/pass.test.ts`

Expected: PASS；关闭销售时索引中没有两个商业 slug。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 增加购买与 Meteor Pass 教程`；本阶段不执行 commit。

### Task 10: 新增博客社区 3 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/browse-blog-tags-and-rss.md`
- Create: `content/help/en/browse-blog-tags-and-rss.md`
- Create: `content/help/zh/interact-with-blog-posts.md`
- Create: `content/help/en/interact-with-blog-posts.md`
- Create: `content/help/zh/submit-and-manage-blog-posts.md`
- Create: `content/help/en/submit-and-manage-blog-posts.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 3 个社区 slug；目录从 21 增至 24 篇。

- [ ] **Step 1: 写失败测试并运行**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，缺少社区 slug。

- [ ] **Step 2: 编写浏览和互动教程**

浏览教程覆盖频道/分区、标签、文章地址和两类 RSS；互动教程覆盖登录要求、点赞、评论、收藏和举报，明确举报不会自动删除内容。

- [ ] **Step 3: 编写投稿教程**

只描述普通投稿者的网页流程：草稿、待审核、发布/驳回、“我的文章”和编辑限制；不写管理员后台。若博客发布 API 已合入，只作为可选进阶链接，不改变基础流程。

- [ ] **Step 4: 运行帮助与博客状态回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/app/api/posts/__tests__/review.test.ts`

Expected: PASS。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 增加博客与社区教程`；本阶段不执行 commit。

### Task 11: 新增 Playground 与 Pathfinder 2 篇双语教程

**Files:**
- Modify: `src/data/help-articles.ts`
- Create: `content/help/zh/use-playground.md`
- Create: `content/help/en/use-playground.md`
- Create: `content/help/zh/use-pathfinder.md`
- Create: `content/help/en/use-pathfinder.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 最后 2 个新 slug；总目录达到 26 篇。

- [ ] **Step 1: 写最终数量失败测试**

```ts
expect(helpArticles).toHaveLength(26);
expect(localizeHelpArticles('zh', true)).toHaveLength(26);
expect(localizeHelpArticles('zh', false)).toHaveLength(24);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，当前只有 24 篇。

- [ ] **Step 3: 编写两篇复杂工具教程**

Playground 只描述页面实际可选 demo、打开方式和试用边界；Pathfinder 对照当前输入约束、生成流程、设置和错误状态，明确结果不是专业建议或达成保证。

- [ ] **Step 4: 验证 52 份正文配对**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: PASS；zh/en 各 26 份且没有多余 Markdown。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 增加在线工具教程`；本阶段不执行 commit。

### Task 12: 修订现有 6 篇文章并增加事实回归

**Files:**
- Modify: `content/help/zh/macos-cannot-open-app.md`
- Modify: `content/help/en/macos-cannot-open-app.md`
- Modify: `content/help/zh/get-product-after-purchase.md`
- Modify: `content/help/en/get-product-after-purchase.md`
- Modify: `content/help/zh/use-license-key.md`
- Modify: `content/help/en/use-license-key.md`
- Modify: `content/help/zh/product-updates.md`
- Modify: `content/help/en/product-updates.md`
- Modify: `content/help/zh/refund-policy.md`
- Modify: `content/help/en/refund-policy.md`
- Modify: `content/help/zh/technical-support.md`
- Modify: `content/help/en/technical-support.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Preserves: 6 个旧 slug。
- Produces: 内容级危险承诺回归断言。

- [ ] **Step 1: 写失败断言捕获已知过度承诺**

```ts
const allHelpContent = helpArticles.flatMap((article) =>
  (['zh', 'en'] as const).map((locale) =>
    getHelpArticle(locale, article.slug)!.content
  )
).join('\n');
expect(allHelpContent).not.toMatch(/所有产品.*浏览器|all products.*browser/i);
expect(allHelpContent).not.toMatch(/自动更新|automatic updates/i);
expect(allHelpContent).not.toMatch(/\bxattr\b|spctl\s+--master-disable/i);
```

- [ ] **Step 2: 修订购买、授权和更新文章**

购买文章区分登录购买与游客/历史邮箱关联；授权文章明确邀请码与授权码不同；更新文章把版本号、更新说明和通知都写成可选能力。

- [ ] **Step 3: 复核 macOS、退款和支持文章**

macOS 继续使用 Apple 官方“右键打开/仍要打开”流程；退款以 `/refund` 为最终政策；支持文章删除代码中不存在的固定回复时限并保持隐私提醒。

- [ ] **Step 4: 运行内容、安全和 Markdown 回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/lib/__tests__/markdown.test.ts`

Expected: PASS。

- [ ] **Step 5: 记录逻辑提交边界**

建议提交：`docs(help): 校准现有帮助文章承诺`；本阶段不执行 commit。

### Task 13: 实现 5 条路径和显式相关文章

**Files:**
- Modify: `src/data/help-articles.ts`
- Modify: `src/data/help.ts`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: `HelpJourneyMeta`、`LocalizedHelpJourney`、`HelpJourneyContext`。
- Produces: `localizeHelpJourneys(locale, showPricing)`。
- Produces: `getHelpJourneyContext(locale, slug, journeyId, showPricing)`。
- Extends: `getRelatedHelpArticles(locale, article, showPricing)`。

```ts
export interface HelpJourneyContext {
  journey: LocalizedHelpJourney;
  currentIndex: number;
  total: number;
  previous?: LocalizedHelpArticle;
  next?: LocalizedHelpArticle;
}

export function getHelpJourneyContext(
  locale: Locale,
  slug: string,
  journeyId: string | undefined,
  showPricing: boolean,
): HelpJourneyContext | undefined;
```

- [ ] **Step 1: 写失败测试锁定 5 条路径与上下文**

```ts
expect(helpJourneys.map((journey) => journey.id)).toEqual([
  'free', 'invite', 'purchase', 'community', 'online-tools',
]);
const context = getHelpJourneyContext('zh', 'claim-free-product', 'free', true);
expect(context?.currentIndex).toBe(3);
expect(context?.previous?.slug).toBe('create-and-verify-account');
expect(context?.next?.slug).toBe('open-or-download-owned-product');
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: FAIL，路径接口不存在。

- [ ] **Step 3: 实现路径白名单和前后项**

路径只保存有序 slug；函数拒绝未知 id、不包含当前文章的路径和关闭销售时的 purchase 路径。`currentIndex` 使用 0-based 内部值，UI 显示时加 1。

- [ ] **Step 4: 实现显式关联优先、分类回退**

按 `relatedSlugs` 顺序去重，过滤当前文章和隐藏文章，再从同分类补足最多 3 篇。

- [ ] **Step 5: 运行数据回归**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts`

Expected: PASS，所有路径引用存在且路径内部无重复。

- [ ] **Step 6: 记录逻辑提交边界**

建议提交：`feat(help): 增加新手路径与文章关系`；本阶段不执行 commit。

### Task 14: 重构帮助中心首页

**Files:**
- Create: `src/components/help/HelpCenterSearch.tsx`
- Create: `src/components/help/HelpJourneyGrid.tsx`
- Create: `src/components/help/HelpPopularFaqs.tsx`
- Create: `src/components/help/HelpArticleLibrary.tsx`
- Modify: `src/app/[locale]/docs/page.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

**Interfaces:**
- Consumes: `buildHelpSearchEntries`、本地化文章/路径/FAQ。
- Produces: `/docs?q=` 可分享搜索页面和六分类索引。

```ts
interface HelpJourneyGridProps {
  journeys: LocalizedHelpJourney[];
}
interface HelpPopularFaqsProps {
  faqs: LocalizedFaq[];
}
interface HelpArticleLibraryProps {
  categories: HelpCategoryMeta[];
  articles: LocalizedHelpArticle[];
}
```

- [ ] **Step 1: 记录失败的视觉基线**

在 375px 打开 `/zh/docs`，执行：

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected before fix: `false` 或可见文本裁切；桌面分类网格存在数量不均空洞。

- [ ] **Step 2: 实现独立搜索组件**

```ts
interface HelpCenterSearchProps {
  entries: HelpSearchEntry[];
  initialQuery: string;
  locale: Locale;
}
```

只接受单一字符串 `q`；输入用 router replace 更新 URL，空值删除参数；结果区域 `aria-live="polite"`，空结果提供清除和反馈入口。

- [ ] **Step 3: 实现路径、热门 FAQ 和文章库组件**

路径移动端单列；FAQ 复用同一数据并用原生 `<details>`；六个分类纵向全宽，分类内部 `md:grid-cols-2`。文章条目使用实色/分隔线，不使用 `.glass-card`。

- [ ] **Step 4: 组合首页和双语文案**

顺序固定为：标题/搜索 → 路径 → 热门问题 → 分类锚点 → 教程库 → 反馈。英文眉标为 “Official Support”。服务端只传搜索摘要，不读取正文。

- [ ] **Step 5: 验证搜索与首页边界**

Run: `pnpm exec vitest run src/data/__tests__/help-search.test.ts src/lib/__tests__/search-index.test.ts && pnpm exec tsc --noEmit`

Expected: PASS；375px 溢出表达式变为 `true`，搜索 `zcyz` 命中注册教程。

- [ ] **Step 6: 记录逻辑提交边界**

建议提交：`feat(help): 重构帮助中心首页与搜索`；本阶段不执行 commit。

### Task 15: 重构文章详情、目录和 SEO

**Files:**
- Create: `src/components/help/HelpArticleToc.tsx`
- Modify: `src/app/[locale]/docs/[slug]/page.tsx`
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

**Interfaces:**
- Consumes: `renderHelpMarkdown`、`getHelpJourneyContext`、`getRelatedHelpArticles`。
- Produces: 带目录、路径进度、JSON-LD 和安全反馈 CTA 的详情页。

```ts
interface HelpArticleTocProps {
  headings: HelpHeading[];
  label: string;
}
```

- [ ] **Step 1: 先验证当前失败点**

在现有详情页确认：英文正文行宽超过目标、无标题目录、面包屑触控高度小于 44px、相关文章不是 `ul/li`。

- [ ] **Step 2: 接入异步帮助 Markdown 与目录**

`renderHelpMarkdown` 返回的 headings 传给 `HelpArticleToc`；桌面目录 sticky，移动端原生 `<details>`。正文容器使用约 `max-w-[68ch]`。

- [ ] **Step 3: 接入路径参数和相关文章**

只接受单一字符串 `journey`；合法时显示 `currentIndex + 1 / total`、上一篇/下一篇并保留参数；否则显示 `ul/li` 相关文章。

- [ ] **Step 4: 增加反馈、404 和结构化数据**

文章 CTA 指向 `/feedback?type=question&source=help&article=${slug}`。页面、metadata 和 static params 全部用可见清单；canonical 不含查询参数。输出 `BreadcrumbList` 和 `TechArticle` JSON-LD。

- [ ] **Step 5: 运行渲染与构建验证**

Run: `pnpm exec vitest run src/lib/__tests__/help-markdown.test.ts src/data/__tests__/help.test.ts && pnpm exec tsc --noEmit`

Expected: PASS；未知 slug 和隐藏商业 slug 走 `notFound()`。

- [ ] **Step 6: 记录逻辑提交边界**

建议提交：`feat(help): 增加文章目录与路径导航`；本阶段不执行 commit。

### Task 16: 采集并接入 9 个关键流程截图

**Files:**
- Create: `public/help/macos-cannot-open-app/{zh,en}/*.webp`
- Create: `public/help/create-and-verify-account/{zh,en}/*.webp`
- Create: `public/help/claim-free-product/{zh,en}/*.webp`
- Create: `public/help/buy-product-or-meteor-pass/{zh,en}/*.webp`
- Create: `public/help/redeem-invitation-code/{zh,en}/*.webp`
- Create: `public/help/open-or-download-owned-product/{zh,en}/*.webp`
- Create: `public/help/submit-and-manage-blog-posts/{zh,en}/*.webp`
- Create: `public/help/use-playground/{zh,en}/*.webp`
- Create: `public/help/use-pathfinder/{zh,en}/*.webp`
- Modify: 对应 18 份 `content/help/{zh,en}/*.md`
- Modify: `src/data/__tests__/help.test.ts`

**Interfaces:**
- Produces: 真实 WebP 截图，Markdown 使用 `/help/{slug}/{locale}/...` 引用。

- [ ] **Step 1: 写失败图片约束测试**

```ts
expect(src.startsWith(`/help/${article.slug}/`)).toBe(true);
expect(src.endsWith('.webp')).toBe(true);
const metadata = await sharp(join(process.cwd(), 'public', src.slice(1))).metadata();
expect(Math.max(metadata.width ?? 0, metadata.height ?? 0)).toBeLessThanOrEqual(1600);
expect(alt.trim()).not.toBe('');
```

- [ ] **Step 2: 建立安全截图状态**

公开页面只读采集；登录页先检查当前会话是否为可公开的测试数据。没有安全会话时停止这些截图并向用户请求条件，不注册生产账户或写生产订单。

- [ ] **Step 3: 采集中文、英文和 macOS 界面**

网站截图通过应用内浏览器获取；macOS 设置只打开“隐私与安全性”查看，不更改安全选项。画面不得包含邮箱、订单号、授权码、邀请码、PAT 或支付信息。

- [ ] **Step 4: 转换和接入 WebP**

使用已有 Sharp 转换，最长边不超过 1600px；正文使用非空 alt 和 title 图注，且文字步骤在无图时仍完整。

- [ ] **Step 5: 运行图片和渲染测试**

Run: `pnpm exec vitest run src/data/__tests__/help.test.ts src/lib/__tests__/help-markdown.test.ts`

Expected: PASS；详情 HTML 有稳定 width/height、lazy 和 async decoding。

- [ ] **Step 6: 记录逻辑提交边界**

建议提交：`docs(help): 增加关键流程图片指引`；本阶段不执行 commit。

### Task 17: Spotlight、sitemap、响应式与完整交付

**Files:**
- Modify: `src/lib/search-index.ts`
- Modify: `src/lib/__tests__/search-index.test.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/__tests__/sitemap.test.ts`
- Modify: `src/app/globals.css`
- Modify: `src/lib/__tests__/dark-theme.test.ts`
- Modify: `AGENTS.md` only if the latest diff can be merged safely
- Create or merge: `/Users/meteor/obsidian/项目总结/2026-08-10-Meteor-Store.md`

**Interfaces:**
- Consumes: 统一可见帮助清单。
- Produces: 26 × 2 sitemap（销售开启）、24 × 2 sitemap（销售关闭）、完整 Spotlight 和发布验收结果。

- [ ] **Step 1: 写失败的 Spotlight 与 sitemap 断言**

```ts
expect(buildIndex('zh', true).filter((e) => e.id.startsWith('help-article-'))).toHaveLength(26);
expect(buildIndex('zh', false).filter((e) => e.id.startsWith('help-article-'))).toHaveLength(24);
expect(getHelpSitemapEntries(true)).toHaveLength(52);
expect(getHelpSitemapEntries(false)).toHaveLength(48);
```

- [ ] **Step 2: 统一 Spotlight 和 sitemap 可见性**

给 `buildIndex`、`getHelpSitemapEntries` 增加可测试的 `showPricing` 参数，默认使用 `SHOW_PRICING`。FAQ 与帮助文章都从共享数据生成，不导入正文。

- [ ] **Step 3: 完成 hover 与 reduced-motion CSS**

`prefers-reduced-motion: reduce` 下把 `scroll-behavior` 设为 `auto`，并关闭帮助交互的 transition/transform。玻璃属性继续保持 `-webkit-backdrop-filter` 在标准属性之前；不修改暗色 token。

- [ ] **Step 4: 运行全部自动化验证**

```bash
pnpm exec vitest run \
  src/data/__tests__/help.test.ts \
  src/data/__tests__/help-search.test.ts \
  src/lib/__tests__/help-markdown.test.ts \
  src/lib/__tests__/markdown.test.ts \
  src/lib/__tests__/search-index.test.ts \
  src/app/__tests__/sitemap.test.ts \
  src/lib/__tests__/dark-theme.test.ts
pnpm exec tsc --noEmit
pnpm exec eslint src
pnpm test
pnpm build
git diff --check
```

Expected: 全部 PASS，生产构建包含 `/[locale]/docs/[slug]`。

- [ ] **Step 5: 完成浏览器验收**

在 375、768、1024、1280px 检查 `/zh/docs`、`/en/docs`、搜索、5 条路径、目录、反馈预填和中英文切换。每个宽度执行：

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected: `true`。销售开启时检查 52 个文章 URL；销售关闭时商业文章返回 404。

- [ ] **Step 6: 更新项目约定与 Obsidian 总结**

只在不覆盖现有 `AGENTS.md` diff 时追加帮助中心数据源、路径、商业可见性和 Markdown 安全约束。读取 `/Users/meteor/obsidian/模板/` 对应模板，把本次总结安全合并到当日项目文件。

- [ ] **Step 7: 最终审阅与提交门禁**

确认工作区差异只包含帮助中心文件和用户原有改动；列出建议提交文件，不暂存用户改动。向用户报告验证、截图限制和风险，并请求代码提交授权；不自动 push 或部署。

## Plan Self-Review

- [x] Spec coverage：26 篇、52 份正文、5 条路径、六分类、搜索、FAQ、目录、截图、反馈、SEO、商业过滤和发布门槛均有任务。
- [x] 占位语扫描：没有待定标记、模糊的后续实现指令或未定义接口；内容任务列出了全部 slug 和事实边界。
- [x] Type consistency：`showPricing` 在元数据、搜索、路径、Spotlight 和 sitemap 均为显式 boolean；路径 `currentIndex` 统一 0-based。
- [x] Scope check：只修改帮助中心及必要共享入口，不改数据库、支付、授权、产品或博客状态机。
- [x] Task sizing：数据、渲染、每个内容分类、UI、截图和集成均可独立验证；正文与元数据在同一任务加入，目录配对测试不会长期红灯。

## Acceptance Checklist

- [ ] `/docs` 提供独立搜索、5 条路径、热门 FAQ 和六分类教程库。
- [ ] 6 个旧 slug 保留，20 个新 slug 可访问。
- [ ] 26 篇教程均有完整中英文正文，共 52 份 Markdown。
- [ ] 搜索支持中英文、关键词、全拼、首字母和 `?q=` 分享。
- [ ] 详情页有服务端目录、约 68ch 正文、路径导航、相关文章和 JSON-LD。
- [ ] 9 个关键流程有真实、脱敏、响应式 WebP 图片。
- [ ] 首页 FAQ 的可见内容、顺序和布局不变。
- [ ] 反馈预填只接受白名单文章上下文。
- [ ] `SHOW_PRICING=false` 时商业文章不进入任何索引并返回 404。
- [ ] macOS 和产品文档不包含危险操作或未实现承诺。
- [ ] 375、768、1024、1280px 无页面级横向溢出，触控和 reduced motion 合格。
- [ ] TypeScript、ESLint、Vitest 和生产构建全部通过。
