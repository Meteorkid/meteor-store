import { describe, it, expect } from 'vitest';
import { findProduct, findPrice } from '../products';

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

describe('findPrice', () => {
  it('returns price for valid product and tier', () => {
    const price = findPrice('omnicrawl', 'Pro');
    expect(price).toBe(79);
  });

  it('is case-insensitive for tier name', () => {
    const price = findPrice('omnicrawl', 'pro');
    expect(price).toBe(79);
  });

  it('returns undefined for non-existent tier', () => {
    expect(findPrice('omnicrawl', 'Nonexistent')).toBeUndefined();
  });

  it('returns undefined for non-existent product', () => {
    expect(findPrice('nonexistent', 'Pro')).toBeUndefined();
  });

  it('returns 0 for free tier', () => {
    const price = findPrice('statux', 'Free');
    expect(price).toBe(0);
  });

  it('returns correct price for each tier', () => {
    expect(findPrice('omnicrawl', 'Starter')).toBe(29);
    expect(findPrice('omnicrawl', 'Pro')).toBe(79);
    expect(findPrice('omnicrawl', 'Enterprise')).toBe(199);
  });
});
