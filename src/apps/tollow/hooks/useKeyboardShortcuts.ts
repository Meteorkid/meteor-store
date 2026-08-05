// @ts-nocheck
/* eslint-disable */
import { useEffect, useCallback } from 'react'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
}

interface UseKeyboardShortcutsOptions {
  enableInInput?: boolean
  preventDefault?: boolean
}

export const useKeyboardShortcuts = (
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enableInInput = false, preventDefault = true } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 检查是否在输入框中
      const target = event.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true'
      
      if (isInput && !enableInInput) {
        return
      }

      // 查找匹配的快捷键
      const matchedShortcut = shortcuts.find(shortcut => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey
        const shiftMatch = !!shortcut.shift === event.shiftKey
        const altMatch = !!shortcut.alt === event.altKey
        const metaMatch = !!shortcut.meta === event.metaKey

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
      })

      if (matchedShortcut) {
        if (preventDefault) {
          event.preventDefault()
        }
        
        try {
          matchedShortcut.action()
        } catch (error) {
          console.error('快捷键执行失败:', error)
        }
      }
    },
    [shortcuts, enableInInput, preventDefault]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // 返回快捷键帮助信息
  const getShortcutsHelp = useCallback(() => {
    return shortcuts.map(shortcut => {
      const modifiers = []
      if (shortcut.ctrl) modifiers.push('Ctrl')
      if (shortcut.shift) modifiers.push('Shift')
      if (shortcut.alt) modifiers.push('Alt')
      if (shortcut.meta) modifiers.push('⌘')
      
      const keyCombo = [...modifiers, shortcut.key.toUpperCase()].join('+')
      
      return {
        key: keyCombo,
        description: shortcut.description
      }
    })
  }, [shortcuts])

  return { getShortcutsHelp }
}

// 预定义的快捷键组合
export const SHORTCUTS = {
  // 通用快捷键
  SAVE: { key: 's', ctrl: true, description: '保存' },
  OPEN: { key: 'o', ctrl: true, description: '打开' },
  NEW: { key: 'n', ctrl: true, description: '新建' },
  PRINT: { key: 'p', ctrl: true, description: '打印' },
  
  // 编辑快捷键
  UNDO: { key: 'z', ctrl: true, description: '撤销' },
  REDO: { key: 'y', ctrl: true, description: '重做' },
  CUT: { key: 'x', ctrl: true, description: '剪切' },
  COPY: { key: 'c', ctrl: true, description: '复制' },
  PASTE: { key: 'v', ctrl: true, description: '粘贴' },
  SELECT_ALL: { key: 'a', ctrl: true, description: '全选' },
  
  // 导航快捷键
  FIND: { key: 'f', ctrl: true, description: '查找' },
  FIND_REPLACE: { key: 'h', ctrl: true, description: '查找替换' },
  GO_TO: { key: 'g', ctrl: true, description: '跳转' },
  
  // 应用特定快捷键
  START_TYPING: { key: 'Enter', description: '开始打字练习' },
  PAUSE_TYPING: { key: 'Space', description: '暂停/继续打字' },
  RESTART_TYPING: { key: 'r', ctrl: true, description: '重新开始打字' },
  NEXT_TEXT: { key: 'ArrowRight', description: '下一个文本' },
  PREV_TEXT: { key: 'ArrowLeft', description: '上一个文本' },
  
  // 帮助快捷键
  HELP: { key: 'F1', description: '显示帮助' },
  SHORTCUTS: { key: 'F2', description: '显示快捷键' },
  
  // 视图快捷键
  FULLSCREEN: { key: 'F11', description: '全屏切换' },
  ZOOM_IN: { key: '=', ctrl: true, description: '放大' },
  ZOOM_OUT: { key: '-', ctrl: true, description: '缩小' },
  ZOOM_RESET: { key: '0', ctrl: true, description: '重置缩放' }
} as const
