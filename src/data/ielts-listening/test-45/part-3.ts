import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 45 · Part 3 — 实验室安全视频策划（两名学生）。原创仿真材料，非官方真题。
 *
 * 分工讨论在前半段（配对 21–24），视频目的、实拍原因与后续流程在中段（单选 25–27），
 * 必拍内容清单在后半段（多选 28–30）。题块顺序与录音顺序一致。
 */
export const test45Part3: ListeningLesson = {
  slug: 'test-45-part-3',
  part: 3,
  status: 'published',
  title: { zh: '实验室安全视频策划', en: 'Planning a lab safety induction video' },
  summary: {
    zh: '两名学生策划新生实验室安全入门视频：按工位逐个拍摄、开场列出防护装备、先演示错误动作再纠正、成片控制在十分钟以内；讨论视频目的、在真实实验室拍摄的理由、观看后的测验与实操，以及必须拍到的安全内容。',
    en: 'Two students plan a safety induction video for new lab users: film station by station, list protective clothing at the opening, show a deliberate wrong action before the correct one, and keep the cut under ten minutes. They discuss the video’s purpose, filming in the real lab, the quiz and supervised practice that follow, and the safety scenes that must be included.',
  },
  accent: { zh: 'Clara 为加拿大口音，Andrew 为美式口音。', en: 'Clara speaks with a Canadian accent and Andrew with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'clara', label: 'CLARA', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'andrew', label: 'ANDREW', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task has each person taken on in the video plan? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'list the required protective clothing' },
        { key: 'B', text: 'film each lab station in turn' },
        { key: 'C', text: 'show a deliberate wrong action first' },
        { key: 'D', text: 'keep the finished video under ten minutes' },
        { key: 'E', text: 'run a short quiz after viewing' },
      ],
      items: [
        { number: 21, text: 'Clara' },
        { number: 22, text: 'Clara' },
        { number: 23, text: 'Andrew' },
        { number: 24, text: 'Andrew' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What is the induction video mainly meant to achieve?',
          options: [
            { key: 'A', text: 'To train lab staff to repair broken equipment.' },
            { key: 'B', text: 'To introduce new students to basic safety rules.' },
            { key: 'C', text: 'To promote the department to visiting schools.' },
          ],
        },
        {
          number: 26,
          stem: 'Why do they want to film inside the actual laboratory?',
          options: [
            { key: 'A', text: 'The rooms are brightly lit and very quiet.' },
            { key: 'B', text: 'Students will recognise the real stations and escape routes.' },
            { key: 'C', text: 'External studios charge too much money.' },
          ],
        },
        {
          number: 27,
          stem: 'What follows the video in the safety training process?',
          options: [
            { key: 'A', text: 'A signed consent form for camera use.' },
            { key: 'B', text: 'A written exam on equipment faults.' },
            { key: 'C', text: 'A short quiz and supervised practice.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE scenes must the video include? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE scenes must the video include?',
      options: [
        { key: 'A', text: 'goggles and gloves at the bench' },
        { key: 'B', text: 'the fire extinguisher location' },
        { key: 'C', text: 'emergency shower use' },
        { key: 'D', text: 'the online quiz certificate' },
        { key: 'E', text: 'the staff promotion leaflet' },
        { key: 'F', text: 'the old equipment sale catalogue' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I would rather film each lab station in turn, so every bench appears once on camera。Clara 主张按工位逐个拍摄，对应 B。',
        en: 'Sentence 4: "I would rather film each lab station in turn, so every bench appears once on camera". Clara films station by station, matching B.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：I will list the required protective clothing on a title card at the opening。Clara 负责在开场字幕卡上列出防护装备，对应 A。',
        en: 'Sentence 6: "I will list the required protective clothing on a title card at the opening". Clara lists the protective clothing, matching A.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：The video should also show a deliberate wrong action first, then correct it。Andrew 提出先演示一个故意的错误动作再纠正，对应 C。',
        en: 'Sentence 7: "The video should also show a deliberate wrong action first, then correct it". Andrew proposes showing the wrong action first, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 11,
      explanation: {
        zh: '定位句 11：I will keep the finished video under ten minutes in the edit。Andrew 负责在剪辑阶段把成片压在十分钟以内，对应 D。E 的测验由后续流程承担，不是分工选项。',
        en: 'Sentence 11: "I will keep the finished video under ten minutes in the edit". Andrew keeps the cut under ten minutes, matching D. The quiz in E belongs to the follow-up process, not this division of tasks.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：It introduces new students to the basic safety rules before their first independent session。视频目的是给新生讲基础安全规则，对应 B。A 的设备维修、C 的对外宣传都在句 28 被否定。',
        en: 'Sentence 26: "It introduces new students to the basic safety rules before their first independent session". The video introduces basic safety rules, matching B. Equipment repair in A and department promotion in C are rejected in sentence 28.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：Because students will recognise the real stations and the real escape routes。在真实实验室拍是为了让学生认出真实工位和逃生路线，对应 B。句 31 承认灯光要补，但这不是选址理由；C 的外部工作室费用全段未提。',
        en: 'Sentence 30: "Because students will recognise the real stations and the real escape routes". Filming in the real lab helps students recognise stations and routes, matching B. Lighting is added in sentence 31 but is not the reason, and studio costs in C are never mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 34,
      explanation: {
        zh: '定位句 34：They take a short quiz, then practise the procedures under supervision。看完视频先做小测验，再在监督下实操，对应 C。A 的知情同意书是拍摄前手续，B 的设备故障笔试没有提到。',
        en: 'Sentence 34: "They take a short quiz, then practise the procedures under supervision". A quiz comes first, then supervised practice, matching C. The consent form in A is pre-filming paperwork, and a faults exam in B is not mentioned.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：First, goggles and gloves must be shown at the bench。护目镜和手套必须在工位出镜，对应 A。',
        en: 'Sentence 38: "First, goggles and gloves must be shown at the bench". Goggles and gloves must appear at the bench, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：We also need to mark the fire extinguisher location on the wall shot。墙面镜头要标出灭火器位置，对应 B。',
        en: 'Sentence 39: "We also need to mark the fire extinguisher location on the wall shot". The extinguisher location must be marked, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 40,
      explanation: {
        zh: '定位句 40：The emergency shower use should be demonstrated as well, with the pull handle shown。应急洗眼淋浴的使用要演示并展示拉手，对应 C。D 的测验证书、E 的晋升传单、F 的旧设备目录在句 42–45 被排除。',
        en: 'Sentence 40: "The emergency shower use should be demonstrated as well, with the pull handle shown". The shower must be demonstrated, matching C. The quiz certificate, promotion leaflet and sale catalogue in D, E and F are excluded in sentences 42 to 45.',
      },
    },
  ],
  transcript: [
    { speaker: 'clara', text: 'Good, we are here to plan the induction video for first year lab sessions.' },
    { speaker: 'andrew', text: 'Right, and the video has to cover the safety basics before anyone works alone.' },
    { speaker: 'clara', text: 'Let us split the list scene by scene, starting with where we will film.' },
    { speaker: 'andrew', text: 'I can look at the rooms first, and check which stations have a clear sight line.' },
    { speaker: 'clara', text: 'I would rather film each lab station in turn, so every bench appears once on camera.' },
    { speaker: 'andrew', text: 'That makes sense. What about the lab coats and goggles section?' },
    { speaker: 'clara', text: 'I will list the required protective clothing on a title card at the opening.' },
    { speaker: 'andrew', text: 'Good. The video should also show a deliberate wrong action first, then correct it.' },
    { speaker: 'clara', text: 'You mean a student handling a bottle without gloves, then stepping back?' },
    { speaker: 'andrew', text: 'Exactly. People remember the mistake more than a plain list of rules.' },
    { speaker: 'clara', text: 'We need to watch the running time, though.' },
    { speaker: 'andrew', text: 'I know, so I will keep the finished video under ten minutes in the edit.' },
    { speaker: 'clara', text: 'Under ten minutes sounds right, given how long the first session already runs.' },
    { speaker: 'andrew', text: 'Shall we set up the shots around the main workbench first?' },
    { speaker: 'clara', text: 'Yes, and leave the storage cupboard and waste bin scenes for the second day.' },
    { speaker: 'andrew', text: 'I will bring the tripod and check the audio levels near the fume hood.' },
    { speaker: 'clara', text: 'The fume hood itself needs a close shot, with the sash position marked on screen.' },
    { speaker: 'andrew', text: 'Do we need to include the emergency exits on camera?' },
    { speaker: 'clara', text: 'Yes, the route out of the room should be shown after the bench section.' },
    { speaker: 'andrew', text: 'What about the small room where reagents are stored?' },
    { speaker: 'clara', text: 'Keep that brief. We only show the shelf layout, not any individual chemical.' },
    { speaker: 'andrew', text: 'Fine. Now who is going to check the script against the department rules?' },
    { speaker: 'clara', text: 'I will cross read the script with the safety officer before we film.' },
    { speaker: 'andrew', text: 'And I will collect the consent forms from any students who appear.' },
    { speaker: 'clara', text: 'Right, no one should be on camera unless they have signed the form.' },
    { speaker: 'andrew', text: 'What is the video mainly meant to achieve, in one sentence?' },
    { speaker: 'clara', text: 'It introduces new students to the basic safety rules before their first independent session.' },
    { speaker: 'andrew', text: 'Not a repair course, and not a department showcase then?' },
    { speaker: 'clara', text: 'Correct. We are not teaching equipment fault diagnosis here.' },
    { speaker: 'andrew', text: 'Why do you want to film inside the actual laboratory?' },
    { speaker: 'clara', text: 'Because students will recognise the real stations and the real escape routes.' },
    { speaker: 'andrew', text: 'The rooms are not the brightest places, though, so lighting matters.' },
    { speaker: 'clara', text: 'We can add portable lamps, but the familiar setting still helps the memory.' },
    { speaker: 'andrew', text: 'After someone watches the video, what happens next in the process?' },
    { speaker: 'clara', text: 'They take a short quiz, then practise the procedures under supervision.' },
    { speaker: 'andrew', text: 'So the video itself is only the first step, not the whole training.' },
    { speaker: 'clara', text: 'That is right. The quiz checks the basics, and the tutor watches the actual work.' },
    { speaker: 'andrew', text: 'Let us settle the content checklist now.' },
    { speaker: 'clara', text: 'First, goggles and gloves must be shown at the bench.' },
    { speaker: 'andrew', text: 'We also need to mark the fire extinguisher location on the wall shot.' },
    { speaker: 'clara', text: 'The emergency shower use should be demonstrated as well, with the pull handle shown.' },
    { speaker: 'andrew', text: 'What about the quiz certificate that the admin team keeps?' },
    { speaker: 'clara', text: 'That belongs to the follow up, not the video itself.' },
    { speaker: 'andrew', text: 'And the leaflet about staff promotion?' },
    { speaker: 'clara', text: 'Leave that out. It has nothing to do with lab safety.' },
    { speaker: 'andrew', text: 'We should not include the old equipment sale catalogue either.' },
    { speaker: 'clara', text: 'Agreed. The catalogue is just background paperwork.' },
    { speaker: 'andrew', text: 'Do we mention the height of the bench seats?' },
    { speaker: 'clara', text: 'Only if it affects posture; otherwise keep the safety focus.' },
    { speaker: 'andrew', text: 'When will the first rough cut be ready?' },
    { speaker: 'clara', text: 'I aim to have it by the end of next week, then we review together.' },
    { speaker: 'andrew', text: 'I will send my notes on station angles before the Thursday meeting.' },
    { speaker: 'clara', text: 'Good. We can adjust the order if a scene runs too long.' },
    { speaker: 'andrew', text: 'Who will narrate the voice over?' },
    { speaker: 'clara', text: 'The safety officer records it, so the wording stays official.' },
    { speaker: 'andrew', text: 'That avoids students copying our informal phrases.' },
    { speaker: 'clara', text: 'Exactly. On screen we keep captions short and in plain English.' },
    { speaker: 'andrew', text: 'Should the video show what to do after an accident?' },
    { speaker: 'clara', text: 'Yes, the last section covers reporting the spill and calling for help.' },
    { speaker: 'andrew', text: 'We should rehearse those shots, since they look serious on camera.' },
    { speaker: 'clara', text: 'We will mark them clearly so no one mistakes the rehearsal for a real incident.' },
    { speaker: 'andrew', text: 'Anything else before we book the filming slots?' },
    { speaker: 'clara', text: 'Check that the lab is empty at lunchtime, so filming does not disturb a class.' },
    { speaker: 'andrew', text: 'I will email the technician to confirm the two free mornings.' },
    { speaker: 'clara', text: 'Perfect. Let us draft the shot list this afternoon.' },
    { speaker: 'andrew', text: 'I will start with the bench sequence and the protective clothing card.' },
    { speaker: 'clara', text: 'And I will note down the safety scenes we must not miss.' },
  ],
  vocabulary: [
    {
      term: 'induction', phonetic: '/ɪnˈdʌkʃn/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '入职或入门培训，引导', en: 'the training given to newcomers before they start' },
      usage: { zh: '不可数；induction video、induction session，指新人入门环节。', en: 'Uncountable: an induction video or session trains newcomers before they start.' },
      collocations: ['the induction video', 'an induction session', 'safety induction'],
      example: { en: 'The induction video covers the basic lab safety rules.', zh: '入门视频涵盖实验室基础安全规则。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdʌk/，开头 /ɪn/ 弱读。', en: 'Two syllables with stress on the second; the opening /ɪn/ is weak.' },
    },
    {
      term: 'protective', phonetic: '/prəˈtektɪv/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '防护的，保护的', en: 'designed to keep a person safe from harm' },
      usage: { zh: '形容词；protective clothing、protective goggles，动词 protect。', en: 'Adjective: protective clothing, protective goggles; the verb is protect.' },
      collocations: ['protective clothing', 'protective gear', 'protective gloves'],
      example: { en: 'The card lists the required protective clothing.', zh: '字幕卡列出必需的防护装备。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtek/，结尾 -tive 读 /tɪv/。', en: 'Three syllables with stress on the second; the ending -tive is /tɪv/.' },
    },
    {
      term: 'deliberate', phonetic: '/dɪˈlɪbərət/', partOfSpeech: 'adj.', sentenceIndex: 7,
      meaning: { zh: '故意的，刻意的', en: 'done on purpose, not by accident' },
      usage: { zh: '形容词；deliberate wrong action 指为教学而故意做出的错误动作。', en: 'Adjective: a deliberate wrong action is a mistake staged on purpose for teaching.' },
      collocations: ['a deliberate wrong action', 'a deliberate choice', 'deliberate practice'],
      example: { en: 'The video shows a deliberate wrong action first.', zh: '视频先演示一个故意的错误动作。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlɪb/；作形容词结尾读 /rət/。', en: 'Three syllables with stress on the second; the adjective ending is /rət/.' },
    },
    {
      term: 'supervision', phonetic: '/ˌsuːpəˈvɪʒn/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '监督，指导看护', en: 'watchful oversight while a procedure is practised' },
      usage: { zh: '不可数；under supervision 指在教师或专人看护下进行实操。', en: 'Uncountable: under supervision means practising while a tutor watches over you.' },
      collocations: ['under supervision', 'close supervision', 'supervised practice'],
      example: { en: 'Students practise the procedures under supervision.', zh: '学生在看护下练习操作流程。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈvɪ/，前两音节连读。', en: 'Four syllables with stress on the third; the first two blend together.' },
    },
    {
      term: 'equipment', phonetic: '/ɪˈkwɪpmənt/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '设备，器材', en: 'tools and instruments used in a laboratory or workshop' },
      usage: { zh: '不可数名词，没有复数；lab equipment、fault diagnosis on equipment。', en: 'Uncountable, no plural: lab equipment, fault diagnosis on equipment.' },
      collocations: ['lab equipment', 'equipment faults', 'repair equipment'],
      example: { en: 'The video does not teach equipment fault diagnosis.', zh: '视频不教设备故障诊断。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkwɪp/，开头 /ɪ/ 弱读。', en: 'Three syllables with stress on the second; the opening /ɪ/ is weak.' },
    },
    {
      term: 'procedures', phonetic: '/prəˈsiːdʒəz/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '操作流程，步骤', en: 'the fixed order of steps for doing a task safely' },
      usage: { zh: '可数名词；lab procedure、follow the procedure，动词 proceed。', en: 'Countable: a lab procedure, follow the procedure; the verb is proceed.' },
      collocations: ['the procedures', 'a safety procedure', 'follow the procedure'],
      example: { en: 'They practise the procedures under supervision.', zh: '他们在看护下练习各项流程。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsiː/，长元音。', en: 'Three syllables with stress on the second and a long vowel.' },
    },
    {
      term: 'rehearse', phonetic: '/rɪˈhɜːs/', partOfSpeech: 'v.', sentenceIndex: 59,
      meaning: { zh: '排练，预演（镜头或动作）', en: 'to practise a shot or action before recording it' },
      usage: { zh: '及物动词；rehearse the shots，名词 rehearsal。', en: 'Transitive: rehearse the shots; the noun is rehearsal.' },
      collocations: ['rehearse those shots', 'rehearse a scene', 'a rehearsal'],
      example: { en: 'We should rehearse the serious shots before filming.', zh: '拍摄前我们应该先排练这些严肃镜头。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈhɜːs/，结尾 /s/ 清辅音。', en: 'Two syllables with stress on the second; the ending is a clear /s/.' },
    },
  ],
  expressions: [
    {
      phrase: 'split the list', sentenceIndex: 2,
      meaning: { zh: '把清单拆开分工', en: 'to divide a list of tasks between people' },
      usage: { zh: 'split 表示分配；split the list scene by scene 指按场景拆分任务。', en: 'Split means divide up; split the list scene by scene divides tasks by scene.' },
      example: { en: 'Let us split the list scene by scene.', zh: '我们按场景把清单拆开分工吧。' },
    },
    {
      phrase: 'in turn', sentenceIndex: 4,
      meaning: { zh: '依次，逐个', en: 'one after another in a fixed order' },
      usage: { zh: '方式状语；film each station in turn 指按顺序逐个拍摄。', en: 'Adverbial of order: film each station in turn means one after another.' },
      example: { en: 'We film each lab station in turn.', zh: '我们按顺序逐个拍摄每个工位。' },
    },
    {
      phrase: 'watch the running time', sentenceIndex: 10,
      meaning: { zh: '注意控制时长', en: 'to keep an eye on how long the final piece lasts' },
      usage: { zh: 'running time 指视频成片时长；watch 在此为留意、控制。', en: 'Running time is the final length; watch here means to keep an eye on.' },
      example: { en: 'We need to watch the running time of the video.', zh: '我们要留意视频的时长。' },
    },
    {
      phrase: 'cross read', sentenceIndex: 22,
      meaning: { zh: '交叉核对（稿件）', en: 'to read something against an official set of rules' },
      usage: { zh: '此处指把脚本与部门安全规定逐条对照；cross read with。', en: 'Here it means checking the script against official rules; cross read with.' },
      example: { en: 'I will cross read the script with the safety officer.', zh: '我会和安全员逐条核对脚本。' },
    },
    {
      phrase: 'belongs to', sentenceIndex: 42,
      meaning: { zh: '属于（某个环节）', en: 'to be part of a later stage rather than the current one' },
      usage: { zh: '此处指测验证书属于后续流程，不属视频内容；belong to 后接阶段。', en: 'Here it means the certificate is a later stage item, not the video; belong to plus a stage.' },
      example: { en: 'The certificate belongs to the follow up.', zh: '证书属于后续流程。' },
    },
    {
      phrase: 'settle the content checklist', sentenceIndex: 37,
      meaning: { zh: '敲定内容清单', en: 'to agree on the list of items that must be included' },
      usage: { zh: 'settle 在此为商定、敲定；checklist 指必拍内容清单。', en: 'Settle means agree on here; the checklist lists the required scenes.' },
      example: { en: 'Let us settle the content checklist now.', zh: '我们现在敲定内容清单吧。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先听分工动词', en: 'Listen for the task verbs in matching' },
      body: {
        zh: '配对四题对应四个任务动词：film、list、show、keep。听到 I will、I would rather 这类表态句时，把说话人和后面的动作一起记下，再去匹配 A–E 的任务描述。',
        en: 'The four matching items turn on the verbs film, list, show and keep. When you hear I will or I would rather, note the speaker and the action together, then match it to the task description in A to E.',
      },
    },
    {
      title: { zh: '被排除的内容不是必拍清单', en: 'Rejected items are not required scenes' },
      body: {
        zh: '多选三题要找必须出镜的三项。测验证书、晋升传单、旧设备目录都被明确排除，它们出现在选项里只是干扰；听到 leave that out、do not include 时划掉对应选项。',
        en: 'The multiple choice asks for the three required scenes. The quiz certificate, promotion leaflet and sale catalogue are explicitly excluded; they appear only as distractors. Cross out an option when you hear leave that out or do not include it.',
      },
    },
    {
      title: { zh: '目的题抓主要定位句', en: 'Pin the purpose question to the main sentence' },
      body: {
        zh: '视频目的那句由 Clara 直接给出：introduces new students to the basic safety rules。后面 Andrew 的反问 Not a repair course 与 Clara 的 Correct 是在排除干扰，不要把否定句里的设备维修当成视频内容。',
        en: 'Clara states the purpose directly: introduces new students to the basic safety rules. Andrew’s follow up Not a repair course and Clara’s Correct only rule out distractors; do not treat equipment repair, mentioned in the rejection, as the video’s content.',
      },
    },
  ],
};
