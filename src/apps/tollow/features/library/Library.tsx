// @ts-nocheck
/* eslint-disable */
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import booksData from '../../data/books.json'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { ROUTES } from '../../routes'
import type { BookManifest } from '../../types/books'
import '../../styles/LibraryNewspaper.css'

const books = booksData as BookManifest[]

const categoryDetails: Record<string, { label: string; icon: string }> = {
  'chinese-classic': { label: '古典文学', icon: '📚' },
  'english-classic': { label: '英文名著', icon: '📖' },
}

const getDailyFeatured = (): BookManifest => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86_400_000)

  return books[dayOfYear % books.length]
}

const getLanguageLabel = (locale: string): string =>
  locale.toLowerCase().startsWith('zh') ? '中文' : 'English'

const getBookSizeLabel = (book: BookManifest): string => {
  if (book.locale.toLowerCase().startsWith('zh')) {
    return `${book.totals.graphemeCount.toLocaleString()} 字`
  }

  return `${book.totals.wordCount.toLocaleString()} words`
}

const Library: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')

  usePerformanceMonitor('Library')

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))),
    []
  )
  const filteredBooks = activeCategory === 'all'
    ? books
    : books.filter((book) => book.category === activeCategory)
  const dailyFeatured = getDailyFeatured()

  const openBook = useCallback((bookId: string) => {
    navigate(ROUTES.BOOK_DETAILS(bookId))
  }, [navigate])

  const handleCardKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLElement>,
    bookId: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openBook(bookId)
    }
  }, [openBook])

  return (
    <div className="library-newspaper">
      <header className="library-masthead">
        <div className="masthead-title">
          <h1>Tollow</h1>
          <p className="masthead-subtitle">打字练习 · 每日精进</p>
        </div>
        <div className="masthead-actions">
          <button
            type="button"
            onClick={() => navigate(ROUTES.UPLOAD)}
            className="btn btn-primary"
          >
            📁 上传文件
          </button>
        </div>
      </header>

      <section className="featured-section" aria-labelledby="daily-featured-label">
        <div id="daily-featured-label" className="section-label">每日推荐</div>
        <article
          className="featured-article"
          role="link"
          tabIndex={0}
          aria-label={`查看今日推荐《${dailyFeatured.title}》章节`}
          onClick={() => openBook(dailyFeatured.id)}
          onKeyDown={(event) => handleCardKeyDown(event, dailyFeatured.id)}
        >
          <div className="featured-content">
            <span className="featured-badge">{getLanguageLabel(dailyFeatured.locale)}</span>
            <h2 className="featured-title">{dailyFeatured.title}</h2>
            <p className="featured-author">{dailyFeatured.author}</p>
            <p className="featured-desc">{dailyFeatured.description}</p>
            <div className="featured-meta">
              <span className={`difficulty difficulty-${dailyFeatured.difficulty.toLowerCase()}`}>
                {dailyFeatured.difficulty}
              </span>
              <span className="complete-badge">完整原文</span>
              <span className="word-count">{getBookSizeLabel(dailyFeatured)}</span>
            </div>
          </div>
          <div className="featured-cover" aria-hidden="true">{dailyFeatured.cover}</div>
        </article>
      </section>

      <nav className="category-nav" aria-label="书籍分类">
        <button
          type="button"
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          全部
        </button>
        {categories.map((category) => {
          const details = categoryDetails[category] ?? { label: category, icon: '📄' }

          return (
            <button
              type="button"
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {details.icon} {details.label}
            </button>
          )
        })}
      </nav>

      <section className="columns-section" aria-labelledby="library-list-label">
        <div id="library-list-label" className="section-label">精选书单</div>
        <div className="books-grid-newspaper">
          {filteredBooks.map((book) => (
            <article
              key={book.id}
              className="book-article"
              role="link"
              tabIndex={0}
              aria-label={`查看《${book.title}》章节`}
              onClick={() => openBook(book.id)}
              onKeyDown={(event) => handleCardKeyDown(event, book.id)}
            >
              <div className="book-article-header">
                <span className="book-cover-large" aria-hidden="true">{book.cover}</span>
                <div className="book-article-meta">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
              </div>
              <p className="book-description">{book.description}</p>
              <div className="book-footer">
                <span className={`difficulty difficulty-${book.difficulty.toLowerCase()}`}>
                  {book.difficulty}
                </span>
                <span className="complete-badge">完整原文</span>
                <span className="word-count">{getBookSizeLabel(book)}</span>
                <span className="preview-btn" aria-hidden="true">查看章节</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="briefs-section" aria-labelledby="library-benefits-label">
        <div id="library-benefits-label" className="section-label">为什么选择 Tollow</div>
        <div className="briefs-grid">
          <div className="brief-card">
            <div className="brief-icon" aria-hidden="true">⚡️</div>
            <h3>沉浸练习</h3>
            <p>在原文上直接打字，保持注意力与节奏</p>
          </div>
          <div className="brief-card">
            <div className="brief-icon" aria-hidden="true">📈</div>
            <h3>实时统计</h3>
            <p>速度、准确率、错误分布一目了然</p>
          </div>
          <div className="brief-card">
            <div className="brief-icon" aria-hidden="true">🧩</div>
            <h3>多格式支持</h3>
            <p>TXT/MD/HTML/DOCX/PDF 快速导入</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Library
