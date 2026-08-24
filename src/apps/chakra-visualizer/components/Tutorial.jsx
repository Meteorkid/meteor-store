// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { useGame } from '../GameContext';
import { createEffectsSystem } from '../modules/effects';
import { createParticleSystem } from '../modules/particles';
import { drawJutsuEffect } from '../utils/jutsu-renderer';
import CharacterSilhouette from './CharacterSilhouette';
import './Tutorial.css';

const JUTSU_IDS = [
  'rasengan','chidori','fireball','hollow-purple','sharingan','shadow-clone','eight-gates','chibaku-tensei',
  'rasenshuriken','susano','amaterasu','tsukuyomi',
  'rasengan-big','bijuu-dama','kirin','totsuka','byakugou','sakura-impact','sand-coffin','sand-shield','shinra'
];
const JUTSU_COLORS = {
  rasengan: { color: '#38bdf8', colorDark: '#0ea5e9', glow: 'rgba(56,189,248,0.6)' },
  chidori: { color: '#a78bfa', colorDark: '#7c3aed', glow: 'rgba(167,139,250,0.6)' },
  fireball: { color: '#fb923c', colorDark: '#ea580c', glow: 'rgba(251,146,60,0.6)' },
  'hollow-purple': { color: '#c084fc', colorDark: '#9333ea', glow: 'rgba(192,132,252,0.6)' },
  sharingan: { color: '#ef4444', colorDark: '#dc2626', glow: 'rgba(239,68,68,0.6)' },
  'shadow-clone': { color: '#818cf8', colorDark: '#6366f1', glow: 'rgba(129,140,248,0.6)' },
  'eight-gates': { color: '#22d3ee', colorDark: '#06b6d4', glow: 'rgba(34,211,238,0.6)' },
  'chibaku-tensei': { color: '#a855f7', colorDark: '#9333ea', glow: 'rgba(168,85,247,0.6)' },
  rasenshuriken: { color: '#0ea5e9', colorDark: '#0284c7', glow: 'rgba(14,165,233,0.6)' },
  susano: { color: '#7c3aed', colorDark: '#6d28d9', glow: 'rgba(124,58,237,0.6)' },
  amaterasu: { color: '#1e1e1e', colorDark: '#000000', glow: 'rgba(80,0,120,0.6)' },
  tsukuyomi: { color: '#dc2626', colorDark: '#991b1b', glow: 'rgba(220,38,38,0.6)' },
  'rasengan-big': { color: '#0284c7', colorDark: '#075985', glow: 'rgba(2,132,199,0.6)' },
  'bijuu-dama': { color: '#f97316', colorDark: '#c2410c', glow: 'rgba(249,115,22,0.6)' },
  kirin: { color: '#a855f7', colorDark: '#7e22ce', glow: 'rgba(168,85,247,0.6)' },
  totsuka: { color: '#fbbf24', colorDark: '#d97706', glow: 'rgba(251,191,36,0.6)' },
  byakugou: { color: '#f472b6', colorDark: '#db2777', glow: 'rgba(244,114,182,0.6)' },
  'sakura-impact': { color: '#ec4899', colorDark: '#be185d', glow: 'rgba(236,72,153,0.6)' },
  'sand-coffin': { color: '#d97706', colorDark: '#92400e', glow: 'rgba(217,119,6,0.6)' },
  'sand-shield': { color: '#eab308', colorDark: '#a16207', glow: 'rgba(234,179,8,0.6)' },
  shinra: { color: '#6366f1', colorDark: '#4338ca', glow: 'rgba(99,102,241,0.6)' },
};
const JUTSU_ANIME = {
  rasengan: 'Naruto', chidori: 'Naruto', fireball: 'Naruto',
  'hollow-purple': 'Jujutsu Kaisen', sharingan: 'Naruto',
  'shadow-clone': 'Naruto', 'eight-gates': 'Naruto', 'chibaku-tensei': 'Naruto',
  rasenshuriken: 'Naruto', susano: 'Naruto', amaterasu: 'Naruto', tsukuyomi: 'Naruto',
  'rasengan-big': 'Naruto', 'bijuu-dama': 'Naruto', kirin: 'Naruto', totsuka: 'Naruto',
  byakugou: 'Naruto', 'sakura-impact': 'Naruto', 'sand-coffin': 'Naruto',
  'sand-shield': 'Naruto', shinra: 'Naruto',
};
const JUTSU_HANDS = {
  rasengan: 'right', chidori: 'left', fireball: 'either', 'hollow-purple': 'either',
  sharingan: 'either', 'shadow-clone': 'either', 'eight-gates': 'either', 'chibaku-tensei': 'either',
  rasenshuriken: 'combo', susano: 'combo', amaterasu: 'combo', tsukuyomi: 'combo',
  'rasengan-big': 'combo', 'bijuu-dama': 'combo', kirin: 'combo', totsuka: 'combo',
  byakugou: 'combo', 'sakura-impact': 'combo', 'sand-coffin': 'combo',
  'sand-shield': 'combo', shinra: 'combo',
};

