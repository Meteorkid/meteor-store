import type { Locale } from '@/i18n/routing';

export type HelpCategory = 'getting-started' | 'account' | 'products' | 'community' | 'tools' | 'support';

export type HelpArticleKind = 'tutorial' | 'how-to' | 'troubleshooting' | 'policy';

interface LocalizedText {
  zh: string;
  en: string;
}

interface LocalizedKeywords {
  zh: string[];
  en: string[];
}

export interface HelpCategoryMeta {
  id: HelpCategory;
  order: number;
  label: LocalizedText;
}

export interface HelpArticleMeta {
  slug: string;
  category: HelpCategory;
  kind: HelpArticleKind;
  order: number;
  readingMinutes: number;
  updatedAt: string;
  featured?: boolean;
  commercial: boolean;
  relatedSlugs: string[];
  title: LocalizedText;
  excerpt: LocalizedText;
  keywords: LocalizedKeywords;
}

export interface LocalizedHelpArticle {
  slug: string;
  category: HelpCategory;
  kind: HelpArticleKind;
  order: number;
  readingMinutes: number;
  updatedAt: string;
  featured?: boolean;
  commercial: boolean;
  relatedSlugs: string[];
  title: string;
  excerpt: string;
  keywords: string[];
}

export const helpCategories: HelpCategoryMeta[] = [
  { id: 'getting-started', order: 1, label: { zh: '初识与导航', en: 'Getting Started' } },
  { id: 'account', order: 2, label: { zh: '账户与资格', en: 'Account & Eligibility' } },
  { id: 'products', order: 3, label: { zh: '产品获取与使用', en: 'Products & Access' } },
  { id: 'community', order: 4, label: { zh: '博客与社区', en: 'Blog & Community' } },
  { id: 'tools', order: 5, label: { zh: '在线工具', en: 'Online Tools' } },
  { id: 'support', order: 6, label: { zh: '售后与支持', en: 'Support & Policies' } },
];

