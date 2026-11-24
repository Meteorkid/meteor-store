import * as THREE from 'orbit-three';
import { bakeFragment, bakeVertex, type SurfaceRecipe } from './shaders';

// Bakes one surface once: a fullscreen fragment shader turns each texel into a
// direction on the unit sphere and samples seamless 3D noise there.
export function bakeSurface(
  renderer: THREE.WebGLRenderer,
  recipe: SurfaceRecipe | 'clouds',
  palette: readonly string[],
  seed: number,
  width: number,
  height: number,
): THREE.WebGLRenderTarget {
  const target = new THREE.WebGLRenderTarget(width, height, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
    colorSpace: THREE.SRGBColorSpace,
    anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()),
  });

  const color = (i: number): THREE.Color =>
    new THREE.Color(palette[Math.min(i, palette.length - 1)] ?? '#ffffff');

  const material = new THREE.ShaderMaterial({
    vertexShader: bakeVertex,
    fragmentShader: bakeFragment(recipe),
    uniforms: {
      uC0: { value: color(0) },
      uC1: { value: color(1) },
      uC2: { value: color(2) },
      uC3: { value: color(3) },
      uC4: { value: color(4) },
      uSeed: { value: seed },
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  quad.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(quad);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const previousTarget = renderer.getRenderTarget();
  try {
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
  } catch (error) {
    target.dispose();
    throw error;
  } finally {
    renderer.setRenderTarget(previousTarget);
    material.dispose();
    geometry.dispose();
  }
  return target;
}
