import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 48 · Part 1 — 配处方眼镜（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 顾客先开口咨询。表单填空 1–4 按对话顺序出现，单选 5–7 落在免费调整、取镜时间与保险单据，
 * 表格 8–10 是验光、配镜与取镜的安排。题块顺序与录音一致。
 */
export const test48Part1: ListeningLesson = {
  slug: 'test-48-part-1',
  part: 1,
  status: 'published',
  title: { zh: '配处方眼镜', en: 'Ordering prescription glasses' },
  summary: {
    zh: '一名顾客持验光单到眼镜店配镜：处方两年内有效，镜片选偏薄款，镜框选哑光蓝色；保险报销需保留店内开具的分项收据。取镜后首月免费调整螺丝与鼻托，周五下午可取镜。验光在周二十点半，配镜试戴在周四三点十五，成品周五四点取。',
    en: 'A customer orders glasses with an optometrist’s note: the prescription is valid two years, lenses are the thinner option, and the frame is matte blue. The insurer needs the itemised receipt. The first month’s adjustments to screws and nose pads are free, and collection is Friday afternoon. The eye test was Tuesday ten thirty, the fitting Thursday three fifteen, and collection Friday four o’clock.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Prescription valid for: ', cells: [[{ blank: 1 }, { text: ' years' }]] },
        { lead: 'Lenses chosen: ', cells: [[{ blank: 2 }, { text: ' ones' }]] },
        { lead: 'Frame colour: ', cells: [[{ blank: 3 }]] },
        { lead: 'Insurance claim needs an itemised ', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the free aftercare cover?',
          options: [
            { key: 'A', text: 'screws and nose pads adjusted after collection' },
            { key: 'B', text: 'full replacement of any scratched lens' },
            { key: 'C', text: 'home visits to repair broken frames' },
          ],
        },
        {
          number: 6,
          stem: 'When can the customer collect the finished glasses?',
          options: [
            { key: 'A', text: 'Friday afternoon' },
            { key: 'B', text: 'Thursday morning' },
            { key: 'C', text: 'Tuesday evening' },
          ],
        },
        {
          number: 7,
          stem: 'What document goes to the insurer?',
          options: [
            { key: 'A', text: 'the optometrist’s original prescription note' },
            { key: 'B', text: 'the itemised receipt printed at collection' },
            { key: 'C', text: 'the fitting appointment reminder card' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Appointment', 'Day', 'Time'],
      rows: [
        { lead: 'Eye test', cells: [[{ blank: 8 }], [{ text: 'ten thirty' }]] },
        { lead: 'Frame fitting', cells: [[{ text: 'Thursday' }], [{ blank: 9 }]] },
        { lead: 'Collection', cells: [[{ text: 'Friday' }], [{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['two'], evidence: 3,
      explanation: {
        zh: '定位句 3：Most standard prescriptions stay valid for two years from the eye test。处方有效期两年，填 two；句 2 的 last spring 只是日期背景，不是年限。',
        en: 'Sentence 3: "Most standard prescriptions stay valid for two years from the eye test". The prescription lasts two years, so write two. Last spring in sentence 2 is the date background, not the limit.',
      },
    },
    {
      number: 2, accepted: ['thinner'], evidence: 5,
      explanation: {
        zh: '定位句 5：For your strength, the standard lenses get quite thick at the edge, so many customers take the thinner ones。所选镜片是偏薄款，填 thinner；基础厚片是被排除的选项。',
        en: 'Sentence 5: standard lenses get thick at the edge, so customers take "the thinner ones". The chosen lenses are thinner, so write thinner. The basic thick lens is the rejected option.',
      },
    },
    {
      number: 3, accepted: ['blue'], evidence: 8,
      explanation: {
        zh: '定位句 8：I’d like a dark frame to match my work wardrobe. Would blue work with my skin tone? 镜框颜色选蓝色，填 blue；句 9 的 matte finish 是表面处理，不是颜色。',
        en: 'Sentence 8: "Would blue work with my skin tone?". The frame colour is blue, so write blue. The matte finish in sentence 9 is a surface treatment, not the colour.',
      },
    },
    {
      number: 4, accepted: ['receipt'], evidence: 11,
      explanation: {
        zh: '定位句 11：You keep the itemised receipt we print at collection, and the claim form goes to your insurer。保险报销需要分项收据，填 receipt；处方单留在店内记录，不是报销凭证。',
        en: 'Sentence 11: "You keep the itemised receipt we print at collection". The claim needs the receipt, so write receipt. The note stays in shop records and is not the claim document.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：For the first month after collection, any adjustment to the screws or nose pads is free of charge。免费保养覆盖螺丝与鼻托调整，对应 A。镜片免费更换、上门维修均未提及。',
        en: 'Sentence 15: "any adjustment to the screws or nose pads is free of charge". Free aftercare covers screws and pads, matching A. Free lens replacement and home repairs are not mentioned.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：The usual turn around is three working days, and Friday afternoon suits our fitting bench best。取镜安排周五下午，对应 A；周四上午、周二晚上在对话中未作为取镜时间。',
        en: 'Sentence 19: "Friday afternoon suits our fitting bench best". Collection is Friday afternoon, matching A. Thursday morning and Tuesday evening are not collection times.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The receipt you mentioned, with the itemised prices on it。交给保险公司的是分项收据，对应 B；原处方单留在店内，提醒卡不是单据。',
        en: 'Sentence 22: "The receipt you mentioned, with the itemised prices on it". The insurer receives the itemised receipt, matching B. The prescription note stays in shop records, and the reminder card is not a document.',
      },
    },
    {
      number: 8, accepted: ['Tuesday'], evidence: 25,
      explanation: {
        zh: '定位句 25：The eye check itself was on Tuesday, at ten thirty, with the optometrist on the ground floor。验光在周二，填 Tuesday；句内 ten thirty 已作为表格时间给出。',
        en: 'Sentence 25: "The eye check itself was on Tuesday, at ten thirty". The eye test was Tuesday, so write Tuesday. Ten thirty is already printed in the time column.',
      },
    },
    {
      number: 9, accepted: ['three fifteen'], evidence: 27,
      explanation: {
        zh: '定位句 27：We book the fitting for Thursday at three fifteen, when the lenses will have been edged。配镜试戴在三点十五，填 three fifteen；周四已作为表格日期给出。',
        en: 'Sentence 27: "the fitting for Thursday at three fifteen". The fitting time is three fifteen, so write three fifteen. Thursday is already printed in the day column.',
      },
    },
    {
      number: 10, accepted: ['four o’clock'], evidence: 29,
      explanation: {
        zh: '定位句 29：The finished glasses are ready Friday at four o’clock, after the last fitting slot。取镜时间四点，填 four o’clock；周五已作为表格日期给出。',
        en: 'Sentence 29: "The finished glasses are ready Friday at four o’clock". Collection time is four o’clock, so write four o’clock. Friday is already printed in the day column.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'I’ve got a prescription note from my optometrist, and I want to order new glasses this week.' },
    { speaker: 'adviser', text: 'Right, let me look the note over first, and we’ll sort the frames and lenses together.' },
    { speaker: 'customer', text: 'How long is this prescription valid for? It’s dated last spring.' },
    { speaker: 'adviser', text: 'Most standard prescriptions stay valid for two years from the eye test, so yours should still be fine.' },
    { speaker: 'customer', text: 'Good. What lens options are there for someone with my degree of correction?' },
    { speaker: 'adviser', text: 'For your strength, the standard lenses get quite thick at the edge, so many customers take the thinner ones.' },
    { speaker: 'customer', text: 'Thinner lenses, then. Do they cost much more than the basic ones?' },
    { speaker: 'adviser', text: 'They sit in the middle price band, and the quote on the screen already includes the fitting.' },
    { speaker: 'customer', text: 'I’d like a dark frame to match my work wardrobe. Would blue work with my skin tone?' },
    { speaker: 'adviser', text: 'Blue suits the lighter side of your face, and we have a matte finish that does not show fingerprints.' },
    { speaker: 'customer', text: 'Can I claim the glasses back through my insurance later?' },
    { speaker: 'adviser', text: 'You keep the itemised receipt we print at collection, and the claim form goes to your insurer.' },
    { speaker: 'customer', text: 'A receipt, not the prescription note, for the insurance part.' },
    { speaker: 'adviser', text: 'That’s right. The note stays with our records, and the receipt carries the claim details.' },
    { speaker: 'customer', text: 'Now, what service do you offer after I pick the glasses up?' },
    { speaker: 'adviser', text: 'For the first month after collection, any adjustment to the screws or nose pads is free of charge.' },
    { speaker: 'customer', text: 'What about the arms if they press behind the ears?' },
    { speaker: 'adviser', text: 'We can shorten or bend the arms at any follow-up visit, as long as you bring the frames in.' },
    { speaker: 'customer', text: 'When would I be able to collect the finished glasses?' },
    { speaker: 'adviser', text: 'The usual turn around is three working days, and Friday afternoon suits our fitting bench best.' },
    { speaker: 'customer', text: 'Friday afternoon, then. I can’t make the morning session at all.' },
    { speaker: 'adviser', text: 'Before you claim anything, what document do you keep from our side for the insurer?' },
    { speaker: 'customer', text: 'The receipt you mentioned, with the itemised prices on it.' },
    { speaker: 'adviser', text: 'Exactly. We also note your prescription details on the back of the receipt.' },
    { speaker: 'customer', text: 'Let’s go through the appointments for this order.' },
    { speaker: 'adviser', text: 'The eye check itself was on Tuesday, at ten thirty, with the optometrist on the ground floor.' },
    { speaker: 'customer', text: 'That’s the test I already had. What about the frame fitting?' },
    { speaker: 'adviser', text: 'We book the fitting for Thursday at three fifteen, when the lenses will have been edged.' },
    { speaker: 'customer', text: 'Thursday three fifteen. And the collection?' },
    { speaker: 'adviser', text: 'The finished glasses are ready Friday at four o’clock, after the last fitting slot.' },
    { speaker: 'customer', text: 'Four o’clock Friday. Should I bring the old pair with me?' },
    { speaker: 'adviser', text: 'Bring the old glasses if you want us to compare the fit, but it is not required.' },
    { speaker: 'customer', text: 'Do the frames come with any protection against scratches?' },
    { speaker: 'adviser', text: 'The standard coating resists light marks, and a harder finish is optional at the quote stage.' },
    { speaker: 'customer', text: 'How long does the anti scratch finish last if I take it?' },
    { speaker: 'adviser', text: 'It carries the same two year cover as the lenses, against faults in the manufacture.' },
    { speaker: 'customer', text: 'What if the lens prescription changes again within that period?' },
    { speaker: 'adviser', text: 'The cover applies to the current prescription, and a new eye test would start a fresh order.' },
    { speaker: 'customer', text: 'I don’t think I need the optional finish, then.' },
    { speaker: 'adviser', text: 'We’ll keep the basic coating, and mark the thinner lenses in the order.' },
    { speaker: 'customer', text: 'Is there a waiting list for the blue matte frame?' },
    { speaker: 'adviser', text: 'That frame is in stock today, so we can measure it against your face now.' },
    { speaker: 'customer', text: 'Great. I’ll come back on Thursday for the fitting.' },
    { speaker: 'adviser', text: 'Fine. I’ll note Tuesday’s test, Thursday’s fitting and Friday’s collection on the card.' },
  ],
  vocabulary: [
    {
      term: 'prescription', phonetic: '/prɪˈskrɪpʃn/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '处方（验光配镜单）', en: 'the optometrist’s note specifying the lens correction' },
      usage: { zh: '可数；prescription note、valid prescription。动词 prescribe。', en: 'Countable: prescription note. The verb is prescribe.' },
      collocations: ['the prescription note', 'a valid prescription', 'the prescription details'],
      example: { en: 'Most prescriptions stay valid for two years from the eye test.', zh: '多数处方自验光起两年内有效。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈskrɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'thinner', phonetic: '/ˈθɪnə/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '更薄的（高折射率镜片）', en: 'the slimmer lens option for strong corrections' },
      usage: { zh: 'thin 的比较级；thinner ones、thinner lenses。', en: 'Comparative of thin: thinner lenses.' },
      collocations: ['the thinner ones', 'thinner lenses', 'thinner at the edge'],
      example: { en: 'Many customers take the thinner ones for a strong correction.', zh: '度数高的顾客常选偏薄镜片。' },
      listening: { zh: '双音节，重音在第一音节，/θ/ 清咬舌音。', en: 'Two syllables, first stress, voiceless /θ/.' },
    },
    {
      term: 'receipt', phonetic: '/rɪˈsiːt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '收据（报销凭证）', en: 'the printed record of prices kept for the insurer' },
      usage: { zh: '可数；itemised receipt、print a receipt。p 不发音。', en: 'Countable: itemised receipt. The p is silent.' },
      collocations: ['the itemised receipt', 'print the receipt', 'keep the receipt'],
      example: { en: 'You keep the itemised receipt printed at collection.', zh: '你保留取镜时打印的分项收据。' },
      listening: { zh: '双音节，重音在第二音节 /ˈsiː/，词尾 p 不发音。', en: 'Two syllables, second-syllable stress, silent p.' },
    },
    {
      term: 'adjustment', phonetic: '/əˈdʒʌstmənt/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '调整（镜架松紧位置）', en: 'the small tweak to screws, pads or arms' },
      usage: { zh: '可数；free adjustment、make an adjustment。动词 adjust。', en: 'Countable: free adjustment. The verb is adjust.' },
      collocations: ['an adjustment to', 'free adjustment', 'the fitting adjustment'],
      example: { en: 'Any adjustment to the screws or pads is free.', zh: '螺丝或鼻托的任何调整都免费。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdʒʌ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'Tuesday', phonetic: '/ˈtjuːzdeɪ/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '周二（验光安排日）', en: 'the weekday when the eye test took place' },
      usage: { zh: '专有名词；on Tuesday、Tuesday morning。首字母大写。', en: 'Proper noun: on Tuesday. Capitalise the first letter.' },
      collocations: ['on Tuesday', 'Tuesday morning', 'Tuesday’s test'],
      example: { en: 'The eye check was on Tuesday at ten thirty.', zh: '验光安排在周二十点半。' },
      listening: { zh: '双音节，重音在第一音节；美式读 /ˈtuːzdeɪ/。', en: 'Two syllables, first stress; US says /ˈtuːzdeɪ/.' },
    },
    {
      term: 'fitting', phonetic: '/ˈfɪtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '配镜试戴（镜架佩戴调整）', en: 'the session when frames are shaped to the wearer' },
      usage: { zh: '可数；book the fitting、frame fitting。动词 fit。', en: 'Countable: book the fitting. The verb is fit.' },
      collocations: ['the frame fitting', 'book the fitting', 'the fitting slot'],
      example: { en: 'We book the fitting for Thursday at three fifteen.', zh: '配镜试戴约在周四三点十五。' },
      listening: { zh: '双音节，重音在第一音节，结尾 /ɪŋ/。', en: 'Two syllables, first stress, ending /ɪŋ/.' },
    },
    {
      term: 'collection', phonetic: '/kəˈlekʃn/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '取镜（到店领取成品）', en: 'the moment the finished glasses are picked up' },
      usage: { zh: '不可数；collection slot、at collection。动词 collect。', en: 'Uncountable: collection slot. The verb is collect.' },
      collocations: ['the collection slot', 'at collection', 'Friday’s collection'],
      example: { en: 'The finished glasses are ready Friday at four o’clock for collection.', zh: '成品眼镜周五四点可取。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlek/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'look the note over', sentenceIndex: 1,
      meaning: { zh: '把单据过一遍（核对信息）', en: 'to read and check the prescription note' },
      usage: { zh: '可分开；look over the note、look it over。', en: 'Separable: look over the note.' },
      example: { en: 'Let me look the note over before we choose frames.', zh: '选镜框前我先把单据过一遍。' },
    },
    {
      phrase: 'free of charge', sentenceIndex: 15,
      meaning: { zh: '免费（不收取费用）', en: 'with no payment required for the service' },
      usage: { zh: '形容词短语；free of charge at the bench。', en: 'Adjective phrase: free of charge.' },
      example: { en: 'The first month’s adjustments are free of charge.', zh: '首月调整服务免费。' },
    },
    {
      phrase: 'bring the frames in', sentenceIndex: 17,
      meaning: { zh: '把眼镜带到店里（复诊调整）', en: 'to take the frames to the shop for a follow-up tweak' },
      usage: { zh: '及物；bring the frames in、bring them in。', en: 'Transitive: bring the frames in.' },
      example: { en: 'Bring the frames in for a follow-up adjustment.', zh: '复诊调整时把眼镜带来。' },
    },
    {
      phrase: 'turn around', sentenceIndex: 19,
      meaning: { zh: '周转（从下单到成品的时长）', en: 'the time needed to complete the order' },
      usage: { zh: '可数名词；the usual turn around、a three day turn around。', en: 'Countable noun: the usual turn around.' },
      example: { en: 'The usual turn around is three working days.', zh: '常规周转为三个工作日。' },
    },
    {
      phrase: 'in stock', sentenceIndex: 41,
      meaning: { zh: '有现货（店内可直接取用）', en: 'available in the shop without ordering' },
      usage: { zh: '介词短语；frame in stock、out of stock 相对。', en: 'Prepositional phrase; compare out of stock.' },
      example: { en: 'That blue frame is in stock today.', zh: '那款蓝色镜框今天有现货。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单题先判类别再填', en: 'Sort each gap by category' },
      body: {
        zh: '第 1–4 题分别是年限、镜片类型、镜框颜色、报销单据。听到 valid、years 记年限，thinner、lenses 记镜片选择，blue、colour 记颜色，receipt、itemised 记报销凭证；落笔前确认空格要哪一类。',
        en: 'Items 1–4 are a limit, a lens type, a frame colour and a claim document. Note a number after valid and years, the lens choice after thinner and lenses, the colour after blue, and the receipt after itemised. Confirm the category before writing.',
      },
    },
    {
      title: { zh: '免费项与收费项分开记', en: 'Split free services from paid extras' },
      body: {
        zh: '第 5 题问免费保养覆盖什么：螺丝与鼻托调整在取镜后首月免费；镜片更换、上门维修不在范围内。第 7 题报销单据是分项收据，原处方单留店，提醒卡不是凭证。听到 free、charge 记免费项，记得 bring、keep 记自备单据。',
        en: 'Item 5: screws and pad adjustments are free for the first month; lens replacement and home repairs are not covered. Item 7: the claim document is the itemised receipt; the note stays in the shop and the reminder card is not a document. Note free items after free or charge, and self-kept papers after bring or keep.',
      },
    },
    {
      title: { zh: '表格题按已给行列找答案', en: 'Locate the row from printed clues' },
      body: {
        zh: '时间表先用 Appointment 与已给时间找行：第 8 行时间已给、缺星期；第 9 行日期已给、缺时刻；第 10 行日期已给、缺时刻。二十分钟、三个工作日这类时长不要写进时间空格。',
        en: 'For the appointment table, use Appointment and the printed time to find rows: row 8 has ten thirty and needs a day; row 9 has Thursday and needs a time; row 10 has Friday and needs a time. Do not write durations such as three working days into a time gap.',
      },
    },
  ],
};
