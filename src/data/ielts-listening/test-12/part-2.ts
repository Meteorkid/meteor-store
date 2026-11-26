import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 12 · Part 2 — 农夫市集摊主说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：开市与卸货时间 → 卫生着装要求 → 价格标识 → 垃圾分类 → 停车安排 → 摊主例会，
 * 后半段集中回答常见疑问：试吃样品、价格展示、未售出生鲜处理、卸货与停车。填空块在前半段，
 * 单选块在后半段，题块顺序与录音顺序一致。
 */
export const test12Part2: ListeningLesson = {
  slug: 'test-12-part-2',
  part: 2,
  status: 'published',
  title: { zh: '农夫市集摊主说明', en: 'Briefing stallholders at a farmers’ market' },
  summary: {
    zh: '市集协调员向摊主说明开市与卸货时段、着装与食品卫生要求、价格标签规则、垃圾分类处理、停车位置以及每周例会安排，并回答试吃样品、价格展示、未售出生鲜和卸货停车等常见问题。',
    en: 'The market coordinator briefs stallholders on opening and unloading times, dress and food hygiene rules, price labelling, waste sorting, parking and the weekly meeting, then answers common questions about tasting samples, price display, unsold fresh produce and unloading.',
  },
  accent: { zh: '协调员为南非口音，规则部分会逐条重复强调。', en: 'The coordinator speaks with a South African accent, repeating the rules that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Market opens to shoppers at', cells: [[{ blank: 11 }]] },
        { lead: 'Must wear a clean', cells: [[{ blank: 12 }, { text: ' over their own clothes' }]] },
        { lead: 'Every item must carry a clear price', cells: [[{ blank: 13 }]] },
        { lead: 'Packaging goes into the grey', cells: [[{ blank: 14 }]] },
        { lead: 'Stallholders park behind the village', cells: [[{ blank: 15 }]] },
        { lead: 'Stallholders’ meeting: every', cells: [[{ blank: 16 }, { text: ' morning' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'How should tasting samples be served?',
          options: [
            { key: 'A', text: 'On a clean paper cup or spoon, behind the stall edge.' },
            { key: 'B', text: 'Directly from the producer’s hands.' },
            { key: 'C', text: 'From a shared plate passed along the row.' },
          ],
        },
        {
          number: 18,
          stem: 'How must prices be displayed?',
          options: [
            { key: 'A', text: 'On the large entrance board for each stall.' },
            { key: 'B', text: 'On a label beside each item on the stall.' },
            { key: 'C', text: 'Called out to shoppers as they pass.' },
          ],
        },
        {
          number: 19,
          stem: 'What should happen to unsold fresh produce at closing time?',
          options: [
            { key: 'A', text: 'It may be left in the green waste bin.' },
            { key: 'B', text: 'It is sold to the council for recycling.' },
            { key: 'C', text: 'It goes home or to the community kitchen.' },
          ],
        },
        {
          number: 20,
          stem: 'Where should stallholders park after unloading?',
          options: [
            { key: 'A', text: 'In the disabled bay near the entrance.' },
            { key: 'B', text: 'Beside the stall row until closing time.' },
            { key: 'C', text: 'In the car park behind the village hall.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['eight', '8'], evidence: 1,
      explanation: {
        zh: '定位句 1：The market opens to shoppers at eight in the morning。问的是对顾客开市的时间，four 是收市时间，six thirty 是卸货开始时间，都不是答案。',
        en: 'Sentence 1: "The market opens to shoppers at eight in the morning". The question asks for opening time; four is closing time and six thirty the unloading start, neither is the answer.',
      },
    },
    {
      number: 12, accepted: ['apron'], evidence: 4,
      explanation: {
        zh: '定位句 4：Every stallholder must wear a clean apron over their own clothes。空格前已给 clean，着装要求是 apron；gloves 在同句是处理散装食物时另外提供的，不是这件外衣。',
        en: 'Sentence 4: "Every stallholder must wear a clean apron over their own clothes". The gap follows clean, so the item is the apron; gloves in the same sentence are provided separately for loose food.',
      },
    },
    {
      number: 13, accepted: ['label'], evidence: 7,
      explanation: {
        zh: '定位句 7：Every item you sell must carry a clear price label。价格标签是 label；colour dot 在同句是被否定的做法，不能填。',
        en: 'Sentence 7: "Every item you sell must carry a clear price label". The price tag is the label; a colour dot in the same sentence is the rejected method.',
      },
    },
    {
      number: 14, accepted: ['bag'], evidence: 11,
      explanation: {
        zh: '定位句 11：packaging such as paper and string goes into the grey bag beside it。包装进灰色袋子，对应 bag；green bin 装的是食物残渣，不是包装。',
        en: 'Sentence 11: "packaging such as paper and string goes into the grey bag beside it". Packaging goes in the grey bag; the green bin holds food scraps, not packaging.',
      },
    },
    {
      number: 15, accepted: ['hall'], evidence: 15,
      explanation: {
        zh: '定位句 15：Stallholders park behind the village hall。停车位置在 village hall 后面；entrance 附近的小车位是留给顾客的，不能填。',
        en: 'Sentence 15: "Stallholders park behind the village hall". The car park is behind the hall; the small lot near the entrance is reserved for shoppers.',
      },
    },
    {
      number: 16, accepted: ['Wednesday'], evidence: 18,
      explanation: {
        zh: '定位句 18：We hold a short stallholders’ meeting every Wednesday morning。every 后面跟星期几；coming weekend 是会议要讨论的时间，不是例会周期。',
        en: 'Sentence 18: "a short stallholders’ meeting every Wednesday morning". Every is followed by the weekday; the coming weekend is what the meeting covers, not the cycle.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：each portion must be served on a clean paper cup or spoon, and the sample tray must be kept behind the stall edge。样品用纸杯或勺、放在摊位内侧，对应 A。B 与句 23 的 cannot hand out pieces directly 相反，C 的共用盘在录音中未出现。',
        en: 'Sentence 22: "each portion must be served on a clean paper cup or spoon, and the sample tray must be kept behind the stall edge", matching A. B contradicts cannot hand out pieces directly in sentence 23, and a shared plate is not mentioned.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Prices must be written on a label beside each item。价格标在摊位每件商品旁的标签上，对应 B。A 的入口大看板只列生产者，C 的口头报价被句 25 否定。',
        en: 'Sentence 25: "Prices must be written on a label beside each item", matching B. The entrance board in A lists producers only, and calling prices out in C is ruled out.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 30,
      explanation: {
        zh: '定位句 30：Anything that remains after closing should be taken home or donated to the community kitchen。未售出生鲜要么带走要么捐给社区厨房，对应 C。A 与句 29 的 must not be given to the council waste bins 相反，B 的卖给回收部门未提及。',
        en: 'Sentence 30: "Anything that remains after closing should be taken home or donated to the community kitchen", matching C. A contradicts must not be given to the council waste bins in sentence 29, and selling it for recycling is not mentioned.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：cars must then move to the hall car park rather than waiting beside the row。卸货后车辆开到 hall 停车场，对应 C。B 与 move to 相反，A 的残疾人车位在句 33 要求始终留空。',
        en: 'Sentence 32: "cars must then move to the hall car park rather than waiting beside the row", matching C. B contradicts move to, and the disabled bay in A must be kept free per sentence 33.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Right, everyone, find a spot near the front and open your notebooks. I’m Naledi, the market coordinator, and I’ll run through the rules before the gates open.' },
    { speaker: 'coordinator', text: 'The market opens to shoppers at eight in the morning and closes at four, and all stalls must be ready half an hour before the first customer walks in.' },
    { speaker: 'coordinator', text: 'Stallholders may unload between six thirty and seven forty-five, and after that the service lane stays closed to vehicles until the end of the day.' },
    { speaker: 'coordinator', text: 'Food safety comes first today.' },
    { speaker: 'coordinator', text: 'Every stallholder must wear a clean apron over their own clothes, and gloves are provided for anyone handling loose bread or fruit.' },
    { speaker: 'coordinator', text: 'Hair must be tied back, and open drinks are not allowed on the preparation table where food is laid out.' },
    { speaker: 'coordinator', text: 'Next, the pricing.' },
    { speaker: 'coordinator', text: 'Every item you sell must carry a clear price label, with the price written in full rather than just marked with a colour dot.' },
    { speaker: 'coordinator', text: 'If you change the price during the morning, update the label straight away, and never leave a customer to ask how much something costs.' },
    { speaker: 'coordinator', text: 'Shoppers like to see where the food comes from, so a small sign with your farm name and region is welcome, but it must not cover the price.' },
    { speaker: 'coordinator', text: 'Now waste and rubbish.' },
    { speaker: 'coordinator', text: 'All food waste goes into the green bin at the end of your row, and packaging such as paper and string goes into the grey bag beside it.' },
    { speaker: 'coordinator', text: 'Please do not mix raw food scraps with the packaging, because the green bin is collected separately by the council.' },
    { speaker: 'coordinator', text: 'Any unsold produce that will not keep must be taken home at the end of the day; it cannot be left for the cleaners to dispose of.' },
    { speaker: 'coordinator', text: 'Parking.' },
    { speaker: 'coordinator', text: 'Stallholders park behind the village hall, through the gate on the west side, and the small car park near the entrance is reserved for shoppers.' },
    { speaker: 'coordinator', text: 'Do not leave your vehicle at the stall after unloading, because the lane must stay clear for trolleys and pushchairs.' },
    { speaker: 'coordinator', text: 'Finally, meetings.' },
    { speaker: 'coordinator', text: 'We hold a short stallholders’ meeting every Wednesday morning, before the market opens, to cover any changes for the coming weekend.' },
    { speaker: 'coordinator', text: 'If you cannot attend, send a message to the coordinator rather than missing it without explanation.' },
    { speaker: 'coordinator', text: 'Now a few points that often come up on the morning itself.' },
    { speaker: 'coordinator', text: 'What about samples for shoppers to taste?' },
    { speaker: 'coordinator', text: 'Tasting samples are allowed, but each portion must be served on a clean paper cup or spoon, and the sample tray must be kept behind the stall edge.' },
    { speaker: 'coordinator', text: 'You cannot hand out pieces directly from your hands, and any leftover samples are thrown away at the end of the morning rather than sold later.' },
    { speaker: 'coordinator', text: 'How should prices be shown?' },
    { speaker: 'coordinator', text: 'Prices must be written on a label beside each item, and you may not quote prices only by calling them out to passers-by.' },
    { speaker: 'coordinator', text: 'The large display board at the entrance lists the main producers, but individual prices still have to be marked on the stall itself.' },
    { speaker: 'coordinator', text: 'What happens to unsold fresh produce at closing time?' },
    { speaker: 'coordinator', text: 'Fresh fruit and bread that cannot be kept overnight may be offered to shoppers at a reduced price in the last hour.' },
    { speaker: 'coordinator', text: 'It must not be given to the council waste bins.' },
    { speaker: 'coordinator', text: 'Anything that remains after closing should be taken home or donated to the community kitchen, which collects from the side gate at four fifteen.' },
    { speaker: 'coordinator', text: 'Where should vehicles be unloaded?' },
    { speaker: 'coordinator', text: 'Unloading happens at the stall itself from the service lane, but cars must then move to the hall car park rather than waiting beside the row.' },
    { speaker: 'coordinator', text: 'The disabled bay near the entrance must be kept free at all times, even for a few minutes while you carry boxes in.' },
    { speaker: 'coordinator', text: 'One last note about payment.' },
    { speaker: 'coordinator', text: 'Card readers are checked by the coordinator before eight, and cash should be kept in the lockable drawer under the table.' },
    { speaker: 'coordinator', text: 'If your reader stops working, tell the coordinator rather than putting up a sign that says cash only.' },
    { speaker: 'coordinator', text: 'Are there any questions before we open?' },
    { speaker: 'coordinator', text: 'Good. Please check your labels and bins once more, and we will open the gates in twenty minutes.' },
  ],
  vocabulary: [
    {
      term: 'coordinator', phonetic: '/kəʊˈɔːdɪneɪtə/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '协调员，统筹人', en: 'the person who organises an event or group' },
      usage: { zh: '可数名词；market coordinator、project coordinator。动词 coordinate。', en: 'Countable: market coordinator. The verb is coordinate.' },
      collocations: ['the market coordinator', 'event coordinator', 'coordinator’s contact'],
      example: { en: 'Speak to the coordinator if your stall needs extra space.', zh: '摊位需要加位置就找协调员。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈdɪ/；开头 /kəʊ/ 是双元音。', en: 'Five syllables with stress on the third; the opening is a diphthong.' },
    },
    {
      term: 'apron', phonetic: '/ˈeɪprən/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '围裙，工作围裙', en: 'a cloth worn over clothes to keep them clean' },
      usage: { zh: '可数名词；厨房、市集、手工场景常见。', en: 'Countable; common in kitchens, markets and craft settings.' },
      collocations: ['a clean apron', 'put on an apron', 'a work apron'],
      example: { en: 'The baker tied a clean apron before serving the bread.', zh: '面包师系好干净围裙才开始卖面包。' },
      listening: { zh: '首音节读 /eɪ/，不是 /æ/；两个音节。', en: 'The first syllable is /eɪ/, not /æ/; two syllables.' },
    },
    {
      term: 'label', phonetic: '/ˈleɪbl/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '标签，价签', en: 'a small card showing the price or product details' },
      usage: { zh: '可数名词；price label、put a label on。动词也指贴标签。', en: 'Countable: price label. It is also a verb meaning to tag.' },
      collocations: ['price label', 'a clear label', 'put a label on'],
      example: { en: 'Every jar has a label with the price and the farm name.', zh: '每个罐子都有价签和农场名。' },
      listening: { zh: '双音节，重音在第一个；结尾 /bl/ 成音节。', en: 'Two syllables with first-syllable stress; /bl/ is syllabic at the end.' },
    },
    {
      term: 'packaging', phonetic: '/ˈpækɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '包装材料', en: 'paper, string, boxes and other material that wraps goods' },
      usage: { zh: '不可数；与 food waste 相对，垃圾分类场景高频。', en: 'Uncountable; contrasts with food waste in sorting scenes.' },
      collocations: ['packaging waste', 'recycle packaging', 'paper packaging'],
      example: { en: 'Keep the packaging separate from the food scraps.', zh: '把包装和食物残渣分开。' },
      listening: { zh: '三个音节，重音在第一个；中间 /kɪ/ 弱读。', en: 'Three syllables with first-syllable stress; /kɪ/ is weak.' },
    },
    {
      term: 'trolleys', phonetic: '/ˈtrɒlɪz/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '手推车，购物推车', en: 'wheeled carts used to carry goods' },
      usage: { zh: '复数；英式 trolleys，美式多称 carts。', en: 'Plural; British trolleys, American carts.' },
      collocations: ['a shopping trolley', 'push a trolley', 'trolleys and pushchairs'],
      example: { en: 'Keep the lane clear so trolleys can pass through.', zh: '通道保持畅通，方便推车通行。' },
      listening: { zh: '两个音节，重音在第一个；-ley 读 /li/。', en: 'Two syllables with first-syllable stress; -ley is /li/.' },
    },
    {
      term: 'samples', phonetic: '/ˈsɑːmplz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '试吃样品，样品', en: 'a small amount of food given for shoppers to taste' },
      usage: { zh: '可数复数；tasting samples、free samples。也可指产品样本。', en: 'Countable plural: tasting samples, free samples. Also means product specimens.' },
      collocations: ['tasting samples', 'free samples', 'hand out samples'],
      example: { en: 'Try a few samples before you buy the jam.', zh: '买果酱前可以先尝几块样品。' },
      listening: { zh: '两个音节，重音在第一个；/mpl/ 辅音串不要漏。', en: 'Two syllables with first-syllable stress; keep the /mpl/ cluster.' },
    },
    {
      term: 'donated', phonetic: '/dəʊˈneɪtɪd/', partOfSpeech: 'v.', sentenceIndex: 30,
      meaning: { zh: '捐赠，捐献（食物给机构）', en: 'given to a charity or community organisation' },
      usage: { zh: '动词 donate 的过去分词；donate food to the kitchen。', en: 'Past participle of donate: donate food to the kitchen.' },
      collocations: ['donated to', 'donate food', 'donated produce'],
      example: { en: 'Unsold bread is donated to the community kitchen.', zh: '卖剩的面包捐给社区厨房。' },
      listening: { zh: '重音在第二音节 /ˈneɪ/；开头 /dəʊ/ 很弱。', en: 'Stress the second syllable; the opening /dəʊ/ is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐项过一遍，说明', en: 'to explain rules or details in order' },
      usage: { zh: '及物短语动词；run through the rules、the schedule。', en: 'Transitive: run through the rules or the schedule.' },
      example: { en: 'I’ll run through the safety rules before the market opens.', zh: '开市前我带大家把安全规则过一遍。' },
    },
    {
      phrase: 'in full', sentenceIndex: 7,
      meaning: { zh: '完整地，全额', en: 'completely, in full detail rather than a shorthand' },
      usage: { zh: 'write the price in full、pay in full。与缩写形式相对。', en: 'Write the price in full, pay in full; the opposite of a shorthand.' },
      example: { en: 'The price must be written in full, not as a dot.', zh: '价格要写全，不能只画圆点。' },
    },
    {
      phrase: 'straight away', sentenceIndex: 8,
      meaning: { zh: '立刻，马上', en: 'immediately, without delay' },
      usage: { zh: '同义 right away；常与 update、replace、call 搭配。', en: 'Synonymous with right away; often with update, replace or call.' },
      example: { en: 'Update the label straight away if the price changes.', zh: '价格一变就立刻更新标签。' },
    },
    {
      phrase: 'come up', sentenceIndex: 20,
      meaning: { zh: '出现，被提到（问题）', en: 'to arise or be raised as a question' },
      usage: { zh: 'sth comes up；疑问、麻烦事常用。', en: 'Something comes up; common for questions and problems.' },
      example: { en: 'These questions often come up on busy mornings.', zh: '忙碌的早上经常有人问这些问题。' },
    },
    {
      phrase: 'kept free', sentenceIndex: 33,
      meaning: { zh: '留空，不让占用', en: 'kept empty for a particular purpose' },
      usage: { zh: '表示某个车位或通道必须保持空置，供特定用途使用，常见于场地与停车规则说明。', en: 'Keep the bay or the lane free, leaving it unoccupied for a specific purpose.' },
      example: { en: 'The disabled bay must be kept free all morning.', zh: '残疾人车位一上午都要留空。' },
    },
    {
      phrase: 'putting up a sign', sentenceIndex: 36,
      meaning: { zh: '贴出告示牌', en: 'to display a written notice' },
      usage: { zh: 'put up a sign saying…；告示、标识场景。', en: 'Put up a sign saying something; used for notices and signs.' },
      example: { en: 'Do not put up a sign without asking the coordinator.', zh: '未经协调员同意不要贴告示。' },
    },
  ],
  tips: [
    {
      title: { zh: '单句里的多个位置要分清', en: 'Separate the locations in one sentence' },
      body: {
        zh: '句 15 同时给了摊主车位和顾客车位（behind the village hall / near the entrance），题 15 问摊主停车。听到并列地点时先在旁边记下归属，落笔前核对题干问的是谁。',
        en: 'Sentence 15 gives both the stallholder lot and the shopper lot, behind the hall and near the entrance, and item 15 asks about stallholders. Note who each place belongs to when you hear the pair, and check the subject before writing.',
      },
    },
    {
      title: { zh: '路标词切分规则段落', en: 'Use signposts to split the rules' },
      body: {
        zh: 'Next, the pricing、Now waste and rubbish、Parking、Finally, meetings 都是段落路标。听到路标就检查当前题号，避免把垃圾分类的袋子填到停车空里。',
        en: 'Next, the pricing; Now waste and rubbish; Parking; Finally, meetings are signposts. Check your current item at each one, so the waste bag does not go into the parking gap.',
      },
    },
    {
      title: { zh: '否定规则反向对应干扰项', en: 'Match negatives against distractors' },
      body: {
        zh: 'cannot hand out directly、may not quote prices、must not be given to bins 都是否定规则。单选干扰项常把否定内容改成允许做法，听到否定词先在旁标注，再排除对应选项。',
        en: 'Cannot hand out directly, may not quote prices and must not be given to bins are negative rules. Distractors often turn these into allowed practices; mark the negative, then rule out the matching option.',
      },
    },
  ],
};
