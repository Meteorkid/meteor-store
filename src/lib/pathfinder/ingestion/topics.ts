/**
 * 主题标签的产生。
 *
 * 主题页是给学生找方向用的导航，`tags.topic` 是它唯一的数据源。原始抓取里
 * 没有任何一个字段适合直接当主题——实测 103 种标签中 54 种是噪声：
 *
 * - **仓库流程标签**：`bot-triaged`、`oncall: distributed`、`kind:feature`、
 *   `provider:amazon`、`Domain: enum`、`dynamo-triage-jan2025`。维护者的内部
 *   分诊记号，对外部贡献者没有含义。
 * - **仓库名**：`apache/airflow`、`pytorch/pytorch`。这是「机构」维度已有的信息
 *   （这类条目的 organization 就是仓库名），放进主题会让主题页变成仓库列表。
 * - **地点**：实习条目把 `location` 塞进主题，于是冒出一串城市名，而地点
 *   本来就存在 `region` 字段里。
 * - **机构名与「AI」**：AI 动态一律挂 `['AI', 机构名]`，于是 `AI` 出现 104 次
 *   （等于全部 AI 动态）、`OpenAI` 40 次。每条都有的标签不构成导航，
 *   点进去就是回到未筛选的列表。
 *
 * 所以这里**不做黑名单过滤，而是按词表识别**：主题只可能是 `TOPIC_VOCABULARY`
 * 里的词，从标题、摘要和标签文本中匹配得到。好处是主题页的内容由一份可读的
 * 词表决定，而不是由上游仓库今天新建了什么标签决定——新的噪声标签不需要我们
 * 追加黑名单，它天然就进不来。代价是词表外的长尾主题会缺失，这是有意的取舍：
 * 一个干净但略窄的导航，好过一个什么都有、因而什么都找不到的导航。
 */

/**
 * 受控主题词表。
 *
 * 每项是 `[展示名, 识别模式]`。模式在「标题 + 摘要 + 标签」拼成的文本上做
 * **词边界**匹配——不加词边界的话 `RL` 会命中 `world`、`CV` 会命中 `recv`。
 *
 * 顺序即优先级：一个条目最多挂 `MAX_TOPICS_PER_ITEM` 个主题，靠前的先占位。
 * 把具体方向排在宽泛概念前面，避免所有条目都被「机器学习」一网打尽。
 */
