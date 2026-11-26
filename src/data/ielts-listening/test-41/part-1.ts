import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 41 · Part 1 — 顾客电话预订水疗日（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：套餐内容 → 时长 → 更衣设施 → 孕妇告知 → 免费取消时限（填空块），
 * 后半段复述套餐构成、咨询时长、更衣提供物、孕妇禁忌项目与迟到改约收费（单选块）。
 * 题块顺序与录音顺序一致。开场用顾客直接诉求，不用机构问候加 How can I help you。
 */
export const test41Part1: ListeningLesson = {
  slug: 'test-41-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订水疗日', en: 'Booking a spa day' },
  summary: {
    zh: '一位顾客致电水疗中心预订水疗日：选定面部护理加按摩的午间套餐、整套时长、更衣楼层、预约前须告知治疗师的孕期情况，以及免费取消的时限；后半段复述套餐构成、开场咨询时长、更衣区提供的物品、孕妇应避免的按摩类型，以及短通知改约的收费方式。',
    en: 'A customer calls the spa to book a day: she picks the midday package of facial and massage, learns the session length, the changing-room floor, the pregnancy note due to the therapist, and the free-cancellation deadline; later she recapitulates the package contents, consultation time, changing-area items, the massage type to avoid in pregnancy, and the late-change charge.',
  },
  accent: { zh: '顾客为美式口音，前台为澳式多语言口音。', en: 'The customer speaks with an American accent and the receptionist with an Australian multilingual accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Package includes a facial and a', cells: [[{ blank: 1 }]] },
        { lead: 'Whole session lasts about', cells: [[{ blank: 2 }, { text: ' minutes.' }]] },
        { lead: 'Changing rooms are on the', cells: [[{ blank: 3 }, { text: ' floor.' }]] },
        { lead: 'Pregnant guests should tell the', cells: [[{ blank: 4 }, { text: ' before booking.' }]] },
        { lead: 'Free cancellation with', cells: [[{ blank: 5 }, { text: ' hours notice.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the chosen package include?',
          options: [
            { key: 'A', text: 'One treatment only, with no extras.' },
            { key: 'B', text: 'A facial plus one massage.' },
            { key: 'C', text: 'Full day access to the pool and steam room.' },
          ],
        },
        {
          number: 7,
          stem: 'How long does the opening consultation last?',
          options: [
            { key: 'A', text: 'About ten minutes.' },
            { key: 'B', text: 'About twenty minutes.' },
            { key: 'C', text: 'Half an hour.' },
          ],
        },
        {
          number: 8,
          stem: 'What is provided in the changing area?',
          options: [
            { key: 'A', text: 'Private individual cubicles.' },
            { key: 'B', text: 'A shared locker room with no amenities.' },
            { key: 'C', text: 'A robe and towel in a shared locker room.' },
          ],
        },
        {
          number: 9,
          stem: 'Which treatment must pregnant guests avoid?',
          options: [
            { key: 'A', text: 'The facial.' },
            { key: 'B', text: 'Deep tissue massage.' },
            { key: 'C', text: 'The light shoulder massage.' },
          ],
        },
        {
          number: 10,
          stem: 'What is the late cancellation rule?',
          options: [
            { key: 'A', text: 'Cancellation stays free with any notice.' },
            { key: 'B', text: 'A late change carries a half charge.' },
            { key: 'C', text: 'The full deposit is lost for any change.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['massage'], evidence: 3,
      explanation: {
        zh: '定位句 3：The midday package pairs a facial with a massage。套餐含面部护理加一次按摩，填 massage。句 5 的肩颈放松是护理内的收尾，不是第二项独立项目。',
        en: 'Sentence 3: "The midday package pairs a facial with a massage". The package is facial plus massage, so write massage. The shoulder and neck finish in sentence 5 is part of the facial, not a second item.',
      },
    },
    {
      number: 2, accepted: ['ninety', '90'], evidence: 7,
      explanation: {
        zh: '定位句 7：The session lasts about ninety minutes, including the time to settle in and change。整套时长约九十分钟；空后已印 minutes，填数字 ninety。',
        en: 'Sentence 7: "The session lasts about ninety minutes, including the time to settle in and change". The session runs ninety minutes; minutes is printed, so write ninety.',
      },
    },
    {
      number: 3, accepted: ['ground'], evidence: 11,
      explanation: {
        zh: '定位句 11：The changing rooms are on the ground floor, beside the stairs up to the treatment rooms。更衣楼层为一楼，填 ground；floor 已印在卷面上。',
        en: 'Sentence 11: "The changing rooms are on the ground floor, beside the stairs up to the treatment rooms". Changing rooms are on the ground floor; floor is printed, so write ground.',
      },
    },
    {
      number: 4, accepted: ['therapist'], evidence: 15,
      explanation: {
        zh: '定位句 15：Then please tell the therapist about your pregnancy before any treatment begins。孕妇须提前告知治疗师，填 therapist。前台只负责登记，不替代治疗师判断。',
        en: 'Sentence 15: "Then please tell the therapist about your pregnancy before any treatment begins". Pregnant guests tell the therapist, so write therapist. The receptionist only books the slot and does not judge the treatment.',
      },
    },
    {
      number: 5, accepted: ['twenty-four', '24'], evidence: 19,
      explanation: {
        zh: '定位句 19：You can cancel free if you give twenty-four hours notice before the session。免费取消需提前二十四小时通知；空后已印 hours notice，填 twenty-four。',
        en: 'Sentence 19: "You can cancel free if you give twenty-four hours notice before the session". Free cancellation needs twenty-four hours notice; hours notice is printed, so write twenty-four.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：The package covers the facial plus one massage; pool and steam room access comes with the full day pass instead。套餐是面部加一次按摩，对应 B。C 的泳池桑拿属全日通票，A 的仅一项护理与句中两项相反。',
        en: 'Sentence 21: "The package covers the facial plus one massage; pool and steam room access comes with the full day pass instead". Facial plus massage matches B. Pool access in C belongs to the day pass, and one treatment only in A contradicts the two items.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：It lasts about ten minutes before the treatments, just enough to note skin concerns and pressure preferences。开场咨询约十分钟，对应 A。B 的二十分钟与 C 的半小时在录音中均未出现。',
        en: 'Sentence 23: "It lasts about ten minutes before the treatments, just enough to note skin concerns and pressure preferences". The consultation is about ten minutes, matching A. Twenty minutes and half an hour are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：You are given a robe and a towel, kept in the shared locker room with your locked locker for the bag。更衣区提供浴袍与毛巾，且为共用更衣室，对应 C。A 的独立隔间与句中 shared 相反，B 的不提供用品与 robe、towel 相反。',
        en: 'Sentence 25: "You are given a robe and a towel, kept in the shared locker room with your locked locker for the bag". Robe and towel in a shared locker room match C. Private cubicles contradict shared, and no amenities contradict the robe and towel.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Deep tissue massage is the one to avoid; the lighter shoulder massage and the facial remain fine。孕妇应避免深层组织按摩，对应 B。A 的面部与 C 的轻肩颈按摩在同句被明确为可以做。',
        en: 'Sentence 27: "Deep tissue massage is the one to avoid; the lighter shoulder massage and the facial remain fine". Deep tissue massage is the one to avoid, matching B. The facial in A and light shoulder massage in C are both said to be fine.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：A late change carries a half charge, though we hold the rest as credit for a later visit。短通知改约收半费，余额留作抵扣，对应 B。A 的任何通知都免费与半费相反，C 的定金全失在录音中没有依据。',
        en: 'Sentence 29: "A late change carries a half charge, though we hold the rest as credit for a later visit". A late change carries a half charge, matching B. Free with any notice contradicts the charge, and losing the full deposit is not claimed.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I’d like to book a spa day for next weekend, if you have any places left.' },
    { speaker: 'receptionist', text: 'Of course. Let me pull up the diary and see which packages still have openings.' },
    { speaker: 'customer', text: 'I’m after something relaxing, not too heavy on the treatments.' },
    { speaker: 'receptionist', text: 'The midday package pairs a facial with a massage, and that tends to suit guests who want a gentle session.' },
    { speaker: 'customer', text: 'That sounds right. What does the facial cover, exactly?' },
    { speaker: 'receptionist', text: 'It cleanses the skin, applies a mask, and finishes with a light shoulder and neck massage.' },
    { speaker: 'customer', text: 'And the massage itself, how long does the whole session run once I arrive?' },
    { speaker: 'receptionist', text: 'The session lasts about ninety minutes, including the time to settle in and change.' },
    { speaker: 'customer', text: 'Is there a separate consultation before the treatments start?' },
    { speaker: 'receptionist', text: 'Yes, we begin with a short consultation, about ten minutes, to check your skin and any aches.' },
    { speaker: 'customer', text: 'Where do guests change once they are inside?' },
    { speaker: 'receptionist', text: 'The changing rooms are on the ground floor, beside the stairs up to the treatment rooms.' },
    { speaker: 'customer', text: 'What about towels and robes? Do I bring my own?' },
    { speaker: 'receptionist', text: 'A robe and towel are provided in the locker room, so you only need indoor slippers if you prefer.' },
    { speaker: 'customer', text: 'I am pregnant, so I want to check what is safe for me before I book anything.' },
    { speaker: 'receptionist', text: 'Then please tell the therapist about your pregnancy before any treatment begins, and we will adjust the pressure.' },
    { speaker: 'customer', text: 'Is there any treatment I should avoid altogether?' },
    { speaker: 'receptionist', text: 'Deep tissue massage is off the list for pregnant guests, since it works too hard on the muscles.' },
    { speaker: 'customer', text: 'What happens if I need to cancel once the booking is confirmed?' },
    { speaker: 'receptionist', text: 'You can cancel free if you give twenty-four hours notice before the session.' },
    { speaker: 'customer', text: 'Now, could you go over what the chosen package includes once more?' },
    { speaker: 'receptionist', text: 'The package covers the facial plus one massage; pool and steam room access comes with the full day pass instead.' },
    { speaker: 'customer', text: 'How long is that opening consultation, so I can plan the morning?' },
    { speaker: 'receptionist', text: 'It lasts about ten minutes before the treatments, just enough to note skin concerns and pressure preferences.' },
    { speaker: 'customer', text: 'And what exactly am I given in the changing area?' },
    { speaker: 'receptionist', text: 'You are given a robe and a towel, kept in the shared locker room with your locked locker for the bag.' },
    { speaker: 'customer', text: 'Which massage type should pregnant guests steer clear of, once more?' },
    { speaker: 'receptionist', text: 'Deep tissue massage is the one to avoid; the lighter shoulder massage and the facial remain fine.' },
    { speaker: 'customer', text: 'What happens if I have to cancel with short notice?' },
    { speaker: 'receptionist', text: 'A late change carries a half charge, though we hold the rest as credit for a later visit.' },
    { speaker: 'customer', text: 'Is the deposit refundable at all if I become unwell?' },
    { speaker: 'receptionist', text: 'We keep the deposit as credit rather than sending cash back, unless the clinic closes for its own reason.' },
    { speaker: 'customer', text: 'How far in advance should I book a weekend slot?' },
    { speaker: 'receptionist', text: 'Weekend places fill quickly, so two or three weeks ahead is the safest window.' },
    { speaker: 'customer', text: 'What time does the first session start on Saturdays?' },
    { speaker: 'receptionist', text: 'The first slot opens at nine in the morning, and the last one runs through the early evening.' },
    { speaker: 'customer', text: 'Can I choose which therapist performs the massage?' },
    { speaker: 'receptionist', text: 'You may note a preference at booking, but we cannot promise a named therapist for a first visit.' },
    { speaker: 'customer', text: 'Is there anything I should avoid eating before the facial?' },
    { speaker: 'receptionist', text: 'A heavy meal just before the session can make the face feel puffy, so a light lunch works better.' },
    { speaker: 'customer', text: 'Will I receive a reminder once the booking goes through?' },
    { speaker: 'receptionist', text: 'Yes, a confirmation message arrives the evening before your scheduled visit.' },
    { speaker: 'customer', text: 'Great. I will take the midday package for Saturday morning, then.' },
    { speaker: 'receptionist', text: 'Done. Please arrive ten minutes early so the consultation can start on time.' },
  ],
  vocabulary: [
    {
      term: 'diary', phonetic: '/ˈdaɪəri/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '预约簿，日程表', en: 'the book or system where appointments are recorded' },
      usage: { zh: '服务行业口语；check the diary、pull up the diary。', en: 'Service usage: check the diary, pull up the diary.' },
      collocations: ['pull up the diary', 'a busy diary', 'book in the diary'],
      example: { en: 'Let me pull up the diary and see which slots are free.', zh: '我调出预约簿，看看还有哪些空档。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 -ary 弱读。', en: 'Two syllables with first-syllable stress; the ending is weak.' },
    },
    {
      term: 'consultation', phonetic: '/ˌkɒnslˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '咨询，面诊（确定方案的简短沟通）', en: 'a short talk before a treatment to agree the plan' },
      usage: { zh: '可数；a short consultation、book a consultation。动词是 consult。', en: 'Countable: a short consultation. The verb is consult.' },
      collocations: ['a short consultation', 'the opening consultation', 'the consultation lasts'],
      example: { en: 'The consultation takes ten minutes before the facial starts.', zh: '面部护理前先做十分钟咨询。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈteɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'therapist', phonetic: '/ˈθerəpɪst/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '治疗师，护理师', en: 'the staff member who performs the facial or massage' },
      usage: { zh: '可数；the therapist、a massage therapist。', en: 'Countable: the therapist, a massage therapist.' },
      collocations: ['the therapist checks', 'the massage therapist', 'tell the therapist'],
      example: { en: 'Tell the therapist about any pregnancy before treatment.', zh: '护理前先把孕期情况告知治疗师。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈθer/；开头 /θ/ 咬舌。', en: 'Three syllables, first stress; the opening /θ/ is dental.' },
    },
    {
      term: 'locker', phonetic: '/ˈlɒkər/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '寄存柜，锁柜', en: 'the locked cabinet where a guest keeps a bag and shoes' },
      usage: { zh: '可数；a locked locker、shared locker room。', en: 'Countable: a locked locker, shared locker room.' },
      collocations: ['a locked locker', 'the locker room', 'your locker'],
      example: { en: 'Each guest gets a locked locker for the bag.', zh: '每位客人有一个上锁的寄存柜放包。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlɒk/；结尾 /ər/ 轻读。', en: 'Two syllables, first stress; the ending /ər/ is weak.' },
    },
    {
      term: 'robe', phonetic: '/rəʊb/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '浴袍', en: 'the loose garment worn between treatments in the spa' },
      usage: { zh: '可数；a robe and towel、spa robe。', en: 'Countable: a robe and towel, spa robe.' },
      collocations: ['a robe and towel', 'the spa robe', 'put on the robe'],
      example: { en: 'A robe and towel are provided in the locker room.', zh: '更衣室提供浴袍与毛巾。' },
      listening: { zh: '单音节，双元音 /əʊ/，结尾 /b/ 读出来。', en: 'One syllable with /əʊ/; pronounce the final /b/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '定金，押金', en: 'the sum paid to hold the booking' },
      usage: { zh: '可数；the deposit、lose the deposit。动词 deposit 另有“存放”义。', en: 'Countable: the deposit, lose the deposit. The verb means place safely.' },
      collocations: ['the deposit refund', 'keep the deposit', 'lose the deposit'],
      example: { en: 'The deposit is held as credit rather than refunded in cash.', zh: '定金留作抵扣额度，不退现金。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈpɒz/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'pull up', sentenceIndex: 1,
      meaning: { zh: '调出（预约记录）', en: 'to open the booking system on screen' },
      usage: { zh: '可分短语；pull up the diary、pull up the record。', en: 'Separable: pull up the diary, pull up the record.' },
      example: { en: 'I will pull up the diary and check the weekend openings.', zh: '我调出预约簿，看看周末的空档。' },
    },
    {
      phrase: 'steer clear of', sentenceIndex: 26,
      meaning: { zh: '避开，不碰（禁忌项目）', en: 'to avoid something that is not safe or suitable' },
      usage: { zh: 'steer clear of something；健康建议高频。', en: 'Steer clear of something; common in health advice.' },
      example: { en: 'Pregnant guests steer clear of deep tissue massage.', zh: '孕妇避开深层组织按摩。' },
    },
    {
      phrase: 'carries a half charge', sentenceIndex: 29,
      meaning: { zh: '收取一半费用', en: 'to incur a charge equal to half the price' },
      usage: { zh: 'carry a charge；主语通常是迟到改约行为。', en: 'Carry a charge; the subject is usually the late change.' },
      example: { en: 'A late change carries a half charge for the session.', zh: '迟到改约收取半场费用。' },
    },
    {
      phrase: 'hold the rest as credit', sentenceIndex: 29,
      meaning: { zh: '保留抵扣额度，留作下次使用', en: 'to keep the money as credit for a later visit' },
      usage: { zh: 'retail 场景；hold the credit、put it on your account。', en: 'Retail usage: hold the credit, put it on your account.' },
      example: { en: 'We hold the rest as credit for a later visit instead of refunding cash.', zh: '我们把余额留作下次抵扣，不退现金。' },
    },
    {
      phrase: 'light lunch', sentenceIndex: 39,
      meaning: { zh: '清淡的简餐', en: 'a small, plain meal before a facial session' },
      usage: { zh: 'light 此处指清淡；a light lunch、a light meal。', en: 'Light means plain here: a light lunch, a light meal.' },
      example: { en: 'A light lunch works better than a heavy meal before the facial.', zh: '护理前吃清淡简餐比饱餐一顿更好。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看卷面已给单位', en: 'Check the printed unit on the note' },
      body: {
        zh: '第 2、3、5 题卷面已印 minutes、floor、hours notice，填空只写数字或修饰词。落笔前先看空格前后的单位，避免把 ninety minutes 整词抄进去超出词数限制。',
        en: 'Items 2, 3 and 5 already print minutes, floor and hours notice, so write the number or modifier only. Check the unit beside the gap before writing, so you do not copy the whole phrase and break the word limit.',
      },
    },
    {
      title: { zh: '禁忌项目抓否定短语', en: 'Catch banned items on negatives' },
      body: {
        zh: '第 9 题问孕妇禁忌，录音用 off the list、the one to avoid、remain fine 这类对比。听到否定或对比时记下两侧分别是什么，答案取被 avoid 的那一项，而被说成 fine 的面部与轻按摩是干扰。',
        en: 'Item 9 asks the pregnancy ban; the recording uses off the list, the one to avoid and remain fine. Note both sides of the comparison on a negative, and choose the avoided item, treating the fine facial and light massage as distractors.',
      },
    },
    {
      title: { zh: '复述段答案按题号顺序找', en: 'Follow the recap section in question order' },
      body: {
        zh: '单选六到十题在后半段复述中依次出现：套餐构成、咨询时长、更衣用品、禁忌按摩、迟到收费。听到 once more、again 这类复述信号时，按题号顺序在对应句找答案词，不要把上一题的细节填进下一题。',
        en: 'Singles 6 to 10 appear in order in the recap: package contents, consultation time, changing items, banned massage, late charge. At a recap signal such as once more, match the next question number in order, rather than carrying the previous detail forward.',
      },
    },
  ],
};
