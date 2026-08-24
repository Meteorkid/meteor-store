import type { LocalizedText } from './blog-sections';
import type { Locale } from '@/i18n/routing';

export interface DownloadLink {
  /** 同一产品内唯一的稳定 id，作为下载接口的 file 参数 */
  id: string;
  label: LocalizedText;
  icon: 'gitee' | 'pypi' | 'npm' | 'dmg' | 'zip' | 'github';
  note?: LocalizedText;
  /** 外链下载（GitHub / Gitee / PyPI 等）。与 r2Key 二选一 */
  url?: string;
  /**
   * 安装包在 R2 里的对象 key（见 releaseObjectKey）。与 url 二选一。
   * 客户端拿不到 R2_PUBLIC_BASE（不是 NEXT_PUBLIC_ 变量），
   * 所以公开地址一律由服务端组件解析，别在客户端组件里拼。
   */
  r2Key?: string;
  /**
   * 需要授权才能下载：下载接口校验 entitlement 后签发短时效链接。
   * 为真时必须配 r2Key——挂在 GitHub/Gitee 上的公开链接门控不了，那是自欺欺人。
   */
  gated?: boolean;
  /** 版本号与 SHA-256 校验和，展示给用户核对（`shasum -a 256`） */
  version?: string;
  sha256?: string;
}

export interface Product {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  features: LocalizedText[];
  pricing: {
    id: string;
    name: LocalizedText;
    price: number;
    /**
     * 限免前的原价。有值时定价卡把它划掉、旁边显示当前价，
     * 用于「先免费开放、以后再收费」的产品。判断能不能免费拿只看 price，不看它。
     */
    originalPrice?: number;
    /** 逻辑字段（'月'/'年'/'买断'），被 `=== '月'` 等判断消费，保持 string 不双语化 */
    period?: string;
    features: LocalizedText[];
  }[];
  /** GitHub 仓库地址。商业策略调整后不再对外暴露，保留字段仅供内部使用，UI 不渲染 */
  github?: string;
  /** 开源许可证。'mit' 才算是真开源，会进 /open-source 页面；其余产品（源码可用-非商业等）不展示为开源 */
  license?: 'mit';
  demo?: string;
  /** 独立的站内在线体验页；与产品官网 demo、付费站内应用 appUrl 分开。 */
  experienceUrl?: string;
  /** 站内集成的在线应用地址（如 /apps/tollow）。有该字段说明产品是纯 Web 应用，
     产品页会渲染「免费试用」内嵌区块，购买入口对应 /apps/{id} 付费门控 */
  appUrl?: string;
  /** 产品状态。'coming_soon' 表示暂不出售：卡片与详情页显示「即将上架」，不渲染定价/购买入口 */
  status?: 'coming_soon';
  /** 快速上手：终端安装命令（可复制）或应用下载页 */
  quickstart?: {
    command?: string;
    download?: string;
    note?: LocalizedText;
  };
  /** 国内下载源 */
  downloads?: DownloadLink[];
  category: 'ai' | 'developer' | 'design' | 'utility';
  icon: string;
  gradient: string;
  platforms: string[];
  media?: {
    cover: string;
    demo?: string;
    screenshots: {
      src: string;
      alt: LocalizedText;
    }[];
  };
}

/** 拍平后的单语产品（按 locale 取值后的形状，供组件消费） */
export interface LocalizedDownloadLink {
  id: string;
  label: string;
  icon: 'gitee' | 'pypi' | 'npm' | 'dmg' | 'zip' | 'github';
  note?: string;
  url?: string;
  r2Key?: string;
  gated?: boolean;
  version?: string;
  sha256?: string;
}

export interface LocalizedProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: {
    id: string;
    name: string;
    price: number;
    /** 限免前的原价，见 Product.pricing.originalPrice */
    originalPrice?: number;
    period?: string;
    features: string[];
  }[];
  /** GitHub 仓库地址。商业策略调整后不再对外暴露，保留字段仅供内部使用，UI 不渲染 */
  github?: string;
  /** 开源许可证。'mit' 才算是真开源，会进 /open-source 页面；其余产品（源码可用-非商业等）不展示为开源 */
  license?: 'mit';
  demo?: string;
  experienceUrl?: string;
  /** 站内集成的在线应用地址（如 /apps/tollow）。有该字段说明产品是纯 Web 应用 */
  appUrl?: string;
  /** 产品状态。'coming_soon' 表示暂不出售：卡片与详情页显示「即将上架」，不渲染定价/购买入口 */
  status?: 'coming_soon';
  quickstart?: {
    command?: string;
    download?: string;
    note?: string;
  };
  downloads?: LocalizedDownloadLink[];
  category: 'ai' | 'developer' | 'design' | 'utility';
  icon: string;
  gradient: string;
  platforms: string[];
  media?: {
    cover: string;
    demo?: string;
    screenshots: {
      src: string;
      alt: string;
    }[];
  };
}

