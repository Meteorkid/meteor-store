// @ts-nocheck
/* eslint-disable */
export interface ServiceWorkerConfig {
  name: string
  scope: string
  updateViaCache: 'all' | 'imports' | 'none'
  skipWaiting: boolean
  clientsClaim: boolean
}

export interface CacheConfig {
  name: string
  version: string
  urls: string[]
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate'
  maxAge: number // 秒
  maxEntries: number
}

export interface OfflineData {
  id: string
  type: 'practice-session' | 'user-progress' | 'file-upload'
  data: any
  timestamp: Date
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed'
  retryCount: number
  maxRetries: number
}

export interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  actions?: NotificationAction[]
  data?: any
  timestamp: Date
  read: boolean
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface PWAInstallPrompt {
  id: string
  title: string
  description: string
  icon: string
  screenshots: string[]
  categories: string[]
  installable: boolean
  deferredPrompt?: any
}

export interface OfflineCapability {
  feature: string
  available: boolean
  fallback?: string
  description: string
}

export interface SyncStatus {
  lastSync: Date
  pendingItems: number
  syncErrors: number
  nextSync: Date
  isOnline: boolean
  connectionType: 'wifi' | 'cellular' | 'none'
}
