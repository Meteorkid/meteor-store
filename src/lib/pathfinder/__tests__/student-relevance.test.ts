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