export const helpArticles: HelpArticleMeta[] = [
  // ========== 初识与导航 (4) ==========
  {
    slug: 'start-here',
    category: 'getting-started',
    kind: 'tutorial',
    order: 10,
    readingMinutes: 4,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['navigate-and-search', 'understand-product-types'],
    title: { zh: '第一次使用 Meteor Store', en: 'First Time Using Meteor Store' },
    excerpt: {
      zh: '了解 Meteor Store 是什么、首页有哪些区域，以及从哪里开始探索。',
      en: 'Learn what Meteor Store is, what sections the homepage has, and where to start exploring.',
    },
    keywords: {
      zh: ['Meteor Store', '新手', '首页', '导览', '入门'],
      en: ['Meteor Store', 'newcomer', 'homepage', 'overview', 'getting started'],
    },
  },
  {
    slug: 'navigate-and-search',
    category: 'getting-started',
    kind: 'how-to',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['start-here'],
    title: { zh: '如何使用导航、语言切换与全站搜索', en: 'How to Navigate, Switch Languages & Search' },
    excerpt: {
      zh: '掌握顶部导航栏、中英文切换、Spotlight 全站搜索 (⌘K) 和页脚链接。',
      en: 'Master the top navigation bar, language switcher, Spotlight search (⌘K), and footer links.',
    },
    keywords: {
      zh: ['导航', '语言切换', '搜索', 'Spotlight', '页脚'],
      en: ['navigation', 'language switch', 'search', 'Spotlight', 'footer'],
    },
  },
  {
    slug: 'understand-product-types',
    category: 'getting-started',
    kind: 'how-to',
    order: 30,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['online-trial-vs-full-access'],
    title: { zh: '了解网站中的产品类型', en: 'Understanding Product Types on the Site' },
    excerpt: {
      zh: '区分站内应用、可下载应用和授权码产品这三种类型及其使用方式。',
      en: 'Learn the differences between in-browser apps, downloadable apps, and license-key products.',
    },
    keywords: {
      zh: ['产品类型', '站内应用', '下载', '授权码', '在线工具'],
      en: ['product types', 'in-browser app', 'download', 'license key', 'online tool'],
    },
  },
  {
    slug: 'online-trial-vs-full-access',
    category: 'getting-started',
    kind: 'how-to',
    order: 40,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['understand-product-types', 'claim-free-product'],
    title: { zh: '在线试用和正式使用有什么区别', en: 'Online Trial vs Full Access' },
    excerpt: {
      zh: '了解试用路由的功能限制及正式获取后的完整访问权。',
      en: 'Understand trial route limitations and what full access unlocks after purchase or claiming.',
    },
    keywords: {
      zh: ['试用', '正式版', '功能限制', '登录', '授权'],
      en: ['trial', 'full access', 'limitations', 'login', 'license'],
    },
  },

  // ========== 账户与资格 (5) ==========
  {
    slug: 'create-and-verify-account',
    category: 'account',
    kind: 'tutorial',
    order: 10,
    readingMinutes: 4,
    updatedAt: '2026-08-10',
    featured: true,
    commercial: false,
    relatedSlugs: ['login-and-reset-password', 'edit-profile'],
    title: { zh: '如何注册账户并验证邮箱', en: 'How to Create an Account and Verify Your Email' },
    excerpt: {
      zh: '完成注册表单、通过滑块验证、查收验证邮件并激活账户。',
      en: 'Complete the registration form, pass the CAPTCHA, find the verification email, and activate your account.',
    },
    keywords: {
      zh: ['注册', '验证邮箱', '激活', '滑块', 'CAPTCHA'],
      en: ['register', 'verify email', 'activate', 'slider', 'CAPTCHA'],
    },
  },
  {
    slug: 'login-and-reset-password',
    category: 'account',
    kind: 'how-to',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['create-and-verify-account', 'manage-account-data'],
    title: { zh: '如何登录、找回或重置密码', en: 'How to Log In, Recover or Reset Your Password' },
    excerpt: {
      zh: '使用邮箱和密码登录、处理常见登录错误、以及通过邮件重置密码。',
      en: 'Log in with your email and password, handle common login errors, and reset your password via email.',
    },
    keywords: {
      zh: ['登录', '密码', '找回密码', '重置', '错误'],
      en: ['login', 'password', 'forgot password', 'reset', 'error'],
    },
  },
  {
    slug: 'edit-profile',
    category: 'account',
    kind: 'how-to',
    order: 30,
    readingMinutes: 2,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['create-and-verify-account'],
    title: { zh: '如何修改昵称、头像和个性签名', en: 'How to Edit Your Nickname, Avatar, and Bio' },
    excerpt: {
      zh: '在账户页面更新昵称、上传头像和设置个性签名。',
      en: 'Update your nickname, upload an avatar, and set your bio on the account page.',
    },
    keywords: {
      zh: ['昵称', '头像', '个性签名', '账户', '设置'],
      en: ['nickname', 'avatar', 'bio', 'account', 'settings'],
    },
  },
  {
    slug: 'manage-account-data',
    category: 'account',
    kind: 'how-to',
    order: 40,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['login-and-reset-password', 'edit-profile'],
    title: { zh: '如何修改密码、导出数据或删除账户', en: 'How to Change Password, Export Data, or Delete Your Account' },
    excerpt: {
      zh: '管理账户安全：修改密码、导出个人数据以及删除账户的操作步骤。',
      en: 'Manage your account security: change your password, export your data, and delete your account.',
    },
    keywords: {
      zh: ['修改密码', '导出数据', '删除账户', '数据权利', '隐私'],
      en: ['change password', 'export data', 'delete account', 'data rights', 'privacy'],
    },
  },
  {
    slug: 'student-plan',
    category: 'account',
    kind: 'policy',
    order: 50,
    readingMinutes: 2,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['create-and-verify-account'],
    title: { zh: '如何了解和使用学生免费计划', en: 'How to Learn About and Use the Student Free Plan' },
    excerpt: {
      zh: '了解学生计划的资格条件、申请方式和与普通账户的区别。',
      en: 'Learn about eligibility requirements, how to apply, and differences from a regular account.',
    },
    keywords: {
      zh: ['学生', '免费', '教育', '优惠', '资格'],
      en: ['student', 'free', 'education', 'discount', 'eligibility'],
    },
  },

  // ========== 产品获取与使用 (4 新 + 4 修订) ==========
  {
    slug: 'browse-and-compare-products',
    category: 'products',
    kind: 'tutorial',
    order: 10,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['understand-product-types', 'claim-free-product'],
    title: { zh: '如何浏览、筛选和比较产品', en: 'How to Browse, Filter, and Compare Products' },
    excerpt: {
      zh: '在产品列表页按分类浏览、查看详情和定价，找到适合自己的产品。',
      en: 'Browse products by category, view details and pricing, and find the right product for you.',
    },
    keywords: {
      zh: ['浏览', '筛选', '产品', '定价', '比较'],
      en: ['browse', 'filter', 'products', 'pricing', 'compare'],
    },
  },
  {
    slug: 'claim-free-product',
    category: 'products',
    kind: 'tutorial',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['browse-and-compare-products', 'open-or-download-owned-product'],
    title: { zh: '如何免费获取产品', en: 'How to Claim a Free Product' },
    excerpt: {
      zh: '找到免费或限免产品，点击入库，之后在"我的产品"中随时访问。',
      en: 'Find free or limited-time-free products, claim them, and access them anytime from My Products.',
    },
    keywords: {
      zh: ['免费', '限免', '入库', '获取', '我的产品'],
      en: ['free', 'limited free', 'claim', 'acquire', 'My Products'],
    },
  },
  {
    slug: 'buy-product-or-meteor-pass',
    category: 'products',
    kind: 'tutorial',
    order: 30,
    readingMinutes: 4,
    updatedAt: '2026-08-10',
    commercial: true,
    relatedSlugs: ['meteor-pass-access-and-renewal', 'get-product-after-purchase'],
    title: { zh: '如何购买单品或 Meteor Pass', en: 'How to Buy a Product or Meteor Pass' },
    excerpt: {
      zh: '了解单品买断、Meteor Pass 月付/年付/买断档位，以及支付后的交付流程。',
      en: 'Learn about one-time purchases, Meteor Pass monthly/annual/lifetime plans, and post-payment delivery.',
    },
    keywords: {
      zh: ['购买', 'Meteor Pass', '支付', '定价', '档位'],
      en: ['purchase', 'Meteor Pass', 'payment', 'pricing', 'plan'],
    },
  },
  {
    slug: 'redeem-invitation-code',
    category: 'products',
    kind: 'tutorial',
    order: 40,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['use-license-key', 'claim-free-product'],
    title: { zh: '如何兑换邀请码', en: 'How to Redeem an Invitation Code' },
    excerpt: {
      zh: '找到邀请码入口，输入 INV-XXXX 格式的邀请码并获取对应产品授权。',
      en: 'Find the redemption entry, enter your INV-XXXX invitation code, and receive your product license.',
    },
    keywords: {
      zh: ['邀请码', '兑换', 'INV', '授权', '优惠'],
      en: ['invitation code', 'redeem', 'INV', 'license', 'discount'],
    },
  },
  {
    slug: 'open-or-download-owned-product',
    category: 'products',
    kind: 'tutorial',
    order: 50,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['claim-free-product', 'macos-cannot-open-app'],
    title: { zh: '如何打开或下载已经获取的产品', en: 'How to Open or Download Owned Products' },
    excerpt: {
      zh: '在"我的产品"中找到已获取的产品，区分在线打开和下载两种使用方式。',
      en: 'Find your owned products in My Products and learn the difference between online access and downloading.',
    },
    keywords: {
      zh: ['我的产品', '下载', '打开', '应用', '已获取'],
      en: ['My Products', 'download', 'open', 'app', 'owned'],
    },
  },
  {
    slug: 'meteor-pass-access-and-renewal',
    category: 'products',
    kind: 'policy',
    order: 60,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: true,
    relatedSlugs: ['buy-product-or-meteor-pass'],
    title: { zh: 'Meteor Pass 的覆盖范围、有效期和续期', en: 'Meteor Pass Coverage, Validity, and Renewal' },
    excerpt: {
      zh: '了解 Meteor Pass 覆盖哪些产品、有效期如何计算、多张 Pass 如何叠加以及续期逻辑。',
      en: 'Learn which products Meteor Pass covers, how validity is calculated, how multiple Passes stack, and renewal logic.',
    },
    keywords: {
      zh: ['Meteor Pass', '覆盖', '有效期', '续期', '叠加'],
      en: ['Meteor Pass', 'coverage', 'validity', 'renewal', 'stacking'],
    },
  },
  // 修订后的现有文章
  {
    slug: 'macos-cannot-open-app',
    category: 'products',
    kind: 'troubleshooting',
    order: 70,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['open-or-download-owned-product'],
    title: { zh: 'macOS 下载后无法打开应用怎么办？', en: 'What if a downloaded app will not open on macOS?' },
    excerpt: {
      zh: '了解 macOS 安全提示的原因，以及使用"仍要打开"的安全处理步骤。',
      en: 'Learn why macOS shows security warnings and how to use Open Anyway safely.',
    },
    keywords: {
      zh: ['macOS', '无法打开', '隐私与安全性', '仍要打开', 'Gatekeeper'],
      en: ['macOS', 'cannot open', 'Privacy & Security', 'Open Anyway', 'Gatekeeper'],
    },
  },
  {
    slug: 'get-product-after-purchase',
    category: 'products',
    kind: 'how-to',
    order: 80,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['buy-product-or-meteor-pass', 'open-or-download-owned-product'],
    title: { zh: '购买后如何获取产品？', en: 'How do I access a product after purchase?' },
    excerpt: {
      zh: '从支付成功页、邮件、订单记录和"我的产品"找到购买内容。',
      en: 'Find your purchase from the payment result, email, order history, or My Products.',
    },
    keywords: {
      zh: ['购买', '交付', '下载', '我的产品', '订单', '邮件'],
      en: ['purchase', 'delivery', 'download', 'My Products', 'order', 'email'],
    },
  },
  {
    slug: 'use-license-key',
    category: 'products',
    kind: 'how-to',
    order: 90,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['redeem-invitation-code', 'claim-free-product'],
    title: { zh: '如何使用授权码？', en: 'How do I use a license key?' },
    excerpt: {
      zh: '了解在哪里查看授权码（与邀请码不同），以及哪些产品需要手动输入授权码。',
      en: 'Learn where to find your license key (different from invitation codes) and when a product asks you to enter it.',
    },
    keywords: {
      zh: ['授权码', '激活码', '账户', '授权', '兑换'],
      en: ['license key', 'activation', 'account', 'license', 'redeem'],
    },
  },
  {
    slug: 'product-updates',
    category: 'products',
    kind: 'how-to',
    order: 100,
    readingMinutes: 2,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['open-or-download-owned-product'],
    title: { zh: '如何获取产品更新？', en: 'How do I get product updates?' },
    excerpt: {
      zh: '从产品页确认最新版本，了解不同产品的更新获取方式。',
      en: 'Check the latest version on the product page and learn how updates are delivered for different products.',
    },
    keywords: {
      zh: ['产品更新', '版本', '下载', '更新方式'],
      en: ['product updates', 'version', 'download', 'update method'],
    },
  },

  // ========== 博客与社区 (3) ==========
  {
    slug: 'browse-blog-tags-and-rss',
    category: 'community',
    kind: 'tutorial',
    order: 10,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['interact-with-blog-posts'],
    title: { zh: '如何浏览博客分区、标签和 RSS', en: 'How to Browse Blog Sections, Tags, and RSS' },
    excerpt: {
      zh: '按分区浏览博客文章、通过标签发现相关内容，以及订阅 RSS 获取更新。',
      en: 'Browse blog posts by section, discover related content through tags, and subscribe via RSS.',
    },
    keywords: {
      zh: ['博客', '分区', '标签', 'RSS', '订阅'],
      en: ['blog', 'section', 'tag', 'RSS', 'subscribe'],
    },
  },
  {
    slug: 'interact-with-blog-posts',
    category: 'community',
    kind: 'how-to',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['browse-blog-tags-and-rss', 'submit-and-manage-blog-posts'],
    title: { zh: '如何点赞、评论、收藏和举报文章', en: 'How to Like, Comment, Bookmark, and Report Posts' },
    excerpt: {
      zh: '参与博客互动：给文章点赞、发表评论、收藏文章以及举报不当内容。',
      en: 'Engage with blog posts: like articles, leave comments, bookmark favorites, and report inappropriate content.',
    },
    keywords: {
      zh: ['点赞', '评论', '收藏', '举报', '互动'],
      en: ['like', 'comment', 'bookmark', 'report', 'interact'],
    },
  },
  {
    slug: 'submit-and-manage-blog-posts',
    category: 'community',
    kind: 'tutorial',
    order: 30,
    readingMinutes: 4,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: ['interact-with-blog-posts'],
    title: { zh: '如何投稿并查看审核状态', en: 'How to Submit and Manage Blog Posts' },
    excerpt: {
      zh: '撰写投稿、使用 Markdown 排版、提交审核以及追踪审核状态。',
      en: 'Write a submission, format with Markdown, submit for review, and track your review status.',
    },
    keywords: {
      zh: ['投稿', '写文章', '审核', 'Markdown', '发布'],
      en: ['submit', 'write post', 'review', 'Markdown', 'publish'],
    },
  },

  // ========== 在线工具 (2) ==========
  {
    slug: 'use-playground',
    category: 'tools',
    kind: 'tutorial',
    order: 10,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何使用 Playground 在线体验产品', en: 'How to Use Playground to Try Products Online' },
    excerpt: {
      zh: '在 Playground 中直接体验产品的核心功能，无需下载或登录。',
      en: 'Try core product features directly in the Playground without downloading or logging in.',
    },
    keywords: {
      zh: ['Playground', '在线体验', '试用', '演示'],
      en: ['Playground', 'online trial', 'demo', 'try'],
    },
  },
  {
    slug: 'use-pathfinder',
    category: 'tools',
    kind: 'tutorial',
    order: 20,
    readingMinutes: 3,
    updatedAt: '2026-08-10',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何使用 Pathfinder 制定行动方案', en: 'How to Use Pathfinder to Plan Your Actions' },
    excerpt: {
      zh: '通过 Pathfinder 输入目标，获得结构化的行动方案和步骤建议。',
      en: 'Enter your goal in Pathfinder and receive a structured action plan with step-by-step suggestions.',
    },
    keywords: {
      zh: ['Pathfinder', '行动方案', '目标', '步骤', '规划'],
      en: ['Pathfinder', 'action plan', 'goal', 'steps', 'planning'],
    },
  },

  // ========== 售后与支持 (2) ==========
  {
    slug: 'refund-policy',
    category: 'support',
    kind: 'policy',
    order: 10,
    readingMinutes: 2,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: ['buy-product-or-meteor-pass'],
    title: { zh: '如何申请退款？', en: 'How do I request a refund?' },
    excerpt: {
      zh: '查看退款申请入口、所需订单信息和完整退款政策。',
      en: 'Find the refund request process, required order details, and full policy.',
    },
    keywords: {
      zh: ['退款', '退款政策', '订单号', '误购', '重复扣款'],
      en: ['refund', 'refund policy', 'order number', 'mistaken purchase', 'duplicate charge'],
    },
  },
  {
    slug: 'technical-support',
    category: 'support',
    kind: 'how-to',
    order: 20,
    readingMinutes: 2,
    updatedAt: '2026-08-09',
    commercial: false,
    relatedSlugs: [],
    title: { zh: '如何联系技术支持？', en: 'How do I contact technical support?' },
    excerpt: {
      zh: '提交清晰的问题信息，帮助我们更快复现并定位故障。',
      en: 'Send the details we need to reproduce and diagnose your issue faster.',
    },
    keywords: {
      zh: ['技术支持', '反馈', '问题', '错误提示', '联系方式'],
      en: ['technical support', 'feedback', 'issue', 'error message', 'contact'],
    },
  },
];

