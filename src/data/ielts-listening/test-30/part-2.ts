import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 30 · Part 2 — 社区电台志愿者说明（单人独白，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 独白前半段讲节目类型、录音地点、音乐版权规则、值班表与听众反馈渠道（单选 11–15），
 * 后半段讲本周录制时间、自带设备、版权留存与留言归档（笔记填空 16–20）。
 */
export const test30Part2: ListeningLesson = {
  slug: 'test-30-part-2',
  part: 2,
  status: 'published',
  title: { zh: '社区电台志愿者说明', en: 'Briefing volunteers at community radio' },
  summary: {
    zh: '电台协调员向新志愿者说明：每周谈话节目的分工、二楼录音棚的位置、播放音乐须取得版权许可、值班表的核对方法，以及听众通过网站表单留言的反馈渠道；并交代本周录制时间、自带耳机、许可存档与留言记录。',
    en: 'A radio coordinator briefs new volunteers: the weekly chat show’s roles, the second-floor studio, the licensing rule for recorded music, checking the duty roster, and listener feedback through the website form; plus this week’s recording time, bringing headphones, keeping the licence on file and archiving messages.',
  },
  accent: { zh: '协调员为加拿大口音，语速中等偏快。', en: 'The coordinator has a Canadian accent and speaks fairly quickly.' },
  speechRate: '+5%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'What type of programme will new volunteers help produce?',
          options: [
            { key: 'A', text: 'a weekly music chart' },
            { key: 'B', text: 'a weekly chat show' },
            { key: 'C', text: 'a daily news bulletin' },
          ],
        },
        {
          number: 12,
          stem: 'Where do volunteers record their interviews?',
          options: [
            { key: 'A', text: 'the studio on the second floor' },
            { key: 'B', text: 'the community centre hall' },
            { key: 'C', text: 'the outside broadcast van' },
          ],
        },
        {
          number: 13,
          stem: 'What rule applies to music played in the shows?',
          options: [
            { key: 'A', text: 'It must be recorded live by volunteers' },
            { key: 'B', text: 'It must be licensed and cleared for broadcast' },
            { key: 'C', text: 'It must come from the station’s own band' },
          ],
        },
        {
          number: 14,
          stem: 'What should volunteers check before each shift?',
          options: [
            { key: 'A', text: 'the duty roster' },
            { key: 'B', text: 'the donation box' },
            { key: 'C', text: 'the microphone cables' },
          ],
        },
        {
          number: 15,
          stem: 'How do listeners send comments?',
          options: [
            { key: 'A', text: 'by text to the studio line' },
            { key: 'B', text: 'through the station website form' },
            { key: 'C', text: 'by post to the office' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Chat show goes out every', cells: [[{ blank: 16 }, { text: ' evening' }]] },
        { lead: 'Recording session starts at', cells: [[{ blank: 17 }]] },
        { lead: 'Bring your own', cells: [[{ blank: 18 }]] },
        { lead: 'Keep a copy of the music', cells: [[{ blank: 19 }]] },
        { lead: 'Station records every listener', cells: [[{ blank: 20 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：That programme is a weekly chat show, where local guests talk about their work and hobbies。新志愿者协助每周谈话节目，对应 B。A 的音乐排行榜与 C 的每日新闻在句 4 被明确排除。',
        en: 'Sentence 3: "That programme is a weekly chat show, where local guests talk about their work and hobbies", matching B. The music chart in A and the daily bulletin in C are ruled out in sentence 4.',
      },
    },
    {
      number: 12, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：We record the interviews in the studio on the second floor, above the community hall。录音在二楼演播室，对应 A。句 7 说明大厅用于现场活动，外部转播车留给特别外景。',
        en: 'Sentence 6: "We record the interviews in the studio on the second floor, above the community hall", matching A. Sentence 7 notes the hall hosts live events and the van is reserved for field broadcasts.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：Any music played between segments must be licensed and cleared for broadcast。播出音乐须取得许可并通过广播版权审核，对应 B。句 10 补充个人手机曲目不能直接播放。',
        en: 'Sentence 9: "Any music played between segments must be licensed and cleared for broadcast", matching B. Sentence 10 adds that a personal phone track cannot be played directly.',
      },
    },
    {
      number: 14, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：Before you take the air, please check the duty roster for your name and your segment time。上岗前核对值班表，对应 A。捐款箱与麦克风线在全段未被要求检查。',
        en: 'Sentence 12: "Before you take the air, please check the duty roster for your name and your segment time", matching A. The donation box and microphone cables are not things volunteers must check.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：Listeners stay in touch after the broadcast through the station website form。听众反馈走网站表单，对应 B。句 17 说明短信线只用于紧急信息，普通留言不收邮寄件。',
        en: 'Sentence 15: "Listeners stay in touch after the broadcast through the station website form", matching B. Sentence 17 notes the text line is for urgent messages only, and general comments are not posted.',
      },
    },
    {
      number: 16, accepted: ['Thursday'], evidence: 19,
      explanation: {
        zh: '定位句 19：The chat show goes out every Thursday evening。空后已印 evening，填 Thursday；句 20 的 half past six 是到场时间，不是播出日。',
        en: 'Sentence 19: "The chat show goes out every Thursday evening". Evening is printed, so fill Thursday. Half past six in sentence 20 is the arrival time, not the broadcast day.',
      },
    },
    {
      number: 17, accepted: ['7', 'seven'], spoken: 'seven', evidence: 20,
      explanation: {
        zh: '定位句 20：The recording session starts at seven。录音七点开始；句 20 的 half past six 是提前到场时间，别填进开始时刻。',
        en: 'Sentence 20: "The recording session starts at seven". The session starts at seven; half past six is the earlier arrival time, not the start.',
      },
    },
    {
      number: 18, accepted: ['headphones'], evidence: 21,
      explanation: {
        zh: '定位句 21：Please bring your own headphones, because the studio headsets are shared and limited。自带耳机；句 22 的备用耳机在抽屉里，是应急而非常规配置。',
        en: 'Sentence 21: "Please bring your own headphones, because the studio headsets are shared and limited". Bring headphones; the spare set in sentence 22 is an emergency supply, not the standard arrangement.',
      },
    },
    {
      number: 19, accepted: ['licence'], evidence: 23,
      explanation: {
        zh: '定位句 23：keep a copy of the music licence with the cue sheet for each track。空后已给 music，填 licence；句 24 的 licence number 是许可编号，不是留存对象本身。',
        en: 'Sentence 23: "keep a copy of the music licence with the cue sheet for each track". Music is printed, so fill licence. The licence number in sentence 24 is the reference, not the retained document.',
      },
    },
    {
      number: 20, accepted: ['message'], evidence: 25,
      explanation: {
        zh: '定位句 25：the station records every listener message that arrives through the website form。电台记录每条听众留言；句 26 的 producer 是转交对象，不是记录内容。',
        en: 'Sentence 25: "the station records every listener message that arrives through the website form". The station logs each listener message. The producer in sentence 26 passes them on, but is not the recorded content.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Before the first show of the season, let me run through the volunteer shifts and the recording rules.' },
    { speaker: 'coordinator', text: 'My name is Owen, and I coordinate the volunteers here at Riverbank Community Radio.' },
    { speaker: 'coordinator', text: 'Most of you have signed up to help with our regular evening programme.' },
    { speaker: 'coordinator', text: 'That programme is a weekly chat show, where local guests talk about their work and hobbies.' },
    { speaker: 'coordinator', text: 'It is not a music chart, and we do not read the daily news bulletin on this slot.' },
    { speaker: 'coordinator', text: 'Each volunteer supports one guest segment, taking notes and switching the microphone when needed.' },
    { speaker: 'coordinator', text: 'We record the interviews in the studio on the second floor, above the community hall.' },
    { speaker: 'coordinator', text: 'The hall itself is used for live events, and the outside van is reserved for special field broadcasts.' },
    { speaker: 'coordinator', text: 'Once inside the studio, the first thing to learn is the rule about recorded music.' },
    { speaker: 'coordinator', text: 'Any music played between segments must be licensed and cleared for broadcast.' },
    { speaker: 'coordinator', text: 'That means you cannot play a track from your own phone unless the station holds the right to it.' },
    { speaker: 'coordinator', text: 'Live music from a guest performer is an exception, but a recorded cover still needs clearance.' },
    { speaker: 'coordinator', text: 'Before you take the air, please check the duty roster for your name and your segment time.' },
    { speaker: 'coordinator', text: 'The roster also lists who operates the mixing desk and who greets the guest at the door.' },
    { speaker: 'coordinator', text: 'If your name is missing from the list, tell me before the session rather than after the show.' },
    { speaker: 'coordinator', text: 'Listeners stay in touch after the broadcast through the station website form.' },
    { speaker: 'coordinator', text: 'The form lets them comment on a segment or suggest a guest for a future week.' },
    { speaker: 'coordinator', text: 'A studio text line exists for urgent messages, but general comments are not collected by post.' },
    { speaker: 'coordinator', text: 'Now a few details for this week’s recording, and I will write the key points on the notice board.' },
    { speaker: 'coordinator', text: 'The chat show goes out every Thursday evening, and this week’s guest is a local potter.' },
    { speaker: 'coordinator', text: 'The recording session starts at seven, so volunteers should arrive by half past six to set up.' },
    { speaker: 'coordinator', text: 'Please bring your own headphones, because the studio headsets are shared and limited in number.' },
    { speaker: 'coordinator', text: 'A spare set sits in the drawer, but it is first come, first served for anyone who forgets.' },
    { speaker: 'coordinator', text: 'For copyright reasons, keep a copy of the music licence with the cue sheet for each track.' },
    { speaker: 'coordinator', text: 'The licence number should match the track listed on the running order for that segment.' },
    { speaker: 'coordinator', text: 'After the show, the station records every listener message that arrives through the website form.' },
    { speaker: 'coordinator', text: 'The volunteer on duty passes these messages to the producer before the next week’s recording.' },
    { speaker: 'coordinator', text: 'If a listener asks for a reply, the producer decides whether one is sent back.' },
    { speaker: 'coordinator', text: 'We also keep a short archive of each segment, in case the guest returns later in the year.' },
    { speaker: 'coordinator', text: 'The archive folder sits on the desk behind the mixing console.' },
    { speaker: 'coordinator', text: 'Volunteers are expected to stay for a short debrief after the recording ends.' },
    { speaker: 'coordinator', text: 'During the debrief we note what worked and what to change for the next session.' },
    { speaker: 'coordinator', text: 'Tea and biscuits are available in the volunteer room at the back of the corridor.' },
    { speaker: 'coordinator', text: 'Please do not answer the studio phone during a live take, unless the producer nods to you.' },
    { speaker: 'coordinator', text: 'Cables along the floor are taped down, but still walk around them rather than trip over the ends.' },
    { speaker: 'coordinator', text: 'New volunteers shadow an experienced member for the first two shifts before working alone.' },
    { speaker: 'coordinator', text: 'The shadow session covers cueing, level setting and handing the microphone to the guest.' },
    { speaker: 'coordinator', text: 'If anything about the rules is unclear, raise it during the debrief rather than on air.' },
    { speaker: 'coordinator', text: 'That covers the schedule, the equipment, the music rights and the feedback channel.' },
    { speaker: 'coordinator', text: 'I’ll hand the sheet around now, and you can write your name beside your chosen segment.' },
    { speaker: 'coordinator', text: 'Thank you for coming along, and I look forward to the first broadcast.' },
  ],
  vocabulary: [
    {
      term: 'segment', phonetic: '/ˈseɡmənt/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '（节目中的）一段，环节', en: 'one part of a broadcast, such as one guest interview' },
      usage: { zh: '可数名词；one segment、guest segment、segment time。', en: 'Countable: one segment, a guest segment, segment time.' },
      collocations: ['a guest segment', 'the next segment', 'segment on the running order'],
      example: { en: 'Each volunteer supports one segment of the show.', zh: '每位志愿者负责节目中的一个环节。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈseɡ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'roster', phonetic: '/ˈrɒstə/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '值班表，排班名单', en: 'a list showing who works which shift' },
      usage: { zh: '可数名词；duty roster、check the roster。', en: 'Countable: a duty roster, check the roster.' },
      collocations: ['the duty roster', 'on the roster', 'check the roster'],
      example: { en: 'Find your name and time on the duty roster.', zh: '在值班表上找到你的名字和时段。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈrɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'licensed', phonetic: '/ˈlaɪsnst/', partOfSpeech: 'adj.', sentenceIndex: 9,
      meaning: { zh: '取得许可的，有版权授权的', en: 'allowed by an official permission to be broadcast' },
      usage: { zh: '动词 license 的过去分词；licensed music、licensed track。名词 licence。', en: 'Past participle of license: licensed music, a licensed track; the noun is licence.' },
      collocations: ['licensed music', 'licensed tracks', 'properly licensed'],
      example: { en: 'Every played track must be licensed first.', zh: '播放的每首曲目都必须先取得授权。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlaɪ/，结尾 /nst/。', en: 'Two syllables with first-syllable stress, ending /nst/.' },
    },
    {
      term: 'clearance', phonetic: '/ˈklɪərəns/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '（版权）审核通过，许可', en: 'official confirmation that material may be broadcast' },
      usage: { zh: '不可数名词；needs clearance、music clearance。动词 clear。', en: 'Uncountable: needs clearance, music clearance; the verb is clear.' },
      collocations: ['music clearance', 'needs clearance', 'broadcast clearance'],
      example: { en: 'A recorded cover still needs clearance.', zh: '录制的翻唱仍需版权审核。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈklɪə/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '档案，存档', en: 'a kept record of past segments or programmes' },
      usage: { zh: '可数名词；keep an archive、the archive folder。动词同形，重音可在第二音节。', en: 'Countable: keep an archive, the archive folder; the verb may stress the second syllable.' },
      collocations: ['a short archive', 'the archive folder', 'keep an archive'],
      example: { en: 'The archive stores each segment for the year.', zh: '档案保存全年的每一段节目。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'debrief', phonetic: '/ˌdiːˈbriːf/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '复盘，事后讨论', en: 'a short talk after an event to review what worked' },
      usage: { zh: '可数名词；after the debrief、hold a debrief。动词 debrief。', en: 'Countable: after the debrief, hold a debrief; the verb is debrief.' },
      collocations: ['a short debrief', 'during the debrief', 'the post-show debrief'],
      example: { en: 'The team meets for a debrief after each recording.', zh: '每次录制后团队开复盘会。' },
      listening: { zh: '重音在第二音节 /ˈbriː/，长音。', en: 'Stress the second syllable with a long /iː/.' },
    },
    {
      term: 'cueing', phonetic: '/ˈkjuːɪŋ/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '提示衔接，给信号', en: 'signalling when a segment, track or microphone should start' },
      usage: { zh: '动词 cue 的动名词；cueing a track、cueing the guest。', en: 'Gerund of cue: cueing a track, cueing the guest.' },
      collocations: ['cueing practice', 'cueing the music', 'cueing the segment'],
      example: { en: 'The shadow session covers cueing between tracks.', zh: '跟岗练习包含曲目之间的衔接提示。' },
      listening: { zh: '两个音节，cue 读 /kjuː/，结尾 /ɪŋ/。', en: 'Two syllables, cue is /kjuː/, ending /ɪŋ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐条讲一遍，过一遍', en: 'to explain the main rules and items one by one' },
      usage: { zh: '及物短语动词；run through the rules、run through the schedule。', en: 'Transitive: run through the rules, run through the schedule.' },
      example: { en: 'Let me run through the shifts before the show.', zh: '节目开始前我把班次讲一遍。' },
    },
    {
      phrase: 'taking notes', sentenceIndex: 5,
      meaning: { zh: '做记录', en: 'to write down what the guest says during the segment' },
      usage: { zh: '动名词短语；take notes on the guest、take notes during the interview。', en: 'Gerund: take notes on the guest, during the interview.' },
      example: { en: 'The volunteer sits beside the guest taking notes.', zh: '志愿者坐在嘉宾旁做记录。' },
    },
    {
      phrase: 'take the air', sentenceIndex: 12,
      meaning: { zh: '上岗播出，进入直播', en: 'to go on air and begin the broadcast' },
      usage: { zh: '电台口语；before you take the air、take the air at seven。', en: 'Radio speech: before you take the air, take the air at seven.' },
      example: { en: 'Check the roster before you take the air.', zh: '上岗播出前先核对值班表。' },
    },
    {
      phrase: 'first come, first served', sentenceIndex: 22,
      meaning: { zh: '先到先得', en: 'given to whoever arrives earliest' },
      usage: { zh: '固定俗语；用于限量物品的分配规则。', en: 'A fixed idiom for limited items allocated by arrival order.' },
      example: { en: 'The spare headsets are first come, first served.', zh: '备用耳机先到先得。' },
    },
    {
      phrase: 'shadow an experienced member', sentenceIndex: 35,
      meaning: { zh: '跟岗熟悉，跟着老手学习', en: 'to follow and watch an experienced volunteer before working alone' },
      usage: { zh: 'shadow 作动词；shadow a colleague、shadow the producer。', en: 'Shadow as a verb: shadow a colleague, shadow the producer.' },
      example: { en: 'New volunteers shadow an experienced member first.', zh: '新志愿者先跟老手跟岗。' },
    },
    {
      phrase: 'hand the sheet around', sentenceIndex: 39,
      meaning: { zh: '把单子传阅下去', en: 'to pass a paper form from person to person' },
      usage: { zh: '短语动词；hand around the sheet、hand around the list。', en: 'Phrasal verb: hand around the sheet, hand around the list.' },
      example: { en: 'I’ll hand the signup sheet around now.', zh: '我现在把报名表传下去。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白跟着节目板块走', en: 'Follow the programme sections' },
      body: {
        zh: 'Part 2 没有对话提示下一题。节目类型、录音地点、版权规则、值班表、反馈渠道依次出现；听到 studio、music、roster、website form 这类板块词就检查自己填到了哪一题。',
        en: 'Nobody prompts the next item. Programme type, studio location, music rule, roster and feedback channel appear in order; at studio, music, roster and website form, check your current question.',
      },
    },
    {
      title: { zh: '干扰项常是另一场所或渠道', en: 'Distractors are other venues or channels' },
      body: {
        zh: '大厅、外部转播车、短信线、邮寄都在原文里出现，但分别属于现场活动、外景、紧急信息和非常规渠道。选项把另一处的规则安到题干场所上，听时抓住介词短语里的地点限定。',
        en: 'The hall, outside van, text line and post all appear, but belong to live events, field broadcasts, urgent messages and non-standard channels. Options attach another place’s rule to the stem; catch the location phrase in each sentence.',
      },
    },
    {
      title: { zh: '时间题分清到场与开始', en: 'Separate arrival from start time' },
      body: {
        zh: 'half past six 是提前到场布置，seven 才是录音开始；Thursday 是播出日。听到时间先问它服务于到场、开始还是播出，再填进对应空。',
        en: 'Half past six is the setup arrival, seven is the recording start, and Thursday is the broadcast day. Ask whether each time applies to arrival, start or airing before filling the gap.',
      },
    },
  ],
};
