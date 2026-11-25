import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 1 · Part 2 — 旧港区徒步导览（独白，澳音）。原创仿真材料，非官方真题。
 *
 * 独白没有提问来提示“下一题到了”，所以原文里故意布了信号词
 * （Now, a little history / After that / And finally），解析里逐题指出来。
 */
export const test01Part2: ListeningLesson = {
  slug: 'test-01-part-2',
  part: 2,
  status: 'published',
  title: { zh: '旧港区徒步导览', en: 'A guided walk around the old harbour quarter' },
  summary: {
    zh: '导览员在出发前介绍两小时徒步路线的实用安排、港口的历史，以及沿途七处建筑的现状与用途。',
    en: 'A guide briefs her group before a two-hour walking tour: the practical arrangements, the history of the harbour, and what has become of seven buildings along the way.',
  },
  accent: { zh: '导览员为澳式口音，语速中等。', en: 'The guide speaks with an Australian accent at a moderate pace.' },
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Length of walk', cells: [[{ blank: 11 }, { text: ' hours' }]] },
        { lead: 'The walk finishes at the', cells: [[{ blank: 12 }, { text: ' market' }]] },
        { lead: 'If separated, look for the blue', cells: [[{ blank: 13 }]] },
        { lead: 'Bring a', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What does the guide say about the Custom House?',
          options: [
            { key: 'A', text: 'It is closed on weekdays.' },
            { key: 'B', text: 'It deserves a longer visit.' },
            { key: 'C', text: 'It is still used for storing coal.' },
          ],
        },
        {
          number: 16,
          stem: 'Why is there a short break at the sail loft?',
          options: [
            { key: 'A', text: 'to watch the shipwrights at work' },
            { key: 'B', text: 'to repair the sails' },
            { key: 'C', text: 'because refreshments are available there' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What does the guide say about each place? Choose the correct letter, A–G.',
      options: [
        { key: 'A', text: 'It is still used for its original purpose.' },
        { key: 'B', text: 'It has been turned into shops.' },
        { key: 'C', text: 'It is not open to the public.' },
        { key: 'D', text: 'It has recently been made accessible for wheelchairs.' },
        { key: 'E', text: 'It used to sell ropes and paint.' },
        { key: 'F', text: 'It is now a private home.' },
        { key: 'G', text: 'It has a small exhibition about fishing.' },
      ],
      items: [
        { number: 17, text: 'the sail loft' },
        { number: 18, text: 'the lighthouse keeper’s cottage' },
        { number: 19, text: 'the boatyard' },
        { number: 20, text: 'the fish market' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['two', '2'], evidence: 2,
      explanation: {
        zh: '定位句 2：The walk takes about two hours in total。空格后已印 hours，只填数字。同句的 three kilometres 是路程，别混淆。',
        en: 'Sentence 2: "The walk takes about two hours in total". Hours is already printed, so write the number only. Three kilometres is the distance, a distractor.',
      },
    },
    {
      number: 12, accepted: ['fish'], evidence: 4,
      explanation: {
        zh: '定位句 4：We finish at the fish market。后面的句子会陆续出现 harbour office、pilot station 等地点，都不是终点。',
        en: 'Sentence 4: "We finish at the fish market". The harbour office and the pilot station come up later, but neither is the finishing point.',
      },
    },
    {
      number: 13, accepted: ['flag'], evidence: 5,
      explanation: {
        zh: '定位句 5：look for the blue flag by the main entrance。空格前的 blue 已经限定了名词，听到 blue 后面紧跟的词就是答案。',
        en: 'Sentence 5: "look for the blue flag by the main entrance". Blue already narrows the noun; take the word that follows it.',
      },
    },
    {
      number: 14, accepted: ['waterproof'], evidence: 8,
      explanation: {
        zh: '定位句 8：the harbour is exposed, so do keep a waterproof handy。同义线索：exposed（无遮蔽）加下一句的 a shower，说明要带防雨的东西。',
        en: 'Sentence 8: "the harbour is exposed, so do keep a waterproof handy". Exposed and the shower in the next sentence both point to rain gear.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：I’d recommend coming back another day, because two hours simply isn’t enough to do it justice。do it justice = 值得好好看，对应 deserves a longer visit。',
        en: 'Sentence 17: "two hours simply isn’t enough to do it justice". Do it justice means it deserves a proper visit, which matches B.',
      },
    },
    {
      number: 16, accepted: ['C'], evidence: 19,
      explanation: {
        zh: '定位句 19：the only building on the route where you can buy a coffee，下一句以 So 开头给出结论：a good place for a short break。因果关系的结论在 so 之后；修帆是它的历史用途，造船匠在后面的船厂。',
        en: 'Sentence 19 calls it "the only building on the route where you can buy a coffee"; the next sentence starts with So and gives the conclusion, "a good place for a short break". Sail repair is the past use; the shipwrights are at the boatyard.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The sail loft has been converted into a row of small shops。converted into shops 对应 has been turned into shops，是典型的同义替换。',
        en: 'Sentence 19: "The sail loft has been converted into a row of small shops". Converted into shops paraphrases has been turned into shops.',
      },
    },
    {
      number: 18, accepted: ['F'], evidence: 23,
      explanation: {
        zh: '定位句 23：The lighthouse keeper’s cottage next door is now a holiday rental … people do live there。holiday rental 加 people do live there 说明现在有人住，对应 private home。',
        en: 'Sentence 23: the cottage "is now a holiday rental" and "people do live there", which matches a private home.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：we pass the boatyard, which is still working。still working 说明造船厂还在做原来的事。C 是下一处引航站的属性，E 是船具店过去的业务。',
        en: 'Sentence 24: "we pass the boatyard, which is still working". It still does what it was built for. C belongs to the pilot station and E to the chandlery.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 34,
      explanation: {
        zh: '定位句 34：It’s been refurbished recently, and it’s fully accessible for wheelchairs。recently 加 accessible for wheelchairs 与 D 完全对应。',
        en: 'Sentence 34: "It’s been refurbished recently, and it’s fully accessible for wheelchairs", which matches D word for word.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Good morning, everyone, and welcome to the old harbour quarter. I’m Rosa, and I’ll be leading today’s walk.' },
    { speaker: 'guide', text: 'Before we set off, I’d like to go over a few practical details, and then tell you a little about what you’ll be seeing.' },
    { speaker: 'guide', text: 'The walk takes about two hours in total, and we cover roughly three kilometres, so it’s manageable for most fitness levels.' },
    { speaker: 'guide', text: 'There’s one fairly steep hill near the old lighthouse, but we’ll take that slowly, and there’s a bench at the top if you need a rest.' },
    { speaker: 'guide', text: 'We finish at the fish market, where you’ll have time to look around on your own.' },
    { speaker: 'guide', text: 'If you get separated from the group, please make your way to the market and look for the blue flag by the main entrance.' },
    { speaker: 'guide', text: 'That’s where I’ll be from four o’clock.' },
    { speaker: 'guide', text: 'There are public toilets at the harbour office, but they close at half past three, so I wouldn’t leave it too late.' },
    { speaker: 'guide', text: 'The weather looks kind to us today, but the harbour is exposed, so do keep a waterproof handy.' },
    { speaker: 'guide', text: 'The forecast mentions a shower later this afternoon.' },
    { speaker: 'guide', text: 'Now, a little history.' },
    { speaker: 'guide', text: 'The harbour was built in the eighteenth century, when coal and limestone were shipped out from the mines inland.' },
    { speaker: 'guide', text: 'For nearly a hundred years it was one of the busiest ports on this coast, and at its peak more than two hundred ships a year called here.' },
    { speaker: 'guide', text: 'The trade declined after the railway arrived, and by the nineteen twenties the harbour had fallen silent.' },
    { speaker: 'guide', text: 'You can still see the old railway tracks in the cobbles if you look carefully.' },
    { speaker: 'guide', text: 'Most of the buildings you’ll see were warehouses, and a surprising number have survived almost unchanged.' },
    { speaker: 'guide', text: 'We start outside the Custom House, which is the tall grey building on your right.' },
    { speaker: 'guide', text: 'It’s now a museum, and I’d recommend coming back another day, because two hours simply isn’t enough to do it justice.' },
    { speaker: 'guide', text: 'From there we walk along the quay to the sail loft, which was where the sails were repaired.' },
    { speaker: 'guide', text: 'The sail loft has been converted into a row of small shops, and it’s the only building on the route where you can buy a coffee.' },
    { speaker: 'guide', text: 'So it’s a good place for a short break.' },
    { speaker: 'guide', text: 'After the sail loft we climb the hill to the old lighthouse.' },
    { speaker: 'guide', text: 'It’s no longer in use, but the view from the top is spectacular, and on a clear day you can see the islands.' },
    { speaker: 'guide', text: 'The lighthouse keeper’s cottage next door is now a holiday rental, so please don’t go up to the door — people do live there.' },
    { speaker: 'guide', text: 'Coming back down, we pass the boatyard, which is still working.' },
    { speaker: 'guide', text: 'You may see a shipwright at work, but for safety reasons we watch from the gate.' },
    { speaker: 'guide', text: 'The next stop is the harbour office, where you’ll find the toilets I mentioned, and also a small exhibition about the fishing industry.' },
    { speaker: 'guide', text: 'After that we come to the chandlery.' },
    { speaker: 'guide', text: 'It used to sell ropes, paint and everything else a ship needed.' },
    { speaker: 'guide', text: 'Today it’s a gallery for local artists, and it’s free to go in.' },
    { speaker: 'guide', text: 'The last two places on the route are the pilot station and the fish market.' },
    { speaker: 'guide', text: 'The pilot station is a tiny white building where the pilots waited for ships to guide into harbour.' },
    { speaker: 'guide', text: 'It’s closed to the public, I’m afraid, but you can peek through the windows and see the old weather log on the wall.' },
    { speaker: 'guide', text: 'And finally the fish market, which is where we finish.' },
    { speaker: 'guide', text: 'It’s been refurbished recently, and it’s fully accessible for wheelchairs.' },
    { speaker: 'guide', text: 'A few ground rules before we start.' },
    { speaker: 'guide', text: 'Please keep to the pavements — the quay is still used by working vehicles, and it can be dangerous.' },
    { speaker: 'guide', text: 'Photography is welcome everywhere except inside the sail loft, where the shopkeepers have asked us not to take pictures.' },
    { speaker: 'guide', text: 'And please don’t feed the seagulls.' },
    { speaker: 'guide', text: 'They’re bold enough already, and one stole a sandwich from a walker last week.' },
    { speaker: 'guide', text: 'If you have questions, ask me at each stop rather than while we’re walking, because the traffic can make it hard to hear.' },
    { speaker: 'guide', text: 'There’s a café at the market for anyone who wants to stay on for lunch.' },
    { speaker: 'guide', text: 'They do a very good fish soup, I’m told.' },
    { speaker: 'guide', text: 'Right, is everyone ready?' },
    { speaker: 'guide', text: 'We’ll start here at the Custom House, and we should reach the market by about four o’clock.' },
  ],
  vocabulary: [
    {
      term: 'exposed', phonetic: '/ɪkˈspəʊzd/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '无遮蔽的，暴露在风雨中的', en: 'not sheltered from the weather' },
      usage: { zh: 'be exposed to wind or rain；引申义是“暴露于风险”，Part 4 讲健康与环境时常见。', en: 'be exposed to wind or rain; figuratively, exposed to risk.' },
      collocations: ['exposed to the wind', 'exposed to risk', 'an exposed position'],
      example: { en: 'The campsite is exposed, so bring a strong tent.', zh: '营地无遮无拦，带一顶结实的帐篷。' },
      listening: { zh: '重音在第二音节，结尾是 /zd/ 两个辅音连在一起，不要漏听。', en: 'Stress the second syllable and listen for the final /zd/ cluster.' },
    },
    {
      term: 'waterproof', phonetic: '/ˈwɔːtəpruːf/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '防水外套；防水材料', en: 'a coat or material that does not let water through' },
      usage: { zh: '常作形容词（a waterproof jacket），口语里直接当名词指雨衣。', en: 'Usually an adjective (a waterproof jacket); in speech it can be a noun meaning raincoat.' },
      collocations: ['a waterproof jacket', 'waterproof boots', 'keep a waterproof handy'],
      example: { en: 'Take a waterproof — the weather can change quickly on the hills.', zh: '带件雨衣，山上天气说变就变。' },
      listening: { zh: '复合词，前半是 water，后半 proof 读 /pruːf/。', en: 'A compound: water plus proof, /ˈwɔːtəpruːf/.' },
    },
    {
      term: 'limestone', phonetic: '/ˈlaɪmstəʊn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '石灰石', en: 'a pale rock used for building and making cement' },
      usage: { zh: '不可数名词；地理、地质类讲座的高频词。', en: 'Uncountable; frequent in geography and geology talks.' },
      collocations: ['limestone cliffs', 'a limestone quarry'],
      example: { en: 'The cliffs are made of limestone, which is easily worn away by rain.', zh: '这些悬崖由石灰石构成，容易被雨水侵蚀。' },
      listening: { zh: 'lime 读 /laɪm/，不要拆成两个词听成 lime stone。', en: 'Lime is /laɪm/; the two halves are spoken as one word.' },
    },
    {
      term: 'peak', phonetic: '/piːk/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '顶峰，最高点', en: 'the highest or busiest point' },
      usage: { zh: 'at its peak 表示“在最鼎盛的时期”；也可指山峰。', en: 'At its peak means at its most active point; it also means a mountain top.' },
      collocations: ['at its peak', 'peak season', 'reach a peak'],
      example: { en: 'Traffic is heaviest at peak hours.', zh: '高峰时段交通最拥堵。' },
      listening: { zh: '与 peak 同音的词很多，听的时候靠前面的 at its 判断。', en: 'Expect it after at its.' },
    },
    {
      term: 'quay', phonetic: '/kiː/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '码头', en: 'a stone platform beside the water where ships are loaded' },
      usage: { zh: '可数名词；英式拼写 quay，美式有时写 quay 或 wharf。', en: 'Countable; a wharf is a close synonym.' },
      collocations: ['along the quay', 'a busy quay'],
      example: { en: 'Fishing boats were tied up along the quay.', zh: '渔船沿着码头停靠。' },
      listening: { zh: '拼写是 q-u-a-y，读音却是 /kiː/，和 key 同音。', en: 'Spelled quay but pronounced /kiː/, like key.' },
    },
    {
      term: 'converted', phonetic: '/kənˈvɜːtɪd/', partOfSpeech: 'v.', sentenceIndex: 19,
      meaning: { zh: '被改建，被改用途', en: 'changed into a different use or form' },
      usage: { zh: 'be converted into something；讲老建筑新用途时的常用说法。', en: 'be converted into something; the usual phrase for old buildings put to new use.' },
      collocations: ['converted into flats', 'converted from a warehouse'],
      example: { en: 'The church has been converted into apartments.', zh: '教堂被改造成了公寓。' },
      listening: { zh: '重音在第二音节 /ˈvɜː/。', en: 'Stress the second syllable.' },
    },
    {
      term: 'spectacular', phonetic: '/spekˈtækjələ/', partOfSpeech: 'adj.', sentenceIndex: 22,
      meaning: { zh: '壮观的，令人惊叹的', en: 'very impressive to look at' },
      usage: { zh: '形容景色、表演、成功等；the view is spectacular 是旅游场景的常见搭配。', en: 'Describes views, performances and successes; the view is spectacular is common in travel contexts.' },
      collocations: ['a spectacular view', 'spectacular scenery'],
      example: { en: 'We watched a spectacular sunset from the bridge.', zh: '我们在桥上看到了壮观的日落。' },
      listening: { zh: '四个音节，重音在第二个 /ˈtæk/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'shipwright', phonetic: '/ˈʃɪpraɪt/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '造船匠，修船工人', en: 'a person who builds and repairs boats' },
      usage: { zh: '可数名词；wright 表示“工匠”，同类的还有 playwright（剧作家）。', en: 'Countable. Wright means craftsman, as in playwright.' },
      collocations: ['skilled shipwrights', 'the shipwrights at work'],
      example: { en: 'Two shipwrights were repairing the hull of an old fishing boat.', zh: '两名造船匠正在修理一条旧渔船的船体。' },
      listening: { zh: '读 /ˈʃɪpraɪt/，wright 与 right、write 同音。', en: 'Wright sounds like right and write.' },
    },
    {
      term: 'peek', phonetic: '/piːk/', partOfSpeech: 'v.', sentenceIndex: 32,
      meaning: { zh: '偷看，瞥一眼', en: 'to look quickly and often secretly' },
      usage: { zh: 'peek through or into something；比 peek 更正式的词是 glance。', en: 'peek through or into something; glance is a slightly more formal alternative.' },
      collocations: ['peek through the window', 'take a peek'],
      example: { en: 'She peeked inside the box and smiled.', zh: '她朝盒子里看了一眼，笑了。' },
      listening: { zh: '与 peak 同音；见到 through the windows 这类搭配时，判断为动词。', en: 'A homophone of peak; after through the windows it is the verb.' },
    },
    {
      term: 'refurbished', phonetic: '/ˌriːˈfɜːbɪʃt/', partOfSpeech: 'v.', sentenceIndex: 34,
      meaning: { zh: '翻新，整修', en: 'cleaned and decorated so that it looks new again' },
      usage: { zh: 'refurbish 的过去分词；名词是 refurbishment。', en: 'Past participle of refurbish; the noun is refurbishment.' },
      collocations: ['recently refurbished', 'a complete refurbishment'],
      example: { en: 'The station was refurbished before the festival.', zh: '车站节前翻新过了。' },
      listening: { zh: '重音在第二个音节 /ˈfɜː/，开头是长音 /riː/。', en: 'Stress the second syllable; it opens with a long /riː/.' },
    },
  ],
  expressions: [
    {
      phrase: 'set off', sentenceIndex: 1,
      meaning: { zh: '出发，启程', en: 'to begin a journey' },
      usage: { zh: '不及物短语动词；set off for somewhere。', en: 'Intransitive; set off for somewhere.' },
      example: { en: 'We set off early to avoid the traffic.', zh: '我们早早出发以避开交通高峰。' },
    },
    {
      phrase: 'go over', sentenceIndex: 1,
      meaning: { zh: '讲解，浏览一遍', en: 'to explain or review something' },
      usage: { zh: '及物短语动词；go over the details、go over a plan。', en: 'Transitive: go over the details, go over a plan.' },
      example: { en: 'Let me go over the arrangements for tomorrow.', zh: '我把明天的安排讲一遍。' },
    },
    {
      phrase: 'on your own', sentenceIndex: 4,
      meaning: { zh: '独自，自己（做）', en: 'alone or without help' },
      usage: { zh: 'look around on your own；与 by yourself 同义。', en: 'Same as by yourself.' },
      example: { en: 'You can explore the museum on your own after the tour.', zh: '导览结束后你可以自己逛博物馆。' },
    },
    {
      phrase: 'fallen silent', sentenceIndex: 13,
      meaning: { zh: '变得沉寂', en: 'become quiet and empty' },
      usage: { zh: 'fall 加形容词表示“进入某种状态”：fall ill、fall asleep、fall silent。', en: 'Fall plus adjective shows a change of state: fall ill, fall asleep, fall silent.' },
      example: { en: 'The room fell silent when she began to speak.', zh: '她一开口，房间就安静了下来。' },
    },
    {
      phrase: 'do it justice', sentenceIndex: 17,
      meaning: { zh: '充分领略它的好处', en: 'to appreciate something as well as it deserves' },
      usage: { zh: '常用于否定：not enough time to do it justice。', en: 'Often negative: not enough time to do it justice.' },
      example: { en: 'One day is not enough to do the city justice.', zh: '一天时间根本不够好好看这座城市。' },
    },
    {
      phrase: 'no longer', sentenceIndex: 22,
      meaning: { zh: '不再', en: 'not any more' },
      usage: { zh: '放在动词前；not any longer 意思相近但语气更口语。', en: 'Goes before the verb; not any longer is close in meaning.' },
      example: { en: 'The mine is no longer in use.', zh: '这座矿不再使用了。' },
    },
    {
      phrase: 'for safety reasons', sentenceIndex: 25,
      meaning: { zh: '出于安全考虑', en: 'because of safety concerns' },
      usage: { zh: 'for 加名词复数表示原因：for security reasons、for personal reasons。', en: 'For plus a plural noun gives a reason: for security reasons, for personal reasons.' },
      example: { en: 'The bridge is closed for safety reasons.', zh: '出于安全考虑，桥封闭了。' },
    },
    {
      phrase: 'keep to', sentenceIndex: 36,
      meaning: { zh: '保持在……之内；遵守', en: 'to stay within limits or follow a rule' },
      usage: { zh: 'keep 后接路径、规则或话题：keep to the path、keep to the rules、keep to the point（说话不离题）。', en: 'Follow with a path, a rule or a topic: keep to the path, keep to the rules, keep to the point.' },
      example: { en: 'Please keep to the marked footpath.', zh: '请走在标出的步道上。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白靠信号词定位', en: 'Monologues: follow the signposts' },
      body: {
        zh: 'Part 2 没有提问提示下一题到了，但独白有自己的路标：Now, a little history、After that、And finally。听到这类词，说明进入下一段内容，题目也多半到了下一题。',
        en: 'Nobody asks a question to tell you the next item has started, but monologues carry their own signposts: Now, a little history; After that; And finally. They usually mark the next question too.',
      },
    },
    {
      title: { zh: '配对题先把选项译成“要听的特征”', en: 'Matching: turn options into features' },
      body: {
        zh: '七个选项读不完也记不住。每个选项只记一个特征词：still working、shops、closed、wheelchairs、ropes、live there、exhibition。听的时候拿特征词去对地点，而不是整句翻译。',
        en: 'Do not try to memorise seven sentences. Keep one keyword per option — working, shops, closed, wheelchairs, ropes, live there, exhibition — and match features to places as you listen.',
      },
    },
    {
      title: { zh: '听清建筑“过去”和“现在”的区别', en: 'Past use versus present use' },
      body: {
        zh: 'used to、was built to、where … were repaired 说的是过去；is now、has been converted into、still working 说的是现在。配对题常把过去的用途做成干扰项，落笔前确认时态。',
        en: 'Used to, was built to and where … were repaired describe the past; is now, has been converted into and still working describe the present. Old uses are the usual distractors.',
      },
    },
  ],
};
