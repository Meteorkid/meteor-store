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
}

export const CAMERA_LIMITS = { yaw: .26, pitch: .18 } as const;
const EPSILON = .00002;
const RESPONSE = 14;
const INERTIA_DAMPING = 6.5;

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
    if (!autoRotate) return { yaw: 0, pitch: 0 };
    return { yaw: Math.sin(autoPhase) * .055, pitch: (1 - Math.cos(autoPhase)) * .018 };
  }

  function desiredPose(): SkyCameraPose {
    return { yaw: targetYaw, pitch: targetPitch };
  }

  function currentPose(): SkyCameraPose {
    const auto = automaticOffset();
    return { yaw: clamp(yaw + auto.yaw, CAMERA_LIMITS.yaw), pitch: clamp(pitch + auto.pitch, CAMERA_LIMITS.pitch) };
  }

  function stopInertia(): void { velocityYaw = velocityPitch = 0; }

  return {
    getPose: currentPose,
    setOptions(next: SkyCameraOptions): void {
      if (autoRotate !== next.autoRotate) {
        const auto = automaticOffset();
        yaw = clamp(yaw + auto.yaw, CAMERA_LIMITS.yaw);
        pitch = clamp(pitch + auto.pitch, CAMERA_LIMITS.pitch);
        targetYaw = clamp(targetYaw + auto.yaw, CAMERA_LIMITS.yaw);
        targetPitch = clamp(targetPitch + auto.pitch, CAMERA_LIMITS.pitch);
        autoPhase = 0;
        autoRotate = next.autoRotate;
      }
      if (mode !== next.interactionMode) {
        dragging = false;
        resetting = false;
        stopInertia();
        mode = next.interactionMode;
        targetYaw = mode === 'follow' ? 0 : yaw;
        targetPitch = mode === 'follow' ? 0 : pitch;
      }
    },
    follow(x: number, y: number): void {
      if (mode !== 'follow' || !Number.isFinite(x) || !Number.isFinite(y)) return;
      resetting = false;
      targetYaw = clamp(x, 1) * .12;
      targetPitch = -clamp(y, 1) * .08;
      stopInertia();
    },
    leave(): void {
      if (mode === 'follow') targetYaw = targetPitch = 0;
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
      const nextYaw = clamp(targetYaw - x * .9, CAMERA_LIMITS.yaw);
      const nextPitch = clamp(targetPitch + y * .7, CAMERA_LIMITS.pitch);
      velocityYaw = clamp(velocityYaw * .35 + (nextYaw - targetYaw) / dt * .65, 1.2);
      velocityPitch = clamp(velocityPitch * .35 + (nextPitch - targetPitch) / dt * .65, .9);
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
      if (mode === 'follow') targetYaw = targetPitch = 0;
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
      return Math.abs(yaw - desired.yaw) > EPSILON || Math.abs(pitch - desired.pitch) > EPSILON
        || (!dragging && (Math.abs(velocityYaw) > EPSILON || Math.abs(velocityPitch) > EPSILON))
        || (autoRotate && allowAutomatic && !dragging && !resetting);
    },
    tick(elapsed: number, allowAutomatic: boolean): SkyCameraPose {
      const dt = Math.max(0, Math.min(.1, Number.isFinite(elapsed) ? elapsed : 0));
      if (!dragging && mode === 'drag' && !resetting) {
        const nextYaw = targetYaw + velocityYaw * dt;
        const nextPitch = targetPitch + velocityPitch * dt;
        targetYaw = clamp(nextYaw, CAMERA_LIMITS.yaw);
        targetPitch = clamp(nextPitch, CAMERA_LIMITS.pitch);
        const damping = Math.exp(-INERTIA_DAMPING * dt);
        velocityYaw = nextYaw === targetYaw ? velocityYaw * damping : 0;
        velocityPitch = nextPitch === targetPitch ? velocityPitch * damping : 0;
        if (Math.abs(velocityYaw) < EPSILON) velocityYaw = 0;
        if (Math.abs(velocityPitch) < EPSILON) velocityPitch = 0;
      }
      if (autoRotate && allowAutomatic && !dragging && !resetting) autoPhase += dt * .18;
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

/** 屏幕x向右/y向下/z向远处，先绕Y再绕X，与星云采样使用互逆旋转。 */
export function createSkyProjector(width: number, height: number, pose: SkyCameraPose) {
  const centerX = width / 2;
  const centerY = height / 2;
  const focal = Math.max(1, width, height) * .85;
  const yaw = clamp(Number.isFinite(pose.yaw) ? pose.yaw : 0, CAMERA_LIMITS.yaw);
  const pitch = clamp(Number.isFinite(pose.pitch) ? pose.pitch : 0, CAMERA_LIMITS.pitch);
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return (x: number, y: number, depth: number): ProjectedSkyPoint => {
    if (yaw === 0 && pitch === 0) return { x, y, scale: 1 };
    const z = .55 - Math.max(0, Math.min(1, depth)) * 1.1;
    const baseDistance = 4 + z;
    const worldX = (x - centerX) * baseDistance / focal;
    const worldY = (y - centerY) * baseDistance / focal;
    const x1 = cy * worldX + sy * z;
    const z1 = -sy * worldX + cy * z;
    const y2 = cp * worldY - sp * z1;
    const z2 = sp * worldY + cp * z1;
    const distance = Math.max(.5, 4 + z2);
    return { x: centerX + x1 * focal / distance, y: centerY + y2 * focal / distance, scale: baseDistance / distance };
  };
}
