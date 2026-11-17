#!/usr/bin/env node
/**
 * 产品页媒体构建：把 `promo/` 里的宣传物料转成网页可直接播放的产物。
 *
 * 背景：2026-11 之前 `public/products/<id>/demo.mp4` 是 GIF 转出来的，
 * 分辨率 360–480px、帧率 5–8fps、码率 20–65kbps，放到 16:10 的演示位里
 * 糊成一团。本脚本统一从宣传片（1080p / 30fps）切出 11–16 秒的演示段，
 * 重编码为 720p 的 MP4 + WebM，并同时输出海报帧和高清截图。
 *
 * 用法：
 *   node scripts/build-product-media.mjs --id xisland
 *   node scripts/build-product-media.mjs --all
 *   node scripts/build-product-media.mjs --all --skip-webm   # 只出 MP4（快）
 *
 * 产物（public/products/<id>/，文件名带 `-v2` 版本后缀，见 MEDIA_VERSION）：
 *   demo-v2.mp4          H.264 720p，带配乐（页面默认静音，用户可自行开声）
 *   demo-v2.webm         VP9 720p，Chrome/Firefox 优先取这一份
 *   demo-poster-v2.webp  1280×720，preload="none" 时的占位帧
 *   cover-v2.webp        1600×900，列表/分享用的静态封面
 *   screenshot-N-v2.webp 1600×900，产品实景图
 *
 * 规则：
 * 1. **不做无损放大**。源图不足 1600×900 的直接报错，逼着换更好的物料，
 *    而不是把 800×400 拉成 1600×900 假装高清。
 * 2. 截图统一 1600×900 居中裁切，画廊用 16:9 版式，不再让 16:10 的图被 object-cover 啃掉两边。
 * 3. 演示片**不开淡入淡出**：片头片尾的切点本来就是按节拍剪的，加淡入会让第一帧发灰。
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const ROOT = process.cwd();
const OUT_ROOT = join(ROOT, 'public/products');
const TMP = '/tmp/meteor-product-media';

/**
 * 物料版本后缀。
 *
 * 同名替换在浏览器和 Next 的图片优化缓存里都会继续命中旧文件（部署脚本里
 * nginx 给的也是 `max-age=86400`），所以换一整套素材时必须换文件名。
 * 下一次整体换物料时把它改成 `-v3`，并把 `products.ts` 里的引用一起换掉。
 */
const MEDIA_VERSION = '-v2';

/* ------------------------------------------------------------------ *
 * 物料清单
 *
 * `film.cut` 的单位是秒，取宣传片里产品界面最密的连续段：
 * 开头不要（0–5s 多是品牌钩子）、结尾不要（最后 5–6s 是落版 logo）。
 * 已在缩略图上逐段确认，别凭感觉改。
 * ------------------------------------------------------------------ */
