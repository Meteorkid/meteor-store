// @ts-nocheck
/* eslint-disable */
/**
 * 手势检测工具函数
 * 从 Camera.jsx 提取的纯函数，便于测试和复用
 */

// 统一手指伸直评分：综合 y 坐标 + 距离 + 角度三个信号，返回 0-1 分数
// 1 = 完全伸直，0 = 完全弯曲
export function fingerScore(pts, tipIdx, pipIdx, mcpIdx) {
  const tip = pts[tipIdx];
  const pip = pts[pipIdx];
  const mcp = pts[mcpIdx];
  const wrist = pts[0];

  // 信号1: y 坐标比较（tip 比 pip/mcp 高 = 伸直）
  const yScore = (tip.y < pip.y ? 0.5 : 0) + (tip.y < mcp.y ? 0.5 : 0);

  // 信号2: 距离比较（tip 离手腕比 pip 远 = 伸直）
  const tipDist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
  const pipDist = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
  const dScore = tipDist > pipDist * 1.05 ? 0.5 : tipDist > pipDist ? 0.25 : 0;

  // 信号3: 手指角度（tip 在 mcp-pip 延长线上 = 伸直）
  const angle = Math.atan2(tip.y - mcp.y, tip.x - mcp.x);
  const pipAngle = Math.atan2(pip.y - mcp.y, pip.x - mcp.x);
  const rawDiff = Math.abs(angle - pipAngle);
  const angleDiff = rawDiff > Math.PI ? Math.PI * 2 - rawDiff : rawDiff;
  const aScore = angleDiff < 0.5 ? 0.5 : angleDiff < 1.0 ? 0.25 : 0;

  return Math.min(1, yScore + dScore + aScore);
}

// 判断手指是否伸直（阈值 0.6）
export function isFingerUp(pts, tipIdx, pipIdx, mcpIdx, threshold = 0.6) {
  return fingerScore(pts, tipIdx, pipIdx, mcpIdx) >= threshold;
}

// 判断手指是否弯曲（阈值 0.35）
export function isFingerDown(pts, tipIdx, pipIdx, mcpIdx) {
  return fingerScore(pts, tipIdx, pipIdx, mcpIdx) < 0.35;
}

// 手掌方向检测：返回 'front' | 'down' | 'side'
export function palmDirection(pts) {
  const wrist = pts[0];
  const mcp9 = pts[9]; // 中指根部
  const dy = mcp9.y - wrist.y;
  const dx = mcp9.x - wrist.x;
  if (dy > 0.08) return 'down';
  if (Math.abs(dx) > 0.15) return 'side';
  return 'front';
}

// 拇指向上检测
export function isThumbUp(pts) {
  const thumbTip = pts[4];
  const thumbMcp = pts[2];
  return thumbTip.y < thumbMcp.y - 0.04 &&
    Math.hypot(thumbTip.x - thumbMcp.x, thumbTip.y - thumbMcp.y) > 0.03;
}

// 拇指弯曲检测
export function isThumbClosed(pts) {
  const thumbTip = pts[4];
  const indexMcp = pts[5];
  return Math.hypot(thumbTip.x - indexMcp.x, thumbTip.y - indexMcp.y) < 0.08;
}

// 检查握拳手势
export function checkFist(pts, scoreThreshold = 0.6) {
  return isFingerDown(pts, 8, 6, 5) &&
    isFingerDown(pts, 12, 10, 9) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerDown(pts, 20, 18, 17) &&
    isThumbClosed(pts);
}

// 检查张开手掌手势
export function checkOpen(pts, scoreThreshold = 0.6) {
  return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
    isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
    isFingerUp(pts, 16, 14, 13, scoreThreshold) &&
    isFingerUp(pts, 20, 18, 17, scoreThreshold);
}

// 检查剪刀手手势
export function checkScissor(pts, scoreThreshold = 0.6) {
  return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
    isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerDown(pts, 20, 18, 17);
}

// 检查摇滚手势
export function checkRock(pts, scoreThreshold = 0.6) {
  return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
    isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerUp(pts, 20, 18, 17, scoreThreshold);
}

// 检查老虎手势
export function checkTiger(pts, scoreThreshold = 0.6) {
  return isThumbUp(pts) &&
    isFingerDown(pts, 8, 6, 5) &&
    isFingerDown(pts, 12, 10, 9) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerDown(pts, 20, 18, 17);
}

// 检查捏合手势
export function checkPinch(pts, scoreThreshold = 0.6) {
  const thumbTip = pts[4];
  const indexTip = pts[8];
  const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
  return dist < 0.06 &&
    isFingerDown(pts, 12, 10, 9) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerDown(pts, 20, 18, 17);
}

// 检查手掌朝下手势
export function checkPalmDown(pts, scoreThreshold = 0.6) {
  return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
    isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
    isFingerUp(pts, 16, 14, 13, scoreThreshold) &&
    isFingerUp(pts, 20, 18, 17, scoreThreshold) &&
    palmDirection(pts) === 'down';
}

// 检查食指伸直手势
export function checkIndex(pts, scoreThreshold = 0.6) {
  return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
    isFingerDown(pts, 12, 10, 9) &&
    isFingerDown(pts, 16, 14, 13) &&
    isFingerDown(pts, 20, 18, 17);
}
