import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 24 · Part 4 — 图书馆建筑（单人讲座，澳式口音）。原创仿真材料，非官方真题。
 *
 * 结构：中庭组织空间 → 高窗采光 → 高天花声学 → 公共空间演变（表格 31–34）→
 * 早期限制原因、采光作用、角色转变（单选 35–37）→ 现代图书馆三项特征（多选 38–40）。
 * 开场用历史事实与数字，不用 Today's lecture is about 句式。
 */
export const test24Part4: ListeningLesson = {
  slug: 'test-24-part-4',
  part: 4,
  status: 'published',
  title: { zh: '图书馆建筑', en: 'The architecture of libraries' },
  summary: {
    zh: '讲座梳理图书馆建筑随公共角色的演变：现代阅览区围绕中央中庭展开，自然光经高窗进入，高天花改善声学，新图书馆成为面向全镇的公共空间；解释早期图书馆只对学者开放是因为手抄本稀少需保护，自然光减轻长时间阅读的眼疲劳，角色从受看管的档案库转为开放共享建筑，并归纳免费进入、小组讨论室和入口咖啡区三项现代特征。',
    en: 'The lecture traces library architecture and its public role: rooms open off a central atrium, daylight enters through tall windows, high ceilings aid acoustics, and the newest library is a town-wide public space. It covers early scholar-only access, rare hand-copied books, daylight and eye strain, the archive-to-open shift, and free entry, group rooms and an entrance café.',
  },
  accent: { zh: '讲师为澳式口音，术语放慢重复，段落之间有停顿。', en: 'The lecturer has an Australian accent, repeats key terms slowly and pauses between sections.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Element', 'Design feature'],
      rows: [
        { lead: 'Reading rooms', cells: [[{ text: 'arranged around a central ' }, { blank: 31 }]] },
        { lead: 'Daylight', cells: [[{ text: 'enters through tall ' }, { blank: 32 }]] },
        { lead: 'High ceilings', cells: [[{ blank: 33 }, { text: ' in the room’ acoustics' }]] },
        { lead: 'Modern library', cells: [[{ text: 'serves as a public ' }, { blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why were the earliest libraries restricted to scholars?',
          options: [
            { key: 'A', text: 'Books were hand copied and rare, needing protection' },
            { key: 'B', text: 'The rooms had no heating for ordinary visitors' },
            { key: 'C', text: 'Scholars donated most of the collection' },
          ],
        },
        {
          number: 36,
          stem: 'What does natural daylight do for readers?',
          options: [
            { key: 'A', text: 'It dries out the leather book bindings' },
            { key: 'B', text: 'It lowers eye strain over a long reading session' },
            { key: 'C', text: 'It replaces all the overhead lamps in winter' },
          ],
        },
        {
          number: 37,
          stem: 'How has the library’s role changed across these periods?',
          options: [
            { key: 'A', text: 'It has moved from a guarded archive to an open shared building' },
            { key: 'B', text: 'It has closed its reading rooms to outside visitors' },
            { key: 'C', text: 'It has become a ticketed exhibition centre' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE features define the modern public library? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE features define the modern public library?',
      options: [
        { key: 'A', text: 'free public entry' },
        { key: 'B', text: 'silent-only study on every floor' },
        { key: 'C', text: 'group discussion rooms' },
        { key: 'D', text: 'locked stacks for current books' },
        { key: 'E', text: 'a café area near the entrance' },
        { key: 'F', text: 'ticketed exhibitions as the main entry' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['atrium'], evidence: 3,
      explanation: {
        zh: '定位句 3：A modern library is organised around a central atrium that opens onto every floor。阅览区围绕中央中庭布置，填 atrium。',
        en: 'Sentence 3: the modern library is organised "around a central atrium", so fill atrium.',
      },
    },
    {
      number: 32, accepted: ['windows'], evidence: 7,
      explanation: {
        zh: '定位句 7：Daylight enters through tall windows that run almost from floor to ceiling。自然光经高窗进入，填 windows。',
        en: 'Sentence 7: daylight enters "through tall windows", so fill windows.',
      },
    },
    {
      number: 33, accepted: ['acoustics'], evidence: 10,
      explanation: {
        zh: '定位句 10：High ceilings are another deliberate choice, and they improve the room’s acoustics。高天花改善室内声学，填 acoustics。',
        en: 'Sentence 10: high ceilings "improve the room’s acoustics", so fill acoustics.',
      },
    },
    {
      number: 34, accepted: ['space'], evidence: 13,
      explanation: {
        zh: '定位句 13：In its newest form the library serves as a public space for the whole town。新图书馆是全镇公共空间，填 space。',
        en: 'Sentence 13: the newest library serves as "a public space for the whole town", so fill space.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：Books were hand copied and rare, so each one had to be protected from theft and wear。早期藏书手抄稀少、需防盗防损，对应 A。供暖、学者捐赠未提及。',
        en: 'Sentence 17: books "were hand copied and rare", needing protection, matching A. Heating and scholar donations are not mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：It lowers eye strain and keeps the room feeling less closed off than lamps alone。自然光减轻长时间阅读的眼疲劳，对应 B。干燥书皮、完全替代灯具未提及。',
        en: 'Sentence 20: daylight "lowers eye strain", matching B. Drying bindings and replacing every lamp are not mentioned.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：It moved from a guarded archive for a few, to a shared building open to everyone。角色从受看管档案库转为开放共享建筑，对应 A。闭馆谢绝外人、收费展览中心与原文相反。',
        en: 'Sentence 22: it moved "from a guarded archive for a few, to a shared building open to everyone", matching A. Closing rooms to visitors and a ticketed centre contradict the transcript.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：Free public entry sits at the centre, with no ticket or membership required to walk in。免费进入是核心特征，对应 A。',
        en: 'Sentence 24: "free public entry sits at the centre", matching A.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Group discussion rooms sit on the quieter side, where teams can talk without disturbing readers。小组讨论室是现代特征，对应 C。',
        en: 'Sentence 25: "group discussion rooms" sit on the quieter side, matching C.',
      },
    },
    {
      number: 40, accepted: ['E'], evidence: 26,
      explanation: {
        zh: '定位句 26：A café area near the entrance gives people a place to pause and meet。入口咖啡区是现代特征，对应 E。每层只许安静、现用书入库锁、收费展览为主入口均被排除。',
        en: 'Sentence 26: "a café area near the entrance" lets people pause and meet, matching E. Silent-only floors, locked current stacks and ticketed main entry are ruled out.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'In the thirteenth century, most library books were chained to their shelves.' },
    { speaker: 'lecturer', text: 'Those early rooms were closed to all but a small circle of scholars.' },
    { speaker: 'lecturer', text: 'Over centuries the building itself changed as its public role changed.' },
    { speaker: 'lecturer', text: 'A modern library is organised around a central atrium that opens onto every floor.' },
    { speaker: 'lecturer', text: 'The reading rooms spread off this hall, so a visitor can find a seat without losing the main route.' },
    { speaker: 'lecturer', text: 'Older libraries stacked books in deep rows that blocked the light.' },
    { speaker: 'lecturer', text: 'Architects now pull the rooms toward the edges, where daylight can reach the tables.' },
    { speaker: 'lecturer', text: 'Daylight enters through tall windows that run almost from floor to ceiling.' },
    { speaker: 'lecturer', text: 'Soft natural light keeps eye strain down during a long afternoon of reading.' },
    { speaker: 'lecturer', text: 'The windows are shaded so direct sun does not glare on the open page.' },
    { speaker: 'lecturer', text: 'High ceilings are another deliberate choice, and they improve the room’s acoustics.' },
    { speaker: 'lecturer', text: 'Sound rises and spreads above the readers instead of bouncing straight back down.' },
    { speaker: 'lecturer', text: 'Thick bookshelves along the walls also absorb some of the chatter from the entrance.' },
    { speaker: 'lecturer', text: 'In its newest form the library serves as a public space for the whole town.' },
    { speaker: 'lecturer', text: 'People come to read, meet, work on laptops or attend a local event.' },
    { speaker: 'lecturer', text: 'This openness would have been unthinkable in those chained-book rooms.' },
    { speaker: 'lecturer', text: 'Why were the earliest libraries restricted to scholars?' },
    { speaker: 'lecturer', text: 'Books were hand copied and rare, so each one had to be protected from theft and wear.' },
    { speaker: 'lecturer', text: 'Locks and chains also kept ordinary visitors from handling fragile pages.' },
    { speaker: 'lecturer', text: 'What does natural daylight do for someone reading for hours?' },
    { speaker: 'lecturer', text: 'It lowers eye strain and keeps the room feeling less closed off than lamps alone.' },
    { speaker: 'lecturer', text: 'How has the library’s role changed across these periods?' },
    { speaker: 'lecturer', text: 'It moved from a guarded archive for a few, to a shared building open to everyone.' },
    { speaker: 'lecturer', text: 'Which features define the modern public library we see today?' },
    { speaker: 'lecturer', text: 'Free public entry sits at the centre, with no ticket or membership required to walk in.' },
    { speaker: 'lecturer', text: 'Group discussion rooms sit on the quieter side, where teams can talk without disturbing readers.' },
    { speaker: 'lecturer', text: 'A café area near the entrance gives people a place to pause and meet.' },
    { speaker: 'lecturer', text: 'The old locked stacks still survive, but they hold archive material rather than current books.' },
    { speaker: 'lecturer', text: 'Silent-only study is one corner of the building, not the rule for every floor.' },
    { speaker: 'lecturer', text: 'Ticketed exhibitions are hosted now and then, but the main rooms stay open without charge.' },
    { speaker: 'lecturer', text: 'Beyond the public rooms, the building carries a quiet structural logic.' },
    { speaker: 'lecturer', text: 'Load-bearing walls sit at the edges, leaving the middle open for flexible seating.' },
    { speaker: 'lecturer', text: 'Staircases at both ends carry people between floors without crossing the reading tables.' },
    { speaker: 'lecturer', text: 'The atrium acts as a circulation route as well as a meeting point.' },
    { speaker: 'lecturer', text: 'Air moves up through this open shaft, so lower floors stay cooler in summer.' },
    { speaker: 'lecturer', text: 'Materials matter too. Stone floors echo less than bare hard wood in the old halls.' },
    { speaker: 'lecturer', text: 'Soft seating and carpet strips reduce the sound of footsteps near the desks.' },
    { speaker: 'lecturer', text: 'Librarians place the most used shelves near the entrance to save long walks.' },
    { speaker: 'lecturer', text: 'Reference works stay on open shelves, while older documents go to closed stores.' },
    { speaker: 'lecturer', text: 'The design also responds to how people study now.' },
    { speaker: 'lecturer', text: 'Laptops and group work need power points and wider tables than the old reading desks.' },
    { speaker: 'lecturer', text: 'Children’s areas sit near the entrance, with lower shelves and bright seating.' },
    { speaker: 'lecturer', text: 'The layout keeps young readers from disturbing the silent study zone upstairs.' },
    { speaker: 'lecturer', text: 'Town planners treat the library as civic space alongside the hall and the park.' },
    { speaker: 'lecturer', text: 'Its opening hours match the working day, and some branches stay open into the evening.' },
    { speaker: 'lecturer', text: 'Surveys show visitors value free access more than any single collection.' },
    { speaker: 'lecturer', text: 'Yet the book stock remains the reason most people first walk through the door.' },
    { speaker: 'lecturer', text: 'Architecture, then, follows the habits the community brings to the room.' },
    { speaker: 'lecturer', text: 'A building that only stores books would answer a much narrower need.' },
    { speaker: 'lecturer', text: 'The next lecture traces how those old archive rooms were first opened to the public.' },
    { speaker: 'lecturer', text: 'We will look at the town libraries of the nineteenth century as that shift began.' },
  ],
  vocabulary: [
    {
      term: 'atrium', phonetic: '/ˈeɪtriəm/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '中庭，挑空大厅', en: 'the open central hall around which rooms are arranged' },
      usage: { zh: '可数；a central atrium、the library atrium。', en: 'Countable: a central atrium, the library atrium.' },
      collocations: ['a central atrium', 'the open atrium', 'around the atrium'],
      example: { en: 'Reading rooms open off the central atrium.', zh: '阅览区从中央中庭展开。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈeɪ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'acoustics', phonetic: '/əˈkuːstɪks/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '声学，室内声音效果', en: 'how sound travels and is heard inside a room' },
      usage: { zh: '恒用复数；good acoustics、the room’s acoustics。形容词 acoustic。', en: 'Always plural: good acoustics; the adjective is acoustic.' },
      collocations: ['good acoustics', 'the room’s acoustics', 'improve the acoustics'],
      example: { en: 'High ceilings improve the room’s acoustics.', zh: '高天花改善室内声学。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkuː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '档案库，珍藏室', en: 'the guarded store of rare old documents' },
      usage: { zh: '可数；a guarded archive、the archive material。', en: 'Countable: a guarded archive, archive material.' },
      collocations: ['a guarded archive', 'the archive material', 'an archive room'],
      example: { en: 'The early library was a guarded archive for a few.', zh: '早期图书馆是少数人使用的档案库。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'glare', phonetic: '/ɡleə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '刺眼的强光，眩光', en: 'bright direct light that makes reading hard' },
      usage: { zh: '不可数；sun glare、reduce the glare。动词同形。', en: 'Uncountable: sun glare; it is also a verb.' },
      collocations: ['reduce the glare', 'sun glare', 'glare on the page'],
      example: { en: 'Shades stop direct sun glaring on the page.', zh: '遮阳避免阳光在纸面上反光。' },
      listening: { zh: '单音节，与 hair 押韵。', en: 'One syllable, rhyming with hair.' },
    },
    {
      term: 'circulation', phonetic: '/ˌsɜːkjuˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '（人流）通道，动线', en: 'the route people take through the building' },
      usage: { zh: '不可数；a circulation route、the circulation space。', en: 'Uncountable: a circulation route, the circulation space.' },
      collocations: ['a circulation route', 'the circulation space', 'public circulation'],
      example: { en: 'The atrium serves as the main circulation route.', zh: '中庭是主要人行动线。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'load-bearing', phonetic: '/ˈləʊd beərɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 31,
      meaning: { zh: '承重的（墙）', en: 'a wall that carries the weight of the floors above' },
      usage: { zh: '复合形容词；load-bearing wall，不可拆改。', en: 'Compound: load-bearing wall, not to be removed.' },
      collocations: ['a load-bearing wall', 'load-bearing structure', 'the load-bearing edges'],
      example: { en: 'Load-bearing walls sit at the edges.', zh: '承重墙位于建筑边缘。' },
      listening: { zh: '复合词，重音落在 bearing 部分。', en: 'Compound; stress falls on bearing.' },
    },
    {
      term: 'civic', phonetic: '/ˈsɪvɪk/', partOfSpeech: 'adj.', sentenceIndex: 43,
      meaning: { zh: '城市公共的，市民的', en: 'relating to the town and its citizens' },
      usage: { zh: '形容词；civic space、civic buildings。', en: 'Adjective: civic space, civic buildings.' },
      collocations: ['civic space', 'civic buildings', 'civic life'],
      example: { en: 'Planners treat the library as civic space.', zh: '规划者把图书馆视为城市公共空间。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɪ/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'chained to', sentenceIndex: 0,
      meaning: { zh: '用链条拴在（书架）上', en: 'secured with a chain so books could not be removed' },
      usage: { zh: '被动短语；books chained to the shelves、chain a book to its place。', en: 'Passive: chained to the shelves; a security practice of early libraries.' },
      example: { en: 'Early books were chained to their shelves.', zh: '早期书籍用链条拴在书架上。' },
    },
    {
      phrase: 'blocked the light', sentenceIndex: 5,
      meaning: { zh: '挡住光线', en: 'to stop daylight reaching the reading tables' },
      usage: { zh: '动宾短语；deep rows block the light、block out the light。', en: 'Deep rows block the light; compare block out.' },
      example: { en: 'Deep book rows blocked the window light.', zh: '深排书架挡住窗光。' },
    },
    {
      phrase: 'protected from', sentenceIndex: 17,
      meaning: { zh: '保护……免受（盗窃、磨损）', en: 'kept safe from theft, wear or damage' },
      usage: { zh: '被动短语；protected from theft and wear、protect books from dust。', en: 'Protected from theft; the active verb is protect from.' },
      example: { en: 'Rare books had to be protected from theft.', zh: '珍本必须防盗保护。' },
    },
    {
      phrase: 'open to everyone', sentenceIndex: 22,
      meaning: { zh: '向所有人开放', en: 'accessible to every member of the public' },
      usage: { zh: '固定短语；open to everyone、open to the public。', en: 'Open to everyone; compare open to the public.' },
      example: { en: 'The shared building is open to everyone.', zh: '共享建筑向所有人开放。' },
    },
    {
      phrase: 'stay open', sentenceIndex: 29,
      meaning: { zh: '保持开放，不收门票', en: 'remain accessible without charge or a ticket' },
      usage: { zh: '固定短语；the main rooms stay open、stay open into the evening。', en: 'Stay open means remain accessible; also of opening hours.' },
      example: { en: 'The main rooms stay open without charge.', zh: '主厅免费开放。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格按建筑部位填词', en: 'Fill table by building element' },
      body: {
        zh: '四空分别对应中庭、高窗、声学、公共空间。听到 central atrium、tall windows、improve the acoustics、public space 直接落笔；注意题干已给 design feature 的引导词，别重复。',
        en: 'The four blanks match atrium, tall windows, acoustics and public space. Write at central atrium, tall windows, improve the acoustics and public space; do not repeat the printed lead words.',
      },
    },
    {
      title: { zh: '单选定因果与变化方向', en: 'Pick cause and direction of change' },
      body: {
        zh: '早期封闭是因为手抄本稀少需保护；采光作用是减轻眼疲劳；角色变化是从受看管档案库到开放共享建筑。供暖、干燥书皮、收费展览中心都是未出现或相反的干扰。',
        en: 'Early access was limited because rare hand-copied books needed protection; daylight reduces eye strain; the role moved from guarded archive to open building. Heating, drying bindings and a ticketed centre are absent or reversed distractors.',
      },
    },
    {
      title: { zh: '多选排除旧制度残留', en: 'Exclude surviving old systems' },
      body: {
        zh: '现代三特征：免费进入、讨论室、入口咖啡区。锁库只放档案而非现用书；安静只是一角规则；收费展览偶尔举办但不是主入口。听到 still survive、one corner、now and then 就划掉对应选项。',
        en: 'The three modern features are free entry, discussion rooms and the entrance café. Locked stacks hold archives, silence is one corner only, and ticketed shows are occasional. Cross out options flagged by still survive, one corner and now and then.',
      },
    },
  ],
};
