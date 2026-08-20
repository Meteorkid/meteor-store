import { describe, expect, it, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 游戏引擎的行为测试。
 *
 * 引擎（public/meteor-runner.js）是给浏览器写的普通脚本，不是 ES module——
 * 它同时被离线兜底页和 404 页共用，详见文件顶部。这里用最小 stub 把它跑起来，
 * 而不是引入 jsdom：需要的浏览器 API 就那么几个，为一个测试装一整套 DOM 不值当。
 *
 * 重点测的是**碰撞几何**。那几个坐标是算出来的、彼此咬合的，改错了游戏照样能跑、
 * 照样能得分，只是某个操作悄悄失去意义——正是最不容易被发现的那类问题。
 */

const CODE = readFileSync(join(process.cwd(), 'public/meteor-runner.js'), 'utf8');

/** 任何属性都返回 noop 的对象，用来顶替 canvas 2d context */
function noopProxy(): unknown {
  return new Proxy(
    {},
    {
      get: () => () => noopProxy(),
    }
  );
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  flying: boolean;
  bob: number;
}

interface Engine {
  state: 'idle' | 'running' | 'over';
  speed: number;
  score: number;
  frame: number;
  deadAt: number;
  nextGap: number;
  runner: {
    x: number; y: number; w: number; h: number; vy: number;
    ducking: boolean; onGround: boolean; jumps: number; intro: number; holding: boolean;
  };
  obstacles: Obstacle[];
  stars: { x: number; y: number }[];
  shooting: unknown[];
  reducedMotion: boolean;
  updateBackground(move: number, dt: number): void;
  currentPhase(): { aurora: number; shower: number };
  gemCount: number;
  formKey: string;
  healProgress(): number;
  newBest: boolean;
  best: number;
  lives: number;
  items: unknown[];
  gems: unknown[];
  victories: string[];
  victoryType: string;
  checkVictory(): void;
  updateForm(): void;
  spawnGemArc(centerX: number, clearTop: number): void;
  spawnFeast(): void;
  phase: number;
  phaseTarget: number;
  phaseMix: number;
  start(): void;
  jump(): void;
  releaseJump(): void;
  duck(on: boolean): void;
  update(dt: number): void;
  destroy(): void;
}

type EngineCtor = new (canvas: unknown, opts?: Record<string, unknown>) => Engine;

let MeteorRunner: EngineCtor;
let listenerCount: number;
/** 监听器计数用的收发对，window / document / canvas 三处共用，destroy 才好核对总数 */
let listenerStub: { addEventListener: () => void; removeEventListener: () => void };

beforeEach(() => {
  listenerCount = 0;
  const store = new Map<string, string>();

  const target = {
    addEventListener: () => {
      listenerCount++;
    },
    removeEventListener: () => {
      listenerCount--;
    },
  };
  listenerStub = target;

  const win = {
    ...target,
    devicePixelRatio: 1,
    matchMedia: () => ({ matches: false }),
    MeteorRunner: undefined as unknown,
  };

  const doc = {
    ...target,
    hidden: false,
    readyState: 'complete',
    querySelector: () => null, // 没有 data-meteor-runner-auto 的 canvas，autoInit 直接返回
    documentElement: { lang: 'zh-CN' },
  };

  const localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };

  const fn = new Function(
    'window',
    'document',
    'localStorage',
    'navigator',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    CODE
  );
  fn(win, doc, localStorage, { language: 'zh-CN' }, () => 1, () => {});

  MeteorRunner = win.MeteorRunner as EngineCtor;
});

function makeGame(opts: Record<string, unknown> = {}): Engine {
  // canvas 上绑了 pointerdown/keydown，还会被设置 tabindex 和聚焦，
  // 所以 stub 要能收监听、能读写属性、能 focus
  const attrs = new Map<string, string>();
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => noopProxy(),
    setAttribute: (k: string, v: string) => void attrs.set(k, v),
    getAttribute: (k: string) => attrs.get(k) ?? null,
    focus: () => {},
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 640, height: 300 }),
    ...listenerStub,
  } as unknown;
  const g = new MeteorRunner(canvas, opts);
  g.start();
  // 跳过起跑入场：那段时间 update 会提前 return（不判碰撞、不生成障碍），
  // 是有意的无敌期，但会让所有几何用例什么都测不到
  g.runner.intro = 0;
  g.runner.x = 56; // RUNNER_X
  g.nextGap = 99999; // 关掉自动生成，由每个用例自己摆障碍
  g.obstacles.length = 0;
  return g;
}

