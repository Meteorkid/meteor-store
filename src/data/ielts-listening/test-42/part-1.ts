import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 42 · Part 1 — 顾客咨询加入羽毛球俱乐部（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：可选场地时段 → 搭档安排 → 球费分摊 → 教练课时长 → 访客次数（填空块），
 * 后半段再谈场地提供物、订场频次、自带物品、访客规则与迟到取消（单选块）。
 * 题块顺序与录音顺序一致。
 */
export const test42Part1: ListeningLesson = {
  slug: 'test-42-part-1',
  part: 1,
  status: 'published',
  title: { zh: '加入羽毛球俱乐部', en: 'Joining a badminton club' },
  summary: {
    zh: '一位顾客咨询加入羽毛球俱乐部：可选周六上午场地、俱乐部按水平匹配搭档、四人分摊球费、新会员一节一小时教练课、每赛季三次免费访客；后半段了解场地提供物、每周订场次数、自带装备、访客重复规则与迟到取消的费用处理。',
    en: 'A customer asks about joining a badminton club: the Saturday morning court, partner matching by standard, a four-player fee split, a one-hour coaching session for new members, and three free visitor passes per season; later he learns what the club provides, weekly booking limits, what to bring, repeat visitor rules, and late cancellation charges.',
  },
  accent: { zh: '顾客为美式口音，俱乐部接待为澳式多语言口音。', en: 'The customer speaks with an American accent and the club representative with an Australian multilingual accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'rep', label: 'REP', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Court day: morning', cells: [[{ blank: 1 }]] },
        { lead: 'Club finds a partner of similar', cells: [[{ blank: 2 }]] },
        { lead: 'Court fee split between the', cells: [[{ blank: 3 }, { text: ' players.' }]] },
        { lead: 'Coaching session lasts one', cells: [[{ blank: 4 }]] },
        { lead: 'Free visitors per season: ', cells: [[{ blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the club provide on court?',
          options: [
            { key: 'A', text: 'Rackets for every player.' },
            { key: 'B', text: 'Shuttles and water.' },
            { key: 'C', text: 'Towels for the break.' },
          ],
        },
        {
          number: 7,
          stem: 'How often can members book courts?',
          options: [
            { key: 'A', text: 'One court per week.' },
            { key: 'B', text: 'Two courts each day.' },
            { key: 'C', text: 'Only at weekends.' },
          ],
        },
        {
          number: 8,
          stem: 'What must members bring themselves?',
          options: [
            { key: 'A', text: 'Non marking shoes and a racket.' },
            { key: 'B', text: 'A spare visitor pass.' },
            { key: 'C', text: 'The club’s shared shuttles.' },
          ],
        },
        {
          number: 9,
          stem: 'What rule applies to visitor passes?',
          options: [
            { key: 'A', text: 'Visitors can return unlimited times.' },
            { key: 'B', text: 'A visitor may join twice under the same member.' },
            { key: 'C', text: 'Visitors pay the full court fee each time.' },
          ],
        },
        {
          number: 10,
          stem: 'What happens if a member cancels late?',
          options: [
            { key: 'A', text: 'The fee is refunded the same day.' },
            { key: 'B', text: 'The court fee still goes ahead unless someone replaces them.' },
            { key: 'C', text: 'The member loses their place for the season.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Saturday'], evidence: 3,
      explanation: {
        zh: '定位句 3：The Saturday morning court is free between nine and eleven, so that slot works。可选场地是周六上午；句 2 的 weekday evenings 是顾客不可用的时间，不是答案。',
        en: 'Sentence 3: "The Saturday morning court is free between nine and eleven, so that slot works". The available court is Saturday morning; weekday evenings in sentence 2 are the customer’s unavailable time, not the answer.',
      },
    },
    {
      number: 2, accepted: ['standard'], evidence: 5,
      explanation: {
        zh: '定位句 5：The club finds a partner of similar standard, so you do not need a friend。搭档按相近水平匹配，空前是 similar，填 standard。',
        en: 'Sentence 5: "The club finds a partner of similar standard, so you do not need a friend". The partner matches a similar standard; similar precedes the gap, so write standard.',
      },
    },
    {
      number: 3, accepted: ['four', '4'], evidence: 7,
      explanation: {
        zh: '定位句 7：Each court holds four players, and the fee is split between the four of you。球费由四名球员分摊，空后已印 players，填 four。',
        en: 'Sentence 7: "Each court holds four players, and the fee is split between the four of you". The fee splits among four players; players is printed, so write four.',
      },
    },
    {
      number: 4, accepted: ['hour'], evidence: 9,
      explanation: {
        zh: '定位句 9：New members get one coaching session, and it lasts one hour with the coach。教练课时长一小时，空前是 one，填 hour。',
        en: 'Sentence 9: "New members get one coaching session, and it lasts one hour with the coach". The session lasts one hour; one precedes the gap, so write hour.',
      },
    },
    {
      number: 5, accepted: ['three', '3'], evidence: 11,
      explanation: {
        zh: '定位句 11：Each member can bring three visitors free of charge during the season。每赛季可带三位免费访客，填 three。',
        en: 'Sentence 11: "Each member can bring three visitors free of charge during the season". Three visitors are free per season; write three.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：On court we provide shuttles and water, but you bring your own racket。场地提供球和水，对应 B。A 的球拍是自带项，C 的毛巾在句 19 也是自带物。',
        en: 'Sentence 15: "On court we provide shuttles and water, but you bring your own racket". The club provides shuttles and water, matching B. Rackets are brought by members, and towels appear as a personal item in sentence 19.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：Members book one court per week, and extra slots open two days ahead。会员每周订一块场地，对应 A。B 的每天两块和 C 的仅限周末在录音中没有依据。',
        en: 'Sentence 17: "Members book one court per week, and extra slots open two days ahead", matching A. Two courts a day and weekend-only booking are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Bring non marking shoes, your racket, and a towel for the break。会员需自带无痕鞋、球拍和毛巾，对应 A。B 的访客通行证不是自带物品，C 的俱乐部共用球由场地提供。',
        en: 'Sentence 19: "Bring non marking shoes, your racket, and a towel for the break", matching A. A visitor pass is not brought, and the club’s shared shuttles are provided on court.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：A visitor may join twice under the same member, then they should join themselves。同一会员名下访客最多跟两次，对应 B。A 的不限次数与句中 twice 相反，C 的每次全价在录音中没有依据。',
        en: 'Sentence 21: "A visitor may join twice under the same member, then they should join themselves", matching B. Unlimited returns contradict twice, and paying full fee each time is not said.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Late cancellation means the court fee still goes ahead unless someone replaces you。迟到取消仍要承担球费，除非有人顶替，对应 B。A 的当天退款与句中 fee still goes ahead 相反，C 的取消赛季资格在录音中没有依据。',
        en: 'Sentence 23: "Late cancellation means the court fee still goes ahead unless someone replaces you", matching B. A same-day refund contradicts the fee going ahead, and losing the season place is not claimed.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I would like to join the badminton club and play regular sessions.' },
    { speaker: 'rep', text: 'Great, let me note what you need. Which days suit you at the weekend?' },
    { speaker: 'customer', text: 'I can do Saturday morning, and I work on weekday evenings.' },
    { speaker: 'rep', text: 'The Saturday morning court is free between nine and eleven, so that slot works.' },
    { speaker: 'customer', text: 'Will I play with other members, or do I bring my own group?' },
    { speaker: 'rep', text: 'The club finds a partner of similar standard, so you do not need a friend.' },
    { speaker: 'customer', text: 'How do you split the court fee among the players?' },
    { speaker: 'rep', text: 'Each court holds four players, and the fee is split between the four of you.' },
    { speaker: 'customer', text: 'Is coaching included, or do the sessions just follow a rally?' },
    { speaker: 'rep', text: 'New members get one coaching session, and it lasts one hour with the coach.' },
    { speaker: 'customer', text: 'How many times can non members come as guests?' },
    { speaker: 'rep', text: 'Each member can bring three visitors free of charge during the season.' },
    { speaker: 'customer', text: 'Do I need to sign a membership form before the first court?' },
    { speaker: 'rep', text: 'Yes, the short form takes two minutes at the club desk before play.' },
    { speaker: 'customer', text: 'Right, what else should I know about the arrangements?' },
    { speaker: 'rep', text: 'On court we provide shuttles and water, but you bring your own racket.' },
    { speaker: 'customer', text: 'How often can members book the courts through the club system?' },
    { speaker: 'rep', text: 'Members book one court per week, and extra slots open two days ahead.' },
    { speaker: 'customer', text: 'What should I bring with me to the first session?' },
    { speaker: 'rep', text: 'Bring non marking shoes, your racket, and a towel for the break.' },
    { speaker: 'customer', text: 'Is there any limit on how often a visitor can return?' },
    { speaker: 'rep', text: 'A visitor may join twice under the same member, then they should join themselves.' },
    { speaker: 'customer', text: 'What if I cancel a booked session on the morning itself?' },
    { speaker: 'rep', text: 'Late cancellation means the court fee still goes ahead unless someone replaces you.' },
    { speaker: 'customer', text: 'Does the club hold social matches through the year?' },
    { speaker: 'rep', text: 'Yes, there are friendly matches each month, open to every active member.' },
    { speaker: 'customer', text: 'Can beginners join, or is the club for stronger players only?' },
    { speaker: 'rep', text: 'We take all standards, and the partner matching accounts for beginner level.' },
    { speaker: 'customer', text: 'Where are the courts located in the sports centre?' },
    { speaker: 'rep', text: 'They are on the first floor, next to the indoor tennis courts.' },
    { speaker: 'customer', text: 'Is there a waiting area for players between games?' },
    { speaker: 'rep', text: 'There is a bench by the entrance, with a small shelf for bags.' },
    { speaker: 'customer', text: 'How long does a regular session last in total?' },
    { speaker: 'rep', text: 'Most players stay for two hours, with breaks between the games.' },
    { speaker: 'customer', text: 'Do you offer any equipment for sale at the desk?' },
    { speaker: 'rep', text: 'We sell spare shuttles and grip tape, but not full rackets.' },
    { speaker: 'customer', text: 'Will I get a reminder before my first Saturday slot?' },
    { speaker: 'rep', text: 'The club sends a message the evening before each booked court.' },
    { speaker: 'customer', text: 'One last thing, can members keep rackets in the club cupboard?' },
    { speaker: 'rep', text: 'Rackets stay in the personal locker, and the cupboard is for shared equipment.' },
    { speaker: 'customer', text: 'That sounds good. I will take the Saturday morning place.' },
    { speaker: 'rep', text: 'Done. Please arrive ten minutes early to fill in the short form.' },
  ],
  vocabulary: [
    {
      term: 'partner', phonetic: '/ˈpɑːtnə/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '搭档，同场对打的球友', en: 'the person you play alongside or against in a session' },
      usage: { zh: '可数名词；find a partner、a playing partner。', en: 'Countable: find a partner, a playing partner.' },
      collocations: ['a playing partner', 'find a partner', 'a partner of similar standard'],
      example: { en: 'The club matches you with a partner of similar standard.', zh: '俱乐部为你匹配水平相近的搭档。' },
      listening: { zh: '两个音节，重音在第一个；结尾 -er 弱读。', en: 'Two syllables with first-syllable stress; the ending is weak.' },
    },
    {
      term: 'standard', phonetic: '/ˈstændəd/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '水平，球技等级', en: 'the skill level of a player' },
      usage: { zh: '可数或不可数；similar standard、beginner standard。', en: 'Similar standard, beginner standard.' },
      collocations: ['similar standard', 'beginner standard', 'match the standard'],
      example: { en: 'Partners are chosen at a similar standard to yours.', zh: '搭档会选和你水平相近的人。' },
      listening: { zh: '两个音节，重音在第一个；中间 -dar 弱读。', en: 'Two syllables with first-syllable stress; the middle is weak.' },
    },
    {
      term: 'shuttles', phonetic: '/ˈʃʌtlz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '羽毛球（羽毛球用球）', en: 'the feathered ball used in badminton' },
      usage: { zh: '可数名词；日常也说 shuttlecock。', en: 'Countable; shuttlecock is the fuller form.' },
      collocations: ['a spare shuttle', 'shuttles and water', 'new shuttles'],
      example: { en: 'The club provides shuttles for every booked court.', zh: '俱乐部为每块订场提供羽毛球。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /tl/ 不要漏听。', en: 'Two syllables with first-syllable stress; do not drop the final /tl/.' },
    },
    {
      term: 'non marking', phonetic: '/ˌnɒn ˈmɑːkɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 19,
      meaning: { zh: '无痕的（鞋底不在场地留下划痕）', en: 'shoes whose soles do not leave marks on the court' },
      usage: { zh: '运动场地高频；non marking shoes、non marking soles。', en: 'Common on sports courts: non marking shoes, non marking soles.' },
      collocations: ['non marking shoes', 'non marking soles', 'wear non marking shoes'],
      example: { en: 'Bring non marking shoes so the court surface stays clean.', zh: '穿无痕鞋来，保持场地表面干净。' },
      listening: { zh: 'non 弱读，重音在 marking 的第一个音节。', en: 'non is weak; stress the first syllable of marking.' },
    },
    {
      term: 'cancellation', phonetic: '/ˌkænsəˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '取消（已预订的场次）', en: 'the act of giving up a booked session' },
      usage: { zh: '可数或不可数；late cancellation、fee on cancellation。动词是 cancel。', en: 'Late cancellation, fee on cancellation. The verb is cancel.' },
      collocations: ['late cancellation', 'a cancellation fee', 'cancel a session'],
      example: { en: 'Late cancellation still leaves the court fee in place.', zh: '迟到取消仍需承担场地费。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'grip tape', phonetic: '/ɡrɪp teɪp/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '握把胶带（缠在球拍柄上防滑）', en: 'tape wrapped around the racket handle for a non slip grip' },
      usage: { zh: '不可数；a roll of grip tape、replace the grip tape。', en: 'Uncountable: a roll of grip tape, replace the grip tape.' },
      collocations: ['grip tape', 'a roll of grip tape', 'replace the grip tape'],
      example: { en: 'The desk sells spare shuttles and grip tape.', zh: '前台卖备用羽毛球和握把胶带。' },
      listening: { zh: 'grip 单音节 /ɡrɪp/；tape 读 /teɪp/。', en: 'grip is one syllable /ɡrɪp/; tape is /teɪp/.' },
    },
  ],
  expressions: [
    {
      phrase: 'fee is split', sentenceIndex: 7,
      meaning: { zh: '分摊费用', en: 'to divide the court charge among the players' },
      usage: { zh: 'split the fee between four people；split 后接金额或人数。', en: 'Split the fee between four people; split takes the amount or number.' },
      example: { en: 'The fee is split between the four players on court.', zh: '球费由场上四名球员分摊。' },
    },
    {
      phrase: 'free of charge', sentenceIndex: 11,
      meaning: { zh: '免费，不收费', en: 'with no payment required' },
      usage: { zh: '服务场景高频；come free of charge、admission free of charge。', en: 'Common in services: come free of charge, admission free of charge.' },
      example: { en: 'Each member brings three visitors free of charge.', zh: '每位会员可带三位免费访客。' },
    },
    {
      phrase: 'open two days ahead', sentenceIndex: 17,
      meaning: { zh: '提前两天开放（预订名额）', en: 'becoming bookable two days before the session' },
      usage: { zh: 'ahead 表示提前；slots open ahead、book ahead。', en: 'Ahead means in advance: slots open ahead, book ahead.' },
      example: { en: 'Extra booking slots open two days ahead of play.', zh: '额外订场名额提前两天开放。' },
    },
    {
      phrase: 'goes ahead', sentenceIndex: 23,
      meaning: { zh: '照常进行，仍然成立', en: 'to remain in force despite the cancellation' },
      usage: { zh: 'the fee goes ahead；也可表示“开始”。', en: 'The fee goes ahead; it can also mean begin.' },
      example: { en: 'The court fee still goes ahead unless someone replaces you.', zh: '除非有人顶替，否则球费照常收取。' },
    },
    {
      phrase: 'replaces you', sentenceIndex: 23,
      meaning: { zh: '顶替你的位置', en: 'to take your place on the court' },
      usage: { zh: 'replace somebody in the session；客服与排班场景常用。', en: 'Replace somebody in the session; common in booking contexts.' },
      example: { en: 'If another player replaces you, the fee can be waived.', zh: '如果有其他球员顶替你，球费可以免除。' },
    },
    {
      phrase: 'accounts for', sentenceIndex: 27,
      meaning: { zh: '把……考虑在内，兼顾', en: 'to include a particular level or group in the matching' },
      usage: { zh: 'account for beginner level；也表示“解释”。', en: 'Account for beginner level; it can also mean explain.' },
      example: { en: 'The partner matching accounts for beginner level players.', zh: '搭档匹配会考虑初学者水平。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记人数再记分摊', en: 'Note the number before the split' },
      body: {
        zh: '第 3 题问分摊人数，一句话常同时给场地容量和分摊方式。听到 four players 时先在旁边记人数，确认 fee split 也是这四个人，避免把别的场次人数填进去。',
        en: 'Item 3 asks for the split number, and one sentence often gives both court capacity and the split. Note four players first, then confirm the fee splits among the same four, so another session’s number does not fill the gap.',
      },
    },
    {
      title: { zh: '分清俱乐部提供与自带物品', en: 'Separate provided items from personal ones' },
      body: {
        zh: '第 6 题问提供物、第 8 题问自带物，两题答案在相邻句子里。听前把两题并排看，听到 provide 记提供项，听到 bring 记自带项，不要把 shuttles 或 racket 填反。',
        en: 'Item 6 asks for provided items and item 8 for personal ones, with answers in nearby sentences. Read both together; record provide items after provide and personal items after bring, so shuttles and racket are not swapped.',
      },
    },
    {
      title: { zh: '干扰项常改写否定规则', en: 'Distractors rewrite negative rules' },
      body: {
        zh: '第 9、10 题的干扰项把 twice 说成 unlimited、把 fee still goes ahead 说成 refunded。听到 twice、still、unless 这类限定词时，先在选项旁标记，再核对整句是否被反转。',
        en: 'Distractors for items 9 and 10 turn twice into unlimited and fee still goes ahead into refunded. Mark options when you hear twice, still or unless, then check whether the whole sentence has been reversed.',
      },
    },
  ],
};
