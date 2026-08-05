// @ts-nocheck
/* eslint-disable */
import { logger } from '../utils/logger'

// 性能指标类型
export interface PerformanceMetrics {
  // 页面加载性能
  navigationTiming: {
    domContentLoaded: number
    loadComplete: number
    firstPaint: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    firstInputDelay: number
    cumulativeLayoutShift: number
  }
  
  // 资源加载性能
  resourceTiming: {
    totalResources: number
    slowResources: number
    averageLoadTime: number
    totalSize: number
  }
  
  // 内存使用
  memoryUsage: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
    usagePercentage: number
  }
  
  // 长任务检测
  longTasks: Array<{
    duration: number
    startTime: number
    name: string
  }>
  
  // 网络性能
  networkInfo: {
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
  }
  
  // 用户交互性能
  userInteraction: {
    clickResponseTime: number
    scrollPerformance: number
    inputLatency: number
  }
  
  // 组件渲染性能
  componentPerformance: {
    renderTime: number
    updateTime: number
    mountTime: number
  }
}

// 性能阈值配置
export interface PerformanceThresholds {
  // 页面加载阈值
  pageLoad: {
    domContentLoaded: number // ms
    loadComplete: number // ms
    firstPaint: number // ms
    firstContentfulPaint: number // ms
    largestContentfulPaint: number // ms
    firstInputDelay: number // ms
    cumulativeLayoutShift: number // 0-1
  }
  
  // 资源加载阈值
  resourceLoad: {
    maxLoadTime: number // ms
    maxResourceSize: number // bytes
    slowResourceThreshold: number // ms
  }
  
  // 内存使用阈值
  memory: {
    maxUsagePercentage: number // 0-100
    warningThreshold: number // 0-100
  }
  
  // 长任务阈值
  longTask: {
    maxDuration: number // ms
    warningThreshold: number // ms
  }
  
  // 用户交互阈值
  userInteraction: {
    maxClickResponseTime: number // ms
    maxScrollLag: number // ms
    maxInputLatency: number // ms
  }
}

// 性能监控配置
export interface PerformanceMonitoringConfig {
  enabled: boolean
  sampleRate: number // 0-1
  thresholds: PerformanceThresholds
  reportInterval: number // ms
  maxMetricsHistory: number
  enableRealTimeMonitoring: boolean
  enableResourceMonitoring: boolean
  enableMemoryMonitoring: boolean
  enableLongTaskMonitoring: boolean
  enableUserInteractionMonitoring: boolean
  enableComponentMonitoring: boolean
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService
  private config: PerformanceMonitoringConfig
  private metrics: PerformanceMetrics[] = []
  private observers: Map<string, PerformanceObserver> = new Map()
  private reportTimer: NodeJS.Timeout | null = null
  private isInitialized = false

  private constructor() {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      thresholds: {
        pageLoad: {
          domContentLoaded: 2000,
          loadComplete: 3000,
          firstPaint: 1000,
          firstContentfulPaint: 1500,
          largestContentfulPaint: 2500,
          firstInputDelay: 100,
          cumulativeLayoutShift: 0.1,
        },
        resourceLoad: {
          maxLoadTime: 3000,
          maxResourceSize: 5 * 1024 * 1024, // 5MB
          slowResourceThreshold: 1000,
        },
        memory: {
          maxUsagePercentage: 90,
          warningThreshold: 80,
        },
        longTask: {
          maxDuration: 50,
          warningThreshold: 16,
        },
        userInteraction: {
          maxClickResponseTime: 100,
          maxScrollLag: 16,
          maxInputLatency: 100,
        },
      },
      reportInterval: 30000, // 30秒（开发环境会调高）
      maxMetricsHistory: 1000,
      enableRealTimeMonitoring: true,
      enableResourceMonitoring: true,
      enableMemoryMonitoring: true,
      enableLongTaskMonitoring: true,
      enableUserInteractionMonitoring: true,
      enableComponentMonitoring: true,
    }

