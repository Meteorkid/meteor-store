import type { PathfinderDirection } from '@/lib/pathfinder/catalog-types';

type Localized = { zh: string; en: string };

export interface PathfinderDirectionGuide {
  slug: PathfinderDirection;
  title: Localized;
  description: Localized;
  fit: Localized;
  outcome: Localized;
  stages: Array<{
    title: Localized;
    description: Localized;
    skills: Localized[];
  }>;
}

export const PATHFINDER_DIRECTION_GUIDES: PathfinderDirectionGuide[] = [
  {
    slug: 'ai',
    title: { zh: '人工智能', en: 'Artificial Intelligence' },
    description: { zh: '从 Python、数据与模型基础出发，逐步完成可验证的 AI 应用或研究复现。', en: 'Start with Python, data, and model fundamentals, then ship a verifiable AI application or research reproduction.' },
    fit: { zh: '喜欢探索模型能力、数据规律和自动化工作流的学生', en: 'Students curious about model capabilities, data patterns, and automated workflows' },
    outcome: { zh: '一个有评测、有说明、可公开演示的 AI 项目', en: 'A public AI project with evaluation, documentation, and a working demo' },
    stages: [
      { title: { zh: '基础', en: 'Foundations' }, description: { zh: '先建立可持续学习所需的编程与数据基础。', en: 'Build the programming and data foundation needed for sustainable learning.' }, skills: [{ zh: 'Python 与命令行', en: 'Python and the command line' }, { zh: '基础数学与统计', en: 'Basic math and statistics' }, { zh: '数据清洗与可视化', en: 'Data cleaning and visualization' }] },
      { title: { zh: '理解模型', en: 'Understand Models' }, description: { zh: '知道模型能做什么、不能做什么，以及如何验证。', en: 'Learn what models can and cannot do, and how to verify them.' }, skills: [{ zh: '机器学习基本概念', en: 'Machine-learning fundamentals' }, { zh: '提示、上下文与检索', en: 'Prompts, context, and retrieval' }, { zh: '评测与错误分析', en: 'Evaluation and error analysis' }] },
      { title: { zh: '真实项目', en: 'Real Project' }, description: { zh: '把一个明确问题做成能复现的最小系统。', en: 'Turn one well-defined problem into a reproducible minimum system.' }, skills: [{ zh: '模型/API 集成', en: 'Model and API integration' }, { zh: 'RAG 或 Agent 工作流', en: 'RAG or agent workflows' }, { zh: '安全、成本与回退', en: 'Safety, cost, and fallbacks' }] },
      { title: { zh: '交付与求职', en: 'Delivery and Career' }, description: { zh: '用作品、实验记录和开源贡献证明能力。', en: 'Demonstrate skill through a project, experiment log, and open-source contribution.' }, skills: [{ zh: 'README 与演示', en: 'README and demo' }, { zh: '复现实验报告', en: 'Reproduction report' }, { zh: '开源协作', en: 'Open-source collaboration' }] },
    ],
  },
  {
    slug: 'frontend',
    title: { zh: '前端开发', en: 'Frontend Development' },
    description: { zh: '从语义化页面与交互基础出发，做出快速、易用、能上线的产品界面。', en: 'Start with semantic pages and interaction fundamentals, then ship fast, usable product interfaces.' },
    fit: { zh: '关注界面、交互、信息表达和用户体验的学生', en: 'Students interested in interfaces, interaction, information design, and user experience' },
    outcome: { zh: '一个响应式、可访问、已部署的真实网页应用', en: 'A responsive, accessible, deployed web application' },
    stages: [
      { title: { zh: '网页基础', en: 'Web Foundations' }, description: { zh: '让结构、样式和浏览器行为形成完整心智模型。', en: 'Build a complete mental model of structure, styling, and browser behavior.' }, skills: [{ zh: 'HTML 与可访问性', en: 'HTML and accessibility' }, { zh: 'CSS 布局与响应式', en: 'CSS layout and responsive design' }, { zh: 'JavaScript 基础', en: 'JavaScript fundamentals' }] },
      { title: { zh: '工程能力', en: 'Engineering' }, description: { zh: '用类型、组件和数据流维护复杂界面。', en: 'Use types, components, and data flow to maintain complex interfaces.' }, skills: [{ zh: 'TypeScript', en: 'TypeScript' }, { zh: 'React 与状态管理', en: 'React and state management' }, { zh: '请求、缓存与错误状态', en: 'Requests, caching, and error states' }] },
      { title: { zh: '产品质量', en: 'Product Quality' }, description: { zh: '不仅做出来，还要在真实设备上好用。', en: 'Go beyond making it work: make it good on real devices.' }, skills: [{ zh: '性能与 Core Web Vitals', en: 'Performance and Core Web Vitals' }, { zh: '测试与调试', en: 'Testing and debugging' }, { zh: '设计系统', en: 'Design systems' }] },
      { title: { zh: '交付与作品集', en: 'Delivery and Portfolio' }, description: { zh: '把需求、实现与迭代过程讲清楚。', en: 'Explain the requirement, implementation, and iteration clearly.' }, skills: [{ zh: '部署与域名', en: 'Deployment and domains' }, { zh: '项目叙事', en: 'Project storytelling' }, { zh: '开源 issue 与 PR', en: 'Open-source issues and PRs' }] },
    ],
  },
  {
    slug: 'backend',
    title: { zh: '后端开发', en: 'Backend Development' },
    description: { zh: '从 API、数据库和系统边界出发，建立可靠、可观察、能部署的服务。', en: 'Start with APIs, databases, and system boundaries to build reliable, observable, deployable services.' },
    fit: { zh: '喜欢业务规则、系统设计、数据一致性和工程可靠性的学生', en: 'Students drawn to business rules, systems design, data consistency, and reliability' },
    outcome: { zh: '一个带鉴权、数据库、测试和部署说明的服务', en: 'A service with authentication, a database, tests, and deployment documentation' },
    stages: [
      { title: { zh: '语言与网络', en: 'Language and Networking' }, description: { zh: '掌握一门主语言并理解请求如何流动。', en: 'Master one primary language and understand how requests flow.' }, skills: [{ zh: 'Java / Go / Node.js 其一', en: 'Java, Go, or Node.js' }, { zh: 'HTTP 与 REST', en: 'HTTP and REST' }, { zh: 'Linux 与 Git', en: 'Linux and Git' }] },
      { title: { zh: '数据与业务', en: 'Data and Domain' }, description: { zh: '让数据模型真正表达业务约束。', en: 'Make the data model express real domain constraints.' }, skills: [{ zh: 'SQL 与索引', en: 'SQL and indexes' }, { zh: '事务与并发', en: 'Transactions and concurrency' }, { zh: '输入校验与错误模型', en: 'Input validation and error models' }] },
      { title: { zh: '可靠服务', en: 'Reliable Services' }, description: { zh: '在失败、重试和流量变化下仍然可控。', en: 'Stay predictable under failures, retries, and changing traffic.' }, skills: [{ zh: '缓存与队列', en: 'Caching and queues' }, { zh: '鉴权与安全', en: 'Authentication and security' }, { zh: '日志、指标与追踪', en: 'Logs, metrics, and traces' }] },
      { title: { zh: '交付与系统设计', en: 'Delivery and Design' }, description: { zh: '用测试、文档和部署证明系统边界。', en: 'Prove system boundaries with tests, documentation, and deployment.' }, skills: [{ zh: '自动化测试', en: 'Automated testing' }, { zh: '容器与部署', en: 'Containers and deployment' }, { zh: '架构说明与取舍', en: 'Architecture decisions and tradeoffs' }] },
    ],
  },
  {
    slug: 'data',
    title: { zh: '数据分析', en: 'Data Analytics' },
    description: { zh: '从问题定义、数据清洗和统计判断出发，产出可解释、可复现的分析。', en: 'Start with problem framing, data cleaning, and statistical judgment to produce explainable, reproducible analysis.' },
    fit: { zh: '喜欢从杂乱数据中发现规律并支持决策的学生', en: 'Students who enjoy finding patterns in messy data and supporting decisions' },
    outcome: { zh: '一份包含数据、代码、图表和结论边界的分析作品', en: 'An analysis portfolio piece with data, code, charts, and clearly bounded conclusions' },
    stages: [
      { title: { zh: '数据基础', en: 'Data Foundations' }, description: { zh: '能够独立取得、检查和整理数据。', en: 'Independently obtain, inspect, and organize data.' }, skills: [{ zh: 'Excel / Sheets', en: 'Excel or Sheets' }, { zh: 'SQL 查询', en: 'SQL queries' }, { zh: 'Python 与 Pandas', en: 'Python and Pandas' }] },
      { title: { zh: '分析思维', en: 'Analytical Thinking' }, description: { zh: '把业务问题变成可检验的分析问题。', en: 'Turn a domain question into a testable analysis question.' }, skills: [{ zh: '描述统计', en: 'Descriptive statistics' }, { zh: '抽样、偏差与相关性', en: 'Sampling, bias, and correlation' }, { zh: '指标定义', en: 'Metric definition' }] },
      { title: { zh: '表达与验证', en: 'Communication and Validation' }, description: { zh: '让图表和结论经得住追问。', en: 'Make charts and conclusions withstand scrutiny.' }, skills: [{ zh: '数据可视化', en: 'Data visualization' }, { zh: '可复现 Notebook', en: 'Reproducible notebooks' }, { zh: '结论边界与反例', en: 'Boundaries and counterexamples' }] },
      { title: { zh: '真实课题', en: 'Real Question' }, description: { zh: '完成一项对社团、校园或公开数据有用的分析。', en: 'Complete an analysis useful to a campus group or public-data audience.' }, skills: [{ zh: '需求访谈', en: 'Stakeholder interviews' }, { zh: '分析报告', en: 'Analysis report' }, { zh: '作品发布与复盘', en: 'Publishing and retrospective' }] },
    ],
  },
];

export function getPathfinderDirectionGuide(slug: string) {
  return PATHFINDER_DIRECTION_GUIDES.find((direction) => direction.slug === slug);
}
