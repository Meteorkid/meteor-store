import type {
  PathfinderCatalogItem,
  PathfinderCatalogSource,
  PathfinderCatalogTags,
  PathfinderDevice,
  PathfinderDifficulty,
  PathfinderDirection,
  PathfinderItemType,
  PathfinderNetwork,
  PathfinderRemoteStatus,
  PathfinderSourceAdapter,
  PathfinderSourceType,
} from '@/lib/pathfinder/catalog-types';
import {
  PATHFINDER_DIRECTIONS,
  emptyPathfinderTags,
} from '@/lib/pathfinder/catalog-types';

const VERIFIED_AT = '2026-08-24T00:00:00.000Z';

interface StaticSourceDefinition {
  id: string;
  name: string;
  nameEn?: string;
  siteUrl: string;
  adapter?: PathfinderSourceAdapter;
  sourceType?: PathfinderSourceType;
}

function staticSource(definition: StaticSourceDefinition): PathfinderCatalogSource {
  return {
    id: definition.id,
    name: { zh: definition.name, en: definition.nameEn ?? definition.name },
    adapter: definition.adapter ?? 'manual',
    siteUrl: definition.siteUrl,
    sourceType: definition.sourceType ?? 'html',
    trustLevel: 'official',
    enabled: false,
    autoPublish: false,
    syncIntervalMinutes: 1_440,
    lastSuccessAt: null,
    lastError: null,
    consecutiveFailures: 0,
    origin: 'static',
  };
}

const SOURCES = {
  github: staticSource({
    id: 'static-source-github',
    name: 'GitHub 官方仓库',
    nameEn: 'Official GitHub repositories',
    siteUrl: 'https://github.com/',
    adapter: 'github',
    sourceType: 'api',
  }),
  computerDesign: staticSource({
    id: 'static-source-computer-design',
    name: '中国大学生计算机设计大赛',
    nameEn: 'Chinese Collegiate Computing Competition',
    siteUrl: 'https://jsjds.blcu.edu.cn/',
  }),
  innovation: staticSource({
    id: 'static-source-innovation-competition',
    name: '全国大学生创业服务网',
    nameEn: 'National College Student Entrepreneurship Service',
    siteUrl: 'https://cy.ncss.cn/',
  }),
  lanqiao: staticSource({
    id: 'static-source-lanqiao',
    name: '蓝桥杯大赛',
    nameEn: 'Lanqiao Cup',
    siteUrl: 'https://dasai.lanqiao.cn/',
  }),
  kaggle: staticSource({
    id: 'static-source-kaggle',
    name: 'Kaggle Competitions',
    siteUrl: 'https://www.kaggle.com/competitions',
  }),
  tianchi: staticSource({
    id: 'static-source-tianchi',
    name: '天池竞赛',
    nameEn: 'Tianchi Competitions',
    siteUrl: 'https://tianchi.aliyun.com/competition/',
  }),
  systemsCompetition: staticSource({
    id: 'static-source-systems-competition',
    name: '全国大学生计算机系统能力大赛',
    nameEn: 'National Student Computer Systems Capability Competition',
    siteUrl: 'https://pra.xtnl.org.cn/',
  }),
  ncssJobs: staticSource({
    id: 'static-source-ncss-jobs',
    name: '国家大学生就业服务平台',
    nameEn: 'National College Student Employment Service',
    siteUrl: 'https://gcu.ncss.cn/',
  }),
  bytedance: staticSource({
    id: 'static-source-bytedance-campus',
    name: '字节跳动校园招聘',
    nameEn: 'ByteDance Campus Recruitment',
    siteUrl: 'https://jobs.bytedance.com/campus',
  }),
  tencent: staticSource({
    id: 'static-source-tencent-campus',
    name: '腾讯校园招聘',
    nameEn: 'Tencent Campus Recruitment',
    siteUrl: 'https://join.qq.com/',
  }),
  alibaba: staticSource({
    id: 'static-source-alibaba-recruitment',
    name: '阿里巴巴集团招聘',
    nameEn: 'Alibaba Group Careers',
    siteUrl: 'https://talent.alibaba.com/',
  }),
  huawei: staticSource({
    id: 'static-source-huawei-campus',
    name: '华为校园招聘',
    nameEn: 'Huawei Campus Recruitment',
    siteUrl: 'https://career.huawei.com/reccampportal/portal5/campus-recruitment.html',
  }),
  microsoftCareers: staticSource({
    id: 'static-source-microsoft-students',
    name: 'Microsoft Students',
    siteUrl: 'https://careers.microsoft.com/v2/global/en/students',
  }),
  googleCareers: staticSource({
    id: 'static-source-google-students',
    name: 'Google Student Careers',
    siteUrl: 'https://www.google.com/about/careers/applications/students/',
  }),
  aicOpenSource: staticSource({
    id: 'static-source-aic-open-source-2026',
    name: '全球校园人工智能算法精英大赛',
    nameEn: 'Global Campus AI Algorithm Elite Competition',
    siteUrl: 'https://www.aicomp.cn/tracks/tracks-5/4924.html',
  }),
  ibmZDatathon: staticSource({
    id: 'static-source-ibm-z-datathon-2026',
    name: 'IBM Z Community',
    siteUrl: 'https://community.ibm.com/community/user/events/event-description?CalendarEventKey=0b55f6e4-93a9-4ee4-94ff-019fa8667b04&CommunityKey=9a8b7fc3-b167-447a-8e14-adf93406eccc&Home=%2Fcommunity%2Fuser%2Fgroups%2Fcommunity-home%2Fmanage-events',
  }),
  unuMacau: staticSource({
    id: 'static-source-unu-ai-sdgs-2026',
    name: 'United Nations University Macau',
    siteUrl: 'https://unu.edu/macau/news/ai-sdgs-global-youth-ai-future-innovation-competition-2026-call-applications',
  }),
  mitacs: staticSource({
    id: 'static-source-mitacs-gri-2027',
    name: 'Mitacs Globalink',
    siteUrl: 'https://www.mitacs.ca/our-programs/globalink-research-internship-students/',
  }),
  oist: staticSource({
    id: 'static-source-oist-spring-2027',
    name: 'OIST Admissions',
    siteUrl: 'https://www.oist.jp/admissions/research-internship/apply-research-internship',
  }),
  maxPlanck: staticSource({
    id: 'static-source-max-planck-cs-internship-2027',
    name: 'Max Planck Computer Science',
    siteUrl: 'https://www.cis.mpg.de/internships/',
  }),
  openai: staticSource({
    id: 'static-source-openai-research',
    name: 'OpenAI Research',
    siteUrl: 'https://openai.com/research/',
  }),
  deepmind: staticSource({
    id: 'static-source-deepmind-blog',
    name: 'Google DeepMind Blog',
    siteUrl: 'https://deepmind.google/blog/',
  }),
  huggingface: staticSource({
    id: 'static-source-huggingface-blog',
    name: 'Hugging Face Blog',
    siteUrl: 'https://huggingface.co/blog',
  }),
  pytorchBlog: staticSource({
    id: 'static-source-pytorch-blog',
    name: 'PyTorch Blog',
    siteUrl: 'https://pytorch.org/blog/',
  }),
  anthropic: staticSource({
    id: 'static-source-anthropic-research',
    name: 'Anthropic Research',
    siteUrl: 'https://www.anthropic.com/research',
  }),
} satisfies Record<string, PathfinderCatalogSource>;

export const STATIC_PATHFINDER_SOURCES: PathfinderCatalogSource[] = Object.values(SOURCES);

type SourceKey = keyof typeof SOURCES;

