import { createFrameGuard } from '@/lib/motion';
import { createPhoneSprites, createPointSprites, PHONE_ATLAS_URL, releaseSprites, type PhoneSprites } from './atlas';
import { createLights, PHONE_STYLES, phoneAlpha, smooth, starAlpha, type SkyLight } from './lights';
import { createNebulaRenderer, type NebulaRenderer } from './nebula';

export interface HomeSkyState {
  peopleVisible: boolean;
  /** 父组件合并系统偏好与主动播放选择；false表示明确允许星光播放。 */
  paused: boolean;
}

export interface HomeSkyController {
  setState(state: HomeSkyState): void;
  dispose(): void;
}

const OVERSCAN = 36;
const TRANSITION_SECONDS = .65;
const mountedEngines = new WeakMap<HTMLElement, HomeSkyController>();

/** 只拥有传入容器内的画布；同一容器重新创建时先销毁旧实例。 */
export function createHomeSkyEngine(stage: HTMLElement, initial: Partial<HomeSkyState> = {}): HomeSkyController {
  mountedEngines.get(stage)?.dispose();

  const doc = stage.ownerDocument;
  const win = doc.defaultView ?? window;
  const ownedCanvases: HTMLCanvasElement[] = [];
  const makeLayer = (name: string, overscan = false) => {
    const canvas = doc.createElement('canvas');
    canvas.className = `home-sky__${name}`;
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', pointerEvents: 'none',
      left: overscan ? `-${OVERSCAN}px` : '0',
      top: overscan ? `-${OVERSCAN}px` : '0',
      width: overscan ? `calc(100% + ${OVERSCAN * 2}px)` : '100%',
      height: overscan ? `calc(100% + ${OVERSCAN * 2}px)` : '100%',
    });
    stage.appendChild(canvas);
    ownedCanvases.push(canvas);
    return canvas;
  };

  const fallbackCanvas = makeLayer('fallback');
  const nebulaCanvas = makeLayer('nebula');
  const phoneCanvases = [makeLayer('far-phones', true), makeLayer('mid-phones', true)];
  const canvas = makeLayer('stars');
  const ctx = canvas.getContext('2d');
  const phoneContexts = phoneCanvases.map(layer => layer.getContext('2d'));
  const reduceQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
  const allLights = createLights();
  const pointSprites = createPointSprites(doc);
  let activeLights: SkyLight[] = [];
  let lightLayers: SkyLight[][] = [[], [], []];
  let phoneSprites: PhoneSprites = [];
  let atlasImage: HTMLImageElement | null = null;
  let atlasRequested = false;
  let nebula: NebulaRenderer | null = null;
  let nebulaSize = '';
  let disposed = false;
  let viewportVisible = true;
  let reduced = reduceQuery.matches;
  let paused = initial.paused ?? false;
  let peopleVisible = false;
  let peopleBlend = 0;
  let transition: { from: number; to: number; elapsed: number } | null = null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let handSize = 96 * .32 * .72;
  let sceneTime = 0;
  let raf: number | null = null;
  let lastTick: number | null = null;
  let lastPaint: number | null = null;
  let frameInterval = 1000 / 30;
  const guardFrame = createFrameGuard(() => { frameInterval = 1000 / 20; });
  const cacheTimes = [-Infinity, -Infinity];
  const cacheDirty = [false, false];
  const cacheIntervals = [1 / 12, 1 / 20];

  function isVisible(): boolean {
    return !disposed && !doc.hidden && viewportVisible && width > 0 && height > 0;
  }

  function canAnimate(): boolean {
    return isVisible() && ctx !== null && (!paused || transition !== null);
  }

  function invalidatePhoneCaches(): void {
    cacheTimes[0] = cacheTimes[1] = -Infinity;
  }

  function clearPhoneCaches(): void {
    for (let index = 0; index < 2; index++) {
      const target = phoneContexts[index];
      if (target && cacheDirty[index]) {
        target.setTransform(1, 0, 0, 1, 0, 0);
        target.clearRect(0, 0, phoneCanvases[index].width, phoneCanvases[index].height);
      }
      cacheDirty[index] = false;
      phoneCanvases[index].style.opacity = '0';
    }
    invalidatePhoneCaches();
  }

  function clearHiddenPeople(): void {
    if (isVisible() || peopleBlend > 0) return;
    clearPhoneCaches();
    // 近景与星光共用画布；离屏关闭时先丢掉旧帧，重新可见后再画星光。
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function renderNebula(): void {
    if (!isVisible()) return;
    nebula ??= createNebulaRenderer(nebulaCanvas, fallbackCanvas);
    const size = `${width}:${height}:${dpr}`;
    if (size === nebulaSize) return;
    nebula.resize(width, height, dpr);
    nebula.render({ brightness: 1, dust: .7 });
    nebulaSize = size;
  }

  function requestAtlas(): void {
    if (disposed || atlasRequested) return;
    atlasRequested = true;
    const image = new win.Image();
    atlasImage = image;
    image.decoding = 'async';
    image.onload = () => {
      if (disposed || atlasImage !== image) return;
      phoneSprites = createPhoneSprites(image, doc);
      image.onload = image.onerror = null;
      atlasImage = null;
      invalidatePhoneCaches();
      paint();
    };
    image.onerror = () => {
      if (disposed || atlasImage !== image) return;
      image.onload = image.onerror = null;
      atlasImage = null;
      atlasRequested = false;
    };
    image.src = PHONE_ATLAS_URL;
  }

  function paintPhoneCache(index: number): void {
    if (peopleBlend <= 0) return;
    const target = phoneContexts[index];
    const elapsed = sceneTime - cacheTimes[index];
    const interval = cacheIntervals[index];
    if (!target || elapsed + 1e-7 < interval) return;
    cacheTimes[index] = Number.isFinite(cacheTimes[index])
      ? cacheTimes[index] + Math.max(1, Math.floor((elapsed + 1e-7) / interval)) * interval
      : sceneTime;
    target.setTransform(dpr, 0, 0, dpr, 0, 0);
    target.clearRect(0, 0, width + OVERSCAN * 2, height + OVERSCAN * 2);
    cacheDirty[index] = true;
    for (const light of lightLayers[index]) {
      const alpha = phoneAlpha(light, sceneTime);
      if (alpha <= .004) continue;
      const sprite = phoneSprites[light.styleIndex]?.[index];
      if (!sprite) continue;
      const meta = PHONE_STYLES[light.styleIndex];
      const size = handSize * light.scale;
      target.globalAlpha = alpha;
      target.drawImage(sprite, light.screenX + OVERSCAN - meta.ledX * size, light.screenY + OVERSCAN - meta.ledY * size, size, size);
    }
    target.globalAlpha = 1;
  }

  function paint(): void {
    if (!isVisible() || !ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    for (const light of activeLights) {
      const alpha = starAlpha(light, sceneTime);
      if (alpha < .018) continue;
      const sprite = pointSprites[light.colorIndex];
      if (!sprite) continue;
      const size = light.radius * 15;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, light.screenX - size / 2, light.screenY - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    for (const layer of phoneCanvases) layer.style.opacity = String(peopleBlend);
    if (peopleBlend <= 0) {
      clearPhoneCaches();
      return;
    }
    paintPhoneCache(0);
    paintPhoneCache(1);
    for (const light of lightLayers[2]) {
      const alpha = phoneAlpha(light, sceneTime) * peopleBlend;
      if (alpha <= .004) continue;
      const sprite = phoneSprites[light.styleIndex]?.[2];
      if (!sprite) continue;
      const meta = PHONE_STYLES[light.styleIndex];
      const size = handSize * light.scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, light.screenX - meta.ledX * size, light.screenY - meta.ledY * size, size, size);
    }
    ctx.globalAlpha = 1;
  }

  function animate(now: number): void {
    raf = null;
    if (!canAnimate()) { lastTick = lastPaint = null; return; }
    const delta = lastTick === null ? 0 : Math.min((now - lastTick) / 1000, .1);
    lastTick = now;
    if (!paused) sceneTime += delta;
    let transitionDone = false;
    if (transition) {
      transition.elapsed += delta;
      const progress = Math.min(1, transition.elapsed / TRANSITION_SECONDS);
      peopleBlend = transition.from + (transition.to - transition.from) * smooth(progress);
      if (progress >= 1) {
        peopleBlend = transition.to;
        transition = null;
        transitionDone = true;
      }
    }
    // 暂停时也必须绘制过渡终态，否则最后一帧可能被30fps节流跳过。
    if (lastPaint === null || now - lastPaint >= frameInterval - .25 || transitionDone) {
      paint();
      lastPaint = now;
      guardFrame(now);
    }
    if (canAnimate()) raf = win.requestAnimationFrame(animate);
    else lastTick = lastPaint = null;
  }

  function synchronizeLoop(): void {
    if (!canAnimate()) {
      if (raf !== null) win.cancelAnimationFrame(raf);
      raf = lastTick = lastPaint = null;
      return;
    }
    if (raf === null) raf = win.requestAnimationFrame(animate);
  }

  function resize(): void {
    if (disposed) return;
    const bounds = stage.getBoundingClientRect();
    const nextWidth = Math.max(0, bounds.width);
    const nextHeight = Math.max(0, bounds.height);
    const nextDpr = Math.min(win.devicePixelRatio || 1, 2);
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    if (width === 0 || height === 0) {
      if (!peopleVisible) { peopleBlend = 0; transition = null; clearHiddenPeople(); }
      synchronizeLoop();
      return;
    }
    activeLights = allLights.slice(0, width < 621 ? 8000 : 20000);
    lightLayers = [[], [], []];
    for (const light of activeLights) {
      light.screenX = light.x * width;
      light.screenY = light.y * height;
      lightLayers[light.layer].push(light);
    }
    handSize = (width < 621 ? 90 : 96) * .32 * .72;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    for (const layer of phoneCanvases) {
      layer.width = Math.round((width + OVERSCAN * 2) * dpr);
      layer.height = Math.round((height + OVERSCAN * 2) * dpr);
    }
    invalidatePhoneCaches();
    renderNebula();
    paint();
    synchronizeLoop();
  }

  function onVisibility(): void {
    if (disposed) return;
    if (!isVisible() && !peopleVisible && transition) {
      peopleBlend = 0;
      transition = null;
      clearHiddenPeople();
    }
    renderNebula();
    paint();
    synchronizeLoop();
  }

  function onReducedMotion(): void {
    if (disposed) return;
    reduced = reduceQuery.matches;
    if (reduced) {
      peopleBlend = Number(peopleVisible);
      transition = null;
      invalidatePhoneCaches();
      clearHiddenPeople();
      paint();
    }
    synchronizeLoop();
  }

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
  const visibilityObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    if (disposed || !entries[0]) return;
    viewportVisible = entries[0].isIntersecting;
    onVisibility();
  }, { threshold: 0 });

  const controller: HomeSkyController = {
    setState(next) {
      if (disposed) return;
      paused = next.paused;
      if (peopleVisible !== next.peopleVisible) {
        peopleVisible = next.peopleVisible;
        if (reduced || doc.hidden || !viewportVisible) {
          peopleBlend = Number(peopleVisible);
          transition = null;
        } else {
          transition = { from: peopleBlend, to: Number(peopleVisible), elapsed: 0 };
        }
        invalidatePhoneCaches();
      }
      if (peopleVisible) requestAtlas();
      clearHiddenPeople();
      paint();
      synchronizeLoop();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (raf !== null) win.cancelAnimationFrame(raf);
      raf = null;
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      doc.removeEventListener('visibilitychange', onVisibility);
      win.removeEventListener('resize', resize);
      reduceQuery.removeEventListener('change', onReducedMotion);
      if (atlasImage) {
        atlasImage.onload = atlasImage.onerror = null;
        atlasImage.removeAttribute('src');
        atlasImage = null;
      }
      nebula?.dispose();
      nebula = null;
      releaseSprites(pointSprites);
      for (const sprites of phoneSprites) releaseSprites(sprites);
      phoneSprites = [];
      allLights.length = activeLights.length = 0;
      lightLayers = [[], [], []];
      for (const layer of ownedCanvases) {
        layer.width = layer.height = 0;
        layer.remove();
      }
      if (mountedEngines.get(stage) === controller) mountedEngines.delete(stage);
    },
  };

  mountedEngines.set(stage, controller);
  doc.addEventListener('visibilitychange', onVisibility);
  win.addEventListener('resize', resize);
  reduceQuery.addEventListener('change', onReducedMotion);
  resizeObserver?.observe(stage);
  visibilityObserver?.observe(stage);
  resize();
  if (initial.peopleVisible) controller.setState({ peopleVisible: true, paused });
  synchronizeLoop();
  return controller;
}
