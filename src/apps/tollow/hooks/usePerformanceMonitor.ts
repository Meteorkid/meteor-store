// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useCallback } from 'react'
import { logger } from '../utils/logger'

export interface PerformanceMetrics {
  renderTime: number
  mountTime: number
  updateCount: number
  lastUpdateTime: number
  memoryUsage?: {
    used: number
    total: number
    limit: number
  }
}

export interface PerformanceThresholds {
  renderTime: number // 毫秒
  memoryUsage: number // 百分比
  updateFrequency: number // 毫秒
}

export const usePerformanceMonitor = (
  componentName: string,
  thresholds: Partial<PerformanceThresholds> = {}
) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdateTime: 0,
  })
  
  const startTimeRef = useRef<number>(0)
  const mountTimeRef = useRef<number>(0)
  
  const defaultThresholds: PerformanceThresholds = {
    renderTime: 16, // 60fps的目标
    memoryUsage: 80, // 内存使用率阈值
    updateFrequency: 100, // 更新频率阈值
    ...thresholds,
  }
  
  // 开始性能测量
  const startMeasurement = useCallback(() => {
    startTimeRef.current = performance.now()
  }, [])
  
  // 结束性能测量
  const endMeasurement = useCallback(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTimeRef.current
    
    metricsRef.current.renderTime = renderTime
    metricsRef.current.updateCount += 1
    metricsRef.current.lastUpdateTime = Date.now()
    
    // 检查性能阈值
    if (renderTime > defaultThresholds.renderTime) {
      logger.warn(`组件 ${componentName} 渲染时间过长: ${renderTime.toFixed(2)}ms`, {
        componentName,
        renderTime,
        threshold: defaultThresholds.renderTime,
      })
    }
    
    // 记录性能指标
    logger.debug(`组件 ${componentName} 性能指标`, {
      componentName,
      renderTime,
      updateCount: metricsRef.current.updateCount,
    })
  }, [componentName, defaultThresholds.renderTime])
  
  // 获取内存使用情况
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const used = memory.usedJSHeapSize
      const total = memory.totalJSHeapSize
      const limit = memory.jsHeapSizeLimit
      const usagePercentage = (used / limit) * 100
      
      metricsRef.current.memoryUsage = { used, total, limit }
      
      // 检查内存使用阈值
      if (usagePercentage > defaultThresholds.memoryUsage) {
        logger.warn(`内存使用率过高: ${usagePercentage.toFixed(2)}%`, {
          componentName,
          usagePercentage,
          threshold: defaultThresholds.memoryUsage,
          memory: { used, total, limit },
        })
      }
      
      return { used, total, limit, usagePercentage }
    }
    return null
  }, [componentName, defaultThresholds.memoryUsage])
  
  // 获取网络信息
  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      }
    }
    return null
  }, [])
  
  // 监控长任务
  const monitorLongTasks = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask' && entry.duration > 50) {
              logger.warn(`检测到长任务: ${entry.name}`, {
                componentName,
                taskName: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
              })
            }
          })
        })
        
        observer.observe({ entryTypes: ['longtask'] })
        return observer
      } catch (error) {
        logger.warn('长任务监控不可用', { componentName, error })
      }
    }
    return null
  }, [componentName])
  
  // 监控资源加载
  const monitorResourceLoading = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              if (resourceEntry.duration > 1000) {
                logger.warn(`资源加载缓慢: ${resourceEntry.name}`, {
                  componentName,
                  resourceName: resourceEntry.name,
                  duration: resourceEntry.duration,
                  size: resourceEntry.transferSize,
                })
              }
            }
          })
        })
        
        observer.observe({ entryTypes: ['resource'] })
        return observer
      } catch (error) {
        logger.warn('资源监控不可用', { componentName, error })
      }
    }
    return null
  }, [componentName])
  
  // 获取性能指标
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current }
  }, [])
  
  // 重置性能指标
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderTime: 0,
      mountTime: 0,
      updateCount: 0,
      lastUpdateTime: 0,
    }
  }, [])
  
  // 导出性能报告
  const exportReport = useCallback(() => {
    const metrics = getMetrics()
    const memoryUsage = getMemoryUsage()
    const networkInfo = getNetworkInfo()
    
    const report = {
      componentName,
      timestamp: new Date().toISOString(),
      metrics,
      memoryUsage,
      networkInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
    
    logger.info(`性能报告: ${componentName}`, report)
    return report
  }, [componentName, getMetrics, getMemoryUsage, getNetworkInfo])
  
  // 组件挂载时
  useEffect(() => {
    mountTimeRef.current = performance.now()
    metricsRef.current.mountTime = mountTimeRef.current
    
    // 启动监控
    const longTaskObserver = monitorLongTasks()
    const resourceObserver = monitorResourceLoading()
    
    // 记录挂载时间
    logger.info(`组件 ${componentName} 挂载`, {
      componentName,
      mountTime: metricsRef.current.mountTime,
    })
    
    return () => {
      // 清理监控器
      longTaskObserver?.disconnect()
      resourceObserver?.disconnect()
      
      // 记录卸载
      const totalLifetime = performance.now() - mountTimeRef.current
      logger.info(`组件 ${componentName} 卸载`, {
        componentName,
        totalLifetime,
        totalUpdates: metricsRef.current.updateCount,
      })
    }
  }, [componentName, monitorLongTasks, monitorResourceLoading])
  
  // 每次渲染时
  useEffect(() => {
    startMeasurement()
    
    // 使用requestAnimationFrame确保在下一帧测量
    const rafId = requestAnimationFrame(() => {
      endMeasurement()
    })
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  })
  
  return {
    startMeasurement,
    endMeasurement,
    getMetrics,
    resetMetrics,
    getMemoryUsage,
    getNetworkInfo,
    exportReport,
    metrics: metricsRef.current,
  }
}
