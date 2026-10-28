import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyWordAnchor } from '@/lib/daily/navigation';
const hooks = vi.hoisted(() => ({ cleanup: undefined as (() => void) | undefined }));
vi.mock('react', () => ({ useRef: (current: unknown) => ({ current }), useEffect: (effect: () => () => void) => { hooks.cleanup = effect(); } }));
import { useDailyEntryNavigation } from '../entry-navigation';
class FakeElement { closest() { return this; } }
class FakeDetails extends FakeElement { open = false; focus = vi.fn(); scrollIntoView = vi.fn(); }
class FakeAnchor extends FakeElement { target = ''; href = `https://site.test/zh/daily?date=2026-10-24&view=all#${dailyWordAnchor('next', 1)}`; }
let target: FakeDetails;
let listeners: Map<string, EventListener>;
let reduced = true;
beforeEach(() => {
  target = new FakeDetails(); listeners = new Map(); reduced = true;
  vi.stubGlobal('Element', FakeElement); vi.stubGlobal('HTMLDetailsElement', FakeDetails); vi.stubGlobal('HTMLAnchorElement', FakeAnchor);
  vi.stubGlobal('window', { location: { hash: `#${dailyWordAnchor('word', 0)}` }, matchMedia: () => ({ matches: reduced }), addEventListener: vi.fn(), removeEventListener: vi.fn() });
  vi.stubGlobal('location', { origin: 'https://site.test', pathname: '/zh/daily' });
  vi.stubGlobal('document', { getElementById: () => target, addEventListener: (name: string, listener: EventListener) => listeners.set(name, listener), removeEventListener: vi.fn() });
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1)); vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => { hooks.cleanup?.(); hooks.cleanup = undefined; vi.unstubAllGlobals(); });
describe('具体词条定位与输入偏好', () => {
  it('减少动画时立即定位并展开词义，焦点落在目标条目', () => {
    useDailyEntryNavigation('2026-10-24', []);
    expect(target.open).toBe(true); expect(target.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
  });
  it('普通模式保留页面已有滚动行为', () => {
    reduced = false; useDailyEntryNavigation('2026-10-24', []);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' });
  });
  it('修饰键或非主键开新页不会改变当前页焦点和滚动', () => {
    useDailyEntryNavigation('2026-10-24', []); target.focus.mockClear(); target.scrollIntoView.mockClear();
    for (const modifier of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
      listeners.get('click')!({ button: 0, target: new FakeAnchor(), ...modifier } as unknown as Event);
    }
    expect(target.focus).not.toHaveBeenCalled(); expect(target.scrollIntoView).not.toHaveBeenCalled(); expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
  it('Next延后一帧pushState且不发hashchange时仍定位新条目，不抢回旧条目', () => {
    useDailyEntryNavigation('2026-10-24', []); target.focus.mockClear(); target.scrollIntoView.mockClear();
    const frames: FrameRequestCallback[] = [];
    vi.mocked(requestAnimationFrame).mockImplementation(callback => { frames.push(callback); return frames.length; });
    const anchor = new FakeAnchor();
    listeners.get('click')!({ button: 0, defaultPrevented: true, target: anchor } as unknown as Event);
    frames.shift()!(0);
    expect(target.focus).not.toHaveBeenCalled();
    window.location.hash = new URL(anchor.href).hash;
    frames.shift()!(16);
    expect(target.focus).toHaveBeenCalledOnce();
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
  });
});
