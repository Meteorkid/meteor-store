import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 28 · Part 1 — 社区合唱团试唱咨询（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 报名者先开口问名额。表单填空 1–4 按对话顺序出现，单选 5–7 落在声部、试唱内容与演出义务，
 * 表格 8–10 是排练、介绍晚会与下一场音乐会的安排。题块顺序与录音一致。
 */
export const test28Part1: ListeningLesson = {
  slug: 'test-28-part-1',
  part: 1,
  status: 'published',
  title: { zh: '社区合唱团试唱', en: 'Auditioning for a community choir' },
  summary: {
    zh: '一名男青年致电社区合唱团咨询试唱：姓氏、试唱日期、过往演唱年限与年会费，秘书介绍他适合的男中音声部、试唱时的视唱环节、新成员一年两场的非正式演出，并安排排练晚会、介绍晚会与十二月音乐会。',
    en: 'A young man phones about joining the community choir: surname, audition date, years of singing experience and annual fee. The secretary explains the baritone line that suits him, the sight-reading part of the audition, the two informal shows a year for new members, and the rehearsal evening, introduction evening and December concert.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'applicant', label: 'APPLICANT', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Audition date', cells: [[{ blank: 2 }]] },
        { lead: 'Years of singing experience', cells: [[{ blank: 3 }]] },
        { lead: 'Annual fee', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'Which voice part will the applicant be asked to sing?',
          options: [
            { key: 'A', text: 'the tenor line' },
            { key: 'B', text: 'the baritone line' },
            { key: 'C', text: 'the bass line' },
          ],
        },
        {
          number: 6,
          stem: 'What does the audition involve?',
          options: [
            { key: 'A', text: 'sight-reading a short hymn' },
            { key: 'B', text: 'performing a prepared song' },
            { key: 'C', text: 'learning a group harmony round' },
          ],
        },
        {
          number: 7,
          stem: 'What performance obligation do new members have?',
          options: [
            { key: 'A', text: 'one paid cathedral concert each term' },
            { key: 'B', text: 'two informal shows a year' },
            { key: 'C', text: 'a monthly public workshop' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Arrangement', 'Day', 'Time'],
      rows: [
        { lead: 'Rehearsal evening', cells: [[{ blank: 8 }], [{ text: 'seven thirty' }]] },
        { lead: 'Introduction evening', cells: [[{ text: 'Thursday' }], [{ blank: 9 }]] },
        { lead: 'Next concert', cells: [[{ blank: 10 }], [{ text: 'from seven o’clock' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Hall'], evidence: 4,
      explanation: {
        zh: '定位句 4：报名者逐字母拼出 Hall。先写下首字母 H，再跟着读音补；注意双写 l，不要写成 Hal。',
        en: 'Sentence 4: the applicant spells the surname out as H, A, L, L. Write the first letter and fill in the rest; keep the double l and do not write Hal.',
      },
    },
    {
      number: 2, accepted: ['21 October', 'October 21'], spoken: 'the twenty-first of October', evidence: 6,
      explanation: {
        zh: '定位句 6：Would the twenty-first of October suit you? 日期按英式 21 October 书写；句 7 只是确认该日期有空，不另给日期。',
        en: 'Sentence 6: "Would the twenty-first of October suit you?". Write the date in British order, 21 October. Sentence 7 only confirms the date is free; it does not give another date.',
      },
    },
    {
      number: 3, accepted: ['2'], spoken: 'two years', evidence: 8,
      explanation: {
        zh: '定位句 8：I sang in the school choir for two years。空格前已印 Years of singing experience，填数字 two；句 8 的 adult group 只是对比背景，不是年限。',
        en: 'Sentence 8: "I sang in the school choir for two years". Years of singing experience is printed, so write the number two. The adult group in the same sentence is only contrast, not a duration.',
      },
    },
    {
      number: 4, accepted: ['42'], spoken: 'forty-two pounds', evidence: 11,
      explanation: {
        zh: '定位句 11：There’s an annual fee of forty-two pounds。表格已印 £，只填数字；句 13 的 trial month 是退费规则，不是费用金额。',
        en: 'Sentence 11: "There’s an annual fee of forty-two pounds". The pound sign is printed, so write the number only. The trial month in sentence 13 is a refund rule, not a charge.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Then you would be asked to sing the baritone line。男中音声部对应 B；A 的 tenor 由句 19 说明人手已满，C 的 bass 全程未被推荐。',
        en: 'Sentence 17: "Then you would be asked to sing the baritone line". The baritone matches B. Tenor in A is already full in sentence 19, and bass in C is never recommended.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：You will be given a short hymn to sight-read once。视唱一首赞美诗对应 A；B 的自备曲目被句 23 明确说不需要，C 的分组轮唱在讲解中没有出现。',
        en: 'Sentence 21: "You will be given a short hymn to sight-read once". Sight-reading a hymn matches A. A prepared song in B is not required in sentence 23, and a group round in C is never mentioned.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：New members take part in two informal shows a year。一年两场非正式演出对应 B；A 的付费大教堂音乐会是可选的（句 27），C 的每月公开练习在讲解中未出现。',
        en: 'Sentence 25: "New members take part in two informal shows a year". Two informal matches B. Paid cathedral concerts in A are optional in sentence 27, and a monthly workshop in C is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['Tuesday'], evidence: 29,
      explanation: {
        zh: '定位句 29：Rehearsals run on Tuesday evenings in the main hall, starting at seven thirty。先用 Rehearsal evening 和时间 seven thirty 锁定这一行，缺的是星期 Tuesday。',
        en: 'Sentence 29: "Rehearsals run on Tuesday evenings in the main hall, starting at seven thirty". Use Rehearsal evening and seven thirty to locate the row; the missing day is Tuesday.',
      },
    },
    {
      number: 9, accepted: ['six thirty'], evidence: 31,
      explanation: {
        zh: '定位句 31：an introduction evening on Thursday at six thirty。首列 Introduction evening、星期 Thursday 已给出，缺的是时间 six thirty；句 32 的 ask questions 是环节内容，不是时间点。',
        en: 'Sentence 31: "an introduction evening on Thursday at six thirty". Introduction evening and Thursday are printed, so the missing time is six thirty. Asking questions in sentence 32 is an activity, not a time.',
      },
    },
    {
      number: 10, accepted: ['Saturday'], evidence: 33,
      explanation: {
        zh: '定位句 33：Our next public concert is on Saturday the eighth of December。首列 Next concert、结束前 from seven o’clock 已印出，缺的是星期 Saturday。',
        en: 'Sentence 33: "Our next public concert is on Saturday the eighth of December". The first column is Next concert and from seven o’clock is printed, so the missing day is Saturday.',
      },
    },
  ],
  transcript: [
    { speaker: 'applicant', text: 'Hi, I’m phoning about joining the community choir. My first name is Tom.' },
    { speaker: 'coordinator', text: 'Hello Tom, thanks for calling. I’m Mara, the choir secretary, and I’ll take your details first.' },
    { speaker: 'applicant', text: 'Great. I saw the notice on the community centre website last week.' },
    { speaker: 'coordinator', text: 'Fine. Could I have your surname, please?' },
    { speaker: 'applicant', text: 'It’s Hall. That’s H, A, L, L.' },
    { speaker: 'coordinator', text: 'Hall, thank you. And when would you like to come to the audition?' },
    { speaker: 'applicant', text: 'Would the twenty-first of October suit you?' },
    { speaker: 'coordinator', text: 'The twenty-first of October is free. I’ll put you down for that evening.' },
    { speaker: 'applicant', text: 'I sang in the school choir for two years, but I haven’t sung with an adult group before.' },
    { speaker: 'coordinator', text: 'That’s quite normal. The audition is short, and you will not be asked to prepare anything complicated.' },
    { speaker: 'applicant', text: 'Is there a membership fee to join the choir?' },
    { speaker: 'coordinator', text: 'There’s an annual fee of forty-two pounds, which covers the sheet music and the rehearsal room.' },
    { speaker: 'applicant', text: 'Is it refundable if I have to drop out before the concerts?' },
    { speaker: 'coordinator', text: 'The first month is a trial, and after that the fee is non-refundable, but you can pause it if you travel for work.' },
    { speaker: 'applicant', text: 'I see. Now, what voice part do you think suits me?' },
    { speaker: 'coordinator', text: 'Let me hear you describe your range first.' },
    { speaker: 'applicant', text: 'I can hold middle C comfortably, and I do not reach the high treble notes easily.' },
    { speaker: 'coordinator', text: 'Then you would be asked to sing the baritone line. It sits between tenor and bass and suits a warm middle voice.' },
    { speaker: 'applicant', text: 'So not the tenor part, then?' },
    { speaker: 'coordinator', text: 'Tenor carries the higher harmony, and we already have enough tenors this term. Baritone is where we are short.' },
    { speaker: 'applicant', text: 'What happens during the audition itself?' },
    { speaker: 'coordinator', text: 'You will be given a short hymn to sight-read once, and the director will note whether you keep the pitch and follow the rhythm.' },
    { speaker: 'applicant', text: 'Do I need to bring a prepared song?' },
    { speaker: 'coordinator', text: 'No prepared piece is required. You can bring a recording if you want, but it is not part of the mark.' },
    { speaker: 'applicant', text: 'And after I join, what performances are expected of me?' },
    { speaker: 'coordinator', text: 'New members take part in two informal shows a year, usually one before Christmas and one in the summer, and there is no charge to the audience.' },
    { speaker: 'applicant', text: 'Are there any paid concerts we would have to sing in?' },
    { speaker: 'coordinator', text: 'The paid cathedral concerts are optional, and members choose whether to sign up for those.' },
    { speaker: 'applicant', text: 'When do the regular rehearsals start?' },
    { speaker: 'coordinator', text: 'Rehearsals run on Tuesday evenings in the main hall, starting at seven thirty and finishing by nine thirty.' },
    { speaker: 'applicant', text: 'Tuesday evenings suit me. Where is the hall exactly?' },
    { speaker: 'coordinator', text: 'There is also an introduction evening on Thursday at six thirty, when you meet the section leads and try the harmony lines.' },
    { speaker: 'applicant', text: 'Thursday at six thirty. That gives me a chance to ask questions before the first rehearsal.' },
    { speaker: 'coordinator', text: 'Our next public concert is on Saturday the eighth of December, and new members usually watch from the back row before they sing.' },
    { speaker: 'applicant', text: 'Saturday the eighth of December. That gives me a few months to settle in.' },
    { speaker: 'coordinator', text: 'Before you come, print the short scale sheet we will send by email, and bring any music you already read.' },
    { speaker: 'applicant', text: 'Should I bring a copy of my sight-reading books?' },
    { speaker: 'coordinator', text: 'No need. We lend the sheet music in the room, and it stays there between rehearsals.' },
    { speaker: 'applicant', text: 'What if I miss a rehearsal?' },
    { speaker: 'coordinator', text: 'You can tell the section lead in advance, and recordings of the practice are shared in the group chat.' },
    { speaker: 'applicant', text: 'Is there a dress code for the shows?' },
    { speaker: 'coordinator', text: 'A plain dark top and black trousers or skirt, and the choir lends the scarves for the concerts.' },
    { speaker: 'applicant', text: 'Thanks, that all sounds clear.' },
    { speaker: 'coordinator', text: 'Let me read the details back. Hall, audition the twenty-first of October, two years of experience, annual fee forty-two pounds, baritone line.' },
    { speaker: 'applicant', text: 'That matches what we discussed.' },
    { speaker: 'coordinator', text: 'I will email the map and the scale sheet this afternoon. Is there anything else?' },
    { speaker: 'applicant', text: 'No, that is everything. I will see you on the twenty-first.' },
    { speaker: 'coordinator', text: 'You are welcome. Enjoy the first rehearsal, Tom.' },
  ],
  vocabulary: [
    {
      term: 'choir', phonetic: '/ˈkwaɪə/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '合唱团，歌咏队', en: 'a group of people who sing together' },
      usage: { zh: '可数；join a choir、the choir secretary。church choir 指教堂唱诗班。', en: 'Countable: join a choir, the choir secretary. A church choir sings during services.' },
      collocations: ['join the choir', 'the community choir', 'the choir rehearsal'],
      example: { en: 'She sings alto in the local community choir.', zh: '她在社区合唱团唱女低音。' },
      listening: { zh: '单音节，双元音 /aɪ/ 后接 /ə/，不要拆成两个音节。', en: 'One syllable; the /aɪ/ runs into /ə/, not two beats.' },
    },
    {
      term: 'audition', phonetic: '/ɔːˈdɪʃn/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '试唱，试听选拔（加入团体前的演唱考核）', en: 'a short singing test to decide whether someone can join a group' },
      usage: { zh: '可数；come to the audition、audition date。动词 audition 后可接 for。', en: 'Countable: come to the audition, audition date. The verb takes for.' },
      collocations: ['the audition date', 'an audition piece', 'audition for the choir'],
      example: { en: 'The audition lasts ten minutes and includes a short hymn.', zh: '试唱十分钟，含一首短赞美诗。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdɪʃ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'baritone', phonetic: '/ˈbærɪtəʊn/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '男中音（介于男高音与男低音之间的声部）', en: 'the middle male voice, between tenor and bass' },
      usage: { zh: '可数；sing the baritone line。对照 tenor 男高音、bass 男低音。', en: 'Countable: sing the baritone line. Compare tenor and bass.' },
      collocations: ['the baritone line', 'a warm baritone voice', 'sing baritone'],
      example: { en: 'His middle voice suits the baritone line.', zh: '他的中音嗓音适合男中音声部。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈbær/，结尾 /təʊn/。', en: 'Three syllables with stress on the first; final /təʊn/.' },
    },
    {
      term: 'sight-read', phonetic: '/ˈsaɪt riːd/', partOfSpeech: 'v.', sentenceIndex: 21,
      meaning: { zh: '视唱，看着谱子当场演唱', en: 'to sing or play music you have not practised before' },
      usage: { zh: '可分开；sight-read a hymn。名词 sight-reading。', en: 'Separable: sight-read a hymn. The noun is sight-reading.' },
      collocations: ['sight-read a hymn', 'sight-read the notes', 'good at sight-reading'],
      example: { en: 'You read the hymn once and keep the pitch steady.', zh: '你把赞美诗唱一遍，稳住音高。' },
      listening: { zh: '复合词两部分都重读，read 此处读 /riːd/ 原形。', en: 'Both parts are stressed; read keeps its base form /riːd/.' },
    },
    {
      term: 'harmony', phonetic: '/ˈhɑːməni/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '和声（与主旋律配合的声部）', en: 'the supporting notes that fit with the main melody' },
      usage: { zh: '不可数；sing the harmony、harmony lines。对照 melody 主旋律。', en: 'Uncountable: sing the harmony, harmony lines. Compare melody.' },
      collocations: ['the harmony lines', 'sing the harmony', 'group harmony'],
      example: { en: 'The section leads help you try the harmony lines.', zh: '声部负责人带你试和声线条。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /ni/ 轻读。', en: 'Three syllables, stressed on the first, light final /ni/.' },
    },
    {
      term: 'sheet music', phonetic: '/ʃiːt ˈmjuːzɪk/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '乐谱（印在纸上的曲谱）', en: 'printed pages of musical notes for a song' },
      usage: { zh: '不可数；borrow the sheet music。不可写成 sheetmusics。', en: 'Uncountable: borrow the sheet music. There is no plural sheetmusics.' },
      collocations: ['lend the sheet music', 'the choir’s sheet music', 'read sheet music'],
      example: { en: 'The fee covers the sheet music for the term.', zh: '会费包含本学期的乐谱。' },
      listening: { zh: 'sheet 长元音 /ʃiːt/，music 重音在第一音节 /ˈmjuː/。', en: 'sheet has long /ʃiːt/; music stresses /ˈmjuː/.' },
    },
    {
      term: 'non-refundable', phonetic: '/ˌnɒn rɪˈfʌndəbl/', partOfSpeech: 'adj.', sentenceIndex: 13,
      meaning: { zh: '不退费的，不可退还的', en: 'money that will not be given back if the arrangement ends' },
      usage: { zh: '费用场景；non-refundable fee。反义 refundable。', en: 'Used with charges: non-refundable fee. The opposite is refundable.' },
      collocations: ['a non-refundable fee', 'non-refundable deposit', 'fully non-refundable'],
      example: { en: 'After the trial month the fee is non-refundable.', zh: '试用月过后费用不予退还。' },
      listening: { zh: '前缀 non 轻读，重音在 /ˈfʌn/ 音节。', en: 'The non- prefix is reduced; stress falls on /ˈfʌn/.' },
    },
  ],
  expressions: [
    {
      phrase: 'put you down', sentenceIndex: 7,
      meaning: { zh: '把你登记在（名单上）', en: 'to record someone’s name for an arrangement' },
      usage: { zh: '及物；put somebody down for the evening。代词放在 down 前。', en: 'Transitive: put somebody down for the evening. The pronoun sits before down.' },
      example: { en: 'I’ll put you down for the twenty-first.', zh: '我把你登记到二十一号。' },
    },
    {
      phrase: 'drop out', sentenceIndex: 12,
      meaning: { zh: '退出，不再参加', en: 'to leave a group or course before it ends' },
      usage: { zh: '不及物；drop out before the concerts。名词 dropout。', en: 'Intransitive: drop out before the concerts. The noun is dropout.' },
      example: { en: 'You can pause the fee if you have to drop out.', zh: '不得不退出时可以暂停缴费。' },
    },
    {
      phrase: 'sits between', sentenceIndex: 17,
      meaning: { zh: '位于两者之间（声部音域）', en: 'to occupy the middle position between two others' },
      usage: { zh: '及物；the line sits between tenor and bass。', en: 'Transitive: the line sits between tenor and bass.' },
      example: { en: 'The baritone sits between tenor and bass.', zh: '男中音位于男高音与男低音之间。' },
    },
    {
      phrase: 'sign up', sentenceIndex: 27,
      meaning: { zh: '报名参加（可选活动）', en: 'to register for an optional event or group' },
      usage: { zh: '可分开；sign up for the concerts。名词 sign-up。', en: 'Separable: sign up for the concerts. The noun is sign-up.' },
      example: { en: 'Members choose whether to sign up for the paid shows.', zh: '成员自行决定是否报名付费演出。' },
    },
    {
      phrase: 'settle in', sentenceIndex: 34,
      meaning: { zh: '适应下来，进入状态', en: 'to grow comfortable in a new group or routine' },
      usage: { zh: '不及物；settle in before the concert。', en: 'Intransitive: settle in before the concert.' },
      example: { en: 'A few months give him time to settle in.', zh: '几个月时间让他慢慢适应。' },
    },
    {
      phrase: 'read the details back', sentenceIndex: 43,
      meaning: { zh: '把登记信息复述一遍核对', en: 'to repeat recorded information aloud for checking' },
      usage: { zh: '及物；read the details back to you。back 可移到代词后。', en: 'Transitive: read the details back to you. Back can follow the pronoun.' },
      example: { en: 'The secretary reads the details back to confirm.', zh: '秘书复述信息以便核对。' },
    },
  ],
  tips: [
    {
      title: { zh: '先分清费用、日期和年限', en: 'Separate fees, dates and durations' },
      body: {
        zh: 'Part 1 常把会费、日期、年限和星期混在一段里。听到 fee、pounds 记费用；date、October 记日期；years、for 记年限；evening、day 记星期。落笔前先看空格要哪一类。',
        en: 'Part 1 mixes fees, dates, durations and days in one flow. Note charges after fee or pounds; dates after date or October; years after years or for; days after evening or day. Check which type the gap needs.',
      },
    },
    {
      title: { zh: '声部分清高、中、低三条线', en: 'Match the voice range' },
      body: {
        zh: '单选 5 先听清三个声部：tenor 高音、baritone 中音、bass 低音。报名者说自己 hold middle C、上不去高音，正是判断他进中音声部的依据；别把缺人的声部和他适合的声部混为一谈。',
        en: 'Before choice 5, note the three parts: tenor high, baritone middle, bass low. The applicant holding middle C and missing high notes places him in the middle. Do not confuse the part the choir needs with the one that suits him.',
      },
    },
    {
      title: { zh: '表格题先按行找已给信息', en: 'Locate the row from printed clues' },
      body: {
        zh: '安排表先用已印的 Arrangement 和 Time 找行：第 8 行时间已给、缺星期；第 9 行星期已给、缺时间；第 10 行开场时间已给、缺星期。不要把 nine thirty、twenty minutes 这类时长写进时间空格。',
        en: 'For the arrangement table, use the printed Arrangement and Time to find each row: row 8 has the time and needs a day; row 9 has Thursday and needs a time; row 10 has the start time and needs a day. Do not write durations such as nine thirty into a time gap.',
      },
    },
  ],
};
