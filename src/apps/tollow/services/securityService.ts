// @ts-nocheck
/* eslint-disable */
import { logger } from '../utils/logger'

// 安全威胁类型
export enum SecurityThreatType {
  XSS = 'xss',
  CSRF = 'csrf',
  SQL_INJECTION = 'sql_injection',
  PATH_TRAVERSAL = 'path_traversal',
  FILE_UPLOAD = 'file_upload',
  BRUTE_FORCE = 'brute_force',
  DDoS = 'ddos',
  DATA_LEAKAGE = 'data_leakage',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  MALICIOUS_SCRIPT = 'malicious_script',
}

// 安全威胁级别
export enum SecurityThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// 安全威胁信息
export interface SecurityThreat {
  id: string
  type: SecurityThreatType
  level: SecurityThreatLevel
  description: string
  timestamp: Date
  source: string
  target: string
  payload?: string
  metadata?: Record<string, any>
}

// 安全检查配置
export interface SecurityCheckConfig {
  enabled: boolean
  enableXSSProtection: boolean
  enableCSRFProtection: boolean
  enableSQLInjectionProtection: boolean
  enablePathTraversalProtection: boolean
  enableFileUploadProtection: boolean
  enableBruteForceProtection: boolean
  enableDDoSProtection: boolean
  enableDataLeakageProtection: boolean
  enableUnauthorizedAccessProtection: boolean
  enableMaliciousScriptProtection: boolean
  maxFailedAttempts: number
  blockDuration: number // ms
  whitelist: string[]
  blacklist: string[]
  logThreats: boolean
  autoBlock: boolean
  notifyAdmin: boolean
}

// 安全检查结果
export interface SecurityCheckResult {
  isSecure: boolean
  threats: SecurityThreat[]
  blocked: boolean
  blockReason?: string
  recommendations: string[]
}

class SecurityService {
  private static instance: SecurityService
  private config: SecurityCheckConfig
  private threats: SecurityThreat[] = []
  private blockedIPs: Map<string, { reason: string; until: number }> = new Map()
  private failedAttempts: Map<string, { count: number; lastAttempt: number }> = new Map()
  private isInitialized = false

  private constructor() {
    this.config = {
      enabled: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
      enableSQLInjectionProtection: true,
      enablePathTraversalProtection: true,
      enableFileUploadProtection: true,
      enableBruteForceProtection: true,
      enableDDoSProtection: true,
      enableDataLeakageProtection: true,
      enableUnauthorizedAccessProtection: true,
      enableMaliciousScriptProtection: true,
      maxFailedAttempts: 5,
      blockDuration: 15 * 60 * 1000, // 15分钟
      whitelist: [],
      blacklist: [],
      logThreats: true,
      autoBlock: true,
      notifyAdmin: true,
    }
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  // 初始化安全服务
  async initialize(): Promise<void> {
    if (this.isInitialized || !this.config.enabled) return

    try {
      // 设置安全头
      this.setSecurityHeaders()

      // 设置事件监听器
      this.setupEventListeners()

      // 初始化CSP策略
      this.initializeCSP()

      // 设置定期清理
      this.startPeriodicCleanup()

      this.isInitialized = true
      logger.info('Security service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize security service', { error })
    }
  }

  // 设置安全头
  private setSecurityHeaders(): void {
    // 这些头通常由服务器设置，这里是为了完整性
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }

    // 在开发环境中，可以通过meta标签设置一些头
    if (process.env.NODE_ENV === 'development') {
      Object.entries(securityHeaders).forEach(([key, value]) => {
        const meta = document.createElement('meta')
        meta.httpEquiv = key
        meta.content = value
        document.head.appendChild(meta)
      })
    }
  }

