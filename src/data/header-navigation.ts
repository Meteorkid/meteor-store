import { blogChannels, blogSections, type LocalizedText } from './blog-sections';
import { flagshipProductIds, funnelProductIds, type productLineIds } from './product-tracks';
import { dailyEditionChannels } from '@/lib/daily/channels';

export type HeaderNavLink = {
  id: string;
  href: string;
  label: LocalizedText;
  description?: LocalizedText;
};

export type HeaderNavGroup = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  overview: HeaderNavLink;
  sections: { id: string; label: LocalizedText; links: HeaderNavLink[] }[];
};

const productLabels: Record<(typeof productLineIds)[number], LocalizedText> = {
  xisland: { zh: 'XIsland', en: 'XIsland' },
  xnook: { zh: 'XNook', en: 'XNook' },
  statux: { zh: 'Statux', en: 'Statux' },
  'claude-phone-control': { zh: 'Claude 手机控制', en: 'Claude Phone Control' },
  'cursor-source-analyzer': { zh: 'Cursor 源码分析器', en: 'Cursor Source Analyzer' },
};

/** 栏目与分区沿用各自的唯一配置，Header 不加载产品详情或协议校验库。 */
export function getHeaderNavigation(showPricing: boolean): HeaderNavGroup[] {
  const dailyLinks = dailyEditionChannels.map(channel => ({
    id: channel.id,
    href: `/daily?view=all#${channel.id}`,
    label: { zh: channel.zh, en: channel.en },
    description: { zh: channel.descriptionZh, en: channel.descriptionEn },
  }));

  return [
    {
      id: 'products', label: { zh: '产品', en: 'Products' },
      description: { zh: '桌面工具、免费项目与在线体验。', en: 'Desktop tools, free projects and browser experiences.' },
      overview: { id: 'all-products', href: '/products', label: { zh: '查看全部产品', en: 'Explore all products' } },
      sections: [
        {
          id: 'flagship', label: { zh: '主线产品', en: 'Featured products' },
          links: [
            ...flagshipProductIds.map(id => ({ id, href: `/products/${id}`, label: productLabels[id] })),
            ...(showPricing ? [{ id: 'pricing', href: '/pricing', label: { zh: 'Meteor Pass 与定价', en: 'Meteor Pass & pricing' } }] : []),
          ],
        },
        {
          id: 'free-tools', label: { zh: '免费工具', en: 'Free tools' },
          links: funnelProductIds.map(id => ({ id, href: `/products/${id}`, label: productLabels[id] })),
        },
        {
          id: 'explore', label: { zh: '探索更多', en: 'Explore more' },
          links: [
            { id: 'lab', href: '/products#lab', label: { zh: '实验室', en: 'The lab' } },
            { id: 'playground', href: '/playground', label: { zh: '在线体验', en: 'Playground' } },
            { id: 'open-source', href: '/open-source', label: { zh: '开源作品', en: 'Open-source projects' } },
          ],
        },
      ],
    },
    {
      id: 'daily', label: { zh: '每日一新', en: 'Daily' },
      description: { zh: '七个日刊栏目，另有全年硕士申请日历。', en: 'Seven daily channels, plus a year-round master’s calendar.' },
      overview: { id: 'daily-overview', href: '/daily', label: { zh: '打开今日阅读', en: 'Open today’s reading' } },
      sections: [
        { id: 'reading', label: { zh: '每天读一点', en: 'Read a little' }, links: dailyLinks.slice(0, 2) },
        { id: 'updates', label: { zh: '关注新动态', en: 'Stay informed' }, links: dailyLinks.slice(2, 4) },
        { id: 'opportunities', label: { zh: '发现新机会', en: 'Find opportunities' }, links: dailyLinks.slice(4) },
      ],
    },
    {
      id: 'learn', label: { zh: '学习与机会', en: 'Learn & explore' },
      description: { zh: '按方向学习，寻找机会，跟进申请。', en: 'Find a learning direction, explore opportunities and track applications.' },
      overview: { id: 'pathfinder', href: '/pathfinder', label: { zh: '探索 Pathfinder', en: 'Explore Pathfinder' } },
      sections: [
        {
          id: 'learning', label: { zh: '找到学习方向', en: 'Build a learning path' },
          links: [
            { id: 'directions', href: '/pathfinder/directions/ai', label: { zh: '学习方向', en: 'Learning directions' } },
            { id: 'plan', href: '/pathfinder/plan', label: { zh: '学习计划', en: 'Study planner' } },
          ],
        },
        {
          id: 'opportunities', label: { zh: '机会与申请', en: 'Opportunities & applications' },
          links: [
            { id: 'opportunities', href: '/pathfinder/opportunities', label: { zh: '机会库', en: 'Opportunity catalog' } },
            { id: 'masters', href: '/masters', label: { zh: '硕士申请日历', en: 'Master’s application calendar' } },
            { id: 'phd', href: '/phd', label: { zh: '博士申请日历', en: 'PhD application calendar' } },
          ],
        },
        {
          id: 'discover', label: { zh: '继续发现', en: 'Keep exploring' },
          links: [
            { id: 'topics', href: '/pathfinder/topics', label: { zh: '按主题浏览', en: 'Browse topics' } },
            { id: 'weekly', href: '/pathfinder/weekly', label: { zh: '本周精选', en: 'Weekly picks' } },
            { id: 'saved', href: '/pathfinder/saved', label: { zh: '我的收藏', en: 'Saved opportunities' } },
          ],
        },
      ],
    },
    {
      id: 'content', label: { zh: '内容', en: 'Writing' },
      description: { zh: '产品与技术，也聊代码之外的生活。', en: 'Products, technology and life beyond code.' },
      overview: { id: 'blog', href: '/blog', label: { zh: '阅读全部文章', en: 'Read all articles' } },
      sections: [
        ...blogChannels.map(channel => ({
          id: channel.id,
          label: channel.label,
          links: blogSections.filter(section => section.channelId === channel.id).map(section => ({
            id: section.id, href: `/blog/section/${section.slug}`, label: section.label, description: section.description,
          })),
        })),
        {
          id: 'browse-write', label: { zh: '浏览与创作', en: 'Browse & contribute' },
          links: [
            { id: 'tags', href: '/blog/tags', label: { zh: '文章标签', en: 'Article tags' } },
            { id: 'api-guide', href: '/blog/api-guide', label: { zh: '投稿 API 指南', en: 'Publishing API guide' } },
          ],
        },
      ],
    },
    {
      id: 'help', label: { zh: '帮助', en: 'Help' },
      description: { zh: '了解这个小站，找到答案，或告诉我你的想法。', en: 'Get to know the site, find answers or share your feedback.' },
      overview: { id: 'docs', href: '/docs', label: { zh: '打开帮助中心', en: 'Visit the help center' } },
      sections: [
        {
          id: 'about', label: { zh: '认识这里', en: 'About this place' },
          links: [
            { id: 'story', href: '/story', label: { zh: '小站故事', en: 'Our story' } },
            { id: 'support', href: '/support', label: { zh: '支持作者', en: 'Support the creator' } },
          ],
        },
        {
          id: 'contact', label: { zh: '联系与反馈', en: 'Get in touch' },
          links: [
            { id: 'contact', href: '/contact', label: { zh: '联系我', en: 'Contact' } },
            { id: 'feedback', href: '/feedback', label: { zh: '问题反馈', en: 'Send feedback' } },
          ],
        },
      ],
    },
  ];
}

/** pathname 无法区分同页的栏目与筛选，不把多个深链同时标成当前页。 */
export function isHeaderLinkActive(href: string, pathname: string): boolean {
  return !/[?#]/.test(href) && href === pathname;
}
