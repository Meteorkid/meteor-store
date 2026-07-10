export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'product' | 'tech' | 'story';
  readingTime: number;
  tags: string[];
}

const categoryLabels: Record<string, string> = {
  product: '产品动态',
  tech: '技术分享',
  story: '幕后故事',
};

export { categoryLabels as blogCategoryLabels };

export const blogPosts: BlogPost[] = [
  {
    slug: 'omnicrawl-why-another-crawler',
    title: 'OmniCrawl：为什么我们要重新发明爬虫框架',
    excerpt:
      '现有爬虫框架的痛点、OmniCrawl 的设计哲学，以及我们如何用三个引擎解决反反爬难题。',
    content: `## 问题

市面上不缺爬虫框架。requests、Scrapy、Playwright——每一个都足够成熟。但当你真正面对生产级的数据采集任务时，单一框架总有力不从心的时候。

requests 快但扛不住 WAF；Scrapy 强大但学习曲线陡峭；Playwright 能渲染 JS 但太重太慢。

## 设计哲学

OmniCrawl 的核心理念是 **「一个 API，三个引擎」**：

\`\`\`python
from omnicrawl import Crawler

crawler = Crawler(engine="auto")  # 自动选择最优引擎
result = await crawler.fetch("https://example.com")
\`\`\`

\`engine="auto"\` 时，OmniCrawl 会根据目标站点的特征自动选择：
- **curl_cffi**：速度最快，适合无 JS 渲染的页面
- **Scrapling**：中间层，带 TLS 指纹模拟
- **Playwright**：最后手段，完整浏览器渲染

## 反反爬

绕过 Cloudflare、Akamai 这些 WAF 是真正的硬骨头。OmniCrawl 的做法是：

1. TLS 指纹轮换——不只是改 User-Agent
2. 浏览器指纹模拟——canvas、WebGL、字体列表全套
3. 智能重试——根据响应码和 WAF 特征自动换策略

## 开源

OmniCrawl 完全开源，MIT 协议。代码在 GitHub 上，欢迎 Star 和贡献。`,
    date: '2026-07-01',
    category: 'tech',
    readingTime: 5,
    tags: ['Python', '爬虫', '反爬', 'OmniCrawl'],
  },
  {
    slug: 'ex-memory-technical-deep-dive',
    title: '从零搭建 AI 记忆系统：Ex-Memory 技术解析',
    excerpt:
      'LLM + RAG 如何让 AI 学会一个人的说话风格？聊聊 Ex-Memory 背后的向量检索与微调技术。',
    content: `## 什么是 Ex-Memory

Ex-Memory 是一个让 AI 模仿特定人说话风格的系统。你导入聊天记录，AI 学习并还原 ta 的语气、用词习惯和表达方式。

## 技术栈

核心链路是 **LLM + RAG**：

\`\`\`
聊天记录 → 分块 → 向量化 → 存入向量库
                                    ↓
用户输入 → 检索相似片段 → 组装 Prompt → LLM 生成
\`\`\`

向量库用的是 ChromaDB（本地运行，隐私优先）。LLM 支持 OpenAI、Claude、Ollama 等多种后端。

## 语气还原的关键

单纯 RAG 检索只能保证内容相关，不能保证语气一致。我们的做法是：

1. **人格画像提取**——分析聊天记录，自动生成 persona.md（MBTI 倾向、高频用语、情感模式）
2. **Few-shot 示例动态选择**——每次对话从历史中挑选最相似的 5 段对话作为 few-shot
3. **风格一致性评分**——生成后自评，低于阈值则重新生成

## 隐私

所有数据只在本地处理。聊天记录、向量索引、人格画像文件全部存储在用户本机。`,
    date: '2026-06-20',
    category: 'tech',
    readingTime: 7,
    tags: ['AI', 'RAG', 'LLM', 'Ex-Memory'],
  },
  {
    slug: 'meteor-store-launch',
    title: 'Meteor Store 正式上线',
    excerpt:
      '9 款产品、一个网站、一个大学生。聊聊我为什么要做这个网站，以及它是怎么被 AI 搭出来的。',
    content: `## 起因

我是一个在校大学生，课余写了不少小项目——爬虫框架、打字练习、macOS 小工具。它们散落在 GitHub 各处，没人知道它们的存在。

我想给这些项目一个家。不是 GitHub Profile 那种冷冰冰的列表，而是一个真正的产品展示网站——有截图、有故事、有"想试试"的冲动。

## 技术选型

- **Next.js 16** + **React 19**：App Router、Server Components、流式渲染
- **Tailwind CSS 4**：全站暗黑主题，液态玻璃质感
- **Vercel** 部署：推送即上线

整个网站是我和 Claude Code 一起搭建的。从设计稿到代码，AI 是我的合作者，不是替代者。

## 9 款产品

每一款都是我自己的痒点产品：

| 产品 | 解决什么问题 |
|------|-------------|
| OmniCrawl | 数据采集太痛苦 |
| Ex-Memory | 想和 AI 聊天但 AI 没有人格 |
| Skeleton Anatomy | 解剖学学习工具太古老 |
| Statux | 终端里看不到 AI Agent 状态 |
| XIsland | macOS 没有 Dynamic Island |
| Tollow | 打字练习只有短句没有长文 |

## 开源

全部开源，全部免费。学生写邮件给我可以白嫖一切付费功能。`,
    date: '2026-07-05',
    category: 'story',
    readingTime: 4,
    tags: ['Meteor Store', '开源', '大学生'],
  },
  {
    slug: 'skeleton-anatomy-3d-web',
    title: '在浏览器里渲染完整人体骨骼：Skeleton Anatomy 开发笔记',
    excerpt:
      'Three.js + React 搭建 3D 医学教育应用的实战经验，包括模型优化、交互设计和移动端适配。',
    content: `## 目标

做一个能在浏览器里旋转、缩放、标注的完整人体骨骼 3D 模型。面向医学生和解剖学爱好者。

## 模型来源

骨骼模型来自开放的医学 3D 数据集，原始模型有 200 万面。直接加载会让浏览器崩溃。

### 优化流程

\`\`\`
原始模型 (2M 面) → Blender 简化 → 200K 面 → Draco 压缩 → 6MB GLB
\`\`\`

6MB 的 GLB 文件在首次加载后被缓存，后续打开秒加载。

## 交互设计

最大的挑战是在 3D 空间里做标注。我们的方案：

1. 每块骨骼有独立的 mesh ID
2. 点击骨骼 → Raycaster 命中 → 高亮 + 弹出信息面板
3. 信息面板跟随 3D 位置但渲染在 2D HTML 层

## 移动端

手机上用陀螺仪旋转骨骼是意料之外的好体验。支持双指缩放和单指旋转。`,
    date: '2026-06-28',
    category: 'product',
    readingTime: 6,
    tags: ['Three.js', '3D', '医学', 'Skeleton Anatomy'],
  },
];
