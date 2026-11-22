import { describe, expect, it } from 'vitest';
import { MathUtils, Vector3 } from 'orbit-three';
import { interpolateOrbitPose, rotateOrbitPose } from '../orbit-camera';

describe('行星轨道镜头', () => {
  const angles = { azimuth: MathUtils.degToRad(35), elevation: MathUtils.degToRad(20) };
  const overview = { ...angles, target: new Vector3(0, 0, 0), distance: 105 };
  const planet = { ...angles, target: new Vector3(20, 0, -12), distance: 14 };

  it('平滑飞向选中目标并停在精确的焦点和距离', () => {
    const view = { ...overview, target: new Vector3() };
    interpolateOrbitPose(overview, planet, .15, view);
    expect(view.target.x).toBeGreaterThan(0);
    expect(view.distance).toBeCloseTo(105);
    interpolateOrbitPose(overview, planet, .55, view);
    expect(view.distance).toBeGreaterThan(14);
    expect(view.distance).toBeLessThan(105);
    interpolateOrbitPose(overview, planet, 1, view);
    expect(view.target.toArray()).toEqual(planet.target.toArray());
    expect(view.distance).toBeCloseTo(planet.distance);
  });

  it('中途改选时从此刻的画面出发，远距离切换先稍微拉远', () => {
    const view = { ...overview, target: new Vector3() };
    interpolateOrbitPose(overview, planet, .6, view);
    const current = { ...view, target: view.target.clone() };
    const farAway = { ...angles, target: new Vector3(-40, 0, 32), distance: 24 };
    interpolateOrbitPose(current, farAway, 0, view);
    expect(view.target.toArray()).toEqual(current.target.toArray());
    expect(view.distance).toBeCloseTo(current.distance);
    interpolateOrbitPose(current, farAway, .2, view);
    expect(view.distance).toBeGreaterThan(current.distance);
  });

  it('拖动围绕当前目标旋转，俯仰角达到边界时不会翻转', () => {
    const view = { ...planet, azimuth: 0 };
    rotateOrbitPose(view, 100, 100, 400);
    expect(MathUtils.radToDeg(view.azimuth)).toBeCloseTo(270);
    expect(MathUtils.radToDeg(view.elevation)).toBeCloseTo(80);
    expect(view.target).toBe(planet.target);
    expect(view.distance).toBe(planet.distance);
    rotateOrbitPose(view, 0, -400, 400);
    expect(MathUtils.radToDeg(view.elevation)).toBeCloseTo(-80);
  });

  it('跨过 0° 返回全景时走最短角度', () => {
    const from = { ...overview, azimuth: MathUtils.degToRad(350), elevation: MathUtils.degToRad(-20) };
    const to = { ...overview, azimuth: MathUtils.degToRad(10) };
    const view = { ...overview, target: new Vector3() };
    interpolateOrbitPose(from, to, .5, view);
    expect(MathUtils.radToDeg(view.azimuth)).toBeCloseTo(360);
    expect(view.elevation).toBeCloseTo(0);
  });
});
