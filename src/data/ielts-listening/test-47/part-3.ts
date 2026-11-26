import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 47 · Part 3 — 三人准备创业孵化路演。原创仿真材料，非官方真题。
 *
 * 讨论顺序：分工认领（配对 21–24）→ 问题定义 → 解决方案 → 市场验证 → 团队与财务测算
 * （单选 25–27）→ 三项纳入路演的材料（多选 28–30）→ 会后分工与截止时间。
 * 配对块在前，单选居中，多选在后，题块顺序与录音顺序一致。
 */
export const test47Part3: ListeningLesson = {
  slug: 'test-47-part-3',
  part: 3,
  status: 'published',
  title: { zh: '创业孵化路演准备', en: 'Preparing a pitch for a startup incubator' },
  summary: {
    zh: '三名学生准备孵化路演：Neerja 先认领问题定义、后讲团队与优势，Ryan 梳理解决方案与财务测算，Aria 负责市场验证；随后讨论问题陈述要呈现客户真实痛点、早期访谈用于核对需求是否真实、投资人看重相关技能与投入；最后确定客户访谈、产品演示与盈亏平衡预测三项纳入路演，明星代言、办公室改造与出口市场夸大为干扰项，并安排会后分工与周三交稿。',
    en: 'Three students prepare an incubator pitch: Neerja takes problem then team, Ryan covers solution and projections, Aria owns validation. They discuss a real pain point, early interviews checking a real need, and skills and commitment investors seek; they agree on interviews, a demo and a break-even forecast, ruling out endorsements, redesign and export claims.',
  },
  accent: { zh: 'Neerja 为印度口音，Ryan 为英式口音，Aria 为美式口音。', en: 'Neerja has an Indian accent, Ryan a British accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which section of the pitch does each person take on? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Defines the customer problem clearly.' },
        { key: 'B', text: 'Outlines the proposed solution.' },
        { key: 'C', text: 'Validates the market with real interviews.' },
        { key: 'D', text: 'Describes the founding team’s strengths.' },
        { key: 'E', text: 'Prepares the financial projections.' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'Ryan' },
        { number: 23, text: 'Aria' },
        { number: 24, text: 'Neerja' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What should the problem statement show?',
          options: [
            { key: 'A', text: 'A broad wish for a better world.' },
            { key: 'B', text: 'A real pain point customers already feel.' },
            { key: 'C', text: 'The features of every rival product.' },
          ],
        },
        {
          number: 26,
          stem: 'Why talk to potential customers early?',
          options: [
            { key: 'A', text: 'To check the solution fits a real need.' },
            { key: 'B', text: 'To collect email addresses for marketing.' },
            { key: 'C', text: 'To confirm which city holds the incubator.' },
          ],
        },
        {
          number: 27,
          stem: 'What do investors look for in the team?',
          options: [
            { key: 'A', text: 'A long list of personal hobbies.' },
            { key: 'B', text: 'A guarantee that no gap remains.' },
            { key: 'C', text: 'Relevant skills and real commitment.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE items will the pitch include? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE items will the pitch include?',
      options: [
        { key: 'A', text: 'customer interviews' },
        { key: 'B', text: 'product demo' },
        { key: 'C', text: 'break-even forecast' },
        { key: 'D', text: 'celebrity endorsements' },
        { key: 'E', text: 'office redesign plans' },
        { key: 'F', text: 'bold export market claims' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I will open with the problem definition, showing who the customers are and what they struggle with。Neerja 认领问题定义，对应 A。',
        en: 'Sentence 3: "I will open with the problem definition, showing who the customers are and what they struggle with". Neerja takes the problem definition, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：My part is the proposed solution, how our product answers that specific pain point。Ryan 梳理解决方案，对应 B。',
        en: 'Sentence 4: "My part is the proposed solution, how our product answers that specific pain point". Ryan outlines the solution, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：I will handle market validation, talking through the customer interviews we have run。Aria 负责市场验证，对应 C。',
        en: 'Sentence 5: "I will handle market validation, talking through the customer interviews we have run". Aria validates the market, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 6,
      explanation: {
        zh: '定位句 6：Once those are settled, I will describe the founding team and the skills each of us brings。Neerja 第二次发言认领团队优势，对应 D。',
        en: 'Sentence 6: "Once those are settled, I will describe the founding team and the skills each of us brings". Neerja’s second task is the team, matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：It has to name a real pain point that customers already feel, not something we assume they want。问题陈述要呈现客户真实痛点，对应 B。A 的笼统愿景与句 13 的 broad wish 被否定，C 的罗列竞品功能在录音中没有依据。',
        en: 'Sentence 9: "It has to name a real pain point that customers already feel, not something we assume they want". A real pain point matches B. A broad wish is ruled out in sentence 13, and rival feature lists are not claimed.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：Early talks matter because they check whether the solution fits a real need。早期访谈用于核对需求是否真实，对应 A。B 的收集邮箱做营销与 C 的确认孵化城市在录音中均未出现。',
        en: 'Sentence 24: "Early talks matter because they check whether the solution fits a real need". Early interviews verify a real need, matching A. Collecting marketing emails and confirming the incubator city are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 30,
      explanation: {
        zh: '定位句 30：Investors look for relevant skills and commitment, more than a long list of hobbies。投资人看重相关技能与投入，对应 C。A 的爱好清单与句中 more than hobbies 相反，B 的零缺口保证与句 33 的诚实指出差距相反。',
        en: 'Sentence 30: "Investors look for relevant skills and commitment, more than a long list of hobbies". Skills and commitment match C. A hobby list contradicts more than hobbies, and a no-gap guarantee contradicts naming gaps honestly.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：The first included item is the customer interviews that back the problem。第一项纳入路演的是客户访谈，对应 A。',
        en: 'Sentence 39: "The first included item is the customer interviews that back the problem". The first included item is customer interviews, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：The second is a product demo showing the core solution in action。第二项是产品演示，对应 B。',
        en: 'Sentence 40: "The second is a product demo showing the core solution in action". The second included item is the product demo, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 41,
      explanation: {
        zh: '定位句 41：The third is the break-even forecast, with costs and pricing laid out plainly。第三项是盈亏平衡预测，对应 C。',
        en: 'Sentence 41: "The third is the break-even forecast, with costs and pricing laid out plainly". The third included item is the break-even forecast, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'neerja', text: 'Thanks for making time to rehearse the incubator pitch before Friday.' },
    { speaker: 'ryan', text: 'Good. We should split the sections first, then check the argument holds together.' },
    { speaker: 'aria', text: 'The panel will judge the problem, solution, market evidence, team and numbers.' },
    { speaker: 'neerja', text: 'I will open with the problem definition, showing who the customers are and what they struggle with.' },
    { speaker: 'ryan', text: 'My part is the proposed solution, how our product answers that specific pain point.' },
    { speaker: 'aria', text: 'I will handle market validation, talking through the customer interviews we have run.' },
    { speaker: 'neerja', text: 'Once those are settled, I will describe the founding team and the skills each of us brings.' },
    { speaker: 'ryan', text: 'Financial projections can come last, after the product and market story are clear.' },
    { speaker: 'neerja', text: 'Before we draft slides, let us agree what a strong problem statement needs.' },
    { speaker: 'ryan', text: 'It has to name a real pain point that customers already feel, not something we assume they want.' },
    { speaker: 'aria', text: 'We should quote what interviewees said, so the problem does not sound invented.' },
    { speaker: 'neerja', text: 'A problem nobody complains about is hard to sell to the incubator panel.' },
    { speaker: 'ryan', text: 'We should also say who suffers most, and how often the pain comes up.' },
    { speaker: 'aria', text: 'That keeps the problem specific, rather than a broad wish for a better world.' },
    { speaker: 'neerja', text: 'Now the solution section. What should the panel see first?' },
    { speaker: 'ryan', text: 'We outline the proposed solution in plain terms, one clear product rather than a long feature list.' },
    { speaker: 'aria', text: 'A short demo helps, but the demo must map directly onto the stated problem.' },
    { speaker: 'ryan', text: 'If a feature does not solve that pain point, it should wait for a later slide.' },
    { speaker: 'neerja', text: 'We should explain what makes our approach different from existing tools.' },
    { speaker: 'aria', text: 'That comparison should be fair, not just a list of weaknesses in rivals.' },
    { speaker: 'ryan', text: 'Good. Next, the market evidence behind the plan.' },
    { speaker: 'aria', text: 'We validated the market through real interviews with potential customers.' },
    { speaker: 'neerja', text: 'How many interviews did we run, and who took part?' },
    { speaker: 'aria', text: 'We spoke to twenty users across two customer types, and recorded what they asked for.' },
    { speaker: 'ryan', text: 'Early talks matter because they check whether the solution fits a real need.' },
    { speaker: 'aria', text: 'If customers describe the same frustration, that supports the problem statement.' },
    { speaker: 'neerja', text: 'We should note which ideas came up repeatedly, and which were one off comments.' },
    { speaker: 'ryan', text: 'Survey numbers alone would be weaker without these conversations behind them.' },
    { speaker: 'aria', text: 'We also checked whether rivals already solve the same job for these users.' },
    { speaker: 'neerja', text: 'Now the team section. What will the panel ask about us?' },
    { speaker: 'ryan', text: 'Investors look for relevant skills and commitment, more than a long list of hobbies.' },
    { speaker: 'aria', text: 'Each founder should name the role they will take and the experience behind it.' },
    { speaker: 'neerja', text: 'Our mix covers product, technical build and customer research, which fits the plan.' },
    { speaker: 'ryan', text: 'Gaps should be named honestly, along with how we will fill them after entry.' },
    { speaker: 'aria', text: 'The panel prefers a team that knows its limits over one that claims to know everything.' },
    { speaker: 'neerja', text: 'Then the financial projections, which Ryan will prepare last.' },
    { speaker: 'ryan', text: 'The numbers show costs, pricing and when the business might break even.' },
    { speaker: 'aria', text: 'We keep the forecast conservative, with clear assumptions the panel can question.' },
    { speaker: 'neerja', text: 'What should the pitch include for the panel to take us seriously?' },
    { speaker: 'ryan', text: 'The first included item is the customer interviews that back the problem.' },
    { speaker: 'aria', text: 'The second is a product demo showing the core solution in action.' },
    { speaker: 'neerja', text: 'The third is the break-even forecast, with costs and pricing laid out plainly.' },
    { speaker: 'ryan', text: 'What about the other ideas raised in our planning notes?' },
    { speaker: 'aria', text: 'Celebrity endorsements are listed, but we have no public figure to name yet.' },
    { speaker: 'neerja', text: 'Office redesign plans are a later concern, after the business model works.' },
    { speaker: 'ryan', text: 'Bold export market claims would outrun the interviews we have actually done.' },
    { speaker: 'aria', text: 'So those three evidence-based items are the ones the pitch will cover.' },
    { speaker: 'neerja', text: 'I will write the problem slides and pull the interview quotes together.' },
    { speaker: 'ryan', text: 'I will draft the solution section and note the main rival differences.' },
    { speaker: 'aria', text: 'I will organise the validation data and check the interview sample covers both types.' },
    { speaker: 'neerja', text: 'Who prepares the break-even forecast?' },
    { speaker: 'ryan', text: 'That stays with me, once the pricing assumptions are agreed in the draft.' },
    { speaker: 'aria', text: 'We should keep each slide to one point, so the panel can follow the story.' },
    { speaker: 'neerja', text: 'A long text slide is harder to defend than a clear chart or quote.' },
    { speaker: 'ryan', text: 'The demo should run under two minutes, leaving time for panel questions.' },
    { speaker: 'aria', text: 'We will rehearse the timing together before the incubator review.' },
    { speaker: 'neerja', text: 'What questions should we expect on the problem side?' },
    { speaker: 'ryan', text: 'The panel may ask how we know the pain point is widespread, not just our own.' },
    { speaker: 'aria', text: 'We answer that with the interview sample and the repeated comments we recorded.' },
    { speaker: 'neerja', text: 'On the solution, they may ask what stops a rival copying the idea quickly.' },
    { speaker: 'ryan', text: 'We describe our data and early relationships, rather than promising an instant lead.' },
    { speaker: 'aria', text: 'The financials will be questioned hardest if the assumptions are unclear.' },
    { speaker: 'neerja', text: 'I will mark any assumption we cannot support with evidence in the notes.' },
    { speaker: 'ryan', text: 'It is better to say the figure is an estimate than to present it as fact.' },
    { speaker: 'aria', text: 'The incubator panel values honest numbers more than optimistic guesses.' },
    { speaker: 'neerja', text: 'When do we circulate the draft slides among the three of us?' },
    { speaker: 'ryan', text: 'By Wednesday evening, so we have Thursday to fix gaps before Friday.' },
    { speaker: 'aria', text: 'I will add the interview counts and the validation charts to my section.' },
    { speaker: 'neerja', text: 'I will check the problem statement matches what the interviews actually said.' },
    { speaker: 'ryan', text: 'And I will keep the projections aligned with the pricing we describe in the pitch.' },
    { speaker: 'aria', text: 'That covers problem, solution, market, team and numbers for today.' },
    { speaker: 'neerja', text: 'I think we are ready to build the first draft.' },
  ],
  vocabulary: [
    {
      term: 'incubator', phonetic: '/ˈɪŋkjubeɪtər/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '创业孵化器，扶持早期项目的机构', en: 'the programme that supports early startup teams' },
      usage: { zh: '可数；the incubator panel、an incubator review。', en: 'Countable: the incubator panel, an incubator review.' },
      collocations: ['the incubator panel', 'the incubator pitch', 'an incubator review'],
      example: { en: 'The incubator panel judges the problem, solution and numbers.', zh: '孵化器评审团评判问题、方案与数据。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈɪŋk/。', en: 'Four syllables with first-syllable stress.' },
    },
    {
      term: 'validation', phonetic: '/ˌvælɪˈdeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 49,
      meaning: { zh: '市场验证，证实需求真实存在', en: 'the check that real customers have the stated need' },
      usage: { zh: '不可数；market validation、validation data。动词是 validate。', en: 'Uncountable: market validation. The verb is validate.' },
      collocations: ['market validation', 'the validation data', 'customer validation'],
      example: { en: 'Market validation comes from real customer interviews.', zh: '市场验证来自真实客户访谈。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈdeɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'projections', phonetic: '/prəˈdʒekʃnz/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '财务预测，对成本与收入的推算', en: 'the forecast of costs, pricing and break-even over time' },
      usage: { zh: '复数；financial projections、the projections。动词是 project。', en: 'Plural: financial projections. The verb is project.' },
      collocations: ['financial projections', 'the projections', 'prepare the projections'],
      example: { en: 'The projections show costs, pricing and break-even timing.', zh: '预测列出成本、定价与盈亏平衡时间。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdʒek/；结尾 /nz/。', en: 'Two syllables with second stress; the ending is /nz/.' },
    },
    {
      term: 'break-even', phonetic: '/ˌbreɪk ˈiːvn/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '盈亏平衡点（收入覆盖成本之时）', en: 'the point at which revenue covers all costs' },
      usage: { zh: '可数/不可数；the break-even forecast、reach break-even。', en: 'Countable or uncountable: the break-even forecast, reach break-even.' },
      collocations: ['the break-even forecast', 'reach break-even', 'break-even timing'],
      example: { en: 'The forecast shows when the business might break even.', zh: '预测说明业务可能何时盈亏平衡。' },
      listening: { zh: '复合词，重音在第二部分 /ˈiːvn/。', en: 'Compound with stress on the second part even.' },
    },
    {
      term: 'rivals', phonetic: '/ˈraɪvlz/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '竞争对手，同类现有产品', en: 'an existing product or company competing in the same space' },
      usage: { zh: '可数；existing rivals、main rival differences。', en: 'Countable: existing rivals, main rival differences.' },
      collocations: ['existing rivals', 'the main rival', 'a rival product'],
      example: { en: 'The comparison should be fair to existing rivals.', zh: '与现有竞品的比较应当公平。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈraɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'assumptions', phonetic: '/əˈsʌmpʃnz/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '测算假设（预测所依据的前提）', en: 'the premises a forecast relies on, open to questioning' },
      usage: { zh: '复数；clear assumptions、pricing assumptions。动词是 assume。', en: 'Plural: clear assumptions, pricing assumptions. The verb is assume.' },
      collocations: ['clear assumptions', 'pricing assumptions', 'unclear assumptions'],
      example: { en: 'The forecast states its assumptions plainly for the panel.', zh: '预测把假设清楚列给评审团看。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈsʌmp/；结尾 /nz/。', en: 'Two syllables with second stress; the ending is /nz/.' },
    },
  ],
  expressions: [
    {
      phrase: 'split the sections', sentenceIndex: 1,
      meaning: { zh: '把路演环节拆开认领', en: 'to divide the pitch sections among the team' },
      usage: { zh: 'split the sections、split the work；讨论分工高频。', en: 'Split the sections, split the work; common when dividing tasks.' },
      example: { en: 'We split the sections before checking the argument.', zh: '先分工认领环节，再检查论证是否连贯。' },
    },
    {
      phrase: 'pain point', sentenceIndex: 9,
      meaning: { zh: '痛点，客户真实遇到的难题', en: 'the frustration customers actually experience' },
      usage: { zh: '可数；a real pain point、solve that pain point。', en: 'Countable: a real pain point, solve that pain point.' },
      example: { en: 'The statement names a real pain point customers feel.', zh: '陈述要点出客户真实感到的痛点。' },
    },
    {
      phrase: 'map directly onto', sentenceIndex: 16,
      meaning: { zh: '直接对应到（所陈述问题）', en: 'to match the stated problem one to one' },
      usage: { zh: 'map onto + 名词；产品论证高频。', en: 'Map onto plus a noun; common in product arguments.' },
      example: { en: 'The demo must map directly onto the stated problem.', zh: '演示必须直接对应所陈述的问题。' },
    },
    {
      phrase: 'back the problem', sentenceIndex: 39,
      meaning: { zh: '为问题陈述提供证据支撑', en: 'to provide evidence behind the stated problem' },
      usage: { zh: 'back + 论点；后接证据名词。', en: 'Back plus an argument; followed by an evidence noun.' },
      example: { en: 'Interviews back the problem with recorded comments.', zh: '访谈用记录下来的评论支撑问题陈述。' },
    },
    {
      phrase: 'outrun', sentenceIndex: 45,
      meaning: { zh: '超出（证据所能支持的范围）', en: 'to go beyond what the actual evidence supports' },
      usage: { zh: 'outrun the evidence；风险表述高频。', en: 'Outrun the evidence; common with overclaiming.' },
      example: { en: 'Export claims would outrun the interviews we have done.', zh: '出口说法会超出我们已有访谈的支撑范围。' },
    },
    {
      phrase: 'keep each slide to one point', sentenceIndex: 52,
      meaning: { zh: '每张幻灯片只讲一个要点', en: 'to limit a slide to a single clear message' },
      usage: { zh: 'keep something to something；路演设计高频。', en: 'Keep something to something; common in slide design.' },
      example: { en: 'Keep each slide to one point so the panel follows the story.', zh: '每张幻灯片只留一个要点，方便评审跟上思路。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按发言顺序认领任务', en: 'Match each turn to its claimed task' },
      body: {
        zh: '第 21 到 24 题对应四次发言：Neerja 两次分别认领问题与团队，Ryan 管方案，Aria 管验证。听前给 A 到 E 标上 problem、solution、validation、team、projection 关键词，轮到谁发言就把该轮任务对号入座。',
        en: 'Items 21 to 24 follow four turns: Neerja speaks twice for problem and team, Ryan owns solution, Aria owns validation. Tag A to E with problem, solution, validation, team and projection beforehand, and match each claim to its speaker turn.',
      },
    },
    {
      title: { zh: '多选区分证据项与空泛主张', en: 'Separate evidence items from vague claims' },
      body: {
        zh: '第 28 到 30 题选三项。录音明确客户访谈、产品演示、盈亏预测为证据项；明星代言、办公室改造、出口市场夸大被说成暂无依据或超出访谈范围。听到 no public figure、later concern、outrun 时把对应选项划掉。',
        en: 'Items 28 to 30 choose three. Interviews, demo and break-even forecast are the evidence items; endorsements, office redesign and export claims are ruled out as unsupported or out of scope. Cross them out on no public figure, later concern and outrun.',
      },
    },
    {
      title: { zh: '团队题抓技能与诚实信号', en: 'Catch skills and honesty signals in the team question' },
      body: {
        zh: '第 27 题问投资人看重什么，录音用 relevant skills and commitment、knows its limits 这类表述。干扰项把爱好清单说成优势、把零缺口当成保证；听到 more than hobbies、name gaps honestly 时回到录音核对真实依据。',
        en: 'Item 27 asks what investors look for; the recording uses relevant skills and commitment and knows its limits. Distractors offer a hobby list or a no-gap guarantee. Check against the recording on more than hobbies and name gaps honestly.',
      },
    },
  ],
};
