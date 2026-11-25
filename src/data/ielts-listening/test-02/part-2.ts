import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 2 · Part 2 — 音乐节志愿者简报（独白，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 独白用 First / Second / Third / Fourth / Last 分段，配对题按段落顺序出现。
 * 每个岗位都用“而不是……”的纠正句式（rather than selling tickets），模拟真题里先误导再纠正的写法。
 */
export const test02Part2: ListeningLesson = {
  slug: 'test-02-part-2',
  part: 2,
  status: 'published',
  title: { zh: '音乐节志愿者出发前的简报', en: 'Briefing for festival volunteers' },
  summary: {
    zh: '志愿者协调人在开门前说明集合时间、班次时长、要带的装备和免费午餐，然后逐一交代四个小组的职责以及换班和报酬的规矩。',
    en: 'The volunteer coordinator covers arrival time, shift length, what to bring and free lunch, then explains what each of the four teams does, plus the rules for swaps and rewards.',
  },
  accent: { zh: '协调人为加拿大口音，语速中等偏快。', en: 'The coordinator has a Canadian accent and speaks fairly quickly.' },
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-CA-ClaraNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Volunteers must be at the tent by', cells: [[{ blank: 11 }, { text: ' a.m.' }]] },
        { lead: 'Length of each shift', cells: [[{ blank: 12 }, { text: ' hours' }]] },
        { lead: 'Bring a waterproof', cells: [[{ blank: 13 }]] },
        { lead: 'Provided for volunteers', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What is each team responsible for? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'selling tickets' },
        { key: 'B', text: 'checking wristbands' },
        { key: 'C', text: 'showing drivers where to park' },
        { key: 'D', text: 'keeping the area in front of the stage clear' },
        { key: 'E', text: 'picking up litter' },
        { key: 'F', text: 'looking after lost children' },
      ],
      items: [
        { number: 15, text: 'the gate team' },
        { number: 16, text: 'the car park team' },
        { number: 17, text: 'the arena team' },
        { number: 18, text: 'the information point' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 19,
          stem: 'What should a volunteer do if they cannot attend a shift?',
          options: [
            { key: 'A', text: 'Arrange a swap with another volunteer.' },
            { key: 'B', text: 'Phone the coordinator.' },
            { key: 'C', text: 'Post a message in the group chat.' },
          ],
        },
        {
          number: 20,
          stem: 'What will each volunteer receive at the end of the weekend?',
          options: [
            { key: 'A', text: 'A free ticket for next year’s festival.' },
            { key: 'B', text: 'A written reference for job applications.' },
            { key: 'C', text: 'A voucher to spend at the festival shop.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['nine', '9'], evidence: 5,
      explanation: {
        zh: '定位句 5：Please be at the volunteer tent by nine each morning。后面的 eleven 是对公众开门的时间，不是集合时间。',
        en: 'Sentence 5: "Please be at the volunteer tent by nine each morning". Eleven is when the gates open to the public, not the meeting time.',
      },
    },
    {
      number: 12, accepted: ['four', '4'], evidence: 7,
      explanation: {
        zh: '定位句 7：Each shift lasts four hours。you will have either the morning or the afternoon slot 说明每人一班。',
        en: 'Sentence 7: "Each shift lasts four hours". The next clause, either the morning or the afternoon slot, means one shift each.',
      },
    },
    {
      number: 13, accepted: ['jacket'], evidence: 10,
      explanation: {
        zh: '定位句 10：please bring a waterproof jacket even if it looks fine。防水的是 jacket；下一句的 shoes 也建议带，但空前是 a waterproof，只能填 jacket。',
        en: 'Sentence 10: "please bring a waterproof jacket even if it looks fine". The waterproof item is the jacket; shoes come in the next sentence and do not fit after a waterproof.',
      },
    },
    {
      number: 14, accepted: ['lunch'], evidence: 13,
      explanation: {
        zh: '定位句 13：Lunch is provided for all volunteers。茶和咖啡在休息帐篷里提供，但表格问的是 provided for volunteers 的正餐，且只有 lunch 是一个词。',
        en: 'Sentence 13: "Lunch is provided for all volunteers". Tea and coffee are in the rest tent, but the meal provided is lunch.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：your job is checking wristbands rather than selling tickets。rather than 之后才是工作内容，A 是被明确否定的。',
        en: 'Sentence 17: "your job is checking wristbands rather than selling tickets". The job comes before rather than; selling tickets is explicitly ruled out.',
      },
    },
    {
      number: 16, accepted: ['C'], evidence: 20,
      explanation: {
        zh: '定位句 20：you will be showing drivers where to park and keeping the accessible spaces free。对应的选项原词是 showing drivers where to park。',
        en: 'Sentence 20: "you will be showing drivers where to park and keeping the accessible spaces free". This matches the option almost word for word.',
      },
    },
    {
      number: 17, accepted: ['D'], evidence: 22,
      explanation: {
        zh: '定位句 22：Your task is keeping the area in front of the stage clear。E（捡垃圾）在后面被说明由市政队伍夜间负责。',
        en: 'Sentence 22: "Your task is keeping the area in front of the stage clear". E, picking up litter, is later said to be done by the council crew overnight.',
      },
    },
    {
      number: 18, accepted: ['F'], evidence: 26,
      explanation: {
        zh: '定位句 26：the most common job is looking after lost children until we find their parents。与选项 F 完全对应。',
        en: 'Sentence 26: "the most common job is looking after lost children until we find their parents". That is option F.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：please phone me rather than sending a message in the group chat。C 被否定；A（私下换班）在后面一句被明确禁止。',
        en: 'Sentence 29: "please phone me rather than sending a message in the group chat". C is ruled out, and A, swapping directly, is banned in the next sentence.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 34,
      explanation: {
        zh: '定位句 34：Every volunteer receives a voucher worth fifteen pounds to spend in the festival shop。A 在下一句被否定；B 需要另外发邮件申请，不是人人都有。',
        en: 'Sentence 34: "Every volunteer receives a voucher worth fifteen pounds to spend in the festival shop". A is rejected in the next sentence; B must be requested separately, so it is not given to everyone.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Good morning, everyone, and thank you for coming so early.' },
    { speaker: 'coordinator', text: 'For those I haven’t met, my name is Clara, and I coordinate the volunteer programme for the festival.' },
    { speaker: 'coordinator', text: 'We have two hundred and forty volunteers this year, which is a record, and I’m grateful to every one of you.' },
    { speaker: 'coordinator', text: 'Before the gates open at eleven, I need to run through the arrangements for the weekend.' },
    { speaker: 'coordinator', text: 'First, arrival.' },
    { speaker: 'coordinator', text: 'Please be at the volunteer tent by nine each morning, because that gives us an hour to brief the teams.' },
    { speaker: 'coordinator', text: 'If you arrive late, come and find me rather than going straight to your post, because the plan may have changed.' },
    { speaker: 'coordinator', text: 'Each shift lasts four hours, and you will have either the morning or the afternoon slot.' },
    { speaker: 'coordinator', text: 'Between shifts, the rest tent is open, with tea, coffee and places to sit down.' },
    { speaker: 'coordinator', text: 'Second, what to bring.' },
    { speaker: 'coordinator', text: 'The forecast is mixed, so please bring a waterproof jacket even if it looks fine when you leave home.' },
    { speaker: 'coordinator', text: 'Wear shoes you can stand in for four hours, because the ground is uneven and it may be muddy.' },
    { speaker: 'coordinator', text: 'Bring a water bottle too, although there are refills at every bar.' },
    { speaker: 'coordinator', text: 'Lunch is provided for all volunteers, and there is a vegetarian option on every day.' },
    { speaker: 'coordinator', text: 'We cannot cater for every allergy, so if you have a serious one, please bring your own food.' },
    { speaker: 'coordinator', text: 'Third, the teams.' },
    { speaker: 'coordinator', text: 'This is the part most people ask about, so listen carefully.' },
    { speaker: 'coordinator', text: 'The gate team stands at the two main entrances, and your job is checking wristbands rather than selling tickets.' },
    { speaker: 'coordinator', text: 'If someone has no wristband, send them to the box office, and do not argue with them yourself.' },
    { speaker: 'coordinator', text: 'The car park team is based in the field next to the lane.' },
    { speaker: 'coordinator', text: 'You will not be collecting money there; you will be showing drivers where to park and keeping the accessible spaces free.' },
    { speaker: 'coordinator', text: 'The arena team works closest to the stage.' },
    { speaker: 'coordinator', text: 'Your task is keeping the area in front of the stage clear, so that the crowd does not press against the barriers.' },
    { speaker: 'coordinator', text: 'It sounds simple, but it is the job where we most need calm people.' },
    { speaker: 'coordinator', text: 'Litter is picked up by the council’s crew overnight, so that is not something any team needs to do.' },
    { speaker: 'coordinator', text: 'Finally, the information point sits in the main square.' },
    { speaker: 'coordinator', text: 'Two volunteers staff it at all times, and the most common job is looking after lost children until we find their parents.' },
    { speaker: 'coordinator', text: 'There is a loudspeaker there for announcements, and only I or the duty manager may use it.' },
    { speaker: 'coordinator', text: 'Fourth, a few housekeeping points.' },
    { speaker: 'coordinator', text: 'If you cannot attend a shift, please phone me rather than sending a message in the group chat.' },
    { speaker: 'coordinator', text: 'I do not always see the chat during the day, and an empty post is a safety problem.' },
    { speaker: 'coordinator', text: 'Swapping shifts directly with another volunteer is not allowed, because the lists are used for the head count.' },
    { speaker: 'coordinator', text: 'If the weather turns dangerous, we send everyone to the rest tent, and the duty manager will announce this.' },
    { speaker: 'coordinator', text: 'Last, what you get out of the weekend.' },
    { speaker: 'coordinator', text: 'Every volunteer receives a voucher worth fifteen pounds to spend in the festival shop.' },
    { speaker: 'coordinator', text: 'We are not able to offer free tickets for next year, I’m afraid, because the licence limits the number we can give away.' },
    { speaker: 'coordinator', text: 'If you need a written reference for a job or a course, ask me by email and I will write one within a week.' },
    { speaker: 'coordinator', text: 'More importantly, you get to see how a large event is run from the inside, and many of last year’s volunteers came back as paid staff.' },
    { speaker: 'coordinator', text: 'That is everything from me.' },
    { speaker: 'coordinator', text: 'The team lists are on the noticeboard behind the tent, so find your name and go to your team leader.' },
    { speaker: 'coordinator', text: 'Thank you, and enjoy the weekend.' },
  ],
  vocabulary: [
    {
      term: 'coordinate', phonetic: '/kəʊˈɔːdɪneɪt/', partOfSpeech: 'v.', sentenceIndex: 1,
      meaning: { zh: '协调，统筹安排', en: 'to organise the different parts of an activity' },
      usage: { zh: '动词重音在第二个音节；名词 coordinator、coordination 的重音位置相同。', en: 'The verb is stressed on the second syllable, as are coordinator and coordination.' },
      collocations: ['coordinate the programme', 'coordinate efforts', 'coordinate with a team'],
      example: { en: 'She coordinates the volunteers for three festivals every summer.', zh: '她每年夏天为三个音乐节统筹志愿者。' },
      listening: { zh: '英音读 /əʊˈɔː/，美音和加拿大音读 /oʊˈɔːr/，结尾是 /neɪt/。', en: 'British /əʊˈɔː/, North American /oʊˈɔːr/, ending in /neɪt/.' },
    },
    {
      term: 'brief', phonetic: '/briːf/', partOfSpeech: 'v.', sentenceIndex: 5,
      meaning: { zh: '向……作简要交代', en: 'to give someone the essential information before a task' },
      usage: { zh: 'brief the teams、brief somebody on something；名词 briefing 就是“简报会”。', en: 'Brief the teams, brief somebody on something; the noun briefing is the meeting itself.' },
      collocations: ['brief the team', 'brief somebody on', 'a briefing session'],
      example: { en: 'The guide briefed us on the route before we set off.', zh: '出发前向导向我们简要交代了路线。' },
      listening: { zh: '与名词 brief（简报）同音，靠前面的 to 或 the 判断词性。', en: 'It sounds the same as the noun brief; to or the tells you which part of speech it is.' },
    },
    {
      term: 'slot', phonetic: '/slɒt/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '时段，名额', en: 'a period of time reserved for something' },
      usage: { zh: 'the morning slot、a time slot、fill a slot；排班和日程场景高频。', en: 'The morning slot, a time slot, fill a slot; common in timetables and rotas.' },
      collocations: ['a time slot', 'the morning slot', 'fill a slot'],
      example: { en: 'I can offer you the two o’clock slot on Thursday.', zh: '我可以给你周四两点那个时段。' },
      listening: { zh: '美音和加拿大音读 /slɑːt/，不要听成 slut 之类的词，靠上下文判断。', en: 'In North American English it is /slɑːt/; rely on context for the vowel.' },
    },
    {
      term: 'forecast', phonetic: '/ˈfɔːkɑːst/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '天气预报', en: 'a statement about what the weather will be' },
      usage: { zh: 'the forecast is mixed 表示天气多变；动词 forecast 的过去式也是 forecast。', en: 'The forecast is mixed means changeable weather; the past tense of the verb is also forecast.' },
      collocations: ['the weather forecast', 'according to the forecast', 'forecast rain'],
      example: { en: 'The forecast for the weekend is sunny with a light wind.', zh: '周末的天气预报是晴天，有微风。' },
      listening: { zh: '重音在第一个音节；注意它与 before 没有关系，开头是 /fɔː/。', en: 'Stress the first syllable; it begins with /fɔː/, like four.' },
    },
    {
      term: 'uneven', phonetic: '/ʌnˈiːvn/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '不平坦的', en: 'not flat or level' },
      usage: { zh: 'uneven ground、an uneven surface；反义是 level 或 flat。', en: 'Uneven ground, an uneven surface; the opposite is level or flat.' },
      collocations: ['uneven ground', 'an uneven surface', 'uneven edges'],
      example: { en: 'Be careful on the path, because the stones are uneven.', zh: '路上小心，石头铺得不平。' },
      listening: { zh: '重音在第二个音节 /ˈiːv/，不要读成 /ˈʌniːvn/。', en: 'Stress the second syllable, /ˈiːv/, not the first.' },
    },
    {
      term: 'wristband', phonetic: '/ˈrɪstbænd/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '腕带', en: 'a band worn around the wrist to show that someone has paid or is allowed in' },
      usage: { zh: '活动场景必备词：check wristbands、put on a wristband。', en: 'An events word: check wristbands, put on a wristband.' },
      collocations: ['check wristbands', 'wear a wristband', 'a paper wristband'],
      example: { en: 'Visitors exchange their tickets for a wristband at the gate.', zh: '游客在门口用票换腕带。' },
      listening: { zh: '由 wrist 和 band 两个词组成，读音就是两个词连读。', en: 'It is simply wrist plus band said together.' },
    },
    {
      term: 'accessible', phonetic: '/əkˈsesəbl/', partOfSpeech: 'adj.', sentenceIndex: 20,
      meaning: { zh: '无障碍的，方便行动不便者使用的', en: 'designed so that people with disabilities can use it' },
      usage: { zh: 'accessible spaces、accessible toilets、step-free access；注意重音在 ses。', en: 'Accessible spaces, accessible toilets; stress the syllable ses.' },
      collocations: ['accessible parking', 'accessible entrance', 'fully accessible'],
      example: { en: 'The new library has a ramp and an accessible lift.', zh: '新图书馆有坡道和无障碍电梯。' },
      listening: { zh: '四个音节，重音在第三个 /ˈse/；结尾是 /səbl/。', en: 'Four syllables with stress on the third; the ending is /səbl/.' },
    },
    {
      term: 'barriers', phonetic: '/ˈbæriəz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '护栏，障碍物', en: 'structures that keep people from entering or crossing' },
      usage: { zh: 'press against the barriers、safety barriers；引申义是“障碍”。', en: 'Press against the barriers, safety barriers; figuratively, an obstacle.' },
      collocations: ['press against the barriers', 'a safety barrier', 'language barriers'],
      example: { en: 'Security staff placed barriers along the whole route.', zh: '安保人员沿整条路线设置了护栏。' },
      listening: { zh: '复数词尾读 /z/，前面是 /ə/，听上去像 bair-ee-uhz。', en: 'The plural ending is /z/ after /ə/: bair-ee-uhz.' },
    },
    {
      term: 'housekeeping', phonetic: '/ˈhaʊskiːpɪŋ/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '（会议、活动中的）事务性安排', en: 'routine administrative matters' },
      usage: { zh: 'a few housekeeping points 是会议和简报的固定开场；原义是“家务”。', en: 'A few housekeeping points is a set phrase in briefings; the original meaning is domestic cleaning.' },
      collocations: ['housekeeping points', 'do the housekeeping', 'housekeeping staff'],
      example: { en: 'Before we start, a few housekeeping points about fire exits.', zh: '开始之前，先说明几条关于安全出口的事务安排。' },
      listening: { zh: '由 house 和 keeping 复合而成，重音在第一个音节。', en: 'A compound of house and keeping, stressed on the first element.' },
    },
    {
      term: 'licence', phonetic: '/ˈlaɪsns/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '许可证，执照', en: 'an official document giving permission to do something' },
      usage: { zh: '英式名词拼作 licence，动词拼作 license；美式两者都写 license。', en: 'British English: licence is the noun and license the verb; American English uses license for both.' },
      collocations: ['a music licence', 'under licence', 'apply for a licence'],
      example: { en: 'You need a licence to sell alcohol at the event.', zh: '在活动中售酒需要许可证。' },
      listening: { zh: '中间的 /sn/ 读得很轻，容易和 license 动词混淆，但读音相同。', en: 'The /sn/ in the middle is light; noun and verb sound alike.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 3,
      meaning: { zh: '把……过一遍', en: 'to go over the main points quickly' },
      usage: { zh: '及物短语动词：run through the arrangements、run through a list。', en: 'Transitive: run through the arrangements.' },
      example: { en: 'Let me run through the plan one more time before we start.', zh: '开始之前我再把计划过一遍。' },
    },
    {
      phrase: 'cater for', sentenceIndex: 14,
      meaning: { zh: '为……提供（餐饮），顾及', en: 'to provide food for, or to take account of' },
      usage: { zh: '英式常用 cater for；美式多说 cater to。后接人群或需求。', en: 'British cater for, American often cater to; followed by a group or a need.' },
      example: { en: 'The cafe caters for vegans and people who avoid gluten.', zh: '这家咖啡馆为纯素食者和不吃麸质的人提供餐食。' },
    },
    {
      phrase: 'press against', sentenceIndex: 22,
      meaning: { zh: '挤向，紧压着', en: 'to push towards something in a crowd' },
      usage: { zh: '人群场景常用：press against the barriers、press against the door。', en: 'Common with crowds: press against the barriers.' },
      example: { en: 'Fans pressed against the fences to get a better view.', zh: '歌迷们挤在围栏上想看得更清楚。' },
    },
    {
      phrase: 'at all times', sentenceIndex: 26,
      meaning: { zh: '随时，始终', en: 'continuously, without interruption' },
      usage: { zh: '放在句末强调持续：two volunteers staff it at all times。', en: 'Goes at the end of a clause to stress continuity.' },
      example: { en: 'A qualified lifeguard must be present at all times.', zh: '必须随时有一名合格的救生员在场。' },
    },
    {
      phrase: 'head count', sentenceIndex: 31,
      meaning: { zh: '人数清点', en: 'the act of counting how many people are present' },
      usage: { zh: '安全场景常用：do a head count、the lists are used for the head count。', en: 'Common in safety contexts: do a head count.' },
      example: { en: 'The teacher did a quick head count before leaving the museum.', zh: '离开博物馆前，老师快速清点了一下人数。' },
    },
    {
      phrase: 'turns dangerous', sentenceIndex: 32,
      meaning: { zh: '变得危险', en: 'becomes dangerous' },
      usage: { zh: 'turn 作系动词表示“变得”，后接形容词：turn cold、turn sour。', en: 'Turn as a linking verb, followed by an adjective: turn cold.' },
      example: { en: 'The sea can turn dangerous when the wind changes.', zh: '风向一变，海面就可能变得危险。' },
    },
    {
      phrase: 'came back as', sentenceIndex: 37,
      meaning: { zh: '回来成为……', en: 'returned in a new role' },
      usage: { zh: 'come back as 加身份：come back as paid staff、come back as a coach。', en: 'Come back as plus a role: come back as paid staff.' },
      example: { en: 'Several former interns came back as full-time employees.', zh: '几位 former 实习生回来成了正式员工。' },
    },
    {
      phrase: 'from the inside', sentenceIndex: 37,
      meaning: { zh: '从内部（的角度）', en: 'from the point of view of someone within an organisation' },
      usage: { zh: '与 from the outside 相对；see how something works from the inside。', en: 'The opposite of from the outside; see how something works from the inside.' },
      example: { en: 'Working there lets you see the industry from the inside.', zh: '在那里工作能让你从内部了解这个行业。' },
    },
  ],
  tips: [
    {
      title: { zh: '跟着分段词定位', en: 'Track the signposts' },
      body: {
        zh: '独白没有提问帮你定位，但讲话人会自己分段：First、Second、Third、Fourth、Last。读题时先把题号对到段落（11–14 是安排，15–18 是小组，19–20 是规矩和报酬），听到分段词就知道做到哪一段了。',
        en: 'A monologue has no questions to guide you, but the speaker divides it: First, Second, Third, Fourth, Last. Map the items to the sections before listening, so each signpost tells you where you should be.',
      },
    },
    {
      title: { zh: '听到 rather than 要等后半句', en: 'Wait for the half after rather than' },
      body: {
        zh: 'checking wristbands rather than selling tickets、phone me rather than sending a message：真题喜欢先说一个像答案的词再否定它。配对和单选里被 rather than 否定的那一半，就是专门给你准备的干扰项。',
        en: 'Checking wristbands rather than selling tickets, phone me rather than sending a message: items often offer the rejected half as a distractor. Make sure the option you pick is the half that was affirmed.',
      },
    },
    {
      title: { zh: '“人人都有”和“可以申请”不一样', en: 'Given to all is not the same as on request' },
      body: {
        zh: '第 20 题问的是每位志愿者都会收到什么。written reference 确实存在，但要另外发邮件申请，所以不能选。审题时圈出 each、all、every 这类限定词。',
        en: 'Item 20 asks what each volunteer receives. A written reference does exist, but it must be requested by email, so it is wrong. Circle words like each, all and every when you read the stem.',
      },
    },
  ],
};
