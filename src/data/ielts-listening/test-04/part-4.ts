import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 4 · Part 4 — 讲座：造纸术的历史。原创仿真材料，非官方真题。
 *
 * 结构：定义 → 中国早期原料 → 破布纸 → 欧洲磨坊 → 木浆时代 → 机械工艺 → 社会影响 → 环境代价 → 总结。
 * 表格填空 31–34 按原料与地点出现顺序排列，单选 35–37 落在工艺对比段，多选 38–40 落在社会影响段。
 */
export const test04Part4: ListeningLesson = {
  slug: 'test-04-part-4',
  part: 4,
  status: 'published',
  title: { zh: '造纸术的历史', en: 'The history of paper' },
  summary: {
    zh: '一场关于造纸术的讲座：最早的中国纸用什么原料、十世纪后为何改用破布、欧洲第一批磨坊落在哪里、十九世纪木浆如何取代破布，以及廉价纸对书籍、报纸和公文存储带来的社会影响。',
    en: 'A lecture on the history of paper: the raw materials of the earliest Chinese paper, why rags replaced fresh stems in the tenth century, where the first European mills stood, how wood pulp replaced rags in the nineteenth century, and the social effects of cheap paper on books, newspapers and official records.',
  },
  accent: { zh: '讲师为澳式口音，术语会放慢重复。', en: 'The lecturer has an Australian accent and repeats key terms slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Period', 'Material / Place', 'Note'],
      rows: [
        { lead: 'Early China', cells: [[{ blank: 31 }], [{ text: 'the same plant provided coarse cloth' }]] },
        { lead: 'Tenth century', cells: [[{ blank: 32 }], [{ text: 'old linen and cotton cloth' }]] },
        { lead: 'First European mills', cells: [[{ blank: 33 }], [{ text: 'mid twelfth century' }]] },
        { lead: 'Nineteenth century', cells: [[{ blank: 34 }], [{ text: 'replaced rags as the main material' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'How was paper produced before the mechanised mills?',
          options: [
            { key: 'A', text: 'by hand from rags and plant fibres' },
            { key: 'B', text: 'by weaving fibres on looms' },
            { key: 'C', text: 'by treating animal skins with chemicals' },
          ],
        },
        {
          number: 36,
          stem: 'Why did paper replace parchment in Europe?',
          options: [
            { key: 'A', text: 'It was stronger than parchment.' },
            { key: 'B', text: 'It could be made in large quantities more cheaply.' },
            { key: 'C', text: 'It lasted for hundreds of years.' },
          ],
        },
        {
          number: 37,
          stem: 'How did papermaking spread beyond China?',
          options: [
            { key: 'A', text: 'It followed the trade routes westward.' },
            { key: 'B', text: 'It was protected as a secret until the modern age.' },
            { key: 'C', text: 'It began independently in the Americas.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE effects of cheap paper on society does the lecturer mention? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE effects of cheap paper on society does the lecturer mention?',
      options: [
        { key: 'A', text: 'More books could be printed.' },
        { key: 'B', text: 'Newspapers became widely available.' },
        { key: 'C', text: 'Letters could be sent through the post.' },
        { key: 'D', text: 'Schools required fewer teachers.' },
        { key: 'E', text: 'Official documents were easier to store.' },
        { key: 'F', text: 'Forests were replanted across Europe.' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['hemp'], evidence: 5,
      explanation: {
        zh: '定位句 5：Its main raw material was hemp, the same plant that provided coarse cloth。最早中国纸的原料是麻；句 7 的 mulberry bark 是后来补充的材料，不是第一空答案。',
        en: 'Sentence 5: "Its main raw material was hemp, the same plant that provided coarse cloth". The earliest Chinese paper was made from hemp; mulberry bark in sentence 7 was added later, so it is not the answer.',
      },
    },
    {
      number: 32, accepted: ['rags'], evidence: 10,
      explanation: {
        zh: '定位句 10：paper began to be made from rags instead of fresh plant stems。十世纪起改用旧亚麻和棉布；fresh plant stems 是被替代的对象，不能填。',
        en: 'Sentence 10: "paper began to be made from rags instead of fresh plant stems". From the tenth century old linen and cotton cloth were used; fresh plant stems are what was replaced, not the answer.',
      },
    },
    {
      number: 33, accepted: ['Spain'], evidence: 14,
      explanation: {
        zh: '定位句 14：The first European paper mills appeared in Spain, in the middle of the twelfth century。地点首字母大写；句 15 的 Italy 和 France 是后来传播到的地方。',
        en: 'Sentence 14: "The first European paper mills appeared in Spain, in the middle of the twelfth century". The place needs a capital letter; Italy and France in sentence 15 came later in the spread.',
      },
    },
    {
      number: 34, accepted: ['wood pulp'], evidence: 21,
      explanation: {
        zh: '定位句 21：wood pulp replaced rags as the main material。十九世纪的主要原料是木浆；rags 是被取代的旧原料，注意两词都要写。',
        en: 'Sentence 21: "wood pulp replaced rags as the main material". The nineteenth-century material was wood pulp; rags are the old material it replaced. Write both words.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：Each sheet was formed by hand, from rags and plant fibres。机械磨坊之前靠手工成型；织布机和化学处理兽皮在全段都没有提到。',
        en: 'Sentence 26: "Each sheet was formed by hand, from rags and plant fibres". Before mechanised mills sheets were formed by hand. Looms and chemical treatment of skins are never mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：rag paper was far quicker to produce once the mills were set up。羊皮纸耐用但费工，纸能更快批量生产；A 和 C 说的强项恰恰属于羊皮纸。',
        en: 'Sentence 29: "rag paper was far quicker to produce once the mills were set up". Parchment lasted well but was labour-intensive, while paper could be produced faster in quantity. A and C describe parchment’s own strengths.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：the knowledge of papermaking moved west along the trade routes。工艺沿商路西传；保密只持续了几个世纪，美洲独立起源在全段没有依据。',
        en: 'Sentence 31: "the knowledge of papermaking moved west along the trade routes". The craft travelled west with trade. Secrecy lasted only centuries, and an independent origin in the Americas has no basis in the lecture.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：The first and most obvious effect was that more books could be printed。书籍印量增加是第一项社会影响；句 35 的 editions copies 是它的补充说明。',
        en: 'Sentence 33: "The first and most obvious effect was that more books could be printed". More books is the first social effect; the edition copies in sentence 35 support it.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Cheap paper allowed publishers to print daily editions that sold for a few coins。报纸因廉价纸得以普及；句 38 的 notices 是同一影响的延伸，不是另一选项。',
        en: 'Sentence 37: "Cheap paper allowed publishers to print daily editions that sold for a few coins". Newspapers spread because paper was cheap; the notices in sentence 38 extend the same effect rather than being a separate option.',
      },
    },
    {
      number: 40, accepted: ['E'], evidence: 39,
      explanation: {
        zh: '定位句 39：official documents became easier to store and copy。公文更易存档复制是第三项影响；信件邮寄在句 42 被附带提到，并在句 43 说明还依赖道路和邮票，不算独立结论。',
        en: 'Sentence 39: "official documents became easier to store and copy". Easier storage of official records is the third effect. Letters by post in sentence 42 are mentioned in passing, and sentence 43 notes the post depended on roads and stamps, so it is not a separate conclusion.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How many sheets of paper did you touch before nine o’clock this morning?' },
    { speaker: 'lecturer', text: 'Most of us cannot say, and yet that ordinary sheet has a history stretching back two thousand years.' },
    { speaker: 'lecturer', text: 'We turn now to paper, a material so ordinary that we rarely stop to think where it came from.' },
    { speaker: 'lecturer', text: 'Paper is a sheet of interwoven plant fibres, pressed and dried into a thin, flexible surface.' },
    { speaker: 'lecturer', text: 'The earliest known paper dates back to the second century in China.' },
    { speaker: 'lecturer', text: 'Its main raw material was hemp, the same plant that provided coarse cloth.' },
    { speaker: 'lecturer', text: 'People soaked the stems, beat them into pulp and spread the pulp on a woven screen.' },
    { speaker: 'lecturer', text: 'Mulberry bark was added later, when hemp supplies ran short in some regions.' },
    { speaker: 'lecturer', text: 'The Chinese wrote on strips of bamboo before that, but those were heavy and bulky.' },
    { speaker: 'lecturer', text: 'For centuries, the craft stayed within Chinese borders, carried by skilled workers who kept the methods secret.' },
    { speaker: 'lecturer', text: 'Around the tenth century, paper began to be made from rags instead of fresh plant stems.' },
    { speaker: 'lecturer', text: 'Old linen and cotton cloth were collected, torn up and pulped in water.' },
    { speaker: 'lecturer', text: 'Rag paper was strong and durable, and it took ink without spreading.' },
    { speaker: 'lecturer', text: 'Because rags lasted so well, papermakers collected them door to door in many towns.' },
    { speaker: 'lecturer', text: 'The first European paper mills appeared in Spain, in the middle of the twelfth century.' },
    { speaker: 'lecturer', text: 'From Spain, the mills spread to Italy and France, and then to the rest of Europe.' },
    { speaker: 'lecturer', text: 'By the fourteenth century, almost every major European city had its own mill.' },
    { speaker: 'lecturer', text: 'Before paper reached Europe, writing was done on parchment, made from animal skins.' },
    { speaker: 'lecturer', text: 'Parchment lasted a long time, but preparing one skin took days of labour.' },
    { speaker: 'lecturer', text: 'A single book could consume the equivalent of several hundred skins.' },
    { speaker: 'lecturer', text: 'For several hundred years, rags remained the only source of paper fibre.' },
    { speaker: 'lecturer', text: 'That changed in the nineteenth century, when wood pulp replaced rags as the main material.' },
    { speaker: 'lecturer', text: 'Machines could grind logs into pulp at a scale no rag collection could match.' },
    { speaker: 'lecturer', text: 'This shift is what made cheap paper possible for ordinary people.' },
    { speaker: 'lecturer', text: 'The price of a sheet fell steadily as mills spread across the continent.' },
    { speaker: 'lecturer', text: 'Now, how was paper produced before those mechanised mills?' },
    { speaker: 'lecturer', text: 'Each sheet was formed by hand, from rags and plant fibres.' },
    { speaker: 'lecturer', text: 'The wet pulp was couched onto a felt to drain the water, then pressed and dried.' },
    { speaker: 'lecturer', text: 'Parchment, for its part, was strong and could survive for centuries.' },
    { speaker: 'lecturer', text: 'Yet rag paper was far quicker to produce once the mills were set up.' },
    { speaker: 'lecturer', text: 'That speed is why paper eventually replaced parchment across Europe.' },
    { speaker: 'lecturer', text: 'As I mentioned earlier, the knowledge of papermaking moved west along the trade routes.' },
    { speaker: 'lecturer', text: 'It is worth pausing to ask what cheap paper changed in society.' },
    { speaker: 'lecturer', text: 'The first and most obvious effect was that more books could be printed.' },
    { speaker: 'lecturer', text: 'Printers needed large runs of affordable paper, and wood pulp delivered exactly that.' },
    { speaker: 'lecturer', text: 'A printer could now issue an edition of several hundred copies rather than a dozen.' },
    { speaker: 'lecturer', text: 'A second effect was the rise of newspapers.' },
    { speaker: 'lecturer', text: 'Cheap paper allowed publishers to print daily editions that sold for a few coins.' },
    { speaker: 'lecturer', text: 'News, advertisements and public notices reached whole towns instead of a small educated group.' },
    { speaker: 'lecturer', text: 'Third, official documents became easier to store and copy.' },
    { speaker: 'lecturer', text: 'Governments kept registers, courts filed records, and universities printed lecture notes.' },
    { speaker: 'lecturer', text: 'Legal agreements and land deeds were kept in duplicate for the first time.' },
    { speaker: 'lecturer', text: 'Letters too could be sent through the post in large numbers, once paper was cheap enough.' },
    { speaker: 'lecturer', text: 'I should be clear that the post itself depended on other changes, such as roads and stamps.' },
    { speaker: 'lecturer', text: 'None of this meant that schools needed fewer teachers, and paper did not make education automatic.' },
    { speaker: 'lecturer', text: 'Nor did it solve every environmental problem, as we will see later.' },
    { speaker: 'lecturer', text: 'Of course, the rise of paper also had costs.' },
    { speaker: 'lecturer', text: 'Demand for wood pulp encouraged the clearing of forests, which grew steadily through the nineteenth century.' },
    { speaker: 'lecturer', text: 'Paper making used large amounts of water, and early mills polluted the rivers beside them.' },
    { speaker: 'lecturer', text: 'Workers near the mills also dealt with the smell of rotting rags.' },
    { speaker: 'lecturer', text: 'Recycling and sustainable sourcing are modern answers to problems that first appeared with the mills.' },
    { speaker: 'lecturer', text: 'Many modern paper brands now advertise recycled content as a selling point.' },
    { speaker: 'lecturer', text: 'Before I finish, let me correct one common misunderstanding.' },
    { speaker: 'lecturer', text: 'Paper is not the oldest writing surface, and it did not cause reading to spread on its own.' },
    { speaker: 'lecturer', text: 'Its real importance was practical. It made the written record light, portable and affordable.' },
    { speaker: 'lecturer', text: 'Without paper, the later spread of printing, schooling and public debate would have been far slower.' },
    { speaker: 'lecturer', text: 'Next week we will look at how the printing press changed the cost of books.' },
    { speaker: 'lecturer', text: 'That is all for today. We will continue the topic next week.' },
  ],
  vocabulary: [
    {
      term: 'hemp', phonetic: '/hemp/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '麻，大麻（早期造纸原料）', en: 'a tall plant whose stems provide fibre for cloth and early paper' },
      usage: { zh: '不可数；raw material was hemp、hemp supplies。', en: 'Uncountable: raw material was hemp, hemp supplies.' },
      collocations: ['hemp fibre', 'hemp supplies', 'made from hemp'],
      example: { en: 'The earliest paper was made from hemp stems soaked and beaten into pulp.', zh: '最早的纸由麻茎浸泡捣成浆制成。' },
      listening: { zh: '单音节，结尾 /mp/ 要读清楚，不要漏 /m/。', en: 'One syllable; pronounce the final /mp/ clearly.' },
    },
    {
      term: 'pulp', phonetic: '/pʌlp/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '纸浆，浆料', en: 'a soft wet mass of plant fibre used to make paper' },
      usage: { zh: '不可数；beat into pulp、wood pulp、rag pulp。', en: 'Uncountable: beat into pulp, wood pulp, rag pulp.' },
      collocations: ['beat into pulp', 'wood pulp', 'paper pulp'],
      example: { en: 'The stems were beaten into pulp and spread on a screen.', zh: '茎秆被捣成浆，铺在筛网上。' },
      listening: { zh: '与 pup（小狗）对比：pulp 是 /ʌ/，结尾 /lp/。', en: 'Compare with pup: pulp has /ʌ/ and ends in /lp/.' },
    },
    {
      term: 'mulberry', phonetic: '/ˈmʌlbəri/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '桑树（mulberry bark 桑树皮）', en: 'a tree whose bark was used as a papermaking fibre' },
      usage: { zh: '可数；mulberry bark、mulberry leaves。', en: 'Countable: mulberry bark, mulberry leaves.' },
      collocations: ['mulberry bark', 'mulberry tree', 'mulberry leaves'],
      example: { en: 'Mulberry bark was added when hemp supplies ran short.', zh: '麻料不足时加入桑树皮。' },
      listening: { zh: '三个音节，重音在第一音节；澳式读音结尾 /ri/ 很轻。', en: 'Three syllables with stress on the first; the ending /ri/ is weak.' },
    },
    {
      term: 'rags', phonetic: '/ræɡz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '破布，旧布片', en: 'old torn pieces of cloth collected for papermaking' },
      usage: { zh: '复数；made from rags、rag paper。单数 rag 指一块破布。', en: 'Plural: made from rags, rag paper. A rag is one piece.' },
      collocations: ['made from rags', 'rag paper', 'collect rags'],
      example: { en: 'Around the tenth century, paper was made from rags.', zh: '大约十世纪起，纸改用破布制造。' },
      listening: { zh: '短元音 /æ/，结尾 /ɡz/；不要读成 rages。', en: 'Short /æ/ ending in /ɡz/; do not confuse with rages.' },
    },
    {
      term: 'durable', phonetic: '/ˈdjʊərəbl/', partOfSpeech: 'adj.', sentenceIndex: 12,
      meaning: { zh: '耐用的，持久的', en: 'lasting a long time without breaking or wearing out' },
      usage: { zh: '描述材料；durable paper、durable record。名词 durability。', en: 'Describes materials: durable paper. The noun is durability.' },
      collocations: ['strong and durable', 'durable paper', 'durable record'],
      example: { en: 'Rag paper was strong and durable, and it took ink without spreading.', zh: '破布纸结实耐用，吸墨不洇。' },
      listening: { zh: '三个音节，重音在第一音节；开头 /djʊ/ 不要读成 /dʒu/。', en: 'Three syllables with stress on the first; the opening is /djʊ/, not /dʒu/.' },
    },
    {
      term: 'parchment', phonetic: '/ˈpɑːtʃmənt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '羊皮纸', en: 'a writing material made from prepared animal skins' },
      usage: { zh: '不可数；on parchment、a parchment document。', en: 'Uncountable: on parchment, a parchment document.' },
      collocations: ['made from parchment', 'on parchment', 'parchment document'],
      example: { en: 'Before paper reached Europe, writing was done on parchment.', zh: '纸传入欧洲之前，文字写在羊皮纸上。' },
      listening: { zh: '两个音节，重音在第一音节；中间 /tʃ/ 是唇齿后塞擦音。', en: 'Two syllables, stress on the first; the middle /tʃ/ is an affricate.' },
    },
    {
      term: 'fibres', phonetic: '/ˈfaɪbəz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '纤维', en: 'thin threads of plant or animal material used to make paper or cloth' },
      usage: { zh: '英式拼写 fibre，美式 fiber；plant fibres、paper fibres。', en: 'British fibre, American fiber: plant fibres, paper fibres.' },
      collocations: ['plant fibres', 'paper fibres', 'wood fibres'],
      example: { en: 'Each sheet was formed by hand, from rags and plant fibres.', zh: '每张纸靠手工成型，原料是破布和植物纤维。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /əz/ 不卷舌。', en: 'Two syllables with stress on the first; the final /əz/ is not rhotic.' },
    },
    {
      term: 'portable', phonetic: '/ˈpɔːtəbl/', partOfSpeech: 'adj.', sentenceIndex: 54,
      meaning: { zh: '便携的，可携带的', en: 'light and easy to carry from place to place' },
      usage: { zh: '描述物品；portable record、portable device。动词 port 源自搬运。', en: 'Describes objects: portable record. Related to the verb carry.' },
      collocations: ['light and portable', 'portable record', 'portable device'],
      example: { en: 'Paper made the written record light, portable and affordable.', zh: '纸让文字记录轻便、可携带且价格低廉。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /tə/ 弱读。', en: 'Three syllables with stress on the first; the middle /tə/ is reduced.' },
    },
  ],
  expressions: [
    {
      phrase: 'dates back to', sentenceIndex: 4,
      meaning: { zh: '追溯到，始于', en: 'to have existed since a particular time in the past' },
      usage: { zh: '后接年代或时期；一般现在时表历史起点。', en: 'Follow with a period; the present tense marks a historical start.' },
      example: { en: 'The earliest known paper dates back to the second century in China.', zh: '已知最早的纸可追溯到中国二世纪。' },
    },
    {
      phrase: 'ran short', sentenceIndex: 7,
      meaning: { zh: '不足，短缺', en: 'to be used up or become scarce' },
      usage: { zh: 'run short of something；过去式 ran short。', en: 'Run short of something; the past form is ran short.' },
      example: { en: 'Mulberry bark was added when hemp supplies ran short.', zh: '麻料短缺时加入了桑树皮。' },
    },
    {
      phrase: 'door to door', sentenceIndex: 13,
      meaning: { zh: '挨家挨户地', en: 'going from one house or shop to the next' },
      usage: { zh: '短语作状语；collect rags door to door。', en: 'Used as an adverbial: collect rags door to door.' },
      example: { en: 'Papermakers collected old cloth door to door in many towns.', zh: '造纸者在许多城镇挨家挨户收集旧布。' },
    },
    {
      phrase: 'couched onto', sentenceIndex: 27,
      meaning: { zh: '（造纸术语）把湿纸浆抄到毛布上', en: 'in papermaking, to transfer the wet pulp onto a felt to drain' },
      usage: { zh: '被动形式 be couched onto；此处 couch 是造纸动词，不是“沙发”。', en: 'Passive: be couched onto. Here couch is a papermaking verb, not the sofa.' },
      example: { en: 'The wet pulp was couched onto a felt to drain the water.', zh: '湿纸浆被抄到毛布上沥水。' },
    },
    {
      phrase: 'in large numbers', sentenceIndex: 42,
      meaning: { zh: '大量地，大批地', en: 'in a great quantity or by many people' },
      usage: { zh: '作状语；sent in large numbers、visitors in large numbers。', en: 'Adverbial: sent in large numbers.' },
      example: { en: 'Letters could be sent through the post in large numbers.', zh: '信件可以通过邮政大批寄出。' },
    },
    {
      phrase: 'selling point', sentenceIndex: 51,
      meaning: { zh: '卖点，推销优势', en: 'a feature that attracts buyers and helps sell a product' },
      usage: { zh: '可数；advertise something as a selling point。', en: 'Countable: advertise something as a selling point.' },
      example: { en: 'Many brands advertise recycled content as a selling point.', zh: '许多品牌把可回收成分当作卖点宣传。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先看列标题', en: 'Read the column headings first' },
      body: {
        zh: '第 31–34 题是表格填空，先判断每空要填原料还是地点：Early China、Tenth century、Nineteenth century 三行问材料，First European mills 一行问国家。听前把预测词性写在空旁。',
        en: 'Items 31 to 34 are a table. Decide whether each gap asks for a material or a place: the Early China, Tenth century and Nineteenth century rows ask for materials, while the First European mills row asks for a country. Write the predicted part of speech beside the gap.',
      },
    },
    {
      title: { zh: '对比题听双方强弱', en: 'For comparison items, weigh both sides' },
      body: {
        zh: '第 36 题问纸为何取代羊皮纸，原文先说羊皮纸耐用，再用 yet 转折说纸更快批量生产。转折词之后才是答案；把两个材料的强项分别记在选项旁。',
        en: 'Item 36 asks why paper replaced parchment. The lecture first credits parchment with durability, then turns with yet to paper’s faster mass production. The answer follows the contrast; note each material’s strength beside its option.',
      },
    },
    {
      title: { zh: '多选题排除附带提及', en: 'Rule out passing mentions in multiple choice' },
      body: {
        zh: '多选三选项里，信件邮寄被提到但紧接着说明还依赖道路和邮票，属于附带条件； fewer teachers 被直接否定。只有作为明确“effect”列出的书籍、报纸、公文才是答案。',
        en: 'Among the multiple-choice options, letters by post are mentioned but immediately tied to roads and stamps, so they are a conditional aside; fewer teachers is directly rejected. Only books, newspapers and official records are listed as clear effects.',
      },
    },
  ],
};
