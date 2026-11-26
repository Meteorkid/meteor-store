import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 46 · Part 1 — 参加者咨询品酒夜安排（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 对话围绕场次主题、是否含餐、酒量安排、年龄限制、取消期限展开，
 * 配对题考三类票（标准票、优惠票、团体票）分别适用哪条规则。
 */
export const test46Part1: ListeningLesson = {
  slug: 'test-46-part-1',
  part: 1,
  status: 'published',
  title: { zh: '报名品酒夜', en: 'Joining a wine-tasting evening' },
  summary: {
    zh: '参加者咨询下一场品酒夜：当晚以意大利葡萄酒为主题，提供面包奶酪橄榄的轻食而非正餐，每人五杯小样，年龄须满十八，周三前可免费取消。标准票须在线预订，优惠票带回纪念杯，团体票含半价嘉宾一位。',
    en: 'A caller asks about the next tasting evening: Italian wines are the theme, a light meal of bread, cheese and olives replaces a hot dinner, each guest gets five small pours, the minimum age is eighteen, and cancellation is free until Wednesday. The standard ticket is booked online, the premium ticket keeps a souvenir glass, and the group booking includes one half-price guest.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'visitor', label: 'VISITOR', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Evening theme: wines from', cells: [[{ blank: 1 }]] },
        { lead: 'Food included: a light', cells: [[{ blank: 2 }]] },
        { lead: 'Wine served per person: ', cells: [[{ blank: 3 }, { text: ' pours' }]] },
        { lead: 'Free cancellation before', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What food is provided with the ticket?',
          options: [
            { key: 'A', text: 'A hot three-course dinner' },
            { key: 'B', text: 'Cheese, bread and olives' },
            { key: 'C', text: 'Fruit salad and sweet cakes' },
          ],
        },
        {
          number: 6,
          stem: 'What is the minimum age for tasting wine?',
          options: [
            { key: 'A', text: 'Sixteen' },
            { key: 'B', text: 'Eighteen' },
            { key: 'C', text: 'Twenty-one' },
          ],
        },
        {
          number: 7,
          stem: 'What happens if cancellation is made after Wednesday?',
          options: [
            { key: 'A', text: 'The ticket moves to the next evening free.' },
            { key: 'B', text: 'A credit voucher is issued for half the fee.' },
            { key: 'C', text: 'The fee is not refundable.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each ticket type? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'includes a souvenir glass to take home' },
        { key: 'B', text: 'must be booked through the website' },
        { key: 'C', text: 'allows one guest to join at half price' },
        { key: 'D', text: 'cannot be passed on to another person' },
        { key: 'E', text: 'includes an extra second tasting session' },
      ],
      items: [
        { number: 8, text: 'standard ticket' },
        { number: 9, text: 'premium ticket' },
        { number: 10, text: 'group booking' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Italian'], evidence: 3,
      explanation: {
        zh: '定位句 3：The coming session is built around Italian wines, with reds from Tuscany and a couple of whites from the north。主题为意大利葡萄酒，填 Italian。句 1 的 community hall 是地点，不是主题。',
        en: 'Sentence 3: "The coming session is built around Italian wines, with reds from Tuscany and a couple of whites from the north". The theme is Italian wines, so write Italian. The community hall in sentence 1 is the venue, not the theme.',
      },
    },
    {
      number: 2, accepted: ['meal'], evidence: 5,
      explanation: {
        zh: '定位句 5：we serve a light meal of bread, cheese and olives between the pours。题目已给 light，填 meal；句 5 明确没有热晚餐，hot dinner 是被排除项。',
        en: 'Sentence 5: "we serve a light meal of bread, cheese and olives between the pours". Light is printed, so write meal. The hot dinner in sentence 5 is ruled out.',
      },
    },
    {
      number: 3, accepted: ['five', '5'], evidence: 7,
      explanation: {
        zh: '定位句 7：You will be offered five pours in total, and each one is a small taste rather than a full glass。每人五杯小样，five 与 5 都得分；full glass 是被对比的说法，不是答案。',
        en: 'Sentence 7: "You will be offered five pours in total, and each one is a small taste rather than a full glass". Five pours per person; five and 5 both fit. The full glass is the contrast, not the answer.',
      },
    },
    {
      number: 4, accepted: ['Wednesday'], evidence: 9,
      explanation: {
        zh: '定位句 9：You can cancel free of charge up to Wednesday, that is three days before the Friday session。免费取消期限为周三；Friday 是活动当天，不是截止日。',
        en: 'Sentence 9: "You can cancel free of charge up to Wednesday, that is three days before the Friday session". The free-cancel deadline is Wednesday; Friday is the event day, not the deadline.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：the cheese, bread and olives are the only food。提供奶酪、面包与橄榄，对应 B。句 5 否定热正餐，C 的水果沙拉与甜饼全段未出现。',
        en: 'Sentence 13: "the cheese, bread and olives are the only food", matching B. The hot dinner is rejected in sentence 5, and fruit salad or sweet cakes in C are never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：the age limit for tasters stays eighteen, with identification checked at the door。最低年龄为十八，对应 B。十六与二十一个在录音中没有依据。',
        en: 'Sentence 13: "the age limit for tasters stays eighteen, with identification checked at the door". The minimum age is eighteen, matching B. Sixteen and twenty-one have no basis in the recording.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 11,
      explanation: {
        zh: '定位句 11：Then the fee stays non-refundable, though you may pass the ticket to someone else。周三之后费用不退，对应 C。A 的免费改期与 B 的半额代金券在本段没有出现。',
        en: 'Sentence 11: "Then the fee stays non-refundable, though you may pass the ticket to someone else". After Wednesday the fee is non-refundable, matching C. The free reschedule in A and half voucher in B are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The standard ticket must be booked through the website。标准票须通过网站预订，对应 B。句 23 补充团体票才可电话预订，不归标准票。',
        en: 'Sentence 17: "The standard ticket must be booked through the website", matching B. Sentence 23 adds that only groups may phone, which does not apply to the standard ticket.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：The premium ticket lets you keep the souvenir glass at the end of the evening。优惠票带回纪念杯，对应 A。附品鉴笔记是额外说明，不是选项里的 E 第二场活动。',
        en: 'Sentence 19: "The premium ticket lets you keep the souvenir glass at the end of the evening", matching A. The extra tasting note is an aside, not the second session in E.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 21,
      explanation: {
        zh: '定位句 21：With four or more, one guest joins at half price, and the rest pay the standard rate。团体票含一位半价嘉宾，对应 C。D 的不可转让与 E 的第二场在介绍中没有归给团体票。',
        en: 'Sentence 21: "With four or more, one guest joins at half price, and the rest pay the standard rate", matching C. Non-transferability in D and the second session in E are not assigned to group bookings.',
      },
    },
  ],
  transcript: [
    { speaker: 'visitor', text: 'I saw the advertisement for a wine-tasting evening, and I have a few questions before I book.' },
    { speaker: 'clerk', text: 'Of course, it runs most Friday evenings at the community hall.' },
    { speaker: 'visitor', text: 'What sort of wines will you pour on the next night?' },
    { speaker: 'clerk', text: 'The coming session is built around Italian wines, with reds from Tuscany and a couple of whites from the north.' },
    { speaker: 'visitor', text: 'Italian, that sounds good. Does the ticket include a meal?' },
    { speaker: 'clerk', text: 'There is no hot dinner, but we serve a light meal of bread, cheese and olives between the pours.' },
    { speaker: 'visitor', text: 'Right, just the snacks then. How much wine does each person get?' },
    { speaker: 'clerk', text: 'You will be offered five pours in total, and each one is a small taste rather than a full glass.' },
    { speaker: 'visitor', text: 'Five pours, fine. What if I cannot make it after booking?' },
    { speaker: 'clerk', text: 'You can cancel free of charge up to Wednesday, that is three days before the Friday session.' },
    { speaker: 'visitor', text: 'After Wednesday?' },
    { speaker: 'clerk', text: 'Then the fee stays non-refundable, though you may pass the ticket to someone else.' },
    { speaker: 'visitor', text: 'So the evening suits people who prefer a light spread rather than a proper dinner.' },
    { speaker: 'clerk', text: 'Exactly, the cheese, bread and olives are the only food, and the age limit for tasters stays eighteen, with identification checked at the door.' },
    { speaker: 'visitor', text: 'Good to know. Tell me about the different tickets you sell.' },
    { speaker: 'clerk', text: 'We have a standard ticket, a premium ticket and a group booking for four people or more.' },
    { speaker: 'visitor', text: 'What does the standard ticket cover?' },
    { speaker: 'clerk', text: 'The standard ticket must be booked through the website, and it covers the tasting and the light snacks.' },
    { speaker: 'visitor', text: 'And the premium one?' },
    { speaker: 'clerk', text: 'The premium ticket lets you keep the souvenir glass at the end of the evening, and it includes an extra handout with tasting notes.' },
    { speaker: 'visitor', text: 'That suits people who collect glasses. What about the group booking?' },
    { speaker: 'clerk', text: 'With four or more, one guest joins at half price, and the rest pay the standard rate.' },
    { speaker: 'visitor', text: 'Can the group book by phone instead of online?' },
    { speaker: 'clerk', text: 'Groups can call the hall, but the standard ticket itself stays online only.' },
    { speaker: 'visitor', text: 'Do you provide water between the wines?' },
    { speaker: 'clerk', text: 'Yes, water and plain crackers are on every table, so guests can clear their palate.' },
    { speaker: 'visitor', text: 'Will there be someone explaining each wine?' },
    { speaker: 'clerk', text: 'A host talks through the region and the grape before each pour, and answers questions at the table.' },
    { speaker: 'visitor', text: 'I do not know much about Italian grapes, so that helps.' },
    { speaker: 'clerk', text: 'Beginners are welcome, and nobody is expected to identify the wine blind.' },
    { speaker: 'visitor', text: 'Is the hall wheelchair accessible?' },
    { speaker: 'clerk', text: 'The main entrance has a ramp, and there is an accessible toilet near the tasting room.' },
    { speaker: 'visitor', text: 'Great. How long does the evening run?' },
    { speaker: 'clerk', text: 'It starts at seven and finishes around half past nine, with fifteen minutes to settle in beforehand.' },
    { speaker: 'visitor', text: 'Half past nine, that is not too late for a work night.' },
    { speaker: 'clerk', text: 'We also run a Saturday afternoon session once a month for those who prefer the daytime.' },
    { speaker: 'visitor', text: 'One last question, can I take wine home with me?' },
    { speaker: 'clerk', text: 'Bottles are not included, but the shop next door sells the same labels at the evening price.' },
    { speaker: 'visitor', text: 'That is handy. I will check the website tonight and confirm the standard ticket.' },
    { speaker: 'clerk', text: 'Wonderful. You will get an email once the booking goes through, and the host can answer anything on the night.' },
    { speaker: 'visitor', text: 'Thanks for explaining it all.' },
  ],
  vocabulary: [
    {
      term: 'Italian', phonetic: '/ɪˈtæliən/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '意大利的（葡萄酒、美食）', en: 'coming from or relating to Italy' },
      usage: { zh: '修饰酒类与菜系；Italian wines、Italian grapes。名词 Italy。', en: 'Modifies wines and cuisine: Italian wines, Italian grapes. The noun is Italy.' },
      collocations: ['Italian wines', 'Italian grapes', 'an Italian evening'],
      example: { en: 'The next tasting focuses on Italian wines from Tuscany.', zh: '下一场品鉴聚焦托斯卡纳的意大利葡萄酒。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtæ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'pours', phonetic: '/pɔːz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '一小份斟倒的酒（小样）', en: 'a small amount of wine served in one tasting' },
      usage: { zh: '可数复数；five pours、a small pour。动词 pour 表斟倒。', en: 'Countable plural: five pours, a small pour. The verb is pour.' },
      collocations: ['five pours', 'a small pour', 'between the pours'],
      example: { en: 'Each guest receives five pours of different wines.', zh: '每位客人会得到五杯不同的小样酒。' },
      listening: { zh: '单音节，长元音 /ɔː/，复数结尾 /z/，与 pore（孔隙）同音。', en: 'One syllable with /ɔː/, plural ending /z/; a homophone of pore.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '身份证明（证件）', en: 'official documents that prove who you are' },
      usage: { zh: '口语常缩成 ID；show identification、check identification。', en: 'Often shortened to ID: show identification, check identification.' },
      collocations: ['check identification', 'some identification', 'photo identification'],
      example: { en: 'The host checks identification at the door.', zh: '主办方在门口查验身份证件。' },
      listening: { zh: '五个音节，重音在最后一个 /ˈkeɪ/，前面音节快速连读。', en: 'Five syllables with stress on the final /ˈkeɪ/.' },
    },
    {
      term: 'non-refundable', phonetic: '/ˌnɒn rɪˈfʌndəbl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '不可退款的', en: 'not paid back if the booking is cancelled' },
      usage: { zh: '修饰费用；fee is non-refundable。反义 refundable，名词 refund。', en: 'Modifies a fee: fee is non-refundable. The opposite is refundable; the noun is refund.' },
      collocations: ['non-refundable fee', 'non-refundable deposit', 'remain non-refundable'],
      example: { en: 'The booking fee stays non-refundable after Wednesday.', zh: '周三之后预订费用不予退还。' },
      listening: { zh: '重音在 fund 音节 /ˈfʌn/，开头 non 弱读。', en: 'Stress the fund syllable; the opening non is reduced.' },
    },
    {
      term: 'premium', phonetic: '/ˈpriːmiəm/', partOfSpeech: 'adj.', sentenceIndex: 19,
      meaning: { zh: '优惠的，高端的（较高票价档）', en: 'a higher-priced option with extra benefits' },
      usage: { zh: 'premium ticket、premium package；名词 premium 指额外费用。', en: 'premium ticket, premium package; as a noun it means an extra charge.' },
      collocations: ['the premium ticket', 'premium rate', 'a premium option'],
      example: { en: 'The premium ticket includes a souvenir glass.', zh: '高端票包含一只纪念杯。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpriː/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'souvenir', phonetic: '/ˌsuːvəˈnɪə/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '纪念品，留念物', en: 'an object kept to remember an event or place' },
      usage: { zh: '可数；souvenir glass、a souvenir from the evening。', en: 'Countable: souvenir glass, a souvenir from the evening.' },
      collocations: ['a souvenir glass', 'a souvenir bottle', 'take home a souvenir'],
      example: { en: 'Guests keep the souvenir glass after the tasting.', zh: '品鉴结束后客人可留下纪念杯。' },
      listening: { zh: '三个音节，重音在第三音节 /ˈnɪə/。', en: 'Three syllables with stress on the final.' },
    },
    {
      term: 'palate', phonetic: '/ˈpælət/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '味觉，口腔品鉴感受', en: 'the sense of taste used when judging wine' },
      usage: { zh: '不可数；clear the palate、a sensitive palate。', en: 'Uncountable: clear the palate, a sensitive palate.' },
      collocations: ['clear the palate', 'a clean palate', 'the wine palate'],
      example: { en: 'Water and crackers clear the palate between wines.', zh: '水和饼干在不同酒之间清口。' },
      listening: { zh: '两个音节，结尾 /ət/ 很轻，不要读成 plate。', en: 'Two syllables with a soft final /ət/; do not say plate.' },
    },
  ],
  expressions: [
    {
      phrase: 'booked through', sentenceIndex: 17,
      meaning: { zh: '通过（某渠道）预订', en: 'to reserve something using a particular channel' },
      usage: { zh: '后接渠道；booked through the website、booked through the desk。', en: 'Followed by the channel: booked through the website, booked through the desk.' },
      example: { en: 'The standard ticket must be booked through the website.', zh: '标准票必须通过网站预订。' },
    },
    {
      phrase: 'pass the ticket to', sentenceIndex: 11,
      meaning: { zh: '把票转给（他人）', en: 'to give a booking or ticket to another person' },
      usage: { zh: 'pass something to somebody；可分短语，代词放中间：pass it to。', en: 'pass something to somebody; separable: pass it to.' },
      example: { en: 'You may pass the ticket to a friend after Wednesday.', zh: '周三之后你可以把票转给朋友。' },
    },
    {
      phrase: 'clear their palate', sentenceIndex: 25,
      meaning: { zh: '清口，清除上一道酒的余味', en: 'to remove the previous taste before the next wine' },
      usage: { zh: 'clear the palate；crackers 与 water 常用于清口。', en: 'clear the palate; crackers and water are used for this.' },
      example: { en: 'Plain crackers help guests clear their palate.', zh: '原味饼干帮客人清口。' },
    },
    {
      phrase: 'identify the wine blind', sentenceIndex: 29,
      meaning: { zh: '不看标签盲品辨认葡萄酒', en: 'to name a wine without seeing its label' },
      usage: { zh: 'blind 此处指不看标签；a blind tasting 是盲品会。', en: 'Here blind means without the label; a blind tasting is a label-free session.' },
      example: { en: 'Beginners do not have to identify the wine blind.', zh: '初学者不必盲品辨认葡萄酒。' },
    },
    {
      phrase: 'settle in', sentenceIndex: 33,
      meaning: { zh: '安顿下来，就座准备', en: 'to get comfortable before an event starts' },
      usage: { zh: '表示就座安顿；settle in beforehand、settle into your seat。', en: 'Means getting seated: settle in beforehand, settle into your seat.' },
      example: { en: 'Guests have fifteen minutes to settle in before the first pour.', zh: '上第一杯前客人有十五分钟就座准备。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格先按行锁定关键词', en: 'Locate the row by keyword first' },
      body: {
        zh: '配对题的三类票在原文按标准票、优惠票、团体票顺序出现。听之前在物品旁写下关键词，听到 ticket、premium、group 时回到对应行，再记规则，不要听到什么选什么。',
        en: 'The three ticket types appear in order: standard, premium and group. Note a keyword beside each item before listening, and return to that row when ticket, premium or group is mentioned.',
      },
    },
    {
      title: { zh: '数字题区分总量与附加', en: 'Separate totals from extras' },
      body: {
        zh: '五杯是每人酒量，周三是取消期限，二者不属于同一空格。听到数字先判断这是数量、时刻还是截止日，再落笔；句 33 的十五分钟是入场准备，不是品酒时长。',
        en: 'Five is the amount of wine; Wednesday is the cancellation deadline. Decide whether each number is a quantity, a time or a deadline. The fifteen minutes in sentence 33 is arrival settling time, not the tasting length.',
      },
    },
    {
      title: { zh: '被否定的形式直接划掉', en: 'Cross out rejected formats' },
      body: {
        zh: '第 5 题先否定热正餐，第 7 题说明费用不退。听到 no、non-refundable、though 这类词时，把对应干扰选项划掉，避免在多选题式配对里反复犹豫。',
        en: 'Item 5 first rejects the hot dinner, and item 7 states the fee is non-refundable. Cross distractors out after no, non-refundable or though, so you do not revisit them in matching.',
      },
    },
  ],
};
