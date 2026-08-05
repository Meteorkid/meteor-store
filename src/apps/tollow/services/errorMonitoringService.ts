// @ts-nocheck
/* eslint-disable */
import { logger } from '../utils/logger'

export interface ErrorEvent {
  id: string
  timestamp: Date
  error: Error
  componentName?: string
  userId?: string
  sessionId?: string
  userAgent: string
  url: string
  stackTrace: string
  errorType: 'runtime' | 'component' | 'api' | 'network' | 'validation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
  breadcrumbs: ErrorBreadcrumb[]
}

export interface ErrorBreadcrumb {
  timestamp: Date
  action: string
  category: string
  data?: Record<string, any>
}

export interface ErrorReport {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsBySeverity: Record<string, number>
  errorsByComponent: Record<string, number>
  recentErrors: ErrorEvent[]
  errorTrends: ErrorTrend[]
}

export interface ErrorTrend {
  date: string
  errorCount: number
  errorTypes: Record<string, number>
}

export interface ErrorMonitoringConfig {
  enableRealTimeMonitoring: boolean
  enableErrorReporting: boolean
  enablePerformanceMonitoring: boolean
  maxErrorsPerSession: number
  errorSamplingRate: number
  ignoredErrors: string[]
  reportEndpoint?: string
}

class ErrorMonitoringService {
  private static instance: ErrorMonitoringService
  private errors: ErrorEvent[] = []
  private breadcrumbs: ErrorBreadcrumb[] = []
  private config: ErrorMonitoringConfig
  private sessionId: string
  private userId?: string

  private constructor() {
    this.config = {
      enableRealTimeMonitoring: true,
      enableErrorReporting: true,
      enablePerformanceMonitoring: true,
      maxErrorsPerSession: 1000,
      errorSamplingRate: 1.0, // 100% 采样率
      ignoredErrors: [
        'Script error.',
        'ResizeObserver loop limit exceeded',
        'Network Error',
      ],
      reportEndpoint: process.env.NODE_ENV === 'production' ? '/api/errors' : undefined,
    }
    
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService()
    }
    return ErrorMonitoringService.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initialize(): void {
    if (this.config.enableRealTimeMonitoring) {
      this.setupGlobalErrorHandlers()
      this.setupPerformanceMonitoring()
    }
  }

  private setupGlobalErrorHandlers(): void {
    // 全局错误处理器
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        type: 'runtime',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    })

    // 未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'runtime',
        severity: 'high',
        context: {
          reason: event.reason,
        },
      })
    })

    // 资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError(new Error(`Resource loading failed: ${event.target}`), {
          type: 'network',
          severity: 'medium',
          context: {
            target: event.target,
            type: event.type,
          },
        })
      }
    }, true)
  }

  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      try {
        // 监控长任务
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask' && entry.duration > 50) {
              this.captureError(new Error(`Long task detected: ${entry.name}`), {
                type: 'runtime',
                severity: 'medium',
                context: {
                  taskName: entry.name,
                  duration: entry.duration,
                  startTime: entry.startTime,
                },
              })
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        // 监控资源加载
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              if (resourceEntry.duration > 3000) {
                this.captureError(new Error(`Slow resource loading: ${resourceEntry.name}`), {
                  type: 'network',
                  severity: 'low',
                  context: {
                    resourceName: resourceEntry.name,
                    duration: resourceEntry.duration,
                    size: resourceEntry.transferSize,
                  },
                })
              }
            }
          })
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
      } catch (error) {
        logger.warn('Performance monitoring setup failed', { error })
      }
    }
  }

  // 添加面包屑
  addBreadcrumb(action: string, category: string, data?: Record<string, any>): void {
    const breadcrumb: ErrorBreadcrumb = {
      timestamp: new Date(),
      action,
      category,
      data,
    }
    
    this.breadcrumbs.push(breadcrumb)
    
    // 限制面包屑数量
    if (this.breadcrumbs.length > 100) {
      this.breadcrumbs = this.breadcrumbs.slice(-100)
    }
  }

  // 捕获错误
  captureError(
    error: Error,
    options: {
      type?: ErrorEvent['errorType']
      severity?: ErrorEvent['severity']
      componentName?: string
      context?: Record<string, any>
    } = {}
  ): void {
    // 检查是否应该忽略此错误
    if (this.shouldIgnoreError(error)) {
      return
    }

    // 检查采样率
    if (Math.random() > this.config.errorSamplingRate) {
      return
    }

    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      error,
      componentName: options.componentName,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: error.stack || '',
      errorType: options.type || 'runtime',
      severity: options.severity || 'medium',
      context: options.context,
      breadcrumbs: [...this.breadcrumbs],
    }

    this.errors.push(errorEvent)
    
    // 限制错误数量
    if (this.errors.length > this.config.maxErrorsPerSession) {
      this.errors = this.errors.slice(-this.config.maxErrorsPerSession)
    }

    // 记录错误
    logger.error(`Error captured: ${error.message}`, {
      errorId: errorEvent.id,
      errorType: errorEvent.errorType,
      severity: errorEvent.severity,
      componentName: errorEvent.componentName,
    })

    // 实时报告错误
    if (this.config.enableErrorReporting) {
      this.reportError(errorEvent)
    }
  }

  private shouldIgnoreError(error: Error): boolean {
    return this.config.ignoredErrors.some(ignored => 
      error.message.includes(ignored) || error.stack?.includes(ignored)
    )
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 报告错误到服务器
  private async reportError(errorEvent: ErrorEvent): Promise<void> {
    if (!this.config.reportEndpoint) return

    try {
      await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorEvent),
      })
    } catch (error) {
      logger.warn('Failed to report error to server', { error })
    }
  }

  // 设置用户ID
  setUserId(userId: string): void {
    this.userId = userId
  }

  // 获取错误报告
  getErrorReport(): ErrorReport {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentErrors = this.errors.filter(error => error.timestamp > last24Hours)
    
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.errorType] = (acc[error.errorType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const errorsBySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const errorsByComponent = this.errors.reduce((acc, error) => {
      if (error.componentName) {
        acc[error.componentName] = (acc[error.componentName] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // 生成错误趋势
    const errorTrends: ErrorTrend[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayErrors = this.errors.filter(error => 
        error.timestamp.toISOString().startsWith(dateStr)
      )
      
      const errorTypes = dayErrors.reduce((acc, error) => {
        acc[error.errorType] = (acc[error.errorType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      errorTrends.push({
        date: dateStr,
        errorCount: dayErrors.length,
        errorTypes,
      })
    }

    return {
      totalErrors: this.errors.length,
      errorsByType,
      errorsBySeverity,
      errorsByComponent,
      recentErrors,
      errorTrends,
    }
  }

  // 清除错误记录
  clearErrors(): void {
    this.errors = []
    this.breadcrumbs = []
  }

  // 导出错误数据
  exportErrors(): string {
    return JSON.stringify({
      errors: this.errors,
      breadcrumbs: this.breadcrumbs,
      report: this.getErrorReport(),
    }, null, 2)
  }

  // 更新配置
  updateConfig(config: Partial<ErrorMonitoringConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // 获取配置
  getConfig(): ErrorMonitoringConfig {
    return { ...this.config }
  }
}

export const errorMonitoring = ErrorMonitoringService.getInstance()
export { ErrorMonitoringService }