    // 开发环境降低噪声：放宽阈值或关闭部分监控
    if (process.env.NODE_ENV !== 'production') {
      this.config.enableLongTaskMonitoring = false
      this.config.reportInterval = 60000
    }
  }

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService()
    }
    return PerformanceMonitoringService.instance
  }

  // 初始化性能监控
  async initialize(): Promise<void> {
    if (this.isInitialized || !this.config.enabled) return

    try {
      // 检查浏览器支持
      if (!this.isPerformanceSupported()) {
        logger.warn('Performance monitoring not supported in this browser')
        return
      }

      // 设置性能观察器
      this.setupPerformanceObservers()

      // 开始定期报告
      this.startPeriodicReporting()

      // 监控页面加载性能
      this.monitorPageLoadPerformance()

      // 监控资源加载性能
      if (this.config.enableResourceMonitoring) {
        this.monitorResourcePerformance()
      }

      // 监控内存使用
      if (this.config.enableMemoryMonitoring) {
        this.monitorMemoryUsage()
      }

      // 监控长任务
      if (this.config.enableLongTaskMonitoring) {
        this.monitorLongTasks()
      }

      // 监控用户交互
      if (this.config.enableUserInteractionMonitoring) {
        this.monitorUserInteractions()
      }

      this.isInitialized = true
      logger.info('Performance monitoring service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize performance monitoring', { error })
    }
  }

  // 检查性能API支持
  private isPerformanceSupported(): boolean {
    return (
      'PerformanceObserver' in window &&
      'performance' in window &&
      'getEntriesByType' in performance
    )
  }

  // 设置性能观察器
  private setupPerformanceObservers(): void {
    try {
      // 导航性能观察器
      if ('PerformanceObserver' in window) {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.handleNavigationTiming(entry as PerformanceNavigationTiming)
            }
          })
        })
        navigationObserver.observe({ entryTypes: ['navigation'] })
        this.observers.set('navigation', navigationObserver)

        // 资源性能观察器
        if (this.config.enableResourceMonitoring) {
          const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === 'resource') {
                this.handleResourceTiming(entry as PerformanceResourceTiming)
              }
            })
          })
          resourceObserver.observe({ entryTypes: ['resource'] })
          this.observers.set('resource', resourceObserver)
        }

        // 长任务观察器
        if (this.config.enableLongTaskMonitoring) {
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === 'longtask') {
                this.handleLongTask(entry as PerformanceLongTaskTiming)
              }
            })
          })
          longTaskObserver.observe({ entryTypes: ['longtask'] })
          this.observers.set('longTask', longTaskObserver)
        }

        // 绘制性能观察器
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              this.handlePaintTiming(entry as PerformancePaintTiming)
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.set('paint', paintObserver)

        // 布局偏移观察器
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'layout-shift') {
              this.handleLayoutShift(entry as any)
            }
          })
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.set('layoutShift', layoutShiftObserver)

        // 最大内容绘制观察器
        const lcpObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              this.handleLargestContentfulPaint(entry as any)
            }
          })
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.set('lcp', lcpObserver)
      }
    } catch (error) {
      logger.error('Failed to setup performance observers', { error })
    }
  }

  // 处理导航性能指标
  private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics: Partial<PerformanceMetrics> = {
      navigationTiming: {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        firstPaint: 0, // 由paint观察器处理
        firstContentfulPaint: 0, // 由paint观察器处理
        largestContentfulPaint: 0, // 由LCP观察器处理
        firstInputDelay: 0, // 需要额外计算
        cumulativeLayoutShift: 0, // 由layout-shift观察器处理
      },
    }

    this.updateMetrics(metrics)
    const current = this.getLatestMetricsInternal()
    if (current) this.checkThresholds(current)
  }

  // 处理绘制性能指标
  private handlePaintTiming(entry: PerformancePaintTiming): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    if (entry.name === 'first-paint') {
      currentMetrics.navigationTiming.firstPaint = entry.startTime
    } else if (entry.name === 'first-contentful-paint') {
      currentMetrics.navigationTiming.firstContentfulPaint = entry.startTime
    }

    this.checkThresholds(currentMetrics)
  }

  // 处理最大内容绘制
  private handleLargestContentfulPaint(entry: any): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    currentMetrics.navigationTiming.largestContentfulPaint = entry.startTime
    this.checkThresholds(currentMetrics)
  }

  // 处理布局偏移
  private handleLayoutShift(entry: any): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    currentMetrics.navigationTiming.cumulativeLayoutShift += entry.value
    this.checkThresholds(currentMetrics)
  }

  // 处理资源性能指标
  private handleResourceTiming(entry: PerformanceResourceTiming): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    // 更新资源统计
    currentMetrics.resourceTiming.totalResources++
    currentMetrics.resourceTiming.totalSize += entry.transferSize || 0

    if (entry.duration > this.config.thresholds.resourceLoad.slowResourceThreshold) {
      currentMetrics.resourceTiming.slowResources++
    }

    // 计算平均加载时间
    const totalTime = currentMetrics.resourceTiming.averageLoadTime * (currentMetrics.resourceTiming.totalResources - 1)
    currentMetrics.resourceTiming.averageLoadTime = (totalTime + entry.duration) / currentMetrics.resourceTiming.totalResources

    this.checkThresholds(currentMetrics)
  }

  // 处理长任务
  private handleLongTask(entry: PerformanceLongTaskTiming): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    currentMetrics.longTasks.push({
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name,
    })

    // 只保留最近的100个长任务
    if (currentMetrics.longTasks.length > 100) {
      currentMetrics.longTasks = currentMetrics.longTasks.slice(-100)
    }

    this.checkThresholds(currentMetrics)
  }

  // 监控页面加载性能
  private monitorPageLoadPerformance(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.measureDOMContentLoaded()
      })
    } else {
      this.measureDOMContentLoaded()
    }

    window.addEventListener('load', () => {
      this.measurePageLoadComplete()
    })
  }

  // 监控资源性能
  private monitorResourcePerformance(): void {
    // 监控图片加载
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (img.complete) {
        this.measureImageLoad(img)
      } else {
        img.addEventListener('load', () => this.measureImageLoad(img))
        img.addEventListener('error', () => this.measureImageError(img))
      }
    })

    // 监控脚本加载
    const scripts = document.querySelectorAll('script')
    scripts.forEach((script) => {
      if (script.src) {
        this.measureScriptLoad(script)
      }
    })
  }

  // 监控内存使用
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        const currentMetrics = this.getLatestMetricsInternal()
        if (currentMetrics) {
          currentMetrics.memoryUsage = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
          }

          this.checkThresholds(currentMetrics)
        }
      }, 10000) // 每10秒检查一次
    }
  }

  // 监控长任务
  private monitorLongTasks(): void {
    // 长任务监控已在setupPerformanceObservers中设置
  }

  // 监控用户交互
  private monitorUserInteractions(): void {
    let lastClickTime = 0
    let lastScrollTime = 0
    let lastInputTime = 0

    // 监控点击性能
    document.addEventListener('click', (event) => {
      const clickTime = performance.now()
      const responseTime = clickTime - lastClickTime
      
      const currentMetrics = this.getLatestMetricsInternal()
      if (currentMetrics) {
        currentMetrics.userInteraction.clickResponseTime = responseTime
        this.checkThresholds(currentMetrics)
      }
      
      lastClickTime = clickTime
    }, { passive: true })

    // 监控滚动性能
    let scrollTimeout: NodeJS.Timeout
    document.addEventListener('scroll', () => {
      const scrollTime = performance.now()
      const scrollLag = scrollTime - lastScrollTime
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const currentMetrics = this.getLatestMetricsInternal()
        if (currentMetrics) {
          currentMetrics.userInteraction.scrollPerformance = scrollLag
          this.checkThresholds(currentMetrics)
        }
      }, 100)
      
      lastScrollTime = scrollTime
    }, { passive: true })

    // 监控输入延迟
    document.addEventListener('input', () => {
      const inputTime = performance.now()
      const inputLatency = inputTime - lastInputTime
      
      const currentMetrics = this.getLatestMetricsInternal()
      if (currentMetrics) {
        currentMetrics.userInteraction.inputLatency = inputLatency
        this.checkThresholds(currentMetrics)
      }
      
      lastInputTime = inputTime
    }, { passive: true })
  }

  // 测量DOM内容加载完成
  private measureDOMContentLoaded(): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (currentMetrics) {
      const domContentLoaded = performance.now()
      currentMetrics.navigationTiming.domContentLoaded = domContentLoaded
      this.checkThresholds(currentMetrics)
    }
  }

  // 测量页面加载完成
  private measurePageLoadComplete(): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (currentMetrics) {
      const loadComplete = performance.now()
      currentMetrics.navigationTiming.loadComplete = loadComplete
      this.checkThresholds(currentMetrics)
    }
  }

  // 测量图片加载
  private measureImageLoad(img: HTMLImageElement): void {
    // 图片加载性能测量逻辑
  }

  // 测量图片加载错误
  private measureImageError(img: HTMLImageElement): void {
    // 图片加载错误处理逻辑
  }

  // 测量脚本加载
  private measureScriptLoad(script: HTMLScriptElement): void {
    // 脚本加载性能测量逻辑
  }

  // 更新性能指标
  private updateMetrics(newMetrics: Partial<PerformanceMetrics>): void {
    const currentMetrics = this.getLatestMetricsInternal()
    if (currentMetrics) {
      Object.assign(currentMetrics, newMetrics)
    } else {
      const metrics: PerformanceMetrics = {
        navigationTiming: {
          domContentLoaded: 0,
          loadComplete: 0,
          firstPaint: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          firstInputDelay: 0,
          cumulativeLayoutShift: 0,
        },
        resourceTiming: {
          totalResources: 0,
          slowResources: 0,
          averageLoadTime: 0,
          totalSize: 0,
        },
        memoryUsage: {
          usedJSHeapSize: 0,
          totalJSHeapSize: 0,
          jsHeapSizeLimit: 0,
          usagePercentage: 0,
        },
        longTasks: [],
        networkInfo: {
          effectiveType: 'unknown',
          downlink: 0,
          rtt: 0,
          saveData: false,
        },
        userInteraction: {
          clickResponseTime: 0,
          scrollPerformance: 0,
          inputLatency: 0,
        },
        componentPerformance: {
          renderTime: 0,
          updateTime: 0,
          mountTime: 0,
        },
        ...newMetrics,
      }

      this.metrics.push(metrics)

      // 限制历史记录数量
      if (this.metrics.length > this.config.maxMetricsHistory) {
        this.metrics = this.metrics.slice(-this.config.maxMetricsHistory)
      }
    }
  }

  // 获取当前性能指标（内部）
  private getLatestMetricsInternal(): PerformanceMetrics | undefined {
    return this.metrics[this.metrics.length - 1]
  }

  // 检查性能阈值
  private checkThresholds(metrics: PerformanceMetrics): void {
    const thresholds = this.config.thresholds

    // 检查页面加载性能
    if (metrics.navigationTiming.domContentLoaded > thresholds.pageLoad.domContentLoaded) {
      this.triggerAlert('HighDOMContentLoaded', {
        metric: 'DOM内容加载时间',
        value: metrics.navigationTiming.domContentLoaded,
        threshold: thresholds.pageLoad.domContentLoaded,
      })
    }

    if (metrics.navigationTiming.loadComplete > thresholds.pageLoad.loadComplete) {
      this.triggerAlert('HighPageLoadTime', {
        metric: '页面加载完成时间',
        value: metrics.navigationTiming.loadComplete,
        threshold: thresholds.pageLoad.loadComplete,
      })
    }

    // 检查内存使用
    if (metrics.memoryUsage && typeof metrics.memoryUsage.usagePercentage === 'number' &&
        metrics.memoryUsage.usagePercentage > thresholds.memory.maxUsagePercentage) {
      this.triggerAlert('HighMemoryUsage', {
        metric: '内存使用率',
        value: metrics.memoryUsage.usagePercentage,
        threshold: thresholds.memory.maxUsagePercentage,
      })
    }

    // 检查长任务
    const longTasks = metrics.longTasks.filter(task => task.duration > thresholds.longTask.maxDuration)
    if (longTasks.length > 0) {
      this.triggerAlert('LongTasksDetected', {
        metric: '长任务数量',
        value: longTasks.length,
        threshold: thresholds.longTask.maxDuration,
        tasks: longTasks,
      })
    }
  }

  // 触发性能告警
  private triggerAlert(type: string, data: any): void {
    // 开发环境不输出性能告警，避免控制台噪声
    if (process.env.NODE_ENV !== 'production') return
    logger.warn(`Performance alert: ${type}`, data)
    
    // 这里可以集成到告警系统
    // 例如：发送到Prometheus、Slack、邮件等
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('performanceAlert', {
      detail: { type, data, timestamp: new Date().toISOString() }
    }))
  }

  // 开始定期报告
  private startPeriodicReporting(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
    }

    this.reportTimer = setInterval(() => {
      this.reportMetrics()
    }, this.config.reportInterval)
  }

  // 报告性能指标
  private reportMetrics(): void {
    if (this.metrics.length === 0) return

    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return

    try {
      // 发送到分析服务
      this.sendMetricsToAnalytics(currentMetrics)
      
      // 发送到监控系统
      this.sendMetricsToMonitoring(currentMetrics)
      
      logger.debug('Performance metrics reported', { metrics: currentMetrics })
    } catch (error) {
      logger.error('Failed to report performance metrics', { error })
    }
  }

  // 发送指标到分析服务
  private sendMetricsToAnalytics(metrics: PerformanceMetrics): void {
    // 集成到分析服务
    // 这里可以调用analytics.trackPerformance()
  }

  // 发送指标到监控系统
  private sendMetricsToMonitoring(metrics: PerformanceMetrics): void {
    // 集成到监控系统
    // 例如：Prometheus、DataDog、New Relic等
  }

  // 获取性能指标
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  // 获取当前指标
  getCurrentMetrics(): PerformanceMetrics | undefined {
    return this.getLatestMetricsInternal()
  }

  // 获取性能报告
  getPerformanceReport(): any {
    const currentMetrics = this.getLatestMetricsInternal()
    if (!currentMetrics) return null

    return {
      timestamp: new Date().toISOString(),
      metrics: currentMetrics,
      summary: this.generatePerformanceSummary(currentMetrics),
      recommendations: this.generateRecommendations(currentMetrics),
    }
  }

  // 生成性能摘要
  private generatePerformanceSummary(metrics: PerformanceMetrics): any {
    return {
      pageLoadScore: this.calculatePageLoadScore(metrics),
      resourceScore: this.calculateResourceScore(metrics),
      memoryScore: this.calculateMemoryScore(metrics),
      overallScore: this.calculateOverallScore(metrics),
    }
  }

  // 生成优化建议
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = []

    if (metrics.navigationTiming.domContentLoaded > this.config.thresholds.pageLoad.domContentLoaded) {
      recommendations.push('优化DOM内容加载时间，减少阻塞资源')
    }

    if (metrics.navigationTiming.loadComplete > this.config.thresholds.pageLoad.loadComplete) {
      recommendations.push('优化页面加载时间，实施懒加载和代码分割')
    }

    if (metrics.memoryUsage.usagePercentage > this.config.thresholds.memory.warningThreshold) {
      recommendations.push('优化内存使用，检查内存泄漏')
    }

    if (metrics.longTasks.length > 0) {
      recommendations.push('优化长任务，将耗时操作移到Web Worker')
    }

    return recommendations
  }

  // 计算页面加载分数
  private calculatePageLoadScore(metrics: PerformanceMetrics): number {
    // 实现页面加载性能评分算法
    return 85 // 示例分数
  }

  // 计算资源加载分数
  private calculateResourceScore(metrics: PerformanceMetrics): number {
    // 实现资源加载性能评分算法
    return 90 // 示例分数
  }

  // 计算内存使用分数
  private calculateMemoryScore(metrics: PerformanceMetrics): number {
    // 实现内存使用性能评分算法
    return 95 // 示例分数
  }

  // 计算总体性能分数
  private calculateOverallScore(metrics: PerformanceMetrics): number {
    const pageLoadScore = this.calculatePageLoadScore(metrics)
    const resourceScore = this.calculateResourceScore(metrics)
    const memoryScore = this.calculateMemoryScore(metrics)

    return Math.round((pageLoadScore + resourceScore + memoryScore) / 3)
  }

  // 更新配置
  updateConfig(config: Partial<PerformanceMonitoringConfig>): void {
    this.config = { ...this.config, ...config }
    logger.info('Performance monitoring config updated', { config: this.config })
  }

  // 获取配置
  getConfig(): PerformanceMonitoringConfig {
    return { ...this.config }
  }

  // 启用/禁用监控
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    if (enabled && !this.isInitialized) {
      this.initialize()
    }
    logger.info('Performance monitoring', { enabled })
  }

  // 清理资源
  destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
    }

    // 断开所有观察器
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()

    this.isInitialized = false
    logger.info('Performance monitoring service destroyed')
  }
}

export const performanceMonitoring = PerformanceMonitoringService.getInstance()
export { PerformanceMonitoringService }
