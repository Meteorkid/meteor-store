import * as THREE from 'orbit-three';
import { ORBIT_SUN } from '../orbit-bodies';
import { createReferenceGlowMaterial, createReferenceStarMaterial } from './materials';

// 固定种子沿用演示，使星带与小行星在每次打开时保持相同位置。
function makeRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let value = Math.imul(seed ^ (seed >>> 15), seed | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createAsteroidBelt(pixelRatio: number) {
  const next = makeRandom(1801);
  const positions = new Float32Array(1800 * 3);
  for (let index = 0; index < positions.length; index += 3) {
    const angle = next() * Math.PI * 2;
    const radius = .9 + next() * .2;
    positions[index] = Math.cos(angle) * radius;
    positions[index + 1] = (next() - .5) * .024;
    positions[index + 2] = Math.sin(angle) * radius;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: '#8e99ad', size: 1.1 * pixelRatio, sizeAttenuation: false,
    transparent: true, opacity: .5, depthWrite: false, toneMapped: false,
  });
  const belt = new THREE.Points(geometry, material);
  belt.frustumCulled = false;
  belt.scale.setScalar(36);
  return belt;
}

function createStarfield(count: number, pixelRatio: number) {
  const next = makeRandom(4000);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  const bandNormal = new THREE.Vector3(.42, .82, -.38).normalize();
  const direction = new THREE.Vector3();
  for (let index = 0; index < count; index++) {
    if (next() < .55) {
      direction.set(next() - .5, next() - .5, next() - .5).normalize();
      direction.addScaledVector(bandNormal, -direction.dot(bandNormal)).normalize();
      direction.addScaledVector(bandNormal, (next() + next() + next() - 1.5) * .2).normalize();
    } else {
      const z = next() * 2 - 1;
      const angle = next() * Math.PI * 2;
      const q = Math.sqrt(1 - z * z);
      direction.set(q * Math.cos(angle), z, q * Math.sin(angle));
    }
    direction.multiplyScalar(4000).toArray(positions, index * 3);
    const intensity = next() ** 4;
    sizes[index] = 1 + intensity * 1.6;
    brightness[index] = .16 + intensity * .62 + next() * .14;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aBright', new THREE.BufferAttribute(brightness, 1));
  const stars = new THREE.Points(geometry, createReferenceStarMaterial(pixelRatio));
  stars.frustumCulled = false;
  stars.renderOrder = -10;
  return stars;
}

export function createReferenceSpaceObjects(coarse: boolean, pixelRatio: number) {
  const count = coarse ? 3000 : 6000;
  const glow = new THREE.Sprite(createReferenceGlowMaterial(ORBIT_SUN.palette));
  glow.scale.setScalar(ORBIT_SUN.radius * 6);
  const stars = createStarfield(count, pixelRatio);
  const belt = createAsteroidBelt(pixelRatio);

  return {
    stars, belt, glow,
    setPixelRatio(ratio: number) {
      belt.material.size = 1.1 * ratio;
      stars.material.uniforms.uPixelRatio.value = ratio;
    },
    halveStars() {
      stars.geometry.setDrawRange(0, Math.floor(count / 2));
    },
    updateSunGlow(distance: number, focalLength: number) {
      glow.scale.setScalar(Math.max(ORBIT_SUN.radius * 6, 14 * distance / focalLength));
    },
  };
}
