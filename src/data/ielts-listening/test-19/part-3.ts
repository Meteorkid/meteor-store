import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 19 · Part 3 — 城市鸟类研究设计（师生讨论，两人）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：先按任务分工（选点、记录表核对、录音、天气数据整理），再谈观察时段、
 * 样本代表性局限、可疑记录的核验方式，最后列出记录表必备栏目。配对块在前，单选块居中，
 * 多选块在后，题块顺序与录音顺序一致。开场用数据事实，不用自我介绍或问候句式。
 */
export const test19Part3: ListeningLesson = {
  slug: 'test-19-part-3',
  part: 3,
  status: 'published',
  title: { zh: '城市鸟类研究设计', en: 'Planning a study on urban birds' },
  summary: {
    zh: '导师与学生规划一项城市鸟类研究：先分工——导师选观察点、学生核对记录表缺项、志愿者负责电话录音、两人共同整理天气数据；随后讨论清晨计数的理由、样本最主要的局限、可疑鸟种记录如何核验，以及记录表上必须填写的栏目。',
    en: 'A supervisor and a student plan an urban bird study. They divide the work: the supervisor chooses the sites, the student checks the record sheet for gaps, volunteers record calls on phones, and the pair sorts the weather data together. They then discuss dawn counts, the main limitation of the sample, how doubtful sightings are verified, and the required columns on the record sheet.',
  },
  accent: { zh: '导师为澳式口音，学生为英式口音。', en: 'The supervisor has an Australian accent; the student has a British accent.' },
  speechRate: '+3%',
  cast: [
    { id: 'supervisor', label: 'SUPERVISOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'checks the record sheet for missing entries' },
        { key: 'B', text: 'chooses the observation sites' },
        { key: 'C', text: 'trains the volunteers' },
        { key: 'D', text: 'compiles the final report' },
        { key: 'E', text: 'records bird calls on a phone' },
        { key: 'F', text: 'sorts the weather data together' },
      ],
      items: [
        { number: 21, text: 'the supervisor' },
        { number: 22, text: 'the student' },
        { number: 23, text: 'a volunteer' },
        { number: 24, text: 'the two of them' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why are the main counts planned at dawn?',
          options: [
            { key: 'A', text: 'More songbirds are active and easy to hear then.' },
            { key: 'B', text: 'There are fewer walkers disturbing the sites.' },
            { key: 'C', text: 'The morning light is better for taking photos.' },
          ],
        },
        {
          number: 26,
          stem: 'What is the main limitation of this sample?',
          options: [
            { key: 'A', text: 'It covers only one suburb.' },
            { key: 'B', text: 'It relies on a small volunteer team.' },
            { key: 'C', text: 'The recordings are not transcribed.' },
          ],
        },
        {
          number: 27,
          stem: 'How will a doubtful sighting be checked first?',
          options: [
            { key: 'A', text: 'Repeat the visit the following week.' },
            { key: 'B', text: 'Compare the notes with photos in a field guide.' },
            { key: 'C', text: 'Send the record to an ornithologist for review.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE fields must be filled in on the record sheet? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE fields are required on the record sheet?',
      options: [
        { key: 'A', text: 'time of observation' },
        { key: 'B', text: 'wind speed' },
        { key: 'C', text: 'bird colour description' },
        { key: 'D', text: 'temperature' },
        { key: 'E', text: 'number of birds seen or heard' },
        { key: 'F', text: 'nest location' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I will choose the observation sites, since I know which green spaces are safe and accessible。导师负责选观察点，对应 B。',
        en: 'Sentence 4: "I will choose the observation sites, since I know which green spaces are safe and accessible". The supervisor chooses the sites, matching B.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 5,
      explanation: {
        zh: '定位句 5：Then I can check the record sheet for missing entries once the first round comes back。学生核对记录表缺项，对应 A。',
        en: 'Sentence 5: "Then I can check the record sheet for missing entries once the first round comes back". The student checks the sheet for gaps, matching A.',
      },
    },
    {
      number: 23, accepted: ['E'], evidence: 6,
      explanation: {
        zh: '定位句 6：A volunteer who signs up will record bird calls on a phone during each visit。志愿者用手机录鸟鸣，对应 E。',
        en: 'Sentence 6: "A volunteer who signs up will record bird calls on a phone during each visit". Volunteers record calls on a phone, matching E.',
      },
    },
    {
      number: 24, accepted: ['F'], evidence: 7,
      explanation: {
        zh: '定位句 7：And the two of us can sort the weather data together at the end of each week。两人共同整理天气数据，对应 F。',
        en: 'Sentence 7: "And the two of us can sort the weather data together at the end of each week". The pair sorts the weather data together, matching F.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：We plan the main counts at dawn, when most songbirds are active and easy to hear。清晨多数鸣禽活跃易闻，对应 A。B 的行人干扰和 C 的拍照光线在本段没有依据。',
        en: 'Sentence 16: "We plan the main counts at dawn, when most songbirds are active and easy to hear". Dawn is chosen because songbirds are active and audible, matching A. Walkers and photo light are not raised here.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：The sites span three suburbs. The real limit is the small volunteer team。真正的局限是志愿者团队规模小，对应 B。A 的只覆盖一个郊区被同句否定，C 的录音未转写未提及。',
        en: 'Sentence 24: "The sites span three suburbs. The real limit is the small volunteer team". The main limit is the small team, matching B. A single suburb is rejected in the same sentence, and untranscribed recordings are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：If a sighting is doubtful, we compare the notes against the photos in a field guide。可疑记录先对照图鉴照片，对应 B。A 的下周复测只适用于筑巢鸟，C 的专家复核在图鉴仍不清时才进行。',
        en: 'Sentence 28: "If a sighting is doubtful, we compare the notes against the photos in a field guide". Doubtful records are first checked against a field guide, matching B. A repeat visit suits nesting pairs, and an expert review follows only if the guide leaves the case unclear.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：The first column is the time of observation, so we can group dawn and afternoon visits。必备栏目之一是观察时间，对应 A。',
        en: 'Sentence 34: "The first column is the time of observation, so we can group dawn and afternoon visits". Time of observation is a required field, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：On the sheet we do record wind speed, because gusts change how birds call。记录表上记录风速，对应 B。温度在共享天气日志里，不上鸟种记录表。',
        en: 'Sentence 39: "On the sheet we do record wind speed, because gusts change how birds call". Wind speed is recorded on the sheet, matching B. Temperature stays in the shared weather log, not the bird sheet.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 41,
      explanation: {
        zh: '定位句 41：Yes, the number of birds seen or heard is a required column on every row。必备栏目是所见或所闻鸟的数量，对应 E。羽色描述为可选，巢位另记在保护区备注里。',
        en: 'Sentence 41: "Yes, the number of birds seen or heard is a required column on every row". The bird count is a required column, matching E. Colour notes are optional, and nest details go in a separate protected-site note.',
      },
    },
  ],
  transcript: [
    { speaker: 'supervisor', text: 'Last spring, nearly two thirds of the sparrows we counted were feeding close to the new university campus.' },
    { speaker: 'student', text: 'That figure surprised me. Most people assume city birds stay in the old parks.' },
    { speaker: 'supervisor', text: 'Exactly, which is why we want to plan a follow-up study on urban birds this term.' },
    { speaker: 'student', text: 'I’m glad we are finally writing it up. Shall we divide the work first?' },
    { speaker: 'supervisor', text: 'Yes. I will choose the observation sites, since I know which green spaces are safe and accessible.' },
    { speaker: 'student', text: 'Then I can check the record sheet for missing entries once the first round comes back.' },
    { speaker: 'supervisor', text: 'Good. A volunteer who signs up will record bird calls on a phone during each visit.' },
    { speaker: 'student', text: 'And the two of us can sort the weather data together at the end of each week.' },
    { speaker: 'supervisor', text: 'That leaves the final report, which I will draft after all the data is in.' },
    { speaker: 'student', text: 'So the site choice is yours, the sheet checks are mine, call recordings go to the volunteers.' },
    { speaker: 'supervisor', text: 'And weather sorting is shared. We should note who owns each task on the plan.' },
    { speaker: 'student', text: 'Right. What about the sites themselves. How many do we need?' },
    { speaker: 'supervisor', text: 'We will pick four spots, two near busy roads and two inside quieter parks.' },
    { speaker: 'student', text: 'Should we include the rooftop garden behind the science building?' },
    { speaker: 'supervisor', text: 'Not this round. It is too new, and we want sites with at least one year of records.' },
    { speaker: 'student', text: 'When should volunteers go out to watch?' },
    { speaker: 'supervisor', text: 'We plan the main counts at dawn, when most songbirds are active and easy to hear.' },
    { speaker: 'student', text: 'Isn’t that early for the volunteers. Would midday be simpler to arrange?' },
    { speaker: 'supervisor', text: 'Midday works, but fewer species call then, and the sample would be weaker.' },
    { speaker: 'student', text: 'So dawn visits first, with a short late afternoon slot as backup.' },
    { speaker: 'supervisor', text: 'Yes. Each observation lasts forty minutes, and volunteers record what they hear and see.' },
    { speaker: 'student', text: 'How many volunteers can we realistically recruit?' },
    { speaker: 'supervisor', text: 'Only six at first, which limits how widely the results can speak for the whole city.' },
    { speaker: 'student', text: 'Is the main weakness then that we cover just one suburb?' },
    { speaker: 'supervisor', text: 'No, the sites span three suburbs. The real limit is the small volunteer team.' },
    { speaker: 'student', text: 'And what about the birds that visit once and never return.' },
    { speaker: 'supervisor', text: 'Those passing birds are noted separately, so they do not bias the resident counts.' },
    { speaker: 'student', text: 'I’m worried we might misidentify a similar species from memory.' },
    { speaker: 'supervisor', text: 'If a sighting is doubtful, we compare the notes against the photos in a field guide.' },
    { speaker: 'student', text: 'Do we send uncertain records to an ornithologist then?' },
    { speaker: 'supervisor', text: 'Only after the field guide leaves the case unclear. Most queries settle at that stage.' },
    { speaker: 'student', text: 'Could we simply repeat the visit next week to confirm?' },
    { speaker: 'supervisor', text: 'That helps for nesting pairs, but a rare visitor may not come back.' },
    { speaker: 'student', text: 'Good. Now what exactly goes on the record sheet?' },
    { speaker: 'supervisor', text: 'The first column is the time of observation, so we can group dawn and afternoon visits.' },
    { speaker: 'student', text: 'Should we write down the bird colour there as well?' },
    { speaker: 'supervisor', text: 'Colour descriptions are optional. Volunteers note a field mark only when the bird is hard to tell apart.' },
    { speaker: 'student', text: 'What about the weather. Does the sheet carry temperature?' },
    { speaker: 'supervisor', text: 'Temperature stays in our shared weather log, not on the bird sheet.' },
    { speaker: 'supervisor', text: 'On the sheet we do record wind speed, because gusts change how birds call.' },
    { speaker: 'student', text: 'And the count itself.' },
    { speaker: 'supervisor', text: 'Yes, the number of birds seen or heard is a required column on every row.' },
    { speaker: 'student', text: 'Should volunteers mark the nest location if they find one?' },
    { speaker: 'supervisor', text: 'No, nest details go in a separate protected-site note, away from the general sheet.' },
    { speaker: 'student', text: 'Let me make sure I have the fields right. Time, wind speed, and the bird count.' },
    { speaker: 'supervisor', text: 'That is the core set. The optional colour note and any nest sighting stay separate.' },
    { speaker: 'student', text: 'How often do we meet to review the entries?' },
    { speaker: 'supervisor', text: 'A short weekly check, where we match each row against the volunteer’s initials.' },
    { speaker: 'student', text: 'Will volunteers get any training before their first visit?' },
    { speaker: 'supervisor', text: 'One evening session on identification and how to use the record sheet.' },
    { speaker: 'student', text: 'Do we give them a printed field guide to carry?' },
    { speaker: 'supervisor', text: 'They borrow a sheet of common local species, rather than a heavy book.' },
    { speaker: 'student', text: 'What if a volunteer cancels last minute?' },
    { speaker: 'supervisor', text: 'We keep two reserve names, so a covered site is never left unwatched.' },
    { speaker: 'student', text: 'Is there an ethics note we need to write up?' },
    { speaker: 'supervisor', text: 'A short one. We never disturb nests, and the counts stay in public green spaces.' },
    { speaker: 'student', text: 'Should the study mention where the recordings can be stored?' },
    { speaker: 'supervisor', text: 'Yes, all call files go in one shared folder, labelled by site and date.' },
    { speaker: 'student', text: 'I can prepare the volunteer welcome email once the sites are fixed.' },
    { speaker: 'supervisor', text: 'Please attach the one-page guide to the common species, so nobody arrives blank.' },
    { speaker: 'student', text: 'When do you want the first draft of the plan?' },
    { speaker: 'supervisor', text: 'By the end of next week, before the department signs it off.' },
    { speaker: 'student', text: 'I’ll list the open questions on a single page and bring it to our next meeting.' },
    { speaker: 'supervisor', text: 'Good. Keep the questions tied to sites, slots and sheet fields, so we can resolve them quickly.' },
    { speaker: 'student', text: 'Will the final results be shared with the local bird group?' },
    { speaker: 'supervisor', text: 'We send them a short summary once the counts are complete, if the data holds up.' },
    { speaker: 'student', text: 'That sounds fair. I’ll start on the volunteer email tonight.' },
    { speaker: 'supervisor', text: 'Fine. Bring the draft sheet when we meet again on Thursday.' },
  ],
  vocabulary: [
    {
      term: 'observation', phonetic: '/ˌɒbzəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '观察（点位与过程）', en: 'watching and recording birds at a chosen site' },
      usage: { zh: '可数或不可数；observation site、observation slot。动词 observe。', en: 'Countable or uncountable: observation site, observation slot. The verb is observe.' },
      collocations: ['observation sites', 'the observation slot', 'field observation'],
      example: { en: 'I will choose the observation sites this week.', zh: '我本周选定观察点位。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'volunteer', phonetic: '/ˌvɒlənˈtɪə(r)/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '志愿者', en: 'a person who takes part in a study without pay' },
      usage: { zh: '可数；sign up as a volunteer、volunteer team。', en: 'Countable: sign up as a volunteer, volunteer team.' },
      collocations: ['a volunteer', 'the volunteer team', 'volunteer training'],
      example: { en: 'A volunteer records bird calls during each visit.', zh: '志愿者每次外出时录制鸟鸣。' },
      listening: { zh: '三个音节，重音在第三音节 /ˈtɪə/。', en: 'Three syllables with stress on the third.' },
    },
    {
      term: 'dawn', phonetic: '/dɔːn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '黎明，清晨', en: 'the early morning when the sun rises' },
      usage: { zh: '不可数；at dawn、before dawn。与 dusk 相对。', en: 'Uncountable: at dawn, before dawn. The opposite is dusk.' },
      collocations: ['at dawn', 'the dawn count', 'before dawn'],
      example: { en: 'The main counts are planned at dawn.', zh: '主要计数安排在清晨。' },
      listening: { zh: '单音节 /dɔːn/，开头 /d/ 清晰。', en: 'One syllable /dɔːn/; keep the opening /d/.' },
    },
    {
      term: 'species', phonetic: '/ˈspiːʃiːz/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '物种，鸟种', en: 'a group of living things that can breed together' },
      usage: { zh: '单复数同形；a species、several species。', en: 'Same form in singular and plural: a species, several species.' },
      collocations: ['a bird species', 'local species', 'rare species'],
      example: { en: 'Fewer species call at midday than at dawn.', zh: '正午鸣叫的鸟种比清晨少。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /ziːz/。', en: 'Two syllables, stress on the first; ending /ziːz/.' },
    },
    {
      term: 'ornithologist', phonetic: '/ˌɔːnɪˈθɒlədʒɪst/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '鸟类学家', en: 'a scientist who studies birds' },
      usage: { zh: '可数；send a record to an ornithologist。名词 ornithology 鸟类学。', en: 'Countable: send a record to an ornithologist. The field is ornithology.' },
      collocations: ['an ornithologist', 'consult an ornithologist', 'a leading ornithologist'],
      example: { en: 'Uncertain records go to an ornithologist only as a last step.', zh: '拿不准的记录最后才请鸟类学家复核。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈθɒ/；开头 /ɔː/。', en: 'Five syllables with stress on the third; opening /ɔː/.' },
    },
    {
      term: 'gusts', phonetic: '/ɡʌsts/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '阵风', en: 'short, sudden bursts of strong wind' },
      usage: { zh: '复数；wind gusts、a gust of wind。', en: 'Plural: wind gusts, a gust of wind.' },
      collocations: ['wind gusts', 'gusts of wind', 'sudden gusts'],
      example: { en: 'Gusts change how birds call, so wind speed is recorded.', zh: '阵风会改变鸟鸣，所以要记录风速。' },
      listening: { zh: '单音节 /ɡʌst/，复数结尾 /s/。', en: 'One syllable /ɡʌst/ with plural /s/.' },
    },
    {
      term: 'summary', phonetic: '/ˈsʌməri/', partOfSpeech: 'n.', sentenceIndex: 65,
      meaning: { zh: '摘要，简要总结', en: 'a short account of the main results' },
      usage: { zh: '可数；send a summary、a short summary。动词 summarize。', en: 'Countable: send a summary, a short summary. The verb is summarize.' },
      collocations: ['a short summary', 'send a summary', 'the study summary'],
      example: { en: 'We send the local bird group a short summary.', zh: '我们给本地鸟类团体发一份简短摘要。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈsʌ/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'divide the work', sentenceIndex: 3,
      meaning: { zh: '分工', en: 'to split the tasks between people' },
      usage: { zh: 'divide the work first；后接 between us。', en: 'Divide the work first, followed by between us.' },
      example: { en: 'Shall we divide the work before we plan the sites?', zh: '我们先把分工定下来再选点好吗？' },
    },
    {
      phrase: 'record bird calls', sentenceIndex: 6,
      meaning: { zh: '录制鸟鸣', en: 'to capture bird calls on a recording device' },
      usage: { zh: 'record 此处为动词；record calls on a phone。', en: 'Here record is a verb: record calls on a phone.' },
      example: { en: 'Volunteers record bird calls on a phone during each visit.', zh: '志愿者每次外出用手机录鸟鸣。' },
    },
    {
      phrase: 'sort the weather data', sentenceIndex: 7,
      meaning: { zh: '整理天气数据', en: 'to arrange weather readings into an orderly set' },
      usage: { zh: 'sort 此处指分类整理；sort the data together。', en: 'Here sort means arrange: sort the data together.' },
      example: { en: 'The two of us sort the weather data each week.', zh: '我们两人每周整理天气数据。' },
    },
    {
      phrase: 'go out to watch', sentenceIndex: 15,
      meaning: { zh: '外出观察', en: 'to leave the building and watch birds' },
      usage: { zh: 'go out to watch；后接观察对象。', en: 'Go out to watch, followed by the birds observed.' },
      example: { en: 'When should volunteers go out to watch?', zh: '志愿者什么时候外出观察？' },
    },
    {
      phrase: 'settle at that stage', sentenceIndex: 30,
      meaning: { zh: '在那一步就解决', en: 'to be resolved at that point without further review' },
      usage: { zh: 'settle 此处指得到结论；at that stage 指流程中的一步。', en: 'Here settle means be resolved; at that stage means at that step.' },
      example: { en: 'Most queries settle at that stage without expert review.', zh: '多数疑问在那一步就解决，不必找专家。' },
    },
    {
      phrase: 'holds up', sentenceIndex: 65,
      meaning: { zh: '站得住，经得起检验', en: 'to remain valid and reliable after checking' },
      usage: { zh: '不及物短语动词；the data holds up、the result holds up。', en: 'Intransitive: the data holds up, the result holds up.' },
      example: { en: 'The summary is sent only if the data holds up.', zh: '数据站得住才对外发摘要。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先记任务动词', en: 'For matching, track the task verb first' },
      body: {
        zh: '第 21–24 题把任务和人配对。开场分工每句主语后紧跟动词短语：choose sites、check sheet、record calls、sort weather。听到角色就在题号旁记动词，再与选项里的同义短语对上。',
        en: 'Items 21 to 24 pair tasks with people. The opening division puts a verb phrase after each subject: choose sites, check sheet, record calls, sort weather. Note the verb beside the role, then match it to the synonymous option phrase.',
      },
    },
    {
      title: { zh: '单选题抓被否定的干扰项', en: 'For single choice, note the rejected distractors' },
      body: {
        zh: '第 26 题 A 选项被 No, the sites span three suburbs 直接否定；第 27 题 C 专家复核在 Only after… 之后才发生。听到 No、only after、rather than 这类信号，先把对应选项划掉，剩下的再比对。',
        en: 'Item 26 option A is rejected by No, the sites span three suburbs, and item 27 expert review follows Only after…. On signals such as No, only after and rather than, cross out the matching option first and compare what remains.',
      },
    },
    {
      title: { zh: '多选题区分必备与可选栏目', en: 'For multi-select, split required from optional fields' },
      body: {
        zh: '第 28–30 题三项必备栏目按 first column、we do record、required column 依次出现；羽色被说成 optional，温度留在另一本日志，巢位另记。听到 optional、separate、not on the sheet 就把对应选项排除。',
        en: 'Items 28 to 30 list the three required fields with first column, we do record and required column. Colour is optional, temperature stays in another log, and nest details are separate. On optional, separate and not on the sheet, eliminate the matching option.',
      },
    },
  ],
};
