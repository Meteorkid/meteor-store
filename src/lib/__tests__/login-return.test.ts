import { describe, expect, it } from 'vitest';
import { normalizeLoginReturn } from '../login-return';

describe('normalizeLoginReturn', () => {
  it('只允许返回 Ex-Memory 体验页', () => {
    expect(normalizeLoginReturn('/apps/ex-memory')).toBe('/apps/ex-memory');
    expect(normalizeLoginReturn('https://evil.example')).toBe('/');
    expect(normalizeLoginReturn('//evil.example')).toBe('/');
    expect(normalizeLoginReturn('/products/ex-memory')).toBe('/');
    expect(normalizeLoginReturn(null)).toBe('/');
  });
});