// 角色分组
const CHARACTERS = [
  { id: 'naruto', name: { en: 'Naruto', zh: '鸣人' }, emoji: '🍥', ids: ['rasengan','shadow-clone','rasenshuriken','rasengan-big','bijuu-dama'] },
  { id: 'sasuke', name: { en: 'Sasuke', zh: '佐助' }, emoji: '⚡', ids: ['chidori','sharingan','susano','amaterasu','kirin'] },
  { id: 'itachi', name: { en: 'Itachi', zh: '鼬' }, emoji: '🌀', ids: ['tsukuyomi','totsuka'] },
  { id: 'sakura', name: { en: 'Sakura', zh: '小樱' }, emoji: '🌸', ids: ['byakugou','sakura-impact'] },
  { id: 'gaara', name: { en: 'Gaara', zh: '我爱罗' }, emoji: '🏜️', ids: ['sand-coffin','sand-shield'] },
  { id: 'pain', name: { en: 'Pain', zh: '佩恩' }, emoji: '🔴', ids: ['chibaku-tensei','shinra'] },
  { id: 'other', name: { en: 'Others', zh: '其他' }, emoji: '🌀', ids: ['fireball','hollow-purple','eight-gates'] },
];

/** 视频忍术映射 — Camera.jsx 中 rasengan/chidori/fireball 使用 MP4 视频元素 */
const VIDEO_JUTSU = {
  rasengan: '/apps/chakra-visualizer/assets/naruto.mp4',
  chidori: '/apps/chakra-visualizer/assets/chidori.mp4',
  fireball: '/apps/chakra-visualizer/assets/fireball.mp4',
};

/** 忍术预览动画组件 — 完全复制 Camera.jsx 渲染管线 */
const JutsuPreview = ({ jutsuId }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const silhouetteRef = useRef(null);

  // rasengan/chidori/fireball 使用 MP4 视频（与 Camera.jsx 一致）
  const isVideo = jutsuId in VIDEO_JUTSU;

  // 视频忍术：确保切换时从头播放
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [jutsuId, isVideo]);

  useEffect(() => {
    if (isVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const effects = createEffectsSystem({ particleLimit: 200, getTime: () => Date.now() * 0.001 });
    const particleSys = createParticleSystem(200);
    let raf;
    let cachedDpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cachedDpr = dpr;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const DURATION = 3000;
    const startTime = Date.now();

    function animate() {
      raf = requestAnimationFrame(animate);
      const now = Date.now();
      const elapsed = (now - startTime) % DURATION;
      const t01 = elapsed / DURATION;
      const progress = Math.sin(t01 * Math.PI);
      silhouetteRef.current?.update(jutsuId, progress, true);

      const w = canvas.width / cachedDpr, h = canvas.height / cachedDpr;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      const cx = w / 2, cy = h / 2;
      const t = now * 0.001;

      particleSys.update(1);

      // 使用共享的大招渲染逻辑
      drawJutsuEffect(ctx, effects, particleSys, jutsuId, cx, cy, progress, t);

      particleSys.render(ctx);
    }
    animate();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [jutsuId]);

  // 视频忍术：直接播放 MP4（与 Camera.jsx 一致）
  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={VIDEO_JUTSU[jutsuId]}
        className="jutsu-preview-canvas"
        style={{ objectFit: 'contain', background: '#000' }}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="jutsu-preview-canvas"
      />
      <CharacterSilhouette
        ref={silhouetteRef}
      />
    </>
  );
};

