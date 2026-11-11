import { createPhoneSprites, createPointSprites, PHONE_ATLAS_URL, releaseSprites, type PhoneSprites } from './atlas';
import { createLights, PHONE_STYLES, phoneAlpha, smooth, starAlpha, type SkyLight } from './lights';
import { createNebulaRenderer, type NebulaRenderer } from './nebula';
import { createSkyCamera, createSkyProjector, type SkyCameraPose, type SkyInteractionMode } from './camera';

export interface HomeSkyState {
  peopleVisible: boolean;
  /** 父组件合并系统偏好与主动播放选择；false表示明确允许星光播放。 */
  paused: boolean;
  interactionMode?: SkyInteractionMode;
  autoRotate?: boolean;
  resetView?: number;
}

export interface HomeSkyController {
  setState(state: HomeSkyState): void;
  dispose(): void;
}

const OVERSCAN = 36;
const TRANSITION_SECONDS = .65;
const NEBULA_FRAME_INTERVAL = 1000 / 30;
const PAINT_INTERVAL = 1000 / 60;
const DRAG_EXCLUSIONS = 'a,button,input,textarea,select,nav,summary,label,h1,h2,h3,h4,h5,h6,p,svg,[role="button"],[role="link"],[role="slider"],[contenteditable],[data-celestial-text],[data-sky-controls]';
const mountedEngines = new WeakMap<HTMLElement, HomeSkyController>();

