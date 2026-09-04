import type {
  PathfinderDevice,
  PathfinderDifficulty,
  PathfinderDirection,
  PathfinderItemType,
  PathfinderNetwork,
  PathfinderRemoteStatus,
} from '../catalog-types';

export type PathfinderAdapterId = 'rss' | 'github' | 'greenhouse';

/**
 * 正文摘要的抓取方式。
 *
 * `fetchHost` 单独写而不是复用 allowedItemHosts：条目链接可能被
 * `rewriteItemHost` 改写成官方域名，而实际能抓到的是镜像，两者不同。
 *
 * `replacesFeedSummary` 区分两种缺失。默认只填**本来就空着**的摘要，
 * 省掉不必要的请求；置 true 时连已有摘要一起覆盖——AGI Hunt 日报的
 * description 是模板套日期，30 条归一化后只有 1 种，留着会让列表页
 * 出现一整屏一模一样的说明文字。
 */
export type PathfinderArticleSummaryConfig = {
  /** 实际抓取用的主机名（可能是镜像，与条目链接的域名不同） */
  fetchHost: string;
  /** feed 给的 description 是样板文时置 true：覆盖它，而不是只填空缺 */
  replacesFeedSummary?: boolean;
} & (
  | {
    /** 从 HTML 正文首段取 */
    mode: 'html';
    /** 正文容器 class 里的唯一片段 */
    containerMarker: string;
  }
  | {
    /** 从站点提供的 Markdown 版正文取 */
    mode: 'markdown';
    /** 拼在条目链接后面得到 Markdown 版的后缀，如 `.md` */
    urlSuffix: string;
    /** 取这个标题下的第一段，如 `## 今日总结` */
    heading: string;
  }
);

export interface PathfinderSyncSource {
  id: string;
  name: string;
  adapterId: PathfinderAdapterId;
  fetchUrl: string;
  siteUrl: string;
  allowedFetchHosts: readonly string[];
  allowedItemHosts: readonly string[];
  itemType: PathfinderItemType;
  direction: PathfinderDirection;
  /**
   * feed 正文的语言，默认英文。
   *
   * RSS 适配器默认把标题与摘要写进 `titleEn` / `summaryEn`，因为现有来源
   * 全是英文站。中文来源（AGI Hunt 日报）必须显式标出来，否则中文正文会被
   * 存进 `title_en` / `summary_en`——渲染上看不出问题（`localizeNullable`
   * 两个方向都兜底），但列名与内容不符，将来任何按语言分流的逻辑都会读错。
   */
  language?: 'zh';
  trustLevel: 'official' | 'verified';
  enabled: boolean;
  autoPublish: boolean;
  organization: string;
  learningEligible: boolean;
  /**
   * 来源限定在已策展仓库内时为 true。
   *
   * 泛 GitHub 搜索抓到的 issue 来自任意仓库，方向只能靠标题猜、资格也无从判断，
   * 因此只能进人工队列；限定在目录里已经审过的仓库时，方向、难度和可参与性
   * 都由那条仓库条目背书，可以直接发布并纳入学习路径。
   */
  curated?: boolean;
  /**
   * 抓取镜像、但把条目链接改写回官方域名。
   *
   * 少数官方站点从生产服务器（阿里云）出网不通——实测 huggingface.co 与
   * blog.google 都是 20 秒超时，而 openai.com 正常。对这类来源只能走镜像抓取，
   * 但**条目链接必须指回官方**：站点对读者的承诺是「每条信息都保留来源」、
   * 卡片上标的是「官方来源」，让它指向第三方镜像就是标错了出处。
   *
   * 只改主机名，路径原样保留（镜像的路径结构与官方一致）。改写发生在
   * `allowedItemHosts` 校验之前，所以白名单里写官方域名即可。
   */
  rewriteItemHost?: { from: string; to: string };
  /**
   * 把镜像替换掉的品牌名改回来。
   *
   * 镜像站不只改域名，还会把正文里的原站名替换成自己的——实测 hf-mirror.com
   * 抓到的 30 条里有 3 条标题写着「HF Mirror Inference Endpoints」，
   * 原文是「Hugging Face Inference Endpoints」。链接已经改回官方了，正文再不改，
   * 就成了以「官方来源」的名义发布被篡改过的文本。
   *
   * 只做字面替换，作用于标题与摘要。
   */
  rewriteItemText?: ReadonlyArray<{ from: string; to: string }>;
  /**
   * feed 不给可用摘要时，从正文里取一段。
   *
   * **按来源显式开启**：这是抓取管线里唯一会逐条拉正文的路径，每条一次
   * HTTP 请求、每页数百 KB。只有确实拿不到可用 description 的来源才值得付
   * 这个代价——Hugging Face 的镜像 feed 只给 guid/link/pubDate/title，
   * AGI Hunt 日报给的 description 则是一份逐日不变的样板文。
   */
  articleSummary?: PathfinderArticleSummaryConfig;
  /**
   * 单轮同步最多取几条，默认 30。
   *
   * 只有开了 `articleSummary` 的来源需要调它：每条要多一次正文请求，
   * 而整批同步共用 route 的 60 秒预算。AGI Hunt 日报实测单页 0.6–2.2 秒、
   * 加 300ms 礼貌间隔约 1.7 秒/条，照默认 30 条要 51 秒——正文补全发生在
   * 入库**之前**，超时就整条来源回滚，于是每小时重试、每次都超时，
   * 那条来源会永远进不来。
   *
   * 调小不会漏内容：feed 里更早的条目下一轮仍在，而日更来源每轮只有 1 条是新的。
   */
  maxItemsPerSync?: number;
}

export interface IngestedPathfinderItem {
  sourceId: string;
  externalId: string;
  canonicalUrl: string;
  type: PathfinderItemType;
  direction: PathfinderDirection;
  directions: PathfinderDirection[];
  titleZh: string | null;
  titleEn: string | null;
  summaryZh: string | null;
  summaryEn: string | null;
  organization: string;
  organizationEn: string;
  difficulty: PathfinderDifficulty;
  estimatedMinutes: number | null;
  costCny: number;
  costAmount: number | null;
  costCurrency: string | null;
  costLabelZh: string | null;
  costLabelEn: string | null;
  device: PathfinderDevice;
  network: PathfinderNetwork;
  region: string;
  regionZh: string | null;
  regionEn: string | null;
  remoteStatus: PathfinderRemoteStatus;
  eligibilityZh: string | null;
  eligibilityEn: string | null;
  deadlineAt: string | null;
  deadlineText: string | null;
  deadlineTextZh: string | null;
  deadlineTextEn: string | null;
  deadlineDate: string | null;
  publishedAt: string | null;
  learningEligible: boolean;
  requiresManualEligibilityCheck: boolean;
  tags: string[];
  contentHash: string;
}

export interface PathfinderFetchResult {
  body: string;
  etag: string | null;
  lastModified: string | null;
  notModified: boolean;
}

export interface PathfinderSourceSyncResult {
  sourceId: string;
  fetched: number;
  inserted: number;
  updated: number;
  skipped: number;
  notModified: boolean;
  error?: string;
}

export interface PathfinderSyncBatchResult {
  results: PathfinderSourceSyncResult[];
  maintenanceChanged: number;
}