interface SeedDefinition {
  id: string;
  source: SourceKey;
  canonicalUrl: string;
  itemType: PathfinderItemType;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  organization: string;
  organizationEn?: string;
  direction: PathfinderDirection;
  directions?: PathfinderDirection[];
  difficulty?: PathfinderDifficulty;
  estimatedMinutes?: number | null;
  costCny?: number | null;
  costAmount?: number | null;
  costCurrency?: string | null;
  costLabelZh?: string | null;
  costLabelEn?: string | null;
  device?: PathfinderDevice;
  network?: PathfinderNetwork;
  region?: string | null;
  regionEn?: string | null;
  remoteStatus?: PathfinderRemoteStatus;
  eligibilityZh?: string;
  eligibilityEn?: string;
  deadlineText?: string | null;
  deadlineTextEn?: string | null;
  deadlineDate?: string | null;
  deadlineAt?: string | null;
  publishedAt?: string | null;
  learningEligible?: boolean;
  requiresManualEligibilityCheck?: boolean;
  tags?: Partial<PathfinderCatalogTags>;
}

function seed(definition: SeedDefinition): PathfinderCatalogItem {
  const source = SOURCES[definition.source];
  const defaults = defaultsFor(definition.itemType);
  const tags = emptyPathfinderTags();

  for (const dimension of Object.keys(definition.tags ?? {}) as (keyof PathfinderCatalogTags)[]) {
    tags[dimension] = [...(definition.tags?.[dimension] ?? [])];
  }

  const costCny = definition.costCny === undefined
    ? defaultCostCny(definition.itemType)
    : definition.costCny;
  const costAmount = definition.costAmount === undefined ? costCny : definition.costAmount;
  const controlledTagDirections = [...tags.topic, ...tags.career]
    .filter((tag): tag is PathfinderDirection => (
      (PATHFINDER_DIRECTIONS as readonly string[]).includes(tag)
    ));
  const directions = [...new Set([
    definition.direction,
    ...(definition.directions ?? []),
    ...controlledTagDirections,
  ])];

  return {
    id: `static-${definition.id}`,
    sourceId: source.id,
    source,
    externalId: definition.id,
    canonicalUrl: definition.canonicalUrl,
    itemType: definition.itemType,
    title: { zh: definition.titleZh, en: definition.titleEn },
    summary: { zh: definition.summaryZh, en: definition.summaryEn },
    organization: { zh: definition.organization, en: definition.organizationEn ?? definition.organization },
    direction: definition.direction,
    directions,
    difficulty: definition.difficulty ?? defaults.difficulty,
    estimatedMinutes: definition.estimatedMinutes === undefined
      ? defaults.estimatedMinutes
      : definition.estimatedMinutes,
    costCny,
    cost: {
      amount: costAmount,
      currency: costAmount === null ? null : definition.costCurrency ?? 'CNY',
      label: definition.costLabelZh || definition.costLabelEn
        ? {
            zh: definition.costLabelZh ?? definition.costLabelEn ?? '',
            en: definition.costLabelEn ?? definition.costLabelZh ?? '',
          }
        : null,
    },
    device: definition.device ?? 'computer',
    network: definition.network ?? 'normal',
    region: definition.region === undefined
      ? defaults.region
      : definition.region === null
        ? null
        : { zh: definition.region, en: definition.regionEn ?? definition.region },
    remoteStatus: definition.remoteStatus ?? defaults.remoteStatus,
    eligibility: {
      zh: definition.eligibilityZh ?? defaults.eligibilityZh,
      en: definition.eligibilityEn ?? defaults.eligibilityEn,
    },
    deadlineText: definition.deadlineText === undefined
      ? defaults.deadlineText
      : definition.deadlineText === null
        ? null
        : { zh: definition.deadlineText, en: definition.deadlineTextEn ?? definition.deadlineText },
    deadlineDate: definition.deadlineDate ?? null,
    deadlineAt: definition.deadlineAt ?? null,
    publishedAt: definition.publishedAt ?? null,
    discoveredAt: VERIFIED_AT,
    verifiedAt: VERIFIED_AT,
    status: 'published',
    // 长期赛事/招聘门户只用于发现；没有具体赛项、岗位与可核验截止时间时不直接进入路径。
    learningEligible: definition.learningEligible ?? definition.itemType === 'open-source',
    requiresManualEligibilityCheck: definition.requiresManualEligibilityCheck ?? false,
    tags,
    origin: 'static',
  };
}

function defaultCostCny(itemType: PathfinderItemType): number | null {
  return itemType === 'open-source' || itemType === 'ai-update' ? 0 : null;
}

function defaultsFor(itemType: PathfinderItemType): Pick<
  PathfinderCatalogItem,
  'difficulty' | 'estimatedMinutes' | 'region' | 'remoteStatus' | 'deadlineText'
> & { eligibilityZh: string; eligibilityEn: string } {
  if (itemType === 'competition') {
    return {
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      region: { zh: '中国', en: 'China' },
      remoteStatus: 'unspecified',
      eligibilityZh: '面向符合当届规则的在校学生；报名资格以官方网站为准。',
      eligibilityEn: 'For currently enrolled students who meet the current rules; confirm eligibility on the official site.',
      deadlineText: { zh: '以官方网站最新公告为准', en: 'Check the latest official announcement' },
    };
  }
  if (itemType === 'internship') {
    return {
      difficulty: 'intermediate',
      estimatedMinutes: 60,
      region: { zh: '中国', en: 'China' },
      remoteStatus: 'unspecified',
      eligibilityZh: '岗位、年级与地域要求随招聘批次变化，请以官方职位描述为准。',
      eligibilityEn: 'Role, graduation-year, and location requirements vary by hiring cycle; check the official job description.',
      deadlineText: { zh: '以官方网站开放岗位为准', en: 'Check currently open roles on the official site' },
    };
  }
  if (itemType === 'ai-update') {
    return {
      difficulty: 'all',
      estimatedMinutes: 20,
      region: null,
      remoteStatus: 'remote',
      eligibilityZh: '公开阅读，无特定资格要求。',
      eligibilityEn: 'Publicly readable with no specific eligibility requirement.',
      deadlineText: null,
    };
  }
  return {
    difficulty: 'intermediate',
    estimatedMinutes: 120,
    region: null,
    remoteStatus: 'remote',
    eligibilityZh: '公开开源项目；参与贡献前请阅读仓库贡献指南。',
    eligibilityEn: 'Public open-source project; read the repository contribution guide before contributing.',
    deadlineText: null,
  };
}

