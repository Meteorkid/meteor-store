'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/motion';

// ═══════════════════════════════════════
// EHT 风格黑洞着色器（透明背景）
// ═══════════════════════════════════════

const ringVertShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragShader = /* glsl */ `
  varying vec3 vPos;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i.xy + vec2(0,0) + i.z * 17.0), hash(i.xy + vec2(1,0) + i.z * 17.0), f.x),
          mix(hash(i.xy + vec2(0,1) + i.z * 17.0), hash(i.xy + vec2(1,1) + i.z * 17.0), f.x), f.y),
      mix(mix(hash(i.xy + vec2(0,0) + (i.z+1.0) * 17.0), hash(i.xy + vec2(1,0) + (i.z+1.0) * 17.0), f.x),
          mix(hash(i.xy + vec2(0,1) + (i.z+1.0) * 17.0), hash(i.xy + vec2(1,1) + (i.z+1.0) * 17.0), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise3D(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float dist = length(vPos.xy);
    float angle = atan(vPos.y, vPos.x);

    // ── 环参数 ──
    float R = 0.32;
    float W = 0.022;

    // ── 湍流微小位移 ──
    float turb = fbm(vec3(vPos.xy * 6.0, uTime * 0.025)) * 0.008;
    float d = dist + turb - R;

    // ── 环轮廓（锐利内缘，略渐淡外缘） ──
    float profile;
    if (d < -W * 0.5) {
      profile = exp(-d * d / (W * W * 0.3));  // 内缘比较陡
    } else {
      profile = exp(-d * d / (W * W * 1.2));  // 外缘稍柔
    }

    // ── 非对称亮度 ──
    // 最亮在右下 (≈ -45°)
    float asym = angle + 0.785;
    float doppler = 1.0 + 0.75 * sin(asym);
    doppler = clamp(doppler, 0.12, 1.0);

    // ── 方位角热点 ──
    float hotspots = 1.0;
    hotspots += 0.3 * sin(angle * 1.0 + 2.1);
    hotspots += 0.2 * sin(angle * 2.0 + 0.5);
    hotspots += 0.15 * sin(angle * 3.0 + 3.8);
    hotspots += 0.08 * sin(angle * 5.0 + 1.2);
    hotspots = clamp(hotspots, 0.45, 1.0);

    float brightness = profile * doppler * hotspots;

    // ── 颗粒纹理 ──
    float grain = fbm(vec3(vPos.xy * 50.0, uTime * 0.04)) * 0.35;
    float fineGrain = fbm(vec3(vPos.xy * 120.0, uTime * 0.06)) * 0.18;

    // ── EHT 纯金色 ──
    vec3 brightCol = vec3(0.98, 0.75, 0.28);
    vec3 midCol    = vec3(0.95, 0.55, 0.08);
    vec3 darkCol   = vec3(0.72, 0.30, 0.01);

    float t = clamp(brightness, 0.0, 1.0);
    vec3 col;
    if (t > 0.5) col = mix(midCol, brightCol, (t - 0.5) / 0.5);
    else if (t > 0.12) col = mix(darkCol, midCol, (t - 0.12) / 0.38);
    else col = darkCol * (0.4 + t / 0.3);

    col *= 0.75 + grain * 0.5 + fineGrain * 0.3;

    // ── 微弱外晕 ──
    float halo = exp(-abs(d) / (W * 3.5)) * 0.08;
    float midHalo = exp(-abs(d) / (W * 1.8)) * 0.14;

    float alpha = brightness * 1.1 + halo + midHalo;

    // 暗影内部全黑
    if (dist < R - W * 2.0) {
      alpha = 0.0;
      col = vec3(0.0);
    }

    gl_FragColor = vec4(col * (brightness * 2.4 + halo * 0.5 + midHalo * 0.7), alpha);
  }
`;

// ── 轨道亮点粒子 ──
const particlesVertShader = /* glsl */ `
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSize;
  attribute float aSpeed;
  varying float vAlpha;
  varying float vSize;
  varying float vAngle;
  uniform float uTime;
  void main() {
    float ang = aAngle + uTime * aSpeed * 0.25;
    float r = aRadius;
    vec3 pos = vec3(cos(ang) * r, sin(ang) * r, 0.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (160.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float asym = ang + 0.785;
    float dop = 1.0 + 0.75 * sin(asym);
    vAlpha = clamp(dop, 0.12, 1.0);
    vSize = aSize;
    vAngle = ang;
  }
`;

