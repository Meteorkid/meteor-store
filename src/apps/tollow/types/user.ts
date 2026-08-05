// @ts-nocheck
/* eslint-disable */
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  lastLoginAt: Date
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US' | 'ja-JP'
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak'
  soundEnabled: boolean
  vibrationEnabled: boolean
  autoSave: boolean
  privacyLevel: 'public' | 'friends' | 'private'
}

export interface UserStats {
  totalPracticeTime: number
  totalWordsTyped: number
  averageWPM: number
  bestWPM: number
  totalAccuracy: number
  practiceDays: number
  currentStreak: number
  longestStreak: number
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  progress: number
  maxProgress: number
}

export interface UserSession {
  token: string
  refreshToken: string
  expiresAt: Date
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface PasswordReset {
  email: string
  token?: string
  newPassword?: string
}
