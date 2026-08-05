// @ts-nocheck
/* eslint-disable */
import React from 'react'
import { TypingStats as TypingStatsType } from '../types'
import '../../styles/TypingStats.css'

interface TypingStatsProps {
  stats: TypingStatsType
  isComplete: boolean
}

const TypingStats: React.FC<TypingStatsProps> = ({ stats, isComplete }) => {
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${remainingSeconds}s`
  }

  return (
    <div className="typing-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.accuracy}%</div>
            <div className="stat-label">准确率</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.typedWords}</div>
            <div className="stat-label">已打字数</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalWords}</div>
            <div className="stat-label">总字数</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{formatTime(stats.timeElapsed)}</div>
            <div className="stat-label">用时</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.errors}</div>
            <div className="stat-label">错误数</div>
          </div>
        </div>
      </div>
      
      {!isComplete && (
        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.typedWords / stats.totalWords) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            进度: {stats.typedWords} / {stats.totalWords} 词 ({Math.round((stats.typedWords / stats.totalWords) * 100)}%)
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingStats
