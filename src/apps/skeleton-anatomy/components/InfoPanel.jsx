// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { getBoneById, boneCategories } from '../data/boneData'

export default function InfoPanel() {
  const selectedBone = useStore((s) => s.selectedBone)
  const infoPanelOpen = useStore((s) => s.infoPanelOpen)
  const closePanels = useStore((s) => s.closePanels)
  const closeButtonRef = useRef(null)
  const bone = selectedBone ? getBoneById(selectedBone) : null
  const category = bone
    ? boneCategories.find((c) => c.id === bone.category)
    : null

  // 移动端抽屉打开后焦点进入面板；桌面端关闭按钮是 display:none，focus 自然无效
  useEffect(() => {
    if (infoPanelOpen) closeButtonRef.current?.focus()
  }, [infoPanelOpen])

  // 未选中骨骼时在桌面端折叠整列，把宽度还给 3D 画布；
  // 移动端仍是底部抽屉，展开时照常显示操作提示。
  const className = [
    'info-panel',
    bone ? '' : 'collapsed',
    infoPanelOpen ? 'open' : '',
  ].filter(Boolean).join(' ')

  const closeButton = (
    <button
      ref={closeButtonRef}
      type="button"
      className="drawer-close"
      onClick={closePanels}
      aria-label="关闭骨骼详情"
    >
      <span aria-hidden="true">✕</span>
    </button>
  )

  if (!bone) {
    return (
      <div id="skeleton-info-panel" className={className} aria-label="骨骼详情">
        {closeButton}
        <div className="info-placeholder">
          <div className="info-icon" aria-hidden="true">🦴</div>
          <h3>点击任意骨骼查看详情</h3>
          <p>鼠标左键旋转 · 滚轮缩放 · 右键平移</p>
        </div>
      </div>
    )
  }

  return (
    <div id="skeleton-info-panel" className={className} aria-label="骨骼详情">
      {closeButton}
      <div className="info-header">
        <span className="info-category-badge">
          {category?.name || bone.category}
        </span>
      </div>

      <h2 className="info-bone-name-zh">{bone.nameZh}</h2>
      <p className="info-bone-name-en">{bone.nameEn}</p>

      <div className="info-section">
        <h4>位置与功能</h4>
        <p>{bone.descriptionZh}</p>
      </div>

      <div className="info-section">
        <h4>Description</h4>
        <p className="info-desc-en">{bone.descriptionEn}</p>
      </div>

      <div className="info-section">
        <h4>所属分类</h4>
        <p>{category?.name} ({category?.nameEn}) · 共 {category?.count} 块</p>
      </div>

      <div className="info-section">
        <h4>编号</h4>
        <p className="info-id">{bone.id}</p>
      </div>
    </div>
  )
}
