import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 43 · Part 3 — 电动公交数据评析（三人讨论，英式为主，一名学生美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：购置成本与里程衰减（单选 21–23）→ 四人分工（配对 24–27）
 * → 公平对比必须包含的三项口径（多选 28–30）。题块顺序与录音一致。
 */
export const test43Part3: ListeningLesson = {
  slug: 'test-43-part-3',
  part: 3,
  status: 'published',
  title: { zh: '电动公交数据评析', en: 'Reviewing data on electric buses' },
  summary: {
    zh: '导师与两名学生比较柴油与电动公交车队：电动车型购置价更高、电池随年份衰减里程，公平对比要统一线路长度、工况与载客量；分工为 Sonia 对比车队、Ava 核查充电排班、Sonia 写数据摘要、导师复核能耗数据，并列出电池年龄、季节里程与统一载客量三项可比口径。',
    en: 'A tutor and two students compare diesel and electric bus fleets: the higher purchase price, battery range decline with age, and fair comparison on matched route length, duty cycle and passenger load. They divide fleet comparison, charging schedule, summary drafting and energy review, then list battery age, seasonal mileage and matched passenger load as valid comparison criteria.',
  },
  accent: { zh: '导师与 Sonia 为英式口音，Ava 为美式口音。', en: 'The tutor and Sonia have British accents; Ava has an American accent.' },
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 21,
          stem: 'What is the main financial drawback of electric buses?',
          options: [
            { key: 'A', text: 'The higher upfront purchase price.' },
            { key: 'B', text: 'The day to day energy bill.' },
            { key: 'C', text: 'The cost of building new chargers.' },
          ],
        },
        {
          number: 22,
          stem: 'What does range decline mean?',
          options: [
            { key: 'A', text: 'The bus loses its route map after long use.' },
            { key: 'B', text: 'The battery stores less charge as it ages.' },
            { key: 'C', text: 'The charger breaks down in cold weather.' },
          ],
        },
        {
          number: 23,
          stem: 'How should the two fleets be compared fairly?',
          options: [
            { key: 'A', text: 'By total monthly energy use at each depot.' },
            { key: 'B', text: 'By the number of passengers carried in peak hours.' },
            { key: 'C', text: 'On matched route length, duty cycle and passenger load.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which person is responsible for each task? Choose the correct letter, A–C.',
      options: [
        { key: 'A', text: 'the tutor' },
        { key: 'B', text: 'Sonia' },
        { key: 'C', text: 'Ava' },
      ],
      items: [
        { number: 24, text: 'compare the two depot fleets' },
        { number: 25, text: 'check the charging schedule' },
        { number: 26, text: 'draft the data summary' },
        { number: 27, text: 'review the energy figures' },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE factors must be included for a fair comparison? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE factors must be included for a fair comparison?',
      options: [
        { key: 'A', text: 'Record the age of each battery in the comparison.' },
        { key: 'B', text: 'Compare winter and summer mileage on the same routes.' },
        { key: 'C', text: 'Charge every bus to full before each trip.' },
        { key: 'D', text: 'Ignore maintenance costs when judging running costs.' },
        { key: 'E', text: 'Use the same passenger load when estimating energy use.' },
        { key: 'F', text: 'Count special promotional trips twice in the totals.' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 7,
      explanation: {
        zh: '定位句 7：the main financial drawback is the higher purchase price, not the fuel itself。higher purchase price 对应 A；B 错在句 8 说日常能耗更低，C 的建桩成本讨论中没有出现。',
        en: 'Sentence 7: "the main financial drawback is the higher purchase price, not the fuel itself". Higher purchase price matches A. B is wrong because sentence 8 says daily energy use is lower, and charger construction in C is never mentioned.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：Over several years, the battery holds less charge than it did when new。battery holds less charge 对应 B；A 的线路图和 C 的充电桩故障在讨论中均未涉及。',
        en: 'Sentence 11: "Over several years, the battery holds less charge than it did when new". The battery storing less charge matches B. The route map in A and charger breakdown in C are not discussed.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 20,
      explanation: {
        zh: '定位句 20：We should match the same route length and the same duty cycle, including stops, hills and passenger load。三项可比口径对应 C；A 的月度总能耗在句 17 被认为会误导，B 的高峰客流未作为对比基准。',
        en: 'Sentence 20: "We should match the same route length and the same duty cycle, including stops, hills and passenger load". The three matched conditions match C. Total monthly energy in A is called misleading in sentence 17, and peak passengers in B are not the comparison basis.',
      },
    },
    {
      number: 24, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：Sonia 主动提出 I can compare the two depot fleets side by side，她已有线路图。车队对比归 Sonia，对应 B。',
        en: 'Sentence 24: Sonia says "I can compare the two depot fleets side by side", since she already has the route maps. The fleet comparison goes to Sonia, matching B.',
      },
    },
    {
      number: 25, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Ava 接下 Then I will check the charging schedule，查看每辆车何时插枪、充多久。充电排班归 Ava，对应 C。',
        en: 'Sentence 25: Ava says "Then I will check the charging schedule", to see when each bus plugs in and how long it stays. The charging schedule goes to Ava, matching C.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：Sonia 用 Actually 提出 could I do the summary，导师句 29 确认 Sonia writes the report。数据摘要归 Sonia，对应 B；Ava 句 27 的提议被这次修正取代。',
        en: 'Sentence 28: Sonia asks "could I do the summary" with Actually, and the tutor confirms in sentence 29 that Sonia writes the summary. The task goes to Sonia, matching B. Ava’s earlier offer in sentence 27 is replaced by this correction.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：导师说 I will review the energy figures myself，让存疑读数得到二次核对。复核能耗数据归导师，对应 A。',
        en: 'Sentence 32: the tutor says "I will review the energy figures myself", so any doubtful reading gets a second check. Reviewing the energy figures goes to the tutor, matching A.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：record the age of each battery in the comparison, so older vehicles are not judged against new ones。记录电池年龄对应 A。',
        en: 'Sentence 34: "record the age of each battery in the comparison, so older vehicles are not judged against new ones". Recording battery age matches A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：compare winter and summer mileage on the same routes, because cold weather drains the battery faster。同线路冬夏里程对比对应 B；句 37 的一月七月读数是这条口径的例证。',
        en: 'Sentence 36: "compare winter and summer mileage on the same routes, because cold weather drains the battery faster". Seasonal mileage on the same routes matches B. The January and July readings in sentence 37 illustrate this point.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 38,
      explanation: {
        zh: '定位句 38：use the same passenger load when estimating energy use。统一载客量对应 E。C（每次充满）在句 42 被否定，D（忽略维护成本）在句 44 被否定，F（促销行程重复计）在句 46 被否定。',
        en: 'Sentence 38: "use the same passenger load when estimating energy use". The matched passenger load matches E. Filling every bus in C is rejected in sentence 42, ignoring maintenance in D in sentence 44, and double counting trips in F in sentence 46.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Can a fleet of electric buses really match the running costs of the diesel buses it replaces?' },
    { speaker: 'sonia', text: 'That’s the question our group has been trying to answer for the transport study.' },
    { speaker: 'ava', text: 'We have two depot records to compare, one for diesel buses and one for the new electric fleet.' },
    { speaker: 'tutor', text: 'Good. Let’s start with the figures that matter most, and make sure we compare like with like.' },
    { speaker: 'tutor', text: 'First, what stands out when you look at the purchase side?' },
    { speaker: 'sonia', text: 'The electric buses cost far more to buy. Each one is roughly twice the price of a diesel bus of the same size.' },
    { speaker: 'ava', text: 'That high upfront cost worries the council, even if the day to day energy bill is lower.' },
    { speaker: 'tutor', text: 'Right. So the main financial drawback is the higher purchase price, not the fuel itself.' },
    { speaker: 'sonia', text: 'Once they are running, the electric buses use less energy per kilometre, and they have fewer moving parts to service.' },
    { speaker: 'ava', text: 'But the batteries do not stay as good as new for the whole life of the bus.' },
    { speaker: 'tutor', text: 'Exactly. What do you mean by range decline?' },
    { speaker: 'ava', text: 'Over several years, the battery holds less charge than it did when new, so the bus cannot cover the same route on one charge.' },
    { speaker: 'sonia', text: 'We saw some buses losing a noticeable amount of range after three years of daily service.' },
    { speaker: 'tutor', text: 'That matters for scheduling, because a bus with a weaker battery may need a midday top up.' },
    { speaker: 'sonia', text: 'We should record battery age for every vehicle, so the decline does not get mixed up with bad driving.' },
    { speaker: 'ava', text: 'I agree. Otherwise a bus that seems inefficient may simply be an older one.' },
    { speaker: 'tutor', text: 'Now, how did you compare the two fleets in your notes?' },
    { speaker: 'ava', text: 'At first we looked at total monthly energy use, but the two depots run different route lengths.' },
    { speaker: 'sonia', text: 'The diesel depot covers longer suburban routes, while the electric buses run shorter urban loops.' },
    { speaker: 'tutor', text: 'Then the raw totals would mislead you. How should the comparison be made fair?' },
    { speaker: 'sonia', text: 'We should match the same route length and the same duty cycle, including stops, hills and passenger load.' },
    { speaker: 'ava', text: 'Right. A bus that climbs hills all day uses more energy than one on a flat circular route.' },
    { speaker: 'tutor', text: 'That is the comparable basis. Without it, the numbers cannot speak for either fleet.' },
    { speaker: 'tutor', text: 'Now let’s divide the remaining work between you two.' },
    { speaker: 'sonia', text: 'I can compare the two depot fleets side by side, since I already have the route maps.' },
    { speaker: 'ava', text: 'Then I will check the charging schedule, to see when each bus plugs in and how long it stays.' },
    { speaker: 'tutor', text: 'Good. Who will draft the data summary for the report?' },
    { speaker: 'ava', text: 'I could compile the summary once the charging records are in.' },
    { speaker: 'sonia', text: 'Actually, could I do the summary? I’m better at organising tables, and Ava has the charging notes.' },
    { speaker: 'tutor', text: 'That’s settled. Sonia writes the summary, Ava keeps the charging records.' },
    { speaker: 'ava', text: 'Fair enough.' },
    { speaker: 'sonia', text: 'One more task. Someone should review the energy figures before we hand the report in.' },
    { speaker: 'tutor', text: 'I will review the energy figures myself, so that any doubtful reading gets a second check.' },
    { speaker: 'tutor', text: 'Now let’s talk about what a fair comparison must include.' },
    { speaker: 'tutor', text: 'First, record the age of each battery in the comparison, so older vehicles are not judged against new ones.' },
    { speaker: 'sonia', text: 'That covers the range decline we discussed earlier.' },
    { speaker: 'tutor', text: 'Second, compare winter and summer mileage on the same routes, because cold weather drains the battery faster.' },
    { speaker: 'ava', text: 'I noticed the electric buses cover fewer kilometres in January than in July.' },
    { speaker: 'tutor', text: 'Third, use the same passenger load when estimating energy use, since a full bus draws more power than an empty one.' },
    { speaker: 'sonia', text: 'We can note the average passenger count from the depot records.' },
    { speaker: 'tutor', text: 'Those three points are the safeguards that make your numbers credible.' },
    { speaker: 'ava', text: 'What about charging every bus to full before each trip?' },
    { speaker: 'tutor', text: 'I would avoid that. The schedule should match the route, and overcharging wastes time and wears the battery.' },
    { speaker: 'sonia', text: 'Should we ignore maintenance costs when judging running costs?' },
    { speaker: 'tutor', text: 'No, you must include servicing and tyre wear, because the comparison is about the whole cost of ownership.' },
    { speaker: 'ava', text: 'And should special promotional trips be counted twice in the totals?' },
    { speaker: 'tutor', text: 'Definitely not. Count each trip once, or your energy totals will look larger than they really are.' },
    { speaker: 'sonia', text: 'So the three valid points are battery age, seasonal mileage and matched passenger load.' },
    { speaker: 'tutor', text: 'That’s right.' },
    { speaker: 'tutor', text: 'A few practical details before you finish.' },
    { speaker: 'sonia', text: 'When do we need the draft tables?' },
    { speaker: 'tutor', text: 'Bring them to our next meeting, which is two weeks from today.' },
    { speaker: 'ava', text: 'Will we present the findings to the council transport officer?' },
    { speaker: 'tutor', text: 'Yes, but only after the figures have been checked against the depot records again.' },
    { speaker: 'sonia', text: 'How many vehicles should the comparison cover?' },
    { speaker: 'tutor', text: 'Ten buses from each fleet would be a minimum, and fifteen would give a stronger result.' },
    { speaker: 'ava', text: 'We’ll aim for twelve or fifteen, depending on which records are complete.' },
    { speaker: 'tutor', text: 'Good. Keep the definitions consistent across both depots, so that one kilometre means the same thing in each note.' },
    { speaker: 'sonia', text: 'We should note the charger type each depot uses, since older chargers take longer to fill a battery.' },
    { speaker: 'ava', text: 'And the weather conditions, because rain and cold both affect range on some routes.' },
    { speaker: 'tutor', text: 'Those are worth recording in the method section, but they are not separate comparison criteria.' },
    { speaker: 'tutor', text: 'One last reminder. Do not let one impressive average decide the argument. Show the spread of readings as well.' },
    { speaker: 'sonia', text: 'We’ll include the weekly variation in the tables.' },
    { speaker: 'ava', text: 'Thanks for working through the schedule with us.' },
    { speaker: 'tutor', text: 'You’re welcome. Check the charging logs first, and then we can look at the fleet comparison together.' },
    { speaker: 'sonia', text: 'We’ll keep the method notes separate from the results table.' },
    { speaker: 'ava', text: 'That way the council can see how we reached each figure.' },
    { speaker: 'tutor', text: 'Exactly. A clear method is what turns a pile of readings into a credible study.' },
  ],
  vocabulary: [
    {
      term: 'fleet', phonetic: '/fliːt/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '车队（同一运营方的一组车辆）', en: 'the group of vehicles owned and run by one operator' },
      usage: { zh: '可数名词；bus fleet、the two depots’ fleets。本义也指“海军编队”。', en: 'Countable: bus fleet, the two depot fleets. It can also mean a naval group.' },
      collocations: ['the electric fleet', 'a bus fleet', 'fleet comparison'],
      example: { en: 'The new fleet covers the same urban routes as the old diesel buses.', zh: '新车队行驶的城市线路与旧柴油车相同。' },
      listening: { zh: '单音节，长元音 /iː/，结尾 /t/ 清辅音。', en: 'One syllable with long vowel /iː/ and a voiceless final /t/.' },
    },
    {
      term: 'upfront', phonetic: '/ˌʌpˈfrʌnt/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '先期的， upfront cost 指购车时一次性付出的价格', en: 'paid at the start, before the item operates; an upfront cost is the initial purchase price' },
      usage: { zh: '常作定语；upfront cost、upfront payment。反义是 ongoing（持续发生的）。', en: 'Often attributive: upfront cost, upfront payment. The opposite is ongoing.' },
      collocations: ['upfront cost', 'an upfront purchase', 'high upfront'],
      example: { en: 'The upfront price is high, but running costs fall over the year.', zh: '先期价格偏高，但运行成本全年更低。' },
      listening: { zh: '复合词，重音在后半部分 /ˈfrʌnt/。', en: 'Compound with stress on the second part.' },
    },
    {
      term: 'decline', phonetic: '/dɪˈklaɪn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '衰减，下降（电池容量随使用年限降低）', en: 'a gradual fall in capacity or performance over time' },
      usage: { zh: '名词与动词同形；range decline、battery decline。名词重音在后。', en: 'Noun and verb share the form: range decline, battery decline. Noun stress is second.' },
      collocations: ['range decline', 'battery decline', 'a steady decline'],
      example: { en: 'Range decline means older buses cover fewer kilometres per charge.', zh: '里程衰减意味着旧车每次充电跑得更少。' },
      listening: { zh: '双音节，重音在第二音节 /ˈklaɪn/，与 decline 拒绝义同形。', en: 'Two syllables stressed second; same spelling as the verb meaning refuse.' },
    },
    {
      term: 'comparable', phonetic: '/ˈkɒmpərəbl/', partOfSpeech: 'adj.', sentenceIndex: 22,
      meaning: { zh: '可比的，口径一致可横向比较的', en: 'measured under the same conditions so one can be judged against the other' },
      usage: { zh: 'comparable basis、comparable data；反义是 incomparable。', en: 'Comparable basis, comparable data. The opposite is incomparable.' },
      collocations: ['a comparable basis', 'comparable figures', 'comparable routes'],
      example: { en: 'Only comparable routes can be used in the energy comparison.', zh: '只有口径一致的线路才能用于能耗对比。' },
      listening: { zh: '四个音节，重音在第一音节，中间 /pər/ 轻读。', en: 'Four syllables stressed first, with a light middle /pər/.' },
    },
    {
      term: 'schedule', phonetic: '/ˈʃedjuːl/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '排班，时间表（充电与发车的时间安排）', en: 'the planned timetable showing when buses charge and run their routes' },
      usage: { zh: '英式 /ˈʃedjuːl/，美式常读 /ˈskedʒuːl/；charging schedule、shift schedule。', en: 'British /ˈʃedjuːl/, American /ˈskedʒuːl/: charging schedule, shift schedule.' },
      collocations: ['the charging schedule', 'a bus schedule', 'on schedule'],
      example: { en: 'The charging schedule shows which bus plugs in after each route.', zh: '充电排班标明每趟线路后哪辆车插枪。' },
      listening: { zh: '英式开头是 /ʃ/，不要读成美式 /sk/。', en: 'British opens with /ʃ/, not the American /sk/.' },
    },
    {
      term: 'summary', phonetic: '/ˈsʌməri/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '摘要，汇总（把数据整理成的结论段落）', en: 'a short written account that pulls the key figures together' },
      usage: { zh: '可数名词；data summary、compile a summary。形容词 summary 指“简要的”。', en: 'Countable: data summary, compile a summary. The adjective means brief.' },
      collocations: ['the data summary', 'draft a summary', 'a written summary'],
      example: { en: 'The summary tables the weekly energy readings for both fleets.', zh: '摘要用表格列出两支车队的周能耗读数。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /ri/ 轻读。', en: 'Three syllables stressed first with a light final /ri/.' },
    },
    {
      term: 'battery', phonetic: '/ˈbætri/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '电池（车载储能装置，随年限容量下降）', en: 'the onboard device that stores charge and powers the electric bus' },
      usage: { zh: '可数名词；battery age、charge the battery。复数 batteries。', en: 'Countable: battery age, charge the battery. The plural is batteries.' },
      collocations: ['the age of each battery', 'battery age', 'a weaker battery'],
      example: { en: 'Record the battery age so older vehicles are not judged unfairly.', zh: '记录电池年龄，避免对旧车不公评判。' },
      listening: { zh: '两个或三个音节均可，重音在第一音节。', en: 'Two or three syllables, stressed on the first.' },
    },
    {
      term: 'mileage', phonetic: '/ˈmaɪlɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '里程（车辆行驶的公里数记录）', en: 'the distance a vehicle has travelled, recorded in kilometres' },
      usage: { zh: '不可数；winter mileage、weekly mileage。由 mile 加 -age 构成。', en: 'Uncountable: winter mileage, weekly mileage. Built from mile plus age.' },
      collocations: ['seasonal mileage', 'daily mileage', 'low mileage'],
      example: { en: 'Compare mileage in cold months with mileage in warm months.', zh: '把寒冷月份的里程与温暖月份对比。' },
      listening: { zh: '双音节，重音在第一音节，/dʒ/ 是软腭音。', en: 'Two syllables stressed first with a soft /dʒ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'match the running costs', sentenceIndex: 0,
      meaning: { zh: '与运行成本持平，成本相当', en: 'to reach the same ongoing costs as the buses being replaced' },
      usage: { zh: 'match 作及物动词；running costs 指能耗、维护等持续费用。', en: 'Match is transitive; running costs are ongoing energy and maintenance expenses.' },
      example: { en: 'The study asks whether electric buses match the old running costs.', zh: '研究要回答电动公交能否与旧车运行成本持平。' },
    },
    {
      phrase: 'like with like', sentenceIndex: 3,
      meaning: { zh: '同类相比，口径一致地比较', en: 'to compare items measured under the same conditions' },
      usage: { zh: '固定短语；compare like with like，常见于数据分析讨论。', en: 'Fixed phrase: compare like with like, common in data discussions.' },
      example: { en: 'Compare like with like before drawing any conclusion about cost.', zh: '得出成本结论前先做到同类相比。' },
    },
    {
      phrase: 'speak for', sentenceIndex: 22,
      meaning: { zh: '（数据）能代表某一群体的情况', en: 'for figures to represent what a whole fleet or group is like' },
      usage: { zh: 'cannot speak for either fleet 指数据不能推广到全体。', en: 'Cannot speak for either fleet means the results do not generalise.' },
      example: { en: 'A single depot cannot speak for the whole council fleet.', zh: '单个车管站的数据不能代表全城车队。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 24,
      meaning: { zh: '并排对照，逐项放在一起比较', en: 'placed together so two sets of figures can be compared directly' },
      usage: { zh: '状语短语；compare the fleets side by side。', en: 'Adverbial: compare the fleets side by side.' },
      example: { en: 'Sonia puts the two depot records side by side in one table.', zh: 'Sonia 把两个车管站的记录并排在一张表里。' },
    },
    {
      phrase: 'plugs in', sentenceIndex: 25,
      meaning: { zh: '插上充电枪，接入电源', en: 'to connect a bus to the charger with a cable' },
      usage: { zh: 'separable phrasal verb；plug the bus in，三单形式 plugs in。', en: 'Separable phrasal verb: plug the bus in; the third person is plugs in.' },
      example: { en: 'The schedule records when each bus plugs in after its route.', zh: '排班记录每趟线路后车辆何时插枪。' },
    },
    {
      phrase: 'wears the battery', sentenceIndex: 42,
      meaning: { zh: '损耗电池，缩短电池寿命', en: 'to reduce battery life through repeated strain or overcharging' },
      usage: { zh: 'wear 作动词表示磨损；wear the battery、wear out a part。', en: 'Wear means to erode through use: wear the battery, wear out a part.' },
      example: { en: 'Overcharging the bus every trip wears the battery faster.', zh: '每趟都充满会更快损耗电池。' },
    },
    {
      phrase: 'whole cost of ownership', sentenceIndex: 44,
      meaning: { zh: '全生命周期拥有成本', en: 'the total cost of buying, running and maintaining a vehicle' },
      usage: { zh: '商业分析固定说法；include the whole cost of ownership。', en: 'Fixed business phrase: include the whole cost of ownership.' },
      example: { en: 'Maintenance must count toward the whole cost of ownership.', zh: '维护费用必须计入全生命周期拥有成本。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先认声音和名字', en: 'Match voices to names early' },
      body: {
        zh: 'Part 3 配对题考分工。开场把导师、Sonia、Ava 的声音和名字对上；听到 I can…、I’ll… 这类认领句，先记说话人，再记任务内容。',
        en: 'Part 3 matching asks who does what. Match the tutor, Sonia and Ava to their voices at the start. When you hear I can… or I’ll…, note the speaker first and the task second.',
      },
    },
    {
      title: { zh: '注意中途改主意', en: 'Watch for the last-minute change' },
      body: {
        zh: 'Ava 句 27 先提议自己写摘要，Sonia 句 28 用 Actually 提出换人，导师句 29 确认。Actually、could I、instead 之后往往是最终分工，早先认领可能被替换。',
        en: 'Ava offers to draft the summary first in sentence 27, then Sonia changes it with Actually in sentence 28, and the tutor confirms in sentence 29. After Actually, could I or instead, the final allocation often replaces the earlier one.',
      },
    },
    {
      title: { zh: '多选题用否定句排干扰', en: 'Reject options with the negative' },
      body: {
        zh: '多选三个正确项对应三条口径；其余三项都被导师明确否定：I would avoid that、No, you must include、Definitely not。听到否定句，在对应选项旁划掉。',
        en: 'Three options are valid criteria; the rest are explicitly rejected: I would avoid that, No, you must include and Definitely not. Cross out an option when you hear the negative sentence.',
      },
    },
  ],
};
