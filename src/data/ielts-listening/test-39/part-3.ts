import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 39 · Part 3 — 导师与学生讨论纺织展策划方案。原创仿真材料，非官方真题。
 *
 * 两人分工确定展品选择、叙事线索、互动装置测试与预算审批；
 * 随后讨论展览主题、避光原因与标签完成期限，最后从预算清单中选出三项主要开支。
 */
export const test39Part3: ListeningLesson = {
  slug: 'test-39-part-3',
  part: 3,
  status: 'published',
  title: { zh: '纺织展策划', en: 'Planning an exhibition on textiles' },
  summary: {
    zh: '导师与学生为三周后开幕的纺织展分工：导师挑选参展织物，学生撰写按“从纤维到布料”线索展开的说明标签，两人共同测试声音装置，导师审批预算；展览以本地工坊织物为主线，避光为防止日晒褪色，标签须在开幕前两周定稿。预算三项主要开支为防护展柜、互动织布机与展柜照明设备。',
    en: 'A tutor and a student split work for a textiles show in three weeks. The tutor chooses fabrics, the student writes labels on a fibre-to-cloth line, both test the sound installation, and the tutor approves the budget. The focus is local workshop cloth, pieces avoid direct light to stop fading, and labels finish two weeks before opening. Budget items are cases, an interactive loom and lighting rigs.',
  },
  accent: { zh: '导师为澳式口音，学生为英式口音。', en: 'The tutor has an Australian accent and the student has a British accent.' },
  speechRate: '+3%',
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Selecting the textiles for display' },
        { key: 'B', text: 'Writing the wall labels' },
        { key: 'C', text: 'Testing the sound installation together' },
        { key: 'D', text: 'Booking the exhibition venue' },
        { key: 'E', text: 'Approving the spending plan' },
      ],
      items: [
        { number: 21, text: 'Choosing objects for the display' },
        { number: 22, text: 'Drafting the narrative labels' },
        { number: 23, text: 'Checking the interactive piece' },
        { number: 24, text: 'Signing off the budget' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What is the main focus of the exhibition?',
          options: [
            { key: 'A', text: 'imported silk from long-distance trade' },
            { key: 'B', text: 'textiles from local workshops' },
            { key: 'C', text: 'formal dress worn over three centuries' },
          ],
        },
        {
          number: 26,
          stem: 'Why are light-sensitive fabrics kept out of direct sunlight?',
          options: [
            { key: 'A', text: 'the colours fade first' },
            { key: 'B', text: 'the threads tear along the seams' },
            { key: 'C', text: 'dust settles on the surface' },
          ],
        },
        {
          number: 27,
          stem: 'How long before opening must the labels be finished?',
          options: [
            { key: 'A', text: 'two weeks before opening' },
            { key: 'B', text: 'one month before opening' },
            { key: 'C', text: 'three days before opening' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE items are included in the exhibition budget? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE items are included in the exhibition budget?',
      options: [
        { key: 'A', text: 'protective cases for fragile cloth' },
        { key: 'B', text: 'an interactive loom table' },
        { key: 'C', text: 'lighting rigs above the display cases' },
        { key: 'D', text: 'a film crew for the opening' },
        { key: 'E', text: 'a paid volunteer guide' },
        { key: 'F', text: 'transport insurance for the loans' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：I will choose the textiles for display, since I know which fabrics survive the lighting。展品由导师挑选，对应 A。学生在句 3 只提出先筛库存，不是最终选人。',
        en: 'Sentence 4: "I will choose the textiles for display, since I know which fabrics survive the lighting". The tutor selects the objects, matching A. The student in sentence 3 only suggests shortlisting stores first.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：Then I will write the wall labels, following that raw fibre to cloth line。说明标签由学生撰写，对应 B。',
        en: 'Sentence 13: "Then I will write the wall labels, following that raw fibre to cloth line". The student drafts the labels, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 22,
      explanation: {
        zh: '定位句 22：Both of us test the sound installation together, once the wires are in place。互动装置由两人共同测试，对应 C。',
        en: 'Sentence 22: "Both of us test the sound installation together, once the wires are in place". The interactive piece is checked by both speakers, matching C.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 30,
      explanation: {
        zh: '定位句 30：The tutor approves the spending plan, so no item goes ahead without my sign-off。预算由导师审批，对应 E。协调员在句 26 只负责订场地。',
        en: 'Sentence 30: "The tutor approves the spending plan, so no item goes ahead without my sign-off". The budget is approved by the tutor, matching E. The coordinator in sentence 26 only books the venue.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Silk trade is a side room. The show is built around textiles from local workshops。主线是本地工坊织物，对应 B。进口丝绸在句 35 被学生提出，导师明确降为侧厅。',
        en: 'Sentence 36: "Silk trade is a side room. The show is built around textiles from local workshops". The main focus is local workshop cloth, matching B. Imported silk raised by the student in sentence 35 is reduced to a side room.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 42,
      explanation: {
        zh: '定位句 42：Direct sunlight fades the colours first, even before the cloth itself wears。避光首要原因是褪色，对应 A。撕裂与积尘在全段没有作为日晒后果提出。',
        en: 'Sentence 42: "Direct sunlight fades the colours first, even before the cloth itself wears". The first risk from sun is fading, matching A. Tearing and dust are not raised as consequences of sunlight.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：The copy must be done two weeks before the doors open, so printing can start。标签定稿在开幕前两周，对应 A。句 47 的 one month 是学生最初记的宽松期限，被导师否定。',
        en: 'Sentence 46: "The copy must be done two weeks before the doors open, so printing can start". Labels are finished two weeks before opening, matching A. One month in sentence 47 was the student’s loose first note and is rejected.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 53,
      explanation: {
        zh: '定位句 53：First, protective cases for the fragile garments and handkerchiefs。防护展柜是第一项预算，对应 A。句 54 强调没有展柜光线和灰尘会接触织物。',
        en: 'Sentence 53: "First, protective cases for the fragile garments and handkerchiefs". Protective cases are the first budget item, matching A. Sentence 54 stresses that without them light and dust reach the cloth.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 55,
      explanation: {
        zh: '定位句 55：Second, an interactive loom where families can weave a short strip。互动织布机是第二项，对应 B。句 56 说明它兑现了展览可动手参与的承诺。',
        en: 'Sentence 55: "Second, an interactive loom where families can weave a short strip". The interactive loom is the second item, matching B. Sentence 56 notes it fulfils the hands-on promise.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 57,
      explanation: {
        zh: '定位句 57：Third, the lighting rigs above each display case。展柜照明是第三项，对应 C。句 58 说明灯具用于控制亮度与照射方向。',
        en: 'Sentence 57: "Third, the lighting rigs above each display case". The lighting rigs are the third item, matching C. Sentence 58 explains they control brightness and direction.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Right, the textiles exhibition proposal is due in three weeks, so let us divide the work.' },
    { speaker: 'student', text: 'Good. I have brought the notes from our last meeting on local weaving workshops.' },
    { speaker: 'tutor', text: 'First, the objects we actually show on the floor.' },
    { speaker: 'student', text: 'Shall I shortlist the pieces from the museum stores first?' },
    { speaker: 'tutor', text: 'I will choose the textiles for display, since I know which fabrics survive the lighting.' },
    { speaker: 'student', text: 'Fine. You pick the objects, and I can take the labels from there.' },
    { speaker: 'tutor', text: 'That leaves the narrative line. We want the show to follow one clear story through the rooms.' },
    { speaker: 'student', text: 'I had thought to arrange pieces by century, oldest first in the entrance hall.' },
    { speaker: 'tutor', text: 'The century order helps visitors orient themselves, but the labels need a stronger thread.' },
    { speaker: 'student', text: 'What thread do you mean, beyond dates?' },
    { speaker: 'tutor', text: 'Each garment or rug should show how it reached a local workshop, and who made it.' },
    { speaker: 'student', text: 'So the story runs from raw fibre to finished cloth, rather than a list of names.' },
    { speaker: 'tutor', text: 'Exactly. That also gives us room to talk about trade between town and country.' },
    { speaker: 'student', text: 'Then I will write the wall labels, following that raw fibre to cloth line.' },
    { speaker: 'tutor', text: 'Good. Labels must name the maker, the material and the date, in plain language.' },
    { speaker: 'student', text: 'I will keep each label under a hundred words, so visitors can read it while standing.' },
    { speaker: 'tutor', text: 'Now the interactive piece. We promised one hands-on device for families.' },
    { speaker: 'student', text: 'The loom table? Visitors could weave a short strip themselves.' },
    { speaker: 'tutor', text: 'The sound installation is the other option, with recordings of workshop songs.' },
    { speaker: 'student', text: 'Which one should we plan around?' },
    { speaker: 'tutor', text: 'We keep both in the budget, but the loom table goes into the main hall first.' },
    { speaker: 'student', text: 'Who checks the installation before opening?' },
    { speaker: 'tutor', text: 'Both of us test the sound installation together, once the wires are in place.' },
    { speaker: 'student', text: 'I can bring headphones and a recording player to the rehearsal.' },
    { speaker: 'tutor', text: 'Good. Now the venue side.' },
    { speaker: 'student', text: 'Is the coordinator still handling the hall booking?' },
    { speaker: 'tutor', text: 'Yes, the coordinator books the venue, and we only confirm the dates with them.' },
    { speaker: 'student', text: 'Anything else the coordinator should know?' },
    { speaker: 'tutor', text: 'Ask them to reserve a quiet corner for the display of fragile handkerchiefs.' },
    { speaker: 'student', text: 'Right. That leaves the spending plan for the show.' },
    { speaker: 'tutor', text: 'The tutor approves the spending plan, so no item goes ahead without my sign-off.' },
    { speaker: 'student', text: 'Understood. I will draft the budget and pass it to you before Friday.' },
    { speaker: 'tutor', text: 'Now a few questions about the choices we have made.' },
    { speaker: 'student', text: 'Go ahead.' },
    { speaker: 'tutor', text: 'What is the main focus of this exhibition?' },
    { speaker: 'student', text: 'I thought we covered imported silk and the long-distance trade.' },
    { speaker: 'tutor', text: 'Silk trade is a side room. The show is built around textiles from local workshops.' },
    { speaker: 'student', text: 'Local workshops, then. The pieces came from weavers within the region.' },
    { speaker: 'tutor', text: 'Correct. We want visitors to see cloth that their own neighbours once made.' },
    { speaker: 'student', text: 'One concern. Some of the old fabrics are very light-sensitive.' },
    { speaker: 'tutor', text: 'That is why we keep them out of direct light.' },
    { speaker: 'student', text: 'Is it the threads tearing that worries us, or something else?' },
    { speaker: 'tutor', text: 'Direct sunlight fades the colours first, even before the cloth itself wears.' },
    { speaker: 'student', text: 'So the cases should sit away from the tall windows.' },
    { speaker: 'tutor', text: 'Yes, and we rotate the most fragile pieces out every few weeks.' },
    { speaker: 'student', text: 'When do the labels need to be finished before opening day?' },
    { speaker: 'tutor', text: 'The copy must be done two weeks before the doors open, so printing can start.' },
    { speaker: 'student', text: 'Two weeks. Not the month I first pencilled in.' },
    { speaker: 'tutor', text: 'The month before was too loose; we also need time to check wording for accuracy.' },
    { speaker: 'student', text: 'I will aim to have the draft labels ready by the end of next week.' },
    { speaker: 'tutor', text: 'Now let us settle what goes into the budget.' },
    { speaker: 'student', text: 'I listed cases, the loom table and the lighting rigs as the main costs.' },
    { speaker: 'tutor', text: 'Let us go through each one.' },
    { speaker: 'student', text: 'First, protective cases for the fragile garments and handkerchiefs.' },
    { speaker: 'tutor', text: 'The cases are essential. Without them the light and dust reach the cloth.' },
    { speaker: 'student', text: 'Second, an interactive loom where families can weave a short strip.' },
    { speaker: 'tutor', text: 'The loom table stays in the plan; it matches the hands-on promise we made.' },
    { speaker: 'student', text: 'Third, the lighting rigs above each display case.' },
    { speaker: 'tutor', text: 'The rigs give us control over brightness and direction, so those stay too.' },
    { speaker: 'student', text: 'Are there other items we considered?' },
    { speaker: 'tutor', text: 'A film crew was suggested, but we cannot afford it this round.' },
    { speaker: 'student', text: 'And a volunteer guide for the opening weekend?' },
    { speaker: 'tutor', text: 'We can borrow a student guide from the college, so it does not enter the budget.' },
    { speaker: 'student', text: 'Transport insurance for the loans?' },
    { speaker: 'tutor', text: 'That sits with the venue agreement, not our exhibition budget.' },
    { speaker: 'student', text: 'So the three main costs are cases, loom and lighting.' },
    { speaker: 'tutor', text: 'Yes. Send me the draft budget, and I will mark anything that looks overpriced.' },
    { speaker: 'student', text: 'Will we need to consult the local weavers again?' },
    { speaker: 'tutor', text: 'We will ask two of them to comment on the labels before they are printed.' },
    { speaker: 'student', text: 'Good. I will bring the label draft and the budget to our next meeting.' },
    { speaker: 'tutor', text: 'Fine. Keep the wording plain, and do not overcrowd the cases.' },
  ],
  vocabulary: [
    {
      term: 'textiles', phonetic: '/ˈtekstaɪlz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '纺织品，织物', en: 'woven or knitted cloth used for garments, rugs and hangings' },
      usage: { zh: '可数复数；choose the textiles、textile display。单数 textile 作定语。', en: 'Countable plural: choose the textiles, textile display. Singular textile is attributive.' },
      collocations: ['local textiles', 'the textiles for display', 'textile pieces'],
      example: { en: 'The tutor chooses the textiles that survive the lighting.', zh: '导师挑选经得起灯光的织物。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /staɪlz/。', en: 'Three syllables with stress on the first; ending /staɪlz/.' },
    },
    {
      term: 'narrative', phonetic: '/ˈnærətɪv/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '叙事线索，叙述脉络', en: 'the story that connects the objects shown in sequence' },
      usage: { zh: '可数；the narrative line、follow a narrative。', en: 'Countable: the narrative line, follow a narrative.' },
      collocations: ['the narrative line', 'a clear narrative', 'the narrative labels'],
      example: { en: 'The labels follow one clear story through the rooms.', zh: '标签沿一条清晰的脉络贯穿各展厅。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /rə/ 弱读。', en: 'Three syllables with stress on the first; the middle /rə/ is reduced.' },
    },
    {
      term: 'handkerchiefs', phonetic: '/ˈhæŋkətʃiːfs/', partOfSpeech: 'n.', sentenceIndex: 53,
      meaning: { zh: '手帕', en: 'small cloths carried for wiping the face or hands' },
      usage: { zh: '可数复数；fragile handkerchiefs、a display of handkerchiefs。', en: 'Countable plural: fragile handkerchiefs, a display of handkerchiefs.' },
      collocations: ['fragile handkerchiefs', 'a collection of handkerchiefs'],
      example: { en: 'The quiet corner holds the fragile handkerchiefs.', zh: '安静角落陈列脆弱的手帕。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /tʃiːfs/。', en: 'Three syllables with stress on the first; ending /tʃiːfs/.' },
    },
    {
      term: 'sign-off', phonetic: '/ˈsaɪn ɒf/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '签字批准，放行', en: 'official approval before an item can proceed' },
      usage: { zh: '可数；without my sign-off、give sign-off。动词短语 sign off。', en: 'Countable: without my sign-off. The phrasal verb is sign off.' },
      collocations: ['my sign-off', 'give sign-off', 'budget sign-off'],
      example: { en: 'No item goes ahead without the tutor’s sign-off.', zh: '没有导师签字批准，任何项目都不能推进。' },
      listening: { zh: '复合名词，重音在第一音节；off 弱读成 /əf/。', en: 'Compound noun with stress on the first; off reduces to /əf/.' },
    },
    {
      term: 'fades', phonetic: '/feɪdz/', partOfSpeech: 'v.', sentenceIndex: 42,
      meaning: { zh: '（颜色）褪色，变淡', en: 'loses colour from cloth under sunlight' },
      usage: { zh: '动词；sunlight fades the colours、fading colours。名词 fading。', en: 'Verb: sunlight fades the colours. The noun is fading.' },
      collocations: ['fading colours', 'prevent fading', 'sun fading'],
      example: { en: 'Direct sunlight fades the colours before the cloth wears.', zh: '日晒先让颜色褪去，布料之后才磨损。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /dɪŋ/。', en: 'Two syllables with stress on the first; ending /dɪŋ/.' },
    },
    {
      term: 'protective', phonetic: '/prəˈtektɪv/', partOfSpeech: 'adj.', sentenceIndex: 53,
      meaning: { zh: '防护的，保护的', en: 'designed to keep objects safe from light, dust or damage' },
      usage: { zh: '修饰物品；protective cases、protective covering。名词 protection。', en: 'Modifies objects: protective cases. The noun is protection.' },
      collocations: ['protective cases', 'protective covering', 'protective display'],
      example: { en: 'Protective cases keep light and dust away from fragile cloth.', zh: '防护展柜挡住光线和灰尘，保护脆弱织物。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'rigs', phonetic: '/rɪɡz/', partOfSpeech: 'n.', sentenceIndex: 57,
      meaning: { zh: '成套设备（lighting rig 灯具架）', en: 'a fixed set of equipment for a purpose; lighting rigs hold exhibition lamps' },
      usage: { zh: '可数复数；lighting rigs、above each case。单数 a rig。', en: 'Countable plural: lighting rigs, above each case. The singular is a rig.' },
      collocations: ['lighting rigs', 'the rigs above the cases', 'a lighting rig'],
      example: { en: 'The lighting rigs control brightness and direction.', zh: '照明灯具架控制亮度与方向。' },
      listening: { zh: '单音节，短元音 /ɪ/，不要读成 raig。', en: 'One syllable with short /ɪ/, not /raɪ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'divide the work', sentenceIndex: 0,
      meaning: { zh: '分工，把任务拆开', en: 'to share the tasks between the two people' },
      usage: { zh: '在两人之间分工；divide something between，divide the work。', en: 'Divide something between or among; divide the work.' },
      example: { en: 'Let us divide the work before the proposal is due.', zh: '提案截止前我们先分工。' },
    },
    {
      phrase: 'shortlist the pieces', sentenceIndex: 3,
      meaning: { zh: '先初选一批展品', en: 'to pick a smaller possible set before the final choice' },
      usage: { zh: '及物短语；shortlist the pieces、shortlist candidates。', en: 'Transitive: shortlist the pieces, shortlist candidates.' },
      example: { en: 'Shall I shortlist the pieces from the stores first?', zh: '我先从库房初选一批展品好吗？' },
    },
    {
      phrase: 'keep them out of', sentenceIndex: 40,
      meaning: { zh: '避开，不置于……之下', en: 'to prevent something from being exposed to a place or light' },
      usage: { zh: '把某物避开某处；keep something out of something，keep them out of direct light。', en: 'Keep something out of something: keep them out of direct light.' },
      example: { en: 'We keep the light-sensitive fabrics out of direct sunlight.', zh: '我们把光敏织物放在直射阳光之外。' },
    },
    {
      phrase: 'rotate the most fragile pieces out', sentenceIndex: 44,
      meaning: { zh: '轮换撤出，定期更换', en: 'to take a fragile piece off display for a rest period' },
      usage: { zh: '可分短语动词；rotate pieces out every few weeks。', en: 'Separable: rotate pieces out every few weeks.' },
      example: { en: 'The most fragile pieces are rotated out every few weeks.', zh: '最脆弱的展品每隔几周轮换撤出。' },
    },
    {
      phrase: 'go through', sentenceIndex: 52,
      meaning: { zh: '逐项核对，过一遍', en: 'to examine each budget item one after another' },
      usage: { zh: '及物短语动词；go through each one、go through the list。', en: 'Transitive: go through each one, go through the list.' },
      example: { en: 'Let us go through each budget item in turn.', zh: '我们逐项过一遍预算。' },
    },
    {
      phrase: 'sits with', sentenceIndex: 64,
      meaning: { zh: '归入（另一项责任或协议）', en: 'to belong to another agreement or department rather than this budget' },
      usage: { zh: '口语归属说法；that sits with the venue agreement。', en: 'Informal ownership: that sits with the venue agreement.' },
      example: { en: 'Transport insurance sits with the venue agreement.', zh: '运输保险归入场馆协议，不在展览预算内。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先读分工角色', en: 'Read the role before the task' },
      body: {
        zh: '第 21–24 题把任务对到四个人。听前先看选项里的动作：挑选、写标签、共同测试、订场地、批预算；录音里 I will choose、I will write、both of us test、coordinator books、tutor approves 就是对应线索，不要听到学生开口就选学生。',
        en: 'Items 21 to 24 match tasks to people. Read the option actions first: choose, write labels, test together, book venue, approve budget. The cues are I will choose, I will write, both of us test, coordinator books and tutor approves; do not choose the student just because he speaks first.',
      },
    },
    {
      title: { zh: '多选区分预算内与预算外', en: 'Separate budget items from excluded costs' },
      body: {
        zh: '多选题最容易把被排除的项目混进答案。film crew 用 cannot afford 否定，paid guide 用 borrow 解决，transport insurance 归入场馆协议；只有 first、second、third 引出的展柜、织布机、照明才进预算。',
        en: 'Multiple choice often smuggles excluded costs into the answers. The film crew is ruled out by cannot afford, the paid guide is solved by borrowing, and transport insurance belongs to the venue agreement. Only the cases, loom and lighting introduced by first, second and third enter the budget.',
      },
    },
    {
      title: { zh: '纠正句里找最终主张', en: 'Find the final claim after a correction' },
      body: {
        zh: '第 25 题学生先提进口丝绸，导师用 side room 纠正，再给本地工坊；第 27 题学生先记 one month，导师改口 two weeks。Part 3 的答案常在 but、side room、not the month 这类纠正之后，前面的说法先记下作干扰项。',
        en: 'Item 25: the student first mentions imported silk, the tutor corrects it to a side room, then names local workshops. Item 27: the student notes one month first, then the tutor changes it to two weeks. Part 3 answers often follow corrections such as but, side room or not the month; keep the earlier version as a distractor.',
      },
    },
  ],
};
