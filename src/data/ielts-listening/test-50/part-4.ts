import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 50 · Part 4 — 讲座：钟表史（单人）。原创仿真材料，非官方真题。
 *
 * 结构：日晷与水钟 → 机械钟与重力锤 → 摆钟精度 → 铁路与标准时间；
 * 笔记填空按讲座顺序出现，多选落在早期钟型两段，单选落在中段问答与结尾回顾。
 */
export const test50Part4: ListeningLesson = {
  slug: 'test-50-part-4',
  part: 4,
  status: 'published',
  title: { zh: '钟表史', en: 'The history of clocks' },
  summary: {
    zh: '一场关于钟表史的讲座：最早的日晷靠太阳投影报时，水钟靠流水计量，机械钟由下落重力锤驱动，摆钟带来稳定节律并大幅提高精度；铁路联网促成全国标准时间，后世石英与原子钟都由这些早期装置发展而来。',
    en: 'A lecture on clock history: early sundials read the sun shadow, water clocks measured the flow of water, mechanical clocks were driven by a falling weight, and the pendulum gave a regular beat that sharply improved accuracy. Railways drove shared national standard time, and later quartz and atomic clocks descend from these early devices.',
  },
  accent: { zh: '男讲师为加拿大口音，语速平稳，术语会重复。', en: 'A male lecturer with a Canadian accent. He speaks steadily and repeats key terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'The earliest clocks tracked the', cells: [[{ blank: 31 }, { text: ' across the sky.' }]] },
        { lead: 'Water clocks measured time by the flow of', cells: [[{ blank: 32 }, { text: '.' }]] },
        { lead: 'Mechanical clocks were driven by a falling', cells: [[{ blank: 33 }, { text: '.' }]] },
        { lead: 'The pendulum greatly raised the clock’s', cells: [[{ blank: 34 }, { text: '.' }]] },
        { lead: 'Standard time was set to a single national', cells: [[{ blank: 35 }, { text: '.' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO were common early clock types? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO were common early clock types?',
      options: [
        { key: 'A', text: 'sundial' },
        { key: 'B', text: 'water clock' },
        { key: 'C', text: 'pendulum clock' },
        { key: 'D', text: 'atomic clock' },
        { key: 'E', text: 'stopwatch' },
        { key: 'F', text: 'alarm clock' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'How did the first sundials tell the time?',
          options: [
            { key: 'A', text: 'By the shadow of a stick on a marked plate.' },
            { key: 'B', text: 'By the level of water in a bowl.' },
            { key: 'C', text: 'By the swing of a weighted pendulum.' },
          ],
        },
        {
          number: 39,
          stem: 'What problem did the pendulum solve?',
          options: [
            { key: 'A', text: 'Clocks ran too fast at night.' },
            { key: 'B', text: 'Clocks kept poor accuracy without a regular beat.' },
            { key: 'C', text: 'Clock faces were too hard to read.' },
          ],
        },
        {
          number: 40,
          stem: 'Why did standardization become necessary?',
          options: [
            { key: 'A', text: 'Railway travel made one shared time essential.' },
            { key: 'B', text: 'Sundials could no longer be built.' },
            { key: 'C', text: 'Workers refused to follow local sun time.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['sun'], evidence: 3,
      explanation: {
        zh: '定位句 3：The earliest clocks tracked the sun across the sky through the day。最早的时钟跟踪太阳在天空的位置，填 sun。',
        en: 'Sentence 3: "The earliest clocks tracked the sun across the sky through the day". The earliest clocks tracked the sun, so write sun.',
      },
    },
    {
      number: 32, accepted: ['water'], evidence: 7,
      explanation: {
        zh: '定位句 7：Water clocks measured time by the flow of water from one bowl to another。水钟靠水的流动计时，填 water。',
        en: 'Sentence 7: "Water clocks measured time by the flow of water from one bowl to another". Water clocks measure the flow of water, so write water.',
      },
    },
    {
      number: 33, accepted: ['weight'], evidence: 12,
      explanation: {
        zh: '定位句 12：Early mechanical clocks were driven by a falling weight that pulled on a toothed wheel。机械钟由下落重力锤驱动，填 weight。',
        en: 'Sentence 12: "Early mechanical clocks were driven by a falling weight that pulled on a toothed wheel". Mechanical clocks used a falling weight, so write weight.',
      },
    },
    {
      number: 34, accepted: ['accuracy'], evidence: 17,
      explanation: {
        zh: '定位句 17：This improvement greatly raised the clock’s accuracy, and errors dropped sharply。摆钟大幅提高走时精度，填 accuracy。',
        en: 'Sentence 17: "This improvement greatly raised the clock’s accuracy, and errors dropped sharply". The pendulum raised accuracy, so write accuracy.',
      },
    },
    {
      number: 35, accepted: ['zone'], evidence: 22,
      explanation: {
        zh: '定位句 22：Standard time was then set to a single national zone, rather than each town’s sun time。标准时间统一到全国同一时区，填 zone。',
        en: 'Sentence 22: "Standard time was then set to a single national zone, rather than each town’s sun time". Standard time was set to one national zone, so write zone.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：First, sundials and water clocks were the two common early types。日晷是常见早期钟型之一，对应 A。',
        en: 'Sentence 31: "First, sundials and water clocks were the two common early types". The sundial is an early type, matching A.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：The sundial read the sun’s shadow; the water clock read the flow of water。水钟是另一类早期钟型，对应 B。C 的摆钟、D 的原子钟在句 33 属于后世，E 的秒表、F 的闹钟在句 34 被排除。',
        en: 'Sentence 32: "The sundial read the sun’s shadow; the water clock read the flow of water". The water clock is the other early type, matching B. The pendulum and atomic clock in C and D come later in sentence 33; the stopwatch and alarm in E and F are excluded in sentence 34.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：A stick cast a shadow on a marked plate, and the shadow moved across the hour marks。日晷靠杆影落在刻度盘上计时，对应 A。B 的水位是水钟，C 的摆摆动是后世机械结构。',
        en: 'Sentence 36: "A stick cast a shadow on a marked plate, and the shadow moved across the hour marks". Sundials read the stick shadow on a marked plate, matching A. The water level in B belongs to the water clock, and the pendulum swing in C came later.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：Without a regular beat, those clocks kept poor accuracy and drifted through the day。摆钟解决的是缺乏稳定节律导致精度差的问题，对应 B。A 的夜间过快、C 的表盘难读在句 41 被否定。',
        en: 'Sentence 39: "Without a regular beat, those clocks kept poor accuracy and drifted through the day". The pendulum fixed poor accuracy caused by no regular beat, matching B. Night time speeding in A and an unreadable face in C are ruled out in sentence 41.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：Railway travel made one shared time essential, so connections could be timed safely。铁路出行要求共用时间标准，对应 A。B 说日晷无法再建，C 说工人拒绝地方时，都与原文不符。',
        en: 'Sentence 43: "Railway travel made one shared time essential, so connections could be timed safely". Railway travel required a shared standard time, matching A. Sundials being unbuildable in B and workers rejecting local time in C both contradict the recording.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'For most of human history, people told time by looking up at the sky.' },
    { speaker: 'lecturer', text: 'The story of clocks runs from shadow and water to the precise machines we know today.' },
    { speaker: 'lecturer', text: 'Early devices did not run on gears or batteries; they read the natural world.' },
    { speaker: 'lecturer', text: 'The earliest clocks tracked the sun across the sky through the day.' },
    { speaker: 'lecturer', text: 'A stick or gnomon cast a shadow on a marked plate, and the shadow position gave the hour.' },
    { speaker: 'lecturer', text: 'These sundials worked well on clear days, but they were useless under cloud or after dark.' },
    { speaker: 'lecturer', text: 'To keep time indoors, people built water clocks instead.' },
    { speaker: 'lecturer', text: 'Water clocks measured time by the flow of water from one bowl to another.' },
    { speaker: 'lecturer', text: 'As the water drained, marks on the vessel showed how much time had passed.' },
    { speaker: 'lecturer', text: 'They did not depend on sunlight, though their flow slowed as the level dropped.' },
    { speaker: 'lecturer', text: 'Sand timers later copied the same idea, using grains that fell through a narrow neck.' },
    { speaker: 'lecturer', text: 'The next step was the mechanical clock, which appeared in medieval town towers.' },
    { speaker: 'lecturer', text: 'Early mechanical clocks were driven by a falling weight that pulled on a toothed wheel.' },
    { speaker: 'lecturer', text: 'The weight supplied the steady force needed to turn the hands and strike the bell.' },
    { speaker: 'lecturer', text: 'Without a regular beat, these early tower clocks drifted by many minutes each day.' },
    { speaker: 'lecturer', text: 'The pendulum changed that picture once it was added to the mechanism.' },
    { speaker: 'lecturer', text: 'The pendulum swing provided a regular beat that the whole clock could follow.' },
    { speaker: 'lecturer', text: 'This improvement greatly raised the clock accuracy, and errors dropped sharply.' },
    { speaker: 'lecturer', text: 'Pocket watches followed the tower clocks, made smaller and easier to carry.' },
    { speaker: 'lecturer', text: 'Still, every town kept its own time, set from the local position of the sun.' },
    { speaker: 'lecturer', text: 'That mattered little when journeys were short, but it changed with the railways.' },
    { speaker: 'lecturer', text: 'As lines connected distant towns, trains needed one shared schedule to run safely.' },
    { speaker: 'lecturer', text: 'Standard time was then set to a single national zone, rather than each town sun time.' },
    { speaker: 'lecturer', text: 'Railways first pushed this change, and public clocks were reset to the same standard.' },
    { speaker: 'lecturer', text: 'The nineteenth century also brought better gears, springs and marked faces.' },
    { speaker: 'lecturer', text: 'Clock makers competed to make their machines smaller and more reliable.' },
    { speaker: 'lecturer', text: 'By the twentieth century, electric motors and then quartz took over most designs.' },
    { speaker: 'lecturer', text: 'Quartz clocks keep time through the regular vibration of a tiny crystal.' },
    { speaker: 'lecturer', text: 'Even more precise atomic clocks now measure time using the cycles of atoms.' },
    { speaker: 'lecturer', text: 'Yet the early shadow and water devices remain the ancestors of all these machines.' },
    { speaker: 'lecturer', text: 'Let us go back through the main steps before we move to the examples.' },
    { speaker: 'lecturer', text: 'First, sundials and water clocks were the two common early types.' },
    { speaker: 'lecturer', text: 'The sundial read the sun shadow; the water clock read the flow of water.' },
    { speaker: 'lecturer', text: 'The pendulum clock and the atomic clock came much later in the story.' },
    { speaker: 'lecturer', text: 'A stopwatch measures a short event, and an alarm clock wakes a sleeper; neither is an early town clock.' },
    { speaker: 'lecturer', text: 'How did the first sundials actually tell the time?' },
    { speaker: 'lecturer', text: 'A stick cast a shadow on a marked plate, and the shadow moved across the hour marks.' },
    { speaker: 'lecturer', text: 'The water level in a bowl belonged to the water clock, and the pendulum swing came later still.' },
    { speaker: 'lecturer', text: 'What weakness did the pendulum fix in the early mechanical clocks?' },
    { speaker: 'lecturer', text: 'Without a regular beat, those clocks kept poor accuracy and drifted through the day.' },
    { speaker: 'lecturer', text: 'The pendulum gave them that steady rhythm, so the hands moved more evenly.' },
    { speaker: 'lecturer', text: 'The problem was not a hard to read face, and it did not appear only at night.' },
    { speaker: 'lecturer', text: 'Why did time standards have to be shared across regions?' },
    { speaker: 'lecturer', text: 'Railway travel made one shared time essential, so connections could be timed safely.' },
    { speaker: 'lecturer', text: 'Local sun time could not work for a train that crossed several towns before dark.' },
    { speaker: 'lecturer', text: 'No one rejected the old system because it was inconvenient for workers; the pressure came from transport.' },
    { speaker: 'lecturer', text: 'Looking back, the arc of the clock tracks three broad ages.' },
    { speaker: 'lecturer', text: 'The shadow age used the sun, the water age used flow, and the gear age used weights and springs.' },
    { speaker: 'lecturer', text: 'Accuracy improved at each step, and standardization tied the clocks together.' },
    { speaker: 'lecturer', text: 'A modern wristwatch still descends from the tower clock and the pendulum.' },
    { speaker: 'lecturer', text: 'Next week we will compare clock designs from different parts of the world.' },
    { speaker: 'lecturer', text: 'You can read the short case study on medieval tower clocks before then.' },
    { speaker: 'lecturer', text: 'The reading also notes how town bells called people to work and to market.' },
    { speaker: 'lecturer', text: 'Please bring one example of a clock you own to discuss in the seminar.' },
  ],
  vocabulary: [
    {
      term: 'sundials', phonetic: '/ˈsʌndaɪəlz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '日晷', en: 'an early clock that reads the sun shadow on a marked plate' },
      usage: { zh: '可数名词；sun dial 复合词，由 sun 与 dial 构成。', en: 'Countable: a compound of sun and dial.' },
      collocations: ['the sundial', 'an early sundial', 'the sundial shadow'],
      example: { en: 'The sundial worked well on clear days.', zh: '日晷在晴天工作良好。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsʌ/，第二音节弱读 /dɪəl/。', en: 'Two syllables with first-syllable stress; the second is weak /dɪəl/.' },
    },
    {
      term: 'mechanical', phonetic: '/məˈkænɪkl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '机械的', en: 'worked by gears, wheels and springs rather than water or shadow' },
      usage: { zh: '形容词；mechanical clock、mechanical device，名词 machine。', en: 'Adjective: a mechanical clock, a mechanical device; the noun is machine.' },
      collocations: ['the mechanical clock', 'mechanical clocks', 'mechanical parts'],
      example: { en: 'The mechanical clock appeared in medieval town towers.', zh: '机械钟出现在中世纪城镇钟楼。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkæn/，开头 mə 弱读。', en: 'Three syllables with stress on the second; the opening mə is weak.' },
    },
    {
      term: 'pendulum', phonetic: '/ˈpendjələm/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '钟摆', en: 'a swinging weight that gives a clock a regular beat' },
      usage: { zh: '可数名词；pendulum clock，形容词 pendulum。', en: 'Countable: a pendulum clock; pendulum acts as an adjective here.' },
      collocations: ['the pendulum', 'the pendulum swing', 'a pendulum clock'],
      example: { en: 'The pendulum gave the clock a regular beat.', zh: '钟摆给时钟提供稳定节律。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpen/，结尾 /ləm/ 弱读。', en: 'Three syllables with first-syllable stress; the ending /ləm/ is weak.' },
    },
    {
      term: 'accuracy', phonetic: '/ˈækjərəsi/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '精度，准确度', en: 'how closely a clock keeps the correct time' },
      usage: { zh: '不可数名词；raise accuracy、poor accuracy，形容词 accurate。', en: 'Uncountable: raise accuracy, poor accuracy; the adjective is accurate.' },
      collocations: ['the clock accuracy', 'poor accuracy', 'improve accuracy'],
      example: { en: 'The pendulum greatly raised the clock accuracy.', zh: '钟摆大幅提高了时钟精度。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈæk/，结尾 /rəsi/。', en: 'Four syllables with first-syllable stress and the ending /rəsi/.' },
    },
    {
      term: 'standardization', phonetic: '/ˌstændədaɪˈzeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 48,
      meaning: { zh: '标准化，统一标准', en: 'the setting of one shared time rule across a region' },
      usage: { zh: '不可数名词；动词 standardize，形容词 standard。', en: 'Uncountable: the verb is standardize, the adjective standard.' },
      collocations: ['time standardization', 'national standardization', 'standardization of clocks'],
      example: { en: 'Standardization tied the public clocks together.', zh: '标准化把公共时钟统一起来。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈzeɪ/，开头 stand 弱读。', en: 'Five syllables with stress on the fourth; the opening stand is weak.' },
    },
    {
      term: 'quartz', phonetic: '/kwɔːts/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '石英', en: 'a crystal whose regular vibration keeps a modern clock accurate' },
      usage: { zh: '不可数名词；quartz clock、quartz crystal，注意 /ts/ 结尾。', en: 'Uncountable: a quartz clock, a quartz crystal; note the ending /ts/.' },
      collocations: ['quartz clocks', 'a quartz crystal', 'quartz design'],
      example: { en: 'Quartz clocks keep time through crystal vibration.', zh: '石英钟靠晶体振动计时。' },
      listening: { zh: '单音节，长元音 /ɔː/，结尾 /ts/ 清辅音。', en: 'One syllable with the long vowel /ɔː/ and the final /ts/.' },
    },
    {
      term: 'vibration', phonetic: '/vaɪˈbreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '振动，摆动', en: 'the regular back and forth movement of a crystal or pendulum' },
      usage: { zh: '可数或不可数；regular vibration，动词 vibrate。', en: 'Countable or uncountable: regular vibration; the verb is vibrate.' },
      collocations: ['the regular vibration', 'crystal vibration', 'a steady vibration'],
      example: { en: 'Quartz clocks rely on the crystal regular vibration.', zh: '石英钟依靠晶体的规律振动。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈbreɪ/，开头 vaɪ 弱读。', en: 'Three syllables with stress on the second; the opening vaɪ is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'tracked the sun', sentenceIndex: 3,
      meaning: { zh: '跟踪太阳位置', en: 'to follow the sun’s path across the sky' },
      usage: { zh: 'track 在此为跟踪、记录位置；track the sun across the sky。', en: 'Track means follow and record position here: track the sun across the sky.' },
      example: { en: 'The earliest clocks tracked the sun across the sky.', zh: '最早的时钟跟踪太阳在天空的位置。' },
    },
    {
      phrase: 'flow of water', sentenceIndex: 7,
      meaning: { zh: '水流', en: 'the movement of water from one vessel to another' },
      usage: { zh: '名词短语；the flow of water，flow 作不可数名词。', en: 'Noun phrase: the flow of water; flow is uncountable here.' },
      example: { en: 'Water clocks measured the flow of water between bowls.', zh: '水钟计量碗间的水流。' },
    },
    {
      phrase: 'driven by', sentenceIndex: 12,
      meaning: { zh: '由……驱动', en: 'powered or operated by a force or part' },
      usage: { zh: '被动结构；driven by a falling weight，同义 powered by。', en: 'Passive: driven by a falling weight, like powered by.' },
      example: { en: 'Mechanical clocks were driven by a falling weight.', zh: '机械钟由下落重力锤驱动。' },
    },
    {
      phrase: 'regular beat', sentenceIndex: 14,
      meaning: { zh: '稳定节律，规律节拍', en: 'an even, repeating rhythm that a clock can follow' },
      usage: { zh: '名词短语；a regular beat，动词短语 keep a beat。', en: 'Noun phrase: a regular beat; the verb phrase is keep a beat.' },
      example: { en: 'Without a regular beat, the clocks drifted each day.', zh: '没有稳定节律，时钟每天走偏。' },
    },
    {
      phrase: 'shared schedule', sentenceIndex: 21,
      meaning: { zh: '共用时刻表', en: 'one common timetable used across connected towns' },
      usage: { zh: '名词短语；one shared schedule、shared time standard。', en: 'Noun phrase: one shared schedule, a shared time standard.' },
      example: { en: 'Trains needed one shared schedule to run safely.', zh: '火车需要共用时刻表才能安全运行。' },
    },
    {
      phrase: 'descends from', sentenceIndex: 49,
      meaning: { zh: '由……发展而来', en: 'to have developed from an earlier type of machine' },
      usage: { zh: '短语动词；descend from 表示传承谱系，名词 descendant。', en: 'Phrasal verb: descend from means develop earlier types; the noun is descendant.' },
      example: { en: 'The wristwatch descends from the tower clock and pendulum.', zh: '腕表由钟楼时钟和摆钟发展而来。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记空格先判词性与主语', en: 'Judge part of speech and subject first' },
      body: {
        zh: '五行空格分别要填：太阳、水、重力锤、精度、时区。听前先看空格前后的 tracked the、flow of、falling、raised the、national，判断该填名词还是形容词，避免把 water clock 整段写进单行。',
        en: 'The five gaps ask for sun, water, weight, accuracy and zone. Before listening, read tracked the, flow of, falling, raised the and national around each gap to decide the word class, so you do not write a whole water clock phrase into one row.',
      },
    },
    {
      title: { zh: '多选区分早期与后世钟型', en: 'Separate early types from later ones' },
      body: {
        zh: '多选两题只选日晷和水钟。摆钟、原子钟是后世发明，秒表和闹钟是专用器物，都不是城镇早期时钟；听到 came much later、neither is an early town clock 时划掉对应选项。',
        en: 'The two answers are sundials and water clocks. Pendulum and atomic clocks came later; stopwatches and alarm clocks are specialist devices, not early town clocks. Cross out an option when you hear came much later or neither is an early town clock.',
      },
    },
    {
      title: { zh: '原因题回到定位句找主因', en: 'Return to the sentence for the main cause' },
      body: {
        zh: '标准化的主因是铁路联网需要统一时刻；日晷淘汰、工人态度都不是讲座给出的原因。单选选项出现这些说法时，回定位句确认是否被讲师否定。',
        en: 'The main cause of standardization is that the railway network needed one common time. The disappearance of sundials and worker attitudes are not the reasons given. When such claims appear as options, check the locating sentence for a lecturer rejection.',
      },
    },
  ],
};
