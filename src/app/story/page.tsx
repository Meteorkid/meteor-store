import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '一封来自店主的信',
  description: '一个大学生和他的学费的故事——Meteor Store 店主的自述。',
};

// 信的段落：空行用 '' 表示，特殊段落用对象标记
const LETTER: Array<string | { type: 'em'; text: string }> = [
  '你好呀，陌生人。',
  '先自我介绍：我是这家店的店主，一名正在读书的大学生。白天在教室里假装听懂高数，晚上在宿舍里真的写代码。',
  '这家店里的每一件"商品"——爬虫框架、AI 记忆系统、3D 解剖图谱——都是我一行一行敲出来的。没有团队，没有投资人，只有我、一台电脑，和数不清的奶茶空杯。',
  '你可能会问：一个大学生，搞这些干什么？',
  { type: 'em', text: '答案很俗：赚学费。' },
  '我家里不算宽裕，学费和生活费是每年准时刷新的 boss 战。我不太想一直向家里伸手——他们已经很努力了。所以我想试试，用我会的东西，自力更生。',
  '写代码是我唯一拿得出手的本事（好吧，泡面也泡得不错）。于是就有了这家小店。',
  '说实话，每卖出一单，我都会开心很久——不只是因为钱，更因为那意味着：我写的东西，真的帮到了某个陌生人。这种感觉比考试及格还好。（考试及格的快乐只持续五分钟，这个能持续一星期。）',
  '如果你买了我的工具：谢谢你，真心的。你添的不只是一块学费的砖，还有一个学生"我可以靠自己"的底气。',
  '如果你只是路过：也谢谢你读到这里。祝你今天写的代码零 bug，喝的奶茶三分甜。',
  '最后——',
  { type: 'em', text: '无论你是谁、从哪里来、爱着谁、正在经历什么——你在这里都是受欢迎的。' },
  { type: 'em', text: '另外，如果你也是攒不出钱的学生：直接写邮件给我，工具免费给你。我太懂那种感觉了。' },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="relative overflow-hidden">
        {/* 暖色夜空背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#12081f] to-black" aria-hidden="true" />
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[40%] bg-purple-700/10 rounded-full blur-[120px]" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[30%] bg-amber-600/8 rounded-full blur-[100px]" aria-hidden="true" />

        <article className="relative max-w-xl mx-auto px-6 py-24 md:py-32">
          <header className="mb-14 text-center story-reveal" style={{ animationDelay: '0s' }}>
            <p className="text-purple-300/60 text-sm font-mono mb-4">☄ /story</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">一封来自店主的信</h1>
          </header>

          <div className="space-y-7 text-white/75 leading-loose text-[15px] md:text-base">
            {LETTER.map((para, i) => {
              const delay = `${0.3 + i * 0.35}s`;
              if (typeof para === 'object') {
                return (
                  <p
                    key={i}
                    className="story-reveal text-purple-200/90 font-medium text-base md:text-lg"
                    style={{ animationDelay: delay }}
                  >
                    {para.text}
                  </p>
                );
              }
              return (
                <p key={i} className="story-reveal" style={{ animationDelay: delay }}>
                  {para}
                </p>
              );
            })}

            <div
              className="story-reveal pt-8 text-right text-white/50 text-sm leading-relaxed"
              style={{ animationDelay: `${0.3 + LETTER.length * 0.35}s` }}
            >
              <p>—— 店主 Meteor</p>
              <p className="text-white/30">写于某个赶完 DDL 的深夜</p>
            </div>
          </div>

          <div
            className="story-reveal mt-16 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: `${0.5 + LETTER.length * 0.35}s` }}
          >
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
            >
              去看看这些用奶茶换来的工具
            </Link>
            <a
              href="mailto:meteor@stu.gpnu.edu.cn"
              className="px-6 py-3 rounded-xl border border-white/15 text-white/70 text-sm text-center hover:bg-white/5 transition-colors"
            >
              给店主写封邮件
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
