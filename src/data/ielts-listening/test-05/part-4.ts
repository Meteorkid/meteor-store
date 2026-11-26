import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 5 · Part 4 — 讲座：蜜蜂如何导航（单人）。原创仿真材料，非官方真题。
 *
 * 结构：太阳罗盘 → 偏振光 → 气味标记 → 摇摆舞 → 群体选址；笔记填空按讲座顺序出现，
 * 多选落在巢穴特征两段，单选落在结尾的回顾与评价。
 */
export const test05Part4: ListeningLesson = {
  slug: 'test-05-part-4',
  part: 4,
  status: 'published',
  title: { zh: '蜜蜂如何导航', en: 'How bees navigate' },
  summary: {
    zh: '一场关于蜜蜂导航的讲座：太阳罗盘如何工作、阴天如何利用偏振光、蜂巢门口的气味标记、摇摆舞传递的方向与距离，以及蜂群如何通过舞蹈比较选出新巢穴。',
    en: 'A lecture on bee navigation: how the sun compass works, how polarized light is used on cloudy days, scent marks at the hive entrance, the direction and distance encoded in the waggle dance, and how a colony compares dances to choose a new nest site.',
  },
  accent: { zh: '男讲师为加拿大口音，语速平稳，术语会重复。', en: 'A male lecturer with a Canadian accent. He speaks steadily and repeats key terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Bees keep a fixed angle to the', cells: [[{ blank: 31 }, { text: ' as their main compass.' }]] },
        { lead: 'On cloudy days they detect', cells: [[{ blank: 32 }, { text: ' light from the sky.' }]] },
        { lead: 'Bees leave scent', cells: [[{ blank: 33 }, { text: ' at the hive entrance.' }]] },
        { lead: 'A scout performs a', cells: [[{ blank: 34 }, { text: ' dance to indicate food location.' }]] },
        { lead: 'Group decisions emerge when more dances support the same', cells: [[{ blank: 35 }, { text: '.' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO features make a good nest cavity? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO features make a good nest cavity?',
      options: [
        { key: 'A', text: 'its size' },
        { key: 'B', text: 'its exposure to light' },
        { key: 'C', text: 'distance from water' },
        { key: 'D', text: 'a smooth entrance' },
        { key: 'E', text: 'the number of scout bees' },
        { key: 'F', text: 'shelter from strong wind' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why can bees still navigate when the sun is hidden?',
          options: [
            { key: 'A', text: 'They follow local landmarks alone.' },
            { key: 'B', text: 'They read polarized light in the sky.' },
            { key: 'C', text: 'They wait until the sun returns.' },
          ],
        },
        {
          number: 39,
          stem: 'What information does the waggle dance communicate?',
          options: [
            { key: 'A', text: 'the direction and distance of the food' },
            { key: 'B', text: 'the temperature inside the hive' },
            { key: 'C', text: 'the number of scouts in the colony' },
          ],
        },
        {
          number: 40,
          stem: 'What is the lecturer’s view of the early idea that bees navigate by sight alone?',
          options: [
            { key: 'A', text: 'It has been proved by recent experiments.' },
            { key: 'B', text: 'It was an oversimplification.' },
            { key: 'C', text: 'It should be taught as the main model.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['sun'], evidence: 6,
      explanation: {
        zh: '定位句 6：they keep a fixed angle between their body and the sun。太阳是蜜蜂罗盘的参照对象；句 5 提到直接朝太阳飞是被否定的做法。',
        en: 'Sentence 6: "they keep a fixed angle between their body and the sun". The sun is the reference for the compass. Flying directly toward the sun, in sentence 5, is the rejected method.',
      },
    },
    {
      number: 32, accepted: ['polarized'], evidence: 12,
      explanation: {
        zh: '定位句 12：light arriving from the sun is polarized, and the polarization forms a pattern。空前是 detect，空后是 light，填形容词 polarized。',
        en: 'Sentence 12: "light arriving from the sun is polarized, and the polarization forms a pattern". The gap sits between detect and light, so the adjective polarized is required.',
      },
    },
    {
      number: 33, accepted: ['marks'], evidence: 19,
      explanation: {
        zh: '定位句 19：It also leaves scent marks at the entrance, using a gland on its abdomen。scent marks 是固定搭配；句 20 的 These marks 回指同一对象。',
        en: 'Sentence 19: "It also leaves scent marks at the entrance, using a gland on its abdomen". Scent marks is the fixed phrase; These marks in sentence 20 refers back to it.',
      },
    },
    {
      number: 34, accepted: ['waggle'], evidence: 22,
      explanation: {
        zh: '定位句 22：performs a waggle dance on the vertical comb。空后是 dance，填 waggle；句 23 的 figure eight 是舞蹈形状，不是答案。',
        en: 'Sentence 22: "performs a waggle dance on the vertical comb". The gap precedes dance, so write waggle. The figure eight in sentence 23 is the dance shape, not the answer.',
      },
    },
    {
      number: 35, accepted: ['site'], evidence: 34,
      explanation: {
        zh: '定位句 34：the decision emerges as more dances support the same site。群体决策围绕同一个巢穴地点；句 33 明确说蜂群不跟随第一只回来的侦察蜂。',
        en: 'Sentence 34: "the decision emerges as more dances support the same site". The colony converges on one nest site. Sentence 33 rules out following the first scout back.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：The first is its size。前一句 35 说两个主要特征，第一条就是尺寸；句 37 补充合适的容积大约够两个蜂群落脚。',
        en: 'Sentence 36: "The first is its size". Sentence 35 names two main features, and size is the first; sentence 37 adds that the preferred volume fits about two swarms.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 38,
      explanation: {
        zh: '定位句 38：The second is its exposure to light。第二条特征是光照；深荫处保持巢脾凉爽，午后日晒则会让蜜蜂过热。C、D 在句 39 被归为次要细节。',
        en: 'Sentence 38: "The second is its exposure to light". The second feature is light: deep shade keeps combs cool, while afternoon sun overheats the bees. C and D are called secondary in sentence 39.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 45,
      explanation: {
        zh: '定位句 45：the polarized light pattern in the sky still lets the bee read its position。太阳被云遮住时，靠偏振光判断方位。A 说只靠地标，与句 41 的实验限制不符；C 说等太阳出来，原文没有提到。',
        en: 'Sentence 45: "the polarized light pattern in the sky still lets the bee read its position". Bees use polarized light when the sun is hidden. A alone contradicts the landmark limits in sentence 41, and C is never mentioned.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 47,
      explanation: {
        zh: '定位句 47：the dance encodes both the direction of the flowers and how far away they are。方向由摆腹段相对重力的角度表示，距离由摆腹次数表示，对应 A。B 的巢内温度和 C 的侦察蜂数量全段未提。',
        en: 'Sentence 47: "the dance encodes both the direction of the flowers and how far away they are". Direction comes from the angle to gravity and distance from the number of waggles, matching A. Hive temperature and scout numbers are never mentioned.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 48,
      explanation: {
        zh: '定位句 48：Early researchers believed bees found their way by sight alone, but that idea was an oversimplification。but 之后是讲师的评价：真实情况被简化了。A 说被实验证明，C 说应作为主模型，都与讲座相反。',
        en: 'Sentence 48: "Early researchers believed bees found their way by sight alone, but that idea was an oversimplification". After but comes the lecturer’s verdict: the real picture was simplified. A and C contradict the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How does a foraging bee find its way back to the hive after visiting a flower patch two kilometres away?' },
    { speaker: 'lecturer', text: 'A single foraging bee may travel two or three kilometres in a day, yet it returns to the exact same entrance.' },
    { speaker: 'lecturer', text: 'Bees do not rely on one single system; they combine several different cues, and I will describe them in turn.' },
    { speaker: 'lecturer', text: 'I’ll go through the sun compass, the use of polarized light, scent marks and the waggle dance, and finish with how a colony chooses a new nest site.' },
    { speaker: 'lecturer', text: 'Let’s start with the sun compass.' },
    { speaker: 'lecturer', text: 'Bees do not fly directly toward the sun the way we might walk toward a building.' },
    { speaker: 'lecturer', text: 'Instead, they keep a fixed angle between their body and the sun, much as a sailor keeps a fixed angle to the North Star.' },
    { speaker: 'lecturer', text: 'If the food lies at an angle of sixty degrees to the right of the sun, the bee holds that angle on the outbound flight.' },
    { speaker: 'lecturer', text: 'On the way back, it turns around and keeps the same angle relative to the sun on the other side.' },
    { speaker: 'lecturer', text: 'This means the sun acts as a moving reference point, and the bee can correct for its slow progress across the sky during the trip.' },
    { speaker: 'lecturer', text: 'Experiments with marked bees show that most return within a few minutes of leaving the flowers.' },
    { speaker: 'lecturer', text: 'The second system takes over when the sun disappears behind cloud.' },
    { speaker: 'lecturer', text: 'Even when the sky looks evenly grey to us, light arriving from the sun is polarized, and the polarization forms a pattern across the whole sky.' },
    { speaker: 'lecturer', text: 'Bees can see this pattern through a special part of their eye, and they read the position of the hidden sun from it.' },
    { speaker: 'lecturer', text: 'So cloudy weather does not stop a foraging bee, as long as some patch of blue sky is visible overhead.' },
    { speaker: 'lecturer', text: 'The pattern remains visible even through thin cloud, which explains why colonies keep foraging on grey mornings.' },
    { speaker: 'lecturer', text: 'The third system is much closer to home.' },
    { speaker: 'lecturer', text: 'When a bee leaves the hive for the first time, it performs short orientation flights near the entrance.' },
    { speaker: 'lecturer', text: 'During these flights it learns the shape of nearby landmarks, such as trees, rocks or the edge of a path.' },
    { speaker: 'lecturer', text: 'It also leaves scent marks at the entrance, using a gland on its abdomen.' },
    { speaker: 'lecturer', text: 'These marks tell returning bees that this is the correct hive, even when several colonies stand close together.' },
    { speaker: 'lecturer', text: 'Scent alone, however, cannot guide a bee across open countryside, so that is where the dance comes in.' },
    { speaker: 'lecturer', text: 'A bee that finds a good source of food returns to the hive and performs a waggle dance on the vertical comb.' },
    { speaker: 'lecturer', text: 'The dance is a small figure eight, with a straight central section where the bee waggles its body from side to side.' },
    { speaker: 'lecturer', text: 'The angle of that straight section relative to gravity tells the other bees the direction of the flowers.' },
    { speaker: 'lecturer', text: 'The number of waggles in the central section tells them the distance to the food.' },
    { speaker: 'lecturer', text: 'A longer waggle run means a longer flight, and the other workers leave the hive and fly the same angle from the sun.' },
    { speaker: 'lecturer', text: 'The dance lasts a few seconds, and it may be repeated several times before a group leaves.' },
    { speaker: 'lecturer', text: 'This dance is a precise signal that has been studied for more than a century, not a display for the other bees’ amusement.' },
    { speaker: 'lecturer', text: 'Now I want to turn to how a colony chooses a new nest site.' },
    { speaker: 'lecturer', text: 'When a hive becomes too crowded, a small group of scout bees leaves to search for a suitable cavity in a tree or a building.' },
    { speaker: 'lecturer', text: 'Each scout visits several possible sites and checks them carefully before returning to report.' },
    { speaker: 'lecturer', text: 'When a scout likes a site, it dances for it on the comb, and scouts that agree may visit it in turn.' },
    { speaker: 'lecturer', text: 'The colony does not vote by raising its legs, and it does not follow the first scout to return.' },
    { speaker: 'lecturer', text: 'Instead, the decision emerges as more dances support the same site, until one option has clearly won over the others.' },
    { speaker: 'lecturer', text: 'Researchers studying this process look at two main features of a good cavity.' },
    { speaker: 'lecturer', text: 'The first is its size. A small cavity cannot hold the winter stores the colony needs, while an overly large one loses heat too quickly.' },
    { speaker: 'lecturer', text: 'The preferred volume is roughly the space needed for about two swarms to settle.' },
    { speaker: 'lecturer', text: 'The second is its exposure to light. A cavity in deep shade keeps the combs cool, whereas a site open to the afternoon sun can overheat the bees.' },
    { speaker: 'lecturer', text: 'Other details, such as a smooth entrance or distance from water, are secondary compared with these two.' },
    { speaker: 'lecturer', text: 'Having covered the systems, let me mention the limits of bee navigation that modern experiments have shown.' },
    { speaker: 'lecturer', text: 'Bees lose their way when landmarks are removed and the sky is hidden, and they may land on the wrong tree.' },
    { speaker: 'lecturer', text: 'In one trial, bees taken far from familiar trees circled the release point for a long time before flying home.' },
    { speaker: 'lecturer', text: 'They also struggle in unfamiliar dense forest, where the sun compass gives them few reference points.' },
    { speaker: 'lecturer', text: 'To sum up, the bee combines the sun, polarized light, local landmarks and scent marks to build a reliable map of its surroundings.' },
    { speaker: 'lecturer', text: 'Even when the sun itself is hidden, the polarized light pattern in the sky still lets the bee read its position.' },
    { speaker: 'lecturer', text: 'The waggle dance then passes that combined information from one individual to the whole colony.' },
    { speaker: 'lecturer', text: 'Specifically, the dance encodes both the direction of the flowers and how far away they are.' },
    { speaker: 'lecturer', text: 'Early researchers believed bees found their way by sight alone, but that idea was an oversimplification.' },
    { speaker: 'lecturer', text: 'The full picture requires every system I have described today working together.' },
    { speaker: 'lecturer', text: 'Next week we will compare these systems with the navigation used by migrating birds.' },
    { speaker: 'lecturer', text: 'We have reached the end of the session. Thanks for joining me.' },
  ],
  vocabulary: [
    {
      term: 'foraging', phonetic: '/ˈfɒrɪdʒɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 1,
      meaning: { zh: '觅食的（外出采集花蜜花粉的）', en: 'leaving the hive to collect nectar and pollen' },
      usage: { zh: '动词 forage 的现在分词；a foraging bee、foraging trips。', en: 'Present participle of forage: a foraging bee, foraging trips.' },
      collocations: ['a foraging bee', 'foraging trips', 'foraging grounds'],
      example: { en: 'Foraging bees cover a wide area around the hive.', zh: '外出觅食的蜜蜂会飞到蜂巢周围很大一片区域。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈfɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'compass', phonetic: '/ˈkʌmpəs/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '罗盘，指南针', en: 'a device that gives a fixed reference direction' },
      usage: { zh: 'sun compass 指太阳罗盘；magnetic compass 是普通指南针。', en: 'A sun compass uses the sun as a reference; a magnetic compass points north.' },
      collocations: ['the sun compass', 'a compass bearing', 'follow the compass'],
      example: { en: 'The bee uses the sun as a compass during its flight.', zh: '蜜蜂飞行时把太阳当作罗盘。' },
      listening: { zh: '两个音节，重音在第一音节；与 come up 区分。', en: 'Two syllables with first-syllable stress; do not hear it as come up.' },
    },
    {
      term: 'polarized', phonetic: '/ˈpəʊləraɪzd/', partOfSpeech: 'adj.', sentenceIndex: 12,
      meaning: { zh: '偏振的（光波在特定方向振动）', en: 'describing light whose waves vibrate in a particular direction' },
      usage: { zh: '物理与生物讲座高频词；polarized light、polarization pattern。', en: 'Common in physics and biology talks: polarized light, a polarization pattern.' },
      collocations: ['polarized light', 'polarized vision', 'a polarized pattern'],
      example: { en: 'Bees can detect polarized light even on grey days.', zh: '即使阴天，蜜蜂也能感知偏振光。' },
      listening: { zh: '重音在第一音节 /ˈpəʊ/，结尾 /raɪzd/。', en: 'Stress the first syllable; the ending is /raɪzd/.' },
    },
    {
      term: 'orientation', phonetic: '/ˌɔːriənˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '定向，定位（熟悉周边环境的飞行）', en: 'the act of learning the surroundings so one can find the way back' },
      usage: { zh: 'orientation flight 是昆虫行为学说法；orientation 也指入职培训。', en: 'An orientation flight is an ethology term; orientation also means induction training.' },
      collocations: ['an orientation flight', 'orientation around the hive'],
      example: { en: 'Young bees make short orientation flights before their first trip.', zh: '年轻蜜蜂在首次外出前会做短距离定向飞行。' },
      listening: { zh: '五个音节，重音在第四个 /ˈteɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'landmarks', phonetic: '/ˈlændmɑːks/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '地标，显眼参照物', en: 'a familiar object or feature used to find a place' },
      usage: { zh: '可数名词；navigation 场景高频：nearby landmarks、use landmarks。', en: 'Countable, common in navigation: nearby landmarks, use landmarks.' },
      collocations: ['nearby landmarks', 'a familiar landmark', 'follow the landmarks'],
      example: { en: 'The bees learn the trees and rocks as landmarks.', zh: '蜜蜂把树木和岩石认作地标。' },
      listening: { zh: '复合词，两个音节都重读。', en: 'A compound with stress on both halves.' },
    },
    {
      term: 'gland', phonetic: '/ɡlænd/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '腺体', en: 'an organ that produces a chemical such as scent or wax' },
      usage: { zh: '可数名词；scent gland、abdomen gland。', en: 'Countable: a scent gland, an abdomen gland.' },
      collocations: ['a scent gland', 'a gland on the abdomen', 'the wax gland'],
      example: { en: 'The bee releases scent from a gland near its tail.', zh: '蜜蜂从尾部附近的腺体释放气味。' },
      listening: { zh: '单音节，元音 /æ/，不要听在 glide。', en: 'One syllable with /æ/; do not hear it as glide.' },
    },
    {
      term: 'waggle', phonetic: '/ˈwæɡl/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '摆腹，摇摆（舞蹈中的身体摆动）', en: 'the side-to-side body movement in the bee dance' },
      usage: { zh: 'waggle dance 是固定术语；动词 waggle 表示摆动身体。', en: 'The waggle dance is the fixed term; to waggle means to swing the body.' },
      collocations: ['the waggle dance', 'the waggle run', 'waggle from side to side'],
      example: { en: 'The waggle dance tells other bees where food lies.', zh: '摇摆舞告诉其他蜜蜂食物在哪里。' },
      listening: { zh: '两个音节，重音在第一音节；gle 读 /ɡl/。', en: 'Two syllables with first-syllable stress; gle is /ɡl/.' },
    },
    {
      term: 'cavity', phonetic: '/ˈkævəti/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '空洞，空腔（此处指筑巢的树洞或墙洞）', en: 'a hollow space inside a tree, wall or rock used as a nest' },
      usage: { zh: '可数名词；nest cavity、tree cavity。', en: 'Countable: a nest cavity, a tree cavity.' },
      collocations: ['a suitable cavity', 'a tree cavity', 'a cavity in a building'],
      example: { en: 'Scout bees inspect every cavity before choosing one.', zh: '侦察蜂在选巢前会检查每一个空腔。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkæ/。', en: 'Three syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'rely on', sentenceIndex: 2,
      meaning: { zh: '依靠，依赖', en: 'to depend on something or somebody' },
      usage: { zh: '及物；rely on one system、rely on memory。', en: 'Transitive: rely on one system, rely on memory.' },
      example: { en: 'Birds rely on the stars for navigation at night.', zh: '鸟类夜间靠星星导航。' },
    },
    {
      phrase: 'fixed angle', sentenceIndex: 6,
      meaning: { zh: '固定角度', en: 'an angle that stays constant during the flight' },
      usage: { zh: 'keep a fixed angle between A and B；与 fixed distance 同类。', en: 'keep a fixed angle between A and B; compare a fixed distance.' },
      example: { en: 'The pilot keeps a fixed angle to the runway.', zh: '飞行员与跑道保持固定角度。' },
    },
    {
      phrase: 'comes in', sentenceIndex: 21,
      meaning: { zh: '起作用，派上用场', en: 'to enter the situation and play a role' },
      usage: { zh: 'That is where something comes in 是引出新机制的说法。', en: 'That is where something comes in introduces a new mechanism.' },
      example: { en: 'When the sky is hidden, the scent marks come in.', zh: '天空被遮住时，气味标记就派上用场。' },
    },
    {
      phrase: 'in turn', sentenceIndex: 32,
      meaning: { zh: '依次，轮流', en: 'one after another, each doing the same thing' },
      usage: { zh: '放在句末；visit it in turn、speak in turn。', en: 'At the end of the clause: visit it in turn, speak in turn.' },
      example: { en: 'Each scout in turn visits the chosen site.', zh: '每只侦察蜂依次查看选中的地点。' },
    },
    {
      phrase: 'won over', sentenceIndex: 34,
      meaning: { zh: '胜出，压倒其他选项', en: 'to gain enough support to defeat the other options' },
      usage: { zh: 'win over 在此不是“说服个人”，而是比较中占上风；过去式 won。', en: 'Here win over means to prevail in comparison; the past tense is won.' },
      example: { en: 'One design won over all the others in the vote.', zh: '一个方案在投票中压倒了其余所有方案。' },
    },
    {
      phrase: 'sum up', sentenceIndex: 44,
      meaning: { zh: '总结，概括', en: 'to give a short account of the main points' },
      usage: { zh: '讲座收尾信号；to sum up、sum up the evidence。', en: 'A closing lecture signal: to sum up, sum up the evidence.' },
      example: { en: 'To sum up, both systems help bees find their way.', zh: '概括来说，两套系统都帮蜜蜂认路。' },
    },
    {
      phrase: 'taken far from', sentenceIndex: 42,
      meaning: { zh: '被带到远离……的地方', en: 'moved a long distance away from familiar surroundings' },
      usage: { zh: '被动；be taken far from home、be taken from the hive。', en: 'Passive: be taken far from home, be taken from the hive.' },
      example: { en: 'Bees taken far from the hive circled the release point.', zh: '被带到远离蜂巢处的蜜蜂在释放点附近盘旋。' },
    },
  ],
  tips: [
    {
      title: { zh: '先预测空格的词性', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 题空前是 the，空后是 as，填名词 sun；第 32 题空后是 light，填形容词 polarized；第 34 题空后是 dance，填 waggle。听前把词性写在空格旁，听时只等那一类词。',
        en: 'Item 31 needs a noun after the and before as; item 32 needs an adjective before light; item 34 needs waggle before dance. Note the predicted part of speech beside each gap before the recording starts.',
      },
    },
    {
      title: { zh: '跟着讲座信号词走', en: 'Follow the lecture signposts' },
      body: {
        zh: 'Let’s start with、The second system takes over、The third system、Now I want to turn to、To sum up 都是段落切换。题目顺序与讲座一致，听到信号词就检查自己填到了哪一空。',
        en: 'Let’s start with, The second system takes over, The third system, Now I want to turn to and To sum up all mark a new stage. Items follow the lecture order, so check your place after each one.',
      },
    },
    {
      title: { zh: '观点题听 but 之后', en: 'For attitude items, listen after but' },
      body: {
        zh: '第 40 题问讲师对早期看法的态度，答案在 but that idea was an oversimplification 之后。讲座里被介绍的旧理论常常不是被全盘否定，而是被说成简化或不完整。',
        en: 'Item 40 asks for the lecturer’s attitude to the early idea, and the answer follows but that idea was an oversimplification. Old theories are usually presented as simplified or incomplete rather than wholly rejected.',
      },
    },
  ],
};
