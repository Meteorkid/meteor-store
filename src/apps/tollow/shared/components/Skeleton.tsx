// @ts-nocheck
/* eslint-disable */
import React from 'react'

interface SkeletonProps {
  type: 'text' | 'title' | 'avatar' | 'button' | 'card'
  lines?: number
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ type, lines = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`skeleton text ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className="skeleton-line"
                style={{
                  width: `${Math.random() * 40 + 60}%`,
                  marginBottom: index === lines - 1 ? 0 : '8px'
                }}
              />
            ))}
          </div>
        )
      
      case 'title':
        return (
          <div className={`skeleton title ${className}`}>
            <div className="skeleton-line" style={{ width: '70%', height: '24px' }} />
          </div>
        )
      
      case 'avatar':
        return (
          <div className={`skeleton avatar ${className}`}>
            <div className="skeleton-circle" />
          </div>
        )
      
      case 'button':
        return (
          <div className={`skeleton button ${className}`}>
            <div className="skeleton-line" style={{ width: '80px', height: '36px' }} />
          </div>
        )
      
      case 'card':
        return (
          <div className={`skeleton card ${className}`}>
            <div className="skeleton-line" style={{ width: '100%', height: '120px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '60%', height: '20px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '80%', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '40%', height: '16px' }} />
          </div>
        )
      
      default:
        return null
    }
  }

  return renderSkeleton()
}

export default Skeleton
