// 店主的终端 · 命令注册表
// 纯函数实现，不依赖 DOM，便于单元测试；副作用通过 action 交给组件执行

export interface CommandResult {
  lines: string[];
  action?: 'clear' | 'navigate-story' | 'burst';
}

const HELP_LINES = [
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
  '  clear    清屏',
  '  exit     退出（试试就知道）',
  '  …以及一些没写在这里的',
];

/** 执行一条终端命令，返回输出行与可选动作 */
export function runCommand(rawInput: string): CommandResult {
  const input = rawInput.trim();
  if (!input) return { lines: [] };

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(' ');

  switch (cmd.toLowerCase()) {
    case 'help':
      return { lines: HELP_LINES };

    case 'story':
      return {
        lines: ['正在展开一封信…', '（一个大学生和他的学费的故事）'],
        action: 'navigate-story',
      };

    case 'author':
      return { lines: ['白天上课，晚上写代码，', '梦想是自力更生赚出学费的大学生。'] };

    case 'whoami':
      return { lines: ['一位有品位的访客（能找到这个终端的都是）'] };

    case 'ls':
      return { lines: ['products/  secret.txt'] };

    case 'cat':
      if (arg === 'secret.txt') {
        return { lines: ['你居然真的 cat 了。', '奖励你一个秘密：↑↑↓↓←→←→BA'] };
      }
      return { lines: [`cat: ${arg || '?'}: 没有那个文件（但你的好奇心我给满分）`] };

    case 'sudo':
      if (arg === 'give-me-discount') {
        return { lines: ['权限不足 :)', '但心意收到了。学生党可以邮件我，真的会给折扣。'] };
      }
      if (arg.startsWith('rm')) {
        return { lines: ['⚠ 别！这可是我的学费啊！！', '（进程已被店主的求生欲终止）'] };
      }
      return { lines: ['sudo: 你没有权限，但你有我的祝福。'] };

    case 'vim':
      return { lines: ['你进入了 vim。', '开玩笑的，谁都别想让我实现 :wq'] };

    case 'coffee':
    case '奶茶':
      return { lines: ['☕ 本店由奶茶驱动。今日已消耗：2 杯（数据真实）'] };

    case 'ping':
      return { lines: ['pong! 延迟 0ms，毕竟我就在你浏览器里'] };

    case 'exit':
      return { lines: ['退出失败：这是网页。', '你可以关掉标签页（但我会想你的）'] };

    case '42':
      return { lines: ['宇宙、生命以及一切的终极答案。你懂的。'] };

    case 'hug':
      return { lines: ['(っ´▽`)っ 抱一个。今天辛苦了。'] };

    case '晚安':
      return { lines: ['晚安。梦里没有 bug，也没有 deadline。'] };

    case 'emo':
      return {
        lines: [
          'emo 是正常的，说明你在认真地活着。',
          '不过如果真的很难受，别一个人扛着——',
          '找个人说说，或者在反馈页的树洞里说给我听。',
        ],
      };

    case 'date':
      return { lines: ['又是为学费奋斗的一天。'] };

    case 'konami':
      return { lines: ['嘘——这个词不该被直接说出来的。不过既然你诚心诚意地问了…'], action: 'burst' };

    case 'clear':
      return { lines: [], action: 'clear' };

    default:
      return { lines: [`command not found: ${cmd}。不过 help 一下也许有惊喜？`] };
  }
}

/** 移动端快捷命令按钮组 */
export const QUICK_COMMANDS = ['help', 'story', 'author', 'hug', 'coffee', 'ls'];
