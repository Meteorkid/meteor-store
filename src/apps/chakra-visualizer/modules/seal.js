// @ts-nocheck
/* eslint-disable */
/**
 * 结印系统模块
 * 处理结印检测、连招匹配、大招释放
 */

// roundRect polyfill（旧版 Safari/WebView 可能不支持）
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radii = typeof r === 'number' ? [r, r, r, r] : r;
    const [tl, tr, br, bl] = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
  };
}

// 大招结印序列定义
export const ULT_SEQUENCES = {
  'rasenshuriken': ['子','丑','寅','卯'],  // 4印
  'susano':        ['子','未','巳','午'],  // 4印
  'amaterasu':     ['子','丑','午','未'],  // 4印
  'tsukuyomi':     ['子','午','未'],        // 3印
  'rasengan-big':  ['丑','巳'],            // 2印
  'bijuu-dama':    ['卯','卯'],            // 2印（竖拇指×2）
  'kirin':         ['寅','未'],            // 2印
  'totsuka':       ['巳','卯'],            // 2印
  'byakugou':      ['丑','辰'],            // 2印
  'sakura-impact': ['子','寅'],            // 2印
  'sand-coffin':   ['午','子'],            // 2印
  'sand-shield':   ['丑','未'],            // 2印
  'shinra':        ['午','未'],            // 2印
};

// 预计算最短序列长度（避免每帧重复计算）
const MIN_SEQ_LENGTH = Math.min(...Object.values(ULT_SEQUENCES).map(s => s.length));

// 大招名称映射
const ULT_NAMES = {
  'rasenshuriken': '风遁·螺旋手里剑',
  'susano': '须佐能乎',
  'amaterasu': '天照',
  'tsukuyomi': '月读',
  'rasengan-big': '大玉螺旋',
  'bijuu-dama': '尾兽玉',
  'kirin': '麒麟',
  'totsuka': '十拳剑',
  'byakugou': '百豪之术',
  'sakura-impact': '樱花冲击',
  'sand-coffin': '砂柩柩',
  'sand-shield': '砂瀑送葬',
  'shinra': '神罗天征',
};

const ULT_NAMES_EN = {
  'rasenshuriken': 'Rasenshuriken',
  'susano': 'Susanoo',
  'amaterasu': 'Amaterasu',
  'tsukuyomi': 'Tsukuyomi',
  'rasengan-big': 'Super Great Rasengan',
  'bijuu-dama': 'Tailed Beast Ball',
  'kirin': 'Kirin',
  'totsuka': 'Totsuka Blade',
  'byakugou': 'Byakugou Seal',
  'sakura-impact': 'Cherry Blossom Impact',
  'sand-coffin': 'Sand Coffin',
  'sand-shield': 'Shukaku Shield',
  'shinra': 'Shinra Tensei',
};

/**
 * 创建结印系统实例
 * @param {Object} config - 配置对象
 * @param {number} config.sealTimeout - 结印超时时间（毫秒）
 * @param {number} config.comboMaxLength - 连招缓冲区最大长度
 * @param {Function} config.onSealSuccess - 结印成功回调
 * @param {Function} config.onSealInterrupted - 结印中断回调
 * @returns {Object} 结印系统对象
 */
