import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ user: { id: 'buyer', email: 'buyer@example.test', emailVerified: true } as {id:string;email:string;emailVerified:boolean}|null }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: state.user, loading: false }) }));
vi.mock('../EasterEggs', () => ({ showToast: vi.fn() }));
vi.mock('next/image', () => ({ default: () => null }));
import PaymentModal from '../PaymentModal';
const render = (productId = 'xnook') => renderToStaticMarkup(<PaymentModal isOpen onClose={() => {}} productId={productId} productName="XNook" planId="pro" planName="永久" price={9} basePrice={9} />);
beforeEach(() => { state.user = { id: 'buyer', email: 'buyer@example.test', emailVerified: true }; });
describe('购买邮箱与已验证身份一致', () => {
  it('软件订单预填并锁定账户邮箱', () => {
    expect(render()).toMatch(/<input[^>]*readOnly=""[^>]*value="buyer@example.test"/i);
    expect(render()).toContain('accountEmailHint');
  });
  it('匿名/换号后的软件付款保持不可提交并解释验证要求', () => {
    state.user = null;
    expect(render()).toContain('verifiedAccountRequired');
    expect(render()).toMatch(/<button[^>]*disabled=""/);
  });
  it('其他产品保留原邮箱输入方式', () => {
    expect(render('omnicrawl')).not.toMatch(/<input[^>]*readOnly/);
  });
});
