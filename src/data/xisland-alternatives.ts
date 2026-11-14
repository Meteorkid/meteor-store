import type { LocalizedText } from './blog-sections';

/**
 * XIsland 同类工具的对比数据。
 *
 * **事实纪律（改这个文件前必读）**
 *
 * 每个数字都必须能在 `href` / `repo` 里核对到。核对日期见 ALTERNATIVES_VERIFIED_ON，
 * 过了日期就重新核一遍，不要沿用旧值——这类数字变动很快。
 *
 * 2026-11-14 的核实结果推翻了两个此前的内部假设，写在这里防止后来者又走回去：
 *
 * 1. **「竞品只有 4 个代理」只对同名项目 xisland.app 成立**，不能推广到其余同类工具。
 *    Vibe Island 的官方 FAQ 与定价页都写 30 个代理，跟本站持平；
 *    Ping Island 16 个、Open Island 15 个。
 * 2. **所以「集成广度」不是对所有人的差异点**，只对单代理工具
 *    （Notchi 2 个、Vibe Notch 1 个）成立。
 *
 * 同理，这个页面**不允许只留赢的项**。它存在的意义是让正在比较的人相信我们说的是实话，
 * 而不是把人绕进来。删掉输的项等于把这个页面变成一次广告，读者一眼能看出来。
 */

/** 事实核对日期。改动上面任何数字时同步更新这里。 */
export const ALTERNATIVES_VERIFIED_ON = '2026-11-14';

export interface AlternativeProduct {
  id: string;
  name: string;
  /** 官网或仓库，读者点开即可核对 */
  href: string;
  /** 官方仓库（开源项目给出，闭源则指向社区仓库或留空） */
  repo?: string;
  /** 官方声称支持的代理数 */
  agents: number;
  /** 数字的口径差异。数量不能直接横比时，这里说明为什么 */
  agentsNote?: LocalizedText;
  license: LocalizedText;
  pricing: LocalizedText;
  version: string;
  /** 该版本发布日期（YYYY-MM-DD）。无公开日期则为 null */
  released: string | null;
  bestFor: LocalizedText;
  tradeoff: LocalizedText;
  /** 本站产品，渲染时高亮并走站内链接 */
  self?: boolean;
}

/**
 * 顺序即展示顺序：本站排第一（并明确标注），其余按官方声称的代理覆盖降序。
 * 刻意不按「对我们有利」的顺序排。
 */
