// @ts-nocheck
/* eslint-disable */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  error?: Error
  userId?: string
  sessionId?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableStorage: boolean
  maxStorageEntries: number
  enableRemote: boolean
  remoteEndpoint?: string
}

class Logger {
  private config: LoggerConfig
  private logs: LogEntry[] = []
  private sessionId: string

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableStorage: true,
      maxStorageEntries: 1000,
      enableRemote: false,
      ...config
    }
    
    this.sessionId = this.generateSessionId()
    this.loadStoredLogs()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadStoredLogs(): void {
    if (!this.config.enableStorage) return
    
    try {
      const stored = localStorage.getItem('tollow_logs')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.logs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
      }
    } catch (error) {
      console.warn('Failed to load stored logs:', error)
    }
  }

  private saveLogs(): void {
    if (!this.config.enableStorage) return
    
    try {
      const logsToStore = this.logs.slice(-this.config.maxStorageEntries)
      localStorage.setItem('tollow_logs', JSON.stringify(logsToStore))
    } catch (error) {
      console.warn('Failed to save logs:', error)
    }
  }

  private async sendToRemote(logEntry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return
    
    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.warn('Failed to send log to remote:', error)
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString()
    const level = LogLevel[entry.level]
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? `\n${entry.error.stack}` : ''
    
    return `[${timestamp}] ${level}: ${entry.message}${context}${error}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.config.level) return

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
      sessionId: this.sessionId
    }

    // 添加到内存
    this.logs.push(logEntry)
    
    // 限制日志数量
    if (this.logs.length > this.config.maxStorageEntries * 2) {
      this.logs = this.logs.slice(-this.config.maxStorageEntries)
    }

    // 控制台输出
    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(logEntry)
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage)
          break
      }
    }

    // 保存到本地存储
    this.saveLogs()

    // 发送到远程服务
    this.sendToRemote(logEntry)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // 性能日志
  time(label: string): void {
    if (this.config.enableConsole) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.config.enableConsole) {
      console.timeEnd(label)
    }
  }

  // 获取日志
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.logs
    
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level >= level)
    }
    
    if (limit) {
      filtered = filtered.slice(-limit)
    }
    
    return filtered
  }

  // 清除日志
  clearLogs(): void {
    this.logs = []
    if (this.config.enableStorage) {
      localStorage.removeItem('tollow_logs')
    }
  }

  // 导出日志
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // 设置配置
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // 获取统计信息
  getStats(): {
    total: number
    byLevel: Record<string, number>
    oldest: Date | null
    newest: Date | null
  } {
    const byLevel = this.logs.reduce((acc, log) => {
      const level = LogLevel[log.level]
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: this.logs.length,
      byLevel,
      oldest: this.logs.length > 0 ? this.logs[0].timestamp : null,
      newest: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null
    }
  }
}

// 创建默认日志实例
export const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableStorage: true,
  enableRemote: false
})

// 导出Logger类以便创建自定义实例
export { Logger }
