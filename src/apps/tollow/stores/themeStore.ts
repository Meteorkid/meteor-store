// @ts-nocheck
/* eslint-disable */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'auto'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  shadow: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeConfig {
  name: string
  colors: ThemeColors
  borderRadius: string
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
    lineHeight: {
      tight: number
      normal: number
      relaxed: number
    }
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
}

// 预定义主题配置
const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: '浅色主题',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#17a2b8',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.1)',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
    },
    borderRadius: '8px',
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '250ms ease-in-out',
      slow: '350ms ease-in-out',
    },
  },
  dark: {
    name: '深色主题',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      accent: '#0dcaf0',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#2d2d2d',
      shadow: 'rgba(0, 0, 0, 0.3)',
      success: '#198754',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#0dcaf0',
    },
    borderRadius: '8px',
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      md: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2)',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '250ms ease-in-out',
      slow: '350ms ease-in-out',
    },
  },
  auto: {
    name: '自动主题',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#17a2b8',
      background: 'var(--auto-background)',
      surface: 'var(--auto-surface)',
      text: 'var(--auto-text)',
      textSecondary: 'var(--auto-text-secondary)',
      border: 'var(--auto-border)',
      shadow: 'var(--auto-shadow)',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
    },
    borderRadius: '8px',
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: '0 1px 3px var(--auto-shadow), 0 1px 2px var(--auto-shadow)',
      md: '0 4px 6px var(--auto-shadow), 0 1px 3px var(--auto-shadow)',
      lg: '0 10px 15px var(--auto-shadow), 0 4px 6px var(--auto-shadow)',
      xl: '0 20px 25px var(--auto-shadow), 0 10px 10px var(--auto-shadow)',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '250ms ease-in-out',
      slow: '350ms ease-in-out',
    },
  },
}

export interface ThemeStore {
  currentTheme: Theme
  themeConfig: ThemeConfig
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  getSystemTheme: () => Theme
  applyTheme: () => void
}

let isApplyingTheme = false

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'light',
      themeConfig: themes.light,
      
      setTheme: (theme: Theme) => {
        set({ 
          currentTheme: theme,
          themeConfig: themes[theme]
        })
        get().applyTheme()
      },
      
      toggleTheme: () => {
        const { currentTheme } = get()
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
      
      getSystemTheme: (): Theme => {
        if (typeof window === 'undefined') return 'light'
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        return mediaQuery.matches ? 'dark' : 'light'
      },
      
      applyTheme: () => {
        if (isApplyingTheme) return
        isApplyingTheme = true
        try {
          const { currentTheme, themeConfig } = get()
          if (typeof document === 'undefined') return
          const root = document.documentElement

          // 应用CSS变量
          Object.entries(themeConfig.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value)
          })

          // 应用其他主题属性
          root.style.setProperty('--border-radius', themeConfig.borderRadius)
          root.style.setProperty('--transition-fast', themeConfig.transitions.fast)
          root.style.setProperty('--transition-normal', themeConfig.transitions.normal)
          root.style.setProperty('--transition-slow', themeConfig.transitions.slow)

          // 设置body类名
          document.body.className = `theme-${currentTheme}`

          // 自动主题：监听系统主题并直接更新变量（避免递归调用 applyTheme）
          if (currentTheme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const applySystemTheme = () => {
              const systemTheme = get().getSystemTheme()
              const cfg = themes[systemTheme]
              set({ themeConfig: cfg })
              // 直接更新CSS变量
              Object.entries(cfg.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value)
              })
            }
            mediaQuery.addEventListener('change', applySystemTheme)
            applySystemTheme()
          }
        } finally {
          isApplyingTheme = false
        }
      },
    }),
    {
      name: 'tollow-theme-store',
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
)