/** 把一个障碍摆到与角色水平重叠的位置，只用 dt=0 跑一次判定（世界不推进） */
function collidesWith(o: Partial<Obstacle>, opts: { ducking: boolean }): boolean {
  const g = makeGame();
  g.runner.ducking = opts.ducking;
  g.obstacles.push({ x: g.runner.x, y: 0, w: 40, h: 36, flying: true, bob: 0, ...o } as Obstacle);
  g.update(0);
  const dead = g.state === 'over';
  g.destroy();
  return dead;
}

describe('飞行障碍：下蹲必须是有意义的操作', () => {
  // 引擎里飞行障碍固定 y = GROUND_Y - 68 = 182，h = 36
  const FLY_Y = 182;

  it('站着会被撞到', () => {
    expect(collidesWith({ y: FLY_Y }, { ducking: false })).toBe(true);
  });

  it('蹲下就能躲过', () => {
    expect(collidesWith({ y: FLY_Y }, { ducking: true })).toBe(false);
  });

  it('在整个上下浮动周期里，站撞/蹲不撞都成立', () => {
    // 判定盒会随 bob 上下浮动，只在 bob=0 时正确是不够的
    for (let i = 0; i < 24; i++) {
      const bob = (i / 24) * Math.PI * 2;
      expect(collidesWith({ y: FLY_Y, bob }, { ducking: false }), `bob=${bob} 站着没撞到`).toBe(true);
      expect(collidesWith({ y: FLY_Y, bob }, { ducking: true }), `bob=${bob} 蹲下还是撞了`).toBe(false);
    }
  });

  it('触屏设备也有下蹲入口', () => {
    // 飞行障碍从 200 分开始出现，而触屏没有 ↓ 键。少了这个分区，
    // 手机玩家会卡死在 200 分且完全不知道原因
    expect(CODE).toMatch(/localY > 0\.62/);
    // 抬手和取消都要复位，否则手指移出画布再松开会让角色一直蹲着
    expect(CODE).toMatch(/'pointerup'/);
    expect(CODE).toMatch(/'pointercancel'/);
  });

  it('引擎里只有这一个飞行高度', () => {
    // 曾经还有个「高空」档：站着必过、一跳必死，且能与地面障碍排出无解组合。
    // 飞行高度只能有 FLY_Y 一个来源；makeFlyer 里出现第二个 y 值就要重新审这件事
    expect(CODE).toMatch(/var FLY_Y = GROUND_Y - 68;/);
    // 截取范围的终点必须从起点之后找：spawnRocks 的调用点在 makeFlyer 定义之前
    const makerStart = CODE.indexOf('MeteorRunner.prototype.makeFlyer');
    const maker = CODE.slice(makerStart, CODE.indexOf('};', makerStart));
    expect(maker.match(/y: [A-Za-z_]+/g)).toEqual(['y: FLY_Y']);
  });
});

describe('地面障碍是可以跳过去的', () => {
  it('跳跃最高点高于最高的地面障碍', () => {
    const g = makeGame();
    const groundY = g.runner.y + g.runner.h; // 站立时脚底 = GROUND_Y
    let peak = g.runner.y;
    g.runner.vy = -16.8; // JUMP_V
    g.runner.onGround = false;
    for (let i = 0; i < 60 && !g.runner.onGround; i++) {
      g.update(1);
      peak = Math.min(peak, g.runner.y);
    }
    const clearance = groundY - (peak + g.runner.h);
    g.destroy();
    // 地面障碍最高 66px（spawnRocks 里最宽那档 rand(51, 66)）
    expect(clearance).toBeGreaterThan(66);
  });

  it('落地后恢复站立高度', () => {
    const g = makeGame();
    g.runner.vy = -16.8;
    g.runner.onGround = false;
    for (let i = 0; i < 80 && !g.runner.onGround; i++) g.update(1);
    expect(g.runner.onGround).toBe(true);
    expect(g.runner.h).toBe(58);
    g.destroy();
  });
});

