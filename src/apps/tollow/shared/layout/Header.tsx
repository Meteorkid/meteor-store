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
  const favoritesTriggerRef = React.useRef<HTMLButtonElement | null>(null)
  const isZh = typeof document === 'undefined' || document.documentElement.lang.startsWith('zh')
  const nav = [
    { to: '/library', label: isZh ? '书库' : 'Library', icon: '▤' },
    { to: '/upload', label: isZh ? '上传' : 'Upload', icon: '↑' },
    { to: '/practice', label: isZh ? '练习' : 'Practice', icon: '⌨' },
    { to: '/analytics', label: isZh ? '分析' : 'Insights', icon: '◫' },
  ]

  // 报刊风日期格式
  const today = new Date()
  const dateStr = today.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
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
    requestAnimationFrame(() => favoritesTriggerRef.current?.focus())
  }, [])

  const openFavorites = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    favoritesTriggerRef.current = event.currentTarget
    setFavoritesOpen(true)
  }, [])

  const syncLabel = accessLevel !== 'pro'
    ? (isZh ? '本地保存' : 'Saved locally')
    : syncStatus === 'pending'
      ? (isZh ? '同步中' : 'Syncing')
      : syncStatus === 'error'
        ? (isZh ? '等待重试' : 'Retry pending')
        : (isZh ? '已同步' : 'Synced')

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
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${pathname === item.to ? 'active' : ''}`}
              aria-current={pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-account-tools">
          <span className="tollow-sync-status" data-status={syncStatus} aria-live="polite">{syncLabel}</span>
          <button
            type="button"
            className="favorites-header-button"
            onClick={openFavorites}
          >
            {isZh ? '我的收藏' : 'Saved text'}
          </button>
        </div>
      </div>
      <nav className="mobile-nav" aria-label={isZh ? '主要导航' : 'Primary navigation'}>
        {nav.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-nav-item ${pathname === item.to ? 'active' : ''}`}
            aria-current={pathname === item.to ? 'page' : undefined}
          >
            <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button type="button" className="mobile-nav-item" onClick={openFavorites}>
          <span className="mobile-nav-icon" aria-hidden="true">♡</span>
          <span>{isZh ? '收藏' : 'Saved'}</span>
        </button>
      </nav>
      <FavoritesDrawer open={favoritesOpen} onClose={closeFavorites} />
    </header>
  )
}

export default Header
