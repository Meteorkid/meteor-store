import type { IeltsPairSeed } from '@/lib/ielts/types';

export const batchA: IeltsPairSeed[] = [
  {
    slug: 'task2-opinion-university-education',
    task: 'task2',
    category: 'opinion',
    topic: 'education',
    status: 'published',
    sortOrder: 10,
    content: {
      prompt: {
        en: 'Some people believe that the government should pay the full cost of university education so that every student can study without tuition fees. To what extent do you agree or disagree with this view?',
        zh: '有人认为政府应当承担大学教育的全部费用，让学生免费上大学。你在多大程度上同意或不同意这一观点？请给出理由，并用相关例子支持你的立场。',
      },
      title: { zh: '大学教育该不该免费', en: 'Should University Education Be Free?' },
      bandLow: 5,
      bandHigh: 8,
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, many people think that university education should be free for all students.',
          high: 'In many countries, whether university tuition should be paid by the state or by students themselves is a question that divides public opinion.',
          focus: ['task', 'lexis'],
          note: {
            zh: 'many people think → the question ... divides public opinion：把空泛的「很多人认为」改成可辩论的议题句，题干里的两个主体（state / students）都出现，为全文定下讨论对象。',
            en: 'many people think → the question ... divides public opinion: a vague opener becomes a debatable issue that names both sides of the funding question.',
          },
        },
        {
          paragraph: 1,
          low: 'Some people agree with this idea, but other people do not agree, so this topic is very controversial.',
          high: 'Supporters see free access as a matter of fairness, whereas critics doubt that it can be funded, so the disagreement is both moral and practical.',
          focus: ['task', 'cohesion', 'lexis'],
          note: {
            zh: 'agree ... do not agree → supporters ... whereas critics：用对举名词一次说完双方立场；controversial 换成 moral and practical，指出分歧具体在哪，而不是笼统地说「有争议」。',
            en: 'The flat repetition agree ... do not agree becomes a parallel supporters ... whereas critics pair, and controversial is replaced by a named split: moral and practical.',
          },
        },
        {
          paragraph: 1,
          low: 'In my opinion, free university education is good for the society, but it also have some problems.',
          high: 'In my view, free university education brings clear social benefits, although it has to be introduced in a way that public finances can sustain.',
          focus: ['task', 'grammar', 'accuracy'],
          note: {
            zh: 'it also have → it has、the society → society：改掉主谓一致与冠词错误；good for → brings clear social benefits，并把含糊的「有问题」换成对推行条件的限定，立场因此明确。',
            en: 'Fixes the agreement error it also have and the article slip the society; good for becomes brings clear social benefits, and the vague some problems turns into a condition the policy must meet.',
          },
        },
        {
          paragraph: 2,
          low: 'Firstly, free education give every student the same chance to go to university, because poor students can not pay the fees by themselves.',
          high: 'To begin with, free tuition gives every capable student the same chance to enter university, regardless of whether their family can afford the fees.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'give → gives、can not → cannot：修正主谓一致与拼写；poor students → regardless of whether their family can afford the fees，把可能带贬义的标签换成中性表达。',
            en: 'Corrects give → gives and can not → cannot; poor students becomes the neutral whether their family can afford the fees, which avoids a loaded label.',
          },
        },
        {
          paragraph: 2,
          low: 'Many people think this is fair, and it is also good for the country, because everybody can use their talent.',
          high: 'This is not only a question of fairness; it also allows a country to make use of the abilities of its whole population.',
          focus: ['grammar', 'lexis'],
          note: {
            zh: 'Many people think this is fair → This is not only a question of fairness：删掉没有来源的「很多人认为」，用 not only ... it also ... 的递进句把话题从个人公平推到国家层面。',
            en: 'Many people think is dropped, and the loose and ... because ... chain becomes a not only ... it also ... construction that moves the argument to the national level.',
          },
        },
        {
          paragraph: 2,
          low: 'For example, in many places, a student who is very good at study can not go to university because his family have no money.',
          high: 'In many places, talented school-leavers are unable to take up a place simply because there is no money at home to support them.',
          focus: ['accuracy', 'grammar'],
          note: {
            zh: 'is very good at study → talented；can not → are unable to；his family have no money → there is no money at home：修正搭配与主谓一致错误，并用 simply because 让因果关系更直接。',
            en: 'Fixes the collocation good at study and the agreement error his family have; the clause is recast with simply because, which sharpens the cause-effect link.',
          },
        },
        {
          paragraph: 2,
          low: 'So the country lose a lot of clever people, and this is a big waste for the future of the country.',
          high: 'The result is a loss of skilled people that is difficult to justify and costly to repair.',
          focus: ['lexis', 'task'],
          note: {
            zh: 'So the country lose → The result is a loss：改掉主谓一致错误，用名词化把「浪费」写成可评价的损失；clever people → skilled people，更贴近教育与劳动力话题的语域。',
            en: 'The agreement error disappears, clever people becomes skilled people, and the vague big waste is defined as a loss that is hard to justify or repair.',
          },
        },
        {
          paragraph: 2,
          low: 'If the government pay the money, this problem will not happen, and more young people can study.',
          high: 'Where the state covers the cost, that loss can be avoided, and more young people can go on to study.',
          focus: ['grammar', 'cohesion'],
          note: {
            zh: 'If the government pay → Where the state covers：修正条件句里的主谓一致，并用 Where 引导的紧凑结构承接上一句的 the loss，指代明确。',
            en: 'The condition clause is corrected and compressed into Where the state covers the cost, which picks up that loss from the previous sentence.',
          },
        },
        {
          paragraph: 3,
          low: 'Secondly, free university education also have some bad points, so we should think about it carefully.',
          high: 'A second consideration is the financial burden that such a policy places on the state.',
          focus: ['cohesion', 'lexis'],
          note: {
            zh: 'Secondly → A second consideration；bad points → the financial burden：把机械连接词换成带内容的话题句，读者不必读完整段才知道本段要谈财政负担。',
            en: 'The mechanical Secondly becomes a content-led topic sentence, and bad points is replaced by the specific burden the paragraph will discuss.',
          },
        },
        {
          paragraph: 3,
          low: 'The government need a lot of money to pay for all the students, and this money comes from the people in the country.',
          high: 'Funding a degree for every student requires a large and sustained investment, and that money ultimately comes from the public.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'The government need → requires：修正主谓一致；a lot of money → a large and sustained investment，写出「持续投入」这一层；the people in the country → the public，更简洁也更正式。',
            en: 'The subject-verb error the government need is corrected, and a lot of money becomes a large and sustained investment, a collocation that fits policy writing.',
          },
        },
        {
          paragraph: 3,
          low: 'For example, if the government spend too much money on the university, maybe the hospital and the road will not get enough money.',
          high: 'If too much of it is directed towards universities, hospitals and roads may receive less than they need.',
          focus: ['accuracy', 'grammar'],
          note: {
            zh: 'if the government spend → If too much of it is directed：修正条件句错误，用 of it 指代上句刚提到的预算；删掉口语化的 maybe，hospital / road 改复数以概括公共开支。',
            en: 'If the government spend is corrected, of it ties the sentence to the budget just mentioned, and the spoken maybe gives way to may receive less.',
          },
        },
        {
          paragraph: 3,
          low: 'But I think the government can find the money if they really want to do it, because education is very important.',
          high: 'Even so, this is a question of priorities rather than an argument against the principle itself.',
          focus: ['task', 'cohesion'],
          note: {
            zh: 'But I think → Even so, this is a question of priorities：把情绪化的转折换成让步后的克制衔接，并明确「这是排序问题、不是反对原则」，避免立场摇摆。',
            en: 'The abrupt But I think becomes a controlled concession, Even so, this is a question of priorities, which keeps the position stable instead of shifting it.',
          },
        },
        {
          paragraph: 4,
          low: 'In conclusion, free university education is good but it is also bad for the country.',
          high: 'In conclusion, free university education offers real social benefits, but it is not a policy without cost.',
          focus: ['task', 'lexis'],
          note: {
            zh: 'good but also bad → offers real social benefits, but it is not a policy without cost：结论不再用两极词，重复开篇立场的同时给出可评价的表述，任务回应更完整。',
            en: 'The two-pole good but bad becomes offers real social benefits, but it is not a policy without cost, restating the opening position instead of contradicting it.',
          },
        },
        {
          paragraph: 4,
          low: 'It can help the poor students, but it can also make the government spend too much money every year.',
          high: 'It opens the door for students who would otherwise be excluded, yet it places a heavy burden on public finances.',
          focus: ['grammar', 'lexis'],
          note: {
            zh: 'help the poor students → opens the door for students who would otherwise be excluded：用 who 从句与 would otherwise 表达反事实，句式层次提升；spend too much money → places a heavy burden on public finances。',
            en: 'A relative clause with would otherwise replaces the plain verb phrase, and spend too much money is upgraded to places a heavy burden on public finances.',
          },
        },
        {
          paragraph: 4,
          low: 'So I think the government should think about it carefully and maybe do it step by step.',
          high: 'I would therefore support a gradual expansion, funded from a clearly identified budget, rather than an immediate universal subsidy.',
          focus: ['task', 'cohesion', 'grammar'],
          note: {
            zh: 'maybe do it step by step → a gradual expansion, funded from a clearly identified budget：把犹豫的口语收尾改成带条件的具体主张，分词短语补上「钱从哪来」，therefore 回扣前文论证。',
            en: 'The hesitant ending becomes a concrete proposal; therefore links it to the argument above, and funded from a clearly identified budget answers the funding objection.',
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分版：立场含糊——开头说「好但也有问题」，结尾又说「好也是坏」，全文没有稳定主张；两个主体段各只有一个理由，例子停在「家里没钱的学生」就不再推进，属于部分回应任务。8 分版：开篇就给出「好处真实、但需量力推行」的立场，两个主体段分别推进到人才流失与财政来源，结尾给出可执行主张（逐步推行、预算明确），每段都在回答同一个问题。',
            en: 'Band 5: the position never settles — good but also bad in the opening and the closing — and each body paragraph offers one thin reason with no development, so the task is only partly addressed. Band 8: the stance is stated up front, advanced through talent loss and funding, and closed with a concrete proposal, so every paragraph answers the same question.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：靠 Firstly / Secondly / In conclusion 串联段落，段内句子用 and / but / so 平铺，指代基本是原词重复（university、money 反复出现）。8 分版：段内按「观点→原因→例子→小结」推进，用 this question、that money、the result 等指代承接，连接词只在真正需要让步或转折时出现（whereas、even so、therefore）。',
            en: 'Band 5: paragraphs are held together by Firstly / Secondly / In conclusion, sentences by and / but / so, and reference is mostly word repetition. Band 8: each paragraph moves from claim to reason to example to a short conclusion, reference words carry the links, and connectives appear only where a real contrast or concession is needed.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分版：词汇集中在 good / bad / important / many people think 这一档，搭配也不稳（good at study、a big waste、a lot of money）。8 分版：换成政策话题的常用搭配（free access、public finances、a loss of skilled people、a question of priorities），并把「免费」交替写成 free tuition、the state covers the cost，避免同一个词反复出现。',
            en: 'Band 5: vocabulary stays at the good / bad / important level and collocations are shaky (good at study, a big waste, a lot of money). Band 8: policy-related collocations replace them, and the idea of free tuition is expressed in different ways so the same noun does not repeat.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：简单句为主，典型错误集中在主谓一致（it have、the government need、the country lose）、情态动词拆写（can not）和冠词误用（the society）。8 分版：从句、名词化与分词短语交替出现（whether ... is a question that ...；funded from a clearly identified budget），错误基本清除，复杂结构服务于说理而不是炫技。',
            en: 'Band 5: simple sentences with recurring agreement errors (it have, the government need, the country lose), split modals (can not) and article slips (the society). Band 8: clauses, nominalisation and participle phrases alternate, errors are essentially gone, and complexity serves the argument.',
          },
        },
      ],
      takeaways: {
        zh: [
          'free tuition / the state covers the cost：同一个「免费」概念换说法，避免通篇重复 free education',
          'This is not only a question of fairness; it also allows a country to ...：用递进句把个人层面的理由推到国家层面',
          'Even so, this is a question of priorities rather than an argument against the principle：先让步，再守住立场',
          'funded from a clearly identified budget：用分词短语把主张说到「钱从哪来」这一层',
        ],
        en: [
          'free tuition / the state covers the cost: two ways of expressing the same idea so the phrase does not repeat',
          'This is not only a question of fairness; it also allows a country to ...: a stepped sentence that lifts a personal point to national level',
          'Even so, this is a question of priorities rather than an argument against the principle: concede, then hold the position',
          'funded from a clearly identified budget: a participle phrase that answers where the money comes from',
        ],
      },
    },
  },
  {
    slug: 'task2-discussion-technology',
    task: 'task2',
    category: 'discussion',
    topic: 'technology',
    status: 'published',
    sortOrder: 20,
    content: {
      prompt: {
        en: 'Some people say that digital technology has made communication between people easier and richer, while others believe that it has weakened real human relationships. Discuss both views and give your own opinion.',
        zh: '有人认为数字科技让人与人之间的沟通变得更方便、更丰富；也有人认为它削弱了真实的人际关系。请讨论双方观点，并给出你自己的看法。',
      },
      title: { zh: '科技让人更近还是更远', en: 'Does Technology Bring People Closer?' },
      bandLow: 5,
      bandHigh: 8,
      segments: [
        {
          paragraph: 1,
          low: 'Nowadays, technology is very important in our life, and many people use it every day to talk with other people.',
          high: 'Digital technology now shapes almost every part of daily life, including the way people keep in touch with one another.',
          focus: ['lexis', 'task'],
          note: {
            zh: 'very important in our life → shapes almost every part of daily life：删掉空泛评价，用具体动词 shapes 与范围限定落回话题；talk with other people → keep in touch with one another。',
            en: 'Very important in our life becomes the concrete shapes almost every part of daily life, and the sentence ends on the topic the essay will actually discuss: keeping in touch.',
          },
        },
        {
          paragraph: 1,
          low: 'Some people think technology make people closer, but other people think it make people further.',
          high: 'Some argue that these tools bring people closer, while others believe they push them further apart.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'think ... make → argue that ... bring / believe they push：重复的 think 换成更精确的观点动词，同时修正 technology make 的主谓一致错误；further → further apart 补全搭配。',
            en: 'The repeated think gives way to argue and believe; the agreement error in technology make disappears, and further is completed as further apart.',
          },
        },
        {
          paragraph: 1,
          low: 'I think technology is good for talking with people, but it also can make some problems.',
          high: 'In my view, technology widens the circle of people we can reach, but it cannot by itself make a relationship deeper.',
          focus: ['task', 'lexis', 'grammar'],
          note: {
            zh: 'is good for talking with people → widens the circle of people we can reach：把笼统的「好」写成可论证的范围扩大；make some problems 搭配错误 → cannot by itself make a relationship deeper，同时把立场限定清楚。',
            en: 'Good for talking with people becomes the arguable widens the circle of people we can reach; the faulty make some problems is replaced by a precise limit on what technology can do.',
          },
        },
        {
          paragraph: 2,
          low: 'On the one hand, technology make communication between people more easy and more fast.',
          high: 'On the one hand, digital communication has made contact between people easier and far quicker.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'make → has made：用现在完成时强调持续至今的影响；more easy / more fast → easier / far quicker：修正双重比较级错误，并用 far 加强程度。',
            en: 'The present perfect has made marks an ongoing change; the double comparatives more easy / more fast are corrected to easier and far quicker.',
          },
        },
        {
          paragraph: 2,
          low: 'In the past, people only can write letters to their family and wait for many days to get one answer.',
          high: 'In the past, families separated by distance could only exchange letters and wait days, sometimes weeks, for a reply.',
          focus: ['accuracy', 'grammar', 'lexis'],
          note: {
            zh: 'only can write → could only exchange：修正情态动词位置错误；wait for many days → wait days, sometimes weeks：给「很久」加上层次；主语改成名词化的 families separated by distance。',
            en: 'The misplaced modal only can write becomes could only exchange; the vague many days is sharpened to days, sometimes weeks, and the subject becomes families separated by distance.',
          },
        },
        {
          paragraph: 2,
          low: 'But now we can talk to our family and friends who live in other country very fast, and we can even see their face on the phone.',
          high: 'Today, a single message or video call connects relatives and friends on the other side of the world within seconds, and their faces appear on the screen.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'in other country → on the other side of the world：修正单复数与介词错误；we can talk ... very fast → connects ... within seconds：用具体名词和时间状语替代副词 very fast。',
            en: 'The plural and preposition errors in in other country are fixed; talk very fast becomes connects ... within seconds, replacing an adverb with a concrete measure.',
          },
        },
        {
          paragraph: 2,
          low: 'For example, a student who study abroad can see his parents every week by video call, so he do not feel lonely in a new place.',
          high: 'A student studying abroad, for instance, can see his parents every week by video call, which keeps loneliness at a distance in an unfamiliar place.',
          focus: ['grammar', 'accuracy', 'cohesion'],
          note: {
            zh: 'who study → studying：改成分词短语，去掉主谓一致错误；so he do not feel lonely → which keeps loneliness at a distance：用 which 从句承接整句结果，衔接更紧。',
            en: 'The relative clause with its agreement errors becomes a participle phrase; the flat so he do not feel lonely becomes a which clause that ties the result to the whole situation.',
          },
        },
        {
          paragraph: 3,
          low: 'On the other hand, some people say technology make people less close, and I think this is also true.',
          high: 'On the other hand, critics argue that constant connectivity can weaken the very ties it is meant to serve, and this concern is a fair one.',
          focus: ['task', 'lexis', 'grammar'],
          note: {
            zh: 'some people say → critics argue；technology make → constant connectivity can weaken：修正主谓一致，并把随意表态的「我觉得也对」换成 this concern is a fair one，给出明确的评价。',
            en: 'Some people say becomes critics argue, the agreement error is gone, and I think this is also true turns into the considered this concern is a fair one.',
          },
        },
        {
          paragraph: 3,
          low: 'When people meet together in a restaurant, everybody is looking at their phone and nobody talk to each other.',
          high: 'When friends meet in a restaurant, it is now common to see everyone staring at a screen instead of talking to one another.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'meet together（语义重复）→ meet；nobody talk → 用 instead of talking 避免主谓一致错误；everybody is looking at their phone → it is now common to see everyone staring at a screen：从单个画面升级为普遍现象。',
            en: 'The redundant meet together and the agreement slip nobody talk are fixed; the single scene becomes a reported pattern with it is now common to see.',
          },
        },
        {
          paragraph: 3,
          low: 'Also, talking on the internet is not same as talking face to face, because we can not see the real feeling of other people.',
          high: 'Online conversation also lacks the tone, the gestures and the shared silence that carry much of a face-to-face exchange.',
          focus: ['accuracy', 'lexis', 'grammar'],
          note: {
            zh: 'is not same as（缺冠词、搭配生硬）→ lacks；the real feeling → the tone, the gestures and the shared silence：把笼统的「真实感觉」拆成可观察的沟通要素，并删掉多余的 because 从句。',
            en: 'The faulty is not same as becomes the verb lacks; the real feeling is broken into observable elements — tone, gestures and shared silence.',
          },
        },
        {
          paragraph: 3,
          low: 'So maybe the relation between people become weaker and weaker, and people feel more alone.',
          high: 'Relationships may therefore grow broader but noticeably shallower, leaving people more isolated than before.',
          focus: ['lexis', 'grammar', 'cohesion'],
          note: {
            zh: 'the relation ... become → Relationships may therefore grow：修正主谓一致；weaker and weaker → broader but shallower：用对比把「变弱」说得更准；分词短语 leaving ... 收束结果。',
            en: 'The agreement error and the vague weaker and weaker give way to broader but noticeably shallower, with therefore carrying the logic and leaving people more isolated closing the sentence.',
          },
        },
        {
          paragraph: 4,
          low: 'In conclusion, technology have two sides for the communication between people in the modern life.',
          high: 'In conclusion, technology has changed communication in ways that are both enabling and limiting.',
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'technology have → technology has：修正主谓一致；two sides（含义不明）→ in ways that are both enabling and limiting，直接说出「两面」是什么；删掉 in the modern life 这类多余限定。',
            en: 'The agreement error is fixed, and the cliché two sides becomes in ways that are both enabling and limiting, which says what the two sides are.',
          },
        },
        {
          paragraph: 4,
          low: 'It help us to keep in touch with people who are far away, but it also make us forget the people who are in front of us.',
          high: 'It keeps distant relationships alive, yet it can quietly displace the attention owed to those who are physically present.',
          focus: ['grammar', 'lexis'],
          note: {
            zh: 'help / make 两处主谓一致错误 → keeps / can displace；forget the people who are in front of us → displace the attention owed to those who are physically present：把「忘掉眼前的人」写成更准确的「注意力被挤走」。',
            en: 'Both agreement errors are corrected, and forget the people in front of us becomes displace the attention owed to those who are physically present.',
          },
        },
        {
          paragraph: 4,
          low: 'So I think we should use technology in a good way, and we should not spend too much time on it every day.',
          high: 'The sensible approach is to use these tools deliberately, rather than to let them fill every quiet moment of the day.',
          focus: ['task', 'cohesion', 'lexis'],
          note: {
            zh: 'in a good way（含糊）→ deliberately；not spend too much time → rather than to let them fill every quiet moment of the day：用「有意使用」替掉空泛的「好好使用」，并用 rather than 结构保留原句的取舍。',
            en: 'In a good way becomes the usable deliberately, and the plain negative turns into a rather than contrast that keeps the original trade-off.',
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分版：双方观点都提到了，但各只有一句解释，自己的立场（I think this is also true）含糊且摇摆，结尾只是泛泛建议，属于部分回应。8 分版：开篇就说明「科技扩大了可及范围，但不会自动加深关系」，两个主体段各自把现象写具体（视频通话、聚餐看手机），结尾给出可操作的做法，立场贯穿全文。',
            en: 'Band 5: both views appear, but each is explained in a single sentence, the essay never commits to a clear position, and the ending is a generic suggestion, so the task is only partly addressed. Band 8: the position is stated at the start and maintained — technology widens reach without deepening ties — each body paragraph gives a concrete picture, and the conclusion offers a workable approach.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：On the one hand / On the other hand / In conclusion 撑起结构，段内靠 and / but / so 拼接，指代多是原词重复（technology、people 反复出现）。8 分版：同样的路标词后面接的是具体内容，指代靠 these tools、this concern、the result 承接，连接词只在必要处出现（yet、therefore、rather than）。',
            en: 'Band 5: the essay is held up by On the one hand / On the other hand / In conclusion, with and / but / so inside paragraphs and heavy noun repetition. Band 8: the same signposts introduce concrete material, reference words carry the links, and connectives appear only where the logic needs them.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分版：technology / people / good 反复出现，搭配不准确（more easy、not same as、make some problems）。8 分版：改用数字沟通话题的常见搭配（constant connectivity、face-to-face exchange、distant relationships、displace the attention），并用同义替换避免重复。',
            en: 'Band 5: technology, people and good recur, and collocations fail (more easy, not same as, make some problems). Band 8: natural collocations for digital communication replace them, and synonyms keep the key nouns from repeating.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：主谓一致错误密集（technology make、nobody talk、the relation become、technology have），情态动词位置错误（only can write），比较级重复（more easy and more fast）。8 分版：分词短语（studying abroad、leaving people more isolated）、定语从句和 it is common to see 这类结构交替使用，错误基本清除。',
            en: 'Band 5: agreement errors cluster (technology make, nobody talk, the relation become, technology have), the modal is misplaced (only can write), and comparatives double up. Band 8: participle phrases, relative clauses and impersonal constructions alternate, with errors essentially eliminated.',
          },
        },
      ],
      takeaways: {
        zh: [
          'keep in touch / on the other side of the world / within seconds：写「联系方便」用具体的时间与距离，不用 very fast',
          'it is now common to see everyone staring at a screen：用 it is common to see 概括普遍现象，避开 everybody + their 的指代问题',
          'Online conversation also lacks the tone, the gestures and the shared silence：把抽象缺点拆成可观察的要素',
          'rather than to let them fill every quiet moment of the day：用 rather than 给出取舍，收尾不空泛',
        ],
        en: [
          'keep in touch / on the other side of the world / within seconds: show easier contact through time and distance instead of very fast',
          'it is now common to see everyone staring at a screen: report a pattern rather than one blurred example',
          'lacks the tone, the gestures and the shared silence: break a vague weakness into observable elements',
          'rather than to let them fill every quiet moment of the day: a contrast structure that makes the advice concrete',
        ],
      },
    },
  },
];