const categoryOrder = new Map(helpCategories.map((category) => [category.id, category.order]));

export function isHelpArticleVisible(
  article: Pick<HelpArticleMeta, 'commercial'>,
  showPricing: boolean,
): boolean {
  return showPricing || article.commercial !== true;
}

export function localizeHelpArticles(locale: Locale, showPricing = true): LocalizedHelpArticle[] {
  return helpArticles
    .filter((article) => isHelpArticleVisible(article, showPricing))
    .map((article) => ({
      slug: article.slug,
      category: article.category,
      kind: article.kind,
      order: article.order,
      readingMinutes: article.readingMinutes,
      updatedAt: article.updatedAt,
      featured: article.featured,
      commercial: article.commercial,
      relatedSlugs: article.relatedSlugs,
      title: article.title[locale],
      excerpt: article.excerpt[locale],
      keywords: [...article.keywords[locale]],
    }))
    .sort((a, b) => (
      (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0)
      || a.order - b.order
    ));
}

export function findLocalizedHelpArticle(
  slug: string,
  locale: Locale,
): LocalizedHelpArticle | undefined {
  return localizeHelpArticles(locale).find((article) => article.slug === slug);
}

/** 期望的 26 个稳定 slug，用于测试和验证 */
export const EXPECTED_SLUGS: readonly string[] = [
  // 初识与导航
  'start-here', 'navigate-and-search', 'understand-product-types', 'online-trial-vs-full-access',
  // 账户与资格
  'create-and-verify-account', 'login-and-reset-password', 'edit-profile', 'manage-account-data', 'student-plan',
  // 产品获取与使用
  'browse-and-compare-products', 'claim-free-product', 'buy-product-or-meteor-pass', 'redeem-invitation-code',
  'open-or-download-owned-product', 'meteor-pass-access-and-renewal',
  'macos-cannot-open-app', 'get-product-after-purchase', 'use-license-key', 'product-updates',
  // 博客与社区
  'browse-blog-tags-and-rss', 'interact-with-blog-posts', 'submit-and-manage-blog-posts',
  // 在线工具
  'use-playground', 'use-pathfinder',
  // 售后与支持
  'refund-policy', 'technical-support',
];

