// @ts-nocheck
/* eslint-disable */
import { User, UserSession, LoginCredentials, RegisterData, PasswordReset } from '../types/user'

/**
 * 用户认证服务
 */
export class AuthService {
  private static readonly STORAGE_KEY = 'tollow_user_session'
  private static readonly API_BASE = '/api/auth'

  /**
   * 用户登录
   */
  static async login(credentials: LoginCredentials): Promise<UserSession> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟用户数据
      const mockUser: User = {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          keyboardLayout: 'qwerty',
          soundEnabled: true,
          vibrationEnabled: false,
          autoSave: true,
          privacyLevel: 'public'
        },
        stats: {
          totalPracticeTime: 0,
          totalWordsTyped: 0,
          averageWPM: 0,
          bestWPM: 0,
          totalAccuracy: 0,
          practiceDays: 0,
          currentStreak: 0,
          longestStreak: 0,
          achievements: []
        }
      }

      const session: UserSession = {
        token: this.generateToken(),
        refreshToken: this.generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时
        user: mockUser
      }

      // 保存到本地存储
      this.saveSession(session)
      
      return session
    } catch (error) {
      throw new Error(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 用户注册
   */
  static async register(data: RegisterData): Promise<UserSession> {
    try {
      // 验证密码
      if (data.password !== data.confirmPassword) {
        throw new Error('密码确认不匹配')
      }

      if (data.password.length < 8) {
        throw new Error('密码长度至少8位')
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          keyboardLayout: 'qwerty',
          soundEnabled: true,
          vibrationEnabled: false,
          autoSave: true,
          privacyLevel: 'public'
        },
        stats: {
          totalPracticeTime: 0,
          totalWordsTyped: 0,
          averageWPM: 0,
          bestWPM: 0,
          totalAccuracy: 0,
          practiceDays: 0,
          currentStreak: 0,
          longestStreak: 0,
          achievements: []
        }
      }

      const session: UserSession = {
        token: this.generateToken(),
        refreshToken: this.generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        user: newUser
      }

      // 保存到本地存储
      this.saveSession(session)
      
      return session
    } catch (error) {
      throw new Error(`注册失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 用户登出
   */
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    sessionStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * 获取当前会话
   */
  static getCurrentSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.STORAGE_KEY)
      if (!sessionData) return null

      const session: UserSession = JSON.parse(sessionData)
      
      // 检查是否过期
      if (new Date(session.expiresAt) <= new Date()) {
        this.logout()
        return null
      }

      return session
    } catch {
      return null
    }
  }

  /**
   * 获取当前用户
   */
  static getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    return session?.user || null
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(): Promise<string> {
    try {
      const session = this.getCurrentSession()
      if (!session) {
        throw new Error('没有有效的会话')
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const newToken = this.generateToken()
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      // 更新会话
      const updatedSession: UserSession = {
        ...session,
        token: newToken,
        expiresAt: newExpiresAt
      }

      this.saveSession(updatedSession)
      
      return newToken
    } catch (error) {
      throw new Error(`刷新令牌失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 重置密码
   */
  static async resetPassword(data: PasswordReset): Promise<void> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (data.token && data.newPassword) {
        // 使用令牌重置密码
        console.log('使用令牌重置密码')
      } else {
        // 发送重置邮件
        console.log('发送重置邮件到:', data.email)
      }
    } catch (error) {
      throw new Error(`重置密码失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 更新用户偏好设置
   */
  static async updatePreferences(preferences: Partial<User['preferences']>): Promise<void> {
    try {
      const session = this.getCurrentSession()
      if (!session) {
        throw new Error('没有有效的会话')
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新本地会话
      const updatedSession: UserSession = {
        ...session,
        user: {
          ...session.user,
          preferences: {
            ...session.user.preferences,
            ...preferences
          }
        }
      }

      this.saveSession(updatedSession)
    } catch (error) {
      throw new Error(`更新偏好设置失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 保存会话到本地存储
   */
  private static saveSession(session: UserSession): void {
    const sessionData = JSON.stringify(session)
    localStorage.setItem(this.STORAGE_KEY, sessionData)
  }

  /**
   * 生成模拟令牌
   */
  private static generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }
}
