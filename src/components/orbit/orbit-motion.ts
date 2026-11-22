export const DEFAULT_ORBIT_SPEED = 8;
export const BELT_ORBIT_DAYS = 1680;

const minimumSpeed = 0.1;
const maximumSpeed = 1000;
const fullTurn = 2 * Math.PI;

export function orbitSpeedForSlider(position: number): number {
  if (position <= 0) return 0;
  const progress = (Math.min(100, Math.max(1, position)) - 1) / 99;
  return minimumSpeed * 10 ** (4 * progress);
}

export function orbitSpeedSliderPosition(speed: number): number {
  if (speed <= 0) return 0;
  const boundedSpeed = Math.min(maximumSpeed, Math.max(minimumSpeed, speed));
  return 1 + (99 * Math.log10(boundedSpeed / minimumSpeed)) / 4;
}

export function orbitAngleRadians(startAngle: number, simulatedDays: number, orbitDays: number): number {
  const completedDegrees = orbitDays > 0 ? ((simulatedDays % orbitDays) / orbitDays) * 360 : 0;
  const angle = (startAngle + completedDegrees) % 360;
  return (angle < 0 ? angle + 360 : angle) * (Math.PI / 180);
}

export function orbitSpinDelta(signedRotationHours: number, daysPerSecond: number, deltaSeconds: number): number {
  if (signedRotationHours === 0 || daysPerSecond <= 0 || deltaSeconds <= 0) return 0;
  const turnsPerSecond = (daysPerSecond * 24) / Math.abs(signedRotationHours);
  // 给高速播放限速，同时保留逆行天体的自转方向。
  return Math.min(turnsPerSecond, 0.12) * Math.sign(signedRotationHours) * fullTurn * deltaSeconds;
}
