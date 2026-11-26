import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 15 · Part 4 — 讲座：纸币的由来（单人，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 结构：早期票据与金属货币对比（单选 31）→ 防伪手段与惩罚（单选 32）→ 信用来源（单选 33）
 * → 信用崩塌的后果（单选 34）→ 承诺标的、惩罚、水印、发行权、信誉与交换物（笔记 35–40）。
 */
export const test15Part4: ListeningLesson = {
  slug: 'test-15-part-4',
  part: 4,
  status: 'published',
  title: { zh: '纸币的由来', en: 'The story of paper money' },
  summary: {
    zh: '讲座从早期商人的纸质票据讲起：纸币为何比金属硬币便于长途携带，早期防伪靠哪些纸张、印记与惩罚，公众信用建立在可兑换商品与储备之上，信用减弱时物价与持有行为如何变化，以及承诺标的、水印、发行权、信誉与交换物的对应关系。',
    en: 'The lecture begins with early merchant paper slips: why notes were easier to carry than coins over long distances, how forgery was discouraged through paper, marks and penalties, what public trust rests on in exchangeable goods and reserves, what happens when trust weakens, and the links between the promised metal, watermark, issuing right, reputation and goods.',
  },
  accent: { zh: '讲师为新西兰口音，术语会重复并举例说明。', en: 'The lecturer speaks with a New Zealand accent and repeats key terms with examples.' },
  speechRate: '+2%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What made early paper notes more practical than coins?',
          options: [
            { key: 'A', text: 'they could be exchanged for gold at any shop' },
            { key: 'B', text: 'they were lighter and easier to carry over long distances' },
            { key: 'C', text: 'they did not need to be counted or weighed at all' },
          ],
        },
        {
          number: 32,
          stem: 'How were forgeries discouraged in early note systems?',
          options: [
            { key: 'A', text: 'notes were printed only on special imported paper' },
            { key: 'B', text: 'severe penalties backed by hard-to-copy marks and designs' },
            { key: 'C', text: 'holders checked every note against a public register' },
          ],
        },
        {
          number: 33,
          stem: 'What gave a government note its public trust?',
          options: [
            { key: 'A', text: 'the belief it could be exchanged for goods and reserves' },
            { key: 'B', text: 'the personal wealth of the issuing merchant' },
            { key: 'C', text: 'the number of notes printed each year' },
          ],
        },
        {
          number: 34,
          stem: 'What happens when public trust in a currency weakens?',
          options: [
            { key: 'A', text: 'people hold on to notes as a store of value' },
            { key: 'B', text: 'prices rise and people seek things of lasting value' },
            { key: 'C', text: 'the central bank prints fewer notes each month' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early notes promised a fixed amount of', cells: [[{ blank: 35 }]] },
        { lead: 'Steady currency rests on reserves and the bank’s', cells: [[{ blank: 36 }]] },
        { lead: 'Central banks alone held the right to issue', cells: [[{ blank: 37 }]] },
        { lead: 'A note is accepted in exchange for real', cells: [[{ blank: 38 }]] },
        { lead: 'Security mark pressed into the paper: a', cells: [[{ blank: 39 }]] },
        { lead: 'Forgery carried a severe', cells: [[{ blank: 40 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 2,
      explanation: {
        zh: '定位句 2：heavy metal coins, which were hard to count and awkward to carry over long distances。纸币轻便、便于长途携带对应 B；A 的任意店铺兑金句中未提，C 说完全不用清点称重，与句 2 的 hard to count 不符。',
        en: 'Sentence 2: "heavy metal coins, which were hard to count and awkward to carry over long distances", matching B. Exchanging for gold at any shop in A is not mentioned, and C contradicts hard to count in the same sentence.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：Forgery was punished by severe penalties，句 7 补充特殊纸张、复杂图案与难复制印记。严惩加难仿造的设计对应 B；A 的进口纸张句中未提，C 的公开登记簿在讲座里没有出现。',
        en: 'Sentence 9: "Forgery was punished by severe penalties", and sentence 7 adds special paper, complex designs and hard-to-reproduce marks, matching B. Imported paper in A and a public register in C are never mentioned.',
      },
    },
    {
      number: 33, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：People trust a note when they believe it can be exchanged for real goods and stable metal reserves。可兑换商品与储备的信念对应 A；B 的商人个人财富和 C 的年印钞量都不是信用来源。',
        en: 'Sentence 11: "People trust a note when they believe it can be exchanged for real goods and stable metal reserves", matching A. The merchant’s personal wealth in B and the annual print run in C are not sources of trust.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：prices rise fast, and people rush to trade the paper for things of lasting value。物价上涨、人们转向保值物对应 B；A 的把纸币当储蓄句 15 已否定，C 的央行减少印钞在讲座中未提及。',
        en: 'Sentence 14: "prices rise fast, and people rush to trade the paper for things of lasting value", matching B. Holding notes as savings in A is ruled out in sentence 15, and the bank printing fewer notes in C is not mentioned.',
      },
    },
    {
      number: 35, accepted: ['silver'], evidence: 17,
      explanation: {
        zh: '定位句 17：It was a promise to pay a fixed amount of silver to whoever held the slip。早期票据承诺支付固定数量的白银；句 4 的 metal 是上位概念，笔记要填具体金属 silver。',
        en: 'Sentence 17: "It was a promise to pay a fixed amount of silver to whoever held the slip". The early slip promised a fixed amount of silver. Metal in sentence 4 is the general category; the note asks for the specific metal, silver.',
      },
    },
    {
      number: 36, accepted: ['reputation'], evidence: 32,
      explanation: {
        zh: '定位句 32：its reputation was built on decades of steady payment。储备之外，银行信誉维持币值稳定；句 13 的 keeps the currency steady 是信誉的作用，不是空格答案。',
        en: 'Sentence 32: "its reputation was built on decades of steady payment". Alongside reserves, the bank’s reputation keeps the currency steady. Keeps the currency steady in sentence 13 describes what reputation does, but it is not the blank answer.',
      },
    },
    {
      number: 37, accepted: ['notes'], evidence: 34,
      explanation: {
        zh: '定位句 34：That habit is what allows a whole economy to run on notes rather than heavy coin。货币流通的主体是纸币；句 13 的 reserves 是担保物，不是发行对象。',
        en: 'Sentence 34: "That habit is what allows a whole economy to run on notes rather than heavy coin". Notes are what circulate as money. The reserves in sentence 13 are the backing, not what is issued.',
      },
    },
    {
      number: 38, accepted: ['goods'], evidence: 38,
      explanation: {
        zh: '定位句 38：People then prefer land, grain or gold, goods that keep worth without relying on a promise。纸币被接受是因为可兑换真实商品；句 38 的 grain or gold 是保值物例子，不是这个上位词。',
        en: 'Sentence 38: "People then prefer land, grain or gold, goods that keep worth without relying on a promise". A note is accepted because it can be exchanged for real goods. Grain or gold in the same sentence are examples of stores of value, not this general term.',
      },
    },
    {
      number: 39, accepted: ['watermark'], evidence: 42,
      explanation: {
        zh: '定位句 42：The security features we see today, such as the watermark, raised ink and clear windows。水印是沿用至今的防伪印记；句 28 的彩色丝线是另一项特征，不要混填。',
        en: 'Sentence 42: "The security features we see today, such as the watermark, raised ink and clear windows". The watermark is a surviving security mark. The coloured threads in sentence 28 are a separate feature, not this blank.',
      },
    },
    {
      number: 40, accepted: ['penalties'], evidence: 48,
      explanation: {
        zh: '定位句 48：the long struggle against forgery through paper, marks and severe penalties。伪造要受严厉惩罚；空格前已印 severe，填 penalties 复数。句 24 的 crime 是定性，不是惩罚本身。',
        en: 'Sentence 48: "the long struggle against forgery through paper, marks and severe penalties". Forgery carried severe penalties. Severe is already printed, so write the plural penalties. The crime in sentence 24 names the offence, not the punishment.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Around nine hundred years ago, a trader in southern China carried folded paper slips that were lighter than the copper coins he had used before.' },
    { speaker: 'lecturer', text: 'That simple change marks the start of the story of paper money, and it raises a question we still answer today.' },
    { speaker: 'lecturer', text: 'Before these slips, people bought and sold with heavy metal coins, which were hard to count and awkward to carry over long distances.' },
    { speaker: 'lecturer', text: 'A merchant travelling a long way had to weigh his coins and watch them the whole journey, which slowed trade between towns.' },
    { speaker: 'lecturer', text: 'Early paper notes were first issued by merchants who trusted one another, and each slip stood for a fixed weight of metal.' },
    { speaker: 'lecturer', text: 'In time, towns and governments began to print their own notes, because they were far cheaper to move than coinage.' },
    { speaker: 'lecturer', text: 'The first practical problem was forgery. A counterfeiter could copy a slip and pass it off as genuine.' },
    { speaker: 'lecturer', text: 'Early notes therefore relied on special paper, complex designs and marks that were hard to reproduce by hand.' },
    { speaker: 'lecturer', text: 'One of those marks was a watermark, pressed into the paper during manufacture and visible when the note was held to the light.' },
    { speaker: 'lecturer', text: 'Forgery was punished by severe penalties, and in some systems the death penalty applied to repeated offenders.' },
    { speaker: 'lecturer', text: 'Even so, public trust was the deeper issue. A note is only worth something if everyone accepts it in trade.' },
    { speaker: 'lecturer', text: 'People trust a note when they believe it can be exchanged for real goods and stable metal reserves at any time.' },
    { speaker: 'lecturer', text: 'Over centuries, central banks were given the sole right to issue notes, and private money makers disappeared.' },
    { speaker: 'lecturer', text: 'A central bank holds reserves that back the notes in circulation, and its reputation keeps the currency steady.' },
    { speaker: 'lecturer', text: 'When trust in money weakens, prices rise fast, and people rush to trade the paper for things of lasting value.' },
    { speaker: 'lecturer', text: 'A note does not become worthless by itself; it loses value when the public doubts what it represents.' },
    { speaker: 'lecturer', text: 'Let us go back to the earliest slips to see how the system worked in practice.' },
    { speaker: 'lecturer', text: 'A note was not money in itself. It was a promise to pay a fixed amount of silver to whoever held the slip.' },
    { speaker: 'lecturer', text: 'The holder could walk into the issuing merchant’s shop and exchange the paper for the metal it named.' },
    { speaker: 'lecturer', text: 'This promise made the paper acceptable even to strangers, as long as the shop was known to honour its notes.' },
    { speaker: 'lecturer', text: 'When a merchant’s promises were doubted, his slips stopped circulating, and people went back to coin.' },
    { speaker: 'lecturer', text: 'Governments noticed this behaviour and began to borrow the same idea for public spending.' },
    { speaker: 'lecturer', text: 'Early state notes often carried the name of the ruler and the seal of the issuing treasury.' },
    { speaker: 'lecturer', text: 'The seal was hard to copy, and it linked each note to a body the public could hold responsible.' },
    { speaker: 'lecturer', text: 'Counterfeiting remained a serious crime because it undermined the whole currency, not just one shop.' },
    { speaker: 'lecturer', text: 'Punishments were designed to deter, and the threat was made known to every trader in the market.' },
    { speaker: 'lecturer', text: 'Yet penalties alone could not stop forgery if the note itself was easy to reproduce.' },
    { speaker: 'lecturer', text: 'Printers therefore developed features that required skill and equipment most counterfeiters did not own.' },
    { speaker: 'lecturer', text: 'Coloured threads were mixed into the paper, and fine patterns were engraved around the edges of each note.' },
    { speaker: 'lecturer', text: 'These details were cheap for an official printer to make, but costly for a forger to copy by hand.' },
    { speaker: 'lecturer', text: 'The trust behind a note also depended on who stood behind it.' },
    { speaker: 'lecturer', text: 'A private merchant could fail, but a government or central bank was expected to keep its promises over generations.' },
    { speaker: 'lecturer', text: 'The central bank’s reserves acted as a guarantee, and its reputation was built on decades of steady payment.' },
    { speaker: 'lecturer', text: 'When people believe the bank will honour its notes, they pass the paper on without checking the metal each time.' },
    { speaker: 'lecturer', text: 'That habit is what allows a whole economy to run on notes rather than heavy coin.' },
    { speaker: 'lecturer', text: 'History shows how quickly this trust can break down when a currency loses its backing.' },
    { speaker: 'lecturer', text: 'In periods of unrest, holders may rush to spend notes before their value slips further.' },
    { speaker: 'lecturer', text: 'Prices are marked up to cover the risk, and wages lose their purchasing power within months.' },
    { speaker: 'lecturer', text: 'People then prefer land, grain or gold, goods that keep worth without relying on a promise.' },
    { speaker: 'lecturer', text: 'This cycle is not caused by the paper itself, but by doubt about the institution that issued it.' },
    { speaker: 'lecturer', text: 'Modern notes carry the same logic, even though the metal backing has changed over time.' },
    { speaker: 'lecturer', text: 'A banknote still represents a claim on the central bank, and its value rests on public acceptance.' },
    { speaker: 'lecturer', text: 'The security features we see today, such as the watermark, raised ink and clear windows, continue the old fight against forgery.' },
    { speaker: 'lecturer', text: 'They do not create value by themselves; they protect the trust that the value depends on.' },
    { speaker: 'lecturer', text: 'So the story of paper money is less about the material than about the promise printed on it.' },
    { speaker: 'lecturer', text: 'Next week we will look at how digital payments have changed that promise, and what they mean for cash.' },
    { speaker: 'lecturer', text: 'Before we finish, let us summarise the three threads of today’s talk.' },
    { speaker: 'lecturer', text: 'First, the practical shift from heavy coin to light paper, which made long-distance trade easier.' },
    { speaker: 'lecturer', text: 'Second, the long struggle against forgery through paper, marks and severe penalties.' },
    { speaker: 'lecturer', text: 'Third, the role of trust, reserves and reputation in keeping a currency accepted.' },
    { speaker: 'lecturer', text: 'If you have questions about any example from the lecture, you can post them on the course board tonight.' },
  ],
  vocabulary: [
    {
      term: 'forgery', phonetic: '/ˈfɔːdʒəri/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '伪造（货币/文件）；伪造品', en: 'the act of copying something to deceive, or the copy itself' },
      usage: { zh: 'commit forgery、prevent forgery；动词 forge，伪造者 counterfeiter。', en: 'commit or prevent forgery; the verb is forge, the person is a counterfeiter.' },
      collocations: ['the problem of forgery', 'fight forgery', 'prevent forgery'],
      example: { en: 'Forgery threatened every note that left the printing shop.', zh: '伪造威胁着每一张出厂的纸币。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈfɔː/，中间 /dʒə/ 弱读。', en: 'Three syllables, stress on the first; the middle /dʒə/ is reduced.' },
    },
    {
      term: 'counterfeiter', phonetic: '/ˌkaʊntəˈfɪtə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '伪造者，造假币者', en: 'a person who makes illegal copies of money or documents' },
      usage: { zh: '法律与历史语境；动词 counterfeit，名词 counterfeit。', en: 'Legal and historical register; the verb and noun are counterfeit.' },
      collocations: ['a skilled counterfeiter', 'catch a counterfeiter', 'counterfeit notes'],
      example: { en: 'A counterfeiter needed skill most printers did not have.', zh: '造假者需要多数印刷工不具备的手艺。' },
      listening: { zh: '重音在第三音节 /ˈfɪt/，前面 /ˌkaʊntə/ 次重读。', en: 'Stress the third syllable; the first carries a secondary stress.' },
    },
    {
      term: 'watermark', phonetic: '/ˈwɔːtəmɑːk/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '水印', en: 'a faint design pressed into paper, visible against the light' },
      usage: { zh: '防伪语境；press a watermark、hold to the light。', en: 'In security features: press a watermark, hold to the light.' },
      collocations: ['a paper watermark', 'the watermark on the note', 'visible watermark'],
      example: { en: 'The watermark shows when the note is held to the light.', zh: '纸币对着光时水印可见。' },
      listening: { zh: '复合词，重音在第一音节 /ˈwɔː/，两词连读。', en: 'A compound with stress on the first element; both parts run together.' },
    },
    {
      term: 'penalties', phonetic: '/ˈpenəltiz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '惩罚，处罚', en: 'a punishment imposed for breaking a rule or law' },
      usage: { zh: 'severe penalty、carry a penalty；复数 penalties。', en: 'severe penalty, carry a penalty; the plural is penalties.' },
      collocations: ['severe penalties', 'a legal penalty', 'impose a penalty'],
      example: { en: 'Forgery carried severe penalties under the old rules.', zh: '按旧规伪造要受严厉处罚。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpen/，末尾 /ti/ 轻读。', en: 'Three syllables, stress on the first; the ending /ti/ is weak.' },
    },
    {
      term: 'reserves', phonetic: '/rɪˈzɜːvz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '储备（金/银/外汇）', en: 'stocks of metal or currency held as backing' },
      usage: { zh: 'central bank reserves、hold reserves；单数 reserve 指备用资源。', en: 'central bank reserves, hold reserves; the singular means a spare stock.' },
      collocations: ['metal reserves', 'bank reserves', 'hold reserves'],
      example: { en: 'The notes were backed by stable metal reserves.', zh: '纸币有稳定的金属储备作担保。' },
      listening: { zh: '词尾 /z/ 浊化；与 reserve 动词同根，重音在第二音节。', en: 'The final /z/ is voiced; related to the verb, stress on the second syllable.' },
    },
    {
      term: 'reputation', phonetic: '/ˌrepjuˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '信誉，名声', en: 'the public opinion of a bank or institution’s reliability' },
      usage: { zh: 'build a reputation、protect a reputation；不可数为主。', en: 'build or protect a reputation; mostly uncountable.' },
      collocations: ['the bank’s reputation', 'a steady reputation', 'damage the reputation'],
      example: { en: 'Its reputation was built on decades of steady payment.', zh: '它的信誉建立在数十年稳定兑付之上。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈteɪ/，前面 /ˌrepju/ 次重。', en: 'Four syllables, stress on the third; the first has secondary stress.' },
    },
    {
      term: 'circulation', phonetic: '/ˌsɜːkjəˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '（货币）流通', en: 'the state of being passed around as money' },
      usage: { zh: 'in circulation、put notes into circulation；动词 circulate。', en: 'in circulation, put notes into circulation; the verb is circulate.' },
      collocations: ['notes in circulation', 'enter circulation', 'leave circulation'],
      example: { en: 'The reserves back every note in circulation.', zh: '储备为每张流通中的纸币作担保。' },
      listening: { zh: '重音在第三音节 /ˈleɪ/，开头 /ˌsɜːk/ 次重读。', en: 'Stress the third syllable; the opening carries secondary stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'pass it off', sentenceIndex: 6,
      meaning: { zh: '冒充，以假乱真', en: 'to present a forgery as genuine' },
      usage: { zh: 'pass something off as genuine；代词放中间。', en: 'pass something off as genuine; put the pronoun in the middle.' },
      example: { en: 'The forger tried to pass the slip off as a real note.', zh: '造假者试图把票据冒充成真钞。' },
    },
    {
      phrase: 'stood for', sentenceIndex: 4,
      meaning: { zh: '代表，表示（金额/价值）', en: 'to represent a fixed amount or meaning' },
      usage: { zh: '纸币符号、缩写通用：stand for a sum；不用于站立义。', en: 'Used with sums and symbols; not the physical standing sense.' },
      example: { en: 'Each slip stood for a fixed weight of metal.', zh: '每张票据代表固定重量的金属。' },
    },
    {
      phrase: 'in circulation', sentenceIndex: 13,
      meaning: { zh: '在流通中', en: 'being passed around as valid money' },
      usage: { zh: 'notes in circulation、bring into circulation；反义 withdraw from circulation。', en: 'notes in circulation, bring into circulation; the opposite is withdraw from circulation.' },
      example: { en: 'The bank holds reserves behind every note in circulation.', zh: '银行为流通中每张纸币持有储备。' },
    },
    {
      phrase: 'hold responsible', sentenceIndex: 23,
      meaning: { zh: '追究（机构）责任', en: 'to treat a body as answerable for its promises' },
      usage: { zh: 'hold the bank responsible、hold the issuer responsible；后接 for。', en: 'hold the bank or issuer responsible; follow with for.' },
      example: { en: 'The public needed a body it could hold responsible.', zh: '公众需要一个可以追究责任的机构。' },
    },
    {
      phrase: 'break down', sentenceIndex: 35,
      meaning: { zh: '（体系/信用）崩溃，瓦解', en: 'to fail or collapse under doubt or pressure' },
      usage: { zh: '信任、制度、谈判可用 break down；也指机器故障。', en: 'Trust, systems and talks can break down; it also means machinery fails.' },
      example: { en: 'Trust can break down quickly when the backing is lost.', zh: '失去担保后信用可能很快崩塌。' },
    },
    {
      phrase: 'rush to', sentenceIndex: 14,
      meaning: { zh: '急忙去（做某事）', en: 'to move or act hurriedly, often from fear' },
      usage: { zh: 'rush to trade、rush to spend；后接动词原形。', en: 'rush to trade or spend; follow with the base verb.' },
      example: { en: 'People rush to trade paper for lasting value.', zh: '人们急忙把纸币换成保值物。' },
    },
  ],
  tips: [
    {
      title: { zh: '讲座先抓定义句', en: 'Catch the definition first' },
      body: {
        zh: 'Part 4 开头常先给概念定义。听到 a note was、a promise to 这类句式，立刻在笔记栏记下主体（票据）与属性（承诺支付金属），后面的填空多围绕这层定义展开。',
        en: 'Part 4 often opens with a definition. When you hear a note was or a promise to, note the subject (the slip) and its property (a promise to pay metal); later blanks usually grow from this definition.',
      },
    },
    {
      title: { zh: '同义替换对应选项', en: 'Match paraphrase in the options' },
      body: {
        zh: '单选题选项很少照搬原文。听到 lighter、awkward to carry 时，在选项里找 easier to carry 这类同义改写；听到 severe penalties 时，对应 hard-to-copy marks 与 punishment 的组合选项。',
        en: 'Single-choice options rarely copy the text. On hearing lighter or awkward to carry, look for easier to carry; on severe penalties, match the option combining punishment with hard-to-copy marks.',
      },
    },
    {
      title: { zh: '区分上位词与具体答案', en: 'Separate the general term from the answer' },
      body: {
        zh: '填空题常先给上位词再给具体词，例如 metal 之后才出现 silver。听到概称词不要立刻落笔，等紧跟的具体金属、物品或机构名称，再填进对应空格。',
        en: 'Completion often gives a general term before the specific one, such as metal followed by silver. Do not write at the general category; wait for the concrete metal, item or institution that follows.',
      },
    },
  ],
};
