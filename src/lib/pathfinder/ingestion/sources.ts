import { STATIC_PATHFINDER_ITEMS } from '@/data/pathfinder/catalog-seeds';
import type { PathfinderDirection } from '../catalog-types';
import type { PathfinderSyncSource } from './types';

/**
 * GitHub 搜索接口的 `q` 上限。超过会直接返回 422，而且是静默的——
 * 整条来源无声地不再产出，后台只看到「抓取 0 条」。
 */
export const GITHUB_QUERY_LIMIT = 256;

/**
 * 每个方向固定切成几条来源。
 *
 * 固定值是关键：分桶按仓库名哈希取模，桶数不变时**新增仓库不会挪动已有仓库**，
 * 来源归属因此稳定。若改成「按当前数量动态算桶数」，每加一个仓库都会重排，
 * 已入库的 issue 会与新来源对不上号（同步会按 URL 判为「已由别的来源收录」
 * 而跳过），核验时间不再刷新，30 天后悄悄变成 stale。
 *
 * 桶数从 2 改成了 4。触发原因有两个叠加：为摊薄来源集中度补进 16 个仓库，
 * 以及查询里新增了 `-linked:pr` 与 `updated:>=YYYY-MM-DD` 两个限定符
 * （共约 33 字符）——backend 方向的查询因此达到 303 字符，超过上限 256。
 *
 * **重排的代价要知道**：仓库到桶的映射变了，同一个 issue 会落到新的来源 id 下。
 * 已入库的旧条目在 `persistItems` 里会按 URL 命中、但 `sourceId` 对不上，
 * 于是走「已由别的来源收录」的分支被跳过，`verifiedAt` 不再刷新，30 天后变成
 * stale。这次可以接受：新加的「可上手」判据本来就会淘汰掉存量开源任务里的
 * 绝大多数（实测 82% 超过一年未活动），让它们自然过期正好。
 * 但**不要把这件事当成无痛操作**，下次调整前先确认存量条目是否还需要保留。
 */
const CURATED_ISSUE_BUCKETS = 4;

/** 稳定的字符串哈希（FNV-1a）。只用于分桶，不涉及安全。导出以便测试钉住「新增仓库不挪动已有仓库」。 */
export function stableBucket(value: string, buckets: number): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash % buckets;
}

/** 从目录种子里取出已策展的 GitHub 仓库，按方向分组。 */
export function curatedRepositoriesByDirection(): Map<PathfinderDirection, string[]> {
  const byDirection = new Map<PathfinderDirection, string[]>();
  for (const item of STATIC_PATHFINDER_ITEMS) {
    if (item.itemType !== 'open-source') continue;
    const repo = item.canonicalUrl.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)$/)?.[1];
    if (!repo) continue;
    const bucket = byDirection.get(item.direction) ?? [];
    if (!bucket.includes(repo)) bucket.push(repo);
    byDirection.set(item.direction, bucket);
  }
  for (const repos of byDirection.values()) repos.sort();
  return byDirection;
}

/**
 * 「没人在做」的查询层判据。
 *
 * - `no:assignee`：已指派给别人的，学生做了也交不上去。
 * - `-linked:pr`：已经有关联 PR 的 issue 说明有人正在做。这是 GitHub 搜索
 *   自带的限定符，比逐条调 timeline 接口便宜——后者每条 issue 一次请求，
 *   68 条就会打满未授权 60 次/小时的配额。
 *
 * 这两条是「稳定」判据，不随时间变化，所以可以同时进 fetchUrl 与 siteUrl；
 * 滚动的时间窗只能进 fetchUrl（见 buildCuratedIssueSources 的说明）。
 */
export function buildCuratedIssueQuery(repos: readonly string[]): string {
  return `is:issue is:open no:assignee -linked:pr archived:false label:"good first issue" ${
    repos.map((repo) => `repo:${repo}`).join(' ')
  }`;
}