  // 初始化内容安全策略
  private initializeCSP(): void {
    const cspPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    // 在开发环境中设置CSP
    if (process.env.NODE_ENV === 'development') {
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Security-Policy'
      meta.content = cspPolicy
      document.head.appendChild(meta)
    }
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    // 监听表单提交
    document.addEventListener('submit', (event) => {
      this.checkFormSubmission(event.target as HTMLFormElement)
    }, true)

    // 监听文件上传
    document.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      if (target.type === 'file') {
        this.checkFileUpload(target)
      }
    }, true)

    // 监听DOM变化
    this.setupDOMMutationObserver()

    // 监听网络请求
    this.setupNetworkMonitoring()
  }

  // 设置DOM变化观察器
  private setupDOMMutationObserver(): void {
    if ('MutationObserver' in window) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.checkDOMElement(node as Element)
              }
            })
          }
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }
  }

  // 设置网络监控
  private setupNetworkMonitoring(): void {
    // 监控fetch请求
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const url = args[0] as string
      const options = args[1] || {}

      // 检查请求安全性
      const securityCheck = this.checkNetworkRequest(url, options)
      if (!securityCheck.isSecure) {
        this.handleSecurityThreat(securityCheck.threats[0])
        throw new Error('Security threat detected')
      }

      return originalFetch(...args)
    }

    // 监控XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      const securityCheck = this.checkNetworkRequest(url, { method })
      if (!securityCheck.isSecure) {
        this.handleSecurityThreat(securityCheck.threats[0])
        throw new Error('Security threat detected')
      }

      return originalXHROpen.call(this, method, url, ...args)
    }
  }

  // 检查表单提交
  private checkFormSubmission(form: HTMLFormElement): SecurityCheckResult {
    const threats: SecurityThreat[] = []
    const recommendations: string[] = []

    // 检查表单字段
    const formData = new FormData(form)
    for (const [key, value] of formData.entries()) {
      const stringValue = value.toString()
      
      // XSS检查
      if (this.config.enableXSSProtection && this.detectXSS(stringValue)) {
        threats.push(this.createThreat(
          SecurityThreatType.XSS,
          SecurityThreatLevel.HIGH,
          `检测到XSS攻击尝试，字段: ${key}`,
          'form_submission',
          form.action,
          stringValue
        ))
        recommendations.push('对用户输入进行HTML编码')
      }

      // SQL注入检查
      if (this.config.enableSQLInjectionProtection && this.detectSQLInjection(stringValue)) {
        threats.push(this.createThreat(
          SecurityThreatType.SQL_INJECTION,
          SecurityThreatLevel.CRITICAL,
          `检测到SQL注入攻击尝试，字段: ${key}`,
          'form_submission',
          form.action,
          stringValue
        ))
        recommendations.push('使用参数化查询，避免SQL注入')
      }

      // 路径遍历检查
      if (this.config.enablePathTraversalProtection && this.detectPathTraversal(stringValue)) {
        threats.push(this.createThreat(
          SecurityThreatType.PATH_TRAVERSAL,
          SecurityThreatLevel.HIGH,
          `检测到路径遍历攻击尝试，字段: ${key}`,
          'form_submission',
          form.action,
          stringValue
        ))
        recommendations.push('验证文件路径，防止路径遍历')
      }
    }

    // CSRF检查
    if (this.config.enableCSRFProtection && !this.validateCSRFToken(form)) {
      threats.push(this.createThreat(
        SecurityThreatType.CSRF,
        SecurityThreatLevel.HIGH,
        'CSRF令牌验证失败',
        'form_submission',
        form.action
      ))
      recommendations.push('实施CSRF令牌验证')
    }

    const result: SecurityCheckResult = {
      isSecure: threats.length === 0,
      threats,
      blocked: threats.length > 0 && this.config.autoBlock,
      recommendations,
    }

    if (result.blocked) {
      this.blockRequest(form.action, 'Security threat detected')
    }

    return result
  }

  // 检查文件上传
  private checkFileUpload(input: HTMLInputElement): SecurityCheckResult {
    const threats: SecurityThreat[] = []
    const recommendations: string[] = []

    if (!input.files || input.files.length === 0) {
      return { isSecure: true, threats: [], blocked: false, recommendations: [] }
    }

    for (const file of input.files) {
      // 检查文件类型
      if (this.isMaliciousFileType(file)) {
        threats.push(this.createThreat(
          SecurityThreatType.FILE_UPLOAD,
          SecurityThreatLevel.CRITICAL,
          `检测到恶意文件类型: ${file.type}`,
          'file_upload',
          input.name,
          file.name
        ))
        recommendations.push('限制允许的文件类型')
      }

      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) { // 10MB
        threats.push(this.createThreat(
          SecurityThreatType.FILE_UPLOAD,
          SecurityThreatLevel.MEDIUM,
          `文件大小超过限制: ${file.size} bytes`,
          'file_upload',
          input.name,
          file.name
        ))
        recommendations.push('限制文件大小')
      }

      // 检查文件名
      if (this.containsMaliciousPattern(file.name)) {
        threats.push(this.createThreat(
          SecurityThreatType.FILE_UPLOAD,
          SecurityThreatLevel.HIGH,
          `文件名包含恶意模式: ${file.name}`,
          'file_upload',
          input.name,
          file.name
        ))
        recommendations.push('验证文件名安全性')
      }
    }

    const result: SecurityCheckResult = {
      isSecure: threats.length === 0,
      threats,
      blocked: threats.length > 0 && this.config.autoBlock,
      recommendations,
    }

    if (result.blocked) {
      this.blockRequest(input.name, 'Malicious file detected')
    }

    return result
  }

  // 检查DOM元素
  private checkDOMElement(element: Element): void {
    // 检查内联脚本
    if (this.config.enableMaliciousScriptProtection) {
      const scripts = element.querySelectorAll('script')
      scripts.forEach((script) => {
        if (script.textContent && this.containsMaliciousScript(script.textContent)) {
          this.handleSecurityThreat(this.createThreat(
            SecurityThreatType.MALICIOUS_SCRIPT,
            SecurityThreatLevel.CRITICAL,
            '检测到恶意脚本注入',
            'dom_mutation',
            element.tagName,
            script.textContent
          ))
        }
      })
    }

    // 检查事件处理器
    const eventAttributes = ['onclick', 'onload', 'onerror', 'onmouseover']
    eventAttributes.forEach((attr) => {
      const value = element.getAttribute(attr)
      if (value && this.containsMaliciousScript(value)) {
        this.handleSecurityThreat(this.createThreat(
          SecurityThreatType.MALICIOUS_SCRIPT,
          SecurityThreatLevel.CRITICAL,
          `检测到恶意事件处理器: ${attr}`,
          'dom_mutation',
          element.tagName,
          value
        ))
      }
    })
  }

  // 检查网络请求
  private checkNetworkRequest(url: string, options: any): SecurityCheckResult {
    const threats: SecurityThreat[] = []
    const recommendations: string[] = []

    // 检查URL安全性
    if (this.isMaliciousURL(url)) {
      threats.push(this.createThreat(
        SecurityThreatType.DATA_LEAKAGE,
        SecurityThreatLevel.HIGH,
        '检测到恶意URL',
        'network_request',
        url
      ))
      recommendations.push('验证URL安全性')
    }

    // 检查请求方法
    if (options.method && ['PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      if (!this.validateRequestAuthorization(options)) {
        threats.push(this.createThreat(
          SecurityThreatType.UNAUTHORIZED_ACCESS,
          SecurityThreatLevel.HIGH,
          '未授权的请求方法',
          'network_request',
          url
        ))
        recommendations.push('实施适当的授权检查')
      }
    }

    const result: SecurityCheckResult = {
      isSecure: threats.length === 0,
      threats,
      blocked: threats.length > 0 && this.config.autoBlock,
      recommendations,
    }

    return result
  }

  // XSS检测
  private detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>/i,
      /<object[^>]*>/i,
      /<embed[^>]*>/i,
      /<link[^>]*>/i,
      /<meta[^>]*>/i,
      /vbscript:/i,
      /data:text\/html/i,
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  // SQL注入检测
  private detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(\b(and|or)\b\s+\d+\s*[=<>])/i,
      /(\b(and|or)\b\s+['"][^'"]*['"]\s*[=<>])/i,
      /(\b(and|or)\b\s+\w+\s*[=<>])/i,
      /(--|\/\*|\*\/)/,
      /(\bxp_cmdshell\b)/i,
      /(\bsp_executesql\b)/i,
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
  }

  // 路径遍历检测
  private detectPathTraversal(input: string): boolean {
    const pathTraversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /\/etc\/passwd/i,
      /\/windows\/system32/i,
      /\/proc\/self/i,
      /\/sys\/kernel/i,
    ]

    return pathTraversalPatterns.some(pattern => pattern.test(input))
  }

  // 恶意文件类型检测
  private isMaliciousFileType(file: File): boolean {
    const dangerousTypes = [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msi',
      'application/x-msdos-program',
      'application/x-msdos-windows',
      'application/x-msi',
      'application/x-msi-installer',
      'application/x-msi-installer',
      'application/x-msi-installer',
    ]

    return dangerousTypes.includes(file.type)
  }

  // 恶意模式检测
  private containsMaliciousPattern(filename: string): boolean {
    const maliciousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|msi|dll|sys|drv|ocx|vb|vbe|wsf|wsh|hta|reg|inf|ini|log|tmp|temp)$/i,
      /(cmd|command|exec|execute|run|system|shell|bash|sh|powershell|ps1|bat|cmd|com|pif|scr|vbs|js|jar|msi|dll|sys|drv|ocx|vb|vbe|wsf|wsh|hta|reg|inf|ini|log|tmp|temp)/i,
    ]

    return maliciousPatterns.some(pattern => pattern.test(filename))
  }

  // 恶意脚本检测
  private containsMaliciousScript(content: string): boolean {
    const maliciousPatterns = [
      /eval\s*\(/i,
      /Function\s*\(/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      /document\.write\s*\(/i,
      /document\.writeln\s*\(/i,
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /insertAdjacentHTML\s*\(/i,
      /<script[^>]*>.*?<\/script>/i,
    ]

    return maliciousPatterns.some(pattern => pattern.test(content))
  }

  // 恶意URL检测
  private isMaliciousURL(url: string): boolean {
    try {
      const urlObj = typeof window === 'undefined'
        ? new URL(url)
        : new URL(url, window.location.href)
      
      // 检查协议
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return true
      }

      // 同源请求可能使用相对路径，本地开发地址也应被允许
      if (typeof window !== 'undefined' && urlObj.origin === window.location.origin) {
        return false
      }

      // 检查本地地址
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return true
      }

      // 检查私有IP地址
      const privateIPPatterns = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
      ]

      if (privateIPPatterns.some(pattern => pattern.test(urlObj.hostname))) {
        return true
      }

      return false
    } catch {
      return true
    }
  }

  // CSRF令牌验证
  private validateCSRFToken(form: HTMLFormElement): boolean {
    const token = form.querySelector('input[name="_csrf"]') as HTMLInputElement
    if (!token) {
      return false
    }

    // 这里应该验证令牌的有效性
    // 在实际应用中，需要与服务器端验证
    return token.value.length > 0
  }

  // 请求授权验证
  private validateRequestAuthorization(options: any): boolean {
    // 检查认证头
    if (options.headers && options.headers.Authorization) {
      return true
    }

    // 检查认证状态
    // 这里应该检查用户是否已登录
    return false
  }

  // 创建安全威胁
  private createThreat(
    type: SecurityThreatType,
    level: SecurityThreatLevel,
    description: string,
    source: string,
    target: string,
    payload?: string
  ): SecurityThreat {
    return {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      level,
      description,
      timestamp: new Date(),
      source,
      target,
      payload,
    }
  }

  // 处理安全威胁
  private handleSecurityThreat(threat: SecurityThreat): void {
    // 记录威胁
    this.threats.push(threat)

    // 记录日志
    if (this.config.logThreats) {
      logger.warn('Security threat detected', { threat })
    }

    // 自动阻止
    if (this.config.autoBlock) {
      this.blockRequest(threat.target, threat.description)
    }

    // 通知管理员
    if (this.config.notifyAdmin) {
      this.notifyAdmin(threat)
    }

    // 触发事件
    window.dispatchEvent(new CustomEvent('securityThreat', {
      detail: { threat, timestamp: new Date().toISOString() }
    }))
  }

  // 阻止请求
  private blockRequest(target: string, reason: string): void {
    const clientIP = this.getClientIP()
    if (clientIP) {
      this.blockedIPs.set(clientIP, {
        reason,
        until: Date.now() + this.config.blockDuration,
      })
    }

    logger.warn('Request blocked', { target, reason, clientIP })
  }

  // 获取客户端IP
  private getClientIP(): string | null {
    // 在实际应用中，这应该从服务器端获取
    // 这里返回一个模拟值
    return '127.0.0.1'
  }

  // 通知管理员
  private notifyAdmin(threat: SecurityThreat): void {
    // 这里可以集成到通知系统
    // 例如：发送邮件、Slack消息、短信等
    logger.info('Admin notification sent', { threat })
  }

  // 开始定期清理
  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupExpiredBlocks()
      this.cleanupOldThreats()
    }, 60000) // 每分钟清理一次
  }

  // 清理过期的阻止记录
  private cleanupExpiredBlocks(): void {
    const now = Date.now()
    for (const [ip, blockInfo] of this.blockedIPs.entries()) {
      if (now > blockInfo.until) {
        this.blockedIPs.delete(ip)
      }
    }
  }

  // 清理旧的威胁记录
  private cleanupOldThreats(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    this.threats = this.threats.filter(threat => threat.timestamp.getTime() > oneDayAgo)
  }

  // 检查IP是否被阻止
  isIPBlocked(ip: string): boolean {
    const blockInfo = this.blockedIPs.get(ip)
    if (!blockInfo) return false

    if (Date.now() > blockInfo.until) {
      this.blockedIPs.delete(ip)
      return false
    }

    return true
  }

  // 获取安全报告
  getSecurityReport(): any {
    return {
      timestamp: new Date().toISOString(),
      threats: this.threats,
      blockedIPs: Array.from(this.blockedIPs.entries()),
      failedAttempts: Array.from(this.failedAttempts.entries()),
      summary: {
        totalThreats: this.threats.length,
        blockedIPs: this.blockedIPs.size,
        threatLevels: this.getThreatLevels(),
        recommendations: this.generateSecurityRecommendations(),
      },
    }
  }

  // 获取威胁级别统计
  private getThreatLevels(): Record<SecurityThreatLevel, number> {
    const levels = Object.values(SecurityThreatLevel)
    const result: Record<SecurityThreatLevel, number> = {} as any

    levels.forEach(level => {
      result[level] = this.threats.filter(threat => threat.level === level).length
    })

    return result
  }

  // 生成安全建议
  private generateSecurityRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.threats.some(t => t.type === SecurityThreatType.XSS)) {
      recommendations.push('实施输入验证和输出编码，防止XSS攻击')
    }

    if (this.threats.some(t => t.type === SecurityThreatType.SQL_INJECTION)) {
      recommendations.push('使用参数化查询和ORM，防止SQL注入')
    }

    if (this.threats.some(t => t.type === SecurityThreatType.CSRF)) {
      recommendations.push('实施CSRF令牌验证')
    }

    if (this.threats.some(t => t.type === SecurityThreatType.FILE_UPLOAD)) {
      recommendations.push('限制文件类型和大小，验证文件内容')
    }

    if (this.blockedIPs.size > 10) {
      recommendations.push('检查是否有DDoS攻击，考虑增加防护措施')
    }

    return recommendations
  }

  // 更新配置
  updateConfig(config: Partial<SecurityCheckConfig>): void {
    this.config = { ...this.config, ...config }
    logger.info('Security config updated', { config: this.config })
  }

  // 获取配置
  getConfig(): SecurityCheckConfig {
    return { ...this.config }
  }

  // 启用/禁用安全检查
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    if (enabled && !this.isInitialized) {
      this.initialize()
    }
    logger.info('Security checks', { enabled })
  }

  // 清理资源
  destroy(): void {
    this.isInitialized = false
    logger.info('Security service destroyed')
  }
}

export const securityService = SecurityService.getInstance()
export { SecurityService }
