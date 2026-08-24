// @ts-nocheck
/* eslint-disable */
import React from 'react'
import '../../styles/Header.css'
import { Link, useLocation } from 'react-router'
import FavoritesDrawer from '../../features/favorites/FavoritesDrawer'
import {
  TOLLOW_SYNC_STATUS_EVENT,
  type TollowSyncStatus,
} from '../../services/accountSyncService'
import { useTollowAccessLevel } from '../../core/access'

const Header: React.FC = () => {
  const { pathname } = useLocation()
  const accessLevel = useTollowAccessLevel()
  const [favoritesOpen, setFavoritesOpen] = React.useState(false)
  const [syncStatus, setSyncStatus] = React.useState<TollowSyncStatus>('synced')
  const favoritesButtonRef = React.useRef<HTMLButtonElement>(null)
  const nav = [
    { to: '/library', label: '书库' },
    { to: '/upload', label: '上传' },
    { to: '/practice', label: '练习' },
    { to: '/analytics', label: '分析' },
  ]

  // 报刊风日期格式
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  React.useEffect(() => {
    const onStatus = (event: Event) => {
      setSyncStatus((event as CustomEvent<TollowSyncStatus>).detail)
    }
    window.addEventListener(TOLLOW_SYNC_STATUS_EVENT, onStatus)
    return () => window.removeEventListener(TOLLOW_SYNC_STATUS_EVENT, onStatus)
  }, [])

  const closeFavorites = React.useCallback(() => {
    setFavoritesOpen(false)
    requestAnimationFrame(() => favoritesButtonRef.current?.focus())
  }, [])

  const syncLabel = accessLevel !== 'pro'
    ? '本地保存'
    : syncStatus === 'pending'
      ? '同步中'
      : syncStatus === 'error'
        ? '等待重试'
        : '已同步'

  return (
    <header className="header">
      <div className="header-bar">
        <Link to="/library" className="brand">
          <span className="logo-icon">⌨️</span>
          <span className="brand-name">Tollow</span>
        </Link>
        <span className="header-date">{dateStr}</span>
        <nav className="nav">
          {nav.map(item => (
            <Link key={item.to} to={item.to} className={`nav-link ${pathname === item.to ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-account-tools">
          <span className="tollow-sync-status" data-status={syncStatus} aria-live="polite">{syncLabel}</span>
          <button
            ref={favoritesButtonRef}
            type="button"
            className="favorites-header-button"
            onClick={() => setFavoritesOpen(true)}
          >
            我的收藏
          </button>
        </div>
      </div>
      <FavoritesDrawer open={favoritesOpen} onClose={closeFavorites} />
    </header>
  )
}

export default Header
