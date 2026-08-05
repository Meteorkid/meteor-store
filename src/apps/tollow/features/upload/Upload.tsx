// @ts-nocheck
/* eslint-disable */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { useAppStore } from '../../stores/appStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { logger } from '../../utils/logger'
import FileUpload from './FileUpload'

const Upload: React.FC = () => {
  const navigate = useNavigate()
  const { setCurrentText, addRecentText } = useAppStore()
  
  // 性能监控
  usePerformanceMonitor('Upload')
  
  const handleFileUpload = (textContent: any) => {
    try {
      setCurrentText(textContent)
      addRecentText(textContent)
      
      logger.info('文件上传成功', { 
        title: textContent.title, 
        type: textContent.type,
        contentLength: textContent.content.length 
      })
      
      navigate(ROUTES.PRACTICE)
    } catch (error) {
      logger.error('文件上传处理失败', { error })
    }
  }

  const handleBack = () => {
    navigate(ROUTES.LIBRARY)
  }

  return (
    <div className="upload-page">
      <div className="upload-header">
        <button onClick={handleBack} className="btn btn-secondary">
          ← 返回书库
        </button>
        <h1>📁 文件上传</h1>
        <p>上传您的文档文件进行打字练习</p>
      </div>
      
      <FileUpload onFileUpload={handleFileUpload} onBack={handleBack} />
    </div>
  )
}

export default Upload
