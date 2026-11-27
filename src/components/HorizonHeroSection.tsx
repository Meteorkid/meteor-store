'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/motion';
import HeroCanvas from './HeroCanvas';
import styles from './HorizonHeroSection.module.css';

// Three.js 只在用户实际选用「黑洞视界」主题时才需要。
// 之前这里静态 import BlackHoleViewport，导致默认星云首页也会下载整个
// three + @react-three/fiber 运行时（约 900KB）；改为动态导入后，
// 默认主题的首页不再加载这块代码。
const BlackHoleViewport = dynamic(
  () => import('./BlackHole').then(module => module.BlackHoleViewport),
  {
    loading: () => <BlackHoleFallback />,
  },
);

/** Three.js 加载完成前先用静态渐变占住同一块正方形，避免布局跳动。 */
function BlackHoleFallback() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: [
          'radial-gradient(circle closest-side, #000 64%, #ffd27a 65%, #ff8a2a 66%, #ff8a2a50 70%, transparent 86%) center/100% 95% no-repeat',
          'radial-gradient(ellipse 46% 11% at 50% 53%, #ffd27a 8%, #ff8a2a 37%, #9a351564 77%, transparent 100%)',
          '#050508',
        ].join(', '),
      }}
      aria-hidden="true"
    />
  );
}

interface HorizonHeroSectionProps {
  productCount: number;
  webAppCount: number;
  freeCount: number;
  helpCount: number;
}

const CAMERA_PRESETS = [
  { id: 'overlook', inclination: 0.15, zh: '透镜俯视', en: 'Lensed Overlook' },
  { id: 'edge-on', inclination: 0.025, zh: '盘面侧视', en: 'Edge-On Disk' },
  { id: 'polar', inclination: 1.54, zh: '极向视角', en: 'Polar View' },
] as const;

const DEFAULT_CAMERA = { azimuth: 0, inclination: CAMERA_PRESETS[0].inclination };

