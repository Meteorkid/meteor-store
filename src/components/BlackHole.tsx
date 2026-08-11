'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/motion';

// ─── 辅助：CLI 颜色梯度 → CanvasTexture ───
function createGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0.0, '#fffdf7');
  grad.addColorStop(0.08, '#ffedd5');
  grad.addColorStop(0.18, '#ffb347');
  grad.addColorStop(0.30, '#ff6b00');
  grad.addColorStop(0.45, '#e62e00');
  grad.addColorStop(0.65, '#9900cc');
  grad.addColorStop(0.85, '#331144');
  grad.addColorStop(1.0, '#0a0510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createNoiseTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    // 4 层 Perlin 风格噪波
    const x = (i % size) / size;
    const y = Math.floor(i / size) / size;
    let v = 0;
    let amp = 0.5, freq = 4, total = 0;
    for (let o = 0; o < 4; o++) {
      const sx = x * freq;
      const sy = y * freq;
      const ix = Math.floor(sx);
      const iy = Math.floor(sy);
      const fx = sx - ix;
      const fy = sy - iy;
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      const seed = (ix * 131 + iy * 257 + o * 71) * 0.0001;
      const h00 = (Math.sin(seed) * 43758.5453) % 1;
      const h10 = (Math.sin(seed + 0.1) * 43758.5453) % 1;
      const h01 = (Math.sin(seed + 0.2) * 43758.5453) % 1;
      const h11 = (Math.sin(seed + 0.3) * 43758.5453) % 1;
      const n = h00 * (1 - ux) * (1 - uy) + h10 * ux * (1 - uy) + h01 * (1 - ux) * uy + h11 * ux * uy;
      v += n * amp;
      total += amp;
      amp *= 0.5;
      freq *= 2;
    }
    v /= total;
    v = v * 0.5 + 0.5;
    const byte = Math.floor(v * 255);
    imageData.data[i * 4] = byte;
    imageData.data[i * 4 + 1] = byte;
    imageData.data[i * 4 + 2] = byte;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

// ═══════════════════════════════════════
// 着色器
// ═══════════════════════════════════════

// ── 吸积盘着色器 ──
const discVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    vPosition = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const discFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uGradient;
  uniform sampler2D uNoise;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = (v - inMin) / (inMax - inMin);
    return mix(outMin, outMax, t);
  }

  void main() {
    // 读取噪波
    vec2 nUV = vUv * 8.0 - uTime * 0.06;
    float n1 = texture2D(uNoise, nUV).r;
    float n2 = texture2D(uNoise, nUV * 0.7 + 0.3).g;
    float n3 = texture2D(uNoise, nUV * 0.5 + 0.6).b;
    float noise = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1);

    // 边缘羽化
    float outerFalloff = remap(vUv.y, 0.5, 0.0, 1.0, 0.0);
    float innerFalloff = remap(vUv.y, 1.0, 0.92, 0.0, 1.0);
    float falloff = min(outerFalloff, innerFalloff);
    falloff = smoothstep(0.0, 1.0, falloff);

    // 梯度 UV
    vec2 gUV = vUv;
    gUV.y += noise * 0.35;
    gUV.y *= falloff;

    vec4 color = texture2D(uGradient, gUV);
    // 亮度由噪波调制
    color.rgb *= 0.8 + noise * 0.5;

    // 半透明：内圈更亮
    float alpha = remap(vUv.y, 0.05, 0.6, 0.85, 0.15) * falloff;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color.rgb * 1.4, alpha);
  }
`;

// ── 星点着色器 ──
const starsVertexShader = /* glsl */ `
  attribute float size;
  varying vec3 vColor;
  varying float vSize;
  uniform float uTime;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
    vSize = size;
  }
`;

const starsFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vSize;
  uniform float uTime;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = 0.025 / d;
    alpha *= 1.0 - d * 2.0;
    alpha = clamp(alpha, 0.0, 1.0);
    float twinkle = 0.7 + 0.3 * sin(uTime * 1.5 + vSize * 10.0);
    gl_FragColor = vec4(vColor, alpha * twinkle * 0.8);
  }
`;

// ── 后处理：引力透镜扭曲 + 晕影 + RGB 色散 ──
const compositeVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const compositeFragmentShader = /* glsl */ `
  uniform sampler2D uScene;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    vec2 dir = dist > 0.001 ? toCenter / dist : vec2(0.0, 1.0);

    // 引力透镜：距离中心越近扭曲越强
    float lensStrength = 0.0;
    if (dist < 0.45) {
      lensStrength = pow(1.0 - dist / 0.45, 2.5) * 0.25;
    }
    vec2 lensedUV = uv + dir * lensStrength * (1.0 - dist);

    // RGB 色散（模拟大气/透镜色差）
    float chromaticShift = lensStrength * 0.012;
    float r = texture2D(uScene, lensedUV + dir * chromaticShift * 0.5).r;
    float g = texture2D(uScene, lensedUV).g;
    float b = texture2D(uScene, lensedUV - dir * chromaticShift * 0.5).b;

    vec4 color = vec4(r, g, b, 1.0);

    // 晕影
    float vignette = 1.0 - smoothstep(0.35, 0.8, dist) * 0.5;
    color.rgb *= vignette;

    // 胶片噪点
    float grain = (hash(uv * uTime * 0.01 + fract(uTime)) - 0.5) * 0.04;
    color.rgb += grain;

    gl_FragColor = color;
  }
`;

