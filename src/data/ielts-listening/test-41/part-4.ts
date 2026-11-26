import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 41 · Part 4 — 讲座：钟表的发明。原创仿真材料，非官方真题。
 *
 * 结构：开场概览早期计时装置的共同弱点、擒纵机构、航海计时需求与标准时间成因（单选 31–34）→
 * 日晷、水钟、机械擒纵、航海钟、标准时间的详细讲解；后半段复述笔记要点（填空 35–40）：
 * 太阳位置、水流、擒纵滴答、船体摇晃、共享时间、海上位置。单选块在前，填空块在后。
 * 开场用想象提问，不用 Today's lecture is about 句式。
 */
export const test41Part4: ListeningLesson = {
  slug: 'test-41-part-4',
  part: 4,
  status: 'published',
  title: { zh: '钟表的发明', en: 'The invention of the clock' },
  summary: {
    zh: '讲座沿历史脉络讲计时装置：日晷靠太阳阴影、水钟靠稳定水流，早期装置都受天气或水源制约；机械钟靠擒纵机构让齿轮以均匀滴答释放动力；航海需要精确时间来推算经度，海上钟须扛住船体摇晃；铁路推动各地采用共享标准时间。后半段复述太阳位置、水流、擒纵滴答、船体摇晃、共享时间与海上位置等笔记要点。',
    en: 'The lecture traces timekeeping: sundials read sun shadows, water clocks use a steady flow, both limited by weather or water; the escapement releases mechanical gears in even ticks; marine clocks find longitude and survive ship motion; railways drove shared standard time. The recap restates the notes on the sun, water flow, ticks, rocking, shared time and position.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，历史年代与术语处会放慢。', en: 'The lecturer speaks with an American accent at a steady pace, slowing down for dates and technical terms.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What weakness did early timepieces share?',
          options: [
            { key: 'A', text: 'They were too large to move between rooms.' },
            { key: 'B', text: 'They depended on weather or a steady water supply.' },
            { key: 'C', text: 'They could only show the hour, not the minute.' },
          ],
        },
        {
          number: 32,
          stem: 'What key invention made mechanical clocks work?',
          options: [
            { key: 'A', text: 'The escapement regulating the gear train.' },
            { key: 'B', text: 'A heavier weight hanging from a longer rope.' },
            { key: 'C', text: 'A glass face that protected the internal gears.' },
          ],
        },
        {
          number: 33,
          stem: 'Why did accurate clocks matter at sea?',
          options: [
            { key: 'A', text: 'To tell the temperature in different ports.' },
            { key: 'B', text: 'To keep the crew awake through long night watches.' },
            { key: 'C', text: 'To calculate longitude from the sun and stars.' },
          ],
        },
        {
          number: 34,
          stem: 'What led to standard time across towns?',
          options: [
            { key: 'A', text: 'Towns wanted to keep their own local solar time.' },
            { key: 'B', text: 'Railways needed consistent schedules between places.' },
            { key: 'C', text: 'Sailors brought marine clocks back to the ports.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Sundials read the position of the', cells: [[{ blank: 35 }]] },
        { lead: 'Water clocks mark time through a steady flow of', cells: [[{ blank: 36 }]] },
        { lead: 'The escapement releases gears in regular small', cells: [[{ blank: 37 }]] },
        { lead: 'Sea clocks had to survive the rocking of the', cells: [[{ blank: 38 }]] },
        { lead: 'Railways adopted one shared', cells: [[{ blank: 39 }]] },
        { lead: 'Reliable clocks let sailors find their', cells: [[{ blank: 40 }, { text: ' at sea.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Early timepieces all had a weakness, for they depended on the weather or a steady supply of water。早期装置共同弱点是受天气或水源制约，对应 B。A 的体积过大与 C 的只能报整点在录音中均未出现。',
        en: 'Sentence 6: "Early timepieces all had a weakness, for they depended on the weather or a steady supply of water". Weather or water dependence matches B. Being too large and showing only hours are not mentioned.',
      },
    },
    {
      number: 32, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：The invention that made mechanical clocks possible was the escapement。机械钟的关键发明是擒纵机构，对应 A。B 的更重配重与 C 的玻璃表盘在录音中没有依据。',
        en: 'Sentence 9: "The invention that made mechanical clocks possible was the escapement". The key invention is the escapement, matching A. A heavier weight and a glass face are not claimed.',
      },
    },
    {
      number: 33, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：Sailors already used the sun and stars to work out their latitude, but longitude needed a precise reference time。航海钟为推算经度服务，对应 C。A 的测量港口温度与 B 的值班提神在录音中均未出现。',
        en: 'Sentence 31: "Sailors already used the sun and stars to work out their latitude, but longitude needed a precise reference time". Accurate clocks served longitude, matching C. Port temperature and crew alertness are not mentioned.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 41,
      explanation: {
        zh: '定位句 41：Railways pushed towns to adopt one shared time, so trains could meet and connect without confusion。标准时间来自铁路统一时刻表的需要，对应 B。A 的保留本地太阳时与句 42 的 give way to 相反，C 的水手把海上钟带回港口在录音中没有依据。',
        en: 'Sentence 41: "Railways pushed towns to adopt one shared time, so trains could meet and connect without confusion". Railways drove standard time, matching B. Keeping local solar time contradicts give way to, and sailors carrying clocks home is not said.',
      },
    },
    {
      number: 35, accepted: ['sun'], evidence: 46,
      explanation: {
        zh: '定位句 46：Sundials read the position of the sun, which moves its shadow across the marked face。日晷读取太阳位置，填 sun。',
        en: 'Sentence 46: "Sundials read the position of the sun, which moves its shadow across the marked face". Sundials read the sun’s position, so write sun.',
      },
    },
    {
      number: 36, accepted: ['water'], evidence: 47,
      explanation: {
        zh: '定位句 47：Water clocks mark time through a steady flow of water from a marked container。水钟靠稳定水流计时，填 water。',
        en: 'Sentence 47: "Water clocks mark time through a steady flow of water from a marked container". Water clocks use a steady flow of water, so write water.',
      },
    },
    {
      number: 37, accepted: ['ticks'], evidence: 48,
      explanation: {
        zh: '定位句 48：The escapement releases the gears in regular small ticks, holding the clock to a steady beat。擒纵以均匀小滴答释放齿轮，填复数 ticks。',
        en: 'Sentence 48: "The escapement releases the gears in regular small ticks, holding the clock to a steady beat". The escapement releases gears in ticks; write the plural ticks.',
      },
    },
    {
      number: 38, accepted: ['ship'], evidence: 49,
      explanation: {
        zh: '定位句 49：Sea clocks had to survive the rocking of the ship and the changes of temperature on board。航海钟须扛住船体摇晃，填 ship。',
        en: 'Sentence 49: "Sea clocks had to survive the rocking of the ship and the changes of temperature on board". Marine clocks survive ship rocking, so write ship.',
      },
    },
    {
      number: 39, accepted: ['time'], evidence: 50,
      explanation: {
        zh: '定位句 50：Railways adopted one shared time so that schedules could connect across different towns。铁路采用一个共享时间，空后是句号，填 time。',
        en: 'Sentence 50: "Railways adopted one shared time so that schedules could connect across different towns". Railways adopted one shared time; the gap ends the sentence, so write time.',
      },
    },
    {
      number: 40, accepted: ['position'], evidence: 51,
      explanation: {
        zh: '定位句 51：Reliable clocks let sailors find their position at sea by comparing home time with the local sun。可靠时钟帮助水手在海上定位，填 position；at sea 已印在卷面上。',
        en: 'Sentence 51: "Reliable clocks let sailors find their position at sea by comparing home time with the local sun". Sailors find their position; at sea is printed, so write position.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Look around the room and try to imagine a single day without a clock.' },
    { speaker: 'lecturer', text: 'No meetings, no train schedules, no agreed hour to open a shop.' },
    { speaker: 'lecturer', text: 'Time has always mattered to people, but the devices for measuring it changed a great deal over history.' },
    { speaker: 'lecturer', text: 'This lecture follows the clock from early shadow markers to the standard time on our screens.' },
    { speaker: 'lecturer', text: 'We will cover sundials, water clocks, the mechanical escapement, marine timekeeping and the move to standard time.' },
    { speaker: 'lecturer', text: 'Before the details, a few broad points are worth noting in order.' },
    { speaker: 'lecturer', text: 'Early timepieces all had a weakness, for they depended on the weather or a steady supply of water.' },
    { speaker: 'lecturer', text: 'Sundials could not work under clouds, and water clocks froze or slowed in cold weather.' },
    { speaker: 'lecturer', text: 'Mechanical clocks solved some of those weaknesses, but their early versions still lost or gained time each day.' },
    { speaker: 'lecturer', text: 'The invention that made mechanical clocks possible was the escapement.' },
    { speaker: 'lecturer', text: 'Without it, the gears would run down quickly instead of releasing power in even steps.' },
    { speaker: 'lecturer', text: 'Later, accurate clocks mattered most on ships, where sailors needed to know their position at sea.' },
    { speaker: 'lecturer', text: 'Railways then pushed towns to share one time, ending the separate local solar times that once existed.' },
    { speaker: 'lecturer', text: 'We begin with the oldest visible timekeepers, the sundials.' },
    { speaker: 'lecturer', text: 'A sundial tracks the movement of the sun across the sky, casting a shadow on a marked face.' },
    { speaker: 'lecturer', text: 'As the day passes, the shadow shifts from one line to the next, and each line marks an hour.' },
    { speaker: 'lecturer', text: 'The design worked well in clear weather, and many public squares kept a large sundial for the town.' },
    { speaker: 'lecturer', text: 'At night, or under heavy cloud, the sundial simply gave no reading at all.' },
    { speaker: 'lecturer', text: 'People looked for a device that would keep working once the sun had set.' },
    { speaker: 'lecturer', text: 'Water clocks were one answer. They hold a measured amount of water, and level marks show how much has flowed out.' },
    { speaker: 'lecturer', text: 'The outflow had to stay steady, or the marks would drift away from the true hour.' },
    { speaker: 'lecturer', text: 'In cold regions the water could freeze, which stopped the clock until the morning sun thawed it.' },
    { speaker: 'lecturer', text: 'The next leap forward came when builders applied gears and weights to the problem.' },
    { speaker: 'lecturer', text: 'A weight hanging from a rope turns a set of gear wheels, but the wheels would spin freely without a brake.' },
    { speaker: 'lecturer', text: 'The escapement is that brake. It releases the gears in small regular ticks, one after another.' },
    { speaker: 'lecturer', text: 'Each tick lets the weight drop a little, so the clock keeps a steady beat instead of racing to the end.' },
    { speaker: 'lecturer', text: 'Early mechanical clocks stood in towers, where their bells rang the hours for the whole town.' },
    { speaker: 'lecturer', text: 'Their error was still large by modern standards, but the steady beat was a major advance over sundials and water clocks.' },
    { speaker: 'lecturer', text: 'Clockmakers spent centuries improving the balance wheel, which keeps the beat even as the weight runs down.' },
    { speaker: 'lecturer', text: 'By the seventeenth century, smaller clocks could sit in a room and still keep reasonably accurate time.' },
    { speaker: 'lecturer', text: 'The hardest test of accuracy, though, came far from land.' },
    { speaker: 'lecturer', text: 'Sailors already used the sun and stars to work out their latitude, but longitude needed a precise reference time.' },
    { speaker: 'lecturer', text: 'A ship that knew the exact time back at its home port could compare that with the local sun and find how far east or west it had sailed.' },
    { speaker: 'lecturer', text: 'Ordinary clocks could not survive the rocking, humidity and temperature changes on board a long voyage.' },
    { speaker: 'lecturer', text: 'The marine clock had to stay accurate through the motion of the ship and the swings of the weather.' },
    { speaker: 'lecturer', text: 'Over time, makers built rugged sea clocks with balances protected from the worst of the movement.' },
    { speaker: 'lecturer', text: 'Once a ship carried a reliable clock, its officers could calculate position far from any coast.' },
    { speaker: 'lecturer', text: 'This is why marine timekeeping was one of the great practical problems of early navigation.' },
    { speaker: 'lecturer', text: 'The final change we will cover is the spread of standard time across towns and countries.' },
    { speaker: 'lecturer', text: 'Before railways, each town set its own clock by the local sun, so noon arrived at a slightly different minute in every place.' },
    { speaker: 'lecturer', text: 'That worked for walking and horse travel, but train schedules could not run on a patchwork of local times.' },
    { speaker: 'lecturer', text: 'Railways pushed towns to adopt one shared time, so trains could meet and connect without confusion.' },
    { speaker: 'lecturer', text: 'Over decades, local solar time gave way to a national standard time, and later to time zones across the world.' },
    { speaker: 'lecturer', text: 'Today we take the shared hour for granted, but it is a relatively recent arrangement.' },
    { speaker: 'lecturer', text: 'We are moving on to the notes section now, so hold on to the restated points.' },
    { speaker: 'lecturer', text: 'Match each restated sentence to one of the note headings.' },
    { speaker: 'lecturer', text: 'Sundials read the position of the sun, which moves its shadow across the marked face.' },
    { speaker: 'lecturer', text: 'Water clocks mark time through a steady flow of water from a marked container.' },
    { speaker: 'lecturer', text: 'The escapement releases the gears in regular small ticks, holding the clock to a steady beat.' },
    { speaker: 'lecturer', text: 'Sea clocks had to survive the rocking of the ship and the changes of temperature on board.' },
    { speaker: 'lecturer', text: 'Railways adopted one shared time so that schedules could connect across different towns.' },
    { speaker: 'lecturer', text: 'Reliable clocks let sailors find their position at sea by comparing home time with the local sun.' },
    { speaker: 'lecturer', text: 'Each of these stages solved a weakness of the device that came before it.' },
    { speaker: 'lecturer', text: 'Sundials needed sun, water clocks needed water, and mechanical clocks needed a steady beat.' },
    { speaker: 'lecturer', text: 'Marine clocks added stability at sea, and standard time tied many towns to one shared hour.' },
    { speaker: 'lecturer', text: 'Without these steps, navigation, trade and rail travel would have run on far less certain schedules.' },
    { speaker: 'lecturer', text: 'In the next session we will look at how clock accuracy changed the shape of cities and workdays.' },
    { speaker: 'lecturer', text: 'That completes today’s overview. I hope the timeline makes sense now.' },
  ],
  vocabulary: [
    {
      term: 'sundial', phonetic: '/ˈsʌndaɪəl/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '日晷（靠太阳阴影读时的装置）', en: 'an ancient device that reads the hour from a shadow on a marked face' },
      usage: { zh: '可数；a large sundial、the town sundial。复合词。', en: 'Countable: a large sundial. A compound word.' },
      collocations: ['a sundial', 'the town sundial', 'a large sundial'],
      example: { en: 'The public square kept a large sundial for the town.', zh: '广场上立着一座供全镇看时的日晷。' },
      listening: { zh: '复合词，重音在第一词 sun；dial 读 /daɪəl/。', en: 'Compound with stress on sun; dial is /daɪəl/.' },
    },
    {
      term: 'escapement', phonetic: '/ɪˈskeɪpmənt/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '擒纵机构（让齿轮均匀间歇释放的制动件）', en: 'the brake that releases the gear train in regular ticks' },
      usage: { zh: '可数；the escapement、an escapement mechanism。动词是 escape。', en: 'Countable: the escapement. The verb is escape.' },
      collocations: ['the escapement', 'the escapement releases', 'an escapement mechanism'],
      example: { en: 'The escapement releases the gears in regular small ticks.', zh: '擒纵机构以均匀小滴答释放齿轮。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈskeɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'longitude', phonetic: '/ˈlɒŋɡɪtjuːd/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '经度（东西方向位置）', en: 'the east or west position of a ship on the globe' },
      usage: { zh: '不可数；work out longitude、calculate longitude。对比 latitude 纬度。', en: 'Uncountable: work out longitude. Contrast latitude.' },
      collocations: ['calculate longitude', 'work out longitude', 'longitude at sea'],
      example: { en: 'Longitude needed a precise reference time to calculate.', zh: '推算经度需要精确的参照时间。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈlɒŋ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'balance wheel', phonetic: '/ˈbæləns wiːl/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '摆轮（维持钟表等时摆动的部件）', en: 'the wheel that keeps the clock beating evenly as the weight runs down' },
      usage: { zh: '可数；the balance wheel、improve the balance wheel。', en: 'Countable: the balance wheel.' },
      collocations: ['the balance wheel', 'improve the balance wheel', 'a protected balance wheel'],
      example: { en: 'The balance wheel keeps the beat even as the weight runs down.', zh: '配重下行时摆轮维持稳定节拍。' },
      listening: { zh: '复合词，balance 重音在第一音节；wheel 读 /wiːl/。', en: 'Compound; balance stresses the first syllable, wheel is /wiːl/.' },
    },
    {
      term: 'rugged', phonetic: '/ˈrʌɡɪd/', partOfSpeech: 'adj.', sentenceIndex: 35,
      meaning: { zh: '坚固耐颠簸的（适合船上使用）', en: 'built to resist rocking, humidity and rough conditions' },
      usage: { zh: '形容词；rugged sea clocks、a rugged case。', en: 'Adjective: rugged sea clocks, a rugged case.' },
      collocations: ['rugged sea clocks', 'a rugged case', 'rugged equipment'],
      example: { en: 'Makers built rugged sea clocks protected from the worst movement.', zh: '制造者造出坚固的航海钟，抵御最剧烈的晃动。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈrʌ/；结尾 /ɪd/。', en: 'Two syllables with first stress; the ending is /ɪd/.' },
    },
    {
      term: 'standard time', phonetic: '/ˈstændəd taɪm/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '标准时间（一地区共享的统一时刻）', en: 'the shared time adopted across towns instead of local solar time' },
      usage: { zh: '不可数；adopt standard time、national standard time。', en: 'Uncountable: adopt standard time, national standard time.' },
      collocations: ['standard time', 'national standard time', 'adopt standard time'],
      example: { en: 'Local solar time gave way to a national standard time.', zh: '本地太阳时让位于全国标准时间。' },
      listening: { zh: '复合词，standard 重音在第一音节；time 读 /taɪm/。', en: 'Compound; standard stresses the first syllable, time is /taɪm/.' },
    },
  ],
  expressions: [
    {
      phrase: 'depended on', sentenceIndex: 6,
      meaning: { zh: '依赖，受……制约', en: 'to rely on something that may fail under bad conditions' },
      usage: { zh: 'depend on + 名词；过去式 depended on。', en: 'Depend on plus a noun; past form depended on.' },
      example: { en: 'Early clocks depended on the weather or a steady water supply.', zh: '早期时钟受天气或稳定水源制约。' },
    },
    {
      phrase: 'run down', sentenceIndex: 10,
      meaning: { zh: '（动力）耗尽，松脱走快', en: 'to lose stored power and race to the end' },
      usage: { zh: 'gear wheels run down；钟表与电池场景高频。', en: 'Gear wheels run down; common with clocks and batteries.' },
      example: { en: 'Without the escapement the gears would run down quickly.', zh: '没有擒纵，齿轮会很快松脱走快。' },
    },
    {
      phrase: 'compare that with', sentenceIndex: 32,
      meaning: { zh: '把它与……对照', en: 'to match a reference time against the local reading' },
      usage: { zh: 'compare that with the local sun；航海定位高频。', en: 'Compare that with the local sun; common in navigation.' },
      example: { en: 'The ship compares home time with the local sun to find longitude.', zh: '船只把港内时间与本地太阳对照以算经度。' },
    },
    {
      phrase: 'gave way to', sentenceIndex: 42,
      meaning: { zh: '让位于，被……取代', en: 'to be replaced gradually by a newer system' },
      usage: { zh: 'give way to + 名词；过去式 gave way to。', en: 'Give way to plus a noun; past form gave way to.' },
      example: { en: 'Local solar time gave way to a national standard time.', zh: '本地太阳时逐步被全国标准时间取代。' },
    },
    {
      phrase: 'take the shared hour for granted', sentenceIndex: 43,
      meaning: { zh: '把共享时刻视为理所当然，习以为常', en: 'to treat a recent arrangement as if it were always so' },
      usage: { zh: 'take something for granted；被动 be taken for granted。', en: 'Take something for granted; passive be taken for granted.' },
      example: { en: 'We take the shared hour for granted, though it is recent.', zh: '我们把共享时刻视为理所当然，尽管它出现得很晚。' },
    },
    {
      phrase: 'steady beat', sentenceIndex: 48,
      meaning: { zh: '稳定节拍，均匀滴答', en: 'an even rhythm that keeps the clock to its pace' },
      usage: { zh: 'hold the clock to a steady beat；钟表机芯高频。', en: 'Hold the clock to a steady beat; common with clock movements.' },
      example: { en: 'The escapement holds the clock to a steady beat.', zh: '擒纵机构让钟表保持稳定节拍。' },
    },
  ],
  tips: [
    {
      title: { zh: '概览段先答单选，复述段再填笔记', en: 'Overview sentences feed the choice items' },
      body: {
        zh: 'Part 4 开头几句话给出历史脉络与总体结论，31 到 34 题集中在概览段；35 到 40 题的术语在后面复述段。听到 Now the notes section follows 这类路标时，再开始盯填空答案词。',
        en: 'The opening sentences give the overview, and items 31 to 34 sit there; the terms for 35 to 40 appear in the restatement section later. Start watching for completion answers only after a signpost such as Now the notes section follows.',
      },
    },
    {
      title: { zh: '预判词性再等答案词', en: 'Predict the word class before listening' },
      body: {
        zh: '第 35 题空前是 the，填名词 sun；第 37 题空前是 small，填复数名词 ticks；第 39 题空前是 one shared，填不可数名词 time。听前把词性写在空格旁，录音里只等那一类词。',
        en: 'Item 35 follows the, expecting a noun; item 37 follows small, expecting a plural noun; item 39 follows one shared, expecting an uncountable noun. Note the predicted word class beside each gap before listening.',
      },
    },
    {
      title: { zh: '历史阶段按因果链定位', en: 'Locate stages along the causal chain' },
      body: {
        zh: '日晷受天气限制 → 水钟受水源限制 → 擒纵让齿轮匀速 → 航海需要经度 → 铁路推动标准时间。单选与笔记都沿这条链出现；听到 device、invention、on ships、railways 这些路标时，回到对应阶段的题目，不要把上一阶段的弱点填进下一阶段。',
        en: 'The chain runs sundial limits, water limits, escapement, marine longitude, railway standard time. Both choices and notes follow it; on a signpost such as device, invention, on ships or railways, return to that stage, rather than carrying the previous weakness forward.',
      },
    },
  ],
};
