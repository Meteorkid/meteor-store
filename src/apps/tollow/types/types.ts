// @ts-nocheck
/* eslint-disable */
export interface BookPracticeContext {
  bookId: string
  sectionId: string
  sectionIndex: number
  sectionTitle: string
  segmentIndex: number
  segmentCount: number
  offset: number
}

export interface TextContent {
  title: string
  content: string
  source: string
  type: 'text' | 'epub' | 'doc' | 'docx' | 'pdf' | 'rtf' | 'odt' | 'html' | 'md'
  book?: BookPracticeContext
}

export interface RecentText {
  title: string
  source: string
  type: TextContent['type']
  bookId?: string
  sectionId?: string
  sectionTitle?: string
  updatedAt: string
}

export interface TypingStats {
  wpm: number
  accuracy: number
  totalWords: number
  typedWords: number
  errors: number
  timeElapsed: number
}

export interface TypingProgress {
  currentPosition: number
  typedText: string
  errors: number[]
  startTime: number
  isComplete: boolean
}
