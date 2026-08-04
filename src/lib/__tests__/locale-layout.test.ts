import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const source = readFileSync(join(process.cwd(), 'src/app/[locale]/layout.tsx'), 'utf8');

describe('locale 布局的 404 边界', () => {
  it('使用 Next.js notFound，并在读取翻译前验证 locale', () => {
    expect(source).toMatch(/import \{ notFound \} from ["']next\/navigation["']/);
    expect(source).not.toMatch(/function notFound\s*\(/);

    const metadataGuard = source.indexOf('if (!routing.locales.includes(locale as Locale))');
    const metadataTranslations = source.indexOf('getTranslations({ locale, namespace: "HomePage" })');
    expect(metadataGuard).toBeGreaterThan(-1);
    expect(metadataGuard).toBeLessThan(metadataTranslations);
  });
});
