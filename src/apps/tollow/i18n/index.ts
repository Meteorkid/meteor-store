// @ts-nocheck
/* eslint-disable */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// 支持的语言
export const SUPPORTED_LANGUAGES = {
  'zh-CN': {
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr' as const,
  },
  'en-US': {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr' as const,
  },
  'ja-JP': {
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵',
    direction: 'ltr' as const,
  },
  'ko-KR': {
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr' as const,
  },
  'fr-FR': {
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr' as const,
  },
  'de-DE': {
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr' as const,
  },
  'es-ES': {
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr' as const,
  },
  'ar-SA': {
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl' as const,
  },
}

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh-CN'

// 语言检测配置
const languageDetector = new LanguageDetector()
languageDetector.addDetector({
  name: 'localStorage',
  lookup() {
    return localStorage.getItem('tollow_language')
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem('tollow_language', lng)
  },
})

// i18n配置
i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    // 调试模式
    debug: process.env.NODE_ENV === 'development',
    
    // 回退语言
    fallbackLng: DEFAULT_LANGUAGE,
    
    // 支持的语言
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    
    // 语言检测顺序
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // 后端配置
    backend: {
      loadPath: '/apps/tollow/locales/{{lng}}/{{ns}}.json',
      addPath: '/apps/tollow/locales/{{lng}}/{{ns}}.json',
    },
    
    // 命名空间
    ns: ['common', 'library', 'practice', 'upload', 'profile', 'settings'],
    defaultNS: 'common',
    
    // 插值配置
    interpolation: {
      escapeValue: false,
    },
    
    // 响应式配置
    react: {
      useSuspense: false,
    },
    
    // 加载配置
    load: 'languageOnly',
    
    // 预加载语言
    preload: [DEFAULT_LANGUAGE],
  })

// 语言切换函数
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    await i18n.changeLanguage(language)
    
    // 更新文档方向
    const direction = SUPPORTED_LANGUAGES[language].direction
    document.documentElement.dir = direction
    document.documentElement.lang = language
    
    // 保存到本地存储
    localStorage.setItem('tollow_language', language)
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }))
    
    console.log(`Language changed to: ${language}`)
  } catch (error) {
    console.error('Failed to change language:', error)
    throw error
  }
}

// 获取当前语言
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || DEFAULT_LANGUAGE
}

// 获取语言信息
export const getLanguageInfo = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language]
}

// 检查语言是否支持
export const isLanguageSupported = (language: string): language is SupportedLanguage => {
  return language in SUPPORTED_LANGUAGES
}

// 获取用户首选语言
export const getUserPreferredLanguage = (): SupportedLanguage => {
  // 从本地存储获取
  const stored = localStorage.getItem('tollow_language')
  if (stored && isLanguageSupported(stored)) {
    return stored
  }
  
  // 从浏览器获取
  const browserLang = navigator.language
  if (isLanguageSupported(browserLang)) {
    return browserLang
  }
  
  // 尝试匹配语言代码
  const shortLang = browserLang.split('-')[0]
  for (const [code] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (code.startsWith(shortLang)) {
      return code as SupportedLanguage
    }
  }
  
  return DEFAULT_LANGUAGE
}

// 初始化语言
export const initializeLanguage = async (): Promise<void> => {
  const preferredLanguage = getUserPreferredLanguage()
  
  if (preferredLanguage !== getCurrentLanguage()) {
    await changeLanguage(preferredLanguage)
  }
  
  // 设置文档属性
  const currentLang = getCurrentLanguage()
  const langInfo = getLanguageInfo(currentLang)
  
  document.documentElement.dir = langInfo.direction
  document.documentElement.lang = currentLang
}

// 导出i18n实例
export default i18n
