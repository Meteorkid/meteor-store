// @ts-nocheck
/* eslint-disable */
import { logger } from '../utils/logger'

// 事件类型定义
export interface AnalyticsEvent {
  id: string
  timestamp: Date
  userId?: string
  sessionId: string
  eventType: string
  eventName: string
  properties: Record<string, any>
  context: {
    url: string
    userAgent: string
    referrer: string
    language: string
    timezone: string
    screen: {
      width: number
      height: number
      colorDepth: number
    }
    viewport: {
      width: number
      height: number
    }
    device: {
      type: 'desktop' | 'tablet' | 'mobile'
      platform: string
      browser: string
      version: string
    }
  }
}

// 用户会话信息
export interface UserSession {
  id: string
  userId?: string
  startTime: Date
  lastActivity: Date
  duration: number
  pageViews: number
  events: number
  source: string
  medium: string
  campaign: string
  referrer: string
  userAgent: string
  ipAddress?: string
  location?: {
    country: string
    region: string
    city: string
    latitude: number
    longitude: number
  }
}

// 页面浏览记录
export interface PageView {
  id: string
  sessionId: string
  userId?: string
  timestamp: Date
  url: string
  title: string
  referrer: string
  duration: number
  scrollDepth: number
  interactions: number
}

// 用户行为指标
export interface UserMetrics {
  userId?: string
  totalSessions: number
  totalPageViews: number
  totalEvents: number
  averageSessionDuration: number
  averagePageViewDuration: number
  bounceRate: number
  conversionRate: number
  retentionRate: number
  lastActivity: Date
  firstSeen: Date
}

// 分析配置
export interface AnalyticsConfig {
  enabled: boolean
  trackingId: string
  endpoint: string
  batchSize: number
  flushInterval: number
  maxRetries: number
  debug: boolean
  respectPrivacy: boolean
  anonymizeIp: boolean
  trackPageViews: boolean
  trackClicks: boolean
  trackScroll: boolean
  trackFormSubmissions: boolean
  trackErrors: boolean
  trackPerformance: boolean
}

class AnalyticsService {
  private static instance: AnalyticsService
  private config: AnalyticsConfig
  private events: AnalyticsEvent[] = []
  private sessions: Map<string, UserSession> = new Map()
  private pageViews: PageView[] = []
  private currentSession: UserSession | null = null
  private flushTimer: NodeJS.Timeout | null = null
  private isInitialized = false

  private constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production', // 开发环境默认关闭上报
      trackingId: 'tollow-analytics',
      endpoint: '/api/analytics',
      batchSize: 50,
      flushInterval: 60000, // 开发期延长
      maxRetries: 3,
      debug: process.env.NODE_ENV !== 'production',
      respectPrivacy: true,
      anonymizeIp: true,
      trackPageViews: true,
      trackClicks: true,
      trackScroll: true,
      trackFormSubmissions: true,
      trackErrors: true,
      trackPerformance: true,
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // 初始化分析服务
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      if (!this.config.enabled) {
        logger.info('Analytics disabled in development')
        return
      }
      // 检查用户隐私设置
      if (this.config.respectPrivacy && !this.hasUserConsent()) {
        logger.info('Analytics disabled due to privacy settings')
        return
      }

      // 创建新会话
      await this.createSession()

      // 设置事件监听器
      this.setupEventListeners()

      // 启动定时刷新
      this.startFlushTimer()

      // 追踪初始页面浏览
      if (this.config.trackPageViews) {
        this.trackPageView()
      }

