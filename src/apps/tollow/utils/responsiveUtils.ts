// @ts-nocheck
/* eslint-disable */
/**
 * 响应式设计和移动端优化工具
 */
export class ResponsiveUtils {
  /**
   * 检测设备类型
   */
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  /**
   * 检测是否为触摸设备
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  /**
   * 检测是否为移动设备
   */
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * 检测是否为iOS设备
   */
  static isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  /**
   * 检测是否为Android设备
   */
  static isAndroidDevice(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  /**
   * 获取屏幕方向
   */
  static getScreenOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  }

  /**
   * 检测是否为高分辨率屏幕
   */
  static isHighDPIScreen(): boolean {
    return window.devicePixelRatio > 1
  }

  /**
   * 获取视口尺寸
   */
  static getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  /**
   * 检测是否为小屏幕
   */
  static isSmallScreen(): boolean {
    return window.innerWidth < 768
  }

  /**
   * 检测是否为中等屏幕
   */
  static isMediumScreen(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  }

  /**
   * 检测是否为大屏幕
   */
  static isLargeScreen(): boolean {
    return window.innerWidth >= 1024
  }

  /**
   * 获取CSS断点类名
   */
  static getBreakpointClass(): string {
    const width = window.innerWidth
    
    if (width < 640) return 'sm'
    if (width < 768) return 'md'
    if (width < 1024) return 'lg'
    if (width < 1280) return 'xl'
    return '2xl'
  }

  /**
   * 检测是否支持特定CSS特性
   */
  static supportsCSSFeature(feature: string): boolean {
    const testEl = document.createElement('div')
    
    switch (feature) {
      case 'grid':
        return CSS.supports('display', 'grid')
      case 'flexbox':
        return CSS.supports('display', 'flex')
      case 'css-variables':
        return CSS.supports('--custom-property', 'value')
      case 'css-transforms':
        return CSS.supports('transform', 'translateX(0)')
      case 'css-animations':
        return CSS.supports('animation', 'name 1s')
      default:
        return false
    }
  }

  /**
   * 检测是否支持特定Web API
   */
  static supportsWebAPI(api: string): boolean {
    switch (api) {
      case 'localStorage':
        return typeof Storage !== 'undefined'
      case 'sessionStorage':
        return typeof sessionStorage !== 'undefined'
      case 'geolocation':
        return 'geolocation' in navigator
      case 'serviceWorker':
        return 'serviceWorker' in navigator
      case 'pushManager':
        return 'PushManager' in window
      case 'notifications':
        return 'Notification' in window
      case 'webGL':
        try {
          const canvas = document.createElement('canvas')
          return !!(window.WebGLRenderingContext && canvas.getContext('webgl'))
        } catch {
          return false
        }
      default:
        return false
    }
  }

  /**
   * 获取设备像素比
   */
  static getDevicePixelRatio(): number {
    return window.devicePixelRatio || 1
  }

  /**
   * 检测是否为低端设备
   */
  static isLowEndDevice(): boolean {
    // 简单的性能检测
    const start = performance.now()
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i)
    }
    const end = performance.now()
    
    return (end - start) > 50 // 如果计算时间超过50ms，认为是低端设备
  }

  /**
   * 获取网络信息
   */
  static getNetworkInfo(): { effectiveType: string; downlink: number; rtt: number } {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      }
    }
    
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    }
  }

  /**
   * 检测是否为慢速网络
   */
  static isSlowNetwork(): boolean {
    const networkInfo = this.getNetworkInfo()
    return networkInfo.effectiveType === 'slow-2g' || 
           networkInfo.effectiveType === '2g' || 
           networkInfo.downlink < 1
  }

  /**
   * 获取触摸支持信息
   */
  static getTouchSupport(): {
    maxTouchPoints: number
    touchEvent: boolean
    touchStart: boolean
  } {
    return {
      maxTouchPoints: navigator.maxTouchPoints || 0,
      touchEvent: 'ontouchstart' in window,
      touchStart: 'ontouchstart' in window
    }
  }

  /**
   * 检测是否支持手势
   */
  static supportsGestures(): boolean {
    return 'ongesturestart' in window || 
           'ontouchstart' in window || 
           navigator.maxTouchPoints > 0
  }

  /**
   * 获取设备内存信息
   */
  static getDeviceMemory(): number | null {
    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory
    }
    return null
  }

  /**
   * 检测是否为低内存设备
   */
  static isLowMemoryDevice(): boolean {
    const memory = this.getDeviceMemory()
    return memory !== null && memory < 4 // 小于4GB内存
  }

  /**
   * 获取硬件并发数
   */
  static getHardwareConcurrency(): number | null {
    if ('hardwareConcurrency' in navigator) {
      return (navigator as any).hardwareConcurrency
    }
    return null
  }

  /**
   * 检测是否为单核设备
   */
  static isSingleCoreDevice(): boolean {
    const cores = this.getHardwareConcurrency()
    return cores !== null && cores <= 1
  }
}
