import type { LocalizedText } from './blog-sections';
import { ALTERNATIVES_VERIFIED_ON, alternativeProducts } from './xisland-alternatives';

/**
 * 每个竞品一页的详细对比文案。
 *
 * **为什么拆页**：总表承接的是「有哪些替代品」，而真实查询是
 * 「XIsland vs Vibe Island」这种两两对比。单页写六方对比，每一方只能写一句，
 * 既排不上具体 query，也说不清取舍。
 *
 * **纪律与总表一致**：每一页都必须写「什么时候该选它」，而且要给具体理由，
 * 不能写成「各有千秋」这种废话。数字口径与核对日期统一引用
 * `xisland-alternatives.ts`，不在这里重复——重复就会漂移。
 */

export interface AlternativeSection {
  heading: LocalizedText;
  body: LocalizedText;
}

export interface AlternativeDetail {
  /** 必须与 `alternativeProducts` 里的 id 一致，页面靠它找总表那一行 */
  id: string;
  title: LocalizedText;
  metaDescription: LocalizedText;
  /** 开头一句话结论，直接回答「该选哪个」 */
  verdict: LocalizedText;
  sections: AlternativeSection[];
  /** 什么情况下应该选对方 */
  chooseThem: LocalizedText;
  /** 什么情况下应该选 XIsland */
  chooseUs: LocalizedText;
}

