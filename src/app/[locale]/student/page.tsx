import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '学生优惠 - Meteor Store',
  description: '用教育邮箱验证学生身份，免费解锁全部产品。',
};

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero */}
          <div className="mb-12">
            <span className="mb-4 inline-block text-5xl">🎓</span>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">学生免费计划</h1>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-400">
              还在攒学费？一样的。用你的教育邮箱验证身份，<strong className="text-white">全部产品免费用</strong>。
            </p>
          </div>

          {/* 暂停公告：在线认证链路升级中，临时改为邮件人工开通 */}
          <div className="mx-auto max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-8 text-left">
            <h2 className="mb-2 text-lg font-semibold text-amber-200">在线认证升级中</h2>
            <p className="text-sm leading-relaxed text-gray-300">
              自动邮件认证流程正在重构，暂时无法在此页面直接验证。
              如果你是在校学生，把学校邮箱发到
              <a
                href="mailto:meteor@stu.gpnu.edu.cn?subject=学生免费计划申请"
                className="mx-1 underline decoration-amber-300/40 underline-offset-4 hover:decoration-amber-300"
              >
                meteor@stu.gpnu.edu.cn
              </a>
              ，附上能证明在读的截图（学生证 / 学校邮箱收件箱 / 学信网），
              店主核对后会手动给你发放邀请码。
            </p>
            <p className="mt-3 text-xs text-gray-500">
              已发放的邀请码永久有效，不会因升级受影响。
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-16 text-left">
            <h2 className="mb-6 text-xl font-bold">常见问题</h2>
            <div className="space-y-4">
              <FaqItem
                q="支持哪些教育邮箱？"
                a="全球教育机构邮箱：.edu、.edu.cn、.ac.uk、.ac.jp、.edu.au 等。如果你的学校邮箱不在支持列表，发邮件给我，我手动帮你开通。"
              />
              <FaqItem
                q="优惠有时间限制吗？"
                a="没有。验证通过后永久有效。毕业了也可以继续用。"
              />
              <FaqItem
                q="我没有教育邮箱怎么办？"
                a="直接写邮件给 meteor@stu.gpnu.edu.cn，附上你的学生证照片，我手动帮你开通。"
              />
            </div>
          </div>

          <div className="mt-12">
            <Link href="/" className="text-sm text-violet-300 transition-colors hover:text-violet-200">
              ← 返回首页
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <p className="mb-2 font-semibold text-white">{q}</p>
      <p className="text-sm leading-relaxed text-gray-400">{a}</p>
    </div>
  );
}
