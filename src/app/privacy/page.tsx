import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '隐私政策 - Meteor Store',
  description: 'Meteor Store 隐私政策与数据处理说明',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">隐私政策</h1>
          <p className="text-gray-400 text-sm mb-8">最后更新：2025 年 1 月</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 信息收集</h2>
            <p className="text-gray-300 leading-relaxed">
              我们在您使用 Meteor Store 时收集以下信息：
            </p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li><strong>账户信息</strong>：邮箱地址、用户名（当您注册或购买时）</li>
              <li><strong>支付信息</strong>：通过第三方支付平台（支付宝）处理，我们不直接存储您的银行卡信息</li>
              <li><strong>使用数据</strong>：产品使用情况、访问时间、浏览器类型</li>
              <li><strong>联系信息</strong>：当您通过联系表单或邮件与我们沟通时</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 信息使用</h2>
            <p className="text-gray-300 leading-relaxed">
              我们使用收集的信息用于：
            </p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>提供和维护我们的服务</li>
              <li>处理您的付款和发送订单确认</li>
              <li>发送产品更新和服务通知</li>
              <li>改善用户体验和产品功能</li>
              <li>防止欺诈和保护账户安全</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cookie 使用</h2>
            <p className="text-gray-300 leading-relaxed">
              我们使用 Cookie 和类似技术来维持会话、记住偏好设置和分析使用情况。
              您可以通过浏览器设置管理 Cookie 偏好。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 数据共享</h2>
            <p className="text-gray-300 leading-relaxed">
              我们不会出售您的个人数据。我们可能在以下情况下共享信息：
            </p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>经您明确同意</li>
              <li>为完成支付处理（与支付服务提供商共享必要信息）</li>
              <li>法律法规要求</li>
              <li>保护我们的合法权益</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 数据安全</h2>
            <p className="text-gray-300 leading-relaxed">
              我们采用行业标准的安全措施保护您的数据，包括传输加密（TLS）
              和访问控制。但请理解没有任何互联网传输方式是 100% 安全的。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 您的权利</h2>
            <p className="text-gray-300 leading-relaxed">您有权：</p>
            <ul className="text-gray-300 leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>访问和下载您的个人数据</li>
              <li>更正不准确的信息</li>
              <li>请求删除您的个人数据</li>
              <li>选择退出营销通信</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 联系我们</h2>
            <p className="text-gray-300 leading-relaxed">
              如有任何隐私相关问题，请通过以下方式联系我们：
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
