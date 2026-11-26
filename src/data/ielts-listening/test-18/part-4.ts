import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 18 · Part 4 — 讲座：印刷机的发明与传播（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：手抄本时代 → 木版印刷 → 活字与压印 → 装订成书 → 手抄缓慢的原因 →
 * 活字优势 → 知识传播 → 三种早期技术特征回顾。
 * 开场用历史事实与数字起手，不用 Today’s lecture is about 句式。
 */
export const test18Part4: ListeningLesson = {
  slug: 'test-18-part-4',
  part: 4,
  status: 'published',
  title: { zh: '印刷机', en: 'The printing press' },
  summary: {
    zh: '一场回顾印刷机历史的讲座：古腾堡之前书籍如何靠手抄完成，木版印刷的局限，活字如何用可重复的单个字母排版，螺丝压印机如何保证纸面受压均匀，印张如何装订成书，以及印刷如何让书籍更便宜、传播更广。',
    en: 'A lecture on the printing press: how books were copied by hand before Gutenberg, the limits of woodblock printing, how movable type reused individual letters, how the screw press gave even pressure, how sheets were bound into books, and how print made books cheaper and more widely owned.',
  },
  accent: { zh: '讲师为英式口音，关键年代与工艺名称会放慢重复。', en: 'The lecturer has a British accent and repeats key dates and technical terms slowly.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Before Gutenberg, books were copied by', cells: [[{ blank: 31 }]] },
        { lead: 'Movable type used small individual', cells: [[{ blank: 32 }]] },
        { lead: 'The press was adapted from a wine', cells: [[{ blank: 33 }]] },
        { lead: 'Sheets were folded, trimmed and', cells: [[{ blank: 34 }, { text: ' into books' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why was hand copying so slow?',
          options: [
            { key: 'A', text: 'Each page had to be copied letter by letter' },
            { key: 'B', text: 'Scribes had no paper to write on' },
            { key: 'C', text: 'Books were kept locked in churches' },
          ],
        },
        {
          number: 36,
          stem: 'What was the main advantage of movable type?',
          options: [
            { key: 'A', text: 'The letters were carved once for each whole page' },
            { key: 'B', text: 'The letters could be rearranged for each new page' },
            { key: 'C', text: 'The press made the printing ink cheaper' },
          ],
        },
        {
          number: 37,
          stem: 'How did print change who owned knowledge?',
          options: [
            { key: 'A', text: 'Books were printed on cheaper paper only' },
            { key: 'B', text: 'Books became cheaper and more widely owned' },
            { key: 'C', text: 'Libraries kept fewer chained copies' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which feature matches each early technique? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'whole page carved on one block' },
        { key: 'B', text: 'reusable individual letters' },
        { key: 'C', text: 'even pressure across the whole sheet' },
        { key: 'D', text: 'wooden boards and leather covers' },
        { key: 'E', text: 'ink mixed from oak galls and water' },
        { key: 'F', text: 'letters set in lines inside a frame' },
      ],
      items: [
        { number: 38, text: 'woodblock printing' },
        { number: 39, text: 'movable type' },
        { number: 40, text: 'the screw press' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['hand'], evidence: 3,
      explanation: {
        zh: '定位句 3：Books were copied by hand, usually in monasteries or small scriptoriums。古腾堡之前书籍靠手抄；metal 活字是后来的工艺，不能填。',
        en: 'Sentence 3: "Books were copied by hand, usually in monasteries or small scriptoriums". Books were copied by hand before Gutenberg; metal type came later, so it is not the answer.',
      },
    },
    {
      number: 32, accepted: ['letters'], evidence: 14,
      explanation: {
        zh: '定位句 14：His key step was movable type, small pieces shaped as individual letters。活字是单个字母；blocks 属于木版印刷，不是活字构件。',
        en: 'Sentence 14: "His key step was movable type, small pieces shaped as individual letters". Movable type used individual letters; blocks belong to woodblock printing, not the type itself.',
      },
    },
    {
      number: 33, accepted: ['press'], evidence: 19,
      explanation: {
        zh: '定位句 19：Gutenberg adapted the screw press used to squeeze grapes for wine。压印机借自葡萄酒压榨机；grapes 是压榨对象，不是空里的词。',
        en: 'Sentence 19: "Gutenberg adapted the screw press used to squeeze grapes for wine". The press came from a wine press; grapes are what it squeezed, not the answer.',
      },
    },
    {
      number: 34, accepted: ['bound'], evidence: 24,
      explanation: {
        zh: '定位句 24：Each sheet was folded, trimmed and bound into the collected volume。印张折好裁切后装订成册；covers 是装订所用材料，不是动作。',
        en: 'Sentence 24: "Each sheet was folded, trimmed and bound into the collected volume". Sheets were bound into the volume; covers are the material used in binding, not the action.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：The copyist worked letter by letter, so every page repeated the whole process from the start。手抄慢在逐字母抄写；没有纸和教堂上锁在全段没有依据。',
        en: 'Sentence 28: "The copyist worked letter by letter, so every page repeated the whole process from the start". Hand copying was slow because each letter was copied; having no paper and locked churches have no basis.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：With movable type, the letters could be rearranged for each new page。活字的优势是字母可重新排版；整页刻版是木版做法，油墨便宜在全段未提。',
        en: 'Sentence 32: "With movable type, the letters could be rearranged for each new page". The advantage is rearranging letters; carving a whole page is the woodblock method, and cheaper ink is not mentioned.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Printed volumes were far cheaper than hand-copied manuscripts。印刷让书籍更便宜、更多人拥有；只换便宜纸和减少上锁副本在全段没有依据。',
        en: 'Sentence 36: "Printed volumes were far cheaper than hand-copied manuscripts". Print made books cheaper and more widely owned; cheaper paper alone and fewer chained copies have no basis.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：The woodblock printed the whole page carved onto a single block。木版是整页刻在一块版上，对应 A。',
        en: 'Sentence 43: "The woodblock printed the whole page carved onto a single block". Woodblock printing carved a whole page on one block, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 44,
      explanation: {
        zh: '定位句 44：Movable type reused individual letters that could be set and then taken apart。活字复用单个字母，对应 B。',
        en: 'Sentence 44: "Movable type reused individual letters that could be set and then taken apart". Movable type reused individual letters, matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 45,
      explanation: {
        zh: '定位句 45：The screw press applied even pressure across the whole sheet。螺丝压印机让整张纸面受压均匀，对应 C。',
        en: 'Sentence 45: "The screw press applied even pressure across the whole sheet". The screw press gave even pressure across the sheet, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Before the middle of the fifteenth century, finishing one book could take a scribe a whole year.' },
    { speaker: 'lecturer', text: 'That single fact explains why printed books changed European life so deeply.' },
    { speaker: 'lecturer', text: 'We begin with the methods that existed before Gutenberg’s workshop.' },
    { speaker: 'lecturer', text: 'Books were copied by hand, usually in monasteries or small scriptoriums.' },
    { speaker: 'lecturer', text: 'The copyist sat at a desk and wrote each page with a quill.' },
    { speaker: 'lecturer', text: 'Ink was mixed from oak galls and water, and the paper was expensive.' },
    { speaker: 'lecturer', text: 'A single mistake meant scraping the surface or wasting the whole sheet.' },
    { speaker: 'lecturer', text: 'Most books were large, heavy volumes kept in church libraries or wealthy houses.' },
    { speaker: 'lecturer', text: 'Printing from a woodblock had already been used in Asia for several centuries.' },
    { speaker: 'lecturer', text: 'A whole page was carved in reverse onto one flat wooden block.' },
    { speaker: 'lecturer', text: 'The printer inked the block and pressed paper onto it by hand.' },
    { speaker: 'lecturer', text: 'This worked well for short poems or religious pictures, but each block served one page only.' },
    { speaker: 'lecturer', text: 'Blocks wore out after a few hundred impressions, and a new book meant carving everything again.' },
    { speaker: 'lecturer', text: 'Around the middle of the fourteen hundreds, Gutenberg combined older ideas into one machine.' },
    { speaker: 'lecturer', text: 'His key step was movable type, small pieces shaped as individual letters.' },
    { speaker: 'lecturer', text: 'Each letter was cast in metal, so the same character could be used again.' },
    { speaker: 'lecturer', text: 'The type was set in lines inside a frame, then taken apart after the sheet was printed.' },
    { speaker: 'lecturer', text: 'This reuse is what made large print runs cheaper than carving fresh blocks.' },
    { speaker: 'lecturer', text: 'The second borrowed element was the press itself.' },
    { speaker: 'lecturer', text: 'Gutenberg adapted the screw press used to squeeze grapes for wine.' },
    { speaker: 'lecturer', text: 'A heavy plate came down on the paper, spreading the ink evenly across the sheet.' },
    { speaker: 'lecturer', text: 'Earlier printers had rubbed the block by hand, which gave uneven results.' },
    { speaker: 'lecturer', text: 'The press also allowed many copies to be finished in a steady rhythm.' },
    { speaker: 'lecturer', text: 'Once the sheets came off the press, the work was not yet a book.' },
    { speaker: 'lecturer', text: 'Each sheet was folded, trimmed and bound into the collected volume.' },
    { speaker: 'lecturer', text: 'The binding protected the pages and let the reader hold the work in one piece.' },
    { speaker: 'lecturer', text: 'Binders added wooden boards and leather covers for the more expensive editions.' },
    { speaker: 'lecturer', text: 'Let us look now at why hand copying could not keep up with demand.' },
    { speaker: 'lecturer', text: 'The copyist worked letter by letter, so every page repeated the whole process from the start.' },
    { speaker: 'lecturer', text: 'There was no way to produce the same page twice at speed.' },
    { speaker: 'lecturer', text: 'Scribes often added decorated capital letters and small drawings in the margins.' },
    { speaker: 'lecturer', text: 'Those details made each manuscript valuable, but they also added weeks to the work.' },
    { speaker: 'lecturer', text: 'With movable type, the letters could be rearranged for each new page.' },
    { speaker: 'lecturer', text: 'A case set for one poem could be broken up and reused in the next booklet.' },
    { speaker: 'lecturer', text: 'That flexibility is the central advantage over woodblocks and hand writing.' },
    { speaker: 'lecturer', text: 'The press itself did not invent reading, but it changed who could own books.' },
    { speaker: 'lecturer', text: 'Printed volumes were far cheaper than hand-copied manuscripts.' },
    { speaker: 'lecturer', text: 'More people bought books, and small private libraries began to appear in towns.' },
    { speaker: 'lecturer', text: 'Texts spread beyond church walls, and scholars compared editions from different cities.' },
    { speaker: 'lecturer', text: 'Knowledge moved faster once a poem, a law or a chart could be reproduced many times.' },
    { speaker: 'lecturer', text: 'Critics at the time noted that cheap books also carried poor arguments more widely.' },
    { speaker: 'lecturer', text: 'Print did not guarantee that every idea was sound, only that it reached many readers.' },
    { speaker: 'lecturer', text: 'Before we close, let us match the three early techniques to their main features.' },
    { speaker: 'lecturer', text: 'The woodblock printed the whole page carved onto a single block.' },
    { speaker: 'lecturer', text: 'Movable type reused individual letters that could be set and then taken apart.' },
    { speaker: 'lecturer', text: 'The screw press applied even pressure across the whole sheet.' },
    { speaker: 'lecturer', text: 'Each method built on the last, and Gutenberg combined them in a workshop near Mainz.' },
    { speaker: 'lecturer', text: 'His first major printed work was a long edition of the Latin Bible.' },
    { speaker: 'lecturer', text: 'About one hundred and eighty copies survive today in libraries around the world.' },
    { speaker: 'lecturer', text: 'Early print shops kept their methods close, but skilled workmen travelled between cities.' },
    { speaker: 'lecturer', text: 'Within fifty years, presses stood in most major trading towns of Europe.' },
    { speaker: 'lecturer', text: 'Paper mills expanded to supply the growing number of sheets.' },
    { speaker: 'lecturer', text: 'Literacy rose slowly, as more households kept books they could read themselves.' },
    { speaker: 'lecturer', text: 'Teachers no longer had to explain a text from a single chained copy.' },
    { speaker: 'lecturer', text: 'Students could compare notes against the same printed edition.' },
    { speaker: 'lecturer', text: 'The next lecture will trace how print shaped scientific debate after the fifteen hundreds.' },
    { speaker: 'lecturer', text: 'For now, remember that the press was a combination of older parts, not a sudden invention.' },
    { speaker: 'lecturer', text: 'That is the end of today’s talk. I hope the cases are clearer now.' },
  ],
  vocabulary: [
    {
      term: 'scribe', phonetic: '/skraɪb/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '抄写员，誊写人', en: 'a person who copies manuscripts by hand before printing' },
      usage: { zh: '可数；a scribe、the copyist and scribes。', en: 'Countable: a scribe, the copyist and scribes.' },
      collocations: ['a scribe', 'the scribes', 'a medieval scribe'],
      example: { en: 'A scribe could take a whole year to finish one book.', zh: '一名抄写员可能花一整年写完一本书。' },
      listening: { zh: '单音节 /skraɪb/，开头 /skr/ 辅音连缀清晰。', en: 'One syllable /skraɪb/ with a clear opening /skr/ cluster.' },
    },
    {
      term: 'manuscript', phonetic: '/ˈmænjuskrɪpt/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '手抄本，手稿', en: 'a hand-written book or document before printed editions' },
      usage: { zh: '可数；hand-copied manuscripts、a manuscript volume。', en: 'Countable: hand-copied manuscripts, a manuscript volume.' },
      collocations: ['a manuscript', 'hand-copied manuscripts', 'an early manuscript'],
      example: { en: 'Printed volumes were cheaper than hand-copied manuscripts.', zh: '印本比手抄本便宜得多。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmæn/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'woodblock', phonetic: '/ˈwʊdblɒk/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '木版，雕版', en: 'a carved wooden block used to print a whole page' },
      usage: { zh: '可数；woodblock printing、a carved woodblock。', en: 'Countable: woodblock printing, a carved woodblock.' },
      collocations: ['woodblock printing', 'a wooden block', 'carve a block'],
      example: { en: 'Woodblock printing was used in Asia for centuries.', zh: '木版印刷在亚洲已有数百年历史。' },
      listening: { zh: '复合词 wood + block，重音在第一音节。', en: 'Compound wood plus block, stress on the first.' },
    },
    {
      term: 'movable type', phonetic: '/ˈmuːvəbl taɪp/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '活字，可移动铅字', en: 'separate letters that can be arranged and reused for each page' },
      usage: { zh: '不可数搭配；movable type、set the type。', en: 'Used as a unit: movable type, set the type.' },
      collocations: ['movable type', 'the movable type', 'metal type'],
      example: { en: 'Movable type used small individual letters.', zh: '活字由单个小字母组成。' },
      listening: { zh: 'movable 重音在第一音节；type 单音节。', en: 'movable stresses the first syllable; type is one syllable.' },
    },
    {
      term: 'press', phonetic: '/pres/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '压印机，印刷机', en: 'the machine that presses paper onto the inked type' },
      usage: { zh: '可数；the screw press、the printing press。动词 press。', en: 'Countable: the screw press, the printing press. The verb is press.' },
      collocations: ['the screw press', 'the printing press', 'the press itself'],
      example: { en: 'Gutenberg adapted the press from a wine press.', zh: '古腾堡把压印机改自葡萄酒压榨机。' },
      listening: { zh: '单音节 /pres/，结尾 /s/ 清辅音。', en: 'One syllable /pres/ ending in a voiceless /s/.' },
    },
    {
      term: 'bound', phonetic: '/baʊnd/', partOfSpeech: 'v.', sentenceIndex: 24,
      meaning: { zh: '装订（成册）', en: 'to stitch and cover the sheets into a book' },
      usage: { zh: 'bind 的过去分词；folded, trimmed and bound。名词 binding。', en: 'Past participle of bind: folded, trimmed and bound. The noun is binding.' },
      collocations: ['bound into a book', 'bound in leather', 'a bound volume'],
      example: { en: 'The sheets were folded, trimmed and bound into a volume.', zh: '印张折好裁切后装订成册。' },
      listening: { zh: '单音节 /baʊnd/，双元音 /aʊ/；勿读 /bɒnd/。', en: 'One syllable /baʊnd/ with /aʊ/; do not say /bɒnd/.' },
    },
    {
      term: 'rearranged', phonetic: '/ˌriːəˈreɪndʒd/', partOfSpeech: 'v.', sentenceIndex: 32,
      meaning: { zh: '重新排列', en: 'to arrange the type again for a new page' },
      usage: { zh: '过去分词；letters rearranged、rearrange the type。', en: 'Past participle: letters rearranged, rearrange the type.' },
      collocations: ['rearranged the letters', 'rearrange the type', 'rearranged for each page'],
      example: { en: 'The letters could be rearranged for each new page.', zh: '字母可以为每一页重新排版。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈreɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'literacy', phonetic: '/ˈlɪtərəsi/', partOfSpeech: 'n.', sentenceIndex: 52,
      meaning: { zh: '读写能力', en: 'the ability to read and write among a population' },
      usage: { zh: '不可数；literacy rose、basic literacy。', en: 'Uncountable: literacy rose, basic literacy.' },
      collocations: ['literacy rose', 'basic literacy', 'literacy levels'],
      example: { en: 'Literacy rose slowly as households kept readable books.', zh: '家庭有了可读的书，读写能力慢慢提高。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈlɪ/。', en: 'Four syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'copied by hand', sentenceIndex: 3,
      meaning: { zh: '手抄，手工誊写', en: 'written out one copy at a time by a person' },
      usage: { zh: '被动搭配；copied by hand、written by hand。', en: 'Passive: copied by hand, written by hand.' },
      example: { en: 'Books were copied by hand in small scriptoriums.', zh: '书籍在小抄写室里靠手抄完成。' },
    },
    {
      phrase: 'wore out', sentenceIndex: 12,
      meaning: { zh: '磨损，用坏', en: 'to stop working after many uses' },
      usage: { zh: 'wear out 的过去式；blocks wore out、tires wear out。', en: 'Past of wear out: blocks wore out, tyres wear out.' },
      example: { en: 'Wooden blocks wore out after a few hundred impressions.', zh: '木版印几百次后就磨损了。' },
    },
    {
      phrase: 'at speed', sentenceIndex: 29,
      meaning: { zh: '快速地', en: 'quickly, in large numbers at one time' },
      usage: { zh: '方式状语；produce the page at speed。', en: 'An adverbial: produce the page at speed.' },
      example: { en: 'There was no way to produce the same page twice at speed.', zh: '同一页无法快速复制第二份。' },
    },
    {
      phrase: 'private libraries', sentenceIndex: 37,
      meaning: { zh: '私人藏书，私人书房', en: 'book collections kept in ordinary town homes' },
      usage: { zh: '可数复数；small private libraries、a private library。', en: 'Countable plural: small private libraries, a private library.' },
      example: { en: 'Small private libraries began to appear in towns.', zh: '小镇里开始出现私人藏书。' },
    },
    {
      phrase: 'built on the last', sentenceIndex: 46,
      meaning: { zh: '建立在前一步之上', en: 'to develop from an earlier method or invention' },
      usage: { zh: 'build on something；过去式 built on。', en: 'Build on something; past built on.' },
      example: { en: 'Each method built on the last, and the press combined them.', zh: '每种方法都建立在前一种之上，印刷机把它们合在一起。' },
    },
    {
      phrase: 'chained copy', sentenceIndex: 53,
      meaning: { zh: '（教堂图书馆）上锁的单本藏书', en: 'a single book locked to a desk in an early library' },
      usage: { zh: '可数；a chained copy、chained manuscripts。', en: 'Countable: a chained copy, chained manuscripts.' },
      example: { en: 'Teachers no longer explained one chained copy to the class.', zh: '教师不必再围着一本上锁的书讲课。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题抓工艺名词', en: 'For notes, catch the craft nouns' },
      body: {
        zh: '第 31–34 题按讲座顺序排列。笔记已印好动作上下文（copied by、individual、wine、folded and），听到 hand、letters、press、bound 这类工艺词再落笔；答案多为单一名词或过去分词，别填整句。',
        en: 'Items 31 to 34 follow the lecture order. The notes print the action context such as copied by, individual, wine and folded and; write down hand, letters, press or bound when you hear them. Answers are usually a single noun or past participle, not a phrase.',
      },
    },
    {
      title: { zh: '配对题用技术名回勾', en: 'For matching, anchor on the technique' },
      body: {
        zh: '第 38–40 题把三种早期技术与特征配对。结尾回顾段每句先报技术名（woodblock、movable type、screw press），再说特征；先把技术名写在题号旁，再把 carved block、reusable letters、even pressure 对上字母。',
        en: 'Items 38 to 40 pair three techniques with features. The closing review names the technique first, woodblock, movable type or screw press, then the feature. Write the technique beside the number, then match carved block, reusable letters and even pressure to a letter.',
      },
    },
    {
      title: { zh: '优势题听对比句', en: 'For advantage items, listen for contrast' },
      body: {
        zh: '第 36 题问活字优势，答案在 advantage 与 flexibility 附近；录音先讲木版整页雕刻的局限，再用 with movable type 转折给出复用字母的长处。转折词之后才是被肯定的优势。',
        en: 'Item 36 asks the movable-type advantage, answered near advantage and flexibility. The talk first states the woodblock limit, then turns with with movable type to reusable letters. The affirmed advantage follows the contrast.',
      },
    },
  ],
};
