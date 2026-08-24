'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import booksJson from '../../data/books.json'
import { loadBookSection } from '../../services/bookTextLoader'
import { resolveFavoriteSource } from '../../services/favoriteSourceResolver'
import {
  tollowFavoriteService,
  TOLLOW_FAVORITES_CHANGED_EVENT,
  type TollowFavorite,
} from '../../services/favoriteService'
import { useAppStore } from '../../stores/appStore'
import type { BookManifest } from '../../types/books'
import { splitPracticeSegments } from '../../utils/textSegmentation'

const books = booksJson as BookManifest[]
type SortMode = 'updated-desc' | 'updated-asc' | 'position'

interface FavoritesDrawerProps {
  open: boolean
  onClose: () => void
}

function canJumpToSource(favorite: TollowFavorite): boolean {
  if (!favorite.bookId || !favorite.sectionId || favorite.segmentIndex === null) return false
  const book = books.find(item => item.id === favorite.bookId)
  return Boolean(book?.sections.some(section => section.id === favorite.sectionId))
}

export default function FavoritesDrawer({ open, onClose }: FavoritesDrawerProps) {
  const navigate = useNavigate()
  const setCurrentText = useAppStore(state => state.setCurrentText)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const [items, setItems] = useState<TollowFavorite[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [qDraft, setQDraft] = useState('')
  const [q, setQ] = useState('')
  const [bookId, setBookId] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState<SortMode>('updated-desc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editTags, setEditTags] = useState('')
  const [knownBooks, setKnownBooks] = useState<Record<string, string>>({})
  const [knownTags, setKnownTags] = useState<string[]>([])
  const [invalidSourceIds, setInvalidSourceIds] = useState<Set<string>>(() => new Set())

  const load = useCallback(async () => {
    if (!open) return
    setLoading(true)
    setError('')
    try {
      const result = await tollowFavoriteService.list({
        q: q || undefined,
        bookId: bookId || undefined,
        tag: tag || undefined,
        sort,
        page,
        limit: 20,
      })
      setItems(result.items)
      setTotal(result.total)
      setKnownBooks(Object.fromEntries(result.facets.books.map(book => [book.id, book.title])))
      setKnownTags(result.facets.tags)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '收藏加载失败')
    } finally {
      setLoading(false)
    }
  }, [bookId, open, page, q, sort, tag])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const onChanged = () => void load()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(TOLLOW_FAVORITES_CHANGED_EVENT, onChanged)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(TOLLOW_FAVORITES_CHANGED_EVENT, onChanged)
    }
  }, [load, onClose, open])

  const totalPages = Math.max(1, Math.ceil(total / 20))
  const bookOptions = useMemo(() => Object.entries(knownBooks).sort((a, b) => a[1].localeCompare(b[1], 'zh-CN')), [knownBooks])

  if (!open) return null

  const copyQuote = async (favorite: TollowFavorite) => {
    try {
      await navigator.clipboard.writeText(favorite.quote)
    } catch {
      setError('复制失败，请手动选择原文')
    }
  }

  const remove = async (favorite: TollowFavorite) => {
    if (!window.confirm('确定删除这条文本收藏吗？')) return
    try {
      await tollowFavoriteService.remove(favorite.id)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '删除失败')
    }
  }

  const beginEdit = (favorite: TollowFavorite) => {
    setEditingId(favorite.id)
    setEditNote(favorite.note || '')
    setEditTags(favorite.tags.join('，'))
  }

  const saveEdit = async (favorite: TollowFavorite) => {
    try {
      await tollowFavoriteService.update(favorite.id, {
        note: editNote.trim() || null,
        tags: [...new Set(editTags.split(/[,，]/).map(value => value.trim()).filter(Boolean))].slice(0, 10),
      })
      setEditingId(null)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '更新失败')
    }
  }

  const jumpToSource = async (favorite: TollowFavorite) => {
    if (!canJumpToSource(favorite)) return
    const book = books.find(item => item.id === favorite.bookId)
    const sectionIndex = book?.sections.findIndex(section => section.id === favorite.sectionId) ?? -1
    const section = book?.sections[sectionIndex]
    if (!book || !section || favorite.segmentIndex === null) return

    setLoading(true)
    try {
      const content = await loadBookSection(section)
      const segments = splitPracticeSegments(content, book.locale)
      const segment = segments[favorite.segmentIndex]
      if (segment === undefined) throw new Error('收藏来源已经变化，无法定位原文')
      const resolution = resolveFavoriteSource(
        segment,
        favorite.quote,
        favorite.startOffset,
        favorite.endOffset,
        book.locale,
      )
      if (resolution.status === 'invalid') {
        setInvalidSourceIds(current => new Set(current).add(favorite.id))
        throw new Error('收藏来源已经变化，无法唯一定位原文')
      }
      setCurrentText({
        title: book.title,
        content: segment,
        source: `${book.author} · ${book.title}`,
        type: 'text',
        book: {
          bookId: book.id,
          sectionId: section.id,
          sectionIndex,
          sectionTitle: section.title,
          segmentIndex: favorite.segmentIndex,
          segmentCount: segments.length,
          offset: resolution.startOffset,
          highlightStartOffset: resolution.startOffset,
          highlightEndOffset: resolution.endOffset,
        },
      })
      navigate('/practice')
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法定位原文')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="favorites-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        ref={drawerRef}
        className="favorites-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-drawer-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="favorites-drawer-header">
          <div>
            <span className="favorite-kicker">私人书摘</span>
            <h2 id="favorites-drawer-title">我的收藏</h2>
            <p>{total} 条文本收藏</p>
          </div>
          <button ref={closeButtonRef} type="button" className="favorite-icon-button" onClick={onClose} aria-label="关闭我的收藏">×</button>
        </header>

        <form
          className="favorites-filters"
          onSubmit={event => {
            event.preventDefault()
            setPage(1)
            setQ(qDraft.trim())
          }}
        >
          <div className="favorites-search-row">
            <input value={qDraft} onChange={event => setQDraft(event.target.value)} maxLength={200} placeholder="搜索原文或笔记" aria-label="搜索收藏" />
            <button type="submit" className="btn">搜索</button>
          </div>
          <div className="favorites-filter-row">
            <select value={bookId} onChange={event => { setBookId(event.target.value); setPage(1) }} aria-label="按书籍筛选">
              <option value="">全部书籍</option>
              {bookOptions.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
            </select>
            <select value={tag} onChange={event => { setTag(event.target.value); setPage(1) }} aria-label="按标签筛选">
              <option value="">全部标签</option>
              {knownTags.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
            <select value={sort} onChange={event => { setSort(event.target.value as SortMode); setPage(1) }} aria-label="收藏排序">
              <option value="updated-desc">最近编辑</option>
              <option value="updated-asc">最早收藏</option>
              <option value="position">原文位置</option>
            </select>
          </div>
        </form>

        {error && <p className="favorite-error favorites-drawer-error" role="alert">{error}</p>}
        <div className="favorites-list" aria-busy={loading}>
          {loading && items.length === 0 ? <p className="favorites-empty">正在加载收藏…</p> : null}
          {!loading && items.length === 0 ? <p className="favorites-empty">还没有符合条件的收藏。</p> : null}
          {items.map(favorite => {
            const jumpable = canJumpToSource(favorite) && !invalidSourceIds.has(favorite.id)
            const editing = editingId === favorite.id
            return (
              <article key={favorite.id} className="favorite-card">
                <blockquote>{favorite.quote}</blockquote>
                <p className="favorite-source">《{favorite.bookTitle}》{favorite.sectionTitle ? ` · ${favorite.sectionTitle}` : ''}</p>
                {favorite.syncState === 'pending' && <p className="favorite-source-missing">等待同步</p>}
                {favorite.syncState === 'error' && <p className="favorite-source-missing">同步失败，请稍后重新编辑</p>}
                {editing ? (
                  <div className="favorite-editor">
                    <textarea value={editNote} onChange={event => setEditNote(event.target.value)} maxLength={2000} rows={3} aria-label="编辑收藏笔记" />
                    <input value={editTags} onChange={event => setEditTags(event.target.value)} aria-label="编辑收藏标签" placeholder="标签用逗号分隔" />
                    <div>
                      <button type="button" className="btn" onClick={() => setEditingId(null)}>取消</button>
                      <button type="button" className="btn btn-primary" onClick={() => void saveEdit(favorite)}>保存</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {favorite.note && <p className="favorite-note">{favorite.note}</p>}
                    {favorite.tags.length > 0 && <div className="favorite-tags">{favorite.tags.map(value => <span key={value}>{value}</span>)}</div>}
                  </>
                )}
                {!jumpable && <p className="favorite-source-missing">来源已变化，原文快照仍为你保留。</p>}
                <div className="favorite-card-actions">
                  <button type="button" disabled={!jumpable} onClick={() => void jumpToSource(favorite)}>跳回原文</button>
                  <button type="button" onClick={() => beginEdit(favorite)}>编辑</button>
                  <button type="button" onClick={() => void copyQuote(favorite)}>复制</button>
                  <button type="button" className="favorite-delete" onClick={() => void remove(favorite)}>删除</button>
                </div>
              </article>
            )
          })}
        </div>

        <footer className="favorites-pagination">
          <button type="button" className="btn" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>上一页</button>
          <span>{page} / {totalPages}</span>
          <button type="button" className="btn" disabled={page >= totalPages} onClick={() => setPage(value => value + 1)}>下一页</button>
        </footer>
      </aside>
    </div>
  )
}
