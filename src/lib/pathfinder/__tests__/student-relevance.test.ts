import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isStudentRelevant, nonTechnicalReason } from '../ingestion/student-relevance';

/**
 * 用例标题全部取自生产库里真实的 109 条 AI 动态，不是编的。
 */
describe('营销与公关不进机会库', () => {
  it.each([
    ['5 ways to upgrade your home decor with Google Search', 'consumer'],
    ['3 new ways to plan and book travel in Search', 'consumer'],
    ['ChatGPT Ads expands across Europe', 'consumer'],
    ['How Zapier transformed core marketing processes with ChatGPT Work', 'case-study'],
    ['Stampli cuts launch hours by 68% using ChatGPT Work', 'case-study'],
    ['How NVIDIA scales expertise with ChatGPT Work', 'case-study'],
    ['OpenAI appoints Dali Rajic as Chief Revenue Officer', 'corporate'],
    ['OpenAI’s letter to Governor Abbott on responsible AI infrastructure', 'corporate'],
    ['New policy ideas for the Intelligence Age', 'corporate'],
  ])('%s → %s', (title, reason) => {
    expect(nonTechnicalReason(title)).toBe(reason);
  });
});

describe('研究内容绝不能被误杀', () => {
  /*
   * 这一组是这个过滤器最重要的约束。它们同样识别不出主题、字面上也带着
   * partnership / how X does Y 之类的营销措辞，但都是真研究——
   * 「无主题就丢」的做法会把它们一起丢掉，所以判据必须独立于主题。
   */
  it.each([
    'WeatherNext: AI model achieves breakthrough in forecasting cyclones',
    'AMIE, our research medical AI system, demonstrates real-time clinical video consultation',
    'Fast-tracking genetic leads to reverse cellular aging',
    'From Atari to EVE Online: Building on 15 Years of AI Research in Games',
    'Putting sign language AI into users’ hands',
    'Simulate real-world places with Project Genie and Street View',
    'We’re launching Lyria 3.5 in Google Flow Music',
  ])('保留：%s', (title) => {
    expect(isStudentRelevant(title)).toBe(true);
  });

  it('识别出主题的一律保留，即使命中了营销模式', () => {
    // 真实误伤案例：被客户案例的 `how X makes` 模式抓到，实际在讲 agent 工作流
    const title = 'How canvases make agentic workflows visible, steerable, and cost-effective';
    expect(nonTechnicalReason(title)).toBeNull();
  });

  it('研究信号优先于营销模式', () => {
    // 这个推断是单向的：有主题 → 必留；无主题 → 什么也说明不了
    expect(isStudentRelevant('Partnering with X to release a new open-source model')).toBe(true);
  });

  it('空输入不判为非技术', () => {
    expect(nonTechnicalReason('')).toBeNull();
    expect(nonTechnicalReason(null)).toBeNull();
  });
});

describe('案例判据的时态与助动词', () => {
  it.each([
    'How loveholidays is making everyone a builder with Codex',
    'How Acme has transformed its workflow with Copilot',
    'How Acme was able to automate reviews',
    'How Acme scaled support with AI',
  ])('识别：%s', (title) => {
    /*
     * 最初把时态写死在动词列表里（uses / is using / makes），于是每出现一种
     * 新写法就漏一条——`is making` 就是真实漏掉的那条。改成把
     * 「is/has/was + 分词」和词尾变化拆成结构，而不是逐个枚举。
     */
    expect(nonTechnicalReason(title)).toBe('case-study');
  });

  it('案例判据优先于主题信号', () => {
    /*
     * 反过来排的话，同类标题的命运取决于恰好提到哪个产品名：
     * `with ChatGPT Work` 会被判为案例（\bgpt\b 匹不到 ChatGPT），
     * 而 `with Copilot` 因为 Copilot 在「开发者工具」词表里被放行。
     */
    expect(nonTechnicalReason('How NVIDIA scales expertise with ChatGPT Work')).toBe('case-study');
    expect(nonTechnicalReason('How Acme has transformed its workflow with Copilot')).toBe('case-study');
  });

  it('技术性的 how 文不被误伤', () => {
    // agentic 已纳入研究信号，比靠主题词表救回来更准
    expect(nonTechnicalReason('How canvases make agentic workflows visible, steerable, and cost-effective')).toBeNull();
    expect(nonTechnicalReason('How diffusion models work')).toBeNull();
  });
});

describe('中文来源的判据', () => {
  /*
   * 这一组存在的理由：拒绝判据与 topics.ts 的词表原本全是英文正则，
   * 中文条目既拿不到主题、也命中不了英文研究信号——等于整个闸门对中文
   * 来源不生效（实测 AGI Hunt 日报的 topics 是 []，它是「过了闸门」
   * 而不是「被检查过」）。
   */
  it.each([
    ['某银行如何借助我们的平台把审批效率提升 40%', 'case-study'],
    ['任命张伟为首席营收官', 'corporate'],
    ['我们对人工智能监管的看法', 'corporate'],
    ['5 种方式用它规划你的假期旅行', 'consumer'],
    ['广告业务扩展到欧洲市场', 'consumer'],
  ])('识别中文非技术内容：%s', (title, reason) => {
    expect(nonTechnicalReason(title)).toBe(reason);
  });

  it.each([
    ['我们开源了一个 7B 中文基座模型', '包含预训练权重与评测结果，在多项基准上达到同规模最优。'],
    ['用扩散模型把台风路径预报提前 12 小时', '论文已被接收，数据集同步开放。'],
    // 同时命中「如何…用…降低」与百分比两条案例判据，靠研究信号优先救回
    ['如何用强化学习把推理延迟降低 30%', '技术报告：KV cache 调度与量化的组合优化。'],
    // 命中「达成合作」这条公关判据，同样靠研究信号救回
    ['与高校达成合作，共建具身智能实验室', '联合培养方向包含机器人操作与多模态感知。'],
  ])('不误杀中文真研究：%s', (title, summary) => {
    expect(nonTechnicalReason(title, summary)).toBeNull();
  });

  it('中文研究信号必须与中文拒绝判据同时存在', () => {
    /*
     * 只补拒绝判据、不补研究信号的话，中文真研究会失去「研究信号优先」
     * 这层保护而被整片误杀——上面那两条 how/合作 用例就会变红。
     * 这里直接对着源码断言两者都在，避免将来有人只删其中一半。
     */
    const src = readFileSync(path.join(__dirname, '..', 'ingestion', 'student-relevance.ts'), 'utf-8');
    const chinese = /[一-鿿]/;
    const section = (name: string) => {
      const at = src.indexOf(`const ${name}`);
      return src.slice(at, src.indexOf('];', at));
    };
    for (const name of ['CASE_STUDY_PATTERNS', 'CORPORATE_PATTERNS', 'CONSUMER_PATTERNS', 'RESEARCH_MARKERS']) {
      expect(chinese.test(section(name)), name).toBe(true);
    }
  });
});

