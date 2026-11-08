export type SkyLayer = 0 | 1 | 2;

export interface SkyLight {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  layer: SkyLayer;
  depth: number;
  scale: number;
  opacityGain: number;
  cycle: number;
  duration: number;
  envelopeType: SkyLayer;
  phase: number;
  styleIndex: number;
  colorIndex: number;
  radius: number;
  twinkleCycle: number;
  twinklePhase: number;
  twinkleDuty: number;
  twinklePeak: number;
  twinkleFloor: number;
  glint: boolean;
  textAttenuation: number;
}

export const STAR_COLORS = ['205,221,243', '236,233,221', '238,212,174', '189,212,241'] as const;
export const PHONE_STYLES = [
  { column: 0, row: 0, ledX: .54545, ledY: .14371 },
  { column: 1, row: 0, ledX: .41764, ledY: .19013 },
  { column: 2, row: 0, ledX: .63064, ledY: .20824 },
  { column: 3, row: 0, ledX: .48491, ledY: .21544 },
  { column: 0, row: 1, ledX: .61156, ledY: .21049 },
  { column: 1, row: 1, ledX: .64341, ledY: .37256 },
  { column: 2, row: 1, ledX: .51598, ledY: .11430 },
  { column: 3, row: 1, ledX: .48957, ledY: .17269 },
  { column: 0, row: 2, ledX: .78489, ledY: .40365 },
  { column: 1, row: 2, ledX: .54191, ledY: .23312 },
  { column: 2, row: 2, ledX: .64424, ledY: .30051 },
  { column: 3, row: 2, ledX: .45976, ledY: .17994 },
] as const;

export function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

export function smooth(value: number): number {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

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

/** 同一条记录同时决定星光和手机的位置；固定种子使缩放不重新洗牌。 */
export function createLights(): SkyLight[] {
  const random = seededRandom(749215);
  const clusters = Array.from({ length: 11 }, () => ({ x: .12 + random() * .76, y: .12 + random() * .76 }));
  return Array.from({ length: 20000 }, (_, id) => {
    let x = random();
    let y = random();
    if (id % 6 === 0) {
      const cluster = clusters[Math.floor(random() * clusters.length)];
      x = clamp(cluster.x + (random() + random() - 1) * .15, .006, .994);
      y = clamp(cluster.y + (random() + random() - 1) * .12, .006, .994);
    }
    const rank = random();
    const layer: SkyLayer = rank < .55 ? 0 : rank < .90 ? 1 : 2;
    const depth = layer === 0 ? .06 + random() * .25 : layer === 1 ? .33 + random() * .30 : .68 + random() * .32;
    const opacityGain = layer === 0 ? .06 + random() * .12 : layer === 1 ? .20 + random() * .28 : .38 + random() * .42;
    const scale = layer === 0 ? .20 + random() * .18 : layer === 1 ? .40 + random() * .32 : .72 + random() * .28;
    const envelopeType = Math.floor(random() * 3) as SkyLayer;
    const cycle = envelopeType === 0 ? 7 + random() * 6 : envelopeType === 1 ? 5 + random() * 4 : 9 + random() * 7;
    const duration = cycle * (.50 + random() * .25);
    const twinkleCycle = 2.8 + random() * 5.2;
    const distance = ((x - .5) / .39) ** 2 + ((y - .48) / .28) ** 2;
    return {
      x, y, screenX: 0, screenY: 0, layer, depth, scale, opacityGain, cycle, duration,
      envelopeType, phase: random() * cycle, styleIndex: id % PHONE_STYLES.length,
      colorIndex: Math.floor(random() * STAR_COLORS.length),
      radius: layer === 0 ? .24 + random() * .29 : layer === 1 ? .48 + random() * .27 : .70 + random() * .38,
      twinkleCycle, twinklePhase: random() * twinkleCycle, twinkleDuty: .21 + random() * .09,
      twinklePeak: layer === 0 ? .14 + random() * .32 : layer === 1 ? .34 + random() * .40 : .62 + random() * .32,
      twinkleFloor: random() * .008, glint: random() < .055,
      textAttenuation: .80 + .20 * smooth(clamp(distance, 0, 1)),
    };
  });
}

export function starAlpha(light: SkyLight, time: number): number {
  const age = (time + light.twinklePhase) % light.twinkleCycle;
  const duration = light.twinkleCycle * light.twinkleDuty;
  if (age >= duration) return light.twinkleFloor;
  const progress = age / duration;
  let pulse = Math.min(smooth(progress / .36), smooth((1 - progress) / .46));
  if (light.glint) pulse += .14 * Math.exp(-Math.pow((progress - .51) / .065, 2));
  return clamp(light.twinkleFloor + light.twinklePeak * pulse * light.textAttenuation, 0, 1);
}

export function phoneAlpha(light: SkyLight, time: number): number {
  const age = (time + light.phase) % light.cycle;
  if (age >= light.duration) return 0;
  const progress = age / light.duration;
  const envelope = light.envelopeType === 0
    ? Math.min(smooth(progress / .16), smooth((1 - progress) / .24))
    : light.envelopeType === 1
      ? Math.min(smooth(progress / .30), smooth((1 - progress) / .58))
      : smooth(Math.sin(Math.PI * progress));
  return envelope * light.opacityGain * light.textAttenuation;
}
