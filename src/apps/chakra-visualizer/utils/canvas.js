// @ts-nocheck
/* eslint-disable */
/**
 * Canvas 工具函数
 * 从 Camera.jsx 提取的纯函数，便于测试和复用
 */

/**
 * 创建线性渐变
 */
export function createLinearGradient(ctx, x0, y0, x1, y1, colorStops) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  colorStops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
}

/**
 * 创建径向渐变
 */
export function createRadialGradient(ctx, x, y, r0, r1, colorStops) {
  const gradient = ctx.createRadialGradient(x, y, r0, x, y, r1);
  colorStops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
}

/**
 * 绘制圆形
 */
export function drawCircle(ctx, x, y, radius, fillStyle, strokeStyle, lineWidth = 1) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * 绘制矩形
 */
export function drawRect(ctx, x, y, width, height, fillStyle, strokeStyle, lineWidth = 1) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * 绘制圆角矩形
 */
export function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth = 1) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * 绘制文本
 */
export function drawText(ctx, text, x, y, options = {}) {
  const {
    font = '16px Arial',
    fillStyle = '#000',
    strokeStyle = null,
    lineWidth = 1,
    textAlign = 'center',
    textBaseline = 'middle',
  } = options;

  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
}

/**
 * 绘制线条
 */
export function drawLine(ctx, x1, y1, x2, y2, strokeStyle, lineWidth = 1, lineCap = 'round') {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.stroke();
}

/**
 * 绘制路径
 */
export function drawPath(ctx, points, strokeStyle, lineWidth = 1, closePath = false) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (closePath) {
    ctx.closePath();
  }

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/**
 * 绘制贝塞尔曲线
 */
export function drawBezierCurve(ctx, points, strokeStyle, lineWidth = 1) {
  if (points.length < 4) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/**
 * 清除画布
 */
export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

/**
 * 保存画布状态
 */
export function saveCanvasState(ctx) {
  ctx.save();
}

/**
 * 恢复画布状态
 */
export function restoreCanvasState(ctx) {
  ctx.restore();
}

/**
 * 应用变换
 */
export function applyTransform(ctx, transform) {
  ctx.save();
  ctx.translate(transform.x || 0, transform.y || 0);
  if (transform.rotation) {
    ctx.rotate(transform.rotation);
  }
  if (transform.scale) {
    ctx.scale(transform.scale, transform.scale);
  }
}

/**
 * 恢复变换
 */
export function restoreTransform(ctx) {
  ctx.restore();
}

/**
 * 绘制发光效果
 */
export function drawGlow(ctx, x, y, radius, color, intensity = 0.5) {
  const gradient = createRadialGradient(ctx, x, y, 0, radius, [
    [0, `${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`],
    [1, `${color}00`],
  ]);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 绘制粒子
 */
export function drawParticle(ctx, particle) {
  const alpha = particle.life;
  ctx.globalAlpha = alpha;

  if (particle.type === 'smoke') {
    const gradient = createRadialGradient(ctx, particle.x, particle.y, 0, particle.size, [
      [0, `rgba(200,200,200,${alpha * 0.3})`],
      [1, `rgba(200,200,200,0)`],
    ]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'aura') {
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'debris') {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation || 0);
    ctx.fillStyle = `rgba(100,100,100,${alpha})`;
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    ctx.restore();
  } else if (particle.type === 'sharingan') {
    ctx.fillStyle = `rgba(255,0,0,${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 默认粒子
    ctx.fillStyle = `${particle.color}${alpha})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