const products = [
  {
    id: 'xisland',
    film: 'promo/xisland-film-1920x1080.mp4',
    cut: [16, 32],
    posterAt: 17.2,
    stills: [
      { src: '/tmp/meteor-product-media/frames/xisland-66.png', alt: { zh: 'XIsland 展开总表 — 31 个代理的模型、任务与剩余配额', en: 'XIsland expanded table — 31 agents with model, task and quota' } },
      { src: '/tmp/meteor-product-media/frames/xisland-92.png', alt: { zh: 'XIsland 审批面板 — 危险命令先问再执行', en: 'XIsland approval panel — risky commands ask first' } },
      { src: '/tmp/meteor-product-media/frames/xisland-48.png', alt: { zh: 'XIsland 方案确认 — 改代码前先看它打算怎么做', en: 'XIsland plan review — see the plan before the diff' } },
      { src: '/tmp/meteor-product-media/frames/xisland-4.png', alt: { zh: 'XIsland 收起状态 — 一颗胶囊显示 12 个代理在运行', en: 'XIsland collapsed pill — 12 agents running' } },
    ],
  },
  {
    id: 'chakra-visualizer',
    film: 'promo/chakra/Chakra-宣传包/01-成片/Chakra-宣传片-1920x1080.mp4',
    cut: [12, 28],
    posterAt: 13,
    stills: [
      { src: 'promo/chakra/Chakra-宣传包/03-截图/01-手势识别-取景框.jpg', alt: { zh: 'Chakra Visualizer 手势识别 — 取景框内 21 个关键点连线', en: 'Chakra Visualizer hand tracking — 21 landmarks in the camera frame' } },
      { src: 'promo/chakra/Chakra-宣传包/03-截图/02-八个结印.jpg', alt: { zh: 'Chakra Visualizer 八个结印 — 当前手势高亮', en: 'Chakra Visualizer eight hand seals — current seal highlighted' } },
      { src: 'promo/chakra/Chakra-宣传包/03-截图/03-螺旋手里剑.jpg', alt: { zh: 'Chakra Visualizer 螺旋手里剑 — 结完印后的风遁特效', en: 'Chakra Visualizer Rasenshuriken — wind release effect after the seals' } },
      { src: 'promo/chakra/Chakra-宣传包/03-截图/04-忍术卡片墙.jpg', alt: { zh: 'Chakra Visualizer 忍术卡片墙 — 21 个忍术一览', en: 'Chakra Visualizer jutsu card wall — 21 jutsu at a glance' } },
    ],
  },
  {
    id: 'webgl-fluid-sim',
    film: 'promo/fluid/WebGL-Fluid-Sim-宣传包/01-成片/WebGL-Fluid-Sim-宣传片-1920x1080.mp4',
    cut: [7, 23],
    posterAt: 8.2,
    stills: [
      { src: 'promo/fluid/WebGL-Fluid-Sim-宣传包/03-截帧/截帧-01-启动溅射.png', alt: { zh: 'WebGL Fluid Sim 启动溅射 — 指针划过的第一片流体', en: 'WebGL Fluid Sim startup splash — the first fluid trail' } },
      { src: 'promo/fluid/WebGL-Fluid-Sim-宣传包/03-截帧/截帧-03-水纹模式.png', alt: { zh: 'WebGL Fluid Sim 水纹模式 — 实时求解的涟漪', en: 'WebGL Fluid Sim ripple mode — real-time solved ripples' } },
      { src: 'promo/fluid/WebGL-Fluid-Sim-宣传包/03-截帧/截帧-04-涡旋爆发.png', alt: { zh: 'WebGL Fluid Sim 涡旋爆发 — 卷起的染料涡流', en: 'WebGL Fluid Sim vortex burst — rolling dye vortices' } },
      { src: 'promo/fluid/WebGL-Fluid-Sim-宣传包/03-截帧/截帧-07-手势五指尖.png', alt: { zh: 'WebGL Fluid Sim 手势控制 — 五个指尖同时拖动流体', en: 'WebGL Fluid Sim gesture control — five fingertips stirring' } },
    ],
  },
  {
    id: 'skeleton-anatomy',
    film: 'promo/skeleton-anatomy/Skeleton Anatomy-宣传包/01-成片/Skeleton Anatomy-宣传片-1920x1080.mp4',
    cut: [5, 21],
    posterAt: 6.4,
    stills: [
      { src: 'promo/skeleton-anatomy/Skeleton Anatomy-宣传包/03-截图/shot-01-full.png', alt: { zh: 'Skeleton Anatomy 全身骨骼 — 206 块骨头整体视图', en: 'Skeleton Anatomy full body — all 206 bones' } },
      { src: 'promo/skeleton-anatomy/Skeleton Anatomy-宣传包/03-截图/shot-02-scan.png', alt: { zh: 'Skeleton Anatomy 扫描定位 — 逐块高亮选中骨骼', en: 'Skeleton Anatomy scan — bones highlighted one by one' } },
      { src: 'promo/skeleton-anatomy/Skeleton Anatomy-宣传包/03-截图/shot-04-skull.png', alt: { zh: 'Skeleton Anatomy 颅骨特写 — 旋转观察骨缝', en: 'Skeleton Anatomy skull close-up — rotate to inspect sutures' } },
      { src: 'promo/skeleton-anatomy/Skeleton Anatomy-宣传包/03-截图/shot-05-quiz.png', alt: { zh: 'Skeleton Anatomy 骨骼测验 — 看图选骨的练习模式', en: 'Skeleton Anatomy quiz — name that bone' } },
    ],
  },
  {
    id: 'ex-memory',
    film: 'promo/ex-memory/Ex-Memory-宣传包/01-成片/ex-memory-宣传片-1920x1080.mp4',
    cut: [6, 22],
    posterAt: 7.4,
    stills: [
      { src: 'promo/ex-memory/Ex-Memory-宣传包/03-截图/shot-02-导入表单.png', alt: { zh: 'Ex-Memory 导入表单 — 从自己导出的聊天记录开始', en: 'Ex-Memory import form — start from your own chat export' } },      { src: 'promo/ex-memory/Ex-Memory-宣传包/03-截图/shot-04-聊天.png', alt: { zh: 'Ex-Memory 对话界面 — 左侧镜像资料，右侧聊天', en: 'Ex-Memory chat — mirror profile on the left, conversation on the right' } },
      { src: 'promo/ex-memory/Ex-Memory-宣传包/03-截图/shot-08-原话出处.png', alt: { zh: 'Ex-Memory 原话出处 — 每条回复都能追到原始聊天', en: 'Ex-Memory provenance — every reply traces back to the original chat' } },
      { src: 'promo/ex-memory/Ex-Memory-宣传包/03-截图/shot-10-记忆衰减.png', alt: { zh: 'Ex-Memory 记忆衰减 — 不常提的事会慢慢模糊', en: 'Ex-Memory decay — details fade when they are not recalled' } },
    ],
  },
  {
    id: 'tollow',
    film: 'promo/tollow/Tollow-宣传包/01-成片/Tollow-宣传片-1920x1080.mp4',
    cut: [7, 23],
    posterAt: 8.4,
    stills: [
      { src: 'promo/tollow/Tollow-宣传包/03-截图/shot-02-书库.png', alt: { zh: 'Tollow 书库 — 十一部公版书', en: 'Tollow library — eleven public-domain books' } },
      { src: 'promo/tollow/Tollow-宣传包/03-截图/shot-03-论语卡.png', alt: { zh: 'Tollow 论语卡 — 章节与篇目', en: 'Tollow Analects card — chapters and sections' } },
      { src: 'promo/tollow/Tollow-宣传包/03-截图/shot-06-正文打字.png', alt: { zh: 'Tollow 正文打字 — 打错的字用朱红标出', en: 'Tollow typing — mistakes marked in vermilion' } },
      { src: 'promo/tollow/Tollow-宣传包/03-截图/shot-07-四格统计.png', alt: { zh: 'Tollow 四格统计 — 速度、准确率、进度、错字', en: 'Tollow stats — speed, accuracy, progress, mistakes' } },
    ],
  },
  {
    id: 'xnook',
    film: 'promo/xnook/XNook-宣传包/01-成片/XNook-宣发片-1920x1080.mp4',
    cut: [5, 21],
    posterAt: 6.4,
    stills: [
      { src: 'promo/xnook/XNook-宣传包/03-截图/01-整体面板.jpg', alt: { zh: 'XNook 整体面板 — 媒体、日历、文件托盘三栏', en: 'XNook full panel — media, calendar and file tray' } },
      { src: 'promo/xnook/XNook-宣传包/03-截图/02-媒体.jpg', alt: { zh: 'XNook 媒体控制 — 顶边直接切歌', en: 'XNook media controls — switch tracks from the menu bar' } },
      { src: 'promo/xnook/XNook-宣传包/03-截图/03-日历.jpg', alt: { zh: 'XNook 日历 — 今天的日程和待办', en: 'XNook calendar — today’s schedule and reminders' } },
      { src: 'promo/xnook/XNook-宣传包/03-截图/04-文件托盘.jpg', alt: { zh: 'XNook 文件托盘 — 拖进来暂存，随时取走', en: 'XNook file tray — drop files in, grab them later' } },
    ],
  },
  {
    id: 'duocast',
    film: 'promo/duocast/DuoCast-宣传包/01-成片/DuoCast-宣传片-1920x1080.mp4',
    cut: [9, 25],
    posterAt: 10.6,
    stills: [
      { src: 'promo/duocast/DuoCast-宣传包/03-截图/shot-01-split.png', alt: { zh: 'DuoCast 分路输出 — 同一首歌送到三副耳机', en: 'DuoCast split output — one song to three pairs of headphones' } },
      { src: 'promo/duocast/DuoCast-宣传包/03-截图/shot-03-controls.png', alt: { zh: 'DuoCast 通道控制 — 每路独立音量、延迟与 EQ', en: 'DuoCast channel controls — per-route volume, delay and EQ' } },
      { src: 'promo/duocast/DuoCast-宣传包/03-截图/shot-04-drift.png', alt: { zh: 'DuoCast 延迟补偿 — 把有线那几路拖到与蓝牙对齐', en: 'DuoCast delay compensation — align wired routes with Bluetooth' } },
      { src: 'promo/duocast/DuoCast-宣传包/03-截图/shot-06-hotswap.png', alt: { zh: 'DuoCast 热插拔 — 拔掉一副只断那一路', en: 'DuoCast hot-swap — unplug one route, the rest keep playing' } },
    ],
  },
  {
    id: 'omnicrawl',
    film: 'promo/films/out/omnicrawl-short-1920x1080.mp4',
    cut: null,
    posterAt: 1.2,
    stills: [
      { src: 'public/products/omnicrawl/reference-cli.webp', alt: { zh: 'OmniCrawl 命令行 — 子命令与参数一览', en: 'OmniCrawl CLI — commands and options' } },
      { src: '/tmp/meteor-product-media/originals/omnicrawl-s1.webp', alt: { zh: 'OmniCrawl 核心特性与引擎对比表', en: 'OmniCrawl core features and engine comparison' } },
      { src: '/tmp/meteor-product-media/originals/omnicrawl-s2.webp', alt: { zh: 'OmniCrawl 安装与快速开始', en: 'OmniCrawl installation and quick start' } },
    ],
  },
  {
    id: 'ui-design-system',
    film: 'promo/films/out/ui-design-system-short-1920x1080.mp4',
    cut: null,
    posterAt: 5.6,
    stills: [
      { src: 'public/products/ui-design-system/reference-home.webp', alt: { zh: 'UI Design System 首页 — 三层 token 与核心特性', en: 'UI Design System home — token layers and core features' } },
      { src: 'public/products/ui-design-system/reference-components.webp', alt: { zh: 'UI Design System 组件浏览 — 五百个变量与十七个组件', en: 'UI Design System component browser — 500 variables, 17 components' } },
    ],
  },
  {
    id: 'statux',
    film: 'promo/films/out/statux-short-1920x1080.mp4',
    cut: null,
    posterAt: 1.4,
    stills: [
      { src: 'public/products/statux/reference-terminal.webp', alt: { zh: 'Statux 终端状态行 — 模型、token、成本、耗时一次显示', en: 'Statux status line — model, tokens, cost and elapsed time' } },
      { src: '/tmp/meteor-product-media/frames/statux-76.png', alt: { zh: 'Statux TUI 配置界面 — 自己拼要显示的字段', en: 'Statux TUI config — choose which fields to show' } },
    ],
  },
  {
    id: 'claude-phone-control',
    film: 'promo/films/out/claude-phone-control-short-1920x1080.mp4',
    cut: null,
    posterAt: 1.2,
    stills: [],
  },
  {
    id: 'cursor-source-analyzer',
    film: 'promo/films/out/cursor-source-analyzer-short-1920x1080.mp4',
    cut: null,
    posterAt: 1.0,
    stills: [
      { src: 'public/products/cursor-source-analyzer/reference-overview.webp', alt: { zh: 'Cursor Source Analyzer 主界面 — 一个编辑器拆成四层', en: 'Cursor Source Analyzer main view — an editor split into four layers' } },
      { src: '/tmp/meteor-product-media/frames/cursor-62.png', alt: { zh: 'Cursor Source Analyzer 四层架构图 — VS Code 基座、AI 集成层、索引检索层、Agent 编排层', en: 'Cursor Source Analyzer four-layer map — VS Code core, AI layer, index layer, agent orchestration' } },
    ],
  },
];

