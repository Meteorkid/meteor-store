'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const cursive = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: true,
});

const LETTER: Array<string | { type: 'em'; text: string; href?: string }> = [
  '你好呀，陌生人。',
  '先自我介绍：我是这家店的店主，一名大二的计算机系学生。白天在教室里努力（假装）听课，晚上在办公室里玩vibe coding。',
  '如果你去我们学院打听"那个人是谁"，可能会得到很多答案：科创部的负责人吧、艺术团的、新媒体部的……都是我。不是我贪心，是我发现大学有个 bug：只要你愿意干活，就没人拦着你多干几份。我至今没提交这个 bug，因为我是既得利益者。',
  '对了，还有跳舞。毕竟 debug 到凌晨两点，总得有点别的方式把 bug 从身上甩下去。',
  { type: 'em', text: '而这家店里的每一件"商品"，都是我一行一行敲出来的。' },
  '没有团队，没有投资人。只有我、一台电脑，和数不清的夜晚。',
  'Meteor Store不是一家普通的软件商店。对我来说，它更像是我的story，也是我把自己踩过的坑整理成工具后的答案：里面装着我在实习、比赛、项目和深夜开发里踩过的坑，也装着我把这些坑重新整理成工具后的答案。',
  '说说我是怎么走到这一步的吧。',
  '大一上学期，室友们还在研究哪家外卖最好吃的时候，我已经在到处投简历了。投出去的简历大多石沉大海——毕竟一个大一新生的简历，"技能"栏写得再满，看起来也像是在许愿。',
  '但大一那年寒假，真的有一家公司捞起了我的许愿：一家新西兰公司的远程实习岗。说实话，那个寒假我过得挺心虚的——文档是英文的，术语要一个一个查；大一的我啥也不会，在群里提问之前，那句话要在输入框里改上五分钟才敢发出去，生怕别人看出来我是个大一的。但慢慢地，我的代码开始被合并进主分支，我的名字开始出现在提交记录里。',
  '那个寒假我没赚到什么钱，但我第一次确信了一件事：我写的代码，真的可以换饭吃。',
  '然后是大二那个暑假——我的日程表是这样的：七月到八月，在一家跨境电商公司做数据实习生；八月到九月，无缝衔接到另一家科技公司继续实习。别人的朋友圈在晒海边，而我把自己晒在工位。（准确说是两个工位。）',
  '就是在第一份实习里，我用 Python 爬了一万多条市场数据。这件事说出来好像挺酷，做起来其实很枯燥：写脚本、跑脚本、盯着进度条一点点往前挪，然后在某个格式突变的字段上前功尽弃，改完，重来。凌晨的房间很安静，只有空调声、电脑风扇声、开门关门声、雨声（广州经常下雨）……和进度条陪着我。每一条数据都亲手清洗过——重复的、乱码的、缺胳膊少腿的，我都见过。',
  '就是在那些和反爬机制斗智斗勇的深夜里，我开始想：为什么这些坑，要每个人都亲自摔一遍？',
  { type: 'em', text: '所以有了这家店的第一件商品。把我摔过的坑，铺成你脚下的路。' },
  '实习之外，我还写过一个传播韶关文化的小程序。最难的部分不是功能，而是性能——评委的手机永远比你想象的老。为了让列表在一台性能捉急的旧手机上不卡顿，我优化渲染优化到半夜。后来这个项目拿了省赛的奖，但我最有成就感的瞬间，是看它在那台老iphone上丝滑地滑动起来。',
  '哦对，我还做过防诈骗科普作品去参赛，《三分钟学会避雷非法集资》，拿了个省级的奖。所以理论上，我可能是全校最懂"钱不能乱花"的程序员——这个技能点和"赚学费"简直是天作之合。',
  '两年下来，也攒了好多张奖状，宿舍的柜子抽屉床上都乱放着奖状。但分享一个热知识：奖状不能拿去交学费。教务处不收，食堂阿姨也不收。不过，扫地阿姨应该会要吧……',
  { type: 'em', text: '于是回到那个很俗的答案：赚学费。' },
  '我家里不算宽裕，学费和生活费是每月准时刷新的 boss 战。我不太想一直向家里伸手——也想尽早学会为自己负责。而写代码，是我练了两年、目前最拿得出手，也最愿意继续打磨的手艺。（好吧，泡面也泡得不错，但那个变现困难。）',
  '于是就有了这家小店。店里的爬虫框架，源自那一万多条数据喂出来的经验；其他的工具，也都是我在某个深夜真实需要过、然后自己动手做出来的东西。我还写了一堆不赚钱的开源小玩具——打字练习网站、终端状态监控、菜单栏小工具——纯粹手痒，顺便攒点 GitHub 绿格子。',
  '说实话，每卖出一单，我都会开心很久。不只是因为钱，更因为那意味着：我写的东西，真的帮到了某个陌生人。这种感觉比拿奖还好——奖状会积灰，但"有人在用你写的代码"这件事，每天都是新的。',
  '当然，也不是没有迷茫的时候。大二了，身边的人开始各奔前程：有人准备考研，有人刷绩点等保研，有人已经想清楚要出国。不过我喜欢香港——我想去那里读研究生。方向是有了，可是每次深夜合上电脑，另一个问题又会冒出来：课业、比赛、实习、这家小店……我什么都在做，会不会最后什么都做不精？这个问题，我到现在也没有答案。',
  { type: 'em', text: '但我隐约知道一件事：迷茫的反义词不是清晰，是行动。' },
  '想不明白的时候，我就去写代码。至少代码是诚实的——它会明明白白地告诉我，哪里错了，哪里通了。',
  '至于那个香港的梦，我认真查过学费和生活费——那是一个以"十万"为单位的数字。对一个还在攒本科学费的人来说，这个目标听起来确实有点狂。但这家小店每卖出一单，那个数字就近一点点。',
  '所以我的愿望具体得可以列成清单：我希望毕业那天，可以说本科的学费是自己赚的；我希望研究生的录取通知书来的时候，我付得起它背后的价格；我希望有一天，我做的工具能被很多很多人用着，自然得像水和电；我还希望很多年以后回头看，会发现这家深夜里搭起来的小店，是所有故事开始的地方。',
  '对了，最后说个小秘密。这家店叫 Meteor Store，不是随便起的名字：我的真名，谐音，就是"流星雨"。',
  { type: 'em', text: '所以这个网站里我做了很多流星，而所有的流星——夜空里划过的、你双击召唤出来的、替你许愿的——其实都是我的名字。' },
  { type: 'em', text: '虽然吧，流星划过天空只有几秒钟，但我总觉得，它认真"烧"过。' },
  '如果你买了我的工具：谢谢你，真心的。那不仅是一笔订单，也是对我的作品的认可，它会让我更有底气继续把这家小店做下去，也让我离"靠自己完成学业"更近一点。',
  '如果你暂时不想花钱：没关系，开源的部分随便用，不用不好意思。但如果你愿意，也可以顺手去 GitHub 点一颗小星星 ⭐。星星不要钱，但对我来说，很提气。',
  '如果你只是路过：也谢谢你读到这里。祝你今天写的代码零 bug，喝的奶茶三分甜。世界灿烂盛大，人间骄阳正好，希望你走的路繁花盛开。',
  { type: 'em', text: '最后——' },
  { type: 'em', text: '无论你是谁、从哪里来、爱着谁、正在经历什么——你在这里都是受欢迎的。' },
  { type: 'em', text: '我始终相信，满怀希望，就会所向披靡。' },
  { type: 'em', text: '另外，如果你也是攒不出钱的学生：用教育邮箱验证一下，工具免费给你。', href: '/student' },
  { type: 'em', text: '我以前很喜欢一句话："因为淋过雨，所以想给别人撑一把伞。"' },
  { type: 'em', text: '但现在我更希望，有一天我能把伞递得更早一点。' },
  { type: 'em', text: '早到那些人还没被雨淋湿。' },
];

