import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 22 · Part 1 — 爱好者咨询加入摄影俱乐部（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：例会时间 → 月度作品点评 → 外拍地点 → 会费 → 自备基础设备，
 * 后半段再谈成员水平、点评流程、外拍辅导、会费包含项与首次外拍装备。填空块在前半段，
 * 单选块在后半段，题块顺序与录音顺序一致。
 */
export const test22Part1: ListeningLesson = {
  slug: 'test-22-part-1',
  part: 1,
  status: 'published',
  title: { zh: '加入摄影俱乐部', en: 'Joining a photography club' },
  summary: {
    zh: '一名摄影爱好者咨询河边摄影俱乐部：了解例会星期、月度点评每人提交的作品、下一次外拍地点、年度会费和最初需要自备的设备，再弄清成员水平、点评方式、外拍辅导、会费包含的展览名额与首次外拍应带的器材。',
    en: 'A hobbyist asks about the Riverside Photography Club: the regular meeting day, the monthly review submission, the next outdoor shoot, the annual fee and the basic equipment to bring, then who joins the group, how the review runs, how tutors help on shoots, what the fee includes and what to bring to the first shoot.',
  },
  accent: { zh: '咨询者为美式口音，俱乐部顾问为澳式口音。', en: 'The applicant speaks with an American accent and the club adviser with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'applicant', label: 'APPLICANT', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Regular meeting: every', cells: [[{ blank: 1 }]] },
        { lead: 'Monthly review: each member submits one', cells: [[{ blank: 2 }]] },
        { lead: 'Next outdoor shoot: the', cells: [[{ blank: 3 }]] },
        { lead: 'Annual membership fee: £', cells: [[{ blank: 4 }]] },
        { lead: 'Basic equipment members bring themselves: a', cells: [[{ blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the adviser say about who joins the club?',
          options: [
            { key: 'A', text: 'Most members have exhibited for many years.' },
            { key: 'B', text: 'Beginners and more experienced members mix together.' },
            { key: 'C', text: 'The group is open to professional photographers only.' },
          ],
        },
        {
          number: 7,
          stem: 'How do the reviews on the night actually run?',
          options: [
            { key: 'A', text: 'Members take turns giving constructive comments to each other.' },
            { key: 'B', text: 'A single tutor judges every photograph on the screen.' },
            { key: 'C', text: 'The group votes on the best image of the month.' },
          ],
        },
        {
          number: 8,
          stem: 'What happens on an outdoor shoot?',
          options: [
            { key: 'A', text: 'Members work alone and compare results later.' },
            { key: 'B', text: 'A guest photographer lectures indoors before the walk.' },
            { key: 'C', text: 'A tutor walks around and offers individual advice.' },
          ],
        },
        {
          number: 9,
          stem: 'What does the annual fee cover?',
          options: [
            { key: 'A', text: 'all printing of submitted photographs' },
            { key: 'B', text: 'entry to the annual members’ exhibition' },
            { key: 'C', text: 'travel to every outdoor shoot' },
          ],
        },
        {
          number: 10,
          stem: 'What should members bring to the first outdoor shoot?',
          options: [
            { key: 'A', text: 'their own camera and a spare memory card' },
            { key: 'B', text: 'a tripod and a set of expensive lenses' },
            { key: 'C', text: 'a printed copy of every photograph taken' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Tuesday'], evidence: 3,
      explanation: {
        zh: '定位句 3：We hold a regular meeting every Tuesday evening。例会固定在周二晚；句 3 还提到部分周末有额外外拍，weekend 是干扰项。',
        en: 'Sentence 3: "We hold a regular meeting every Tuesday evening". The regular meeting is on Tuesday; the weekend shoots mentioned in the same sentence are extra sessions, not the regular day.',
      },
    },
    {
      number: 2, accepted: ['photograph'], evidence: 5,
      explanation: {
        zh: '定位句 5：Each member brings one photograph, and we look at it together on the screen。每月点评每人提交一张照片；slide 或 album 在录音中均未出现。',
        en: 'Sentence 5: "Each member brings one photograph, and we look at it together on the screen". The monthly submission is one photograph; neither slide nor album is mentioned in the recording.',
      },
    },
    {
      number: 3, accepted: ['harbour'], evidence: 11,
      explanation: {
        zh: '定位句 11：The next one is at the harbour, early on a Saturday morning。下一次外拍在海港；river road 是会所所在地，不是拍摄地点。',
        en: 'Sentence 11: "The next one is at the harbour, early on a Saturday morning". The next shoot is at the harbour; the river road in sentence 1 is where the hall stands, not the shoot site.',
      },
    },
    {
      number: 4, accepted: ['twenty-five', '25'], evidence: 15,
      explanation: {
        zh: '定位句 15：The annual fee is twenty-five pounds。年费填二十五；句 17 的打印费和句 37 的嘉宾工坊都是另付项目，不是年费金额。',
        en: 'Sentence 15: "The annual fee is twenty-five pounds". The fee is twenty-five; printing in sentence 17 and guest workshops in sentence 37 are paid separately, not part of the annual amount.',
      },
    },
    {
      number: 5, accepted: ['camera'], evidence: 19,
      explanation: {
        zh: '定位句 19：For the first year a camera is enough。最初自备的基础设备是相机；顾问明确说第一年不需要三脚架或贵镜头，tripod 是被否定的干扰项。',
        en: 'Sentence 19: "For the first year a camera is enough". The basic equipment to bring is a camera; the adviser explicitly says no tripod or expensive lenses are needed in the first year, so tripod is the rejected distractor.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The group is a mix of beginners who bought their first camera last year and members who have exhibited for a decade。新手与资深成员混编，对应 B。A 与 beginners 被纳入相反，C 与 hobbyists 的定位不符。',
        en: 'Sentence 25: "The group is a mix of beginners who bought their first camera last year and members who have exhibited for a decade". Beginners and experienced members mix, matching B. A contradicts the included beginners, and C conflicts with the club’s hobbyist membership.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：the photographer says a few words about the idea, and then the rest of us offer constructive comments one after another。点评由成员轮流给出，对应 A。B 与句 31 的 tutor guides the discussion 不符，C 的投票评选在录音中没有出现。',
        en: 'Sentence 29: "the photographer says a few words about the idea, and then the rest of us offer constructive comments one after another". Members take turns giving comments, matching A. B contradicts the tutor guides the discussion in sentence 31, and voting for the best image is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：A tutor walks around the route with the group, stopping to show a composition or a lighting trick, and offers individual advice。导师沿路走动并提供个别指导，对应 C。A 的单独作业和 B 的室内讲座在句 34 被顾问暗示为更无趣的形式。',
        en: 'Sentence 33: "A tutor walks around the route with the group, stopping to show a composition or a lighting trick, and offers individual advice". The tutor walks around giving individual advice, matching C. Working alone and an indoor lecture are the duller forms the adviser contrasts with this shoot.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：the fee covers entry to the annual members’ exhibition, which hangs in the town gallery each spring。会费包含年度会员展览名额，对应 B。A 的打印费在句 37 单列，C 的差旅在同句被归为另付。',
        en: 'Sentence 35: "the fee covers entry to the annual members’ exhibition, which hangs in the town gallery each spring". The fee covers exhibition entry, matching B. Printing in sentence 37 is listed separately, and travel is paid on top in the same sentence.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：Bring your own camera and a spare memory card, and leave the tripod at home until you know which subjects you prefer。首次外拍带相机和备用内存卡，对应 A。B 的三脚架被要求留在家中，C 的打印副本在录音中未提及。',
        en: 'Sentence 39: "Bring your own camera and a spare memory card, and leave the tripod at home until you know which subjects you prefer". The first shoot needs a camera and spare card, matching A. The tripod should stay home, and printed copies are never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'applicant', text: 'I saw the notice about the Riverside Photography Club, and I would like to know what joining involves.' },
    { speaker: 'adviser', text: 'Welcome along. We meet at the community hall on the river road, and most new members come in through the open evening.' },
    { speaker: 'applicant', text: 'That sounds useful. How often does the club actually meet?' },
    { speaker: 'adviser', text: 'We hold a regular meeting every Tuesday evening, from seven until half past nine, and there are extra shoots on some weekends.' },
    { speaker: 'applicant', text: 'Every Tuesday, right. Is there a session where people show their own work?' },
    { speaker: 'adviser', text: 'Yes, the review night comes once a month. Each member brings one photograph, and we look at it together on the screen.' },
    { speaker: 'applicant', text: 'One photograph a month. Do the comments come from the tutor, or from other members?' },
    { speaker: 'adviser', text: 'Mostly the members. We take turns giving constructive comments, and the tutor only steps in when the discussion goes quiet.' },
    { speaker: 'applicant', text: 'I am still fairly new, so I would not want to be put on the spot too early.' },
    { speaker: 'adviser', text: 'You do not have to speak in the first few months. Listening to the reviews is enough to start with.' },
    { speaker: 'applicant', text: 'Good. What about going out to take pictures together?' },
    { speaker: 'adviser', text: 'We organise an outdoor shoot each month. The next one is at the harbour, early on a Saturday morning, when the light is soft.' },
    { speaker: 'applicant', text: 'The harbour. I have only ever photographed around my own street, so that would be a change.' },
    { speaker: 'adviser', text: 'You will not be alone. Small groups walk the same route, and nobody is expected to sell the results.' },
    { speaker: 'applicant', text: 'Now, the cost. How much is membership for a year?' },
    { speaker: 'adviser', text: 'The annual fee is twenty-five pounds, and that covers the hall hire and the tutor’s time across the year.' },
    { speaker: 'applicant', text: 'Twenty-five. What exactly does that amount include?' },
    { speaker: 'adviser', text: 'Hall hire and the tutor’s time. Printing your own images is something you arrange separately, but we will come back to the exhibition later.' },
    { speaker: 'applicant', text: 'What equipment do I need to bring along? I have a basic camera, but not much else.' },
    { speaker: 'adviser', text: 'For the first year a camera is enough. You do not need a tripod or expensive lenses before you settle on a style.' },
    { speaker: 'applicant', text: 'A camera, then. Is there anything else I should buy before the first meeting?' },
    { speaker: 'adviser', text: 'Bring a spare memory card, because filling one up on a shoot is frustrating, and keep the battery charged the night before.' },
    { speaker: 'applicant', text: 'A spare memory card and a charged battery. I will note those down.' },
    { speaker: 'adviser', text: 'Before you decide, let me tell you a little about who joins the club.' },
    { speaker: 'applicant', text: 'Is it mostly people who have been taking photographs for years?' },
    { speaker: 'adviser', text: 'Not at all. The group is a mix of beginners who bought their first camera last year and members who have exhibited for a decade.' },
    { speaker: 'applicant', text: 'That mix would suit me. I do not want a club that only talks to advanced photographers.' },
    { speaker: 'adviser', text: 'The reviews are kept gentle on purpose. Nobody grades your picture, and the comments focus on what works rather than what failed.' },
    { speaker: 'applicant', text: 'How does that review actually run on the night?' },
    { speaker: 'adviser', text: 'Each image appears on the large screen, the photographer says a few words about the idea, and then the rest of us offer constructive comments one after another.' },
    { speaker: 'applicant', text: 'So it is the members speaking rather than a single tutor judging the work.' },
    { speaker: 'adviser', text: 'Exactly. The tutor guides the discussion, but the comments come from the room.' },
    { speaker: 'applicant', text: 'What happens on the outdoor shoots, apart from walking around with a camera?' },
    { speaker: 'adviser', text: 'A tutor walks around the route with the group, stopping to show a composition or a lighting trick, and offers individual advice as people need it.' },
    { speaker: 'applicant', text: 'That sounds more helpful than a lecture in a hall.' },
    { speaker: 'adviser', text: 'Now the exhibition side. Your printing stays your own, but the fee covers entry to the annual members’ exhibition, which hangs in the town gallery each spring.' },
    { speaker: 'applicant', text: 'Right, so the exhibition entry is included, but printing is on top.' },
    { speaker: 'adviser', text: 'That is the short version. Now, about the equipment on the first shoot.' },
    { speaker: 'applicant', text: 'I have read that beginners should buy a tripod straight away.' },
    { speaker: 'adviser', text: 'Not here. Bring your own camera and a spare memory card, and leave the tripod at home until you know which subjects you prefer.' },
    { speaker: 'applicant', text: 'Camera and memory card, noted. When does the next open evening start?' },
    { speaker: 'adviser', text: 'It is on the fourth Tuesday of this month, at seven, and you can bring one photograph to show if you like.' },
    { speaker: 'applicant', text: 'I will come along and have a look before I sign anything.' },
    { speaker: 'adviser', text: 'Fine. I will leave the membership leaflet with you, and you can reply through the club email.' },
  ],
  vocabulary: [
    {
      term: 'review', phonetic: '/rɪˈvjuː/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '（作品）点评，展示讨论', en: 'a session where members look at and discuss submitted work' },
      usage: { zh: '可数名词；review night、monthly review。同形动词表示“回顾、评论”。', en: 'Countable: review night, monthly review. The same word is a verb meaning to discuss critically.' },
      collocations: ['the review night', 'a monthly review', 'give a review'],
      example: { en: 'The review night happens once a month on the second Tuesday.', zh: '点评之夜每月第二个周二举行一次。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈvjuː/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'photograph', phonetic: '/ˈfəʊtəɡrɑːf/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '照片，摄影作品', en: 'an image captured by a camera' },
      usage: { zh: '可数名词；one photograph、a submitted photograph。口语里常简称 photo。', en: 'Countable: one photograph. In speech it is often shortened to photo.' },
      collocations: ['one photograph', 'a submitted photograph', 'take a photograph'],
      example: { en: 'Each member brings one photograph to the monthly review.', zh: '每位成员带一张照片参加月度点评。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /ɡrɑːf/ 不要漏听 /r/。', en: 'Three syllables with first-syllable stress; do not drop the /r/ before /ɡrɑːf/.' },
    },
    {
      term: 'harbour', phonetic: '/ˈhɑːbə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '海港，港口', en: 'the sheltered area where boats moor near the town' },
      usage: { zh: '可数名词；the harbour、harbour route。美式拼写 harbor。', en: 'Countable: the harbour route. The American spelling is harbor.' },
      collocations: ['the harbour', 'the harbour wall', 'down at the harbour'],
      example: { en: 'The next outdoor shoot meets at the harbour early on Saturday.', zh: '下一次外拍周六一早集合在海港。' },
      listening: { zh: '两个音节，重音在第一个；/bə/ 弱读。', en: 'Two syllables with first-syllable stress; the second is a weak /bə/.' },
    },
    {
      term: 'annual', phonetic: '/ˈænjuəl/', partOfSpeech: 'adj.', sentenceIndex: 15,
      meaning: { zh: '年度的，一年一次的', en: 'happening or counted once a year' },
      usage: { zh: '只作定语：annual fee、annual exhibition。副词 annually。', en: 'Attributive only: annual fee, annual exhibition. The adverb is annually.' },
      collocations: ['the annual fee', 'the annual exhibition', 'an annual event'],
      example: { en: 'The annual fee covers hall hire and the tutor’s time.', zh: '年度会费包含场地与导师时间。' },
      listening: { zh: '三个音节，重音在第一个；中间 /nju/ 连读。', en: 'Three syllables with first-syllable stress; /nju/ runs together.' },
    },
    {
      term: 'tripod', phonetic: '/ˈtraɪpɒd/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '三脚架', en: 'a three-legged stand that holds a camera steady' },
      usage: { zh: '可数名词；bring a tripod、set up a tripod。', en: 'Countable: bring a tripod, set up a tripod.' },
      collocations: ['a camera tripod', 'leave the tripod at home', 'set up a tripod'],
      example: { en: 'Beginners do not need to buy a tripod in the first year.', zh: '新手第一年不必买三脚架。' },
      listening: { zh: '两个音节，重音在第一个；/traɪ/ 是双元音。', en: 'Two syllables with first-syllable stress; /traɪ/ is a diphthong.' },
    },
    {
      term: 'constructive', phonetic: '/kənˈstrʌktɪv/', partOfSpeech: 'adj.', sentenceIndex: 29,
      meaning: { zh: '建设性的，有帮助的', en: 'useful and aimed at improving the work' },
      usage: { zh: '形容评论、反馈；constructive comments、constructive feedback。', en: 'Describes comments or feedback: constructive comments, constructive feedback.' },
      collocations: ['constructive comments', 'constructive feedback', 'constructive criticism'],
      example: { en: 'Members offer constructive comments rather than harsh judgements.', zh: '成员给出建设性意见，而不是严厉评判。' },
      listening: { zh: '重音在第二音节 /ˈstrʌk/；开头 /kən/ 很弱。', en: 'Stress the second syllable; the opening /kən/ is weak.' },
    },
    {
      term: 'exhibition', phonetic: '/ˌeksɪˈbɪʃn/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '展览，作品展', en: 'a public showing of members’ photographs' },
      usage: { zh: '可数名词；the annual exhibition、hang in the gallery。动词 exhibit。', en: 'Countable: the annual exhibition. The verb is exhibit.' },
      collocations: ['the annual exhibition', 'members’ exhibition', 'hang in the gallery'],
      example: { en: 'The members’ exhibition hangs in the town gallery each spring.', zh: '会员作品展每年春天在镇画廊展出。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈbɪʃ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'composition', phonetic: '/ˌkɒmpəˈzɪʃn/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '构图（画面安排）', en: 'the arrangement of subjects within the frame' },
      usage: { zh: '摄影语境不可数或可数；show a composition、frame composition。', en: 'In photography: show a composition, frame composition.' },
      collocations: ['show a composition', 'frame composition', 'good composition'],
      example: { en: 'The tutor stops to show a composition or a lighting trick.', zh: '导师会停下来讲解构图或用光技巧。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈzɪʃ/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'steps in', sentenceIndex: 7,
      meaning: { zh: '介入，接过话头', en: 'to join in and take over when the discussion slows' },
      usage: { zh: 'step in 的第三人称；step in to help、step in when quiet。', en: 'Third person of step in: step in to help, step in when quiet.' },
      example: { en: 'The tutor only steps in when the discussion goes quiet.', zh: '讨论冷场时导师才介入。' },
    },
    {
      phrase: 'put on the spot', sentenceIndex: 8,
      meaning: { zh: '当场被要求发言，下不来台', en: 'forced to speak or decide at once, with no preparation' },
      usage: { zh: '被动搭配；be put on the spot、feel on the spot。', en: 'Passive: be put on the spot, feel on the spot.' },
      example: { en: 'New members do not want to be put on the spot too early.', zh: '新成员不想太早被推到台前发言。' },
    },
    {
      phrase: 'settle on a style', sentenceIndex: 19,
      meaning: { zh: '确定自己的拍摄风格', en: 'to choose the kind of photography you prefer' },
      usage: { zh: 'settle on 后接名词；settle on a subject、on a style。', en: 'Settle on takes a noun: settle on a subject or a style.' },
      example: { en: 'Do not buy lenses before you settle on a style.', zh: '确定风格之前先别急着买镜头。' },
    },
    {
      phrase: 'kept gentle', sentenceIndex: 27,
      meaning: { zh: '保持温和（不严厉批评）', en: 'kept mild and supportive rather than harsh' },
      usage: { zh: 'keep 后接形容词；comments kept gentle、kept short。', en: 'Keep plus adjective: comments kept gentle, kept short.' },
      example: { en: 'The reviews are kept gentle on purpose for new members.', zh: '点评特意对新成员保持温和。' },
    },
    {
      phrase: 'walks around', sentenceIndex: 33,
      meaning: { zh: '四处走动巡视', en: 'to move around the group checking on each person' },
      usage: { zh: 'walk around 的第三人称；walk around the route、the room。', en: 'Third person of walk around: walk around the route or the room.' },
      example: { en: 'A tutor walks around the route and offers individual advice.', zh: '导师沿路走动，提供个别指导。' },
    },
    {
      phrase: 'on top', sentenceIndex: 36,
      meaning: { zh: '另外，在已付费用之上', en: 'in addition to the main fee, paid separately' },
      usage: { zh: '口语收费语境；printing is on top、travel on top。', en: 'Spoken in pricing: printing is on top, travel on top.' },
      example: { en: 'The exhibition entry is included, but printing is on top.', zh: '展览名额包含在内，打印费另付。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记条件，再记费用', en: 'Note the condition before the fee' },
      body: {
        zh: '第 4 题问年费金额，句 15 先给 twenty-five pounds，句 17 才说明 hall hire 与 tutor time 包含在内，打印另付。听价格时把“包含什么、另付什么”一并记下，避免把另付项目当成年费内容。',
        en: 'Item 4 asks the annual fee. Sentence 15 gives twenty-five pounds, and sentence 17 explains hall hire and tutor time are included while printing is separate. Record what is included and what is extra when you hear the price, so extras are not treated as fee content.',
      },
    },
    {
      title: { zh: '被否定的器材先划掉', en: 'Cross out rejected equipment' },
      body: {
        zh: '句 19 与句 39 两次否定 tripod：第一年不需要、首次外拍留在家中。单选题 B 项常把这种被否定的器材写成建议携带，听到 not need、leave at home 就在选项旁标叉。',
        en: 'Sentences 19 and 39 reject the tripod twice: not needed in year one, and left home for the first shoot. Distractor B often turns rejected gear into something to bring; mark a cross beside options after not need or leave at home.',
      },
    },
    {
      title: { zh: '配对角色别张冠李戴', en: 'Keep roles straight in the review' },
      body: {
        zh: '第 7 题区分“成员点评”与“导师评判”。句 28 说 members offer comments，句 30 补充 tutor guides the discussion；听到哪一方说话，就把角色词写在选项旁，避免把导师引导讨论误当成导师打分。',
        en: 'Item 7 separates member comments from tutor judgement. Sentence 28 says members offer comments, and sentence 30 adds the tutor guides the discussion. Note who speaks beside the option, so the tutor’s guidance is not mistaken for tutor scoring.',
      },
    },
  ],
};