/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const only = argv.includes('--all') ? null : argv[argv.indexOf('--id') + 1];
const skipWebm = argv.includes('--skip-webm');

if (!only && !argv.includes('--all')) {
  console.error('用法：node scripts/build-product-media.mjs --all | --id <productId> [--skip-webm]');
  process.exit(1);
}

const targets = only ? products.filter((p) => p.id === only) : products;
if (targets.length === 0) {
  console.error(`未知产品 id：${only}`);
  process.exit(1);
}

const run = (cmd, args) => {
  try {
    execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    const stderr = error.stderr?.toString().trim();
    throw new Error(`${cmd} 失败：\n${stderr || error.message}`);
  }
};

const probe = (file, entries) =>
  execFileSync('ffprobe', ['-v', 'error', ...entries.flatMap((e) => ['-show_entries', e]), '-of', 'default=nw=1', file])
    .toString()
    .trim();

const fileSize = (file) => statSync(file).size;
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)}MB`;

mkdirSync(TMP, { recursive: true });

const report = [];

for (const product of targets) {
  const outDir = join(OUT_ROOT, product.id);
  mkdirSync(outDir, { recursive: true });

  const filmPath = join(ROOT, product.film);
  if (!existsSync(filmPath)) throw new Error(`宣传片不存在：${product.film}`);

  const duration = Number(probe(filmPath, ['format=duration']).split('=')[1]);
  const [start, end] = product.cut ?? [0, Math.min(duration, 16)];
  const clipLength = end - start;

  const demo = join(outDir, `demo${MEDIA_VERSION}.mp4`);
  const webm = join(outDir, `demo${MEDIA_VERSION}.webm`);
  const poster = join(outDir, `demo-poster${MEDIA_VERSION}.webp`);
  const cover = join(outDir, `cover${MEDIA_VERSION}.webp`);

  console.log(`\n▶ ${product.id}  片段 ${start}s–${end}s（${clipLength.toFixed(1)}s）  ← ${basename(product.film)}`);

  // MP4：H.264 high / 720p / CRF 22。上限 3Mbps 是为了防粒子特效段把码率顶飞。
  run('ffmpeg', [
    '-v', 'error', '-y',
    '-ss', String(start), '-to', String(end), '-i', filmPath,
    '-vf', 'scale=1280:720:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
    '-maxrate', '3M', '-bufsize', '6M',
    '-profile:v', 'high', '-level', '4.0',
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
    '-movflags', '+faststart',
    demo,
  ]);

  if (!skipWebm) {
    run('ffmpeg', [
      '-v', 'error', '-y',
      '-ss', String(start), '-to', String(end), '-i', filmPath,
      '-vf', 'scale=1280:720:flags=lanczos,format=yuv420p',
      '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0',
      '-row-mt', '1', '-cpu-used', '2', '-deadline', 'good',
      '-c:a', 'libopus', '-b:a', '64k', '-ac', '2',
      webm,
    ]);
  }

  // 海报帧：取片段内指定时刻，避开第一帧还在转场的情况。
  const posterPng = join(TMP, `${product.id}-poster.png`);
  run('ffmpeg', [
    '-v', 'error', '-y',
    '-ss', String(product.posterAt ?? start + 0.6),
    '-i', filmPath,
    '-frames:v', '1',
    '-vf', 'scale=1280:720:flags=lanczos',
    posterPng,
  ]);
  run('cwebp', ['-quiet', '-q', '82', '-m', '6', posterPng, '-o', poster]);
  run('cwebp', ['-quiet', '-q', '82', '-m', '6', posterPng, '-o', cover]);

  // 截图：统一 1600×900 居中裁切。源图不够大就报错，不做假放大。
  //
  // 先把**所有**源图复制到 /tmp，再开始写产物。不能边读边写：omnicrawl / ui-design-system
  // 的物料清单里，第 2 张的来源就是第 1 张的产物路径，顺序一错就会拿刚写出的
  // 1600×900 当源，跑出重复图。
  const staged = product.stills.map((still, index) => {
    const src = existsSync(still.src) ? still.src : join(ROOT, still.src);
    if (!existsSync(src)) throw new Error(`截图不存在：${still.src}`);
    const copy = join(TMP, `${product.id}-source-${index + 1}${extname(src) || '.png'}`);
    run('cp', [src, copy]);
    return { ...still, src: copy, origin: src };
  });

  const shotResults = [];
  staged.forEach((still, index) => {
    const src = still.src;
    const out = join(outDir, `screenshot-${index + 1}${MEDIA_VERSION}.webp`);

    const dims = probe(src, ['stream=width,height']);
    const width = Number(dims.match(/width=(\d+)/)?.[1]);
    const height = Number(dims.match(/height=(\d+)/)?.[1]);
    if (!width || !height) throw new Error(`读不到尺寸：${still.src}`);
    // 1600×900 是目标；少数源图只有 1512×810（Retina 截屏），退到 1440×810，
    // 仍然远高于页面实际渲染尺寸，不做放大。
    const targetWidth = width >= 1600 && height >= 900 ? 1600 : 1440;
    const targetHeight = targetWidth === 1600 ? 900 : 810;
    if (width < targetWidth || height < targetHeight) {
      throw new Error(`源图只有 ${width}×${height}，不足 ${targetWidth}×${targetHeight}：${still.src}`);
    }

    const png = join(TMP, `${product.id}-shot-${index + 1}.png`);
    run('ffmpeg', [
      '-v', 'error', '-y', '-i', src, '-frames:v', '1',
      '-vf', `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=increase:flags=lanczos,crop=${targetWidth}:${targetHeight}`,
      png,
    ]);
    run('cwebp', ['-quiet', '-q', '84', '-m', '6', png, '-o', out]);
    shotResults.push({ out: `screenshot-${index + 1}${MEDIA_VERSION}.webp`, src: `${width}×${height}`, size: fileSize(out) });
  });

  report.push({
    id: product.id,
    clip: `${start}s–${end}s`,
    mp4: fileSize(demo),
    webm: skipWebm ? null : fileSize(webm),
    poster: fileSize(poster),
    stills: shotResults,
  });

  console.log(`   demo.mp4 ${mb(fileSize(demo))}${skipWebm ? '' : ` · demo.webm ${mb(fileSize(webm))}`} · poster ${mb(fileSize(poster))}`);
  shotResults.forEach((s) => console.log(`   ${s.out}  ← ${s.src}  ${mb(s.size)}`));
}

const summaryPath = join(TMP, 'build-report.json');
writeFileSync(summaryPath, JSON.stringify(report, null, 2));
console.log(`\n构建完成，报告：${summaryPath}`);
