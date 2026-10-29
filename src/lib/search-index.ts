// Spotlight 聚焦搜索 · 索引与匹配
// 纯函数实现，不依赖 DOM，便于单元测试

import { localizeProducts } from '@/data/products';
import { localizeFaqs } from '@/data/faqs';
import { SHOW_PRICING, categoryLabels } from '@/lib/constants';
import { blogSections, type LocalizedText } from '@/data/blog-sections';
import { getHeaderNavigation } from '@/data/header-navigation';
import { localizeHelpArticles } from '@/data/help-articles';
import type { Locale } from '@/i18n/routing';
import { pinyin } from 'pinyin-pro';

export const MAX_SEARCH_QUERY_LENGTH = 160;

export type SearchGroup = '产品' | '页面' | '帮助' | '博客' | '彩蛋';

export interface SearchEntry {
  id: string;
  title: string;
  subtitle?: string;
  group: SearchGroup;
  href: string;
  /** 参与匹配的全部文本（小写） */
  keywords: string;
  /** 标题拼音首字母，如 "首页" → "sy" */
  initials: string;
  /** 标题全拼（无声调、无空格），如 "首页" → "shouye" */
  fullPinyin: string;
}

function toPinyinInitials(str: string): string {
  return pinyin(str, { pattern: 'first', toneType: 'none', type: 'array' })
    .join('')
    .toLowerCase();
}

function toFullPinyin(str: string): string {
  return pinyin(str, { toneType: 'none', type: 'array' })
    .join('')
    .toLowerCase();
}

const STATIC_PAGES: Array<Omit<SearchEntry, 'keywords' | 'initials' | 'fullPinyin'> & { extra?: string }> = [
  { id: 'page-home', title: '首页', group: '页面', href: '/', extra: 'home index 主页' },
  { id: 'page-products', title: '全部产品', group: '页面', href: '/products', extra: 'products 工具 列表' },
  { id: 'anchor-lab', title: '实验室', subtitle: '产品页 · 做过的东西，全部免费', group: '页面', href: '/products#lab', extra: 'lab 实验室 免费 作品 试玩 流体 解剖 爬虫 打字' },
  { id: 'page-docs', title: '帮助中心', group: '页面', href: '/docs', extra: 'help docs 帮助 问题 解答 安装 授权' },
  { id: 'page-blog', title: '博客', group: '页面', href: '/blog', extra: 'blog 文章' },
  { id: 'page-story', title: '一封来自店主的信', subtitle: '作者小序 · 一个大学生和他的学费', group: '页面', href: '/story', extra: 'story 关于 作者 店主 小序 学费 流星雨' },
  { id: 'page-feedback', title: '反馈建议', subtitle: '深夜也有树洞', group: '页面', href: '/feedback', extra: 'feedback bug 建议 树洞' },
  { id: 'page-contact', title: '联系我们', group: '页面', href: '/contact', extra: 'contact 邮箱 email' },
  { id: 'page-student', title: '学生免费计划', subtitle: '用教育邮箱验证，全部产品免费', group: '页面', href: '/student', extra: 'student 学生 edu 教育 免费 优惠 大学' },
  { id: 'page-open-source', title: '开源项目', subtitle: 'MIT 协议的真开源项目', group: '页面', href: '/open-source', extra: 'open source 开源 github MIT' },
  { id: 'page-playground', title: 'Playground', subtitle: '在线试玩，不用安装', group: '页面', href: '/playground', extra: 'playground 试玩 demo 演示 体验' },
  { id: 'page-login', title: '登录 / 注册', subtitle: '邮箱登录或创建账户', group: '页面', href: '/login', extra: 'login register 登录 注册 账户 sign in sign up' },
  { id: 'anchor-products', title: '产品展示', subtitle: '首页 · 产品矩阵', group: '页面', href: '/#products', extra: '产品 矩阵 展示' },
  { id: 'anchor-faq', title: '常见问题', subtitle: '首页 · FAQ', group: '页面', href: '/#faq', extra: 'faq 常见 问题 疑问' },
  { id: 'anchor-terminal', title: '店主的终端', subtitle: '首页 · 会用的人自然会用', group: '页面', href: '/#terminal', extra: 'terminal 终端 命令 彩蛋' },
  ...(SHOW_PRICING
    ? [{ id: 'anchor-pricing', title: '定价', subtitle: 'Meteor Pass · 产品线通行证', group: '页面' as const, href: '/pricing', extra: 'pricing 价格 定价 方案 多少钱' }]
    : []),
];

