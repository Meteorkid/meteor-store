import { MathUtils, Vector3 } from 'orbit-three';

interface OrbitAngles {
  azimuth: number;
  elevation: number;
}

export interface OrbitPose extends OrbitAngles {
  target: Vector3;
  distance: number;
}

const elevationLimit = MathUtils.degToRad(80);
const fullTurn = 2 * Math.PI;

export function rotateOrbitPose(pose: OrbitPose, dx: number, dy: number, viewportHeight: number): void {
  const radiansPerPixel = fullTurn / viewportHeight;
  pose.azimuth = MathUtils.euclideanModulo(pose.azimuth - dx * radiansPerPixel, fullTurn);
  pose.elevation = MathUtils.clamp(pose.elevation + dy * radiansPerPixel, -elevationLimit, elevationLimit);
}

/** 先将视线移到选中目标，再收近镜头。途中重新选中时可以从当前画面继续。 */
export function orbitFlightPullback(from: OrbitPose, to: OrbitPose): number {
  return Math.log(Math.max(1, .9 * from.target.distanceTo(to.target) / Math.max(from.distance, to.distance)));
}

export function interpolateOrbitPose(from: OrbitPose, to: OrbitPose, progress: number, target: OrbitPose, pullback = orbitFlightPullback(from, to)): void {
  const t = MathUtils.clamp(progress, 0, 1);
  const ease = (value: number) => value < .5 ? 8 * value ** 4 : 1 - 8 * (1 - value) ** 4;
  const aim = ease(Math.min(1, t / .65));
  const zoom = ease(Math.max(0, (t - .2) / .8));
  target.target.lerpVectors(from.target, to.target, aim);
  target.distance = Math.exp(MathUtils.lerp(Math.log(from.distance), Math.log(to.distance), zoom) + Math.sin(Math.PI * t) * pullback);
  const turn = MathUtils.euclideanModulo(to.azimuth - from.azimuth + Math.PI, fullTurn) - Math.PI;
  target.azimuth = from.azimuth + turn * ease(t);
  target.elevation = MathUtils.lerp(from.elevation, to.elevation, ease(t));
}
