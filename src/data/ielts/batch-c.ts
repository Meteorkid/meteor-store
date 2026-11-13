/**
 * 雅思写作对照学习 · C 组：Task 1 学术类表格题、Task 1（G 类）正式投诉信。
 *
 * 两组都按「低分版一句 = 高分版一句」对齐：段落数、段内句数、信息点顺序完全一致，
 * 高分版只升级词汇、句式、衔接与任务回应的完整度。
 * 表格题题干用纯文本给出完整数据，作文里出现的每个数字都取自该表格。
 */
import type { IeltsPairSeed } from '@/lib/ielts/types';

export const batchC: IeltsPairSeed[] = [
  {
    slug: 'task1-academic-table-energy',
    task: 'task1-academic',
    category: 'table',
    topic: 'environment',
    status: 'published',
    sortOrder: 50,
    content: {
      prompt: {
        en: `The table below shows the percentage of electricity generated from renewable sources in four countries in 2000, 2010 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

Table: share of electricity generated from renewable sources (%)

Country        2000   2010   2020
Costa Rica     78     88     92
Denmark        15     33     65
Japan           9     11     22
Poland          2      7     17`,
        zh: "下表给出哥斯达黎加、丹麦、日本、波兰四个国家在 2000、2010、2020 年可再生能源发电量占总发电量的百分比。请选择并报告主要特征，在相关处进行比较，不少于 150 词。写法建议：先用一句 overview 概括四国整体都在上升、谁始终最高、谁始终最低、谁涨幅最大，再按占比高低分组（高的两国 / 低的两国）比较，不要一国一句地罗列数字，也不要漏掉任何一年的数据。",
      },
      title: {
        zh: 'Task 1 表格：四国可再生能源发电占比（2000、2010、2020）',
        en: 'Task 1 Table: Renewable Electricity in Four Countries (2000, 2010, 2020)',
      },
      bandLow: 5,
      bandHigh: 8,
      segments: [
        {
          paragraph: 1,
          low: 'The table gives information about the percentage of electricity from renewable sources in Costa Rica, Denmark, Japan and Poland in 2000, 2010 and 2020.',
          high: 'The table compares the share of electricity produced from renewable sources in Costa Rica, Denmark, Japan and Poland at three points in time: 2000, 2010 and 2020.',
          focus: ['lexis', 'grammar'],
          note: {
            zh: "低分版用 gives information about 的套话；高分版换成 compares the share of electricity produced from，把 percentage 升级为 share、made from 升级为 produced from，并用 at three points in time 把三个年份收成一组。",
            en: "The low version leans on 'gives information about'; the high version uses 'compares the share of electricity produced from', upgrading percentage to share and made from to produced from, and gathers the three years with 'at three points in time'.",
          },
        },
        {
          paragraph: 2,
          low: 'The four countries are all different, and their figures change in different ways.',
          high: 'Overall, renewable sources accounted for a rising share in all four countries, with Costa Rica recording the highest proportion and Poland the lowest, while Denmark saw the sharpest increase.',
          focus: ['task'],
          note: {
            zh: "低分版这一句只空泛地说「四国都不一样」，通篇没有 overview；高分版用 Overall 起头，一句话点出三个最大特征：四国全部上升、哥斯达黎加始终最高、波兰始终最低、丹麦涨幅最大。",
            en: "The low version offers only the empty remark that the countries are all different, so the essay has no overview; the high version opens with 'Overall' and names the main features in one sentence: all four rose, Costa Rica stayed highest, Poland stayed lowest and Denmark rose fastest.",
          },
        },
        {
          paragraph: 3,
          low: 'The number of renewable electricity in Costa Rica is 78% in 2000, and it is 88% in 2010 and 92% in 2020.',
          high: 'Costa Rica, the highest of the four throughout, went from 78% in 2000 to 88% in 2010 and 92% in 2020, a level no other country approached.',
          focus: ['task', 'lexis'],
          note: {
            zh: "低分版把 The number of ... is ... 当公式重复，而且 number 不能修饰 electricity（应为 percentage / share）；高分版用同位语 the highest of the four throughout 把比较塞进主语，用 went from ... to ... 串起三年，末尾 a level that no other country approached 代替再次报数。",
            en: "The low version repeats the formula 'The number of ... is ...', and number cannot modify electricity (it should be percentage or share); the high version puts the comparison into an appositive ('the highest of the four throughout'), strings the three years with 'went from ... to ...' and closes with 'a level that no other country approached' instead of restating figures.",
          },
        },
        {
          paragraph: 3,
          low: 'The number of renewable electricity in Denmark is 15% in 2000, 33% in 2010 and 65% in 2020, so this is a big rise and the figure is two times bigger than in 2000.',
          high: 'Denmark, by contrast, began at just 15% in 2000 and climbed steeply to 33% in 2010 and 65% in 2020, roughly four times its starting figure.',
          focus: ['cohesion', 'lexis'],
          note: {
            zh: "低分版用 so this is a big rise 这类没有量化的评价，还把 15% 到 65% 直接写成 two times bigger（实际四倍多），既没加 approximately / roughly，倍数也算错；高分版用 by contrast 把丹麦与哥斯达黎加放进同一组比较，climbed steeply 代替 big rise，并用 roughly four times its starting figure 给出正确倍数。",
            en: "The low version evaluates with the unquantified 'a big rise' and calls 15% to 65% 'two times bigger' (it is more than four times), with no hedge and the wrong multiplier; the high version uses 'by contrast' to compare Denmark with Costa Rica, replaces big rise with 'climbed steeply', and gives the correct multiplier: 'roughly four times its starting figure'.",
          },
        },
        {
          paragraph: 3,
          low: "Denmark's figure is bigger than before, and Costa Rica's figure is bigger than before too.",
          high: 'As a result, although Costa Rica remained well ahead, the gap between them was far smaller in 2020 than in 2000.',
          focus: ['cohesion', 'task'],
          note: {
            zh: "低分版把 bigger than before 说了两遍，等于没有比较两个国家；高分版用 As a result 承接上一句的增速，再用 although 让步从句点出「差距缩小」这一特征，而不是重复「都变大了」。",
            en: "The low version says 'bigger than before' twice, which compares nothing; the high version carries the speed of growth forward with 'As a result' and uses a concessive although-clause to name the narrowing gap rather than repeating that both rose.",
          },
        },
        {
          paragraph: 3,
          low: 'So these two countries have high figures in 2020.',
          high: 'Both, however, stayed above Japan and Poland in every year shown.',
          focus: ['task', 'grammar'],
          note: {
            zh: "低分版用 So 起头、把两国笼统说成 high figures；高分版用 Both, however 的插入语把这一组和下一段的分组接上，并用 stayed above ... in every year shown 给出可以逐格核对的范围。",
            en: "The low version starts with 'So' and calls the two countries 'high' in general terms; the high version links this group to the next with the parenthetical 'Both, however' and gives a checkable range: 'stayed above ... in every year shown'.",
          },
        },
        {
          paragraph: 4,
          low: 'The number of renewable electricity in Japan is 9% in 2000 and 22% in 2020, so the figure goes up slowly.',
          high: 'Japan and Poland, in contrast, began with small shares: Japan stood at 9% in 2000, edged up to 11% in 2010 and more than doubled to 22% by 2020.',
          focus: ['task', 'accuracy'],
          note: {
            zh: "低分版漏掉日本 2010 年的 11%，只剩首尾两个数字，还把 9% 到 22% 说成 goes up slowly；高分版补齐 9% → 11% → 22% 三个点，并用 more than doubled 给出准确的倍数关系。",
            en: "The low version drops Japan's 2010 figure of 11%, keeps only the first and last numbers, and calls 9% to 22% a slow rise; the high version restores all three points and states the relationship accurately with 'more than doubled'.",
          },
        },
        {
          paragraph: 4,
          low: 'The number of renewable electricity in Poland is 2% in 2000, 7% in 2010 and 17% in 2020, and the figure does not change a lot.',
          high: 'Poland, the lowest of the four throughout, started at just 2%, yet it also made steady progress, reaching 7% in 2010 and 17% in 2020.',
          focus: ['accuracy', 'task'],
          note: {
            zh: "低分版的数字本身没错，但用 does not change a lot 描述 2% 到 17% 是典型的数据误读；高分版改成 the lowest of the four throughout 和 made steady progress，描述与表格一致，并点出波兰是始终最低的国家。",
            en: "The low version's figures are correct, but describing 2% to 17% as 'does not change a lot' misreads the data; the high version writes 'the lowest of the four throughout' and 'made steady progress', which match the table and identify Poland as the lowest country in all three years.",
          },
        },
        {
          paragraph: 4,
          low: 'Japan and Poland are the two countries with low figures.',
          high: 'Even so, neither of them came close to Costa Rica or Denmark at any point.',
          focus: ['cohesion', 'grammar'],
          note: {
            zh: "低分版另起一句、只重复「这两个国家数字低」；高分版用 Even so 把转折接上，neither of them came close to 给出明确的比较对象，at any point 说明这是三个年份都成立的事实。",
            en: "The low version starts a new sentence that merely repeats that the two countries are low; the high version turns with 'Even so' and uses 'neither of them came close to' to name the comparison, with 'at any point' marking it as true for all three years.",
          },
        },
        {
          paragraph: 4,
          low: 'So the table shows that the four countries are all different from each other.',
          high: "By 2020, the two groups were still far apart, ranging from Poland's 17% to Costa Rica's 92%.",
          focus: ['task', 'lexis', 'accuracy'],
          note: {
            zh: "低分版结尾回到 So 加空话；高分版用 ranging from ... to ... 把最低的 17% 和最高的 92% 收进一句，指出两组到 2020 年仍然相差很大，收束全文而不与 overview 重复。",
            en: "The low version ends with 'So' plus a platitude; the high version uses 'ranging from ... to ...' to hold the lowest 17% and the highest 92% in one sentence and states that the two groups were still far apart in 2020, closing the essay without repeating the overview.",
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: "低分版没有 overview，四国被拆成一句一国地罗列，漏掉日本 2010 年的 11%，把波兰 2% 到 17% 写成 does not change a lot，还把丹麦 15% 到 65% 说成 two times bigger；8 分版先给总览（四国全升、哥斯达黎加最高、波兰最低、丹麦涨幅最大），再按占比高低分成两组比较，表格里的每个数字都用到且描述与数据一致。",
            en: "The 5-band essay has no overview: it lists one country per sentence, misses Japan's 2010 figure, describes Poland's 2% to 17% as 'does not change a lot' and calls Denmark's 15% to 65% 'two times bigger'. The 8-band essay gives an overview (all four rose, Costa Rica highest, Poland lowest, Denmark fastest) and then compares the high-share pair with the low-share pair, using every figure in the table and describing it accurately.",
          },
        },
        {
          key: 'CC',
          note: {
            zh: "低分版段内靠 and / also / so 平接，每句只管一个国家，句与句之间没有推进；8 分版用 by contrast、As a result、Even so 把分组之间的对比和因果写出来，同一段里前后句互相支撑，段末再收束到两组的差距。",
            en: "The 5-band version joins sentences with and, also and so, and each sentence handles a single country, so nothing moves forward. The 8-band version uses by contrast, As a result and Even so to carry the comparison and its consequences, so each sentence builds on the one before it and the paragraph closes on the gap between the two groups.",
          },
        },
        {
          key: 'LR',
          note: {
            zh: "低分版反复用 The number of ... is ...、big rise、high figures，还把 number 用在 electricity 上；8 分版换成 the share of electricity produced from、climbed steeply、the lowest of the four throughout、ranging from ... to ...，并用 roughly four times its starting figure、more than doubled 这类倍数表达代替再报一次数字。",
            en: "The 5-band essay repeats 'The number of ... is ...', 'a big rise' and 'high figures', and wrongly attaches number to electricity. The 8-band version uses the share of electricity produced from, climbed steeply, the lowest of the four throughout and ranging from ... to ..., and replaces repeated figures with multipliers such as roughly four times its starting figure and more than doubled.",
          },
        },
        {
          key: 'GRA',
          note: {
            zh: "低分版几乎全是「主语 + is/was + 数字」的简单句，而且用 is 描述 2000 年的数据，时态混乱；8 分版用同位语、although 让步从句、冒号引出细节、with 复合结构把多个信息压进一句，正文统一用过去时（went、began、stood、had risen）。",
            en: "The 5-band essay is a run of simple 'subject + is/was + figure' sentences and uses the present 'is' for 2000 data, so the tense is inconsistent. The 8-band version packs several pieces of information into one sentence with an appositive, a concessive although-clause, a colon and a with-structure, and keeps the body consistently in the past.",
          },
        },
      ],
      takeaways: {
        zh: [
          "Overall, ... with A recording the highest proportion throughout and B the lowest, while C saw the sharpest increase.：一句话把最高、最低、最大变化写进 overview。",
          "roughly four times its starting figure / more than doubled：把两个数字的差距换算成倍数，而不是再报一次数据。",
          "by contrast / while / whereas：把两个国家放进同一句比较，不要一国一句地流水账。",
          "the lowest of the four throughout / a level no other country approached：用比较性描述代替「高 / 低」这种笼统评价。",
        ],
        en: [
          "Overall, ... with A recording the highest proportion throughout and B the lowest, while C saw the sharpest increase. One sentence that puts the top, the bottom and the biggest change together.",
          "roughly four times its starting figure / more than doubled: turn a gap into a multiplier instead of repeating raw figures.",
          "by contrast / while / whereas: compare two countries inside one sentence instead of writing one sentence per country.",
          "the lowest of the four throughout / a level no other country approached: replace vague labels such as high or low with a comparison.",
        ],
      },
    },
  },
  {
    slug: 'task1-general-letter-complaint',
    task: 'task1-general',
    category: 'letter-formal',
    topic: 'service',
    status: 'published',
    sortOrder: 60,
    content: {
      prompt: {
        en: `You recently took a short evening course at a local training centre, but the course did not meet your expectations.

Write a letter to the manager of the centre. In your letter:

- explain which course you took and why you chose it;
- describe the problems you experienced during the course;
- say what you would like the centre to do about the situation.

Write at least 150 words. Begin your letter as follows: Dear Sir or Madam,`,
        zh: "你最近在一个本地培训中心上了一门晚间课程，但课程没有达到你的预期。请写信给中心负责人，在信中：①说明你上的是哪门课、为什么选这门课；②描述上课期间遇到的问题；③说明你希望中心怎么处理。要求用正式、礼貌的语气写不少于 150 词，以 Dear Sir or Madam, 开头。注意：题干没有给出金额、日期、订单号等细节，正文里也不要编造这些。",
      },
      title: {
        zh: 'Task 1 书信：向培训中心正式投诉晚间课程',
        en: 'Task 1 Letter: A Formal Complaint to a Training Centre',
      },
      bandLow: 5,
      bandHigh: 8,
      segments: [
        {
          paragraph: 1,
          low: 'Hi, I want to tell you about some problems with the photography course at your centre, because I am not happy with it.',
          high: 'Dear Sir or Madam, I am writing to express my dissatisfaction with the evening photography course that I recently took at your centre.',
          focus: ['task', 'lexis'],
          note: {
            zh: "低分版用 Hi 开头、I want to tell you 这种口语说法，把投诉信写成了私人留言；高分版换成 Dear Sir or Madam 和 I am writing to express my dissatisfaction with ...，一句话同时完成称呼与写信目的。",
            en: "The low version opens with 'Hi' and 'I want to tell you', which reads like a personal message; the high version uses 'Dear Sir or Madam' and 'I am writing to express my dissatisfaction with ...', doing the greeting and the purpose in one sentence.",
          },
        },
        {
          paragraph: 2,
          low: 'I did the evening photography course at your centre, and I paid for it before the course started.',
          high: 'I enrolled on the evening photography course at your centre and paid the course fee in advance.',
          focus: ['lexis', 'grammar'],
          note: {
            zh: "低分版用 I did the course 这种口语动词，还把两件事用 and 平接；高分版用 enrolled on the course 和 paid the course fee in advance，动词搭配更正式，也为后面的退款诉求埋下依据。",
            en: "The low version uses the spoken 'I did the course' and links two ideas with and; the high version uses 'enrolled on the course' and 'paid the course fee in advance', which is more formal and sets up the later request for a refund.",
          },
        },
        {
          paragraph: 2,
          low: 'I chose it because I like photos.',
          high: 'I chose it because friends had recommended your courses and because the evening timetable suited my working hours.',
          focus: ['task', 'grammar'],
          note: {
            zh: "低分版用 because I like photos 四个词打发掉「为什么选这门课」这个要点，信息量几乎为零；高分版给出两个具体理由（朋友推荐、晚间时段适合上班时间），并用 because ... and because ... 并列，把要点写足。",
            en: "The low version dismisses the 'why you chose it' point in four words, giving almost no information; the high version supplies two concrete reasons (a recommendation from friends and an evening timetable that fitted working hours) in a parallel because ... and because ... structure.",
          },
        },
        {
          paragraph: 3,
          low: 'The teacher was late many times and he did not teach us many things about the camera.',
          high: 'Unfortunately, the course did not meet my expectations: the tutor arrived late on several occasions and covered far less material than the course description suggested.',
          focus: ['task', 'lexis'],
          note: {
            zh: "低分版只说 late many times 和 did not teach us many things，问题描述笼统；高分版用 Unfortunately 引出第一个问题，the tutor arrived late on several occasions 更正式，并用 covered far less material than the course description suggested 说明问题的具体表现。",
            en: "The low version only says 'late many times' and 'did not teach us many things', which stays vague; the high version introduces the first problem with 'Unfortunately', writes 'the tutor arrived late on several occasions' and specifies it with 'covered far less material than the course description suggested'.",
          },
        },
        {
          paragraph: 3,
          low: 'Also the classroom was very small and the equipment was old, so we could not use it well and we had to wait.',
          high: 'In addition, the classroom was too small for the group and much of the equipment was old, which made it difficult to practise properly.',
          focus: ['cohesion', 'grammar'],
          note: {
            zh: "低分版用 Also 起句，还把 so、and 串成一长串，结尾 we had to wait 又跳到另一个话题；高分版用 In addition 递进，把两个问题合成一句，并用 which 非限定从句说明后果，指代清楚。",
            en: "The low version starts with 'Also' and strings so and and together, then jumps to a new topic with 'we had to wait'; the high version moves on with 'In addition', keeps both problems in one sentence and states the consequence in a non-defining which-clause with a clear reference.",
          },
        },
        {
          paragraph: 3,
          low: 'And some lessons finished early, so we lost a lot of time and we did not learn enough to use the camera well.',
          high: 'As a result, several lessons ended early and a considerable amount of teaching time was lost.',
          focus: ['cohesion', 'lexis'],
          note: {
            zh: "低分版第三次用 And 起句，we lost a lot of time 也偏口语；高分版用 As a result 明确因果，several lessons ended early 和 a considerable amount of teaching time was lost 用正式表达把同一个问题写清楚。",
            en: "The low version opens with 'And' for the third time and uses the spoken 'we lost a lot of time'; the high version makes the cause and effect explicit with 'As a result' and states the same problem formally as 'several lessons ended early' and 'a considerable amount of teaching time was lost'.",
          },
        },
        {
          paragraph: 4,
          low: 'So I want you to give me my money back, or you can let me do the course again for free.',
          high: 'I would therefore be grateful if you could either refund the fee or allow me to attend the course again at no extra cost.',
          focus: ['task', 'grammar'],
          note: {
            zh: "低分版用 So I want you to 和 give me my money back 下命令，诉求生硬；高分版用 I would therefore be grateful if you could either ... or ... 把同一组诉求（退费或免费重上）写成礼貌而具体的条件句。",
            en: "The low version orders the reader about with 'So I want you to' and 'give me my money back'; the high version turns the same two requests (a refund or a free repeat) into a polite, specific conditional: 'I would therefore be grateful if you could either ... or ...'.",
          },
        },
        {
          paragraph: 4,
          low: 'Also you should check the teacher and the classroom before the next course starts.',
          high: "It would also be helpful if the centre could review the tutor's punctuality and the condition of the classroom before the next course begins.",
          focus: ['task', 'lexis'],
          note: {
            zh: "低分版又用 Also you should 发号施令，check the teacher 搭配也不当；高分版用 It would also be helpful if the centre could ... 提出建议，review the tutor's punctuality 和 the condition of the classroom 让诉求具体可行。",
            en: "The low version issues another command with 'Also you should', and 'check the teacher' is a poor collocation; the high version suggests instead with 'It would also be helpful if the centre could ...' and makes the request workable through 'review the tutor's punctuality' and 'the condition of the classroom'.",
          },
        },
        {
          paragraph: 5,
          low: 'Please answer me as soon as possible. Yours faithfully,',
          high: 'I look forward to your reply and hope that we can resolve this matter. Yours faithfully,',
          focus: ['task', 'cohesion'],
          note: {
            zh: "低分版用 Please answer me as soon as possible 收尾，命令式且生硬，与 Yours faithfully 的正式落款冲突；高分版用 I look forward to your reply and hope that we can resolve this matter 收尾，语气从头到尾保持正式礼貌。",
            en: "The low version closes with 'Please answer me as soon as possible', which is a blunt command and clashes with the formal 'Yours faithfully'; the high version closes with 'I look forward to your reply and hope that we can resolve this matter', keeping the tone formal and polite to the end.",
          },
        },
      ],
      criteria: [
        {
          key: 'TR',
          note: {
            zh: "低分版三个要点都碰到了，但「为什么选课」只有 because I like photos 六个词，问题停留在老师迟到、设备旧，诉求是命令式的一句话；8 分版每个要点都写足：说明课程与选课理由、把三类问题（迟到、教室与设备、提前下课）写清楚、提出两个可执行诉求（退费或免费重上、检查师资与教室）。",
            en: "The 5-band letter touches all three points, but the reason for choosing the course is six words long, the problems stay at 'the teacher was late' and 'the equipment was old', and the requests are blunt commands. The 8-band version develops every point: it explains the course and the reason for choosing it, sets out three problems (lateness, the room and equipment, lessons ending early) and makes two workable requests (a refund or a free repeat, and a review of the tutor and the room).",
          },
        },
        {
          key: 'CC',
          note: {
            zh: "低分版段内靠 and / also / so 平接，三次用 And 或 Also 起句，句子之间没有推进关系；8 分版用 Unfortunately、In addition、As a result、therefore 把「问题 → 后果 → 诉求」连成一条线，最后用 I look forward to your reply 收束。",
            en: "The 5-band version links sentences with and, also and so, opens three sentences with And or Also, and never moves the letter forward. The 8-band version uses Unfortunately, In addition, As a result and therefore to build a chain from problems to consequences to requests, and closes with 'I look forward to your reply'.",
          },
        },
        {
          key: 'LR',
          note: {
            zh: "低分版用 tell you about some problems、did not teach us many things、for free、check the teacher 这类口语搭配；8 分版换成 express my dissatisfaction with、covered far less material、a considerable amount of teaching time、at no extra cost、review the tutor's punctuality 等正式搭配，并保持同一语域。",
            en: "The 5-band version relies on informal wording such as 'tell you about some problems', 'did not teach us many things', 'for free' and 'check the teacher'. The 8-band version uses formal collocations (express my dissatisfaction with, covered far less material, a considerable amount of teaching time, at no extra cost, review the tutor's punctuality) and stays in one register throughout.",
          },
        },
        {
          key: 'GRA',
          note: {
            zh: "低分版以 and / so 连接的简单句为主，还有 he did not teach us many things、we could not use it well 这类搭配与指代问题；8 分版用 which 非限定从句、if 条件句、either ... or ... 并列和冒号引出细节，句式多样且几乎没有语法错误。",
            en: "The 5-band version is a chain of simple and/so sentences with faulty collocation and reference ('he did not teach us many things', 'we could not use it well'). The 8-band version uses a non-defining which-clause, an if-clause request, an either ... or ... structure and a colon to introduce details, so the range is wide and there are almost no errors.",
          },
        },
      ],
      takeaways: {
        zh: [
          "I am writing to express my dissatisfaction with ...：正式投诉信的第一句，称呼和写信目的一起交代。",
          "I would therefore be grateful if you could either ... or ...：把诉求写成礼貌而具体的条件句，避免 So I want you to ...",
          "Unfortunately, ... / In addition, ... / As a result, ...：问题、补充、后果三步推进，替代 and / also / so。",
          "It would also be helpful if the centre could ...：提建议而不是下命令，让第二个诉求也保持礼貌。",
          "I look forward to your reply and hope that we can resolve this matter.：正式收尾，与 Dear Sir or Madam 的语气首尾一致。",
        ],
        en: [
          "I am writing to express my dissatisfaction with ...: one opening line that carries both the greeting and the purpose of the letter.",
          "I would therefore be grateful if you could either ... or ...: a polite, specific way to state what you want instead of 'So I want you to ...'.",
          "Unfortunately, ... / In addition, ... / As a result, ...: problem, extra detail and consequence in three steps, replacing and / also / so.",
          "It would also be helpful if the centre could ...: a suggestion rather than a command, so the second request stays polite too.",
          "I look forward to your reply and hope that we can resolve this matter.: a formal closing that matches the tone of Dear Sir or Madam.",
        ],
      },
    },
  },
];