const PAGE_ENGLISH: Record<string, { title: string; subtitle?: string }> = {
  'page-home': { title: 'Home' },
  'page-products': { title: 'All products' },
  'anchor-lab': { title: 'The lab', subtitle: 'Products · Free projects to explore' },
  'page-docs': { title: 'Help Center' },
  'page-blog': { title: 'Blog' },
  'page-story': { title: 'A letter from the creator', subtitle: 'A student, a small store and tuition' },
  'page-feedback': { title: 'Send feedback', subtitle: 'Ideas, questions and bug reports' },
  'page-contact': { title: 'Contact' },
  'page-student': { title: 'Free student plan', subtitle: 'Verify your education email for free access' },
  'page-open-source': { title: 'Open-source projects', subtitle: 'Projects released under the MIT license' },
  'page-playground': { title: 'Playground', subtitle: 'Try it online without installing' },
  'page-login': { title: 'Sign in / Register', subtitle: 'Sign in with email or create an account' },
  'anchor-products': { title: 'Product showcase', subtitle: 'Home · Explore the products' },
  'anchor-faq': { title: 'Frequently asked questions', subtitle: 'Home · FAQ' },
  'anchor-terminal': { title: 'Creator’s terminal', subtitle: 'Home · Explore the available commands' },
  'anchor-pricing': { title: 'Pricing', subtitle: 'Meteor Pass · XIsland product line' },
};

// 导航也含私人入口；只将已确认公开的路径纳入索引，新增私人页不会意外被收录。
const PUBLIC_NAV_PATHS = new Set([
  '/daily', '/masters', '/phd', '/pathfinder', '/pathfinder/directions/ai', '/pathfinder/plan',
  '/pathfinder/opportunities', '/pathfinder/topics', '/pathfinder/weekly',
  '/blog/tags', '/blog/api-guide', '/support',
]);
const NAV_SEARCH_ALIASES: Record<string, string> = {
  'daily-overview': '每日一新 日刊 日报 daily reading digest',
  masters: '硕士 研究生 申请 日历 留学 masters master graduate admissions calendar',
  phd: '博士 博士生 研究型 计算机 人工智能 申请 日历 留学 phd doctorate doctoral research admissions calendar CS AI',
  pathfinder: '学习路径 学习工具 学习机会 learning path tools opportunities',
  directions: '学习路径 学习方向 learning path roadmap directions',
  plan: '学习路径 学习计划 规划 learning path study planner plan',
  opportunities: '实习 应届 开源 比赛 竞赛 internship graduate open source competition opportunities',
};

