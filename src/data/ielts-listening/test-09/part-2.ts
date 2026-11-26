import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 9 · Part 2 — 动物收容所志愿者上岗前说明。原创仿真材料，非官方真题。
 *
 * 独白覆盖班次安排、装备与清洁用品、岗位分工、喂食规范、互动规则、领养日安排，
 * 以及两名特定志愿者各自的任务。
 */
export const test09Part2: ListeningLesson = {
  slug: 'test-09-part-2',
  part: 2,
  status: 'published',
  title: { zh: '动物收容所志愿者说明', en: 'Briefing volunteers at an animal shelter' },
  summary: {
    zh: '收容所协调员向新志愿者介绍当天安排：班次时长、开放时间、手套围裙与消毒用品，新人先分到犬区，水盆清洁频率、喂食分量与观察记录规范，领养日的流程变化，以及两名已登记志愿者的具体任务。',
    en: 'The shelter coordinator briefs new volunteers for the day: shift length, opening time, gloves, apron and disinfectant, the dog section for first-timers, the water-bowl cleaning frequency, feeding portions and health notes, the changed routine on adoption day, and the specific tasks of two signed-up volunteers.',
  },
  accent: { zh: '协调员为澳式口音，语速平稳，便于抓取细节。', en: 'The coordinator has an Australian accent and speaks at a steady pace for detail listening.' },
  speechRate: '+3%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Volunteer shift length', cells: [[{ blank: 11 }, { text: ' hours' }]] },
        { lead: 'Shelter opens to the public at', cells: [[{ blank: 12 }]] },
        { lead: 'Wear rubber gloves and a reusable', cells: [[{ blank: 13 }]] },
        { lead: 'Pens are cleaned with a mild', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Which job is assigned to first-time volunteers?',
          options: [
            { key: 'A', text: 'The cat section' },
            { key: 'B', text: 'The dog section' },
            { key: 'C', text: 'The reception desk' },
          ],
        },
        {
          number: 16,
          stem: 'How often must the water bowls be cleaned?',
          options: [
            { key: 'A', text: 'Once a day' },
            { key: 'B', text: 'Twice a day' },
            { key: 'C', text: 'After every meal' },
          ],
        },
        {
          number: 17,
          stem: 'What rule applies to feeding the animals?',
          options: [
            { key: 'A', text: 'Volunteers may share their own snacks.' },
            { key: 'B', text: 'Only staff may give treats.' },
            { key: 'C', text: 'Animals get measured portions at set times.' },
          ],
        },
        {
          number: 18,
          stem: 'What happens on adoption day?',
          options: [
            { key: 'A', text: 'Animals stay in their pens all morning.' },
            { key: 'B', text: 'Volunteers help introduce visitors to animals.' },
            { key: 'C', text: 'The shelter closes to visitors.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which task does each volunteer do? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Walks the dogs twice a day' },
        { key: 'B', text: 'Brushes the long-haired cats' },
        { key: 'C', text: 'Cleans the kitten pens' },
        { key: 'D', text: 'Answers public questions' },
        { key: 'E', text: 'Prepares adoption forms' },
      ],
      items: [
        { number: 19, text: 'Volunteer in the cat section' },
        { number: 20, text: 'Volunteer near the entrance' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['three', '3'], spoken: 'three hours', evidence: 3,
      explanation: {
        zh: '定位句 3：Each volunteer works a three-hour shift, split between the morning and the afternoon group。半天和全天是分组安排，不是班次长度；空格后已印 hours。',
        en: 'Sentence 3: "Each volunteer works a three-hour shift, split between the morning and the afternoon group". Morning and afternoon groups are splits, not the shift length; hours is already printed.',
      },
    },
    {
      number: 12, accepted: ['ten', '10'], spoken: 'ten', evidence: 4,
      explanation: {
        zh: '定位句 4：The shelter opens to the public at ten。动物在开放前喂完，那是内部时间；领养日提前到九点是另一场合的安排，不要填进普通开放时间。',
        en: 'Sentence 4: "The shelter opens to the public at ten". Feeding happens before opening as an internal task; the nine o’clock early opening belongs to adoption day only.',
      },
    },
    {
      number: 13, accepted: ['apron'], evidence: 5,
      explanation: {
        zh: '定位句 5：a pair of rubber gloves and a reusable apron。手套已印在题干里，并列的另一件装备是围裙；reusable 是修饰词，答案填 apron。',
        en: 'Sentence 5: "a pair of rubber gloves and a reusable apron". Gloves are already in the stem, and the matching item is the apron; reusable is a modifier, so the answer is apron.',
      },
    },
    {
      number: 14, accepted: ['disinfectant'], evidence: 6,
      explanation: {
        zh: '定位句 6：The cleaning product we use in the pens is a mild disinfectant。志愿者不能自带喷剂，那是被禁止的物品；空格问使用的清洁用品本身。',
        en: 'Sentence 6: "The cleaning product we use in the pens is a mild disinfectant". Volunteers must not bring home sprays, which are prohibited; the blank asks for the product actually used.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 8,
      explanation: {
        zh: '定位句 8：First-time volunteers are asked to start in the dog section。猫区留给有经验的人；前台接待在全段没有作为新人岗位出现。',
        en: 'Sentence 8: "First-time volunteers are asked to start in the dog section". The cat section suits experienced people, and the reception desk never appears as a first-timer role.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：Water bowls should be cleaned twice a day, once after the morning feed and again before the doors open in the afternoon。两次时点已明确列出；每餐后清洁在原文中没有依据。',
        en: 'Sentence 11: "Water bowls should be cleaned twice a day, once after the morning feed and again before the doors open in the afternoon". The two times are listed; cleaning after every meal has no basis in the recording.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 13,
      explanation: {
        zh: '定位句 13：The dogs are fed measured portions at set times。自己带零食被句 12 明确禁止，只给员工喂零食也不是原文规则；核心规则是分量固定、时间固定。',
        en: 'Sentence 13: "The dogs are fed measured portions at set times". Homemade snacks are banned in sentence 12, and staff-only treats are never stated; the rule is fixed portions at fixed times.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：volunteers help with introductions rather than deep cleaning。领养日公众可以在社交室与动物见面；全天关在犬舍、闭门谢客都与原文相反。',
        en: 'Sentence 17: "volunteers help with introductions rather than deep cleaning". Visitors meet animals in the social room; keeping animals in pens all morning and closing the shelter contradict the recording.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：one of you will spend the afternoon brushing the long-haired cats。猫区任务是给长毛猫梳毛；遛狗、清理猫崽笼舍属于其它选项的干扰描述。',
        en: 'Sentence 19: "one of you will spend the afternoon brushing the long-haired cats". The cat-section task is brushing long-haired cats; walking dogs and cleaning kitten pens are distractor options.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 20,
      explanation: {
        zh: '定位句 20：the other volunteer’s job is to answer public questions and point people toward the social room。入口岗位接待访客咨询；准备领养表是桌上的材料，不是该志愿者的动作。',
        en: 'Sentence 20: "the other volunteer’s job is to answer public questions and point people toward the social room". The entrance role handles visitor enquiries; adoption forms are materials on the table, not this volunteer’s task.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Right, everyone, can I have your attention for a few minutes before you start your first shift?' },
    { speaker: 'coordinator', text: 'I’m Mara, the volunteer coordinator here at Greenfield Animal Shelter, and I’ll walk you through today’s arrangements.' },
    { speaker: 'coordinator', text: 'First, a few notes on how the day runs.' },
    { speaker: 'coordinator', text: 'Each volunteer works a shift of three hours, split between the morning and the afternoon group.' },
    { speaker: 'coordinator', text: 'The shelter opens to the public at ten, and all animals are fed before that time.' },
    { speaker: 'coordinator', text: 'You’ll be given a pair of rubber gloves and a reusable apron when you sign in at the office.' },
    { speaker: 'coordinator', text: 'The cleaning product we use in the pens is a mild disinfectant, so please do not bring your own sprays from home.' },
    { speaker: 'coordinator', text: 'Now let’s look at the jobs available today.' },
    { speaker: 'coordinator', text: 'First-time volunteers are asked to start in the dog section, where the animals settle more easily with new people.' },
    { speaker: 'coordinator', text: 'The cat section is quieter, and it suits volunteers who have handled animals before.' },
    { speaker: 'coordinator', text: 'Each morning the dog pens are swept and washed, and the water bowls are emptied and refilled.' },
    { speaker: 'coordinator', text: 'Water bowls should be cleaned twice a day, once after the morning feed and again before the doors open in the afternoon.' },
    { speaker: 'coordinator', text: 'Under no circumstances should you feed the animals treats from your own bag.' },
    { speaker: 'coordinator', text: 'The dogs are fed measured portions at set times, and any extra food can upset their stomachs.' },
    { speaker: 'coordinator', text: 'If an animal looks unwell, note it on the board by the kitchen and tell a member of staff, and do not give it medicine yourself.' },
    { speaker: 'coordinator', text: 'Now for the two volunteers who are already signed up for specific roles.' },
    { speaker: 'coordinator', text: 'Next Saturday is our adoption day, and that changes the normal routine for everyone.' },
    { speaker: 'coordinator', text: 'During adoption day the public can meet animals in the social room, and volunteers help with introductions rather than deep cleaning.' },
    { speaker: 'coordinator', text: 'We also need two people to stand near the entrance and answer questions about the animals’ history and care.' },
    { speaker: 'coordinator', text: 'In the cat section, one of you will spend the afternoon brushing the long-haired cats that do not tolerate pens being washed.' },
    { speaker: 'coordinator', text: 'Near the entrance, the other volunteer’s job is to answer public questions and point people toward the social room.' },
    { speaker: 'coordinator', text: 'Before we split up, a few rules about how you interact with the animals.' },
    { speaker: 'coordinator', text: 'Always approach an animal slowly, and let it sniff your hand before you reach out to stroke it.' },
    { speaker: 'coordinator', text: 'Never lift a cat from under its front legs, and never pull a dog’s tail or ears.' },
    { speaker: 'coordinator', text: 'If a dog turns its head away or flattens its ears, give it space and call a staff member over.' },
    { speaker: 'coordinator', text: 'The pens are washed in a fixed order, starting with the smallest kennels and finishing with the outdoor runs.' },
    { speaker: 'coordinator', text: 'Each pen gets fresh bedding once a day, and any wet straw is put in the green bin at the back.' },
    { speaker: 'coordinator', text: 'The kitchen is off limits to volunteers except when you are helping with the morning feed.' },
    { speaker: 'coordinator', text: 'If you drop food on the floor, pick it up straight away, because it attracts insects and rodents.' },
    { speaker: 'coordinator', text: 'At twelve thirty the morning group hands over to the afternoon group, and you should report to the office before leaving.' },
    { speaker: 'coordinator', text: 'On adoption day we open an hour earlier, at nine, and the adoption forms are kept on the table by the social room.' },
    { speaker: 'coordinator', text: 'Families who arrive with children should be reminded that the animals need a calm environment.' },
    { speaker: 'coordinator', text: 'If a visitor asks whether an animal can go home that day, explain that the team checks each home first.' },
    { speaker: 'coordinator', text: 'The shelter runs on donations, so any spare towels or blankets are always welcome at the front desk.' },
    { speaker: 'coordinator', text: 'You will receive a short briefing sheet before your shift, and the contact number for the duty officer is printed at the top.' },
    { speaker: 'coordinator', text: 'Please keep your phones on silent while you are in the animal areas, and do not take photos of visitors.' },
    { speaker: 'coordinator', text: 'At the end of the day, return your gloves and apron to the office, and hang them on the marked hooks.' },
    { speaker: 'coordinator', text: 'Most volunteers say the first shift feels tiring, but the animals make it worthwhile.' },
    { speaker: 'coordinator', text: 'Any questions before we begin?' },
  ],
  vocabulary: [
    {
      term: 'shelter', phonetic: '/ˈʃeltə/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '收容所，庇护所', en: 'a place where homeless animals are kept and cared for' },
      usage: { zh: 'animal shelter 固定搭配；引申义为“躲避处”。', en: 'Animal shelter is a fixed collocation; the broader sense is a place of protection.' },
      collocations: ['an animal shelter', 'the local shelter', 'run a shelter'],
      example: { en: 'Greenfield Shelter cares for dogs and cats until they are adopted.', zh: '格林菲尔德收容所在动物被领养前照料它们。' },
      listening: { zh: '双音节，首音节 /ˈʃel/，词尾 -ter 弱读 /tə/。', en: 'Two syllables with stress on the first; -ter reduces to /tə/.' },
    },
    {
      term: 'shift', phonetic: '/ʃɪft/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '值班班次，轮班时段', en: 'a scheduled period of work during the day' },
      usage: { zh: 'morning shift、afternoon shift、work a shift；动词 shift 意为“移动”。', en: 'Morning shift, afternoon shift, work a shift; as a verb it means move.' },
      collocations: ['a three-hour shift', 'the morning shift', 'hand over a shift'],
      example: { en: 'The morning group finishes its shift at twelve thirty.', zh: '上午组在十二点半结束班次。' },
      listening: { zh: '短元音 /ɪ/，结尾 /ft/ 两个辅音都要读出。', en: 'Short /ɪ/; pronounce both final consonants /ft/.' },
    },
    {
      term: 'disinfectant', phonetic: '/ˌdɪsɪnˈfektənt/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '消毒剂', en: 'a liquid used to kill germs on surfaces' },
      usage: { zh: '可数或不可数；动词 disinfect，形容词 disinfected。', en: 'Countable or uncountable; the verb is disinfect and the adjective disinfected.' },
      collocations: ['a mild disinfectant', 'clean with disinfectant', 'pet-safe disinfectant'],
      example: { en: 'The pens are wiped with a mild disinfectant each morning.', zh: '每天上午围栏都用温和消毒剂擦拭。' },
      listening: { zh: '四个音节，重音在 /ˈfek/；注意 dis- 前缀不要漏。', en: 'Four syllables with stress on /ˈfek/; keep the dis- prefix.' },
    },
    {
      term: 'pens', phonetic: '/penz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '（动物）围栏，圈舍', en: 'an enclosed area where an animal is kept' },
      usage: { zh: '动物场景指圈舍；常用义“钢笔”靠语境区分。', en: 'In animal contexts it means an enclosure; the pen meaning a writing tool is a homonym.' },
      collocations: ['the dog pens', 'wash the pen', 'the outdoor pens'],
      example: { en: 'Each morning the dog pens are swept and washed.', zh: '每天上午犬舍都要清扫冲洗。' },
      listening: { zh: '短元音 /e/，与 pan 对比口型更小。', en: 'Short /e/; the mouth is narrower than for pan.' },
    },
    {
      term: 'portions', phonetic: '/ˈpɔːʃnz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '（食物）一份，分量', en: 'a measured amount of food given to one animal' },
      usage: { zh: 'measured portion 是喂养高频搭配；a portion of 也可指“一部分”。', en: 'Measured portion is common in feeding; a portion of can also mean a share.' },
      collocations: ['a measured portion', 'large portions', 'a portion of food'],
      example: { en: 'Each dog receives a measured portion at set times.', zh: '每条狗在固定时间拿到分量固定的一份食物。' },
      listening: { zh: '双音节，重音在前；/ʃn/ 成音节，不要加 /ə/。', en: 'Two syllables with stress first; /ʃn/ forms the final syllable.' },
    },
    {
      term: 'adoption', phonetic: '/əˈdɒpʃn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '领养（动物）', en: 'taking an animal from a shelter into a permanent home' },
      usage: { zh: 'adoption day、adoption forms；动词 adopt 也指采纳意见。', en: 'Adoption day, adoption forms; the verb adopt also means accept an idea.' },
      collocations: ['adoption day', 'an adoption form', 'the adoption process'],
      example: { en: 'On adoption day visitors meet the animals in the social room.', zh: '领养日访客在社交室与动物见面。' },
      listening: { zh: '重音在第二音节 /ˈdɒp/，尾音 /ʃn/ 轻读。', en: 'Stress the second syllable; the ending /ʃn/ is light.' },
    },
    {
      term: 'introductions', phonetic: '/ˌɪntrəˈdʌkʃnz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '引见，介绍相识', en: 'bringing people and animals together so they can meet safely' },
      usage: { zh: 'help with introductions；动词 introduce，介词用 to。', en: 'Help with introductions; the verb is introduce with to.' },
      collocations: ['help with introductions', 'a careful introduction', 'the introduction session'],
      example: { en: 'Volunteers stay nearby during introductions between visitors and dogs.', zh: '访客与狗见面时，志愿者在旁边陪同。' },
      listening: { zh: '五个音节，重音落在 /ˈdʌk/，不要漏中间的 /rə/。', en: 'Five syllables with stress on /ˈdʌk/; do not skip the middle /rə/.' },
    },
    {
      term: 'bedding', phonetic: '/ˈbedɪŋ/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '（动物）垫料，窝草', en: 'straw or soft material laid in a pen for animals to lie on' },
      usage: { zh: '不可数；fresh bedding、change the bedding。人用 bedding 指床品。', en: 'Uncountable: fresh bedding, change the bedding. For people it means bed linen.' },
      collocations: ['fresh bedding', 'change the bedding', 'wet bedding'],
      example: { en: 'Each pen gets fresh bedding once a day.', zh: '每个圈舍每天换一次垫料。' },
      listening: { zh: '双音节，-ing 读 /ɪŋ/，不要发成 /ɪn/。', en: 'Two syllables; -ing ends in /ɪŋ/, not /ɪn/.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 1,
      meaning: { zh: '带你逐项过一遍，讲解流程', en: 'to explain a process step by step to someone' },
      usage: { zh: 'walk through 后接流程、清单；口语中常带宾语 you。', en: 'Follow walk through with a process or list; it often carries you in speech.' },
      example: { en: 'I’ll walk you through today’s arrangements before you start.', zh: '开工前我带你把今天的安排逐项讲一遍。' },
    },
    {
      phrase: 'sign in', sentenceIndex: 5,
      meaning: { zh: '签到，登记进入', en: 'to record your arrival at an event or workplace' },
      usage: { zh: '反义是 sign out；后接地点时用 sign in at。', en: 'The opposite is sign out; sign in at follows the location.' },
      example: { en: 'Sign in at the office before you put on your gloves.', zh: '戴手套前先到办公室签到。' },
    },
    {
      phrase: 'under no circumstances', sentenceIndex: 12,
      meaning: { zh: '在任何情况下都不', en: 'never, no matter what happens' },
      usage: { zh: '正式强调短语，置于句首时句子部分倒装：under no circumstances should you。', en: 'A strong formal phrase; at the front it triggers inversion: under no circumstances should you.' },
      example: { en: 'Under no circumstances should you give the animals your own snacks.', zh: '无论如何都不能把自己带的零食给动物。' },
    },
    {
      phrase: 'off limits', sentenceIndex: 27,
      meaning: { zh: '禁止进入，不对外人开放', en: 'not allowed to be entered by a particular group' },
      usage: { zh: '作表语；off limits to someone，后接禁止对象。', en: 'Predicative: off limits to someone, with the excluded group after to.' },
      example: { en: 'The kitchen is off limits to volunteers unless they help with feeding.', zh: '除协助喂食外，志愿者不得进入厨房。' },
    },
    {
      phrase: 'hands over', sentenceIndex: 29,
      meaning: { zh: '交接，把职责交给下一组', en: 'to pass responsibility from one group to the next' },
      usage: { zh: '可分短语动词；hand over to the next group。名词 handover 为一个词。', en: 'Separable: hand over to the next group. The noun handover is one word.' },
      example: { en: 'The morning group hands over to the afternoon group at twelve thirty.', zh: '上午组十二点半与下午组交接。' },
    },
    {
      phrase: 'on silent', sentenceIndex: 35,
      meaning: { zh: '调到静音模式', en: 'set to the mode that makes no sound' },
      usage: { zh: '手机用语；同义搭配是 keep the phone silent。', en: 'Phone language; a paraphrase is keep the phone silent.' },
      example: { en: 'Keep your phone on silent in the animal areas.', zh: '在动物活动区请把手机调静音。' },
    },
  ],
  tips: [
    {
      title: { zh: '先听身份，再记岗位', en: 'Identify the group before noting the role' },
      body: {
        zh: '第 15 题问新人岗位，句 8 先讲新人去犬区，句 9 才说猫区留给有经验者。Part 2 独白常按人群分组介绍岗位，听题时在题干旁标出 first-time、experienced 等限定词，避免把后一组的岗位写进前一题。',
        en: 'Item 15 asks for the first-timer role; sentence 8 places newcomers in the dog section, and sentence 9 reserves the cat section for experienced people. Part 2 monologues often assign roles by group, so mark qualifiers such as first-time and experienced beside the stem before the recording.',
      },
    },
    {
      title: { zh: '频率题盯住次数与时点', en: 'Frequency items: watch the count and the times' },
      body: {
        zh: '第 16 题考水盆清洁频率，句 11 给出 twice a day 和两个具体时点。听到 once、twice、every 这类频率词时立刻记录，并把后面列出的时点写在旁边，用来核对是否真为同一动作的次数。',
        en: 'Item 16 tests the water-bowl frequency, and sentence 11 gives twice a day with two times. When you hear once, twice or every, note the count immediately and write the listed times beside it to check they belong to the same action.',
      },
    },
    {
      title: { zh: '配对题先划掉已用选项', en: 'Cross off used options in matching' },
      body: {
        zh: '第 19、20 题分别对应猫区和入口岗位，五个选项中有三个干扰项。听独白前把 A 到 E 快速读一遍，听到一个确定搭配就划掉对应字母，后面的题目只在剩余选项里判断，减少重复比较。',
        en: 'Items 19 and 20 match the cat section and the entrance, with three distractors among A to E. Read A to E before the recording, cross off each letter once it matches, and judge the next item only among the remaining options to cut down repetition.',
      },
    },
  ],
};
