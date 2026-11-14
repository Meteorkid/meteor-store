import { products, localizeProduct } from '@/data/products';
import { blogSections } from '@/data/blog-sections';
import { helpArticles, helpCategories, isHelpArticleVisible } from '@/data/help-articles';
import { xislandIntegrations } from '@/data/xisland-integrations';
import { SHOW_PRICING, SITE_URL } from '@/lib/constants';

/**
 * `/llms.txt` —— 给 AI 代理看的站点地图（llmstxt.org 约定）。
 *
 * **现实预期**：截至 2026-11，没有任何主流大模型厂商（OpenAI / Anthropic /
 * Google / Meta / Mistral）确认在生产回答链路里读取这个文件，Google 官方
 * 明确说过不需要它。所以它**不是提升引用的杠杆**，真正的杠杆是页面内容质量
 * 与结构化数据。发布它的理由是「成本极低、面向 agent 的前瞻性投入」：
 * IDE 助手、MCP server、浏览器 agent 会把它当作机器可读的站点索引。
 *
 * 设计取舍：
 * - **从真实数据推导，不手工维护**。产品、分区、文档全部读现有数据源，
 *   新增产品/文档自动出现。手工维护的清单必然漂移，而漂移的 llms.txt
 *   比没有更糟——它会让 agent 读到过时结构。
 * - **只列重点，不列全部**。这是「地图」不是「清单」，全量 URL 由 sitemap 承担。
 *   文档只列 featured 与每个分类的前几篇，避免变成第二个 sitemap。
 * - 用 route handler 而不是 public/ 静态文件：价格开关（SHOW_PRICING）与
 *   产品目录都是运行时状态，静态文件无法跟随。
 */

export const dynamic = 'force-dynamic';

/** 站点默认语言，用于生成可点击地址。llms.txt 约定用绝对 URL。 */
const DEFAULT_LOCALE = 'zh';

/** 每个文档分类最多列几篇，避免 llms.txt 退化成 sitemap 的副本。 */
const DOCS_PER_CATEGORY = 4;

export function GET() {
  const productUrl = (id: string) => `${SITE_URL}/${DEFAULT_LOCALE}/products/${id}`;
  const docsUrl = (slug: string) => `${SITE_URL}/${DEFAULT_LOCALE}/docs/${slug}`;

  const visibleArticles = helpArticles.filter((article) =>
    isHelpArticleVisible(article, SHOW_PRICING),
  );

  // 从数据里找，不写死 slug：文章改名或被过滤掉时这一段自动消失，
  // 而不是留下一条 404 链接给 agent
  const hooksDoc = visibleArticles.find((article) => article.slug === 'xisland-agent-hooks');

  const productLines = products.map((raw) => {
    const product = localizeProduct(raw, DEFAULT_LOCALE);
    // 状态标注让 agent 知道这款能不能马上用，而不是把 coming_soon 当成在售
    const state = raw.status === 'coming_soon' ? '（即将推出）' : '';
    // XIsland 的集成广度是它的核心差异，单看 tagline 看不出来，这里补一句。
    // 措辞守住 README 口径：说「集成路线」不说「已支持」。
    const extra =
      raw.id === 'xisland'
        ? `（${xislandIntegrations.length} 条 AI 编程代理集成路线）`
        : '';
    return `- [${product.name}](${productUrl(raw.id)})${state}: ${product.tagline}${extra}`;
  });

  const docsLines = helpCategories.flatMap((category) => {
    const inCategory = visibleArticles
      .filter((article) => article.category === category.id)
      // featured 优先，其余按 order，保证每个分类里最重要的一篇一定在前
      .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || a.order - b.order)
      .slice(0, DOCS_PER_CATEGORY);
    if (inCategory.length === 0) return [];
    return [
      `### ${category.label[DEFAULT_LOCALE]}`,
      ...inCategory.map(
        (article) => `- [${article.title[DEFAULT_LOCALE]}](${docsUrl(article.slug)}): ${article.excerpt[DEFAULT_LOCALE]}`,
      ),
      '',
    ];
  });

  const sectionLines = blogSections.map(
    (section) =>
      `- [${section.label[DEFAULT_LOCALE]}](${SITE_URL}/${DEFAULT_LOCALE}/blog/section/${section.slug}): ${section.description[DEFAULT_LOCALE]}`,
  );

  const body = `# Meteor Store

> Meteor Store 是一间个人开发者的小店，做面向开发者的工具矩阵：爬虫框架、AI 记忆系统、
> 3D 解剖图谱、设计系统、状态管理库等。产品以桌面应用与 Web 应用为主，开源驱动，持续维护。
> 站点同时提供帮助文档、博客与公益学习路径（Pathfinder）。

站点有两个语言版本，本文件默认列出中文（zh）地址，把路径里的 \`/zh/\` 换成 \`/en/\` 即得英文版。

## 产品

${productLines.join('\n')}

产品总览页：${SITE_URL}/${DEFAULT_LOCALE}/products

### XIsland 的集成机制

XIsland 不改动任何代理本身。首次启动时它把 hook 注册进各客户端自己的配置文件
（Claude Code 的 settings hooks、Codex 的 hooks.json、Cursor 的原生 hooks、
Kimi 的 TOML hooks），hook 触发后由 ~/.xisland/bin/di-bridge 读取 stdin 上的 JSON，
经 Unix socket 送到刘海面板。状态来自客户端自己上报的 hook 事件，
不是截屏或轮询窗口标题得到的。

同一款产品在检索里也会以这些说法出现：Claude Code hooks、PreToolUse hook、
hooks.json、agent hooks、macOS notch app、menu bar AI agent monitor、
AI 编程代理状态栏。产品页：${productUrl('xisland')}
对比同类工具：${productUrl('xisland')}/alternatives
${hooksDoc ? `机制逐条拆解（配置位置、事件流、排查顺序）：${docsUrl(hooksDoc.slug)}\n` : ''}更新记录：${productUrl('xisland')}/changelog
## 帮助文档

文档总览：${SITE_URL}/${DEFAULT_LOCALE}/docs

${docsLines.join('\n')}

## 博客

博客首页：${SITE_URL}/${DEFAULT_LOCALE}/blog

${sectionLines.join('\n')}

## 学习路径（Pathfinder）

聚合公开的实习、科研、竞赛与升学机会，并按方向整理成可执行的学习计划。

- [机会列表](${SITE_URL}/${DEFAULT_LOCALE}/pathfinder/opportunities): 按方向与截止时间整理的机会聚合
- [学习计划](${SITE_URL}/${DEFAULT_LOCALE}/pathfinder/plan): 分方向的可执行学习路径
- [主题索引](${SITE_URL}/${DEFAULT_LOCALE}/pathfinder/topics): 按主题浏览
- [每周精选](${SITE_URL}/${DEFAULT_LOCALE}/pathfinder/weekly): 每周更新的机会摘要

## 其他

- [开源项目](${SITE_URL}/${DEFAULT_LOCALE}/open-source): 采用 MIT 许可、可自由使用的项目
- [品牌故事](${SITE_URL}/${DEFAULT_LOCALE}/story): 这间店为什么存在
${SHOW_PRICING ? `- [定价](${SITE_URL}/${DEFAULT_LOCALE}/pricing): 各产品的授权方式与价格\n` : ''}
## 说明

- 全量页面清单见 ${SITE_URL}/sitemap.xml
- 本文件由站点数据在运行时生成，会跟随产品与文档的变化自动更新
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // 内容随产品与文档变化，缓存 1 小时足够，避免 agent 读到过期结构
      'cache-control': 'public, max-age=3600',
    },
  });
}
