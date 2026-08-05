// @ts-nocheck
/* eslint-disable */
import { 
  LearningProgress, 
  PracticeSession, 
  Mistake, 
  ProgressGoal, 
  ProgressStats, 
  WeeklyProgress, 
  MonthlyProgress,
  ProgressInsight 
} from '../types/progress'
import { TypingStats } from '../types/types'

/**
 * 学习进度追踪服务
 */
export class ProgressService {
  private static readonly PROGRESS_KEY = 'tollow_learning_progress'
  private static readonly GOALS_KEY = 'tollow_progress_goals'
  private static readonly SESSIONS_KEY = 'tollow_practice_sessions'

  /**
   * 记录练习会话
   */
  static async recordPracticeSession(
    fileId: string,
    fileName: string,
    stats: TypingStats,
    mistakes: Mistake[]
  ): Promise<PracticeSession> {
    try {
      const session: PracticeSession = {
        id: this.generateId(),
        startTime: new Date(Date.now() - stats.timeElapsed),
        endTime: new Date(),
        duration: stats.timeElapsed,
        wordsTyped: stats.typedWords,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        mistakes
      }

      // 保存会话记录
      this.savePracticeSession(session)

      // 更新学习进度
      await this.updateLearningProgress(fileId, fileName, session)

      return session
    } catch (error) {
      throw new Error(`记录练习会话失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 更新学习进度
   */
  private static async updateLearningProgress(
    fileId: string,
    fileName: string,
    session: PracticeSession
  ): Promise<void> {
    const progress = this.getLearningProgress(fileId) || this.createLearningProgress(fileId, fileName)
    
    // 更新统计数据
    progress.totalPracticeTime += session.duration
    progress.totalWordsTyped += session.wordsTyped
    progress.lastPracticed = new Date()
    
    // 计算平均WPM
    const totalSessions = progress.practiceSessions.length + 1
    progress.averageWPM = (progress.averageWPM * (totalSessions - 1) + session.wpm) / totalSessions
    
    // 更新最佳WPM
    if (session.wpm > progress.bestWPM) {
      progress.bestWPM = session.wpm
    }
    
    // 计算平均准确率
    progress.totalAccuracy = (progress.totalAccuracy * (totalSessions - 1) + session.accuracy) / totalSessions
    
    // 添加练习会话
    progress.practiceSessions.push(session)
    
    // 计算进度百分比（基于练习时间）
    progress.progressPercentage = Math.min(100, (progress.totalPracticeTime / (30 * 60 * 1000)) * 100) // 假设30分钟完成
    
    // 保存进度
    this.saveLearningProgress(progress)
  }

  /**
   * 获取学习进度
   */
  static getLearningProgress(fileId: string): LearningProgress | null {
    const allProgress = this.getAllLearningProgress()
    return allProgress.find(p => p.fileId === fileId) || null
  }

  /**
   * 获取所有学习进度
   */
  static getAllLearningProgress(): LearningProgress[] {
    try {
      const data = localStorage.getItem(this.PROGRESS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 创建新的学习进度
   */
  private static createLearningProgress(fileId: string, fileName: string): LearningProgress {
    const progress: LearningProgress = {
      id: this.generateId(),
      userId: 'current_user',
      fileId,
      fileName,
      totalPracticeTime: 0,
      totalWordsTyped: 0,
      averageWPM: 0,
      bestWPM: 0,
      totalAccuracy: 0,
      practiceSessions: [],
      lastPracticed: new Date(),
      progressPercentage: 0,
      difficulty: 'medium',
      estimatedCompletionTime: 30 * 60 * 1000 // 30分钟
    }
    
    return progress
  }

  /**
   * 保存学习进度
   */
  private static saveLearningProgress(progress: LearningProgress): void {
    const allProgress = this.getAllLearningProgress()
    const existingIndex = allProgress.findIndex(p => p.id === progress.id)
    
    if (existingIndex !== -1) {
      allProgress[existingIndex] = progress
    } else {
      allProgress.push(progress)
    }
    
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress))
  }

  /**
   * 获取进度统计
   */
  static getProgressStats(): ProgressStats {
    const allProgress = this.getAllLearningProgress()
    
    const totalFiles = allProgress.length
    const totalPracticeTime = allProgress.reduce((sum, p) => sum + p.totalPracticeTime, 0)
    const totalWordsTyped = allProgress.reduce((sum, p) => sum + p.totalWordsTyped, 0)
    const averageWPM = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.averageWPM, 0) / allProgress.length 
      : 0
    const bestWPM = Math.max(...allProgress.map(p => p.bestWPM), 0)
    const averageAccuracy = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.totalAccuracy, 0) / allProgress.length 
      : 0

    // 计算练习天数和连续练习
    const practiceDates = new Set<string>()
    allProgress.forEach(p => {
      p.practiceSessions.forEach(s => {
        practiceDates.add(s.startTime.toDateString())
      })
    })
    
    const practiceDays = practiceDates.size
    const { currentStreak, longestStreak } = this.calculateStreaks(Array.from(practiceDates).sort())

    // 生成周进度和月进度
    const weeklyProgress = this.generateWeeklyProgress(allProgress)
    const monthlyProgress = this.generateMonthlyProgress(allProgress)

    return {
      totalFiles,
      totalPracticeTime,
      totalWordsTyped,
      averageWPM,
      bestWPM,
      averageAccuracy,
      practiceDays,
      currentStreak,
      longestStreak,
      weeklyProgress,
      monthlyProgress
    }
  }

  /**
   * 计算连续练习天数
   */
  private static calculateStreaks(practiceDates: string[]): { currentStreak: number; longestStreak: number } {
    if (practiceDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 }
    }

    let currentStreak = 1
    let longestStreak = 1
    let tempStreak = 1

    for (let i = 1; i < practiceDates.length; i++) {
      const currentDate = new Date(practiceDates[i])
      const prevDate = new Date(practiceDates[i - 1])
      const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    // 检查当前连续天数
    const today = new Date().toDateString()
    const lastPracticeDate = practiceDates[practiceDates.length - 1]
    const lastDate = new Date(lastPracticeDate)
    const todayDate = new Date(today)
    const dayDiff = (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)

    if (dayDiff <= 1) {
      currentStreak = tempStreak
    } else {
      currentStreak = 0
    }

    return { currentStreak, longestStreak }
  }

  /**
   * 生成周进度数据
   */
  private static generateWeeklyProgress(allProgress: LearningProgress[]): WeeklyProgress[] {
    const weeks: WeeklyProgress[] = []
    const now = new Date()
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      
      const weekSessions = allProgress.flatMap(p => 
        p.practiceSessions.filter(s => 
          s.startTime >= weekStart && s.startTime <= weekEnd
        )
      )
      
      if (weekSessions.length > 0) {
        const weekProgress: WeeklyProgress = {
          week: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
          practiceTime: weekSessions.reduce((sum, s) => sum + s.duration, 0),
          wordsTyped: weekSessions.reduce((sum, s) => sum + s.wordsTyped, 0),
          averageWPM: weekSessions.reduce((sum, s) => sum + s.wpm, 0) / weekSessions.length,
          averageAccuracy: weekSessions.reduce((sum, s) => sum + s.accuracy, 0) / weekSessions.length,
          practiceDays: new Set(weekSessions.map(s => s.startTime.toDateString())).size
        }
        weeks.push(weekProgress)
      }
    }
    
    return weeks
  }

  /**
   * 生成月进度数据
   */
  private static generateMonthlyProgress(allProgress: LearningProgress[]): MonthlyProgress[] {
    const months: MonthlyProgress[] = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthSessions = allProgress.flatMap(p => 
        p.practiceSessions.filter(s => 
          s.startTime >= monthStart && s.startTime <= monthEnd
        )
      )
      
      if (monthSessions.length > 0) {
        const monthProgress: MonthlyProgress = {
          month: monthStart.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
          practiceTime: monthSessions.reduce((sum, s) => sum + s.duration, 0),
          wordsTyped: monthSessions.reduce((sum, s) => sum + s.wordsTyped, 0),
          averageWPM: monthSessions.reduce((sum, s) => sum + s.wpm, 0) / monthSessions.length,
          averageAccuracy: monthSessions.reduce((sum, s) => sum + s.accuracy, 0) / monthSessions.length,
          practiceDays: new Set(monthSessions.map(s => s.startTime.toDateString())).size,
          improvement: 0 // 可以基于历史数据计算改进百分比
        }
        months.push(monthProgress)
      }
    }
    
    return months
  }

  /**
   * 创建学习目标
   */
  static async createProgressGoal(goal: Omit<ProgressGoal, 'id' | 'userId' | 'createdAt' | 'progress' | 'isCompleted'>): Promise<ProgressGoal> {
    const newGoal: ProgressGoal = {
      ...goal,
      id: this.generateId(),
      userId: 'current_user',
      createdAt: new Date(),
      progress: 0,
      isCompleted: false
    }

    this.saveProgressGoal(newGoal)
    return newGoal
  }

  /**
   * 获取学习目标
   */
  static getProgressGoals(): ProgressGoal[] {
    try {
      const data = localStorage.getItem(this.GOALS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 保存学习目标
   */
  private static saveProgressGoal(goal: ProgressGoal): void {
    const goals = this.getProgressGoals()
    const existingIndex = goals.findIndex(g => g.id === goal.id)
    
    if (existingIndex !== -1) {
      goals[existingIndex] = goal
    } else {
      goals.push(goal)
    }
    
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals))
  }

  /**
   * 保存练习会话
   */
  private static savePracticeSession(session: PracticeSession): void {
    const sessions = this.getPracticeSessions()
    sessions.push(session)
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))
  }

  /**
   * 获取练习会话
   */
  private static getPracticeSessions(): PracticeSession[] {
    try {
      const data = localStorage.getItem(this.SESSIONS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
