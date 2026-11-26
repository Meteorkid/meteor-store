import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 10 · Part 1 — 预约驾照考试（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：登记姓名 → 选择考试中心与日期 → 证件要求 → 改期费用 →
 * 车辆保险、车牌标识与安全检查。填空块在前半段，单选块在后半段，
 * 题块顺序与录音顺序一致。
 */
export const test10Part1: ListeningLesson = {
  slug: 'test-10-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约驾照考试', en: 'Applying for a driving test slot' },
  summary: {
    zh: '考生致电考试中心预约实操驾照考试：登记姓名、选择中心与日期，确认必须携带的证件，了解改期费用，以及考试当天车辆的保险、标识与安全检查要求。',
    en: 'A candidate calls the test centre to book a practical driving test: he gives his name, chooses a centre and date, confirms the required identification, learns the change fee, and hears the rules for the car’s insurance, markings and safety check on the day.',
  },
  accent: { zh: '接待员为加拿大口音，考生为美式口音。', en: 'The receptionist speaks with a Canadian accent and the candidate with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'candidate', label: 'CANDIDATE', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'First name', cells: [[{ blank: 2 }]] },
        { lead: 'Preferred test centre', cells: [[{ blank: 3 }]] },
        { lead: 'Preferred test date', cells: [[{ blank: 4 }]] },
        { lead: 'Identification required', cells: [[{ blank: 5 }]] },
        { lead: 'Change-of-session fee', cells: [[{ text: '$' }, { blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What happens if the test is changed with less than three working days’ notice?',
          options: [
            { key: 'A', text: 'The booking fee is refunded in full.' },
            { key: 'B', text: 'The fee is kept and a new slot must be booked.' },
            { key: 'C', text: 'Only half the change fee is charged.' },
          ],
        },
        {
          number: 8,
          stem: 'What document must the candidate bring to prove the car is covered?',
          options: [
            { key: 'A', text: 'a signed letter from the driving instructor' },
            { key: 'B', text: 'proof of valid insurance for the vehicle' },
            { key: 'C', text: 'a copy of the theory test certificate' },
          ],
        },
        {
          number: 9,
          stem: 'What markings must the test vehicle display?',
          options: [
            { key: 'A', text: 'L plates on the front and the back' },
            { key: 'B', text: 'a green P plate on the windscreen' },
            { key: 'C', text: 'a centre sticker on the driver’s door' },
          ],
        },
        {
          number: 10,
          stem: 'What if the car fails the pre-test safety check?',
          options: [
            { key: 'A', text: 'The candidate uses a centre car for a fee.' },
            { key: 'B', text: 'The test is postponed and rebooked.' },
            { key: 'C', text: 'The candidate borrows another learner’s car.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Holloway'], evidence: 2,
      explanation: {
        zh: '定位句 2：考生逐字母拼出 Holloway。拼写题先写下首字母 H，再跟着读音补全；不要按发音写成 Hollaway 或 Holoway。',
        en: 'Sentence 2: the candidate spells the surname out letter by letter. Write the first letter, then fill in the rest; do not guess a spelling such as Hollaway.',
      },
    },
    {
      number: 2, accepted: ['Jake'], evidence: 4,
      explanation: {
        zh: '定位句 4：It’s Jake. Jake Holloway。名是 Jake，与句 2 的姓氏分开填写；注意结尾不发 /k/ 之外的额外音节。',
        en: 'Sentence 4: "It’s Jake. Jake Holloway". The first name is Jake, written separately from the surname in sentence 2; do not add an extra syllable at the end.',
      },
    },
    {
      number: 3, accepted: ['Northfield'], evidence: 6,
      explanation: {
        zh: '定位句 6：考生先说 Riverside，紧接着 Wait, no, Northfield please。以自我修正后的 Northfield 为准，Riverside 是被否定的干扰项。',
        en: 'Sentence 6: the candidate first says Riverside, then corrects himself with "Wait, no, Northfield please". The corrected form Northfield wins, and Riverside is the rejected distractor.',
      },
    },
    {
      number: 4, accepted: ['18 November', 'November 18'], spoken: 'the eighteenth of November', evidence: 9,
      explanation: {
        zh: '定位句 9：The nearest weekday slot is the eighteenth of November。考生句 8 问的周六已被排满，只作干扰；日期填月日即可。',
        en: 'Sentence 9: "The nearest weekday slot is the eighteenth of November". The Saturday the candidate asked about in sentence 8 is fully booked, so it is a distractor; write the month and day only.',
      },
    },
    {
      number: 5, accepted: ['provisional licence'], evidence: 11,
      explanation: {
        zh: '定位句 11：On the day you must bring your provisional licence with you。证件只填 provisional licence；句 13 的 passport 是被接待员否定的替代方案。',
        en: 'Sentence 11: "On the day you must bring your provisional licence with you". The gap asks for the provisional licence; the passport in sentence 13 is the rejected alternative.',
      },
    },
    {
      number: 6, accepted: ['35', 'thirty-five'], spoken: 'thirty-five', evidence: 17,
      explanation: {
        zh: '定位句 17：Then the change fee is thirty-five dollars。空格后已印美元符号，只填数字 35；句 15 的三天提前期是退费条件，不是费用本身。',
        en: 'Sentence 17: "Then the change fee is thirty-five dollars". The dollar sign is already printed, so write the number 35. The three-day notice in sentence 15 is the refund condition, not the fee.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：不够三天通知就收三十五美元改期费，并且之后要另约新时段。fees kept and new slot booked 即此意。A 说全额退款，C 说只收半价，都与原文不符。',
        en: 'Sentence 17: with less than three days’ notice the thirty-five-dollar fee is kept and a new slot must be booked, matching B. A claims a full refund and C claims half the fee; neither appears in the recording.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The car you bring must be insured for the test, and you’ll need proof of that insurance。proof of valid insurance 与 B 对应。A 的教练信函和 C 的理论考试证书在句 31 被明确说不需要。',
        en: 'Sentence 19: "The car you bring must be insured for the test, and you’ll need proof of that insurance". Proof of valid insurance matches B. The instructor’s letter and the theory certificate are both said to be unnecessary in sentence 31.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：The vehicle must display L plates on both the front and the back。前后两面的 L 牌对应 A。B 的绿色 P 牌和 C 的车门贴纸全段没有提到。',
        en: 'Sentence 23: "The vehicle must display L plates on both the front and the back". L plates on both sides match A. A green P plate and a door sticker are never mentioned.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：If the car fails the safety check, you cannot take the test that day, so you postpone and rebook。车辆不过检就推迟并重约，对应 B。A 说用车中心备用车，句 29 明确说中心不存备用车；C 说借其他考生的车，原文没有。',
        en: 'Sentence 27: "If the car fails the safety check, you cannot take the test that day, so you postpone and rebook". Postponing and rebooking matches B. Sentence 29 states the centre keeps no spare car, ruling out A, and borrowing another learner’s car is never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'candidate', text: 'Hi, I’ve been looking at your website, and I’d like to book a practical driving test, please.' },
    { speaker: 'receptionist', text: 'Good morning, I can reserve a slot over the phone. Could I take your details first?' },
    { speaker: 'candidate', text: 'Sure. My surname is Holloway. That’s H, O, L, L, O, W, A, Y.' },
    { speaker: 'receptionist', text: 'H, O, L, L, O, W, A, Y. Thank you. And your first name?' },
    { speaker: 'candidate', text: 'It’s Jake. Jake Holloway.' },
    { speaker: 'receptionist', text: 'Thanks, Jake. Which test centre would you prefer? We have Riverside and Northfield.' },
    { speaker: 'candidate', text: 'Riverside, I think. Wait, no, Northfield please. It’s closer to where I live.' },
    { speaker: 'receptionist', text: 'Northfield it is. Now, when would you like to take the test?' },
    { speaker: 'candidate', text: 'Is there anything available on a Saturday?' },
    { speaker: 'receptionist', text: 'Saturdays are fully booked for the next month. The nearest weekday slot is the eighteenth of November.' },
    { speaker: 'candidate', text: 'The eighteenth of November works for me. I’ll take that one.' },
    { speaker: 'receptionist', text: 'Good. I’ll note that down. On the day you must bring your provisional licence with you.' },
    { speaker: 'candidate', text: 'My provisional licence? I thought I could use my passport instead.' },
    { speaker: 'receptionist', text: 'No, the licence is the only accepted identification for the test. The passport won’t do.' },
    { speaker: 'candidate', text: 'Right, I’ll make sure I bring it. What if I need to change the date later?' },
    { speaker: 'receptionist', text: 'You can move the slot once, but you have to give at least three working days’ notice to keep your money.' },
    { speaker: 'candidate', text: 'And if it’s less than that?' },
    { speaker: 'receptionist', text: 'Then the change fee is thirty-five dollars, and you book a new slot after that.' },
    { speaker: 'candidate', text: 'Thirty-five. That’s a bit more than I expected. Is there anything else I should prepare?' },
    { speaker: 'receptionist', text: 'Yes. The car you bring must be insured for the test, and you’ll need proof of that insurance with you.' },
    { speaker: 'candidate', text: 'Does my own policy cover me for the test, or do I need a separate note?' },
    { speaker: 'receptionist', text: 'A valid policy in your name is enough. Bring the document that shows the cover dates.' },
    { speaker: 'candidate', text: 'Fine. What about the markings on the car? I practise in my instructor’s car.' },
    { speaker: 'receptionist', text: 'The vehicle must display L plates on both the front and the back.' },
    { speaker: 'candidate', text: 'L plates on both sides. My instructor’s car has those already, so that’s fine.' },
    { speaker: 'receptionist', text: 'Good. Before you drive out, the examiner checks the car for basic safety.' },
    { speaker: 'candidate', text: 'What happens if something fails that check?' },
    { speaker: 'receptionist', text: 'If the car fails the safety check, you cannot take the test that day, so you postpone and rebook.' },
    { speaker: 'candidate', text: 'Is there a centre car I could use instead, like some test centres offer?' },
    { speaker: 'receptionist', text: 'We don’t keep spare cars here. If your car fails, you arrange another one for the new date.' },
    { speaker: 'candidate', text: 'I see. One more thing. Do I need to show the theory test certificate?' },
    { speaker: 'receptionist', text: 'Not on the day. It’s already on our system, but keep a copy in your folder just in case.' },
    { speaker: 'candidate', text: 'Great. So the slot is Northfield, the eighteenth of November, and I bring the licence and the insurance proof.' },
    { speaker: 'receptionist', text: 'That’s right. You’ll get a confirmation email within the hour.' },
    { speaker: 'candidate', text: 'Perfect. Thank you for your help.' },
    { speaker: 'receptionist', text: 'You’re welcome. Before the day, check that the mirrors, tyres and brakes are all in order.' },
    { speaker: 'candidate', text: 'Will there be a waiting room at the centre before my slot?' },
    { speaker: 'receptionist', text: 'Yes, there are seats near the front desk. Arrive about fifteen minutes early, but not earlier than thirty.' },
    { speaker: 'candidate', text: 'Fifteen minutes early. What if I’m held up in traffic?' },
    { speaker: 'receptionist', text: 'Call the centre if you’re going to be more than ten minutes late. A late arrival may mean the slot is given up.' },
    { speaker: 'candidate', text: 'I’ll set off early then. Thanks again.' },
    { speaker: 'receptionist', text: 'Not at all. Have a safe trip to the centre, and good luck.' },
  ],
  vocabulary: [
    {
      term: 'provisional', phonetic: '/prəˈvɪʒənl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '临时的，预备的（此处指初学驾照）', en: 'temporary or preliminary; here describing the learner licence' },
      usage: { zh: 'provisional licence 是英式固定说法，指还未通过路考的初学驾照；美式常说 learner’s permit。', en: 'A provisional licence is the British term for a learner permit before the driving test; American English often says learner’s permit.' },
      collocations: ['provisional licence', 'provisional driving permit'],
      example: { en: 'You must carry your provisional licence to the test.', zh: '你必须随身携带初学驾照参加考试。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈvɪʒ/，开头 /prə/ 弱读。', en: 'Three syllables with stress on the second; the opening /prə/ is weak.' },
    },
    {
      term: 'licence', phonetic: '/ˈlaɪsns/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '执照，证件（此处指驾照）', en: 'an official document that permits you to do something' },
      usage: { zh: '英式拼写 licence 作名词，license 作动词；美式名词也拼 license。driving licence 即驾照。', en: 'British spelling: licence for the noun, license for the verb; American English uses license for the noun too. A driving licence is the car licence.' },
      collocations: ['provisional licence', 'driving licence', 'show your licence'],
      example: { en: 'The examiner checks your licence before the test.', zh: '考官在考试前查验你的驾照。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlaɪ/，结尾 /ns/ 不要漏听。', en: 'Two syllables with first-syllable stress; do not drop the final /ns/.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '身份证明，证件', en: 'an official document that proves who you are' },
      usage: { zh: '不可数；photo identification、accepted identification。口语里常缩成 ID。', en: 'Uncountable: photo identification, accepted identification. In speech it is often shortened to ID.' },
      collocations: ['accepted identification', 'photo identification', 'proof of identification'],
      example: { en: 'Only the licence counts as accepted identification here.', zh: '这里只有驾照算作可接受的身份证明。' },
      listening: { zh: '六个音节，重音在第五个 /ˈkeɪ/，开头 i 读 /aɪ/。', en: 'Six syllables with stress on the fifth; the opening i sounds like /aɪ/.' },
    },
    {
      term: 'insurance', phonetic: '/ɪnˈʃʊərəns/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '保险（此处指车辆保险）', en: 'a contract that pays out if the car is damaged or in an accident' },
      usage: { zh: '不可数；car insurance、valid insurance、proof of insurance。动词 insure。', en: 'Uncountable: car insurance, valid insurance, proof of insurance. The verb is insure.' },
      collocations: ['valid insurance', 'proof of insurance', 'insured for the test'],
      example: { en: 'Bring proof of insurance before you drive the test car.', zh: '开考试用车前请带上保险凭证。' },
      listening: { zh: '重音在第二音节 /ˈʃʊə/，结尾 /rəns/ 轻读。', en: 'Stress the second syllable; the ending /rəns/ is weak.' },
    },
    {
      term: 'notice', phonetic: '/ˈnəʊtɪs/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '通知，提前告知的期限', en: 'information given ahead of time about a change or cancellation' },
      usage: { zh: 'give notice、working days’ notice；on short notice 指临时通知。', en: 'Give notice, working days’ notice; on short notice means with little advance warning.' },
      collocations: ['three days’ notice', 'working days’ notice', 'give notice'],
      example: { en: 'You need three days’ notice to keep the booking fee.', zh: '需要提前三天通知才能保留预约费用。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈnəʊ/，不要听成 noises。', en: 'Two syllables with first-syllable stress; do not hear it as noises.' },
    },
    {
      term: 'policy', phonetic: '/ˈpɒləsi/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '保单，保险契约', en: 'the formal insurance contract with a company' },
      usage: { zh: '可数；insurance policy、valid policy、policy in your name。', en: 'Countable: an insurance policy, a valid policy, a policy in your name.' },
      collocations: ['a valid policy', 'insurance policy', 'policy in your name'],
      example: { en: 'The policy must cover you on the test day.', zh: '保单必须覆盖考试当天。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpɒ/，结尾 /si/ 轻读。', en: 'Three syllables with first-syllable stress; the ending /si/ is weak.' },
    },
    {
      term: 'safety', phonetic: '/ˈseɪfti/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '安全（此处指车辆安全状况）', en: 'the condition of being free from danger or risk' },
      usage: { zh: '不可数；safety check、basic safety、safety rules。形容词 safe。', en: 'Uncountable: a safety check, basic safety, safety rules. The adjective is safe.' },
      collocations: ['the safety check', 'basic safety', 'safety inspection'],
      example: { en: 'The examiner does a safety check before the drive.', zh: '考官在开车前做安全检查。' },
      listening: { zh: '两个音节，safe 加 ty，重音在第一音节。', en: 'Safe plus ty, two syllables with first-syllable stress.' },
    },
    {
      term: 'mirrors', phonetic: '/ˈmɪrəz/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '后视镜', en: 'the glass on a car that shows the road behind' },
      usage: { zh: '可数；wing mirror、rear-view mirror。考试前要调节后视镜。', en: 'Countable: a wing mirror, a rear-view mirror. Mirrors are adjusted before the test drive.' },
      collocations: ['adjust the mirrors', 'wing mirrors', 'the rear-view mirror'],
      example: { en: 'Check the mirrors before you move off.', zh: '起步前检查后视镜。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmɪ/，结尾 /rə/ 弱读。', en: 'Two syllables with first-syllable stress; the ending /rə/ is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'take your details', sentenceIndex: 1,
      meaning: { zh: '登记你的个人信息', en: 'to write down somebody’s personal information on a form' },
      usage: { zh: '办理业务的开场说法；也可说 take your details down、take your information。', en: 'An opening phrase in service scenes; take your details down means the same.' },
      example: { en: 'I’ll take your details before booking the slot.', zh: '预约之前我先登记你的信息。' },
    },
    {
      phrase: 'works for me', sentenceIndex: 10,
      meaning: { zh: '对我合适，我行得通', en: 'to be acceptable or convenient for somebody' },
      usage: { zh: '口语回答时间、地点；That works for me 比 It suits me 更自然。', en: 'Used for agreeing a time or place; that works for me sounds more natural than it suits me.' },
      example: { en: 'Half past nine works for me on Tuesday.', zh: '周二九点半对我合适。' },
    },
    {
      phrase: 'make sure', sentenceIndex: 14,
      meaning: { zh: '确保，务必做到', en: 'to check that something is certain to happen' },
      usage: { zh: '后接从句或不定式；make sure you bring、make sure to arrive early。', en: 'Follow with a clause or infinitive: make sure you bring it, make sure to arrive early.' },
      example: { en: 'Make sure the licence is in your bag.', zh: '务必把驾照放进包里。' },
    },
    {
      phrase: 'change fee', sentenceIndex: 17,
      meaning: { zh: '改期手续费', en: 'the charge for moving a booking to another date' },
      usage: { zh: '可数；change fee、booking fee、late change fee。', en: 'Countable: a change fee, a booking fee, a late change fee.' },
      example: { en: 'The change fee is charged when notice is short.', zh: '临时通知改期会收取改期费。' },
    },
    {
      phrase: 'proof of', sentenceIndex: 19,
      meaning: { zh: '……的凭证，证明材料', en: 'a document that shows something is true or valid' },
      usage: { zh: 'proof of insurance、proof of address、proof of identity；proof 不可数。', en: 'Proof of insurance, proof of address, proof of identity; proof is uncountable.' },
      example: { en: 'You need proof of insurance on the day.', zh: '当天你需要保险凭证。' },
    },
    {
      phrase: 'fails the safety check', sentenceIndex: 27,
      meaning: { zh: '未通过安全检查', en: 'not passing a basic inspection of the vehicle' },
      usage: { zh: 'fail 在此作及物或不及物；fail the check、the car fails inspection。', en: 'Fail works transitively or intransitively: fail the check, the car fails inspection.' },
      example: { en: 'If the car fails the check, the test cannot start.', zh: '车辆不过检，考试就不能开始。' },
    },
    {
      phrase: 'held up', sentenceIndex: 38,
      meaning: { zh: '被耽搁，被堵住', en: 'delayed by traffic, weather or another problem' },
      usage: { zh: '被动形式 be held up；被堵车、排队等拖住都可用。', en: 'Passive: be held up, delayed by traffic, a queue or another problem.' },
      example: { en: 'Call if you are held up on the way.', zh: '路上被耽搁了就打电话。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段就是定位线索', en: 'The form rows are your cues' },
      body: {
        zh: '听前把 Surname、First name、Centre、Date、Identification、Fee 六行扫一遍，预判每行要填姓名、地点、日期还是数字。录音按表单顺序推进，听到字段名就检查自己写到了哪一空。',
        en: 'Scan the six rows before listening: surname, first name, centre, date, identification and fee. Predict whether each gap holds a name, place, date or number. The recording follows the form order, so match each field name as you hear it.',
      },
    },
    {
      title: { zh: 'Wait, no 之后才是答案', en: 'The answer follows the correction' },
      body: {
        zh: '考生先说 Riverside，再用 Wait, no 改成 Northfield；日期先问周六，被接待员告知排满。听到 I mean、actually、wait no 这类改口标记时，把刚记下的词划掉，写后面修正过的说法。',
        en: 'The candidate says Riverside first, then changes to Northfield with wait no; the Saturday slot he asks about is booked. When you hear I mean, actually or wait no, cross out what you wrote and record the corrected version.',
      },
    },
    {
      title: { zh: '数字先对照它服务的项目', en: 'Match each number to its item' },
      body: {
        zh: 'thirty-five dollars 是改期费，fifteen minutes 是提前到达的时间，ten minutes 是迟到的上限。落笔前先确认这个数字对应表单哪一行或哪道题，不要把到达时间写进费用空里。',
        en: 'Thirty-five dollars is the change fee, fifteen minutes is the early arrival time, and ten minutes is the late-arrival limit. Confirm what each number applies to before writing it down, so the arrival time does not land in the fee gap.',
      },
    },
  ],
};
