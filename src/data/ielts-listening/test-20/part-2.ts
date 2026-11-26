import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 20 · Part 2 — 天文馆放映介绍（单人独白，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 场景：节目内容、座位选择、光害知识、观测夜安排、拍照规定。
 * 题块顺序：单选 11–15 → 笔记填空 16–20。
 */
export const test20Part2: ListeningLesson = {
  slug: 'test-20-part-2',
  part: 2,
  status: 'published',
  title: { zh: '天文馆放映介绍', en: 'Introducing a planetarium show' },
  summary: {
    zh: '讲解员在放映前说明今晚节目围绕本季可见星座，推荐中央排座位，解释街道灯光让暗星消失，预告三月开放观测夜与正门集合点，并规定内场禁用闪光灯、允许小型三脚架。',
    en: 'Before the screening, the host explains that the show follows this season’s constellations, recommends central rows, describes how street and house lights hide faint stars, previews the open March observation night meeting at the main gate, and sets the no-flash rule with small tripods allowed.',
  },
  accent: { zh: '讲解员为加拿大口音，独白语速适中偏稳。', en: 'The host speaks with a Canadian accent, in a steady solo presentation.' },
  speechRate: '+5%',
  cast: [
    { id: 'host', label: 'HOST', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'What is the main focus of tonight’s show?',
          options: [
            { key: 'A', text: 'The planets seen through the historic telescope' },
            { key: 'B', text: 'Constellations visible this season' },
            { key: 'C', text: 'How astronauts prepare for deep space' },
          ],
        },
        {
          number: 12,
          stem: 'Which seats does the presenter recommend?',
          options: [
            { key: 'A', text: 'Rows near the centre' },
            { key: 'B', text: 'The back corners' },
            { key: 'C', text: 'The front row against the curve' },
          ],
        },
        {
          number: 13,
          stem: 'What mainly hides faint stars for town viewers?',
          options: [
            { key: 'A', text: 'Smoke from nearby factories' },
            { key: 'B', text: 'The bright glow of street and house lights' },
            { key: 'C', text: 'Thin cloud over the valley' },
          ],
        },
        {
          number: 14,
          stem: 'When is the next open observation night?',
          options: [
            { key: 'A', text: 'Next week' },
            { key: 'B', text: 'Next month, in March' },
            { key: 'C', text: 'Next autumn' },
          ],
        },
        {
          number: 15,
          stem: 'What photography rule applies inside the dome?',
          options: [
            { key: 'A', text: 'Tripods are banned at all times' },
            { key: 'B', text: 'The flash must stay off' },
            { key: 'C', text: 'Video recording is allowed after the show' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Show runs for forty', cells: [[{ blank: 16 }]] },
        { lead: 'Dome holds the', cells: [[{ blank: 17 }, { text: ' screen in the region' }]] },
        { lead: 'Faint stars hidden by', cells: [[{ blank: 18 }]] },
        { lead: 'Observation night meeting point: the', cells: [[{ blank: 19 }]] },
        { lead: 'Equipment: small', cells: [[{ blank: 20 }, { text: ' allowed under the dome' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['B'], evidence: 1,
      explanation: {
        zh: '定位句 1：The programme tracks the constellations you can actually look for this season。节目围绕本季可见星座，对应 B。历史望远镜、宇航员准备均未提及。',
        en: 'Sentence 1: the programme tracks "the constellations you can actually look for this season", matching B. The historic telescope and astronaut preparation are not mentioned.',
      },
    },
    {
      number: 12, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：Most families prefer rows near the centre, where the dome curves evenly overhead。推荐中央排，对应 A。后排角落是要避开的位置。',
        en: 'Sentence 3: most families prefer "rows near the centre, where the dome curves evenly overhead", matching A. The back corners are seats to avoid.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Those bright street lamps are the main reason faint stars slip out of view。让暗星消失的主因是路灯与屋灯的亮辉，对应 B。工厂烟尘、山谷薄云未被点名。',
        en: 'Sentence 6: "those bright street lamps are the main reason faint stars slip out of view", matching B. Factory smoke and valley cloud are not identified as the cause.',
      },
    },
    {
      number: 14, accepted: ['B'], evidence: 8,
      explanation: {
        zh: '定位句 8：We hold an open observation night next month, in March, after the show。开放观测夜在下个月三月，对应 B。',
        en: 'Sentence 8: the open observation night is "next month, in March, after the show", matching B.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：You may take photos with your camera, but the flash must stay off。内场规定是关闭闪光灯，对应 B。小型三脚架是允许的，A 与规则相反。',
        en: 'Sentence 10: "the flash must stay off", matching B. Small tripods are allowed, so A is the opposite of the rule.',
      },
    },
    {
      number: 16, accepted: ['minutes'], evidence: 12,
      explanation: {
        zh: '定位句 12：The show runs for forty minutes before the live Q and A。节目时长四十分钟，填 minutes；forty 已印在题干里。',
        en: 'Sentence 12: the show "runs for forty minutes" before the live Q and A, so fill minutes; forty is already printed in the row.',
      },
    },
    {
      number: 17, accepted: ['largest'], evidence: 13,
      explanation: {
        zh: '定位句 13：Our dome holds the largest projection screen in the whole region。银幕是全区最大，填 largest。',
        en: 'Sentence 13: the dome holds "the largest projection screen in the whole region", so fill largest.',
      },
    },
    {
      number: 18, accepted: ['light pollution'], evidence: 15,
      explanation: {
        zh: '定位句 15：Light pollution is the collective name for that wash of artificial glow。暗星被光害遮蔽，填 light pollution，不超过两词。',
        en: 'Sentence 15: "light pollution is the collective name for that wash of artificial glow", so fill light pollution within the two-word limit.',
      },
    },
    {
      number: 19, accepted: ['main gate'], evidence: 16,
      explanation: {
        zh: '定位句 16：When the observation night begins, everyone meets at the main gate。集合点是正门，填 main gate。句 17 的 car park 是正门朝向，不是集合点。',
        en: 'Sentence 16: everyone "meets at the main gate", so fill main gate. The car park in sentence 17 is what the gate faces, not the meeting point.',
      },
    },
    {
      number: 20, accepted: ['tripods'], evidence: 18,
      explanation: {
        zh: '定位句 18：Small tabletop tripods are welcome, but large floor tripods do not fit under the dome。穹顶下允许小型三脚架，填 tripods；大型落地三脚架才受限。',
        en: 'Sentence 18: "small tabletop tripods are welcome", so fill tripods; large floor tripods are the restricted type.',
      },
    },
  ],
  transcript: [
    { speaker: 'host', text: 'Before the lights dim, a few practical points for tonight’s sky show.' },
    { speaker: 'host', text: 'The programme tracks the constellations you can actually look for this season.' },
    { speaker: 'host', text: 'We start low in the west, where the bright planets sit beside familiar star shapes.' },
    { speaker: 'host', text: 'Most families prefer rows near the centre, where the dome curves evenly overhead.' },
    { speaker: 'host', text: 'Avoid the back corners, where the projection washes the edges of the screen.' },
    { speaker: 'host', text: 'Even here, towns and roads send up lights that lift the night sky.' },
    { speaker: 'host', text: 'Those bright street lamps are the main reason faint stars slip out of view.' },
    { speaker: 'host', text: 'The same glow turns the Milky Way into a pale smear on clear nights.' },
    { speaker: 'host', text: 'We hold an open observation night next month, in March, after the show.' },
    { speaker: 'host', text: 'On that night our volunteers help you line up the binoculars on the planets.' },
    { speaker: 'host', text: 'You may take photos with your camera, but the flash must stay off.' },
    { speaker: 'host', text: 'The sudden flash ruins the dark adaptation of everyone beside you.' },
    { speaker: 'host', text: 'The show runs for forty minutes before the live Q and A.' },
    { speaker: 'host', text: 'Our dome holds the largest projection screen in the whole region.' },
    { speaker: 'host', text: 'The seats recline gently, so you can look straight up at the curves.' },
    { speaker: 'host', text: 'Light pollution is the collective name for that wash of artificial glow.' },
    { speaker: 'host', text: 'When the observation night begins, everyone meets at the main gate.' },
    { speaker: 'host', text: 'The gate faces the car park, and a steward will hold a red torch.' },
    { speaker: 'host', text: 'Small tabletop tripods are welcome, but large floor tripods do not fit under the dome.' },
    { speaker: 'host', text: 'Please leave heavy coats in the locker near the entrance if they block the row.' },
    { speaker: 'host', text: 'Drinks must stay in the café, and no food enters the theatre itself.' },
    { speaker: 'host', text: 'After the Q and A, the handout map shows tonight’s star shapes with labels.' },
    { speaker: 'host', text: 'If you miss a point, the map repeats the main paths without the soundtrack.' },
    { speaker: 'host', text: 'Tonight we will trace three named groups that rise one after another.' },
    { speaker: 'host', text: 'Each group keeps its shape even though its stars move slowly across the years.' },
    { speaker: 'host', text: 'The host points out which star is the end of the hunter’s belt.' },
    { speaker: 'host', text: 'A short clip explains how a telescope gathers starlight over its long exposure.' },
    { speaker: 'host', text: 'Children under twelve must stay with an adult throughout the show.' },
    { speaker: 'host', text: 'The rear bench is set aside for visitors with limited mobility.' },
    { speaker: 'host', text: 'Wheelchair spaces book themselves through the ticketing page if you plan ahead.' },
    { speaker: 'host', text: 'Once the doors close, latecomers wait in the foyer until the next interval.' },
    { speaker: 'host', text: 'The guide picks out a star that actually lies very far behind the belt.' },
    { speaker: 'host', text: 'Colour hints at the temperature of a star, from red to pale blue.' },
    { speaker: 'host', text: 'A few of the points you see are not stars at all, but distant galaxies.' },
    { speaker: 'host', text: 'The programme returns to the west at the end, when the planets slide lower.' },
    { speaker: 'host', text: 'Volunteers hand out the observing cards as you leave the theatre.' },
    { speaker: 'host', text: 'The cards list binocular targets that suit the month ahead.' },
    { speaker: 'host', text: 'Weather for the March night will be posted on our notice board two days ahead.' },
    { speaker: 'host', text: 'Bring a warm layer, since the hill stays cold after the sun sets.' },
    { speaker: 'host', text: 'Quiet please through the narration, and ask questions only after the show.' },
    { speaker: 'host', text: 'Enjoy the sky, and thank you for coming along tonight.' },
    { speaker: 'host', text: 'The dome itself weighs more than the old theatre it replaced.' },
    { speaker: 'host', text: 'Volunteers man the entrance desk from half past six in the evening.' },
    { speaker: 'host', text: 'The tickets for the observation night are booked through the same counter.' },
    { speaker: 'host', text: 'Please ask a steward if the projector seems dim from your seat.' },
    { speaker: 'host', text: 'After tonight, the show repeats each evening through the end of March.' },
  ],
  vocabulary: [
    {
      term: 'constellations', phonetic: '/ˌkɒnstəˈleɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '星座', en: 'a named group of stars forming a shape' },
      usage: { zh: '可数；a named constellation、trace the constellations。', en: 'Countable: a named constellation, trace the constellations.' },
      collocations: ['a named constellation', 'the constellation shape', 'visible constellations'],
      example: { en: 'The programme traces this season’s constellations.', zh: '节目追溯本季星座。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈleɪ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'recline', phonetic: '/rɪˈklaɪn/', partOfSpeech: 'v.', sentenceIndex: 14,
      meaning: { zh: '向后倚靠，（座椅）后仰', en: 'to lean back in a seat' },
      usage: { zh: 'recline gently、the seat reclines。名词 recliner 指躺椅。', en: 'Recline gently; the seat reclines. A recliner is a lounge chair.' },
      collocations: ['recline gently', 'the seat reclines', 'recline the backrest'],
      example: { en: 'The seats recline gently under the dome.', zh: '穹顶下座椅缓缓后仰。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈklaɪn/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'glow', phonetic: '/ɡləʊ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '光晕，辉光', en: 'the soft bright light raised by artificial sources' },
      usage: { zh: '可数/不可数；the wash of glow、a warm glow。动词同形。', en: 'Countable or uncountable; it is also a verb.' },
      collocations: ['the street glow', 'a warm glow', 'the glow of lamps'],
      example: { en: 'The artificial glow hides faint stars.', zh: '人造光晕遮蔽暗星。' },
      listening: { zh: '单音节，与 go 押韵。', en: 'One syllable, rhyming with go.' },
    },
    {
      term: 'binoculars', phonetic: '/bɪˈnɒkjələz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '双筒望远镜', en: 'the hand-held two-lens viewer used outdoors' },
      usage: { zh: '恒用复数；a pair of binoculars、line up the binoculars。', en: 'Always plural: a pair of binoculars.' },
      collocations: ['a pair of binoculars', 'line up the binoculars', 'binocular targets'],
      example: { en: 'Volunteers help you aim the binoculars.', zh: '志愿者帮你对准双筒望远镜。' },
      listening: { zh: '五个音节，重音在第二音节 /ˈnɒk/。', en: 'Five syllables with stress on the second.' },
    },
    {
      term: 'tripods', phonetic: '/ˈtraɪpɒdz/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '三脚架', en: 'the three-legged stand for a camera or telescope' },
      usage: { zh: '可数；tabletop tripod、floor tripod，复数 tripods。', en: 'Countable: tabletop or floor tripod; plural tripods.' },
      collocations: ['a tabletop tripod', 'a floor tripod', 'fit the tripod'],
      example: { en: 'Small tripods fit under the dome.', zh: '小型三脚架可放进穹顶下。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtraɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'galaxies', phonetic: '/ˈɡæləksiz/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '星系', en: 'a distant system of billions of stars' },
      usage: { zh: '可数；a distant galaxy、the Milky Way galaxy。', en: 'Countable: a distant galaxy, the Milky Way galaxy.' },
      collocations: ['a distant galaxy', 'the whole galaxy', 'nearby galaxies'],
      example: { en: 'Some points are distant galaxies, not stars.', zh: '有些光点是遥远星系，不是恒星。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈɡæl/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'narration', phonetic: '/nəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '解说，旁白', en: 'the spoken commentary through the show' },
      usage: { zh: '不可数；through the narration、the audio narration。动词 narrate。', en: 'Uncountable; the verb is narrate.' },
      collocations: ['the live narration', 'the recorded narration', 'through the narration'],
      example: { en: 'Stay quiet through the narration.', zh: '解说期间保持安静。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈreɪ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'slip out of view', sentenceIndex: 6,
      meaning: { zh: '从视野中消失', en: 'to become too faint to be seen' },
      usage: { zh: 'slip out of sight 同义；主语是暗星。', en: 'Slip out of sight means the same; the faint stars are the subject.' },
      example: { en: 'Faint stars slip out of view in bright towns.', zh: '亮城里暗星会从视野消失。' },
    },
    {
      phrase: 'line up', sentenceIndex: 9,
      meaning: { zh: '对准，调直（望远镜或镜头）', en: 'to aim or align a viewer toward a target' },
      usage: { zh: '可分短语动词；line up the binoculars on the planets，指对准镜头。', en: 'Separable: line up the binoculars on the planets.' },
      example: { en: 'Volunteers help line up the binoculars.', zh: '志愿者帮忙对准望远镜。' },
    },
    {
      phrase: 'stay off', sentenceIndex: 10,
      meaning: { zh: '保持关闭，不要打开', en: 'to remain switched off, usually the flash' },
      usage: { zh: '短语动词；the flash must stay off，指闪光灯保持关闭状态。', en: 'The flash must stay off; keep the lights off.' },
      example: { en: 'The camera flash must stay off.', zh: '相机闪光灯必须关闭。' },
    },
    {
      phrase: 'wash of artificial glow', sentenceIndex: 15,
      meaning: { zh: '一片弥漫的辉光', en: 'a broad even layer of artificial light' },
      usage: { zh: 'a wash of colour、a wash of light，表成片覆盖。', en: 'A wash of colour or light means a broad even layer.' },
      example: { en: 'That wash of glow is light pollution.', zh: '那片弥漫辉光就是光害。' },
    },
    {
      phrase: 'hand out', sentenceIndex: 35,
      meaning: { zh: '分发（卡片、地图）', en: 'to give papers or cards to the audience' },
      usage: { zh: '可分短语动词；hand out the observing cards。', en: 'Separable: hand out the observing cards.' },
      example: { en: 'Volunteers hand out the cards on the way out.', zh: '志愿者离场时分发卡片。' },
    },
  ],
  tips: [
    {
      title: { zh: '先抓节目主旨再记座位', en: 'Get the focus before seating' },
      body: {
        zh: '前几道单选按出场顺序走：节目主题是本季星座，座位推荐中央排，隐藏暗星的是人工亮辉，观测夜在三月，内场禁用闪光灯。听到 central、main reason、March、flash 就圈定选项。',
        en: 'The early singles follow the order: this season’s constellations, central rows, the artificial glow hiding faint stars, March for the observation night, and the flash-off rule. Circle options at central, main reason, March and flash.',
      },
    },
    {
      title: { zh: '笔记先填已给数字', en: 'Fill given numbers first' },
      body: {
        zh: '时长一行已印 forty，空格里要填 minutes；其余五空分别是最大银幕、光害、正门、三脚架。注意 main gate 是集合点，car park 只是门朝向。',
        en: 'The duration row already prints forty, so the blank is minutes. The other notes are largest screen, light pollution, main gate and tripods. Main gate is the meeting point; the car park only faces the gate.',
      },
    },
    {
      title: { zh: '区分允许与受限设备', en: 'Separate allowed and restricted gear' },
      body: {
        zh: '小型桌面三脚架可以进穹顶，大型落地三脚架放不进去；闪光灯无论大小都禁止。选项把 tripods 写成一律禁用时，注意听 small 与 large 的限定。',
        en: 'Small tabletop tripods enter the dome; large floor tripods do not fit. The flash is banned regardless of size. When an option bans all tripods, listen for the small versus large limit.',
      },
    },
  ],
};
