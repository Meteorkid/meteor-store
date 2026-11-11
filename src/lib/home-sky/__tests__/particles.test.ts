import { describe, expect, it } from 'vitest';
import { attractParticle, createParticles, particleAlpha, particleDrift, PARTICLE_COLORS } from '../particles';

describe('首页宇宙尘埃', () => {
  it('使用固定种子生成低亮度、球面分布且带景深的粒子', () => {
    const first = createParticles();
    const second = createParticles();
    expect(first).toHaveLength(420);
    expect(first).toEqual(second);
    expect(first.every(particle => particle.x >= -.035 && particle.x <= 1.035 && particle.y >= -.035 && particle.y <= 1.035)).toBe(true);
    expect(first.every(particle => particle.depth >= 0 && particle.depth <= 1)).toBe(true);
    expect(first.every(particle => particle.colorIndex >= 0 && particle.colorIndex < PARTICLE_COLORS.length)).toBe(true);
    expect(Math.max(...first.map(particle => particle.opacity))).toBeLessThan(.64);
  });

  it('亮度始终很低，漂移随时间变化且保持柔和幅度', () => {
    const particles = createParticles();
    for (const particle of particles) {
      for (const time of [0, 3.5, 20, 120]) {
        expect(particleAlpha(particle, time)).toBeGreaterThanOrEqual(0);
        expect(particleAlpha(particle, time)).toBeLessThan(.64);
      }
      const start = particleDrift(particle, 0);
      const later = particleDrift(particle, 7.5);
      expect(Math.abs(start.x)).toBeLessThanOrEqual(particle.drift + 1e-9);
      expect(Math.abs(start.y)).toBeLessThanOrEqual(particle.drift * .55 + 1e-9);
      expect(start.x === later.x && start.y === later.y).toBe(false);
    }
  });

  it('只把半径内的粒子缓慢拉向指针，边缘影响趋近于零', () => {
    const off = attractParticle(0, 0, 100, 0, 50, 20);
    expect(off).toEqual({ x: 0, y: 0, influence: 0 });
    const center = attractParticle(10, 0, 20, 0, 100, 40);
    expect(center.x).toBeGreaterThan(10);
    expect(center.x).toBeLessThan(20);
    expect(center.y).toBe(0);
    const edge = attractParticle(1, 0, 100, 0, 100, 40);
    const nearCenter = attractParticle(90, 0, 100, 0, 100, 40);
    expect(edge.influence).toBeLessThan(nearCenter.influence);
    expect(edge.x - 1).toBeLessThan(nearCenter.x - 90);
  });
});