const TOPIC_VOCABULARY: ReadonlyArray<readonly [string, RegExp]> = [
  // —— 具体技术方向，排在前面 ——
  ['Agent', /\b(agent|agents|agentic|tool[- ]use|function[- ]calling|mcp)\b/i],
  ['RAG', /\b(rag|retrieval[- ]augmented|vector (db|database|search)|embedding search)\b/i],
  ['多模态', /\b(multimodal|multi[- ]modal|vlm|vision[- ]language|image[- ]to[- ]text)\b/i],
  ['图像生成', /\b(diffusion|text[- ]to[- ]image|image generation|gan|stable diffusion|dall[- ]?e|sora)\b/i],
  ['语音', /\b(speech|asr|tts|text[- ]to[- ]speech|voice|whisper|audio)\b/i],
  ['具身智能', /\b(robot|robotics|embodied|manipulation|autonomous driving|self[- ]driving)\b/i],
  ['强化学习', /\b(reinforcement learning|\brl\b|rlhf|rlaif|policy gradient|reward model)\b/i],
  ['训练与微调', /\b(pre[- ]?training|fine[- ]?tun\w*|\bsft\b|lora|peft|distillation|quantization)\b/i],
  ['推理部署', /\b(inference|serving|deploy\w*|latency|throughput|kv[- ]cache|vllm|onnx)\b/i],
  ['分布式', /\b(distributed|parallelism|multi[- ]gpu|cluster|sharding|fsdp|deepspeed)\b/i],
  ['评测', /\b(benchmark\w*|evaluation|\beval\b|leaderboard|metric)\b/i],
  ['安全与对齐', /\b(safety|alignment|jailbreak|red[- ]team\w*|guardrail|adversarial|misuse)\b/i],
  ['可解释性', /\b(interpretab\w*|explainab\w*|mechanistic|probing|attribution)\b/i],
  ['自然语言处理', /\b(nlp|natural language|tokeniz\w*|translation|summariz\w*|sentiment)\b/i],
  ['计算机视觉', /\b(computer vision|object detection|segmentation|image classification|\bocr\b)\b/i],
  ['推荐与检索', /\b(recommend\w*|ranking|search relevance|information retrieval)\b/i],
  ['数据工程', /\b(data pipeline|etl|airflow|dag|data quality|streaming|kafka|spark)\b/i],
  // —— 软件工程方向：让开源任务也能有主题 ——
  ['前端', /\b(frontend|front[- ]end|react|vue|css|browser|ui component|next\.?js)\b/i],
  ['后端', /\b(backend|back[- ]end|api|server|microservice|grpc|rest)\b/i],
  ['数据库', /\b(database|\bsql\b|postgres\w*|mysql|sqlite|query planner|index\w*)\b/i],
  ['类型系统', /\b(type system|type checker|typescript|type inference|generics)\b/i],
  ['编译器', /\b(compiler|parser|codegen|\bast\b|lexer|bytecode)\b/i],
  ['测试', /\b(unit test|integration test|test coverage|flaky|regression test)\b/i],
  ['性能优化', /\b(performance|optimiz\w*|memory leak|profil\w*|benchmark regression)\b/i],
  ['开发者工具', /\b(cli|developer tool|debugger|linter|formatter|language server|\blsp\b)\b/i],
  ['文档', /\b(documentation|docs site|api reference|tutorial|getting started)\b/i],
  ['云与基础设施', /\b(kubernetes|k8s|docker|container|terraform|serverless|aws|gcp|azure)\b/i],
  // —— 宽泛兜底，排在最后 ——
  ['大模型', /\b(llm|llms|large language model|gpt|claude|gemini|llama|foundation model)\b/i],
  ['机器学习', /\b(machine learning|deep learning|neural network|transformer|model training)\b/i],
];

/**
 * 一个条目最多挂几个主题。
 *
 * 上限的理由是展示：条目挂太多主题，每个主题页都会塞满同一批条目，导航就
 * 失去区分度了。3 个足以表达「这条是关于什么的」。
 */
export const MAX_TOPICS_PER_ITEM = 3;

/** 词表里全部展示名，供测试与将来的主题页说明使用。 */
export function allTopicNames(): string[] {
  return TOPIC_VOCABULARY.map(([name]) => name);
}

/**
 * 从任意文本中识别主题。
 *
 * 传入的应该是「标题 + 摘要 + 原始标签」拼起来的整段文本：标签虽然大半是噪声，
 * 但其中的有效信号（如 `oncall: distributed` 里的 distributed）仍然值得利用——
 * 按词表匹配意味着我们只取走认识的那部分，噪声部分自然被忽略。
 */
export function inferTopics(text: string, limit = MAX_TOPICS_PER_ITEM): string[] {
  if (!text) return [];
  const topics: string[] = [];
  for (const [name, pattern] of TOPIC_VOCABULARY) {
    if (pattern.test(text)) {
      topics.push(name);
      if (topics.length >= limit) break;
    }
  }
  return topics;
}

/**
 * 条目主题的统一入口：把标题、摘要、原始标签拼起来后按词表识别。
 *
 * 三个来源都传进来是有意的——标题最准但太短，摘要覆盖面大，标签则常常
 * 直接点名了技术领域。合起来匹配比只看其中一个的召回高得多。
 */
export function topicsForItem(input: {
  title?: string | null;
  summary?: string | null;
  labels?: readonly string[];
}): string[] {
  return inferTopics([
    input.title ?? '',
    input.summary ?? '',
    (input.labels ?? []).join(' '),
  ].join(' \n '));
}
