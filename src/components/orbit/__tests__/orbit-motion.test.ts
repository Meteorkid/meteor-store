import { describe, expect, it } from 'vitest';
import { ORBIT_BODIES, ORBIT_SUN } from '../orbit-bodies';
import {
  DEFAULT_ORBIT_SPEED,
  orbitAngleRadians,
  orbitSpeedForSlider,
  orbitSpeedSliderPosition,
  orbitSpinDelta,
} from '../orbit-motion';

describe('行星轨道运动', () => {
  it('从暂停进入原版的对数速度刻度，默认速度可以往返转换', () => {
    expect(orbitSpeedForSlider(0)).toBe(0);
    expect(orbitSpeedForSlider(1)).toBe(0.1);
    expect(orbitSpeedForSlider(50.5)).toBe(10);
    expect(orbitSpeedForSlider(100)).toBe(1000);
    expect(orbitSpeedSliderPosition(0)).toBe(0);
    expect(orbitSpeedSliderPosition(0.1)).toBe(1);
    expect(orbitSpeedSliderPosition(1000)).toBe(100);
    expect(orbitSpeedForSlider(orbitSpeedSliderPosition(DEFAULT_ORBIT_SPEED))).toBeCloseTo(8);
  });

  it('按轨道周期前进，跨过零度或转完一圈后保持角度环绕', () => {
    expect(orbitAngleRadians(315, 22, 88)).toBeCloseTo(Math.PI / 4);
    expect(orbitAngleRadians(315, 22 + 88 * 1000, 88)).toBeCloseTo(Math.PI / 4);
    expect(orbitAngleRadians(45, -22, 88)).toBeCloseTo(7 * Math.PI / 4);
    expect(orbitAngleRadians(45, 300, 0)).toBeCloseTo(Math.PI / 4);
  });

  it('按正负周期自转并限制高速播放时的可视转速', () => {
    expect(orbitSpinDelta(ORBIT_SUN.rotationHours, 1, 0.5)).toBeCloseTo(0.04 * Math.PI);
    expect(orbitSpinDelta(23.9, 1000, 0.5)).toBeCloseTo(0.12 * Math.PI);
    expect(orbitSpinDelta(-17.2, 1000, 0.5)).toBeCloseTo(-0.12 * Math.PI);
    expect(orbitSpinDelta(-17.2, 0, 1)).toBe(0);
    expect(orbitSpinDelta(23.9, DEFAULT_ORBIT_SPEED, 0)).toBe(0);
  });

  it('保留原版八颗行星周期及两颗逆行行星', () => {
    expect(ORBIT_BODIES.map(({ id, orbitDays, rotationHours }) => [id, orbitDays, rotationHours])).toEqual([
      ['mercury', 88, 1407.6],
      ['venus', 224.7, -5832.5],
      ['earth', 365.2, 23.9],
      ['mars', 687, 24.6],
      ['jupiter', 4331, 9.9],
      ['saturn', 10747, 10.7],
      ['uranus', 30589, -17.2],
      ['neptune', 59800, 16.1],
    ]);
  });

  it('沿用 Opus 5.5 的初始相位、地球云层与土星环参数', () => {
    expect(ORBIT_BODIES.map(body => body.angle)).toEqual([200, 75, 310, 140, 30, 245, 110, 340]);
    expect(ORBIT_BODIES.find(body => body.id === 'earth')?.surface.clouds).toBe(true);
    expect(ORBIT_BODIES.find(body => body.id === 'saturn')?.rings).toEqual({
      inner: 1.24, outer: 2.27, gap: [1.95, 2.03], color: '#d9c9a3',
    });
  });
});
