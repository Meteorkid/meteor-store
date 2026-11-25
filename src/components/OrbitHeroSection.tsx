'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useLocale } from 'next-intl';
import { orbitProductGroups, type OrbitPlanetId } from '@/data/orbit-products';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/motion';
import { DEFAULT_ORBIT_SPEED, orbitSpeedForSlider, orbitSpeedSliderPosition } from './orbit/orbit-motion';
import HeroCanvas from './HeroCanvas';
import styles from './OrbitHeroSection.module.css';

const OrbitScene = dynamic(() => import('./orbit/OrbitScene'));

export interface OrbitProduct {
  id: string;
  name: string;
  tagline: string;
}

export default function OrbitHeroSection({ products }: { products: readonly OrbitProduct[] }) {
  const english = useLocale() === 'en';
  const reducedMotion = useReducedMotion();
  const [selection, setSelection] = useState<{ planetId: OrbitPlanetId; productId: string | null } | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const [zoomRequest, setZoomRequest] = useState<{ factor: number } | null>(null);
  const [sceneAvailable, setSceneAvailable] = useState<boolean | null>(null);
  const [playOverride, setPlayOverride] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_ORBIT_SPEED);
  const playing = speed > 0 && (playOverride ?? !reducedMotion);
  const playLabel = playing ? (english ? 'Pause time' : '暂停时间') : (english ? 'Play time' : '播放时间');
  const speedValue = speed.toFixed(speed >= 100 ? 0 : 1);
  const speedLabel = english ? `${speedValue} days/s` : `${speedValue} 天/秒`;
  const planets = useMemo(() => {
    const productsById = new Map(products.map(product => [product.id, product]));
    return orbitProductGroups.map(group => ({
      id: group.id,
      name: group.name[english ? 'en' : 'zh'],
      originalName: group.name.en,
      products: group.productIds.flatMap(id => {
        const product = productsById.get(id);
        return product ? [product] : [];
      }),
    }));
  }, [english, products]);
  const selectedPlanet = planets.find(planet => planet.id === selection?.planetId);
  const selected = selectedPlanet?.products.find(product => product.id === selection?.productId);
  const planetsRef = useRef<HTMLDivElement>(null);
  const catalogueRef = useRef<HTMLDetailsElement>(null);

  function selectPlanet(id: string) {
    const planet = planets.find(item => item.id === id);
    if (!planet) return;
    setSelection(previous => previous?.planetId === id ? previous : {
      planetId: planet.id,
      productId: planet.products[0]?.id ?? null,
    });
  }

  function closeCatalogue() {
    const catalogue = catalogueRef.current;
    if (catalogue?.open) {
      catalogue.querySelector('summary')?.focus();
      catalogue.open = false;
    }
  }

  function resetView() {
    planetsRef.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.focus();
    setSelection(null);
    setResetCount(count => count + 1);
  }

  function togglePlay() {
    if (!playing && speed === 0) setSpeed(DEFAULT_ORBIT_SPEED);
    setPlayOverride(!playing);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && !event.defaultPrevented && (catalogueRef.current?.open || selectedPlanet)) {
      event.preventDefault();
      if (catalogueRef.current?.open) closeCatalogue();
      else resetView();
    }
    if (event.key === ' ' && !event.defaultPrevented && !event.altKey && !event.ctrlKey && !event.metaKey && sceneAvailable &&
      event.target instanceof HTMLElement && !event.target.closest('button, a, input, summary')) {
      event.preventDefault();
      if (!event.repeat) togglePlay();
    }
  }

  return (
    <section className={styles.hero} data-orbit-hero data-orbit-focused={Boolean(selectedPlanet)} aria-labelledby="home-orbit-title" onKeyDown={handleKeyDown}>
      <div className={styles.copy}>
        <h1 id="home-orbit-title" className={`t-display ${styles.title}`}>
          {english ? 'Planetary Orbits' : '行星轨道'}
        </h1>
        <p className={`t-body ${styles.description}`}>
          {english ? 'Explore the eight planets and the products along their orbits.' : '点选八颗行星，探索轨道上的商城产品。'}
        </p>
      </div>

      <div className={styles.scene}>
        <OrbitScene
          planets={planets}
          selectedId={selectedPlanet?.id ?? null}
          onSelect={selectPlanet}
          sunLabel={english ? 'Sun' : '太阳'}
          viewLabel={english ? 'Solar system. Drag or use the arrow keys to rotate, and use plus or minus to zoom.' : '太阳系视图。拖动或使用方向键旋转，按加号或减号缩放。'}
          resetCount={resetCount}
          playing={playing}
          speed={speed}
          zoomRequest={zoomRequest}
          onAvailabilityChange={setSceneAvailable}
        />
      </div>

      <HeroCanvas className={styles.particles} />

      <div className={styles.dock} data-orbit-dock data-transparency-surface="panel">
        <div ref={planetsRef} className={styles.planets} role="group" aria-label={english ? 'Solar system planets' : '太阳系行星'}>
          {planets.map(planet => (
            <button key={planet.id} type="button" className={styles.planetButton}
              aria-pressed={selectedPlanet?.id === planet.id} onClick={() => selectPlanet(planet.id)}>
              <span className={styles.indicator} aria-hidden="true" />
              {planet.name}
            </button>
          ))}
        </div>

        <div className={styles.clock} role="group" aria-label={english ? 'Simulation time' : '模拟时间'}>
          <button className={styles.clockButton} type="button" aria-label={playLabel} title={playLabel}
            aria-keyshortcuts="Space" disabled={!sceneAvailable} onClick={togglePlay}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <label className={styles.clockSpeed}>
            <span>{sceneAvailable === false ? (english ? 'Static view' : '静态视图') : playing ? speedLabel : (english ? 'Paused' : '已暂停')}</span>
            <input type="range" min={0} max={100} step="any" aria-label={english ? 'Simulation speed' : '模拟速度'}
              aria-valuetext={speed > 0 ? speedLabel : (english ? 'Stopped' : '停止')} disabled={!sceneAvailable}
              value={orbitSpeedSliderPosition(speed)} onChange={event => {
                const next = orbitSpeedForSlider(event.currentTarget.valueAsNumber);
                setSpeed(next);
                setPlayOverride(next > 0);
              }} />
          </label>
        </div>

        <div className={styles.details}>
          <div className={styles.readout} aria-live="polite" aria-atomic="true">
            <h2>
              {selectedPlanet?.name ?? (english ? 'Solar System' : '太阳系全景')}
              {selectedPlanet && !english && <>{' '}<span className={styles.originalName} lang="en">{selectedPlanet.originalName}</span></>}
            </h2>
            {selected
              ? <p><strong>{selected.name}</strong> <span>{selected.tagline}</span></p>
              : <p>{english ? `${planets.length} planets · ${products.length} products` : `${planets.length} 颗行星 · ${products.length} 款产品`}</p>}
          </div>
          <div className={styles.actions}>
            <div className={styles.zoomControls} role="group" aria-label={english ? 'Camera zoom' : '镜头缩放'}>
              <button type="button" className={`${styles.reset} ${styles.zoomButton}`} aria-label={english ? 'Zoom out' : '缩小视图'}
                disabled={!sceneAvailable} onClick={() => setZoomRequest({ factor: 1.25 })}>−</button>
              <button type="button" className={`${styles.reset} ${styles.zoomButton}`} aria-label={english ? 'Zoom in' : '放大视图'}
                disabled={!sceneAvailable} onClick={() => setZoomRequest({ factor: .8 })}>+</button>
            </div>
            <button type="button" className={styles.reset} onClick={resetView}>
              {english ? 'Overview' : '返回全景'}
            </button>
            <details ref={catalogueRef} className={styles.catalogue}>
              <summary className={styles.reset}>{english ? 'All products' : '全部产品'}</summary>
              <ul className={styles.productMenu} data-transparency-surface="panel">
                {planets.flatMap(planet => planet.products.map(product => (
                  <li key={product.id}>
                    <button type="button" aria-pressed={selected?.id === product.id} onClick={() => {
                      setSelection({ planetId: planet.id, productId: product.id });
                      closeCatalogue();
                    }}>
                      <span>{product.name}</span><small>{planet.name}</small>
                    </button>
                  </li>
                )))}
              </ul>
            </details>
            <Link className={styles.primary} href={selected ? `/products/${selected.id}` : '/products'}>
              {selected ? (english ? 'View product' : '查看产品') : (english ? 'Browse products' : '浏览产品')}
            </Link>
          </div>
          {selectedPlanet && selectedPlanet.products.length > 1 && (
            <div className={styles.related} role="group" aria-label={english ? 'Products on this planet' : '这颗行星的产品'}>
              {selectedPlanet.products.map(product => (
                <button key={product.id} type="button" aria-pressed={selected?.id === product.id}
                  onClick={() => setSelection({ planetId: selectedPlanet.id, productId: product.id })}>
                  {product.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