/**
 * issue 至少要在这么多天内有过活动才值得推荐。
 *
 * 实测生产库里 68 条开源任务有 56 条（82%）的发布时间超过一年，最老的一条来自
 * 2016 年——一个「Good First Issue」在仓库里躺了十年没人做，通常意味着它其实
 * 不好做、或者维护者已经不管这块了，推给学生只会让人白花一个周末。
 *
 * 取 365 天而不是更短：实测 180 天与 365 天的结果几乎一样（真正砍掉存量的是
 * `-linked:pr`），而更短的窗口只会在候选本来就少的方向上把池子清空。
 */
export const CURATED_ISSUE_ACTIVE_DAYS = 365;

/** 给查询加上滚动时间窗。只用于 fetchUrl——siteUrl 必须保持稳定。 */
export function withRecentActivity(query: string, now = new Date()): string {
  const since = new Date(now.getTime() - CURATED_ISSUE_ACTIVE_DAYS * 86_400_000);
  return `${query} updated:>=${since.toISOString().slice(0, 10)}`;
}

/**
 * 按目录里已策展的仓库生成 Good First Issue 来源。
 *
 * 「加仓库到 catalog-seeds.ts，issue 自动跟上」就是靠这个函数——仓库清单只有
 * 一处数据源，不需要再手写第二份查询。自动发布的前提也由此在结构上成立：
 * 查询里能出现的仓库，必然是目录里已经审过的那些。
 */
export function buildCuratedIssueSources(): PathfinderSyncSource[] {
  const sources: PathfinderSyncSource[] = [];

  for (const [direction, repos] of [...curatedRepositoriesByDirection()].sort()) {
    const buckets: string[][] = Array.from({ length: CURATED_ISSUE_BUCKETS }, () => []);
    for (const repo of repos) buckets[stableBucket(repo, CURATED_ISSUE_BUCKETS)].push(repo);

    buckets.forEach((bucketRepos, index) => {
      if (bucketRepos.length === 0) return;
      const query = buildCuratedIssueQuery(bucketRepos);
      sources.push({
        id: `curated-issues-${direction}-${index + 1}`,
        /*
         * 展示名不带分桶编号。
         *
         * 卡片上渲染的是「已交叉核验 · {来源名}」，编号是我们内部为了绕开
         * GitHub 查询长度上限而切的桶，对读者没有意义——「Good First Issues 2」
         * 只会让人疑惑还有没有第 1 组。同一方向的两条来源共用同一个展示名，
         * 数据库唯一索引落在 id 与 siteUrl 上，名字重复不影响。
         */
        name: `GitHub Good First Issues · ${direction}`,
        adapterId: 'github',
        /*
         * 时间窗只进 fetchUrl，不进 siteUrl。
         *
         * siteUrl 在数据库里有唯一索引且会被写回（见 sync.ts 的 upsert），
         * 把每天都在变的日期放进去，等于每天生成一条新来源；而 fetchUrl
         * 明确不入库，随代码/时间变化是安全的。
         */
        fetchUrl: `https://api.github.com/search/issues?q=${encodeURIComponent(withRecentActivity(query))}&sort=updated&order=desc&per_page=20`,
        // siteUrl 在数据库里有唯一索引，每条来源必须不同；这里指向同一批 issue 的
        // GitHub 搜索页，既天然唯一，点开也确实是这条来源的内容
        siteUrl: `https://github.com/search?q=${encodeURIComponent(query)}&type=issues`,
        allowedFetchHosts: ['api.github.com'],
        allowedItemHosts: ['github.com'],
        itemType: 'open-source',
        direction,
        trustLevel: 'verified',
        enabled: true,
        autoPublish: true,
        organization: 'GitHub',
        learningEligible: true,
        curated: true,
      });
    });
  }

  return sources;
}

/**
 * 自动同步只允许访问这份代码内白名单。数据库只保存同步状态，不能覆盖 fetchUrl，
 * 避免后台误配置或公开输入把服务端变成任意 URL 代理。
 */