/** 只拥有传入容器内的画布；同一容器重新创建时先销毁旧实例。 */
export function createHomeSkyEngine(stage: HTMLElement, initial: Partial<HomeSkyState> = {}, interactionSurface: HTMLElement | null = null): HomeSkyController {
  mountedEngines.get(stage)?.dispose();

  const doc = stage.ownerDocument;
  const win = doc.defaultView ?? window;
  const pointerSurface = interactionSurface ?? doc;
  const captureSurface = interactionSurface ?? stage;
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
  const finePointerQuery = win.matchMedia('(hover: hover) and (pointer: fine)');
  const allLights = createLights();
  const pointSprites = createPointSprites(doc);
  let activeLights: SkyLight[] = [];
  let lightLayers: SkyLight[][] = [[], [], []];
  let phoneSprites: PhoneSprites = [];
  let atlasImage: HTMLImageElement | null = null;
  let atlasRequested = false;
  let nebula: NebulaRenderer | null = null;
  let nebulaSize = '';
  let nebulaPose: SkyCameraPose = { yaw: NaN, pitch: NaN };
  let lastNebulaPaint = -Infinity;
  let frameNow = 0;
  let disposed = false;
  let viewportVisible = true;
  let reduced = reduceQuery.matches;
  let paused = initial.paused ?? false;
  let interactionMode = initial.interactionMode ?? 'follow';
  let autoRotate = initial.autoRotate ?? false;
  let resetView = initial.resetView ?? 0;
  const camera = createSkyCamera({ interactionMode, autoRotate });
  let drag: { pointerId: number; x: number; y: number; time: number } | null = null;
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
  const cacheTimes = [-Infinity, -Infinity];
  const cachePoses: SkyCameraPose[] = [{ yaw: NaN, pitch: NaN }, { yaw: NaN, pitch: NaN }];
  const cacheDirty = [false, false];
  const cacheIntervals = [1000 / 15, 1000 / 24];

  function isVisible(): boolean {
    return !disposed && !doc.hidden && viewportVisible && width > 0 && height > 0;
  }

  function canAnimate(): boolean {
    return isVisible() && ctx !== null && (!paused || transition !== null || camera.isMoving(!paused) || nebulaNeedsPaint());
  }

  function nebulaNeedsPaint(): boolean {
    if (!nebula) return false;
    const pose = camera.getPose();
    return pose.yaw !== nebulaPose.yaw || pose.pitch !== nebulaPose.pitch;
  }

  function invalidatePhoneCaches(): void {
    cacheTimes[0] = cacheTimes[1] = -Infinity;
    cachePoses[0] = cachePoses[1] = { yaw: NaN, pitch: NaN };
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
    const resized = size !== nebulaSize;
    if (resized) nebula.resize(width, height, dpr);
    if (!resized && (!nebulaNeedsPaint() || frameNow - lastNebulaPaint < NEBULA_FRAME_INTERVAL)) return;
    const pose = camera.getPose();
    nebula.render({ brightness: 1.7, dust: .7, yaw: pose.yaw, pitch: pose.pitch });
    nebulaSize = size;
    nebulaPose = pose;
    lastNebulaPaint = frameNow;
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

  function paintPhoneCache(index: number, project: ReturnType<typeof createSkyProjector>, pose: SkyCameraPose): void {
    if (peopleBlend <= 0) return;
    const target = phoneContexts[index];
    const elapsed = frameNow - cacheTimes[index];
    const interval = cacheIntervals[index];
    const poseChanged = pose.yaw !== cachePoses[index].yaw || pose.pitch !== cachePoses[index].pitch;
    const settled = !camera.isMoving(false);
    if (!target || (elapsed + 1e-7 < interval && !(settled && poseChanged))) return;
    cacheTimes[index] = Number.isFinite(cacheTimes[index])
      ? cacheTimes[index] + Math.max(1, Math.floor((elapsed + 1e-7) / interval)) * interval
      : frameNow;
    target.setTransform(dpr, 0, 0, dpr, 0, 0);
    target.clearRect(0, 0, width + OVERSCAN * 2, height + OVERSCAN * 2);
    cacheDirty[index] = true;
    cachePoses[index] = pose;
    for (const light of lightLayers[index]) {
      const alpha = phoneAlpha(light, sceneTime);
      if (alpha <= .004) continue;
      const sprite = phoneSprites[light.styleIndex]?.[index];
      if (!sprite) continue;
      const meta = PHONE_STYLES[light.styleIndex];
      const position = project(light.worldX, light.worldY, light.worldZ, light.depth);
      if (!position.visible) continue;
      const size = handSize * light.scale * position.scale;
      target.globalAlpha = alpha;
      target.drawImage(sprite, position.x + OVERSCAN - meta.ledX * size, position.y + OVERSCAN - meta.ledY * size, size, size);
    }
    target.globalAlpha = 1;
  }

  function paint(): void {
    if (!isVisible() || !ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const pose = camera.getPose();
    const project = createSkyProjector(width, height, pose);
    for (const light of activeLights) {
      const alpha = starAlpha(light, sceneTime);
      if (alpha < .018) continue;
      const sprite = pointSprites[light.colorIndex];
      if (!sprite) continue;
      const position = project(light.worldX, light.worldY, light.worldZ, light.depth);
      if (!position.visible) continue;
      const size = light.radius * 15 * position.scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, position.x - size / 2, position.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    for (const layer of phoneCanvases) layer.style.opacity = String(peopleBlend);
    if (peopleBlend <= 0) {
      clearPhoneCaches();
      return;
    }
    paintPhoneCache(0, project, pose);
    paintPhoneCache(1, project, pose);
    for (const light of lightLayers[2]) {
      const alpha = phoneAlpha(light, sceneTime) * peopleBlend;
      if (alpha <= .004) continue;
      const sprite = phoneSprites[light.styleIndex]?.[2];
      if (!sprite) continue;
      const meta = PHONE_STYLES[light.styleIndex];
      const position = project(light.worldX, light.worldY, light.worldZ, light.depth);
      if (!position.visible) continue;
      const size = handSize * light.scale * position.scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, position.x - meta.ledX * size, position.y - meta.ledY * size, size, size);
    }
    ctx.globalAlpha = 1;
  }

  function animate(now: number): void {
    raf = null;
    frameNow = now;
    if (!canAnimate()) { lastTick = lastPaint = null; return; }
    const delta = lastTick === null ? 0 : Math.min((now - lastTick) / 1000, .1);
    lastTick = now;
    if (!paused) sceneTime += delta;
    camera.tick(delta, !paused);
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
    // 相机每个显示帧更新，画面最多 60fps；避免 120Hz 屏幕无收益地重复两倍绘制。
    if (lastPaint === null || now - lastPaint >= PAINT_INTERVAL - .25 || transitionDone) {
      paint();
      renderNebula();
      lastPaint = now;
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
      releaseDrag(false);
      camera.cancelInput();
      if (!peopleVisible) { peopleBlend = 0; transition = null; clearHiddenPeople(); }
      synchronizeLoop();
      return;
    }
    activeLights = allLights.slice(0, width < 621 ? 20000 : 40000);
    lightLayers = [[], [], []];
    for (const light of activeLights) lightLayers[light.layer].push(light);
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
    if (!isVisible()) {
      releaseDrag(false);
      camera.cancelInput();
    }
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

  function releaseDrag(inertia: boolean): void {
    const previous = drag;
    drag = null;
    camera.endDrag(inertia);
    if (previous && captureSurface.hasPointerCapture?.(previous.pointerId)) {
      captureSurface.releasePointerCapture(previous.pointerId);
    }
  }

  function pointerBounds() { return (interactionSurface ?? stage).getBoundingClientRect(); }

  function pointerAllowed(event: PointerEvent): boolean {
    return !disposed && isVisible() && finePointerQuery.matches && event.pointerType === 'mouse';
  }

  function onPointerMove(event: Event): void {
    const pointer = event as PointerEvent;
    if (!pointerAllowed(pointer)) return;
    const bounds = pointerBounds();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    if (drag && drag.pointerId === pointer.pointerId) {
      camera.dragBy((pointer.clientX - drag.x) / bounds.width, (pointer.clientY - drag.y) / bounds.height, (pointer.timeStamp - drag.time) / 1000);
      drag = { pointerId: pointer.pointerId, x: pointer.clientX, y: pointer.clientY, time: pointer.timeStamp };
    } else if (interactionMode === 'follow') {
      const x = (pointer.clientX - bounds.left) / bounds.width;
      const y = (pointer.clientY - bounds.top) / bounds.height;
      if (x < 0 || y < 0 || x > 1 || y > 1) camera.leave();
      else camera.follow(x * 2 - 1, y * 2 - 1);
    }
    synchronizeLoop();
  }

  function onPointerDown(event: Event): void {
    const pointer = event as PointerEvent;
    if (!pointerAllowed(pointer) || interactionMode !== 'drag' || pointer.button !== 0 || pointer.isPrimary === false) return;
    const target = pointer.target as Element | null;
    if (typeof target?.closest === 'function' && target.closest(DRAG_EXCLUSIONS)) return;
    const bounds = pointerBounds();
    if (pointer.clientX < bounds.left || pointer.clientX > bounds.left + bounds.width || pointer.clientY < bounds.top || pointer.clientY > bounds.top + bounds.height) return;
    camera.beginDrag();
    drag = { pointerId: pointer.pointerId, x: pointer.clientX, y: pointer.clientY, time: pointer.timeStamp };
    captureSurface.setPointerCapture?.(pointer.pointerId);
    pointer.preventDefault();
    synchronizeLoop();
  }

  function onPointerUp(event: Event): void {
    const pointer = event as PointerEvent;
    if (!drag || pointer.pointerId !== drag.pointerId) return;
    releaseDrag(pointer.timeStamp - drag.time < 120);
    synchronizeLoop();
  }

  function onPointerCancel(event: Event): void {
    const pointer = event as PointerEvent;
    if (!drag || pointer.pointerId !== drag.pointerId) return;
    releaseDrag(false);
    synchronizeLoop();
  }

  function onPointerLeave(): void {
    if (disposed || drag) return;
    camera.leave();
    synchronizeLoop();
  }

  function onPointerUnavailable(): void {
    if (disposed) return;
    releaseDrag(false);
    camera.cancelInput();
    synchronizeLoop();
  }

  function onFinePointerChange(): void {
    if (!finePointerQuery.matches) onPointerUnavailable();
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
      const nextMode = next.interactionMode ?? interactionMode;
      if (nextMode !== interactionMode) releaseDrag(false);
      interactionMode = nextMode;
      autoRotate = next.autoRotate ?? autoRotate;
      camera.setOptions({ interactionMode, autoRotate });
      if (next.resetView !== undefined && Number.isFinite(next.resetView) && next.resetView !== resetView) {
        resetView = next.resetView;
        releaseDrag(false);
        camera.reset();
      }
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
      releaseDrag(false);
      if (raf !== null) win.cancelAnimationFrame(raf);
      raf = null;
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      doc.removeEventListener('visibilitychange', onVisibility);
      win.removeEventListener('resize', resize);
      win.removeEventListener('blur', onPointerUnavailable);
      reduceQuery.removeEventListener('change', onReducedMotion);
      finePointerQuery.removeEventListener('change', onFinePointerChange);
      pointerSurface.removeEventListener('pointermove', onPointerMove);
      pointerSurface.removeEventListener('pointerdown', onPointerDown);
      pointerSurface.removeEventListener('pointerup', onPointerUp);
      pointerSurface.removeEventListener('pointercancel', onPointerCancel);
      pointerSurface.removeEventListener('lostpointercapture', onPointerCancel);
      pointerSurface.removeEventListener('pointerleave', onPointerLeave);
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
  win.addEventListener('blur', onPointerUnavailable);
  reduceQuery.addEventListener('change', onReducedMotion);
  finePointerQuery.addEventListener('change', onFinePointerChange);
  pointerSurface.addEventListener('pointermove', onPointerMove, { passive: true });
  pointerSurface.addEventListener('pointerdown', onPointerDown);
  pointerSurface.addEventListener('pointerup', onPointerUp);
  pointerSurface.addEventListener('pointercancel', onPointerCancel);
  pointerSurface.addEventListener('lostpointercapture', onPointerCancel);
  pointerSurface.addEventListener('pointerleave', onPointerLeave);
  resizeObserver?.observe(stage);
  visibilityObserver?.observe(stage);
  resize();
  if (initial.peopleVisible) controller.setState({ peopleVisible: true, paused });
  synchronizeLoop();
  return controller;
}
