// @ts-nocheck
/* eslint-disable */
export interface CollaborationRoom {
  id: string
  name: string
  description?: string
  hostId: string
  participants: Participant[]
  maxParticipants: number
  status: 'waiting' | 'active' | 'completed' | 'cancelled'
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
  settings: RoomSettings
}

export interface Participant {
  id: string
  username: string
  avatar?: string
  joinedAt: Date
  isHost: boolean
  isReady: boolean
  progress: number
  wpm: number
  accuracy: number
  currentPosition: number
  lastActivity: Date
}

export interface RoomSettings {
  textSource: 'file' | 'generated' | 'custom'
  textContent?: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number // 秒
  wordCount?: number
  allowSpectators: boolean
  autoStart: boolean
  countdown: number // 秒
}

export interface CollaborationEvent {
  id: string
  roomId: string
  type: 'join' | 'leave' | 'ready' | 'start' | 'progress' | 'complete' | 'message'
  userId: string
  username: string
  timestamp: Date
  data?: any
}

export interface CollaborationMessage {
  id: string
  roomId: string
  userId: string
  username: string
  message: string
  timestamp: Date
  type: 'chat' | 'system' | 'progress'
}

export interface CollaborationStats {
  roomId: string
  totalParticipants: number
  averageWPM: number
  averageAccuracy: number
  fastestCompletion: number
  slowestCompletion: number
  completionRate: number
  totalTime: number
}

export interface RoomInvitation {
  id: string
  roomId: string
  invitedUserId: string
  invitedBy: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: Date
  expiresAt: Date
  message?: string
}

export interface CollaborationLeaderboard {
  roomId: string
  participants: Array<{
    userId: string
    username: string
    avatar?: string
    wpm: number
    accuracy: number
    completionTime: number
    rank: number
  }>
  updatedAt: Date
}
