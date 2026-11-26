import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 52 · Part 3 — 中世纪贸易路线论文评阅（三人研讨）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：史料类型（配对）→ 论证链条 → 地图使用 → 结论边界（配对），
 * 随后单选三题锁定史料依据、链条要求与结论 caution，最后多选三项论文长处。
 * 题块顺序与录音顺序一致，配对选项含一个未使用干扰项。
 */
export const test52Part3: ListeningLesson = {
  slug: 'test-52-part-3',
  part: 3,
  status: 'published',
  title: { zh: '中世纪贸易路线论文评阅', en: 'Reviewing a thesis on medieval trade routes' },
  summary: {
    zh: '导师与两位同学评阅一篇中世纪贸易路线论文：先核对史料类型，包括商人信件、海关账目与钱币；再检查从商品到路线的论证链条；接着看地图是否支撑书面证据；最后讨论结论不能超出现存史料支撑的边界。单选锁定史料依据、链条要求与结论 caution，多选选出论文三项长处：多源互证、地图与书面证据一致、明确写出自身局限。',
    en: 'Peers review a thesis on medieval trade routes: source types, the goods-to-routes chain, map support for written evidence, and the boundary conclusions must respect. Singles cover source basis, chain requirements and caution; the multiple choice keeps mixed sources, aligned maps and clear limits.',
  },
  accent: { zh: '三位为印度、英式与美式多语言口音，研讨以讨论语气进行。', en: 'The three speakers use Indian, British and American multilingual accents in a seminar discussion.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each review point with the correct reviewer view, A–E.',
      options: [
        { key: 'A', text: 'Checks the types of historical sources used.' },
        { key: 'B', text: 'Follows the argument chain from goods to routes.' },
        { key: 'C', text: 'Reviews how the maps support the claims.' },
        { key: 'D', text: 'Questions the boundaries of the conclusions.' },
        { key: 'E', text: 'Notes gaps in the surviving records.' },
      ],
      items: [
        { number: 21, text: 'Reviewer 1: source review' },
        { number: 22, text: 'Reviewer 2: argument review' },
        { number: 23, text: 'Reviewer 3: map review' },
        { number: 24, text: 'Reviewer 1: conclusion review' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What do the thesis sources mainly rely on?',
          options: [
            { key: 'A', text: 'Official shipping manifests from every port.' },
            { key: 'B', text: 'Surviving records such as letters, customs accounts and coins.' },
            { key: 'C', text: 'Modern trade statistics compiled online.' },
          ],
        },
        {
          number: 26,
          stem: 'What should the argument chain show?',
          options: [
            { key: 'A', text: 'How each route link follows from the evidence.' },
            { key: 'B', text: 'Which merchant earned the most profit.' },
            { key: 'C', text: 'Why every medieval road was paved.' },
          ],
        },
        {
          number: 27,
          stem: 'What caution applies to the thesis conclusions?',
          options: [
            { key: 'A', text: 'They must quote modern prices for the goods.' },
            { key: 'B', text: 'They need full ship manifests before any claim.' },
            { key: 'C', text: 'They cannot claim routes the records do not support.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE strengths does the thesis have? Choose three letters, A–F.',
      select: 3,
      stem: 'Which THREE strengths does the thesis have?',
      options: [
        { key: 'A', text: 'It uses several types of historical source.' },
        { key: 'B', text: 'The maps align with the written evidence.' },
        { key: 'C', text: 'It states its own limits clearly.' },
        { key: 'D', text: 'It proves every medieval trade route.' },
        { key: 'E', text: 'It quotes modern commercial data.' },
        { key: 'F', text: 'It includes complete ship manifests.' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：You compared several source types instead of trusting one kind of record alone。该意见核对史料类型，对应 A。',
        en: 'Sentence 6: "You compared several source types instead of trusting one kind of record alone". This review checks source types, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：Each route link should follow from the evidence rather than from a modern guess。该意见沿商品到路线的链条逐环检查，对应 B。',
        en: 'Sentence 14: "Each route link should follow from the evidence rather than from a modern guess". This follows the goods-to-routes chain, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 22,
      explanation: {
        zh: '定位句 22：The maps match what the written evidence says, rather than drawing a straight line between towns。该意见检查地图是否支撑论点，对应 C。',
        en: 'Sentence 22: "The maps match what the written evidence says, rather than drawing a straight line between towns". This reviews map support, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 31,
      explanation: {
        zh: '定位句 31：Where records are missing, the wording should say so plainly。该意见追问结论边界，对应 D。',
        en: 'Sentence 31: "Where records are missing, the wording should say so plainly". This questions conclusion boundaries, matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Surviving records such as letters, customs accounts and coins, rather than full modern statistics or complete manifests。史料以信件、海关账目与钱币为主，对应 B。A 的完整航运清单与 C 的现代统计在句中被 rather than 否定。',
        en: 'Sentence 36: "Surviving records such as letters, customs accounts and coins, rather than full modern statistics or complete manifests". Letters, accounts and coins match B. Full manifests and modern statistics are ruled out by rather than.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：How each route link follows from the evidence, step by step, rather than profit rankings or paved roads。链条要展示每环如何由证据推出，对应 A。B 的利润排名与 C 的道路铺设在句中被排除。',
        en: 'Sentence 39: "How each route link follows from the evidence, step by step, rather than profit rankings or paved roads". Links following evidence match A. Profit rankings and paved roads are excluded.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 43,
      explanation: {
        zh: '定位句 43：The thesis cannot claim routes that the records do not support, even when a map line suggests them。结论不能主张史料不支持的路线，对应 C。A 的现代物价与 B 的必须先有完整清单在录音中没有依据。',
        en: 'Sentence 43: "The thesis cannot claim routes that the records do not support, even when a map line suggests them". Unsupported routes must not be claimed, matching C. Modern prices and full manifests are not required.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 47,
      explanation: {
        zh: '定位句 47：First, it uses several types of historical source together, not one document alone。多类史料互证是长处，选 A。',
        en: 'Sentence 47: "First, it uses several types of historical source together, not one document alone". Mixed source types are a strength, so choose A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 48,
      explanation: {
        zh: '定位句 48：Second, the maps align with the written evidence instead of outrunning it。地图与书面证据一致是长处，选 B。',
        en: 'Sentence 48: "Second, the maps align with the written evidence instead of outrunning it". Maps aligned with evidence are a strength, so choose B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 49,
      explanation: {
        zh: '定位句 49：Third, the thesis states its own limits clearly, naming the zones it cannot judge。明确写出自身局限是长处，选 C。D 的证明全部路线、E 的引用现代商业数据、F 的完整航运清单均不是论文已有的长处。',
        en: 'Sentence 49: "Third, the thesis states its own limits clearly, naming the zones it cannot judge". Clear stated limits are a strength, so choose C. Proving every route, modern data and complete manifests are not strengths here.',
      },
    },
  ],
  transcript: [
    { speaker: 'neerja', text: 'Thanks for making time to review my thesis on medieval trade routes.' },
    { speaker: 'ryan', text: 'Happy to look it over. We will go through sources, argument, maps and conclusions in turn.' },
    { speaker: 'aria', text: 'I read the draft last night, so I can speak to the structure as a whole.' },
    { speaker: 'neerja', text: 'The main question is which routes connected the markets along the inland and coastal zones.' },
    { speaker: 'ryan', text: 'First, let me say where the source material stands.' },
    { speaker: 'neerja', text: 'I leaned on surviving letters between merchants, customs accounts and coins found along the way.' },
    { speaker: 'ryan', text: 'You compared several source types instead of trusting one kind of record alone.' },
    { speaker: 'aria', text: 'That keeps the argument from leaning too hard on a single surviving letter.' },
    { speaker: 'neerja', text: 'Some accounts were copied long after the events, so I marked their later dates.' },
    { speaker: 'ryan', text: 'A few figures are approximate, and you admit that in the source notes.' },
    { speaker: 'neerja', text: 'I also checked whether coins could have travelled through several owners.' },
    { speaker: 'aria', text: 'The opening chapter sets out what each source can and cannot prove.' },
    { speaker: 'ryan', text: 'Next, the line of reasoning from goods to routes.' },
    { speaker: 'neerja', text: 'I start with the goods that moved, then link them to the markets that handled them.' },
    { speaker: 'ryan', text: 'Each route link should follow from the evidence rather than from a modern guess.' },
    { speaker: 'neerja', text: 'The map of traded goods leads into the map of the roads and river crossings.' },
    { speaker: 'aria', text: 'Where the chain jumps, you name the missing record that would close the gap.' },
    { speaker: 'ryan', text: 'You avoid filling silence with a vivid but unsupported story.' },
    { speaker: 'neerja', text: 'A few sections move quickly from a coin find to a whole corridor, and I want to fix that.' },
    { speaker: 'aria', text: 'The middle chapters show the route links one after another in a clear sequence.' },
    { speaker: 'ryan', text: 'Now the use of maps in the thesis.' },
    { speaker: 'neerja', text: 'I plotted the surviving finds on regional maps and marked uncertain routes with a dashed line.' },
    { speaker: 'aria', text: 'The maps match what the written evidence says, rather than drawing a straight line between towns.' },
    { speaker: 'ryan', text: 'Each map carries a note on the date range and the type of find shown.' },
    { speaker: 'neerja', text: 'I left uncertain coastal crossings off the solid route lines.' },
    { speaker: 'aria', text: 'That honesty about uncertainty helps the reader judge how firm each claim is.' },
    { speaker: 'ryan', text: 'The map legend distinguishes ports, inland markets and crossing points.' },
    { speaker: 'neerja', text: 'Later versions could add a second map for the later centuries.' },
    { speaker: 'ryan', text: 'Finally, the boundaries of the conclusions.' },
    { speaker: 'neerja', text: 'I want to know where the thesis overreaches beyond what the records support.' },
    { speaker: 'aria', text: 'The conclusion should stay within the evidence that survives, not fill in gaps it cannot see.' },
    { speaker: 'ryan', text: 'Where records are missing, the wording should say so plainly.' },
    { speaker: 'neerja', text: 'I softened one sentence that implied a route never used by other traders.' },
    { speaker: 'aria', text: 'The limits section names which zones have too little material to judge.' },
    { speaker: 'ryan', text: 'Now a few questions to pin down the review.' },
    { speaker: 'neerja', text: 'What do the thesis sources mainly rely on?' },
    { speaker: 'ryan', text: 'Surviving records such as letters, customs accounts and coins, rather than full modern statistics or complete manifests.' },
    { speaker: 'aria', text: 'The records are partial, and the thesis says so in its source notes.' },
    { speaker: 'neerja', text: 'What should the argument chain show?' },
    { speaker: 'ryan', text: 'How each route link follows from the evidence, step by step, rather than profit rankings or paved roads.' },
    { speaker: 'neerja', text: 'That is where the dashed routes need a closer check.' },
    { speaker: 'aria', text: 'The middle chapters do keep goods, markets and crossings in order.' },
    { speaker: 'neerja', text: 'What caution applies to the conclusions?' },
    { speaker: 'ryan', text: 'The thesis cannot claim routes that the records do not support, even when a map line suggests them.' },
    { speaker: 'aria', text: 'Modern prices and full manifests are not part of this evidence base.' },
    { speaker: 'ryan', text: 'Let us turn to the strengths we would keep in the final version.' },
    { speaker: 'neerja', text: 'Which strengths stand out to you?' },
    { speaker: 'ryan', text: 'First, it uses several types of historical source together, not one document alone.' },
    { speaker: 'aria', text: 'Second, the maps align with the written evidence instead of outrunning it.' },
    { speaker: 'ryan', text: 'Third, the thesis states its own limits clearly, naming the zones it cannot judge.' },
    { speaker: 'neerja', text: 'Are there weaknesses to fix before submission?' },
    { speaker: 'aria', text: 'Some route links still rest on one weak record, and that chain needs another source.' },
    { speaker: 'ryan', text: 'A couple of map lines are drawn more firmly than the surviving finds justify.' },
    { speaker: 'neerja', text: 'I will rewrite those links and mark the weaker crossings again.' },
    { speaker: 'aria', text: 'The conclusion should repeat which questions the surviving records cannot answer.' },
    { speaker: 'ryan', text: 'Good. We can compare the revised source notes before the next tutorial.' },
    { speaker: 'neerja', text: 'How many copies of the letters did you consult?' },
    { speaker: 'ryan', text: 'Most survive in later copies, so their date of copying is recorded in the notes.' },
    { speaker: 'aria', text: 'The coin evidence helps date the movement of goods between the inland and coastal markets.' },
    { speaker: 'neerja', text: 'Did the customs accounts give volumes or just numbers of traders?' },
    { speaker: 'ryan', text: 'They list duties paid, which is indirect evidence of how much goods moved.' },
    { speaker: 'aria', text: 'That kind of indirect source needs careful wording in the conclusion.' },
    { speaker: 'neerja', text: 'Could a later trader have moved an old coin along a route?' },
    { speaker: 'ryan', text: 'Yes, and the thesis flags that possibility instead of reading every coin as proof of a direct link.' },
    { speaker: 'aria', text: 'The source chapter is the strongest part of the draft so far.' },
    { speaker: 'neerja', text: 'I will tighten the map legend and the route labels before I resubmit.' },
    { speaker: 'ryan', text: 'Keep the clear sequence from goods to markets to crossings in the next version.' },
    { speaker: 'aria', text: 'The limits section should stay at the end, so readers see the caution alongside the claim.' },
    { speaker: 'neerja', text: 'Thank you both for the careful notes on sources and conclusions.' },
  ],
  vocabulary: [
    {
      term: 'source', phonetic: '/sɔːrs/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '史料，原始记录', en: 'the surviving record used as evidence in the thesis' },
      usage: { zh: '可数；historical sources、source notes、source types。', en: 'Countable: historical sources, source notes.' },
      collocations: ['historical sources', 'source notes', 'source types'],
      example: { en: 'The thesis compares several types of historical source.', zh: '论文比较了多类历史史料。' },
      listening: { zh: '单音节，元音 /ɔː/，结尾 /rs/。', en: 'One syllable with /ɔː/; ending /rs/.' },
    },
    {
      term: 'route', phonetic: '/ruːt/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '路线，商道', en: 'the road or crossing link between medieval markets' },
      usage: { zh: '可数；trade routes、a route link、the route lines。', en: 'Countable: trade routes, a route link.' },
      collocations: ['trade routes', 'a route link', 'the route lines'],
      example: { en: 'Each route link should follow from the evidence.', zh: '每一环路线都应由证据推出。' },
      listening: { zh: '单音节，长元音 /uː/；另有 /raʊt/ 读法。', en: 'One syllable with long /uː/; variant /raʊt/ exists.' },
    },
    {
      term: 'customs', phonetic: '/ˈkʌstəmz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '海关（账目）', en: 'the official accounts recording duties paid at ports' },
      usage: { zh: '复数名词；customs accounts、customs duties。', en: 'Plural noun: customs accounts, customs duties.' },
      collocations: ['customs accounts', 'customs duties', 'customs records'],
      example: { en: 'The thesis uses customs accounts and merchant letters.', zh: '论文使用海关账目与商人信件。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkʌs/，结尾 /mz/。', en: 'Two syllables with first-syllable stress; ending /mz/.' },
    },
    {
      term: 'coin', phonetic: '/kɔɪn/', partOfSpeech: 'n.', sentenceIndex: 58,
      meaning: { zh: '钱币（出土的交易物证）', en: 'the surviving money find used to date trade movement' },
      usage: { zh: '可数；coin finds、the coin evidence。', en: 'Countable: coin finds, the coin evidence.' },
      collocations: ['coin finds', 'the coin evidence', 'an old coin'],
      example: { en: 'Coins may have passed through several owners.', zh: '钱币可能经过多位持有者转手。' },
      listening: { zh: '单音节，双元音 /ɔɪ/，结尾 /n/。', en: 'One syllable with /ɔɪ/; ending /n/.' },
    },
    {
      term: 'evidence', phonetic: '/ˈevɪdəns/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '证据，论据', en: 'the material that supports a claim in the argument' },
      usage: { zh: '不可数；follow from the evidence、the written evidence。', en: 'Uncountable: follow from the evidence.' },
      collocations: ['the written evidence', 'follow from the evidence', 'the evidence base'],
      example: { en: 'Maps must match what the written evidence says.', zh: '地图必须与书面证据一致。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈev/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'limits', phonetic: '/ˈlɪmɪts/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '局限，结论边界', en: 'the boundary beyond which the record does not support a claim' },
      usage: { zh: '可数；the limits section、state its limits。', en: 'Countable: the limits section, state its limits.' },
      collocations: ['the limits section', 'state its limits', 'the conclusion limits'],
      example: { en: 'The thesis states its own limits clearly.', zh: '论文明确写出自身局限。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'in turn', sentenceIndex: 1,
      meaning: { zh: '依次，按顺序', en: 'one after another, in the planned order' },
      usage: { zh: '状语；go through A, B and C in turn。', en: 'Adverbial: go through items in turn.' },
      example: { en: 'We will cover sources, argument and maps in turn.', zh: '我们将依次讨论史料、论证与地图。' },
    },
    {
      phrase: 'leaned on', sentenceIndex: 5,
      meaning: { zh: '依赖，主要依据', en: 'to rely on a type of record as the main basis' },
      usage: { zh: '短语动词过去式；lean on the letters、lean too hard on。', en: 'Phrasal verb past: lean on the letters.' },
      example: { en: 'I leaned on surviving letters and customs accounts.', zh: '我主要依据现存信件与海关账目。' },
    },
    {
      phrase: 'route link', sentenceIndex: 14,
      meaning: { zh: '路线环节', en: 'one connection in the chain between two markets' },
      usage: { zh: '可数复合名词；each route link、the route links。', en: 'Countable compound: each route link.' },
      example: { en: 'Each route link follows from the evidence.', zh: '每个路线环节都由证据推出。' },
    },
    {
      phrase: 'align with', sentenceIndex: 48,
      meaning: { zh: '与……一致，相互印证', en: 'to match and support the written evidence' },
      usage: { zh: '及物短语；maps align with the evidence。', en: 'Transitive: maps align with the evidence.' },
      example: { en: 'The maps align with the written evidence.', zh: '地图与书面证据相互印证。' },
    },
    {
      phrase: 'stand out', sentenceIndex: 46,
      meaning: { zh: '突出，显眼（长处）', en: 'to be the most noticeable strength' },
      usage: { zh: '不及物短语；strengths stand out。', en: 'Intransitive: strengths stand out.' },
      example: { en: 'Which strengths stand out to you in the draft?', zh: '稿件里哪些长处最突出？' },
    },
    {
      phrase: 'rest on', sentenceIndex: 51,
      meaning: { zh: '依赖，建立在……之上', en: 'to be based on a particular record or source' },
      usage: { zh: 'rest on + 依据；论证薄弱处高频。', en: 'Rest on plus a basis; common for weak arguments.' },
      example: { en: 'Some route links rest on one weak record.', zh: '有些路线环节只依托一条薄弱史料。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先标话题词', en: 'Mark topic words before the matching block' },
      body: {
        zh: '配对 A–E 的五个意见分别对应史料、链条、地图、结论边界、记录缺口。听前把 source、chain、map、boundary、gap 标到选项旁；发言者说 first、next、now、finally 这类路标时，直接把该段话题对到下一题。',
        en: 'Matching options A to E cover sources, chain, maps, conclusion boundary and record gaps. Mark source, chain, map, boundary and gap beside the options before listening; on a signpost such as first, next, now or finally, match that topic to the next item.',
      },
    },
    {
      title: { zh: '多选找序数词锁定三项', en: 'Catch ordinal markers for the three strengths' },
      body: {
        zh: '第 28–30 题要求选三项长处。录音用 First、Second、Third 逐项列出，三个答案依次对应；干扰项 D 的证明全部路线、E 的现代商业数据、F 的完整清单在录音中被否定或未出现，不要凭印象勾选。',
        en: 'Items 28 to 30 need three strengths. The recording lists them with First, Second and Third, and the three answers follow in that order. Distractors D, E and F are ruled out or unmentioned, so do not tick them on impression.',
      },
    },
    {
      title: { zh: '小心限定史料的否定对比', en: 'Watch the negated comparison on source items' },
      body: {
        zh: '第 25、27 题都靠 rather than、cannot、not 这类限定词定答案。干扰项常把论文没有用到的完整清单、现代统计说成依据；听到 rather than、cannot support、not part of the evidence 时，把被否定的选项划掉。',
        en: 'Items 25 and 27 turn on rather than, cannot and not. Distractors put full manifests or modern statistics forward as the basis; on rather than, cannot support and not part of the evidence, cross out the ruled-out option.',
      },
    },
  ],
};
