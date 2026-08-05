// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

// 忍术→对应图片映射（每个忍术独立图片）
const JUTSU_SILHOUETTE = {
  rasengan: '/apps/chakra-visualizer/assets/silhouettes/rasengan.png',
  'shadow-clone': '/apps/chakra-visualizer/assets/silhouettes/shadow-clone.png',
  rasenshuriken: '/apps/chakra-visualizer/assets/silhouettes/rasenshuriken.png',
  'rasengan-big': '/apps/chakra-visualizer/assets/silhouettes/rasengan-big.png',
  'bijuu-dama': '/apps/chakra-visualizer/assets/silhouettes/bijuu-dama.png',
  chidori: '/apps/chakra-visualizer/assets/silhouettes/chidori.png',
  sharingan: '/apps/chakra-visualizer/assets/silhouettes/sharingan.png',
  susano: '/apps/chakra-visualizer/assets/silhouettes/susano.png',
  amaterasu: '/apps/chakra-visualizer/assets/silhouettes/amaterasu.png',
  kirin: '/apps/chakra-visualizer/assets/silhouettes/kirin.png',
  tsukuyomi: '/apps/chakra-visualizer/assets/silhouettes/tsukuyomi.png',
  totsuka: '/apps/chakra-visualizer/assets/silhouettes/totsuka.png',
  byakugou: '/apps/chakra-visualizer/assets/silhouettes/byakugou.png',
  'sakura-impact': '/apps/chakra-visualizer/assets/silhouettes/sakura-impact.png',
  'sand-coffin': '/apps/chakra-visualizer/assets/silhouettes/sand-coffin.png',
  'sand-shield': '/apps/chakra-visualizer/assets/silhouettes/sand-shield.png',
  'chibaku-tensei': '/apps/chakra-visualizer/assets/silhouettes/chibaku-tensei.png',
  shinra: '/apps/chakra-visualizer/assets/silhouettes/shinra.png',
  fireball: '/apps/chakra-visualizer/assets/silhouettes/fireball.png',
  'hollow-purple': '/apps/chakra-visualizer/assets/silhouettes/hollow-purple.png',
  'eight-gates': '/apps/chakra-visualizer/assets/silhouettes/eight-gates.png',
};

export { JUTSU_SILHOUETTE };

// 预加载的图片缓存
const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * 全屏角色剪影组件 — ref-based，直接操作 DOM
 *
 * 父组件通过 ref.update(jutsuId, progress, visible) 更新动画
 */
const CharacterSilhouette = forwardRef(function CharacterSilhouette(_, ref) {
  const containerRef = useRef(null);
  const imgElRef = useRef(null);
  const currentSrcRef = useRef(null);

  useImperativeHandle(ref, () => ({
    update(jutsuId, progress, visible) {
      const el = containerRef.current;
      const imgEl = imgElRef.current;
      if (!el || !imgEl) return;

      const src = JUTSU_SILHOUETTE[jutsuId] || null;

      if (!visible || !src) {
        el.style.opacity = '0';
        return;
      }

      // 切换图片源
      if (src !== currentSrcRef.current) {
        currentSrcRef.current = src;
        const cached = imageCache.get(src);
        if (cached) {
          imgEl.src = cached.src;
        } else {
          loadImage(src).then((img) => {
            if (currentSrcRef.current === src) {
              imgEl.src = img.src;
            }
          }).catch(() => {});
        }
      }

      // 动画曲线：淡入→缩放→保持→淡出
      let opacity = 0;
      let scale = 1;
      if (progress < 0.15) {
        opacity = (progress / 0.15) * 0.85;
        scale = 0.95 + (progress / 0.15) * 0.05;
      } else if (progress < 0.5) {
        opacity = 0.85;
        scale = 1 + ((progress - 0.15) / 0.35) * 0.05;
      } else if (progress < 0.85) {
        opacity = 0.85 * (1 - (progress - 0.5) / 0.35);
        scale = 1.05;
      } else {
        opacity = 0;
        scale = 1.05;
      }

      el.style.opacity = String(opacity);
      el.style.transform = `scale(${scale})`;
    },
  }));

  return (
    <div
      ref={containerRef}
      className="character-silhouette"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: 0,
        transform: 'scale(1)',
      }}
    >
      <img
        ref={imgElRef}
        alt=""
        style={{
          width: '60vw',
          height: '80vh',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.8))',
        }}
      />
    </div>
  );
});

export default CharacterSilhouette;
