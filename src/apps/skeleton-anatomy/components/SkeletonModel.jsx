// @ts-nocheck
/* eslint-disable */
import { useMemo, useRef, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { getBonePositions } from '../utils/bonePositions'
import { boneLookup } from '../utils/boneColorMap'

const bonePositions = getBonePositions()

// 手指骨骼段定义 — 每段有独立的 X/Y/Z（与 bonePositions.js 对应）
// findFingerBone 用 3D 距离做综合判断
const fingerSegments = {
  thumb:  { pp: { x: 1.637, y: 2.174, z: 0.229 }, dp: { x: 1.655, y: 2.047, z: 0.225 } },
  index:  { pp: { x: 1.546, y: 2.017, z: 0.137 }, mp: { x: 1.570, y: 1.870, z: 0.156 }, dp: { x: 1.586, y: 1.782, z: 0.206 } },
  middle: { pp: { x: 1.434, y: 2.011, z: 0.136 }, mp: { x: 1.436, y: 1.839, z: 0.164 }, dp: { x: 1.446, y: 1.736, z: 0.228 } },
  ring:   { pp: { x: 1.340, y: 2.047, z: 0.148 }, mp: { x: 1.337, y: 1.891, z: 0.187 }, dp: { x: 1.351, y: 1.797, z: 0.261 } },
  pinky:  { pp: { x: 1.240, y: 2.123, z: 0.164 }, mp: { x: 1.213, y: 2.008, z: 0.186 }, dp: { x: 1.204, y: 1.928, z: 0.233 } },
}

// 手指骨骼 3D 距离计算（Z 权重 0.15，XY 主导）
function fingerDist(point, seg, sign, zWeight = 0.15) {
  const dx = point.x - seg.x * sign
  const dy = point.y - seg.y
  const dz = (point.z - seg.z) * zWeight
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// 根据世界坐标命中点查找手指骨骼（3D 综合距离算法）
// 对每个手指的每个段计算 (dx, dy, dz) 综合距离，取全局最优
// knownFinger: 通过 faceIndex 预判的手指，在距离接近时作为 tiebreaker
function findFingerBone(worldPoint, knownFinger = null) {
  const hand = worldPoint.x > 0 ? 'l' : 'r'
  const sign = hand === 'l' ? 1 : -1
  const absX = Math.abs(worldPoint.x)

  if (absX < 1.18 || absX > 1.68) return null
  if (worldPoint.y < 1.70 || worldPoint.y > 2.25) return null

  // 对每个手指的每个段计算 3D 距离，Z 权重 0.15（XY 主导，Z 仅作微调）
  const Z_WEIGHT = 0.15
  let bestFinger = null
  let bestSeg = null
  let bestDist = Infinity
  let secondFinger = null
  let secondDist = Infinity

  for (const [finger, segments] of Object.entries(fingerSegments)) {
    let fingerBestDist = Infinity
    let fingerBestSeg = null
    for (const [seg, pos] of Object.entries(segments)) {
      const dist = fingerDist(worldPoint, pos, sign, Z_WEIGHT)
      if (dist < fingerBestDist) { fingerBestDist = dist; fingerBestSeg = seg }
    }
    if (fingerBestDist < bestDist) {
      secondDist = bestDist; secondFinger = bestFinger
      bestDist = fingerBestDist; bestFinger = finger; bestSeg = fingerBestSeg
    } else if (fingerBestDist < secondDist) {
      secondDist = fingerBestDist; secondFinger = finger
    }
  }

  // 同 blob 手指：face map 不可靠，用 X/Y 阈值区分
  const isSameBlob = (bestFinger === 'index' || bestFinger === 'middle') ||
                     (bestFinger === 'ring' || bestFinger === 'pinky')
  if (isSameBlob) {
    bestFinger = disambiguateSameBlob(absX, worldPoint.y, worldPoint.z, bestFinger, secondFinger, bestDist, secondDist)
    // 重新计算 bestSeg
    let bestSegDist = Infinity
    for (const [seg, pos] of Object.entries(fingerSegments[bestFinger])) {
      const dist = fingerDist(worldPoint, pos, sign, Z_WEIGHT)
      if (dist < bestSegDist) { bestSegDist = dist; bestSeg = seg }
    }
  }

  // knownFinger tiebreaker：face map 辅助判断
  if (knownFinger && knownFinger !== bestFinger && fingerSegments[knownFinger]) {
    let knownBestDist = Infinity
    let knownBestSeg = null
    for (const [seg, pos] of Object.entries(fingerSegments[knownFinger])) {
      const dist = fingerDist(worldPoint, pos, sign, Z_WEIGHT)
      if (dist < knownBestDist) { knownBestDist = dist; knownBestSeg = seg }
    }
    // 同 blob 区域：距离极接近时信任 face map（阈值更宽松）
    const threshold = isSameBlob ? 0.06 : 0.04
    if (knownBestDist - bestDist < threshold) {
      bestFinger = knownFinger
      bestSeg = knownBestSeg
    }
  }

  if (!bestFinger || bestDist > 0.12) return null

  const boneId = `${bestSeg}_${bestFinger}_${hand}`
  if (bonePositions[boneId]) return boneId

  // 兜底：该手指内最近骨位（全 3D 距离）
  const suffix = `_${bestFinger}_${hand}`
  const candidates = Object.keys(bonePositions).filter(k => k.endsWith(suffix))
  let best = null, bestDist2 = Infinity
  for (const id of candidates) {
    const p = bonePositions[id].p
    const dx = worldPoint.x - p[0]
    const dy = worldPoint.y - p[1]
    const dz = (worldPoint.z - p[2]) * Z_WEIGHT
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    if (dist < bestDist2) { bestDist2 = dist; best = id }
  }
  return best
}

// 暴露到 window 用于测试
if (typeof window !== 'undefined') window.__findFingerBone = findFingerBone

// 同 blob 手指二次判断：index+middle / ring+pinky 共享 mesh blob
// index vs middle: mesh 表面 Z 差异大（MP 级 0.043），用 hitZ 区分
// ring vs pinky: Z 差异小，仅在 PP 级别用 Y 区分
function disambiguateSameBlob(absX, y, hitZ, bestFinger, secondFinger, bestDist, secondDist) {
  if (bestFinger !== 'index' && bestFinger !== 'middle' && bestFinger !== 'ring' && bestFinger !== 'pinky')
    return bestFinger
  if (!secondFinger) return bestFinger
  if (bestDist > 0.10) return bestFinger
  // 最优距离极小时，距离算法已确定，跳过 Z 阈值覆盖
  if (bestDist < 0.005) return bestFinger
  // index vs middle: PP 用 Y，MP/DP 用 X 阈值（index X=1.46, middle X=1.44）
  if ((bestFinger === 'index' || bestFinger === 'middle') && (secondFinger === 'index' || secondFinger === 'middle')) {
    if (absX > 1.38 && absX < 1.50 && secondDist - bestDist < 0.04) {
      if (y > 1.785) return 'middle'  // PP 级别 Y 足够区分
      return absX > 1.45 ? 'index' : 'middle'
    }
  }

  // ring vs pinky: PP 用 Y，MP/DP 用 X 阈值
  if ((bestFinger === 'ring' || bestFinger === 'pinky') && (secondFinger === 'ring' || secondFinger === 'pinky')) {
    if (absX > 1.28 && absX < 1.42 && secondDist - bestDist < 0.04) {
      if (y > 1.78) return 'ring'  // PP 级别 Y 区分
      // MP: ring X=1.38, pinky X=1.34 → 阈值 1.36
      // DP: ring X=1.42, pinky X=1.40 → 阈值 1.41
      const xThreshold = y > 1.70 ? 1.36 : 1.41
      return absX > xThreshold ? 'ring' : 'pinky'
    }
  }

  // middle vs ring: PP 用 Y，MP/DP 用 X 阈值（middle X=1.44, ring X=1.38/1.42）
  if ((bestFinger === 'middle' || bestFinger === 'ring') && (secondFinger === 'middle' || secondFinger === 'ring')) {
    if (absX > 1.36 && absX < 1.48 && secondDist - bestDist < 0.04) {
      if (y > 1.80) return 'middle'  // PP 级别: middle Y=1.81, ring Y=1.79
      // MP: middle X=1.44, ring X=1.38 → 阈值 1.41
      // DP: middle X=1.44, ring X=1.42 → 阈值 1.43
      const xThreshold = y > 1.69 ? 1.41 : 1.43
      return absX > xThreshold ? 'middle' : 'ring'
    }
  }

  return bestFinger
}

// 构建三角面→手指映射表（在 mesh 加载后调用一次）
// Y 自适应：根据三角面质心的 Y 坐标选择对应段的 X 值做手指匹配
function buildFaceToFingerMap(mesh) {
  const geo = mesh.geometry
  const pos = geo.attributes.position
  const idx = geo.index

  const faceCount = idx ? idx.count / 3 : pos.count / 3
  const map = new Array(faceCount)

  mesh.updateWorldMatrix(true, false)
  const wm = mesh.matrixWorld.clone()

  const v0 = new THREE.Vector3()
  const v1 = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const c = new THREE.Vector3()

  for (let i = 0; i < faceCount; i++) {
    let i0, i1, i2
    if (idx) {
      i0 = idx.getX(i * 3)
      i1 = idx.getX(i * 3 + 1)
      i2 = idx.getX(i * 3 + 2)
    } else {
      i0 = i * 3
      i1 = i * 3 + 1
      i2 = i * 3 + 2
    }

    v0.set(pos.getX(i0), pos.getY(i0), pos.getZ(i0))
    v1.set(pos.getX(i1), pos.getY(i1), pos.getZ(i1))
    v2.set(pos.getX(i2), pos.getY(i2), pos.getZ(i2))

    c.set(
      (v0.x + v1.x + v2.x) / 3,
      (v0.y + v1.y + v2.y) / 3,
      (v0.z + v1.z + v2.z) / 3
    )
    c.applyMatrix4(wm)

    const absX = Math.abs(c.x)
    if (c.y < 1.70 || c.y > 2.25) { map[i] = null; continue }

    // Y 自适应：对每个手指找 Y 最近的段，用该段的 X 做距离比较
    let bestFinger = null
    let bestDist = Infinity
    let secondFinger = null
    let secondDist = Infinity
    for (const [finger, segments] of Object.entries(fingerSegments)) {
      let fingerBestDist = Infinity
      for (const seg of Object.values(segments)) {
        const dx = Math.abs(absX - seg.x)
        const dy = Math.abs(c.y - seg.y)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < fingerBestDist) fingerBestDist = dist
      }
      if (fingerBestDist < bestDist) {
        secondDist = bestDist; secondFinger = bestFinger
        bestDist = fingerBestDist; bestFinger = finger
      } else if (fingerBestDist < secondDist) {
        secondDist = fingerBestDist; secondFinger = finger
      }
    }
    // 同 blob 手指二次判断：index+middle / ring+pinky 共享 mesh blob，距离不可靠
    if (bestDist < 0.10) bestFinger = disambiguateSameBlob(absX, c.y, c.z, bestFinger, secondFinger, bestDist, secondDist)
    map[i] = bestDist < 0.10 ? bestFinger : null
  }

  return map
}

// 构建三角面→骨骼映射表（所有 206 块骨骼，faceIndex 直接查表）
// 使用启发式检测管线对每个三角面质心做骨骼识别，缓存结果
function buildFaceToBoneMap(mesh) {
  const geo = mesh.geometry
  const pos = geo.attributes.position
  const idx = geo.index

  const faceCount = idx ? idx.count / 3 : pos.count / 3
  const map = new Array(faceCount)

  mesh.updateWorldMatrix(true, false)
  const wm = mesh.matrixWorld

  const v0 = new THREE.Vector3()
  const v1 = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const c = new THREE.Vector3()

  for (let i = 0; i < faceCount; i++) {
    let i0, i1, i2
    if (idx) {
      i0 = idx.getX(i * 3)
      i1 = idx.getX(i * 3 + 1)
      i2 = idx.getX(i * 3 + 2)
    } else {
      i0 = i * 3
      i1 = i * 3 + 1
      i2 = i * 3 + 2
    }

    v0.set(pos.getX(i0), pos.getY(i0), pos.getZ(i0))
    v1.set(pos.getX(i1), pos.getY(i1), pos.getZ(i1))
    v2.set(pos.getX(i2), pos.getY(i2), pos.getZ(i2))

    c.set(
      (v0.x + v1.x + v2.x) / 3,
      (v0.y + v1.y + v2.y) / 3,
      (v0.z + v1.z + v2.z) / 3
    )
    c.applyMatrix4(wm)

    // 运行完整检测管线
    const fingerBone = findFingerBone(c, null)
    if (fingerBone) { map[i] = fingerBone; continue }
    const footBone = findFootBone(c)
    if (footBone) { map[i] = footBone; continue }
    const torsoBone = findTorsoBone(c)
    if (torsoBone) { map[i] = torsoBone; continue }
    const spineBone = findSpineBone(c)
    if (spineBone) { map[i] = spineBone; continue }
    const ribBone = findRibBone(c)
    if (ribBone) { map[i] = ribBone; continue }
    const nearest = findNearestBone(c, 1.2)
    map[i] = nearest ? nearest.id : null
  }

  return map
}

// 足部射线定义（左足镜像，右足 X 为负）
// 每条射线对应一个趾列：bigtoe(拇指侧), toe2, toe3, toe4, toe5(小指侧)
const footRays = [
  { name: 'bigtoe', x: 0.15, mc: 'mt1', toes: ['pp_bigtoe', 'dp_bigtoe'] },
  { name: 'toe2',   x: 0.24, mc: 'mt2', toes: ['pp_toe2', 'mp_toe2', 'dp_toe2'] },
  { name: 'toe3',   x: 0.28, mc: 'mt3', toes: ['pp_toe3', 'mp_toe3', 'dp_toe3'] },
  { name: 'toe4',   x: 0.31, mc: 'mt4', toes: ['pp_toe4', 'mp_toe4', 'dp_toe4'] },
  { name: 'toe5',   x: 0.35, mc: 'mt5', toes: ['pp_toe5', 'mp_toe5', 'dp_toe5'] },
]

// 足部趾骨段定义（Y 值用于 PP/MP/DP 分段）
const footToeSegments = {
  pp: { yMin: -1.815, yMax: -1.775 },
  mp: { yMin: -1.820, yMax: -1.800 },
  dp: { yMin: -1.840, yMax: -1.815 },
}

// 根据世界坐标命中点查找足部骨骼
function findFootBone(worldPoint) {
  const absX = Math.abs(worldPoint.x)
  const y = worldPoint.y
  const hand = worldPoint.x > 0 ? 'l' : 'r'

  // 区域判断：Y < -1.3 且 |X| < 0.5
  if (y > -1.3 || absX > 0.5) return null

  // 按从具体到宽泛的顺序检查，避免区域重叠

  // 趾骨区域（Y < -1.75）— 最具体，优先
  // 使用 3D 距离匹配，Z 权重 0.3 辅助区分前后位置不同的趾骨
  if (y < -1.75) {
    const toeCandidates = []
    for (const ray of footRays) {
      for (const seg of Object.keys(footToeSegments)) {
        const id = `${seg}_${ray.name}_${hand}`
        if (bonePositions[id]) {
          const p = bonePositions[id].p
          const dx = absX - Math.abs(p[0])
          const dy = y - p[1]
          const dz = (worldPoint.z - p[2]) * 0.3
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          toeCandidates.push({ id, d })
        }
      }
    }
    toeCandidates.sort((a, b) => a.d - b.d)
    if (toeCandidates.length > 0 && toeCandidates[0].d < 0.10) {
      return toeCandidates[0].id
    }
    return null
  }

  // 跟骨（Y ≈ -1.50, 排除趾骨区域）
  // calcaneus_l X=0.184, calcaneus_r X=0.151, cuneiform_med_l X=0.164
  // 用 3D 距离匹配避免误判
  {
    const calc = bonePositions[`calcaneus_${hand}`]
    if (calc && y < -1.45 && y > -1.57) {
      const dx = absX - Math.abs(calc.p[0])
      const dy = y - calc.p[1]
      const dz = (worldPoint.z - calc.p[2]) * 0.3
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < 0.08) return `calcaneus_${hand}`
    }
  }

  // 跗骨 + 跖骨区域：跗骨（Y≈-1.50）在前，跖骨（Y≈-1.68）在后
  // 避免跖骨宽范围吞噬跗骨命中

  // 距骨：高位顶点 Y > -1.40 用宽 X，低位顶点 Y ≤ -1.40 用窄 X 避免吞跗骨
  if (y > -1.40 && y < -1.35 && absX > 0.15 && absX < 0.30) return `talus_${hand}`

  // 跗骨区域（3D 距离匹配，Z 权重 0.3 辅助区分深层顶点）
  // Y 范围 -1.57~-1.45：上界覆盖 face 质心，下界不吞跖骨中心（Y≈-1.68）
  if (y >= -1.57 && y < -1.45 && absX > 0.15 && absX < 0.30) {
    const candidates = [
      `cuneiform_med_${hand}`, `navicular_${hand}`, `cuneiform_mid_${hand}`,
      `cuboid_${hand}`, `cuneiform_lat_${hand}`,
    ]
    let bestBone = null, bestDist = Infinity
    for (const id of candidates) {
      const bp = bonePositions[id]
      if (!bp) continue
      const dx = worldPoint.x - bp.p[0]
      const dy = worldPoint.y - bp.p[1]
      const dz = (worldPoint.z - bp.p[2]) * 0.3
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < bestDist) { bestDist = d; bestBone = id }
    }
    return bestBone
  }

  // 跖骨区域（上界扩展到 -1.65，与跗骨下界 -1.75 衔接）
  // 使用 3D 距离匹配，Z 权重 0.3 辅助区分前后位置不同的跖骨
  if (y > -1.75 && y <= -1.65) {
    const mcCandidates = []
    for (const ray of footRays) {
      const id = `${ray.mc}_${hand}`
      if (bonePositions[id]) {
        const p = bonePositions[id].p
        const dx = worldPoint.x - p[0]
        const dy = worldPoint.y - p[1]
        const dz = (worldPoint.z - p[2]) * 0.3
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        mcCandidates.push({ id, d })
      }
    }
    mcCandidates.sort((a, b) => a.d - b.d)
    if (mcCandidates.length > 0 && mcCandidates[0].d < 0.10) {
      return mcCandidates[0].id
    }
  }

  return null
}

