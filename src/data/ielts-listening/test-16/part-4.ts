import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 16 · Part 4 — 超市的诞生（单人讲座，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：早期柜台售卖 → 自助选购 → 冷链 → 郊区化布局 → 消费习惯改变 → 复盘单选（37–40）。
 * 笔记填空 31–36 在前半与中段，单选证据集中在后半复盘段。
 */
export const test16Part4: ListeningLesson = {
  slug: 'test-16-part-4',
  part: 4,
  status: 'published',
  title: { zh: '超市的诞生', en: 'The invention of the supermarket' },
  summary: {
    zh: '讲座回顾超市出现前的柜台售卖模式，讲解自助选购如何改变店员与顾客的分工，冷链如何让易腐食品长途运输，超市为何随郊区住宅扩张，并总结这些变化对家庭饮食、购物频率与城镇布局的长期影响。',
    en: 'The lecture describes counter-service shops before supermarkets, how self-service changed staff and customer roles, how the cold chain carried perishable food over distance, why stores followed suburban housing, and the lasting effects on diets, shopping habits and town layout.',
  },
  accent: { zh: '发言人为加拿大口音，语速中等。', en: 'The speaker has a Canadian accent and speaks at a moderate pace.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early shops kept goods behind the', cells: [[{ blank: 31 }]] },
        { lead: 'Self-service: customers chose items', cells: [[{ blank: 32 }]] },
        { lead: 'Cold chain kept perishable food', cells: [[{ blank: 33 }]] },
        { lead: 'Supermarkets spread out to the', cells: [[{ blank: 34 }]] },
        { lead: 'Shoppers bought one', cells: [[{ blank: 35 }, { text: ' list in a single trip' }]] },
        { lead: 'The stores changed daily eating', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why did self-service reduce the shopkeeper’s workload?',
          options: [
            { key: 'A', text: 'One assistant could serve many shoppers without fetching each item' },
            { key: 'B', text: 'Fewer products needed wrapping in paper' },
            { key: 'C', text: 'Customers paid by card instead of cash' },
          ],
        },
        {
          number: 38,
          stem: 'What did the cold chain solve?',
          options: [
            { key: 'A', text: 'The high cost of farm labour' },
            { key: 'B', text: 'The spoiling of food over long distances' },
            { key: 'C', text: 'The shortage of fresh vegetables in town' },
          ],
        },
        {
          number: 39,
          stem: 'Why did supermarkets open in the suburbs?',
          options: [
            { key: 'A', text: 'Suburban shoppers had no town centre buses' },
            { key: 'B', text: 'Land there was cheaper than in every city' },
            { key: 'C', text: 'The suburbs offered space for parking and a large floor' },
          ],
        },
        {
          number: 40,
          stem: 'What was the most important long-term effect?',
          options: [
            { key: 'A', text: 'It ended trade between rural producers and cities' },
            { key: 'B', text: 'It changed family diets, shopping frequency and town layout' },
            { key: 'C', text: 'It reduced the number of car journeys people made' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['counter'], evidence: 2,
      explanation: {
        zh: '定位句 2：Goods were kept on shelves behind the counter。早期商品放在柜台后，填 counter；句 3 的 wrapped in paper 是交付方式，不是存放位置。',
        en: 'Sentence 2: goods were "kept on shelves behind the counter", so fill counter. Wrapping in paper in sentence 3 is delivery, not storage.',
      },
    },
    {
      number: 32, accepted: ['themselves'], evidence: 6,
      explanation: {
        zh: '定位句 6：customers walked the aisles and chose items themselves。自助选购由顾客自己挑货，填 themselves；句 7 的 shopkeeper 不再递货是分工变化。',
        en: 'Sentence 6: customers "chose items themselves", so fill themselves. The shopkeeper no longer handing goods over is the role change in sentence 7.',
      },
    },
    {
      number: 33, accepted: ['fresh'], evidence: 13,
      explanation: {
        zh: '定位句 13：keep perishable food fresh through the whole journey。冷链目的是保持食物新鲜，填 fresh；句 12 的 spoiled quickly 是冷链要解决的旧问题。',
        en: 'Sentence 13: the cold chain kept "perishable food fresh through the whole journey", so fill fresh. Spoiling quickly in sentence 12 is the old problem it solved.',
      },
    },
    {
      number: 34, accepted: ['suburbs'], evidence: 17,
      explanation: {
        zh: '定位句 17：As families moved out to the suburbs, large stores followed them。超市随住宅迁往郊区，填 suburbs；句 18 的 parking 是郊区场地优势。',
        en: 'Sentence 17: as families moved "out to the suburbs, large stores followed them", so fill suburbs. Parking in sentence 18 is the site advantage.',
      },
    },
    {
      number: 35, accepted: ['weekly'], evidence: 21,
      explanation: {
        zh: '定位句 21：customers wrote one weekly list and bought most of it in a single trip。购物清单是每周一张，填 weekly；句 20 的 habits 是总体变化。',
        en: 'Sentence 21: customers wrote "one weekly list" for a single trip, so fill weekly. Habits in sentence 20 is the broader change.',
      },
    },
    {
      number: 36, accepted: ['habits'], evidence: 20,
      explanation: {
        zh: '定位句 20：The supermarket then reshaped daily eating habits。超市改变日常饮食习惯，填 habits；句 21 的 weekly list 是习惯的具体表现。',
        en: 'Sentence 20: the supermarket "reshaped daily eating habits", so fill habits. The weekly list in sentence 21 is one concrete habit.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：The assistant could focus on the till and the aisles instead of fetching goods from shelves。句 33 先说自助模式减少了人工搬运，句 34 具体说明一名店员可守收银与过道、不必逐件取货，对应 A。B 的减少包装、C 的刷卡支付均未提及。',
        en: 'Sentence 34: "The assistant could focus on the till and the aisles instead of fetching goods from shelves". Sentence 33 says self-service removed much manual handling; sentence 34 spells out that one assistant no longer had to fetch each item, matching A. Less wrapping and card payment are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：The cold chain solved the problem of distance. Food no longer had to be grown or raised near the town where it was sold。冷链解决长途变质，对应 B。A 的农业劳力成本、C 的本地蔬菜短缺未被提及。',
        en: 'Sentence 35: the cold chain solved "the problem of distance", matching B. Farm labour costs and local vegetable shortage are not mentioned.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 37,
      explanation: {
        zh: '定位句 37：that was where the new housing and the car parks were，句 38 补充大单层场地与免费停车，对应 C。A 的公交缺失、B 的地价最低均未提及。',
        en: 'Sentence 37: stores followed "the new housing and the car parks", and sentence 38 adds the large floor and free parking, matching C. Bus gaps and cheapest land are not mentioned.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：They altered what families ate, how often they shopped, and how towns arranged their shops and roads。这句直接总结饮食、购物频率与城镇布局三方面变化，对应 B。第 39 句只是引出“不止改变了购买地点”。A 的终结城乡贸易与 C 的减少用车均与原文相反。',
        en: 'Sentence 40: "They altered what families ate, how often they shopped, and how towns arranged their shops and roads". This directly sums up diets, shopping frequency and town layout, matching B. Sentence 39 only introduces that the changes went beyond where food was bought. Ending rural trade and cutting car journeys contradict the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Before supermarkets, most town shops looked very different from today.' },
    { speaker: 'lecturer', text: 'Let me start with a number. A hundred years ago, a grocer might hand every item over the counter, one small bag at a time.' },
    { speaker: 'lecturer', text: 'Goods were kept on shelves behind the counter, and the shopkeeper selected what the customer asked for.' },
    { speaker: 'lecturer', text: 'The buyer rarely touched the produce before it was wrapped in paper.' },
    { speaker: 'lecturer', text: 'This model worked in small villages, but it was slow and tied up many staff.' },
    { speaker: 'lecturer', text: 'The first real change was self-service.' },
    { speaker: 'lecturer', text: 'In self-service stores, customers walked the aisles and chose items themselves, putting them into a trolley.' },
    { speaker: 'lecturer', text: 'The shopkeeper no longer handed each product over the counter.' },
    { speaker: 'lecturer', text: 'This cut waiting at the till and let one assistant serve many shoppers at once.' },
    { speaker: 'lecturer', text: 'It also changed how goods were displayed. Packaged products faced the customer directly, so branding and packaging became part of the sale.' },
    { speaker: 'lecturer', text: 'Shoppers compared labels, sizes and prices without asking a member of staff.' },
    { speaker: 'lecturer', text: 'The second change was the cold chain.' },
    { speaker: 'lecturer', text: 'Before reliable refrigeration, meat and milk travelled short distances and spoiled quickly in warm weather.' },
    { speaker: 'lecturer', text: 'The cold chain used insulated wagons, cold stores and refrigerated display cases to keep perishable food fresh through the whole journey.' },
    { speaker: 'lecturer', text: 'This meant dairy, fish and frozen vegetables could reach towns far from the farm.' },
    { speaker: 'lecturer', text: 'Shops could stock a wider range of food through every season, not just local harvests.' },
    { speaker: 'lecturer', text: 'The third shift was where the new stores opened.' },
    { speaker: 'lecturer', text: 'As families moved out to the suburbs, large stores followed them onto the main roads.' },
    { speaker: 'lecturer', text: 'Suburban sites had space for parking and a single big floor, which old town centre shops could not offer.' },
    { speaker: 'lecturer', text: 'Shoppers drove there and carried heavy bags home by car.' },
    { speaker: 'lecturer', text: 'The supermarket then reshaped daily eating habits.' },
    { speaker: 'lecturer', text: 'Instead of several short visits each day, customers wrote one weekly list and bought most of it in a single trip.' },
    { speaker: 'lecturer', text: 'Bread, vegetables and staples were chosen together, rather than at separate specialist shops.' },
    { speaker: 'lecturer', text: 'Households began planning meals around what the supermarket stocked, and new prepared foods entered the home.' },
    { speaker: 'lecturer', text: 'Prices stayed lower because stores bought in bulk and passed part of the saving to shoppers.' },
    { speaker: 'lecturer', text: 'Critics at the time worried that small local traders could not compete with the big chains.' },
    { speaker: 'lecturer', text: 'Many corner shops closed as families switched to the weekly trolley run.' },
    { speaker: 'lecturer', text: 'The supermarket also changed the work inside the store.' },
    { speaker: 'lecturer', text: 'Roles split into till operators, shelf stackers, buyers and delivery staff, rather than one grocer doing everything.' },
    { speaker: 'lecturer', text: 'Design mattered more too. Aisles were planned so shoppers passed everyday items on every visit.' },
    { speaker: 'lecturer', text: 'Seasonal displays near the entrance encouraged extra purchases.' },
    { speaker: 'lecturer', text: 'None of this happened overnight. Roads, refrigeration and car ownership all had to improve first.' },
    { speaker: 'lecturer', text: 'Once those pieces were in place, the supermarket became the standard place to shop.' },
    { speaker: 'lecturer', text: 'Looking back at the self-service model, it removed much of the manual handling that once filled a grocer’s day.' },
    { speaker: 'lecturer', text: 'The assistant could focus on the till and the aisles instead of fetching goods from shelves.' },
    { speaker: 'lecturer', text: 'The cold chain solved the problem of distance. Food no longer had to be grown or raised near the town where it was sold.' },
    { speaker: 'lecturer', text: 'Trade could connect rural producers with city tables across long routes.' },
    { speaker: 'lecturer', text: 'The suburbs drew the stores because that was where the new housing and the car parks were.' },
    { speaker: 'lecturer', text: 'A town centre corner shop could not match the size and free parking of a suburban supermarket.' },
    { speaker: 'lecturer', text: 'Taken together, these changes did more than change where people bought food.' },
    { speaker: 'lecturer', text: 'They altered what families ate, how often they shopped, and how towns arranged their shops and roads.' },
    { speaker: 'lecturer', text: 'The effects are still visible in the retail parks and weekly routines we know today.' },
    { speaker: 'lecturer', text: 'Early adverts stressed the range of goods under one roof.' },
    { speaker: 'lecturer', text: 'Shoppers could compare brands without moving between streets.' },
    { speaker: 'lecturer', text: 'The store layout guided people past several departments.' },
    { speaker: 'lecturer', text: 'Checkout counters replaced the single shopkeeper’s desk.' },
    { speaker: 'lecturer', text: 'Roadside signs directed drivers to the new store car park.' },
    { speaker: 'lecturer', text: 'Families planned the week’s meals around one visit.' },
    { speaker: 'lecturer', text: 'Small specialist shops survived by offering personal advice.' },
    { speaker: 'lecturer', text: 'The supermarket model spread to other towns within a decade.' },
  ],
  vocabulary: [
    {
      term: 'self-service', phonetic: '/ˌself ˈsɜːvɪs/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '自助选购（顾客自取商品）', en: 'a store model where customers pick items themselves' },
      usage: { zh: '不可数；self-service store、the self-service model。', en: 'Uncountable: self-service store, the self-service model.' },
      collocations: ['self-service model', 'the self-service store', 'move to self-service'],
      example: { en: 'Self-service cut the work behind the counter.', zh: '自助选购减少了柜台后的工作量。' },
      listening: { zh: '复合词重音落在 service 上。', en: 'Stress falls on service in the compound.' },
    },
    {
      term: 'trolley', phonetic: '/ˈtrɒli/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '购物车', en: 'the cart shoppers fill in a store' },
      usage: { zh: '可数；push a trolley、the supermarket trolley。美式多说 cart。', en: 'Countable: push a trolley; American English usually says cart.' },
      collocations: ['the shopping trolley', 'push a trolley', 'fill the trolley'],
      example: { en: 'Shoppers put goods into a trolley as they walk.', zh: '顾客边走边把商品放进购物车。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtrɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'refrigeration', phonetic: '/rɪˌfrɪdʒəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '冷藏，制冷', en: 'keeping food cold by mechanical cooling' },
      usage: { zh: '不可数；reliable refrigeration、the cold refrigeration system。动词 refrigerate。', en: 'Uncountable: reliable refrigeration; the verb is refrigerate.' },
      collocations: ['food refrigeration', 'cold refrigeration', 'improved refrigeration'],
      example: { en: 'Refrigeration let meat travel further without spoiling.', zh: '冷藏让肉类能长途运输而不变质。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈreɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'perishable', phonetic: '/ˈperɪʃəbl/', partOfSpeech: 'adj.', sentenceIndex: 13,
      meaning: { zh: '易腐坏的（食品）', en: 'food that goes bad quickly unless kept cold' },
      usage: { zh: '形容词；perishable food、perishable goods。', en: 'Adjective: perishable food, perishable goods.' },
      collocations: ['perishable food', 'perishable goods', 'perishable produce'],
      example: { en: 'Milk and fish are highly perishable.', zh: '牛奶和鱼很容易腐坏。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈper/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'suburbs', phonetic: '/ˈsʌbɜːbz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '郊区，城郊住宅区', en: 'the residential areas around a city centre' },
      usage: { zh: '可数复数；move out to the suburbs、suburban sites。形容词 suburban。', en: 'Countable plural: move out to the suburbs; the adjective is suburban.' },
      collocations: ['the outer suburbs', 'suburban housing', 'move to the suburbs'],
      example: { en: 'Stores followed families into the suburbs.', zh: '商店跟着家庭迁到郊区。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsʌb/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'staples', phonetic: '/ˈsteɪplz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '主食，常备日用品', en: 'basic foods bought on most shopping trips' },
      usage: { zh: '可数复数；bread, rice and other staples。单数 staple。', en: 'Countable plural: bread, rice and other staples; the singular is staple.' },
      collocations: ['the household staples', 'food staples', 'buy the staples'],
      example: { en: 'Rice and flour are common kitchen staples.', zh: '米和面粉是常见的厨房常备品。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsteɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'bulk', phonetic: '/bʌlk/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '大批，大宗（采购）', en: 'large quantities bought together to lower unit price' },
      usage: { zh: '不可数；buy in bulk、bulk buying。', en: 'Uncountable: buy in bulk, bulk buying.' },
      collocations: ['buy in bulk', 'bulk orders', 'bulk prices'],
      example: { en: 'Buying in bulk keeps the per-item price down.', zh: '批量采购压低单件价格。' },
      listening: { zh: '单音节，与 duck 同尾韵。', en: 'One syllable, rhyming with duck.' },
    },
    {
      term: 'aisles', phonetic: '/aɪlz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '货架间通道', en: 'the walking row between store shelves' },
      usage: { zh: '可数；walk the aisles、the cereal aisle。注意 s 不发音。', en: 'Countable: walk the aisles, the cereal aisle; the s is silent.' },
      collocations: ['the store aisle', 'the food aisle', 'walk the aisles'],
      example: { en: 'Every aisle holds one category of goods.', zh: '每条通道摆放一类商品。' },
      listening: { zh: '单音节，与 mile 同韵，s 不发音。', en: 'One syllable, rhyming with mile; the s is silent.' },
    },
  ],
  expressions: [
    {
      phrase: 'hand every item over', sentenceIndex: 1,
      meaning: { zh: '把（商品）递过去', en: 'to pass an item across the counter' },
      usage: { zh: '可分短语动词；hand goods over、hand over the bag。', en: 'Separable: hand goods over, hand over the bag.' },
      example: { en: 'The grocer handed each item over the counter.', zh: '杂货店员把每件商品递过柜台。' },
    },
    {
      phrase: 'at once', sentenceIndex: 8,
      meaning: { zh: '同时，一次（服务多人）', en: 'at the same time, without delay' },
      usage: { zh: 'serve many shoppers at once；at once 另有立刻之意。', en: 'Serve many shoppers at once; at once can also mean immediately.' },
      example: { en: 'One till assistant serves several people at once.', zh: '一名收银同时服务几位顾客。' },
    },
    {
      phrase: 'in bulk', sentenceIndex: 24,
      meaning: { zh: '大批量地（采购）', en: 'in large quantities, for a lower unit price' },
      usage: { zh: '方式状语；buy in bulk、order in bulk。', en: 'Adverbial: buy in bulk, order in bulk.' },
      example: { en: 'Stores buy dry goods in bulk.', zh: '商店大批量采购干货。' },
    },
    {
      phrase: 'passed part of the saving', sentenceIndex: 24,
      meaning: { zh: '把部分节省让给顾客', en: 'to share some cost reduction with shoppers' },
      usage: { zh: 'pass on the saving；宾语可放中间。', en: 'Pass on the saving; the object can sit in the middle.' },
      example: { en: 'Chains pass part of the saving to customers.', zh: '连锁商店把部分让利给顾客。' },
    },
    {
      phrase: 'switched to', sentenceIndex: 26,
      meaning: { zh: '转而使用，改投（渠道）', en: 'to change over to a different shop or habit' },
      usage: { zh: 'switch to 表示改用；常见 switch to the supermarket、switch to weekly shopping。', en: 'Switch to the supermarket, switch to weekly shopping.' },
      example: { en: 'Families switched to the weekly trolley run.', zh: '家庭改成每周推一次购物车。' },
    },
    {
      phrase: 'happened overnight', sentenceIndex: 31,
      meaning: { zh: '一夜之间发生，突然成型', en: 'to appear or change suddenly over a short time' },
      usage: { zh: '否定句常用；nothing happened overnight。', en: 'Common in negatives: nothing happened overnight.' },
      example: { en: 'The supermarket model did not happen overnight.', zh: '超市模式并非一夜之间形成。' },
    },
  ],
  tips: [
    {
      title: { zh: '讲座笔记跟着三大变革走', en: 'Follow the three shifts in lecture notes' },
      body: {
        zh: '自助选购、冷链、郊区化是三条并列线索。听到 The first change、The second change、The third shift 就切换笔记主题，防止把冷链的 fresh 填到自助选购空里。',
        en: 'Self-service, the cold chain and suburbanisation are parallel threads. Switch note topics at The first change, The second change and The third shift, so the cold-chain word fresh does not land in a self-service gap.',
      },
    },
    {
      title: { zh: '区分材料词与结果词', en: 'Separate material words from outcome words' },
      body: {
        zh: '同一组词既可描述做法也可描述结果：food 既走冷链也进家庭。先看题干修饰词 perishable、eating、weekly，再决定填新鲜度、习惯还是频率。',
        en: 'The same words describe process and outcome alike: food travels the cold chain and enters homes. Check the modifier in the stem, perishable, eating or weekly, before choosing freshness, habit or frequency.',
      },
    },
    {
      title: { zh: '复盘段是单选密集区', en: 'The recap carries the single-choice items' },
      body: {
        zh: '后半段 Looking back at、The cold chain solved、The suburbs drew 是对前文的复盘，37–40 答案集中在这里。听到这类总结短语就把注意力放到选项匹配上。',
        en: 'The later recap, marked by Looking back at, The cold chain solved and The suburbs drew, carries items 37–40. Shift to option matching when you hear these summary phrases.',
      },
    },
  ],
};
