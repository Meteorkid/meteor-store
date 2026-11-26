import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 8 · Part 4 — 讲座：自行车的发明与早期演变（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：1817 年木轮机器 → 橡胶轮胎 → 高轮车 → 安全自行车 → 用途与城市影响 → 三类早期车型特征回顾。
 * 笔记填空 31–34 按讲座顺序出现，单选 35–37 落在用途、舒适度与城市生活两段，配对 38–40 落在结尾的车型回顾。
 * 开场用历史现象与提问起手，不用 Today’s lecture is about 句式。
 */
export const test08Part4: ListeningLesson = {
  slug: 'test-08-part-4',
  part: 4,
  status: 'published',
  title: { zh: '自行车的发明', en: 'The invention of the bicycle' },
  summary: {
    zh: '一场回顾自行车早期历史的讲座：1817 年德莱斯的两轮木架机器、木轮与橡胶轮胎的更替、高轮车与安全自行车的结构差别，以及自行车如何改变城市出行和人们的居住选择。',
    en: 'A lecture reviewing the early history of the bicycle: Baron von Drais’s wooden two-wheeler of 1817, the move from wooden wheels to rubber tyres, how the high-wheel bicycle and the safety bicycle differed, and how the bicycle changed urban travel and where people chose to live.',
  },
  accent: { zh: '英式口音的男讲师，语速中等，关键年代与名称会重复。', en: 'A male lecturer with a British accent. He speaks at a moderate pace and repeats key dates and names.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'In 1817, a German nobleman, Baron von', cells: [[{ blank: 31 }, { text: ', designed the first two-wheeled machine.' }]] },
        { lead: 'The earliest machine had a solid wooden', cells: [[{ blank: 32 }, { text: ', heavy and plain.' }]] },
        { lead: 'Later,', cells: [[{ blank: 33 }, { text: ' tyres absorbed shocks and made the ride smoother.' }]] },
        { lead: 'The safety bicycle’s chain finally drove the', cells: [[{ blank: 34 }, { text: ' wheel.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'What was the draisine mainly used for?',
          options: [
            { key: 'A', text: 'carrying goods over long distances' },
            { key: 'B', text: 'travelling short distances around the grounds' },
            { key: 'C', text: 'racing on closed wooden tracks' },
          ],
        },
        {
          number: 36,
          stem: 'Why were the wooden wheels so uncomfortable?',
          options: [
            { key: 'A', text: 'The spokes were too weak to bear the rider.' },
            { key: 'B', text: 'There was no cushion between wheel and road.' },
            { key: 'C', text: 'The rims split whenever the weather was wet.' },
          ],
        },
        {
          number: 37,
          stem: 'How did the bicycle change city life?',
          options: [
            { key: 'A', text: 'It removed horses from the city streets.' },
            { key: 'B', text: 'It allowed people to live farther from their work.' },
            { key: 'C', text: 'It made the streets safer for young children.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which feature matches each early bicycle type? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'solid wooden frame' },
        { key: 'B', text: 'pedals on the front wheel' },
        { key: 'C', text: 'chain drive to the rear wheel' },
        { key: 'D', text: 'large padded leather saddle' },
        { key: 'E', text: 'iron rim on the rear wheel' },
        { key: 'F', text: 'detachable wooden handlebars' },
      ],
      items: [
        { number: 38, text: 'draisine' },
        { number: 39, text: 'high-wheel bicycle' },
        { number: 40, text: 'safety bicycle' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['Drais'], evidence: 3,
      explanation: {
        zh: '定位句 3：A German nobleman named Baron von Drais designed a machine with two equal wooden wheels。1817 年的设计者是 Baron von Drais；空后已有逗号，只填姓氏 Drais。',
        en: 'Sentence 3: "A German nobleman named Baron von Drais designed a machine with two equal wooden wheels". The 1817 inventor is Baron von Drais; the comma follows the gap, so write the surname Drais only.',
      },
    },
    {
      number: 32, accepted: ['frame'], evidence: 5,
      explanation: {
        zh: '定位句 5：Its frame was a solid wooden frame, heavy and plain, with a padded seat above the beam。最早的机器是实木车架；seat 和 beam 都是车上的另一部分，不是空里的词。',
        en: 'Sentence 5: "Its frame was a solid wooden frame, heavy and plain, with a padded seat above the beam". The earliest machine had a solid wooden frame; seat and beam are other parts, not the answer.',
      },
    },
    {
      number: 33, accepted: ['rubber'], evidence: 12,
      explanation: {
        zh: '定位句 12：Then tyre makers wrapped the wheels in rubber。橡胶轮胎吸收震动；下一句说 rubber tyres 比裸木更能减震。',
        en: 'Sentence 12: "Then tyre makers wrapped the wheels in rubber". Rubber tyres absorbed shocks; the next sentence says rubber tyres outperformed bare wood.',
      },
    },
    {
      number: 34, accepted: ['rear'], evidence: 20,
      explanation: {
        zh: '定位句 20：Its chain finally drove the rear wheel, so the rider could turn the back wheel by pedalling。链条驱动后轮；front wheel 是高轮车的结构，不在此处。',
        en: 'Sentence 20: "Its chain finally drove the rear wheel, so the rider could turn the back wheel by pedalling". The chain drives the rear wheel; the front wheel belongs to the high-wheel design.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：The draisine was meant for short trips around the grounds, not for carrying goods across the country。德拉辛车用于院内短途出行；长途载货被明确否定，赛道竞速是后来的爱好。',
        en: 'Sentence 24: "The draisine was meant for short trips around the grounds, not for carrying goods across the country". It was for short local trips; long-distance carrying is rejected, and track racing came later.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Its wooden wheels could not bend or give under the weight, so every bump went straight through to the seat。木轮没有缓冲，颠簸直接传到座位；断辐条和轮辋开裂是另外的问题。',
        en: 'Sentence 25: "Its wooden wheels could not bend or give under the weight, so every bump went straight through to the seat". Wooden wheels had no cushion; broken spokes and split rims were separate problems.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：More importantly, it changed where people could live. 下一句说职员可以骑车从城郊村庄到办公室，不必在市中心租房。自行车让人们住得离工作地点更远；马匹并未被一夜之间取代。',
        en: 'Sentence 30: "More importantly, it changed where people could live". The next sentence says a clerk could cycle from a village on the edge of town to the office instead of renting in the centre. The bicycle let people live farther from work; horses were not removed overnight.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 37,
      explanation: {
        zh: '定位句 37：The draisine kept a solid wooden frame, with no pedals or chain at all。德拉辛车是实木车架，对应 A。',
        en: 'Sentence 37: "The draisine kept a solid wooden frame, with no pedals or chain at all". The draisine had a solid wooden frame, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 38,
      explanation: {
        zh: '定位句 38：The high-wheel bicycle put its pedals on the front wheel, and nothing drove the rear。高轮车脚踏装在前轮上，对应 B。',
        en: 'Sentence 38: "The high-wheel bicycle put its pedals on the front wheel, and nothing drove the rear". The high-wheel bicycle had pedals on the front wheel, matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：The safety bicycle used a chain drive to the rear wheel, with equal wheels on both sides。安全自行车用链条驱动后轮，对应 C。',
        en: 'Sentence 39: "The safety bicycle used a chain drive to the rear wheel, with equal wheels on both sides". The safety bicycle used a chain drive to the rear wheel, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'One hundred and eighty years ago, almost nobody outside a small German town had seen two wheels joined to a frame.' },
    { speaker: 'lecturer', text: 'What looked like a toy to early visitors would become one of the most widespread machines in history.' },
    { speaker: 'lecturer', text: 'The first step came in eighteen seventeen.' },
    { speaker: 'lecturer', text: 'A German nobleman named Baron von Drais designed a machine with two equal wooden wheels.' },
    { speaker: 'lecturer', text: 'It had no engine and no pedals, and the rider pushed it along with his feet.' },
    { speaker: 'lecturer', text: 'Its frame was a solid wooden frame, heavy and plain, with a padded seat above the beam.' },
    { speaker: 'lecturer', text: 'The wooden wheels were attached to this frame at a narrow angle.' },
    { speaker: 'lecturer', text: 'The machine became known as the draisine, after its inventor.' },
    { speaker: 'lecturer', text: 'It was shown to the public at a fair in the following summer.' },
    { speaker: 'lecturer', text: 'Drais tested it in his own garden and along the paths outside his estate.' },
    { speaker: 'lecturer', text: 'For many years the design changed only slowly.' },
    { speaker: 'lecturer', text: 'Riders grew tired of the rough ride over stone roads.' },
    { speaker: 'lecturer', text: 'Then tyre makers wrapped the wheels in rubber.' },
    { speaker: 'lecturer', text: 'Rubber tyres absorbed small shocks far better than bare wood, and the ride became noticeably smoother.' },
    { speaker: 'lecturer', text: 'The smoother surface also encouraged riders to cover longer distances.' },
    { speaker: 'lecturer', text: 'The next leap was the high-wheel bicycle of the eighteen seventies.' },
    { speaker: 'lecturer', text: 'Its front wheel was very large, and the pedals were fixed directly to that wheel.' },
    { speaker: 'lecturer', text: 'The rider sat high above the hub, which looked striking but was hard to control downhill.' },
    { speaker: 'lecturer', text: 'Many riders fell when the front wheel stopped suddenly on a stone.' },
    { speaker: 'lecturer', text: 'The safety bicycle arrived in the eighteen eighties, with two wheels of equal size.' },
    { speaker: 'lecturer', text: 'Its chain finally drove the rear wheel, so the rider could turn the back wheel by pedalling.' },
    { speaker: 'lecturer', text: 'This was the design that gave us the modern bicycle.' },
    { speaker: 'lecturer', text: 'Its smaller wheels lowered the seat, which made learning to ride much safer.' },
    { speaker: 'lecturer', text: 'Now let us consider what each early machine was actually for.' },
    { speaker: 'lecturer', text: 'The draisine was meant for short trips around the grounds, not for carrying goods across the country.' },
    { speaker: 'lecturer', text: 'Its wooden wheels could not bend or give under the weight, so every bump went straight through to the seat.' },
    { speaker: 'lecturer', text: 'Rim splits and weak spokes were separate problems, but the main discomfort came from that lack of cushioning.' },
    { speaker: 'lecturer', text: 'This is why early riders wrapped their hands in leather cloths on rough roads.' },
    { speaker: 'lecturer', text: 'In the late nineteenth century, cities were crowded and horses filled the streets.' },
    { speaker: 'lecturer', text: 'The bicycle did not remove horses from cities overnight, but it offered a cleaner option for short trips.' },
    { speaker: 'lecturer', text: 'More importantly, it changed where people could live.' },
    { speaker: 'lecturer', text: 'A clerk could cycle from a village on the edge of town to his office, so he did not have to rent a room in the city centre.' },
    { speaker: 'lecturer', text: 'In this way the bicycle widened the reach of the working day.' },
    { speaker: 'lecturer', text: 'Journals of the period describe clerks cycling in on weekdays and families riding out on Sundays.' },
    { speaker: 'lecturer', text: 'Women, in particular, gained a new kind of freedom; riding let them travel beyond the family gate.' },
    { speaker: 'lecturer', text: 'Before we close, I will match the three early types to their main features.' },
    { speaker: 'lecturer', text: 'The match should help you keep the three designs apart in your notes.' },
    { speaker: 'lecturer', text: 'The draisine kept a solid wooden frame, with no pedals or chain at all.' },
    { speaker: 'lecturer', text: 'The high-wheel bicycle put its pedals on the front wheel, and nothing drove the rear.' },
    { speaker: 'lecturer', text: 'The safety bicycle used a chain drive to the rear wheel, with equal wheels on both sides.' },
    { speaker: 'lecturer', text: 'People sometimes say the bicycle was invented for sport, but early machines were practical transport.' },
    { speaker: 'lecturer', text: 'A few enthusiasts raced early machines on closed tracks, but that was a later hobby.' },
    { speaker: 'lecturer', text: 'By the nineteen hundreds, bicycle clubs had appeared in most major cities.' },
    { speaker: 'lecturer', text: 'Manufacturers experimented with new materials, moving from wood to steel and then to aluminium.' },
    { speaker: 'lecturer', text: 'Steel frames were lighter than wood and stronger under pressure.' },
    { speaker: 'lecturer', text: 'Aluminium later cut the weight further, though it cost more to produce.' },
    { speaker: 'lecturer', text: 'Each material swap reduced weight without giving up strength.' },
    { speaker: 'lecturer', text: 'Tyre design continued to improve, with inner tubes and thicker treads.' },
    { speaker: 'lecturer', text: 'Wheels, brakes and gears were refined through the first half of the twentieth century.' },
    { speaker: 'lecturer', text: 'Pneumatic tyres, freewheels and the rear derailleur all came after the safety bicycle.' },
    { speaker: 'lecturer', text: 'Many features we take for granted today were added piece by piece.' },
    { speaker: 'lecturer', text: 'To sum up, the bicycle did not appear all at once.' },
    { speaker: 'lecturer', text: 'Each generation changed one part, the wheel, the frame, the tyre, the chain, and passed it on.' },
    { speaker: 'lecturer', text: 'The next time you ride, it is worth remembering how long that evolution took.' },
  ],
  vocabulary: [
    {
      term: 'nobleman', phonetic: '/ˈnəʊblmən/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '贵族', en: 'a man from a titled aristocratic family' },
      usage: { zh: '可数；a German nobleman、an English nobleman。', en: 'Countable: a German nobleman, an English nobleman.' },
      collocations: ['a nobleman', 'the German nobleman', 'a titled nobleman'],
      example: { en: 'A German nobleman designed the first two-wheeled machine.', zh: '一位德国贵族设计了最早的两轮机器。' },
      listening: { zh: '复合词 noble + man，重音在第一音节。', en: 'Compound noble plus man, stress on the first.' },
    },
    {
      term: 'frame', phonetic: '/freɪm/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '车架，框架', en: 'the rigid structure that supports the wheels and seat' },
      usage: { zh: '可数；a wooden frame、the bicycle frame。', en: 'Countable: a wooden frame, the bicycle frame.' },
      collocations: ['a solid wooden frame', 'the steel frame', 'the frame of the machine'],
      example: { en: 'The earliest machine had a heavy wooden frame.', zh: '最早的机器有沉重的木车架。' },
      listening: { zh: '单音节，开头 /fr/ 辅音连缀清晰。', en: 'One syllable with a clear opening /fr/ cluster.' },
    },
    {
      term: 'tyre', phonetic: '/ˈtaɪə(r)/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '轮胎（英式拼写）', en: 'the rubber covering around a wheel' },
      usage: { zh: '可数；rubber tyres、tyre makers。美式拼写 tire。', en: 'Countable: rubber tyres, tyre makers. The American spelling is tire.' },
      collocations: ['rubber tyres', 'tyre design', 'a tyre maker'],
      example: { en: 'Tyre makers wrapped the wheels in rubber.', zh: '轮胎制造商给轮子包上橡胶。' },
      listening: { zh: '两个音节，重音在第一音节；英式 /aɪə/。', en: 'Two syllables with stress on the first and a British /aɪə/.' },
    },
    {
      term: 'pedals', phonetic: '/ˈpedlz/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '脚踏板', en: 'the part of a bicycle that the rider pushes with the foot' },
      usage: { zh: '可数；pedals on the front wheel、press a pedal。', en: 'Countable: pedals on the front wheel, press a pedal.' },
      collocations: ['the pedals', 'front-wheel pedals', 'a spare pedal'],
      example: { en: 'The pedals were fixed directly to the large front wheel.', zh: '脚踏板直接装在大前轮上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈped/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'rear', phonetic: '/rɪə(r)/', partOfSpeech: 'adj.', sentenceIndex: 20,
      meaning: { zh: '后部的，后面的', en: 'at the back of a vehicle' },
      usage: { zh: '形容词；the rear wheel、the rear gear。对照 front。', en: 'Adjective: the rear wheel, the rear gear. Compare front.' },
      collocations: ['the rear wheel', 'the rear brake', 'the rear derailleur'],
      example: { en: 'The chain drove the rear wheel by pedalling.', zh: '链条通过脚踏带动后轮。' },
      listening: { zh: '单音节，开头 /r/ 与元音 /ɪə/。', en: 'One syllable with an opening /r/ and /ɪə/.' },
    },
    {
      term: 'cushioning', phonetic: '/ˈkʊʃənɪŋ/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '缓冲，减震材料', en: 'soft material or give that absorbs a shock' },
      usage: { zh: '不可数；lack of cushioning、soft cushioning。动词 cushion。', en: 'Uncountable: lack of cushioning, soft cushioning. The verb is cushion.' },
      collocations: ['lack of cushioning', 'soft cushioning', 'extra cushioning'],
      example: { en: 'The main discomfort came from that lack of cushioning.', zh: '主要的不适来自缺少缓冲。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkʊ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'aluminium', phonetic: '/ˌæljəˈmɪniəm/', partOfSpeech: 'n.', sentenceIndex: 43,
      meaning: { zh: '铝', en: 'a light silver-grey metal used in frames and parts' },
      usage: { zh: '不可数；aluminium frames、an aluminium alloy。美式 aluminum。', en: 'Uncountable: aluminium frames, an aluminium alloy. American: aluminum.' },
      collocations: ['aluminium frames', 'an aluminium alloy', 'made of aluminium'],
      example: { en: 'Aluminium later cut the weight further than steel.', zh: '铝后来比钢进一步减轻了重量。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈmɪ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'evolution', phonetic: '/ˌiːvəˈluːʃn/', partOfSpeech: 'n.', sentenceIndex: 53,
      meaning: { zh: '演变，逐步发展', en: 'the gradual development of something over time' },
      usage: { zh: '不可数；the evolution of the bicycle、human evolution。', en: 'Uncountable: the evolution of the bicycle, human evolution.' },
      collocations: ['the evolution of', 'a slow evolution', 'product evolution'],
      example: { en: 'It is worth remembering how long that evolution took.', zh: '值得记住这段演变经历了多长时间。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈluː/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'joined to', sentenceIndex: 0,
      meaning: { zh: '连接到，固定在', en: 'attached or fastened to something else' },
      usage: { zh: '被动结构；two wheels joined to a frame。', en: 'Passive: two wheels joined to a frame.' },
      example: { en: 'Almost nobody had seen two wheels joined to a frame.', zh: '几乎没人见过两个轮子连在一个车架上。' },
    },
    {
      phrase: 'after its inventor', sentenceIndex: 7,
      meaning: { zh: '以发明者命名', en: 'given the name of the person who created it' },
      usage: { zh: '以发明者命名：name something after somebody，如 the draisine after Drais。', en: 'Name something after somebody: the draisine after Drais.' },
      example: { en: 'The machine became known as the draisine, after its inventor.', zh: '这台机器以发明者之名称为德拉辛车。' },
    },
    {
      phrase: 'give under the weight', sentenceIndex: 25,
      meaning: { zh: '受压变形，被压弯', en: 'to bend or give way under pressure' },
      usage: { zh: 'give 在此为“凹陷、让步”；wood that cannot give under weight。', en: 'Here give means bend or yield: wood that cannot give under weight.' },
      example: { en: 'The wooden wheels could not bend or give under the weight.', zh: '木轮受压时不会弯曲变形。' },
    },
    {
      phrase: 'came from', sentenceIndex: 26,
      meaning: { zh: '源自，来自', en: 'to be caused by or originate in' },
      usage: { zh: '不适、优势、问题的来源；discomfort came from a lack of cushioning。', en: 'Source of a feeling or problem: discomfort came from a lack of cushioning.' },
      example: { en: 'The main discomfort came from that lack of cushioning.', zh: '主要不适来自缺少缓冲。' },
    },
    {
      phrase: 'take for granted', sentenceIndex: 50,
      meaning: { zh: '视为理所当然', en: 'to assume something always works and stop noticing it' },
      usage: { zh: '视为理所当然：take something for granted，如 features we take for granted。', en: 'Take something for granted: features we take for granted.' },
      example: { en: 'Many features we take for granted today were added piece by piece.', zh: '我们今天习以为常的许多部件是一步步加上去的。' },
    },
    {
      phrase: 'piece by piece', sentenceIndex: 50,
      meaning: { zh: '一点一点地，逐步', en: 'one part at a time, gradually' },
      usage: { zh: '方式状语；build it up piece by piece。', en: 'An adverbial: build it up piece by piece.' },
      example: { en: 'The features were added piece by piece over many decades.', zh: '这些部件是几十年间逐步加上的。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题抓年代与名词', en: 'For note-taking, catch dates and nouns' },
      body: {
        zh: '第 31–34 题按讲座顺序排。笔记里已印好年份、车型和上下文，听到 1817、frame、rubber、rear wheel 这类关键词时填对应空；答案多为普通名词或人名，别填整句。',
        en: 'Items 31 to 34 follow the lecture order. The notes already print dates, types and context; when you hear keywords such as 1817, frame, rubber or rear wheel, fill the matching gap. Answers are usually common nouns or a name, not whole phrases.',
      },
    },
    {
      title: { zh: '配对题用车型词回勾', en: 'For matching, anchor on the vehicle type' },
      body: {
        zh: '第 38–40 题把三类早期车型和结构特征配对。结尾回顾段每句先报车型（draisine、high-wheel、safety bicycle），再说特征；先把车型写在题号旁，再把 wooden frame、front-wheel pedals、chain drive 对上字母。',
        en: 'Items 38 to 40 pair three early bicycle types with features. In the closing review each sentence names the type first, draisine, high-wheel or safety bicycle, then the feature. Write the type beside the number, then match wooden frame, front-wheel pedals and chain drive to a letter.',
      },
    },
    {
      title: { zh: '否定句反推用途', en: 'Use negatives to reject options' },
      body: {
        zh: '第 35、37 题的干扰项在录音里被明确否定：not for carrying goods、did not remove horses。听到 not、not for、did not 时，把对应的选项划掉，剩下的才是讲师肯定的说法。',
        en: 'The distractors for items 35 and 37 are explicitly rejected: not for carrying goods and did not remove horses. When you hear not, not for or did not, cross out the matching option; what the lecturer affirms remains.',
      },
    },
  ],
};
