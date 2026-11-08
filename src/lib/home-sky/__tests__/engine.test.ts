import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHomeSkyEngine, type HomeSkyController } from '../engine';

const rendererMock = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('../nebula', () => ({ createNebulaRenderer: rendererMock.create }));

class TrackedEvents extends EventTarget {
  listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();
  override addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) {
    if (callback) {
      const entries = this.listeners.get(type) ?? new Set();
      entries.add(callback);
      this.listeners.set(type, entries);
    }
    super.addEventListener(type, callback, options);
  }
  override removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) {
    if (callback) this.listeners.get(type)?.delete(callback);
    super.removeEventListener(type, callback, options);
  }
  count(type: string) { return this.listeners.get(type)?.size ?? 0; }
}

interface Drawing { image: unknown; alpha: number; coordinates: number[] }

class FakeContext {
  globalAlpha = 1;
  fillStyle: unknown;
  filter = 'none';
  globalCompositeOperation = 'source-over';
  frames: Drawing[][] = [];
  setTransform() {}
  clearRect() { this.frames.push([]); }
  createRadialGradient() { return { addColorStop() {} }; }
  createLinearGradient() { return { addColorStop() {} }; }
  fillRect() {}
  beginPath() {}
  arc() {}
  fill() {}
  drawImage(image: unknown, ...coordinates: number[]) {
    if (!this.frames.length) this.frames.push([]);
    this.frames[this.frames.length - 1].push({ image, coordinates, alpha: this.globalAlpha });
  }
  get lastFrame() { return this.frames[this.frames.length - 1] ?? []; }
}

class FakeCanvas {
  width = 300;
  height = 150;
  className = '';
  style: Record<string, string> = {};
  context = new FakeContext();
  parent: FakeStage | null = null;
  setAttribute() {}
  getContext() { return this.context; }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this);
    this.parent = null;
  }
}

class FakeImage {
  naturalWidth = 768;
  naturalHeight = 576;
  decoding = '';
  src = '';
  sourceRemoved = false;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() { images.push(this); }
  removeAttribute(name: string) { if (name === 'src') this.sourceRemoved = true; }
}

class FakeStage {
  ownerDocument: FakeDocument;
  width = 375;
  height = 640;
  children: FakeCanvas[] = [];
  constructor(doc: FakeDocument) { this.ownerDocument = doc; }
  appendChild(canvas: FakeCanvas) { this.children.push(canvas); canvas.parent = this; }
  getBoundingClientRect() { return { width: this.width, height: this.height }; }
  layer(name: string) {
    const found = this.children.find(canvas => canvas.className === `home-sky__${name}`);
    if (!found) throw new Error(`Missing layer ${name}`);
    return found;
  }
}

class FakeMedia extends TrackedEvents {
  matches = false;
  setReduced(value: boolean) { this.matches = value; this.dispatchEvent(new Event('change')); }
}

class FakeWindow extends TrackedEvents {
  devicePixelRatio = 2;
  Image = FakeImage;
  now = 0;
  nextFrame = 1;
  frames = new Map<number, FrameRequestCallback>();
  media = new FakeMedia();
  matchMedia() { return this.media; }
  requestAnimationFrame = (callback: FrameRequestCallback) => {
    const id = this.nextFrame++;
    this.frames.set(id, callback);
    return id;
  };
  cancelAnimationFrame = (id: number) => { this.frames.delete(id); };
  advance(milliseconds: number) {
    for (let elapsed = 0; elapsed < milliseconds; elapsed += 17) {
      this.now += 17;
      const callbacks = [...this.frames.values()];
      this.frames.clear();
      callbacks.forEach(callback => callback(this.now));
    }
  }
}

class FakeDocument extends TrackedEvents {
  hidden = false;
  defaultView = new FakeWindow();
  canvases: FakeCanvas[] = [];
  createElement() { const canvas = new FakeCanvas(); this.canvases.push(canvas); return canvas; }
  setHidden(hidden: boolean) { this.hidden = hidden; this.dispatchEvent(new Event('visibilitychange')); }
}

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  disconnected = false;
  constructor(private callback: () => void) { FakeResizeObserver.instances.push(this); }
  observe() {}
  disconnect() { this.disconnected = true; }
  trigger() { this.callback(); }
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  disconnected = false;
  constructor(private callback: (entries: Array<{ isIntersecting: boolean }>) => void) { FakeIntersectionObserver.instances.push(this); }
  observe() {}
  disconnect() { this.disconnected = true; }
  trigger(visible: boolean) { this.callback([{ isIntersecting: visible }]); }
}

