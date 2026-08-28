import type {
  PathfinderDevice,
  PathfinderDifficulty,
  PathfinderDirection,
  PathfinderItemType,
  PathfinderNetwork,
  PathfinderRemoteStatus,
} from '../catalog-types';

export type PathfinderAdapterId = 'rss' | 'github' | 'greenhouse';

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