describe('障碍间距必须容纳一次完整跳跃', () => {
  /**
   * 这是全局最容易被「顺手调个参数」破坏的一条。
   *
   * 跳跃期间玩家完全失去控制权，滞空要吃掉 AIR_FRAMES × speed 像素。下一个障碍
   * 若落进这段距离内，玩家跳过前一个后还没落地，就没有第二次起跳的机会——
   * 眼睁睁撞上去。这不是难度，是无解局面，而且只在特定随机组合下出现，
   * 手动试玩很可能一直碰不到。
   */
  const AIR_FRAMES = (2 * 16.8) / 0.93; // JUMP_V / GRAVITY

  it('最小间距按滞空距离反推，而不是拍脑袋的线性式子', () => {
    expect(CODE).toMatch(/var minGap = AIR_FRAMES \* this\.speed \* [\d.]+ \+ \d+;/);
    // AIR_FRAMES 必须由跳跃参数推导，写死常数就会在调手感时悄悄失配
    expect(CODE).toMatch(/var AIR_FRAMES = \(2 \* Math\.abs\(JUMP_V\)\) \/ GRAVITY;/);
  });

  it.each([5.6, 8, 10, 13])('速度 %s 时，实际生成的间距足够落地', (speed) => {
    const g = makeGame();
    g.speed = speed;
    const gaps: number[] = [];
    // 反复触发生成，取最小间距
    for (let i = 0; i < 300; i++) {
      g.nextGap = 0;
      g.obstacles.length = 0;
      g.speed = speed;
      g.update(0.0001);
      gaps.push(g.nextGap);
    }
    g.destroy();
    const minGap = Math.min(...gaps);
    // 玩家最早可在跳跃第 4 帧越过障碍顶部，所以真正需要空出的是滞空的后段。
    // 留出 0.7 倍滞空距离作为底线——低于此，无解组合会稳定出现
    expect(minGap).toBeGreaterThan(AIR_FRAMES * speed * 0.7);
  });
});

describe('二段跳与可变跳跃高度', () => {
  it('离地后还能再跳一次，但不能第三次', () => {
    const g = makeGame();
    g.jump();
    const first = g.runner.vy;
    expect(g.runner.onGround).toBe(false);
    expect(first).toBeLessThan(0);

    g.update(1);
    g.jump(); // 二段
    const second = g.runner.vy;
    expect(second).toBeLessThan(0);

    g.update(1);
    const beforeThird = g.runner.vy;
    g.jump(); // 第三次，应该没反应
    expect(g.runner.vy).toBe(beforeThird);
    g.destroy();
  });

  it('二段跳比首跳弱', () => {
    const g = makeGame();
    g.jump();
    const first = Math.abs(g.runner.vy);
    g.update(1);
    g.jump();
    const second = Math.abs(g.runner.vy);
    g.destroy();
    // 一样强的话，二连跳能飞过整屏，障碍全失去意义
    expect(second).toBeLessThan(first);
  });

  it('落地后二段跳次数重置', () => {
    const g = makeGame();
    g.jump();
    g.jump();
    for (let i = 0; i < 80 && !g.runner.onGround; i++) g.update(1);
    expect(g.runner.onGround).toBe(true);
    expect(g.runner.jumps).toBe(0);
    g.destroy();
  });

  it('松开跳跃键会截断上升速度（轻点小跳）', () => {
    const g = makeGame();
    g.jump();
    const full = g.runner.vy;
    g.releaseJump();
    const cut = g.runner.vy;
    g.destroy();
    expect(Math.abs(cut)).toBeLessThan(Math.abs(full));
    // 方向必须是「变短」——反过来做（滑翔/减缓下落）会拉长最大滞空，
    // 逼着障碍间距一起变大
    expect(cut).toBeGreaterThan(full);
  });

  it('松键只影响上升，下落中不加速', () => {
    const g = makeGame();
    g.jump();
    for (let i = 0; i < 40 && g.runner.vy <= 0; i++) g.update(1);
    expect(g.runner.vy).toBeGreaterThan(0); // 已在下落
    const falling = g.runner.vy;
    g.releaseJump();
    expect(g.runner.vy).toBe(falling);
    g.destroy();
  });

  it('起跳会自动取消下蹲', () => {
    const g = makeGame();
    g.duck(true);
    expect(g.runner.ducking).toBe(true);
    g.jump();
    expect(g.runner.ducking).toBe(false); // 否则蹲着跳会卡在矮判定盒里
    g.destroy();
  });

  it('障碍间距按单跳滞空算，不因二段跳而放大', () => {
    // 这是有意的设计决定，不是疏漏。二段跳最坏能滞空 60+ 帧，按它反推的话
    // 障碍会稀疏到无聊。判据是「单跳能不能过」——能过就有解；
    // 二段跳是玩家主动用的额外能力，用砸了属于操作失误。
    expect(CODE).toMatch(/var AIR_FRAMES = \(2 \* Math\.abs\(JUMP_V\)\) \/ GRAVITY;/);
    // AIR_FRAMES 的定义里不能掺进二段跳的常量
    const line = CODE.match(/var AIR_FRAMES = .+;/)?.[0] ?? '';
    expect(line).not.toMatch(/SECOND_JUMP_V|MAX_JUMPS/);
  });
});

