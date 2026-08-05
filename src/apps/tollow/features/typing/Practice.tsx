// @ts-nocheck
/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import booksJson from '../../data/books.json'
import { ROUTES } from '../../routes'
import { useAppStore } from '../../stores/appStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { loadBookSection } from '../../services/bookTextLoader'
import { bookProgressService } from '../../services/bookProgressService'
import type { BookManifest, BookProgress } from '../../types/books'
import type { BookPracticeContext, TextContent } from '../../types/types'
import {
  splitGraphemes,
  splitPracticeSegments,
} from '../../utils/textSegmentation'
import TypingPractice from './TypingPractice'

const books = booksJson as BookManifest[]

function createBookText(
  book: BookManifest,
  sectionIndex: number,
  segmentIndex: number,
  segments: string[],
  offset = 0
): TextContent {
  const section = book.sections[sectionIndex]
  const context: BookPracticeContext = {
    bookId: book.id,
    sectionId: section.id,
    sectionIndex,
    sectionTitle: section.title,
    segmentIndex,
    segmentCount: segments.length,
    offset,
  }

  return {
    title: book.title,
    content: segments[segmentIndex],
    source: `${book.author} · ${book.title}`,
    type: 'text',
    book: context,
  }
}

const Practice: React.FC = () => {
  const navigate = useNavigate()
  const { currentText, setCurrentText } = useAppStore()
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [advanceError, setAdvanceError] = useState('')
  const [isBookComplete, setIsBookComplete] = useState(false)
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingProgressRef = useRef<BookProgress | null>(null)
  const advanceAbortControllerRef = useRef<AbortController | null>(null)
  const advanceRequestIdRef = useRef(0)

  usePerformanceMonitor('Practice')

  const currentBook = useMemo(
    () =>
      currentText?.book
        ? books.find(book => book.id === currentText.book?.bookId)
        : undefined,
    [currentText?.book]
  )

  const persistPendingProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current)
      progressTimerRef.current = null
    }
    if (pendingProgressRef.current) {
      bookProgressService.saveProgress(pendingProgressRef.current)
      pendingProgressRef.current = null
    }
  }, [])

  const cancelAdvance = useCallback(() => {
    advanceRequestIdRef.current += 1
    advanceAbortControllerRef.current?.abort()
    advanceAbortControllerRef.current = null
  }, [])

  useEffect(
    () => () => {
      cancelAdvance()
      persistPendingProgress()
    },
    [cancelAdvance, persistPendingProgress]
  )

  const handleProgress = useCallback(
    (offset: number) => {
      const context = currentText?.book
      if (!context) return

      pendingProgressRef.current = {
        bookId: context.bookId,
        sectionId: context.sectionId,
        segmentIndex: context.segmentIndex,
        offset,
        updatedAt: new Date().toISOString(),
      }
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
      progressTimerRef.current = setTimeout(persistPendingProgress, 300)
    },
    [currentText?.book, persistPendingProgress]
  )

  const handleBack = useCallback(() => {
    cancelAdvance()
    setIsAdvancing(false)
    setAdvanceError('')
    persistPendingProgress()
    const bookId = currentText?.book?.bookId
    setCurrentText(null)
    navigate(bookId ? `/library/${bookId}` : ROUTES.LIBRARY)
  }, [
    cancelAdvance,
    currentText?.book?.bookId,
    navigate,
    persistPendingProgress,
    setCurrentText,
  ])

  const handleSegmentComplete = useCallback(async () => {
    const context = currentText?.book
    if (!context || !currentBook || isAdvancing) return

    setIsAdvancing(true)
    setAdvanceError('')
    persistPendingProgress()
    cancelAdvance()
    const controller = new AbortController()
    const requestId = advanceRequestIdRef.current
    advanceAbortControllerRef.current = controller
    const isCurrentRequest = () =>
      advanceRequestIdRef.current === requestId && !controller.signal.aborted

    try {
      const currentSectionIndex = currentBook.sections.findIndex(
        section => section.id === context.sectionId
      )
      if (currentSectionIndex < 0) throw new Error('当前章节不在书目清单中')

      const currentSection = currentBook.sections[currentSectionIndex]
      const currentSectionContent = await loadBookSection(
        currentSection,
        controller.signal
      )
      if (!isCurrentRequest()) return
      const currentSegments = splitPracticeSegments(
        currentSectionContent,
        currentBook.locale
      )
      const nextSegmentIndex = context.segmentIndex + 1

      if (nextSegmentIndex < currentSegments.length) {
        const nextText = createBookText(
          currentBook,
          currentSectionIndex,
          nextSegmentIndex,
          currentSegments
        )
        setCurrentText(nextText)
        bookProgressService.saveProgress({
          bookId: currentBook.id,
          sectionId: currentSection.id,
          segmentIndex: nextSegmentIndex,
          offset: 0,
          updatedAt: new Date().toISOString(),
        })
        return
      }

      const nextSectionIndex = currentSectionIndex + 1
      const nextSection = currentBook.sections[nextSectionIndex]
      if (!nextSection) {
        bookProgressService.saveProgress({
          bookId: currentBook.id,
          sectionId: currentSection.id,
          segmentIndex: context.segmentIndex,
          offset: splitGraphemes(currentText.content).length,
          updatedAt: new Date().toISOString(),
        })
        setIsBookComplete(true)
        return
      }

      const nextSectionContent = await loadBookSection(
        nextSection,
        controller.signal
      )
      if (!isCurrentRequest()) return
      const nextSectionSegments = splitPracticeSegments(
        nextSectionContent,
        currentBook.locale
      )
      const nextText = createBookText(
        currentBook,
        nextSectionIndex,
        0,
        nextSectionSegments
      )
      setCurrentText(nextText)
      bookProgressService.saveProgress({
        bookId: currentBook.id,
        sectionId: nextSection.id,
        segmentIndex: 0,
        offset: 0,
        updatedAt: new Date().toISOString(),
      })
    } catch {
      if (isCurrentRequest()) {
        setAdvanceError('下一练习段加载失败，请重试。')
      }
    } finally {
      if (advanceRequestIdRef.current === requestId) {
        advanceAbortControllerRef.current = null
        setIsAdvancing(false)
      }
    }
  }, [
    cancelAdvance,
    currentBook,
    currentText,
    isAdvancing,
    persistPendingProgress,
    setCurrentText,
  ])

  if (!currentText) {
    return (
      <div className='practice-error'>
        <h2>❌ 没有可练习的文本</h2>
        <p>请先选择一本书或上传文件</p>
        <button onClick={handleBack} className='btn btn-primary'>
          返回书库
        </button>
      </div>
    )
  }

  if (isBookComplete && currentBook) {
    return (
      <div className='practice-error practice-complete'>
        <h2>🎉 已完成《{currentBook.title}》</h2>
        <p>全书所有章节均已完成。</p>
        <button onClick={handleBack} className='btn btn-primary'>
          返回书籍
        </button>
      </div>
    )
  }

  const practiceKey = currentText.book
    ? `${currentText.book.bookId}:${currentText.book.sectionId}:${currentText.book.segmentIndex}`
    : `${currentText.title}:${currentText.content.length}`

  return (
    <div className='practice-page'>
      <div className='practice-header'>
        <button onClick={handleBack} className='btn btn-secondary'>
          ← 返回书库
        </button>
        <h1>⌨️ 打字练习</h1>
        <p>正在练习: {currentText.title}</p>
        {currentText.book && currentBook && (
          <p>
            第 {currentText.book.sectionIndex + 1}/{currentBook.sections.length}{' '}
            章 · 第 {currentText.book.segmentIndex + 1}/
            {currentText.book.segmentCount} 段
          </p>
        )}
      </div>

      {advanceError && (
        <div className='practice-load-error' role='alert'>
          {advanceError}
          <button className='btn btn-secondary' onClick={handleSegmentComplete}>
            重试
          </button>
        </div>
      )}
      {isAdvancing && <p className='practice-loading'>正在加载下一练习段…</p>}

      <TypingPractice
        key={practiceKey}
        textContent={currentText}
        initialPosition={currentText.book?.offset || 0}
        onProgress={currentText.book ? handleProgress : undefined}
        onComplete={currentText.book ? handleSegmentComplete : undefined}
        onBack={handleBack}
      />
    </div>
  )
}

export default Practice
