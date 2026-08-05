// @ts-nocheck
/* eslint-disable */
import { SharedFile, ShareLink, ShareSettings, ShareStats, ShareRequest, ShareActivity } from '../types/sharing'
import { TextContent } from '../types/types'

/**
 * 文件分享服务
 */
export class SharingService {
  private static readonly STORAGE_KEY = 'tollow_shared_files'
  private static readonly LINKS_KEY = 'tollow_share_links'

  /**
   * 分享文件
   */
  static async shareFile(request: ShareRequest): Promise<SharedFile> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      const sharedFile: SharedFile = {
        id: this.generateId(),
        originalFileId: request.fileId,
        title: request.title,
        description: request.description,
        sharedBy: 'current_user', // 从认证服务获取
        sharedAt: new Date(),
        expiresAt: request.settings.expiresAt,
        accessLevel: request.settings.accessLevel,
        downloadCount: 0,
        viewCount: 0,
        tags: request.tags,
        isPublic: request.settings.accessLevel === 'public'
      }

      // 保存到本地存储
      this.saveSharedFile(sharedFile)

      // 如果设置了链接分享，创建分享链接
      if (request.settings.accessLevel === 'link') {
        await this.createShareLink(request.fileId, request.settings)
      }

      return sharedFile
    } catch (error) {
      throw new Error(`分享文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 创建分享链接
   */
  static async createShareLink(fileId: string, settings: ShareSettings): Promise<ShareLink> {
    try {
      const token = this.generateToken()
      const shareLink: ShareLink = {
        id: this.generateId(),
        fileId,
        token,
        url: `${window.location.origin}/shared/${token}`,
        createdAt: new Date(),
        expiresAt: settings.expiresAt,
        maxDownloads: settings.maxDownloads,
        currentDownloads: 0,
        password: settings.password
      }

      // 保存到本地存储
      this.saveShareLink(shareLink)

      return shareLink
    } catch (error) {
      throw new Error(`创建分享链接失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 获取分享的文件列表
   */
  static async getSharedFiles(): Promise<SharedFile[]> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const sharedFiles = this.getLocalSharedFiles()
      return sharedFiles
    } catch (error) {
      throw new Error(`获取分享文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 获取分享统计信息
   */
  static async getShareStats(): Promise<ShareStats> {
    try {
      const sharedFiles = this.getLocalSharedFiles()
      const totalShares = sharedFiles.length
      const totalViews = sharedFiles.reduce((sum, file) => sum + file.viewCount, 0)
      const totalDownloads = sharedFiles.reduce((sum, file) => sum + file.downloadCount, 0)

      // 按访问量排序获取热门文件
      const popularFiles = [...sharedFiles]
        .sort((a, b) => (b.viewCount + b.downloadCount) - (a.viewCount + a.downloadCount))
        .slice(0, 5)

      // 模拟最近活动
      const recentActivity: ShareActivity[] = sharedFiles.slice(0, 10).map(file => ({
        id: this.generateId(),
        fileId: file.id,
        action: Math.random() > 0.5 ? 'view' : 'download',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }))

      return {
        totalShares,
        totalViews,
        totalDownloads,
        popularFiles,
        recentActivity
      }
    } catch (error) {
      throw new Error(`获取分享统计失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 通过链接访问分享文件
   */
  static async accessSharedFile(token: string, password?: string): Promise<{ file: SharedFile; content: TextContent }> {
    try {
      const shareLink = this.getShareLinkByToken(token)
      if (!shareLink) {
        throw new Error('分享链接无效或已过期')
      }

      // 检查密码
      if (shareLink.password && shareLink.password !== password) {
        throw new Error('访问密码错误')
      }

      // 检查下载次数限制
      if (shareLink.maxDownloads && shareLink.currentDownloads >= shareLink.maxDownloads) {
        throw new Error('下载次数已达上限')
      }

      // 检查过期时间
      if (shareLink.expiresAt && new Date(shareLink.expiresAt) <= new Date()) {
        throw new Error('分享链接已过期')
      }

      // 获取分享文件
      const sharedFile = this.getSharedFileById(shareLink.fileId)
      if (!sharedFile) {
        throw new Error('分享文件不存在')
      }

      // 更新访问统计
      this.updateFileStats(sharedFile.id, 'view')

      // 模拟文件内容
      const content: TextContent = {
        title: sharedFile.title,
        content: `这是${sharedFile.title}的内容。\n\n通过分享链接访问。\n\n分享时间: ${sharedFile.sharedAt.toLocaleDateString()}\n访问时间: ${new Date().toLocaleDateString()}`,
        source: `分享自: ${sharedFile.sharedBy}`,
        type: 'text'
      }

      return { file: sharedFile, content }
    } catch (error) {
      throw new Error(`访问分享文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 下载分享文件
   */
  static async downloadSharedFile(token: string, password?: string): Promise<File> {
    try {
      const { file } = await this.accessSharedFile(token, password)
      
      // 更新下载统计
      this.updateFileStats(file.id, 'download')

      // 创建下载文件
      const content = `这是${file.title}的内容。\n\n通过分享链接下载。\n\n分享时间: ${file.sharedAt.toLocaleDateString()}\n下载时间: ${new Date().toLocaleDateString()}`
      const blob = new Blob([content], { type: 'text/plain' })
      
      return new File([blob], `${file.title}.txt`, { type: 'text/plain' })
    } catch (error) {
      throw new Error(`下载分享文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 更新文件统计
   */
  private static updateFileStats(fileId: string, action: 'view' | 'download'): void {
    const sharedFiles = this.getLocalSharedFiles()
    const fileIndex = sharedFiles.findIndex(f => f.id === fileId)
    
    if (fileIndex !== -1) {
      if (action === 'view') {
        sharedFiles[fileIndex].viewCount++
      } else if (action === 'download') {
        sharedFiles[fileIndex].downloadCount++
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sharedFiles))
    }
  }

  /**
   * 获取本地分享文件
   */
  private static getLocalSharedFiles(): SharedFile[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 保存分享文件到本地
   */
  private static saveSharedFile(sharedFile: SharedFile): void {
    const sharedFiles = this.getLocalSharedFiles()
    sharedFiles.push(sharedFile)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sharedFiles))
  }

  /**
   * 根据ID获取分享文件
   */
  private static getSharedFileById(id: string): SharedFile | undefined {
    const sharedFiles = this.getLocalSharedFiles()
    return sharedFiles.find(f => f.id === id)
  }

  /**
   * 获取本地分享链接
   */
  private static getLocalShareLinks(): ShareLink[] {
    try {
      const data = localStorage.getItem(this.LINKS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 保存分享链接到本地
   */
  private static saveShareLink(shareLink: ShareLink): void {
    const shareLinks = this.getLocalShareLinks()
    shareLinks.push(shareLink)
    localStorage.setItem(this.LINKS_KEY, JSON.stringify(shareLinks))
  }

  /**
   * 根据令牌获取分享链接
   */
  private static getShareLinkByToken(token: string): ShareLink | undefined {
    const shareLinks = this.getLocalShareLinks()
    return shareLinks.find(l => l.token === token)
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * 生成分享令牌
   */
  private static generateToken(): string {
    return Math.random().toString(36).substr(2, 15)
  }
}
