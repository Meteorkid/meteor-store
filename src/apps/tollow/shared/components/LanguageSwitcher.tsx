// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  changeLanguage, 
  getCurrentLanguage, 
  getLanguageInfo, 
  SUPPORTED_LANGUAGES,
  type SupportedLanguage 
} from '../../core/i18n'
import { logger } from '../../utils/logger'

interface LanguageSwitcherProps {
  className?: string
  showFlags?: boolean
  showNativeNames?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'dropdown' | 'buttons' | 'select'
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showFlags = true,
  showNativeNames = true,
  size = 'medium',
  variant = 'dropdown',
}) => {
  const { t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('zh-CN')
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // 获取当前语言
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
  }, [])

  // 切换语言
  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage || isChanging) return

    try {
      setIsChanging(true)
      await changeLanguage(language)
      setCurrentLanguage(language)
      setIsOpen(false)
      
      logger.info('语言切换成功', { from: currentLanguage, to: language })
    } catch (error) {
      logger.error('语言切换失败', { error, language })
    } finally {
      setIsChanging(false)
    }
  }

  // 获取语言显示名称
  const getLanguageDisplayName = (language: SupportedLanguage): string => {
    const langInfo = getLanguageInfo(language)
    if (showNativeNames) {
      return langInfo.nativeName
    }
    return langInfo.name
  }

  // 获取尺寸样式
  const getSizeClass = (): string => {
    switch (size) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  // 下拉菜单样式
  if (variant === 'dropdown') {
    return (
      <div className={`language-switcher dropdown ${className}`}>
        <button
          className={`language-switcher-trigger ${getSizeClass()}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
          aria-label={t('common.language')}
        >
          {showFlags && (
            <span className="language-flag">
              {getLanguageInfo(currentLanguage).flag}
            </span>
          )}
          <span className="language-name">
            {getLanguageDisplayName(currentLanguage)}
          </span>
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="language-dropdown">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, langInfo]) => (
              <button
                key={code}
                className={`language-option ${code === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageChange(code as SupportedLanguage)}
                disabled={isChanging}
              >
                {showFlags && (
                  <span className="language-flag">{langInfo.flag}</span>
                )}
                <span className="language-name">
                  {showNativeNames ? langInfo.nativeName : langInfo.name}
                </span>
                {code === currentLanguage && (
                  <span className="checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 按钮样式
  if (variant === 'buttons') {
    return (
      <div className={`language-switcher buttons ${className}`}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, langInfo]) => (
          <button
            key={code}
            className={`language-button ${code === currentLanguage ? 'active' : ''} ${getSizeClass()}`}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            disabled={isChanging}
            title={showNativeNames ? langInfo.nativeName : langInfo.name}
          >
            {showFlags && (
              <span className="language-flag">{langInfo.flag}</span>
            )}
            <span className="language-name">
              {showNativeNames ? langInfo.nativeName : langInfo.name}
            </span>
          </button>
        ))}
      </div>
    )
  }

  // 选择框样式
  return (
    <div className={`language-switcher select ${className}`}>
      <select
        className={`language-select ${getSizeClass()}`}
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
        disabled={isChanging}
        aria-label={t('common.language')}
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, langInfo]) => (
          <option key={code} value={code}>
            {showFlags && langInfo.flag} {showNativeNames ? langInfo.nativeName : langInfo.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
