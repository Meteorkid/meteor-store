import { describe, expect, it } from 'vitest';
import { orbitProductGroups } from '../orbit-products';
import { products } from '../products';

describe('太阳系产品分组', () => {
  it('八颗行星按从太阳向外的顺序排列，并保留中英文原名', () => {
    expect(orbitProductGroups.map(planet => planet.name.en)).toEqual([
      'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune',
    ]);
    expect(orbitProductGroups.map(planet => planet.name.zh)).toEqual([
      '水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星',
    ]);
  });

  it('商城目录的每一款产品恰好关联一颗行星', () => {
    const assigned = orbitProductGroups.flatMap(planet => [...planet.productIds]);
    expect(assigned.slice().sort()).toEqual(products.map(product => product.id).sort());
  });
});
