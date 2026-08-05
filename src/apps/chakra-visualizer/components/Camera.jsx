// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useGame } from "../GameContext";
import { useLanguage } from "../LanguageContext";
// @mediapipe/* 均为 UMD 全局脚本，无 ESM 导出，各自把 Hands/Camera/HAND_CONNECTIONS/drawConnectors 挂到 globalThis
import "@mediapipe/hands";
import "@mediapipe/camera_utils";
import "@mediapipe/drawing_utils";

// 模块导入
import { createGestureDetector, SEAL_NAMES, getGestureName } from "../modules/gesture";
import { createEffectsSystem } from "../modules/effects";
import { createSealSystem } from "../modules/seal";
import { createParticleSystem } from "../modules/particles";
import { drawJutsuEffect } from "../utils/jutsu-renderer";
import CharacterSilhouette from "./CharacterSilhouette";

export default function CameraComponent({ onBack, initialJutsu }) {
  const { config, onSealSuccess, onSealInterrupted, onUltRelease, score, combo, perfectCount } = useGame();
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const langRef = useRef(lang);
  langRef.current = lang;
  const isZhRef = useRef(isZh);
  isZhRef.current = isZh;
  const [cameraError, setCameraError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(true);

  // ========== Refs ==========
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fxCanvasRef = useRef(null);
  const sealCanvasRef = useRef(null); // 结印 UI 面板（normal 混合模式，确保深色背景可见）
  const rasenganRef = useRef(null);
  const chidoriRef = useRef(null);
  const fireballRef = useRef(null);

  // 功率状态
  const power = useRef([0, 0]);
  const wasOpen = useRef([false, false]);
  const wasTiger = useRef([false, false]);
  const fireballPower = useRef([0, 0]);
  const hollowPurpleSize = useRef(0);
  const hollowPurplePos = useRef({ x: 0, y: 0 });
  const wasPinching = useRef(false);

  // 写轮眼
  const sharinganPower = useRef([0, 0]);
  const wasScissor = useRef([false, false]);
  const sharinganSize = useRef(0);

  // 影分身
  const shadowClonePower = useRef([0, 0]);
  const wasRock = useRef([false, false]);
  const cloneHandData = useRef(null);

  // 八门遁甲
  const eightGatesPower = useRef([0, 0]);
  const wasFist = useRef([false, false]);
  const gatesCenter = useRef({ x: 0, y: 0 });

  // 地爆天星
  const chibakuPower = useRef([0, 0]);
  const wasPalmDown = useRef([false, false]);
  const chibakuSphereSize = useRef(0);
  const chibakuPos = useRef({ x: 0, y: 0 });

  // 结印模式
  const sealMode = useRef(false);
  const selectedUltRef = useRef(initialJutsu || null); // 选中的忍术 ID，null 为自由模式
  const pinchHoldTime = useRef(0);
  const lastPinchState = useRef(false);
  const SEAL_MODE_HOLD = 2000;

  // 手势灵动岛状态
  const gestureIsland = useRef({
    currentSeal: null,    // 当前检测到的结印
    lastSealTime: 0,      // 上次检测时间
    animProgress: 0,      // 入场动画 0→1
    prevSeal: null,       // 上一个结印（用于切换动画）
    pulseAlpha: 0,        // 脉冲光效
  });

  // 剪影状态（ref-based，避免 rAF 中 setState）
  const silhouetteRef = useRef({ visible: false, jutsuId: null, progress: 0 });

  // 动画帧
  const animFrameRef = useRef(null);

  // 模块实例引用
  const gestureRef = useRef(null);
  const effectsRef = useRef(null);
  const sealRef = useRef(null);
  const particleSystemRef = useRef(null);

  // 配置引用
  const configRef = useRef(config);
  configRef.current = config;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const comboRef = useRef(combo);
  comboRef.current = combo;
  const perfectCountRef = useRef(perfectCount);
  perfectCountRef.current = perfectCount;
  const onUltReleaseRef = useRef(onUltRelease);
  onUltReleaseRef.current = onUltRelease;
  const onSealSuccessRef = useRef(onSealSuccess);
  onSealSuccessRef.current = onSealSuccess;
  const onSealInterruptedRef = useRef(onSealInterrupted);
  onSealInterruptedRef.current = onSealInterrupted;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const fxCanvas = fxCanvasRef.current;
    const sealCanvas = sealCanvasRef.current;
    const rasengan = rasenganRef.current;
    const chidori = chidoriRef.current;
    const fireball = fireballRef.current;

    // null 检查，防止组件快速挂载/卸载时 ref 未赋值
    if (!video || !canvas || !fxCanvas || !sealCanvas || !rasengan || !chidori || !fireball) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const fxCtx = fxCanvas.getContext("2d");
    const sealCtx = sealCanvas.getContext("2d");

    // 初始化模块（左右手各一个检测器，避免手势历史混杂）
    const gestureLeft = createGestureDetector({
      gestureFrames: configRef.current.gestureFrames || 3,
      minConfidence: 0.6,
    });
    const gestureRight = createGestureDetector({
      gestureFrames: configRef.current.gestureFrames || 3,
      minConfidence: 0.6,
    });
    gestureRef.current = { left: gestureLeft, right: gestureRight };

    const particleSystem = createParticleSystem(800);
    particleSystemRef.current = particleSystem;

    const effects = createEffectsSystem({
      particleLimit: 800,
      getTime: () => Date.now() * 0.001,
      particleSystem,
    });
    effectsRef.current = effects;

    const sealSystem = createSealSystem({
      ultDuration: configRef.current.ultDuration || 3000,
      ultCooldown: configRef.current.ultCooldown || 8000,
      onSealSuccess: () => onSealSuccessRef.current?.(),
      onSealInterrupted: () => onSealInterruptedRef.current?.(),
    });
    sealRef.current = sealSystem;

    // 如果从菜单选了特定忍术，自动进入结印模式并设置过滤器
    if (selectedUltRef.current) {
      sealMode.current = true;
      sealSystem.setFilterUlt(selectedUltRef.current);
    }

    // 动画循环
    function animateEffects() {
      animFrameRef.current = requestAnimationFrame(animateEffects);

      const now = Date.now();
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (fxCanvas.width !== w || fxCanvas.height !== h) {
        fxCanvas.width = w;
        fxCanvas.height = h;
        sealCanvas.width = w;
        sealCanvas.height = h;
      }
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      sealCtx.clearRect(0, 0, sealCanvas.width, sealCanvas.height);

      // 大师模式屏幕震动
      const shouldShake = configRef.current.screenShake && sealSystem.ultActive;
      if (shouldShake) {
        const shakeIntensity = 4;
        const sx = (Math.random() - 0.5) * shakeIntensity;
        const sy = (Math.random() - 0.5) * shakeIntensity;
        fxCtx.save();
        fxCtx.translate(sx, sy);
      }

      try {
      // 写轮眼
      const ssSize = sharinganSize.current;
      if (ssSize > 2) {
        const totalPwr = sharinganPower.current[0] + sharinganPower.current[1];
        effects.drawSharingan(fxCtx, w / 2, h / 3, ssSize, totalPwr);
        effects.spawnSharinganParticles(particleSystem.particles, w / 2, h / 3, ssSize);
      }

      // 影分身
      const maxClonePwr = Math.max(shadowClonePower.current[0], shadowClonePower.current[1]);
      if (cloneHandData.current && maxClonePwr > 0.01) {
        effects.drawShadowClone(fxCtx, cloneHandData.current, maxClonePwr, globalThis.HAND_CONNECTIONS);
        const cd = cloneHandData.current;
        const cx = (cd[0].x + cd[9].x) / 2 * w;
        const cy = (cd[0].y + cd[9].y) / 2 * h;
        effects.spawnSmokeParticles(particleSystem.particles, cx, cy);
      }

      // 八门遁甲
      const maxGatesPwr = Math.max(eightGatesPower.current[0], eightGatesPower.current[1]);
      if (maxGatesPwr > 0.01) {
        effects.drawEightGates(fxCtx, gatesCenter.current.x, gatesCenter.current.y, maxGatesPwr);
        effects.spawnAuraParticles(particleSystem.particles, gatesCenter.current.x, gatesCenter.current.y, maxGatesPwr);
      }

      // 地爆天星
      const cSize = chibakuSphereSize.current;
      if (cSize > 2) {
        const maxChibakuPwr = Math.max(chibakuPower.current[0], chibakuPower.current[1]);
        effects.drawChibakuTensei(fxCtx, chibakuPos.current.x, chibakuPos.current.y, cSize, maxChibakuPwr);
        effects.spawnDebrisParticles(particleSystem.particles, chibakuPos.current.x, chibakuPos.current.y, cSize);
      }

      // 虚式紫
      const hpSize = hollowPurpleSize.current;
      if (hpSize > 2) {
        effects.spawnParticles(particleSystem.particles, hollowPurplePos.current.x, hollowPurplePos.current.y, hpSize);
        effects.drawHollowPurple(fxCtx, hollowPurplePos.current.x, hollowPurplePos.current.y, hpSize);
      }

      // 大招渲染
      const ultInfo = sealSystem.getUltInfo(now);
      if (ultInfo) {
        const { type, x, y, progress } = ultInfo;

        // 更新剪影（ref-based，直接操作 DOM，无 re-render）
        silhouetteRef.current?.update(type, progress, true);

        // 使用共享的大招渲染逻辑
        drawJutsuEffect(fxCtx, effects, particleSystem, type, x, y, progress);
      } else {
        // 大招结束，隐藏剪影
        silhouetteRef.current?.update(null, 0, false);
      }

      // 大师模式 HUD
      if (configRef.current.enableScoring) {
        fxCtx.save();
        fxCtx.font = 'bold 32px "Bebas Neue", sans-serif';
        fxCtx.textAlign = 'left';
        fxCtx.fillStyle = 'rgba(255,255,255,0.8)';
        fxCtx.fillText(`SCORE: ${scoreRef.current}`, 24, 45);

        if (comboRef.current > 1) {
          fxCtx.font = 'bold 22px "Bebas Neue", sans-serif';
          fxCtx.fillStyle = '#ff5252';
          fxCtx.fillText(`${comboRef.current}x COMBO`, 24, 72);
          fxCtx.font = '14px "Rajdhani", sans-serif';
          fxCtx.fillStyle = 'rgba(255,82,82,0.7)';
          fxCtx.fillText(`×${(1 + (comboRef.current - 1) * 0.5).toFixed(1)} multiplier`, 24, 90);
        }

        if (perfectCountRef.current > 0) {
          fxCtx.font = '14px "Rajdhani", sans-serif';
          fxCtx.textAlign = 'right';
          fxCtx.fillStyle = '#fbbf24';
          fxCtx.fillText(`✨ Perfect: ${perfectCountRef.current}`, fxCanvas.width - 24, 45);
        }
        fxCtx.restore();
      }

      // ═══ 手势灵动岛（新手模式，绘制在 sealCanvas 上） ═══
      if (configRef.current.showHandName && !sealMode.current) {
        const island = gestureIsland.current;
        const nowMs = Date.now();

        // 动画进度（入场 300ms）
        if (island.animProgress < 1) {
          island.animProgress = Math.min(1, (nowMs - island.lastSealTime) / 300);
        }
        // 脉冲衰减
        if (island.pulseAlpha > 0) {
          island.pulseAlpha = Math.max(0, island.pulseAlpha - 0.02);
        }

        // 无手势时 2s 后淡出
        const idle = nowMs - island.lastSealTime;
        const fadeOut = idle > 2000 ? Math.max(0, 1 - (idle - 2000) / 800) : 1;
        const showIsland = island.currentSeal && fadeOut > 0;

        if (showIsland) {
          sealCtx.save();
          const W = sealCanvas.width;
          const H = sealCanvas.height;
          const ease = 1 - Math.pow(1 - island.animProgress, 3); // easeOutCubic
          const alpha = ease * fadeOut;

          // 灵动岛尺寸
          const pillW = 320;
          const pillH = 80;
          const pillX = W / 2 - pillW / 2;
          const pillY = H - 160;
          const pillR = pillH / 2;

          // 入场缩放
          const scale = 0.6 + ease * 0.4;
          sealCtx.translate(W / 2, pillY + pillH / 2);
          sealCtx.scale(scale, scale);
          sealCtx.translate(-W / 2, -(pillY + pillH / 2));

          // 脉冲外圈光效
          if (island.pulseAlpha > 0) {
            const pulseR = pillR + 8 + island.pulseAlpha * 12;
            sealCtx.beginPath();
            sealCtx.roundRect(pillX - 8, pillY - 8, pillW + 16, pillH + 16, pulseR);
            sealCtx.strokeStyle = `rgba(168,85,247,${island.pulseAlpha * 0.6})`;
            sealCtx.lineWidth = 3;
            sealCtx.stroke();
          }

          // 紫色渐变背景
          const grad = sealCtx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
          grad.addColorStop(0, `rgba(88,28,135,${0.92 * alpha})`);   // purple-900
          grad.addColorStop(0.5, `rgba(126,34,206,${0.88 * alpha})`); // purple-700
          grad.addColorStop(1, `rgba(147,51,234,${0.85 * alpha})`);  // purple-600
          sealCtx.beginPath();
          sealCtx.roundRect(pillX, pillY, pillW, pillH, pillR);
          sealCtx.fillStyle = grad;
          sealCtx.fill();

          // 高光条（顶部）
          const highlightGrad = sealCtx.createLinearGradient(pillX, pillY, pillX, pillY + pillH * 0.4);
          highlightGrad.addColorStop(0, `rgba(255,255,255,${0.15 * alpha})`);
          highlightGrad.addColorStop(1, `rgba(255,255,255,0)`);
          sealCtx.beginPath();
          sealCtx.roundRect(pillX + 2, pillY + 2, pillW - 4, pillH * 0.4, [pillR - 2, pillR - 2, 0, 0]);
          sealCtx.fillStyle = highlightGrad;
          sealCtx.fill();

          // 边框
          sealCtx.beginPath();
          sealCtx.roundRect(pillX, pillY, pillW, pillH, pillR);
          sealCtx.strokeStyle = `rgba(192,132,252,${0.4 * alpha})`;
          sealCtx.lineWidth = 1.5;
          sealCtx.stroke();

          // 当前手势 Emoji（左侧大号）
          const info = island.currentSeal;
          sealCtx.font = '36px sans-serif';
          sealCtx.fillStyle = `rgba(255,255,255,${alpha})`;
          sealCtx.textAlign = 'center';
          sealCtx.fillText(info.emoji, pillX + 44, pillY + pillH / 2 + 4);

          // 地支字（中左）
          sealCtx.font = 'bold 22px "Rajdhani", sans-serif';
          sealCtx.fillStyle = `rgba(255,255,255,${0.95 * alpha})`;
          sealCtx.fillText(info.seal, pillX + 100, pillY + pillH / 2 - 4);

          // 手势名称（中右）
          sealCtx.font = '15px "Rajdhani", sans-serif';
          sealCtx.fillStyle = `rgba(192,132,252,${0.9 * alpha})`;
          sealCtx.fillText(getGestureName(info, langRef.current), pillX + 100, pillY + pillH / 2 + 16);

          // 右侧：所有手势缩略指示
          const allSeals = ['子','丑','寅','卯','辰','巳','午','未'];
          const allEmojis = ['👊','🖐️','✌️','👍','🤘','🤏','🖐️↓','☝️'];
          const dotStartX = pillX + pillW - 120;
          const dotY = pillY + pillH / 2;
          for (let s = 0; s < allSeals.length; s++) {
            const dx = dotStartX + s * 14;
            const isActive = allSeals[s] === info.seal;
            sealCtx.beginPath();
            sealCtx.arc(dx, dotY, isActive ? 5 : 3, 0, Math.PI * 2);
            sealCtx.fillStyle = isActive
              ? `rgba(250,204,21,${alpha})`   // 黄色高亮
              : `rgba(255,255,255,${0.25 * alpha})`;
            sealCtx.fill();
          }

          // 底部小字提示
          sealCtx.font = '11px "Rajdhani", sans-serif';
          sealCtx.fillStyle = `rgba(255,255,255,${0.5 * alpha})`;
          sealCtx.textAlign = 'center';
          const hintMap = isZhRef.current
            ? '握拳=子 · 张掌=丑 · V字=寅 · 竖拇指=卯 · 摇滚=辰 · 捏合=巳 · 掌朝下=午 · 食指=未'
            : 'Fist=子 · Palm=丑 · V=寅 · Thumb=卯 · Rock=辰 · Pinch=巳 · PalmDown=午 · Index=未';
          sealCtx.fillText(hintMap, W / 2, pillY + pillH + 16);

          sealCtx.restore();
        }
      }

      // 结印模式指示器（绘制在 sealCanvas 上，使用 normal 混合模式确保深色背景可见）
      if (sealMode.current) {
        sealCtx.save();
        sealCtx.textAlign = 'center';

        // 深色半透明遮罩（提高对比度）
        sealCtx.fillStyle = 'rgba(198,40,40,0.12)';
        sealCtx.fillRect(0, 0, sealCanvas.width, sealCanvas.height);

        // 标题背景条
        sealCtx.fillStyle = 'rgba(0,0,0,0.6)';
        sealCtx.fillRect(0, 55, sealCanvas.width, 60);

        // 标题：指定忍术时显示忍术名，自由模式显示"结印模式"
        const ultTitle = selectedUltRef.current
          ? `🔮 ${sealSystem.getUltName(selectedUltRef.current)}`
          : isZhRef.current ? '🔮 结印模式' : '🔮 Seal Mode';
        sealCtx.shadowColor = 'rgba(0,0,0,0.8)';
        sealCtx.shadowBlur = 8;
        sealCtx.font = 'bold 24px "Bebas Neue", sans-serif';
        sealCtx.fillStyle = '#ff5252';
        sealCtx.fillText(ultTitle, sealCanvas.width / 2, 78);
        sealCtx.shadowBlur = 0;
        sealCtx.shadowColor = 'transparent';

        // 副标题
        sealCtx.font = '13px "Rajdhani", sans-serif';
        sealCtx.fillStyle = 'rgba(255,255,255,0.85)';
        const subTitle = isZhRef.current
          ? (selectedUltRef.current
              ? '按顺序完成结印释放忍术 · 捏合2秒退出'
              : '按顺序做出手势触发大招 · 捏合2秒退出')
          : (selectedUltRef.current
              ? 'Complete seals in order to cast · Pinch 2s to exit'
              : 'Perform gestures in sequence to trigger ults · Pinch 2s to exit');
        sealCtx.fillText(subTitle, sealCanvas.width / 2, 100);

        sealCtx.restore();
      }

      // 结印显示（绘制在 sealCanvas 上，normal 混合模式确保深色面板可见）
      if (sealMode.current || sealSystem.getComboDisplay().length > 0) {
        sealSystem.drawSealDisplay(sealCtx, sealCanvas.width, sealCanvas.height, now, SEAL_NAMES, selectedUltRef.current, langRef.current);
      }

      // 更新粒子
      effects.updateParticles(fxCtx, particleSystem.particles);

      } finally {
        // 恢复屏幕震动（确保在异常情况下也能恢复 Canvas 状态）
        if (shouldShake) {
          fxCtx.restore();
        }
      }
    }

    animateEffects();

    // 缓存 canvas 尺寸，避免每帧重设触发 backing store 重分配
    let lastCanvasWidth = 0;
    let lastCanvasHeight = 0;

    // 手势识别回调
    function onResults(res) {
      // 仅在尺寸变化时重设 canvas（避免每帧触发 GPU 内存重分配）
      if (video.videoWidth !== lastCanvasWidth || video.videoHeight !== lastCanvasHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        lastCanvasWidth = video.videoWidth;
        lastCanvasHeight = video.videoHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rasengan.style.display = "none";
      chidori.style.display = "none";
      fireball.style.display = "none";

      let pinchDetected = false;
      let anyRock = false;
      let openHandCount = 0;
      let ultTriggeredThisFrame = false; // 防止单手和双手结印在同一帧触发两次大招

      if (res.multiHandLandmarks && res.multiHandedness) {
        res.multiHandLandmarks.forEach((pts, i) => {
          if (!pts || pts.length < 21) return; // MediaPipe 偶尔返回不完整数据
          const label = res.multiHandedness[i].label;
          const isRight = label === "Right";
          const idx = isRight ? 1 : 0;

          globalThis.drawConnectors(ctx, pts, globalThis.HAND_CONNECTIONS, { color: "#00d4ff", lineWidth: 3 });
          globalThis.drawLandmarks(ctx, pts, { color: "#fff", radius: 2 });

          // 使用对应手的检测器（左右手独立历史，避免混杂）
          const g = isRight ? gestureRight : gestureLeft;

          // 检测手势
          const seal = g.detect(pts);

          // 手势优先级链
          const fist     = g.checkFist(pts);
          const scissor  = !fist && g.checkScissor(pts);
          const rock     = !fist && !scissor && g.checkRock(pts);
          const palmDown = !fist && !scissor && !rock && g.checkPalmDown(pts);
          const gun      = !fist && !scissor && !rock && !palmDown && g.checkGun(pts);
          const phone    = !fist && !scissor && !rock && !palmDown && !gun && g.checkPhone(pts);
          const pinky    = !fist && !scissor && !rock && !palmDown && !gun && !phone && g.checkPinky(pts);
          const open     = !fist && !scissor && !rock && !palmDown && !gun && !phone && !pinky && g.checkOpen(pts);
          const pinch    = !open && !fist && !scissor && !rock && !palmDown && !gun && !phone && !pinky && g.checkPinch(pts);
          const tiger    = !open && !pinch && !fist && !scissor && !rock && !palmDown && !gun && !phone && !pinky && g.checkTiger(pts);

          // 新手模式：更新灵动岛状态
          if (configRef.current.showHandName && seal) {
            const island = gestureIsland.current;
            if (seal.seal !== island.currentSeal) {
              island.prevSeal = island.currentSeal;
              island.currentSeal = seal;
              island.lastSealTime = Date.now();
              island.animProgress = 0;
              island.pulseAlpha = 1;
            }
          }

          // 捏合进度条
          if (pinch && pinchHoldTime.current > 0) {
            const held = Date.now() - pinchHoldTime.current;
            const progress = Math.min(1, held / SEAL_MODE_HOLD);
            const wrist = pts[0];
            const px = (1 - wrist.x) * canvas.width;
            const py = wrist.y * canvas.height - 50;
            ctx.save();
            // 暗色背景提高对比度
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath();
            ctx.roundRect(px - 40, py - 18, 80, 30, 6);
            ctx.fill();
            // 进度条底色
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(px - 30, py + 2, 60, 6);
            // 进度条填充
            ctx.fillStyle = sealMode.current ? 'rgba(34,197,94,0.9)' : 'rgba(198,40,40,0.9)';
            ctx.fillRect(px - 30, py + 2, 60 * progress, 6);
            // 提示文字
            ctx.font = 'bold 11px "Rajdhani", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(sealMode.current ? (isZhRef.current ? '退出结印' : 'Exit Seal') : (isZhRef.current ? '进入结印' : 'Enter Seal'), px, py - 2);
            ctx.restore();
          }

          if (rock) anyRock = true;
          if (open) openHandCount++;

          const wrist = pts[0];
          const knuckle = pts[9];
          const tx = (wrist.x + knuckle.x) / 2;
          const ty = (wrist.y + knuckle.y) / 2;
          const screenX = (1 - tx) * window.innerWidth;
          const screenY = ty * window.innerHeight;

          // 捏合长按切换结印模式
          if (pinch && !lastPinchState.current) {
            pinchHoldTime.current = Date.now();
          }
          if (pinch && pinchHoldTime.current > 0) {
            const held = Date.now() - pinchHoldTime.current;
            if (held >= SEAL_MODE_HOLD) {
              sealMode.current = !sealMode.current;
              pinchHoldTime.current = 0;
              sealSystem.reset();
              // 退出结印模式时清除过滤器（回到自由模式）
              if (!sealMode.current) {
                sealSystem.setFilterUlt(null);
                selectedUltRef.current = null;
              }
            }
          }
          if (!pinch) pinchHoldTime.current = 0;
          lastPinchState.current = pinch;

          // 结印检测
          if (sealMode.current && seal && !sealRef.current.ultActive && sealRef.current.ultCooldown <= Date.now()) {
            const match = sealRef.current.pushSeal(seal);
            if (match) {
              sealSystem.startUlt(match, screenX, screenY);
              sealMode.current = false;
              ultTriggeredThisFrame = true; // 标记本帧已触发大招
              if (onUltReleaseRef.current) onUltReleaseRef.current(match);
            }
          }

          // 八门遁甲
          eightGatesPower.current[idx] += fist ? 0.05 : -0.15;
          eightGatesPower.current[idx] = Math.max(0, Math.min(1, eightGatesPower.current[idx]));
          wasFist.current[idx] = fist;
          if (eightGatesPower.current[idx] > 0.01) {
            gatesCenter.current = { x: screenX, y: screenY };
          }

          // 写轮眼
          sharinganPower.current[idx] += scissor ? 0.05 : -0.15;
          sharinganPower.current[idx] = Math.max(0, Math.min(1, sharinganPower.current[idx]));
          wasScissor.current[idx] = scissor;
          sharinganSize.current = scissor
            ? Math.min(sharinganSize.current + 1.0, 120)
            : Math.max(sharinganSize.current - 3.0, 0);

          // 影分身
          shadowClonePower.current[idx] += rock ? 0.05 : -0.15;
          shadowClonePower.current[idx] = Math.max(0, Math.min(1, shadowClonePower.current[idx]));
          wasRock.current[idx] = rock;
          if (rock) cloneHandData.current = pts.map(p => ({ x: p.x, y: p.y, z: p.z }));

          // 地爆天星
          chibakuPower.current[idx] += palmDown ? 0.05 : -0.15;
          chibakuPower.current[idx] = Math.max(0, Math.min(1, chibakuPower.current[idx]));
          wasPalmDown.current[idx] = palmDown;
          chibakuSphereSize.current = palmDown
            ? Math.min(chibakuSphereSize.current + 0.8, 100)
            : Math.max(chibakuSphereSize.current - 2.0, 0);
          if (palmDown) {
            chibakuPos.current = { x: screenX, y: screenY - 150 };
          }

          // 螺旋丸 / 千鸟
          power.current[idx] += open ? 0.05 : -0.15;
          power.current[idx] = Math.max(0, Math.min(1, power.current[idx]));
          if (open && !wasOpen.current[idx]) {
            const vid = isRight ? chidori : rasengan;
            vid.currentTime = 0;
            vid.play().catch(() => {});
          }
          wasOpen.current[idx] = open;

          if (power.current[idx] > 0.01) {
            const vid = isRight ? chidori : rasengan;
            vid.style.left = `${screenX}px`;
            vid.style.top = `${screenY}px`;
            vid.style.opacity = power.current[idx];
            vid.style.display = "block";
          }

          // 火球术
          fireballPower.current[idx] += tiger ? 0.05 : -0.15;
          fireballPower.current[idx] = Math.max(0, Math.min(1, fireballPower.current[idx]));
          if (tiger && !wasTiger.current[idx]) {
            fireball.currentTime = 0;
            fireball.play().catch(() => {});
          }
          wasTiger.current[idx] = tiger;

          if (fireballPower.current[idx] > 0.01) {
            fireball.style.left = `${screenX}px`;
            fireball.style.top = `${screenY}px`;
            fireball.style.opacity = 1;
            fireball.style.display = "block";
          }

          // 虚式紫
          if (pinch) {
            pinchDetected = true;
            const thumbTip = pts[4];
            const middleTip = pts[12];
            const mx = (1 - (thumbTip.x + middleTip.x) / 2) * window.innerWidth;
            const my = ((thumbTip.y + middleTip.y) / 2) * window.innerHeight;
            hollowPurplePos.current = { x: mx, y: my };
            hollowPurpleSize.current = Math.min(hollowPurpleSize.current + 1.2, 150);
            wasPinching.current = true;
          }
        });
      }

      if (!pinchDetected) {
        hollowPurpleSize.current = Math.max(0, hollowPurpleSize.current - 4);
        wasPinching.current = false;
      }

      // 双手结印检测（在 forEach 循环外，避免竞态条件）
      // 只有在单手结印未触发大招时才尝试双手结印
      if (sealMode.current && !sealRef.current.ultActive && sealRef.current.ultCooldown <= Date.now()
        && res.multiHandLandmarks && res.multiHandLandmarks.length >= 2 && !ultTriggeredThisFrame) {
        const hands = res.multiHandLandmarks;
        let dblSeal = null;

        // 双手结印检测逻辑
        if (hands.length >= 2) {
          const leftHand = hands[0];
          const rightHand = hands[1];

          // 双手握拳（子）
          const leftFist = gestureLeft.checkFist(leftHand);
          const rightFist = gestureRight.checkFist(rightHand);
          if (leftFist && rightFist) dblSeal = '子';
          // 双手张开（丑）
          else if (gestureLeft.checkOpen(leftHand) && gestureRight.checkOpen(rightHand)) dblSeal = '丑';
          // 双手V字（寅）
          else if (gestureLeft.checkScissor(leftHand) && gestureRight.checkScissor(rightHand)) dblSeal = '寅';
          // 双手摇滚（辰）
          else if (gestureLeft.checkRock(leftHand) && gestureRight.checkRock(rightHand)) dblSeal = '辰';
          // 双手捏合（巳）
          else if (gestureLeft.checkPinch(leftHand) && gestureRight.checkPinch(rightHand)) dblSeal = '巳';
        }

        if (dblSeal) {
          const sealObj = SEAL_NAMES[dblSeal];
          if (sealObj) {
            const match = sealRef.current.pushSeal(sealObj);
            if (match) {
              sealRef.current.startUlt(match, window.innerWidth / 2, window.innerHeight / 2);
              sealMode.current = false;
              if (onUltReleaseRef.current) onUltReleaseRef.current(match);
            }
          }
        }
      }

      // 手离开画面后衰减（减慢衰减速度，让特效更丝滑）
      for (let i = 0; i < 2; i++) {
        power.current[i] = Math.max(0, power.current[i] - 0.01);
        fireballPower.current[i] = Math.max(0, fireballPower.current[i] - 0.01);
        sharinganPower.current[i] = Math.max(0, sharinganPower.current[i] - 0.01);
        shadowClonePower.current[i] = Math.max(0, shadowClonePower.current[i] - 0.01);
        eightGatesPower.current[i] = Math.max(0, eightGatesPower.current[i] - 0.01);
        chibakuPower.current[i] = Math.max(0, chibakuPower.current[i] - 0.01);
      }

      if (!anyRock) {
        cloneHandData.current = null;
      }
    }

    // 初始化 MediaPipe（异步 IIFE，因为 useEffect 回调不能直接 await）
    // 使用 ref 存储 cam/handsInstance，确保 cleanup 能正确读取（即使 IIFE 未完成）
    const camRef = { current: null };
    const handsRef = { current: null };
    let stopped = false;

    (async () => {
      try {
        console.log('[Chakra] Initializing MediaPipe Hands...');
        const hands = new globalThis.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        handsRef.current = hands;

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65
        });

        hands.onResults(onResults);

        console.log('[Chakra] Starting camera...');
        const cam = new globalThis.Camera(video, {
          onFrame: async () => {
            if (!stopped && handsRef.current) {
              try {
                await handsRef.current.send({ image: video });
              } catch (e) {
                // 开发环境下输出警告，便于调试
                if (process.env.NODE_ENV !== 'production') console.warn('[Chakra] hands.send error:', e);
              }
            }
          },
          width: 1280,
          height: 720
        });
        camRef.current = cam;

        // 检查是否已在 await 期间被 cleanup
        if (stopped) {
          cam.stop();
          return;
        }

        await cam.start();
        console.log('[Chakra] Camera started successfully');
        if (!stopped) setCameraLoading(false);
      } catch (err) {
        console.error('[Chakra] Camera/MediaPipe initialization failed:', err);
        if (!stopped) {
          setCameraLoading(false);
          const errMsg = isZhRef.current
            ? '摄像头初始化失败。请确认已授予浏览器摄像头权限，且使用 HTTPS 访问。'
            : 'Camera init failed. Please grant camera permission and use HTTPS.';
          setCameraError(err.message || errMsg);
        }
      }
    })();

    return () => {
      stopped = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (camRef.current) camRef.current.stop();
      // 暂停所有视频元素，防止卸载过程中继续播放
      [rasenganRef, chidoriRef, fireballRef].forEach(ref => {
        if (ref.current) ref.current.pause();
      });
      if (handsRef.current) {
        handsRef.current.close().catch(() => {}).finally(() => {
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
          }
        });
      } else if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
      }
      // 清理粒子系统
      if (particleSystemRef.current) {
        particleSystemRef.current.clear();
      }
    };
  }, []);

  return (
    <>
      {cameraLoading && !cameraError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(0,0,0,0.85)', color: '#fff', zIndex: 1000,
          fontFamily: '"Rajdhani", sans-serif'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>🌀</div>
          <div style={{ fontSize: '1.3rem', color: '#00d4ff' }}>
            {isZh ? '正在加载手部识别模型...' : 'Loading hand recognition model...'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
            {isZh ? '首次加载需下载 ~5MB 模型，请耐心等待' : 'First load downloads ~5MB model, please wait'}
          </div>
        </div>
      )}
      {cameraError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(0,0,0,0.9)', color: '#fff', zIndex: 1000, padding: '2rem',
          fontFamily: '"Rajdhani", sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff5252', marginBottom: '1rem' }}>
            {isZh ? '摄像头初始化失败' : 'Camera Init Failed'}
          </div>
          <div style={{ fontSize: '1.1rem', color: '#ccc', maxWidth: '500px', textAlign: 'center', lineHeight: 1.6 }}>
            {cameraError}
          </div>
          <button
            onClick={onBack}
            style={{
              marginTop: '2rem', padding: '0.8rem 2rem', background: '#ff5252', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer'
            }}
          >
            {isZh ? '← 返回' : '← Back'}
          </button>
        </div>
      )}
      <video id="webcam" ref={videoRef} autoPlay playsInline></video>
      <canvas id="landmark-canvas" ref={canvasRef}></canvas>

      <canvas
        ref={fxCanvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 10,
          mixBlendMode: "screen",
          transform: "none"
        }}
      />

      <CharacterSilhouette
        ref={silhouetteRef}
      />

      <canvas
        ref={sealCanvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 11,
          mixBlendMode: "normal",
          transform: "none"
        }}
      />

      <video
        ref={rasenganRef}
        id="rasengan"
        className="fx"
        src="/apps/chakra-visualizer/assets/naruto.mp4"
        muted
        loop
        style={{ display: "none" }}
      />

      <video
        ref={chidoriRef}
        id="chidori"
        className="fx"
        src="/apps/chakra-visualizer/assets/chidori.mp4"
        muted
        loop
        style={{ display: "none" }}
      />

      <video
        ref={fireballRef}
        id="fireball"
        className="fx"
        src="/apps/chakra-visualizer/assets/fireball.mp4"
        muted
        loop
        style={{ display: "none" }}
      />
      <button className="back-btn" onClick={onBack}>
        {isZh ? '← 返回' : '← Back'}
      </button>
    </>
  );
}
