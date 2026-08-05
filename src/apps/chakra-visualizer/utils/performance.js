// @ts-nocheck
/* eslint-disable */
/**
 * 性能优化工具模块
 * 包含对象池、脏区域检测、帧率监控等
 */

/**
 * 创建对象池
 * @param {Function} factory - 创建新对象的工厂函数
 * @param {Function} reset - 重置对象的函数
 * @param {number} initialSize - 初始池大小
 * @returns {Object} 对象池 API
 */
export function createObjectPool(factory, reset, initialSize = 100) {
  const pool = [];
  const active = new Set();

  // 预填充对象池
  for (let i = 0; i < initialSize; i++) {
    pool.push(factory());
  }

  /**
   * 从池中获取对象
   */
  function acquire() {
    let obj = pool.pop();
    if (!obj) {
      obj = factory();
    }
    active.add(obj);
    return obj;
  }

  /**
   * 归还对象到池中
   */
  function release(obj) {
    if (active.has(obj)) {
      active.delete(obj);
      reset(obj);
      pool.push(obj);
    }
  }

  /**
   * 获取当前统计
   */
  function getStats() {
    return {
      poolSize: pool.length,
      activeCount: active.size,
      totalCreated: pool.length + active.size,
    };
  }

  /**
   * 清空对象池
   */
  function clear() {
    pool.length = 0;
    active.clear();
  }

  return {
    acquire,
    release,
    getStats,
    clear,
  };
}

/**
 * 创建脏区域检测器
 * 用于优化 Canvas 渲染，只重绘变化的区域
 */
export function createDirtyRegionDetector() {
  const dirtyRegions = [];
  let fullRedraw = true;

  /**
   * 标记脏区域
   */
  function markDirty(x, y, width, height) {
    dirtyRegions.push({ x, y, width, height });
    fullRedraw = false;
  }

  /**
   * 标记全屏需要重绘
   */
  function markFullRedraw() {
    fullRedraw = true;
    dirtyRegions.length = 0;
  }

  /**
   * 获取需要重绘的区域
   * @returns {Array} 脏区域列表，如果需要全屏重绘则返回 null
   */
  function getDirtyRegions() {
    if (fullRedraw) return null;

    // 合并重叠的区域
    if (dirtyRegions.length === 0) return [];

    // 简化实现：如果有多个区域，返回 null（全屏重绘）
    if (dirtyRegions.length > 5) return null;

    return [...dirtyRegions];
  }

  /**
   * 清除脏区域标记
   */
  function clear() {
    dirtyRegions.length = 0;
    fullRedraw = true;
  }

  return {
    markDirty,
    markFullRedraw,
    getDirtyRegions,
    clear,
  };
}

/**
 * 创建帧率监控器
 */
export function createFPSMonitor(sampleSize = 60) {
  const samples = [];
  let lastTime = performance.now();

  /**
   * 更新帧率计算
   * @returns {number} 当前 FPS
   */
  function update() {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    samples.push(delta);
    if (samples.length > sampleSize) {
      samples.shift();
    }

    return getFPS();
  }

  /**
   * 获取当前 FPS
   */
  function getFPS() {
    if (samples.length === 0) return 0;

    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    return Math.round(1000 / avg);
  }

  /**
   * 获取性能统计
   */
  function getStats() {
    if (samples.length === 0) {
      return { fps: 0, avgFrameTime: 0, minFrameTime: 0, maxFrameTime: 0 };
    }

    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const min = Math.min(...samples);
    const max = Math.max(...samples);

    return {
      fps: Math.round(1000 / avg),
      avgFrameTime: Math.round(avg * 100) / 100,
      minFrameTime: Math.round(min * 100) / 100,
      maxFrameTime: Math.round(max * 100) / 100,
    };
  }

  return {
    update,
    getFPS,
    getStats,
  };
}

/**
 * 创建内存监控器
 */
export function createMemoryMonitor() {
  /**
   * 获取当前内存使用情况
   */
  function getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
        totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
      };
    }
    return null;
  }

  /**
   * 检查内存是否超过阈值
   * @param {number} thresholdMB - 阈值（MB）
   */
  function isMemoryHigh(thresholdMB = 100) {
    const usage = getMemoryUsage();
    if (!usage) return false;
    return usage.usedMB > thresholdMB;
  }

  return {
    getMemoryUsage,
    isMemoryHigh,
  };
}

