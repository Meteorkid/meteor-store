// @ts-nocheck
/* eslint-disable */
import type { BookManifest, BookProgress, BookSection } from '../types/books'
import { splitGraphemes } from '../utils/textSegmentation'

export const BOOK_PROGRESS_STORAGE_KEY = 'tollow-book-progress-v1'

type StoredProgress = Record<string, unknown>

export interface BookProgressService {
  getProgress(bookId: string): BookProgress | null
  saveProgress(progress: BookProgress): boolean
  clearProgress(bookId: string): void
}

export type BookProgressTarget = Pick<BookManifest, 'id' | 'locale'> & {
  sections: ReadonlyArray<Pick<BookSection, 'id'>>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIdentifier(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 128 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  )
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0
}

function isIsoDate(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    Number.isFinite(Date.parse(value))
  )
}

export function isBookProgress(value: unknown): value is BookProgress {
  if (!isRecord(value)) return false

  return (
    isIdentifier(value.bookId) &&
    isIdentifier(value.sectionId) &&
    isNonNegativeInteger(value.segmentIndex) &&
    isNonNegativeInteger(value.offset) &&
    isIsoDate(value.updatedAt)
  )
}

export function validateBookProgress(
  value: unknown,
  book: BookProgressTarget,
  segments?: readonly string[]
): value is BookProgress {
  if (!isBookProgress(value) || value.bookId !== book.id) return false
  if (!book.sections.some(section => section.id === value.sectionId)) {
    return false
  }
  if (!segments) return true

  const segment = segments[value.segmentIndex]
  if (segment === undefined) return false

  return value.offset <= splitGraphemes(segment, book.locale).length
}

function sanitizeProgress(progress: BookProgress): BookProgress {
  return {
    bookId: progress.bookId,
    sectionId: progress.sectionId,
    segmentIndex: progress.segmentIndex,
    offset: progress.offset,
    updatedAt: progress.updatedAt,
  }
}

function getStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function readStoredProgress(storage: Storage): StoredProgress {
  const serialized = storage.getItem(BOOK_PROGRESS_STORAGE_KEY)
  if (!serialized) return {}

  try {
    const parsed: unknown = JSON.parse(serialized)
    if (isRecord(parsed)) return parsed
  } catch {
    // 统一在下方丢弃损坏数据。
  }

  storage.removeItem(BOOK_PROGRESS_STORAGE_KEY)
  return {}
}

function writeStoredProgress(
  storage: Storage,
  progressByBook: StoredProgress
): boolean {
  try {
    if (Object.keys(progressByBook).length === 0) {
      storage.removeItem(BOOK_PROGRESS_STORAGE_KEY)
    } else {
      storage.setItem(BOOK_PROGRESS_STORAGE_KEY, JSON.stringify(progressByBook))
    }
    return true
  } catch {
    return false
  }
}

export const bookProgressService: BookProgressService = {
  getProgress(bookId) {
    if (!isIdentifier(bookId)) return null

    const storage = getStorage()
    if (!storage) return null

    const progressByBook = readStoredProgress(storage)
    const progress = progressByBook[bookId]
    if (isBookProgress(progress) && progress.bookId === bookId) {
      const sanitized = sanitizeProgress(progress)
      if (JSON.stringify(progress) !== JSON.stringify(sanitized)) {
        progressByBook[bookId] = sanitized
        writeStoredProgress(storage, progressByBook)
      }
      return sanitized
    }

    if (progress !== undefined) {
      delete progressByBook[bookId]
      writeStoredProgress(storage, progressByBook)
    }
    return null
  },

  saveProgress(progress) {
    if (!isBookProgress(progress)) return false

    const storage = getStorage()
    if (!storage) return false

    const progressByBook = readStoredProgress(storage)
    progressByBook[progress.bookId] = sanitizeProgress(progress)
    return writeStoredProgress(storage, progressByBook)
  },

  clearProgress(bookId) {
    if (!isIdentifier(bookId)) return

    const storage = getStorage()
    if (!storage) return

    const progressByBook = readStoredProgress(storage)
    if (!(bookId in progressByBook)) return

    delete progressByBook[bookId]
    writeStoredProgress(storage, progressByBook)
  },
}
