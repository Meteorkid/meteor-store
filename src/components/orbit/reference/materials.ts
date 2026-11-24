import * as THREE from 'orbit-three';
import { bakeSurface } from './bake';
import {
  atmosphereFragment,
  atmosphereVertex,
  ringFragment,
  ringVertex,
  starFragment,
  starVertex,
  sunFragment,
  sunVertex,
  type SurfaceRecipe,
} from './shaders';

interface ReferenceRing {
  inner: number;
  outer: number;
  gap: readonly [number, number];
  color: string;
}

interface ReferencePlanet {
  surface: { recipe: SurfaceRecipe; palette: readonly string[]; clouds?: boolean };
  atmosphere: { color: string; strength: number } | null;
  rings: ReferenceRing | null;
}

export function createReferenceSunMaterial(palette: readonly string[]): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: sunVertex,
    fragmentShader: sunFragment,
    uniforms: {
      uC0: { value: new THREE.Color(palette[0]) },
      uC1: { value: new THREE.Color(palette[1]) },
      uC2: { value: new THREE.Color(palette[2]) },
      uTime: { value: 12 },
    },
    toneMapped: false,
  });
}

export function createReferencePlanetMaterials(
  renderer: THREE.WebGLRenderer,
  body: ReferencePlanet,
  ordinal: number,
  coarse: boolean,
) {
  const bakeW = coarse ? 512 : 1024;
  const bakeH = coarse ? 256 : 512;
  const surface = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
  const clouds = body.surface.clouds ? new THREE.MeshStandardMaterial({
    roughness: 0.92,
    metalness: 0,
    transparent: true,
    depthWrite: false,
  }) : null;
  const atmosphere = body.atmosphere ? createAtmosphereMaterial(body.atmosphere) : null;
  const rings = body.rings ? createRingMaterial(body.rings) : null;
  let surfaceTarget: THREE.WebGLRenderTarget | null = null;
  let cloudTarget: THREE.WebGLRenderTarget | null = null;

  function restore() {
    const nextSurface = bakeSurface(renderer, body.surface.recipe, body.surface.palette, ordinal * 3.7, bakeW, bakeH);
    let nextCloud: THREE.WebGLRenderTarget | null;
    try {
      nextCloud = clouds ? bakeSurface(renderer, 'clouds', ['#ffffff'], 5.3, bakeW, bakeH) : null;
    } catch (error) {
      nextSurface.dispose();
      throw error;
    }

    surfaceTarget?.dispose();
    cloudTarget?.dispose();
    surfaceTarget = nextSurface;
    cloudTarget = nextCloud;
    surface.map = nextSurface.texture;
    if (clouds && nextCloud) clouds.map = nextCloud.texture;
  }

  function dispose() {
    surfaceTarget?.dispose();
    cloudTarget?.dispose();
    surface.dispose();
    clouds?.dispose();
    atmosphere?.dispose();
    if (rings) {
      rings.uniforms.uMap.value.dispose();
      rings.dispose();
    }
  }

  try {
    restore();
  } catch (error) {
    dispose();
    throw error;
  }

  return { surface, clouds, atmosphere, rings, restore, dispose };
}

function createAtmosphereMaterial(atmosphere: NonNullable<ReferencePlanet['atmosphere']>): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uColor: { value: new THREE.Color(atmosphere.color) },
      uStrength: { value: atmosphere.strength },
      uSunDir: { value: new THREE.Vector3(1, 0, 0) },
    },
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

// 保留原演示的固定种子，使环带亮度与间隙可复现。
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRingMaterial(rings: ReferenceRing): THREE.ShaderMaterial {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to draw Saturn ring texture');
  const rand = mulberry32(61);
  const lobes = Array.from({ length: 7 }, () => ({
    f: 6 + rand() * 60,
    p: rand() * Math.PI * 2,
    a: 0.05 + rand() * 0.12,
  }));
  ctx.clearRect(0, 0, 512, 4);
  for (let x = 0; x < 512; x++) {
    const t = x / 511;
    const r = rings.inner + t * (rings.outer - rings.inner);
    let alpha = 0;
    if (r < rings.gap[0] || r > rings.gap[1]) {
      const dense = THREE.MathUtils.smoothstep(r, 1.24, 1.56) * 0.45 + 0.42;
      alpha = dense;
      for (const l of lobes) alpha += Math.sin(t * l.f + l.p) * l.a;
      alpha *= THREE.MathUtils.smoothstep(t, 0, 0.03) * (1 - THREE.MathUtils.smoothstep(t, 0.97, 1));
      if (r > rings.gap[1]) alpha *= 0.72;
      alpha = THREE.MathUtils.clamp(alpha, 0.03, 0.95);
    }
    const shade = Math.round(150 + 105 * THREE.MathUtils.clamp(0.5 + Math.sin(t * 92) * 0.5, 0, 1));
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${alpha.toFixed(3)})`;
    ctx.fillRect(x, 0, 1, 4);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  return new THREE.ShaderMaterial({
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    uniforms: {
      uMap: { value: texture },
      uColor: { value: new THREE.Color(rings.color) },
      uSunLocal: { value: new THREE.Vector3(1, 0, 0) },
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

export function createReferenceRingGeometry(rings: ReferenceRing): THREE.RingGeometry {
  const geometry = new THREE.RingGeometry(rings.inner, rings.outer, 160, 1);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i));
    uv.setXY(i, (r - rings.inner) / (rings.outer - rings.inner), 0.5);
  }
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export function createReferenceGlowMaterial(palette: readonly string[]): THREE.SpriteMaterial {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to draw Sun glow texture');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const [c0, c1] = palette;
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.14, c0);
  g.addColorStop(0.34, `${c1}88`);
  g.addColorStop(0.62, `${c1}1c`);
  g.addColorStop(1, `${c1}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

export function createReferenceStarMaterial(pixelRatio: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uTint: { value: new THREE.Color('#DCE5F5') },
    },
    blending: THREE.AdditiveBlending,
    transparent: false,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
}
