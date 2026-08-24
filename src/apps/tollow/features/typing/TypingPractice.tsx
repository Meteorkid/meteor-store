// @ts-nocheck
/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextContent, TypingStats } from '../../types/types'
import { splitGraphemes } from '../../utils/textSegmentation'
import { normalizePracticeInputCharacter } from '../../utils/typingInput'
import FavoriteComposer from '../favorites/FavoriteComposer'
import type { TollowFavoriteCreateInput } from '@/lib/tollow-contract'
import '../../styles/TypingPractice.css'

interface TypingPracticeProps {
  textContent: TextContent
  onBack: () => void
  initialPosition?: number
  onProgress?: (position: number) => void
  onComplete?: () => void
  onSessionComplete?: (stats: TypingStats) => void
}

function calculateCompletedPosition(
  initialPosition: number,
  typedMap: ReadonlyMap<number, string>,
  graphemeCount: number
): number {
  let position = initialPosition

  while (position < graphemeCount && typedMap.has(position)) {
    position += 1
  }

  return position
}

const TypingPractice: React.FC<TypingPracticeProps> = ({
  textContent,
  onBack,
  initialPosition = 0,
  onProgress,
  onComplete,
  onSessionComplete,
}) => {
  const graphemes = useMemo(() => splitGraphemes(textContent.content), [textContent.content])
  const safeInitialPosition = Number.isFinite(initialPosition)
    ? Math.trunc(initialPosition)
    : 0
  const clampedInitialPosition = Math.min(
    Math.max(safeInitialPosition, 0),
    graphemes.length
  )
  const [currentPosition, setCurrentPosition] = useState(clampedInitialPosition)
  const [completedPosition, setCompletedPosition] = useState(clampedInitialPosition)
  const [typedMap, setTypedMap] = useState<Map<number, string>>(new Map())
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [favoriteDraft, setFavoriteDraft] = useState<TollowFavoriteCreateInput | null>(null)
  const [, setLayoutVersion] = useState(0)

  const textDisplayRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLDivElement>(null)
  const charPositionsRef = useRef<Map<number, { left: number; top: number }>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isComposingRef = useRef(false)
  const compositionBufferRef = useRef('')
  const compositionInputTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const completionNotifiedRef = useRef(false)
  const reportedPositionRef = useRef(clampedInitialPosition)
  const initialCompletionKeyRef = useRef<string | null>(null)
  const initialCompletionKey = JSON.stringify([
    textContent.book?.bookId,
    textContent.book?.sectionId,
    textContent.book?.segmentIndex,
    textContent.title,
    textContent.content,
    initialPosition,
  ])

  const VERTICAL_ADJUST_PX = 8
  const TYPED_CHAR_ADJUST_PX = -2

  const updateCharPositions = useCallback(() => {
    if (!textDisplayRef.current) return
    const containerRect = textDisplayRef.current.getBoundingClientRect()
    const charPositions = new Map<number, { left: number; top: number }>()

    textDisplayRef.current.querySelectorAll<HTMLElement>('.remaining-char').forEach(char => {
      const index = Number(char.dataset.index)
      const rect = char.getBoundingClientRect()
      charPositions.set(index, {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
      })
    })

    charPositionsRef.current = charPositions
    setLayoutVersion(version => version + 1)
  }, [])

  const reportPosition = useCallback((position: number) => {
    onProgress?.(position)
    if (position >= graphemes.length && graphemes.length > 0 && !completionNotifiedRef.current) {
      completionNotifiedRef.current = true
      onComplete?.()
    }
  }, [graphemes.length, onComplete, onProgress])

  const reportCompletedPosition = useCallback((nextTypedMap: ReadonlyMap<number, string>) => {
    const nextCompletedPosition = calculateCompletedPosition(
      clampedInitialPosition,
      nextTypedMap,
      graphemes.length
    )

    setCompletedPosition(nextCompletedPosition)
    if (nextCompletedPosition === reportedPositionRef.current) return

    reportedPositionRef.current = nextCompletedPosition
    if (nextCompletedPosition < graphemes.length) {
      completionNotifiedRef.current = false
    }
    if (
      nextCompletedPosition >= graphemes.length
      && graphemes.length > 0
      && !completionNotifiedRef.current
      && startTime > 0
    ) {
      const timeElapsed = Math.max(1, Date.now() - startTime)
      const typedWords = nextTypedMap.size
      const errorCount = Array.from(nextTypedMap.entries())
        .filter(([index, character]) => character !== graphemes[index]).length
      onSessionComplete?.({
        wpm: Math.round(typedWords / (timeElapsed / 60_000)),
        accuracy: typedWords > 0
          ? Math.round(((typedWords - errorCount) / typedWords) * 100)
          : 100,
        totalWords: graphemes.length,
        typedWords,
        errors: errorCount,
        timeElapsed,
      })
    }
    reportPosition(nextCompletedPosition)
  }, [clampedInitialPosition, graphemes, onSessionComplete, reportPosition, startTime])

  useEffect(() => {
    const nextInitialPosition = Math.min(
      Math.max(safeInitialPosition, 0),
      graphemes.length
    )
    setCurrentPosition(nextInitialPosition)
    setCompletedPosition(nextInitialPosition)
    setTypedMap(new Map())
    setIsStarted(false)
    setStartTime(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    completionNotifiedRef.current = false
    reportedPositionRef.current = nextInitialPosition
    setTimeout(updateCharPositions, 0)
  }, [graphemes, safeInitialPosition, updateCharPositions])

  useEffect(() => {
    if (
      graphemes.length === 0
      || initialPosition !== graphemes.length
      || initialCompletionKeyRef.current === initialCompletionKey
    ) {
      return
    }

    initialCompletionKeyRef.current = initialCompletionKey
    reportPosition(graphemes.length)
  }, [graphemes.length, initialCompletionKey, initialPosition, reportPosition])

  useEffect(() => {
    if (isStarted && startTime > 0) {
      intervalRef.current = setInterval(() => {
        const minutes = (Date.now() - startTime) / 60000
        if (minutes > 0) setWpm(Math.round(typedMap.size / minutes))
        const totalTyped = typedMap.size
        const errorCount = Array.from(typedMap.entries())
          .filter(([index, character]) => character !== graphemes[index]).length
        setErrors(errorCount)
        if (totalTyped > 0) {
          setAccuracy(Math.round(((totalTyped - errorCount) / totalTyped) * 100))
        }
      }, 120)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [graphemes, isStarted, startTime, typedMap])

  useEffect(() => {
    hiddenInputRef.current?.focus()
  }, [])

  useEffect(() => () => {
    if (compositionInputTimerRef.current) {
      clearTimeout(compositionInputTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const updateLayout = () => updateCharPositions()
    window.addEventListener('resize', updateLayout)
    window.addEventListener('scroll', updateLayout, true)
    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('scroll', updateLayout, true)
    }
  }, [updateCharPositions])

  const processInput = useCallback((text: string) => {
    if (!text) return
    if (!isStarted) {
      setIsStarted(true)
      setStartTime(Date.now())
    }

    let position = currentPosition
    const nextTypedMap = new Map(typedMap)

    for (const rawCharacter of splitGraphemes(text)) {
      if (position >= graphemes.length) break
      const sourceCharacter = graphemes[position]
      const character = normalizePracticeInputCharacter(
        rawCharacter === '\r' ? '' : rawCharacter,
        sourceCharacter
      )
      if (!character) continue
      if ([' ', '\n', '\t'].includes(character) && sourceCharacter !== character) continue

      nextTypedMap.set(position, character)
      position += 1
    }

    setTypedMap(nextTypedMap)
    setCurrentPosition(position)
    reportCompletedPosition(nextTypedMap)
    setTimeout(updateCharPositions, 0)
  }, [
    currentPosition,
    graphemes,
    isStarted,
    reportCompletedPosition,
    typedMap,
    updateCharPositions,
  ])

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
    compositionBufferRef.current = ''
    if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
  }, [])

  const handleCompositionUpdate = useCallback((event: React.CompositionEvent<HTMLDivElement>) => {
    compositionBufferRef.current = event.data
    if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
  }, [])

  const handleCompositionEnd = useCallback((event: React.CompositionEvent<HTMLDivElement>) => {
    isComposingRef.current = false
    const composedText = event.data
    if (composedText) {
      if (compositionInputTimerRef.current) {
        clearTimeout(compositionInputTimerRef.current)
      }
      compositionInputTimerRef.current = setTimeout(() => {
        compositionInputTimerRef.current = null
        processInput(composedText)
        if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
      }, 10)
    }
    compositionBufferRef.current = ''
  }, [processInput])

  const handleBeforeInput = useCallback((event: React.FormEvent<HTMLDivElement> & { nativeEvent: InputEvent }) => {
    const nativeEvent = event.nativeEvent
    const { inputType, data } = nativeEvent
    if (isComposingRef.current) {
      event.preventDefault()
      return
    }
    if (!inputType?.startsWith('insert')) return

    event.preventDefault()
    const clipboardData = (nativeEvent as InputEvent & { clipboardData?: DataTransfer }).clipboardData
    if (inputType === 'insertFromPaste' && clipboardData) {
      processInput(clipboardData.getData('text/plain'))
    } else if (inputType === 'insertParagraph') {
      if (graphemes[currentPosition] === '\n') processInput('\n')
    } else if (data) {
      processInput(data)
    }
    if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
  }, [currentPosition, graphemes, processInput])

  const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    if (isComposingRef.current) return
    const target = event.target as HTMLDivElement
    const text = target.textContent || ''
    if (text) processInput(text)
    target.textContent = ''
  }, [processInput])

  const moveCursor = useCallback((position: number) => {
    const nextPosition = Math.min(
      Math.max(position, clampedInitialPosition),
      graphemes.length
    )
    setCurrentPosition(nextPosition)
    setTimeout(updateCharPositions, 0)
  }, [clampedInitialPosition, graphemes.length, updateCharPositions])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isComposingRef.current) {
      if (event.key !== 'Backspace') event.preventDefault()
      return
    }

    if (event.key === 'Backspace') {
      event.preventDefault()
      if (currentPosition > clampedInitialPosition) {
        const nextPosition = currentPosition - 1
        const nextTypedMap = new Map(typedMap)
        nextTypedMap.delete(nextPosition)
        setTypedMap(nextTypedMap)
        reportCompletedPosition(nextTypedMap)
        moveCursor(nextPosition)
      }
    } else if (event.key === 'Delete') {
      event.preventDefault()
      const nextTypedMap = new Map(typedMap)
      nextTypedMap.delete(currentPosition)
      setTypedMap(nextTypedMap)
      reportCompletedPosition(nextTypedMap)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveCursor(currentPosition - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveCursor(currentPosition + 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveCursor(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveCursor(graphemes.length)
    }
  }, [
    clampedInitialPosition,
    currentPosition,
    graphemes.length,
    moveCursor,
    reportCompletedPosition,
    typedMap,
  ])

  const handleClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('remaining-char')) {
      moveCursor(Number(target.dataset.index || 0))
    }
    hiddenInputRef.current?.focus()
  }, [moveCursor])

  const createFavoriteDraft = useCallback((startOffset: number, endOffset: number) => {
    const start = Math.max(0, Math.min(startOffset, graphemes.length))
    const end = Math.max(start, Math.min(endOffset, graphemes.length))
    const quote = graphemes.slice(start, end).join('')
    if (!quote) return
    setFavoriteDraft({
      bookId: textContent.book?.bookId || null,
      bookTitle: textContent.title,
      sectionId: textContent.book?.sectionId || null,
      sectionTitle: textContent.book?.sectionTitle || null,
      segmentIndex: textContent.book?.segmentIndex ?? null,
      startOffset: start,
      endOffset: end,
      quote,
      note: null,
      tags: [],
    })
  }, [graphemes, textContent])

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    const elementForNode = (node: Node): HTMLElement | null =>
      (node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement)
        ?.closest<HTMLElement>('[data-index]') ?? null
    const startElement = elementForNode(range.startContainer)
    const endElement = elementForNode(range.endContainer)
    if (!startElement || !endElement || !textDisplayRef.current?.contains(startElement) || !textDisplayRef.current.contains(endElement)) return

    const first = Number(startElement.dataset.index)
    const last = Number(endElement.dataset.index)
    if (!Number.isInteger(first) || !Number.isInteger(last)) return
    createFavoriteDraft(Math.min(first, last), Math.max(first, last) + 1)
    selection.removeAllRanges()
  }, [createFavoriteDraft])

  const typedCharacters = graphemes.flatMap((sourceCharacter, index) => {
    const isInitiallyCompleted = index < clampedInitialPosition
    const character = isInitiallyCompleted ? sourceCharacter : typedMap.get(index)
    if (character === undefined) return []

    const position = charPositionsRef.current.get(index)
    if (!position) return []
    const isError = !isInitiallyCompleted && character !== sourceCharacter
    return [
      <span
        key={`${isInitiallyCompleted ? 'saved' : 'typed'}-${index}`}
        className={`${isError ? 'error-char' : 'correct-char'} typed-char`}
        data-index={index}
        style={{ left: position.left, top: position.top + TYPED_CHAR_ADJUST_PX }}
      >
        {character}
      </span>,
    ]
  })

  const cursorPosition = currentPosition < graphemes.length
    ? charPositionsRef.current.get(currentPosition)
    : charPositionsRef.current.get(graphemes.length - 1)
  const cursorLeft = cursorPosition
    ? cursorPosition.left + (currentPosition >= graphemes.length ? 16 : 0)
    : 0
  const cursorTop = cursorPosition ? cursorPosition.top + VERTICAL_ADJUST_PX : 0

  return (
    <div className="typing-practice">
      <div className="practice-header">
        <div>
          <h2>{textContent.title}</h2>
          <p>来源: {textContent.source}</p>
          {textContent.book && (
            <p className="practice-section-title">
              {textContent.book.sectionTitle} · 第 {textContent.book.segmentIndex + 1}/{textContent.book.segmentCount} 段
            </p>
          )}
        </div>
        <div className="practice-controls">
          <button
            className="btn favorite-selection-button"
            type="button"
            onClick={() => createFavoriteDraft(0, graphemes.length)}
          >
            ♡ 收藏当前段
          </button>
          <button className="btn btn-secondary" onClick={onBack}>← 返回</button>
        </div>
      </div>

      <div className="practice-content">
        <div className="typing-stats">
          <div className="stat-item"><span className="stat-label">WPM</span><span className="stat-value">{wpm}</span></div>
          <div className="stat-item"><span className="stat-label">准确率</span><span className="stat-value">{accuracy}%</span></div>
          <div className="stat-item"><span className="stat-label">进度</span><span className="stat-value">{graphemes.length ? Math.round((completedPosition / graphemes.length) * 100) : 0}%</span></div>
          <div className="stat-item"><span className="stat-label">错误</span><span className="stat-value">{errors}</span></div>
        </div>

        <div className="typing-instructions">
          <h3>打字说明</h3>
          <ul>
            <li><strong>直接打字：</strong>点击原文任意位置开始输入</li>
            <li><strong>中文输入：</strong>支持拼音输入法，输入完成后按空格确认</li>
            <li><strong>光标移动：</strong>使用 ← → 或 Home/End</li>
            <li><strong>删除回退：</strong>Backspace 删除前一位，Delete 删除当前位置</li>
          </ul>
        </div>

        <div className="text-container" onClick={handleClick} onMouseUp={handleTextSelection}>
          <div ref={textDisplayRef} className="text-display">
            <div className="background-layer">
              {graphemes.map((character, index) => (
                <span
                  key={index}
                  className="remaining-char"
                  data-index={index}
                  style={{
                    color:
                      index < clampedInitialPosition || typedMap.has(index)
                        ? 'transparent'
                        : undefined,
                  }}
                  data-favorite-highlight={
                    textContent.book?.highlightStartOffset !== undefined
                    && index >= textContent.book.highlightStartOffset
                    && index < (textContent.book.highlightEndOffset ?? textContent.book.highlightStartOffset)
                      ? 'true'
                      : undefined
                  }
                >
                  {character}
                </span>
              ))}
            </div>
            <div className="overlay-layer">
              {typedCharacters}
              {cursorPosition && (
                <>
                  <span className="current-char" style={{ left: cursorLeft, top: cursorTop }} />
                  <div className="cursor-indicator" style={{ left: cursorLeft - 2, top: cursorTop }} />
                </>
              )}
            </div>
          </div>
          <div
            ref={hiddenInputRef}
            className="hidden-input"
            contentEditable
            suppressContentEditableWarning
            onBeforeInput={handleBeforeInput}
            onCompositionStart={handleCompositionStart}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {favoriteDraft && (
        <FavoriteComposer draft={favoriteDraft} onClose={() => setFavoriteDraft(null)} />
      )}
    </div>
  )
}

export default TypingPractice
