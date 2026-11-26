import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 24 · Part 3 — 植物生长实验设计（两人讨论，澳式 + 英式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：自变量/控制变量/记录方式/重复试验（配对 21–24）→ 测量频次、重复理由、
 * 因变量（单选 25–27）→ 需保持恒定的三项因素（多选 28–30）。
 */
export const test24Part3: ListeningLesson = {
  slug: 'test-24-part-3',
  part: 3,
  status: 'published',
  title: { zh: '植物生长实验设计', en: 'Designing an experiment on plant growth' },
  summary: {
    zh: '两名学生设计植物生长实验：明确自变量是光照安排、控制变量保持一致、每天早上在笔记本记录株高、重复试验验证结果；商定每日同一晨间测量、重复是为排除种子偶然因素、因变量是两周后的生长情况，并锁定土壤类型、浇水量和室温三项恒定因素。',
    en: 'Two students design a plant-growth experiment: light schedule is the independent variable, controls stay fixed, height is logged each morning, and trials are repeated. They agree on morning measurements, repeat guards against seed luck, growth is the dependent variable, and soil, water and temperature are held constant.',
  },
  accent: { zh: 'William 为澳式口音，Thomas 为英式口音，两人语速中等。', en: 'William speaks with an Australian accent and Thomas with a British accent, both at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'william', label: 'WILLIAM', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which description matches each experimental term? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'kept the same for every plant' },
        { key: 'B', text: 'changed between the two groups' },
        { key: 'C', text: 'written down each morning in a notebook' },
        { key: 'D', text: 'grown again to check the result' },
        { key: 'E', text: 'removed from the analysis after the first week' },
      ],
      items: [
        { number: 21, text: 'The independent variable' },
        { number: 22, text: 'The controlled variable' },
        { number: 23, text: 'The measurement record' },
        { number: 24, text: 'The repeated trials' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How often are the plants measured?',
          options: [
            { key: 'A', text: 'Every morning at the same time' },
            { key: 'B', text: 'Every evening after dusk' },
            { key: 'C', text: 'Once at the end of two weeks' },
          ],
        },
        {
          number: 26,
          stem: 'Why does the team run repeated trials?',
          options: [
            { key: 'A', text: 'To fill the available shelf space' },
            { key: 'B', text: 'To check the result is not just seed luck' },
            { key: 'C', text: 'To compare two different soil brands' },
          ],
        },
        {
          number: 27,
          stem: 'What is the dependent variable in this experiment?',
          options: [
            { key: 'A', text: 'The light schedule chosen for each group' },
            { key: 'B', text: 'The growth observed after two weeks' },
            { key: 'C', text: 'The temperature kept in the room' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE factors are held constant for both groups? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE factors are held constant for both groups?',
      options: [
        { key: 'A', text: 'soil type' },
        { key: 'B', text: 'water amount' },
        { key: 'C', text: 'room temperature' },
        { key: 'D', text: 'plant brand' },
        { key: 'E', text: 'sunlight hours' },
        { key: 'F', text: 'pot colour' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：The independent variable is the thing we deliberately adjust between groups。自变量是两组间刻意改变的因素，对应 B。句 4 的光照安排是它的具体内容。',
        en: 'Sentence 3: the independent variable is "the thing we deliberately adjust between groups", matching B. The light schedule in sentence 4 is its example.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：That fixed group is the controlled variable, kept the same for every plant。控制变量对每株植物保持一致，对应 A。',
        en: 'Sentence 6: the controlled variable is "kept the same for every plant", matching A.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：We write down the height each morning in a notebook, one row per plant。测量记录每天早上写进笔记本，对应 C。',
        en: 'Sentence 9: the height is "We write down the height each morning in a notebook", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 13,
      explanation: {
        zh: '定位句 13：repeated trials mean the plants are grown again to check the result holds。重复试验是再种一轮验证结果，对应 D。句 14 的带病盆是它要排除的情况。',
        en: 'Sentence 13: repeated trials mean the plants are "grown again to check the result", matching D. The diseased pot in sentence 14 is what they guard against.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：We measure them every morning, at the same time, before the lights change。每天早上同一时间测量，对应 A。傍晚测量被句 19 排除。',
        en: 'Sentence 18: the plants are measured "every morning, at the same time", matching A. Evening measurement is ruled out in sentence 19.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Repeats show whether the result is real, or just luck with one batch of seeds。重复是为验证结果不是种子批次的偶然，对应 B。占满货架、比较土壤品牌未提及。',
        en: 'Sentence 22: repeats show whether the result "is real, or just luck with one batch of seeds", matching B. Filling shelves and comparing soil brands are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：It is the outcome we observe, the growth itself, rather than the schedule we chose。因变量是观察到的生长结果，对应 B。光照安排是自变量，室温是控制变量。',
        en: 'Sentence 26: the dependent variable is "the growth itself", matching B. The light schedule is the independent variable; room temperature is controlled.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：First, the soil type. The same bag of potting mix for every tray。土壤类型恒定，对应 A。',
        en: 'Sentence 29: the first constant is "the soil type", the same mix for every tray, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：Second, the water amount. A measured cup each day, not poured by eye。浇水量恒定，对应 B。',
        en: 'Sentence 30: the second constant is "the water amount", a measured cup daily, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：Third, the room temperature, kept away from the drafty window。室温恒定，对应 C。种子品牌是供应细节，光照时长是自变量，花盆颜色无关。',
        en: 'Sentence 31: the third constant is "the room temperature", matching C. Seed brand is a supply detail, sunlight hours are the changed variable, and pot colour is irrelevant.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'Last semester two groups grew seedlings under different lights, but the results were hard to trust.' },
    { speaker: 'william', text: 'So for our own experiment on plant growth, we need to tighten the design before we start.' },
    { speaker: 'thomas', text: 'Right. The first thing to fix is which variable we actually change.' },
    { speaker: 'william', text: 'The independent variable is the thing we deliberately adjust between groups.' },
    { speaker: 'thomas', text: 'In our case it will be the light schedule, one group by day and one at night.' },
    { speaker: 'william', text: 'Everything else should stay fixed, or the differences won’t mean much.' },
    { speaker: 'thomas', text: 'That fixed group is the controlled variable, kept the same for every plant.' },
    { speaker: 'william', text: 'Soil, water and temperature all belong in that fixed list.' },
    { speaker: 'thomas', text: 'How do we record what happens to the seedlings each day?' },
    { speaker: 'william', text: 'We write down the height each morning in a notebook, one row per plant.' },
    { speaker: 'thomas', text: 'Should we take photos as well as the notes?' },
    { speaker: 'william', text: 'A weekly photo is useful, but the height numbers are the main record.' },
    { speaker: 'thomas', text: 'Do we run the whole setup more than once?' },
    { speaker: 'william', text: 'Yes, repeated trials mean the plants are grown again to check the result holds.' },
    { speaker: 'thomas', text: 'That guards against one pot failing for an unrelated reason.' },
    { speaker: 'william', text: 'We should also name the variable we expect to change as a result.' },
    { speaker: 'thomas', text: 'The dependent variable is the height and leaf number we measure after two weeks.' },
    { speaker: 'william', text: 'Before that, let’s agree how often each plant is measured.' },
    { speaker: 'thomas', text: 'We measure them every morning, at the same time, before the lights change.' },
    { speaker: 'william', text: 'Not evening, then? A tired reading at dusk would skew the average.' },
    { speaker: 'thomas', text: 'Correct. Morning light and morning measurements keep the conditions steady.' },
    { speaker: 'william', text: 'Why bother repeating the whole trial if the first round looks clear?' },
    { speaker: 'thomas', text: 'Repeats show whether the result is real, or just luck with one batch of seeds.' },
    { speaker: 'william', text: 'A single trial could have a diseased pot or a dry corner nobody noticed.' },
    { speaker: 'thomas', text: 'The repeat lets us spot that kind of accident before we write the conclusion.' },
    { speaker: 'william', text: 'What exactly counts as the dependent variable in our write-up?' },
    { speaker: 'thomas', text: 'It is the outcome we observe, the growth itself, rather than the schedule we chose.' },
    { speaker: 'william', text: 'So light is independent, growth is dependent, and the rest are controlled.' },
    { speaker: 'thomas', text: 'Let’s list the factors we hold constant for both groups.' },
    { speaker: 'william', text: 'First, the soil type. The same bag of potting mix for every tray.' },
    { speaker: 'thomas', text: 'Second, the water amount. A measured cup each day, not poured by eye.' },
    { speaker: 'william', text: 'Third, the room temperature, kept away from the drafty window.' },
    { speaker: 'thomas', text: 'What about the plant brand we bought the seeds from?' },
    { speaker: 'william', text: 'The brand is fixed too, but it is a supply detail, not a control we discuss in the report.' },
    { speaker: 'thomas', text: 'And the sunlight hours? That is our changed variable, so it can’t be held constant.' },
    { speaker: 'william', text: 'Right. Pot colour is irrelevant, as long as the trays sit side by side.' },
    { speaker: 'thomas', text: 'How many seeds go into each tray?' },
    { speaker: 'william', text: 'Ten seeds per tray, five trays per group, to give enough readings.' },
    { speaker: 'thomas', text: 'We label each tray with its group and its position on the shelf.' },
    { speaker: 'william', text: 'The notebook page also records the date the seeds were first sown.' },
    { speaker: 'thomas', text: 'If a seed fails to sprout, do we remove it from the analysis?' },
    { speaker: 'william', text: 'We mark it missing rather than drop it quietly, so the sample size stays honest.' },
    { speaker: 'thomas', text: 'The instructor wants the raw readings before any graph is drawn.' },
    { speaker: 'william', text: 'We’ll scan the notebook pages and keep the original in the lab folder.' },
    { speaker: 'thomas', text: 'What if a measurement falls far outside the others?' },
    { speaker: 'william', text: 'We note the reason, such as a knocked tray, before deciding whether to keep it.' },
    { speaker: 'thomas', text: 'No deleting numbers just because they disagree with the hypothesis.' },
    { speaker: 'william', text: 'Agreed. The conclusion follows the data, not the other way round.' },
    { speaker: 'thomas', text: 'Shall we split the setup tasks between us?' },
    { speaker: 'william', text: 'You can prepare the soil and the trays, and I will manage the lights and timing.' },
    { speaker: 'thomas', text: 'I’ll water each tray after the morning measurement, so the readings stay dry.' },
    { speaker: 'william', text: 'Keep the watering log next to the height log in the same notebook.' },
    { speaker: 'thomas', text: 'The lab coat and gloves are stored by the back door.' },
    { speaker: 'william', text: 'Wash hands after handling the potting mix, in case of dust allergy.' },
    { speaker: 'thomas', text: 'We need to book the shelf space before the seeds arrive on Wednesday.' },
    { speaker: 'william', text: 'I’ll send the request to the lab coordinator this afternoon.' },
    { speaker: 'thomas', text: 'The report deadline is two weeks after the final measurement.' },
    { speaker: 'william', text: 'That leaves one week to draw graphs and check the repeats match.' },
    { speaker: 'thomas', text: 'We should write the method section as we go, not at the end.' },
    { speaker: 'william', text: 'Good. Each evening we update one paragraph in the shared document.' },
    { speaker: 'thomas', text: 'Did the last experiment measure root length as well?' },
    { speaker: 'william', text: 'Roots are hard to harvest without disturbing the plant, so we leave them out.' },
    { speaker: 'thomas', text: 'Leaf count is easier to record without moving the tray.' },
    { speaker: 'william', text: 'We count fully open leaves only, not the small folded ones.' },
    { speaker: 'thomas', text: 'The hypothesis should state the expected direction before the first reading.' },
    { speaker: 'william', text: 'We expect the daylight group to grow taller than the night group.' },
    { speaker: 'thomas', text: 'If the result disagrees, we still report the numbers as they stand.' },
    { speaker: 'william', text: 'That is how a fair experiment stays trustworthy.' },
  ],
  vocabulary: [
    {
      term: 'variable', phonetic: '/ˈveəriəbl/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '变量', en: 'a factor that can change between experimental groups' },
      usage: { zh: '可数；the independent variable、the controlled variable。', en: 'Countable: independent, controlled or dependent variable.' },
      collocations: ['the independent variable', 'the controlled variable', 'the dependent variable'],
      example: { en: 'The light schedule is our independent variable.', zh: '光照安排是我们的自变量。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈveə/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'seedlings', phonetic: '/ˈsiːdlɪŋz/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '幼苗，秧苗', en: 'a young plant just grown from a seed' },
      usage: { zh: '可数；grow seedlings、the seedlings sprout。', en: 'Countable: grow seedlings, the seedlings sprout.' },
      collocations: ['grow seedlings', 'young seedlings', 'the seedlings emerge'],
      example: { en: 'Last semester two groups grew seedlings under different lights.', zh: '上学期两组在不同光照下育苗。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsiːd/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'notebook', phonetic: '/ˈnəʊtbʊk/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '记录本，笔记本', en: 'the bound book where daily readings are written' },
      usage: { zh: '可数；in a notebook、the lab notebook。', en: 'Countable: in a notebook, the lab notebook.' },
      collocations: ['the lab notebook', 'write in the notebook', 'a notebook page'],
      example: { en: 'The height goes in the notebook each morning.', zh: '株高每天早上记入笔记本。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈnəʊt/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', partOfSpeech: 'n.', sentenceIndex: 46,
      meaning: { zh: '假设，假说', en: 'the expected statement tested before data arrive' },
      usage: { zh: '可数，复数 hypotheses；state the hypothesis、test the hypothesis。', en: 'Countable, plural hypotheses; state the hypothesis.' },
      collocations: ['state the hypothesis', 'test the hypothesis', 'the research hypothesis'],
      example: { en: 'The hypothesis states which group should grow taller.', zh: '假设写明哪组长得更高。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈpɒθ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'constant', phonetic: '/ˈkɒnstənt/', partOfSpeech: 'adj.', sentenceIndex: 28,
      meaning: { zh: '恒定的，保持不变的', en: 'kept the same across every group' },
      usage: { zh: '形容词；keep a factor constant、constant temperature。名词指常数。', en: 'Adjective: keep a factor constant; the noun means a fixed value.' },
      collocations: ['keep it constant', 'a constant factor', 'constant conditions'],
      example: { en: 'Soil and water are kept constant for both groups.', zh: '两组的土壤和水量保持恒定。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkɒn/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'sprout', phonetic: '/spraʊt/', partOfSpeech: 'v.', sentenceIndex: 40,
      meaning: { zh: '发芽，抽芽', en: 'to grow the first shoot from a seed' },
      usage: { zh: '动词；the seed sprouts、fail to sprout。名词指嫩芽。', en: 'Verb: the seed sprouts; the noun means a shoot.' },
      collocations: ['fail to sprout', 'sprout in the soil', 'a sprouting seed'],
      example: { en: 'A seed that fails to sprout is marked missing.', zh: '没发芽的种子记为缺失。' },
      listening: { zh: '单音节，与 out 押韵。', en: 'One syllable, rhyming with out.' },
    },
    {
      term: 'raw', phonetic: '/rɔː/', partOfSpeech: 'adj.', sentenceIndex: 42,
      meaning: { zh: '原始的，未经处理的（数据）', en: 'unprocessed readings before graphs or summaries' },
      usage: { zh: '形容词；raw readings、raw data。', en: 'Adjective: raw readings, raw data.' },
      collocations: ['the raw readings', 'the raw data', 'raw numbers'],
      example: { en: 'Submit the raw readings before drawing graphs.', zh: '画图前先交原始读数。' },
      listening: { zh: '单音节，与 law 押韵。', en: 'One syllable, rhyming with law.' },
    },
  ],
  expressions: [
    {
      phrase: 'tighten the design', sentenceIndex: 1,
      meaning: { zh: '把实验设计收紧，补全控制', en: 'to make the experimental plan more rigorous' },
      usage: { zh: '动宾短语；tighten the design、tighten the controls。', en: 'Tighten the design means close gaps in the method.' },
      example: { en: 'We tighten the design before the first seed goes in.', zh: '下种前先把设计补严谨。' },
    },
    {
      phrase: 'hold constant', sentenceIndex: 28,
      meaning: { zh: '保持恒定', en: 'to keep a factor unchanged across groups' },
      usage: { zh: '固定搭配；hold the temperature constant、keep constant。', en: 'Hold constant; compare keep the same.' },
      example: { en: 'We hold the soil type constant for both groups.', zh: '两组土壤类型保持一致。' },
    },
    {
      phrase: 'by eye', sentenceIndex: 30,
      meaning: { zh: '凭目测，不靠量具', en: 'judging amount without measuring' },
      usage: { zh: '固定短语；pour by eye、estimate by eye，与 measured 相对。', en: 'Pour by eye means without a measuring cup.' },
      example: { en: 'Use a measured cup, not water poured by eye.', zh: '用量杯，别凭感觉倒水。' },
    },
    {
      phrase: 'as we go', sentenceIndex: 58,
      meaning: { zh: '边做边（记录）', en: 'updating notes during the work, not afterwards' },
      usage: { zh: '固定短语；write the method as we go、record as we go。', en: 'As we go means during the process, not at the end.' },
      example: { en: 'Write the method section as we go.', zh: '方法部分边做边写。' },
    },
    {
      phrase: 'at the same time', sentenceIndex: 18,
      meaning: { zh: '在同一时间，固定时点', en: 'at one fixed hour each day, without variation' },
      usage: { zh: '固定短语；measure at the same time、arrive at the same time。', en: 'At the same time means the same fixed hour; compare every morning.' },
      example: { en: 'We measure them every morning at the same time.', zh: '我们每天早上同一时间测量。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按变量角色归类', en: 'Match term to its role' },
      body: {
        zh: '配对四题先认术语：自变量是两组间改变的，控制变量是保持一致的，记录是每天早上写进笔记本的，重复试验是再种一轮验证。删去第一周就剔除数据这种干扰描述。',
        en: 'Read the term first: independent changes between groups, controlled stays the same, record goes in the notebook each morning, repeat means grown again. Drop the first-week removal distractor.',
      },
    },
    {
      title: { zh: '测量时间避开时段干扰', en: 'Watch the measurement-time distractor' },
      body: {
        zh: '测量频次是每天早上同一时间；傍晚读数会被光线影响，期末只测一次也排除。听到 morning、same time、before the lights change 就锁定 A。',
        en: 'The frequency is every morning at the same time; dusk readings bias the average, and a single end-point measure is excluded. Lock A at morning, same time and before the lights change.',
      },
    },
    {
      title: { zh: '多选区分恒定因素与自变量', en: 'Separate controls from the changed variable' },
      body: {
        zh: '三项恒定是土壤类型、浇水量、室温。光照时长是自变量不能恒定；种子品牌只是供应细节；花盆颜色无关。多选先划去 changed variable 和无关项。',
        en: 'The three constants are soil type, water amount and room temperature. Sunlight hours are the changed variable; seed brand is a supply detail; pot colour is irrelevant. Remove the changed variable and irrelevant items first.',
      },
    },
  ],
};