const particlesFragShader = /* glsl */ `
  varying float vAlpha;
  varying float vSize;
  varying float vAngle;
  uniform float uTime;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = exp(-d * d * 40.0);
    float glow = exp(-d * d * 8.0) * 0.15;
    float alpha = (core + glow) * vAlpha;
    alpha *= 0.5 + 0.5 * sin(uTime * 1.5 + vAngle * 3.0);
    vec3 col = mix(vec3(0.98, 0.75, 0.28), vec3(0.99, 0.88, 0.60), core);
    gl_FragColor = vec4(col, alpha * 0.65);
  }
`;

// ── 后处理（仅引力透镜 + bloom） ──
const compVertShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const compFragShader = /* glsl */ `
  uniform sampler2D uScene;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 c = vec2(0.5);
    vec2 toC = uv - c;
    float dist = length(toC);
    vec2 dir = dist > 0.001 ? toC / dist : vec2(0.0, 1.0);

    // 引力透镜
    float lens = 0.0;
    if (dist < 0.38) lens = pow(1.0 - dist / 0.38, 2.0) * 0.15;
    vec2 luv = uv + dir * lens * (1.0 - dist);

    float chroma = lens * 0.005;
    float r = texture2D(uScene, luv + dir * chroma).r;
    float g = texture2D(uScene, luv).g;
    float b = texture2D(uScene, luv - dir * chroma).b;
    vec4 col = vec4(r, g, b, 1.0);

    gl_FragColor = col;
  }
`;

// ═══════════════════════════════════════
// 场景
// ═══════════════════════════════════════

function Scene() {
  const { gl, scene, camera, size } = useThree();
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const compRef = useRef<THREE.Mesh>(null);

  const sceneRT = useMemo(() => new THREE.WebGLRenderTarget(
    size.width * Math.min(gl.getPixelRatio(), 2),
    size.height * Math.min(gl.getPixelRatio(), 2),
    { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
  ), [gl, size]);

  const pData = useMemo(() => {
    const n = 350;
    const ang = new Float32Array(n), rad = new Float32Array(n), sz = new Float32Array(n), sp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 0.28 + Math.random() * 0.1;
      sz[i] = 0.6 + Math.random() * 3.0;
      sp[i] = 0.2 + Math.random() * 1.6;
    }
    return { ang, rad, sz, sp };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) (ringRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    if (particlesRef.current) (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

    gl.setRenderTarget(sceneRT);
    gl.setClearColor(0, 0, 0, 0);  // 透明
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (compRef.current) {
      (compRef.current.material as THREE.ShaderMaterial).uniforms.uScene.value = sceneRT.texture;
    }
  });

  return (
    <>
      <mesh ref={ringRef}>
        <planeGeometry args={[1.5, 1.5]} />
        <shaderMaterial
          vertexShader={ringVertShader} fragmentShader={ringFragShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-aAngle" count={pData.ang.length} array={pData.ang} itemSize={1} />
          <bufferAttribute attach="attributes-aRadius" count={pData.rad.length} array={pData.rad} itemSize={1} />
          <bufferAttribute attach="attributes-aSize" count={pData.sz.length} array={pData.sz} itemSize={1} />
          <bufferAttribute attach="attributes-aSpeed" count={pData.sp.length} array={pData.sp} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={particlesVertShader} fragmentShader={particlesFragShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh>
        <circleGeometry args={[0.26, 64]} />
        <meshBasicMaterial color="#000000" depthWrite={false} />
      </mesh>
      <mesh ref={compRef} position={[0, 0, 0.5]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={compVertShader} fragmentShader={compFragShader}
          uniforms={{ uScene: { value: sceneRT.texture } }}
          depthWrite={false} depthTest={false}
        />
      </mesh>
    </>
  );
}

export default function BlackHole() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return (
      <div className="w-full aspect-square flex items-center justify-center">
        <div className="relative w-[60%] aspect-square">
          <div className="absolute inset-[14%] rounded-full bg-black shadow-[0_0_80px_rgba(200,140,30,0.18)]" />
          <div className="absolute inset-[16%] rounded-full border-[3px] border-amber-400/50 shadow-[0_0_40px_rgba(220,160,40,0.35)]" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full aspect-square">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.05, 4.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
