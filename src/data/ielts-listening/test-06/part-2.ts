import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 6 · Part 2 — 社区艺术中心开幕致辞（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：场馆改造与费用 → 课程与驻场艺术家 → 会员制度 → 五位现场人员的分工（配对 16–20）
 * → 参观须知与后续活动。信号词 Now、Next、Then、Finally 标出段落切换。
 */
export const test06Part2: ListeningLesson = {
  slug: 'test-06-part-2',
  part: 2,
  status: 'published',
  title: { zh: '社区艺术中心开幕致辞', en: 'Opening speech at a community arts centre' },
  summary: {
    zh: '中心主席在开幕日介绍老仓库的改造过程、一层画廊与工作室的布局、首年课程与驻场艺术家安排、会员费用，以及五位现场人员各自的分工和志愿服务方式。',
    en: 'The chair of the centre describes how the old warehouse was renovated, the ground-floor gallery and studios, the first courses and resident artists, the membership fee, and the roles of five people visitors may meet today.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等偏慢。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'chair', label: 'CHAIR', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'The building was originally a furniture', cells: [[{ blank: 11 }]] },
        { lead: 'The ground floor contains a new public', cells: [[{ blank: 12 }]] },
        { lead: 'First courses begin in', cells: [[{ blank: 13 }]] },
        { lead: 'Resident artists stay for', cells: [[{ blank: 14 }, { text: ' months' }]] },
        { lead: 'Annual membership fee: ', cells: [[{ blank: 15 }, { text: ' dollars' }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which role does each person have? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'shares a studio with four other artists' },
        { key: 'B', text: 'runs a weekly class aimed at beginners' },
        { key: 'C', text: 'answers questions about joining and the timetable' },
        { key: 'D', text: 'keeps the outdoor plants and seating in good order' },
        { key: 'E', text: 'repairs the old wooden furniture in the studios' },
        { key: 'F', text: 'organises the monthly exhibition in the gallery' },
      ],
      items: [
        { number: 16, text: 'Elin Rowan' },
        { number: 17, text: 'Marcus Bell' },
        { number: 18, text: 'Mara' },
        { number: 19, text: 'the volunteer gardeners' },
        { number: 20, text: 'Theo' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['warehouse'], evidence: 3,
      explanation: {
        zh: '定位句 3：This hall was originally a furniture warehouse。 originally 对应题目里的 originally；后面的 old firm 是停业的公司，不是建筑类型，不能填。',
        en: 'Sentence 3: "This hall was originally a furniture warehouse". Originally matches the question. The old firm in the same sentence is the former company, not the building type.',
      },
    },
    {
      number: 12, accepted: ['gallery'], evidence: 6,
      explanation: {
        zh: '定位句 6：On the ground floor you will find a new public gallery。题目已给 ground floor 和 public，听到 public 后面的名词即为答案。工作室在一层（句 7），不要填 studio。',
        en: 'Sentence 6: "On the ground floor you will find a new public gallery". Ground floor and public are already printed, so take the noun after public. The studios are on the first floor in sentence 7.',
      },
    },
    {
      number: 13, accepted: ['September'], evidence: 8,
      explanation: {
        zh: '定位句 8：our first courses begin in September。月份首字母必须大写；句 8 的 next Monday 是报名开放日，不是开课月份，属于干扰项。',
        en: 'Sentence 8: "our first courses begin in September". Capitalise the month. Next Monday in the same sentence is the booking date, not the start month.',
      },
    },
    {
      number: 14, accepted: ['six', '6'], evidence: 10,
      explanation: {
        zh: '定位句 10：they stay here for six months at a time。空格后已印 months，只填数字；six 与 6 都得分。句 11 的 one workshop 是回报义务，不是停留时长。',
        en: 'Sentence 10: "they stay here for six months at a time". Months is printed, so write the number only; six and 6 both fit. The one workshop in sentence 11 is their obligation, not the length of stay.',
      },
    },
    {
      number: 15, accepted: ['twenty', '20'], evidence: 13,
      explanation: {
        zh: '定位句 13：The annual membership fee is twenty dollars。题目已给 dollars，填数字即可；句 14 的 half price 是学生优惠，句 14 的 free 是未成年会员，都不是标准年费。',
        en: 'Sentence 13: "The annual membership fee is twenty dollars". Dollars is printed, so write the number. Half price in sentence 14 is the student concession, and free applies to young members, not the standard fee.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Her workshop is aimed at beginners。句 16 说明 Elin 带周三晚的陶艺课，aimed at beginners 对应 B 的 weekly class aimed at beginners。她今天的公开演示是另一项活动，不是课程本身。',
        en: 'Sentence 17: "Her workshop is aimed at beginners". Sentence 16 adds that Elin leads the Wednesday pottery course, matching B. Her public demonstration today is a separate event.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：he shares a studio on the first floor with four other artists。A 几乎逐词对应；句 19 的 linocuts 是他展出的作品，不是分工。',
        en: 'Sentence 18: "he shares a studio on the first floor with four other artists", which matches A almost word for word. The linocuts in sentence 19 are his work on show, not his role.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 21,
      explanation: {
        zh: '定位句 21：She answers questions about joining, concessions and the course timetable。answers questions about joining 与 C 同义；Mara 在前台会员台，不负责策划展览。',
        en: 'Sentence 21: "She answers questions about joining, concessions and the course timetable", which matches C. Mara works at the membership desk; she does not organise exhibitions.',
      },
    },
    {
      number: 19, accepted: ['D'], evidence: 23,
      explanation: {
        zh: '定位句 23：They maintain the outdoor plants and the seating area。maintain 对应 keeps in good order，户外植物与座椅对应 D。句 22 的 courtyard 是地点，不是职责。',
        en: 'Sentence 23: "They maintain the outdoor plants and the seating area". Maintain paraphrases keep in good order, matching D. The courtyard in sentence 22 is the location, not the duty.',
      },
    },
    {
      number: 20, accepted: ['E'], evidence: 24,
      explanation: {
        zh: '定位句 24：Finally, Theo looks after the old wooden furniture in the studios, and he repairs anything that has broken during the year。repairing old wooden furniture 对应 E。F 的策划月度展览在介绍中没有归给任何人，是干扰项。',
        en: 'Sentence 24: Theo "looks after the old wooden furniture" and "repairs anything that has broken", matching E. F, organising the monthly exhibition, is assigned to no one and is a distractor.',
      },
    },
  ],
  transcript: [
    { speaker: 'chair', text: 'I have about ten minutes before the tour begins, so let me explain how this centre came to be here.' },
    { speaker: 'chair', text: 'My name is Bronwyn, and I’m the chair of the volunteer group that has brought this project about.' },
    { speaker: 'chair', text: 'Before I hand over to the artists, I’d like to tell you a little about the building and what we offer.' },
    { speaker: 'chair', text: 'This hall was originally a furniture warehouse, and for many years it stood empty after the old firm closed.' },
    { speaker: 'chair', text: 'A grant from the city council paid for most of the renovation, and work began last spring.' },
    { speaker: 'chair', text: 'The total cost came to two hundred thousand dollars, with local businesses contributing about a quarter of that.' },
    { speaker: 'chair', text: 'On the ground floor you will find a new public gallery, where we hang the work of local painters each month.' },
    { speaker: 'chair', text: 'The first floor holds four shared studios, and the large room at the back is the pottery workshop.' },
    { speaker: 'chair', text: 'We are proud to announce that our first courses begin in September, and booking opens online next Monday.' },
    { speaker: 'chair', text: 'There are classes in watercolour, printmaking and hand-building with clay, for complete beginners and for those with some experience.' },
    { speaker: 'chair', text: 'Alongside the courses, we host three resident artists each year, and they stay here for six months at a time.' },
    { speaker: 'chair', text: 'They have a free studio space, and in return they give one open workshop to the public during their stay.' },
    { speaker: 'chair', text: 'Membership is not required to visit the gallery, but many of you will want to join to take part in the courses.' },
    { speaker: 'chair', text: 'The annual membership fee is twenty dollars, and it covers full access to the studio common room and the monthly newsletter.' },
    { speaker: 'chair', text: 'Concessions are half price for students, and under eighteens come free with an adult member.' },
    { speaker: 'chair', text: 'Now, let me introduce the five people you may meet around the centre this afternoon.' },
    { speaker: 'chair', text: 'First, Elin Rowan is the ceramicist who will lead the pottery course on Wednesday evenings.' },
    { speaker: 'chair', text: 'Her workshop is aimed at beginners, and she will also give a public demonstration at two o’clock today.' },
    { speaker: 'chair', text: 'Next, Marcus Bell works in printmaking, and he shares a studio on the first floor with four other artists.' },
    { speaker: 'chair', text: 'He will be showing his latest linocuts in the gallery during October.' },
    { speaker: 'chair', text: 'Then there is Mara, who runs the membership desk at the front.' },
    { speaker: 'chair', text: 'She answers questions about joining, concessions and the course timetable, so please take any queries to her.' },
    { speaker: 'chair', text: 'Outside in the courtyard, you will meet a small team of volunteer gardeners.' },
    { speaker: 'chair', text: 'They maintain the outdoor plants and the seating area, and they welcome anyone who can spare an hour each week.' },
    { speaker: 'chair', text: 'Finally, Theo looks after the old wooden furniture in the studios, and he repairs anything that has broken during the year.' },
    { speaker: 'chair', text: 'We still need more volunteers, especially for the Saturday morning shift and for the gallery reception desk.' },
    { speaker: 'chair', text: 'Volunteering counts toward the community hours some of you need for school or college applications.' },
    { speaker: 'chair', text: 'Before we begin the tour, a few practical notes.' },
    { speaker: 'chair', text: 'The gallery remains open until eight this evening, and there are light refreshments in the courtyard.' },
    { speaker: 'chair', text: 'Please do not touch the exhibits, and keep young children close by while you are in the studios.' },
    { speaker: 'chair', text: 'A wheelchair ramp leads up to the main entrance, and an accessible toilet is on the ground floor.' },
    { speaker: 'chair', text: 'We have tried to keep the centre open to everyone, and that has been the aim throughout the redesign.' },
    { speaker: 'chair', text: 'If you would like to leave a comment, there is a book on the membership desk.' },
    { speaker: 'chair', text: 'We will read every suggestion, whether it concerns a course, a studio or the opening hours.' },
    { speaker: 'chair', text: 'The café at the back opens at three, and it serves homemade soup and cakes through the afternoon.' },
    { speaker: 'chair', text: 'Next month we will hold an evening fair, where local makers can sell their own work to visitors.' },
    { speaker: 'chair', text: 'Anyone who wants a stall at the fair can apply through the website before the end of this month.' },
    { speaker: 'chair', text: 'The centre also runs a young makers club on Sunday mornings, for children aged eight to twelve.' },
    { speaker: 'chair', text: 'Those sessions are free for members, and a small charge applies to guests from outside the family.' },
    { speaker: 'chair', text: 'We hope to add a textile room next year, if we can raise the money for the equipment.' },
    { speaker: 'chair', text: 'The wall outside the main entrance will display a new mural, painted by last year’s resident artists.' },
    { speaker: 'chair', text: 'If you look up as you enter, you can already see the wooden beams that were left exposed during the work.' },
    { speaker: 'chair', text: 'These beams were preserved rather than replaced, because the council wanted the building to keep its character.' },
    { speaker: 'chair', text: 'The original loading doors at the back are now the entrance to the pottery workshop.' },
    { speaker: 'chair', text: 'We kept the old brickwork where it was still sound, and painted the new walls a warm pale grey.' },
    { speaker: 'chair', text: 'Before we go upstairs, please note that the studios are working spaces, so photographs of other artists must be avoided.' },
    { speaker: 'chair', text: 'The gallery itself is open for photography, as long as you do not use a flash.' },
    { speaker: 'chair', text: 'On behalf of the whole committee, thank you for coming, and enjoy this afternoon with us.' },
  ],
  vocabulary: [
    {
      term: 'warehouse', phonetic: '/ˈweəhaʊs/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '仓库，货仓', en: 'a large building for storing goods' },
      usage: { zh: '可数名词；注意动词重音在第二音节，名词在第一音节。', en: 'Countable. The noun stresses the first syllable; the verb stresses the second.' },
      collocations: ['a furniture warehouse', 'an old warehouse', 'warehouse space'],
      example: { en: 'The old warehouse has been converted into artists’ studios.', zh: '旧仓库被改造成了艺术家工作室。' },
      listening: { zh: 'house 在这里读 /haʊs/，不是 /haʊz/。', en: 'House here is /haʊs/, not /haʊz/.' },
    },
    {
      term: 'renovation', phonetic: '/ˌrenəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '翻新，整修工程', en: 'the work of repairing and improving a building' },
      usage: { zh: '可数或不可数；动词 renovate，名词 renovator。', en: 'Countable or uncountable; the verb is renovate.' },
      collocations: ['the renovation of', 'complete renovation', 'under renovation'],
      example: { en: 'The library is closed for renovation during the summer.', zh: '图书馆夏季因翻新闭馆。' },
      listening: { zh: '四个音节，重音在第三个 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'gallery', phonetic: '/ˈɡæləri/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '画廊，展览厅', en: 'a room or building for showing works of art' },
      usage: { zh: '可数名词；也可指剧院顶层楼座。', en: 'Countable; it also means the upper seating of a theatre.' },
      collocations: ['a public gallery', 'a private gallery', 'the gallery'],
      example: { en: 'Her paintings hang in the city gallery.', zh: '她的画作陈列在市画廊里。' },
      listening: { zh: '三个音节，重音在第一音节，中间 /lə/ 弱读。', en: 'Three syllables, stress on the first, with a weak /lə/ in the middle.' },
    },
    {
      term: 'resident', phonetic: '/ˈrezɪdənt/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '驻留的，常驻的', en: 'living or working in a place for a fixed period' },
      usage: { zh: 'resident artist、resident tutor；作名词指居民。', en: 'resident artist, resident tutor; as a noun it means a local inhabitant.' },
      collocations: ['a resident artist', 'resident tutor', 'the resident population'],
      example: { en: 'The centre hosts two resident painters each year.', zh: '中心每年接待两名驻留画家。' },
      listening: { zh: '重音在第一音节 /ˈrez/，不要读成 /rɪˈzaɪd/。', en: 'Stress the first syllable; do not say /rɪˈzaɪd/.' },
    },
    {
      term: 'concessions', phonetic: '/kənˈseʃnz/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '优惠价，减免（学生、老人等）', en: 'a reduced price for students, older people or other groups' },
      usage: { zh: 'concession 或 concessionary rate；英式公共场合常见。', en: 'Concession or concessionary rate; common in British public services.' },
      collocations: ['half-price concession', 'a student concession', 'concession tickets'],
      example: { en: 'Concession tickets are available for older visitors.', zh: '老年游客可购买优惠票。' },
      listening: { zh: '重音在第二音节 /ˈseʃ/，结尾是 /n/。', en: 'Stress the second syllable; the word ends in /n/.' },
    },
    {
      term: 'ceramicist', phonetic: '/səˈræmɪsɪst/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '陶瓷艺术家', en: 'an artist who makes pottery and ceramics' },
      usage: { zh: '由 ceramics 派生；同类词有 printmaker、painter、sculptor。', en: 'Derived from ceramics; compare printmaker, painter and sculptor.' },
      collocations: ['a local ceramicist', 'the ceramicist leads'],
      example: { en: 'The ceramicist gives classes in hand-building.', zh: '这位陶瓷艺术家教授手工塑形课。' },
      listening: { zh: '重音在第二音节 /ˈræ/，开头 /sə/ 很轻。', en: 'Stress the second syllable; the opening /sə/ is weak.' },
    },
    {
      term: 'maintain', phonetic: '/meɪnˈteɪn/', partOfSpeech: 'v.', sentenceIndex: 23,
      meaning: { zh: '维护，保养；维持', en: 'to keep something in good condition' },
      usage: { zh: 'maintain a garden、maintain equipment；名词 maintenance。', en: 'maintain a garden, maintain equipment; the noun is maintenance.' },
      collocations: ['maintain the plants', 'maintain the seating', 'maintain the garden'],
      example: { en: 'Volunteers maintain the plants along the path.', zh: '志愿者维护步道边的植物。' },
      listening: { zh: '重音在第二音节 /ˈteɪn/，与 main 单独读时不同。', en: 'Stress the second syllable; it differs from the word main.' },
    },
    {
      term: 'exhibits', phonetic: '/ɪɡˈzɪbɪts/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '展品，陈列品', en: 'an object shown in a gallery or museum' },
      usage: { zh: '名词重音在第二音节；动词 exhibit 同形，重音也在第二音节。', en: 'The noun stresses the second syllable; the verb exhibit has the same stress.' },
      collocations: ['touch the exhibits', 'a new exhibit', 'the exhibits on show'],
      example: { en: 'Please do not touch the exhibits in the gallery.', zh: '请勿触摸画廊展品。' },
      listening: { zh: '与 exhibition（展览）区分：exhibit 是单件展品，exhibition 是整场展览。', en: 'An exhibit is one object; an exhibition is the whole show.' },
    },
  ],
  expressions: [
    {
      phrase: 'brought this project about', sentenceIndex: 1,
      meaning: { zh: '促成这个项目', en: 'to make something happen' },
      usage: { zh: 'bring about 是可分短语动词；宾语放中间：bring it about。', en: 'bring about is separable: put the object in the middle, bring it about.' },
      example: { en: 'The volunteers brought the new community garden about.', zh: '志愿者们促成了这座新社区花园。' },
    },
    {
      phrase: 'in return', sentenceIndex: 11,
      meaning: { zh: '作为回报，交换条件', en: 'in exchange for something given' },
      usage: { zh: '通常放在句末；in return for something 引出换取的内容。', en: 'Usually at the end; in return for something names the exchange.' },
      example: { en: 'She gives her time, and in return she uses the studio free.', zh: '她付出时间，换取免费使用工作室。' },
    },
    {
      phrase: 'take part in', sentenceIndex: 12,
      meaning: { zh: '参加，参与', en: 'to join in an activity' },
      usage: { zh: '后接活动名词；与 join 不同，take part in 强调参与其中。', en: 'Follow with an activity; it stresses active participation, unlike join.' },
      example: { en: 'Children can take part in the weekend workshops.', zh: '孩子们可以参加周末工作坊。' },
    },
    {
      phrase: 'aimed at beginners', sentenceIndex: 17,
      meaning: { zh: '面向初学者设计的', en: 'designed for people with little experience' },
      usage: { zh: 'be aimed at somebody；主动形式 aim at somebody。', en: 'be aimed at somebody; the active form is aim at somebody.' },
      example: { en: 'The course is aimed at complete beginners.', zh: '这门课面向完全零基础的学员。' },
    },
    {
      phrase: 'spare an hour', sentenceIndex: 23,
      meaning: { zh: '抽出一小时时间', en: 'to give up an hour of free time' },
      usage: { zh: 'spare 表示“腾出时间”；spare some time to do something。', en: 'Spare means to set aside time: spare some time to do something.' },
      example: { en: 'Can you spare an hour to help in the garden?', zh: '你能抽出一小时帮忙打理花园吗？' },
    },
    {
      phrase: 'on behalf of', sentenceIndex: 47,
      meaning: { zh: '代表（某人或某团体）', en: 'speaking for another person or group' },
      usage: { zh: '致辞结尾常用；后接团体名词，注意 of 不能省。', en: 'Common at the end of speeches; the of cannot be dropped.' },
      example: { en: 'On behalf of the team, thank you for your support.', zh: '我代表团队感谢各位的支持。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白信号词标出段落', en: 'Follow the monologue signposts' },
      body: {
        zh: 'Part 2 没有对话提问来提示下一题。Now、Next、Then、Finally 分别引出人物介绍的次序，听到这些词就检查自己是否已经填到对应的配对项。',
        en: 'Nobody asks a question to mark the next item, but Now, Next, Then and Finally order the introductions. Use them to check which matching item you are on.',
      },
    },
    {
      title: { zh: '配对选项先缩成关键词', en: 'Reduce options to keywords' },
      body: {
        zh: '六个选项记整句很困难。每项只留一个关键词：studio、beginners、joining、garden、furniture、exhibition，听时拿关键词对人，而不是逐句翻译。',
        en: 'Do not memorise six full sentences. Keep one keyword per option: studio, beginners, joining, garden, furniture, exhibition, and match keywords to people.',
      },
    },
    {
      title: { zh: '分清“职责”和“作品”', en: 'Role versus work' },
      body: {
        zh: '配对题问的是分工，不是艺术家展出什么。linocuts、demonstration、linocuts 这类作品或活动信息常被做成干扰项；落笔前确认选项说的是职责。',
        en: 'Matching asks about roles, not what art someone shows. Words like linocuts and demonstration describe works or events and often serve as distractors. Confirm the option names a duty before choosing.',
      },
    },
  ],
};
