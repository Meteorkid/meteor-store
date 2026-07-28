/**
 * 博客频道与分区的唯一数据源。
 * 新增/调整分区只改这个文件：类型、路由、筛选按钮、sitemap 都从这里推导。
 */

export interface BlogChannel {
  id: string;
  label: string;
  description: string;
}

export interface BlogSection {
  id: string;
  /** URL 片段，形如 /blog/section/{slug} */
  slug: string;
  label: string;
  description: string;
  channelId: BlogChannel['id'];
  /** 分区徽章配色，写成完整 class 串以便 Tailwind 静态提取 */
  accent: string;
  /** 分区主题色的 RGB 通道值，供 CSS 变量做光晕/渐变/扫描线 */
  rgb: string;
  /** 是否在分区页展示「提议话题」表单 */
  allowProposals: boolean;
}

export const blogChannels = [
  {
    id: 'dev',
    label: '产品 & 技术',
    description: '工具怎么做出来的，以及做的过程中踩过什么坑',
  },
  {
    id: 'humanities',
    label: '人文',
    description: '代码之外的部分：情绪、文字，和值得吵一架的问题',
  },
] as const satisfies readonly BlogChannel[];

export const blogSections = [
  {
    id: 'product',
    slug: 'product',
    label: '产品动态',
    description: '版本更新、新功能，以及为什么这么做',
    channelId: 'dev',
    accent: 'bg-violet-500/10 text-violet-300 ring-violet-500/30',
    rgb: '167 139 250',
    allowProposals: false,
  },
  {
    id: 'tech',
    slug: 'tech',
    label: '技术分享',
    description: '实现细节、架构取舍与踩坑记录',
    channelId: 'dev',
    accent: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
    rgb: '56 189 248',
    allowProposals: false,
  },
  {
    id: 'story',
    slug: 'story',
    label: '幕后故事',
    description: '一个人做产品的日常与决策过程',
    channelId: 'dev',
    accent: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    rgb: '251 191 36',
    allowProposals: false,
  },
  {
    id: 'emotion',
    slug: 'emotion',
    label: '情感区',
    description: '关系、孤独与自我怀疑，不打算给出结论',
    channelId: 'humanities',
    accent: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
    rgb: '251 113 133',
    allowProposals: true,
  },
  {
    id: 'literature',
    slug: 'literature',
    label: '文学区',
    description: '散文、随笔与读书笔记',
    channelId: 'humanities',
    accent: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
    rgb: '52 211 153',
    allowProposals: true,
  },
  {
    id: 'debate',
    slug: 'debate',
    label: '辩论区',
    description: '一个问题，正反两面都写清楚，结论留给读者',
    channelId: 'humanities',
    accent: 'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/30',
    rgb: '232 121 249',
    allowProposals: true,
  },
] as const satisfies readonly BlogSection[];

/** 从常量推导出的具体分区类型，比 BlogSection 更窄（id/slug 是字面量） */
export type BlogSectionEntry = (typeof blogSections)[number];
export type BlogSectionId = BlogSectionEntry['id'];

export const blogSectionLabels = Object.fromEntries(
  blogSections.map((s) => [s.id, s.label]),
) as Record<BlogSectionId, string>;

export function getSectionById(id: string): BlogSectionEntry | undefined {
  return blogSections.find((s) => s.id === id);
}

export function getSectionBySlug(slug: string): BlogSectionEntry | undefined {
  return blogSections.find((s) => s.slug === slug);
}

/** 按频道分组的分区，供分区导航栏使用 */
export function getSectionsByChannel(): { channel: BlogChannel; sections: BlogSectionEntry[] }[] {
  return blogChannels.map((channel) => ({
    channel,
    sections: blogSections.filter((s) => s.channelId === channel.id),
  }));
}
