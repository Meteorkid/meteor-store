import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 7 · Part 4 — 讲座：睡眠周期与学习。原创仿真材料，非官方真题。
 *
 * 结构：开场用反问与数字给出总体观点（单选 31–34）→ 睡眠阶段与周期（笔记填空 35）→
 * 深睡的记忆转移（36）→ REM 的情绪加工（37）→ 光照与褪黑素（38）→ 饮食与午睡建议（39–40）。
 * 单选块在前，填空块在后，题块顺序与讲座顺序一致。
 */
export const test07Part4: ListeningLesson = {
  slug: 'test-07-part-4',
  part: 4,
  status: 'published',
  title: { zh: '睡眠周期与学习', en: 'Sleep cycles and learning' },
  summary: {
    zh: '一场关于睡眠与记忆的讲座：睡眠不是思维的暂停，大脑在睡梦中整理并储存白天所学；讲解九十分钟一轮的睡眠周期、深睡时记忆从海马体到皮层的转移、REM 阶段的情绪加工，以及光照、晚餐与午睡的作息建议。',
    en: 'A lecture on sleep and memory: sleep is not a pause in thinking, and the brain sorts and stores what it learned during the day. It covers the ninety-minute sleep cycles, the transfer of memories from the hippocampus to the cortex in deep sleep, emotional processing in REM, and advice on light, meals and naps.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，关键术语会重复一遍。', en: 'The lecturer speaks with an American accent at a steady pace, repeating the key terms.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What is the lecturer’s main point about sleep?',
          options: [
            { key: 'A', text: 'Sleep allows the brain to sort and store what was learned during the day.' },
            { key: 'B', text: 'Sleep mainly restores the body rather than the mind.' },
            { key: 'C', text: 'Longer sleep always produces better academic results.' },
          ],
        },
        {
          number: 32,
          stem: 'Why is deep, slow-wave sleep important for memories?',
          options: [
            { key: 'A', text: 'It removes irrelevant details from the brain.' },
            { key: 'B', text: 'It moves recent memories into long-term storage.' },
            { key: 'C', text: 'It keeps the brain awake to review notes.' },
          ],
        },
        {
          number: 33,
          stem: 'What happens during REM sleep?',
          options: [
            { key: 'A', text: 'The body moves freely while the brain stays inactive.' },
            { key: 'B', text: 'Emotional memories are processed and connected.' },
            { key: 'C', text: 'Learned tasks are forgotten to free up space.' },
          ],
        },
        {
          number: 34,
          stem: 'What does the lecturer recommend about evening light?',
          options: [
            { key: 'A', text: 'Keep the room as dim as possible after dinner.' },
            { key: 'B', text: 'Use bright screens to extend study time.' },
            { key: 'C', text: 'Avoid daylight in the morning.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'A complete sleep cycle lasts about', cells: [[{ blank: 35 }, { text: ' minutes.' }]] },
        { lead: 'During deep sleep, memories move from the hippocampus to the', cells: [[{ blank: 36 }, { text: '.' }]] },
        { lead: 'During REM, the brain works through emotional', cells: [[{ blank: 37 }, { text: '.' }]] },
        { lead: 'Screen light suppresses the production of', cells: [[{ blank: 38 }, { text: '.' }]] },
        { lead: 'Before bed, students should avoid a heavy', cells: [[{ blank: 39 }, { text: '.' }]] },
        { lead: 'A short afternoon nap can improve', cells: [[{ blank: 40 }, { text: ' and creativity.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：the brain sorts through what you learned during the day, keeps what matters, and files it away。睡眠中大脑整理并储存白天所学，对应 A。B 与句 1 的 not a pause in thinking 相反，C 的 always 在讲座中没有依据。',
        en: 'Sentence 2: "the brain sorts through what you learned during the day, keeps what matters, and files it away". The brain sorts and stores daytime learning, matching A. B contradicts not a pause in thinking in sentence 1, and always is never claimed.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：The deepest sleep transfers recent memories into long-term storage。深睡把近期记忆转入长期存储，对应 B。A 的清除无关细节和 C 的保持清醒复习在讲座中均未出现。',
        en: 'Sentence 4: "The deepest sleep transfers recent memories into long-term storage". Deep sleep moves recent memories into long-term storage, matching B. Clearing irrelevant details and staying awake to review are never mentioned.',
      },
    },
    {
      number: 33, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：The dreaming stage … works through emotional memories and links them to earlier experience。REM 加工情绪记忆并与旧经验联结，对应 B。A 与句 26 的身体基本不动相反，C 的遗忘任务在录音中没有依据。',
        en: 'Sentence 5: "The dreaming stage … works through emotional memories and links them to earlier experience". REM processes emotional memories and connects them, matching B. A contradicts the still body in sentence 26, and forgetting learned tasks is not claimed.',
      },
    },
    {
      number: 34, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：the room should be kept dim after dinner。晚餐后保持房间昏暗，对应 A。B 与句 33 把屏幕收走的建议相反，C 的早晨避光在讲座中没有提到。',
        en: 'Sentence 6: "the room should be kept dim after dinner", matching A. B contradicts putting screens away in sentence 33, and avoiding morning daylight is never mentioned.',
      },
    },
    {
      number: 35, accepted: ['ninety', '90'], evidence: 8,
      explanation: {
        zh: '定位句 8：cycles of about ninety minutes。空格后已印 minutes，只填数字。句 43 复述同一周期长度，可作为复核。',
        en: 'Sentence 8: "cycles of about ninety minutes". Minutes is already printed, so write the number only. Sentence 43 restates the same cycle length as a check.',
      },
    },
    {
      number: 36, accepted: ['cortex'], evidence: 18,
      explanation: {
        zh: '定位句 18：transferred into the cortex, which is where long-term storage lives。记忆从海马体转出后进入皮层，填 cortex；hippocampus 是起点，不是目的地。',
        en: 'Sentence 18: "transferred into the cortex, which is where long-term storage lives". Memories leave the hippocampus for the cortex; the hippocampus is the starting point, not the destination.',
      },
    },
    {
      number: 37, accepted: ['memories'], evidence: 24,
      explanation: {
        zh: '定位句 24：the brain works through emotional memories。REM 处理的对象是情绪记忆，空前是 emotional，填复数 memories。',
        en: 'Sentence 24: "the brain works through emotional memories". REM processes emotional memories; emotional already precedes the gap, so write the plural memories.',
      },
    },
    {
      number: 38, accepted: ['melatonin'], evidence: 32,
      explanation: {
        zh: '定位句 32：That hormone is melatonin, and when it is suppressed the sleep onset is delayed。被屏幕光照抑制的激素是褪黑素；hormone 是类别提示，不要填 hormone。',
        en: 'Sentence 32: "That hormone is melatonin, and when it is suppressed the sleep onset is delayed". The hormone suppressed by screen light is melatonin; hormone is the category clue, not the answer.',
      },
    },
    {
      number: 39, accepted: ['meal'], evidence: 36,
      explanation: {
        zh: '定位句 36：A heavy meal shortly before bed keeps digestion working。睡前应避免的是丰盛正餐，填 meal；句 37 的 light snack 是被允许的替代项，不能填。',
        en: 'Sentence 36: "A heavy meal shortly before bed keeps digestion working". What to avoid before bed is a heavy meal. The light snack in sentence 37 is the allowed alternative, so it is not the answer.',
      },
    },
    {
      number: 40, accepted: ['focus'], evidence: 39,
      explanation: {
        zh: '定位句 39：A short nap … can improve focus and creativity。午睡改善的是专注与创造力；空后已印 and creativity，填 focus。',
        en: 'Sentence 39: "A short nap … can improve focus and creativity". The nap improves focus and creativity; and creativity is already printed, so write focus.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How much of your life do you spend asleep? Roughly a third, by most estimates, and yet most of us treat those hours as dead time.' },
    { speaker: 'lecturer', text: 'Today I want to challenge that view, because sleep is not a pause in thinking.' },
    { speaker: 'lecturer', text: 'When you sleep, the brain sorts through what you learned during the day, keeps what matters, and files it away for later use.' },
    { speaker: 'lecturer', text: 'In this lecture I will describe the main sleep stages, explain how memories are consolidated, and finish with practical advice on light and routine.' },
    { speaker: 'lecturer', text: 'Before we look at the details, the broad picture is this. The deepest sleep transfers recent memories into long-term storage, so they survive into the following week.' },
    { speaker: 'lecturer', text: 'The dreaming stage, meanwhile, works through emotional memories and links them to earlier experience.' },
    { speaker: 'lecturer', text: 'On the advice side, evening bright light pushes sleep later, so the room should be kept dim after dinner.' },
    { speaker: 'lecturer', text: 'To begin with the stages themselves, sleep does not happen in one flat period.' },
    { speaker: 'lecturer', text: 'Instead it repeats in cycles of about ninety minutes, and each cycle contains several distinct stages.' },
    { speaker: 'lecturer', text: 'You will complete four or five of these cycles in a typical night.' },
    { speaker: 'lecturer', text: 'As the night goes on, the cycles change shape, with the earlier cycles dominated by deep sleep and the later ones by dreaming.' },
    { speaker: 'lecturer', text: 'The lightest stage is the transition into sleep, when thoughts begin to drift and sounds still reach you.' },
    { speaker: 'lecturer', text: 'It lasts only a few minutes, and it is easy to wake someone in this stage.' },
    { speaker: 'lecturer', text: 'After that comes a steadier light sleep, where breathing and heart rate settle into a regular rhythm.' },
    { speaker: 'lecturer', text: 'In this stage you may hear a door close or a voice call your name, and you are back awake in seconds.' },
    { speaker: 'lecturer', text: 'Most of the night is spent in this stage, but it is not where the key memory work happens.' },
    { speaker: 'lecturer', text: 'The stage that matters most for facts and skills is the deep, slow-wave sleep that follows.' },
    { speaker: 'lecturer', text: 'In this stage the brain produces slow, large waves, and blood flow shifts toward memory systems.' },
    { speaker: 'lecturer', text: 'Recent memories are moved out of the hippocampus and transferred into the cortex, which is where long-term storage lives.' },
    { speaker: 'lecturer', text: 'The hippocampus can hold only a limited amount at once, so this transfer is what frees it up for the next day.' },
    { speaker: 'lecturer', text: 'Without enough deep sleep, material studied the previous evening tends to fade rather than stick.' },
    { speaker: 'lecturer', text: 'Studies have shown that students sleeping under six hours recall far less of a passage read the evening before.' },
    { speaker: 'lecturer', text: 'The effect shows up most clearly on memory tests given the next morning.' },
    { speaker: 'lecturer', text: 'The other distinctive stage is rapid eye movement sleep, or REM, named for the fast eye movements behind closed lids.' },
    { speaker: 'lecturer', text: 'During REM the brain works through emotional memories, linking them to earlier experience rather than storing them as separate files.' },
    { speaker: 'lecturer', text: 'This is why dreams often mix old events with what happened the same day.' },
    { speaker: 'lecturer', text: 'The body is largely still in REM, even though the brain itself is highly active.' },
    { speaker: 'lecturer', text: 'Body temperature also drops through the night, and it reaches its lowest point in the early hours before waking.' },
    { speaker: 'lecturer', text: 'Researchers tell one stage from another with a simple recording of brain waves, measured through sensors on the scalp.' },
    { speaker: 'lecturer', text: 'Each stage has its own wave pattern, and the recordings are stored for later comparison.' },
    { speaker: 'lecturer', text: 'Now let us turn to light, which is the strongest signal the brain uses to judge whether it is day or night.' },
    { speaker: 'lecturer', text: 'In the evening, blue light from phones, tablets and computer screens slows the release of the hormone that prepares the body for sleep.' },
    { speaker: 'lecturer', text: 'That hormone is melatonin, and when it is suppressed the sleep onset is delayed and the deep sleep grows lighter.' },
    { speaker: 'lecturer', text: 'The recommendation, then, is to keep the room dim after dinner, and to put screens away well before bedtime.' },
    { speaker: 'lecturer', text: 'This does not mean studying at night is useless, but the last hour should be review rather than new material.' },
    { speaker: 'lecturer', text: 'A second piece of advice concerns meals.' },
    { speaker: 'lecturer', text: 'A heavy meal shortly before bed keeps digestion working and raises the body’s temperature, both of which disturb deep sleep.' },
    { speaker: 'lecturer', text: 'A light snack is fine, but large dinners should be finished at least two or three hours before lying down.' },
    { speaker: 'lecturer', text: 'The third recommendation is the afternoon nap.' },
    { speaker: 'lecturer', text: 'A short nap, of twenty minutes or so, can improve focus and creativity without pushing the main night sleep out of balance.' },
    { speaker: 'lecturer', text: 'Longer naps, beyond half an hour, often leave people groggy and make the evening sleep harder to start.' },
    { speaker: 'lecturer', text: 'The best time for a nap is the early afternoon, before three o’clock, so that it does not cut into the night sleep.' },
    { speaker: 'lecturer', text: 'Let me bring these points together before we finish.' },
    { speaker: 'lecturer', text: 'Each full cycle lasts about ninety minutes, so a sensible night aims for five or six complete cycles rather than an arbitrary number of hours.' },
    { speaker: 'lecturer', text: 'Deep sleep does the file transfer from the hippocampus to the cortex.' },
    { speaker: 'lecturer', text: 'REM integrates the emotional side of what you experienced during the day.' },
    { speaker: 'lecturer', text: 'Evening light works against this system, because it delays melatonin and weakens the deep stages.' },
    { speaker: 'lecturer', text: 'None of these rules matters on its own; the problem comes when study, screens and late meals stack up together night after night.' },
    { speaker: 'lecturer', text: 'In the next lecture we will look at how caffeine changes this timetable, and why a late coffee hits the first cycles more than the last ones.' },
    { speaker: 'lecturer', text: 'For now, the main message is simple. Sleep is study time for the brain, not a gap between study sessions.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'consolidated', phonetic: '/kənˈsɒlɪdeɪtɪd/', partOfSpeech: 'v.', sentenceIndex: 3,
      meaning: { zh: '巩固，整合（记忆被稳定存入长期存储）', en: 'stored and strengthened so that knowledge lasts' },
      usage: { zh: '研究语境里 consolidate memories 指巩固记忆；名词是 consolidation。', en: 'In research, consolidate memories means to fix them in storage; the noun is consolidation.' },
      collocations: ['consolidate memories', 'memory consolidation', 'consolidate learning'],
      example: { en: 'Sleep helps consolidate the facts learnt earlier in the day.', zh: '睡眠有助于巩固白天学到的知识。' },
      listening: { zh: '重音在第二音节 /ˈsɒl/；结尾 -ed 读 /ɪd/。', en: 'Stress the second syllable; the ending -ed is /ɪd/.' },
    },
    {
      term: 'cycle', phonetic: '/ˈsaɪkl/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '循环，周期', en: 'a repeating sequence of stages that returns to its start' },
      usage: { zh: '可数名词；a sleep cycle、the cycle repeats。', en: 'Countable: a sleep cycle, the cycle repeats.' },
      collocations: ['a sleep cycle', 'the sleep cycles', 'a full cycle'],
      example: { en: 'Each sleep cycle lasts about ninety minutes.', zh: '每个睡眠周期约九十分钟。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /kl/ 不要漏听。', en: 'Two syllables with first-syllable stress; do not drop the final /kl/.' },
    },
    {
      term: 'hippocampus', phonetic: '/ˌhɪpəˈkæmpəs/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '海马体（大脑中负责短期记忆的结构）', en: 'the brain region that holds recent memories before they are stored' },
      usage: { zh: '解剖学术语，复数 hippocampi；记忆类讲座高频词。', en: 'Anatomical term, plural hippocampi; common in talks about memory.' },
      collocations: ['the hippocampus', 'the hippocampus and cortex', 'damage to the hippocampus'],
      example: { en: 'The hippocampus stores new memories until they move to the cortex.', zh: '海马体暂存新记忆，直到转入皮层。' },
      listening: { zh: '五个音节，重音在第三个 /ˈkæm/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'cortex', phonetic: '/ˈkɔːteks/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '大脑皮层', en: 'the outer layer of the brain where long-term memories are held' },
      usage: { zh: '可数或不可数；the cerebral cortex 是全称，讲座里常简称 cortex。', en: 'The full form is the cerebral cortex, often shortened to cortex.' },
      collocations: ['the cortex', 'move memories to the cortex', 'the cerebral cortex'],
      example: { en: 'Stored memories remain in the cortex for years.', zh: '储存下来的记忆会在皮层保留多年。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /teks/ 读清楚。', en: 'Two syllables with first-syllable stress; listen for the final /teks/.' },
    },
    {
      term: 'melatonin', phonetic: '/ˌmeləˈtəʊnɪn/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '褪黑素（调控睡眠节律的激素）', en: 'the hormone that signals night and prepares the body for sleep' },
      usage: { zh: '不可数名词；produce melatonin、suppress melatonin。', en: 'Uncountable: produce melatonin, suppress melatonin.' },
      collocations: ['release melatonin', 'suppress melatonin', 'melatonin levels'],
      example: { en: 'Screen light delays the release of melatonin in the evening.', zh: '屏幕光照会推迟晚间褪黑素的分泌。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈtəʊ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'suppressed', phonetic: '/səˈprest/', partOfSpeech: 'v.', sentenceIndex: 32,
      meaning: { zh: '抑制，压制（分泌或反应）', en: 'held back so that something cannot develop or be released' },
      usage: { zh: 'suppress a hormone、suppress a reaction；名词是 suppression。', en: 'Suppress a hormone or a reaction; the noun is suppression.' },
      collocations: ['suppress melatonin', 'suppress the release', 'suppress symptoms'],
      example: { en: 'Bright light suppresses the body’s sleep signal.', zh: '强光会抑制身体的睡眠信号。' },
      listening: { zh: '重音在第二音节 /ˈprest/，结尾 /st/ 两个辅音。', en: 'Stress the second syllable; listen for the final /st/ cluster.' },
    },
    {
      term: 'scalp', phonetic: '/skælp/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '头皮', en: 'the skin covering the head' },
      usage: { zh: '可数名词；sensors on the scalp 指贴在头皮上的脑电传感器。', en: 'Countable: sensors on the scalp.' },
      collocations: ['on the scalp', 'the scalp and forehead', 'scalp sensors'],
      example: { en: 'Sensors are fixed to the scalp to record brain waves.', zh: '传感器贴在头皮上记录脑电波。' },
      listening: { zh: '单音节，/sk/ 连在一起，元音是 /æ/。', en: 'One syllable with the cluster /sk/ and the vowel /æ/.' },
    },
    {
      term: 'groggy', phonetic: '/ˈɡrɒɡi/', partOfSpeech: 'adj.', sentenceIndex: 40,
      meaning: { zh: '昏沉的，反应迟钝的', en: 'tired and slow to think or move after sleeping badly' },
      usage: { zh: '形容睡醒后的状态；feel groggy、wake up groggy。', en: 'Describes a post-sleep state: feel groggy, wake up groggy.' },
      collocations: ['feel groggy', 'wake up groggy', 'groggy and tired'],
      example: { en: 'A long daytime nap often leaves you groggy for an hour.', zh: '白天睡太久常会让人昏沉一个小时。' },
      listening: { zh: '两个音节，重音在第一个；双写 g 不要漏。', en: 'Two syllables with first-syllable stress; note the double g.' },
    },
  ],
  expressions: [
    {
      phrase: 'sorts through', sentenceIndex: 2,
      meaning: { zh: '整理，逐一梳理', en: 'to examine a collection and keep what matters' },
      usage: { zh: 'sort through documents、sort through memories；强调翻拣筛选。', en: 'Sort through documents or memories, going through and selecting.' },
      example: { en: 'The brain sorts through the day’s events while you sleep.', zh: '大脑在你睡觉时梳理白天发生的事情。' },
    },
    {
      phrase: 'files it away', sentenceIndex: 2,
      meaning: { zh: '归档，存入记忆', en: 'to store something for later use' },
      usage: { zh: 'file away 的宾语可以是事实、记忆；口语里也指把文件存档。', en: 'File away facts or memories; literally it means to archive documents.' },
      example: { en: 'The brain files away the details that matter most.', zh: '大脑把最重要的细节归档保存。' },
    },
    {
      phrase: 'fade rather than stick', sentenceIndex: 20,
      meaning: { zh: '逐渐淡忘，而不是记住', en: 'to be forgotten instead of being retained' },
      usage: { zh: 'stick 在此表示“记住、留得住”；fade 指记忆消退。', en: 'Here stick means retained; fade means the memory wears off.' },
      example: { en: 'Without review, new vocabulary fades rather than sticks.', zh: '不复习的话，新词汇会逐渐淡忘而留不住。' },
    },
    {
      phrase: 'works against', sentenceIndex: 46,
      meaning: { zh: '对……不利，阻碍', en: 'to act against the way something should work' },
      usage: { zh: 'work against the system、work against the body；与 help along 相对。', en: 'Work against the system; the opposite would be help along.' },
      example: { en: 'Late coffee works against the first sleep cycles.', zh: '临睡前喝咖啡不利于前几个睡眠周期。' },
    },
    {
      phrase: 'on its own', sentenceIndex: 47,
      meaning: { zh: '单独地，单凭自身', en: 'considered alone, without the other factors' },
      usage: { zh: '此处指单条规则影响有限；也可表示“独自”。', en: 'Here it means taken alone; it can also mean by oneself.' },
      example: { en: 'One bad night on its own rarely causes lasting harm.', zh: '单独一晚没睡好很少造成长期影响。' },
    },
    {
      phrase: 'stack up', sentenceIndex: 47,
      meaning: { zh: '累积，叠加在一起', en: 'to build up together over time' },
      usage: { zh: '指多种不利因素同时出现；problems stack up、debts stack up。', en: 'Unfavourable factors build up: problems stack up, debts stack up.' },
      example: { en: 'Late study, screens and heavy meals stack up against good sleep.', zh: '熬夜学习、屏幕和正餐会一起损害睡眠。' },
    },
    {
      phrase: 'improve focus', sentenceIndex: 39,
      meaning: { zh: '提升专注力', en: 'to make concentration sharper and steadier' },
      usage: { zh: 'improve focus and creativity；focus 作不可数名词。', en: 'improve focus and creativity; focus is uncountable here.' },
      example: { en: 'A short walk can improve focus in the afternoon.', zh: '下午短走一段可以提升专注力。' },
    },
  ],
  tips: [
    {
      title: { zh: '先判词性，再等答案词', en: 'Predict the part of speech first' },
      body: {
        zh: '第 36 题空前是 the，空后是句号，填名词；第 38 题空前是 production of，填被分泌的物质。听之前把词性写在空格旁，录音里只等那一类词出现。',
        en: 'In item 36 the gap follows the and ends the sentence, so a noun is required. In item 38 it follows production of, so the answer is a secreted substance. Note the predicted word class before listening.',
      },
    },
    {
      title: { zh: '概览句先答单选，细节段再填笔记', en: 'Overview sentences feed the choice items' },
      body: {
        zh: 'Part 4 常先用几句话给出总体结论，再分阶段展开。31 到 34 题的答案都在开头概览段，35 到 40 题的术语和数字在后面的细节段；不要在概览段就回头找填空术语。',
        en: 'A lecture often gives an overview first, then expands stage by stage. Items 31 to 34 sit in the opening overview; the terms and figures for 35 to 40 appear in the later detail sections. Do not hunt for completion terms during the overview.',
      },
    },
    {
      title: { zh: '同义替换决定选项', en: 'Paraphrase decides the option' },
      body: {
        zh: '单选题选项很少照搬原文：transfers recent memories into long-term storage 对应 moves recent memories into long-term storage，works through emotional memories 对应 Emotional memories are processed。听到原词先别急着选，核对整句意思。',
        en: 'Choice options rarely copy the transcript: transfers recent memories into long-term storage paraphrases moves recent memories into long-term storage, and works through emotional memories matches Emotional memories are processed. Check the whole meaning before choosing a familiar word.',
      },
    },
  ],
};
