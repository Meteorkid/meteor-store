export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: {
    name: string;
    price: number;
    period?: string;
    features: string[];
  }[];
  github: string;
  demo?: string;
  category: 'ai' | 'developer' | 'design' | 'utility';
  icon: string;
  gradient: string;
}

export const products: Product[] = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    tagline: '万能爬虫框架',
    description: '基于 Scrapling + curl_cffi + Playwright 的全能爬虫框架，支持反反爬、浏览器指纹模拟、智能重试，让数据采集变得简单高效。',
    features: [
      '多引擎支持：Scrapling、curl_cffi、Playwright 无缝切换',
      '反反爬机制：自动绕过 Cloudflare、Akamai 等 WAF',
      '浏览器指纹模拟：真实浏览器行为，降低封禁风险',
      '智能重试与代理轮换',
      '异步并发采集',
      '详细的日志与监控',
    ],
    pricing: [
      {
        name: 'Starter',
        price: 29,
        period: '月',
        features: ['1,000 次 API 调用/月', '基础反爬功能', '社区支持', '单用户'],
      },
      {
        name: 'Pro',
        price: 79,
        period: '月',
        features: ['10,000 次 API 调用/月', '高级反爬功能', '优先支持', '5 用户', 'API 文档'],
      },
      {
        name: 'Enterprise',
        price: 199,
        period: '月',
        features: ['无限 API 调用', '定制化反爬策略', '专属技术支持', '无限用户', 'SLA 保障', '私有部署'],
      },
    ],
    github: 'https://github.com/Meteorkid/omnicrawl',
    category: 'developer',
    icon: '🕷️',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ex-memory',
    name: 'Ex-Memory',
    tagline: '前任记忆智能体',
    description: 'LLM + RAG 技术还原 ta 的语气，让聊天像跟真人对话。基于你的聊天记录，AI 学习并模仿特定人的说话风格。',
    features: [
      '聊天记录分析与学习',
      '语气风格还原',
      '多轮对话生成',
      '情感分析与理解',
      '隐私保护：数据本地处理',
      '支持多种 LLM 模型',
    ],
    pricing: [
      {
        name: 'Basic',
        price: 9,
        period: '月',
        features: ['100 条消息/月', '基础语气分析', '单一聊天记录', '社区支持'],
      },
      {
        name: 'Premium',
        price: 19,
        period: '月',
        features: ['500 条消息/月', '高级语气还原', '多聊天记录', '优先支持', '情感分析'],
      },
      {
        name: 'Ultimate',
        price: 39,
        period: '月',
        features: ['无限消息', '完美语气还原', '无限聊天记录', '专属支持', '自定义训练', 'API 接入'],
      },
    ],
    github: 'https://github.com/Meteorkid/ex-memory',
    category: 'ai',
    icon: '💔',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    id: 'skeleton-anatomy',
    name: 'Skeleton Anatomy',
    tagline: '3D 骨骼解剖平台',
    description: '人体骨骼 3D 图谱 — 交互式解剖学习应用，支持旋转、缩放、标注，医学教育的最佳伴侣。',
    features: [
      '完整人体骨骼 3D 模型',
      '交互式旋转与缩放',
      '骨骼标注与说明',
      '多角度观察',
      '搜索与筛选功能',
      '响应式设计，支持移动端',
    ],
    pricing: [
      {
        name: 'Student',
        price: 19,
        period: '年',
        features: ['完整骨骼模型', '基础标注', 'Web 访问', '个人使用'],
      },
      {
        name: 'Professional',
        price: 49,
        period: '年',
        features: ['完整骨骼模型', '高级标注', 'Web + 移动端', '教学使用', '导出功能'],
      },
      {
        name: 'Institution',
        price: 199,
        period: '年',
        features: ['完整骨骼模型', '自定义标注', '多用户', 'API 接入', '定制化服务', '优先支持'],
      },
    ],
    github: 'https://github.com/Meteorkid/skeleton-anatomy',
    category: 'design',
    icon: '🦴',
    gradient: 'from-gray-500 to-blue-500',
  },
  {
    id: 'ui-design-system',
    name: 'UI Design System',
    tagline: 'AI Agent 设计系统',
    description: 'Comprehensive UI/UX design intelligence skill for AI coding agents — 8 anchors, 73 styles, 199 UX rules, audit pipeline.',
    features: [
      '8 个设计锚点',
      '73 种设计风格',
      '199 条 UX 规则',
      '自动化审计管道',
      'AI Agent 集成',
      '持续更新',
    ],
    pricing: [
      {
        name: 'Solo',
        price: 9,
        period: '月',
        features: ['基础设计规则', '单一 Agent', '社区支持', '月度更新'],
      },
      {
        name: 'Team',
        price: 29,
        period: '月',
        features: ['完整设计系统', '5 Agent', '优先支持', '周更新', '自定义规则'],
      },
      {
        name: 'Enterprise',
        price: 99,
        period: '月',
        features: ['完整设计系统', '无限 Agent', '专属支持', '实时更新', '定制化', 'API 接入'],
      },
    ],
    github: 'https://github.com/Meteorkid/ui-design-system',
    category: 'design',
    icon: '🎨',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'statux',
    name: 'Statux',
    tagline: 'CLI 状态栏工具',
    description: 'AI Agent status display for Claude Code and iTerm2，实时显示 AI 代理状态，让开发更高效。',
    features: [
      '实时状态显示',
      'iTerm2 集成',
      '自定义配置',
      '轻量级',
      '开源免费',
      '跨平台支持',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['基础状态显示', '社区支持', '开源'],
      },
      {
        name: 'Pro',
        price: 9,
        period: '买断',
        features: ['高级主题', '自定义配置', '优先支持', '永久更新'],
      },
    ],
    github: 'https://github.com/Meteorkid/statux',
    category: 'developer',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'xisland',
    name: 'XIsland',
    tagline: 'macOS Dynamic Island for AI',
    description: 'A macOS Dynamic Island-style control tower for all your AI coding agents. 风格化的 AI 代理控制中心。',
    features: [
      'Dynamic Island 风格界面',
      '多 AI 代理管理',
      '实时状态监控',
      '快捷操作',
      '美观的动画效果',
      '低资源占用',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['基础功能', '单代理', '社区支持'],
      },
      {
        name: 'Pro',
        price: 12,
        period: '买断',
        features: ['多代理', '高级主题', '优先支持', '永久更新'],
      },
    ],
    github: 'https://github.com/Meteorkid/XIsland',
    category: 'developer',
    icon: '🏝️',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'tollow',
    name: 'Tollow',
    tagline: '智能追踪工具',
    description: '智能追踪与分析工具，帮助你更好地理解和优化你的工作流程。',
    features: [
      '智能追踪',
      '数据分析',
      '可视化报告',
      '自动化工作流',
      '多平台支持',
      '隐私保护',
    ],
    pricing: [
      {
        name: 'Basic',
        price: 0,
        features: ['基础追踪', '7 天数据', '社区支持'],
      },
      {
        name: 'Pro',
        price: 15,
        period: '月',
        features: ['高级追踪', '无限数据', '优先支持', 'API 接入'],
      },
    ],
    github: 'https://github.com/Meteorkid/Tollow',
    category: 'utility',
    icon: '📈',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'xnook',
    name: 'XNook',
    tagline: 'macOS 工具中心',
    description: 'macOS Dynamic Island-style tool center，风格化的工具集合，提升你的工作效率。',
    features: [
      'Dynamic Island 风格',
      '多功能集成',
      '快捷启动',
      '自定义配置',
      '美观界面',
      '低资源占用',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['基础功能', '社区支持'],
      },
      {
        name: 'Pro',
        price: 9,
        period: '买断',
        features: ['全部功能', '优先支持', '永久更新'],
      },
    ],
    github: 'https://github.com/Meteorkid/XNook',
    category: 'utility',
    icon: '📱',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'chakra-visualizer',
    name: 'Chakra Visualizer',
    tagline: '手势忍术特效',
    description: '用双手施展实时忍术特效 — 8种手势忍术，火影主题互动 Web App，体感互动的极致体验。',
    features: [
      '8 种手势忍术',
      '实时动作捕捉',
      '火影主题特效',
      'WebGL 渲染',
      '摄像头支持',
      '响应式设计',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['基础忍术', 'Web 访问', '社区支持'],
      },
      {
        name: 'Premium',
        price: 5,
        period: '月',
        features: ['全部忍术', '高清特效', '优先更新', '无广告'],
      },
    ],
    github: 'https://github.com/Meteorkid/Chakra-Visualizer',
    category: 'utility',
    icon: '🌀',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export const categories = [
  { id: 'all', name: '全部产品', icon: '🚀' },
  { id: 'ai', name: 'AI 工具', icon: '🤖' },
  { id: 'developer', name: '开发者工具', icon: '💻' },
  { id: 'design', name: '设计工具', icon: '🎨' },
  { id: 'utility', name: '实用工具', icon: '🛠️' },
];
