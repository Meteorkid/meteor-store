// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef } from 'react'
import Canvas3D from './components/Canvas3D'
import Sidebar from './components/Sidebar'
import InfoPanel from './components/InfoPanel'
import QuizPanel from './components/QuizPanel'
import useStore from './store/useStore'
import { getRandomBoneId } from './data/boneData'
import './App.css'

export default function App({ locale = 'zh' }) {
  const isZh = locale !== 'en'
  const quizMode = useStore((s) => s.quizMode)
  const startQuiz = useStore((s) => s.startQuiz)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const infoPanelOpen = useStore((s) => s.infoPanelOpen)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const toggleInfoPanel = useStore((s) => s.toggleInfoPanel)
  const closePanels = useStore((s) => s.closePanels)

  const sidebarTriggerRef = useRef(null)
  const infoTriggerRef = useRef(null)
  // 记录上一次打开的是哪个抽屉，关闭后把焦点还给对应触发按钮
  const lastOpenRef = useRef(null)

  const handleStartQuiz = () => {
    startQuiz(getRandomBoneId())
  }

  // Escape 关闭抽屉：抽屉是覆盖全屏的模态层，没有键盘出口等于把键盘用户困住
  useEffect(() => {
    if (!sidebarOpen && !infoPanelOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePanels()
        return
      }
      if (e.key !== 'Tab') return
      const panel = document.getElementById(sidebarOpen ? 'skeleton-sidebar' : 'skeleton-info-panel')
      const focusable = panel
        ? [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])')]
        : []
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen, infoPanelOpen, closePanels])

  // 焦点回归：抽屉从「开」变「关」时，焦点回到打开它的按钮。
  // React 19 禁止在渲染期间写 ref，所以记录动作必须放进 effect。
  useEffect(() => {
    const current = sidebarOpen ? 'sidebar' : infoPanelOpen ? 'info' : null
    const previous = lastOpenRef.current
    lastOpenRef.current = current
    if (previous && !current) {
      const trigger = previous === 'sidebar' ? sidebarTriggerRef.current : infoTriggerRef.current
      trigger?.focus()
    }
  }, [sidebarOpen, infoPanelOpen])

  return (
    <div className="app">
      <header className="app-header">
        <button
          ref={sidebarTriggerRef}
          type="button"
          className="mobile-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? (isZh ? '关闭骨骼列表' : 'Close bone list') : (isZh ? '打开骨骼列表' : 'Open bone list')}
          aria-expanded={sidebarOpen}
          aria-controls="skeleton-sidebar"
        >
          <span aria-hidden="true">{sidebarOpen ? '✕' : '☰'}</span>
        </button>
        <h1>{isZh ? '人体骨骼 3D 图谱' : 'Human Skeleton 3D Atlas'}</h1>
        <span className="app-subtitle">Human Skeleton 3D Atlas · 206 Bones</span>
        <div className="header-actions">
          <button
            type="button"
            className={`quiz-toggle-btn ${quizMode ? 'active' : ''}`}
            onClick={quizMode ? undefined : handleStartQuiz}
          >
            {quizMode ? (isZh ? '测验中...' : 'Quiz in progress…') : (isZh ? '开始测验' : 'Start quiz')}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? (isZh ? '切换到浅色主题' : 'Switch to light theme') : (isZh ? '切换到深色主题' : 'Switch to dark theme')}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <button
            ref={infoTriggerRef}
            type="button"
            className="mobile-toggle"
            onClick={toggleInfoPanel}
            aria-label={infoPanelOpen ? (isZh ? '关闭骨骼详情' : 'Close bone details') : (isZh ? '打开骨骼详情' : 'Open bone details')}
            aria-expanded={infoPanelOpen}
            aria-controls="skeleton-info-panel"
          >
            <span aria-hidden="true">{infoPanelOpen ? '✕' : 'ℹ'}</span>
          </button>
        </div>
      </header>
      <div className="app-body">
        <Sidebar locale={locale} />
        <div className="canvas-container">
          <Canvas3D />
          {quizMode && <QuizPanel locale={locale} />}
        </div>
        <InfoPanel locale={locale} />
      </div>
      <button
        type="button"
        className={`mobile-overlay ${(sidebarOpen || infoPanelOpen) ? 'visible' : ''}`}
        onClick={closePanels}
        aria-label={isZh ? '关闭面板' : 'Close panel'}
        tabIndex={(sidebarOpen || infoPanelOpen) ? 0 : -1}
      />
    </div>
  )
}
