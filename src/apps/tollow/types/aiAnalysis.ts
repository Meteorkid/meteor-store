// @ts-nocheck
/* eslint-disable */
export interface TextAnalysis {
  id: string
  textId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  complexity: number // 0-100
  readability: number // 0-100
  vocabulary: VocabularyAnalysis
  grammar: GrammarAnalysis
  structure: StructureAnalysis
  sentiment: SentimentAnalysis
  topics: TopicAnalysis[]
  suggestions: Suggestion[]
  createdAt: Date
}

export interface VocabularyAnalysis {
  totalWords: number
  uniqueWords: number
  vocabularyDiversity: number // 0-100
  averageWordLength: number
  complexWords: number
  complexWordPercentage: number
  wordFrequency: WordFrequency[]
  difficultyLevel: 'basic' | 'intermediate' | 'advanced'
}

export interface GrammarAnalysis {
  totalSentences: number
  averageSentenceLength: number
  sentenceComplexity: number // 0-100
  grammarErrors: GrammarError[]
  punctuationUsage: PunctuationUsage
  sentenceStructure: SentenceStructure
}

export interface StructureAnalysis {
  paragraphs: number
  averageParagraphLength: number
  logicalFlow: number // 0-100
  coherence: number // 0-100
  organization: 'poor' | 'fair' | 'good' | 'excellent'
  transitions: TransitionAnalysis
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative'
  confidence: number // 0-100
  emotions: Emotion[]
  intensity: number // 0-100
}

export interface TopicAnalysis {
  topic: string
  confidence: number // 0-100
  keywords: string[]
  relevance: number // 0-100
}

export interface Suggestion {
  type: 'improvement' | 'simplification' | 'enhancement'
  category: 'vocabulary' | 'grammar' | 'structure' | 'content'
  description: string
  priority: 'low' | 'medium' | 'high'
  examples?: string[]
}

export interface WordFrequency {
  word: string
  frequency: number
  difficulty: 'basic' | 'intermediate' | 'advanced'
  partOfSpeech: string
}

export interface GrammarError {
  type: string
  description: string
  position: number
  suggestion: string
  severity: 'low' | 'medium' | 'high'
}

export interface PunctuationUsage {
  totalPunctuation: number
  punctuationTypes: Record<string, number>
  consistency: number // 0-100
}

export interface SentenceStructure {
  simple: number
  compound: number
  complex: number
  compoundComplex: number
}

export interface TransitionAnalysis {
  transitionWords: string[]
  transitionCount: number
  flowQuality: number // 0-100
}

export interface Emotion {
  name: string
  intensity: number // 0-100
  confidence: number // 0-100
}

export interface AIAnalysisRequest {
  text: string
  language: string
  analysisType: 'basic' | 'comprehensive' | 'custom'
  customFeatures?: string[]
}

export interface AIAnalysisResponse {
  analysis: TextAnalysis
  processingTime: number
  modelVersion: string
  confidence: number
}