      this.isInitialized = true
      logger.info('Analytics service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize analytics service', { error })
    }
  }

  // 创建用户会话
  private async createSession(): Promise<void> {
    const sessionId = this.generateSessionId()
    const userId = this.getUserId()

    this.currentSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      duration: 0,
      pageViews: 0,
      events: 0,
      source: this.getSource(),
      medium: this.getMedium(),
      campaign: this.getCampaign(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      location: await this.getLocation(),
    }

    this.sessions.set(sessionId, this.currentSession)
    logger.debug('New session created', { sessionId, userId })
  }

  // 追踪事件
  trackEvent(
    eventName: string,
    properties: Record<string, any> = {},
    userId?: string
  ): void {
    if (!this.config.enabled || !this.isInitialized) return

    try {
      const event: AnalyticsEvent = {
        id: this.generateEventId(),
        timestamp: new Date(),
        userId: userId || this.getUserId(),
        sessionId: this.currentSession?.id || '',
        eventType: 'custom',
        eventName,
        properties,
        context: this.getEventContext(),
      }

      this.events.push(event)
      this.updateSessionActivity()

      if (this.config.debug) {
        logger.debug('Event tracked', { eventName, properties })
      }

      // 检查是否需要刷新数据
      if (this.events.length >= this.config.batchSize) {
        this.flush()
      }
    } catch (error) {
      logger.error('Failed to track event', { error, eventName })
    }
  }

  // 追踪页面浏览
  trackPageView(): void {
    if (!this.config.trackPageViews || !this.currentSession) return

    try {
      const pageView: PageView = {
        id: this.generatePageViewId(),
        sessionId: this.currentSession.id,
        userId: this.currentSession.userId,
        timestamp: new Date(),
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        duration: 0,
        scrollDepth: 0,
        interactions: 0,
      }

      this.pageViews.push(pageView)
      this.currentSession.pageViews++

      // 设置页面离开追踪
      this.setupPageLeaveTracking(pageView)

      logger.debug('Page view tracked', { url: pageView.url, title: pageView.title })
    } catch (error) {
      logger.error('Failed to track page view', { error })
    }
  }

  // 追踪点击事件
  trackClick(element: HTMLElement, properties: Record<string, any> = {}): void {
    if (!this.config.trackClicks) return

    this.trackEvent('click', {
      element: element.tagName.toLowerCase(),
      elementId: element.id,
      elementClass: element.className,
      text: element.textContent?.substring(0, 100),
      ...properties,
    })
  }

  // 追踪滚动事件
  trackScroll(element: HTMLElement, scrollDepth: number): void {
    if (!this.config.trackScroll) return

    this.trackEvent('scroll', {
      element: element.tagName.toLowerCase(),
      elementId: element.id,
      scrollDepth,
      scrollPercentage: Math.round((scrollDepth / element.scrollHeight) * 100),
    })
  }

  // 追踪表单提交
  trackFormSubmission(form: HTMLFormElement, properties: Record<string, any> = {}): void {
    if (!this.config.trackFormSubmissions) return

    this.trackEvent('form_submit', {
      formId: form.id,
      formAction: form.action,
      formMethod: form.method,
      fieldCount: form.elements.length,
      ...properties,
    })
  }

  // 追踪错误
  trackError(error: Error, context: Record<string, any> = {}): void {
    if (!this.config.trackErrors) return

    this.trackEvent('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      ...context,
    })
  }

  // 追踪性能指标
  trackPerformance(metrics: Record<string, number>): void {
    if (!this.config.trackPerformance) return

    this.trackEvent('performance', metrics)
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // 点击事件监听
    if (this.config.trackClicks) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (target) {
          this.trackClick(target)
        }
      }, true)
    }

    // 滚动事件监听
    if (this.config.trackScroll) {
      let scrollTimeout: NodeJS.Timeout
      document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          const scrollDepth = window.pageYOffset + window.innerHeight
          this.trackScroll(document.documentElement, scrollDepth)
        }, 100)
      }, { passive: true })
    }

    // 表单提交监听
    if (this.config.trackFormSubmissions) {
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement
        if (form) {
          this.trackFormSubmission(form)
        }
      }, true)
    }

    // 错误监听
    if (this.config.trackErrors) {
      window.addEventListener('error', (event) => {
        this.trackError(new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(new Error(event.reason), {
          type: 'unhandledrejection',
        })
      })
    }

    // 性能监听
    if (this.config.trackPerformance && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.trackPerformance({
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
                firstPaint: navEntry.responseStart - navEntry.requestStart,
              })
            }
          })
        })
        observer.observe({ entryTypes: ['navigation'] })
      } catch (error) {
        logger.warn('Performance monitoring not available', { error })
      }
    }
  }

  // 设置页面离开追踪
  private setupPageLeaveTracking(pageView: PageView): void {
    const startTime = Date.now()
    let maxScrollDepth = 0
    let interactionCount = 0

    // 追踪滚动深度
    const trackScrollDepth = () => {
      const scrollDepth = window.pageYOffset + window.innerHeight
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
    }

    // 追踪交互
    const trackInteraction = () => {
      interactionCount++
    }

    document.addEventListener('scroll', trackScrollDepth, { passive: true })
    document.addEventListener('click', trackInteraction)
    document.addEventListener('input', trackInteraction)
    document.addEventListener('keydown', trackInteraction)

    // 页面离开时更新数据
    const updatePageView = () => {
      const duration = Date.now() - startTime
      pageView.duration = duration
      pageView.scrollDepth = maxScrollDepth
      pageView.interactions = interactionCount

      // 移除事件监听器
      document.removeEventListener('scroll', trackScrollDepth)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('input', trackInteraction)
      document.removeEventListener('keydown', trackInteraction)
    }

    window.addEventListener('beforeunload', updatePageView)
    window.addEventListener('pagehide', updatePageView)
  }

  // 刷新数据到服务器
  async flush(): Promise<void> {
    if (this.events.length === 0) return

    try {
      const batch = this.events.splice(0, this.config.batchSize)
      
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: batch,
          session: this.currentSession,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      logger.debug('Analytics data flushed successfully', { count: batch.length })
    } catch (error) {
      logger.error('Failed to flush analytics data', { error })
      
      // 将事件放回队列
      this.events.unshift(...this.events.splice(0, this.config.batchSize))
    }
  }

  // 启动定时刷新
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  // 获取用户指标
  getUserMetrics(userId?: string): UserMetrics {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => !userId || session.userId === userId)

    const totalSessions = userSessions.length
    const totalPageViews = userSessions.reduce((sum, session) => sum + session.pageViews, 0)
    const totalEvents = userSessions.reduce((sum, session) => sum + session.events, 0)
    
    const averageSessionDuration = totalSessions > 0 
      ? userSessions.reduce((sum, session) => sum + session.duration, 0) / totalSessions
      : 0

    const averagePageViewDuration = totalPageViews > 0
      ? this.pageViews
          .filter(pv => !userId || pv.userId === userId)
          .reduce((sum, pv) => sum + pv.duration, 0) / totalPageViews
      : 0

    const bounceRate = totalSessions > 0
      ? (userSessions.filter(session => session.pageViews <= 1).length / totalSessions) * 100
      : 0

    const lastActivity = userSessions.length > 0
      ? new Date(Math.max(...userSessions.map(s => s.lastActivity.getTime())))
      : new Date()

    const firstSeen = userSessions.length > 0
      ? new Date(Math.min(...userSessions.map(s => s.startTime.getTime())))
      : new Date()

    return {
      userId,
      totalSessions,
      totalPageViews,
      totalEvents,
      averageSessionDuration,
      averagePageViewDuration,
      bounceRate,
      conversionRate: 0, // 需要根据业务逻辑计算
      retentionRate: 0, // 需要根据业务逻辑计算
      lastActivity,
      firstSeen,
    }
  }

  // 获取事件上下文
  private getEventContext() {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      device: this.getDeviceInfo(),
    }
  }

  // 获取设备信息
  private getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase()
    
    let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet'
    } else if (/mobile|phone|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(userAgent)) {
      deviceType = 'mobile'
    }

    let browser = 'unknown'
    let version = 'unknown'
    
    if (userAgent.includes('chrome')) {
      browser = 'chrome'
      version = userAgent.match(/chrome\/(\d+)/)?.[1] || 'unknown'
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox'
      version = userAgent.match(/firefox\/(\d+)/)?.[1] || 'unknown'
    } else if (userAgent.includes('safari')) {
      browser = 'safari'
      version = userAgent.match(/version\/(\d+)/)?.[1] || 'unknown'
    } else if (userAgent.includes('edge')) {
      browser = 'edge'
      version = userAgent.match(/edge\/(\d+)/)?.[1] || 'unknown'
    }

    return {
      type: deviceType,
      platform: navigator.platform,
      browser,
      version,
    }
  }

  // 获取地理位置
  private async getLocation() {
    try {
      // 这里可以集成IP地理位置服务
      // 例如：ipapi.co, ipinfo.io, 或者自建服务
      return undefined
    } catch (error) {
      logger.warn('Failed to get location', { error })
      return undefined
    }
  }

  // 获取来源信息
  private getSource(): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_source') || 'direct'
  }

  private getMedium(): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_medium') || 'none'
  }

  private getCampaign(): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_campaign') || 'none'
  }

  // 检查用户同意
  private hasUserConsent(): boolean {
    // 这里可以检查用户的隐私设置
    // 例如：localStorage中的设置，或者cookie中的同意标记
    return true
  }

  // 获取用户ID
  private getUserId(): string | undefined {
    // 这里可以从localStorage、cookie或者用户状态中获取用户ID
    return localStorage.getItem('tollow_user_id') || undefined
  }

  // 生成ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generatePageViewId(): string {
    return `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 更新会话活动
  private updateSessionActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date()
      this.currentSession.events++
      this.currentSession.duration = Date.now() - this.currentSession.startTime.getTime()
    }
  }

  // 配置更新
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config }
    logger.info('Analytics config updated', { config: this.config })
  }

  // 获取配置
  getConfig(): AnalyticsConfig {
    return { ...this.config }
  }

  // 启用/禁用追踪
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    if (enabled && !this.isInitialized) {
      this.initialize()
    }
    logger.info('Analytics tracking', { enabled })
  }

  // 清理资源
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    // 刷新剩余数据
    this.flush()
    
    this.isInitialized = false
    logger.info('Analytics service destroyed')
  }
}

export const analytics = AnalyticsService.getInstance()
export { AnalyticsService }
