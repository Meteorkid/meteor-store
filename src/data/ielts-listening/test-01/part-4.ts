import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 1 · Part 4 — 讲座：菌丝体（mycelium）。原创仿真材料，非官方真题。
 *
 * 结构：是什么 → 有多大 → 与树的共生 → “wood wide web” 被夸大 → 材料应用 → 局限 → 优点 → 回顾与观点。
 * 笔记填空 31–36 按讲座顺序出现，多选 37–38 落在“优点”两段，单选 39–40 落在结尾的回顾与评价。
 */
export const test01Part4: ListeningLesson = {
  slug: 'test-01-part-4',
  part: 4,
  status: 'published',
  title: { zh: '菌丝体：脚下的真菌网络', en: 'Mycelium: the fungal network under your feet' },
  summary: {
    zh: '一场关于菌丝体的讲座：蘑菇只是子实体，地下菌丝如何与树木交换养分，“木维网”的说法为何被夸大，以及用菌丝体做包装和建材的前景与局限。',
    en: 'A lecture on mycelium: mushrooms are only the fruiting bodies, how underground threads trade nutrients with trees, why the "wood wide web" was exaggerated, and the promise and limits of mycelium as a material.',
  },
  accent: { zh: '美式口音的女讲师，语速偏慢，术语会重复。', en: 'A female lecturer with an American accent. She speaks slowly and repeats key terms.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Mushrooms are the', cells: [[{ blank: 31 }, { text: ' of the fungus.' }]] },
        { lead: 'The largest known living organism is a fungus in', cells: [[{ blank: 32 }, { text: '.' }]] },
        { lead: 'Trees give fungi', cells: [[{ blank: 33 }, { text: ' in exchange for water and minerals.' }]] },
        { lead: 'Some researchers say the early claims about the network were', cells: [[{ blank: 34 }, { text: '.' }]] },
        { lead: 'Mycelium packaging was first used to replace', cells: [[{ blank: 35 }, { text: '.' }]] },
        { lead: 'A weakness of mycelium products: they are easily damaged by', cells: [[{ blank: 36 }, { text: '.' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO advantages of mycelium materials does the lecturer mention? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO advantages of mycelium materials does the lecturer mention?',
      options: [
        { key: 'A', text: 'They can be produced with very little waste.' },
        { key: 'B', text: 'They are cheaper than plastic.' },
        { key: 'C', text: 'They can be grown into a wide range of shapes.' },
        { key: 'D', text: 'They are strong enough to replace concrete.' },
        { key: 'E', text: 'They last for decades without decaying.' },
        { key: 'F', text: 'They are fully waterproof.' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 39,
          stem: 'Why does the lecturer mention the fungus in Oregon at the start of the lecture?',
          options: [
            { key: 'A', text: 'To show that fungi can survive without sunlight.' },
            { key: 'B', text: 'To show how large a single fungal network can grow.' },
            { key: 'C', text: 'To show that fungi appeared earlier than animals.' },
          ],
        },
        {
          number: 40,
          stem: 'What is the lecturer’s view of the wood wide web idea?',
          options: [
            { key: 'A', text: 'It should be rejected completely.' },
            { key: 'B', text: 'It is a simplified version of something real.' },
            { key: 'C', text: 'It has been proved by recent experiments.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['fruiting bodies'], evidence: 4,
      explanation: {
        zh: '定位句 4：Mushrooms are what we call the fruiting bodies。空前是 are the，所以填名词复数；只写 body 单数不算对。',
        en: 'Sentence 4: "Mushrooms are what we call the fruiting bodies". The gap follows are the, so a plural noun is needed; a singular body does not fit.',
      },
    },
    {
      number: 32, accepted: ['Oregon'], evidence: 8,
      explanation: {
        zh: '定位句 8：a fungus that lives in Oregon, in the United States。地点专有名词，首字母大写，拼写必须准确。',
        en: 'Sentence 8: "a fungus that lives in Oregon, in the United States". A proper noun, so spell it exactly.',
      },
    },
    {
      number: 33, accepted: ['sugars', 'sugar'], evidence: 16,
      explanation: {
        zh: '定位句 16：The tree supplies the fungus with sugars, which it produces through photosynthesis。下一句 in return 才是真菌给树的东西（water and minerals），不要填反。',
        en: 'Sentence 16: "The tree supplies the fungus with sugars". The next sentence, in return, is what the fungus gives back, so do not write water or minerals here.',
      },
    },
    {
      number: 34, accepted: ['exaggerated'], evidence: 25,
      explanation: {
        zh: '定位句 25：They argued that the early claims had been exaggerated。空前是 were，填形容词或过去分词；exaggerated 拼写较长，注意双 g。',
        en: 'Sentence 25: "the early claims had been exaggerated". After were, a participle is needed. Watch the double g in exaggerated.',
      },
    },
    {
      number: 35, accepted: ['plastic', 'plastic foam'], evidence: 34,
      explanation: {
        zh: '定位句 34：a replacement for the plastic foam that protects electronics。填 plastic 或 plastic foam 都对；electronics 是被保护的东西，不是被替代的东西。',
        en: 'Sentence 34: "a replacement for the plastic foam that protects electronics". Plastic or plastic foam both fit; electronics is what is protected, not what is replaced.',
      },
    },
    {
      number: 36, accepted: ['moisture'], evidence: 40,
      explanation: {
        zh: '定位句 40：it is easily damaged by moisture, which means that it cannot yet be used outdoors。前面几个缺点分别是强度和成本，Most seriously 之后才是答案。',
        en: 'Sentence 40: "it is easily damaged by moisture". Strength and cost come earlier; the answer follows Most seriously.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 42,
      explanation: {
        zh: '定位句 42：it can be grown in a mould, so very little needs to be cut away and thrown away。几乎不需要切削，对应“浪费很少”。B 与句 39 相反（成本更高），D 与句 38 相反，E 与句 43 相反，F 与句 40 相反。',
        en: 'Sentence 42: "grown in a mould, so very little needs to be cut away and thrown away". That is very little waste. B contradicts sentence 39, D sentence 38, E sentence 43 and F sentence 40.',
      },
    },
    {
      number: 38, accepted: ['C'], evidence: 42,
      explanation: {
        zh: '定位句 42：grown in a mould；句 30–32 也说 designers grow mycelium into solid shapes，spores 和农业废料被装进模具长成所需形状。对应“能长成多种形状”。',
        en: 'Sentence 42: "grown in a mould". Sentences 30 to 32 add that designers "grow mycelium into solid shapes", packing the mixture into a mould, so it takes a wide range of shapes.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 46,
      explanation: {
        zh: '定位句 46：I began with it because I wanted you to appreciate how large a single living network can become。她直接说出了提及俄勒冈真菌的目的：说明单个网络的规模。',
        en: 'Sentence 46: "I began with it because I wanted you to appreciate how large a single living network can become". She states the purpose directly: to show the scale of one network.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 48,
      explanation: {
        zh: '定位句 48：the idea has been oversimplified rather than invented。rather than 前面是她的评价：真实存在但被过度简化。A 太绝对，C 与讲座相反。',
        en: 'Sentence 48: "the idea has been oversimplified rather than invented". Before rather than is her verdict: real, but simplified. A is too strong and C contradicts the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Good afternoon.' },
    { speaker: 'lecturer', text: 'Today I want to talk about something that is almost certainly living underneath your feet right now.' },
    { speaker: 'lecturer', text: 'It is called mycelium, and it is the part of a fungus that you almost never see.' },
    { speaker: 'lecturer', text: 'When you find a mushroom on a woodland path, you are looking at only a small part of the organism.' },
    { speaker: 'lecturer', text: 'Mushrooms are what we call the fruiting bodies.' },
    { speaker: 'lecturer', text: 'Their job is to produce and release spores, so that the fungus can reproduce.' },
    { speaker: 'lecturer', text: 'The rest of the fungus is a network of very fine threads that spreads through the soil, and that network is the mycelium.' },
    { speaker: 'lecturer', text: 'These threads are known as hyphae, and each one is far thinner than a human hair.' },
    { speaker: 'lecturer', text: 'To give you some idea of the scale, let me tell you about a fungus that lives in Oregon, in the United States.' },
    { speaker: 'lecturer', text: 'It is a species of honey fungus, and it occupies nearly ten square kilometres of forest floor.' },
    { speaker: 'lecturer', text: 'That makes it, by most measures, the largest living organism that has ever been identified.' },
    { speaker: 'lecturer', text: 'For a long time, biologists treated fungi as a kind of plant, but they are actually closer to animals.' },
    { speaker: 'lecturer', text: 'They cannot make their own food, so they have to break down other material in order to survive.' },
    { speaker: 'lecturer', text: 'Some do this by decomposing dead wood, and others form partnerships with living trees.' },
    { speaker: 'lecturer', text: 'Those partnerships are what I want to focus on for the next few minutes.' },
    { speaker: 'lecturer', text: 'In a healthy forest, the roots of most trees are wrapped in a sheath of fungal threads.' },
    { speaker: 'lecturer', text: 'The tree supplies the fungus with sugars, which it produces through photosynthesis.' },
    { speaker: 'lecturer', text: 'In return, the fungus passes water and minerals from the soil into the roots.' },
    { speaker: 'lecturer', text: 'The fungus can also extend far beyond the roots, linking one tree to another across the forest floor.' },
    { speaker: 'lecturer', text: 'This is where the story becomes famous, because a number of researchers suggested that trees use this network to share resources.' },
    { speaker: 'lecturer', text: 'A strong tree might send carbon to a weak one, or a dying tree might pass its stored sugars to its neighbours.' },
    { speaker: 'lecturer', text: 'The idea was quickly given a memorable name, the wood wide web.' },
    { speaker: 'lecturer', text: 'It appeared in documentaries and in school textbooks, and it is easy to see why it caught the public imagination.' },
    { speaker: 'lecturer', text: 'However, a group of ecologists published a review a few years ago in which they went back to the original evidence.' },
    { speaker: 'lecturer', text: 'They found that the studies had been done on a very small number of trees, often in laboratory conditions.' },
    { speaker: 'lecturer', text: 'They argued that the early claims had been exaggerated, and that there was little direct proof of trees deliberately helping each other.' },
    { speaker: 'lecturer', text: 'The fungi are certainly moving substances, but whether the trees are in control is far less clear.' },
    { speaker: 'lecturer', text: 'So the network is real, but the story we tell about it has run ahead of the data.' },
    { speaker: 'lecturer', text: 'I will come back to that idea at the end, because I think it is a useful lesson.' },
    { speaker: 'lecturer', text: 'Let us turn now to a more practical question, which is what people are doing with mycelium.' },
    { speaker: 'lecturer', text: 'Over the past fifteen years, designers have started to grow mycelium into solid shapes.' },
    { speaker: 'lecturer', text: 'They do this by mixing fungal spores with agricultural waste, such as husks or sawdust.' },
    { speaker: 'lecturer', text: 'The mixture is packed into a mould, and over a few days the threads grow through it and bind it together.' },
    { speaker: 'lecturer', text: 'The result is a light, firm material that feels a little like cork.' },
    { speaker: 'lecturer', text: 'One of the first uses was packaging, as a replacement for the plastic foam that protects electronics.' },
    { speaker: 'lecturer', text: 'Furniture companies have used it to make lampshades and panels, and some fashion houses have turned it into a leather substitute.' },
    { speaker: 'lecturer', text: 'There are now bricks and acoustic tiles made from mycelium, although these are still at an early stage.' },
    { speaker: 'lecturer', text: 'Before we get too excited, I should mention the drawbacks.' },
    { speaker: 'lecturer', text: 'The material is nowhere near as strong as concrete, so it cannot carry a load.' },
    { speaker: 'lecturer', text: 'It also costs more than the plastics it is meant to replace, because growing it takes time and space.' },
    { speaker: 'lecturer', text: 'Most seriously, it is easily damaged by moisture, which means that it cannot yet be used outdoors or in damp rooms.' },
    { speaker: 'lecturer', text: 'Having said that, two of its advantages are hard to ignore.' },
    { speaker: 'lecturer', text: 'The first is that it can be grown in a mould, so very little needs to be cut away and thrown away.' },
    { speaker: 'lecturer', text: 'The second is that it breaks down completely within a few weeks if it is left in a compost heap.' },
    { speaker: 'lecturer', text: 'No plastic can do either of those things.' },
    { speaker: 'lecturer', text: 'Let me finish by returning to the fungus in Oregon.' },
    { speaker: 'lecturer', text: 'I began with it because I wanted you to appreciate how large a single living network can become.' },
    { speaker: 'lecturer', text: 'It stretches further than any animal that has ever lived, and it has done so without a central brain.' },
    { speaker: 'lecturer', text: 'When it comes to the wood wide web, my own view is that the idea has been oversimplified rather than invented.' },
    { speaker: 'lecturer', text: 'The connections exist, and substances do travel along them.' },
    { speaker: 'lecturer', text: 'What is less certain is the purpose, and that is exactly what makes this field worth studying.' },
    { speaker: 'lecturer', text: 'Next week we will look at how these fungal partnerships might help forests cope with drought.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'mycelium', phonetic: '/maɪˈsiːliəm/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '菌丝体（真菌的营养体，由地下菌丝组成）', en: 'the mass of fine threads that makes up the body of a fungus' },
      usage: { zh: '学术讲座高频术语，不可数；复数是 mycelia。', en: 'An academic term, uncountable; the plural is mycelia.' },
      collocations: ['fungal mycelium', 'mycelium network', 'grow mycelium'],
      example: { en: 'The mycelium spreads through the top layer of the soil.', zh: '菌丝体在土壤表层蔓延。' },
      listening: { zh: '重音在第二个音节 /ˈsiː/，结尾是 /liəm/。', en: 'Stress the second syllable and listen for the ending /liəm/.' },
    },
    {
      term: 'spores', phonetic: '/spɔːz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '孢子', en: 'the tiny cells by which fungi and ferns reproduce' },
      usage: { zh: '可数名词，常与 release、produce、germinate 搭配。', en: 'Countable; often with release, produce or germinate.' },
      collocations: ['release spores', 'fungal spores', 'spores germinate'],
      example: { en: 'A single mushroom can release billions of spores in a day.', zh: '一朵蘑菇一天能释放数十亿个孢子。' },
      listening: { zh: '复数词尾 /z/ 很轻，不要误听成 spur。', en: 'The plural /z/ is soft; do not mistake it for spur.' },
    },
    {
      term: 'hyphae', phonetic: '/ˈhaɪfiː/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '菌丝（hypha 的复数）', en: 'the fine threads that form a fungal network (plural of hypha)' },
      usage: { zh: '学术术语，单数 hypha /ˈhaɪfə/，复数 hyphae。', en: 'Academic; singular hypha, plural hyphae.' },
      collocations: ['fungal hyphae', 'hyphae grow', 'a network of hyphae'],
      example: { en: 'Under the microscope, the hyphae look like thin transparent tubes.', zh: '显微镜下，菌丝像细小的透明管子。' },
      listening: { zh: '读音与 high fee 几乎相同，注意结尾是长元音 /iː/。', en: 'It sounds almost like high fee, with a long /iː/ at the end.' },
    },
    {
      term: 'sheath', phonetic: '/ʃiːθ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '鞘，护套', en: 'a close-fitting cover around something' },
      usage: { zh: '可数名词；a sheath of，引申为“包裹层”。', en: 'Countable; a sheath of something.' },
      collocations: ['a sheath of', 'a protective sheath', 'nerve sheath'],
      example: { en: 'Each root was surrounded by a sheath of fine hairs.', zh: '每条根外面都包着一层细毛。' },
      listening: { zh: '单数读 /ʃiːθ/，复数 sheathes 读 /ʃiːðz/，结尾清浊不同。', en: 'Singular ends in /θ/; the plural sheathes ends in /ðz/.' },
    },
    {
      term: 'photosynthesis', phonetic: '/ˌfəʊtəʊˈsɪnθəsɪs/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '光合作用', en: 'the process by which plants use light to make sugars' },
      usage: { zh: '生物核心术语，不可数；动词是 photosynthesise。', en: 'A core biology term, uncountable; the verb is photosynthesise.' },
      collocations: ['through photosynthesis', 'the rate of photosynthesis', 'photosynthesis and respiration'],
      example: { en: 'Without light, photosynthesis stops and the plant begins to starve.', zh: '没有光，光合作用就会停止，植物开始挨饿。' },
      listening: { zh: '五个音节，重音在第三个 /ˈsɪn/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'deliberately', phonetic: '/dɪˈlɪbərətli/', partOfSpeech: 'adv.', sentenceIndex: 25,
      meaning: { zh: '故意地，有意地', en: 'on purpose, not by accident' },
      usage: { zh: '常修饰动词；deliberately help、deliberately ignore。', en: 'Modifies a verb: deliberately help.' },
      collocations: ['deliberately avoided', 'deliberately misleading'],
      example: { en: 'She deliberately left the hardest question until the end.', zh: '她故意把最难的问题留到最后。' },
      listening: { zh: '注意与 deliberately（故意）和 liberally（大量地）区分，开头多一个 /dɪ/。', en: 'Do not confuse it with liberally; there is an extra /dɪ/ at the start.' },
    },
    {
      term: 'mould', phonetic: '/məʊld/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '模具', en: 'a hollow container used to give a shape to a liquid or soft material' },
      usage: { zh: '英式拼写 mould，美式 mold；同一词也指霉菌。', en: 'British spelling mould, American mold; the same word also means a fungal growth.' },
      collocations: ['pack into a mould', 'a mould for', 'break the mould'],
      example: { en: 'Pour the chocolate into a mould and leave it to set.', zh: '把巧克力倒进模具，静置凝固。' },
      listening: { zh: '与 mold、molded 同音，靠上下文判断是“模具”还是“霉菌”。', en: 'Mould and mold sound the same; context tells you which meaning is meant.' },
    },
    {
      term: 'acoustic', phonetic: '/əˈkuːstɪk/', partOfSpeech: 'adj.', sentenceIndex: 36,
      meaning: { zh: '声学的；隔音的', en: 'relating to sound or the control of sound' },
      usage: { zh: 'acoustic tiles、acoustic guitar；指“原声”时与 amplified 相对。', en: 'Acoustic tiles; acoustic guitar, meaning not electrically amplified.' },
      collocations: ['acoustic tiles', 'acoustic properties', 'acoustic guitar'],
      example: { en: 'The studio was lined with acoustic panels to deaden the echo.', zh: '录音室装了吸音板来消除回声。' },
      listening: { zh: '重音在第二个音节 /ˈkuː/，结尾 /stɪk/。', en: 'Stress the second syllable.' },
    },
    {
      term: 'moisture', phonetic: '/ˈmɔɪstʃə/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '潮气，水分', en: 'small amounts of water in the air or in a material' },
      usage: { zh: '不可数；damaged by moisture、retain moisture。', en: 'Uncountable: damaged by moisture.' },
      collocations: ['damaged by moisture', 'retain moisture', 'moisture in the air'],
      example: { en: 'Keep the seeds dry, as too much moisture makes them rot.', zh: '种子要保持干燥，潮气太多会让它们腐烂。' },
      listening: { zh: '英音 /ˈmɔɪstʃə/，美音常读 /ˈmɔɪstʃər/，注意与 mixer（搅拌机）区分。', en: 'British /ˈmɔɪstʃə/, American often /ˈmɔɪstʃər/; do not confuse it with mixer.' },
    },
    {
      term: 'drought', phonetic: '/draʊt/', partOfSpeech: 'n.', sentenceIndex: 51,
      meaning: { zh: '干旱（期）', en: 'a long period with little or no rain' },
      usage: { zh: '可与 flood 对举；cope with drought、a severe drought。', en: 'Often contrasted with flood: cope with drought.' },
      collocations: ['a severe drought', 'cope with drought', 'drought-resistant'],
      example: { en: 'The region has suffered its worst drought in fifty years.', zh: '该地区遭遇了五十年来最严重的干旱。' },
      listening: { zh: '与 out 押韵，读 /draʊt/，不读成 /drɔːt/。', en: 'It rhymes with out: /draʊt/, not /drɔːt/.' },
    },
  ],
  expressions: [
    {
      phrase: 'caught the public imagination', sentenceIndex: 22,
      meaning: { zh: '吸引了公众的想象力，引起大众兴趣', en: 'became widely fascinating to ordinary people' },
      usage: { zh: 'catch 的过去式和过去分词是 caught；常与 idea、story 搭配。', en: 'Catch becomes caught; often used with idea or story.' },
      example: { en: 'The plan to build a canal caught the public imagination.', zh: '修建运河的计划激发了公众的想象。' },
    },
    {
      phrase: 'run ahead of', sentenceIndex: 27,
      meaning: { zh: '走在了……前面，超前于', en: 'to move faster or further than something' },
      usage: { zh: '常用完成时 has run ahead of；宾语常是 evidence、data、reality。', en: 'Usually in the perfect: has run ahead of the evidence or the data.' },
      example: { en: 'The headlines have run ahead of what the study actually shows.', zh: '新闻标题已经超出了研究实际证明的范围。' },
    },
    {
      phrase: 'packed into', sentenceIndex: 32,
      meaning: { zh: '被装进，被塞进', en: 'pressed or fitted into a container' },
      usage: { zh: '被动形式 be packed into；主动是 pack something into。', en: 'Passive: be packed into; active: pack something into.' },
      example: { en: 'The mixture is packed into tins and sealed.', zh: '混合料被装进罐子里密封。' },
    },
    {
      phrase: 'bind it together', sentenceIndex: 32,
      meaning: { zh: '把它黏合在一起', en: 'to hold the parts of something in one piece' },
      usage: { zh: 'bind 的过去式和过去分词是 bound；bind A together。', en: 'Bind becomes bound; bind A together.' },
      example: { en: 'The resin binds the fibres together as it dries.', zh: '树脂干燥时把纤维黏在一起。' },
    },
    {
      phrase: 'nowhere near as strong as', sentenceIndex: 38,
      meaning: { zh: '远不如……坚固', en: 'much less strong than' },
      usage: { zh: 'nowhere near 加强比较，表示“差得远”；可替换形容词。', en: 'Nowhere near intensifies the comparison: much less. Swap the adjective as needed.' },
      example: { en: 'This model is nowhere near as reliable as the old one.', zh: '这个型号远不如旧款可靠。' },
    },
    {
      phrase: 'meant to replace', sentenceIndex: 39,
      meaning: { zh: '用来替代', en: 'intended to take the place of' },
      usage: { zh: 'be meant to do 表示“本应、旨在”；后接动词原形。', en: 'Be meant to do means intended to.' },
      example: { en: 'The app is meant to replace the paper forms.', zh: '这款应用旨在取代纸质表格。' },
    },
    {
      phrase: 'breaks down completely', sentenceIndex: 43,
      meaning: { zh: '完全分解', en: 'decays entirely into simpler substances' },
      usage: { zh: 'break down 在材料语境里指“分解、降解”；不可分动词短语。', en: 'Break down means to decay or decompose; it is inseparable.' },
      example: { en: 'The bag breaks down completely within a year in soil.', zh: '这种袋子在土壤里一年内完全分解。' },
    },
    {
      phrase: 'cope with', sentenceIndex: 51,
      meaning: { zh: '应对，妥善处理', en: 'to deal successfully with something difficult' },
      usage: { zh: 'cope with 后接名词或动名词；与 deal with 相近，但更强调“扛得住”。', en: 'Follow with a noun or gerund; similar to deal with but stresses enduring it.' },
      example: { en: 'Old trees cope with drought better than young ones.', zh: '老树比幼树更耐旱。' },
    },
  ],
  tips: [
    {
      title: { zh: '先读空格前后的词，预测词性', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 题空前是 are the，空后是 of the fungus，一定填名词复数；第 34 题空前是 were，填形容词或分词。听之前把预测写在空格旁，听时只等那一类词。',
        en: 'In item 31, the gap sits between are the and of the fungus, so a plural noun is required. In item 34 it follows were, so an adjective or participle is needed. Note the prediction before the recording starts.',
      },
    },
    {
      title: { zh: '跟着信号词走，别掉队', en: 'Follow the signposts' },
      body: {
        zh: 'Let us turn now to、Before we get too excited、Most seriously、Having said that 都是段落或态度的转折。雅思 Part 4 的题目顺序与讲座一致，听到信号词就检查自己是否已经填到对应的空。',
        en: 'Let us turn now to, Before we get too excited, Most seriously and Having said that all mark a new stage. Items follow the order of the lecture, so check your place whenever you hear one.',
      },
    },
    {
      title: { zh: '态度题听评价句，不听事实句', en: 'For attitude items, listen for the verdict' },
      body: {
        zh: '“木维网”的事实讲座里讲了很多，但 40 题问的是讲师的看法，答案在 my own view is 之后。rather than 结构前后往往一边是被否定的、一边是被肯定的。',
        en: 'The lecture gives many facts about the wood wide web, but item 40 asks for the lecturer’s opinion, which follows my own view is. With rather than, one side is rejected and the other endorsed.',
      },
    },
  ],
};