/**
 * 创建 Canvas 渲染优化器
 * 减少 save()/restore() 调用，批量设置样式
 */
export function createCanvasOptimizer(ctx) {
  let currentFillStyle = null;
  let currentStrokeStyle = null;
  let currentLineWidth = null;
  let currentFont = null;
  let currentTextAlign = null;

  /**
   * 设置填充样式（带缓存）
   */
  function setFillStyle(style) {
    if (currentFillStyle !== style) {
      ctx.fillStyle = style;
      currentFillStyle = style;
    }
  }

  /**
   * 设置描边样式（带缓存）
   */
  function setStrokeStyle(style) {
    if (currentStrokeStyle !== style) {
      ctx.strokeStyle = style;
      currentStrokeStyle = style;
    }
  }

  /**
   * 设置线宽（带缓存）
   */
  function setLineWidth(width) {
    if (currentLineWidth !== width) {
      ctx.lineWidth = width;
      currentLineWidth = width;
    }
  }

  /**
   * 设置字体（带缓存）
   */
  function setFont(font) {
    if (currentFont !== font) {
      ctx.font = font;
      currentFont = font;
    }
  }

  /**
   * 设置文本对齐（带缓存）
   */
  function setTextAlign(align) {
    if (currentTextAlign !== align) {
      ctx.textAlign = align;
      currentTextAlign = align;
    }
  }

  /**
   * 重置缓存（当 ctx 状态被外部修改时调用）
   */
  function resetCache() {
    currentFillStyle = null;
    currentStrokeStyle = null;
    currentLineWidth = null;
    currentFont = null;
    currentTextAlign = null;
  }

  return {
    setFillStyle,
    setStrokeStyle,
    setLineWidth,
    setFont,
    setTextAlign,
    resetCache,
  };
}

/**
 * 创建事件监听器管理器
 * 自动清理事件监听器，防止内存泄漏
 */
export function createEventManager() {
  const listeners = new Map();

  /**
   * 添加事件监听器
   */
  function on(element, event, handler, options) {
    element.addEventListener(event, handler, options);

    if (!listeners.has(element)) {
      listeners.set(element, []);
    }
    listeners.get(element).push({ event, handler, options });
  }

  /**
   * 移除事件监听器
   */
  function off(element, event, handler) {
    element.removeEventListener(event, handler);

    const elementListeners = listeners.get(element);
    if (elementListeners) {
      const index = elementListeners.findIndex(
        l => l.event === event && l.handler === handler
      );
      if (index !== -1) {
        elementListeners.splice(index, 1);
      }
    }
  }

  /**
   * 清理所有事件监听器
   */
  function cleanup() {
    for (const [element, elementListeners] of listeners) {
      for (const { event, handler } of elementListeners) {
        element.removeEventListener(event, handler);
      }
    }
    listeners.clear();
  }

  /**
   * 获取监听器统计
   */
  function getStats() {
    let total = 0;
    for (const elementListeners of listeners.values()) {
      total += elementListeners.length;
    }
    return {
      elementCount: listeners.size,
      listenerCount: total,
    };
  }

  return {
    on,
    off,
    cleanup,
    getStats,
  };
}

/**
 * 创建定时器管理器
 * 自动清理定时器，防止内存泄漏
 */
export function createTimerManager() {
  const timers = new Set();
  const intervals = new Set();

  /**
   * 创建 setTimeout
   */
  function setTimeout(fn, delay) {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, delay);
    timers.add(id);
    return id;
  }

  /**
   * 清除 setTimeout
   */
  function clearTimeout(id) {
    window.clearTimeout(id);
    timers.delete(id);
  }

  /**
   * 创建 setInterval
   */
  function setInterval(fn, delay) {
    const id = window.setInterval(fn, delay);
    intervals.add(id);
    return id;
  }

  /**
   * 清除 setInterval
   */
  function clearInterval(id) {
    window.clearInterval(id);
    intervals.delete(id);
  }

  /**
   * 清理所有定时器
   */
  function cleanup() {
    for (const id of timers) {
      window.clearTimeout(id);
    }
    for (const id of intervals) {
      window.clearInterval(id);
    }
    timers.clear();
    intervals.clear();
  }

  return {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    cleanup,
  };
}
