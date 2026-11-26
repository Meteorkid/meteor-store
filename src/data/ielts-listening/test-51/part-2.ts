import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 51 · Part 2 — 地方史学会徒步讲解（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲解顺序：集合点 → 建筑年代 → 老照片对照 → 名人故居 → 路线长度，
 * 随后把五处停留点（仓库、照片室、诗人故居、旧市场、海港步道）配对到对应介绍。
 */
export const test51Part2: ListeningLesson = {
  slug: 'test-51-part-2',
  part: 2,
  status: 'published',
  title: { zh: '地方史学会徒步讲解', en: 'A local history society walk' },
  summary: {
    zh: '讲解者介绍街区变迁：徒步从旧市政厅外出发，最老建筑建于一八四零年，照片室把街道与二十年代老照片对照，蓝色牌匾标记一位本地诗人故居，全程约三公里。仓库讲港口如何改变街区，照片室藏二十年代老照片，诗人故居是名人旧居，旧市场陈列原始街道平面图，海港步道有茶室花园。',
    en: 'The guide describes the changing dockside: the walk starts outside the old town hall, the oldest building dates from eighteen forty, the photo room compares the street with nineteen-twenties photos, a blue plaque marks a local poet’s home, and the route is about three kilometres. Stops cover the warehouse, photo room, poet’s house, old market and harbour path, each matched to its local history.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等偏慢。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'host', label: 'HOST', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Walk starts outside the old', cells: [[{ blank: 11 }]] },
        { lead: 'The oldest building dates from', cells: [[{ blank: 12 }]] },
        { lead: 'In the photo room, compare the', cells: [[{ blank: 13 }, { text: ' with old photographs' }]] },
        { lead: 'Blue plaque marks the home of a local', cells: [[{ blank: 14 }]] },
        { lead: 'The whole route is about', cells: [[{ blank: 15 }, { text: ' kilometres' }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which description applies to each stop on the walk? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'shows how the docks changed the neighbourhood' },
        { key: 'B', text: 'contains old photographs from the nineteen twenties' },
        { key: 'C', text: 'marks the former home of a famous poet' },
        { key: 'D', text: 'has a tea garden open to walkers' },
        { key: 'E', text: 'displays maps of the original street plan' },
        { key: 'F', text: 'lets visitors hear recordings of residents' },
      ],
      items: [
        { number: 16, text: 'the warehouse' },
        { number: 17, text: 'the photo room' },
        { number: 18, text: 'the poet’s house' },
        { number: 19, text: 'the old market' },
        { number: 20, text: 'the harbour path' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['town hall'], evidence: 1,
      explanation: {
        zh: '定位句 1：We meet outside the old town hall, which you can recognise by its stone tower。集合点在旧市政厅外，填 town hall。石塔是建筑特征，不是地点名称。',
        en: 'Sentence 1: "We meet outside the old town hall, which you can recognise by its stone tower". The meeting point is the old town hall, so write town hall. The stone tower is a feature, not the place name.',
      },
    },
    {
      number: 12, accepted: ['eighteen forty', '1840'], evidence: 3,
      explanation: {
        zh: '定位句 3：The oldest building on the walk dates from eighteen forty, long before the railway reached the town。最老建筑建于一八四零年，eighteen forty 与 1840 都得分。',
        en: 'Sentence 3: "The oldest building on the walk dates from eighteen forty, long before the railway reached the town". Eighteen forty and 1840 both fit.',
      },
    },
    {
      number: 13, accepted: ['street'], evidence: 5,
      explanation: {
        zh: '定位句 5：you compare the street with old photographs from the nineteen twenties。照片室把街道与老照片对照，填 street。照片年代是修饰信息，不填。',
        en: 'Sentence 5: "you compare the street with old photographs from the nineteen twenties". The street is compared with old photographs, so write street. The decade is a modifier, not the blank.',
      },
    },
    {
      number: 14, accepted: ['poet'], evidence: 7,
      explanation: {
        zh: '定位句 7：the blue plaque marks the former home of a local poet, who wrote about the harbour here。牌匾标记本地诗人故居，填 poet。句 23 提到的书房是房屋内部，不是人物身份。',
        en: 'Sentence 7: "the blue plaque marks the former home of a local poet, who wrote about the harbour here". The resident is a poet, so write poet. The study in sentence 23 is a room, not the person.',
      },
    },
    {
      number: 15, accepted: ['three', '3'], evidence: 9,
      explanation: {
        zh: '定位句 9：The whole route is about three kilometres, and it should take around two hours。全程约三公里，three 与 3 都得分。两小时是预计用时，不是路线长度。',
        en: 'Sentence 9: "The whole route is about three kilometres, and it should take around two hours". Three and 3 both fit; two hours is the estimated time, not the length.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：the old warehouse by the canal, which shows how the docks changed the neighbourhood over a century。仓库讲港口百年间如何改变街区，对应 A。',
        en: 'Sentence 12: "the old warehouse by the canal, which shows how the docks changed the neighbourhood over a century", matching A.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：the photo room on the corner, which contains old photographs from the nineteen twenties。照片室藏二十年代老照片，对应 B。',
        en: 'Sentence 13: "the photo room on the corner, which contains old photographs from the nineteen twenties", matching B.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 14,
      explanation: {
        zh: '定位句 14：the poet’s house with the blue plaque, which marks the former home of a famous poet。诗人故居对应 C。',
        en: 'Sentence 14: "the poet’s house with the blue plaque, which marks the former home of a famous poet", matching C.',
      },
    },
    {
      number: 19, accepted: ['E'], evidence: 15,
      explanation: {
        zh: '定位句 15：the old market hall, which displays maps of the original street plan。旧市场陈列原始街道平面图，对应 E。句 17 的居民录音是团体参观内容，不归市场公共讲解。',
        en: 'Sentence 15: "the old market hall, which displays maps of the original street plan", matching E. The resident recordings in sentence 17 are for group visits, not the public market stop.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 16,
      explanation: {
        zh: '定位句 16：the harbour path, which has a tea garden open to walkers after the tour。海港步道有茶室花园，对应 D。',
        en: 'Sentence 16: "the harbour path, which has a tea garden open to walkers after the tour", matching D.',
      },
    },
  ],
  transcript: [
    { speaker: 'host', text: 'Before the walk sets off, let me point out how this neighbourhood changed from a working dockside into the shops and houses you see today.' },
    { speaker: 'host', text: 'We meet outside the old town hall, which you can recognise by its stone tower.' },
    { speaker: 'host', text: 'The route is easy to follow, and we will stop at five points along the way.' },
    { speaker: 'host', text: 'The oldest building on the walk dates from eighteen forty, long before the railway reached the town.' },
    { speaker: 'host', text: 'It was a warehouse first, then a workshop for ship fittings.' },
    { speaker: 'host', text: 'Our first stop is the photo room, where you compare the street with old photographs from the nineteen twenties.' },
    { speaker: 'host', text: 'The photographs show the shops, the coster carts and the children playing outside the doors.' },
    { speaker: 'host', text: 'Further along, the blue plaque marks the former home of a local poet, who wrote about the harbour here.' },
    { speaker: 'host', text: 'His poems are quoted on the wall beside the gate, and the house is still a private home.' },
    { speaker: 'host', text: 'The whole route is about three kilometres, and it should take around two hours.' },
    { speaker: 'host', text: 'There are two short hills, but no stairs that would trouble a wheelchair.' },
    { speaker: 'host', text: 'Now let me describe the five stops in order.' },
    { speaker: 'host', text: 'First, the old warehouse by the canal, which shows how the docks changed the neighbourhood over a century.' },
    { speaker: 'host', text: 'Next, the photo room on the corner, which contains old photographs from the nineteen twenties.' },
    { speaker: 'host', text: 'Then the poet’s house with the blue plaque, which marks the former home of a famous poet.' },
    { speaker: 'host', text: 'After that, the old market hall, which displays maps of the original street plan.' },
    { speaker: 'host', text: 'Last, the harbour path, which has a tea garden open to walkers after the tour.' },
    { speaker: 'host', text: 'The recordings of residents in the market hall are only for group visits, not on this public walk.' },
    { speaker: 'host', text: 'The warehouse was built to store grain imported from the southern ports.' },
    { speaker: 'host', text: 'Its wooden beams are still visible on the ground floor.' },
    { speaker: 'host', text: 'The photo room runs a small exhibition of children’s games a hundred years ago.' },
    { speaker: 'host', text: 'Labels beside each picture name the shop that stood on that corner.' },
    { speaker: 'host', text: 'The poet moved here after leaving school, and lived here until he was thirty.' },
    { speaker: 'host', text: 'His study overlooks the garden, though visitors cannot enter the rooms.' },
    { speaker: 'host', text: 'The market hall traded fish and vegetables every Saturday morning.' },
    { speaker: 'host', text: 'Its arched doorway was rebuilt after a storm in eighteen ninety.' },
    { speaker: 'host', text: 'The harbour path follows the original ferry route across the bay.' },
    { speaker: 'host', text: 'Seats are placed every few hundred metres for anyone who needs a rest.' },
    { speaker: 'host', text: 'The society publishes a short guidebook that you can buy at the desk after the walk.' },
    { speaker: 'host', text: 'Members of the society lead the walks every weekend through the summer.' },
    { speaker: 'host', text: 'We carry a first-aid box, and the nearest doctor’s surgery is on High Street.' },
    { speaker: 'host', text: 'Dogs are welcome on the route, but they must stay on a lead near the buildings.' },
    { speaker: 'host', text: 'The old docks employed hundreds of workers in the eighteen eighties.' },
    { speaker: 'host', text: 'Shipping moved to a deeper port once the larger steamers could not enter the bay.' },
    { speaker: 'host', text: 'The street plan stayed the same, but most of the dock buildings were converted to homes.' },
    { speaker: 'host', text: 'The town hall tower holds a bell that rang to mark the end of the working day.' },
    { speaker: 'host', text: 'Guided walks leave from the steps at ten in the morning and two in the afternoon.' },
    { speaker: 'host', text: 'The society archive keeps newspapers, letters and photographs donated by local families.' },
    { speaker: 'host', text: 'New volunteers are welcome to help research the next series of walks.' },
    { speaker: 'host', text: 'The tea garden serves light cakes and tea, and it closes at five.' },
    { speaker: 'host', text: 'Maps are posted at each corner so walkers cannot stray from the route.' },
    { speaker: 'host', text: 'A weather shelter stands at the halfway point with a bench inside.' },
    { speaker: 'host', text: 'The poet’s plaque was unveiled by the society ten years ago.' },
    { speaker: 'host', text: 'The market clock still shows the hour, though its bell was removed long ago.' },
    { speaker: 'host', text: 'Please stay with the group, and raise your hand if you cannot hear the guide.' },
    { speaker: 'host', text: 'Thank you for joining the society this morning; we will begin the walk in a few minutes.' },
  ],
  vocabulary: [
    {
      term: 'route', phonetic: '/ruːt/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '路线，徒步线路', en: 'the path followed on a walk or journey' },
      usage: { zh: '可数；the whole route、follow the route。', en: 'Countable: the whole route, follow the route.' },
      collocations: ['the whole route', 'follow the route', 'the walk route'],
      example: { en: 'The route is about three kilometres long.', zh: '路线全程约三公里。' },
      listening: { zh: '单音节长元音 /uː/，与 root 同音。', en: 'One syllable with /uː/; a homophone of root.' },
    },
    {
      term: 'warehouse', phonetic: '/ˈweəhaʊs/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '仓库，货栈', en: 'a large building for storing goods' },
      usage: { zh: '可数；old warehouse、grain warehouse。复数 warehouses。', en: 'Countable: old warehouse, grain warehouse. Plural is warehouses.' },
      collocations: ['the old warehouse', 'a converted warehouse', 'the canal warehouse'],
      example: { en: 'The canal warehouse stored imported grain.', zh: '运河仓库曾存放进口谷物。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈweə/。', en: 'Two syllables stressing the first.' },
    },
    {
      term: 'plaque', phonetic: '/plæk/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '牌匾，纪念铭牌', en: 'a fixed metal or stone plate marking a famous place' },
      usage: { zh: '可数；blue plaque、unveil a plaque。', en: 'Countable: blue plaque, unveil a plaque.' },
      collocations: ['the blue plaque', 'a plaque marks', 'unveil the plaque'],
      example: { en: 'The blue plaque marks the poet’s former home.', zh: '蓝色牌匾标记诗人故居。' },
      listening: { zh: '单音节短元音 /æ/，开头 /pl/ 连读。', en: 'One short vowel /æ/; linked /pl/.' },
    },
    {
      term: 'poet', phonetic: '/ˈpəʊɪt/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '诗人', en: 'a person who writes poems' },
      usage: { zh: '可数；local poet、famous poet。名词 poetry 指诗歌。', en: 'Countable: local poet, famous poet. Poetry means poems as a form.' },
      collocations: ['a local poet', 'the poet’s house', 'the famous poet'],
      example: { en: 'The plaque marks the local poet’s home.', zh: '牌匾标记本地诗人故居。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpəʊ/。', en: 'Two syllables stressing the first.' },
    },
    {
      term: 'exhibition', phonetic: '/ˌeksɪˈbɪʃn/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '展览，陈列', en: 'a public display of pictures, objects or history' },
      usage: { zh: '可数；run an exhibition、small exhibition。动词 exhibit。', en: 'Countable: run an exhibition, small exhibition. The verb is exhibit.' },
      collocations: ['a small exhibition', 'the photo exhibition', 'run an exhibition'],
      example: { en: 'The photo room runs a children’s games exhibition.', zh: '照片室办有儿童游戏展览。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈbɪ/。', en: 'Four syllables stressing the third.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '档案（馆藏记录）', en: 'a collection of old records, letters and photographs' },
      usage: { zh: '可数；society archive、local archive。形容词 archival。', en: 'Countable: society archive, local archive. The adjective is archival.' },
      collocations: ['the society archive', 'the local archive', 'archive records'],
      example: { en: 'The archive keeps newspapers donated by families.', zh: '档案保存家庭捐赠的报纸。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɑː/，结尾 /kaɪv/。', en: 'Two syllables stressing the first; ending /kaɪv/.' },
    },
    {
      term: 'harbour', phonetic: '/ˈhɑːbə/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '海港，港湾', en: 'the sheltered port area where ships arrive' },
      usage: { zh: '可数；harbour path、the old harbour。美式 harbor。', en: 'Countable: harbour path, the old harbour. American spelling is harbor.' },
      collocations: ['the harbour path', 'the old harbour', 'the harbour side'],
      example: { en: 'The harbour path follows the old ferry route.', zh: '海港步道沿旧轮渡线路而行。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhɑː/。', en: 'Two syllables stressing the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'sets off', sentenceIndex: 0,
      meaning: { zh: '出发，启程', en: 'to begin a walk or journey' },
      usage: { zh: '短语动词；the walk sets off、set off at ten。', en: 'A phrasal verb: the walk sets off, set off at ten.' },
      example: { en: 'The walk sets off from the town hall.', zh: '徒步从市政厅出发。' },
    },
    {
      phrase: 'dates from', sentenceIndex: 3,
      meaning: { zh: '始建于，追溯到某年代', en: 'to have existed since a particular year' },
      usage: { zh: '短语动词；building dates from eighteen forty。', en: 'A phrasal verb: building dates from eighteen forty.' },
      example: { en: 'The warehouse dates from eighteen forty.', zh: '仓库建于一八四零年。' },
    },
    {
      phrase: 'compare the street with', sentenceIndex: 5,
      meaning: { zh: '把街道与……对照', en: 'to look at one thing beside another for contrast' },
      usage: { zh: '表示把 A 与 B 对照；compare the street with old photos。', en: 'compare A with B; compare the street with old photos.' },
      example: { en: 'Visitors compare the street with old photographs.', zh: '游客把街道与老照片对照。' },
    },
    {
      phrase: 'open to walkers', sentenceIndex: 16,
      meaning: { zh: '对徒步者开放', en: 'available for people on the walking tour' },
      usage: { zh: '表语短语；garden open to walkers、open to the public。', en: 'A predicative phrase: garden open to walkers, open to the public.' },
      example: { en: 'The tea garden is open to walkers after the tour.', zh: '茶室花园在徒步后对游客开放。' },
    },
    {
      phrase: 'moved to', sentenceIndex: 33,
      meaning: { zh: '迁至，移到（新地点）', en: 'to relocate to another place' },
      usage: { zh: 'move 后接地点；shipping moved to a deeper port。', en: 'Move plus place: shipping moved to a deeper port.' },
      example: { en: 'Shipping moved to a deeper port nearby.', zh: '航运迁至附近更深的港口。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白信号词标出停留点', en: 'Follow the monologue signposts' },
      body: {
        zh: 'Part 2 没有对话提问提示下一题。First、Next、Then、After that、Last 依次引出五处停留点，听到这些词就核对配对项是否走到对应地点。',
        en: 'Nobody asks a question to mark the next item, but First, Next, Then, After that and Last order the five stops. Use them to check which matching item you are on.',
      },
    },
    {
      title: { zh: '配对选项缩成关键词', en: 'Reduce options to keywords' },
      body: {
        zh: '六个选项记整句很困难。每项留一个关键词：docks、photographs、poet、tea garden、maps、recordings，听时拿关键词对停留点，而不是逐句翻译。',
        en: 'Do not memorise six full sentences. Keep one keyword per option: docks, photographs, poet, tea garden, maps, recordings, and match keywords to stops.',
      },
    },
    {
      title: { zh: '分清公共讲解与团体内容', en: 'Public tour versus group content' },
      body: {
        zh: '配对题问的是本次公共徒步的停留点。居民录音只对团体开放，属于干扰项；落笔前确认选项说的是这条路线上的公开介绍。',
        en: 'Matching covers the public walk. Resident recordings are group-only and a distractor. Confirm the option describes a public stop on this route before choosing.',
      },
    },
  ],
};
