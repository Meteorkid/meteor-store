'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import localFont from 'next/font/local';

const cursive = localFont({
  src: '../fonts/DancingScript-Latin.woff2',
  weight: '700',
  display: 'swap',
  preload: false,
});

type LetterLine = string | { type: 'em'; text: string; href?: string };

const LETTERS: Record<'zh' | 'en', LetterLine[]> = {
  zh: [
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
  ],
  en: [
    "Hello, stranger.",
    "Let me introduce myself first: I'm the owner of this shop, a second-year computer science student. By day I try (pretend) to listen in class; by night I do vibe coding in the office.",
    "If you ask around my college who \"that guy\" is, you might get several answers: the head of the innovation club, the arts troupe, the new media department... all me. It isn't greed; I just found a bug in university: as long as you're willing to work, nobody stops you from taking on more. I haven't reported that bug yet—I'm one of its beneficiaries.",
    "Oh, and dancing. After debugging until 2 a.m., you need some other way to shake the bugs off.",
    { type: 'em', text: "And every \"product\" in this shop, I typed out line by line." },
    "No team. No investors. Just me, one computer, and countless nights.",
    "Meteor Store isn't an ordinary software store. To me it's more like my story, and my answer to every pit I've stepped in: it holds the lessons from internships, competitions, projects, and late-night builds—and the tools I made after falling into those pits.",
    "Let me tell you how I got here.",
    "First semester of freshman year, while my roommates were still ranking takeout places, I was already sending résumés everywhere. Most vanished—after all, a freshman's résumé, however full the \"skills\" section, reads like a wish list.",
    "But that winter break, one company actually fished my wish out of the pile: a remote internship at a New Zealand company. Honestly, I spent that break feeling like a fraud—the docs were in English, every term had to be looked up; I knew nothing, and before asking a question in the group chat I'd rewrite it in the input box for five minutes, terrified someone would notice I was a freshman. But slowly, my code got merged into main, and my name started showing up in commit history.",
    "I didn't make much money that winter, but I became sure of one thing for the first time: the code I write can actually put food on the table.",
    "Then came the summer of sophomore year. My schedule: July to August, data intern at a cross-border e-commerce company; August to September, a seamless handoff to another tech company. My friends were posting beach photos; I was posting myself at a desk. (Two desks, technically.)",
    "It was during that first internship that I scraped over ten thousand rows of market data with Python. It sounds cool; in practice it's tedious: write the script, run it, watch the progress bar crawl, then lose everything on a field whose format suddenly changed—fix it, start again. The room at 2 a.m. was quiet, with only the AC, the laptop fan, doors opening and closing, rain (it rains a lot in Guangzhou)... and the progress bar for company. I cleaned every row by hand—duplicates, mojibake, half-missing records, I've seen them all.",
    "It was in those late nights fighting anti-scraping defenses that I started wondering: why does everyone have to fall into the same pits themselves?",
    { type: 'em', text: "So the shop's first product was born. I pave the pits I fell into into a road under your feet." },
    "Outside internships, I also built a mini-program to spread Shaoguan culture. The hardest part wasn't the features—it was performance. Judges' phones are always older than you imagine. To keep the list from stuttering on a painfully slow old phone, I optimized rendering until midnight. The project won a provincial award, but my proudest moment was watching it scroll smoothly on that old iPhone.",
    "Oh, and I also made an anti-fraud education piece for a competition—\"Learn to Avoid Illegal Fundraising in Three Minutes\"—and won a provincial award. So technically I might be the school's programmer who knows best that \"money must not be spent recklessly\"—a skill that pairs beautifully with \"earning tuition.\"",
    "Two years in, I've collected a lot of certificates, scattered across my dorm cabinet, drawers, and bed. But here's a hot tip: certificates can't pay tuition. The bursar won't take them; the cafeteria lady won't either. The janitor might, though...",
    { type: 'em', text: "So back to the very clichéd answer: earn tuition." },
    "My family isn't wealthy; tuition and living costs are a boss fight that refreshes on time every month. I don't want to keep reaching out to my parents—I want to learn to be responsible for myself as early as I can. And writing code is the craft I've practiced for two years, the one I'm best at, and the one I most want to keep sharpening. (Fine, I make good instant noodles too, but monetizing that is hard.)",
    "So this little shop exists. The crawler framework came from the experience of feeding on those ten thousand rows; the other tools are things I genuinely needed one late night and then built myself. I've also written a pile of unprofitable open-source toys—a typing practice site, a terminal status monitor, a menu-bar utility—purely because my hands itch, and to collect some GitHub green squares along the way.",
    "Honestly, every sale makes me happy for a long time. Not just the money, but because it means something I wrote actually helped a stranger. That feeling beats winning an award—certificates gather dust, but \"someone is using your code\" is new every day.",
    "Of course, there are lost moments too. In sophomore year, everyone around me is heading somewhere: some preparing for grad school, some grinding GPA for a direct admission, some already sure they'll go abroad. I like Hong Kong—I want to do my graduate degree there. I have a direction, but every late night when I close the laptop, another question pops up: coursework, competitions, internships, this shop... I'm doing everything; will I end up mastering nothing? I still don't have an answer.",
    { type: 'em', text: "But I know one thing vaguely: the opposite of being lost isn't clarity—it's action." },
    "When I can't figure things out, I write code. At least code is honest—it tells me plainly what's wrong and what works.",
    "As for that Hong Kong dream, I've seriously looked up tuition and living costs—it's a number measured in hundreds of thousands of yuan. For someone still saving for an undergraduate degree, that goal does sound a bit wild. But every sale in this shop brings that number a little closer.",
    "So my wishes are specific enough to list: I hope on graduation day I can say I earned my undergraduate tuition myself; I hope when the graduate admission letter arrives, I can afford what comes behind it; I hope one day the tools I make are used by many people, as naturally as water and electricity; and I hope when I look back many years later, I'll find this little shop built late at night is where all the stories began.",
    "Oh, and one last secret. The shop is called Meteor Store for a reason: my real name, when homophonized, means \"meteor shower.\"",
    { type: 'em', text: "So I put many meteors on this site, and every meteor—the ones streaking across the night sky, the ones you summon with a double-click, the ones that make wishes for you—is actually my name." },
    { type: 'em', text: "Sure, a meteor only crosses the sky for a few seconds, but I always feel it burns seriously." },
    "If you bought my tools: thank you, sincerely. It's not just an order; it's recognition of my work. It gives me more confidence to keep this shop going, and brings me a little closer to \"finishing my studies on my own.\"",
    "If you don't want to spend money right now: that's fine. Use the open-source parts freely, no need to feel awkward. But if you'd like, you can also drop a star on GitHub ⭐. Stars are free, but they lift me up.",
    "If you're just passing by: thank you for reading this far. May your code today have zero bugs, and your milk tea be 30% sweet. The world is bright and vast, the sun is just right; may the road you walk be full of flowers.",
    { type: 'em', text: "Finally—" },
    { type: 'em', text: "Whoever you are, wherever you come from, whoever you love, whatever you're going through—you are welcome here." },
    { type: 'em', text: "I always believe that with hope in your heart, you can take on anything." },
    { type: 'em', text: "Also, if you're a student who can't afford it either: verify with your school email and the tools are free for you.", href: '/student' },
    { type: 'em', text: "I used to love a line: \"Because I've been rained on, I want to hold an umbrella for someone else.\"" },
    { type: 'em', text: "But now I hope more that one day I can hand out the umbrella earlier." },
    { type: 'em', text: "Early enough that those people haven't been soaked yet." },
  ],
};

