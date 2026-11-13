import type { LocalizedText } from './blog-sections';

/**
 * XIsland 的 AI 代理集成清单。
 *
 * **数据来源**：仓库 README 的「AI integration targets」表格，逐行对应。
 * 2026-11-13 从 README 提取，共 30 条。
 *
 * **措辞纪律（改这个文件前必读）**：
 * README 对每条集成都标注了真实验证状态，绝大多数是
 * 「Contract tests passed; real client verification pending」（契约测试通过、真机验收待完成），
 * 只有 Claude Code 做到了「isolated native Read and island denial verified」（真机验证）。
 *
 * **不得把「契约测试通过」写成「已支持」**——这是对外文案的红线。
 * 产品页的展示口径必须是「N 条集成路线，其中 M 条已通过契约测试」，
 * 而不是「支持 N 个代理」。夸大会被审核者发现，条目被撤，代价大于收益。
 *
 * 更新方式：仓库 README 改动后，重新提取本清单并同步这里的 `status`。
 */

/**
 * 验证状态。三档，严格对应 README 原文：
 * - `verified`：真机端到端验证过（README 用 verified 描述）
 * - `contract`：契约测试通过、真机验收待完成（README 的主流状态）
 * - `contract-partial`：部分能力已验证，其余待完成（如 Claude Code 的 isolated Read）
 */
export type IntegrationStatus = 'verified' | 'contract-partial' | 'contract';

export interface Integration {
  /** 代理 / 客户端名称，用 README 里的写法（中英混排是原文风格，不强行改写） */
  name: string;
  status: IntegrationStatus;
  /** 集成路线，一句话说明用的是什么机制（取自 README 第二列） */
  route: LocalizedText;
}

/** 状态对应的展示文案。刻意不用「已支持 / 未支持」这种二元说法。 */
export const integrationStatusLabels: Record<IntegrationStatus, LocalizedText> = {
  verified: { zh: '真机验证通过', en: 'Verified end-to-end' },
  'contract-partial': { zh: '部分能力已验证', en: 'Partially verified' },
  contract: { zh: '契约测试通过', en: 'Contract tests passed' },
};

/**
 * 产品页集成区块的文案。
 *
 * 放在这里而不是 `messages/*.json`：这段文案与集成数据强耦合，
 * 数据变了文案的 {total} 也要跟着变，放一起才不会漂移。
 * 且 `messages/` 是高频改动区（多人在改），把产品专属文案塞进去
 * 容易和别人的改动互相干扰。
 *
 * `{total}` 与 `{verified}` 由页面传入，不写死数字。
 */
export const integrationSectionCopy = {
  eyebrow: { zh: 'Integrations', en: 'Integrations' },
  title: { zh: '代理集成路线', en: 'Agent integration routes' },
  intro: {
    zh: 'XIsland 的集成广度是它的核心差异。以下 {total} 条路线覆盖主流 AI 编程代理与 IDE，其中 {verified} 条已完成真机验证，其余为契约测试通过、真机验收待完成。',
    en: 'Integration breadth is what sets XIsland apart. These {total} routes cover the mainstream AI coding agents and IDEs. {verified} are verified end-to-end; the rest have passed contract tests and await real-client acceptance.',
  },
  note: {
    zh: '我们如实标注每条路线的验证状态。配置文件存在不等于客户端会加载它并端到端可用，所以这里不做「已全面支持」的笼统声明。',
    en: 'We label the verification status of every route honestly. A config file existing does not prove the client loads it or works end to end, so we avoid blanket claims of full support.',
  },
  toggle: { zh: '展开全部 {total} 条路线', en: 'Show all {total} routes' },
  collapse: { zh: '收起', en: 'Collapse' },
} as const;

/**
 * 把 `{total}` / `{verified}` 这类占位符替换成实际数字。
 *
 * 不用 next-intl 的 `t()`：这段文案不在 `messages/` 里（原因见上方注释），
 * 而 next-intl 只对自己加载的命名空间做插值。这里只有两个变量，
 * 自己替换比把文案搬回 messages 再同步数字更不容易出错。
 */
