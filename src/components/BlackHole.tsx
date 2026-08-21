'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/motion';

// ═══════════════════════════════════════
// 史瓦西黑洞：逐像素积分零测地线，光线是真的被弯的
//
// 旧实现是一幅二维画：阴影、环、光晕全按屏幕半径 dist 算出来，所以它只会
// **遮住**背后的东西，不会**弯曲**任何东西——看着像一个发光甜甜圈中间抠了个洞。
// 现在每个像素发一条光线，按史瓦西度规下的零测地线方程积分：
//
//   d²r⃗/dλ² = -3/2 · h² · r⃗ / |r⃗|⁵     （h = |r⃗ × v⃗| 是守恒角动量，单位取 rs = 1）
//
// 空间扭曲因此是积分出来的，不是画出来的：吸积盘背面的光被拗到黑洞上方与下方，
// 形成横跨阴影的拱形；掠过光子球的光线绕行多圈、反复穿过盘面，自动聚成一圈
// 极亮的光子环。两者都没有任何一行代码专门去画。
//
// 背景星空同样被弯，但用的是**着色器里自己生成的**星场（starField），按光线出射
// 方向采样即可，零成本。页面那层真星空（GlobalParticles / MeteorShower 两个 fixed
// 的 2D canvas）弯不了：要每帧把它们上传成纹理，还得跟着滚动、DPR 补偏移，
// 代价高且把黑洞和那两个组件永久耦合。我们这层只在强透镜区出现，随后交回真星空。
//
// 透明合成仍走 premultiplied alpha：alpha 只由会遮挡星空的实体贡献
// （落入视界的像素、光学厚的盘面），外冕留 0 走纯加法。
// 所有输出必须在 scr = 1.0（画布边缘）之前归零，否则又会切出方框接缝。
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

  // 单位取史瓦西半径 rs = 1
  const float CAM_R = 11.0;   // 相机到黑洞的距离
  const float TILT  = 0.150;  // 相机抬高角（弧度）：几乎贴着赤道面看，拱形才明显
  const float FOV   = 0.60;   // 越小黑洞越大
  // 内缘取到 2.2：史瓦西的 ISCO 在 3rs，但高自旋 Kerr 可以低到 1.24rs。
  // 放在 2.6 时盘的内缘投影离阴影太远，中间空出一大圈死黑，整体读起来像日食而不是吸积盘
  const float D_IN  = 2.2;
  const float D_OUT = 6.5;    // 外缘：再大投影就会超出画布，边缘留下硬切
  const int   STEPS = 140;

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

  // ── 程序化星场：用光线的**出射方向**采样 ──
  // 方向已经被引力拗过了，所以直接照方向采出来的就是爱因斯坦环和被拉长的弧，
  // 不需要额外写一行「画环」的代码。星星是我们自己生成的，不是页面那层真星空——
  // 弯页面那层要把两个 fixed 的 2D canvas 每帧上传成纹理，还要跟着滚动补偏移，
  // 代价和耦合都不值当（见本文件顶部说明）
  float hash13(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // 单档星点：每个网格胞元里至多一颗，按到抖动后星心的距离定亮度
  vec3 starCell(vec3 dir, float density, float thresh, float sharp) {
    vec3 p = dir * density;
    vec3 c = floor(p);
    float h = hash13(c);
    if (h < thresh) return vec3(0.0);
    vec3 f = p - c - 0.5;
    // 抖动压在半个胞元内，否则星点会被网格边界切掉
    vec3 j = (vec3(hash13(c + 11.0), hash13(c + 23.0), hash13(c + 37.0)) - 0.5) * 0.7;
    float d = length(f - j);
    float inten = pow(max(0.0, 1.0 - d * 2.2), sharp);
    // 少量星点偏站点紫，其余接近白，和页面自己的星空同一调子
    vec3 col = mix(vec3(0.86, 0.89, 1.00), vec3(0.72, 0.55, 1.00),
                   step(0.62, hash13(c + 53.0)));
    return col * inten * (0.55 + 0.45 * hash13(c + 71.0));
  }

  vec3 starField(vec3 dir) {
    return starCell(dir, 26.0, 0.855, 6.0)
         + starCell(dir, 60.0, 0.900, 5.0) * 0.6;
  }

  // 史瓦西零测地线的加速度项
  vec3 gravAcc(vec3 r, float h2) {
    float r2 = dot(r, r);
    return -1.5 * h2 * r / (r2 * r2 * sqrt(r2));
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= uAspect;
    float scr = length(p);

    // ── 相机 ──
    vec3 camPos = vec3(0.0, sin(TILT), -cos(TILT)) * CAM_R;
    vec3 fwd = normalize(-camPos);
    vec3 rgt = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 upv = cross(fwd, rgt);
    vec3 dir = normalize(fwd + (p.x * rgt + p.y * upv) * FOV);

    vec3 pos = camPos;
    vec3 vel = dir;
    vec3 hv = cross(pos, vel);
    float h2 = dot(hv, hv);   // 沿测地线守恒，只算一次

    // 视界阴影用解析判据，不靠积分收敛：|v| = 1 时 h 就是冲击参数 b，
    // 史瓦西度规下入射光子被俘获当且仅当 b < 3√3/2 · rs。
    // 靠积分判的话，掠过光子球的光线要绕好几圈才分得出胜负，每圈需要约 200 步，
    // 步数一定先耗尽——于是阴影边界由步数预算而不是物理决定，会是一圈多边形折线
    float b = sqrt(h2);
    bool captured = b < 2.5981 && dot(pos, vel) < 0.0;

    vec3 disk = vec3(0.0);
    float trans = 1.0;   // 剩余透过率，前向合成用
    bool escaped = false;
    vec3 escDir = vec3(0.0);

    for (int i = 0; i < STEPS; i++) {
      float r = length(pos);
      if (r < 1.0) break;                                     // 落入视界，后面没有光了
      // 光子球在 r = 1.5，越过 D_OUT 还在向外跑的光线不可能再被拗回来撞上盘
      if (r > D_OUT + 0.5 && dot(pos, vel) > 0.0) { escaped = true; escDir = normalize(vel); break; }

      // 步长随半径自适应：近处要细，远处可以大步跨，省一半迭代
      float dt = clamp(0.045 * r, 0.020, 0.35);
      vec3 a = gravAcc(pos, h2);
      vec3 np = pos + vel * dt + 0.5 * a * dt * dt;
      vec3 nv = vel + a * dt;

      // 穿过赤道面 → 命中吸积盘
      if (pos.y * np.y < 0.0) {
        float f = pos.y / (pos.y - np.y);
        vec3 hit = mix(pos, np, f);
        float hr = length(hit);
        if (hr > D_IN && hr < D_OUT) {
          float tRad = (hr - D_IN) / (D_OUT - D_IN);

          // 内侧亮，外侧快速暗下去（外缘必须自然熄灭，不能靠裁剪）
          float radial = pow(1.0 - tRad, 2.0);
          radial += 0.6 * exp(-pow((hr - D_IN) / 0.6, 2.0));   // 内缘再加一道亮边

          // 开普勒较差自转：内圈转得快，盘面纹理跟着一起转
          float sp = uTime * 1.7 / pow(hr, 1.5);
          float ca = cos(sp), sa = sin(sp);
          vec2 q = vec2(hit.x * ca - hit.z * sa, hit.x * sa + hit.z * ca);

          float turb = fbm(vec3(q * 0.5, uTime * 0.03));
          float fine = fbm(vec3(q * 1.9, uTime * 0.05));
          float dens = radial * (0.5 + 0.8 * turb + 0.35 * fine);

          // 多普勒 beaming：朝向我们转的一侧更亮，这是黑洞图左右不对称的来源
          // 下限不能压得太狠：拗到黑洞上方的那段盘面正好处在背离观者的一侧，
          // 压到 0.1 就成了一块「不透明但几乎不发光」的黑色穹顶
          vec3 orbit = normalize(cross(vec3(0.0, 1.0, 0.0), hit));
          float beta = dot(orbit, normalize(vel)) * (1.1 / sqrt(hr));
          float dop = clamp(1.0 + 1.5 * beta, 0.24, 2.4);

          float bright = dens * dop;

          // 温度色：内热外冷
          vec3 col = mix(vec3(1.00, 0.94, 0.80), vec3(0.99, 0.66, 0.20),
                         smoothstep(0.0, 0.34, tRad));
          col = mix(col, vec3(0.74, 0.27, 0.05), smoothstep(0.30, 1.0, tRad));

          // 前向 alpha 合成：先命中的先遮挡，透过率随之衰减。
          // 遮挡只取决于**密度**，不能带上多普勒——beaming 改变的是亮度不是厚度。
          // 早先 alpha 走 max(bright) 而光走 exp(-hits) 衰减，两者脱钩：
          // 背向观者那一侧的盘面「不透明但几乎不发光」，于是在星空上切出一个
          // 硬边的黑色穹顶（正是之前那个多边形轮廓的来源）
          float od = clamp(dens * 1.2, 0.0, 0.90);
          disk += col * bright * 0.95 * trans;
          trans *= 1.0 - od;
        }
      }

      pos = np;
      vel = nv;
    }

    // ── 被透镜弯过的背景星空 ──
    // 权重取「这条光线到底被弯了多少」，而不是屏幕半径：
    // bend = 0 表示光线基本没被弯，那里页面自己那层真星空就是对的，我们一颗都不加
    // （否则就是在真星空上又铺一层，密度平白翻倍）；
    // 越靠近光子环弯得越狠，星像被压缩成弧，权重也随之拉满 —— 爱因斯坦环就是这么出来的。
    // 乘 trans 让盘面挡住它背后的星；步数耗尽而没逃逸的光线不给星光
    if (escaped && !captured) {
      float bend = 1.0 - dot(escDir, dir);              // 0（没弯）→ 2（掉头）
      float lensWeight = smoothstep(0.02, 0.35, bend);
      disk += starField(escDir) * lensWeight * trans * 2.3;
    }

    // 落入视界的像素本身就是全遮挡；盘面则按累计不透明度
    float alpha = max(captured ? 1.0 : 0.0, 1.0 - trans);

    // 色调映射：光子环附近一条光线会反复穿过盘面，不压一下会直接烧成纯白，
    // 盘面的湍流纹理全部丢失
    disk = disk / (1.0 + disk * 0.55);
    vec3 emissive = disk;

    // ── 外冕：站点品牌紫，把黑洞缝进页面背景 ──
    // 纯加法（不进 alpha），星空从里面透出来
    // 起点必须推到阴影边缘（scr = 2.598 / (FOV·CAM_R) ≈ 0.39）和光子环之外：贴着阴影起的话，
    // 视界边上会箍一圈饱和的藏青，读起来是道硬边而不是光晕
    float fall = 1.0 - smoothstep(0.0, 1.0, clamp((scr - 0.50) / 0.50, 0.0, 1.0));
    float corona = pow(fall, 1.8) * smoothstep(0.50, 0.76, scr);
    // 只在视界内扣掉外冕（那里必须纯黑）。不能按 alpha 扣：
    // 盘面一挡就把外冕也挖掉，暗侧盘面会在紫色光晕上抠出一块硬边黑影
    emissive += vec3(0.42, 0.28, 0.98) * corona * 0.16 * (captured ? 0.0 : 1.0);

    // ── 边缘保险：保证 scr ≥ 1.0 时严格为 0 ──
    // 起点压到 0.84 之后才收：盘外缘投影在 scr ≈ 0.99，收太早会把还看得见的盘面一起削掉
    float guard = smoothstep(1.0, 0.84, scr);
    emissive *= guard;
    alpha *= guard;

    gl_FragColor = vec4(emissive, clamp(alpha, 0.0, 1.0));
  }
`;

function Scene() {
  const { size } = useThree();
  const holeRef = useRef<THREE.Mesh>(null);
  const aspect = size.height > 0 ? size.width / size.height : 1;

  useFrame((state) => {
    if (!holeRef.current) return;
    const u = (holeRef.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = aspect;
  });

  return (
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
  );
}

export default function BlackHole() {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // 逐像素积分测地线不便宜，而黑洞在首页最底部。不停帧的话，用户在页面任何位置
  // 都在给它烧 GPU。离开视口就把帧循环停掉（frameloop="never"）
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 静态兜底不能出现方框：渐变必须写 closest-side。
  // 默认的 farthest-corner 会把 100% 算到对角线上（正方形里是半宽的 1.41 倍），
  // 于是渐变在容器边缘还没淡完就被裁掉，露出硬边方块
  if (reducedMotion) {
    return (
      <div className="w-full aspect-square relative">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(circle closest-side at 50% 50%, rgba(120,70,250,0) 42%, rgba(120,70,250,0.22) 52%, rgba(150,70,235,0.12) 68%, rgba(150,70,235,0) 92%)',
              // 左侧更亮，对应动画版朝向观者转的那一侧
              'radial-gradient(circle closest-side at 34% 52%, rgba(240,150,40,0.16) 0%, rgba(240,150,40,0) 46%)',
            ].join(', '),
          }}
        />
        <div className="absolute inset-[25%] rounded-full border-2 border-amber-400/75 shadow-[0_0_30px_rgba(240,150,40,0.5)]" />
        <div className="absolute inset-[27%] rounded-full bg-black" />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="w-full aspect-square">
      <Canvas
        // dpr 压到 1.5：每个像素要跑 72 步积分，2 倍 dpr 等于多算 78% 的量
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
