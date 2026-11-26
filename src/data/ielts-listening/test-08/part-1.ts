import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 8 · Part 1 — 车主给自行车投保（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话围绕车架号、购买年份、车锁类型、保费、防盗要求、失窃免赔额、
 * 配件限额与理赔时限展开，穿插车库、电缆锁等干扰信息。
 */
export const test08Part1: ListeningLesson = {
  slug: 'test-08-part-1',
  part: 1,
  status: 'published',
  title: { zh: '给自行车上保险', en: 'Insuring a bicycle' },
  summary: {
    zh: '自行车车主向保险公司咨询投保：车架号、购买年份、车锁类型与年保费，保单有效的防盗要求、失窃免赔额，以及事故后的报警、配件限额、理赔时限和理赔流程。',
    en: 'A bicycle owner asks an insurer about cover: the frame number, year of purchase, lock type and annual premium, the security conditions that keep the policy valid, the theft excess, the accessory limit, and the claim process after an incident.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'agent', label: 'AGENT', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'owner', label: 'OWNER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Frame number', cells: [[{ blank: 1 }]] },
        { lead: 'Year purchased', cells: [[{ blank: 2 }]] },
        { lead: 'Lock type', cells: [[{ blank: 3 }]] },
        { lead: 'Annual premium', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What security requirement does the insurer insist on?',
          options: [
            { key: 'A', text: 'The bike must be kept in a locked garage.' },
            { key: 'B', text: 'The lock must be fixed to a fixed object.' },
            { key: 'C', text: 'A tracking device must be fitted to the frame.' },
          ],
        },
        {
          number: 6,
          stem: 'What excess does the owner pay if the bike is stolen?',
          options: [
            { key: 'A', text: 'twenty-five pounds' },
            { key: 'B', text: 'forty-five pounds' },
            { key: 'C', text: 'seventy pounds' },
          ],
        },
        {
          number: 7,
          stem: 'What must the owner do first after a theft?',
          options: [
            { key: 'A', text: 'Contact the police and get a reference number.' },
            { key: 'B', text: 'Phone the insurer within forty-eight hours.' },
            { key: 'C', text: 'Check the terms of the home insurance policy.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Cover', 'Limit or condition'],
      rows: [
        { lead: 'Accessories', cells: [[{ text: 'covered up to £' }, { blank: 8 }]] },
        { lead: 'Accidental damage', cells: [[{ blank: 9 }, { text: ' pounds excess' }]] },
        { lead: 'Claim submitted within', cells: [[{ blank: 10 }, { text: ' hours of the incident' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['724'], spoken: 'seven two four', evidence: 6,
      explanation: {
        zh: '定位句 6：The number is seven two four, right at the edge of the metal。车架号按数字读，卷面写 724；不要把车架号和车型 Ridgeway 混淆。',
        en: 'Sentence 6: "The number is seven two four, right at the edge of the metal". The frame number is read as digits and written 724; do not confuse it with the make Ridgeway.',
      },
    },
    {
      number: 2, accepted: ['2023'], spoken: 'two thousand and twenty-three', evidence: 8,
      explanation: {
        zh: '定位句 8：Two thousand and twenty-three, from a private seller online。购买年份是 2023；句 4 的 last year 只是相对说法，不能填成年份。',
        en: 'Sentence 8: "Two thousand and twenty-three, from a private seller online". The purchase year is 2023; last year in sentence 4 is only a relative remark, not a date.',
      },
    },
    {
      number: 3, accepted: ['D-lock'], evidence: 12,
      explanation: {
        zh: '定位句 12：I’ve got a D-lock, a heavy one made of hardened steel。车锁是 D 形锁；句 13 的 cable lock 是被否定的另一种锁。',
        en: 'Sentence 12: "I’ve got a D-lock, a heavy one made of hardened steel". The lock is a D-lock; the cable lock in sentence 13 is rejected as insufficient.',
      },
    },
    {
      number: 4, accepted: ['forty-five', '45'], spoken: 'forty-five pounds', evidence: 15,
      explanation: {
        zh: '定位句 15：it’s forty-five pounds a year。年保费是四十五英镑；后面的二十五英镑是失窃免赔额，三十英镑是事故免赔额，都是干扰数字。',
        en: 'Sentence 15: "it’s forty-five pounds a year". The annual premium is forty-five pounds; the twenty-five and thirty pounds later are excesses, not the premium.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The lock must be fixed to a fixed object, such as a railing or a gate post。保单有效的关键是把车锁到固定物上；车库在句 21 被说成并非硬性要求，追踪装置全段未提。',
        en: 'Sentence 19: "The lock must be fixed to a fixed object, such as a railing or a gate post". Keeping the bike locked to a fixed object is the condition; a garage in sentence 21 is not required, and a tracker is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：For theft, the excess is twenty-five pounds, whatever the bike is worth。失窃免赔额二十五英镑；四十五是保费，七十在全段没有依据。',
        en: 'Sentence 23: "For theft, the excess is twenty-five pounds, whatever the bike is worth". The theft excess is twenty-five pounds; forty-five is the premium, and seventy has no basis.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：The first step is to contact the police and get a crime reference number。失窃后第一步是报警取案号；四十八小时是提交理赔的时限，不是第一步。',
        en: 'Sentence 26: "The first step is to contact the police and get a crime reference number". The first move is to report the theft to the police; forty-eight hours is the claim deadline, not the first step.',
      },
    },
    {
      number: 8, accepted: ['two hundred', '200'], spoken: 'two hundred pounds', evidence: 29,
      explanation: {
        zh: '定位句 29：Accessories such as lights, panniers and the pump are covered up to two hundred pounds。配件赔付上限两百英镑；前提是失窃当时固定在车上。',
        en: 'Sentence 29: "Accessories such as lights, panniers and the pump are covered up to two hundred pounds". The accessory limit is two hundred pounds, provided they were fixed to the bike when it was taken.',
      },
    },
    {
      number: 9, accepted: ['thirty', '30'], evidence: 33,
      explanation: {
        zh: '定位句 33：The excess for accidental damage is thirty pounds。事故免赔额三十英镑；注意与失窃免赔额二十五英镑区分。',
        en: 'Sentence 33: "The excess for accidental damage is thirty pounds". The accidental damage excess is thirty pounds; keep it separate from the twenty-five pound theft excess.',
      },
    },
    {
      number: 10, accepted: ['forty-eight', '48'], spoken: 'forty-eight hours', evidence: 35,
      explanation: {
        zh: '定位句 35：You should submit the claim within forty-eight hours of the incident。理赔须在事发后四十八小时内提交；空后已印 hours，只填数字。',
        en: 'Sentence 35: "You should submit the claim within forty-eight hours of the incident". The claim must be sent within forty-eight hours; hours is already printed, so write the number only.',
      },
    },
  ],
  transcript: [
    { speaker: 'owner', text: 'Hello, I need to get insurance for my bicycle, please.' },
    { speaker: 'agent', text: 'Right, let’s go through a few details. Can I take your name first?' },
    { speaker: 'owner', text: 'It’s Daniel O’Connor. That’s O, C, O, double N, O, R.' },
    { speaker: 'agent', text: 'Thank you. And what make is the bike?' },
    { speaker: 'owner', text: 'It’s a Ridgeway touring bike, dark green. I bought it second hand last year.' },
    { speaker: 'agent', text: 'Right. Can you read me the frame number? It’s stamped under the bottom bracket.' },
    { speaker: 'owner', text: 'Let me check. The number is seven two four, right at the edge of the metal.' },
    { speaker: 'agent', text: 'Seven two four. Got it. What year did you buy it?' },
    { speaker: 'owner', text: 'Two thousand and twenty-three, from a private seller online.' },
    { speaker: 'agent', text: 'And where do you keep it overnight?' },
    { speaker: 'owner', text: 'In the hall of my flat, though I’m told a hall alone isn’t enough.' },
    { speaker: 'agent', text: 'It depends on the lock. What type of lock do you use?' },
    { speaker: 'owner', text: 'I’ve got a D-lock, a heavy one made of hardened steel.' },
    { speaker: 'agent', text: 'Good, a D-lock meets our standard. A cable lock would not be enough on its own.' },
    { speaker: 'owner', text: 'What would the annual premium be, roughly?' },
    { speaker: 'agent', text: 'For a touring bike at this value, it’s forty-five pounds a year.' },
    { speaker: 'owner', text: 'Forty-five. Is there a discount if I claim nothing for a year?' },
    { speaker: 'agent', text: 'Yes, a no-claim discount builds up after each theft-free year.' },
    { speaker: 'owner', text: 'Now, what security do you insist on for the policy to stay valid?' },
    { speaker: 'agent', text: 'The lock must be fixed to a fixed object, such as a railing or a gate post.' },
    { speaker: 'owner', text: 'A locked garage isn’t required, then?' },
    { speaker: 'agent', text: 'Not for this area, though it would lower the risk if you could manage one.' },
    { speaker: 'owner', text: 'And if the bike is stolen, what excess do I pay?' },
    { speaker: 'agent', text: 'For theft, the excess is twenty-five pounds, whatever the bike is worth.' },
    { speaker: 'owner', text: 'Twenty-five. That seems fair.' },
    { speaker: 'owner', text: 'Walk me through what happens if someone takes it.' },
    { speaker: 'agent', text: 'The first step is to contact the police and get a crime reference number.' },
    { speaker: 'owner', text: 'Do I then ring you straight away?' },
    { speaker: 'owner', text: 'And what about my bags and lights?' },
    { speaker: 'agent', text: 'Accessories such as lights, panniers and the pump are covered up to two hundred pounds.' },
    { speaker: 'owner', text: 'What counts as an accessory, exactly?' },
    { speaker: 'agent', text: 'They must be fixed to the bike when it was taken, otherwise they aren’t included.' },
    { speaker: 'owner', text: 'What about damage from a crash?' },
    { speaker: 'agent', text: 'Accidental damage is covered. The excess for accidental damage is thirty pounds.' },
    { speaker: 'owner', text: 'When should I send the claim form?' },
    { speaker: 'agent', text: 'You should submit the claim within forty-eight hours of the incident.' },
    { speaker: 'owner', text: 'Forty-eight hours. Can I do that online?' },
    { speaker: 'agent', text: 'Yes, the claim form is on our website, or you can call the claims line.' },
    { speaker: 'owner', text: 'Will the payout be based on what I paid for it?' },
    { speaker: 'agent', text: 'No, we use the market value at the time of the theft, minus the excess.' },
    { speaker: 'owner', text: 'I see. Is the policy valid abroad?' },
    { speaker: 'agent', text: 'It covers the United Kingdom only, unless you buy the European extension before you travel.' },
    { speaker: 'owner', text: 'Right. Could you send me the documents to my email?' },
    { speaker: 'agent', text: 'Of course. I’ll email the schedule and the terms, and a reminder about the lock.' },
    { speaker: 'owner', text: 'Thanks very much.' },
    { speaker: 'agent', text: 'You’re welcome. Ride safely, and do keep that D-lock with you.' },
  ],
  vocabulary: [
    {
      term: 'premium', phonetic: '/ˈpriːmiəm/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '保险费', en: 'the amount paid regularly to keep an insurance policy active' },
      usage: { zh: '可数；annual premium、pay a premium。与 excess（免赔额）区分。', en: 'Countable: annual premium, pay a premium. Distinguish from excess, the amount you pay per claim.' },
      collocations: ['the annual premium', 'pay a premium', 'a premium of'],
      example: { en: 'The premium for a touring bike is forty-five pounds a year.', zh: '旅行自行车的年保费是四十五英镑。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpriː/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'excess', phonetic: '/ˈeksəs/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '免赔额（理赔时自付的部分）', en: 'the part of a claim the policyholder pays themselves' },
      usage: { zh: '保险术语；the excess is twenty-five pounds、an excess for theft。', en: 'Insurance term: the excess is twenty-five pounds, an excess for theft.' },
      collocations: ['the excess for theft', 'pay the excess', 'an excess of'],
      example: { en: 'For theft, the excess is twenty-five pounds.', zh: '失窃的免赔额为二十五英镑。' },
      listening: { zh: '重音在第一音节；动词 excess 重音在后，靠语境判断词性。', en: 'Noun stress on the first; the verb stresses the second. Context tells you which.' },
    },
    {
      term: 'panniers', phonetic: '/ˈpæniəz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '自行车两侧挂包', en: 'bags fixed in pairs to the sides of a bicycle' },
      usage: { zh: '只用复数；a pair of panniers、cycle panniers。', en: 'Plural only: a pair of panniers, cycle panniers.' },
      collocations: ['bike panniers', 'a pair of panniers', 'pack the panniers'],
      example: { en: 'The lights, panniers and pump count as fixed accessories.', zh: '车灯、挂包和气筒都算固定配件。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpæn/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'claim', phonetic: '/kleɪm/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '索赔，理赔申请', en: 'an official request for money under an insurance policy' },
      usage: { zh: '可数；submit a claim、make a claim、a claims line。动词同形。', en: 'Countable: submit a claim, the claims line. The verb has the same form.' },
      collocations: ['submit a claim', 'make a claim', 'a claim form'],
      example: { en: 'You should submit the claim within forty-eight hours.', zh: '你应在四十八小时内提交理赔申请。' },
      listening: { zh: '与 crime 对比：claim 是 /eɪ/ 双元音，开头 /kl/。', en: 'Compare with crime: claim has the /eɪ/ diphthong and starts /kl/.' },
    },
    {
      term: 'policy', phonetic: '/ˈpɒləsi/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '保单，保险合同', en: 'the formal contract of insurance between a company and a customer' },
      usage: { zh: '可数；policy valid、take out a policy。', en: 'Countable: policy valid, take out a policy.' },
      collocations: ['the policy stays valid', 'take out a policy', 'policy terms'],
      example: { en: 'The policy stays valid only if the security rules are followed.', zh: '只有遵守防盗规则，保单才有效。' },
      listening: { zh: '四个音节，重音在第一音节；结尾 /si/。', en: 'Four syllables with stress on the first; the ending is /si/.' },
    },
    {
      term: 'accessory', phonetic: '/əkˈsesəri/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '配件，附属用品', en: 'an extra item used with the main object' },
      usage: { zh: '可数，复数 accessories；bike accessories、fixed accessory。', en: 'Countable, plural accessories: bike accessories, fixed accessory.' },
      collocations: ['bike accessories', 'covered as an accessory', 'fixed accessories'],
      example: { en: 'Lights and a pump are treated as accessories on the policy.', zh: '车灯和气筒在保单上按配件处理。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈses/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'reference', phonetic: '/ˈrefrəns/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '编号，凭证（crime reference number 案件编号）', en: 'a number or document that identifies a report' },
      usage: { zh: '可数；a reference number、crime reference。', en: 'Countable: a reference number, crime reference.' },
      collocations: ['a crime reference number', 'a reference number', 'quote the reference'],
      example: { en: 'Get a crime reference number from the police first.', zh: '先向警方取案件编号。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /rə/ 弱读。', en: 'Three syllables with stress on the first; the middle /rə/ is reduced.' },
    },
    {
      term: 'schedule', phonetic: '/ˈʃedjuːl/', partOfSpeech: 'n.', sentenceIndex: 43,
      meaning: { zh: '保单清单，保障明细表', en: 'the document listing what an insurance policy covers' },
      usage: { zh: '可数；the policy schedule、cover schedule。英式读 /ˈʃedjuːl/。', en: 'Countable: the policy schedule. British pronunciation /ˈʃedjuːl/.' },
      collocations: ['the policy schedule', 'the schedule and terms', 'cover schedule'],
      example: { en: 'I’ll email the schedule together with the terms.', zh: '我会把保障明细表和条款一起发邮件。' },
      listening: { zh: '重音在第一音节；不要与 shed（棚屋）混淆。', en: 'Stress the first syllable; do not confuse with shed.' },
    },
  ],
  expressions: [
    {
      phrase: 'go through', sentenceIndex: 1,
      meaning: { zh: '逐条核对，过一遍', en: 'to examine or list items one by one' },
      usage: { zh: '及物短语动词；go through the details。', en: 'Transitive: go through the details.' },
      example: { en: 'Let’s go through a few details before we quote a price.', zh: '报价之前我们先逐条核对几项信息。' },
    },
    {
      phrase: 'builds up', sentenceIndex: 17,
      meaning: { zh: '逐步积累起来', en: 'to increase gradually over time' },
      usage: { zh: '被动或完成时；a discount builds up after each year。', en: 'Passive or perfect: a discount builds up after each year.' },
      example: { en: 'The no-claim discount builds up after each theft-free year.', zh: '每个无失窃年度后，无索赔折扣都会累积。' },
    },
    {
      phrase: 'stay valid', sentenceIndex: 18,
      meaning: { zh: '保持有效', en: 'to remain legally active and enforceable' },
      usage: { zh: '主语通常是保单、合同；stay valid only if。', en: 'The subject is usually a policy or contract: stay valid only if.' },
      example: { en: 'The policy stays valid while you follow the lock rules.', zh: '遵守车锁规定期间保单持续有效。' },
    },
    {
      phrase: 'counts as', sentenceIndex: 30,
      meaning: { zh: '算作，被视为', en: 'to be accepted as a particular category' },
      usage: { zh: '第三人称 counts as；后接名词。', en: 'Third person counts as, followed by a noun.' },
      example: { en: 'A loose bag does not count as a fixed accessory.', zh: '没有固定在车上的包不算配件。' },
    },
    {
      phrase: 'based on', sentenceIndex: 38,
      meaning: { zh: '以……为依据', en: 'using something as the basis for a calculation' },
      usage: { zh: 'be based on；后接名词或动名词。', en: 'Be based on, followed by a noun or gerund.' },
      example: { en: 'The payout is based on the market value at the theft.', zh: '赔付金额按失窃时的市场价值计算。' },
    },
    {
      phrase: 'minus the excess', sentenceIndex: 39,
      meaning: { zh: '扣除免赔额之后', en: 'after taking away the amount the policyholder pays' },
      usage: { zh: 'minus 作介词，表示减去；常出现在理赔计算句。', en: 'Minus is a preposition meaning subtract, common in claim calculations.' },
      example: { en: 'The payout is the market value minus the excess.', zh: '赔付额为市场价值减去免赔额。' },
    },
  ],
  tips: [
    {
      title: { zh: '分清保费与免赔额', en: 'Separate premium from excess' },
      body: {
        zh: 'Part 1 保险场景常把年保费、失窃免赔额、事故免赔额三个数字放在一段里。听前先在题号旁标出“年费”“失窃自付”“事故自付”，听到对应险种再落笔，不要把二十五填进保费空。',
        en: 'Insurance Parts 1 often place annual premium, theft excess and accidental damage excess close together. Label the gaps annual fee, theft self-pay and accident self-pay before the recording, and write down a number only when its cover is named.',
      },
    },
    {
      title: { zh: '先被否定的方案是干扰项', en: 'The rejected option is the distractor' },
      body: {
        zh: '电缆锁、车库都被接待员先提后否：cable lock would not be enough，garage isn’t required。雅思对话常用先给一个看似可行的方案再纠正，被否定的内容不要选。',
        en: 'The cable lock and the garage are mentioned and then ruled out: cable lock would not be enough, garage isn’t required. Conversations often float an option before rejecting it; do not choose what is turned down.',
      },
    },
    {
      title: { zh: '流程题按先后顺序记', en: 'For process items, record the order' },
      body: {
        zh: '第 7 题问失窃后第一步，答案在 first step 之后；第 10 题问时限，答案在 within forty-eight hours 之后。流程类题目留意 first、then、afterwards 这些顺序信号词。',
        en: 'Item 7 asks for the first step after a theft, and the answer follows first step; item 10 asks for the deadline, and it follows within forty-eight hours. Watch order signals such as first, then and afterwards in process questions.',
      },
    },
  ],
};
