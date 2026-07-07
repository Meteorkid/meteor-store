'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

const CHARS = '.,-~:;=!*#$@';

/**
 * ASCII 字符实时渲染的旋转莫比乌斯环——数学艺术 × donut.c 致敬。
 * 交互与动态：
 * - 鼠标视差跟随：指针位置驱动视角倾斜（缓动插值，跟手但不晃眼）
 * - 环带流光：一道亮度波沿环面循环流动，用光展示"单面无限"的拓扑之美
 * - 色相呼吸：紫–粉基调随时间缓慢漂移
 * - 高亮字符辉光：最亮的字符带柔光，形成光晕层次
 * 纯 Canvas 零依赖；移动端降分辨率 + 30fps；prefers-reduced-motion 渲染静态单帧。
 */
export default function AsciiMobius({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    // 内部分辨率跟随实际显示尺寸，避免 CSS 拉伸导致字符发糊
    canvas.width = canvas.offsetWidth || 560;
    canvas.height = canvas.offsetHeight || 420;
    // 字符网格：移动端降约 40% 分辨率
    const cellW = isMobile ? 11 : 7;
    const cellH = isMobile ? 16 : 11;
    const cols = Math.floor(canvas.width / cellW);
    const rows = Math.floor(canvas.height / cellH);
    ctx.font = `${cellH - 1}px monospace`;
    ctx.textBaseline = 'top';

    // 莫比乌斯环参数
    const R = 1.05;       // 主半径
    const W = 0.42;       // 带宽的一半
    const STEP_U = isMobile ? 0.045 : 0.028;
    const STEP_V = 0.11;
    const BASE_TILT = 0.55;
    const light = { x: 0.4, y: -0.7, z: -0.6 };

    // 鼠标视差目标与当前值（缓动插值）
    const view = { tilt: BASE_TILT, yaw: 0 };
    const target = { tilt: BASE_TILT, yaw: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;   // -0.5 ~ 0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      target.yaw = nx * 0.9;                // 左右扭头 ±0.45rad，明显跟手
      target.tilt = BASE_TILT + ny * 0.7;   // 上下俯仰
    };
    if (!reducedMotion) window.addEventListener('mousemove', onMouseMove, { passive: true });

    function renderFrame(angle: number, shimmerPhase: number, hueBase: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const zbuf = new Float32Array(cols * rows);
      const chbuf = new Int16Array(cols * rows).fill(-1);
      const ubuf = new Float32Array(cols * rows);
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const cosT = Math.cos(view.tilt), sinT = Math.sin(view.tilt);
      const cosY = Math.cos(view.yaw), sinY = Math.sin(view.yaw);

      for (let u = 0; u < Math.PI * 2; u += STEP_U) {
        const cu = Math.cos(u), su = Math.sin(u);
        const ch = Math.cos(u / 2), sh = Math.sin(u / 2);
        for (let v = -1; v <= 1; v += STEP_V) {
          const w = v * W;
          const px = (R + w * ch) * cu;
          const py = (R + w * ch) * su;
          const pz = w * sh;
          // 解析偏导叉积求法向量
          const du = { x: -(R + w * ch) * su - w * sh * 0.5 * cu, y: (R + w * ch) * cu - w * sh * 0.5 * su, z: w * ch * 0.5 };
          const dv = { x: W * ch * cu, y: W * ch * su, z: W * sh };
          let nx = du.y * dv.z - du.z * dv.y;
          let ny = du.z * dv.x - du.x * dv.z;
          let nz = du.x * dv.y - du.y * dv.x;
          const nlen = Math.hypot(nx, ny, nz) || 1;
          nx /= nlen; ny /= nlen; nz /= nlen;

          // 旋转链：绕 Y（自转）→ 绕 X（俯仰）→ 绕 Y（鼠标偏航）
          let rx = px * cosA + pz * sinA;
          let rz = -px * sinA + pz * cosA;
          let ry = py * cosT - rz * sinT;
          rz = py * sinT + rz * cosT;
          const rx2 = rx * cosY + rz * sinY;
          rz = -rx * sinY + rz * cosY;
          rx = rx2;

          let nx1 = nx * cosA + nz * sinA;
          let nz1 = -nx * sinA + nz * cosA;
          const ny1 = ny * cosT - nz1 * sinT;
          nz1 = ny * sinT + nz1 * cosT;
          const nx2 = nx1 * cosY + nz1 * sinY;
          nz1 = -nx1 * sinY + nz1 * cosY;
          nx1 = nx2;

          const K = 3.2;
          const invZ = 1 / (rz + K);
          const sx = Math.floor(cols / 2 + rx * invZ * cols * 0.85);
          const sy = Math.floor(rows / 2 + ry * invZ * rows * 0.85);
          if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue;

          const idx = sy * cols + sx;
          if (invZ <= zbuf[idx]) continue;
          zbuf[idx] = invZ;

          // 基础亮度（单面曲面取绝对值）+ 流光波（沿 u 循环流动的高光带）
          let lum = Math.abs(nx1 * light.x + ny1 * light.y + nz1 * light.z);
          const wave = Math.pow(Math.max(0, Math.cos(u - shimmerPhase)), 6);
          lum = Math.min(1, lum * 0.8 + wave * 0.55);
          chbuf[idx] = Math.min(CHARS.length - 1, Math.floor(lum * CHARS.length));
          ubuf[idx] = u;
        }
      }

      const glowThreshold = CHARS.length - 3;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const ci = chbuf[idx];
          if (ci < 0) continue;
          const lum = ci / (CHARS.length - 1);
          // 色相沿环面渐变 + 整体呼吸漂移
          const hue = hueBase - lum * 40 + Math.sin(ubuf[idx]) * 12;
          // 高亮字符加辉光（移动端跳过，省性能）
          if (!isMobile && ci >= glowThreshold) {
            ctx.shadowColor = `hsla(${hue}, 90%, 70%, 0.9)`;
            ctx.shadowBlur = 9;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `hsla(${hue}, ${70 + lum * 20}%, ${38 + lum * 45}%, ${0.5 + lum * 0.5})`;
          ctx.fillText(CHARS[ci], x * cellW, y * cellH);
        }
      }
      ctx.shadowBlur = 0;
    }

    if (reducedMotion) {
      renderFrame(0.8, 1.2, 280); // 静态单帧：挑一个流光恰好在前侧的角度
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let angle = 0;
    let shimmer = 0;
    let t = 0;
    let raf = 0;
    let lastFrame = 0;
    const frameInterval = isMobile ? 1000 / 30 : 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (frameInterval && now - lastFrame < frameInterval) return;
      lastFrame = now;
      // 视角向鼠标目标缓动（0.07 的插值系数：跟手且稳）
      view.tilt += (target.tilt - view.tilt) * 0.07;
      view.yaw += (target.yaw - view.yaw) * 0.07;
      angle += 0.014;
      shimmer += 0.045;  // 流光比自转快，肉眼可辨的环面行光
      t += 0.008;
      const hueBase = 285 + Math.sin(t) * 18; // 紫–粉呼吸
      renderFrame(angle, shimmer, hueBase);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={420}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