export const alternativeProducts: AlternativeProduct[] = [
  {
    id: 'xisland',
    name: 'XIsland',
    href: '/products/xisland',
    repo: 'https://github.com/Meteorkid/XIsland',
    agents: 30,
    agentsNote: {
      zh: '30 是集成路线数：29 条只到契约测试通过，1 条完成部分能力的真机验证',
      en: '30 counts integration routes: 29 contract-tested only, 1 partially verified on a real client',
    },
    license: { zh: '分层许可，非开源', en: 'Layered licence, not open source' },
    pricing: { zh: '14 天试用后需授权', en: '14-day trial, then a licence' },
    version: '2.0.18',
    released: '2026-11-06',
    bestFor: {
      zh: '需要中文等五语言界面、审批上下文图谱，或从岛上管理远程 SSH 服务器',
      en: 'You need a five-language UI, an approval context graph, or SSH remote management from the island',
    },
    tradeoff: {
      zh: '用户规模最小，DMG 未做 Apple 公证，且要付费',
      en: 'Smallest user base, DMG is not notarised by Apple, and it is paid',
    },
    self: true,
  },
  {
    id: 'vibe-island',
    name: 'Vibe Island',
    href: 'https://vibeisland.app/',
    repo: 'https://github.com/vibeislandapp/vibe-island',
    agents: 30,
    agentsNote: {
      zh: '官方 FAQ 与定价页均写 30 个；其 GitHub 仓库描述仍写着 25 个，两处未同步',
      en: 'Its FAQ and pricing page both say 30; its GitHub description still says 25 — the two are out of sync',
    },
    license: { zh: '闭源，社区仓库未声明许可证', en: 'Closed source; the community repo declares no licence' },
    pricing: { zh: '一次性 $19.99 / 1 台 Mac，含 1 年更新', en: 'One-time $19.99 per Mac, includes one year of updates' },
    version: '1.0.55',
    released: null,
    bestFor: {
      zh: '想要用户最多、最成熟的商业方案，能接受闭源',
      en: 'You want the most established commercial option and are fine with closed source',
    },
    tradeoff: {
      zh: '闭源，无法自行修改或二次分发',
      en: 'Closed source: you cannot modify or redistribute it',
    },
  },
  {
    id: 'ping-island',
    name: 'Ping Island',
    href: 'https://erha19.github.io/ping-island/',
    repo: 'https://github.com/erha19/ping-island',
    agents: 16,
    license: { zh: 'Apache-2.0', en: 'Apache-2.0' },
    pricing: { zh: '免费', en: 'Free' },
    version: '0.32.1',
    released: '2026-09-26',
    bestFor: {
      zh: '要宽松许可证、打算自己改代码的开源用户',
      en: 'Open-source users who want a permissive licence and intend to change the code',
    },
    tradeoff: {
      zh: '还在 0.x，接口与配置格式可能变动',
      en: 'Still 0.x, so interfaces and config format may change',
    },
  },
  {
    id: 'open-island',
    name: 'Open Island',
    href: 'https://github.com/Octane0411/open-vibe-island',
    repo: 'https://github.com/Octane0411/open-vibe-island',
    agents: 15,
    license: { zh: 'GPL-3.0', en: 'GPL-3.0' },
    pricing: { zh: '免费', en: 'Free' },
    version: '1.3.2',
    released: '2026-11-02',
    bestFor: {
      zh: '要开源、并且希望更新最勤的那一个',
      en: 'You want open source and the busiest release cadence',
    },
    tradeoff: {
      zh: 'GPL-3.0 传染性强，商业二次分发受限',
      en: 'GPL-3.0 is strongly copyleft, which restricts commercial redistribution',
    },
  },
  {
    id: 'notchi',
    name: 'Notchi',
    href: 'https://notchi.app/',
    repo: 'https://github.com/sk-ruban/notchi',
    agents: 2,
    agentsNote: { zh: '仅 Claude Code 与 Codex', en: 'Claude Code and Codex only' },
    license: { zh: 'GPL-3.0', en: 'GPL-3.0' },
    pricing: { zh: '免费', en: 'Free' },
    version: '1.2.7',
    released: '2026-09-19',
    bestFor: {
      zh: '只用 Claude Code / Codex，喜欢角色动画那种轻松的表达',
      en: 'You only use Claude Code or Codex and like the mascot-style presentation',
    },
    tradeoff: {
      zh: '只覆盖两个代理，换别的工具就不适用',
      en: 'Covers two agents only, so it stops working the moment you switch tools',
    },
  },
  {
    id: 'vibe-notch',
    name: 'Vibe Notch',
    href: 'https://vibenotch.app/',
    repo: 'https://github.com/farouqaldori/vibe-notch',
    agents: 1,
    agentsNote: { zh: '仅 Claude Code', en: 'Claude Code only' },
    license: { zh: 'Apache-2.0', en: 'Apache-2.0' },
    pricing: { zh: '免费', en: 'Free' },
    version: '1.3.2',
    released: '2026-04-20',
    bestFor: {
      zh: '只要 Claude Code 的完成通知，越轻越好',
      en: 'You only want completion notifications for Claude Code, as light as possible',
    },
    tradeoff: {
      zh: '最近一次发版停在 2026-04，且只做通知不做审批',
      en: 'Last release was April 2026, and it notifies rather than approves',
    },
  },
];

