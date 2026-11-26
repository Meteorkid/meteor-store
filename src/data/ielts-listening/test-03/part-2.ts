import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 3 · Part 2 — 回收中心参观导览（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：参观规则 → 四类可回收物的投放准备（表格 11–14）→ 常见错误投放（单选 15–17）
 * → 分拣大厅里各物料的去向（配对 18–20）。题块顺序与录音一致。
 */
export const test03Part2: ListeningLesson = {
  slug: 'test-03-part-2',
  part: 2,
  status: 'published',
  title: { zh: '回收中心参观导览', en: 'A tour of the recycling centre' },
  summary: {
    zh: '讲解员在参观前介绍回收中心的运转方式、四类可回收物的投放要求、最常见的错误投放，以及分拣大厅里纸张、玻璃和厨余垃圾最终分别变成什么。',
    en: 'A guide briefs her group before the tour: how the centre works, what households must do for four recyclable materials, the most common sorting mistakes, and where paper, glass and food waste end up on the sorting lines.',
  },
  accent: { zh: '讲解员为英式口音。', en: 'The guide speaks with a British accent.' },
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Material', 'Preparation', 'Bin'],
      rows: [
        { lead: 'Paper', cells: [[{ text: 'remove any ' }, { blank: 11 }], [{ text: 'blue' }]] },
        { lead: 'Glass', cells: [[{ text: 'rinse; remove the ' }, { blank: 12 }], [{ text: 'green' }]] },
        { lead: 'Plastic', cells: [[{ text: 'squash ' }, { blank: 13 }, { text: ' flat' }], [{ text: 'yellow' }]] },
        { lead: { blank: 14 }, cells: [[{ text: 'mix with garden material' }], [{ text: 'brown' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What is the most common sorting mistake?',
          options: [
            { key: 'A', text: 'Putting greasy pizza boxes in the paper bin.' },
            { key: 'B', text: 'Dropping plastic bags of mixed rubbish into the recycling bins.' },
            { key: 'C', text: 'Leaving batteries on the conveyor belt.' },
          ],
        },
        {
          number: 16,
          stem: 'What should people do with batteries and electrical items?',
          options: [
            { key: 'A', text: 'Put them in the general waste bin.' },
            { key: 'B', text: 'Take them to the special collection point near the gate.' },
            { key: 'C', text: 'Leave them beside the non-recyclable skip.' },
          ],
        },
        {
          number: 17,
          stem: 'Why does the centre try to keep the landfill pile small?',
          options: [
            { key: 'A', text: 'Landfill is costly and releases a powerful greenhouse gas.' },
            { key: 'B', text: 'The lorries are too small to carry heavy loads.' },
            { key: 'C', text: 'Neighbours complain about the smell from the site.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What happens to each material after sorting? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'It is crushed and melted into new containers.' },
        { key: 'B', text: 'It is pulped and made into cardboard or paper.' },
        { key: 'C', text: 'It rots in bays and becomes compost.' },
        { key: 'D', text: 'It is exported to another country for processing.' },
        { key: 'E', text: 'It is burned to produce electricity.' },
        { key: 'F', text: 'It is stored until the next collection day.' },
      ],
      items: [
        { number: 18, text: 'the paper' },
        { number: 19, text: 'the glass' },
        { number: 20, text: 'the food waste' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['plastic wrapping'], evidence: 12,
      explanation: {
        zh: '定位句 12：remove any plastic wrapping, because that contaminates the whole bag。表格 Preparation 列已印 remove any，缺的就是包装材料；被污染的整袋纸张才是问题所在。',
        en: 'Sentence 12: "remove any plastic wrapping, because that contaminates the whole bag". Remove any is already printed, so the missing item is the wrapping. A contaminated bag is what the warning is about.',
      },
    },
    {
      number: 12, accepted: ['lids'], evidence: 14,
      explanation: {
        zh: '定位句 14：the lids and caps should be removed, because metal and glass are processed separately。标准答案写 lids 即可；caps 与 lids 同义，也可接受。',
        en: 'Sentence 14: "the lids and caps should be removed, because metal and glass are processed separately". Lids is the standard answer; caps is an accepted synonym.',
      },
    },
    {
      number: 13, accepted: ['bottles'], evidence: 17,
      explanation: {
        zh: '定位句 17：Plastic bottles should be squashed flat to save space。表格已印 squash 和 flat，缺的是被压扁的对象；tubbs 和 trays 不需要压扁，是干扰项。',
        en: 'Sentence 17: "Plastic bottles should be squashed flat to save space". Squash and flat are printed, so the missing object is bottles. Tubs and trays are not the items that are squashed.',
      },
    },
    {
      number: 14, accepted: ['food waste'], evidence: 19,
      explanation: {
        zh: '定位句 19：Finally, food waste. Anything that was once alive, including vegetable peelings, tea bags and leftover bread, goes into the brown bin。首列是物料名，brown 桶已给出；cooking oil 在句 20 被排除，不能填。',
        en: 'Sentence 19: "Finally, food waste. Anything that was once alive, including vegetable peelings, tea bags and leftover bread, goes into the brown bin.". The first column is the material and brown is printed. Cooking oil is rejected in sentence 20, so it cannot be the answer.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The single most common error is putting plastic bags full of mixed rubbish into the recycling bins。greasy pizza boxes 是第二常见问题（句 24），batteries 是第三类（句 25），都不是最常见的。',
        en: 'Sentence 22: "The single most common error is putting plastic bags full of mixed rubbish into the recycling bins". Greasy pizza boxes are the second problem in sentence 24 and batteries the third in sentence 25; neither is the most common.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：they must be taken to the special collection point near the main gate。A 错在电池在分拣线上很危险，不能进普通垃圾桶；C 错在它们不属于不可回收物堆放区。',
        en: 'Sentence 25: "they must be taken to the special collection point near the main gate". A is wrong because batteries are dangerous on the line, and C is wrong because they do not belong beside the non-recyclable skip.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：We keep this pile small, because landfill costs a lot and produces methane, a powerful greenhouse gas。expensive 对应 costly，methane 是强效温室气体；C 提到的气味在句 38 说的是堆肥区，不是填埋场。',
        en: 'Sentence 31: "landfill costs a lot and produces methane, a powerful greenhouse gas". Expensive matches costly, and methane is the gas. The smell in option C belongs to the compost bay in sentence 38, not the landfill.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：At the mill the paper is pulped into new cardboard and office paper, and clean dry paper returns to use within months。pulped 对应选项 B；E（焚烧发电）和 D（出口加工）在讲解中从未出现。',
        en: 'Sentence 35: "At the mill the paper is pulped into new cardboard and office paper". Pulped matches option B. Burning for electricity in E and export in D are never mentioned.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：The glass is sent to its own line, where it is crushed into small pieces and melted down to make new bottles and jars。crushed and melted 与 A 完全对应，new bottles and jars 即 new containers。',
        en: 'Sentence 36: "The glass is sent to its own line, where it is crushed into small pieces and melted down to make new bottles and jars.". Crushed and melted match A word for word, and bottles and jars are containers.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：The food waste rots in these bays and becomes compost。rots in bays 与 C 对应；句 32 的 six months 是腐熟周期，不是去向。',
        en: 'Sentence 33: "The food waste rots in these bays and becomes compost". Rots in bays matches C. The six months in sentence 32 is the maturing period, not the destination.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Mind the step as we come in, everyone. I’m Libby, and I’ll be your guide for the next hour at the Northgate Recycling Centre.' },
    { speaker: 'guide', text: 'Before we walk onto the floor, let me explain how the centre works, and then we’ll look at the main sorting areas together.' },
    { speaker: 'guide', text: 'The centre handles about forty thousand tonnes of household waste each year, and half is sorted here for reuse.' },
    { speaker: 'guide', text: 'The rest goes either to composting or, in a small number of cases, to landfill.' },
    { speaker: 'guide', text: 'First, a few practical rules for today’s tour.' },
    { speaker: 'guide', text: 'You must stay with the group at all times, and you should keep to the marked walkways, because forklifts move around the yard.' },
    { speaker: 'guide', text: 'Please wear the high-visibility jackets you were given at the entrance, and keep your hands clear of any machinery.' },
    { speaker: 'guide', text: 'Photography is allowed in the visitor gallery, but not on the sorting floor itself, for safety and for privacy reasons.' },
    { speaker: 'guide', text: 'If you have small children with you, please keep them beside you throughout the visit.' },
    { speaker: 'guide', text: 'Now, let’s start with the four main materials that arrive here, and what we ask households to do before putting them out.' },
    { speaker: 'guide', text: 'The first is paper. This includes newspapers, magazines, envelopes and junk mail.' },
    { speaker: 'guide', text: 'The important rule is that paper must be kept dry. If it gets soaked, it sticks together and cannot be pulped properly.' },
    { speaker: 'guide', text: 'Before you put it in the blue bin, remove any plastic wrapping, because that contaminates the whole bag.' },
    { speaker: 'guide', text: 'Next, glass. We collect bottles and jars in the green bin.' },
    { speaker: 'guide', text: 'Glass should be rinsed out before it is brought here, and the lids and caps should be removed, because metal and glass are processed separately.' },
    { speaker: 'guide', text: 'Broken glass is accepted, but please wrap it in newspaper so that nobody cuts their hands.' },
    { speaker: 'guide', text: 'The third material is plastic. Most households bring bottles, tubs and food trays in the yellow bin.' },
    { speaker: 'guide', text: 'Plastic bottles should be squashed flat to save space, and the labels can stay on, because they are removed during washing.' },
    { speaker: 'guide', text: 'Not every kind of plastic can be accepted here. Thin carrier bags and film wrap go to a separate collection point, because they jam the sorting machines.' },
    { speaker: 'guide', text: 'Finally, food waste. Anything that was once alive, including vegetable peelings, tea bags and leftover bread, goes into the brown bin.' },
    { speaker: 'guide', text: 'We do not accept cooking oil in this bin, because it slows down the composting process and attracts pests.' },
    { speaker: 'guide', text: 'Now, let’s talk about the mistakes we see most often, because these are the things that slow the whole process down.' },
    { speaker: 'guide', text: 'The single most common error is putting plastic bags full of mixed rubbish into the recycling bins.' },
    { speaker: 'guide', text: 'Once a bag reaches the conveyor, it is opened by hand, and dirty contents may get the whole batch rejected.' },
    { speaker: 'guide', text: 'The second most frequent problem is greasy pizza boxes or paper covered in food. Paper like that cannot be recycled, and it should go in the general waste bin.' },
    { speaker: 'guide', text: 'Third, people often bring batteries and electrical items to the centre. These are dangerous on the sorting line, and they must be taken to the special collection point near the main gate.' },
    { speaker: 'guide', text: 'Now, if you look through the glass ahead of you, you can see the main sorting hall.' },
    { speaker: 'guide', text: 'The waste arrives in trucks and is tipped onto a long conveyor belt, which carries it past the first set of workers.' },
    { speaker: 'guide', text: 'Those workers remove anything unsuitable, such as bags, wood and large metal pieces.' },
    { speaker: 'guide', text: 'After that, machines sort the material by size and by weight, and magnets pull out any remaining metal.' },
    { speaker: 'guide', text: 'The last area on our route is the non-recyclable skip. Anything that cannot be processed here is loaded into lorries and taken to landfill.' },
    { speaker: 'guide', text: 'We keep this pile small, because landfill costs a lot and produces methane, a powerful greenhouse gas.' },
    { speaker: 'guide', text: 'Over on your left is the compost bay, where the food and garden waste breaks down over a period of about six months.' },
    { speaker: 'guide', text: 'The food waste rots in these bays and becomes compost, which local farms and gardens collect once it has matured.' },
    { speaker: 'guide', text: 'The paper travels along one belt to the baling area, where it is pressed into large blocks ready for the paper mill.' },
    { speaker: 'guide', text: 'At the mill the paper is pulped into new cardboard and office paper, and clean dry paper returns to use within months.' },
    { speaker: 'guide', text: 'The glass is sent to its own line, where it is crushed into small pieces and melted down to make new bottles and jars.' },
    { speaker: 'guide', text: 'The plastic has its own line, because it needs lower temperatures and different treatments.' },
    { speaker: 'guide', text: 'You’ll notice the air near the compost bay is earthy, but it is not unpleasant, and the smell fades as the material matures.' },
    { speaker: 'guide', text: 'Before we finish, let me answer the question I’m asked most often. Does recycling actually make a difference?' },
    { speaker: 'guide', text: 'The answer is yes, but only if the material arrives clean, dry and sorted correctly.' },
    { speaker: 'guide', text: 'One dirty pizza box can spoil a whole batch, so small steps at home really do matter.' },
    { speaker: 'guide', text: 'After the tour, a gallery display shows what each material becomes, and you can collect a leaflet on local collection days.' },
    { speaker: 'guide', text: 'If you have any questions, please ask them now, and then we’ll walk through the visitor gallery together.' },
    { speaker: 'guide', text: 'One more safety note. The walkway ahead has a slight slope, so please watch your step.' },
    { speaker: 'guide', text: 'Right, shall we set off?' },
  ],
  vocabulary: [
    {
      term: 'tonnes', phonetic: '/tʌnz/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '公吨（重量单位）', en: 'a metric unit of weight, equal to one thousand kilograms' },
      usage: { zh: '英式拼写 tonne，美式常写 ton；计量单位在听力讲座里高频出现。', en: 'British spelling tonne, American often ton; a common unit in talks about quantities.' },
      collocations: ['forty thousand tonnes', 'a tonne of waste', 'tonnes per year'],
      example: { en: 'The plant processes three hundred tonnes of material each week.', zh: '这座工厂每周处理三百公吨物料。' },
      listening: { zh: '结尾的 /z/ 很轻，不要漏听成 ton。', en: 'The final /z/ is soft; do not miss it and hear ton instead.' },
    },
    {
      term: 'contaminates', phonetic: '/kənˈtæmɪneɪts/', partOfSpeech: 'v.', sentenceIndex: 12,
      meaning: { zh: '污染，混入杂质使整批不能用', en: 'makes something unclean or impure, so a whole batch cannot be reused' },
      usage: { zh: '及物动词；主语常是脏物、液体、错误投放。名词是 contamination。', en: 'Transitive; the subject is dirt, liquid or wrong waste. The noun is contamination.' },
      collocations: ['contaminate the whole batch', 'contaminated paper', 'food contamination'],
      example: { en: 'A greasy wrapper can contaminate a bag of clean paper.', zh: '一张油腻的包装纸会污染整袋干净纸张。' },
      listening: { zh: '重音在第二音节 /ˈtæm/，三个音节尾音是 /neɪts/。', en: 'Stress the second syllable and listen for the /neɪts/ ending.' },
    },
    {
      term: 'rinsed', phonetic: '/rɪnst/', partOfSpeech: 'v.', sentenceIndex: 14,
      meaning: { zh: '冲洗，涮洗', en: 'washed quickly with clean water to remove leftover food' },
      usage: { zh: 'be rinsed out；餐具、回收瓶罐场景高频。', en: 'be rinsed out; common with dishes and recyclable bottles.' },
      collocations: ['rinse out the bottle', 'rinse before recycling', 'rinsed clean'],
      example: { en: 'Rinse the jar out before putting it in the green bin.', zh: '把罐子涮洗干净再放进绿色桶。' },
      listening: { zh: '单音节，/nst/ 三个辅音连在一起，不要漏掉 /n/。', en: 'One syllable with an /nst/ cluster; do not drop the /n/.' },
    },
    {
      term: 'squashed', phonetic: '/skwɒʃt/', partOfSpeech: 'v.', sentenceIndex: 17,
      meaning: { zh: '压扁，挤扁', en: 'pressed flat to take up less space' },
      usage: { zh: '及物动词；squash flat、squash the bottle。名词 squash 也指“果汁饮料”。', en: 'Transitive: squash flat, squash the bottle. As a noun it can mean fruit cordial.' },
      collocations: ['squash the bottle flat', 'squash the packaging'],
      example: { en: 'Squash the plastic bottle before you recycle it.', zh: '回收前把塑料瓶压扁。' },
      listening: { zh: '开头 /skw/ 辅音丛要读清楚，结尾 /ʃt/ 不要丢。', en: 'Listen for the /skw/ cluster and the /ʃt/ ending.' },
    },
    {
      term: 'conveyor', phonetic: '/kənˈveɪə/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '传送带，输送机', en: 'a moving belt that carries material from one place to another' },
      usage: { zh: '常见搭配 conveyor belt；工厂、分拣线场景的核心词。', en: 'Usually conveyor belt; a key word in factory and sorting-line talks.' },
      collocations: ['on the conveyor', 'a conveyor belt', 'move along the conveyor'],
      example: { en: 'The cans travel along the conveyor to the washing station.', zh: '罐头沿传送带送到清洗工位。' },
      listening: { zh: '重音在第二音节 /ˈveɪ/，结尾 /ə/ 轻读。', en: 'Stress the second syllable and reduce the final /ə/.' },
    },
    {
      term: 'batch', phonetic: '/bætʃ/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '一批（同批处理的物料）', en: 'a group of materials processed together at the same time' },
      usage: { zh: '可数名词；a whole batch、the next batch。食品与工厂场景都常见。', en: 'Countable: a whole batch, the next batch. Common in food and factory contexts.' },
      collocations: ['a whole batch', 'reject the batch', 'a fresh batch'],
      example: { en: 'One rotten apple can spoil the whole batch.', zh: '一颗烂苹果会坏了整批货。' },
      listening: { zh: '与 catch 押韵，元音是短元音 /æ/。', en: 'It rhymes with catch and has the short vowel /æ/.' },
    },
    {
      term: 'pulped', phonetic: '/pʌlpt/', partOfSpeech: 'v.', sentenceIndex: 35,
      meaning: { zh: '制成纸浆', en: 'crushed and soaked into a soft wet mass for making paper' },
      usage: { zh: '被动 be pulped；名词 pulp 指纸浆、果肉。', en: 'Passive be pulped; the noun pulp is paper pulp or fruit flesh.' },
      collocations: ['the paper is pulped', 'wood pulp', 'pulped fibre'],
      example: { en: 'Old newspaper is pulped and turned into cardboard.', zh: '旧报纸被打成纸浆再做成纸板。' },
      listening: { zh: '单音节，/lp/ 辅音丛后接 /t/，不要多加元音。', en: 'One syllable; do not add a vowel after the /lp/ cluster.' },
    },
    {
      term: 'compost', phonetic: '/ˈkɒmpɒst/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '堆肥，腐熟肥料', en: 'decayed plant material used to feed soil in gardens and farms' },
      usage: { zh: '不可数；名词 compost，动词 compost（堆肥处理）。', en: 'Uncountable as a noun; the verb compost means to treat as compost.' },
      collocations: ['become compost', 'compost bay', 'garden compost'],
      example: { en: 'The peelings go on the heap to make compost.', zh: '果皮菜叶堆到肥堆上制成堆肥。' },
      listening: { zh: '重音在第一音节，结尾是 /st/。', en: 'Stress the first syllable and listen for the /st/ ending.' },
    },
  ],
  expressions: [
    {
      phrase: 'keep to', sentenceIndex: 5,
      meaning: { zh: '保持在……之内；遵守', en: 'to stay within a marked route or follow a rule' },
      usage: { zh: 'keep to the walkways、keep to the rules；与 Part 1 的 keep to 同义。', en: 'keep to the walkways or the rules, same as in Part 1.' },
      example: { en: 'Please keep to the path until you reach the bridge.', zh: '请沿小路走，直到上桥。' },
    },
    {
      phrase: 'clear of', sentenceIndex: 6,
      meaning: { zh: '远离，不碰到', en: 'not touching or close to something dangerous' },
      usage: { zh: 'keep hands clear of the machinery；反义词是 close to。', en: 'keep hands clear of the machinery; the opposite is close to.' },
      example: { en: 'Keep children clear of the electric doors.', zh: '让孩子远离电动门。' },
    },
    {
      phrase: 'jam the sorting machines', sentenceIndex: 18,
      meaning: { zh: '卡住机器，使设备堵塞', en: 'block a machine so that it stops working' },
      usage: { zh: 'jam 作动词表示“卡住”；名词 jam 是果酱或拥堵。', en: 'Jam as a verb means to block; the noun means jam or a traffic jam.' },
      example: { en: 'Thin plastic bags jam the sorting belts.', zh: '薄塑料袋会卡住分拣皮带。' },
    },
    {
      phrase: 'on the sorting line', sentenceIndex: 25,
      meaning: { zh: '在分拣流水线上', en: 'on the production line where waste is separated' },
      usage: { zh: 'line 在这里指流水线；on the line 也可指“在电话线上”。', en: 'Line means production line here; on the line can also mean on the phone.' },
      example: { en: 'Anything sharp must not appear on the sorting line.', zh: '尖锐物品不能出现在分拣线上。' },
    },
    {
      phrase: 'tipped onto', sentenceIndex: 27,
      meaning: { zh: '倾倒到……上', en: 'to empty a load of material onto a surface' },
      usage: { zh: '被动 be tipped onto；货物、垃圾场景常用。', en: 'Passive be tipped onto; common with cargo and waste.' },
      example: { en: 'The soil is tipped onto the heap at the back.', zh: '泥土被倒到后面的肥堆上。' },
    },
    {
      phrase: 'slow the whole process down', sentenceIndex: 21,
      meaning: { zh: '拖慢，使变慢', en: 'to make a process take longer than it should' },
      usage: { zh: '及物或不及物；也指车辆减速。反义是 speed up。', en: 'Transitive or intransitive; it also means to drive more slowly. The opposite is speed up.' },
      example: { en: 'Wrong items slow down the whole recycling process.', zh: '错投的物料会拖慢整个回收流程。' },
    },
    {
      phrase: 'really do matter', sentenceIndex: 41,
      meaning: { zh: '确实很重要', en: 'genuinely have an important effect' },
      usage: { zh: '助动词 do 用来加强肯定语气；matter 作动词表示“要紧”。', en: 'The auxiliary do strengthens the positive; matter means to be important.' },
      example: { en: 'Small choices really do matter over a year.', zh: '一年下来，细小的选择确实很关键。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白用顺序词定位题块', en: 'Follow the order words' },
      body: {
        zh: 'Part 2 没有人提问提示下一题。First、Next、The third material、Finally 对应表格四行；The single most common、The second、Third 对应单选；Over on your left、At the mill 引出配对题的去向。',
        en: 'Nobody introduces the next item in a monologue. First, Next, The third material and Finally mark the four table rows; The single most common, The second and Third mark the single-choice items; Over on your left and At the mill lead into the matching destinations.',
      },
    },
    {
      title: { zh: '配对题先记“去向动词”', en: 'Keep one verb per matching option' },
      body: {
        zh: '六个选项句子太长，听前各记一个特征动词：crushed、pulped、rots、exported、burned、stored。听到物料去向时拿动词去对，不要整句翻译。',
        en: 'Six option sentences are too long to memorise. Note one verb per option: crushed, pulped, rots, exported, burned, stored. Match verbs to materials as you listen rather than translating whole sentences.',
      },
    },
    {
      title: { zh: '分清“准备要求”和“禁止投放”', en: 'Preparation versus rejected waste' },
      body: {
        zh: '表格考的是投放前怎么做：remove、rinse、squash；句 18 的 thin bags 和句 20 的 cooking oil 是被排除的物品，不能填进准备要求。落笔前确认空格要的是动作还是物料名。',
        en: 'The table asks what to do before sorting: remove, rinse, squash. Thin bags in sentence 18 and cooking oil in sentence 20 are rejected items, not preparation steps. Check whether the gap needs an action or a material name before you write.',
      },
    },
  ],
};
