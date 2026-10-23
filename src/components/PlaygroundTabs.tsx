'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import TerminalDemo from './TerminalDemo';

interface DemoConfig {
  id: string;
  name: string;
  icon: string;
  descriptionKey: string;
  terminal: {
    title: string;
    prompt?: string;
    lines: ({ type: 'command' | 'output' | 'comment'; delay?: number } & ({ text: string } | { textKey: string }))[];
  };
}

const demos: DemoConfig[] = [
  {
    id: 'omnicrawl',
    name: 'OmniCrawl',
    icon: '🕷️',
    descriptionKey: 'descOmnicrawl',
    terminal: {
      title: 'omnicrawl-demo',
      lines: [
        { type: 'comment', textKey: 'demos.omnicrawl.install' },
        { type: 'command', text: 'pip install omnicrawl' },
        { type: 'output', text: 'Successfully installed omnicrawl-1.2.0' },
        { type: 'comment', textKey: 'demos.omnicrawl.auto' },
        { type: 'command', text: 'python -c "import asyncio; from omnicrawl import Crawler; print(asyncio.run(Crawler(engine=\'auto\').fetch(\'https://example.com\')))"' },
        { type: 'output', text: '[Engine] Auto-selecting: curl_cffi (no JS rendering needed)' },
        { type: 'output', text: '[Fetch]  200 OK  https://example.com  (142ms)' },
        { type: 'output', text: '<html><head><title>Example Domain</title></head>...' },
        { type: 'comment', textKey: 'demos.omnicrawl.protected' },
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
    descriptionKey: 'descExMemory',
    terminal: {
      title: 'ex-memory-demo',
      lines: [
        { type: 'comment', textKey: 'demos.exMemory.import' },
        { type: 'command', text: 'python -m exmemory import --source wechat --file chat_export.json' },
        { type: 'output', textKey: 'demos.exMemory.parsing' },
        { type: 'output', textKey: 'demos.exMemory.chunked' },
        { type: 'output', textKey: 'demos.exMemory.vectorizing' },
        { type: 'output', textKey: 'demos.exMemory.stored' },
        { type: 'comment', textKey: 'demos.exMemory.persona' },
        { type: 'command', text: 'python -m exmemory persona --generate' },
        { type: 'output', textKey: 'demos.exMemory.analyzing' },
        { type: 'output', textKey: 'demos.exMemory.mbti' },
        { type: 'output', textKey: 'demos.exMemory.phrases' },
        { type: 'output', textKey: 'demos.exMemory.emotion' },
        { type: 'output', textKey: 'demos.exMemory.saved' },
        { type: 'comment', textKey: 'demos.exMemory.chat' },
        { type: 'command', text: 'python -m exmemory chat' },
        { type: 'output', textKey: 'demos.exMemory.question' },
        { type: 'output', textKey: 'demos.exMemory.answer' },
      ],
    },
  },
  {
    id: 'statux',
    name: 'Statux',
    icon: '📊',
    descriptionKey: 'descStatux',
    terminal: {
      title: 'statux-demo',
      lines: [
        { type: 'command', text: 'statux init' },
        { type: 'output', textKey: 'demos.statux.detected' },
        { type: 'output', textKey: 'demos.statux.registered' },
        { type: 'output', textKey: 'demos.statux.config' },
        { type: 'command', text: 'statux watch --agent claude-code' },
        { type: 'output', text: '┌─────────────────────────────────────┐' },
        { type: 'output', text: '│  🤖 Claude Code  │  ● Running      │' },
        { type: 'output', text: '│  Task: Refactor auth module        │' },
        { type: 'output', text: '│  Tokens: 12.4K in / 3.2K out       │' },
        { type: 'output', text: '│  Duration: 2m 34s                  │' },
        { type: 'output', text: '│  Files: 3 modified, 1 created      │' },
        { type: 'output', text: '└─────────────────────────────────────┘' },
        { type: 'output', textKey: 'demos.statux.watching' },
      ],
    },
  },
  {
    id: 'tollow',
    name: 'Tollow',
    icon: '⌨️',
    descriptionKey: 'descTollow',
    terminal: {
      title: 'tollow-demo',
      lines: [
        { type: 'command', text: 'npm run dev' },
        { type: 'output', text: '  ▲ Next.js 16.2.9' },
        { type: 'output', text: '  - Local: http://localhost:3000' },
        { type: 'output', text: '' },
        { type: 'output', text: ' ✓ Ready in 1.2s' },
        { type: 'comment', textKey: 'demos.tollow.choose' },
        { type: 'output', text: '' },
        { type: 'output', textKey: 'demos.tollow.books' },
        { type: 'output', textKey: 'demos.tollow.book1' },
        { type: 'output', textKey: 'demos.tollow.book2' },
        { type: 'output', textKey: 'demos.tollow.book3' },
        { type: 'output', text: '' },
        { type: 'output', textKey: 'demos.tollow.chapter' },
        { type: 'output', textKey: 'demos.tollow.quote1' },
        { type: 'output', textKey: 'demos.tollow.quote2' },
        { type: 'output', textKey: 'demos.tollow.quote3' },
      ],
    },
  },
];

export default function PlaygroundTabs() {
  const t = useTranslations('PlaygroundTabs');
  const [activeTab, setActiveTab] = useState(demos[0].id);
  const activeDemo = demos.find((d) => d.id === activeTab) ?? demos[0];
  const lines = useMemo(() => activeDemo.terminal.lines.map((line) => ({
    ...line, text: 'textKey' in line ? t(line.textKey) : line.text,
  })), [activeDemo, t]);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {demos.map((demo) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => setActiveTab(demo.id)}
            aria-pressed={activeTab === demo.id}
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
      <p className="mb-6 text-gray-400">{t(activeDemo.descriptionKey)}</p>

      {/* Terminal */}
      <TerminalDemo
        key={activeDemo.id}
        title={activeDemo.terminal.title}
        prompt={activeDemo.terminal.prompt}
        lines={lines}
      />

      {/* Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/products/${activeDemo.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white"
        >
          {t('viewDetails')}
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white"
        >
          {t('readDocs')}
        </Link>
      </div>
    </div>
  );
}
