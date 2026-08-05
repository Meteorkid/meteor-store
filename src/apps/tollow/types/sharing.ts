// @ts-nocheck
/* eslint-disable */
export interface SharedFile {
  id: string
  originalFileId: string
  title: string
  description?: string
  sharedBy: string
  sharedAt: Date
  expiresAt?: Date
  accessLevel: 'public' | 'link' | 'private'
  downloadCount: number
  viewCount: number
  tags: string[]
  isPublic: boolean
}

export interface ShareLink {
  id: string
  fileId: string
  token: string
  url: string
  createdAt: Date
  expiresAt?: Date
  maxDownloads?: number
  currentDownloads: number
  password?: string
}

export interface ShareSettings {
  accessLevel: 'public' | 'link' | 'private'
  allowDownload: boolean
  allowPreview: boolean
  password?: string
  expiresAt?: Date
  maxDownloads?: number
  notifyOnAccess: boolean
}

export interface ShareStats {
  totalShares: number
  totalViews: number
  totalDownloads: number
  popularFiles: SharedFile[]
  recentActivity: ShareActivity[]
}

export interface ShareActivity {
  id: string
  fileId: string
  action: 'view' | 'download' | 'share'
  userId?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface ShareRequest {
  fileId: string
  title: string
  description?: string
  settings: ShareSettings
  tags: string[]
}
