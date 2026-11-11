export interface SkyParticle {
  /** 首屏归一化坐标，和外层球面星图分层。 */
  x: number;
  y: number;
  depth: number;
  size: number;
  opacity: number;
  colorIndex: number;
  phase: number;
  drift: number;
  driftSpeed: number;
  glowSpeed: number;
}

export const PARTICLE_COLORS = [
  '176,214,255',
  '224,235,248',
  '244,228,203',
  '204,197,255',
  '238,207,220',
] as const;

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

/** 固定的低密度尘埃场，缩放窗口时不会重新洗牌。 */
export function createParticles(): SkyParticle[] {
  const random = seededRandom(260311);
  return Array.from({ length: 420 }, () => {
    const rank = random();
    const tier = rank < .60 ? 0 : rank < .88 ? 1 : 2;
    return {
      // 留出一点边距，缓慢漂移时不会在四周露出空白。
      x: -.035 + random() * 1.07,
      y: -.035 + random() * 1.07,
      depth: tier === 0 ? .12 + random() * .24 : tier === 1 ? .38 + random() * .28 : .70 + random() * .28,
      size: tier === 0 ? 1.4 + random() * 2.4 : tier === 1 ? 4.5 + random() * 5.5 : 11 + random() * 13,
      opacity: tier === 0 ? .30 + random() * .18 : tier === 1 ? .15 + random() * .13 : .075 + random() * .08,
      colorIndex: Math.floor(random() * PARTICLE_COLORS.length),
      phase: random() * Math.PI * 2,
      drift: tier === 0 ? 1.2 + random() * 2.2 : tier === 1 ? 2.5 + random() * 4.5 : 4 + random() * 7,
      driftSpeed: .08 + random() * .13,
      glowSpeed: .28 + random() * .48,
    };
  });
}

export function particleAlpha(particle: SkyParticle, time: number): number {
  const glow = .72 + Math.sin(time * particle.glowSpeed + particle.phase) * .28;
  return Math.max(0, particle.opacity * glow);
}

export function particleDrift(particle: SkyParticle, time: number): { x: number; y: number } {
  const angle = time * particle.driftSpeed + particle.phase;
  return {
    x: Math.sin(angle) * particle.drift,
    y: Math.cos(angle * .73) * particle.drift * .55,
  };
}

/** 只吸引指针附近的粒子，二次衰减让边缘自然散开。 */
export function attractParticle(
  x: number,
  y: number,
  pointerX: number,
  pointerY: number,
  radius: number,
  strength: number,
): { x: number; y: number; influence: number } {
  const dx = pointerX - x;
  const dy = pointerY - y;
  const distance = Math.hypot(dx, dy);
  if (!Number.isFinite(distance) || distance >= radius || distance < .001 || strength <= 0) {
    return { x, y, influence: 0 };
  }
  const influence = (1 - distance / radius) ** 2;
  const displacement = Math.min(distance - .25, strength * influence);
  const pull = displacement / distance;
  return { x: x + dx * pull, y: y + dy * pull, influence };
}

/** 首页纵向粒子层的可见度：离开 Hero 后出现，黑洞进入视口前退场。 */
export function homeParticleOpacity(scrollY: number, heroBottom: number, blackHoleTop: number, viewportHeight: number): number {
  const viewport = Math.max(1, viewportHeight);
  const heroExit = heroBottom <= 0 ? 1 : Math.min(1, Math.max(0, (scrollY + viewport - heroBottom) / 180));
  if (!Number.isFinite(blackHoleTop)) return heroExit;
  const distanceToBlackHole = blackHoleTop - scrollY;
  const blackHoleExit = Math.min(1, Math.max(0, (distanceToBlackHole - viewport * .12) / (viewport * .58)));
  return Math.min(heroExit, blackHoleExit);
}

export function createParticleSprites(doc: Document): Array<HTMLCanvasElement | null> {
  return PARTICLE_COLORS.map(color => {
    const sprite = doc.createElement('canvas');
    sprite.width = 64;
    sprite.height = 64;
    const context = sprite.getContext('2d');
    if (!context) return null;
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 30);
    glow.addColorStop(0, `rgba(${color},.68)`);
    glow.addColorStop(.08, `rgba(${color},.36)`);
    glow.addColorStop(.30, `rgba(${color},.10)`);
    glow.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
    return sprite;
  });
}

export function releaseParticleSprites(sprites: ReadonlyArray<HTMLCanvasElement | null>): void {
  for (const sprite of sprites) {
    if (sprite) sprite.width = sprite.height = 0;
  }
}
