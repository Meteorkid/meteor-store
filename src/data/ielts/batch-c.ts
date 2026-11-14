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
          expressionEdits: [
            {
              before: 'gives information about the percentage of electricity',
              after: 'compares the share of electricity',
              focus: 'lexis',
              explanation: {
                zh: 'compares 明确图表任务，share 准确指代占比。',
                en: 'Compares identifies the chart’s purpose, while share precisely names the proportion.',
              },
            },
          ],
          translationZh: {
            low: '这张表提供了哥斯达黎加、丹麦、日本和波兰在 2000 年、2010 年和 2020 年来自可再生能源的电力所占百分比的信息。',
            high: '该表比较了哥斯达黎加、丹麦、日本和波兰在 2000 年、2010 年及 2020 年这三个时间点的可再生能源发电占比。',
          },
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
          expressionEdits: [
            {
              before: 'their figures change in different ways',
              after: 'renewable sources accounted for a rising share in all four countries',
              focus: 'task',
              explanation: {
                zh: '概述先指出四国共同上升的主趋势，不停留在“变化不同”。',
                en: 'The overview first identifies the shared upward trend instead of merely saying that changes differ.',
              },
            },
          ],
          translationZh: {
            low: '这四个国家都不一样，而且它们的数字以不同方式变化。',
            high: '总体来看，可再生能源在四个国家的发电占比均有所上升，其中哥斯达黎加的占比最高，波兰最低，而丹麦的增幅最大。',
          },
          focus: ['task'],
          note: {
            zh: "低分版只空泛地说「四国都不一样」，没有有效的 overview；高分版用 Overall 概括四国全部上升、哥斯达黎加始终最高、波兰始终最低、丹麦增幅最大。这里的「增幅最大」指增加的百分点最多：丹麦增加 50 个百分点；若比期末与期初的倍数，波兰的 8.5 倍才最高。",
            en: "The low version merely says the countries are different, without an informative overview. The high version identifies the common rise, the highest and lowest countries, and Denmark's largest increase. This means a rise of 50 percentage points; Poland has the largest final-to-initial ratio, at 8.5 times.",
          },
        },
        {
          paragraph: 3,
          low: 'The number of renewable electricity in Costa Rica is 78% in 2000, and it is 88% in 2010 and 92% in 2020.',
          high: 'Costa Rica, the highest of the four throughout, went from 78% in 2000 to 88% in 2010 and 92% in 2020, a level no other country approached.',
          translationZh: {
            low: '哥斯达黎加的可再生能源电量在 2000 年是 78%，在 2010 年是 88%，在 2020 年是 92%。',
            high: '哥斯达黎加的占比始终是四国中最高的，从 2000 年的 78% 升至 2010 年的 88%，再升至 2020 年的 92%，其他国家均未接近这一水平。',
          },
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
          expressionEdits: [
            {
              before: 'two times bigger than in 2000',
              after: 'roughly four times its starting figure',
              focus: 'accuracy',
              explanation: {
                zh: '65 ÷ 15 约为 4.3；roughly four times 正确概括倍数并保留近似。',
                en: '65 divided by 15 is about 4.3; roughly four times gives an accurate approximate comparison.',
              },
            },
          ],
          translationZh: {
            low: '丹麦的可再生能源电量在 2000 年是 15%，在 2010 年是 33%，在 2020 年是 65%，所以这是很大的增长，而且这个数字比 2000 年大两倍。',
            high: '相比之下，丹麦的占比在 2000 年起初仅为 15%，随后大幅升至 2010 年的 33% 和 2020 年的 65%，大约是起始值的四倍。',
          },
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
          expressionEdits: [
            {
              before: "Denmark's figure is bigger than before, and Costa Rica's figure is bigger than before too",
              after: 'the gap between them was far smaller in 2020 than in 2000',
              focus: 'task',
              explanation: {
                zh: '从重复描述各自上涨，转为比较两国差距如何变化。',
                en: 'Move from repeating two separate increases to comparing how the gap between the countries changed.',
              },
            },
          ],
          translationZh: {
            low: '丹麦的数字比以前大，哥斯达黎加的数字也比以前大。',
            high: '因此，尽管哥斯达黎加仍明显领先，两国在 2020 年的差距却比 2000 年小得多。',
          },
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
          translationZh: {
            low: '所以这两个国家在 2020 年的数字都很高。',
            high: '不过，在表中列出的每一年，这两个国家的占比都高于日本和波兰。',
          },
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
          translationZh: {
            low: '日本的可再生能源电量在 2000 年是 9%，在 2020 年是 22%，所以这个数字上升得很慢。',
            high: '相比之下，日本和波兰的起始占比较低：日本在 2000 年为 9%，到 2010 年小幅升至 11%，到 2020 年则翻了一倍多，达到 22%。',
          },
          focus: ['task', 'accuracy'],
          note: {
            zh: "低分版漏掉日本 2010 年的 11%，也没有区分前后两个十年的变化。高分版补齐 9% → 11% → 22%，但 more than doubled 的基期不够清楚：9% 到 22% 才是超过两倍，紧邻的 11% 到 22% 恰好翻倍。仿写时应写 doubled from 11% 或 more than doubled from its 2000 level。",
            en: "The low version omits Japan's 11% in 2010 and does not distinguish the two decades. The high version restores 9%, 11% and 22%, but the baseline for 'more than doubled' is unclear: 22 is more than twice 9, but exactly twice 11. Use 'doubled from 11%' or 'more than doubled from its 2000 level'.",
          },
        },
        {
          paragraph: 4,
          low: 'The number of renewable electricity in Poland is 2% in 2000, 7% in 2010 and 17% in 2020, and the figure does not change a lot.',
          high: 'Poland, the lowest of the four throughout, started at just 2%, yet it also made steady progress, reaching 7% in 2010 and 17% in 2020.',
          expressionEdits: [
            {
              before: 'the figure does not change a lot',
              after: 'made steady progress, reaching 7% in 2010 and 17% in 2020',
              focus: 'accuracy',
              explanation: {
                zh: '2% 到 17% 不是几乎不变；用具体终点展示持续增长。',
                en: 'A rise from 2% to 17% is not little change; the endpoints make the sustained growth clear.',
              },
            },
          ],
          translationZh: {
            low: '波兰的可再生能源电量在 2000 年是 2%，在 2010 年是 7%，在 2020 年是 17%，而且这个数字变化不大。',
            high: '波兰的占比始终是四国中最低的，起初仅为 2%，但也稳步增长，到 2010 年达到 7%，到 2020 年达到 17%。',
          },
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
          translationZh: {
            low: '日本和波兰是数字低的两个国家。',
            high: '即便如此，在任何时间点，这两个国家的占比都未接近哥斯达黎加或丹麦。',
          },
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
          translationZh: {
            low: '所以这张表说明，这四个国家彼此都不一样。',
            high: '到 2020 年，两组国家之间仍有很大差距，占比从波兰的 17% 到哥斯达黎加的 92% 不等。',
          },
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
            zh: "Task 1 的这一项是任务完成度（Task Achievement）。低分版缺少有效总览，漏掉日本 2010 年的 11%，误读波兰的变化，并算错丹麦的倍数。升级版概括趋势、极值和丹麦最大的百分点增幅，再分组比较；但日本 more than doubled 的基期仍需明确，不能把 11% 到 22% 解释为超过两倍。两版标签用于学习对照，不是官方评分。",
            en: "For Task 1, this criterion is Task Achievement. The lower version lacks an informative overview, omits Japan's 2010 figure, misreads Poland's change and miscalculates Denmark's ratio. The upgraded version groups the data and reports the main patterns, including Denmark's largest percentage-point rise. Its Japanese multiplier still needs a clear baseline: 11% to 22% is exactly double. The band labels are teaching references, not official scores.",
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
      learning: {
        taskAnalysis: {
          zh: '这是学术类 Task 1 表格概述，任务完成度看能否准确选取主要特征并比较。先确认单位是可再生能源占总发电量的百分比，不能推断实际发电量或政策原因；三个年份均已过去，细节用过去时。本文用四段处理：改写题目、总览、高占比两国、低占比两国。总览抓住四国上升、最高与最低不变、丹麦增加的百分点最多；细节用数据证明。题目要求至少 150 词，不要求给个人建议，也不要求所有图表都逐格抄数。5 分与 8 分标签是教学参考，不代表官方评分，升级版的倍数基期仍值得检查。',
          en: 'This Academic Task 1 table requires accurate selection and comparison of the main features. The measure is the percentage of electricity generated from renewable sources, not the amount generated; the table gives no policy explanations. Use past tenses for the three historical years. The four paragraphs introduce the table, give an overview, compare the higher-share countries and then the lower-share countries. The overview identifies the common rise, unchanged highest and lowest positions, and Denmark\'s largest percentage-point increase. Support these patterns with figures. Write at least 150 words without adding opinions or advice. Reporting every cell is not a universal requirement. The band labels are teaching references, not official scores, and the upgraded version still needs its multiplier baseline checked.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '引言：锁定指标、对象和时间', en: 'Introduction: measure, countries and dates' },
            analysis: {
              zh: '第一段只交代表格比较什么：四个国家、可再生能源发电占比和三个年份。share 保留了百分比的含义，不能把它改成发电总量。开头用现在时 compares 说明眼前的表格，后文用过去时描述历史数据，两者并不矛盾。',
              en: 'The introduction identifies the four countries, the share of electricity generated from renewables and the three years. Share preserves the percentage measure; replacing it with total generation would change the task. The present-tense compares describes the table in front of the reader, while the body uses past tenses for historical data.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '总览：趋势、排序和最大变化', en: 'Overview: direction, ranking and largest change' },
            analysis: {
              zh: '总览把读者最该记住的图景先说清：四国都上升，哥斯达黎加始终最高，波兰始终最低，丹麦的百分点增幅最大。这些都是可以逐列核对的特征。低分版的「各国不同」没有提供信息，补一个 Overall 也不能让空话变成有效总览。',
              en: 'The overview identifies the common upward movement, Costa Rica\'s highest position, Poland\'s lowest position and Denmark\'s largest percentage-point rise. Each claim can be checked against the columns. The lower version\'s observation that the countries differ conveys no useful pattern; adding Overall alone would not fix that.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '主体一：比较高占比两国及差距', en: 'Body 1: higher shares and a narrowing gap' },
            analysis: {
              zh: '哥斯达黎加和丹麦在三个年份都排前两位，因此放在同一段比较。前者从百分之七十八升至九十二，后者从十五升至六十五；两国差距由六十三缩小到二十七个百分点。段落由各自变化推进到两国关系，避免只列六个数字而不解释比较结果。',
              en: 'Costa Rica and Denmark are grouped because they rank first and second in every year. Costa Rica rises from 78% to 92%, while Denmark moves from 15% to 65%. Their gap narrows from 63 to 27 percentage points. The paragraph moves from each country\'s figures to the relationship between them, giving the six values a comparative purpose.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '主体二：比较低占比两国并核对基期', en: 'Body 2: lower shares and explicit baselines' },
            analysis: {
              zh: '日本和波兰占比较低，但低基数不等于变化小。日本前十年增加两个百分点，后十年增加十一个；波兰全期增加十五个。结尾用最高与最低值收束。须留意日本的倍数基期：从九到二十二超过两倍，从十一到二十二则恰好翻倍，不能混用。',
              en: 'Japan and Poland have lower shares, but a low starting point does not imply little change. Japan gains two percentage points in the first decade and eleven in the second; Poland gains fifteen across the full period. The final sentence reports the 2020 extremes. Check Japan\'s baseline: 22 is more than twice 9, but exactly twice 11.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '先比较整张表，再写总览', en: 'Read across the table before writing the overview' },
            explanation: {
              zh: '读表时先纵向看各国变化，再横向看每年的排序。这样能同时发现「全体上升」和「最高、最低不变」。总览中的丹麦增幅最大要限定为百分点增幅；波兰虽然一直最低，期末却是期初的八点五倍。先决定比较口径，再选词，才能避免把占比、差值和增长倍数混在一起。',
              en: 'First follow each country through time, then compare countries within each year. This reveals both the common rise and the unchanged highest and lowest positions. Denmark has the largest percentage-point increase, while Poland, despite remaining lowest, ends at 8.5 times its starting share. Decide whether you are comparing levels, point differences or ratios before choosing the wording.',
            },
            segmentIndex: 1,
          },
          {
            title: { zh: '用同一段里的两国形成真正比较', en: 'Build a comparison within the country group' },
            explanation: {
              zh: '第三段把哥斯达黎加的高起点与丹麦的快增长放在一起，再指出差距缩小。虽然前者仍领先，领先幅度却从六十三降至二十七个百分点；这个关系解释了为什么两国值得合写。仿写时先算出差距，再选择 although 等连接词，不能因为想用复杂句就随意制造让步关系。',
              en: 'The third paragraph pairs Costa Rica\'s high starting share with Denmark\'s stronger rise, then explains their narrowing gap. Costa Rica remains ahead, but its lead falls from 63 to 27 percentage points. This relationship makes the grouping useful. Calculate the comparison first and then choose a concessive structure such as although; grammatical complexity should express an actual relationship.',
            },
            segmentIndex: 4,
          },
          {
            title: { zh: '倍数、增长率和百分点分别计算', en: 'Separate ratios, relative growth and percentage points' },
            explanation: {
              zh: '丹麦从百分之十五到六十五，期末约为期初的四点三三倍，增加五十个百分点，相对增长约百分之三百三十三。三种表达分别回答不同问题。原句用 roughly four times 描述期末规模，可理解为粗略近似；仿写用 just over four times 更贴切，并避开含义容易混淆的 times bigger。',
              en: 'Denmark ends at 65 ÷ 15, or about 4.33 times its starting share. The change is 50 percentage points, equivalent to roughly 333% relative growth. These are different measures. Roughly four times is a broad approximation of the final level; just over four times is more precise. Avoid times bigger because its interpretation is easily confused.',
            },
            segmentIndex: 3,
          },
          {
            title: { zh: '趋势动词必须对应比较区间', en: 'Match each trend verb to its interval' },
            explanation: {
              zh: '日本从百分之九到十一，可用 edged up 表达小幅上升；下一阶段到二十二，则是翻倍。原句的 more than doubled 只有回到二〇〇〇年的九才成立，却紧跟在十一之后，容易误读。学习时要明确补出基期，也别根据三个观测点推断每一年都匀速增长，表格没有提供这种连续信息。',
              en: 'Japan edges up from 9% to 11%, then doubles from 11% to 22%. The original more than doubled is valid only against the 2000 figure of 9%, although its position after 11% invites a different reading. State the baseline when reusing this pattern. Three observations also do not establish that growth was smooth or constant between the dates.',
            },
            segmentIndex: 6,
          },
        ],
        mistakes: [
          {
            zh: '把占比当成数量：表格没有给总发电量，因此不能断言丹麦比日本生产了更多可再生电力。可比较的是 renewable electricity shares。electricity 不可数，number of electricity 也不成立。',
            en: 'Do not treat a share as a quantity. Without total electricity output, the table cannot establish that Denmark generated more renewable electricity than Japan. Compare their shares. Electricity is also uncountable, so number of electricity is incorrect.',
          },
          {
            zh: '把低基数说成小变化：波兰由 2% 升至 17%，增加 15 个百分点，期末是期初的 8.5 倍；does not change a lot 忽略了明显变化。丹麦的最大增幅指 50 个百分点，不能据此说其相对增长率也最大。',
            en: 'A low base does not mean little change. Poland rises from 2% to 17%, a gain of 15 percentage points and a final level 8.5 times the initial level. Does not change a lot misses this change. Denmark leads in percentage-point gains, not relative growth.',
          },
          {
            zh: '照搬升级句而不复算：日本 11% 到 22% 是 doubled，9% 到 22% 才是 more than doubled。丹麦 15% 到 65% 也不是 two times bigger。教学标签不会免除数据检查，仿写倍数句要同时写清起点、终点和基期。',
            en: 'Do not copy the upgraded wording without checking it. Japan doubles from 11% to 22%, and more than doubles only from 9% to 22%. Denmark\'s 15% to 65% is not two times bigger. A teaching label does not replace numerical verification: identify both values and the baseline.',
          },
          {
            zh: '为显得高级而写无法支持的程度词：低占比两国始终低于另外两国是事实，但 came close to 没有统一数值界限，2000 年日本与丹麦相差 6 个百分点。优先写明排名或差值；也不要从三个年份推断具体政策原因或逐年走势。',
            en: 'Avoid forceful descriptions that lack a clear basis. Japan and Poland are lower in all three years, but came close to has no fixed threshold; Japan and Denmark differ by six points in 2000. Rankings or numerical gaps are more precise. The table also gives no policy causes or annual movements.',
          },
        ],
        vocabulary: [
          {
            term: 'share',
            partOfSpeech: '名词（noun）',
            meaning: { zh: '占总量的份额、比例；本篇指可再生能源发电占比', en: 'A proportion of a total; here, the proportion of electricity generated from renewables.' },
            usage: { zh: '用 the share of 后接被衡量的整体或项目，常与 increase、rise 搭配。它表示比例，不代表实际发电量；在本篇不能随意换成 number。', en: 'Use the share of to identify the proportion being measured, often with increase or rise. A share is not an absolute output figure and cannot be replaced here with number.' },
            collocations: ['a rising share', 'the share of electricity', 'a larger share of the total'],
            example: { en: 'The share of households with internet access rose to 80%.', zh: '接入互联网的家庭占比上升到了百分之八十。' },
            segmentIndex: 0,
          },
          {
            term: 'accounted for',
            partOfSpeech: '动词短语（verb phrase）',
            meaning: { zh: '占据某个比例；本篇不是「解释原因」', en: 'Made up a proportion of a total; not the separate meaning of explaining a cause.' },
            usage: { zh: '主语是组成部分，后接百分比或 a share of the total。历史数据用 accounted for；注意别写成 accounted of，也不要把它与表示数量的 amounted to 混用。', en: 'The subject is the component, followed by a percentage or a share of the total. Accounted for suits historical data. Keep the preposition for and distinguish it from amounted to, which states a quantity.' },
            collocations: ['account for a share', 'account for 30% of the total', 'account for the largest proportion'],
            example: { en: 'Bus journeys accounted for 30% of all trips in the survey.', zh: '在这项调查中，公交出行占全部行程的百分之三十。' },
            segmentIndex: 1,
          },
          {
            term: 'proportion',
            partOfSpeech: '名词（noun）',
            meaning: { zh: '整体中某部分所占的比例', en: 'The size of one part relative to the whole.' },
            usage: { zh: '本篇最高占比可写 the highest proportion。这个词适合强调相对份额，不能仅凭比例推断总量；percentage 明确以百分数表达，proportion 的范围更宽。', en: 'The highest proportion describes the largest relative share. It does not establish the largest absolute total. Percentage specifically uses a scale of one hundred; proportion is broader.' },
            collocations: ['the highest proportion', 'a small proportion of', 'an increasing proportion'],
            example: { en: 'A small proportion of the students travelled to school by bicycle.', zh: '只有一小部分学生骑自行车上学。' },
            segmentIndex: 1,
          },
          {
            term: 'throughout',
            partOfSpeech: '副词（adverb，本句用法）',
            meaning: { zh: '在所述时段内始终；本篇依据三个列出的年份', en: 'For the whole period under discussion; here, as represented by the three reported years.' },
            usage: { zh: '可单独用作副词，也可接 the period 作介词。表格只列三年，学习时把「始终」理解为每个已列年份都成立，不能据此声称未列年份也经过核实。', en: 'Throughout can stand alone as an adverb or take the period as a preposition. With this table, the claim is checked at each reported year, not independently verified for every intervening year.' },
            collocations: ['throughout the period', 'remain highest throughout', 'throughout the study'],
            example: { en: 'The library remained open throughout the renovation.', zh: '图书馆在整个翻修期间一直开放。' },
            segmentIndex: 2,
          },
          {
            term: 'climbed steeply',
            partOfSpeech: '动词与副词搭配（verb–adverb phrase）',
            meaning: { zh: '大幅上升；本篇描述丹麦占比的明显增长', en: 'Rose substantially; here, describing Denmark\'s marked increase in share.' },
            usage: { zh: 'climb 在图表中作不及物动词，终值用 to、增量用 by。steeply 要有数据支撑，不能只因终值高就使用，也不说明增长由什么原因造成。', en: 'Climb is intransitive in chart descriptions: use to for the endpoint and by for the amount gained. Steeply needs evidence of a substantial rise; a high final value alone is insufficient.' },
            collocations: ['climb steeply to', 'climb from A to B', 'climb by ten percentage points'],
            example: { en: 'The participation rate climbed steeply from 20% to 55%.', zh: '参与率从百分之二十大幅升至百分之五十五。' },
            segmentIndex: 3,
          },
          {
            term: 'roughly',
            partOfSpeech: '副词（adverb）',
            meaning: { zh: '大约，用于注明数字是近似值', en: 'Approximately, marking a value as an estimate or rounded figure.' },
            usage: { zh: '通常放在数字或倍数前。本篇约四倍对应实际约 4.33 倍；roughly 允许合理取整，不能用来掩盖把四倍算成两倍的错误。', en: 'Place it before a number or multiplier. Here, roughly four times rounds about 4.33 times. It permits reasonable approximation, not an incorrect calculation such as rounding four times to two.' },
            collocations: ['roughly four times', 'roughly half', 'roughly equal to'],
            example: { en: 'The afternoon session lasted roughly half as long as the morning session.', zh: '下午场的时长大约是上午场的一半。' },
            segmentIndex: 3,
          },
          {
            term: 'edged up',
            partOfSpeech: '动词短语（verb phrase）',
            meaning: { zh: '小幅上升；本篇指日本从 9% 升至 11%', en: 'Increased slightly; here, Japan\'s rise from 9% to 11%.' },
            usage: { zh: '适合较小的变化，后接 to 表终值、by 表增量。它描述幅度，不自动说明过程平稳；本篇不能用它概括日本从 11% 到 22% 的翻倍。', en: 'Use it for a small increase, with to for the endpoint or by for the gain. It describes magnitude without proving a smooth path. It does not fit Japan\'s doubling from 11% to 22%.' },
            collocations: ['edge up to', 'edge up slightly', 'edge up by one percentage point'],
            example: { en: 'The recycling rate edged up from 41% to 43%.', zh: '回收率从百分之四十一小幅升至百分之四十三。' },
            segmentIndex: 6,
          },
          {
            term: 'ranging from',
            partOfSpeech: '分词短语（participial phrase）',
            meaning: { zh: '范围从……到……，与后面的 to 配合使用', en: 'Introducing the lower end of a range, followed by to and the upper end.' },
            usage: { zh: '把同一指标、同一时间的最小与最大值收在一起，形成 from A to B。不要混成 from A and B；本篇范围是 2020 年各国占比，不是同一国家的时间变化。', en: 'Use from A to B for the minimum and maximum of the same measure at the same time. Do not mix it with between A and B. Here it is a cross-country range in 2020, not one country\'s change over time.' },
            collocations: ['ranging from A to B', 'figures ranging from', 'values ranging from'],
            example: { en: 'The three groups recorded attendance rates ranging from 72% to 94%.', zh: '三个组记录的出勤率介于百分之七十二和百分之九十四之间。' },
            segmentIndex: 9,
          },
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
          expressionEdits: [
            {
              before: 'I want to tell you about some problems',
              after: 'I am writing to express my dissatisfaction',
              focus: 'lexis',
              explanation: {
                zh: '正式投诉信先直接说明写信目的，语气明确且礼貌。',
                en: 'A formal complaint states its purpose directly with a clear, polite opening.',
              },
            },
          ],
          translationZh: {
            low: '嗨，我想跟你说说你们中心摄影课的一些问题，因为我对这门课不满意。',
            high: '尊敬的先生或女士：我写此信是想表达对近期在贵中心参加的晚间摄影课程的不满。',
          },
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
          expressionEdits: [
            {
              before: 'paid for it before the course started',
              after: 'paid the course fee in advance',
              focus: 'lexis',
              explanation: {
                zh: 'the course fee 指明款项，in advance 紧凑表达提前付款。',
                en: 'The course fee names the payment, and in advance expresses its timing concisely.',
              },
            },
          ],
          translationZh: {
            low: '我在你们中心上了晚间摄影课，而且在课程开始前就付了钱。',
            high: '我报名参加了贵中心的晚间摄影课程，并提前支付了课程费用。',
          },
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
          translationZh: {
            low: '我选这门课是因为我喜欢照片。',
            high: '我选择这门课程，是因为朋友曾推荐贵中心的课程，而且晚间上课的安排适合我的工作时间。',
          },
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
          expressionEdits: [
            {
              before: 'was late many times',
              after: 'arrived late on several occasions',
              focus: 'lexis',
              explanation: {
                zh: '用具体事件表述迟到情况，适合正式信件中列举投诉事实。',
                en: 'Describe the repeated incidents in a measured form suitable for a formal complaint.',
              },
            },
          ],
          translationZh: {
            low: '老师迟到了很多次，而且他没教我们多少关于相机的东西。',
            high: '遗憾的是，这门课程未达到我的预期：教师多次迟到，讲授的内容也远少于课程介绍所述。',
          },
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
          translationZh: {
            low: '还有，教室很小，设备也很旧，所以我们没法好好使用设备，还得等。',
            high: '此外，对于整个班级来说，教室过于狭小，许多设备也很陈旧，这使我们难以正常进行练习。',
          },
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
          expressionEdits: [
            {
              before: 'And some lessons finished early',
              after: 'As a result, several lessons ended early',
              focus: 'cohesion',
              explanation: {
                zh: 'As a result 将课时损失与上文问题连接成因果。',
                en: 'As a result connects the loss of teaching time to the problems described above.',
              },
            },
          ],
          translationZh: {
            low: '而且有些课提前结束了，所以我们损失了很多时间，也没学到足够的东西来用好相机。',
            high: '结果，有几节课提前结束，损失了相当多的教学时间。',
          },
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
          expressionEdits: [
            {
              before: 'I want you to give me my money back',
              after: 'I would therefore be grateful if you could either refund the fee',
              focus: 'grammar',
              explanation: {
                zh: 'would be grateful if you could 委婉提出诉求；refund 准确表达退款。',
                en: 'Would be grateful if you could makes the request polite, while refund states the remedy precisely.',
              },
            },
          ],
          translationZh: {
            low: '所以我想让你把钱退给我，或者你可以让我免费再上一次这门课。',
            high: '因此，如果您能退还课程费用，或允许我无需额外付费再次参加这门课程，我将不胜感激。',
          },
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
          translationZh: {
            low: '还有，你应该在下次课程开始前检查一下老师和教室。',
            high: '如果中心能在下一期课程开始前检查教师的守时情况和教室条件，也会有所帮助。',
          },
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
          expressionEdits: [
            {
              before: 'Please answer me as soon as possible',
              after: 'I look forward to your reply and hope that we can resolve this matter',
              focus: 'lexis',
              explanation: {
                zh: '结尾同时期待回复与解决问题，保持正式、合作的语气。',
                en: 'The closing requests a response and a resolution while maintaining a formal, cooperative tone.',
              },
            },
          ],
          translationZh: {
            low: '请尽快答复我。此致敬礼。',
            high: '期待您的回复，并希望我们能够解决此事。此致敬礼。',
          },
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
      learning: {
        taskAnalysis: {
          zh: '这是培训中心学员写给负责人的正式投诉信，任务完成度（Task Achievement）同时关注写信目的、三个要点的展开和语气是否合适。三个要点分别是课程及选课原因、上课遇到的问题、希望中心采取的措施。本文按「表明投诉目的—交代背景—说明问题及影响—提出解决办法—礼貌收尾」组织。题干指定 Dear Sir or Madam，结尾用 Yours faithfully 与之呼应；实际书信应将称呼和落款单独成行。至少写 150 词，围绕已有的摄影课情境展开，不补金额、日期、订单号或额外指控。两版分数标签仅供学习对照，词汇难度不能代替内容完整和表达准确。',
          en: 'This is a formal complaint from a student to the manager of a training centre. Task Achievement concerns the purpose, development of the three bullet points and appropriate tone. Cover the course and reasons for choosing it, the problems experienced, and the action requested. The letter moves from purpose to background, problems and effects, requested remedies, and a polite closing. The specified Dear Sir or Madam pairs with Yours faithfully; put the greeting and sign-off on separate lines in an actual letter. Write at least 150 words using the existing photography-course scenario, without adding amounts, dates, order numbers or further allegations. The band labels are teaching references: difficult vocabulary cannot replace complete, accurate communication.',
        },
        paragraphs: [
          {
            paragraph: 1,
            role: { zh: '开头：正式称呼和投诉目的', en: 'Opening: formal greeting and purpose' },
            analysis: {
              zh: '开头使用题目指定的正式称呼，随后点明对晚间摄影课程不满意，让负责人立刻知道信件目的。低分版的随意问候与投诉对象的关系不匹配。学习重点是尽早交代来意，表达可直接清楚，不必把所有问题或退款要求都塞进第一句话。',
              en: 'The opening follows the required greeting and identifies dissatisfaction with the evening photography course. The manager can immediately recognise the purpose. The lower version\'s casual greeting does not fit this relationship. Learn to state the purpose early and clearly, without trying to fit every problem or the refund request into the first sentence.',
            },
          },
          {
            paragraph: 2,
            role: { zh: '背景：课程名称和选课理由', en: 'Background: course and reasons for choosing it' },
            analysis: {
              zh: '这一段落实第一个要点，说明所上课程与提前付款，再交代朋友推荐和时段适合工作安排这两个已有理由。理由要解释为何选择这家中心的这门课，而不是仅说喜欢拍照。付款信息与后文退费请求相连，但无需另编金额或交易证明。',
              en: 'This paragraph addresses the first bullet point: the course, advance payment, and the existing reasons of a recommendation and a suitable timetable. The reasons explain the choice of this course at this centre, rather than merely an interest in photography. Payment provides context for the later refund request; no invented amount or transaction evidence is needed.',
            },
          },
          {
            paragraph: 3,
            role: { zh: '问题：具体表现及学习影响', en: 'Problems: what happened and its effect on learning' },
            analysis: {
              zh: '问题段写出教师迟到、内容少于课程介绍、场地与设备影响练习以及教学时间损失，使不满有具体依据。事实和后果之间要有真实联系；原文用因果词连接提前下课，原因却未充分说明。仿写时可把提前下课列为另一问题，避免靠连接词补出因果。',
              en: 'The paragraph gives specific grounds for dissatisfaction: lateness, reduced coverage, unsuitable facilities and lost teaching time. A consequence should follow from the stated facts. The original links early endings with a result connector without fully establishing their cause. When adapting the letter, present early endings as another problem unless that causal link is explained.',
            },
          },
          {
            paragraph: 4,
            role: { zh: '诉求：个人补救和课程改进', en: 'Requests: a remedy and improvements to the course' },
            analysis: {
              zh: '第四段回应第三个要点，先提出退款或免费重上这两个替代方案，再建议中心检查教师守时情况和教室条件。前一项解决本人损失，后一项对应已描述的教学问题。礼貌条件句缓和语气，但行动对象仍写得明确，读者能够据此作答。',
              en: 'The fourth paragraph answers the third bullet point. It offers a refund or a free repeat as alternatives, then asks the centre to review punctuality and classroom conditions. The first request addresses the writer\'s loss; the second relates to the reported course problems. Conditional wording softens the tone while preserving clear actions for the manager to consider.',
            },
          },
          {
            paragraph: 5,
            role: { zh: '结尾：期待回复并保持正式语气', en: 'Closing: invite a reply and maintain the formal tone' },
            analysis: {
              zh: '结尾期待回复与解决问题，不再加入新的投诉或赔偿条件，保持全文目标一致。正式落款与开头不指名的称呼相配。低分版的催促显得直接，但礼貌不取决于单个词；要连同称呼、事实陈述、请求方式和结尾检查整封信的语气。',
              en: 'The closing invites a reply and resolution without introducing a new complaint or compensation demand. The formal sign-off matches the unnamed greeting. The lower version\'s urgency is more direct, but politeness is not determined by a single word: assess the greeting, factual statements, requests and ending together.',
            },
          },
        ],
        techniques: [
          {
            title: { zh: '第一句同时交代对象与来意', en: 'Identify the course and purpose in the first sentence' },
            explanation: {
              zh: '开头把投诉对象缩小到最近上的晚间摄影课，并直接表达不满，负责人不必读到末段才知道来意。正式语气主要来自清楚的目的、合适的称呼和克制的事实陈述，不是每个常用词都必须换成难词。实际书写时，把称呼单独成行，正文从下一行开始，更符合信件格式。',
              en: 'The first sentence identifies the recent evening photography course and states dissatisfaction, so the manager does not need to wait until the final paragraph to understand the purpose. Formal tone comes from a suitable greeting, a clear purpose and measured factual statements, not from replacing every ordinary word with a difficult one. Put the greeting on its own line in the actual letter.',
            },
            segmentIndex: 0,
          },
          {
            title: { zh: '用选择理由补足第一个要点', en: 'Develop the reasons for choosing the course' },
            explanation: {
              zh: '题目同时问「上了什么课」和「为什么选它」，只写课程名称还没有完成这个要点。本文已有的朋友推荐解释信任来源，晚间安排解释个人需要，二者各有作用。使用并列原因结构时，每个理由都应回答选课决定；继续罗列兴趣、经历或无关背景，只会挤占问题与诉求的篇幅。',
              en: 'The first bullet asks both which course the writer took and why it was chosen. Naming the course alone is incomplete. The existing recommendation explains trust in the centre, while the timetable explains practical suitability. In the parallel because clauses, each reason should explain the decision; unrelated interests or background would take space away from the problems and requests.',
            },
            segmentIndex: 2,
          },
          {
            title: { zh: '把不满写成可理解的问题与影响', en: 'Turn dissatisfaction into a problem and its effect' },
            explanation: {
              zh: '教室过小和设备陈旧只是条件，which 从句继续说明这些条件妨碍正常练习，读者才知道它们为什么影响课程体验。这里的从句承接前面的整体情况，不能机械理解成只修饰最近的 equipment。仿写先说清问题，再说明已有情境支持的后果，不额外添加事故或损失。',
              en: 'A small room and old equipment are conditions; the which clause explains why they matter by linking them to difficulty practising. Here the clause comments on the preceding situation, not merely the nearest noun equipment. State the problem and then a consequence supported by the scenario, without adding new accidents or losses.',
            },
            segmentIndex: 4,
          },
          {
            title: { zh: '礼貌请求仍要有明确的可选行动', en: 'Make polite requests with clear alternatives' },
            explanation: {
              zh: '请求句用 would 和 could 缓和语气，核心动作仍是退费或允许免费重上，读者不会只看到抽象的「解决问题」。either 后的 refund 与 or 后的 allow 共用 could，两个动词保持平行。两个方案是替代关系；后一句的课程改进另有目的，不能把所有措施混成必须同时满足的条件。',
              en: 'Would and could soften the request, but the actions remain concrete: refund the fee or permit a free repeat. Refund and allow share could and form parallel verb phrases after either and or. These are alternatives. The following request for course improvements serves a separate purpose and should not turn the two remedies into simultaneous demands.',
            },
            segmentIndex: 6,
          },
          {
            title: { zh: '结尾回应处理目标，并与称呼配套', en: 'Close on resolution with a matching sign-off' },
            explanation: {
              zh: '期待回复和解决此事，承接的是前文已经提出的补救方案，结尾不必再复述每一项问题。题目使用不指名的正式称呼，对应的常见英式落款是 Yours faithfully；若已使用具体姓名，通常用 Yours sincerely。学习这组对应关系，同时保持正文请求的克制和明确。',
              en: 'The closing looks ahead to the reply and resolution of the remedies already requested, without repeating each complaint. In conventional British formal letters, the unnamed Dear Sir or Madam pairs with Yours faithfully; a named greeting usually takes Yours sincerely. Learn this pairing while keeping the body\'s requests measured and specific.',
            },
            segmentIndex: 8,
          },
        ],
        mistakes: [
          {
            zh: '只提到三个要点却没有展开：课程名称不能代替选课理由，设备旧不能代替它对练习的影响，「请解决」也不能代替明确诉求。逐项检查读者能否回答上了什么、为何选择、哪里有问题、希望如何处理。',
            en: 'Mentioning all three bullets is not the same as developing them. A course name does not explain the choice, old equipment needs a relevant effect, and please resolve this needs a concrete request. Check whether the reader can identify the course, reasons, problems and desired action.',
          },
          {
            zh: '把正式语气等同于生僻词或绝对禁用常用词：and、also、for free 本身并非语法错误。本文要解决的是反复串接、措辞笼统和上下文语气不一致；优先把事实和请求写准确，不用背长套句来替代信息。',
            en: 'Formal writing does not require rare words or a ban on ordinary expressions. And, also and for free are not grammatical errors by themselves. The issues here are repetitive chaining, vague wording and inconsistent tone. Precise facts and requests matter more than memorised long phrases.',
          },
          {
            zh: '看到 As a result 就以为因果成立：设备陈旧、教室过小确实在文中联系到练习困难，但它们是否导致提前下课没有说明。若只是继续列问题，用补充关系即可；连接词应标明已有逻辑，不能创造事实。',
            en: 'As a result does not establish causation by itself. The letter links old equipment and a small room to difficulty practising, but does not explain whether they caused early endings. If this is simply another problem, an additive link is clearer. Connectors express relationships; they do not create facts.',
          },
          {
            zh: '增加未经给出的补偿条件：本篇已有退款或免费重上、检查教师守时和教室条件的请求。不要另加具体退款金额、答复日期、订单号或法律威胁。结尾也无需突然改变语气，把请求写成最后通牒。',
            en: 'Do not add unsupported compensation terms. This letter already requests a refund or free repeat and a review of punctuality and the room. Do not add an exact refund amount, response deadline, order number or legal threat, or turn the final paragraph into an ultimatum.',
          },
        ],
        vocabulary: [
          {
            term: 'dissatisfaction',
            partOfSpeech: '名词（noun，通常不可数）',
            meaning: { zh: '不满；本篇指对课程服务未达预期的不满', en: 'A feeling that something is unsatisfactory; here, dissatisfaction with the course service.' },
            usage: { zh: '常用 express dissatisfaction with sth，with 后说明不满对象。名词比 not happy 更适合本信的正式开头，但仍需后文给出具体问题，不能只表达情绪。', en: 'Use express dissatisfaction with something, naming the object after with. The noun fits this formal opening, but the body still needs specific grounds rather than emotion alone.' },
            collocations: ['express dissatisfaction with', 'customer dissatisfaction', 'a source of dissatisfaction'],
            example: { en: 'Several visitors expressed dissatisfaction with the booking system.', zh: '几位访客表达了对预约系统的不满。' },
            segmentIndex: 0,
          },
          {
            term: 'enrolled on',
            partOfSpeech: '动词短语（verb phrase）',
            meaning: { zh: '报名参加课程；本篇用英式搭配', en: 'Registered to take a course; using a common British English pattern.' },
            usage: { zh: 'enrol on a course 常见于英式英语，enrol in a course 也可用。本句用过去式 enrolled，注意双写 l；报名这个动作不能单独证明已经完成课程。', en: 'Enrol on a course is common in British English; enrol in a course is also used. Enrolled doubles the l. Registration alone does not establish that someone completed the course.' },
            collocations: ['enrol on a course', 'enrol in a programme', 'enrol as a student'],
            example: { en: 'I enrolled on a weekend drawing course to improve my observation skills.', zh: '我报名参加了周末绘画课，以提高观察能力。' },
            segmentIndex: 1,
          },
          {
            term: 'in advance',
            partOfSpeech: '副词短语（adverbial phrase）',
            meaning: { zh: '提前；本篇指在课程开始前付费', en: 'Beforehand; here, payment made before the course started.' },
            usage: { zh: '可放在 pay、book、notify 等动词后。不要写成 in advanced；advanced 是形容词。表达提前付款时，in advance 与 in arrears 所表示的付款时间不同。', en: 'Use it after verbs such as pay, book or notify. Do not write in advanced: advanced is an adjective. Payment in advance takes place beforehand, unlike payment in arrears.' },
            collocations: ['pay in advance', 'book in advance', 'notify someone in advance'],
            example: { en: 'Please book a study room in advance during the examination period.', zh: '考试期间请提前预约自习室。' },
            segmentIndex: 1,
          },
          {
            term: 'expectations',
            partOfSpeech: '复数名词（plural noun）',
            meaning: { zh: '对课程质量和体验的预期', en: 'Beliefs about the quality or experience that the course would provide.' },
            usage: { zh: '常用 meet expectations 表示达到预期，也可用 fall short of expectations。本篇后面接迟到与内容不足，给未达预期提供依据；不要只写一句未达预期就结束问题段。', en: 'Meet expectations means satisfy them; fall short of expectations means fail to do so. The lateness and reduced coverage provide grounds here. The phrase alone does not adequately describe the problems.' },
            collocations: ['meet expectations', 'fall short of expectations', 'exceed expectations'],
            example: { en: 'The workshop met my expectations by providing plenty of guided practice.', zh: '这次工作坊提供了充分的指导练习，达到了我的预期。' },
            segmentIndex: 3,
          },
          {
            term: 'considerable',
            partOfSpeech: '形容词（adjective）',
            meaning: { zh: '相当多的、相当大的；本篇修饰损失的教学时间', en: 'Large or substantial in amount; here, describing lost teaching time.' },
            usage: { zh: '修饰 amount、time、effort 等；不要与 considerate「体贴的」混淆。它只表达程度，不提供具体时长，因此不可据此补出损失几小时这样的数字。', en: 'It modifies nouns such as amount, time and effort. Distinguish it from considerate, meaning thoughtful of others. It conveys scale without specifying a duration, so it does not justify inventing a number of lost hours.' },
            collocations: ['a considerable amount of', 'considerable effort', 'considerable time'],
            example: { en: 'Preparing the exhibition required a considerable amount of time.', zh: '筹备这次展览需要相当多的时间。' },
            segmentIndex: 5,
          },
          {
            term: 'refund',
            partOfSpeech: '动词（verb，本句用法）',
            meaning: { zh: '退还已支付的款项；本篇指退课程费', en: 'Return money that has been paid; here, return the course fee.' },
            usage: { zh: '作动词可直接接 the fee，也可说 refund someone。作名词时用 a refund 或 request a refund。本篇是提出请求，不能把请求本身写成中心已经同意退款。', en: 'As a verb it can take the fee or a person as its object. As a noun, use a refund or request a refund. This sentence asks for a refund; it does not establish that the centre has agreed.' },
            collocations: ['refund the fee', 'refund the full amount', 'request a refund'],
            example: { en: 'Could you refund the delivery charge for the cancelled order?', zh: '您能退还这笔已取消订单的配送费吗？' },
            segmentIndex: 6,
          },
          {
            term: 'punctuality',
            partOfSpeech: '名词（noun，不可数）',
            meaning: { zh: '守时情况；本篇针对教师多次迟到', en: 'The practice of being on time; here, the tutor\'s attendance timing.' },
            usage: { zh: '把 review the tutor 限定成 review the tutor\'s punctuality，检查对象更明确。punctual 是形容词，punctuality 是名词；它讨论是否准时，不等同于整体教学能力。', en: 'Review the tutor\'s punctuality identifies a specific issue more clearly than review the tutor. Punctual is the adjective and punctuality the noun. The term concerns timeliness, not overall teaching ability.' },
            collocations: ['improve punctuality', 'a record of punctuality', 'the importance of punctuality'],
            example: { en: 'The team discussed how to improve punctuality at weekly meetings.', zh: '团队讨论了如何改善每周例会的守时情况。' },
            segmentIndex: 7,
          },
          {
            term: 'resolve',
            partOfSpeech: '动词（verb）',
            meaning: { zh: '解决问题或争议；本篇希望投诉得到处理', en: 'Settle a problem or disagreement; here, reach a resolution of the complaint.' },
            usage: { zh: '常接 matter、issue、dispute。resolve this matter 是礼貌收束，具体怎么解决应已在前文写明。不要把它与 solve a maths problem 的所有搭配互换，也不要把希望当成已解决。', en: 'Common objects include matter, issue and dispute. Resolve this matter closes the letter politely, while the earlier paragraph supplies the actual remedies. Do not treat it as interchangeable with every use of solve, or imply that a hoped-for resolution has already occurred.' },
            collocations: ['resolve this matter', 'resolve an issue', 'resolve a dispute'],
            example: { en: 'A short meeting helped us resolve the misunderstanding.', zh: '一次简短的会议帮助我们消除了误会。' },
            segmentIndex: 8,
          },
        ],
      },
    },
  },
];
