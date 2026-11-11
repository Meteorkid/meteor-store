import { describe, expect, it } from 'vitest';
import { CAMERA_LIMITS, createSkyCamera, createSkyDirection, createSkyProjector, normalizeCameraYaw } from '../camera';

describe('星空相机', () => {
  it('观察者位于天幕中心，零角度只对中心保留屏幕方向', () => {
    const project = createSkyProjector(1280, 720, { yaw: 0, pitch: 0 });
    for (const depth of [0, .2, .6, 1]) {
      const direction = createSkyDirection(640, 360, 1280, 720);
      const point = project(direction.x, direction.y, direction.z, depth);
      expect(point.x).toBe(640);
      expect(point.y).toBe(360);
      expect(point.visible).toBe(true);
      expect(point.scale).toBeGreaterThan(.9);
      expect(point.scale).toBeLessThan(1.1);
    }
  });

  it('水平转到任意经度都会看向对应天幕，背后的星点被剔除', () => {
    const targetX = 800;
    const targetYaw = (targetX - 640) * (Math.PI * 2) / 1280;
    const direction = createSkyDirection(targetX, 360, 1280, 720);
    const edge = createSkyProjector(1280, 720, { yaw: 0, pitch: 0 })(direction.x, direction.y, direction.z, .5);
    expect(edge.visible).toBe(true);
    expect(edge.x).toBeCloseTo(1280, 6);

    const centered = createSkyProjector(1280, 720, { yaw: targetYaw, pitch: 0 })(direction.x, direction.y, direction.z, .5);
    expect(centered.visible).toBe(true);
    expect(centered.x).toBeCloseTo(640, 6);
    expect(centered.y).toBeCloseTo(360, 6);

    const behindDirection = createSkyDirection(0, 360, 1280, 720);
    const behind = createSkyProjector(1280, 720, { yaw: 0, pitch: 0 })(behindDirection.x, behindDirection.y, behindDirection.z, .5);
    expect(behind.visible).toBe(false);
  });

  it('抬头和低头会按球面透视看到不同纬度，而不是整张图平移', () => {
    const high = createSkyDirection(640, 300, 1280, 720);
    const cameraUp = createSkyProjector(1280, 720, { yaw: 0, pitch: .32 })(high.x, high.y, high.z, .5);
    const cameraLevel = createSkyProjector(1280, 720, { yaw: 0, pitch: 0 })(high.x, high.y, high.z, .5);
    expect(cameraUp.visible).toBe(true);
    expect(cameraLevel.visible).toBe(true);
    expect(cameraUp.y).not.toBeCloseTo(cameraLevel.y, 2);
    expect(cameraUp.scale).not.toBeCloseTo(cameraLevel.scale, 2);
  });

  it('跟随采用阻尼，离开后归位并停止额外帧；暂停也允许手动查看', () => {
    const camera = createSkyCamera({ interactionMode: 'follow', autoRotate: false });
    camera.follow(1, -1);
    const first = camera.tick(1 / 60, false);
    expect(first.yaw).toBeGreaterThan(0);
    expect(first.yaw).toBeLessThan(Math.PI);
    for (let i = 0; i < 100; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: Math.PI, pitch: Math.PI * .28 });
    camera.leave();
    for (let i = 0; i < 100; i++) camera.tick(1 / 60, false);
    expect(camera.getPose()).toEqual({ yaw: 0, pitch: 0 });
    expect(camera.isMoving(false)).toBe(false);
  });

  it('拖拽释放后有有限惯性，水平可绕整圈且俯仰不突破安全上限', () => {
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
    const pose = camera.getPose();
    expect(Math.abs(pose.yaw)).toBeLessThanOrEqual(Math.PI);
    expect(pose.pitch).toBe(CAMERA_LIMITS.pitch);
  });

  it('水平一整圈回到同一朝向，角度归一化不会中断环绕', () => {
    const camera = createSkyCamera({ interactionMode: 'drag', autoRotate: false });
    camera.beginDrag();
    const fullTurn = (Math.PI * 2) / (Math.PI * .9);
    camera.dragBy(fullTurn, 0, 1 / 60);
    camera.endDrag(false);
    for (let i = 0; i < 120; i++) camera.tick(1 / 60, false);
    expect(camera.getPose().yaw).toBeCloseTo(0, 6);
    expect(normalizeCameraYaw(Math.PI * 4 + .2)).toBeCloseTo(.2, 10);
  });

  it('跨越正负180度时沿原方向继续环绕，不倒转走最短路径', () => {
    const camera = createSkyCamera({ interactionMode: 'drag', autoRotate: false });
    camera.beginDrag();
    camera.dragBy(.5, 0, 1 / 60);
    for (let i = 0; i < 60; i++) camera.tick(1 / 60, false);
    camera.dragBy(.5, 0, 1 / 60);
    for (let i = 0; i < 60; i++) camera.tick(1 / 60, false);
    const beforeWrap = camera.getPose().yaw;
    camera.dragBy(.25, 0, 1 / 60);
    camera.tick(1 / 240, false);
    expect(camera.getPose().yaw).toBeLessThan(beforeWrap);
    camera.endDrag(false);
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
