export interface CurrentDownload {
  id: string;
  version?: string;
  sha256?: string;
  r2Key?: string;
  url?: string;
  gated?: boolean;
}
export interface CurrentProduct {
  productId: string;
  name: string;
  downloads: CurrentDownload[];
}
export interface ReleaseAsset {
  fileId: string;
  name: string;
  url: string;
  sha256: string;
  bytes: number;
  architecture: 'macos-arm64' | 'macos-x64';
  assetId: number;
}
export interface ProductUpdateRow {
  productId: string;
  name: string;
  channel: 'github-stable' | 'pypi';
  currentVersion: string | null;
  latestVersion: string | null;
  status: 'update' | 'current' | 'blocked' | 'error';
  message: string;
  sourceUrl: string;
  publishedAt: string | null;
  releaseId?: number;
  tag?: string;
  assets: ReleaseAsset[];
  link?: { fileId: string; url: string; version: string; packageName: string };
}
export interface ProductUpdateCheck {
  id: string;
  checkedAt: string;
  baseRevision: string;
  rows: ProductUpdateRow[];
}
export interface ProductUpdateJob {
  id: string;
  checkId: string;
  status: 'queued' | 'running' | 'completed' | 'partial' | 'failed';
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
  rows: { productId: string; status: 'pending' | 'downloading' | 'uploading' | 'verified' | 'synced' | 'skipped' | 'failed'; message: string }[];
  error?: string;
}
export interface DownloadOverride {
  version: string;
  sha256?: string;
  r2Key?: string;
  url?: string;
}
export interface ReleaseCatalog {
  version: 1;
  updatedAt: string;
  downloads: Record<string, Record<string, DownloadOverride>>;
}
export interface ProductUpdateState {
  check: ProductUpdateCheck | null;
  job: ProductUpdateJob | null;
  current: CurrentProduct[];
  currentRevision: string;
  catalogError: boolean;
}
