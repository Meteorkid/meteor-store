export const ORBIT_SUN = {
  id: 'sun',
  radius: 4.2,
  tilt: 7.25,
  rotationHours: 600,
  palette: ['#ffd27a', '#ff8a2a', '#c2410c'],
} as const;

interface SourcePlanet {
  id: string;
  diameter: number;
  distanceKm: number;
  orbitDays: number;
  rotationHours: number;
  angle: number;
  tilt: number;
  kind: 'cratered' | 'clouds' | 'earth' | 'rust' | 'storm' | 'bands' | 'ice' | 'streaks';
  recipe: 'cratered' | 'cloudDeck' | 'continents' | 'rust' | 'bandsStorm' | 'softBands' | 'smooth' | 'streaks';
  palette: readonly [string, string, ...string[]];
  atmosphere: { color: string; strength: number } | null;
  rings: { inner: number; outer: number; gap: readonly [number, number]; color: string } | null;
  focus: { azimuth: number; elevation: number; distance: number };
  fallback: readonly [number, number];
  compact: readonly [number, number];
  clouds?: boolean;
}

const planets = [
  {
    id: 'mercury', diameter: 4879, distanceKm: 57_900_000, orbitDays: 88, rotationHours: 1407.6, angle: 200, tilt: 0,
    kind: 'cratered', recipe: 'cratered', palette: ['#8c8580', '#5a544f'], atmosphere: null, rings: null,
    focus: { azimuth: 40, elevation: 10, distance: 4.2 }, fallback: [45, 61], compact: [53, 57],
  },
  {
    id: 'venus', diameter: 12104, distanceKm: 108_200_000, orbitDays: 224.7, rotationHours: -5832.5, angle: 75, tilt: 2.6,
    kind: 'clouds', recipe: 'cloudDeck', palette: ['#e8cfa0', '#c49a5c'],
    atmosphere: { color: '#f0d9a8', strength: .35 }, rings: null,
    focus: { azimuth: -30, elevation: 8, distance: 4 }, fallback: [57, 38], compact: [37, 49],
  },
  {
    id: 'earth', diameter: 12756, distanceKm: 149_600_000, orbitDays: 365.2, rotationHours: 23.9, angle: 310, tilt: 23.4,
    kind: 'earth', recipe: 'continents', palette: ['#12355b', '#3f6b3a', '#b59b6a'], clouds: true,
    atmosphere: { color: '#5fa8ff', strength: .9 }, rings: null,
    focus: { azimuth: 50, elevation: 14, distance: 3.6 }, fallback: [49, 71], compact: [60, 34],
  },
  {
    id: 'mars', diameter: 6792, distanceKm: 227_900_000, orbitDays: 687, rotationHours: 24.6, angle: 140, tilt: 25.2,
    kind: 'rust', recipe: 'rust', palette: ['#b5502b', '#7a3a22', '#e9ddcf'],
    atmosphere: { color: '#d98a5f', strength: .25 }, rings: null,
    focus: { azimuth: -42, elevation: 10, distance: 3.8 }, fallback: [38, 35], compact: [39, 73],
  },
  {
    id: 'jupiter', diameter: 142984, distanceKm: 778_500_000, orbitDays: 4331, rotationHours: 9.9, angle: 30, tilt: 3.1,
    kind: 'storm', recipe: 'bandsStorm', palette: ['#efe3cf', '#d9c09a', '#a8764e', '#8a5a3a', '#c9806a'],
    atmosphere: null, rings: null,
    focus: { azimuth: 38, elevation: 6, distance: 3.4 }, fallback: [76, 51], compact: [28, 25],
  },
  {
    id: 'saturn', diameter: 120536, distanceKm: 1_430_000_000, orbitDays: 10747, rotationHours: 10.7, angle: 245, tilt: 26.7,
    kind: 'bands', recipe: 'softBands', palette: ['#e3d2a8', '#c2a878'], atmosphere: null,
    rings: { inner: 1.24, outer: 2.27, gap: [1.95, 2.03], color: '#d9c9a3' },
    focus: { azimuth: 64, elevation: 18, distance: 5.2 }, fallback: [12, 63], compact: [83, 59],
  },
  {
    id: 'uranus', diameter: 51118, distanceKm: 2_867_000_000, orbitDays: 30589, rotationHours: -17.2, angle: 110, tilt: 97.8,
    kind: 'ice', recipe: 'smooth', palette: ['#a9dce3', '#8cc7d1'],
    atmosphere: { color: '#9fe6ee', strength: .4 }, rings: null,
    focus: { azimuth: -36, elevation: 12, distance: 4.4 }, fallback: [57, 19], compact: [11, 81],
  },
  {
    id: 'neptune', diameter: 49528, distanceKm: 4_515_000_000, orbitDays: 59800, rotationHours: 16.1, angle: 340, tilt: 28.3,
    kind: 'streaks', recipe: 'streaks', palette: ['#2f5bd0', '#5e86e8'],
    atmosphere: { color: '#6f9bff', strength: .5 }, rings: null,
    focus: { azimuth: 58, elevation: 6, distance: 4.2 }, fallback: [91, 78], compact: [53, 10],
  },
] as const satisfies readonly SourcePlanet[];

export type OrbitBodyId = (typeof planets)[number]['id'];
export type OrbitBodyStyle = SourcePlanet['kind'];

const referenceDistance = planets[0].distanceKm;
const referenceDiameter = planets[2].diameter;
const distanceSpan = Math.log(planets[7].distanceKm / referenceDistance);

/** 保留原演示的可读比例，按对数分布轨道，以直径平方根缩放行星。 */
export const ORBIT_BODIES = planets.map(body => {
  const radius = Math.max(.35, Math.min(2.6, .78 * Math.sqrt(body.diameter / referenceDiameter)));
  const clouds = 'clouds' in body && body.clouds;
  return {
    ...body,
    radius,
    distance: 8 + 62 * Math.log(body.distanceKm / referenceDistance) / distanceSpan,
    surface: { recipe: body.recipe, palette: body.palette, clouds },
    colours: body.id === 'earth' || body.id === 'neptune'
      ? [body.palette[0], body.palette[1]]
      : [body.palette[1], body.palette[0]],
    size: Math.round(11 + radius * 8),
  };
});
