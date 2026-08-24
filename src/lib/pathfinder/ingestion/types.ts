import type {
  PathfinderDevice,
  PathfinderDifficulty,
  PathfinderDirection,
  PathfinderItemType,
  PathfinderNetwork,
  PathfinderRemoteStatus,
} from '../catalog-types';

export type PathfinderAdapterId = 'rss' | 'github';

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
