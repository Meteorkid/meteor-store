import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 39 · Part 1 — 学员向社区中心报名急救课程。原创仿真材料，非官方真题。
 *
 * 对话围绕课程级别、时长、考核方式、证书有效期、团体优惠、人均费用、
 * 团体人数下限、付款期限与着装准备展开，中间穿插一次级别选择与设备用途的补充说明。
 */
export const test39Part1: ListeningLesson = {
  slug: 'test-39-part-1',
  part: 1,
  status: 'published',
  title: { zh: '报名急救课程', en: 'Signing up for a first-aid course' },
  summary: {
    zh: '学员致电社区中心报名下个月的急救课程：选标准级别而非高级班，课程为期两天，考核为现场实操演示，证书有效期三年；四人及以上享团体九折，人均费用四十英镑，需在开课前周五付款，上课时穿宽松衣物，手套与绷带由中心提供。',
    en: 'A caller signs up for a first-aid course at the community centre: the standard level rather than the advanced class, a two-day programme, a practical demonstration for assessment, a three-year certificate, a ten percent group discount for four or more people, a forty-pound fee per person, payment by the Friday before, and loose clothing while gloves and bandages are supplied.',
  },
  accent: { zh: '两位说话人均为澳式口音。', en: 'Both speakers use Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'visitor', label: 'VISITOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Course level', cells: [[{ blank: 1 }, { text: ' (not the advanced class)' }]] },
        { lead: 'Course lasts', cells: [[{ blank: 2 }, { text: ' days' }]] },
        { lead: 'Course meets on', cells: [[{ blank: 3 }, { text: ' and Sunday' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'How are candidates assessed on the course?',
          options: [
            { key: 'A', text: 'by a written paper at the end' },
            { key: 'B', text: 'by showing the practical skills to the trainer' },
            { key: 'C', text: 'by an online quiz after the weekend' },
          ],
        },
        {
          number: 5,
          stem: 'How long does the certificate remain valid?',
          options: [
            { key: 'A', text: 'two years' },
            { key: 'B', text: 'three years' },
            { key: 'C', text: 'five years' },
          ],
        },
        {
          number: 6,
          stem: 'What discount applies to a group booking?',
          options: [
            { key: 'A', text: 'ten percent off the standard fee' },
            { key: 'B', text: 'fifteen percent off the standard fee' },
            { key: 'C', text: 'twenty percent off the standard fee' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Minimum group size', cells: [[{ blank: 7 }, { text: ' people' }]] },
        { lead: 'Fee per person', cells: [[{ blank: 8 }, { text: ' pounds' }]] },
        { lead: 'Payment due by', cells: [[{ blank: 9 }]] },
        { lead: 'Wear loose', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['standard'], evidence: 3,
      explanation: {
        zh: '定位句 3：The standard course is the one we run each month for ordinary members of the public。来电者选的是标准班；advanced class 是句 1 提到的另一级别，不能填。',
        en: 'Sentence 3: "The standard course is the one we run each month for ordinary members of the public". The caller books the standard course; the advanced class mentioned in sentence 1 is the other level and is not the answer.',
      },
    },
    {
      number: 2, accepted: ['two', '2'], evidence: 5,
      explanation: {
        zh: '定位句 5：It runs over two days, with about six hours of teaching each day。课程为期两天；six hours 是每天课时，不是总天数，空格后已印 days。',
        en: 'Sentence 5: "It runs over two days, with about six hours of teaching each day". The course lasts two days; six hours is the daily teaching time, not the total days, and days is already printed.',
      },
    },
    {
      number: 3, accepted: ['Saturday'], evidence: 7,
      explanation: {
        zh: '定位句 7：The next group meets on Saturday and Sunday, the fourth and fifth of October。上课日为周六和周日；空格后已印 and Sunday，只填 Saturday。',
        en: 'Sentence 7: "The next group meets on Saturday and Sunday, the fourth and fifth of October". The course runs Saturday and Sunday; and Sunday is already printed, so write Saturday.',
      },
    },
    {
      number: 4, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：There is no written exam. You show the practical skills to the trainer on the day。考核是现场实操演示，对应 B。笔试在句 9 被明确否定，线上测验全段未出现。',
        en: 'Sentence 9: "There is no written exam. You show the practical skills to the trainer on the day". Assessment is a practical demonstration, matching B. A written paper is ruled out in sentence 9, and an online quiz never appears.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：The certificate lasts three years from the date you finish the course。证书有效期三年，对应 B。两年与五年在录音中没有依据。',
        en: 'Sentence 13: "The certificate lasts three years from the date you finish the course". The certificate is valid for three years, matching B. Two and five years have no basis in the recording.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：a group of four or more gets ten percent off the standard fee。团体优惠为九折，对应 A。十五与二十个百分点在全段都没有提到。',
        en: 'Sentence 17: "a group of four or more gets ten percent off the standard fee". The group discount is ten percent, matching A. Fifteen and twenty percent are never mentioned.',
      },
    },
    {
      number: 7, accepted: ['four', '4'], evidence: 19,
      explanation: {
        zh: '定位句 19：The minimum group size is four, and we can hold the places for a week。团体人数下限为四人；一周是留位时长，不是人数。',
        en: 'Sentence 19: "The minimum group size is four, and we can hold the places for a week". The minimum group size is four; the week is how long places are held, not the headcount.',
      },
    },
    {
      number: 8, accepted: ['forty', '40'], evidence: 21,
      explanation: {
        zh: '定位句 21：It is forty pounds each, and the group discount brings that down to thirty-six。原价每人四十英镑；thirty-six 是折后价，空格问的是标准费用。',
        en: 'Sentence 21: "It is forty pounds each, and the group discount brings that down to thirty-six". The standard fee is forty pounds each; thirty-six is the discounted price, while the gap asks for the standard fee.',
      },
    },
    {
      number: 9, accepted: ['Friday'], evidence: 23,
      explanation: {
        zh: '定位句 23：We prefer payment by Friday before the course, to confirm your places。付款期限为开课前周五；Wednesday 在句 31 是提交名单的日期，不是付款日。',
        en: 'Sentence 23: "We prefer payment by Friday before the course, to confirm your places". Payment is due by the Friday before the course; Wednesday in sentence 31 is the deadline for names, not the payment date.',
      },
    },
    {
      number: 10, accepted: ['clothing'], evidence: 25,
      explanation: {
        zh: '定位句 25：Wear loose clothing, and the centre provides gloves and bandages for the practice。学员穿宽松衣物；手套与绷带由中心提供，不是自带物品。',
        en: 'Sentence 25: "Wear loose clothing, and the centre provides gloves and bandages for the practice". Participants wear loose clothing; gloves and bandages are supplied, so they are not what to bring.',
      },
    },
  ],
  transcript: [
    { speaker: 'visitor', text: 'I am calling to sign up for a first-aid course that runs next month.' },
    { speaker: 'clerk', text: 'Good morning. Which course were you looking at, the advanced one or the standard first-aid?' },
    { speaker: 'visitor', text: 'The standard one, please. I have no medical background yet.' },
    { speaker: 'clerk', text: 'Right. The standard course is the one we run each month for ordinary members of the public.' },
    { speaker: 'visitor', text: 'How long does it take from start to finish?' },
    { speaker: 'clerk', text: 'It runs over two days, with about six hours of teaching each day.' },
    { speaker: 'visitor', text: 'Two days. Is it the weekend course or the weekday one?' },
    { speaker: 'clerk', text: 'The next group meets on Saturday and Sunday, the fourth and fifth of October.' },
    { speaker: 'visitor', text: 'Saturday and Sunday, that suits me. Now, how will we be assessed?' },
    { speaker: 'clerk', text: 'There is no written exam. You show the practical skills to the trainer on the day.' },
    { speaker: 'visitor', text: 'So it is a practical demonstration rather than a paper test?' },
    { speaker: 'clerk', text: 'Exactly. You practice bandaging, the recovery position and calling for help.' },
    { speaker: 'visitor', text: 'And once I pass, how long is the certificate valid for?' },
    { speaker: 'clerk', text: 'The certificate lasts three years from the date you finish the course.' },
    { speaker: 'visitor', text: 'Three years. Does it need to be renewed after that?' },
    { speaker: 'clerk', text: 'You take a shorter refresher, and the old certificate stays valid until the new one arrives.' },
    { speaker: 'visitor', text: 'I am asking with a group of friends, actually. Is there a discount for teams?' },
    { speaker: 'clerk', text: 'Yes, a group of four or more gets ten percent off the standard fee.' },
    { speaker: 'visitor', text: 'Ten percent, and how many people do we need to qualify?' },
    { speaker: 'clerk', text: 'The minimum group size is four, and we can hold the places for a week.' },
    { speaker: 'visitor', text: 'What is the fee per person for the standard course?' },
    { speaker: 'clerk', text: 'It is forty pounds each, and the group discount brings that down to thirty-six.' },
    { speaker: 'visitor', text: 'Thirty-six each after the discount. Can we pay on the day?' },
    { speaker: 'clerk', text: 'We prefer payment by Friday before the course, to confirm your places.' },
    { speaker: 'visitor', text: 'Friday, understood. Is there anything we need to bring ourselves?' },
    { speaker: 'clerk', text: 'Wear loose clothing, and the centre provides gloves and bandages for the practice.' },
    { speaker: 'visitor', text: 'Gloves and bandages are supplied, so I just bring comfortable clothes.' },
    { speaker: 'clerk', text: 'That is right. We also offer a workplace first-aid course for staff who need it at work.' },
    { speaker: 'visitor', text: 'Is that the advanced level you mentioned earlier?' },
    { speaker: 'clerk', text: 'It covers burns, choking and handling an unconscious casualty in a workplace setting.' },
    { speaker: 'visitor', text: 'Maybe another time. For now, please put me down for the standard weekend course.' },
    { speaker: 'clerk', text: 'I can reserve one place, but the group booking needs the four names by Wednesday.' },
    { speaker: 'visitor', text: 'I will send the names and the forty pounds each as soon as they confirm.' },
    { speaker: 'clerk', text: 'Good. Do you have any health condition we should know about before the bandaging practice?' },
    { speaker: 'visitor', text: 'Nothing that affects my hands, and I can kneel on the floor without trouble.' },
    { speaker: 'clerk', text: 'Fine. The trainer will go over emergency numbers on the first morning.' },
    { speaker: 'visitor', text: 'Will the course cover how to use an automatic defibrillator?' },
    { speaker: 'clerk', text: 'The standard course shows where the defibrillator is, but full training sits in the advanced class.' },
    { speaker: 'visitor', text: 'That matches what I needed. Thank you for explaining it all.' },
    { speaker: 'clerk', text: 'You are welcome. I will email the confirmation and the payment details today.' },
    { speaker: 'visitor', text: 'Perfect. I look forward to the Saturday start.' },
  ],
  vocabulary: [
    {
      term: 'standard', phonetic: '/ˈstændəd/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '标准的，基础级的', en: 'the basic level intended for ordinary members of the public' },
      usage: { zh: '修饰课程或级别；standard course、standard fee。反义 advanced。', en: 'Modifies a course or level: standard course, standard fee. The opposite is advanced.' },
      collocations: ['the standard course', 'the standard fee', 'standard level'],
      example: { en: 'The standard course suits people with no medical background.', zh: '标准班适合没有医学背景的学员。' },
      listening: { zh: '两个音节，重音在第一音节；澳式读音结尾 /əd/ 很轻。', en: 'Two syllables with stress on the first; the ending /əd/ is weak.' },
    },
    {
      term: 'assessed', phonetic: '/əˈsest/', partOfSpeech: 'v.', sentenceIndex: 8,
      meaning: { zh: '被考核，被评定是否通过', en: 'checked by a trainer to see whether a candidate has passed' },
      usage: { zh: '被动语态；be assessed on the day、how will we be assessed。名词 assessment。', en: 'Passive: be assessed on the day. The noun is assessment.' },
      collocations: ['be assessed', 'how we are assessed', 'assessed on the day'],
      example: { en: 'Now, how will we be assessed on the course?', zh: '那么我们在课程上会怎样被考核？' },
      listening: { zh: '两个音节，重音在第二音节 /ˈses/；结尾 /st/。', en: 'Two syllables with stress on the second; ending /st/.' },
    },
    {
      term: 'practical', phonetic: '/ˈpræktɪkl/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '实操的，动手练习的', en: 'involving doing skills rather than writing about them' },
      usage: { zh: '修饰演示或训练；practical demonstration、practical skills。名词 practice。', en: 'Modifies a demo or drill: practical demonstration, practical skills. The noun is practice.' },
      collocations: ['practical skills', 'a practical demonstration', 'practical training'],
      example: { en: 'The trainer watches each practical demonstration closely.', zh: '培训师仔细观看每一次实操演示。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /tɪ/ 弱读。', en: 'Three syllables with stress on the first; the middle /tɪ/ is reduced.' },
    },
    {
      term: 'certificate', phonetic: '/səˈtɪfɪkət/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '证书，结业证明', en: 'an official document showing a course has been passed' },
      usage: { zh: '可数；valid certificate、course certificate。动词 certify。', en: 'Countable: valid certificate, course certificate. The verb is certify.' },
      collocations: ['the certificate lasts', 'a valid certificate', 'issue a certificate'],
      example: { en: 'The certificate is dated from the final day of training.', zh: '证书日期从培训最后一天算起。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈtɪ/；结尾 /kət/ 轻读。', en: 'Four syllables with stress on the second; the ending /kət/ is reduced.' },
    },
    {
      term: 'refresher', phonetic: '/rɪˈfreʃə/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '复训，温习课程', en: 'a short course that updates skills already learned' },
      usage: { zh: '可数；a refresher course、take a refresher。动词 refresh。', en: 'Countable: a refresher course, take a refresher. The verb is refresh.' },
      collocations: ['a refresher course', 'take a refresher', 'a short refresher'],
      example: { en: 'After three years, you take a shorter refresher to renew the certificate.', zh: '三年后参加短期复训即可续证。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈfreʃ/；结尾 /ə/。', en: 'Three syllables with stress on the second; ending /ə/.' },
    },
    {
      term: 'discount', phonetic: '/ˈdɪskaʊnt/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '折扣，减价', en: 'a reduction from the standard price for a group or special case' },
      usage: { zh: '可数；ten percent discount、group discount。动词 discount 表打折。', en: 'Countable: ten percent discount, group discount. The verb means to reduce the price.' },
      collocations: ['a group discount', 'ten percent off', 'qualify for a discount'],
      example: { en: 'Four or more participants qualify for the group discount.', zh: '四人及以上可享团体折扣。' },
      listening: { zh: '名词重音在第一音节；动词重音可在第二音节，注意区分。', en: 'The noun stresses the first syllable; the verb may stress the second.' },
    },
    {
      term: 'bandaging', phonetic: '/ˈbændɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '包扎，绷带使用', en: 'the skill of wrapping a wound with a bandage' },
      usage: { zh: '不可数；practice bandaging、bandaging technique。名词 bandage 指绷带。', en: 'Uncountable: practice bandaging, bandaging technique. A bandage is the cloth itself.' },
      collocations: ['practice bandaging', 'bandaging practice', 'bandaging technique'],
      example: { en: 'The group practices bandaging on each other in pairs.', zh: '学员两人一组互相练习包扎。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /dɪ/ 弱读。', en: 'Three syllables with stress on the first; the middle /dɪ/ is reduced.' },
    },
  ],
  expressions: [
    {
      phrase: 'sign up for', sentenceIndex: 0,
      meaning: { zh: '报名参加（课程或活动）', en: 'to register to take part in a course or event' },
      usage: { zh: 'sign up for something；过去式 signed up。', en: 'Sign up for something; the past form is signed up.' },
      example: { en: 'I am calling to sign up for the first-aid course.', zh: '我打电话来报名急救课程。' },
    },
    {
      phrase: 'on the day', sentenceIndex: 9,
      meaning: { zh: '在（课程）当天', en: 'on the actual day the activity takes place' },
      usage: { zh: '时间短语；on the day of the course、show on the day。', en: 'A time phrase: on the day of the course.' },
      example: { en: 'You show the practical skills to the trainer on the day.', zh: '你在当天向培训师展示实操技能。' },
    },
    {
      phrase: 'valid for', sentenceIndex: 12,
      meaning: { zh: '有效期为……', en: 'acceptable or usable for a stated period' },
      usage: { zh: 'valid for 加时长；valid for three years。', en: 'Valid for plus period: valid for three years.' },
      example: { en: 'The certificate is valid for three years after finishing.', zh: '证书结业后有效期三年。' },
    },
    {
      phrase: 'brings that down', sentenceIndex: 21,
      meaning: { zh: '使（价格）降低', en: 'to reduce a price or cost' },
      usage: { zh: '可分短语动词；bring the fee down to thirty-six。', en: 'Separable: bring the fee down to thirty-six.' },
      example: { en: 'The group discount brings the fee down to thirty-six pounds.', zh: '团体折扣把费用降到三十六英镑。' },
    },
    {
      phrase: 'put me down for', sentenceIndex: 30,
      meaning: { zh: '把我登记为（参加者）', en: 'to record someone as a participant' },
      usage: { zh: '口语登记说法；put me down for the course。', en: 'An informal way to register: put me down for the course.' },
      example: { en: 'Please put me down for the standard weekend course.', zh: '请把我登记进标准周末班。' },
    },
    {
      phrase: 'go over', sentenceIndex: 35,
      meaning: { zh: '讲解，过一遍（内容）', en: 'to explain or review a set of points with a group' },
      usage: { zh: '及物短语动词；go over the numbers、go over the plan。', en: 'Transitive: go over the numbers, go over the plan.' },
      example: { en: 'The trainer will go over emergency numbers on the first morning.', zh: '培训师会在第一天上午讲解紧急电话。' },
    },
  ],
  tips: [
    {
      title: { zh: '先分清级别与课程类型', en: 'Split level from course type' },
      body: {
        zh: '第 1 题问级别，录音先并列 advanced 与 standard，来电者明确选 standard；第 27 句又引出 workplace 课程，那是另一门班，不要把 workplace 填进级别空。听前在题号旁标出“级别”还是“课程内容”。',
        en: 'Item 1 asks for the level. The recording first lists advanced and standard, and the caller chooses standard; sentence 27 introduces the workplace course, which is a separate class, so do not write workplace in the level gap. Mark level versus content beside the question first.',
      },
    },
    {
      title: { zh: '费用题区分原价与折后价', en: 'Separate the standard fee from the discount price' },
      body: {
        zh: '第 8 题问标准人均费用，句 21 先报 forty pounds，再用折扣降到 thirty-six；题干若写 standard fee 就填原价，写 discounted price 才填折后价。类似地，句 19 的 four 是人数，a week 是留位时长。',
        en: 'Item 8 asks for the standard fee. Sentence 21 first gives forty pounds, then the discount lowers it to thirty-six. Write the original price when the lead says standard fee, and the discounted price only if the lead says so. Likewise, four in sentence 19 is the headcount, while a week is the holding period.',
      },
    },
    {
      title: { zh: '考核题听被否定的形式', en: 'Listen for the ruled-out assessment format' },
      body: {
        zh: '第 4 题问考核方式，句 9 先说 There is no written exam，再给出实操演示；被否定的笔试形式正是干扰项 A。Part 1 常先排除一种形式再报答案，听到 no、rather than 时把对应选项划掉。',
        en: 'Item 4 asks the assessment format. Sentence 9 first states there is no written exam, then gives the practical demonstration; the ruled-out written format is distractor A. Part 1 often rejects one format before the answer; cross out the option after no or rather than.',
      },
    },
  ],
};