let doc: FakeDocument;
let stage: FakeStage;
let images: FakeImage[];
let controllers: HomeSkyController[];
let renderers: Array<{ resize: ReturnType<typeof vi.fn>; render: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn> }>;

function create(initial?: Parameters<typeof createHomeSkyEngine>[1]) {
  const controller = createHomeSkyEngine(stage as unknown as HTMLElement, initial);
  controllers.push(controller);
  return controller;
}

beforeEach(() => {
  doc = new FakeDocument();
  stage = new FakeStage(doc);
  images = [];
  controllers = [];
  renderers = [];
  FakeResizeObserver.instances = [];
  FakeIntersectionObserver.instances = [];
  rendererMock.create.mockReset().mockImplementation(() => {
    const renderer = { resize: vi.fn(), render: vi.fn(), dispose: vi.fn() };
    renderers.push(renderer);
    return renderer;
  });
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
});

afterEach(() => {
  controllers.forEach(controller => controller.dispose());
  vi.unstubAllGlobals();
});

describe('首页星空引擎', () => {
  it('默认只画星光，不加载或显现手机；星云不会随动画帧重复计算', () => {
    create();
    expect(stage.children).toHaveLength(5);
    expect(stage.layer('stars').context.lastFrame.length).toBeGreaterThan(1000);
    expect(images).toHaveLength(0);
    expect(stage.layer('far-phones').style.opacity).toBe('0');
    expect(stage.layer('mid-phones').context.lastFrame).toHaveLength(0);
    doc.defaultView.advance(170);
    expect(renderers[0].render).toHaveBeenCalledTimes(1);
    expect(doc.defaultView.frames.size).toBe(1);
  });

  it('暂停时允许650ms显隐，星光画面保持不变，终态清空手机缓存', () => {
    const controller = create({ paused: true });
    const stars = stage.layer('stars').context;
    const baseline = stars.lastFrame;
    const starSprites = new Set(baseline.map(drawing => drawing.image));
    controller.setState({ paused: true, peopleVisible: true });
    images[0].onload?.();
    doc.defaultView.advance(700);
    expect(stage.layer('far-phones').style.opacity).toBe('1');
    expect(stage.layer('far-phones').context.lastFrame.length).toBeGreaterThan(0);
    expect(stars.lastFrame.filter(drawing => starSprites.has(drawing.image))).toEqual(baseline);
    expect(doc.defaultView.frames.size).toBe(0);

    controller.setState({ paused: true, peopleVisible: false });
    doc.defaultView.advance(700);
    expect(stage.layer('far-phones').style.opacity).toBe('0');
    expect(stage.layer('far-phones').context.lastFrame).toHaveLength(0);
    expect(stage.layer('mid-phones').context.lastFrame).toHaveLength(0);
    expect(stars.lastFrame).toEqual(baseline);
    expect(doc.defaultView.frames.size).toBe(0);
  });

  it('快速反向关闭不会跳回完整人海，迟到的图片也不会重新开启', () => {
    const controller = create({ paused: true });
    controller.setState({ paused: true, peopleVisible: true });
    doc.defaultView.advance(221);
    const halfway = Number(stage.layer('far-phones').style.opacity);
    expect(halfway).toBeGreaterThan(0);
    expect(halfway).toBeLessThan(1);
    controller.setState({ paused: true, peopleVisible: false });
    expect(Number(stage.layer('far-phones').style.opacity)).toBeCloseTo(halfway, 1);
    doc.defaultView.advance(700);
    images[0].onload?.();
    expect(stage.layer('far-phones').style.opacity).toBe('0');
    expect(stage.layer('far-phones').context.lastFrame).toHaveLength(0);
  });

  it('减少动态时立即显隐，偏好改变也不改写用户暂停状态', () => {
    doc.defaultView.media.matches = true;
    const controller = create({ paused: true });
    controller.setState({ paused: true, peopleVisible: true });
    expect(stage.layer('far-phones').style.opacity).toBe('1');
    expect(doc.defaultView.frames.size).toBe(0);
    controller.setState({ paused: true, peopleVisible: false });
    expect(stage.layer('mid-phones').style.opacity).toBe('0');
    doc.defaultView.media.setReduced(false);
    expect(doc.defaultView.frames.size).toBe(0);
  });

  it('父组件明确传paused=false时可覆盖减少动态的默认暂停', () => {
    doc.defaultView.media.matches = true;
    const controller = create({ paused: true });
    const stars = stage.layer('stars').context;
    const baseline = stars.lastFrame;
    expect(doc.defaultView.frames.size).toBe(0);
    controller.setState({ paused: false, peopleVisible: true });
    expect(stage.layer('far-phones').style.opacity).toBe('1');
    expect(doc.defaultView.frames.size).toBe(1);
    doc.defaultView.advance(300);
    expect(stars.lastFrame).not.toEqual(baseline);
    controller.setState({ paused: true, peopleVisible: false });
    expect(stage.layer('far-phones').style.opacity).toBe('0');
    expect(doc.defaultView.frames.size).toBe(0);
  });

  it.each(['document', 'viewport'])('%s隐藏期间关闭也立刻清除手机缓存和旧近景像素', mode => {
    const controller = create({ paused: true });
    controller.setState({ paused: true, peopleVisible: true });
    images[0].onload?.();
    doc.defaultView.advance(700);
    expect(stage.layer('far-phones').context.lastFrame.length).toBeGreaterThan(0);
    if (mode === 'document') doc.setHidden(true);
    else FakeIntersectionObserver.instances[0].trigger(false);
    controller.setState({ paused: true, peopleVisible: false });
    expect(stage.layer('far-phones').style.opacity).toBe('0');
    expect(stage.layer('mid-phones').context.lastFrame).toHaveLength(0);
    expect(stage.layer('stars').context.lastFrame).toHaveLength(0);
    if (mode === 'document') doc.setHidden(false);
    else FakeIntersectionObserver.instances[0].trigger(true);
    expect(stage.layer('far-phones').context.lastFrame).toHaveLength(0);
    expect(stage.layer('stars').context.lastFrame.length).toBeGreaterThan(1000);
    expect(doc.defaultView.frames.size).toBe(0);
  });

  it('页面隐藏和离开视口停止循环，返回时不补跑隐藏期间的时钟', () => {
    create();
    doc.defaultView.advance(102);
    doc.setHidden(true);
    expect(doc.defaultView.frames.size).toBe(0);
    doc.defaultView.advance(1000);
    doc.setHidden(false);
    const resumed = stage.layer('stars').context.lastFrame;
    FakeIntersectionObserver.instances[0].trigger(false);
    doc.defaultView.advance(1000);
    FakeIntersectionObserver.instances[0].trigger(true);
    expect(stage.layer('stars').context.lastFrame).toEqual(resumed);
    expect(doc.defaultView.frames.size).toBe(1);
  });

  it('清理帧、监听器、observer、迟到图片和GPU资源；同容器可重新挂载', () => {
    const first = create();
    first.setState({ paused: false, peopleVisible: true });
    const lateImage = images[0].onload;
    const canvasCount = doc.canvases.length;
    first.dispose();
    expect(doc.defaultView.frames.size).toBe(0);
    expect(doc.count('visibilitychange')).toBe(0);
    expect(doc.defaultView.count('resize')).toBe(0);
    expect(doc.defaultView.media.count('change')).toBe(0);
    expect(FakeResizeObserver.instances[0].disconnected).toBe(true);
    expect(FakeIntersectionObserver.instances[0].disconnected).toBe(true);
    expect(images[0].onload).toBeNull();
    expect(images[0].onerror).toBeNull();
    expect(images[0].sourceRemoved).toBe(true);
    expect(renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(stage.children).toHaveLength(0);
    lateImage?.();
    FakeResizeObserver.instances[0].trigger();
    FakeIntersectionObserver.instances[0].trigger(true);
    expect(doc.canvases).toHaveLength(canvasCount);
    expect(doc.defaultView.frames.size).toBe(0);

    create();
    first.dispose();
    expect(stage.children).toHaveLength(5);
    expect(renderers[1].render).toHaveBeenCalledTimes(1);
    expect(doc.count('visibilitychange')).toBe(1);
  });

  it('一个宿主重复创建时始终只有一个活动实例', () => {
    const first = create();
    create();
    expect(renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(stage.children).toHaveLength(5);
    expect(doc.defaultView.frames.size).toBe(1);
    first.setState({ peopleVisible: true, paused: false });
    expect(images).toHaveLength(0);
  });
});
