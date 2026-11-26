import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 43 · Part 4 — 讲座：博物馆史（单人，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：收藏起源与私人陈列（笔记 31–34）→ 收藏动机、公共化改变与数字转向（单选 35–37）
 * → 各时期分别对应什么特征（配对 38–40）。题块顺序与录音一致。
 */
export const test43Part4: ListeningLesson = {
  slug: 'test-43-part-4',
  part: 4,
  status: 'published',
  title: { zh: '博物馆史', en: 'The history of museums' },
  summary: {
    zh: '一场关于博物馆历史的讲座：私人奇物柜如何收藏标本，公共博物馆如何向公众开放并承担教育职能，现代策展如何围绕主题叙事组织展品，以及数字档案与虚拟展厅如何扩大线上访问；并回顾收藏最初的动机、公共化带来的改变和数字转向的主要方向。',
    en: 'A lecture on museum history: how private cabinets of curiosities held specimens, how public museums opened to the general public and took on education, how modern curating groups objects by theme and narrative, and how digital records and virtual galleries widen online access. It reviews the original collecting motive, the change after going public and the aim of the digital turn.',
  },
  accent: { zh: '讲师为英式口音，术语会重复并举例说明。', en: 'The lecturer speaks with a British accent and repeats key terms with examples.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early collections were stored in private', cells: [[{ blank: 31 }]] },
        { lead: 'Museums began to admit the general', cells: [[{ blank: 32 }]] },
        { lead: 'Early curators aimed to preserve and', cells: [[{ blank: 33 }]] },
        { lead: 'Modern museums record their collections in digital', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why did private collections first form?',
          options: [
            { key: 'A', text: 'To display rare and unusual objects to a small circle.' },
            { key: 'B', text: 'To train paid curators in scientific methods.' },
            { key: 'C', text: 'To sell household goods at local fairs.' },
          ],
        },
        {
          number: 36,
          stem: 'What changed when museums went public?',
          options: [
            { key: 'A', text: 'The buildings moved to larger private estates.' },
            { key: 'B', text: 'Education became a core aim alongside preservation.' },
            { key: 'C', text: 'All admission charges were abolished forever.' },
          ],
        },
        {
          number: 37,
          stem: 'What is the digital shift mainly about?',
          options: [
            { key: 'A', text: 'Replacing physical galleries with online shops.' },
            { key: 'B', text: 'Storing collection objects in remote warehouses.' },
            { key: 'C', text: 'Opening online access to objects and their records.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which period matches each feature? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'cabinets of curiosities' },
        { key: 'B', text: 'public national museums' },
        { key: 'C', text: 'modern curated exhibitions' },
        { key: 'D', text: 'royal treasuries' },
        { key: 'E', text: 'travelling fairs' },
        { key: 'F', text: 'virtual galleries' },
      ],
      items: [
        { number: 38, text: 'objects grouped by theme and narrative' },
        { number: 39, text: 'rare specimens arranged in private rooms' },
        { number: 40, text: 'objects browsed online without a physical visit' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['cabinets'], evidence: 7,
      explanation: {
        zh: '定位句 7：Early collections were stored in private cabinets, where each specimen had its own labelled place。空前是 private，填名词 cabinets；句 5 的 chests 是并列描述，不是答案。',
        en: 'Sentence 7: "Early collections were stored in private cabinets, where each specimen had its own labelled place". Private precedes the gap, so the noun cabinets fits. Chests in sentence 5 is a parallel description, not the answer.',
      },
    },
    {
      number: 32, accepted: ['public'], evidence: 14,
      explanation: {
        zh: '定位句 14：Museums began to admit the general public, not just invited scholars。固定搭配 the general public，填 public；scholars 在句中是被对比的少数人。',
        en: 'Sentence 14: "Museums began to admit the general public, not just invited scholars". The fixed phrase is the general public, so public fits. Scholars are the small group being contrasted.',
      },
    },
    {
      number: 33, accepted: ['classify'], evidence: 17,
      explanation: {
        zh: '定位句 17：Early curators aimed to preserve and classify their holdings, sorting items by material, age and place of origin。与 preserve 并列的动词是 classify；sorting 在句中是伴随说明。',
        en: 'Sentence 17: "Early curators aimed to preserve and classify their holdings, sorting items by material, age and place of origin". The verb parallel to preserve is classify. Sorting in the sentence is a supporting description.',
      },
    },
    {
      number: 34, accepted: ['records'], evidence: 29,
      explanation: {
        zh: '定位句 29：Modern museums record their collections in digital records, so that every object can be searched and described online。空在 digital 之后，填名词 records；句 30 的 databases 是另一套并列资源。',
        en: 'Sentence 29: "Modern museums record their collections in digital records, so that every object can be searched and described online". The gap follows digital, so the noun records fits. Databases in sentence 30 are a separate parallel resource.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：Private collections began as a way to display rare and unusual objects to a small circle。展示珍奇物品给小圈子对应 A；B 的付费策展人培训和 C 的集市售卖在讲座中没有出现。',
        en: 'Sentence 36: "Private collections began as a way to display rare and unusual objects to a small circle". Displaying rare objects to a small circle matches A. Paid curator training in B and fair trading in C are never mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：Admission rules were relaxed, and education became a core aim alongside preservation and display。教育成为核心目标对应 B；A 错在建筑并未迁往私人庄园，C 的永久免费在句 15 只是有时免费。',
        en: 'Sentence 40: "Admission rules were relaxed, and education became a core aim alongside preservation and display". Education as a core aim matches B. A is wrong because buildings did not move to private estates, and C is wrong because sentence 15 says entry was sometimes free, not always.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 42,
      explanation: {
        zh: '定位句 42：The digital shift, for its part, is mainly about opening online access to the objects and their records。线上开放访问对应 C；A 的网店取代展厅与句 32 的不取代实体参观相反，B 的远程仓库没有出现。',
        en: 'Sentence 42: "The digital shift, for its part, is mainly about opening online access to the objects and their records". Online access matches C. Replacing galleries with shops in A contradicts sentence 32, and remote warehouses in B are never mentioned.',
      },
    },
    {
      number: 38, accepted: ['C'], evidence: 49,
      explanation: {
        zh: '定位句 49：Third, modern curated exhibitions. Objects are grouped by theme and narrative, with deliberate choices about what to show。按主题与叙事分组对应 modern curated exhibitions，即 C。',
        en: 'Sentence 49: "Third, modern curated exhibitions. Objects are grouped by theme and narrative, with deliberate choices about what to show". Grouping by theme and narrative matches modern curated exhibitions, C.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 47,
      explanation: {
        zh: '定位句 47：First, the cabinets of curiosities. Rare specimens were arranged in private rooms, for a small circle of invited guests。私人房间陈列珍奇标本对应 cabinets of curiosities，即 A。',
        en: 'Sentence 47: "First, the cabinets of curiosities. Rare specimens were arranged in private rooms, for a small circle of invited guests". Private rooms of rare specimens match cabinets of curiosities, A.',
      },
    },
    {
      number: 40, accepted: ['F'], evidence: 50,
      explanation: {
        zh: '定位句 50：Finally, the virtual galleries. Objects are browsed online, and a physical visit is not required to see the record。在线浏览、无需到场对应 virtual galleries，即 F。',
        en: 'Sentence 50: "Finally, the virtual galleries. Objects are browsed online, and a physical visit is not required to see the record". Browsing online without a physical visit matches virtual galleries, F.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'The earliest museums were private rooms where wealthy collectors kept rare stones, shells and strange objects behind closed doors.' },
    { speaker: 'lecturer', text: 'For most of history, collecting was a private pleasure, and the objects were shown only to invited guests.' },
    { speaker: 'lecturer', text: 'This lecture traces how those private collections grew into the public museums we know today, and how their purpose has changed.' },
    { speaker: 'lecturer', text: 'We will look at the origins of collecting, the move toward public access, the ideas behind modern curating, and the recent digital turn.' },
    { speaker: 'lecturer', text: 'Let us begin with the earliest collections, which scholars now call cabinets of curiosities.' },
    { speaker: 'lecturer', text: 'These were rooms or chests filled with natural specimens, carved objects, coins and oddities from distant lands.' },
    { speaker: 'lecturer', text: 'The owners arranged them to show the range of the natural world and the reach of their own knowledge.' },
    { speaker: 'lecturer', text: 'Early collections were stored in private cabinets, where each specimen had its own labelled place on the shelf.' },
    { speaker: 'lecturer', text: 'There was no separation between art, science and history, and a single cabinet might hold a fossil beside a painted panel.' },
    { speaker: 'lecturer', text: 'Over time, wealthy families and royal treasuries added whole rooms to hold their growing hoards.' },
    { speaker: 'lecturer', text: 'Access was limited to relatives, scholars and favoured visitors, and most people never saw any of it.' },
    { speaker: 'lecturer', text: 'The second major shift was the opening of these collections to the general public.' },
    { speaker: 'lecturer', text: 'In the eighteenth and nineteenth centuries, cities began to found national museums, paid for by public money.' },
    { speaker: 'lecturer', text: 'The old private hoards were brought out of locked rooms and placed in buildings designed for visitors.' },
    { speaker: 'lecturer', text: 'Museums began to admit the general public, not just invited scholars, though early entry rules were still strict.' },
    { speaker: 'lecturer', text: 'Admission was sometimes free, and sometimes charged by the hour, but the idea of shared access was new.' },
    { speaker: 'lecturer', text: 'Alongside access, museums took on an educational role, explaining objects to people who had never studied them.' },
    { speaker: 'lecturer', text: 'Early curators aimed to preserve and classify their holdings, sorting items by material, age and place of origin.' },
    { speaker: 'lecturer', text: 'Labels grew longer, guides were printed, and school groups began to arrive on organised visits.' },
    { speaker: 'lecturer', text: 'The public nature of the museum also changed what was collected.' },
    { speaker: 'lecturer', text: 'Objects from ordinary daily life joined royal treasures, so that visitors could see how their own society lived.' },
    { speaker: 'lecturer', text: 'The third part of our story is the rise of modern curating, which changed how objects are displayed.' },
    { speaker: 'lecturer', text: 'Where early collections piled items together, modern curators group them around a theme or a narrative.' },
    { speaker: 'lecturer', text: 'A modern exhibition does not just show objects; it tells a story about them, using text, lighting and arrangement.' },
    { speaker: 'lecturer', text: 'Curators choose what to include and what to leave out, and the same objects can mean different things in different displays.' },
    { speaker: 'lecturer', text: 'Preservation remains central, but the public experience has become a deliberate part of the design.' },
    { speaker: 'lecturer', text: 'Many museums now work with the communities their objects came from, rather than speaking for them alone.' },
    { speaker: 'lecturer', text: 'That shift has changed labels, events and the way decisions about displays are made.' },
    { speaker: 'lecturer', text: 'The fourth and most recent development is the digital turn.' },
    { speaker: 'lecturer', text: 'Modern museums record their collections in digital records, so that every object can be searched and described online.' },
    { speaker: 'lecturer', text: 'High resolution images, three dimensional scans and online databases let people study items without standing in front of the case.' },
    { speaker: 'lecturer', text: 'Virtual galleries allow visitors to browse the collection remotely, on a device at home or in a library.' },
    { speaker: 'lecturer', text: 'This does not replace the physical visit, which still offers scale, light and the presence of the real object.' },
    { speaker: 'lecturer', text: 'Instead, the digital layer widens access for people who cannot travel, and supports research that would otherwise be hard.' },
    { speaker: 'lecturer', text: 'Many institutions publish their records openly for scholars and teachers to use.' },
    { speaker: 'lecturer', text: 'Now let us consider why these collections first formed, before any public museum existed.' },
    { speaker: 'lecturer', text: 'Private collections began as a way to display rare and unusual objects to a small circle of admirers.' },
    { speaker: 'lecturer', text: 'Owners wanted to show what they had found or traded, and to signal their wealth and learning.' },
    { speaker: 'lecturer', text: 'Most items were shown off rather than systematically researched.' },
    { speaker: 'lecturer', text: 'When museums went public, what changed was not only the door.' },
    { speaker: 'lecturer', text: 'Admission rules were relaxed, and education became a core aim alongside preservation and display.' },
    { speaker: 'lecturer', text: 'The public was no longer a passive audience; visitors were expected to learn and to form their own views.' },
    { speaker: 'lecturer', text: 'The digital shift, for its part, is mainly about opening online access to the objects and their records.' },
    { speaker: 'lecturer', text: 'It is not a plan to close buildings or remove the physical galleries, but a second layer over the permanent collection.' },
    { speaker: 'lecturer', text: 'Critics note that online images lose the texture and weight of real objects.' },
    { speaker: 'lecturer', text: 'The two approaches are seen as complementary, each serving a different kind of visit.' },
    { speaker: 'lecturer', text: 'In the last part, let us match each period to the idea that defined it.' },
    { speaker: 'lecturer', text: 'First, the cabinets of curiosities. Rare specimens were arranged in private rooms, for a small circle of invited guests.' },
    { speaker: 'lecturer', text: 'Second, the public national museums. Collections were opened to shared access, with education as an explicit aim.' },
    { speaker: 'lecturer', text: 'Third, modern curated exhibitions. Objects are grouped by theme and narrative, with deliberate choices about what to show.' },
    { speaker: 'lecturer', text: 'Finally, the virtual galleries. Objects are browsed online, and a physical visit is not required to see the record.' },
    { speaker: 'lecturer', text: 'Royal treasuries held goods for a ruler, and travelling fairs sold objects to the public, but neither became our museum model.' },
    { speaker: 'lecturer', text: 'Looking back, the museum has moved from a private cabinet to a shared institution, and now to a shared online record.' },
    { speaker: 'lecturer', text: 'Each step preserved objects for later generations, while widening who could see them.' },
    { speaker: 'lecturer', text: 'The next decade will probably blur the line further between the physical building and the digital collection.' },
    { speaker: 'lecturer', text: 'New tools may allow visitors to compare objects from different cities side by side, without leaving their home.' },
    { speaker: 'lecturer', text: 'Whatever form takes shape, the core question remains what a society keeps and who may see it.' },
    { speaker: 'lecturer', text: 'Next week we will examine one collection in detail, and ask how its display choices were received by the public.' },
    { speaker: 'lecturer', text: 'That is the end of the lecture. Think about the examples as you revise.' },
  ],
  vocabulary: [
    {
      term: 'collections', phonetic: '/kəˈlekʃnz/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '藏品，收藏（博物馆或私人汇集的一组物品）', en: 'a group of objects kept together by a collector or museum' },
      usage: { zh: '可数名词复数；private collections、the museum’s collections。动词 collect。', en: 'Countable plural: private collections, the museum’s collections. The verb is collect.' },
      collocations: ['private collections', 'the museum collections', 'a public collection'],
      example: { en: 'The collections moved from locked rooms to public buildings.', zh: '藏品从锁闭的房间搬进了公共建筑。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlek/，结尾 /nz/ 轻读。', en: 'Three syllables with stress on the second and a light final /nz/.' },
    },
    {
      term: 'specimens', phonetic: '/ˈspesɪmənz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '标本（自然物样本，如矿石、贝壳、化石）', en: 'natural samples such as stones, shells or fossils kept for study' },
      usage: { zh: '可数名词复数；natural specimens、a specimen case。单数 specimen。', en: 'Countable plural: natural specimens, a specimen case. The singular is specimen.' },
      collocations: ['natural specimens', 'rare specimens', 'a specimen shelf'],
      example: { en: 'Each specimen carried its own label on the private shelf.', zh: '每件标本在私人货架上都有自己的标签。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /mənz/ 轻读。', en: 'Three syllables stressed first with a light final /mənz/.' },
    },
    {
      term: 'cabinets', phonetic: '/ˈkæbɪnəts/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '陈列柜，藏品柜（早期收藏的存放家具）', en: 'closed storage furniture with shelves for keeping specimens and objects' },
      usage: { zh: '可数名词复数；private cabinets、a glass cabinet。另有“内阁”之义。', en: 'Countable plural: private cabinets, a glass cabinet. It also means a government committee.' },
      collocations: ['private cabinets', 'a cabinet of curiosities', 'cabinet shelves'],
      example: { en: 'The cabinets held fossils beside painted panels in the early rooms.', zh: '早期房间里柜子把化石和彩绘画板放在一起。' },
      listening: { zh: '三个音节，重音在第一音节，/bɪ/ 弱读。', en: 'Three syllables stressed first; /bɪ/ is reduced.' },
    },
    {
      term: 'public', phonetic: '/ˈpʌblɪk/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '公众，大众（the general public 指全体市民）', en: 'the people in society as a group, entitled to shared access' },
      usage: { zh: 'the general public 固定搭配；public 也作形容词“公共的”。', en: 'Fixed phrase the general public; public also works as an adjective.' },
      collocations: ['the general public', 'open to the public', 'the visiting public'],
      example: { en: 'The museum opened its doors to the general public on weekends.', zh: '博物馆在周末向公众开放参观。' },
      listening: { zh: '双音节，重音在第一音节，/bl/ 辅音丛不要丢 /ə/。', en: 'Two syllables stressed first; do not add a vowel before /bl/.' },
    },
    {
      term: 'classify', phonetic: '/ˈklæsɪfaɪ/', partOfSpeech: 'v.', sentenceIndex: 17,
      meaning: { zh: '分类，归类（按材质、年代、来源整理藏品）', en: 'to sort items into groups by material, age or place of origin' },
      usage: { zh: '及物动词；classify the holdings。名词 classification。', en: 'Transitive: classify the holdings. The noun is classification.' },
      collocations: ['classify the holdings', 'classify by origin', 'classify objects'],
      example: { en: 'Early curators classify each object by material and age.', zh: '早期策展人按材质和年代给每件物品分类。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /faɪ/ 双元音。', en: 'Three syllables stressed first, ending in the diphthong /faɪ/.' },
    },
    {
      term: 'curators', phonetic: '/kjʊəˈreɪtəz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '策展人，馆藏管理者', en: 'people who care for a museum collection and decide how it is displayed' },
      usage: { zh: '可数名词复数；单数 curator。动词 curate 指“策划展览”。', en: 'Countable plural; the singular is curator. The verb curate means to plan an exhibition.' },
      collocations: ['modern curators', 'the museum curators', 'a head curator'],
      example: { en: 'Curators decide which objects enter each themed display.', zh: '策展人决定哪些展品进入每个主题陈列。' },
      listening: { zh: '重音在第二音节 /ˈreɪ/，开头 /kjʊə/ 不要漏。', en: 'Stress the second syllable; do not drop the opening /kjʊə/.' },
    },
    {
      term: 'records', phonetic: '/ˈrekədz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '档案记录（每件藏品的文字与图像资料）', en: 'the written and digital descriptions kept for every collection item' },
      usage: { zh: '可数名词复数；digital records、collection records。动词 record 重音在后。', en: 'Countable plural: digital records, collection records. The verb record stresses the second syllable.' },
      collocations: ['digital records', 'collection records', 'publish the records'],
      example: { en: 'Each online record carries an image and a short description.', zh: '每份在线档案都配有图片和简短说明。' },
      listening: { zh: '名词重音在第一音节；作动词时重音移到第二音节。', en: 'Noun stress is first; the verb shifts stress to the second syllable.' },
    },
    {
      term: 'galleries', phonetic: '/ˈɡælərɪz/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '展厅；virtual galleries 指线上虚拟展厅', en: 'rooms where objects are shown; virtual galleries are online versions of those rooms' },
      usage: { zh: '可数名词复数；art gallery、the main gallery。单数 gallery。', en: 'Countable plural: art gallery, the main gallery. The singular is gallery.' },
      collocations: ['virtual galleries', 'the museum galleries', 'a gallery guide'],
      example: { en: 'The virtual galleries let visitors browse objects from home.', zh: '虚拟展厅让访客在家就能浏览藏品。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /rɪz/ 轻读。', en: 'Three syllables stressed first with a light final /rɪz/.' },
    },
    {
      term: 'admission', phonetic: '/ədˈmɪʃn/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '入场，准入（进入博物馆的许可与规则）', en: 'the act of being allowed into a museum, and the rules governing entry' },
      usage: { zh: '不可数；admission rules、free admission。动词 admit。', en: 'Uncountable: admission rules, free admission. The verb is admit.' },
      collocations: ['admission rules', 'free admission', 'restricted admission'],
      example: { en: 'Relaxed admission rules let more visitors enter the building.', zh: '放宽的入场规则让更多访客进入建筑。' },
      listening: { zh: '双音节，重音在第二音节 /ˈmɪʃ/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'cabinets of curiosities', sentenceIndex: 4,
      meaning: { zh: '奇物柜（早期汇集珍奇标本的私人收藏柜）', en: 'early private rooms or chests holding odd specimens and rare objects' },
      usage: { zh: '历史博物馆讲座固定说法；单数 a cabinet of curiosities。', en: 'Fixed history lecture term; the singular is a cabinet of curiosities.' },
      example: { en: 'The cabinets of curiosities mixed natural objects and painted panels.', zh: '奇物柜把自然标本与彩绘画板放在一起。' },
    },
    {
      phrase: 'brought out of', sentenceIndex: 13,
      meaning: { zh: '从……中取出，搬出（藏品从密室移出）', en: 'moved something out of a closed or private place' },
      usage: { zh: '被动 be brought out of；主动形式是 bring out of。', en: 'Passive be brought out of; the active form is bring out of.' },
      example: { en: 'The hoards were brought out of locked rooms for public viewing.', zh: '藏品被搬出锁闭的房间供公众观看。' },
    },
    {
      phrase: 'admit the general public', sentenceIndex: 14,
      meaning: { zh: '向公众开放准入', en: 'to allow ordinary members of society to enter, not only guests' },
      usage: { zh: 'admit 后接人；admit visitors、admit the public。', en: 'Admit takes a person object: admit visitors, admit the public.' },
      example: { en: 'The building began to admit the general public at weekends.', zh: '这座建筑在周末开始向公众开放。' },
    },
    {
      phrase: 'around a theme', sentenceIndex: 22,
      meaning: { zh: '围绕一个主题（组织展品）', en: 'grouped so that all items serve one central subject' },
      usage: { zh: 'group objects around a theme；theme 后可接 of。', en: 'group objects around a theme; theme may take of.' },
      example: { en: 'Modern curators arrange the displays around a shared theme.', zh: '现代策展人围绕共同主题布置陈列。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 55,
      meaning: { zh: '并排地，放在一起对照', en: 'placed next to each other for direct comparison' },
      usage: { zh: '状语短语；compare objects side by side。', en: 'Adverbial: compare objects side by side.' },
      example: { en: 'Online tools may place objects from two cities side by side.', zh: '在线工具可以把两座城市的藏品并排放置对照。' },
    },
    {
      phrase: 'takes shape', sentenceIndex: 56,
      meaning: { zh: '成形，发展出具体形态', en: 'to develop a clear form or structure over time' },
      usage: { zh: '不及物；the plan takes shape、the museum takes shape。三单 takes。', en: 'Intransitive: the plan takes shape; third person takes.' },
      example: { en: 'Whatever form the next museum takes shape, its duty remains preservation.', zh: '无论下一代博物馆形成什么形态，保存藏品的职责不变。' },
    },
    {
      phrase: 'widens access', sentenceIndex: 33,
      meaning: { zh: '扩大访问范围，让更多人能用', en: 'to make something available to more people who were previously excluded' },
      usage: { zh: 'widen 后接 access；widens access for people。名词 widening。', en: 'Widen takes access: widens access for people. The noun is widening.' },
      example: { en: 'The digital layer widens access for visitors who cannot travel.', zh: '数字层为无法出行的访客扩大了访问范围。' },
    },
  ],
  tips: [
    {
      title: { zh: '预测词性再听答案', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 题空在 private 之后填名词 cabinets；第 32 题是 the general public 固定搭配；第 33 题与 preserve 并列填动词 classify；第 34 题空在 digital 之后填名词 records。听前把词性写在空格旁。',
        en: 'Item 31 follows private, so the noun cabinets fits. Item 32 is the fixed phrase the general public. Item 33 parallels preserve with the verb classify. Item 34 follows digital, so the noun records fits. Note the predicted part of speech beside each gap.',
      },
    },
    {
      title: { zh: '配对题把时期和特征对上', en: 'Match periods to features' },
      body: {
        zh: '配对题三个时期分别对应：私人房间陈列标本、主题叙事策展、线上浏览。听时抓住 private rooms、theme and narrative、browsed online 三个短语，再去对选项。',
        en: 'The three periods correspond to private specimens in rooms, themed narrative displays and online browsing. Catch private rooms, theme and narrative and browsed online before matching the options.',
      },
    },
    {
      title: { zh: '讲座结构信号词定位题块', en: 'Use lecture signposts' },
      body: {
        zh: 'The earliest collections、The second major shift、The third part、The fourth development 依次引出四个阶段；Now let us consider 进入单选；In the last part 进入配对。听到信号词就检查自己是否填到了对应题块。',
        en: 'The earliest collections, The second major shift, The third part and The fourth development introduce the four stages in order; Now let us consider opens the single-choice block; In the last part opens the matching block. Check your place on each signal word.',
      },
    },
  ],
};
