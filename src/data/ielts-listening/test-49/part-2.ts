import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 49 · Part 2 — 山地救援队向新人讲解出队流程。原创仿真材料，非官方真题。
 *
 * 单人独白：呼叫记录流程、随身装备清单、天气判断、志愿者训练安排、
 * 冬季事故案例、各岗位分工与安全习惯。
 */
export const test49Part2: ListeningLesson = {
  slug: 'test-49-part-2',
  part: 2,
  status: 'published',
  title: { zh: '山地救援队讲解', en: 'A mountain rescue team talk' },
  summary: {
    zh: '救援队队员向新人讲解一次出队的完整流程：电话先记到控制中心、每人随身的防水外套与医疗包、如何对照山区预报判断云与雾、新志愿者四周的训练安排、去年冬天的踝关节事故案例，以及控制员、领队、医官、报务员和搜救犬 handler 各自的分工。',
    en: 'A rescuer explains a call-out from start to finish: the call logged at the control centre, the waterproof jacket and first-aid pouch each member carries, how the mountain forecast, cloud and fog are read, the four-week training for new volunteers, last winter’s ankle injury case, and the roles of controller, leader, medical officer, radio operator and dog handler.',
  },
  accent: { zh: '讲解者为澳式口音，关键流程会放慢重复。', en: 'The speaker has an Australian accent and repeats key procedures slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'rescuer', label: 'RESCUER', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'First call logged at the', cells: [[{ blank: 11 }, { text: ' centre' }]] },
        { lead: 'Every rescuer carries a waterproof', cells: [[{ blank: 12 }]] },
        { lead: 'Weather check: the', cells: [[{ blank: 13 }, { text: ' forecast issued at six each morning' }]] },
        { lead: 'New members: a four-week', cells: [[{ blank: 14 }, { text: ' before a real call' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What is the first thing the team needs from the caller?',
          options: [
            { key: 'A', text: 'the missing person’s last known location' },
            { key: 'B', text: 'the injured walker’s next of kin' },
            { key: 'C', text: 'the number of other walkers nearby' },
          ],
        },
        {
          number: 16,
          stem: 'Why does the team watch low cloud over the peaks?',
          options: [
            { key: 'A', text: 'It usually brings rain fairly soon.' },
            { key: 'B', text: 'It marks a safe route to the summit.' },
            { key: 'C', text: 'It shows where the path ends.' },
          ],
        },
        {
          number: 17,
          stem: 'What do trainees do on the first two weekends?',
          options: [
            { key: 'A', text: 'They follow an experienced rescuer without medical duties.' },
            { key: 'B', text: 'They lead a small search team on their own.' },
            { key: 'C', text: 'They teach first aid to new members.' },
          ],
        },
        {
          number: 18,
          stem: 'In the winter case, what did the medical officer do?',
          options: [
            { key: 'A', text: 'He drove the casualty to the hospital.' },
            { key: 'B', text: 'He recorded the weather for the base.' },
            { key: 'C', text: 'He treated the injury and kept the casualty warm.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which role does each task belong to? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'the controller' },
        { key: 'B', text: 'the team leader' },
        { key: 'C', text: 'the medical officer' },
        { key: 'D', text: 'the radio operator' },
        { key: 'E', text: 'the dog handler' },
      ],
      items: [
        { number: 19, text: 'Co-ordinates the search from the base' },
        { number: 20, text: 'Works with the search dog in dense trees' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['control'], evidence: 3,
      explanation: {
        zh: '定位句 3：It is logged at the control centre, where the duty officer takes the caller’s details。第一通电话先记录在控制中心；句 4 才转给领队，不是本空地点。',
        en: 'Sentence 3: "It is logged at the control centre, where the duty officer takes the caller’s details". The call is first logged at the control centre; it passes to the leader only in sentence 4, so that is not this place.',
      },
    },
    {
      number: 12, accepted: ['jacket'], evidence: 5,
      explanation: {
        zh: '定位句 5：every rescuer carries a waterproof jacket。防水外套是每人必带的第一件；句 7 的 gloves 和 pouch 属于另外的装备项。',
        en: 'Sentence 5: "every rescuer carries a waterproof jacket". The waterproof jacket is the first mandatory item; the gloves and pouch in sentence 7 are separate kit entries.',
      },
    },
    {
      number: 13, accepted: ['mountain'], evidence: 11,
      explanation: {
        zh: '定位句 11：the team leader checks the mountain forecast issued at six each morning。早晨六点发布的是山区预报；summit 只是预报里风力警告涉及的位置。',
        en: 'Sentence 11: "the team leader checks the mountain forecast issued at six each morning". The six a.m. bulletin is the mountain forecast; the summit is only the place where the wind warning applies.',
      },
    },
    {
      number: 14, accepted: ['course'], evidence: 16,
      explanation: {
        zh: '定位句 16：Each volunteer completes a four-week training course before taking a real call。新志愿者在真实出队前完成为期四周的训练课程；mentor 结对是课程之后的安排。',
        en: 'Sentence 16: "Each volunteer completes a four-week training course before taking a real call". New volunteers finish a four-week training course before a live call; pairing with a mentor comes after the course.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：our first job was to pin down the last known location。先要确定失联者最后出现的位置；家属联系方式和附近人数在全段没有作为首要信息出现。',
        en: 'Sentence 24: "our first job was to pin down the last known location". The priority is fixing the last known location. Next of kin and the number of other walkers are never raised as the first requirement.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：thick low cloud over the peaks usually brings rain within the hour。低垂云层往往预示一小时内下雨；它既不标记安全路线，也不指示小路尽头。',
        en: 'Sentence 21: "thick low cloud over the peaks usually brings rain within the hour". Low cloud usually precedes rain. It neither marks a safe summit route nor shows where the path ends.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：trainees shadow an experienced rescuer and carry no medical role themselves。头两个周末学员跟随有经验的队员，不承担医疗职责；独立带队和教学员急救都是后来的事。',
        en: 'Sentence 18: "trainees shadow an experienced rescuer and carry no medical role themselves". On the first two weekends trainees shadow an experienced member with no medical role. Leading a team and teaching first aid come later.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 26,
      explanation: {
        zh: '定位句 26：The medical officer met the casualty there, checked the injury and kept the person warm。医官现场处理伤情并注意保暖；开车送医是之后的安排，天气记录不属于医官任务。',
        en: 'Sentence 26: "The medical officer met the casualty there, checked the injury and kept the person warm". The officer treated the injury and kept the casualty warm. Driving to hospital came later, and weather recording was not the medical officer’s task.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：The controller stays at the base, records the call, and co-ordinates the search from the radio log。在基地协调搜索的是控制员；领队在山上判断路线，不是同一岗位。',
        en: 'Sentence 32: "The controller stays at the base, records the call, and co-ordinates the search from the radio log". The controller coordinates the search from base. The leader judges the route on the hill, which is a different post.',
      },
    },
    {
      number: 20, accepted: ['E'], evidence: 36,
      explanation: {
        zh: '定位句 36：The dog handler works with the search dog on open ground or in dense trees。在密林里带搜救犬工作的是 handler；报务员只负责保持无线电联络。',
        en: 'Sentence 36: "The dog handler works with the search dog on open ground or in dense trees". The handler works the dog in woodland. The radio operator only keeps contact with the base and hill team.',
      },
    },
  ],
  transcript: [
    { speaker: 'rescuer', text: 'When someone reports a missing walker on the ridge, our rescue team follows a fixed sequence before anyone leaves the base.' },
    { speaker: 'rescuer', text: 'In this talk I’ll walk you through that sequence, the kit each rescuer carries, how we judge the weather, and how new volunteers are trained.' },
    { speaker: 'rescuer', text: 'The first call does not go straight to the rescuers on the hill.' },
    { speaker: 'rescuer', text: 'It is logged at the control centre, where the duty officer takes the caller’s details and checks the area on the map.' },
    { speaker: 'rescuer', text: 'Only after that check does the call pass to the team leader, who decides whether we go out and how many rescuers are needed.' },
    { speaker: 'rescuer', text: 'In the kit bag, every rescuer carries a waterproof jacket, regardless of how sunny the morning looked.' },
    { speaker: 'rescuer', text: 'That jacket is the first item we check at the base gate, because rain can move in fast on the higher slopes.' },
    { speaker: 'rescuer', text: 'We also pack a small first-aid pouch, a head torch and a pair of thick gloves for cold rock.' },
    { speaker: 'rescuer', text: 'Next to medical items, the bag holds a printed map of the area and a spare battery for the hand radio.' },
    { speaker: 'rescuer', text: 'Boots are checked before each call too, since wet leather over loose stones can turn an ankle quickly.' },
    { speaker: 'rescuer', text: 'Weather judgement is part of the training, not something we rely on luck for.' },
    { speaker: 'rescuer', text: 'Before setting off, the team leader checks the mountain forecast issued at six each morning.' },
    { speaker: 'rescuer', text: 'If the forecast warns of strong wind near the summit, the team stays below the ridge line rather than pushing higher.' },
    { speaker: 'rescuer', text: 'We also watch the cloud hanging over the peaks, because thick low cloud often means rain within the hour.' },
    { speaker: 'rescuer', text: 'Visibility matters as much as temperature. Once the fog rolls in, paths and boundaries become hard to read.' },
    { speaker: 'rescuer', text: 'New members do not join a search on their first day.' },
    { speaker: 'rescuer', text: 'Each volunteer completes a four-week training course before taking a real call.' },
    { speaker: 'rescuer', text: 'The course covers first aid, navigation, rope work and how to move safely over loose scree.' },
    { speaker: 'rescuer', text: 'On the first two weekends, trainees shadow an experienced rescuer and carry no medical role themselves.' },
    { speaker: 'rescuer', text: 'After that, they work in pairs with a mentor until the leader judges them ready.' },
    { speaker: 'rescuer', text: 'The training also includes a night session, so members know how to read a head torch beam in open country.' },
    { speaker: 'rescuer', text: 'Remember that thick low cloud over the peaks usually brings rain within the hour, so turn back early if it thickens.' },
    { speaker: 'rescuer', text: 'Last winter we dealt with a case that shows why this preparation matters.' },
    { speaker: 'rescuer', text: 'A walker had slipped on a wet path and could not put weight on an ankle.' },
    { speaker: 'rescuer', text: 'The caller had phoned from a valley path, so our first job was to pin down the last known location.' },
    { speaker: 'rescuer', text: 'Once that location was marked on the map, two rescuers were sent along the lower track.' },
    { speaker: 'rescuer', text: 'The medical officer met the casualty there, checked the injury and kept the person warm while the stretcher was prepared.' },
    { speaker: 'rescuer', text: 'The dog handler was called in only when the search spread into thick woodland off the path.' },
    { speaker: 'rescuer', text: 'That night the weather turned colder, and the wind picked up as the rescue went on.' },
    { speaker: 'rescuer', text: 'The team controlled the pace, rested the casualty often, and reached the road before dark.' },
    { speaker: 'rescuer', text: 'In the end the walker went to hospital for a check on the ankle, and recovered well.' },
    { speaker: 'rescuer', text: 'I’d like to go through what each role does, so you can see where a decision belongs.' },
    { speaker: 'rescuer', text: 'The controller stays at the base, records the call, and co-ordinates the search from the radio log.' },
    { speaker: 'rescuer', text: 'The team leader walks out with the group, reads the ground and decides the route on the hill.' },
    { speaker: 'rescuer', text: 'The medical officer treats injuries at the scene and records the patient’s condition for the hospital.' },
    { speaker: 'rescuer', text: 'The radio operator keeps contact between the base and the hill team during the search.' },
    { speaker: 'rescuer', text: 'The dog handler works with the search dog on open ground or in dense trees.' },
    { speaker: 'rescuer', text: 'Let me stress a few safety habits that apply on every call.' },
    { speaker: 'rescuer', text: 'No one leaves the base alone, even for a short walk back to the vehicle.' },
    { speaker: 'rescuer', text: 'Rescuers keep the radio on the agreed channel, and they report their position every hour.' },
    { speaker: 'rescuer', text: 'If you feel cold or tired, say so before the condition turns into a real problem.' },
    { speaker: 'rescuer', text: 'A rescue is a shared effort, and the team looking after you keeps the whole group safe.' },
    { speaker: 'rescuer', text: 'Some of you asked how often the team trains through the year.' },
    { speaker: 'rescuer', text: 'Sessions run once a month, with a full refresher weekend each spring.' },
    { speaker: 'rescuer', text: 'Others wanted to know whether ordinary members of the public can join a call.' },
    { speaker: 'rescuer', text: 'Visitors may watch the base briefing, but active search slots are reserved for trained volunteers.' },
    { speaker: 'rescuer', text: 'If you are interested, speak to a leader after the talk about joining the rota.' },
  ],
  vocabulary: [
    {
      term: 'control', phonetic: '/kənˈtrəʊl/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '控制（control centre 调度中心）', en: 'in control centre, the base that receives and logs rescue calls' },
      usage: { zh: '名词；control centre、duty officer at control。动词同形。', en: 'Noun: control centre. The verb has the same form.' },
      collocations: ['the control centre', 'at control', 'the control desk'],
      example: { en: 'The call is logged at the control centre before it reaches the team.', zh: '电话先记录在调度中心，再转给队伍。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈtrəʊl/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'waterproof', phonetic: '/ˈwɔːtəpruːf/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '防水的', en: 'treated so rain or water cannot pass through' },
      usage: { zh: '形容词；waterproof jacket、waterproof boots。', en: 'Adjective: waterproof jacket, waterproof boots.' },
      collocations: ['waterproof jacket', 'waterproof pouch', 'keep the kit waterproof'],
      example: { en: 'Every rescuer carries a waterproof jacket on the call.', zh: '每次出队每人都带防水外套。' },
      listening: { zh: '两个音节，重音在第一音节；water 中 /tə/ 弱读。', en: 'Two syllables with stress on the first; /tə/ in water is reduced.' },
    },
    {
      term: 'forecast', phonetic: '/ˈfɔːkɑːst/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '预报（mountain forecast 山区天气预报）', en: 'a statement of expected weather or conditions' },
      usage: { zh: '可数；mountain forecast、weather forecast。动词同形。', en: 'Countable: mountain forecast. The verb shares the form.' },
      collocations: ['the mountain forecast', 'check the forecast', 'the forecast warns of'],
      example: { en: 'The leader checks the mountain forecast before setting off.', zh: '出发前领队查看山区预报。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /ɑːst/ 要读完整。', en: 'Two syllables with stress on the first; keep the ending /ɑːst/ complete.' },
    },
    {
      term: 'trainees', phonetic: '/treɪˈniːz/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '学员，受训者', en: 'people learning the skills needed for the rescue team' },
      usage: { zh: '可数；trainee 单数，trainees 复数；动词 train。', en: 'Countable: trainee, trainees. The verb is train.' },
      collocations: ['trainees shadow a rescuer', 'new trainees', 'the trainee group'],
      example: { en: 'Trainees follow an experienced rescuer on the first two weekends.', zh: '头两个周末学员跟随有经验的队员。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈniː/；结尾 /z/ 浊化。', en: 'Two syllables with stress on the second; the ending /z/ is voiced.' },
    },
    {
      term: 'casualty', phonetic: '/ˈkæʒuəlti/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '受伤者，伤员', en: 'a person injured in an accident or rescue situation' },
      usage: { zh: '可数；meet the casualty、treat the casualty。', en: 'Countable: meet the casualty, treat the casualty.' },
      collocations: ['the casualty there', 'keep the casualty warm', 'the injured casualty'],
      example: { en: 'The medical officer checked the injury and kept the casualty warm.', zh: '医官检查伤情并给伤员保暖。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /ʒə/ 不要读成 /z/。', en: 'Three syllables with stress on the first; the middle /ʒə/ is not /z/.' },
    },
    {
      term: 'co-ordinates', phonetic: '/kəˈɔːdɪneɪts/', partOfSpeech: 'v.', sentenceIndex: 32,
      meaning: { zh: '协调，统筹（co-ordinate the search）', en: 'to organise people and tasks so a search runs together' },
      usage: { zh: '第三人称单数；co-ordinate the search、co-ordinate from base。名词 coordination。', en: 'Third person singular: co-ordinate the search. The noun is coordination.' },
      collocations: ['co-ordinates the search', 'co-ordinates from the base', 'co-ordinates the team'],
      example: { en: 'The controller records the call and co-ordinates the search.', zh: '控制员记录来电并协调搜索。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈɔː/；前缀 co- 弱读。', en: 'Four syllables with stress on the second; the co- prefix is weak.' },
    },
    {
      term: 'mentor', phonetic: '/ˈmentɔː/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '导师，带教队员', en: 'an experienced member who guides a new volunteer through the training' },
      usage: { zh: '可数；work with a mentor、mentor and trainee。', en: 'Countable: work with a mentor.' },
      collocations: ['a mentor', 'pair with a mentor', 'the mentor role'],
      example: { en: 'After two weekends, trainees work in pairs with a mentor.', zh: '两个周末后，学员与导师结对工作。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /ɔː/ 不卷舌。', en: 'Two syllables with stress on the first; the ending /ɔː/ is non-rhotic.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 1,
      meaning: { zh: '逐项向你讲解，带过一遍', en: 'to explain a process step by step to an audience' },
      usage: { zh: '及物短语动词；walk someone through the sequence。', en: 'Transitive: walk someone through the sequence.' },
      example: { en: 'I’ll walk you through the kit list and the call-out sequence.', zh: '我逐项带大家过一遍装备清单和出队流程。' },
    },
    {
      phrase: 'pin down', sentenceIndex: 24,
      meaning: { zh: '确定，锁定（位置或事实）', en: 'to establish a fact or location with certainty' },
      usage: { zh: '及物；pin down the location、pin down a time。', en: 'Transitive: pin down the location, pin down a time.' },
      example: { en: 'Our first job was to pin down the last known location.', zh: '我们的首要任务是确定最后出现的位置。' },
    },
    {
      phrase: 'shadow an experienced rescuer', sentenceIndex: 18,
      meaning: { zh: '跟随有经验的队员见习', en: 'to follow an experienced member during training without taking charge' },
      usage: { zh: 'shadow 此处为动词“跟班学习”；后接人。', en: 'Here shadow is a verb meaning follow and observe; followed by a person.' },
      example: { en: 'Trainees shadow an experienced rescuer on early weekends.', zh: '头几个周末学员跟随老队员见习。' },
    },
    {
      phrase: 'rolls in', sentenceIndex: 14,
      meaning: { zh: '涌来，笼罩（fog 漫入）', en: 'to arrive and spread over an area, said of fog or cloud' },
      usage: { zh: '不及物短语动词；一般现在时 rolls in，过去式 rolled in。', en: 'Intransitive: rolls in, past form rolled in.' },
      example: { en: 'Once the fog rolls in, paths and boundaries become hard to read.', zh: '雾一漫进来，小路就难以辨认。' },
    },
    {
      phrase: 'picked up', sentenceIndex: 28,
      meaning: { zh: '增强，变大（wind 风势）', en: 'to grow stronger, said of the wind' },
      usage: { zh: '不及物；the wind picked up。也可表示“捡起”。', en: 'Intransitive here: the wind picked up. It also means pick up an object.' },
      example: { en: 'The wind picked up as the rescue went on through the night.', zh: '救援持续到夜里，风势逐渐变大。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题按流程顺序记', en: 'Order notes along the call-out sequence' },
      body: {
        zh: '第 11–14 题按出队流程先后出现：先记录电话、再查装备、然后看预报、最后讲训练。听前把四行笔记对应到流程环节，听到对应环节时填一个词，不要回头补前一句。',
        en: 'Items 11 to 14 follow the call-out order: log the call, check kit, read the forecast, then training. Before listening, match each note row to a stage of the sequence, and write one word at that stage rather than going back to earlier lines.',
      },
    },
    {
      title: { zh: '配对题先标岗位关键词', en: 'Mark role keywords before matching' },
      body: {
        zh: '第 19–20 题是岗位配对。听前把五个选项缩写成控制员、领队、医官、报务员、handler；听到 stays at the base 对应控制员，听到 search dog 对应 handler，山路上判断路线的是领队。',
        en: 'Items 19 to 20 match tasks to roles. Abbreviate the five options to controller, leader, medical officer, radio operator and handler before listening. Stays at the base matches the controller, search dog matches the handler, and route choices on the hill belong to the leader.',
      },
    },
    {
      title: { zh: '案例题区分先后动作', en: 'In case studies, separate actions in order' },
      body: {
        zh: '冬季案例一段包含多个动作：定位、派人、医官处理、准备担架、呼叫 handler。单选题常把后续动作挪到前面干扰，听清每个动作由谁在哪个阶段完成。',
        en: 'The winter case lists several actions in order: locate, send rescuers, treat the injury, prepare the stretcher, call in the handler. Single-choice items often move later actions earlier, so note who did each action and at which stage.',
      },
    },
  ],
};
