import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 44 · Part 3 — 深海采矿纪录片讨论（双人讨论，澳式与英式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：调研证据、利益相关方、科学不确定性、政策建议分工（配对 21–24）→
 * 证据强度、就业担忧群体、生态不确定性（单选 25–27）→ 三条成片共识（多选 28–30）。
 * 题块顺序与录音一致。
 */
export const test44Part3: ListeningLesson = {
  slug: 'test-44-part-3',
  part: 3,
  status: 'published',
  title: { zh: '深海采矿纪录片讨论', en: 'Discussing a documentary on deep-sea mining' },
  summary: {
    zh: '两位剪辑者讨论一部深海采矿纪录片：William 复核调研证据，Thomas 访谈行业利益相关方，海洋科学家梳理科学不确定性，政策顾问起草政策建议。现有证据有限，多来自短期试验而非长期跟踪；担忧就业与生计的是拟议区附近的渔业社区；尚未确定的是物种在扰动后数十年如何恢复。成片保留谨慎复核证据、访谈双方利益群体、先行设置保障措施三点，不主推采矿，也不隐藏不确定结论。',
    en: 'Two editors discuss a mining documentary. William checked survey evidence, Thomas interviewed stakeholders, the scientist mapped uncertainties, the advisor wrote recommendations. Evidence comes from short trials; fishing communities raised livelihood fears; multi-decade recovery is unknown. The cut keeps cautious review, two-sided interviews and safeguards, with no promotion or hidden doubts.',
  },
  accent: { zh: 'William 为澳式口音英语，Thomas 为英式口音英语。', en: 'William speaks Australian English, and Thomas speaks British English.' },
  speechRate: '+3%',
  cast: [
    { id: 'william', label: 'WILLIAM', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each task with the person who handles it. Write the correct letter, A, B, C, D or E next to questions 21–24.',
      options: [
        { key: 'A', text: 'William' },
        { key: 'B', text: 'Thomas' },
        { key: 'C', text: 'the marine scientist' },
        { key: 'D', text: 'the policy advisor' },
        { key: 'E', text: 'the director' },
      ],
      items: [
        { number: 21, text: 'reviewed the survey evidence' },
        { number: 22, text: 'spoke with industry stakeholders' },
        { number: 23, text: 'mapped scientific uncertainties' },
        { number: 24, text: 'drafted policy recommendations' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How strong is the evidence on seabed damage?',
          options: [
            { key: 'A', text: 'Limited, mostly from small trials rather than long-term follow-up' },
            { key: 'B', text: 'Proved beyond doubt that mining destroys all deep life' },
            { key: 'C', text: 'Already enough to ban every deep operation' },
          ],
        },
        {
          number: 26,
          stem: 'Which group raised jobs and livelihood concerns?',
          options: [
            { key: 'A', text: 'Fishing communities near the proposed zone' },
            { key: 'B', text: 'Port maintenance crews from the industry' },
            { key: 'C', text: 'Deep-water research volunteers' },
          ],
        },
        {
          number: 27,
          stem: 'What uncertainty remains about deep-sea ecosystems?',
          options: [
            { key: 'A', text: 'How species recover after disturbance over decades' },
            { key: 'B', text: 'Where the nearest research vessel can dock' },
            { key: 'C', text: 'Which camera model records the clearest mud' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE points do the editors agree on? Choose three letters, A–E.',
      select: 3,
      stem: 'Which THREE points do the editors agree on?',
      options: [
        { key: 'A', text: 'reviewed the survey evidence cautiously' },
        { key: 'B', text: 'interviewed the stakeholder groups on both sides' },
        { key: 'C', text: 'proposed safeguards before any extraction' },
        { key: 'D', text: 'promote deep-sea mining outright' },
        { key: 'E', text: 'hide uncertain findings to strengthen the case' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I reviewed the survey evidence myself, going through the sediment samples and the camera trawls。复核调研证据由 William 负责，对应 A。',
        en: 'Sentence 3: "I reviewed the survey evidence myself", matching A. William owns the evidence review.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Then I spoke with industry stakeholders, including the mining companies and their contractors。访谈行业利益相关方由 Thomas 负责，对应 B。',
        en: 'Sentence 6: "I spoke with industry stakeholders", matching B. Thomas conducts the industry interviews.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：The marine scientist on our team mapped the open questions around the deep ecosystems。梳理科学不确定性由海洋科学家负责，对应 C。',
        en: 'Sentence 9: "the marine scientist on our team mapped the open questions", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 11,
      explanation: {
        zh: '定位句 11：The policy advisor drafted the recommendations that close the film。起草政策建议由政策顾问负责，对应 D。导演只看成片，不承担这些分工。',
        en: 'Sentence 11: "the policy advisor drafted the recommendations", matching D. The director only reviews the cut.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：The evidence is limited, mostly from small trials rather than long-term follow-up。证据有限、多来自短期试验，对应 A。彻底摧毁生命、足以全面禁令都被表述排除。',
        en: 'Sentence 17: the evidence is "limited, mostly from small trials", matching A. Total destruction and a total ban are not stated.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：The communities’ livelihood concern comes up before any industry promise of new work。提出生计担忧的是渔业社区，对应 A。港口维修队伍是行业方，研究志愿者未提及。',
        en: 'Sentence 21: the communities’ livelihood concern comes first, matching A. Port crews are industry side, and research volunteers are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：The remaining uncertainty is how species recover after disturbance over decades。未解的是物种数十年后的恢复情况，对应 A。船只停靠地点、相机型号均与生态不确定性无关。',
        en: 'Sentence 25: the remaining uncertainty is "how species recover after disturbance over decades", matching A. Docking and camera choice are unrelated to the ecology.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：we reviewed the survey evidence cautiously, and we show the gaps alongside the results。谨慎复核调研证据是共识项，对应 A。',
        en: 'Sentence 27: the survey evidence was reviewed cautiously with gaps shown alongside results, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：the film interviews the stakeholder groups on both sides of the proposal。访谈双方利益群体是共识项，对应 B。',
        en: 'Sentence 28: the film interviews stakeholder groups on both sides, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：the script proposes safeguards before any extraction goes ahead。先行设置保障措施是共识项，对应 C；D 的主推采矿与 E 的隐藏不确定结论在句 30、31 被明确否定。',
        en: 'Sentence 29: the script proposes safeguards before extraction, matching C. Outright promotion in D and hiding uncertainty in E are rejected in sentences 30 and 31.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'Thanks for making the time to go over the documentary we are editing on deep-sea mining.' },
    { speaker: 'william', text: 'Right. We have three sources in the cut, the survey team, the industry voices and the policy side.' },
    { speaker: 'thomas', text: 'Before we choose the closing line, let us fix who covered which strand of the research.' },
    { speaker: 'william', text: 'I reviewed the survey evidence myself, going through the sediment samples and the camera trawls.' },
    { speaker: 'thomas', text: 'You looked at the raw seabed footage rather than the press summaries.' },
    { speaker: 'william', text: 'Yes, and I noted where the sample sites were clustered in the survey map.' },
    { speaker: 'thomas', text: 'Then I spoke with industry stakeholders, including the mining companies and their contractors.' },
    { speaker: 'william', text: 'Did they describe the equipment as low impact on the sediment?' },
    { speaker: 'thomas', text: 'They argued the collectors scrape only the top layer, and leave the deeper seabed intact.' },
    { speaker: 'william', text: 'The marine scientist on our team mapped the open questions around the deep ecosystems.' },
    { speaker: 'thomas', text: 'She listed what we still do not know about recovery over long periods.' },
    { speaker: 'william', text: 'The policy advisor drafted the recommendations that close the film.' },
    { speaker: 'thomas', text: 'He set out what rules would apply before any extraction could begin.' },
    { speaker: 'william', text: 'The director stays outside these strands, and only comments on the cut later.' },
    { speaker: 'thomas', text: 'Now how strong is the evidence on damage to the seabed?' },
    { speaker: 'william', text: 'The damage record comes from short trials, not decades of monitoring after the machines leave.' },
    { speaker: 'thomas', text: 'So we should not present the findings as settled fact about long-term effects.' },
    { speaker: 'william', text: 'The evidence is limited, mostly from small trials rather than long-term follow-up.' },
    { speaker: 'thomas', text: 'Which stakeholder group raised the strongest concern about jobs and livelihood?' },
    { speaker: 'william', text: 'The fishing communities near the proposed zone told us their catches depend on the same seabed.' },
    { speaker: 'thomas', text: 'They feared collectors could disturb grounds their families have fished for generations.' },
    { speaker: 'william', text: 'The communities’ livelihood concern comes up before any industry promise of new work.' },
    { speaker: 'thomas', text: 'What scientific uncertainty still hangs over the deep-sea ecosystems?' },
    { speaker: 'william', text: 'We cannot say how species rebound after the sediment settles, because recovery studies are so short.' },
    { speaker: 'thomas', text: 'The slow growth of deep corals means a disturbance may take many decades to heal.' },
    { speaker: 'william', text: 'The remaining uncertainty is how species recover after disturbance over decades.' },
    { speaker: 'thomas', text: 'Let us settle the three points the final cut should keep.' },
    { speaker: 'william', text: 'First, we reviewed the survey evidence cautiously, and we show the gaps alongside the results.' },
    { speaker: 'thomas', text: 'Second, the film interviews the stakeholder groups on both sides of the proposal.' },
    { speaker: 'william', text: 'Third, the script proposes safeguards before any extraction goes ahead.' },
    { speaker: 'thomas', text: 'We did not agree to promote mining outright, and the voiceover must stay neutral on that.' },
    { speaker: 'william', text: 'Nor do we hide uncertain findings to make the case look stronger.' },
    { speaker: 'thomas', text: 'The editorial line is that the science is still incomplete, and policy should move slowly.' },
    { speaker: 'william', text: 'The survey evidence in the film comes from cameras and sediment cores the team collected.' },
    { speaker: 'thomas', text: 'We should check that the map shows the three trial sites, not a single chosen frame.' },
    { speaker: 'william', text: 'The industry interviews talk about jobs in the port and maintenance crews.' },
    { speaker: 'thomas', text: 'But those figures rest on plans that have not been tested at full scale.' },
    { speaker: 'william', text: 'The marine scientist explains why deep animals grow slowly and live to great age.' },
    { speaker: 'thomas', text: 'She cautions that the same slowness makes them poor at bouncing back.' },
    { speaker: 'william', text: 'The policy advisor frames safeguards as environmental study, noise limits and restoration funds.' },
    { speaker: 'thomas', text: 'Each safeguard would need monitoring after the first trial, not only before it.' },
    { speaker: 'william', text: 'There is pressure to keep the film short and to one clear message.' },
    { speaker: 'thomas', text: 'Yet leaving the uncertainty out would overstate what the data can prove.' },
    { speaker: 'william', text: 'We can give each side a fair hearing without taking a side in the debate.' },
    { speaker: 'thomas', text: 'What do we do about the viewer who wants a definite verdict?' },
    { speaker: 'william', text: 'We say plainly that long-term evidence does not exist yet, rather than fill the gap with opinion.' },
    { speaker: 'thomas', text: 'The closing shot can return to the dark water and the sounds recorded on site.' },
    { speaker: 'william', text: 'That image leaves the question open instead of closing it too firmly.' },
    { speaker: 'thomas', text: 'Before the next edit, can we agree the note on tone?' },
    { speaker: 'william', text: 'The narration should avoid words that sound like a campaign either way.' },
    { speaker: 'thomas', text: 'It should present what was measured, what was assumed, and what remains unknown.' },
    { speaker: 'william', text: 'The stakeholder interviews will stay in, even where their claims are challenged later.' },
    { speaker: 'thomas', text: 'The survey team’s footage is the backbone of the first act.' },
    { speaker: 'william', text: 'Their sample boxes label each site, depth and date on screen.' },
    { speaker: 'thomas', text: 'The camera trawls show the plain mud rather than dramatic reefs.' },
    { speaker: 'william', text: 'That quiet footage helps the audience read the seabed as a working environment.' },
    { speaker: 'thomas', text: 'We should credit the research vessel and its crew at the end.' },
    { speaker: 'william', text: 'The deep sea is often filmed as scenery, not as a studied habitat.' },
    { speaker: 'thomas', text: 'This film wants to show it as a place with a real science still in progress.' },
    { speaker: 'william', text: 'One more point, the subtitles should spell the seabed terms consistently.' },
    { speaker: 'thomas', text: 'We will run a check between the narration and the on-screen labels.' },
    { speaker: 'william', text: 'If the broadcast asks for a shorter version, the science gaps must stay in the cut.' },
    { speaker: 'thomas', text: 'Agreed. We will not trade caution for a cleaner story.' },
    { speaker: 'william', text: 'The final review sits with the director, who decides the running order.' },
    { speaker: 'thomas', text: 'Until then, we keep the three strands separate in the rough edit.' },
    { speaker: 'william', text: 'Thanks for walking through this with me.' },
    { speaker: 'thomas', text: 'No problem. I will send the revised interview list before lunch.' },
  ],
  vocabulary: [
    {
      term: 'survey', phonetic: '/ˈsɜːveɪ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '调研，现场勘测（海底取样）', en: 'the field study collecting samples and footage' },
      usage: { zh: '可数；survey evidence、survey map、sample sites。动词读 /səˈveɪ/。', en: 'Countable: survey evidence; the verb has second-syllable stress.' },
      collocations: ['the survey evidence', 'the survey map', 'the survey team'],
      example: { en: 'I reviewed the survey evidence from the samples.', zh: '我复核了取样得到的调研证据。' },
      listening: { zh: '双音节，名词重音在第一音节 /ˈsɜː/。', en: 'Two syllables; noun stress on the first.' },
    },
    {
      term: 'stakeholders', phonetic: '/ˈsteɪkhəʊldəz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '利益相关方（受提案影响的群体）', en: 'the groups with an interest in the proposal' },
      usage: { zh: '可数复数；industry stakeholders、both stakeholder groups。', en: 'Plural countable: industry stakeholders; the singular is stakeholder.' },
      collocations: ['industry stakeholders', 'stakeholder groups', 'both stakeholders'],
      example: { en: 'I spoke with the industry stakeholders directly.', zh: '我直接访谈了行业利益相关方。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈsteɪ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'scientist', phonetic: '/ˈsaɪəntɪst/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '科学家（团队中的海洋专家）', en: 'the expert who maps open research questions' },
      usage: { zh: '可数；marine scientist、the research scientist。', en: 'Countable: marine scientist.' },
      collocations: ['the marine scientist', 'a deep sea scientist', 'the scientist on the team'],
      example: { en: 'The marine scientist mapped the open questions.', zh: '海洋科学家梳理了未决问题。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈsaɪ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'advisor', phonetic: '/ədˈvaɪzə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '顾问（起草政策建议者）', en: 'the expert who drafts policy recommendations' },
      usage: { zh: '可数；policy advisor、the science advisor。英式拼写 adviser。', en: 'Countable: policy advisor; the British spelling is adviser.' },
      collocations: ['the policy advisor', 'a policy advisor', 'the advisor drafted'],
      example: { en: 'The policy advisor drafted the recommendations.', zh: '政策顾问起草了建议。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈvaɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'limited', phonetic: '/ˈlɪmɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '有限的（证据不足）', en: 'not broad enough to settle the question' },
      usage: { zh: '形容词；limited evidence、limited trials。动词 limit。', en: 'Adjective: limited evidence; the verb is limit.' },
      collocations: ['limited evidence', 'limited data', 'very limited'],
      example: { en: 'The evidence is limited to small trials.', zh: '证据限于小规模试验。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈlɪ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'communities', phonetic: '/kəˈmjuːnətiz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '社区，渔业群体', en: 'the local groups whose livelihoods depend on the seabed' },
      usage: { zh: '可数复数；fishing communities、local communities。单数 community。', en: 'Plural countable: fishing communities; the singular is community.' },
      collocations: ['fishing communities', 'the local communities', 'the communities’ concern'],
      example: { en: 'The communities raised the livelihood concern.', zh: '这些社区提出了生计担忧。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈmjuː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'safeguards', phonetic: '/ˈseɪfɡɑːdz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '保障措施（开采前防护规则）', en: 'the protections required before any extraction' },
      usage: { zh: '可数复数；propose safeguards、environmental safeguards。单数 safeguard。', en: 'Plural countable: propose safeguards; the singular is safeguard.' },
      collocations: ['propose safeguards', 'environmental safeguards', 'the safeguards apply'],
      example: { en: 'The script proposes safeguards before extraction.', zh: '剧本主张开采前先设保障措施。' },
      listening: { zh: '双音节，重音在第一音节 /ˈseɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'go over', sentenceIndex: 0,
      meaning: { zh: '讨论，逐项过一遍', en: 'to review the material together point by point' },
      usage: { zh: '及物；go over the documentary、go over the notes。', en: 'Transitive: go over the documentary.' },
      example: { en: 'We will go over the documentary together.', zh: '我们一起过一遍这部纪录片。' },
    },
    {
      phrase: 'open questions', sentenceIndex: 9,
      meaning: { zh: '未决问题（尚无答案的环节）', en: 'the points the research has not settled yet' },
      usage: { zh: '复数；map the open questions、leave an open question。', en: 'Plural: map the open questions; leave an open question.' },
      example: { en: 'The scientist mapped the open questions.', zh: '科学家梳理了未决问题。' },
    },
    {
      phrase: 'hangs over', sentenceIndex: 22,
      meaning: { zh: '悬在（问题之上）', en: 'to remain as an unresolved concern over the topic' },
      usage: { zh: '短语动词；uncertainty hangs over、a doubt hangs over。', en: 'Phrasal verb: uncertainty hangs over the topic.' },
      example: { en: 'What uncertainty hangs over the ecosystems?', zh: '哪些不确定性仍悬在生态系统之上？' },
    },
    {
      phrase: 'bouncing back', sentenceIndex: 38,
      meaning: { zh: '恢复，复原（种群回弹）', en: 'to recover after being disturbed' },
      usage: { zh: '不及物；species bounce back、poor at bouncing back。', en: 'Intransitive: species bounce back.' },
      example: { en: 'Slow species are poor at bouncing back.', zh: '生长缓慢的物种难以复原。' },
    },
    {
      phrase: 'stay neutral', sentenceIndex: 30,
      meaning: { zh: '保持中立（不偏向一方）', en: 'to avoid taking either side in the debate' },
      usage: { zh: '形容词短语；the voiceover stays neutral、remain neutral。', en: 'Adjective phrase: stay neutral on the issue.' },
      example: { en: 'The voiceover must stay neutral on mining.', zh: '旁白在采矿议题上须保持中立。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先认人名与角色', en: 'Match people before tasks' },
      body: {
        zh: '第 21–24 题把四条线索分给两人加两位专家。分工句多以第一人称出现：I reviewed、I spoke、the scientist mapped、the advisor drafted。听到自主动词先记说话人；导演 E 只看成片，是未被分派任务的干扰项。',
        en: 'Items 21–24 split four strands between two people and two experts. Ownership appears in first person: I reviewed, I spoke, the scientist mapped, the advisor drafted. Note the speaker before the verb; the director E only reviews the cut and is a distractor.',
      },
    },
    {
      title: { zh: '单选题盯住证据强度与群体', en: 'Singles target evidence strength and groups' },
      body: {
        zh: '第 25 题证据强度：有限、来自短期试验；第 26 题担忧生计的是拟议区附近渔业社区；第 27 题不确定性是物种数十年后的恢复。彻底定论、足以禁令、港口队伍、研究志愿者、船只停靠、相机型号都不是答案。',
        en: 'Item 25 evidence is limited short trials; item 26 concerns fishing communities near the zone; item 27 uncertainty is multi-decade recovery. Definitive proof, a total ban, port crews, volunteers, docking and cameras are not answers.',
      },
    },
    {
      title: { zh: '多选区分共识项与被否定立场', en: 'Split agreed points from rejected stands' },
      body: {
        zh: '三项入选：谨慎复核证据、访谈双方群体、先行保障措施。句 30、31 明确否定主推采矿和隐藏不确定结论；听到 did not agree to promote、nor hide 直接排除对应项。',
        en: 'The three are cautious evidence review, two-sided stakeholder interviews and pre-extraction safeguards. Sentences 30 and 31 reject outright promotion and hidden uncertainty; cross out options after did not agree to promote and nor hide.',
      },
    },
  ],
};