// 暴露到 window 用于测试
if (typeof window !== 'undefined') window.__findFootBone = findFootBone

// 躯干/颅骨区域检测 — 处理 mesh 表面共享导致全局匹配误判的骨骼
function findTorsoBone(worldPoint) {
  const absX = Math.abs(worldPoint.x)
  const y = worldPoint.y
  const z = worldPoint.z

  // 胸骨：前胸壁中线（Y 4.35-5.30 排除 t8 Y≈4.44），Z 显著靠前区别于后方椎骨
  if (absX < 0.12 && y > 4.35 && y < 5.30 && z > 0.20) return 'sternum'

  // 锁骨：前方两侧（Y≈5.14-5.16, |X|≈0.37-0.42, Z≈0.19-0.24）
  if (y > 5.0 && y < 5.25 && absX > 0.30 && absX < 0.50 && z > 0.10) {
    const side = worldPoint.x > 0 ? 'l' : 'r'
    return `clavicle_${side}`
  }

  // 额骨：前颅顶中线，X≈0 区别于颞骨（X≈±0.19, Z≈0.04）
  if (absX < 0.10 && y > 5.85 && y < 6.15 && z > 0.10) return 'frontal'

  // 下颌骨：下颚最低位（Y 5.55-5.62），区别于腭骨和舌骨
  // 注意：c1 Y≈5.66, c2 Y≈5.63, c3 Y≈5.53，需要排除
  if (absX < 0.12 && y > 5.55 && y < 5.62 && z > 0.15) return 'mandible'

  return null
}

