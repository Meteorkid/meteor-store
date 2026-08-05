// @ts-nocheck
/* eslint-disable */
import { 
  UserPreference, 
  ContentMetadata, 
  Recommendation, 
  UserBehavior, 
  CollaborativeFiltering,
  ContentBasedFiltering 
} from '../types/recommendation'
import { User } from '../types/user'

/**
 * 智能推荐服务
 */
export class RecommendationService {
  private static readonly PREFERENCES_KEY = 'tollow_user_preferences'
  private static readonly BEHAVIORS_KEY = 'tollow_user_behaviors'
  private static readonly RECOMMENDATIONS_KEY = 'tollow_recommendations'

  /**
   * 获取个性化推荐
   */
  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    try {
      // 获取用户偏好
      const userPreferences = this.getUserPreferences(userId)
      
      // 获取用户行为历史
      const userBehaviors = this.getUserBehaviors(userId)
      
      // 基于内容的过滤
      const contentBasedResults = await this.getContentBasedRecommendations(userPreferences, limit)
      
      // 协同过滤
      const collaborativeResults = await this.getCollaborativeRecommendations(userId, userBehaviors, limit)
      
      // 混合推荐结果
      const hybridRecommendations = this.hybridRecommendations(contentBasedResults, collaborativeResults, limit)
      
      // 保存推荐结果
      this.saveRecommendations(userId, hybridRecommendations)
      
      return hybridRecommendations
    } catch (error) {
      console.error('获取推荐失败:', error)
      return this.getFallbackRecommendations(limit)
    }
  }

  /**
   * 基于内容的推荐
   */
  private static async getContentBasedRecommendations(
    preferences: UserPreference[], 
    limit: number
  ): Promise<Recommendation[]> {
    // 分析用户偏好
    const userProfile = this.analyzeUserPreferences(preferences)
    
    // 获取内容库
    const contentLibrary = await this.getContentLibrary()
    
    // 计算匹配分数
    const contentMatches: ContentBasedFiltering['contentMatches'] = contentLibrary.map(content => {
      const matchScore = this.calculateContentMatchScore(content, userProfile)
      return {
        contentId: content.id,
        matchScore,
        matchingFeatures: this.getMatchingFeatures(content, userProfile)
      }
    })
    
    // 排序并返回推荐
    return contentMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
      .map(match => this.createRecommendation(match.contentId, match.matchScore, 'content-based'))
  }

  /**
   * 协同过滤推荐
   */
  private static async getCollaborativeRecommendations(
    userId: string, 
    behaviors: UserBehavior[], 
    limit: number
  ): Promise<Recommendation[]> {
    // 找到相似用户
    const similarUsers = await this.findSimilarUsers(userId, behaviors)
    
    // 基于相似用户的偏好推荐
    const recommendations: Recommendation[] = []
    
    for (const similarUser of similarUsers.slice(0, 5)) {
      const userBehaviors = this.getUserBehaviors(similarUser.userId)
      const completedContent = userBehaviors
        .filter(b => b.action === 'complete' && b.rating && b.rating >= 4)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      
      for (const behavior of completedContent.slice(0, 2)) {
        if (!behaviors.some(b => b.contentId === behavior.contentId)) {
          const score = similarUser.similarity * (behavior.rating || 0) / 5
          recommendations.push(this.createRecommendation(behavior.contentId, score, 'collaborative'))
        }
      }
    }
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * 混合推荐算法
   */
  private static hybridRecommendations(
    contentBased: Recommendation[],
    collaborative: Recommendation[],
    limit: number
  ): Recommendation[] {
    const allRecommendations = [...contentBased, ...collaborative]
    const uniqueRecommendations = new Map<string, Recommendation>()
    
    // 去重并合并分数
    for (const rec of allRecommendations) {
      if (uniqueRecommendations.has(rec.contentId)) {
        const existing = uniqueRecommendations.get(rec.contentId)!
        existing.score = (existing.score + rec.score) / 2
        existing.confidence = Math.min(100, existing.confidence + 10)
      } else {
        uniqueRecommendations.set(rec.contentId, { ...rec })
      }
    }
    
    // 排序并返回
    return Array.from(uniqueRecommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * 分析用户偏好
   */
  private static analyzeUserPreferences(preferences: UserPreference[]): ContentBasedFiltering['userProfile'] {
    const categoryCounts = new Map<string, number>()
    const difficultyCounts = new Map<string, number>()
    const languageCounts = new Map<string, number>()
    let totalLength = 0
    let totalInterest = 0
    
    preferences.forEach(pref => {
      // 统计类别偏好
      categoryCounts.set(pref.category, (categoryCounts.get(pref.category) || 0) + pref.interest)
      
      // 统计难度偏好
      difficultyCounts.set(pref.difficulty, (difficultyCounts.get(pref.difficulty) || 0) + pref.interest)
      
      // 统计语言偏好
      languageCounts.set(pref.language || 'zh-CN', (languageCounts.get(pref.language || 'zh-CN') || 0) + pref.interest)
      
      totalLength += pref.interest
      totalInterest += pref.interest
    })
    
    // 找出最偏好的类别和难度
    const preferredCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category)
    
    const preferredDifficulty = Array.from(difficultyCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'intermediate'
    
    const preferredLanguage = Array.from(languageCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'zh-CN'
    
    return {
      preferredCategories,
      preferredDifficulty,
      preferredLength: totalLength / preferences.length,
      preferredLanguage
    }
  }

  /**
   * 计算内容匹配分数
   */
  private static calculateContentMatchScore(
    content: ContentMetadata, 
    userProfile: ContentBasedFiltering['userProfile']
  ): number {
    let score = 0
    
    // 类别匹配
    if (userProfile.preferredCategories.includes(content.category)) {
      score += 30
    }
    
    // 难度匹配
    if (userProfile.preferredDifficulty === content.difficulty) {
      score += 25
    }
    
    // 语言匹配
    if (userProfile.preferredLanguage === content.language) {
      score += 20
    }
    
    // 长度匹配（偏好长度与内容长度的相似度）
    const lengthDiff = Math.abs(userProfile.preferredLength - content.length)
    const lengthScore = Math.max(0, 25 - lengthDiff / 100)
    score += lengthScore
    
    // 内容质量
    score += content.rating * 0.2
    score += content.popularity * 0.1
    
    return Math.min(100, score)
  }

  /**
   * 获取匹配特征
   */
  private static getMatchingFeatures(
    content: ContentMetadata, 
    userProfile: ContentBasedFiltering['userProfile']
  ): string[] {
    const features: string[] = []
    
    if (userProfile.preferredCategories.includes(content.category)) {
      features.push('类别匹配')
    }
    
    if (userProfile.preferredDifficulty === content.difficulty) {
      features.push('难度匹配')
    }
    
    if (userProfile.preferredLanguage === content.language) {
      features.push('语言匹配')
    }
    
    if (content.rating >= 4) {
      features.push('高评分')
    }
    
    if (content.popularity >= 80) {
      features.push('热门内容')
    }
    
    return features
  }

  /**
   * 找到相似用户
   */
  private static async findSimilarUsers(userId: string, behaviors: UserBehavior[]): Promise<CollaborativeFiltering['similarUsers']> {
    // 获取所有用户行为
    const allBehaviors = this.getAllUserBehaviors()
    const userBehaviors = behaviors.filter(b => b.action === 'complete' || b.action === 'rate')
    
    const similarUsers: CollaborativeFiltering['similarUsers'] = []
    
    // 计算用户相似度
    for (const [otherUserId, otherBehaviors] of Object.entries(allBehaviors)) {
      if (otherUserId === userId) continue
      
      const similarity = this.calculateUserSimilarity(userBehaviors, otherBehaviors)
      if (similarity > 0.3) { // 相似度阈值
        const commonInterests = this.findCommonInterests(userBehaviors, otherBehaviors)
        similarUsers.push({
          userId: otherUserId,
          similarity,
          commonInterests
        })
      }
    }
    
    return similarUsers
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
  }

  /**
   * 计算用户相似度
   */
  private static calculateUserSimilarity(
    userBehaviors: UserBehavior[], 
    otherBehaviors: UserBehavior[]
  ): number {
    const userContent = new Set(userBehaviors.map(b => b.contentId))
    const otherContent = new Set(otherBehaviors.map(b => b.contentId))
    
    // Jaccard相似度
    const intersection = new Set([...userContent].filter(x => otherContent.has(x)))
    const union = new Set([...userContent, ...otherContent])
    
    return intersection.size / union.size
  }

  /**
   * 找到共同兴趣
   */
  private static findCommonInterests(
    userBehaviors: UserBehavior[], 
    otherBehaviors: UserBehavior[]
  ): string[] {
    const userContent = new Set(userBehaviors.map(b => b.contentId))
    const otherContent = new Set(otherBehaviors.map(b => b.contentId))
    
    return Array.from(userContent).filter(x => otherContent.has(x))
  }

  /**
   * 创建推荐对象
   */
  private static createRecommendation(
    contentId: string, 
    score: number, 
    reason: string
  ): Recommendation {
    return {
      id: this.generateId(),
      userId: 'current_user',
      contentId,
      score,
      reason,
      category: 'general',
      confidence: Math.min(100, score + Math.random() * 20),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后过期
    }
  }

  /**
   * 获取备用推荐
   */
  private static getFallbackRecommendations(limit: number): Recommendation[] {
    const fallbackContent = [
      '经典文学作品',
      '编程入门指南',
      '英语学习材料',
      '科技新闻摘要',
      '历史故事集'
    ]
    
    return fallbackContent.slice(0, limit).map((title, index) => ({
      id: this.generateId(),
      userId: 'current_user',
      contentId: `fallback_${index}`,
      score: 70 - index * 5,
      reason: '热门推荐',
      category: 'general',
      confidence: 80,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }))
  }

  /**
   * 获取内容库
   */
  private static async getContentLibrary(): Promise<ContentMetadata[]> {
    // 模拟内容库
    return [
      {
        id: '1',
        title: '经典文学作品',
        category: '文学',
        difficulty: 'intermediate',
        language: 'zh-CN',
        length: 5000,
        complexity: 60,
        tags: ['文学', '经典', '中文'],
        popularity: 85,
        rating: 4.5,
        readCount: 1200,
        completionRate: 78
      },
      {
        id: '2',
        title: '编程入门指南',
        category: '技术',
        difficulty: 'beginner',
        language: 'zh-CN',
        length: 3000,
        complexity: 40,
        tags: ['编程', '教程', '技术'],
        popularity: 90,
        rating: 4.8,
        readCount: 2000,
        completionRate: 85
      },
      {
        id: '3',
        title: '英语学习材料',
        category: '教育',
        difficulty: 'beginner',
        language: 'en-US',
        length: 2000,
        complexity: 30,
        tags: ['英语', '学习', '教育'],
        popularity: 75,
        rating: 4.2,
        readCount: 800,
        completionRate: 70
      }
    ]
  }

  /**
   * 获取用户偏好
   */
  private static getUserPreferences(userId: string): UserPreference[] {
    try {
      const data = localStorage.getItem(this.PREFERENCES_KEY)
      const allPreferences = data ? JSON.parse(data) : {}
      return allPreferences[userId] || []
    } catch {
      return []
    }
  }

  /**
   * 获取用户行为
   */
  private static getUserBehaviors(userId: string): UserBehavior[] {
    try {
      const data = localStorage.getItem(this.BEHAVIORS_KEY)
      const allBehaviors = data ? JSON.parse(data) : {}
      return allBehaviors[userId] || []
    } catch {
      return []
    }
  }

  /**
   * 获取所有用户行为
   */
  private static getAllUserBehaviors(): Record<string, UserBehavior[]> {
    try {
      const data = localStorage.getItem(this.BEHAVIORS_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  /**
   * 保存推荐结果
   */
  private static saveRecommendations(userId: string, recommendations: Recommendation[]): void {
    try {
      const data = localStorage.getItem(this.RECOMMENDATIONS_KEY)
      const allRecommendations = data ? JSON.parse(data) : {}
      allRecommendations[userId] = recommendations
      localStorage.setItem(this.RECOMMENDATIONS_KEY, JSON.stringify(allRecommendations))
    } catch (error) {
      console.error('保存推荐失败:', error)
    }
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