export function formatIntegrationCopy(
  template: string,
  values: Record<string, number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export const xislandIntegrations: Integration[] = [
  { name: 'Claude Code', status: 'contract-partial', route: { zh: '原生 settings hooks', en: 'Native settings hooks' } },
  { name: 'Codex CLI / 桌面核心', status: 'contract', route: { zh: '原生 hooks.json', en: 'Native hooks.json' } },
  { name: 'Gemini CLI', status: 'contract', route: { zh: '原生 settings hooks；计划支持 ACP', en: 'Native settings hooks; ACP planned' } },
  { name: 'Cursor', status: 'contract', route: { zh: '原生 Cursor hooks', en: 'Native Cursor hooks' } },
  { name: 'Trae / Trae CN / Solo', status: 'contract', route: { zh: '按 IDE 版本分别配置 hooks', en: 'Hooks per IDE edition' } },
  { name: 'OpenCode', status: 'contract', route: { zh: '插件与同实例 SDK', en: 'Plugin and same-instance SDK' } },
  { name: 'Factory Droid', status: 'contract', route: { zh: '原生 hooks.json 或 settings 回退', en: 'Native hooks.json or settings fallback' } },
  { name: 'Qoder CLI / IDE', status: 'contract', route: { zh: '原生 settings hooks', en: 'Native settings hooks' } },
  { name: 'VS Code Copilot', status: 'contract', route: { zh: '本地专用 hooks', en: 'Local-specific hooks' } },
  { name: 'CodeBuddy Code', status: 'contract', route: { zh: 'CLI 原生 settings hooks', en: 'CLI native settings hooks' } },
  { name: 'Qwen Code', status: 'contract', route: { zh: '原生 settings hooks', en: 'Native settings hooks' } },
  { name: 'Kimi Code CLI', status: 'contract', route: { zh: 'TOML hooks；交互走 Wire', en: 'TOML hooks; Wire for interaction' } },
  { name: 'DeepSeek-TUI / Codewhale', status: 'contract', route: { zh: 'Codewhale 0.10.0 hooks', en: 'Codewhale 0.10.0 hooks' } },
  { name: 'Kiro CLI / IDE', status: 'contract', route: { zh: 'Kiro CLI 2.31.0 V3 observer 导出', en: 'Kiro CLI 2.31.0 V3 observer export' } },
  { name: 'Amp', status: 'contract', route: { zh: 'Plugin API', en: 'Plugin API' } },
  { name: 'Pi', status: 'contract', route: { zh: 'TypeScript 扩展', en: 'TypeScript extensions' } },
  { name: 'GLM 系列模型', status: 'contract', route: { zh: '经 Claude Code / OpenCode / Cline / Pi 读取元数据', en: 'Metadata via Claude Code, OpenCode, Cline and Pi' } },
  { name: 'Aider', status: 'contract', route: { zh: 'xisland-aider 启动器与原生通知', en: 'xisland-aider launcher and native notifications' } },
  { name: 'Windsurf / Cascade', status: 'contract', route: { zh: '原生 Cascade hooks', en: 'Native Cascade hooks' } },
  { name: 'Devin CLI', status: 'contract', route: { zh: '原生 CLI hooks（云端单列）', en: 'Native CLI hooks (cloud listed separately)' } },
  { name: 'Amazon Q CLI / IDE', status: 'contract', route: { zh: 'qchat 1.19.7 包装器观测', en: 'qchat 1.19.7 wrapper observation' } },
  { name: 'Tabnine CLI / IDE / OpenCode 插件', status: 'contract', route: { zh: 'JSON hooks', en: 'JSON hooks' } },
  { name: 'Cody IDE / 实验性 CLI', status: 'contract', route: { zh: 'jsonrpc-stdio Agent 观测', en: 'jsonrpc-stdio Agent observation' } },
  { name: 'Cline VS Code / SDK CLI', status: 'contract', route: { zh: 'VS Code 事件文件', en: 'VS Code event files' } },
  { name: 'Continue IDE / cn CLI', status: 'contract', route: { zh: '限时 cn serve 观测', en: 'Time-limited cn serve observation' } },
  { name: 'GitHub Copilot CLI', status: 'contract', route: { zh: '原生 JSON hooks', en: 'Native JSON hooks' } },
  { name: 'Roo Code', status: 'contract', route: { zh: '3.54.0 原生任务 API 伴生组件', en: 'Pinned 3.54.0 native task API companion' } },
  { name: 'PearAI Agent / Continue fork', status: 'contract', route: { zh: '实验性 Roo-fork 观测器（默认关闭）', en: 'Experimental Roo-fork observer (off by default)' } },
  { name: 'Zed 外部与内置代理', status: 'contract', route: { zh: '外部 ACP v1/v2 包装器', en: 'External ACP v1/v2 wrapper' } },
  { name: 'JetBrains AI / Junie', status: 'contract', route: { zh: '外部 ACP v1/v2 包装器', en: 'External ACP v1/v2 wrapper' } },
];

/** 各状态的条数，用于页面上的「N 条路线，其中 M 条已验证」这类表述。 */
export function countIntegrationsByStatus(): Record<IntegrationStatus, number> {
  return xislandIntegrations.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { verified: 0, 'contract-partial': 0, contract: 0 } as Record<IntegrationStatus, number>,
  );
}
