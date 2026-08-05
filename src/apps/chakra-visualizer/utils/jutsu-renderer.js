// @ts-nocheck
/* eslint-disable */
/**
 * 共享的大招渲染逻辑 — Camera.jsx 和 Tutorial.jsx 统一调用
 *
 * @param {CanvasRenderingContext2D} ctx - canvas 上下文
 * @param {Object} effects - effects 系统实例
 * @param {Object} particleSys - 粒子系统实例
 * @param {string} type - 忍术类型
 * @param {number} x - 中心 X 坐标
 * @param {number} y - 中心 Y 坐标
 * @param {number} progress - 大招进度 (0-1)
 * @param {number} t - 时间戳（用于非大招忍术的动画）
 */
export function drawJutsuEffect(ctx, effects, particleSys, type, x, y, progress, t = 0) {
  const particles = particleSys.particles;

  switch (type) {
    // === 大招忍术 ===
    case 'rasenshuriken':
      effects.drawRasenshuriken(ctx, x, y, 180, progress);
      effects.spawnAuraParticles(particles, x, y, progress * 0.9);
      effects.spawnParticles(particles, x, y, 100);
      break;
    case 'susano':
      effects.drawSusano(ctx, x, y, 240, progress);
      effects.spawnAuraParticles(particles, x, y, progress * 0.7);
      break;
    case 'amaterasu':
      effects.drawAmaterasu(ctx, x, y, 150, progress);
      effects.spawnAuraParticles(particles, x, y, progress * 0.5);
      break;
    case 'tsukuyomi':
      effects.drawTsukuyomi(ctx, x, y, 200, progress);
      effects.spawnAuraParticles(particles, x, y, progress * 0.6);
      break;
    case 'rasengan-big':
      effects.drawRasengan(ctx, x, y, 240, progress);
      effects.spawnChakraParticles(particles, x, y, 120, `rgba(80,180,255,`, `rgba(150,220,255,`);
      effects.spawnAuraParticles(particles, x, y, progress * 0.8);
      break;
    case 'bijuu-dama':
      effects.drawBijuuDama(ctx, x, y, 300, progress);
      effects.spawnBijuuParticles(particles, x, y, 200);
      effects.spawnAuraParticles(particles, x, y, progress * 0.7);
      break;
    case 'kirin':
      effects.drawKirin(ctx, x, y, 250, progress);
      effects.spawnLightningParticles(particles, x, y, 180);
      effects.spawnAuraParticles(particles, x, y, progress * 0.6);
      break;
    case 'totsuka':
      effects.drawTotsuka(ctx, x, y, 220, progress);
      effects.spawnSealParticles(particles, x, y, 150);
      effects.spawnAuraParticles(particles, x, y, progress * 0.5);
      break;
    case 'byakugou':
      effects.drawByakugou(ctx, x, y, 240, progress);
      effects.spawnChakraParticles(particles, x, y, 130, `rgba(255,180,210,`, `rgba(255,120,180,`);
      effects.spawnAuraParticles(particles, x, y, progress * 0.7);
      break;
    case 'sakura-impact':
      effects.drawSakuraImpact(ctx, x, y, 250, progress);
      effects.spawnSakuraParticles(particles, x, y, 160);
      effects.spawnDebrisParticles(particles, x, y, 120);
      break;
    case 'sand-coffin':
      effects.drawSandCoffin(ctx, x, y, 220, progress);
      effects.spawnSandParticles(particles, x, y, 160);
      effects.spawnDebrisParticles(particles, x, y, 100);
      break;
    case 'sand-shield':
      effects.drawSandShield(ctx, x, y, 220, progress);
      effects.spawnSandParticles(particles, x, y, 150);
      effects.spawnDebrisParticles(particles, x, y, 90);
      break;
    case 'shinra':
      effects.drawShinraTensei(ctx, x, y, 300, progress);
      effects.spawnLightningParticles(particles, x, y, 200);
      effects.spawnAuraParticles(particles, x, y, progress * 0.9);
      break;

    // === 非大招忍术（预览用 time 驱动） ===
    case 'hollow-purple': {
      const sz = 30 + Math.sin(t * 2) * 15;
      effects.drawHollowPurple(ctx, x, y, sz);
      effects.spawnParticles(particles, x, y, sz);
      break;
    }
    case 'sharingan': {
      const ss = 40 + Math.sin(t * 2) * 15;
      effects.drawSharingan(ctx, x, y, ss, 0.8);
      effects.spawnSharinganParticles(particles, x, y, ss);
      break;
    }
    case 'shadow-clone': {
      effects.spawnSmokeParticles(particles, x, y);
      ctx.save();
      const smoke = [
        { dx: 50, dy: -20, a: 0.5 }, { dx: -40, dy: 30, a: 0.35 },
        { dx: 60, dy: 40, a: 0.2 }, { dx: -30, dy: -35, a: 0.15 }
      ];
      smoke.forEach((s, i) => {
        const pulse = Math.sin(t * 3 + i * 1.5) * 5;
        const r = 35 + pulse;
        const grad = ctx.createRadialGradient(x + s.dx, y + s.dy, 0, x + s.dx, y + s.dy, r);
        grad.addColorStop(0, `rgba(180,180,255,${s.a})`);
        grad.addColorStop(1, 'rgba(100,100,200,0)');
        ctx.beginPath();
        ctx.arc(x + s.dx, y + s.dy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.restore();
      break;
    }
    case 'eight-gates': {
      const gatePower = 0.5 + Math.sin(t * 2) * 0.3;
      effects.drawEightGates(ctx, x, y, gatePower);
      effects.spawnAuraParticles(particles, x, y, gatePower);
      break;
    }
    case 'chibaku-tensei': {
      const cSize = 20 + Math.sin(t * 1.5) * 10;
      effects.drawChibakuTensei(ctx, x, y, cSize, 0.6);
      effects.spawnDebrisParticles(particles, x, y, cSize);
      break;
    }
    default: {
      ctx.save();
      const r = 30 + Math.sin(t * 3) * 10;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.4)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.restore();
      break;
    }
  }
}
