export type SkyInteractionMode = 'follow' | 'drag' | 'off';

export interface SkyCameraPose {
  readonly yaw: number;
  readonly pitch: number;
}

export interface SkyCameraOptions {
  interactionMode: SkyInteractionMode;
  autoRotate: boolean;
}

export interface ProjectedSkyPoint {
  x: number;
  y: number;
  scale: number;
  visible: boolean;
}

export interface SkyDirection {
  x: number;
  y: number;
  z: number;
}

export function createDirectionFromAngles(longitude: number, latitude: number): SkyDirection {
  const cosLatitude = Math.cos(latitude);
  return {
    x: Math.sin(longitude) * cosLatitude,
    y: Math.sin(latitude),
    z: Math.cos(longitude) * cosLatitude,
  };
}

export const CAMERA_LIMITS = { yaw: Math.PI, pitch: Math.PI / 3 } as const;
const EPSILON = .00002;
const RESPONSE = 24;
const INERTIA_DAMPING = 6.5;
const FOLLOW_YAW = Math.PI;
const FOLLOW_PITCH = Math.PI * .28;
const DRAG_YAW = Math.PI * .9;
const MAX_YAW_SPEED = 5.5;
const AUTO_ORBIT_SPEED = .11;

export function normalizeCameraYaw(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value >= -Math.PI && value <= Math.PI) return value;
  const wrapped = (value + Math.PI) % (Math.PI * 2);
  return (wrapped < 0 ? wrapped + Math.PI * 2 : wrapped) - Math.PI;
}

function angleDistance(from: number, to: number): number {
  return normalizeCameraYaw(to - from);
}

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}

/** 相机独立于星光时钟：手动查看可以在暂停时继续，自动巡视则由调用方暂停。 */
export function createSkyCamera(initial: SkyCameraOptions) {
  let mode = initial.interactionMode;
  let autoRotate = initial.autoRotate;
  let yaw = 0;
  let pitch = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let velocityYaw = 0;
  let velocityPitch = 0;
  let dragging = false;
  let resetting = false;
  let autoPhase = 0;

  function automaticOffset(): SkyCameraPose {
    return { yaw: autoRotate ? normalizeCameraYaw(autoPhase * AUTO_ORBIT_SPEED) : 0, pitch: 0 };
  }

  function desiredPose(): SkyCameraPose {
    return { yaw: targetYaw, pitch: targetPitch };
  }

  function currentPose(): SkyCameraPose {
    const auto = automaticOffset();
    return { yaw: normalizeCameraYaw(yaw + auto.yaw), pitch: clamp(pitch + auto.pitch, CAMERA_LIMITS.pitch) };
  }

  function stopInertia(): void { velocityYaw = velocityPitch = 0; }

  return {
    getPose: currentPose,
    setOptions(next: SkyCameraOptions): void {
      if (autoRotate !== next.autoRotate) {
        const auto = automaticOffset();
        yaw = normalizeCameraYaw(yaw + auto.yaw);
        pitch = clamp(pitch + auto.pitch, CAMERA_LIMITS.pitch);
        targetYaw = yaw;
        targetPitch = clamp(targetPitch + auto.pitch, CAMERA_LIMITS.pitch);
        autoPhase = 0;
        autoRotate = next.autoRotate;
      }
      if (mode !== next.interactionMode) {
        dragging = false;
        resetting = false;
        stopInertia();
        mode = next.interactionMode;
        yaw = normalizeCameraYaw(yaw);
        // 切换交互方式时保留当前观察方向；只有 RESET 才回到初始天顶。
        targetYaw = yaw;
        targetPitch = pitch;
      }
    },
    follow(x: number, y: number): void {
      if (mode !== 'follow' || !Number.isFinite(x) || !Number.isFinite(y)) return;
      resetting = false;
      targetYaw = clamp(x, 1) * FOLLOW_YAW;
      targetPitch = -clamp(y, 1) * FOLLOW_PITCH;
      stopInertia();
    },
    leave(): void {
      // 指针离开只停止输入，保留最后朝向，避免画面机械地弹回中心。
      stopInertia();
    },
    beginDrag(): void {
      if (mode !== 'drag') return;
      dragging = true;
      resetting = false;
      targetYaw = yaw;
      targetPitch = pitch;
      stopInertia();
    },
    dragBy(x: number, y: number, elapsed: number): void {
      if (!dragging || mode !== 'drag' || !Number.isFinite(x) || !Number.isFinite(y)) return;
      const dt = Math.max(1 / 240, Math.min(.25, Number.isFinite(elapsed) ? elapsed : 1 / 60));
      const nextYaw = targetYaw - x * DRAG_YAW;
      const yawDelta = nextYaw - targetYaw;
      const nextPitch = clamp(targetPitch + y * Math.PI * .55, CAMERA_LIMITS.pitch);
      velocityYaw = clamp(velocityYaw * .25 + yawDelta / dt * .75, MAX_YAW_SPEED);
      velocityPitch = clamp(velocityPitch * .25 + (nextPitch - targetPitch) / dt * .75, 2.2);
      targetYaw = nextYaw;
      targetPitch = nextPitch;
    },
    endDrag(inertia = true): void {
      dragging = false;
      if (!inertia) stopInertia();
    },
    cancelInput(): void {
      dragging = false;
      stopInertia();
    },
    reset(): void {
      const current = currentPose();
      yaw = current.yaw;
      pitch = current.pitch;
      dragging = false;
      resetting = Math.abs(yaw) > EPSILON || Math.abs(pitch) > EPSILON;
      targetYaw = targetPitch = autoPhase = 0;
      if (!resetting) yaw = pitch = 0;
      stopInertia();
    },
    isMoving(allowAutomatic: boolean): boolean {
      const desired = desiredPose();
      return Math.abs(angleDistance(yaw, desired.yaw)) > EPSILON || Math.abs(pitch - desired.pitch) > EPSILON
        || (!dragging && (Math.abs(velocityYaw) > EPSILON || Math.abs(velocityPitch) > EPSILON))
        || (autoRotate && allowAutomatic && !dragging && !resetting);
    },
    tick(elapsed: number, allowAutomatic: boolean): SkyCameraPose {
      const dt = Math.max(0, Math.min(.1, Number.isFinite(elapsed) ? elapsed : 0));
      if (!dragging && mode === 'drag' && !resetting) {
        const nextYaw = targetYaw + velocityYaw * dt;
        const nextPitch = targetPitch + velocityPitch * dt;
        targetYaw = nextYaw;
        targetPitch = clamp(nextPitch, CAMERA_LIMITS.pitch);
        const damping = Math.exp(-INERTIA_DAMPING * dt);
        velocityYaw *= damping;
        velocityPitch = nextPitch === targetPitch ? velocityPitch * damping : 0;
        if (Math.abs(velocityYaw) < EPSILON) velocityYaw = 0;
        if (Math.abs(velocityPitch) < EPSILON) velocityPitch = 0;
      }
      if (autoRotate && allowAutomatic && !dragging && !resetting) autoPhase += dt;
      const desired = desiredPose();
      const blend = 1 - Math.exp(-RESPONSE * dt);
      yaw += (desired.yaw - yaw) * blend;
      pitch += (desired.pitch - pitch) * blend;
      if (Math.abs(desired.yaw - yaw) <= EPSILON) yaw = desired.yaw;
      if (Math.abs(desired.pitch - pitch) <= EPSILON) pitch = desired.pitch;
      if (resetting && yaw === 0 && pitch === 0) resetting = false;
      return currentPose();
    },
  };
}