// 暴露到 window 用于测试
if (typeof window !== 'undefined') window.__findTorsoBone = findTorsoBone

// 脊柱 + 肋骨 Y 坐标查找表 — 解决椎骨相邻误检
// 脊柱骨骼 X≈0，Z≈-0.15（胸骨在 Z>0.2 可区分），Y 坐标间隔足够大
// 肋骨在 |X|≈0.18-0.39，Y 同样有规律递减
const SPINE_Y_MAP = [
  { id: 'coccyx', y: 2.63 },
  { id: 'sacrum', y: 2.91 },
  { id: 'l5', y: 3.17 },
  { id: 'l4', y: 3.31 },
  { id: 'l3', y: 3.45 },
  { id: 'l2', y: 3.62 },
  { id: 'l1', y: 3.79 },
  { id: 't12', y: 3.95 },
  { id: 't11', y: 4.09 },
  { id: 't10', y: 4.22 },
  { id: 't9', y: 4.32 },
  { id: 't8', y: 4.44 },
  { id: 't7', y: 4.56 },
  { id: 't6', y: 4.67 },
  { id: 't5', y: 4.80 },
  { id: 't4', y: 4.91 },
  { id: 't3', y: 5.03 },
  { id: 't2', y: 5.12 },
  { id: 't1', y: 5.20 },
  { id: 'c7', y: 5.26 },
  { id: 'c6', y: 5.33 },
  { id: 'c5', y: 5.40 },
  { id: 'c4', y: 5.46 },
  { id: 'c3', y: 5.53 },
  { id: 'c2_axis', y: 5.63 },
  { id: 'c1_atlas', y: 5.66 },
]

