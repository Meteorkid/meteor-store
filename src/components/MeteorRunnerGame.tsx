'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 404 页的流星跑酷小游戏。
 *
 * 引擎本体在 /public/meteor-runner.js，这里只做加载与 UI 包装——**不要把引擎搬进
 * src/**：它同时被 Service Worker 的离线兜底页 /offline.html 直接引用，
 * 两处共用一份文件才不会代码漂移，而且它一个字节也不会进 Next 的 bundle。
 *
 * 运行时注入 <script> 能通过 CSP：proxy.ts 的 script-src 带 'strict-dynamic'，
 * 由受信任脚本（本组件所在的 Next chunk）动态创建的 script 会继承信任。
 */

let enginePromise: Promise<void> | null = null;

/** 加载引擎。模块级缓存 Promise，避免路由来回切换时重复插 script 标签。 */
function loadEngine(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.MeteorRunner) return Promise.resolve();
  if (enginePromise) return enginePromise;

  enginePromise = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = '/meteor-runner.js';
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      enginePromise = null; // 允许下次重试，别把失败永久缓存住
      reject(new Error('meteor-runner.js 加载失败'));
    };
    document.head.appendChild(el);
  });

  return enginePromise;
}

export default function MeteorRunnerGame() {
  const t = useTranslations('MeteorRunner');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'running' | 'over' | 'victory'>('idle');
  // 引擎没加载出来时不显示"按空格开始"这种骗人的提示
  const [ready, setReady] = useState(false);
  // 引擎拉不下来时整块不渲染。留一个永远空白的黑框比没有更糟——
  // 用户不知道那是坏了还是没加载完，而这里只是 404 页的一个彩蛋
  const [failed, setFailed] = useState(false);
  // 纯触屏设备上「空格」「↓ 键」是无效指引。判断结果只能异步写入：
  // 服务端渲染不出这个值，初值写成 true 会导致 hydration 前后文案不一致
  const [touch, setTouch] = useState(false);
  // 每 100 分弹一下。存时间戳而不是布尔：连续两次里程碑之间不需要手动复位
  const [poppedAt, setPoppedAt] = useState(0);
  // 形态跃迁的短暂提示，和通关结局
  const [formKey, setFormKey] = useState('');
  const [victory, setVictory] = useState<{ type: string; gems: number } | null>(null);
  /**
   * 读屏播报。生命、宝石、治愈进度、道具全画在 canvas 里，读屏软件一个都拿不到，
   * 所以关键变化要单独往一个 live region 里写一句话。
   * 只播「变化」不播「状态」——每帧都播分数会让读屏用户没法听别的。
   *
   * **存结构化数据而不是译好的字符串**：翻译函数 t 是每次渲染新建的，
   * 在 effect 里用它会让 exhaustive-deps 要求把 t 加进依赖，
   * 而依赖一变 effect 就重跑，游戏实例会被销毁重建。翻译推迟到渲染时做。
   */
  const [announce, setAnnounce] = useState<
    { kind: 'item'; value: string } | { kind: 'lives'; value: number } | null
  >(null);

  useEffect(() => {
    let game: MeteorRunnerInstance | undefined;
    let cancelled = false;

    loadEngine()
      .then(() => {
        // 全部 setState 都在这个异步回调里，不在 effect 同步执行期——
        // 项目把 react-hooks/set-state-in-effect 设成了 error，改动时别退回同步 setState
        if (cancelled || !canvasRef.current || !window.MeteorRunner) return;

        game = new window.MeteorRunner(canvasRef.current, {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          onScore: (s, b) => {
            setScore(s);
            setBest(b);
          },
          onMilestone: () => setPoppedAt(Date.now()),
          onForm: (key) => {
            setFormKey(key);
            window.setTimeout(() => setFormKey(''), 2600);
          },
          onItem: (kind) => setAnnounce({ kind: 'item', value: kind }),
          onLives: (n) => setAnnounce({ kind: 'lives', value: n }),
          onVictory: (type, _score, gems) => setVictory({ type, gems }),
          onStateChange: (st) => {
            setPhase(st);
            if (st !== 'victory') setVictory(null);
          },
        });

        setBest(game.best);
        setTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
        setReady(true);
      })
      .catch(() => {
        // 静默降级：404 页的其余部分照常工作，只是没有游戏
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      game?.destroy();
    };
  }, []);

  if (failed) return null;

  return (
    <div className="mx-auto w-full max-w-[680px]">
      <div className="glass-card relative rounded-2xl p-3">
        <canvas
          ref={canvasRef}
          width={640}
          height={300}
          // role=application：这是可交互的游戏，报成 img 会让读屏软件以为只是张图。
          // tabindex 由引擎设置，键盘只在画布获得焦点时才被接管——绑在 window 上
          // 会让玩家在这个页面上没法用空格翻页
          role="application"
          aria-label={t('canvasLabel')}
          className={`block h-auto w-full cursor-pointer rounded-lg outline-none transition-opacity duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 motion-reduce:transition-none ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          // touch-action 关掉双击缩放，否则移动端连点跳跃会把页面放大
          style={{ aspectRatio: '640 / 300', touchAction: 'manipulation' }}
        />
        {/* 分数一行、提示一行。挤在同一行的话，窄屏上三段文字会各自折行，
            排版直接散掉——提示文案的长度还随语言和输入方式变化，更不可控 */}
        {victory && (
          // pointer-events-none：点击要能穿透到画布，否则「按一下继续」会失效
          <div
            role="status"
            className="pointer-events-none absolute inset-3 flex flex-col items-center justify-end gap-2 rounded-xl bg-gradient-to-b from-transparent via-[rgba(8,3,18,0.55)] to-[rgba(8,3,18,0.82)] p-4 pb-6 text-center"
          >
            <h2 className="t-title-2 text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]">
              {t(`victory${victory.type[0].toUpperCase()}${victory.type.slice(1)}Title`)}
            </h2>
            <p className="max-w-[30em] text-sm leading-relaxed text-white/85">
              {/* {gems} 用实际收集数填充，不写死门槛——门槛会调，「捡了多少」永远是真的 */}
              {t(`victory${victory.type[0].toUpperCase()}${victory.type.slice(1)}Sub`, {
                gems: victory.gems,
              })}
            </p>
            <p className="mt-1 text-xs text-white/65">
              {t(touch ? 'victoryGoTouch' : 'victoryGo')}
            </p>
          </div>
        )}
        <div className="t-footnote mt-2.5 flex min-h-5 items-baseline justify-between gap-3 tabular-nums text-white/70">
          <span
            aria-live="polite"
            // key 变化让动画重新播放；同一个 class 反复加是不会重播的
            key={poppedAt}
            className={poppedAt ? 'mr-pop' : undefined}
          >
            {t('score', { score })}
          </span>
          <span>{best > 0 ? t('best', { best }) : ''}</span>
        </div>
        {/* 全站约定：承载信息的文字对比度不低于 white/60。
            这行是唯一的操作说明，不能为了「更精致」调淡 */}
        {/* 读屏专用：视觉上不存在，只有辅助技术会读到 */}
        <p className="sr-only" aria-live="polite">
          {announce?.kind === 'item'
            ? t(`item${announce.value[0].toUpperCase()}${announce.value.slice(1)}`)
            : announce?.kind === 'lives'
              ? t('livesLeft', { lives: announce.value })
              : ''}
        </p>
        <p className="mt-1 min-h-[18px] text-center text-xs leading-relaxed text-white/65">
          {!ready
            ? ''
            : formKey
              ? t('formHint', { name: t(`form${formKey[0].toUpperCase()}${formKey.slice(1)}`) })
              : phase === 'over'
                ? t(touch ? 'crashedTouch' : 'crashed')
                : phase === 'idle'
                  ? t(touch ? 'hintTouch' : 'hint')
                  : ''}
        </p>
      </div>
    </div>
  );
}