/** 把天幕坐标转换成以观察者为原点的单位方向向量。 */
export function createSkyDirection(x: number, y: number, width: number, height: number): SkyDirection {
  const longitude = (x / Math.max(1, width) - .5) * Math.PI * 2;
  const latitude = (.5 - y / Math.max(1, height)) * Math.PI;
  return createDirectionFromAngles(longitude, latitude);
}

/** 用户站在球心，左右和俯仰共同决定朝向；星点按球面透视投影。 */
export function createSkyProjector(width: number, height: number, pose: SkyCameraPose) {
  const centerX = width / 2;
  const centerY = height / 2;
  const focal = Math.max(1, width) * .5;
  const yaw = normalizeCameraYaw(pose.yaw);
  const pitch = clamp(Number.isFinite(pose.pitch) ? pose.pitch : 0, CAMERA_LIMITS.pitch);
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return (directionX: number, directionY: number, directionZ: number, depth: number): ProjectedSkyPoint => {
    const x1 = cy * directionX - sy * directionZ;
    const z1 = sy * directionX + cy * directionZ;
    const y2 = cp * directionY - sp * z1;
    const z2 = sp * directionY + cp * z1;
    if (z2 <= .045) return { x: NaN, y: NaN, scale: 0, visible: false };
    const x = centerX + x1 * focal / z2;
    const y = centerY - y2 * focal / z2;
    const visible = x >= -120 && x <= width + 120 && y >= -120 && y <= height + 120;
    const depthScale = 1 + (Math.max(0, Math.min(1, depth)) - .5) * .08;
    return {
      x,
      y,
      scale: Math.min(3.8, 1 / z2) * depthScale,
      visible,
    };
  };
}
