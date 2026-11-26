import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 24 · Part 2 — 烹饪课开场说明（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 课程顺序：今日菜谱与食材来源 → 灶台编号与成品带走 → 刀具选择、香草来源、每组人数、
 * 剩酱处理（单选 15–18）→ 备料岗与炉灶岗分工（配对 19–20）。开场用现场指令，不用 welcome to。
 */
export const test24Part2: ListeningLesson = {
  slug: 'test-24-part-2',
  part: 2,
  status: 'published',
  title: { zh: '烹饪课开场说明', en: 'Introducing a cookery school class' },
  summary: {
    zh: '烹饪课导师开场说明：今日做番茄意面，蔬菜来自城外本地农场，香草种在学校窗台花箱，每组在三号灶台操作，成品酱汁装罐带走；随后讲解切硬菜用主厨刀、香草来源、每组三人、剩酱入罐，以及备料岗洗菜切菜、炉灶岗控火搅拌两项分工。',
    en: 'The tutor briefs the cookery class: today’s tomato pasta uses local-farm vegetables, herbs from the school window boxes, stove three per group, and sauce taken home in a jar. Singles cover the chef’s knife, herb source, three cooks per group and leftover sauce; the match pairs prep with chopping and stove with heat control.',
  },
  accent: { zh: '导师为澳式口音，现场说明节奏平稳，安全要点放慢。', en: 'The tutor speaks with an Australian accent at a steady class pace, slowing down for safety points.' },
  speechRate: '+3%',
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Today’s dish: tomato', cells: [[{ blank: 11 }]] },
        { lead: 'Vegetables from a local', cells: [[{ blank: 12 }]] },
        { lead: 'Groups work at stove number', cells: [[{ blank: 13 }]] },
        { lead: 'Take home your own', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Which knife should you use for the hard vegetables?',
          options: [
            { key: 'A', text: 'A broad chef’s knife' },
            { key: 'B', text: 'The small herb blade' },
            { key: 'C', text: 'A serrated bread knife' },
          ],
        },
        {
          number: 16,
          stem: 'Where do the fresh herbs used in the dish come from?',
          options: [
            { key: 'A', text: 'The local farm outside town' },
            { key: 'B', text: 'The school’s own window boxes' },
            { key: 'C', text: 'The corner shop down the road' },
          ],
        },
        {
          number: 17,
          stem: 'How many cooks work at each stove?',
          options: [
            { key: 'A', text: 'Two' },
            { key: 'B', text: 'Three' },
            { key: 'C', text: 'Four' },
          ],
        },
        {
          number: 18,
          stem: 'What happens to any leftover sauce after the tasting?',
          options: [
            { key: 'A', text: 'It is thrown away after tasting' },
            { key: 'B', text: 'It goes into your own jar' },
            { key: 'C', text: 'It is kept for the next class' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which role matches each duty? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'washes and chops the vegetables' },
        { key: 'B', text: 'manages the heat on the burner' },
        { key: 'C', text: 'plates the finished dishes' },
        { key: 'D', text: 'writes the recipe cards' },
      ],
      items: [
        { number: 19, text: 'the prep role' },
        { number: 20, text: 'the stove role' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['pasta'], evidence: 1,
      explanation: {
        zh: '定位句 1：The dish on the menu is a tomato pasta, slow cooked with garlic and herbs。今日菜品是番茄意面，填 pasta。',
        en: 'Sentence 1: "the dish on the menu is a tomato pasta", so fill pasta.',
      },
    },
    {
      number: 12, accepted: ['farm'], evidence: 3,
      explanation: {
        zh: '定位句 3：Most of the vegetables come from a local farm just outside town。蔬菜来自城外本地农场，填 farm。句 5 的窗台花箱是香草来源，不是蔬菜来源。',
        en: 'Sentence 3: vegetables come from "a local farm just outside town", so fill farm. The window boxes in sentence 5 supply herbs, not vegetables.',
      },
    },
    {
      number: 13, accepted: ['three', '3'], evidence: 11,
      explanation: {
        zh: '定位句 11：Your group works at stove number three, beside the window。本组在三号灶台，填 three。',
        en: 'Sentence 11: your group works "at stove number three", so fill three.',
      },
    },
    {
      number: 14, accepted: ['sauce'], evidence: 12,
      explanation: {
        zh: '定位句 12：you take home your own sauce in a sealed jar。带走的是自己做的酱汁，填 sauce；意面在课堂内品尝。',
        en: 'Sentence 12: you take home "your own sauce in a sealed jar", so fill sauce. The pasta itself is tasted in class.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：You will be given a broad chef’s knife; the small blade is only for herbs。硬菜用宽主厨刀，对应 A。小刀片只切香草，锯齿面包刀未提及。',
        en: 'Sentence 15: a "broad chef’s knife" is provided, matching A. The small blade is for herbs only; the bread knife is not mentioned.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：They grow in the school’s own window boxes, not the outside farm。香草来自学校窗台花箱，对应 B。城外农场供蔬菜，路边商店未提及。',
        en: 'Sentence 17: herbs grow in "the school’s own window boxes, not the outside farm", matching B. The outside farm supplies vegetables; the corner shop is not mentioned.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Three people to a group, rotating roles so everyone chops and stirs once。每组三人，对应 B。四是组数，不是每组人数。',
        en: 'Sentence 19: "three people to a group", matching B. Four is the number of groups, not the size of each group.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：Leftover sauce can be poured into your jar; we do not throw cooked food away。剩酱装进自己的罐子，对应 B。A 的丢弃与原文相反，留给下一班未提及。',
        en: 'Sentence 21: leftover sauce "can be poured into your jar", matching B. Throwing food away contradicts the transcript, and keeping it for the next class is not mentioned.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：The prep role washes and chops the vegetables before anything goes near the heat。备料岗洗菜切菜，对应 A。',
        en: 'Sentence 24: the prep role "washes and chops the vegetables", matching A.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The stove role manages the heat on the burner and stirs the sauce steadily。炉灶岗控火搅拌，对应 B。装盘、写菜谱卡是干扰项。',
        en: 'Sentence 25: the stove role "manages the heat on the burner", matching B. Plating and recipe cards are distractors.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Aprons on, and let’s look at what we cook together today.' },
    { speaker: 'tutor', text: 'The dish on the menu is a tomato pasta, slow cooked with garlic and herbs.' },
    { speaker: 'tutor', text: 'We will finish it with fresh basil at the very end.' },
    { speaker: 'tutor', text: 'Most of the vegetables come from a local farm just outside town.' },
    { speaker: 'tutor', text: 'The tomatoes are picked ripe in the morning, so they need no long boiling.' },
    { speaker: 'tutor', text: 'The herbs, though, grow in our own window boxes along the kitchen wall.' },
    { speaker: 'tutor', text: 'Before we touch a knife, please check the blade is firmly fixed to the handle.' },
    { speaker: 'tutor', text: 'A loose handle is the most common cause of slips in this kitchen.' },
    { speaker: 'tutor', text: 'Always cut away from your body, and keep the fingers tucked under.' },
    { speaker: 'tutor', text: 'Put any used knife on the side board, never left loose in the sink.' },
    { speaker: 'tutor', text: 'Today there are four groups, and each group shares one stove.' },
    { speaker: 'tutor', text: 'Your group works at stove number three, beside the window.' },
    { speaker: 'tutor', text: 'At the end of the class, you take home your own sauce in a sealed jar.' },
    { speaker: 'tutor', text: 'The pasta itself we taste here, but the sauce keeps for three days in a cool place.' },
    { speaker: 'tutor', text: 'Which knife should you use for the hard vegetables?' },
    { speaker: 'tutor', text: 'You will be given a broad chef’s knife; the small blade is only for herbs.' },
    { speaker: 'tutor', text: 'Where do the fresh herbs used in the dish come from?' },
    { speaker: 'tutor', text: 'They grow in the school’s own window boxes, not the outside farm.' },
    { speaker: 'tutor', text: 'How many cooks work at each stove?' },
    { speaker: 'tutor', text: 'Three people to a group, rotating roles so everyone chops and stirs once.' },
    { speaker: 'tutor', text: 'What happens to any food left after the tasting?' },
    { speaker: 'tutor', text: 'Leftover sauce can be poured into your jar; we do not throw cooked food away.' },
    { speaker: 'tutor', text: 'Each group splits into two roles for the first half hour.' },
    { speaker: 'tutor', text: 'One person prepares the ingredients while the other watches the pan.' },
    { speaker: 'tutor', text: 'The prep role washes and chops the vegetables before anything goes near the heat.' },
    { speaker: 'tutor', text: 'The stove role manages the heat on the burner and stirs the sauce steadily.' },
    { speaker: 'tutor', text: 'After twenty minutes you swap roles, so nobody is stuck on peeling all afternoon.' },
    { speaker: 'tutor', text: 'The recipe card lists both roles in the order you will use them.' },
    { speaker: 'tutor', text: 'If a pan begins to smoke, turn the heat down and tell me straight away.' },
    { speaker: 'tutor', text: 'Salt goes in little by little, because reducing the sauce concentrates it.' },
    { speaker: 'tutor', text: 'Taste with a clean spoon each time, and never reuse the spoon in the jar.' },
    { speaker: 'tutor', text: 'The floor near the sinks gets wet, so wipe any spill at once.' },
    { speaker: 'tutor', text: 'Closed shoes are still required today, even though the class is indoors.' },
    { speaker: 'tutor', text: 'The dairy we use comes from the same region as the vegetables.' },
    { speaker: 'tutor', text: 'Butter is only added off the heat, after the pan has come off the burner.' },
    { speaker: 'tutor', text: 'Our waste bins sort compost, glass and general rubbish at the back.' },
    { speaker: 'tutor', text: 'Please keep your recipe card until you have filled your jar.' },
    { speaker: 'tutor', text: 'The washing up happens in pairs, and the drying rack is above the left sink.' },
    { speaker: 'tutor', text: 'If you have a food allergy, you should have noted it on the entry form.' },
    { speaker: 'tutor', text: 'We keep separate boards for the nuts and the dairy just in case.' },
    { speaker: 'tutor', text: 'The class photo is taken once the jars are labelled, near the door.' },
    { speaker: 'tutor', text: 'You can collect a printed copy from reception before you leave.' },
    { speaker: 'tutor', text: 'Any questions about the timing, raise your hand before we start chopping.' },
    { speaker: 'tutor', text: 'The class runs for two hours before the jars go home.' },
    { speaker: 'tutor', text: 'Wash your hands again once the chopping is finished.' },
  ],
  vocabulary: [
    {
      term: 'aprons', phonetic: '/ˈeɪprənz/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '围裙', en: 'the protective garment tied over clothes in the kitchen' },
      usage: { zh: '可数；put on an apron、tie the apron。', en: 'Countable: put on an apron, tie the apron.' },
      collocations: ['put on an apron', 'a kitchen apron', 'tie the apron'],
      example: { en: 'Aprons on before we start chopping.', zh: '切菜前先系好围裙。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈeɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'ingredients', phonetic: '/ɪnˈɡriːdiənts/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '食材，原料', en: 'the food item used in the recipe' },
      usage: { zh: '可数；the ingredients list、prepare the ingredients。', en: 'Countable: the ingredients list, prepare the ingredients.' },
      collocations: ['the ingredients list', 'fresh ingredients', 'prepare the ingredients'],
      example: { en: 'One person prepares the ingredients first.', zh: '一人先备齐食材。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡriː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'burner', phonetic: '/ˈbɜːnə/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '（炉灶）炉头，灶眼', en: 'the ring on the stove that heats the pan' },
      usage: { zh: '可数；on the burner、turn the burner down。', en: 'Countable: on the burner, turn the burner down.' },
      collocations: ['on the burner', 'the gas burner', 'the hot burner'],
      example: { en: 'The stove role manages the heat on the burner.', zh: '炉灶岗负责炉头火候。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbɜː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'sealed', phonetic: '/siːld/', partOfSpeech: 'adj.', sentenceIndex: 12,
      meaning: { zh: '密封的', en: 'closed tightly so air or liquid cannot escape' },
      usage: { zh: '形容词；a sealed jar、sealed lid。动词 seal。', en: 'Adjective: a sealed jar; the verb is seal.' },
      collocations: ['a sealed jar', 'a sealed lid', 'keep it sealed'],
      example: { en: 'Take the sauce home in a sealed jar.', zh: '酱汁装密封罐带走。' },
      listening: { zh: '单音节，尾音 /ld/ 完整读出。', en: 'One syllable; keep the final /ld/.' },
    },
    {
      term: 'recipe', phonetic: '/ˈresəpi/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '菜谱，做法单', en: 'the written list of steps and amounts' },
      usage: { zh: '可数；the recipe card、follow the recipe。', en: 'Countable: the recipe card, follow the recipe.' },
      collocations: ['the recipe card', 'follow the recipe', 'write a recipe'],
      example: { en: 'The card lists both roles in order.', zh: '卡片按顺序列出两个岗位。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈres/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'basil', phonetic: '/ˈbæzl/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '罗勒（香草）', en: 'the fragrant green herb added at the end' },
      usage: { zh: '不可数；fresh basil、a few basil leaves。', en: 'Uncountable: fresh basil, a few basil leaves.' },
      collocations: ['fresh basil', 'a basil leaf', 'chopped basil'],
      example: { en: 'Finish the dish with fresh basil.', zh: '最后撒上新鲜罗勒。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbæ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'spill', phonetic: '/spɪl/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '（地面上的）泼洒液体', en: 'the wet patch left when liquid tips over' },
      usage: { zh: '可数/不可数；wipe the spill、a spill on the floor。动词同形。', en: 'Countable or uncountable; it is also a verb.' },
      collocations: ['wipe the spill', 'a spill on the floor', 'clean the spill'],
      example: { en: 'Wipe any spill on the floor at once.', zh: '立刻擦掉地上的泼洒液体。' },
      listening: { zh: '单音节，与 hill 押韵。', en: 'One syllable, rhyming with hill.' },
    },
  ],
  expressions: [
    {
      phrase: 'cut away from', sentenceIndex: 8,
      meaning: { zh: '朝远离身体的方向切', en: 'to slice so the blade moves away from the body' },
      usage: { zh: '安全短语；cut away from yourself、cut away from the hand。', en: 'Safety phrase: cut away from yourself or the hand.' },
      example: { en: 'Always cut away from your body.', zh: '刀刃始终朝远离身体的方向。' },
    },
    {
      phrase: 'near the heat', sentenceIndex: 24,
      meaning: { zh: '靠近炉火处', en: 'close to the burner or pan on the stove' },
      usage: { zh: '介词短语；before anything goes near the heat。', en: 'Before anything goes near the heat means before cooking starts.' },
      example: { en: 'Chop the vegetables before they go near the heat.', zh: '菜下锅前先切好。' },
    },
    {
      phrase: 'swap roles', sentenceIndex: 26,
      meaning: { zh: '交换岗位', en: 'to change duties with the partner' },
      usage: { zh: '动宾短语；swap roles after twenty minutes。', en: 'Swap roles; compare rotate roles.' },
      example: { en: 'You swap roles after twenty minutes.', zh: '二十分钟后互换岗位。' },
    },
    {
      phrase: 'off the heat', sentenceIndex: 34,
      meaning: { zh: '离火，离开炉灶热源', en: 'away from the burner, no longer being heated' },
      usage: { zh: '烹饪短语；add butter off the heat、take the pan off the heat。', en: 'Add butter off the heat; take the pan off the heat.' },
      example: { en: 'Butter goes in off the heat.', zh: '黄油离火后再加。' },
    },
    {
      phrase: 'little by little', sentenceIndex: 29,
      meaning: { zh: '一点一点地，分次加入', en: 'in small amounts one after another' },
      usage: { zh: '固定短语；add salt little by little。', en: 'Add salt little by little, a pinch at a time.' },
      example: { en: 'Salt goes in little by little.', zh: '盐一点点加进去。' },
    },
  ],
  tips: [
    {
      title: { zh: '区分两类食材来源', en: 'Split farm and herb sources' },
      body: {
        zh: '蔬菜来自城外本地农场，香草来自学校窗台花箱。单选题问香草来源时别被 farm 带跑；笔记填空第 12 题问蔬菜来源才填 farm。',
        en: 'Vegetables come from the outside farm; herbs from the school window boxes. For the herb question do not follow farm; only fill farm for the vegetable note.',
      },
    },
    {
      title: { zh: '刀具按用途对号入座', en: 'Match knife to its use' },
      body: {
        zh: '宽主厨刀切硬菜，小刀片只切香草。听到 broad chef’s knife、small blade only for herbs 就把用途和刀具对应起来，锯齿刀是未出现的干扰。',
        en: 'The broad chef’s knife handles hard vegetables; the small blade is herbs only. Match broad chef’s knife and small blade only for herbs; the serrated knife is a distractor.',
      },
    },
    {
      title: { zh: '配对抓岗位动作动词', en: 'Match role to action verbs' },
      body: {
        zh: '配对两题先看岗位名：备料岗对应 wash and chop，炉灶岗对应 manage the heat and stir。装盘、写卡片是干扰项，录音中未分配给任何岗位。',
        en: 'Read the role first: prep matches wash and chop; stove matches manage the heat and stir. Plating and recipe cards are unassigned distractors.',
      },
    },
  ],
};
