import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 3 · Part 1 — 健身房入会咨询（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 来电者先以为 off-peak 更便宜，接待员在句 18 纠正：不含泳池，加购后价格差不多。
 * 表单填空 1–4 按对话顺序出现，单选 5–7 落在档位、入馆引导与泳池规则，表格 8–10 是课程表。
 */
export const test03Part1: ListeningLesson = {
  slug: 'test-03-part-1',
  part: 1,
  status: 'published',
  title: { zh: '健身房入会咨询', en: 'Enrolling at a fitness centre' },
  summary: {
    zh: '来电者致电健身房咨询入会：姓名、起始日期、入会费与月费，接待员纠正他对优惠档位的误解，并介绍入馆引导、泳池规则和可选课程。',
    en: 'A caller phones a fitness centre to join: his name, the start date, the joining fee and the monthly fee. The receptionist corrects his assumption about the cheaper rate, then explains the induction, the pool rules and the classes on offer.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Membership starts', cells: [[{ blank: 2 }]] },
        { lead: 'Joining fee', cells: [[{ text: '£' }, { blank: 3 }]] },
        { lead: 'Monthly fee', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'Which membership does the caller choose in the end?',
          options: [
            { key: 'A', text: 'the off-peak membership' },
            { key: 'B', text: 'the standard peak membership' },
            { key: 'C', text: 'the family membership' },
          ],
        },
        {
          number: 6,
          stem: 'What does the receptionist say about the induction?',
          options: [
            { key: 'A', text: 'It is optional for experienced members.' },
            { key: 'B', text: 'It must be completed by every new member.' },
            { key: 'C', text: 'It costs forty-five pounds extra.' },
          ],
        },
        {
          number: 7,
          stem: 'What must members do before using the swimming pool?',
          options: [
            { key: 'A', text: 'Book a lane in advance.' },
            { key: 'B', text: 'Buy a swim cap at reception.' },
            { key: 'C', text: 'Shower before entering the water.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Class', 'Instructor', 'Day'],
      rows: [
        { lead: 'Beginner yoga', cells: [[{ blank: 8 }], [{ text: 'Tuesday' }]] },
        { lead: 'Spinning', cells: [[{ text: 'Mark' }], [{ blank: 9 }]] },
        { lead: { blank: 10 }, cells: [[{ text: 'Mark' }], [{ text: 'Saturday' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Hollis'], evidence: 4,
      explanation: {
        zh: '定位句 4：来电者逐字母拼出 Hollis。先写下首字母 H，再跟着读音补；注意双 L，不要写成 Holis。',
        en: 'Sentence 4: the caller spells the surname out as H, O, double L, I, S. Write the first letter and fill in the rest; watch the double L and do not write Holis.',
      },
    },
    {
      number: 2, accepted: ['5 October', 'October 5'], spoken: 'the fifth of October', evidence: 8,
      explanation: {
        zh: '定位句 8：The fifth of October works well for me。句 7 的 the beginning of next month 只是泛指，不是具体起始日；日期按英式 5 October 书写。',
        en: 'Sentence 8: "The fifth of October works well for me". The beginning of next month in sentence 7 is only a general reference, not the actual start date. Write it in British date order.',
      },
    },
    {
      number: 3, accepted: ['45'], spoken: 'forty-five pounds', evidence: 12,
      explanation: {
        zh: '定位句 12：It’s forty-five pounds。这是一次性入会费；句 16 的 twenty-two 是 off-peak 月费，句 14 的 twenty-eight 是标准月费，都不是入会费。',
        en: 'Sentence 12: "It’s forty-five pounds". This is the one-off joining fee. Twenty-two in sentence 16 is the off-peak monthly rate, and twenty-eight in sentence 14 is the standard monthly fee; neither is the joining fee.',
      },
    },
    {
      number: 4, accepted: ['28'], spoken: 'twenty-eight pounds', evidence: 14,
      explanation: {
        zh: '定位句 14：The standard membership is twenty-eight pounds a month。空格前已印 £，只填数字；twenty-two 是被否定的 off-peak 价格，四十分钟是引导时长，都不是月费。',
        en: 'Sentence 14: "The standard membership is twenty-eight pounds a month". The pound sign is already printed, so write the number only. Twenty-two is the rejected off-peak price, and forty minutes is the induction length.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Right, so standard it is。来电者句 15 先问 off-peak，容易误选 A；接待员句 18 指出 off-peak 不含泳池，加购后价格差不多，他才改选标准档。',
        en: 'Sentence 19: "Right, so standard it is". The caller asks about off-peak in sentence 15, which points to A, but sentence 18 explains that off-peak excludes the pool and costs about the same once pool charges are added, so he chooses the standard rate.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：It is compulsory for everyone, I’m afraid, even experienced members。compulsory 对应 must be completed；A 与句中 even experienced members 相反，C 错在引导已含在入会费内（句 20）。',
        en: 'Sentence 22: "It is compulsory for everyone, I’m afraid, even experienced members". Compulsory matches must be completed. A contradicts even experienced members, and C is wrong because the induction is included in the joining fee, as sentence 20 states.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：You must shower before you get in。A 错在句中明确说 lane booking isn’t required；B 错在泳帽由前台免费提供（句 26），不需要购买。',
        en: 'Sentence 24: "You must shower before you get in". A is wrong because lane booking is not required, and B is wrong because swim caps are provided free at reception, as sentence 26 explains.',
      },
    },
    {
      number: 8, accepted: ['Dana'], evidence: 29,
      explanation: {
        zh: '定位句 29：On Tuesdays we have beginner yoga, run by Dana。先用表格首列 Beginner yoga 和 Day 列的 Tuesday 锁定这一行，再等教练名字。',
        en: 'Sentence 29: "On Tuesdays we have beginner yoga, run by Dana". Use Beginner yoga in the first column and Tuesday in the day column to locate the row, then wait for the instructor’s name.',
      },
    },
    {
      number: 9, accepted: ['Thursday'], evidence: 31,
      explanation: {
        zh: '定位句 31：Then on Thursday evenings there’s spinning in studio two。首列 Spinning、教练 Mark 已给出，缺的是星期；studio two 是地点，不是答案。',
        en: 'Sentence 31: "Then on Thursday evenings there’s spinning in studio two". Spinning and Mark are already in the row, so the missing item is the day. Studio two is the room, not the answer.',
      },
    },
    {
      number: 10, accepted: ['core stretch'], evidence: 33,
      explanation: {
        zh: '定位句 33：there’s an easier option on Saturday mornings, which is a core stretch class。首列是课程名，Mark 和 Saturday 已在该行，按行找两个词的课程名。',
        en: 'Sentence 33: "there’s an easier option on Saturday mornings, which is a core stretch class". The first column holds the class name; Mark and Saturday are already printed, so the two-word name is what you need.',
      },
    },
  ],
  transcript: [
    { speaker: 'caller', text: 'Hello, I’m ringing to ask about joining the gym, and to book an introductory session if I can.' },
    { speaker: 'receptionist', text: 'Good morning, Riverside Fitness Centre. How can I help you?' },
    { speaker: 'receptionist', text: 'Of course. Let me take a few details first, and then I can walk you through the options.' },
    { speaker: 'receptionist', text: 'Could I have your surname, please?' },
    { speaker: 'caller', text: 'It’s Hollis. That’s H, O, double L, I, S.' },
    { speaker: 'receptionist', text: 'H, O, double L, I, S. Thank you. And may I call you by your first name?' },
    { speaker: 'caller', text: 'It’s Tom.' },
    { speaker: 'receptionist', text: 'Thanks, Tom. When would you like to start? We’ve got places open from the beginning of next month.' },
    { speaker: 'caller', text: 'I’m away the last week of September, so could it begin after that? The fifth of October works well for me.' },
    { speaker: 'receptionist', text: 'The fifth of October. That’s a Monday, so that’s fine. I’ll put that down.' },
    { speaker: 'receptionist', text: 'Now, before I go into the monthly fees, there’s a one-off joining fee, which covers your registration and a tour of the equipment.' },
    { speaker: 'caller', text: 'Is that something I have to pay right away?' },
    { speaker: 'receptionist', text: 'No, it goes on your first invoice. It’s forty-five pounds, and it’s waived for students, but I take it you’re not a student.' },
    { speaker: 'caller', text: 'No, I work in an office.' },
    { speaker: 'receptionist', text: 'Right. Then you pay the monthly fee on top of that. The standard membership is twenty-eight pounds a month, and it covers the gym floor, the pool and all the group classes.' },
    { speaker: 'caller', text: 'Twenty-eight. I was hoping for something cheaper. Is there an off-peak rate that lets you come outside the rush hours?' },
    { speaker: 'receptionist', text: 'There is, but it’s only twenty-two pounds a month, and it doesn’t include the pool. You’d pay separately every time you swam.' },
    { speaker: 'caller', text: 'Oh, that changes things. I came mainly because I want to use the pool, actually.' },
    { speaker: 'receptionist', text: 'Then the standard peak membership is the one for you. The off-peak deal looks cheaper on paper, but once you add the pool charges it works out about the same.' },
    { speaker: 'caller', text: 'Right, so standard it is.' },
    { speaker: 'receptionist', text: 'Good. You’ll need a short induction before you use the weights area. It lasts about forty minutes, and it’s included in the joining fee.' },
    { speaker: 'caller', text: 'Is it compulsory? I’ve used gyms before.' },
    { speaker: 'receptionist', text: 'It is compulsory for everyone, I’m afraid, even experienced members, so the team can check your posture on the main machines.' },
    { speaker: 'caller', text: 'Fair enough. And what about the swimming pool itself? Are there any rules I should know?' },
    { speaker: 'receptionist', text: 'Yes. You must shower before you get in, and you have to wear a swim cap. Lane booking isn’t required, because the lanes are open on a first-come basis.' },
    { speaker: 'caller', text: 'A swim cap. I didn’t realise those were needed here.' },
    { speaker: 'receptionist', text: 'They’re provided free at the reception desk, so you don’t have to bring your own.' },
    { speaker: 'caller', text: 'That’s a relief. Now, what classes are included? I’d like to go to a couple each week.' },
    { speaker: 'receptionist', text: 'All group classes are covered by your membership, but you reserve a spot on the app the day before.' },
    { speaker: 'receptionist', text: 'On Tuesdays we have beginner yoga, run by Dana, in studio one.' },
    { speaker: 'caller', text: 'Dana, right.' },
    { speaker: 'receptionist', text: 'Then on Thursday evenings there’s spinning in studio two, led by Mark. It’s quite high intensity, so bring a towel.' },
    { speaker: 'caller', text: 'I’m not sure I’m ready for that.' },
    { speaker: 'receptionist', text: 'Well, there’s an easier option on Saturday mornings, which is a core stretch class, also with Mark, and it’s free to drop in without booking.' },
    { speaker: 'caller', text: 'That sounds more like it.' },
    { speaker: 'receptionist', text: 'Let me check the pool opening times while you’re here. It opens at six thirty on weekdays, and at eight on weekends.' },
    { speaker: 'caller', text: 'And the gym floor?' },
    { speaker: 'receptionist', text: 'The gym floor follows the same hours, but the weights area closes ten minutes earlier for cleaning.' },
    { speaker: 'caller', text: 'Fine. Is there anything I need to bring on my first day?' },
    { speaker: 'receptionist', text: 'Just a pair of training shoes and a towel. Water bottles are sold at the front desk, and lockers take a one-pound coin, which you get back.' },
    { speaker: 'caller', text: 'A one-pound coin. I’ll remember that.' },
    { speaker: 'receptionist', text: 'One last thing. We run a short survey after your first month, and it helps us plan the classes.' },
    { speaker: 'caller', text: 'Of course.' },
    { speaker: 'receptionist', text: 'Right, Tom. Your membership starts on the fifth of October, standard rate, twenty-eight pounds a month, with the forty-five pound joining fee.' },
    { speaker: 'caller', text: 'That all sounds correct.' },
    { speaker: 'receptionist', text: 'I’ll email the confirmation and the induction booking link. Is there anything else?' },
    { speaker: 'caller', text: 'No, that’s everything. Thanks very much for your help.' },
    { speaker: 'receptionist', text: 'You’re welcome. See you on the fifth.' },
  ],
  vocabulary: [
    {
      term: 'joining', phonetic: '/ˈdʒɔɪnɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '入会的，注册的（joining fee 指一次性入会费）', en: 'paid once when you register; a joining fee is the one-off registration charge' },
      usage: { zh: '常与 fee、form、procedure 搭配；区别于 monthly fee（月费）。', en: 'Often with fee, form and procedure. Compare monthly fee, the recurring charge.' },
      collocations: ['a joining fee', 'the joining procedure', 'waive the joining fee'],
      example: { en: 'The joining fee covers your registration and equipment tour.', zh: '入会费包含注册登记和设备参观。' },
      listening: { zh: '读 /ˈdʒɔɪnɪŋ/，结尾的 /ɪŋ/ 不要漏成 /ɪn/。', en: 'Listen for the final /ɪŋ/, which is not reduced to /ɪn/.' },
    },
    {
      term: 'waived', phonetic: '/weɪvd/', partOfSpeech: 'v.', sentenceIndex: 12,
      meaning: { zh: '被免除，被免收（费用）', en: 'not charged, when a fee is cancelled for a particular group' },
      usage: { zh: '被动形式 be waived for somebody；学生、老年人常被免收某项费用。', en: 'Passive: be waived for somebody. Students and pensioners are often exempt.' },
      collocations: ['fees are waived', 'waived for students', 'partially waived'],
      example: { en: 'The booking charge is waived for members under eighteen.', zh: '十八岁以下会员免收预订费。' },
      listening: { zh: '与 wave（挥手）同音，靠后面的 for students 判断是“免收”。', en: 'A homophone of wave; the phrase for students points to the fee meaning.' },
    },
    {
      term: 'off-peak', phonetic: '/ˌɒf ˈpiːk/', partOfSpeech: 'adj.', sentenceIndex: 15,
      meaning: { zh: '非高峰时段的', en: 'available at times when fewer people use a service, usually cheaper' },
      usage: { zh: '与 peak（高峰）相对；off-peak rate、off-peak ticket。', en: 'The opposite of peak: an off-peak rate or ticket.' },
      collocations: ['an off-peak rate', 'off-peak travel', 'off-peak hours'],
      example: { en: 'Off-peak tickets are valid after nine thirty on weekdays.', zh: '非高峰票在工作日九点半之后生效。' },
      listening: { zh: '复合词重音在 peak，off 轻读。', en: 'Stress falls on peak; off is reduced.' },
    },
    {
      term: 'compulsory', phonetic: '/kəmˈpʌlsəri/', partOfSpeech: 'adj.', sentenceIndex: 22,
      meaning: { zh: '强制的，必须做的', en: 'required by rules, with no choice to opt out' },
      usage: { zh: '正式用语；同义的 mandatory 更常用于规定条款。反义是 optional。', en: 'Formal; mandatory is close in official rules. The opposite is optional.' },
      collocations: ['compulsory for everyone', 'compulsory training', 'compulsory subject'],
      example: { en: 'Safety training is compulsory before you enter the site.', zh: '进场前安全培训是强制要求。' },
      listening: { zh: '重音在第二音节 /ˈpʌl/，注意不要和 comparable 混。', en: 'Stress the second syllable; do not confuse it with comparable.' },
    },
    {
      term: 'induction', phonetic: '/ɪnˈdʌkʃn/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '入职引导，新成员培训', en: 'a short training session that shows new members how to use a facility' },
      usage: { zh: '健身房、职场高频词；an induction session、induction day。', en: 'Common in gyms and workplaces: an induction session, an induction day.' },
      collocations: ['the induction session', 'complete the induction', 'induction day'],
      example: { en: 'You must finish the induction before using the machines.', zh: '使用器械前必须完成引导培训。' },
      listening: { zh: '重音在第二音节 /ˈdʌk/，五个音节整体轻快。', en: 'Stress the second syllable and keep the rest light.' },
    },
    {
      term: 'posture', phonetic: '/ˈpɒstʃə/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '姿势，体态', en: 'the position in which you hold your body when standing or exercising' },
      usage: { zh: '可数或不可数；check your posture、good posture。', en: 'Countable or uncountable: check your posture, good posture.' },
      collocations: ['correct your posture', 'good posture', 'poor posture'],
      example: { en: 'The trainer corrected my posture on the squat.', zh: '教练纠正了我深蹲时的姿势。' },
      listening: { zh: '英音 /ˈpɒstʃə/，美音常带卷舌，注意和 poster（海报）区分。', en: 'British /ˈpɒstʃə/; do not confuse it with poster.' },
    },
    {
      term: 'studio', phonetic: '/ˈstjuːdiəʊ/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '练习室，工作室（studio one 指一号操房）', en: 'a room designed for a particular activity such as yoga or dance' },
      usage: { zh: '健身房语境里指操房；另有“录音室、摄影棚”之义。', en: 'In a gym it means an exercise room; elsewhere it is a recording or photo studio.' },
      collocations: ['studio one', 'a dance studio', 'fitness studio'],
      example: { en: 'The yoga class meets in studio one every Tuesday.', zh: '瑜伽课每周二在一号操房上。' },
      listening: { zh: '三个音节，重音在第一个，结尾是 /əʊ/。', en: 'Three syllables, stressed on the first, ending in /əʊ/.' },
    },
    {
      term: 'drop in', phonetic: '/drɒp ɪn/', partOfSpeech: 'phr. v.', sentenceIndex: 33,
      meaning: { zh: '顺路参加，无须预约就加入', en: 'to attend an event without booking a place in advance' },
      usage: { zh: '不及物；drop-in 作形容词：a drop-in session。', en: 'Intransitive; the adjective form is drop-in: a drop-in session.' },
      collocations: ['drop in without booking', 'a drop-in class', 'drop in for a coffee'],
      example: { en: 'You can drop in on the Saturday class without reserving a spot.', zh: '周六的课可以直接来，不用预约。' },
      listening: { zh: 'drop 的 /p/ 与 in 连读，听起来像一个双音节词。', en: 'The /p/ in drop links to in, sounding like one two-syllable word.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 2,
      meaning: { zh: '逐项给你讲解', en: 'to explain something step by step' },
      usage: { zh: '及物短语动词；walk somebody through the options、the form。', en: 'Transitive: walk somebody through the options or the form.' },
      example: { en: 'I’ll walk you through the booking process on the phone.', zh: '我在电话里一步步带你走完预订流程。' },
    },
    {
      phrase: 'on top of', sentenceIndex: 14,
      meaning: { zh: '除……之外（还）', en: 'in addition to something already mentioned' },
      usage: { zh: '费用场景高频；on top of the joining fee, you pay the monthly fee。', en: 'Common with charges: on top of the fee you pay the monthly amount.' },
      example: { en: 'There is a ten-pound booking fee on top of the ticket price.', zh: '票价之外还有十镑预订费。' },
    },
    {
      phrase: 'on paper', sentenceIndex: 18,
      meaning: { zh: '从纸面上看，理论上', en: 'according to what the figures say, before real use is considered' },
      usage: { zh: '常与 looks cheaper、sounds good 搭配，暗示实际未必如此。', en: 'Often with looks cheaper or sounds good, hinting the reality differs.' },
      example: { en: 'The offer looks cheap on paper, but there are hidden charges.', zh: '这个报价纸面上很便宜，但有隐藏收费。' },
    },
    {
      phrase: 'works out about the same', sentenceIndex: 18,
      meaning: { zh: '算下来差不多', en: 'when you add everything up, the total is nearly identical' },
      usage: { zh: 'work out 表示“核算结果是”；后接 at a price 或 about the same。', en: 'Work out means to amount to; follow with at a price or about the same.' },
      example: { en: 'The two plans work out about the same over a year.', zh: '两个方案一年下来花费差不多。' },
    },
    {
      phrase: 'first-come basis', sentenceIndex: 24,
      meaning: { zh: '先到先得的原则', en: 'arranged in the order people arrive, with no booking' },
      usage: { zh: '常见搭配 on a first-come basis 或 first-come, first-served。', en: 'Usually on a first-come basis, or the phrase first-come, first-served.' },
      example: { en: 'The chairs are allocated on a first-come basis.', zh: '座椅按先到先得安排。' },
    },
    {
      phrase: 'that sounds more like it', sentenceIndex: 34,
      meaning: { zh: '这才更合我意', en: 'that is much closer to what I wanted' },
      usage: { zh: '口语表达，用于否定上一项、认可新选项；语气轻松。', en: 'Spoken approval after rejecting the previous option.' },
      example: { en: 'An easy evening walk? That sounds more like it.', zh: '轻松的晚间散步？这才比较合我心意。' },
    },
    {
      phrase: 'get back', sentenceIndex: 39,
      meaning: { zh: '取回，拿回（押金退还）', en: 'to receive something back that you paid as a deposit' },
      usage: { zh: 'get back your coin、get back the deposit；也指“回复”。', en: 'get back your coin or deposit; it also means to reply.' },
      example: { en: 'You get the locker coin back when you return the key.', zh: '还钥匙时就能取回储物柜的硬币押金。' },
    },
  ],
  tips: [
    {
      title: { zh: '先分辨一次性费用和循环费用', en: 'Separate one-off and recurring fees' },
      body: {
        zh: 'Part 1 价格题常把入会费、月费、课程费混在一起。听到 joining fee、one-off 记一次性；monthly、a month 记循环价格；先在表单旁标注费用类型，再落笔数字。',
        en: 'Part 1 fee items mix joining fees, monthly charges and class prices. Mark one-off charges when you hear joining fee or one-off, and recurring prices when you hear monthly or a month. Label the type before you write the number.',
      },
    },
    {
      title: { zh: '纠正之后才是答案', en: 'The corrected version wins' },
      body: {
        zh: '来电者句 15 以为 off-peak 便宜，接待员句 18 用 but 纠正：不含泳池、加购后差不多。听到 but、actually、that changes things 时，准备划掉先前记下的选项。',
        en: 'The caller assumes off-peak is cheaper, but sentence 18 opens with but and corrects him. When you hear but, actually or that changes things, be ready to cross out the earlier option.',
      },
    },
    {
      title: { zh: '表格题先按行锁定，再缺什么听什么', en: 'Locate the row first, then the missing cell' },
      body: {
        zh: '课程表先用已印的 Class 和 Instructor 找行，缺 Day 就只等星期；不要把 studio two、Mark 这类已给信息当答案。听之前看清每行缺的是哪一列。',
        en: 'For the class table, use the printed Class and Instructor to find the row; if Day is missing, wait only for a weekday. Do not write studio two or Mark, which are already printed. Check which column is missing before the recording.',
      },
    },
  ],
};
