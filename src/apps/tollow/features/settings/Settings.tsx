// @ts-nocheck
/* eslint-disable */
import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { useThemeStore } from '../../stores/themeStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { logger } from '../../utils/logger'

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAppStore()
  const { currentTheme, setTheme, themes } = useThemeStore()
  
  // 性能监控
  usePerformanceMonitor('Settings')
  
  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    try {
      updateSettings({ [key]: value })
      logger.info('设置更新成功', { key, value })
    } catch (error) {
      logger.error('设置更新失败', { error, key, value })
    }
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    try {
      setTheme(theme)
      logger.info('主题切换成功', { theme })
    } catch (error) {
      logger.error('主题切换失败', { error, theme })
    }
  }

  const handleResetSettings = () => {
    try {
      resetSettings()
      logger.info('设置重置成功')
    } catch (error) {
      logger.error('设置重置失败', { error })
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ 设置</h1>
        <p>自定义您的应用体验</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3>🎨 外观设置</h3>
          <div className="setting-item">
            <label>主题模式</label>
            <select 
              value={currentTheme} 
              onChange={(e) => handleThemeChange(e.target.value as any)}
            >
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
              <option value="auto">自动主题</option>
            </select>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>🔊 声音设置</h3>
          <div className="setting-item">
            <label>启用声音</label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h3>⌨️ 键盘设置</h3>
          <div className="setting-item">
            <label>键盘布局</label>
            <select 
              value={settings.keyboardLayout} 
              onChange={(e) => handleSettingChange('keyboardLayout', e.target.value)}
            >
              <option value="qwerty">QWERTY</option>
              <option value="dvorak">Dvorak</option>
              <option value="colemak">Colemak</option>
            </select>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>📊 显示设置</h3>
          <div className="setting-item">
            <label>显示进度条</label>
            <input
              type="checkbox"
              checked={settings.showProgressBar}
              onChange={(e) => handleSettingChange('showProgressBar', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>自动保存</label>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h3>🌍 语言设置</h3>
          <div className="setting-item">
            <label>界面语言</label>
            <select 
              value={settings.language} 
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
        </div>
        
        <div className="settings-actions">
          <button onClick={handleResetSettings} className="btn btn-secondary">
            重置设置
          </button>
          <button className="btn btn-primary">
            保存设置
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
