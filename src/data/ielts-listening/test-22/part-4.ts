import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 22 · Part 4 — 讲座：国际象棋的起源（单人独白）。原创仿真材料，非官方真题。
 *
 * 结构：开场用反问与年代数字给出总体脉络（单选 31–34）→ 早期棋盘与棋子（笔记 35）→
 * 传播路径（37）→ 中世纪文化意义（38）→ 规则定型与现代价值（39–40）。
 * 单选块在前，填空块在后，题块顺序与讲座顺序一致。
 */
export const test22Part4: ListeningLesson = {
  slug: 'test-22-part-4',
  part: 4,
  status: 'published',
  title: { zh: '国际象棋起源', en: 'The origins of chess' },
  summary: {
    zh: '一场追溯国际象棋历史的讲座：最早的雏形出现于印度，原名 chaturanga，棋盘八行八列、以国王为军棋核心；规则在西传过程中棋子走法更自由，游戏经波斯、阿拉伯世界与地中海贸易路线进入欧洲，中世纪与骑士精神相联，现代规则在十五世纪定型，至今训练战略思维。',
    en: 'A lecture on chess history: its earliest ancestor appeared in India as chaturanga, on an eight by eight board with the king as leader. As it spread west the pieces moved more freely; it reached Europe through Persia, Arab courts and Mediterranean trade routes, linked to medieval chivalry, settled in the fifteenth century, and still trains strategic thinking.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，历史名称会放慢重复。', en: 'The lecturer speaks with an American accent at a steady pace, repeating historical names clearly.' },
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
          stem: 'Where did the earliest ancestor of chess first appear?',
          options: [
            { key: 'A', text: 'India' },
            { key: 'B', text: 'Persia' },
            { key: 'C', text: 'Spain' },
          ],
        },
        {
          number: 32,
          stem: 'What was the original game called?',
          options: [
            { key: 'A', text: 'chivalry' },
            { key: 'B', text: 'chaturanga' },
            { key: 'C', text: 'shatranj' },
          ],
        },
        {
          number: 33,
          stem: 'Why did the game spread along the trade routes?',
          options: [
            { key: 'A', text: 'Soldiers carried it between military camps.' },
            { key: 'B', text: 'Merchants brought it from one port city to another.' },
            { key: 'C', text: 'Churches ordered board games for their halls.' },
          ],
        },
        {
          number: 34,
          stem: 'How did the rules change as the game spread?',
          options: [
            { key: 'A', text: 'The pieces moved more slowly than before.' },
            { key: 'B', text: 'The pieces were allowed to move more freely.' },
            { key: 'C', text: 'Some pieces were removed from the board.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Original board: eight rows and eight', cells: [[{ blank: 35 }]] },
        { lead: 'Army leader piece was the', cells: [[{ blank: 36 }]] },
        { lead: 'The game reached Europe through the', cells: [[{ blank: 37 }]] },
        { lead: 'Medieval Europe linked chess to the code of', cells: [[{ blank: 38 }]] },
        { lead: 'Modern rules settled in the', cells: [[{ blank: 39 }, { text: ' century.' }]] },
        { lead: 'Chess teaches strategic', cells: [[{ blank: 40 }, { text: '.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：We begin in India, where the earliest ancestor of chess appears in texts。最早雏形出现于印度，对应 A。波斯是西传后的第一站，西班牙是进入欧洲后的地点，均非起源地。',
        en: 'Sentence 2: "We begin in India, where the earliest ancestor of chess appears in texts". The earliest ancestor appeared in India, matching A. Persia was the first stop westward and Spain a later European entry point, neither the origin.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：Historians call the original game chaturanga, a word that described the four divisions of the army。原名是 chaturanga，对应 B。chivalry 是中世纪骑士精神，shatranj 是波斯变体名称，均被干扰。',
        en: 'Sentence 4: "Historians call the original game chaturanga, a word that described the four divisions of the army". The original name was chaturanga, matching B. Chivalry is the medieval code and shatranj the Persian variant, both distractors.',
      },
    },
    {
      number: 33, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：merchants set up tables in ports, and a game played on board could be passed from city to city。商人在港口推广并把游戏带到各城，对应 B。A 的军营士兵与 C 的教堂订购在录音中均无依据。',
        en: 'Sentence 15: "merchants set up tables in ports, and a game played on board could be passed from city to city". Merchants carried the game between port cities, matching B. Soldiers in camps and church orders for games have no basis in the recording.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：These freer movements made the games shorter and sharper。西传后棋子走法更自由，对应 B。A 与 freer 相反，C 的删子在讲座中没有出现。',
        en: 'Sentence 18: "These freer movements made the games shorter and sharper". The pieces moved more freely, matching B. A contradicts freer, and removing pieces is never mentioned.',
      },
    },
    {
      number: 35, accepted: ['columns'], evidence: 26,
      explanation: {
        zh: '定位句 26：The original board had eight rows and eight columns, forming sixty four squares。棋盘八行八列，空前已印 eight rows and eight，填 columns。',
        en: 'Sentence 26: "The original board had eight rows and eight columns, forming sixty four squares". The board has eight rows and eight columns; eight rows and eight is already printed, so write columns.',
      },
    },
    {
      number: 36, accepted: ['king'], evidence: 28,
      explanation: {
        zh: '定位句 28：The army leader piece was the king, placed in the central square at the back。代表军队首领的棋子是国王；句 29 的 general 是后来演变为王后的棋子，不能填。',
        en: 'Sentence 28: "The army leader piece was the king, placed in the central square at the back". The leader piece is the king; the general in sentence 29 later became the queen, so it is not the answer.',
      },
    },
    {
      number: 37, accepted: ['Mediterranean'], evidence: 34,
      explanation: {
        zh: '定位句 34：The game moved west through Persia and the Arab courts before reaching the Mediterranean ports。游戏经地中海港口进入欧洲，填 Mediterranean；Persia 与 Arab courts 是途经的中间阶段。',
        en: 'Sentence 34: "The game moved west through Persia and the Arab courts before reaching the Mediterranean ports". It entered Europe through Mediterranean ports; Persia and the Arab courts are intermediate stops.',
      },
    },
    {
      number: 38, accepted: ['chivalry'], evidence: 37,
      explanation: {
        zh: '定位句 37：In medieval society the game sat close to the ideals of chivalry, with honour and restraint expected at the table。中世纪把棋赛与骑士精神准则相联，填 chivalry。',
        en: 'Sentence 37: "In medieval society the game sat close to the ideals of chivalry, with honour and restraint expected at the table". Medieval Europe linked chess to the code of chivalry, so write chivalry.',
      },
    },
    {
      number: 39, accepted: ['fifteenth'], evidence: 39,
      explanation: {
        zh: '定位句 39：By the fifteenth century the modern outline was in place, and the pieces moved as they do in standard play today。现代规则在十五世纪定型，填序数词 fifteenth。',
        en: 'Sentence 39: "By the fifteenth century the modern outline was in place, and the pieces moved as they do in standard play today". The modern rules settled in the fifteenth century, so write the ordinal fifteenth.',
      },
    },
    {
      number: 40, accepted: ['thinking'], evidence: 40,
      explanation: {
        zh: '定位句 40：chess teaches strategic thinking rather than a fixed sequence of moves。棋赛训练的是战略思维，空前是 strategic，填 thinking。',
        en: 'Sentence 40: "chess teaches strategic thinking rather than a fixed sequence of moves". Chess trains strategic thinking; strategic already precedes the gap, so write thinking.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How many moves can you recall from a single game of chess? Most players can list only a few, yet the game behind those moves is more than fifteen hundred years old.' },
    { speaker: 'lecturer', text: 'This lecture traces where that game began, how its rules changed, and what it meant to the societies that adopted it.' },
    { speaker: 'lecturer', text: 'We begin in India, where the earliest ancestor of chess appears in texts from the early centuries after the common era.' },
    { speaker: 'lecturer', text: 'That game was played on a square board divided into rows and columns, and it represented a royal army in battle.' },
    { speaker: 'lecturer', text: 'Historians call the original game chaturanga, a word that described the four divisions of the army.' },
    { speaker: 'lecturer', text: 'Each division had its own piece, mirroring the soldiers, horses, elephants and chariots of the period.' },
    { speaker: 'lecturer', text: 'The board then had eight rows and eight columns, the same arrangement players still recognise today.' },
    { speaker: 'lecturer', text: 'The piece representing the army leader was the king, and beside him stood the general piece that later became the queen.' },
    { speaker: 'lecturer', text: 'The king could not leave the board under any attack, just as in the modern game.' },
    { speaker: 'lecturer', text: 'In those early rules the pieces moved more slowly than they do now, and the game ended when the leader was cornered.' },
    { speaker: 'lecturer', text: 'From India the game travelled westward with traders and invading armies, settling first in Persia.' },
    { speaker: 'lecturer', text: 'In Persia it took a new name, and players kept the board and the main pieces while adjusting how each one moved.' },
    { speaker: 'lecturer', text: 'Persian poets wrote about the game as a battle of the mind.' },
    { speaker: 'lecturer', text: 'It crossed into the Arab world after the early Islamic conquests, where scholars studied the game as a test of foresight.' },
    { speaker: 'lecturer', text: 'Chess then reached Europe through the Mediterranean, carried by merchants between ports and by returning crusaders.' },
    { speaker: 'lecturer', text: 'The trade routes mattered because merchants set up tables in ports, and a game played on board could be passed from city to city.' },
    { speaker: 'lecturer', text: 'Once in Europe, the rules changed again, particularly in how the strongest pieces could travel.' },
    { speaker: 'lecturer', text: 'The general piece gained a longer diagonal move, and over time it became the most powerful piece on the board.' },
    { speaker: 'lecturer', text: 'These freer movements made the games shorter and sharper, and they attracted players across the social ranks.' },
    { speaker: 'lecturer', text: 'A single opening could decide the shape of the whole match.' },
    { speaker: 'lecturer', text: 'In medieval Europe chess was linked to the code of chivalry, because a knight had to plan ahead, defend his side and respect his opponent.' },
    { speaker: 'lecturer', text: 'Manuals for nobles described good manners and fair play beside the rules of the board.' },
    { speaker: 'lecturer', text: 'The modern rules that most players know were settled in the fifteenth century, when the queen and the bishop reached their present forms.' },
    { speaker: 'lecturer', text: 'After that point the game changed little in its basic shape, even as printing spread the manuals more widely.' },
    { speaker: 'lecturer', text: 'Manuals in verse explained each piece’s duty to the player.' },
    { speaker: 'lecturer', text: 'Let us now look more closely at the early board and its pieces.' },
    { speaker: 'lecturer', text: 'The original board had eight rows and eight columns, forming sixty four squares in total.' },
    { speaker: 'lecturer', text: 'Each side began with the same arrangement, mirrored across the middle line of the board.' },
    { speaker: 'lecturer', text: 'The army leader piece was the king, placed in the central square at the back of his side.' },
    { speaker: 'lecturer', text: 'The piece beside him was the general, which later European versions renamed the queen.' },
    { speaker: 'lecturer', text: 'Horses on the board stood for the cavalry, and they kept their familiar jump in nearly every version.' },
    { speaker: 'lecturer', text: 'Elephants in the early game later became the bishop, and their path across the square changed with the new rules.' },
    { speaker: 'lecturer', text: 'The elephant’s two step move remained in some eastern variants of the game.' },
    { speaker: 'lecturer', text: 'Chariots evolved into the rooks that guard the corners today.' },
    { speaker: 'lecturer', text: 'The game moved west through Persia and the Arab courts before reaching the Mediterranean ports.' },
    { speaker: 'lecturer', text: 'From those ports it entered Spain and Italy, then spread northward through France and the German lands.' },
    { speaker: 'lecturer', text: 'Merchants helped this spread because the board was light to carry and the rules could be explained in a few matches.' },
    { speaker: 'lecturer', text: 'In medieval society the game sat close to the ideals of chivalry, with honour and restraint expected at the table.' },
    { speaker: 'lecturer', text: 'A player who cheated or lost temper was said to fail the code the game taught.' },
    { speaker: 'lecturer', text: 'By the fifteenth century the modern outline was in place, and the pieces moved as they do in standard play today.' },
    { speaker: 'lecturer', text: 'One reason the game lasted so long is that chess teaches strategic thinking rather than a fixed sequence of moves.' },
    { speaker: 'lecturer', text: 'Players must weigh attacks, protect their weaker pieces and plan several turns ahead.' },
    { speaker: 'lecturer', text: 'That training transfers to planning in business, law and military strategy, which is why rulers kept chess courts in their palaces.' },
    { speaker: 'lecturer', text: 'Palace records show rulers inviting strong players to their tables.' },
    { speaker: 'lecturer', text: 'The game also survived because its social rules were clear. Players shake hands before play, speak politely during the match, and acknowledge the winner.' },
    { speaker: 'lecturer', text: 'We should not imagine that every society played the same version.' },
    { speaker: 'lecturer', text: 'Early boards differed in the names given to pieces, and some regions preferred shorter or longer games.' },
    { speaker: 'lecturer', text: 'Some variants left out the queen piece entirely.' },
    { speaker: 'lecturer', text: 'Modern international chess absorbed most of these local variations into one standard set of rules.' },
    { speaker: 'lecturer', text: 'Looking back, the long history shows a game that carried ideas about warfare, honour and reason across continents.' },
    { speaker: 'lecturer', text: 'The next lecture will compare chess with the board games that emerged in East Asia at a similar time.' },
    { speaker: 'lecturer', text: 'For now, remember that the rules you move today were refined over more than a thousand years.' },
    { speaker: 'lecturer', text: 'That brings today’s session to a close. I appreciate your attention.' },
  ],
  vocabulary: [
    {
      term: 'ancestor', phonetic: '/ˈænsestə/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '雏形，前身（更早的同类事物）', en: 'the early form from which a later thing developed' },
      usage: { zh: '可数名词；the ancestor of chess、the ancestor of modern tools。', en: 'Countable: the ancestor of chess, the ancestor of modern tools.' },
      collocations: ['the ancestor of', 'an early ancestor', 'the direct ancestor'],
      example: { en: 'The earliest ancestor of chess appears in early Indian texts.', zh: '国际象棋最早的雏形见于印度早期文献。' },
      listening: { zh: '三个音节，重音在第一个；/k/ 后接 /s/。', en: 'Three syllables with first-syllable stress; /k/ before /s/.' },
    },
    {
      term: 'chaturanga', phonetic: '/ˌtʃætʃəˈrʌŋɡə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '恰图兰卡（象棋古名）', en: 'the ancient Indian board game regarded as chess’s earliest form' },
      usage: { zh: '专有名词，首字母可大写；the original game chaturanga。', en: 'Proper noun, often capitalised: the original game chaturanga.' },
      collocations: ['the game chaturanga', 'ancient chaturanga'],
      example: { en: 'Historians call the original game chaturanga.', zh: '历史学家把最初的游戏称为恰图兰卡。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈrʌŋ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'columns', phonetic: '/ˈkɒləmz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '（棋盘的）竖列', en: 'the vertical lines of squares on a board' },
      usage: { zh: '复数名词；rows and columns、eight columns。单数 column。', en: 'Plural: rows and columns, eight columns. The singular is column.' },
      collocations: ['rows and columns', 'eight columns', 'the board columns'],
      example: { en: 'The original board had eight rows and eight columns.', zh: '最早的棋盘有八行八列。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /mz/。', en: 'Two syllables with first-syllable stress; the ending /mz/.' },
    },
    {
      term: 'general', phonetic: '/ˈdʒenrəl/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '（古棋中的）将军棋子', en: 'the early piece beside the king that later became the queen' },
      usage: { zh: '此处指棋子，不是军衔；the general piece、the general beside the king。', en: 'Here it is a piece, not a rank: the general piece, the general beside the king.' },
      collocations: ['the general piece', 'the general beside the king'],
      example: { en: 'The general later became the queen in European versions.', zh: '这枚将军棋子后来在欧洲版本中演变为王后。' },
      listening: { zh: '两个音节，重音在第一个；/dʒen/ 读清楚。', en: 'Two syllables with first-syllable stress; listen for /dʒen/.' },
    },
    {
      term: 'Mediterranean', phonetic: '/ˌmedɪtəˈreɪniən/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '地中海（地区）', en: 'the sea and coastal region between Europe and North Africa' },
      usage: { zh: '专有名词；the Mediterranean ports、across the Mediterranean。', en: 'Proper noun: the Mediterranean ports, across the Mediterranean.' },
      collocations: ['the Mediterranean ports', 'the Mediterranean Sea', 'across the Mediterranean'],
      example: { en: 'The game reached Europe through the Mediterranean ports.', zh: '游戏经地中海港口传入欧洲。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈreɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'chivalry', phonetic: '/ˈʃɪvəlri/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '骑士精神，骑士准则', en: 'the medieval code of honour, restraint and loyalty' },
      usage: { zh: '不可数；the code of chivalry、ideals of chivalry。', en: 'Uncountable: the code of chivalry, ideals of chivalry.' },
      collocations: ['the code of chivalry', 'ideals of chivalry', 'medieval chivalry'],
      example: { en: 'The game sat close to the ideals of chivalry.', zh: '棋赛与骑士精神的理想紧密相连。' },
      listening: { zh: '三个音节，重音在第一个；/ʃɪ/ 开头。', en: 'Three syllables with first-syllable stress; the opening /ʃɪ/.' },
    },
    {
      term: 'rooks', phonetic: '/rʊks/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '车（国际象棋棋子）', en: 'the corner piece that moves in straight lines' },
      usage: { zh: '复数名词；单数 rook。guard the corners 指车守角。', en: 'Plural; the singular is rook. Guard the corners describes the rooks.' },
      collocations: ['the rooks', 'a rook', 'the corner rooks'],
      example: { en: 'Chariots evolved into the rooks that guard the corners.', zh: '战车演变为守角的车。' },
      listening: { zh: '单音节，元音 /ʊ/，结尾 /ks/。', en: 'One syllable with /ʊ/ and the ending /ks/.' },
    },
    {
      term: 'strategic', phonetic: '/strəˈtiːdʒɪk/', partOfSpeech: 'adj.', sentenceIndex: 40,
      meaning: { zh: '战略的，全局谋划的', en: 'relating to long term planning rather than a single move' },
      usage: { zh: '可作定语；strategic thinking、strategic planning。名词 strategy。', en: 'Attributive: strategic thinking, strategic planning. The noun is strategy.' },
      collocations: ['strategic thinking', 'strategic planning', 'strategic moves'],
      example: { en: 'Chess teaches strategic thinking rather than fixed moves.', zh: '棋赛训练的是战略思维，而非固定走法。' },
      listening: { zh: '重音在第二音节 /ˈtiː/；开头 /str/ 连在一起。', en: 'Stress the second syllable; the opening /str/ clusters together.' },
    },
  ],
  expressions: [
    {
      phrase: 'set up tables', sentenceIndex: 15,
      meaning: { zh: '摆开棋桌（在港口公开对局）', en: 'to place boards and tables where travellers could play' },
      usage: { zh: 'set up 后接 tables、stalls；set up tables in ports。', en: 'Set up takes tables or stalls: set up tables in ports.' },
      example: { en: 'Merchants set up tables in ports between voyages.', zh: '商人在港口航线之间摆开棋桌。' },
    },
    {
      phrase: 'passed from city to city', sentenceIndex: 15,
      meaning: { zh: '逐城流传开来', en: 'carried and shared between one town and the next' },
      usage: { zh: 'pass something from A to B；from city to city 表地点链条。', en: 'Pass something from A to B; from city to city marks a chain of places.' },
      example: { en: 'The game could be passed from city to city along the routes.', zh: '游戏沿路线逐城流传。' },
    },
    {
      phrase: 'plan ahead', sentenceIndex: 20,
      meaning: { zh: '提前谋划，走一步看几步', en: 'to think several moves or steps in advance' },
      usage: { zh: '动词短语；plan ahead、plan several turns ahead。', en: 'Phrasal verb: plan ahead, plan several turns ahead.' },
      example: { en: 'A knight had to plan ahead and defend his side.', zh: '骑士必须提前谋划并守住己方。' },
    },
    {
      phrase: 'in place', sentenceIndex: 39,
      meaning: { zh: '定型，确立到位', en: 'established and settled in its final form' },
      usage: { zh: '表示定型到位；be in place，如 the outline was in place、rules in place。', en: 'Be in place: the outline was in place, rules in place.' },
      example: { en: 'By the fifteenth century the modern outline was in place.', zh: '到十五世纪现代框架已经定型。' },
    },
    {
      phrase: 'standard set of rules', sentenceIndex: 48,
      meaning: { zh: '一套标准规则', en: 'one uniform rule system adopted by international play' },
      usage: { zh: 'absorb something into a standard set of rules；被动 be absorbed into。', en: 'Absorb something into a standard set of rules; passive be absorbed into.' },
      example: { en: 'Local variations were absorbed into one standard set of rules.', zh: '各地变体被吸收进一套标准规则。' },
    },
    {
      phrase: 'shake hands', sentenceIndex: 44,
      meaning: { zh: '握手（对局前后礼节）', en: 'to greet or finish a match with a handshake' },
      usage: { zh: '指对局前后握手礼节；shake hands before play、shake hands with the opponent。', en: 'Shake hands before play, shake hands with the opponent.' },
      example: { en: 'Players shake hands before the match and acknowledge the winner.', zh: '棋手赛前握手，并向胜者致意。' },
    },
  ],
  tips: [
    {
      title: { zh: '概览段先答单选，细节段再填笔记', en: 'Overview feeds the choices, details feed the notes' },
      body: {
        zh: '第 31–34 题的答案都在开头概览段：起源地、原名、规则变化、传播原因。第 35–40 题的棋盘列数、棋子名称、路线与世纪在后面的细节段；不要在概览段回头找填空术语。',
        en: 'Items 31 to 34 sit in the opening overview: origin, original name, rule changes and spread. The columns, piece names, route and century for items 35 to 40 appear in the later detail section. Do not hunt for note terms during the overview.',
      },
    },
    {
      title: { zh: '棋子演化链别填混', en: 'Keep the piece evolution straight' },
      body: {
        zh: '第 36 题问军队首领棋子，答案 king；句 29 的 general 是后来演变为王后的棋子。录音按 king、general、horse、elephant、chariot 的顺序讲演化，听到棋子名先标注它在链上的位置。',
        en: 'Item 36 asks the leader piece: king. The general in sentence 29 later became the queen. The talk follows king, general, horse, elephant and chariot; mark each piece’s place in that evolution chain as you hear it.',
      },
    },
    {
      title: { zh: '地名排序对应传播路径', en: 'Place names follow the spread' },
      body: {
        zh: '第 37 题问进入欧洲的通道，答案 Mediterranean；India、Persia、Arab courts 是更早的途经点。讲座按自东向西的顺序报地名，听到港口与城市名时在题旁画出路线，避免把途经点当成终点。',
        en: 'Item 37 asks the entry route to Europe: Mediterranean. India, Persia and the Arab courts are earlier stops. The lecture names places east to west; sketch the route beside the item so intermediate stops are not written as the destination.',
      },
    },
  ],
};