function findSpineBone(worldPoint) {
  const absX = Math.abs(worldPoint.x)
  const y = worldPoint.y

  // 脊柱区域：X≈0，后方 Z < 0.30（排除胸骨 Z > 0.35）
  // 仅处理椎骨（c1-l5, sacrum, coccyx），肋骨由全局匹配处理
  // 椎骨 absX < 0.06，肋骨 absX > 0.18
  if (absX < 0.10 && y > 2.5 && y < 5.8 && worldPoint.z < 0.30) {
    let best = null, bestDist = Infinity
    for (const entry of SPINE_Y_MAP) {
      const d = Math.abs(y - entry.y)
      if (d < bestDist) { bestDist = d; best = entry }
    }
    if (best && bestDist < 0.12) return best.id
  }

  return null
}

// 暴露到 window 用于测试
if (typeof window !== 'undefined') window.__findSpineBone = findSpineBone

// 肋骨 Y 坐标查找表 — 基于 CT Derived Human Skeleton 模型精确校准
// 每根肋骨中心的 Y 坐标（从 bonePositions.js 提取）
const RIB_Y_MAP = [
  { id: 'rib_l1', y: 5.083 }, { id: 'rib_r1', y: 5.092 },
  { id: 'rib_l2', y: 4.989 }, { id: 'rib_r2', y: 4.987 },
  { id: 'rib_l3', y: 4.863 }, { id: 'rib_r3', y: 4.854 },
  { id: 'rib_l4', y: 4.725 }, { id: 'rib_r4', y: 4.714 },
  { id: 'rib_l5', y: 4.587 }, { id: 'rib_r5', y: 4.574 },
  { id: 'rib_l6', y: 4.429 }, { id: 'rib_r6', y: 4.438 },
  { id: 'rib_l7', y: 4.300 }, { id: 'rib_r7', y: 4.288 },
  { id: 'rib_l8', y: 4.184 }, { id: 'rib_r8', y: 4.171 },
  { id: 'rib_l9', y: 4.074 }, { id: 'rib_r9', y: 4.083 },
  { id: 'rib_l10', y: 3.984 }, { id: 'rib_r10', y: 3.987 },
  { id: 'rib_l11', y: 3.888 }, { id: 'rib_r11', y: 3.870 },
  { id: 'rib_l12', y: 3.840 }, { id: 'rib_r12', y: 3.810 },
]