export const PATHFINDER_SYNC_SOURCES: readonly PathfinderSyncSource[] = [
  {
    id: 'openai-news',
    name: 'OpenAI News',
    adapterId: 'rss',
    fetchUrl: 'https://openai.com/news/rss.xml',
    siteUrl: 'https://openai.com/news/',
    allowedFetchHosts: ['openai.com'],
    allowedItemHosts: ['openai.com'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    autoPublish: true,
    organization: 'OpenAI',
    learningEligible: false,
  },
  {
    /*
     * 下面两条是为补上 google-ai-blog 关闭后的缺口补进来的，同时摊薄来源集中度。
     *
     * 选取前提是**从生产服务器实测可达**：候选里 developers.googleblog.com、
     * research.google、ai.meta.com、bair.berkeley.edu 都是 20 秒超时，只有这两条
     * 与 hf-mirror 通得过。挑可达的官方博客，而不是挑名气最大的。
     */
    id: 'qwen-blog',
    name: 'Qwen Blog',
    adapterId: 'rss',
    fetchUrl: 'https://qwenlm.github.io/blog/index.xml',
    siteUrl: 'https://qwenlm.github.io/blog/',
    allowedFetchHosts: ['qwenlm.github.io'],
    allowedItemHosts: ['qwenlm.github.io'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    // 已审过一批（Qwen 30 条、Microsoft Research 10 条）：全部是模型发布与
    // 研究成果，没有营销与公关内容，故转为自动发布
    autoPublish: true,
    organization: 'Qwen',
    learningEligible: false,
  },
  {
    id: 'microsoft-research-blog',
    name: 'Microsoft Research',
    adapterId: 'rss',
    fetchUrl: 'https://www.microsoft.com/en-us/research/feed/',
    siteUrl: 'https://www.microsoft.com/en-us/research/blog/',
    allowedFetchHosts: ['www.microsoft.com'],
    allowedItemHosts: ['www.microsoft.com'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    // 已审过一批（Qwen 30 条、Microsoft Research 10 条）：全部是模型发布与
    // 研究成果，没有营销与公关内容，故转为自动发布
    autoPublish: true,
    organization: 'Microsoft Research',
    learningEligible: false,
  },
  {
    id: 'hugging-face-blog',
    name: 'Hugging Face Blog',
    adapterId: 'rss',
    /*
     * 抓镜像，不抓官方。
     *
     * huggingface.co 从生产服务器（阿里云）出网不通——实测 20 秒超时，
     * 而这条来源自上线起 `last_success_at` 一直是 null、一条内容都没进来过，
     * 期间没有任何告警。hf-mirror.com 是社区维护的国内镜像，实测 1.2 秒返回
     * 851 条，内容与官方同步。
     *
     * 条目链接由 `rewriteItemHost` 改写回官方域名：卡片上标的是「官方来源」，
     * 指向第三方镜像就是标错出处。镜像与官方的路径结构一致，只换主机名即可。
     */
    fetchUrl: 'https://hf-mirror.com/blog/feed.xml',
    siteUrl: 'https://huggingface.co/blog',
    allowedFetchHosts: ['hf-mirror.com'],
    allowedItemHosts: ['huggingface.co'],
    rewriteItemHost: { from: 'hf-mirror.com', to: 'huggingface.co' },
    // 镜像还会把正文里的「Hugging Face」换成自己的名字：实测 30 条里有 3 条
    // 标题写着「HF Mirror Inference Endpoints」，原文是「Hugging Face …」
    rewriteItemText: [{ from: 'HF Mirror', to: 'Hugging Face' }],
    /*
     * 这个 feed 只给 guid/link/pubDate/title，没有 description，于是条目在站内
     * 没有摘要、也生成不了解读。正文首段从文章页取——注意抓的是镜像域名，
     * 而条目链接已被改写成官方域名，两者不同。
     */
    articleSummary: { mode: 'html', containerMarker: 'blog-content', fetchHost: 'hf-mirror.com' },
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'verified',
    enabled: true,
    // 已审过一批（26 条）：标题全部是模型、论文与工具发布，无营销内容。
    // 注意这个 feed **不提供摘要**（只有 guid/link/pubDate/title），
    // 页面会显示「官方来源未提供摘要，点开可查看原文」——这是来源本身的限制，
    // 不是抽取失败，不要为此去猜正文
    autoPublish: true,
    organization: 'Hugging Face',
    learningEligible: false,
  },
  {
    id: 'google-deepmind-blog',
    name: 'Google DeepMind Blog',
    adapterId: 'rss',
    fetchUrl: 'https://deepmind.google/blog/rss.xml',
    siteUrl: 'https://deepmind.google/blog/',
    allowedFetchHosts: ['deepmind.google'],
    allowedItemHosts: ['deepmind.google'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    autoPublish: true,
    organization: 'Google DeepMind',
    learningEligible: false,
  },
  {
    id: 'google-ai-blog',
    name: 'Google AI',
    adapterId: 'rss',
    /*
     * 关闭：从生产服务器出网不通，且没有可达的替代。
     *
     * blog.google 实测 20 秒超时；找过的替代源（developers.googleblog.com、
     * research.google、ai.meta.com、bair.berkeley.edu）从服务器上同样全部不通，
     * 也没有可信的镜像。
     *
     * 关掉而不是留着反复失败：一条永远失败的来源会一直占着同步的重试与日志，
     * 掩盖真正的新故障。Google 的研究内容由仍然可达的 google-deepmind-blog
     * 覆盖；blog.google 那半边本来就以产品与消费向公告为主
     * （「用 Google 搜索升级家居装饰」这类），对学生的价值本来就低。
     *
     * 服务器出网条件变化后，把 enabled 改回 true 即可。
     */
    fetchUrl: 'https://blog.google/technology/ai/rss/',
    siteUrl: 'https://blog.google/technology/ai/',
    allowedFetchHosts: ['blog.google'],
    allowedItemHosts: ['blog.google'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: false,
    autoPublish: true,
    organization: 'Google',
    learningEligible: false,
  },
  {
    id: 'github-ai-blog',
    name: 'GitHub AI & ML',
    adapterId: 'rss',
    fetchUrl: 'https://github.blog/ai-and-ml/feed/',
    siteUrl: 'https://github.blog/ai-and-ml/',
    allowedFetchHosts: ['github.blog'],
    allowedItemHosts: ['github.blog'],
    itemType: 'ai-update',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    autoPublish: true,
    organization: 'GitHub',
    learningEligible: false,
  },
  {
    /*
     * 唯一的日更中文来源。
     *
     * 加它是因为其余动态来源全是企业官方博客，一周才发几篇：实测同步
     * 每小时准点跑，但连着 17 小时一条新条目都没带回来，机会库看着像坏了。
     *
     * **接的是日报，不是 AGI Hunt 的快讯流。** 那个流 `/feed.xml` 每 24 小时
     * 产出 5761 条（按 /api/channels 的 count_24h 合计），而 feed 只保留最新
     * 50 条、实测跨度仅 20 分钟；RSS 适配器每次最多取 30 条、同步每小时一次，
     * 等于每小时从 240 条里随机采 30 条，覆盖率 12%，还要每天往待审队列灌
     * 720 条。这正是 `github-good-first-issues` 停用的那个失败模式，量级还大 4 倍。
     * 日报是站方自己按天汇总的一期，1 条/天，人读得完。
     */
    id: 'agihunt-daily',
    name: 'AGI Hunt 日报',
    adapterId: 'rss',
    fetchUrl: 'https://agihunt.info/daily/feed.xml',
    siteUrl: 'https://agihunt.info/daily/',
    allowedFetchHosts: ['agihunt.info'],
    allowedItemHosts: ['agihunt.info'],
    /*
     * feed 的 description 是模板套日期，30 条按日期归一化后只有 1 种写法，
     * 直接用会让列表页出现一整屏一模一样的说明文字。真正的当天综述在
     * `/daily/{date}.md` 的「今日总结」一节，取那一段覆盖掉样板文。
     * 站点自己提供 .md 版，比解析 448KB 的日报页可靠。
     */
    articleSummary: {
      mode: 'markdown',
      fetchHost: 'agihunt.info',
      urlSuffix: '.md',
      heading: '## 今日总结',
      replacesFeedSummary: true,
    },
    // 日更来源每轮只有 1 条是新的；取 3 条留一点余量，漏跑一两轮也能补回来。
    // 照默认 30 条会让首轮的正文补全耗时约 51 秒，超掉 route 的 60 秒预算
    maxItemsPerSync: 3,
    // 产出的是资讯摘要不是机会条目；只由发现页侧栏承载（理由见 types.ts）
    digest: true,
    language: 'zh',
    itemType: 'ai-update',
    direction: 'ai',
    // 聚合站不是官方信源，且它自己的内容就是 AI 从 X / Reddit 汇总来的二次转述。
    // 卡片上标「官方来源」是标错出处
    trustLevel: 'verified',
    enabled: true,
    autoPublish: true,
    organization: 'AGI Hunt',
    learningEligible: false,
  },
  {
    id: 'github-good-first-issues',
    name: 'GitHub Good First Issues',
    adapterId: 'github',
    fetchUrl: 'https://api.github.com/search/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+no%3Aassignee+archived%3Afalse&sort=updated&order=desc&per_page=30',
    siteUrl: 'https://github.com/topics/good-first-issue',
    allowedFetchHosts: ['api.github.com'],
    allowedItemHosts: ['github.com'],
    itemType: 'open-source',
    direction: 'ai',
    trustLevel: 'verified',
    /*
     * 已停用。
     *
     * 这条来源扫的是全 GitHub（`sort=updated`），每小时带回约 30 条几乎不重复的
     * issue——实测一天累积 178 条，全部停留在 pending，从未有人审过一条。
     * 抽样看仓库构成：赏金农场（Stellar/Soroban 系）和训练营作业仓库占多数，
     * 一个正经大项目都没有；方向也基本是坏的（149/178 落到 inferDirection 的
     * 默认值 backend）。而且 `canPublishPathfinderItemForLearning` 明确禁止
     * 这个来源进入学习路径，就算人工审过收益也很小。
     *
     * 它的职责已由下面按种子仓库生成的策展来源完全接管：范围限定在目录里
     * 审过的仓库，方向由仓库条目背书，可以直接发布，也能进学习路径。
     * 保留定义而不是删除，是为了让数据库里既有的 178 条 pending 仍能被后台
     * 识别归属；`enabled = 数据库值 AND 代码值`，这里置 false 后无法被重新打开。
     */
    enabled: false,
    autoPublish: false,
    organization: 'GitHub',
    learningEligible: true,
  },
  /*
   * 雇主官方职位板上的学生岗位。
   *
   * 目录里的实习条目原本全是「XX 集团招聘入口」，学生点进去还要在几百个岗位里
   * 自己翻；这两条来源把粒度下沉到具体岗位。只取岗位名、地点和发布时间——
   * Greenhouse 的 `content=true` 会带回上千条岗位正文，直接超过响应体上限。
   * 工作许可、年级、地点都是画像判断不了的硬条件，所以解析层一律标记为需人工核对。
   */
  {
    id: 'databricks-student-jobs',
    name: 'Databricks Careers',
    adapterId: 'greenhouse',
    fetchUrl: 'https://boards-api.greenhouse.io/v1/boards/databricks/jobs',
    siteUrl: 'https://www.databricks.com/company/careers/open-positions',
    allowedFetchHosts: ['boards-api.greenhouse.io'],
    allowedItemHosts: ['databricks.com', 'job-boards.greenhouse.io'],
    itemType: 'internship',
    direction: 'data',
    trustLevel: 'official',
    enabled: true,
    autoPublish: true,
    organization: 'Databricks',
    learningEligible: false,
  },
  {
    id: 'scale-ai-student-jobs',
    name: 'Scale AI Careers',
    adapterId: 'greenhouse',
    fetchUrl: 'https://boards-api.greenhouse.io/v1/boards/scaleai/jobs',
    siteUrl: 'https://scale.com/careers',
    allowedFetchHosts: ['boards-api.greenhouse.io'],
    allowedItemHosts: ['scale.com', 'job-boards.greenhouse.io'],
    itemType: 'internship',
    direction: 'ai',
    trustLevel: 'official',
    enabled: true,
    autoPublish: true,
    organization: 'Scale AI',
    learningEligible: false,
  },
  ...buildCuratedIssueSources(),
];

export const PATHFINDER_SYNC_SOURCE_MAP = new Map(
  PATHFINDER_SYNC_SOURCES.map((source) => [source.id, source]),
);
