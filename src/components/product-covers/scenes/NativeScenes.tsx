import type { ReactNode } from 'react';

type SceneProps = { productId: string; time: number };

const sans = '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
const mono = '"SFMono-Regular", Menlo, "PingFang SC", monospace';
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const appear = (time: number, start: number) => ease((time - start) / 0.18);

function Label({ x, y, children, size = 20, fill = '#dedede', weight = 400, anchor = 'start' }: {
  x: number; y: number; children: ReactNode; size?: number; fill?: string;
  weight?: number; anchor?: 'start' | 'middle' | 'end';
}) {
  return <text x={x} y={y} fontSize={size} fill={fill} stroke="none" fontWeight={weight} textAnchor={anchor} xmlSpace="preserve">{children}</text>;
}

function Pointer({ x, y, press = false, opacity = 1 }: { x: number; y: number; press?: boolean; opacity?: number }) {
  return <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {press && <circle r="20" fill="#fff" opacity="0.14" />}
    <path d="M0 0 0 25 6 19 11 30 16 27 11 17 20 17Z" fill="#f5f5f5" stroke="#111" strokeWidth="2" />
  </g>;
}

function Gear({ x, y, size = 13 }: { x: number; y: number; size?: number }) {
  return <g transform={`translate(${x} ${y})`} stroke="#929292" strokeWidth="6">
    {[0, 45, 90, 135].map(angle => <path key={angle} d={`M${-size} 0H${size}`} transform={`rotate(${angle})`} />)}
    <circle r={size * 0.68} fill="#929292" stroke="none" /><circle r={size * 0.28} fill="#000" stroke="none" />
  </g>;
}

