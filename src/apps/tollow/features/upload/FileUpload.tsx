// @ts-nocheck
/* eslint-disable */
import React, { useState, useRef } from 'react'
import { TextContent } from '../../types'
import { MultiFormatFileProcessor } from '../../utils/fileProcessors'
import '../../styles/FileUpload.css'

interface FileUploadProps {
  onFileUpload: (textContent: TextContent) => void
  onBack?: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onBack }) => {
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setErrorMessage('')
    
    try {
      console.log('开始处理文件:', file.name, '大小:', file.size, '类型:', file.type)
      
      // 检查文件大小
      if (!MultiFormatFileProcessor.isFileSizeValid(file)) {
        throw new Error(`文件过大，最大支持 ${MultiFormatFileProcessor.getFileSizeLimit() / (1024 * 1024)}MB`)
      }
      
      // 检查文件格式
      if (!MultiFormatFileProcessor.isFormatSupported(file.name)) {
        throw new Error(`不支持的文件格式。支持格式: ${MultiFormatFileProcessor.getSupportedFormats().map(f => f.extension).join(', ')}`)
      }
      
      // 使用多格式处理器处理文件
      const processedFile = await MultiFormatFileProcessor.processFile(file)
      
      if (!processedFile.content || processedFile.content.trim().length === 0) {
        throw new Error('文件内容为空，请检查文件是否正确')
      }

      console.log('文件处理成功，内容长度:', processedFile.content.length)

      const textContent: TextContent = {
        title: processedFile.title || '未命名文件',
        content: processedFile.content.trim(),
        source: file.name,
        type: processedFile.type
      }

      onFileUpload(textContent)
    } catch (error) {
      console.error('文件处理错误:', error)
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      setErrorMessage(`处理文件时出错: ${errorMsg}`)
      
      // 延迟清除错误信息
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        console.log('文件读取成功')
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('无法读取文件内容，结果类型错误'))
        }
      }
      
      reader.onerror = (e) => {
        console.error('FileReader错误:', e)
        reject(new Error(`文件读取失败: ${reader.error?.message || '未知错误'}`))
      }
      
      reader.onabort = () => {
        reject(new Error('文件读取被中断'))
      }
      
      try {
        reader.readAsText(file, 'utf-8')
      } catch (error) {
        reject(new Error(`启动文件读取失败: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    })
  }

  const readEpubFile = async (file: File): Promise<{ title: string; content: string }> => {
    // 简化的EPUB处理，实际项目中可以使用epub.js等库
    const content = await readTextFile(file)
    // 这里只是简单提取文本，实际应该解析EPUB结构
    return {
      title: file.name.replace('.epub', ''),
      content: content.replace(/<[^>]*>/g, '') // 移除HTML标签
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="file-upload">
      <div className="upload-section">
        {onBack && (
          <div className="upload-header">
            <button className="btn btn-secondary" onClick={onBack}>
              ← 返回书籍库
            </button>
          </div>
        )}
        
        <h2 className="text-center mb-4">导入您的练习材料</h2>
        <p className="text-center mb-4">
          上传多种格式的文件，开始您的打字练习之旅
        </p>
        
        {errorMessage && (
          <div className="error-message">
            <p>❌ {errorMessage}</p>
          </div>
        )}
        
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="upload-content">
            <div className="upload-icon">📚</div>
            <h3>拖拽文件到这里或点击选择</h3>
            <p>支持多种文档格式</p>
            <button className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? '处理中...' : '选择文件'}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.epub,.doc,.docx,.pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="upload-tips">
          <h4>使用提示：</h4>
          <ul>
            <li>📖 上传您喜欢的书籍或文章</li>
            <li>⌨️ 在打字练习中提升速度和准确性</li>
            <li>📊 跟踪您的进步和统计数据</li>
            <li>🎯 设置个人目标，持续改进</li>
            <li>⚠️ 确保文件编码为UTF-8，避免乱码</li>
          </ul>
        </div>

        <div className="supported-formats">
          <h4>支持的文件格式：</h4>
          <div className="formats-grid">
            {MultiFormatFileProcessor.getSupportedFormats().map((format) => (
              <div key={format.extension} className="format-item">
                <div className="format-icon">
                  {format.extension === 'txt' && '📄'}
                  {format.extension === 'epub' && '📚'}
                  {format.extension === 'doc' && '📝'}
                  {format.extension === 'docx' && '📝'}
                  {format.extension === 'pdf' && '📋'}
                </div>
                <div className="format-info">
                  <strong>.{format.extension}</strong>
                  <span>{format.name}</span>
                  <small>{format.description}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="format-limit">
            <small>文件大小限制: {MultiFormatFileProcessor.getFileSizeLimit() / (1024 * 1024)}MB</small>
          </p>
        </div>

        <div className="test-section">
          <h4>测试文件上传</h4>
          <p>如果遇到问题，可以尝试上传一个简单的.txt文件进行测试</p>
          <div className="test-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                const testContent = "这是一个测试文件。\n\n用于验证文件上传功能是否正常工作。\n\n如果能看到这段文字，说明上传功能正常。"
                const blob = new Blob([testContent], { type: 'text/plain' })
                const testFile = new File([blob], 'test.txt', { type: 'text/plain' })
                handleFile(testFile)
              }}
            >
              创建TXT测试文件
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                const testContent = "这是一个Word文档测试。\n\n用于验证Word文档上传功能是否正常工作。\n\n支持中文和英文内容。"
                const blob = new Blob([testContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
                const testFile = new File([blob], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
                handleFile(testFile)
              }}
            >
              创建DOCX测试文件
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
