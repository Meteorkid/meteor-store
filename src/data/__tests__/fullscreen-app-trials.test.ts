import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const productPage = readFileSync(
  resolve(process.cwd(), 'src/app/[locale]/products/[id]/page.tsx'),
  'utf8',
);

describe('站内应用全屏体验入口', () => {
  it('产品页不再内嵌应用 iframe', () => {
    expect(productPage).not.toContain("import ProductAppTrial");
    expect(productPage).not.toContain('<ProductAppTrial');
  });

  it('在线体验入口在隔离的新窗口打开', () => {
    const start = productPage.indexOf('{trialHref && (');
    const end = productPage.indexOf('</Link>', start);
    const trialLink = productPage.slice(start, end);

    expect(start).toBeGreaterThan(-1);
    expect(trialLink).toContain('target="_blank"');
    expect(trialLink).toContain('rel="noopener noreferrer"');
  });
});
