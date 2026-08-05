// @ts-nocheck
/* eslint-disable */
import React from 'react'
import '../../styles/BookLibrary.css'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover: string
  wordCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: string
}

interface BookLibraryProps {
  onBookSelect: (book: Book) => void
  onFileUpload: () => void
}

const BookLibrary: React.FC<BookLibraryProps> = ({ onBookSelect, onFileUpload }) => {
  const books: Book[] = [
    {
      id: '1',
      title: '红楼梦',
      author: '曹雪芹',
      description: '中国古典四大名著之一，描写贾宝玉和林黛玉的爱情悲剧。',
      cover: '📚',
      wordCount: 120000,
      difficulty: 'Medium',
      language: '中文'
    },
    {
      id: '2',
      title: '西游记',
      author: '吴承恩',
      description: '中国古典四大名著之一，讲述孙悟空保护唐僧西天取经的故事。',
      cover: '🐒',
      wordCount: 100000,
      difficulty: 'Easy',
      language: '中文'
    },
    {
      id: '3',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: '英国经典小说，讲述伊丽莎白·班纳特与达西先生的爱情故事。',
      cover: '🇬🇧',
      wordCount: 80000,
      difficulty: 'Medium',
      language: 'English'
    }
  ]

  return (
    <div className="book-library">
      <div className="library-header">
        <h1>选择您的练习材料</h1>
        <p>通过重新输入整本书来练习打字 — 提升您的打字技能</p>
      </div>

      <div className="upload-section">
        <div className="upload-card" onClick={onFileUpload}>
          <div className="upload-icon">📁</div>
          <h3>导入您自己的书籍</h3>
          <p>支持 .txt 和 .epub 格式</p>
          <button className="btn btn-primary">选择文件</button>
        </div>
      </div>

      <div className="books-section">
        <h2>推荐书籍</h2>
        <div className="books-grid">
          {books.map(book => (
            <div key={book.id} className="book-card" onClick={() => onBookSelect(book)}>
              <div className="book-cover">{book.cover}</div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">作者：{book.author}</p>
                <p className="book-description">{book.description}</p>
                <div className="book-meta">
                  <span className="difficulty difficulty-{book.difficulty.toLowerCase()}">{book.difficulty}</span>
                  <span className="word-count">{book.wordCount.toLocaleString()} 字</span>
                  <span className="language">{book.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>为什么选择我们？</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>精准练习</h3>
            <p>逐字对比，实时反馈，帮助您提高打字准确性</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>详细统计</h3>
            <p>WPM、准确率、错误分析，全面了解您的进步</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>持续提升</h3>
            <p>多种难度和语言，满足不同阶段的学习需求</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookLibrary
