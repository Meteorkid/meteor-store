import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 33 · Part 4 — 讲座：语言的演化（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：语音变化 → 借词 → 语系 → 语言消亡 → 变化动因（儿童习得、贸易接触、语法证据）→
 * 三种概念回顾配对。开场用语言数量事实起手，不用 Today’s lecture is about 句式。
 */
export const test33Part4: ListeningLesson = {
  slug: 'test-33-part-4',
  part: 4,
  status: 'published',
  title: { zh: '语言的演化', en: 'The evolution of languages' },
  summary: {
    zh: '讲座讲解语言随时间的变化：语音在语言内部缓慢漂移，外来词作为借词融入本地语法，拥有共同祖先的语言组成语系，没有使用者的语言即为消亡。变化的动因包括儿童习得时的不完美传承、与邻族贸易接触带来的借词，以及通过共享语法和相似词汇确认的亲属关系。结尾把语音变化、借词、语系三个概念与各自特征配对。',
    en: 'The lecture explains how languages change: sounds drift inside a community, borrowed words settle into local grammar, tongues sharing an ancestor form a family, and a speakerless language is extinct. Drivers include imperfect child acquisition, trade contact with neighbours, and family links confirmed by shared grammar. The closing review matches the three concepts to their features.',
  },
  accent: { zh: '讲师为英式口音，关键术语与年代关系会放慢重复。', en: 'The lecturer has a British accent and repeats key terms and family links slowly.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Over centuries, sounds shift within a', cells: [[{ blank: 31 }]] },
        { lead: 'Words borrowed from another language are called', cells: [[{ blank: 32 }]] },
        { lead: 'Languages sharing a common ancestor form a language', cells: [[{ blank: 33 }]] },
        { lead: 'A language with no remaining speakers is', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'What causes sound change over generations?',
          options: [
            { key: 'A', text: 'teachers forcing a standard accent in schools' },
            { key: 'B', text: 'children learning speech imperfectly' },
            { key: 'C', text: 'writers changing words in printed books' },
          ],
        },
        {
          number: 36,
          stem: 'Why do loanwords enter a language?',
          options: [
            { key: 'A', text: 'trade and contact with neighbours' },
            { key: 'B', text: 'a legal rule requiring new spelling' },
            { key: 'C', text: 'the loss of old written records' },
          ],
        },
        {
          number: 37,
          stem: 'What evidence links languages to the same family?',
          options: [
            { key: 'A', text: 'the same number of speakers in each town' },
            { key: 'B', text: 'identical weather and landscape words' },
            { key: 'C', text: 'shared grammar and similar words' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which feature matches each concept? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'sounds gradually shift in pronunciation' },
        { key: 'B', text: 'words taken from neighbouring speech' },
        { key: 'C', text: 'common ancestor links related tongues' },
        { key: 'D', text: 'fewer children learn the speech' },
        { key: 'E', text: 'written records preserve old forms' },
        { key: 'F', text: 'speakers switch to a dominant language' },
      ],
      items: [
        { number: 38, text: 'sound change' },
        { number: 39, text: 'borrowing' },
        { number: 40, text: 'the language family' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['language'], evidence: 4,
      explanation: {
        zh: '定位句 4：Over centuries, sounds shift within a language, as vowels and consonants move closer to neighbouring sounds。语音在语言内部漂移，填 language。community 是使用群体，不是漂移所在的语言。',
        en: 'Sentence 4: "Over centuries, sounds shift within a language, as vowels and consonants move closer to neighbouring sounds". Sounds shift within a language, so write language. Community is the group that speaks it, not the language itself.',
      },
    },
    {
      number: 32, accepted: ['loanwords'], evidence: 8,
      explanation: {
        zh: '定位句 8：Words borrowed from another language are called loanwords, and they settle into the local grammar。外来词称 loanwords，填 loanwords。term 在此指说法，不是答案。',
        en: 'Sentence 8: "Words borrowed from another language are called loanwords, and they settle into the local grammar". Borrowed words are loanwords, so write loanwords. Term here means the label, not the answer.',
      },
    },
    {
      number: 33, accepted: ['family'], evidence: 12,
      explanation: {
        zh: '定位句 12：Languages sharing a common ancestor form a language family, and related words appear across the group。同祖先语言组成语系，填 family。group 是语系内成员，不是类别名。',
        en: 'Sentence 12: "Languages sharing a common ancestor form a language family, and related words appear across the group". They form a language family, so write family. Group means the members, not the category.',
      },
    },
    {
      number: 34, accepted: ['extinct'], evidence: 17,
      explanation: {
        zh: '定位句 17：A language with no remaining speakers is extinct, and its last words leave no children to carry them on。无使用者的语言已消亡，填 extinct。edge 指濒危状态，不是消亡本身。',
        en: 'Sentence 17: "A language with no remaining speakers is extinct, and its last words leave no children to carry them on". A speakerless language is extinct, so write extinct. Edge means endangered, not extinct.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：Children are the main engine of change. They learn speech imperfectly, smoothing over details their parents used。语音变化由儿童不完美习得推动，对应 B。学校标准口音与书本改字在录音中未出现。',
        en: 'Sentence 24: "Children are the main engine of change. They learn speech imperfectly, smoothing over details their parents used". Change is driven by imperfect child acquisition, matching B. School standard accents and writers changing books are not mentioned.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：Loanwords often arrive through trade and contact with neighbours。借词来自贸易与邻族接触，对应 A。法律拼写规则与书面记录遗失在全段没有依据。',
        en: 'Sentence 27: "Loanwords often arrive through trade and contact with neighbours". Loanwords come through trade contact, matching A. Spelling rules and lost records have no basis.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：Shared grammar and similar words are the evidence that links languages to the same family。共享语法与相似词汇是亲属关系证据，对应 C。人数相同与天气景物词在录音中未出现。',
        en: 'Sentence 29: "Shared grammar and similar words are the evidence that links languages to the same family". Shared grammar and similar words link the family, matching C. Equal speaker counts and weather words are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：Sound change is the gradual drift of pronunciation inside one speech community。语音变化是发音的逐渐漂移，对应 A。',
        en: 'Sentence 31: "Sound change is the gradual drift of pronunciation inside one speech community". Sound change is gradual pronunciation drift, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：Borrowing takes words from neighbouring speech and fits them into the local grammar。借词取自邻族语言，对应 B。',
        en: 'Sentence 32: "Borrowing takes words from neighbouring speech and fits them into the local grammar". Borrowing takes neighbouring words, matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：A language family links related tongues through a common ancestor。语系靠共同祖先关联亲属语言，对应 C。',
        en: 'Sentence 33: "A language family links related tongues through a common ancestor". The family links related tongues through an ancestor, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'About seven thousand languages are spoken on Earth today, and most of them are used by small communities.' },
    { speaker: 'lecturer', text: 'Our topic this afternoon is how languages change over time, and what that change leaves behind.' },
    { speaker: 'lecturer', text: 'A language is not a fixed object. Its sounds, words and grammar move slowly from one generation to the next.' },
    { speaker: 'lecturer', text: 'The first kind of change to watch is sound change, the way pronunciation drifts inside a language.' },
    { speaker: 'lecturer', text: 'Over centuries, sounds shift within a language, as vowels and consonants move closer to neighbouring sounds.' },
    { speaker: 'lecturer', text: 'A word that once had one vowel may carry a different vowel a few hundred years later.' },
    { speaker: 'lecturer', text: 'These shifts are regular, so historians can trace a sound back through old texts.' },
    { speaker: 'lecturer', text: 'The second kind of change is borrowing, when words move from one speech community into another.' },
    { speaker: 'lecturer', text: 'Words borrowed from another language are called loanwords, and they settle into the local grammar.' },
    { speaker: 'lecturer', text: 'A community takes in terms for new goods, trades or ideas that its own words do not cover.' },
    { speaker: 'lecturer', text: 'Grammar can also borrow patterns, though whole sentences are rarely copied.' },
    { speaker: 'lecturer', text: 'The third idea is the language family, a group of tongues descended from one common ancestor.' },
    { speaker: 'lecturer', text: 'Languages sharing a common ancestor form a language family, and related words appear across the group.' },
    { speaker: 'lecturer', text: 'Historians compare old words and structures to see whether two tongues share a source.' },
    { speaker: 'lecturer', text: 'Written records preserve old forms, so researchers can watch a word change across centuries of texts.' },
    { speaker: 'lecturer', text: 'Without writing, reconstruction still works by comparing living dialects side by side.' },
    { speaker: 'lecturer', text: 'The last part of our topic is language death, the opposite of birth and spread.' },
    { speaker: 'lecturer', text: 'A language with no remaining speakers is extinct, and its last words leave no children to carry them on.' },
    { speaker: 'lecturer', text: 'Fewer children learn the speech when a community switches to a dominant language for work or school.' },
    { speaker: 'lecturer', text: 'A dominant language may offer wider jobs, so families raise their children in that speech instead.' },
    { speaker: 'lecturer', text: 'When only a few elderly speakers remain, the language sits on the edge of extinction.' },
    { speaker: 'lecturer', text: 'Some tongues survive because communities write them down and teach them in local schools.' },
    { speaker: 'lecturer', text: 'Others fade because no institution keeps the daily use alive.' },
    { speaker: 'lecturer', text: 'The loss of a language also loses its stories, names and ways of describing the world.' },
    { speaker: 'lecturer', text: 'Children are the main engine of change. They learn speech imperfectly, smoothing over details their parents used.' },
    { speaker: 'lecturer', text: 'Each generation passes on a slightly altered version, and the difference grows over centuries.' },
    { speaker: 'lecturer', text: 'Sound change does not follow a plan, and no speaker decides to alter a single word on purpose.' },
    { speaker: 'lecturer', text: 'Loanwords often arrive through trade and contact with neighbours.' },
    { speaker: 'lecturer', text: 'Sometimes the borrowed word keeps its original spelling, and sometimes it is spelled to fit the local sound system.' },
    { speaker: 'lecturer', text: 'Shared grammar and similar words are the evidence that links languages to the same family.' },
    { speaker: 'lecturer', text: 'The more features two languages share, the closer their branch on the family tree.' },
    { speaker: 'lecturer', text: 'Sound change is the gradual drift of pronunciation inside one speech community.' },
    { speaker: 'lecturer', text: 'Borrowing takes words from neighbouring speech and fits them into the local grammar.' },
    { speaker: 'lecturer', text: 'A language family links related tongues through a common ancestor.' },
    { speaker: 'lecturer', text: 'Loanwords show where two communities once traded or lived beside each other.' },
    { speaker: 'lecturer', text: 'Regular sound shifts let historians place a word on a branch of the family tree.' },
    { speaker: 'lecturer', text: 'Extinction follows when speakers choose another language and pass it to their children.' },
    { speaker: 'lecturer', text: 'The pace of change is slow in ordinary speech, but it speeds up after large migrations.' },
    { speaker: 'lecturer', text: 'Trade routes, empires and schools all spread words across wide areas.' },
    { speaker: 'lecturer', text: 'Modern media now carries speech between continents in a single day.' },
    { speaker: 'lecturer', text: 'That contact can keep a language alive, or push a smaller one toward the edge.' },
    { speaker: 'lecturer', text: 'Linguists record endangered tongues before their last speakers pass away.' },
    { speaker: 'lecturer', text: 'A recorded dictionary and grammar can help a community revive a speech later on.' },
    { speaker: 'lecturer', text: 'Revival is rare, but several small languages have been brought back from near extinction.' },
    { speaker: 'lecturer', text: 'The next session will compare two branches of one family, using words from old written records.' },
    { speaker: 'lecturer', text: 'For today, remember that every living language carries traces of its history.' },
    { speaker: 'lecturer', text: 'Sounds, borrowed words and family links all show where the speech has travelled.' },
    { speaker: 'lecturer', text: 'Even a short sentence contains changes that took hundreds of years to settle.' },
    { speaker: 'lecturer', text: 'Every language keeps a record of the contacts it has made along the way.' },
    { speaker: 'lecturer', text: 'Thank you for listening, and bring your questions to the next seminar.' },
  ],
  vocabulary: [
    {
      term: 'loanwords', phonetic: '/ˈləʊnwɜːdz/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '借词，外来词', en: 'words taken into one language from another' },
      usage: { zh: '可数复数；loanwords enter the language、borrowed loanwords。单数 loanword。', en: 'Countable plural: loanwords enter the language. Singular loanword.' },
      collocations: ['borrowed loanwords', 'local loanwords', 'a loanword from French'],
      example: { en: 'Loanwords settle into the local grammar over time.', zh: '借词随时间融入本地语法。' },
      listening: { zh: '复合词 loan + word，复数 /wɜːdz/。', en: 'Compound loan plus word, plural /wɜːdz/.' },
    },
    {
      term: 'ancestor', phonetic: '/ˈænsestə/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '祖先（原始母语）', en: 'the older source language from which related tongues descend' },
      usage: { zh: '可数；common ancestor、shared ancestor。', en: 'Countable: common ancestor, shared ancestor.' },
      collocations: ['a common ancestor', 'the shared ancestor', 'an ancestor language'],
      example: { en: 'Related tongues descend from one common ancestor.', zh: '亲属语言源自同一共同祖先。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈæn/；结尾 /ə/。', en: 'Three syllables with first-syllable stress; ending /ə/.' },
    },
    {
      term: 'extinct', phonetic: '/ɪkˈstɪŋkt/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '消亡的，已无使用者的', en: 'no longer spoken by any living person' },
      usage: { zh: '形容词；an extinct language、become extinct。名词 extinction。', en: 'Adjective: an extinct language, become extinct. The noun is extinction.' },
      collocations: ['an extinct language', 'become extinct', 'extinct speech'],
      example: { en: 'A language with no speakers is extinct.', zh: '没有使用者的语言已经消亡。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈstɪŋ/；结尾 /kt/。', en: 'Two syllables with stress on the second; ending /kt/.' },
    },
    {
      term: 'grammar', phonetic: '/ˈɡræmə/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '语法', en: 'the rules that join words into sentences' },
      usage: { zh: '不可数；shared grammar、grammar rules。', en: 'Uncountable: shared grammar, grammar rules.' },
      collocations: ['shared grammar', 'grammar rules', 'local grammar'],
      example: { en: 'Shared grammar links languages to the same family.', zh: '共享语法把语言归入同一语系。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɡræ/；结尾 /ə/。', en: 'Two syllables with first-syllable stress; ending /ə/.' },
    },
    {
      term: 'dialects', phonetic: '/ˈdaɪəlekts/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '方言，地区变体', en: 'a regional form of one language spoken locally' },
      usage: { zh: '可数复数；living dialects、compare two dialects。单数 dialect。', en: 'Countable plural: living dialects, compare two dialects. Singular dialect.' },
      collocations: ['living dialects', 'a regional dialect', 'compare dialects'],
      example: { en: 'Reconstruction compares living dialects side by side.', zh: '构拟通过并排比较现存方言完成。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈdaɪ/；复数结尾 /ts/。', en: 'Three syllables with first-syllable stress; plural ending /ts/.' },
    },
    {
      term: 'migrations', phonetic: '/maɪˈɡreɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '人口迁移（复数）', en: 'the movements of groups to settle in another area' },
      usage: { zh: '可数复数；large migrations、after migrations。单数 migration，动词 migrate。', en: 'Countable plural: large migrations, after migrations. Singular migration; the verb is migrate.' },
      collocations: ['large migrations', 'after migrations', 'a migration route'],
      example: { en: 'Change speeds up after large migrations.', zh: '大规模迁移后语言变化加快。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡreɪ/；复数结尾 /nz/。', en: 'Three syllables with stress on the second; plural ending /nz/.' },
    },
    {
      term: 'revival', phonetic: '/rɪˈvaɪvl/', partOfSpeech: 'n.', sentenceIndex: 43,
      meaning: { zh: '复兴，恢复使用', en: 'bringing a nearly lost language back into daily use' },
      usage: { zh: '不可数；language revival、revival of a speech。动词 revive。', en: 'Uncountable: language revival, revival of a speech. The verb is revive.' },
      collocations: ['the revival', 'a language revival', 'bring about a revival'],
      example: { en: 'Several small languages have been brought back from near extinction in a revival.', zh: '几种小语言通过复兴从濒危状态恢复过来。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈvaɪ/；结尾 /vl/。', en: 'Two syllables with stress on the second; ending /vl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'shift within', sentenceIndex: 4,
      meaning: { zh: '在……内部漂移', en: 'to move gradually inside a language or group' },
      usage: { zh: 'shift within 加范围；sounds shift within a language。', en: 'Shift within plus range: sounds shift within a language.' },
      example: { en: 'Sounds shift within a language over centuries.', zh: '数个世纪里语音在语言内部漂移。' },
    },
    {
      phrase: 'settle into', sentenceIndex: 8,
      meaning: { zh: '融入（本地语法）', en: 'to become part of the receiving language’s structure' },
      usage: { zh: 'settle into 加体系；settle into the grammar。', en: 'Settle into plus system: settle into the grammar.' },
      example: { en: 'Loanwords settle into the local grammar.', zh: '借词融入本地语法。' },
    },
    {
      phrase: 'shared grammar', sentenceIndex: 29,
      meaning: { zh: '共享语法', en: 'grammar rules held in common by related tongues' },
      usage: { zh: '不可数搭配；shared grammar and similar words。', en: 'Used as a unit: shared grammar and similar words.' },
      example: { en: 'Shared grammar is evidence of a common source.', zh: '共享语法是同源的证据。' },
    },
    {
      phrase: 'on the edge', sentenceIndex: 20,
      meaning: { zh: '濒临（消亡）', en: 'close to being lost or extinct' },
      usage: { zh: 'on the edge of 加状态；on the edge of extinction。', en: 'On the edge of plus state: on the edge of extinction.' },
      example: { en: 'A few elderly speakers leave the language on the edge.', zh: '只剩几位老人时语言濒临消亡。' },
    },
    {
      phrase: 'pass away', sentenceIndex: 41,
      meaning: { zh: '去世（婉称）', en: 'to die, used as a polite expression' },
      usage: { zh: 'pass away 的过去式；speakers pass away。对照 die。', en: 'Past of pass away: speakers pass away. Compare die.' },
      example: { en: 'Linguists record tongues before speakers pass away.', zh: '语言学家赶在使用者去世前记录语言。' },
    },
    {
      phrase: 'traces of', sentenceIndex: 45,
      meaning: { zh: '……的痕迹', en: 'signs left by an earlier history' },
      usage: { zh: 'traces of 加历史；traces of its history。', en: 'Traces of plus history: traces of its history.' },
      example: { en: 'Every living language carries traces of its history.', zh: '每种活语言都带着历史痕迹。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题抓概念名词', en: 'For notes, catch the concept nouns' },
      body: {
        zh: '第 31–34 题按讲座顺序排列，题干已印 within a、called、form a、no remaining speakers。听到 language、loanwords、family、extinct 再落笔；答案多为单一名词，别把句中另一个词（community、group、edge）填进空内。',
        en: 'Items 31 to 34 follow the lecture order, with printed leads within a, called, form a and no remaining speakers. Write language, loanwords, family or extinct when you hear them; answers are single nouns, not another word in the sentence such as community, group or edge.',
      },
    },
    {
      title: { zh: '配对题用概念名回勾', en: 'For matching, anchor on the concept' },
      body: {
        zh: '第 38–40 题把三种概念与特征配对。结尾回顾段每句先报概念（sound change、borrowing、language family），再说特征；先把概念写在题号旁，再把 pronunciation drift、neighbouring words、common ancestor 对上字母。',
        en: 'Items 38 to 40 pair three concepts with features. The closing review names the concept first, sound change, borrowing or language family, then the feature. Write the concept beside the number, then match pronunciation drift, neighbouring words and common ancestor to a letter.',
      },
    },
    {
      title: { zh: '原因题听对比句', en: 'For cause items, listen for contrast' },
      body: {
        zh: '第 35、36 题问变化与借词的原因，答案在 Children are the main engine、arrive through trade 这类因果句里。讲座原因题常以 because、through、by 引出；听到这些连接词先记录后面的主体（children、trade contact）。',
        en: 'Items 35 and 36 ask causes, answered in causal clauses such as Children are the main engine and arrive through trade. Lecture causes often follow because, through or by; note the subject after these connectors, children or trade contact.',
      },
    },
  ],
};