function navigationPageEntries(locale: Locale): SearchEntry[] {
  return getHeaderNavigation(SHOW_PRICING).flatMap(group =>
    [group.overview, ...group.sections.flatMap(section => section.links)]
      .filter(link => PUBLIC_NAV_PATHS.has(link.href.split(/[?#]/)[0]))
      .map(link => withPinyin(link.id === 'daily-overview' ? group.label[locale] : link.label[locale], {
        id: `page-${link.id}`,
        title: link.id === 'daily-overview' ? group.label[locale] : link.label[locale],
        subtitle: link.description?.[locale] ?? group.description[locale],
        group: '页面',
        href: link.href,
        keywords: [link.label.zh, link.label.en, link.description?.[locale], group.label.zh, group.label.en,
          link.href, NAV_SEARCH_ALIASES[link.id] ?? ''].join(' ').toLowerCase(),
      })),
  );
}

/** 值得被"发现"的终端彩蛋命令（搜索也是彩蛋地图） */
const EGG_COMMANDS: Array<{ cmd: string; titleEn?: string; hint: LocalizedText; extra?: string }> = [
  { cmd: 'story', hint: { zh: '打开店主的一封信', en: 'Read a letter from the creator' } },
  { cmd: '白嫖', titleEn: 'Free access', hint: { zh: '真的可以，但求个星星', en: 'Free access, with a GitHub star welcome' }, extra: 'free star 免费 github 星星' },
  { cmd: 'meteor', hint: { zh: '召唤一场流星雨', en: 'Summon a meteor shower' }, extra: '流星 流星雨' },
  { cmd: 'hug', hint: { zh: '需要的时候用', en: 'A hug when you need one' }, extra: '抱抱 拥抱' },
  { cmd: '晚安', titleEn: 'Good night', hint: { zh: '深夜专用', en: 'For late nights' }, extra: 'goodnight' },
  { cmd: 'emo', hint: { zh: '也是给你的', en: 'A little encouragement for you' }, extra: '难受 迷茫 emo' },
  { cmd: 'coffee', hint: { zh: '本店动力来源', en: 'What keeps the store running' }, extra: '奶茶 咖啡' },
];

function withPinyin(title: string, entry: Omit<SearchEntry, 'initials' | 'fullPinyin'>): SearchEntry {
  return { ...entry, initials: toPinyinInitials(title), fullPinyin: toFullPinyin(title) };
}

/** 构建全站搜索索引（按 locale 构建并缓存） */


/** 博客文章最小数据：只需标题、摘要、路径、标签即可参与搜索 */
export interface BlogPostSearchData {
  title: string;
  excerpt: string;
  href: string;
  tags: string[];
}

/** 将博客文章转为搜索条目 */
export function blogPostsToEntries(posts: BlogPostSearchData[]): SearchEntry[] {
  return posts.map((post, i) =>
    withPinyin(post.title, {
      id: `blog-post-${i}`,
      title: post.title,
      subtitle: post.excerpt,
      group: '博客',
      href: post.href,
      keywords: [post.title, post.excerpt, ...post.tags, '博客 文章'].join(' ').toLowerCase(),
    }),
  );
}
export function buildIndex(locale: Locale): SearchEntry[] {
  const products = localizeProducts(locale);
  const productEntries: SearchEntry[] = products.map(p =>
    withPinyin(p.name, {
      id: `product-${p.id}`,
      title: p.name,
      subtitle: p.tagline,
      group: '产品',
      href: `/products/${p.id}`,
      keywords: [p.id, p.name, p.tagline, p.description, categoryLabels[p.category] || p.category, ...p.features]
        .join(' ')
        .toLowerCase(),
    }),
  );

  const pageEntries: SearchEntry[] = STATIC_PAGES.map(({ extra, ...page }) => {
    const localized = locale === 'en' ? PAGE_ENGLISH[page.id] : page;
    return withPinyin(localized.title, {
      ...page,
      ...localized,
      keywords: [page.title, localized.title, localized.subtitle || '', extra || ''].join(' ').toLowerCase(),
    });
  });

  const faqEntries: SearchEntry[] = localizeFaqs(locale, SHOW_PRICING)
    .map((f, i) =>
      withPinyin(f.question, {
        id: `faq-${i}`,
        title: f.question,
        subtitle: locale === 'zh' ? '常见问题' : 'Frequently asked questions',
        group: '帮助',
        href: '/#faq',
        keywords: `${f.question} ${f.answer}`.toLowerCase(),
      }),
    );

  const helpArticleEntries: SearchEntry[] = localizeHelpArticles(locale).map(article =>
    withPinyin(article.title, {
      id: `help-article-${article.slug}`,
      title: article.title,
      subtitle: article.excerpt,
      group: '帮助',
      href: `/docs/${article.slug}`,
      keywords: [article.title, article.excerpt, ...article.keywords].join(' ').toLowerCase(),
    }),
  );

  const sectionEntries: SearchEntry[] = blogSections.map(s =>
    withPinyin(s.label[locale], {
      id: `blog-section-${s.id}`,
      title: s.label[locale],
      subtitle: `${locale === 'zh' ? '博客分区' : 'Blog section'} · ${s.description[locale]}`,
      group: '页面',
      href: `/blog/section/${s.slug}`,
      keywords: [s.id, s.slug, s.label[locale], s.description[locale], '博客 分区 blog'].join(' ').toLowerCase(),
    }),
  );

  const eggEntries: SearchEntry[] = EGG_COMMANDS.map(e =>
    withPinyin(locale === 'en' ? e.titleEn ?? e.cmd : e.cmd, {
      id: `egg-${e.cmd}`,
      title: locale === 'en' ? e.titleEn ?? e.cmd : e.cmd,
      subtitle: `${locale === 'zh' ? '终端命令' : 'Terminal command'} · ${e.hint[locale]}`,
      group: '彩蛋',
      href: '/#terminal',
      keywords: `${e.cmd} ${e.hint[locale]} ${e.extra || ''} 命令 彩蛋`.toLowerCase(),
    }),
  );

  return [
    ...productEntries,
    ...pageEntries,
    ...navigationPageEntries(locale),
    ...sectionEntries,
    ...helpArticleEntries,
    ...faqEntries,
    ...eggEntries,
  ];
}

const cachedIndexes: Partial<Record<Locale, SearchEntry[]>> = {};
export function getIndex(locale: Locale): SearchEntry[] {
  if (!cachedIndexes[locale]) cachedIndexes[locale] = buildIndex(locale);
  return cachedIndexes[locale]!;
}

/** 判断 term 是否全由 ASCII 字母组成（即可能是拼音输入） */
const isLatin = (s: string) => /^[a-z]+$/.test(s);

/** 单条目对单词项打分：标题 > 拼音首字母 > 全拼 > 副标题 > 关键词 */
function scoreTerm(entry: SearchEntry, term: string): number {
  const title = entry.title.toLowerCase();
  if (title.startsWith(term)) return 100;
  if (title.includes(term)) return 60;

  if (isLatin(term)) {
    if (entry.initials.startsWith(term)) return 90;
    if (entry.initials.includes(term)) return 55;
    if (entry.fullPinyin.startsWith(term)) return 50;
    if (entry.fullPinyin.includes(term)) return 35;
  }

  if (entry.subtitle && entry.subtitle.toLowerCase().includes(term)) return 40;
  if (entry.keywords.includes(term)) return 20;

  if (isLatin(term) && entry.subtitle) {
    const subInitials = toPinyinInitials(entry.subtitle);
    if (subInitials.includes(term)) return 30;
  }

  return 0;
}

/** 内部搜索实现：对给定索引执行搜索，不依赖 locale 缓存 */
// ── 分组过滤前缀 ──────────────────────────────────────

export interface ParsedQuery {
  /** 去掉前缀后的实际搜索词 */
  query: string;
  /** 限定分组（null = 不限） */
  groupFilter: SearchGroup | null;
}

const FILTER_PREFIXES: Array<{ prefix: string; group: SearchGroup }> = [
  { prefix: 'blog:', group: '博客' },
  { prefix: 'help:', group: '帮助' },
  { prefix: '产品:', group: '产品' },
  { prefix: 'page:', group: '页面' },
];

/** 解析搜索输入中的分组过滤前缀 */
export function parseSearchQuery(input: string): ParsedQuery {
  const trimmed = input.trim();
  // @前缀 → 产品
  if (trimmed.startsWith('@')) {
    return { query: trimmed.slice(1).trim(), groupFilter: '产品' };
  }
  for (const { prefix, group } of FILTER_PREFIXES) {
    if (trimmed.toLowerCase().startsWith(prefix)) {
      return { query: trimmed.slice(prefix.length).trim(), groupFilter: group };
    }
  }
  return { query: trimmed, groupFilter: null };
}

interface SearchResult {
  entry: SearchEntry;
  /** 是否由模糊匹配兜底命中 */
  fuzzy: boolean;
}

function searchInIndex(index: SearchEntry[], query: string, limit: number, groupFilter: SearchGroup | null = null): SearchResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  // 分组过滤
  const candidates = groupFilter ? index.filter(e => e.group === groupFilter) : index;
  if (terms.length === 0) return [];

  const exact: SearchResult[] = candidates
    .map(entry => {
      let total = 0;
      for (const term of terms) {
        const s = scoreTerm(entry, term);
        if (s === 0) return null;
        total += s;
      }
      return { entry, total };
    })
    .filter((r): r is { entry: SearchEntry; total: number } => r !== null)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map(r => ({ entry: r.entry, fuzzy: false }));

  // 模糊匹配兜底：精确结果不足 3 条时补几个
  if (exact.length < 3) {
    const fuzzy = fuzzySearch(candidates, query, limit - exact.length);
    const exactIds = new Set(exact.map(e => e.entry.id));
    for (const f of fuzzy) {
      if (!exactIds.has(f.id)) exact.push({ entry: f, fuzzy: true });
    }
  }

  return exact;
}

/**
 * 搜索：多词项须全部命中（AND），得分求和排序。
 * 中文靠子串匹配天然可用；拉丁字母自动匹配拼音首字母与全拼。
 */
export function searchEntries(query: string, locale: Locale, limit = 8): SearchEntry[] {
  const parsed = parseSearchQuery(query);
  const results = searchInIndex(getIndex(locale), parsed.query, limit, parsed.groupFilter);
  return results.map(r => r.entry);
}

/** 返回带模糊标记的搜索结果 */
export function searchEntriesWithMeta(query: string, locale: Locale, limit = 8): { results: SearchEntry[]; hasFuzzy: boolean } {
  const parsed = parseSearchQuery(query);
  const results = searchInIndex(getIndex(locale), parsed.query, limit, parsed.groupFilter);
  return {
    results: results.map(r => r.entry),
    hasFuzzy: results.some(r => r.fuzzy),
  };
}

/**
 * 搜索（含博客文章）：服务端用，比 searchEntries 多索引了博客文章。
 * blogPosts 来自 getFeedPosts()，因异步读取数据库而不能进客户端同步索引。
 */
export function searchEntriesWithBlogPosts(
  query: string,
  locale: Locale,
  blogPosts: BlogPostSearchData[],
  limit = 8,
): SearchEntry[] {
  const parsed = parseSearchQuery(query);
  const baseIndex = getIndex(locale);
  const blogEntries = blogPostsToEntries(blogPosts);
  const results = searchInIndex([...baseIndex, ...blogEntries], parsed.query, limit, parsed.groupFilter);
  return results.map(r => r.entry);
}

/** 搜索（含博客文章 + 模糊标记），供 API 端点使用 */
export function searchEntriesWithBlogPostsMeta(
  query: string,
  locale: Locale,
  blogPosts: BlogPostSearchData[],
  limit = 8,
): { results: SearchEntry[]; hasFuzzy: boolean } {
  const parsed = parseSearchQuery(query);
  const baseIndex = getIndex(locale);
  const blogEntries = blogPostsToEntries(blogPosts);
  const results = searchInIndex([...baseIndex, ...blogEntries], parsed.query, limit, parsed.groupFilter);
  return {
    results: results.map(r => r.entry),
    hasFuzzy: results.some(r => r.fuzzy),
  };
}


// ── 快速计算 ──────────────────────────────────────────

/** 快速计算结果，客户端即时求值不依赖 API */
export interface QuickMathResult {
  expression: string;
  result: string;
}

const MATH_SAFE = /^[\d\s+\-*/.%()^]*$/;
const MATH_HAS_NUMBER = /\d/;

export function tryQuickMath(query: string): QuickMathResult | null {
  const trimmed = query.trim();
  if (!MATH_HAS_NUMBER.test(trimmed) || !MATH_SAFE.test(trimmed)) return null;
  if (!/[+\-*/%^]/.test(trimmed.replace(/\s/g, ''))) return null;
  try {
    const expr = trimmed.replace(/\^/g, '**');
    const result = Function('"use strict"; return (' + expr + ')')();
    if (result === undefined || result === null || !Number.isFinite(result)) return null;
    return { expression: trimmed, result: String(Math.round(result * 1e10) / 1e10) };
  } catch {
    return null;
  }
}

// ── 模糊匹配 ──────────────────────────────────────────

/** Levenshtein 编辑距离 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** 在索引中用模糊匹配兜底（编辑距离 ≤ 2），返回低优先级的备选结果 */
function fuzzySearch(index: SearchEntry[], query: string, limit: number): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const scored = index
    .map(entry => {
      const title = entry.title.toLowerCase();
      // 长度差已经超过允许距离时，不必执行二次复杂度的编辑距离计算。
      if (Math.abs(q.length - title.length) > 2) return null;
      const d = levenshtein(q, title);
      if (d > 2) return null;
      return { entry, total: Math.max(0, 10 - d * 3) };
    })
    .filter((r): r is { entry: SearchEntry; total: number } => r !== null)
    .sort((a, b) => b.total - a.total)
    .slice(0, Math.min(3, limit));
  return scored.map(r => r.entry);
}

// ── 路径面包屑 ────────────────────────────────────────

const GROUP_BREADCRUMB: Record<SearchGroup, LocalizedText> = {
  '产品': { zh: '全部产品', en: 'All products' },
  '页面': { zh: '', en: '' },
  '帮助': { zh: '帮助中心', en: 'Help Center' },
  '博客': { zh: '博客', en: 'Blog' },
  '彩蛋': { zh: '店主的终端', en: 'Creator’s terminal' },
};

const GROUP_ROOT: Record<SearchGroup, string> = {
  '产品': '/products',
  '页面': '/',
  '帮助': '/docs',
  '博客': '/blog',
  '彩蛋': '/',
};

/** 获取条目的路径面包屑，用于显示"所属分类 > 条目名" */
export function getBreadcrumb(entry: SearchEntry, locale: Locale = 'zh'): { label: string; href: string } | null {
  const rootLabel = GROUP_BREADCRUMB[entry.group]?.[locale];
  if (rootLabel == null) return null;
  return { label: rootLabel, href: GROUP_ROOT[entry.group] };
}

// ── 高亮 ──────────────────────────────────────────────

export interface HighlightRange {
  start: number;
  end: number;
}

function mergeRanges(ranges: HighlightRange[]): HighlightRange[] {
  if (ranges.length <= 1) return ranges;
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: HighlightRange[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    if (sorted[i].start <= prev.end) {
      prev.end = Math.max(prev.end, sorted[i].end);
    } else {
      merged.push({ ...sorted[i] });
    }
  }
  return merged;
}

export function getHighlightRanges(text: string, query: string): HighlightRange[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];


  const chars = Array.from(text);
  const textLower = chars.map(c => c.toLowerCase()).join('');
  const ranges: HighlightRange[] = [];

  for (const term of terms) {
    const directIdx = textLower.indexOf(term);
    if (directIdx >= 0) {
      ranges.push({ start: directIdx, end: directIdx + term.length });
      continue;
    }

    if (!isLatin(term)) continue;

    const charInitials = chars.map(ch => {
      const code = ch.codePointAt(0) || 0;
      if (code < 0x4E00 || code > 0x9FFF) return ch.toLowerCase();
      return (pinyin(ch, { pattern: 'first', toneType: 'none' }) || ch).toLowerCase().charAt(0);
    });
    const initIdx = charInitials.join('').indexOf(term);
    if (initIdx >= 0) {
      ranges.push({ start: initIdx, end: initIdx + term.length });
      continue;
    }

    const charPys = chars.map(ch => {
      const code = ch.codePointAt(0) || 0;
      if (code < 0x4E00 || code > 0x9FFF) return ch.toLowerCase();
      return (pinyin(ch, { toneType: 'none' }) || ch).toLowerCase();
    });
    const cum: number[] = [0];
    for (const py of charPys) cum.push(cum[cum.length - 1] + py.length);
    const pyIdx = charPys.join('').indexOf(term);
    if (pyIdx >= 0) {
      const pyEnd = pyIdx + term.length;
      let sc = 0;
      while (sc < chars.length && cum[sc + 1] <= pyIdx) sc++;
      let ec = sc + 1;
      while (ec < chars.length && cum[ec] < pyEnd) ec++;
      ranges.push({ start: sc, end: ec });
      continue;
    }
  }

  return mergeRanges(ranges);
}
