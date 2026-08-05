// @ts-nocheck
/* eslint-disable */
import mammoth from 'mammoth'
import { parseDocx } from 'docx'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { htmlToText } from 'html-to-text'

export interface ProcessedFile {
  title: string
  content: string
  type: 'text' | 'epub' | 'doc' | 'docx' | 'pdf' | 'rtf' | 'odt' | 'html' | 'md'
}

/**
 * 处理多种格式的文件
 */
export class MultiFormatFileProcessor {
  /**
   * 处理文件并返回文本内容
   */
  static async processFile(file: File): Promise<ProcessedFile> {
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.split('.').pop() || ''

    try {
      switch (fileExtension) {
        case 'txt':
          return await this.processTextFile(file)
        case 'epub':
          return await this.processEpubFile(file)
        case 'doc':
          return await this.processDocFile(file)
        case 'docx':
          return await this.processDocxFile(file)
        case 'pdf':
          return await this.processPdfFile(file)
        case 'rtf':
          return await this.processRtfFile(file)
        case 'odt':
          return await this.processOdtFile(file)
        case 'html':
        case 'htm':
          return await this.processHtmlFile(file)
        case 'md':
        case 'markdown':
          return await this.processMarkdownFile(file)
        default:
          throw new Error(`不支持的文件格式: ${fileExtension}`)
      }
    } catch (error) {
      throw new Error(`处理${fileExtension}文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理纯文本文件
   */
  private static async processTextFile(file: File): Promise<ProcessedFile> {
    const content = await this.readFileAsText(file)
    return {
      title: this.extractTitle(file.name),
      content: content,
      type: 'text'
    }
  }

  /**
   * 处理EPUB文件
   */
  private static async processEpubFile(file: File): Promise<ProcessedFile> {
    // 简化的EPUB处理，实际项目中可以使用epub.js等库
    const content = await this.readFileAsText(file)
    const cleanContent = content.replace(/<[^>]*>/g, '') // 移除HTML标签
    
    return {
      title: this.extractTitle(file.name),
      content: cleanContent,
      type: 'epub'
    }
  }

  /**
   * 处理DOC文件（使用mammoth）
   */
  private static async processDocFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      const result = await mammoth.extractRawText({ arrayBuffer })
      
      return {
        title: this.extractTitle(file.name),
        content: result.value,
        type: 'doc'
      }
    } catch (error) {
      throw new Error(`DOC文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理DOCX文件
   */
  private static async processDocxFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      const result = await mammoth.extractRawText({ arrayBuffer })
      
      return {
        title: this.extractTitle(file.name),
        content: result.value,
        type: 'docx'
      }
    } catch (error) {
      throw new Error(`DOCX文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理PDF文件
   */
  private static async processPdfFile(file: File): Promise<ProcessedFile> {
    // 浏览器环境下不使用 Node-only 的 pdf-parse，提供安全占位内容，避免上传报错
    const sizeKB = Math.round(file.size / 1024)
    return {
      title: this.extractTitle(file.name),
      content: `【PDF 预览占位】文件名: ${file.name}，大小: ${sizeKB}KB。当前浏览器版本暂不内置解析 PDF 正文，请先转换为 TXT/DOCX/MD，或后续启用服务端解析。`,
      type: 'pdf'
    }
  }

  /**
   * 处理RTF文件
   */
  private static async processRtfFile(file: File): Promise<ProcessedFile> {
    try {
      const content = await this.readFileAsText(file)
      // RTF文件包含格式化标记，需要清理
      const cleanContent = content
        .replace(/\\[a-z]+\d*\s?/g, '') // 移除RTF控制字符
        .replace(/\{[^}]*\}/g, '') // 移除RTF分组
        .replace(/\s+/g, ' ') // 合并多个空格
        .trim()
      
      return {
        title: this.extractTitle(file.name),
        content: cleanContent,
        type: 'rtf'
      }
    } catch (error) {
      throw new Error(`RTF文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理ODT文件
   */
  private static async processOdtFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      // ODT是ZIP格式，包含XML文件，这里简化处理
      const content = await this.readFileAsText(file)
      const cleanContent = content
        .replace(/<[^>]*>/g, '') // 移除XML标签
        .replace(/\s+/g, ' ') // 合并多个空格
        .trim()
      
      return {
        title: this.extractTitle(file.name),
        content: cleanContent,
        type: 'odt'
      }
    } catch (error) {
      throw new Error(`ODT文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理HTML文件
   */
  private static async processHtmlFile(file: File): Promise<ProcessedFile> {
    try {
      const content = await this.readFileAsText(file)
      // 使用html-to-text库提取纯文本
      const textContent = htmlToText(content, {
        wordwrap: 80,
        preserveNewlines: true,
        selectors: [
          { selector: 'script', format: 'skip' },
          { selector: 'style', format: 'skip' },
          { selector: 'nav', format: 'skip' },
          { selector: 'header', format: 'skip' },
          { selector: 'footer', format: 'skip' }
        ]
      })
      
      return {
        title: this.extractTitle(file.name),
        content: textContent,
        type: 'html'
      }
    } catch (error) {
      throw new Error(`HTML文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理Markdown文件
   */
  private static async processMarkdownFile(file: File): Promise<ProcessedFile> {
    try {
      const content = await this.readFileAsText(file)
      // 使用marked库解析Markdown
      const htmlContent = marked(content)
      // 转换为纯文本
      const textContent = htmlToText(htmlContent, {
        wordwrap: 80,
        preserveNewlines: true
      })
      
      return {
        title: this.extractTitle(file.name),
        content: textContent,
        type: 'md'
      }
    } catch (error) {
      throw new Error(`Markdown文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 读取文件为文本
   */
  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('无法读取文件内容'))
        }
      }
      
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file, 'utf-8')
    })
  }

  /**
   * 读取文件为ArrayBuffer
   */
  private static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (result instanceof ArrayBuffer) {
          resolve(result)
        } else {
          reject(new Error('无法读取文件内容'))
        }
      }
      
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 从文件名提取标题
   */
  private static extractTitle(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, '') // 移除文件扩展名
  }

  /**
   * 获取支持的文件格式列表
   */
  static getSupportedFormats(): Array<{ extension: string; name: string; description: string }> {
    return [
      { extension: 'txt', name: '纯文本文件', description: '支持UTF-8编码的文本文件' },
      { extension: 'epub', name: '电子书', description: 'EPUB格式的电子书文件' },
      { extension: 'doc', name: 'Word文档', description: 'Microsoft Word 97-2003文档' },
      { extension: 'docx', name: 'Word文档', description: 'Microsoft Word 2007+文档' },
      { extension: 'pdf', name: 'PDF文档', description: 'Adobe PDF文档' },
      { extension: 'rtf', name: '富文本文件', description: 'Rich Text Format文档' },
      { extension: 'odt', name: 'OpenDocument', description: 'OpenDocument文本格式' },
      { extension: 'html', name: '网页文件', description: 'HTML网页文档' },
      { extension: 'md', name: 'Markdown', description: 'Markdown标记语言文件' }
    ]
  }

  /**
   * 检查文件格式是否支持
   */
  static isFormatSupported(fileName: string): boolean {
    const supportedExtensions = ['txt', 'epub', 'doc', 'docx', 'pdf', 'rtf', 'odt', 'html', 'htm', 'md', 'markdown']
    const fileExtension = fileName.toLowerCase().split('.').pop() || ''
    return supportedExtensions.includes(fileExtension)
  }

  /**
   * 获取文件大小限制（以字节为单位）
   */
  static getFileSizeLimit(): number {
    return 50 * 1024 * 1024 // 50MB
  }

  /**
   * 检查文件大小是否在限制内
   */
  static isFileSizeValid(file: File): boolean {
    return file.size <= this.getFileSizeLimit()
  }
}
