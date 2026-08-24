// @ts-nocheck
/* eslint-disable */
import { useEffect, useMemo, useRef } from 'react'
import useStore from '../store/useStore'
import { bones, boneCategories, getBonesByCategory } from '../data/boneData'

export default function Sidebar() {
  const searchQuery = useStore((s) => s.searchQuery)
  const activeCategory = useStore((s) => s.activeCategory)
  const selectedBone = useStore((s) => s.selectedBone)
  const setSearch = useStore((s) => s.setSearch)
  const setCategory = useStore((s) => s.setCategory)
  const selectBone = useStore((s) => s.selectBoneAndFly)
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const closePanels = useStore((s) => s.closePanels)
  const closeButtonRef = useRef(null)

  // 先按分类筛选，再按搜索词筛选
  const filteredBones = useMemo(() => {
    let list = getBonesByCategory(activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (b) =>
          b.nameZh.includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.id.includes(q)
      )
    }
    return list
  }, [activeCategory, searchQuery])

  // 移动端抽屉打开后把焦点送进面板。关闭按钮在桌面端是 display:none，
  // 不可聚焦，所以这里不需要再判断视口宽度。
  useEffect(() => {
    if (sidebarOpen) closeButtonRef.current?.focus()
  }, [sidebarOpen])

  return (
    <div
      id="skeleton-sidebar"
      className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      aria-label="骨骼列表"
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="drawer-close"
        onClick={closePanels}
        aria-label="关闭骨骼列表"
      >
        <span aria-hidden="true">✕</span>
      </button>

      {/* 搜索框 */}
      <div className="sidebar-search">
        <input
          type="search"
          aria-label="搜索骨骼名称"
          placeholder="搜索骨骼名称..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch('')}
            aria-label="清空搜索"
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="sidebar-categories">
        <button
          type="button"
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
          aria-pressed={activeCategory === 'all'}
        >
          全部 ({bones.length})
        </button>
        {boneCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* 骨骼列表：语义按钮而非 div，键盘可达且能播报选中状态 */}
      <div className="sidebar-bone-list">
        <div className="bone-list-header">
          {filteredBones.length} 块骨骼
        </div>
        {filteredBones.map((bone) => (
          <button
            key={bone.id}
            type="button"
            className={`bone-list-item ${selectedBone === bone.id ? 'selected' : ''}`}
            onClick={() => { selectBone(bone.id); closePanels() }}
            aria-pressed={selectedBone === bone.id}
          >
            <span className="bone-list-name-zh">{bone.nameZh}</span>
            <span className="bone-list-name-en">{bone.nameEn}</span>
          </button>
        ))}
        {filteredBones.length === 0 && (
          <div className="bone-list-empty">未找到匹配的骨骼</div>
        )}
      </div>
    </div>
  )
}
