import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 4 · Part 2 — 策展人在博物馆特展开幕前做导言。原创仿真材料，非官方真题。
 *
 * 单人独白：展品来源、分区方式、互动区、闭展日期、亮点展品、语音导览与讲解场次。
 */
export const test04Part2: ListeningLesson = {
  slug: 'test-04-part-2',
  part: 2,
  status: 'published',
  title: { zh: '博物馆特展导言', en: 'Introducing a museum exhibition' },
  summary: {
    zh: '策展人 Ruth 向参观者介绍特展 Coastal Journeys：展品来自私人收藏与海事博物馆，按五个主题布展，互动区可试穿传统服饰，并说明闭展日期、重点展品、语音导览和周末及周四的讲解场次。',
    en: 'The curator Ruth introduces the special exhibition Coastal Journeys: objects from a private collection and the maritime museum, five themed rooms, an interactive dress-up zone, the closing date, highlights, the audio guide, and the weekend and Thursday talks.',
  },
  accent: { zh: '策展人为澳式口音，语速中等。', en: 'The curator has an Australian accent and speaks at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'curator', label: 'CURATOR', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Most objects are borrowed from a private', cells: [[{ blank: 11 }, { text: '.' }]] },
        { lead: 'The exhibition is arranged around five', cells: [[{ blank: 12 }, { text: '.' }]] },
        { lead: 'Interactive zone: visitors can try on traditional', cells: [[{ blank: 13 }, { text: '.' }]] },
        { lead: 'The exhibition closes on the', cells: [[{ blank: 14 }, { text: ' of November.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Where did the largest painting come from?',
          options: [
            { key: 'A', text: 'a local gallery' },
            { key: 'B', text: 'an overseas museum' },
            { key: 'C', text: 'the artist’s family' },
          ],
        },
        {
          number: 16,
          stem: 'What is the first room devoted to?',
          options: [
            { key: 'A', text: 'fishing boats' },
            { key: 'B', text: 'lighthouses' },
            { key: 'C', text: 'coastal maps' },
          ],
        },
        {
          number: 17,
          stem: 'What does the curator say about the audio guide?',
          options: [
            { key: 'A', text: 'It must be booked in advance.' },
            { key: 'B', text: 'It costs an extra five pounds.' },
            { key: 'C', text: 'It is free with the ticket.' },
          ],
        },
        {
          number: 18,
          stem: 'What should visitors not miss on the ground floor?',
          options: [
            { key: 'A', text: 'a model ship in the first room' },
            { key: 'B', text: 'a short film about the old harbour' },
            { key: 'C', text: 'a family activity pack at the desk' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which person leads each session? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'the curator' },
        { key: 'B', text: 'a museum volunteer' },
        { key: 'C', text: 'the conservator' },
        { key: 'D', text: 'a local historian' },
        { key: 'E', text: 'the owner of the private collection' },
      ],
      items: [
        { number: 19, text: 'Gives the introductory talk at weekends' },
        { number: 20, text: 'Leads the behind-the-scenes session on Thursday' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['collection'], evidence: 4,
      explanation: {
        zh: '定位句 4：Most of the objects on show are borrowed from a private collection。下一句补充收藏者是一位本地医生，不要把 doctor 填进空里。',
        en: 'Sentence 4: "Most of the objects on show are borrowed from a private collection". The next sentence adds that the owner is a local doctor, so doctor is not the answer here.',
      },
    },
    {
      number: 12, accepted: ['themes'], evidence: 8,
      explanation: {
        zh: '定位句 8：We arranged the exhibition around five themes, rather than following one long timeline。展线按主题而非年代组织；timeline 是被否定的方式，不能填。',
        en: 'Sentence 8: "We arranged the exhibition around five themes, rather than following one long timeline". The display follows themes, not a timeline, so timeline is rejected.',
      },
    },
    {
      number: 13, accepted: ['costumes'], evidence: 14,
      explanation: {
        zh: '定位句 14：there is an interactive zone where visitors can try on traditional costumes。互动区可试穿的是传统服装；句 16 的 fishing net 是另一项动手活动。',
        en: 'Sentence 14: "an interactive zone where visitors can try on traditional costumes". The dress-up item is traditional clothing. The fishing net in sentence 16 is a separate hands-on activity.',
      },
    },
    {
      number: 14, accepted: ['seventeenth'], evidence: 18,
      explanation: {
        zh: '定位句 18：The exhibition remains open until the seventeenth of November。空格后已印 of November，只填日期序数词；注意拼写 seventeenth。',
        en: 'Sentence 18: "The exhibition remains open until the seventeenth of November". Of November is already printed, so only the ordinal day is needed; spell seventeenth carefully.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：The largest painting in the show came from an overseas museum。本地画廊和艺术家家属在全段都没有提到；句 25 只说画作随自带木框借展。',
        en: 'Sentence 23: "The largest painting in the show came from an overseas museum". A local gallery and the artist’s family are never mentioned, and sentence 25 only notes the wooden frame.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：In the first room, the display is devoted entirely to fishing boats。句 10 提到 lighthouses 在第二个房间，maps 在更里面的展厅，都不是第一间。',
        en: 'Sentence 26: "In the first room, the display is devoted entirely to fishing boats". Sentence 10 places lighthouses in the next room and maps further along, so neither matches the first room.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：The audio guide is free with your ticket, and you collect it at the desk just inside the entrance。不需要提前预订，也不另收费；B 项的五英镑没有依据。',
        en: 'Sentence 29: "The audio guide is free with your ticket, and you collect it at the desk just inside the entrance". It needs no advance booking and carries no extra fee; the five pounds in B has no basis.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：On the ground floor, do not miss the short film about the old harbour。模型船在第一展厅，活动包在服务台领取，位置与题干的一楼不符。',
        en: 'Sentence 31: "On the ground floor, do not miss the short film about the old harbour". The model ship is in the first room and the activity pack is collected at the desk, so neither matches the ground floor.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：At weekends, a museum volunteer gives a short introductory talk in the first room。周末开场讲解由志愿者负责；策展人本人在句 41 说的是私下答疑。',
        en: 'Sentence 36: "At weekends, a museum volunteer gives a short introductory talk in the first room". The weekend talk is led by a volunteer; the curator, in sentence 41, offers private questions only.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 38,
      explanation: {
        zh: '定位句 38：On Thursday afternoons, the conservator leads a behind-the-scenes session。周四幕后场次由文物修复师带领；本地历史学家在句 40 只在最后一个周日到场。',
        en: 'Sentence 38: "On Thursday afternoons, the conservator leads a behind-the-scenes session". The Thursday session is led by the conservator; the local historian in sentence 40 appears only on the last Sunday.',
      },
    },
  ],
  transcript: [
    { speaker: 'curator', text: 'The cloakroom on the left can take large bags before you enter the exhibition.' },
    { speaker: 'curator', text: 'My name is Ruth, and I’m the curator of the special exhibition you’re about to see.' },
    { speaker: 'curator', text: 'Before you go through the doors, I’d like to spend a few minutes setting out what to expect.' },
    { speaker: 'curator', text: 'The exhibition is called Coastal Journeys, and it looks at how life along this coast has changed over two hundred years.' },
    { speaker: 'curator', text: 'Most of the objects on show are borrowed from a private collection.' },
    { speaker: 'curator', text: 'The owner is a local doctor, who has spent forty years gathering photographs, tools and household items.' },
    { speaker: 'curator', text: 'Almost none of the objects has ever been shown to the public before.' },
    { speaker: 'curator', text: 'A smaller number of pieces have been lent by the maritime museum down the road.' },
    { speaker: 'curator', text: 'We arranged the exhibition around five themes, rather than following one long timeline.' },
    { speaker: 'curator', text: 'Each room has a different colour scheme, so you can find your way around without a map.' },
    { speaker: 'curator', text: 'The first room covers fishing boats, and the next one shows how lighthouses were built and manned.' },
    { speaker: 'curator', text: 'Further along, you will find maps of the harbour and the old coastal trade routes.' },
    { speaker: 'curator', text: 'One section is given over to school life by the sea, with old desks and exercise books on display.' },
    { speaker: 'curator', text: 'We also include letters and postcards that ordinary people sent to relatives inland.' },
    { speaker: 'curator', text: 'At the far end, there is an interactive zone where visitors can try on traditional costumes.' },
    { speaker: 'curator', text: 'The costumes are made of heavy wool, so please do not take the hangers off the rails.' },
    { speaker: 'curator', text: 'You can also trace a fishing net on the demonstration table, where a volunteer will show you the knots.' },
    { speaker: 'curator', text: 'Children are welcome to hold the sample ropes, but please keep food and drink out of the zone.' },
    { speaker: 'curator', text: 'The exhibition remains open until the seventeenth of November.' },
    { speaker: 'curator', text: 'After that date, most of the loans go back to their owner for storage.' },
    { speaker: 'curator', text: 'Tickets are valid all day, so you can leave and come back in the afternoon if you like.' },
    { speaker: 'curator', text: 'The ticket also covers every temporary display in the east wing.' },
    { speaker: 'curator', text: 'Let me tell you about a few highlights, in case you have limited time.' },
    { speaker: 'curator', text: 'The largest painting in the show came from an overseas museum.' },
    { speaker: 'curator', text: 'It was painted in eighteen ninety by an artist who spent a summer in the harbour.' },
    { speaker: 'curator', text: 'We negotiated the loan for over a year, and it travels with its own wooden frame.' },
    { speaker: 'curator', text: 'In the first room, the display is devoted entirely to fishing boats.' },
    { speaker: 'curator', text: 'You will see models, photographs and a real sail from a small fishing smack.' },
    { speaker: 'curator', text: 'The boat models were carved by retired fishermen in the nineteen thirties.' },
    { speaker: 'curator', text: 'The audio guide is free with your ticket, and you collect it at the desk just inside the entrance.' },
    { speaker: 'curator', text: 'It runs in three languages, and each stop lasts about two minutes.' },
    { speaker: 'curator', text: 'On the ground floor, do not miss the short film about the old harbour.' },
    { speaker: 'curator', text: 'It shows families loading their boats, and it runs every half hour throughout the day.' },
    { speaker: 'curator', text: 'If you arrive with children, ask at the desk for an activity pack, which is also free.' },
    { speaker: 'curator', text: 'The pack includes a simple trail and a pencil for drawing what you see.' },
    { speaker: 'curator', text: 'Several members of staff and volunteers will be on duty during your visit.' },
    { speaker: 'curator', text: 'At weekends, a museum volunteer gives a short introductory talk in the first room.' },
    { speaker: 'curator', text: 'The talk lasts fifteen minutes, and it covers the main themes of the exhibition.' },
    { speaker: 'curator', text: 'On Thursday afternoons, the conservator leads a behind-the-scenes session.' },
    { speaker: 'curator', text: 'She explains how the fragile objects were cleaned and mounted for display.' },
    { speaker: 'curator', text: 'The local historian will be here on the last Sunday, to answer questions about family names.' },
    { speaker: 'curator', text: 'I will be in the shop after the talk if anyone wants to ask me a question in private.' },
    { speaker: 'curator', text: 'The shop sells prints of the harbour views and postcards from the collection.' },
    { speaker: 'curator', text: 'Photography is allowed in most rooms, but please do not use a flash.' },
    { speaker: 'curator', text: 'The café is on the first floor, and it looks out over the harbour.' },
    { speaker: 'curator', text: 'There is a quiet room for anyone who needs to rest away from the crowds.' },
    { speaker: 'curator', text: 'Before we start, please switch your phones to silent.' },
    { speaker: 'curator', text: 'If you have any questions later, look for staff wearing blue lanyards.' },
    { speaker: 'curator', text: 'Enjoy the exhibition, and thank you for coming to the Meridian City Museum.' },
  ],
  vocabulary: [
    {
      term: 'collection', phonetic: '/kəˈlekʃn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '收藏；收藏品', en: 'a group of objects gathered and kept together by one person or institution' },
      usage: { zh: '可数；a private collection、the museum collection。动词是 collect。', en: 'Countable: a private collection, the museum collection. The verb is collect.' },
      collocations: ['a private collection', 'the permanent collection', 'a collection of'],
      example: { en: 'The prints come from a private collection of harbour scenes.', zh: '这些版画来自一批私人收藏的港景作品。' },
      listening: { zh: '重音在第二音节 /ˈlek/，词尾 -tion 读 /ʃn/。', en: 'Stress the second syllable; -tion is /ʃn/.' },
    },
    {
      term: 'themes', phonetic: '/θiːmz/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '主题', en: 'a main idea that organises a group of displays or texts' },
      usage: { zh: '可数；around five themes、the main themes。形容词是 thematic。', en: 'Countable: around five themes, the main themes. The adjective is thematic.' },
      collocations: ['around five themes', 'the main theme', 'a central theme'],
      example: { en: 'The exhibition is arranged around five themes.', zh: '展览按五个主题布展。' },
      listening: { zh: '开头是清辅音 /θ/，不要读成 /s/；长元音 /iː/。', en: 'The opening consonant is /θ/, not /s/, with a long /iː/.' },
    },
    {
      term: 'costumes', phonetic: '/ˈkɒstjuːmz/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '服装（尤指传统、舞台或节庆装束）', en: 'clothing typical of a particular period, place or occasion' },
      usage: { zh: '可数复数；traditional costumes、try on costumes。注意与 cloth（布料）区分。', en: 'Countable plural: traditional costumes. Do not confuse with cloth, meaning fabric.' },
      collocations: ['traditional costumes', 'try on costumes', 'historical costumes'],
      example: { en: 'Children can try on the traditional costumes at the far end.', zh: '孩子们可以在展厅尽头试穿传统服装。' },
      listening: { zh: '两个音节，重音在第一音节；词尾复数 /z/ 很轻。', en: 'Two syllables, stress on the first; the plural /z/ is soft.' },
    },
    {
      term: 'interactive', phonetic: '/ˌɪntərˈæktɪv/', partOfSpeech: 'adj.', sentenceIndex: 14,
      meaning: { zh: '互动的，可参与操作的', en: 'designed so that visitors can touch, try or respond to it' },
      usage: { zh: '修饰区域或设备：an interactive zone、an interactive display。', en: 'Modifies a zone or display: an interactive zone.' },
      collocations: ['an interactive zone', 'an interactive display', 'an interactive exhibition'],
      example: { en: 'The interactive zone lets visitors handle the sample ropes.', zh: '互动区允许参观者触摸样绳。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈæk/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'lent', phonetic: '/lent/', partOfSpeech: 'v.', sentenceIndex: 7,
      meaning: { zh: '借出，出借（lend 的过去分词）', en: 'given something to someone for a period; past participle of lend' },
      usage: { zh: '被动形式 be lent by；on loan 是对应的名词说法。', en: 'Passive: be lent by; the noun phrase is on loan.' },
      collocations: ['lent by the museum', 'on loan', 'lent to the public'],
      example: { en: 'A smaller number of pieces have been lent by the maritime museum.', zh: '数量较少的一批展品由海事博物馆出借。' },
      listening: { zh: '与 land 对比：lent 是 /e/，结尾 /nt/。', en: 'Compare with land: lent has /e/ and ends in /nt/.' },
    },
    {
      term: 'devoted', phonetic: '/dɪˈvəʊtɪd/', partOfSpeech: 'adj.', sentenceIndex: 26,
      meaning: { zh: '专门用于……的', en: 'used for one particular purpose or subject only' },
      usage: { zh: 'be devoted to something；后接名词或动名词。', en: 'Be devoted to something, followed by a noun or gerund.' },
      collocations: ['devoted entirely to', 'a room devoted to'],
      example: { en: 'The first room is devoted entirely to fishing boats.', zh: '第一间展厅全部展示渔船。' },
      listening: { zh: '重音在第二音节 /ˈvəʊ/，结尾 /tɪd/ 轻读。', en: 'Stress the second syllable; the ending /tɪd/ is reduced.' },
    },
    {
      term: 'conservator', phonetic: '/kənˈsɜːvətə/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '文物修复师，保管员', en: 'a specialist who cleans, repairs and protects historical objects' },
      usage: { zh: '博物馆职业名词；动词 conserve 表示“修复、保存”。', en: 'A museum job; the verb conserve means to protect and repair.' },
      collocations: ['the conservator leads', 'a trained conservator', 'the conservator’s notes'],
      example: { en: 'The conservator explains how the fragile objects were cleaned.', zh: '修复师讲解脆弱文物是如何清洁的。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈsɜːv/；不要与 conservative 混淆。', en: 'Four syllables with stress on the second; do not confuse with conservative.' },
    },
    {
      term: 'fragile', phonetic: '/ˈfrædʒaɪl/', partOfSpeech: 'adj.', sentenceIndex: 39,
      meaning: { zh: '易碎的，脆弱的', en: 'easily broken or damaged' },
      usage: { zh: '修饰物品；a fragile object、fragile paper。', en: 'Describes objects: a fragile object, fragile paper.' },
      collocations: ['fragile objects', 'fragile paper', 'highly fragile'],
      example: { en: 'The fragile objects are mounted away from the walkways.', zh: '脆弱文物被固定在步道之外。' },
      listening: { zh: '两个音节，结尾 /aɪl/；重音在第一音节。', en: 'Two syllables ending in /aɪl/, stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'about to see', sentenceIndex: 1,
      meaning: { zh: '即将参观，马上要看', en: 'going to experience or visit very soon' },
      usage: { zh: 'be about to do something 表示“正要做某事”。', en: 'Be about to do something means on the point of doing it.' },
      example: { en: 'The exhibition you are about to see covers two hundred years of coastal life.', zh: '你们即将参观的展览涵盖两百年的海岸生活。' },
    },
    {
      phrase: 'given over to', sentenceIndex: 12,
      meaning: { zh: '被辟作……用途', en: 'used for a particular subject or activity' },
      usage: { zh: '被动形式 be given over to something；主语通常是房间或区域。', en: 'Passive: be given over to something; the subject is usually a room or area.' },
      example: { en: 'One section is given over to school life by the sea.', zh: '一个展区专门展示海边校园生活。' },
    },
    {
      phrase: 'try on', sentenceIndex: 14,
      meaning: { zh: '试穿（衣物）', en: 'to put on clothing to check the fit and look' },
      usage: { zh: '可分短语动词；try on the costumes 或 try the costumes on。', en: 'Separable: try on the costumes or try the costumes on.' },
      example: { en: 'Visitors can try on the costumes made of heavy wool.', zh: '参观者可以试穿厚羊毛面料的服装。' },
    },
    {
      phrase: 'in case', sentenceIndex: 22,
      meaning: { zh: '以防，万一', en: 'because something might happen, as a precaution' },
      usage: { zh: '后接从句；表示提前准备，不等于 if。', en: 'Follow with a clause; it means as a precaution, not if.' },
      example: { en: 'Let me point out the highlights in case you have limited time.', zh: '万一你们时间有限，我先介绍几个重点展品。' },
    },
    {
      phrase: 'devoted entirely to', sentenceIndex: 26,
      meaning: { zh: '全部用于……', en: 'used wholly for one subject, with nothing else' },
      usage: { zh: 'entirely 加强 devoted 的范围；可替换为 mainly、partly。', en: 'Entirely strengthens the range of devoted; mainly or partly can replace it.' },
      example: { en: 'The room is devoted entirely to fishing boats and their equipment.', zh: '这间展厅全部陈列渔船及其装备。' },
    },
    {
      phrase: 'behind-the-scenes', sentenceIndex: 38,
      meaning: { zh: '幕后的，后台的', en: 'connected with the hidden preparation side of a museum or show' },
      usage: { zh: '作定语，带连字符；a behind-the-scenes session、a behind-the-scenes tour。', en: 'Attributive with hyphens: a behind-the-scenes session.' },
      example: { en: 'The conservator leads a behind-the-scenes session on Thursdays.', zh: '修复师周四带领幕后参观场次。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白先跟分区走', en: 'Follow the room order' },
      body: {
        zh: 'Part 2 是单人独白，题目顺序通常与讲解顺序一致。策展人按第一间到最后一间依次介绍，听到 first room、further along、at the far end 就核对自己填到哪一题。',
        en: 'Part 2 is a monologue and items usually follow the speaking order. The curator moves from the first room to the far end; check your place whenever you hear first room, further along or at the far end.',
      },
    },
    {
      title: { zh: '配对题先记人名再记职务', en: 'For matching, note the role first' },
      body: {
        zh: '第 19、20 题把场次和负责人配对。听的时候先在选项旁写出周末、周四两个时间，再把说话人身份（volunteer、conservator）对上；不要听到 staff 就选 A 策展人。',
        en: 'Items 19 and 20 match sessions to people. Note the weekend and Thursday times beside the options first, then match the role such as volunteer or conservator. Do not choose the curator just because the word staff appears.',
      },
    },
    {
      title: { zh: '日期序数词别漏后缀', en: 'Ordinal days keep the suffix' },
      body: {
        zh: '第 14 题问闭展日期，录音读 seventeenth，答题纸上写序数词即可；序数词拼写（thirteenth、twentieth、thirtieth）是 Part 2 常见失分点，考前把一到三十的序数词过一遍。',
        en: 'Item 14 asks for the closing date; the recording says seventeenth, and an ordinal goes on the answer sheet. Ordinal spellings such as thirteenth, twentieth and thirtieth are common losses, so review ordinals one to thirty before the test.',
      },
    },
  ],
};
