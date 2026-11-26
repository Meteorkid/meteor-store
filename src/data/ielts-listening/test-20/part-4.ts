import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 20 · Part 4 — 排队的数学（单人讲座，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：到达过程与服务率（笔记 31–35）→ 缩短等待感知的因素（多选 36–37）→
 * 队列成因、单台服务台代价与柜台配置（单选 38–40）。
 */
export const test20Part4: ListeningLesson = {
  slug: 'test-20-part-4',
  part: 4,
  status: 'published',
  title: { zh: '排队的数学', en: 'The mathematics of queues' },
  summary: {
    zh: '讲座讲解排队论：顾客到达服从泊松随机过程，到达超过服务率时队伍增长，增设柜台可显著缩短等待；顾客按感知时间判断等待长短，排班在高峰时段开放柜台；再讨论突发到达、单台服务台的口碑代价与柜台数量的配置依据。',
    en: 'The lecture covers queueing theory: arrivals follow a random Poisson process, the line grows when arrivals outpace the service rate, extra counters cut waiting, shoppers judge the wait by perceived time, and counters are scheduled at peak periods. It then covers bursty arrivals, the goodwill cost of one slow server, and how counter numbers are chosen.',
  },
  accent: { zh: '讲者为加拿大口音，讲座语速平稳，段落之间有停顿。', en: 'The lecturer speaks with a Canadian accent at a steady pace, with pauses between sections.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Arrival pattern: a random process named after a mathematician, called a', cells: [[{ blank: 31 }]] },
        { lead: 'Queue grows when arrivals outpace the', cells: [[{ blank: 32 }, { text: ' rate' }]] },
        { lead: 'Adding one more', cells: [[{ blank: 33 }, { text: ' reduces waiting sharply' }]] },
        { lead: 'Shoppers judge the wait by the', cells: [[{ blank: 34 }, { text: ' time' }]] },
        { lead: 'Staff counters at', cells: [[{ blank: 35 }, { text: ' periods of the day' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO factors make a wait feel shorter to customers? Choose TWO letters, A–E.',
      select: 2,
      stem: 'Which TWO factors make a wait feel shorter to customers?',
      options: [
        { key: 'A', text: 'Clear signs showing the estimated wait' },
        { key: 'B', text: 'Fewer chairs in the waiting area' },
        { key: 'C', text: 'A staff member explaining the delay' },
        { key: 'D', text: 'Longer opening hours' },
        { key: 'E', text: 'Free samples at the counter' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why do queues sometimes form even when the system looks underused?',
          options: [
            { key: 'A', text: 'Arrivals come in bursts rather than a steady stream' },
            { key: 'B', text: 'Customers refuse to join the shorter lane' },
            { key: 'C', text: 'The counters are too narrow for the goods' },
          ],
        },
        {
          number: 39,
          stem: 'What is the main cost of a single slow server?',
          options: [
            { key: 'A', text: 'The equipment wears out quickly' },
            { key: 'B', text: 'Lost goodwill that reduces return visits' },
            { key: 'C', text: 'The staff must work overtime every night' },
          ],
        },
        {
          number: 40,
          stem: 'How do managers choose the number of counters?',
          options: [
            { key: 'A', text: 'By copying the busiest shop in the city' },
            { key: 'B', text: 'From arrival rate, service time and target wait together' },
            { key: 'C', text: 'By opening every counter all day long' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['Poisson'], evidence: 2,
      explanation: {
        zh: '定位句 2：The arrivals follow a random pattern called a Poisson process, named after the French mathematician。到达模式是泊松过程，填 Poisson。',
        en: 'Sentence 2: arrivals follow "a Poisson process, named after the French mathematician", so fill Poisson.',
      },
    },
    {
      number: 32, accepted: ['service'], evidence: 5,
      explanation: {
        zh: '定位句 5：A queue forms whenever the number of arrivals outpaces the service rate。队伍在到达超过服务率时形成，填 service；题干已印 rate。',
        en: 'Sentence 5: a queue forms when arrivals outpace the service rate, so fill service; rate is already printed.',
      },
    },
    {
      number: 33, accepted: ['counter'], evidence: 8,
      explanation: {
        zh: '定位句 8：Adding one more counter cuts the average waiting time sharply。增设一个柜台显著缩短等待，填 counter。',
        en: 'Sentence 8: "adding one more counter cuts the average waiting time sharply", so fill counter.',
      },
    },
    {
      number: 34, accepted: ['perceived'], evidence: 13,
      explanation: {
        zh: '定位句 13：Shoppers judge the wait by the perceived time, not only the clock reading。顾客按感知时间判断等待，填 perceived。',
        en: 'Sentence 13: shoppers judge the wait by "the perceived time", not the clock reading, so fill perceived.',
      },
    },
    {
      number: 35, accepted: ['peak'], evidence: 15,
      explanation: {
        zh: '定位句 15：Scheduling can open extra counters at peak periods of the day。排班在高峰时段加开柜台，填 peak。句 16 的 morning and lunch 是高峰例子。',
        en: 'Sentence 15: scheduling opens extra counters "at peak periods of the day", so fill peak. Morning and lunch in sentence 16 are examples.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Clear signs showing the estimated wait help people plan their patience。写明预计等待时间的标识让等待显得更短，对应 A。',
        en: 'Sentence 19: "clear signs showing the estimated wait help people plan their patience", matching A.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 20,
      explanation: {
        zh: '定位句 20：A staff member explaining the delay also softens the frustration。工作人员解释延误能缓解烦躁，对应 C。座椅、营业时间、试吃样品都被后文排除。',
        en: 'Sentence 20: "a staff member explaining the delay also softens the frustration", matching C. Chairs, opening hours and samples are ruled out later.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：That happens because arrivals come in bursts rather than a steady stream。看似有余量却排队，是因为到达呈突发脉冲而非平稳人流，对应 A。',
        en: 'Sentence 25: it happens because arrivals "come in bursts rather than a steady stream", matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：The main cost is lost goodwill, which shows up later in fewer return visits。单台慢服务台的主要代价是口碑流失、回头客减少，对应 B。',
        en: 'Sentence 30: "the main cost is lost goodwill", later showing in fewer return visits, matching B.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：They estimate the arrival rate, the service time per person, and the target wait。柜台数量由到达率、单人服务时间和目标等待三者共同决定，对应 B。',
        en: 'Sentence 32: managers estimate "the arrival rate, the service time per person, and the target wait" together, matching B.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'On an ordinary morning, a single checkout counter can serve about sixty shoppers an hour.' },
    { speaker: 'lecturer', text: 'Yet the line outside rarely stays even, because people do not arrive in neat groups.' },
    { speaker: 'lecturer', text: 'The arrivals follow a random pattern called a Poisson process, named after the French mathematician.' },
    { speaker: 'lecturer', text: 'In that model, each minute carries a small chance of one customer walking in.' },
    { speaker: 'lecturer', text: 'The chance does not depend on who arrived in the minute before.' },
    { speaker: 'lecturer', text: 'A queue forms whenever the number of arrivals outpaces the service rate.' },
    { speaker: 'lecturer', text: 'If the counter can clear forty people an hour and sixty arrive, the line grows.' },
    { speaker: 'lecturer', text: 'The gap between those two numbers decides how fast the waiting pile rises.' },
    { speaker: 'lecturer', text: 'Adding one more counter cuts the average waiting time sharply.' },
    { speaker: 'lecturer', text: 'Two servers share the load, and neither line grows as fast as the single one did.' },
    { speaker: 'lecturer', text: 'The split works best when customers choose either counter freely.' },
    { speaker: 'lecturer', text: 'A fixed rule that sends people to the right lane only can leave the left idle.' },
    { speaker: 'lecturer', text: 'Queuing theory also studies how the wait feels to the person standing there.' },
    { speaker: 'lecturer', text: 'Shoppers judge the wait by the perceived time, not only the clock reading.' },
    { speaker: 'lecturer', text: 'A wait that seems explained feels shorter than the same silence.' },
    { speaker: 'lecturer', text: 'Scheduling can open extra counters at peak periods of the day.' },
    { speaker: 'lecturer', text: 'Morning and lunch bring bursts of arrivals that a steady staff level cannot absorb.' },
    { speaker: 'lecturer', text: 'Managers close some counters again once the rush settles.' },
    { speaker: 'lecturer', text: 'Now, what makes a wait feel shorter rather than longer?' },
    { speaker: 'lecturer', text: 'Clear signs showing the estimated wait help people plan their patience.' },
    { speaker: 'lecturer', text: 'A staff member explaining the delay also softens the frustration.' },
    { speaker: 'lecturer', text: 'By contrast, an empty chair beside the queue does nothing for the mood.' },
    { speaker: 'lecturer', text: 'Longer opening hours spread the crowd but do not shorten a busy line.' },
    { speaker: 'lecturer', text: 'Free samples are a nice gesture, but they do not change the queue model.' },
    { speaker: 'lecturer', text: 'Some queues form even when the system looks underused at first glance.' },
    { speaker: 'lecturer', text: 'That happens because arrivals come in bursts rather than a steady stream.' },
    { speaker: 'lecturer', text: 'A slow minute can leave a counter idle, while the next minute brings six people.' },
    { speaker: 'lecturer', text: 'The uneven load means spare capacity does not always show as an empty line.' },
    { speaker: 'lecturer', text: 'A single slow server carries the whole waiting risk on its own.' },
    { speaker: 'lecturer', text: 'Every delay passes straight to the next customer, with no second lane to absorb it.' },
    { speaker: 'lecturer', text: 'The main cost is lost goodwill, which shows up later in fewer return visits.' },
    { speaker: 'lecturer', text: 'Managers choose the number of counters from three numbers together.' },
    { speaker: 'lecturer', text: 'They estimate the arrival rate, the service time per person, and the target wait.' },
    { speaker: 'lecturer', text: 'Too few counters leave the line long; too many leave staff standing idle.' },
    { speaker: 'lecturer', text: 'The balance shifts with the day, so the plan is reviewed each season.' },
    { speaker: 'lecturer', text: 'Early researchers first studied queues at telephone exchanges.' },
    { speaker: 'lecturer', text: 'Operators had to connect calls by hand, and a jam meant missed connections.' },
    { speaker: 'lecturer', text: 'The same math later moved into banks, shops and call centres.' },
    { speaker: 'lecturer', text: 'In a call centre, the line is the number of callers holding on the phone.' },
    { speaker: 'lecturer', text: 'Each agent works through a scripted set of questions before moving on.' },
    { speaker: 'lecturer', text: 'Queuing models also help schedule buses and lift cars in tall buildings.' },
    { speaker: 'lecturer', text: 'A lift that waits too long on the top floor irritates the people below.' },
    { speaker: 'lecturer', text: 'The theory weighs how often each floor calls and how long the ride takes.' },
    { speaker: 'lecturer', text: 'Simulation runs many random days before a timetable is fixed.' },
    { speaker: 'lecturer', text: 'The model cannot remove randomness, but it can keep the worst waits bounded.' },
    { speaker: 'lecturer', text: 'A bounded wait means the line rarely grows beyond a set length.' },
    { speaker: 'lecturer', text: 'That bound protects the customer experience during the busiest hour.' },
    { speaker: 'lecturer', text: 'Staff who understand the model can explain why a counter opens when it does.' },
    { speaker: 'lecturer', text: 'Customers, in turn, are less likely to read a short delay as bad service.' },
    { speaker: 'lecturer', text: 'The next session looks at how data from real shops feeds these formulas.' },
    { speaker: 'lecturer', text: 'We will compare one store’s morning records with the textbook averages.' },
  ],
  vocabulary: [
    {
      term: 'queue', phonetic: '/kjuː/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '排队，等待队列', en: 'the line of customers waiting for service' },
      usage: { zh: '可数；form a queue、join the queue。动词 queue up。', en: 'Countable: form a queue; the verb is queue up.' },
      collocations: ['form a queue', 'the waiting queue', 'a long queue'],
      example: { en: 'The queue grows when arrivals outpace service.', zh: '到达超过服务时队伍变长。' },
      listening: { zh: '单音节，字母 ue 发 /juː/。', en: 'One syllable; ue sounds /juː/.' },
    },
    {
      term: 'arrivals', phonetic: '/əˈraɪvlz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '到达（顾客），到达人数', en: 'a customer walking in; the rate of incoming people' },
      usage: { zh: '可数/不可数；the arrival rate、late arrivals。动词 arrive。', en: 'Countable or uncountable; the verb is arrive.' },
      collocations: ['the arrival rate', 'customer arrivals', 'a late arrival'],
      example: { en: 'Arrivals come in bursts during lunch.', zh: '午餐时段到达呈突发。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈraɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'perceived', phonetic: '/pəˈsiːvd/', partOfSpeech: 'adj.', sentenceIndex: 13,
      meaning: { zh: '感知到的，主观感受到的', en: 'felt or judged by the customer, not measured by the clock' },
      usage: { zh: 'perceived time、perceived wait。动词 perceive 的过去分词作形容词。', en: 'Perceived time or wait; from the verb perceive.' },
      collocations: ['the perceived time', 'perceived wait', 'perceived value'],
      example: { en: 'The perceived wait can feel longer than it is.', zh: '感知到的等待可能比实际长。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈsiː/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'scheduling', phonetic: '/ˈʃedjuːlɪŋ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '排班，时间安排', en: 'planning when counters and staff are on duty' },
      usage: { zh: '不可数；staff scheduling、the scheduling plan。动词 schedule。', en: 'Uncountable; the verb is schedule.' },
      collocations: ['staff scheduling', 'the scheduling plan', 'flexible scheduling'],
      example: { en: 'Scheduling opens counters at peak periods.', zh: '排班在高峰时段开柜。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈʃed/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'bursts', phonetic: '/bɜːsts/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '突发（人流），一阵脉冲', en: 'a short sudden group of arrivals after a quiet spell' },
      usage: { zh: '可数；arrivals in bursts、a burst of people。', en: 'Countable: arrivals in bursts, a burst of people.' },
      collocations: ['a burst of arrivals', 'in bursts', 'the morning burst'],
      example: { en: 'Lunch brings bursts of arrivals.', zh: '午餐带来一阵阵人流。' },
      listening: { zh: '单音节，与 first 尾韵相同。', en: 'One syllable, rhyming with first.' },
    },
    {
      term: 'idle', phonetic: '/ˈaɪdl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '闲置的，未在服务的', en: 'not busy, with no customer to serve' },
      usage: { zh: 'an idle counter、stand idle。动词 idle 指空转。', en: 'An idle counter; staff stand idle.' },
      collocations: ['an idle server', 'stand idle', 'idle capacity'],
      example: { en: 'The left lane can stand idle under a fixed rule.', zh: '固定规则下左道可能闲置。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'simulation', phonetic: '/ˌsɪmjuˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 43,
      meaning: { zh: '模拟，仿真运行', en: 'running many random days in a model before a plan' },
      usage: { zh: '可数/不可数；run a simulation、the simulation model。动词 simulate。', en: 'Countable or uncountable; the verb is simulate.' },
      collocations: ['run a simulation', 'the queue simulation', 'a simulation model'],
      example: { en: 'Simulation tests many random days.', zh: '模拟运行许多随机日。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'outpaces', sentenceIndex: 5,
      meaning: { zh: '超过，快于（服务能力）', en: 'to exceed or run faster than the service rate' },
      usage: { zh: '动词；outpace the service rate，指到达人数超过处理速度。', en: 'Outpace the service rate; arrivals outpace capacity.' },
      example: { en: 'Arrivals outpace the service rate and the line grows.', zh: '到达超过服务率，队伍变长。' },
    },
    {
      phrase: 'cuts the average waiting time', sentenceIndex: 8,
      meaning: { zh: '缩短平均等待时间', en: 'to reduce the average time people stand in line' },
      usage: { zh: '动宾短语；cut the waiting time in half，指增设柜台后排队变短。', en: 'Cut the waiting time in half; cut the average wait.' },
      example: { en: 'A second counter cuts the waiting time sharply.', zh: '第二个柜台大幅缩短等待。' },
    },
    {
      phrase: 'underused', sentenceIndex: 24,
      meaning: { zh: '未充分利用的，看着有余量的', en: 'appearing to have spare capacity, though queues still form' },
      usage: { zh: '形容词；an underused system、look underused，指表面上人手或柜台有余。', en: 'An underused system; look underused.' },
      example: { en: 'The system looks underused, yet queues still form.', zh: '系统看着有余量，队列却仍在。' },
    },
    {
      phrase: 'lost goodwill', sentenceIndex: 30,
      meaning: { zh: '口碑流失，顾客好感损失', en: 'the damaged trust and warmth that brings fewer return visits' },
      usage: { zh: '名词短语；the main cost is lost goodwill，指久等造成的信任损伤。', en: 'The main cost is lost goodwill; win back goodwill.' },
      example: { en: 'Long waits cause lost goodwill over time.', zh: '久等久而久之损伤口碑。' },
    },
    {
      phrase: 'feeds these formulas', sentenceIndex: 49,
      meaning: { zh: '（数据）代入公式', en: 'to supply real data into a theoretical model' },
      usage: { zh: '动宾短语；feed data into the formulas，指真实记录喂入排队模型。', en: 'Feed data into the formulas; real records feed the model.' },
      example: { en: 'Shop records feed the queueing formulas.', zh: '门店记录代入排队公式。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记抓过程与因果链', en: 'Trace the process and cause chain' },
      body: {
        zh: '笔记五空按讲座顺序：泊松随机过程、服务率、增设柜台、感知时间、高峰时段。听到 named after、service rate、one more counter、perceived、peak periods 直接落笔，别把 clock reading 当成 perceived 的同义答案。',
        en: 'The five notes follow the lecture: Poisson process, service rate, extra counter, perceived time, peak periods. Write at named after, service rate, one more counter, perceived and peak periods; do not take clock reading as the perceived answer.',
      },
    },
    {
      title: { zh: '多选区分感受因素与硬件条件', en: 'Separate perception factors from hardware' },
      body: {
        zh: '让等待显得更短的两项是等待时长标识和工作人员解释延误。座椅数量、营业时间、免费试吃都是被点名排除的条件；多选时先听帮助顾客规划耐心、softens frustration 这类感受词。',
        en: 'The two wait-feel factors are wait-time signs and staff explanations. Chairs, opening hours and samples are named exclusions. For multiple choice, listen for feeling words such as plan their patience and softens frustration.',
      },
    },
    {
      title: { zh: '单选定因果依据，不选常识项', en: 'Pick the stated cause, not common sense' },
      body: {
        zh: '看似闲置仍排队源于突发到达；单台慢服务台的主要代价是口碑流失；柜台数量由到达率、服务时间、目标等待三者共同决定。设备损耗、加班、照搬别家都没有在讲座中出现。',
        en: 'Underused-looking queues come from bursty arrivals; the one-server cost is lost goodwill; counter numbers come from arrival rate, service time and target wait. Equipment wear, overtime and copying rivals are not mentioned.',
      },
    },
  ],
};
