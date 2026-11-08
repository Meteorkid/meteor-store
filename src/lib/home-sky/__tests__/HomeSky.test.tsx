import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Effect = () => void | (() => void);
const hooks = vi.hoisted(() => ({
  refs: [] as Array<{ current: unknown }>,
  effects: [] as Array<{ effect: Effect; dependencies: readonly unknown[]; cleanup?: () => void }>,
  pending: [] as Array<() => void>,
  refIndex: 0,
  effectIndex: 0,
}));
const engine = vi.hoisted(() => ({ create: vi.fn() }));

// 沿用仓库的Node测试方式：模拟hook调度，执行组件真实effect及其清理。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useRef: (initial: unknown) => hooks.refs[hooks.refIndex++] ??= { current: initial },
  useEffect: (effect: Effect, dependencies: readonly unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.effects[index];
    if (!previous || dependencies.some((value, position) => !Object.is(value, previous.dependencies[position]))) {
      hooks.pending.push(() => {
        previous?.cleanup?.();
        hooks.effects[index] = { effect, dependencies, cleanup: effect() || undefined };
      });
    }
  },
}));
vi.mock('@/lib/home-sky/engine', () => ({ createHomeSkyEngine: engine.create }));

import HomeSky, { type HomeSkyProps } from '@/components/home/HomeSky';

let stage: HTMLDivElement;
let controllers: Array<{ setState: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn> }>;

function render(props: HomeSkyProps) {
  hooks.refIndex = hooks.effectIndex = 0;
  const node = HomeSky(props) as ReactElement<{
    ref: { current: HTMLDivElement | null };
    style: CSSProperties;
    'aria-hidden': string;
    className?: string;
  }>;
  node.props.ref.current = stage;
  hooks.pending.splice(0).forEach(commit => commit());
  return node;
}

beforeEach(() => {
  hooks.refs = [];
  hooks.effects = [];
  hooks.pending = [];
  stage = {} as HTMLDivElement;
  controllers = [];
  engine.create.mockReset().mockImplementation(() => {
    const controller = { setState: vi.fn(), dispose: vi.fn() };
    controllers.push(controller);
    return controller;
  });
});

afterEach(() => { hooks.effects.forEach(effect => effect.cleanup?.()); });

describe('HomeSky组件生命周期', () => {
  it('一个实例只创建一个engine，prop变化更新控制器而不重建背景', () => {
    const node = render({ peopleVisible: false, paused: false, className: 'hero-sky' });
    expect(engine.create).toHaveBeenCalledExactlyOnceWith(stage, { paused: true });
    expect(controllers[0].setState).toHaveBeenLastCalledWith({ peopleVisible: false, paused: false });
    render({ peopleVisible: true, paused: true, className: 'hero-sky' });
    expect(engine.create).toHaveBeenCalledTimes(1);
    expect(controllers[0].setState).toHaveBeenLastCalledWith({ peopleVisible: true, paused: true });
    expect(node.props.style.position).toBe('absolute');
    expect(node.props.style.pointerEvents).toBe('none');
    expect(node.props['aria-hidden']).toBe('true');
    expect(node.props.className).toBe('hero-sky');
  });

  it('模拟StrictMode的setup→cleanup→setup，旧controller清理且新实例收到当前props', () => {
    render({ peopleVisible: true, paused: true });
    const effects = [...hooks.effects];
    effects.forEach(effect => effect.cleanup?.());
    effects.forEach(effect => { effect.cleanup = effect.effect() || undefined; });
    expect(controllers).toHaveLength(2);
    expect(controllers[0].dispose).toHaveBeenCalledTimes(1);
    expect(controllers[1].dispose).not.toHaveBeenCalled();
    expect(controllers[1].setState).toHaveBeenLastCalledWith({ peopleVisible: true, paused: true });
  });
});
