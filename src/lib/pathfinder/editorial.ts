import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import type { PathfinderCatalogItem } from './catalog-types';

/**
 * AI 动态的编辑型解读。
 *
 * 回答四个问题：发生了什么、为什么值得大学生关注、影响哪些技能、建议做什么。
 * 目录里的 AI 动态原本只有标题和来源摘要，学生看完仍然不知道这跟自己有什么关系。
 *
 * **初稿由模型生成，必须人工确认后才公开**（见 `pathfinder_item_notes.status`）。
 * 这不是流程上的谨慎，而是产品定位的底线：Pathfinder 唯一的差异化资产是
 * 「每条都可追溯、不夸大」，自动发布模型产出等于把它交出去。
 */

/**
 * 提示词版本。
 *
 * **改了下面任何一段提示词就要改这个值**。否则库里会混着两代提示词产出的解读，
 * 而无法分辨哪些该重做——生成时间只能告诉你什么时候跑的，说明不了用的哪一版。
 */
export const EDITORIAL_PROMPT_VERSION = 'v1-2026-08';

/** 生成用的模型。写进每条记录，便于日后判断哪批解读需要重做。 */
export const EDITORIAL_MODEL = 'claude-opus-5';

export const editorialNoteSchema = z.object({
  whatHappened: z.string().describe('这条动态实际宣布或发生了什么，两到三句，只陈述来源里有的事实'),
  whyItMatters: z.string().describe('为什么值得中国大学生关注，两到三句，说清对学习或求职的具体影响'),
  skills: z.array(z.string()).describe('受影响的具体技能或工具名称，2 到 5 个，用中文或通用英文技术名词'),
  suggestedAction: z.string().describe('学生现在可以做的一件具体的事，一到两句，必须是本周就能开始的'),
});

export type EditorialNote = z.infer<typeof editorialNoteSchema>;

const SYSTEM_PROMPT = `你在为「Meteor Pathfinder」写面向中国大学生的技术动态解读。

这个产品的立身之本是可追溯、不夸大。因此有几条硬规则：

1. **只使用给定材料里的事实。** 不要补充材料里没有的数字、日期、价格、性能指标或合作方。
   材料信息不足以支撑某个字段时，就写出你能确定的那部分，不要用常识或印象填补。
2. **不预测、不评级、不喊口号。** 不要写「这将彻底改变」「必将成为标配」这类判断。
   写「它变化了什么」和「对你意味着什么」，把结论留给读者。
3. **建议必须是本周就能开始的一件具体的事**，比如读某份官方文档、跑通某个示例、
   在自己已有的项目里换掉某个调用。不要写「持续关注」「保持学习」这类无法执行的话。
4. **面向大学生**：假设读者是有一定编程基础、正在找实习或做项目的本科生，
   不是行业分析师，也不是完全的新手。
5. 全部用简体中文。技术名词、产品名保留英文原文。

输出的每个字段都会经过人工审核后才发布，所以宁可保守、宁可短，也不要编。`;

/**
 * 组装用户消息。
 *
 * 单独抽出来是为了能在没有网络和 API key 的情况下测试——提示词里漏掉 canonicalUrl
 * 或把摘要截断到无意义，都是不发一次请求就该被发现的问题。
 */
export function buildEditorialPrompt(item: PathfinderCatalogItem): string {
  const summary = item.summary.zh || item.summary.en;
  return [
    '请根据以下材料写解读。材料之外的信息一律不要使用。',
    '',
    `标题：${item.title.zh || item.title.en}`,
    `发布机构：${item.organization.zh || item.organization.en}`,
    `来源：${item.source.name.zh || item.source.name.en}（${item.source.trustLevel === 'official' ? '官方一手来源' : '已交叉核验'}）`,
    `原文地址：${item.canonicalUrl}`,
    item.publishedAt ? `发布时间：${item.publishedAt.slice(0, 10)}` : '',
    '',
    summary ? `来源摘要：${summary}` : '来源未提供摘要，只能依据标题与机构判断，请相应地保守。',
  ].filter(Boolean).join('\n');
}

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY 未配置，无法生成解读');
  }
  cachedClient ??= new Anthropic();
  return cachedClient;
}

/** 未配置 API key 时，后台应显示「未启用」而不是报错按钮。 */
export function isEditorialEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * 为一条 AI 动态生成解读初稿。
 *
 * 只处理 `ai-update`：竞赛、实习、开源任务的卡片上已经有资格、费用、截止时间这些
 * 结构化事实，学生看得懂该做什么；需要解读的是「某公司发布了某模型」这类内容。
 */
export async function generateEditorialNote(
  item: PathfinderCatalogItem,
): Promise<EditorialNote> {
  if (item.itemType !== 'ai-update') {
    throw new Error(`只为 AI 动态生成解读，收到 ${item.itemType}`);
  }

  const response = await getClient().messages.parse({
    model: EDITORIAL_MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    // 材料短、要求明确，不需要深度推理；低 effort 足够且便宜
    output_config: {
      effort: 'low',
      format: zodOutputFormat(editorialNoteSchema),
    },
    messages: [{ role: 'user', content: buildEditorialPrompt(item) }],
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error('模型未返回可解析的解读结构');
  }
  return normalizeEditorialNote(parsed);
}

/**
 * 收紧模型输出。
 *
 * 结构化输出保证了字段存在与类型，但保证不了长度和条数。这里做的是入库前的
 * 最后一道防线：过长的段落会撑坏卡片布局，技能标签超过 5 个就不再是「重点」。
 */
export function normalizeEditorialNote(note: EditorialNote): EditorialNote {
  const trim = (value: string, max: number) => {
    const text = value.trim().replace(/\s+/g, ' ');
    return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
  };

  return {
    whatHappened: trim(note.whatHappened, 300),
    whyItMatters: trim(note.whyItMatters, 300),
    skills: [...new Set(note.skills.map((skill) => skill.trim()).filter(Boolean))].slice(0, 5),
    suggestedAction: trim(note.suggestedAction, 200),
  };
}
