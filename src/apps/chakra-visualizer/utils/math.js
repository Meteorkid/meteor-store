// @ts-nocheck
/* eslint-disable */
/**
 * 数学工具函数
 * 从 Camera.jsx 提取的纯函数，便于测试和复用
 */

/**
 * 计算两点之间的距离
 */
export function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * 计算两点之间的距离（包含 z 坐标）
 */
export function distance3D(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

/**
 * 线性插值
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * 限制值在范围内
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 将值映射到新范围
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * 角度转弧度
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * 计算两点之间的角度（弧度）
 */
export function angleBetween(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * 计算角度差（处理环绕）
 */
export function angleDiff(a1, a2) {
  const rawDiff = Math.abs(a1 - a2);
  return rawDiff > Math.PI ? Math.PI * 2 - rawDiff : rawDiff;
}

/**
 * 随机数在范围内
 */
export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * 随机整数在范围内
 */
export function randomIntInRange(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

/**
 * 平滑步进函数
 */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * 检查点是否在矩形内
 */
export function pointInRect(point, rect) {
  return point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height;
}

/**
 * 检查点是否在圆内
 */
export function pointInCircle(point, circle, radius) {
  return distance(point, circle) <= radius;
}