function AgentFace({ x, y, color }: { x: number; y: number; color: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect width="43" height="43" rx="12" fill={color} opacity="0.12" stroke="#1686ff" strokeWidth="8" />
    <rect width="43" height="43" rx="12" fill="#29292b" stroke="#25669e" strokeWidth="2.5" />
    <circle cx="14" cy="19" r="3.3" fill={color} /><circle cx="30" cy="19" r="3.3" fill={color} />
    <path d="M20 30h5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </g>;
}

// 布局/原文来自 screenshot-1/2；绿勾反馈来自原项目 QuestionAnswerView.swift。
function XIslandScene({ time }: SceneProps) {
  const open = ease((time - 1.15) / 0.5);
  const selected = time >= 3.1;
  const rows = [
    ['Refactor authentication and sessi...', 'acme', 'Claude', '#cc814e'],
    ['Fix TypeScript errors in the API pa...', 'api', 'Cursor', '#a370d6'],
    ['Add unit tests for the markdown p...', 'acme', 'Codex', '#42bd71'],
  ];
  return <g fontFamily={sans}>
    <rect width="800" height="500" fill="#000" />
    <rect x="10" y="12" width="780" height="476" rx="35" fill="#000" stroke="#32362b" strokeWidth="2" />
    <g fill="#969696" transform="translate(43 45)"><path d="M0 11h8l10-8v30l-10-8H0Z" /><path d="M24 9q9 9 0 18M30 3q15 15 0 30" fill="none" stroke="#969696" strokeWidth="3" /></g>
    <Gear x={125} y={63} />
    <Label x={698} y={70} size={20} fill="#6a6a6a" weight={600} anchor="end">{open > 0.5 ? '2 active' : '4 active'}</Label>
    <circle cx="745" cy="62" r="15" fill="#858585" /><path d="m740 57 10 10m0-10-10 10" stroke="#070707" strokeWidth="3" />
    <g opacity={1 - open}>
      {rows.map(([title, project, agent, color], index) => <g key={agent}>
        <rect x="32" y={120 + index * 112} width="736" height="94" rx="27" fill="#101010" stroke="#252525" />
        <AgentFace x={58} y={145 + index * 112} color={color} />
        <circle cx="126" cy={166 + index * 112} r={6 + 1.5 * Math.sin(time * 7 + index)} fill="#168bff" />
        <Label x={150} y={163 + index * 112} size={23} weight={600}>{index === 0 ? title.slice(0, Math.min(title.length, 12 + Math.floor(time * 40))) : title}</Label>
        <Label x={150} y={191 + index * 112} size={20} fill="#787878">{project}</Label>
        <rect x="583" y={172 + index * 112} width="85" height="27" rx="7" fill={color} opacity="0.13" />
        <Label x={625} y={192 + index * 112} size={17} weight={600} fill={color} anchor="middle">{agent}</Label>
        <rect x="680" y={172 + index * 112} width="60" height="27" rx="7" fill="#191919" />
        <Label x={710} y={192 + index * 112} size={17} weight={600} fill="#6c6c6c" anchor="middle">&lt;1m</Label>
      </g>)}
    </g>
    <g opacity={open} transform={`translate(0 ${12 * (1 - open)})`}>
      <AgentFace x={36} y={116} color="#ce7f48" />
      <Label x={99} y={147} size={26} weight={600}>Claude</Label>
      <rect x="641" y="118" width="117" height="36" rx="18" fill="#001521" />
      <Label x={699} y={143} size={21} fill="#168bff" weight={600} anchor="middle">Question</Label>
      <path d="M12 179h776" stroke="#303030" strokeWidth="1.5" />
      <circle cx="46" cy="218" r="16" fill="#168bff" /><Label x={46} y={226} size={24} fill="#000" weight={700} anchor="middle">?</Label>
      <Label x={80} y={225} size={24}>Which approach should we take next?</Label>
      {['Incremental refactor', 'Rewrite module', 'Defer to next sprint'].map((option, index) => <g key={option}>
        <rect x="28" y={259 + index * 70} width="744" height="58" rx="15" fill={selected && index === 0 ? '#071e0d' : '#101010'} stroke={selected && index === 0 ? '#205831' : '#252525'} />
        {selected && index === 0
          ? <path d="m58 288 8 8 14-16" fill="none" stroke="#48c36b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          : <Label x={63} y={296 + index * 70} size={18} fill={selected ? '#3a3a3a' : '#777'} weight={700} anchor="middle">⌘{index + 1}</Label>}
        <Label x={108} y={297 + index * 70} size={24} weight={600} fill={selected && index > 0 ? '#787878' : '#f4f4f4'}>{option}</Label>
      </g>)}
    </g>
    {time > 0.8 && time < 3.65 && <Pointer x={mix(690, 420, ease((time - 0.8) / 1.85))} y={mix(165, 289, ease((time - 1.7) / 1.1))} press={time > 3.02 && time < 3.23} opacity={Math.min(appear(time, 0.8), 1 - ease((time - 3.35) / 0.3))} />}
  </g>;
}

function Album({ productId, x, y, size }: { productId: string; x: number; y: number; size: number }) {
  // 从原 screenshot-2 的 254,123 / 112×112 区域提取真实专辑；复用原图区域，不重新绘制唱片封面。
  return <image id={`${productId}-album`} href="/products/xnook/cover-album.png" x={x} y={y} width={size} height={size} />;
}

// 概览与收起形态来自两张截图；波形直接使用 MusicVisualizerView.swift 的频率公式。
function XNookScene({ productId, time }: SceneProps) {
  const collapsed = ease((time - 0.7) / 0.65) * (1 - ease((time - 2.6) / 0.7));
  const expanded = 1 - collapsed;
  const paused = time > 3.9 && time < 4.5;
  const left = mix(18, 145, collapsed);
  const top = mix(79, 149, collapsed);
  const width = mix(764, 510, collapsed);
  const height = mix(342, 111, collapsed);
  return <g fontFamily={sans}>
    <rect width="800" height="500" fill="#111820" />
    <defs><linearGradient id={`${productId}-sky`} x2="0" y2="1"><stop stopColor="#487a9a" /><stop offset="1" stopColor="#9a9d96" /></linearGradient></defs>
    <rect width="800" height="500" fill={`url(#${productId}-sky)`} />
    <rect x={left} y={top} width={width} height={height} rx={mix(34, 36, collapsed)} fill="#000" />
    <g opacity={expanded}>
      <g stroke="#7dcae6" fill="none" strokeWidth="1.8">{[0, 1, 2, 3].map(i => <rect key={i} x={37 + i % 2 * 10} y={98 + Math.floor(i / 2) * 10} width="7" height="7" rx="1" />)}</g>
      <Label x={66} y={116} size={23} weight={700}>Nook</Label>
      <Label x={310} y={114} size={18} fill="#939393">▶ 媒体</Label><Label x={411} y={114} size={18} fill="#939393">▦ 日历</Label><Label x={509} y={114} size={18} fill="#939393">▱ 文件托盘</Label>
      <path d="m690 99 15 15m0-15-15 15" stroke="#888" strokeWidth="2.3" /><Gear x={744} y={107} size={10} />
      <path d="M18 132h764" stroke="#171717" /><path d="M279 167v219M537 167v219" stroke="#393939" />
      <Label x={148} y={300} size={18} weight={600} anchor="middle">Concerto For Violin And...</Label>
      <Label x={148} y={325} size={16} weight={600} fill="#969696" anchor="middle">斯坦蒂, 英国协奏团 &amp; 特雷沃...</Label>
      <g fill="#d0d0d0" transform="translate(148 360)"><path d="M-68 0-55-9V9ZM-55 0-42-9V9Z" /><path d="M42-9 55 0 42 9ZM55-9 68 0 55 9Z" />{paused ? <path d="m-7-12 18 12-18 12Z" /> : <><rect x="-9" y="-12" width="6" height="24" rx="1.5" /><rect x="3" y="-12" width="6" height="24" rx="1.5" /></>}</g>
      <Label x={405} y={220} size={48} weight={700} anchor="middle">7<tspan fontSize="22" fill="#999"> 月</tspan></Label>
      {['周四', '周五', '周六', '周日', '周一', '周二', '周三'].map((day, index) => <g key={day}>
        <Label x={300 + index * 35} y={272 + (index === 3 ? -2 : 0)} size={16} weight={600} fill={index === 3 ? '#388cef' : '#8a8a8a'} anchor="middle">{day}</Label>
        <Label x={300 + index * 35} y={302 + (index === 3 ? 5 : 0)} size={index === 3 ? 27 : 21} weight={600} fill={index === 3 ? '#388cef' : '#969696'} anchor="middle">{index + 9}</Label>
      </g>)}
      <Label x={408} y={365} size={17} fill="#9b9b9b" weight={500} anchor="middle">▦ 无即将到来的日程</Label>
      <Label x={562} y={196} size={20} weight={700}>▱ 文件托盘</Label><Label x={755} y={196} size={17} fill="#969696" anchor="end">0 个文件</Label>
      <circle cx="657" cy="276" r="39" fill="#061106" />
      <path d="m638 272 8-13h22l9 13v14h-39Zm0 0h10l4 6h12l4-6h9" fill="none" stroke="#67bf71" strokeWidth="2.5" strokeLinejoin="round" />
      <Label x={657} y={341} size={18} fill="#969696" weight={600} anchor="middle">将文件拖放到此处</Label>
    </g>
    <Album productId={productId} x={mix(103, 172, collapsed)} y={mix(174, 164, collapsed)} size={mix(90, 47, collapsed)} />
    <g opacity={collapsed}>
      <defs><clipPath id={`${productId}-ticker`}><rect x="172" y="221" width="452" height="26" /></clipPath></defs>
      <g clipPath={`url(#${productId}-ticker)`}><Label x={172 - Math.max(0, time - 1.4) * 19} y={241} size={20} fill="#747474" weight={600}>o&quot;: 1. Allegro (Ballo, e canto de&apos; villanelli) — 斯坦</Label></g>
      {[0, 1, 2, 3].map(index => { const h = 6 + 25 * Math.abs(Math.sin(index * 1.2 + (2 + index * 0.7) * time)); return <rect key={index} x={602 + index * 7} y={185 - h / 2} width="4.8" height={h} rx="2" fill="#777" />; })}
    </g>
    {time > 0.34 && time < 0.9 && <Pointer x={699} y={110} press={time > 0.67} opacity={appear(time, 0.34)} />}
    {time > 2.2 && time < 2.9 && <Pointer x={mix(590, 442, ease((time - 2.2) / 0.35))} y={202} press={time > 2.59} opacity={Math.min(appear(time, 2.2), 1 - ease((time - 2.73) / 0.17))} />}
    {time > 3.6 && time < 4.7 && <Pointer x={150} y={362} press={(time > 3.88 && time < 4.05) || time > 4.48} opacity={Math.min(appear(time, 3.6), 1 - ease((time - 4.55) / 0.15))} />}
  </g>;
}

function TerminalFrame({ children, background = '#0d0e15' }: { children: ReactNode; background?: string }) {
  return <g fontFamily={mono}>
    <rect width="800" height="500" fill="#1b1a2e" />
    <rect x="18" y="18" width="764" height="464" rx="12" fill={background} />
    {children}
  </g>;
}

// 所有数值均固定为参考截图示例，动画只表现终端输出和焦点移动。
function StatuxScene({ time }: SceneProps) {
  const focus = time < 2.9 ? 0 : time < 3.35 ? 1 : time < 3.8 ? 2 : 3;
  return <TerminalFrame background="#0d0c18">
    <path d="M30 18h740a12 12 0 0 1 12 12v23H18V30a12 12 0 0 1 12-12" fill="#302e40" />
    {['#ff5e57', '#febc2e', '#28c840'].map((color, index) => <circle key={color} cx={40 + index * 20} cy="35" r="6" fill={color} />)}
    <Label x={114} y={41} size={16} fill="#b9b9bf">meteor@Mac — statux — zsh</Label>
    <Label x={40} y={83} size={18} fill="#8795c5">$ statux --help</Label>
    <Label x={40} y={112} size={19} fill="#00d5ef">statux<tspan fill="#eee"> — AI Agent status display</tspan></Label>
    <Label x={40} y={143} size={17} fill="#4eff71">statux --oneshot | -1<tspan fill="#8a98c6">  # Auto-detect tool, output once</tspan></Label>
    <Label x={40} y={168} size={17} fill="#4eff71">statux --tui<tspan fill="#8a98c6">           # Interactive config editor</tspan></Label>
    <path d="M40 188h714" stroke="#6876a1" />
    <g opacity={appear(time, 0.45)}>
      <Label x={40} y={215} size={17} fill="#8795c5">$ {'statux --oneshot'.slice(0, Math.min(16, Math.floor(Math.max(0, time - 0.45) * 36)))}</Label>
    </g>
    <g opacity={appear(time, 1)} fontWeight="600">
      <rect x="40" y="227" width="148" height="25" fill="#6d5adb" /><rect x="188" y="227" width="138" height="25" fill="#005b85" /><rect x="326" y="227" width="240" height="25" fill="#00886f" />
      <Label x={47} y={246} size={17} fill="#fff">mdl:opus-4.7</Label><Label x={196} y={246} size={17} fill="#fff">think:high</Label><Label x={334} y={246} size={17} fill="#fff">tok:in:45k out:12k</Label>
      <Label x={576} y={246} size={16} fill="#fff">out-spd:800/s</Label>
      <rect x="40" y="258" width="178" height="25" fill="#6d5adb" /><rect x="218" y="258" width="156" height="25" fill="#005b85" /><rect x="374" y="258" width="142" height="25" fill="#00886f" />
      <Label x={47} y={277} size={17} fill="#fff">dir:~/projects</Label><Label x={225} y={277} size={17} fill="#fff">Mem:12G/36G</Label><Label x={381} y={277} size={17} fill="#fff">cost:$0.35</Label><Label x={527} y={277} size={16} fill="#fff">time:25m wt:main</Label>
    </g>
    <g opacity={appear(time, 1.65)}>
      <Label x={40} y={310} size={17} fill="#8795c5">$ {'statux --tui'.slice(0, Math.min(12, Math.floor(Math.max(0, time - 1.65) * 32)))}</Label>
    </g>
    <g opacity={appear(time, 2.1)} fill="#58d8de" stroke="#4fc5ca">
      <rect x="40" y="321" width="714" height="150" fill="none" /><path d="M40 347h714M405 347v98M40 445h714" />
      <Label x={56} y={340} size={17} fill="#58d8de">statux TUI Configuration</Label>
      <Label x={56} y={368} size={16} fill="#58d8de">Display</Label><Label x={424} y={368} size={16} fill="#58d8de">Metrics</Label>
      <rect x="53" y={374 + focus * 18} width="345" height="18" fill="#15383d" stroke="none" />
      {['Model name opus-4.7', 'Thinking level high', 'Memory usage 12G/36G', 'Context bar'].map((line, index) => <Label key={line} x={57} y={389 + index * 18} size={16} fill="#58d8de">{focus === index ? '▸' : '·'} {line}</Label>)}
      <rect x="203" y="431" width="91" height="10" fill="#00e1e5" stroke="none" /><Label x={306} y={443} size={16} fill="#58d8de">82%</Label>
      {['▸ Token speed 1.2k/800', '▸ Cost tracker $0.35', '▸ Tool chain Read→Edit'].map((line, index) => <Label key={line} x={424} y={389 + index * 21} size={16} fill="#58d8de">{line}</Label>)}
      <Label x={56} y={464} size={16} fill="#58d8de">[↑↓ nav] [Space toggle] [Enter confirm] [q quit]</Label>
    </g>
  </TerminalFrame>;
}


// README 的启动原文及演示二维码；URL/密码均保留原有占位值。
function PhoneScene({ time }: SceneProps) {
  const command = 'bash macos/phone-control.sh';
  return <TerminalFrame background="#0c1117">
    <Label x={49} y={61} size={19}><tspan fill="#87d99c">$ </tspan>{command.slice(0, Math.min(command.length, 5 + Math.floor(time * 48)))}</Label>
    <g opacity={appear(time, 0.6)}><Label x={49} y={106} size={20} weight={600}>🚀 手机远程控制服务启动中...</Label></g>
    <g opacity={appear(time, 1.05)}><Label x={49} y={147} size={20}><tspan fill="#80db89">✓ </tspan>Tailscale 已连接</Label></g>
    <g opacity={appear(time, 1.45)}><Label x={49} y={178} size={20}><tspan fill="#80db89">✓ </tspan>AoE daemon 已启动</Label></g>
    <g opacity={appear(time, 1.85)}>
      <path d="M49 199h354M49 241h354" stroke="#333a40" strokeWidth="2" />
      <Label x={65} y={227} size={20} weight={600}><tspan fill="#80db89">✓ </tspan>服务已启动！</Label>
    </g>
    <g opacity={appear(time, 2.2)}><Label x={49} y={276} size={19} weight={600}>📱 手机扫码或点击链接：</Label></g>
    <g opacity={appear(time, 2.6)}>
      <image href="/products/claude-phone-control/cover-qr.png" x="49" y="292" width="270" height="97" />
    </g>
    <g opacity={appear(time, 3.1)}><Label x={49} y={408} size={18} fill="#69b8f2">🔗 https://your-mac.tail1234.ts.net/?token=xxxxxx</Label></g>
    <g opacity={appear(time, 3.5)}><Label x={49} y={447} size={19} fill="#dfb342">🔑 密码: 000000</Label><path d="M49 463h354" stroke="#333a40" strokeWidth="2" /></g>
  </TerminalFrame>;
}

// 原文来自本机 python -m omnicrawl.cli --help 的实际输出；只逐行展示 help。
function OmniCrawlScene({ time }: SceneProps) {
  const command = 'python -m omnicrawl.cli --help';
  const lines: [number, number, string, number][] = [
    [36, 95, 'Usage: python -m omnicrawl.cli [OPTIONS] COMMAND [ARGS]...', 1.1],
    [36, 132, '🕷 OmniCrawl — 无所不能的爬虫框架，绕过 WAF，LLM 友好输出', 1.35],
    [53, 193, '--install-completion', 1.75],
    [291, 193, 'Install completion for the current shell.', 1.75],
    [53, 221, '--show-completion', 2],
    [291, 221, 'Show completion for the current shell,', 2],
    [291, 245, 'to copy it or customize the installation.', 2.15],
    [53, 273, '--help', 2.35],
    [291, 273, 'Show this message and exit.', 2.35],
    [53, 344, 'fetch', 2.75],
    [163, 344, '抓取单个 URL 并输出结果', 2.75],
    [53, 370, 'batch', 2.95],
    [163, 370, '批量抓取多个 URL', 2.95],
    [53, 396, 'convert', 3.15],
    [163, 396, '将 HTML 文件转换为 Markdown', 3.15],
    [53, 422, 'version', 3.35],
    [163, 422, '显示版本信息', 3.35],
    [53, 448, 'config', 3.55],
    [163, 448, '查看配置信息', 3.55],
  ];
  return <g fontFamily={mono}>
    <rect width="800" height="500" fill="#0d1117" />
    <Label x={36} y={48} size={23} fill="#a0dda3">$ {command.slice(0, Math.min(command.length, Math.floor(time * 38)))}</Label>
    {time < 1 && <rect x={63 + Math.min(command.length, Math.floor(time * 38)) * 13.8} y="29" width="10" height="23" fill="#a0dda3" opacity={time % 0.4 < 0.2 ? 1 : 0} />}
    <g opacity={appear(time, 1.6)}>
      <path d="M146 157h598q12 0 12 12v109q0 12-12 12H48q-12 0-12-12V169q0-12 12-12h8" fill="none" stroke="#ced7e0" />
      <Label x={63} y={163} size={19}>Options</Label>
    </g>
    <g opacity={appear(time, 2.6)}>
      <path d="M157 310h587q12 0 12 12v128q0 12-12 12H48q-12 0-12-12V322q0-12 12-12h8" fill="none" stroke="#ced7e0" />
      <Label x={63} y={316} size={19}>Commands</Label>
    </g>
    {lines.map(([x, y, text, start]) => <g key={`${x}-${y}`} opacity={appear(time, start)}><Label x={x} y={y} size={y === 132 ? 17.8 : 17} fill="#dce5ee">{text}</Label></g>)}
  </g>;
}

export function NativeScene({ productId, time }: SceneProps) {
  const props = { productId, time: Math.max(0, Math.min(4.8, time)) };
  if (productId === 'xisland') return <XIslandScene {...props} />;
  if (productId === 'xnook') return <XNookScene {...props} />;
  if (productId === 'statux') return <StatuxScene {...props} />;
  if (productId === 'claude-phone-control') return <PhoneScene {...props} />;
  if (productId === 'omnicrawl') return <OmniCrawlScene {...props} />;
  return null;
}