// 肋骨专用检测 — 用 Y 坐标匹配 + X 范围过滤
// 解决相邻肋骨 mesh 表面连续导致的 nearestBone 误判
function findRibBone(worldPoint) {
  const absX = Math.abs(worldPoint.x)
  const y = worldPoint.y

  // 肋骨区域：|X| 0.10-0.50，Y 3.6-5.2
  if (absX < 0.10 || absX > 0.50 || y < 3.6 || y > 5.2) return null

  const side = worldPoint.x > 0 ? 'l' : 'r'
  let best = null, bestDist = Infinity
  for (const entry of RIB_Y_MAP) {
    if (!entry.id.includes(`_${side}`)) continue
    const d = Math.abs(y - entry.y)
    if (d < bestDist) { bestDist = d; best = entry }
  }
  if (best && bestDist < 0.10) {
    // 排除肩胛骨：肩胛骨 absX > 0.45，肋骨 absX < 0.40
    if (absX > 0.45) return null
    return best.id
  }
  return null
}

// 暴露到 window 用于测试
if (typeof window !== 'undefined') window.__findRibBone = findRibBone

// 查找最近的骨骼（世界坐标命中点）
// 距离接近时（<0.04），偏向更小的骨骼（大骨骼的 mesh 往往包裹小骨骼）
function findNearestBone(worldPoint, maxDist) {
  let best = null, bestDist = Infinity
  let second = null, secondDist = Infinity, secondSize = 0
  for (const b of boneLookup) {
    const dx = worldPoint.x - b.px
    const dy = worldPoint.y - b.py
    const dz = worldPoint.z - b.pz
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const threshold = maxDist != null ? maxDist : Math.max(b.size * 2.5, 0.15)
    if (dist < threshold) {
      if (dist < bestDist) {
        secondDist = bestDist; second = best; secondSize = best ? best.size : 0
        bestDist = dist; best = b
      } else if (dist < secondDist) {
        secondDist = dist; second = b; secondSize = b.size
      }
    }
  }
  // 距离接近时，偏向更小的骨骼（如听小骨 vs 颞骨）
  if (best && second && secondDist - bestDist < 0.04) {
    if (secondSize < best.size * 0.5) return second
  }
  return best
}