// ── 光环着色器（光子环） ──
const glowRingVertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowRingFragmentShader = /* glsl */ `
  varying vec3 vPos;
  uniform float uTime;
  void main() {
    float dist = length(vPos.xy);
    float ringRadius = 0.38;
    float ringWidth = 0.04;
    float alpha = exp(-pow((dist - ringRadius) / ringWidth, 2.0)) * 0.6;
    alpha += exp(-pow((dist - ringRadius) / (ringWidth * 3.0), 2.0)) * 0.12;
    // 轻微脉动
    alpha *= 0.8 + 0.2 * sin(uTime * 0.7) * sin(uTime * 1.3);
    vec3 col = mix(vec3(0.4, 0.5, 1.0), vec3(1.0, 0.8, 0.4), smoothstep(0.36, 0.39, dist));
    gl_FragColor = vec4(col, alpha);
  }
`;

// ═══════════════════════════════════════
// 场景组件
// ═══════════════════════════════════════

function BlackHoleScene() {
  const { gl, scene, camera, size } = useThree();
  const discRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const compositeRef = useRef<THREE.Mesh>(null);
  const discGroupRef = useRef<THREE.Group>(null);
  const distortionGroupRef = useRef<THREE.Group>(null);

  // 纹理
  const gradientTex = useMemo(() => createGradientTexture(), []);
  const noiseTex = useMemo(() => createNoiseTexture(), []);

  // 渲染目标
  const sceneRT = useMemo(() => {
    return new THREE.WebGLRenderTarget(size.width * Math.min(gl.getPixelRatio(), 2), size.height * Math.min(gl.getPixelRatio(), 2), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
  }, [gl]);

  // 相机
  const compCamera = useMemo(() => {
    return new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  }, []);

  // 星场数据
  const starsData = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 200 + Math.random() * 200;
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * r;
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r;
      sizes[i] = 0.3 + Math.random() * 8;
      const hue = Math.random() * 360;
      const lightness = 75 + Math.random() * 25;
      const col = new THREE.Color(`hsl(${hue}, 100%, ${lightness}%)`);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, sizes, colors };
  }, []);

  // 更新渲染目标尺寸
  useEffect(() => {
    const dpr = Math.min(gl.getPixelRatio(), 2);
    sceneRT.setSize(size.width * dpr, size.height * dpr);
  }, [size, gl, sceneRT]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 缓慢旋转吸积盘
    if (discGroupRef.current) {
      discGroupRef.current.rotation.z += delta * 0.05;
    }

    // 缓慢旋转星空
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
      starsRef.current.rotation.x += delta * 0.003;
      const mat = starsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
    }

    // 脉动光环
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
    }

    // 更新吸积盘着色器
    if (discRef.current) {
      const mat = discRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
    }

    // ── 多通道渲染 ──
    // 1. 渲染场景到纹理
    gl.setRenderTarget(sceneRT);
    gl.setClearColor('#000011');
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // 2. 后处理合成
    if (compositeRef.current) {
      const mat = compositeRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = time;
      mat.uniforms.uScene.value = sceneRT.texture;
    }
  });

  return (
    <>
      {/* 主场景 */}
      <ambientLight intensity={0.01} />

      {/* 星场 */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starsData.positions.length / 3}
            array={starsData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starsData.sizes.length}
            array={starsData.sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starsData.colors.length / 3}
            array={starsData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={starsVertexShader}
          fragmentShader={starsFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 吸积盘组 */}
      <group ref={discGroupRef} rotation={[Math.PI * 0.48, 0, 0]}>
        {/* 吸积盘 - 圆柱体（内→外） */}
        <mesh ref={discRef}>
          <cylinderGeometry args={[0.55, 2.5, 0.01, 128, 8, true]} />
          <shaderMaterial
            vertexShader={discVertexShader}
            fragmentShader={discFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uGradient: { value: gradientTex },
              uNoise: { value: noiseTex },
            }}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* 内圈吸积盘（更热更亮） */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.58, 0.01, 96, 8, true]} />
          <shaderMaterial
            vertexShader={discVertexShader}
            fragmentShader={discFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uGradient: { value: gradientTex },
              uNoise: { value: noiseTex },
            }}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 光子环 */}
      <mesh ref={ringRef}>
        <planeGeometry args={[1.8, 1.8]} />
        <shaderMaterial
          vertexShader={glowRingVertexShader}
          fragmentShader={glowRingFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 视界（纯黑球） */}
      <mesh>
        <sphereGeometry args={[0.28, 64, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* ─── 后处理平面 ─── */}
      <mesh ref={compositeRef} position={[0, 0, 0.5]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={compositeVertexShader}
          fragmentShader={compositeFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uScene: { value: sceneRT.texture },
          }}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  );
}

// ═══════════════════════════════════════
// 外层组件
// ═══════════════════════════════════════

export default function BlackHole() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
      >
        <div className="w-[60%] aspect-square rounded-full bg-black shadow-[0_0_80px_rgba(140,100,40,0.2),0_0_160px_rgba(80,40,10,0.1)]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0.8, 4.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <BlackHoleScene />
      </Canvas>
    </div>
  );
}
