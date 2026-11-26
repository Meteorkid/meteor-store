import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 43 · Part 2 — 慈善商店志愿者说明（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：收货与四阶段流程（表格 11–14）→ 防盗、班次交接与橱窗频次（单选 15–17）
 * → 各志愿者岗位分别做什么（配对 18–20）。题块顺序与录音一致。
 */
export const test43Part2: ListeningLesson = {
  slug: 'test-43-part-2',
  part: 2,
  status: 'published',
  title: { zh: '慈善商店志愿者说明', en: 'Briefing charity shop volunteers' },
  summary: {
    zh: '店长向志愿者说明慈善商店的运转：衣物与图书的收货定价、两周一次的橱窗更换、Gift Aid 申报流程，以及发现可疑人员、班次交接时各自的做法，并介绍分拣、定价、收银、橱窗、Gift Aid 台和库存室六个岗位。',
    en: 'The shop co-ordinator briefs volunteers on how the charity shop runs: checking clothing and books before pricing, the fortnightly window change, the Gift Aid declaration process, what to do on suspicion of theft and at handover, plus six roles from sorting to stock room.',
  },
  accent: { zh: '讲解者为英式口音。', en: 'The co-ordinator speaks with a British accent.' },
  cast: [
    { id: 'guide', label: 'CO-ORDINATOR', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Item', 'Procedure'],
      rows: [
        { lead: 'Donated clothing', cells: [[{ text: 'check for stains and ' }, { blank: 11 }, { text: ' before pricing' }]] },
        { lead: 'Books', cells: [[{ text: 'price by the ' }, { blank: 12 }, { text: ' of the batch' }]] },
        { lead: 'Window display', cells: [[{ text: 'changed every ' }, { blank: 13 }]] },
        { lead: 'Gift Aid', cells: [[{ text: 'donor fills a short ' }, { blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What should a volunteer do if they suspect shoplifting?',
          options: [
            { key: 'A', text: 'Confront the person gently at the till.' },
            { key: 'B', text: 'Alert the manager without confronting the person.' },
            { key: 'C', text: 'Ask another customer to keep watching.' },
          ],
        },
        {
          number: 16,
          stem: 'What happens at the end of each shift?',
          options: [
            { key: 'A', text: 'The volunteer counts the float alone and leaves by the back door.' },
            { key: 'B', text: 'The volunteer phones the manager with weekly sales figures.' },
            { key: 'C', text: 'The volunteer hands over the stock log and signs the handover sheet.' },
          ],
        },
        {
          number: 17,
          stem: 'How often is the window display changed?',
          options: [
            { key: 'A', text: 'Every two weeks.' },
            { key: 'B', text: 'Once a month.' },
            { key: 'C', text: 'Every Wednesday without exception.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which volunteer role carries out each task? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'Sorting donations' },
        { key: 'B', text: 'Pricing goods' },
        { key: 'C', text: 'Manning the till' },
        { key: 'D', text: 'Arranging the window display' },
        { key: 'E', text: 'Running the Gift Aid desk' },
        { key: 'F', text: 'Working in the stock room' },
      ],
      items: [
        { number: 18, text: 'go through the bags and remove unsuitable items' },
        { number: 19, text: 'put price labels on clean clothing' },
        { number: 20, text: 'explain the declaration to regular donors' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['tears'], evidence: 9,
      explanation: {
        zh: '定位句 9：Remove any stains you can spot, and check for tears before you put the item on a hanger。表格已印 stains and，缺的并列名词就是 tears；破损衣物进回收袋，不能上架。',
        en: 'Sentence 9: "Remove any stains you can spot, and check for tears before you put the item on a hanger". Stains and is already printed, so the parallel noun is tears. Damaged clothing goes to the recycling bag, not the rail.',
      },
    },
    {
      number: 12, accepted: ['size'], evidence: 10,
      explanation: {
        zh: '定位句 10：price according to the size of the batch that already sits on our shelves。空格前是 the，后接 of the batch，填名词 size；condition 在句中是分组依据，不是定价依据。',
        en: 'Sentence 10: "price according to the size of the batch that already sits on our shelves". The gap follows the and precedes of the batch, so the noun size fits. Condition in the sentence is how books are grouped, not the pricing basis.',
      },
    },
    {
      number: 13, accepted: ['two weeks'], evidence: 11,
      explanation: {
        zh: '定位句 11：We change it every two weeks, so regular passers by do not see the same items all month。窗频填 two weeks；句 17 的 Wednesday 是更换当天，不是周期长度。',
        en: 'Sentence 11: "We change it every two weeks, so regular passers by do not see the same items all month". The gap asks for the period, two weeks. Wednesday in sentence 17 is the day chosen for the change, not the cycle length.',
      },
    },
    {
      number: 14, accepted: ['declaration'], evidence: 12,
      explanation: {
        zh: '定位句 12：A donor who has paid tax can fill a short declaration。Gift Aid 流程中填写的短表就是 declaration；句 13 补充表上要写全名和住址。',
        en: 'Sentence 12: "A donor who has paid tax can fill a short declaration". The short form in the Gift Aid process is the declaration. Sentence 13 adds that the full name and home address must appear on it.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：you alert the manager quietly, and she will deal with the situation herself。不与可疑人员正面接触、只通知经理对应 B；A 与句首 We do not confront 相反，C 找顾客盯梢没有出现。',
        en: 'Sentence 15: "you alert the manager quietly, and she will deal with the situation herself". Alerting the manager without confrontation matches B. A contradicts the opening We do not confront, and asking a customer to watch in C is never mentioned.',
      },
    },
    {
      number: 16, accepted: ['C'], evidence: 16,
      explanation: {
        zh: '定位句 16：you hand over the stock log, list any unsold items you noticed, and sign the handover sheet for the next volunteer。交接清单与签字对应 C；A 的单独点款发生在闭店后，B 的电话汇报没有提到。',
        en: 'Sentence 16: "you hand over the stock log, list any unsold items you noticed, and sign the handover sheet for the next volunteer". The stock log and signed sheet match C. Counting the float alone in A happens after closing, and the phone report in B is never mentioned.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：The window display is refreshed every two weeks, usually on a Wednesday morning。每两周对应 A；B 的每月一次与句中 all month 提示不符，C 错在 Wednesday 只是通常那天，并非雷打不动。',
        en: 'Sentence 17: "The window display is refreshed every two weeks, usually on a Wednesday morning". Every two weeks matches A. Monthly in B contradicts the all month clue, and C is wrong because Wednesday is the usual day, not a fixed rule.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Those volunteers go through the bags, remove unsuitable items and leave clean pieces ready for pricing。翻包、挑出不合适物品正是 Sorting donations，对应 A。',
        en: 'Sentence 19: "Those volunteers go through the bags, remove unsuitable items and leave clean pieces ready for pricing". Going through bags and removing unsuitable items matches Sorting donations, A.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：The pricing role sits at the ground floor table, putting price labels on clean clothing。贴价签对应 Pricing goods，即 B。',
        en: 'Sentence 20: "The pricing role sits at the ground floor table, putting price labels on clean clothing". Putting on price labels matches Pricing goods, B.',
      },
    },
    {
      number: 20, accepted: ['E'], evidence: 23,
      explanation: {
        zh: '定位句 23：The Gift Aid desk role speaks to regular donors, explains the declaration and records the details in the special book。向老捐赠人解释申报单对应 Running the Gift Aid desk，即 E。',
        en: 'Sentence 23: "The Gift Aid desk role speaks to regular donors, explains the declaration and records the details in the special book". Explaining the declaration to regular donors matches Running the Gift Aid desk, E.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Before the shop opens this morning, let me run through the volunteer rota and the few rules we follow on the floor.' },
    { speaker: 'guide', text: 'I’m Libby, and I co-ordinate the volunteers here at Mill Street Charity Shop, so come to me with any problem during your shift.' },
    { speaker: 'guide', text: 'The shop sells donated clothing, books, household items and furniture, and all profits go to the local community centre.' },
    { speaker: 'guide', text: 'We will start with how items arrive, and what you do before anything reaches the sales floor.' },
    { speaker: 'guide', text: 'Most donations come in during Saturday morning opening, and a trolley is left by the back door for bags that are too heavy to carry in.' },
    { speaker: 'guide', text: 'When you sort a bag of donated clothing, first check for stains and small tears, because anything damaged should go straight to the recycling bag rather than the rail.' },
    { speaker: 'guide', text: 'For books, we separate hardbacks from paperbacks, and the price depends on the size of the batch we have in stock.' },
    { speaker: 'guide', text: 'Clean undamaged items are then priced on the ground floor, where each volunteer has a pricing sheet and a set of coloured stickers.' },
    { speaker: 'guide', text: 'Now let’s look at the four main stages, so that you know what to record during your shift.' },
    { speaker: 'guide', text: 'The first stage is clothing preparation. Remove any stains you can spot, and check for tears before you put the item on a hanger.' },
    { speaker: 'guide', text: 'The second stage covers books. Group them by condition, and price according to the size of the batch that already sits on our shelves.' },
    { speaker: 'guide', text: 'The third stage is the window display. We change it every two weeks, so regular passers by do not see the same items all month.' },
    { speaker: 'guide', text: 'The fourth stage is the Gift Aid scheme. A donor who has paid tax can fill a short declaration, and the shop then claims back the tax on the sale.' },
    { speaker: 'guide', text: 'Please read the declaration carefully with the donor, because the form must show their full name and home address correctly.' },
    { speaker: 'guide', text: 'Now, a few rules that keep the shop safe and honest.' },
    { speaker: 'guide', text: 'We do not confront anyone suspected of taking goods. If you notice anything unusual, you alert the manager quietly, and she will deal with the situation herself.' },
    { speaker: 'guide', text: 'At the end of each shift, you hand over the stock log, list any unsold items you noticed, and sign the handover sheet for the next volunteer.' },
    { speaker: 'guide', text: 'The window display is refreshed every two weeks, usually on a Wednesday morning, and volunteers who enjoy arranging things can put their name down on the rota.' },
    { speaker: 'guide', text: 'Let me explain what each volunteer role actually does around the shop floor.' },
    { speaker: 'guide', text: 'The first role covers sorting. Those volunteers go through the bags, remove unsuitable items and leave clean pieces ready for pricing.' },
    { speaker: 'guide', text: 'The pricing role sits at the ground floor table, putting price labels on clean clothing and checking the prices against the sheet.' },
    { speaker: 'guide', text: 'The till role greets customers, takes payment and issues a receipt, and volunteers in this role also answer simple questions about opening times.' },
    { speaker: 'guide', text: 'The display role handles the window and the front shelf, moving older pieces out and bringing forward the brighter newer donations.' },
    { speaker: 'guide', text: 'The Gift Aid desk role speaks to regular donors, explains the declaration and records the details in the special book behind the counter.' },
    { speaker: 'guide', text: 'The stock room role keeps spare items on the shelves, folds bags of clean stock and carries heavier furniture out to the display area.' },
    { speaker: 'guide', text: 'A volunteer may move between roles during the day, and no role is senior to another.' },
    { speaker: 'guide', text: 'Before I finish, let me cover a few practical points.' },
    { speaker: 'guide', text: 'The volunteer room is behind the till, where you can leave coats and have a cup of tea during the quiet period after lunch.' },
    { speaker: 'guide', text: 'Volunteers wear the plain navy apron hung by the back door, and name badges sit in the drawer below the pricing table.' },
    { speaker: 'guide', text: 'If a customer asks about a donation you cannot value, do not guess a price. Mark the item and ask the manager to look at it later.' },
    { speaker: 'guide', text: 'Children are welcome in the shop, but they must stay with an adult, and we ask that volunteers do not leave the till unattended.' },
    { speaker: 'guide', text: 'Lost property goes in the labelled box under the sink, and any money found on the floor must be handed to the manager, not kept aside.' },
    { speaker: 'guide', text: 'We hold a short volunteer meeting on the first Tuesday of each month, where we review sales patterns and plan the next display theme.' },
    { speaker: 'guide', text: 'Feedback about the rota or the shop layout can be written in the book beside the volunteer room door.' },
    { speaker: 'guide', text: 'On cold days the back door stays open to let air in, but please close it once the delivery trolley has been moved through.' },
    { speaker: 'guide', text: 'If you feel tired during a long shift, take a five minute break in the volunteer room rather than working through it alone.' },
    { speaker: 'guide', text: 'The shop closes at half past four, and the last half hour is spent tidying the rails and counting the float with the manager.' },
    { speaker: 'guide', text: 'After closing, return all pricing sheets to the drawer, and leave any unresolved questions written on the handover sheet.' },
    { speaker: 'guide', text: 'That covers the main points. Is there anything you would like to ask before we open?' },
    { speaker: 'guide', text: 'One reminder before I go. Respect every donation, however ordinary it looks, because the buyer who needs it may be walking past this afternoon.' },
    { speaker: 'guide', text: 'Right, let’s put the aprons on, and I will show each of you to your first station.' },
  ],
  vocabulary: [
    {
      term: 'stains', phonetic: '/steɪnz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '污渍，斑痕（衣物上的脏印）', en: 'marks left by dirt or food on clothing that are hard to wash out' },
      usage: { zh: '可数名词复数；remove stains、food stains。动词 stain 表示“弄脏”。', en: 'Countable plural: remove stains, food stains. The verb stain means to mark with dirt.' },
      collocations: ['remove stains', 'coffee stains', 'visible stains'],
      example: { en: 'Check the inside seams for stains before you price the jacket.', zh: '定价前检查夹克内侧缝线处有没有污渍。' },
      listening: { zh: '单音节，结尾 /z/ 浊辅音，不要漏听成 stain。', en: 'One syllable with a final /z/; do not miss it and hear stain.' },
    },
    {
      term: 'tears', phonetic: '/teəz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '破损，裂口（衣物的撕裂处）', en: 'rips or holes in fabric where the cloth has split' },
      usage: { zh: '可数名词复数；a tear in the sleeve。注意 tear 作“眼泪”时读 /tɪəz/。', en: 'Countable plural: a tear in the sleeve. Meaning tears as eye fluid is pronounced /tɪəz/.' },
      collocations: ['check for tears', 'a tear in the fabric', 'small tears'],
      example: { en: 'Any garment with a large tear goes straight to recycling.', zh: '有大口子的衣物直接进回收袋。' },
      listening: { zh: '表示裂口时与 hairs 押韵；靠上下文区分“眼泪”义。', en: 'The fabric sense rhymes with hairs; use context to avoid the eye-fluid sense.' },
    },
    {
      term: 'batch', phonetic: '/bætʃ/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '一批（同类库存物品）', en: 'a group of similar items kept together in stock' },
      usage: { zh: '可数名词；a batch of books、the size of the batch。', en: 'Countable: a batch of books, the size of the batch.' },
      collocations: ['a batch of donations', 'the whole batch', 'a fresh batch'],
      example: { en: 'We price the books according to how large the batch is.', zh: '我们按这批书的数量来定价。' },
      listening: { zh: '与 catch 押韵，短元音 /æ/，结尾 /tʃ/。', en: 'Rhymes with catch, short vowel /æ/, ending in /tʃ/.' },
    },
    {
      term: 'display', phonetic: '/dɪˈspleɪ/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '陈列，橱窗展示', en: 'the arrangement of goods where customers first see them' },
      usage: { zh: '可数名词；window display、change the display。同形动词也表示“展示”。', en: 'Countable: window display, change the display. The same form is a verb.' },
      collocations: ['the window display', 'refresh the display', 'a display theme'],
      example: { en: 'The front window display shows the brighter newer donations first.', zh: '前橱窗最先摆上颜色鲜亮的新捐品。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈspleɪ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'declaration', phonetic: '/ˌdekləˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '申报单（Gift Aid 捐赠人签署的税务声明）', en: 'the signed form that lets a charity claim tax back on a donation' },
      usage: { zh: '可数名词；fill a declaration、sign the declaration。动词 declare。', en: 'Countable: fill a declaration, sign the declaration. The verb is declare.' },
      collocations: ['a Gift Aid declaration', 'sign the declaration', 'the declaration form'],
      example: { en: 'The donor reads the declaration before they put their name on it.', zh: '捐赠人在签名前先读完申报单。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈreɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'handover', phonetic: '/ˈhændəʊvə/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '交接（班次之间把工作移交给下一位）', en: 'the passing of information and duties from one worker to the next' },
      usage: { zh: '可数名词；handover sheet、at the handover。动词短语是 hand over。', en: 'Countable: handover sheet, at the handover. The verb phrase is hand over.' },
      collocations: ['the handover sheet', 'at shift handover', 'a smooth handover'],
      example: { en: 'Write unresolved questions on the handover sheet before you leave.', zh: '离岗前把未解决的问题写在交接单上。' },
      listening: { zh: '复合词，重音在第一部分，第二部分 /əʊvə/ 轻读。', en: 'Compound stressed on the first part, with the second /əʊvə/ reduced.' },
    },
    {
      term: 'sorting', phonetic: '/ˈsɔːtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '分拣，分类（把捐赠物按可否上架分开）', en: 'the work of separating donations into clean items and unsuitable ones' },
      usage: { zh: '不可数；sorting role、the sorting area。动词 sort 的现在分词。', en: 'Uncountable: sorting role, the sorting area. It is the present participle of sort.' },
      collocations: ['the sorting role', 'sorting donations', 'sorting area'],
      example: { en: 'Sorting happens at the back door before items reach the floor.', zh: '分拣在后门完成，物品随后才上架。' },
      listening: { zh: '双音节，重音在第一音节，结尾 /ɪŋ/ 不要漏成 /ɪn/。', en: 'Two syllables stressed first; do not reduce /ɪŋ/ to /ɪn/.' },
    },
    {
      term: 'receipt', phonetic: '/rɪˈsiːt/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '收据，小票', en: 'the paper record given after a customer pays' },
      usage: { zh: '可数名词；issue a receipt、keep the receipt。字母 p 不发音。', en: 'Countable: issue a receipt, keep the receipt. The letter p is silent.' },
      collocations: ['issue a receipt', 'a till receipt', 'keep the receipt'],
      example: { en: 'The till volunteer gives every buyer a printed receipt.', zh: '收银岗给每位顾客打印小票。' },
      listening: { zh: '重音在第二音节 /ˈsiːt/，开头 p 不发音。', en: 'Stress the second syllable; the p at the start is silent.' },
    },
  ],
  expressions: [
    {
      phrase: 'sort a bag', sentenceIndex: 5,
      meaning: { zh: '分拣一袋捐赠物', en: 'to open a bag and divide its contents into suitable and unsuitable items' },
      usage: { zh: '及物；sort a bag of clothing、sort through the donations。', en: 'Transitive: sort a bag of clothing, sort through the donations.' },
      example: { en: 'Volunteers sort a bag of donations before anything reaches the rail.', zh: '物品上架前志愿者先分拣一袋捐赠物。' },
    },
    {
      phrase: 'straight to', sentenceIndex: 5,
      meaning: { zh: '直接送往（某处），不经过中间环节', en: 'directly toward a place, without being displayed or priced first' },
      usage: { zh: 'go straight to the recycling bag；straight 是副词。', en: 'go straight to the recycling bag; straight acts as an adverb here.' },
      example: { en: 'Damaged clothing goes straight to the recycling bag behind the door.', zh: '破损衣物直接送到后门的回收袋。' },
    },
    {
      phrase: 'go through', sentenceIndex: 19,
      meaning: { zh: '逐一翻看，仔细检查（袋子或物品）', en: 'to examine each item in a bag one by one' },
      usage: { zh: '及物短语动词；go through the bags、go through the stock。', en: 'Transitive phrasal verb: go through the bags, go through the stock.' },
      example: { en: 'The sorting volunteers go through every bag before pricing starts.', zh: '定价开始前分拣志愿者逐包翻看。' },
    },
    {
      phrase: 'put their name down', sentenceIndex: 17,
      meaning: { zh: '报名，登记自己的名字', en: 'to add one’s name to a list for a particular role or shift' },
      usage: { zh: 'put your name down for something；同义的 sign up 更口语。', en: 'put your name down for something; sign up is a close colloquial equivalent.' },
      example: { en: 'Volunteers can put their name down for the display role on the rota.', zh: '志愿者可以在排班表上报名橱窗岗。' },
    },
    {
      phrase: 'deal with', sentenceIndex: 15,
      meaning: { zh: '处理，应对（问题或情况）', en: 'to take action to manage a situation, especially an awkward one' },
      usage: { zh: '及物；deal with the situation、deal with a complaint。', en: 'Transitive: deal with the situation, deal with a complaint.' },
      example: { en: 'The manager will deal with any difficult customer herself.', zh: '经理会亲自应对难缠的顾客。' },
    },
    {
      phrase: 'stay with', sentenceIndex: 30,
      meaning: { zh: '留在……身边，不分开', en: 'to remain beside someone, especially a child in a public place' },
      usage: { zh: 'stay with an adult；另有“继续参加”之义。', en: 'stay with an adult; it also means to continue attending.' },
      example: { en: 'Children must stay with an adult anywhere in the charity shop.', zh: '儿童在慈善商店任何区域都须有成人陪同。' },
    },
    {
      phrase: 'take a five minute break', sentenceIndex: 35,
      meaning: { zh: '休息五分钟', en: 'to stop working briefly for a short rest' },
      usage: { zh: 'take a break 后接时长；five minute 作定语时 minute 用单数。', en: 'take a break followed by a duration; minute stays singular in the five minute modifier.' },
      example: { en: 'A tired volunteer should take a five minute break in the back room.', zh: '感到疲惫的志愿者应在后屋休息五分钟。' },
    },
  ],
  tips: [
    {
      title: { zh: '用流程词跟上独白题块', en: 'Follow the stage words' },
      body: {
        zh: 'Part 2 没有人提示下一题。The first stage、The second、The third、The fourth 对应表格四行；Now, a few rules 进入单选；Let me explain each role 进入配对。听到这类信号词就检查当前题块。',
        en: 'Nobody introduces the next item in a monologue. The first stage, The second, The third and The fourth map to the four table rows; Now, a few rules opens the single-choice block; Let me explain each role opens the matching block. Check your place on each signal.',
      },
    },
    {
      title: { zh: '配对题先记岗位动词', en: 'Keep one verb per role option' },
      body: {
        zh: '六个岗位选项较长，听前各记一个动作：sort、price、greet、arrange、explain、carry。听到任务描述时拿动作去对岗位，不要整句翻译选项。',
        en: 'The six role options are long. Note one verb per option before listening: sort, price, greet, arrange, explain, carry. Match the verb in the task to the role instead of translating whole options.',
      },
    },
    {
      title: { zh: '分清“准备动作”和“禁止行为”', en: 'Preparation versus rejected items' },
      body: {
        zh: '表格考上架前怎么做：check、price、change、fill。句 5 的 damaged clothing 进回收袋、句 30 的无人看管收银台都是规则约束，不能填进流程空格。落笔前确认空格要的是动作还是名词。',
        en: 'The table asks what happens before sale: check, price, change, fill. Damaged clothing in sentence 5 and the unattended till in sentence 30 are rules and exclusions, not procedure gaps. Confirm whether the gap needs an action or a noun before writing.',
      },
    },
  ],
};