export const STATIC_PATHFINDER_ITEMS: PathfinderCatalogItem[] = [
  /*
   * 下面这批仓库是为了摊薄来源集中度补进来的。
   *
   * 实测问题：开源任务 68 条里 apache/airflow 占 22、pytorch/pytorch 占 20，
   * 两个仓库就是六成；而收紧「可上手」判据（排除已认领 / 有关联 PR / 陈旧）之后，
   * backend 方向一度只剩 0 条候选。候选池太小时，任何一条严格的质量判据都会
   * 直接表现为「这个方向没有任务」——所以扩仓库和收紧判据必须一起做。
   *
   * 选取标准是「确实在跑 good first issue 流程」的活跃项目，而不是明星项目：
   * 一个 star 很多但从不标注新手任务的仓库，进来也只会贡献 0 条。
   */
  seed({
    id: 'rust', source: 'github', canonicalUrl: 'https://github.com/rust-lang/rust', itemType: 'open-source',
    titleZh: 'Rust', titleEn: 'Rust', organization: 'Rust Foundation', direction: 'backend',
    summaryZh: 'Rust 语言官方仓库，E-easy 标签下的任务附带完整的实现指引，是系统方向少见的新手友好入口。',
    summaryEn: 'The Rust language repository; issues labelled E-easy come with step-by-step mentoring notes.',
    tags: { topic: ['systems'], skill: ['rust'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'kubernetes', source: 'github', canonicalUrl: 'https://github.com/kubernetes/kubernetes', itemType: 'open-source',
    titleZh: 'Kubernetes', titleEn: 'Kubernetes', organization: 'CNCF', direction: 'backend',
    summaryZh: '容器编排事实标准，有专门的新贡献者引导流程与 good first issue 分诊。',
    summaryEn: 'The container orchestration standard, with a dedicated new-contributor onboarding track.',
    tags: { topic: ['infrastructure'], skill: ['go', 'kubernetes'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'grafana', source: 'github', canonicalUrl: 'https://github.com/grafana/grafana', itemType: 'open-source',
    titleZh: 'Grafana', titleEn: 'Grafana', organization: 'Grafana Labs', direction: 'backend',
    summaryZh: '可观测性面板，前后端都有新手任务，适合想同时练 Go 与 TypeScript 的人。',
    summaryEn: 'Observability dashboards with beginner issues across both its Go backend and TypeScript frontend.',
    tags: { topic: ['observability'], skill: ['go', 'typescript'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'supabase', source: 'github', canonicalUrl: 'https://github.com/supabase/supabase', itemType: 'open-source',
    titleZh: 'Supabase', titleEn: 'Supabase', organization: 'Supabase', direction: 'backend',
    summaryZh: '开源 Firebase 替代品，文档与示例类任务多，适合第一次提 PR。',
    summaryEn: 'The open-source Firebase alternative; documentation and example issues suit a first pull request.',
    tags: { topic: ['backend-as-a-service'], skill: ['typescript', 'postgres'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'prisma', source: 'github', canonicalUrl: 'https://github.com/prisma/prisma', itemType: 'open-source',
    titleZh: 'Prisma', titleEn: 'Prisma', organization: 'Prisma', direction: 'backend',
    summaryZh: 'TypeScript ORM，issue 里对复现步骤要求明确，适合练习定位问题。',
    summaryEn: 'A TypeScript ORM whose issues demand clear reproductions — good practice at diagnosing bugs.',
    tags: { topic: ['database'], skill: ['typescript'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'astro', source: 'github', canonicalUrl: 'https://github.com/withastro/astro', itemType: 'open-source',
    titleZh: 'Astro', titleEn: 'Astro', organization: 'Astro', direction: 'frontend',
    summaryZh: '内容站点框架，社区对新贡献者的响应速度在前端项目里属于快的。',
    summaryEn: 'A content-focused web framework whose maintainers respond unusually quickly to new contributors.',
    tags: { topic: ['web-framework'], skill: ['typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'mui', source: 'github', canonicalUrl: 'https://github.com/mui/material-ui', itemType: 'open-source',
    titleZh: 'MUI', titleEn: 'MUI', organization: 'MUI', direction: 'frontend',
    summaryZh: 'React 组件库，长期维护一批标注清楚的 good first issue。',
    summaryEn: 'A React component library that keeps a steady queue of well-scoped good first issues.',
    tags: { topic: ['ui-components'], skill: ['react', 'typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'storybook', source: 'github', canonicalUrl: 'https://github.com/storybookjs/storybook', itemType: 'open-source',
    titleZh: 'Storybook', titleEn: 'Storybook', organization: 'Storybook', direction: 'frontend',
    summaryZh: '组件开发与文档工具，任务颗粒度小，适合把「跑通本地开发环境」这一关先过掉。',
    summaryEn: 'Component workshop tooling with small-grained tasks — a gentle way to get a dev environment running.',
    tags: { topic: ['developer-tools'], skill: ['typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'excalidraw', source: 'github', canonicalUrl: 'https://github.com/excalidraw/excalidraw', itemType: 'open-source',
    titleZh: 'Excalidraw', titleEn: 'Excalidraw', organization: 'Excalidraw', direction: 'frontend',
    summaryZh: '手绘风白板，改动效果肉眼可见，适合第一次体会「我的代码上线了」。',
    summaryEn: 'A hand-drawn style whiteboard where every change is visible — a satisfying first contribution.',
    tags: { topic: ['canvas'], skill: ['react', 'typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'polars', source: 'github', canonicalUrl: 'https://github.com/pola-rs/polars', itemType: 'open-source',
    titleZh: 'Polars', titleEn: 'Polars', organization: 'Polars', direction: 'data',
    summaryZh: 'Rust 实现的高性能 DataFrame，Python 侧的任务不要求先懂 Rust。',
    summaryEn: 'A high-performance DataFrame library in Rust; many Python-side tasks need no Rust at all.',
    tags: { topic: ['dataframe'], skill: ['python', 'rust'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'duckdb', source: 'github', canonicalUrl: 'https://github.com/duckdb/duckdb', itemType: 'open-source',
    titleZh: 'DuckDB', titleEn: 'DuckDB', organization: 'DuckDB', direction: 'data',
    summaryZh: '进程内分析型数据库，适合想读懂查询执行过程的人。',
    summaryEn: 'An in-process analytical database — a readable codebase for learning query execution.',
    tags: { topic: ['database'], skill: ['cpp', 'sql'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'great-expectations', source: 'github', canonicalUrl: 'https://github.com/great-expectations/great_expectations', itemType: 'open-source',
    titleZh: 'Great Expectations', titleEn: 'Great Expectations', organization: 'Great Expectations', direction: 'data',
    summaryZh: '数据质量校验框架，新增校验规则是颗粒度合适的入门任务。',
    summaryEn: 'A data-quality framework where adding a new expectation is a well-sized starter task.',
    tags: { topic: ['data-quality'], skill: ['python'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'llama-index', source: 'github', canonicalUrl: 'https://github.com/run-llama/llama_index', itemType: 'open-source',
    titleZh: 'LlamaIndex', titleEn: 'LlamaIndex', organization: 'LlamaIndex', direction: 'ai',
    summaryZh: 'RAG 框架，接入新数据源是标准化程度高的入门任务。',
    summaryEn: 'A RAG framework where adding a new data connector is a well-templated starter task.',
    tags: { topic: ['rag'], skill: ['python'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'vllm', source: 'github', canonicalUrl: 'https://github.com/vllm-project/vllm', itemType: 'open-source',
    titleZh: 'vLLM', titleEn: 'vLLM', organization: 'vLLM', direction: 'ai',
    summaryZh: '大模型推理引擎，适合想弄清 KV cache 与批处理调度的人。',
    summaryEn: 'An LLM inference engine — the place to understand KV caching and continuous batching.',
    tags: { topic: ['inference'], skill: ['python', 'cuda'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'gradio', source: 'github', canonicalUrl: 'https://github.com/gradio-app/gradio', itemType: 'open-source',
    titleZh: 'Gradio', titleEn: 'Gradio', organization: 'Hugging Face', direction: 'ai',
    summaryZh: '机器学习演示界面库，前端与 Python 两侧都有新手任务。',
    summaryEn: 'The ML demo UI library, with beginner issues on both its Python and frontend sides.',
    tags: { topic: ['ml-tooling'], skill: ['python', 'typescript'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'datasets', source: 'github', canonicalUrl: 'https://github.com/huggingface/datasets', itemType: 'open-source',
    titleZh: 'Hugging Face Datasets', titleEn: 'Hugging Face Datasets', organization: 'Hugging Face', direction: 'ai',
    summaryZh: '数据集加载与处理库，任务边界清晰，是 Hugging Face 生态里最好入门的仓库之一。',
    summaryEn: 'Dataset loading and processing; tasks have crisp boundaries, making it one of the easiest HF repos to enter.',
    tags: { topic: ['dataset'], skill: ['python'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'nextjs', source: 'github', canonicalUrl: 'https://github.com/vercel/next.js', itemType: 'open-source',
    titleZh: 'Next.js', titleEn: 'Next.js', organization: 'Vercel', direction: 'frontend',
    summaryZh: 'React 全栈框架官方仓库，适合从文档、测试和 Good First Issue 开始参与。',
    summaryEn: 'Official repository for the React full-stack framework, with documentation, tests, and contribution issues.',
    tags: { topic: ['web-framework'], skill: ['react', 'typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'react', source: 'github', canonicalUrl: 'https://github.com/react/react', itemType: 'open-source',
    titleZh: 'React', titleEn: 'React', organization: 'Meta', direction: 'frontend',
    summaryZh: 'React 官方仓库，可通过文档、测试用例和问题讨论理解现代 UI 运行机制。',
    summaryEn: 'Official React repository for learning modern UI internals through docs, tests, and issue discussions.',
    tags: { topic: ['ui-library'], skill: ['javascript', 'react'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'vue', source: 'github', canonicalUrl: 'https://github.com/vuejs/core', itemType: 'open-source',
    titleZh: 'Vue Core', titleEn: 'Vue Core', organization: 'Vue.js', direction: 'frontend',
    summaryZh: 'Vue 核心实现仓库，适合学习响应式系统、编译器和 TypeScript 工程实践。',
    summaryEn: 'Vue core implementation for studying reactivity, compilers, and TypeScript engineering.',
    tags: { topic: ['ui-library'], skill: ['vue', 'typescript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'svelte', source: 'github', canonicalUrl: 'https://github.com/sveltejs/svelte', itemType: 'open-source',
    titleZh: 'Svelte', titleEn: 'Svelte', organization: 'Svelte', direction: 'frontend',
    summaryZh: 'Svelte 编译型 UI 框架官方仓库，包含编译器、运行时与大量测试。',
    summaryEn: 'Official repository for Svelte, including its compiler, runtime, and extensive test suite.',
    tags: { topic: ['ui-framework'], skill: ['svelte', 'javascript'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'tailwindcss', source: 'github', canonicalUrl: 'https://github.com/tailwindlabs/tailwindcss', itemType: 'open-source',
    titleZh: 'Tailwind CSS', titleEn: 'Tailwind CSS', organization: 'Tailwind Labs', direction: 'frontend', difficulty: 'beginner',
    summaryZh: '实用优先 CSS 框架官方仓库，适合从文档、复现和小型修复入门。',
    summaryEn: 'Official utility-first CSS framework repository, approachable through docs, reproductions, and small fixes.',
    tags: { topic: ['css'], skill: ['css', 'tooling'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'typescript', source: 'github', canonicalUrl: 'https://github.com/microsoft/TypeScript', itemType: 'open-source',
    titleZh: 'TypeScript', titleEn: 'TypeScript', organization: 'Microsoft', direction: 'frontend', difficulty: 'advanced',
    summaryZh: 'TypeScript 语言与编译器官方仓库，适合深入类型系统和编译器工程。',
    summaryEn: 'Official TypeScript language and compiler repository for studying type systems and compiler engineering.',
    tags: { topic: ['programming-language'], skill: ['typescript', 'compiler'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'vite', source: 'github', canonicalUrl: 'https://github.com/vitejs/vite', itemType: 'open-source',
    titleZh: 'Vite', titleEn: 'Vite', organization: 'Vite', direction: 'frontend',
    summaryZh: '现代前端构建工具官方仓库，适合学习模块解析、开发服务器和插件机制。',
    summaryEn: 'Official modern frontend tooling repository for learning module resolution, dev servers, and plugins.',
    tags: { topic: ['build-tool'], skill: ['javascript', 'tooling'], career: ['frontend'], format: ['repository'] },
  }),
  seed({
    id: 'nodejs', source: 'github', canonicalUrl: 'https://github.com/nodejs/node', itemType: 'open-source',
    titleZh: 'Node.js', titleEn: 'Node.js', organization: 'OpenJS Foundation', direction: 'backend', difficulty: 'advanced',
    summaryZh: 'Node.js 运行时官方仓库，适合学习异步 I/O、标准库和跨平台工程。',
    summaryEn: 'Official Node.js runtime repository for asynchronous I/O, standard-library, and cross-platform engineering.',
    tags: { topic: ['runtime'], skill: ['javascript', 'systems'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'deno', source: 'github', canonicalUrl: 'https://github.com/denoland/deno', itemType: 'open-source',
    titleZh: 'Deno', titleEn: 'Deno', organization: 'Deno', direction: 'backend', difficulty: 'advanced',
    summaryZh: 'JavaScript、TypeScript 与 WebAssembly 运行时官方仓库。',
    summaryEn: 'Official runtime repository for JavaScript, TypeScript, and WebAssembly.',
    tags: { topic: ['runtime'], skill: ['rust', 'typescript'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'fastify', source: 'github', canonicalUrl: 'https://github.com/fastify/fastify', itemType: 'open-source',
    titleZh: 'Fastify', titleEn: 'Fastify', organization: 'OpenJS Foundation', direction: 'backend',
    summaryZh: '高性能 Node.js Web 框架，贡献指南与插件生态适合渐进式参与。',
    summaryEn: 'High-performance Node.js web framework with contribution guides and an approachable plugin ecosystem.',
    tags: { topic: ['web-framework'], skill: ['nodejs', 'api'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'nestjs', source: 'github', canonicalUrl: 'https://github.com/nestjs/nest', itemType: 'open-source',
    titleZh: 'NestJS', titleEn: 'NestJS', organization: 'NestJS', direction: 'backend',
    summaryZh: 'TypeScript 服务端框架官方仓库，适合学习模块化后端架构。',
    summaryEn: 'Official TypeScript server framework repository for learning modular backend architecture.',
    tags: { topic: ['web-framework'], skill: ['typescript', 'api'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'django', source: 'github', canonicalUrl: 'https://github.com/django/django', itemType: 'open-source',
    titleZh: 'Django', titleEn: 'Django', organization: 'Django Software Foundation', direction: 'backend',
    summaryZh: '成熟的 Python Web 框架，拥有清晰的贡献流程与长期维护实践。',
    summaryEn: 'Mature Python web framework with a clear contribution workflow and long-term maintenance practices.',
    tags: { topic: ['web-framework'], skill: ['python', 'database'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'flask', source: 'github', canonicalUrl: 'https://github.com/pallets/flask', itemType: 'open-source',
    titleZh: 'Flask', titleEn: 'Flask', organization: 'Pallets', direction: 'backend', difficulty: 'beginner',
    summaryZh: '轻量 Python Web 框架，代码规模相对友好，适合首次阅读真实开源项目。',
    summaryEn: 'Lightweight Python web framework with an approachable codebase for a first real open-source contribution.',
    tags: { topic: ['web-framework'], skill: ['python', 'api'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'fastapi', source: 'github', canonicalUrl: 'https://github.com/fastapi/fastapi', itemType: 'open-source',
    titleZh: 'FastAPI', titleEn: 'FastAPI', organization: 'FastAPI', direction: 'backend',
    summaryZh: '现代 Python API 框架，适合学习类型提示、异步接口与自动文档。',
    summaryEn: 'Modern Python API framework for learning type hints, async APIs, and automatic documentation.',
    tags: { topic: ['api-framework'], skill: ['python', 'api'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'spring-boot', source: 'github', canonicalUrl: 'https://github.com/spring-projects/spring-boot', itemType: 'open-source',
    titleZh: 'Spring Boot', titleEn: 'Spring Boot', organization: 'Broadcom', direction: 'backend', difficulty: 'advanced',
    summaryZh: 'Java 企业应用框架官方仓库，适合学习大型工程的测试、构建与兼容性维护。',
    summaryEn: 'Official Java enterprise framework repository for large-scale testing, builds, and compatibility work.',
    tags: { topic: ['enterprise-framework'], skill: ['java', 'spring'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'cpython', source: 'github', canonicalUrl: 'https://github.com/python/cpython', itemType: 'open-source',
    titleZh: 'CPython', titleEn: 'CPython', organization: 'Python Software Foundation', direction: 'backend', difficulty: 'advanced',
    summaryZh: 'Python 参考实现官方仓库，适合深入解释器、标准库和语言演进。',
    summaryEn: 'Official Python reference implementation for interpreters, the standard library, and language evolution.',
    tags: { topic: ['programming-language'], skill: ['python', 'c'], career: ['backend'], format: ['repository'] },
  }),
  seed({
    id: 'numpy', source: 'github', canonicalUrl: 'https://github.com/numpy/numpy', itemType: 'open-source',
    titleZh: 'NumPy', titleEn: 'NumPy', organization: 'NumPy', direction: 'data',
    summaryZh: 'Python 科学计算基础库，适合学习数组计算、性能与跨语言扩展。',
    summaryEn: 'Foundational Python scientific-computing library for arrays, performance, and native extensions.',
    tags: { topic: ['scientific-computing'], skill: ['python', 'numerical-computing'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'pandas', source: 'github', canonicalUrl: 'https://github.com/pandas-dev/pandas', itemType: 'open-source',
    titleZh: 'pandas', titleEn: 'pandas', organization: 'pandas', direction: 'data',
    summaryZh: 'Python 数据分析库官方仓库，可从文档、测试与边界案例贡献入门。',
    summaryEn: 'Official Python data-analysis library; documentation, tests, and edge cases provide approachable contributions.',
    tags: { topic: ['data-analysis'], skill: ['python', 'dataframe'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'scikit-learn', source: 'github', canonicalUrl: 'https://github.com/scikit-learn/scikit-learn', itemType: 'open-source',
    titleZh: 'scikit-learn', titleEn: 'scikit-learn', organization: 'scikit-learn', direction: 'data',
    summaryZh: '经典机器学习库，适合通过示例、文档与测试理解算法工程化。',
    summaryEn: 'Classic machine-learning library for understanding production algorithms through examples, docs, and tests.',
    tags: { topic: ['machine-learning'], skill: ['python', 'statistics'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'pytorch', source: 'github', canonicalUrl: 'https://github.com/pytorch/pytorch', itemType: 'open-source',
    titleZh: 'PyTorch', titleEn: 'PyTorch', organization: 'Linux Foundation', direction: 'ai', difficulty: 'advanced',
    summaryZh: '深度学习框架官方仓库，适合深入张量计算、自动微分与分布式训练。',
    summaryEn: 'Official deep-learning framework repository for tensors, autograd, and distributed training.',
    tags: { topic: ['deep-learning'], skill: ['python', 'pytorch'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'transformers', source: 'github', canonicalUrl: 'https://github.com/huggingface/transformers', itemType: 'open-source',
    titleZh: 'Transformers', titleEn: 'Transformers', organization: 'Hugging Face', direction: 'ai',
    summaryZh: '预训练模型工具库，覆盖文本、视觉、音频与多模态任务。',
    summaryEn: 'Pretrained-model toolkit spanning text, vision, audio, and multimodal tasks.',
    tags: { topic: ['foundation-models'], skill: ['python', 'transformers'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'langchain', source: 'github', canonicalUrl: 'https://github.com/langchain-ai/langchain', itemType: 'open-source',
    titleZh: 'LangChain', titleEn: 'LangChain', organization: 'LangChain', direction: 'ai',
    summaryZh: '大模型应用开发框架，可用于学习工具调用、检索与智能体工程。',
    summaryEn: 'Framework for LLM applications, including tool use, retrieval, and agent engineering.',
    tags: { topic: ['llm-apps'], skill: ['python', 'agents'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'openai-python', source: 'github', canonicalUrl: 'https://github.com/openai/openai-python', itemType: 'open-source',
    titleZh: 'OpenAI Python SDK', titleEn: 'OpenAI Python SDK', organization: 'OpenAI', direction: 'ai',
    summaryZh: 'OpenAI API 官方 Python SDK，适合学习类型化客户端、流式响应与 API 兼容维护。',
    summaryEn: 'Official OpenAI Python SDK for typed clients, streaming responses, and API compatibility.',
    tags: { topic: ['ai-api'], skill: ['python', 'api'], career: ['ai'], format: ['repository'] },
  }),
  seed({
    id: 'spark', source: 'github', canonicalUrl: 'https://github.com/apache/spark', itemType: 'open-source',
    titleZh: 'Apache Spark', titleEn: 'Apache Spark', organization: 'Apache Software Foundation', direction: 'data', difficulty: 'advanced',
    summaryZh: '大规模数据处理引擎，适合学习分布式计算、SQL 引擎与性能优化。',
    summaryEn: 'Large-scale data engine for distributed computing, SQL execution, and performance optimization.',
    tags: { topic: ['big-data'], skill: ['distributed-systems', 'sql'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'airflow', source: 'github', canonicalUrl: 'https://github.com/apache/airflow', itemType: 'open-source',
    titleZh: 'Apache Airflow', titleEn: 'Apache Airflow', organization: 'Apache Software Foundation', direction: 'data', difficulty: 'advanced',
    summaryZh: '工作流编排平台，适合学习数据管道、调度与可观测性。',
    summaryEn: 'Workflow orchestration platform for data pipelines, scheduling, and observability.',
    tags: { topic: ['data-engineering'], skill: ['python', 'orchestration'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'dbt-core', source: 'github', canonicalUrl: 'https://github.com/dbt-labs/dbt-core', itemType: 'open-source',
    titleZh: 'dbt Core', titleEn: 'dbt Core', organization: 'dbt Labs', direction: 'data',
    summaryZh: '分析工程转换工具，适合学习 SQL 建模、数据测试与工程协作。',
    summaryEn: 'Analytics-engineering transformation tool for SQL modeling, data tests, and collaborative workflows.',
    tags: { topic: ['analytics-engineering'], skill: ['sql', 'data-modeling'], career: ['data'], format: ['repository'] },
  }),
  seed({
    id: 'computer-design-competition', source: 'computerDesign', canonicalUrl: 'https://jsjds.blcu.edu.cn/', itemType: 'competition',
    titleZh: '中国大学生计算机设计大赛', titleEn: 'Chinese Collegiate Computing Competition',
    organization: '中国大学生计算机设计大赛组委会', organizationEn: 'Chinese Collegiate Computing Competition Organizing Committee', direction: 'frontend',
    summaryZh: '覆盖软件应用、信息可视化、人工智能等方向的全国性大学生计算机作品赛事入口。',
    summaryEn: 'Official entry for a national student competition spanning software, visualization, AI, and digital media.',
    eligibilityZh: '赛事包含前端、后端、AI、数据与数字媒体等方向；参赛资格和具体赛项以当届官网规则为准。',
    eligibilityEn: 'The competition spans frontend, backend, AI, data, and digital media; verify current tracks and eligibility on the official site.',
    tags: { topic: ['software-design', 'frontend', 'backend', 'ai', 'data'], skill: ['project-delivery'], career: ['student'], format: ['competition'] },
  }),
  seed({
    id: 'innovation-competition', source: 'innovation', canonicalUrl: 'https://cy.ncss.cn/', itemType: 'competition',
    titleZh: '中国国际大学生创新大赛', titleEn: 'China International College Students Innovation Competition',
    organization: '教育部', organizationEn: 'Ministry of Education of China', direction: 'backend', difficulty: 'all',
    summaryZh: '教育部主办的跨学科大学生创新实践赛事官方报名与资料入口，项目可涉及多种技术方向。',
    summaryEn: 'Official portal for the Ministry of Education interdisciplinary student innovation competition, whose projects may span multiple technical fields.',
    eligibilityZh: '跨学科综合赛事；参赛组别、学生资格与项目要求以当届官方网站为准。',
    eligibilityEn: 'This is an interdisciplinary competition; confirm the current division, student eligibility, and project requirements on the official site.',
    tags: { topic: ['innovation', 'frontend', 'backend', 'ai', 'data'], skill: ['product', 'presentation'], career: ['entrepreneurship'], format: ['competition'] },
  }),
  seed({
    id: 'lanqiao-cup', source: 'lanqiao', canonicalUrl: 'https://dasai.lanqiao.cn/', itemType: 'competition',
    titleZh: '蓝桥杯全国大学生软件和信息技术大赛', titleEn: 'Lanqiao Cup Software and Information Technology Competition',
    organization: '蓝桥杯大赛组委会', organizationEn: 'Lanqiao Cup Organizing Committee', direction: 'backend', device: 'either',
    summaryZh: '包含程序设计、Web、软件测试、网络安全与人工智能等跨方向赛项的官方入口。',
    summaryEn: 'Official portal for cross-disciplinary tracks including programming, web development, testing, cybersecurity, and AI.',
    eligibilityZh: '不同赛项覆盖前端、后端、AI 等方向；组别、报名资格与费用以当届官网规则为准。',
    eligibilityEn: 'Tracks span frontend, backend, and AI; verify divisions, eligibility, and fees in the current official rules.',
    tags: { topic: ['programming-contest', 'frontend', 'backend', 'ai'], skill: ['algorithms', 'coding'], career: ['student'], format: ['competition'] },
  }),
  seed({
    id: 'kaggle-competitions', source: 'kaggle', canonicalUrl: 'https://www.kaggle.com/competitions', itemType: 'competition',
    titleZh: 'Kaggle 数据科学竞赛', titleEn: 'Kaggle Competitions', organization: 'Kaggle', direction: 'data',
    summaryZh: '由不同机构发布的数据科学与机器学习竞赛目录，可按开放状态查看。',
    summaryEn: 'Official directory of open data-science and machine-learning competitions from multiple hosts.',
    device: 'either', region: null, remoteStatus: 'remote', eligibilityZh: '各赛事规则不同，请在官方赛事页核对资格与数据许可。',
    eligibilityEn: 'Rules vary by competition; verify eligibility and data licensing on the official competition page.',
    tags: { topic: ['data-science'], skill: ['machine-learning', 'analysis'], career: ['data'], format: ['competition'] },
  }),
  seed({
    id: 'tianchi-competitions', source: 'tianchi', canonicalUrl: 'https://tianchi.aliyun.com/competition/', itemType: 'competition',
    titleZh: '天池竞赛', titleEn: 'Tianchi Competitions', organization: '阿里云', organizationEn: 'Alibaba Cloud', direction: 'data',
    summaryZh: '阿里云天池的数据科学、算法与工程竞赛官方目录。',
    summaryEn: 'Official Alibaba Cloud Tianchi directory for data-science, algorithm, and engineering competitions.',
    device: 'either', remoteStatus: 'remote', tags: { topic: ['data-science'], skill: ['algorithms', 'machine-learning'], career: ['data'], format: ['competition'] },
  }),
  seed({
    id: 'systems-competition', source: 'systemsCompetition', canonicalUrl: 'https://pra.xtnl.org.cn/', itemType: 'competition',
    titleZh: '全国大学生计算机系统能力大赛', titleEn: 'National Student Computer Systems Capability Competition',
    organization: '全国高等学校计算机教育研究会', organizationEn: 'National Association of Computer Education in Colleges and Universities', direction: 'backend', difficulty: 'advanced', device: 'either',
    summaryZh: '面向操作系统、编译系统、数据库等计算机系统方向的大学生赛事入口。',
    summaryEn: 'Official student competition portal for operating systems, compilers, databases, and computer systems.',
    tags: { topic: ['computer-systems'], skill: ['systems', 'engineering'], career: ['student'], format: ['competition'] },
  }),
  seed({
    id: 'ncss-internships', source: 'ncssJobs', canonicalUrl: 'https://gcu.ncss.cn/', itemType: 'internship',
    titleZh: '国家大学生就业服务平台实习岗位', titleEn: 'National College Student Employment Service Internships',
    organization: '教育部学生服务与素质发展中心', organizationEn: 'Center for Student Services and Development, Ministry of Education', direction: 'backend', difficulty: 'all', device: 'either',
    summaryZh: '教育部直属平台提供的综合实习与校园招聘入口，岗位覆盖前端、后端、AI、数据等方向。',
    summaryEn: 'Official Ministry-affiliated portal for internships and graduate roles across frontend, backend, AI, data, and other fields.',
    eligibilityZh: '平台聚合多个技术方向与用人单位；岗位、年级与地域要求以每条官方职位描述为准。',
    eligibilityEn: 'The portal aggregates employers and technical fields; check each official role for graduation-year and location requirements.',
    tags: { topic: ['internships'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'bytedance-campus', source: 'bytedance', canonicalUrl: 'https://jobs.bytedance.com/campus', itemType: 'internship',
    titleZh: '字节跳动校园招聘', titleEn: 'ByteDance Campus Recruitment', organization: 'ByteDance', direction: 'backend', device: 'either',
    summaryZh: '字节跳动实习与校园招聘的综合职位入口，实际开放岗位可能覆盖多个技术方向。',
    summaryEn: 'Official ByteDance portal for internship and campus roles that may span multiple technical fields.',
    eligibilityZh: '岗位方向并不限于后端；年级、地域与技能要求以当前官方职位描述为准。',
    eligibilityEn: 'Roles are not limited to backend; verify graduation-year, location, and skill requirements in the current official listing.',
    tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'tencent-campus', source: 'tencent', canonicalUrl: 'https://join.qq.com/', itemType: 'internship',
    titleZh: '腾讯校园招聘', titleEn: 'Tencent Campus Recruitment', organization: '腾讯', organizationEn: 'Tencent', direction: 'frontend', device: 'either',
    summaryZh: '腾讯实习、校园招聘与招聘活动的综合入口，实际开放岗位覆盖多个技术方向。',
    summaryEn: 'Official Tencent portal for internships, campus roles, and recruiting events across multiple technical fields.',
    eligibilityZh: '岗位方向并不限于前端；年级、地域与技能要求以当前官方职位描述为准。',
    eligibilityEn: 'Roles are not limited to frontend; verify graduation-year, location, and skill requirements in the current official listing.',
    tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'alibaba-recruitment', source: 'alibaba', canonicalUrl: 'https://talent.alibaba.com/', itemType: 'internship',
    titleZh: '阿里巴巴集团招聘入口', titleEn: 'Alibaba Group Careers', organization: '阿里巴巴', organizationEn: 'Alibaba Group', direction: 'data', device: 'either',
    summaryZh: '阿里巴巴集团官方综合招聘入口；是否开放学生或早期职业岗位以当前职位列表为准。',
    summaryEn: 'Official Alibaba Group careers portal; availability of student or early-career roles depends on current listings.',
    eligibilityZh: '该入口不是专属数据岗位或固定校园批次；岗位类别、年级与地域要求以当前官方职位描述为准。',
    eligibilityEn: 'This is not a data-only or fixed campus intake; verify role type, graduation-year, and location requirements in current listings.',
    tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['recruitment', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'huawei-campus', source: 'huawei', canonicalUrl: 'https://career.huawei.com/reccampportal/portal5/campus-recruitment.html', itemType: 'internship',
    titleZh: '华为校园招聘', titleEn: 'Huawei Campus Recruitment', organization: '华为', organizationEn: 'Huawei', direction: 'backend', device: 'either',
    summaryZh: '华为实习生与应届生岗位、招聘流程和活动的综合入口，岗位覆盖多个技术方向。',
    summaryEn: 'Official Huawei portal for internships, graduate roles, processes, and events across multiple technical fields.',
    eligibilityZh: '岗位方向并不限于后端；年级、地域与技能要求以当前官方职位描述为准。',
    eligibilityEn: 'Roles are not limited to backend; verify graduation-year, location, and skill requirements in the current official listing.',
    tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'microsoft-students', source: 'microsoftCareers', canonicalUrl: 'https://careers.microsoft.com/v2/global/en/students', itemType: 'internship',
    titleZh: 'Microsoft 学生与毕业生招聘', titleEn: 'Microsoft Students and Graduates', organization: 'Microsoft', direction: 'ai', device: 'either',
    summaryZh: 'Microsoft 面向学生与毕业生的实习、项目和综合岗位入口，岗位不限于 AI。',
    summaryEn: 'Official Microsoft portal for student internships, programs, and graduate roles beyond AI alone.',
    eligibilityZh: '岗位覆盖多个技术方向；年级、地域与技能要求以当前官方职位描述为准。',
    eligibilityEn: 'Roles span multiple technical fields; verify graduation-year, location, and skill requirements in current listings.',
    region: null, tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'google-students', source: 'googleCareers', canonicalUrl: 'https://www.google.com/about/careers/applications/students/', itemType: 'internship',
    titleZh: 'Google 学生招聘', titleEn: 'Google Student Careers', organization: 'Google', direction: 'ai', device: 'either',
    summaryZh: 'Google 面向学生的实习、早期职业岗位与项目入口，岗位不限于 AI。',
    summaryEn: 'Official Google portal for student internships, early-career roles, and programs beyond AI alone.',
    eligibilityZh: '岗位覆盖多个技术方向；年级、地域与技能要求以当前官方职位描述为准。',
    eligibilityEn: 'Roles span multiple technical fields; verify graduation-year, location, and skill requirements in current listings.',
    region: null, tags: { topic: ['technology-jobs'], skill: ['job-search'], career: ['internship', 'frontend', 'backend', 'ai', 'data'], format: ['job-board'] },
  }),
  seed({
    id: 'aic-open-source-2026', source: 'aicOpenSource', canonicalUrl: 'https://www.aicomp.cn/tracks/tracks-5/4924.html', itemType: 'competition',
    titleZh: '2026 AIC「AI+开源」算法主题赛', titleEn: '2026 AIC AI + Open Source Challenge',
    organization: '全球校园人工智能算法精英大赛全国组委会', organizationEn: 'Global Campus AI Algorithm Elite Competition Organizing Committee', direction: 'ai', difficulty: 'intermediate',
    summaryZh: '面向全球在校大学生，使用开源软件、模型或数据开发可运行的 AI 应用、开发工具，或形成可核验的开源贡献。',
    summaryEn: 'A global student challenge for runnable AI applications, developer tools, or verifiable contributions built with open-source software, models, and data.',
    estimatedMinutes: 360, costCny: 500, device: 'computer', network: 'high', region: '全球', regionEn: 'Global', remoteStatus: 'hybrid',
    eligibilityZh: '全球高校及科研院所在读研究生、本科生、专科生；个人或同校 1–3 人组队，最多 2 名指导教师。',
    eligibilityEn: 'Open to enrolled postgraduate, undergraduate, and vocational-college students worldwide; solo or same-institution teams of up to three, with up to two advisers.',
    deadlineText: '2026-10-15 20:00（官方未披露时区）', deadlineTextEn: '2026-10-15 20:00 (time zone not stated)', deadlineDate: '2026-10-15',
    learningEligible: true,
    tags: { topic: ['open-source', 'ai-apps', 'frontend', 'backend'], skill: ['project-delivery', 'coding', 'demo'], career: ['student'], format: ['competition'] },
  }),
  seed({
    id: 'ibm-z-datathon-2026', source: 'ibmZDatathon', canonicalUrl: 'https://community.ibm.com/community/user/events/event-description?CalendarEventKey=0b55f6e4-93a9-4ee4-94ff-019fa8667b04&CommunityKey=9a8b7fc3-b167-447a-8e14-adf93406eccc&Home=%2Fcommunity%2Fuser%2Fgroups%2Fcommunity-home%2Fmanage-events', itemType: 'competition',
    titleZh: 'IBM Z Datathon 2026', titleEn: 'IBM Z Datathon 2026', organization: 'IBM Z', direction: 'data', difficulty: 'intermediate',
    summaryZh: '面向全球 18 岁以上学生的免费 24 小时 AI 与数据挑战，围绕实时 AI、隐私保护 AI、开放创新和公益场景开发原型。',
    summaryEn: 'A free global 24-hour student datathon using IBM Z and LinuxONE for real-time AI, privacy-preserving AI, open innovation, and AI-for-good prototypes.',
    directions: ['ai', 'backend'], estimatedMinutes: 480, costCny: 0, device: 'computer', network: 'high', region: '全球', regionEn: 'Global', remoteStatus: 'hybrid',
    eligibilityZh: '面向全球 18 岁以上学生；具体团队与活动点规则以 IBM 官方报名页为准。',
    eligibilityEn: 'Open to students worldwide aged 18 or older; confirm team and local event rules on the IBM registration page.',
    deadlineText: '2026-10-01（官方未披露具体时刻与时区）', deadlineTextEn: '2026-10-01 (time and zone not stated)', deadlineDate: '2026-10-01',
    learningEligible: true,
    tags: { topic: ['ai-for-good', 'data', 'mainframe'], skill: ['prototyping', 'teamwork', 'ibm-z'], career: ['student'], format: ['competition'] },
  }),
  seed({
    id: 'unu-ai-sdgs-2026', source: 'unuMacau', canonicalUrl: 'https://unu.edu/macau/news/ai-sdgs-global-youth-ai-future-innovation-competition-2026-call-applications', itemType: 'competition',
    titleZh: 'AI for SDGs 全球青年 AI 未来创新大赛 2026', titleEn: 'AI for SDGs Global Youth AI Future Innovation Competition 2026',
    organization: 'United Nations University Macau', direction: 'ai', difficulty: 'advanced',
    summaryZh: '面向全球征集 AI 与教育、社会创新及欠发达地区服务方案，要求项目至少达到 TRL 6，适合已有成熟原型的团队。',
    summaryEn: 'A worldwide AI-for-education and social-innovation competition for mature solutions at TRL 6 or above, with online early rounds and an in-person Macau final.',
    estimatedMinutes: 360, costCny: 0, device: 'computer', network: 'high', region: '全球', regionEn: 'Global', remoteStatus: 'hybrid',
    eligibilityZh: '全球公司、团队或个人均可申请，不限国籍；项目需达到 TRL 6 或更高，官方语言为英语。',
    eligibilityEn: 'Open worldwide to companies, teams, and individuals of any nationality; projects must be at TRL 6 or above and applications are in English.',
    deadlineText: '2026-09-15（官方未披露具体时刻与时区）', deadlineTextEn: '2026-09-15 (time and zone not stated)', deadlineDate: '2026-09-15',
    learningEligible: false, requiresManualEligibilityCheck: true,
    tags: { topic: ['ai-for-sdgs', 'education', 'social-impact'], skill: ['prototype-validation', 'pitching', 'english'], career: ['innovation'], format: ['competition'] },
  }),
  seed({
    id: 'mitacs-gri-2027', source: 'mitacs', canonicalUrl: 'https://www.mitacs.ca/our-programs/globalink-research-internship-students/', itemType: 'internship',
    titleZh: 'Mitacs Globalink 2027 科研实习', titleEn: 'Mitacs Globalink Research Internship 2027', organization: 'Mitacs', direction: 'data', difficulty: 'advanced',
    summaryZh: '加拿大 12 周资助科研实习，向合资格名单内中国高校本科生开放，可在项目库筛选 AI、数据与计算研究课题。',
    summaryEn: 'A funded 12-week Canadian research internship for eligible international undergraduates, including students from listed Chinese universities, with projects across AI, data, and computing.',
    estimatedMinutes: 300, costCny: null, device: 'computer', network: 'normal', region: '加拿大', regionEn: 'Canada', remoteStatus: 'onsite',
    eligibilityZh: '18 岁以上、合资格高校全日制本科生或本硕连读学生；中国申请人还需满足高校名单、成绩与预计毕业日期要求。',
    eligibilityEn: 'Applicants must be 18 or older and enrolled full time in an eligible undergraduate or combined program; Chinese applicants must also meet university-list, grade, and graduation-date rules.',
    deadlineText: '2026-09-16 13:00 太平洋时间', deadlineTextEn: '2026-09-16 13:00 Pacific Time', deadlineDate: '2026-09-16', deadlineAt: '2026-09-16T20:00:00.000Z', learningEligible: false, requiresManualEligibilityCheck: true,
    tags: { topic: ['research-internship', 'ai', 'data'], skill: ['research', 'cv', 'project-selection'], career: ['undergraduate', 'junior', 'senior', 'research'], format: ['internship'] },
  }),
  seed({
    id: 'oist-spring-2027', source: 'oist', canonicalUrl: 'https://www.oist.jp/admissions/research-internship/apply-research-internship', itemType: 'internship',
    titleZh: 'OIST 2027 春季科研实习', titleEn: 'OIST Research Internship — Spring 2027', organization: 'Okinawa Institute of Science and Technology', direction: 'ai', difficulty: 'advanced',
    summaryZh: '日本冲绳 4–6 个月线下科研实习，面向全球本科后两年学生、硕士生和近期本硕毕业生，不强制提交 IELTS 或 TOEFL。',
    summaryEn: 'A four-to-six-month on-site research internship in Okinawa for late-stage bachelor’s students, master’s students, and recent graduates worldwide, with no required IELTS or TOEFL score.',
    estimatedMinutes: 300, costCny: null, costAmount: 5000, costCurrency: 'JPY', costLabelZh: '5,000 日元（不可退）', costLabelEn: 'JPY 5,000 (non-refundable)', device: 'computer', network: 'normal', region: '日本冲绳', regionEn: 'Okinawa, Japan', remoteStatus: 'onsite',
    eligibilityZh: '本科最后两年学生、任意年级硕士生及近期本硕毕业生；申请费 5,000 日元且不可退。',
    eligibilityEn: 'Open to students in the final two bachelor’s years, master’s students, and recent bachelor’s or master’s graduates; a non-refundable JPY 5,000 application fee applies.',
    deadlineText: '2026-10-15 23:59 日本标准时间（UTC+9）', deadlineTextEn: '2026-10-15 23:59 JST (UTC+9)', deadlineDate: '2026-10-15', deadlineAt: '2026-10-15T14:59:00.000Z', learningEligible: true,
    tags: { topic: ['research-internship', 'ai', 'computing'], skill: ['research-proposal', 'cv'], career: ['junior', 'senior', 'postgraduate', 'research'], format: ['internship'] },
  }),
  seed({
    id: 'max-planck-cs-internship-2027', source: 'maxPlanck', canonicalUrl: 'https://www.cis.mpg.de/internships/', itemType: 'internship',
    titleZh: 'Max Planck 计算机科学实习 2027', titleEn: 'Max Planck Computer Science Internship 2027', organization: 'Max Planck Computer Science', direction: 'backend', difficulty: 'advanced',
    summaryZh: '面向全球本、硕、博学生的计算机科学研究实习，由参与研究所按背景匹配 AI、数据、系统或软件研究项目。',
    summaryEn: 'A worldwide computer-science research internship for bachelor’s, master’s, and doctoral students, with projects matched across AI, data, systems, and software research.',
    estimatedMinutes: 240, costCny: null, device: 'computer', network: 'normal', region: '德国', regionEn: 'Germany', remoteStatus: 'onsite',
    eligibilityZh: '全球本、硕、博学生；实习开始前应具备约本科前三年计算机科学基础并有科研兴趣。',
    eligibilityEn: 'Open worldwide to bachelor’s, master’s, and doctoral students with roughly three years of computer-science foundation before the internship and a research interest.',
    deadlineText: '2026-11-01（适用于 2027 年 5–8 月开始；官方未披露时区）', deadlineTextEn: '2026-11-01 (for May–August 2027 starts; time zone not stated)', deadlineDate: '2026-11-01', learningEligible: true,
    tags: { topic: ['research-internship', 'systems', 'ai', 'data'], skill: ['research', 'cv'], career: ['junior', 'senior', 'postgraduate', 'research'], format: ['internship'] },
  }),
  seed({
    id: 'openai-research', source: 'openai', canonicalUrl: 'https://openai.com/research/', itemType: 'ai-update',
    titleZh: 'OpenAI 研究动态', titleEn: 'OpenAI Research', organization: 'OpenAI', direction: 'ai',
    summaryZh: 'OpenAI 官方发布的研究成果与技术动态；仅用于方向观察，不直接进入学习任务。',
    summaryEn: 'Official OpenAI research releases and technical updates; for trend awareness, not direct learning tasks.',
    tags: { topic: ['ai-research'], skill: [], career: ['ai'], format: ['publisher'] },
  }),
  seed({
    id: 'deepmind-blog', source: 'deepmind', canonicalUrl: 'https://deepmind.google/blog/', itemType: 'ai-update',
    titleZh: 'Google DeepMind 博客', titleEn: 'Google DeepMind Blog', organization: 'Google DeepMind', direction: 'ai',
    summaryZh: 'Google DeepMind 官方研究与产品动态；用于理解方向变化。',
    summaryEn: 'Official Google DeepMind research and product updates for understanding changes in the field.',
    tags: { topic: ['ai-research'], skill: [], career: ['ai'], format: ['publisher'] },
  }),
  seed({
    id: 'huggingface-blog', source: 'huggingface', canonicalUrl: 'https://huggingface.co/blog', itemType: 'ai-update',
    titleZh: 'Hugging Face 博客', titleEn: 'Hugging Face Blog', organization: 'Hugging Face', direction: 'ai',
    summaryZh: 'Hugging Face 官方发布的开源模型、工具和社区技术动态。',
    summaryEn: 'Official Hugging Face updates on open models, tools, and community technology.',
    tags: { topic: ['open-models'], skill: [], career: ['ai'], format: ['publisher'] },
  }),
  seed({
    id: 'pytorch-blog', source: 'pytorchBlog', canonicalUrl: 'https://pytorch.org/blog/', itemType: 'ai-update',
    titleZh: 'PyTorch 博客', titleEn: 'PyTorch Blog', organization: 'PyTorch Foundation', direction: 'ai',
    summaryZh: 'PyTorch 官方框架版本、生态项目与工程实践动态。',
    summaryEn: 'Official PyTorch framework releases, ecosystem projects, and engineering updates.',
    tags: { topic: ['deep-learning'], skill: [], career: ['ai'], format: ['publisher'] },
  }),
  seed({
    id: 'anthropic-research', source: 'anthropic', canonicalUrl: 'https://www.anthropic.com/research', itemType: 'ai-update',
    titleZh: 'Anthropic 研究动态', titleEn: 'Anthropic Research', organization: 'Anthropic', direction: 'ai',
    summaryZh: 'Anthropic 官方发布的模型、安全与可解释性研究动态。',
    summaryEn: 'Official Anthropic updates on models, safety, and interpretability research.',
    tags: { topic: ['ai-safety'], skill: [], career: ['ai'], format: ['publisher'] },
  }),
];
