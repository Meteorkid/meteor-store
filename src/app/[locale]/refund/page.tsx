import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '退款政策 - Meteor Store',
  description: 'Meteor Store 退款政策与申请流程',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">退款政策</h1>
          <p className="text-gray-400 text-sm mb-8">最后更新：2026 年 7 月</p>

          <section className="mb-8">
            <p className="text-gray-300 leading-relaxed">
              本政策适用于在 Meteor Store 直接购买的数字产品。我们的产品提供可下载的
              试用版本和详细文档，建议您先试用再决定是否付费。一旦您收到激活码并完成了
              产品的实质性使用，由于数字产品的可复制性，原则上不予退款；但下述情形例外。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 可以申请退款的情形</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li><strong>未交付</strong>：付款成功后超过 24 小时仍未收到激活码或确认邮件，且我们未能补发，可全额退款。</li>
              <li><strong>重大功能缺陷</strong>：在常规环境下，产品核心功能无法正常使用，我们确认问题后无法在合理时间内修复或提供替代方案，可全额退款。</li>
              <li><strong>误购</strong>：付款后 <strong>未激活</strong>（即未使用激活码进行任何登录或解锁操作），且在付款后 7 天内联系我们的，可全额退款。</li>
              <li><strong>重复扣款</strong>：因系统问题导致的同一订单重复扣款，多扣部分无条件全额退还。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 不予退款的情形</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>激活码已被激活使用，且不属于本政策第 1 条「重大功能缺陷」情形；</li>
              <li>购买前已有免费试用版本可供验证，但购买后才表示「不适合」或「不需要」；</li>
              <li>因用户环境（操作系统版本、硬件配置、网络条件等）导致的不兼容，且产品页或文档已明确说明所需环境；</li>
              <li>用户对产品的功能预期与产品页 / 文档明确说明不符；</li>
              <li>通过邀请码、优惠码或赠品形式获得的产品（未支付对价）；</li>
              <li>已使用一段时间的订阅类产品，按已使用周期比例退还剩余部分（如适用），但不退还已使用部分。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 退款流程</h2>
            <ol className="text-gray-300 leading-relaxed space-y-1 list-decimal list-inside">
              <li>请发邮件到 <a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>，主题注明「退款申请 + 订单号」。</li>
              <li>正文简要说明退款原因，并附上订单号、付款时间、付款金额（订单详情页或确认邮件中可见）。</li>
              <li>如涉及「重大功能缺陷」，请附上问题描述与截图，便于我们核对。</li>
              <li>我们将在 <strong>3 个工作日</strong>内回复审核结果。</li>
              <li>退款通过原支付渠道（支付宝）原路返回，到账时间通常为 1–7 个工作日，以支付渠道为准。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 退款后的处理</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>退款成功后，对应订单的激活码将立即停用，您应停止使用并删除产品副本（开源部分除外）。</li>
              <li>退款完成后，相关的发票或收据同步作废。</li>
              <li>恶意退款（如已大量使用产品后申请退款、套取激活码后再申请等）将被拒绝，必要时我们保留追究责任的权利。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 法律说明</h2>
            <p className="text-gray-300 leading-relaxed">
              本政策不排除法律法规规定的消费者享有的强制性权利。如果您是中华人民共和国境内的消费者，
              您在《消费者权益保护法》等法律下享有的权利不受本政策限制。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 联系方式</h2>
            <p className="text-gray-300 leading-relaxed">
              邮箱：<a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
