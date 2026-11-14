import type { IeltsPairSeed } from '@/lib/ielts/types';

/**
 * 雅思写作对照学习 · 批次 B（两组 Task 2）。
 *
 * 每组的高分版都是低分版的逐句升级：论点、论证顺序、例子与段落数完全一致，
 * 只改词汇、句式、衔接与任务回应的完整度。正文由 segments 推导，不另存全文。
 */
export const batchB: IeltsPairSeed[] = [
  {
    slug: 'task2-problem-solution-city-traffic',
    task: 'task2',
    category: 'problem-solution',
    topic: 'environment',
    status: 'published',
    sortOrder: 30,
    content: {
      prompt: {
        en: 'In many large cities, roads are becoming more and more crowded, and people are spending longer and longer travelling to work. What do you think are the main causes of this problem, and what measures could governments take to solve it?',
        zh: '题目要求说明大城市交通拥堵的主要原因，并提出政府可以采取的解决办法。问题解决题必须两个部分都写到：原因要能解释「为什么会堵」，措施要具体、可执行，最好还能说明措施为什么有效。',
      },
      title: {
        zh: '大城市交通拥堵：原因与对策（5 分 vs 8 分）',
        en: 'Urban Traffic Congestion: Causes and Solutions (Band 5 vs Band 8)',
      },
      bandLow: 5,
      bandHigh: 8,
      learning: {
        taskAnalysis: {
          zh: '这是一道双问型问题解决题：解释大城市拥堵与通勤变长的主要原因，再提出政府能够采取的措施。审题时圈出 main causes 和 governments，前者要求筛选并展开关键原因，后者限定措施的实施主体。本文依次写车辆需求增长、通勤偏好与道路管理，再写道路、公交和出行方式的调整。5 分示例能覆盖两问，但多处只列现象或建议；8 分改写改善了语言准确性和因果连接，仍可加强原因与对策的对应、政府的具体作用及结论的概括。阅读时分别检查任务回应、论证顺序、用词准确性和句法控制，不能用词汇变难或句子变长代替完整论证。',
          en: 'This problem-solution task asks two questions: what mainly causes urban congestion and longer commutes, and what governments can do about it. The words main causes require selection and explanation, while governments identifies the actor responsible for the proposed measures. The essay moves from growing car use, commuter preferences and road management to changes in roads, public transport and travel behaviour. The Band 5 example covers both questions but often lists points without developing them. The Band 8 rewrite improves accuracy and causal links; it could still connect each measure more closely to a cause, clarify government action and give a more specific conclusion. Assess task response, progression, precise vocabulary and sentence control separately: harder words or longer sentences do not replace an argument.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '引入拥堵问题并预告两项任务', en: 'Introduce congestion and signpost both questions' },
            analysis: {
              zh: '首段先交代拥堵加重，再预告分析原因与政府措施。5 分版的城市复数、主谓一致和 solution 单复数影响准确性；8 分版修正这些问题并明确行动主体。还可把笼统的写作预告改成核心判断，直接概括主要原因和优先方案。',
              en: 'The introduction establishes the growing problem and announces causes followed by government measures. The Band 5 version has errors in agreement and plural forms, including city and solution. The rewrite corrects these and names the responsible actor. A further improvement would replace the general essay announcement with a brief statement of the main causes and preferred response.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '解释车辆需求与道路条件如何造成拥堵', en: 'Explain demand for cars and limits in road conditions' },
            analysis: {
              zh: '本段由人口与公交供给转到个人出行选择，最后补充旧城区路窄和信号配时问题。8 分版用 keep pace、commuters 和 leaving 连接原因与后果，比低分版的重复列举更清楚；仍可选两项主因深入说明，避免三句同时塞入过多原因。',
              en: 'The paragraph moves from population growth and public transport provision to personal travel choices, then adds narrow roads and signal timing. Keep pace, commuters and the leaving clause make the causal relationships clearer than the repeated listing in the lower version. Selecting two main causes and developing them further would give the paragraph a stronger focus.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '提出措施并解释预期效果', en: 'Propose measures and explain their intended effects' },
            analysis: {
              zh: '三句分别提出提高道路容量、改善公交和鼓励步行骑行。8 分版把 better 具体化为 reliable，并用目的或结果结构解释措施为何有用。论证还可补上政府如何改善班次、票价和骑行条件，让建议具有实施内容，并说明扩路方案的适用范围。',
              en: 'The three sentences propose more road capacity, better public transport, and walking or cycling. The rewrite replaces better with reliable and uses purpose or result structures to explain the intended benefits. It could develop government actions through service frequency, fares or cycling provision, and explain the circumstances in which road expansion would help.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '确定优先措施并补充出行需求管理', en: 'Prioritise a measure and address travel demand' },
            analysis: {
              zh: '本段优先支持地铁投资，再补充每周一天居家办公。改写明确了 investment in 的对象和 staff 的指代；但 few commuters 预测过强，便捷地铁未必让开车者只剩少数。企业措施也应说明政府如何鼓励实施，才能紧扣题目限定的主体。',
              en: 'This paragraph prioritises subway investment and adds one day of home working. The rewrite clarifies the object of investment in and the reference to staff. However, few commuters makes a strong prediction: convenience alone does not establish that only a small number will drive. The company proposal also needs a link to how governments could encourage it.',
            },
          },
          {
            paragraph: 5,
            role: { zh: '回收原因与措施并给出收束判断', en: 'Summarise causes and measures in a closing judgement' },
            analysis: {
              zh: '结尾用 stems from 和 act on several fronts 回指前文，语言更准确。两版仍主要强调问题严重、未来可改善，没有概括具体答案。可用一句概括公交供需与道路条件，再用一句总结公共交通优先的综合应对。',
              en: 'The conclusion uses stems from and act on several fronts more accurately than it have and do more things. Both versions still focus on the seriousness of the problem and possible improvement without briefly restating the actual answers. A stronger closing could summarise transport demand and road conditions, then restate a combined response that prioritises public transport.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '把模糊评价改成可解释的关系', en: 'Replace vague judgements with an explanatory relationship' },
            explanation: {
              zh: '原句用 public transport is not good enough 表达不满，改写用 has failed to keep pace 指出供给跟不上增长。学习重点是先确认“不够好”具体指什么，再选择词组表达。本句已经建立供需关系；若继续展开，可说明班次或覆盖不足如何影响通勤选择，使词汇精确度服务于原因解释。',
              en: 'The original says public transport is not good enough; has failed to keep pace specifies a gap between provision and growth. First identify what inadequate means in the argument, then choose an expression for that relationship. This sentence establishes a demand-provision link. An explanation of service frequency or coverage could then show how the gap affects commuting choices.',
            },
            segmentIndex: 2,
          },
          {
            title: { zh: '让比较双方保持相同语法形式', en: 'Keep the two sides of a comparison parallel' },
            explanation: {
              zh: 'prefer driving to taking 把两个出行选择都写成动名词，修正原句 than take 的形式问题。这里的 to 是介词，因此后接 taking。比较句还用 feels 和 often 标明个人感受与频率，避免把舒适和速度写成无条件事实。可借用这一骨架比较其他选择，但理由必须与题目相关。',
              en: 'Prefer driving to taking places both travel options in parallel gerund forms and avoids the faulty than take construction. To is a preposition in this pattern, so taking follows it. Feels and often also distinguish a perceived benefit from a universal fact. The structure can be reused for other comparisons, provided the reasons remain relevant to the task.',
            },
            segmentIndex: 3,
          },
          {
            title: { zh: '用分词结构连接清楚的结果', en: 'Use a participle clause for a clearly linked result' },
            explanation: {
              zh: 'leaving drivers waiting 把“道路窄、信号配时差”与“司机长时间等待”放进同一条因果链。leaving 后的宾语是 drivers，waiting 描述司机持续处于等待状态。学习时先确认结果确由前面情形引出，再压缩成分词结构；若因果关系尚未解释，增加一个长结构也不会让论证自动成立。',
              en: 'Leaving drivers waiting connects narrow roads and poor signal timing with prolonged waiting. Drivers is the object of leaving, and waiting describes the continuing situation of those drivers. Confirm that the result follows from the preceding situation before compressing it into a participle clause. A longer structure cannot supply a missing causal explanation.',
            },
            segmentIndex: 4,
          },
          {
            title: { zh: '把政策写成行动、对象与目的', en: 'Connect a policy action, its target and its purpose' },
            explanation: {
              zh: 'cheaper and more reliable 指明公交改善的两个维度，so that 引出希望改变的通勤行为。相比 more better，这种写法修复语法并增加信息。不过 are willing 只是预期意愿；继续论证可写清改善班次或准点率的措施，以及这些变化为何会影响驾车者的选择。',
              en: 'Make public transport cheaper and more reliable identifies the target and two dimensions of improvement; so that introduces the desired change in commuting behaviour. This both fixes more better and adds information. Willingness remains an intended outcome. Further development could explain changes to service frequency or punctuality and why drivers would respond to them.',
            },
            segmentIndex: 6,
          },
        ],
        mistakes: [
          {
            zh: '基础形式先于词汇替换：many big city、too many car 和 some solution 都需要复数；congestion 是不可数名词，作主语时搭配单数动词。先检查名词数量与主谓一致，再考虑用词变化。',
            en: 'Fix basic forms before varying vocabulary: many big city, too many car and some solution need plural nouns. Congestion is uncountable and takes a singular verb. Check number and agreement before seeking alternative expressions.',
          },
          {
            zh: 'more better 是双重比较级。可直接用 better；若想增加信息，就像改写那样写 more reliable。后者的价值在于说明具体改善方向，而不是所有比较级都要换成更长的词组。',
            en: 'More better is a double comparative. Better alone is grammatical; more reliable is useful when reliability is the intended improvement. The advantage is greater precision, not a rule that every comparative should become a longer phrase.',
          },
          {
            zh: '题目问政府措施，Companies could allow staff to work from home 还需要交代政府的作用。可以补充政府如何鼓励雇主采用弹性安排，并说明这如何减少高峰通勤；只换成 Companies 并未完成任务主体的衔接。',
            en: 'The question asks for government measures, so Companies could allow staff to work from home needs a government link. Explain how authorities could encourage flexible arrangements and how these would reduce peak-hour travel. The subject Companies alone does not establish that connection.',
          },
          {
            zh: 'Once 不天然优于 if；它把条件的实现写得更确定。few commuters 也比原来的 many people will not use 更强，不能只因句子流畅就认定判断更准确。练习时可用 could encourage more commuters to use the subway 表达有条件的预期。',
            en: 'Once is not inherently better than if: it treats the condition as more certain to occur. Few commuters also makes a stronger claim than many people will not use. Fluency does not establish accuracy. A cautious practice alternative is could encourage more commuters to use the subway.',
          },
        ],
        vocabulary: [
          {
            term: 'congestion',
            partOfSpeech: 'uncountable noun',
            meaning: { zh: '交通拥堵；道路上的车辆过多而难以通行', en: 'A condition in which too much traffic prevents easy movement.' },
            usage: { zh: '谈一般拥堵现象时通常不可数，可说 traffic congestion；一次具体堵车可说 a traffic jam。不要写 a congestion 或 congestions 来指本篇现象。', en: 'Use congestion as an uncountable noun for the general traffic problem. A traffic jam can describe an individual occurrence. Avoid a congestion or congestions in this context.' },
            collocations: ['traffic congestion', 'ease congestion', 'reduce congestion'],
            example: { en: 'More frequent buses could help reduce congestion during the morning rush hour.', zh: '增加公交班次有助于缓解早高峰的交通拥堵。' },
            segmentIndex: 0,
          },
          {
            term: 'mounting pressure',
            partOfSpeech: 'noun phrase',
            meaning: { zh: '不断增加的压力', en: 'Pressure that is increasing over time.' },
            usage: { zh: 'mounting 在这里作形容词修饰 pressure。under pressure to do something 表示面临采取某行动的压力；pressure 在此通常不可数。', en: 'Mounting modifies pressure as an adjective. Under pressure to do something describes pressure to take an action. Pressure is normally uncountable in this use.' },
            collocations: ['under mounting pressure', 'face mounting pressure', 'mounting pressure to act'],
            example: { en: 'The council is under mounting pressure to improve local bus services.', zh: '市政委员会面临越来越大的压力，需要改善当地公交服务。' },
            segmentIndex: 0,
          },
          {
            term: 'keep pace',
            partOfSpeech: 'verb phrase',
            meaning: { zh: '跟上增长或变化的速度', en: 'To develop or move as quickly as something else.' },
            usage: { zh: '比较对象明确时用 keep pace with + 名词；上下文已给出对象时可以省略 with 短语。本句 failed to 后接动词原形 keep。', en: 'Use keep pace with followed by a noun when naming the comparison. The with phrase can be omitted when the context supplies it. Failed to takes the base form keep.' },
            collocations: ['keep pace with demand', 'keep pace with population growth', 'fail to keep pace'],
            example: { en: 'Bus services need to keep pace with the growth of the suburbs.', zh: '公交服务需要跟上郊区扩张的步伐。' },
            segmentIndex: 2,
          },
          {
            term: 'commuters',
            partOfSpeech: 'plural countable noun',
            meaning: { zh: '经常往返于住处和工作地点的通勤者', en: 'People who regularly travel between home and work.' },
            usage: { zh: '单数为 a commuter，复数 commuters。该词不限定开车者，也包括乘公交、坐地铁或骑车上班的人；描述群体时用方式或地点修饰即可。', en: 'Use a commuter for one person and commuters for more than one. The word does not imply driving: it includes people travelling by bus, train or bicycle.' },
            collocations: ['daily commuters', 'rail commuters', 'commuters travelling into the city'],
            example: { en: 'Many commuters change trains at the central station.', zh: '许多通勤者在中央车站换乘。' },
            segmentIndex: 3,
          },
          {
            term: 'road capacity',
            partOfSpeech: 'noun phrase',
            meaning: { zh: '道路可容纳或通过车辆的能力', en: 'The amount of traffic a road system can accommodate.' },
            usage: { zh: 'capacity 在这个语境表示容量，通常不可数；用 increase、expand 或 reduce 表示容量变化。它描述道路能力，不能单独说明实际拥堵必然下降。', en: 'Capacity is normally uncountable in this sense. Use increase, expand or reduce for changes in capacity. The phrase describes what roads can accommodate; it does not itself establish a reduction in congestion.' },
            collocations: ['expand road capacity', 'increase road capacity', 'limited road capacity'],
            example: { en: 'The proposal would increase road capacity near the airport.', zh: '这项方案将提高机场附近道路的通行能力。' },
            segmentIndex: 5,
          },
          {
            term: 'reliable',
            partOfSpeech: 'adjective',
            meaning: { zh: '可靠的；在这里指公交服务稳定、可预期', en: 'Consistent and dependable, here describing a transport service.' },
            usage: { zh: '可放在名词前，如 a reliable service，也可作表语，如 buses are reliable；比较级为 more reliable。与便宜不同，它关注服务是否值得信赖。', en: 'Use reliable before a noun, as in a reliable service, or after a linking verb, as in buses are reliable. Its comparative is more reliable. It describes dependability rather than price.' },
            collocations: ['reliable public transport', 'a reliable service', 'more reliable buses'],
            example: { en: 'Workers need a reliable bus service if they are to leave their cars at home.', zh: '上班族需要可靠的公交服务，才有条件把汽车留在家中。' },
            segmentIndex: 6,
          },
          {
            term: 'strain',
            partOfSpeech: 'noun',
            meaning: { zh: '系统因需求过多而承受的压力或负荷', en: 'Pressure placed on a system by heavy demands.' },
            usage: { zh: '常用 strain on something 指某系统承受的负担；ease the strain on 表示减轻负担，put a strain on 表示造成压力。本句谈道路需求，不是身体拉伤。', en: 'Strain on something names the system under pressure. Ease the strain on means reduce that pressure; put a strain on means create it. Here strain concerns road demand, not a physical injury.' },
            collocations: ['ease the strain on roads', 'put a strain on services', 'reduce the strain on infrastructure'],
            example: { en: 'Flexible working hours could ease the strain on the transport network.', zh: '弹性工作时间可以减轻交通网络的负荷。' },
            segmentIndex: 10,
          },
          {
            term: 'stems from',
            partOfSpeech: 'phrasal verb, third-person singular',
            meaning: { zh: '源于；由某个原因引起', en: 'Originates in or is caused by something.' },
            usage: { zh: '用 stem from + 名词或动名词表示来源，前面主语是结果。congestion 是单数概念，所以用 stems；不要把原因放在主语位置而颠倒因果。', en: 'Use stem from followed by a noun or gerund to name the source. The subject is the result. Congestion takes the singular form stems; keep the direction of causation clear.' },
            collocations: ['stem from a lack of investment', 'stem from poor planning', 'stem from several causes'],
            example: { en: 'Some delays stem from poor coordination between bus and train services.', zh: '部分延误源于公交和列车服务之间缺乏良好协调。' },
            segmentIndex: 11,
          },
        ],
      },
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, traffic congestion become a very serious problem in many big city, and many people think the government should do something about it.',
          high: 'Traffic congestion has grown into a serious problem in many large cities, and governments are under mounting pressure to act.',
          translationZh: {
            low: '如今，交通拥堵成了许多大城市一个非常严重的问题，许多人认为政府应该为此做点什么。',
            high: '交通拥堵已逐渐成为许多大城市的严重问题，各地政府面临着越来越大的行动压力。',
          },
          focus: ['accuracy', 'lexis'],
          note: {
            zh: '主谓一致修正：congestion 是单数，become → has grown into，并换成现在完成时，说明问题一直在恶化；many big city → many large cities 修掉复数与搭配；do something about it → are under mounting pressure to act，把「有人觉得该管管」写成政府面对的现实压力，回应任务更实。',
            en: 'Fixed subject-verb agreement and the plural error (many big city). The present perfect “has grown into” shows a trend over time, and “are under mounting pressure to act” turns a vague opinion into a concrete situation that the task asks about.',
          },
        },
        {
          paragraph: 1,
          low: 'In this essay, I will talk about the reasons of this problem and give some solution.',
          high: 'This essay will examine the main causes of the problem and then suggest practical measures that governments could take to reduce it.',
          translationZh: {
            low: '本文将讨论这个问题的原因，并提出一些解决办法。',
            high: '本文将分析这一问题的主要原因，然后提出政府可以采取的切实措施，以减轻这一问题。',
          },
          focus: ['task', 'grammar'],
          note: {
            zh: '介词搭配修正：reasons of → the main causes of，并用 main 限定范围；some solution → practical measures，改复数并加上 practical，把「随便给点办法」升级成「可执行的措施」；examine … and then suggest 用并列动词预告原因与措施两个部分；that 从句把措施绑到 governments 这个行为者上。',
            en: '“Reasons of” is a preposition error; “the main causes of” is the correct collocation. “Some solution” becomes the plural, concrete “practical measures”, and the relative clause “that governments could take” ties the measures to an agent, so both parts of the question are clearly signposted.',
          },
        },
        {
          paragraph: 2,
          low: 'Firstly, there are too many car in the city because the number of people is increasing very fast, and the public transport is not good enough.',
          high: 'One major cause is the sheer number of private cars, which keeps rising as urban populations grow, while public transport has failed to keep pace.',
          translationZh: {
            low: '首先，城市里的汽车太多，因为人口增长很快，而且公共交通不够好。',
            high: '一个主要原因是私家车数量庞大，而且随着城市人口增长还在不断增加，公共交通却未能跟上这一增长。',
          },
          focus: ['accuracy', 'lexis'],
          note: {
            zh: 'too many car → the sheer number of private cars：修正复数，并明确是私家车；the number of people is increasing very fast → urban populations grow，用简洁的主谓结构陈述人口增长，这里不是名词化；is not good enough → has failed to keep pace，指出公交供给没有跟上增长。which 指代单数 number，所以用 keeps。',
            en: 'The rewrite fixes the plural in “too many car” and specifies private cars. “Urban populations grow” is a concise subject-verb clause, not nominalisation. “Has failed to keep pace” identifies a gap between provision and growth. “Which” refers to the singular “number”, so its verb is “keeps”.',
          },
        },
        {
          paragraph: 2,
          low: 'Secondly, many people like to drive their own car to work because it is more comfortable and faster than take the bus or the subway.',
          high: 'A second factor is that many commuters prefer driving to taking the bus or the subway, as a car of their own feels more comfortable and is often quicker.',
          translationZh: {
            low: '其次，许多人喜欢开自己的车上班，因为这比坐公交或地铁更舒适，也更快。',
            high: '第二个因素是，许多通勤者更愿意开车，而不是乘坐公交或地铁，因为开自己的车感觉更舒适，而且往往更快。',
          },
          focus: ['accuracy', 'grammar', 'lexis'],
          note: {
            zh: 'than take → prefer driving to taking：修正比较句里的动词形式，改用 prefer A to B 的固定结构，两个动名词并列；people who drive to work → commuters，一个词替代整个短语；their own car 的复数问题用 a car of their own 化解；faster → is often quicker，加 often 让概括留有余地。',
            en: '“Than take” is ungrammatical; the gerund pattern “prefer driving to taking” fixes it and keeps the two options parallel. “Commuters” replaces the wordy description of people who drive to work, and “is often quicker” avoids the overgeneralisation of “faster”.',
          },
        },
        {
          paragraph: 2,
          low: 'Also, the roads in old city is very narrow and the traffic lights are not working good, so cars must wait for a long time.',
          high: 'In older districts, narrow roads and poorly timed traffic lights make matters worse, leaving drivers waiting at junctions for long periods.',
          translationZh: {
            low: '此外，老城区的道路很窄，交通信号灯也运作不佳，所以汽车必须等很长时间。',
            high: '在较老的城区，狭窄的道路和配时不合理的交通信号灯使情况更加严重，导致司机在路口长时间等待。',
          },
          focus: ['accuracy', 'grammar'],
          note: {
            zh: 'the roads in old city is → In older districts：修冠词与主谓一致（复数 roads 不能配 is），并把地点状语前置，句子重心落到路况；not working good → poorly timed，用副词 + 过去分词作定语，说明红绿灯「配时不合理」而不只是「不好」；so cars must wait → make matters worse, leaving drivers waiting，分词状语替代 so 因果句，衔接更紧凑。',
            en: 'The article and agreement errors are corrected, and the place phrase moves to the front. “Not working good” becomes the precise “poorly timed”, and the participle clause “leaving drivers waiting at junctions” replaces the loose “so” clause.',
          },
        },
        {
          paragraph: 3,
          low: 'To solve this problem, government should build more roads and wider streets, so more cars can go at the same time.',
          high: 'To tackle congestion, governments should expand road capacity and widen key routes, allowing more vehicles to move at the same time.',
          translationZh: {
            low: '为了解决这个问题，政府应该修建更多道路和更宽的街道，让更多汽车能够同时通行。',
            high: '为应对拥堵，政府应提高道路通行能力，并拓宽主要路线，让更多车辆能够同时通行。',
          },
          focus: ['lexis', 'grammar', 'accuracy'],
          note: {
            zh: 'solve this problem → tackle congestion：动词与宾语搭配更地道，且直接回指话题词；government → governments，泛指要用复数；build more roads → expand road capacity，名词化表达「提高道路容量」，比「修更多路」更准确；so more cars can go → allowing more vehicles to move，分词状语 + vehicles 避免 car 重复。',
            en: '“Tackle congestion” is a natural verb-noun pairing. The bare singular “government” becomes plural, and “expand road capacity” is more precise than “build more roads”. The participle “allowing” links the result without a second clause.',
          },
        },
        {
          paragraph: 3,
          low: 'Besides, they should make the public transport cheaper and more better, so people will leave their car at home.',
          high: 'They should also make public transport cheaper and more reliable, so that commuters are willing to leave their cars at home.',
          translationZh: {
            low: '此外，政府应该让公共交通更便宜、更好，这样人们就会把汽车留在家里。',
            high: '政府还应让公共交通更便宜、更可靠，使通勤者愿意把汽车留在家里。',
          },
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'more better → more reliable：修掉双重比较级，同时让第二项与「便宜」互补，加的是可靠这一新信息；the public transport → public transport，泛指不加冠词；so → so that，明确引出目的；people → commuters，will leave → are willing to leave，从「将来会」改成「愿意」，措施与结果之间才有因果。',
            en: '“More better” is a double comparative; “more reliable” also adds a quality that complements “cheaper”. Generic “public transport” takes no article, and “so that commuters are willing to leave” states the intended effect rather than predicting behaviour.',
          },
        },
        {
          paragraph: 3,
          low: 'Finally, they can also tell people to use bicycle or walk to work, and this is good for the environment too.',
          high: 'Promoting cycling and walking to work would ease congestion and benefit the environment at the same time.',
          translationZh: {
            low: '最后，政府还可以告诉人们骑自行车或步行上班，这也对环境有好处。',
            high: '推广骑车和步行上班会缓解拥堵，同时也有利于环境。',
          },
          focus: ['lexis', 'grammar'],
          note: {
            zh: 'tell people to use bicycle → Promoting cycling and walking：动名词短语作主语，把「叫大家骑车」写成一项措施，cycling 是固定说法（不说 use bicycle）；is good for → benefit the environment，动词化，语气更正式；too → at the same time，收尾更书面；can → would，建议语气比能力语气更贴合政策讨论。',
            en: 'The gerund phrase “Promoting cycling and walking to work” turns an instruction into a policy measure, and “cycling” is the standard collocation. “Benefit the environment” is more formal than “good for the environment”, and “would” fits a proposal better than “can”.',
          },
        },
        {
          paragraph: 4,
          low: 'I think the most important thing is that the government must spend more money on the subway system, because subway is very fast and never have traffic jam.',
          high: 'In my view, the most effective measure is heavy investment in subway systems, which are fast and rarely held up by traffic.',
          translationZh: {
            low: '我认为最重要的是，政府必须在地铁系统上投入更多资金，因为地铁很快，而且从来不会堵车。',
            high: '在我看来，最有效的措施是大力投资地铁系统；地铁速度快，而且很少因交通拥堵而受阻。',
          },
          focus: ['lexis', 'grammar', 'accuracy'],
          note: {
            zh: 'the most important thing → the most effective measure：把评价对象明确为措施；spend more money on → heavy investment in，用 investment in 表示资金投入对象；which are fast and rarely held up by traffic 用非限定从句解释地铁的优势。rarely 比 never 限定更稳妥，但站内拥挤与道路交通堵塞是不同问题，论证应聚焦地铁与道路交通的关系。',
            en: '“The most effective measure” evaluates a solution rather than a vague thing. “Heavy investment in” is the nominal, formal alternative, and the relative clause fixes the article and agreement errors while replacing the absolute claim “never have traffic jam” with the more accurate “rarely held up by traffic”.',
          },
        },
        {
          paragraph: 4,
          low: 'If the subway is convenient, many people will not use their private car any more.',
          high: 'Once a subway network becomes convenient, few commuters will choose to drive to work.',
          translationZh: {
            low: '如果地铁方便，许多人就不会再使用自己的私家车了。',
            high: '一旦地铁网络变得便利，就很少会有通勤者选择开车上班。',
          },
          focus: ['lexis', 'grammar'],
          note: {
            zh: 'a subway network 明确讨论的是地铁网络。Once 表示「一旦」，比 if 更倾向于把条件视为将会实现，两者并非高低分替换关系。few commuters 让句子简洁，却预测只剩少数人开车，判断比原句更强；继续修改时可说明哪些便利性会促使更多通勤者改乘地铁。',
            en: '“A subway network” specifies the transport system. “Once” treats the condition as expected to occur, whereas “if” leaves it open. “Few commuters” is concise but predicts that only a small number will drive, a stronger claim than the original. Further revision could explain which improvements would encourage more commuters to switch.',
          },
        },
        {
          paragraph: 4,
          low: 'Also, the company can let their worker work at home one day in a week, so the road will be less crowded.',
          high: 'Companies could also allow staff to work from home one day a week, easing the strain on the roads.',
          translationZh: {
            low: '此外，公司可以让员工每周有一天在家工作，这样道路就不会那么拥挤。',
            high: '公司也可以允许员工每周在家办公一天，从而减轻道路的负荷。',
          },
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'the company → Companies：泛指用复数；their worker → staff，集体名词更准确；one day in a week → one day a week，固定说法；let → allow，更正式；so the road will be less crowded → easing the strain on the roads，分词短语 + strain 这一名词化表达，把结果挂在主句上而不是另起分句。',
            en: 'Generic “the company” should be plural, and “staff” is the right collective noun. “One day a week” is the fixed phrase, and the participle “easing the strain on the roads” links the result more smoothly than “so”.',
          },
        },
        {
          paragraph: 5,
          low: 'In conclusion, traffic jam is a big problem and it have many reasons.',
          high: 'In conclusion, traffic congestion stems from a range of causes, and it remains a serious problem for large cities.',
          translationZh: {
            low: '总之，交通堵塞是个大问题，而且有很多原因。',
            high: '总之，交通拥堵源于多种原因，而且仍是大城市面临的严重问题。',
          },
          focus: ['accuracy', 'lexis'],
          note: {
            zh: 'traffic jam → traffic congestion：jam 指一次具体拥堵，泛指现象要用不可数的 congestion；it have → 主谓一致修正；have many reasons → stems from a range of causes，stem from 表示「源于」，比 have reasons 准确；补上 remains a serious problem for large cities，交代影响范围。',
            en: '“Traffic jam” refers to a single event, while the uncountable “traffic congestion” names the general problem. The agreement error is removed, and “stems from a range of causes” is more precise than “have many reasons”.',
          },
        },
        {
          paragraph: 5,
          low: 'The government should do more things to solve it, and I think the future will be better.',
          high: 'Governments should act on several fronts, and I am optimistic that conditions can improve.',
          translationZh: {
            low: '政府应该做更多事情来解决这个问题，我认为未来会更好。',
            high: '政府应从多个方面采取行动，我对情况能够改善持乐观态度。',
          },
          focus: ['lexis', 'grammar', 'task'],
          note: {
            zh: 'do more things → act on several fronts：习语，指多管齐下，正好收拢上文列出的三项措施；I think the future will be better → I am optimistic that conditions can improve：用 optimistic + that 从句表达有依据的乐观，把口号式的「未来会更好」换成「条件可以改善」，结论与全文立场一致。',
            en: '“Act on several fronts” echoes the measures already discussed, and “I am optimistic that conditions can improve” gives a measured closing judgement instead of the empty promise “the future will be better”.',
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分示例涉及原因和措施，也有简单的效果说明，但人口、公交供给、出行偏好和道路条件多以列举呈现。8 分改写更明确地连接措施与预期效果，并优先支持地铁投资。仍可把主因展开得更充分，说明政府如何促成企业远程办公，并在结尾概括具体答案；语言升级本身不能保证任务回应达到某个分数。',
            en: 'The Band 5 example covers causes and measures and gives some basic effects, but largely lists population, transport provision, travel preferences and road conditions. The rewrite makes intended effects clearer and prioritises subway investment. It could further develop the main causes, explain government involvement in home-working policies and summarise specific answers. Improved language alone does not establish a task-response score.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分示例较依赖 Firstly / Secondly / Also / Besides / Finally 列举。8 分改写用 One major cause、A second factor 明确因果层级，用 In older districts 切换地点范围，再以 which 从句和 leaving 分词结构连接相关信息。全文按「现象 / 原因 / 措施 / 评价 / 结论」推进；还可加强第三、四段之间从一般措施到优先方案的衔接。',
            en: 'Band 5 moves forward with numbered signposts (Firstly, Secondly, Also, Besides, Finally) and joins clauses with and, so and but. Band 8 uses fewer links, carries meaning with relative and participle clauses, and lets the paragraphs move from problem to causes, measures, evaluation and conclusion.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分示例较常使用 good、big 和 very，并有 more better 等形式错误；泛指交通拥堵时，traffic congestion 比无冠词的单数 traffic jam 合适。8 分改写用 keep pace、tackle congestion、ease the strain 和 stem from 表达具体关系，并用 road capacity 指明道路容量。准确搭配和语境贴合比词汇罕见程度更重要。',
            en: 'Band 5 stays at the good/bad/big level and contains clear collocation errors. Band 8 replaces them with natural pairings such as “keep pace”, “tackle congestion”, “ease the strain” and “stem from a range of causes”, using nominalisation for density rather than rare words.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：以简单句和并列句为主，主谓一致（congestion become、it have、roads is）、复数（many big city、too many car）、介词（reasons of）等基础错误反复出现，句式重复。8 分版：简单句、复合句、非限定从句、分词状语与名词化交替出现，句子结构完整，除个别措辞可以更自然外没有影响理解的错误。',
            en: 'Band 5 is dominated by simple and compound sentences with repeated basic errors in agreement, plurals and prepositions. Band 8 alternates simple and complex sentences, relative and participle clauses and nominalisation, and the grammar is accurate throughout.',
          },
        },
      ],
      takeaways: {
        zh: [
          '用现在完成时点出问题在恶化：Traffic congestion has grown into a serious problem in many large cities.',
          '指出公交跟不上需求：Public transport has failed to keep pace with the number of private cars.',
          '把措施写成「手段 + 结果」：expand road capacity so that more vehicles can move at the same time.',
          '用分词短语收束措施的好处：easing the strain on the roads.',
          '结论里表达克制的乐观：I am optimistic that conditions can improve.',
        ],
        en: [
          'Traffic congestion has grown into a serious problem in many large cities.',
          'Public transport has failed to keep pace with the number of private cars.',
          'Governments should expand road capacity so that more vehicles can move at the same time.',
          'Companies could allow staff to work from home one day a week, easing the strain on the roads.',
          'I am optimistic that conditions can improve.',
        ],
      },
    },
  },
  {
    slug: 'task2-advantage-remote-work',
    task: 'task2',
    category: 'advantage-disadvantage',
    topic: 'work',
    status: 'published',
    sortOrder: 40,
    content: {
      prompt: {
        en: 'More employees than ever are now doing their jobs from home instead of travelling to a workplace. Do the advantages of this change outweigh the disadvantages?',
        zh: '题目要求讨论「在家办公」的利与弊，并明确回答好处是否大于坏处（outweigh）。利弊题必须给出自己的倾向，并用理由支撑；只罗列两面、结尾不表态会丢掉任务回应分。',
      },
      title: {
        zh: '在家办公的利与弊（5 分 vs 8 分）',
        en: 'Working from Home: Advantages and Disadvantages (Band 5 vs Band 8)',
      },
      bandLow: 5,
      bandHigh: 8,
      learning: {
        taskAnalysis: {
          zh: '这是 outweigh 利弊比较题，核心任务是判断在家办公的好处是否大于坏处，并解释比较依据。两面都要涉及，但段落或论点数量无需相等；可以比较影响的重要性、持续性及弊端能否缓解。本文把节省通勤时间、家庭相处和舒适度列为好处，把孤立感和分心列为坏处，第四段才提出利大于弊。5 分示例的语言错误与笼统理由削弱表达；8 分改写提高了语法和搭配准确度，但开头仍只预告讨论，结尾也没有重申判断。学习时应补足“为何省下的时间比这些损失更重要”的比较链，并让引言、评价段和结论保持同一立场。',
          en: 'This outweigh task requires a judgement about whether the benefits of working from home are greater than the drawbacks, supported by a basis for comparison. Both sides matter, but they do not need equal numbers of points or paragraphs. The comparison can consider importance, duration and whether drawbacks can be reduced. This essay lists saved commuting time, family contact and comfort as benefits, and isolation and distraction as drawbacks; the judgement appears in paragraph four. The Band 5 example is weakened by language errors and general reasons. The rewrite improves grammar and collocations, but its introduction only announces discussion and its conclusion does not restate the judgement. Develop why the time saved matters more than the losses, and maintain the same position through the introduction, evaluation and conclusion.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '引入远程办公趋势与利弊比较', en: 'Introduce the trend and the comparison of benefits and costs' },
            analysis: {
              zh: '首段交代在家办公日益普遍，并引出利弊比较。8 分版明确了人群与现象，也修正 instead of go；但预告“得出明确结论”只是承诺稍后表态。可在此直接说明利大于弊及主要依据，让全文方向更明确。',
              en: 'The paragraph introduces the spread of home working and the comparison of benefits and costs. Employees and shift identify the group and change more clearly, and the rewrite fixes instead of go. However, before reaching a clear conclusion only promises a later judgement. Stating the judgement and its main reason here would give the essay a clearer direction.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '从节省通勤时间展开正面影响', en: 'Develop benefits from saved commuting time' },
            analysis: {
              zh: '本段先写省去通勤，再把时间收益连接到家庭关系，最后补充穿着舒适。8 分版的 commute 和 which in turn 让因果链更紧凑。穿衣自由相对次要，可缩短这一点，把更多篇幅用于说明省下的时间如何改善家庭生活，并为后文比较提供依据。',
              en: 'The paragraph moves from avoiding a commute to more family time, then adds comfort in clothing. Commute and which in turn make the sequence more compact and connected. Freedom of dress is a relatively minor benefit here. Developing how saved time improves family life would provide stronger material for the later comparison.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '说明社交隔离与自律困难的代价', en: 'Explain the costs of isolation and difficulties with self-discipline' },
            analysis: {
              zh: '反面段由缺少面对面交流引出孤立感，再写分心导致工作被娱乐替代。改写用 may、can 和 some 限定影响范围，比一概预测更稳妥。两项弊端已可辨认，仍可各补一句具体后果，使读者有足够信息判断它们与时间收益孰轻孰重。',
              en: 'The negative paragraph links reduced face-to-face contact to isolation, then describes entertainment displacing work. May, can and some limit the scope of the claims more carefully than a universal prediction. The drawbacks are identifiable, but a concrete consequence for each would help the reader judge their importance against the time saved.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '作出利弊判断并提出雇主支持', en: 'Make the judgement and propose employer support' },
            analysis: {
              zh: '本段首次明确回答利大于弊，接着用线上会议缓解远程管理问题。Such meetings 比重复举例标记衔接自然；但 other things 仍未说明时间用途。还需解释会议能缓解哪项弊端，以及剩余代价为何不足以推翻前面的判断。',
              en: 'Carry more weight gives the first explicit judgement that the benefits outweigh the drawbacks. Online meetings then offer employer support. Such meetings links back more naturally than repeating For example, but other things still leaves the use of saved time vague. Explain which drawback meetings would reduce and why the remaining costs do not outweigh the benefits.',
            },
          },
          {
            paragraph: 5,
            role: { zh: '收束观点并检查结论是否回答题目', en: 'Close the argument and check that the question is answered' },
            analysis: {
              zh: '两版结尾都转向个人选择与政府制定规则。8 分版修正 has 并改进词汇，但 opinions vary 仍未重申利大于弊，政府规则也未在正文展开。更好的收束应回扣时间和家庭收益，简要保留雇主支持条件，避免用新建议替代最终比较结论。',
              en: 'Both conclusions turn to individual choice and government rules. The rewrite corrects has and improves vocabulary, but opinions vary does not restate that the advantages outweigh the disadvantages, and government rules have not been developed. A stronger ending would return to time and family benefits, retain the condition of employer support, and give the final comparative judgement.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '围绕同一收益建立因果链', en: 'Develop a causal chain around one benefit' },
            explanation: {
              zh: '上一句提出免去通勤，本句以 It also 继续同一主题，再用 which in turn 引出家庭关系的变化。这里值得学的是“节约时间—增加相处—关系受益”的推进，而非只记住连接词。继续展开时应说明相处时间用于什么活动，避免把拥有空闲时间直接等同于每个家庭关系都会改善。',
              en: 'The previous sentence removes the commute; It also continues that theme, and which in turn introduces the effect on family relationships. The useful pattern is saved time, more contact, then a possible relationship benefit, not merely the linking phrase. Develop how families use that time so the argument does not assume that extra free time automatically improves every relationship.',
            },
            segmentIndex: 3,
          },
          {
            title: { zh: '让紧凑句式保留清楚的主语', en: 'Keep the subject clear when compressing a sentence' },
            explanation: {
              zh: 'wearing whatever they like 把穿衣例子附在工作主句后面，动作主体仍是 they；without 短语交代没有他人注意的情形。改写避免原句 for example 前后主句只用逗号连接的问题。练习时先保证主语和标点正确，再决定是否压缩，清晰度比结构数量重要。',
              en: 'Wearing whatever they like attaches the clothing example to they can work, with they still performing the action. Without anyone taking notice adds the surrounding circumstance. The rewrite avoids the original comma-only connection before for example. Establish the subject and correct sentence boundaries first, then decide whether compression improves clarity.',
            },
            segmentIndex: 4,
          },
          {
            title: { zh: '用范围限定与结果结构解释弊端', en: 'Limit the scope and describe the resulting behaviour' },
            explanation: {
              zh: 'Some 把自律问题限定为部分员工，struggle to 说明困难，end up watching 则呈现不理想的结果。should be working 用进行式标出娱乐与当时工作责任的冲突。这些结构共同解释分心的过程；后续若补充任务拖延等后果，就能把行为描述推进到与利弊判断相关的实际代价。',
              en: 'Some limits the self-discipline problem to part of the workforce, struggle to describes difficulty, and end up watching gives an unwanted result. Should be working contrasts entertainment with the work expected at that time. Together these structures explain distraction. A consequence such as delayed tasks would then connect the behaviour to the cost relevant to the comparison.',
            },
            segmentIndex: 7,
          },
          {
            title: { zh: '立场词后面必须跟上比较依据', en: 'Follow the position with a reason for the comparison' },
            explanation: {
              zh: 'carry more weight 明确表达优势更重要，比 bigger 更贴近利弊权衡。但 a precious resource 只是在评价时间，other things 也仍然宽泛，词汇变化尚未完成论证。可沿用已有家庭主题说明时间收益的持续价值，再联系社交和自律问题能否缓解，让“为什么更重要”有可追踪的依据。',
              en: 'Carry more weight clearly says that the benefits are more important, making the comparison more precise than bigger. Yet a precious resource evaluates time rather than explaining the comparison, and other things remains vague. Develop the continuing value of family time and relate it to whether isolation and self-discipline problems can be reduced.',
            },
            segmentIndex: 8,
          },
          {
            title: { zh: '用名词回指延续同一个例子', en: 'Use a referring noun phrase to develop the same example' },
            explanation: {
              zh: '上一句已经介绍每周线上会议，本句用 Such meetings 回指，说明会议如何帮助管理者了解进展并提供支持。它不是第二个独立例子，因此不必重复 For example。模仿时可用 such 加上文明确出现的复数名词，随后解释该措施的功能；若上文有多个候选对象，就应直接写出具体对象。',
              en: 'The previous sentence introduces weekly online meetings. Such meetings refers back and explains how they help managers follow progress and offer support. This develops the same example, so another For example is unnecessary. Use such with a clearly established plural noun, then explain its function; name the specific object when several possible referents exist.',
            },
            segmentIndex: 10,
          },
        ],
        mistakes: [
          {
            zh: 'instead of 是介词短语，后面写 going，不能写 go；working from home 作为一个活动作主语时通常搭配 has。先修好这类重复基础错误，再增加从句或分词结构。',
            en: 'Instead of takes going, not go. When working from home names a single activity as the subject, it normally takes has. Correct these recurring basic errors before adding relative or participle clauses.',
          },
          {
            zh: 'control themselves good 中需要副词 well，若要表达工作自律，discipline themselves 更贴切。play phone 不自然，可按具体行为写 use their phones、check messages 或 scroll through social media，而不是只把 play 换成一个更长动词。',
            en: 'Control themselves good needs the adverb well; discipline themselves is more precise for work habits. Play phone is unnatural. Name the actual activity with use their phones, check messages or scroll through social media.',
          },
          {
            zh: '列出三项优点和两项缺点并不能证明利大于弊。本文需要比较节省时间的价值与孤立、分心的影响，并解释线上会议能缓解什么。第四段已经表态，结尾应延续该判断。',
            en: 'Three benefits and two drawbacks do not prove that the benefits outweigh the costs. Compare the value of saved time with the effects of isolation and distraction, and explain what meetings would address. The conclusion should maintain the judgement already given in paragraph four.',
          },
          {
            zh: 'because、talk with 和 make rules 本身都可以是正确英语，不必一律替换成 as、talk to 或 set rules。比较改写时要区分真实错误、表达侧重点和可选风格；自然且准确的常用表达同样有效。',
            en: 'Because, talk with and make rules can all be correct English. They do not always need replacement by as, talk to or set rules. Distinguish genuine errors from changes in emphasis or optional style. Familiar expressions remain effective when used accurately and naturally.',
          },
        ],
        vocabulary: [
          {
            term: 'commute',
            partOfSpeech: 'verb',
            meaning: { zh: '经常往返于住处和工作地点；通勤', en: 'To travel regularly between home and work.' },
            usage: { zh: '常用 commute to + 地点，交通方式用 by bus/train 等；have to 后接动词原形。commute 本身包含经常往返之意，不是任何一次旅行。', en: 'Use commute to followed by a destination, with by bus or by train for the mode. Have to takes the base form. Commute refers to regular travel, not just any journey.' },
            collocations: ['commute to work', 'commute by train', 'commute from the suburbs'],
            example: { en: 'She commutes to the office by train three days a week.', zh: '她每周有三天乘火车去办公室上班。' },
            segmentIndex: 2,
          },
          {
            term: 'considerable',
            partOfSpeech: 'adjective',
            meaning: { zh: '相当多的；在此强调节省的时间数量较大', en: 'Large or substantial in amount, here referring to time saved.' },
            usage: { zh: 'a considerable amount of 后接 time 等不可数名词；a considerable number of 后接可数名词复数。修饰动词时用副词 considerably。', en: 'Use a considerable amount of with uncountable nouns such as time, and a considerable number of with plural countable nouns. The adverb form is considerably.' },
            collocations: ['a considerable amount of time', 'considerable effort', 'considerable savings'],
            example: { en: 'Preparing a shared schedule saved the team a considerable amount of time.', zh: '制定共享日程为团队节省了相当多的时间。' },
            segmentIndex: 2,
          },
          {
            term: 'in turn',
            partOfSpeech: 'adverbial phrase',
            meaning: { zh: '进而；表示前一变化引出的后续影响', en: 'As a further result of the change just described.' },
            usage: { zh: '本句中放在 which 与 strengthens 之间，把更多家庭相处时间连接到关系变化。它也能表示“轮流”，需按上下文辨义；有真实递进结果时才使用。', en: 'Here it sits between which and strengthens to link extra family time with a further effect. In turn can also mean one after another, so interpret it in context. Use it when the result relationship is clear.' },
            collocations: ['which in turn improves', 'can in turn lead to', 'may in turn reduce'],
            example: { en: 'Clearer instructions reduce confusion, which in turn saves time.', zh: '更清楚的指示减少困惑，进而节省时间。' },
            segmentIndex: 3,
          },
          {
            term: 'drawbacks',
            partOfSpeech: 'plural countable noun',
            meaning: { zh: '缺点；某种安排带来的不利因素', en: 'Disadvantages or negative features of an arrangement.' },
            usage: { zh: '单数为 a drawback，复数为 drawbacks；可用 a drawback of/to something。用它引出缺点后，应说明具体影响，不要只给标签。', en: 'Use a drawback for one disadvantage and drawbacks for more than one. Both a drawback of something and a drawback to something are possible. Explain the specific effect after naming it.' },
            collocations: ['a major drawback', 'potential drawbacks', 'the drawbacks of remote work'],
            example: { en: 'One drawback of remote work is the difficulty of asking colleagues quick questions.', zh: '远程办公的一个缺点是，不容易随时向同事请教简短问题。' },
            segmentIndex: 5,
          },
          {
            term: 'isolated',
            partOfSpeech: 'adjective',
            meaning: { zh: '缺少与他人联系的；在这里指社交上的隔离感', en: 'Separated from regular contact with other people.' },
            usage: { zh: '常作 feel 的表语，也可用 isolated from + 人群或环境说明与谁缺少联系。它强调联系不足；lonely 更直接表达孤独感，两者都可按语境使用。', en: 'Use it after feel, or use isolated from to identify the people or setting someone lacks contact with. It emphasises separation; lonely more directly names the feeling. Either can fit, depending on the intended meaning.' },
            collocations: ['feel isolated', 'socially isolated', 'isolated from colleagues'],
            example: { en: 'New employees may feel isolated if they rarely speak to their colleagues.', zh: '如果很少与同事交流，新员工可能感到与团队疏离。' },
            segmentIndex: 6,
          },
          {
            term: 'discipline',
            partOfSpeech: 'verb',
            meaning: { zh: '约束、训练自己的行为，以完成应做的事情', en: 'To train or control behaviour so that necessary work is done.' },
            usage: { zh: '本句是 discipline oneself，自我约束；也可接 to do something 表示训练自己坚持做某事。它还可作名词，但这里在 to 后是动词原形。', en: 'Here discipline oneself means exercise self-control. Discipline oneself to do something can describe training a habit. Discipline can also be a noun, but here it is the base-form verb after to.' },
            collocations: ['discipline yourself to study', 'discipline oneself to focus', 'learn to discipline yourself'],
            example: { en: 'He disciplines himself to finish urgent tasks before checking social media.', zh: '他要求自己先完成紧急任务，再查看社交媒体。' },
            segmentIndex: 7,
          },
          {
            term: 'carry more weight',
            partOfSpeech: 'verb phrase',
            meaning: { zh: '在比较或决策中更重要、更有分量', en: 'To have greater importance or influence in a comparison or decision.' },
            usage: { zh: 'weight 在这个比喻中不可数，more 表示相对更重要。可用 than 接比较对象；本句由上下文补出 disadvantages。表达立场后仍需给出比较理由。', en: 'Weight is uncountable in this figurative use. More marks greater importance, and than can introduce the comparison. The drawbacks are understood from the context here. Follow the judgement with reasons.' },
            collocations: ['carry more weight than', 'carry considerable weight', 'carry little weight'],
            example: { en: 'For this team, regular communication carries more weight than a strict dress code.', zh: '对这个团队而言，定期沟通比严格的着装规定更重要。' },
            segmentIndex: 8,
          },
          {
            term: 'devoted',
            partOfSpeech: 'past participle in a passive verb phrase',
            meaning: { zh: '被用于、投入到某项活动', en: 'Allocated or given to a particular activity or purpose.' },
            usage: { zh: '主动结构为 devote time to something/doing something；本句用 time can be devoted to 的被动结构。这里的 to 是介词，后接名词或动名词。', en: 'The active pattern is devote time to something or doing something. This sentence uses the passive pattern time can be devoted to. To is a preposition, so it takes a noun or gerund.' },
            collocations: ['devote time to learning', 'devote energy to a project', 'hours devoted to training'],
            example: { en: 'The time saved on commuting can be devoted to learning a new skill.', zh: '通勤省下的时间可以用来学习一项新技能。' },
            segmentIndex: 8,
          },
        ],
      },
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, many people work from home instead of go to the office, and this is a very popular thing in the world.',
          high: 'A growing number of employees now work from home rather than travelling to an office, a shift that has become increasingly common worldwide.',
          translationZh: {
            low: '如今，许多人在家工作，而不是去办公室，这在世界各地都很流行。',
            high: '现在，越来越多的员工在家办公，而不是前往办公室，这种变化在全球范围内日益普遍。',
          },
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'instead of go 应改为 instead of going；改写选择 rather than travelling 表达对比。A growing number of employees 明确人群并体现趋势；a shift 是对前面整体现象的补充概括，that has become increasingly common worldwide 是修饰 shift 的定语从句，不是同位语从句。',
            en: '“Instead of go” should be “instead of going”; the rewrite chooses “rather than travelling” for the comparison. “A growing number of employees” identifies the group and trend. “A shift” summarises the preceding situation, and the that-clause is a relative clause modifying “shift”.',
          },
        },
        {
          paragraph: 1,
          low: 'Some people think it is good and some people think it is bad, so I will talk about both sides in this essay.',
          high: 'Opinions differ on whether this trend does more good than harm, and this essay will examine both sides before reaching a clear conclusion.',
          translationZh: {
            low: '有些人认为这很好，有些人认为这不好，所以本文将讨论这两个方面。',
            high: '对于这一趋势是否利大于弊，人们看法不一；本文将考察两个方面，然后得出明确结论。',
          },
          focus: ['task', 'lexis', 'grammar'],
          note: {
            zh: 'does more good than harm 对应题干 outweigh 的比较框架，比单说 good / bad 更精确。before reaching a clear conclusion 预告稍后作判断，但还没有表达作者倾向。引言若直接给出利大于弊的立场及主要理由，读者就能更早把握全文方向。',
            en: '“Does more good than harm” expresses the comparison in the outweigh question more precisely than good/bad. “Before reaching a clear conclusion” promises a judgement but does not state one. Giving the position and its main reason here would make the essay direction clearer.',
          },
        },
        {
          paragraph: 2,
          low: 'Firstly, working at home can save a lot of time, because people do not need to take the bus or train to the company every day.',
          high: 'On the positive side, working from home saves a considerable amount of time, as employees no longer have to commute to the office by bus or train each day.',
          translationZh: {
            low: '首先，在家工作可以节省很多时间，因为人们不需要每天坐公交或火车去公司。',
            high: '从积极的一面看，在家办公节省了相当多的时间，因为员工不再需要每天乘公交或火车去办公室上班。',
          },
          focus: ['lexis', 'cohesion', 'grammar'],
          note: {
            zh: 'On the positive side 明确本段讨论优点。commute to the office by bus or train 用 commute 概括通勤、by 短语交代交通方式；a considerable amount of time 用 amount 搭配不可数的 time。because 和 as 在这里都可引出原因，替换属于表达选择，不是把错误改成正确。',
            en: '“On the positive side” groups the paragraph by side instead of numbering it. “Commute to the office by bus or train” condenses the wordy original, and “a considerable amount of time” is the formal quantifier.',
          },
        },
        {
          paragraph: 2,
          low: 'Secondly, they can have more free time to stay with their family, and this is good for their family relationship.',
          high: 'It also gives them more free time to spend with their families, which in turn strengthens family relationships.',
          translationZh: {
            low: '其次，他们可以有更多空闲时间陪伴家人，这对家庭关系有好处。',
            high: '在家办公也让他们有更多空闲时间陪伴家人，进而增进家庭关系。',
          },
          focus: ['lexis', 'grammar', 'cohesion'],
          note: {
            zh: 'stay with their family → spend time with their families：固定搭配 + 复数修正；this is good for → which in turn strengthens：非限定从句替代 and this，指代清楚，strengthen 是 relationship 的自然搭配；Secondly → It also，用代词衔接上一句，不再另起编号。',
            en: '“Spend time with their families” is the natural collocation, and the relative clause “which in turn strengthens family relationships” replaces the loose “and this is good for”. “It also” keeps the link without another numbered signpost.',
          },
        },
        {
          paragraph: 2,
          low: 'Also, people can work in a more comfortable way, for example they can wear any clothes they like and no one will care about it.',
          high: 'In addition, they can work in far greater comfort, wearing whatever they like without anyone taking notice.',
          translationZh: {
            low: '此外，人们可以以更舒适的方式工作，例如想穿什么衣服就穿什么，也不会有人在意。',
            high: '此外，他们可以在舒适得多的状态下工作，想穿什么就穿什么，也没有人留意。',
          },
          focus: ['lexis', 'grammar'],
          note: {
            zh: 'in a more comfortable way → in far greater comfort：名词化表达，far 加强程度；for example they can wear any clothes they like → wearing whatever they like，分词状语 + whatever 从句，句子只有一个主干；no one will care about it → without anyone taking notice，介词 + 动名词替代并列分句。',
            en: '“In far greater comfort” is a compact nominal phrase, and the participle “wearing whatever they like” avoids adding a second main clause. “Without anyone taking notice” replaces the clunky “no one will care about it”.',
          },
        },
        {
          paragraph: 3,
          low: 'However, working at home also have some bad sides for the workers.',
          high: 'There are, however, drawbacks as well, particularly for employees who work remotely.',
          translationZh: {
            low: '不过，在家工作对员工也有一些不好的方面。',
            high: '不过，这也有缺点，尤其是对远程办公的员工而言。',
          },
          focus: ['accuracy', 'grammar', 'lexis'],
          note: {
            zh: '动名词短语 working at home 作主语时应配 has。改写改用 There are drawbacks 引出反面段，however 位于句中并用逗号隔开。drawbacks 准确概括不利因素；employees who work remotely 重复了本文已明确的讨论对象，可进一步精简，把篇幅用于展开具体弊端。',
            en: 'The gerund subject “working at home” takes “has”. The rewrite introduces the negative paragraph with “There are drawbacks” and sets off “however” with commas. “Drawbacks” accurately names disadvantages, but “employees who work remotely” repeats the established subject and could be shortened.',
          },
        },
        {
          paragraph: 3,
          low: 'For example, they may feel lonely because they cannot talk with their workmates face to face, and this is not good for their mental health.',
          high: 'They may feel isolated, for instance, because they cannot talk to colleagues face to face, and this can affect their mental health.',
          translationZh: {
            low: '例如，他们可能会感到孤独，因为无法与同事面对面交谈，这对他们的心理健康不好。',
            high: '例如，他们可能会感到与人疏离，因为无法与同事面对面交流，而这可能影响他们的心理健康。',
          },
          focus: ['lexis', 'grammar', 'accuracy'],
          note: {
            zh: 'isolated 强调与他人联系不足，lonely 强调孤独感，两者都可按语境使用。talk to 和 talk with 都成立，colleagues 是常见工作场景用词。can affect 限定心理健康影响并非必然；for instance 移到句中是句式变化，重点仍是把缺少交流与心理影响的关系说清楚。',
            en: '“Isolated” emphasises limited contact, while “lonely” names the feeling; both can fit the context. “Talk to” and “talk with” are both valid. “Can affect” presents a possible effect rather than a certainty. Moving “for instance” changes the rhythm, while the causal link still needs clear development.',
          },
        },
        {
          paragraph: 3,
          low: 'Also, some people cannot control themselves good, so they will watch TV or play phone when they should work.',
          high: 'Some also struggle to discipline themselves, so they end up watching television or scrolling through their phones when they should be working.',
          translationZh: {
            low: '此外，有些人不能很好地控制自己，所以他们会在应该工作的时候看电视或玩手机。',
            high: '有些人也难以自律，结果在本该工作的时候看起了电视或刷起了手机。',
          },
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'cannot control themselves good → struggle to discipline themselves：修掉副词错误，并换成固定说法 discipline oneself；will watch TV → end up watching，end up + 动名词表示「结果变成」，比 will 更准确；play phone → scrolling through their phones，手机使用的自然搭配；should work → should be working，进行时强调「本该在工作」。',
            en: '“Control themselves good” needs the adverb “well”; “discipline themselves” also specifies self-control in work habits. “End up watching” expresses an unwanted result, and “scrolling through their phones” names a particular phone activity more clearly than “play phone”.',
          },
        },
        {
          paragraph: 4,
          low: 'In my opinion, the advantages are bigger than the disadvantages, because time is very important for everyone and people can use the saved time to do many things.',
          high: 'In my view, the advantages carry more weight, since time is a precious resource and the hours saved can be devoted to other things.',
          translationZh: {
            low: '在我看来，优点大于缺点，因为时间对每个人都很重要，而且人们可以用省下的时间做很多事情。',
            high: '在我看来，优势更为重要，因为时间是一种宝贵资源，省下的时间可以投入其他事情。',
          },
          focus: ['lexis', 'grammar', 'task'],
          note: {
            zh: 'carry more weight 表达利弊权衡，比 bigger 更准确。the hours saved can be devoted to other things 用被动结构把省下的时间作为主语，to 后接名词。但 a precious resource 仍是价值判断，other things 仍未具体说明用途；下一步应给出时间如何带来收益，以及为何超过弊端的理由。',
            en: '“Carry more weight” expresses the comparison more precisely than “bigger”. The passive “can be devoted to” makes the saved hours the subject. However, “a precious resource” still asserts value and “other things” remains vague. Further development should explain the uses of that time and why their benefits outweigh the costs.',
          },
        },
        {
          paragraph: 4,
          low: 'But the company should also help the workers, for example they can have a short meeting online every week.',
          high: 'Employers, however, should also support remote staff, for example by holding a short online meeting every week.',
          translationZh: {
            low: '但是，公司也应该帮助员工，例如公司可以每周开一次简短的线上会议。',
            high: '不过，雇主也应为远程员工提供支持，例如每周举行一次简短的线上会议。',
          },
          focus: ['lexis', 'cohesion', 'grammar'],
          note: {
            zh: 'But → however 插入语，书面衔接；the company → Employers，行为者更准确；help → support；the workers → remote staff，限定范围；for example they can have a meeting → for example by holding a meeting，用介词 + 动名词把举例变成 support 的方式状语，一句话只有一个主干。',
            en: 'The high version uses “however” as a parenthetical link and names the actor as “employers”. “By holding a short online meeting” turns the example into a method attached to “support”, so the sentence keeps one main clause.',
          },
        },
        {
          paragraph: 4,
          low: 'For example, they can use the meeting to know what the workers are doing and give them some help.',
          high: 'Such meetings allow managers to see how their staff are progressing and to offer practical help when it is needed.',
          translationZh: {
            low: '例如，公司可以利用会议了解员工正在做什么，并给予他们一些帮助。',
            high: '这样的会议能让管理者了解员工的工作进展，并在需要时提供切实帮助。',
          },
          focus: ['lexis', 'grammar', 'cohesion'],
          note: {
            zh: 'For example → Such meetings：用指代回指上一句，衔接靠词义而不是重复的举例标记；use the meeting to know → allow managers to see，主客体更清楚；what the workers are doing → how their staff are progressing，progress 比 doing 更有信息量；give them some help → offer practical help when it is needed，补上时机，帮助不再空泛。',
            en: '“Such meetings” refers back without another “for example”, and “allow managers to see” clarifies who does what. “How their staff are progressing” is more informative than “what the workers are doing”.',
          },
        },
        {
          paragraph: 5,
          low: 'In conclusion, working from home have good and bad sides, and different people have different ideas about it.',
          high: 'In conclusion, working from home has both benefits and drawbacks, and opinions on it naturally vary.',
          translationZh: {
            low: '总之，在家工作既有好的一面，也有不好的一面，不同的人对此有不同的看法。',
            high: '总之，在家办公既有好处，也有缺点，人们对此的看法自然各不相同。',
          },
          focus: ['accuracy', 'lexis'],
          note: {
            zh: 'have → has：主谓一致修正；good and bad sides → benefits and drawbacks，正式名词；different people have different ideas about it → opinions on it naturally vary，用名词 opinions + vary 压缩句子，opinions on 是固定搭配，观点分歧的表述更简洁。',
            en: 'The agreement error is corrected, and “benefits and drawbacks” is the formal pairing. “Opinions on it naturally vary” condenses the repetitive “different people have different ideas”.',
          },
        },
        {
          paragraph: 5,
          low: 'Everyone should choose the way that is good for them, and the government should make some rules to make it better.',
          high: 'Individuals should choose the arrangement that suits them best, while governments should set sensible rules for this new way of working.',
          translationZh: {
            low: '每个人都应该选择对自己好的方式，而政府应该制定一些规则，让这种工作方式变得更好。',
            high: '个人应选择最适合自己的安排，而政府应为这种新的工作方式制定合理规则。',
          },
          focus: ['lexis', 'grammar', 'task'],
          note: {
            zh: 'the arrangement that suits them best 明确为适合个人的工作安排；while 连接个人和政府的不同责任。set sensible rules 是自然搭配，原来的 make rules 也成立。句子语言更具体，但政府规则未在正文展开，结尾仍需回到利是否大于弊的判断，不能用新建议替代回答。',
            en: '“The arrangement that suits them best” specifies a suitable working arrangement, and “while” connects different responsibilities. “Set sensible rules” is natural, but “make rules” is also valid. Government rules are undeveloped in the body, and the ending still needs to restate the outweigh judgement.',
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '两版都讨论利弊，并在第四段明确倾向利大于弊；但比较依据较笼统，引言只预告讨论，结尾转向个人选择与政府规则，未重申判断。8 分改写的 carry more weight 比 bigger 准确，却仍需说明时间收益为何超过孤立感与分心的代价。利弊不要求相等篇幅，关键是充分讨论并支撑最终判断。',
            en: 'Both versions discuss benefits and drawbacks and state in paragraph four that the benefits outweigh the costs. The comparison remains general: the introduction only announces discussion and the conclusion turns to choice and rules. “Carry more weight” is more precise than “bigger”, but the value of saved time still needs weighing against isolation and distraction. Equal space is not required; adequate discussion and a supported judgement are.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：Firstly / Secondly / Also / However / For example / In conclusion 逐条编号，段内用 and、so、but 拼接，For example 出现两次。8 分版：用 On the positive side / There are, however, drawbacks / In addition 按「利 / 弊 / 评价」分组，第二次举例改用 Such meetings 回指，段内用非限定从句（which in turn strengthens family relationships）和分词结构衔接，段落靠观点推进而不是序号。',
            en: 'Band 5 numbers every point and repeats “For example”. Band 8 groups the paragraphs as positive side, drawbacks and evaluation, replaces the second example link with the referring phrase “Such meetings”, and connects sentences with relative and participle clauses.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分示例较依赖 good、bad 和 thing，play phone 等搭配不自然；instead of go 和 control themselves good 则涉及语法形式。8 分改写用 commute、drawbacks、discipline themselves 和 carry more weight 表达话题含义。make rules 本身正确；set sensible rules 的价值在于加上合理这一评价，不是修正错误搭配。',
            en: 'The Band 5 example relies on good, bad and thing, with unnatural wording such as “play phone”; “instead of go” and “control themselves good” involve grammatical forms. The rewrite uses topic-relevant items such as “commute”, “drawbacks” and “carry more weight”. “Make rules” is already valid; “set sensible rules” adds an evaluation rather than fixing a collocation error.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：主谓一致（working from home have）、介词后动词形式（instead of go）、副词用法（control themselves good）等错误反复出现，句子以 and、so 并列为主。8 分版：动名词作主语、非限定从句、分词状语、插入语（There are, however, drawbacks）交替使用，句子长短有变化，除个别措辞可以更自然外没有语法错误。',
            en: 'Band 5 repeats basic errors in agreement, verb forms after prepositions and adverb use, and the sentences are mostly compound. Band 8 alternates gerund subjects, relative clauses, participle phrases and parenthetical links, with accurate grammar throughout.',
          },
        },
      ],
      takeaways: {
        zh: [
          '开头点出现象和趋势：A growing number of employees now work from home rather than travelling to an office.',
          '正面回应 outweigh 的立场句：In my view, the advantages carry more weight, since time is a precious resource.',
          '用非限定从句补充结果：It gives them more free time to spend with their families, which in turn strengthens family relationships.',
          '用分词短语代替并列句：They can work in far greater comfort, wearing whatever they like without anyone taking notice.',
          '提出配套建议：Employers, however, should also support remote staff, for example by holding a short online meeting every week.',
        ],
        en: [
          'A growing number of employees now work from home rather than travelling to an office.',
          'In my view, the advantages carry more weight, since time is a precious resource.',
          'It gives them more free time to spend with their families, which in turn strengthens family relationships.',
          'They can work in far greater comfort, wearing whatever they like without anyone taking notice.',
          'Employers, however, should also support remote staff, for example by holding a short online meeting every week.',
        ],
      },
    },
  },
];