export default function HorizonHeroSection({ productCount, webAppCount, freeCount, helpCount }: HorizonHeroSectionProps) {
  const english = useLocale() === 'en';
  const reducedMotion = useReducedMotion();
  const [camera, setCamera] = useState<{ azimuth: number; inclination: number }>(DEFAULT_CAMERA);
  const [preset, setPreset] = useState<(typeof CAMERA_PRESETS)[number]['id'] | null>('overlook');
  const [doppler, setDoppler] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [glow, setGlow] = useState(1.22);
  const [spin, setSpin] = useState(1);
  const [blackHoleReady, setBlackHoleReady] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    // 让静态首帧先渲染；下一帧再挂 Three.js，避免默认星云主题被
    // 这段动态导入拖进首屏执行链。
    const frame = window.requestAnimationFrame(() => setBlackHoleReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function moveCamera(horizontal: number, vertical: number) {
    setPreset(null);
    setCamera(({ azimuth, inclination }) => ({
      azimuth: (azimuth + horizontal) % (2 * Math.PI),
      inclination: Math.max(-1.54, Math.min(1.54, inclination + vertical)),
    }));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragCamera(event: PointerEvent<HTMLDivElement>) {
    const previous = drag.current;
    if (!previous || previous.id !== event.pointerId) return;
    const horizontal = (previous.x - event.clientX) * 0.009;
    const vertical = (event.clientY - previous.y) * 0.006;
    if (horizontal || vertical) moveCamera(horizontal, vertical);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [0.09, 0], ArrowRight: [-0.09, 0], ArrowUp: [0, 0.06], ArrowDown: [0, -0.06],
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    moveCamera(...step);
  }

  const stats = [
    { value: productCount, label: english ? 'Products' : '目录产品' },
    { value: webAppCount, label: english ? 'Web apps' : '在线应用' },
    { value: freeCount, label: english ? 'Free experiments' : '免费实验作品' },
    { value: helpCount, label: english ? 'Help articles' : '帮助文档' },
  ];

  return (
    <section className={styles.hero} data-horizon-hero aria-labelledby="home-horizon-title">
      <div className={styles.observatory}>
        <div
          className={styles.scene}
          role="group"
          tabIndex={0}
          aria-label={english ? 'Black hole observation' : '黑洞观测画面'}
          aria-describedby="horizon-orbit-hint"
          onPointerDown={startDrag}
          onPointerMove={dragCamera}
          onLostPointerCapture={endDrag}
          onKeyDown={moveWithKeyboard}
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-black-hole-viewport>
            {blackHoleReady && !reducedMotion ? (
              <BlackHoleViewport {...camera} doppler={doppler} glow={glow} spin={spin} autoOrbit={autoOrbit} />
            ) : (
              <BlackHoleFallback />
            )}
          </div>
        </div>
        <HeroCanvas className={styles.particles} />

        <div className={styles.dock} data-horizon-dock data-transparency-surface="panel">
          <div className={styles.information}>
            <div className={styles.copy}>
              <h1 id="home-horizon-title" className={`t-display ${styles.title}`}>
                {english ? 'Beyond the horizon' : '越过视界'}
              </h1>
              <p id="horizon-orbit-hint" className={styles.description}>
                {english ? 'Drag or use arrow keys to orbit.' : '拖动或用方向键环绕。'}
              </p>
            </div>

            <div className={styles.actions}>
              <Link className={styles.primary} href="/products">{english ? 'Explore products' : '探索产品'}</Link>
              <Link href="/study">{english ? 'Study' : '学习工作台'}</Link>
              <Link href="/docs">{english ? 'Guides' : '查看指南'}</Link>
            </div>

            <div className={styles.readings}>
              <strong>Aurelia-X1</strong>
              <span title={english ? '6.5 billion solar masses' : undefined}>{english ? '6.5B M☉' : '65 亿倍太阳质量'}</span>
              <span title={english ? '55 million light-years' : undefined}>{english ? '55M light-years' : '距离 5,500 万光年'}</span>
              <small title={english ? 'Simplified educational model' : undefined}>{english ? 'Simplified model' : '简化教学模型'}</small>
            </div>
          </div>

          <dl className={styles.stats} aria-label={english ? 'Catalogue facts' : '目录统计'}>
            {stats.map(({ value, label }) => (
              <div key={label} className={styles.stat}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.controls} role="group" aria-label={english ? 'Observation controls' : '观测控制'}>
            <div className={styles.presets} role="group" aria-label={english ? 'Camera view' : '观测角度'}>
              {CAMERA_PRESETS.map(view => (
                <button key={view.id} type="button" aria-pressed={preset === view.id} onClick={() => {
                  setCamera({ azimuth: 0, inclination: view.inclination });
                  setPreset(view.id);
                }}>
                  {english ? view.en : view.zh}
                </button>
              ))}
            </div>
            <details className={styles.advanced} onKeyDown={event => {
              if (event.key !== 'Escape' || !event.currentTarget.open) return;
              event.preventDefault();
              event.currentTarget.open = false;
              event.currentTarget.querySelector('summary')?.focus();
            }}>
              <summary className={styles.controlTrigger}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 17h16M8 4v6m8 4v6" />
                </svg>
                {english ? 'More settings' : '更多设置'}
              </summary>
              <div className={styles.controlPanel} data-transparency-surface="panel">
                <div className={styles.switches}>
                  <button type="button" className={styles.doppler} aria-label={english ? 'Doppler' : '多普勒'}
                    aria-pressed={doppler} onClick={() => setDoppler(!doppler)}>
                    {english ? (doppler ? 'Doppler On' : 'Doppler Off') : (doppler ? '多普勒开启' : '多普勒关闭')}
                  </button>
                  <button type="button" aria-pressed={autoOrbit && !reducedMotion} aria-disabled={reducedMotion}
                    title={reducedMotion ? (english ? 'Paused by reduced motion preference' : '已随减少动态效果设置暂停') : undefined}
                    onClick={() => { if (!reducedMotion) setAutoOrbit(!autoOrbit); }}>
                    {english ? 'Auto-Orbit' : '自动环绕'}
                  </button>
                </div>
                <div className={styles.sliders}>
                  <label className={styles.range}>
                    <span>{english ? 'Glow' : '光晕'}</span>
                    <input type="range" min={0.7} max={1.7} step={0.05} value={glow} onChange={event => setGlow(event.target.valueAsNumber)} />
                    <span className={styles.rangeValue} aria-hidden="true">{glow.toFixed(2)}</span>
                  </label>
                  <label className={styles.range}>
                    <span>{english ? 'Spin' : '自转'}</span>
                    <input type="range" min={0.2} max={2} step={0.1} value={spin} onChange={event => setSpin(event.target.valueAsNumber)} />
                    <span className={styles.rangeValue} aria-hidden="true">{spin.toFixed(1)}×</span>
                  </label>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
