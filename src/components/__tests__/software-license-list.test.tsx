import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SoftwareLicenseList from '../SoftwareLicenseList';
import type { SoftwareLicenseCodeView } from '@/lib/software-licenses/types';

const codes: SoftwareLicenseCodeView[] = [
  { id: 'nook', sourceLicenseId: 'source', productId: 'xnook', productName: 'XNook', code: 'MS-NOOK', kind: 'monthly', expiresAt: '2026-11-26T10:00:00.000Z', status: 'active', createdAt: '2026-10-26T10:00:00.000Z' },
  { id: 'island', sourceLicenseId: 'source', productId: 'xisland', productName: 'XIsland', code: 'MS-ISLAND', kind: 'lifetime', expiresAt: null, status: 'revoked', createdAt: '2026-10-26T10:00:00.000Z' },
];

describe('按软件展示激活码', () => {
  it('同一订单展示两款软件、独立码、真实期限与撤销状态', () => {
    const html = renderToStaticMarkup(<SoftwareLicenseList licenses={codes} locale="zh" />);
    for (const text of ['XNook', 'XIsland', 'MS-NOOK', 'MS-ISLAND', '月度授权', '当前无有效授权期限', '已撤销', '2026', 'UTC+8']) expect(html).toContain(text);
    expect(html).not.toContain('永久有效');
  });

  it('英文展示与HTML转义不会把产品字段作为markup', () => {
    const html = renderToStaticMarkup(<SoftwareLicenseList licenses={[{ ...codes[0], productName: '<script>bad</script>', status: 'expired' }]} locale="en" />);
    expect(html).toContain('Monthly');
    expect(html).toContain('Expired');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});
