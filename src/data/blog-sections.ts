/**
 * 博客频道与分区的唯一数据源。
 * 新增/调整分区只改这个文件：类型、路由、筛选按钮、sitemap 都从这里推导。
 */
import type { Locale } from '@/i18n/routing';
import { FOUR_SYMBOLS, type FourSymbolId } from './celestial';

/** 双语文本：所有需要展示给用户的文本字段都用这个结构 */
export type LocalizedText = { zh: string; en: string };

export interface BlogChannel {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface BlogSection {
  id: string;
  /** URL 片段，形如 /blog/section/{slug} */
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
  channelId: BlogChannel['id'];
  /** 分区主题色的 RGB 通道值，供 CSS 变量做光晕/渐变/扫描线 */
  rgb: string;
  /** 是否在分区页展示「提议话题」表单 */
  allowProposals: boolean;
  /** 星象知识：分区对应的二十八宿与四象，用于分区页头部装饰 */
  star?: {
    sus: LocalizedText;
    beast: LocalizedText;
    symbolId: FourSymbolId;
    reason: LocalizedText;
  };
}

/** 拍平后的单语分区（按 locale 取值后的形状，供组件消费） */
export interface LocalizedBlogSection {
  id: string;
  slug: string;
  label: string;
  description: string;
  channelId: string;
  rgb: string;
  allowProposals: boolean;
  /** 当前 locale 下的星象徽章文本（如「参宿 · 西方白虎」） */
  star?: string;
  starReason?: string;
  starRgb?: string;
}

/** 拍平后的单语频道 */
export interface LocalizedBlogChannel {
  id: string;
  label: string;
  description: string;
}

export const blogChannels = [
  {
    id: 'dev',
    label: { zh: '产品 & 技术', en: 'Products & Tech' },
    description: {
      zh: '工具怎么做出来的，以及做的过程中踩过什么坑',
      en: 'How tools are built, and the pitfalls along the way',
    },
  },
  {
    id: 'humanities',
    label: { zh: '人文', en: 'Humanities' },
    description: {
      zh: '代码之外的部分：情绪、文字，和值得吵一架的问题',
      en: 'Beyond code: emotions, words, and questions worth arguing over',
    },
  },
] as const satisfies readonly BlogChannel[];

export const blogSections = [
  {
    id: 'product',
    slug: 'product',
    label: { zh: '产品动态', en: 'Product Updates' },
    description: {
      zh: '版本更新、新功能，以及为什么这么做',
      en: 'Version updates, new features, and the reasoning behind them',
    },
    channelId: 'dev',
    rgb: '167 139 250',
    allowProposals: false,
    star: {
      sus: { zh: '参宿', en: 'Cān Sù' },
      beast: { zh: '西方白虎', en: 'White Tiger' },
      symbolId: 'whiteTiger',
      reason: {
        zh: '参宿群星明列，取产品成列、各见其光之意',
        en: 'Its ordered stars evoke products taking shape and finding their light.',
      },
    },
  },
  {
    id: 'tech',
    slug: 'tech',
    label: { zh: '技术分享', en: 'Tech Notes' },
    description: {
      zh: '实现细节、架构取舍与踩坑记录',
      en: 'Implementation details, architectural trade-offs, and debugging notes',
    },
    channelId: 'dev',
    rgb: '56 189 248',
    allowProposals: false,
    star: {
      sus: { zh: '井宿', en: 'Jǐng Sù' },
      beast: { zh: '南方朱雀', en: 'Vermilion Bird' },
      symbolId: 'vermilionBird',
      reason: {
        zh: '井为基础，取技术深挖与共同供给之意',
        en: 'The Well evokes foundations, depth, and shared infrastructure.',
      },
    },
  },
  {
    id: 'story',
    slug: 'story',
    label: { zh: '幕后故事', en: 'Behind the Scenes' },
    description: {
      zh: '一个人做产品的日常与决策过程',
      en: 'The daily life and decision-making process of a solo builder',
    },
    channelId: 'dev',
    rgb: '251 191 36',
    allowProposals: false,
    star: {
      sus: { zh: '斗宿', en: 'Dǒu Sù' },
      beast: { zh: '北方玄武', en: 'Black Tortoise' },
      symbolId: 'blackTortoise',
      reason: {
        zh: '斗宿为北方玄武七宿之首，主体为南斗六星；取成长由岁月串成之意',
        en: 'The Dipper mansion heads the Black Tortoise; its main stars form the Southern Dipper — a story built across the years.',
      },
    },
  },
  {
    id: 'emotion',
    slug: 'emotion',
    label: { zh: '情感区', en: 'Emotions' },
    description: {
      zh: '关系、孤独与自我怀疑，不打算给出结论',
      en: 'Relationships, loneliness, and self-doubt — no conclusions intended',
    },
    channelId: 'humanities',
    rgb: '251 113 133',
    allowProposals: true,
    star: {
      sus: { zh: '心宿', en: 'Xīn Sù' },
      beast: { zh: '东方青龙', en: 'Azure Dragon' },
      symbolId: 'azureDragon',
      reason: {
        zh: '心为苍龙之心，照见关系与自省',
        en: "The Heart is the Azure Dragon's heart, fitting reflection and relationships.",
      },
    },
  },
  {
    id: 'literature',
    slug: 'literature',
    label: { zh: '文学区', en: 'Literature' },
    description: {
      zh: '散文、随笔与读书笔记',
      en: 'Essays, reflections, and reading notes',
    },
    channelId: 'humanities',
    rgb: '52 211 153',
    allowProposals: true,
    star: {
      sus: { zh: '奎宿', en: 'Kuí Sù' },
      beast: { zh: '西方白虎', en: 'White Tiger' },
      symbolId: 'whiteTiger',
      reason: {
        zh: '奎主文章，取文思与书写之意',
        en: 'Kui is traditionally linked with writing and literary talent.',
      },
    },
  },
  {
    id: 'debate',
    slug: 'debate',
    label: { zh: '辩论区', en: 'Debate' },
    description: {
      zh: '一个问题，正反两面都写清楚，结论留给读者',
      en: 'One question, both sides argued clearly, conclusion left to the reader',
    },
    channelId: 'humanities',
    rgb: '232 121 249',
    allowProposals: true,
    star: {
      sus: { zh: '觜宿', en: 'Zī Sù' },
      beast: { zh: '西方白虎', en: 'White Tiger' },
      symbolId: 'whiteTiger',
      reason: {
        zh: '觜有喙意，取言辞交锋之意',
        en: 'Zui evokes a beak: language sharpened through debate.',
      },
    },
  },
] as const satisfies readonly BlogSection[];

/** 从常量推导出的具体分区类型，比 BlogSection 更窄（id/slug 是字面量） */
export type BlogSectionEntry = (typeof blogSections)[number];
export type BlogSectionId = BlogSectionEntry['id'];

/** 按 locale 取分区的展示标签，返回 id→label 映射，供 RSS/分类等场景使用 */
export function getBlogSectionLabels(locale: Locale): Record<BlogSectionId, string> {
  return Object.fromEntries(
    blogSections.map((s) => [s.id, s.label[locale]]),
  ) as Record<BlogSectionId, string>;
}

export function getSectionById(id: string): BlogSectionEntry | undefined {
  return blogSections.find((s) => s.id === id);
}

export function getSectionBySlug(slug: string): BlogSectionEntry | undefined {
  return blogSections.find((s) => s.slug === slug);
}

/** 把分区的本地化字段按 locale 拍平成单语对象，方便组件直接消费 */
export function localizeSection(section: BlogSectionEntry, locale: Locale): LocalizedBlogSection {
  return {
    id: section.id,
    slug: section.slug,
    label: section.label[locale],
    description: section.description[locale],
    channelId: section.channelId,
    rgb: section.rgb,
    allowProposals: section.allowProposals,
    star: section.star ? `${section.star.sus[locale]} · ${section.star.beast[locale]}` : undefined,
    starReason: section.star?.reason[locale],
    starRgb: section.star ? FOUR_SYMBOLS[section.star.symbolId].rgb : undefined,
  };
}

/** 把频道的本地化字段按 locale 拍平成单语对象 */
export function localizeChannel(channel: BlogChannel, locale: Locale): LocalizedBlogChannel {
  return {
    id: channel.id,
    label: channel.label[locale],
    description: channel.description[locale],
  };
}

/** 按频道分组的分区，供分区导航栏使用（返回的是原始双语结构，按需 localize） */
export function getSectionsByChannel(): { channel: BlogChannel; sections: BlogSectionEntry[] }[] {
  return blogChannels.map((channel) => ({
    channel,
    sections: blogSections.filter((s) => s.channelId === channel.id),
  }));
}

/**
 * 分区主题色的 CSS 变量作用域。
 * 变量名刻意避开设计系统已占用的 --accent。
 */
export function blogScopeStyle(sectionId?: string): React.CSSProperties {
  const rgb = sectionId ? getSectionById(sectionId)?.rgb : undefined;
  return rgb ? ({ '--blog-accent': rgb } as React.CSSProperties) : {};
}