/* 羽枝：沿羽轴均匀排布，中段最宽、两端收尖（sin 的幂次让收尖不那么突然） */
const FEATHER_BARBS = Array.from({ length: 23 }, (_, i) => {
  const y = 16 + i * 6;
  const w = 21 * Math.sin((Math.PI * (y - 8)) / 142) ** 0.7;
  return { y, w: Number(w.toFixed(1)) };
});

/** 装饰用羽毛：羽片 + 羽枝 + 羽轴，颜色跟随 currentColor */
function Feather({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 72 176" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M36 8C57 46 56 110 39 146C18 110 15 46 36 8Z" fill="currentColor" fillOpacity="0.08" />
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round">
        {FEATHER_BARBS.map(({ y, w }) => (
          <g key={y}>
            <path d={`M36 ${y}Q${36 + w * 0.55} ${y + 3} ${36 + w} ${y + 9}`} />
            <path d={`M36 ${y}Q${36 - w * 0.55} ${y + 3} ${36 - w} ${y + 9}`} />
          </g>
        ))}
      </g>
      <path
        d="M36 8C34 56 36 116 39 170"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BreathDivider() {
  return (
    <div className="scroll-animate letter-line letter-line--divider text-center" aria-hidden="true">
      <span className="story-divider text-purple-400/40 text-xs tracking-[0.5em]">·&ensp;·&ensp;·</span>
    </div>
  );
}

export default function StoryLetter() {
  const t = useTranslations('StoryLetter');
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const lines = LETTERS[locale];
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

  lines.forEach((para, i) => {
    const isEm = typeof para === 'object';
    const prevIsEm = i > 0 && typeof lines[i - 1] === 'object';
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
          className="scroll-animate letter-line text-purple-200/90 font-medium text-base md:text-lg"
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
          className="scroll-animate letter-line"
          style={{ animationDelay: stagger }}
        >
          {para as string}
        </p>,
      );
    }

    staggerGroup++;

    if (isEm && (i + 1 >= lines.length || typeof lines[i + 1] !== 'object')) {
      if (i + 1 < lines.length) {
        elements.push(<BreathDivider key={`div-after-${i}`} />);
        staggerGroup = 0;
      }
    }
  });

  return (
    <article className="relative max-w-xl mx-auto px-6 py-24 md:py-32">
      {/* 飘在信纸周围的羽毛。偏移量让羽片落在正文栏之外，不压字；
          不裁剪（父级 main 已有 overflow-hidden 兜住横向溢出）。
          窄屏正文占满宽度，两侧没有容身之处，只会露出几根羽枝像渲染残留，所以 md 以下不出现。
          pointer-events-none：不能挡住空白处双击的彩蛋 */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <Feather
          className="letter-feather absolute -left-32 top-[8%] w-32 text-purple-300/30"
          style={{ '--feather-rot': '-28deg', animationDuration: '18s' } as React.CSSProperties}
        />
        <Feather
          className="letter-feather absolute -right-32 top-[38%] w-36 text-amber-200/25"
          style={{ '--feather-rot': '164deg', animationDuration: '23s', animationDelay: '-6s' } as React.CSSProperties}
        />
        <Feather
          className="letter-feather absolute -left-28 top-[72%] w-32 text-purple-200/25"
          style={{ '--feather-rot': '18deg', animationDuration: '20s', animationDelay: '-11s' } as React.CSSProperties}
        />
      </div>

      <header className="mb-14 text-center scroll-animate">
        <Feather className="mx-auto mb-3 w-7 text-purple-300/50 rotate-[-12deg]" />
        <p className="text-purple-300/60 text-sm font-mono mb-4">☄ /story</p>
        <h1 className="t-title-1 text-white">{t('headerTitle')}</h1>
      </header>

      <div className="letter-body relative text-white/75">
        {elements}

        {/* 签名区 —— 流星划线 + 仪式感 */}
        <div className="pt-12">
          <div ref={streakRef} className="story-meteor-line" aria-hidden="true">
            <div className="story-meteor-line__track" />
            <div className="story-meteor-line__glow" />
          </div>
          <div className="scroll-animate pt-6 flex items-start justify-end gap-4 leading-relaxed">
            {/* 刚落笔搁在一旁的那支羽毛笔 */}
            <Feather className="w-8 shrink-0 mt-1 rotate-[28deg] text-amber-200/45" />
            <div className="text-right">
              <p className={`${cursive.className} text-3xl md:text-4xl text-purple-300/80 mb-2`}>
                Meteor
              </p>
              <p className="text-white/50 text-sm">{t('signature')}</p>
              <p className="text-white/30 text-xs mt-1">{t('writtenAt')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-animate mt-16 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
        >
          {t('ctaProducts')}
        </Link>
        <a
          href="mailto:meteor@stu.gpnu.edu.cn"
          className="px-6 py-3 rounded-xl border border-white/15 text-white/70 text-sm text-center hover:bg-white/5 transition-colors"
        >
          {t('ctaEmail')}
        </a>
      </div>

      <p className="scroll-animate mt-8 text-center text-white/60 text-xs">
        {t('doubleClickHint')}
      </p>
    </article>
  );
}