export const products: Product[] = [
  {
    id: 'omnicrawl',
    name: { zh: 'OmniCrawl', en: 'OmniCrawl' },
    tagline: { zh: '万能爬虫框架', en: 'Universal Web Crawler Framework' },
    description: {
      zh: '基于 Scrapling + curl_cffi + Playwright 的全能爬虫框架，支持反反爬、浏览器指纹模拟、智能重试，让数据采集变得简单高效。',
      en: 'An all-in-one crawler framework built on Scrapling + curl_cffi + Playwright, with anti-anti-bot detection, browser fingerprint emulation, and smart retries — making data collection simple and efficient.',
    },
    features: [
      { zh: '多引擎支持：Scrapling、curl_cffi、Playwright 无缝切换', en: 'Multi-engine support: switch between Scrapling, curl_cffi, and Playwright seamlessly' },
      { zh: '反反爬机制：自动绕过 Cloudflare、Akamai 等 WAF', en: 'Anti-anti-bot: automatically bypasses Cloudflare, Akamai, and other WAFs' },
      { zh: '浏览器指纹模拟：真实浏览器行为，降低封禁风险', en: 'Browser fingerprint emulation: real browser behavior to reduce ban risk' },
      { zh: '智能重试与代理轮换', en: 'Smart retries and proxy rotation' },
      { zh: '异步并发采集', en: 'Async concurrent crawling' },
      { zh: '详细的日志与监控', en: 'Detailed logging and monitoring' },
    ],
    pricing: [
      {
        id: 'starter',
        name: { zh: 'Starter', en: 'Starter' },
        price: 29,
        period: '月',
        features: [
          { zh: '1,000 次 API 调用/月', en: '1,000 API calls/month' },
          { zh: '基础反爬功能', en: 'Basic anti-bot features' },
          { zh: '社区支持', en: 'Community support' },
          { zh: '单用户', en: 'Single user' },
        ],
      },
      {
        id: 'pro',
        name: { zh: 'Pro', en: 'Pro' },
        price: 79,
        period: '月',
        features: [
          { zh: '10,000 次 API 调用/月', en: '10,000 API calls/month' },
          { zh: '高级反爬功能', en: 'Advanced anti-bot features' },
          { zh: '优先支持', en: 'Priority support' },
          { zh: '5 用户', en: '5 users' },
          { zh: 'API 文档', en: 'API documentation' },
        ],
      },
      {
        id: 'enterprise',
        name: { zh: 'Enterprise', en: 'Enterprise' },
        price: 199,
        period: '月',
        features: [
          { zh: '无限 API 调用', en: 'Unlimited API calls' },
          { zh: '定制化反爬策略', en: 'Custom anti-bot strategies' },
          { zh: '专属技术支持', en: 'Dedicated technical support' },
          { zh: '无限用户', en: 'Unlimited users' },
          { zh: 'SLA 保障', en: 'SLA guarantee' },
          { zh: '私有部署', en: 'Private deployment' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/omnicrawl',
    license: 'mit',
    quickstart: {
      command: 'pip install omnicrawl',
      note: {
        zh: '国内可用清华镜像：pip install omnicrawl -i https://pypi.tuna.tsinghua.edu.cn/simple',
        en: 'In China, use the Tsinghua mirror: pip install omnicrawl -i https://pypi.tuna.tsinghua.edu.cn/simple',
      },
    },
    downloads: [
      { id: 'pypi', label: { zh: 'PyPI 安装', en: 'PyPI Install' }, url: 'https://pypi.org/project/omnicrawl/', icon: 'pypi', note: { zh: '推荐，国内镜像源秒装', en: 'Recommended; fast install via China mirror' } },
    ],
    category: 'developer',
    icon: '🕷️',
    gradient: 'from-purple-500 to-pink-500',
    platforms: ['Python', 'CLI', 'API'],
    media: {
      cover: '/products/omnicrawl/cover.webp',
      demo: '/products/omnicrawl/demo.mp4',
      screenshots: [
        { src: '/products/omnicrawl/screenshot-1.webp', alt: { zh: 'OmniCrawl 核心特性与对比表格', en: 'OmniCrawl core features and comparison table' } },
        { src: '/products/omnicrawl/screenshot-2.webp', alt: { zh: 'OmniCrawl 安装与快速开始', en: 'OmniCrawl installation and quick start' } },
      ],
    },
  },
  {
    id: 'ex-memory',
    status: 'coming_soon',
    experienceUrl: '/apps/ex-memory',
    name: { zh: 'Ex-Memory', en: 'Ex-Memory' },
    tagline: { zh: '前任记忆智能体', en: 'Ex-Partner Memory Agent' },
    description: {
      zh: 'LLM + RAG 技术还原 ta 的语气，让聊天像跟真人对话。基于你的聊天记录，AI 学习并模仿特定人的说话风格。',
      en: "LLM + RAG technology recreates their tone of voice, making chats feel like talking to a real person. Based on your chat history, the AI learns and mimics a specific person's speaking style.",
    },
    features: [
      { zh: '聊天记录分析与学习', en: 'Chat history analysis and learning' },
      { zh: '语气风格还原', en: 'Tone and style reproduction' },
      { zh: '多轮对话生成', en: 'Multi-turn dialogue generation' },
      { zh: '情感分析与理解', en: 'Sentiment analysis and understanding' },
      { zh: '隐私保护：数据本地处理', en: 'Privacy-first: data processed locally' },
      { zh: '支持多种 LLM 模型', en: 'Supports multiple LLM models' },
    ],
    pricing: [
      {
        id: 'basic',
        name: { zh: 'Basic', en: 'Basic' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 9,
        period: '月',
        features: [
          { zh: '100 条消息/月', en: '100 messages/month' },
          { zh: '基础语气分析', en: 'Basic tone analysis' },
          { zh: '单一聊天记录', en: 'Single chat history' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
      {
        id: 'premium',
        name: { zh: 'Premium', en: 'Premium' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 19,
        period: '月',
        features: [
          { zh: '500 条消息/月', en: '500 messages/month' },
          { zh: '高级语气还原', en: 'Advanced tone reproduction' },
          { zh: '多聊天记录', en: 'Multiple chat histories' },
          { zh: '优先支持', en: 'Priority support' },
          { zh: '情感分析', en: 'Sentiment analysis' },
        ],
      },
      {
        id: 'ultimate',
        name: { zh: 'Ultimate', en: 'Ultimate' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 39,
        period: '月',
        features: [
          { zh: '无限消息', en: 'Unlimited messages' },
          { zh: '完美语气还原', en: 'Perfect tone reproduction' },
          { zh: '无限聊天记录', en: 'Unlimited chat histories' },
          { zh: '专属支持', en: 'Dedicated support' },
          { zh: '自定义训练', en: 'Custom training' },
          { zh: 'API 接入', en: 'API access' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/ex-memory',
    category: 'ai',
    icon: '💔',
    gradient: 'from-red-500 to-orange-500',
    platforms: ['Web', 'Mobile', 'API'],
    media: {
      cover: '/products/ex-memory/cover.webp',
      demo: '/products/ex-memory/demo.mp4',
      screenshots: [
        { src: '/products/ex-memory/screenshot-1.webp', alt: { zh: 'Ex-Memory 记忆镜像对话界面', en: 'Ex-Memory memory-mirror chat interface' } },
        { src: '/products/ex-memory/screenshot-2.webp', alt: { zh: 'Ex-Memory 模型配置界面', en: 'Ex-Memory model configuration interface' } },
      ],
    },
  },
  {
    id: 'skeleton-anatomy',
    appUrl: '/apps/skeleton-anatomy',
    name: { zh: 'Skeleton Anatomy', en: 'Skeleton Anatomy' },
    tagline: { zh: '3D 骨骼解剖平台', en: '3D Skeletal Anatomy Platform' },
    description: {
      zh: '人体骨骼 3D 图谱 — 交互式解剖学习应用，支持旋转、缩放、标注，医学教育的最佳伴侣。',
      en: 'A 3D atlas of the human skeleton — an interactive anatomy learning app supporting rotation, zoom, and annotation, the perfect companion for medical education.',
    },
    features: [
      { zh: '完整人体骨骼 3D 模型', en: 'Complete human skeleton 3D model' },
      { zh: '交互式旋转与缩放', en: 'Interactive rotation and zoom' },
      { zh: '骨骼标注与说明', en: 'Bone annotations and descriptions' },
      { zh: '多角度观察', en: 'Multi-angle viewing' },
      { zh: '搜索与筛选功能', en: 'Search and filter' },
      { zh: '响应式设计，支持移动端', en: 'Responsive design with mobile support' },
    ],
    pricing: [
      {
        id: 'student',
        name: { zh: 'Student', en: 'Student' },
        price: 19,
        period: '年',
        features: [
          { zh: '完整骨骼模型', en: 'Full skeleton model' },
          { zh: '基础标注', en: 'Basic annotations' },
          { zh: 'Web 访问', en: 'Web access' },
          { zh: '个人使用', en: 'Personal use' },
        ],
      },
      {
        id: 'professional',
        name: { zh: 'Professional', en: 'Professional' },
        price: 49,
        period: '年',
        features: [
          { zh: '完整骨骼模型', en: 'Full skeleton model' },
          { zh: '高级标注', en: 'Advanced annotations' },
          { zh: 'Web + 移动端', en: 'Web + mobile' },
          { zh: '教学使用', en: 'Teaching use' },
          { zh: '导出功能', en: 'Export feature' },
        ],
      },
      {
        id: 'institution',
        name: { zh: 'Institution', en: 'Institution' },
        price: 199,
        period: '年',
        features: [
          { zh: '完整骨骼模型', en: 'Full skeleton model' },
          { zh: '自定义标注', en: 'Custom annotations' },
          { zh: '多用户', en: 'Multi-user' },
          { zh: 'API 接入', en: 'API access' },
          { zh: '定制化服务', en: 'Custom services' },
          { zh: '优先支持', en: 'Priority support' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/skeleton-anatomy',
    category: 'design',
    icon: '🦴',
    gradient: 'from-gray-500 to-blue-500',
    platforms: ['Web', '3D', 'Mobile'],
    media: {
      cover: '/products/skeleton-anatomy/cover.webp',
      demo: '/products/skeleton-anatomy/demo.mp4',
      screenshots: [
        { src: '/products/skeleton-anatomy/screenshot-1.webp', alt: { zh: 'Skeleton Anatomy 三维骨骼总览', en: 'Skeleton Anatomy 3D skeleton overview' } },
        { src: '/products/skeleton-anatomy/screenshot-2.webp', alt: { zh: 'Skeleton Anatomy 骨骼详情界面', en: 'Skeleton Anatomy bone detail view' } },
      ],
    },
  },
  {
    id: 'ui-design-system',
    status: 'coming_soon',
    name: { zh: 'UI Design System', en: 'UI Design System' },
    tagline: { zh: 'AI Agent 设计系统', en: 'AI Agent Design System' },
    description: {
      zh: '面向 AI 编码代理的 UI/UX 设计智能技能 — 8 个锚点、73 种风格、199 条 UX 规则、审计管道。',
      en: 'Comprehensive UI/UX design intelligence skill for AI coding agents — 8 anchors, 73 styles, 199 UX rules, audit pipeline.',
    },
    features: [
      { zh: '8 个设计锚点', en: '8 design anchors' },
      { zh: '73 种设计风格', en: '73 design styles' },
      { zh: '199 条 UX 规则', en: '199 UX rules' },
      { zh: '自动化审计管道', en: 'Automated audit pipeline' },
      { zh: 'AI Agent 集成', en: 'AI Agent integration' },
      { zh: '持续更新', en: 'Continuous updates' },
    ],
    pricing: [
      {
        id: 'solo',
        name: { zh: 'Solo', en: 'Solo' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 9,
        period: '月',
        features: [
          { zh: '基础设计规则', en: 'Basic design rules' },
          { zh: '单一 Agent', en: 'Single agent' },
          { zh: '社区支持', en: 'Community support' },
          { zh: '月度更新', en: 'Monthly updates' },
        ],
      },
      {
        id: 'team',
        name: { zh: 'Team', en: 'Team' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 29,
        period: '月',
        features: [
          { zh: '完整设计系统', en: 'Full design system' },
          { zh: '5 Agent', en: '5 agents' },
          { zh: '优先支持', en: 'Priority support' },
          { zh: '周更新', en: 'Weekly updates' },
          { zh: '自定义规则', en: 'Custom rules' },
        ],
      },
      {
        id: 'enterprise',
        name: { zh: 'Enterprise', en: 'Enterprise' },
        // 限时免费：原价保留在 originalPrice 供定价卡划线展示，恢复收费时把它挪回 price
        price: 0,
        originalPrice: 99,
        period: '月',
        features: [
          { zh: '完整设计系统', en: 'Full design system' },
          { zh: '无限 Agent', en: 'Unlimited agents' },
          { zh: '专属支持', en: 'Dedicated support' },
          { zh: '实时更新', en: 'Real-time updates' },
          { zh: '定制化', en: 'Customization' },
          { zh: 'API 接入', en: 'API access' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/ui-design-system',
    category: 'design',
    icon: '🎨',
    gradient: 'from-blue-500 to-cyan-500',
    platforms: ['AI Agent', 'Design', 'CLI'],
    media: {
      cover: '/products/ui-design-system/cover.webp',
      demo: '/products/ui-design-system/demo.mp4',
      screenshots: [
        { src: '/products/ui-design-system/screenshot-1.webp', alt: { zh: 'UI Design System 首页架构展示', en: 'UI Design System homepage architecture' } },
        { src: '/products/ui-design-system/screenshot-2.webp', alt: { zh: 'UI Design System 组件浏览', en: 'UI Design System component browser' } },
      ],
    },
  },
  {
    id: 'statux',
    name: { zh: 'Statux', en: 'Statux' },
    tagline: { zh: 'CLI 状态栏工具', en: 'CLI Status Bar Tool' },
    description: {
      zh: '面向 Claude Code 与 iTerm2 的 AI 代理状态显示，实时展示代理状态，让开发更高效。',
      en: 'AI Agent status display for Claude Code and iTerm2 — real-time AI agent status for more efficient development.',
    },
    features: [
      { zh: '实时状态显示', en: 'Real-time status display' },
      { zh: 'iTerm2 集成', en: 'iTerm2 integration' },
      { zh: '自定义配置', en: 'Custom configuration' },
      { zh: '轻量级', en: 'Lightweight' },
      { zh: '跨平台支持', en: 'Cross-platform support' },
      { zh: '开源免费', en: 'Open source and free' },
    ],
    // 公开免费：安装包不走门控，直接挂 R2 公开地址，不登录也能下
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '全部功能', en: 'All features' },
          { zh: '实时状态显示', en: 'Real-time status display' },
          { zh: 'iTerm2 集成', en: 'iTerm2 integration' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/statux',
    downloads: [
      { id: 'macos-arm64', label: { zh: 'macOS 二进制 (Apple 芯片)', en: 'macOS Binary (Apple Silicon)' }, r2Key: 'releases/statux/0.4.3/statux-darwin-arm64', icon: 'zip', version: '0.4.3', sha256: '1178a59f6a7463c7f4613b172f8e24858a3051ce98091969dc43dd19a7055cbe' },
      { id: 'macos-x64', label: { zh: 'macOS 二进制 (Intel)', en: 'macOS Binary (Intel)' }, r2Key: 'releases/statux/0.4.3/statux-darwin-x64', icon: 'zip', version: '0.4.3', sha256: 'b2090041350bd9d75b138d562ae414187389b093c194bafa6dd3dcadb5b60914' },
    ],
    category: 'developer',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-500',
    platforms: ['macOS', 'iTerm2', 'CLI'],
    media: {
      cover: '/products/statux/cover.webp',
      demo: '/products/statux/demo.mp4',
      screenshots: [
        { src: '/products/statux/screenshot-1.webp', alt: { zh: 'Statux --help 命令帮助', en: 'Statux --help command reference' } },
        { src: '/products/statux/screenshot-2.webp', alt: { zh: 'Statux TUI 配置界面', en: 'Statux TUI configuration interface' } },
      ],
    },
  },
  {
    id: 'xisland',
    name: { zh: 'XIsland', en: 'XIsland' },
    tagline: { zh: '面向 AI 的 macOS 灵动岛', en: 'macOS Dynamic Island for AI' },
    description: {
      zh: '为所有 AI 编码代理打造的 macOS 灵动岛风格控制塔。风格化的 AI 代理控制中心。',
      en: 'A macOS Dynamic Island-style control tower for all your AI coding agents. A stylized AI agent control center.',
    },
    features: [
      { zh: 'Dynamic Island 风格界面', en: 'Dynamic Island-style interface' },
      { zh: '多 AI 代理管理', en: 'Multi-agent management' },
      { zh: '实时状态监控', en: 'Real-time status monitoring' },
      { zh: '快捷操作', en: 'Quick actions' },
      { zh: '美观的动画效果', en: 'Beautiful animations' },
      { zh: '低资源占用', en: 'Low resource usage' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '基础功能', en: 'Basic features' },
          { zh: '单代理', en: 'Single agent' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
      {
        id: 'pro',
        name: { zh: 'Pro', en: 'Pro' },
        price: 12,
        period: '买断',
        features: [
          { zh: '多代理', en: 'Multiple agents' },
          { zh: '高级主题', en: 'Advanced themes' },
          { zh: '优先支持', en: 'Priority support' },
          { zh: '永久更新', en: 'Lifetime updates' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/XIsland',
    downloads: [
      { id: 'dmg', label: { zh: '下载 DMG', en: 'Download DMG' }, r2Key: 'releases/xisland/1.12.0/XIsland-1.12.0.dmg', icon: 'dmg', gated: true, version: '1.12.0', sha256: '5f8f69fb08625ab3facd635afec6f523e5edd144a5a92a9836c24e2f884a5d38' },
    ],
    category: 'developer',
    icon: '🏝️',
    gradient: 'from-indigo-500 to-purple-500',
    platforms: ['macOS', 'Menu Bar', 'AI Agent'],
    media: {
      cover: '/products/xisland/cover.webp',
      demo: '/products/xisland/demo.mp4',
      screenshots: [
        { src: '/products/xisland/screenshot-1.webp', alt: { zh: 'XIsland 展开面板 — 多代理实时状态', en: 'XIsland expanded panel — multi-agent real-time status' } },
        { src: '/products/xisland/screenshot-2.webp', alt: { zh: 'XIsland 提问面板 — 交互式决策', en: 'XIsland question panel — interactive decisions' } },
      ],
    },
  },
  {
    id: 'tollow',
    appUrl: '/apps/tollow',
    name: { zh: 'Tollow', en: 'Tollow' },
    tagline: { zh: '沉浸式打字练习', en: 'Immersive Typing Practice' },
    description: {
      zh: '面向长文本阅读与输入训练的沉浸式打字应用，可从书库选择内容或上传文档，并通过练习数据了解输入表现。',
      en: 'An immersive typing app for long-text reading and input training. Choose content from the built-in library or upload your own documents, and track your performance through practice data.',
    },
    features: [
      { zh: '长文本沉浸式输入', en: 'Immersive long-text input' },
      { zh: '内置练习书库', en: 'Built-in practice library' },
      { zh: '支持上传个人文档', en: 'Upload your own documents' },
      { zh: '速度与准确率统计', en: 'Speed and accuracy stats' },
      { zh: '练习记录分析', en: 'Practice history analysis' },
      { zh: '响应式 Web 界面', en: 'Responsive web interface' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '完整打字练习与内置书库', en: 'Complete typing practice and built-in library' },
          { zh: '上传个人文档', en: 'Upload personal documents' },
          { zh: '本地进度与基础统计', en: 'Local progress and basic stats' },
          { zh: '本地收藏、笔记与标签', en: 'Local favorites, notes, and tags' },
        ],
      },
      {
        id: 'pro',
        name: { zh: 'Pro', en: 'Pro' },
        price: 29,
        period: '买断',
        features: [
          { zh: 'Free 全部功能', en: 'Everything in Free' },
          { zh: '账号云同步与跨设备进度', en: 'Cloud sync and cross-device progress' },
          { zh: '完整历史趋势与高级统计', en: 'Complete history and advanced analytics' },
          { zh: '收藏、笔记与标签云同步', en: 'Cloud-synced favorites, notes, and tags' },
          { zh: 'CSV 导出与打印学习报告', en: 'CSV export and printable learning reports' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/Tollow',
    category: 'utility',
    icon: '📈',
    gradient: 'from-yellow-500 to-orange-500',
    platforms: ['Web', 'Typing', 'Analytics'],
    media: {
      cover: '/products/tollow/cover.webp',
      demo: '/products/tollow/demo.mp4',
      screenshots: [
        { src: '/products/tollow/screenshot-1.webp', alt: { zh: 'Tollow 精选书单 — 论语、道德经、唐诗三百首', en: 'Tollow curated bookshelf — Analects, Tao Te Ching, 300 Tang Poems' } },
        { src: '/products/tollow/screenshot-2.webp', alt: { zh: 'Tollow 打字练习 — 论语 WPM/准确率统计', en: 'Tollow typing practice — Analects WPM/accuracy stats' } },
      ],
    },
  },
  {
    id: 'xnook',
    name: { zh: 'XNook', en: 'XNook' },
    tagline: { zh: 'macOS 工具中心', en: 'macOS Tool Center' },
    description: {
      zh: 'macOS Dynamic Island 风格工具中心，风格化的工具集合，提升你的工作效率。',
      en: 'A macOS Dynamic Island-style tool center — a stylized collection of tools to boost your productivity.',
    },
    features: [
      { zh: 'Dynamic Island 风格', en: 'Dynamic Island style' },
      { zh: '多功能集成', en: 'Multi-function integration' },
      { zh: '快捷启动', en: 'Quick launch' },
      { zh: '自定义配置', en: 'Custom configuration' },
      { zh: '美观界面', en: 'Beautiful interface' },
      { zh: '低资源占用', en: 'Low resource usage' },
    ],
    pricing: [
      {
        id: 'pro',
        name: { zh: 'Pro', en: 'Pro' },
        price: 9,
        period: '买断',
        features: [
          { zh: '全部功能', en: 'All features' },
          { zh: '优先支持', en: 'Priority support' },
          { zh: '永久更新', en: 'Lifetime updates' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/XNook',
    downloads: [
      {
        id: 'dmg',
        label: { zh: '下载 DMG', en: 'Download DMG' },
        r2Key: 'releases/xnook/1.3.15/XNook-1.3.15.dmg',
        icon: 'dmg',
        gated: true,
        version: '1.3.15',
        sha256: '821b29c5573d6530bed1a036efa0cddb64e821b9c795b0de605b69fc1ac6c087',
      },
    ],
    category: 'utility',
    icon: '📱',
    gradient: 'from-pink-500 to-rose-500',
    platforms: ['macOS', 'Menu Bar', 'Utility'],
    media: {
      cover: '/products/xnook/cover.webp',
      demo: '/products/xnook/demo.mp4',
      screenshots: [
        { src: '/products/xnook/screenshot-1.webp', alt: { zh: 'XNook 收起药丸 — 媒体播放状态', en: 'XNook collapsed pill — media playback status' } },
        { src: '/products/xnook/screenshot-2.webp', alt: { zh: 'XNook 展开面板 — 媒体播放+日历+文件托盘', en: 'XNook expanded panel — media + calendar + file tray' } },
      ],
    },
  },
  {
    id: 'chakra-visualizer',
    appUrl: '/apps/chakra-visualizer',
    name: { zh: 'Chakra Visualizer', en: 'Chakra Visualizer' },
    tagline: { zh: '手势忍术特效', en: 'Hand-Seal Jutsu Effects' },
    description: {
      zh: '用双手施展实时忍术特效 — 8 种手势忍术，火影主题互动 Web App，体感互动的极致体验。',
      en: 'Cast real-time jutsu effects with your hands — 8 hand-seal jutsu, a Naruto-themed interactive web app for the ultimate motion-sensing experience.',
    },
    features: [
      { zh: '8 种手势忍术', en: '8 hand-seal jutsu' },
      { zh: '实时动作捕捉', en: 'Real-time motion capture' },
      { zh: '火影主题特效', en: 'Naruto-themed effects' },
      { zh: 'WebGL 渲染', en: 'WebGL rendering' },
      { zh: '摄像头支持', en: 'Camera support' },
      { zh: '响应式设计', en: 'Responsive design' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '基础忍术', en: 'Basic jutsu' },
          { zh: 'Web 访问', en: 'Web access' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
      {
        id: 'premium',
        name: { zh: 'Premium', en: 'Premium' },
        price: 5,
        period: '月',
        features: [
          { zh: '全部忍术', en: 'All jutsu' },
          { zh: '高清特效', en: 'HD effects' },
          { zh: '优先更新', en: 'Priority updates' },
          { zh: '无广告', en: 'Ad-free' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/Chakra-Visualizer',
    license: 'mit',
    category: 'utility',
    icon: '🌀',
    gradient: 'from-cyan-500 to-blue-500',
    platforms: ['Web', 'WebGL', 'Camera'],
    media: {
      cover: '/products/chakra-visualizer/cover.webp',
      demo: '/products/chakra-visualizer/demo.mp4',
      screenshots: [
        { src: '/products/chakra-visualizer/screenshot-1.webp', alt: { zh: 'Chakra Visualizer 忍术特效界面', en: 'Chakra Visualizer jutsu effects interface' } },
        { src: '/products/chakra-visualizer/screenshot-2.webp', alt: { zh: 'Chakra Visualizer 手势捕捉', en: 'Chakra Visualizer hand-seal capture' } },
      ],
    },
  },
  {
    id: 'webgl-fluid-sim',
    appUrl: '/apps/webgl-fluid-sim',
    name: { zh: 'WebGL Fluid Sim', en: 'WebGL Fluid Sim' },
    tagline: { zh: 'GPU 流体模拟', en: 'GPU Fluid Simulation' },
    description: {
      zh: '基于 WebGL 的实时流体动力学模拟，支持手势交互、摄像头背景叠加、多种水纹模式，中英双语界面。GPU 加速渲染，丝滑 60fps。',
      en: 'A real-time WebGL fluid dynamics simulation supporting gesture interaction, camera background overlay, and multiple ripple patterns. Bilingual interface (CN/EN). GPU-accelerated rendering at a smooth 60fps.',
    },
    features: [
      { zh: 'GPU 加速 Navier-Stokes 流体求解', en: 'GPU-accelerated Navier-Stokes fluid solver' },
      { zh: '手势控制：触摸/鼠标拖动产生流体扰动', en: 'Gesture control: touch/mouse drag creates fluid disturbance' },
      { zh: '摄像头背景叠加模式', en: 'Camera background overlay mode' },
      { zh: '多种流体预设与水纹效果', en: 'Multiple fluid presets and ripple effects' },
      { zh: '中英双语界面', en: 'Bilingual interface (CN/EN)' },
      { zh: '移动端完整支持', en: 'Full mobile support' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '完整功能', en: 'Full features' },
          { zh: '开源', en: 'Open source' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/webgl-fluid-sim',
    license: 'mit',
    category: 'utility',
    icon: '🌊',
    gradient: 'from-sky-500 to-indigo-500',
    platforms: ['Web', 'WebGL', 'Mobile'],
    media: {
      cover: '/products/webgl-fluid-sim/cover.webp',
      demo: '/products/webgl-fluid-sim/demo.mp4',
      screenshots: [
        { src: '/products/webgl-fluid-sim/screenshot-1.webp', alt: { zh: 'WebGL Fluid Sim 流体模拟效果', en: 'WebGL Fluid Sim fluid simulation effect' } },
      ],
    },
  },
  {
    id: 'claude-phone-control',
    name: { zh: 'Claude Phone Control', en: 'Claude Phone Control' },
    tagline: { zh: '手机远程控制 Claude Code', en: 'Remote Control Claude Code from Your Phone' },
    description: {
      zh: '用手机浏览器远程控制 Mac/Windows 上的 Claude Code。基于 AoE + Tailscale Funnel，一行命令启动，扫码即连，支持完整的终端交互。',
      en: 'Remotely control Claude Code on Mac/Windows from your phone browser. Built on AoE + Tailscale Funnel — start with one command, scan to connect, with full terminal interaction.',
    },
    features: [
      { zh: '一行命令启动，扫码即用', en: 'One-command start, scan to use' },
      { zh: '支持 macOS 和 Windows', en: 'Supports macOS and Windows' },
      { zh: '基于 Tailscale Funnel 安全隧道', en: 'Tailscale Funnel secure tunnel' },
      { zh: '完整终端交互能力', en: 'Full terminal interaction' },
      { zh: '密码保护连接安全', en: 'Password-protected connection' },
      { zh: '自动生成二维码', en: 'Auto-generated QR code' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '完整功能', en: 'Full features' },
          { zh: '开源', en: 'Open source' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/claude-phone-control',
    license: 'mit',
    category: 'developer',
    icon: '📲',
    gradient: 'from-emerald-500 to-teal-500',
    platforms: ['macOS', 'Windows', 'Mobile'],
    media: {
      cover: '/products/claude-phone-control/cover.webp',
      demo: '/products/claude-phone-control/demo.mp4',
      screenshots: [
        { src: '/products/claude-phone-control/screenshot-1.webp', alt: { zh: 'Claude Phone Control 终端启动界面', en: 'Claude Phone Control terminal launch screen' } },
      ],
    },
  },
  {
    id: 'cursor-source-analyzer',
    name: { zh: 'Cursor Source Analyzer', en: 'Cursor Source Analyzer' },
    tagline: { zh: 'Cursor AI 架构解析', en: 'Cursor AI Architecture Analysis' },
    description: {
      zh: '交互式可视化分析 Cursor AI 代码编辑器的内部架构、AI 集成机制、代码库索引系统和上下文管理。9 大分析维度，ReactFlow 交互式架构图。',
      en: "An interactive visualization analyzing Cursor AI code editor's internal architecture, AI integration, codebase indexing system, and context management. 9 analysis dimensions with a ReactFlow interactive architecture diagram.",
    },
    features: [
      { zh: '9 大分析维度覆盖 Cursor 核心架构', en: "9 analysis dimensions covering Cursor's core architecture" },
      { zh: 'ReactFlow 交互式架构图（dagre 自动布局）', en: 'ReactFlow interactive architecture diagram (dagre auto-layout)' },
      { zh: '全局搜索 Cmd+K，跨页面加权评分', en: 'Global search Cmd+K with cross-page weighted scoring' },
      { zh: '深色/浅色主题切换', en: 'Dark/light theme toggle' },
      { zh: 'Cursor vs Claude Code vs Copilot 对比', en: 'Cursor vs Claude Code vs Copilot comparison' },
      { zh: '所有数据标注来源与置信度', en: 'All data annotated with sources and confidence' },
    ],
    pricing: [
      {
        id: 'free',
        name: { zh: 'Free', en: 'Free' },
        price: 0,
        features: [
          { zh: '完整功能', en: 'Full features' },
          { zh: '开源', en: 'Open source' },
          { zh: '社区支持', en: 'Community support' },
        ],
      },
    ],
    github: 'https://github.com/Meteorkid/cursor-source-analyzer',
    license: 'mit',
    category: 'developer',
    icon: '🔬',
    gradient: 'from-amber-500 to-orange-500',
    platforms: ['Web', 'React', 'TypeScript'],
    media: {
      cover: '/products/cursor-source-analyzer/cover.webp',
      demo: '/products/cursor-source-analyzer/demo.mp4',
      screenshots: [
        { src: '/products/cursor-source-analyzer/screenshot-1.webp', alt: { zh: 'Cursor Source Analyzer 架构概览', en: 'Cursor Source Analyzer architecture overview' } },
      ],
    },
  },
];

export interface ProductCategory {
  id: 'all' | 'ai' | 'developer' | 'design' | 'utility';
  name: LocalizedText;
  icon: string;
}

export const categories: ProductCategory[] = [
  { id: 'all', name: { zh: '全部产品', en: 'All Products' }, icon: '🚀' },
  { id: 'ai', name: { zh: 'AI 工具', en: 'AI Tools' }, icon: '🤖' },
  { id: 'developer', name: { zh: '开发者工具', en: 'Developer Tools' }, icon: '💻' },
  { id: 'design', name: { zh: '设计工具', en: 'Design Tools' }, icon: '🎨' },
  { id: 'utility', name: { zh: '实用工具', en: 'Utilities' }, icon: '🛠️' },
];

export interface LocalizedProductCategory {
  id: 'all' | 'ai' | 'developer' | 'design' | 'utility';
  name: string;
  icon: string;
}

/** 按 locale 把单个产品拍平成单语对象，供客户端组件直接消费 */
export function localizeProduct(product: Product, locale: Locale): LocalizedProduct {
  return {
    id: product.id,
    name: product.name[locale],
    tagline: product.tagline[locale],
    description: product.description[locale],
    features: product.features.map((f) => f[locale]),
    pricing: product.pricing.map((p) => ({
      id: p.id,
      name: p.name[locale],
      price: p.price,
      originalPrice: p.originalPrice,
      period: p.period,
      features: p.features.map((f) => f[locale]),
    })),
    github: product.github,
    license: product.license,
    demo: product.demo,
    experienceUrl: product.experienceUrl,
    appUrl: product.appUrl,
    status: product.status,
    quickstart: product.quickstart
      ? {
          command: product.quickstart.command,
          download: product.quickstart.download,
          note: product.quickstart.note ? product.quickstart.note[locale] : undefined,
        }
      : undefined,
    downloads: product.downloads?.map((d) => ({
      id: d.id,
      label: d.label[locale],
      icon: d.icon,
      note: d.note ? d.note[locale] : undefined,
      url: d.url,
      r2Key: d.r2Key,
      gated: d.gated,
      version: d.version,
      sha256: d.sha256,
    })),
    category: product.category,
    icon: product.icon,
    gradient: product.gradient,
    platforms: product.platforms,
    media: product.media
      ? {
          cover: product.media.cover,
          demo: product.media.demo,
          screenshots: product.media.screenshots.map((s) => ({ src: s.src, alt: s.alt[locale] })),
        }
      : undefined,
  };
}

/** 按 locale 拍平所有产品 */
export function localizeProducts(locale: Locale): LocalizedProduct[] {
  return products.map((p) => localizeProduct(p, locale));
}

/** 按 locale 拍平分类列表 */
export function localizeCategories(locale: Locale): LocalizedProductCategory[] {
  return categories.map((c) => ({ id: c.id, name: c.name[locale], icon: c.icon }));
}
