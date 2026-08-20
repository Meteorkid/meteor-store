/**
 * Meteor Runner —— 断网彩蛋小游戏引擎（谷歌小恐龙的流星版）。
 *
 * 这个文件被两个入口共用，所以**不能**写成 ES module，也不能依赖任何打包器：
 *   1. /offline.html —— Service Worker 预缓存的离线兜底页，用 <script src> 直接引；
 *   2. 404 页的 React 组件 —— 运行时动态注入 <script> 后读 window.MeteorRunner。
 * 保持成一份普通脚本，是为了让两个入口不会代码漂移，也让引擎 0 字节进 Next bundle。
 *
 * 与站点视觉的关系：全站只有暗色一套主题，所以这里的配色直接写死暗底 + 紫粉渐变，
 * 不做浅色分支。
 *
 * ## 改参数之前先读这段
 *
 * 跳跃参数、障碍尺寸、碰撞内缩、障碍间距这四组数**彼此咬合**，单独改一个不会报错，
 * 只会让某个操作悄悄失去意义（比如下蹲躲不开任何东西，或者排出跳不过去的组合）。
 * src/lib/__tests__/meteor-runner-engine.test.ts 把关键几何钉在 CI 上，改完跑它。
 */
(function () {
  'use strict';

  // ---------- 世界 ----------
  // 逻辑分辨率固定，实际像素由 devicePixelRatio 放大，避免高分屏发虚。
  var W = 640;
  /**
   * 画布高度 300、地平线 250。
   *
   * **只放大了垂直方向，宽度保持 640 不变**——障碍间距是按「滞空帧数 × speed」
   * 反推的，与画布宽度无关，所以水平几何一个数都不用动，也不用重新验证可解性。
   * 垂直放大 1.5 倍是为了让角色有 58px 的高度：角色由十几个部件组成
   * （头/发/眼/耳/触角/腮红/嘴/服装/背包/鞋），30px 根本画不下。
   */
  var H = 300;
  var GROUND_Y = 250;          // 地平线的 y。**碰撞永远以它为准**，地面起伏只是画上去的
  var RUNNER_X = 56;

  // ---------- 跳跃 ----------
  //
  // 垂直尺度放大 1.5 倍后，跳跃参数按「滞空帧数不变、跳跃高度 ×1.5」重解：
  //   滞空 = 2|JUMP_V|/GRAVITY 保持 36.1 帧（手感不变，间距公式也就不用改）
  //   高度 = JUMP_V²/(2·GRAVITY) 从 101 变成 152（跟着画布一起放大）
  // 动这两个数之前先把这两个式子一起解一遍，只改一个会让手感或间距悄悄失配。
  var GRAVITY = 0.93;
  var JUMP_V = -16.8;          // 起跳初速度
  var SECOND_JUMP_V = -13.5;   // 二段跳比首跳弱，否则二连跳能飞过整屏，障碍全失去意义
  var JUMP_CUT = 0.45;         // 松开跳跃键时把上升速度砍掉的比例（可变跳跃高度）
  var DUCK_GRAVITY = 2.85;     // 空中按 ↓ 快速下坠，用来补救跳早了的失误
  var MAX_JUMPS = 2;
  var RESTART_LOCK_MS = 400;   // 死亡后多久才接受重开输入，防止连点直接重来

  /**
   * 一次**单跳**的滞空帧数，由跳跃参数推出（v/a 上升 + 同样时长下落）。
   * 障碍间距靠它反推，所以调 JUMP_V 或 GRAVITY 不需要再去改间距。
   *
   * **故意不把二段跳算进来。** 二段跳最坏能滞空 60+ 帧，按那个反推的话障碍会稀疏到
   * 无聊。判据是「单跳能不能过」——能过就有解；二段跳是玩家主动用的额外能力，
   * 用砸了属于操作失误，何况还有 DUCK_GRAVITY 可以救。
   */
  var AIR_FRAMES = (2 * Math.abs(JUMP_V)) / GRAVITY;

  // ---------- 速度 ----------
  var SPEED_START = 5.6;
  var SPEED_MAX = 13;
  var SPEED_GAIN = 0.0012;     // 每帧加速度，约 90 秒到顶速

  // ---------- 障碍 ----------
  var FLY_BOB = 5;             // 飞行障碍的上下浮动幅度，判定与绘制共用同一个值
  /**
   * 飞行障碍的固定高度。判定盒必须「站着撞得到、蹲下撞不到」，否则下蹲就是白给的操作。
   *   站立 y∈[130,160]，蹲下 y∈[142,160]，hit() 两边各内缩 4px。
   *   取 y=127、h=18，叠加 ±3 浮动后底边落在 [142,148]：
   *   站立 134 < 底边-4 恒成立（撞），蹲下 146 < 底边-4 恒不成立（不撞）。
   * 动 FLY_BOB / 角色高度 / hit() 的 pad 任意一个，这个数就得重算。
   *
   * **只有这一档。** 曾经还有个 GROUND_Y-74 的「高空」档：站着必过、一跳必死，
   * 且能与地面障碍排出「必须同时跳和不跳」的无解组合。
   */
  var FLY_Y = GROUND_Y - 68;
  var FLY_H = 36;

  var STAND_H = 58;
  var DUCK_H = 34;
  var RUNNER_W = 44;
  // 碰撞判定往内缩的像素。跟着垂直尺度一起放大，否则放大后的判定盒
  // 相对显得更"贴脸"，玩家会觉得明明躲开了却被撞
  var HIT_PAD = 6;

  // ---------- 宝石与治愈 ----------
  var GEM_R = 9;               // 宝石半径
  var GEM_VALUE = 10;          // 每颗宝石的分值
  /**
   * 治愈进度满格所需的宝石数，也就是形态演变的分母。
   *
   * **进度是局内的，死亡重开会归零**——沿用原设计：每一局都是一次完整的治愈旅程，
   * 跨局累积会把它变成挂机养成，通关也就失去意义。
   *
   * 原设计取 1000，那是配合高频刷屏的宝石节奏。按本作实测，一局平均能收 50~120 颗，
   * 定 1000 的话玩家一辈子看不到第二种形态。150 让四次跃迁分别落在 30/60/90/120，
   * 一局普通水平能看到两三档，打得好能到 radiant。
   */
  var GEM_GOAL = 150;
  var FEAST_COOLDOWN = 1500;   // 盛宴间隔（帧），约 25 秒
  var FEAST_SPAN = 260;        // 图案的水平跨度

  // ---------- 生命与无敌 ----------
  var MAX_LIVES = 99;          // 上限。攒满是三个通关条件之一
  var REVIVE_INVULN = 90;      // 重生后的无敌帧数（约 1.5 秒）
  var INVULN_BLINK = 6;        // 无敌期间每隔几帧闪一次

  // ---------- 道具 ----------
  // 间隔按帧算（60fps）。四种道具共用一个冷却，避免同屏堆满。
  var ITEM_COOLDOWN = 900;     // 约 15 秒出一个
  var ITEM_R = 13;
  var MAGNET_FRAMES = 360;     // 磁铁持续 6 秒
  var MAGNET_RADIUS = 200;     // 吸附半径，与原设计一致
  var MAGNET_PULL = 8;         // 吸附速度
  var SHIELD_FRAMES = 300;     // 无敌持续 5 秒
  var X2_FRAMES = 300;         // 双倍分数持续 5 秒
  var ITEM_KINDS = ['heart', 'magnet', 'shield', 'x2'];

  // ---------- 通关 ----------
  // 三个维度对应三种结局，沿用原设计：攒满生命 = 治愈成功、
  // 跑够远 = 坚持到底、集够宝石 = 希望满满。
  // 数值按本作的节奏标定（原作速度上限是本作的数倍，直接照搬会永远达不到）。
  //
  // 三个门槛按自动试玩的实测水平标定（平均一局 7600 分 / 158 宝石 / 1 条命），
  // 难度递增：宝石是「打得好就能摸到」，分数要显著超常发挥，
  // 99 条命保留原作的标志性数字，作为几乎不可能的传说级成就。
  // **不要把它们调成一局必达**——通关是彩蛋的彩蛋，唾手可得就没有分量了；
  // 但也不能像原作那样按它自己的节奏照搬（10000 宝石 / 100 万米），
  // 那在本作的速度下永远达不到，整套演出就是死代码。
  var VICTORY_LIVES = MAX_LIVES;   // 99 条命：传说级
  var VICTORY_SCORE = 20000;       // 约为平均水平的 2.6 倍
  var VICTORY_GEMS = 600;          // 约为平均水平的 3.8 倍
  var VICTORY_LOCK_MS = 2500;      // 通关演出期间不接受重开/继续
  var VICTORY_KEY = 'meteor-runner-victories';

  // 只留背景和障碍在用的几个。角色的配色全部来自 FORMS，不要往这里加角色相关的颜色
  var COLORS = {
    ink: '#e9d5ff',
    dim: 'rgba(233,213,255,0.28)',
    rock: '#8b7bb8',
    rockDark: '#5b4d80',
    nebula: '#a78bfa',
  };

  /**
   * 视觉阶段：一颗流星从深空坠向地面的旅程。
   *
   * **只影响观感，不改变任何碰撞或速度参数**——难度曲线只由 speed 一条线控制，
   * 阶段纯粹是「跑了很久」的氛围反馈。往这里加 speed / gravity / gap 之类的字段，
   * 等于让难度多出一条暗线，测试会拦住。
   *
   * 阶段只描述**天空**：极光强度、流星密度、地平线的热辉颜色与亮度。
   * **角色的形象不由这里决定**——那是 FORMS（治愈形态）的事，两条线互不干扰：
   * 阶段讲「跑了多远」，形态讲「被治愈了多少」。
   */
  var PHASES = [
    {
      at: 0,
      name: 'deep',        // 深空
      aurora: 0,
      shower: 0,
      heat: 0,             // 0→1，驱动角色的"燃烧程度"和地平线热辉
      glow: [236, 72, 153],
    },
    {
      at: 500,
      name: 'shower',      // 流星雨带
      aurora: 0,
      shower: 1,
      heat: 0.15,
      glow: [236, 72, 153],
    },
    {
      at: 1500,
      name: 'aurora',      // 极光带
      aurora: 1,
      shower: 0.4,
      heat: 0.3,
      glow: [167, 139, 250],
    },
    {
      at: 3000,
      name: 'storm',       // 陨石风暴
      aurora: 0.7,
      shower: 1.6,
      heat: 0.6,
      glow: [236, 72, 153],
    },
    {
      at: 6000,
      name: 'entry',       // 进入大气层
      aurora: 0.25,
      shower: 2.2,
      heat: 1,
      glow: [239, 68, 68],
    },
  ];

  /**
   * 角色的五种形态，按治愈进度（收集到的宝石数 / GEM_GOAL）演变。
   *
   * 这是角色形象的唯一驱动，和背景阶段（PHASES）互不干扰：
   * 背景讲的是「跑了多远」，形态讲的是「被治愈了多少」。
   *
   * 配色沿用原设计：从棕褐＋暗红眼（抑郁）一路走到粉＋青眼＋满身光晕（光芒四射）。
   * mouth 是嘴型档位，0=下弯 1=平 2=微扬 3=笑 4=大笑。
   */
  var FORMS = [
    { at: 0,    key: 'depressed',  skin: '#DEB887', suit: '#8B4513', eye: '#8B0000', hair: '#C87C2A', mouth: 0, cheeks: 0,   glow: 0 },
    { at: 0.2,  key: 'healing',    skin: '#F0E68C', suit: '#87CEEB', eye: '#00CED1', hair: '#E8912F', mouth: 1, cheeks: 0,   glow: 0.2 },
    { at: 0.4,  key: 'recovering', skin: '#F5DEB3', suit: '#98FB98', eye: '#00FF7F', hair: '#FFA500', mouth: 2, cheeks: 0.5, glow: 0.4 },
    { at: 0.6,  key: 'healed',     skin: '#FFEFD5', suit: '#FFE4B5', eye: '#20B2AA', hair: '#FFB84D', mouth: 3, cheeks: 0.8, glow: 0.7 },
    { at: 0.8,  key: 'radiant',    skin: '#FFFACD', suit: '#FF69B4', eye: '#20B2AA', hair: '#FFC773', mouth: 4, cheeks: 1,   glow: 1 },
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpRGB(a, b, t, out) {
    out[0] = lerp(a[0], b[0], t) | 0;
    out[1] = lerp(a[1], b[1], t) | 0;
    out[2] = lerp(a[2], b[2], t) | 0;
    return out;
  }

  function rgba(c, alpha) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
  }

  /** 圆角矩形路径（不 fill，调用方自己决定 fill/stroke） */
  function roundRect(c, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  /** 把 #rrggbb 提亮(正)或压暗(负)，用来从主色派生描边和阴影 */
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  /** 轴对齐包围盒碰撞。命中判定统一往内缩，宁可漏判也不要冤枉玩家。 */
  function hit(a, b) {
    var pad = HIT_PAD;
    return (
      a.x + pad < b.x + b.w - pad &&
      a.x + a.w - pad > b.x + pad &&
      a.y + pad < b.y + b.h - pad &&
      a.y + a.h - pad > b.y + pad
    );
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ onScore?: Function, onStateChange?: Function, onMilestone?: Function, reducedMotion?: boolean }} [options]
   */
  function MeteorRunner(canvas, options) {
    if (!canvas) throw new Error('MeteorRunner: 需要一个 canvas 元素');
    var opts = options || {};

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // 隐私插件、企业策略或上下文耗尽都可能让 getContext 返回 null。
    // 早点抛出去，调用方能据此隐藏整块游戏区；否则会留下一个每帧抛异常的实例
    if (!this.ctx) throw new Error('MeteorRunner: 拿不到 2d 上下文');
    this.onScore = typeof opts.onScore === 'function' ? opts.onScore : null;
    this.onStateChange = typeof opts.onStateChange === 'function' ? opts.onStateChange : null;
    this.onMilestone = typeof opts.onMilestone === 'function' ? opts.onMilestone : null;
    this.onForm = typeof opts.onForm === 'function' ? opts.onForm : null;
    this.onLives = typeof opts.onLives === 'function' ? opts.onLives : null;
    this.onItem = typeof opts.onItem === 'function' ? opts.onItem : null;
    this.onVictory = typeof opts.onVictory === 'function' ? opts.onVictory : null;
    // 减弱动效时关掉视差、流星雨和尾焰抖动，但游戏本身是主动交互，不禁用
    this.reducedMotion = !!opts.reducedMotion;

    // currentPhase() 的复用容器，避免每帧新建对象
    this.phaseCache = {
      name: 'deep',
      aurora: 0,
      shower: 0,
      heat: 0,
      glow: [0, 0, 0],
    };

    this.state = 'idle';       // idle | running | over
    this.raf = 0;
    this.lastTs = 0;
    this.bound = [];
    this.duckPointer = null;   // 正按着「下蹲区」的那根手指
    this.jumpPointer = null;   // 正按着「跳跃区」的那根手指

    this.best = readBest();
    this.victories = readVictories();  // 已解锁的结局，供外部显示徽章
    this.reset();
    this.setupCanvas();
    this.bindEvents();
    this.draw();               // 先画一帧待机画面，别让用户对着空白 canvas
  }

  var BEST_KEY = 'meteor-runner-best';

  function readBest() {
    try {
      var v = parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
      return isFinite(v) && v > 0 ? v : 0;
    } catch (e) {
      return 0; // 隐私模式下 localStorage 会抛，最高分丢了不影响玩
    }
  }

  /** 通关记录：存成 'life,gems' 这样的列表，用来显示已解锁的结局 */
  function readVictories() {
    try {
      var raw = localStorage.getItem(VICTORY_KEY) || '';
      return raw ? raw.split(',').filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function recordVictory(type) {
    try {
      var list = readVictories();
      if (list.indexOf(type) === -1) {
        list.push(type);
        localStorage.setItem(VICTORY_KEY, list.join(','));
      }
    } catch (e) {
      /* 隐私模式下存不了，不影响本局演出 */
    }
  }

  function writeBest(v) {
    try {
      localStorage.setItem(BEST_KEY, String(v));
    } catch (e) {
      /* 同上，静默忽略 */
    }
  }

  MeteorRunner.prototype.reset = function () {
    this.speed = SPEED_START;
    this.score = 0;
    this.frame = 0;
    this.deadAt = 0;           // 死亡时刻的时间戳（不是帧数，见 jump 里的说明）
    this.newBest = false;
    clearTimeout(this.restartTimer);
    this.milestone = 0;        // 上一次触发里程碑的百位数
    this.flash = 0;            // 里程碑闪光的剩余帧数
    this.phase = 0;            // 当前视觉阶段
    this.phaseTarget = 0;      // 正在过渡到的阶段
    this.phaseMix = 0;         // 0→1 的过渡进度，见 currentPhase()

    this.runner = {
      x: RUNNER_X,
      y: GROUND_Y - STAND_H,
      w: RUNNER_W,
      h: STAND_H,
      vy: 0,
      ducking: false,
      onGround: true,
      jumps: 0,                // 本次离地后已经跳了几次
      blink: 0,                // 待机眨眼的剩余帧数
      intro: 0,                // 起跑入场：从屏幕外跑进来的剩余帧数
    };

    this.obstacles = [];
    this.gems = [];
    this.gemCount = 0;
    this.formKey = '';        // 上一帧的形态，用来检测跃迁
    this.form = FORMS[0];
    this.lives = 1;           // 撞一次减一条，减到 0 才真的结束
    this.invuln = 0;          // 无敌剩余帧数
    this.items = [];
    this.itemCooldown = ITEM_COOLDOWN * 0.6; // 第一个道具早一点出现
    this.magnetTimer = 0;
    this.x2Timer = 0;
    this.feastCooldown = FEAST_COOLDOWN * 0.5;
    this.victoryType = '';    // '' | life | distance | gems
    this.victoryAt = 0;
    this.victoryT = 0;        // 通关演出的进度 0→1
    this.nextGap = 60;
    this.stars = this.makeStars();
    this.clouds = this.makeClouds();
    this.shooting = [];        // 背景流星（纯装饰，不参与碰撞）
    this.ground = this.makeGround();
    this.horizonOffset = 0;
    this.moonPhase = (Math.random() * 8) | 0;
  };

  // ---------- 背景元素 ----------

  /** 背景星点。只生成一次，滚出画面就回收到右侧，避免每帧 new 一堆对象。 */
  MeteorRunner.prototype.makeStars = function () {
    var arr = [];
    for (var i = 0; i < 42; i++) {
      arr.push({
        x: Math.random() * W,
        y: Math.random() * (GROUND_Y - 36),
        r: rand(0.5, 1.6),
        depth: rand(0.15, 0.5),   // 远处的慢、近处的快，制造纵深
        tw: Math.random() * Math.PI * 2, // 闪烁相位
      });
    }
    return arr;
  };

  /** 星云带：比星点更慢的一层，给天空一点体积感。 */
  MeteorRunner.prototype.makeClouds = function () {
    var arr = [];
    for (var i = 0; i < 5; i++) {
      arr.push({
        x: Math.random() * W,
        y: rand(27, 129),
        w: rand(70, 150),
        h: rand(18, 39),
        depth: rand(0.05, 0.14),
        alpha: rand(0.05, 0.12),
      });
    }
    return arr;
  };

  /**
   * 地面起伏。**纯视觉**——碰撞永远按 GROUND_Y 那条直线算。
   * 让地面跟着起伏会让「明明踩在坡上却判定悬空」之类的问题冒出来，
   * 而这个游戏的乐趣完全不在地形。
   */
  MeteorRunner.prototype.makeGround = function () {
    var arr = [];
    var x = 0;
    while (x < W + 60) {
      arr.push({ x: x, w: rand(14, 46), h: rand(2, 6) });
      x += rand(20, 70);
    }
    return arr;
  };

  /**
   * 按画布的**实际显示尺寸**设置渲染分辨率，再把坐标系缩放回 640×200 的逻辑空间。
   *
   * 只按 W*dpr 设一次是不够的：画布是响应式宽度（CSS 100%），在宽屏上会被拉到
   * 900+ px 显示，渲染分辨率却还停在 640*dpr，结果就是糊。窗口缩放、拖到不同 DPI
   * 的外接屏也是同理，所以这个函数要能被反复调用。
   */
  MeteorRunner.prototype.setupCanvas = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2); // 封顶 2，3x 屏上再高只烧 GPU
    var rect = this.canvas.getBoundingClientRect ? this.canvas.getBoundingClientRect() : null;
    // 还没布局时 rect 宽高是 0，退回逻辑尺寸，别把 canvas 设成 0×0
    var cssW = rect && rect.width > 0 ? rect.width : W;
    var cssH = rect && rect.height > 0 ? rect.height : H;

    var pw = Math.round(cssW * dpr);
    var ph = Math.round(cssH * dpr);
    if (this.canvas.width === pw && this.canvas.height === ph) return; // 没变就别重设，会清空画布

    this.canvas.width = pw;
    this.canvas.height = ph;
    this.ctx.setTransform(pw / W, 0, 0, ph / H, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  };

  /** 显示尺寸或 DPI 变化时重设分辨率并立刻重画（重设 width 会清空画布）。 */
  MeteorRunner.prototype.handleResize = function () {
    var before = this.canvas.width;
    this.setupCanvas();
    if (this.canvas.width !== before) this.draw();
  };

  // ---------- 输入 ----------

  MeteorRunner.prototype.on = function (target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this.bound.push([target, type, fn, opts]);
  };

  MeteorRunner.prototype.bindEvents = function () {
    var self = this;

    /**
     * 键盘绑在 **canvas 上而不是 window 上**，配合 tabindex 让它只在获得焦点时生效。
     *
     * 绑 window 的话，404 页里游戏只是页面的一部分，玩家想用空格翻页会被游戏吞掉
     * （keydown 里对 Space 调了 preventDefault），键盘用户和读屏用户都会莫名其妙。
     * 现在的行为是：Tab 到画布或点一下画布才接管键盘，焦点在别处时空格照常翻页。
     */
    this.canvas.setAttribute('tabindex', '0');
    // role=application 让读屏软件进入「应用模式」，把按键原样转发给我们，
    // 而不是拿去做它自己的浏览快捷键
    if (!this.canvas.getAttribute('role')) this.canvas.setAttribute('role', 'application');

    /**
     * 键位：空格 / ↑ / W 起跳，↓ / S 下蹲。
     *
     * 用 `e.code` 而不是 `e.key` 判断字母键——code 是物理键位，
     * 不受大小写、输入法状态、键盘布局（AZERTY 之类）影响。
     * 用 e.key 的话，中文输入法开着或者按了 CapsLock 就可能收不到。
     */
    var isJumpKey = function (e) {
      return e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.key === ' ';
    };
    var isDuckKey = function (e) {
      return e.code === 'ArrowDown' || e.code === 'KeyS';
    };

    this.on(this.canvas, 'keydown', function (e) {
      // 只吞掉游戏用得上的键，别把 Tab/Enter 等无障碍导航键也拦了。
      // 键盘绑在 canvas 上、只在它获得焦点时生效，所以 W/S 不会影响页面别处的输入
      if (isJumpKey(e)) {
        e.preventDefault();
        if (!e.repeat) self.jump();   // 按住不放不该连跳
      } else if (isDuckKey(e)) {
        e.preventDefault();
        self.duck(true);
      }
    });

    this.on(this.canvas, 'keyup', function (e) {
      if (isDuckKey(e)) self.duck(false);
      if (isJumpKey(e)) self.releaseJump();
    });

    // 焦点离开画布时松开所有键位，否则「按着 ↓ 切走」会让角色一直蹲着
    this.on(this.canvas, 'blur', function () {
      self.duck(false);
      self.releaseJump();
    });

    // 指针事件一把覆盖鼠标和触屏，不用分别绑 mouse/touch。
    //
    // 画面下部约 1/3 是「按住下蹲」区，其余是跳跃区。**这个分区不是锦上添花**：
    // 飞行障碍必须下蹲才能躲，而触屏设备没有 ↓ 键——没有它，手机玩家会卡死在
    // 飞行障碍出现的那一刻，且完全不知道为什么。
    this.on(this.canvas, 'pointerdown', function (e) {
      e.preventDefault();
      // preventDefault 会阻止浏览器默认的聚焦行为，所以手动聚焦——
      // 少了这句，鼠标玩家点了画布之后键盘依然没反应
      try {
        self.canvas.focus({ preventScroll: true });
      } catch (err) {
        self.canvas.focus();
      }
      var rect = self.canvas.getBoundingClientRect();
      var localY = rect.height ? (e.clientY - rect.top) / rect.height : 0;
      if (localY > 0.62 && self.state === 'running') {
        self.duck(true);
        self.duckPointer = e.pointerId;
      } else {
        self.jump();
        self.jumpPointer = e.pointerId;
      }
    });

    // 抬手/取消都要复位，否则手指移出 canvas 再松开会让角色一直蹲着。
    // 绑在 window 上是必要的（手指可能移出画布才松开），但只认自己记下的
    // pointerId——否则玩家在页面别处点一下松手，会把正在上升的跳跃截断。
    var release = function (e) {
      if (self.duckPointer === e.pointerId) {
        self.duck(false);
        self.duckPointer = null;
      }
      if (self.jumpPointer === e.pointerId) {
        self.releaseJump();
        self.jumpPointer = null;
      }
    };
    this.on(window, 'pointerup', release);
    this.on(window, 'pointercancel', release);

    // 切到后台就暂停：否则回来时 deltaTime 巨大，角色会瞬移进障碍里判定死亡
    this.on(document, 'visibilitychange', function () {
      if (document.hidden) {
        self.pause();
        return;
      }
      // 文档隐藏期间浏览器不跑渲染步骤，ResizeObserver 的回调也就不会派发；
      // 如果窗口是在后台被拖到别的屏幕或改了大小，回来时画布分辨率还是旧的。
      // 主动校正一次比等观察器补派发更可靠。
      self.handleResize();
      // running 和 victory 都要恢复帧循环：通关演出也是靠 rAF 推进的，
      // 只判 running 的话，演出期间切一次后台回来，画面会永久停在那一帧
      if (self.state === 'running' || self.state === 'victory') self.loop();
    });

    var onResize = function () {
      self.handleResize();
    };

    // ResizeObserver 优先：画布宽度可能因为容器变化而变，那时窗口并没有 resize。
    // 环境不支持就退回 window resize，两者都没有也不影响游戏本身。
    if (typeof ResizeObserver === 'function') {
      this.ro = new ResizeObserver(onResize);
      this.ro.observe(this.canvas);
    } else {
      this.on(window, 'resize', onResize);
    }

    // 拖到不同 DPI 的屏幕上时 devicePixelRatio 会变，但不会触发 resize。
    // matchMedia 的分辨率查询是唯一能捕获这件事的通用手段。
    if (typeof window.matchMedia === 'function') {
      var dprQuery = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
      if (dprQuery && typeof dprQuery.addEventListener === 'function') {
        this.on(dprQuery, 'change', onResize);
      }

      // 系统的「减弱动效」开关可能在游戏进行中被切换
      var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery && typeof motionQuery.addEventListener === 'function') {
        this.on(motionQuery, 'change', function (e) {
          self.reducedMotion = e.matches;
        });
      }
    }
  };

  MeteorRunner.prototype.jump = function () {
    if (this.state === 'idle') {
      this.start();
      return;
    }
    if (this.state === 'victory') {
      // 演出放完才接受输入，然后带着全部进度继续跑（无尽模式）
      if (Date.now() - this.victoryAt > VICTORY_LOCK_MS) {
        this.setState('running');
        this.lastTs = 0;
        this.loop();
      }
      return;
    }
    if (this.state === 'over') {
      // 死亡后短暂锁定，避免玩家还在连点跳跃就被立刻重开。
      //
      // **必须用时间戳，不能用帧数。** state 变成 over 之后 tick 就不再排下一帧，
      // update 也直接 return，于是 frame 永远冻结在死亡那一刻——用
      // `frame - deadAt` 判断的话差值恒为 0，游戏结束后永远重开不了，只能刷新页面。
      if (Date.now() - this.deadAt > RESTART_LOCK_MS) this.start();
      return;
    }
    var r = this.runner;
    if (r.jumps >= MAX_JUMPS) return;

    // 二段跳比首跳弱，且从当前速度重新起算——不这么做的话，在下落末段补一跳
    // 等于白送一次满跳，滞空能翻倍
    r.vy = r.jumps === 0 ? JUMP_V : SECOND_JUMP_V;
    r.jumps++;
    r.onGround = false;
    r.ducking = false; // 起跳自动取消下蹲，否则蹲着跳会卡在矮判定盒
  };

  /**
   * 松开跳跃键：把还在上升的速度砍掉一截，实现「轻点小跳、按住大跳」。
   *
   * 这个方向是安全的——它只会让滞空**变短**，最大滞空仍是满按那一次，
   * 所以 AIR_FRAMES 和障碍间距完全不受影响。反过来做（滑翔、减缓下落）
   * 会拉长最大滞空，逼着障碍间距一起变大，那才是要小心的。
   */
  MeteorRunner.prototype.releaseJump = function () {
    var r = this.runner;
    if (r.vy < 0) r.vy *= JUMP_CUT;
  };

  MeteorRunner.prototype.duck = function (on) {
    if (this.state !== 'running') return;
    this.runner.ducking = on;
  };

  // ---------- 生命周期 ----------

  MeteorRunner.prototype.setState = function (s) {
    this.state = s;
    if (this.onStateChange) this.onStateChange(s);
  };

  MeteorRunner.prototype.start = function () {
    this.reset();
    this.runner.intro = this.reducedMotion ? 0 : 26; // 起跑入场
    if (this.runner.intro) this.runner.x = -RUNNER_W;
    this.setState('running');
    // 立刻把 HUD 归零：onScore 只在整数分变化时才回调，不主动通知一次的话，
    // 重开的头几帧 HUD 上还挂着上一局的分数
    if (this.onScore) this.onScore(0, this.best);
    this.lastTs = 0;
    this.loop();
  };

  MeteorRunner.prototype.pause = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.lastTs = 0;
  };

  MeteorRunner.prototype.loop = function () {
    var self = this;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(function (ts) {
      self.tick(ts);
    });
  };

  MeteorRunner.prototype.tick = function (ts) {
    // 以 60fps 为基准做时间缩放，高刷屏上速度才不会翻倍。
    // 上限 2 帧：切后台回来或长卡顿时宁可慢放，也不要一次跳过整个障碍物。
    var dt = this.lastTs ? Math.min((ts - this.lastTs) / 16.667, 2) : 1;
    this.lastTs = ts;

    // 帧循环里抛出的异常会让 rAF 链直接断掉，表现是画面定格、按键没反应，
    // 而玩家完全不知道发生了什么。兜住它，当作一次「撞车」结束本局——
    // 至少重启图标会亮起来，玩家能自己重开。
    try {
      this.update(dt);
      this.draw();
    } catch (err) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('[MeteorRunner] 帧循环出错，本局中止', err);
      }
      this.pause();
      if (this.state === 'running') {
        this.deadAt = Date.now();
        this.setState('over');
      }
      return;
    }

    if (this.state === 'running' || this.state === 'victory') this.loop();
  };

  MeteorRunner.prototype.update = function (dt) {
    // 通关演出：世界停下，只推进演出进度和背景装饰
    if (this.state === 'victory') {
      this.frame += dt;
      this.victoryT = Math.min(1, this.victoryT + 0.012 * dt);
      this.updateBackground(this.speed * 0.25 * dt, dt);
      return;
    }
    if (this.state !== 'running') return;

    this.frame += dt;
    if (this.invuln > 0) this.invuln -= dt;
    if (this.magnetTimer > 0) this.magnetTimer -= dt;
    if (this.x2Timer > 0) this.x2Timer -= dt;
    this.speed = Math.min(SPEED_MAX, this.speed + SPEED_GAIN * dt);
    var move = this.speed * dt;
    this.horizonOffset = (this.horizonOffset + move) % 40;
    if (this.flash > 0) this.flash -= dt;

    var r = this.runner;

    // 起跑入场：角色从屏幕外跑进来，这段时间不生成障碍也不计分
    if (r.intro > 0) {
      r.intro -= dt;
      r.x = Math.min(RUNNER_X, r.x + (RUNNER_X + RUNNER_W) / 26 * dt);
      if (r.intro <= 0) r.x = RUNNER_X;
      this.updateBackground(move, dt);
      return;
    }

    // 角色物理
    var g = !r.onGround && r.ducking ? DUCK_GRAVITY : GRAVITY;
    r.vy += g * dt;
    r.y += r.vy * dt;
    r.h = r.ducking && r.onGround ? DUCK_H : STAND_H;
    // 条件里的 r.onGround 不能去掉：变矮之后 y 不动的话，角色只是把腿收了，
    // 判定盒的上沿还停在站立高度——蹲下就永远躲不开任何东西。
    // 必须在地面时重新贴地，让缩掉的 12px 从头顶让出来。
    if (r.onGround || r.y + r.h >= GROUND_Y) {
      r.y = GROUND_Y - r.h;
      r.vy = 0;
      r.onGround = true;
      r.jumps = 0;
    }

    // 待机眨眼
    if (r.blink > 0) r.blink -= dt;
    else if (Math.random() < 0.004 * dt) r.blink = 6;

    this.updateBackground(move, dt);

    // 障碍推进与回收
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      var o = this.obstacles[i];
      o.x -= move;
      if (o.flying) o.bob += 0.12 * dt;
      if (o.x + o.w < 0) {
        this.obstacles.splice(i, 1);
        continue;
      }
      var box = { x: o.x, y: o.flying ? o.y + Math.sin(o.bob) * FLY_BOB : o.y, w: o.w, h: o.h };
      if (this.invuln <= 0 && hit(r, box)) {
        // 还有命就重生：扣一条、给一段无敌、把撞上的这个障碍清掉。
        // **必须清掉障碍**——否则重生后角色还站在它身上，无敌一结束立刻再撞一次，
        // 连续掉命且玩家完全没有反应机会
        this.lives--;
        if (this.lives > 0) {
          this.obstacles.splice(i, 1);
          this.invuln = REVIVE_INVULN;
          this.flash = 14;
          if (this.onLives) this.onLives(this.lives);
          continue;
        }
        this.gameOver();
        return;
      }
    }

    this.updateGems(move, dt);
    this.updateItems(move, dt);
    this.spawn(dt);

    var prev = Math.floor(this.score);
    this.score += 0.12 * this.speed * dt;
    var now = Math.floor(this.score);
    if (this.onScore && now !== prev) this.onScore(now, this.best);

    this.updateForm();
    this.checkVictory();

    // 每 100 分一次里程碑：闪一下，给长局一点节奏感
    var hundreds = Math.floor(now / 100);
    if (hundreds > this.milestone) {
      this.milestone = hundreds;
      this.flash = 18;
      if (this.onMilestone) this.onMilestone(now);
    }

    // 视觉阶段推进
    var target = 0;
    for (var p = PHASES.length - 1; p >= 0; p--) {
      if (now >= PHASES[p].at) {
        target = p;
        break;
      }
    }
    if (target !== this.phaseTarget) {
      this.phaseTarget = target;
      this.phaseMix = 0;
    }
    if (this.phaseTarget !== this.phase) {
      this.phaseMix = Math.min(1, this.phaseMix + 0.008 * dt); // 约 2 秒走完
      if (this.phaseMix >= 1) {
        this.phase = this.phaseTarget;
        this.phaseMix = 0;
      }
    }
  };

  /**
   * 当前生效的视觉参数，在旧阶段和目标阶段之间线性插值。
   *
   * 早先这里是「攒够帧数直接换一个 PHASES 条目」，于是极光会凭空冒出来、
   * 流星密度会阶跃。阶段本来就是给长局的氛围奖励，突变反而像画面出了故障。
   *
   * 结果写进一个复用的对象里：这个函数每帧被调用好几次，每次新建对象
   * 会给 GC 添无谓的压力。**调用方不要缓存返回值**，它下一帧就被改写了。
   */
  MeteorRunner.prototype.currentPhase = function () {
    var a = PHASES[this.phase];
    var b = PHASES[this.phaseTarget];
    var out = this.phaseCache;
    var m = a === b ? 0 : this.phaseMix;

    out.name = m > 0.5 ? b.name : a.name;
    out.aurora = lerp(a.aurora, b.aurora, m);
    out.shower = lerp(a.shower, b.shower, m);
    out.heat = lerp(a.heat, b.heat, m);
    lerpRGB(a.glow, b.glow, m, out.glow);
    return out;
  };

  MeteorRunner.prototype.updateBackground = function (move, dt) {
    var i, st;

    if (!this.reducedMotion) {
      for (i = 0; i < this.stars.length; i++) {
        st = this.stars[i];
        st.x -= move * st.depth;
        st.tw += 0.05 * dt;
        if (st.x < -2) {
          st.x = W + 2;
          st.y = Math.random() * (GROUND_Y - 36);
        }
      }
      for (i = 0; i < this.clouds.length; i++) {
        st = this.clouds[i];
        st.x -= move * st.depth;
        if (st.x + st.w < 0) {
          st.x = W + rand(0, 80);
          st.y = rand(27, 129);
        }
      }
    }

    for (i = 0; i < this.ground.length; i++) {
      this.ground[i].x -= move;
      if (this.ground[i].x + this.ground[i].w < 0) {
        this.ground[i].x += W + 60;
        this.ground[i].w = rand(14, 46);
        this.ground[i].h = rand(2, 6);
      }
    }

    // 背景流星：纯装饰，密度由当前阶段决定
    var ph = this.currentPhase();
    if (!this.reducedMotion && ph.shower > 0 && Math.random() < 0.03 * ph.shower * dt) {
      this.shooting.push({ x: rand(W * 0.3, W + 60), y: rand(-15, 105), len: rand(30, 84), v: rand(5, 10), life: 1 });
    }
    for (i = this.shooting.length - 1; i >= 0; i--) {
      var s = this.shooting[i];
      s.x -= s.v * dt;
      s.y += s.v * 0.45 * dt;
      s.life -= 0.01 * dt;
      if (s.life <= 0 || s.x + s.len < 0) this.shooting.splice(i, 1);
    }
  };

  /**
   * 宝石推进与收集。
   *
   * 判定比障碍**宽容**：障碍的 hit() 往内缩（宁可漏判也不冤枉玩家），
   * 宝石反过来往外扩——「差一点没吃到」比「差一点被撞到」更让人烦躁，
   * 而吃不到的代价只是少几分。
   */
  MeteorRunner.prototype.updateGems = function (move, dt) {
    var r = this.runner;
    var cx = r.x + r.w / 2;
    var cy = r.y + r.h / 2;
    for (var i = this.gems.length - 1; i >= 0; i--) {
      var g = this.gems[i];
      g.x -= move;
      g.spin += 0.1 * dt;

      // 磁铁：把半径内的宝石朝角色拉。用归一化方向向量，
      // 距离越近拉得越快，看起来像被吸住而不是匀速平移
      if (this.magnetTimer > 0 && !g.taken) {
        var dx = cx - g.x;
        var dy = cy - g.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAGNET_RADIUS && dist > 0.5) {
          var pull = MAGNET_PULL * (1 + (1 - dist / MAGNET_RADIUS)) * dt;
          g.x += (dx / dist) * pull;
          g.y += (dy / dist) * pull;
        }
      }

      if (g.taken) {
        // 收集后向上飘一小段再消失，给一点「吃到了」的确认
        g.pop -= dt;
        g.y -= 1.2 * dt;
        if (g.pop <= 0) this.gems.splice(i, 1);
        continue;
      }

      if (g.x + GEM_R < 0) {
        this.gems.splice(i, 1);
        continue;
      }

      var pad = 4; // 往外扩，判定比看起来更宽松
      if (
        g.x + GEM_R + pad > r.x &&
        g.x - GEM_R - pad < r.x + r.w &&
        g.y + GEM_R + pad > r.y &&
        g.y - GEM_R - pad < r.y + r.h
      ) {
        g.taken = true;
        g.pop = 16;
        this.gemCount++;
        this.score += GEM_VALUE * (this.x2Timer > 0 ? 2 : 1);
      }
    }
  };

  /**
   * 道具推进与拾取。
   *
   * 四种道具共用一个冷却，**同屏最多一个**：它们的效果都是全局性的
   * （加命 / 吸附 / 无敌 / 双倍），几个同时生效会让局面失控，
   * 而失控带来的不是爽快而是「不知道刚才发生了什么」。
   */
  MeteorRunner.prototype.updateItems = function (move, dt) {
    var r = this.runner;
    this.itemCooldown -= dt;

    for (var i = this.items.length - 1; i >= 0; i--) {
      var it = this.items[i];
      it.x -= move;
      it.spin += 0.06 * dt;
      it.bob += 0.07 * dt;

      if (it.taken) {
        it.pop -= dt;
        it.y -= 1.4 * dt;
        if (it.pop <= 0) this.items.splice(i, 1);
        continue;
      }
      if (it.x + ITEM_R < 0) {
        this.items.splice(i, 1);
        continue;
      }

      var iy = it.y + Math.sin(it.bob) * 5;
      var pad = 5;
      if (
        it.x + ITEM_R + pad > r.x &&
        it.x - ITEM_R - pad < r.x + r.w &&
        iy + ITEM_R + pad > r.y &&
        iy - ITEM_R - pad < r.y + r.h
      ) {
        it.taken = true;
        it.pop = 18;
        this.applyItem(it.kind);
      }
    }

    // 生成：只在场上没有道具时才出，且要有冷却
    if (this.itemCooldown <= 0 && this.items.length === 0 && this.score > 120) {
      this.itemCooldown = ITEM_COOLDOWN + rand(-120, 240);
      var kind = pick(ITEM_KINDS);
      // 满命时不再发爱心，换成别的，免得道具白给
      if (kind === 'heart' && this.lives >= MAX_LIVES) kind = 'shield';
      this.items.push({
        x: W + 30,
        y: GROUND_Y - rand(70, 130), // 在跳跃够得着的高度
        kind: kind,
        spin: 0,
        bob: Math.random() * Math.PI * 2,
        taken: false,
        pop: 0,
      });
    }
  };

  MeteorRunner.prototype.applyItem = function (kind) {
    if (kind === 'heart') {
      this.lives = Math.min(this.lives + 1, MAX_LIVES);
      if (this.onLives) this.onLives(this.lives);
    } else if (kind === 'magnet') {
      this.magnetTimer = MAGNET_FRAMES;
    } else if (kind === 'shield') {
      this.invuln = Math.max(this.invuln, SHIELD_FRAMES);
    } else if (kind === 'x2') {
      this.x2Timer = X2_FRAMES;
    }
    this.flash = 12;
    if (this.onItem) this.onItem(kind);
  };

  /** 治愈进度 0→1，由收集到的宝石数决定。角色形态的唯一驱动。 */
  MeteorRunner.prototype.healProgress = function () {
    return Math.min(this.gemCount / GEM_GOAL, 1);
  };

  /**
   * 按治愈进度推进形态。**必须在 update 里调用，不能只在绘制时算。**
   *
   * 早先这段逻辑挂在 drawRunner 里，于是形态成了「画一帧才更新一次」的东西：
   * 任何不绘制的路径（后台暂停、纯逻辑推进、自动化验证）都会让跃迁被整段跳过，
   * onForm 回调也就不会发。形态是叙事主线，它属于逻辑层。
   */
  MeteorRunner.prototype.updateForm = function () {
    var p = this.healProgress();
    var f = FORMS[0];
    for (var i = FORMS.length - 1; i >= 0; i--) {
      if (p >= FORMS[i].at) {
        f = FORMS[i];
        break;
      }
    }
    if (f.key !== this.formKey) {
      // 首次进入不算跃迁（开局本来就是 depressed），之后每跨一档给一次反馈
      if (this.formKey) {
        this.flash = 22;
        if (this.onForm) this.onForm(f.key, this.gemCount);
      }
      this.formKey = f.key;
    }
    this.form = f;
    return f;
  };

  /** 当前形态，绘制层只读这个结果 */
  MeteorRunner.prototype.currentForm = function () {
    return this.form || FORMS[0];
  };

  /**
   * 沿「跨过某个障碍的跳跃弧线」摆一串宝石。
   *
   * **宝石绝不能引诱玩家去撞障碍**，所以不摆在地面障碍的正前方或正后方低处，
   * 而是铺在跳过去的轨迹上——吃到宝石等于跳得准，两个目标一致而不是冲突。
   * 弧线峰值压在单跳最高点之下，保证一次普通跳跃就能全部吃到，不必二段跳。
   */
  MeteorRunner.prototype.spawnGemArc = function (centerX, clearTop) {
    var n = 5;
    // 用**真实的跳跃方程**取样，而不是随手画一条抛物线。
    //
    // 手画的弧线跨度是个固定值，而一次跳跃的水平距离是 AIR_FRAMES × speed
    // （本作 202~470px，随速度变化）——两者对不上时玩家会直接飞过整条弧线，
    // 只在中间擦到一两颗。按跳跃方程生成，起跳时机对了就能一颗不漏地吃完，
    // 「吃到宝石 = 跳得准」才真的成立。
    //
    // 取样区间避开起跳和落地的两端（那里贴着地面，跟障碍抢位置），
    // 只取中段 0.18~0.82。
    var startX = centerX - (AIR_FRAMES * this.speed) / 2;
    var groundTop = GROUND_Y - STAND_H;
    for (var i = 0; i < n; i++) {
      var f = (0.18 + (0.64 * i) / (n - 1)) * AIR_FRAMES; // 第几帧
      var dy = JUMP_V * f + 0.5 * GRAVITY * f * f;        // 该帧的垂直位移
      this.pushGem(startX + f * this.speed, groundTop + dy + STAND_H / 2);
    }
    // 障碍很高时把整条弧线抬一点，免得贴着障碍顶穿过去
    if (clearTop < GROUND_Y - 55) {
      for (var k = this.gems.length - n; k < this.gems.length; k++) {
        this.gems[k].y = Math.max(GROUND_Y - 150, this.gems[k].y - 14);
      }
    }
  };

  /** 平地上的一串宝石，摆在两个障碍之间的安全区 */
  MeteorRunner.prototype.spawnGemLine = function (startX) {
    var n = 3 + ((Math.random() * 3) | 0);
    for (var i = 0; i < n; i++) {
      this.gems.push({
        x: startX + i * 30,
        y: GROUND_Y - 34,
        spin: Math.random() * Math.PI,
        taken: false,
        pop: 0,
      });
    }
  };

  MeteorRunner.prototype.spawn = function (dt) {
    // 宝石盛宴优先：到点了就空出一段跑道摆图案，这段里不生成障碍。
    // **必须把 nextGap 推到图案之后**，否则障碍会插进图案中间，
    // 玩家一边要认图案一边要躲障碍，两件事都做不好
    this.feastCooldown -= dt;
    if (this.feastCooldown <= 0 && this.score > 150) {
      this.feastCooldown = FEAST_COOLDOWN + rand(-200, 400);
      this.spawnFeast();
      this.nextGap = FEAST_SPAN + 140;
      return;
    }

    this.nextGap -= this.speed * dt;
    if (this.nextGap > 0) return;

    /**
     * 间距必须由**跳跃滞空距离**反推，不能拍脑袋给个线性式子。
     *
     * 一次单跳滞空 AIR_FRAMES 帧，水平吃掉 AIR_FRAMES * speed 像素。若下一个障碍
     * 落在这段距离之内，玩家跳过前一个后还没落地，就没有第二次起跳的机会——
     * 只能眼睁睁撞上去。这不是难，是无解。
     * 历史教训：曾经写成 62 + speed*13（速度 5.6 时约 137px），而当时滞空距离是
     * 202px，于是「跳过一个高障碍后必死」的组合会稳定出现，自动试玩活不过 400 分。
     *
     * 0.72 的系数是留给玩家的操作空间：起跳可以提前，落地后也还有余量。
     */
    var minGap = AIR_FRAMES * this.speed * 0.72 + 42;
    this.nextGap = rand(minGap, minGap + 190);

    // 飞行障碍从 200 分开始掺，太早出现会劝退
    var flying = this.score > 200 && Math.random() < 0.28;

    if (flying) {
      var pair = this.score > 1200 && Math.random() < 0.3;
      this.obstacles.push(this.makeFlyer(W + 10));
      if (pair) this.obstacles.push(this.makeFlyer(W + 10 + rand(52, 84)));
      // 飞行障碍额外撑开间距：紧跟在地面障碍后面的话，玩家还在跳跃滞空中，
      // 落不了地也就蹲不下来
      this.nextGap += 40;
      // 飞行障碍是靠下蹲躲的，宝石摆在它后面的空地上，蹲完起身正好吃到
      if (Math.random() < 0.45) this.spawnGemLine(W + 150);
    } else {
      this.spawnRocks();
    }
  };

  /**
   * 宝石盛宴：一段没有障碍的跑道上，用宝石摆出一个图案。
   *
   * 图案的垂直范围压在 [GROUND_Y-150, GROUND_Y-24] 之内——上界是单跳能够到的
   * 最高点，下界贴着跑动高度。**超出这个范围的宝石玩家根本吃不到**，
   * 画得再好看也只是嘲讽。
   */
  MeteorRunner.prototype.spawnFeast = function () {
    var kind = pick(['wave', 'arc', 'heart', 'spiral', 'stairs', 'star']);
    var x0 = W + 40;
    var top = GROUND_Y - 150;
    var bottom = GROUND_Y - 24;
    var midY = (top + bottom) / 2;
    var i, t, gx, gy;

    if (kind === 'wave') {
      for (i = 0; i < 14; i++) {
        t = i / 13;
        this.pushGem(x0 + FEAST_SPAN * t, midY + Math.sin(t * Math.PI * 2.5) * 52);
      }
    } else if (kind === 'arc') {
      for (i = 0; i < 11; i++) {
        t = i / 10;
        this.pushGem(x0 + FEAST_SPAN * t, bottom - (1 - Math.pow(2 * t - 1, 2)) * (bottom - top));
      }
    } else if (kind === 'heart') {
      // 参数方程画心，再压进可达范围
      for (i = 0; i < 16; i++) {
        var a = (Math.PI * 2 * i) / 16;
        var hx = 16 * Math.pow(Math.sin(a), 3);
        var hy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
        this.pushGem(x0 + FEAST_SPAN / 2 + hx * 4.2, midY - hy * 3.4);
      }
    } else if (kind === 'spiral') {
      for (i = 0; i < 16; i++) {
        t = i / 15;
        var ang = t * Math.PI * 3.2;
        var rad = 14 + t * 46;
        this.pushGem(x0 + FEAST_SPAN / 2 + Math.cos(ang) * rad, midY + Math.sin(ang) * rad * 0.62);
      }
    } else if (kind === 'stairs') {
      // 阶梯：鼓励用二段跳一路吃上去
      for (i = 0; i < 12; i++) {
        t = i / 11;
        this.pushGem(x0 + FEAST_SPAN * t, bottom - Math.floor(t * 4) * 30);
      }
    } else {
      // 五角星轮廓
      for (i = 0; i < 15; i++) {
        t = i / 15;
        var sa = t * Math.PI * 4 - Math.PI / 2; // 绕两圈画出五角
        this.pushGem(x0 + FEAST_SPAN / 2 + Math.cos(sa) * 58, midY + Math.sin(sa) * 52);
      }
    }
  };

  /** 摆一颗宝石，并把它钳进「玩家够得到」的垂直范围 */
  MeteorRunner.prototype.pushGem = function (x, y) {
    this.gems.push({
      x: x,
      y: Math.max(GROUND_Y - 150, Math.min(GROUND_Y - 22, y)),
      spin: Math.random() * Math.PI,
      taken: false,
      pop: 0,
    });
  };

  MeteorRunner.prototype.makeFlyer = function (x) {
    return { x: x, y: FLY_Y, w: 40, h: FLY_H, flying: true, bob: Math.random() * Math.PI * 2, spin: Math.random() * Math.PI };
  };

  /**
   * 地面陨石柱。三种体型 × 1~3 连，组合出不同的「跨度」，
   * 让玩家需要判断起跳时机而不是无脑点。
   *
   * 一组的总跨度有上限：跨度接近一次跳跃的水平距离时就成了无解，
   * 所以宽体型只出单个，小体型才允许三连。
   */
  MeteorRunner.prototype.spawnRocks = function () {
    var kind = pick([
      { w: 12, h: [36, 48], max: 3 },  // 小
      { w: 16, h: [45, 60], max: 2 },  // 中
      { w: 24, h: [51, 66], max: 1 },  // 宽，只出单个
    ]);
    var n = 1 + ((Math.random() * kind.max) | 0);
    var x = W + 10;
    var startX = x;
    var top = GROUND_Y;
    for (var i = 0; i < n; i++) {
      var h = rand(kind.h[0], kind.h[1]);
      var w = kind.w + rand(-2, 3);
      this.obstacles.push({ x: x, y: GROUND_Y - h, w: w, h: h, flying: false, bob: 0, spin: 0 });
      top = Math.min(top, GROUND_Y - h);
      x += w + rand(3, 9); // 组内紧挨着，当成一个整体跨过去
    }

    // 一半概率在这组障碍的跳跃弧线上摆宝石：跳得准就顺路吃到，
    // 两个目标一致。**不要改成摆在障碍前后的地面上**，那会变成
    // 「想吃宝石就得贴着障碍跑」，等于用奖励引诱玩家送死
    if (Math.random() < 0.7) {
      this.spawnGemArc((startX + x) / 2, top);
    }
  };

  /**
   * 通关判定。三个条件互斥地只触发一次——`victoryType` 一旦有值就不再进来，
   * 否则同一局里达成第二个条件会把演出打断重放。
   */
  MeteorRunner.prototype.checkVictory = function () {
    if (this.victoryType) return;
    var type = '';
    if (this.lives >= VICTORY_LIVES) type = 'life';
    else if (this.score >= VICTORY_SCORE) type = 'distance';
    else if (this.gemCount >= VICTORY_GEMS) type = 'gems';
    if (!type) return;

    this.victoryType = type;
    this.victoryAt = Date.now();
    this.victoryT = 0;
    this.setState('victory');
    recordVictory(type);
    // 写完 localStorage 要同步实例上的副本，否则外部读 game.victories 拿到的是旧值
    this.victories = readVictories();
    if (this.onVictory) this.onVictory(type, Math.floor(this.score), this.gemCount);
    // 演出期间画面还要动，所以不停帧——update 里 victory 分支只推进演出
    this.loop();
  };

  MeteorRunner.prototype.gameOver = function () {
    this.deadAt = Date.now();
    var s = Math.floor(this.score);
    // 第一局的 best 是 0，那时刷新纪录没有意义，别给个空欢喜
    this.newBest = this.best > 0 && s > this.best;
    if (s > this.best) {
      this.best = s;
      writeBest(s);
    }
    this.setState('over');
    if (this.onScore) this.onScore(s, this.best);
    this.draw();

    // over 状态下 rAF 已经停了，不补这一次重绘的话，重启图标会一直停在
    // 「暗着」的那一帧，锁定期结束的反馈就丢了
    var self = this;
    clearTimeout(this.restartTimer);
    this.restartTimer = setTimeout(function () {
      if (self.state === 'over') self.draw();
    }, RESTART_LOCK_MS + 20);
  };

  // ---------- 绘制 ----------

  MeteorRunner.prototype.draw = function () {
    var c = this.ctx;
    c.clearRect(0, 0, W, H);

    this.drawSky();
    this.drawGround();

    for (var j = 0; j < this.obstacles.length; j++) {
      this.drawObstacle(this.obstacles[j]);
    }

    this.drawGems();
    this.drawItems();
    // 通关演出会把角色搬到画面中央重画一遍，这里跳过常规绘制，
    // 否则原位置会留下一个"分身"
    if (this.state !== 'victory') this.drawRunner();
    this.drawHud();

    if (this.state === 'victory') this.drawVictory();
    if (this.state === 'over') this.drawGameOver();

    // 里程碑闪光：整屏压一层极淡的白，一闪而过。
    // reducedMotion 下必须一并关掉——全屏闪烁正是这个设置要规避的东西，
    // 只关 CSS 动画而留着 canvas 里的闪光等于没关
    if (this.flash > 0 && !this.reducedMotion) {
      c.save();
      c.globalAlpha = Math.min(0.14, (this.flash / 18) * 0.14);
      c.fillStyle = '#fff';
      c.fillRect(0, 0, W, H);
      c.restore();
    }
  };

  /**
   * 画布内的状态区：生命、宝石数、生效中的道具。
   *
   * 放在 canvas 里而不是 DOM HUD 里，是因为这几项在游戏进行中会频繁变化，
   * 走 DOM 意味着每次变化都要触发一轮 React 渲染；而且它们和画面是一体的，
   * 玩家眼睛不用离开画布。DOM 那一行只留分数和最高分。
   */
  MeteorRunner.prototype.drawHud = function () {
    var c = this.ctx;
    c.save();

    // ---- 生命 ----
    var shown = Math.min(this.lives, 5);
    for (var i = 0; i < shown; i++) {
      var hx = 14 + i * 15;
      c.fillStyle = '#fb7185';
      c.beginPath();
      c.moveTo(hx, 18);
      c.bezierCurveTo(hx - 6, 12, hx - 3.5, 6, hx, 9.5);
      c.bezierCurveTo(hx + 3.5, 6, hx + 6, 12, hx, 18);
      c.fill();
    }
    if (this.lives > 5) {
      c.fillStyle = 'rgba(251,113,133,0.9)';
      c.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      c.textAlign = 'left';
      c.textBaseline = 'middle';
      c.fillText('×' + this.lives, 14 + 5 * 15, 13);
    }

    // ---- 宝石数 + 治愈进度条 ----
    c.fillStyle = '#38bdf8';
    c.beginPath();
    c.moveTo(18, 28);
    c.lineTo(23, 34);
    c.lineTo(18, 40);
    c.lineTo(13, 34);
    c.closePath();
    c.fill();

    c.fillStyle = 'rgba(224,242,254,0.9)';
    c.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillText(String(this.gemCount), 28, 34);

    // 治愈进度条：形态跃迁的节点画成刻度，让玩家看得见「下一档还有多远」
    var bw = 76;
    var bx = 58;
    var by = 31;
    c.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(c, bx, by, bw, 6, 3);
    c.fill();
    c.fillStyle = '#7dd3fc';
    roundRect(c, bx, by, Math.max(2, bw * this.healProgress()), 6, 3);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)';
    for (var k = 1; k < FORMS.length; k++) {
      c.fillRect(bx + bw * FORMS[k].at, by, 1, 6);
    }

    // ---- 生效中的道具：图标 + 剩余时间条 ----
    var active = [];
    if (this.magnetTimer > 0) active.push(['磁', '#f87171', this.magnetTimer / MAGNET_FRAMES]);
    if (this.invuln > 0) active.push(['盾', '#a78bfa', Math.min(1, this.invuln / SHIELD_FRAMES)]);
    if (this.x2Timer > 0) active.push(['×2', '#fbbf24', this.x2Timer / X2_FRAMES]);

    for (var a = 0; a < active.length; a++) {
      var ax = W - 44;
      var ay = 14 + a * 18;
      c.fillStyle = 'rgba(12,6,26,0.7)';
      roundRect(c, ax - 6, ay - 7, 44, 14, 7);
      c.fill();
      c.fillStyle = active[a][1];
      c.font = 'bold 9px ui-sans-serif, system-ui, sans-serif';
      c.textAlign = 'left';
      c.fillText(active[a][0], ax - 2, ay);
      // 剩余时间条
      c.fillStyle = 'rgba(255,255,255,0.15)';
      c.fillRect(ax + 13, ay - 2, 22, 4);
      c.fillStyle = active[a][1];
      c.fillRect(ax + 13, ay - 2, 22 * active[a][2], 4);
    }

    c.restore();
  };

  /**
   * 通关演出。
   *
   * 只画视觉，**不画文字**——三种结局各有标题和副标题，写进 canvas 就得在引擎里
   * 塞一份 i18n。文案由 onVictory 回调交给外层（离线页用引擎的 TEXT，
   * 404 页用 next-intl），两边各自用自己的机制翻译。
   */
  MeteorRunner.prototype.drawVictory = function () {
    var c = this.ctx;
    var t = this.victoryT;
    var r = this.runner;
    var ease = 1 - Math.pow(1 - t, 3); // 缓出，收尾更稳

    c.save();

    // 聚光而不是泛白：中心提亮突出角色，四周压暗。
    // 早先这里是整屏铺一层白，结果和上面那层暗色的文字覆盖层叠成中灰，
    // 白字压在灰底上读不清——演出再好看，看不清文案就白做了。
    var wash = c.createRadialGradient(W / 2, GROUND_Y - 70, 20, W / 2, GROUND_Y - 70, W * 0.62);
    wash.addColorStop(0, 'rgba(255,244,250,' + (0.42 * ease).toFixed(3) + ')');
    wash.addColorStop(0.45, 'rgba(120,80,160,' + (0.3 * ease).toFixed(3) + ')');
    wash.addColorStop(1, 'rgba(8,3,18,' + (0.82 * ease).toFixed(3) + ')');
    c.fillStyle = wash;
    c.fillRect(0, 0, W, H);

    // 角色升到画面中央并放大
    var tx = W / 2;
    var ty = GROUND_Y - 40 - 60 * ease;
    var scale = 1 + 0.9 * ease;

    // 光芒放射
    if (!this.reducedMotion) {
      c.save();
      c.translate(tx, ty);
      c.globalAlpha = 0.5 * ease;
      for (var i = 0; i < 12; i++) {
        var ang = (Math.PI * 2 * i) / 12 + this.frame * 0.006;
        var len = 60 + Math.sin(this.frame * 0.05 + i) * 18;
        var g2 = c.createLinearGradient(0, 0, Math.cos(ang) * len, Math.sin(ang) * len);
        g2.addColorStop(0, 'rgba(255,214,240,0.8)');
        g2.addColorStop(1, 'rgba(255,214,240,0)');
        c.strokeStyle = g2;
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
        c.stroke();
      }
      c.restore();
    }

    // 环绕的宝石
    c.globalAlpha = ease;
    for (var k = 0; k < 8; k++) {
      var a2 = (Math.PI * 2 * k) / 8 - this.frame * 0.02;
      var rad = 52 + Math.sin(this.frame * 0.04 + k) * 6;
      var gx = tx + Math.cos(a2) * rad;
      var gy = ty + Math.sin(a2) * rad * 0.55;
      c.fillStyle = '#38bdf8';
      c.beginPath();
      c.moveTo(gx, gy - 7);
      c.lineTo(gx + 5, gy);
      c.lineTo(gx, gy + 7);
      c.lineTo(gx - 5, gy);
      c.closePath();
      c.fill();
    }

    // 把角色搬到中央画一遍：直接改 runner 的位置，画完还原，
    // 省得给 drawRunner 加一套只在这里用得上的参数
    var ox = r.x;
    var oy = r.y;
    var od = r.ducking;
    r.x = tx - r.w / 2;
    r.y = ty - r.h / 2;
    r.ducking = false;
    c.save();
    c.translate(tx, ty);
    c.scale(scale, scale);
    c.translate(-tx, -ty);
    this.drawRunner();
    c.restore();
    r.x = ox;
    r.y = oy;
    r.ducking = od;

    c.restore();
  };

  /**
   * 死亡覆盖层。
   *
   * 只靠角色的 X 眼 + HUD 里一行小字，玩家很容易没意识到游戏已经结束、
   * 或者不知道怎么重来。这里画一个居中的重启图标，并且**把防误触锁定期画出来**：
   * 锁定期内图标是暗的，可以重开时才亮起——省掉「我按了怎么没反应」的困惑。
   */
  MeteorRunner.prototype.drawGameOver = function () {
    var c = this.ctx;
    var ready = Date.now() - this.deadAt > RESTART_LOCK_MS;

    c.save();
    c.fillStyle = 'rgba(10,4,22,0.55)';
    c.fillRect(0, 0, W, H);

    var cx = W / 2;
    var cy = H / 2 - 10;
    c.globalAlpha = ready ? 1 : 0.35;

    // 重启图标：一个缺口圆 + 箭头，不用文字，省掉一层 i18n 耦合
    c.strokeStyle = COLORS.ink;
    c.lineWidth = 2.5;
    c.lineCap = 'round';
    c.beginPath();
    c.arc(cx, cy, 19, Math.PI * 0.35, Math.PI * 1.9);
    c.stroke();
    c.beginPath();
    c.moveTo(cx + 13, cy - 18);
    c.lineTo(cx + 19, cy - 6);
    c.lineTo(cx + 6, cy - 9);
    c.closePath();
    c.fillStyle = COLORS.ink;
    c.fill();

    // 本局分数，比 HUD 更醒目
    c.globalAlpha = 1;
    c.fillStyle = this.newBest ? '#fde68a' : COLORS.ink;
    c.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
    c.textAlign = 'center';
    c.fillText(String(Math.floor(this.score)), cx, cy + 46);

    // 破纪录时在分数旁边点一颗星。用路径画而不是写字，
    // 既不挑字体也不用再引一层 i18n
    if (this.newBest) {
      var sw = c.measureText(String(Math.floor(this.score))).width;
      this.drawStar(cx - sw / 2 - 14, cy + 40, 6);
      this.drawStar(cx + sw / 2 + 14, cy + 40, 6);
    }

    c.restore();
  };

  /** 五角星，用于破纪录标记 */
  MeteorRunner.prototype.drawStar = function (cx, cy, r) {
    var c = this.ctx;
    c.fillStyle = '#fde68a';
    c.beginPath();
    for (var i = 0; i < 10; i++) {
      var ang = (Math.PI / 5) * i - Math.PI / 2;
      var rad = i % 2 === 0 ? r : r * 0.45;
      var x = cx + Math.cos(ang) * rad;
      var y = cy + Math.sin(ang) * rad;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
    c.fill();
  };

  MeteorRunner.prototype.drawSky = function () {
    var c = this.ctx;
    var ph = this.currentPhase();
    var i;

    // 极光带：两条正弦波，颜色随阶段淡入
    if (ph.aurora > 0.01 && !this.reducedMotion) {
      c.save();
      // 强度直接乘 aurora，阶段切换时就是淡入淡出而不是突然出现
      var au = ph.aurora;
      for (var a = 0; a < 2; a++) {
        var grad = c.createLinearGradient(0, 0, 0, 105);
        grad.addColorStop(0, a ? 'rgba(236,72,153,0)' : 'rgba(167,139,250,0)');
        grad.addColorStop(0.5, a
          ? 'rgba(236,72,153,' + (0.24 * au).toFixed(3) + ')'
          : 'rgba(167,139,250,' + (0.26 * au).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(167,139,250,0)');
        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(0, 105);
        for (var x = 0; x <= W; x += 16) {
          var y = 39 + Math.sin(x / 90 + this.frame * 0.008 + a * 1.7) * 18 + a * 15;
          c.lineTo(x, y);
        }
        c.lineTo(W, 0);
        c.lineTo(0, 0);
        c.closePath();
        c.fill();
      }
      c.restore();
    }

    // 星云带
    c.save();
    for (i = 0; i < this.clouds.length; i++) {
      var cl = this.clouds[i];
      c.globalAlpha = cl.alpha;
      c.fillStyle = COLORS.nebula;
      c.beginPath();
      c.ellipse(cl.x + cl.w / 2, cl.y, cl.w / 2, cl.h / 2, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();

    this.drawMoon();

    // 星点
    c.save();
    for (i = 0; i < this.stars.length; i++) {
      var st = this.stars[i];
      var tw = this.reducedMotion ? 1 : 0.75 + Math.sin(st.tw) * 0.25;
      c.globalAlpha = (0.25 + st.depth) * tw;
      c.fillStyle = COLORS.ink;
      c.fillRect(st.x, st.y, st.r, st.r);
    }
    c.restore();

    // 背景流星
    c.save();
    for (i = 0; i < this.shooting.length; i++) {
      var s = this.shooting[i];
      var g2 = c.createLinearGradient(s.x, s.y, s.x + s.len, s.y - s.len * 0.45);
      g2.addColorStop(0, 'rgba(245,208,254,' + (0.75 * s.life).toFixed(3) + ')');
      g2.addColorStop(1, 'rgba(245,208,254,0)');
      c.strokeStyle = g2;
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(s.x, s.y);
      c.lineTo(s.x + s.len, s.y - s.len * 0.45);
      c.stroke();
    }
    c.restore();
  };

  /**
   * 月亮。8 段月相循环，每局开始随机取一段——谷歌原版就有这个细节，
   * 是那种「玩很久才会注意到」的东西。
   */
  MeteorRunner.prototype.drawMoon = function () {
    var c = this.ctx;
    var cx = W - 92;
    var cy = 57;
    var r = 16;
    var p = this.moonPhase;

    c.save();
    c.globalAlpha = 0.5;
    c.fillStyle = '#e9d5ff';
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();

    // 用 destination-out 挖掉一块做出月相；p=0 是满月，不挖
    if (p !== 0) {
      c.globalCompositeOperation = 'destination-out';
      var offset = ((p - 4) / 4) * r * 2.2;
      c.beginPath();
      c.arc(cx + offset, cy, r * 1.02, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  };

  MeteorRunner.prototype.drawGround = function () {
    var c = this.ctx;
    var ph = this.currentPhase();

    // 大气层热辉：贴着地平线往上烧。heat 是唯一驱动，
    // 后段阶段靠它把「越来越接近地面」这件事画出来
    if (ph.heat > 0.05) {
      var glow = c.createLinearGradient(0, GROUND_Y - 69, 0, GROUND_Y + 8);
      glow.addColorStop(0, rgba(ph.glow, 0));
      glow.addColorStop(1, rgba(ph.glow, (0.2 * ph.heat).toFixed(3)));
      c.fillStyle = glow;
      c.fillRect(0, GROUND_Y - 69, W, 77);
    }

    // 地平线主线
    c.strokeStyle = COLORS.dim;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, GROUND_Y + 1);
    c.lineTo(W, GROUND_Y + 1);
    c.stroke();

    // 起伏纹理：贴着地平线的小凸起。纯装饰，碰撞不看它
    c.save();
    c.fillStyle = 'rgba(233,213,255,0.13)';
    for (var i = 0; i < this.ground.length; i++) {
      var g = this.ground[i];
      c.fillRect(g.x, GROUND_Y - g.h + 1, g.w, g.h);
    }
    c.restore();

    // 滚动虚线，速度感来源
    c.save();
    c.strokeStyle = 'rgba(233,213,255,0.16)';
    c.lineWidth = 2;
    c.setLineDash([14, 26]);
    c.lineDashOffset = this.horizonOffset;
    c.beginPath();
    c.moveTo(0, GROUND_Y + 13);
    c.lineTo(W, GROUND_Y + 13);
    c.stroke();
    c.restore();
  };

  MeteorRunner.prototype.drawObstacle = function (o) {
    var c = this.ctx;
    var y = o.flying ? o.y + Math.sin(o.bob) * FLY_BOB : o.y;

    if (o.flying) {
      // 空中碎片：旋转的菱形 + 拖尾
      c.save();
      c.translate(o.x + o.w / 2, y + o.h / 2);
      c.rotate(this.reducedMotion ? 0 : o.spin + this.frame * 0.05);
      c.fillStyle = COLORS.rock;
      c.beginPath();
      c.moveTo(0, -o.h / 2);
      c.lineTo(o.w / 2, 0);
      c.lineTo(0, o.h / 2);
      c.lineTo(-o.w / 2, 0);
      c.closePath();
      c.fill();
      c.fillStyle = 'rgba(245,208,254,0.5)';
      c.fillRect(-3, -3, 6, 6);
      c.restore();

      c.fillStyle = 'rgba(139,123,184,0.32)';
      c.fillRect(o.x + o.w, y + o.h / 2 - 1, 13, 2);
      return;
    }

    // 地面陨石柱：主体 + 左侧高光 + 右侧阴影，像素风不做渐变
    c.fillStyle = COLORS.rockDark;
    c.fillRect(o.x, y, o.w, o.h);
    c.fillStyle = COLORS.rock;
    c.fillRect(o.x, y, Math.max(3, o.w * 0.4), o.h);
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.fillRect(o.x + o.w - 3, y + 4, 3, o.h - 4);
    // 顶部缺口，让轮廓不那么规整
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.fillRect(o.x + o.w * 0.55, y, o.w * 0.25, 3);
  };

  /** 宝石：旋转的菱形晶体，收集后向上飘散 */
  MeteorRunner.prototype.drawGems = function () {
    var c = this.ctx;
    for (var i = 0; i < this.gems.length; i++) {
      var g = this.gems[i];
      var alpha = g.taken ? Math.max(0, g.pop / 16) : 1;
      var scale = g.taken ? 1 + (1 - g.pop / 16) * 0.8 : 1;

      c.save();
      c.globalAlpha = alpha;
      c.translate(g.x, g.y);
      c.rotate(this.reducedMotion ? 0 : g.spin);
      c.scale(scale, scale);

      // 外发光
      c.globalAlpha = alpha * 0.35;
      c.fillStyle = '#7dd3fc';
      c.beginPath();
      c.arc(0, 0, GEM_R + 4, 0, Math.PI * 2);
      c.fill();

      // 晶体本体
      c.globalAlpha = alpha;
      c.fillStyle = '#38bdf8';
      c.beginPath();
      c.moveTo(0, -GEM_R);
      c.lineTo(GEM_R * 0.72, 0);
      c.lineTo(0, GEM_R);
      c.lineTo(-GEM_R * 0.72, 0);
      c.closePath();
      c.fill();

      // 高光切面
      c.fillStyle = '#e0f2fe';
      c.beginPath();
      c.moveTo(0, -GEM_R);
      c.lineTo(GEM_R * 0.72, 0);
      c.lineTo(0, 0);
      c.closePath();
      c.fill();

      c.restore();
    }
  };

  /**
   * 角色：一只小外星人，按治愈形态变化。
   *
   * 部件顺序从后往前：光环 → 背包 → 身体(太空服) → 手臂 → 头 → 耳 → 头发 → 触角
   * → 眼 → 腮红 → 鼻 → 嘴 → 腿/鞋。每个部件都只读 FORMS 里的颜色，
   * **不要在这里写死配色**，否则形态演变会在某个部件上断掉。
   *
   * 所有坐标都相对 r.x / r.y，且按 STAND_H=58 的比例给。改角色尺寸时
   * 这些数要一起缩放——判定盒在 update 里，改错了不会报错，只会让画面和判定错位。
   */
  /** 道具：四种图标，各自一个颜色，浮在空中轻微上下晃 */
  MeteorRunner.prototype.drawItems = function () {
    var c = this.ctx;
    var COLOR = { heart: '#fb7185', magnet: '#f87171', shield: '#a78bfa', x2: '#fbbf24' };

    for (var i = 0; i < this.items.length; i++) {
      var it = this.items[i];
      var y = it.y + (this.reducedMotion ? 0 : Math.sin(it.bob) * 5);
      var alpha = it.taken ? Math.max(0, it.pop / 18) : 1;
      var scale = it.taken ? 1 + (1 - it.pop / 18) : 1;
      var col = COLOR[it.kind] || '#fff';

      c.save();
      c.globalAlpha = alpha;
      c.translate(it.x, y);
      c.scale(scale, scale);

      // 底托：一个淡色圆盘，让图标在任何背景上都读得出来
      c.fillStyle = 'rgba(12,6,26,0.72)';
      c.beginPath();
      c.arc(0, 0, ITEM_R + 2, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = col;
      c.lineWidth = 2;
      c.stroke();

      c.fillStyle = col;
      c.strokeStyle = col;

      if (it.kind === 'heart') {
        c.beginPath();
        c.moveTo(0, 6);
        c.bezierCurveTo(-9, -1, -5, -9, 0, -4);
        c.bezierCurveTo(5, -9, 9, -1, 0, 6);
        c.fill();
      } else if (it.kind === 'magnet') {
        // 马蹄形：粗弧 + 两个极头
        c.lineWidth = 4;
        c.beginPath();
        c.arc(0, 1, 6, Math.PI, 0);
        c.stroke();
        c.fillRect(-8, 1, 4, 6);
        c.fillRect(4, 1, 4, 6);
        c.fillStyle = '#e0e7ff';
        c.fillRect(-8, 5, 4, 3);
        c.fillRect(4, 5, 4, 3);
      } else if (it.kind === 'shield') {
        c.beginPath();
        c.moveTo(0, -8);
        c.lineTo(7, -4);
        c.lineTo(7, 3);
        c.quadraticCurveTo(7, 8, 0, 9);
        c.quadraticCurveTo(-7, 8, -7, 3);
        c.lineTo(-7, -4);
        c.closePath();
        c.fill();
      } else {
        c.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('x2', 0, 1);
      }

      c.restore();
    }
  };

  /**
   * 角色：一只小外星人，按治愈形态变化。
   *
   * ## 可爱是算出来的
   *
   * 这套比例不是随手摆的，改之前先读：
   *   - **头占身高 55%**（脸中心 y≈19，脸高 26）。Q 版的可爱感主要来自头身比，
   *     低于一半就开始显得"成熟"，失去讨喜的第一印象。
   *   - **眼睛占脸宽的 30%**（半径 5.6×6.6）。这是最关键的一项——眼睛小一圈，
   *     角色立刻从"可爱"掉到"简笔画"。眼里有三层：瞳色底、上方大高光、
   *     下方反光，缺了反光眼神会发死。
   *   - **身体是蛋形不是矩形**，上窄下宽，靠 bezier 收出圆肩。
   *     用圆角矩形画会有明显的"方"，那是最容易让角色显廉价的地方。
   *   - **四肢短而粗、端头圆**。细线四肢会让整体显得脆弱。
   *
   * 部件顺序从后往前：光环 → 腿 → 身体 → 手臂 → 头发后层 → 脸 → 耳 →
   * 五官 → 头发前层 → 触角。头发分前后两层是为了让它"包住"脸，
   * 单层画会像扣了个碗。
   *
   * 所有颜色只读 FORMS，**不要在这里写死配色**，否则形态演变会在某个部件上断掉。
   */
  MeteorRunner.prototype.drawRunner = function () {
    var c = this.ctx;
    var r = this.runner;
    var running = this.state === 'running';
    var f = this.currentForm();
    var duck = r.ducking && r.onGround;

    // 无敌期间闪烁。reducedMotion 下改成恒定半透明——闪烁本身就是要规避的效果，
    // 但「现在打不到我」这个信息不能丢
    var blinking = this.invuln > 0;
    if (blinking) {
      c.save();
      c.globalAlpha = this.reducedMotion
        ? 0.55
        : Math.floor(this.frame / INVULN_BLINK) % 2 === 0
          ? 0.35
          : 1;
    }

    var cx = r.x + r.w / 2;
    var base = r.y + r.h;                 // 脚底
    var still = this.reducedMotion || !running;

    // 呼吸/跑动的上下起伏。幅度很小（1~2px），但没有它角色会像贴纸一样僵在那
    var bob = still ? 0 : r.onGround
      ? (duck ? 0 : Math.abs(Math.sin(this.frame * 0.16)) * 1.6)
      : 0;

    // 下蹲时整体压扁：头往下坐，身子收起
    var squash = duck ? 0.62 : 1;
    var headR = 19 * (duck ? 0.94 : 1);   // 脸的横向半径
    var headRy = 17 * (duck ? 0.92 : 1);
    var headCy = r.y + (duck ? 26 : 19) + bob;
    var bodyCy = base - (duck ? 11 : 19) + bob * 0.5;
    var bodyRx = 15;
    var bodyRy = (duck ? 9 : 12) * 1;

    // ---- 光环：治愈程度越高越亮 ----
    if (f.glow > 0 && !this.reducedMotion) {
      var pulse = running ? 0.86 + Math.sin(this.frame * 0.07) * 0.14 : 1;
      var gr = c.createRadialGradient(cx, headCy + 8, 4, cx, headCy + 8, 52 * pulse);
      gr.addColorStop(0, 'rgba(255,222,244,' + (0.24 * f.glow).toFixed(3) + ')');
      gr.addColorStop(1, 'rgba(255,222,244,0)');
      c.fillStyle = gr;
      c.fillRect(cx - 58, r.y - 26, 116, r.h + 52);
    }

    // ---- 二段跳的余焰 ----
    if (!r.onGround && r.jumps > 1 && !this.reducedMotion) {
      c.save();
      c.globalAlpha = 0.4;
      c.strokeStyle = f.suit;
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(cx, base + 4, 21, 7, 0, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }

    // ---- 腿与鞋（画在身体后面，只露出下半截）----
    var shoe = shade(f.suit, -40);
    if (duck) {
      c.fillStyle = shoe;
      roundRect(c, cx - 13, base - 6, 26, 6, 3);
      c.fill();
    } else if (r.onGround && running) {
      // 跑动：两条腿交替，落地那条压短
      var step = Math.floor(this.frame / 6) % 2 === 0;
      this.drawLimb(cx - 7, bodyCy + 8, cx - 8, base - (step ? 5 : 1), 6.5, f.skin);
      this.drawLimb(cx + 7, bodyCy + 8, cx + 8, base - (step ? 1 : 5), 6.5, f.skin);
      c.fillStyle = shoe;
      c.beginPath();
      c.ellipse(cx - 8, base - (step ? 4 : 1), 6.4, 3.4, 0, 0, Math.PI * 2);
      c.ellipse(cx + 8, base - (step ? 1 : 4), 6.4, 3.4, 0, 0, Math.PI * 2);
      c.fill();
    } else {
      // 待机/滞空：双腿并拢微微收起
      var lift = r.onGround ? 0 : 4;
      this.drawLimb(cx - 6, bodyCy + 8, cx - 7, base - 2 - lift, 6.5, f.skin);
      this.drawLimb(cx + 6, bodyCy + 8, cx + 7, base - 2 - lift, 6.5, f.skin);
      c.fillStyle = shoe;
      c.beginPath();
      c.ellipse(cx - 7, base - 1 - lift, 6.4, 3.4, 0, 0, Math.PI * 2);
      c.ellipse(cx + 7, base - 1 - lift, 6.4, 3.4, 0, 0, Math.PI * 2);
      c.fill();
    }

    // ---- 身体：蛋形，上窄下宽 ----
    c.fillStyle = f.suit;
    c.beginPath();
    c.moveTo(cx, bodyCy - bodyRy);                                   // 顶（肩）
    c.bezierCurveTo(cx + bodyRx * 0.75, bodyCy - bodyRy, cx + bodyRx, bodyCy + bodyRy * 0.35, cx + bodyRx * 0.86, bodyCy + bodyRy);
    c.bezierCurveTo(cx + bodyRx * 0.4, bodyCy + bodyRy * 1.3, cx - bodyRx * 0.4, bodyCy + bodyRy * 1.3, cx - bodyRx * 0.86, bodyCy + bodyRy);
    c.bezierCurveTo(cx - bodyRx, bodyCy + bodyRy * 0.35, cx - bodyRx * 0.75, bodyCy - bodyRy, cx, bodyCy - bodyRy);
    c.closePath();
    c.fill();
    // 底部一点暗，给个体积
    c.save();
    c.globalAlpha = 0.16;
    c.fillStyle = '#1a0b2e';
    c.beginPath();
    c.ellipse(cx, bodyCy + bodyRy * 0.55, bodyRx * 0.8, bodyRy * 0.42, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
    // 胸口的圆形装置，治愈后会亮
    c.fillStyle = f.glow > 0.3 ? '#fffdf7' : shade(f.suit, -22);
    c.beginPath();
    c.arc(cx, bodyCy - 1, 4.2, 0, Math.PI * 2);
    c.fill();
    if (f.glow > 0.5) {
      c.save();
      c.globalAlpha = 0.5 * f.glow;
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(cx, bodyCy - 1, 7, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // ---- 手臂：短粗、圆头，跑动时前后摆 ----
    var swing = still || !r.onGround || duck ? 0 : Math.sin(this.frame * 0.28) * 4;
    // 手臂自然垂在身侧、略微外张。张角太大会像举手投降，那是最容易显僵硬的姿势
    this.drawLimb(cx - bodyRx * 0.66, bodyCy - 4, cx - bodyRx - 2.5, bodyCy + 10 + swing, 6.2, f.skin);
    this.drawLimb(cx + bodyRx * 0.66, bodyCy - 4, cx + bodyRx + 2.5, bodyCy + 10 - swing, 6.2, f.skin);

    // ---- 头发后层：先铺一层比脸大的轮廓，让头发从后面包住脸 ----
    c.fillStyle = shade(f.hair, -18);
    c.beginPath();
    c.ellipse(cx, headCy - 2, headR + 2.5, headRy + 2, 0, Math.PI, 0);
    c.fill();

    // ---- 脸 ----
    c.fillStyle = f.skin;
    c.beginPath();
    c.ellipse(cx, headCy, headR, headRy, 0, 0, Math.PI * 2);
    c.fill();
    // 下巴一侧的柔和暗部
    c.save();
    c.globalAlpha = 0.1;
    c.fillStyle = '#8b5a3c';
    c.beginPath();
    c.ellipse(cx, headCy + headRy * 0.45, headR * 0.72, headRy * 0.36, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // ---- 耳朵 ----
    c.fillStyle = f.skin;
    c.beginPath();
    c.ellipse(cx - headR + 1.5, headCy + 2, 4, 5.5, 0, 0, Math.PI * 2);
    c.ellipse(cx + headR - 1.5, headCy + 2, 4, 5.5, 0, 0, Math.PI * 2);
    c.fill();
    c.save();
    c.globalAlpha = 0.28;
    c.fillStyle = '#e08a9a';
    c.beginPath();
    c.ellipse(cx - headR + 1.5, headCy + 2, 1.8, 2.6, 0, 0, Math.PI * 2);
    c.ellipse(cx + headR - 1.5, headCy + 2, 1.8, 2.6, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // ---- 眼睛：整张脸最重要的部件 ----
    var eyeY = headCy + 1.5;
    var eyeDx = 7.6;
    if (this.state === 'over') {
      c.strokeStyle = shade(f.skin, -70);
      c.lineWidth = 2.4;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(cx - eyeDx - 4, eyeY - 4); c.lineTo(cx - eyeDx + 4, eyeY + 4);
      c.moveTo(cx - eyeDx + 4, eyeY - 4); c.lineTo(cx - eyeDx - 4, eyeY + 4);
      c.moveTo(cx + eyeDx - 4, eyeY - 4); c.lineTo(cx + eyeDx + 4, eyeY + 4);
      c.moveTo(cx + eyeDx + 4, eyeY - 4); c.lineTo(cx + eyeDx - 4, eyeY + 4);
      c.stroke();
    } else if (r.blink > 0 && r.onGround) {
      // 眨眼：弯成两道向下的弧，比直线可爱
      c.strokeStyle = shade(f.eye, -30);
      c.lineWidth = 2;
      c.lineCap = 'round';
      c.beginPath();
      c.arc(cx - eyeDx, eyeY + 2, 4, Math.PI * 1.15, Math.PI * 1.85);
      c.arc(cx + eyeDx, eyeY + 2, 4, Math.PI * 1.15, Math.PI * 1.85);
      c.stroke();
    } else {
      this.drawEye(cx - eyeDx, eyeY, f, -1);
      this.drawEye(cx + eyeDx, eyeY, f, 1);
    }

    // ---- 腮红 ----
    if (f.cheeks > 0) {
      c.save();
      c.globalAlpha = 0.55 * f.cheeks;
      var cg = c.createRadialGradient(cx - 13, eyeY + 7, 0, cx - 13, eyeY + 7, 5);
      cg.addColorStop(0, '#ff8fae');
      cg.addColorStop(1, 'rgba(255,143,174,0)');
      c.fillStyle = cg;
      c.beginPath(); c.arc(cx - 13, eyeY + 7, 5, 0, Math.PI * 2); c.fill();
      var cg2 = c.createRadialGradient(cx + 13, eyeY + 7, 0, cx + 13, eyeY + 7, 5);
      cg2.addColorStop(0, '#ff8fae');
      cg2.addColorStop(1, 'rgba(255,143,174,0)');
      c.fillStyle = cg2;
      c.beginPath(); c.arc(cx + 13, eyeY + 7, 5, 0, Math.PI * 2); c.fill();
      c.restore();
    }

    // ---- 嘴：形态决定弧度，从下弯到张口笑 ----
    if (this.state !== 'over') {
      var my = eyeY + 9.5;
      c.strokeStyle = shade(f.skin, -58);
      c.lineWidth = 1.7;
      c.lineCap = 'round';
      c.beginPath();
      if (f.mouth === 0) {
        c.arc(cx, my + 5, 4.2, Math.PI * 1.18, Math.PI * 1.82);      // 下弯
      } else if (f.mouth === 1) {
        c.moveTo(cx - 3.2, my); c.lineTo(cx + 3.2, my);              // 平
      } else if (f.mouth === 2) {
        c.arc(cx, my - 2, 4, Math.PI * 0.18, Math.PI * 0.82);        // 微扬
      } else {
        // 张口笑：描边 + 填充，比单线更有表情
        c.arc(cx, my - 2, 4.6 + (f.mouth - 3) * 1.2, Math.PI * 0.1, Math.PI * 0.9);
        c.closePath();
        c.fillStyle = shade(f.skin, -52);
        c.fill();
        c.fillStyle = '#ff9db4';
        c.beginPath();
        c.arc(cx, my + 1.4 + (f.mouth - 3) * 0.6, 2.2 + (f.mouth - 3) * 0.5, 0, Math.PI);
        c.fill();
        c.beginPath();
      }
      c.stroke();
    }

    // ---- 头发前层：不等大的圆叠出蓬松的不规则边缘 ----
    // 单层等大圆会像扣了个碗，这里刻意让每个圆大小和高低都不同
    c.fillStyle = f.hair;
    c.beginPath();
    c.arc(cx - 14, headCy - 10, 7.6, 0, Math.PI * 2);
    c.arc(cx - 6, headCy - 15, 9.2, 0, Math.PI * 2);
    c.arc(cx + 3.5, headCy - 16, 8.4, 0, Math.PI * 2);
    c.arc(cx + 12, headCy - 11, 7, 0, Math.PI * 2);
    c.arc(cx + 16.5, headCy - 4.5, 5.2, 0, Math.PI * 2);
    c.arc(cx - 17.5, headCy - 4, 5.6, 0, Math.PI * 2);
    c.fill();
    // 头发高光：一道弯月，治愈度越高越明显
    c.save();
    var hg = c.createRadialGradient(cx - 3, headCy - 14.5, 0, cx - 3, headCy - 14.5, 9);
    hg.addColorStop(0, 'rgba(255,255,255,' + (0.34 + f.glow * 0.3).toFixed(2) + ')');
    hg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = hg;
    c.beginPath();
    c.ellipse(cx - 3, headCy - 14.5, 9, 4, -0.2, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // ---- 触角 ----
    var tw = still ? 0 : Math.sin(this.frame * 0.12) * 2.6;
    c.strokeStyle = f.hair;
    c.lineWidth = 2.2;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(cx - 7, headCy - 17);
    c.quadraticCurveTo(cx - 12 + tw, headCy - 26, cx - 14 + tw, headCy - 33);
    c.moveTo(cx + 7, headCy - 17);
    c.quadraticCurveTo(cx + 12 - tw, headCy - 26, cx + 14 - tw, headCy - 33);
    c.stroke();
    // 顶端小球，治愈后发光
    var tipGlow = f.glow > 0.3;
    c.fillStyle = tipGlow ? '#fffdf7' : shade(f.hair, 20);
    c.beginPath();
    c.arc(cx - 14 + tw, headCy - 34.5, 3.1, 0, Math.PI * 2);
    c.arc(cx + 14 - tw, headCy - 34.5, 3.1, 0, Math.PI * 2);
    c.fill();
    if (tipGlow && !this.reducedMotion) {
      c.save();
      c.globalAlpha = 0.4 * f.glow;
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(cx - 14 + tw, headCy - 34.5, 6, 0, Math.PI * 2);
      c.arc(cx + 14 - tw, headCy - 34.5, 6, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // ---- 满格形态的星星点缀 ----
    if (f.glow >= 1 && !this.reducedMotion) {
      c.save();
      for (var si = 0; si < 3; si++) {
        var sa = this.frame * 0.02 + (si * Math.PI * 2) / 3;
        c.globalAlpha = 0.45 + Math.sin(this.frame * 0.09 + si) * 0.3;
        this.drawStar(cx + Math.cos(sa) * 26, headCy - 6 + Math.sin(sa) * 20, 2.6);
      }
      c.restore();
    }

    if (blinking) c.restore();
  };

  /** 一段短粗的肢体：带圆端头的粗线 */
  MeteorRunner.prototype.drawLimb = function (x1, y1, x2, y2, w, color) {
    var c = this.ctx;
    c.strokeStyle = color;
    c.lineWidth = w;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  };

  /**
   * 一只眼睛。三层：瞳色底 + 上方大高光 + 下方反光。
   * **下方那点反光不能省**——少了它眼神会发死，这是"可爱"和"呆板"的分界。
   */
  MeteorRunner.prototype.drawEye = function (x, y, f, side) {
    var c = this.ctx;
    // 眼白/眼眶
    c.fillStyle = '#fffdfa';
    c.beginPath();
    c.ellipse(x, y, 5.8, 6.8, 0, 0, Math.PI * 2);
    c.fill();
    // 瞳
    c.fillStyle = f.eye;
    c.beginPath();
    c.ellipse(x + side * 0.6, y + 0.6, 4.4, 5.4, 0, 0, Math.PI * 2);
    c.fill();
    // 瞳孔深处
    c.fillStyle = shade(f.eye, -55);
    c.beginPath();
    c.ellipse(x + side * 0.6, y + 1.4, 2.4, 3.2, 0, 0, Math.PI * 2);
    c.fill();
    // 上方大高光
    c.fillStyle = 'rgba(255,255,255,' + (0.7 + f.glow * 0.3).toFixed(2) + ')';
    c.beginPath();
    c.ellipse(x + side * 1.6 - 1.2, y - 2.6, 2.1, 2.5, -0.3, 0, Math.PI * 2);
    c.fill();
    // 下方反光——省掉这一点眼神就发死了
    c.fillStyle = 'rgba(255,255,255,' + (0.4 + f.glow * 0.35).toFixed(2) + ')';
    c.beginPath();
    c.arc(x - side * 1.8, y + 3.4, 1.15, 0, Math.PI * 2);
    c.fill();
  };

  /** 解绑所有监听并停帧。React 侧 unmount 时必须调用，否则监听会随路由切换累积。 */
  MeteorRunner.prototype.destroy = function () {
    this.pause();
    clearTimeout(this.restartTimer);
    if (this.ro) {
      this.ro.disconnect();
      this.ro = null;
    }
    for (var i = 0; i < this.bound.length; i++) {
      var b = this.bound[i];
      b[0].removeEventListener(b[1], b[2], b[3]);
    }
    this.bound = [];
  };

  window.MeteorRunner = MeteorRunner;

  // ---------- 静态页自动初始化 ----------
  //
  // 让 /offline.html 这类纯静态页做到零 inline script：页面只要放一个
  // <canvas data-meteor-runner-auto>，本脚本加载完就自己接管。
  // React 侧不带这个属性，所以不会被自动初始化影响。
  //
  // 兜底页脱离了 next-intl，只能自己判断语言。文案就这几条，够用。
  var TEXT = {
    zh: {
      idle: '空格 / W 起跳 · ↓ / S 下蹲 · 空中可二段跳',
      idleTouch: '点击开始 · 按住下方下蹲 · 空中可再点一次',
      over: '撞上了。空格 / W 再来一次',
      overTouch: '撞上了。点击再来一次',
      score: '得分',
      best: '最高',
      // 下面几条是兜底页自己的文案，靠 data-mr-t 属性对应到节点
      forms: {
        depressed: '抑郁小外星人',
        healing: '治愈中小外星人',
        recovering: '康复中小外星人',
        healed: '温暖治愈小外星人',
        radiant: '梦幻光芒小外星人',
      },
      formHint: '形态变化：',
      items: {
        heart: '拿到爱心，生命 +1',
        magnet: '拿到磁铁，开始吸附宝石',
        shield: '拿到护盾，短时间无敌',
        x2: '拿到双倍分数',
      },
      livesLeft: '还剩 {n} 条命',
      /**
       * 三种结局。立意上有条统一的线：**玩家是陪伴者，不是拯救者**——
       * 整个页面的框架就是「陪它跑一段」，所以文案的主语是「它」，
       * 玩家只是见证和陪着。写成「你真棒」「你战胜了」会把这层关系拧掉。
       *
       * 也刻意不写成鸡汤：不下结论、不给道理，只描述一件具体的事，
       * 剩下的留给玩家自己。{n} 由实际收集数填充，不写死门槛——门槛会调，
       * 而「你捡了多少」永远是真的。
       */
      victory: {
        life: ['它不怕摔了', '99 次跌倒，99 次爬起来。它好像终于相信，摔一下不是什么了不得的事。'],
        distance: ['跑了很远了', '没有终点线，也没有人计时。它只是一直在跑，然后有一天，路自己变宽了。'],
        gems: ['够亮了', '{n} 颗光，一颗一颗捡回来的。现在它自己会亮了——你可以放心了。'],
      },
      victoryGo: '空格 / W 继续跑 · 进度都还在',
      victoryGoTouch: '点击继续跑 · 进度都还在',
      title: '离线了 · Meteor Store',
      heading: '你离线了',
      sub: '网络断了。等信号回来之前，陪它跑一段吧——它正在慢慢好起来。',
      retry: '重新连接',
      // 这个页面也会被直接访问（它就是个普通静态页，断网只是它的用途之一）。
      // 网通着还说「你离线了」会让人以为站点出了问题。
      titleOnline: '陪它跑一段 · Meteor Store',
      headingOnline: '陪它跑一段',
      subOnline: '它正在慢慢好起来。收集宝石，看它一点点变回原来的样子。',
      retryOnline: '回首页',
      canvasLabel: '治愈跑酷小游戏。按空格、W 或点击跳跃，空中可再跳一次，按向下方向键或 S 下蹲。收集宝石推进治愈形态，躲避陨石。',
    },
    en: {
      idle: 'Space / W to jump · ↓ / S to duck · double jump in mid-air',
      idleTouch: 'Tap to start · hold lower half to duck · tap again mid-air',
      over: 'Crashed. Space / W to retry',
      overTouch: 'Crashed. Tap to retry',
      score: 'Score',
      best: 'Best',
      forms: {
        depressed: 'Downcast little alien',
        healing: 'Beginning to heal',
        recovering: 'Recovering',
        healed: 'Warm and healed',
        radiant: 'Radiant',
      },
      formHint: 'Now: ',
      items: {
        heart: 'Heart collected, +1 life',
        magnet: 'Magnet collected, gems are being pulled in',
        shield: 'Shield collected, briefly invincible',
        x2: 'Double score collected',
      },
      livesLeft: '{n} lives left',
      victory: {
        life: ['Not afraid of falling', "Ninety-nine falls, ninety-nine times back up. It seems to believe now that falling isn't such a big deal."],
        distance: ['That is a long way', 'No finish line, nobody timing it. It just kept running — and one day the road got wider on its own.'],
        gems: ['Bright enough', '{n} lights, picked up one at a time. It glows on its own now. You can let go.'],
      },
      victoryGo: 'Space / W to keep running · progress is kept',
      victoryGoTouch: 'Tap to keep running · progress is kept',
      title: 'Offline · Meteor Store',
      heading: "You're offline",
      sub: "The network is down. Keep it company while you wait — it's slowly getting better.",
      retry: 'Reconnect',
      titleOnline: 'Keep it company · Meteor Store',
      headingOnline: 'Keep it company',
      subOnline: "It's slowly getting better. Collect gems and watch it come back to itself.",
      retryOnline: 'Back home',
      canvasLabel:
        'Healing runner mini-game. Press space, W or tap to jump, again in mid-air to double jump, arrow down or S to duck. Collect gems to advance the healing form, dodge the meteors.',
    },
  };

  function autoInit() {
    var canvas = document.querySelector('canvas[data-meteor-runner-auto]');
    if (!canvas) return;

    /**
     * 语言判断有两种来源：
     *   - 404 页由 next-intl 渲染，<html lang> 是可信的，直接用；
     *   - /offline.html 是一份静态文件，服务不了两种语言，所以它在 <html> 上标了
     *     data-mr-auto-lang，交给这里按 navigator.language 决定并回写 lang——
     *     写死任一语言都会让另一半用户拿到错的 lang，影响读屏发音和断行。
     */
    var root = document.documentElement;
    var autoLang = root.hasAttribute && root.hasAttribute('data-mr-auto-lang');
    var lang = (autoLang ? navigator.language : root.lang || navigator.language) || 'zh';
    var isEn = lang.toLowerCase().indexOf('en') === 0;
    var t = isEn ? TEXT.en : TEXT.zh;
    if (autoLang) root.lang = isEn ? 'en' : 'zh-CN';

    /**
     * 兜底页自己的文案：零 inline script 的代价是这活儿只能由引擎顺手做。
     *
     * **按实际网络状态选一套。** 这个页面有两种到达方式：断网时被 Service Worker
     * 兜过来，或者有人直接访问它（它就是个普通静态页）。网通着还说「你离线了」，
     * 会让人以为站点出了问题。navigator.onLine 对这个用途够用了——
     * 它不保证服务器可达，但「浏览器认为自己没网」和「用户主动打开这一页」
     * 这两种情形它分得清。
     */
    function paintCopy() {
      var online = navigator.onLine !== false;
      var nodes = document.querySelectorAll('[data-mr-t]');
      for (var n = 0; n < nodes.length; n++) {
        var key = nodes[n].getAttribute('data-mr-t');
        var onlineKey = key + 'Online';
        var val = online && t[onlineKey] ? t[onlineKey] : t[key];
        if (val) nodes[n].textContent = val;
      }
      var ariaNodes = document.querySelectorAll('[data-mr-t-aria]');
      for (var a = 0; a < ariaNodes.length; a++) {
        var akey = ariaNodes[a].getAttribute('data-mr-t-aria');
        if (t[akey]) ariaNodes[a].setAttribute('aria-label', t[akey]);
      }
    }

    // <title> 也带 data-mr-t，上面的循环已经把它一起换掉了
    paintCopy();
    // 玩的过程中断网/恢复，文案跟着切
    window.addEventListener('online', paintCopy);
    window.addEventListener('offline', paintCopy);
    // 纯触屏设备提到「空格」「↓ 键」是无效指引，会让人以为游戏坏了
    var touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    var idleText = touch ? t.idleTouch : t.idle;
    var overText = touch ? t.overTouch : t.over;

    var scoreEl = document.getElementById('mr-score');
    var bestEl = document.getElementById('mr-best');
    var hintEl = document.getElementById('mr-hint');
    var victoryEl = document.getElementById('mr-victory');
    var srEl = document.getElementById('mr-sr');
    var formTimer = 0;

    function announce(msg) {
      if (srEl) srEl.textContent = msg;
    }

    function paintScore(score, best) {
      if (scoreEl) scoreEl.textContent = t.score + ' ' + score;
      if (bestEl) bestEl.textContent = best > 0 ? t.best + ' ' + best : '';
    }

    var game = new MeteorRunner(canvas, {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onScore: paintScore,
      onStateChange: function (s) {
        if (victoryEl && s !== 'victory') victoryEl.hidden = true;
        if (hintEl) hintEl.textContent = s === 'over' ? overText : s === 'idle' ? idleText : '';
      },
      onMilestone: function () {
        if (!scoreEl) return;
        scoreEl.classList.add('mr-pop');
        setTimeout(function () {
          scoreEl.classList.remove('mr-pop');
        }, 400);
      },
      onItem: function (kind) {
        if (t.items[kind]) announce(t.items[kind]);
      },
      onLives: function (n) {
        announce(t.livesLeft.replace('{n}', n));
      },
      onForm: function (key) {
        if (t.forms[key]) announce(t.formHint + t.forms[key]);
        if (!hintEl || !t.forms[key]) return;
        hintEl.textContent = t.formHint + t.forms[key];
        clearTimeout(formTimer);
        formTimer = setTimeout(function () {
          hintEl.textContent = '';
        }, 2600);
      },
      onVictory: function (type, score, gems) {
        if (!victoryEl) return;
        var v = t.victory[type];
        if (!v) return;
        victoryEl.querySelector('[data-mr-v-title]').textContent = v[0];
        // {n} 用实际收集数，不写死门槛——门槛会调，「你捡了多少」永远是真的
        victoryEl.querySelector('[data-mr-v-sub]').textContent = v[1].replace('{n}', gems);
        victoryEl.querySelector('[data-mr-v-go]').textContent = touch ? t.victoryGoTouch : t.victoryGo;
        victoryEl.hidden = false;
      },
      onStateChangeExtra: null,
    });

    paintScore(0, game.best);
    if (hintEl) hintEl.textContent = idleText;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
