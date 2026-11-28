// 店主的终端 · 命令注册表
// 纯函数实现，不依赖 DOM，便于单元测试；副作用通过 action 交给组件执行
import { productDisplayOrderIds } from '@/data/product-order';

export interface CommandResult {
  lines: string[];
  action?: 'clear' | 'navigate-story' | 'burst';
}

const HELP_LINES = {
  zh: [
    '可用命令：',
    '  story    店主的一封信',
    '  author   关于店主',
    '  whoami   关于你',
    '  ls       看看有什么',
    '  coffee   本店动力来源',
    '  ping     测试连通性',
    '  hug      需要的时候用',
    '  晚安      深夜专用',
    '  emo      也是给你的',
    '  白嫖      真的可以',
    '  clear    清屏',
    '  exit     退出（试试就知道）',
    '  easter   彩蛋完全指南',
  ],
  en: [
    'Available commands:',
    '  story      a letter from the owner',
    '  author     about the owner',
    '  whoami     about you',
    '  ls         list what is here',
    '  coffee     what powers this store',
    '  ping       test the connection',
    '  hug        for when you need one',
    '  goodnight  late-night only',
    '  emo        also for you',
    '  free       yes, really',
    '  clear      clear the screen',
    '  exit       quit (try it)',
    '  easter     the full easter-egg guide',
  ],
} as const;

const NEOFETCH_ROWS = {
  zh: [
    '         ✦     ☄     ✦',
    '    ╭──────────────────────────────╮',
    '    │     Meteor Store  · 店主终端     │',
    '    ├──────────────────────────────┤',
    '    │ OS       │ Next.js 16 · 阿里云    │',
    '    │ Shell    │ 阿里云 2G 轻量 · PM2    │',
    '    │ DB       │ PostgreSQL · Drizzle    │',
    '    │ Cache    │ 本机 Redis                │',
    '    │ Monitor  │ Sentry                  │',
    '    │ Payment  │ 支付宝                   │',
    '    │ Lang     │ TypeScript · React 19    │',
    '    │ Style    │ Tailwind 4 · 暗色主题    │',
    '    │ Theme    │ 流星 · 星空 · 玻璃拟态   │',
    '    ├──────────────────────────────┤',
    `    │ 产品     │ ${productDisplayOrderIds.length} 款工具与应用          │`,
    '    │ 博客     │ 星辰分区 · 读者投稿       │',
    '    │ 店主     │ 大学生 · 赚学费           │',
    '    ╰──────────────────────────────╯',
  ],
  en: [
    '         ✦     ☄     ✦',
    '    ╭──────────────────────────────╮',
    '    │   Meteor Store · Owner’s Term  │',
    '    ├──────────────────────────────┤',
    '    │ OS       │ Next.js 16 · Alibaba   │',
    '    │ Shell    │ 2 GB cloud · PM2        │',
    '    │ DB       │ PostgreSQL · Drizzle    │',
    '    │ Cache    │ Local Redis             │',
    '    │ Monitor  │ Sentry                  │',
    '    │ Payment  │ Alipay                  │',
    '    │ Lang     │ TypeScript · React 19    │',
    '    │ Style    │ Tailwind 4 · dark theme  │',
    '    │ Theme    │ Meteors · stars · glass  │',
    '    ├──────────────────────────────┤',
    `    │ Products │ ${productDisplayOrderIds.length} tools & apps           │`,
    '    │ Blog     │ Star sections · readers  │',
    '    │ Owner    │ Student · earning tuition│',
    '    ╰──────────────────────────────╯',
  ],
} as const;

