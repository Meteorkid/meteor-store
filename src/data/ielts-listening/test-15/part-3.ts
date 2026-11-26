import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 15 · Part 3 — 野外考察计划评审（双人讨论，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：采样点选择与理由（单选 21）→ 天气预案（单选 22）→ 设备清单遗漏（单选 23）
 * → 数据记录方式（单选 24）→ 三人分工（配对 25–27）→ 出发前三项准备（多选 28–30）。
 */
export const test15Part3: ListeningLesson = {
  slug: 'test-15-part-3',
  part: 3,
  status: 'published',
  title: { zh: '野外考察计划评审', en: 'Reviewing a fieldwork plan' },
  summary: {
    zh: '两名学生在导师会前评审田野考察计划：第二个采样点为何更合适、大雨天气的顺延预案、设备清单漏掉的卷尺、手机应用录入数据的方式，以及 GPS 记录、样本分装、订车三项分工和出发前的准备事项。',
    en: 'Before the tutor’s check-in, two students review their fieldwork plan: why the second site is better, the contingency for heavy rain, the tape measure missing from the equipment list, recording readings through a phone app, the split of GPS readings, sample labelling and minibus booking, and the preparations before departure.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'jake', label: 'JAKE', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'tessa', label: 'TESSA', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 21,
          stem: 'Why was the second field site chosen?',
          options: [
            { key: 'A', text: 'easier parking near the college entrance' },
            { key: 'B', text: 'soils there vary more across the field' },
            { key: 'C', text: 'it lies closest to the college buildings' },
          ],
        },
        {
          number: 22,
          stem: 'What is the plan if heavy rain is forecast?',
          options: [
            { key: 'A', text: 'postpone the visit to another date' },
            { key: 'B', text: 'move the work to the sheltered woods' },
            { key: 'C', text: 'continue in light drizzle with waterproofs' },
          ],
        },
        {
          number: 23,
          stem: 'Which item was forgotten on the equipment list?',
          options: [
            { key: 'A', text: 'a tape measure' },
            { key: 'B', text: 'a soil core sampler' },
            { key: 'C', text: 'a field notebook' },
          ],
        },
        {
          number: 24,
          stem: 'How will the measurements be recorded?',
          options: [
            { key: 'A', text: 'paper sheets typed up when back indoors' },
            { key: 'B', text: 'a phone app that syncs to a shared spreadsheet' },
            { key: 'C', text: 'voice notes uploaded at the end of the day' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which job did each person take on? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'records the GPS reading at each spot' },
        { key: 'B', text: 'labels and bags the soil samples' },
        { key: 'C', text: 'books the college minibus' },
        { key: 'D', text: 'writes the risk assessment' },
        { key: 'E', text: 'sends the route plan to the tutor' },
      ],
      items: [
        { number: 25, text: 'Jake' },
        { number: 26, text: 'Tessa' },
        { number: 27, text: 'Jake' },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE preparations before departure are mentioned? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE preparations before departure are mentioned?',
      options: [
        { key: 'A', text: 'check the tide times before leaving' },
        { key: 'B', text: 'carry spare battery packs' },
        { key: 'C', text: 'leave no trace in the field' },
        { key: 'D', text: 'buy a packed lunch at the college shop' },
        { key: 'E', text: 'share the planned route with the department' },
        { key: 'F', text: 'wear the college sports kit' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：The soils there vary more across the field, so each sampling point gives a different reading。土壤差异大对应 B；A 的停车便利和 C 的距教学楼近在讨论中都不是选点理由。',
        en: 'Sentence 5: "The soils there vary more across the field, so each sampling point gives a different reading", matching B. Easy parking in A and closeness to the buildings in C are not the reasons given for the site.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：if heavy rain is forecast, we postpone the visit to another date rather than push on。大雨顺延改期对应 A；B 的转移到林地句中未提，C 的冒雨继续被句 11 的泥路湿滑否定。',
        en: 'Sentence 12: "if heavy rain is forecast, we postpone the visit to another date rather than push on", matching A. Moving to the woods in B is not mentioned, and working through drizzle in C is ruled out by the slippery clay paths in sentence 11.',
      },
    },
    {
      number: 23, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Did we include a tape measure? We need to mark the distance between points along the slope。漏的是卷尺，对应 A；B 的取土器和 C 的笔记本句 14 已经在清单上。',
        en: 'Sentence 16: "Did we include a tape measure? We need to mark the distance between points along the slope", matching A. The core sampler in B and the notebook in C are already on the list in sentence 14.',
      },
    },
    {
      number: 24, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：we use the phone app instead, which syncs straight to a shared spreadsheet back in the lab。手机应用同步共享表格对应 B；A 的回室内再录入被句 19 否定，C 的语音记录在讨论中没有出现。',
        en: 'Sentence 20: "we use the phone app instead, which syncs straight to a shared spreadsheet back in the lab", matching B. Typing up indoors in A is rejected in sentence 19, and voice notes in C are never mentioned.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：I can record the GPS reading at each spot。Jake 负责逐点 GPS 定位，对应 A；写风险评估是 Tessa 句 27 接下的任务。',
        en: 'Sentence 24: "I can record the GPS reading at each spot". Jake takes the GPS readings, matching A. The risk assessment in D is Tessa’s task in sentence 27.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：I label and bag them as soon as the core comes out。Tessa 负责样本贴标签分装，对应 B；送路线计划给导师是草稿之后的整理工作。',
        en: 'Sentence 25: "I label and bag them as soon as the core comes out". Tessa labels and bags the samples, matching B. Sending the route plan to the tutor in E comes later, after the draft.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 26,
      explanation: {
        zh: '定位句 26：Can I book the college minibus for the morning, so we do not rely on my car?。Jake 负责订学院小巴，对应 C；订车不涉及导师或部门审批手续。',
        en: 'Sentence 26: "Can I book the college minibus for the morning, so we do not rely on my car?". Jake books the minibus, matching C. The booking does not involve tutor or department approval paperwork.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：the site sits near a tidal creek, so we check the tide times before leaving。出发前查潮汐时间，对应 A；它是为避免回程被水困住，不是休闲活动。',
        en: 'Sentence 29: "the site sits near a tidal creek, so we check the tide times before leaving", matching A. It prevents a wet walk back, rather than being a leisure activity.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：The GPS and the phone drain fast, so we carry spare packs for both。带备用电池组对应 B；省电方法不是本次列出的准备事项。',
        en: 'Sentence 30: "The GPS and the phone drain fast, so we carry spare packs for both", matching B. Saving power is not listed as one of the preparations here.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 31,
      explanation: {
        zh: '定位句 31：We share it with the department office, in case someone raises an alarm if we are late。路线报备给部门对应 E；C 的不留痕迹只是基本田野礼仪，句 33 明确不算列入准备项。',
        en: 'Sentence 31: "We share it with the department office, in case someone raises an alarm if we are late", matching E. Leave no trace in C is basic etiquette, and sentence 33 says it is not listed as a preparation.',
      },
    },
  ],
  transcript: [
    { speaker: 'jake', text: 'Hi Tessa. Shall we go through the fieldwork plan before the tutor’s check-in?' },
    { speaker: 'tessa', text: 'Sure. We need to lock the sites, the weather plan and the equipment list today.' },
    { speaker: 'jake', text: 'Right. We looked at two possible sites last week. The first was the flat field behind the college.' },
    { speaker: 'tessa', text: 'Yes, but its soil looked the same in every patch, so there was little to compare.' },
    { speaker: 'jake', text: 'That is why I preferred the second site, the slope near the old farm track.' },
    { speaker: 'tessa', text: 'Exactly. The soils there vary more across the field, so each sampling point gives a different reading.' },
    { speaker: 'jake', text: 'Good, that will be our main site. The track gives access without crossing private yards.' },
    { speaker: 'tessa', text: 'How many points do we want along the slope? Last year’s group used five.' },
    { speaker: 'jake', text: 'Five is enough. We mark them from the bottom up, about ten paces apart.' },
    { speaker: 'tessa', text: 'Now the weather. The forecast keeps changing, so we need a clear contingency.' },
    { speaker: 'jake', text: 'What did you have in mind? Do we work through light rain in waterproofs?' },
    { speaker: 'tessa', text: 'Not at all. The clay paths turn slippery after rain, and the samples would run together.' },
    { speaker: 'jake', text: 'So if heavy rain is forecast, we postpone the visit to another date rather than push on.' },
    { speaker: 'tessa', text: 'That is it. We keep a reserve date two weeks later, and check the forecast each evening.' },
    { speaker: 'jake', text: 'Fine. Let us run through the equipment list. We have the core sampler, notebook and bags.' },
    { speaker: 'tessa', text: 'The sampler takes round samples, and the notebook keeps measurements as a backup.' },
    { speaker: 'jake', text: 'Did we include a tape measure? We need to mark the distance between points along the slope.' },
    { speaker: 'tessa', text: 'I did not put that down. Good catch, I will add it before we print the list.' },
    { speaker: 'jake', text: 'And the recording method? Last group typed their notes up after lunch.' },
    { speaker: 'tessa', text: 'I would rather not. We lose numbers copying by hand, and notes get misread.' },
    { speaker: 'jake', text: 'So we use the phone app instead, which syncs straight to a shared spreadsheet back in the lab.' },
    { speaker: 'tessa', text: 'Yes. Each reading goes in as we take it, and the tutor can open the sheet.' },
    { speaker: 'jake', text: 'Then the paper sheets are just a backup if the phone loses signal.' },
    { speaker: 'tessa', text: 'Agreed. Now the split of jobs for the day itself.' },
    { speaker: 'jake', text: 'I will take the device readings. I can record the GPS reading at each spot.' },
    { speaker: 'tessa', text: 'Then I handle the samples. I label and bag them as soon as the core comes out.' },
    { speaker: 'jake', text: 'And transport. Can I book the college minibus for the morning, so we do not rely on my car?' },
    { speaker: 'tessa', text: 'Please do. I will check the driver knows the track, and write the risk assessment tonight.' },
    { speaker: 'jake', text: 'Thanks. We should also think about what we do before we leave.' },
    { speaker: 'tessa', text: 'The site sits near a tidal creek, so we check tide times before leaving, to avoid a wet walk back.' },
    { speaker: 'jake', text: 'Spare batteries are a must. The GPS and phone drain fast, so we carry spare packs for both.' },
    { speaker: 'tessa', text: 'And the route. We share it with the department office, in case someone raises an alarm if we are late.' },
    { speaker: 'jake', text: 'What else did the tutor suggest? Leave no trace, I think, after the samples are taken.' },
    { speaker: 'tessa', text: 'That is basic etiquette, but not one of our listed preparations for this trip.' },
    { speaker: 'jake', text: 'Right. Should we bring lunch from college, or buy something on the way?' },
    { speaker: 'tessa', text: 'A packed lunch is optional. Nobody needs to arrange it through the college shop.' },
    { speaker: 'jake', text: 'And clothes? The handbook mentions the sports kit for indoor labs only.' },
    { speaker: 'tessa', text: 'For the slope we wear walking boots and old trousers, not the kit.' },
    { speaker: 'jake', text: 'One more detail. How do we code the sample bags once they are filled?' },
    { speaker: 'tessa', text: 'Each bag gets a point number and the date, on a sticker fixed to the side.' },
    { speaker: 'jake', text: 'Should the numbers match the GPS readings on the spreadsheet?' },
    { speaker: 'tessa', text: 'Exactly. That way a sample can be traced back to the exact spot it came from.' },
    { speaker: 'jake', text: 'Where do we store the bags overnight if we cannot bring them straight back?' },
    { speaker: 'tessa', text: 'The lab fridge has a small shelf for samples, labelled with our course name.' },
    { speaker: 'jake', text: 'Should we mark the bags with the course code before we leave?' },
    { speaker: 'tessa', text: 'The code goes on the sticker beside the point number, so nobody mixes bags up.' },
    { speaker: 'jake', text: 'What time do we meet the minibus outside college?' },
    { speaker: 'tessa', text: 'Half past seven, so we can park near the track before the sun gets high.' },
    { speaker: 'jake', text: 'Did the tutor ask for a short report after the fieldwork?' },
    { speaker: 'tessa', text: 'She wants one page of findings and a graph by the following Friday.' },
    { speaker: 'jake', text: 'Who writes that up once the data is in the sheet?' },
    { speaker: 'tessa', text: 'We split it between us, as long as the figures match the sample labels.' },
    { speaker: 'jake', text: 'Anything else we should check tonight?' },
    { speaker: 'tessa', text: 'Tell the office our return time, and leave a copy of the plan with reception.' },
    { speaker: 'jake', text: 'Good. I will draft the site description and send it to you tonight.' },
    { speaker: 'tessa', text: 'I will add the tape measure and risk assessment, then confirm the reserve date.' },
    { speaker: 'jake', text: 'Anything I missed? The contact numbers for the site owner?' },
    { speaker: 'tessa', text: 'The tutor will copy us on that email once she approves the plan.' },
    { speaker: 'jake', text: 'Do we need to calibrate the GPS before we leave the college?' },
    { speaker: 'tessa', text: 'Yes, open it in the car park first, so it finds enough satellites before we walk out.' },
    { speaker: 'jake', text: 'I will note that next to the minibus booking on the sheet.' },
    { speaker: 'tessa', text: 'And print a paper map of the track, in case the phone signal drops on the slope.' },
    { speaker: 'jake', text: 'Perfect. I think we are ready to show it to her tomorrow morning.' },
    { speaker: 'tessa', text: 'Thanks for sorting it out with me tonight.' },
    { speaker: 'jake', text: 'No problem. See you at the meeting.' },
  ],
  vocabulary: [
    {
      term: 'site', phonetic: '/saɪt/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '（考察）地点，场地', en: 'the chosen place where fieldwork takes place' },
      usage: { zh: 'field site、sampling site；与 sight（视力）同音，靠语境区分。', en: 'field site, sampling site; a homophone of sight, distinguished by context.' },
      collocations: ['the second site', 'the main site', 'a field site'],
      example: { en: 'The second site gives more varied soil readings.', zh: '第二个地点的土壤读数差异更大。' },
      listening: { zh: '与 sight 同音；搭配 sampling point 帮助判断是“地点”。', en: 'Homophone of sight; the collocation sampling point identifies the meaning.' },
    },
    {
      term: 'contingency', phonetic: '/kənˈtɪndʒənsi/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '应急预案，备用方案', en: 'a plan for what to do if something goes wrong' },
      usage: { zh: 'a clear contingency、contingency plan；正式学术用词。', en: 'a clear contingency, contingency plan; formal academic register.' },
      collocations: ['a contingency plan', 'the weather contingency', 'as a contingency'],
      example: { en: 'The rain contingency is a reserve date two weeks later.', zh: '雨天预案是两周后的备用日期。' },
      listening: { zh: '重音在第三音节 /ˈdʒen/，前面两个音节弱读。', en: 'Stress the third syllable; the first two are reduced.' },
    },
    {
      term: 'sampling', phonetic: '/ˈsɑːmplɪŋ/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '采样，取样', en: 'taking small representative pieces for study' },
      usage: { zh: 'sampling point、soil sampling；动词 sample 的动名词。', en: 'sampling point, soil sampling; the gerund of sample.' },
      collocations: ['sampling point', 'soil sampling', 'the sampling plan'],
      example: { en: 'Each sampling point sits about ten paces up the slope.', zh: '每个采样点沿坡相距约十步。' },
      listening: { zh: '两个音节 /ˈsɑːm/ /plɪŋ/，重音在第一音节。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'calibrate', phonetic: '/ˈkælɪbreɪt/', partOfSpeech: 'v.', sentenceIndex: 58,
      meaning: { zh: '校准（仪器）', en: 'to adjust a measuring device to give correct readings' },
      usage: { zh: 'calibrate the GPS、calibrate the scale；名词 calibration。', en: 'calibrate the GPS or scale; the noun is calibration.' },
      collocations: ['calibrate the device', 'calibrate before use', 'instrument calibration'],
      example: { en: 'Open the GPS in the car park to calibrate it first.', zh: '先在停车场打开 GPS 完成校准。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkæl/，末尾 /reɪt/ 清晰。', en: 'Three syllables, stress on the first; the ending /reɪt/ is clear.' },
    },
    {
      term: 'spreadsheet', phonetic: '/ˈspredʃiːt/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '电子表格', en: 'a digital table for entering and sorting data' },
      usage: { zh: 'shared spreadsheet、fill in the spreadsheet；可多人同时编辑。', en: 'shared spreadsheet, fill in the spreadsheet; several people can edit at once.' },
      collocations: ['a shared spreadsheet', 'the course spreadsheet', 'open the spreadsheet'],
      example: { en: 'Each reading goes straight into the shared spreadsheet.', zh: '每条读数直接进入共享表格。' },
      listening: { zh: '复合词，重音在第一音节 /ˈspred/，中间 /ʃ/ 清晰。', en: 'A compound with stress on the first; the middle /ʃ/ is clear.' },
    },
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '备用的，预留的（日期/资源）', en: 'kept available for a later possible need' },
      usage: { zh: 'reserve date、reserve equipment；动词义为预留，这里作定语。', en: 'reserve date, reserve equipment; as a verb it means to keep for later.' },
      collocations: ['the reserve date', 'a reserve sample', 'in reserve'],
      example: { en: 'The reserve date is two weeks after the planned visit.', zh: '备用日期在计划考察的两周后。' },
      listening: { zh: '与考察语境的 reserve 搭配 date；动词重音同样在第二音节。', en: 'Paired with date here; the verb also stresses the second syllable.' },
    },
    {
      term: 'sticker', phonetic: '/ˈstɪkə/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '标签贴纸', en: 'a small adhesive label fixed to a bag or sample' },
      usage: { zh: 'on the sticker、fix a sticker；样本编号常写在贴纸上。', en: 'on the sticker, fix a sticker; sample numbers are written on it.' },
      collocations: ['the sample sticker', 'a numbered sticker', 'fix a sticker'],
      example: { en: 'The point number goes on the sticker beside the code.', zh: '点位编号写在编码旁的贴纸上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstɪ/，第二个 /kə/ 弱读。', en: 'Two syllables, stress on the first; the second /kə/ is reduced.' },
    },
  ],
  expressions: [
    {
      phrase: 'go through', sentenceIndex: 0,
      meaning: { zh: '逐一讨论，过一遍', en: 'to review items one by one' },
      usage: { zh: 'go through the plan、go through the list；后接讨论对象。', en: 'go through the plan or list; the object follows the phrase.' },
      example: { en: 'We will go through the equipment list before we print it.', zh: '打印前我们先过一遍设备清单。' },
    },
    {
      phrase: 'lock the sites', sentenceIndex: 1,
      meaning: { zh: '把地点定下来', en: 'to fix and confirm the chosen field sites' },
      usage: { zh: 'lock 此处指确定不再更改；与 lock a door 的物理锁不同。', en: 'Here lock means finalise, not a physical door lock.' },
      example: { en: 'Once we lock the sites, the risk assessment can be written.', zh: '地点定下来后就能写风险评估。' },
    },
    {
      phrase: 'run through', sentenceIndex: 14,
      meaning: { zh: '快速检查，逐项过一遍', en: 'to check a list or plan from beginning to end' },
      usage: { zh: 'run through the list、run through the schedule；比 go through 更轻快。', en: 'run through the list or schedule; lighter than go through.' },
      example: { en: 'Let us run through the gear before the minibus arrives.', zh: '小巴来之前我们快速核对一遍装备。' },
    },
    {
      phrase: 'good catch', sentenceIndex: 17,
      meaning: { zh: '好眼力，发现得好', en: 'said when someone notices a missing or wrong item' },
      usage: { zh: '口语回应对方发现遗漏；后接补充动作。', en: 'A spoken response when someone spots a gap; a corrective action follows.' },
      example: { en: 'Good catch, I will add the tape measure today.', zh: '好眼力，我今天就把卷尺加上。' },
    },
    {
      phrase: 'rely on', sentenceIndex: 26,
      meaning: { zh: '依靠，依赖', en: 'to depend on someone or something' },
      usage: { zh: 'rely on a car、rely on the phone；后接名词或代词。', en: 'rely on a car or the phone; follow with a noun or pronoun.' },
      example: { en: 'We book the minibus so we do not rely on my own car.', zh: '我们订小巴，不指望用我自己的车。' },
    },
    {
      phrase: 'tape measure', sentenceIndex: 16,
      meaning: { zh: '卷尺', en: 'a marked strip used to measure distances between points' },
      usage: { zh: 'fieldwork 装备：include a tape measure、mark the distance with a tape measure。', en: 'Fieldwork gear: include a tape measure, mark the distance with one.' },
      example: { en: 'The tape measure marks each point along the slope.', zh: '卷尺标出坡上的每个点位。' },
    },
    {
      phrase: 'leave no trace', sentenceIndex: 32,
      meaning: { zh: '不留痕迹（野外礼仪）', en: 'to remove all signs of a visit from the field' },
      usage: { zh: '固定野外规范说法；leave no trace in the field。', en: 'A fixed field-ethics phrase: leave no trace in the field.' },
      example: { en: 'Take all bags and waste away, and leave no trace on the slope.', zh: '带走所有袋子和垃圾，坡上不留痕迹。' },
    },
  ],
  tips: [
    {
      title: { zh: '单选先抓选择理由', en: 'Listen for the reason, not the site name' },
      body: {
        zh: '讨论题的单选常考“为什么选这个点/这项安排”。听到第二个地点时，紧跟着的 because、so 或 that is why 才是选项依据，不要只凭出现过的地名选。',
        en: 'Discussion single choices often test why a site or plan was chosen. The because, so or that is why after the second location carries the option; do not choose on a place name alone.',
      },
    },
    {
      title: { zh: '分工配对按说话人定位', en: 'Match tasks to the speaker' },
      body: {
        zh: '配对题每项先圈出说话人名字，听到 I will、I can 这类主动承担句，就在该人名旁写任务。注意同一人可能承担两项任务，不要默认每人只配一次。',
        en: 'Circle each speaker before listening; when you hear I will or I can, write the task beside that name. One person may take two tasks, so do not assume each matches once.',
      },
    },
    {
      title: { zh: '多选排除未列入项', en: 'Drop preparations that are ruled out' },
      body: {
        zh: '多选题会混入基本礼仪、可选午餐和室内装备等干扰项。听到 optional、not on the list、basic etiquette 这类限定，把对应选项划掉，再从剩下的里面选三项。',
        en: 'Multiple choice mixes in basic etiquette, optional lunch and indoor kit. When you hear optional, not on the list or basic etiquette, cross that option out, then choose three from what remains.',
      },
    },
  ],
};
