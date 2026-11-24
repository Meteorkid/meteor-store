/** 由内到外排列。行星名称来自太阳系，产品归属是商城导览的分组。 */
export const orbitProductGroups = [
  { id: 'mercury', name: { zh: '水星', en: 'Mercury' }, productIds: ['statux', 'omnicrawl'] },
  { id: 'venus', name: { zh: '金星', en: 'Venus' }, productIds: ['ui-design-system'] },
  { id: 'earth', name: { zh: '地球', en: 'Earth' }, productIds: ['xisland', 'xnook'] },
  { id: 'mars', name: { zh: '火星', en: 'Mars' }, productIds: ['claude-phone-control', 'cursor-source-analyzer'] },
  { id: 'jupiter', name: { zh: '木星', en: 'Jupiter' }, productIds: ['ex-memory', 'tollow'] },
  { id: 'saturn', name: { zh: '土星', en: 'Saturn' }, productIds: ['duocast'] },
  { id: 'uranus', name: { zh: '天王星', en: 'Uranus' }, productIds: ['skeleton-anatomy'] },
  { id: 'neptune', name: { zh: '海王星', en: 'Neptune' }, productIds: ['chakra-visualizer', 'webgl-fluid-sim'] },
] as const;

export type OrbitPlanetId = (typeof orbitProductGroups)[number]['id'];
