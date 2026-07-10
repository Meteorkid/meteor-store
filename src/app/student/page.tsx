import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentVerifyForm from '@/components/StudentVerifyForm';

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

          {/* Form card */}
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <StudentVerifyForm />
          </div>

          {/* How it works */}
          <div className="mt-16">
            <h2 className="mb-8 text-xl font-bold">怎么用？</h2>
            <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
              <Step num="1" title="输入教育邮箱" desc="以 .edu、.edu.cn 等结尾的学校邮箱。" />
              <Step num="2" title="收验证邮件" desc="我们会发一封邮件到你的学校邮箱，点击链接即可验证。" />
              <Step num="3" title="开始使用" desc="验证通过后，所有付费功能自动解锁，永久有效。" />
            </div>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-300">
        {num}
      </div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
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