/** 页面文案。与数据同文件，避免数字和措辞两处各改一遍。 */
export const alternativesPageCopy = {
  eyebrow: { zh: '替代方案', en: 'Alternatives' },
  title: {
    zh: 'XIsland 的替代方案：同类工具怎么选',
    en: 'XIsland alternatives: how the other Mac agent panels compare',
  },
  metaDescription: {
    zh: 'XIsland 与 Vibe Island、Ping Island、Open Island、Notchi、Vibe Notch 的逐项对比：代理覆盖、许可、价格与发版节奏，并说明各自更适合谁。事实标注来源与核对日期。',
    en: 'XIsland compared with Vibe Island, Ping Island, Open Island, Notchi and Vibe Notch: agent coverage, licence, pricing and release cadence, plus who each one actually suits. Every figure is sourced and dated.',
  },
  intro: {
    zh: '如果你正在比较 Mac 上的 AI 代理面板，这一页把已知的事实摊开：谁覆盖多少个代理、什么许可、多少钱、多久发一次版。XIsland 排在第一位，但下面也写了它明显不如别人的地方。',
    en: 'If you are comparing Mac panels for AI coding agents, this page lays out what is verifiable: how many agents each one covers, under what licence, at what price, and how often it ships. XIsland comes first, but the places it clearly loses are written down too.',
  },
  disclosure: {
    zh: '本页由 XIsland 团队维护，不是中立评测。所有数字都能在你点开的链接里核对，核对日期 2026-11-14；如果各项目已经更新，以它们自己的文档为准。发现错误欢迎在 GitHub 提 issue，我们会改。',
    en: 'This page is maintained by the XIsland team, so it is not a neutral review. Every figure is checkable at the link we give; facts were verified on 2026-11-14, and the projects’ own documentation wins if they have moved on. Corrections welcome as GitHub issues.',
  },
  tableHead: {
    product: { zh: '产品', en: 'Product' },
    agents: { zh: '代理覆盖', en: 'Agent coverage' },
    license: { zh: '许可', en: 'Licence' },
    pricing: { zh: '价格', en: 'Pricing' },
    version: { zh: '最新版本', en: 'Latest release' },
    bestFor: { zh: '更适合', en: 'Best for' },
  },
  selfLabel: { zh: '本站产品', en: 'This site’s product' },
  noDate: { zh: '未公开', en: 'Not published' },
  source: { zh: '核对来源', en: 'Source' },
  limitationsTitle: { zh: 'XIsland 不占优的地方', en: 'Where XIsland loses' },
  limitationsIntro: {
    zh: '这几条是真的会让人转身走掉的，写在这里比藏在别处好。',
    en: 'These are the things that will genuinely make people walk away. Better stated here than buried.',
  },
  limitations: [
    {
      zh: '用户规模。GitHub 上只有个位数 star，上面几款是 1000–2500。社区、第三方教程、踩坑记录都更少，遇到问题更可能只有我们自己在回答。',
      en: 'User base. We have single-digit stars on GitHub; the others have 1,000–2,500. There are fewer third-party guides and bug reports, so when something breaks you are more likely to be talking only to us.',
    },
    {
      zh: '安装体验。DMG 没有做 Apple 公证，首次启动要右键「打开」或在终端执行 xattr -cr。这不是「教程问题」，是我们还没买开发者证书。',
      en: 'Install experience. The DMG is not notarised by Apple, so the first launch needs right-click → Open, or xattr -cr in a terminal. That is not a documentation gap; we simply have not bought a developer certificate yet.',
    },
    {
      zh: '「30 个」这个数字不能横着比。它是集成路线数，其中 29 条只到契约测试通过；Vibe Island 也写 30 个，但别人怎么定义「支持」我们不知道。拿数量当结论会误导你自己。',
      en: 'The number 30 does not compare cleanly. It counts integration routes, 29 of which are only contract-tested. Vibe Island also says 30, but we do not know how they define “supported”. Treating the count as the conclusion will mislead you.',
    },
    {
      zh: '不开源。采用分层许可，不是 OSI 认可的开源协议，不能按开源项目的方式复用或再分发。如果你需要改代码，直接看 Open Island 或 Ping Island。',
      en: 'Not open source. It uses a layered licence that is not OSI-approved, so it cannot be reused or redistributed the way open-source projects can. If you need to change the code, look at Open Island or Ping Island instead.',
    },
    {
      zh: '要付费。14 天试用之后需要授权；上面五款里有四款免费开源。',
      en: 'It costs money. After a 14-day trial a licence is required; four of the five others are free and open source.',
    },
  ],
  pickerTitle: { zh: '按你的情况选', en: 'Pick by your situation' },
  picker: [
    {
      need: { zh: '只要 Claude Code 的完成通知', en: 'You only want completion pings for Claude Code' },
      pick: { zh: 'Vibe Notch', en: 'Vibe Notch' },
    },
    {
      need: { zh: '只用 Claude Code 与 Codex，想要轻松一点的表达', en: 'You use Claude Code and Codex and want something lighter' },
      pick: { zh: 'Notchi', en: 'Notchi' },
    },
    {
      need: { zh: '要开源、要能自己改，并且在意许可证宽松', en: 'You want open source you can modify, with a permissive licence' },
      pick: { zh: 'Ping Island', en: 'Ping Island' },
    },
    {
      need: { zh: '要开源，并且希望更新最勤', en: 'You want open source with the busiest release cadence' },
      pick: { zh: 'Open Island', en: 'Open Island' },
    },
    {
      need: { zh: '想要用户最多、最成熟的商业方案', en: 'You want the most established commercial option' },
      pick: { zh: 'Vibe Island', en: 'Vibe Island' },
    },
    {
      need: {
        zh: '需要中文界面、审批上下文图谱，或从岛上管理远程服务器',
        en: 'You need a Chinese UI, an approval context graph, or SSH management from the island',
      },
      pick: { zh: 'XIsland', en: 'XIsland' },
    },
  ],
  backToProduct: { zh: '回到 XIsland 产品页', en: 'Back to the XIsland product page' },
};
