import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 35 · Part 3 — 酶学会议摘要准备（双人讨论，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 顺序：分工配对（初稿、结构把关、主图选择、标签核对）→ 摘要规则（研究问题、结果图、作者顺序，单选）→
 * 摘要应包含与应排除的材料（多选）。
 */
export const test35Part3: ListeningLesson = {
  slug: 'test-35-part-3',
  part: 3,
  status: 'published',
  title: { zh: '酶学会议摘要准备', en: 'Preparing a conference abstract on enzymes' },
  summary: {
    zh: '研究生 Mei 与导师 Dr Chen 讨论把酶温度实验写成会议摘要：分工为 Mei 写初稿、Dr Chen 把关结构、Ravi 选主图、Ana 核对标签单位；规则包括开场陈述研究问题、结果用一张清晰图呈现、通讯作者列首位；摘要只含研究问题、主要测量结果与下一步计划，不写文献综述、主观意见和原始表格。',
    en: 'Graduate student Mei and supervisor Dr Chen plan the enzyme temperature study as a conference abstract: Mei drafts, Dr Chen checks structure, Ravi picks the figure, Ana verifies labels and units. Rules are a one sentence question, one clear results figure, and the corresponding author first. The abstract carries the question, result and next step, not a review, an opinion or raw tables.',
  },
  accent: { zh: '研究生为加拿大口音，导师为美式口音。', en: 'The graduate student speaks with a Canadian accent and the supervisor with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'mei', label: 'MEI', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'dr-chen', label: 'DR CHEN', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'What is each person responsible for? Choose four answers from the list and write the correct letter, A, B, C or D, next to questions 21–24.',
      items: [
        { number: 21, text: 'writes the first draft of the abstract' },
        { number: 22, text: 'advises on the overall structure' },
        { number: 23, text: 'selects the main figure for the abstract' },
        { number: 24, text: 'verifies the data labels and units' },
      ],
      options: [
        { key: 'A', text: 'Mei, the graduate student' },
        { key: 'B', text: 'Dr Chen, the supervisor' },
        { key: 'C', text: 'Ravi, the lab partner' },
        { key: 'D', text: 'Ana, the research assistant' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What must the abstract opening state?',
          options: [
            { key: 'A', text: 'the research question' },
            { key: 'B', text: 'the full literature review' },
            { key: 'C', text: 'the rejected experimental methods' },
          ],
        },
        {
          number: 26,
          stem: 'How should the main results be presented?',
          options: [
            { key: 'A', text: 'as every raw data table' },
            { key: 'B', text: 'as one clear figure with key numbers' },
            { key: 'C', text: 'as a long written description of each trial' },
          ],
        },
        {
          number: 27,
          stem: 'In what order are authors listed?',
          options: [
            { key: 'A', text: 'all contributors in alphabetical order' },
            { key: 'B', text: 'the corresponding author first, then contributors' },
            { key: 'C', text: 'the presenting author before every other name' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE elements should be included in the abstract? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE elements belong in the abstract?',
      options: [
        { key: 'A', text: 'the central research question' },
        { key: 'B', text: 'a full review of all past literature' },
        { key: 'C', text: 'the main measured result' },
        { key: 'D', text: 'an unsupported personal opinion' },
        { key: 'E', text: 'the planned next step' },
        { key: 'F', text: 'every raw data table' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Mei, you kept the lab notebook through the whole experiment, so you write the first draft。写初稿的是 Mei，对应 A。她在句 5 确认会把草稿发给全员。',
        en: 'Sentence 4: "Mei, you kept the lab notebook through the whole experiment, so you write the first draft", matching A. Sentence 5 confirms she will circulate the draft to everyone.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Dr Chen, that is me, will advise on the overall structure, checking that each section earns its place。把关整体结构的是 Dr Chen，对应 B。',
        en: 'Sentence 6: "Dr Chen, that is me, will advise on the overall structure, checking that each section earns its place", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 8,
      explanation: {
        zh: '定位句 8：Ravi can select the main figure for the poster slot, because the meeting allows one figure per abstract。选主图的是 Ravi，对应 C。他在句 7 与 Mei 一起跑过部分试验。',
        en: 'Sentence 8: "Ravi can select the main figure for the poster slot, because the meeting allows one figure per abstract", matching C. Sentence 7 notes he ran part of the trials with Mei.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 10,
      explanation: {
        zh: '定位句 10：Ana should verify the data labels and units before we paste the figure into the draft。核对标签与单位的是 Ana，对应 D。她在句 9 负责录入读数并检查单位。',
        en: 'Sentence 10: "Ana should verify the data labels and units before we paste the figure into the draft", matching D. Sentence 9 notes she entered readings and checked units.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 14,
      explanation: {
        zh: '定位句 14：The opening has to state the research question in one clear sentence。开场陈述研究问题，对应 A。文献综述不进摘要，被拒方法也不在开场交代。',
        en: 'Sentence 14: "The opening has to state the research question in one clear sentence", matching A. The literature review does not enter the abstract, and rejected methods are not explained in the opening.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The main results should be shown in one clear figure, with the key numbers written beside it。结果用一张清晰图配关键数字，对应 B。原始表格留到海报和全文（句 18）。',
        en: 'Sentence 17: "The main results should be shown in one clear figure, with the key numbers written beside it", matching B. Raw tables stay in the poster and full paper, in sentence 18.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：The corresponding author is listed first, then the contributors in order of their work。通讯作者列首位，其余按贡献排序，对应 B。不是字母顺序，也不是报告者前置。',
        en: 'Sentence 20: "The corresponding author is listed first, then the contributors in order of their work", matching B. It is neither alphabetical order nor presenter-first order.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：The central research question, the main measured result and the planned next step all belong in the short text。研究问题应纳入，选 A。完整文献综述在句 30 被排除。',
        en: 'Sentence 29: "The central research question, the main measured result and the planned next step all belong in the short text", selecting A. The full literature review is excluded in sentence 30.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29 同上，主要测量结果应纳入，选 C。句 33 要求把该结果平实写出；主观意见与原始表格都不在摘要内。',
        en: 'Sentence 29 as above: the main measured result belongs in, selecting C. Sentence 33 asks for that result plainly; unsupported opinion and raw tables do not enter.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 29,
      explanation: {
        zh: '定位句 29 同上，计划中的下一步应纳入，选 E。句 35 限定下一步只用一两句收尾；每项原始表格被句 30 排除。',
        en: 'Sentence 29 as above: the planned next step belongs in, selecting E. Sentence 35 limits it to one or two closing sentences; every raw data table is excluded in sentence 30.',
      },
    },
  ],
  transcript: [
    { speaker: 'dr-chen', text: 'Our meeting today is about turning the enzyme experiment into a conference abstract, so let us first divide the work among the four of us.' },
    { speaker: 'mei', text: 'I have read the call for papers, and the submission portal opens next month.' },
    { speaker: 'dr-chen', text: 'Good. The abstract must fit the theme of the meeting, not just describe our work in isolation.' },
    { speaker: 'mei', text: 'The study looked at how temperature changes the activity of three common digestive enzymes.' },
    { speaker: 'dr-chen', text: 'Mei, you kept the lab notebook through the whole experiment, so you write the first draft.' },
    { speaker: 'mei', text: 'I can do that. I will send the draft to everyone before the internal review next Friday.' },
    { speaker: 'dr-chen', text: 'I will advise on the overall structure, checking that each section earns its place.' },
    { speaker: 'mei', text: 'Ravi ran part of the enzyme trials with me, so he knows which result is strongest.' },
    { speaker: 'dr-chen', text: 'Ravi can select the main figure for the poster slot, because the meeting allows one figure per abstract.' },
    { speaker: 'mei', text: 'Ana entered the readings into the sheet and checked the units each time.' },
    { speaker: 'dr-chen', text: 'Ana should verify the data labels and units before we paste the figure into the draft.' },
    { speaker: 'mei', text: 'I will ask her this afternoon, and send the corrected figure back to Ravi for approval.' },
    { speaker: 'dr-chen', text: 'Now that roles are set, let us go through the rules of the abstract itself.' },
    { speaker: 'mei', text: 'The abstract has a fixed structure from start to finish, question, methods, findings and conclusion.' },
    { speaker: 'dr-chen', text: 'The opening has to state the research question in one clear sentence.' },
    { speaker: 'mei', text: 'I will keep the background to one sentence, then move straight to what we tested.' },
    { speaker: 'dr-chen', text: 'What should we present from the results? We have tables of enzyme activity at several temperatures.' },
    { speaker: 'mei', text: 'The main results should be shown in one clear figure, with the key numbers written beside it.' },
    { speaker: 'dr-chen', text: 'Raw tables stay in the poster and the later paper, not in the short abstract.' },
    { speaker: 'mei', text: 'What about the author order on the submission form?' },
    { speaker: 'dr-chen', text: 'The corresponding author is listed first, then the contributors in order of their work.' },
    { speaker: 'mei', text: 'I did most of the bench work, so my name appears after yours.' },
    { speaker: 'dr-chen', text: 'You are the first contributor after me, and Ravi and Ana follow according to their roles.' },
    { speaker: 'dr-chen', text: 'How many words are we allowed for the abstract?' },
    { speaker: 'mei', text: 'The limit is two hundred and fifty words, excluding the title and the author list.' },
    { speaker: 'dr-chen', text: 'The word count matters because reviewers skim dozens of abstracts before the meeting.' },
    { speaker: 'mei', text: 'I will check the word count after the first draft, and trim any section that runs long.' },
    { speaker: 'dr-chen', text: 'Keep the language concise. A short, clear sentence beats a long, cloudy one.' },
    { speaker: 'mei', text: 'So which material belongs in the abstract, and which should stay out?' },
    { speaker: 'dr-chen', text: 'The central research question, the main measured result and the planned next step all belong in the short text.' },
    { speaker: 'mei', text: 'We leave out a full review of past literature, an unsupported personal opinion and every raw data table.' },
    { speaker: 'dr-chen', text: 'Correct. A review of prior work belongs to the meeting paper, not the abstract.' },
    { speaker: 'mei', text: 'The results show that one enzyme keeps its activity at a higher temperature than the other two.' },
    { speaker: 'dr-chen', text: 'State that measured result plainly, and say what it suggests about enzyme stability.' },
    { speaker: 'mei', text: 'Should we mention the planned next step, such as testing a wider range of temperatures?' },
    { speaker: 'dr-chen', text: 'Yes, the planned next step belongs in the closing line, but only in one or two sentences.' },
    { speaker: 'mei', text: 'I will avoid an unsupported personal opinion in the abstract, since reviewers prefer measured claims.' },
    { speaker: 'dr-chen', text: 'What format does the submission portal accept?' },
    { speaker: 'mei', text: 'Plain text for the abstract, and one figure in a common image format once the abstract is accepted.' },
    { speaker: 'mei', text: 'Keep the legend short, and label every axis with its unit.' },
    { speaker: 'dr-chen', text: 'How much background should the opening carry?' },
    { speaker: 'mei', text: 'One sentence on why enzyme stability matters, then straight to our research question.' },
    { speaker: 'dr-chen', text: 'I will not open with a long history of enzyme studies, since the abstract space is limited.' },
    { speaker: 'mei', text: 'Right. Reviewers already know the field; they want our question and our result.' },
    { speaker: 'dr-chen', text: 'Should the conclusion say the experiment settled the whole question?' },
    { speaker: 'mei', text: 'Not quite. Say what the readings suggest, and leave room for the planned wider tests.' },
    { speaker: 'dr-chen', text: 'I will write that modestly, without claiming more than the data support.' },
    { speaker: 'mei', text: 'That is the tone reviewers look for, especially in a student abstract.' },
    { speaker: 'dr-chen', text: 'Which conference should we target this time?' },
    { speaker: 'mei', text: 'There are two meetings, the national life sciences forum and the regional enzyme symposium.' },
    { speaker: 'dr-chen', text: 'The national forum attracts industry researchers, while the symposium focuses on basic lab work.' },
    { speaker: 'mei', text: 'The regional symposium matches our methods, so submit there first if the dates fit.' },
    { speaker: 'dr-chen', text: 'The submission deadline for the symposium is the middle of October.' },
    { speaker: 'mei', text: 'If the review rejects us, we can revise for the forum before its closing date.' },
    { speaker: 'dr-chen', text: 'Do we need ethics approval for an abstract based on these lab readings?' },
    { speaker: 'mei', text: 'The committee asks for a short note on materials, but no separate ethics form for this stage.' },
    { speaker: 'dr-chen', text: 'The enzymes were commercial preparations, so there were no animal or human samples involved.' },
    { speaker: 'mei', text: 'Make that clear in the methods sentence, so reviewers do not ask follow up questions.' },
    { speaker: 'dr-chen', text: 'Should I list myself as presenting author when we register?' },
    { speaker: 'mei', text: 'Yes, you will present the poster, so your name goes in that field as well.' },
    { speaker: 'dr-chen', text: 'When do we circulate the draft to the whole team?' },
    { speaker: 'mei', text: 'Send it by Wednesday, so everyone has time to comment before Friday’s review.' },
    { speaker: 'dr-chen', text: 'I will collect the comments in one sheet, and mark which ones change the wording.' },
    { speaker: 'mei', text: 'After the review, I will sign off on the author list before you press submit.' },
    { speaker: 'dr-chen', text: 'Thank you. I will start the draft tonight and share it in the group folder.' },
    { speaker: 'mei', text: 'Good. Keep the abstract tight, and we can talk again once the draft is in.' },
  ],
  vocabulary: [
    {
      term: 'abstract', phonetic: '/ˈæbstrækt/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '会议摘要', en: 'the short summary submitted to a conference' },
      usage: { zh: '可数名词；write an abstract、submit an abstract。重音在第一音节。', en: 'Countable: write an abstract, submit an abstract; stress on the first syllable.' },
      collocations: ['the conference abstract', 'submit an abstract', 'the abstract limit'],
      example: { en: 'We are turning the experiment into an abstract.', zh: '我们要把实验写成会议摘要。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈæb/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'structure', phonetic: '/ˈstrʌktʃə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '结构，段落安排', en: 'the order of sections inside the abstract' },
      usage: { zh: '可数/不可数；overall structure、the abstract structure。', en: 'Overall structure, the abstract structure.' },
      collocations: ['the overall structure', 'the abstract structure', 'check the structure'],
      example: { en: 'The supervisor advises on the overall structure.', zh: '导师把关整体结构。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstrʌk/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'draft', phonetic: '/drɑːft/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '草稿，初稿', en: 'the first written version before revision' },
      usage: { zh: '可数名词；first draft、send the draft。动词 draft。', en: 'Countable: first draft, send the draft; the verb is draft.' },
      collocations: ['the first draft', 'a rough draft', 'circulate the draft'],
      example: { en: 'The graduate student writes the first draft.', zh: '研究生负责写初稿。' },
      listening: { zh: '单音节，结尾 /ft/，与 craft 押韵。', en: 'One syllable ending /ft/, rhyming with craft.' },
    },
    {
      term: 'activity', phonetic: '/ækˈtɪvəti/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '（酶）活性', en: 'the rate at which an enzyme acts on its target' },
      usage: { zh: '不可数；enzyme activity、keep its activity。', en: 'Uncountable: enzyme activity, keep its activity.' },
      collocations: ['enzyme activity', 'measure the activity', 'high activity'],
      example: { en: 'Temperature changes the activity of the enzymes.', zh: '温度改变酶的活性。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈtɪ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'figure', phonetic: '/ˈfɪɡə/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '图，图表', en: 'the graph or illustration shown in the abstract' },
      usage: { zh: '可数名词；main figure、select a figure。', en: 'Countable: main figure, select a figure.' },
      collocations: ['the main figure', 'one figure', 'the figure legend'],
      example: { en: 'The meeting allows one figure per abstract.', zh: '会议要求每篇摘要一张图。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈfɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'labels', phonetic: '/ˈleɪblz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '图表标签，标注', en: 'the names and units written on each axis or curve' },
      usage: { zh: '可数复数；data labels、check the labels。单数 label。', en: 'Countable plural: data labels, check the labels; singular label.' },
      collocations: ['the data labels', 'check the labels', 'clear labels'],
      example: { en: 'The assistant verifies the data labels and units.', zh: '助手核对数据标签与单位。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈleɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'concise', phonetic: '/kənˈsaɪs/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '简洁的，精炼的', en: 'short and clear, without extra words' },
      usage: { zh: '形容词；concise language、keep the abstract concise。', en: 'Concise language, keep the abstract concise.' },
      collocations: ['concise language', 'a concise abstract', 'concise wording'],
      example: { en: 'Keep the language concise in the abstract.', zh: '摘要语言要简洁。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈsaɪs/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'stability', phonetic: '/stəˈbɪləti/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '稳定性', en: 'how well an enzyme keeps working under changed conditions' },
      usage: { zh: '不可数；enzyme stability、thermal stability。', en: 'Uncountable: enzyme stability, thermal stability.' },
      collocations: ['enzyme stability', 'thermal stability', 'test the stability'],
      example: { en: 'The result suggests something about enzyme stability.', zh: '该结果提示了酶的稳定性。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈbɪl/。', en: 'Four syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'fit the theme', sentenceIndex: 2,
      meaning: { zh: '切合会议主题', en: 'to match the stated topic of the meeting' },
      usage: { zh: '及物；fit the theme、fit the call for papers。', en: 'Transitive: fit the theme, fit the call for papers.' },
      example: { en: 'The abstract must fit the meeting theme.', zh: '摘要必须切合会议主题。' },
    },
    {
      phrase: 'skim dozens of', sentenceIndex: 25,
      meaning: { zh: '快速浏览大量（摘要）', en: 'to read many abstracts quickly before selection' },
      usage: { zh: '及物；skim dozens of papers、skim submissions。', en: 'Transitive: skim dozens of papers, skim submissions.' },
      example: { en: 'Reviewers skim dozens of abstracts before the meeting.', zh: '评审会前要快速浏览几十篇摘要。' },
    },
    {
      phrase: 'belong in', sentenceIndex: 29,
      meaning: { zh: '应纳入（某文本）', en: 'to be the kind of material that fits a stated text' },
      usage: { zh: '及物；belong in the abstract、belong in the paper。', en: 'Transitive: belong in the abstract, belong in the paper.' },
      example: { en: 'The question and result belong in the abstract.', zh: '问题与结果应写进摘要。' },
    },
    {
      phrase: 'sign off on', sentenceIndex: 63,
      meaning: { zh: '签字确认，最终批准', en: 'to approve something officially before submission' },
      usage: { zh: '及物；sign off on the author list、sign off on the draft。', en: 'Transitive: sign off on the author list, sign off on the draft.' },
      example: { en: 'The supervisor signs off on the author list.', zh: '导师签字确认作者名单。' },
    },
    {
      phrase: 'press submit', sentenceIndex: 63,
      meaning: { zh: '点击提交', en: 'to send the abstract through the portal' },
      usage: { zh: '及物短语；press submit、click submit。', en: 'Transitive: press submit, click submit.' },
      example: { en: 'Do not press submit before the review signs off.', zh: '审核确认前不要点击提交。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先列人名身份', en: 'Map names to roles first' },
      body: {
        zh: '听到四个名字先在选项旁标出身份：Mei 研究生、Dr Chen 导师、Ravi 实验搭档、Ana 研究助理；题目问职责时把录音里的动作对到人，别只抓职位词。',
        en: 'Mark each identity beside the options as names appear: Mei graduate, Dr Chen supervisor, Ravi lab partner, Ana research assistant. Match the action described to the person, not just the job title.',
      },
    },
    {
      title: { zh: '摘要取舍抓三类与三类排除', en: 'Keep three in, three out' },
      body: {
        zh: '纳入：研究问题、主要测量结果、下一步计划；排除：完整文献综述、无依据的主观意见、每项原始表格。多选选项常把排除项换个说法重复出现，听时对照句 29 与句 30 的成对清单。',
        en: 'Keep the question, the measured result and the next step; leave out the full literature review, an unsupported opinion and raw tables. Multiple choice distractors rephrase the excluded items; check against the paired lists in sentences 29 and 30.',
      },
    },
    {
      title: { zh: '作者顺序听“谁在前”', en: 'Listen for who comes first' },
      body: {
        zh: '通讯作者列首位，其余按工作贡献排序；报告者身份只填在注册栏，不改变作者顺序。听到 first、after、contributor 这类顺序词时记录前后关系。',
        en: 'The corresponding author comes first, then contributors by role; presenting author status fills a registration field but does not reorder authors. Record the before-after relation at first, after and contributor.',
      },
    },
  ],
};
