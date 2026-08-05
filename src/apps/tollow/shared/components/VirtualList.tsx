// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'

export interface VirtualListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  onVisibleRangeChange,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 性能监控
  usePerformanceMonitor('VirtualList')
  
  // 计算可见范围
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, height, itemHeight, overscan, items.length])
  
  // 计算总高度和偏移量
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  // 处理滚动事件
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])
  
  // 滚动到指定索引
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight
      containerRef.current.scrollTop = scrollTop
      setScrollTop(scrollTop)
    }
  }, [itemHeight])
  
  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    scrollToIndex(0)
  }, [scrollToIndex])
  
  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1)
  }, [scrollToIndex, items.length])
  
  // 通知可见范围变化
  useEffect(() => {
    onVisibleRangeChange?.(visibleRange.startIndex, visibleRange.endIndex)
  }, [visibleRange.startIndex, visibleRange.endIndex, onVisibleRangeChange])
  
  // 渲染可见项目
  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.startIndex, visibleRange.endIndex + 1)
      .map((item, index) => {
        const actualIndex = visibleRange.startIndex + index
        return (
          <div
            key={actualIndex}
            style={{
              position: 'absolute',
              top: actualIndex * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, actualIndex)}
          </div>
        )
      })
  }, [items, visibleRange, itemHeight, renderItem])
  
  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  )
}

// 虚拟滚动Hook
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange.startIndex, visibleRange.endIndex])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  const scrollToIndex = useCallback((index: number) => {
    const newScrollTop = index * itemHeight
    setScrollTop(newScrollTop)
    return newScrollTop
  }, [itemHeight])
  
  return {
    scrollTop,
    setScrollTop,
    visibleRange,
    visibleItems,
    totalHeight,
    offsetY,
    scrollToIndex,
  }
}

// 虚拟滚动性能优化版本
export function OptimizedVirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  onVisibleRangeChange,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  
  // 性能监控
  usePerformanceMonitor('OptimizedVirtualList')
  
  // 节流滚动处理
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    rafRef.current = requestAnimationFrame(() => {
      const newScrollTop = event.currentTarget.scrollTop
      setScrollTop(newScrollTop)
      onScroll?.(newScrollTop)
    })
  }, [onScroll])
  
  // 清理RAF
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])
  
  // 计算可见范围
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, height, itemHeight, overscan, items.length])
  
  // 计算总高度和偏移量
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  // 通知可见范围变化
  useEffect(() => {
    onVisibleRangeChange?.(visibleRange.startIndex, visibleRange.endIndex)
  }, [visibleRange.startIndex, visibleRange.endIndex, onVisibleRangeChange])
  
  // 渲染可见项目（使用React.memo优化）
  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.startIndex, visibleRange.endIndex + 1)
      .map((item, index) => {
        const actualIndex = visibleRange.startIndex + index
        return (
          <VirtualListItem
            key={actualIndex}
            item={item}
            index={actualIndex}
            itemHeight={itemHeight}
            renderItem={renderItem}
          />
        )
      })
  }, [items, visibleRange, itemHeight, renderItem])
  
  return (
    <div
      ref={containerRef}
      className={`optimized-virtual-list ${className}`}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  )
}

// 虚拟列表项组件（使用React.memo优化）
const VirtualListItem = React.memo<{
  item: any
  index: number
  itemHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
}>(({ item, index, itemHeight, renderItem }) => (
  <div
    style={{
      position: 'absolute',
      top: index * itemHeight,
      height: itemHeight,
      width: '100%',
    }}
  >
    {renderItem(item, index)}
  </div>
))

VirtualListItem.displayName = 'VirtualListItem'
