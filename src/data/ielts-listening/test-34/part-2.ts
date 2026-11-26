import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 34 · Part 2 — 美术馆导览（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 参观顺序：馆藏起源 → 当前特展 → 地面层路线 → 教育活动 → 寄存规定（笔记 11–14）→
 * 路线首展、特展展厅、禁带物品、导览时长（单选 15–18）→ 助理与教育专员分工（配对 19–20）。
 * 开场用现场提醒，不用 welcome to。
 */
export const test34Part2: ListeningLesson = {
  slug: 'test-34-part-2',
  part: 2,
  status: 'published',
  title: { zh: '美术馆导览', en: 'Introducing an art gallery' },
  summary: {
    zh: '导览员介绍美术馆：馆藏起于二十世纪二十年代的私人捐赠，当前特展在东翼展出十九世纪肖像；地面层路线先看奠基捐赠的荷兰风景画，周六上午有儿童工作坊，外套和包存入入口寄存处，大伞和热饮不得带入展厅，标准导览四十分钟；并配对美术馆助理管寄存、教育专员办儿童工作坊。',
    en: 'The guide tours an art gallery: the collection began with a private donation, the special exhibition shows nineteenth-century portraits in the east wing, the ground floor opens with Dutch landscapes, a Saturday workshop runs for children, coats and bags go to the cloakroom, and the tour lasts forty minutes. The match pairs assistant with cloakroom and officer with workshops.',
  },
  accent: { zh: '导览员为澳式口音，节奏平稳，展厅之间有停顿。', en: 'The guide speaks with an Australian accent at a steady pace, pausing between rooms.' },
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
        { lead: 'Collection began with a private', cells: [[{ blank: 11 }, { text: ' in the nineteen twenties' }]] },
        { lead: 'Special exhibition: nineteenth-century', cells: [[{ blank: 12 }]] },
        { lead: 'Education activity: weekend', cells: [[{ blank: 13 }, { text: ' for children' }]] },
        { lead: 'Cloakroom: coats and', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What does the ground-floor route show first?',
          options: [
            { key: 'A', text: 'The Dutch landscapes from the founding gift' },
            { key: 'B', text: 'The nineteenth-century portraits' },
            { key: 'C', text: 'The sculpture from the founding collection' },
          ],
        },
        {
          number: 16,
          stem: 'Which room holds the special exhibition?',
          options: [
            { key: 'A', text: 'The sculpture hall' },
            { key: 'B', text: 'The east wing rooms' },
            { key: 'C', text: 'The small print room' },
          ],
        },
        {
          number: 17,
          stem: 'What must visitors not bring into the galleries?',
          options: [
            { key: 'A', text: 'Cameras without flash' },
            { key: 'B', text: 'Large umbrellas and hot drinks' },
            { key: 'C', text: 'Coats and bags' },
          ],
        },
        {
          number: 18,
          stem: 'How long does the guided tour last?',
          options: [
            { key: 'A', text: 'Twenty minutes' },
            { key: 'B', text: 'Forty minutes' },
            { key: 'C', text: 'One hour' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each gallery role? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'looks after the cloakroom' },
        { key: 'B', text: 'runs weekend children’s workshops' },
        { key: 'C', text: 'sells exhibition catalogues at the desk' },
        { key: 'D', text: 'cleans the picture frames' },
      ],
      items: [
        { number: 19, text: 'the gallery assistant' },
        { number: 20, text: 'the education officer' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['donation'], evidence: 1,
      explanation: {
        zh: '定位句 1：The gallery’s collection grew from a private donation given in the nineteen twenties。馆藏起于私人捐赠，填 donation。',
        en: 'Sentence 1: the collection grew from "a private donation", so fill donation.',
      },
    },
    {
      number: 12, accepted: ['portraits'], evidence: 5,
      explanation: {
        zh: '定位句 5：It brings together nineteenth-century portraits from six regional museums。特展是十九世纪肖像，填 portraits。',
        en: 'Sentence 5: the exhibition brings together "nineteenth-century portraits", so fill portraits.',
      },
    },
    {
      number: 13, accepted: ['workshop'], evidence: 10,
      explanation: {
        zh: '定位句 10：A weekend workshop for children runs each Saturday morning。周末儿童活动是工作坊，填 workshop。',
        en: 'Sentence 10: "a weekend workshop for children" runs Saturday mornings, so fill workshop.',
      },
    },
    {
      number: 14, accepted: ['bags'], evidence: 12,
      explanation: {
        zh: '定位句 12：Coats and bags go to the cloakroom near the main entrance。寄存处存外套和包，填 bags。',
        en: 'Sentence 12: "coats and bags" go to the cloakroom, so fill bags.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：It opens with the Dutch landscapes from the founding gift。地面层先看奠基捐赠的荷兰风景画，对应 A。肖像在东翼，雕塑在最后。',
        en: 'Sentence 16: the route opens with "the Dutch landscapes from the founding gift", matching A. Portraits are in the east wing, sculpture at the back.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：The east wing rooms hold the portraits and the short film。特展在东翼展厅，对应 B。雕塑厅、版画室是别处。',
        en: 'Sentence 18: "the east wing rooms hold the portraits", matching B. The sculpture hall and print room are other spaces.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：Large umbrellas and hot drinks stay outside the picture rooms。大伞和热饮不得带入，对应 B。相机可带但关闪光，外套包存入寄存处。',
        en: 'Sentence 20: "large umbrellas and hot drinks stay outside", matching B. Cameras are allowed with flash off; coats and bags go to the cloakroom.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The standard tour takes forty minutes, with a short pause in the east wing。标准导览四十分钟，对应 B。',
        en: 'Sentence 22: the standard tour "takes forty minutes", matching B.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：The gallery assistant looks after the cloakroom and checks coats at the entrance。助理管寄存处，对应 A。',
        en: 'Sentence 24: the assistant "looks after the cloakroom", matching A.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The education officer runs the weekend children’s workshops and the school talks。教育专员办儿童工作坊，对应 B。卖图录是志愿者职责。',
        en: 'Sentence 25: the education officer "runs the weekend children’s workshops", matching B. Selling catalogues is a volunteer duty.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Good afternoon, and please keep your voice down once we step into the main rooms.' },
    { speaker: 'guide', text: 'The gallery’s collection grew from a private donation given in the nineteen twenties.' },
    { speaker: 'guide', text: 'Early owners bought Dutch landscapes and quiet interior scenes.' },
    { speaker: 'guide', text: 'Over the years, the trustees added nineteenth-century British painting and sculpture.' },
    { speaker: 'guide', text: 'The current special exhibition fills the east wing through the summer.' },
    { speaker: 'guide', text: 'It brings together nineteenth-century portraits from six regional museums.' },
    { speaker: 'guide', text: 'On the ground floor, the route opens with the Dutch landscapes from the founding gift.' },
    { speaker: 'guide', text: 'Visitors pass the interiors before climbing the stairs to the east wing.' },
    { speaker: 'guide', text: 'The east wing rooms hold the portraits and a short film about the sitters.' },
    { speaker: 'guide', text: 'The sculpture hall sits at the back, next to the small print room.' },
    { speaker: 'guide', text: 'A weekend workshop for children runs each Saturday morning during the exhibition.' },
    { speaker: 'guide', text: 'In that workshop, children try charcoal sketches after a gallery portrait.' },
    { speaker: 'guide', text: 'Coats and bags go to the cloakroom near the main entrance.' },
    { speaker: 'guide', text: 'Large umbrellas and hot drinks cannot be carried into the picture rooms.' },
    { speaker: 'guide', text: 'Cameras are allowed, but flash must stay off throughout the visit.' },
    { speaker: 'guide', text: 'What does the ground-floor route show first?' },
    { speaker: 'guide', text: 'It opens with the Dutch landscapes from the founding gift.' },
    { speaker: 'guide', text: 'Which room holds the special exhibition?' },
    { speaker: 'guide', text: 'The east wing rooms hold the portraits and the short film.' },
    { speaker: 'guide', text: 'What must visitors not bring into the galleries?' },
    { speaker: 'guide', text: 'Large umbrellas and hot drinks stay outside the picture rooms.' },
    { speaker: 'guide', text: 'How long does the guided tour last?' },
    { speaker: 'guide', text: 'The standard tour takes forty minutes, with a short pause in the east wing.' },
    { speaker: 'guide', text: 'Two part-time staff keep the rooms running each day.' },
    { speaker: 'guide', text: 'The gallery assistant looks after the cloakroom and checks coats at the entrance.' },
    { speaker: 'guide', text: 'The education officer runs the weekend children’s workshops and the school talks.' },
    { speaker: 'guide', text: 'A volunteer sells exhibition catalogues at the desk near the stairs.' },
    { speaker: 'guide', text: 'The print room opens by appointment on Wednesday afternoons.' },
    { speaker: 'guide', text: 'Seating benches stand in the sculpture hall for tired visitors.' },
    { speaker: 'guide', text: 'Labels beside each picture name the artist, date and medium.' },
    { speaker: 'guide', text: 'The shop on the ground floor sells postcards and small prints.' },
    { speaker: 'guide', text: 'Water fountains sit beside the stairs on both floors.' },
    { speaker: 'guide', text: 'The lift serves every floor for visitors with limited mobility.' },
    { speaker: 'guide', text: 'Quiet study tables line the wall of the print room.' },
    { speaker: 'guide', text: 'The café overlooks the courtyard garden at the back.' },
    { speaker: 'guide', text: 'Family activity sheets are free at the front desk.' },
    { speaker: 'guide', text: 'The gallery closes at six, with last entry at half past five.' },
    { speaker: 'guide', text: 'Lectures about the portraits run on two evenings each month.' },
    { speaker: 'guide', text: 'Lost property is held at the cloakroom for two weeks.' },
    { speaker: 'guide', text: 'Please leave any comments in the book by the exit.' },
    { speaker: 'guide', text: 'The next room ahead holds the sculpture from the founding collection.' },
    { speaker: 'guide', text: 'The gallery map shows each room on a separate colour band.' },
    { speaker: 'guide', text: 'Wooden benches line the wall near the print room.' },
    { speaker: 'guide', text: 'The bookshop opens thirty minutes after the morning doors.' },
    { speaker: 'guide', text: 'Guide leaflets are free at the front desk beside the lift.' },
    { speaker: 'guide', text: 'A quiet room upstairs holds the temporary text panels.' },
    { speaker: 'guide', text: 'Restored frames carry small labels with the year of repair.' },
    { speaker: 'guide', text: 'The courtyard garden sits between the café and the print room.' },
    { speaker: 'guide', text: 'Accessible seats are marked with a blue sticker near the wall.' },
    { speaker: 'guide', text: 'The audio guide rental desk closes at half past four.' },
    { speaker: 'guide', text: 'Family trails begin at the main entrance after the welcome talk.' },
    { speaker: 'guide', text: 'The gift wrapping corner sits next to the postcard rack.' },
    { speaker: 'guide', text: 'Visitors may leave a review on the card by the exit.' },
  ],
  vocabulary: [
    {
      term: 'donation', phonetic: '/dəʊˈneɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '捐赠（藏品来源）', en: 'the gift of objects or money to the gallery' },
      usage: { zh: '可数；a private donation、the founding donation。动词 donate。', en: 'Countable: a private donation; the verb is donate.' },
      collocations: ['a private donation', 'the founding donation', 'receive a donation'],
      example: { en: 'The collection grew from a private donation.', zh: '馆藏来自一笔私人捐赠。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈneɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'portraits', phonetic: '/ˈpɔːtrɪts/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '肖像画，人物画像', en: 'pictures of individual people and their faces' },
      usage: { zh: '恒用复数；nineteenth-century portraits、a gallery portrait。', en: 'Usually plural: nineteenth-century portraits; singular portrait.' },
      collocations: ['nineteenth-century portraits', 'a gallery portrait', 'the portrait collection'],
      example: { en: 'The exhibition shows regional portraits.', zh: '特展展出各地肖像。' },
      listening: { zh: '双音节，重音在第一音节 /ˈpɔː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'workshop', phonetic: '/ˈwɜːkʃɒp/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '工作坊，动手实践课', en: 'the supervised creative activity for children' },
      usage: { zh: '可数；a weekend workshop、run a workshop。', en: 'Countable: run a workshop for children.' },
      collocations: ['a weekend workshop', 'the children’s workshop', 'run a workshop'],
      example: { en: 'The Saturday workshop teaches charcoal sketches.', zh: '周六工作坊教炭笔素描。' },
      listening: { zh: '双音节，重音在第一音节 /ˈwɜː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'cloakroom', phonetic: '/ˈkləʊkruːm/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '寄存处，衣帽存放间', en: 'the room where coats and bags are left' },
      usage: { zh: '可数；the cloakroom near the entrance、leave bags at the cloakroom。', en: 'Countable: leave bags at the cloakroom.' },
      collocations: ['the cloakroom', 'leave coats at the cloakroom', 'the cloakroom attendant'],
      example: { en: 'Coats and bags go to the cloakroom.', zh: '外套和包存入寄存处。' },
      listening: { zh: '双音节，重音在第一音节 /ˈkləʊ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'exhibition', phonetic: '/ˌeksɪˈbɪʃn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '展览，特展', en: 'the displayed show of selected works' },
      usage: { zh: '可数；the special exhibition、hold an exhibition。', en: 'Countable: hold a special exhibition.' },
      collocations: ['the special exhibition', 'the current exhibition', 'the exhibition catalogues'],
      example: { en: 'The exhibition fills the east wing.', zh: '特展占满东翼。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈbɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'sculpture', phonetic: '/ˈskʌlptʃə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '雕塑作品', en: 'the three-dimensional carved or modelled works' },
      usage: { zh: '不可数/可数；the sculpture hall、a sculpture piece。', en: 'Uncountable or countable: the sculpture hall.' },
      collocations: ['the sculpture hall', 'the sculpture collection', 'cast sculpture'],
      example: { en: 'The sculpture hall sits at the back.', zh: '雕塑厅在后部。' },
      listening: { zh: '双音节，重音在第一音节 /ˈskʌl/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'catalogues', phonetic: '/ˈkætəlɒɡz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '图录，展览画册', en: 'the printed guide sold with the exhibition' },
      usage: { zh: '可数；exhibition catalogues、the desk catalogue。', en: 'Countable: sell exhibition catalogues.' },
      collocations: ['exhibition catalogues', 'the catalogue desk', 'buy a catalogue'],
      example: { en: 'A volunteer sells catalogues at the desk.', zh: '志愿者在台处卖图录。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkæt/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'grew from', sentenceIndex: 1,
      meaning: { zh: '由……发展而来', en: 'to originate and develop out of a gift' },
      usage: { zh: '短语动词；the collection grew from a donation、grow from a small gift。', en: 'Grew from means originate from; compare develop from.' },
      example: { en: 'The collection grew from a private donation.', zh: '馆藏由私人捐赠发展起来。' },
    },
    {
      phrase: 'pass the interiors', sentenceIndex: 7,
      meaning: { zh: '经过室内场景画作区', en: 'to walk through the interior-scene rooms first' },
      usage: { zh: '动宾短语；visitors pass the interiors、pass the landscapes。', en: 'Pass here means walk past the displayed works.' },
      example: { en: 'Visitors pass the interiors before the stairs.', zh: '上楼前观众经过室内画区。' },
    },
    {
      phrase: 'runs each Saturday', sentenceIndex: 10,
      meaning: { zh: '每周六举办', en: 'to be held every Saturday morning' },
      usage: { zh: '动词短语；the workshop runs each Saturday、runs through the summer。', en: 'Runs means is scheduled; compare held each week.' },
      example: { en: 'The workshop runs each Saturday morning.', zh: '工作坊每周六上午举行。' },
    },
    {
      phrase: 'stay outside', sentenceIndex: 20,
      meaning: { zh: '留在展厅外，不得带入', en: 'to remain outside the picture rooms' },
      usage: { zh: '动词短语；umbrellas stay outside、keep drinks outside。', en: 'Stays outside means cannot be carried in.' },
      example: { en: 'Hot drinks stay outside the galleries.', zh: '热饮留在展厅外。' },
    },
    {
      phrase: 'looks after', sentenceIndex: 24,
      meaning: { zh: '照看，负责（寄存处）', en: 'to be in charge of a service area' },
      usage: { zh: '短语动词；the assistant looks after the cloakroom、look after visitors。', en: 'Looks after means manages; compare take care of.' },
      example: { en: 'The assistant looks after the cloakroom.', zh: '助理负责寄存处。' },
    },
  ],
  tips: [
    {
      title: { zh: '馆藏与特展分开记', en: 'Separate founding collection from special show' },
      body: {
        zh: '奠基捐赠是二十年代的私人收藏，含荷兰风景画；当前特展在东翼，是十九世纪肖像。听到 founding gift、regional museums 就把两条来源线分开标。',
        en: 'The founding gift is the nineteen-twenties private collection with Dutch landscapes; the current show in the east wing holds nineteenth-century portraits. Mark the two lines at founding gift and regional museums.',
      },
    },
    {
      title: { zh: '路线顺序按空间走', en: 'Follow the route by room order' },
      body: {
        zh: '地面层先荷兰风景画，再室内场景，上楼到东翼肖像，最后雕塑厅。单选题问首展和特展展厅时，别把后部雕塑厅当成东翼。',
        en: 'The ground floor opens with Dutch landscapes, then interiors, the stairs to east-wing portraits, and the sculpture hall last. For the first-work and exhibition-room questions, do not place the sculpture hall in the east wing.',
      },
    },
    {
      title: { zh: '配对按岗位职责归位', en: 'Match role to duty' },
      body: {
        zh: '助理管寄存处和外套检查；教育专员办儿童工作坊和学校讲解；卖图录是志愿者。听到 cloakroom、workshops、catalogues 就归到对应岗位。',
        en: 'The assistant handles the cloakroom and coat checks; the education officer runs workshops and school talks; a volunteer sells catalogues. Match each duty at cloakroom, workshops and catalogues.',
      },
    },
  ],
};
