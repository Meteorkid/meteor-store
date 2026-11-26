import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 49 · Part 3 — 导师与学生讨论公民科学鸟类计数方案。原创仿真材料，非官方真题。
 *
 * 两人讨论：志愿者培训、固定点计数规则、数据平台录入、质量控制、
 * 单次时长、定点原因、存疑记录处理，以及三项保留的质控措施。
 * 配对题把四个环节与对应做法一一对应。
 */
export const test49Part3: ListeningLesson = {
  slug: 'test-49-part-3',
  part: 3,
  status: 'published',
  title: { zh: '公民科学鸟类计数方案讨论', en: 'Planning a citizen-science bird count' },
  summary: {
    zh: '导师点评学生提交的春季鸟类计数方案：志愿者如何培训、固定点计数规则怎样制定、观测记录如何上传共享平台、存疑条目如何复核，以及单次计数时长、定点原因、不确定记录的处理方式和三项保留的数据质量控制措施。',
    en: 'A tutor reviews a student’s spring bird count proposal: how volunteers are trained, the rules for counting at a fixed point, how sightings are uploaded to the shared platform, how doubtful entries are reviewed, the length of each session, the reason for staying put, the handling of uncertain sightings, and the three quality controls kept in the plan.',
  },
  accent: { zh: '导师为澳式口音，学生为英式口音。', en: 'The tutor has an Australian accent and the student has a British accent.' },
  speechRate: '+3%',
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which approach matches each stage of the plan? Choose the correct letter, A–G.',
      options: [
        { key: 'A', text: 'Train volunteers to identify birds by song and sight' },
        { key: 'B', text: 'Count each species once at a fixed point' },
        { key: 'C', text: 'Upload sightings to the shared online platform' },
        { key: 'D', text: 'Keep a second record to review doubtful entries' },
        { key: 'E', text: 'Share the raw notes with every participant' },
        { key: 'F', text: 'Change the route between visits to cover new ground' },
        { key: 'G', text: 'Invite experts to count instead of volunteers' },
      ],
      items: [
        { number: 21, text: 'Preparing the training plan' },
        { number: 22, text: 'Setting the counting rules' },
        { number: 23, text: 'Entering the collected data' },
        { number: 24, text: 'Checking data quality' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How long does each count session last?',
          options: [
            { key: 'A', text: 'twenty minutes' },
            { key: 'B', text: 'forty minutes' },
            { key: 'C', text: 'one hour' },
          ],
        },
        {
          number: 26,
          stem: 'Why must counters stay at one fixed point?',
          options: [
            { key: 'A', text: 'Moving around would double count birds.' },
            { key: 'B', text: 'The platform only records one location.' },
            { key: 'C', text: 'The paths are closed to walkers that morning.' },
          ],
        },
        {
          number: 27,
          stem: 'What happens to uncertain sightings?',
          options: [
            { key: 'A', text: 'They are marked for later review.' },
            { key: 'B', text: 'They are removed from the records at once.' },
            { key: 'C', text: 'They are published under the counter’s name.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE quality controls does the tutor keep? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE quality controls does the tutor keep?',
      options: [
        { key: 'A', text: 'Record the weather beside each count' },
        { key: 'B', text: 'Count the same patch twice in one morning' },
        { key: 'C', text: 'Note the habitat around the observation point' },
        { key: 'D', text: 'Publish personal contact details on the platform' },
        { key: 'E', text: 'Compare counts across neighbouring volunteers' },
        { key: 'F', text: 'Ignore any bird that flies away before identification' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 5,
      explanation: {
        zh: '定位句 5：Volunteers need to tell common species apart by song and by sight。培训环节的做法是按鸣唱和外形识别鸟类，对应 A。专家替代志愿计数在全段没有出现。',
        en: 'Sentence 5: "Volunteers need to tell common species apart by song and by sight". The training stage teaches identification by song and sight, matching A. Experts counting instead of volunteers is never raised.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 12,
      explanation: {
        zh: '定位句 12：Count each species once at a fixed point, and note the highest number you see at one moment。计数规则是固定点每个物种只计一次，对应 B。更换路线覆盖新区域属于被否定的做法。',
        en: 'Sentence 12: "Count each species once at a fixed point, and note the highest number you see at one moment". The counting rule records each species once at a fixed point, matching B. Changing routes to cover new ground is a rejected approach.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 18,
      explanation: {
        zh: '定位句 18：upload sightings to the shared online platform that evening。数据录入环节是把观测上传共享在线平台，对应 C。原始笔记公开给所有参与者在句 26 被明确否定。',
        en: 'Sentence 18: "upload sightings to the shared online platform that evening". The data stage uploads sightings to the shared online platform, matching C. Sharing raw notes with all participants is explicitly rejected in sentence 26.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 22,
      explanation: {
        zh: '定位句 22：Keep a second record to review doubtful entries, with a note of why the counter was unsure。质量控制靠第二份记录复核存疑条目，对应 D。其余选项没有作为质控手段提出。',
        en: 'Sentence 22: "Keep a second record to review doubtful entries, with a note of why the counter was unsure". Quality control relies on a second record for doubtful entries, matching D. The other options are not raised as controls.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：Keep each session to twenty minutes at the point。单次计数二十分钟；学生先提的一小时在句 32 被导师认为过长，四十分钟没有出现。',
        en: 'Sentence 34: "Keep each session to twenty minutes at the point". Each session lasts twenty minutes. The student’s one hour in sentence 32 is judged too long, and forty minutes never appears.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 40,
      explanation: {
        zh: '定位句 40：Moving around would double count birds, so everyone stays at the marked point。定点是为避免同一群鸟被重复计数；平台定位和小路封闭在全段没有依据。',
        en: 'Sentence 40: "Moving around would double count birds, so everyone stays at the marked point". The fixed point prevents double counting. A platform location limit and closed paths have no basis in the discussion.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 44,
      explanation: {
        zh: '定位句 44：Mark them for later review, rather than guessing a species in the main list。存疑观测先标记待复核，而不是猜一个物种；立即删除和公开署名都不是处理方式。',
        en: 'Sentence 44: "Mark them for later review, rather than guessing a species in the main list". Uncertain sightings are marked for review rather than guessed. Instant removal and named publication are not the handling method.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 52,
      explanation: {
        zh: '定位句 52：Keep that one. Weather changes bird activity, so we can explain why some sites were quiet。保留的第一项质控是在计数旁记录天气；句 54 的同片区域重复计数被删掉。',
        en: 'Sentence 52: "Keep that one. Weather changes bird activity, so we can explain why some sites were quiet". The first kept control records the weather beside the count. The repeated patch in sentence 54 is dropped.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 56,
      explanation: {
        zh: '定位句 56：Keep that. Habitat tells us why a species appears at one point and not another。第二项保留的是记录观测点周边栖息地；个人联系方式在句 58 被要求撤下平台。',
        en: 'Sentence 56: "Keep that. Habitat tells us why a species appears at one point and not another". The second kept control notes the habitat around the point. Personal contact details in sentence 58 are removed from the platform.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 59,
      explanation: {
        zh: '定位句 59：Compare our counts with neighbouring volunteers at nearby sites。第三项保留的是与邻近志愿者的计数互相比较；句 62 说未识别的飞鸟不能直接忽略。',
        en: 'Sentence 59: "Compare our counts with neighbouring volunteers at nearby sites". The third kept control compares counts with neighbouring volunteers. Sentence 62 states that unidentified flyovers must not be ignored.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Thanks for coming in, Jamie. Let’s look over your proposal for the spring bird count.' },
    { speaker: 'student', text: 'The count is a citizen-science project, so local volunteers do most of the fieldwork.' },
    { speaker: 'tutor', text: 'Right. Walk me through how you plan to train the volunteers.' },
    { speaker: 'student', text: 'I thought we’d hold one evening session before the count weekend.' },
    { speaker: 'tutor', text: 'An evening session helps, but what will that session actually cover?' },
    { speaker: 'student', text: 'Mainly identification. Volunteers need to tell common species apart by song and by sight.' },
    { speaker: 'tutor', text: 'We should include a short walk around the reserve, so people practise calls in the open.' },
    { speaker: 'student', text: 'We can use the pond edge, where several species nest each year.' },
    { speaker: 'tutor', text: 'Good. Have you decided the rules volunteers follow once they are in the field?' },
    { speaker: 'student', text: 'Yes. At each observation point, they count every species they see or hear, and write down the number of individuals.' },
    { speaker: 'tutor', text: 'Careful. Counting every individual can overstate the same bird if it moves between bushes.' },
    { speaker: 'student', text: 'So how should we record it instead?' },
    { speaker: 'tutor', text: 'Count each species once at a fixed point, and note the highest number you see at one moment.' },
    { speaker: 'student', text: 'Once per species, at the point, with the peak count. That keeps the figures comparable across sites.' },
    { speaker: 'tutor', text: 'We do not want volunteers roaming the wood and counting the same flock twice.' },
    { speaker: 'student', text: 'What about the data itself? How do volunteers send their sightings back to us?' },
    { speaker: 'tutor', text: 'That is the platform question. We use the shared online platform the department runs for other surveys.' },
    { speaker: 'student', text: 'Do they type notes straight into a phone during the walk?' },
    { speaker: 'tutor', text: 'They can, but the safer route is to write on paper first, then upload sightings to the shared online platform that evening.' },
    { speaker: 'student', text: 'Paper first, upload later, so entries are not lost if the signal drops.' },
    { speaker: 'tutor', text: 'The platform keeps records separate, so we can trace an entry back to its counter.' },
    { speaker: 'student', text: 'I was worried about doubtful records. What happens when someone is unsure about a bird?' },
    { speaker: 'tutor', text: 'That brings us to quality control. Keep a second record to review doubtful entries, with a note of why the counter was unsure.' },
    { speaker: 'student', text: 'A second list for uncertain sightings, separate from the main count.' },
    { speaker: 'tutor', text: 'Yes. An expert looks over that list after the weekend, and confirms or removes each entry.' },
    { speaker: 'student', text: 'Should volunteers share their raw notes with everyone on the project?' },
    { speaker: 'tutor', text: 'The raw notes stay private to the counter and review team; the platform shows only agreed figures.' },
    { speaker: 'student', text: 'The public side does not carry personal contact details either.' },
    { speaker: 'tutor', text: 'Right. Now let’s turn to the details in your draft.' },
    { speaker: 'student', text: 'Go ahead.' },
    { speaker: 'tutor', text: 'How long did you plan for each count session?' },
    { speaker: 'student', text: 'I suggested an hour per point, to give people time to watch the birds.' },
    { speaker: 'tutor', text: 'An hour is too long; other volunteers waiting their turn will fall behind.' },
    { speaker: 'student', text: 'What do you recommend?' },
    { speaker: 'tutor', text: 'Keep each session to twenty minutes at the point, with a ten minute break before the next stop.' },
    { speaker: 'student', text: 'Twenty minutes counting, ten minutes between stops, fitting more sites into the morning.' },
    { speaker: 'tutor', text: 'It matches the standard our other surveys use, so numbers stay comparable.' },
    { speaker: 'student', text: 'One question about movement during the count. Can counters walk along the path and record as they go?' },
    { speaker: 'tutor', text: 'Not at all. Why do you think a fixed point matters?' },
    { speaker: 'student', text: 'If people move around, the same flock may be counted again at two stops.' },
    { speaker: 'tutor', text: 'Precisely. Moving around would double count birds, so everyone stays at the marked point for the full session.' },
    { speaker: 'student', text: 'And if a bird flies over the point during the walk in?' },
    { speaker: 'tutor', text: 'Record flyovers separately on the sheet; do not add them to the resident count at that point.' },
    { speaker: 'student', text: 'What about sightings the counter cannot name with confidence?' },
    { speaker: 'tutor', text: 'Mark them for later review, rather than guessing a species in the main list.' },
    { speaker: 'student', text: 'A guessed name would pull the whole comparison off balance.' },
    { speaker: 'tutor', text: 'The uncertain entry goes on the second record, with a short description of colour or call.' },
    { speaker: 'student', text: 'Will an expert check those before the report is written?' },
    { speaker: 'tutor', text: 'Yes. No doubtful entry appears in the published count until the review team has confirmed it.' },
    { speaker: 'student', text: 'Now, the controls I wrote into the plan. Which ones do you think we should keep?' },
    { speaker: 'tutor', text: 'Let’s go through your list one by one.' },
    { speaker: 'student', text: 'First, each counter records the weather beside their count, temperature, wind and cloud.' },
    { speaker: 'tutor', text: 'Keep that one. Weather changes bird activity, so we can explain why some sites were quiet.' },
    { speaker: 'student', text: 'Second, should we count the same patch twice in one morning?' },
    { speaker: 'tutor', text: 'Drop that. A second walk repeats birds already recorded and wastes time.' },
    { speaker: 'student', text: 'Third, note the habitat around each observation point, such as reeds, trees or open grass.' },
    { speaker: 'tutor', text: 'Keep that. Habitat tells us why a species appears at one point and not another.' },
    { speaker: 'student', text: 'Fourth, I listed contact details so counters could message each other.' },
    { speaker: 'tutor', text: 'Leave that out. Contact details stay off the platform; messages go through the organiser.' },
    { speaker: 'student', text: 'Fifth, compare our counts with neighbouring volunteers at nearby sites.' },
    { speaker: 'tutor', text: 'Keep that comparison. If two close sites report very different totals, one team may have missed a flock, so we can check back.' },
    { speaker: 'student', text: 'Sixth, ignore any bird that flies away before it is identified.' },
    { speaker: 'tutor', text: 'Do not ignore it. Note the sighting on the second record and describe what you saw.' },
    { speaker: 'student', text: 'So we keep weather, habitat and the comparison between neighbours.' },
    { speaker: 'tutor', text: 'That’s the three controls. The repeated patch, contact details and unidentified flyovers are out.' },
    { speaker: 'student', text: 'I’ll revise the draft along those lines and bring it to the next meeting.' },
    { speaker: 'tutor', text: 'Check every volunteer has the paper sheet and platform login before the weekend.' },
    { speaker: 'student', text: 'Will do. Thanks for going through it with me.' },
    { speaker: 'tutor', text: 'The count stands or falls on consistent records, so keep the rules clear on the day.' },
  ],
  vocabulary: [
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '识别，辨认（按外形或鸣唱认出物种）', en: 'the act of recognising what a bird species is' },
      usage: { zh: '不可数；bird identification、identification by song。动词 identify。', en: 'Uncountable: bird identification. The verb is identify.' },
      collocations: ['identification by song', 'bird identification', 'practise identification'],
      example: { en: 'Volunteers identify common species by song and by sight.', zh: '志愿者按鸣唱和外形辨认常见鸟类。' },
      listening: { zh: '六个音节，重音在第五音节 /ˈkeɪ/；前缀 /aɪ/ 要读清楚。', en: 'Six syllables with stress on the fifth; the opening /aɪ/ is clear.' },
    },
    {
      term: 'species', phonetic: '/ˈspiːʃiːz/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '物种', en: 'a group of animals or plants that share the same type' },
      usage: { zh: '单复数同形；common species、count each species。', en: 'Same form in singular and plural: common species.' },
      collocations: ['each species', 'common species', 'a bird species'],
      example: { en: 'Count each species once at the fixed observation point.', zh: '在固定观测点每个物种只计一次。' },
      listening: { zh: '两个音节，重音在第一音节；中间 /ʃiː/ 不要读成 /siː/。', en: 'Two syllables with stress on the first; the middle is /ʃiː/, not /siː/.' },
    },
    {
      term: 'platform', phonetic: '/ˈplætfɔːm/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '平台（共享在线数据平台）', en: 'an online system where participants enter and review shared data' },
      usage: { zh: '可数；shared online platform、upload to the platform。', en: 'Countable: shared online platform, upload to the platform.' },
      collocations: ['the shared online platform', 'upload sightings to the platform', 'the platform login'],
      example: { en: 'Upload the sightings to the shared online platform that evening.', zh: '当晚把观测记录上传到共享在线平台。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /fɔːm/ 不卷舌。', en: 'Two syllables with stress on the first; the ending /fɔːm/ is non-rhotic.' },
    },
    {
      term: 'doubtful', phonetic: '/ˈdaʊtfl/', partOfSpeech: 'adj.', sentenceIndex: 22,
      meaning: { zh: '存疑的，不确定的', en: 'not certain to be correct, needing a second check' },
      usage: { zh: '形容词；doubtful entries、doubtful record。名词 doubt。', en: 'Adjective: doubtful entries. The noun is doubt.' },
      collocations: ['doubtful entries', 'review doubtful entries', 'a doubtful sighting'],
      example: { en: 'Keep a second record to review doubtful entries.', zh: '用第二份记录复核存疑条目。' },
      listening: { zh: '两个音节，重音在第一音节；中间 /ə/ 几乎不发音。', en: 'Two syllables with stress on the first; the middle /ə/ is barely heard.' },
    },
    {
      term: 'comparable', phonetic: '/ˈkɒmpərəbl/', partOfSpeech: 'adj.', sentenceIndex: 36,
      meaning: { zh: '可比较的，口径一致的', en: 'similar enough for results to be compared fairly' },
      usage: { zh: '形容词；comparable across sites、keep figures comparable。动词 compare。', en: 'Adjective: comparable across sites. The verb is compare.' },
      collocations: ['comparable across sites', 'keep the numbers comparable', 'comparable figures'],
      example: { en: 'The standard keeps the numbers comparable across other surveys.', zh: '这套标准让各调查的数据口径一致、可以比较。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /ərə/ 弱读。', en: 'Three syllables with stress on the first; the middle /ərə/ is reduced.' },
    },
    {
      term: 'habitat', phonetic: '/ˈhæbɪtæt/', partOfSpeech: 'n.', sentenceIndex: 56,
      meaning: { zh: '栖息地，生境', en: 'the natural surroundings where a plant or animal lives' },
      usage: { zh: '可数；the habitat around the point、reeds as habitat。', en: 'Countable: the habitat around the point.' },
      collocations: ['the habitat around the point', 'reeds and trees', 'open grass habitat'],
      example: { en: 'Note the habitat around each observation point, such as reeds or trees.', zh: '记录观测点周边的栖息地，例如芦苇或树木。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /tæt/ 短促有力。', en: 'Three syllables with stress on the first; the ending /tæt/ is crisp.' },
    },
    {
      term: 'resident', phonetic: '/ˈrezɪdənt/', partOfSpeech: 'adj.', sentenceIndex: 42,
      meaning: { zh: '常驻的，留居的（resident count 本地留鸟计数）', en: 'living in a place rather than passing through' },
      usage: { zh: '形容词；resident count、resident bird。名词同形指居民。', en: 'Adjective: resident count. As a noun it means a resident person.' },
      collocations: ['the resident count', 'resident birds', 'the resident flock'],
      example: { en: 'Do not add flyovers to the resident count at that point.', zh: '不要把过境飞鸟计入该点的留鸟计数。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /zɪ/ 轻读。', en: 'Three syllables with stress on the first; the middle /zɪ/ is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'look over', sentenceIndex: 0,
      meaning: { zh: '审阅，过目（方案或草稿）', en: 'to read through a proposal and check its details' },
      usage: { zh: '及物短语动词；look over the proposal、look over the draft。', en: 'Transitive: look over the proposal, the draft.' },
      example: { en: 'Let’s look over your proposal for the spring bird count.', zh: '我们来审阅你这份春季鸟类计数方案。' },
    },
    {
      phrase: 'common species apart', sentenceIndex: 5,
      meaning: { zh: '区分常见物种', en: 'to recognise the difference between similar common birds' },
      usage: { zh: 'tell something apart；中间插入被区分的对象 common species。', en: 'tell something apart; the object common species sits in the middle.' },
      example: { en: 'Volunteers need to tell common species apart by song.', zh: '志愿者要能按鸣唱区分常见物种。' },
    },
    {
      phrase: 'drop that', sentenceIndex: 54,
      meaning: { zh: '去掉，放弃（某条措施）', en: 'to remove an idea or control from the plan' },
      usage: { zh: '口语指令；Drop that. 后接被去掉的条目。', en: 'Spoken instruction: Drop that, followed by the removed item.' },
      example: { en: 'Drop that; a second walk repeats birds already recorded.', zh: '去掉这条，第二次走动会重复已记录的鸟。' },
    },
    {
      phrase: 'stands or falls', sentenceIndex: 68,
      meaning: { zh: '成败取决于（一致的记录）', en: 'to succeed or fail depending on one key condition' },
      usage: { zh: '习语；the project stands or falls on something。', en: 'Idiom: the project stands or falls on something.' },
      example: { en: 'The count stands or falls on consistent records.', zh: '这次计数的成败取决于记录是否口径一致。' },
    },
    {
      phrase: 'check back', sentenceIndex: 60,
      meaning: { zh: '回头复查，再去核实', en: 'to return to a record and verify it later' },
      usage: { zh: '不及物；check back on the totals、check back with the team。', en: 'Intransitive: check back on the totals.' },
      example: { en: 'If totals differ, one team may have missed a flock, so we check back.', zh: '若总数相差较大，可能漏了一群鸟，我们再回头复查。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把环节译成自己的话', en: 'Translate each stage before matching' },
      body: {
        zh: '第 21–24 题把培训、规则、录入、质控四个环节与做法配对。听前先把四个环节缩写成培训、规则、录入、质控，听到对应做法时直接选字母，注意区分“上传平台”和“存疑复核”两类数据动作。',
        en: 'Items 21 to 24 pair training, rules, data entry and quality control with approaches. Abbreviate the four stages before listening, and choose the letter when the matching approach appears. Keep platform uploads apart from doubtful-entry review.',
      },
    },
    {
      title: { zh: '计算题留意被否定的旧数字', en: 'Watch rejected figures in timing items' },
      body: {
        zh: '第 25 题问单次时长，学生先说一小时，导师用 too long 否定，最终是二十分钟。Part 3 常先抛一个初稿数字再纠正，被否定的数字就是干扰项；休息的十分钟不属于计数时长。',
        en: 'Item 25 asks the session length. The student first suggests an hour, the tutor rejects it as too long, and the final figure is twenty minutes. Part 3 often offers a draft number first, then corrects it; the rejected figure is the distractor. The ten minute break is not counting time.',
      },
    },
    {
      title: { zh: '多选题逐条听保留与删除', en: 'Mark keep and drop decisions in multiple choice' },
      body: {
        zh: '第 28–30 题的六个选项在对话里逐条过：Keep that one、Keep that、Keep that comparison 对应三条答案；Drop that、Leave that out、Do not ignore it 对应干扰项。听到 keep 或 drop 立刻在选项旁做记号。',
        en: 'Items 28 to 30 go through six options one by one. Keep that one, Keep that and Keep that comparison match the three answers; Drop that, Leave that out and Do not ignore it mark the distractors. Note keep or drop beside each option as you hear it.',
      },
    },
  ],
};