describe('起跑入场是无敌期', () => {
  it('入场期间不判碰撞、不生成障碍', () => {
    const g = makeGame();
    g.runner.intro = 20;
    g.nextGap = 0; // 正常情况下这会立刻生成一批障碍
    // 摆一个必撞的障碍在身上
    g.obstacles.push({ x: g.runner.x, y: 192, w: 20, h: 58, flying: false, bob: 0 });
    g.update(1);
    expect(g.state).toBe('running'); // 没被撞死
    g.destroy();
  });

  it('入场结束后角色回到固定跑道位置', () => {
    const g = makeGame();
    g.runner.intro = 26;
    g.runner.x = -44;
    for (let i = 0; i < 40 && g.runner.intro > 0; i++) g.update(1);
    expect(g.runner.x).toBe(56); // RUNNER_X
    g.destroy();
  });
});

describe('视觉阶段是渐变的，不是阶跃', () => {
  it('跨过阈值时会经过中间强度', () => {
    // 早先这里是「攒够帧数直接换一个 PHASES 条目」，极光会凭空冒出来。
    // 阶段是给长局的氛围奖励，突变反而像画面出了故障
    const g = makeGame();
    g.score = 1400; // 还没到极光阶段（1500）
    g.update(1);
    expect(g.currentPhase().aurora).toBe(0);

    g.score = 1600; // 越过阈值
    g.update(1);
    const mid = g.currentPhase().aurora;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1); // 关键：不是一步到位

    for (let i = 0; i < 400; i++) g.update(1);
    expect(g.currentPhase().aurora).toBe(1);
    g.destroy();
  });

  it('阶段不改变任何速度或碰撞参数', () => {
    // 难度曲线只由 speed 一条线控制
    const phases = CODE.slice(CODE.indexOf('var PHASES'), CODE.indexOf('/** 轴对齐包围盒'));
    expect(phases).toMatch(/aurora/);
    expect(phases).toMatch(/shower/);
    // 出现速度/重力/间距相关字段就说明阶段开始插手难度了
    expect(phases).not.toMatch(/speed|gravity|gap|jump/i);
  });
});

describe('装饰元素不参与碰撞', () => {
  it('地面起伏是纯视觉的，碰撞只认 GROUND_Y', () => {
    // 让地面跟着起伏会冒出「踩在坡上却判定悬空」这类问题，
    // 而这个游戏的乐趣完全不在地形
    const g = makeGame();
    const groundTop = g.runner.y + g.runner.h;
    // 推进一段时间，地面纹理会滚动变化
    for (let i = 0; i < 200; i++) g.update(1);
    expect(g.runner.y + g.runner.h).toBe(groundTop); // 站立高度始终不变
    g.destroy();
  });

  it('背景流星不进入障碍数组', () => {
    const g = makeGame();
    g.score = 4000; // 推到流星最密的阶段
    for (let i = 0; i < 400; i++) g.update(1);
    // 所有障碍要么是地面柱要么是飞行体，没有第三种混进来
    for (const o of g.obstacles) {
      expect(typeof o.flying).toBe('boolean');
      expect(o.w).toBeGreaterThan(0);
    }
    g.destroy();
  });
});

describe('节奏与计分', () => {
  it('分数随时间增长', () => {
    const g = makeGame();
    for (let i = 0; i < 100; i++) g.update(1);
    expect(g.score).toBeGreaterThan(0);
    g.destroy();
  });

  it('速度递增但有上限', () => {
    const g = makeGame();
    const start = g.speed;
    for (let i = 0; i < 20000; i++) g.update(1);
    expect(g.speed).toBeGreaterThan(start);
    expect(g.speed).toBeLessThanOrEqual(13); // SPEED_MAX
    g.destroy();
  });

  it('dt 被钳住，切后台回来不会瞬移穿过障碍', () => {
    // 钳制在 tick() 里，update 本身收到多少就走多少——所以这条只能对源码断言。
    // 去掉它的话，切后台再回来时 dt 会是几百帧，角色直接瞬移穿过障碍，
    // 表现为"明明躲开了却死了"或"明明撞上了却没事"
    expect(CODE).toMatch(/Math\.min\(\(ts - this\.lastTs\) \/ 16\.667, 2\)/);

    const g = makeGame();
    g.obstacles.push({ x: 400, y: 192, w: 14, h: 58, flying: false, bob: 0 });
    const before = g.obstacles[0].x;
    g.update(2); // 钳制后的最大步长
    expect(before - g.obstacles[0].x).toBeCloseTo(g.speed * 2, 5);
    g.destroy();
  });
});