// ======== GLB 骨骼模型（视觉 + 交互） ========
function GLBSkeleton() {
  const { scene } = useGLTF('/apps/skeleton-anatomy/models/ct_derived_human_skeleton.glb')
  const theme = useStore((s) => s.theme)
  const selectBone = useStore((s) => s.selectBoneAndFly)
  const setHovered = useStore((s) => s.setHovered)
  const ref = useRef()
  const { camera } = useThree()

  const cloned = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.color = new THREE.Color(
          theme === 'dark' ? '#e8dcc8' : '#d4c8b0'
        )
        child.material.roughness = 0.6
        child.material.metalness = 0.05
        child.material.emissive = new THREE.Color('#000000')
        child.material.emissiveIntensity = 0
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene, theme])

  // 暴露场景引用 + 构建三角面手指映射表
  useEffect(() => {
    if (ref.current) {
      window.__debugGLBGroup = ref.current
      window.__debugCamera = camera
      window.__debugBonePositions = bonePositions
      window.__debugTHREE = THREE

      // 构建三角面→手指映射表（高精度手指检测）
      const meshes = []
      ref.current.traverse((c) => { if (c.isMesh) meshes.push(c) })
      if (meshes.length > 0) {
        window.__faceToFingerMap = buildFaceToFingerMap(meshes[0])

        // ---- Face-to-Bone 映射表（所有骨骼的快速三角面查表）----
        window.__faceToBoneMap = buildFaceToBoneMap(meshes[0])
        window.__faceToBoneTotalFaces = window.__faceToBoneMap.length
      }

      // 验证函数：对每个骨骼位置做射线检测，计算到模型表面的最近距离
      window.__verifyBonePositions = () => {
        const group = ref.current
        const meshes = []
        group.traverse((c) => { if (c.isMesh) meshes.push(c) })
        if (meshes.length === 0) return { error: 'no meshes found' }

        const raycaster = new THREE.Raycaster()
        raycaster.far = 5

        // 多方向检测：6 个轴向 + 4 个对角线
        const dirs = [
          [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1],
          [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
          [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
        ].map(d => new THREE.Vector3(d[0], d[1], d[2]).normalize())

        const results = {}
        const warnings = []
        let totalChecked = 0

        for (const [id, pos] of Object.entries(bonePositions)) {
          const point = new THREE.Vector3(pos.p[0], pos.p[1], pos.p[2])
          // 计算骨骼尺寸作为容差
          const boneSize = Array.isArray(pos.s) ? Math.max(...pos.s) : pos.s
          // 容差 = 骨骼尺寸 * 2（留足够余量）
          const tolerance = Math.max(boneSize * 2.5, 0.15)

          let minDist = Infinity

          for (const dir of dirs) {
            raycaster.set(point, dir)
            const hits = raycaster.intersectObjects(meshes, false)
            if (hits.length > 0 && hits[0].distance < minDist) {
              minDist = hits[0].distance
            }
          }

          // 也从骨骼位置向外发射反向射线（从网格到骨骼）
          raycaster.far = 5
          // 额外检测: 在骨骼附近的球形区域内检测网格
          // 使用更宽泛的射线
          for (let attempt = 0; attempt < 20; attempt++) {
            const randomDir = new THREE.Vector3(
              Math.random() * 2 - 1,
              Math.random() * 2 - 1,
              Math.random() * 2 - 1
            ).normalize()
            raycaster.set(point, randomDir)
            const hits = raycaster.intersectObjects(meshes, false)
            if (hits.length > 0 && hits[0].distance < minDist) {
              minDist = hits[0].distance
            }
            if (hits.length > 0 && hits[0].distance < tolerance) {
              break
            }
          }

          const status = minDist < tolerance ? 'ok' : minDist < tolerance * 2 ? 'warn' : 'error'

          results[id] = {
            minDist: Math.round(minDist * 100) / 100,
            tolerance: Math.round(tolerance * 100) / 100,
            status,
            boneSize: Math.round(boneSize * 100) / 100
          }

          if (status === 'warn') warnings.push({ id, minDist: results[id].minDist, tolerance: results[id].tolerance })
          if (status === 'error') warnings.push({ id, minDist: results[id].minDist, tolerance: results[id].tolerance, severity: 'error' })

          totalChecked++
        }

        const okCount = Object.values(results).filter(r => r.status === 'ok').length
        const warnCount = Object.values(results).filter(r => r.status === 'warn').length
        const errorCount = Object.values(results).filter(r => r.status === 'error').length

        return {
          total: totalChecked,
          ok: okCount,
          warn: warnCount,
          error: errorCount,
          warnings: warnings.slice(0, 30),
          details: results
        }
      }
    }
  }, [camera])

  // GLB 点击 → 启发式管线 → face-to-bone 查表兜底
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()

      const knownFinger = e.faceIndex != null && window.__faceToFingerMap
        ? window.__faceToFingerMap[e.faceIndex]
        : null
      const fingerBone = findFingerBone(e.point, knownFinger)
      if (fingerBone) {
        selectBone(fingerBone)
        return
      }
      const footBone = findFootBone(e.point)
      if (footBone) {
        selectBone(footBone)
        return
      }
      const torsoBone = findTorsoBone(e.point)
      if (torsoBone) {
        selectBone(torsoBone)
        return
      }
      const spineBone = findSpineBone(e.point)
      if (spineBone) {
        selectBone(spineBone)
        return
      }
      const ribBone = findRibBone(e.point)
      if (ribBone) {
        selectBone(ribBone)
        return
      }
      const nearest = findNearestBone(e.point, 1.2)
      if (nearest) {
        selectBone(nearest.id)
        return
      }

      if (e.faceIndex != null && window.__faceToBoneMap) {
        const boneId = window.__faceToBoneMap[e.faceIndex]
        if (boneId) selectBone(boneId)
      }
    },
    [selectBone]
  )

  // 悬停检测
  const handlePointerMove = useCallback(
    (e) => {
      e.stopPropagation()
      const knownFinger = e.faceIndex != null && window.__faceToFingerMap
        ? window.__faceToFingerMap[e.faceIndex]
        : null
      const fingerBone = findFingerBone(e.point, knownFinger)
      if (fingerBone) {
        setHovered(fingerBone)
        document.body.style.cursor = 'pointer'
        return
      }
      const footBone = findFootBone(e.point)
      if (footBone) {
        setHovered(footBone)
        document.body.style.cursor = 'pointer'
        return
      }
      const torsoBone = findTorsoBone(e.point)
      if (torsoBone) {
        setHovered(torsoBone)
        document.body.style.cursor = 'pointer'
        return
      }
      const spineBone = findSpineBone(e.point)
      if (spineBone) {
        setHovered(spineBone)
        document.body.style.cursor = 'pointer'
        return
      }
      const ribBone = findRibBone(e.point)
      if (ribBone) {
        setHovered(ribBone)
        document.body.style.cursor = 'pointer'
        return
      }
      const nearest = findNearestBone(e.point, 0.6)
      if (nearest) {
        setHovered(nearest.id)
        document.body.style.cursor = 'pointer'
      } else {
        setHovered(null)
        document.body.style.cursor = 'default'
      }
    },
    [setHovered]
  )

  const handlePointerOut = useCallback(() => {
    setHovered(null)
    document.body.style.cursor = 'default'
  }, [setHovered])

  return (
    <primitive
      ref={ref}
      object={cloned}
      scale={[4.7202, 4.8167, 4.6351]}
      position={[0.0452, 2.655, 0.1345]}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    />
  )
}

