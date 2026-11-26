import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 14 · Part 4 — 讲座：地震与建筑设计。原创仿真材料，非官方真题。
 *
 * 结构：地震波分类 → 砖石墙体为何脆弱 → 隔震支座与阻尼器 → 规范演进 →
 * 高楼共振 → 交叉支撑作用 → 现代抗震三要素。表格填空 31–34 按出现顺序，
 * 单选 35–37 落在机理段，多选 38–40 落在现代要素段。
 */
export const test14Part4: ListeningLesson = {
  slug: 'test-14-part-4',
  part: 4,
  status: 'published',
  title: { zh: '地震与建筑设计', en: 'Earthquakes and building design' },
  summary: {
    zh: '一场关于抗震建筑的讲座：地震波如何分为体波与面波，老砖墙为何抵抗不住侧移，隔震支座如何把建筑与地基隔开，早期规范在哪场大地震后首次出台；随后解释高楼共振、交叉支撑的作用，以及现代设计依赖的三类构件。',
    en: 'A lecture on seismic building design: how earthquake waves split into body and surface waves, why old brick walls fail under side sway, how base-isolation bearings separate the frame from the soil, and after which famous disaster the early codes first appeared. It then explains tall-tower resonance, the role of cross-braces, and the three elements modern design relies on.',
  },
  accent: { zh: '讲师为澳式口音，术语会放慢重复。', en: 'The lecturer has an Australian accent and repeats key terms slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Element / Situation', 'Detail', 'Note'],
      rows: [
        { lead: 'Earthquake waves', cells: [[{ blank: 31 }], [{ text: 'body waves travel through deep rock' }]] },
        { lead: 'Old masonry walls', cells: [[{ blank: 32 }], [{ text: 'brittle under a side push' }]] },
        { lead: 'Base isolation', cells: [[{ blank: 33 }], [{ text: 'placed beneath the building frame' }]] },
        { lead: 'Early building codes', cells: [[{ blank: 34 }], [{ text: 'drawn up after a major disaster' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why does a tall tower sometimes sway far more than a low house?',
          options: [
            { key: 'A', text: 'Its walls are thinner than those of older houses.' },
            { key: 'B', text: 'Its natural frequency matches the incoming waves.' },
            { key: 'C', text: 'Its foundations sink slowly into soft soil.' },
          ],
        },
        {
          number: 36,
          stem: 'What is the main job of a cross-brace in a steel frame?',
          options: [
            { key: 'A', text: 'It holds the roof above the top floor.' },
            { key: 'B', text: 'It stops the frame twisting under side load.' },
            { key: 'C', text: 'It carries electrical wiring between floors.' },
          ],
        },
        {
          number: 37,
          stem: 'How did the building codes change over the past century?',
          options: [
            { key: 'A', text: 'They were set once and never reviewed.' },
            { key: 'B', text: 'They followed each major disaster in turn.' },
            { key: 'C', text: 'They were copied from overseas standards.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE elements of modern seismic design does the lecturer mention? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE elements of modern seismic design are recommended?',
      options: [
        { key: 'A', text: 'flexible steel frames' },
        { key: 'B', text: 'heavy stone walls' },
        { key: 'C', text: 'lead-rubber bearings' },
        { key: 'D', text: 'shallow foundations' },
        { key: 'E', text: 'energy-dissipating dampers' },
        { key: 'F', text: 'wooden shutters' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['surface'], evidence: 6,
      explanation: {
        zh: '定位句 6：The second are surface waves, which roll along the top layer of the ground。第二类面波沿地表传播；body waves 是第一类，不能填入本空。',
        en: 'Sentence 6: "The second are surface waves, which roll along the top layer of the ground". The second class is surface waves that roll along the ground; body waves are the first class, not this answer.',
      },
    },
    {
      number: 32, accepted: ['sideways'], evidence: 10,
      explanation: {
        zh: '定位句 10：Old brick and stone walls are heavy, and they cannot resist sideways motion without cracking。老砖墙抵抗不住侧向运动；ballast 之类说法在本段没有出现。',
        en: 'Sentence 10: "Old brick and stone walls are heavy, and they cannot resist sideways motion without cracking". Old walls cannot resist sideways motion; terms such as ballast do not appear in this part.',
      },
    },
    {
      number: 33, accepted: ['bearings'], evidence: 20,
      explanation: {
        zh: '定位句 20：In base isolation, designers place rubber and steel bearings under the frame itself。隔震层用的是橡胶与钢支座；bearings 为复数，注意词尾。',
        en: 'Sentence 20: "In base isolation, designers place rubber and steel bearings under the frame itself". Base isolation uses rubber and steel bearings; keep the plural ending.',
      },
    },
    {
      number: 34, accepted: ['San Francisco'], evidence: 30,
      explanation: {
        zh: '定位句 30：The first formal building codes in the United States were drawn up after the San Francisco earthquake。早期正式规范出台于旧金山地震之后；地名两词首字母大写。',
        en: 'Sentence 30: "The first formal building codes in the United States were drawn up after the San Francisco earthquake". The early codes followed the San Francisco earthquake; capitalise both words of the place name.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：When the incoming waves match that natural frequency, the tower sways with growing amplitude。高楼摇晃加剧是因为自振频率与波吻合；墙薄和地基下沉在本段没有依据。',
        en: 'Sentence 36: "When the incoming waves match that natural frequency, the tower sways with growing amplitude". The tower sways because its natural frequency matches the waves; thin walls and sinking foundations are not mentioned here.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 41,
      explanation: {
        zh: '定位句 41：Its job is to stop the frame twisting when the ground pushes from the side。交叉支撑防止框架侧移时扭转；托住屋顶和走电线都不是它的作用。',
        en: 'Sentence 41: "Its job is to stop the frame twisting when the ground pushes from the side". The brace stops the frame twisting under side load; holding the roof and carrying wiring are not its roles.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 46,
      explanation: {
        zh: '定位句 46：Writers then updated the standards, so the codes effectively follow each disaster in turn。规范逐场重大地震后修订；一次性定死和照搬海外标准在全段被否定。',
        en: 'Sentence 46: "Writers then updated the standards, so the codes effectively follow each disaster in turn". The codes follow each disaster in turn; a single fixed rule and copying overseas standards are rejected.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 48,
      explanation: {
        zh: '定位句 48：The first is flexible steel frames, which bend rather than snap when the ground moves。现代设计第一类要素是柔性钢框架；石墙在句 55 被归为不利因素。',
        en: 'Sentence 48: "The first is flexible steel frames, which bend rather than snap when the ground moves". The first recommended element is flexible steel frames; heavy stone walls in sentence 55 are listed as a negative factor.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 50,
      explanation: {
        zh: '定位句 50：The second is lead-rubber bearings, the base-isolation units described earlier。第二类是铅芯橡胶支座；浅基础在句 56 被说成只够低矮棚屋。',
        en: 'Sentence 50: "The second is lead-rubber bearings, the base-isolation units described earlier". The second element is lead-rubber bearings; shallow foundations in sentence 56 are said to suit only a low shed.',
      },
    },
    {
      number: 40, accepted: ['E'], evidence: 52,
      explanation: {
        zh: '定位句 52：The third is energy-dissipating dampers, which burn off sway inside the frame。第三类是消能阻尼器；木百叶只防护风雨，不参与结构抗震。',
        en: 'Sentence 52: "The third is energy-dissipating dampers, which burn off sway inside the frame". The third element is energy-dissipating dampers; wooden shutters protect against wind and rain but do not resist structural sway.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Have you ever wondered why some buildings ride out an earthquake while the street beside them falls to rubble?' },
    { speaker: 'lecturer', text: 'We will look at how engineers answer that question, through the way a building resists the ground beneath it.' },
    { speaker: 'lecturer', text: 'An earthquake begins when tectonic plates slip past one another deep underground.' },
    { speaker: 'lecturer', text: 'The sudden slip releases energy that spreads outward as waves through the earth.' },
    { speaker: 'lecturer', text: 'Seismologists separate these waves into two broad classes.' },
    { speaker: 'lecturer', text: 'The first are body waves, which travel deep through the rock before they reach the surface.' },
    { speaker: 'lecturer', text: 'The second are surface waves, which roll along the top layer of the ground like ripples on water.' },
    { speaker: 'lecturer', text: 'It is the surface waves that do most of the visible damage to streets and structures.' },
    { speaker: 'lecturer', text: 'Body waves arrive first, but their shorter motion is easier for older frames to absorb.' },
    { speaker: 'lecturer', text: 'Let us turn next to why ordinary masonry buildings perform so badly.' },
    { speaker: 'lecturer', text: 'Old brick and stone walls are heavy, and they cannot resist sideways motion without cracking.' },
    { speaker: 'lecturer', text: 'The mortar between bricks is brittle, so a side push opens gaps along the joints.' },
    { speaker: 'lecturer', text: 'Once a wall starts to separate, the floors it supported begin to settle.' },
    { speaker: 'lecturer', text: 'Many collapses in historical earthquakes came from wall failure rather than roof collapse.' },
    { speaker: 'lecturer', text: 'Builders learned early that a tall wall needs ties to hold it back toward the frame.' },
    { speaker: 'lecturer', text: 'Those ties are simple steel rods, but they still do not protect the whole building.' },
    { speaker: 'lecturer', text: 'The problem grows worse when the ground beneath a weak frame shifts from side to side.' },
    { speaker: 'lecturer', text: 'Engineers describe this side-to-side motion as lateral load, and they design frames to carry it.' },
    { speaker: 'lecturer', text: 'Before moving to modern methods, let us consider how buildings sit on the ground.' },
    { speaker: 'lecturer', text: 'A standard frame transfers its weight straight down through columns to the foundations.' },
    { speaker: 'lecturer', text: 'In base isolation, designers place rubber and steel bearings under the frame itself.' },
    { speaker: 'lecturer', text: 'These bearings separate the building from the sharpest movement of the soil.' },
    { speaker: 'lecturer', text: 'The frame can glide slightly while the ground below it moves, which limits the force reaching the walls.' },
    { speaker: 'lecturer', text: 'Isolation works best on firm ground, and it is less useful where the soil itself softens.' },
    { speaker: 'lecturer', text: 'Dampers, by contrast, sit inside the frame and absorb energy from the sway.' },
    { speaker: 'lecturer', text: 'They look like large hydraulic cylinders between neighbouring columns.' },
    { speaker: 'lecturer', text: 'When the building moves, the damper pushes back, converting motion into heat.' },
    { speaker: 'lecturer', text: 'Both bearings and dampers belong to what engineers call seismic design.' },
    { speaker: 'lecturer', text: 'The rules that govern this design are not the same in every region.' },
    { speaker: 'lecturer', text: 'They develop over time, often after a disaster exposes a weak point in older practice.' },
    { speaker: 'lecturer', text: 'The first formal building codes in the United States were drawn up after the San Francisco earthquake.' },
    { speaker: 'lecturer', text: 'Those early codes focused mainly on brick walls, which had failed across whole districts.' },
    { speaker: 'lecturer', text: 'Later disasters added lessons about timber frames, foundations and tall towers.' },
    { speaker: 'lecturer', text: 'Code writers review each event, then write the lesson into the next edition of the rules.' },
    { speaker: 'lecturer', text: 'Why does a tall tower sometimes sway far more than a low house?' },
    { speaker: 'lecturer', text: 'Each structure has a natural frequency, the rate at which it likes to swing.' },
    { speaker: 'lecturer', text: 'When the incoming waves match that natural frequency, the tower sways with growing amplitude.' },
    { speaker: 'lecturer', text: 'The match between wave rhythm and building rhythm is called resonance.' },
    { speaker: 'lecturer', text: 'If the frequencies stay apart, the motion dies down quickly instead of building up.' },
    { speaker: 'lecturer', text: 'Next, what does a cross-brace do to a steel frame?' },
    { speaker: 'lecturer', text: 'A brace runs diagonally between columns, forming triangles across the wall.' },
    { speaker: 'lecturer', text: 'Its job is to stop the frame twisting when the ground pushes from the side.' },
    { speaker: 'lecturer', text: 'Without bracing, the joints at the corners can rack out of square.' },
    { speaker: 'lecturer', text: 'Diagonals also keep a lighter frame from bending under its own weight.' },
    { speaker: 'lecturer', text: 'Finally, how have the codes themselves changed over the past century?' },
    { speaker: 'lecturer', text: 'Each major disaster reviewed the existing rules and exposed what had been missed.' },
    { speaker: 'lecturer', text: 'Writers then updated the standards, so the codes effectively follow each disaster in turn.' },
    { speaker: 'lecturer', text: 'Now let us list the elements that modern seismic design actually relies on.' },
    { speaker: 'lecturer', text: 'The first is flexible steel frames, which bend rather than snap when the ground moves.' },
    { speaker: 'lecturer', text: 'Steel can repeat the same small bend through many cycles without losing strength.' },
    { speaker: 'lecturer', text: 'The second is lead-rubber bearings, the base-isolation units described earlier.' },
    { speaker: 'lecturer', text: 'Each bearing stacks rubber layers around a lead core, which softens the sharpest shocks.' },
    { speaker: 'lecturer', text: 'The third is energy-dissipating dampers, which burn off sway inside the frame.' },
    { speaker: 'lecturer', text: 'Architects choose these together, according to height, soil and local risk.' },
    { speaker: 'lecturer', text: 'I should mention what does not help in a serious earthquake.' },
    { speaker: 'lecturer', text: 'Heavy stone walls act as ballast, adding mass that the frame must move, so they are no modern answer.' },
    { speaker: 'lecturer', text: 'Shallow foundations may suffice for a low shed, but they do not anchor a tower against lateral load.' },
    { speaker: 'lecturer', text: 'Wooden shutters protect windows from wind and rain, yet they do nothing for structural sway.' },
    { speaker: 'lecturer', text: 'None of these three items appears in the recommended toolkit for tall urban buildings.' },
    { speaker: 'lecturer', text: 'Seismic engineering still measures risk against the budget a site can afford.' },
    { speaker: 'lecturer', text: 'A school or hospital follows a stricter standard than an ordinary shop.' },
    { speaker: 'lecturer', text: 'That is where public policy meets the technical choices we have discussed today.' },
    { speaker: 'lecturer', text: 'Next week we will look at how coastal cities plan for flooding alongside ground shaking.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'waves', phonetic: '/weɪvz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '地震波', en: 'the energy that travels outward from an earthquake through the ground' },
      usage: { zh: '复数；earthquake waves、body waves、surface waves。', en: 'Plural: earthquake waves, body waves, surface waves.' },
      collocations: ['seismic waves', 'surface waves', 'incoming waves'],
      example: { en: 'The sudden slip releases energy that spreads outward as waves through the earth.', zh: '地层错动释放能量，以波的形式在地中向外传播。' },
      listening: { zh: '单音节 /weɪv/，复数结尾 /z/。', en: 'One syllable /weɪv/ with plural /z/.' },
    },
    {
      term: 'mortar', phonetic: '/ˈmɔːtə(r)/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '砂浆，砌砖灰缝材料', en: 'the brittle paste that holds bricks together in a wall' },
      usage: { zh: '不可数；between bricks、brick and mortar。', en: 'Uncountable: between bricks, brick and mortar.' },
      collocations: ['the mortar between bricks', 'brick and mortar', 'mortar joints'],
      example: { en: 'The mortar between bricks is brittle, so a side push opens gaps.', zh: '砖间砂浆很脆，侧向推力会把灰缝拉开。' },
      listening: { zh: '两个音节，重音在第一音节；勿与 martyr 混淆。', en: 'Two syllables, stress on the first; do not confuse with martyr.' },
    },
    {
      term: 'lateral', phonetic: '/ˈlætərəl/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '侧向的，横向的', en: 'directed from the side rather than up or down' },
      usage: { zh: '定语；lateral load、lateral sway。名词 lateral。', en: 'Attributive: lateral load, lateral sway. The noun is laterality.' },
      collocations: ['lateral load', 'lateral sway', 'lateral force'],
      example: { en: 'Engineers describe this side-to-side motion as lateral load.', zh: '工程师把这种左右晃动称为侧向荷载。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈlæt/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'bearings', phonetic: '/ˈbeərɪŋz/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '支座，轴承（隔震支座）', en: 'devices that carry a frame and let it slide or isolate from movement' },
      usage: { zh: '复数；steel bearings、lead-rubber bearings。单数 bearing。', en: 'Plural: steel bearings, lead-rubber bearings. Singular bearing.' },
      collocations: ['steel bearings', 'base-isolation bearings', 'lead-rubber bearings'],
      example: { en: 'Designers place rubber and steel bearings under the frame itself.', zh: '设计者把橡胶钢支座放在框架正下方。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /rɪŋz/。', en: 'Two syllables, stress on the first; ending /rɪŋz/.' },
    },
    {
      term: 'seismic', phonetic: '/ˈsaɪzmɪk/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '地震的，抗震的', en: 'relating to earthquakes or the resistance to them' },
      usage: { zh: '定语；seismic design、seismic risk、seismic wave。', en: 'Attributive: seismic design, seismic risk, seismic wave.' },
      collocations: ['seismic design', 'seismic risk', 'seismic engineering'],
      example: { en: 'Both bearings and dampers belong to what engineers call seismic design.', zh: '支座和阻尼器都属于工程师所说的抗震设计。' },
      listening: { zh: '两个音节，重音在第一音节；开头 /saɪz/。', en: 'Two syllables, stress on the first; opening /saɪz/.' },
    },
    {
      term: 'resonance', phonetic: '/ˈrezənəns/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '共振', en: 'the build-up of sway when a structure matches the rhythm of the waves' },
      usage: { zh: '不可数；the match is called resonance、natural resonance。', en: 'Uncountable: called resonance, natural resonance.' },
      collocations: ['called resonance', 'natural resonance', 'resonance effect'],
      example: { en: 'The match between wave rhythm and building rhythm is called resonance.', zh: '波的节奏与建筑节奏相吻合就叫共振。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈrez/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'brace', phonetic: '/breɪs/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '支撑构件，交叉撑', en: 'a diagonal member that stiffens a frame against side movement' },
      usage: { zh: '可数；a cross-brace、diagonal brace。动词 brace 表示加固。', en: 'Countable: a cross-brace, diagonal brace. The verb means reinforce.' },
      collocations: ['cross-brace', 'diagonal brace', 'without bracing'],
      example: { en: 'A brace runs diagonally between columns, forming triangles across the wall.', zh: '支撑斜穿立柱，在墙面上组成三角形。' },
      listening: { zh: '单音节 /breɪs/，结尾 /s/ 清辅音。', en: 'One syllable /breɪs/, ending in a voiceless /s/.' },
    },
    {
      term: 'foundations', phonetic: '/faʊnˈdeɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '地基，基础', en: 'the structure that carries the building down into the ground' },
      usage: { zh: '复数；transfer weight to the foundations、shallow foundations。', en: 'Plural: transfer weight to the foundations, shallow foundations.' },
      collocations: ['the foundations', 'shallow foundations', 'firm foundations'],
      example: { en: 'A standard frame transfers its weight straight down through columns to the foundations.', zh: '普通框架通过立柱把重量直传地基。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdeɪʃ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'ride out', sentenceIndex: 0,
      meaning: { zh: '经受住，平安渡过（灾害）', en: 'to survive a storm or earthquake without serious damage' },
      usage: { zh: '可分短语动词；ride out a disaster、ride out the shaking。', en: 'Separable: ride out a disaster, ride out the shaking.' },
      example: { en: 'Some buildings ride out an earthquake while their neighbours collapse.', zh: '有些建筑挺过地震，旁边的却倒塌了。' },
    },
    {
      phrase: 'spreads outward', sentenceIndex: 3,
      meaning: { zh: '向四周扩散', en: 'to travel away from the centre in every direction' },
      usage: { zh: 'outward 为副词；energy spreads outward、waves spread outward。', en: 'Outward is an adverb: energy spreads outward, waves spread outward.' },
      example: { en: 'The sudden slip releases energy that spreads outward as waves.', zh: '突发错动释放的能量以波的形式向外扩散。' },
    },
    {
      phrase: 'side to side', sentenceIndex: 16,
      meaning: { zh: '左右地，侧向地', en: 'moving from one side to the other, rather than up and down' },
      usage: { zh: '短语作状语；shift from side to side、sway side to side。', en: 'Adverbial: shift from side to side, sway side to side.' },
      example: { en: 'The ground beneath a weak frame shifts from side to side.', zh: '脆弱框架下方的地基左右晃动。' },
    },
    {
      phrase: 'dies down', sentenceIndex: 38,
      meaning: { zh: '减弱，平息', en: 'to become weaker and stop after a period of motion' },
      usage: { zh: '不及物；the motion dies down、the wind dies down。', en: 'Intransitive: the motion dies down, the wind dies down.' },
      example: { en: 'If the frequencies stay apart, the motion dies down quickly.', zh: '频率错开后，晃动会很快平息。' },
    },
    {
      phrase: 'rack out of square', sentenceIndex: 42,
      meaning: { zh: '扭成不方正，歪出直角', en: 'to twist a joint or frame so its corners no longer stay at right angles' },
      usage: { zh: '被动或主动；joints rack out of square。square 此处指直角。', en: 'Passive or active: joints rack out of square. Here square means a right angle.' },
      example: { en: 'Without bracing, the corner joints can rack out of square.', zh: '没有支撑，角部节点会扭成斜角。' },
    },
    {
      phrase: 'stop the frame twisting', sentenceIndex: 41,
      meaning: { zh: '防止框架扭转', en: 'to prevent a frame from twisting under side load' },
      usage: { zh: '交叉支撑的作用；stop something doing something。', en: 'The brace’s role: stop something doing something.' },
      example: { en: 'The brace stops the frame twisting when the ground pushes from the side.', zh: '地面侧推时支撑防止框架扭转。' },
    },
    {
      phrase: 'burn off', sentenceIndex: 52,
      meaning: { zh: '消耗掉，耗散（能量）', en: 'to absorb and convert sway energy so it does not damage the frame' },
      usage: { zh: '可分；dampers burn off the sway、burn off energy。', en: 'Separable: dampers burn off the sway, burn off energy.' },
      example: { en: 'Dampers burn off sway inside the frame as heat.', zh: '阻尼器在框架内部把晃动以热量耗散掉。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题按预测词性写', en: 'Predict the part of speech for table gaps' },
      body: {
        zh: '第 31–34 题中，第一空问波的类别（形容词+名词），第二空问运动方向（副词），第三空问支座构件（名词复数），第四空问地名。听前在空旁标出词性，听到与预测一致的词再落笔。',
        en: 'Items 31 to 34: the first gap asks for a wave class, the second a direction of motion, the third a plural component, and the fourth a place name. Mark the predicted part of speech beside each gap before listening, and write down only what matches it.',
      },
    },
    {
      title: { zh: '机理题抓定义句', en: 'Listen for the defining sentence in mechanism items' },
      body: {
        zh: '第 35、36 题都先给现象再给定义：resonance 句先说波与自振频率吻合，brace 句先说 Its job is to…。题目问 why 或 what job 时，答案紧跟定义提示词 match、job、purpose 之后。',
        en: 'Items 35 and 36 first present the phenomenon, then the definition: the resonance sentence says the waves match the natural frequency, and the brace sentence begins Its job is to…. When a question asks why or what job, the answer follows words such as match, job and purpose.',
      },
    },
    {
      title: { zh: '多选题区分推荐与否定', en: 'Separate recommendations from rejected ideas' },
      body: {
        zh: '第 38–40 题三项答案按 first、second、third 依次列出；石墙、浅基础、木百叶在后面被逐项说成不利或无关。听到 no modern answer、may suffice for…、do nothing for 这类否定信号，先把对应选项划掉。',
        en: 'Items 38 to 40 list the three answers with first, second and third. Stone walls, shallow foundations and wooden shutters are later described as unhelpful or irrelevant. On signals such as no modern answer, may suffice for and do nothing for, cross out the matching option first.',
      },
    },
  ],
};
