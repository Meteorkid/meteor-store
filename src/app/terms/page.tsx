import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '服务条款 - Meteor Store',
  description: 'Meteor Store 服务条款与使用协议',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">服务条款</h1>
          <p className="text-gray-400 text-sm mb-8">最后更新：2025 年 1 月</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 服务描述</h2>
            <p className="text-gray-300 leading-relaxed">
              Meteor Store 提供数字产品和工具的在线销售服务。我们的产品包括
              软件工具、设计资源和开发辅助工具。使用我们的服务即表示您同意
              受本条款约束。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 账户注册</h2>
            <p className="text-gray-300 leading-relaxed">
              您需要提供准确的注册信息，并妥善保管账户凭证。您对账户下的
              所有活动负责。如发现未经授权的使用，请立即通知我们。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 支付与定价</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>所有价格以人民币（CNY）标示，除非另有说明</li>
              <li>订阅服务按选定周期自动续费，可随时取消</li>
              <li>一次性购买的产品永久有效</li>
              <li>我们保留调整价格的权利，但不影响已生效的订阅</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 退款政策</h2>
            <p className="text-gray-300 leading-relaxed">
              对于订阅服务，如果您在购买后 7 天内对服务不满意，可以申请全额退款。
              一次性购买的产品在交付后不支持退款，除非产品存在严重功能缺陷。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 知识产权</h2>
            <p className="text-gray-300 leading-relaxed">
              产品及其相关内容的知识产权归 Meteor Store 或其授权方所有。
              购买产品获得的是个人或团队使用许可，而非所有权转让。
              未经授权不得复制、分发或修改产品内容。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 免责声明</h2>
            <p className="text-gray-300 leading-relaxed">
              产品按「现状」提供。在适用法律允许的最大范围内，我们不对因使用
              或无法使用产品而导致的任何间接、偶然或后果性损害承担责任。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 服务终止</h2>
            <p className="text-gray-300 leading-relaxed">
              如您违反本条款，我们可能暂停或终止您的账户访问权限。
              您也可以随时联系我们申请注销账户。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 条款变更</h2>
            <p className="text-gray-300 leading-relaxed">
              我们可能会不时更新本条款。重大变更将通过邮件或网站公告通知您。
              继续使用服务即表示接受更新后的条款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. 联系方式</h2>
            <p className="text-gray-300 leading-relaxed">
              如有任何问题，请联系我们：
            </p>
            <p className="text-gray-300 mt-2">
              邮箱：<a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