function BreathDivider() {
  return (
    <div className="scroll-animate flex justify-center items-center py-4" aria-hidden="true">
      <span className="story-divider text-purple-400/40 text-xs tracking-[0.5em]">·&ensp;·&ensp;·</span>
    </div>
  );
}

export default function StoryLetter() {
  const streakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = streakRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate');
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const elements: React.ReactNode[] = [];
  let staggerGroup = 0;

  LETTER.forEach((para, i) => {
    const isEm = typeof para === 'object';
    const prevIsEm = i > 0 && typeof LETTER[i - 1] === 'object';
    const stagger = `${(staggerGroup % 4) * 0.1}s`;

    if (isEm && !prevIsEm) {
      elements.push(<BreathDivider key={`div-${i}`} />);
      staggerGroup = 0;
    }

    if (isEm) {
      const obj = para as { text: string; href?: string };
      elements.push(
        <p
          key={i}
          className="scroll-animate text-purple-200/90 font-medium text-base md:text-lg py-1"
          style={{ animationDelay: stagger }}
        >
          {obj.href ? (
            <Link href={obj.href} className="underline decoration-purple-400/40 underline-offset-4 hover:decoration-purple-300 transition-colors">
              {obj.text}
            </Link>
          ) : (
            obj.text
          )}
        </p>,
      );
    } else {
      elements.push(
        <p
          key={i}
          className="scroll-animate"
          style={{ animationDelay: stagger }}
        >
          {para as string}
        </p>,
      );
    }

    staggerGroup++;

    if (isEm && (i + 1 >= LETTER.length || typeof LETTER[i + 1] !== 'object')) {
      if (i + 1 < LETTER.length) {
        elements.push(<BreathDivider key={`div-after-${i}`} />);
        staggerGroup = 0;
      }
    }
  });

  return (
    <article className="relative max-w-xl mx-auto px-6 py-24 md:py-32">
      <header className="mb-14 text-center scroll-animate">
        <p className="text-purple-300/60 text-sm font-mono mb-4">☄ /story</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">一封来自店主的信</h1>
      </header>

      <div className="space-y-7 text-white/75 leading-loose text-[15px] md:text-base">
        {elements}

        {/* 签名区 —— 流星划线 + 仪式感 */}
        <div className="pt-12">
          <div ref={streakRef} className="story-meteor-line" aria-hidden="true">
            <div className="story-meteor-line__track" />
            <div className="story-meteor-line__glow" />
          </div>
          <div className="scroll-animate pt-6 text-right leading-relaxed">
            <p className={`${cursive.className} text-3xl md:text-4xl text-purple-300/80 mb-2`}>
              Meteor
            </p>
            <p className="text-white/50 text-sm">—— 店主</p>
            <p className="text-white/30 text-xs mt-1">写于某个赶完 DDL 的深夜</p>
          </div>
        </div>
      </div>

      <div className="scroll-animate mt-16 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
        >
          去看看这些深夜敲出来的工具
        </Link>
        <a
          href="mailto:meteor@stu.gpnu.edu.cn"
          className="px-6 py-3 rounded-xl border border-white/15 text-white/70 text-sm text-center hover:bg-white/5 transition-colors"
        >
          给店主写封邮件
        </a>
      </div>

      <p className="scroll-animate mt-8 text-center text-white/20 text-xs">
        试试在空白处双击 ✦
      </p>
    </article>
  );
}
