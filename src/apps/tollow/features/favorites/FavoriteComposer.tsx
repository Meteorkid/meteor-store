'use client'

import { useEffect, useRef, useState } from 'react'
import type { TollowFavoriteCreateInput } from '@/lib/tollow-contract'
import {
  tollowFavoriteService,
  TOLLOW_FAVORITES_CHANGED_EVENT,
} from '../../services/favoriteService'

interface FavoriteComposerProps {
  draft: TollowFavoriteCreateInput
  onClose: () => void
}

function parseTags(value: string): string[] {
  return [...new Set(value.split(/[,，]/).map(tag => tag.trim()).filter(Boolean))].slice(0, 10)
}

export default function FavoriteComposer({ draft, onClose }: FavoriteComposerProps) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const saveButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    saveButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      await tollowFavoriteService.create({
        ...draft,
        note: note.trim() || null,
        tags: parseTags(tags),
      })
      window.dispatchEvent(new Event(TOLLOW_FAVORITES_CHANGED_EVENT))
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '收藏失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="favorite-composer-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="favorite-composer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-composer-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="favorite-composer-heading">
          <div>
            <span className="favorite-kicker">文本收藏</span>
            <h2 id="favorite-composer-title">保存这段原文</h2>
          </div>
          <button type="button" className="favorite-icon-button" onClick={onClose} aria-label="关闭收藏窗口">×</button>
        </div>
        <blockquote>{draft.quote}</blockquote>
        <p className="favorite-source">
          《{draft.bookTitle}》
          {draft.sectionTitle ? ` · ${draft.sectionTitle}` : ''}
        </p>

        {expanded ? (
          <div className="favorite-composer-fields">
            <label>
              个人笔记
              <textarea
                value={note}
                onChange={event => setNote(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="为什么想留下这段文字？"
              />
            </label>
            <label>
              标签
              <input
                value={tags}
                onChange={event => setTags(event.target.value)}
                placeholder="用逗号分隔，最多 10 个"
              />
            </label>
          </div>
        ) : (
          <button type="button" className="favorite-expand-button" onClick={() => setExpanded(true)}>
            ＋ 添加笔记和标签
          </button>
        )}

        {error && <p className="favorite-error" role="alert">{error}</p>}
        <div className="favorite-composer-actions">
          <button type="button" className="btn" onClick={onClose}>取消</button>
          <button ref={saveButtonRef} type="button" className="btn btn-primary" disabled={saving} onClick={save}>
            {saving ? '保存中…' : '收藏原文'}
          </button>
        </div>
      </section>
    </div>
  )
}
