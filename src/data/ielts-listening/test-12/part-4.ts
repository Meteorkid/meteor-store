import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 12 · Part 4 — 讲座：动物伪装。原创仿真材料，非官方真题。
 *
 * 结构：开场用林间场景与总体观点给出三种伪装方法（单选 31–34）→ 保护色与背景匹配（笔记填空 35）→
 * 拟态（36）→ 破坏性花纹（37）→ 行为配合（38）→ 纹理匹配（39）→ 近距离表面对照（40）。
 * 单选块在前，填空块在后，题块顺序与讲座顺序一致。
 */
export const test12Part4: ListeningLesson = {
  slug: 'test-12-part-4',
  part: 4,
  status: 'published',
  title: { zh: '动物伪装', en: 'Animal camouflage' },
  summary: {
    zh: '一场关于动物如何躲避视线的讲座：伪装帮助动物融入周边环境，既躲避天敌也便于接近猎物；讲解保护色与背景匹配、拟态复制受保护物种、破坏性花纹打散身体轮廓，以及静止行为与表面纹理对伪装的配合。',
    en: 'A lecture on how animals avoid being seen: camouflage helps an animal blend into its surroundings, whether escaping predators or approaching prey. It covers concealing coloration and background matching, mimicry of protected species, disruptive patterns that break the outline, and the behavioural and surface features that complete the disguise.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，关键术语会重复一遍。', en: 'The lecturer speaks with an American accent at a steady pace, repeating the key terms.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What is the lecturer’s main point about camouflage?',
          options: [
            { key: 'A', text: 'It helps animals hide by matching their surroundings.' },
            { key: 'B', text: 'It mainly makes animals look bigger than they are.' },
            { key: 'C', text: 'It works only in brightly coloured tropical habitats.' },
          ],
        },
        {
          number: 32,
          stem: 'How does concealing coloration work?',
          options: [
            { key: 'A', text: 'By copying the shape of another harmless species.' },
            { key: 'B', text: 'By blending the animal’s colours with the background.' },
            { key: 'C', text: 'By breaking the body into hard-to-read patches.' },
          ],
        },
        {
          number: 33,
          stem: 'What is mimicry?',
          options: [
            { key: 'A', text: 'An animal matching its colour to the changing season.' },
            { key: 'B', text: 'An animal copying the appearance of another species for protection.' },
            { key: 'C', text: 'An animal staying still so predators do not notice it.' },
          ],
        },
        {
          number: 34,
          stem: 'What does disruptive colouration do?',
          options: [
            { key: 'A', text: 'It makes the outline of the body hard to recognise.' },
            { key: 'B', text: 'It copies the markings of a poisonous animal.' },
            { key: 'C', text: 'It changes the animal’s texture to feel like bark.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Concealing coloration depends on a close match between the animal’s colour and its', cells: [[{ blank: 35 }, { text: '.' }]] },
        { lead: 'In mimicry, a harmless species may resemble a', cells: [[{ blank: 36 }, { text: ' one that predators avoid.' }]] },
        { lead: 'Disruptive patterns use bold stripes or patches to break up the body', cells: [[{ blank: 37 }, { text: '.' }]] },
        { lead: 'Camouflage also relies on the animal’s', cells: [[{ blank: 38 }, { text: ': it must stay still and choose a suitable spot.' }]] },
        { lead: 'Texture may resemble rough', cells: [[{ blank: 39 }, { text: ' or moss.' }]] },
        { lead: 'Up close, the coat catches the light like the nearby', cells: [[{ blank: 40 }, { text: '.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：Its main purpose is to help an animal blend into its surroundings。伪装的作用是融入周边环境，对应 A。B 的放大外形与 C 的只在热带生效在讲座中均无依据。',
        en: 'Sentence 2: "Its main purpose is to help an animal blend into its surroundings". Camouflage matches the surroundings, matching A. Looking bigger and working only in the tropics are never claimed.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：The simplest method is concealing coloration, which works by blending the animal’s colours with the background。保护色靠颜色与背景融合，对应 B。A 的复制另一物种是拟态，C 的打散花纹是破坏性花纹。',
        en: 'Sentence 4: "The simplest method is concealing coloration, which works by blending the animal’s colours with the background". Concealing coloration blends colours with the background, matching B. Copying another species in A is mimicry, and splitting patches in C is disruptive colouration.',
      },
    },
    {
      number: 33, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：mimicry, where a species copies the appearance of another one that predators leave alone。拟态是复制另一物种的外形以求自保，对应 B。A 的随季节变色是保护色，C 的静止不动是行为配合。',
        en: 'Sentence 5: "mimicry, where a species copies the appearance of another one that predators leave alone". Mimicry copies another species for protection, matching B. Seasonal colour change in A is concealing coloration, and staying still in C is behavioural support.',
      },
    },
    {
      number: 34, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：The third is disruptive colouration, which uses bold shapes to break the body into pieces that are hard to read as one animal。破坏性花纹让身体轮廓难以辨认，对应 A。B 的复制有毒物种是拟态，C 的纹理触感属表面特征。',
        en: 'Sentence 6: "The third is disruptive colouration, which uses bold shapes to break the body into pieces that are hard to read as one animal". It makes the outline hard to recognise, matching A. Copying a poisonous animal in B is mimicry, and texture feel in C is a surface feature.',
      },
    },
    {
      number: 35, accepted: ['background'], evidence: 10,
      explanation: {
        zh: '定位句 10：This match depends on a close agreement between the animal’s colour and its background。保护色要与背景高度吻合，填 background；outline 在同句指轮廓，不是颜色匹配对象。',
        en: 'Sentence 10: "This match depends on a close agreement between the animal’s colour and its background". Concealing coloration matches the background; outline in the same sentence means the silhouette, not the colour match.',
      },
    },
    {
      number: 36, accepted: ['harmful'], evidence: 14,
      explanation: {
        zh: '定位句 14：a harmless species resembles a harmful one that predators already avoid。被模仿的是天敌回避的有害物种，填 harmful；harmless 是模仿者自身，不能填反。',
        en: 'Sentence 14: "a harmless species resembles a harmful one that predators already avoid". The copied model is a harmful species predators avoid; harmless describes the mimic itself, so do not reverse them.',
      },
    },
    {
      number: 37, accepted: ['outline'], evidence: 21,
      explanation: {
        zh: '定位句 21：This breaks up the body outline, so a predator reading for a whole animal sees only separate marks。破坏性花纹打散的是身体轮廓，填 outline。',
        en: 'Sentence 21: "This breaks up the body outline, so a predator reading for a whole animal sees only separate marks". Disruptive patterns split the body outline, matching outline.',
      },
    },
    {
      number: 38, accepted: ['behaviour'], evidence: 26,
      explanation: {
        zh: '定位句 26：The best disguise also relies on behaviour。伪装还要靠行为配合，空后冒号解释为保持静止、选对位置，填 behaviour。',
        en: 'Sentence 26: "The best disguise also relies on behaviour". The disguise also depends on behaviour; the colon after the gap explains staying still and choosing a spot.',
      },
    },
    {
      number: 39, accepted: ['bark'], evidence: 32,
      explanation: {
        zh: '定位句 32：Fur, scales or feathers can carry a rough surface that resembles bark, moss or dry leaf。纹理可像树皮、苔藓或枯叶；空后已给 or moss，填 bark。',
        en: 'Sentence 32: "Fur, scales or feathers can carry a rough surface that resembles bark, moss or dry leaf". The texture may resemble bark, moss or dry leaf; or moss is already printed, so write bark.',
      },
    },
    {
      number: 40, accepted: ['surface'], evidence: 36,
      explanation: {
        zh: '定位句 36：compare the colours with samples taken from the surrounding surface。近距离比对时参照的是周边表面，填 surface；plants 在句 34 是举例参照，不是答案词。',
        en: 'Sentence 36: "compare the colours with samples taken from the surrounding surface". The close comparison uses the surrounding surface; plants in sentence 34 are the example reference, not the answer.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Walk through a woodland at dawn, and you could pass straight by dozens of animals without seeing a single one.' },
    { speaker: 'lecturer', text: 'This lecture is about how animals avoid being seen, a survival trick we call camouflage.' },
    { speaker: 'lecturer', text: 'Its main purpose is to help an animal blend into its surroundings, whether it is hiding from a predator or creeping up on prey.' },
    { speaker: 'lecturer', text: 'We will look at three main methods, and then at the behavioural steps that make any colouring work.' },
    { speaker: 'lecturer', text: 'The broad picture first. The simplest method is concealing coloration, which works by blending the animal’s colours with the background around it.' },
    { speaker: 'lecturer', text: 'A second method is mimicry, where a species copies the appearance of another one that predators leave alone.' },
    { speaker: 'lecturer', text: 'The third is disruptive colouration, which uses bold shapes to break the body into pieces that are hard to read as one animal.' },
    { speaker: 'lecturer', text: 'Beyond colour itself, animals also choose where to rest and how to move, and these behaviours complete the disguise.' },
    { speaker: 'lecturer', text: 'Let us start with concealing coloration, the most familiar form.' },
    { speaker: 'lecturer', text: 'A rabbit in a dry field and a deer under open trees both wear colours that sit close to the ground and the bark around them.' },
    { speaker: 'lecturer', text: 'This match depends on a close agreement between the animal’s colour and its background, so that the outline does not stand out.' },
    { speaker: 'lecturer', text: 'In open grassland, pale coats reflect the dry grass; in a dense forest, darker browns merge with the shadow.' },
    { speaker: 'lecturer', text: 'The match has to hold across the seasons, because a winter coat that still shows in spring leaves the animal exposed.' },
    { speaker: 'lecturer', text: 'Next, mimicry. This is not about matching the ground, but about copying another species.' },
    { speaker: 'lecturer', text: 'In one common form, a harmless species resembles a harmful one that predators already avoid.' },
    { speaker: 'lecturer', text: 'A butterfly wing may carry the same bright warning markings as a bitter-tasting species, and birds leave it alone on that basis.' },
    { speaker: 'lecturer', text: 'The copied model has to be common enough for predators to have learned its warning signs.' },
    { speaker: 'lecturer', text: 'A second kind of mimicry copies the pattern of leaves or thorns, so the animal looks like part of the plant it sits on.' },
    { speaker: 'lecturer', text: 'In both forms, the copied appearance sends a false message to the animal watching from a distance.' },
    { speaker: 'lecturer', text: 'Third, disruptive colouration.' },
    { speaker: 'lecturer', text: 'Bold stripes, spots and patches cut across the body, rather than following its natural shape.' },
    { speaker: 'lecturer', text: 'This breaks up the body outline, so a predator reading for a whole animal sees only separate marks on grass or bark.' },
    { speaker: 'lecturer', text: 'A zebra’s stripes do not make it pale against the plain; they split its shape when the herd moves in low light.' },
    { speaker: 'lecturer', text: 'High contrast marks work best where the background itself carries strong patches of light and shade.' },
    { speaker: 'lecturer', text: 'A small bird with a single flat colour would actually stand out in such a dappled wood.' },
    { speaker: 'lecturer', text: 'Now colour alone is rarely enough.' },
    { speaker: 'lecturer', text: 'The best disguise also relies on behaviour. An animal with the right coat will still be spotted if it keeps moving in plain view.' },
    { speaker: 'lecturer', text: 'It must choose a resting spot that matches its markings, and then stay still until danger has passed.' },
    { speaker: 'lecturer', text: 'Many prey species feed at the edge of light and shadow, where their pattern splits against the background.' },
    { speaker: 'lecturer', text: 'Posture matters too, and a deer lowers its neck to match the line of branches, while an insect holds its legs at the angle of a twig.' },
    { speaker: 'lecturer', text: 'Movement gives away more than colour, so the safest animal often freezes the moment it hears a threat.' },
    { speaker: 'lecturer', text: 'A fourth matching feature is texture.' },
    { speaker: 'lecturer', text: 'Fur, scales or feathers can carry a rough surface that resembles bark, moss or dry leaf, rather than looking smooth and flat.' },
    { speaker: 'lecturer', text: 'This matters up close, when a predator examines the animal at close range after spotting the outline.' },
    { speaker: 'lecturer', text: 'A textured coat also catches the light the same way the nearby plants do, so highlights and shadows line up.' },
    { speaker: 'lecturer', text: 'How do researchers study these patterns?' },
    { speaker: 'lecturer', text: 'They photograph animals in their habitat, then compare the colours with samples taken from the surrounding surface.' },
    { speaker: 'lecturer', text: 'Some experiments use models placed on different backgrounds to see which ones predators attack first.' },
    { speaker: 'lecturer', text: 'The results show that pattern matters as much as colour; a plain model on the wrong background is attacked far more often.' },
    { speaker: 'lecturer', text: 'Let me pull the main ideas together.' },
    { speaker: 'lecturer', text: 'Concealing coloration matches the animal to its background, season by season.' },
    { speaker: 'lecturer', text: 'Mimicry copies a protected species or a plant part to send the wrong signal.' },
    { speaker: 'lecturer', text: 'Disruptive patterns split the body outline with strong stripes and patches.' },
    { speaker: 'lecturer', text: 'Behaviour and texture complete the disguise, because colour alone cannot hide a moving animal.' },
    { speaker: 'lecturer', text: 'Camouflage is therefore a combination of colour, pattern, surface and habit, tuned over generations to one local setting.' },
    { speaker: 'lecturer', text: 'In the next lecture we will look at how city life changes these patterns, and whether urban animals shift their colours over time.' },
    { speaker: 'lecturer', text: 'For today, remember that hiding is never one trick; it is several matching decisions working together.' },
    { speaker: 'lecturer', text: 'That concludes our look at the topic. I will see you in the next class.' },
  ],
  vocabulary: [
    {
      term: 'camouflage', phonetic: '/ˈkæməflɑːʒ/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '伪装，保护色', en: 'colouring or shape that helps an animal stay unseen' },
      usage: { zh: '不可数名词；animal camouflage、use camouflage。动词也指伪装。', en: 'Uncountable: animal camouflage. It is also a verb.' },
      collocations: ['animal camouflage', 'natural camouflage', 'use camouflage'],
      example: { en: 'The hare’s white coat is camouflage against the snow.', zh: '野兔的白毛是雪地中的伪装。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /ʒ/ 不要读成 /dʒ/。', en: 'Three syllables with first-syllable stress; the ending is /ʒ/, not /dʒ/.' },
    },
    {
      term: 'concealing', phonetic: '/kənˈsiːlɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '隐蔽的，遮蔽的', en: 'hiding something from view' },
      usage: { zh: 'concealing coloration 是保护色的学术说法；动词 conceal。', en: 'Concealing coloration is the academic term; the verb is conceal.' },
      collocations: ['concealing coloration', 'concealing features'],
      example: { en: 'Concealing coloration blends the animal into its habitat.', zh: '保护色让动物融入栖息地。' },
      listening: { zh: '重音在第二音节 /ˈsiː/；开头 /kən/ 很弱。', en: 'Stress the second syllable; the opening /kən/ is weak.' },
    },
    {
      term: 'mimicry', phonetic: '/ˈmɪmɪkri/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '拟态', en: 'copying another species’ appearance for protection' },
      usage: { zh: '不可数名词；动词 mimic。注意与 mockery（嘲笑）区分。', en: 'Uncountable; the verb is mimic. Do not confuse it with mockery.' },
      collocations: ['protective mimicry', 'Batesian mimicry', 'the mimicry of another species'],
      example: { en: 'The butterfly’s mimicry warns birds off with bright wings.', zh: '蝴蝶的拟态用亮色翅膀吓退鸟类。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /kri/。', en: 'Three syllables with first-syllable stress; ending /kri/.' },
    },
    {
      term: 'disruptive', phonetic: '/dɪsˈrʌptɪv/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '破坏性的，打散轮廓的', en: 'splitting a shape so it cannot be read as a whole' },
      usage: { zh: 'disruptive colouration 是学术术语；动词 disrupt。', en: 'Disruptive colouration is the academic term; the verb is disrupt.' },
      collocations: ['disruptive colouration', 'disruptive patterns', 'disruptive markings'],
      example: { en: 'The stripes are a disruptive pattern that hides the outline.', zh: '条纹是打散轮廓的破坏性花纹。' },
      listening: { zh: '重音在第二音节 /ˈrʌp/；开头 /dɪs/。', en: 'Stress the second syllable; the opening is /dɪs/.' },
    },
    {
      term: 'outline', phonetic: '/ˈaʊtlaɪn/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '轮廓，外形线条', en: 'the outer line that shows an animal’s shape' },
      usage: { zh: '可数名词；body outline、break up the outline。', en: 'Countable: body outline, break up the outline.' },
      collocations: ['the body outline', 'break up the outline', 'a clear outline'],
      example: { en: 'Patches split the outline so the shape is hard to read.', zh: '色块打散轮廓，形状难以辨认。' },
      listening: { zh: '复合词，两个重音；/aʊ/ 是双元音。', en: 'A compound with two stresses; /aʊ/ is a diphthong.' },
    },
    {
      term: 'predator', phonetic: '/ˈpredətə/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '捕食者，天敌', en: 'an animal that hunts other animals' },
      usage: { zh: '可数名词；形容词 predatory。被猎动物是 prey。', en: 'Countable; the adjective is predatory. The hunted animal is prey.' },
      collocations: ['a predator', 'escape a predator', 'predators avoid'],
      example: { en: 'The disguise keeps the animal hidden from predators.', zh: '伪装让动物在天敌面前不被发现。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /tə/ 不卷舌。', en: 'Three syllables with first-syllable stress; the ending is not rolled.' },
    },
    {
      term: 'texture', phonetic: '/ˈtekstʃə/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '纹理，表面质感', en: 'the rough or smooth quality of a surface' },
      usage: { zh: '可数或不可数；fur texture、surface texture。', en: 'Countable or uncountable: fur texture, surface texture.' },
      collocations: ['a rough texture', 'surface texture', 'fur texture'],
      example: { en: 'The leaf insect’s body has the texture of dry leaf.', zh: '叶䗛的身体有枯叶的纹理。' },
      listening: { zh: '两个音节，重音在第一个；/kst/ 辅音串。', en: 'Two syllables with first-syllable stress; the /kst/ cluster.' },
    },
    {
      term: 'markings', phonetic: '/ˈmɑːkɪŋz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '斑纹，标记图案', en: 'the coloured spots, stripes or patterns on an animal' },
      usage: { zh: '只用复数；warning markings、wing markings。', en: 'Always plural: warning markings, wing markings.' },
      collocations: ['warning markings', 'bold markings', 'wing markings'],
      example: { en: 'The bright markings signal that the species tastes bitter.', zh: '亮色斑纹表明该物种味道很苦。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /z/。', en: 'Two syllables with first-syllable stress; ending /z/.' },
    },
  ],
  expressions: [
    {
      phrase: 'blend into', sentenceIndex: 2,
      meaning: { zh: '融入（环境），与背景混为一体', en: 'to mix in with the surroundings so as not to stand out' },
      usage: { zh: 'blend into the background、blend into the crowd；与 stand out 相对。', en: 'Blend into the background; the opposite is stand out.' },
      example: { en: 'The brown coat blends into the dry grass.', zh: '棕色皮毛融入干草之中。' },
    },
    {
      phrase: 'copies the appearance', sentenceIndex: 5,
      meaning: { zh: '复制（另一物种的）外形', en: 'to look like another species on purpose' },
      usage: { zh: 'copy the appearance of another species；拟态描述常用。', en: 'Copy the appearance of another species; common in mimicry descriptions.' },
      example: { en: 'The fly copies the appearance of a bee.', zh: '这种苍蝇复制了蜜蜂的外形。' },
    },
    {
      phrase: 'breaks up', sentenceIndex: 21,
      meaning: { zh: '打散，割裂（轮廓或形状）', en: 'to split a shape into separate patches' },
      usage: { zh: 'break up the outline、break up the shape；破坏性花纹术语。', en: 'Break up the outline or shape; the disruptive pattern term.' },
      example: { en: 'Stripes break up the outline of the animal.', zh: '条纹打散了动物的轮廓。' },
    },
    {
      phrase: 'stay still', sentenceIndex: 27,
      meaning: { zh: '保持静止不动', en: 'to remain motionless' },
      usage: { zh: 'stay still until danger passes；行为配合高频。', en: 'Stay still until danger passes; common in behavioural camouflage.' },
      example: { en: 'The rabbit stays still while the predator passes.', zh: '天敌经过时兔子保持静止。' },
    },
    {
      phrase: 'the moment', sentenceIndex: 30,
      meaning: { zh: '一……就，当……那一刻', en: 'as soon as; at the instant that' },
      usage: { zh: '连词用法：the moment it hears a threat，相当于 as soon as。', en: 'Conjunction: the moment it hears a threat, equivalent to as soon as.' },
      example: { en: 'The bird freezes the moment it sees a hawk.', zh: '鸟一看见鹰就定住不动。' },
    },
    {
      phrase: 'up close', sentenceIndex: 33,
      meaning: { zh: '近距离地', en: 'from a very near position' },
      usage: { zh: '与 at a distance 相对；seen up close、up close and personal。', en: 'The opposite of at a distance: seen up close.' },
      example: { en: 'Up close, the rough texture shows clearly.', zh: '近距离看，粗糙纹理一目了然。' },
    },
    {
      phrase: 'line up', sentenceIndex: 34,
      meaning: { zh: '对齐，相互吻合', en: 'to match up in position or lighting' },
      usage: { zh: 'highlights and shadows line up；也指排队。', en: 'Highlights and shadows line up; it also means to queue.' },
      example: { en: 'The coat’s shadows line up with the nearby plants.', zh: '毛发的阴影与周边植物相互吻合。' },
    },
  ],
  tips: [
    {
      title: { zh: '先判词性，再等答案词', en: 'Predict the word class first' },
      body: {
        zh: '第 35 题空前是 its，填名词；第 38 题空后冒号给出行为解释，填表示行为的名词；第 39 题空后是 or moss，填同类自然物。听前把词性写在空格旁，录音里只等那一类词。',
        en: 'Item 35 follows its, so a noun is required; item 38 has a colon explaining actions, so a noun meaning behaviour; item 39 follows and ends with or moss, so a matching natural object. Note the predicted class before listening.'
      },
    },
    {
      title: { zh: '三种方法先在概览段分清', en: 'Separate the three methods in the overview' },
      body: {
        zh: '31 到 34 题在开场概览段：保护色是颜色配背景，拟态是复制物种，破坏性花纹是打散轮廓。听到三个方法名时在选项旁标注对应关系，细节段展开时不必再回头辨析。',
        en: 'Items 31 to 34 sit in the overview: concealing coloration matches the background, mimicry copies a species, disruptive patterns split the outline. Mark the match beside each option when the three names appear, and do not rework it in the detail section.'
      },
    },
    {
      title: { zh: '干扰项常把两种方法互换', en: 'Distractors swap the two methods' },
      body: {
        zh: '32 题 A 的“复制无害物种”、33 题 C 的“静止不动”、34 题 B 的“复制有毒斑纹”都是把别的方法安到本题头上。听到选项里的关键词时，先想它属于保护色、拟态、破坏花纹还是行为配合，再决定选不选。',
        en: 'Distractors attach one method to another item: copying a harmless species in 32A, staying still in 33C, copying poisonous markings in 34B. When you hear a keyword, first decide which method it belongs to, then choose.'
      },
    },
  ],
};
