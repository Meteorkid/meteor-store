# Meteor Store 帮助中心实施计划

> 日期：2026-08-09
> 设计依据：`docs/superpowers/specs/2026-08-09-help-center-design.md`

## 实施原则

- 采用“浏览器安全元数据清单 + 服务端 Markdown 正文”结构；Spotlight 客户端不得导入 `fs`。
- 先补数据约束与搜索测试，再实现页面和内容。
- 帮助文档只描述站内已经存在的能力，不虚构自动更新、统一激活输入框或额外交付承诺。
- macOS 指引以 Apple 官方说明为依据，不指导关闭 Gatekeeper 或执行绕过安全机制的命令。
- 不修改数据库、反馈 API、管理员后台和产品详情页。
- 保留用户现有 `AGENTS.md` 修改，不暂存、不覆盖。

## Task 1：帮助文章元数据与数据约束

涉及文件：

- 新增 `src/data/help-articles.ts`
- 新增 `src/data/__tests__/help.test.ts`

步骤：

1. 先写失败测试，锁定 6 个首版 slug、唯一性和 kebab-case 格式。
2. 测试四种允许分类、同分类内唯一排序、严格 `YYYY-MM-DD` 更新时间。
3. 测试中英文标题、摘要和关键词均非空。
4. 实现 `HelpCategory`、`HelpArticleMeta`、文章清单和本地化摘要类型。
5. 实现浏览器安全的 `localizeHelpArticles(locale)` 与按 slug 查找函数，不导入 Node API。
6. 运行 `pnpm exec vitest run src/data/__tests__/help.test.ts` 与 TypeScript 检查。

## Task 2：Markdown 正文与服务端加载层

涉及文件：

- 新增 `src/data/help.ts`
- 新增 `content/help/zh/*.md` 共 6 篇
- 新增 `content/help/en/*.md` 共 6 篇
- 更新 `src/data/__tests__/help.test.ts`

步骤：

1. 先补测试：每个元数据 slug 都有 `zh/en` 同名 Markdown，正文非空。
2. 补图片约束测试：非空 alt、本地路径位于 `/help/{slug}/`，引用文件必须存在。
3. 实现仅服务端可导入的正文加载器；slug 必须先通过元数据清单解析，再拼受控路径。
4. 编写 macOS 文章：Gatekeeper 原因、一次尝试打开、“隐私与安全性 → 仍要打开”、危险提示分支和 Apple 官方链接。
5. 编写购买交付、授权码、产品更新、退款和技术支持文章，逐条对照现有页面、EULA 与退款政策。
6. 中英文正文保持相同标题层级和语义，不要求逐字直译。
7. 用现有 `markdownToHtml` 渲染样例，确认步骤、站内链接与外链均符合预期。

## Task 3：帮助中心首页

涉及文件：

- 重写 `src/app/[locale]/docs/page.tsx`
- 修改 `messages/zh.json`
- 修改 `messages/en.json`

步骤：

1. 移除 `products`、`categoryLabels`、`DocCard` 和快速命令逻辑。
2. 从帮助元数据清单获取本地化文章，按固定分类顺序和 `order` 渲染。
3. 实现帮助中心 Hero、四个分类区、文章条目及底部反馈 CTA。
4. 文章条目展示标题、摘要、更新时间和箭头；整条只有一个主要链接。
5. 使用项目字阶类和普通暗色正文背景；交互卡片可用 `.glass-card`，长文内容不使用玻璃。
6. 更新 `DocsPage` 的标题、描述、分类和行动文案，中英文键集合保持一致。
7. 手动检查空分类不渲染、键盘焦点与窄屏布局。

## Task 4：独立帮助文章页

涉及文件：

- 新增 `src/app/[locale]/docs/[slug]/page.tsx`
- 修改 `messages/zh.json`
- 修改 `messages/en.json`

步骤：

1. 实现 `generateStaticParams`，生成全部 `locale × slug`。
2. 实现 `generateMetadata`，使用本地化标题、摘要、canonical 与语言替代地址。
3. 未知 slug 或缺少正文时调用 `notFound()`。
4. 渲染面包屑、分类、更新时间、标题、摘要和 Markdown 正文。
5. 复用 `markdownToHtml`，正文样式遵守现有暗色排版和对比度约束。
6. 渲染同分类最多 3 篇相关文章，以及 `/feedback?type=question` 行动区。
7. 验证外链属性、标题层级和未来图片的响应式宽度。

## Task 5：反馈问题预选

涉及文件：

- 修改 `src/app/[locale]/feedback/page.tsx`
- 修改 `src/app/[locale]/feedback/FeedbackForm.tsx`

步骤：

