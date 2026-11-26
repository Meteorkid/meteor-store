import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 9 · Part 1 — 新病人致电牙科诊所预约检查。原创仿真材料，非官方真题。
 *
 * 对话围绕登记信息、首次检查内容、取消政策、急诊通道、提醒方式、费用与随身材料展开，
 * 中间穿插干扰项（周二下午已满、抛光视牙龈状况而定、额外 X 光不包含在基础费用内）。
 */
export const test09Part1: ListeningLesson = {
  slug: 'test-09-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约牙科检查', en: 'Booking a dental check-up' },
  summary: {
    zh: '刚搬到本片区的新病人致电牙科诊所预约检查：登记姓名、出生日期与联系电话，了解首次检查包含的项目、取消预约的时限、急诊通道、提醒方式、检查费用以及就诊当天需要携带的材料。',
    en: 'A new patient who has just moved into the area calls a dental practice to book a check-up: giving the surname, date of birth and contact number, then learning what the first visit includes, the cancellation notice period, the emergency line, the reminder method, the fee and the documents to bring.',
  },
  accent: { zh: '两位说话人均为澳式口音。', en: 'Both speakers use Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'patient', label: 'PATIENT', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Date of birth', cells: [[{ blank: 2 }]] },
        { lead: 'Day of first appointment', cells: [[{ blank: 3 }, { text: ' (morning)' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'What does the first check-up include?',
          options: [
            { key: 'A', text: 'An examination of the teeth and gums, with X-rays if needed.' },
            { key: 'B', text: 'A quick look only at the visible front teeth.' },
            { key: 'C', text: 'A scale and polish arranged for every new patient.' },
          ],
        },
        {
          number: 5,
          stem: 'What is the cancellation policy?',
          options: [
            { key: 'A', text: 'Cancellation must be made in person at the practice.' },
            { key: 'B', text: 'At least twenty-four hours’ notice, otherwise a missed-appointment fee.' },
            { key: 'C', text: 'Free cancellation up to two hours before the appointment.' },
          ],
        },
        {
          number: 6,
          stem: 'What should the patient do in a dental emergency?',
          options: [
            { key: 'A', text: 'Wait for the next regular appointment if the problem is not urgent.' },
            { key: 'B', text: 'Arrive at the practice after six in the evening.' },
            { key: 'C', text: 'Call the emergency line before nine in the morning.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Reminder method', cells: [[{ blank: 7 }, { text: ' to the mobile' }]] },
        { lead: 'Check-up fee', cells: [[{ blank: 8 }, { text: ' dollars' }]] },
        { lead: 'Old records to bring', cells: [[{ blank: 9 }]] },
        { lead: 'Identity document', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Fulton'], evidence: 2,
      explanation: {
        zh: '定位句 2：My surname is Fulton. That’s F, U, L, T, O, N。接待员随后逐字母复述确认，拼写以这组字母为准；注意首字母大写。',
        en: 'Sentence 2: "My surname is Fulton. That’s F, U, L, T, O, N". The receptionist repeats the letters to confirm, so the spelling follows that list, with a capital first letter.',
      },
    },
    {
      number: 2, accepted: ['4 March', 'March 4'], spoken: 'the fourth of March', evidence: 6,
      explanation: {
        zh: '定位句 6：I was born on the fourth of March, two thousand and two。出生年份只是背景信息，空格问出生日期，填月份与日即可；年份不要写进答案。',
        en: 'Sentence 6: "I was born on the fourth of March, two thousand and two". The birth year is background only; the blank asks for the day and month, so do not add the year.',
      },
    },
    {
      number: 3, accepted: ['Wednesday'], evidence: 11,
      explanation: {
        zh: '定位句 11：the next opening is Wednesday at ten in the morning。周二下午先被提出来，但病人表示下午有课，作为干扰时间被排除。',
        en: 'Sentence 11: "the next opening is Wednesday at ten in the morning". A Tuesday afternoon slot is offered first, but the patient has college then, so it is a distractor.',
      },
    },
    {
      number: 4, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：The dentist looks at your teeth and gums, and takes a full set of X-rays if your last ones are out of date。A 只看前排牙齿，原文未说；C 的抛光要看牙龈状况，并非每位新病人必做。',
        en: 'Sentence 15: "The dentist looks at your teeth and gums, and takes a full set of X-rays if your last ones are out of date". A limits the check to front teeth, which the speaker never says; C claims polishing is mandatory for everyone, but it depends on the gums.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：please give us at least twenty-four hours’ notice。不到二十四小时取消会收二十五美元缺席费；A 要求本人到店与原文线上取消不符，C 的两小时时限没有出现。',
        en: 'Sentence 19: "please give us at least twenty-four hours’ notice". Missing that notice triggers a twenty-five-dollar fee. A requires an in-person visit, but the text says online cancellation; the two-hour limit in C is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['C'], evidence: 23,
      explanation: {
        zh: '定位句 23：call the emergency line before nine in the morning。急诊针对断牙、严重肿胀这类急症；A 让病人等普通复诊，与急诊通道的设置相反，C 的傍晚到店时间与开放时间冲突。',
        en: 'Sentence 23: "call the emergency line before nine in the morning". The line covers urgent problems such as a broken tooth or swelling. A tells the patient to wait for a routine slot, the opposite of an emergency channel; C’s evening arrival conflicts with opening hours.',
      },
    },
    {
      number: 7, accepted: ['text'], evidence: 29,
      explanation: {
        zh: '定位句 29：We can send a text to your mobile, which most patients prefer。病人平时不看邮件，邮件提醒只是被对比的选项；空格后已印 to the mobile，填 text。',
        en: 'Sentence 29: "We can send a text to your mobile, which most patients prefer". The patient rarely checks email, so email is only a compared alternative; to the mobile is already printed in the notes.',
      },
    },
    {
      number: 8, accepted: ['sixty-five', '65'], spoken: 'sixty-five dollars', evidence: 31,
      explanation: {
        zh: '定位句 31：The check-up itself is sixty-five dollars for a new patient。额外 X 光每张另收十美元，那是后续加项，不是检查费；空格后已印 dollars。',
        en: 'Sentence 31: "The check-up itself is sixty-five dollars for a new patient". Extra X-rays cost ten dollars each later, but that is an add-on, not the check-up fee; dollars is already printed.',
      },
    },
    {
      number: 9, accepted: ['X-rays'], evidence: 35,
      explanation: {
        zh: '定位句 35：If you have old X-rays from your previous dentist, bring them along。同时提到的用药清单是另一件随身物，本题问旧病历记录，答案是 X-rays。',
        en: 'Sentence 35: "If you have old X-rays from your previous dentist, bring them along". A list of medicines is mentioned in the same breath, but this blank asks for the old records, which are the X-rays.',
      },
    },
    {
      number: 10, accepted: ['identification'], evidence: 37,
      explanation: {
        zh: '定位句 37：please bring some identification on the day, such as a driver’s licence or your passport。驾照和护照只是举例，空格要填上位词 identification。',
        en: 'Sentence 37: "please bring some identification on the day, such as a driver’s licence or your passport". The licence and passport are examples; the blank asks for the umbrella word identification.',
      },
    },
  ],
  transcript: [
    { speaker: 'patient', text: 'Hi there, I’d like to book a check-up at your practice. I’ve just moved into the area.' },
    { speaker: 'receptionist', text: 'Welcome. I can sort that out for you. Let me take a few details before we choose a time.' },
    { speaker: 'patient', text: 'Sure. My surname is Fulton. That’s F, U, L, T, O, N.' },
    { speaker: 'receptionist', text: 'F, U, L, T, O, N. Thank you. And your first name?' },
    { speaker: 'patient', text: 'It’s Daniel. Daniel Fulton.' },
    { speaker: 'receptionist', text: 'Thanks, Daniel. And your date of birth?' },
    { speaker: 'patient', text: 'I was born on the fourth of March, two thousand and two.' },
    { speaker: 'receptionist', text: 'The fourth of March, two thousand and two. Got it. Could I have a contact number?' },
    { speaker: 'patient', text: 'It’s oh four one seven, double three, five two eight oh.', displayText: 'It’s 0417 33 5280.' },
    { speaker: 'receptionist', text: 'Thank you. Now, when would suit you? We have a Tuesday afternoon free this week.' },
    { speaker: 'patient', text: 'Tuesday’s no good for me. I’m at college all afternoon.' },
    { speaker: 'receptionist', text: 'Then the next opening is Wednesday at ten in the morning.' },
    { speaker: 'patient', text: 'Wednesday at ten works well.' },
    { speaker: 'receptionist', text: 'I’ll put you down for that. As a new patient your first visit runs a little longer than a regular check-up.' },
    { speaker: 'patient', text: 'What does that first appointment involve, exactly?' },
    { speaker: 'receptionist', text: 'The dentist looks at your teeth and gums, and takes a full set of X-rays if your last ones are out of date.' },
    { speaker: 'patient', text: 'Will there be a scale and polish?' },
    { speaker: 'receptionist', text: 'That depends on the condition of your gums, but most new patients have one at the first visit.' },
    { speaker: 'patient', text: 'I see. What if I need to cancel later?' },
    { speaker: 'receptionist', text: 'You can change or cancel online through your patient portal, but please give us at least twenty-four hours’ notice.' },
    { speaker: 'patient', text: 'And if I miss it without notice?' },
    { speaker: 'receptionist', text: 'Then there’s a missed appointment fee of twenty-five dollars, to cover the time the dentist reserved for you.' },
    { speaker: 'patient', text: 'OK, that’s fair. What about a dental emergency? I’ve had a toothache before that wouldn’t wait.' },
    { speaker: 'receptionist', text: 'For urgent problems such as a broken tooth or heavy swelling, call the emergency line before nine in the morning.' },
    { speaker: 'patient', text: 'Is that a different number from this one?' },
    { speaker: 'receptionist', text: 'Yes. The emergency line is oh eight hundred, two six one, four double nine.', displayText: 'Yes. The emergency line is 0800 261 499.' },
    { speaker: 'patient', text: 'Got it. And what time does the practice open on weekdays?' },
    { speaker: 'receptionist', text: 'We open at half past eight and close at six, and we’re open until four on Saturdays.' },
    { speaker: 'patient', text: 'Good. How should I receive appointment reminders? I don’t check email often.' },
    { speaker: 'receptionist', text: 'We can send a text to your mobile, which most patients prefer.' },
    { speaker: 'patient', text: 'A text works best for me.' },
    { speaker: 'receptionist', text: 'I’ll set that on your record. The check-up itself is sixty-five dollars for a new patient.' },
    { speaker: 'patient', text: 'Sixty-five. Does that include the X-rays?' },
    { speaker: 'receptionist', text: 'The basic exam and polish are in that price, and any additional X-rays are charged separately at ten dollars each.' },
    { speaker: 'patient', text: 'Fine. Is there anything I should bring with me?' },
    { speaker: 'receptionist', text: 'If you have old X-rays from your previous dentist, bring them along, together with a list of any medicines you take.' },
    { speaker: 'patient', text: 'And identification?' },
    { speaker: 'receptionist', text: 'Yes, please bring some identification on the day, such as a driver’s licence or your passport.' },
    { speaker: 'patient', text: 'Will do. Thanks for your help.' },
    { speaker: 'receptionist', text: 'You’re welcome. See you Wednesday at ten.' },
  ],
  vocabulary: [
    {
      term: 'appointment', phonetic: '/əˈpɔɪntmənt/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '预约，约定的就诊时间', en: 'a fixed time to meet a professional, such as a dentist' },
      usage: { zh: 'book an appointment、make an appointment；动词形式是 appoint。', en: 'Book or make an appointment; the verb is appoint.' },
      collocations: ['book an appointment', 'a dental appointment', 'miss an appointment'],
      example: { en: 'I’d like to book a check-up appointment for next week.', zh: '我想预约下周的检查。' },
      listening: { zh: '重音在第二音节 /ˈpɔɪ/，-ment 轻读成 /mənt/。', en: 'Stress the second syllable; -ment is a weak /mənt/.' },
    },
    {
      term: 'gums', phonetic: '/ɡʌmz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '牙龈', en: 'the firm pink tissue around the base of the teeth' },
      usage: { zh: '常用复数 gums；单数 gum 也指口香糖，靠语境区分。', en: 'Usually plural gums; the singular also means chewing gum, so context matters.' },
      collocations: ['healthy gums', 'the condition of your gums', 'bleeding gums'],
      example: { en: 'The dentist checks the gums for early signs of disease.', zh: '牙医检查牙龈是否有早期病变。' },
      listening: { zh: '短元音 /ʌ/，结尾 /z/ 浊化，不要读成 gums 的 /s/。', en: 'The vowel is short /ʌ/, and the final consonant is voiced /z/.' },
    },
    {
      term: 'X-rays', phonetic: '/ˈeks reɪz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: 'X 光片，X 射线检查', en: 'pictures of the teeth taken with radiation to show hidden problems' },
      usage: { zh: '医疗语境常用复数 X-rays；动词短语 take X-rays。', en: 'Medical usage often keeps the plural; the verb phrase is take X-rays.' },
      collocations: ['take X-rays', 'old X-rays', 'a full set of X-rays'],
      example: { en: 'The practice takes a full set of X-rays for new patients.', zh: '诊所为新病人拍全套 X 光片。' },
      listening: { zh: 'X 读字母名 /eks/，复数尾音 /z/ 随 rays 连读。', en: 'X keeps its letter name /eks/, and the plural ending blends into rays.' },
    },
    {
      term: 'notice', phonetic: '/ˈnəʊtɪs/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '事先通知，告知期限', en: 'information given before an action, so the other side can plan' },
      usage: { zh: 'give notice、without notice；notice 在此不是“注意”，而是“提前告知”。', en: 'Give notice or without notice; here it means prior warning, not attention.' },
      collocations: ['twenty-four hours’ notice', 'without notice', 'give notice'],
      example: { en: 'Please give at least a day’s notice if you need to change the time.', zh: '如需改时间，请至少提前一天告知。' },
      listening: { zh: '双音节，首音节 /ˈnəʊ/ 类似 know；不要漏尾音 /s/。', en: 'Two syllables, the first like know; do not drop the final /s/.' },
    },
    {
      term: 'portal', phonetic: '/ˈpɔːtl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '（线上）门户，病人自助系统', en: 'an online system where patients manage their own records and bookings' },
      usage: { zh: 'patient portal 是医疗服务常见搭配；不要读成 portal 的“大门”本义。', en: 'Patient portal is a set medical collocation; it does not mean a physical doorway here.' },
      collocations: ['the patient portal', 'online through the portal', 'the practice portal'],
      example: { en: 'You can cancel the appointment through the patient portal online.', zh: '你可以通过线上病人门户取消预约。' },
      listening: { zh: '双音节，重音在前；/pɔː/ 拉长，尾音 /tl/ 成音节。', en: 'Two syllables with stress first; /pɔː/ is long and /tl/ forms its own syllable.' },
    },
    {
      term: 'emergency', phonetic: '/ɪˈmɜːdʒənsi/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '急症，紧急情况', en: 'a sudden urgent problem that cannot wait for a routine slot' },
      usage: { zh: 'dental emergency、emergency line；形容词 emergency 可直接修饰名词。', en: 'Dental emergency, emergency line; the word acts directly as an adjective.' },
      collocations: ['a dental emergency', 'the emergency line', 'an urgent emergency'],
      example: { en: 'Call the emergency line if a tooth breaks during the night.', zh: '如果夜间断牙，请打急诊电话。' },
      listening: { zh: '重音在第二音节 /ˈmɜː/，四个音节连读不要吞掉第三段 /dʒən/。', en: 'Stress the second syllable across four syllables; do not skip /dʒən/.' },
    },
    {
      term: 'reminders', phonetic: '/rɪˈmaɪndəz/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '提醒消息，提示', en: 'a message sent to someone to remember an appointment' },
      usage: { zh: 'appointment reminder、send a reminder；动词是 remind。', en: 'Appointment reminder, send a reminder; the verb is remind.' },
      collocations: ['a text reminder', 'an appointment reminder', 'send a reminder'],
      example: { en: 'The practice sends a text reminder the day before the visit.', zh: '诊所会在就诊前一天发短信提醒。' },
      listening: { zh: '重音在第二音节 /ˈmaɪ/，词尾 -er 弱读 /ə/。', en: 'Stress the second syllable; the ending -er reduces to /ə/.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '身份证明', en: 'an official document that proves who a person is' },
      usage: { zh: '正式场合不可数；口语常缩写 ID。bring identification 后接具体证件举例。', en: 'Formal usage is uncountable; speech often shortens it to ID. Bring identification can be followed by examples.' },
      collocations: ['bring identification', 'some identification', 'official identification'],
      example: { en: 'Please bring some identification with you on the day.', zh: '就诊当天请携带身份证明。' },
      listening: { zh: '五个音节，重音落在 /keɪ/ 上；开头的 i 读 /aɪ/。', en: 'Five syllables with stress on /keɪ/; the opening i sounds /aɪ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'sort that out', sentenceIndex: 1,
      meaning: { zh: '办妥，安排好（某件事）', en: 'to deal with a matter and make it happen' },
      usage: { zh: 'sort out 是可分短语；宾语代词放在中间：sort it out、sort that out。', en: 'Sort out is separable; a pronoun goes in the middle: sort it out, sort that out.' },
      example: { en: 'I can sort that out for you before you leave the practice.', zh: '你离开诊所前我就能把这件事办好。' },
    },
    {
      phrase: 'put you down for', sentenceIndex: 13,
      meaning: { zh: '把你登记在（某个时间/名单）', en: 'to record someone for a slot or list' },
      usage: { zh: '预约与报名场景：put you down for Wednesday、put you down for the course。', en: 'Used in booking and sign-up: put you down for Wednesday, for the course.' },
      example: { en: 'I’ll put you down for the morning session.', zh: '我把你登记到上午场次。' },
    },
    {
      phrase: 'out of date', sentenceIndex: 15,
      meaning: { zh: '过时的，陈旧的', en: 'no longer current, so new records are needed' },
      usage: { zh: '作表语或定语；反义是 up to date。', en: 'Predicative or attributive; the opposite is up to date.' },
      example: { en: 'If your old X-rays are out of date, the dentist will take new ones.', zh: '如果旧 X 光片已过时，牙医会重拍。' },
    },
    {
      phrase: 'depends on', sentenceIndex: 17,
      meaning: { zh: '取决于，视……而定', en: 'to be decided by something else rather than fixed' },
      usage: { zh: '主语常为 it；后接名词或 wh 从句，不要漏掉 on。', en: 'The subject is often it; follow with a noun or wh-clause, and keep on.' },
      example: { en: 'Whether you need polishing depends on your gums.', zh: '是否需要抛光取决于牙龈状况。' },
    },
    {
      phrase: 'without notice', sentenceIndex: 20,
      meaning: { zh: '没有提前通知，临时缺席', en: 'without giving the prior warning the policy requires' },
      usage: { zh: '介词短语作状语；反义表达是 with notice、at short notice。', en: 'A prepositional adverbial; contrasts with with notice or at short notice.' },
      example: { en: 'A missed appointment without notice carries a small fee.', zh: '未提前告知而缺席会收取小额费用。' },
    },
    {
      phrase: 'works best for me', sentenceIndex: 30,
      meaning: { zh: '对我来说最合适', en: 'is the most convenient option for the speaker' },
      usage: { zh: '口语选择表达；替代说法是 suits me best。', en: 'A spoken way to state a preference; suits me best is a paraphrase.' },
      example: { en: 'A text reminder works best for me because I rarely check email.', zh: '我很少看邮件，短信提醒对我最合适。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记被提出的时间，再听修正', en: 'Note the first slot, then the correction' },
      body: {
        zh: '第 3 题先出现周二下午，病人以下午有课否定，答案才落到周三上午。预约类 Part 1 常先给一个不可用时段，听到 I’m afraid、no good for me 就准备划掉旧时间。',
        en: 'Item 3 first offers a Tuesday afternoon, which the patient rules out because of college, before Wednesday morning is confirmed. In booking Part 1, an unusable slot often comes first; when you hear no good for me, cross out the earlier time.',
      },
    },
    {
      title: { zh: '区分包含项与另加收费项', en: 'Separate what is included from what costs extra' },
      body: {
        zh: '第 8 题问检查费本身，而十美元一张的 X 光是后续加项。听费用时盯住题干的主体词（fee、charge、price），把基础价和单项加价分两栏记，避免把附加费填进基础费用空。',
        en: 'Item 8 asks for the check-up fee itself, while ten-dollar X-rays are a later add-on. When prices come, watch the head noun in the stem (fee, charge, price) and keep the basic price and the extras in two columns so the add-on does not enter the base-fee blank.',
      },
    },
    {
      title: { zh: '例证不要误填上位词', en: 'Do not write the example for the umbrella word' },
      body: {
        zh: '第 10 题的驾照、护照只是 identification 的举例，题干问证件类别。填表时先判断空格要上位词还是具体例子：材料类空格（旧病历）填具体记录，证件类空格填总称。',
        en: 'For item 10, the licence and passport are only examples of identification, and the stem asks for the category. Decide whether the blank wants an umbrella word or a concrete example: records blanks take the concrete item, identity blanks take the umbrella word.',
      },
    },
  ],
};
