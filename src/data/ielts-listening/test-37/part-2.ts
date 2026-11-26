import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 37 · Part 2 — 医院志愿者入职说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：楼层与导览 → 感染防控（洗手时长、 gown）→ 病人陪伴姿态 → 保密要求 →
 * 班次签到（填空块在前半段），后半段集中回答首次进病房、病人情绪、拍照规定与下班流程（单选块）。
 */
export const test37Part2: ListeningLesson = {
  slug: 'test-37-part-2',
  part: 2,
  status: 'published',
  title: { zh: '医院志愿者入职说明', en: 'Inducting hospital volunteers' },
  summary: {
    zh: '志愿者协调员向新一批志愿者做入职说明：楼层导览与志愿者工位、手卫生时长、临床区域着装、陪伴病人时的坐姿与语气、保密与拍照规定，以及班次签到签退流程；后半段回答首次进病房、安抚情绪、照片限制与下班交接的常见问题。',
    en: 'The volunteer coordinator briefs new volunteers on the floor layout and desk, hand hygiene timing, clothing in clinical areas, how to sit and speak with patients, confidentiality and photography rules, and shift sign-in and sign-out; the latter half answers questions about the first ward visit, comforting upset patients, photo limits and end-of-shift handover.',
  },
  accent: { zh: '协调员为南非口音，语速平稳，规则部分会重复强调。', en: 'The coordinator speaks with a South African accent at a steady pace, repeating the rules that matter most.' },
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
        { lead: 'Volunteer desk is on the', cells: [[{ blank: 11 }, { text: ' floor.' }]] },
        { lead: 'Wash hands for at least', cells: [[{ blank: 12 }, { text: ' seconds.' }]] },
        { lead: 'Wear a clean', cells: [[{ blank: 13 }, { text: ' gown in clinical areas.' }]] },
        { lead: 'Sit at the patient’s', cells: [[{ blank: 14 }, { text: ' level.' }]] },
        { lead: 'Do not discuss patient', cells: [[{ blank: 15 }, { text: ' outside the ward.' }]] },
        { lead: 'Sign in at the', cells: [[{ blank: 16 }, { text: ' board each morning.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What should volunteers do before entering a ward?',
          options: [
            { key: 'A', text: 'Go straight to the nearest patient room.' },
            { key: 'B', text: 'Report to the volunteer desk and collect the badge.' },
            { key: 'C', text: 'Wait outside until a nurse calls them in.' },
          ],
        },
        {
          number: 18,
          stem: 'How should volunteers respond to a distressed patient?',
          options: [
            { key: 'A', text: 'Comfort the patient alone until they calm down.' },
            { key: 'B', text: 'Stay calm, keep the voice low, and call a nurse.' },
            { key: 'C', text: 'Leave the patient alone to rest for a while.' },
          ],
        },
        {
          number: 19,
          stem: 'What rule applies to patient photographs?',
          options: [
            { key: 'A', text: 'Volunteers may photograph patients who agree.' },
            { key: 'B', text: 'Only staff take official hospital photographs.' },
            { key: 'C', text: 'Personal photographs are not allowed on the wards.' },
          ],
        },
        {
          number: 20,
          stem: 'What must volunteers do at the end of a shift?',
          options: [
            { key: 'A', text: 'Sign out on the board and return the badge.' },
            { key: 'B', text: 'Take unfinished notes home to finish.' },
            { key: 'C', text: 'Hand the badge to the next arriving volunteer.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['second', '2nd'], evidence: 4,
      explanation: {
        zh: '定位句 4：The volunteer desk is on the second floor, next to the lift doors。志愿者工位在二楼；句 5 的 left、right 是走廊方向，不是楼层答案。',
        en: 'Sentence 4: "The volunteer desk is on the second floor, next to the lift doors". The desk is on the second floor; left and right in sentence 5 give corridor directions, not the floor.',
      },
    },
    {
      number: 12, accepted: ['twenty', '20'], evidence: 9,
      explanation: {
        zh: '定位句 9：Wash your hands with soap for at least twenty seconds after each visit。手洗时长至少二十秒；句 8 的 hand gel station 是免洗凝胶，不是计时答案。',
        en: 'Sentence 9: "Wash your hands with soap for at least twenty seconds after each visit". The hand-washing time is twenty seconds; the gel station in sentence 8 is a location, not the figure.',
      },
    },
    {
      number: 13, accepted: ['blue'], evidence: 10,
      explanation: {
        zh: '定位句 10：you wear a clean blue gown and cover your own clothes。临床区域穿干净的蓝色 gown；clean 是修饰词，gown 已印在卷面上，填颜色 blue。',
        en: 'Sentence 10: "you wear a clean blue gown and cover your own clothes". The gown is clean and blue; clean is a modifier and gown is printed, so write blue.',
      },
    },
    {
      number: 14, accepted: ['eye'], evidence: 15,
      explanation: {
        zh: '定位句 15：take a chair and sit at their eye level。陪伴时坐在与病人视线平齐的高度；句 16 的 stand over 是被否定的姿势，不能填。',
        en: 'Sentence 15: "take a chair and sit at their eye level". Volunteers sit at the patient’s eye level; standing over the bed in sentence 16 is the rejected posture.',
      },
    },
    {
      number: 15, accepted: ['names'], evidence: 21,
      explanation: {
        zh: '定位句 21：You must not discuss patient names, conditions or families outside the ward。保密要求不得在病房外讨论病人姓名、病情或家属；空后已印 outside the ward，填 names。',
        en: 'Sentence 21: "You must not discuss patient names, conditions or families outside the ward". Patient names, conditions and families stay inside; the gap asks for names, with outside the ward already printed.',
      },
    },
    {
      number: 16, accepted: ['volunteer'], evidence: 26,
      explanation: {
        zh: '定位句 26：You sign in at the volunteer board before entering the ward each morning。签到用的是志愿者看板；句 28 说看板在志愿者工位旁，是位置补充，不改变看板名称。',
        en: 'Sentence 26: "You sign in at the volunteer board before entering the ward each morning". Sign-in uses the volunteer board; sentence 28 locates it beside the desk but does not rename it.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 33,
      explanation: {
        zh: '定位句 33：Report to the volunteer desk first, collect your name badge, and confirm the ward with the nurse。进病房前先到志愿者工位、领胸牌并与护士确认病区，对应 B。A 的直接进病房与句 34 的 Do not go straight 相反，C 的等待叫号在录音中没有依据。',
        en: 'Sentence 33: "Report to the volunteer desk first, collect your name badge, and confirm the ward with the nurse", matching B. Going straight to a room contradicts sentence 34, and waiting to be called in is not said.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Keep your voice low, sit with the patient, and raise the bell for a nurse to come。安抚情绪病人要保持低声、陪在旁边并按铃叫护士，对应 B。A 的独自安慰与句 18 相反，C 的独自离开在录音中被否定。',
        en: 'Sentence 36: "Keep your voice low, sit with the patient, and raise the bell for a nurse to come", matching B. Comforting the patient alone contradicts sentence 18, and leaving them alone is ruled out.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：No personal photographs are allowed on the wards, even of an empty corridor near a bed。病房内禁止个人拍照，对应 C。A 的经同意可拍与句中 no 相反，B 的员工官方拍摄是另一条说明，不是志愿者规则。',
        en: 'Sentence 39: "No personal photographs are allowed on the wards, even of an empty corridor near a bed", matching C. Photographing consenting patients contradicts the rule; staff official photos are a separate point, not the volunteer rule.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 42,
      explanation: {
        zh: '定位句 42：Sign out on the volunteer board, return the badge, and complete the handover with the nurse。下班要在看板签退、归还胸牌并与护士完成交接，对应 A。B 的把笔记带回家与句 43 相反，C 的胸牌转交给下一位志愿者在录音中没有依据。',
        en: 'Sentence 42: "Sign out on the volunteer board, return the badge, and complete the handover with the nurse", matching A. Taking paperwork home contradicts sentence 43, and passing the badge to the next volunteer is not said.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Right, before you start your first ward shift, there are a few practical rules to go over.' },
    { speaker: 'coordinator', text: 'I am Leah, the volunteer coordinator, and I will stay on duty all morning.' },
    { speaker: 'coordinator', text: 'First, the layout of the hospital building, so you can find your way around.' },
    { speaker: 'coordinator', text: 'The main entrance faces the car park, and reception sits straight ahead.' },
    { speaker: 'coordinator', text: 'The volunteer desk is on the second floor, next to the lift doors.' },
    { speaker: 'coordinator', text: 'Patient wards run along the corridor to the left, and the day rooms are on the right.' },
    { speaker: 'coordinator', text: 'If you are lost, look for the blue wayfinding signs on the walls.' },
    { speaker: 'coordinator', text: 'Now, infection control, which applies to every volunteer on every shift.' },
    { speaker: 'coordinator', text: 'Before entering a ward, you must clean your hands at the hand gel station.' },
    { speaker: 'coordinator', text: 'Wash your hands with soap for at least twenty seconds after each visit.' },
    { speaker: 'coordinator', text: 'In clinical areas, you wear a clean blue gown and cover your own clothes.' },
    { speaker: 'coordinator', text: 'If your gown tears or gets wet, ask the nurse on duty for a replacement.' },
    { speaker: 'coordinator', text: 'Used gowns go in the linen bin outside the ward, not back on the coat hook.' },
    { speaker: 'coordinator', text: 'Next, how you spend time with patients on the ward.' },
    { speaker: 'coordinator', text: 'Many patients are lonely, and a short friendly visit means a great deal to them.' },
    { speaker: 'coordinator', text: 'When you sit with someone, take a chair and sit at their eye level.' },
    { speaker: 'coordinator', text: 'Do not stand over the bed, because that can feel intimidating to someone lying down.' },
    { speaker: 'coordinator', text: 'Speak slowly and clearly, and give the patient time to answer your questions.' },
    { speaker: 'coordinator', text: 'If a patient seems distressed, stay calm and call a nurse rather than trying to comfort them alone.' },
    { speaker: 'coordinator', text: 'You may offer a glass of water or a book, but do not adjust their medication or blankets.' },
    { speaker: 'coordinator', text: 'Confidentiality is the rule that matters most after hand hygiene.' },
    { speaker: 'coordinator', text: 'You must not discuss patient names, conditions or families outside the ward.' },
    { speaker: 'coordinator', text: 'Even in the volunteer room, keep conversations about patients general and impersonal.' },
    { speaker: 'coordinator', text: 'You may not take photographs of patients, their beds or their relatives on your phone.' },
    { speaker: 'coordinator', text: 'If a patient asks about their treatment, direct them to the nurse on duty.' },
    { speaker: 'coordinator', text: 'Now, the shift itself, from signing in to finishing up.' },
    { speaker: 'coordinator', text: 'You sign in at the volunteer board before entering the ward each morning.' },
    { speaker: 'coordinator', text: 'Print your full name and the start time, and sign out again when you leave.' },
    { speaker: 'coordinator', text: 'The board is next to the volunteer desk on the second floor.' },
    { speaker: 'coordinator', text: 'Each shift lasts three hours, with a short break in the middle if the ward allows.' },
    { speaker: 'coordinator', text: 'If you cannot attend a shift, email the coordinator at least two days ahead.' },
    { speaker: 'coordinator', text: 'Now a few questions people often ask in this briefing.' },
    { speaker: 'coordinator', text: 'What should a volunteer do before entering a ward for the first time?' },
    { speaker: 'coordinator', text: 'Report to the volunteer desk first, collect your name badge, and confirm the ward with the nurse.' },
    { speaker: 'coordinator', text: 'Do not go straight to a patient room without checking in at the desk.' },
    { speaker: 'coordinator', text: 'How should volunteers respond when a patient becomes upset?' },
    { speaker: 'coordinator', text: 'Keep your voice low, sit with the patient, and raise the bell for a nurse to come.' },
    { speaker: 'coordinator', text: 'Never promise to visit again if you are unsure whether your shift will repeat.' },
    { speaker: 'coordinator', text: 'Is there any situation where a volunteer may take a photo?' },
    { speaker: 'coordinator', text: 'No personal photographs are allowed on the wards, even of an empty corridor near a bed.' },
    { speaker: 'coordinator', text: 'Official hospital photos are taken by staff, and volunteers are not part of that team.' },
    { speaker: 'coordinator', text: 'What must you do at the end of a shift?' },
    { speaker: 'coordinator', text: 'Sign out on the volunteer board, return the badge, and complete the handover with the nurse.' },
    { speaker: 'coordinator', text: 'Do not take patient paperwork home, even to finish it later in the day.' },
    { speaker: 'coordinator', text: 'Finally, if you feel unwell during a shift, tell the nurse and sit in the rest room.' },
    { speaker: 'coordinator', text: 'The rest room for volunteers is beside the volunteer desk on the second floor.' },
    { speaker: 'coordinator', text: 'Volunteers should also check the notice board for any ward closure before arriving.' },
    { speaker: 'coordinator', text: 'If a volunteer has special access needs, mention them to the coordinator today.' },
    { speaker: 'coordinator', text: 'The coordinator holds a short follow-up meeting at the end of each month.' },
    { speaker: 'coordinator', text: 'Attendance records are kept on the volunteer board for every completed shift.' },
    { speaker: 'coordinator', text: 'You will receive a reminder email two days before your next scheduled visit.' },
    { speaker: 'coordinator', text: 'Most volunteers find the ward routine easier after their third or fourth shift.' },
    { speaker: 'coordinator', text: 'Thank you for coming in, and please ask me anything before you collect your badge.' },
  ],
  vocabulary: [
    {
      term: 'coordinator', phonetic: '/kəʊˈɔːdɪneɪtə/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '协调员，统筹排班与沟通的负责人', en: 'the person who arranges schedules and liaises between staff and volunteers' },
      usage: { zh: '可数名词；volunteer coordinator、shift coordinator。动词是 coordinate。', en: 'Countable: volunteer coordinator. The verb is coordinate.' },
      collocations: ['volunteer coordinator', 'the coordinator’s role', 'contact the coordinator'],
      example: { en: 'The volunteer coordinator sends the rota by email each week.', zh: '志愿者协调员每周通过邮件发送排班表。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈɔː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'wayfinding', phonetic: '/ˈweɪfaɪndɪŋ/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '导览标识，寻路系统', en: 'the signs and maps that help people find their way around a building' },
      usage: { zh: '不可数；wayfinding signs、the wayfinding system。复合词。', en: 'Uncountable: wayfinding signs, the wayfinding system.' },
      collocations: ['wayfinding signs', 'hospital wayfinding', 'clear wayfinding'],
      example: { en: 'Follow the blue wayfinding signs along the main corridor.', zh: '沿着主走廊看蓝色导览标识走。' },
      listening: { zh: '重音在第一个词 way；结尾 -ing 读 /ɪŋ/。', en: 'Stress the first part way; the ending is /ɪŋ/.' },
    },
    {
      term: 'gown', phonetic: '/ɡaʊn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '防护衣，隔离袍', en: 'a loose protective garment worn in clinical areas' },
      usage: { zh: '可数名词；a clean gown、wear a gown。区别于 nightgown（睡袍）。', en: 'Countable: wear a clean gown. Distinct from a nightgown.' },
      collocations: ['a clean gown', 'a blue gown', 'put on a gown'],
      example: { en: 'You wear a clean blue gown before entering the clinical ward.', zh: '进入临床病区前先穿一件干净的蓝色防护袍。' },
      listening: { zh: '双元音 /aʊ/ 开头，结尾 /n/ 要读出来。', en: 'Opens with /aʊ/; pronounce the final /n/.' },
    },
    {
      term: 'intimidating', phonetic: '/ɪnˈtɪmɪdeɪtɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 16,
      meaning: { zh: '令人有压迫感的，让人紧张的', en: 'making someone feel threatened or uneasy' },
      usage: { zh: '形容姿态或语气；feel intimidating、an intimidating posture。动词是 intimidate。', en: 'Describes posture or tone: feel intimidating. The verb is intimidate.' },
      collocations: ['an intimidating posture', 'feel intimidating', 'an intimidating presence'],
      example: { en: 'Standing over the bed can feel intimidating to a patient.', zh: '站在病床边俯身会让病人感到压迫。' },
      listening: { zh: '重音在第二音节 /ˈtɪm/；开头 /ɪ/ 很弱。', en: 'Stress the second syllable; the opening /ɪ/ is weak.' },
    },
    {
      term: 'confidentiality', phonetic: '/ˌkɒnfɪˌdenʃiˈæləti/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '保密（隐私信息不得对外透露）', en: 'the duty to keep private information secret' },
      usage: { zh: '不可数；break confidentiality、patient confidentiality。形容词是 confidential。', en: 'Uncountable: break confidentiality. The adjective is confidential.' },
      collocations: ['patient confidentiality', 'the confidentiality rule', 'breach confidentiality'],
      example: { en: 'Patient confidentiality applies even outside the ward building.', zh: '即使在病房大楼外也要遵守病人保密原则。' },
      listening: { zh: '六个音节，重音在最后一个 /ˈæ/。', en: 'Six syllables with stress on the final /æ/.' },
    },
    {
      term: 'impersonal', phonetic: '/ɪmˈpɜːsənl/', partOfSpeech: 'adj.', sentenceIndex: 22,
      meaning: { zh: '不涉及个人身份的，泛化的', en: 'not naming anyone or revealing personal details' },
      usage: { zh: '形容谈话内容；keep it impersonal、an impersonal description。', en: 'Describes talk: keep it impersonal, an impersonal description.' },
      collocations: ['keep it impersonal', 'an impersonal account', 'impersonal language'],
      example: { en: 'Keep conversations about patients general and impersonal.', zh: '谈论病人时保持概括、不涉及个人身份。' },
      listening: { zh: '重音在第二音节 /ˈpɜː/；开头 im- 读 /ɪm/。', en: 'Stress the second syllable; the prefix is /ɪm/.' },
    },
    {
      term: 'handover', phonetic: '/ˈhændəʊvə/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '交接（下班时把情况移交给下一班）', en: 'the act of passing on information at the end of a shift' },
      usage: { zh: '可数或不可数；the end-of-shift handover、do the handover。', en: 'Countable or uncountable: the end-of-shift handover.' },
      collocations: ['the shift handover', 'end-of-shift handover', 'complete the handover'],
      example: { en: 'The volunteer hands any notes to the nurse during the handover.', zh: '志愿者在交接时把笔记交给护士。' },
      listening: { zh: '复合词，重音在第一个词 hand。', en: 'Compound word with stress on the first part hand.' },
    },
  ],
  expressions: [
    {
      phrase: 'go over', sentenceIndex: 0,
      meaning: { zh: '逐项讲解，过一遍（规则）', en: 'to review rules or details with someone' },
      usage: { zh: '及物短语动词；go over the rules、go over the schedule。', en: 'Transitive: go over the rules, go over the schedule.' },
      example: { en: 'I will go over the volunteer rules before your first shift.', zh: '第一次上岗前我会把志愿者规则过一遍。' },
    },
    {
      phrase: 'applies to', sentenceIndex: 7,
      meaning: { zh: '适用于，对……有效', en: 'to be relevant to or required for someone' },
      usage: { zh: 'apply to every volunteer；规则、政策高频搭配。', en: 'Apply to every volunteer; common with rules and policies.' },
      example: { en: 'Hand hygiene applies to every volunteer on every shift.', zh: '手卫生要求适用于每位志愿者的每一班。' },
    },
    {
      phrase: 'means a great deal', sentenceIndex: 14,
      meaning: { zh: '意义重大，让人很受触动', en: 'to matter a lot to someone who receives it' },
      usage: { zh: 'a great deal 作程度状语；与 mean 搭配。', en: 'A great deal as an adverbial with mean.' },
      example: { en: 'A short friendly visit means a great deal to lonely patients.', zh: '一次简短友好的探访对孤独的病人意义很大。' },
    },
    {
      phrase: 'direct them to', sentenceIndex: 24,
      meaning: { zh: '把他们指引到（某位工作人员）', en: 'to send someone to the right person for help' },
      usage: { zh: 'direct somebody to the nurse；服务场景高频。', en: 'Direct somebody to the nurse; common in services.' },
      example: { en: 'If a patient asks about treatment, direct them to the nurse.', zh: '病人问治疗问题时，把他们指引给护士。' },
    },
    {
      phrase: 'sign in', sentenceIndex: 26,
      meaning: { zh: '签到，登记到岗', en: 'to record your arrival on a board or register' },
      usage: { zh: '与 sign out 相对；sign in at the board、sign out on the board。', en: 'Opposite of sign out: sign in at the board, sign out on the board.' },
      example: { en: 'You sign in at the volunteer board before entering the ward.', zh: '进病房前先在志愿者看板签到。' },
    },
    {
      phrase: 'checking in', sentenceIndex: 34,
      meaning: { zh: '报到，登记身份', en: 'to report your arrival and confirm your role' },
      usage: { zh: 'check in at the desk；与 sign in 近义，强调当面报到。', en: 'Check in at the desk; similar to sign in but face to face.' },
      example: { en: 'Do not go to a patient room without checking in at the desk.', zh: '没在工位报到前不要直接进病房。' },
    },
  ],
  tips: [
    {
      title: { zh: '先定位楼层，再记工位名称', en: 'Locate the floor before the desk name' },
      body: {
        zh: '第 11 题问楼层，第 16 题问看板名称；独白常先说方位再说设施名称。听前把两题并排看，听到 second floor 时记楼层，听到 volunteer board 时记名称，避免把两个信息填反。',
        en: 'Item 11 asks for the floor and item 16 for the board name; monologues often give the location first, then the facility. Read both together, note second floor for the floor and volunteer board for the name, so the two facts are not swapped.',
      },
    },
    {
      title: { zh: '否定句决定拍照类选项', en: 'Negatives decide the photo options' },
      body: {
        zh: '第 19 题出现 No personal photographs、may not 这类否定。干扰项常把禁止改写成允许；听到否定词时先在选项旁标叉，再确认被允许的主体是员工还是志愿者。',
        en: 'Item 19 contains No personal photographs and may not. Distractors turn bans into permissions; mark a cross when you hear the negative, then check whether the allowed party is staff or volunteers.',
      },
    },
    {
      title: { zh: '把规则按话题归堆预读', en: 'Pre-group the rules by topic' },
      body: {
        zh: '感染防控、陪伴姿态、保密、签到是四段并列规则。听前在每题旁标注话题词，独白路标 Now, infection control、Next、Confidentiality、Now, the shift 出现时，直接跳到对应话题的题号。',
        en: 'Infection control, companionship, confidentiality and sign-in are four parallel rule blocks. Mark topic words beside each gap before listening, and jump to that item whenever a signpost like Now, infection control appears.',
      },
    },
  ],
};
