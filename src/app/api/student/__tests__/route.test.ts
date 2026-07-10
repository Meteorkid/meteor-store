import { describe, it, expect } from 'vitest';
import { isEduEmail } from '../route';

describe('isEduEmail', () => {
  it('accepts .edu emails', () => {
    expect(isEduEmail('student@mit.edu')).toBe(true);
  });

  it('accepts .edu.cn emails', () => {
    expect(isEduEmail('user@pku.edu.cn')).toBe(true);
  });

  it('accepts .ac.uk emails', () => {
    expect(isEduEmail('user@ox.ac.uk')).toBe(true);
  });

  it('accepts .ac.jp emails', () => {
    expect(isEduEmail('user@u-tokyo.ac.jp')).toBe(true);
  });

  it('accepts .edu.au emails', () => {
    expect(isEduEmail('user@unsw.edu.au')).toBe(true);
  });

  it('accepts .edu.sg emails', () => {
    expect(isEduEmail('user@nus.edu.sg')).toBe(true);
  });

  it('accepts .ac.kr emails', () => {
    expect(isEduEmail('user@snu.ac.kr')).toBe(true);
  });

  it('rejects gmail', () => {
    expect(isEduEmail('user@gmail.com')).toBe(false);
  });

  it('rejects outlook', () => {
    expect(isEduEmail('user@outlook.com')).toBe(false);
  });

  it('rejects corporate emails', () => {
    expect(isEduEmail('user@company.com')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isEduEmail('User@PKU.EDU.CN')).toBe(true);
  });

  it('trims whitespace', () => {
    expect(isEduEmail('  user@mit.edu  ')).toBe(true);
  });

  it('rejects domains that merely contain edu', () => {
    expect(isEduEmail('user@education-platform.com')).toBe(false);
  });
});