1. 让页面读取 `searchParams.type`，只接受精确值 `question` 作为预选。
2. 为 `FeedbackForm` 增加窄类型 `initialType` 属性，默认仍为空字符串。
3. 用初始属性初始化 state，不在 effect 中同步查询参数，避免触发 React 19 set-state-in-effect 规则。
4. 非法或重复查询参数保持未选择状态；用户仍可手动切换类型。
5. 确认夜间树洞选项逻辑和提交 API 完全不变。

## Task 6：导航与入口文案

涉及文件：

- 修改 `src/components/Header.tsx`
- 修改 `src/components/Footer.tsx`
- 修改 `src/components/HeroSection.tsx`
- 修改 `src/components/CTASection.tsx`
- 修改 `src/components/PlaygroundTabs.tsx`
- 修改 `messages/zh.json`
- 修改 `messages/en.json`

步骤：

1. Header 将“文档 / Docs”改为“帮助 / Help”，URL 仍为 `/docs`。
2. Footer 将资源项改为“帮助中心 / Help Center”。
3. 首页 Hero 与 CTA 的现有 `/docs` 按钮改成帮助语义，不重命名与本次无关的组件。
4. Playground 的“阅读文档”改为“查看帮助”。
5. 搜索所有指向 `/docs` 的用户可见旧文案，逐处确认语义；不误改第三方 API 文档链接。
6. 检查中英文消息键一致，避免遗留“GitHub/开源”旧按钮名称显示给用户。

## Task 7：Spotlight 搜索

涉及文件：

- 修改 `src/lib/search-index.ts`
- 修改 `src/lib/__tests__/search-index.test.ts`
- 修改 `messages/zh.json`
- 修改 `messages/en.json`

步骤：

1. 先写失败测试：6 篇文章均进入 `帮助` 分组，href 指向各自 `/docs/{slug}`。
2. 测试中文与英文索引分别使用对应标题、摘要和关键词。
3. 将 `page-docs` 重命名为“帮助中心”，更新 `docs/help/问题/解答/安装/授权` 等关键词。
4. 从浏览器安全的 `help-articles.ts` 生成文章搜索条目；不得导入 `src/data/help.ts`。
5. 保留首页 FAQ 搜索条目及 `/#faq` 地址，不迁移、不去重。
6. 更新 Spotlight 输入提示中的“文档”表达为“帮助”。

## Task 8：sitemap 与 SEO 验证

涉及文件：

- 修改 `src/app/sitemap.ts`
- 新增或更新 sitemap 相关测试

步骤：

1. 从帮助元数据清单生成全部中英文文章 URL。
2. `lastModified` 使用文章 `updatedAt`，`changeFrequency` 使用 `monthly`，优先级低于产品详情页。
3. 为每篇文章生成 `zh/en` 语言替代地址。
4. 保留 `/docs` 帮助中心自身的静态 sitemap 条目。
5. 测试 6 个 slug 共 12 个本地化 URL，且没有重复路径。

## Task 9：集成验证与文档同步

步骤：

1. 运行帮助数据与搜索定向测试。
2. 运行 `pnpm exec tsc --noEmit`。
3. 运行 `pnpm exec eslint src`，要求 0 error。
4. 运行 `pnpm test`。
5. 运行 `pnpm build`，确认帮助详情路由进入生产产物，并逐一检查 12 个中英文文章地址；记录 `.next` 已被覆盖并提醒重启 dev server。
6. 运行 `git diff --check`，逐文件确认只包含帮助中心相关改动。
7. 检查 375、768、1280px 页面布局、键盘导航、中英文切换、搜索直达与反馈预选。
8. 更新项目 `AGENTS.md`，记录帮助内容唯一数据源、路由、图片与安全边界；仅在不覆盖用户现有改动的前提下逐块追加。
9. 按项目总结模板写入 Obsidian 项目总结。
10. 完成后报告改动、验证与风险，再询问是否提交代码；不自动 push 或部署。

## 验收清单

- [x] `/docs` 是帮助中心，不再展示产品目录。
- [x] 6 篇问题均有中英文独立详情页。
- [x] Spotlight 搜索可直接进入具体帮助文章。
- [x] sitemap 包含 12 个本地化帮助文章 URL。
- [x] `/feedback?type=question` 默认选择“问题”，非法参数被忽略。
- [x] macOS 指引不要求关闭 Gatekeeper，也不把“未上架 App Store”写成唯一原因。
- [x] 帮助文档不承诺未实现的产品、交付、更新或退款能力。
- [x] 后续 Markdown 图片有稳定路径、非空 alt 和响应式显示。
- [x] 数据库、反馈 API、反馈后台和产品详情页行为不变。
- [x] TypeScript、ESLint、Vitest 与 Next production build 全部通过。
