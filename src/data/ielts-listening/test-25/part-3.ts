import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 25 · Part 3 — 住房政策答辩准备（师生讨论，两人）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：先按任务分工（论点梳理、数据收集、计时、核对引用），再谈开场论点、
 * 数据支撑、不会答的处理方式，最后列时间控制与表达建议。配对块在前，单选块居中，
 * 多选块在后，题块顺序与录音顺序一致。开场用导师自我介绍。
 */
export const test25Part3: ListeningLesson = {
  slug: 'test-25-part-3',
  part: 3,
  status: 'published',
  title: { zh: '住房政策答辩准备', en: 'Preparing for a viva on housing policy' },
  summary: {
    zh: '导师与学生准备住房政策答辩：先分工——导师梳理核心论点、学生收集支撑数据、朋友为试讲计时、两人共同核对引用；随后讨论开场如何讲清论点、必须展示的本地租金数据、答不上问题时的处理，以及时间控制、停顿与眼神交流等表达建议。',
    en: 'A supervisor and student prepare a viva on housing policy. They divide the work: the supervisor outlines the core argument, the student gathers statistics, a friend times rehearsal answers, and the pair check citations together. They then discuss a clear opening, the local rent data required, handling an unknown question, and advice on timing, pauses and eye contact.',
  },
  accent: { zh: '导师为加拿大口音，学生为美式口音。', en: 'The supervisor speaks with a Canadian accent and the student with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'supervisor', label: 'SUPERVISOR', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'predicts the likely examiner questions' },
        { key: 'B', text: 'outlines the core argument of the thesis' },
        { key: 'C', text: 'gathers the supporting statistics' },
        { key: 'D', text: 'times the practice answers' },
        { key: 'E', text: 'prepares the slide deck' },
        { key: 'F', text: 'checks the citations' },
      ],
      items: [
        { number: 21, text: 'the supervisor' },
        { number: 22, text: 'the student' },
        { number: 23, text: 'the student’s friend' },
        { number: 24, text: 'the two of them together' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why does the student worry about his opening?',
          options: [
            { key: 'A', text: 'He may run out of rehearsal time.' },
            { key: 'B', text: 'He cannot state the thesis clearly.' },
            { key: 'C', text: 'The slides are still unfinished.' },
          ],
        },
        {
          number: 26,
          stem: 'What data does the supervisor say must be shown?',
          options: [
            { key: 'A', text: 'National house prices over ten years' },
            { key: 'B', text: 'Local rent figures for nearby districts' },
            { key: 'C', text: 'Census household sizes for the province' },
          ],
        },
        {
          number: 27,
          stem: 'How should the student handle a question he cannot answer?',
          options: [
            { key: 'A', text: 'Guess politely until an answer emerges' },
            { key: 'B', text: 'Admit the limit and offer to follow up' },
            { key: 'C', text: 'Change the subject to a familiar topic' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE pieces of advice concern time control and delivery? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE recommendations about timing and delivery does the supervisor give?',
      options: [
        { key: 'A', text: 'keep each answer under two minutes' },
        { key: 'B', text: 'read the notes aloud word for word' },
        { key: 'C', text: 'pause before replying to a hard question' },
        { key: 'D', text: 'memorise every statistic in the thesis' },
        { key: 'E', text: 'stare at the screen while speaking' },
        { key: 'F', text: 'make eye contact with the panel' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I’ll outline the core argument of the thesis, so every answer circles back to one clear line。导师梳理核心论点，对应 B。',
        en: 'Sentence 4: "I’ll outline the core argument of the thesis, so every answer circles back to one clear line". The supervisor outlines the argument, matching B.',
      },
    },
    {
      number: 22, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：Then I can gather the supporting statistics behind each claim。学生收集支撑统计数据，对应 C。',
        en: 'Sentence 5: "Then I can gather the supporting statistics behind each claim". The student gathers the statistics, matching C.',
      },
    },
    {
      number: 23, accepted: ['D'], evidence: 6,
      explanation: {
        zh: '定位句 6：Your friend can sit in on the rehearsal and time the practice answers。朋友为试讲计时，对应 D。',
        en: 'Sentence 6: "Your friend can sit in on the rehearsal and time the practice answers". The friend times the answers, matching D.',
      },
    },
    {
      number: 24, accepted: ['F'], evidence: 7,
      explanation: {
        zh: '定位句 7：And the two of us should check the citations together once the draft is fixed。两人共同核对引用，对应 F。',
        en: 'Sentence 7: "And the two of us should check the citations together once the draft is fixed". The pair checks citations together, matching F.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：I’m worried I cannot state the thesis clearly without drifting into background。学生担心开场讲不清论点，对应 B。A 的试讲时间不够和 C 的幻灯片未完在本段没有依据。',
        en: 'Sentence 15: "I’m worried I cannot state the thesis clearly without drifting into background". The student fears an unclear thesis, matching B. Rehearsal time and unfinished slides are not mentioned here.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：The panel mainly wants local rent figures, since the policy is about the neighbourhood。必须展示本地租金数据，对应 B。A 的全国房价只作背景，C 的普查家庭规模被说成次要支撑。',
        en: 'Sentence 20: "The panel mainly wants local rent figures, since the policy is about the neighbourhood". Local rent figures are required, matching B. National prices are only context, and census household size is called secondary support.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：Admit the limit politely, and offer to follow it up after the viva。答不上来就坦诚说明并承诺后续补答，对应 B。A 的猜测在句 28 被否定，C 的转题在句 30 被否定。',
        en: 'Sentence 26: "Admit the limit politely, and offer to follow it up after the viva". An honest admission plus a follow-up offer matches B. Guessing in A is rejected in sentence 28, and changing subject in C in sentence 30.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：Keep each answer under two minutes, so the panel can cover several questions。表达建议之一是每题控制在两分钟内，对应 A。',
        en: 'Sentence 32: "Keep each answer under two minutes, so the panel can cover several questions". The first delivery tip keeps answers under two minutes, matching A.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 38,
      explanation: {
        zh: '定位句 38：Pause briefly before replying to a hard question, so you don’t jump in too fast。难题先停顿再回答，对应 C。照稿宣读在句 36 被否定。',
        en: 'Sentence 38: "Pause briefly before replying to a hard question, so you don’t jump in too fast". Pausing before a hard question matches C. Reading notes aloud is rejected in sentence 36.',
      },
    },
    {
      number: 30, accepted: ['F'], evidence: 42,
      explanation: {
        zh: '定位句 42：And make eye contact with the panel rather than staring at the screen。与评委眼神交流，对应 F。背下每个数字在句 46 被否定，盯屏幕与建议相反。',
        en: 'Sentence 42: "And make eye contact with the panel rather than staring at the screen". Eye contact with the panel matches F. Memorising every statistic is rejected in sentence 46, and staring at the screen is the opposite.',
      },
    },
  ],
  transcript: [
    { speaker: 'supervisor', text: 'Good afternoon. I’m Clara, your supervisor for the housing policy viva, and we have about twenty minutes today.' },
    { speaker: 'student', text: 'Thanks for seeing me. I’ve brought the draft abstract and the slide outline.' },
    { speaker: 'supervisor', text: 'Good. Let’s start by dividing who does what before the rehearsal.' },
    { speaker: 'student', text: 'Shall I list the likely questions the panel might ask?' },
    { speaker: 'supervisor', text: 'I’ll outline the core argument of the thesis, so every answer circles back to one clear line.' },
    { speaker: 'student', text: 'Then I can gather the supporting statistics behind each claim.' },
    { speaker: 'supervisor', text: 'Fine. Your friend can sit in on the rehearsal and time the practice answers.' },
    { speaker: 'student', text: 'And the two of us should check the citations together once the draft is fixed.' },
    { speaker: 'supervisor', text: 'That’s right. I’ll also predict which examiner questions are most likely, based on last year’s vivas.' },
    { speaker: 'student', text: 'So the slides themselves can wait until the argument is settled.' },
    { speaker: 'supervisor', text: 'Exactly. Preparing the slide deck comes after the content is firm.' },
    { speaker: 'student', text: 'Right. Could we go through my opening, then? It’s the part I’m least sure about.' },
    { speaker: 'supervisor', text: 'Read the first two sentences aloud, and I’ll listen for the thesis.' },
    { speaker: 'student', text: 'The thesis looks at how rent rises affect low-income households near the campus.' },
    { speaker: 'supervisor', text: 'That’s a start, but the opening should state the thesis in one direct sentence.' },
    { speaker: 'student', text: 'I’m worried I cannot state the thesis clearly without drifting into background.' },
    { speaker: 'supervisor', text: 'Keep the background to one sentence, then say what the study argues.' },
    { speaker: 'student', text: 'So the panel should know my main claim within the first minute.' },
    { speaker: 'supervisor', text: 'Yes. A confused opening makes the panel dig for the argument themselves.' },
    { speaker: 'student', text: 'What about the data I quote? I have figures for house prices across the city.' },
    { speaker: 'supervisor', text: 'The panel mainly wants local rent figures, since the policy is about the neighbourhood.' },
    { speaker: 'student', text: 'National prices can be mentioned as context, but the comparison should be local.' },
    { speaker: 'supervisor', text: 'Correct. Show rent changes for nearby districts, and say where the numbers come from.' },
    { speaker: 'student', text: 'Should I include household size from the census to explain demand?' },
    { speaker: 'supervisor', text: 'That can support the local picture, but do not let it crowd out the rent evidence.' },
    { speaker: 'student', text: 'I’m also unsure how to answer a question I don’t know.' },
    { speaker: 'supervisor', text: 'Admit the limit politely, and offer to follow it up after the viva.' },
    { speaker: 'student', text: 'Would it be wrong to guess until I land on an answer?' },
    { speaker: 'supervisor', text: 'Guessing wastes the question slot, and the panel usually hears through it.' },
    { speaker: 'student', text: 'So I should change the subject rather than struggle?' },
    { speaker: 'supervisor', text: 'Certainly not. A short honest answer keeps your credibility, then you return to what you know.' },
    { speaker: 'student', text: 'Thanks. Now the timing side. How long should each answer run?' },
    { speaker: 'supervisor', text: 'Keep each answer under two minutes, so the panel can cover several questions.' },
    { speaker: 'student', text: 'Two minutes feels short when I want to explain the method.' },
    { speaker: 'supervisor', text: 'Put the method detail in the written thesis; the viva answer gives the headline first.' },
    { speaker: 'student', text: 'Should I read my notes aloud word for word during the rehearsal?' },
    { speaker: 'supervisor', text: 'Not at all. Reading aloud sounds rehearsed, and you lose the chance to respond.' },
    { speaker: 'student', text: 'I’ll keep bullet points on the card, not full sentences.' },
    { speaker: 'supervisor', text: 'Good. Pause briefly before replying to a hard question, so you don’t jump in too fast.' },
    { speaker: 'student', text: 'That stops me blurting out the first thing that comes to mind.' },
    { speaker: 'supervisor', text: 'Vary the pace between sections too; a steady flat voice makes a panel switch off.' },
    { speaker: 'student', text: 'I can slow down for the main claim and quicken over background detail.' },
    { speaker: 'supervisor', text: 'And make eye contact with the panel rather than staring at the screen.' },
    { speaker: 'student', text: 'The three panel members, I assume, not just my own notes.' },
    { speaker: 'supervisor', text: 'Yes. Split your glance across all three, especially when stating a finding.' },
    { speaker: 'student', text: 'Should I memorise every statistic before the viva?' },
    { speaker: 'supervisor', text: 'Certainly not. Memorise the few headline figures, and refer to the rest on the slide.' },
    { speaker: 'student', text: 'I’d rather trust the card than risk reciting a wrong number.' },
    { speaker: 'supervisor', text: 'That’s the right instinct. Accuracy matters more than fluency here.' },
    { speaker: 'student', text: 'Let me think about what the panel might ask next.' },
    { speaker: 'supervisor', text: 'They often probe the sample, so be ready to defend who was included.' },
    { speaker: 'student', text: 'My sample covers households that applied for housing aid over two years.' },
    { speaker: 'supervisor', text: 'Explain why that group suits the question, and acknowledge the limits of its size.' },
    { speaker: 'student', text: 'I can also note which questions the study cannot answer yet.' },
    { speaker: 'supervisor', text: 'That honesty reads better than overstating what the data show.' },
    { speaker: 'student', text: 'What about slides? How many should I plan to bring?' },
    { speaker: 'supervisor', text: 'Six or seven are enough. One chart for rent, one for the sample, and the rest are headings.' },
    { speaker: 'student', text: 'I’ll keep the text on each slide short, so the panel listens rather than reads.' },
    { speaker: 'supervisor', text: 'Good. Cite sources under each chart, and we’ll check them together.' },
    { speaker: 'student', text: 'When should we hold the full rehearsal?' },
    { speaker: 'supervisor', text: 'Next Thursday, after you have revised the opening and the data slide.' },
    { speaker: 'student', text: 'I’ll send the revised draft to you the evening before, so you can read it first.' },
    { speaker: 'supervisor', text: 'Fine. Bring any question you’re unsure about, and we’ll work through it.' },
    { speaker: 'student', text: 'Is there anything else I should prepare this week?' },
    { speaker: 'supervisor', text: 'Re-read your own abstract once, and note the three claims you most want to defend.' },
    { speaker: 'student', text: 'Three claims, then the local rent figures and a timing plan.' },
    { speaker: 'supervisor', text: 'That covers the main ground. I’ll see you on Thursday.' },
    { speaker: 'student', text: 'Thanks for your time.' },
  ],
  vocabulary: [
    {
      term: 'viva', phonetic: '/ˈviːvə/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '答辩，学位口头考核', en: 'an oral examination defending a thesis or dissertation' },
      usage: { zh: '可数；viva on housing policy、defend the viva。英式口语常说 the viva。', en: 'Countable: a viva on housing policy, defend the viva. In British speech it is often the viva.' },
      collocations: ['the housing policy viva', 'the viva questions', 'prepare for the viva'],
      example: { en: 'We meet today to prepare the housing policy viva.', zh: '我们今天为住房政策答辩做准备。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈviː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'thesis', phonetic: '/ˈθiːsɪs/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '学位论文，核心论点', en: 'the main written study defended in the viva' },
      usage: { zh: '可数；the core argument of the thesis、write a thesis。复数 theses。', en: 'Countable: the core argument of the thesis, write a thesis. The plural is theses.' },
      collocations: ['the core argument', 'the thesis draft', 'defend the thesis'],
      example: { en: 'The supervisor outlines the core argument of the thesis.', zh: '导师梳理论文的核心论点。' },
      listening: { zh: '两个音节，开头 /θ/ 咬舌；重音在第一音节。', en: 'Two syllables with opening /θ/; stress on the first.' },
    },
    {
      term: 'statistics', phonetic: '/stəˈtɪstɪks/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '统计数据', en: 'numbers gathered to support a claim' },
      usage: { zh: '复数；supporting statistics、run statistics。学科义 statistic 单数。', en: 'Plural: supporting statistics, run statistics. The subject statistic is singular.' },
      collocations: ['supporting statistics', 'gather statistics', 'the statistics show'],
      example: { en: 'The student gathers the statistics behind each claim.', zh: '学生收集支撑每个论点的数据。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtɪs/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'citations', phonetic: '/saɪˈteɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '引用，文献出处', en: 'references to sources used in the thesis' },
      usage: { zh: '复数；check the citations、citations under each chart。单数 citation。', en: 'Plural: check the citations, citations under each chart. Singular citation.' },
      collocations: ['check the citations', 'the citations together', 'add citations'],
      example: { en: 'The pair checks the citations once the draft is fixed.', zh: '草稿定稿后两人核对引用。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈteɪ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'rehearsal', phonetic: '/rɪˈhɜːsl/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '试讲，排练', en: 'a practice run of the viva before the real one' },
      usage: { zh: '可数；sit in on the rehearsal、full rehearsal。动词 rehearse。', en: 'Countable: sit in on the rehearsal, a full rehearsal. The verb is rehearse.' },
      collocations: ['the rehearsal', 'the full rehearsal', 'a practice rehearsal'],
      example: { en: 'The friend sits in on the rehearsal to time the answers.', zh: '朋友列席试讲为答案计时。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈhɜː/；结尾 /sl/。', en: 'Two syllables with stress on the second; ending /sl/.' },
    },
    {
      term: 'panel', phonetic: '/ˈpænl/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '答辩评委组', en: 'the examiners who sit and question the candidate' },
      usage: { zh: '可数；the panel、panel members。', en: 'Countable: the panel, panel members.' },
      collocations: ['the panel', 'the panel members', 'face the panel'],
      example: { en: 'A confused opening makes the panel dig for the argument.', zh: '开场含糊会让评委自己去找论点。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /nl/。', en: 'Two syllables with stress on the first; ending /nl/.' },
    },
    {
      term: 'credibility', phonetic: '/ˌkredəˈbɪləti/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '可信度，信誉', en: 'the panel’s trust that the candidate answers honestly' },
      usage: { zh: '不可数；keep your credibility、lose credibility。', en: 'Uncountable: keep your credibility, lose credibility.' },
      collocations: ['keep your credibility', 'credibility with the panel', 'lose credibility'],
      example: { en: 'An honest short answer keeps your credibility in the viva.', zh: '坦诚简短的回答保住答辩信誉。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈbɪl/。', en: 'Five syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'dividing who does what', sentenceIndex: 2,
      meaning: { zh: '分工，明确各自任务', en: 'to split the tasks between people before the work starts' },
      usage: { zh: 'divide who does what；后接 before the rehearsal。', en: 'Divide who does what, followed by before the rehearsal.' },
      example: { en: 'Let’s divide who does what before the rehearsal.', zh: '试讲前我们先把分工定下来。' },
    },
    {
      phrase: 'core argument', sentenceIndex: 4,
      meaning: { zh: '核心论点', en: 'the main claim the thesis builds on' },
      usage: { zh: 'outline the core argument；与 main claim 同义。', en: 'Outline the core argument; it is a near synonym of main claim.' },
      example: { en: 'Every answer should circle back to the core argument.', zh: '每个回答都应回到核心论点。' },
    },
    {
      phrase: 'follow it up', sentenceIndex: 26,
      meaning: { zh: '后续补做，事后再查', en: 'to deal with a question after the viva, rather than answer now' },
      usage: { zh: '可分短语动词；follow up a question、offer to follow it up。', en: 'Separable: follow up a question, offer to follow it up.' },
      example: { en: 'Admit the limit and offer to follow it up later.', zh: '坦诚说明并承诺事后补答。' },
    },
    {
      phrase: 'Reading aloud', sentenceIndex: 36,
      meaning: { zh: '照稿逐字朗读', en: 'reading the notes word for word instead of speaking freely' },
      usage: { zh: 'read something aloud；动名词作主语，答辩中被建议避免。', en: 'Read something aloud; the gerund is the subject, and the viva advice is to avoid it.' },
      example: { en: 'Reading aloud sounds rehearsed to the panel.', zh: '照稿念笔记在评委听来像背稿。' },
    },
    {
      phrase: 'eye contact', sentenceIndex: 42,
      meaning: { zh: '眼神交流', en: 'looking at the panel members while speaking' },
      usage: { zh: '不可数；make eye contact with the panel。', en: 'Uncountable: make eye contact with the panel.' },
      example: { en: 'Make eye contact with the panel rather than the screen.', zh: '与评委眼神交流，而不是盯屏幕。' },
    },
    {
      phrase: 'drifting into', sentenceIndex: 15,
      meaning: { zh: '滑入（背景细节，偏离论点）', en: 'to move away from the point into irrelevant background' },
      usage: { zh: 'drift into background、drift into detail；主语常是回答或思路。', en: 'Drift into background or detail; the subject is an answer or line of thought.' },
      example: { en: 'The opening must avoid drifting into background detail.', zh: '开场要避免滑入背景细节。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题按分工信号记角色', en: 'For matching, track who owns each task' },
      body: {
        zh: '第 21–24 题把任务和人配对。开场分工每句主语后紧跟动词短语：outline argument、gather statistics、time answers、check citations。听到角色就在题号旁记动词，再对上选项里的同义短语。',
        en: 'Items 21 to 24 pair tasks with people. The opening division puts a verb phrase after each subject: outline argument, gather statistics, time answers, check citations. Note the verb beside the role, then match it to the synonymous option.',
      },
    },
    {
      title: { zh: '数据题区分本地与全国', en: 'Separate local data from national figures' },
      body: {
        zh: '第 26 题问必须展示的数据，答案在 mainly wants local rent figures 之后。全国房价被说成 context，普查家庭规模被说成 secondary，听到 context、secondary 这类淡化词就把对应选项排除。',
        en: 'Item 26 asks the required data, answered after mainly wants local rent figures. National prices are called context and census household size secondary; on context and secondary, eliminate the matching option.',
      },
    },
    {
      title: { zh: '多选题区分建议与否定做法', en: 'For multi-select, split advice from rejected habits' },
      body: {
        zh: '第 28–30 题三项表达建议按 under two minutes、pause before replying、eye contact 依次出现。照稿宣读、背下每个数字、盯屏幕在后面被逐项否定；听到 No、rather than、the opposite 先划掉对应选项。',
        en: 'Items 28 to 30 list the three delivery tips with under two minutes, pause before replying and eye contact. Reading aloud, memorising every statistic and staring at the screen are later rejected. On No, rather than and the opposite, cross out the matching option first.',
      },
    },
  ],
};
