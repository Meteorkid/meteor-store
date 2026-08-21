'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/motion';

// ═══════════════════════════════════════
// EHT 风格黑洞（透明画布，单次绘制）
//
// 整幅图在一个铺满画布的裁剪空间四边形里解析生成：视界阴影 + 光子环 +
// 吸积盘 + 外冕。**不要再引入离屏 RenderTarget 做后处理**：历史实现把
// 合成 pass 的片元写成 `vec4(rgb, 1.0)` 且材质没标 transparent，
// 于是整块 500×500 画布变成不透明黑方块，在站点星空背景上切出一个硬边矩形；
// 同时它把「包含合成面片自身的 scene」渲进 RenderTarget 再采样自己，
// 构成逐帧反馈回路。两个问题都随后处理一起删掉。
//
// 透明合成靠 premultiplied alpha：片元输出 rgb 已乘过强度，
// alpha 只由「会遮挡星空的实体」（视界阴影 + 光学厚的环体）贡献，
// 外冕 alpha 留 0 走纯加法，星星能透出来。
// 所有发光项必须在 dist = 1.0（画布边缘）之前归零，否则又会出现方框接缝。
// ═══════════════════════════════════════

const quadVertShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const holeFragShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  // 以画布半高为 1.0 的归一化空间
  const float R = 0.50;               // 环半径
  const float W = 0.034;              // 环厚度（与 R 同比例，改 R 要一起改）
  const float SHADOW_R = R - W * 2.2; // 视界阴影半径

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
    for (int i = 0; i < 4; i++) {
      v += a * noise3D(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= uAspect;

    float dist = length(p);
    float angle = atan(p.y, p.x);
    float dRing = dist - R;

    // ── 多普勒非对称：最亮在右下 (≈ -45°) ──
    float doppler = clamp(1.0 + 0.75 * sin(angle + 0.785), 0.12, 1.0);

    // ── 视界阴影：软边圆盘，遮住背后的星空 ──
    float shadowA = smoothstep(SHADOW_R, SHADOW_R - 0.05, dist);
    float outside = 1.0 - shadowA;

    vec3 emissive = vec3(0.0);

    // ── 贴环的暖晕：只紧贴环，宽度放大就会把环的颗粒感糊掉 ──
    // 在分支外算，否则会在下面那个环带的边界上留一圈亮度断层
    float warm = dRing >= 0.0 ? exp(-dRing / (W * 3.0)) : exp(dRing / (W * 1.4));
    emissive += vec3(0.96, 0.56, 0.20) * warm * 0.16 * doppler * outside;

    // ── 外冕：站点品牌紫，把黑洞和背景缝在一起 ──
    // 衰减按「到画布边缘的归一化距离」而不是指数：指数在环外掉得太快，
    // 读起来是一圈脏边而不是一团光。这条曲线到 dist = 1.0 自然归零，边缘因此没有接缝
    float fall = 1.0 - smoothstep(0.0, 1.0, clamp((dist - R) / (1.0 - R), 0.0, 1.0));
    float corona = dRing >= 0.0 ? pow(fall, 2.0) : exp(dRing / 0.020);
    // 门控让外冕等暖晕衰减完再起，向内则收得很急：
    // 紫渗进金色环内侧、或两者在低亮度下叠加，都会混成脏棕灰
    corona *= smoothstep(0.01, 0.16, dRing) * outside;
    // 取靛蓝一端而不是品红：冷外冕 / 热吸积盘的冷暖对比更干净
    vec3 coronaCol = mix(vec3(0.34, 0.24, 1.00), vec3(0.62, 0.32, 0.98),
                         smoothstep(0.0, 1.2, doppler));
    emissive += coronaCol * corona * (0.13 + 0.22 * doppler);

    float alpha = shadowA * 0.97;

    // ── 环体：只在环附近算，避免整块画布跑 fbm ──
    // 带宽 0.20 处环轮廓已衰减到 0，边界无断层
    if (abs(dRing) < 0.20) {
      float turb = fbm(vec3(p * 6.0, uTime * 0.025)) * 0.010;
      float d = dist + turb - R;

      // 内缘陡、外缘柔
      float profile = d < -W * 0.5
        ? exp(-d * d / (W * W * 0.30))
        : exp(-d * d / (W * W * 1.20));

      // 方位角热点
      float hotspots = 1.0
        + 0.30 * sin(angle + 2.1)
        + 0.20 * sin(angle * 2.0 + 0.5)
        + 0.15 * sin(angle * 3.0 + 3.8)
        + 0.08 * sin(angle * 5.0 + 1.2);
      hotspots = clamp(hotspots, 0.45, 1.0);

      float brightness = profile * doppler * hotspots;

      float grain = fbm(vec3(p * 40.0, uTime * 0.04)) * 0.35;
      float fine  = fbm(vec3(p * 95.0, uTime * 0.06)) * 0.18;

      vec3 brightCol = vec3(0.99, 0.82, 0.46);
      vec3 midCol    = vec3(0.97, 0.58, 0.13);
      vec3 darkCol   = vec3(0.66, 0.26, 0.04);

      float t = clamp(brightness, 0.0, 1.0);
      vec3 col;
      if (t > 0.5) col = mix(midCol, brightCol, (t - 0.5) / 0.5);
      else if (t > 0.12) col = mix(darkCol, midCol, (t - 0.12) / 0.38);
      else col = darkCol * (0.4 + t / 0.3);

      col *= 0.75 + grain * 0.5 + fine * 0.3;

      emissive += col * brightness * 2.8;

      // 环是光学厚的等离子体，会挡住背后的星空
      alpha = max(alpha, clamp(brightness * 1.5, 0.0, 1.0));
    }

    gl_FragColor = vec4(emissive, clamp(alpha, 0.0, 1.0));
  }
`;

// ── 轨道亮点粒子（同样在裁剪空间里定位，与主图共用一套坐标） ──
const particlesVertShader = /* glsl */ `
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSize;
  attribute float aSpeed;
  varying float vAlpha;
  varying float vAngle;
  uniform float uTime;
  uniform float uAspect;
  uniform float uPixelRatio;
  void main() {
    float ang = aAngle + uTime * aSpeed * 0.22;
    vec2 pos = vec2(cos(ang), sin(ang)) * aRadius;
    pos.x /= uAspect;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = aSize * 5.0 * uPixelRatio;
    vAlpha = clamp(1.0 + 0.75 * sin(ang + 0.785), 0.12, 1.0);
    vAngle = ang;
  }
`;

const particlesFragShader = /* glsl */ `
  varying float vAlpha;
  varying float vAngle;
  uniform float uTime;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // 点精灵是方的：不裁成圆并在边界淡到 0，几百个加法叠加后会露出一格格方块
    if (d > 0.5) discard;
    float core = exp(-d * d * 46.0);
    float glow = exp(-d * d * 11.0) * 0.12;
    float i = (core + glow) * vAlpha * smoothstep(0.5, 0.30, d);
    i *= max(0.0, 0.45 + 0.55 * sin(uTime * 1.5 + vAngle * 3.0));
    vec3 col = mix(vec3(0.99, 0.78, 0.34), vec3(0.99, 0.92, 0.72), core);
    // alpha 留 0 走纯加法，星空从亮点之间透出来
    gl_FragColor = vec4(col * i * 0.55, 0.0);
  }