function createSealSystem(config = {}) {
  const {
    sealTimeout = 3000,
    comboMaxLength = 6,
    onSealSuccess = () => {},
    onSealInterrupted = () => {},
    ultDuration: configUltDuration = 3000,
    ultCooldown: configUltCooldown = 8000,
  } = config;

  // 内部状态
  let lastGestureTime = 0;
  let comboBuffer = [];
  let comboDisplay = [];
  let filterUlt = null; // 指定忍术 ID，null 为自由模式

  // 大招状态
  let ultActive = null;
  let ultCooldownEnd = 0;
  let ultTimer = 0;
  let ultPos = { x: 0, y: 0 };
  let ultDuration = configUltDuration;
  let ultCooldownDuration = configUltCooldown;

  /**
   * 检查缓冲区是否匹配任何大招序列
   * @param {Array} buffer - 结印缓冲区
   * @returns {string|null} 匹配的大招名称，无匹配返回 null
   */
  function checkComboMatch(buffer) {
    const sequences = filterUlt
      ? { [filterUlt]: ULT_SEQUENCES[filterUlt] }
      : ULT_SEQUENCES;

    for (const [ultName, seq] of Object.entries(sequences)) {
      if (!seq) continue;
      const bufSlice = buffer.slice(-seq.length);
      if (
        bufSlice.length === seq.length &&
        bufSlice.every((s, i) => s.seal === seq[i])
      ) {
        return ultName;
      }
    }
    return null;
  }

  /**
   * 设置指定忍术过滤器
   * @param {string|null} ultId - 忍术 ID，null 为自由模式
   */
  function setFilterUlt(ultId) {
    filterUlt = ultId;
  }

  /**
   * 推入结印并检查匹配
   * @param {Object} sealObj - 结印对象 { seal: string, ... }
   * @returns {string|null} 匹配的大招名称，无匹配返回 null
   */
  function pushSeal(sealObj) {
    const now = Date.now();

    // 检查是否超时
    if (now - lastGestureTime > sealTimeout) {
      if (comboBuffer.length > 0) {
        onSealInterrupted();
      }
      comboBuffer = [];
      comboDisplay = [];
    }

    lastGestureTime = now;

    // 去重：连续相同地支在 500ms 内不重复推入，超过时间则视为新输入
    const lastSeal = comboBuffer[comboBuffer.length - 1];
    const timeSinceLastSeal = lastSeal ? now - lastSeal.timestamp : Infinity;
    if (
      comboBuffer.length > 0 &&
      lastSeal.seal === sealObj.seal &&
      timeSinceLastSeal < 500
    ) {
      return null;
    }

    // 添加时间戳用于去重判断
    comboBuffer.push({ ...sealObj, timestamp: now });
    onSealSuccess();

    // 保持缓冲区在最大长度内
    if (comboBuffer.length > comboMaxLength) {
      comboBuffer.shift();
    }

    // 快照必须在 shift 之后，确保与 comboBuffer 同步
    comboDisplay = [...comboBuffer];

    return checkComboMatch(comboBuffer);
  }

  /**
   * 获取当前连招缓冲区
   * @returns {Array} 结印缓冲区副本
   */
  function getComboBuffer() {
    return [...comboBuffer];
  }

  /**
   * 获取当前显示缓冲区
   * @returns {Array} 显示缓冲区副本
   */
  function getComboDisplay() {
    return [...comboDisplay];
  }

  /**
   * 清空缓冲区
   */
  function clearBuffer() {
    comboBuffer = [];
    comboDisplay = [];
  }

  /**
   * 获取所有大招序列定义
   * @returns {Object} 大招序列映射
   */
  function getUltSequences() {
    return { ...ULT_SEQUENCES };
  }

  /**
   * 获取大招名称
   * @param {string} ultName - 大招英文名
   * @param {string} lang - 语言代码 'zh' 或 'en'
   * @returns {string} 大招名称
   */
  function getUltName(ultName, lang = 'zh') {
    const names = lang === 'en' ? ULT_NAMES_EN : ULT_NAMES;
    return names[ultName] || ultName;
  }

  /**
   * 启动大招
   * @param {string} ultType - 大招类型
   * @param {number} x - 屏幕 X 坐标
   * @param {number} y - 屏幕 Y 坐标
   */
  function startUlt(ultType, x, y) {
    ultActive = ultType;
    ultTimer = Date.now() + ultDuration;
    ultCooldownEnd = Date.now() + ultCooldownDuration;
    ultPos = { x, y };
    comboBuffer = [];
    comboDisplay = [];
  }

  /**
   * 获取大招信息
   * @param {number} now - 当前时间戳
   * @returns {Object|null} 大招信息 { type, x, y, progress } 或 null
   */
  function getUltInfo(now) {
    if (ultCooldownEnd <= now) ultCooldownEnd = 0;

    if (ultTimer > now && ultActive) {
      const elapsed = (now - (ultTimer - ultDuration)) / ultDuration;
      const progress = Math.min(1, elapsed);
      return {
        type: ultActive,
        x: ultPos.x,
        y: ultPos.y,
        progress,
      };
    } else {
      ultActive = null;
      return null;
    }
  }

  /**
   * 重置结印系统状态
   */
  function reset() {
    comboBuffer = [];
    comboDisplay = [];
    lastGestureTime = 0;
  }

  /**
   * 绘制结印显示
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   * @param {number} now - 当前时间戳（用于闪烁动画）
   * @param {Object} sealNames - 结印名称映射 { seal: { emoji, gesture } }
   * @param {string|null} targetUlt - 指定的大招 ID（只显示该大招的序列），null 为自由模式
   * @param {string} lang - 语言代码 'zh' 或 'en'
   */
  function drawSealDisplay(ctx, width, height, now = Date.now(), sealNames = {}, targetUlt = null, lang = 'zh') {
    const isZh = lang === 'zh';
    const gn = (info) => info ? (isZh ? info.gesture : (info.gestureEn || info.gesture)) : '';
    ctx.save();
    ctx.textAlign = 'center';

    const bufLen = comboDisplay.length;

    // 确定目标序列
    let targetSeq = null;
    let targetName = '';

    if (targetUlt && ULT_SEQUENCES[targetUlt]) {
      // 指定忍术模式：只显示该忍术的序列
      targetSeq = ULT_SEQUENCES[targetUlt];
      const names = isZh ? ULT_NAMES : ULT_NAMES_EN;
      targetName = names[targetUlt] || targetUlt;
    } else {
      // 自由模式：根据已输入的结印匹配最短序列
      const possibleSequences = Object.entries(ULT_SEQUENCES);
      if (bufLen > 0) {
        const matching = possibleSequences.filter(([, seq]) => {
          return seq.slice(0, bufLen).every((seal, i) => seal === comboDisplay[i]?.seal);
        });
        if (matching.length > 0) {
          matching.sort((a, b) => a[1].length - b[1].length);
          targetSeq = matching[0][1];
          const names = isZh ? ULT_NAMES : ULT_NAMES_EN;
          targetName = names[matching[0][0]] || matching[0][0];
        }
      }
      if (!targetSeq) {
        const sorted = [...possibleSequences].sort((a, b) => a[1].length - b[1].length);
        targetSeq = sorted[0][1];
        const names = isZh ? ULT_NAMES : ULT_NAMES_EN;
        targetName = names[sorted[0][0]] || sorted[0][0];
      }
    }

    const targetLen = targetSeq.length;

    // 无输入且无指定忍术时不显示
    if (bufLen === 0 && !targetUlt) {
      ctx.restore();
      return;
    }

    const slotW = 100;
    const totalW = targetLen * slotW;
    const startX = width / 2 - totalW / 2;
    const panelY = height - 160;
    const panelH = 130;

    // ═══ 深色面板背景 ═══
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath();
    ctx.roundRect(startX - 30, panelY - 10, totalW + 60, panelH + 36, 16);
    ctx.fill();
    // 面板边框
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ═══ 进度条（面板顶部） ═══
    const barX = startX;
    const barY = panelY + 6;
    const barTotalW = totalW;
    // 未完成段
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barTotalW, 5, 2.5);
    ctx.fill();
    // 已完成段
    if (bufLen > 0) {
      const doneW = Math.min(bufLen, targetLen) / targetLen * barTotalW;
      ctx.fillStyle = 'rgba(34,197,94,0.85)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, doneW, 5, 2.5);
      ctx.fill();
    }
    // 进度文字
    ctx.font = 'bold 14px "Rajdhani", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`${bufLen} / ${targetLen}`, width / 2, barY - 2);

    // ═══ 闪烁脉动值（用于当前待操作结印） ═══
    const pulse = (Math.sin(now / 200) + 1) / 2; // 0~1，~1.26s 周期

    // ═══ 绘制每个槽位 ═══
    const slotY = panelY + 42;
    const slotR = 22; // 槽位圆形半径

    for (let i = 0; i < targetLen; i++) {
      const cx = startX + i * slotW + slotW / 2;
      const isCompleted = i < bufLen;
      const isCurrent = i === bufLen; // 当前应该操作的结印

      if (isCompleted) {
        // ─── 已完成：绿色高亮 ───
        const item = comboDisplay[i];

        // 绿色圆形背景
        ctx.beginPath();
        ctx.arc(cx, slotY, slotR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,197,94,0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.9)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Emoji
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(item.emoji, cx, slotY - 3);

        // 结印字
        ctx.font = 'bold 12px "Rajdhani", sans-serif';
        ctx.fillStyle = 'rgba(34,197,94,1)';
        ctx.fillText(item.seal, cx, slotY + 14);

        // 手势名（圆形外下方）
        ctx.font = '10px "Rajdhani", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(gn(item), cx, slotY + slotR + 14);

        // ✓ 完成标记（圆形内右下角）
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = 'rgba(34,197,94,1)';
        ctx.fillText('✓', cx + slotR - 4, slotY + slotR - 2);

      } else if (isCurrent) {
        // ─── 当前待操作：闪烁动画指示灯 ───
        const nextSeal = targetSeq[i];
        const nextInfo = sealNames[nextSeal] || { emoji: '?', gesture: nextSeal };

        // 外圈脉动光环（缩小半径避免侵入箭头区域）
        const glowAlpha = 0.3 + pulse * 0.5;
        const glowRadius = slotR + 3 + pulse * 3;
        ctx.beginPath();
        ctx.arc(cx, slotY, glowRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,165,0,${glowAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 内圈背景
        const innerAlpha = 0.15 + pulse * 0.2;
        ctx.beginPath();
        ctx.arc(cx, slotY, slotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,165,0,${innerAlpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,165,0,${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Emoji（脉动透明度）
        ctx.font = '20px sans-serif';
        ctx.fillStyle = `rgba(255,255,255,${0.6 + pulse * 0.4})`;
        ctx.fillText(nextInfo.emoji, cx, slotY - 3);

        // 结印字
        ctx.font = 'bold 12px "Rajdhani", sans-serif';
        ctx.fillStyle = `rgba(255,165,0,${0.7 + pulse * 0.3})`;
        ctx.fillText(nextSeal, cx, slotY + 14);

        // 手势名（圆形外下方）
        ctx.font = '10px "Rajdhani", sans-serif';
        ctx.fillStyle = `rgba(255,255,255,${0.5 + pulse * 0.4})`;
        ctx.fillText(gn(nextInfo), cx, slotY + slotR + 14);

        // "下一步" 标签
        ctx.font = 'bold 9px "Rajdhani", sans-serif';
        ctx.fillStyle = `rgba(255,165,0,${0.6 + pulse * 0.4})`;
        ctx.fillText(isZh ? '▼ 下一步' : '▼ NEXT', cx, slotY + slotR + 26);

      } else {
        // ─── 未来步骤：灰色占位 ───
        ctx.beginPath();
        ctx.arc(cx, slotY, slotR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 序号
        ctx.font = 'bold 14px "Rajdhani", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillText(`${i + 1}`, cx, slotY + 2);
      }

      // ═══ 步骤之间的箭头 ═══
      if (i < targetLen - 1) {
        const arrowX = cx + slotW / 2;
        const arrowAlpha = isCompleted ? 0.6 : 0.2;
        ctx.font = '13px sans-serif';
        ctx.fillStyle = `rgba(255,255,255,${arrowAlpha})`;
        ctx.fillText('→', arrowX, slotY);
      }
    }

    // ═══ 忍术名称标题 ═══
    if (targetName) {
      const titleY = panelY - 22;
      ctx.font = 'bold 16px "Rajdhani", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(`🔮 ${targetName}`, width / 2, titleY);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    // ═══ 底部提示文字 ═══
    const hintY = panelY + panelH + 18;
    ctx.font = '14px "Rajdhani", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    if (bufLen === 0) {
      if (targetUlt) {
        const firstSeal = targetSeq[0];
        const firstInfo = sealNames[firstSeal] || { gesture: firstSeal };
        ctx.fillText(isZh ? `开始结印：${gn(firstInfo)}（${firstSeal}）` : `Start: ${gn(firstInfo)} (${firstSeal})`, width / 2, hintY);
      } else {
        ctx.fillText(isZh ? '按顺序做出手势结印，释放大招！' : 'Perform seals in order to release ult!', width / 2, hintY);
      }
    } else if (bufLen < targetLen) {
      const nextSeal = targetSeq[bufLen];
      const nextInfo = sealNames[nextSeal] || { gesture: nextSeal };
      ctx.fillText(isZh ? `下一个：${gn(nextInfo)}（${nextSeal}）` : `Next: ${gn(nextInfo)} (${nextSeal})`, width / 2, hintY);
    } else if (bufLen === targetLen) {
      ctx.fillStyle = 'rgba(34,197,94,0.95)';
      ctx.fillText(isZh ? '✅ 结印完成！大招释放！' : '✅ Seals complete! Ult released!', width / 2, hintY);
    }

    ctx.restore();
  }

  return {
    pushSeal,
    checkComboMatch,
    getComboBuffer,
    getComboDisplay,
    clearBuffer,
    getUltSequences,
    getUltName,
    setFilterUlt,
    startUlt,
    getUltInfo,
    reset,
    drawSealDisplay,
    // 状态访问器
    get ultActive() { return ultActive; },
    get ultCooldown() { return ultCooldownEnd; },
  };
}

export {
  createSealSystem,
  ULT_NAMES,
};
