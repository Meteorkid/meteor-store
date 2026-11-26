import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 34 · Part 3 — 博物馆借展讨论（两人讨论，澳式 + 英式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：借展条件、运输、保险、公众教育（配对 21–24）→
 * 条件前置原因、展签撰写人、到损处理（单选 25–27）→ 三项借展准备（多选 28–30）。
 */
export const test34Part3: ListeningLesson = {
  slug: 'test-34-part-3',
  part: 3,
  status: 'published',
  title: { zh: '博物馆借展讨论', en: 'Discussing a museum loan of artefacts' },
  summary: {
    zh: '两名馆员讨论从县藏馆借展四件石器：借展只限两公斤以下器物，由专业公司用衬垫板条箱运输，物件在起运前由独立评估师估值，展期配合面向本地学校的讲座；条件前置是为保护物件、出借方与本馆，展签由本馆策展人据县档笔记撰写，到损时暂停搬运并由修复师拍照。准备步骤包括打包前状况报告、恒温板条箱和公众教育讲座。',
    en: 'Two curators discuss borrowing four stone objects: the loan covers items under two kilos, a specialist firm carries them in crates, an independent assessor values them, and the show pairs with a schools talk. Conditions protect object, lender and collection; our curator writes labels; on damage the move pauses for photos. Preparations are the condition report, the crate and the education talk.',
  },
  accent: { zh: 'William 为澳式口音，Thomas 为英式口音，两人语速中等。', en: 'William speaks with an Australian accent and Thomas with a British accent, both at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'william', label: 'WILLIAM', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which description matches each loan topic? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'limited to objects under two kilos' },
        { key: 'B', text: 'carried in padded crates by a specialist firm' },
        { key: 'C', text: 'valued by an independent assessor' },
        { key: 'D', text: 'paired with a talk for local schools' },
        { key: 'E', text: 'stored in the donor’s own basement' },
      ],
      items: [
        { number: 21, text: 'The loan condition' },
        { number: 22, text: 'The transport' },
        { number: 23, text: 'The insurance' },
        { number: 24, text: 'The public education' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why are conditions set before the loan?',
          options: [
            { key: 'A', text: 'To protect the object, lender and our collection during the move' },
            { key: 'B', text: 'To set a sale price for the borrowed pieces' },
            { key: 'C', text: 'To decide which gifts go to the county' },
          ],
        },
        {
          number: 26,
          stem: 'Who writes the exhibition labels?',
          options: [
            { key: 'A', text: 'The independent assessor' },
            { key: 'B', text: 'Our curator using the county archive notes' },
            { key: 'C', text: 'The specialist transport firm' },
          ],
        },
        {
          number: 27,
          stem: 'What happens if an object arrives damaged?',
          options: [
            { key: 'A', text: 'The unpacking continues and the damage is noted later' },
            { key: 'B', text: 'The move pauses while the conservator photographs the damage' },
            { key: 'C', text: 'The lender removes the whole collection immediately' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE preparations belong to this loan? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE preparations belong to this loan?',
      options: [
        { key: 'A', text: 'condition report before packing' },
        { key: 'B', text: 'temperature-controlled crate' },
        { key: 'C', text: 'public education talk' },
        { key: 'D', text: 'new replica made for sale' },
        { key: 'E', text: 'donor photo album' },
        { key: 'F', text: 'free museum membership' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：The loan is limited to objects under two kilos, so the heavy bronze pieces stay home。借展条件限两公斤以下，对应 A。',
        en: 'Sentence 3: the loan "is limited to objects under two kilos", matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：They are carried in padded crates by a specialist firm that handles historic pieces。运输由专业公司用衬垫板条箱完成，对应 B。',
        en: 'Sentence 5: objects are "carried in padded crates by a specialist firm", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：The objects are valued by an independent assessor before they leave。保险估值由独立评估师完成，对应 C。',
        en: 'Sentence 9: objects are "valued by an independent assessor", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 13,
      explanation: {
        zh: '定位句 13：The loan is paired with a talk for local schools during the open weeks。公众教育配合本地学校讲座，对应 D。地下室存放是借展前的旧状况。',
        en: 'Sentence 13: the loan is "paired with a talk for local schools", matching D. Basement storage is the former condition, not education.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：They protect the object, the lender and our own collection during the move。条件前置保护物件、出借方和本馆，对应 A。定价、送礼均非原因。',
        en: 'Sentence 19: conditions protect "the object, the lender and our own collection", matching A. Pricing and gifts are not the reason.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：Our curator writes the labels, using the county archive notes。展签由本馆策展人据县档撰写，对应 B。评估师、运输公司不写展签。',
        en: 'Sentence 21: "our curator writes the labels" from county archive notes, matching B. The assessor and transport firm do not write them.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The move is paused, and the conservator photographs the damage before unpacking further。到损先暂停搬运并由修复师拍照，对应 B。继续拆箱事后记录、出借方立刻撤展均未提及。',
        en: 'Sentence 25: "the move is paused" and the conservator photographs the damage, matching B. Continuing unpacking or immediate removal are not stated.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：First, a condition report is completed for every object before it is packed。打包前出具状况报告，对应 A。',
        en: 'Sentence 29: "a condition report is completed" before packing, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：Second, each crate keeps a steady temperature for the road trip。板条箱保持恒温运输，对应 B。',
        en: 'Sentence 30: each crate keeps "a steady temperature for the road trip", matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：Third, the public education talk is scheduled once the objects hang in place。公众教育讲座是准备步骤，对应 C。复制售卖、图册参考、会员赠礼均被排除。',
        en: 'Sentence 31: "the public education talk is scheduled", matching C. Replica sales, the reference album and membership gifts are ruled out.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'The museum has been asked to borrow four stone objects from the county collection.' },
    { speaker: 'william', text: 'We should lay down the loan conditions before anything moves.' },
    { speaker: 'thomas', text: 'Right. What limits do we put on the objects themselves?' },
    { speaker: 'william', text: 'The loan is limited to objects under two kilos, so the heavy bronze pieces stay home.' },
    { speaker: 'thomas', text: 'How will the objects get here from the county store?' },
    { speaker: 'william', text: 'They are carried in padded crates by a specialist firm that handles historic pieces.' },
    { speaker: 'thomas', text: 'Does the firm pack each item in its own box?' },
    { speaker: 'william', text: 'Yes, every object sits in its own padded crate with foam around the edges.' },
    { speaker: 'thomas', text: 'Who covers the value while they are in transit?' },
    { speaker: 'william', text: 'The objects are valued by an independent assessor before they leave.' },
    { speaker: 'thomas', text: 'Is that valuation written into the loan agreement?' },
    { speaker: 'william', text: 'It is, along with the record of the object’s current condition.' },
    { speaker: 'thomas', text: 'What about visitors once the items are on display?' },
    { speaker: 'william', text: 'The loan is paired with a talk for local schools during the open weeks.' },
    { speaker: 'thomas', text: 'Should we produce a family guide to the borrowed pieces as well?' },
    { speaker: 'william', text: 'That guide can wait until the main labels are finished.' },
    { speaker: 'thomas', text: 'Where did the county keep the pieces before this request?' },
    { speaker: 'william', text: 'They were stored in the donor’s own basement for most of the last decade.' },
    { speaker: 'thomas', text: 'Why do we fix conditions so early in the process?' },
    { speaker: 'william', text: 'They protect the object, the lender and our own collection during the move.' },
    { speaker: 'thomas', text: 'Who drafts the short labels next to each borrowed object?' },
    { speaker: 'william', text: 'Our curator writes the labels, using the county archive notes.' },
    { speaker: 'thomas', text: 'Does the lender approve the wording before printing?' },
    { speaker: 'william', text: 'Yes, the county keeper checks each label and signs it off.' },
    { speaker: 'thomas', text: 'What if an object arrives with a chip or a crack?' },
    { speaker: 'william', text: 'The move is paused, and the conservator photographs the damage before unpacking further.' },
    { speaker: 'thomas', text: 'Who contacts the lender in that case?' },
    { speaker: 'william', text: 'The registrar writes to the keeper the same working day.' },
    { speaker: 'thomas', text: 'Let’s list the preparations we need before packing.' },
    { speaker: 'william', text: 'First, a condition report is completed for every object before it is packed.' },
    { speaker: 'thomas', text: 'Second, each crate keeps a steady temperature for the road trip.' },
    { speaker: 'william', text: 'Third, the public education talk is scheduled once the objects hang in place.' },
    { speaker: 'thomas', text: 'Are there any items we would refuse for this loan?' },
    { speaker: 'william', text: 'A fragile piece that cracks under light would stay in the county store.' },
    { speaker: 'thomas', text: 'Do we make a replica to sell in the shop?' },
    { speaker: 'william', text: 'No, no replica is produced for sale under this loan agreement.' },
    { speaker: 'thomas', text: 'Does the donor provide a photo album of the pieces?' },
    { speaker: 'william', text: 'The lender sends one album, but it is reference material, not a preparation step.' },
    { speaker: 'thomas', text: 'Is free membership offered to the lender’s staff?' },
    { speaker: 'william', text: 'Membership terms are a separate gift question, outside this loan.' },
    { speaker: 'thomas', text: 'How long can the objects stay with us?' },
    { speaker: 'william', text: 'The loan runs six months, with a single extension agreed in writing.' },
    { speaker: 'thomas', text: 'Who arranges the return transport at the end?' },
    { speaker: 'william', text: 'The same specialist firm carries the crates back after the show closes.' },
    { speaker: 'thomas', text: 'Does the insurance cover the display case itself?' },
    { speaker: 'william', text: 'Insurance follows the object, not the case it sits in during the show.' },
    { speaker: 'thomas', text: 'How often are the borrowed items checked during the loan?' },
    { speaker: 'william', text: 'A weekly inspection records light, humidity and any marks on the surface.' },
    { speaker: 'thomas', text: 'Who keeps the packing materials after unpacking?' },
    { speaker: 'william', text: 'The registrar stores the foam and crates for the return trip.' },
    { speaker: 'thomas', text: 'Should labels mention the object’s former owner?' },
    { speaker: 'william', text: 'The keeper approves any reference to the donor’s name.' },
    { speaker: 'thomas', text: 'What publicity goes with the borrowed pieces?' },
    { speaker: 'william', text: 'A short press note lists the four objects and the open weeks.' },
    { speaker: 'thomas', text: 'Does the loan include any objects on long-term display elsewhere?' },
    { speaker: 'william', text: 'No, pieces already on tour are excluded from this request.' },
    { speaker: 'thomas', text: 'How do we record the journey for our own files?' },
    { speaker: 'william', text: 'The registrar logs dates, crate numbers and the firm’s contact details.' },
    { speaker: 'thomas', text: 'What if the road weather delays the delivery?' },
    { speaker: 'william', text: 'The conservator holds the unpacking room ready until the crates arrive.' },
    { speaker: 'thomas', text: 'Who writes the education notes for the school talk?' },
    { speaker: 'william', text: 'The education officer drafts them, and the curator checks the facts.' },
    { speaker: 'thomas', text: 'Is there a budget for photographing the borrowed set?' },
    { speaker: 'william', text: 'Yes, one studio session covers the four objects for the archive.' },
    { speaker: 'thomas', text: 'When does the county expect the first draft of labels?' },
    { speaker: 'william', text: 'Two weeks before the crates leave the county store.' },
    { speaker: 'thomas', text: 'Let’s send the conditions list to the keeper this afternoon.' },
    { speaker: 'william', text: 'I will attach the assessor’s contact and the packing checklist.' },
  ],
  vocabulary: [
    {
      term: 'objects', phonetic: '/ˈɒbdʒɪkts/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '展品，器物（借展物件）', en: 'the artefact borrowed under the loan agreement' },
      usage: { zh: '可数；an object under two kilos、the borrowed object。', en: 'Countable: the borrowed object; also a verb in another sense.' },
      collocations: ['the borrowed object', 'every object', 'the object’s condition'],
      example: { en: 'The loan covers objects under two kilos.', zh: '借展限两公斤以下器物。' },
      listening: { zh: '双音节，名词重音在第一音节 /ˈɒb/。', en: 'Two syllables; noun stress on the first.' },
    },
    {
      term: 'crates', phonetic: '/kreɪts/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '板条箱（运输用箱）', en: 'the padded shipping box for each object' },
      usage: { zh: '可数；padded crates、the return crate。', en: 'Countable: padded crates for the road trip.' },
      collocations: ['padded crates', 'the return crate', 'crate numbers'],
      example: { en: 'Each object travels in its own crate.', zh: '每件器物用单独板条箱运输。' },
      listening: { zh: '单音节，与 late 押韵。', en: 'One syllable, rhyming with late.' },
    },
    {
      term: 'assessor', phonetic: '/əˈsesə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '评估师（独立估值人）', en: 'the independent person who sets the object’s value' },
      usage: { zh: '可数；an independent assessor、the assessor’s contact。', en: 'Countable: an independent assessor; the verb is assess.' },
      collocations: ['an independent assessor', 'the assessor’s contact', 'the insurance assessor'],
      example: { en: 'An assessor values the objects first.', zh: '先由评估师给器物估值。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈses/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'condition', phonetic: '/kənˈdɪʃn/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '状况，保存状态', en: 'the recorded state of an object before packing' },
      usage: { zh: '可数/不可数；a condition report、current condition。', en: 'Countable or uncountable: a condition report.' },
      collocations: ['a condition report', 'current condition', 'the object’s condition'],
      example: { en: 'A condition report precedes packing.', zh: '打包前先出状况报告。' },
      listening: { zh: '双音节，重音在第二音节 /ˈdɪʃ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'conservator', phonetic: '/kənˈsɜːvətə/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '文物修复师', en: 'the specialist who checks and repairs artefacts' },
      usage: { zh: '可数；the conservator photographs damage、conservator notes。', en: 'Countable: the conservator checks surface marks.' },
      collocations: ['the conservator', 'the conservator’s photos', 'conservator inspection'],
      example: { en: 'The conservator records the damage.', zh: '修复师记录损坏情况。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈsɜː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'registrar', phonetic: '/ˌredʒɪˈstrɑː/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '藏品登记员', en: 'the officer who keeps loan records and contacts' },
      usage: { zh: '可数；the registrar writes to the keeper、registrar logs。', en: 'Countable: the registrar keeps the files.' },
      collocations: ['the registrar', 'the registrar’s files', 'registrar records'],
      example: { en: 'The registrar logs the crate numbers.', zh: '登记员记录板条箱编号。' },
      listening: { zh: '三个音节，重音在第三音节 /ˈstrɑː/。', en: 'Three syllables with stress on the third.' },
    },
    {
      term: 'humidity', phonetic: '/hjuːˈmɪdəti/', partOfSpeech: 'n.', sentenceIndex: 47,
      meaning: { zh: '湿度（展藏环境）', en: 'the moisture level recorded around the objects' },
      usage: { zh: '不可数；record humidity、light and humidity。', en: 'Uncountable: monitor light and humidity.' },
      collocations: ['light and humidity', 'record humidity', 'humidity levels'],
      example: { en: 'The inspection records humidity each week.', zh: '每周检查记录湿度。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈmɪd/。', en: 'Four syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'lay down', sentenceIndex: 1,
      meaning: { zh: '制定，定下（条件）', en: 'to fix the terms before the work begins' },
      usage: { zh: '短语动词；lay down the conditions、lay down the rules。', en: 'Lay down means set formally; compare set out.' },
      example: { en: 'We lay down the loan conditions first.', zh: '我们先定下借展条件。' },
    },
    {
      phrase: 'in transit', sentenceIndex: 8,
      meaning: { zh: '在运输途中', en: 'while the objects are being carried between sites' },
      usage: { zh: '固定短语；cover the value in transit、damage in transit。', en: 'In transit means during the journey; compare on the road.' },
      example: { en: 'Insurance follows the object in transit.', zh: '保险覆盖运输途中的器物。' },
    },
    {
      phrase: 'paired with', sentenceIndex: 13,
      meaning: { zh: '配套安排（讲座）', en: 'to be run alongside the borrowed exhibition' },
      usage: { zh: '被动短语；the loan is paired with a talk、pair a show with events。', en: 'Paired with means matched with; compare combined with.' },
      example: { en: 'The show is paired with a schools talk.', zh: '展览配套学校讲座。' },
    },
    {
      phrase: 'signs it off', sentenceIndex: 23,
      meaning: { zh: '签字批准（展签措辞）', en: 'to approve the label wording before printing' },
      usage: { zh: '短语动词；the keeper signs it off、sign off on the label。', en: 'Signs it off means approves; compare sign off on.' },
      example: { en: 'The keeper checks each label and signs it off.', zh: '馆长逐条核对展签并签字。' },
    },
    {
      phrase: 'logs dates', sentenceIndex: 57,
      meaning: { zh: '登记日期与编号', en: 'to record dates and crate numbers in the files' },
      usage: { zh: '动宾短语；the registrar logs dates、log the journey。', en: 'Logs dates means records entries; compare keeps a record of.' },
      example: { en: 'The registrar logs dates and crate numbers.', zh: '登记员登记日期与箱号。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按借展环节归类', en: 'Match topic to loan stage' },
      body: {
        zh: '配对四题先认环节：条件限重两公斤，运输用衬垫板条箱，保险由独立评估师估值，教育配套学校讲座。地下室存放是借展前旧状况，不是教育安排。',
        en: 'Read the stage first: conditions limit weight to two kilos, transport uses padded crates, insurance needs an independent assessor, and education pairs a schools talk. Basement storage is the former state, not an education event.',
      },
    },
    {
      title: { zh: '单选定责任与处置', en: 'Pick responsibility and response' },
      body: {
        zh: '条件前置保护三方；展签由本馆策展人写、出借方馆长签字；到损先暂停搬运、修复师拍照，登记员同日联系出借方。评估师、运输公司不承担展签撰写。',
        en: 'Conditions protect three parties; our curator writes labels, the keeper signs off; on damage the move pauses for conservator photos, and the registrar contacts the lender same day. The assessor and firm do not write labels.',
      },
    },
    {
      title: { zh: '多选剔除非准备项', en: 'Rule out non-preparations' },
      body: {
        zh: '三项准备：打包前状况报告、恒温板条箱、公众教育讲座。复制售卖不做；图册只是参考材料；会员赠礼属另一议题。听到 no replica、reference material、separate gift 就划掉对应选项。',
        en: 'The three preparations are the condition report, the temperature-controlled crate and the education talk. No replica is sold; the album is reference only; membership is a separate gift. Cross out options at no replica, reference material and separate gift.',
      },
    },
  ],
};
