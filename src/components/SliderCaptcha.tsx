'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { runCancellableTask } from '@/lib/cancellable-task';

const W = 300;
const H = 150;
const PW = 42;
const TOLERANCE = 5;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D, seed: number) {
  const rand = mulberry32(seed);
  const hue1 = Math.floor(rand() * 360);
  const hue2 = (hue1 + 40 + Math.floor(rand() * 80)) % 360;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, `hsl(${hue1}, 50%, 35%)`);
  grad.addColorStop(0.5, `hsl(${(hue1 + hue2) / 2}, 45%, 28%)`);
  grad.addColorStop(1, `hsl(${hue2}, 50%, 25%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 18; i++) {
    const h = Math.floor(rand() * 360);
    const l = 30 + Math.floor(rand() * 40);
    const a = 0.15 + rand() * 0.35;
    ctx.fillStyle = `hsla(${h}, 60%, ${l}%, ${a})`;
    ctx.beginPath();
    if (rand() > 0.5) {
      ctx.arc(rand() * W, rand() * H, 5 + rand() * 30, 0, Math.PI * 2);
    } else {
      const rw = 10 + rand() * 50;
      const rh = 10 + rand() * 40;
      ctx.rect(rand() * (W - rw), rand() * (H - rh), rw, rh);
    }
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(rand() * W, rand() * H);
    ctx.lineTo(rand() * W, rand() * H);
    ctx.stroke();
  }
}

interface Props {
  onVerify: (data: { token: string; x: number }) => void;
}

export default function SliderCaptcha({ onVerify }: Props) {
  const t = useTranslations('Captcha');
  const bgRef = useRef<HTMLCanvasElement>(null);
  const pieceRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState('');
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [sliderX, setSliderX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const startXRef = useRef(0);
  const startSliderRef = useRef(0);

  // 纯绘制函数：不调用 setState，可被 effect 和事件处理器复用
  const drawCaptcha = useCallback((data: { bgSeed: number; targetX: number; targetY: number }) => {
    requestAnimationFrame(() => {
      const bg = bgRef.current;
      const piece = pieceRef.current;
      if (!bg || !piece) return;

      const bgCtx = bg.getContext('2d');
      const pieceCtx = piece.getContext('2d');
      if (!bgCtx || !pieceCtx) return;

      drawBackground(bgCtx, data.bgSeed);

      const imgData = bgCtx.getImageData(data.targetX, data.targetY, PW, PW);

      pieceCtx.clearRect(0, 0, PW + 4, PW + 4);
      pieceCtx.putImageData(imgData, 2, 2);
      pieceCtx.strokeStyle = 'rgba(255,255,255,0.8)';
      pieceCtx.lineWidth = 1.5;
      roundRect(pieceCtx, 2, 2, PW, PW, 3);
      pieceCtx.stroke();

      bgCtx.save();
      roundRect(bgCtx, data.targetX, data.targetY, PW, PW, 3);
      bgCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      bgCtx.fill();
      bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      bgCtx.lineWidth = 1.5;
      bgCtx.stroke();
      bgCtx.restore();
    });
  }, []);

  // 事件处理器用：刷新按钮 / 验证失败后重新拉取
  const fetchChallenge = useCallback(async () => {
    setLoading(true);
    setVerified(false);
    setFailed(false);
    setSliderX(0);
    setError('');

    try {
      const res = await fetch('/api/captcha/challenge', { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setToken(data.token);
      setTargetX(data.targetX);
      setTargetY(data.targetY);
      drawCaptcha(data);
    } catch {
      setError(t('loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [drawCaptcha, t]);

  // 首次挂载拉一次挑战：内联 fetch + .then()，setState 都在异步回调里
  useEffect(() => {
    return runCancellableTask(
      fetch('/api/captcha/challenge', { method: 'POST' }).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      {
        onSuccess: (data) => {
          setToken(data.token);
          setTargetX(data.targetX);
          setTargetY(data.targetY);
          drawCaptcha(data);
        },
        onError: () => setError(t('loadFailed')),
        onSettled: () => setLoading(false),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClientX = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) return e.touches[0]?.clientX ?? 0;
    return (e as MouseEvent).clientX;
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (verified || loading) return;
    e.preventDefault();
    setDragging(true);
    setFailed(false);
    startXRef.current = getClientX(e);
    startSliderRef.current = sliderX;
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const diff = getClientX(e) - startXRef.current;
      const newX = Math.max(0, Math.min(W - PW, startSliderRef.current + diff));
      setSliderX(newX);
    };

    const handleEnd = () => {
      setDragging(false);
      setSliderX((current) => {
        if (Math.abs(current - targetX) <= TOLERANCE) {
          setVerified(true);
          onVerify({ token, x: current });
        } else {
          setFailed(true);
          setTimeout(() => {
            setSliderX(0);
            setFailed(false);
          }, 600);
        }
        return current;
      });
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: true });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, targetX, token, onVerify]);

  const trackMaxX = W - 40;

  return (
    <div className="w-full max-w-[300px]">
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-lg border transition-colors ${
          verified
            ? 'border-emerald-500/50'
            : failed
              ? 'border-red-500/50'
              : 'border-white/10'
        }`}
        style={{ width: W, height: H }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/[0.03]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          </div>
        )}
        <canvas ref={bgRef} width={W} height={H} className="block" />
        <canvas
          ref={pieceRef}
          width={PW + 4}
          height={PW + 4}
          className="pointer-events-none absolute transition-none"
          style={{
            left: sliderX,
            top: targetY - 2,
            filter: dragging ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        />
        {verified && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-2xl text-emerald-400">&#10003;</span>
          </div>
        )}
      </div>

      <div className="relative mt-2 h-10 select-none" style={{ width: W }}>
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/10" />
        {sliderX > 0 && (
          <div
            className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-violet-500/60"
            style={{ width: sliderX + 20 }}
          />
        )}

        {!verified && !loading && sliderX === 0 && !dragging && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-white/30">
            {t('hint')}
          </span>
        )}

        <div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={`absolute top-1/2 flex h-8 w-10 -translate-y-1/2 cursor-grab items-center justify-center rounded-md border transition-colors active:cursor-grabbing ${
            verified
              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
              : failed
                ? 'border-red-500/50 bg-red-500/20 text-red-400'
                : 'border-white/20 bg-white/[0.06] text-white/60 hover:border-violet-500/50 hover:bg-violet-500/10'
          }`}
          style={{ left: Math.min(sliderX, trackMaxX) }}
        >
          {verified ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

      {(failed || error) && !verified && (
        <button
          type="button"
          onClick={fetchChallenge}
          className="mt-1 text-xs text-violet-400 hover:text-violet-300"
        >
          {t('refresh')}
        </button>
      )}
    </div>
  );
}
