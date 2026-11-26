import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 10 · Part 2 — 图书馆改造进度说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白前半段讲施工分区、临时借阅点、噪音时段与新设施，对应五道单选；
 * 后半段讲开放时间、归还处理、预约渠道与休息安排，对应五道笔记填空。
 * 题块顺序与录音顺序一致。
 */
export const test10Part2: ListeningLesson = {
  slug: 'test-10-part-2',
  part: 2,
  status: 'published',
  title: { zh: '图书馆改造进度说明', en: 'An update on library renovation' },
  summary: {
    zh: '图书馆员向读者说明改造进展：哪些区域先后封闭、临时借阅点设在哪里、噪音集中在什么时段、二楼新增哪些设施，以及重新开放的时间表和借阅规则。',
    en: 'A librarian updates readers on the renovation: which areas close first, where the temporary loans point is, when the noise is heaviest, what new rooms open on the second floor, and the timetable for reopening along the borrowing rules.',
  },
  accent: { zh: '男馆员为加拿大口音，语速中等偏快。', en: 'The male librarian has a Canadian accent and speaks fairly quickly.' },
  speechRate: '+5%',
  cast: [
    { id: 'librarian', label: 'LIBRARIAN', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'Which area is closed first?',
          options: [
            { key: 'A', text: 'the ground floor reference section' },
            { key: 'B', text: 'the first floor fiction collection' },
            { key: 'C', text: 'the basement archive' },
          ],
        },
        {
          number: 12,
          stem: 'Where is the temporary borrowing point?',
          options: [
            { key: 'A', text: 'inside the old café' },
            { key: 'B', text: 'the community centre next door' },
            { key: 'C', text: 'a mobile unit by the front steps' },
          ],
        },
        {
          number: 13,
          stem: 'When is the noise heaviest?',
          options: [
            { key: 'A', text: 'in the morning' },
            { key: 'B', text: 'in the afternoon' },
            { key: 'C', text: 'in the evening' },
          ],
        },
        {
          number: 14,
          stem: 'What new facility opens on the second floor?',
          options: [
            { key: 'A', text: 'a quiet study room' },
            { key: 'B', text: 'a makers’ workshop' },
            { key: 'C', text: 'a children’s play area' },
          ],
        },
        {
          number: 15,
          stem: 'When does the whole library reopen?',
          options: [
            { key: 'A', text: 'early March' },
            { key: 'B', text: 'mid April' },
            { key: 'C', text: 'late May' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Temporary point opens at', cells: [[{ blank: 16 }, { text: ' in the morning' }]] },
        { lead: 'Books in the old drop box are checked', cells: [[{ blank: 17 }, { text: ' each day' }]] },
        { lead: 'Workshop equipment: three D printers and a', cells: [[{ blank: 18 }]] },
        { lead: 'Reserve missing books through the online', cells: [[{ blank: 19 }]] },
        { lead: 'Temporary point is closed on', cells: [[{ blank: 20 }, { text: ' afternoons' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：The first area shut is the first floor fiction collection。先封的是一楼小说区。参考区本周仍开放（句 4），档案库最后受影响（句 5），是两个干扰项。',
        en: 'Sentence 3: "The first area shut is the first floor fiction collection". The fiction collection closes first. The reference section stays open this week, and the archive is affected last, so A and C are distractors.',
      },
    },
    {
      number: 12, accepted: ['C'], evidence: 8,
      explanation: {
        zh: '定位句 8：a small mobile unit parked by the front steps。临时点是门前台阶旁的移动单元。句 7 明确排除旧咖啡馆和隔壁社区中心。',
        en: 'Sentence 8: "a small mobile unit parked by the front steps". The point is the mobile unit by the steps. Sentence 7 rules out the old café and the community centre next door.',
      },
    },
    {
      number: 13, accepted: ['A'], evidence: 13,
      explanation: {
        zh: '定位句 13：The drilling and demolition happen mainly in the morning, between nine and twelve。噪音集中在上午；句 14 说下午工序更安静。',
        en: 'Sentence 13: "The drilling and demolition happen mainly in the morning, between nine and twelve". The noise is heaviest in the morning; sentence 14 states the afternoon tasks are quieter.',
      },
    },
    {
      number: 14, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The first is a makers’ workshop, with machines for hands-on projects。二楼新设施是创客工坊。句 20 的儿童游乐区被推迟到明年阶段，句 19 提到的现有自习室不是新增。',
        en: 'Sentence 19: "The first is a makers’ workshop, with machines for hands-on projects". The new facility is the workshop. The play area in sentence 20 is postponed to next year, and the existing study room is not new.',
      },
    },
    {
      number: 15, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：the whole building, including the archive, reopens in late May。整馆五月下旬重开。early March 是小说区先重开，mid April 是工坊开放，都不是全馆时间。',
        en: 'Sentence 24: "the whole building, including the archive, reopens in late May". The whole library reopens in late May. Early March brings the fiction floor back, and mid April opens the workshop; neither is the full reopening.',
      },
    },
    {
      number: 16, accepted: ['9', 'nine'], spoken: 'nine', evidence: 26,
      explanation: {
        zh: '定位句 26：It opens at nine in the morning。空后已印 in the morning，填数字 nine；句中 eight forty-five 是排队最早时间，不是开门时间。',
        en: 'Sentence 26: "It opens at nine in the morning". In the morning is already printed, so write nine. Eight forty-five is the earliest queue time, not the opening time.',
      },
    },
    {
      number: 17, accepted: ['twice'], evidence: 27,
      explanation: {
        zh: '定位句 27：Returns left in the old outdoor drop box are checked twice each day。旧还书箱每天清点两次；句中 before lunch 和 before closing 是两次的具体时刻，不是答案。',
        en: 'Sentence 27: "Returns left in the old outdoor drop box are checked twice each day". The box is checked twice a day; before lunch and before closing are the two times, not the answer itself.',
      },
    },
    {
      number: 18, accepted: ['scanner'], evidence: 28,
      explanation: {
        zh: '定位句 28：a scanner for copying small objects, along with basic hand tools。工坊设备除三维打印机外还有扫描仪；hand tools 是另一类工具，不填进本空。',
        en: 'Sentence 28: "a scanner for copying small objects, along with basic hand tools". The workshop has a scanner beside the printers; hand tools are the other equipment and do not fill this gap.',
      },
    },
    {
      number: 19, accepted: ['catalogue'], evidence: 29,
      explanation: {
        zh: '定位句 29：you can reserve it through the online catalogue。找不到的书通过在线目录预约；account page 在句 30，是续借入口，不是预约目录。',
        en: 'Sentence 29: "you can reserve it through the online catalogue". Missing books are reserved through the catalogue. The account page in sentence 30 is where renewals are handled, not the catalogue.',
      },
    },
    {
      number: 20, accepted: ['Sundays'], evidence: 31,
      explanation: {
        zh: '定位句 31：The temporary point is closed on Sunday afternoons。空后已印 afternoons，填 Sundays；句中 four on Sundays 是整馆开门到的时间，不是关闭时段。',
        en: 'Sentence 31: "The temporary point is closed on Sunday afternoons". Afternoons is already printed, so write Sundays. Until four on Sundays is the building’s opening time, not the closed slot.',
      },
    },
  ],
  transcript: [
    { speaker: 'librarian', text: 'Before you go in, everyone, I have a few updates about the renovation works on this floor. Please stay with me for a minute.' },
    { speaker: 'librarian', text: 'My name is Owen, and I’ll walk you through what is closed, where you can borrow books, and when the building reopens.' },
    { speaker: 'librarian', text: 'The works began last Monday, and they are taking place in three stages across the building.' },
    { speaker: 'librarian', text: 'The first area shut is the first floor fiction collection, where new shelves and reading lights are being fitted.' },
    { speaker: 'librarian', text: 'The ground floor reference section stays open this week, but it will close once the fiction work is finished.' },
    { speaker: 'librarian', text: 'The basement archive is the last area affected, so old newspapers and local records remain available for now.' },
    { speaker: 'librarian', text: 'While the fiction shelves are out of use, you can still borrow books from a temporary point near the main entrance.' },
    { speaker: 'librarian', text: 'That point is not inside the old café, which itself is being painted, and it is not the community centre next door.' },
    { speaker: 'librarian', text: 'It is a small mobile unit parked by the front steps, marked with a blue sign that says Temporary Loans.' },
    { speaker: 'librarian', text: 'Staff there can issue and return ordinary loans, but they cannot help with rare archive items.' },
    { speaker: 'librarian', text: 'If you are looking for a study desk, the ground floor seats are available throughout the day.' },
    { speaker: 'librarian', text: 'The reference section holds dictionaries, atlases and past exam papers, which stay on their usual shelves this week.' },
    { speaker: 'librarian', text: 'We want to warn you about the noise during the next two weeks.' },
    { speaker: 'librarian', text: 'The drilling and demolition happen mainly in the morning, between nine and twelve.' },
    { speaker: 'librarian', text: 'Afternoons are quieter, because the crew moves to tasks that do not make as much noise.' },
    { speaker: 'librarian', text: 'If you need a quiet place to read, the seats at the back of the ground floor are the most sheltered.' },
    { speaker: 'librarian', text: 'The lift between floors will be out of service while the fiction floor is repaired, so please use the stairs.' },
    { speaker: 'librarian', text: 'Stairs are on the left of the main hall, and there are handrails for anyone who needs them.' },
    { speaker: 'librarian', text: 'Looking ahead, the second floor will reopen with two new rooms.' },
    { speaker: 'librarian', text: 'The first is a makers’ workshop, with machines for hands-on projects, beside the existing study room.' },
    { speaker: 'librarian', text: 'A children’s play area was planned, but it has been moved to next year’s stage, so it is not part of this reopening.' },
    { speaker: 'librarian', text: 'The workshop seats up to sixteen people, and booking will open on the library website a week before it launches.' },
    { speaker: 'librarian', text: 'Until then, the study room on the first floor remains open for individual reading.' },
    { speaker: 'librarian', text: 'Now for the timetable. The fiction floor closes until early March, when those shelves reopen first.' },
    { speaker: 'librarian', text: 'The makers’ workshop follows in mid April, and the whole building, including the archive, reopens in late May.' },
    { speaker: 'librarian', text: 'A few practical notes about the temporary loans point.' },
    { speaker: 'librarian', text: 'It opens at nine in the morning, so please do not queue before eight forty-five.' },
    { speaker: 'librarian', text: 'Returns left in the old outdoor drop box are checked twice each day, once before lunch and once before closing.' },
    { speaker: 'librarian', text: 'The new workshop will have three D printers and a scanner for copying small objects, along with basic hand tools.' },
    { speaker: 'librarian', text: 'Any book you can’t find on the shelves may still be held in store, and you can reserve it through the online catalogue.' },
    { speaker: 'librarian', text: 'Temporary loans are kept for three weeks, and renewals work the same as before through your account page.' },
    { speaker: 'librarian', text: 'The temporary point is closed on Sunday afternoons, although the building itself opens until four on Sundays.' },
    { speaker: 'librarian', text: 'If you need help during the works, ask any member of staff wearing the green vest.' },
    { speaker: 'librarian', text: 'We also run short tours of the new rooms each Saturday, starting from the temporary point at eleven.' },
    { speaker: 'librarian', text: 'Requests for titles that are still unavailable can be placed at the point, and we will notify you by email.' },
    { speaker: 'librarian', text: 'Children’s story time continues in the community centre next door each Wednesday morning.' },
    { speaker: 'librarian', text: 'The temporary point does not take reservations for rare books, so those requests go through the archive desk.' },
    { speaker: 'librarian', text: 'If you return a book late, the same fine rules apply as before the renovation.' },
    { speaker: 'librarian', text: 'Please keep pushchairs and large bags in the marked area near the entrance, as the walkways are narrow.' },
    { speaker: 'librarian', text: 'Lost property from this floor is logged at the temporary point, not at the archive desk.' },
    { speaker: 'librarian', text: 'We apologise for the inconvenience, and we appreciate your patience while the improvements are carried out.' },
    { speaker: 'librarian', text: 'Leaflets with the full timetable are stacked near the exit, and you can also check the opening hours on our website.' },
    { speaker: 'librarian', text: 'That is all from me today. Enjoy your visit, and please ask a member of staff if anything is unclear.' },
  ],
  vocabulary: [
    {
      term: 'renovation', phonetic: '/ˌrenəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '翻新，改造（建筑工程）', en: 'the work of repairing and improving a building' },
      usage: { zh: '可数或不可数；library renovation、under renovation。动词 renovate。', en: 'Countable or uncountable: a library renovation, under renovation. The verb is renovate.' },
      collocations: ['the renovation works', 'under renovation', 'the renovation stage'],
      example: { en: 'The library is closed for renovation until May.', zh: '图书馆因翻新闭馆到五月。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/，开头 /ˌren/ 轻读。', en: 'Four syllables with stress on the third; the opening /ˌren/ is weak.' },
    },
    {
      term: 'fiction', phonetic: '/ˈfɪkʃn/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '小说类图书', en: 'books telling made-up stories, such as novels and short stories' },
      usage: { zh: '不可数；fiction collection、fiction shelves。反义词 non-fiction。', en: 'Uncountable: a fiction collection, fiction shelves. The opposite is non-fiction.' },
      collocations: ['the fiction collection', 'fiction shelves', 'modern fiction'],
      example: { en: 'The fiction collection moves to the new floor in March.', zh: '小说区三月搬到新楼层。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈfɪk/，结尾 /ʃn/。', en: 'Two syllables with first-syllable stress; the ending is /ʃn/.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '档案库，馆藏档案', en: 'a collection of old records kept for reference' },
      usage: { zh: '可数；basement archive、archive items。形容词 archival。', en: 'Countable: a basement archive, archive items. The adjective is archival.' },
      collocations: ['the basement archive', 'archive items', 'the archive desk'],
      example: { en: 'Old newspapers are stored in the archive.', zh: '旧报纸存放在档案库里。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɑː/，结尾 /aɪv/。', en: 'Two syllables with first-syllable stress; the ending is /aɪv/.' },
    },
    {
      term: 'demolition', phonetic: '/ˌdeməˈlɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '拆除（旧设施）', en: 'the act of taking down an old wall or room' },
      usage: { zh: '不可数；demolition work、demolition crew。动词 demolish。', en: 'Uncountable: demolition work, a demolition crew. The verb is demolish.' },
      collocations: ['demolition work', 'the demolition crew', 'heavy demolition'],
      example: { en: 'Demolition noise stops after lunch each day.', zh: '拆除噪音每天午饭后停止。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈlɪʃ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'workshop', phonetic: '/ˈwɜːkʃɒp/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '工坊，工作间', en: 'a room with tools and machines for practical projects' },
      usage: { zh: '可数；makers’ workshop、workshop equipment。也指研讨班。', en: 'Countable: a makers’ workshop, workshop equipment. It also means a seminar.' },
      collocations: ['a makers’ workshop', 'workshop equipment', 'book the workshop'],
      example: { en: 'The workshop opens for bookings next April.', zh: '工坊明年四月开放预约。' },
      listening: { zh: '复合词，两个音节都重读；shop 读 /ʃɒp/。', en: 'A compound with stress on both halves; shop is /ʃɒp/.' },
    },
    {
      term: 'catalogue', phonetic: '/ˈkætəlɒɡ/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '目录（馆藏书目）', en: 'the list of books and items held by a library' },
      usage: { zh: '可数；online catalogue、search the catalogue。美式也拼 catalog。', en: 'Countable: an online catalogue, search the catalogue. American English also writes catalog.' },
      collocations: ['the online catalogue', 'search the catalogue', 'reserve through the catalogue'],
      example: { en: 'Reserve the book through the online catalogue.', zh: '通过在线目录预约这本书。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkæt/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'renewals', phonetic: '/rɪˈnjuːəlz/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '续借，续期', en: 'extending the time a book or loan is kept' },
      usage: { zh: '常用复数；renewals work online、loan renewal。动词 renew。', en: 'Usually plural: renewals work online, a loan renewal. The verb is renew.' },
      collocations: ['online renewals', 'a loan renewal', 'request a renewal'],
      example: { en: 'Renewals are done through your account page.', zh: '续借在账户页面完成。' },
      listening: { zh: '重音在第二音节 /ˈnjuː/，结尾 /əlz/。', en: 'Stress the second syllable; the ending is /əlz/.' },
    },
  ],
  expressions: [
    {
      phrase: 'out of use', sentenceIndex: 6,
      meaning: { zh: '停止使用，暂时不可用', en: 'not available for the usual purpose for a period' },
      usage: { zh: '作表语；the shelves are out of use、be out of service 同类。', en: 'Predicative: the shelves are out of use; be out of service works the same way.' },
      example: { en: 'The fiction shelves are out of use this week.', zh: '小说书架本周暂停使用。' },
    },
    {
      phrase: 'by the front steps', sentenceIndex: 8,
      meaning: { zh: '在门前台阶旁', en: 'beside the steps leading to the main entrance' },
      usage: { zh: '方位短语；by 在此等于 beside，后接台阶、门口、车站。', en: 'A location phrase: by here means beside, followed by steps, a door or a stop.' },
      example: { en: 'The mobile unit stands by the front steps.', zh: '移动单元停在门前台阶旁。' },
    },
    {
      phrase: 'out of service', sentenceIndex: 16,
      meaning: { zh: '暂停运行，停用', en: 'not working or available to the public' },
      usage: { zh: '多用于电梯、车辆、线路；lift out of service。', en: 'Often for lifts, vehicles or routes: the lift is out of service.' },
      example: { en: 'The lift is out of service until Friday.', zh: '电梯周五前停用。' },
    },
    {
      phrase: 'hands-on projects', sentenceIndex: 19,
      meaning: { zh: '动手操作的项目', en: 'practical activities where people make or build things themselves' },
      usage: { zh: 'hands-on 作定语；hands-on workshop、hands-on experience。', en: 'Hands-on is attributive: a hands-on workshop, hands-on experience.' },
      example: { en: 'The workshop runs hands-on projects for adults.', zh: '工坊面向成人开设动手项目。' },
    },
    {
      phrase: 'in late May', sentenceIndex: 24,
      meaning: { zh: '在五月下旬', en: 'during the second half of May' },
      usage: { zh: '时间短语；in early March、in mid April 同类，注意介词用 in。', en: 'A time phrase: in early March, in mid April; use the preposition in.' },
      example: { en: 'The whole building reopens in late May.', zh: '整馆五月下旬重开。' },
    },
    {
      phrase: 'held in store', sentenceIndex: 29,
      meaning: { zh: '存放在库房中', en: 'kept in the storage area rather than on the open shelves' },
      usage: { zh: '被动；be held in store、held in reserve。store 此处是不可数名词。', en: 'Passive: be held in store, held in reserve; store is uncountable here.' },
      example: { en: 'Older titles are held in store behind the desk.', zh: '旧版书目存放在柜台后的库房。' },
    },
    {
      phrase: 'carried out', sentenceIndex: 40,
      meaning: { zh: '实施，进行（工程或改进）', en: 'done, completed or performed' },
      usage: { zh: '被动；improvements are carried out、work is carried out。', en: 'Passive: improvements are carried out, work is carried out.' },
      example: { en: 'The repairs are carried out in three stages.', zh: '维修分三个阶段实施。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白靠信号词定位进度', en: 'Track the signposts in the monologue' },
      body: {
        zh: 'Part 2 没有提问提示进度。听前把题干里的区域、地点、时段、设施写成关键词，听到 The first area shut、Looking ahead、Now for the timetable 这类信号词时，对照自己填到了哪一题。',
        en: 'There is no question to mark progress. Note the area, place, time and facility keywords from the stems before listening, and check your place at phrases such as The first area shut, Looking ahead and Now for the timetable.',
      },
    },
    {
      title: { zh: '干扰项常是另一条时间线', en: 'Distractors are other dates' },
      body: {
        zh: '三月初是小说区重开，四月中是工坊开放，五月下旬才是整馆重开；上午吵、下午静。选项常把另一条时间线安到题干上，听时抓住句子主语和时段词。',
        en: 'Early March reopens fiction, mid April opens the workshop, and late May is the full reopening; the morning is noisy, the afternoon quiet. Options often attach one timeline to the stem, so watch the subject and the time phrase.',
      },
    },
    {
      title: { zh: '笔记填空先判断词性', en: 'Predict the part of speech' },
      body: {
        zh: '第 18 题空后是标点，前面是 a，填名词 scanner；第 19 题前面是 online，填 catalogue；第 20 题空后是 afternoons，填复数 Sundays。听前把词性写在空格旁。',
        en: 'Item 18 needs a noun after a: scanner. Item 19 follows online, so catalogue; item 20 precedes afternoons, so Sundays. Note the predicted part of speech beside each gap before listening.',
      },
    },
  ],
};
