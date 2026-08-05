// @ts-nocheck
/* eslint-disable */
export interface UserPreference {
  id: string
  userId: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  interest: number // 0-100
  lastUpdated: Date
}

export interface ContentMetadata {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  length: number
  complexity: number // 0-100
  tags: string[]
  popularity: number
  rating: number
  readCount: number
  completionRate: number
}

export interface Recommendation {
  id: string
  userId: string
  contentId: string
  score: number // 0-100
  reason: string
  category: string
  confidence: number // 0-100
  createdAt: Date
  expiresAt: Date
}

export interface RecommendationEngine {
  name: string
  description: string
  algorithm: string
  parameters: Record<string, any>
  performance: {
    accuracy: number
    precision: number
    recall: number
    f1Score: number
  }
}

export interface UserBehavior {
  id: string
  userId: string
  action: 'view' | 'start' | 'complete' | 'abandon' | 'rate'
  contentId: string
  timestamp: Date
  duration?: number
  rating?: number
  feedback?: string
}

export interface CollaborativeFiltering {
  similarUsers: Array<{
    userId: string
    similarity: number
    commonInterests: string[]
  }>
  recommendedContent: Array<{
    contentId: string
    score: number
    reason: string
  }>
}

export interface ContentBasedFiltering {
  userProfile: {
    preferredCategories: string[]
    preferredDifficulty: string
    preferredLength: number
    preferredLanguage: string
  }
  contentMatches: Array<{
    contentId: string
    matchScore: number
    matchingFeatures: string[]
  }>
}
