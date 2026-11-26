import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 48 · Part 4 — 荒漠化（单人讲座，英式口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：自然成因、过度放牧、灌溉问题与社区参与（笔记 31–34）→ 放牧后果、灌溉盐害与
 * 本地知识（单选 35–37）→ 放牧管控、土壤保持与本地监测的特征配对（配对 38–40）。
 * 开场用干旱谷地现象，不用 Today's lecture is about 句式。
 */
export const test48Part4: ListeningLesson = {
  slug: 'test-48-part-4',
  part: 4,
  status: 'published',
  title: { zh: '荒漠化', en: 'Desertification' },
  summary: {
    zh: '讲座从一个干旱谷地的草地消失讲起：自然起点是降雨减少，过度放牧剥去植物覆盖使表土受风侵蚀，管理不当的灌溉会抬高土壤盐分形成盐壳，恢复最终依赖本地社区参与。放牧管控把牲畜挡在脆弱地段，土壤保持重建持水结构，本地监测常年记录降雨与植被覆盖。',
    en: 'The lecture opens with grass cover lost in a dry valley: rainfall decline starts the process, over-grazing removes cover and exposes topsoil to wind, poor irrigation raises salt into a crust, and restoration depends on community participation. Grazing controls keep livestock off fragile ground, conservation rebuilds soil structure, and monitoring records rainfall and cover over seasons.',
  },
  accent: { zh: '讲者为英式口音，术语放慢，段落之间有停顿。', en: 'The lecturer speaks with a British accent, slows key terms and pauses between sections.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Main natural cause: rainfall ', cells: [[{ blank: 31 }]] },
        { lead: 'Over-grazing removes plant ', cells: [[{ blank: 32 }]] },
        { lead: 'Irrigation can raise the salt ', cells: [[{ blank: 33 }]] },
        { lead: 'Restoration depends on local ', cells: [[{ blank: 34 }, { text: ' participation' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'How does over-grazing make the land worse?',
          options: [
            { key: 'A', text: 'it leaves the topsoil exposed to wind' },
            { key: 'B', text: 'it spreads salt onto the growing leaves' },
            { key: 'C', text: 'it drains the deep water table each season' },
          ],
        },
        {
          number: 36,
          stem: 'What problem can poorly managed irrigation create?',
          options: [
            { key: 'A', text: 'a salty crust on the surface' },
            { key: 'B', text: 'richer soil after each flood' },
            { key: 'C', text: 'more grasses near the field edge' },
          ],
        },
        {
          number: 37,
          stem: 'Why must local people take part in restoration?',
          options: [
            { key: 'A', text: 'they know which plants survive the dry spells' },
            { key: 'B', text: 'they own every plot on the slope' },
            { key: 'C', text: 'they prefer crops grown outside the region' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Match each practice with its role in holding the land. Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'practice that rebuilds soil structure' },
        { key: 'B', text: 'measure that keeps livestock off fragile ground' },
        { key: 'C', text: 'activity that records rainfall over years' },
        { key: 'D', text: 'crop rotated between wet and dry plots' },
        { key: 'E', text: 'tree species chosen for deep roots' },
      ],
      items: [
        { number: 38, text: 'grazing controls' },
        { number: 39, text: 'soil conservation' },
        { number: 40, text: 'local monitoring' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['decline'], evidence: 18,
      explanation: {
        zh: '定位句 18：The main natural driver is the rainfall decline that shortens the wet season。自然主因是降雨减少，填 decline；句 3 的 dry spells 是伴随现象，不是所指成因。',
        en: 'Sentence 18: "the rainfall decline that shortens the wet season". The natural cause is rainfall decline, so write decline. Dry spells in sentence 3 are a related condition, not the cause.',
      },
    },
    {
      number: 32, accepted: ['cover'], evidence: 19,
      explanation: {
        zh: '定位句 19：Over-grazing removes the plant cover that protects the slope from wind。过度放牧剥去植物覆盖，填 cover；句 8 的 shoots 是被啃食的部位，不是空格所指。',
        en: 'Sentence 19: "Over-grazing removes the plant cover that protects the slope". The removed layer is cover, so write cover. Shoots in sentence 8 are the eaten parts, not the gap item.',
      },
    },
    {
      number: 33, accepted: ['level'], evidence: 20,
      explanation: {
        zh: '定位句 20：Unmanaged irrigation can raise the salt level in the root zone over time。灌溉抬高盐分水平，填 level；句 13 的 salty crust 是结果形态，不是空格所指。',
        en: 'Sentence 20: "irrigation can raise the salt level in the root zone". The irrigation effect is the salt level, so write level. The salty crust in sentence 13 is the resulting form.',
      },
    },
    {
      number: 34, accepted: ['community'], evidence: 21,
      explanation: {
        zh: '定位句 21：Restoration, in the end, depends on community participation from the local villages。恢复依赖社区参与，填 community；题干已给 participation。',
        en: 'Sentence 21: "Restoration, in the end, depends on community participation". The restoration basis is community, so write community. Participation is already printed in the lead.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：It leaves the topsoil exposed to wind, which carries the fine particles away in dry spells。过度放牧让表土暴露受风侵蚀，对应 A；盐溅到叶片、抽干深层地下水均未提及。',
        en: 'Sentence 24: "It leaves the topsoil exposed to wind, which carries the fine particles away". Wind exposure of topsoil matches A. Salt on leaves and draining the water table are not mentioned.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：It forms a salty crust on the surface, stopping most crops from rooting in the field。管理不当的灌溉形成表层盐壳，对应 A；土壤变肥、草更多都与原文相反。',
        en: 'Sentence 26: "It forms a salty crust on the surface, stopping most crops from rooting". The irrigation problem is the salty crust, matching A. Richer soil and more grasses contradict the text.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：They know which plants survive the dry spells, and where the old water courses used to run。本地人凭知识选出耐旱植物，对应 A；拥有全部地块、偏好外地作物均未提及。',
        en: 'Sentence 28: "They know which plants survive the dry spells". Local knowledge of dry-spell plants matches A. Owning every plot and preferring outside crops are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：Grazing controls keep livestock off the most fragile ground during the recovery years。放牧管控是把牲畜挡在脆弱地段，选 B。',
        en: 'Sentence 31: "Grazing controls keep livestock off the most fragile ground". Keeping livestock off fragile ground matches B.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：Soil conservation builds the structure that holds water and roots together。土壤保持重建土壤结构，选 A。',
        en: 'Sentence 32: "Soil conservation builds the structure that holds water and roots together". Rebuilding soil structure matches A.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：Local monitoring records the rainfall and plant cover over several seasons。本地监测常年记录降雨与植被，选 C。',
        en: 'Sentence 33: "Local monitoring records the rainfall and plant cover over several seasons". Recording rainfall over years matches C.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'One dry valley on the edge of the desert has lost most of its grass cover in a single generation.' },
    { speaker: 'lecturer', text: 'That shift from pasture to bare ground is what experts call desertification.' },
    { speaker: 'lecturer', text: 'It is not simply the desert creeping outward; it is the land itself losing the ability to hold plant life.' },
    { speaker: 'lecturer', text: 'Rainfall in these regions is unreliable, and the decline in wet years sets the starting point.' },
    { speaker: 'lecturer', text: 'When the dry spells grow longer, soils dry out and plants struggle to set seed.' },
    { speaker: 'lecturer', text: 'Wind then carries away the fine topsoil before the next rain can settle it.' },
    { speaker: 'lecturer', text: 'Human pressure speeds the process once the natural cover has weakened.' },
    { speaker: 'lecturer', text: 'Over-grazing keeps livestock on the same patch until the grass cannot recover.' },
    { speaker: 'lecturer', text: 'When animals eat the shoots down to the root, plant cover disappears from the slope.' },
    { speaker: 'lecturer', text: 'The exposed soil dries faster, and rain runs off the surface instead of soaking in.' },
    { speaker: 'lecturer', text: 'Plants that once held the slope together are replaced by bare dust and hard gravel.' },
    { speaker: 'lecturer', text: 'Irrigation is needed in some valleys to keep crops going through the dry season.' },
    { speaker: 'lecturer', text: 'Yet irrigation can raise the salt level in the soil when water evaporates too fast.' },
    { speaker: 'lecturer', text: 'A salty crust builds on the surface, and few crops can push roots through it.' },
    { speaker: 'lecturer', text: 'Poor drainage makes the problem worse, as the salts sit just under the top layer.' },
    { speaker: 'lecturer', text: 'Farmers who flood the field by hand may wash those salts deeper in wet years.' },
    { speaker: 'lecturer', text: 'We should note how these pressures connect rather than act on one cause alone.' },
    { speaker: 'lecturer', text: 'Turning to the notes that match today’s talk.' },
    { speaker: 'lecturer', text: 'The main natural driver is the rainfall decline that shortens the wet season.' },
    { speaker: 'lecturer', text: 'Over-grazing removes the plant cover that protects the slope from wind.' },
    { speaker: 'lecturer', text: 'Unmanaged irrigation can raise the salt level in the root zone over time.' },
    { speaker: 'lecturer', text: 'Restoration, in the end, depends on community participation from the local villages.' },
    { speaker: 'lecturer', text: 'Now three questions on the mechanisms behind the change.' },
    { speaker: 'lecturer', text: 'How does over-grazing make the land worse?' },
    { speaker: 'lecturer', text: 'It leaves the topsoil exposed to wind, which carries the fine particles away in dry spells.' },
    { speaker: 'lecturer', text: 'What problem can poorly managed irrigation create?' },
    { speaker: 'lecturer', text: 'It forms a salty crust on the surface, stopping most crops from rooting in the field.' },
    { speaker: 'lecturer', text: 'Why must local people take part in any restoration plan?' },
    { speaker: 'lecturer', text: 'They know which plants survive the dry spells, and where the old water courses used to run.' },
    { speaker: 'lecturer', text: 'Outside experts can bring methods, but the local knowledge decides which ones fit.' },
    { speaker: 'lecturer', text: 'We can match each practice to the role it plays in holding the land.' },
    { speaker: 'lecturer', text: 'Grazing controls keep livestock off the most fragile ground during the recovery years.' },
    { speaker: 'lecturer', text: 'Soil conservation builds the structure that holds water and roots together.' },
    { speaker: 'lecturer', text: 'Local monitoring records the rainfall and plant cover over several seasons.' },
    { speaker: 'lecturer', text: 'Rotated crops move between wet and dry plots so one patch is not worn out each year.' },
    { speaker: 'lecturer', text: 'Deep rooted tree species are chosen where the water table sits far below.' },
    { speaker: 'lecturer', text: 'Each measure addresses a different part of the degraded system.' },
    { speaker: 'lecturer', text: 'Grazing controls work directly on the animals that trample the young shoots.' },
    { speaker: 'lecturer', text: 'Soil conservation targets the bare earth where wind and rain take their toll.' },
    { speaker: 'lecturer', text: 'Local monitoring keeps the record that tells villagers whether the slope is healing.' },
    { speaker: 'lecturer', text: 'Communities meet at the seasonal gathering to review which patches recovered first.' },
    { speaker: 'lecturer', text: 'The women’s groups often keep the seed of the hardy local grasses.' },
    { speaker: 'lecturer', text: 'Those seeds are spread on the bare sections once the first rains arrive.' },
    { speaker: 'lecturer', text: 'Fences divide the recovering land from the fields still in active use.' },
    { speaker: 'lecturer', text: 'A rest year for a slope lets the grass set seed before livestock return.' },
    { speaker: 'lecturer', text: 'Drainage channels redirect runoff so water soaks into the harder ground.' },
    { speaker: 'lecturer', text: 'The watch is long term; a restored valley may take decades to hold steady.' },
    { speaker: 'lecturer', text: 'Local councils keep maps of the fields that have slid back toward desert.' },
    { speaker: 'lecturer', text: 'Schools in the region record the yearly grass cover for their own village.' },
    { speaker: 'lecturer', text: 'This shared record helps scientists compare one valley against another.' },
    { speaker: 'lecturer', text: 'The next session will look at tree planting schemes in the southern basins.' },
  ],
  vocabulary: [
    {
      term: 'decline', phonetic: '/dɪˈklaɪn/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '减少，下降（雨水量）', en: 'the fall in rainfall over the wet years' },
      usage: { zh: '可数/不可数；rainfall decline、a decline in。动词同形。', en: 'Countable or uncountable: rainfall decline. The verb shares the form.' },
      collocations: ['the rainfall decline', 'a decline in', 'the wet year decline'],
      example: { en: 'The main natural driver is the rainfall decline.', zh: '自然主因是降雨减少。' },
      listening: { zh: '双音节，重音在第二音节 /ˈklaɪ/。', en: 'Two syllables with second-syllable stress.' },
    },
    {
      term: 'cover', phonetic: '/ˈkʌvə/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '覆盖层（植被）', en: 'the plants that spread over and protect the soil' },
      usage: { zh: '不可数；plant cover、grass cover。动词同形。', en: 'Uncountable: plant cover. The verb shares the form.' },
      collocations: ['plant cover', 'grass cover', 'the natural cover'],
      example: { en: 'Over-grazing removes the plant cover from the slope.', zh: '过度放牧剥去坡上的植物覆盖。' },
      listening: { zh: '双音节，重音在第一音节 /ˈkʌ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'level', phonetic: '/ˈlevl/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '水平（盐分在土壤中的含量）', en: 'the amount of salt held in the root zone' },
      usage: { zh: '可数；salt level、water level。', en: 'Countable: salt level, water level.' },
      collocations: ['the salt level', 'raise the level', 'the root zone level'],
      example: { en: 'Irrigation can raise the salt level over time.', zh: '灌溉会逐渐抬高盐分水平。' },
      listening: { zh: '双音节，重音在第一音节，/vl/ 后不加元音。', en: 'Two syllables, first stress, no vowel after /vl/.' },
    },
    {
      term: 'community', phonetic: '/kəˈmjuːnəti/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '社区（本地村庄群体）', en: 'the local village people involved in restoration' },
      usage: { zh: '可数；local community、community participation。', en: 'Countable: local community.' },
      collocations: ['local community', 'community participation', 'the village community'],
      example: { en: 'Restoration depends on community participation.', zh: '恢复依赖社区参与。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈmjuː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'topsoil', phonetic: '/ˈtɒpsɔɪl/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '表土（表层肥沃土层）', en: 'the upper soil layer that holds roots and fine particles' },
      usage: { zh: '不可数；exposed topsoil、lose the topsoil。', en: 'Uncountable: exposed topsoil.' },
      collocations: ['the topsoil exposed', 'lose the topsoil', 'the fine topsoil'],
      example: { en: 'Grazing leaves the topsoil exposed to wind.', zh: '放牧让表土暴露在风中。' },
      listening: { zh: '复合词，重音在第一部分；/ɔɪ/ 双元音。', en: 'Compound with first-part stress; diphthong /ɔɪ/.' },
    },
    {
      term: 'crust', phonetic: '/krʌst/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '盐壳（表层硬壳）', en: 'the hard salty layer formed on the soil surface' },
      usage: { zh: '可数；salty crust、build a crust。', en: 'Countable: salty crust.' },
      collocations: ['a salty crust', 'the surface crust', 'build a crust'],
      example: { en: 'Poor irrigation forms a salty crust on the surface.', zh: '不当灌溉在表层形成盐壳。' },
      listening: { zh: '单音节，开头 /kr/ 连缀，短元音 /ʌ/。', en: 'One syllable, opening /kr/, short /ʌ/.' },
    },
    {
      term: 'plants', phonetic: '/plɑːnts/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '植物（本地耐旱种类）', en: 'the vegetation that survives the dry spells' },
      usage: { zh: '可数复数；local plants、native plants。单数 plant。', en: 'Plural countable: local plants; the singular is plant.' },
      collocations: ['which plants survive', 'the hardy plants', 'local plants'],
      example: { en: 'Locals know which plants survive the dry spells.', zh: '本地人知道哪些植物耐旱。' },
      listening: { zh: '单音节，开头 /pl/ 连缀，结尾 /nts/。', en: 'One syllable, opening /pl/, ending /nts/.' },
    },
  ],
  expressions: [
    {
      phrase: 'creeping outward', sentenceIndex: 2,
      meaning: { zh: '向外蔓延（沙漠推进）', en: 'spreading slowly beyond the original edge' },
      usage: { zh: '现在分词短语；the desert creeping outward。', en: 'Participle phrase: the desert creeping outward.' },
      example: { en: 'It is not the desert simply creeping outward.', zh: '这不只是沙漠向外蔓延。' },
    },
    {
      phrase: 'set seed', sentenceIndex: 4,
      meaning: { zh: '结籽（植物繁殖）', en: 'to produce seeds for the next generation' },
      usage: { zh: '不及物；plants set seed、the grass sets seed。', en: 'Intransitive: plants set seed.' },
      example: { en: 'Plants struggle to set seed in long dry spells.', zh: '长期干旱中植物难以结籽。' },
    },
    {
      phrase: 'runs off', sentenceIndex: 9,
      meaning: { zh: '流走（地表径流）', en: 'to flow across the surface instead of soaking in' },
      usage: { zh: '不及物；rain runs off、run off the surface。名词 runoff。', en: 'Intransitive: rain runs off. The noun is runoff.' },
      example: { en: 'Rain runs off the exposed soil instead of soaking in.', zh: '雨水从裸土表面流走，渗不进去。' },
    },
    {
      phrase: 'keep livestock off', sentenceIndex: 31,
      meaning: { zh: '让牲畜离开（脆弱地段）', en: 'to hold animals away from the recovering ground' },
      usage: { zh: '及物；keep livestock off the ground。', en: 'Transitive: keep livestock off the ground.' },
      example: { en: 'Grazing controls keep livestock off fragile ground.', zh: '放牧管控把牲畜挡在脆弱地段。' },
    },
    {
      phrase: 'take their toll', sentenceIndex: 38,
      meaning: { zh: '造成损害（风雨侵蚀）', en: 'to cause gradual damage to the bare earth' },
      usage: { zh: '固定短语；wind and rain take their toll。', en: 'Fixed phrase: wind and rain take their toll.' },
      example: { en: 'Bare earth where wind and rain take their toll.', zh: '风雨造成侵蚀的裸土。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题按成因链条记答案', en: 'Note causes along the chain' },
      body: {
        zh: '四空依次是减少、覆盖、水平、社区。听到 rainfall、natural driver 记成因 decline，plant cover、protects the slope 记覆盖，salt level、root zone 记盐分水平，community participation、local villages 记参与主体；题干已给 plant、salt、participation 等引导词，不要重复写。',
        en: 'The four blanks are decline, cover, level and community. Note the cause after rainfall or driver, the cover after plant cover or protects, the salt level after level or root zone, and the participants after community participation. Do not repeat printed leads such as plant, salt and participation.',
      },
    },
    {
      title: { zh: '单选区分机制与对应问题', en: 'Match mechanisms to their effects' },
      body: {
        zh: '第 35 题放牧后果是表土受风暴露；第 36 题灌溉问题是表层盐壳；第 37 题本地人作用是识别耐旱植物。盐溅叶片、抽干地下水、土壤变肥、草更多、拥有全部地块、偏好外地作物都是干扰项。',
        en: 'Item 35 grazing exposes topsoil to wind; item 36 irrigation forms a salty crust; item 37 locals identify dry-spell plants. Salt on leaves, draining the water table, richer soil, more grass, owning plots and outside crops are distractors.',
      },
    },
    {
      title: { zh: '配对题把措施对到作用环节', en: 'Match measures to their roles' },
      body: {
        zh: '三道配对：放牧管控对应把牲畜挡在脆弱地段；土壤保持对应重建土壤结构；本地监测对应常年记录降雨与植被。轮作地块、深根树种是未配对干扰项。听到 livestock、fragile ground 选 B，听到 structure、holds water 选 A，听到 records rainfall、seasons 选 C。',
        en: 'The three matches: grazing controls keep livestock off fragile ground; soil conservation rebuilds structure; local monitoring records rainfall and cover. Rotated plots and deep-root trees are distractors. Pick B at livestock and fragile ground, A at structure and holds water, C at records rainfall and seasons.',
      },
    },
  ],
};
