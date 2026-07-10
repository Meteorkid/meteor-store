// Spotlight 聚焦搜索 · 索引与匹配
// 纯函数实现，不依赖 DOM，便于单元测试

import { products } from '@/data/products';
import { allFaqs } from '@/components/FAQSection';
import { SHOW_PRICING, categoryLabels } from '@/lib/constants';

export type SearchGroup = '产品' | '页面' | '帮助' | '彩蛋';

export interface SearchEntry {
  id: string;
  title: string;
  subtitle?: string;
  group: SearchGroup;
  href: string;
  /** 参与匹配的全部文本（小写） */
  keywords: string;
}

const STATIC_PAGES: Array<Omit<SearchEntry, 'keywords'> & { extra?: string }> = [
  { id: 'page-home', title: '首页', group: '页面', href: '/', extra: 'home index 主页' },
  { id: 'page-products', title: '全部产品', group: '页面', href: '/products', extra: 'products 工具 列表' },
  { id: 'page-docs', title: '文档', group: '页面', href: '/docs', extra: 'docs 使用 指南 快速上手' },
  { id: 'page-blog', title: '博客', group: '页面', href: '/blog', extra: 'blog 文章' },
  { id: 'page-story', title: '一封来自店主的信', subtitle: '作者小序 · 一个大学生和他的学费', group: '页面', href: '/story', extra: 'story 关于 作者 店主 小序 学费 流星雨' },
  { id: 'page-feedback', title: '反馈建议', subtitle: '深夜也有树洞', group: '页面', href: '/feedback', extra: 'feedback bug 建议 树洞' },
  { id: 'page-contact', title: '联系我们', group: '页面', href: '/contact', extra: 'contact 邮箱 email' },
  { id: 'page-student', title: '学生免费计划', subtitle: '用教育邮箱验证，全部产品免费', group: '页面', href: '/student', extra: 'student 学生 edu 教育 免费 优惠 大学' },
  { id: 'page-open-source', title: '开源项目', subtitle: '全部开源，全部免费', group: '页面', href: '/open-source', extra: 'open source 开源 github' },
  { id: 'page-playground', title: 'Playground', subtitle: '在线试玩，不用安装', group: '页面', href: '/playground', extra: 'playground 试玩 demo 演示 体验' },
  { id: 'page-login', title: '登录 / 注册', subtitle: '邮箱登录或创建账户', group: '页面', href: '/login', extra: 'login register 登录 注册 账户 sign in sign up' },
  { id: 'anchor-products', title: '产品展示', subtitle: '首页 · 产品矩阵', group: '页面', href: '/#products', extra: '产品 矩阵 展示' },
  { id: 'anchor-faq', title: '常见问题', subtitle: '首页 · FAQ', group: '页面', href: '/#faq', extra: 'faq 常见 问题 疑问' },
  { id: 'anchor-terminal', title: '店主的终端', subtitle: '首页 · 会用的人自然会用', group: '页面', href: '/#terminal', extra: 'terminal 终端 命令 彩蛋' },
  ...(SHOW_PRICING
    ? [{ id: 'anchor-pricing', title: '定价', subtitle: '首页 · 价格方案', group: '页面' as const, href: '/#pricing', extra: 'pricing 价格 定价 方案 多少钱' }]
    : []),
];

/** 值得被"发现"的终端彩蛋命令（搜索也是彩蛋地图） */
const EGG_COMMANDS: Array<{ cmd: string; hint: string; extra?: string }> = [
  { cmd: 'story', hint: '打开店主的一封信' },
  { cmd: '白嫖', hint: '真的可以，但求个星星', extra: 'free star 免费 github 星星' },
  { cmd: 'meteor', hint: '召唤一场流星雨', extra: '流星 流星雨' },
  { cmd: 'hug', hint: '需要的时候用', extra: '抱抱 拥抱' },
  { cmd: '晚安', hint: '深夜专用', extra: 'goodnight' },
  { cmd: 'emo', hint: '也是给你的', extra: '难受 迷茫 emo' },
  { cmd: 'coffee', hint: '本店动力来源', extra: '奶茶 咖啡' },
];

/** 构建全站搜索索引（构建一次，模块级缓存） */
export function buildIndex(): SearchEntry[] {
  const productEntries: SearchEntry[] = products.map(p => ({
    id: `product-${p.id}`,
    title: p.name,
    subtitle: p.tagline,
    group: '产品',
    href: `/products/${p.id}`,
    keywords: [p.id, p.name, p.tagline, p.description, categoryLabels[p.category] || p.category, ...p.features]
      .join(' ')
      .toLowerCase(),
  }));

  const pageEntries: SearchEntry[] = STATIC_PAGES.map(({ extra, ...page }) => ({
    ...page,
    keywords: [page.title, page.subtitle || '', extra || ''].join(' ').toLowerCase(),
  }));

  const faqEntries: SearchEntry[] = allFaqs
    .filter(f => SHOW_PRICING || !f.commercial)
    .map((f, i) => ({
      id: `faq-${i}`,
      title: f.question,
      subtitle: '常见问题',
      group: '帮助',
      href: '/#faq',
      keywords: `${f.question} ${f.answer}`.toLowerCase(),
    }));

  const eggEntries: SearchEntry[] = EGG_COMMANDS.map(e => ({
    id: `egg-${e.cmd}`,
    title: e.cmd,
    subtitle: `终端命令 · ${e.hint}`,
    group: '彩蛋',
    href: '/#terminal',
    keywords: `${e.cmd} ${e.hint} ${e.extra || ''} 命令 彩蛋`.toLowerCase(),
  }));

  return [...productEntries, ...pageEntries, ...faqEntries, ...eggEntries];
}

let cachedIndex: SearchEntry[] | null = null;
export function getIndex(): SearchEntry[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

/** 单条目对单词项打分：标题前缀 > 标题包含 > 副标题包含 > 关键词包含 */
function scoreTerm(entry: SearchEntry, term: string): number {
  const title = entry.title.toLowerCase();
  if (title.startsWith(term)) return 100;
  if (title.includes(term)) return 60;
  if (entry.subtitle && entry.subtitle.toLowerCase().includes(term)) return 40;
  if (entry.keywords.includes(term)) return 20;
  return 0;
}

/**
 * 搜索：多词项须全部命中（AND），得分求和排序。
 * 中文靠子串匹配天然可用；空查询返回空。
 */
export function searchEntries(query: string, limit = 8, index: SearchEntry[] = getIndex()): SearchEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return index
    .map(entry => {
      let total = 0;
      for (const term of terms) {
        const s = scoreTerm(entry, term);
        if (s === 0) return null; // 有词项未命中，整条淘汰
        total += s;
      }
      return { entry, total };
    })
    .filter((r): r is { entry: SearchEntry; total: number } => r !== null)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map(r => r.entry);
}
