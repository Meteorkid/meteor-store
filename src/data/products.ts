export interface DownloadLink {
  label: string;
  url: string;
  icon: 'gitee' | 'pypi' | 'npm' | 'dmg' | 'zip' | 'github';
  note?: string;
}

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
  /** 快速上手：终端安装命令（可复制）或应用下载页 */
  quickstart?: {
    command?: string;
    download?: string;
    note?: string;
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
      alt: string;
    }[];
  };
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
    quickstart: {
      command: 'pip install omnicrawl',
      note: '国内可用清华镜像：pip install omnicrawl -i https://pypi.tuna.tsinghua.edu.cn/simple',
    },
    downloads: [
      { label: 'PyPI 安装', url: 'https://pypi.org/project/omnicrawl/', icon: 'pypi', note: '推荐，国内镜像源秒装' },
      { label: 'Gitee 源码', url: 'https://gitee.com/Meteorkid/omnicrawl', icon: 'gitee' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/omnicrawl', icon: 'github' },
    ],
    category: 'developer',
    icon: '🕷️',
    gradient: 'from-purple-500 to-pink-500',
    platforms: ['Python', 'CLI', 'API'],
    media: {
      cover: '/products/omnicrawl/cover.webp',
      demo: '/products/omnicrawl/demo.gif',
      screenshots: [
        { src: '/products/omnicrawl/screenshot-1.webp', alt: 'OmniCrawl 核心特性与对比表格' },
        { src: '/products/omnicrawl/screenshot-2.webp', alt: 'OmniCrawl 安装与快速开始' },
      ],
    },
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/ex-memory.git && cd ex-memory',
      note: '按 README 配置你的 LLM API Key，聊天记录只在本地处理',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/ex-memory', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/ex-memory', icon: 'github' },
    ],
    category: 'ai',
    icon: '💔',
    gradient: 'from-red-500 to-orange-500',
    platforms: ['Web', 'Mobile', 'API'],
    media: {
      cover: '/products/ex-memory/cover.webp',
      demo: '/products/ex-memory/demo.gif',
      screenshots: [
        { src: '/products/ex-memory/screenshot-1.webp', alt: 'Ex-Memory 记忆镜像对话界面' },
        { src: '/products/ex-memory/screenshot-2.webp', alt: 'Ex-Memory 模型配置界面' },
      ],
    },
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/skeleton-anatomy.git && cd skeleton-anatomy && npm install && npm run dev',
      note: '本地跑起来后浏览器打开即可旋转骨骼',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/skeleton-anatomy', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/skeleton-anatomy', icon: 'github' },
    ],
    category: 'design',
    icon: '🦴',
    gradient: 'from-gray-500 to-blue-500',
    platforms: ['Web', '3D', 'Mobile'],
    media: {
      cover: '/products/skeleton-anatomy/cover.webp',
      demo: '/products/skeleton-anatomy/demo.gif',
      screenshots: [
        { src: '/products/skeleton-anatomy/screenshot-1.webp', alt: 'Skeleton Anatomy 三维骨骼总览' },
        { src: '/products/skeleton-anatomy/screenshot-2.webp', alt: 'Skeleton Anatomy 骨骼详情界面' },
      ],
    },
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/ui-design-system.git ~/.claude/skills/ui-design-system',
      note: '装进 Claude Code 的 skills 目录，下次会话即可生效',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/ui-design-system', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/ui-design-system', icon: 'github' },
    ],
    category: 'design',
    icon: '🎨',
    gradient: 'from-blue-500 to-cyan-500',
    platforms: ['AI Agent', 'Design', 'CLI'],
    media: {
      cover: '/products/ui-design-system/cover.webp',
      demo: '/products/ui-design-system/demo.gif',
      screenshots: [
        { src: '/products/ui-design-system/screenshot-1.webp', alt: 'UI Design System 首页架构展示' },
        { src: '/products/ui-design-system/screenshot-2.webp', alt: 'UI Design System 组件浏览' },
      ],
    },
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/statux.git && cd statux',
      note: '按 README 一步配置 iTerm2 状态栏',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/statux', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/statux', icon: 'github' },
    ],
    category: 'developer',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-500',
    platforms: ['macOS', 'iTerm2', 'CLI'],
    media: {
      cover: '/products/statux/cover.webp',
      demo: '/products/statux/demo.gif',
      screenshots: [
        { src: '/products/statux/screenshot-1.webp', alt: 'Statux --help 命令帮助' },
        { src: '/products/statux/screenshot-2.webp', alt: 'Statux TUI 配置界面' },
      ],
    },
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
    quickstart: {
      download: 'https://gitee.com/Meteorkid/XIsland/releases',
      note: '下载最新版 DMG，拖进「应用程序」即可',
    },
    downloads: [
      { label: '下载 DMG (Gitee)', url: 'https://gitee.com/Meteorkid/XIsland/releases', icon: 'dmg', note: '国内高速下载' },
      { label: 'Gitee 源码', url: 'https://gitee.com/Meteorkid/XIsland', icon: 'gitee' },
      { label: 'GitHub Releases', url: 'https://github.com/Meteorkid/XIsland/releases', icon: 'github' },
    ],
    category: 'developer',
    icon: '🏝️',
    gradient: 'from-indigo-500 to-purple-500',
    platforms: ['macOS', 'Menu Bar', 'AI Agent'],
    media: {
      cover: '/products/xisland/cover.webp',
      demo: '/products/xisland/demo.gif',
      screenshots: [
        { src: '/products/xisland/screenshot-1.webp', alt: 'XIsland 展开面板 — 多代理实时状态' },
        { src: '/products/xisland/screenshot-2.webp', alt: 'XIsland 提问面板 — 交互式决策' },
      ],
    },
  },
  {
    id: 'tollow',
    name: 'Tollow',
    tagline: '沉浸式打字练习',
    description: '面向长文本阅读与输入训练的沉浸式打字应用，可从书库选择内容或上传文档，并通过练习数据了解输入表现。',
    features: [
      '长文本沉浸式输入',
      '内置练习书库',
      '支持上传个人文档',
      '速度与准确率统计',
      '练习记录分析',
      '响应式 Web 界面',
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/Tollow.git && cd Tollow && npm install && npm run dev',
      note: '本地启动后选一本书，直接开始沉浸式打字',
    },
    downloads: [
      { label: 'npm 安装', url: 'https://www.npmjs.com/package/tollow', icon: 'npm', note: '国内可用 npmmirror' },
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/Tollow', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/Tollow', icon: 'github' },
    ],
    category: 'utility',
    icon: '📈',
    gradient: 'from-yellow-500 to-orange-500',
    platforms: ['Web', 'Typing', 'Analytics'],
    media: {
      cover: '/products/tollow/cover.webp',
      demo: '/products/tollow/demo.gif',
      screenshots: [
        { src: '/products/tollow/screenshot-1.webp', alt: 'Tollow 精选书单 — 论语、道德经、唐诗三百首' },
        { src: '/products/tollow/screenshot-2.webp', alt: 'Tollow 打字练习 — 论语 WPM/准确率统计' },
      ],
    },
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
    quickstart: {
      download: 'https://gitee.com/Meteorkid/XNook/releases',
      note: '下载最新版 DMG，拖进「应用程序」即可',
    },
    downloads: [
      { label: '下载 DMG (Gitee)', url: 'https://gitee.com/Meteorkid/XNook/releases', icon: 'dmg', note: '国内高速下载' },
      { label: 'Gitee 源码', url: 'https://gitee.com/Meteorkid/XNook', icon: 'gitee' },
      { label: 'GitHub Releases', url: 'https://github.com/Meteorkid/XNook/releases', icon: 'github' },
    ],
    category: 'utility',
    icon: '📱',
    gradient: 'from-pink-500 to-rose-500',
    platforms: ['macOS', 'Menu Bar', 'Utility'],
    media: {
      cover: '/products/xnook/cover.webp',
      demo: '/products/xnook/demo.gif',
      screenshots: [
        { src: '/products/xnook/screenshot-1.webp', alt: 'XNook 收起药丸 — 媒体播放状态' },
        { src: '/products/xnook/screenshot-2.webp', alt: 'XNook 设置面板 — 通用设置与静音时段' },
      ],
    },
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
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/Chakra-Visualizer.git && cd Chakra-Visualizer && npm install && npm run dev',
      note: '允许摄像头权限后，结印就能放忍术',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/Chakra-Visualizer', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/Chakra-Visualizer', icon: 'github' },
    ],
    category: 'utility',
    icon: '🌀',
    gradient: 'from-cyan-500 to-blue-500',
    platforms: ['Web', 'WebGL', 'Camera'],
    media: {
      cover: '/products/chakra-visualizer/cover.webp',
      demo: '/products/chakra-visualizer/demo.gif',
      screenshots: [
        { src: '/products/chakra-visualizer/screenshot-1.webp', alt: 'Chakra Visualizer 忍术特效界面' },
        { src: '/products/chakra-visualizer/screenshot-2.webp', alt: 'Chakra Visualizer 手势捕捉' },
      ],
    },
  },
  {
    id: 'webgl-fluid-sim',
    name: 'WebGL Fluid Sim',
    tagline: 'GPU 流体模拟',
    description: '基于 WebGL 的实时流体动力学模拟，支持手势交互、摄像头背景叠加、多种水纹模式，中英双语界面。GPU 加速渲染，丝滑 60fps。',
    features: [
      'GPU 加速 Navier-Stokes 流体求解',
      '手势控制：触摸/鼠标拖动产生流体扰动',
      '摄像头背景叠加模式',
      '多种流体预设与水纹效果',
      '中英双语界面',
      '移动端完整支持',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['完整功能', '开源', '社区支持'],
      },
    ],
    github: 'https://github.com/Meteorkid/webgl-fluid-sim',
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/webgl-fluid-sim.git && cd webgl-fluid-sim && open index.html',
      note: '纯前端，直接打开 HTML 即可体验',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/webgl-fluid-sim', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/webgl-fluid-sim', icon: 'github' },
    ],
    category: 'utility',
    icon: '🌊',
    gradient: 'from-sky-500 to-indigo-500',
    platforms: ['Web', 'WebGL', 'Mobile'],
    media: {
      cover: '/products/webgl-fluid-sim/cover.webp',
      demo: '/products/webgl-fluid-sim/demo.gif',
      screenshots: [
        { src: '/products/webgl-fluid-sim/screenshot-1.webp', alt: 'WebGL Fluid Sim 流体模拟效果' },
      ],
    },
  },
  {
    id: 'claude-phone-control',
    name: 'Claude Phone Control',
    tagline: '手机远程控制 Claude Code',
    description: '用手机浏览器远程控制 Mac/Windows 上的 Claude Code。基于 AoE + Tailscale Funnel，一行命令启动，扫码即连，支持完整的终端交互。',
    features: [
      '一行命令启动，扫码即用',
      '支持 macOS 和 Windows',
      '基于 Tailscale Funnel 安全隧道',
      '完整终端交互能力',
      '密码保护连接安全',
      '自动生成二维码',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['完整功能', '开源', '社区支持'],
      },
    ],
    github: 'https://github.com/Meteorkid/claude-phone-control',
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/claude-phone-control.git && cd claude-phone-control && bash macos/phone-control.sh',
      note: '需要先安装 Tailscale，Windows 用户运行 PowerShell 脚本',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/claude-phone-control', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/claude-phone-control', icon: 'github' },
    ],
    category: 'developer',
    icon: '📲',
    gradient: 'from-emerald-500 to-teal-500',
    platforms: ['macOS', 'Windows', 'Mobile'],
    media: {
      cover: '/products/claude-phone-control/cover.webp',
      demo: '/products/claude-phone-control/demo.gif',
      screenshots: [
        { src: '/products/claude-phone-control/screenshot-1.webp', alt: 'Claude Phone Control 终端启动界面' },
      ],
    },
  },
  {
    id: 'cursor-source-analyzer',
    name: 'Cursor Source Analyzer',
    tagline: 'Cursor AI 架构解析',
    description: '交互式可视化分析 Cursor AI 代码编辑器的内部架构、AI 集成机制、代码库索引系统和上下文管理。9 大分析维度，ReactFlow 交互式架构图。',
    features: [
      '9 大分析维度覆盖 Cursor 核心架构',
      'ReactFlow 交互式架构图（dagre 自动布局）',
      '全局搜索 Cmd+K，跨页面加权评分',
      '深色/浅色主题切换',
      'Cursor vs Claude Code vs Copilot 对比',
      '所有数据标注来源与置信度',
    ],
    pricing: [
      {
        name: 'Free',
        price: 0,
        features: ['完整功能', '开源', '社区支持'],
      },
    ],
    github: 'https://github.com/Meteorkid/cursor-source-analyzer',
    quickstart: {
      command: 'git clone https://gitee.com/Meteorkid/cursor-source-analyzer.git && cd cursor-source-analyzer && npm install && npm run dev',
      note: '本地启动后可交互浏览 Cursor 架构分析',
    },
    downloads: [
      { label: 'Gitee 克隆', url: 'https://gitee.com/Meteorkid/cursor-source-analyzer', icon: 'gitee', note: '国内推荐' },
      { label: 'GitHub 源码', url: 'https://github.com/Meteorkid/cursor-source-analyzer', icon: 'github' },
    ],
    category: 'developer',
    icon: '🔬',
    gradient: 'from-amber-500 to-orange-500',
    platforms: ['Web', 'React', 'TypeScript'],
    media: {
      cover: '/products/cursor-source-analyzer/cover.webp',
      demo: '/products/cursor-source-analyzer/demo.gif',
      screenshots: [
        { src: '/products/cursor-source-analyzer/screenshot-1.webp', alt: 'Cursor Source Analyzer 架构概览' },
      ],
    },
  },
];

export const categories = [
  { id: 'all', name: '全部产品', icon: '🚀' },
  { id: 'ai', name: 'AI 工具', icon: '🤖' },
  { id: 'developer', name: '开发者工具', icon: '💻' },
  { id: 'design', name: '设计工具', icon: '🎨' },
  { id: 'utility', name: '实用工具', icon: '🛠️' },
];
