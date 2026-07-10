'use client';

import { useState } from 'react';
import Link from 'next/link';
import TerminalDemo from './TerminalDemo';

interface DemoConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  terminal: {
    title: string;
    prompt?: string;
    lines: { type: 'command' | 'output' | 'comment'; text: string; delay?: number }[];
  };
}

const demos: DemoConfig[] = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    icon: '🕷️',
    description: '三引擎爬虫框架：一行命令，自动选择最优引擎。',
    terminal: {
      title: 'omnicrawl-demo',
      lines: [
        { type: 'comment', text: '# 安装 OmniCrawl' },
        { type: 'command', text: 'pip install omnicrawl' },
        { type: 'output', text: 'Successfully installed omnicrawl-1.2.0' },
        { type: 'comment', text: '# 用 auto 引擎抓取页面' },
        { type: 'command', text: 'python -c "import asyncio; from omnicrawl import Crawler; print(asyncio.run(Crawler(engine=\'auto\').fetch(\'https://example.com\')))"' },
        { type: 'output', text: '[Engine] Auto-selecting: curl_cffi (no JS rendering needed)' },
        { type: 'output', text: '[Fetch]  200 OK  https://example.com  (142ms)' },
        { type: 'output', text: '<html><head><title>Example Domain</title></head>...' },
        { type: 'comment', text: '# 对付有 WAF 保护的站点' },
        { type: 'command', text: 'python -c "from omnicrawl import Crawler; c = Crawler(engine=\'auto\', anti_detect=True); print(c.fetch_sync(\'https://protected-site.com\'))"' },
        { type: 'output', text: '[Engine] Auto-selecting: scrapling (TLS fingerprint needed)' },
        { type: 'output', text: '[AntiDetect] TLS fingerprint: Chrome/126 on macOS' },
        { type: 'output', text: '[AntiDetect] Canvas fingerprint: randomized' },
        { type: 'output', text: '[Fetch]  200 OK  (bypassed Cloudflare in 2.1s)' },
      ],
    },
  },
  {
    id: 'ex-memory',
    name: 'Ex-Memory',
    icon: '💖',
    description: '让 AI 学会一个人的说话风格。',
    terminal: {
      title: 'ex-memory-demo',
      lines: [
        { type: 'comment', text: '# 导入聊天记录' },
        { type: 'command', text: 'python -m exmemory import --source wechat --file chat_export.json' },
        { type: 'output', text: '[Import] 解析中... 找到 12,847 条消息' },
        { type: 'output', text: '[Import] 分块完成: 2,156 个语义片段' },
        { type: 'output', text: '[Vector] 向量化中... ████████████████ 100%' },
        { type: 'output', text: '[Vector] 已存入 ChromaDB (本地)' },
        { type: 'comment', text: '# 生成人格画像' },
        { type: 'command', text: 'python -m exmemory persona --generate' },
        { type: 'output', text: '[Persona] 分析语言风格...' },
        { type: 'output', text: '[Persona] MBTI 倾向: INFP' },
        { type: 'output', text: '[Persona] 高频用语: "哈哈哈"、"好耶"、"绝了"' },
        { type: 'output', text: '[Persona] 情感模式: 热情、共情力强、喜欢用 emoji' },
        { type: 'output', text: '[Persona] 已保存到 persona.md' },
        { type: 'comment', text: '# 开始对话' },
        { type: 'command', text: 'python -m exmemory chat' },
        { type: 'output', text: '> 今天好累啊' },
        { type: 'output', text: '哈哈哈 那你快去休息呀！不要硬撑 🫶 明天又是新的一天~' },
      ],
    },
  },
  {
    id: 'statux',
    name: 'Statux',
    icon: '📊',
    description: 'iTerm2 状态栏里的 AI Agent 监控面板。',
    terminal: {
      title: 'statux-demo',
      lines: [
        { type: 'command', text: 'statux init' },
        { type: 'output', text: '[Statux] 检测到 iTerm2 v3.5.2 ✓' },
        { type: 'output', text: '[Statux] 状态栏组件已注册' },
        { type: 'output', text: '[Statux] 配置文件: ~/.config/statux/config.toml' },
        { type: 'command', text: 'statux watch --agent claude-code' },
        { type: 'output', text: '┌─────────────────────────────────────┐' },
        { type: 'output', text: '│  🤖 Claude Code  │  ● Running      │' },
        { type: 'output', text: '│  Task: Refactor auth module        │' },
        { type: 'output', text: '│  Tokens: 12.4K in / 3.2K out       │' },
        { type: 'output', text: '│  Duration: 2m 34s                  │' },
        { type: 'output', text: '│  Files: 3 modified, 1 created      │' },
        { type: 'output', text: '└─────────────────────────────────────┘' },
        { type: 'output', text: '[Statux] 实时更新中... (Ctrl+C 退出)' },
      ],
    },
  },
  {
    id: 'tollow',
    name: 'Tollow',
    icon: '⌨️',
    description: '沉浸式长文打字练习，选一本书开始。',
    terminal: {
      title: 'tollow-demo',
      lines: [
        { type: 'command', text: 'npm run dev' },
        { type: 'output', text: '  ▲ Next.js 16.2.9' },
        { type: 'output', text: '  - Local: http://localhost:3000' },
        { type: 'output', text: '' },
        { type: 'output', text: ' ✓ Ready in 1.2s' },
        { type: 'comment', text: '# 浏览器打开后选择书籍...' },
        { type: 'output', text: '' },
        { type: 'output', text: '  📚 可用书籍:' },
        { type: 'output', text: '  1. 《黑客与画家》 - Paul Graham' },
        { type: 'output', text: '  2. 《代码大全》 - Steve McConnell' },
        { type: 'output', text: '  3. 《人月神话》 - Frederick Brooks' },
        { type: 'output', text: '' },
        { type: 'output', text: '  当前段落 (第 3 章):' },
        { type: 'output', text: '  "好的设计是简单的设计。从数学到绘画，' },
        { type: 'output', text: '   你总是听到这句话。在数学中，它意味着' },
        { type: 'output', text: '   更短的证明往往是更好的证明..."' },
      ],
    },
  },
];

export default function PlaygroundTabs() {
  const [activeTab, setActiveTab] = useState(demos[0].id);
  const activeDemo = demos.find((d) => d.id === activeTab) ?? demos[0];

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {demos.map((demo) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => setActiveTab(demo.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === demo.id
                ? 'bg-white text-black'
                : 'border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <span aria-hidden>{demo.icon}</span>
            {demo.name}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="mb-6 text-gray-400">{activeDemo.description}</p>

      {/* Terminal */}
      <TerminalDemo
        key={activeDemo.id}
        title={activeDemo.terminal.title}
        prompt={activeDemo.terminal.prompt}
        lines={activeDemo.terminal.lines}
      />

      {/* Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/products/${activeDemo.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white"
        >
          查看详情 →
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white"
        >
          阅读文档
        </Link>
      </div>
    </div>
  );
}
