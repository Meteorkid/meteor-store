import { describe, it, expect } from 'vitest';
import { findProduct } from '../products';

describe('findProduct', () => {
  it('returns product by id', () => {
    const product = findProduct('omnicrawl');
    expect(product).toBeDefined();
    expect(product?.name).toBe('OmniCrawl');
  });

  it('returns undefined for non-existent id', () => {
    expect(findProduct('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(findProduct('')).toBeUndefined();
  });
});