const GestureIllustration = ({ jutsu, size = 160 }) => {
  const c = jutsu.color;
  const s = size;
  const scale = s / 200;

  if (jutsu.id === 'rasengan' || jutsu.id === 'chidori') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id={`glow-${jutsu.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill={`url(#glow-${jutsu.id})`} />
        {/* Palm */}
        <ellipse cx="100" cy="128" rx="32" ry="36" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Wrist */}
        <path d="M 80 158 Q 80 170 85 175 Q 100 178 115 175 Q 120 170 120 158" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Thumb */}
        <path d="M 68 118 Q 50 108 44 90 Q 41 76 48 68" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Index */}
        <path d="M 84 94 Q 83 68 82 45 Q 82 33 86 26" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Middle */}
        <path d="M 99 88 Q 99 58 99 30 Q 99 18 103 12" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Ring */}
        <path d="M 114 92 Q 116 62 116 38 Q 116 26 112 20" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Pinky */}
        <path d="M 127 104 Q 132 82 133 64 Q 133 54 130 48" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Fingertip dots */}
        <circle cx="86" cy="26" r="3.5" fill={c} />
        <circle cx="103" cy="12" r="3.5" fill={c} />
        <circle cx="112" cy="20" r="3.5" fill={c} />
        <circle cx="130" cy="48" r="3.5" fill={c} />
        <circle cx="48" cy="68" r="3" fill={c} />
        {/* Wrist dot */}
        <circle cx="100" cy="160" r="4" fill={c} />
        {/* Knuckle line */}
        <path d="M 78 110 Q 100 105 124 112" fill="none" stroke={c} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3,3"/>
      </svg>
    );
  }

  if (jutsu.id === 'fireball') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id="glow-fireball" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.25" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow-fireball)" />

        {/* ── FIST BODY ── */}
        {/* Main knuckle row — 4 rounded rectangles side by side */}
        <rect x="62" y="95" width="18" height="16" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="82" y="91" width="18" height="20" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="102" y="91" width="18" height="20" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="122" y="95" width="16" height="16" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Palm connecting the knuckles */}
        <rect x="62" y="109" width="76" height="30" rx="8" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Wrist */}
        <path d="M 72 139 L 72 158 Q 72 165 100 165 Q 128 165 128 158 L 128 139" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>

        {/* ── THUMB POINTING UP ── */}
        {/* Thumb base from side of fist */}
        <path d="M 62 120 Q 50 118 46 108 Q 43 96 48 82 Q 52 70 58 58 Q 62 48 65 38"
          fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        {/* Thumb outline — right side */}
        <path d="M 62 120 Q 56 118 58 105 Q 60 90 64 75 Q 68 60 72 45"
          fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Thumb tip flat cap */}
        <path d="M 65 38 Q 69 34 72 45" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Thumb tip dot */}
        <circle cx="68" cy="40" r="4" fill={c}/>
        {/* Thumb knuckle crease */}
        <path d="M 50 95 Q 57 93 62 97" fill="none" stroke={c} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>

        {/* Wrist landmark dot */}
        <circle cx="100" cy="152" r="4" fill={c}/>
      </svg>
    );
  }

  // Scissor / V-Sign — Sharingan
  if (jutsu.id === 'sharingan') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id="glow-sharingan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow-sharingan)" />
        {/* Palm */}
        <ellipse cx="100" cy="130" rx="30" ry="34" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Wrist */}
        <path d="M 82 158 Q 82 168 100 170 Q 118 168 118 158" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Thumb — curled */}
        <path d="M 70 120 Q 62 115 65 108 Q 68 100 72 105" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Index — extended up */}
        <path d="M 84 96 Q 82 65 82 40 Q 82 28 86 22" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Middle — extended up */}
        <path d="M 100 90 Q 100 58 100 32 Q 100 20 104 14" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Ring — curled */}
        <path d="M 114 96 Q 116 85 118 80 Q 120 76 118 82 Q 116 90 114 96" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Pinky — curled */}
        <path d="M 126 108 Q 130 100 130 96 Q 130 92 128 98 Q 126 104 126 108" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Fingertip dots */}
        <circle cx="86" cy="22" r="3.5" fill={c} />
        <circle cx="104" cy="14" r="3.5" fill={c} />
        <circle cx="100" cy="160" r="4" fill={c} />
      </svg>
    );
  }

  // Rock Sign — Shadow Clone
  if (jutsu.id === 'shadow-clone') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id="glow-clone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow-clone)" />
        {/* Palm */}
        <ellipse cx="100" cy="130" rx="30" ry="34" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Wrist */}
        <path d="M 82 158 Q 82 168 100 170 Q 118 168 118 158" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Thumb — curled */}
        <path d="M 70 120 Q 62 115 65 108 Q 68 100 72 105" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Index — extended */}
        <path d="M 84 96 Q 82 65 82 40 Q 82 28 86 22" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Middle — extended */}
        <path d="M 100 90 Q 100 58 100 32 Q 100 20 104 14" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Ring — curled */}
        <path d="M 114 96 Q 116 85 118 80 Q 120 76 118 82 Q 116 90 114 96" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Pinky — extended */}
        <path d="M 126 108 Q 132 82 133 58 Q 133 46 130 40" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Fingertip dots */}
        <circle cx="86" cy="22" r="3.5" fill={c} />
        <circle cx="104" cy="14" r="3.5" fill={c} />
        <circle cx="130" cy="40" r="3.5" fill={c} />
        <circle cx="100" cy="160" r="4" fill={c} />
      </svg>
    );
  }

  // Fist — Eight Gates
  if (jutsu.id === 'eight-gates') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id="glow-gates" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow-gates)" />
        {/* Knuckle row */}
        <rect x="62" y="88" width="18" height="16" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="82" y="84" width="18" height="20" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="102" y="84" width="18" height="20" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="122" y="88" width="16" height="16" rx="5" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Palm */}
        <rect x="62" y="102" width="76" height="30" rx="8" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Wrist */}
        <path d="M 72 132 L 72 155 Q 72 162 100 162 Q 128 162 128 155 L 128 132" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Thumb — curled over fingers */}
        <path d="M 62 108 Q 50 104 48 96 Q 46 88 52 84 Q 58 80 62 88" fill="none" stroke={c} strokeWidth="2.5"/>
        <circle cx="55" cy="84" r="3" fill={c}/>
        <circle cx="100" cy="150" r="4" fill={c}/>
      </svg>
    );
  }

  // Palm Down — Chibaku Tensei
  if (jutsu.id === 'chibaku-tensei') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id="glow-chibaku" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow-chibaku)" />
        {/* Palm — facing down */}
        <ellipse cx="100" cy="90" rx="34" ry="28" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Wrist — above palm */}
        <path d="M 80 68 Q 80 58 100 56 Q 120 58 120 68" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Thumb — spread */}
        <path d="M 68 95 Q 50 100 42 112 Q 38 120 44 124" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Index — pointing down */}
        <path d="M 84 116 Q 83 140 83 158 Q 83 168 87 172" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Middle — pointing down */}
        <path d="M 98 116 Q 98 142 98 162 Q 98 172 102 176" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Ring — pointing down */}
        <path d="M 112 116 Q 113 140 113 156 Q 113 166 111 170" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Pinky — pointing down */}
        <path d="M 124 108 Q 128 130 128 146 Q 128 154 126 158" fill="none" stroke={c} strokeWidth="2.5"/>
        {/* Fingertip dots */}
        <circle cx="87" cy="172" r="3.5" fill={c} />
        <circle cx="102" cy="176" r="3.5" fill={c} />
        <circle cx="111" cy="170" r="3.5" fill={c} />
        <circle cx="126" cy="158" r="3.5" fill={c} />
        <circle cx="44" cy="124" r="3" fill={c} />
        <circle cx="100" cy="60" r="4" fill={c} />
      </svg>
    );
  }

  // Combo Jutsu — 结印序列图标
  if (jutsu.hand === 'combo') {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
        <defs>
          <radialGradient id={`glow-${jutsu.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.4" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill={`url(#glow-${jutsu.id})`} />
        {/* 结印序列环 */}
        <circle cx="100" cy="100" r="60" fill="none" stroke={c} strokeWidth="2" strokeDasharray="8,4" opacity="0.6"/>
        <circle cx="100" cy="100" r="45" fill="none" stroke={c} strokeWidth="1.5" opacity="0.4"/>
        {/* 中心大招图标 */}
        {jutsu.id === 'rasenshuriken' && <>
          <polygon points="100,50 110,90 100,85 90,90" fill={c} opacity="0.8"/>
          <polygon points="100,150 110,110 100,115 90,110" fill={c} opacity="0.8"/>
          <polygon points="50,100 90,90 85,100 90,110" fill={c} opacity="0.8"/>
          <polygon points="150,100 110,90 115,100 110,110" fill={c} opacity="0.8"/>
          <circle cx="100" cy="100" r="12" fill={c} opacity="0.9"/>
        </>}
        {jutsu.id === 'susano' && <>
          <circle cx="100" cy="65" r="15" fill={c} opacity="0.7"/>
          <rect x="92" y="80" width="16" height="50" rx="4" fill={c} opacity="0.6"/>
          <line x1="70" y1="95" x2="130" y2="95" stroke={c} strokeWidth="4" opacity="0.5"/>
          <line x1="85" y1="130" x2="75" y2="160" stroke={c} strokeWidth="4" opacity="0.5"/>
          <line x1="115" y1="130" x2="125" y2="160" stroke={c} strokeWidth="4" opacity="0.5"/>
        </>}
        {jutsu.id === 'amaterasu' && <>
          <path d="M 100,60 Q 115,80 105,100 Q 120,90 110,110 Q 125,105 115,125 Q 100,140 85,125 Q 75,105 90,110 Q 80,90 95,100 Q 85,80 100,60 Z" fill={c} opacity="0.8"/>
          <circle cx="100" cy="100" r="8" fill="#1a0000" opacity="0.9"/>
        </>}
        {jutsu.id === 'tsukuyomi' && <>
          <circle cx="100" cy="100" r="25" fill="none" stroke={c} strokeWidth="3" opacity="0.8"/>
          <circle cx="100" cy="100" r="10" fill={c} opacity="0.9"/>
          <circle cx="100" cy="100" r="4" fill="#1a0000" opacity="0.9"/>
          <line x1="100" y1="60" x2="100" y2="140" stroke={c} strokeWidth="1.5" opacity="0.3"/>
          <line x1="60" y1="100" x2="140" y2="100" stroke={c} strokeWidth="1.5" opacity="0.3"/>
        </>}
        {/* 结印步骤数 */}
        <text x="100" y="180" textAnchor="middle" fill={c} fontSize="14" fontFamily="Bebas Neue" opacity="0.7">
          {jutsu.id === 'tsukuyomi' ? '3-SEAL' : '4-SEAL'}
        </text>
      </svg>
    );
  }

  // Pinch — Hollow Purple
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" className="gesture-svg">
      <defs>
        <radialGradient id="glow-hp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#glow-hp)" />

      {/* ── PALM ── */}
      <rect x="72" y="115" width="56" height="44" rx="10" fill="none" stroke={c} strokeWidth="2.5"/>
      {/* Wrist */}
      <path d="M 82 159 L 82 172 Q 82 178 100 178 Q 118 178 118 172 L 118 159"
        fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── INDEX FINGER — extended, curves down to pinch point ── */}
      {/* Left edge */}
      <path d="M 82 115 Q 80 96 76 80 Q 72 66 74 56"
        fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Right edge */}
      <path d="M 96 115 Q 94 96 90 80 Q 86 66 84 56"
        fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Fingertip cap */}
      <path d="M 74 56 Q 79 48 84 56" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── THUMB — sweeps across to meet index tip ── */}
      {/* Outer edge */}
      <path d="M 72 130 Q 56 124 52 112 Q 48 98 54 84 Q 60 70 72 60 Q 76 56 79 52"
        fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Inner edge */}
      <path d="M 72 122 Q 60 117 58 106 Q 56 94 62 82 Q 67 72 76 63"
        fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Thumb tip cap */}
      <path d="M 79 52 Q 81 48 76 63" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/>

      {/* ── PINCH CONTACT POINT ── */}
      <circle cx="79" cy="54" r="10" fill="none" stroke={c} strokeWidth="2" strokeDasharray="4,3"/>
      <circle cx="79" cy="54" r="4" fill={c}/>

      {/* ── CURLED MIDDLE, RING, PINKY ── shown as bumps over palm ── */}
      {/* Middle — small arc peeking above palm */}
      <path d="M 100 115 Q 100 104 104 98 Q 108 92 110 98 Q 112 104 110 115"
        fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.65" strokeLinecap="round"/>
      {/* Ring */}
      <path d="M 112 115 Q 113 106 116 101 Q 119 96 121 102 Q 123 108 122 115"
        fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round"/>
      {/* Pinky */}
      <path d="M 121 115 Q 122 108 124 104 Q 126 100 127 105 Q 128 110 127 115"
        fill="none" stroke={c} strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round"/>

      {/* Wrist landmark dot */}
      <circle cx="100" cy="168" r="4" fill={c}/>
    </svg>
  );
};

