// @ts-nocheck
/* eslint-disable */
export interface LearningProgress {
  id: string
  userId: string
  fileId: string
  fileName: string
  totalPracticeTime: number
  totalWordsTyped: number
  averageWPM: number
  bestWPM: number
  totalAccuracy: number
  practiceSessions: PracticeSession[]
  lastPracticed: Date
  progressPercentage: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedCompletionTime: number
}

export interface PracticeSession {
  id: string
  startTime: Date
  endTime: Date
  duration: number
  wordsTyped: number
  wpm: number
  accuracy: number
  errors: number
  mistakes: Mistake[]
}

export interface Mistake {
  id: string
  character: string
  expected: string
  typed: string
  position: number
  timestamp: Date
  corrected: boolean
}

export interface ProgressGoal {
  id: string
  userId: string
  title: string
  description: string
  targetWPM: number
  targetAccuracy: number
  targetPracticeTime: number
  deadline: Date
  progress: number
  isCompleted: boolean
  createdAt: Date
}

export interface ProgressStats {
  totalFiles: number
  totalPracticeTime: number
  totalWordsTyped: number
  averageWPM: number
  bestWPM: number
  averageAccuracy: number
  practiceDays: number
  currentStreak: number
  longestStreak: number
  weeklyProgress: WeeklyProgress[]
  monthlyProgress: MonthlyProgress[]
}

export interface WeeklyProgress {
  week: string
  practiceTime: number
  wordsTyped: number
  averageWPM: number
  averageAccuracy: number
  practiceDays: number
}

export interface MonthlyProgress {
  month: string
  practiceTime: number
  wordsTyped: number
  averageWPM: number
  averageAccuracy: number
  practiceDays: number
  improvement: number
}

export interface ProgressInsight {
  type: 'improvement' | 'milestone' | 'suggestion' | 'warning'
  title: string
  description: string
  data?: any
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}
