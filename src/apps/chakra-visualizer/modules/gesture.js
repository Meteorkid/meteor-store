// @ts-nocheck
/* eslint-disable */
/**
 * 手势检测模块
 * 从 Camera.jsx 提取的手势检测逻辑
 */

import { fingerScore, isFingerUp, isFingerDown, palmDirection, isThumbUp, isThumbClosed } from '../utils/gesture-utils';

// 结印名称映射
export const SEAL_NAMES = {
  '子': { seal: '子', gesture: '握拳',   gestureEn: 'Fist',       emoji: '👊' },
  '丑': { seal: '丑', gesture: '张掌',   gestureEn: 'Open Palm',  emoji: '🖐️' },
  '寅': { seal: '寅', gesture: 'V字',    gestureEn: 'V-Sign',     emoji: '✌️' },
  '卯': { seal: '卯', gesture: '竖拇指', gestureEn: 'Thumb Up',   emoji: '👍' },
  '辰': { seal: '辰', gesture: '摇滚',   gestureEn: 'Rock',       emoji: '🤘' },
  '巳': { seal: '巳', gesture: '捏合',   gestureEn: 'Pinch',      emoji: '🤏' },
  '午': { seal: '午', gesture: '掌朝下', gestureEn: 'Palm Down',  emoji: '🖐️↓' },
  '未': { seal: '未', gesture: '食指',   gestureEn: 'Index',      emoji: '☝️' },
  '申': { seal: '申', gesture: '手枪',   gestureEn: 'Gun',        emoji: '🤙' },
  '酉': { seal: '酉', gesture: '电话',   gestureEn: 'Phone',      emoji: '🤙' },
  '戌': { seal: '戌', gesture: '小指',   gestureEn: 'Pinky',      emoji: '🤙' },
  '亥': { seal: '亥', gesture: '双掌',   gestureEn: 'Prayer',     emoji: '🙏' },
};

/**
 * 根据语言获取手势名
 * @param {Object} sealInfo - SEAL_NAMES 中的条目
 * @param {string} lang - 'zh' 或 'en'
 * @returns {string} 手势名
 */
export function getGestureName(sealInfo, lang = 'zh') {
  if (!sealInfo) return '';
  return lang === 'en' ? (sealInfo.gestureEn || sealInfo.gesture) : sealInfo.gesture;
}

/**
 * 创建手势检测器
 */
export function createGestureDetector(config = {}) {
  const gestureHistory = [];
  let stableGesture = null;

  const gestureFrames = config.gestureFrames || 2;
  const scoreThreshold = config.scoreThreshold || 0.6;

  // 检查握拳手势
  function checkFist(pts) {
    return isFingerDown(pts, 8, 6, 5) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17) &&
      isThumbClosed(pts);
  }

  // 检查张开手掌手势
  function checkOpen(pts) {
    return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
      isFingerUp(pts, 16, 14, 13, scoreThreshold) &&
      isFingerUp(pts, 20, 18, 17, scoreThreshold);
  }

  // 检查剪刀手手势
  function checkScissor(pts) {
    return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17);
  }

  // 检查摇滚手势
  function checkRock(pts) {
    return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerUp(pts, 20, 18, 17, scoreThreshold);
  }

  // 检查老虎手势
  function checkTiger(pts) {
    return isThumbUp(pts) &&
      isFingerDown(pts, 8, 6, 5) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17);
  }

  // 检查捏合手势
  function checkPinch(pts) {
    const thumbTip = pts[4];
    const indexTip = pts[8];
    const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    return dist < 0.06 &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17);
  }

  // 检查手掌朝下手势
  function checkPalmDown(pts) {
    return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerUp(pts, 12, 10, 9, scoreThreshold) &&
      isFingerUp(pts, 16, 14, 13, scoreThreshold) &&
      isFingerUp(pts, 20, 18, 17, scoreThreshold) &&
      palmDirection(pts) === 'down';
  }

  // 检查食指伸直手势
  function checkIndex(pts) {
    return isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17);
  }

  // 检查手枪手势
  function checkGun(pts) {
    return isThumbUp(pts) &&
      isFingerUp(pts, 8, 6, 5, scoreThreshold) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerDown(pts, 20, 18, 17);
  }

  // 检查电话手势
  function checkPhone(pts) {
    return isThumbUp(pts) &&
      isFingerDown(pts, 8, 6, 5) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerUp(pts, 20, 18, 17, scoreThreshold);
  }

  // 检查小指手势
  function checkPinky(pts) {
    return isFingerDown(pts, 8, 6, 5) &&
      isFingerDown(pts, 12, 10, 9) &&
      isFingerDown(pts, 16, 14, 13) &&
      isFingerUp(pts, 20, 18, 17, scoreThreshold);
  }

  /**
   * 检测手势
   * @param {Array} pts - 手部关键点数组
   * @returns {Object|null} 手势对象或 null
   */
  function detect(pts) {
    let raw = null;

    if (checkFist(pts)) raw = '子';
    else if (checkPalmDown(pts)) raw = '午';
    else if (checkGun(pts)) raw = '申';
    else if (checkPhone(pts)) raw = '酉';
    else if (checkPinky(pts)) raw = '戌';
    else if (checkOpen(pts)) raw = '丑';
    else if (checkScissor(pts)) raw = '寅';
    else if (checkTiger(pts)) raw = '卯';
    else if (checkRock(pts)) raw = '辰';
    else if (checkPinch(pts)) raw = '巳';
    else if (checkIndex(pts)) raw = '未';

    // 防抖处理
    gestureHistory.push(raw);
    if (gestureHistory.length > gestureFrames) {
      gestureHistory.shift();
    }

    if (gestureHistory.length >= gestureFrames) {
      const allSame = gestureHistory.every(g => g === raw);
      if (allSame && raw !== null) {
        if (raw !== stableGesture) {
          stableGesture = raw;
          return SEAL_NAMES[raw];
        }
        return null;
      }
    }

    if (raw === null) stableGesture = null;
    return null;
  }

  /**
   * 重置检测器状态
   */
  function reset() {
    gestureHistory.length = 0;
    stableGesture = null;
  }

  /**
   * 获取当前手势历史
   */
  function getHistory() {
    return [...gestureHistory];
  }

  /**
   * 获取稳定手势
   */
  function getStableGesture() {
    return stableGesture;
  }

  return {
    detect,
    reset,
    getHistory,
    getStableGesture,
    // 暴露检测函数用于测试
    checkFist,
    checkOpen,
    checkScissor,
    checkRock,
    checkTiger,
    checkPinch,
    checkPalmDown,
    checkIndex,
    checkGun,
    checkPhone,
    checkPinky,
  };
}

/**
 * 获取结印名称
 */
export function getSealName(seal) {
  return SEAL_NAMES[seal] || null;
}

/**
 * 获取所有结印名称
 */
export function getAllSealNames() {
  return { ...SEAL_NAMES };
}
