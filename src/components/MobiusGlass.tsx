'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import { ParametricGeometry } from 'three-stdlib';

/**
 * 真 3D 玻璃莫比乌斯环：透射材质（折射/色散/环境反射）呼应全站液态玻璃主题。
 * 环境反射用 Lightformer 本地生成，零外部资源请求（CSP 友好）。
 * 仅在桌面端 + 支持 WebGL + 未开启减少动画时由 Hero3D 挂载。
 */

// 莫比乌斯带参数方程（与 AsciiMobius 同一数学，保持两个渲染层的"同源"叙事）
const R = 1.0;
const W = 0.38;
function mobiusPoint(u01: number, v01: number, target: THREE.Vector3) {
  const u = u01 * Math.PI * 2;
  const v = (v01 - 0.5) * 2; // -1 ~ 1
  const w = v * W;
  const ch = Math.cos(u / 2);
  const sh = Math.sin(u / 2);
  target.set(
    (R + w * ch) * Math.cos(u),
    (R + w * ch) * Math.sin(u),
    w * sh,
  );
}

function MobiusMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const geo = new ParametricGeometry(mobiusPoint, 240, 24);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    // 恒定自转 + 鼠标视差（缓动跟随，与 ASCII 版手感一致）
    g.rotation.y += delta * 0.22;
    const targetX = 0.5 + state.pointer.y * 0.35;
    const targetZ = state.pointer.x * 0.25;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.z += (targetZ - g.rotation.z) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial
          side={THREE.DoubleSide}
          samples={6}
          resolution={512}
          transmission={1}
          roughness={0.12}
          thickness={0.42}
          ior={1.42}
          chromaticAberration={0.35}
          anisotropicBlur={0.2}
          distortion={0.12}
          distortionScale={0.4}
          temporalDistortion={0.08}
          color="#cbb8ff"
          attenuationColor="#8b5cf6"
          attenuationDistance={1.6}
        />
      </mesh>
    </group>
  );
}

export default function MobiusGlass({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.1], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} />
        <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.55}>
          <MobiusMesh />
        </Float>
        {/* 本地程序化环境光：紫粉双色 + 白色 key light，不请求任何外部 HDR */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={5.5} color="#a78bfa" position={[0, 3, 2]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={4} color="#f472b6" position={[3, -1.5, 2]} scale={[3, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[-3, 1, 3]} scale={[2, 2, 1]} />
          <Lightformer form="circle" intensity={2} color="#7c3aed" position={[0, -3, 1]} scale={[3, 3, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
