// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { getBoneById, boneCategories } from '../data/boneData'

export default function InfoPanel({ locale = 'zh' }) {
  const isZh = locale !== 'en'
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
      aria-label={isZh ? '关闭骨骼详情' : 'Close bone details'}
    >
      <span aria-hidden="true">✕</span>
    </button>
  )

  if (!bone) {
    return (
      <div id="skeleton-info-panel" className={className} aria-label={isZh ? '骨骼详情' : 'Bone details'} role={infoPanelOpen ? 'dialog' : undefined} aria-modal={infoPanelOpen || undefined}>
        {closeButton}
        <div className="info-placeholder">
          <div className="info-icon" aria-hidden="true">🦴</div>
          <h3>{isZh ? '点击任意骨骼查看详情' : 'Select a bone to view details'}</h3>
          <p>{isZh ? '鼠标左键旋转 · 滚轮缩放 · 右键平移' : 'Drag to rotate · Scroll to zoom · Right-drag to pan'}</p>
        </div>
      </div>
    )
  }

  return (
    <div id="skeleton-info-panel" className={className} aria-label={isZh ? '骨骼详情' : 'Bone details'} role={infoPanelOpen ? 'dialog' : undefined} aria-modal={infoPanelOpen || undefined}>
      {closeButton}
      <div className="info-header">
        <span className="info-category-badge">
          {(isZh ? category?.name : category?.nameEn) || bone.category}
        </span>
      </div>

      <h2 className="info-bone-name-zh">{isZh ? bone.nameZh : bone.nameEn}</h2>
      <p className="info-bone-name-en">{isZh ? bone.nameEn : bone.nameZh}</p>

      <div className="info-section">
        <h4>{isZh ? '位置与功能' : 'Location and function'}</h4>
        <p>{isZh ? bone.descriptionZh : bone.descriptionEn}</p>
      </div>

      <div className="info-section">
        <h4>{isZh ? 'Description' : '中文说明'}</h4>
        <p className="info-desc-en">{isZh ? bone.descriptionEn : bone.descriptionZh}</p>
      </div>

      <div className="info-section">
        <h4>{isZh ? '所属分类' : 'Category'}</h4>
        <p>{isZh ? category?.name : category?.nameEn} · {category?.count} {isZh ? '块' : 'bones'}</p>
      </div>

      <div className="info-section">
        <h4>{isZh ? '编号' : 'ID'}</h4>
        <p className="info-id">{bone.id}</p>
      </div>
    </div>
  )
}
