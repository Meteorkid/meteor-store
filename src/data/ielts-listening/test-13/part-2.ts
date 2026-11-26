import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 13 · Part 2 — 共享单车运营人员向新用户介绍城市租借方案。原创仿真材料，非官方真题。
 *
 * 独白依次讲取车点、计费方式、App 功能、头盔规定与故障上报，
 * 后段补充还车区域、未还车计费、附近车辆数、儿童陪同与检修时限。
 */
export const test13Part2: ListeningLesson = {
  slug: 'test-13-part-2',
  part: 2,
  status: 'published',
  title: { zh: '城市共享单车介绍', en: 'Introducing a city bike-share scheme' },
  summary: {
    zh: '运营人员讲解城市共享单车：从带绿灯的停车点取车，前十五分钟免费、之后按段计费；App 显示附近停车点与车辆数、规划自行车道；成年骑手法律不强制戴头盔；出发前发现故障在 App 损坏车辆栏目上报，还车须回到同区停车点，故障车两个工作日内检修。',
    en: 'A scheme officer explains the city bike-share network: collect a bike at a green-light stand, ride the first fifteen minutes free and pay for later blocks; the App lists nearby stands and bikes; adults are not required by law to wear a helmet; pre-ride faults go to the damaged bikes section, the bike returns to a stand in the same zone, and reported machines are checked within two working days.',
  },
  accent: { zh: '说话人为英式口音。', en: 'The speaker uses a British accent.' },
  speechRate: '+0%',
  cast: [
    { id: 'speaker', label: 'SPEAKER', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'Where do you collect a bike?',
          options: [
            { key: 'A', text: 'At any stand showing a green light' },
            { key: 'B', text: 'At the central depot near the station' },
            { key: 'C', text: 'At a family stand outside town' },
          ],
        },
        {
          number: 12,
          stem: 'How are rides charged?',
          options: [
            { key: 'A', text: 'A fixed annual fee for every trip' },
            { key: 'B', text: 'Ten pence for each kilometre ridden' },
            { key: 'C', text: 'The first fifteen minutes are free, then extra blocks cost thirty pence' },
          ],
        },
        {
          number: 13,
          stem: 'What information does the App give?',
          options: [
            { key: 'A', text: 'The telephone number of the scheme team' },
            { key: 'B', text: 'Nearby stands and how many bikes they hold' },
            { key: 'C', text: 'A printed map of the cycle lanes' },
          ],
        },
        {
          number: 14,
          stem: 'What is the helmet rule for adults?',
          options: [
            { key: 'A', text: 'It is not required by law on a shared path' },
            { key: 'B', text: 'A helmet is provided at every stand' },
            { key: 'C', text: 'Helmets are banned on busy roads' },
          ],
        },
        {
          number: 15,
          stem: 'What should you do if you notice a fault before unlocking?',
          options: [
            { key: 'A', text: 'Lock the bike at the next stand' },
            { key: 'B', text: 'Report it in the App under damaged bikes' },
            { key: 'C', text: 'Take the frame code to reception' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Return the bike to a stand in the same', cells: [[{ blank: 16 }]] },
        { lead: 'Left outside the network: the ride keeps', cells: [[{ blank: 17 }]] },
        { lead: 'App shows how many nearby', cells: [[{ blank: 18 }]] },
        { lead: 'Children under twelve ride with an', cells: [[{ blank: 19 }]] },
        { lead: 'Damaged bikes inspected within two working', cells: [[{ blank: 20 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：You collect a bike from any stand with a green light。取车点是亮绿灯的任意停车点；中心车库和郊区家庭停车点都不是取车位置。',
        en: 'Sentence 2: "You collect a bike from any stand with a green light". Collection stands are those showing green; the central depot and the family stand outside town are not pick-up points.',
      },
    },
    {
      number: 12, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：The first fifteen minutes of every ride are free, and each extra fifteen minutes costs thirty pence。免费时段后按十五分钟段计费，对应 C；年费和按公里计价在原文中没有对应。',
        en: 'Sentence 5: "The first fifteen minutes of every ride are free, and each extra fifteen minutes costs thirty pence". After the free period each fifteen-minute block costs thirty pence, matching C; the annual fee and per-kilometre charges are not stated.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：the App lists the stands near your current location, along with how many bikes each one holds。App 给出附近停车点及可借车辆数；团队电话和纸质地图都不是它提供的信息。',
        en: 'Sentence 7: "the App lists the stands near your current location, along with how many bikes each one holds". The App lists nearby stands and available bike counts; neither a team phone number nor a paper map is supplied by it.',
      },
    },
    {
      number: 14, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：the law does not require an adult to wear one on a shared path。法律不强制成年骑手法；头盔不在停车点发放，繁忙道路也未禁止戴盔。',
        en: 'Sentence 10: "the law does not require an adult to wear one on a shared path". The law does not force an adult to wear one; helmets are not issued at stands, and busy roads do not ban them.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：Report it through the App under the damaged bikes section。开锁前发现故障在 App 损坏车辆栏目上报；骑到下一站上锁是途中出故障的做法，送到前台则不存在。',
        en: 'Sentence 13: "Report it through the App under the damaged bikes section". A pre-ride fault goes to the damaged bikes section in the App; locking up at the next stand applies to faults during the ride, and taking the code to reception is not a procedure here.',
      },
    },
    {
      number: 16, accepted: ['zone'], evidence: 16,
      explanation: {
        zh: '定位句 16：Every ride must end at a marked stand in the same zone as the collection point。须回到取车点所在区域的停车点；空格里填 zone。',
        en: 'Sentence 16: "Every ride must end at a marked stand in the same zone as the collection point". The bike must return to a stand in the same zone, so the gap takes zone.',
      },
    },
    {
      number: 17, accepted: ['running'], evidence: 17,
      explanation: {
        zh: '定位句 17：the charge keeps running until it reaches a stand。停在网络外时计费持续，keep 后填 running；题面已印 keeps，不要重复填 keep。',
        en: 'Sentence 17: "the charge keeps running until it reaches a stand". Outside the network the ride keeps running; after keep the gap takes running, and keep already appears in the note.',
      },
    },
    {
      number: 18, accepted: ['bikes'], evidence: 18,
      explanation: {
        zh: '定位句 18：The App also tells you how many bikes each nearby stand still holds。App 显示附近停车点仍有多少辆自行车；空格里填 bikes。',
        en: 'Sentence 18: "The App also tells you how many bikes each nearby stand still holds". The App shows how many bikes remain at each nearby stand, so the answer is bikes.',
      },
    },
    {
      number: 19, accepted: ['adult'], evidence: 19,
      explanation: {
        zh: '定位句 19：Children under twelve should always ride alongside an adult。十二岁以下儿童必须有成年人陪同；空格里填 adult。',
        en: 'Sentence 19: "Children under twelve should always ride alongside an adult". Under-twelves ride with an adult, so the gap takes adult.',
      },
    },
    {
      number: 20, accepted: ['days'], evidence: 20,
      explanation: {
        zh: '定位句 20：The scheme team inspects each reported machine within two working days。检修时限为两个工作日；空格里填 days，不要填 working 重复前缀。',
        en: 'Sentence 20: "The scheme team inspects each reported machine within two working days". Inspections happen within two working days; the gap takes days, because working already appears in the note prefix.',
      },
    },
  ],
  transcript: [
    { speaker: 'speaker', text: 'If you have just picked up one of the new hire bikes, these few notes will help you ride it back safely.' },
    { speaker: 'speaker', text: 'The scheme runs across the city centre, and the bikes belong to a network of marked parking stands.' },
    { speaker: 'speaker', text: 'You collect a bike from any stand with a green light, and each stand holds between six and twelve machines.' },
    { speaker: 'speaker', text: 'The stands are painted blue, and a small sign at the entrance shows whether bikes are available.' },
    { speaker: 'speaker', text: 'Payment works through the phone App rather than at a machine fixed to the bike.' },
    { speaker: 'speaker', text: 'The first fifteen minutes of every ride are free, and each extra fifteen minutes costs thirty pence after that.' },
    { speaker: 'speaker', text: 'You pay once at the end of the ride, and the App shows the total before you confirm the charge.' },
    { speaker: 'speaker', text: 'Before you ride, the App lists the stands near your current location, along with how many bikes each one holds.' },
    { speaker: 'speaker', text: 'It also marks the suggested cycle lanes, so you can plan the route without reading a paper map.' },
    { speaker: 'speaker', text: 'A quiet voice on the App reads out turns as you go, which helps when the helmet blocks your view of the screen.' },
    { speaker: 'speaker', text: 'Helmets are not provided at the stands, and the law does not require an adult to wear one on a shared path.' },
    { speaker: 'speaker', text: 'Even so, we strongly recommend a helmet on busy roads, and a few stands keep spare caps for short trips.' },
    { speaker: 'speaker', text: 'Children under twelve must ride with an adult, and they should use the smaller bikes near the family stands.' },
    { speaker: 'speaker', text: 'If you notice a fault before setting off, do not unlock the bike. Report it through the App under the damaged bikes section.' },
    { speaker: 'speaker', text: 'Reported faults include worn brakes, a loose basket or a bell that does not ring.' },
    { speaker: 'speaker', text: 'If the fault appears during the ride, lock the bike at the next stand and note the code on the frame.' },
    { speaker: 'speaker', text: 'Every ride must end at a marked stand in the same zone as the collection point.' },
    { speaker: 'speaker', text: 'If the bicycle is left outside the network, the charge keeps running until it reaches a stand.' },
    { speaker: 'speaker', text: 'The App also tells you how many bikes each nearby stand still holds before you set off.' },
    { speaker: 'speaker', text: 'Children under twelve should always ride alongside an adult on these shared paths.' },
    { speaker: 'speaker', text: 'The scheme team inspects each reported machine within two working days, and damaged bikes are taken off the road until repaired.' },
    { speaker: 'speaker', text: 'Please take a moment to scan the frame code before you leave, in case another rider reports the same machine.' },
    { speaker: 'speaker', text: 'Season members pay a small flat fee each year, and their rides are capped at a daily maximum.' },
    { speaker: 'speaker', text: 'Casual riders can still use the bikes by registering an email and a bank card in the App.' },
    { speaker: 'speaker', text: 'The stands close to the university fill quickly at lunchtime, so check the App before you walk over.' },
    { speaker: 'speaker', text: 'If you return a bike after nine at night, leave it at a lit stand near the main roads.' },
    { speaker: 'speaker', text: 'Riders must follow the same traffic rules as cyclists on ordinary road bikes.' },
    { speaker: 'speaker', text: 'The bike itself has a sturdy basket for bags, but it is not built for carrying another passenger.' },
    { speaker: 'speaker', text: 'Do not attach your own lock to the frame, because the machine has to be returned to the network.' },
    { speaker: 'speaker', text: 'A short guide video appears in the App the first time you register.' },
    { speaker: 'speaker', text: 'For questions about a charge, write to the scheme team through the App message page.' },
    { speaker: 'speaker', text: 'The handlebars adjust with a small lever under the seat, and you should check the height before riding.' },
    { speaker: 'speaker', text: 'Tyre pressure is checked by our team every morning, but a flat tyre after that still counts as a fault to report.' },
    { speaker: 'speaker', text: 'If you need to stop for a coffee, park in the marked stand rather than chaining the bike to a rail.' },
    { speaker: 'speaker', text: 'The network covers the riverside path, the park loop and most shopping streets in the centre.' },
    { speaker: 'speaker', text: 'Bikes cannot be taken on the trains, and the App warns you if your route crosses a bridge too narrow for cycles.' },
    { speaker: 'speaker', text: 'Season members can reserve a bike at a popular stand ten minutes ahead, though casual riders cannot.' },
    { speaker: 'speaker', text: 'After a ride ends, the App sends a short rating prompt, which helps our team keep the stands tidy.' },
    { speaker: 'speaker', text: 'Lost property found on a bike is collected weekly and kept at the main service office near the market.' },
    { speaker: 'speaker', text: 'On weekends the family stands near the park offer smaller frames and bright-coloured baskets.' },
    { speaker: 'speaker', text: 'Please keep the saddle and basket dry, and wipe wet handles before handing the machine to the next rider.' },
  ],
  vocabulary: [
    {
      term: 'scheme', phonetic: '/skiːm/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '（公共）方案，运营计划', en: 'an organised public plan to provide a service' },
      usage: { zh: '英式官方语境常用 bike-share scheme、season scheme；动词 scheme 含贬义指密谋。', en: 'Common in British public usage: a bike-share scheme, the scheme team. As a verb it can mean plot secretly.' },
      collocations: ['the scheme runs', 'join the scheme', 'a membership scheme'],
      example: { en: 'The scheme runs across the whole city centre.', zh: '这套方案覆盖整个市中心。' },
      listening: { zh: '单音节，长元音 /iː/，尾音 /m/ 闭口。', en: 'One syllable with long /iː/ and a closed final /m/.' },
    },
    {
      term: 'stand', phonetic: '/stænd/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '停车点，站点', en: 'a marked fixed place where bikes are parked' },
      usage: { zh: '此语境不是站立；parking stand、bike stand 指停车架。', en: 'Here it is not the verb to stand; a parking stand or bike stand is the rack.' },
      collocations: ['a marked stand', 'the nearest stand', 'return to a stand'],
      example: { en: 'Each stand holds between six and twelve bikes.', zh: '每个停车点可停六到十二辆。' },
      listening: { zh: '短元音 /æ/，注意不要听成 stone。', en: 'Short /æ/; do not hear it as stone.' },
    },
    {
      term: 'zone', phonetic: '/zəʊn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '区域，片区', en: 'an area of the city treated as one boundary for the service' },
      usage: { zh: 'same zone、cycle zone；交通与分区语境常用。', en: 'Same zone, cycle zone; common in transport and planning usage.' },
      collocations: ['the same zone', 'a marked zone', 'out of the zone'],
      example: { en: 'Return the bike to a stand in the same zone.', zh: '把车骑回同一片区的停车点。' },
      listening: { zh: '单音节，元音 /əʊ/，尾音 /n/。', en: 'One syllable with /əʊ/ and a final /n/.' },
    },
    {
      term: 'charge', phonetic: '/tʃɑːdʒ/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '费用，扣款', en: 'the amount paid for the ride' },
      usage: { zh: '名词：the total charge；动词：charge a fee。', en: 'Noun: the total charge; verb: charge a fee.' },
      collocations: ['a daily charge', 'confirm the charge', 'the charge keeps running'],
      example: { en: 'The App shows the total before you confirm the charge.', zh: '确认扣款前 App 会显示总额。' },
      listening: { zh: '单音节，元音 /ɑː/，尾音 /dʒ/。', en: 'One syllable with /ɑː/ and final /dʒ/.' },
    },
    {
      term: 'helmets', phonetic: '/ˈhelmɪts/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '头盔', en: 'the hard hat worn to protect the head' },
      usage: { zh: '可数；wear a helmet、provide a helmet。', en: 'Countable: wear a helmet, provide a helmet.' },
      collocations: ['wear a helmet', 'a spare helmet', 'helmet rule'],
      example: { en: 'The law does not require an adult to wear a helmet on the path.', zh: '法律不要求成年骑手法在专用道上戴头盔。' },
      listening: { zh: '双音节，重音在首音节 /ˈhelm/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'fault', phonetic: '/fɔːlt/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '故障，毛病', en: 'a defect that stops the machine working safely' },
      usage: { zh: '车务场景：report a fault、mechanical fault；on the fault 表责任。', en: 'Vehicle usage: report a fault, a mechanical fault; on the fault means to blame.' },
      collocations: ['report a fault', 'a mechanical fault', 'note a fault'],
      example: { en: 'If you notice a fault before setting off, report it in the App.', zh: '出发前发现故障请在 App 上报。' },
      listening: { zh: '单音节，/ɔː/ 加 /lt/ 辅音连缀。', en: 'One syllable with /ɔː/ and the /lt/ cluster.' },
    },
    {
      term: 'frame', phonetic: '/freɪm/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '车架，车身骨架', en: 'the metal body of the bicycle, where the code is printed' },
      usage: { zh: 'bike frame、frame code；建筑语境 frame 指框架。', en: 'A bike frame, the frame code; in buildings it means the structure.' },
      collocations: ['the frame code', 'the metal frame', 'lock the frame'],
      example: { en: 'Note the code printed on the frame when the bike fails.', zh: '车辆出问题时记下车架上的编号。' },
      listening: { zh: '双音节读成单音节 /freɪm/，元音 /eɪ/。', en: 'Pronounced as one syllable /freɪm/ with /eɪ/.' },
    },
    {
      term: 'basket', phonetic: '/ˈbɑːskɪt/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '车筐，篮子', en: 'the open container fixed to the handlebars for bags' },
      usage: { zh: '可数；a loose basket、the bike basket；购物语境也指购物篮。', en: 'Countable: a loose basket, the bike basket; in shops it is the shopping basket.' },
      collocations: ['the handlebar basket', 'a wicker basket', 'the basket holds bags'],
      example: { en: 'A loose basket is one of the faults riders report.', zh: '车筐松动是骑手上报的故障之一。' },
      listening: { zh: '双音节，英式 /ˈbɑːskɪt/，重音在前。', en: 'Two syllables, British /ˈbɑːskɪt/, stress first.' },
    },
  ],
  expressions: [
    {
      phrase: 'picked up', sentenceIndex: 0,
      meaning: { zh: '取走，领取（车辆）', en: 'to collect and take away a bike from the stand' },
      usage: { zh: 'pick up 在此是取用；也可指接人或学会技能。', en: 'Here pick up means take away; it can also mean collect a person or learn a skill.' },
      example: { en: 'If you have just picked up a hire bike, check the height first.', zh: '刚取走共享单车的话，先调好车座高度。' },
    },
    {
      phrase: 'works through', sentenceIndex: 4,
      meaning: { zh: '通过（某渠道）完成', en: 'to be handled by a particular system rather than another' },
      usage: { zh: 'work through the App；work through 还指逐步解决问题。', en: 'Work through the App; it also means deal with something step by step.' },
      example: { en: 'Payment works through the App, not a machine on the bike.', zh: '付款走 App，而不是车上的机器。' },
    },
    {
      phrase: 'keeps running', sentenceIndex: 17,
      meaning: { zh: '持续（计费）', en: 'to continue without stopping' },
      usage: { zh: 'keep 后接动名词；run 在此指计费继续走。', en: 'Keep plus gerund; here run means the billing continues.' },
      example: { en: 'The charge keeps running until the bike reaches a stand.', zh: '车辆回到停车点前计费持续。' },
    },
    {
      phrase: 'taken off the road', sentenceIndex: 20,
      meaning: { zh: '撤下停用', en: 'removed from public use until repaired' },
      usage: { zh: '车辆维修语境；off the road 指不在路面使用。', en: 'Vehicle maintenance usage; off the road means not in public service.' },
      example: { en: 'Damaged bikes are taken off the road until repaired.', zh: '故障车在修好前撤下停用。' },
    },
    {
      phrase: 'fill quickly', sentenceIndex: 24,
      meaning: { zh: '很快被占满', en: 'to become full of available-demand in a short time' },
      usage: { zh: '停车点/座位常用；fill up 是同义短语。', en: 'Used for stands and seats; fill up means the same.' },
      example: { en: 'The university stands fill quickly at lunchtime.', zh: '午餐时分大学附近停车点很快满车。' },
    },
    {
      phrase: 'attach your own lock', sentenceIndex: 28,
      meaning: { zh: '挂上自己的锁', en: 'to fix a personal lock onto the shared machine' },
      usage: { zh: 'attach 后接对象；attach a lock to the frame。', en: 'Follow attach with the object; attach a lock to the frame.' },
      example: { en: 'Do not attach your own lock to the bike frame.', zh: '不要把自己的锁挂到共享车车架上。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白先抓流程顺序', en: 'Track the service order first' },
      body: {
        zh: '本篇按取车、计费、App、头盔、故障上报、还车区域的顺序展开。题目顺序与录音一致，听到取车点先答 11 题；后段的区域、持续计费、车辆数、陪同成年人和检修日数对应 16–20 题，不要提前翻笔记填空块。',
        en: 'The monologue follows collection, charging, the App, helmets, fault reporting and return zones. Questions match this order: answer item 11 at the pick-up point, and save the later zone, running charge, bike count, adult escort and inspection days for items 16 to 20.',
      },
    },
    {
      title: { zh: '数字计费听到即记', en: 'Write down the charging figures at once' },
      body: {
        zh: '第 12 题考免费时段与单价，录音先说 fifteen minutes free，再说 thirty pence per extra block。选择题选项常把按公里、年费等方式混进来，听到数字先记在题干旁，再比对选项。',
        en: 'Item 12 tests the free period and price: fifteen minutes free, then thirty pence per extra block. Options mix in per-kilometre and annual-fee models; note the figures beside the stem before matching choices.',
      },
    },
    {
      title: { zh: '法律建议与推荐分开听', en: 'Separate the legal rule from the recommendation' },
      body: {
        zh: '第 14 题问头盔规则。录音先说法律不强制成人佩戴，再说繁忙道路强烈建议戴盔。题干问的是 law，不是建议；听到 recommend、strongly advise 时知道这是补充建议，不要误选推荐项。',
        en: 'Item 14 asks the helmet rule. The law does not force adults to wear one, though busy roads strongly recommend a helmet. The stem asks the law, not the advice; treat recommend and strongly advise as supplementary, and do not follow them into the recommendation option.',
      },
    },
  ],
};
