import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 37 · Part 3 — 三人评读一篇快时尚案例研究。原创仿真材料，非官方真题。
 *
 * 讨论顺序：供应链证据与工厂记录（配对）→ 成本外部化 → 被忽略的二手与维修渠道 →
 * 问卷数据来源（配对）→ 复述案例主张、外部化批评与论证漏洞（单选）→ 三项替代方案（多选）→ 会后分工。
 * 配对块在前，单选居中，多选在后，题块顺序与录音顺序一致。
 */
export const test37Part3: ListeningLesson = {
  slug: 'test-37-part-3',
  part: 3,
  status: 'published',
  title: { zh: '评读快时尚案例研究', en: 'Reviewing a case study on fast fashion' },
  summary: {
    zh: '导师与两名研究生评读一篇快时尚案例：分别指出供应链证据落到记录薄弱的远郊工厂、劳动成本被转嫁给工人、案例忽略维修与二手市场、问卷依赖顾客自我估计；随后复述案例主张、讨论外部化论证受批评的原因与尚存的漏洞，最后商定租赁、二手购买、本地维修三项替代方案及会后分工。',
    en: 'A tutor and two postgraduates review a fast fashion case: they note distant factories with weak records, labour costs shifted onto workers, ignored repair and second-hand markets, and survey answers relying on shoppers estimates; they restate the main claim, discuss the externalisation criticism and gap, then agree on rental, second-hand buying and local repair, and split the follow-up tasks.',
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
      instruction: 'Which criticism of the case study does each person make? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Evidence traces clothing to distant factories with weak records.' },
        { key: 'B', text: 'Labour costs are shifted onto workers rather than shown in the price.' },
        { key: 'C', text: 'A rental scheme could extend the life of each garment.' },
        { key: 'D', text: 'The case study ignores repair and second-hand markets.' },
        { key: 'E', text: 'Survey responses rely on shoppers own estimates.' },
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
          stem: 'What does the case study claim about cheap clothing?',
          options: [
            { key: 'A', text: 'Cheap clothing lets workers choose shorter working hours.' },
            { key: 'B', text: 'Low prices do not reflect the full environmental and human toll.' },
            { key: 'C', text: 'Most cheap garments are made from locally recycled fabric.' },
          ],
        },
        {
          number: 26,
          stem: 'Why is the externalisation argument criticised?',
          options: [
            { key: 'A', text: 'It ignores the cleaning costs of rental schemes.' },
            { key: 'B', text: 'It never counts what hidden costs would add to a fair price.' },
            { key: 'C', text: 'It overstates the quality of factory paperwork.' },
          ],
        },
        {
          number: 27,
          stem: 'What gap remains in the case study argument?',
          options: [
            { key: 'A', text: 'It has not weighed alternatives that extend garment life.' },
            { key: 'B', text: 'It relies on too many direct interviews with shoppers.' },
            { key: 'C', text: 'It compares prices across too many clothing categories.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE alternatives do they agree on? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE alternatives do they agree on?',
      options: [
        { key: 'A', text: 'clothing rental' },
        { key: 'B', text: 'buying second-hand' },
        { key: 'C', text: 'local repair services' },
        { key: 'D', text: 'new factory automation' },
        { key: 'E', text: 'online influencer ads' },
        { key: 'F', text: 'larger seasonal collections' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Many steps sit in distant factories with weak paperwork and few written records。Neerja 指出证据链条末端是记录薄弱的远郊工厂，对应 A。',
        en: 'Sentence 4: "Many steps sit in distant factories with weak paperwork and few written records". Neerja traces the chain to distant factories with weak records, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：The report argues that labour costs are shifted onto the workers themselves。Ryan 批评劳动成本被转嫁给工人而没有体现在价格里，对应 B。',
        en: 'Sentence 9: "The report argues that labour costs are shifted onto the workers themselves". Ryan criticises the shifting of labour costs onto workers, matching B.',
      },
    },
    {
      number: 23, accepted: ['D'], evidence: 14,
      explanation: {
        zh: '定位句 14：It ignores repair workshops and second-hand markets that keep clothes longer。Aria 指出案例忽略维修工坊与二手市场，对应 D。',
        en: 'Sentence 14: "It ignores repair workshops and second-hand markets that keep clothes longer". Aria notes the study ignores repair and second-hand markets, matching D.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 18,
      explanation: {
        zh: '定位句 18：The responses rely on shoppers own estimates, which are rough and uneven。Neerja 第二次发言指出问卷答案依赖顾客自我估计，对应 E。',
        en: 'Sentence 18: "The responses rely on shoppers own estimates, which are rough and uneven". Neerja’s second criticism is that survey answers rely on shoppers estimates, matching E.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Its main claim is that low prices do not reflect the full environmental toll。第 21 句补充低价让工人和社区承担 hidden costs，即人力代价；两句合起来对应 B。A 的缩短工时和 C 的本地回收面料在录音中均未出现。',
        en: 'Sentence 22: "Its main claim is that low prices do not reflect the full environmental toll". Sentence 21 adds that cheap clothing pushes workers and communities to carry hidden costs, the human side; together they match B. Shorter hours and locally recycled fabric are not mentioned.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：The report never counts what those hidden costs would add to a fair price。外部化论证受批评是因为没算清隐藏成本会让公平价格提高多少，对应 B。A 的租赁清洗成本是后面替代方案的内容，C 的工厂文书质量是供应链问题。',
        en: 'Sentence 24: "The report never counts what those hidden costs would add to a fair price". The criticism is the missing fair-price figure, matching B. Rental cleaning costs come later, and factory paperwork is a supply-chain point.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：The study has not weighed the alternatives that extend a garment life。论证漏洞是没有评估延长衣物寿命的替代方案，对应 A。B 的过多直接访谈和 C 的跨类别比价在录音中没有依据。',
        en: 'Sentence 28: "The study has not weighed the alternatives that extend a garment life". The remaining gap is unweighed reuse alternatives, matching A. Too many interviews and cross-category price comparisons are not claimed.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：The first option is a clothing rental scheme, where garments circulate among members。第一项达成一致的替代方案是服装租赁，对应 A。',
        en: 'Sentence 32: "The first option is a clothing rental scheme, where garments circulate among members". The first agreed alternative is clothing rental, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 34,
      explanation: {
        zh: '定位句 34：The second alternative is buying second-hand from local shops and listings。第二项是二手购买，对应 B。',
        en: 'Sentence 34: "The second alternative is buying second-hand from local shops and listings". The second agreed alternative is buying second-hand, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 36,
      explanation: {
        zh: '定位句 36：The third option is local repair services, from mended hems to new zippers。第三项是本地维修服务，对应 C。',
        en: 'Sentence 36: "The third option is local repair services, from mended hems to new zippers". The third agreed alternative is local repair services, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'neerja', text: 'Shall we start by going through the supply chain evidence in this case study?' },
    { speaker: 'ryan', text: 'Yes, let us map what the report proves before we judge the argument.' },
    { speaker: 'aria', text: 'The case follows one cheap jacket from the city centre shop back to its factory.' },
    { speaker: 'neerja', text: 'Right, and the record runs through several middle steps before it reaches production.' },
    { speaker: 'neerja', text: 'Many steps sit in distant factories with weak paperwork and few written records.' },
    { speaker: 'ryan', text: 'That gap matters, because we cannot verify who actually made the garment.' },
    { speaker: 'aria', text: 'The numbers on labour pay are thinner than the material costs, in my reading.' },
    { speaker: 'neerja', text: 'The jacket passes through three warehouses before it reaches the shop floor.' },
    { speaker: 'ryan', text: 'Let us turn next to how the price hides the true cost of making it.' },
    { speaker: 'ryan', text: 'The report argues that labour costs are shifted onto the workers themselves.' },
    { speaker: 'ryan', text: 'Wages stay low, and long hours are treated as outside the market price.' },
    { speaker: 'neerja', text: 'So the customer sees a cheap jacket, while the producer carries the burden.' },
    { speaker: 'aria', text: 'That externalisation is the strongest part of the case study, I think.' },
    { speaker: 'aria', text: 'The report barely looks at what shoppers do with clothes after they buy.' },
    { speaker: 'aria', text: 'It ignores repair workshops and second-hand markets that keep clothes longer.' },
    { speaker: 'ryan', text: 'Those reuse routes matter because they cut waste without buying anything new.' },
    { speaker: 'neerja', text: 'I would add a source problem on the consumer side of the report.' },
    { speaker: 'neerja', text: 'The survey asks shoppers to estimate how many clothes they buy each season.' },
    { speaker: 'neerja', text: 'The responses rely on shoppers own estimates, which are rough and uneven.' },
    { speaker: 'aria', text: 'People undercount cheap items they forget about, so the totals look lower.' },
    { speaker: 'ryan', text: 'Good points. Now let us restate what the case study claims overall.' },
    { speaker: 'aria', text: 'It claims cheap clothing pushes workers and communities to carry hidden costs.' },
    { speaker: 'ryan', text: 'Its main claim is that low prices do not reflect the full environmental toll.' },
    { speaker: 'neerja', text: 'Why does the externalisation argument draw most criticism from reviewers?' },
    { speaker: 'ryan', text: 'The report never counts what those hidden costs would add to a fair price.' },
    { speaker: 'ryan', text: 'Without that figure, the reader cannot judge how far the discount really goes.' },
    { speaker: 'aria', text: 'It also assumes every cheap item follows the same long supplier chain.' },
    { speaker: 'neerja', text: 'Which part of the argument still feels weakest to you?' },
    { speaker: 'aria', text: 'The study has not weighed the alternatives that extend a garment life.' },
    { speaker: 'aria', text: 'It treats buying less as the only response, and misses existing reuse options.' },
    { speaker: 'ryan', text: 'We should note that gap before writing our own summary of the case.' },
    { speaker: 'neerja', text: 'Shall we list the alternatives the panel wants covered in our response?' },
    { speaker: 'ryan', text: 'The first option is a clothing rental scheme, where garments circulate among members.' },
    { speaker: 'aria', text: 'Rental keeps each piece worn longer, though it adds cleaning and transport trips.' },
    { speaker: 'neerja', text: 'The second alternative is buying second-hand from local shops and listings.' },
    { speaker: 'ryan', text: 'Reuse avoids new production entirely, and suits items still in good condition.' },
    { speaker: 'aria', text: 'The third option is local repair services, from mended hems to new zippers.' },
    { speaker: 'neerja', text: 'Repairs let people keep clothes they know fit, instead of replacing them.' },
    { speaker: 'ryan', text: 'What about the other ideas raised in the seminar notes?' },
    { speaker: 'aria', text: 'New factory automation is listed, but it still sells more new garments each season.' },
    { speaker: 'neerja', text: 'Online influencer ads are just marketing, and they push consumption higher.' },
    { speaker: 'ryan', text: 'Larger seasonal collections run against the reuse direction we are taking.' },
    { speaker: 'aria', text: 'So those three reuse routes are the ones we will write up in the response.' },
    { speaker: 'neerja', text: 'I will check whether the repair shops are named in the source survey.' },
    { speaker: 'ryan', text: 'Aria, could you verify the rental scheme numbers from the original report?' },
    { speaker: 'aria', text: 'Sure, I will note the average rental period and the cleaning costs.' },
    { speaker: 'neerja', text: 'We should flag the weak factory records in our methods summary.' },
    { speaker: 'ryan', text: 'And mark the survey estimates as a limitation rather than hard evidence.' },
    { speaker: 'aria', text: 'That covers the supply chain, the costs, and the three reuse alternatives.' },
    { speaker: 'neerja', text: 'One thing I want to confirm, does the report name the shipping routes?' },
    { speaker: 'ryan', text: 'It names the port, but it leaves the inland trucking leg vague.' },
    { speaker: 'aria', text: 'We can cite that gap as another reason the chain evidence stays partial.' },
    { speaker: 'neerja', text: 'Should we mention the jacket material in our own write-up?' },
    { speaker: 'ryan', text: 'Only in passing; the debate here is about cost and reuse, not fabric quality.' },
    { speaker: 'aria', text: 'I will keep the response focused on the three reuse routes we agreed on.' },
    { speaker: 'neerja', text: 'Fair enough. What deadline did the seminar tutor set for the draft?' },
    { speaker: 'ryan', text: 'The first draft is due before our next meeting, which is on Thursday.' },
    { speaker: 'aria', text: 'We can circulate notes by email on Tuesday to keep the schedule clear.' },
    { speaker: 'neerja', text: 'I will pull the survey tables and check the rough purchase figures again.' },
    { speaker: 'ryan', text: 'I will trace the labour cost section and note where the report stops short.' },
    { speaker: 'aria', text: 'I will summarise the rental and repair options with their main trade-offs.' },
    { speaker: 'neerja', text: 'Does anyone want to add a note on the local second-hand listings?' },
    { speaker: 'aria', text: 'I can add that, since I already looked through those sources last week.' },
    { speaker: 'ryan', text: 'Good, now every section has an owner and a source to check.' },
    { speaker: 'neerja', text: 'Let us meet again next week before the draft goes to the seminar tutor.' },
    { speaker: 'aria', text: 'I think that is everything we need to cover today.' },
  ],
  vocabulary: [
    {
      term: 'supply chain', phonetic: '/səˈplaɪ tʃeɪn/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '供应链（从原料到店铺的整条流转环节）', en: 'the sequence of producers, carriers and shops behind a product' },
      usage: { zh: '不可数概念；trace the supply chain、weak links in the chain。', en: 'Trace the supply chain; weak links in the chain.' },
      collocations: ['the supply chain', 'trace the supply chain', 'a long supply chain'],
      example: { en: 'The report follows the jacket back along its supply chain.', zh: '报告沿供应链把这件夹克追溯回去。' },
      listening: { zh: 'supply 重读第二音节 /ˈplaɪ/；chain 读 /tʃeɪn/。', en: 'Stress supply on the second syllable; chain is /tʃeɪn/.' },
    },
    {
      term: 'externalisation', phonetic: '/ɪkˌstɜːnəlaɪˈzeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '成本外部化（把代价转嫁给工人或环境）', en: 'the shifting of hidden costs onto workers, communities or the environment' },
      usage: { zh: '不可数；cost externalisation。动词是 externalise。', en: 'Uncountable: cost externalisation. The verb is externalise.' },
      collocations: ['cost externalisation', 'the externalisation argument', 'externalisation of costs'],
      example: { en: 'The externalisation of labour costs sits behind the cheap price.', zh: '低价背后是劳动成本的外部化。' },
      listening: { zh: '六个音节，重音在最后 /ˈzeɪ/。', en: 'Six syllables with stress on the final /zeɪ/.' },
    },
    {
      term: 'estimates', phonetic: '/ˈestɪməts/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '估计，粗略估算（未经核实的数值）', en: 'rough figures that a person gives without checking the real source' },
      usage: { zh: '可数名词复数；shoppers estimates、rough estimates。动词是 estimate。', en: 'Plural countable: shoppers estimates, rough estimates. The verb is estimate.' },
      collocations: ['rough estimates', 'shoppers estimates', 'rely on estimates'],
      example: { en: 'The survey relies on shoppers own rough estimates.', zh: '问卷依赖顾客本人的粗略估计。' },
      listening: { zh: '三个音节，重音在第一个 /ˈes/；结尾 -tes 读 /ts/。', en: 'Three syllables with first-syllable stress; the ending is /ts/.' },
    },
    {
      term: 'hidden costs', phonetic: '/ˈhɪdn kɒsts/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '隐藏成本（未计入标价的人力或环境代价）', en: 'burdens behind a price that buyers do not see in the shop' },
      usage: { zh: '复数；carry hidden costs、count the hidden costs。', en: 'Plural: carry hidden costs, count the hidden costs.' },
      collocations: ['hidden costs', 'carry hidden costs', 'count the hidden costs'],
      example: { en: 'Cheap clothing pushes workers to carry hidden costs.', zh: '廉价服装把隐藏成本推给工人承担。' },
      listening: { zh: 'hidden 单音节重音在 hid；costs 结尾 /ts/。', en: 'hidden stresses hid; costs ends in /ts/.' },
    },
    {
      term: 'rental scheme', phonetic: '/ˈrentl skiːm/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '租赁方案（成员循环借穿同一批衣物）', en: 'a service where members borrow garments that circulate among them' },
      usage: { zh: '可数；a clothing rental scheme、run a rental scheme。', en: 'Countable: a clothing rental scheme, run a rental scheme.' },
      collocations: ['a rental scheme', 'a clothing rental scheme', 'the rental scheme numbers'],
      example: { en: 'The first option is a clothing rental scheme for members.', zh: '第一项方案是面向成员的服装租赁。' },
      listening: { zh: 'rental 两个音节重音在第一个；scheme 单音节。', en: 'rental has two syllables with first stress; scheme is one syllable.' },
    },
    {
      term: 'second-hand', phonetic: '/ˌsekəndˈhænd/', partOfSpeech: 'adj.', sentenceIndex: 14,
      meaning: { zh: '二手的，转售再穿的', en: 'previously owned and sold again for further use' },
      usage: { zh: '形容词；second-hand markets、buy second-hand。', en: 'Adjective: second-hand markets, buy second-hand.' },
      collocations: ['second-hand markets', 'buy second-hand', 'second-hand shops'],
      example: { en: 'Repair workshops and second-hand markets keep clothes longer.', zh: '维修工坊与二手市场延长衣物使用时间。' },
      listening: { zh: '复合词，重音在第二部分 /ˈhænd/。', en: 'Compound with stress on the second part hand.' },
    },
  ],
  expressions: [
    {
      phrase: 'map what the report proves', sentenceIndex: 1,
      meaning: { zh: '梳理报告能够证明的内容', en: 'to lay out the claims the evidence actually supports' },
      usage: { zh: 'map 在此指梳理脉络；后接 what 从句。', en: 'Here map means outline; followed by a what-clause.' },
      example: { en: 'Let us map what the report proves before judging it.', zh: '评判前先梳理报告能证明什么。' },
    },
    {
      phrase: 'turn next to', sentenceIndex: 8,
      meaning: { zh: '接下来谈，转到下一话题', en: 'to move the discussion to the next topic' },
      usage: { zh: '讨论中的段落信号；后接名词或动名词。', en: 'Discussion signpost; followed by a noun or gerund.' },
      example: { en: 'Let us turn next to the hidden costs in the price.', zh: '接下来谈价格里隐藏的成本。' },
    },
    {
      phrase: 'extend a garment life', sentenceIndex: 28,
      meaning: { zh: '延长一件衣服的使用时间', en: 'to keep a garment in use for a longer period' },
      usage: { zh: 'extend 后接宾语；extend a garment life、extend product life。', en: 'Transitive: extend a garment life, extend product life.' },
      example: { en: 'The study has not weighed alternatives that extend a garment life.', zh: '研究还没评估延长衣物寿命的替代方案。' },
    },
    {
      phrase: 'rely on', sentenceIndex: 18,
      meaning: { zh: '依赖，靠……为依据', en: 'to base an argument on a particular source' },
      usage: { zh: 'rely on estimates、rely on self-reports；后接名词或动名词。', en: 'Rely on estimates; followed by a noun or gerund.' },
      example: { en: 'The responses rely on shoppers own rough estimates.', zh: '答案依赖顾客本人的粗略估计。' },
    },
    {
      phrase: 'stops short', sentenceIndex: 59,
      meaning: { zh: '停在半途，没有做到最后一步', en: 'to fail to carry an argument through to its end' },
      usage: { zh: 'stop short of doing something；评论论证缺陷常用。', en: 'Stop short of doing something; common when critiquing an argument.' },
      example: { en: 'The report stops short of a fair cost figure.', zh: '报告没能算到公平价格这一步。' },
    },
    {
      phrase: 'in passing', sentenceIndex: 53,
      meaning: { zh: '顺带一提，一笔带过', en: 'mentioned briefly rather than discussed in depth' },
      usage: { zh: '状语短语；mention something in passing。', en: 'Adverbial: mention something in passing.' },
      example: { en: 'We mention fabric quality only in passing today.', zh: '面料质量我们今天只顺带一提。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先抓发言人的批评类型', en: 'Match by the critic’s type of point' },
      body: {
        zh: '第 21 到 24 题每题对应一位发言人，选项分别是证据、成本、渠道、数据四类批评。听前给 A 到 E 标上类别关键词，发言出现 factory records、labour costs、repair markets、own estimates 时直接对号入座。',
        en: 'Items 21 to 24 each match a speaker, and the options split into evidence, cost, channel and data criticisms. Tag A to E with category words beforehand, and match factory records, labour costs, repair markets and own estimates as they appear.',
      },
    },
    {
      title: { zh: '多选排除被否定的方向', en: 'Eliminate options ruled out in the multiple choice' },
      body: {
        zh: '第 28 到 30 题选三项。录音里 automation、influencer ads、larger collections 都被指出仍推高新品消费，属于干扰项；听到 still sells more、push higher、run against 这类评价时，把对应选项划掉。',
        en: 'Items 28 to 30 choose three. Automation, influencer ads and larger collections are all said to push new consumption, so they are distractors. Cross out options when you hear still sells more, push higher or run against.',
      },
    },
    {
      title: { zh: '三人讨论按轮次定位题号', en: 'Track turns to locate the question' },
      body: {
        zh: 'Part 3 是三人轮流发言，题号常跟着发言人切换走。Neerja 两次批评分别对应 21 和 24，Ryan 的成本观点对应 22，Aria 的渠道观点对应 23；听前在题号旁记发言人，避免把上一轮的观点配给下一个人。',
        en: 'Part 3 alternates among three speakers, and question numbers often follow the turn. Neerja speaks twice for 21 and 24, Ryan’s cost point is 22, and Aria’s channel point is 23. Note the speaker beside each number so a previous turn is not matched to the next person.',
      },
    },
  ],
};
