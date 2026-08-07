'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { FeedPostSummary } from '@/data/blog-feed';

/**
 * 博客列表右侧垂直时间轴：以当前页文章节点为刻度，按方案 A（锚点映射）实现。
 *
 * 拖动、页面滚动、文章节点三者共用同一套锚点坐标映射，状态单一、行为稳定：
 * - 拖动：把手位置 → 锚点间线性插值得到目标 scrollTop → requestAnimationFrame 即时滚动
 * - 松手：吸附到最近文章节点，平滑滚动
 * - 页面滚动：按锚点区间反向插值更新把手（只读跟随，不写回滚动）
 * - 点击节点 / 键盘：平滑滚动
 *
 * 锚点由父组件（BlogListClient）通过 anchorsRef 注册，键为文章 slug。
 */

interface BlogTimelineProps {
  /** 当前展示顺序的文章（排序后），决定时间轴节点顺序 */
  posts: FeedPostSummary[];
  /** 父组件注册的文章 DOM 节点，slug → 元素 */
  anchorsRef: React.RefObject<Map<string, HTMLElement>>;
}

/** sticky 头部高度 + 一点余量，滚动目标让文章标题不被头顶盖住 */
const HEADER_OFFSET = 80;

/** 格式化成编辑部风格：2026.07.01 */
function formatDate(date: string): string {
  return date.replace(/-/g, '.');
}

export default function BlogTimeline({ posts, anchorsRef }: BlogTimelineProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef(0);
  const dragRef = useRef(false);
  const [p, setP] = useState(0); // 把手位置 0..1
  const [dragging, setDragging] = useState(false);

  /** 收集当前文章的文档锚点（每次实时读 DOM，保证排序/图片加载后仍准确） */
  const getAnchors = useCallback((): { slug: string; top: number }[] => {
    const out: { slug: string; top: number }[] = [];
    for (const post of posts) {
      const el = anchorsRef.current?.get(post.slug);
      if (el) out.push({ slug: post.slug, top: el.getBoundingClientRect().top + window.scrollY });
    }
    return out;
  }, [posts, anchorsRef]);

  /** p（把手位置）→ scrollTop：在最近两个锚点间线性插值 */
  const pToScrollY = useCallback(
    (pVal: number): number => {
      const anchors = getAnchors();
      if (anchors.length === 0) return 0;
      if (anchors.length === 1) return Math.max(anchors[0].top - HEADER_OFFSET, 0);
      const pos = pVal * (anchors.length - 1);
      const i = Math.min(Math.floor(pos), anchors.length - 2);
      const seg = pos - i;
      const a = anchors[i].top;
      const b = anchors[i + 1].top;
      return Math.max(a + (b - a) * seg - HEADER_OFFSET, 0);
    },
    [getAnchors],
  );

  /** scrollTop → p：找所在锚点区间，反向插值 */
  const scrollToP = useCallback(() => {
    const anchors = getAnchors();
    if (anchors.length < 2) {
      setP(0);
      return;
    }
    const y = window.scrollY + HEADER_OFFSET;
    let next = 0;
    if (y <= anchors[0].top) next = 0;
    else if (y >= anchors[anchors.length - 1].top) next = 1;
    else {
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i].top;
        const b = anchors[i + 1].top;
        if (y >= a && y <= b) {
          const seg = b === a ? 0 : (y - a) / (b - a);
          next = (i + seg) / (anchors.length - 1);
          break;
        }
      }
    }
    setP(next);
  }, [getAnchors]);

  /** 平滑滚动到指定 p（点击节点 / 松手吸附 / 键盘） */
  const smoothScrollToP = useCallback(
    (pVal: number) => {
      const y = pToScrollY(pVal);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      setP(pVal);
    },
    [pToScrollY],
  );

  /** 页面滚动 / 尺寸变化时反向更新把手 */
  useEffect(() => {
    const onUpdate = () => {
      // 拖动中不反写，避免和拖动互相打架
      if (dragRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(scrollToP);
    };
    window.addEventListener('scroll', onUpdate, { passive: true });
    window.addEventListener('resize', onUpdate);
    onUpdate();
    return () => {
      window.removeEventListener('scroll', onUpdate);
      window.removeEventListener('resize', onUpdate);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollToP]);

  /** 把手瞄准：由指针 Y 计算把手位置并即时滚动 */
  const dragTo = useCallback(
    (clientY: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const r = rail.getBoundingClientRect();
      const next = Math.min(Math.max((clientY - r.top) / r.height, 0), 1);
      setP(next);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        window.scrollTo(0, pToScrollY(next));
      });
    },
    [pToScrollY],
  );

  return (
    <div
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      style={{ height: 'min(60vh, 480px)' }}
    >
      <div ref={railRef} className="relative h-full">
        {/* 轨道 */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />

        {/* 节点刻度 */}
        {posts.map((post, i) => {
          const ratio = posts.length > 1 ? i / (posts.length - 1) : 0;
          const active = !dragging && Math.abs(p - ratio) < 0.5 / Math.max(posts.length - 1, 1);
          return (
            <button
              key={post.slug}
              type="button"
              title={`${formatDate(post.eventDate)} · ${post.title}`}
              aria-label={`${formatDate(post.eventDate)} · ${post.title}`}
              onClick={() => smoothScrollToP(ratio)}
              className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
              style={{ top: `${ratio * 100}%` }}
            >
              <span
                className={`block h-2 w-2 rounded-full transition-all duration-200 ${
                  active ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}

        {/* 把手 */}
        <button
          ref={handleRef}
          type="button"
          role="slider"
          aria-label="时间轴"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
          aria-orientation="vertical"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            dragRef.current = true;
            setDragging(true);
            handleRef.current?.setPointerCapture(e.pointerId);
            dragTo(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragRef.current) dragTo(e.clientY);
          }}
          onPointerUp={(e) => {
            dragRef.current = false;
            setDragging(false);
            handleRef.current?.releasePointerCapture(e.pointerId);
            // 松手吸附到最近节点
            const rail = railRef.current;
            if (!rail) return;
            const r = rail.getBoundingClientRect();
            const next = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
            const anchors = getAnchors();
            if (anchors.length < 2) return;
            const nearest = Math.round(next * (anchors.length - 1));
            smoothScrollToP(nearest / (anchors.length - 1));
          }}
          onKeyDown={(e) => {
            const anchors = getAnchors();
            if (anchors.length < 2) return;
            const step = 1 / (anchors.length - 1);
            let next = p;
            if (e.key === 'ArrowUp') next = p - step;
            else if (e.key === 'ArrowDown') next = p + step;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = 1;
            else return;
            e.preventDefault();
            smoothScrollToP(Math.min(Math.max(next, 0), 1));
          }}
          className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:cursor-grabbing"
          style={{ top: `${p * 100}%` }}
        >
          <span className="glass block h-4 w-4 rounded-full border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
        </button>
      </div>
    </div>
  );
}