const ChakraParticles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.4,
      alpha: 0.1 + Math.random() * 0.4,
      // 火影色系：查克拉蓝 + 写轮眼红 + 晓红
      color: ['#c62828','#ff5252','#1565c0','#42a5f5','#ef6c00','#c62828','#b71c1c','#0d47a1'][Math.floor(Math.random()*8)]
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="chakra-particles" />;
};



const Tutorial = ({ onStart }) => {
  const { lang, setLang, t } = useLanguage();
  const { mode, setMode } = useGame();
  const [selectedJutsu, setSelectedJutsu] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  // 动态生成 jutsuData
  const jutsuData = JUTSU_IDS.map(id => ({
    id,
    name: t(`jutsu.${id}.name`),
    kanji: t(`jutsu.${id}.kanji`),
    color: JUTSU_COLORS[id].color,
    colorDark: JUTSU_COLORS[id].colorDark,
    glow: JUTSU_COLORS[id].glow,
    description: t(`jutsu.${id}.description`),
    anime: JUTSU_ANIME[id],
    gesture: t(`jutsu.${id}.gesture`),
    hand: JUTSU_HANDS[id],
    instructions: (() => {
      const instArr = t(`jutsu.${id}.instructions`);
      if(!Array.isArray(instArr)) return [];
      return instArr.filter(s => typeof s === 'string');
    })(),
  }));

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const t2 = setTimeout(() => setCardsVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="tutorial-root">
      <ChakraParticles />
      <div className="sharingan-bg" />
      <div className="naruto-deco" />
      <div className="naruto-elements" />
      <div className="naruto-characters" />

      {/* 角色图片 */}
      <div className="character-images" aria-hidden="true">
        <img src="/apps/chakra-visualizer/assets/naruto-uzumaki.png" alt="Naruto Uzumaki" className="character-img naruto-left" />
        <img src="/apps/chakra-visualizer/assets/naruto-action.png" alt="Naruto Action" className="character-img naruto-right" />
        <img src="/apps/chakra-visualizer/assets/naruto-portrait.png" alt="Naruto Portrait" className="character-img naruto-center" />
        <img src="/apps/chakra-visualizer/assets/naruto-sitting.png" alt="Naruto Sitting" className="character-img naruto-float" />
      </div>

      {/* 动态技能特效 */}
      <div className="skill-effects">
        {/* 螺旋丸 */}
        <div className="skill-rasengan r1" />
        <div className="skill-rasengan r2" />
        <div className="skill-rasengan r3" />
        {/* 千鸟闪电 */}
        <div className="skill-chidori c1" />
        <div className="skill-chidori c2" />
        <div className="skill-chidori c3" />
        {/* 火遁火焰 */}
        <div className="skill-fire f1" />
        <div className="skill-fire f2" />
        <div className="skill-fire f3" />
        <div className="skill-fire f4" />
        <div className="skill-fire f5" />
        <div className="skill-fire f6" />
        {/* 写轮眼脉冲 */}
        <div className="skill-sharingan-pulse sp1" />
        <div className="skill-sharingan-pulse sp2" />
        <div className="skill-sharingan-pulse sp3" />
        {/* 地爆天星 */}
        <div className="skill-chibaku cb1" />
        <div className="skill-chibaku cb2" />
        {/* 查克拉能量线 */}
        <div className="skill-chakra-lines">
          <div className="chakra-line cl1" />
          <div className="chakra-line cl2" />
          <div className="chakra-line cl3" />
          <div className="chakra-line cl4" />
        </div>
      </div>

      <div className="chakra-swirl swirl-1" />
      <div className="chakra-swirl swirl-2" />
      <div className="chakra-swirl swirl-3" />

      <div className="leaf-corner top-left" />
      <div className="leaf-corner bottom-right" />
      <div className="top-accent" />

      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* 控制按钮组 */}
      <div className="control-group">
        <button
          className="control-btn"
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          aria-label={lang === 'en' ? 'Switch language to Chinese' : '切换语言为英文'}
        >
          <span aria-hidden="true">🌐</span> {lang === 'en' ? 'English' : '中文'}
        </button>
        <button
          className={`control-btn mode-btn ${mode === 'master' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'novice' ? 'master' : 'novice')}
        >
          {mode === 'novice' ? t('noviceMode') : t('masterMode')}
        </button>
      </div>

      {/* Hero Section */}
      <header className={`hero ${heroVisible ? 'visible' : ''}`}>
        <div className="hero-badge">{t('badge')}</div>
        {mode === 'master' && (
          <div className="master-indicator">⚡ {t('masterMode')} — {t('masterDesc')}</div>
        )}
        <h1 className="hero-title">
          <a
            href="https://github.com/Meteorkid/Chakra-Visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-title-link"
          >
            <span className="hero-title-en">CHAKRA</span>
          </a>
        </h1>
        <p className="hero-subtitle">
          {t('subtitle1')}<em>{JUTSU_IDS.length} {t('statJutsu')}</em>{t('subtitle2')}<br />
          {t('subtitle3')}
        </p>

        <div className="hero-action">
          <button className="launch-btn" onClick={() => onStart()}>
            <span className="launch-icon">⦿</span>
            <span className="launch-text">
              <span className="launch-main">{t('activateWebcam')}</span>
              <span className="launch-sub">{t('allJutsu')}</span>
            </span>
          </button>
          <p className="cta-hint">{t('clickHint')}</p>
        </div>

        <div className="hero-stats">
          <div className="stat"><span className="stat-num">{JUTSU_IDS.length}</span><span className="stat-label">{t('statJutsu')}</span></div>
          <div className="stat-divider"/>
          <div className="stat"><span className="stat-num">{new Set(Object.values(JUTSU_ANIME)).size}</span><span className="stat-label">{t('statAnime')}</span></div>
          <div className="stat-divider stat-performance"/>
          <div className="stat stat-performance"><span className="stat-num">60fps</span><span className="stat-label">{t('statFps')}</span></div>
        </div>
      </header>

      {/* Section label */}
      <div className={`section-label ${cardsVisible ? 'visible' : ''}`}>
        <span className="section-line" />
        <span>{t('selectTechnique')}</span>
        <span className="section-line" />
      </div>

      {/* 结印手势指南 */}
      <details className={`seal-guide ${cardsVisible ? 'visible' : ''}`}>
        <summary className="seal-guide-title">{lang === 'zh' ? '🖐️ 查看结印手势指南' : '🖐️ View seal gesture guide'}</summary>
        <div className="seal-grid">
          {[
            { seal: '子', emoji: '👊', gesture: lang === 'zh' ? '握拳' : 'Fist', key: 'fist' },
            { seal: '丑', emoji: '🖐️', gesture: lang === 'zh' ? '张掌' : 'Open Palm', key: 'palm' },
            { seal: '寅', emoji: '✌️', gesture: lang === 'zh' ? 'V字' : 'V-Sign', key: 'v' },
            { seal: '卯', emoji: '👍', gesture: lang === 'zh' ? '竖拇指' : 'Thumb Up', key: 'thumb' },
            { seal: '辰', emoji: '🤘', gesture: lang === 'zh' ? '摇滚' : 'Rock', key: 'rock' },
            { seal: '巳', emoji: '🤏', gesture: lang === 'zh' ? '捏合' : 'Pinch', key: 'pinch' },
            { seal: '午', emoji: '🖐️↓', gesture: lang === 'zh' ? '掌朝下' : 'Palm Down', key: 'down' },
            { seal: '未', emoji: '☝️', gesture: lang === 'zh' ? '食指' : 'Index', key: 'index' },
          ].map(s => (
            <div key={s.key} className="seal-item">
              <span className="seal-emoji">{s.emoji}</span>
              <span className="seal-char">{s.seal}</span>
              <span className="seal-name">{s.gesture}</span>
            </div>
          ))}
        </div>
      </details>

      {/* 按角色分组显示技能 */}
      {CHARACTERS.map((char) => {
        const charJutsu = jutsuData.filter(j => char.ids.includes(j.id));
        if(charJutsu.length === 0) return null;
        return (
          <div key={char.id} className={`character-section ${cardsVisible ? 'visible' : ''}`}>
            <div className="character-header">
              <span className="character-emoji">{char.emoji}</span>
              <span className="character-name">{char.name[lang]}</span>
            </div>
            <div className="jutsu-grid">
              {charJutsu.map((jutsu, i) => (
                <button
                  key={jutsu.id}
                  className="jutsu-card"
                  onClick={() => setSelectedJutsu(jutsu.id)}
                  style={{ '--c': jutsu.color, '--glow': jutsu.glow, animationDelay: `${i * 0.08}s` }}
                >
                  <div className="card-anime-tag">{jutsu.anime}</div>
                  <div className="card-illustration">
                    <GestureIllustration jutsu={jutsu} size={110} />
                  </div>
                  <div className="card-body">
                    <div className="card-kanji">{jutsu.kanji}</div>
                    <h3 className="card-name">{jutsu.name}</h3>
                    <div className="card-meta">
                      <span className="card-gesture-tag">{jutsu.gesture}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="card-hand">{jutsu.hand === 'either' ? t('eitherHand') : jutsu.hand === 'left' ? t('leftHand') : jutsu.hand === 'combo' ? t('comboHand') : t('rightHand')}</span>
                    <span className="card-arrow">→</span>
                  </div>
                  <div className="card-glow-border" />
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {selectedJutsu && (() => {
        const sj = jutsuData.find(j => j.id === selectedJutsu);
        if(!sj) return null;
        return (
        <div className="modal-backdrop" onClick={() => setSelectedJutsu(null)}>
          <div
            className="modal"
            style={{ '--c': sj.color, '--glow': sj.glow }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedJutsu(null)}>✕</button>

            <div className="modal-top">
              <div className="modal-illustration">
                <GestureIllustration jutsu={sj} size={200} />
              </div>
              <div className="modal-info">
                <div className="modal-anime">{sj.anime}</div>
                <div className="modal-kanji">{sj.kanji}</div>
                <h2 className="modal-name">{sj.name}</h2>
                <p className="modal-desc">{sj.description}</p>
                <div className="modal-tags">
                  <span className="modal-tag">{sj.gesture}</span>
                  <span className="modal-tag">
                    {sj.hand === 'either' ? t('eitherHand') : sj.hand === 'left' ? t('leftHand') : sj.hand === 'combo' ? t('comboHand') : t('rightHand')}
                  </span>
                </div>
              </div>
            </div>

            {/* 忍术释放预览动画 */}
            <div className="modal-preview">
              <JutsuPreview jutsuId={sj.id} />
            </div>

            <div className="modal-steps">
              <h4 className="steps-heading">{t('howToPerform')}</h4>
              <ol className="steps-list">
                {sj.instructions.map((step, idx) => (
                  <li key={idx} style={{ '--step-color': sj.color }}>
                    <span className="step-num">{String(idx + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="modal-tip">
              <span className="tip-icon">⚡</span>
              {sj.hand === 'either' ? t('eitherHandTip')
                : sj.hand === 'combo' ? t('comboTip')
                : t('singleHandTip', { hand: sj.hand === 'left' ? t('leftHand') : t('rightHand') })}
            </div>

            <button
              className="modal-launch-btn"
              onClick={() => onStart(sj.id)}
            >
              {t('practice')} {sj.name}
            </button>
          </div>
        </div>
        );
      })()}

      <footer className="footer">
        {t('footer')} &nbsp;·&nbsp;
        <a href="https://github.com/Meteorkid/Chakra-Visualizer" target="_blank" rel="noopener noreferrer">{t('github')}</a>
        &nbsp;·&nbsp; {t('copyright')}
      </footer>
    </div>
  );
};

export default Tutorial;
