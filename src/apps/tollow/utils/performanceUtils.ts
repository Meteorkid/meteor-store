// @ts-nocheck
/* eslint-disable */
/**
 * 性能优化工具
 */
export class PerformanceUtils {
  /**
   * 代码分割工具
   */
  static async lazyLoad<T>(importFn: () => Promise<T>): Promise<T> {
    try {
      const start = performance.now()
      const result = await importFn()
      const end = performance.now()
      
      if (end - start > 100) {
        console.warn(`懒加载耗时较长: ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      console.error('懒加载失败:', error)
      throw error
    }
  }

  /**
   * 防抖函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      
      const callNow = immediate && !timeout
      
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      
      if (callNow) func(...args)
    }
  }

  /**
   * 节流函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * 虚拟化渲染工具
   */
  static createVirtualList<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    overscan: number = 5
  ) {
    const totalHeight = items.length * itemHeight
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    
    return {
      getVisibleRange(scrollTop: number) {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
        const endIndex = Math.min(
          items.length - 1,
          Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        )
        
        return {
          startIndex,
          endIndex,
          visibleItems: items.slice(startIndex, endIndex + 1),
          offsetY: startIndex * itemHeight
        }
      },
      
      getTotalHeight() {
        return totalHeight
      },
      
      getItemHeight() {
        return itemHeight
      }
    }
  }

  /**
   * 图片懒加载
   */
  static createImageLazyLoader(
    selector: string = 'img[data-src]',
    rootMargin: string = '50px'
  ) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      },
      { rootMargin }
    )
    
    const images = document.querySelectorAll(selector)
    images.forEach(img => imageObserver.observe(img))
    
    return imageObserver
  }

  /**
   * 组件懒加载
   */
  static createComponentLazyLoader<T>(
    importFn: () => Promise<T>,
    fallback?: React.ComponentType
  ) {
    return React.lazy(importFn)
  }

  /**
   * 性能监控
   */
  static createPerformanceMonitor() {
    const metrics: Record<string, number[]> = {}
    
    return {
      startTimer(name: string) {
        const start = performance.now()
        return () => {
          const end = performance.now()
          const duration = end - start
          
          if (!metrics[name]) {
            metrics[name] = []
          }
          metrics[name].push(duration)
          
          // 只保留最近100次记录
          if (metrics[name].length > 100) {
            metrics[name] = metrics[name].slice(-100)
          }
        }
      },
      
      getMetrics(name: string) {
        const values = metrics[name] || []
        if (values.length === 0) return null
        
        const sorted = [...values].sort((a, b) => a - b)
        const sum = values.reduce((a, b) => a + b, 0)
        
        return {
          count: values.length,
          average: sum / values.length,
          min: sorted[0],
          max: sorted[sorted.length - 1],
          median: sorted[Math.floor(sorted.length / 2)],
          p95: sorted[Math.floor(sorted.length * 0.95)],
          p99: sorted[Math.floor(sorted.length * 0.99)]
        }
      },
      
      getAllMetrics() {
        return Object.keys(metrics).reduce((acc, name) => {
          acc[name] = this.getMetrics(name)
          return acc
        }, {} as Record<string, any>)
      },
      
      clearMetrics(name?: string) {
        if (name) {
          delete metrics[name]
        } else {
          Object.keys(metrics).forEach(key => delete metrics[key])
        }
      }
    }
  }

  /**
   * 内存使用监控
   */
  static getMemoryUsage(): {
    used: number
    total: number
    limit: number
    percentage: number
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    return null
  }

  /**
   * 网络状态监控
   */
  static getNetworkInfo(): {
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
  } | null {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      }
    }
    return null
  }

  /**
   * 长任务检测
   */
  static createLongTaskDetector(threshold: number = 50) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > threshold) {
          console.warn(`检测到长任务: ${entry.name}, 耗时: ${entry.duration.toFixed(2)}ms`)
        }
      })
    })
    
    try {
      observer.observe({ entryTypes: ['longtask'] })
      return observer
    } catch (error) {
      console.warn('长任务检测不可用:', error)
      return null
    }
  }

  /**
   * 资源加载监控
   */
  static createResourceMonitor() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.duration > 1000) {
            console.warn(`资源加载缓慢: ${resourceEntry.name}, 耗时: ${resourceEntry.duration.toFixed(2)}ms`)
          }
        }
      })
    })
    
    try {
      observer.observe({ entryTypes: ['resource'] })
      return observer
    } catch (error) {
      console.warn('资源监控不可用:', error)
      return null
    }
  }

  /**
   * 缓存策略
   */
  static createCacheStrategy(
    cacheName: string,
    urls: string[],
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate'
  ) {
    return {
      async handleRequest(request: Request): Promise<Response> {
        const cache = await caches.open(cacheName)
        
        switch (strategy) {
          case 'cache-first':
            const cachedResponse = await cache.match(request)
            if (cachedResponse) {
              return cachedResponse
            }
            const networkResponse = await fetch(request)
            await cache.put(request, networkResponse.clone())
            return networkResponse
            
          case 'network-first':
            try {
              const networkResponse = await fetch(request)
              await cache.put(request, networkResponse.clone())
              return networkResponse
            } catch {
              const cachedResponse = await cache.match(request)
              if (cachedResponse) {
                return cachedResponse
              }
              throw new Error('网络请求失败且无缓存')
            }
            
          case 'stale-while-revalidate':
            const cachedResponse = await cache.match(request)
            const networkPromise = fetch(request).then(async (response) => {
              await cache.put(request, response.clone())
              return response
            })
            
            if (cachedResponse) {
              return cachedResponse
            }
            return networkPromise
            
          default:
            throw new Error(`不支持的缓存策略: ${strategy}`)
        }
      }
    }
  }
}
