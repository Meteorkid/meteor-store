'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

const CHARS = '.,-~:;=!*#$@';

/**
 * ASCII 字符实时渲染的旋转莫比乌斯环——数学艺术 × donut.c 致敬。
 * 纯 Canvas 数学计算，零依赖；鼠标横移微调转速；移动端降分辨率、帧率上限 30fps；
 * prefers-reduced-motion 时渲染静态单帧。
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
    const STEP_U = isMobile ? 0.045 : 0.03;
    const STEP_V = 0.12;
    const TILT = 0.55;    // 固定 X 轴倾角
    const light = { x: 0.4, y: -0.7, z: -0.6 }; // 归一化光源方向（近似）

    let speedFactor = 1;
    const onMouseMove = (e: MouseEvent) => {
      // 鼠标横移 ±20% 转速
      speedFactor = 0.8 + (e.clientX / window.innerWidth) * 0.4;
    };
    if (!reducedMotion) window.addEventListener('mousemove', onMouseMove, { passive: true });

    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    function renderFrame(angle: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const zbuf = new Float32Array(cols * rows);
      const chbuf = new Array<number>(cols * rows).fill(-1);
      const cosA = Math.cos(angle), sinA = Math.sin(angle);

      for (let u = 0; u < Math.PI * 2; u += STEP_U) {
        const cu = Math.cos(u), su = Math.sin(u);
        const ch = Math.cos(u / 2), sh = Math.sin(u / 2);
        for (let v = -1; v <= 1; v += STEP_V) {
          const w = v * W;
          // 参数方程
          const px = (R + w * ch) * cu;
          const py = (R + w * ch) * su;
          const pz = w * sh;
          // 数值法向量（对 u、v 的偏导叉积，用解析近似）
          const du = { x: -(R + w * ch) * su - w * sh * 0.5 * cu, y: (R + w * ch) * cu - w * sh * 0.5 * su, z: w * ch * 0.5 };
          const dv = { x: W * ch * cu, y: W * ch * su, z: W * sh };
          let nx = du.y * dv.z - du.z * dv.y;
          let ny = du.z * dv.x - du.x * dv.z;
          let nz = du.x * dv.y - du.y * dv.x;
          const nlen = Math.hypot(nx, ny, nz) || 1;
          nx /= nlen; ny /= nlen; nz /= nlen;

          // 旋转：绕 Y（动画角）再绕 X（固定倾角）
          const rx = px * cosA + pz * sinA;
          const rz0 = -px * sinA + pz * cosA;
          const ry = py * cosT - rz0 * sinT;
          const rz = py * sinT + rz0 * cosT;

          const nx1 = nx * cosA + nz * sinA;
          const nz0 = -nx * sinA + nz * cosA;
          const ny1 = ny * cosT - nz0 * sinT;
          const nz1 = ny * sinT + nz0 * cosT;

          // 透视投影
          const K = 3.2;
          const invZ = 1 / (rz + K);
          const sx = Math.floor(cols / 2 + rx * invZ * cols * 0.85);
          const sy = Math.floor(rows / 2 + ry * invZ * rows * 0.85);
          if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue;

          const idx = sy * cols + sx;
          if (invZ <= zbuf[idx]) continue;
          zbuf[idx] = invZ;

          // 亮度 = 法向量 · 光源（莫比乌斯是单面曲面，取绝对值让"背面"也发光）
          const lum = Math.abs(nx1 * light.x + ny1 * light.y + nz1 * light.z);
          chbuf[idx] = Math.min(CHARS.length - 1, Math.floor(lum * CHARS.length));
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const ci = chbuf[y * cols + x];
          if (ci < 0) continue;
          const lum = ci / (CHARS.length - 1);
          // 紫→粉渐变着色，亮处更白
          ctx.fillStyle = `hsla(${280 - lum * 40}, ${70 + lum * 20}%, ${38 + lum * 42}%, ${0.55 + lum * 0.45})`;
          ctx.fillText(CHARS[ci], x * cellW, y * cellH);
        }
      }
    }

    if (reducedMotion) {
      renderFrame(0.8); // 静态单帧：挑一个好看的角度
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let angle = 0;
    let raf = 0;
    let lastFrame = 0;
    const frameInterval = isMobile ? 1000 / 30 : 0; // 移动端 30fps 上限

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (frameInterval && now - lastFrame < frameInterval) return;
      lastFrame = now;
      angle += 0.012 * speedFactor;
      renderFrame(angle);
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
