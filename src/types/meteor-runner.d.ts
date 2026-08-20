/**
 * /public/meteor-runner.js 的类型声明。
 *
 * 引擎是普通脚本而非 ES module——它同时被 /offline.html（<script src>）和
 * 404 页的 React 组件（运行时注入）使用，写成 module 就没法给静态页用了。
 * 代价是类型要在这里手写，改引擎的公开 API 时记得同步。
 */
interface MeteorRunnerOptions {
  /** 每次整数分变化时回调；游戏结束时也会调一次，带最终分数 */
  onScore?: (score: number, best: number) => void;
  onStateChange?: (state: 'idle' | 'running' | 'over' | 'victory') => void;
  /** 每跨过 100 分触发一次，用来做里程碑反馈 */
  onMilestone?: (score: number) => void;
  /** 角色形态跃迁（治愈进度到达下一档） */
  onForm?: (key: string, gemCount: number) => void;
  /** 生命数变化 */
  onLives?: (lives: number) => void;
  /** 拾取道具 */
  onItem?: (kind: string) => void;
  /** 达成通关条件：life（攒满生命）/ distance（跑够远）/ gems（集够宝石） */
  onVictory?: (type: string, score: number, gemCount: number) => void;
  /** 关掉星空视差和尾焰抖动；游戏本身是主动交互，不因此禁用 */
  reducedMotion?: boolean;
}

interface MeteorRunnerInstance {
  readonly best: number;
  readonly state: 'idle' | 'running' | 'over' | 'victory';
  readonly gemCount: number;
  readonly lives: number;
  readonly victories: string[];
  start(): void;
  pause(): void;
  /** 解绑全部监听并停帧。React unmount 时必须调用 */
  destroy(): void;
}

interface Window {
  MeteorRunner?: new (
    canvas: HTMLCanvasElement,
    options?: MeteorRunnerOptions
  ) => MeteorRunnerInstance;
}
