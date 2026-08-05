// @ts-nocheck
/* eslint-disable */
import type { BookSection } from '../types/books'

export const BOOK_TEXT_LOAD_ERROR_CODES = [
  'NOT_FOUND',
  'HTTP_ERROR',
  'NETWORK_ERROR',
  'INVALID_CONTENT_TYPE',
  'INVALID_ENCODING',
  'EMPTY_CONTENT',
  'INTEGRITY_MISMATCH',
  'INVALID_SECTION_PATH',
  'ABORTED',
] as const

export type BookTextLoadErrorCode = (typeof BOOK_TEXT_LOAD_ERROR_CODES)[number]

export class BookTextLoadError extends Error {
  readonly code: BookTextLoadErrorCode
  readonly sectionId: string
  readonly status?: number
  readonly cause?: unknown

  constructor(
    code: BookTextLoadErrorCode,
    sectionId: string,
    options: { status?: number; cause?: unknown } = {}
  ) {
    super(`章节加载失败：${code}`)
    this.name = 'BookTextLoadError'
    this.code = code
    this.sectionId = sectionId
    this.status = options.status
    this.cause = options.cause
  }
}

const MAX_CACHE_ENTRIES = 8
const contentCache = new Map<string, string>()

interface PendingLoad {
  controller: AbortController
  promise: Promise<string>
  activeAbortableConsumers: number
  hasUnabortableConsumer: boolean
  settled: boolean
}

const pendingLoads = new Map<string, PendingLoad>()

function getCacheKey(section: BookSection): string {
  return `${section.path}:${section.sha256.toLowerCase()}`
}

function isSafeSectionPath(path: string): boolean {
  const relativePath = path.replace(/^\/+/, '')
  return /^texts\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.txt$/.test(
    relativePath
  )
}

function buildSectionUrl(path: string): string {
  // Next 集成：Tollow 静态资源挂在 /apps/tollow 下，固定为站内前缀
  const baseUrl = '/apps/tollow/'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBase}${path.replace(/^\/+/, '')}`
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), byte =>
    byte.toString(16).padStart(2, '0')
  ).join('')
}

async function calculateSha256(bytes: Uint8Array): Promise<string> {
  const digestInput = new Uint8Array(bytes.byteLength)
  digestInput.set(bytes)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', digestInput)
  return bytesToHex(digest)
}

function remember(cacheKey: string, content: string): void {
  contentCache.delete(cacheKey)
  contentCache.set(cacheKey, content)

  while (contentCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = contentCache.keys().next().value as string | undefined
    if (oldestKey === undefined) break
    contentCache.delete(oldestKey)
  }
}

function createPendingLoad(
  section: BookSection,
  cacheKey: string
): PendingLoad {
  const controller = new AbortController()
  const pending: PendingLoad = {
    controller,
    promise: Promise.resolve(''),
    activeAbortableConsumers: 0,
    hasUnabortableConsumer: false,
    settled: false,
  }

  pending.promise = fetchSection(section, controller.signal)
    .then(content => {
      remember(cacheKey, content)
      return content
    })
    .finally(() => {
      pending.settled = true
      if (pendingLoads.get(cacheKey) === pending) {
        pendingLoads.delete(cacheKey)
      }
    })

  pendingLoads.set(cacheKey, pending)
  return pending
}

function waitForPendingLoad(
  pending: PendingLoad,
  sectionId: string,
  signal?: AbortSignal
): Promise<string> {
  if (!signal) {
    pending.hasUnabortableConsumer = true
    return pending.promise
  }

  pending.activeAbortableConsumers += 1

  return new Promise<string>((resolve, reject) => {
    let active = true

    const release = () => {
      if (!active) return false
      active = false
      signal.removeEventListener('abort', handleAbort)
      pending.activeAbortableConsumers -= 1
      return true
    }

    const handleAbort = () => {
      if (!release()) return
      reject(new BookTextLoadError('ABORTED', sectionId))

      if (
        !pending.settled &&
        !pending.hasUnabortableConsumer &&
        pending.activeAbortableConsumers === 0
      ) {
        pending.controller.abort()
      }
    }

    signal.addEventListener('abort', handleAbort, { once: true })
    pending.promise.then(
      content => {
        if (release()) resolve(content)
      },
      error => {
        if (release()) reject(error)
      }
    )
  })
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'AbortError'
}

async function fetchSection(
  section: BookSection,
  signal?: AbortSignal
): Promise<string> {
  let response: Response

  try {
    const url = buildSectionUrl(section.path)
    response = signal ? await fetch(url, { signal }) : await fetch(url)
  } catch (error) {
    throw new BookTextLoadError(
      signal?.aborted || isAbortError(error) ? 'ABORTED' : 'NETWORK_ERROR',
      section.id,
      { cause: error }
    )
  }

  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new BookTextLoadError(
      response.status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR',
      section.id,
      { status: response.status }
    )
  }

  if (!contentType || !contentType.toLowerCase().startsWith('text/plain')) {
    throw new BookTextLoadError('INVALID_CONTENT_TYPE', section.id)
  }

  let bytes: Uint8Array

  try {
    bytes = new Uint8Array(await response.arrayBuffer())
  } catch (error) {
    throw new BookTextLoadError(
      signal?.aborted || isAbortError(error) ? 'ABORTED' : 'NETWORK_ERROR',
      section.id,
      { cause: error }
    )
  }

  let content: string

  try {
    content = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch (error) {
    throw new BookTextLoadError('INVALID_ENCODING', section.id, {
      cause: error,
    })
  }

  if (content.trim().length === 0) {
    throw new BookTextLoadError('EMPTY_CONTENT', section.id)
  }

  const actualSha256 = await calculateSha256(bytes)
  if (actualSha256 !== section.sha256.toLowerCase()) {
    throw new BookTextLoadError('INTEGRITY_MISMATCH', section.id)
  }

  return content.replace(/\r\n?/g, '\n').normalize('NFC')
}

export function clearBookTextCache(): void {
  for (const pending of pendingLoads.values()) {
    pending.controller.abort()
  }
  contentCache.clear()
  pendingLoads.clear()
}

export function loadBookSection(
  section: BookSection,
  signal?: AbortSignal
): Promise<string> {
  if (signal?.aborted) {
    return Promise.reject(new BookTextLoadError('ABORTED', section.id))
  }

  if (!isSafeSectionPath(section.path)) {
    return Promise.reject(
      new BookTextLoadError('INVALID_SECTION_PATH', section.id)
    )
  }

  const cacheKey = getCacheKey(section)
  const cached = contentCache.get(cacheKey)
  if (cached !== undefined) {
    contentCache.delete(cacheKey)
    contentCache.set(cacheKey, cached)
    return Promise.resolve(cached)
  }

  let pending = pendingLoads.get(cacheKey)
  if (pending?.controller.signal.aborted) {
    pendingLoads.delete(cacheKey)
    pending = undefined
  }

  pending ??= createPendingLoad(section, cacheKey)
  return waitForPendingLoad(pending, section.id, signal)
}
