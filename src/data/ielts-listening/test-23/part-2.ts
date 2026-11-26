import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 23 · Part 2 — 青年旅舍入住说明（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：门禁与钥匙（表格 11–12）→ 厨房标签与洗衣房（表格 13–14）→
 * 床位、清洁与安静时段（单选 15–17）→ 个人物品存放（配对 18–20）。题块顺序与录音一致。
 */
export const test23Part2: ListeningLesson = {
  slug: 'test-23-part-2',
  part: 2,
  status: 'published',
  title: { zh: '青年旅舍入住说明', en: 'Orienting guests at a youth hostel' },
  summary: {
    zh: '旅舍女主管向新到客人讲解大门门禁时间、钥匙卡与押金、公共厨房的食物标签、洗衣房收费、床位规则、厨房清洁要求、夜间安静时段，以及贵重物品、湿毛巾和冷藏食物分别放在哪里。',
    en: 'The hostel hostess briefs new guests on the door curfew, the key card and deposit, food labelling in the shared kitchen, laundry charges, bunk rules, kitchen cleaning, the evening quiet period, and where valuables, wet towels and cooling food are kept.',
  },
  accent: { zh: '主管为英式口音。', en: 'The hostess speaks with a British accent.' },
  cast: [
    { id: 'hostess', label: 'HOSTESS', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Facility', 'Rule'],
      rows: [
        { lead: 'Main door', cells: [[{ text: 'locked after ' }, { blank: 11 }, { text: ' at night' }]] },
        { lead: 'Key card', cells: [[{ text: 'returned to ' }, { blank: 12 }, { text: ' on checkout' }]] },
        { lead: 'Kitchen food', cells: [[{ text: 'label with name and ' }, { blank: 13 }]] },
        { lead: 'Laundry', cells: [[{ text: 'each load costs ' }, { blank: 14 }, { text: ' pounds' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What rule applies to the dormitory bunks?',
          options: [
            { key: 'A', text: 'Guests bring their own bedding for the bunks.' },
            { key: 'B', text: 'Guests should not swap bunks during the night.' },
            { key: 'C', text: 'The top bunk is reserved for younger guests.' },
          ],
        },
        {
          number: 16,
          stem: 'What must guests do in the shared kitchen?',
          options: [
            { key: 'A', text: 'Wash the dishes and wipe the work surface after use.' },
            { key: 'B', text: 'Keep cooked meat in the fridge overnight.' },
            { key: 'C', text: 'Buy all snacks from the hostel shop.' },
          ],
        },
        {
          number: 17,
          stem: 'When does the quiet period begin?',
          options: [
            { key: 'A', text: 'ten o’clock' },
            { key: 'B', text: 'ten thirty' },
            { key: 'C', text: 'eleven o’clock' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Where should each item be kept? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'in the locker under your bed' },
        { key: 'B', text: 'on the middle shelf of the shared fridge' },
        { key: 'C', text: 'on the drying rack in the laundry' },
        { key: 'D', text: 'behind the reception desk' },
        { key: 'E', text: 'on the hostel noticeboard' },
        { key: 'F', text: 'in the garden shed' },
      ],
      items: [
        { number: 18, text: 'valuables such as a passport' },
        { number: 19, text: 'wet towels' },
        { number: 20, text: 'food that needs cooling' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['eleven'], evidence: 4,
      explanation: {
        zh: '定位句 4：After eleven at night the main door stays locked。表格已印 locked after 和 at night，缺的是时间 eleven；句 3 的 automatically 是锁门方式，不是时间点。',
        en: 'Sentence 4: "After eleven at night the main door stays locked". Locked after and at night are printed, so the missing time is eleven. Automatically in sentence 3 describes how it locks, not the time.',
      },
    },
    {
      number: 12, accepted: ['reception'], evidence: 7,
      explanation: {
        zh: '定位句 7：When you check out, the card goes back to reception。空格前已印 returned to，填地点 reception；句 8 的 front desk 是补办卡片的地方，不是还卡处。',
        en: 'Sentence 7: "When you check out, the card goes back to reception". Returned to is printed, so the place is reception. The front desk in sentence 8 is where a replacement is cut, not where the card is returned.',
      },
    },
    {
      number: 13, accepted: ['date'], evidence: 11,
      explanation: {
        zh: '定位句 11：Mark your food with your name and the date。表格已印 name and，缺的是日期 date；句 10 的 cereal、tea 是提供的食物，不是标签内容。',
        en: 'Sentence 11: "Mark your food with your name and the date". Name and are printed, so the missing item is the date. Cereal and tea in sentence 10 are provided food, not label details.',
      },
    },
    {
      number: 14, accepted: ['2'], spoken: 'two pounds', evidence: 14,
      explanation: {
        zh: '定位句 14：Each load costs two pounds, and you pay at reception before you start the machine。空格后已印 pounds，填数字 two；句 15 的 washing powder 是提供的用品，不是费用。',
        en: 'Sentence 14: "Each load costs two pounds, and you pay at reception before you start the machine". Pounds are printed, so write the number two. Washing powder in sentence 15 is a provided supply, not a charge.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：you should not swap bunks with someone else during the night。不要调换床位对应 B；A 错在句 17 说明床单已铺好，不用自带；C 的上铺留给年轻人在讲解中没有出现。',
        en: 'Sentence 17: "you should not swap bunks with someone else during the night". Not swapping bunks matches B. A is wrong because linen is already made up, and the top bunk for younger guests in C is never mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：Dishes go in the sink, and you should wash them up and wipe the work surface before you leave。洗碗并擦台面对应 A；B 的隔夜存肉句中未提，C 的只能买旅舍零食与自带食物的安排相反。',
        en: 'Sentence 18: "Dishes go in the sink, and you should wash them up and wipe the work surface before you leave". Washing dishes and wiping the surface matches A. Keeping meat overnight in B is not mentioned, and buying only shop snacks in C contradicts the bring-your-own food arrangement.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：From ten thirty each evening we ask everyone to keep quiet。安静时段从十点半开始对应 B；A 的十点没有依据，C 的十一点是厨房和休息室关门时间（句 22），不是安静时段。',
        en: 'Sentence 21: "From ten thirty each evening we ask everyone to keep quiet". The quiet period starts at ten thirty, matching B. Ten o’clock in A has no basis, and eleven in C is when the kitchen and common room close in sentence 22, not the quiet time.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：Valuables such as your passport, cash and phone should go in the locker under your bed。护照等贵重物品放进床下储物柜对应 A；D 的前台后面只放补办卡片相关事务。',
        en: 'Sentence 23: "Valuables such as your passport, cash and phone should go in the locker under your bed". Passports and cash go in the under-bed locker, matching A. Behind the desk in D concerns replacement cards only.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Wet towels can hang on the rack in the laundry overnight。湿毛巾挂在洗衣房晾干架对应 C；E 的公告板是写意见的地方，不是晾衣处。',
        en: 'Sentence 25: "Wet towels can hang on the rack in the laundry overnight". Wet towels go on the laundry rack, matching C. The noticeboard in E is for notes and comments, not drying.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：Food you bring in, if it needs cooling, goes on the middle shelf of the fridge。需冷藏的自带食物放冰箱中层对应 B；F 的花园棚屋在讲解中没有出现。',
        en: 'Sentence 26: "Food you bring in, if it needs cooling, goes on the middle shelf of the fridge". Cooling food goes on the middle fridge shelf, matching B. The garden shed in F is never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'hostess', text: 'Right, everyone, if you could gather by the front desk, I’ll run through the hostel rules before you head upstairs.' },
    { speaker: 'hostess', text: 'I’m Priya, your hostess for this stay, and I’ll be on duty until late tonight.' },
    { speaker: 'hostess', text: 'We have two dormitories on the first floor, a family room at the back, and a small private double near the garden.' },
    { speaker: 'hostess', text: 'First, the entrance door. It locks automatically when you step out, so keep your key card with you at all times.' },
    { speaker: 'hostess', text: 'After eleven at night the main door stays locked, and anyone coming back after that has to ring the bell and wait to be let in.' },
    { speaker: 'hostess', text: 'Please don’t let friends in through the side gate, even if they are staying nearby.' },
    { speaker: 'hostess', text: 'Now the key card. It opens your dormitory door and the locker below your bed.' },
    { speaker: 'hostess', text: 'When you check out, the card goes back to reception, and that is when the ten-pound deposit is returned to you.' },
    { speaker: 'hostess', text: 'If you lose the card, let me know at once, because a replacement has to be cut at the front desk.' },
    { speaker: 'hostess', text: 'Next, the shared kitchen, which you’ll find at the end of the corridor on the ground floor.' },
    { speaker: 'hostess', text: 'Breakfast cereal, tea and coffee are provided there, but any lunch or snack you bring must be labelled clearly.' },
    { speaker: 'hostess', text: 'Mark your food with your name and the date, or anything unclaimed after two days is thrown out.' },
    { speaker: 'hostess', text: 'The kitchen closes at nine in the evening, so please finish cooking and clear away before then.' },
    { speaker: 'hostess', text: 'In the basement you’ll find the laundry room, with one washing machine and a small drying rack.' },
    { speaker: 'hostess', text: 'Each load costs two pounds, and you pay at reception before you start the machine.' },
    { speaker: 'hostess', text: 'Washing powder is provided, but bring your own detergent if you have sensitive skin.' },
    { speaker: 'hostess', text: 'Now a few rules about the dormitory beds.' },
    { speaker: 'hostess', text: 'Each bunk is made up with clean linen before your arrival, and you should not swap bunks with someone else during the night.' },
    { speaker: 'hostess', text: 'Dishes go in the sink, and you should wash them up and wipe the work surface before you leave.' },
    { speaker: 'hostess', text: 'There are two fridges, one for drinks and one for cooked food, and the middle shelf is reserved for guests staying more than two nights.' },
    { speaker: 'hostess', text: 'One point about noise. This is an old building, and voices travel easily up the wooden stairs.' },
    { speaker: 'hostess', text: 'From ten thirty each evening we ask everyone to keep quiet, in the dormitories and in the corridor.' },
    { speaker: 'hostess', text: 'The kitchen and the common room close at eleven, so late-night chat moves to the outdoor seating area.' },
    { speaker: 'hostess', text: 'Valuables such as your passport, cash and phone should go in the locker under your bed, and you keep the card that opens it.' },
    { speaker: 'hostess', text: 'The locker is not large enough for a suitcase, so heavy bags stay beside your bed.' },
    { speaker: 'hostess', text: 'Wet towels can hang on the rack in the laundry overnight, and by morning they are usually dry enough to fold.' },
    { speaker: 'hostess', text: 'Food you bring in, if it needs cooling, goes on the middle shelf of the fridge, behind the shared butter and milk.' },
    { speaker: 'hostess', text: 'Please keep shoes off the top bunks, and don’t leave bags on the stairs where people carry them down.' },
    { speaker: 'hostess', text: 'The garden is open until dusk, and there are benches outside if you want to sit and read.' },
    { speaker: 'hostess', text: 'Fire drills are rare here, but if the alarm sounds, leave by the stairs and gather on the path by the gate.' },
    { speaker: 'hostess', text: 'If you need help during the night, knock on the door of the duty room, which is next to reception.' },
    { speaker: 'hostess', text: 'Smoking is not allowed anywhere inside the building, and there are ashtrays by the back door only.' },
    { speaker: 'hostess', text: 'Towels are not included in the bed price, so if you forgot yours, we can lend one for a small charge at reception.' },
    { speaker: 'hostess', text: 'Wi-Fi covers the whole hostel, and the password is written on the noticeboard in the common room.' },
    { speaker: 'hostess', text: 'Breakfast runs from seven thirty until nine in the dining room, and you can help yourself to toast and fruit.' },
    { speaker: 'hostess', text: 'Checkout is at eleven in the morning, but you can leave bags at reception until your bus leaves.' },
    { speaker: 'hostess', text: 'The nearest bus stop is two minutes down the road, and timetables are pinned beside the front door.' },
    { speaker: 'hostess', text: 'If you have a complaint or an idea for the hostel, write it on the board by the door, and I read every note each morning.' },
    { speaker: 'hostess', text: 'That covers the basics. Your bed numbers are on the card I gave you, and your name tag hangs above each bunk.' },
    { speaker: 'hostess', text: 'Take your time unpacking, and come back to the kitchen if you need a mug or an extra blanket.' },
    { speaker: 'hostess', text: 'I’m Priya again if you lose track of who I am, and I’ll be around the common room after six this evening.' },
    { speaker: 'hostess', text: 'Enjoy your stay, and do ask if anything is unclear.' },
  ],
  vocabulary: [
    {
      term: 'dormitory', phonetic: '/ˈdɔːmətri/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '宿舍，多人间旅舍房间', en: 'a room with several beds shared by travellers' },
      usage: { zh: '可数名词；英式常简称 dorm。dormitory beds 指上下铺床位。', en: 'Countable; speech often shortens it to dorm. Dormitory beds are the bunks.' },
      collocations: ['a dormitory room', 'the dormitory beds', 'shared dormitory'],
      example: { en: 'The two dormitories hold twelve guests each.', zh: '两间多人间各住十二位客人。' },
      listening: { zh: '四个音节，重音在第一音节，结尾 /tri/ 轻读。', en: 'Four syllables, stressed on the first, with a light final /tri/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '押金（退房后退还）', en: 'money held as security and returned when the stay ends' },
      usage: { zh: '可数；a ten-pound deposit、return the deposit。动词 deposit 重音在后。', en: 'Countable: a ten-pound deposit, return the deposit. The verb stresses the second syllable.' },
      collocations: ['a refundable deposit', 'return the deposit', 'pay a deposit'],
      example: { en: 'The deposit comes back when the key card is handed in.', zh: '交还钥匙卡时押金退回。' },
      listening: { zh: '名词重音在第二音节 /ˈpɒz/，注意和动词区分。', en: 'The noun stresses the second syllable; the verb shifts the stress.' },
    },
    {
      term: 'labelled', phonetic: '/ˈleɪbld/', partOfSpeech: 'v.', sentenceIndex: 10,
      meaning: { zh: '贴上标签，标注', en: 'marked with a name or details so the item can be identified' },
      usage: { zh: '被动 be labelled；名词 label 指标签。英式双写 l。', en: 'Passive be labelled; the noun is label. British spelling doubles the l.' },
      collocations: ['labelled clearly', 'label the food', 'a labelled bottle'],
      example: { en: 'Bring only labelled containers to the shared fridge.', zh: '贴好标签的容器才能放进公共冰箱。' },
      listening: { zh: '两个音节，/bld/ 辅音丛后不加元音。', en: 'Two syllables; do not add a vowel after the /bld/ cluster.' },
    },
    {
      term: 'unclaimed', phonetic: '/ˌʌnˈkleɪmd/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '无人认领的', en: 'not collected or identified by an owner' },
      usage: { zh: '前缀 un 加 claim；unclaimed food、unclaimed luggage。', en: 'Prefix un plus claim: unclaimed food, unclaimed luggage.' },
      collocations: ['unclaimed items', 'unclaimed food', 'remain unclaimed'],
      example: { en: 'Unclaimed food is removed after two days.', zh: '无人认领的食物两天后清走。' },
      listening: { zh: '重音在第二音节 /ˈkleɪm/，前缀 /ʌn/ 轻读。', en: 'Stress the second syllable; the prefix /ʌn/ is reduced.' },
    },
    {
      term: 'bunk', phonetic: '/bʌŋk/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '（上下铺的）铺位', en: 'a bed in a shared room, often one of two levels' },
      usage: { zh: '可数；top bunk、bottom bunk。与 bed 相比 bunk 强调多人间铺位。', en: 'Countable: top bunk, bottom bunk. Unlike bed, bunk stresses the shared-room setting.' },
      collocations: ['the top bunk', 'swap bunks', 'a bunk bed'],
      example: { en: 'Children under eight should take the bottom bunk.', zh: '八岁以下孩子睡下铺。' },
      listening: { zh: '与 trunk 押韵，短元音 /ʌ/，词尾 /ŋk/。', en: 'Rhymes with trunk; short vowel /ʌ/ and a final /ŋk/.' },
    },
    {
      term: 'locker', phonetic: '/ˈlɒkə/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '储物柜（带锁的个人格子柜）', en: 'a small locked cupboard for personal belongings' },
      usage: { zh: '可数；under-bed locker、locker key。动词 lock 是“锁上”。', en: 'Countable: under-bed locker, locker key. The verb lock means to fasten.' },
      collocations: ['a locker under the bed', 'open the locker', 'locker code'],
      example: { en: 'Keep your passport in the locker during the day.', zh: '白天把护照放在储物柜里。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ə/ 轻读。', en: 'Two syllables, stressed on the first, with a light final /ə/.' },
    },
    {
      term: 'detergent', phonetic: '/dɪˈtɜːdʒənt/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '洗涤剂，洗衣粉', en: 'soap or powder used for washing clothes or dishes' },
      usage: { zh: '可数或不可数；washing detergent。区别于 washing powder（粉状皂粉）。', en: 'Countable or uncountable: washing detergent. Compare washing powder.' },
      collocations: ['bring your own detergent', 'liquid detergent', 'laundry detergent'],
      example: { en: 'Sensitive skin may need a mild detergent.', zh: '敏感皮肤可能要用温和洗涤剂。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtɜː/，/dʒ/ 是破擦音。', en: 'Three syllables with stress on the second; /dʒ/ is an affricate.' },
    },
  ],
  expressions: [
    {
      phrase: 'step out', sentenceIndex: 3,
      meaning: { zh: '走出去，离开房门', en: 'to leave a building and go outside' },
      usage: { zh: '短语动词；step out of the room。另有“出场”之义。', en: 'Phrasal verb: step out of the room. It also means to appear on stage.' },
      example: { en: 'The door locks itself when you step out.', zh: '走出门后门会自动锁上。' },
    },
    {
      phrase: 'clear away', sentenceIndex: 12,
      meaning: { zh: '收拾干净，清理桌面', en: 'to remove things and tidy the space after use' },
      usage: { zh: '可分开；clear away the dishes、clear the table away。', en: 'Separable: clear away the dishes, clear the table away.' },
      example: { en: 'Please clear away your things before nine.', zh: '九点前请把自己的东西收好。' },
    },
    {
      phrase: 'wash them up', sentenceIndex: 18,
      meaning: { zh: '把餐具洗了', en: 'to wash plates, cups and cutlery after a meal' },
      usage: { zh: '英式指洗餐具；代词 them 插在 wash 和 up 之间。美式 wash up 可指洗手洗脸。', en: 'British: wash dishes, with the pronoun between wash and up. American: wash up can mean wash hands and face.' },
      example: { en: 'We wash them up together in the shared kitchen.', zh: '我们在公共厨房一起洗碗。' },
    },
    {
      phrase: 'travel easily', sentenceIndex: 20,
      meaning: { zh: '（声音）传得远，容易传开', en: 'sound carries far through a space' },
      usage: { zh: 'travel 在此表示“传播”；voices travel、the news travelled。', en: 'Travel means to spread here: voices travel, the news travelled.' },
      example: { en: 'Voices travel easily up the wooden stairs.', zh: '说话声顺着木楼梯传得很清楚。' },
    },
    {
      phrase: 'gather on', sentenceIndex: 29,
      meaning: { zh: '集合到某处', en: 'to meet together at a particular place' },
      usage: { zh: '动词短语，后接地点：gather on the path、gather in the yard。', en: 'A verb phrase followed by a place: gather on the path, gather in the yard.' },
      example: { en: 'Guests gather on the path by the gate after the alarm.', zh: '警报响起后客人在门边小路上集合。' },
    },
    {
      phrase: 'forgot yours', sentenceIndex: 32,
      meaning: { zh: '忘记带你的（毛巾）', en: 'left your own towel behind' },
      usage: { zh: '名词性物主代词 yours 代替 your towel；同类还有 mine、hers。', en: 'The possessive yours replaces your towel; compare mine and hers.' },
      example: { en: 'If you forgot yours, we lend one for a small charge.', zh: '忘了带毛巾的话可以付费借用一条。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白里的时间点要分清用途', en: 'Separate each time’s purpose' },
      body: {
        zh: 'Part 2 一段独白会出现多个时间：门禁 eleven、安静时段 ten thirty、厨房关门 eleven、早餐 seven thirty。听到时间先记下它属于哪一项规则，单选 17 考的是安静时段起点，别把关门时间混进去。',
        en: 'One monologue carries several times: door curfew eleven, quiet period ten thirty, kitchen closing eleven, breakfast seven thirty. Note which rule each time belongs to. Choice 17 asks for the quiet start; do not mix in the closing time.',
      },
    },
    {
      title: { zh: '配对题先记地点介词', en: 'Note the place prepositions' },
      body: {
        zh: '六个配对选项都是地点短语，听前各记一个方位词：under、on middle shelf、rack、behind、board、shed。听到物品名（passport、towels、food）时，直接拿方位词去对，不要整句翻译选项。',
        en: 'All six matching options are place phrases. Note one location word per option: under, middle shelf, rack, behind, board, shed. When you hear an item such as passport, towels or food, match the preposition rather than translating the whole option.',
      },
    },
    {
      title: { zh: '表格答案看空格前后的提示词', en: 'Use the words around the gap' },
      body: {
        zh: '第 11 空前是 after、空后是 at night，填时间；第 12 空前是 returned to，填地点；第 13 空前是 name and，填并列名词；第 14 空后是 pounds，填数字。落笔前确认词性和类别，避免把时长或部门名写进去。',
        en: 'Before gap 11 sits after and after it at night, so a time fits. Gap 12 follows returned to, so a place fits. Gap 13 follows name and, so a parallel noun fits. Gap 14 precedes pounds, so a number fits. Confirm the part of speech before writing.',
      },
    },
  ],
};
