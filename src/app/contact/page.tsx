import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '联系我们 - Meteor Store',
  description: '与 Meteor Store 团队取得联系',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">联系我们</h1>
          <p className="text-gray-400 text-lg mb-12">
            有任何问题、建议或合作意向？欢迎随时联系我们
          </p>

          {/* 联系方式卡片 */}
          <div className="space-y-6">
            {/* 邮箱 */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📧</span>
                <h2 className="text-lg font-semibold">电子邮件</h2>
              </div>
              <p className="text-gray-400 mb-3">
                适合咨询、反馈和一般问题
              </p>
              <a
                href="mailto:meteor@stu.gpnu.edu.cn"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                meteor@stu.gpnu.edu.cn
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* GitHub */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🐙</span>
                <h2 className="text-lg font-semibold">GitHub</h2>
              </div>
              <p className="text-gray-400 mb-3">
                报告 Bug、提交功能请求或查看源代码
              </p>
              <a
                href="https://github.com/Meteorkid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                github.com/Meteorkid
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* 工作时间 */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⏰</span>
                <h2 className="text-lg font-semibold">响应时间</h2>
              </div>
              <p className="text-gray-400">
                我们通常在 24 小时内回复邮件。对于紧急问题，
                请在邮件标题中注明「紧急」。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
