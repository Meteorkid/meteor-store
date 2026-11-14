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

describe('locale 布局的导航滚动', () => {
  it('声明平滑滚动，让 Next 在切页时临时禁用它并正确回到顶部', () => {
    expect(source).toMatch(/<html\b[^>]*data-scroll-behavior=["']smooth["']/);
  });
});
