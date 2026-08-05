// @ts-nocheck
/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import booksData from '../../data/books.json'
import { ROUTES } from '../../routes'
import { bookProgressService } from '../../services/bookProgressService'
import { loadBookSection } from '../../services/bookTextLoader'
import { useAppStore } from '../../stores/appStore'
import type { BookManifest, BookProgress, BookSection } from '../../types/books'
import {
  splitGraphemes,
  splitPracticeSegments,
} from '../../utils/textSegmentation'
import '../../styles/LibraryNewspaper.css'
import '../../styles/BookDetails.css'

const books = booksData as BookManifest[]

type RetryRequest =
  | {
      mode: 'practice'
      section: BookSection
      segmentIndex: number
      offset: number
    }
  | {
      mode: 'preview'
      section: BookSection
    }

interface SectionPreview {
  section: BookSection
  text: string
}

const getBookSizeLabel = (book: BookManifest): string => {
  if (book.locale.toLowerCase().startsWith('zh')) {
    return `${book.totals.graphemeCount.toLocaleString()} 字`
  }

  return `${book.totals.wordCount.toLocaleString()} words`
}

const isAbortError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false

  const candidate = error as { code?: string; name?: string }
  return candidate.code === 'ABORTED' || candidate.name === 'AbortError'
}

const BookDetails: React.FC = () => {
  const navigate = useNavigate()
  const { bookId } = useParams<{ bookId: string }>()
  const book = books.find(item => item.id === bookId)
  const { addRecentText, setCurrentText } = useAppStore()
  const [loadingSectionId, setLoadingSectionId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retryRequest, setRetryRequest] = useState<RetryRequest | null>(null)
  const [preview, setPreview] = useState<SectionPreview | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const progress = useMemo<BookProgress | null>(
    () => (book ? bookProgressService.getProgress(book.id) : null),
    [book]
  )
  const progressSection = progress
    ? book?.sections.find(section => section.id === progress.sectionId)
    : undefined

  useEffect(
    () => () => {
      requestIdRef.current += 1
      abortControllerRef.current?.abort()
    },
    []
  )

  const startPractice = useCallback(
    async (section: BookSection, requestedSegmentIndex = 0, offset = 0) => {
      if (!book) return

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      const requestId = requestIdRef.current + 1
      abortControllerRef.current = controller
      requestIdRef.current = requestId
      setLoadingSectionId(section.id)
      setLoadError(null)
      setRetryRequest(null)

      try {
        const content = await loadBookSection(section, controller.signal)
        const segments = splitPracticeSegments(content, book.locale)

        if (requestId !== requestIdRef.current || controller.signal.aborted)
          return
        if (segments.length === 0) {
          setLoadError('这一章没有可练习的正文，请选择其他章节。')
          setRetryRequest({
            mode: 'practice',
            section,
            segmentIndex: requestedSegmentIndex,
            offset,
          })
          return
        }

        const segmentIndex = Math.min(
          Math.max(0, requestedSegmentIndex),
          segments.length - 1
        )
        const sectionIndex = book.sections.findIndex(
          item => item.id === section.id
        )
        const textContent = {
          title: `${book.title} · ${section.title}`,
          content: segments[segmentIndex],
          source: `${book.author} · ${book.title}`,
          type: 'text' as const,
          book: {
            bookId: book.id,
            sectionId: section.id,
            sectionIndex,
            segmentIndex,
            segmentCount: segments.length,
            offset: segmentIndex === requestedSegmentIndex ? offset : 0,
            sectionTitle: section.title,
          },
        }

        setCurrentText(textContent)
        addRecentText(textContent)
        navigate(ROUTES.PRACTICE)
      } catch (error) {
        if (
          requestId !== requestIdRef.current ||
          controller.signal.aborted ||
          isAbortError(error)
        ) {
          return
        }

        setLoadError('章节加载失败，请检查网络后重试。')
        setRetryRequest({
          mode: 'practice',
          section,
          segmentIndex: requestedSegmentIndex,
          offset,
        })
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingSectionId(null)
        }
      }
    },
    [addRecentText, book, navigate, setCurrentText]
  )

  const loadPreview = useCallback(
    async (section: BookSection) => {
      if (!book) return

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      const requestId = requestIdRef.current + 1
      abortControllerRef.current = controller
      requestIdRef.current = requestId
      setLoadingSectionId(section.id)
      setLoadError(null)
      setRetryRequest(null)

      try {
        const content = await loadBookSection(section, controller.signal)
        const graphemes = splitGraphemes(content, book.locale)

        if (requestId !== requestIdRef.current || controller.signal.aborted)
          return

        setPreview({
          section,
          text: `${graphemes.slice(0, 500).join('')}${graphemes.length > 500 ? '…' : ''}`,
        })
      } catch (error) {
        if (
          requestId !== requestIdRef.current ||
          controller.signal.aborted ||
          isAbortError(error)
        ) {
          return
        }

        setLoadError('章节预览加载失败，请检查网络后重试。')
        setRetryRequest({ mode: 'preview', section })
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingSectionId(null)
        }
      }
    },
    [book]
  )

  if (!book) {
    return (
      <main className='book-details book-details-empty'>
        <p className='section-label'>书籍未找到</p>
        <h1>这本书不在当前书库中</h1>
        <p>它可能已下架，或链接地址有误。</p>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => navigate(ROUTES.LIBRARY)}
        >
          返回书库
        </button>
      </main>
    )
  }

  return (
    <main className='book-details'>
      <button
        type='button'
        className='book-details-back'
        onClick={() => navigate(ROUTES.LIBRARY)}
      >
        ← 返回书库
      </button>

      <header className='book-details-header'>
        <div className='book-details-cover' aria-hidden='true'>
          {book.cover}
        </div>
        <div className='book-details-heading'>
          <span className='complete-badge'>完整原文</span>
          <h1>{book.title}</h1>
          <p className='book-details-author'>{book.author}</p>
          <p className='book-details-description'>{book.description}</p>
          <div className='book-details-meta' aria-label='全书统计'>
            <span>{book.sections.length} 章</span>
            <span>{getBookSizeLabel(book)}</span>
            <span
              className={`difficulty difficulty-${book.difficulty.toLowerCase()}`}
            >
              {book.difficulty}
            </span>
          </div>
          <div className='book-details-primary-actions'>
            {progress && progressSection && (
              <button
                type='button'
                className='btn btn-primary'
                aria-busy={loadingSectionId === progressSection.id}
                onClick={() =>
                  startPractice(
                    progressSection,
                    progress.segmentIndex,
                    progress.offset
                  )
                }
              >
                继续练习
              </button>
            )}
            <button
              type='button'
              className={
                progressSection ? 'btn btn-secondary' : 'btn btn-primary'
              }
              aria-busy={loadingSectionId === book.sections[0].id}
              onClick={() => startPractice(book.sections[0])}
            >
              从第一章开始
            </button>
          </div>
          {loadError && (
            <div className='book-load-error' role='alert'>
              <span>{loadError}</span>
              {retryRequest && (
                <button
                  type='button'
                  className='book-retry-button'
                  onClick={() => {
                    if (retryRequest.mode === 'preview') {
                      loadPreview(retryRequest.section)
                      return
                    }

                    startPractice(
                      retryRequest.section,
                      retryRequest.segmentIndex,
                      retryRequest.offset
                    )
                  }}
                >
                  重试
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {preview && (
        <section
          className='book-preview'
          aria-label={`${preview.section.title}章节预览`}
          aria-live='polite'
        >
          <div className='book-preview-header'>
            <div>
              <div className='section-label'>章节预览</div>
              <h2>预览 · {preview.section.title}</h2>
            </div>
            <button
              type='button'
              className='preview-close'
              aria-label='关闭预览'
              onClick={() => setPreview(null)}
            >
              ✕
            </button>
          </div>
          <pre>{preview.text}</pre>
          <div className='book-preview-actions'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => setPreview(null)}
            >
              关闭预览
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => startPractice(preview.section)}
            >
              开始本章练习
            </button>
          </div>
        </section>
      )}

      <div className='book-details-layout'>
        <section
          className='book-sections'
          aria-labelledby='book-sections-title'
        >
          <div className='section-label'>全文目录</div>
          <h2 id='book-sections-title'>章节目录</h2>
          <ol className='book-section-list'>
            {book.sections.map((section, index) => (
              <li key={section.id} className='book-section-item'>
                <span className='book-section-number'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className='book-section-copy'>
                  <h3>{section.title}</h3>
                  <p>
                    {book.locale.toLowerCase().startsWith('zh')
                      ? `${section.graphemeCount.toLocaleString()} 字`
                      : `${section.wordCount.toLocaleString()} words`}
                  </p>
                </div>
                <div className='book-section-actions'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    aria-label={`预览 ${section.title}`}
                    aria-busy={loadingSectionId === section.id}
                    onClick={() => loadPreview(section)}
                  >
                    {loadingSectionId === section.id ? '加载中…' : '预览'}
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    aria-label={`开始练习 ${section.title}`}
                    aria-busy={loadingSectionId === section.id}
                    onClick={() => startPractice(section)}
                  >
                    {loadingSectionId === section.id ? '加载中…' : '开始练习'}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className='book-rights' aria-labelledby='book-rights-title'>
          <div className='section-label'>来源与版权</div>
          <h2 id='book-rights-title'>版本说明</h2>
          <dl>
            <div>
              <dt>版本</dt>
              <dd>{book.rights.edition}</dd>
            </div>
            <div>
              <dt>许可</dt>
              <dd>{book.rights.editionLicense}</dd>
            </div>
            <div>
              <dt>审查日期</dt>
              <dd>{book.rights.reviewedAt}</dd>
            </div>
          </dl>
          <a
            className='book-source-link'
            href={book.rights.editionSourceUrl}
            target='_blank'
            rel='noreferrer'
          >
            查看原始版本来源
          </a>
          <p className='book-rights-note'>
            本书按多地区保守规则审查，仅收录原文，不含现代译注。
          </p>
        </aside>
      </div>
    </main>
  )
}

export default BookDetails