const EASTER_GUIDE = {
  zh: [
    '🎭 本站彩蛋完全指南',
    '',
    '⌨️ 键盘秘技：',
    '  ↑↑↓↓←→←→BA  →  Konami 秘技，触发流星雨爆发',
    '  输入 "meteor"  →  召唤流星（任意页面直接打字）',
    '',
    '🖱️ 鼠标互动：',
    '  连点 Logo 7 次  →  同 Konami 效果',
    '  双击页面空白处  →  从点击处放出小流星',
    '  静止鼠标 10 秒  →  许愿流星飞过，可点击许愿',
    '  点击页尾的黑洞  →  被它吸进工具矩阵',
    '',
    '📱 页面互动：',
    '  切到其他标签页    →  标题栏会挽留你',
    '  滚动到页面底部     →  初次到达会送一颗流星',
    '  凌晨 0-5 点访问    →  随机深夜问候',
    '',
    '💻 控制台 API（按 F12 打开）：',
    '  meteor.story()   →  店主的一封信',
    '  meteor.hire()    →  店主的联系方式',
    '  meteor.secret()  →  触发流星爆发',
    '',
    '📟 本终端其他隐藏命令：',
    '  vim · sudo rm · 42 · cat secret.txt · 白嫖 · 晚安 · emo',
  ],
  en: [
    '🎭 The complete easter-egg guide',
    '',
    '⌨️ Keyboard secrets:',
    '  ↑↑↓↓←→←→BA  →  the Konami code, triggers a meteor burst',
    '  type "meteor"  →  summon a meteor (just type on any page)',
    '',
    '🖱️ Mouse interactions:',
    '  click the logo 7 times  →  same as the Konami code',
    '  double-click empty space  →  a small meteor falls from that point',
    '  leave the mouse still for 10s  →  a wishing meteor passes by; click to wish',
    '  click the black hole in the footer  →  get pulled into the tool matrix',
    '',
    '📱 Page interactions:',
    '  switch tabs  →  the title bar tries to keep you',
    '  scroll to the bottom  →  a meteor greets you on your first visit',
    '  visit between 0 and 5 a.m.  →  a random late-night greeting',
    '',
    '💻 Console API (press F12):',
    '  meteor.story()   →  a letter from the owner',
    '  meteor.hire()    →  the owner’s contact',
    '  meteor.secret()  →  trigger a meteor burst',
    '',
    '📟 More hidden terminal commands:',
    '  vim · sudo rm · 42 · cat secret.txt · free · goodnight · emo',
  ],
} as const;

