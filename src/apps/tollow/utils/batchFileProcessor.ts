// @ts-nocheck
/* eslint-disable */
import { MultiFormatFileProcessor, ProcessedFile } from './fileProcessors'

export interface BatchProcessResult {
  success: ProcessedFile[]
  failed: Array<{ file: File; error: string }>
  total: number
  successCount: number
  failedCount: number
}

export interface BatchProcessOptions {
  maxConcurrent?: number
  onProgress?: (current: number, total: number) => void
  onFileProcessed?: (file: File, result: ProcessedFile | null, error?: string) => void
}

/**
 * 批量文件处理器
 */
export class BatchFileProcessor {
  /**
   * 批量处理文件
   */
  static async processFiles(
    files: File[],
    options: BatchProcessOptions = {}
  ): Promise<BatchProcessResult> {
    const {
      maxConcurrent = 3,
      onProgress,
      onFileProcessed
    } = options

    const result: BatchProcessResult = {
      success: [],
      failed: [],
      total: files.length,
      successCount: 0,
      failedCount: 0
    }

    // 分批处理文件
    for (let i = 0; i < files.length; i += maxConcurrent) {
      const batch = files.slice(i, i + maxConcurrent)
      const batchPromises = batch.map(async (file) => {
        try {
          // 检查文件格式
          if (!MultiFormatFileProcessor.isFormatSupported(file.name)) {
            const error = `不支持的文件格式: ${file.name.split('.').pop()}`
            result.failed.push({ file, error })
            result.failedCount++
            onFileProcessed?.(file, null, error)
            return
          }

          // 检查文件大小
          if (!MultiFormatFileProcessor.isFileSizeValid(file)) {
            const error = `文件过大: ${file.name}`
            result.failed.push({ file, error })
            result.failedCount++
            onFileProcessed?.(file, null, error)
            return
          }

          // 处理文件
          const processedFile = await MultiFormatFileProcessor.processFile(file)
          result.success.push(processedFile)
          result.successCount++
          onFileProcessed?.(file, processedFile)
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : '未知错误'
          result.failed.push({ file, error: errorMsg })
          result.failedCount++
          onFileProcessed?.(file, null, errorMsg)
        }
      })

      // 等待当前批次完成
      await Promise.all(batchPromises)
      
      // 更新进度
      onProgress?.(Math.min(i + maxConcurrent, files.length), files.length)
    }

    return result
  }

  /**
   * 验证文件列表
   */
  static validateFiles(files: File[]): Array<{ file: File; valid: boolean; error?: string }> {
    return files.map(file => {
      if (!MultiFormatFileProcessor.isFormatSupported(file.name)) {
        return {
          file,
          valid: false,
          error: `不支持的文件格式: ${file.name.split('.').pop()}`
        }
      }

      if (!MultiFormatFileProcessor.isFileSizeValid(file)) {
        return {
          file,
          valid: false,
          error: `文件过大，最大支持 ${MultiFormatFileProcessor.getFileSizeLimit() / (1024 * 1024)}MB`
        }
      }

      return { file, valid: true }
    })
  }

  /**
   * 获取文件统计信息
   */
  static getFileStats(files: File[]): {
    totalSize: number
    formatCount: Record<string, number>
    validCount: number
    invalidCount: number
  } {
    const formatCount: Record<string, number> = {}
    let totalSize = 0
    let validCount = 0
    let invalidCount = 0

    files.forEach(file => {
      totalSize += file.size
      const extension = file.name.toLowerCase().split('.').pop() || 'unknown'
      formatCount[extension] = (formatCount[extension] || 0) + 1

      if (MultiFormatFileProcessor.isFormatSupported(file.name) && 
          MultiFormatFileProcessor.isFileSizeValid(file)) {
        validCount++
      } else {
        invalidCount++
      }
    })

    return {
      totalSize,
      formatCount,
      validCount,
      invalidCount
    }
  }

  /**
   * 创建文件组
   */
  static groupFilesByFormat(files: File[]): Record<string, File[]> {
    const groups: Record<string, File[]> = {}

    files.forEach(file => {
      const extension = file.name.toLowerCase().split('.').pop() || 'unknown'
      if (!groups[extension]) {
        groups[extension] = []
      }
      groups[extension].push(file)
    })

    return groups
  }

  /**
   * 过滤有效文件
   */
  static filterValidFiles(files: File[]): File[] {
    return files.filter(file => 
      MultiFormatFileProcessor.isFormatSupported(file.name) && 
      MultiFormatFileProcessor.isFileSizeValid(file)
    )
  }
}
