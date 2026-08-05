// @ts-nocheck
/* eslint-disable */
import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  text?: string
  overlay?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  text,
  overlay = false
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const spinner = (
    <div className="loading-spinner">
      <div
        className={`spinner ${sizeMap[size]}`}
        style={{ borderTopColor: color }}
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