// 精确定位点（深色小核心）
const coreGeo = new THREE.SphereGeometry(1, 8, 6)
function CoreDot({ position, size, color = '#1a1a1a' }) {
  return (
    <mesh position={position} scale={Math.max(0.015, size * 0.25)}>
      <primitive object={coreGeo} />
      <meshBasicMaterial color={color} depthTest={true} depthWrite={true} />
    </mesh>
  )
}

// ======== 选中/悬停发光指示器 ========
function SelectionIndicators() {
  const selectedBone = useStore((s) => s.selectedBone)
  const hoveredBone = useStore((s) => s.hoveredBone)
  const theme = useStore((s) => s.theme)

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 12), [])

  const indicators = []

  // 悬停指示器（轻量发光 + 中心点）
  if (hoveredBone && hoveredBone !== selectedBone) {
    const pos = bonePositions[hoveredBone]
    if (pos) {
      const s = Array.isArray(pos.s) ? Math.max(...pos.s) : pos.s
      const indicatorSize = Math.max(0.025, s * 0.55)
      indicators.push(
        <group key={`hover-${hoveredBone}`}>
          <HoverIndicator
            position={pos.p}
            size={indicatorSize}
            theme={theme}
          />
          <CoreDot position={pos.p} size={indicatorSize} color={theme === 'dark' ? '#331a0a' : '#2a1508'} />
        </group>
      )
    }
  }

  // 选中指示器（强发光 + 脉冲 + 中心点）
  if (selectedBone) {
    const pos = bonePositions[selectedBone]
    if (pos) {
      const s = Array.isArray(pos.s) ? Math.max(...pos.s) : pos.s
      const indicatorSize = Math.max(0.03, s * 0.6)
      indicators.push(
        <group key={`sel-${selectedBone}`}>
          <SelectedIndicator
            position={pos.p}
            size={indicatorSize}
            geometry={sphereGeo}
          />
          <CoreDot position={pos.p} size={indicatorSize} color="#1a0500" />
        </group>
      )
    }
  }

  return <group>{indicators}</group>
}

// 悬停发光球
function HoverIndicator({ position, size, theme }) {
  return (
    <mesh position={position} scale={size}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshBasicMaterial
        color={theme === 'dark' ? '#ffaa66' : '#ff7733'}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  )
}

// 选中发光球（脉冲动画）
function SelectedIndicator({ position, size, geometry }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.userData.phase = (ref.current.userData.phase || 0) + delta * 2.5
      const pulse = 1 + Math.sin(ref.current.userData.phase) * 0.15
      ref.current.scale.setScalar(size * pulse)
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <primitive object={geometry} />
      <meshStandardMaterial
        color="#ff4d1a"
        emissive="#ff6b35"
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function SkeletonModel() {
  return (
    <group>
      <GLBSkeleton />
      <SelectionIndicators />
    </group>
  )
}