describe('键盘只在画布获得焦点时才被接管', () => {
  /**
   * 绑在 window 上曾经是默认写法，但 404 页里游戏只是页面的一部分：
   * keydown 对 Space 调了 preventDefault，玩家想用空格翻页会被游戏吞掉，
   * 键盘用户和读屏用户都会莫名其妙。
   */
  it('键盘监听绑在 canvas 上，不绑 window', () => {
    const bind = CODE.slice(CODE.indexOf('MeteorRunner.prototype.bindEvents'), CODE.indexOf('MeteorRunner.prototype.jump'));
    expect(bind).toMatch(/this\.on\(this\.canvas, 'keydown'/);
    expect(bind).toMatch(/this\.on\(this\.canvas, 'keyup'/);
    expect(bind).not.toMatch(/this\.on\(window, 'key/);
  });

  it('W / S 与空格 / 方向键等价', () => {
    // WASD 是玩家的肌肉记忆，只给空格和方向键会让一部分人上来就不知道怎么动
    const bind = CODE.slice(CODE.indexOf('MeteorRunner.prototype.bindEvents'), CODE.indexOf('MeteorRunner.prototype.jump'));
    expect(bind).toMatch(/e\.code === 'KeyW'/);
    expect(bind).toMatch(/e\.code === 'KeyS'/);
    // 跳和蹲都要走同一组判定函数，避免 keydown 加了 keyup 忘了
    expect(bind).toMatch(/isJumpKey\(e\)/);
    expect(bind).toMatch(/isDuckKey\(e\)/);
  });

  it('字母键用 e.code 判断而不是 e.key', () => {
    // code 是物理键位，不受大小写、输入法状态、键盘布局影响。
    // 用 e.key 的话，中文输入法开着或按了 CapsLock 就可能收不到
    const bind = CODE.slice(CODE.indexOf('var isJumpKey'), CODE.indexOf('this.on(this.canvas, \'keydown\''));
    expect(bind).not.toMatch(/e\.key === 'w'|e\.key === 'W'|e\.key === 's'|e\.key === 'S'/i);
  });

  it('画布被设成可聚焦，并标为 application', () => {
    // 不可聚焦就收不到键盘事件；role=img 会让读屏软件以为这只是张图
    expect(CODE).toMatch(/setAttribute\('tabindex', '0'\)/);
    expect(CODE).toMatch(/setAttribute\('role', 'application'\)/);
  });

  it('点击画布会主动聚焦', () => {
    // pointerdown 里调了 preventDefault，浏览器默认的聚焦行为被阻止了，
    // 不手动补一次的话鼠标玩家点完画布键盘依然没反应
    expect(CODE).toMatch(/self\.canvas\.focus\(/);
  });

  it('失去焦点时松开所有键位', () => {
    // 否则「按着 ↓ 切走」会让角色一直保持下蹲
    const bind = CODE.slice(CODE.indexOf('MeteorRunner.prototype.bindEvents'), CODE.indexOf('MeteorRunner.prototype.jump'));
    expect(bind).toMatch(/'blur'/);
  });

  it('window 上的 pointerup 只认自己记下的手指', () => {
    // 手指可能移出画布才松开，所以必须绑 window；但不加 pointerId 过滤的话，
    // 玩家在页面别处点一下松手会把正在上升的跳跃截断
    expect(CODE).toMatch(/self\.jumpPointer === e\.pointerId/);
    expect(CODE).toMatch(/self\.duckPointer === e\.pointerId/);
  });
});

describe('死亡与重开', () => {
  /** 摆一个必撞的障碍，把游戏推到 over */
  function crash(): Engine {
    const g = makeGame();
    g.obstacles.push({ x: g.runner.x, y: 192, w: 20, h: 58, flying: false, bob: 0 });
    g.update(1);
    return g;
  }

  it('撞上障碍会进入 over', () => {
    const g = crash();
    expect(g.state).toBe('over');
    g.destroy();
  });

  it('锁定期过后能重新开始', async () => {
    /**
     * 这条曾经是死锁：重开判断写成 `frame - deadAt > 30`，而 state 变成 over 之后
     * tick 不再排下一帧、update 直接 return，frame 永远冻结在死亡那一刻，
     * 差值恒为 0 —— 玩家撞一次之后只能刷新页面。所以判断必须用时间戳。
     */
    const g = crash();
    expect(g.state).toBe('over');

    // 锁定期内按跳跃不该重开
    g.jump();
    expect(g.state).toBe('over');

    await new Promise((r) => setTimeout(r, 450)); // > RESTART_LOCK_MS
    g.jump();
    expect(g.state).toBe('running');
    g.destroy();
  });

  it('重开判断不依赖 frame（frame 在 over 状态下是冻结的）', () => {
    expect(CODE).toMatch(/Date\.now\(\) - this\.deadAt > RESTART_LOCK_MS/);
    expect(CODE).not.toMatch(/this\.frame - this\.deadAt/);
  });

  it('over 状态下 frame 确实冻结', () => {
    // 上一条断言的前提。哪天 update 改成 over 时也推进 frame，这里会红，
    // 提醒回去确认重开逻辑还成不成立
    const g = crash();
    const f = g.frame;
    g.update(1);
    g.update(1);
    expect(g.frame).toBe(f);
    g.destroy();
  });

  it('第一局不会误报「破纪录」', () => {
    // best 初始是 0，那时任何分数都「超过纪录」，弹个庆祝是空欢喜
    const g = makeGame();
    g.best = 0;
    g.score = 500;
    g.obstacles.push({ x: g.runner.x, y: 192, w: 20, h: 58, flying: false, bob: 0 });
    g.update(1);
    expect(g.state).toBe('over');
    expect(g.newBest).toBe(false);
    g.destroy();
  });

  it('超过已有纪录时标记破纪录', () => {
    const g = makeGame();
    g.best = 100;
    g.score = 500;
    g.obstacles.push({ x: g.runner.x, y: 192, w: 20, h: 58, flying: false, bob: 0 });
    g.update(1);
    expect(g.newBest).toBe(true);
    expect(g.best).toBe(500);
    g.destroy();
  });

  it('重开会清空上一局的障碍和分数', () => {
    const g = crash();
    g.score = 500;
    g.start();
    expect(g.state).toBe('running');
    expect(g.score).toBe(0);
    expect(g.obstacles.length).toBe(0);
    g.destroy();
  });
});

describe('减弱动效（prefers-reduced-motion）', () => {
  /**
   * 全站约定：减弱动效时 transition 和 transform 都要停，不能只停前者。
   * 游戏本身是主动交互，不禁用，但所有「自己动」的装饰都要停下来。
   */
  it('跳过起跑入场动画', () => {
    const g = makeGame({ reducedMotion: true });
    g.start();
    expect(g.runner.intro).toBe(0);
    expect(g.runner.x).toBe(56); // 不从屏幕外跑进来
    g.destroy();
  });

  it('不生成背景流星', () => {
    const g = makeGame({ reducedMotion: true });
    g.phaseTarget = 3;
    g.phase = 3; // 流星最密的阶段
    for (let i = 0; i < 2000; i++) g.updateBackground(11, 1);
    expect(g.shooting.length).toBe(0);
    g.destroy();
  });

  it('星空不做视差滚动', () => {
    const g = makeGame({ reducedMotion: true });
    const before = g.stars.map((s) => s.x);
    for (let i = 0; i < 50; i++) g.updateBackground(11, 1);
    expect(g.stars.map((s) => s.x)).toEqual(before);
    g.destroy();
  });

  it('游戏本身照常可玩', () => {
    // 减弱动效不该变成「不能玩」
    const g = makeGame({ reducedMotion: true });
    g.jump();
    expect(g.runner.onGround).toBe(false);
    for (let i = 0; i < 100; i++) g.update(1);
    expect(g.score).toBeGreaterThan(0);
    g.destroy();
  });

  it('里程碑闪光也被关掉', () => {
    // 全屏闪白正是 prefers-reduced-motion 要规避的东西。
    // 只关 CSS 动画、留着 canvas 里的闪光，等于没关
    const draw = CODE.slice(CODE.indexOf('MeteorRunner.prototype.draw = function'), CODE.indexOf('drawGameOver = function'));
    expect(draw).toMatch(/this\.flash > 0 && !this\.reducedMotion/);
  });

  it('系统设置中途变化时会跟随', () => {
    // matchMedia 的 change 监听，游戏进行中切换设置也生效
    expect(CODE).toMatch(/prefers-reduced-motion: reduce/);
    expect(CODE).toMatch(/self\.reducedMotion = e\.matches/);
  });
});

describe('失败时不留半死状态', () => {
  it('拿不到 2d 上下文时构造直接抛错', () => {
    // 隐私插件、企业策略都可能让 getContext 返回 null。
    // 不抛的话会留下一个每帧抛异常的实例，调用方也无从判断该不该隐藏游戏区
    const broken = {
      width: 0,
      height: 0,
      getContext: () => null,
      setAttribute: () => {},
      getAttribute: () => null,
      focus: () => {},
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 640, height: 300 }),
      ...listenerStub,
    } as unknown;
    expect(() => new MeteorRunner(broken)).toThrow(/2d/);
  });

  it('帧循环里的异常被兜住，不让画面静默定格', () => {
    // rAF 链一旦因异常断掉，表现是画面定格、按键没反应，玩家完全不知道怎么了
    const tick = CODE.slice(CODE.indexOf('MeteorRunner.prototype.tick'), CODE.indexOf('MeteorRunner.prototype.update'));
    expect(tick).toMatch(/try \{/);
    expect(tick).toMatch(/catch \(err\)/);
    // 兜住之后要进入 over，让重启图标亮起来，玩家能自己重开
    expect(tick).toMatch(/setState\('over'\)/);
    expect(tick).toMatch(/this\.deadAt = Date\.now\(\)/);
  });
});

describe('治愈形态', () => {
  it('形态在 update 里推进，不依赖绘制', () => {
    /**
     * 这段逻辑一度挂在 drawRunner 里，于是形态成了「画一帧才更新一次」的东西：
     * 任何不绘制的路径都会让跃迁被整段跳过，onForm 也不会发。
     * 形态是叙事主线，属于逻辑层。
     */
    const seen: string[] = [];
    const g = makeGame({ onForm: (k: string) => seen.push(k) });
    g.runner.intro = 0;
    // 只推进逻辑，一次都不画
    for (const n of [0, 35, 65, 95, 125]) {
      g.gemCount = n;
      g.update(1);
    }
    g.destroy();
    // 150 是 GEM_GOAL，档位在 0/0.2/0.4/0.6/0.8 → 30/60/90/120
    expect(seen).toEqual(['healing', 'recovering', 'healed', 'radiant']);
  });

  it('治愈进度封顶在 1', () => {
    const g = makeGame();
    g.gemCount = 99999;
    expect(g.healProgress()).toBe(1);
    g.destroy();
  });

  it('开局不误报形态跃迁', () => {
    // 初始就是 depressed，不该在第一帧就弹一次「形态变化」
    const seen: string[] = [];
    const g = makeGame({ onForm: (k: string) => seen.push(k) });
    g.runner.intro = 0;
    g.update(1);
    expect(seen).toEqual([]);
    g.destroy();
  });
});

describe('通关', () => {
  it('集够宝石触发对应结局', () => {
    const seen: string[] = [];
    const g = makeGame({ onVictory: (t: string) => seen.push(t) });
    g.gemCount = 5000;
    g.update(1);
    expect(g.state).toBe('victory');
    expect(g.victoryType).toBe('gems');
    expect(seen).toEqual(['gems']);
    g.destroy();
  });

  it('攒满生命触发治愈结局', () => {
    const g = makeGame();
    g.lives = 99;
    g.update(1);
    expect(g.victoryType).toBe('life');
    g.destroy();
  });

  it('同一局内只触发一次', () => {
    // 达成第一个条件后又达成第二个，不该把演出打断重放
    const seen: string[] = [];
    const g = makeGame({ onVictory: (t: string) => seen.push(t) });
    g.gemCount = 5000;
    g.update(1);
    g.lives = 99;
    for (let i = 0; i < 10; i++) g.update(1);
    expect(seen).toHaveLength(1);
    g.destroy();
  });

  it('演出期间切后台回来能继续', () => {
    // 通关演出靠 rAF 推进，visibilitychange 恢复时只判 running 的话，
    // 演出会永久停在切走的那一帧
    const vis = CODE.slice(CODE.indexOf("'visibilitychange'"), CODE.indexOf("'visibilitychange'") + 900);
    expect(vis).toMatch(/state === 'running' \|\| self\.state === 'victory'/);
    // tick 里排下一帧的条件也要一致
    const tick = CODE.slice(CODE.indexOf('MeteorRunner.prototype.tick'), CODE.indexOf('MeteorRunner.prototype.update'));
    expect(tick).toMatch(/state === 'running' \|\| this\.state === 'victory'/);
  });

  it('解锁记录同步到实例上', () => {
    // 只写 localStorage 而不更新实例副本的话，外部读 game.victories 拿到旧值
    const g = makeGame();
    g.gemCount = 5000;
    g.update(1);
    expect(g.victories).toContain('gems');
    g.destroy();
  });

  it('演出期间角色不会画两次', () => {
    // 演出把角色搬到画面中央重画，常规绘制必须跳过，否则原位置留一个分身
    const draw = CODE.slice(CODE.indexOf('MeteorRunner.prototype.draw = function'), CODE.indexOf('drawHud = function'));
    expect(draw).toMatch(/state !== 'victory'.*\n?.*drawRunner|if \(this\.state !== 'victory'\) this\.drawRunner\(\)/);
  });
});

describe('宝石弧线贴合跳跃轨迹', () => {
  const AIR_FRAMES = (2 * 16.8) / 0.93;

  it('一次时机正确的跳跃能把整条弧线吃完', () => {
    /**
     * 弧线一度是手画的固定跨度抛物线，而一次跳跃的水平距离是
     * AIR_FRAMES × speed（202~470px，随速度变化）——两者对不上时
     * 玩家会直接飞过整条弧线，只擦到一两颗，「吃到宝石 = 跳得准」就不成立了。
     * 现在按真实跳跃方程取样，这条测试保证它们始终匹配。
     */
    const g = makeGame();
    g.obstacles.length = 0;
    g.gems.length = 0;
    g.nextGap = 99999;

    // 把弧线摆在「角色此刻起跳正好能吃到」的位置
    const centerX = g.runner.x + g.runner.w / 2 + (AIR_FRAMES * g.speed) / 2;
    g.spawnGemArc(centerX, 250);
    const total = g.gems.length;
    expect(total).toBeGreaterThanOrEqual(5);

    g.jump();
    for (let i = 0; i < AIR_FRAMES + 6; i++) g.update(1);

    expect(g.gemCount).toBe(total);
    g.destroy();
  });

  it.each([5.6, 9, 13])('速度 %s 时弧线跨度跟着缩放', (speed) => {
    const g = makeGame();
    g.speed = speed;
    g.gems.length = 0;
    g.spawnGemArc(400, 250);
    const xs = g.gems.map((x) => (x as { x: number }).x);
    const span = Math.max(...xs) - Math.min(...xs);
    g.destroy();
    // 跨度应该落在一次跳跃水平距离的合理比例内
    expect(span).toBeGreaterThan(AIR_FRAMES * speed * 0.5);
    expect(span).toBeLessThan(AIR_FRAMES * speed * 0.8);
  });

  it('所有宝石都在玩家够得到的高度内', () => {
    // pushGem 的钳制范围：上界是单跳最高点，下界贴着跑动高度。
    // 超出这个范围的宝石画得再好看也只是嘲讽
    const g = makeGame();
    g.gems.length = 0;
    for (let i = 0; i < 40; i++) g.spawnFeast();
    for (const raw of g.gems) {
      const gem = raw as { y: number };
      expect(gem.y).toBeGreaterThanOrEqual(250 - 150);
      expect(gem.y).toBeLessThanOrEqual(250 - 22);
    }
    g.destroy();
  });
});

describe('常量引用完整', () => {
  it('COLORS 的每个引用都在定义里', () => {
    /**
     * canvas 的 fillStyle 被赋成 undefined 时**不报错**，只是保持上一个颜色——
     * 删掉一个颜色常量却漏改引用，画面会静默地画错色。这条把它变成 CI 错误。
     */
    const defBlock = CODE.slice(CODE.indexOf('var COLORS = {'), CODE.indexOf('};', CODE.indexOf('var COLORS = {')));
    const defined = new Set([...defBlock.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]));
    const used = new Set([...CODE.matchAll(/COLORS\.(\w+)/g)].map((m) => m[1]));
    expect(defined.size).toBeGreaterThan(0);
    for (const k of used) {
      expect(defined.has(k), `COLORS.${k} 被引用但没有定义`).toBe(true);
    }
  });

  it('PHASES 的每个字段都被读取', () => {
    // 反过来：定义了却没人读的字段是死代码，跟着阶段插值白算一遍
    const block = CODE.slice(CODE.indexOf('var PHASES = ['), CODE.indexOf('];', CODE.indexOf('var PHASES = [')));
    const fields = new Set([...block.matchAll(/^\s{6}(\w+):/gm)].map((m) => m[1]));
    fields.delete('at');
    fields.delete('name');
    for (const f of fields) {
      const reads = [...CODE.matchAll(new RegExp(`(ph|out|a|b)\\.${f}\\b`, 'g'))];
      expect(reads.length, `PHASES.${f} 定义了但没被读取`).toBeGreaterThan(0);
    }
  });
});

describe('资源释放', () => {
  it('destroy 后全局监听归零', () => {
    const g = makeGame();
    expect(listenerCount).toBeGreaterThan(0);
    g.destroy();
    expect(listenerCount).toBe(0);
  });
});
