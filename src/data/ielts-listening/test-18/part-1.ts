import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 18 · Part 1 — 护照续期咨询（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话围绕护照编号、照片背景与时效、旧护照处理、标准与加急服务时长、
 * 领取方式及领取身份证明展开，穿插眼镜、旧地址等干扰信息。
 */
export const test18Part1: ListeningLesson = {
  slug: 'test-18-part-1',
  part: 1,
  status: 'published',
  title: { zh: '护照续期', en: 'Renewing a passport' },
  summary: {
    zh: '申请人向办事处咨询护照续期：护照编号、照片背景与拍摄时限、旧护照如何处理、标准与加急服务的时长和费用、领取方式，以及领取当天要带的身份证明。',
    en: 'An applicant asks about passport renewal: the passport number, the photo background and how recent the picture must be, what happens to the old book, the standard and expedited services and their cost, the collection method, and the identity proof needed on collection day.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'applicant', label: 'APPLICANT', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Passport number', cells: [[{ blank: 1 }]] },
        { lead: 'Photo background', cells: [[{ blank: 2 }]] },
        { lead: 'Old passport expires', cells: [[{ text: 'end of next ' }, { blank: 3 }]] },
        { lead: 'Photo taken within the last', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the clerk say is allowed in the passport photo?',
          options: [
            { key: 'A', text: 'a hat or head covering' },
            { key: 'B', text: 'plain glasses' },
            { key: 'C', text: 'dark lenses' },
          ],
        },
        {
          number: 6,
          stem: 'What happens to the old passport after renewal?',
          options: [
            { key: 'A', text: 'It is cancelled and returned to the applicant.' },
            { key: 'B', text: 'It is kept permanently at the office.' },
            { key: 'C', text: 'It is destroyed automatically.' },
          ],
        },
        {
          number: 7,
          stem: 'How long does the standard service take?',
          options: [
            { key: 'A', text: 'two weeks' },
            { key: 'B', text: 'four weeks' },
            { key: 'C', text: 'six weeks' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Service', 'Detail'],
      rows: [
        { lead: 'Ordinary application', cells: [[{ text: 'delivered by ' }, { blank: 8 }]] },
        { lead: 'Expedited service', cells: [[{ text: 'extra fee of £' }, { blank: 9 }]] },
        { lead: 'Collection day', cells: [[{ text: 'proof of identity, such as a ' }, { blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['42917'], spoken: 'four two nine one seven', evidence: 4,
      explanation: {
        zh: '定位句 4：The number is KZ four two nine one seven。护照编号按数字读，卷面写 42917；前缀 KZ 不填入空内。',
        en: 'Sentence 4: "The number is KZ four two nine one seven". The number is read as digits and written 42917; the prefix KZ is not written in the gap.',
      },
    },
    {
      number: 2, accepted: ['white'], evidence: 9,
      explanation: {
        zh: '定位句 9：The background has to be plain white, with no pattern behind your shoulders。照片背景要求纯白；句 10 提到的头发只是拍摄细节，不是背景色。',
        en: 'Sentence 9: "The background has to be plain white, with no pattern behind your shoulders". The background must be plain white; the hair mention in sentence 10 is a detail, not the background colour.',
      },
    },
    {
      number: 3, accepted: ['March'], evidence: 6,
      explanation: {
        zh: '定位句 6：It expires at the end of next March。旧护照下三月底到期；句 2 的 pages 只是页数快用完，不是到期时间。',
        en: 'Sentence 6: "It expires at the end of next March". The old book expires at the end of next March; the pages mention in sentence 2 is about running out of pages, not the expiry date.',
      },
    },
    {
      number: 4, accepted: ['month'], evidence: 13,
      explanation: {
        zh: '定位句 13：it must have been taken within the last month, not a holiday picture from last summer。照片须在一个月内拍摄；last summer 是被否定的旧照片。',
        en: 'Sentence 13: "it must have been taken within the last month, not a holiday picture from last summer". The photo must be within the last month; last summer is the rejected old picture.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：Plain glasses are fine, but dark lenses or a reflection in the glass are not accepted。普通眼镜可以戴；帽子头巾在句 11 被禁止，深色镜片在本句被否定。',
        en: 'Sentence 15: "Plain glasses are fine, but dark lenses or a reflection in the glass are not accepted". Plain glasses are allowed; a hat or head covering is rejected in sentence 11, and dark lenses are ruled out here.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：We cancel it on the system, and then the old book is returned to you with a hole punched in the corner。旧护照注销后退回本人；句 20 明确说办事处不留存、也不自动销毁。',
        en: 'Sentence 18: "We cancel it on the system, and then the old book is returned to you with a hole punched in the corner". The old book is cancelled and returned; sentence 20 confirms the office neither keeps nor automatically destroys it.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The standard service takes four weeks。标准服务四周；句 28 的三个工作日是加急时长，两周在全段没有依据。',
        en: 'Sentence 22: "The standard service takes four weeks". The standard service takes four weeks; three working days in sentence 28 is the expedited turnaround, and two weeks has no basis.',
      },
    },
    {
      number: 8, accepted: ['post'], evidence: 22,
      explanation: {
        zh: '定位句 22：with delivery by post to your home address。普通申请邮寄到家；句 27 的 in person 是加急领取方式，不适用于普通件。',
        en: 'Sentence 22: "with delivery by post to your home address". Ordinary applications are delivered by post; in person in sentence 27 is the expedited collection method, not the ordinary one.',
      },
    },
    {
      number: 9, accepted: ['sixty', '60'], spoken: 'sixty pounds', evidence: 24,
      explanation: {
        zh: '定位句 24：it costs an extra sixty pounds。加急额外费用六十英镑；空后已印英镑符号，只填数字。',
        en: 'Sentence 24: "it costs an extra sixty pounds". The expedited extra fee is sixty pounds; the pound symbol is already printed, so write the number only.',
      },
    },
    {
      number: 10, accepted: ['driving licence'], evidence: 31,
      explanation: {
        zh: '定位句 31：You need one proof of identity, such as your driving licence, and the receipt we give you today。领取证件可用驾照作为身份证明；receipt 是另一件必带材料，不是身份凭证。',
        en: 'Sentence 31: "You need one proof of identity, such as your driving licence, and the receipt we give you today". The driving licence is the identity proof; the receipt is a separate required item, not the identity document.',
      },
    },
  ],
  transcript: [
    { speaker: 'applicant', text: 'I need to renew my passport before a trip abroad next month, please.' },
    { speaker: 'clerk', text: 'Of course. We can do that here. Shall we start with the details on your current passport?' },
    { speaker: 'applicant', text: 'Yes. The old one has nearly run out of pages.' },
    { speaker: 'clerk', text: 'Can you read me the passport number on the cover?' },
    { speaker: 'applicant', text: 'Let me take it out. The number is KZ four two nine one seven.' },
    { speaker: 'clerk', text: 'Four two nine one seven. Thank you. What date does it expire?' },
    { speaker: 'applicant', text: 'It expires at the end of next March, so I still have a few weeks.' },
    { speaker: 'clerk', text: 'Right. Now the new photos. Have you got yours with you?' },
    { speaker: 'applicant', text: 'I took them at the booth in the town centre this morning.' },
    { speaker: 'clerk', text: 'Good. The background has to be plain white, with no pattern behind your shoulders.' },
    { speaker: 'applicant', text: 'Mine are white, and I did keep my hair off my face.' },
    { speaker: 'clerk', text: 'That helps. The photo must show your full face, and you should not wear a hat or a head covering.' },
    { speaker: 'applicant', text: 'Does the photo need to be taken recently?' },
    { speaker: 'clerk', text: 'Yes, it must have been taken within the last month, not a holiday picture from last summer.' },
    { speaker: 'applicant', text: 'What about my glasses?' },
    { speaker: 'clerk', text: 'Plain glasses are fine, but dark lenses or a reflection in the glass are not accepted.' },
    { speaker: 'applicant', text: 'I have plain clear ones, so that should be all right.' },
    { speaker: 'applicant', text: 'And what happens to my old passport once the new one arrives?' },
    { speaker: 'clerk', text: 'We cancel it on the system, and then the old book is returned to you with a hole punched in the corner.' },
    { speaker: 'applicant', text: 'So I keep it, rather than the office keeping it?' },
    { speaker: 'clerk', text: 'Correct. We do not retain old passports here, and we do not destroy them unless you ask us to.' },
    { speaker: 'applicant', text: 'I see. I might want the old stamps for reference.' },
    { speaker: 'clerk', text: 'How long can you wait? The standard service takes four weeks, with delivery by post to your home address.' },
    { speaker: 'applicant', text: 'And is there a faster option?' },
    { speaker: 'clerk', text: 'Yes, the expedited service finishes in three working days, but it costs an extra sixty pounds.' },
    { speaker: 'applicant', text: 'Sixty. That is more than I expected.' },
    { speaker: 'applicant', text: 'I was thinking of post, to the flat. Is that how ordinary applications arrive?' },
    { speaker: 'clerk', text: 'Standard applications go by post automatically. The expedited ones have to be collected in person at this office.' },
    { speaker: 'applicant', text: 'If I use the fast service, I will have to come back here then?' },
    { speaker: 'clerk', text: 'Yes, you cannot send someone else to collect it for you.' },
    { speaker: 'applicant', text: 'What should I bring on collection day?' },
    { speaker: 'clerk', text: 'You need one proof of identity, such as your driving licence, and the receipt we give you today.' },
    { speaker: 'applicant', text: 'My licence is still valid, so that is fine.' },
    { speaker: 'clerk', text: 'Good. On the form, write your current address and the contact phone number.' },
    { speaker: 'applicant', text: 'Should I put the email as well?' },
    { speaker: 'clerk', text: 'It helps us reach you if the photos need replacing.' },
    { speaker: 'applicant', text: 'One thing I am unsure about, does the new photo need to show a neutral expression?' },
    { speaker: 'clerk', text: 'It should, and the booth usually warns you if the smile is too broad.' },
    { speaker: 'applicant', text: 'Will the post ever go to the old address?' },
    { speaker: 'clerk', text: 'Only if the form lists that address, so double check the flat number.' },
    { speaker: 'applicant', text: 'I will. Thank you for walking me through it.' },
    { speaker: 'clerk', text: 'You are welcome. Safe travels, and keep the old book safe once it comes back.' },
  ],
  vocabulary: [
    {
      term: 'expires', phonetic: '/ɪkˈspaɪəz/', partOfSpeech: 'v.', sentenceIndex: 6,
      meaning: { zh: '到期，失效', en: 'to become no longer valid after a date' },
      usage: { zh: '不及物第三人称；the passport expires、expires next March。名词 expiry。', en: 'Third-person intransitive: the passport expires, expires next March. The noun is expiry.' },
      collocations: ['the passport expires', 'expires at the end of', 'expires next month'],
      example: { en: 'The old passport expires at the end of next March.', zh: '旧护照下三月底到期。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈspaɪ/；开头 /ɪk/ 弱读。', en: 'Two syllables with stress on the second; the opening /ɪk/ is reduced.' },
    },
    {
      term: 'background', phonetic: '/ˈbækɡraʊnd/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '背景（照片底色）', en: 'the colour or surface behind a person in a photograph' },
      usage: { zh: '可数；plain white background、photo background。', en: 'Countable: plain white background, photo background.' },
      collocations: ['plain white background', 'the photo background', 'a patterned background'],
      example: { en: 'The photo background has to be plain white.', zh: '照片背景必须是纯白色。' },
      listening: { zh: '复合词，重音在第一音节 /ˈbæk/；中间 /ɡ/ 清晰。', en: 'A compound with stress on the first; the middle /ɡ/ is clear.' },
    },
    {
      term: 'expedited', phonetic: '/ˈekspədɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 24,
      meaning: { zh: '加急的，快速办理的', en: 'processed faster than the ordinary service, for an extra fee' },
      usage: { zh: '定语；the expedited service、an expedited application。动词 expedite。', en: 'Attributive: the expedited service. The verb is expedite.' },
      collocations: ['the expedited service', 'an expedited renewal', 'expedited processing'],
      example: { en: 'The expedited service finishes in three working days.', zh: '加急服务三个工作日内办结。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈek/；中间 /pə/ 弱读。', en: 'Four syllables with stress on the first; the middle /pə/ is reduced.' },
    },
    {
      term: 'cancel', phonetic: '/ˈkænsl/', partOfSpeech: 'v.', sentenceIndex: 18,
      meaning: { zh: '注销，使作废', en: 'to make a document no longer valid' },
      usage: { zh: '及物；cancel the passport、cancel the booking。名词 cancellation。', en: 'Transitive: cancel the passport, cancel the booking. The noun is cancellation.' },
      collocations: ['cancel the passport', 'cancel it on the system', 'cancel the old book'],
      example: { en: 'We cancel the old passport on the system before returning it.', zh: '我们先在系统里注销旧护照，再退回本人。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkæn/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'retain', phonetic: '/rɪˈteɪn/', partOfSpeech: 'v.', sentenceIndex: 20,
      meaning: { zh: '留存，保留', en: 'to keep something instead of returning or destroying it' },
      usage: { zh: '及物；we do not retain old passports、retain a copy。', en: 'Transitive: we do not retain old passports, retain a copy.' },
      collocations: ['retain old passports', 'retain a copy', 'retain the receipt'],
      example: { en: 'The office does not retain old passports after cancellation.', zh: '注销后办事处不留存旧护照。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈteɪ/；开头 /rɪ/ 弱读。', en: 'Two syllables with stress on the second; /rɪ/ is reduced.' },
    },
    {
      term: 'receipt', phonetic: '/rɪˈsiːt/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '收据，凭证', en: 'the paper proving a payment or submission' },
      usage: { zh: '可数；the receipt we give you、keep the receipt。字母 p 不发音。', en: 'Countable: the receipt we give you, keep the receipt. The p is silent.' },
      collocations: ['the receipt', 'keep the receipt', 'a payment receipt'],
      example: { en: 'Bring the receipt we give you today on collection day.', zh: '领取当天带上今天开的收据。' },
      listening: { zh: '重音在第二音节 /ˈsiː/；字母 p 不发音，勿读成 /p/。', en: 'Stress the second syllable; the p is silent.' },
    },
    {
      term: 'identity', phonetic: '/aɪˈdentəti/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '身份', en: 'who a person is, confirmed by an official document' },
      usage: { zh: '不可数；proof of identity、identity card。', en: 'Uncountable: proof of identity, identity card.' },
      collocations: ['proof of identity', 'identity document', 'confirm identity'],
      example: { en: 'You need one proof of identity on collection day.', zh: '领取当天需要一份身份证明。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈden/。', en: 'Four syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'run out of pages', sentenceIndex: 2,
      meaning: { zh: '页数快用完', en: 'to have nearly used all the blank pages' },
      usage: { zh: 'run out of 后接物品；run out of pages、run out of time。', en: 'Run out of plus noun: run out of pages, run out of time.' },
      example: { en: 'The old passport has nearly run out of pages.', zh: '旧护照的页数快用完了。' },
    },
    {
      phrase: 'plain white', sentenceIndex: 9,
      meaning: { zh: '纯白色，无图案', en: 'a single colour with no pattern or marks' },
      usage: { zh: '修饰背景；plain white background、plain white paper。', en: 'Describes a background: plain white background, plain white paper.' },
      example: { en: 'The background must be plain white.', zh: '背景必须是纯白色。' },
    },
    {
      phrase: 'proof of identity', sentenceIndex: 31,
      meaning: { zh: '身份证明', en: 'an official document that confirms who a person is' },
      usage: { zh: '不可数搭配；one proof of identity、proof of identity such as a licence。', en: 'Used as a unit: one proof of identity, proof of identity such as a licence.' },
      example: { en: 'You need one proof of identity on collection day.', zh: '领取当天需要一份身份证明。' },
    },
    {
      phrase: 'collected in person', sentenceIndex: 27,
      meaning: { zh: '本人亲自领取', en: 'picked up by the applicant themselves, not by a proxy' },
      usage: { zh: '被动；be collected in person、sign in person。对照 by post。', en: 'Passive: be collected in person. Compare by post.' },
      example: { en: 'Expedited passports must be collected in person at the office.', zh: '加急护照必须本人到办事处领取。' },
    },
    {
      phrase: 'walking me through it', sentenceIndex: 40,
      meaning: { zh: '逐项讲给我听', en: 'to explain a process step by step to someone' },
      usage: { zh: 'walk somebody through something；动名词 walking。', en: 'Walk somebody through something; the gerund is walking.' },
      example: { en: 'Thank you for walking me through the renewal.', zh: '谢谢你把续期流程逐项讲给我听。' },
    },
    {
      phrase: 'double check', sentenceIndex: 39,
      meaning: { zh: '再次核对', en: 'to check something a second time for mistakes' },
      usage: { zh: '动词短语；double check the address、double check the number。', en: 'A verb phrase: double check the address, double check the number.' },
      example: { en: 'Double check the flat number on the form.', zh: '把表单上的公寓号再核对一遍。' },
    },
  ],
  tips: [
    {
      title: { zh: '照片题抓允许与禁止', en: 'For photo rules, split allowed from forbidden' },
      body: {
        zh: '第 5 题问照片里什么可以戴。录音先讲禁止项（hat、head covering），再说允许项（plain glasses），随后否定 dark lenses；听到 fine、accepted、not allowed 这类评价词时，把对应选项归到允许或禁止一侧。',
        en: 'Item 5 asks what is allowed in the photo. The recording lists the forbidden items first, hat and head covering, then the allowed one, plain glasses, before rejecting dark lenses. When you hear fine, accepted or not allowed, place the matching option on the allowed or forbidden side.',
      },
    },
    {
      title: { zh: '数字题区分时长与费用', en: 'Separate durations from fees' },
      body: {
        zh: '第 7、9 题一个问时长、一个问费用。four weeks 是标准服务时长，sixty pounds 是加急额外费用；六周是航班距今时间，三 working days 是加急办结时长，都是邻近干扰数字，听前先在题号旁标注“多久”“多少钱”。',
        en: 'Items 7 and 9 ask a duration and a fee respectively. Four weeks is the standard duration, sixty pounds the expedited fee; six weeks is until the flight and three working days is the expedited turnaround. Label the gaps how long and how much before listening.',
      },
    },
    {
      title: { zh: '流程题按顺序记材料', en: 'For process items, note items in order' },
      body: {
        zh: '第 10 题问领取当天的身份证明。答案在 such as 之后引出 driving licence，紧接着的 receipt 是另一件材料；流程类题目留意 such as、such as your 这类举例信号，后面第一个名词才是题目所问。',
        en: 'Item 10 asks for the identity proof on collection day. The answer follows such as, the driving licence, and the receipt right after is a separate item. In process questions watch signals such as such as; the first noun after it answers the gap.',
      },
    },
  ],
};
