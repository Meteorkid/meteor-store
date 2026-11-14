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
          translationZh: {
            low: '如今，很多人认为大学教育应该对所有学生免费。',
            high: '在许多国家，大学学费应由政府承担还是由学生自己支付，是一个令公众意见分歧的问题。',
          },
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
          expressionEdits: [
            {
              before: 'but other people do not agree',
              after: 'whereas critics doubt that it can be funded',
              focus: 'cohesion',
              explanation: {
                zh: 'whereas 对照两方立场，同时交代反对的具体理由。',
                en: 'Whereas contrasts the two positions and introduces the reason for the objection.',
              },
            },
          ],
          translationZh: {
            low: '有些人赞成这个想法，但另一些人不赞成，所以这个话题很有争议。',
            high: '支持者认为免费接受大学教育关乎公平，而反对者怀疑能否为此提供资金，因此双方的分歧既涉及道德，也涉及实际可行性。',
          },
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
          expressionEdits: [
            {
              before: 'is good for the society',
              after: 'brings clear social benefits',
              focus: 'lexis',
              explanation: {
                zh: '把笼统的 good for 换成“带来社会效益”，观点更具体。',
                en: 'Replace the vague good for with a clear statement of the social benefit.',
              },
            },
          ],
          translationZh: {
            low: '在我看来，免费大学教育对社会有好处，但它也有一些问题。',
            high: '在我看来，免费大学教育能带来明显的社会效益，但必须以公共财政能够持续承受的方式推行。',
          },
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
          expressionEdits: [
            {
              before: 'because poor students can not pay the fees by themselves',
              after: 'regardless of whether their family can afford the fees',
              focus: 'grammar',
              explanation: {
                zh: '用 regardless of whether 引出“不论家庭是否负担得起”的条件，突出机会平等。',
                en: 'Regardless of whether makes equal access independent of a family’s ability to pay.',
              },
            },
          ],
          translationZh: {
            low: '首先，免费教育让每个学生都有同样的上大学机会，因为贫困学生无法自己支付学费。',
            high: '首先，免学费让每个有能力的学生都有同样的大学入学机会，无论其家庭是否付得起学费。',
          },
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'give → gives：修正主谓一致；此处表示无力支付，通常合写 cannot。升级句用 regardless of whether their family can afford the fees，把经济状况写成不应影响机会的条件，比 poor students 更明确。',
            en: 'Corrects give to gives. For inability to pay, cannot is the usual spelling. Regardless of whether their family can afford the fees presents income as a condition that should not determine access, making the point more explicit than poor students.',
          },
        },
        {
          paragraph: 2,
          low: 'Many people think this is fair, and it is also good for the country, because everybody can use their talent.',
          high: 'This is not only a question of fairness; it also allows a country to make use of the abilities of its whole population.',
          translationZh: {
            low: '很多人认为这很公平，而且这也对国家有好处，因为每个人都能发挥自己的才能。',
            high: '这不仅关乎公平，也让一个国家能够发挥全体民众的能力。',
          },
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
          expressionEdits: [
            {
              before: 'a student who is very good at study',
              after: 'talented school-leavers',
              focus: 'lexis',
              explanation: {
                zh: '用紧凑的名词短语指称有能力的毕业生，避免绕着 good 描述。',
                en: 'A precise noun phrase identifies talented students without a long good-at description.',
              },
            },
          ],
          translationZh: {
            low: '例如，在很多地方，一个学习很好的学生会因为家里没钱而无法上大学。',
            high: '在许多地方，有才华的中学毕业生仅仅因为家里无钱支持，就无法接受大学录取并入学。',
          },
          focus: ['accuracy', 'grammar'],
          note: {
            zh: 'good at study → talented：修正不自然的搭配；are unable to take up a place 明确无法接受录取，simply because 突出经济障碍。family 在英式英语中可接复数谓语，因此不能把 family have 一律判错。',
            en: 'Replaces the unnatural good at study with talented. Unable to take up a place specifies the missed opportunity, while simply because highlights the financial barrier. Family can take plural agreement in British English, so family have is not automatically an error.',
          },
        },
        {
          paragraph: 2,
          low: 'So the country lose a lot of clever people, and this is a big waste for the future of the country.',
          high: 'The result is a loss of skilled people that is difficult to justify and costly to repair.',
          translationZh: {
            low: '所以，国家失去了很多聪明的人，这对国家的未来来说是很大的浪费。',
            high: '结果是技能人才的损失，这种损失既难以被视为合理，弥补起来又代价高昂。',
          },
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
          translationZh: {
            low: '如果政府出这笔钱，这个问题就不会发生，更多年轻人也能上学。',
            high: '在政府承担费用的情况下，这种损失可以避免，更多年轻人也能继续深造。',
          },
          focus: ['grammar', 'cohesion'],
          note: {
            zh: 'Where the state covers 表示“在政府承担费用的情况下”，不只表示地点；that loss 承接上句的人才损失，can be avoided 比 will not happen 更审慎。government 在英式英语中可按整体或成员采用单数或复数。',
            en: 'Where means in situations where, not only a location. That loss refers to the preceding loss of talent, and can be avoided is less absolute than will not happen. British English permits singular or plural agreement with government depending on the intended meaning.',
          },
        },
        {
          paragraph: 3,
          low: 'Secondly, free university education also have some bad points, so we should think about it carefully.',
          high: 'A second consideration is the financial burden that such a policy places on the state.',
          expressionEdits: [
            {
              before: 'some bad points',
              after: 'the financial burden',
              focus: 'lexis',
              explanation: {
                zh: '把含糊的“缺点”命名为财政负担，让段落主题一眼可见。',
                en: 'Name the financial burden directly so the paragraph’s concern is immediately clear.',
              },
            },
          ],
          translationZh: {
            low: '其次，免费大学教育也有一些不好的地方，所以我们应该认真考虑。',
            high: '第二个需要考虑的问题，是这项政策给政府带来的财政负担。',
          },
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
          translationZh: {
            low: '政府需要很多钱来支付所有学生的费用，而这些钱来自这个国家的民众。',
            high: '资助每个学生完成学位需要大量且持续的投入，而这笔钱最终来自公众。',
          },
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: '主语改为动名词短语 Funding a degree...，因此谓语用 requires；a lot of money 本身正确，改成 a large and sustained investment 是补出持续投入这一含义。the public 简洁概括资金承担者。',
            en: 'Funding a degree is a gerund phrase functioning as a singular subject, so it takes requires. A lot of money is correct; a large and sustained investment adds the idea of continuing expenditure. The public concisely identifies who supplies the funds.',
          },
        },
        {
          paragraph: 3,
          low: 'For example, if the government spend too much money on the university, maybe the hospital and the road will not get enough money.',
          high: 'If too much of it is directed towards universities, hospitals and roads may receive less than they need.',
          translationZh: {
            low: '例如，如果政府在大学上花了太多钱，医院和道路可能就得不到足够的资金。',
            high: '如果其中过多的资金流向大学，医院和道路获得的资金可能就不足以满足需要。',
          },
          focus: ['accuracy', 'grammar'],
          note: {
            zh: 'If too much of it is directed 用被动结构保持资金这一话题，of it 回指上句的 money；may receive less 简洁表达可能后果。universities、hospitals、roads 用复数概括公共开支类别，而不是特指一所学校或医院。',
            en: 'The passive If too much of it is directed keeps funding as the topic, and of it refers to the preceding money. May receive less expresses a possible consequence. Plural universities, hospitals and roads refer to spending categories rather than particular institutions.',
          },
        },
        {
          paragraph: 3,
          low: 'But I think the government can find the money if they really want to do it, because education is very important.',
          high: 'Even so, this is a question of priorities rather than an argument against the principle itself.',
          expressionEdits: [
            {
              before: 'But I think',
              after: 'Even so',
              focus: 'cohesion',
              explanation: {
                zh: 'Even so 承接已承认的成本，再转回支持立场，转折更紧密。',
                en: 'Even so concedes the cost already discussed before returning to the supporting position.',
              },
            },
          ],
          translationZh: {
            low: '但我认为，只要政府真的想做，就能找到这笔钱，因为教育非常重要。',
            high: '即便如此，这也只是如何安排优先次序的问题，而不是反对这一原则本身的理由。',
          },
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
          translationZh: {
            low: '总之，免费大学教育对国家有好处，但也有坏处。',
            high: '总之，免费大学教育带来了实实在在的社会效益，但这并非一项没有代价的政策。',
          },
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
          expressionEdits: [
            {
              before: 'help the poor students',
              after: 'opens the door for students who would otherwise be excluded',
              focus: 'grammar',
              explanation: {
                zh: 'who would otherwise… 说明没有这项政策时的结果，让受益对象更清楚。',
                en: 'Who would otherwise… explains what would happen without the policy and clarifies who benefits.',
              },
            },
          ],
          translationZh: {
            low: '它可以帮助贫困学生，但也可能让政府每年花费太多钱。',
            high: '它为原本会被挡在大学门外的学生打开了机会之门，却也给公共财政带来了沉重负担。',
          },
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
          expressionEdits: [
            {
              before: 'do it step by step',
              after: 'support a gradual expansion',
              focus: 'lexis',
              explanation: {
                zh: '把口语化的 step by step 写成渐进扩展政策，结论更明确。',
                en: 'A gradual expansion turns an informal step-by-step suggestion into a clear policy position.',
              },
            },
          ],
          translationZh: {
            low: '所以我认为政府应该认真考虑，也许可以一步一步地推行。',
            high: '因此，我会支持在明确划定的预算支持下逐步扩大免费大学教育，而不是立即向所有学生提供补贴。',
          },
          focus: ['task', 'cohesion', 'grammar'],
          note: {
            zh: 'maybe do it step by step → a gradual expansion, funded from a clearly identified budget：把犹豫的口语收尾改成带条件的具体主张，分词短语补上「钱从哪来」，therefore 回扣前文论证。',
            en: 'The hesitant ending becomes a concrete proposal; therefore links it to the argument above, and funded from a clearly identified budget answers the funding objection.',
          },
        },
      ],
      learning: {
        taskAnalysis: {
          zh: '这是观点题，核心是政府是否应为所有大学生承担学费，以及你同意到什么程度；写出优缺点后仍须作出判断。本文采取有条件支持：认可入学公平与人才培养，同时主张预算明确、逐步扩大。论证顺序是经济障碍造成机会损失，再讨论公共开支的取舍，最后回答实施方式。低分示例的 good but bad 没有交代权衡标准；升级版更清楚，但引言若直接说明反对立即全面补贴，立场会更鲜明。文中主要讨论 tuition，不宜据此推论所有生活费用也应免费。分档用于对照学习，不能把词长或篇幅当作评分依据。',
          en: 'This is an opinion task: decide whether the state should fund university tuition for all students and specify the extent of your agreement. Listing benefits and costs is insufficient without a judgement. The essay supports the principle conditionally, moving from access and talent to competing public needs, then proposing gradual expansion with an identified budget. The lower version says good but bad without explaining how to weigh the two. The revised version is clearer, although stating its opposition to immediate universal funding in the introduction would sharpen the position. Its argument concerns tuition, not every living expense. The band labels are learning references, not scores determined by word length or essay length.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '引言：界定资助争议，提出有条件支持', en: 'Introduction: frame the funding debate and qualify support' },
            analysis: {
              zh: '原版连续说有人赞成、有人反对，却没有说明争议内容。升级版把公平与财政可行性并列，再用 although 限定支持条件。迁移时先找出政策带来的价值与实施约束，并在立场句说清支持程度；不要只写“有好处也有问题”。',
              en: 'The original repeats that some agree and others disagree without explaining the dispute. The revision contrasts fairness with affordability and uses although to qualify support. For another policy topic, identify its benefit and its practical constraint, then state how far you support it rather than merely saying it has advantages and problems.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '主体一：从入学机会推进到人才损失', en: 'Body one: connect access to the loss of talent' },
            analysis: {
              zh: '本段按学费障碍、个人机会、国家人才损失、公共资助的作用推进。升级版用 that loss 接住上句结果，比重复 this problem 更明确。例子仍是一般情境；练习时可补出学生放弃录取后的具体影响，避免把免学费写成消除全部入学障碍。',
              en: 'The paragraph develops a chain from tuition barriers to lost opportunities, lost talent and the role of public funding. That loss clearly refers back to the preceding consequence. The example remains general: a practice revision could explain what follows when a student cannot accept an offer, while avoiding the claim that removing tuition removes every barrier to university.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '主体二：承认财政代价，再回应反对意见', en: 'Body two: acknowledge the cost and answer the objection' },
            analysis: {
              zh: '原版用“教育重要，所以能找到钱”跳过预算难题。升级版先解释持续投入来自公众，再以医院和道路说明资源取舍，最后区分实施难度与政策原则。迁移时让反方理由成立后再回应；优先级仍需依据，不能只靠一句转折消除财政限制。',
              en: 'The original assumes money can be found because education matters. The revision identifies sustained public funding and illustrates competing needs through hospitals and roads before distinguishing implementation from principle. When transferring this structure, acknowledge a credible objection before answering it; calling something a priority still needs justification and does not remove a budget constraint.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '结论：用实施条件回答同意程度', en: 'Conclusion: express the degree of agreement through conditions' },
            analysis: {
              zh: '原版的“好也不好”重复两面评价，结论没有决断。升级版重述机会与财政之间的权衡，再选择逐步扩大且预算明确的方案。迁移时把前文的限制转成结论条件，并确保引言已预告这种立场，不要到最后才突然提出与全文无关的新政策。',
              en: 'The original repeats good and bad without reaching a decision. The revision restates the trade-off and chooses gradual expansion with clear funding. Turn a constraint established in the body into a condition in the conclusion, and make sure the introduction has prepared the reader for this position rather than introducing an unrelated policy at the end.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '把模糊保留意见写成可判断的条件', en: 'Turn a vague reservation into a testable condition' },
            explanation: {
              zh: '原句的 some problems 没有告诉读者哪种问题会影响支持程度。升级句先肯定社会收益，再用 although 引出财政承受能力，后文就有了必须回应的条件。写交通补贴或公共医疗时也可先说收益，再说明预算、覆盖范围或执行条件；条件要在主体段展开，不能只作结尾装饰。',
              en: 'Some problems gives no basis for judging the extent of support. The revision first states a social benefit, then introduces fiscal capacity with although, creating a condition the body must examine. For transport subsidies or public healthcare, name the benefit and a budget, coverage or implementation condition, then develop that condition rather than leaving it as a decorative qualification.',
            },
            segmentIndex: 2,
          },
          {
            title: { zh: '用明确指代把问题与措施接起来', en: 'Use precise reference to connect a problem and a response' },
            explanation: {
              zh: '原句的“这个问题”指向宽泛，“不会发生”又把结果说得过满。升级句用 that loss 承接上一句的人才损失，并将必然结果改为可能改善。迁移时先命名损失或障碍，再用指示词加同一名词承接；只有前文指向唯一时才省略名词，否则衔接反而会模糊。',
              en: 'This problem is broad, and will not happen makes an absolute promise. That loss identifies the loss of talent in the preceding sentence, while can be avoided presents a possible improvement. First name a specific loss or barrier, then refer to it with a demonstrative and the same noun. Avoid a bare pronoun when more than one preceding idea could be its referent.',
            },
            segmentIndex: 7,
          },
          {
            title: { zh: '承认反对理由后，说明它影响哪一层', en: 'After conceding an objection, specify what it challenges' },
            explanation: {
              zh: '原版凭“只要想做就能找钱”回避财政负担。升级句的 Even so 承认前面的资源竞争，再区分优先排序与政策原则，保持有条件支持的主线。迁移时判断反对意见推翻的是目标还是实施方式，再针对该层回应；本句仍需预算论证，连接词本身不能替代证据。',
              en: 'The original sidesteps the burden by assuming governments can find money if they want to. Even so acknowledges competing needs before distinguishing priorities from principle. Decide whether an objection challenges the goal or its implementation, then answer at that level. This sentence still needs a funding argument: the connective signals reasoning but cannot supply evidence for it.',
            },
            segmentIndex: 11,
          },
          {
            title: { zh: '让结论中的措施回应前文限制', en: 'Make the concluding proposal answer the earlier constraint' },
            explanation: {
              zh: '原版的“也许”和“仔细考虑”只表达犹豫。升级句以“逐步扩大”回答推进速度，以 funded from... 补出资金条件，并排除立即全面补贴。迁移时从主体段找出一个真实限制，写成相应条件；分词短语在此修饰扩大资助的方案，不要误接成作者获得资助。',
              en: 'Maybe and think about it carefully express hesitation without a decision. Gradual expansion specifies the pace, funded from adds a funding condition, and rather than rejects immediate universal support. Take a constraint established in the body and turn it into a matching condition. Here, the participle phrase modifies expansion, not the writer, so its attachment must remain clear.',
            },
            segmentIndex: 14,
          },
        ],
        mistakes: [
          {
            zh: '先检查确定的主谓一致错误：free education give、the country lose 应为 gives、loses。但 family 和 government 在英式英语中可按整体或成员搭配单数或复数，不能把所有复数谓语一律判错；本篇表达统一政策主体时，单数形式更一致。',
            en: 'Correct clear agreement errors such as free education give and the country lose to gives and loses. In British English, family and government can take singular or plural agreement depending on whether the group or its members are intended. Do not label every plural verb wrong; singular agreement is more consistent when presenting one policy-making body here.',
          },
          {
            zh: '本篇表示“没有能力支付”时通常写 cannot afford；can not 并非任何语境都错误，例如强调可以选择不做时可分写。泛指社会用 society，通常不加 the；good at study 在此不自然，可写 good at studying 或 academically able，不能只换一个生僻词就跳过搭配检查。',
            en: 'For inability to pay, cannot afford is the usual form. Can not is not universally wrong: separate not can negate an action that someone has the option not to perform. Use society without the for society in general. Good at study is unnatural here; good at studying or academically able conveys the intended meaning. Check the construction rather than replacing a word mechanically.',
          },
          {
            zh: '免费学费并不自动保证每个学生都能入学，生活费、成绩与名额仍可能构成障碍。the same chance 的范围应限定在经济门槛；同样，priorities 不能证明预算一定充足。练习时给这些概括补上条件，比把所有 good、bad 都换成长词更能提高论证准确性。',
            en: 'Free tuition does not guarantee access for every student: living costs, qualifications and places can still matter. Restrict the claim about the same chance to the financial barrier, and do not treat priorities as proof that sufficient funding exists. Adding an appropriate condition improves the argument more than replacing every simple adjective with a longer word.',
          },
        ],
        vocabulary: [
          {
            term: 'tuition',
            partOfSpeech: 'noun · 名词',
            meaning: { zh: '本篇指大学收取的学费，不包括住宿、饮食等所有学习成本。', en: 'The university fees paid for teaching, rather than every cost of being a student.' },
            usage: { zh: '表示学费时通常不可数，可说 pay tuition 或 tuition fees；英式英语中 tuition 也可指教学，需由语境判断。不要写 a tuition 来表示一笔学费。', en: 'Usually uncountable in this sense: pay tuition or tuition fees. In British English, tuition can also mean teaching, so context matters. Avoid a tuition for a tuition payment.' },
            collocations: ['tuition fees', 'pay tuition', 'free tuition'],
            example: { en: 'The scholarship covers tuition but leaves students responsible for rent.', zh: '这项奖学金承担学费，但学生仍须自行支付房租。' },
            segmentIndex: 0,
          },
          {
            term: 'public finances',
            partOfSpeech: 'plural noun phrase · 复数名词短语',
            meaning: { zh: '政府的收入、支出与总体财政状况，文中用于判断政策能否持续负担。', en: 'Government income, spending and financial position, used here to assess affordability.' },
            usage: { zh: 'finances 在此用复数，作主语时配复数谓语；常接压力、负担或改善等表达。public finance 单数形式还可指公共财政这一研究领域。', en: 'Finances is plural and takes a plural verb when it is the subject. Use it with pressure, burden or improvement. Public finance can also name the academic field.' },
            collocations: ['pressure on public finances', 'sound public finances', 'improve public finances'],
            example: { en: 'A permanent subsidy could put further pressure on public finances.', zh: '一项长期补贴可能给公共财政带来更大压力。' },
            segmentIndex: 2,
          },
          {
            term: 'regardless of',
            partOfSpeech: 'prepositional phrase · 介词短语',
            meaning: { zh: '不受某个条件影响；本篇强调家庭支付能力不应决定入学机会。', en: 'Without being affected by a condition; here, a family’s ability to pay should not determine access.' },
            usage: { zh: 'of 后接名词、动名词或 whether 从句，如 regardless of income / whether...；不要直接接 that 陈述句，也不要漏掉 of。', en: 'Follow of with a noun, an -ing form or a whether clause: regardless of income or regardless of whether. Do not omit of or attach a plain that clause.' },
            collocations: ['regardless of income', 'regardless of age', 'regardless of whether'],
            example: { en: 'The library offers free membership regardless of household income.', zh: '这家图书馆不论家庭收入高低，都提供免费会员资格。' },
            segmentIndex: 3,
          },
          {
            term: 'take up a place',
            partOfSpeech: 'verb phrase · 动词短语',
            meaning: { zh: '接受录取并入学，文中不是指占据一个物理位置。', en: 'Accept an offered place and begin studying, rather than occupy physical space.' },
            usage: { zh: '可接 at a university 或 on a course；take up 在此表示接受机会。注意区分 receive an offer（获得录取）与 take up a place（实际接受入学）。', en: 'Use at a university or on a course after place. Take up means accept an opportunity here. Receiving an offer and taking up the offered place are different stages.' },
            collocations: ['take up a place at university', 'take up an offer', 'take up a scholarship'],
            example: { en: 'She needed help with living costs before she could take up a place at university.', zh: '她需要先获得生活费资助，才能接受大学录取并入学。' },
            segmentIndex: 5,
          },
          {
            term: 'sustained investment',
            partOfSpeech: 'noun phrase · 名词短语',
            meaning: { zh: '持续一段时间的投入，强调免费大学教育不能只靠一次拨款。', en: 'Investment maintained over time, rather than a single payment.' },
            usage: { zh: 'investment in 后接投入领域；sustained 强调持续发生，sustainable 强调能够长期维持，两者不能因都含“持续”就互换。', en: 'Use investment in to name the funded area. Sustained means maintained over time; sustainable means capable of being maintained. The two adjectives are not interchangeable.' },
            collocations: ['sustained investment in education', 'require sustained investment', 'sustained public investment'],
            example: { en: 'Training enough teachers requires sustained investment in professional development.', zh: '培养足够的教师需要持续投入教师专业发展。' },
            segmentIndex: 9,
          },
          {
            term: 'priorities',
            partOfSpeech: 'plural noun · 复数名词',
            meaning: { zh: '需要优先处理或资助的事项，文中指公共预算的支出次序。', en: 'Matters given precedence, especially competing claims on public spending here.' },
            usage: { zh: '单数 priority 表示一个优先事项；give priority to 中 to 是介词，后接名词或动名词。set priorities 是确定次序，不等于已经解决资金短缺。', en: 'Priority is singular when naming one concern. In give priority to, to is a preposition followed by a noun or -ing form. Setting priorities does not itself solve a funding shortage.' },
            collocations: ['set priorities', 'competing priorities', 'spending priorities'],
            example: { en: 'The council must balance housing and education among its spending priorities.', zh: '市政委员会必须在住房和教育等优先支出事项之间作出平衡。' },
            segmentIndex: 11,
          },
          {
            term: 'excluded',
            partOfSpeech: 'past participle · 过去分词',
            meaning: { zh: '被挡在大学教育机会之外；此处强调学费障碍，而非学生主动退出。', en: 'Prevented from accessing university opportunities because of a financial barrier.' },
            usage: { zh: '原句 would be excluded 是被动结构；常用 exclude someone from something。exclude 不等于 expel，后者通常指已入学或加入后被开除。', en: 'Would be excluded is passive. Use exclude someone from something. Exclude differs from expel, which normally means removing someone who has already joined or enrolled.' },
            collocations: ['be excluded from education', 'exclude applicants', 'financially excluded'],
            example: { en: 'Students should not be excluded from field trips because they cannot afford the fee.', zh: '不应因为学生付不起费用就让他们失去参加实地考察的机会。' },
            segmentIndex: 13,
          },
          {
            term: 'universal subsidy',
            partOfSpeech: 'noun phrase · 名词短语',
            meaning: { zh: '面向目标群体所有人的补贴；本篇指所有大学生均获得学费补贴。', en: 'A subsidy available to everyone in the relevant group, here all university students.' },
            usage: { zh: 'subsidy 是可数名词，复数 subsidies；可说 a subsidy for students 或 a subsidy on a service。universal 说明覆盖面广，不等于补贴金额无限。', en: 'Subsidy is countable; its plural is subsidies. Use a subsidy for students or a subsidy on a service. Universal describes coverage, not an unlimited payment.' },
            collocations: ['a universal subsidy', 'provide a subsidy', 'a tuition subsidy'],
            example: { en: 'A universal subsidy would help wealthy students as well as those on low incomes.', zh: '普惠补贴既会帮助低收入学生，也会惠及富裕家庭的学生。' },
            segmentIndex: 14,
          },
        ],
      },
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分版：已有机会公平、人才损失与财政取舍的论证，但“好也不好”没有交代如何权衡，“想做就能找到钱”也缺乏支持。8 分版：以财政可承受为条件支持免费大学教育，结尾明确逐步扩大而非立即全面补贴。升级在于立场与条件更具体；例子仍较概括，引言也可以更直接预告同意程度。',
            en: 'Band 5: access, lost talent and competing spending are already discussed, but good and bad gives no weighing principle, and the funding claim lacks support. Band 8: support is conditional on affordability, with gradual expansion rather than immediate universal funding. The position is more specific, though examples remain general and the introduction could state the degree of agreement more directly.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：靠 Firstly / Secondly / In conclusion 串联段落，段内常用 and / but / so 平铺，university、money 反复出现。8 分版：用 that loss、that money 承接具体概念，并以 The result 引出后果，逻辑关系更明确。问题不在于 Firstly 等词不能使用，而在于路标之后有没有内容上的推进。',
            en: 'Band 5: paragraphs are held together by Firstly / Secondly / In conclusion, sentences by and / but / so, and reference is mostly word repetition. Band 8: each paragraph moves from claim to reason to example to a short conclusion, reference words carry the links, and connectives appear only where a real contrast or concession is needed.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分版：good / bad / important 等评价词反复出现，good at study 搭配不自然；a lot of money 和 a big waste 本身并非错误，只是具体含义较少。8 分版：public finances、sustained investment 等搭配说明财政与投入性质，free tuition 和 the state covers the cost 从学生与政府角度表达资助。重点是准确与信息量，不是词越长越好。',
            en: 'Band 5: broad evaluative words recur, and good at study is unnatural. A lot of money and a big waste are valid expressions but give limited detail. Band 8: public finances and sustained investment specify the policy context; free tuition and the state covers the cost describe funding from two perspectives. Precision matters more than word length.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：已有 because、if、who 从句，但 it have、free education give、the country lose 等一致错误反复出现，泛指社会时 the society 多了冠词。8 分版：从句、名词化与分词短语交替出现，准确性更稳定。cannot 是本文否定能力的常用拼写；family、government 的集合名词一致规则需结合英式英语语境判断。',
            en: 'Band 5: because, if and who clauses already appear, but errors recur in it have, free education give and the country lose, and general society does not need the. Band 8: clauses, nominalisation and participle phrases show more stable control. Cannot is the usual spelling for inability here; agreement with family and government requires attention to British English usage.',
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
          translationZh: {
            low: '如今，科技在我们的生活中非常重要，很多人每天都用它与别人交谈。',
            high: '如今，数字科技塑造着日常生活的几乎每个方面，包括人们彼此保持联系的方式。',
          },
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
          expressionEdits: [
            {
              before: 'make people further',
              after: 'push them further apart',
              focus: 'accuracy',
              explanation: {
                zh: '描述关系疏远要用 further apart；原表达缺少 apart，含义不完整。',
                en: 'Further apart expresses distance in a relationship; further alone leaves the meaning incomplete.',
              },
            },
          ],
          translationZh: {
            low: '有些人认为科技让人们更亲近，但另一些人认为它让人们更疏远。',
            high: '有人主张，这些工具拉近了人与人之间的距离；另一些人则认为，它们让彼此更加疏远。',
          },
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
          expressionEdits: [
            {
              before: 'is good for talking with people',
              after: 'widens the circle of people we can reach',
              focus: 'lexis',
              explanation: {
                zh: '把“有利于交流”具体化为扩大可联系的人际范围，便于后文讨论。',
                en: 'Specify the benefit as a wider circle of contacts, giving the discussion a clear focus.',
              },
            },
          ],
          translationZh: {
            low: '我认为科技有助于与人交流，但它也可能带来一些问题。',
            high: '在我看来，科技扩大了我们能够联系到的人群范围，但仅凭科技本身并不能让一段关系更加深厚。',
          },
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
          translationZh: {
            low: '一方面，科技让人与人之间的沟通变得更容易、更快。',
            high: '一方面，数字通信已经让人与人之间的联系变得更方便，速度也快得多。',
          },
          focus: ['grammar', 'accuracy', 'lexis'],
          note: {
            zh: 'make → has made：用现在完成时表达变化对现在的影响；more easy / more fast → easier / far quicker：采用此处自然的比较级形式，并用 far 加强程度。more easier 才是重复标记的“双重比较级”。',
            en: 'The present perfect has made connects the change to the present. Easier and far quicker replace unnatural comparative forms here, with far adding emphasis. More easier, rather than more easy, would contain duplicated comparative marking.',
          },
        },
        {
          paragraph: 2,
          low: 'In the past, people only can write letters to their family and wait for many days to get one answer.',
          high: 'In the past, families separated by distance could only exchange letters and wait days, sometimes weeks, for a reply.',
          translationZh: {
            low: '过去，人们只能给家人写信，还要等很多天才能收到一封回信。',
            high: '过去，分隔两地的家人只能互通书信，等上数天，有时甚至数周，才能收到回复。',
          },
          focus: ['accuracy', 'grammar', 'lexis'],
          note: {
            zh: 'can → could 与 In the past 的时间一致，only 放在 exchange 前强调选择受限；days, sometimes weeks 具体化等待时间。separated by distance 是修饰 families 的过去分词短语，不是名词化。',
            en: 'Could matches the past setting, while only before exchange focuses on the restricted option. Days, sometimes weeks specifies the wait. Separated by distance is a past-participle phrase modifying families, not nominalisation.',
          },
        },
        {
          paragraph: 2,
          low: 'But now we can talk to our family and friends who live in other country very fast, and we can even see their face on the phone.',
          high: 'Today, a single message or video call connects relatives and friends on the other side of the world within seconds, and their faces appear on the screen.',
          translationZh: {
            low: '但现在，我们可以很快地与住在其他国家的亲友交谈，甚至能在手机上看到他们的脸。',
            high: '如今，只需一条消息或一次视频通话，就能在数秒内联系到地球另一端的亲友，他们的面容也会出现在屏幕上。',
          },
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
          expressionEdits: [
            {
              before: 'so he do not feel lonely in a new place',
              after: 'which keeps loneliness at a distance in an unfamiliar place',
              focus: 'grammar',
              explanation: {
                zh: '用 which 接回视频通话的作用，将例子与结果连成一句。',
                en: 'Which links the video call to its effect, connecting the example and result in one sentence.',
              },
            },
          ],
          translationZh: {
            low: '例如，一个在国外读书的学生可以每周通过视频通话见到父母，所以他在新地方不会感到孤独。',
            high: '例如，一名留学生可以每周通过视频通话见到父母，这让他身处陌生环境时也能远离孤独感。',
          },
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
          expressionEdits: [
            {
              before: 'make people less close',
              after: 'weaken the very ties it is meant to serve',
              focus: 'lexis',
              explanation: {
                zh: '把“变得不亲近”写成削弱本应维护的关系，点出技术的反作用。',
                en: 'The phrase identifies the paradox: technology can weaken the ties it is designed to support.',
              },
            },
          ],
          translationZh: {
            low: '另一方面，有些人说科技让人们不那么亲近，我认为这也是真的。',
            high: '另一方面，反对者认为，持续在线可能削弱它原本应当维系的那些关系，而这种担忧是有道理的。',
          },
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
          translationZh: {
            low: '当人们在餐馆聚在一起时，每个人都在看自己的手机，没有人互相交谈。',
            high: '如今，朋友们在餐馆聚会时，人人盯着屏幕而不彼此交谈的情景已经很常见。',
          },
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
          translationZh: {
            low: '此外，网上交谈和面对面交谈不一样，因为我们看不到别人真实的感受。',
            high: '线上交谈还缺少语气、手势以及双方共同的沉默，而面对面交流中的许多意思正是由这些因素传达的。',
          },
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
          expressionEdits: [
            {
              before: 'weaker and weaker',
              after: 'broader but noticeably shallower',
              focus: 'lexis',
              explanation: {
                zh: '用 broader / shallower 的对照，区分关系的数量与深度。',
                en: 'Broader versus shallower distinguishes the reach of relationships from their depth.',
              },
            },
          ],
          translationZh: {
            low: '所以，人与人之间的关系可能会越来越弱，人们也会感到更加孤单。',
            high: '因此，人际关系的范围可能变得更广，深度却明显变浅，使人们比以前更加孤立。',
          },
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
          translationZh: {
            low: '总之，在现代生活中，科技对人与人之间的沟通有两面性。',
            high: '总之，科技改变了沟通方式，既拓展了沟通的可能，也带来了限制。',
          },
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
          translationZh: {
            low: '它帮助我们与远方的人保持联系，但也让我们忘记眼前的人。',
            high: '它维系着远距离的关系，却也可能悄然挤占我们本应给予身边人的注意力。',
          },
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
          expressionEdits: [
            {
              before: 'use technology in a good way',
              after: 'use these tools deliberately',
              focus: 'lexis',
              explanation: {
                zh: 'deliberately 强调有意识地选择使用方式，比笼统的 good way 更可操作。',
                en: 'Deliberately calls for intentional use, making the recommendation more precise than a good way.',
              },
            },
          ],
          translationZh: {
            low: '所以我认为，我们应该好好使用科技，每天也不应该在上面花太多时间。',
            high: '明智的做法是有意识地使用这些工具，而不是任由它们填满一天中每一个安静的片刻。',
          },
          focus: ['task', 'cohesion', 'lexis'],
          note: {
            zh: 'in a good way（含糊）→ deliberately；not spend too much time → rather than to let them fill every quiet moment of the day：用「有意使用」替掉空泛的「好好使用」，并用 rather than 结构保留原句的取舍。',
            en: 'In a good way becomes the usable deliberately, and the plain negative turns into a rather than contrast that keeps the original trade-off.',
          },
        },
      ],
      learning: {
        taskAnalysis: {
          zh: '这是讨论双方并给出个人观点的题目，须解释数字科技为何方便沟通，也须说明它可能如何削弱关系，再给出自己的判断。本文用“联系范围扩大，但关系深度不会自动增加”统领两方：先写跨地域联系，再写线下注意力和交流线索的损失，结尾提倡有意识地使用工具。低分版已有双方与例子，问题主要在解释笼统、语言错误反复，并非完全没有论证。升级版的逻辑更集中，但将所有线上交流都说成缺少语气与手势过于绝对，与视频通话例子存在范围冲突。比较时应看论点是否充分、衔接是否清楚、用词与语法是否准确；分档只是学习示范。',
          en: 'This discussion task requires reasons for both views and your own judgement. The essay uses one distinction throughout: technology expands the range of contact but does not automatically deepen relationships. It moves from communication across distance to lost attention and conversational cues, then recommends deliberate use. The lower version already contains both sides and examples; its main weaknesses are vague explanation and recurring language errors, not a complete absence of argument. The revision is more focused, but treating all online conversation as lacking tone and gestures conflicts with the video-call example. Compare development, coherence, appropriate wording and grammatical control. The band labels are illustrative learning references.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '引言：区分联系的广度与关系的深度', en: 'Introduction: distinguish the reach of contact from relational depth' },
            analysis: {
              zh: '原版以“科技重要”开场，随后只说有好处也有问题。升级版把话题收束到保持联系，并提出范围与深度的区别。迁移时从题干找出一个能同时解释两方的判断标准，使个人观点成为全文的分析依据，而不是讨论完双方后才补上一句赞成或反对。',
              en: 'The original opens with technology being important and then mentions benefits and problems. The revision narrows the subject to maintaining contact and introduces reach versus depth. Find a criterion that explains both sides of a discussion question, so your opinion guides the analysis instead of appearing only as a final sentence of agreement or disagreement.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '主体一：用时间对比说明跨地域沟通的价值', en: 'Body one: show the value of contact across distance through time contrast' },
            analysis: {
              zh: '本段保留原版的书信、视频通话和留学生例子，升级处在于把等待数日与数秒联系作对比，再说明定期见面如何缓解孤独。迁移时让例子回答“为什么有帮助”，而不是停在工具名称；原文对过去只能写信的概括仍可用更具体的历史场景限定。',
              en: 'The paragraph keeps letters, video calls and the overseas student from the original. The revision contrasts days of waiting with contact within seconds and explains the emotional benefit of regular calls. Make an example answer why something helps rather than merely naming a tool. The claim that families could only write letters would still benefit from a more specific historical setting.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '主体二：解释持续在线怎样挤占线下互动', en: 'Body two: explain how constant connection can displace in-person interaction' },
            analysis: {
              zh: '原版用“更不亲近”概括结果，升级版先写聚餐盯屏幕，再列语气、手势等线索，最后回扣广而浅的关系。迁移时保留情境、机制、后果三步；这里应把线索缺失限定为文字交流等场景，视频同样能传递语气，不能为了对比而抹去前段事实。',
              en: 'The original summarises the result as people becoming less close. The revision moves from screens at dinner to conversational cues and then to broader but shallower relationships. Retain the sequence of situation, mechanism and consequence. Limit the missing-cues argument to contexts such as text communication, since video can convey tone and must remain consistent with the previous paragraph.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '结论：由两方分析导出使用原则', en: 'Conclusion: derive a principle for use from the two arguments' },
            analysis: {
              zh: '原版建议“好好使用、少花时间”，却没有说明怎样判断使用是否合适。升级版先对照远方联系与身边注意力，再提出有意识地使用工具。迁移时让建议对应正文机制，例如保护面对面交流时段；控制总时长只是可能的做法，不等于所有线上交流都无价值。',
              en: 'The original recommends good use and less time without explaining how to judge good use. The revision contrasts distant contact with attention to those present, then recommends deliberate use. Match a concluding recommendation to a mechanism in the body, such as protecting time for conversation. Reducing total screen time is one option, not proof that all online interaction is unhelpful.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '用两个评价维度建立个人立场', en: 'Build a position around two dimensions of evaluation' },
            explanation: {
              zh: '原句的 good 和 some problems 不能指引后文。升级句以 widens the circle 说明联系范围，再用 cannot by itself 限定关系深度，使两个主体段各有落点。迁移到远程教育或社交平台题时，先区分可及性与效果、数量与质量等相关维度，再说清楚两者的关系；不要机械套用“有利有弊”。',
              en: 'Good and some problems do not guide the argument. Widens the circle identifies reach, while cannot by itself limits what this means for depth, giving each body paragraph a clear purpose. For remote education or social platforms, distinguish relevant dimensions such as access and effectiveness or quantity and quality, then explain their relationship rather than mechanically listing advantages and disadvantages.',
            },
            segmentIndex: 2,
          },
          {
            title: { zh: '让具体时间尺度承担对比', en: 'Let specific time scales carry the comparison' },
            explanation: {
              zh: '原版的 very fast 只有笼统程度，升级句的 within seconds 与上一句 days, sometimes weeks 形成时间对照，读者能看出便利具体体现在哪里。迁移时选一个与论点直接相关、能合理说明的尺度，如等待时间或可联系范围；不必虚构精确统计，也不要堆数字却不解释它的作用。',
              en: 'Very fast gives only a general degree. Within seconds contrasts with days, sometimes weeks in the preceding sentence, showing what convenience means. Choose a relevant scale such as waiting time or the range of people reachable, and explain its significance. A clear illustration does not require fabricated statistics or a pile of unexplained numbers.',
            },
            segmentIndex: 5,
          },
          {
            title: { zh: '给例子补上与论点相关的结果', en: 'Give an example a consequence that supports the claim' },
            explanation: {
              zh: '两版都写留学生视频联系父母，升级版把结果放进 which 从句，紧接整件事说明孤独感得到缓解；studying abroad 则简洁修饰 student。迁移时先交代谁、做什么，再写为何有助于该段论点。which 可以承接前面的情况，但读者必须能确定指向，句子过长时拆开更清楚。',
              en: 'Both versions use an overseas student calling his parents. The revision attaches an emotional consequence through which, while studying abroad modifies student compactly. State who does what, then explain why that supports the paragraph’s claim. Which may refer to the preceding situation, but its reference must be clear; split the sentence if adding a clause obscures the meaning.',
            },
            segmentIndex: 6,
          },
          {
            title: { zh: '在段末回扣引言的比较标准', en: 'Return to the introductory distinction at the paragraph ending' },
            explanation: {
              zh: '原句重复“越来越弱”，升级句用“范围更广、关系更浅”回扣开头的范围与深度，并以 leaving... 写出可能后果。这种复现让衔接来自概念而非反复堆连接词。迁移时复用引言的核心比较标准，并用 may 保留结果的不确定性；更广的联系并不必然导致孤立。',
              en: 'The original repeats weaker and weaker. Broader but noticeably shallower returns to reach versus depth in the introduction, and leaving adds a possible consequence. This creates cohesion through a recurring idea rather than extra connectives. Reuse the central distinction and retain may when the outcome is uncertain: broader contact does not necessarily cause isolation.',
            },
            segmentIndex: 10,
          },
        ],
        mistakes: [
          {
            zh: 'technology 是不可数名词，本篇单独作主语时用 makes、has；everyone、nobody 作主语时也用单数谓语。more easy 和 more fast 在这里应改为 easier、faster；这不是“双重比较级”，真正重复标记的是 more easier 一类写法。',
            en: 'Technology is uncountable and takes makes or has when it is the subject here. Everyone and nobody also take singular verbs. Replace more easy and more fast with easier and faster in this context. These are not double comparatives; more easier would contain the duplicated comparative marking.',
          },
          {
            zh: '“过去”的句子应将 can 改为 could；only 的位置影响强调范围，could only exchange letters 表示选择受限。families separated by distance 中 separated... 是修饰 families 的过去分词短语，不是名词化。复述语法时要说明结构实际做什么。',
            en: 'Use could rather than can with the past setting. The placement of only affects focus: could only exchange letters restricts the available option. In families separated by distance, separated by distance is a past-participle phrase modifying families, not nominalisation. Describe the actual grammatical function when explaining a revision.',
          },
          {
            zh: '前段肯定视频通话能看到家人，后段不能又把所有在线交流都说成缺少语气和手势。可把后一论断限定为文字聊天，并说明与面对面互动的差别。may grow shallower 是可能结果，也不能读成科技必然让关系变浅；解释机制时要保持范围与语气一致。',
            en: 'After explaining that video calls let people see relatives, do not claim that every online interaction lacks tone and gestures. Restrict the latter claim to text chat and explain the relevant difference from in-person interaction. May grow shallower describes a possibility, not an inevitable effect of technology. Keep scope and certainty consistent throughout the argument.',
          },
        ],
        vocabulary: [
          {
            term: 'keep in touch',
            partOfSpeech: 'verb phrase · 动词短语',
            meaning: { zh: '持续保持联系，文中指亲友通过数字工具维持日常联络。', en: 'Maintain regular contact, here with relatives and friends through digital tools.' },
            usage: { zh: '需要说明对象时接 with someone；keep 强调维持已有联系，get in touch 强调开始或重新联系。touch 在这个固定表达中不可加 a。', en: 'Add with someone to identify the person. Keep emphasises maintaining contact; get in touch emphasises initiating or renewing it. Do not add a before touch in this expression.' },
            collocations: ['keep in touch with friends', 'keep in touch by email', 'keep in regular touch'],
            example: { en: 'Former classmates keep in touch through a small online reading group.', zh: '昔日同学通过一个小型线上读书小组保持联系。' },
            segmentIndex: 0,
          },
          {
            term: 'by itself',
            partOfSpeech: 'prepositional phrase · 介词短语',
            meaning: { zh: '单凭它自身；本篇指只有技术工具，还不足以加深一段关系。', en: 'On its own, without additional factors; technology alone is insufficient to deepen a relationship.' },
            usage: { zh: 'itself 回指单数 technology；若主语改为 tools，应随之用 by themselves。本篇强调“仅靠工具”，不要机械译成设备自动运行。', en: 'Itself refers to singular technology. With plural tools, use by themselves. Here the phrase means the tool alone, not a device operating automatically.' },
            collocations: ['cannot by itself solve', 'is not sufficient by itself', 'work by itself'],
            example: { en: 'A shared calendar cannot by itself improve communication within a family.', zh: '单靠共享日历并不能改善家庭成员之间的沟通。' },
            segmentIndex: 2,
          },
          {
            term: 'connectivity',
            partOfSpeech: 'uncountable noun · 不可数名词',
            meaning: { zh: '持续能够联网、联系他人的状态；此处不等于情感上的亲密。', en: 'The state of being connected and reachable through digital networks, rather than emotional closeness.' },
            usage: { zh: '通常不可数，常与 digital、mobile、constant 搭配。connection 可指一条具体连接或一段联系；connectivity 概括连接能力或状态，不能直接替代所有 connection。', en: 'Usually uncountable, with adjectives such as digital, mobile or constant. A connection can be one link or relationship; connectivity describes the broader ability or state of being connected.' },
            collocations: ['constant connectivity', 'digital connectivity', 'mobile connectivity'],
            example: { en: 'Constant connectivity can make it difficult for workers to switch off after work.', zh: '持续在线的状态可能让员工难以下班后放松下来。' },
            segmentIndex: 7,
          },
          {
            term: 'ties',
            partOfSpeech: 'plural noun · 复数名词',
            meaning: { zh: '人与人之间的关系纽带，文中指数字沟通本应帮助维系的关系。', en: 'Bonds between people that digital communication is intended to support.' },
            usage: { zh: '表达社会或家庭纽带时常用复数，可接 ties with someone 或 ties between groups。此处不是领带，也不是动词 tie 的第三人称单数。', en: 'Social and family bonds are commonly expressed in the plural. Use ties with someone or ties between groups. Here ties is neither neckwear nor the third-person form of the verb tie.' },
            collocations: ['family ties', 'strengthen social ties', 'maintain close ties'],
            example: { en: 'Preparing meals together can strengthen ties between neighbours.', zh: '一起准备饭菜有助于加强邻里之间的联系。' },
            segmentIndex: 7,
          },
          {
            term: 'gestures',
            partOfSpeech: 'plural noun · 复数名词',
            meaning: { zh: '交流时帮助传递意思的手势或身体动作，属于非语言线索。', en: 'Movements of the hands or body that convey meaning as non-verbal cues.' },
            usage: { zh: '具体动作是可数名词，可用 hand gestures；a gesture of support 中 gesture 常指象征性举动，和本篇身体动作的意思不同。文字聊天与视频中的手势可见程度也不同。', en: 'A particular movement is countable: hand gestures. In a gesture of support, gesture often means a symbolic action, a different sense. Gestures are also more visible in video than in text chat.' },
            collocations: ['hand gestures', 'use gestures', 'facial expressions and gestures'],
            example: { en: 'The speaker used simple gestures to make the instructions easier to follow.', zh: '发言者用简单的手势让说明更容易理解。' },
            segmentIndex: 9,
          },
          {
            term: 'shallower',
            partOfSpeech: 'comparative adjective · 形容词比较级',
            meaning: { zh: '更缺乏深度的；本篇形容关系中的理解或情感投入可能减少。', en: 'Less deep, figuratively describing reduced understanding or emotional involvement in relationships.' },
            usage: { zh: '原形 shallow，比较级 shallower；原句与 broader 并列，形成范围和深度的对照。形容人 shallow 可能带贬义，评价关系时应解释具体缺少什么。', en: 'The base form is shallow and the comparative is shallower. Pairing it with broader contrasts reach and depth. Calling a person shallow can sound insulting; explain the missing quality when assessing a relationship.' },
            collocations: ['shallower relationships', 'grow shallower', 'a shallow understanding'],
            example: { en: 'Their conversations became shallower as work left them less time together.', zh: '工作让他们相处的时间减少，他们的交谈也逐渐缺少深度。' },
            segmentIndex: 10,
          },
          {
            term: 'displace',
            partOfSpeech: 'transitive verb · 及物动词',
            meaning: { zh: '挤占或取代；文中指数字工具占用了本该给予眼前人的注意力。', en: 'Take the place of or crowd out; here, digital activity crowds out attention to people who are present.' },
            usage: { zh: '直接接宾语，不说 displace of something；被动式 be displaced by 说明取代者。该词也可指迫使人离开家园，阅读时不能把所有用法都译为“取代”。', en: 'Take a direct object: displace something, not displace of something. In the passive, by identifies the replacement. The verb can also mean force people from their homes, so interpret it in context.' },
            collocations: ['displace face-to-face interaction', 'be displaced by technology', 'displace existing activities'],
            example: { en: 'Online meetings should not entirely displace informal conversations among colleagues.', zh: '线上会议不应完全取代同事之间的非正式交谈。' },
            segmentIndex: 12,
          },
          {
            term: 'deliberately',
            partOfSpeech: 'adverb · 副词',
            meaning: { zh: '有意识、有目的地；本篇强调主动选择使用方式，而非无目的地填满空闲时间。', en: 'Intentionally and with purpose, choosing how to use a tool rather than filling time automatically.' },
            usage: { zh: '修饰 use 等动词，形容词形式为 deliberate。它既可中性地表示有意安排，也可在 deliberately ignore 等搭配里表示故意做某事，不必一律译成带恶意的“蓄意”。', en: 'Use it to modify verbs such as use; the adjective is deliberate. It can describe purposeful planning neutrally or intentional behaviour such as deliberately ignoring something. It does not inherently imply harmful intent.' },
            collocations: ['use technology deliberately', 'deliberately set aside time', 'choose deliberately'],
            example: { en: 'They deliberately set aside half an hour each evening to talk without their phones.', zh: '他们每天晚上特意留出半小时，放下手机交谈。' },
            segmentIndex: 13,
          },
        ],
      },
      criteria: [
        {
          key: 'TR',
          note: {
            zh: '5 分版：双方观点与例子都已出现，但论证常停在笼统评价，自己的立场（I think this is also true）没有说明如何权衡，结尾建议也较宽泛。8 分版：开篇就说明「科技扩大了可及范围，但不会自动加深关系」，两个主体段分别展开跨地域联系与线下注意力，结尾回到有意识的使用。不过线上交流缺少语气和手势的说法仍须限定范围，不能涵盖前文的视频通话。',
            en: 'Band 5: both views and examples appear, but evaluation remains broad and the position does not explain how to weigh the effects. Band 8: reach versus depth provides a consistent judgement, developed through distant contact and attention in person. The claim that online conversation lacks tone and gestures still needs qualification because it cannot cover the earlier video-call example.',
          },
        },
        {
          key: 'CC',
          note: {
            zh: '5 分版：On the one hand / On the other hand / In conclusion 给出结构，段内 and / but / so 与 technology、people 反复出现。8 分版：保留这些有效路标，用 these tools、this concern 承接前文，再以 broader / shallower 回扣引言的范围与深度。衔接来自清楚的概念关系，不能只靠替换连接词。',
            en: 'Band 5: the essay is held up by On the one hand / On the other hand / In conclusion, with and / but / so inside paragraphs and heavy noun repetition. Band 8: the same signposts introduce concrete material, reference words carry the links, and connectives appear only where the logic needs them.',
          },
        },
        {
          key: 'LR',
          note: {
            zh: '5 分版：technology / people / good 反复出现，make some problems 在这里不如 cause problems 自然。8 分版：constant connectivity、face-to-face exchange、distant relationships 具体描述在线状态与交流类型；broader 和 shallower 区分两个评价维度。比较级形式与 the same as 的冠词另属语法问题，不宜一概归为词汇搭配。',
            en: 'Band 5: technology, people and good recur, while cause problems would be more natural than make some problems here. Band 8: constant connectivity and face-to-face exchange specify the communication context; broader and shallower distinguish two dimensions. Comparative forms and the article in the same as are grammatical issues rather than simply faulty vocabulary choices.',
          },
        },
        {
          key: 'GRA',
          note: {
            zh: '5 分版：technology make、nobody talk、the relation become 等一致错误密集，In the past 后的 can 与过去时间不符，more easy / more fast 在此比较级形式不自然。8 分版：studying abroad、leaving people more isolated 等分词短语，与定语从句和 it is common to see 结构交替出现。变化在于范围与准确性共同提升，而非句子越长越好。',
            en: 'Band 5: agreement errors recur in technology make, nobody talk and the relation become; can conflicts with the past setting; more easy and more fast are unnatural comparative forms here. Band 8: participle phrases, relative clauses and impersonal constructions offer greater variety with better control. The aim is range and accuracy, not longer sentences.',
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
