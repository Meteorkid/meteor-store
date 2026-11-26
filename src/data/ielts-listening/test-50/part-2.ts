import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 50 · Part 2 — 种子图书馆介绍（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白前半段按借种规则、本地品种、留种工作坊、归还要求与园艺咨询展开，对应五道单选；
 * 后半段补充分类方式、场次时间、种子状态、会费与咨询室，对应五道笔记填空。
 */
export const test50Part2: ListeningLesson = {
  slug: 'test-50-part-2',
  part: 2,
  status: 'published',
  title: { zh: '种子图书馆介绍', en: 'Introducing a seed library' },
  summary: {
    zh: '讲解员介绍社区种子图书馆：借种后留种归还、品种来自适应本地气候的花园、工作坊教干燥保存、归还时带回成熟种子，志愿者在咨询室提供园艺建议；并说明分类、场次、状态、会费与咨询地点。',
    en: 'A guide introduces the community seed library: borrowers save seeds to return, varieties come from local gardens adapted to the climate, the workshop teaches drying and storage, ripe seeds are brought back after the season, and volunteers give gardening advice in the advice room. Notes cover sorting, workshop day, seed condition, membership fee and the advice room.',
  },
  accent: { zh: '讲解员为加拿大口音，语速中等偏快，术语会重复。', en: 'The guide has a Canadian accent, speaks fairly quickly and repeats key terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'What rule applies when borrowing seeds?',
          options: [
            { key: 'A', text: 'Each packet can be kept for one season only.' },
            { key: 'B', text: 'Borrowers take seeds and return saved seeds later.' },
            { key: 'C', text: 'Seeds are sold at a fixed price per packet.' },
          ],
        },
        {
          number: 12,
          stem: 'What is special about the library seed varieties?',
          options: [
            { key: 'A', text: 'They come from local gardens adapted to the climate.' },
            { key: 'B', text: 'They are imported from overseas breeders.' },
            { key: 'C', text: 'They are all hybrid varieties bred commercially.' },
          ],
        },
        {
          number: 13,
          stem: 'What does the seed saving workshop teach?',
          options: [
            { key: 'A', text: 'How to dry and store seeds for next year.' },
            { key: 'B', text: 'How to grow plants in a heated glasshouse.' },
            { key: 'C', text: 'How to sell surplus seeds to shops.' },
          ],
        },
        {
          number: 14,
          stem: 'What must borrowers do when returning seeds?',
          options: [
            { key: 'A', text: 'Return the same packet bought in spring.' },
            { key: 'B', text: 'Save and bring back ripe seeds of the crop.' },
            { key: 'C', text: 'Bring the original plant back to the shelf.' },
          ],
        },
        {
          number: 15,
          stem: 'What service does the library offer after borrowing?',
          options: [
            { key: 'A', text: 'Free soil testing for every garden.' },
            { key: 'B', text: 'Gardening advice from volunteers.' },
            { key: 'C', text: 'A weekly delivery of compost.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Packets sorted by', cells: [[{ blank: 16 }]] },
        { lead: 'Workshop on the second', cells: [[{ blank: 17 }, { text: ' of the month' }]] },
        { lead: 'Returned seeds must be fully', cells: [[{ blank: 18 }]] },
        { lead: 'Annual membership fee', cells: [[{ text: '$' }, { blank: 19 }]] },
        { lead: 'Advice sessions in the', cells: [[{ blank: 20 }, { text: ' room' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：When you borrow seeds, you grow the crop through the summer and save seeds from it to return。借种后种植并留种归还，对应 B。A 说只留一季、C 说按包售卖，都与图书馆模式不符。',
        en: 'Sentence 3: "When you borrow seeds, you grow the crop through the summer and save seeds from it to return". Borrowers grow and return saved seeds, matching B. Keeping a packet one season in A and selling per packet in C do not fit the library model.',
      },
    },
    {
      number: 12, accepted: ['A'], evidence: 8,
      explanation: {
        zh: '定位句 8：They are gathered from local gardens that have grown them for years, adapted to our climate。品种来自本地花园、适应本地气候，对应 A。句 9 否定海外引种与商业杂交品种。',
        en: 'Sentence 8: "They are gathered from local gardens that have grown them for years, adapted to our climate". The varieties come from local gardens adapted to the climate, matching A. Sentence 9 rules out imported breeders and commercial hybrids.',
      },
    },
    {
      number: 13, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：It teaches how to dry, clean and store saved seeds ready for next year。工作坊教干燥、清理和留种保存，对应 A。B 的暖房种植、C 的售种给商店在句 12 被排除。',
        en: 'Sentence 11: "It teaches how to dry, clean and store saved seeds ready for next year". The workshop covers drying, cleaning and storage, matching A. Heated glasshouse growing in B and selling seeds to shops in C are excluded in sentence 12.',
      },
    },
    {
      number: 14, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：They save ripe seeds from the crop and bring those back to the shelf。归还时带回成熟种子，对应 B。句 15 说明原包装袋留在家中，D 的把植株带回货架未出现。',
        en: 'Sentence 14: "They save ripe seeds from the crop and bring those back to the shelf". Ripe saved seeds are returned, matching B. Sentence 15 says the original packet stays home; bringing the plant back in D is not mentioned.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Volunteers give gardening advice in the library room during opening hours。志愿者提供园艺咨询，对应 B。A 的免费土壤检测、C 的每周堆肥配送在句 18 被否定。',
        en: 'Sentence 17: "Volunteers give gardening advice in the library room during opening hours". Volunteers offer gardening advice, matching B. Free soil testing in A and weekly compost delivery in C are rejected in sentence 18.',
      },
    },
    {
      number: 16, accepted: ['crop'], evidence: 20,
      explanation: {
        zh: '定位句 20：The packets are sorted by crop, with vegetable seeds in the first section。种子包按作物分类，答案填 crop。',
        en: 'Sentence 20: "The packets are sorted by crop, with vegetable seeds in the first section". Packets are sorted by crop, so write crop.',
      },
    },
    {
      number: 17, accepted: ['Saturday'], evidence: 21,
      explanation: {
        zh: '定位句 21：The workshop runs on the second Saturday of every month, at ten in the morning。工作坊在每月第二个星期六，空格后已有 of the month，填 Saturday。',
        en: 'Sentence 21: "The workshop runs on the second Saturday of every month, at ten in the morning". The workshop meets the second Saturday; of the month already follows the gap, so write Saturday.',
      },
    },
    {
      number: 18, accepted: ['dry'], evidence: 22,
      explanation: {
        zh: '定位句 22：Returned seeds must be fully dry before they go into the packet。归还种子必须完全干燥，填 dry。',
        en: 'Sentence 22: "Returned seeds must be fully dry before they go into the packet". Returned seeds must be completely dry, so write dry.',
      },
    },
    {
      number: 19, accepted: ['5', 'five'], spoken: 'five', evidence: 23,
      explanation: {
        zh: '定位句 23：A member pays a five dollar annual fee to borrow from the shelves。年费五美元，空格前已有 $，填 five。',
        en: 'Sentence 23: "A member pays a five dollar annual fee to borrow from the shelves". The annual fee is five dollars; the $ already precedes the gap, so write five.',
      },
    },
    {
      number: 20, accepted: ['community'], evidence: 24,
      explanation: {
        zh: '定位句 24：The advice sessions are held in the community room behind the main desk。咨询在社区活动室进行，空格后已有 room，填 community。',
        en: 'Sentence 24: "The advice sessions are held in the community room behind the main desk". Advice sessions are in the community room; room already follows the gap, so write community.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Before you walk around the seed shelves, let me explain how the library works this season.' },
    { speaker: 'guide', text: 'I am Liam, and this short talk covers the borrowing rules, our local varieties, the workshop and what you bring back.' },
    { speaker: 'guide', text: 'A seed library works differently from a normal book library.' },
    { speaker: 'guide', text: 'When you borrow seeds, you grow the crop through the summer and save seeds from it to return.' },
    { speaker: 'guide', text: 'You do not keep a packet for a single season only, and you do not buy the seeds outright.' },
    { speaker: 'guide', text: 'Each packet is borrowed, then replaced by your own saved seeds next year.' },
    { speaker: 'guide', text: 'Now a few questions about what makes our collection special.' },
    { speaker: 'guide', text: 'Where do our seed varieties come from?' },
    { speaker: 'guide', text: 'They are gathered from local gardens that have grown them for years, adapted to our climate.' },
    { speaker: 'guide', text: 'They are not imported from overseas breeders, and they are not commercial hybrids.' },
    { speaker: 'guide', text: 'What will the seed saving workshop show you?' },
    { speaker: 'guide', text: 'It teaches how to dry, clean and store saved seeds ready for next year.' },
    { speaker: 'guide', text: 'It does not cover heated glasshouse growing, and it is not about selling seeds to shops.' },
    { speaker: 'guide', text: 'When the season ends, what do borrowers hand back?' },
    { speaker: 'guide', text: 'They save ripe seeds from the crop and bring those back to the shelf.' },
    { speaker: 'guide', text: 'The original packet stays at home; it is the new seeds that go on the shelf.' },
    { speaker: 'guide', text: 'What help can members get after they borrow?' },
    { speaker: 'guide', text: 'Volunteers give gardening advice in the library room during opening hours.' },
    { speaker: 'guide', text: 'There is no free soil testing service, and compost is not delivered each week.' },
    { speaker: 'guide', text: 'Now the notes to take away with you.' },
    { speaker: 'guide', text: 'The packets are sorted by crop, with vegetable seeds in the first section.' },
    { speaker: 'guide', text: 'The workshop runs on the second Saturday of every month, at ten in the morning.' },
    { speaker: 'guide', text: 'Returned seeds must be fully dry before they go into the packet.' },
    { speaker: 'guide', text: 'A member pays a five dollar annual fee to borrow from the shelves.' },
    { speaker: 'guide', text: 'The advice sessions are held in the community room behind the main desk.' },
    { speaker: 'guide', text: 'The library opens from nine to six on weekdays, and until one on Saturdays.' },
    { speaker: 'guide', text: 'Seeds from last season are labelled with the year they were saved.' },
    { speaker: 'guide', text: 'The notice board lists gardens that donate surplus seeds each autumn.' },
    { speaker: 'guide', text: 'Children over twelve may join with an adult member card.' },
    { speaker: 'guide', text: 'The shelf near the window holds the herb and salad packets.' },
    { speaker: 'guide', text: 'Unused seeds at the end of winter can be swapped at the monthly table.' },
    { speaker: 'guide', text: 'The volunteer who runs the workshop keeps notes on each variety performance.' },
    { speaker: 'guide', text: 'Rainfall last year was lower than average, so some packets are smaller than usual.' },
    { speaker: 'guide', text: 'The balcony plot outside shows several crops growing in containers.' },
    { speaker: 'guide', text: 'Members are asked to keep seeds away from damp in their own storage.' },
    { speaker: 'guide', text: 'A short list of recommended varieties hangs beside the door.' },
    { speaker: 'guide', text: 'Please write your name on the packet when you save and return seeds.' },
    { speaker: 'guide', text: 'The library holds a small display of old seed packets from the nineteen eighties.' },
    { speaker: 'guide', text: 'Questions about pests should go to the volunteer in the green apron.' },
    { speaker: 'guide', text: 'We will start the tour of the shelves in a moment.' },
    { speaker: 'guide', text: 'Look first at the tomato and bean packets on the middle row.' },
    { speaker: 'guide', text: 'The wooden shelves were built by a group of local volunteers last spring.' },
    { speaker: 'guide', text: 'Each packet carries a small label with the seed saving year.' },
    { speaker: 'guide', text: 'The library keeps a notebook of which varieties grew well this season.' },
    { speaker: 'guide', text: 'Members may return saved seeds at any open desk hour.' },
    { speaker: 'guide', text: 'A small notice on the door lists the upcoming swap table dates.' },
    { speaker: 'guide', text: 'Any questions before you borrow your first packet today?' },
  ],
  vocabulary: [
    {
      term: 'varieties', phonetic: '/vəˈraɪətiz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '品种，变种', en: 'a particular type of plant grown for its traits' },
      usage: { zh: '可数名词；seed variety、local variety，复数 varieties。', en: 'Countable: a seed variety, a local variety; the plural is varieties.' },
      collocations: ['seed varieties', 'local varieties', 'a recommended variety'],
      example: { en: 'The varieties come from local gardens adapted to the climate.', zh: '这些品种来自适应本地气候的花园。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈraɪ/，开头 və 弱读。', en: 'Four syllables with stress on the second; the opening və is weak.' },
    },
    {
      term: 'adapted', phonetic: '/əˈdæptɪd/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '适应的，适配的', en: 'changed to suit a particular place or condition' },
      usage: { zh: '形容词；adapted to the climate，动词 adapt，名词 adaptation。', en: 'Adjective: adapted to the climate; the verb is adapt, the noun adaptation.' },
      collocations: ['adapted to the climate', 'well adapted', 'adapted to the soil'],
      example: { en: 'These plants are adapted to our dry summers.', zh: '这些植物适应我们干燥的夏季。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdæp/，结尾 /tɪd/。', en: 'Three syllables with stress on the second; the ending /tɪd/.' },
    },
    {
      term: 'hybrids', phonetic: '/ˈhaɪbrɪdz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '杂交品种', en: 'a plant bred by crossing two different varieties' },
      usage: { zh: '可数名词；commercial hybrid，与 heirloom 传统品种相对。', en: 'Countable: a commercial hybrid, the opposite of an heirloom open pollinated variety.' },
      collocations: ['commercial hybrids', 'a hybrid variety', 'hybrid seeds'],
      example: { en: 'The library does not stock commercial hybrid seeds.', zh: '图书馆不收藏商业杂交种子。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhaɪ/，双元音。', en: 'Two syllables with first-syllable stress and a diphthong.' },
    },
    {
      term: 'ripe', phonetic: '/raɪp/', partOfSpeech: 'adj.', sentenceIndex: 14,
      meaning: { zh: '成熟的', en: 'ready to harvest, with seeds fully formed' },
      usage: { zh: '形容词；ripe seeds、ripe fruit，动词 ripen。', en: 'Adjective: ripe seeds, ripe fruit; the verb is ripen.' },
      collocations: ['ripe seeds', 'fully ripe', 'ripe fruit'],
      example: { en: 'Save ripe seeds from the crop before it dries out.', zh: '在作物干枯前留下成熟种子。' },
      listening: { zh: '单音节，双元音 /aɪ/，结尾 /p/ 清辅音。', en: 'One syllable with the diphthong /aɪ/ and a clear final /p/.' },
    },
    {
      term: 'surplus', phonetic: '/ˈsɜːpləs/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '剩余，多余（种子）', en: 'more seeds or produce than the gardener needs' },
      usage: { zh: '可数或不可数；surplus seeds、donate surplus，形容词用法 a surplus crop。', en: 'Countable or uncountable: surplus seeds, donate surplus; also adjective, a surplus crop.' },
      collocations: ['surplus seeds', 'donate surplus', 'a surplus crop'],
      example: { en: 'Gardens donate surplus seeds each autumn.', zh: '花园每年秋天捐赠多余种子。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɜː/，结尾 /ləs/ 弱读。', en: 'Two syllables with first-syllable stress; the ending /ləs/ is weak.' },
    },
    {
      term: 'recommended', phonetic: '/ˌrekəˈmendɪd/', partOfSpeech: 'adj.', sentenceIndex: 35,
      meaning: { zh: '推荐的', en: 'suggested as suitable for local growing' },
      usage: { zh: '形容词；recommended varieties，动词 recommend，名词 recommendation。', en: 'Adjective: recommended varieties; the verb is recommend, the noun recommendation.' },
      collocations: ['recommended varieties', 'a recommended list', 'highly recommended'],
      example: { en: 'A short list of recommended varieties hangs beside the door.', zh: '门边挂着一份推荐品种简表。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈmen/，开头 rek 弱读。', en: 'Four syllables with stress on the third; the opening rek is weak.' },
    },
    {
      term: 'swapped', phonetic: '/swɒpt/', partOfSpeech: 'v.', sentenceIndex: 30,
      meaning: { zh: '交换，互换（种子）', en: 'to exchange seeds or plants with another gardener' },
      usage: { zh: '及物动词；swap seeds、swap at the monthly table，名词 swap meet。', en: 'Transitive: swap seeds, swap at the monthly table; a noun swap meet.' },
      collocations: ['swap seeds', 'the swap table', 'swap surplus packets'],
      example: { en: 'Unused seeds can be swapped at the monthly table.', zh: '用不完的种子可在月度交换桌上互换。' },
      listening: { zh: '单音节，短元音 /ɒ/，结尾 /p/ 清辅音。', en: 'One syllable with the short vowel /ɒ/ and a final /p/.' },
    },
  ],
  expressions: [
    {
      phrase: 'save seeds', sentenceIndex: 3,
      meaning: { zh: '留种，保存种子', en: 'to collect and keep ripe seeds for the next season' },
      usage: { zh: '短语动词搭配；save seeds from the crop，名词 seed saving。', en: 'Phrase: save seeds from the crop; the noun form is seed saving.' },
      example: { en: 'You grow the crop and save seeds from it to return.', zh: '你种出作物并留种归还。' },
    },
    {
      phrase: 'adapted to', sentenceIndex: 8,
      meaning: { zh: '适应（某地气候）', en: 'suited by long growth to local conditions' },
      usage: { zh: '形容词加介词；adapted to the climate、adapted to the soil。', en: 'Adjective plus preposition: adapted to the climate, adapted to the soil.' },
      example: { en: 'The varieties are adapted to our climate.', zh: '这些品种适应本地气候。' },
    },
    {
      phrase: 'ready for', sentenceIndex: 11,
      meaning: { zh: '为……做好准备', en: 'prepared and kept for a later use' },
      usage: { zh: '形容词短语；seeds ready for next year，与 ready to do 区分。', en: 'Adjective phrase: seeds ready for next year; compare ready to do something.' },
      example: { en: 'Stored seeds are ready for next year.', zh: '保存好的种子留待明年使用。' },
    },
    {
      phrase: 'hand back', sentenceIndex: 13,
      meaning: { zh: '归还，交回', en: 'to return something to its place or owner' },
      usage: { zh: '及物短语动词；hand back the seeds，宾语可放中间。', en: 'Transitive phrasal verb: hand back the seeds; the object can sit in the middle.' },
      example: { en: 'Borrowers hand back ripe seeds at the end of the season.', zh: '借种者季末归还成熟种子。' },
    },
    {
      phrase: 'sorted by crop', sentenceIndex: 20,
      meaning: { zh: '按作物分类', en: 'grouped according to the plant being grown' },
      usage: { zh: 'sort by 后接分类标准；sorted by crop、sorted by season。', en: 'Sort by takes the criterion: sorted by crop, sorted by season.' },
      example: { en: 'The packets are sorted by crop.', zh: '种子包按作物分类。' },
    },
    {
      phrase: 'away from damp', sentenceIndex: 34,
      meaning: { zh: '远离潮湿', en: 'kept in a dry place, away from moisture' },
      usage: { zh: 'storage 场景；keep seeds away from damp，damp 作不可数名词。', en: 'In storage: keep seeds away from damp; damp is uncountable here.' },
      example: { en: 'Keep your own seeds away from damp.', zh: '自留种子要放在干燥处。' },
    },
  ],
  tips: [
    {
      title: { zh: '先听单选，后听笔记细节', en: 'Single choice first, note details second' },
      body: {
        zh: '前五题按借种规则、品种来源、工作坊内容、归还要求、咨询服务依次出现；过渡句 Now the notes 之后才进入笔记填空。听到这句时，把注意力从选项比对切到数字、星期和名词记录。',
        en: 'The first five questions follow borrowing rules, variety source, workshop content, return requirement and advice service in order; the note gaps begin after Now the notes. At that cue, switch from comparing options to recording numbers, weekdays and nouns.',
      },
    },
    {
      title: { zh: '图书馆不是卖种子的商店', en: 'A library is not a seed shop' },
      body: {
        zh: '种子图书馆的核心是借与还：借种、种植、留种、归还。选项里出现 sold、buy outright、fixed price 这类买卖词汇时，多半是干扰项，回原文确认是否被否定。',
        en: 'The seed library works on borrow and return: take seeds, grow them, save seeds, bring them back. Options with buying or selling words such as sold, buy outright or fixed price are usually distractors; check whether the recording rejects them.',
      },
    },
    {
      title: { zh: '星期与费用先看空格单位', en: 'Check weekday and fee units first' },
      body: {
        zh: '笔记三行分别给了 of the month、$、room 作单位，答案只填 Saturday、five、community。听到星期和金额先对照行首字段，避免把会费五美元填进工作坊场次那一行。',
        en: 'The note rows already give of the month, $ and room, so write only Saturday, five and community. Match each weekday and amount to its row before recording, so the five dollar fee does not land in the workshop day row.',
      },
    },
  ],
};
