import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 2 · Part 4 — 讲座：城市热岛效应。原创仿真材料，非官方真题。
 *
 * 结构：现象 → 成因 → 三类对策（绿化、浅色表面、通风）→ 绿墙的局限 → 为什么重要 → 结论。
 * 笔记填空 31–36 按讲座顺序出现；结论处会回扣两座城市，配对题 39–40 落在那里，
 * 所以听到第一次提到洛杉矶和斯图加特时不要急着落笔。
 */
export const test02Part4: ListeningLesson = {
  slug: 'test-02-part-4',
  part: 4,
  status: 'published',
  title: { zh: '城市热岛：为什么市区比郊区热', en: 'Urban heat islands: why cities are hotter' },
  summary: {
    zh: '一场关于城市热岛效应的讲座：夜间温差有多大、是什么造成的，种树、浅色表面和通风走廊各自怎么起作用，以及绿墙为什么依赖灌溉。',
    en: 'A lecture on the urban heat island: how large the night-time gap is, what causes it, how trees, pale surfaces and wind corridors each help, and why green walls depend on irrigation.',
  },
  accent: { zh: '美式口音的男讲师，语速平稳，术语会重复。', en: 'A male lecturer with an American accent. He speaks steadily and repeats key terms.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'A large city can be up to', cells: [[{ blank: 31 }, { text: ' degrees warmer at night.' }]] },
        { lead: 'Dark surfaces absorb more', cells: [[{ blank: 32 }, { text: ' than light ones.' }]] },
        { lead: 'The effect almost disappears on', cells: [[{ blank: 33 }, { text: ' or cloudy days.' }]] },
        { lead: 'A large park cools the air for about', cells: [[{ blank: 34 }, { text: ' metres beyond its edge.' }]] },
        { lead: 'In Tokyo, many households now paint their roofs', cells: [[{ blank: 35 }, { text: '.' }]] },
        { lead: 'Traditional courtyards keep people cool through', cells: [[{ blank: 36 }, { text: '.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'What limitation of green walls does the lecturer mention?',
          options: [
            { key: 'A', text: 'They are more expensive than planting trees.' },
            { key: 'B', text: 'They work only on very tall buildings.' },
            { key: 'C', text: 'Their cooling effect depends on irrigation.' },
          ],
        },
        {
          number: 38,
          stem: 'Why are warm nights in cities a health concern?',
          options: [
            { key: 'A', text: 'People cannot cool down while they sleep.' },
            { key: 'B', text: 'Hospitals are further away in the suburbs.' },
            { key: 'C', text: 'More people work at night in cities.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which city is each measure associated with? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Los Angeles' },
        { key: 'B', text: 'Stuttgart' },
        { key: 'C', text: 'Tokyo' },
        { key: 'D', text: 'Singapore' },
        { key: 'E', text: 'Paris' },
      ],
      items: [
        { number: 39, text: 'a pale coating painted onto the streets' },
        { number: 40, text: 'strips of land kept free for air to flow' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['five', '5'], evidence: 5,
      explanation: {
        zh: '定位句 5：a large city can be up to five degrees warmer。up to five 是夜间温差的上限；下一句的 one or two degrees 是白天的温差，不要填错。',
        en: 'Sentence 5: "a large city can be up to five degrees warmer". That is the night-time maximum; one or two degrees in the next sentence is the daytime gap.',
      },
    },
    {
      number: 32, accepted: ['heat'], evidence: 8,
      explanation: {
        zh: '定位句 8：Concrete, asphalt and roof tiles absorb more heat than grass, trees and water do。吸收的是 heat；concrete、asphalt 是材料名。',
        en: 'Sentence 8: "Concrete, asphalt and roof tiles absorb more heat than grass, trees and water do". They absorb heat; concrete and asphalt are the materials.',
      },
    },
    {
      number: 33, accepted: ['windy'], evidence: 15,
      explanation: {
        zh: '定位句 15：it almost disappears on windy or cloudy ones。空格与 cloudy 并列，填形容词 windy。',
        en: 'Sentence 15: "it almost disappears on windy or cloudy ones". The gap is parallel to cloudy, so the adjective windy is needed.',
      },
    },
    {
      number: 34, accepted: ['two hundred', '200'], spoken: 'two hundred', evidence: 22,
      explanation: {
        zh: '定位句 22：for a distance of about two hundred metres beyond its edge。写数字 200 或英文 two hundred 都对；注意不是 seventy（那是深色材料能达到的温度）。',
        en: 'Sentence 22: "for a distance of about two hundred metres beyond its edge". 200 or two hundred both fit; seventy is the temperature a dark material can reach.',
      },
    },
    {
      number: 35, accepted: ['white'], evidence: 27,
      explanation: {
        zh: '定位句 27：many households now paint their roofs white。句首的 light-coloured material 是政府对建筑商的建议，不是居民刷的颜色。',
        en: 'Sentence 27: "many households now paint their roofs white". Light-coloured material is what builders were asked to use, not what households paint.',
      },
    },
    {
      number: 36, accepted: ['ventilation'], evidence: 36,
      explanation: {
        zh: '定位句 36：people were kept cool through ventilation rather than machines。rather than 之后是 air conditioning 一类的机器，不是答案。',
        en: 'Sentence 36: "people were kept cool through ventilation rather than machines". What follows rather than is not the answer.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 40,
      explanation: {
        zh: '定位句 40：If they are not watered, they stop cooling and simply become a layer of dry material。绿墙的降温取决于浇水；下一句还提到需要 irrigation system。A、B 原文都没有提到。',
        en: 'Sentence 40: "If they are not watered, they stop cooling and simply become a layer of dry material". Cooling depends on watering, and the next sentence mentions an irrigation system. A and B are never said.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：If the night stays warm, people with heart conditions and older people cannot get that recovery。人体在睡眠时降温恢复，夜间太热就恢复不了。',
        en: 'Sentence 46: "If the night stays warm, people with heart conditions and older people cannot get that recovery". The body cools and recovers during sleep, which a warm night prevents.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 52,
      explanation: {
        zh: '定位句 52：In Los Angeles, the pale coating is being extended to more neighbourhoods each year。给街道涂浅色涂层的是洛杉矶；东京是刷白屋顶，不要混淆。',
        en: 'Sentence 52: "In Los Angeles, the pale coating is being extended to more neighbourhoods each year". Los Angeles paints the streets; Tokyo is about white roofs.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 53,
      explanation: {
        zh: '定位句 53：In Stuttgart, the wind paths are now written into the city plan。保留空地让冷空气流动的是斯图加特；新加坡是新建的通风路径，是干扰项。',
        en: 'Sentence 53: "In Stuttgart, the wind paths are now written into the city plan". Stuttgart keeps land free for air; Singapore, which builds wind paths into new districts, is the distractor.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Good afternoon.' },
    { speaker: 'lecturer', text: 'Today I want to look at a question that affects anyone who has ever walked from a park into a car park on a summer afternoon.' },
    { speaker: 'lecturer', text: 'Why is the city hotter than the countryside around it?' },
    { speaker: 'lecturer', text: 'The effect has a name.' },
    { speaker: 'lecturer', text: 'It is called the urban heat island, because a city behaves like an island of heat in a cooler sea.' },
    { speaker: 'lecturer', text: 'On a clear, calm night, a large city can be up to five degrees warmer than the fields that surround it.' },
    { speaker: 'lecturer', text: 'During the day the difference is smaller, often only one or two degrees.' },
    { speaker: 'lecturer', text: 'The reason is that cities store heat and release it slowly.' },
    { speaker: 'lecturer', text: 'Concrete, asphalt and roof tiles absorb more heat than grass, trees and water do.' },
    { speaker: 'lecturer', text: 'After sunset, those surfaces give their heat back to the air, just when a field would already have cooled.' },
    { speaker: 'lecturer', text: 'There are other causes as well.' },
    { speaker: 'lecturer', text: 'Cars, air conditioning and factories all release waste heat.' },
    { speaker: 'lecturer', text: 'Tall buildings block the wind, so the air is not replaced as quickly.' },
    { speaker: 'lecturer', text: 'And there is less water evaporating from soil and plants, and evaporation is a powerful cooling process.' },
    { speaker: 'lecturer', text: 'The strength of the effect depends on the weather.' },
    { speaker: 'lecturer', text: 'It is strongest on clear, still nights, and it almost disappears on windy or cloudy ones.' },
    { speaker: 'lecturer', text: 'If you want to know whether a city has a heat island, you need measurements taken at night, not in the middle of the day.' },
    { speaker: 'lecturer', text: 'So what can be done about it?' },
    { speaker: 'lecturer', text: 'The first and most familiar answer is to plant trees.' },
    { speaker: 'lecturer', text: 'A single large tree can cool the air beneath it by several degrees, mostly through the water it releases from its leaves.' },
    { speaker: 'lecturer', text: 'But trees take decades to grow, and not every street has room for them.' },
    { speaker: 'lecturer', text: 'Parks work at a larger scale.' },
    { speaker: 'lecturer', text: 'Measurements in several cities show that a large park can cool the air for a distance of about two hundred metres beyond its edge.' },
    { speaker: 'lecturer', text: 'Beyond that, the effect fades quickly.' },
    { speaker: 'lecturer', text: 'So a city needs many small parks spread out across it, rather than one large one on the outskirts.' },
    { speaker: 'lecturer', text: 'A second approach is to change the colour of surfaces.' },
    { speaker: 'lecturer', text: 'Dark materials can reach seventy degrees in direct sun, while a white surface stays far cooler.' },
    { speaker: 'lecturer', text: 'In Tokyo, the city government encouraged builders to cover rooftops with light-coloured material, and many households now paint their roofs white.' },
    { speaker: 'lecturer', text: 'The same idea has been tried on streets.' },
    { speaker: 'lecturer', text: 'In Los Angeles, crews have been coating asphalt with a pale paint that reflects sunlight.' },
    { speaker: 'lecturer', text: 'The coating lowers the surface temperature, although some researchers worry that the reflected heat can be felt by people walking nearby.' },
    { speaker: 'lecturer', text: 'A third approach is to shape the city so that air can move through it.' },
    { speaker: 'lecturer', text: 'Stuttgart is the classic example.' },
    { speaker: 'lecturer', text: 'It sits in a valley, and for decades its planners have kept certain strips of land free of buildings, so that cool air can flow down from the hills at night.' },
    { speaker: 'lecturer', text: 'Other cities, such as Singapore, have gone further and built whole districts with wind paths between the towers.' },
    { speaker: 'lecturer', text: 'Long before air conditioning, builders in hot countries understood the same principle.' },
    { speaker: 'lecturer', text: 'Houses were arranged around courtyards, with high ceilings and shuttered windows, so that people were kept cool through ventilation rather than machines.' },
    { speaker: 'lecturer', text: 'I should say a word about green walls, since they are fashionable at the moment.' },
    { speaker: 'lecturer', text: 'A wall covered in plants does cool the building behind it, and it insulates against noise.' },
    { speaker: 'lecturer', text: 'But the cooling depends on the plants being healthy.' },
    { speaker: 'lecturer', text: 'If they are not watered, they stop cooling and simply become a layer of dry material.' },
    { speaker: 'lecturer', text: 'So a green wall needs an irrigation system, and that system uses water that many cities cannot spare.' },
    { speaker: 'lecturer', text: 'That brings me to the question I am asked most often.' },
    { speaker: 'lecturer', text: 'Why does any of this matter, if the difference is only a few degrees?' },
    { speaker: 'lecturer', text: 'The answer is the night.' },
    { speaker: 'lecturer', text: 'Our bodies recover from the day’s heat while we sleep.' },
    { speaker: 'lecturer', text: 'If the night stays warm, people with heart conditions and older people cannot get that recovery, and the number of deaths rises.' },
    { speaker: 'lecturer', text: 'During a heat wave, the difference between a cool suburb and a hot inner city can be a matter of life and death.' },
    { speaker: 'lecturer', text: 'It is also an issue of fairness.' },
    { speaker: 'lecturer', text: 'The poorest districts often have the fewest trees and the most tarmac, so they are the hottest.' },
    { speaker: 'lecturer', text: 'Cooling a city is therefore not only about comfort.' },
    { speaker: 'lecturer', text: 'To conclude, let me return to the two cities I mentioned earlier.' },
    { speaker: 'lecturer', text: 'In Los Angeles, the pale coating is being extended to more neighbourhoods each year.' },
    { speaker: 'lecturer', text: 'In Stuttgart, the wind paths are now written into the city plan, so they cannot be built over.' },
    { speaker: 'lecturer', text: 'So remember three things.' },
    { speaker: 'lecturer', text: 'Heat islands are strongest at night.' },
    { speaker: 'lecturer', text: 'They are caused mainly by the materials we build with.' },
    { speaker: 'lecturer', text: 'And they can be reduced by shade, by pale surfaces and by letting the wind through.' },
  ],
  vocabulary: [
    {
      term: 'rooftops', phonetic: '/ˈrɒftɒps/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '屋顶（顶部表面）', en: 'the flat or sloped tops of buildings' },
      usage: { zh: 'rooftop 指屋顶这个面，roof 指整个屋顶结构；常见 rooftop garden、rooftop solar panels。', en: 'Rooftop is the top surface and roof the whole structure: rooftop garden, rooftop solar panels.' },
      collocations: ['a rooftop garden', 'rooftop solar panels', 'cover rooftops'],
      example: { en: 'The city offers a grant for turning rooftops into gardens.', zh: '该市为把屋顶改造成花园提供补贴。' },
      listening: { zh: '由 roof 和 top 复合而成，两个部分都要听出来。', en: 'A compound of roof and top; listen for both halves.' },
    },
    {
      term: 'asphalt', phonetic: '/ˈæsfælt/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '沥青', en: 'a dark material used for covering roads' },
      usage: { zh: '美式读 /ˈæsfɔːlt/；英式常说 tarmac 或 tarmacadam。城市环境类讲座高频词。', en: 'American /ˈæsfɔːlt/; British English often says tarmac. Common in lectures on cities.' },
      collocations: ['asphalt roads', 'an asphalt surface', 'coating asphalt'],
      example: { en: 'The playground was resurfaced with dark asphalt, which grew hot in summer.', zh: '操场铺了深色沥青，夏天变得很烫。' },
      listening: { zh: '重音在第一个音节，第二音节弱读；美音读 /ˈæsfɔːlt/。', en: 'Stress the first syllable and reduce the second; American English has /ˈæsfɔːlt/.' },
    },
    {
      term: 'evaporation', phonetic: '/ɪˌvæpəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '蒸发', en: 'the process by which a liquid turns into vapour' },
      usage: { zh: '动词是 evaporate；evaporation has a cooling effect 是物理与地理讲座的常见说法。', en: 'The verb is evaporate; evaporation has a cooling effect is common in physics and geography.' },
      collocations: ['the rate of evaporation', 'evaporation has a cooling effect', 'water loss through evaporation'],
      example: { en: 'Sweating cools the body because of the evaporation of water from the skin.', zh: '出汗能降温，是因为皮肤上的水分蒸发。' },
      listening: { zh: '五个音节，重音在倒数第二个 /ˈreɪ/，前面弱读。', en: 'Five syllables with stress near the end, on /ˈreɪ/.' },
    },
    {
      term: 'fades', phonetic: '/feɪdz/', partOfSpeech: 'v.', sentenceIndex: 23,
      meaning: { zh: '逐渐减弱，消退', en: 'becomes weaker or less distinct gradually' },
      usage: { zh: 'fade 的第三人称单数；the effect fades、fade away、fade out。', en: 'Third person of fade: the effect fades, fade away, fade out.' },
      collocations: ['the effect fades', 'fade away', 'fade out'],
      example: { en: 'The signal fades as you drive further from the tower.', zh: '离信号塔越远，信号越弱。' },
      listening: { zh: '结尾是浊辅音 /dz/，与 face（/s/）仅一音之差。', en: 'It ends in the voiced /dz/, unlike face.' },
    },
    {
      term: 'outskirts', phonetic: '/ˈaʊtskɜːts/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '市郊，外围地区', en: 'the outer parts of a town or city' },
      usage: { zh: '几乎总是复数，并搭配 on：on the outskirts of the city。', en: 'Almost always plural, with on: on the outskirts of the city.' },
      collocations: ['on the outskirts of', 'live on the outskirts'],
      example: { en: 'They bought a small house on the outskirts of Leeds.', zh: '他们在利兹市郊买了一栋小房子。' },
      listening: { zh: '重音在第一个音节，out 要读清楚；与 sky 无关，s-k 连读。', en: 'Stress the first syllable, out; the middle is sk.' },
    },
    {
      term: 'insulates', phonetic: '/ˈɪnsjuleɪts/', partOfSpeech: 'v.', sentenceIndex: 38,
      meaning: { zh: '使隔热（或隔音、绝缘）', en: 'protects something from heat, sound or electricity' },
      usage: { zh: 'insulate something against something：insulate a wall against noise；名词是 insulation。', en: 'Insulate something against something; the noun is insulation.' },
      collocations: ['insulate against noise', 'insulate a wall', 'well insulated'],
      example: { en: 'Double glazing insulates the room against traffic noise.', zh: '双层玻璃使房间不受交通噪音干扰。' },
      listening: { zh: '结尾是 /leɪts/；名词 insulation 的结尾是 /ʃn/，结尾不同。', en: 'The verb ends in /leɪts/; the noun insulation ends in /ʃn/.' },
    },
    {
      term: 'irrigation', phonetic: '/ˌɪrɪˈɡeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '灌溉', en: 'the supply of water to land or plants' },
      usage: { zh: 'irrigation system、irrigate the fields；农业与园林讲座高频。', en: 'Irrigation system, irrigate the fields; common in agriculture and landscape lectures.' },
      collocations: ['an irrigation system', 'irrigate the fields', 'drip irrigation'],
      example: { en: 'Drip irrigation delivers water straight to the roots.', zh: '滴灌把水直接送到根部。' },
      listening: { zh: '重音在第三个音节 /ˈɡeɪ/，开头是弱读的 /ɪrɪ/。', en: 'Stress the third syllable, /ˈɡeɪ/; the opening /ɪrɪ/ is weak.' },
    },
    {
      term: 'fairness', phonetic: '/ˈfeənəs/', partOfSpeech: 'n.', sentenceIndex: 48,
      meaning: { zh: '公平，公正', en: 'the quality of treating people equally' },
      usage: { zh: 'an issue of fairness、in fairness to somebody；形容词是 fair。', en: 'An issue of fairness, in fairness to somebody; the adjective is fair.' },
      collocations: ['an issue of fairness', 'a sense of fairness', 'in fairness to'],
      example: { en: 'There is a question of fairness in how the tickets are sold.', zh: '售票方式存在公平问题。' },
      listening: { zh: '英音 /ˈfeənəs/，美音 /ˈfernəs/；与 fairness 相对的是 unfairness。', en: 'British /ˈfeənəs/, American /ˈfernəs/.' },
    },
    {
      term: 'shade', phonetic: '/ʃeɪd/', partOfSpeech: 'n.', sentenceIndex: 57,
      meaning: { zh: '阴凉处，树荫', en: 'an area sheltered from direct sunlight' },
      usage: { zh: '不可数：sit in the shade、provide shade；与 shadow（影子）不同。', en: 'Uncountable: sit in the shade, provide shade; not the same as shadow.' },
      collocations: ['sit in the shade', 'provide shade', 'the shade of a tree'],
      example: { en: 'The trees along the canal provide shade for walkers.', zh: '运河边的树给行人提供了阴凉。' },
      listening: { zh: '与 shad-e 连读，长元音 /eɪ/；注意与 shadow 区分。', en: 'A long /eɪ/; do not confuse it with shadow.' },
    },
    {
      term: 'valley', phonetic: '/ˈvæli/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '山谷', en: 'low land between hills or mountains' },
      usage: { zh: 'sit in a valley、a river valley、the valley floor；地理讲座基础词。', en: 'Sit in a valley, a river valley, the valley floor.' },
      collocations: ['sit in a valley', 'a river valley', 'the valley floor'],
      example: { en: 'Fog collects in the valley on calm mornings.', zh: '晴朗无风的早晨，雾会聚集在山谷里。' },
      listening: { zh: '重音在第一个音节，结尾 /i/ 很轻。', en: 'Stress the first syllable; the final /i/ is light.' },
    },
    {
      term: 'reflects', phonetic: '/rɪˈflekt/', partOfSpeech: 'v.', sentenceIndex: 29,
      meaning: { zh: '反射', en: 'sends back light or heat instead of absorbing it' },
      usage: { zh: 'reflect sunlight、be reflected in a mirror；名词是 reflection。', en: 'Reflect sunlight, be reflected in a mirror; the noun is reflection.' },
      collocations: ['reflect sunlight', 'reflect heat', 'reflect on something'],
      example: { en: 'Light-coloured roofs reflect sunlight and keep rooms cooler.', zh: '浅色屋顶反射阳光，让房间更凉快。' },
      listening: { zh: '第三人称单数结尾 /ts/；与 reflex（反射动作）拼写接近。', en: 'The third person ending is /ts/; compare reflex.' },
    },
  ],
  expressions: [
    {
      phrase: 'behaves like', sentenceIndex: 4,
      meaning: { zh: '表现得像，作用如同', en: 'acts in the same way as' },
      usage: { zh: 'behave 作不及物动词，like 引出比喻的对象；这里把城市比作热海中的岛屿。', en: 'Behave is intransitive here; like introduces the comparison.' },
      example: { en: 'Under load, this material behaves like a spring.', zh: '受力时，这种材料表现得像弹簧。' },
    },
    {
      phrase: 'give their heat back', sentenceIndex: 9,
      meaning: { zh: '把热量释放出来', en: 'release the stored heat' },
      usage: { zh: 'give something back 字面是“归还”，这里指夜间向空气释放白天储存的热量。', en: 'Give something back literally means return; here it means release stored heat.' },
      example: { en: 'After dark, the stone walls give their heat back to the room.', zh: '天黑后，石墙把热量释放回房间。' },
    },
    {
      phrase: 'depends on', sentenceIndex: 14,
      meaning: { zh: '取决于', en: 'is affected or determined by' },
      usage: { zh: 'depend on something / depend on whether…；不用 depend of。', en: 'Depend on something; never depend of.' },
      example: { en: 'The answer depends on how much time we have.', zh: '答案取决于我们有多少时间。' },
    },
    {
      phrase: 'beyond its edge', sentenceIndex: 22,
      meaning: { zh: '在它的边界之外', en: 'past the outer boundary of something' },
      usage: { zh: 'beyond 表示“超出、在……之外”；beyond the edge of the wood、beyond its edge。', en: 'Beyond means past or outside.' },
      example: { en: 'The path continues beyond its edge for another kilometre.', zh: '这条路在它的边界之外还延伸一公里。' },
    },
    {
      phrase: 'spread out', sentenceIndex: 24,
      meaning: { zh: '分散分布', en: 'distributed over an area rather than concentrated' },
      usage: { zh: 'spread 的过去式和过去分词都是 spread；spread out across a region。', en: 'Spread is unchanged in the past; spread out across a region.' },
      example: { en: 'The villages are spread out along the coast.', zh: '村庄沿着海岸分散分布。' },
    },
    {
      phrase: 'at the moment', sentenceIndex: 37,
      meaning: { zh: '目前，眼下', en: 'now, at the present time' },
      usage: { zh: '放在句末；与 currently 同义，但更口语。', en: 'Goes at the end; similar to currently but more conversational.' },
      example: { en: 'Electric taxis are fashionable at the moment.', zh: '电动出租车眼下很流行。' },
    },
    {
      phrase: 'a matter of', sentenceIndex: 47,
      meaning: { zh: '一个……的问题', en: 'something that is about or depends on' },
      usage: { zh: 'a matter of life and death 是固定说法，表示“生死攸关”；a matter of time 表示“迟早的事”。', en: 'A matter of life and death is a set phrase; a matter of time means it will happen eventually.' },
      example: { en: 'Getting the vaccine to the village was a matter of life and death.', zh: '把疫苗送到村里是生死攸关的事。' },
    },
    {
      phrase: 'letting the wind through', sentenceIndex: 57,
      meaning: { zh: '让风通过', en: 'allowing moving air to pass' },
      usage: { zh: 'let something through；through 是副词，表示“穿过”。', en: 'Let something through; through is an adverb meaning pass.' },
      example: { en: 'Open the windows on both sides, letting the wind through the house.', zh: '打开两边的窗户，让风穿过房子。' },
    },
  ],
  tips: [
    {
      title: { zh: '看空格左右，先定词性', en: 'Use the words around the gap' },
      body: {
        zh: '第 33 题 on ___ or cloudy days：与 cloudy 并列，一定是形容词；第 32 题 absorb more ___：名词；第 36 题 through ___：名词。定好词性再去听，过滤掉大半干扰信息。',
        en: 'Item 33, on ___ or cloudy days, needs an adjective parallel to cloudy; item 32, absorb more ___, needs a noun; item 36, through ___, also a noun. Fix the part of speech before you listen.',
      },
    },
    {
      title: { zh: '数字题直接写阿拉伯数字', en: 'Write numbers as figures' },
      body: {
        zh: 'two hundred 写成 200 省时间也不会拼错；题干允许 AND/OR A NUMBER。但要注意 up to five、about two hundred 这类修饰词，它们说明这是上限或约数，而不是精确值。',
        en: 'Write 200 rather than two hundred: faster and safe when the instruction allows a number. Keep an ear on up to five and about two hundred, which mark a maximum or an estimate.',
      },
    },
    {
      title: { zh: '结论会回扣前文，按题目顺序等', en: 'The conclusion returns to earlier points' },
      body: {
        zh: '洛杉矶和斯图加特在讲座中段各出现一次，结论里又各出现一次。第 39、40 题的答案在结论处才完全清晰。听到第一个城市名时先不要涂卡，看题目顺序是否已经走到那里。',
        en: 'Los Angeles and Stuttgart each appear in the middle of the lecture and again in the conclusion, where items 39 and 40 are settled. Do not fill in the first city name you hear; check whether you have reached that item.',
      },
    },
  ],
};
