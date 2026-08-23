// @ts-nocheck
/* eslint-disable */
import type { BookManifest, BookProgress, BookSection } from '../types/books'
import { splitGraphemes } from '../utils/textSegmentation'
import {
  TOLLOW_BOOK_PROGRESS_KEY,
  TOLLOW_PROGRESS_SAVED_EVENT,
  getActiveTollowStorageKey,
} from './accountSyncService'

export const BOOK_PROGRESS_STORAGE_KEY = TOLLOW_BOOK_PROGRESS_KEY

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

function readStoredProgress(storage: Storage, storageKey: string): StoredProgress {
  const serialized = storage.getItem(storageKey)
  if (!serialized) return {}

  try {
    const parsed: unknown = JSON.parse(serialized)
    if (isRecord(parsed)) return parsed
  } catch {
    // 统一在下方丢弃损坏数据。
  }

  storage.removeItem(storageKey)
  return {}
}

function writeStoredProgress(
  storage: Storage,
  storageKey: string,
  progressByBook: StoredProgress
): boolean {
  try {
    if (Object.keys(progressByBook).length === 0) {
      storage.removeItem(storageKey)
    } else {
      storage.setItem(storageKey, JSON.stringify(progressByBook))
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
    const storageKey = getActiveTollowStorageKey(BOOK_PROGRESS_STORAGE_KEY)
    if (!storage || !storageKey) return null

    const progressByBook = readStoredProgress(storage, storageKey)
    const progress = progressByBook[bookId]
    if (isBookProgress(progress) && progress.bookId === bookId) {
      const sanitized = sanitizeProgress(progress)
      if (JSON.stringify(progress) !== JSON.stringify(sanitized)) {
        progressByBook[bookId] = sanitized
        writeStoredProgress(storage, storageKey, progressByBook)
      }
      return sanitized
    }

    if (progress !== undefined) {
      delete progressByBook[bookId]
      writeStoredProgress(storage, storageKey, progressByBook)
    }
    return null
  },

  saveProgress(progress) {
    if (!isBookProgress(progress)) return false

    const storage = getStorage()
    const storageKey = getActiveTollowStorageKey(BOOK_PROGRESS_STORAGE_KEY)
    if (!storage || !storageKey) return false

    const progressByBook = readStoredProgress(storage, storageKey)
    progressByBook[progress.bookId] = sanitizeProgress(progress)
    const saved = writeStoredProgress(storage, storageKey, progressByBook)
    if (saved && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(TOLLOW_PROGRESS_SAVED_EVENT, {
        detail: sanitizeProgress(progress),
      }))
    }
    return saved
  },

  clearProgress(bookId) {
    if (!isIdentifier(bookId)) return

    const storage = getStorage()
    const storageKey = getActiveTollowStorageKey(BOOK_PROGRESS_STORAGE_KEY)
    if (!storage || !storageKey) return

    const progressByBook = readStoredProgress(storage, storageKey)
    if (!(bookId in progressByBook)) return

    delete progressByBook[bookId]
    writeStoredProgress(storage, storageKey, progressByBook)
  },
}
