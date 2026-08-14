// @ts-nocheck
/* eslint-disable */
import React from 'react'
import '../../styles/Header.css'
import { Link, useLocation } from 'react-router'

const Header: React.FC = () => {
  const { pathname } = useLocation()
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
      </div>
    </header>
  )
}

export default Header
