// @ts-nocheck
/* eslint-disable */
/**
 * 特效渲染模块
 *
 * 提供粒子生成和特效绘制函数。
 * 所有函数接收 ctx（Canvas 2D context）和时间参数，不直接访问 DOM。
 */

/**
 * 创建特效渲染系统
 *
 * @param {Object} config - 配置
 * @param {number} config.particleLimit - 粒子数量上限
 * @param {Function} config.getTime - 返回当前帧时间（秒），默认 Date.now()*0.001
 * @param {Object} config.particleSystem - 粒子系统实例（可选，用于对象池）
 * @returns {Object} 特效渲染 API
 */
export function createEffectsSystem(config = {}) {
  const { particleLimit = 1500, getTime = () => Date.now() * 0.001, particleSystem = null } = config;

  // 获取粒子对象（优先使用对象池）
  function acquireParticle() {
    if (particleSystem && particleSystem.acquireParticle) {
      return particleSystem.acquireParticle();
    }
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      life: 1, decay: 0.01, size: 5,
      color: 'rgba(255,255,255,', type: 'default',
      rotation: 0, rotSpeed: 0, targetX: 0, targetY: 0,
    };
  }

  // 释放粒子对象（归还到对象池）
  function releaseParticle(p) {
    if (particleSystem && particleSystem.releaseParticle) {
      particleSystem.releaseParticle(p);
    }
  }

  // ==================== 粒子生成 ====================

  /**
   * 默认粒子（螺旋丸/虚式紫等）
   */
  function spawnParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const p = acquireParticle();
      p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 1;
      p.decay = 0.015 + Math.random() * 0.025;
      p.size = (3 + Math.random() * 6) * (size / 80);
      p.color = Math.random() > 0.5 ? `rgba(80,160,255,` : `rgba(200,60,255,`;
      p.type = "default";
      particles.push(p);
    }
  }

  /**
   * 写轮眼粒子
   */
  function spawnSharinganParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.3 + Math.random() * size * 0.5;
      const p = acquireParticle();
      p.x = x + Math.cos(angle) * dist;
      p.y = y + Math.sin(angle) * dist;
      p.vx = Math.cos(angle + Math.PI / 2) * 1.2;
      p.vy = Math.sin(angle + Math.PI / 2) * 1.2;
      p.life = 1;
      p.decay = 0.008 + Math.random() * 0.012;
      p.size = 2 + Math.random() * 4;
      p.type = "sharingan";
      particles.push(p);
    }
  }

  /**
   * 烟雾粒子（影分身登场）
   */
  function spawnSmokeParticles(particles, x, y) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 8; i++) {
      const p = acquireParticle();
      p.x = x + (Math.random() - 0.5) * 80;
      p.y = y + (Math.random() - 0.5) * 50;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.vy = -0.5 - Math.random() * 1.5;
      p.life = 1;
      p.decay = 0.004 + Math.random() * 0.006;
      p.size = 25 + Math.random() * 45;
      p.type = "smoke";
      particles.push(p);
    }
  }

  /**
   * 气场粒子（八门遁甲等）
   */
  function spawnAuraParticles(particles, x, y, power) {
    if (particles.length >= particleLimit) return;
    const count = Math.floor(8 + power * 12);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + power * 8 + Math.random() * 4;
      const p = acquireParticle();
      p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 1;
      p.decay = 0.015 + Math.random() * 0.02;
      p.size = 2 + Math.random() * 5;
      p.type = "aura";
      particles.push(p);
    }
  }

  /**
   * 碎片粒子（地爆天星）
   */
  function spawnDebrisParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 350;
      const p = acquireParticle();
      p.x = x + Math.cos(angle) * dist;
      p.y = y + Math.sin(angle) * dist;
      p.vx = 0; p.vy = 0;
      p.life = 1;
      p.decay = 0.002 + Math.random() * 0.004;
      p.size = 3 + Math.random() * 8;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.2;
      p.targetX = x; p.targetY = y;
      p.type = "debris";
      particles.push(p);
    }
  }

  // ==================== 专用粒子生成（结印大招） ====================

  /**
   * 闪电火花粒子（麒麟/神罗天征）
   */
  function spawnLightningParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      const p = acquireParticle();
      p.x = x + (Math.random() - 0.5) * size * 0.5;
      p.y = y + (Math.random() - 0.5) * size * 0.5;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 2;
      p.life = 1;
      p.decay = 0.025 + Math.random() * 0.03;
      p.size = 2 + Math.random() * 4;
      p.color = Math.random() > 0.5 ? `rgba(200,230,255,` : `rgba(150,200,255,`;
      p.type = 'default';
      particles.push(p);
    }
  }

  /**
   * 沙粒碎片粒子（砂棺/砂瀑阵）
   */
  function spawnSandParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const p = acquireParticle();
      p.x = x + (Math.random() - 0.5) * size;
      p.y = y + (Math.random() - 0.5) * size;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1;
      p.life = 1;
      p.decay = 0.012 + Math.random() * 0.018;
      p.size = 3 + Math.random() * 5;
      p.color = Math.random() > 0.5 ? `rgba(210,180,100,` : `rgba(180,150,60,`;
      p.type = 'default';
      particles.push(p);
    }
  }

  /**
   * 樱花花瓣粒子（樱花冲击）
   */
  function spawnSakuraParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      const p = acquireParticle();
      p.x = x + (Math.random() - 0.5) * size * 0.6;
      p.y = y + (Math.random() - 0.5) * size * 0.6;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.5;
      p.life = 1;
      p.decay = 0.01 + Math.random() * 0.015;
      p.size = 3 + Math.random() * 5;
      p.color = Math.random() > 0.5 ? `rgba(255,180,210,` : `rgba(255,140,180,`;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.15;
      p.type = 'default';
      particles.push(p);
    }
  }

  /**
   * 紫色封印粒子（十拳剑）
   */
  function spawnSealParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      const p = acquireParticle();
      p.x = x + Math.cos(angle) * size * 0.5;
      p.y = y + Math.sin(angle) * size * 0.5;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 1;
      p.decay = 0.012 + Math.random() * 0.02;
      p.size = 2 + Math.random() * 4;
      p.color = Math.random() > 0.5 ? `rgba(180,120,255,` : `rgba(140,80,220,`;
      p.type = 'default';
      particles.push(p);
    }
  }

  /**
   * 粉色查克拉粒子（百豪/螺旋丸）
   */
  function spawnChakraParticles(particles, x, y, size, color1, color2) {
    if (particles.length >= particleLimit) return;
    const c1 = color1 || 'rgba(255,150,200,';
    const c2 = color2 || 'rgba(255,100,180,';
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      const p = acquireParticle();
      p.x = x + (Math.random() - 0.5) * size * 0.4;
      p.y = y + (Math.random() - 0.5) * size * 0.4;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1;
      p.life = 1;
      p.decay = 0.012 + Math.random() * 0.02;
      p.size = 3 + Math.random() * 5;
      p.color = Math.random() > 0.5 ? c1 : c2;
      p.type = 'default';
      particles.push(p);
    }
  }

  /**
   * 尾兽玉能量粒子（吸收感）
   */
  function spawnBijuuParticles(particles, x, y, size) {
    if (particles.length >= particleLimit) return;
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = size * (0.8 + Math.random() * 1.5);
      const p = acquireParticle();
      p.x = x + Math.cos(angle) * dist;
      p.y = y + Math.sin(angle) * dist;
      // 粒子向中心运动（吸收感）
      p.vx = -Math.cos(angle) * (1 + Math.random() * 2);
      p.vy = -Math.sin(angle) * (1 + Math.random() * 2);
      p.life = 1;
      p.decay = 0.015 + Math.random() * 0.02;
      p.size = 2 + Math.random() * 4;
      p.color = Math.random() > 0.6 ? `rgba(180,50,255,` : `rgba(100,0,180,`;
      p.type = 'default';
      particles.push(p);
    }
  }

  // ==================== 粒子更新 ====================

  /**
   * 更新并绘制所有粒子
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} particles - 粒子数组（就地修改）
   * @returns {Array} 过滤后的存活粒子
   */
  function updateParticles(ctx, particles) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        releaseParticle(p);
        particles.splice(i, 1);
        continue;
      }

      switch (p.type) {
        case "smoke": {
          p.vy -= 0.02;
          const ss = p.size * (1 + (1 - p.life) * 0.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, ss, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,180,200,${p.life * 0.25})`;
          ctx.fill();
          // 柔光外圈
          ctx.beginPath();
          ctx.arc(p.x, p.y, ss * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,180,200,${p.life * 0.08})`;
          ctx.fill();
          break;
        }
        case "debris": {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 5) {
            const force = 500 / (dist + 50);
            p.vx += (dx / dist) * force * 0.016;
            p.vy += (dy / dist) * force * 0.016;
          }
          if (dist < 10) p.life = 0;
          p.rotation += p.rotSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `rgba(80,50,30,${p.life})`;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
          break;
        }
        case "aura": {
          p.vx *= 0.96;
          p.vy *= 0.96;
          // 拖尾
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.strokeStyle = `rgba(255,255,200,${p.life * 0.4})`;
          ctx.lineWidth = p.size * p.life * 0.5;
          ctx.stroke();
          // 粒子点
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,200,${p.life * 0.8})`;
          ctx.fill();
          break;
        }
        case "sharingan": {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,0,0,${p.life * 0.8})`;
          ctx.fill();
          break;
        }
        default: {
          p.vx *= 0.98;
          p.vy *= 0.98;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.life))})`;
          ctx.fill();
        }
      }
    }
    return particles;
  }

  // ==================== 特效绘制 ====================

  /**
   * 绘制虚式紫
   */
  function drawHollowPurple(ctx, x, y, size) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const alpha = Math.min(1, size / 40);

    // 外层大气（多层深紫扩散）
    for (let layer = 0; layer < 3; layer++) {
      const lr = size * (3.5 + layer * 1.2);
      const la = 0.12 - layer * 0.03;
      const atmGrad = ctx.createRadialGradient(x, y, 0, x, y, lr);
      atmGrad.addColorStop(0, `rgba(80,0,180,${la * alpha})`);
      atmGrad.addColorStop(0.5, `rgba(50,0,140,${la * 0.5 * alpha})`);
      atmGrad.addColorStop(1, `rgba(30,0,80,0)`);
      ctx.beginPath(); ctx.arc(x, y, lr, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad; ctx.fill();
    }

    // 扭曲同心圆（带断续效果）
    for (let ring = 0; ring < 6; ring++) {
      const ringR = size * (0.5 + ring * 0.35);
      const wobble = Math.sin(time * 1.5 + ring * 0.8) * size * 0.1;
      const segments = 4 + ring;
      const segArc = (Math.PI * 2 / segments) * 0.6;
      for (let s = 0; s < segments; s++) {
        const sa = time * (0.4 + ring * 0.1) + (s / segments) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x, y, ringR + wobble, sa, sa + segArc);
        ctx.strokeStyle = `rgba(160,60,255,${(0.3 - ring * 0.04) * alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 蓝色层
    const bluePulse = Math.sin(time * 2) * 0.05 + 0.95;
    const blueGrad = ctx.createRadialGradient(x - size * 0.4, y, 0, x - size * 0.4, y, size * 1.8);
    blueGrad.addColorStop(0, `rgba(15,50,220,${0.9 * alpha * bluePulse})`);
    blueGrad.addColorStop(0.4, `rgba(10,35,200,${0.6 * alpha})`);
    blueGrad.addColorStop(0.7, `rgba(5,20,160,${0.25 * alpha})`);
    blueGrad.addColorStop(1, `rgba(0,10,120,0)`);
    ctx.beginPath(); ctx.arc(x - size * 0.12, y, size * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = blueGrad; ctx.fill();

    // 红色层
    const redPulse = Math.sin(time * 2 + Math.PI) * 0.05 + 0.95;
    const redGrad = ctx.createRadialGradient(x + size * 0.4, y, 0, x + size * 0.4, y, size * 1.8);
    redGrad.addColorStop(0, `rgba(200,0,15,${0.9 * alpha * redPulse})`);
    redGrad.addColorStop(0.4, `rgba(160,0,10,${0.6 * alpha})`);
    redGrad.addColorStop(0.7, `rgba(100,0,5,${0.25 * alpha})`);
    redGrad.addColorStop(1, `rgba(60,0,0,0)`);
    ctx.beginPath(); ctx.arc(x + size * 0.12, y, size * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = redGrad; ctx.fill();

    // 蓝红交界处电弧
    for (let i = 0; i < 6; i++) {
      const arcAngle = time * 3 + i * 1.1;
      const arcY = y + Math.sin(arcAngle) * size * 0.6;
      const arcX = x + Math.sin(time * 1.5 + i) * size * 0.15;
      const arcLen = size * (0.3 + Math.sin(time * 4 + i * 2) * 0.2);
      ctx.beginPath();
      ctx.moveTo(arcX - arcLen * 0.5, arcY);
      for (let j = 0; j < 4; j++) {
        const jx = arcX - arcLen * 0.5 + (j + 1) * arcLen * 0.25;
        const jy = arcY + (j % 2 === 0 ? -1 : 1) * size * 0.05;
        ctx.lineTo(jx, jy);
      }
      ctx.strokeStyle = `rgba(200,150,255,${0.35 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 环绕粒子
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 + time * (0.8 + (i % 3) * 0.2);
      const orbitWobble = Math.sin(time * 2 + i * 0.5) * size * 0.18;
      const rx = x + Math.cos(angle) * (size * 1.1 + orbitWobble);
      const ry = y + Math.sin(angle) * (size * 0.5 + orbitWobble * 0.3);
      const dotR = size * 0.06 + Math.sin(time * 3 + i) * size * 0.025;

      const tailAngle = angle - 0.15;
      const tx = x + Math.cos(tailAngle) * (size * 1.1 + orbitWobble);
      const ty = y + Math.sin(tailAngle) * (size * 0.5 + orbitWobble * 0.3);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = i < 12
        ? `rgba(30,80,220,${0.2 * alpha})`
        : `rgba(180,40,200,${0.2 * alpha})`;
      ctx.lineWidth = dotR * 0.8;
      ctx.stroke();

      ctx.beginPath(); ctx.arc(rx, ry, dotR, 0, Math.PI * 2);
      ctx.fillStyle = i < 12
        ? `rgba(20,70,220,${0.95 * alpha})`
        : `rgba(170,40,220,${0.95 * alpha})`;
      ctx.fill();
    }

    // 碎片飞散效果
    for (let i = 0; i < 16; i++) {
      const fAngle = time * 0.8 + (i / 16) * Math.PI * 2;
      const fDist = size * (1.3 + Math.sin(time * 1.2 + i * 1.3) * 0.5);
      const fx = x + Math.cos(fAngle) * fDist;
      const fy = y + Math.sin(fAngle) * fDist;
      const fSize = 2 + Math.sin(time * 2 + i) * 1.5;
      const fRot = time * 2 + i;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(fRot);
      ctx.beginPath();
      ctx.moveTo(-fSize, -fSize * 0.3);
      ctx.lineTo(fSize * 0.5, -fSize);
      ctx.lineTo(fSize, fSize * 0.2);
      ctx.lineTo(fSize * 0.3, fSize);
      ctx.lineTo(-fSize * 0.5, fSize * 0.5);
      ctx.closePath();
      ctx.fillStyle = i < 8
        ? `rgba(60,120,255,${0.5 * alpha})`
        : `rgba(200,100,255,${0.5 * alpha})`;
      ctx.fill();
      ctx.restore();
    }

    // 核心球体
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
    coreGrad.addColorStop(0, `rgba(255,255,255,${1.0 * alpha})`);
    coreGrad.addColorStop(0.12, `rgba(230,200,255,${0.98 * alpha})`);
    coreGrad.addColorStop(0.35, `rgba(140,30,220,${0.92 * alpha})`);
    coreGrad.addColorStop(0.6, `rgba(90,10,180,${0.8 * alpha})`);
    coreGrad.addColorStop(0.85, `rgba(50,0,120,${0.4 * alpha})`);
    coreGrad.addColorStop(1, `rgba(30,0,80,0)`);
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    // 内部蓝红旋转纹理
    for (let i = 0; i < 3; i++) {
      const swAngle = time * 2 + i * Math.PI * 2 / 3;
      const swR = size * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, swR, swAngle, swAngle + Math.PI * 0.6);
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(60,120,255,${0.3 * alpha})`
        : `rgba(200,40,40,${0.3 * alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 绘制写轮眼
   */
  function drawSharingan(ctx, cx, cy, size, totalPower) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 3;

    // 脉冲缩放
    const pulseTime = getTime() * 4;
    const pulseScale = 1 + Math.sin(pulseTime) * 0.04;
    const s = size * pulseScale;

    // 全屏红色滤镜
    ctx.fillStyle = `rgba(180,0,0,${totalPower * 0.18})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 红色虹膜
    const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s);
    irisGrad.addColorStop(0, `rgba(180,0,0,0.95)`);
    irisGrad.addColorStop(0.7, `rgba(150,0,0,0.8)`);
    irisGrad.addColorStop(1, `rgba(100,0,0,0)`);
    ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad; ctx.fill();

    // 内环
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(80,0,0,0.6)`;
    ctx.lineWidth = 2.5; ctx.stroke();

    // 三勾玉
    for (let i = 0; i < 3; i++) {
      const angle = time + (i * Math.PI * 2 / 3);
      const tx = cx + Math.cos(angle) * s * 0.35;
      const ty = cy + Math.sin(angle) * s * 0.35;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(angle + Math.PI / 2);
      // 勾玉身体
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.13, 0, Math.PI * 1.5);
      ctx.fillStyle = `rgba(0,0,0,0.95)`;
      ctx.fill();
      // 勾玉尾巴
      ctx.beginPath();
      ctx.moveTo(Math.cos(Math.PI * 1.5) * s * 0.13, Math.sin(Math.PI * 1.5) * s * 0.13);
      ctx.quadraticCurveTo(s * 0.22, -s * 0.06, s * 0.09, s * 0.06);
      ctx.fillStyle = `rgba(0,0,0,0.95)`;
      ctx.fill();
      ctx.restore();
    }

    // 瞳孔
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,1)`;
    ctx.fill();

    // 瞳孔内环
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.15, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(180,0,0,0.75)`;
    ctx.lineWidth = 2; ctx.stroke();

    ctx.restore();
  }

  /**
   * 绘制影分身
   */
  function drawShadowClone(ctx, pts, power, handConnections) {
    if (!pts || power < 0.01) return;
    const time = getTime() * 3;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const clones = [
      { dx: 90, dy: -30, alpha: 0.55, hue: 210 },
      { dx: -70, dy: 45, alpha: 0.4, hue: 220 },
      { dx: 110, dy: 55, alpha: 0.25, hue: 230 },
      { dx: -50, dy: -50, alpha: 0.15, hue: 240 }
    ];

    clones.forEach((clone, ci) => {
      const cAlpha = clone.alpha * power;

      const smokeR = 40 + Math.sin(time + ci * 2) * 10;
      const smokeGrad = ctx.createRadialGradient(
        pts[0].x * w + clone.dx, pts[0].y * h + clone.dy, 0,
        pts[0].x * w + clone.dx, pts[0].y * h + clone.dy, smokeR
      );
      smokeGrad.addColorStop(0, `rgba(200,200,255,${0.12 * cAlpha})`);
      smokeGrad.addColorStop(0.6, `rgba(160,180,255,${0.05 * cAlpha})`);
      smokeGrad.addColorStop(1, `rgba(100,120,200,0)`);
      ctx.beginPath();
      ctx.arc(pts[0].x * w + clone.dx, pts[0].y * h + clone.dy, smokeR, 0, Math.PI * 2);
      ctx.fillStyle = smokeGrad; ctx.fill();

      ctx.save();
      ctx.globalAlpha = cAlpha;

      // 外发光层
      ctx.beginPath();
      if (handConnections) {
        handConnections.forEach(([a, b]) => {
          ctx.moveTo(pts[a].x * w + clone.dx, pts[a].y * h + clone.dy);
          ctx.lineTo(pts[b].x * w + clone.dx, pts[b].y * h + clone.dy);
        });
      }
      ctx.strokeStyle = `rgba(180,200,255,0.3)`;
      ctx.lineWidth = 6;
      ctx.stroke();

      // 主线条
      ctx.beginPath();
      if (handConnections) {
        handConnections.forEach(([a, b]) => {
          ctx.moveTo(pts[a].x * w + clone.dx, pts[a].y * h + clone.dy);
          ctx.lineTo(pts[b].x * w + clone.dx, pts[b].y * h + clone.dy);
        });
      }
      ctx.strokeStyle = `rgba(200,220,255,0.7)`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 关节
      pts.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x * w + clone.dx, pt.y * h + clone.dy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,240,255,0.9)`;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.restore();
    });
  }

  /**
   * 绘制八门遁甲
   */
  function drawEightGates(ctx, x, y, power) {
    if (power < 0.01) return;
    ctx.save();
    const time = getTime() * 3;
    const r = 80 + power * 40;

    // 外层火焰光环
    for (let i = 0; i < 8; i++) {
      const angle = time * 1.5 + (i / 8) * Math.PI * 2;
      const flameR = r * (0.9 + Math.sin(time * 4 + i * 2) * 0.15);
      const fx = x + Math.cos(angle) * flameR;
      const fy = y + Math.sin(angle) * flameR;
      const flameGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 25);
      flameGrad.addColorStop(0, `rgba(255,200,50,${0.8 * power})`);
      flameGrad.addColorStop(0.5, `rgba(255,100,0,${0.4 * power})`);
      flameGrad.addColorStop(1, `rgba(255,0,0,0)`);
      ctx.beginPath();
      ctx.arc(fx, fy, 25, 0, Math.PI * 2);
      ctx.fillStyle = flameGrad;
      ctx.fill();
    }

    // 核心能量球
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.6);
    coreGrad.addColorStop(0, `rgba(255,255,200,${0.95 * power})`);
    coreGrad.addColorStop(0.3, `rgba(255,200,50,${0.8 * power})`);
    coreGrad.addColorStop(0.7, `rgba(255,100,0,${0.4 * power})`);
    coreGrad.addColorStop(1, `rgba(200,50,0,0)`);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // 能量脉冲环
    const pulseR = r * (0.5 + Math.sin(time * 6) * 0.2);
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,100,${0.5 * power})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 绘制地爆天星
   */
  function drawChibakuTensei(ctx, x, y, size, power) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const alpha = Math.min(1, power);

    // 外层引力场
    for (let i = 0; i < 3; i++) {
      const fieldR = size * (2 + i * 0.8);
      const fieldGrad = ctx.createRadialGradient(x, y, size * 0.5, x, y, fieldR);
      fieldGrad.addColorStop(0, `rgba(100,80,60,${0.1 * alpha})`);
      fieldGrad.addColorStop(0.5, `rgba(80,60,40,${0.05 * alpha})`);
      fieldGrad.addColorStop(1, `rgba(60,40,20,0)`);
      ctx.beginPath();
      ctx.arc(x, y, fieldR, 0, Math.PI * 2);
      ctx.fillStyle = fieldGrad;
      ctx.fill();
    }

    // 旋转岩石环
    for (let ring = 0; ring < 3; ring++) {
      const ringR = size * (0.8 + ring * 0.4);
      const rockCount = 8 + ring * 4;
      for (let i = 0; i < rockCount; i++) {
        const angle = time * (0.5 + ring * 0.3) + (i / rockCount) * Math.PI * 2;
        const rx = x + Math.cos(angle) * ringR;
        const ry = y + Math.sin(angle) * ringR;
        const rockSize = 3 + Math.sin(time + i) * 2;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(angle + time);
        ctx.fillStyle = `rgba(120,100,80,${0.7 * alpha})`;
        ctx.fillRect(-rockSize / 2, -rockSize / 2, rockSize, rockSize * 0.6);
        ctx.restore();
      }
    }

    // 核心球体
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.6);
    coreGrad.addColorStop(0, `rgba(255,255,255,${0.9 * alpha})`);
    coreGrad.addColorStop(0.3, `rgba(200,180,150,${0.8 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(150,120,80,${0.5 * alpha})`);
    coreGrad.addColorStop(1, `rgba(100,80,60,0)`);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // 表面裂纹
    for (let i = 0; i < 5; i++) {
      const crackAngle = (i / 5) * Math.PI * 2;
      const crackLen = size * 0.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(crackAngle) * crackLen,
        y + Math.sin(crackAngle) * crackLen
      );
      ctx.strokeStyle = `rgba(200,180,150,${0.4 * alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 绘制螺旋手里剑
   */
  function drawRasenshuriken(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 4;
    const r = size * (0.5 + progress * 0.5);
    const alpha = Math.min(1, progress * 1.5);

    // 扩散光晕
    const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    outerGlow.addColorStop(0, `rgba(30,120,255,${0.15 * alpha})`);
    outerGlow.addColorStop(0.5, `rgba(20,80,200,${0.05 * alpha})`);
    outerGlow.addColorStop(1, `rgba(10,40,150,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow; ctx.fill();

    // 风刃线条
    for (let i = 0; i < 6; i++) {
      const baseAngle = time + (i * Math.PI / 3);
      for (let j = 0; j < 3; j++) {
        const offset = (j - 1) * 0.15;
        const len = r * (1.8 + j * 0.3);
        ctx.beginPath();
        ctx.moveTo(x, y);
        const cx1 = x + Math.cos(baseAngle + offset) * len * 0.5;
        const cy1 = y + Math.sin(baseAngle + offset) * len * 0.5;
        const ex = x + Math.cos(baseAngle + offset) * len;
        const ey = y + Math.sin(baseAngle + offset) * len;
        ctx.quadraticCurveTo(cx1 + Math.sin(time * 3) * 5, cy1 + Math.cos(time * 3) * 5, ex, ey);
        ctx.strokeStyle = `rgba(180,220,255,${(0.3 - j * 0.08) * alpha})`;
        ctx.lineWidth = 3 - j;
        ctx.stroke();
      }
    }

    // 旋转手里剑叶片
    for (let i = 0; i < 6; i++) {
      const angle = time * 2.5 + (i * Math.PI / 3);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.9, -r * 0.18);
      ctx.quadraticCurveTo(r * 1.15, 0, r * 0.9, r * 0.18);
      ctx.closePath();
      const leafGrad = ctx.createLinearGradient(0, 0, r, 0);
      leafGrad.addColorStop(0, `rgba(80,180,255,${0.9 * alpha})`);
      leafGrad.addColorStop(0.7, `rgba(30,100,220,${0.7 * alpha})`);
      leafGrad.addColorStop(1, `rgba(20,60,180,${0.3 * alpha})`);
      ctx.fillStyle = leafGrad;
      ctx.fill();
      ctx.strokeStyle = `rgba(150,220,255,${0.6 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 旋转同心圆纹理
    for (let i = 0; i < 3; i++) {
      const ringR = r * (0.25 + i * 0.15);
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100,200,255,${(0.2 - i * 0.05) * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 中心螺旋丸核心
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.45);
    coreGrad.addColorStop(0, `rgba(255,255,255,${1.0 * alpha})`);
    coreGrad.addColorStop(0.2, `rgba(220,240,255,${0.95 * alpha})`);
    coreGrad.addColorStop(0.5, `rgba(80,180,255,${0.7 * alpha})`);
    coreGrad.addColorStop(0.8, `rgba(20,80,200,${0.4 * alpha})`);
    coreGrad.addColorStop(1, `rgba(10,40,150,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    // 外层能量环
    ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100,200,255,${0.5 * alpha})`;
    ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(60,160,240,${0.3 * alpha})`;
    ctx.lineWidth = 1.5; ctx.stroke();

    ctx.restore();
  }

  /**
   * 绘制须佐能乎 - 巨大的能量骨架
   */
  function drawSusano(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime();
    const p = progress;

    // 全屏紫色能量波动
    if (p > 0.1) {
      const waveAlpha = Math.min(0.15, (p - 0.1) * 0.2);
      ctx.fillStyle = `rgba(100,50,200,${waveAlpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 外层查克拉火焰 aura（多层，更密集）
    if (p > 0.15) {
      const auraAlpha = Math.min(1, (p - 0.15) / 0.25);
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.2;
        for (let i = 0; i < 18; i++) {
          const angle = time * 2.5 + (i / 18) * Math.PI * 2 + layerOffset;
          const flameR = size * (1.3 + layer * 0.3 + Math.sin(time * 3.5 + i + layer) * 0.25);
          const fx = x + Math.cos(angle) * flameR;
          const fy = y + Math.sin(angle) * flameR * 0.75;
          const flameSize = 35 - layer * 5;
          const flameGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, flameSize);
          flameGrad.addColorStop(0, `rgba(130,70,230,${(0.5 - layer * 0.1) * auraAlpha})`);
          flameGrad.addColorStop(0.4, `rgba(100,40,200,${(0.3 - layer * 0.08) * auraAlpha})`);
          flameGrad.addColorStop(0.7, `rgba(70,20,160,${(0.15 - layer * 0.04) * auraAlpha})`);
          flameGrad.addColorStop(1, `rgba(50,10,120,0)`);
          ctx.beginPath();
          ctx.arc(fx, fy, flameSize, 0, Math.PI * 2);
          ctx.fillStyle = flameGrad;
          ctx.fill();
        }
      }
    }

    // 骨骼轮廓（更复杂的骨架）
    if (p > 0.3) {
      const boneAlpha = Math.min(1, (p - 0.3) / 0.25);
      ctx.beginPath();
      // 头部
      ctx.moveTo(x, y - size * 0.85);
      ctx.lineTo(x - size * 0.15, y - size * 0.75);
      ctx.lineTo(x - size * 0.2, y - size * 0.6);
      // 肩膀
      ctx.lineTo(x - size * 0.45, y - size * 0.5);
      ctx.lineTo(x - size * 0.55, y - size * 0.4);
      // 手臂
      ctx.lineTo(x - size * 0.6, y - size * 0.2);
      ctx.lineTo(x - size * 0.5, y);
      // 身体
      ctx.lineTo(x - size * 0.35, y + size * 0.2);
      ctx.lineTo(x - size * 0.3, y + size * 0.5);
      // 腿
      ctx.lineTo(x - size * 0.25, y + size * 0.7);
      ctx.lineTo(x - size * 0.15, y + size * 0.85);
      ctx.lineTo(x, y + size * 0.9);
      ctx.lineTo(x + size * 0.15, y + size * 0.85);
      ctx.lineTo(x + size * 0.25, y + size * 0.7);
      ctx.lineTo(x + size * 0.3, y + size * 0.5);
      ctx.lineTo(x + size * 0.35, y + size * 0.2);
      ctx.lineTo(x + size * 0.5, y);
      ctx.lineTo(x + size * 0.6, y - size * 0.2);
      ctx.lineTo(x + size * 0.55, y - size * 0.4);
      ctx.lineTo(x + size * 0.45, y - size * 0.5);
      ctx.lineTo(x + size * 0.2, y - size * 0.6);
      ctx.lineTo(x + size * 0.15, y - size * 0.75);
      ctx.closePath();
      ctx.strokeStyle = `rgba(200,120,255,${0.7 * boneAlpha})`;
      ctx.lineWidth = 4;
      ctx.stroke();
      // 骨骼发光
      ctx.strokeStyle = `rgba(150,80,220,${0.4 * boneAlpha})`;
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // 核心能量体（更亮更大）
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.6);
    coreGrad.addColorStop(0, `rgba(230,180,255,${0.95 * p})`);
    coreGrad.addColorStop(0.3, `rgba(180,120,240,${0.7 * p})`);
    coreGrad.addColorStop(0.6, `rgba(130,70,200,${0.4 * p})`);
    coreGrad.addColorStop(1, `rgba(80,30,150,0)`);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // 眼睛（须佐能乎的眼睛，带光芒）
    if (p > 0.5) {
      const eyeAlpha = Math.min(1, (p - 0.5) / 0.2);
      const eyeGlow = Math.sin(time * 4) * 0.15 + 0.85;
      // 左眼
      ctx.beginPath();
      ctx.arc(x - size * 0.18, y - size * 0.18, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,80,80,${0.95 * eyeAlpha * eyeGlow})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - size * 0.18, y - size * 0.18, 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,50,50,${0.4 * eyeAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      // 右眼
      ctx.beginPath();
      ctx.arc(x + size * 0.18, y - size * 0.18, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,80,80,${0.95 * eyeAlpha * eyeGlow})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + size * 0.18, y - size * 0.18, 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,50,50,${0.4 * eyeAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 能量护盾效果
    if (p > 0.6) {
      const shieldAlpha = Math.min(0.4, (p - 0.6) * 0.8);
      const shieldPulse = Math.sin(time * 3) * 0.1 + 0.9;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180,100,255,${shieldAlpha * shieldPulse})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 绘制天照 - 黑色火焰永不熄灭
   */
  function drawAmaterasu(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const alpha = Math.min(1, progress * 1.5);

    // 全屏暗紫滤镜（screen 模式下用亮色模拟暗场）
    ctx.fillStyle = `rgba(60,0,100,${0.06 * alpha})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 外层扩散火焰圈（3 层，明亮紫红色——screen 模式适配）
    for (let layer = 0; layer < 3; layer++) {
      const layerR = size * (1.2 + layer * 0.4);
      const layerAlpha = 0.18 - layer * 0.04;
      for (let i = 0; i < 16; i++) {
        const angle = time * 1.5 + (i / 16) * Math.PI * 2 + layer * 0.3;
        const flameR = layerR * (0.9 + Math.sin(time * 2.5 + i * 1.2 + layer) * 0.15);
        const fx = x + Math.cos(angle) * flameR;
        const fy = y + Math.sin(angle) * flameR;
        const flameGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 30 + layer * 10);
        flameGrad.addColorStop(0, `rgba(160,0,255,${layerAlpha * alpha})`);
        flameGrad.addColorStop(0.3, `rgba(120,0,200,${layerAlpha * 0.7 * alpha})`);
        flameGrad.addColorStop(0.6, `rgba(80,0,150,${layerAlpha * 0.3 * alpha})`);
        flameGrad.addColorStop(1, `rgba(40,0,80,0)`);
        ctx.beginPath();
        ctx.arc(fx, fy, 30 + layer * 10, 0, Math.PI * 2);
        ctx.fillStyle = flameGrad;
        ctx.fill();
      }
    }

    // 核心火焰球体（明亮紫→白热，适配 screen 混合）
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.5);
    coreGrad.addColorStop(0, `rgba(255,200,255,${0.95 * alpha})`);
    coreGrad.addColorStop(0.2, `rgba(200,80,255,${0.85 * alpha})`);
    coreGrad.addColorStop(0.5, `rgba(140,0,220,${0.6 * alpha})`);
    coreGrad.addColorStop(0.8, `rgba(80,0,150,${0.3 * alpha})`);
    coreGrad.addColorStop(1, `rgba(40,0,80,0)`);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // 紫色火焰纹理（12 条，更亮）
    for (let i = 0; i < 12; i++) {
      const flameAngle = time * 4 + (i / 12) * Math.PI * 2;
      const flameLen = size * (0.6 + Math.sin(time * 2 + i) * 0.2);
      const flameWidth = 2.5 + Math.sin(time * 3 + i * 0.7) * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(flameAngle) * flameLen * 0.4,
        y + Math.sin(flameAngle) * flameLen * 0.4 - 25,
        x + Math.cos(flameAngle) * flameLen,
        y + Math.sin(flameAngle) * flameLen
      );
      ctx.strokeStyle = `rgba(180,40,255,${(0.55 + Math.sin(time * 2 + i) * 0.2) * alpha})`;
      ctx.lineWidth = flameWidth;
      ctx.stroke();
    }

    // 内焰射线（明亮紫白，替代不可见的黑色内焰）
    for (let i = 0; i < 8; i++) {
      const innerAngle = time * 5 + (i / 8) * Math.PI * 2;
      const innerLen = size * 0.35;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(innerAngle) * innerLen,
        y + Math.sin(innerAngle) * innerLen
      );
      ctx.strokeStyle = `rgba(200,100,255,${0.5 * alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 火花飞溅（更亮）
    for (let i = 0; i < 15; i++) {
      const sparkAngle = time * 6 + (i / 15) * Math.PI * 2;
      const sparkDist = size * (0.4 + Math.sin(time * 4 + i * 1.5) * 0.3);
      const sx = x + Math.cos(sparkAngle) * sparkDist;
      const sy = y + Math.sin(sparkAngle) * sparkDist;
      const sparkSize = 2 + Math.sin(time * 5 + i) * 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,120,255,${0.8 * alpha})`;
      ctx.fill();
    }

    // 中心白热核心（脉冲）
    const pulseR = size * (0.18 + Math.sin(time * 4) * 0.03);
    const innerGrad = ctx.createRadialGradient(x, y, 0, x, y, pulseR);
    innerGrad.addColorStop(0, `rgba(255,220,255,${0.95 * alpha})`);
    innerGrad.addColorStop(0.4, `rgba(220,140,255,${0.6 * alpha})`);
    innerGrad.addColorStop(1, `rgba(140,40,220,0)`);
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    ctx.restore();
  }

  /**
   * 绘制月读 - 幻术世界
   */
  function drawTsukuyomi(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime();
    const alpha = Math.min(1, progress * 1.5);

    // 全屏红色滤镜（渐入）
    const filterAlpha = 0.2 * alpha;
    ctx.fillStyle = `rgba(180,0,0,${filterAlpha})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 漩涡效果（从中心扩散）
    if (alpha > 0.3) {
      const vortexAlpha = (alpha - 0.3) * 1.4;
      for (let i = 0; i < 6; i++) {
        const spiralAngle = time * 2 + (i / 6) * Math.PI * 2;
        const spiralR = size * (0.8 + i * 0.15);
        ctx.beginPath();
        ctx.arc(x, y, spiralR, spiralAngle, spiralAngle + Math.PI * 0.8);
        ctx.strokeStyle = `rgba(200,30,30,${(0.3 - i * 0.04) * vortexAlpha})`;
        ctx.lineWidth = 3 - i * 0.3;
        ctx.stroke();
      }
    }

    // 红色月亮（带脉冲）
    const moonPulse = Math.sin(time * 2) * 0.05 + 1;
    const moonR = size * moonPulse;
    const moonGrad = ctx.createRadialGradient(x, y, 0, x, y, moonR);
    moonGrad.addColorStop(0, `rgba(255,60,60,${0.95 * alpha})`);
    moonGrad.addColorStop(0.4, `rgba(220,30,30,${0.85 * alpha})`);
    moonGrad.addColorStop(0.7, `rgba(180,15,15,${0.6 * alpha})`);
    moonGrad.addColorStop(1, `rgba(120,0,0,0)`);
    ctx.beginPath();
    ctx.arc(x, y, moonR, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad;
    ctx.fill();

    // 月亮纹理（环形山，更真实）
    for (let i = 0; i < 12; i++) {
      const craterAngle = (i / 12) * Math.PI * 2 + time * 0.1;
      const craterR = size * (0.06 + Math.sin(i * 2.3) * 0.03);
      const craterDist = size * (0.3 + Math.sin(i * 1.7) * 0.2);
      const cx = x + Math.cos(craterAngle) * craterDist;
      const cy = y + Math.sin(craterAngle) * craterDist;
      ctx.beginPath();
      ctx.arc(cx, cy, craterR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,15,15,${(0.4 + Math.sin(time + i) * 0.1) * alpha})`;
      ctx.fill();
    }

    // 红色光线（旋转，更密集）
    for (let i = 0; i < 12; i++) {
      const rayAngle = time * 1.5 + (i / 12) * Math.PI * 2;
      const rayLen = size * 4;
      const rayWidth = 1.5 + Math.sin(time * 2 + i) * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(rayAngle) * rayLen,
        y + Math.sin(rayAngle) * rayLen
      );
      ctx.strokeStyle = `rgba(255,20,20,${(0.08 + Math.sin(time * 3 + i) * 0.03) * alpha})`;
      ctx.lineWidth = rayWidth;
      ctx.stroke();
    }

    // 红色粒子漂浮
    for (let i = 0; i < 20; i++) {
      const particleAngle = time * 0.5 + (i / 20) * Math.PI * 2;
      const particleDist = size * (1.5 + Math.sin(time * 0.8 + i * 1.3) * 0.8);
      const px = x + Math.cos(particleAngle) * particleDist;
      const py = y + Math.sin(particleAngle) * particleDist;
      const particleSize = 2 + Math.sin(time * 2 + i) * 1;
      ctx.beginPath();
      ctx.arc(px, py, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,50,50,${(0.4 + Math.sin(time * 3 + i) * 0.2) * alpha})`;
      ctx.fill();
    }

    // 中心能量核心
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.3);
    coreGrad.addColorStop(0, `rgba(255,150,150,${0.8 * alpha})`);
    coreGrad.addColorStop(0.5, `rgba(200,50,50,${0.4 * alpha})`);
    coreGrad.addColorStop(1, `rgba(150,0,0,0)`);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.restore();
  }

  // ==================== 结印大招特效（9 个补全） ====================

  /**
   * 螺旋丸（大） — 旋转蓝色能量球 + 螺旋粒子线
   */
  function drawRasengan(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 3;
    const r = size * (0.3 + progress * 0.7);
    const alpha = Math.min(1, progress * 1.5);

    // 全屏蓝色查克拉波动
    if (progress > 0.1) {
      const waveAlpha = Math.min(0.06, (progress - 0.1) * 0.1);
      ctx.fillStyle = `rgba(40,120,220,${waveAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 外层蓝白光晕（增强）
    const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    outerGlow.addColorStop(0, `rgba(120,190,255,${0.2 * alpha})`);
    outerGlow.addColorStop(0.3, `rgba(80,160,255,${0.12 * alpha})`);
    outerGlow.addColorStop(0.6, `rgba(40,100,220,${0.05 * alpha})`);
    outerGlow.addColorStop(1, `rgba(15,50,160,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow; ctx.fill();

    // 旋转能量环（3 圈）
    for (let ring = 0; ring < 3; ring++) {
      const ringR = r * (0.7 + ring * 0.35);
      ctx.beginPath(); ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,210,255,${(0.25 - ring * 0.06) * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 螺旋粒子线（10 条）
    for (let i = 0; i < 10; i++) {
      const baseAngle = time * 2 + (i * Math.PI / 5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let t = 0; t < 1; t += 0.04) {
        const spiralAngle = baseAngle + t * Math.PI * 5;
        const dist = t * r * 2;
        const sx = x + Math.cos(spiralAngle) * dist;
        const sy = y + Math.sin(spiralAngle) * dist;
        ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(160,225,255,${(0.3 - i * 0.02) * alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 旋转能量核心（6 球）
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 1.5);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const orbX = Math.cos(angle) * r * 0.35;
      const orbY = Math.sin(angle) * r * 0.35;
      ctx.beginPath();
      ctx.arc(orbX, orbY, r * 0.22, 0, Math.PI * 2);
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, r * 0.22);
      orbGrad.addColorStop(0, `rgba(210,235,255,${0.75 * alpha})`);
      orbGrad.addColorStop(0.5, `rgba(100,180,255,${0.4 * alpha})`);
      orbGrad.addColorStop(1, `rgba(40,100,220,0)`);
      ctx.fillStyle = orbGrad;
      ctx.fill();
    }
    ctx.restore();

    // 轨道小粒子点
    for (let i = 0; i < 12; i++) {
      const angle = time * 3 + (i / 12) * Math.PI * 2;
      const dist = r * (0.5 + Math.sin(time * 2 + i) * 0.15);
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,235,255,${0.6 * alpha})`;
      ctx.fill();
    }

    // 中心白芯（脉冲）
    const pulseR = r * (0.3 + Math.sin(time * 4) * 0.04);
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, pulseR);
    coreGrad.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
    coreGrad.addColorStop(0.3, `rgba(180,225,255,${0.6 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(100,180,255,${0.2 * alpha})`);
    coreGrad.addColorStop(1, `rgba(60,140,255,0)`);
    ctx.beginPath(); ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * 尾兽玉 — 巨型黑紫能量球 + 光束射线
   */
  function drawBijuuDama(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const r = size * (0.4 + progress * 0.6);
    const alpha = Math.min(1, progress * 1.2);

    // 全屏暗紫场（screen 模式适配——用亮紫替代暗色）
    if (progress > 0.08) {
      const darkAlpha = Math.min(0.12, (progress - 0.08) * 0.18);
      ctx.fillStyle = `rgba(50,0,100,${darkAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 外层紫黑能量场（screen 模式适配——提亮）
    const outerField = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    outerField.addColorStop(0, `rgba(140,40,255,${0.15 * alpha})`);
    outerField.addColorStop(0.2, `rgba(100,20,200,${0.1 * alpha})`);
    outerField.addColorStop(0.5, `rgba(60,10,140,${0.05 * alpha})`);
    outerField.addColorStop(0.8, `rgba(30,5,80,${0.02 * alpha})`);
    outerField.addColorStop(1, `rgba(15,0,40,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = outerField; ctx.fill();

    // 能量吸收旋涡线（8 条向内螺旋）
    for (let i = 0; i < 8; i++) {
      const baseAngle = time * 1.2 + (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(baseAngle) * r * 2.5, y + Math.sin(baseAngle) * r * 2.5);
      for (let t = 0; t < 1; t += 0.06) {
        const angle = baseAngle + t * Math.PI * 3;
        const dist = r * 2.5 * (1 - t);
        ctx.lineTo(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist);
      }
      ctx.strokeStyle = `rgba(140,40,220,${0.15 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 环绕能量粒子环（3 层，更多粒子）
    for (let ring = 0; ring < 3; ring++) {
      const ringR = r * (1.1 + ring * 0.4);
      const count = 10 + ring * 4;
      for (let i = 0; i < count; i++) {
        const angle = time * (1.8 - ring * 0.4) + (i / count) * Math.PI * 2;
        const wobble = Math.sin(time * 3 + i + ring) * 4;
        const px = x + Math.cos(angle) * (ringR + wobble);
        const py = y + Math.sin(angle) * (ringR + wobble);
        const dotSize = 6 + ring * 2;
        const dotGrad = ctx.createRadialGradient(px, py, 0, px, py, dotSize);
        dotGrad.addColorStop(0, `rgba(200,80,255,${(0.65 - ring * 0.12) * alpha})`);
        dotGrad.addColorStop(0.5, `rgba(120,20,200,${(0.35 - ring * 0.08) * alpha})`);
        dotGrad.addColorStop(1, `rgba(50,0,100,0)`);
        ctx.beginPath(); ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = dotGrad; ctx.fill();
      }
    }

    // 核心球体（增强：6 层渐变 + 旋转内纹）
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    coreGrad.addColorStop(0, `rgba(255,255,255,${0.98 * alpha})`);
    coreGrad.addColorStop(0.1, `rgba(220,180,255,${0.85 * alpha})`);
    coreGrad.addColorStop(0.25, `rgba(160,60,255,${0.7 * alpha})`);
    coreGrad.addColorStop(0.45, `rgba(100,0,200,${0.5 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(50,0,120,${0.25 * alpha})`);
    coreGrad.addColorStop(1, `rgba(15,0,50,0)`);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    // 球内旋转能量纹
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 2);
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * r * 0.3, Math.sin(angle) * r * 0.3, r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,140,255,${0.25 * alpha})`;
      ctx.fill();
    }
    ctx.restore();

    // 光束射线（向下，增强：双层 + 脉冲）
    if (progress > 0.35) {
      const beamAlpha = Math.min(1, (progress - 0.35) / 0.3);
      // 外层光束
      const beamOuter = ctx.createLinearGradient(x, y, x, ctx.canvas.height);
      beamOuter.addColorStop(0, `rgba(140,60,230,${0.25 * beamAlpha * alpha})`);
      beamOuter.addColorStop(0.5, `rgba(80,0,160,${0.12 * beamAlpha * alpha})`);
      beamOuter.addColorStop(1, `rgba(30,0,60,0)`);
      ctx.fillStyle = beamOuter;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.8, y);
      ctx.lineTo(x + r * 0.8, y);
      ctx.lineTo(x + r * 0.2, ctx.canvas.height);
      ctx.lineTo(x - r * 0.2, ctx.canvas.height);
      ctx.closePath();
      ctx.fill();
      // 内层光束
      const beamInner = ctx.createLinearGradient(x, y, x, ctx.canvas.height);
      beamInner.addColorStop(0, `rgba(200,120,255,${0.4 * beamAlpha * alpha})`);
      beamInner.addColorStop(0.4, `rgba(140,40,230,${0.2 * beamAlpha * alpha})`);
      beamInner.addColorStop(1, `rgba(60,0,120,0)`);
      ctx.fillStyle = beamInner;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.4, y);
      ctx.lineTo(x + r * 0.4, y);
      ctx.lineTo(x + r * 0.08, ctx.canvas.height);
      ctx.lineTo(x - r * 0.08, ctx.canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * 麒麟 — 闪电龙从天而降，全屏白闪
   */
  function drawKirin(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 4;
    const alpha = Math.min(1, progress * 1.5);

    // 全屏雷云底色
    if (progress > 0.05) {
      const cloudAlpha = Math.min(0.1, progress * 0.15);
      ctx.fillStyle = `rgba(60,80,120,${cloudAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 全屏闪电白闪
    if (progress > 0.1 && progress < 0.6) {
      const flashAlpha = Math.sin((progress - 0.1) / 0.5 * Math.PI) * 0.2;
      ctx.fillStyle = `rgba(200,220,255,${flashAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 雷云光晕（顶部）
    if (progress > 0.08) {
      const cloudGrad = ctx.createRadialGradient(x, 0, 0, x, 0, size * 2);
      cloudGrad.addColorStop(0, `rgba(150,180,220,${0.15 * alpha})`);
      cloudGrad.addColorStop(0.5, `rgba(80,100,160,${0.06 * alpha})`);
      cloudGrad.addColorStop(1, `rgba(40,50,100,0)`);
      ctx.beginPath(); ctx.arc(x, 0, size * 2, 0, Math.PI * 2);
      ctx.fillStyle = cloudGrad; ctx.fill();
    }

    // 主闪电束（5 条，含分支）
    const lightningAlpha = Math.min(1, progress / 0.5);
    const segments = 14;
    const startY = 0;
    const endY = y;
    for (let bolt = 0; bolt < 5; bolt++) {
      const offsetX = (bolt - 2) * 25;
      const boltPhase = time * 8 + bolt * 1.7;
      // 主干
      ctx.beginPath();
      ctx.moveTo(x + offsetX, startY);
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const ly = startY + (endY - startY) * t;
        const jitter = (1 - t) * 50 * (Math.sin(boltPhase + i * 3.2) > 0 ? 1 : -1);
        ctx.lineTo(x + offsetX + jitter, ly);
      }
      const boltWidth = Math.max(1, 4 - bolt * 0.6);
      ctx.strokeStyle = `rgba(200,230,255,${(0.9 - bolt * 0.12) * lightningAlpha * alpha})`;
      ctx.lineWidth = boltWidth;
      ctx.stroke();
      ctx.strokeStyle = `rgba(150,200,255,${(0.35 - bolt * 0.06) * lightningAlpha * alpha})`;
      ctx.lineWidth = boltWidth + 8;
      ctx.stroke();

      // 分支闪电（每条主干 2 个分支）
      for (let b = 0; b < 2; b++) {
        const branchT = 0.3 + b * 0.35;
        const branchStartY = startY + (endY - startY) * branchT;
        const branchJitter = (1 - branchT) * 50 * (Math.sin(boltPhase + (segments * branchT) * 3.2) > 0 ? 1 : -1);
        const branchX = x + offsetX + branchJitter;
        const branchAngle = (Math.sin(time * 6 + bolt + b) > 0 ? 1 : -1) * (0.5 + Math.random() * 0.5);
        const branchLen = size * 0.3;
        ctx.beginPath();
        ctx.moveTo(branchX, branchStartY);
        ctx.lineTo(branchX + Math.cos(branchAngle) * branchLen, branchStartY + Math.sin(branchAngle) * branchLen * 0.5);
        ctx.strokeStyle = `rgba(180,210,255,${0.3 * lightningAlpha * alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // 降落点能量爆发（增强：更多射线 + 旋转）
    if (progress > 0.25) {
      const burstAlpha = Math.min(1, (progress - 0.25) / 0.3);
      // 12 条射线
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.5;
        const len = size * (0.6 + Math.sin(time * 5 + i) * 0.4);
        const ex = x + Math.cos(angle) * len;
        const ey = y + Math.sin(angle) * len;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(180,220,255,${(0.5 - i * 0.03) * burstAlpha * alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      // 旋转电弧环
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 2);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const arcR = size * 0.5;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * arcR, Math.sin(angle) * arcR, 15, 0, Math.PI * 2);
        const sparkGrad = ctx.createRadialGradient(
          Math.cos(angle) * arcR, Math.sin(angle) * arcR, 0,
          Math.cos(angle) * arcR, Math.sin(angle) * arcR, 15
        );
        sparkGrad.addColorStop(0, `rgba(220,240,255,${0.8 * burstAlpha * alpha})`);
        sparkGrad.addColorStop(0.5, `rgba(150,200,255,${0.3 * burstAlpha * alpha})`);
        sparkGrad.addColorStop(1, `rgba(80,150,255,0)`);
        ctx.fillStyle = sparkGrad;
        ctx.fill();
      }
      ctx.restore();

      // 核心光球（双层）
      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.7);
      coreGrad.addColorStop(0, `rgba(255,255,255,${0.95 * burstAlpha * alpha})`);
      coreGrad.addColorStop(0.2, `rgba(200,230,255,${0.6 * burstAlpha * alpha})`);
      coreGrad.addColorStop(0.5, `rgba(120,180,255,${0.3 * burstAlpha * alpha})`);
      coreGrad.addColorStop(1, `rgba(60,120,255,0)`);
      ctx.beginPath(); ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad; ctx.fill();
    }

    ctx.restore();
  }

  /**
   * 十拳剑 — 透明紫色封印结界
   */
  function drawTotsuka(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const r = size * (0.5 + progress * 0.5);
    const alpha = Math.min(1, progress * 1.5);

    // 全屏紫雾（增强）
    if (progress > 0.08) {
      const fogAlpha = Math.min(0.12, (progress - 0.08) * 0.18);
      ctx.fillStyle = `rgba(120,50,200,${fogAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 外层紫色能量场
    const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
    outerGrad.addColorStop(0, `rgba(140,80,220,${0.1 * alpha})`);
    outerGrad.addColorStop(0.5, `rgba(100,40,180,${0.04 * alpha})`);
    outerGrad.addColorStop(1, `rgba(60,20,120,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = outerGrad; ctx.fill();

    // 旋转封印法阵（3 层同心，含连接线）
    for (let layer = 0; layer < 3; layer++) {
      const layerR = r * (0.6 + layer * 0.35);
      const rot = time * (0.8 - layer * 0.25);
      const sides = 8;
      // 多边形边框
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = rot + (i / sides) * Math.PI * 2;
        const px = x + Math.cos(angle) * layerR;
        const py = y + Math.sin(angle) * layerR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(190,130,255,${(0.55 - layer * 0.12) * alpha})`;
      ctx.lineWidth = 2.5 - layer * 0.5;
      ctx.stroke();
      ctx.strokeStyle = `rgba(150,90,230,${(0.2 - layer * 0.04) * alpha})`;
      ctx.lineWidth = 8;
      ctx.stroke();

      // 对角连接线（法阵内部星形）
      if (layer < 2) {
        for (let i = 0; i < sides; i++) {
          const a1 = rot + (i / sides) * Math.PI * 2;
          const a2 = rot + ((i + 3) / sides) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(a1) * layerR, y + Math.sin(a1) * layerR);
          ctx.lineTo(x + Math.cos(a2) * layerR, y + Math.sin(a2) * layerR);
          ctx.strokeStyle = `rgba(160,100,240,${0.12 * alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 封印符文点（外圈 8 个 + 内圈 8 个）
    for (let ring = 0; ring < 2; ring++) {
      const runeR = r * (0.95 + ring * 0.35);
      const runeSize = 10 - ring * 3;
      for (let i = 0; i < 8; i++) {
        const angle = time * (0.8 - ring * 0.3) + (i / 8) * Math.PI * 2;
        const fx = x + Math.cos(angle) * runeR;
        const fy = y + Math.sin(angle) * runeR;
        const runeGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, runeSize);
        runeGrad.addColorStop(0, `rgba(230,190,255,${(0.85 - ring * 0.2) * alpha})`);
        runeGrad.addColorStop(0.5, `rgba(170,110,250,${(0.4 - ring * 0.1) * alpha})`);
        runeGrad.addColorStop(1, `rgba(110,50,200,0)`);
        ctx.beginPath(); ctx.arc(fx, fy, runeSize, 0, Math.PI * 2);
        ctx.fillStyle = runeGrad; ctx.fill();
      }
    }

    // 能量连线（顶点间弧线）
    for (let i = 0; i < 8; i++) {
      const a1 = time * 0.8 + (i / 8) * Math.PI * 2;
      const a2 = time * 0.8 + ((i + 1) / 8) * Math.PI * 2;
      const p1x = x + Math.cos(a1) * r;
      const p1y = y + Math.sin(a1) * r;
      const p2x = x + Math.cos(a2) * r;
      const p2y = y + Math.sin(a2) * r;
      const cpx = x + Math.cos((a1 + a2) / 2) * r * 0.3;
      const cpy = y + Math.sin((a1 + a2) / 2) * r * 0.3;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
      ctx.strokeStyle = `rgba(180,130,255,${0.25 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 中心封印核心（脉冲）
    const pulseR = r * (0.35 + Math.sin(time * 3) * 0.05);
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, pulseR);
    coreGrad.addColorStop(0, `rgba(255,230,255,${0.85 * alpha})`);
    coreGrad.addColorStop(0.4, `rgba(200,140,255,${0.5 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(140,70,220,${0.2 * alpha})`);
    coreGrad.addColorStop(1, `rgba(100,40,180,0)`);
    ctx.beginPath(); ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * 百豪之印 — 额头发光 + 全屏粉色查克拉爆发
   */
  function drawByakugou(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2.5;
    const r = size * (0.4 + progress * 0.6);
    const alpha = Math.min(1, progress * 1.3);

    // 全屏粉色查克拉波动
    if (progress > 0.15) {
      const waveAlpha = Math.min(0.12, (progress - 0.15) * 0.18);
      ctx.fillStyle = `rgba(255,100,180,${waveAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 向外扩散的查克拉环（3 圈）
    for (let ring = 0; ring < 3; ring++) {
      const ringProgress = Math.max(0, Math.min(1, (progress - 0.1 - ring * 0.1) / 0.4));
      if (ringProgress <= 0) continue;
      const ringR = r * (0.5 + ring * 0.6) * (0.3 + ringProgress * 0.7);
      const ringAlpha = (1 - ringProgress * 0.6) * alpha;
      ctx.beginPath(); ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,150,200,${0.4 * ringAlpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,100,180,${0.15 * ringAlpha})`;
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    // 百豪之印菱形标记（在手的位置）
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    const markSize = size * 0.12;
    ctx.beginPath();
    ctx.rect(-markSize, -markSize, markSize * 2, markSize * 2);
    const markGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, markSize * 1.5);
    markGrad.addColorStop(0, `rgba(255,200,220,${0.9 * alpha})`);
    markGrad.addColorStop(0.5, `rgba(255,100,150,${0.5 * alpha})`);
    markGrad.addColorStop(1, `rgba(200,50,100,0)`);
    ctx.fillStyle = markGrad;
    ctx.fill();
    ctx.restore();

    // 查克拉光柱（向上爆发）
    if (progress > 0.25) {
      const pillarAlpha = Math.min(1, (progress - 0.25) / 0.35);
      const pillarGrad = ctx.createLinearGradient(x, y, x, y - size * 2);
      pillarGrad.addColorStop(0, `rgba(255,180,210,${0.6 * pillarAlpha * alpha})`);
      pillarGrad.addColorStop(0.3, `rgba(255,120,180,${0.3 * pillarAlpha * alpha})`);
      pillarGrad.addColorStop(1, `rgba(255,80,150,0)`);
      ctx.fillStyle = pillarGrad;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.15, y);
      ctx.lineTo(x + size * 0.15, y);
      ctx.lineTo(x + size * 0.05, y - size * 2);
      ctx.lineTo(x - size * 0.05, y - size * 2);
      ctx.closePath();
      ctx.fill();
    }

    // 中心能量球
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.5);
    coreGrad.addColorStop(0, `rgba(255,220,240,${0.9 * alpha})`);
    coreGrad.addColorStop(0.4, `rgba(255,150,200,${0.5 * alpha})`);
    coreGrad.addColorStop(1, `rgba(255,80,150,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * 樱花冲击 — 拳击地面冲击波 + 樱花碎片
   */
  function drawSakuraImpact(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 3;
    const r = size * progress;
    const alpha = Math.min(1, progress * 1.5);

    // 全屏粉色冲击波底色
    if (progress > 0.05) {
      const waveAlpha = Math.min(0.08, progress * 0.12);
      ctx.fillStyle = `rgba(255,150,190,${waveAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 地面冲击波环（3 圈扩张）
    for (let wave = 0; wave < 3; wave++) {
      const waveDelay = wave * 0.12;
      const waveProgress = Math.max(0, Math.min(1, (progress - waveDelay) / 0.7));
      if (waveProgress <= 0) continue;
      const waveR = r * 2.5 * waveProgress;
      const waveAlpha = (1 - waveProgress * 0.6) * alpha;
      ctx.beginPath(); ctx.arc(x, y, waveR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,190,215,${0.5 * waveAlpha})`;
      ctx.lineWidth = 3.5 - wave;
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,140,185,${0.18 * waveAlpha})`;
      ctx.lineWidth = 12;
      ctx.stroke();
    }

    // 地面裂纹线（从拳击点辐射）
    if (progress > 0.1) {
      const crackAlpha = Math.min(1, (progress - 0.1) / 0.3);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const len = r * (1.2 + Math.sin(time * 2 + i) * 0.3);
        ctx.beginPath(); ctx.moveTo(x, y);
        const segments = 5;
        for (let s = 1; s <= segments; s++) {
          const t = s / segments;
          const jitter = (Math.sin(time * 3 + i * 7 + s * 5) * 0.3) * t * len;
          const lx = x + Math.cos(angle) * t * len + Math.cos(angle + Math.PI / 2) * jitter;
          const ly = y + Math.sin(angle) * t * len + Math.sin(angle + Math.PI / 2) * jitter;
          ctx.lineTo(lx, ly);
        }
        ctx.strokeStyle = `rgba(255,200,220,${(0.35 - i * 0.03) * crackAlpha * alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 樱花碎片飞散（增强：25 片，3 层深度）
    for (let i = 0; i < 25; i++) {
      const layer = i % 3;
      const angle = (i / 25) * Math.PI * 2 + time * (0.3 + layer * 0.1);
      const dist = r * (0.6 + layer * 0.3 + (i % 5) * 0.15) * Math.min(1, progress * 2);
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist - progress * (20 + layer * 15);
      const petalSize = (3 + layer) + Math.sin(time * 2 + i) * 1.5;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + time * (0.8 + layer * 0.3));
      // 花瓣形状
      ctx.beginPath();
      ctx.ellipse(0, 0, petalSize, petalSize * 0.45, 0, 0, Math.PI * 2);
      const colors = [
        `rgba(255,190,215,${(0.75 - layer * 0.1) * alpha})`,
        `rgba(255,150,190,${(0.65 - layer * 0.1) * alpha})`,
        `rgba(255,120,170,${(0.55 - layer * 0.1) * alpha})`
      ];
      ctx.fillStyle = colors[layer];
      ctx.fill();
      // 花瓣脉络
      ctx.beginPath();
      ctx.moveTo(-petalSize * 0.8, 0);
      ctx.quadraticCurveTo(0, -petalSize * 0.2, petalSize * 0.8, 0);
      ctx.strokeStyle = `rgba(255,200,220,${0.3 * alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }

    // 拳击点核心光效（脉冲）
    const pulseR = r * (0.35 + Math.sin(time * 4) * 0.05);
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, pulseR);
    coreGrad.addColorStop(0, `rgba(255,245,248,${0.95 * alpha})`);
    coreGrad.addColorStop(0.3, `rgba(255,200,220,${0.6 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(255,150,190,${0.25 * alpha})`);
    coreGrad.addColorStop(1, `rgba(255,120,170,0)`);
    ctx.beginPath(); ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * �的棺 — 金色沙暴包裹目标
   */
  function drawSandCoffin(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2.5;
    const r = size * (0.5 + progress * 0.5);
    const alpha = Math.min(1, progress * 1.5);

    // 全屏沙尘暴底色（增强）
    if (progress > 0.08) {
      const dustAlpha = Math.min(0.1, (progress - 0.08) * 0.15);
      ctx.fillStyle = `rgba(200,170,80,${dustAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 外层沙尘暴光晕
    const stormGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    stormGrad.addColorStop(0, `rgba(210,185,100,${0.1 * alpha})`);
    stormGrad.addColorStop(0.4, `rgba(190,165,80,${0.04 * alpha})`);
    stormGrad.addColorStop(1, `rgba(160,140,60,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = stormGrad; ctx.fill();

    // 旋转沙柱（4 层螺旋，每层更多粒子）
    for (let layer = 0; layer < 4; layer++) {
      const layerOffset = layer * 0.25;
      const count = 18 + layer * 2;
      for (let i = 0; i < count; i++) {
        const angle = time * (2.2 - layer * 0.35) + (i / count) * Math.PI * 2 + layerOffset;
        const spiralDist = r * (0.25 + (i / count) * 0.75);
        const spiralY = y - (i / count) * r * 1.8 + r * 0.6;
        const wobble = Math.sin(time * 4 + i * 0.5 + layer) * 4;
        const sx = x + Math.cos(angle) * (spiralDist + wobble);
        const sy = spiralY;
        const dotSize = 8 + layer * 2 + Math.sin(time * 3 + i) * 2;
        const sandGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, dotSize);
        sandGrad.addColorStop(0, `rgba(235,210,140,${(0.6 - layer * 0.1) * alpha})`);
        sandGrad.addColorStop(0.5, `rgba(210,185,100,${(0.35 - layer * 0.06) * alpha})`);
        sandGrad.addColorStop(1, `rgba(180,155,70,0)`);
        ctx.beginPath(); ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = sandGrad; ctx.fill();
      }
    }

    // 沙壁包裹球体（增强：双层描边 + 旋转纹理）
    const wallGrad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    wallGrad.addColorStop(0, `rgba(230,200,120,${0.1 * alpha})`);
    wallGrad.addColorStop(0.3, `rgba(210,180,95,${0.25 * alpha})`);
    wallGrad.addColorStop(0.6, `rgba(200,170,80,${0.35 * alpha})`);
    wallGrad.addColorStop(0.85, `rgba(180,150,60,${0.2 * alpha})`);
    wallGrad.addColorStop(1, `rgba(150,120,40,0)`);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = wallGrad; ctx.fill();

    // 球壁经纬线
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < 4; i++) {
      const lineAngle = time * 0.5 + (i / 4) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.85, r * 0.5, lineAngle, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,175,95,${0.15 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 球壁描边（双层发光）
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(215,185,105,${0.5 * alpha})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = `rgba(195,165,85,${0.15 * alpha})`;
    ctx.lineWidth = 10;
    ctx.stroke();

    // 核心沙色光球
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.3);
    coreGrad.addColorStop(0, `rgba(240,220,160,${0.6 * alpha})`);
    coreGrad.addColorStop(0.5, `rgba(210,185,110,${0.3 * alpha})`);
    coreGrad.addColorStop(1, `rgba(180,155,80,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * 砂瀑阵 — 球形沙壁护盾
   */
  function drawSandShield(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 2;
    const r = size * (0.4 + progress * 0.6);
    const alpha = Math.min(1, progress * 1.5);

    // 外层沙尘暴光晕
    const dustGrad = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 2);
    dustGrad.addColorStop(0, `rgba(210,185,110,${0.08 * alpha})`);
    dustGrad.addColorStop(0.5, `rgba(190,165,90,${0.03 * alpha})`);
    dustGrad.addColorStop(1, `rgba(160,140,70,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = dustGrad; ctx.fill();

    // 旋转沙粒环（3 层，每层不同速度和大小）
    for (let ring = 0; ring < 3; ring++) {
      const ringR = r * (0.8 + ring * 0.12);
      const count = 14 + ring * 4;
      for (let i = 0; i < count; i++) {
        const angle = time * (1.8 - ring * 0.4) + (i / count) * Math.PI * 2;
        const wobble = Math.sin(time * 3 + i * 0.7) * 3;
        const px = x + Math.cos(angle) * (ringR + wobble);
        const py = y + Math.sin(angle) * (ringR + wobble);
        const dotSize = 2.5 + Math.sin(time * 2 + i) * 1;
        ctx.beginPath(); ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        const dotGrad = ctx.createRadialGradient(px, py, 0, px, py, dotSize);
        dotGrad.addColorStop(0, `rgba(230,210,150,${(0.7 - ring * 0.15) * alpha})`);
        dotGrad.addColorStop(1, `rgba(190,170,100,0)`);
        ctx.fillStyle = dotGrad;
        ctx.fill();
      }
    }

    // 球形沙壁（增强：5 层渐变 + 旋转纹理）
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 0.3);
    const shieldGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
    shieldGrad.addColorStop(0, `rgba(255,255,240,${0.08 * alpha})`);
    shieldGrad.addColorStop(0.25, `rgba(230,210,150,${0.15 * alpha})`);
    shieldGrad.addColorStop(0.5, `rgba(210,190,120,${0.3 * alpha})`);
    shieldGrad.addColorStop(0.75, `rgba(190,170,100,${0.25 * alpha})`);
    shieldGrad.addColorStop(0.9, `rgba(170,150,80,${0.15 * alpha})`);
    shieldGrad.addColorStop(1, `rgba(150,130,60,0)`);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = shieldGrad; ctx.fill();

    // 沙壁经纬线纹理
    for (let i = 0; i < 6; i++) {
      const lineAngle = (i / 6) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * Math.sin(lineAngle + 0.5) * 0.9, lineAngle, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,180,110,${0.12 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 球壁描边（三层发光）
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(220,200,140,${0.5 * alpha})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = `rgba(200,180,110,${0.18 * alpha})`;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = `rgba(180,160,90,${0.06 * alpha})`;
    ctx.lineWidth = 20;
    ctx.stroke();

    // 中心光源（脉冲）
    const pulseScale = 1 + Math.sin(time * 3) * 0.1;
    const lightGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.35 * pulseScale);
    lightGrad.addColorStop(0, `rgba(255,255,245,${0.7 * alpha})`);
    lightGrad.addColorStop(0.4, `rgba(240,225,180,${0.3 * alpha})`);
    lightGrad.addColorStop(1, `rgba(220,200,140,0)`);
    ctx.beginPath(); ctx.arc(x, y, r * 0.35 * pulseScale, 0, Math.PI * 2);
    ctx.fillStyle = lightGrad; ctx.fill();

    ctx.restore();
  }

  /**
   * 神罗天征 — 全屏冲击波同心圆扩张
   */
  function drawShinraTensei(ctx, x, y, size, progress) {
    if (size < 2) return;
    ctx.save();
    const time = getTime() * 3;
    const r = size * progress * 2;
    const alpha = Math.min(1, progress * 1.5);

    // 全屏白色闪（初始爆发）
    if (progress > 0.05 && progress < 0.3) {
      const flashAlpha = Math.sin((progress - 0.05) / 0.25 * Math.PI) * 0.25;
      ctx.fillStyle = `rgba(220,230,255,${flashAlpha * alpha})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 冲击波底色扩散
    if (progress > 0.08) {
      const shockGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
      shockGrad.addColorStop(0, `rgba(200,220,255,${0.08 * alpha})`);
      shockGrad.addColorStop(0.4, `rgba(150,180,230,${0.04 * alpha})`);
      shockGrad.addColorStop(1, `rgba(100,140,200,0)`);
      ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = shockGrad; ctx.fill();
    }

    // 同心冲击波环（7 圈，依次扩张，每圈双层发光）
    for (let ring = 0; ring < 7; ring++) {
      const ringDelay = ring * 0.06;
      const ringProgress = Math.max(0, Math.min(1, (progress - ringDelay) / 0.55));
      if (ringProgress <= 0) continue;
      const ringR = r * (0.3 + ring * 0.12) * ringProgress;
      const ringAlpha = (1 - ringProgress * 0.65) * alpha;
      // 内层线
      ctx.beginPath(); ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220,235,255,${0.6 * ringAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // 外层发光
      ctx.strokeStyle = `rgba(170,200,255,${0.2 * ringAlpha})`;
      ctx.lineWidth = 12;
      ctx.stroke();
    }

    // 径向冲击线（18 条，含旋转）
    if (progress > 0.08) {
      const rayAlpha = Math.min(1, (progress - 0.08) / 0.25);
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + time * 0.3;
        const rayLen = r * (1.2 + (i % 3) * 0.3) * rayProgress(progress);
        const ex = x + Math.cos(angle) * rayLen;
        const ey = y + Math.sin(angle) * rayLen;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(210,225,255,${(0.35 - i * 0.012) * rayAlpha * alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 散射碎片点（冲击波前方的碎屑）
    if (progress > 0.15) {
      const debrisAlpha = Math.min(1, (progress - 0.15) / 0.3);
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time * 0.2;
        const dist = r * (0.6 + (i % 4) * 0.2) * debrisAlpha;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        ctx.beginPath(); ctx.arc(px, py, 2 + Math.sin(time * 3 + i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${0.5 * debrisAlpha * alpha})`;
        ctx.fill();
      }
    }

    // 中心斥力核心（双层光球）
    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.5);
    coreGrad.addColorStop(0, `rgba(255,255,255,${0.98 * alpha})`);
    coreGrad.addColorStop(0.15, `rgba(230,240,255,${0.7 * alpha})`);
    coreGrad.addColorStop(0.35, `rgba(200,220,255,${0.4 * alpha})`);
    coreGrad.addColorStop(0.7, `rgba(150,190,255,${0.15 * alpha})`);
    coreGrad.addColorStop(1, `rgba(100,150,255,0)`);
    ctx.beginPath(); ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad; ctx.fill();

    // 脉冲光环
    const pulseR = size * 0.3 * (1 + Math.sin(time * 4) * 0.15);
    const pulseGrad = ctx.createRadialGradient(x, y, pulseR * 0.5, x, y, pulseR);
    pulseGrad.addColorStop(0, `rgba(255,255,255,${0.3 * alpha})`);
    pulseGrad.addColorStop(1, `rgba(200,220,255,0)`);
    ctx.beginPath(); ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = pulseGrad; ctx.fill();

    ctx.restore();
  }

  // 光线长度衰减辅助函数
  function rayProgress(p) {
    return Math.min(1, p * 1.8);
  }

  // ==================== 返回 API ====================

  return {
    // 粒子生成
    spawnParticles,
    spawnSharinganParticles,
    spawnSmokeParticles,
    spawnAuraParticles,
    spawnDebrisParticles,
    spawnLightningParticles,
    spawnSandParticles,
    spawnSakuraParticles,
    spawnSealParticles,
    spawnChakraParticles,
    spawnBijuuParticles,
    // 粒子更新
    updateParticles,
    // 特效绘制
    drawHollowPurple,
    drawSharingan,
    drawShadowClone,
    drawEightGates,
    drawChibakuTensei,
    drawRasenshuriken,
    drawSusano,
    drawAmaterasu,
    drawTsukuyomi,
    drawRasengan,
    drawBijuuDama,
    drawKirin,
    drawTotsuka,
    drawByakugou,
    drawSakuraImpact,
    drawSandCoffin,
    drawSandShield,
    drawShinraTensei
  };
}

// 导出工厂函数
export default createEffectsSystem;
