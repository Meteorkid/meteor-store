import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 44 · Part 2 — 天文台公众开放夜说明（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：望远镜结构与使用、观测目标、红光手电、云层取消、保暖提示（笔记 11–14）→
 * 操作禁忌、首个目标、红光原因、着装建议（单选 15–18）→ 天气取消与寒风两条对应建议
 * （配对 19–20）。开场用现场集合指令，不用 welcome to。
 */
export const test44Part2: ListeningLesson = {
  slug: 'test-44-part-2',
  part: 2,
  status: 'published',
  title: { zh: '天文台公众开放夜说明', en: 'Introducing a public observatory night' },
  summary: {
    zh: '天文台志愿者在甲板讲解观测夜：看镜时把眼睛对准目镜，手不碰镜片；首个目标是月球，随后看木星，最后是暗弱星系。手电必须是红光，因为白光会破坏暗适应；厚重云层可能取消当晚活动；山顶寒冷，建议穿厚外套、戴手套。若遇取消可顺延到另一个开放夜，寒风中要保住手套、外套和围巾。',
    en: 'A volunteer briefs the deck session: look through the eyepiece, keep hands off the lens; the moon comes first, then Jupiter, then a faint galaxy. Torches must be red, since white light kills dark adaptation; heavy cloud may cancel the evening; wear a coat and gloves on the cold hilltop. Cancellation postpones you to another public night, and in the wind keep gloves, coat and scarf on.',
  },
  accent: { zh: '讲解员为澳式口音，指令清晰，停顿留出记笔记时间。', en: 'The guide speaks with an Australian accent, gives clear instructions and pauses for note taking.' },
  speechRate: '+3%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Look through the telescope at the ', cells: [[{ blank: 11 }]] },
        { lead: 'First observing target tonight: the ', cells: [[{ blank: 12 }]] },
        { lead: 'Torch light must be ', cells: [[{ blank: 13 }]] },
        { lead: 'Evening may be cancelled by heavy ', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Before looking through a telescope, what should visitors do?',
          options: [
            { key: 'A', text: 'Push the tube toward the target themselves' },
            { key: 'B', text: 'Wait for the volunteer to aim it' },
            { key: 'C', text: 'Touch the lens to clean a smudge' },
          ],
        },
        {
          number: 16,
          stem: 'Which object is observed first tonight?',
          options: [
            { key: 'A', text: 'Jupiter' },
            { key: 'B', text: 'The moon' },
            { key: 'C', text: 'A distant galaxy' },
          ],
        },
        {
          number: 17,
          stem: 'Why is a red torch required?',
          options: [
            { key: 'A', text: 'It does not spoil dark night vision' },
            { key: 'B', text: 'It lights the star map most brightly' },
            { key: 'C', text: 'It avoids disturbing the telescope mirrors' },
          ],
        },
        {
          number: 18,
          stem: 'What warm clothing is advised?',
          options: [
            { key: 'A', text: 'A coat and gloves' },
            { key: 'B', text: 'Shorts and sandals' },
            { key: 'C', text: 'A sun hat and light shirt' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Match each situation with the correct advice. Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'postpone to another public night' },
        { key: 'B', text: 'keep hands and neck covered' },
        { key: 'C', text: 'arrive early to book a telescope' },
        { key: 'D', text: 'note the names of all planets' },
        { key: 'E', text: 'wait until the moon sets' },
      ],
      items: [
        { number: 19, text: 'the evening is cancelled by heavy cloud' },
        { number: 20, text: 'the cold wind bites through the session' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['eyepiece'], evidence: 3,
      explanation: {
        zh: '定位句 3：To look through a telescope, you place your eye at the eyepiece and keep both hands off the lens。观看部位是目镜，填 eyepiece。镜片不能触碰。',
        en: 'Sentence 3: you place your eye "at the eyepiece", so fill eyepiece. The lens must not be touched.',
      },
    },
    {
      number: 12, accepted: ['moon'], evidence: 5,
      explanation: {
        zh: '定位句 5：Tonight’s first target is the moon, which sits high in the east and shows clear crater walls。首个目标是月球，填 moon。木星排在其后。',
        en: 'Sentence 5: tonight’s first target "is the moon", so fill moon. Jupiter comes after it.',
      },
    },
    {
      number: 13, accepted: ['red'], evidence: 8,
      explanation: {
        zh: '定位句 8：Bring a torch if you need to find the path or your notes, but it must be a red torch。手电灯光须为红色，填 red。白光会破坏暗适应。',
        en: 'Sentence 8: the torch "must be a red torch", so fill red. White light ruins dark adaptation.',
      },
    },
    {
      number: 14, accepted: ['cloud'], evidence: 11,
      explanation: {
        zh: '定位句 11：If heavy cloud rolls in before dark, the evening may be cancelled rather than moved indoors。取消条件是厚重云层，填 cloud。',
        en: 'Sentence 11: "heavy cloud" rolling in may cancel the evening, so fill cloud.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The tube is aimed by the volunteer, and you should not push the telescope toward a target yourself。等志愿者对准镜筒，对应 B。自己推镜筒、擦镜片都被禁止。',
        en: 'Sentence 17: the tube "is aimed by the volunteer", matching B. Pushing the telescope and touching the lens are forbidden.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The moon comes first, with its crater walls easy to pick out in the early dark。首个观测目标是月球，对应 B。木星其次，星系最后。',
        en: 'Sentence 19: "the moon comes first", matching B. Jupiter follows and the galaxy is last.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Red light does not spoil the dark adaptation, while a bright white beam resets everyone’s eyes。红光不破坏暗视力，对应 A。照亮星图最亮、避免扰动镜面均不是原因。',
        en: 'Sentence 21: red light "does not spoil the dark adaptation", matching A. Bright map lighting and mirror disturbance are not the reasons.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：A warm coat and gloves are suggested, since the wind off the ridge makes the metal feel cold。建议外套加手套，对应 A。短裤凉鞋、遮阳帽都是干扰项。',
        en: 'Sentence 23: "a warm coat and gloves are suggested", matching A. Shorts, sandals and a sun hat are distractors.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：Those on the list are invited to postpone to another public night rather than lose the place。云层取消时顺延到另一个开放夜，选 A。',
        en: 'Sentence 26: those listed "postpone to another public night", matching A.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：Keep the gloves and a coat on, and cover your neck with a scarf if you brought one。寒风中保住手套、外套和围巾，选 B。',
        en: 'Sentence 28: keep "the gloves and a coat on" and cover the neck, matching B.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Right, everyone, gather round the door here, and I will walk you through tonight’s observing session before we go outside.' },
    { speaker: 'guide', text: 'I’m Belinda from the observatory, and the telescopes on the deck are looked after by trained volunteers.' },
    { speaker: 'guide', text: 'Each telescope has a main tube, an eyepiece at the back, and a mount that holds it steady.' },
    { speaker: 'guide', text: 'To look through a telescope, you place your eye at the eyepiece and keep both hands off the lens.' },
    { speaker: 'guide', text: 'The volunteer will aim the tube for you, because the mirrors are easily knocked out of line.' },
    { speaker: 'guide', text: 'Tonight’s first target is the moon, which sits high in the east and shows clear crater walls.' },
    { speaker: 'guide', text: 'After the moon, we will turn to Jupiter and its bright, small moons beside it.' },
    { speaker: 'guide', text: 'A faint galaxy near the south point will be shown last, once your eyes have grown used to the dark.' },
    { speaker: 'guide', text: 'Bring a torch if you need to find the path or your notes, but it must be a red torch.' },
    { speaker: 'guide', text: 'White light kills the dark adaptation your eyes build up over twenty minutes outside.' },
    { speaker: 'guide', text: 'A red beam is dim enough to read a star map without spoiling anyone’s night vision.' },
    { speaker: 'guide', text: 'If heavy cloud rolls in before dark, the evening may be cancelled rather than moved indoors.' },
    { speaker: 'guide', text: 'The forecast tonight is mostly clear, but the deck can close down if the sky hides the moon.' },
    { speaker: 'guide', text: 'The cold from the hill can surprise people, so dress for a steady evening outside.' },
    { speaker: 'guide', text: 'Wear a warm coat, and gloves help when the metal eyepiece feels cold to touch.' },
    { speaker: 'guide', text: 'You may leave hats and scarves in the rack inside, but keep your hands covered on the deck.' },
    { speaker: 'guide', text: 'Before you look through a telescope, what should you remember not to do?' },
    { speaker: 'guide', text: 'The tube is aimed by the volunteer, and you should not push the telescope toward a target yourself.' },
    { speaker: 'guide', text: 'What will be observed first tonight once we reach the deck?' },
    { speaker: 'guide', text: 'The moon comes first, with its crater walls easy to pick out in the early dark.' },
    { speaker: 'guide', text: 'Why does the club ask everyone to use a red torch?' },
    { speaker: 'guide', text: 'Red light does not spoil the dark adaptation, while a bright white beam resets everyone’s eyes.' },
    { speaker: 'guide', text: 'What clothing is advised for the hilltop evening?' },
    { speaker: 'guide', text: 'A warm coat and gloves are suggested, since the wind off the ridge makes the metal feel cold.' },
    { speaker: 'guide', text: 'We should match two simple situations to the right advice from tonight’s briefing.' },
    { speaker: 'guide', text: 'If the evening is cancelled by heavy cloud, what happens to the booking?' },
    { speaker: 'guide', text: 'Those on the list are invited to postpone to another public night rather than lose the place.' },
    { speaker: 'guide', text: 'If the cold wind bites through the session, what clothing should you keep on?' },
    { speaker: 'guide', text: 'Keep the gloves and a coat on, and cover your neck with a scarf if you brought one.' },
    { speaker: 'guide', text: 'The deck path is lit only by faint red markers, so watch your step between the telescopes.' },
    { speaker: 'guide', text: 'Please do not lean on the mount, and keep drinks away from the tube ends.' },
    { speaker: 'guide', text: 'Volunteers can point out the names on the star map while you wait your turn.' },
    { speaker: 'guide', text: 'If a cloud passes over a target, wait a few minutes for the sky to clear again.' },
    { speaker: 'guide', text: 'The observatory shop sells cheap red filters that clip over an ordinary phone light.' },
    { speaker: 'guide', text: 'Children on the deck must stay beside an adult, especially near the tripod legs.' },
    { speaker: 'guide', text: 'The session runs until about ten, and the last telescope closes at nine forty-five.' },
    { speaker: 'guide', text: 'After the talk inside, the group walks out in small batches of four or five.' },
    { speaker: 'guide', text: 'Please switch any head torch to its red setting before you cross the yard.' },
    { speaker: 'guide', text: 'The target notes on the handout list the moon, Jupiter and the faint galaxy in that order.' },
    { speaker: 'guide', text: 'That covers the main rules. Take your time on the steps, and the volunteers will meet you on the deck.' },
  ],
  vocabulary: [
    {
      term: 'eyepiece', phonetic: '/ˈaɪpiːs/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '目镜（观看端镜片）', en: 'the lens at the back where you look through' },
      usage: { zh: '可数；at the eyepiece、the metal eyepiece。由 eye 与 piece 合成。', en: 'Countable: at the eyepiece; a compound of eye and piece.' },
      collocations: ['at the eyepiece', 'the telescope eyepiece', 'the metal eyepiece'],
      example: { en: 'Place your eye at the eyepiece to look through.', zh: '把眼睛对准目镜观看。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈaɪ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'moon', phonetic: '/muːn/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '月球（首个观测目标）', en: 'the bright night sky body with visible crater walls' },
      usage: { zh: '可数；the high moon、the moon first。', en: 'Countable: the moon comes first.' },
      collocations: ['the moon', 'the crater walls', 'the moon sets'],
      example: { en: 'The moon sits high in the east tonight.', zh: '今晚月亮挂在东边高空。' },
      listening: { zh: '单音节，与 soon 押韵。', en: 'One syllable, rhyming with soon.' },
    },
    {
      term: 'red', phonetic: '/red/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '红色的（手电灯光要求）', en: 'the dim colour that preserves night vision' },
      usage: { zh: '形容词；a red torch、red light、red filter。', en: 'Adjective: a red torch, red light, red filter.' },
      collocations: ['a red torch', 'red light', 'the red setting'],
      example: { en: 'The torch must be a red torch.', zh: '手电必须是红光手电。' },
      listening: { zh: '单音节，短元音 /e/。', en: 'One syllable with short /e/.' },
    },
    {
      term: 'cloud', phonetic: '/klaʊd/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '云层（取消观测的天气）', en: 'the sky cover that hides the targets' },
      usage: { zh: '可数；heavy cloud、cloud rolls in、passing cloud。', en: 'Countable: heavy cloud rolls in.' },
      collocations: ['heavy cloud', 'the cloud rolls in', 'the sky hides the moon'],
      example: { en: 'Heavy cloud may cancel the evening.', zh: '厚重云层可能取消当晚活动。' },
      listening: { zh: '单音节，双元音 /aʊ/。', en: 'One syllable with diphthong /aʊ/.' },
    },
    {
      term: 'vision', phonetic: '/ˈvɪʒn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '夜视（暗处视力）', en: 'the eyes’ sensitivity after dark adaptation' },
      usage: { zh: '不可数；night vision、spoiling vision、dark vision。', en: 'Uncountable: night vision; dark adaptation is the related process.' },
      collocations: ['night vision', 'dark vision', 'spoiling vision'],
      example: { en: 'A red beam does not spoil night vision.', zh: '红光不破坏夜视。' },
      listening: { zh: '两个音节，重音在第一音节，/ʒ/ 浊擦音。', en: 'Two syllables with first-syllable stress and voiced /ʒ/.' },
    },
    {
      term: 'gloves', phonetic: '/ɡlʌvz/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '手套（防寒手部）', en: 'the hand coverings for the cold deck' },
      usage: { zh: '可数复数；warm gloves、keep gloves on。单数 glove。', en: 'Plural countable: keep gloves on; the singular is glove.' },
      collocations: ['warm gloves', 'keep the gloves on', 'the gloves help'],
      example: { en: 'Gloves help when the metal feels cold.', zh: '金属冰凉时手套很有用。' },
      listening: { zh: '单音节，开头 /ɡl/ 连缀，结尾 /vz/。', en: 'One syllable, opening /ɡl/ and ending /vz/.' },
    },
    {
      term: 'crater', phonetic: '/ˈkreɪtə/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '环形山（月表坑穴）', en: 'the bowl shaped marks visible on the moon' },
      usage: { zh: '可数；crater walls、lunar craters。', en: 'Countable: crater walls; lunar craters.' },
      collocations: ['crater walls', 'the lunar crater', 'pick out the crater'],
      example: { en: 'The crater walls are easy to see on the moon.', zh: '月表环形山壁清晰可见。' },
      listening: { zh: '两个音节，重音在第一音节，/kr/ 连缀。', en: 'Two syllables with first-syllable stress and /kr/ cluster.' },
    },
  ],
  expressions: [
    {
      phrase: 'gather round', sentenceIndex: 0,
      meaning: { zh: '聚拢到一起（听讲解）', en: 'to come close around the guide' },
      usage: { zh: '不及物；gather round the door、gather round here。', en: 'Intransitive: gather round the guide.' },
      example: { en: 'Gather round the door before we go outside.', zh: '出门前请到门口聚拢。' },
    },
    {
      phrase: 'dark adaptation', sentenceIndex: 9,
      meaning: { zh: '暗适应（眼睛适应黑暗）', en: 'the process by which eyes grow sensitive in the dark' },
      usage: { zh: '不可数；build up dark adaptation、lose dark adaptation。', en: 'Uncountable: build up dark adaptation.' },
      example: { en: 'White light kills the dark adaptation outside.', zh: '白光破坏室外形成的暗适应。' },
    },
    {
      phrase: 'rolls in', sentenceIndex: 11,
      meaning: { zh: '涌进来（云层逼近）', en: 'to arrive and spread across the sky' },
      usage: { zh: '短语动词；cloud rolls in、clouds rolling in。', en: 'Phrasal verb: cloud rolls in.' },
      example: { en: 'Heavy cloud rolls in before dark.', zh: '厚重云层在天黑前涌来。' },
    },
    {
      phrase: 'dress for', sentenceIndex: 13,
      meaning: { zh: '按（天气）穿着准备', en: 'to wear clothes suited to the conditions' },
      usage: { zh: '及物；dress for the cold、dress for an evening outside。', en: 'Transitive: dress for the cold.' },
      example: { en: 'Dress for a steady evening outside.', zh: '按户外整晚的寒冷穿衣。' },
    },
    {
      phrase: 'wait your turn', sentenceIndex: 31,
      meaning: { zh: '等候轮到自己（观测）', en: 'to hold back until it is your moment at the telescope' },
      usage: { zh: '固定短语；wait your turn at the telescope、wait one’s turn。', en: 'Fixed phrase: wait your turn at the telescope.' },
      example: { en: 'Volunteers point out names while you wait your turn.', zh: '等候时志愿者讲解星图名称。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记按使用、目标、光线、天气记', en: 'Note use, target, light and weather' },
      body: {
        zh: '四空依次是目镜、月球、红色、云层。听到 at the eyepiece 记观看部位，first target 记首个目标，red torch 记灯光颜色，heavy cloud 记取消条件；题干已给 telescope、tonight 等引导词，不要重复写。',
        en: 'The four blanks are eyepiece, moon, red and cloud. Note the viewing part at the eyepiece, the first target, the torch colour after red torch, and the cancellation weather after heavy cloud. Do not repeat printed leads such as telescope and tonight.',
      },
    },
    {
      title: { zh: '单选区分操作禁忌与原因', en: 'Separate do-not actions from reasons' },
      body: {
        zh: '第 15 题问观看前该做什么：等志愿者对准镜筒，不能自己推镜或擦镜片；第 16 题首个目标月球；第 17 题红光原因是不破坏暗视力；第 18 题着装外套加手套。自己动手、擦镜片、照亮星图最亮、扰动镜面都是干扰项。',
        en: 'Item 15: wait for the volunteer to aim, do not push the tube or touch the lens; item 16 the moon first; item 17 red light preserves night vision; item 18 coat and gloves. Doing it yourself, cleaning the lens, brightest map light and mirror disturbance are distractors.',
      },
    },
    {
      title: { zh: '配对题把情境对到建议动作', en: 'Match situations to advice actions' },
      body: {
        zh: '两道配对：云层取消对应顺延到另一个开放夜；寒风对应保住手套、外套和围巾。选项里提前订镜、记行星名、等月落都没有对应情境。听到 postpone、another public night 选 A，听到 gloves、coat、neck 选 B。',
        en: 'The two matches: cloud cancellation postpones you to another public night; cold wind means keeping gloves, coat and scarf on. Booking early, noting planets and waiting for moon set have no matching situation. Pick A at postpone and another public night, B at gloves, coat and neck.',
      },
    },
  ],
};