/** 新手路径定义 */
export interface HelpJourney {
  id: string;
  order: number;
  label: LocalizedText;
  description: LocalizedText;
  slugSequence: string[];
}

export const helpJourneys: HelpJourney[] = [
  {
    id: 'explore',
    order: 1,
    label: { zh: '初次访问', en: 'First Visit' },
    description: {
      zh: '浏览产品、了解网站功能和产品类型',
      en: 'Browse products and learn about site features and product types',
    },
    slugSequence: [
      'start-here',
      'navigate-and-search',
      'understand-product-types',
      'browse-and-compare-products',
    ],
  },
  {
    id: 'free-trial',
    order: 2,
    label: { zh: '免费试用', en: 'Free Trial' },
    description: {
      zh: '注册账户、试用产品、免费获取',
      en: 'Create an account, try products, and claim free ones',
    },
    slugSequence: [
      'create-and-verify-account',
      'online-trial-vs-full-access',
      'claim-free-product',
      'open-or-download-owned-product',
    ],
  },
  {
    id: 'purchase',
    order: 3,
    label: { zh: '购买与获取', en: 'Purchase & Access' },
    description: {
      zh: '了解定价、完成购买、获取并使用产品',
      en: 'Learn about pricing, make a purchase, and access your products',
    },
    slugSequence: [
      'buy-product-or-meteor-pass',
      'get-product-after-purchase',
      'redeem-invitation-code',
      'open-or-download-owned-product',
      'use-license-key',
    ],
  },
  {
    id: 'contribute',
    order: 4,
    label: { zh: '参与社区', en: 'Join the Community' },
    description: {
      zh: '注册、浏览博客、投稿并管理文章',
      en: 'Register, browse the blog, submit and manage posts',
    },
    slugSequence: [
      'create-and-verify-account',
      'browse-blog-tags-and-rss',
      'interact-with-blog-posts',
      'submit-and-manage-blog-posts',
    ],
  },
  {
    id: 'troubleshoot',
    order: 5,
    label: { zh: '遇到问题', en: 'Troubleshooting' },
    description: {
      zh: '解决常见问题、申请退款、联系支持',
      en: 'Resolve common issues, request refunds, and contact support',
    },
    slugSequence: [
      'macos-cannot-open-app',
      'login-and-reset-password',
      'product-updates',
      'refund-policy',
      'technical-support',
    ],
  },
];

/** 检查路径中所有引用的 slug 是否存在于文章列表中 */
export function validateJourneySlugs(articles: HelpArticleMeta[]): string[] {
  const slugSet = new Set(articles.map((a) => a.slug));
  const errors: string[] = [];
  for (const journey of helpJourneys) {
    for (const slug of journey.slugSequence) {
      if (!slugSet.has(slug)) {
        errors.push(`路径 "${journey.id}" 引用了不存在的 slug: "${slug}"`);
      }
    }
  }
  return errors;
}
