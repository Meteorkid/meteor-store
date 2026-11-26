import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 34 · Part 1 — 购买火车季票（双人对话，澳式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：适用区间 → 折扣卡叠加 → 退款计算（前填空块 1–3、单选 4–6）→
 * 电子票使用、生效日、退款手续费、排除车次（后填空块 7–10）。
 * 开场用直接问题，不用机构问候加 How can I help you。
 */
export const test34Part1: ListeningLesson = {
  slug: 'test-34-part-1',
  part: 1,
  status: 'published',
  title: { zh: '购买火车季票', en: 'Buying a rail season ticket' },
  summary: {
    zh: '一名乘客咨询火车季票：车票覆盖 Greenfield 到市中心的线路，铁路卡可叠加享十五折优惠，月度票退款按未使用周数计算并扣除手续费；电子票存在手机铁路应用里，检票员扫屏幕条形码，新票下周一生效，工作日九点后的高峰车次不含在内。',
    en: 'A passenger asks about a rail season ticket: it covers the line from Greenfield to the city centre, a railcard stacks on top for a fifteen percent cut, and monthly refunds are worked out from unused weeks minus an admin fee. The e-ticket sits in the rail app, the inspector scans the barcode on screen, the new ticket starts next Monday, and peak trains after nine are excluded.',
  },
  accent: { zh: '售票员与乘客均为澳式口音，对话语速中等。', en: 'The clerk and the passenger both speak with Australian accents, at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'passenger', label: 'PASSENGER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Valid between', cells: [[{ blank: 1 }, { text: ' and the city centre' }]] },
        { lead: 'Railcard reduction:', cells: [[{ blank: 2 }, { text: ' percent' }]] },
        { lead: 'Refund applies to a', cells: [[{ blank: 3 }, { text: ' ticket' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'How is a refund calculated?',
          options: [
            { key: 'A', text: 'From the unused weeks, minus an admin fee' },
            { key: 'B', text: 'As half the price paid, regardless of travel' },
            { key: 'C', text: 'By refunding every day not travelled at full price' },
          ],
        },
        {
          number: 5,
          stem: 'How does the discount card combine with the season ticket?',
          options: [
            { key: 'A', text: 'It cannot be used with a season ticket' },
            { key: 'B', text: 'It stacks on top, giving a fifteen percent reduction' },
            { key: 'C', text: 'It replaces the season ticket after renewal' },
          ],
        },
        {
          number: 6,
          stem: 'What do passengers need to use the e-ticket?',
          options: [
            { key: 'A', text: 'A printed paper card from the machine' },
            { key: 'B', text: 'A separate bus pass for the gate' },
            { key: 'C', text: 'The rail app with the barcode on screen' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'E-ticket stored in the rail', cells: [[{ blank: 7 }]] },
        { lead: 'Valid from next', cells: [[{ blank: 8 }]] },
        { lead: 'Peak trains after', cells: [[{ blank: 9 }, { text: ' are excluded' }]] },
        { lead: 'Refund keeps an', cells: [[{ blank: 10 }, { text: ' fee' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Greenfield'], evidence: 2,
      explanation: {
        zh: '定位句 2：The season ticket covers the line from Greenfield to the city centre。区间起点是 Greenfield，填 Greenfield。大学支线不在范围内。',
        en: 'Sentence 2: the ticket covers the line "from Greenfield to the city centre", so fill Greenfield. The university branch is outside the zone.',
      },
    },
    {
      number: 2, accepted: ['fifteen', '15'], evidence: 6,
      explanation: {
        zh: '定位句 6：the card gives a fifteen percent reduction on the season price。铁路卡优惠百分之十五，填 fifteen。学生卡二十 percent 是另一档。',
        en: 'Sentence 6: the card gives "a fifteen percent reduction", so fill fifteen. The student card at twenty percent is a separate rate.',
      },
    },
    {
      number: 3, accepted: ['monthly'], evidence: 9,
      explanation: {
        zh: '定位句 9：What happens if I buy a monthly ticket and then need to cancel?。退款针对月度票，填 monthly。季度票是另一种购买方式。',
        en: 'Sentence 9: the question concerns "a monthly ticket" that needs cancelling, so fill monthly. The quarterly ticket is a different purchase.',
      },
    },
    {
      number: 4, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：Refunds are worked out from the unused weeks, not the days you already travelled。退款按未使用周数算，再扣手续费，对应 A。半价、未出行日全额退均未提及。',
        en: 'Sentence 10: refunds are "worked out from the unused weeks", matching A, with an admin fee held back. Half-price and full daily refunds are not mentioned.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：The discount still stacks on the season price。折扣卡可叠加在季票价格上，对应 B。它不能与季票并用、续费后替代季票都不符合原文。',
        en: 'Sentence 14: "the discount still stacks on the season price", matching B. Being unusable with a ticket or replacing it after renewal are not stated.',
      },
    },
    {
      number: 6, accepted: ['C'], evidence: 16,
      explanation: {
        zh: '定位句 16：Open the app and show the barcode on the screen。电子票靠应用里的屏幕条形码使用，对应 C。纸质卡、公交卡都不是检票凭证。',
        en: 'Sentence 16: open the app and show "the barcode on the screen", matching C. A paper card and a bus pass are not the gate proof.',
      },
    },
    {
      number: 7, accepted: ['app'], evidence: 18,
      explanation: {
        zh: '定位句 18：It is stored on the phone in the rail app。电子票存在铁路应用中，填 app。',
        en: 'Sentence 18: the e-ticket is stored "in the rail app", so fill app.',
      },
    },
    {
      number: 8, accepted: ['Monday'], evidence: 20,
      explanation: {
        zh: '定位句 20：A new season ticket is valid from next Monday, not from today。新票下周一生效，填 Monday。',
        en: 'Sentence 20: the new ticket is "valid from next Monday", so fill Monday.',
      },
    },
    {
      number: 9, accepted: ['nine', '9'], evidence: 22,
      explanation: {
        zh: '定位句 22：Peak trains after nine in the morning are excluded on the inbound route。工作日九点后的高峰车次不含，填 nine。周末非高峰车次可用。',
        en: 'Sentence 22: "peak trains after nine in the morning are excluded", so fill nine. Off-peak weekend trains are included.',
      },
    },
    {
      number: 10, accepted: ['admin'], evidence: 24,
      explanation: {
        zh: '定位句 24：an admin fee is held back from every refund。退款扣除手续费，填 admin。无论取消原因，手续费标准相同。',
        en: 'Sentence 24: "an admin fee is held back from every refund", so fill admin. The fee stays the same whatever the cancellation reason.',
      },
    },
  ],
  transcript: [
    { speaker: 'clerk', text: 'Where do you live, and which station do you board at?' },
    { speaker: 'passenger', text: 'I live in Greenfield, and I catch the train at the Greenfield station each morning.' },
    { speaker: 'clerk', text: 'Right. The season ticket covers the line from Greenfield to the city centre.' },
    { speaker: 'passenger', text: 'Does it cover the branch line out to the university as well?' },
    { speaker: 'clerk', text: 'No, that branch is outside the zone, so you would pay a single fare for it.' },
    { speaker: 'passenger', text: 'Can I use my railcard on top of the season ticket?' },
    { speaker: 'clerk', text: 'Yes, the card gives a fifteen percent reduction on the season price.' },
    { speaker: 'passenger', text: 'Is there a student card with a bigger cut?' },
    { speaker: 'clerk', text: 'The student card gives twenty percent, but you must show it at the desk each renewal.' },
    { speaker: 'passenger', text: 'What happens if I buy a monthly ticket and then need to cancel?' },
    { speaker: 'clerk', text: 'Refunds are worked out from the unused weeks, not the days you already travelled.' },
    { speaker: 'passenger', text: 'Is any money kept for the paperwork?' },
    { speaker: 'clerk', text: 'Yes, an admin fee is held back from every refund, whatever the reason.' },
    { speaker: 'passenger', text: 'How is the refund returned to me?' },
    { speaker: 'clerk', text: 'The discount still stacks on the season price, and the rest of the refund returns to your card.' },
    { speaker: 'passenger', text: 'What do I show the inspector at the gate?' },
    { speaker: 'clerk', text: 'Open the app and show the barcode on the screen; keep the phone charged for the trip.' },
    { speaker: 'passenger', text: 'Where is the e-ticket stored?' },
    { speaker: 'clerk', text: 'It is stored on the phone in the rail app.' },
    { speaker: 'passenger', text: 'When does the ticket start if I buy it today?' },
    { speaker: 'clerk', text: 'A new season ticket is valid from next Monday, not from today.' },
    { speaker: 'passenger', text: 'Are there any trains I cannot take with this ticket?' },
    { speaker: 'clerk', text: 'Peak trains after nine in the morning are excluded on the inbound route.' },
    { speaker: 'passenger', text: 'Does the refund keep any paperwork fee?' },
    { speaker: 'clerk', text: 'Yes, an admin fee is held back from every refund, whether you change jobs or move away.' },
    { speaker: 'passenger', text: 'Can I use it on the weekend services?' },
    { speaker: 'clerk', text: 'Yes, off-peak weekend trains are included with no extra charge.' },
    { speaker: 'passenger', text: 'Can a friend use my ticket on days I am off?' },
    { speaker: 'clerk', text: 'No, the season ticket is personal to you and cannot be transferred.' },
    { speaker: 'passenger', text: 'Is there a discount for buying three months at once?' },
    { speaker: 'clerk', text: 'A quarterly ticket costs slightly less than three monthly ones, but there is no yearly offer this year.' },
    { speaker: 'passenger', text: 'How do I pay at the desk?' },
    { speaker: 'clerk', text: 'Card or contactless works here; cash is not accepted for season tickets.' },
    { speaker: 'passenger', text: 'Will I receive a confirmation email?' },
    { speaker: 'clerk', text: 'Yes, the email lists the route, the start date and the ticket type.' },
    { speaker: 'passenger', text: 'What if the phone battery dies on the platform?' },
    { speaker: 'clerk', text: 'Show the confirmation email to the inspector, or ask at the ticket office.' },
    { speaker: 'passenger', text: 'Is the e-ticket valid on buses in the city?' },
    { speaker: 'clerk', text: 'No, it covers rail only; the local bus needs a separate pass.' },
    { speaker: 'passenger', text: 'What if my railcard expires mid-month?' },
    { speaker: 'clerk', text: 'Renew the card before the ticket runs out, or the discount stops applying.' },
    { speaker: 'passenger', text: 'Good. I will take the monthly ticket from Greenfield.' },
  ],
  vocabulary: [
    {
      term: 'season ticket', phonetic: '/ˈsiːzn ˈtɪkɪt/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '季票，限定期内通勤通用车票', en: 'a rail ticket valid for a fixed period of travel' },
      usage: { zh: '可数；a season ticket、the season price。不可转让给他人。', en: 'Countable: a season ticket; it cannot be transferred to another person.' },
      collocations: ['a season ticket', 'the season price', 'renew a season ticket'],
      example: { en: 'The season ticket covers Greenfield to the centre.', zh: '季票覆盖 Greenfield 到市中心。' },
      listening: { zh: 'season 双音节，ticket 双音节，重音分别在第一音节。', en: 'Both words are two syllables with first-syllable stress.' },
    },
    {
      term: 'reduction', phonetic: '/rɪˈdʌkʃn/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '减免，折扣幅度', en: 'the percent cut taken off the ticket price' },
      usage: { zh: '可数；a fifteen percent reduction、a price reduction。动词 reduce。', en: 'Countable: a percent reduction; the verb is reduce.' },
      collocations: ['a fifteen percent reduction', 'a price reduction', 'the railcard reduction'],
      example: { en: 'The card gives a fifteen percent reduction.', zh: '卡片享受百分之十五减免。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdʌk/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'refunds', phonetic: '/ˈriːfʌndz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '退款，退回的票款', en: 'the money returned when a ticket is cancelled' },
      usage: { zh: '可数；a refund、the unused weeks。动词读 /rɪˈfʌnd/。', en: 'Countable: a refund; the verb is pronounced /rɪˈfʌnd/.' },
      collocations: ['a refund', 'work out a refund', 'the refund returns to your card'],
      example: { en: 'Refunds follow the unused weeks.', zh: '退款按未使用周数计算。' },
      listening: { zh: '双音节，名词重音在第一音节 /ˈriː/。', en: 'Two syllables; noun stress on the first.' },
    },
    {
      term: 'barcode', phonetic: '/ˈbɑːkəʊd/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '条形码（手机票凭证）', en: 'the scanned pattern shown on the phone screen' },
      usage: { zh: '可数；show the barcode、scan the barcode。', en: 'Countable: show or scan the barcode.' },
      collocations: ['show the barcode', 'scan the barcode', 'the barcode on screen'],
      example: { en: 'The inspector scans the barcode on screen.', zh: '检票员扫屏幕条形码。' },
      listening: { zh: '双音节，重音在第一音节 /ˈbɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'e-ticket', phonetic: '/ˈiː ˈtɪkɪt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '电子票，手机上的车票', en: 'the digital ticket held on the phone' },
      usage: { zh: '可数；the e-ticket、store the e-ticket。', en: 'Countable: store the e-ticket on the phone.' },
      collocations: ['the e-ticket', 'store the e-ticket', 'the e-ticket in the app'],
      example: { en: 'The e-ticket lives in the rail app.', zh: '电子票在铁路应用里。' },
      listening: { zh: '前缀 e 长音 /iː/，后接 ticket。', en: 'The e- prefix sounds long /iː/, then ticket.' },
    },
    {
      term: 'admin', phonetic: '/ˈædmɪn/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '手续的，管理费用', en: 'the fee kept back for paperwork and processing' },
      usage: { zh: '名词定语；an admin fee、admin charge。完整形式 administration。', en: 'Used attributively: an admin fee; the full word is administration.' },
      collocations: ['an admin fee', 'the admin charge', 'keep back the admin fee'],
      example: { en: 'An admin fee is held back from refunds.', zh: '退款扣除手续费。' },
      listening: { zh: '双音节，重音在第一音节 /ˈæd/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'transferred', phonetic: '/trænsˈfɜːd/', partOfSpeech: 'v.', sentenceIndex: 28,
      meaning: { zh: '转让，转给他人使用', en: 'to pass the ticket to another person' },
      usage: { zh: '动词；cannot be transferred、transfer the ticket。', en: 'Verb: cannot be transferred; the noun stress differs.' },
      collocations: ['cannot be transferred', 'transfer the ticket', 'personal to you'],
      example: { en: 'The ticket cannot be transferred to a friend.', zh: '车票不能转给朋友。' },
      listening: { zh: '双音节，动词重音在第二音节 /ˈfɜː/。', en: 'Two syllables; verb stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'on top of', sentenceIndex: 5,
      meaning: { zh: '叠加在（票价）之上', en: 'in addition to the main season price' },
      usage: { zh: '介词短语；use a card on top of the ticket、on top of the fee。', en: 'On top of means in addition to; compare together with.' },
      example: { en: 'The railcard stacks on top of the ticket.', zh: '铁路卡叠加在季票之上。' },
    },
    {
      phrase: 'worked out', sentenceIndex: 10,
      meaning: { zh: '计算出（退款金额）', en: 'to be calculated from the remaining period' },
      usage: { zh: '被动短语；refunds are worked out from unused weeks。', en: 'Passive: refunds are worked out from the unused weeks.' },
      example: { en: 'Refunds are worked out from unused weeks.', zh: '退款按未使用周数算。' },
    },
    {
      phrase: 'held back', sentenceIndex: 12,
      meaning: { zh: '扣留，扣下（手续费）', en: 'kept back from the returned money' },
      usage: { zh: '被动短语；a fee is held back、hold back the charge。', en: 'Passive: a fee is held back; the active verb is hold back.' },
      example: { en: 'An admin fee is held back from each refund.', zh: '每笔退款扣下手续费。' },
    },
    {
      phrase: 'stacks on', sentenceIndex: 14,
      meaning: { zh: '叠加适用（折扣）', en: 'to combine one discount on top of another' },
      usage: { zh: '短语动词；the discount stacks on the price、stack discounts。', en: 'Stacks on means combines additively; compare combine.' },
      example: { en: 'The discount stacks on the season price.', zh: '折扣叠加在季票价上。' },
    },
    {
      phrase: 'valid from', sentenceIndex: 20,
      meaning: { zh: '自（某日）起有效', en: 'starting to be usable on the stated date' },
      usage: { zh: '固定短语；valid from next Monday、valid until the end。', en: 'Valid from marks the start date; compare valid until.' },
      example: { en: 'The ticket is valid from next Monday.', zh: '车票下周一生效。' },
    },
  ],
  tips: [
    {
      title: { zh: '区间与支线分开听', en: 'Separate the zone from the branch' },
      body: {
        zh: '季票覆盖 Greenfield 到市中心主线；大学支线在区间外，需另买单程票。填起点站名时，别把支线站名写进去。',
        en: 'The ticket covers the Greenfield-to-centre main line; the university branch lies outside the zone and needs a single fare. Do not write the branch station in the start blank.',
      },
    },
    {
      title: { zh: '退款抓未用周数与手续费', en: 'Catch unused weeks and the fee' },
      body: {
        zh: '退款按未使用周数计算，不按已出行天数；每笔退款另扣固定手续费，取消原因不影响金额。听到 unused weeks、admin fee、held back 就标在选项旁。',
        en: 'Refunds follow unused weeks, not days already travelled; a fixed admin fee is held back regardless of reason. Mark unused weeks, admin fee and held back beside the options.',
      },
    },
    {
      title: { zh: '电子票认应用与条形码', en: 'Recognise app and barcode for e-tickets' },
      body: {
        zh: '电子票存在铁路应用里，检票时打开应用出示屏幕条形码，手机需有电；纸质卡和公交卡都不是入口凭证。应用名、生效日、排除车次按笔记顺序记。',
        en: 'The e-ticket lives in the rail app; at the gate open the app and show the barcode, with a charged phone. Paper cards and bus passes are not gate proof. Note the app, start date and excluded trains in order.',
      },
    },
  ],
};
