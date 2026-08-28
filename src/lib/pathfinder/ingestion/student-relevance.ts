import { topicsForItem } from './topics';

/**
 * 非技术内容的识别。
 *
 * 企业博客把三类东西混在同一条 RSS 里：真实的研究与模型发布、面向消费者的
 * 产品营销、以及公关与政策文章。机会库是给学生找「能学、能做的事」用的，
 * 后两类进来只会稀释信噪比——实测 109 条 AI 动态里有 45 条属于此类，
 * 包括「用 Google 搜索办一场完美晚宴的 5 种方式」「OpenAI 任命首席营收官」
 * 「ChatGPT 广告业务扩展到欧洲」。
 *
 * **不能拿「识别不出主题」当判据**。同样在那 45 条里的还有
 * WeatherNext（台风预报突破）、AMIE（医疗 AI 临床视频）、用 Co-Scientist
 * 逆转细胞衰老、手语识别模型 SL2T——它们是真研究，只是词表没覆盖到那些领域。
 * 按「无主题就丢」会把它们一起误杀。所以这里独立识别营销与公关的**文体特征**，
 * 而不是通过主题反推。
 *
 * 判据偏保守：宁可放进来几条营销，也不要丢掉一条研究。丢掉的看不见，
 * 而多出来的至少还能被排序和筛选压下去。
 */

/**
 * 客户案例。
 *
 * 「某公司用我们的产品把某指标提升了 N%」是企业博客的固定文体。对学生没有
 * 可操作性——它既不是能读的技术材料，也不是能参与的事。
 */
const CASE_STUDY_PATTERNS: readonly RegExp[] = [
  /\bhow\s+[\w&.'-]+(\s+[\w&.'-]+)?\s+(uses?|used|is using|scales?|transformed?|built|builds|cuts?|saves?|boosts?|automates?|makes?)\b/i,
  /\b(cuts?|reduced?|saved?|boosted?|increased?)\s+[\w\s]{0,20}\b\d{1,3}%/i,
  /\bwith\s+(chatgpt|copilot|gemini|claude)\s+(work|business|enterprise|for business)\b/i,
];

/**
 * 公司事务与公关。
 *
 * 人事任命、区域扩张、合作发布、捐赠与政策表态。这些是公司新闻，不是技术内容。
 */
const CORPORATE_PATTERNS: readonly RegExp[] = [
  /\b(appoints?|appointed|names?\s+\w+\s+as|welcomes?\s+\w+\s+as|joins?\s+(our|the)\s+board)\b/i,
  /\b(expanding|expands?)\s+(our|[\w]+[''']s)?\s*(presence|operations|availability)\b/i,
  /\b(partnership|partnering)\s+with\b/i,
  /\b(letter|open letter|testimony|statement)\s+to\b/i,
  /\b(commitment|pledge|donat\w+|invests?|investment)\s+(of|to|in)\s+.{0,20}\$/i,
  /\b(our approach to|new policy|policy ideas|democratic oversight|regulat\w+ framework)\b/i,
  /\bnational security\b/i,
];

/**
 * 面向消费者的产品营销。
 *
 * 「N 种方式用 X 做 Y」这类清单文、以及消费级功能更新。判据里刻意排除了
 * 「N 种方式」出现在技术语境的情况——见下面的 RESEARCH_MARKERS 优先级说明。
 */
const CONSUMER_PATTERNS: readonly RegExp[] = [
  /^\d+\s+(new\s+)?(ways?|things|tips|updates?|features?)\b/i,
  /\b(ads?|advertising|pricing|subscription|seats?|plans?)\s+(are\s+)?(coming|expand\w*|launch\w*|test\w*|available)\b/i,
  /\b(shopping|travel|recipes?|dinner party|home decor|holiday|gift guide|weather app)\b/i,
];

/**
 * 研究与技术信号。命中则**一律保留**，即使上面的模式也命中了。
 *
 * 这是防误杀的关键：「Fast-tracking genetic leads to reverse cellular aging」
 * 讲的是用 Co-Scientist 做科研，标题里却有 partnership 味道的措辞；
 * 「From Atari to EVE Online: Building on 15 Years of AI Research in Games」
 * 看起来像回顾软文，实际是研究综述。这类冲突一律按「保留」处理。
 */
const RESEARCH_MARKERS: readonly RegExp[] = [
  /\b(model|models|benchmark\w*|dataset|architecture|algorithm|paper|research|preprint)\b/i,
  /\b(train\w+|fine[- ]?tun\w+|inference|evaluat\w+|ablation|state[- ]of[- ]the[- ]art|\bsota\b)\b/i,
  /\b(open[- ]sourc\w+|release[sd]?\s+.{0,20}\b(model|weights|code|library|sdk|api)\b)/i,
  /\b(accuracy|latency|throughput|parameters|tokens?|embedding\w*|transformer)\b/i,
];

export type ContentRejectReason = 'case-study' | 'corporate' | 'consumer';

/**
 * 返回 null 表示值得收录；否则返回不收录的原因。
 *
 * 只看标题与摘要——它们是抓取阶段唯一稳定可得的文本，正文往往是被截断的
 * RSS 摘要，长度和格式都不可靠。
 */
export function nonTechnicalReason(
  title: string | null | undefined,
  summary?: string | null,
): ContentRejectReason | null {
  const text = `${title ?? ''} ${summary ?? ''}`.trim();
  if (!text) return null;

  // 研究信号优先：宁可放进来几条营销，也不要丢掉一条研究
  if (RESEARCH_MARKERS.some((pattern) => pattern.test(text))) return null;

  /*
   * 能识别出主题的一律保留。
   *
   * 主题词表本身就是一份「技术领域」清单，命中它就是技术性的证据。
   * 注意这个推断**是单向的**：有主题 → 必留；无主题 → 什么也说明不了
   * （WeatherNext、AMIE 这些真研究同样识别不出主题，见文件头）。
   * 反过来用会把研究一起丢掉。
   *
   * 实测这一条救回了「How canvases make agentic workflows visible, steerable,
   * and cost-effective」——它被客户案例的 `how X makes` 模式误伤，
   * 而它实际在讲 agent 工作流。
   */
  if (topicsForItem({ title, summary }).length > 0) return null;

  // 客户案例与消费向清单文只看标题：摘要里常引用产品名，按整段匹配会误伤
  const titleText = title ?? '';
  if (CASE_STUDY_PATTERNS.some((pattern) => pattern.test(titleText))) return 'case-study';
  if (CONSUMER_PATTERNS.some((pattern) => pattern.test(titleText))) return 'consumer';
  if (CORPORATE_PATTERNS.some((pattern) => pattern.test(text))) return 'corporate';
  return null;
}

export function isStudentRelevant(
  title: string | null | undefined,
  summary?: string | null,
): boolean {
  return nonTechnicalReason(title, summary) === null;
}
