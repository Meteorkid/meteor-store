// @ts-nocheck
/* eslint-disable */
/**
 * 粒子系统模块
 * 从 Camera.jsx 提取的粒子系统逻辑
 * 使用对象池优化内存分配
 */

import { createObjectPool } from '../utils/performance';

// 粒子类型常量
export const PARTICLE_TYPES = {
  DEFAULT: 'default',
  SHARINGAN: 'sharingan',
  SMOKE: 'smoke',
  AURA: 'aura',
  DEBRIS: 'debris',
};

/**
 * 创建粒子系统
 */
export function createParticleSystem(limit = 350) {
  const particles = [];

  // 粒子对象池
  const particlePool = createObjectPool(
    () => ({
      x: 0, y: 0,
      vx: 0, vy: 0,
      life: 1,
      decay: 0.01,
      size: 5,
      color: 'rgba(255,255,255,',
      type: PARTICLE_TYPES.DEFAULT,
      rotation: 0,
      rotSpeed: 0,
      targetX: 0,
      targetY: 0,
    }),
    (p) => {
      p.x = 0; p.y = 0;
      p.vx = 0; p.vy = 0;
      p.life = 1; p.decay = 0.01;
      p.size = 5;
      p.color = 'rgba(255,255,255,';
      p.type = PARTICLE_TYPES.DEFAULT;
      p.rotation = 0; p.rotSpeed = 0;
      p.targetX = 0; p.targetY = 0;
    },
    200
  );

  /**
   * 获取粒子对象（从池中获取或创建）
   */
  function getParticle() {
    return particlePool.acquire();
  }

  /**
   * 释放粒子对象（归还到池中）
   */
  function releaseParticle(p) {
    particlePool.release(p);
  }

  /**
   * 生成默认粒子
   */
  function spawnDefault(x, y, size = 80) {
    for (let i = 0; i < 8; i++) {
      if (particles.length >= limit) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const p = getParticle();
      p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 1;
      p.decay = 0.015 + Math.random() * 0.025;
      p.size = (3 + Math.random() * 6) * (size / 80);
      p.color = Math.random() > 0.5 ? 'rgba(80,160,255,' : 'rgba(200,60,255,';
      p.type = PARTICLE_TYPES.DEFAULT;
      particles.push(p);
    }
  }

  /**
   * 生成写轮眼粒子
   */
  function spawnSharingan(x, y, size = 80) {
    for (let i = 0; i < 6; i++) {
      if (particles.length >= limit) return;
      const angle = Math.random() * Math.PI * 2;
      const dist = size * 0.3 + Math.random() * size * 0.5;
      const p = getParticle();
      p.x = x + Math.cos(angle) * dist;
      p.y = y + Math.sin(angle) * dist;
      p.vx = Math.cos(angle + Math.PI / 2) * 1.2;
      p.vy = Math.sin(angle + Math.PI / 2) * 1.2;
      p.life = 1;
      p.decay = 0.008 + Math.random() * 0.012;
      p.size = 2 + Math.random() * 4;
      p.type = PARTICLE_TYPES.SHARINGAN;
      particles.push(p);
    }
  }

  /**
   * 生成烟雾粒子
   */
  function spawnSmoke(x, y) {
    for (let i = 0; i < 8; i++) {
      if (particles.length >= limit) return;
      const p = getParticle();
      p.x = x + (Math.random() - 0.5) * 80;
      p.y = y + (Math.random() - 0.5) * 50;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.vy = -0.5 - Math.random() * 1.5;
      p.life = 1;
      p.decay = 0.004 + Math.random() * 0.006;
      p.size = 25 + Math.random() * 45;
      p.type = PARTICLE_TYPES.SMOKE;
      particles.push(p);
    }
  }

  /**
   * 生成光环粒子
   */
  function spawnAura(x, y, power = 1) {
    const count = Math.floor(8 + power * 12);
    for (let i = 0; i < count; i++) {
      if (particles.length >= limit) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + power * 8 + Math.random() * 4;
      const p = getParticle();
      p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 1;
      p.decay = 0.015 + Math.random() * 0.02;
      p.size = 2 + Math.random() * 5;
      p.type = PARTICLE_TYPES.AURA;
      particles.push(p);
    }
  }

  /**
   * 生成碎片粒子
   */
  function spawnDebris(x, y) {
    for (let i = 0; i < 6; i++) {
      if (particles.length >= limit) return;
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 350;
      const p = getParticle();
      p.x = x + Math.cos(angle) * dist;
      p.y = y + Math.sin(angle) * dist;
      p.vx = 0; p.vy = 0;
      p.life = 1;
      p.decay = 0.002 + Math.random() * 0.004;
      p.size = 3 + Math.random() * 8;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.2;
      p.targetX = x; p.targetY = y;
      p.type = PARTICLE_TYPES.DEBRIS;
      particles.push(p);
    }
  }

  /**
   * 更新所有粒子
   * @param {number} dt - 时间增量（秒）
   */
  function update(dt = 1) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // 更新位置
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // 碎片特殊处理：向目标移动
      if (p.type === PARTICLE_TYPES.DEBRIS && p.targetX !== undefined) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          p.vx = (dx / dist) * 2;
          p.vy = (dy / dist) * 2;
        }
        p.rotation += p.rotSpeed * dt;
      }

      // 更新生命周期
      p.life -= p.decay * dt;

      // 移除死亡粒子并归还到对象池
      if (p.life <= 0) {
        particles.splice(i, 1);
        releaseParticle(p);
      }
    }
  }

  /**
   * 渲染所有粒子
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  function render(ctx) {
    for (const p of particles) {
      const alpha = p.life;

      ctx.globalAlpha = alpha;

      switch (p.type) {
        case PARTICLE_TYPES.SMOKE:
          renderSmoke(ctx, p, alpha);
          break;
        case PARTICLE_TYPES.AURA:
          renderAura(ctx, p, alpha);
          break;
        case PARTICLE_TYPES.DEBRIS:
          renderDebris(ctx, p, alpha);
          break;
        case PARTICLE_TYPES.SHARINGAN:
          renderSharingan(ctx, p, alpha);
          break;
        default:
          renderDefault(ctx, p, alpha);
      }
    }

    ctx.globalAlpha = 1;
  }

  /**
   * 渲染默认粒子
   */
  function renderDefault(ctx, p, alpha) {
    ctx.fillStyle = `${p.color}${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 渲染写轮眼粒子
   */
  function renderSharingan(ctx, p, alpha) {
    ctx.fillStyle = `rgba(255,0,0,${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 渲染烟雾粒子
   */
  function renderSmoke(ctx, p, alpha) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, `rgba(200,200,200,${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(200,200,200,0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 渲染光环粒子
   */
  function renderAura(ctx, p, alpha) {
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 渲染碎片粒子
   */
  function renderDebris(ctx, p, alpha) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation || 0);
    ctx.fillStyle = `rgba(100,100,100,${alpha})`;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }

  /**
   * 清除所有粒子
   */
  function clear() {
    // 归还所有粒子到对象池
    for (const p of particles) {
      releaseParticle(p);
    }
    particles.length = 0;
  }

  /**
   * 获取粒子数量
   */
  function getCount() {
    return particles.length;
  }

  /**
   * 获取所有粒子（只读）
   */
  function getParticles() {
    return [...particles];
  }

  /**
   * 检查是否达到粒子上限
   */
  function isAtLimit() {
    return particles.length >= limit;
  }

  return {
    get particles() { return particles; },
    spawnDefault,
    spawnSharingan,
    spawnSmoke,
    spawnAura,
    spawnDebris,
    update,
    render,
    clear,
    getCount,
    getParticles,
    isAtLimit,
    getPoolStats: () => particlePool.getStats(),
    acquireParticle: () => particlePool.acquire(),
    releaseParticle: (p) => particlePool.release(p),
  };
}
