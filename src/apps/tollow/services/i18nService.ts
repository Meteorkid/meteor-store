// @ts-nocheck
/* eslint-disable */
import { Locale, Translation, I18nConfig, LocaleData } from '../types/i18n'

/**
 * 国际化服务
 */
export class I18nService {
  private static instance: I18nService
  private currentLocale: string
  private translations: Map<string, Translation> = new Map()
  private config: I18nConfig

  private constructor() {
    this.config = {
      defaultLocale: 'zh-CN',
      supportedLocales: ['zh-CN', 'en-US', 'ja-JP'],
      fallbackLocale: 'zh-CN',
      loadPath: '/apps/tollow/locales',
      debug: false
    }
    
    this.currentLocale = this.getStoredLocale() || this.config.defaultLocale
    this.initialize()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService()
    }
    return I18nService.instance
  }

  /**
   * 初始化国际化服务
   */
  private async initialize(): Promise<void> {
    try {
      // 加载默认语言
      await this.loadLocale(this.currentLocale)
      
      // 预加载其他支持的语言
      for (const locale of this.config.supportedLocales) {
        if (locale !== this.currentLocale) {
          this.loadLocale(locale).catch(console.error)
        }
      }
    } catch (error) {
      console.error('初始化国际化服务失败:', error)
    }
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLocales(): Locale[] {
    return [
      {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        flag: '🇨🇳',
        direction: 'ltr'
      },
      {
        code: 'en-US',
        name: 'English (US)',
        nativeName: 'English',
        flag: '🇺🇸',
        direction: 'ltr'
      },
      {
        code: 'ja-JP',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        direction: 'ltr'
      }
    ]
  }

  /**
   * 获取当前语言
   */
  getCurrentLocale(): string {
    return this.currentLocale
  }

  /**
   * 切换语言
   */
  async setLocale(locale: string): Promise<void> {
    if (!this.config.supportedLocales.includes(locale)) {
      throw new Error(`不支持的语言: ${locale}`)
    }

    try {
      await this.loadLocale(locale)
      this.currentLocale = locale
      this.storeLocale(locale)
      
      // 触发语言切换事件
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }))
    } catch (error) {
      console.error(`切换语言失败: ${locale}`, error)
      throw error
    }
  }

  /**
   * 翻译文本
   */
  t(key: string, params?: Record<string, any>): string {
    try {
      const translation = this.getTranslation(key)
      if (!translation) {
        if (this.config.debug) {
          console.warn(`翻译键未找到: ${key}`)
        }
        return key
      }

      return this.interpolate(translation, params)
    } catch (error) {
      console.error(`翻译失败: ${key}`, error)
      return key
    }
  }

  /**
   * 翻译复数形式
   */
  tn(key: string, count: number, params?: Record<string, any>): string {
    const pluralKey = this.getPluralKey(key, count)
    return this.t(pluralKey, { ...params, count })
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
    const localeData = this.getLocaleData()
    const dateFormat = localeData.dateFormats[format]
    
    try {
      return new Intl.DateTimeFormat(this.currentLocale, {
        dateStyle: format
      }).format(date)
    } catch {
      return date.toLocaleDateString()
    }
  }

  /**
   * 格式化数字
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.currentLocale, options).format(number)
    } catch {
      return number.toString()
    }
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount: number, currency: string = 'CNY'): string {
    try {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'currency',
        currency
      }).format(amount)
    } catch {
      return `${amount} ${currency}`
    }
  }

  /**
   * 获取文本方向
   */
  getTextDirection(): 'ltr' | 'rtl' {
    const locale = this.getSupportedLocales().find(l => l.code === this.currentLocale)
    return locale?.direction || 'ltr'
  }

  /**
   * 加载语言包
   */
  private async loadLocale(locale: string): Promise<void> {
    if (this.translations.has(locale)) {
      return
    }

    try {
      // 模拟加载语言包
      const translations = await this.fetchLocaleData(locale)
      this.translations.set(locale, translations)
    } catch (error) {
      console.error(`加载语言包失败: ${locale}`, error)
      
      // 如果加载失败，使用备用翻译
      const fallbackTranslations = this.getFallbackTranslations(locale)
      this.translations.set(locale, fallbackTranslations)
    }
  }

  /**
   * 获取翻译文本
   */
  private getTranslation(key: string): string | undefined {
    const keys = key.split('.')
    let translation: any = this.translations.get(this.currentLocale)
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k]
      } else {
        return undefined
      }
    }
    
    return typeof translation === 'string' ? translation : undefined
  }

  /**
   * 插值替换
   */
  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  /**
   * 获取复数键
   */
  private getPluralKey(key: string, count: number): string {
    if (count === 0) return `${key}.zero`
    if (count === 1) return `${key}.one`
    return `${key}.other`
  }

  /**
   * 获取语言数据
   */
  private getLocaleData(): LocaleData {
    // 返回默认语言数据
    return {
      locale: this.currentLocale,
      translations: {},
      dateFormats: {
        short: 'short',
        medium: 'medium',
        long: 'long',
        full: 'full'
      },
      numberFormats: {
        decimal: '.',
        thousands: ',',
        precision: 2,
        currency: 'CNY'
      },
      pluralRules: {}
    }
  }

  /**
   * 获取存储的语言设置
   */
  private getStoredLocale(): string | null {
    try {
      return localStorage.getItem('tollow_locale')
    } catch {
      return null
    }
  }

  /**
   * 存储语言设置
   */
  private storeLocale(locale: string): void {
    try {
      localStorage.setItem('tollow_locale', locale)
    } catch (error) {
      console.error('存储语言设置失败:', error)
    }
  }

  /**
   * 获取语言包数据
   */
  private async fetchLocaleData(locale: string): Promise<Translation> {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 返回模拟的翻译数据
    return this.getMockTranslations(locale)
  }

  /**
   * 获取模拟翻译数据
   */
  private getMockTranslations(locale: string): Translation {
    const translations: Record<string, Translation> = {
      'zh-CN': {
        common: {
          welcome: '欢迎使用Tollow',
          start: '开始',
          cancel: '取消',
          confirm: '确认',
          loading: '加载中...',
          error: '错误',
          success: '成功'
        },
        navigation: {
          home: '首页',
          practice: '练习',
          library: '书库',
          profile: '个人资料',
          settings: '设置'
        },
        practice: {
          startTyping: '开始打字',
          pause: '暂停',
          resume: '继续',
          restart: '重新开始',
          complete: '完成'
        }
      },
      'en-US': {
        common: {
          welcome: 'Welcome to Tollow',
          start: 'Start',
          cancel: 'Cancel',
          confirm: 'Confirm',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success'
        },
        navigation: {
          home: 'Home',
          practice: 'Practice',
          library: 'Library',
          profile: 'Profile',
          settings: 'Settings'
        },
        practice: {
          startTyping: 'Start Typing',
          pause: 'Pause',
          resume: 'Resume',
          restart: 'Restart',
          complete: 'Complete'
        }
      },
      'ja-JP': {
        common: {
          welcome: 'Tollowへようこそ',
          start: '開始',
          cancel: 'キャンセル',
          confirm: '確認',
          loading: '読み込み中...',
          error: 'エラー',
          success: '成功'
        },
        navigation: {
          home: 'ホーム',
          practice: '練習',
          library: 'ライブラリ',
          profile: 'プロフィール',
          settings: '設定'
        },
        practice: {
          startTyping: 'タイピング開始',
          pause: '一時停止',
          resume: '再開',
          restart: '再開',
          complete: '完了'
        }
      }
    }
    
    return translations[locale] || translations[this.config.fallbackLocale]
  }

  /**
   * 获取备用翻译
   */
  private getFallbackTranslations(locale: string): Translation {
    return this.getMockTranslations(locale)
  }
}