export const alternativeDetails: AlternativeDetail[] = [
  {
    id: 'vibe-island',
    title: { zh: 'XIsland 与 Vibe Island 对比', en: 'XIsland vs Vibe Island' },
    metaDescription: {
      zh: 'XIsland 和 Vibe Island 都声称覆盖 30 个 AI 编程代理，那差异到底在哪：许可、定价、界面语言、审批上下文与远程管理，逐项说明并给出选择建议。',
      en: 'Both XIsland and Vibe Island claim 30 AI coding agents, so where is the difference? Licence, pricing, UI languages, approval context and remote management, with a concrete recommendation.',
    },
    verdict: {
      zh: '代理数量不是差异点——两家都写 30 个。真正的取舍是：它闭源、一次性 $19.99、用户更多更成熟；我们分层许可、目前限免、界面支持五种语言，并且提供审批上下文图谱与 SSH 远程管理。',
      en: 'Agent count is not the differentiator — both claim 30. The real trade-off: it is closed source at a one-time $19.99 with a larger, more established user base; ours uses a layered licence, is currently free to claim, ships five UI languages, and adds an approval context graph plus SSH remote management.',
    },
    sections: [
      {
        heading: { zh: '两边都说 30，但「30」的含义不一样', en: 'Both say 30, but “30” does not mean the same thing' },
        body: {
          zh: '我们的 30 是集成路线数：29 条只通过了契约测试，1 条做到部分能力的真机验证。Vibe Island 官方 FAQ 与定价页都写 30，但它的 GitHub 描述还停在 25，两处没同步；它怎么定义「支持」我们无法确认。所以拿这个数字当结论会误导你自己——真正该看的是你实际用的那个客户端有没有被端到端验证过。',
          en: 'Our 30 counts integration routes: 29 are contract-tested only, one has partial real-client verification. Vibe Island’s FAQ and pricing page both say 30, while its GitHub description still says 25 — the two are out of sync, and we cannot verify how it defines “supported”. Treating the number as the conclusion will mislead you; what matters is whether the client you actually use has been verified end to end.',
        },
      },
      {
        heading: { zh: '许可与价格：一个是买成品，一个是买路线图', en: 'Licence and price: buying a product vs buying a roadmap' },
        body: {
          zh: 'Vibe Island 是闭源商业软件，一次性 $19.99 绑定 1 台 Mac，含 1 年更新——你买的是当下就能用的成熟版本。XIsland 采用分层许可（非 OSI 开源），14 天试用后需要授权，目前处于限免状态。如果你需要能改代码、能二次分发，两家都不合适，去看 Apache-2.0 的 Ping Island 或 GPL-3.0 的 Open Island。',
          en: 'Vibe Island is closed-source commercial software: a one-time $19.99 per Mac with one year of updates — you are buying a mature build that works today. XIsland uses a layered licence (not OSI-approved), requires a licence after a 14-day trial, and is currently free to claim. If you need to modify or redistribute the code, neither fits: look at Apache-2.0 Ping Island or GPL-3.0 Open Island.',
        },
      },
      {
        heading: { zh: 'XIsland 多出来的东西', en: 'What XIsland adds' },
        body: {
          zh: '三个功能在对比表里看不出来：一是审批上下文图谱，审批前能看到任务、计划、文件变更与原因范围，并支持节点批注和较上一轮差异；二是 SSH 远程管理器，可以直接在岛上连接并监控远程服务器；三是五语言界面（中/英/韩/日/法），以及 Kimi、Qwen、DeepSeek、GLM、CodeBuddy、Trae CN 这些中文客户端的接入路线。如果你的工作流里同时有 Claude Code 和国产 CLI，这一条比数量更实用。',
          en: 'Three things a comparison table cannot show: an approval context graph that surfaces the task, plan, file changes and stated reason before you decide, with per-node annotations and round-to-round diffs; an SSH remote manager that connects and monitors servers from the island; and a five-language UI (zh/en/ko/ja/fr) plus integration routes for Chinese clients such as Kimi, Qwen, DeepSeek, GLM, CodeBuddy and Trae CN. If your workflow mixes Claude Code with domestic CLIs, that matters more than a count.',
        },
      },
    ],
    chooseThem: {
      zh: '你想要用户最多、踩坑记录最全的商业方案，能接受闭源，并且不介意按机器付费。',
      en: 'You want the most widely used option with the deepest pool of bug reports, you are fine with closed source, and per-machine pricing is acceptable.',
    },
    chooseUs: {
      zh: '你需要中文界面与国产客户端接入、需要审批前看清上下文，或者想在同一个面板里管远程服务器。',
      en: 'You need a Chinese UI and domestic-client support, want context before approving, or want to manage remote servers from the same panel.',
    },
  },
  {
    id: 'ping-island',
    title: { zh: 'XIsland 与 Ping Island 对比', en: 'XIsland vs Ping Island' },
    metaDescription: {
      zh: 'Ping Island 是 Apache-2.0 的开源方案，覆盖 16 个代理；XIsland 覆盖 30 条路线但非开源。许可、成熟度与功能边界逐项对比。',
      en: 'Ping Island is Apache-2.0 open source covering 16 agents; XIsland covers 30 routes but is not open source. Licence, maturity and feature boundaries compared.',
    },
    verdict: {
      zh: '要能改代码、要宽松许可证，选 Ping Island；要更多代理覆盖、中文界面和审批上下文，选 XIsland。这两条几乎不重叠。',
      en: 'If you need to change the code and want a permissive licence, take Ping Island. If you need broader agent coverage, a Chinese UI and approval context, take XIsland. The two barely overlap.',
    },
    sections: [
      {
        heading: { zh: '许可证决定了你能不能改', en: 'The licence decides whether you can change it' },
        body: {
          zh: 'Ping Island 是 Apache-2.0：可以读源码、改、商用、再分发，只要保留声明。XIsland 是分层许可、非 OSI 开源，不能按开源方式复用。如果你的诉求是「接一个官方还没支持的客户端，我自己写」，Ping Island 是唯一理性的选择——自己改比等我们排期快得多。',
          en: 'Ping Island is Apache-2.0: read it, change it, ship it commercially, redistribute it, as long as you keep the notice. XIsland uses a layered, non-OSI licence and cannot be reused the open-source way. If your goal is “the client I use is not supported yet, I will write the adapter myself”, Ping Island is the rational choice — patching it beats waiting for our roadmap.',
        },
      },
      {
        heading: { zh: '覆盖数量与成熟度是反向的', en: 'Coverage and maturity pull in opposite directions' },
        body: {
          zh: 'Ping Island 官方覆盖 16 个代理，版本还在 0.32.x，意味着接口和配置格式仍可能变动——好处是改起来负担小，坏处是你得跟着变。XIsland 是 30 条路线、版本已在 2.x，但其中 29 条只到契约测试。一个是「少而稳定的 0.x」，一个是「多而未全面验收的 2.x」，选哪个取决于你怕的是断更还是覆盖不够。',
          en: 'Ping Island claims 16 agents at version 0.32.x, which means interfaces and config formats can still move — cheap to patch, but you have to keep up. XIsland has 30 routes at 2.x, yet 29 of them are contract-tested only. One is “narrow but stable at 0.x”, the other “broad but not fully accepted at 2.x”; which is better depends on whether you fear churn or missing coverage.',
        },
      },
    ],
    chooseThem: {
      zh: '你要读源码、要自己写适配器、或者公司政策只允许 Apache/MIT 这类许可证进入生产环境。',
      en: 'You want to read the source, write your own adapter, or your company only allows Apache/MIT-style licences in production.',
    },
    chooseUs: {
      zh: '你用的是国产 CLI 或较冷门的客户端（Kimi、Qwen、CodeBuddy、Trae CN 等），并且希望开箱可用而不是自己维护一份 fork。',
      en: 'You use a domestic or less common client (Kimi, Qwen, CodeBuddy, Trae CN and similar) and want it to work out of the box rather than maintain a fork.',
    },
  },
  {
    id: 'open-island',
    title: { zh: 'XIsland 与 Open Island 对比', en: 'XIsland vs Open Island' },
    metaDescription: {
      zh: 'Open Island 是 GPL-3.0、覆盖 15 个代理、发版最勤的开源方案；XIsland 覆盖 30 条路线但采用非开源的分层许可。适用场景逐项对比。',
      en: 'Open Island is GPL-3.0, covers 15 agents and ships most often among the open-source options; XIsland covers 30 routes under a non-open layered licence. Compared by use case.',
    },
    verdict: {
      zh: '同样要开源，Open Island 的更新节奏比 Ping Island 更密，代价是 GPL-3.0 的传染性。如果你的项目要商用分发，这条许可证会比功能更早拦住你。',
      en: 'If you want open source, Open Island ships more often than Ping Island, at the cost of GPL-3.0 copyleft. If you plan to redistribute commercially, the licence will stop you before any missing feature does.',
    },
    sections: [
      {
        heading: { zh: 'GPL-3.0 意味着什么', en: 'What GPL-3.0 actually implies' },
        body: {
          zh: 'GPL-3.0 要求：你分发基于它的修改版时，必须同样以 GPL 提供源码。自己内部用没问题，但把它打包进商业产品就会触发义务。XIsland 不分发源码，所以不存在这个问题，代价是你也不能改。这两者在「自由」上是相反方向的取舍，不存在哪个更先进。',
          en: 'GPL-3.0 requires that when you distribute a modified version, you also provide the source under GPL. Internal use is fine; bundling it into a commercial product triggers the obligation. XIsland does not distribute source at all, so the question never arises — the price being that you cannot modify it either. These are opposite trades on “freedom”; neither is more advanced.',
        },
      },
      {
        heading: { zh: '发版密度背后的成本', en: 'The cost behind a busy release cadence' },
        body: {
          zh: 'Open Island 在几个开源方案里发版最勤，最近一次是 2026-11-02。频繁发版通常意味着接口还在动，对追新的人是好消息，对「装上就别管」的人是负担。XIsland 的集成路线更多但验收程度不均（29 条只到契约测试），这一点我们在总表里也标了。',
          en: 'Open Island ships most often among the open-source options, with its most recent release on 2026-11-02. A busy cadence usually means the interfaces are still moving — good news if you chase updates, a burden if you want to install and forget. XIsland has more integration routes but uneven verification (29 are contract-tested only), which the summary table flags as well.',
        },
      },
    ],
    chooseThem: {
      zh: '你需要开源、需要频繁跟进上游变化，并且能接受 GPL 的传染性（或只在内部使用）。',
      en: 'You need open source, want to track upstream closely, and can live with GPL copyleft (or only use it internally).',
    },
    chooseUs: {
      zh: '你需要审批上下文、SSH 远程管理或中文界面，并且不希望把 GPL 义务带进你的分发链路。',
      en: 'You need approval context, SSH remote management or a Chinese UI, and do not want GPL obligations anywhere in your distribution chain.',
    },
  },
  {
    id: 'notchi',
    title: { zh: 'XIsland 与 Notchi 对比', en: 'XIsland vs Notchi' },
    metaDescription: {
      zh: 'Notchi 只覆盖 Claude Code 与 Codex 两个代理，用角色动画表达状态；XIsland 覆盖 30 条路线。定位差异与选择建议。',
      en: 'Notchi covers only Claude Code and Codex and expresses status through a character animation; XIsland covers 30 routes. Positioning and a recommendation.',
    },
    verdict: {
      zh: '这不是同一类产品。Notchi 是「给两个代理配一个可爱的状态显示」，XIsland 是「统一管理多代理的控制中心」。你只用一个代理时，前者的复杂度更低。',
      en: 'These are not the same kind of product. Notchi is a charming status display for two agents; XIsland is a control centre for many. If you only run one agent, the former is simply less machinery.',
    },
    sections: [
      {
        heading: { zh: '代理数量在这里真的是差异点', en: 'Here the agent count really is the difference' },
        body: {
          zh: 'Notchi 明确只支持 Claude Code 与 Codex。这类工具的价值随「你同时开几个代理」线性增长：只开一个时，多代理管理是纯粹的负担；开三四个时，缺一个客户端就意味着你还得回终端看。所以选它还是选我们，先数一下你日常开几个。',
          en: 'Notchi explicitly supports Claude Code and Codex only. The value of this category scales with how many agents you run at once: with one, multi-agent management is pure overhead; with three or four, one unsupported client means you are back in the terminal. Count your daily agents before choosing.',
        },
      },
      {
        heading: { zh: '表达方式也是功能的一部分', en: 'Presentation is part of the feature set' },
        body: {
          zh: 'Notchi 用角色动画呈现状态，这在长时间跑任务时确实比一行文字更容易被余光捕捉到。XIsland 走的是信息密度路线：审批图谱、配额、会话列表。没有哪个更对，取决于你要的是「瞄一眼知道在不在跑」还是「在岛上完成决定」。',
          en: 'Notchi uses a character animation for state, which genuinely catches peripheral vision better than a line of text during long runs. XIsland goes for information density: approval graph, quota, session list. Neither is more correct — it depends on whether you want a glanceable “still running?” or want to make decisions from the island.',
        },
      },
    ],
    chooseThem: {
      zh: '你固定只用 Claude Code 或 Codex，喜欢轻量、有性格的界面，不需要审批图谱这类重功能。',
      en: 'You stick to Claude Code or Codex, prefer something light with personality, and do not need heavier features like an approval graph.',
    },
    chooseUs: {
      zh: '你同时跑多个代理（尤其包含国产 CLI），需要在同一个面板里处理审批、问答和远程会话。',
      en: 'You run several agents at once (especially domestic CLIs) and want to handle approvals, questions and remote sessions in one panel.',
    },
  },
  {
    id: 'vibe-notch',
    title: { zh: 'XIsland 与 Vibe Notch 对比', en: 'XIsland vs Vibe Notch' },
    metaDescription: {
      zh: 'Vibe Notch 只做 Claude Code 的完成通知，最近一次发版停在 2026-04；XIsland 覆盖 30 条路线并支持审批。轻量与完整的取舍。',
      en: 'Vibe Notch only sends Claude Code completion notifications and last shipped in April 2026; XIsland covers 30 routes with approvals. Light versus complete.',
    },
    verdict: {
      zh: '如果你只需要「Claude Code 跑完了提醒我一声」，Vibe Notch 足够，而且它的体积和心智负担都最小。问题在于它只做通知、不做审批，且已经半年多没发版。',
      en: 'If all you want is “tell me when Claude Code finishes”, Vibe Notch is enough, with the smallest footprint and mental load. The catch: it notifies rather than approves, and it has not shipped in over half a year.',
    },
    sections: [
      {
        heading: { zh: '通知和审批是两件事', en: 'Notification and approval are two different problems' },
        body: {
          zh: '通知解决的是「我该回来看了」，审批解决的是「我不用回来也能决定」。前者只需要一个 hook 在结束时响一下，后者需要完整的权限往返与回执校验。XIsland 做的是后者，代价是要维护每个客户端的权限协议；Vibe Notch 只做前者，所以轻。先想清楚你要解决哪一个。',
          en: 'Notification answers “time to come back”; approval answers “I can decide without coming back”. The first needs one hook that fires on completion; the second needs a full permission round trip with receipt validation. XIsland does the latter, at the cost of maintaining each client’s permission protocol; Vibe Notch does the former, which is why it stays light. Decide which problem you have.',
        },
      },
      {
        heading: { zh: '半年不发版意味着什么', en: 'What six months without a release implies' },
        body: {
          zh: 'Vibe Notch 最近一次发版是 2026-04-20。Claude Code 的 hook 配置格式在这之后有过变化，老工具不一定会跟着改。选一个停更的工具不是错误，但要接受「客户端升级后它可能静默失效，而且没人修」。',
          en: 'Vibe Notch last shipped on 2026-04-20. Claude Code’s hook configuration format has changed since then, and an inactive tool will not necessarily follow. Choosing a tool that has stopped shipping is not a mistake, but accept that a client upgrade may silently break it with nobody to fix it.',
        },
      },
    ],
    chooseThem: {
      zh: '你只要完成提醒、越轻越好，并且能接受它长期不更新、未来可能因客户端升级失效。',
      en: 'You only want completion pings, want the smallest possible tool, and accept that it may break on a future client upgrade with no fix coming.',
    },
    chooseUs: {
      zh: '你需要在面板里直接批准或拒绝权限、回答代理的提问、确认计划，而不只是收一条通知。',
      en: 'You want to approve or deny permissions, answer agent questions and confirm plans from the panel, not just receive a notification.',
    },
  },
];

/** 文案与总表共用同一个核对日期，避免两处各写一个。 */
export const ALTERNATIVE_DETAILS_VERIFIED_ON = ALTERNATIVES_VERIFIED_ON;

/** 按 id 找总表里对应那一行；找不到说明两处数据不同步。 */
export function findAlternativeRow(id: string) {
  return alternativeProducts.find((item) => item.id === id);
}