`;

function Scene() {
  const { gl, size } = useThree();
  const holeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const aspect = size.height > 0 ? size.width / size.height : 1;

  // 随机粒子数据用 useState 惰性初始化生成一次：渲染期间调用 Math.random
  // 会被 React Compiler 判为不纯（React Compiler 规则），惰性初始化只跑一次且合规
  const [pData] = useState(() => {
    const n = 180;
    const ang = new Float32Array(n), rad = new Float32Array(n), sz = new Float32Array(n), sp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 0.47 + Math.random() * 0.11;
      sz[i] = 0.5 + Math.random() * 2.2;
      sp[i] = 0.2 + Math.random() * 1.6;
    }
    // 顶点着色器完全用上面几条自定义属性定位，但 position 这条必须存在：
    // three 用 attributes.position.count 推绘制数量，缺了它 drawCount 是 Infinity，
    // WebGLRenderer 直接 return——不报错，只是一个粒子都不画（旧实现就是这样静默失效的）
    return { ang, rad, sz, sp, pos: new Float32Array(n * 3) };
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dpr = gl.getPixelRatio();
    if (holeRef.current) {
      const u = (holeRef.current.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = t;
      u.uAspect.value = aspect;
    }
    if (particlesRef.current) {
      const u = (particlesRef.current.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = t;
      u.uAspect.value = aspect;
      u.uPixelRatio.value = dpr;
    }
  });

  return (
    <>
      <mesh ref={holeRef}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={quadVertShader}
          fragmentShader={holeFragShader}
          uniforms={{ uTime: { value: 0 }, uAspect: { value: 1 } }}
          transparent
          premultipliedAlpha
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <points ref={particlesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pData.pos, 3]} />
          <bufferAttribute attach="attributes-aAngle" args={[pData.ang, 1]} />
          <bufferAttribute attach="attributes-aRadius" args={[pData.rad, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[pData.sz, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[pData.sp, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={particlesVertShader}
          fragmentShader={particlesFragShader}
          uniforms={{ uTime: { value: 0 }, uAspect: { value: 1 }, uPixelRatio: { value: 1 } }}
          transparent
          premultipliedAlpha
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </points>
    </>
  );
}

export default function BlackHole() {
  const reducedMotion = useReducedMotion();

  // 静态兜底同样不能出现方框：渐变必须写 closest-side。
  // 默认的 farthest-corner 会把 100% 算到对角线上（正方形里是半宽的 1.41 倍），
  // 于是渐变在容器边缘还没淡完就被裁掉，露出和旧 WebGL 版一样的硬边方块
  if (reducedMotion) {
    return (
      <div className="w-full aspect-square relative">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(circle closest-side at 50% 50%, rgba(120,70,250,0) 42%, rgba(120,70,250,0.22) 52%, rgba(150,70,235,0.12) 68%, rgba(150,70,235,0) 92%)',
              // 右下更亮，对应动画版的多普勒非对称
              'radial-gradient(circle closest-side at 62% 64%, rgba(240,150,40,0.16) 0%, rgba(240,150,40,0) 46%)',
            ].join(', '),
          }}
        />
        <div className="absolute inset-[25%] rounded-full border-2 border-amber-400/75 shadow-[0_0_30px_rgba(240,150,40,0.5)]" />
        <div className="absolute inset-[27%] rounded-full bg-black" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
