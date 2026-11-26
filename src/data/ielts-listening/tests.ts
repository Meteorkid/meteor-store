import type { ListeningTest } from '@/lib/ielts-listening/types';

/**
 * 听力套题的分组信息。每个 Part 的内容在各自目录下（test-01/part-1.ts …），
 * 由 `src/data/ielts-listening/index.ts` 汇总。
 *
 * 全部是原创的雅思风格仿真材料，不是剑桥真题；页面与文档都按这个口径表述。
 */
export const listeningTests: ListeningTest[] = [
  {
    slug: 'test-01',
    title: { zh: '模拟测试 1', en: 'Practice Test 1' },
    description: {
      zh: '四段完整的原创仿真材料，按雅思听力 Part 1–4 的场景与难度递进：生活对话、独白介绍、学术讨论、学术讲座。',
      en: 'Four original practice parts that follow the IELTS Listening format and difficulty curve: an everyday conversation, a monologue, an academic discussion and an academic lecture.',
    },
    sortOrder: 1,
  },
  {
    slug: 'test-02',
    title: { zh: '模拟测试 2', en: 'Practice Test 2' },
    description: {
      zh: '场景与第一套完全不同的另一组四段材料，适合在做过第一套之后检验方法是否真的掌握。',
      en: 'A second set of four parts on entirely different topics, useful for checking that what you learned from the first set actually transfers.',
    },
    sortOrder: 2,
  },
  {
    slug: 'test-03',
    title: { zh: '模拟测试 3', en: 'Practice Test 3' },
    description: {
      zh: '四段原创仿真材料：健身房入会咨询、回收中心参观导览、小组课题：街头食品卫生、火山：识别预警信号，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Enrolling at a fitness centre, A tour of the recycling centre, Planning a group project on street-food hygiene and Volcanoes: reading the warning signs, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 3,
  },
  {
    slug: 'test-04',
    title: { zh: '模拟测试 4', en: 'Practice Test 4' },
    description: {
      zh: '四段原创仿真材料：为社团出游租小巴、博物馆特展导言、可再生能源田野调查辅导、造纸术的历史，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Hiring a minibus for a club trip, Introducing a museum exhibition, Tutorial on renewable energy fieldwork and The history of paper, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 4,
  },
  {
    slug: 'test-05',
    title: { zh: '模拟测试 5', en: 'Practice Test 5' },
    description: {
      zh: '四段原创仿真材料：开立学生银行账户、机场航站楼指引广播、湿地考察行前讨论、蜜蜂如何导航，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Opening a student bank account, Orienting passengers at an airport terminal, Discussing a field trip to a wetland and How bees navigate, four independent situations that exercise different question types.',
    },
    sortOrder: 5,
  },
  {
    slug: 'test-06',
    title: { zh: '模拟测试 6', en: 'Practice Test 6' },
    description: {
      zh: '四段原创仿真材料：办理图书馆借书证、社区艺术中心开幕致辞、通勤调查设计、二手市场的经济学，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Joining the local library, Opening speech at a community arts centre, Planning a survey on commuting and The economics of second-hand markets, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 6,
  },
  {
    slug: 'test-07',
    title: { zh: '模拟测试 7', en: 'Practice Test 7' },
    description: {
      zh: '四段原创仿真材料：为孩子约钢琴课、酒店新员工入职说明、评读双语儿童研究、睡眠周期与学习，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Arranging piano lessons for a child, Inducting new hotel staff, Reviewing a paper on bilingual children and Sleep cycles and learning, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 7,
  },
  {
    slug: 'test-08',
    title: { zh: '模拟测试 8', en: 'Practice Test 8' },
    description: {
      zh: '四段原创仿真材料：给自行车上保险、植物园导览、准备一份关于珊瑚礁的展示、自行车的发明，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Insuring a bicycle, A tour of the botanical garden, Preparing a presentation on coral reefs and The invention of the bicycle, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 8,
  },
  {
    slug: 'test-09',
    title: { zh: '模拟测试 9', en: 'Practice Test 9' },
    description: {
      zh: '四段原创仿真材料：预约牙科检查、动物收容所志愿者说明、小额信贷案例辩论、海岸侵蚀，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Booking a dental check-up, Briefing volunteers at an animal shelter, Debating a case study on microfinance and Coastal erosion, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 9,
  },
  {
    slug: 'test-10',
    title: { zh: '模拟测试 10', en: 'Practice Test 10' },
    description: {
      zh: '四段原创仿真材料：预约驾照考试、图书馆改造进度说明、咖啡因与反应时实验报告、面包的科学，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Applying for a driving test slot, An update on library renovation, Lab report on caffeine and reaction time and The science of bread, four independent situations that exercise different question types.',
    },
    sortOrder: 10,
  },
  {
    slug: 'test-11',
    title: { zh: '模拟测试 11', en: 'Practice Test 11' },
    description: {
      zh: '四段原创仿真材料：周末租车、步行街区方案介绍、城市骑行毕业论文选题、罗马道路，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Hiring a car for a weekend, A talk on the new pedestrian zone, Planning a dissertation on urban cycling and Roman roads, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 11,
  },
  {
    slug: 'test-12',
    title: { zh: '模拟测试 12', en: 'Practice Test 12' },
    description: {
      zh: '四段原创仿真材料：订生日蛋糕、农夫市集摊主说明、材料实验室实习讨论、动物伪装，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Ordering a birthday cake, Briefing stallholders at a farmers’ market, Discussing an internship at a materials lab and Animal camouflage, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 12,
  },
  {
    slug: 'test-13',
    title: { zh: '模拟测试 13', en: 'Practice Test 13' },
    description: {
      zh: '四段原创仿真材料：预约家庭保洁、城市共享单车介绍、博物馆语音导览项目、茶的历史，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Arranging a house clean, Introducing a city bike-share scheme, Discussing a museum audio-guide project and The history of tea, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 13,
  },
  {
    slug: 'test-14',
    title: { zh: '模拟测试 14', en: 'Practice Test 14' },
    description: {
      zh: '四段原创仿真材料：买二手自行车、剧院后台参观、食品标签问卷设计、地震与建筑设计，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Buying a second-hand bike, A backstage tour of a theatre, Planning a questionnaire on food labels and Earthquakes and building design, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 14,
  },
  {
    slug: 'test-15',
    title: { zh: '模拟测试 15', en: 'Practice Test 15' },
    description: {
      zh: '四段原创仿真材料：咨询夜校课程、海滩清洁日活动说明、野外考察计划评审、纸币的由来，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Enquiring about a night class, Instructions for a coastal clean-up day, Reviewing a fieldwork plan and The story of paper money, four independent situations that exercise different question types.',
    },
    sortOrder: 15,
  },
  {
    slug: 'test-16',
    title: { zh: '模拟测试 16', en: 'Practice Test 16' },
    description: {
      zh: '四段原创仿真材料：退换故障咖啡机、社区果园说明、睡眠播客讨论、超市的诞生，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Returning a faulty coffee machine, A talk on a community orchard, Discussing a podcast on sleep and The invention of the supermarket, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 16,
  },
  {
    slug: 'test-17',
    title: { zh: '模拟测试 17', en: 'Practice Test 17' },
    description: {
      zh: '四段原创仿真材料：约毕业照摄影师、食物银行志愿者说明、远程办公数据分析、鸟类迁徙，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Booking a graduation photographer, Briefing volunteers at a food bank, Analysing data on remote work and Bird migration, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 17,
  },
  {
    slug: 'test-18',
    title: { zh: '模拟测试 18', en: 'Practice Test 18' },
    description: {
      zh: '四段原创仿真材料：护照续期、海滩安全讲解、AI 伦理研讨会准备、印刷机，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Renewing a passport, A beach safety talk, Preparing a seminar on AI and ethics and The printing press, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 18,
  },
  {
    slug: 'test-19',
    title: { zh: '模拟测试 19', en: 'Practice Test 19' },
    description: {
      zh: '四段原创仿真材料：报名晚间语言课、社区菜园协会会议、城市鸟类研究设计、土壤健康，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Signing up for evening language classes, A meeting of an allotment society, Planning a study on urban birds and Soil health, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 19,
  },
  {
    slug: 'test-20',
    title: { zh: '模拟测试 20', en: 'Practice Test 20' },
    description: {
      zh: '四段原创仿真材料：安排家具送货、天文馆放映介绍、机器人竞赛讨论、排队的数学，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Arranging furniture delivery, Introducing a planetarium show, Discussing a robotics competition and The mathematics of queues, four independent situations that exercise different question types.',
    },
    sortOrder: 20,
  },
  {
    slug: 'test-21',
    title: { zh: '模拟测试 21', en: 'Practice Test 21' },
    description: {
      zh: '四段原创仿真材料：预订营地营位、污水处理厂参观、经济史著作评读、深海热液喷口，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Booking a campsite pitch, A visit to a water treatment plant, Reviewing a book on economic history and Deep-sea hydrothermal vents, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 21,
  },
  {
    slug: 'test-22',
    title: { zh: '模拟测试 22', en: 'Practice Test 22' },
    description: {
      zh: '四段原创仿真材料：加入摄影俱乐部、就业中心工作坊说明、医院实习安排、国际象棋起源，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Joining a photography club, Introducing a jobcentre workshop, Planning a hospital placement and The origins of chess, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 22,
  },
  {
    slug: 'test-23',
    title: { zh: '模拟测试 23', en: 'Practice Test 23' },
    description: {
      zh: '四段原创仿真材料：咨询托儿所名额、青年旅舍入住说明、戏剧改编讨论、微塑料，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Asking about a nursery place, Orienting guests at a youth hostel, Discussing a theatre adaptation and Microplastics, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 23,
  },
  {
    slug: 'test-24',
    title: { zh: '模拟测试 24', en: 'Practice Test 24' },
    description: {
      zh: '四段原创仿真材料：预订城堡一日游、烹饪课开场说明、植物生长实验设计、图书馆建筑，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Booking a coach tour to a castle, Introducing a cookery school class, Designing an experiment on plant growth and The architecture of libraries, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 24,
  },
  {
    slug: 'test-25',
    title: { zh: '模拟测试 25', en: 'Practice Test 25' },
    description: {
      zh: '四段原创仿真材料：租用自助仓、校医务室服务说明、住房政策答辩准备、记忆与遗忘，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Renting a self-storage unit, Explaining campus health centre services, Preparing for a viva on housing policy and Memory and forgetting, four independent situations that exercise different question types.',
    },
    sortOrder: 25,
  },
  {
    slug: 'test-26',
    title: { zh: '模拟测试 26', en: 'Practice Test 26' },
    description: {
      zh: '四段原创仿真材料：报修洗衣机、野生动物保护区讲解、旅游统计评析、城市农业，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Reporting a broken washing machine, A ranger talk at a wildlife reserve, Reviewing tourism statistics and Urban farming, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 26,
  },
  {
    slug: 'test-27',
    title: { zh: '模拟测试 27', en: 'Practice Test 27' },
    description: {
      zh: '四段原创仿真材料：考察婚礼场地、渡轮安全广播、方言播客策划、制冷技术的发明，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Viewing a wedding venue, A safety announcement on a ferry, Planning a podcast on local dialects and The invention of refrigeration, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 27,
  },
  {
    slug: 'test-28',
    title: { zh: '模拟测试 28', en: 'Practice Test 28' },
    description: {
      zh: '四段原创仿真材料：社区合唱团试唱、会议中心指引、书写与学习论文讨论、冰川，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Auditioning for a community choir, Orienting delegates at a conference venue, Discussing a paper on handwriting and learning and Glaciers, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 28,
  },
  {
    slug: 'test-29',
    title: { zh: '模拟测试 29', en: 'Practice Test 29' },
    description: {
      zh: '四段原创仿真材料：报名成人游泳课、共享办公空间参观、校园可持续审计、颜色感知，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Booking adult swimming lessons, A tour of a co-working space, Planning a campus sustainability audit and Colour perception, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 29,
  },
  {
    slug: 'test-30',
    title: { zh: '模拟测试 30', en: 'Practice Test 30' },
    description: {
      zh: '四段原创仿真材料：装家庭宽带、社区电台志愿者说明、社交媒体辩论准备、邮政史，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Setting up home broadband, Briefing volunteers at community radio, Preparing a debate on social media and The history of the postal service, four independent situations that exercise different question types.',
    },
    sortOrder: 30,
  },
  {
    slug: 'test-31',
    title: { zh: '模拟测试 31', en: 'Practice Test 31' },
    description: {
      zh: '四段原创仿真材料：请搬家公司、滑雪场安全讲解、河流田野笔记评阅、储能技术，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Hiring a removal company, A safety briefing at a ski resort, Reviewing fieldwork notes on rivers and Energy storage, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 31,
  },
  {
    slug: 'test-32',
    title: { zh: '模拟测试 32', en: 'Practice Test 32' },
    description: {
      zh: '四段原创仿真材料：加入农场志愿项目、古宅花园导览、包装设计项目讨论、昆虫通讯，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Joining a farm volunteering scheme, A garden tour at a historic house, Discussing a packaging design project and Insect communication, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 32,
  },
  {
    slug: 'test-33',
    title: { zh: '模拟测试 33', en: 'Practice Test 33' },
    description: {
      zh: '四段原创仿真材料：预订游船、垃圾发电厂参观、音乐练习研究设计、语言的演化，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Booking a river boat trip, A tour of a waste-to-energy plant, Planning a study on music practice and The evolution of languages, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 33,
  },
  {
    slug: 'test-34',
    title: { zh: '模拟测试 34', en: 'Practice Test 34' },
    description: {
      zh: '四段原创仿真材料：购买火车季票、美术馆导览、博物馆借展讨论、潮汐，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Buying a rail season ticket, Introducing an art gallery, Discussing a museum loan of artefacts and Tides, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 34,
  },
  {
    slug: 'test-35',
    title: { zh: '模拟测试 35', en: 'Practice Test 35' },
    description: {
      zh: '四段原创仿真材料：加入维修咖啡馆、成人教育课程介绍、酶学会议摘要准备、咖啡的历史，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Joining a repair cafe, Information on adult education courses, Preparing a conference abstract on enzymes and The history of coffee, four independent situations that exercise different question types.',
    },
    sortOrder: 35,
  },
  {
    slug: 'test-36',
    title: { zh: '模拟测试 36', en: 'Practice Test 36' },
    description: {
      zh: '四段原创仿真材料：租社区菜园地块、音乐节场地指引、社区地图项目、锂电池回收，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Renting a community garden plot, Orienting festival-goers on site, Planning a community mapping project and Recycling lithium batteries, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 36,
  },
  {
    slug: 'test-37',
    title: { zh: '模拟测试 37', en: 'Practice Test 37' },
    description: {
      zh: '四段原创仿真材料：预约剪发染发、医院志愿者入职说明、评读快时尚案例研究、群体心理学，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Booking a haircut and colour, Inducting hospital volunteers, Reviewing a case study on fast fashion and The psychology of groups, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 37,
  },
  {
    slug: 'test-38',
    title: { zh: '模拟测试 38', en: 'Practice Test 38' },
    description: {
      zh: '四段原创仿真材料：安排寄养宠物狗、国家公园步道说明、语言学习 App 试用、古代灌溉，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Arranging dog boarding, A trail briefing at a national park, Discussing a language app trial and Ancient irrigation, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 38,
  },
  {
    slug: 'test-39',
    title: { zh: '模拟测试 39', en: 'Practice Test 39' },
    description: {
      zh: '四段原创仿真材料：报名急救课程、手作市集组织说明、纺织展策划、隔声，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Signing up for a first-aid course, Briefing craft fair organisers, Planning an exhibition on textiles and Sound insulation, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 39,
  },
  {
    slug: 'test-40',
    title: { zh: '模拟测试 40', en: 'Practice Test 40' },
    description: {
      zh: '四段原创仿真材料：订花送人、泳池泳道规则说明、志愿行为调查评析、地图史，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Ordering a flower delivery, Explaining pool lane rules, Reviewing survey design on volunteering and The history of maps, four independent situations that exercise different question types.',
    },
    sortOrder: 40,
  },
  {
    slug: 'test-41',
    title: { zh: '模拟测试 41', en: 'Practice Test 41' },
    description: {
      zh: '四段原创仿真材料：预约图书馆自习室、公交车库开放日讲解、噪声污染研究讨论、抗生素与耐药，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Booking a library study room, A talk at a bus depot open day, Discussing a study on noise pollution and Antibiotics and resistance, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 41,
  },
  {
    slug: 'test-42',
    title: { zh: '模拟测试 42', en: 'Practice Test 42' },
    description: {
      zh: '四段原创仿真材料：加入羽毛球俱乐部、社区工具图书馆介绍、朋辈辅导计划、运动的生理学，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Joining a badminton club, Introducing a community tool library, Planning a peer tutoring scheme and The physiology of exercise, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 42,
  },
  {
    slug: 'test-43',
    title: { zh: '模拟测试 43', en: 'Practice Test 43' },
    description: {
      zh: '四段原创仿真材料：咨询托儿补助、慈善商店志愿者说明、电动公交数据评析、博物馆史，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Enquiring about a childcare bursary, Briefing charity shop volunteers, Reviewing data on electric buses and The history of museums, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 43,
  },
  {
    slug: 'test-44',
    title: { zh: '模拟测试 44', en: 'Practice Test 44' },
    description: {
      zh: '四段原创仿真材料：预约修车、天文台公众开放夜说明、深海采矿纪录片讨论、光污染，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Booking a bike repair service, Introducing a public observatory night, Discussing a documentary on deep-sea mining and Light pollution, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 44,
  },
  {
    slug: 'test-45',
    title: { zh: '模拟测试 45', en: 'Practice Test 45' },
    description: {
      zh: '四段原创仿真材料：预约机场停车、有轨电车博物馆讲解、实验室安全视频策划、发酵，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Arranging airport parking, A talk at a tram museum, Planning a lab safety induction video and Fermentation, four independent situations that exercise different question types.',
    },
    sortOrder: 45,
  },
  {
    slug: 'test-46',
    title: { zh: '模拟测试 46', en: 'Practice Test 46' },
    description: {
      zh: '四段原创仿真材料：报名品酒夜、酒店水疗设施介绍、旧报纸档案研究、酒店业史，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Joining a wine-tasting evening, Introducing hotel spa facilities, Discussing archival research on newspapers and The history of the hotel industry, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 46,
  },
  {
    slug: 'test-47',
    title: { zh: '模拟测试 47', en: 'Practice Test 47' },
    description: {
      zh: '四段原创仿真材料：租一日海滩小屋、学校开放日说明、创业孵化路演准备、电话交换机，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Booking a beach hut for the day, A talk at a school open day, Preparing a pitch for a startup incubator and The telephone exchange, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 47,
  },
  {
    slug: 'test-48',
    title: { zh: '模拟测试 48', en: 'Practice Test 48' },
    description: {
      zh: '四段原创仿真材料：配处方眼镜、游艇码头设施说明、抗生素耐药论文评读、荒漠化，四段材料分别对应生活对话、独白导览、学术讨论与学术讲座。',
      en: 'Four original practice parts: Ordering prescription glasses, Briefing at a marina, Reviewing a paper on antibiotic resistance and Desertification, one for each IELTS Listening part from everyday dialogue to academic lecture.',
    },
    sortOrder: 48,
  },
  {
    slug: 'test-49',
    title: { zh: '模拟测试 49', en: 'Practice Test 49' },
    description: {
      zh: '四段原创仿真材料：订无障碍座位戏票、山地救援队讲解、公民科学鸟类计数、植物防御，按雅思 Part 1–4 的难度曲线推进，适合一次连续练完。',
      en: 'Four original practice parts: Booking theatre tickets with access needs, A mountain rescue team talk, Planning a citizen-science bird count and Plant defences, arranged along the IELTS difficulty curve for a single continuous sitting.',
    },
    sortOrder: 49,
  },
  {
    slug: 'test-50',
    title: { zh: '模拟测试 50', en: 'Practice Test 50' },
    description: {
      zh: '四段原创仿真材料：办理手机合约、种子图书馆介绍、偏远岛屿研究讨论、钟表史，四段场景彼此独立，可用于检验不同题型的应对。',
      en: 'Four original practice parts: Arranging a mobile phone contract, Introducing a seed library, Discussing a study on remote islands and The history of clocks, four independent situations that exercise different question types.',
    },
    sortOrder: 50,
  },
  {
    slug: 'test-51',
    title: { zh: '模拟测试 51', en: 'Practice Test 51' },
    description: {
      zh: '四段原创仿真材料：预订攀岩体验、地方史学会徒步讲解、肠道菌群海报准备、天气预报，口音与话轮数量按真题习惯安排。',
      en: 'Four original practice parts: Booking a climbing wall session, A local history society walk, Preparing a poster on gut bacteria and Weather forecasting, with accents and speaker counts arranged the way the real test does.',
    },
    sortOrder: 51,
  },
  {
    slug: 'test-52',
    title: { zh: '模拟测试 52', en: 'Practice Test 52' },
    description: {
      zh: '四段原创仿真材料：预约家庭能耗评估、零废弃商店介绍、中世纪贸易路线论文评阅、嗅觉的科学，适合在完成前一套后检查方法是否真的迁移成功。',
      en: 'Four original practice parts: Arranging a home energy survey, Introducing a zero-waste shop, Reviewing a thesis on medieval trade routes and The science of smell, useful for checking that the method transfers after the previous paper.',
    },
    sortOrder: 52,
  },
];
