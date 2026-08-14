// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from 'react'
import { HashRouter } from 'react-router'
import { AppRouter } from '../routes'
import { useAppStore } from '../stores/appStore'
import { useThemeStore } from '../stores/themeStore'
import { logger } from '../utils/logger'
import Header from '../shared/layout/Header'
import './App.css'

function App() {
  const { setUser, updateSettings } = useAppStore()
  const { applyTheme } = useThemeStore()

  // 初始化应用
  useEffect(() => {
    logger.info('Tollow应用启动')
    
    // 应用主题
    applyTheme()
    
    // 检查是否有保存的用户会话
    const savedUser = localStorage.getItem('tollow_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUser(user)
        logger.info('用户会话已恢复', { userId: user.id })
      } catch (error) {
        logger.error('恢复用户会话失败', { error })
        localStorage.removeItem('tollow_user')
      }
    }
    
    // 检查是否有保存的设置
    const savedSettings = localStorage.getItem('tollow_settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        updateSettings(settings)
        logger.info('应用设置已恢复')
      } catch (error) {
        logger.error('恢复应用设置失败', { error })
        localStorage.removeItem('tollow_settings')
      }
    }
  }, [setUser, updateSettings, applyTheme])

  return (
    <HashRouter>
      <div className="App">
        <Header />
        <main className="app-main">
          <AppRouter />
        </main>
      </div>
    </HashRouter>
  )
}

export default App
