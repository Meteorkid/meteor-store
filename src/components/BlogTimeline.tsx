'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
 * 视觉：每个节点是一颗小星球（径向渐变球体 + 高光 + 光晕），把手旁悬浮当前所在
 * 文章的事件日期标签，随滚动实时更新。
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

/**
 * 节点刻度上限：文章超过该数量时均匀采样（含首尾），避免星球在轨道上重叠。
 * 采样只影响可见刻度，把手拖动/滚动跟随仍走全部文章锚点，定位精确到每篇。
 */
const MAX_NODES = 15;

/**
 * 八大行星配色（径向渐变：左上高光 → 主色环带 → 深色核心），节点按序循环取用，
 * 让每颗星球颜色各异，贴近真实行星的观感。
 */
const PLANETS = [
  // 水星：灰褐
  'radial-gradient(circle at 32% 28%, #ece8e0 0%, #b8aea4 42%, #7a6f63 78%, #453e36 100%)',
  // 金星：米黄
  'radial-gradient(circle at 32% 28%, #fdf3d7 0%, #eed9a9 40%, #c9a24b 76%, #8a6a2f 100%)',
  // 地球：蓝绿
  'radial-gradient(circle at 32% 28%, #dff3ff 0%, #5fb8e8 42%, #1e6fbc 78%, #0f3f7a 100%)',
  // 火星：红褐
  'radial-gradient(circle at 32% 28%, #fbd8d0 0%, #e07a5f 42%, #b03a2e 78%, #6e2018 100%)',
  // 木星：橙褐
  'radial-gradient(circle at 32% 28%, #fbe9c8 0%, #e8b06a 42%, #b5651d 78%, #6e3a10 100%)',
  // 土星：金黄
  'radial-gradient(circle at 32% 28%, #faf0cd 0%, #e8cf8a 42%, #c9a24b 78%, #7a5c22 100%)',
  // 天王星：青绿
  'radial-gradient(circle at 32% 28%, #e1f7f4 0%, #9adbd2 42%, #4db8b0 78%, #2a6f6a 100%)',
  // 海王星：深蓝
  'radial-gradient(circle at 32% 28%, #bcdcff 0%, #5b9bd5 42%, #1f4e9a 78%, #0f2b5e 100%)',
];

/**
 * 北斗七星（星官名 + viewBox 0..100 内的归一化坐标）。
 * 把手以北斗小勺呈现：斗柄朝向随时间轴位置旋转，隐喻「斗柄指四时」。
 */
const BEIDOU = [
  { x: 72, y: 18, name: '天枢 Dubhe' },
  { x: 28, y: 22, name: '天璇 Merak' },
  { x: 30, y: 62, name: '天玑 Phecda' },
  { x: 64, y: 72, name: '天权 Megrez' },
  { x: 82, y: 50, name: '玉衡 Alioth' },
  { x: 90, y: 32, name: '开阳 Mizar' },
  { x: 93, y: 12, name: '摇光 Alkaid' },
];

/** 北斗星点之间的连线（斗魁四边形 + 斗柄），不含星点本身 */
const BEIDOU_LINES =
  'M28 22 L30 62 L64 72 L72 18 L28 22 M64 72 L82 50 L90 32 L93 12';

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

  /** 当前把手所在（最近）的文章节点，用于日期标注 */
  const currentPost =
    posts.length > 0
      ? posts[Math.min(Math.round(p * (posts.length - 1)), posts.length - 1)]
      : undefined;

  /** 可见节点索引：文章多时均匀采样（含首尾），保证轨道不重叠 */
  const visibleIndices = useMemo(() => {
    if (posts.length <= MAX_NODES) return posts.map((_, i) => i);
    const indices: number[] = [];
    const gap = (posts.length - 1) / (MAX_NODES - 1);
    for (let k = 0; k < MAX_NODES; k++) indices.push(Math.round(k * gap));
    return [...new Set(indices)];
  }, [posts]);

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
      style={{ height: 'min(76vh, 640px)' }}
    >
      <div ref={railRef} className="relative h-full">
        {/* 轨道：渐变细线 + 上下渐隐 */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent" />

        {/* 节点刻度：一颗颗小星球（文章多时均匀采样） */}
        {visibleIndices.map((idx) => {
          const post = posts[idx];
          const ratio = posts.length > 1 ? idx / (posts.length - 1) : 0;
          const active = !dragging && Math.abs(p - ratio) < 0.5 / Math.max(posts.length - 1, 1);
          const planetBg = PLANETS[idx % PLANETS.length];
          return (
            <button
              key={post.slug}
              type="button"
              title={`${formatDate(post.eventDate)} · ${post.title}`}
              aria-label={`${formatDate(post.eventDate)} · ${post.title}`}
              aria-pressed={active}
              onClick={() => smoothScrollToP(ratio)}
              className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200"
              style={{ top: `${ratio * 100}%` }}
            >
              <span
                className={`relative block h-3.5 w-3.5 transition-transform duration-200 ${
                  active ? 'scale-[1.4]' : 'hover:scale-110'
                }`}
              >
                {/* 光晕 */}
                <span
                  className={`absolute -inset-1.5 rounded-full blur-[3px] transition-opacity duration-200 ${
                    active ? 'opacity-80' : 'opacity-0'
                  }`}
                  style={{
                    background: 'radial-gradient(circle, rgba(167,139,250,0.9), transparent 70%)',
                  }}
                />
                {/* 球体 */}
                <span
                  className="absolute inset-0 rounded-full transition-shadow duration-200"
                  style={{
                    background: planetBg,
                    boxShadow: active
                      ? '0 0 10px rgba(167,139,250,0.85)'
                      : '0 0 6px rgba(167,139,250,0.4)',
                  }}
                />
                {/* 球体高光点 */}
                <span className="absolute left-[2px] top-[1px] h-[3px] w-[3px] rounded-full bg-white/90" />
              </span>
            </button>
          );
        })}

        {/* 把手：发光星球 + 当前日期悬浮标签 */}
        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${p * 100}%` }}
        >
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
            className="relative block cursor-grab touch-none select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:cursor-grabbing"
          >
            {/* 北斗七星把手：斗柄朝向随时间轴位置旋转（斗柄指四时） */}
            <span className="relative block h-10 w-10">
              {/* 微弱光晕，让北斗在暗底上可读但不抢戏 */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)' }}
              />
              <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: `rotate(${Math.round(p * 360)}deg)`,
                }}
              >
                {/* 连线 */}
                <path
                  d={BEIDOU_LINES}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* 星点：每颗带星官名，可 hover 悬浮显示 */}
                {BEIDOU.map((s) => (
                  <circle key={s.name} cx={s.x} cy={s.y} r="4.5" fill="#e8e8f4">
                    <title>{s.name}</title>
                  </circle>
                ))}
              </svg>
            </span>
          </button>

          {/* 当前时间节点日期标注（悬浮在把手左侧） */}
          {currentPost && (
            <span
              className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[11px] tabular-nums text-white/85 backdrop-blur-sm"
              aria-hidden="true"
            >
              {formatDate(currentPost.eventDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}