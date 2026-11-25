import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 2 · Part 1 — 电话咨询度假小屋。原创仿真材料，非官方真题。
 *
 * 生活信息类表格：数字、星期、专有名词。原文里对每个考点都给了一次自然的重复或补充
 * （allow a little longer、which is about four kilometres away），模拟真实电话里的澄清。
 */
export const test02Part1: ListeningLesson = {
  slug: 'test-02-part-1',
  part: 1,
  status: 'published',
  title: { zh: '咨询一间周末度假小屋', en: 'Enquiring about a weekend cottage' },
  summary: {
    zh: '客人打电话询问海边乡村的一间石头小屋：离海多远、几间卧室、每晚价格、押金、入住日和最近的火车站，以及哪些物品要自带。',
    en: 'A caller asks about a stone cottage near the coast: distance from the sea, bedrooms, price per night, deposit, arrival day and the nearest station, plus what guests need to bring.',
  },
  accent: { zh: '房东与客人都是英式口音，语速自然。', en: 'Both speakers have British accents and speak at a natural pace.' },
  cast: [
    { id: 'owner', label: 'OWNER', gender: 'female', voice: 'en-GB-MaisieNeural' },
    { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Distance from the coast', cells: [[{ blank: 1 }, { text: ' kilometres' }]] },
        { lead: 'Number of bedrooms', cells: [[{ blank: 2 }]] },
        { lead: 'Price per night', cells: [[{ text: '£ ' }, { blank: 3 }]] },
        { lead: 'Deposit', cells: [[{ text: '£ ' }, { blank: 4 }]] },
        { lead: 'Day of arrival', cells: [[{ blank: 5 }]] },
        { lead: 'Nearest railway station', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What is provided free of charge?',
          options: [
            { key: 'A', text: 'bed linen' },
            { key: 'B', text: 'beach towels' },
            { key: 'C', text: 'a cooked breakfast' },
          ],
        },
        {
          number: 8,
          stem: 'Why does the owner advise guests to bring a torch?',
          options: [
            { key: 'A', text: 'The village shop closes early.' },
            { key: 'B', text: 'The lane has no street lights.' },
            { key: 'C', text: 'The electricity supply is unreliable.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What does the owner say about each facility? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'It is included in the price.' },
        { key: 'B', text: 'It costs extra.' },
        { key: 'C', text: 'It is closed in winter.' },
        { key: 'D', text: 'It must be booked in advance.' },
        { key: 'E', text: 'It is a short walk away.' },
      ],
      items: [
        { number: 9, text: 'the hot tub' },
        { number: 10, text: 'the village shop' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['six', '6'], evidence: 7,
      explanation: {
        zh: '定位句 7：It’s about six kilometres from the coast。后面补充 the nearest beach is a ten-minute drive，十是车程时间，不是距离。',
        en: 'Sentence 7: "It’s about six kilometres from the coast". The next clause, a ten-minute drive, is a time, not the distance.',
      },
    },
    {
      number: 2, accepted: ['three', '3'], evidence: 11,
      explanation: {
        zh: '定位句 11：There are three bedrooms, one double and two singles。one double 和 two singles 是房间类型，总数是 three。',
        en: 'Sentence 11: "There are three bedrooms, one double and two singles". One double and two singles describe the rooms; the total is three.',
      },
    },
    {
      number: 3, accepted: ['89', 'eighty-nine'], spoken: 'eighty-nine', evidence: 14,
      explanation: {
        zh: '定位句 14：It’s eighty-nine pounds a night for the whole cottage。注意 eighty-nine 不是 ninety，下一句的 ten pounds 是每位额外客人的费用。',
        en: 'Sentence 14: "It’s eighty-nine pounds a night for the whole cottage". Listen for eighty-nine, not ninety; the ten pounds in the next sentence is for each extra guest.',
      },
    },
    {
      number: 4, accepted: ['30', 'thirty'], spoken: 'thirty', evidence: 17,
      explanation: {
        zh: '定位句 17：a deposit of thirty pounds to hold the dates。thirty 的结尾是 /ti/，不要听成 thirteen。',
        en: 'Sentence 17: "a deposit of thirty pounds to hold the dates". Thirty ends in /ti/; do not hear thirteen.',
      },
    },
    {
      number: 5, accepted: ['Friday'], evidence: 21,
      explanation: {
        zh: '定位句 21：Most people come on Friday evening and leave on Sunday morning。入住日是 Friday，Sunday 是退房日。',
        en: 'Sentence 21: "Most people come on Friday evening and leave on Sunday morning". Friday is the arrival day and Sunday is the departure day.',
      },
    },
    {
      number: 6, accepted: ['Ashford'], evidence: 24,
      explanation: {
        zh: '定位句 24：The nearest station is Ashford。专有名词首字母大写；four kilometres 是距离，不是站名的一部分。',
        en: 'Sentence 24: "The nearest station is Ashford". Use a capital letter; four kilometres is the distance, not part of the name.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：the beds are made up with clean linen, and there are towels in the bathroom。B 是干扰项，句 29 说 beach towels 请自带；C 全篇没有提到。',
        en: 'Sentence 28: "the beds are made up with clean linen, and there are towels in the bathroom". B is a trap, since sentence 29 asks guests to bring their own beach towels; C is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：And a torch, because the lane has no street lights at all。原因紧跟在 because 之后。商店关门时间是句 39 的另一条信息。',
        en: 'Sentence 31: "And a torch, because the lane has no street lights at all". The reason follows because. The shop’s closing time is a separate detail in sentence 39.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 34,
      explanation: {
        zh: '定位句 34：There is one in the garden, and it costs twenty pounds extra each time you use it。extra 对应“另外收费”，不是“包含在房价里”。',
        en: 'Sentence 34: "There is one in the garden, and it costs twenty pounds extra each time you use it". Extra means it is not included.',
      },
    },
    {
      number: 10, accepted: ['E'], evidence: 38,
      explanation: {
        zh: '定位句 38：There’s a small one, about a five-minute walk down the hill。five-minute walk 对应“步行可达”。',
        en: 'Sentence 38: "There’s a small one, about a five-minute walk down the hill". A five-minute walk means it is a short walk away.',
      },
    },
  ],
  transcript: [
    { speaker: 'owner', text: 'Hillside Cottage, good morning.' },
    { speaker: 'caller', text: 'Hello, I’m calling about the cottage you advertise for weekend breaks.' },
    { speaker: 'caller', text: 'Is it still free on the second weekend of June?' },
    { speaker: 'owner', text: 'Let me just check my diary.' },
    { speaker: 'owner', text: 'Yes, the twelfth and the thirteenth are both available.' },
    { speaker: 'caller', text: 'Lovely.' },
    { speaker: 'caller', text: 'How far is it from the sea?' },
    { speaker: 'owner', text: 'It’s about six kilometres from the coast, and the nearest beach is a ten-minute drive.' },
    { speaker: 'owner', text: 'The road is a bit winding, so allow a little longer the first time.' },
    { speaker: 'caller', text: 'That’s fine, we’re not in a hurry.' },
    { speaker: 'caller', text: 'And how many bedrooms are there?' },
    { speaker: 'owner', text: 'There are three bedrooms, one double and two singles, so it sleeps five comfortably.' },
    { speaker: 'owner', text: 'The bathroom is on the landing, with a bath and a separate shower.' },
    { speaker: 'caller', text: 'What do you charge per night?' },
    { speaker: 'owner', text: 'It’s eighty-nine pounds a night for the whole cottage, however many bedrooms you use.' },
    { speaker: 'owner', text: 'That includes two guests, and each extra person pays ten pounds a night.' },
    { speaker: 'caller', text: 'Is there a deposit to pay?' },
    { speaker: 'owner', text: 'Yes, we ask for a deposit of thirty pounds to hold the dates.' },
    { speaker: 'owner', text: 'The balance is due a week before you arrive, by bank transfer if that’s convenient.' },
    { speaker: 'caller', text: 'That’s fine.' },
    { speaker: 'caller', text: 'Which day do guests usually arrive?' },
    { speaker: 'owner', text: 'Most people come on Friday evening and leave on Sunday morning, though we can be flexible if you ask.' },
    { speaker: 'caller', text: 'We’ll come by train.' },
    { speaker: 'caller', text: 'Is there a station nearby?' },
    { speaker: 'owner', text: 'The nearest station is Ashford, which is about four kilometres away.' },
    { speaker: 'owner', text: 'There’s no taxi rank at the station, so my husband picks up guests if you tell us when your train gets in.' },
    { speaker: 'caller', text: 'That’s very kind.' },
    { speaker: 'caller', text: 'Is bedding provided?' },
    { speaker: 'owner', text: 'Yes, the beds are made up with clean linen before every booking, and there are towels in the bathroom.' },
    { speaker: 'owner', text: 'If you want beach towels, please bring your own.' },
    { speaker: 'caller', text: 'So we only need to bring food.' },
    { speaker: 'owner', text: 'And a torch, because the lane has no street lights at all.' },
    { speaker: 'owner', text: 'Slippers are a good idea as well, as the floors are stone, but that’s up to you.' },
    { speaker: 'caller', text: 'I saw a hot tub in the photographs.' },
    { speaker: 'owner', text: 'There is one in the garden, and it costs twenty pounds extra each time you use it.' },
    { speaker: 'owner', text: 'We need an hour’s notice, because it’s heated by a wood fire.' },
    { speaker: 'caller', text: 'Good to know.' },
    { speaker: 'caller', text: 'Is there a shop in the village?' },
    { speaker: 'owner', text: 'There’s a small one, about a five-minute walk down the hill.' },
    { speaker: 'owner', text: 'It closes at six, so it’s worth buying supplies on the way.' },
    { speaker: 'caller', text: 'What about the sitting room?' },
    { speaker: 'owner', text: 'There’s a wood burner there, and we leave two baskets of logs for the weekend.' },
    { speaker: 'caller', text: 'Do you allow dogs?' },
    { speaker: 'owner', text: 'I’m afraid not, because there are sheep in the next field.' },
    { speaker: 'owner', text: 'There is wi-fi, but the signal is weak in the bedrooms and stronger downstairs.' },
    { speaker: 'caller', text: 'One last thing, what if we have to cancel?' },
    { speaker: 'owner', text: 'If you cancel more than a week ahead, we return the deposit in full.' },
    { speaker: 'owner', text: 'After that, I’m afraid we keep it.' },
    { speaker: 'caller', text: 'That seems fair.' },
    { speaker: 'caller', text: 'Could I book it now?' },
    { speaker: 'owner', text: 'Of course, I’ll just take your name and a contact number.' },
  ],
  vocabulary: [
    {
      term: 'diary', phonetic: '/ˈdaɪəri/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '日程簿，预约登记本', en: 'a book for recording appointments' },
      usage: { zh: '英式英语里 check my diary 是“查一下预约簿”；美式常用 calendar 或 appointment book。', en: 'In British English, check my diary means look at the appointment book; Americans say calendar.' },
      collocations: ['check my diary', 'in my diary', 'book something in the diary'],
      example: { en: 'I’ll check my diary and let you know if I’m free.', zh: '我查一下日程簿，再告诉你有没有空。' },
      listening: { zh: '与 dairy（乳制品）读音相同，都要靠上下文分辨。', en: 'It sounds exactly like dairy; only the context tells them apart.' },
    },
    {
      term: 'winding', phonetic: '/ˈwaɪndɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '蜿蜒的，弯弯曲曲的', en: 'having many curves or bends' },
      usage: { zh: 'a winding road、a winding staircase；作形容词时读 /ˈwaɪndɪŋ/。', en: 'A winding road; as an adjective it is stressed on the first syllable.' },
      collocations: ['a winding road', 'a winding path', 'a winding staircase'],
      example: { en: 'The bus climbs a winding road for half an hour before reaching the village.', zh: '公交车沿着蜿蜒的山路爬行半小时才到村子。' },
      listening: { zh: '动词 wind（缠绕）读 /waɪnd/，名词 wind（风）读 /wɪnd/，这里是前者的现在分词。', en: 'The verb wind, meaning to twist, is /waɪnd/; the noun meaning air is /wɪnd/. This is the verb form.' },
    },
    {
      term: 'landing', phonetic: '/ˈlændɪŋ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '楼梯平台，楼梯口', en: 'the flat area at the top of a staircase' },
      usage: { zh: '英式房屋用语；on the landing 表示“在楼梯平台上”。', en: 'A British housing word; on the landing.' },
      collocations: ['on the landing', 'the top landing'],
      example: { en: 'There is a small table on the landing outside the bedrooms.', zh: '卧室外的楼梯平台上有一张小桌子。' },
      listening: { zh: '同一个词也指“着陆”，飞机语境和房屋语境读音相同。', en: 'The same word also means the act of coming down to the ground, with the same pronunciation.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '押金，订金', en: 'a sum of money paid in advance as security' },
      usage: { zh: 'pay a deposit、a deposit of、return the deposit；租房和预订场景必考。', en: 'Pay a deposit, a deposit of, return the deposit; common in booking scenes.' },
      collocations: ['pay a deposit', 'a deposit of', 'return the deposit'],
      example: { en: 'You need to pay a deposit before the flat is held for you.', zh: '要先付押金，房子才会给你保留。' },
      listening: { zh: '重音在第二个音节 /ˈpɒz/，美音读 /dɪˈpɑːzɪt/。', en: 'Stress the second syllable; American English has /dɪˈpɑːzɪt/.' },
    },
    {
      term: 'balance', phonetic: '/ˈbæləns/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '尾款，剩余应付款', en: 'the amount still owed after a deposit' },
      usage: { zh: 'the balance is due 表示“尾款到期”；与 balance sheet（资产负债表）里的含义不同。', en: 'The balance is due means the rest has to be paid; unrelated to a balance sheet.' },
      collocations: ['pay the balance', 'the balance is due', 'settle the balance'],
      example: { en: 'I paid a deposit in March and the balance in June.', zh: '我三月份付了押金，六月份付清尾款。' },
      listening: { zh: '此处是名词，重音在第一个音节；动词 balance 重音相同。', en: 'Here it is a noun with stress on the first syllable; the verb is stressed the same way.' },
    },
    {
      term: 'transfer', phonetic: '/ˈtrænsfɜː/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '转账', en: 'the act of moving money from one account to another' },
      usage: { zh: '名词重音在第一个音节，动词 /trænsˈfɜː/ 重音在第二个音节；by bank transfer。', en: 'The noun is stressed on the first syllable and the verb on the second; by bank transfer.' },
      collocations: ['bank transfer', 'make a transfer', 'transfer money'],
      example: { en: 'Please send the deposit by bank transfer before Friday.', zh: '请在周五之前用银行转账付押金。' },
      listening: { zh: '听到 /ˈtrænsfɜː/ 是名词“转账”，听到 /trænsˈfɜː/ 是动词“转移”。', en: '/ˈtrænsfɜː/ is the noun and /trænsˈfɜː/ is the verb.' },
    },
    {
      term: 'flexible', phonetic: '/ˈfleksəbl/', partOfSpeech: 'adj.', sentenceIndex: 21,
      meaning: { zh: '灵活的，可变通的', en: 'able to change to suit new conditions' },
      usage: { zh: 'be flexible about something；对话里常用来缓和前面的规定。', en: 'Be flexible about something; often softens a rule stated just before.' },
      collocations: ['be flexible', 'flexible working hours', 'a flexible arrangement'],
      example: { en: 'The start time is flexible, so come whenever you are ready.', zh: '开始时间很灵活，你准备好了随时可以来。' },
      listening: { zh: '中间的 /ks/ 要读出来，结尾是 /əbl/。', en: 'Pronounce the /ks/ in the middle; the ending is /əabl/.' },
    },
    {
      term: 'linen', phonetic: '/ˈlɪnɪn/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '床单、被套等布草', en: 'sheets, pillowcases and towels, especially in a hotel' },
      usage: { zh: '不可数；bed linen、table linen、fresh linen。', en: 'Uncountable: bed linen, table linen, fresh linen.' },
      collocations: ['bed linen', 'fresh linen', 'change the linen'],
      example: { en: 'The cleaner brings fresh linen to every room each morning.', zh: '清洁工每天早上给每个房间换上干净的布草。' },
      listening: { zh: '英音 /ˈlɪnɪn/，美音 /ˈlɪnən/，第一个元音是短音 /ɪ/。', en: 'British /ˈlɪnɪn/, American /ˈlɪnən/; the first vowel is short.' },
    },
    {
      term: 'supplies', phonetic: '/səˈplaɪz/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '补给品，生活用品', en: 'food and other things needed for a period of time' },
      usage: { zh: '常用复数：buy supplies、medical supplies、running low on supplies。', en: 'Usually plural: buy supplies, medical supplies.' },
      collocations: ['buy supplies', 'medical supplies', 'run out of supplies'],
      example: { en: 'We stocked up on supplies before the storm.', zh: '暴风雨来临前我们囤足了补给。' },
      listening: { zh: '与 supply 的动词形式同根，复数词尾 /z/ 很轻。', en: 'The plural ending /z/ is soft; it is the plural form of supply.' },
    },
    {
      term: 'logs', phonetic: '/lɒɡz/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '木柴，短段原木', en: 'pieces of wood cut for burning' },
      usage: { zh: 'a basket of logs、a log fire、log cabin；复数词尾读 /z/。', en: 'A basket of logs, a log fire, a log cabin; the plural ends in /z/.' },
      collocations: ['a basket of logs', 'a log fire', 'chop logs'],
      example: { en: 'We kept the fire going with logs from the shed.', zh: '我们用棚子里的木柴让火一直烧着。' },
      listening: { zh: '不要和 lock（锁）/lɒk/ 混淆，区别只在词尾是否振动。', en: 'Do not confuse it with lock; only the final voicing differs.' },
    },
  ],
  expressions: [
    {
      phrase: 'check my diary', sentenceIndex: 3,
      meaning: { zh: '查一下预约簿', en: 'look at my appointments to see if I am free' },
      usage: { zh: '英式服务场景的固定说法，美式常说 check my calendar。', en: 'A fixed phrase in British service settings; American English says check my calendar.' },
      example: { en: 'Let me check my diary before I confirm the date.', zh: '确认日期之前我先查一下预约簿。' },
    },
    {
      phrase: 'allow a little longer', sentenceIndex: 8,
      meaning: { zh: '多留一点时间', en: 'leave some extra time' },
      usage: { zh: 'allow 表示“预留出”，宾语是时间：allow an hour、allow a little longer。', en: 'Allow means to set aside: allow an hour, allow a little longer.' },
      example: { en: 'Allow a little longer for the journey if the roads are busy.', zh: '路上堵的话，行程要多留点时间。' },
    },
    {
      phrase: 'sleeps five', sentenceIndex: 11,
      meaning: { zh: '可住五人', en: 'has beds for five people' },
      usage: { zh: '描述房屋或酒店的容纳人数：The cottage sleeps four.', en: 'Describes how many people a place can hold for the night.' },
      example: { en: 'The apartment sleeps four, with two sofa beds in the lounge.', zh: '这套公寓可住四人，客厅有两张沙发床。' },
    },
    {
      phrase: 'made up with', sentenceIndex: 28,
      meaning: { zh: '铺好了……', en: 'prepared with the bedding already on' },
      usage: { zh: 'make up a bed 是“铺床”；be made up with clean linen 表示已铺好干净床单。', en: 'Make up a bed means to put the sheets on; made up with clean linen means the bed is ready.' },
      example: { en: 'Every bed is made up with fresh sheets before guests arrive.', zh: '客人到达前，每张床都铺好了干净的床单。' },
    },
    {
      phrase: 'picks up guests', sentenceIndex: 25,
      meaning: { zh: '接客人', en: 'collects people in a vehicle' },
      usage: { zh: 'pick up 是可分短语动词：pick somebody up、pick guests up。', en: 'Pick up is separable: pick somebody up.' },
      example: { en: 'The hotel runs a bus that picks up guests at the airport.', zh: '酒店有一辆大巴去机场接客人。' },
    },
    {
      phrase: 'worth buying', sentenceIndex: 39,
      meaning: { zh: '值得买', en: 'a good idea to buy' },
      usage: { zh: 'worth doing something，后面接动名词，不接不定式。', en: 'Worth is followed by the -ing form, never the to form.' },
      example: { en: 'It is worth booking the cheaper tickets well in advance.', zh: '便宜的票值得提前很久订。' },
    },
    {
      phrase: 'in full', sentenceIndex: 46,
      meaning: { zh: '全额地', en: 'the whole amount, with nothing missing' },
      usage: { zh: '放在动词后：pay in full、refund in full；反义是 in part。', en: 'After the verb: pay in full, refund in full. The opposite is in part.' },
      example: { en: 'The course fee must be paid in full before the first class.', zh: '课程费用必须在第一节课之前全额付清。' },
    },
    {
      phrase: 'in a hurry', sentenceIndex: 9,
      meaning: { zh: '赶时间', en: 'needing to do something quickly' },
      usage: { zh: '常用于否定 not in a hurry，表示时间充裕、不着急。', en: 'Often negative, not in a hurry, meaning there is plenty of time.' },
      example: { en: 'I’m not in a hurry, so we can walk to the station.', zh: '我不赶时间，我们可以走路去车站。' },
    },
  ],
  tips: [
    {
      title: { zh: '数字题先防 -ty 与 -teen', en: 'Guard against -ty and -teen' },
      body: {
        zh: 'thirty 和 thirteen、sixty 和 sixteen 只差一个重音。听到价格、押金、距离时，把数字写下来，再对照下一句的复述（本篇 every extra person pays ten pounds）确认自己有没有听错数量级。',
        en: 'Thirty and thirteen differ only in stress. Write each number down, then check it against the restatement in the next sentence, such as each extra person pays ten pounds.',
      },
    },
    {
      title: { zh: '配对题先给选项“分门别类”', en: 'Sort the options first' },
      body: {
        zh: 'included in the price、costs extra、a short walk away 都是功能词。读题时在选项旁标“包含 / 加钱 / 步行”，听到 extra 或 walk 这样的词就能马上对应。',
        en: 'Included in the price, costs extra and a short walk away are all function labels. Tag them as included, extra or walking distance, then match on words like extra or walk.',
      },
    },
    {
      title: { zh: '补充句常常才是答案', en: 'The addendum often holds the answer' },
      body: {
        zh: '电话对话里，说话人经常先给一个信息再补充。第 5 题 Most people come on Friday evening 之后还有 though we can be flexible，说明周五是默认入住日，但可以商量。做题时先判断问的是“通常情况”还是“规定”。',
        en: 'Speakers often add a detail after the first piece of information. Item 5 has Most people come on Friday evening followed by though we can be flexible: Friday is the usual day, but it can be discussed. Decide whether the item asks about the usual case or a fixed rule.',
      },
    },
  ],
};
