// @ts-nocheck
/* eslint-disable */
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { RecentText, TextContent } from '../types/types'
import { User } from '../types/user'

export interface AppState {
  // 当前视图
  currentView: 'library' | 'upload' | 'practice' | 'profile' | 'settings'
  
  // 当前文本内容
  currentText: TextContent | null
  
  // 用户信息
  user: User | null
  
  // 应用设置
  settings: {
    theme: 'light' | 'dark' | 'auto'
    language: 'zh-CN' | 'en-US' | 'ja-JP'
    soundEnabled: boolean
    keyboardLayout: 'qwerty' | 'dvorak' | 'colemak'
    showProgressBar: boolean
    autoSave: boolean
  }
  
  // 打字练习状态
  typingState: {
    isStarted: boolean
    isPaused: boolean
    startTime: number
    currentPosition: number
    wpm: number
    accuracy: number
    errors: number
  }
  
  // 历史记录
  history: {
    recentTexts: RecentText[]
    practiceSessions: Array<{
      id: string
      textId: string
      date: Date
      wpm: number
      accuracy: number
      duration: number
    }>
  }
}

export interface AppActions {
  // 视图切换
  setCurrentView: (view: AppState['currentView']) => void
  
  // 文本管理
  setCurrentText: (text: TextContent | null) => void
  
  // 用户管理
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  
  // 设置管理
  updateSettings: (updates: Partial<AppState['settings']>) => void
  resetSettings: () => void
  
  // 打字状态管理
  startTyping: () => void
  pauseTyping: () => void
  resumeTyping: () => void
  stopTyping: () => void
  updateTypingStats: (stats: Partial<AppState['typingState']>) => void
  
  // 历史记录管理
  addRecentText: (text: TextContent) => void
  addPracticeSession: (session: AppState['history']['practiceSessions'][0]) => void
  clearHistory: () => void
  
  // 重置状态
  resetApp: () => void
}

export interface AppStore extends AppState, AppActions {}

const toRecentText = (text: TextContent): RecentText => ({
  title: text.title,
  source: text.source,
  type: text.type,
  updatedAt: new Date().toISOString(),
  ...(text.book
    ? {
        bookId: text.book.bookId,
        sectionId: text.book.sectionId,
        sectionTitle: text.book.sectionTitle,
      }
    : {}),
})

const initialState: AppState = {
  currentView: 'library',
  currentText: null,
  user: null,
  settings: {
    theme: 'auto',
    language: 'zh-CN',
    soundEnabled: true,
    keyboardLayout: 'qwerty',
    showProgressBar: true,
    autoSave: true,
  },
  typingState: {
    isStarted: false,
    isPaused: false,
    startTime: 0,
    currentPosition: 0,
    wpm: 0,
    accuracy: 100,
    errors: 0,
  },
  history: {
    recentTexts: [],
    practiceSessions: [],
  },
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 视图切换
        setCurrentView: (view) => set({ currentView: view }),
        
        // 文本管理
        setCurrentText: (text) => set({ currentText: text }),
        
        // 用户管理
        setUser: (user) => set({ user }),
        updateUser: (updates) => {
          const currentUser = get().user
          if (currentUser) {
            set({ user: { ...currentUser, ...updates } })
          }
        },
        
        // 设置管理
        updateSettings: (updates) => {
          set((state) => ({
            settings: { ...state.settings, ...updates }
          }))
        },
        resetSettings: () => set({ settings: initialState.settings }),
        
        // 打字状态管理
        startTyping: () => set((state) => ({
          typingState: {
            ...state.typingState,
            isStarted: true,
            isPaused: false,
            startTime: Date.now(),
          }
        })),
        
        pauseTyping: () => set((state) => ({
          typingState: {
            ...state.typingState,
            isPaused: true,
          }
        })),
        
        resumeTyping: () => set((state) => ({
          typingState: {
            ...state.typingState,
            isPaused: false,
          }
        })),
        
        stopTyping: () => set((state) => ({
          typingState: {
            ...state.typingState,
            isStarted: false,
            isPaused: false,
            startTime: 0,
            currentPosition: 0,
            wpm: 0,
            accuracy: 100,
            errors: 0,
          }
        })),
        
        updateTypingStats: (stats) => set((state) => ({
          typingState: {
            ...state.typingState,
            ...stats,
          }
        })),
        
        // 历史记录管理
        addRecentText: (text) => set((state) => {
          const recentText = toRecentText(text)
          const recentTexts = [recentText, ...state.history.recentTexts.filter(t => t.title !== text.title)]
          return {
            history: {
              ...state.history,
              recentTexts: recentTexts.slice(0, 10), // 只保留最近10个
            }
          }
        }),
        
        addPracticeSession: (session) => set((state) => ({
          history: {
            ...state.history,
            practiceSessions: [session, ...state.history.practiceSessions].slice(0, 100), // 只保留最近100个
          }
        })),
        
        clearHistory: () => set((state) => ({
          history: initialState.history
        })),
        
        // 重置状态
        resetApp: () => set(initialState),
      }),
      {
        name: 'tollow-app-store',
        version: 2,
        migrate: (persistedState: any) => {
          if (!persistedState?.history?.recentTexts) return persistedState

          return {
            ...persistedState,
            history: {
              ...persistedState.history,
              recentTexts: persistedState.history.recentTexts.map((text: TextContent & Partial<RecentText>) => ({
                title: text.title,
                source: text.source,
                type: text.type,
                updatedAt: text.updatedAt || new Date().toISOString(),
                ...(text.book
                  ? {
                      bookId: text.book.bookId,
                      sectionId: text.book.sectionId,
                      sectionTitle: text.book.sectionTitle,
                    }
                  : text.bookId
                    ? {
                        bookId: text.bookId,
                        sectionId: text.sectionId,
                        sectionTitle: text.sectionTitle,
                      }
                    : {}),
              })),
            },
          }
        },
        partialize: (state) => ({
          settings: state.settings,
          user: state.user,
          history: state.history,
        }),
      }
    ),
    {
      name: 'tollow-app-store',
    }
  )
)