/** 执行一条终端命令，返回输出行与可选动作 */
export function runCommand(rawInput: string, locale: 'zh' | 'en' = 'zh'): CommandResult {
  const input = rawInput.trim();
  if (!input) return { lines: [] };

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(' ');
  const en = locale === 'en';

  switch (cmd.toLowerCase()) {
    case 'help':
      return { lines: [...HELP_LINES[locale]] };

    case 'story':
      return {
        lines: en
          ? ['Opening a letter…', '(a student, his tuition, and the tools in between)']
          : ['正在展开一封信…', '（一个大学生和他的学费的故事）'],
        action: 'navigate-story',
      };

    case 'author':
      return {
        lines: en
          ? ['Classes by day, code by night.', 'A student who wants to earn his own tuition.']
          : ['白天上课，晚上写代码，', '梦想是自力更生赚出学费的大学生。'],
      };

    case 'whoami':
      return {
        lines: [
          en
            ? 'A visitor with taste (anyone who finds this terminal has taste).'
            : '一位有品位的访客（能找到这个终端的都是）',
        ],
      };

    case 'ls':
      return { lines: ['products/  secret.txt'] };

    case 'cat':
      if (arg === 'secret.txt') {
        return {
          lines: en
            ? ['You actually cat-ed it.', 'Here is a secret: ↑↑↓↓←→←→BA']
            : ['你居然真的 cat 了。', '奖励你一个秘密：↑↑↓↓←→←→BA'],
        };
      }
      return {
        lines: [
          en
            ? `cat: ${arg || '?'}: no such file (but full marks for curiosity)`
            : `cat: ${arg || '?'}: 没有那个文件（但你的好奇心我给满分）`,
        ],
      };

    case '白嫖':
    case 'free':
    case 'star':
      return {
        lines: en
          ? [
              'Yes, you can use it for free! Take the free features, no need to feel awkward.',
              'But if it helped, an email would make my day ⭐',
              '→ meteor@stu.gpnu.edu.cn',
              'Your feedback costs nothing, but for a student saving for tuition it means more than money.',
            ]
          : [
              '可以白嫖！免费功能随便用，不用不好意思。',
              '但如果它帮到了你，欢迎给我发封邮件聊聊 ⭐',
              '→ meteor@stu.gpnu.edu.cn',
              '你的反馈不要钱，但对一个攒学费的大学生来说，比钱还提气。',
            ],
      };

    case 'meteor':
    case '流星':
      return {
        lines: [en ? '☄ You summoned a meteor shower.' : '☄ 你召唤了一场流星雨。'],
        action: 'burst',
      };

    case 'sudo':
      if (arg === 'give-me-discount') {
        return {
          lines: en
            ? [
                'Permission denied :)',
                'But thank you. Students can email me — I really do give discounts.',
                'Or try the free command.',
              ]
            : ['权限不足 :)', '但心意收到了。学生党可以邮件我，真的会给折扣。', '实在不行还可以试试 白嫖 这条命令。'],
        };
      }
      if (arg.startsWith('rm')) {
        return {
          lines: en
            ? ['⚠ Don’t! That’s my tuition!!', '(Process terminated by the owner’s will to live)']
            : ['⚠ 别！这可是我的学费啊！！', '（进程已被店主的求生欲终止）'],
        };
      }
      return {
        lines: [
          en ? 'sudo: you don’t have permission, but you have my blessing.' : 'sudo: 你没有权限，但你有我的祝福。',
        ],
      };

    case 'vim':
      return {
        lines: en
          ? ['You are in vim.', 'Just kidding. Nobody can make me implement :wq.']
          : ['你进入了 vim。', '开玩笑的，谁都别想让我实现 :wq'],
      };

    case 'coffee':
    case '奶茶':
      return {
        lines: en
          ? ['☕ This shop runs on milk tea. Today’s consumption: 2 cups (real data).']
          : ['☕ 本店由奶茶驱动。今日已消耗：2 杯（数据真实）'],
      };

    case 'ping':
      return {
        lines: [
          en ? 'pong! 0 ms latency — I’m right in your browser.' : 'pong! 延迟 0ms，毕竟我就在你浏览器里',
        ],
      };

    case 'exit':
      return {
        lines: en
          ? ['Exit failed: this is a web page.', 'You can close the tab (but I’ll miss you).']
          : ['退出失败：这是网页。', '你可以关掉标签页（但我会想你的）'],
      };

    case '42':
      return {
        lines: [
          en
            ? 'The ultimate answer to life, the universe, and everything. You know the rest.'
            : '宇宙、生命以及一切的终极答案。你懂的。',
        ],
      };

    case 'hug':
      return {
        lines: [
          en ? '(っ´▽`)っ Have a hug. You did well today.' : '(っ´▽`)っ 抱一个。今天辛苦了。',
        ],
      };

    case '晚安':
    case 'goodnight':
    case 'night':
      return {
        lines: [
          en ? 'Goodnight. No bugs in your dreams, no deadlines either.' : '晚安。梦里没有 bug，也没有 deadline。',
        ],
      };

    case 'emo':
      return {
        lines: en
          ? [
              'Feeling low is normal — it means you’re living seriously.',
              'But if it really hurts, don’t carry it alone—',
              'Talk to someone, or leave it in the feedback tree hole for me.',
            ]
          : [
              'emo 是正常的，说明你在认真地活着。',
              '不过如果真的很难受，别一个人扛着——',
              '找个人说说，或者在反馈页的树洞里说给我听。',
            ],
      };

    case 'date':
      return {
        lines: [en ? 'Another day fighting for tuition.' : '又是为学费奋斗的一天。'],
      };

    case 'neofetch':
      return { lines: [...NEOFETCH_ROWS[locale]] };

    case 'konami':
      return {
        lines: en
          ? ['Shh—that word isn’t supposed to be said out loud. But since you asked so sincerely…']
          : ['嘘——这个词不该被直接说出来的。不过既然你诚心诚意地问了…'],
        action: 'burst',
      };

    case 'clear':
      return { lines: [], action: 'clear' };

    case 'easter':
    case '彩蛋':
    case 'secrets':
      return { lines: [...EASTER_GUIDE[locale]] };

    default:
      return {
        lines: [
          en
            ? `command not found: ${cmd}. Try help — there might be a surprise.`
            : `command not found: ${cmd}。不过 help 一下也许有惊喜？`,
        ],
      };
  }
}

/** 移动端快捷命令按钮组 */
export const QUICK_COMMANDS = ['help', 'story', 'author', 'hug', 'coffee', 'ls', 'easter'];

/** 所有可 Tab 补全的命令名 */
export const ALL_COMMANDS = [
  'help', 'story', 'author', 'whoami', 'ls', 'cat',
  'easter', '彩蛋', 'secrets', 'meteor', '流星', 'konami',
  '白嫖', 'free', 'star', 'coffee', '奶茶', 'hug', '晚安', 'goodnight', 'night', 'emo',
  'ping', 'date', '42', 'vim', 'exit', 'clear', 'sudo',
  'neofetch',
];

// 更新移动端快捷按钮
(QUICK_COMMANDS as string[]).push('neofetch');
