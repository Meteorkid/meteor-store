import { describe, expect, it } from 'vitest';
import { CAMERA_LIMITS, createSkyCamera, createSkyProjector } from '../camera';

describe('星空相机', () => {
  it('零角度精确保留已有屏幕坐标和尺寸', () => {
    const project = createSkyProjector(1280, 720, { yaw: 0, pitch: 0 });
    for (const depth of [0, .2, .6, 1]) {
      expect(project(37.2, 511.7, depth)).toEqual({ x: 37.2, y: 511.7, scale: 1 });
    }
  });

  it('同一屏幕方向的远近点有不同视差，有限转角下边缘投影保持有限', () => {
    const project = createSkyProjector(1280, 720, { yaw: .20, pitch: .10 });
    const far = project(640, 360, 0);
    const near = project(640, 360, 1);
    expect(far.x).toBeGreaterThan(640);
    expect(near.x).toBeLessThan(640);
    expect(far.y).toBeLessThan(360);
    expect(near.y).toBeGreaterThan(360);
    for (const yaw of [-CAMERA_LIMITS.yaw, CAMERA_LIMITS.yaw]) {
      for (const pitch of [-CAMERA_LIMITS.pitch, CAMERA_LIMITS.pitch]) {
        const edgeProject = createSkyProjector(1280, 720, { yaw, pitch });
        for (const depth of [0, 1]) {
          for (const [x, y] of [[0, 0], [1280, 0], [0, 720], [1280, 720]]) {
            const point = edgeProject(x, y, depth);
            expect(Number.isFinite(point.x) && Number.isFinite(point.y)).toBe(true);
            expect(point.scale).toBeGreaterThan(.65);
            expect(point.scale).toBeLessThan(1.6);
          }
        }
      }
    }
  });

  it('跟随采用阻尼，离开后归位并停止额外帧；暂停也允许手动查看', () => {
    const camera = createSkyCamera({ interactionMode: 'follow', autoRotate: false });
    camera.follow(1, -1);
    const first = camera.tick(1 / 60, false);
    expect(first.yaw).toBeGreaterThan(0);
    expect(first.yaw).toBeLessThan(.12);
    for (let i = 0; i < 100; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: .12, pitch: .08 });
    camera.leave();
    for (let i = 0; i < 100; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: 0, pitch: 0 });
    expect(camera.isMoving(false)).toBe(false);
  });

  it('拖拽释放后有有限惯性，越界输入不突破转角上限', () => {
    const camera = createSkyCamera({ interactionMode: 'drag', autoRotate: false });
    camera.beginDrag();
    camera.dragBy(.025, -.02, 1 / 60);
    camera.tick(1 / 60, false);
    const releasedYaw = camera.getPose().yaw;
    camera.endDrag();
    for (let i = 0; i < 180; i++) camera.tick(1 / 60, false);
    expect(camera.getPose().yaw).toBeLessThan(releasedYaw);
    expect(camera.isMoving(false)).toBe(false);
    camera.beginDrag();
    camera.dragBy(100, 100, 0);
    camera.endDrag(false);
    for (let i = 0; i < 180; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: -CAMERA_LIMITS.yaw, pitch: CAMERA_LIMITS.pitch });
  });

  it('暂停冻结自转角度，关闭和复位不会重新开启自动旋转', () => {
    const camera = createSkyCamera({ interactionMode: 'off', autoRotate: true });
    for (let i = 0; i < 60; i++) camera.tick(1 / 60, true);
    const spinning = camera.getPose();
    expect(spinning.yaw).not.toBe(0);
    for (let i = 0; i < 60; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual(spinning);
    expect(camera.isMoving(false)).toBe(false);
    camera.setOptions({ interactionMode: 'off', autoRotate: false });
    expect(camera.getPose()).toEqual(spinning);
    camera.reset();
    for (let i = 0; i < 120; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: 0, pitch: 0 });
    expect(camera.isMoving(true)).toBe(false);
  });
});
