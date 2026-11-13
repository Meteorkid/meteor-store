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
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, traffic congestion become a very serious problem in many big city, and many people think the government should do something about it.',
          high: 'Traffic congestion has grown into a serious problem in many large cities, and governments are under mounting pressure to act.',
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
          focus: ['accuracy', 'lexis'],
          note: {
            zh: 'too many car → the sheer number of private cars：修复数，并用 sheer + 名词短语把「车太多」写成有分量的话题词；the number of people is increasing very fast → urban populations grow，名词化 + 一般现在时陈述趋势，去掉 very fast 这类口语程度词；is not good enough → has failed to keep pace，固定搭配，直接点出公交「跟不上」这一因果。',
            en: 'The plural error in “too many car” is fixed, and the vague phrase becomes the topic noun “private cars”. “People is increasing very fast” turns into the nominal “urban populations grow”, and “not good enough” becomes the idiom “has failed to keep pace”, which names the cause more precisely.',
          },
        },
        {
          paragraph: 2,
          low: 'Secondly, many people like to drive their own car to work because it is more comfortable and faster than take the bus or the subway.',
          high: 'A second factor is that many commuters prefer driving to taking the bus or the subway, as a car of their own feels more comfortable and is often quicker.',
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
          focus: ['lexis', 'grammar', 'accuracy'],
          note: {
            zh: 'the most important thing → the most effective measure：把评价对象从「事」换成「措施」，评价标准与题目直接相关；spend more money on → heavy investment in，名词化更书面；subway is very fast and never have traffic jam → which are fast and rarely held up by traffic：修冠词与主谓一致，用非限定从句补充说明，rarely held up 比 never 更可信（地铁也会挤）。',
            en: '“The most effective measure” evaluates a solution rather than a vague thing. “Heavy investment in” is the nominal, formal alternative, and the relative clause fixes the article and agreement errors while replacing the absolute claim “never have traffic jam” with the more accurate “rarely held up by traffic”.',
          },
        },
        {
          paragraph: 4,
          low: 'If the subway is convenient, many people will not use their private car any more.',
          high: 'Once a subway network becomes convenient, few commuters will choose to drive to work.',
          focus: ['lexis', 'grammar'],
          note: {
            zh: 'If → Once：用 once 表达「一旦…就…」，把条件写成可实现的未来状态；the subway → a subway network，冠词与具体化；will not use their private car any more → few commuters will choose to drive，用 few + choose 从「不用车」改成「主动选择开车的人很少」，既书面又顺手修掉 car 的单复数。',
            en: '“Once” frames the condition as a realistic future state, and “a subway network” is more concrete than “the subway”. “Few commuters will choose to drive” avoids the awkward negation and the singular “their private car”.',
          },
        },
        {
          paragraph: 4,
          low: 'Also, the company can let their worker work at home one day in a week, so the road will be less crowded.',
          high: 'Companies could also allow staff to work from home one day a week, easing the strain on the roads.',
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
            zh: '5 分版：原因和办法都提到了，但原因停在「车多、人多、路窄」的表面，措施空泛（build more roads、tell people），没有说明为什么有效，结尾也没评价。8 分版：两个原因、三项措施逐条对应，每项措施都带结果（expand road capacity so that more vehicles can move；make public transport cheaper and more reliable so that commuters are willing to leave their cars），并点出最有效的一项（heavy investment in subway systems），「原因 + 措施」两个部分都答满。',
            en: 'Band 5 mentions both parts of the question, but the causes stay on the surface and the measures are vague, with no explanation of why they would work. Band 8 keeps the same two causes and three measures, links each measure to a result, and singles out the most effective one, so the whole task is answered.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：靠 Firstly / Secondly / Also / Besides / Finally 逐条编号推进，段内用 and、so、but 硬接，指代只有 it / this。8 分版：连接词克制，改用 In older districts、In addition、however 这类功能性衔接；段内用非限定从句（which are fast and rarely held up by traffic）和分词状语（leaving drivers waiting at junctions）承上启下，段落按「现象 / 原因 / 措施 / 评价 / 结论」推进。',
            en: 'Band 5 moves forward with numbered signposts (Firstly, Secondly, Also, Besides, Finally) and joins clauses with and, so and but. Band 8 uses fewer links, carries meaning with relative and participle clauses, and lets the paragraphs move from problem to causes, measures, evaluation and conclusion.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分版：词汇停在 good / bad / big / very 一档，且有明显搭配错误（traffic jam 用来泛指拥堵、more better、play phone、one day in a week）。8 分版：换成准确的自然搭配（traffic congestion、keep pace、tackle congestion、ease the strain、stem from a range of causes），并用名词化（heavy investment、road capacity）提高信息密度，没有堆生僻词。',
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
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, many people work from home instead of go to the office, and this is a very popular thing in the world.',
          high: 'A growing number of employees now work from home rather than travelling to an office, a shift that has become increasingly common worldwide.',
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'instead of go → rather than travelling：介词后用动名词，同时换成更书面的 rather than 对比结构；many people → A growing number of employees，明确人群并体现趋势；a very popular thing in the world → a shift that has become increasingly common worldwide，用名词 shift + 同位语从句概括现象，去掉 thing 这种空泛词。',
            en: '“Instead of go” is ungrammatical after a preposition; “rather than travelling” fixes it and sounds more formal. “A growing number of employees” names the group, and the noun phrase with a that-clause replaces the vague “popular thing”.',
          },
        },
        {
          paragraph: 1,
          low: 'Some people think it is good and some people think it is bad, so I will talk about both sides in this essay.',
          high: 'Opinions differ on whether this trend does more good than harm, and this essay will examine both sides before reaching a clear conclusion.',
          focus: ['task', 'lexis', 'grammar'],
          note: {
            zh: 'good / bad → does more good than harm：直接套用题干 outweigh 的比较框架，把「好不好」变成「利是否大于弊」；so I will talk about → this essay will examine … before reaching a clear conclusion，预告会给出结论，回应利弊题必须表态的要求；同时避免 I will talk 这种口语表达。',
            en: '“Does more good than harm” mirrors the outweigh question in the prompt, and announcing that the essay will reach a conclusion shows the writer knows a position is required.',
          },
        },
        {
          paragraph: 2,
          low: 'Firstly, working at home can save a lot of time, because people do not need to take the bus or train to the company every day.',
          high: 'On the positive side, working from home saves a considerable amount of time, as employees no longer have to commute to the office by bus or train each day.',
          focus: ['lexis', 'cohesion', 'grammar'],
          note: {
            zh: 'Firstly → On the positive side：按「利 / 弊」分组组织，而不是机械编号；a lot of time → a considerable amount of time，正式量词；because → as，更书面；take the bus or train to the company → commute to the office by bus or train，用 commute 一个词概括通勤，用介词短语表达交通方式；can save → saves，直接陈述。',
            en: '“On the positive side” groups the paragraph by side instead of numbering it. “Commute to the office by bus or train” condenses the wordy original, and “a considerable amount of time” is the formal quantifier.',
          },
        },
        {
          paragraph: 2,
          low: 'Secondly, they can have more free time to stay with their family, and this is good for their family relationship.',
          high: 'It also gives them more free time to spend with their families, which in turn strengthens family relationships.',
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
          focus: ['accuracy', 'grammar', 'lexis'],
          note: {
            zh: 'working at home also have → 主谓一致修正（动名词主语用 has），高分版改用 There are drawbacks 这一存在句，把 however 放到句中作插入语，衔接更轻；bad sides → drawbacks，正式名词；for the workers → for employees who work remotely，用定语从句界定人群，也更贴合远程办公这一话题。',
            en: 'The low version breaks subject-verb agreement; the high version uses the standard “There are drawbacks” pattern with “however” in mid-position. “Drawbacks” is the formal equivalent of “bad sides”, and the relative clause specifies who is affected.',
          },
        },
        {
          paragraph: 3,
          low: 'For example, they may feel lonely because they cannot talk with their workmates face to face, and this is not good for their mental health.',
          high: 'They may feel isolated, for instance, because they cannot talk to colleagues face to face, and this can affect their mental health.',
          focus: ['lexis', 'grammar', 'accuracy'],
          note: {
            zh: 'lonely → isolated：lonely 偏个人感受，isolated 更贴合「和同事断了联系」的工作场景；talk with → talk to colleagues，workmates 偏口语；is not good for → can affect，用 can 留余地，避免绝对化；For example 移到句中作插入语，衔接不再机械。',
            en: '“Isolated” fits the workplace context better than “lonely”, and “colleagues” is the standard term. “Can affect” is more measured than “is not good for”, and the mid-sentence “for instance” softens the mechanical link.',
          },
        },
        {
          paragraph: 3,
          low: 'Also, some people cannot control themselves good, so they will watch TV or play phone when they should work.',
          high: 'Some also struggle to discipline themselves, so they end up watching television or scrolling through their phones when they should be working.',
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'cannot control themselves good → struggle to discipline themselves：修掉副词错误，并换成固定说法 discipline oneself；will watch TV → end up watching，end up + 动名词表示「结果变成」，比 will 更准确；play phone → scrolling through their phones，手机使用的自然搭配；should work → should be working，进行时强调「本该在工作」。',
            en: '“Control themselves good” is a double error; “struggle to discipline themselves” is the idiomatic fix. “End up watching” captures the unintended result, and “scrolling through their phones” is the natural collocation for phone use.',
          },
        },
        {
          paragraph: 4,
          low: 'In my opinion, the advantages are bigger than the disadvantages, because time is very important for everyone and people can use the saved time to do many things.',
          high: 'In my view, the advantages carry more weight, since time is a precious resource and the hours saved can be devoted to other things.',
          focus: ['lexis', 'grammar', 'task'],
          note: {
            zh: 'are bigger than → carry more weight：习语，直接对应题干 outweigh 的比较；very important → a precious resource，名词化，给出「为什么重要」的实质；because → since；use the saved time to do many things → the hours saved can be devoted to other things，被动语态 + devote … to，把「做很多事情」这种空话写得具体一些。',
            en: '“Carry more weight” is the idiomatic way to express outweighing, and “a precious resource” explains the value of time instead of asserting it. “The hours saved can be devoted to other things” replaces the empty “do many things”.',
          },
        },
        {
          paragraph: 4,
          low: 'But the company should also help the workers, for example they can have a short meeting online every week.',
          high: 'Employers, however, should also support remote staff, for example by holding a short online meeting every week.',
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
          focus: ['lexis', 'grammar', 'task'],
          note: {
            zh: 'Everyone → Individuals，书面主语；the way that is good for them → the arrangement that suits them best，suits 是更自然的动词，arrangement 也比 way 具体；and → while，表示两件事并行而不是简单并列；make some rules → set sensible rules，搭配修正（set rules）；make it better → for this new way of working，把空泛的「让它更好」换成明确的规则对象，任务回应更完整。',
            en: '“The arrangement that suits them best” is more precise than “the way that is good for them”. “Set sensible rules” fixes the collocation “make rules”, and “for this new way of working” tells the reader what the rules are about.',
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分版：两面都提到了，但只把「省时间」这一条展开了，利弊篇幅不平衡；虽然写了 In my opinion，理由却是 time is very important 这种空话，结尾又回到「各有各的想法」，等于没有回答 outweigh。8 分版：同一组利弊逐条对应，用 carry more weight 正面回答是否 outweigh，理由落到「时间是不可再生的资源」和「省下的时间可以用在别处」，并把立场保持到结论。',
            en: 'Band 5 mentions both sides but only develops the time-saving point, and the closing sentence retreats to “different people have different ideas”, so the outweigh question is never answered. Band 8 keeps the same pros and cons, answers with “carry more weight”, supports the view with a real reason, and holds the position to the end.',
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
            zh: '5 分版：good / bad / a very popular thing / bad sides / a lot of time，搭配问题集中在 instead of go、stay with their family、control themselves good、play phone、make some rules。8 分版：换成 a growing number of employees、a considerable amount of time、drawbacks、struggle to discipline themselves、scrolling through their phones、set sensible rules，并引入 commute、isolated、carry more weight 等与话题匹配的表达。',
            en: 'Band 5 relies on good/bad/thing and contains collocation errors such as “instead of go”, “control themselves good” and “make some rules”. Band 8 uses topic-appropriate items like “a growing number of employees”, “struggle to discipline themselves”, “scrolling through their phones” and “set sensible rules”.',
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
