import type { IeltsTask } from '@/lib/ielts/types';

/** 原创扩充题目计划；只有完成正文与内容校验后才能进入公开对照库。 */
export interface IeltsExpansionPlan {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  sortOrder: number;
  title: { zh: string; en: string };
  prompt: { zh: string; en: string };
  authoringBrief: string;
}

export const ieltsExpansionPlan: IeltsExpansionPlan[] = [
  {
    slug: 'task2-opinion-school-start-times', task: 'task2', category: 'opinion', topic: 'education', sortOrder: 70,
    title: { zh: '中学是否应该推迟上课', en: 'Later Starting Times for Secondary Schools' },
    prompt: { en: 'Secondary schools should start lessons later in the morning, even if this means finishing later in the afternoon. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '中学应该推迟上午开始上课的时间，即使这意味着下午更晚放学。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '明确同意程度，比较晨间专注与放学后的交通、家庭照护安排；可用假设学生日程说明条件。两版保留同一立场与例子，不把推迟上课必然提高成绩写成已证实事实。',
  },
  {
    slug: 'task2-opinion-repair-information', task: 'task2', category: 'opinion', topic: 'technology', sortOrder: 80,
    title: { zh: '厂商是否应公开维修资料', en: 'Access to Product Repair Information' },
    prompt: { en: 'Manufacturers should be required to provide independent repair shops with the information needed to fix their products. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '应要求制造商向独立维修店提供修理其产品所需的资料。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '围绕维修选择、使用寿命与安全责任展开，可支持公开基础资料并为危险部件设培训条件。区分资料开放与免费零件，不编造法律现状或减排比例。',
  },
  {
    slug: 'task2-opinion-urban-tree-budgets', task: 'task2', category: 'opinion', topic: 'environment', sortOrder: 90,
    title: { zh: '城市树木的养护与增种', en: 'Maintaining Existing Urban Trees' },
    prompt: { en: 'When city budgets are limited, maintaining mature public trees should take priority over planting new ones. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '当城市预算有限时，应优先养护现有的成熟公共树木，而不是种植新树。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '比较现有树荫的即时作用与缺树街区的公平性，形成有条件的预算优先级。不得假定所有老树都健康，也不把种新树和养护写成绝对互斥。',
  },
  {
    slug: 'task2-opinion-work-messages', task: 'task2', category: 'opinion', topic: 'work', sortOrder: 100,
    title: { zh: '下班后回复工作消息', en: 'Responding to Messages Outside Working Hours' },
    prompt: { en: 'Employees should have the right to ignore routine work messages outside their agreed working hours. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '员工应有权在约定工作时间之外不回复日常工作消息。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '区分日常消息与已约定的值班紧急响应；以恢复精力、工作边界和跨时区协作为论证。不得将例外扩成无限待命，也不虚构劳动法规。',
  },
  {
    slug: 'task2-opinion-free-drinking-water', task: 'task2', category: 'opinion', topic: 'health', sortOrder: 110,
    title: { zh: '公共场所的免费饮水', en: 'Free Drinking Water in Public Places' },
    prompt: { en: 'Local authorities should provide free drinking-water refill points in all busy public areas. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '地方政府应在所有人流密集的公共区域提供免费的饮用水补给点。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '讨论饮水便利、可重复使用水瓶与维护卫生，判断“所有”区域是否应分阶段覆盖。例子为假设公共广场，不声称设施必然消除塑料垃圾或改善特定疾病。',
  },
  {
    slug: 'task2-opinion-library-digital-help', task: 'task2', category: 'opinion', topic: 'service', sortOrder: 120,
    title: { zh: '图书馆是否应提供数字服务辅导', en: 'Digital Assistance in Public Libraries' },
    prompt: { en: 'Helping residents use essential online services should be a core duty of public libraries. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '帮助居民使用必要的网上服务应成为公共图书馆的核心职责。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '讨论数字可及性与图书馆人力边界，例子限于辅导预约或表单操作。区分教会操作与代收密码、代作专业判断；不把图书馆等同政府服务中心。',
  },
  {
    slug: 'task2-opinion-local-history-curriculum', task: 'task2', category: 'opinion', topic: 'culture', sortOrder: 130,
    title: { zh: '学校是否应教授本地历史', en: 'Local History in the School Curriculum' },
    prompt: { en: 'Every secondary school should include a project on the history of its local area in the curriculum. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '每所中学都应在课程中设置一个关于所在地历史的项目。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '论证可结合史料辨别、地方归属感与课程时间，采用假设老市场访查。避免把地方故事当未经核实的史实，明确地方视角需联系更广背景。',
  },
  {
    slug: 'task2-opinion-advertising-disclosure', task: 'task2', category: 'opinion', topic: 'media', sortOrder: 140,
    title: { zh: '网络推荐中的赞助标注', en: 'Clear Labels for Sponsored Recommendations' },
    prompt: { en: 'People who receive payment or gifts for recommending products online should clearly disclose this relationship in every relevant post. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '因网络产品推荐获得报酬或礼物的人，应在每条相关内容中清楚说明这一关系。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '以受众知情选择和创作者执行成本衡量披露义务；赠品也在题目范围内。明确披露不等于证明推荐虚假，不能虚构平台规则或真实人物违规。',
  },
  {
    slug: 'task2-opinion-public-science-access', task: 'task2', category: 'opinion', topic: 'science', sortOrder: 150,
    title: { zh: '公共资助研究的通俗摘要', en: 'Public Summaries of Funded Research' },
    prompt: { en: 'Researchers receiving public funding should provide a plain-language summary of their findings for the public. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '接受公共资助的研究者应向公众提供研究发现的通俗摘要。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '讨论公共问责、理解研究与写作投入；可主张机构支持摘要制作。摘要应保留不确定性，不假定所有研究可立即公开原始数据或都有直接应用。',
  },
  {
    slug: 'task2-opinion-step-free-stations', task: 'task2', category: 'opinion', topic: 'urban', sortOrder: 160,
    title: { zh: '车站无障碍改造的优先级', en: 'Prioritising Step-Free Station Access' },
    prompt: { en: 'Transport authorities should prioritise making existing stations accessible without stairs before building new stations. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '交通管理部门应优先让既有车站实现无需爬楼梯的通行，再建设新车站。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '对照现有乘客的公平使用权与未覆盖地区的接入需求，可按客流和障碍程度排序。不要声称电梯解决全部无障碍问题，例子不套用真实城市统计。',
  },
  {
    slug: 'task2-opinion-volunteer-choice', task: 'task2', category: 'opinion', topic: 'society', sortOrder: 170,
    title: { zh: '青年志愿服务是否应自愿', en: 'Keeping Youth Volunteering Voluntary' },
    prompt: { en: 'Community service for young people should remain voluntary rather than becoming a condition for completing school. To what extent do you agree or disagree? Give reasons and relevant examples. Write at least 250 words.', zh: '青年社区服务应保持自愿，不应成为完成学业的条件。你在多大程度上同意或不同意？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '衡量自主投入、服务机会与强制要求的公平性；可讨论学校提供选择和便利。区分反对毕业门槛与反对服务本身，不假定所有学生课外时间相同。',
  },
  {
    slug: 'task2-discussion-assessment-methods', task: 'task2', category: 'discussion', topic: 'education', sortOrder: 180,
    title: { zh: '考试与项目评价', en: 'Examinations or Project-Based Assessment' },
    prompt: { en: 'Some people believe final examinations are the fairest way to assess students, while others prefer assessment through projects completed during a course. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为期末考试是评价学生最公平的方式，另一些人更支持依据课程期间完成的项目评价。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '双方均围绕公平性：统一条件对照持续表现、资源差异与个人贡献。提出有理由的组合或倾向，不把项目必然合作或考试只测记忆当定论。',
  },
  {
    slug: 'task2-discussion-ai-customer-service', task: 'task2', category: 'discussion', topic: 'service', sortOrder: 190,
    title: { zh: '客服自动化与人工服务', en: 'Automated and Human Customer Service' },
    prompt: { en: 'Some people think automated chat services should handle most customer enquiries, while others believe customers should be able to speak directly to a person. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为自动聊天服务应处理大多数客户咨询，另一些人认为客户应能够直接与真人交流。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '比较重复问题的速度、复杂纠纷的理解和升级渠道。立场按问题复杂度组织；不编造客服成功率，不把人工和自动服务描述为只能二选一。',
  },
  {
    slug: 'task2-discussion-water-responsibility', task: 'task2', category: 'discussion', topic: 'environment', sortOrder: 200,
    title: { zh: '节水应靠个人还是供水系统', en: 'Who Should Lead Water Conservation?' },
    prompt: { en: 'Some people say households should take the main responsibility for reducing water waste, while others argue that water suppliers should focus on repairing leaks. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为家庭应主要负责减少水资源浪费，另一些人主张供水单位应着重修复漏水设施。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '家庭可控行为对照系统损耗和基础设施投资；说明主要责任判断依据并承认互补。不给虚构漏损比例，不把家庭节水量直接等同供水单位漏水量。',
  },
  {
    slug: 'task2-discussion-hiring-potential', task: 'task2', category: 'discussion', topic: 'work', sortOrder: 210,
    title: { zh: '招聘重经验还是潜力', en: 'Experience or Potential in Recruitment' },
    prompt: { en: 'Some employers prefer applicants with directly relevant experience, while others place more value on the ability to learn new skills. Discuss both approaches and give your own opinion. Write at least 250 words.', zh: '有些雇主偏好具有直接相关经验的求职者，另一些更看重学习新技能的能力。请讨论两种做法并给出自己的看法，不少于 250 词。' },
    authoringBrief: '比较短期上手需求与岗位变化适应力，例子可用既定维修岗位和新工具团队。避免经验与学习能力互斥，立场须考虑培训时间或岗位风险。',
  },
  {
    slug: 'task2-discussion-health-prevention', task: 'task2', category: 'discussion', topic: 'health', sortOrder: 220,
    title: { zh: '公共健康预算的分配', en: 'Prevention or Treatment in Health Spending' },
    prompt: { en: 'Some people think additional public health funding should mainly support prevention programmes, while others want it spent on treating people who are already ill. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为新增公共健康资金应主要用于预防项目，另一些希望用于治疗已经患病的人。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '限定新增预算而非全部医疗经费；比较未来负担与眼前需求，以步行环境或健康教育作假设例子。不提供医疗建议，也不编造治疗或预防的成本效益数值。',
  },
  {
    slug: 'task2-discussion-heritage-buildings', task: 'task2', category: 'discussion', topic: 'culture', sortOrder: 230,
    title: { zh: '旧建筑保护与重新使用', en: 'Preserving or Adapting Historic Buildings' },
    prompt: { en: 'Some people believe historic buildings should be preserved as closely as possible to their original form, while others support adapting them for new uses. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为历史建筑应尽可能保持原貌，另一些支持将其改造为新的用途。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '比较历史信息完整性、维护资金和公众使用，可主张可逆改造。不要把适应性使用等同拆除；虚构实例须保持假设语气，不冒充真实文保案例。',
  },
  {
    slug: 'task2-discussion-news-local-global', task: 'task2', category: 'discussion', topic: 'media', sortOrder: 240,
    title: { zh: '新闻应更关注本地还是全球', en: 'Local or International News Coverage' },
    prompt: { en: 'Some people believe news organisations should devote more resources to local issues, while others think international events deserve greater attention. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为新闻机构应将更多资源投入本地议题，另一些认为国际事件更值得关注。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '对照日常问责与跨境关联，以本地交通决策、供应链变化作假设例子。明确资源有限的排序依据，避免把地理距离等同新闻重要性。',
  },
  {
    slug: 'task2-discussion-tourism-limits', task: 'task2', category: 'discussion', topic: 'travel', sortOrder: 250,
    title: { zh: '热门景点是否应限制访客', en: 'Visitor Limits at Popular Attractions' },
    prompt: { en: 'Some people support strict visitor limits at popular natural attractions, while others believe improved facilities are a better response to overcrowding. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人支持对热门自然景点实行严格的访客数量限制，另一些认为改善设施更能应对拥挤。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '比较生态承载、公共进入机会和设施扩建影响；可按区域脆弱程度给出条件立场。不可声称所有拥挤源于缺设施，也不虚构承载量。',
  },
  {
    slug: 'task2-discussion-science-funding', task: 'task2', category: 'discussion', topic: 'science', sortOrder: 260,
    title: { zh: '基础研究与即时问题', en: 'Basic Research or Immediate Applications' },
    prompt: { en: 'Some people think research funding should concentrate on solving immediate practical problems, while others support research with no obvious short-term application. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为研究经费应集中解决眼前的实际问题，另一些支持资助短期内没有明显用途的研究。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '比较紧急公共需求与长期知识积累，说明预算组合的理由。不能承诺基础研究必有商业突破，避免编造真实发明起源或投入回报。',
  },
  {
    slug: 'task2-discussion-housing-location', task: 'task2', category: 'discussion', topic: 'urban', sortOrder: 270,
    title: { zh: '新增住房应建在哪里', en: 'Building Up or Expanding Outwards' },
    prompt: { en: 'Some people favour building more homes within existing urban areas, while others prefer new housing developments outside city boundaries. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人主张在现有城市区域内增加住房，另一些更支持在城市边界之外开发新住宅。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '讨论已有公共服务利用、居住空间与交通连接；城市内加密不必等于只建高楼。比较建设配套条件，不假设郊区一定便宜或中心必然拥挤。',
  },
  {
    slug: 'task2-discussion-intergenerational-housing', task: 'task2', category: 'discussion', topic: 'society', sortOrder: 280,
    title: { zh: '不同年龄居民混居', en: 'Mixed-Age or Age-Specific Housing' },
    prompt: { en: 'Some people think older adults benefit most from housing designed specifically for their age group, while others favour neighbourhoods where people of all ages live together. Discuss both views and give your own opinion. Write at least 250 words.', zh: '有人认为专为其年龄群体设计的住房最有利于老年人，另一些更支持所有年龄群体共同居住的社区。请讨论双方观点并给出自己的看法，不少于 250 词。' },
    authoringBrief: '对比适老设施、互助和个人选择；区分独立居住社区与需要医疗照护的机构。不能把年龄群体描述成需求一致，也不宣称某种住房消除孤独。',
  },
  {
    slug: 'task2-problem-solution-reading-habits', task: 'task2', category: 'problem-solution', topic: 'education', sortOrder: 290,
    title: { zh: '学生难以坚持长篇阅读', en: 'Difficulty Sustaining Long-Form Reading' },
    prompt: { en: 'Some schools report that students find it difficult to finish longer books outside lessons. What factors might explain this problem, and what could schools do to address it? Give reasons and relevant examples. Write at least 250 words.', zh: '一些学校反映，学生很难在课外读完篇幅较长的书。哪些因素可能解释这一问题？学校可以怎样应对？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '选择阅读难度不匹配与时间被切碎等原因，分别对应分级选书、稳定阅读时段。不能把所有责任归于手机，措施须回应所写原因，不杜撰普遍下降数据。',
  },
  {
    slug: 'task2-problem-solution-digital-exclusion', task: 'task2', category: 'problem-solution', topic: 'technology', sortOrder: 300,
    title: { zh: '公共服务上线后的数字排斥', en: 'Exclusion from Online Public Services' },
    prompt: { en: 'When essential public services move online, some residents struggle to access them. What are the main causes of this difficulty, and what measures could service providers take? Give reasons and relevant examples. Write at least 250 words.', zh: '必要的公共服务转到网上后，一些居民难以使用。造成这种困难的主要原因是什么？服务提供方可以采取哪些措施？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '将设备或连接限制与操作、无障碍障碍分开，提出线下保留渠道和简化辅导。不要只针对老年人，不把一次培训描述成永久解决数字排斥。',
  },
  {
    slug: 'task2-problem-solution-household-food-waste', task: 'task2', category: 'problem-solution', topic: 'environment', sortOrder: 310,
    title: { zh: '家庭食物浪费', en: 'Reducing Avoidable Household Food Waste' },
    prompt: { en: 'Many households throw away food that could have been eaten. What habits contribute to this waste, and how could retailers and households reduce it? Give reasons and relevant examples. Write at least 250 words.', zh: '许多家庭会丢弃原本可以食用的食物。哪些习惯促成了这种浪费？零售商和家庭可以怎样减少浪费？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '原因可选冲动囤购、库存不清，措施分别落到合理份量销售和餐单管理。需同时覆盖零售商与家庭；不建议食用不安全食物，不混同食品安全日期与品质提示。',
  },
  {
    slug: 'task2-problem-solution-new-staff-turnover', task: 'task2', category: 'problem-solution', topic: 'work', sortOrder: 320,
    title: { zh: '新员工为何很快离职', en: 'Early Turnover Among New Employees' },
    prompt: { en: 'Some organisations struggle to retain employees during their first year. What might cause new employees to leave, and how could employers improve retention? Give reasons and relevant examples. Write at least 250 words.', zh: '一些机构难以留住入职未满一年的员工。哪些因素可能促使新员工离职？雇主可以怎样改善留任情况？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '围绕岗位预期落差与入职支持不足建立因果链，对应真实职位说明和导师沟通。避免把离职全归咎于年轻人，不将留任与限制离职自由混为一谈。',
  },
  {
    slug: 'task2-problem-solution-sedentary-routines', task: 'task2', category: 'problem-solution', topic: 'health', sortOrder: 330,
    title: { zh: '日常久坐的原因与改善', en: 'Making Daily Routines Less Sedentary' },
    prompt: { en: 'Many adults spend much of their working day sitting and find little time to be physically active. What features of modern routines contribute to this, and what changes could workplaces support? Write at least 250 words.', zh: '许多成年人在工作日大部分时间坐着，并很难腾出时间活动。现代生活安排中的哪些特点促成了这种情况？工作场所可以支持哪些改变？不少于 250 词。' },
    authoringBrief: '将连续屏幕任务、休息文化与可实施的短时活动和空间安排相连。不要保证减重或治疗效果，不把站立等同运动；照顾行动能力不同的员工。',
  },
  {
    slug: 'task2-problem-solution-missed-appointments', task: 'task2', category: 'problem-solution', topic: 'service', sortOrder: 340,
    title: { zh: '社区服务预约爽约', en: 'Missed Appointments at Community Services' },
    prompt: { en: 'Community service centres sometimes leave appointment slots unused because people do not attend or cancel in time. Why might this happen, and how could centres reduce the problem? Write at least 250 words.', zh: '社区服务中心有时因预约者未到场或未及时取消而空置预约时段。这可能由哪些原因造成？中心可以怎样减少这一问题？不少于 250 词。' },
    authoringBrief: '原因可写忘记预约与取消流程复杂，措施对应可选提醒和便捷取消、候补安排。区分恶意占位与突发情况，不自动提倡罚款或虚构爽约率。',
  },
  {
    slug: 'task2-problem-solution-public-space-noise', task: 'task2', category: 'problem-solution', topic: 'urban', sortOrder: 350,
    title: { zh: '共享公共空间的噪声冲突', en: 'Noise Conflicts in Shared Public Spaces' },
    prompt: { en: 'Residents sometimes disagree about noise from evening activities in shared public spaces. What causes these conflicts, and what could local authorities and users do to resolve them? Write at least 250 words.', zh: '居民有时会因共享公共空间中的晚间活动噪声产生分歧。这些冲突有哪些成因？地方管理部门和使用者可以怎样化解？不少于 250 词。' },
    authoringBrief: '从空间用途重叠、时段预期不明解释矛盾，对应分区、协商时段和执行机制。兼顾活动与休息，避免将某类年龄或文化群体标签化。',
  },
  {
    slug: 'task2-problem-solution-neighbour-isolation', task: 'task2', category: 'problem-solution', topic: 'society', sortOrder: 360,
    title: { zh: '同楼居民互不相识', en: 'Limited Contact Between Neighbours' },
    prompt: { en: 'In some apartment buildings, residents have little contact with their neighbours. What factors might explain this, and what practical steps could encourage interaction without invading privacy? Write at least 250 words.', zh: '在一些公寓楼中，住户与邻居很少接触。哪些因素可能解释这种现象？有哪些实际措施能在不侵犯隐私的情况下鼓励交流？不少于 250 词。' },
    authoringBrief: '以作息错开和缺少低门槛场景解释；提出自愿公共活动、信息板等。必须回应隐私限定，不把独处一概当病态，也不承诺活动一定建立友谊。',
  },
  {
    slug: 'task2-problem-solution-museum-participation', task: 'task2', category: 'problem-solution', topic: 'culture', sortOrder: 370,
    title: { zh: '本地居民很少去博物馆', en: 'Low Local Participation in Museums' },
    prompt: { en: 'Some museums attract visitors from elsewhere but few residents from their own communities. Why might local participation be low, and how could museums encourage repeat visits from residents? Write at least 250 words.', zh: '一些博物馆吸引外来访客，却很少吸引所在社区的居民。本地参与度低可能有哪些原因？博物馆可以怎样鼓励居民多次参观？不少于 250 词。' },
    authoringBrief: '原因须针对重复参观，如内容变化少、开放时间不便；措施为轮换小展或社区共创等。不要把问题简化为收费高，也不虚构特定博物馆客流。',
  },
  {
    slug: 'task2-problem-solution-online-rumours', task: 'task2', category: 'problem-solution', topic: 'media', sortOrder: 380,
    title: { zh: '网络传言为何快速扩散', en: 'The Rapid Spread of Unverified Claims' },
    prompt: { en: 'Unverified claims can spread rapidly through online community groups. Why do people share them, and what could group organisers and members do to reduce the spread? Write at least 250 words.', zh: '未经核实的说法会在网络社群中快速传播。人们为什么转发这些信息？社群组织者和成员可以怎样减少传播？不少于 250 词。' },
    authoringBrief: '讨论紧迫感、熟人信任与查证成本，对应来源提示、延迟转发和可见更正。使用无害的假设活动通知例子，不复述真实有害传言，不将质疑等同全面禁言。',
  },
  {
    slug: 'task2-problem-solution-seasonal-tourism', task: 'task2', category: 'problem-solution', topic: 'travel', sortOrder: 390,
    title: { zh: '旅游淡旺季失衡', en: 'Uneven Tourism Demand Across the Year' },
    prompt: { en: 'Some tourist towns are crowded for a short peak season but receive few visitors during the rest of the year. What problems does this create, and what could local businesses and authorities do? Write at least 250 words.', zh: '一些旅游城镇在短暂旺季十分拥挤，其余时间游客很少。这会带来哪些问题？当地企业和管理部门可以采取哪些措施？不少于 250 词。' },
    authoringBrief: '本题问问题与措施，不以原因取代问题；写季节性就业、设施负荷，对应分散活动和灵活服务。淡季推广受天气等限制，不能保证全年客流均匀。',
  },
  {
    slug: 'task2-advantage-four-day-week', task: 'task2', category: 'advantage-disadvantage', topic: 'work', sortOrder: 400,
    title: { zh: '每周四天工作的利弊', en: 'A Shorter Four-Day Working Week' },
    prompt: { en: 'Some employers are reducing the working week to four days without reducing pay or increasing daily hours. Do the advantages of this arrangement outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '一些雇主将每周工作时间缩短为四天，同时不减薪，也不延长每日工时。这种安排是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '严格保留总工时减少的条件，不写成四天压缩原有工时；比较休息与招聘优势、排班覆盖与工作量。作明确权衡，不编造试验生产率。',
  },
  {
    slug: 'task2-advantage-open-online-courses', task: 'task2', category: 'advantage-disadvantage', topic: 'education', sortOrder: 410,
    title: { zh: '大学公开在线课程', en: 'Universities Offering Open Online Courses' },
    prompt: { en: 'Universities increasingly offer free online courses that anyone can join without formal admission. Do the advantages of this development outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '越来越多大学提供无需正式入学、任何人都能参加的免费在线课程。这一发展是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '比较学习机会与自律、互动和制作成本；对象是开放课程，不是免费授予学位。例子为假设学习者，不能把注册量当完成率或宣称证书必获认可。',
  },
  {
    slug: 'task2-advantage-cashless-shops', task: 'task2', category: 'advantage-disadvantage', topic: 'technology', sortOrder: 420,
    title: { zh: '商店只收电子支付', en: 'Cashless Retail Shops' },
    prompt: { en: 'Some shops accept only electronic payments and no longer accept cash. Do the advantages of this policy outweigh the disadvantages for customers and businesses? Give reasons and relevant examples. Write at least 250 words.', zh: '有些商店只接受电子支付，不再收现金。对顾客和商家而言，这一政策是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '双方对象都需覆盖：结算与现金管理便利，对照设备故障、接入排斥与支付费用。不要把电子支付视为免费或绝不出错，结论需比较影响范围。',
  },
  {
    slug: 'task2-advantage-tool-libraries', task: 'task2', category: 'advantage-disadvantage', topic: 'environment', sortOrder: 430,
    title: { zh: '社区工具借用服务', en: 'Community Tool-Lending Schemes' },
    prompt: { en: 'Some communities lend household tools to residents so that people do not need to buy items they rarely use. Do the advantages of these schemes outweigh the disadvantages? Write at least 250 words.', zh: '有些社区向居民借出家用工具，让人们无需购买很少使用的物品。这类服务是否利大于弊？不少于 250 词。' },
    authoringBrief: '比较成本与空间节约、共享磨损与需求冲突；可用同一把偶尔使用的钻具串联两版。安全说明、预约和维护是条件，不声称共享一定更环保。',
  },
  {
    slug: 'task2-advantage-health-tracking-apps', task: 'task2', category: 'advantage-disadvantage', topic: 'health', sortOrder: 440,
    title: { zh: '日常健康记录应用', en: 'Using Apps to Track Everyday Activity' },
    prompt: { en: 'Many people use phone apps to record their daily activity and sleep routines. Do the advantages of this habit outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '许多人用手机应用记录每日活动和睡眠习惯。这种习惯是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '讨论自我观察、目标反馈与数据误差、隐私或过度关注数字；不把应用记录当医学诊断。两版同一假设例子，不编造疗效或精确测量能力。',
  },
  {
    slug: 'task2-advantage-self-service-lockers', task: 'task2', category: 'advantage-disadvantage', topic: 'service', sortOrder: 450,
    title: { zh: '包裹自提柜的利弊', en: 'Parcel Collection Lockers' },
    prompt: { en: 'Delivery companies increasingly use shared parcel lockers instead of delivering every parcel to a home. Do the advantages of this change outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '快递公司越来越多地使用共享包裹柜，而不是将每件包裹送到家中。这种变化是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '比较集中投递和自主取件、额外路程及行动不便者负担；结论要说明选址或保留上门服务的作用。不可假定所有柜都全天开放或一定降低排放。',
  },
  {
    slug: 'task2-advantage-pedestrian-streets', task: 'task2', category: 'advantage-disadvantage', topic: 'urban', sortOrder: 460,
    title: { zh: '商业街步行化', en: 'Turning Shopping Streets into Pedestrian Areas' },
    prompt: { en: 'Some towns are converting central shopping streets into pedestrian-only areas. Do the advantages for residents and local businesses outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '一些城镇将中心商业街改为步行专用区域。对居民与当地商家而言，这是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '比较步行环境与停留体验、配送和接送可达性；居民和商家均有论证。不要将客流增加写成销售额必增，提出时段配送时说明属实施条件。',
  },
  {
    slug: 'task2-advantage-multigenerational-living', task: 'task2', category: 'advantage-disadvantage', topic: 'society', sortOrder: 470,
    title: { zh: '多代同住的利弊', en: 'Several Generations Sharing a Home' },
    prompt: { en: 'In some families, adults from several generations choose to share one home. Do the advantages of this living arrangement outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '有些家庭中，不同代际的成年人选择住在同一个家里。这种居住安排是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '以费用分担、互相照应对照隐私和家庭决策，尊重自愿选择。不得假设照料由某性别承担，也不能把同住等同缺乏独立能力。',
  },
  {
    slug: 'task2-advantage-digital-museum-tours', task: 'task2', category: 'advantage-disadvantage', topic: 'culture', sortOrder: 480,
    title: { zh: '博物馆虚拟参观', en: 'Virtual Tours of Museum Collections' },
    prompt: { en: 'Museums are making more of their collections available through virtual tours. Do the advantages of this development outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '博物馆正通过虚拟参观展示更多馆藏。这一发展是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '比较远程接入和细节放大、实物尺度体验与制作维护；不把虚拟参观必然减少现场收入当事实。以一个假设器物示例保持低高版一致。',
  },
  {
    slug: 'task2-advantage-citizen-science', task: 'task2', category: 'advantage-disadvantage', topic: 'science', sortOrder: 490,
    title: { zh: '公众参与科研数据收集', en: 'Public Participation in Scientific Data Collection' },
    prompt: { en: 'Some research projects invite members of the public to collect observations, such as recording local wildlife. Do the advantages of this approach outweigh the disadvantages? Write at least 250 words.', zh: '一些研究项目邀请公众收集观察记录，例如记录当地野生动物。这种方式是否利大于弊？不少于 250 词。' },
    authoringBrief: '比较覆盖范围与公众学习、观察一致性与抽样偏差。提出培训、复核作为质量条件，不把志愿观察等同专业鉴定，也不编造已发现物种。',
  },
  {
    slug: 'task2-advantage-long-stay-travel', task: 'task2', category: 'advantage-disadvantage', topic: 'travel', sortOrder: 500,
    title: { zh: '旅行时在一地停留更久', en: 'Staying Longer in Fewer Destinations' },
    prompt: { en: 'Some travellers prefer to spend an entire holiday in one destination rather than visiting several places. Do the advantages of this approach outweigh the disadvantages? Give reasons and relevant examples. Write at least 250 words.', zh: '一些旅行者更愿意整个假期停留在一个目的地，而不是游览多个地方。这种旅行方式是否利大于弊？请给出理由及相关例子，不少于 250 词。' },
    authoringBrief: '以体验深度、换乘时间对照景观多样性与兴趣匹配；衡量对象是旅行者假期体验。不得断言所有长住都更便宜或更低碳，保留交通方式条件。',
  },
  {
    slug: 'task2-two-part-adult-learning', task: 'task2', category: 'two-part', topic: 'education', sortOrder: 510,
    title: { zh: '成年人重返课堂', en: 'Adults Returning to Structured Learning' },
    prompt: { en: 'Some adults return to structured learning long after leaving full-time education. Why do they make this choice? What support would help them continue studying alongside other responsibilities? Write at least 250 words.', zh: '一些成年人在离开全日制教育多年后重新参加系统学习。他们为什么做出这一选择？哪些支持能帮助他们在承担其他责任的同时坚持学习？不少于 250 词。' },
    authoringBrief: '分别回答动机与支持：职业转变或个人兴趣，对应弹性时段、可分段课程。避免把成人学习只写成失业再培训，不把两问混成泛泛教育好处。',
  },
  {
    slug: 'task2-two-part-digital-convenience', task: 'task2', category: 'two-part', topic: 'technology', sortOrder: 520,
    title: { zh: '人们期待更简单的数字服务', en: 'Expectations of Simpler Digital Services' },
    prompt: { en: 'People increasingly expect digital services to require fewer steps to complete everyday tasks. Why is convenience so important to users? What risks should designers consider when simplifying these services? Write at least 250 words.', zh: '人们越来越希望数字服务能用更少步骤完成日常任务。为什么便利性对用户如此重要？设计者在简化服务时应考虑哪些风险？不少于 250 词。' },
    authoringBrief: '前问解释时间和认知负担，后问讨论误操作、知情确认及安全恢复。不要笼统认定越少步骤越安全或越危险；举假设预约或付款确认例子。',
  },
  {
    slug: 'task2-two-part-second-hand-shopping', task: 'task2', category: 'two-part', topic: 'environment', sortOrder: 530,
    title: { zh: '二手购物的吸引力', en: 'The Appeal of Second-Hand Shopping' },
    prompt: { en: 'Some consumers now actively choose second-hand goods even when they can afford new products. What motivates this choice? What could sellers do to build confidence in used goods? Write at least 250 words.', zh: '一些消费者即使买得起新品，也会主动选择二手商品。是什么促使他们这样选择？卖家可以怎样增强人们对二手商品的信心？不少于 250 词。' },
    authoringBrief: '动机不能只有买不起，应写价值、独特性或减少浪费；信心措施为如实描述、可核验状态与合理售后。不编造保修法规或一律环保的结论。',
  },
  {
    slug: 'task2-two-part-career-breaks', task: 'task2', category: 'two-part', topic: 'work', sortOrder: 540,
    title: { zh: '职业中断后的重返职场', en: 'Returning to Work After a Career Break' },
    prompt: { en: 'Some people take a break from paid employment and later seek to return. What challenges might they face? How could employers assess their suitability fairly? Write at least 250 words.', zh: '一些人在暂时离开有报酬的工作后希望重返职场。他们可能面对哪些挑战？雇主可以怎样公平评估其岗位适合度？不少于 250 词。' },
    authoringBrief: '挑战写工具变化和履历空档偏见，评估写工作样本、相关能力及更新培训。不能假定中断原因或能力下降，也不把公平评估写成无条件录用。',
  },
  {
    slug: 'task2-two-part-health-information', task: 'task2', category: 'two-part', topic: 'health', sortOrder: 550,
    title: { zh: '日常健康信息的选择', en: 'Choosing Sources of Health Information' },
    prompt: { en: 'People can find a large amount of health information online. Why might they rely on this information before consulting a professional? How can they judge which sources deserve trust? Write at least 250 words.', zh: '人们可以在网上找到大量健康信息。为什么他们可能在咨询专业人士之前先依赖这些信息？他们应怎样判断哪些来源值得信任？不少于 250 词。' },
    authoringBrief: '先答可及性、隐私或准备咨询的动机，再答作者资质、证据与更新时间。文章讨论信息素养，不提供诊断治疗，不把受欢迎程度当可信证据。',
  },
  {
    slug: 'task2-two-part-customer-reviews', task: 'task2', category: 'two-part', topic: 'service', sortOrder: 560,
    title: { zh: '消费者为何依赖评价', en: 'Reliance on Customer Reviews' },
    prompt: { en: 'Many customers read online reviews before choosing a local service. Why have reviews become influential? What responsibilities do review platforms have towards users and businesses? Write at least 250 words.', zh: '许多顾客在选择本地服务前会阅读网络评价。评价为什么变得有影响力？评价平台对用户与商家有哪些责任？不少于 250 词。' },
    authoringBrief: '解释体验不可预先验证、同伴信息作用，再谈反操纵、申诉与透明排序。不能假定所有负面评价真实或商家申诉等同删评；两版使用同一假设维修服务。',
  },
  {
    slug: 'task2-two-part-night-time-cities', task: 'task2', category: 'two-part', topic: 'urban', sortOrder: 570,
    title: { zh: '城市夜间服务的需求', en: 'Demand for Services Outside Daytime Hours' },
    prompt: { en: 'Some cities are considering keeping more public facilities open in the evening. Who would benefit from longer opening hours? What factors should city authorities consider before making this change? Write at least 250 words.', zh: '一些城市正在考虑让更多公共设施在晚间开放。哪些人会受益于延长开放时间？城市管理部门实施前应考虑哪些因素？不少于 250 词。' },
    authoringBrief: '明确受益者如轮班员工或照护者，随后评估使用需求、人员成本、交通与邻里影响。不是简单利弊题，不能假设所有设施都应全天开放。',
  },
  {
    slug: 'task2-two-part-remote-friendships', task: 'task2', category: 'two-part', topic: 'society', sortOrder: 580,
    title: { zh: '迁居后维持友谊', en: 'Maintaining Friendships After Moving Away' },
    prompt: { en: 'People often move away from places where they formed close friendships. What makes these friendships difficult to maintain? What can individuals do to keep them meaningful over time? Write at least 250 words.', zh: '人们常会离开曾建立亲密友谊的地方。哪些因素使维系这些友谊变得困难？个人可以怎样让友谊长期保持意义？不少于 250 词。' },
    authoringBrief: '原因针对距离、作息与共享经历减少；措施为双方可持续联络、共同活动与合理期待。不得把消息频率直接等同亲密度，不重复既有科技讨论题的双边结构。',
  },
  {
    slug: 'task2-two-part-local-crafts', task: 'task2', category: 'two-part', topic: 'culture', sortOrder: 590,
    title: { zh: '传统手艺的代际传承', en: 'Passing Traditional Crafts to New Learners' },
    prompt: { en: 'Some traditional crafts attract few young learners despite public interest in handmade products. Why might young people hesitate to learn these crafts? How could training become more appealing without losing essential skills? Write at least 250 words.', zh: '尽管公众对手工产品有兴趣，一些传统手艺仍很少吸引年轻学徒。年轻人为何可能犹豫？怎样让培训更有吸引力，同时保留核心技艺？不少于 250 词。' },
    authoringBrief: '对照学习投入、收入不确定性和培训入口；建议分阶段实践与真实展示，保留扎实基本功。不能把年轻人描述成缺乏文化认同，也不承诺手工产品必有市场。',
  },
  {
    slug: 'task2-two-part-short-video-news', task: 'task2', category: 'two-part', topic: 'media', sortOrder: 600,
    title: { zh: '短视频新闻的吸引力与局限', en: 'Getting News Through Short Videos' },
    prompt: { en: 'Some audiences prefer short videos to longer reports when following the news. What makes this format attractive? What should viewers do to gain a fuller understanding of important issues? Write at least 250 words.', zh: '一些受众关注新闻时更喜欢短视频，而不是较长的报道。这种形式为何具有吸引力？观众应怎样更全面地理解重要议题？不少于 250 词。' },
    authoringBrief: '先写时间、视觉与进入门槛，再写补充背景、核对原始信息和多源阅读。不能将短视频一概判为虚假，或把篇幅长视为准确性的证明。',
  },
  {
    slug: 'task2-two-part-urban-wildlife', task: 'task2', category: 'two-part', topic: 'science', sortOrder: 610,
    title: { zh: '居民参与城市野生动物观察', en: 'Public Interest in Urban Wildlife' },
    prompt: { en: 'Some city residents have become interested in observing wildlife close to home. Why might this activity appeal to them? How can communities encourage it while protecting animals and their habitats? Write at least 250 words.', zh: '一些城市居民开始对观察家附近的野生动物感兴趣。这项活动为什么可能吸引他们？社区可以怎样鼓励观察，同时保护动物及其栖息地？不少于 250 词。' },
    authoringBrief: '动机可含接触自然与学习，措施为远距离观察、路线提示和保护敏感地点。不是论证公众科研的利弊；不建议投喂、捕捉，也不虚构物种行为。',
  },
  {
    slug: 'task2-two-part-accessible-travel', task: 'task2', category: 'two-part', topic: 'travel', sortOrder: 620,
    title: { zh: '旅行前的无障碍信息', en: 'Planning Trips with Accessibility Information' },
    prompt: { en: 'Travellers with mobility needs often spend considerable time checking whether destinations are accessible. Why is reliable information especially important to them? How could tourism providers improve this information? Write at least 250 words.', zh: '有行动便利需求的旅行者常花很多时间核查目的地是否方便通行。可靠的信息为什么对他们尤其重要？旅游服务方可以怎样改善这些信息？不少于 250 词。' },
    authoringBrief: '解释行程衔接和替代选择成本，再提出具体尺寸、路线照片、更新记录与可联系渠道。不要把“无障碍”当单一标签，不假设所有行动需求相同。',
  },
  {
    slug: 'task1-academic-table-library-branches', task: 'task1-academic', category: 'table', topic: 'service', sortOrder: 630,
    title: { zh: '表格：四间图书馆的资源与使用量', en: 'Table: Resources and Use at Four Libraries' },
    prompt: {
      en: 'The table gives hypothetical data for four library branches in one fictional town in 2025. Visits count entries, not unique people. Summarise the main features and make relevant comparisons. Write at least 150 words.\n\nBranch | Books (thousands) | Annual visits (thousands) | Study seats\nNorth | 40 | 120 | 80\nEast | 25 | 150 | 100\nSouth | 60 | 180 | 60\nWest | 30 | 90 | 120',
      zh: '下表为某虚构城镇四间图书馆分馆在 2025 年的假设数据。到访量按进入次数计，并非不同访客人数。概述主要特征并作相关比较，不少于 150 词。\n\n分馆｜藏书（千册）｜全年到访（千次）｜自习座位（个）\n北馆｜40｜120｜80\n东馆｜25｜150｜100\n南馆｜60｜180｜60\n西馆｜30｜90｜120',
    },
    authoringBrief: '南馆藏书和到访最高、座位最少；西馆座位最多、到访最少；东馆藏书最少但到访第二。三列单位不同，不相加；可算东馆每册对应6次年到访，但不能据此推断拥挤或服务质量。',
  },
  {
    slug: 'task1-academic-table-commuting-options', task: 'task1-academic', category: 'table', topic: 'urban', sortOrder: 640,
    title: { zh: '表格：同一路线的四种通勤方式', en: 'Table: Four Commuting Options on One Route' },
    prompt: {
      en: 'The table shows hypothetical results from a one-month comparison of four ways to travel along the same urban route. On time means arriving within the planned journey time. CU means fictional currency units. Summarise the main features and make comparisons. Write at least 150 words.\n\nMode | Mean journey (minutes) | Mean daily return cost (CU) | Trips on time (%)\nBus | 42 | 4 | 76\nTrain | 28 | 7 | 92\nBicycle | 35 | 1 | 96\nCar | 38 | 10 | 68',
      zh: '下表为一个月内比较同一城市路线四种出行方式的假设结果。“准时”指在计划行程时间内到达。CU 为虚构货币单位。概述主要特征并比较，不少于 150 词。\n\n方式｜平均单程时间（分钟）｜平均每日往返成本（CU）｜准时行程占比（%）\n公交｜42｜4｜76\n火车｜28｜7｜92\n自行车｜35｜1｜96\n汽车｜38｜10｜68',
    },
    authoringBrief: '火车最快，自行车最便宜且准时率最高；汽车最贵且准时率最低，公交最慢。火车比公交少14分钟，准时率高16个百分点；不要声称差异由拥堵、天气或班次导致，表内没有原因。',
  },
  {
    slug: 'task1-academic-table-training-outcomes', task: 'task1-academic', category: 'table', topic: 'education', sortOrder: 650,
    title: { zh: '表格：成人课程的报名与完成', en: 'Table: Enrolment and Completion of Adult Courses' },
    prompt: {
      en: 'The table presents hypothetical results for four adult courses at a fictional centre in 2025. Every person who completed a course answered its satisfaction survey. Summarise the main features and make comparisons. Write at least 150 words.\n\nCourse | Enrolled | Completed | Satisfied completers (%)\nDigital skills | 200 | 160 | 90\nLanguages | 150 | 135 | 80\nCooking | 120 | 90 | 100\nPhotography | 100 | 80 | 75',
      zh: '下表为某虚构中心 2025 年四门成人课程的假设结果。所有完课者都回答了各自课程的满意度调查。概述主要特征并比较，不少于 150 词。\n\n课程｜报名人数｜完课人数｜完课者中满意者占比（%）\n数字技能｜200｜160｜90\n语言｜150｜135｜80\n烹饪｜120｜90｜100\n摄影｜100｜80｜75',
    },
    authoringBrief: '数字技能报名与完课人数最高；语言完成率90%最高，烹饪75%最低；另两门完成率80%。烹饪完课者满意度100%，不是全体报名者100%。不得用满意度解释退课原因；百分比与人数分清。',
  },
  {
    slug: 'task1-academic-table-household-water', task: 'task1-academic', category: 'table', topic: 'environment', sortOrder: 660,
    title: { zh: '表格：不同规模家庭的用水', en: 'Table: Water Use by Household Size' },
    prompt: {
      en: 'The table gives hypothetical average daily water use by household size in a fictional district in 2025. Indoor and outdoor figures are per household, not per person. Summarise the main features and make comparisons. Write at least 150 words.\n\nPeople in household | Indoor use (litres/day) | Outdoor use (litres/day) | Total (litres/day)\n1 | 120 | 20 | 140\n2 | 195 | 35 | 230\n3 | 250 | 50 | 300\n4 | 300 | 60 | 360',
      zh: '下表为某虚构地区 2025 年按家庭人数划分的平均每日用水假设数据。室内、室外及合计均按每户计，不是每人。概述主要特征并比较，不少于 150 词。\n\n家庭人数｜室内（升/日）｜室外（升/日）｜合计（升/日）\n1｜120｜20｜140\n2｜195｜35｜230\n3｜250｜50｜300\n4｜300｜60｜360',
    },
    authoringBrief: '每户总用水随人数上升，按人均计算则为140、115、100、90升；室内始终占主体。四人户总量为一人户约2.57倍，而非4倍。没有家庭数量，不能算全区总用水；不推断节水意识或设施原因。',
  },
  {
    slug: 'task1-academic-line-library-loans', task: 'task1-academic', category: 'line-graph', topic: 'service', sortOrder: 670,
    title: { zh: '折线图：图书馆的实体与电子借阅', en: 'Line Graph: Physical and Digital Library Loans' },
    prompt: {
      en: 'The line graph is represented by the complete hypothetical data below for a fictional library network. Figures are annual loans in thousands, not borrowers. Summarise the trends and make comparisons. Write at least 150 words.\n\nYear | Physical books | E-books | Audiobooks\n2015 | 900 | 100 | 50\n2017 | 850 | 180 | 80\n2019 | 800 | 300 | 120\n2021 | 650 | 500 | 200\n2023 | 700 | 650 | 300',
      zh: '以下完整假设数据表示某虚构图书馆网络的折线图。单位为每年借阅千次，并非借阅人数。概述趋势并比较，不少于 150 词。\n\n年份｜实体书｜电子书｜有声书\n2015｜900｜100｜50\n2017｜850｜180｜80\n2019｜800｜300｜120\n2021｜650｜500｜200\n2023｜700｜650｜300',
    },
    authoringBrief: '实体书仍始终最高但先降后回升；电子书与有声书各观察期都升。实体与电子差距800千次缩至50千次；电子加有声在2021首次超过实体。总借阅1050增至1650千次；不得推断疫情或技术政策原因。',
  },
  {
    slug: 'task1-academic-line-river-ferry', task: 'task1-academic', category: 'line-graph', topic: 'urban', sortOrder: 680,
    title: { zh: '折线图：三条渡轮航线客流', en: 'Line Graph: Passenger Journeys on Three Ferry Routes' },
    prompt: {
      en: 'The complete hypothetical data below represent a line graph of annual passenger journeys on three ferry routes in a fictional city. Units are millions of journeys. Summarise the main trends and make comparisons. Write at least 150 words.\n\nYear | Route A | Route B | Route C\n2010 | 2.0 | 1.0 | 0.5\n2013 | 2.4 | 1.4 | 0.8\n2016 | 3.0 | 1.8 | 1.2\n2019 | 2.6 | 2.2 | 1.2\n2022 | 2.8 | 3.0 | 1.5',
      zh: '以下完整假设数据表示某虚构城市三条渡轮航线全年乘客出行次数的折线图，单位为百万次。概述主要趋势并比较，不少于 150 词。\n\n年份｜航线 A｜航线 B｜航线 C\n2010｜2.0｜1.0｜0.5\n2013｜2.4｜1.4｜0.8\n2016｜3.0｜1.8｜1.2\n2019｜2.6｜2.2｜1.2\n2022｜2.8｜3.0｜1.5',
    },
    authoringBrief: 'A在2016达峰3.0后回落再恢复；B持续增长并在最终观察点领先；C始终最低，2016至2019持平。B和C最终均为初值3倍，但绝对增量分别2.0与1.0百万；不能插值给出超越的确切年份。',
  },
  {
    slug: 'task1-academic-line-solar-output', task: 'task1-academic', category: 'line-graph', topic: 'environment', sortOrder: 690,
    title: { zh: '折线图：两座建筑的月度太阳能发电', en: 'Line Graph: Monthly Solar Electricity at Two Buildings' },
    prompt: {
      en: 'The complete hypothetical data below represent a line graph of monthly solar electricity output at two fictional buildings during one year. Values are megawatt-hours (MWh). Summarise the main features and make comparisons. Write at least 150 words.\n\nMonth | Building A | Building B\nJanuary | 8 | 10\nMarch | 16 | 18\nMay | 28 | 26\nJuly | 32 | 30\nSeptember | 22 | 24\nNovember | 10 | 14',
      zh: '以下完整假设数据表示两座虚构建筑在同一年部分月份的太阳能发电折线图，单位为兆瓦时（MWh）。概述主要特征并比较，不少于 150 词。\n\n月份｜建筑 A｜建筑 B\n1 月｜8｜10\n3 月｜16｜18\n5 月｜28｜26\n7 月｜32｜30\n9 月｜22｜24\n11 月｜10｜14',
    },
    authoringBrief: '两者在给出月份中均7月最高、1月最低；A在5月和7月高于B，其他给出月份相反。A峰谷差24，B为20MWh。缺少6个月，不能计算全年发电总量；不猜地理位置、天气或设备效率。',
  },
  {
    slug: 'task1-academic-line-internet-access', task: 'task1-academic', category: 'line-graph', topic: 'technology', sortOrder: 700,
    title: { zh: '折线图：不同年龄居民的家庭网络接入', en: 'Line Graph: Home Internet Access by Age Group' },
    prompt: {
      en: 'The complete hypothetical data below represent a line graph for a fictional region. Figures are percentages of people in each age group with internet access at home. These are repeated surveys, not a tracked group of individuals. Summarise and compare. Write at least 150 words.\n\nYear | Ages 18-34 | Ages 35-54 | Ages 55+\n2005 | 60 | 45 | 20\n2010 | 78 | 65 | 35\n2015 | 90 | 82 | 55\n2020 | 96 | 92 | 75',
      zh: '以下完整假设数据表示某虚构地区的折线图。数字为各年龄组中家中有网络接入的人所占百分比。各年为重复调查，并非追踪同一批个人。概述并比较，不少于 150 词。\n\n年份｜18—34 岁｜35—54 岁｜55 岁及以上\n2005｜60｜45｜20\n2010｜78｜65｜35\n2015｜90｜82｜55\n2020｜96｜92｜75',
    },
    authoringBrief: '各组持续上升，年轻组始终最高、年长组最低；增幅依次36、47、55个百分点。两端年龄组差距先由40升至43，再降至35和21个百分点，不能写全程缩小；不以接入率代替使用熟练度。',
  },
  {
    slug: 'task1-academic-line-evening-courses', task: 'task1-academic', category: 'line-graph', topic: 'education', sortOrder: 710,
    title: { zh: '折线图：三类晚间课程报名', en: 'Line Graph: Enrolment in Evening Courses' },
    prompt: {
      en: 'The complete hypothetical data below represent a line graph of annual course enrolments at a fictional adult education centre. One person may enrol in more than one course. Summarise the main trends and compare categories. Write at least 150 words.\n\nYear | Languages | Computing | Arts\n2020 | 240 | 180 | 120\n2021 | 220 | 220 | 140\n2022 | 200 | 280 | 160\n2023 | 220 | 340 | 160\n2024 | 260 | 400 | 180',
      zh: '以下完整假设数据表示某虚构成人教育中心每年课程报名人次的折线图。同一个人可报名多门课。概述主要趋势并比较，不少于 150 词。\n\n年份｜语言｜计算机｜艺术\n2020｜240｜180｜120\n2021｜220｜220｜140\n2022｜200｜280｜160\n2023｜220｜340｜160\n2024｜260｜400｜180',
    },
    authoringBrief: '计算机2021与语言并列，此后领先且增加220人次最多；语言先降后升，净增20；艺术最低，2022—2023持平。总报名540至840，不是独立学生数；不根据趋势断言就业市场需求原因。',
  },
  {
    slug: 'task1-academic-bar-leisure-age', task: 'task1-academic', category: 'bar-chart', topic: 'society', sortOrder: 720,
    title: { zh: '柱状图：年龄组与休闲活动', en: 'Bar Chart: Leisure Participation by Age Group' },
    prompt: {
      en: 'The hypothetical data below represent a bar chart from a survey in a fictional town in 2025. Figures show the percentage of each age group doing each activity at least once a week. People could select several activities. Summarise and compare. Write at least 150 words.\n\nActivity | Ages 18-29 | Ages 30-49 | Ages 50+\nTeam sports | 45 | 25 | 10\nWalking | 40 | 55 | 70\nGardening | 10 | 30 | 50\nReading | 35 | 40 | 45',
      zh: '以下假设数据表示某虚构城镇 2025 年调查的柱状图，数字为各年龄组每周至少参加一次相应活动的人所占百分比。每人可选多项。概述并比较，不少于 150 词。\n\n活动｜18—29 岁｜30—49 岁｜50 岁及以上\n团队运动｜45｜25｜10\n步行｜40｜55｜70\n园艺｜10｜30｜50\n阅读｜35｜40｜45',
    },
    authoringBrief: '年轻组团队运动最高，其余两组步行最高；园艺随年龄组差异最大为40个百分点，阅读最小为10。多选数据不合计100%，不可据此推断每人的活动次数或一生变化。',
  },
  {
    slug: 'task1-academic-bar-campus-transport', task: 'task1-academic', category: 'bar-chart', topic: 'urban', sortOrder: 730,
    title: { zh: '柱状图：三个校区的主要通勤方式', en: 'Bar Chart: Main Travel Modes at Three Campuses' },
    prompt: {
      en: 'The hypothetical data below represent a bar chart of students at three fictional campuses in 2025. Each student reported one main mode of travel to campus. Values are percentages within each campus. Summarise and compare. Write at least 150 words.\n\nMode | Campus A | Campus B | Campus C\nWalking | 30 | 15 | 10\nCycling | 25 | 20 | 10\nPublic transport | 35 | 45 | 30\nCar | 10 | 20 | 50',
      zh: '以下假设数据表示三个虚构校区 2025 年学生主要通勤方式的柱状图。每人只报告一种主要方式，单位为各校区学生百分比。概述并比较，不少于 150 词。\n\n方式｜校区 A｜校区 B｜校区 C\n步行｜30｜15｜10\n骑车｜25｜20｜10\n公共交通｜35｜45｜30\n汽车｜10｜20｜50',
    },
    authoringBrief: '每个校区四项合计100%；A、B公共交通占比最高，C汽车50%最高。步行加骑车分别55%、35%、20%。没有学生总数，不能比较实际人数；不推断校区地理位置或交通设施原因。',
  },
  {
    slug: 'task1-academic-bar-household-time', task: 'task1-academic', category: 'bar-chart', topic: 'work', sortOrder: 740,
    title: { zh: '柱状图：不同就业群体的家务时间', en: 'Bar Chart: Time Spent on Household Tasks' },
    prompt: {
      en: 'The hypothetical data below represent a bar chart from a fictional survey in 2025. Values are mean minutes per person per day spent on the listed tasks, including people reporting zero time. Summarise and compare. Write at least 150 words.\n\nTask | Full-time workers | Part-time workers | Retired adults\nCooking | 35 | 50 | 60\nCleaning | 20 | 35 | 40\nShopping | 15 | 25 | 30\nGardening | 10 | 15 | 35',
      zh: '以下假设数据表示一项虚构的 2025 年调查柱状图，单位为每人每天在列出事务上的平均分钟数，均值包含报告零分钟的人。概述并比较，不少于 150 词。\n\n事务｜全职工作者｜兼职工作者｜退休成年人\n做饭｜35｜50｜60\n清洁｜20｜35｜40\n购物｜15｜25｜30\n园艺｜10｜15｜35',
    },
    authoringBrief: '退休组四项均最高，全职组均最低；各组做饭最多。四项合计80、125、165分钟，只是列出任务，不是全部无偿劳动。园艺退休/全职为3.5倍；不能由就业类别推出因果或性别分工。',
  },
  {
    slug: 'task1-academic-bar-reusable-cups', task: 'task1-academic', category: 'bar-chart', topic: 'environment', sortOrder: 750,
    title: { zh: '柱状图：四家咖啡店的可重复用杯', en: 'Bar Chart: Reusable Cups at Four Cafes' },
    prompt: {
      en: 'The hypothetical data below represent a bar chart for four fictional cafes. Values are the percentage of takeaway drinks served in reusable cups during each year. Summarise the main features and make comparisons. Write at least 150 words.\n\nCafe | 2022 (%) | 2025 (%)\nHarbour | 15 | 35\nGarden | 25 | 45\nStation | 10 | 40\nMarket | 30 | 50',
      zh: '以下假设数据表示四家虚构咖啡店的柱状图，数字为各年外带饮品中使用可重复用杯的比例。概述主要特征并比较，不少于 150 词。\n\n咖啡店｜2022 年（%）｜2025 年（%）\n港湾｜15｜35\n花园｜25｜45\n车站｜10｜40\n市场｜30｜50',
    },
    authoringBrief: '四店均升，市场店两年最高；车站店由最低升至第三，增幅30个百分点最大且为原来4倍；其余均增20个百分点。无销量分母，不能算节省多少杯或全体加权比例；无政策信息，不推断涨幅原因。',
  },
  {
    slug: 'task1-academic-bar-museum-arrivals', task: 'task1-academic', category: 'bar-chart', topic: 'culture', sortOrder: 760,
    title: { zh: '柱状图：博物馆工作日与周末到访时段', en: 'Bar Chart: Museum Arrivals by Time of Day' },
    prompt: {
      en: 'The hypothetical data below represent a bar chart for a fictional museum. Values are average visitor arrivals per day in each two-hour interval, based on weekdays and weekend days in one month. The museum admits visitors only from 09:00 to 17:00. Summarise and compare. Write at least 150 words.\n\nArrival interval | Weekday | Weekend day\n09:00-10:59 | 80 | 60\n11:00-12:59 | 120 | 180\n13:00-14:59 | 100 | 240\n15:00-16:59 | 60 | 120',
      zh: '以下假设数据表示某虚构博物馆的柱状图，为一个月内工作日与周末每天各两小时时段的平均入馆人数。博物馆只在 09:00 至 17:00 接待入馆。概述并比较，不少于 150 词。\n\n入馆时段｜工作日｜周末一天\n09:00—10:59｜80｜60\n11:00—12:59｜120｜180\n13:00—14:59｜100｜240\n15:00—16:59｜60｜120',
    },
    authoringBrief: '工作日高峰11—13点120人，周末13—15点240人；只有最早时段工作日更多。平均每日合计360与600，周末高240人、约66.7%。入馆人数不是馆内同时人数；未知各类天数，不能求月总量。',
  },
  {
    slug: 'task1-academic-pie-council-budget', task: 'task1-academic', category: 'pie-chart', topic: 'urban', sortOrder: 770,
    title: { zh: '饼图：地方服务预算分配', en: 'Pie Charts: Allocation of a Local Services Budget' },
    prompt: {
      en: 'The complete hypothetical data below represent two pie charts for a fictional council. Each chart divides its total annual services budget into five categories. CU means fictional currency units. Summarise and compare. Write at least 150 words.\n\nTotal: 2015 = 20 million CU; 2025 = 30 million CU\nCategory | 2015 (%) | 2025 (%)\nTransport | 40 | 30\nParks | 25 | 30\nLibraries | 15 | 20\nWaste services | 10 | 15\nAdministration | 10 | 5',
      zh: '以下完整假设数据表示某虚构地方政府的两张饼图，各图将当年服务预算划分为五类。CU 为虚构货币单位。概述并比较，不少于 150 词。\n\n总预算：2015 年 2000 万 CU；2025 年 3000 万 CU\n类别｜2015 年（%）｜2025 年（%）\n交通｜40｜30\n公园｜25｜30\n图书馆｜15｜20\n垃圾服务｜10｜15\n行政｜10｜5',
    },
    authoringBrief: '两列各100%；总预算增50%。交通份额40%降至30%，金额却800万增至900万；2025交通和公园并列最高。行政金额200万降至150万，其余类别金额均上升。避免把占比下降写成金额下降，不推断政策动机。',
  },
  {
    slug: 'task1-academic-pie-waste-treatment', task: 'task1-academic', category: 'pie-chart', topic: 'environment', sortOrder: 780,
    title: { zh: '饼图：社区垃圾处理去向', en: 'Pie Charts: Treatment of Community Waste' },
    prompt: {
      en: 'The complete hypothetical data below represent two pie charts for a fictional community. Each tonne of collected household waste is assigned to one final treatment category. Summarise and compare. Write at least 150 words.\n\nTotal collected: 2020 = 1,000 tonnes; 2025 = 1,200 tonnes\nTreatment | 2020 (%) | 2025 (%)\nRecycling | 30 | 45\nComposting | 10 | 25\nLandfill | 50 | 20\nIncineration | 10 | 10',
      zh: '以下完整假设数据表示某虚构社区的两张饼图。每吨收集到的家庭垃圾只归入一种最终处理方式。概述并比较，不少于 150 词。\n\n收集总量：2020 年 1000 吨；2025 年 1200 吨\n处理方式｜2020 年（%）｜2025 年（%）\n回收｜30｜45\n堆肥｜10｜25\n填埋｜50｜20\n焚烧｜10｜10',
    },
    authoringBrief: '两列各100%；填埋由最大50%降至20%，回收成为最大45%；回收加堆肥40%升至70%。总量增20%，焚烧占比不变但100吨增至120吨，填埋500降至240吨。数据不代表垃圾产生总量或减排成效。',
  },
  {
    slug: 'task1-academic-pie-student-spending', task: 'task1-academic', category: 'pie-chart', topic: 'education', sortOrder: 790,
    title: { zh: '饼图：两类学生的个人月支出', en: 'Pie Charts: Monthly Personal Spending by Students' },
    prompt: {
      en: 'The complete hypothetical data below represent two pie charts of average monthly personal spending by students in one fictional town in 2025. Family-paid expenses are excluded. CU means fictional currency units. Summarise and compare. Write at least 150 words.\n\nTotal: living with family = 800 CU; renting = 1,200 CU\nCategory | With family (%) | Renting (%)\nHousing | 0 | 45\nFood | 30 | 25\nTransport | 25 | 10\nStudy materials | 20 | 10\nLeisure | 25 | 10',
      zh: '以下完整假设数据表示某虚构城镇 2025 年两类学生平均每月个人支出的两张饼图，不含家人代付费用。CU 为虚构货币单位。概述并比较，不少于 150 词。\n\n总额：与家人同住 800 CU；租房 1200 CU\n类别｜与家人同住（%）｜租房（%）\n住房｜0｜45\n食物｜30｜25\n交通｜25｜10\n学习资料｜20｜10\n休闲｜25｜10',
    },
    authoringBrief: '两列各100%；同住组食物占比最大，租房组住房最大。租房组食物占比较低但金额300CU高于240CU；住房540CU。同住住房0仅指个人支付，不意味着住宿无社会成本。不是追踪同一学生，不能推因果。',
  },
  {
    slug: 'task1-academic-pie-building-energy', task: 'task1-academic', category: 'pie-chart', topic: 'environment', sortOrder: 800,
    title: { zh: '饼图：两座公共建筑的能源来源', en: 'Pie Charts: Energy Sources for Two Public Buildings' },
    prompt: {
      en: 'The complete hypothetical data below represent pie charts of energy supplied to two fictional public buildings in 2025. On-site solar is separate from grid electricity. Summarise and compare. Write at least 150 words.\n\nTotal supplied: office = 1,000 MWh; library = 2,000 MWh\nSource | Office (%) | Library (%)\nGrid electricity | 50 | 40\nGas | 30 | 10\nDistrict heating | 15 | 35\nOn-site solar | 5 | 15',
      zh: '以下完整假设数据表示两座虚构公共建筑 2025 年获得能源来源的饼图。自有太阳能与电网电力分开统计。概述并比较，不少于 150 词。\n\n能源总量：办公楼 1000 兆瓦时；图书馆 2000 兆瓦时\n来源｜办公楼（%）｜图书馆（%）\n电网电力｜50｜40\n燃气｜30｜10\n区域供热｜15｜35\n自有太阳能｜5｜15',
    },
    authoringBrief: '两列各100%；电网电力都是最大来源，自有太阳能在办公楼最低、燃气在图书馆最低。图书馆太阳能300MWh为办公楼50的6倍；电网800对500。未知面积和电网结构，不能判断能效或全部可再生占比。',
  },
  {
    slug: 'task1-academic-process-paper-recycling', task: 'task1-academic', category: 'process', topic: 'environment', sortOrder: 810,
    title: { zh: '流程图：再生纸卷制作', en: 'Process: Producing Recycled Paper Rolls' },
    prompt: {
      en: 'The text diagram describes a hypothetical paper-recycling line. All stages and return flows are shown. Summarise the process. Write at least 150 words.\n\nCollected used paper -> 1. Hand sorting (non-paper items removed) -> 2. Shredding -> 3. Mixing with water -> 4. Screening (remaining contaminants removed) -> 5. Pressing into sheets -> 6. Heated drying -> 7. Winding into finished paper rolls.\nWater removed during pressing is collected, filtered and returned to stage 3. Additional fresh water also enters stage 3. Removed contaminants leave the system; no destination is specified.',
      zh: '文字流程图描述一条假设的废纸回收线，以下包含所有步骤和回流。请概述流程，不少于 150 词。\n\n收集的废纸 → 1. 人工分拣（移除非纸物品）→ 2. 切碎 → 3. 加水混合 → 4. 筛滤（去除剩余杂质）→ 5. 压成纸片 → 6. 加热干燥 → 7. 卷成成品纸卷。\n压制时排出的水被收集、过滤，再回到步骤 3；步骤 3 也补充新水。移除的杂质离开系统，但未说明去向。',
    },
    authoringBrief: '总览为从废纸到纸卷的七个编号主步骤，另有压制水过滤回用支线；按先清理、再成型干燥分组。废纸收集是输入，不误算成编号工序；不要补漂白、化学药品、时间、温度或“零废水”。',
  },
  {
    slug: 'task1-academic-process-seed-bank', task: 'task1-academic', category: 'process', topic: 'science', sortOrder: 820,
    title: { zh: '流程图：种子保存与定期复检', en: 'Process: Seed Storage and Periodic Testing' },
    prompt: {
      en: 'The text diagram shows a hypothetical seed-bank procedure, including its two decision points. Summarise the process. Write at least 150 words.\n\nSeeds received -> clean and label -> dry -> test a sample for germination.\nInitial test: if at least 80% germinate, seal the remaining seeds in containers and store in a cold room; otherwise request a replacement batch and restart.\nAfter 5 years in storage: test a new sample. If at least 80% germinate, reseal the remaining seeds and store for another 5 years before testing again. If below 80%, grow plants from viable seeds, collect new seeds, and return these to cleaning and labelling.',
      zh: '文字流程图展示一个假设的种子库程序，包含两个判断环节。请概述流程，不少于 150 词。\n\n接收种子 → 清理并贴标签 → 干燥 → 抽样测试发芽。\n初次测试：若至少 80% 发芽，将余下种子装容器密封，存入冷藏室；否则要求替换该批种子并重新开始。\n存储 5 年后再抽新样测试：若至少 80% 发芽，将余下种子重新密封，再存储 5 年后复检；若低于 80%，用有活力的种子培育植株、收集新种子，并让新种子返回清理贴标环节。',
    },
    authoringBrief: '突出接收筛选、冷藏、五年循环及低发芽率更新两条返回路径。80%恰好达标，初检不达标要求换批，复检不达标才培育更新，不能混写。不给冷藏温度，不把该假设程序写成通用科学标准。',
  },
  {
    slug: 'task1-academic-process-device-refurbishment', task: 'task1-academic', category: 'process', topic: 'technology', sortOrder: 830,
    title: { zh: '流程图：捐赠平板的翻新与分发', en: 'Process: Refurbishing Donated Tablets' },
    prompt: {
      en: 'The text diagram shows a hypothetical programme for donated tablet computers. Summarise every main route. Write at least 150 words.\n\nDonation received -> record device -> securely erase stored data -> inspect hardware.\nIf repairable: repair or replace faulty parts -> install the standard software -> run final tests. Devices passing tests go to cleaning, packaging and distribution to learners. Devices failing tests return once to repair and are tested again; a second failure goes to recycling.\nIf not repairable at inspection: send directly to recycling. Recycling separates reusable materials; those materials leave this programme. No further route is specified.',
      zh: '文字流程图展示一个假设的捐赠平板电脑处理项目。请概述各条主要路线，不少于 150 词。\n\n收到捐赠 → 登记设备 → 安全清除存储数据 → 检查硬件。\n如可维修：维修或替换故障部件 → 安装标准软件 → 最终测试。通过者进入清洁、包装和向学习者分发；未通过者返回维修一次，再测试，第二次仍失败则进入回收。\n硬件检查时若认定不可维修，则直接回收。回收阶段分离可再用材料，材料随后离开本项目，未说明后续去向。',
    },
    authoringBrief: '概括登记清除、检查分流、翻新测试、分发或回收；失败只允许返修一次，不能写无限循环。初检即不可修与二次测试失败两条回收入口都需覆盖；不要补软件品牌、成本或数据泄漏结论。',
  },
  {
    slug: 'task1-academic-map-community-garden', task: 'task1-academic', category: 'map', topic: 'environment', sortOrder: 840,
    title: { zh: '地图：社区花园前后改造', en: 'Maps: Changes to a Community Garden' },
    prompt: {
      en: 'The text maps show a hypothetical community garden in 2015 and 2025. Each map is the same 3-by-3 grid of equal plots; north is at the top and west on the left. Paths between all plots, the perimeter fence and the entrance at the south-centre boundary are unchanged. Summarise and compare. Write at least 150 words.\n\n2015 (each line is west to east)\nNorth: trees | lawn | storage shed\nMiddle: flower beds | fountain | lawn\nSouth: vegetable beds | entrance plaza | car park\n\n2025\nNorth: trees | greenhouse | storage shed\nMiddle: flower beds | seating area | pond\nSouth: vegetable beds | entrance plaza | bicycle parking',
      zh: '文字地图展示一个假设社区花园在 2015 与 2025 年的布局。两图均为相同的 3×3 等大地块网格，上北、左西。各地块间的路径、外围围栏和南侧边界中央入口均未改变。概述并比较，不少于 150 词。\n\n2015 年（每行从西到东）\n北排：树木｜草坪｜储物棚\n中排：花坛｜喷泉｜草坪\n南排：菜地｜入口广场｜停车场\n\n2025 年\n北排：树木｜温室｜储物棚\n中排：花坛｜座椅区｜池塘\n南排：菜地｜入口广场｜自行车停车区',
    },
    authoringBrief: '四处替换：北中草坪变温室、中部喷泉变座椅区、东中草坪变池塘、东南停车场变自行车区；其余五块与路径入口不变。不能说面积扩大、树木减少或入口搬迁；图无动机，不补客流或环保成效。',
  },
  {
    slug: 'task1-academic-map-library-redesign', task: 'task1-academic', category: 'map', topic: 'service', sortOrder: 850,
    title: { zh: '地图：图书馆室内布局调整', en: 'Maps: Redesign of a Library Interior' },
    prompt: {
      en: 'The text plans show a hypothetical library before and after a redesign. Both use the same 3-by-3 grid of equal zones; north is up and west is left. Outer walls, corridors between zones and the only entrance in the south-centre wall remain unchanged. Summarise and compare. Write at least 150 words.\n\nBefore (west to east in each row)\nNorth: reference books | quiet study | staff room\nMiddle: fiction | catalogue desks | computers\nSouth: newspapers | entrance and loans desk | children\n\nAfter\nNorth: reference books | quiet study | staff room\nMiddle: fiction | group study | children\nSouth: computers | entrance and self-service loans | cafe',
      zh: '文字平面图展示一间假设图书馆改造前后的布局。两图使用相同的 3×3 等大区域网格，上北、左西。外墙、区间走廊及南墙中央的唯一入口不变。概述并比较，不少于 150 词。\n\n改造前（每行从西到东）\n北排：参考书｜安静自习｜员工室\n中排：小说｜目录查询桌｜电脑\n南排：报刊｜入口及借还柜台｜儿童区\n\n改造后\n北排：参考书｜安静自习｜员工室\n中排：小说｜小组学习｜儿童区\n南排：电脑｜入口及自助借还｜咖啡区',
    },
    authoringBrief: '北排三块及西中小说区不变；电脑由东中移至西南，儿童区由东南移至东中；中部新增小组学习，东南咖啡区，柜台改自助。报刊和目录桌未在新图出现，不臆测搬到别层；外形面积不变。',
  },
  {
    slug: 'task1-academic-map-riverside-site', task: 'task1-academic', category: 'map', topic: 'urban', sortOrder: 860,
    title: { zh: '地图：河畔场地的更新', en: 'Maps: Redevelopment of a Riverside Site' },
    prompt: {
      en: 'The text maps show a hypothetical riverside site in 2000 and 2025. Each uses the same 3-by-3 grid of equal plots; north is up and west is left. A river runs along the eastern boundary and a road along the southern boundary. The gate at the centre of the southern boundary and paths between plots are unchanged. Summarise and compare. Write at least 150 words.\n\n2000 (west to east)\nNorth: warehouse | warehouse | loading yard\nMiddle: offices | workshop | loading yard\nSouth: car park | gate plaza | car park\n\n2025\nNorth: market hall | arts centre | riverside garden\nMiddle: offices | apartments | riverside garden\nSouth: bus stop plaza | gate plaza | bicycle parking',
      zh: '文字地图展示一处假设河畔场地在 2000 与 2025 年的布局。两图均为相同的 3×3 等大地块网格，上北、左西。河流沿东侧边界，道路沿南侧边界；南边界中央大门与地块间路径不变。概述并比较，不少于 150 词。\n\n2000 年（每行从西到东）\n北排：仓库｜仓库｜装卸场\n中排：办公室｜车间｜装卸场\n南排：停车场｜大门广场｜停车场\n\n2025 年\n北排：市场大厅｜艺术中心｜河畔花园\n中排：办公室｜公寓｜河畔花园\n南排：公交站广场｜大门广场｜自行车停车区',
    },
    authoringBrief: '总体由仓储与作业用途转成市场、文化、住宅及公共空间；两块东侧装卸场均变花园。办公室、西侧位置不变，大门也不变；西南停车场改公交站广场，东南改自行车区。不能编桥梁、建筑高度或改造原因。',
  },
  {
    slug: 'task1-general-formal-room-enquiry', task: 'task1-general', category: 'letter-formal', topic: 'service', sortOrder: 870,
    title: { zh: '正式信：咨询图书馆活动室', en: 'Formal Letter: Enquiring About a Library Room' },
    prompt: {
      en: 'In this fictional situation, you organise a language-practice group of six adults. You want a quiet room at the public library for a regular weekend meeting. Write to the library manager. In your letter:\n- explain the group and the purpose of its meetings;\n- describe the room and access arrangements you need;\n- ask about availability, booking rules and any charges.\nUse a formal, polite tone. Ask for missing details; do not invent fees or exact dates. Write at least 150 words. Begin: Dear Sir or Madam,',
      zh: '在这一虚构情境中，你组织了一个六名成年人的语言练习小组，希望在公共图书馆借用安静房间，定期于周末见面。写信给图书馆负责人：①说明小组及聚会目的；②描述所需房间和进入安排；③询问可用时段、预约规则与收费。使用正式礼貌语气，不足信息应询问，不编造费用或具体日期。不少于 150 词，以 Dear Sir or Madam, 开头。',
    },
    authoringBrief: '三段展开组织目的、六人安静讨论空间及周末接入、具体询问。可提出座椅和便于找到入口等合理需求，不声称设施存在或预约已获批。低高版保持同样的六人规模与询问；用正式称呼和 Yours faithfully 结尾。',
  },
  {
    slug: 'task1-general-formal-lost-property', task: 'task1-general', category: 'letter-formal', topic: 'travel', sortOrder: 880,
    title: { zh: '正式信：查询列车遗失物', en: 'Formal Letter: Enquiring About a Lost Bag' },
    prompt: {
      en: 'In this fictional situation, you left a grey canvas bag on a train earlier this week. It contained a green notebook and a reusable water bottle. Write to the railway lost-property office. In your letter:\n- explain what happened and identify the bag;\n- explain why you would like it returned;\n- ask how to check whether it has been found and arrange collection.\nThe notebook contains your own course notes. Do not invent a train number, precise date, monetary value or recovery result. Use a formal tone. Write at least 150 words. Begin: Dear Sir or Madam,',
      zh: '在这一虚构情境中，本周较早时你把一个灰色帆布包遗落在列车上，包里有一本绿色笔记本和一个可重复用水瓶。写信给铁路失物办公室：①说明经过并描述包；②解释希望找回的原因；③询问怎样核查是否找到及安排领取。笔记本有你自己的课程笔记。不要编造车次、精确日期、金额或已找回的结果。用正式语气，不少于 150 词，以 Dear Sir or Madam, 开头。',
    },
    authoringBrief: '固定灰包、绿本、水瓶和课程笔记，解释重做笔记的不便即可。向工作人员询问还需哪些行程资料，不能补造车次或保证找到。请求查询与预约领取保持条件语气，称呼与 Yours faithfully 配套。',
  },
  {
    slug: 'task1-general-formal-volunteer-application', task: 'task1-general', category: 'letter-formal', topic: 'society', sortOrder: 890,
    title: { zh: '正式信：申请社区活动志愿岗位', en: 'Formal Letter: Applying for a Community Volunteer Role' },
    prompt: {
      en: 'In this fictional situation, a community centre has advertised for volunteers at a repair day. You want a non-technical role welcoming visitors. You already help greet people and organise materials at a weekly reading group. Write to the organiser. In your letter:\n- explain why the role interests you;\n- describe your relevant experience;\n- ask about duties and preparation.\nYou can attend either the morning or afternoon session. Do not invent qualifications, employment history, pay or exact dates. Use a formal tone. Write at least 150 words. Begin: Dear Sir or Madam,',
      zh: '在这一虚构情境中，社区中心为维修活动日招募志愿者。你希望做迎接访客的非技术工作；你已有在每周读书小组接待成员、整理材料的经验。写信给组织者：①说明感兴趣的原因；②描述相关经验；③询问职责与准备事项。你可参加上午或下午场。不要编造资格证、工作经历、报酬或具体日期。用正式语气，不少于 150 词，以 Dear Sir or Madam, 开头。',
    },
    authoringBrief: '申请的是接待而非维修技师，经验只能从读书小组展开为迎接、引导和材料整理。表达可参加两种时段并请求安排，不声称被录用。高版升级具体关联与礼貌程度，不能增加资历。',
  },
  {
    slug: 'task1-general-formal-bus-shelter', task: 'task1-general', category: 'letter-formal', topic: 'urban', sortOrder: 900,
    title: { zh: '正式信：建议改善公交候车环境', en: 'Formal Letter: Suggesting Improvements to a Bus Stop' },
    prompt: {
      en: 'In this fictional situation, you use the bus stop beside the community sports centre after a weekly group activity. The stop has neither a shelter nor a bench. Write to the local transport authority. In your letter:\n- explain when and why you use the stop;\n- describe the difficulties of waiting there in wet weather;\n- suggest practical improvements and ask for a response.\nUse a formal, constructive tone. You may suggest a shelter and seating, but do not invent accident reports, passenger counts, costs or exact dates. Write at least 150 words. Begin: Dear Sir or Madam,',
      zh: '在这一虚构情境中，你每周参加完集体活动后会使用社区体育中心旁的公交站。该站没有候车棚，也没有座椅。写信给当地交通管理部门：①说明何时、为何使用此站；②描述雨天等车的困难；③提出实际改进建议并请求答复。使用正式、建设性的语气，可建议遮雨设施与座椅，不编造事故、客流数字、成本或具体日期。不少于 150 词，以 Dear Sir or Madam, 开头。',
    },
    authoringBrief: '依照已知无遮雨无座椅，写雨天衣物被淋湿和站立等待的不便；提出保留通行空间的棚与座椅，请求评估。不得变成已经发生伤害的投诉，或替政府承诺施工时间。',
  },
  {
    slug: 'task1-general-semi-formal-neighbour-noise', task: 'task1-general', category: 'letter-semi-formal', topic: 'society', sortOrder: 910,
    title: { zh: '半正式信：向邻居说明装修噪声', en: 'Semi-Formal Letter: Warning a Neighbour About Noise' },
    prompt: {
      en: 'In this fictional situation, you know your neighbour Alex but are not close friends. You plan to fit shelves on a shared wall on Saturday morning, and some drilling will be needed. Write to Alex. In your letter:\n- explain the work and why you are writing in advance;\n- acknowledge the possible disturbance and suggest ways to limit it;\n- ask whether the proposed morning causes a problem and offer to discuss another time.\nDo not invent an agreed time, professional booking, cost or building permission. Use a considerate, semi-formal tone. Write at least 150 words. Begin: Dear Alex,',
      zh: '在这一虚构情境中，你认识邻居 Alex，但并非好友。你计划周六上午在共用墙上装架子，需要钻孔。写信给 Alex：①说明工作内容和提前告知的原因；②承认可能造成打扰，并提出减少影响的方法；③询问该上午是否不方便，并表示可商量其他时间。不要编造已约定时刻、专业施工预约、费用或建筑许可。使用体谅对方的半正式语气，不少于 150 词，以 Dear Alex, 开头。',
    },
    authoringBrief: '既表达提前通知也给邻居真实协商空间；可集中钻孔、先做好准备，不承诺完全无声或确定分钟数。周六上午只是提议，不能写成对方已同意。称名并以 Kind regards 等适度礼貌结尾。',
  },
  {
    slug: 'task1-general-semi-formal-training-request', task: 'task1-general', category: 'letter-semi-formal', topic: 'work', sortOrder: 920,
    title: { zh: '半正式信：向经理申请表达培训', en: 'Semi-Formal Letter: Requesting Presentation Training' },
    prompt: {
      en: 'In this fictional situation, your manager is Ms Patel. You give short updates at weekly team meetings and want to attend a presentation workshop on a Wednesday afternoon. Write to her. In your letter:\n- explain the skill you want to improve;\n- describe how the workshop could help your work;\n- request permission to attend and suggest how to organise your tasks that afternoon.\nNo fee, date or colleague cover has been confirmed. Ask about arrangements instead of inventing them. Use a professional, semi-formal tone. Write at least 150 words. Begin: Dear Ms Patel,',
      zh: '在这一虚构情境中，你的经理是 Patel 女士。你在每周团队会议上做简短汇报，希望参加周三下午的一场演讲工作坊。写信给她：①说明想改进的技能；②描述培训可能怎样帮助工作；③请求参加许可，并建议安排当天下午的任务。费用、日期或同事代班均未确认，应询问而非编造。使用专业的半正式语气，不少于 150 词，以 Dear Ms Patel, 开头。',
    },
    authoringBrief: '用每周简报串联结构清楚、表达自信与团队理解，写可提前完成常规任务或协商交接。培训效果保持可能性；不能声称同事已答应、课程已付款或经理必须批准。',
  },
  {
    slug: 'task1-general-semi-formal-landlord-repair', task: 'task1-general', category: 'letter-semi-formal', topic: 'service', sortOrder: 930,
    title: { zh: '半正式信：请房东维修漏水龙头', en: 'Semi-Formal Letter: Requesting a Tap Repair' },
    prompt: {
      en: 'In this fictional situation, you rent a flat from Ms Lee, whom you have met several times. The kitchen tap continues to drip when turned off, although it still supplies water normally. Write to her. In your letter:\n- describe the problem clearly;\n- explain the inconvenience and your concern about wasted water;\n- ask for a repair and offer to discuss access to the flat.\nYou are usually home in the evenings. Do not invent damage, repair bills, a diagnosis or a confirmed visit. Use a polite, semi-formal tone. Write at least 150 words. Begin: Dear Ms Lee,',
      zh: '在这一虚构情境中，你租住 Lee 女士的公寓，已与她见过几次。厨房水龙头关紧后仍滴水，但正常供水。写信给她：①清楚描述问题；②说明不便及对浪费水的担忧；③请求维修，并表示可商量进屋时间。你通常晚上在家。不要编造财物损坏、维修账单、故障诊断或已确定的上门安排。使用礼貌的半正式语气，不少于 150 词，以 Dear Ms Lee, 开头。',
    },
    authoringBrief: '保持问题为关后滴水而非停水或水灾；可写滴水声与担忧，不加损失金额。晚间可接待只是安排建议，技术原因与费用请房东确认。两版事实相同，高版组织更清晰、请求更得体。',
  },
  {
    slug: 'task1-general-semi-formal-reference-request', task: 'task1-general', category: 'letter-semi-formal', topic: 'education', sortOrder: 940,
    title: { zh: '半正式信：请老师提供志愿推荐', en: 'Semi-Formal Letter: Requesting a Volunteer Reference' },
    prompt: {
      en: 'In this fictional situation, you completed Mr Brown\'s public-speaking course. You prepared group discussion notes and regularly helped classmates practise. You are applying to help lead a community reading group, which asks for a reference. Write to Mr Brown. In your letter:\n- remind him of your participation in the course;\n- explain the volunteer role and why you are applying;\n- ask whether he can provide a reference and what information he needs.\nDo not invent grades, awards, a submission deadline or his agreement. Use a respectful, semi-formal tone. Write at least 150 words. Begin: Dear Mr Brown,',
      zh: '在这一虚构情境中，你修完了 Brown 先生的演讲课，曾准备小组讨论笔记并经常帮助同学练习。你正在申请协助带领社区读书小组，该岗位需要推荐意见。写信给 Brown 先生：①提醒他你在课程中的参与；②说明志愿岗位和申请原因；③询问他是否愿意推荐及需要哪些资料。不要编造成绩、奖项、提交期限或老师已同意。使用尊重的半正式语气，不少于 150 词，以 Dear Mr Brown, 开头。',
    },
    authoringBrief: '只用给定课堂表现说明带领讨论的相关能力，志愿申请尚未成功。请求而非代写老师评价，主动提供岗位说明但不编造材料地址、分数或期限。两版不得新增成绩来制造高分版优势。',
  },
  {
    slug: 'task1-general-semi-formal-meeting-change', task: 'task1-general', category: 'letter-semi-formal', topic: 'culture', sortOrder: 950,
    title: { zh: '半正式信：协调读书会改期', en: 'Semi-Formal Letter: Rearranging a Reading Group Meeting' },
    prompt: {
      en: 'In this fictional situation, your reading group normally meets in a library room on Tuesday evenings. The room will be unavailable for the next meeting because of repairs. You know the coordinator, Sam. Write to Sam. In your letter:\n- explain why the usual meeting cannot go ahead there;\n- suggest Thursday evening as an alternative, subject to room availability;\n- offer to help check arrangements and inform members once confirmed.\nDo not invent an exact date, a new booking or members\' consent. Use a cooperative, semi-formal tone. Write at least 150 words. Begin: Dear Sam,',
      zh: '在这一虚构情境中，你的读书小组通常周二晚上在图书馆活动室聚会。因维修，该房间下次聚会时无法使用。你认识协调人 Sam。写信给 Sam：①解释为何无法照常在此举行；②建议改为周四晚上，但需确认房间可用；③表示愿意协助核查安排，并在确认后通知成员。不要编造具体日期、新预约或成员同意。使用合作的半正式语气，不少于 150 词，以 Dear Sam, 开头。',
    },
    authoringBrief: '先说明维修影响下一次聚会，再提出有条件的周四方案并分清核实和通知顺序。不能把提议写成已经改期或保证人人有空，不加维修结束日期。结尾请求协调人意见，保持熟悉但专业。',
  },
  {
    slug: 'task1-general-informal-weekend-visit', task: 'task1-general', category: 'letter-informal', topic: 'travel', sortOrder: 960,
    title: { zh: '非正式信：邀请朋友来访', en: 'Informal Letter: Inviting a Friend to Visit' },
    prompt: {
      en: 'In this fictional situation, you want your friend Jamie to visit your town for two days in early summer. You can offer a spare room, and you would like to visit the local museum and riverside park together. Write to Jamie. In your letter:\n- invite your friend and explain why you would enjoy the visit;\n- describe accommodation and possible activities;\n- ask about suitable dates and anything your friend would like to do.\nNo dates or tickets are booked. Do not invent prices, addresses or confirmed opening hours. Use an informal, friendly tone. Write at least 150 words. Begin: Dear Jamie,',
      zh: '在这一虚构情境中，你想邀请朋友 Jamie 初夏来镇上住两天。你有空房间可供住宿，并希望一起去本地博物馆与河畔公园。写信给 Jamie：①发出邀请并解释为何期待见面；②介绍住宿与可考虑的活动；③询问合适日期以及朋友想做什么。尚未订日期或门票，不编造价格、地址或确定营业时间。使用亲切的非正式语气，不少于 150 词，以 Dear Jamie, 开头。',
    },
    authoringBrief: '用两天、初夏、空房间及两处给定地点展开可调整计划，不凭空宣称免费门票或固定展览。问日期和偏好使邀请留有余地；两版都亲切，高版不是改成商务通知。',
  },
  {
    slug: 'task1-general-informal-borrowed-bicycle', task: 'task1-general', category: 'letter-informal', topic: 'society', sortOrder: 970,
    title: { zh: '非正式信：借来的自行车爆胎', en: 'Informal Letter: Apologising About a Borrowed Bicycle' },
    prompt: {
      en: 'In this fictional situation, your friend Chris lent you a bicycle for an agreed shopping trip. A tyre went flat during the trip, and you stopped riding immediately. Write to Chris. In your letter:\n- explain what happened;\n- apologise and say how you plan to put things right;\n- ask whether your repair and return plan would be convenient.\nYou intend to arrange a repair before returning it, but no booking, cause or cost is confirmed. Do not invent an accident or further damage. Use an informal, considerate tone. Write at least 150 words. Begin: Dear Chris,',
      zh: '在这一虚构情境中，朋友 Chris 同意借自行车给你购物。途中一个轮胎没气了，你立即停止骑行。写信给 Chris：①解释发生了什么；②道歉并说明补救打算；③询问维修和归还方案是否方便。你计划修好再还，但尚未预约，也未确认原因或费用。不要编造事故或其他损坏。使用体贴的非正式语气，不少于 150 词，以 Dear Chris, 开头。',
    },
    authoringBrief: '道歉不等于虚构过失原因，保留突然漏气、立即停骑；维修是待安排，不写已修好或具体金额。询问朋友是否急用并协商归还，低高版行动与时间状态一致。',
  },
  {
    slug: 'task1-general-informal-cooking-hobby', task: 'task1-general', category: 'letter-informal', topic: 'health', sortOrder: 980,
    title: { zh: '非正式信：向朋友分享烹饪兴趣', en: 'Informal Letter: Sharing a New Cooking Hobby' },
    prompt: {
      en: 'In this fictional situation, you recently joined a beginner cooking group at a community centre. Members practise simple vegetable dishes and share ideas. Your friend Taylor has said they want to learn to cook. Write to Taylor. In your letter:\n- describe the group and what you do there;\n- explain what you enjoy about learning this way;\n- invite your friend to try a session and ask about availability.\nThe next session time, fees and spare places have not been checked. Do not invent these or claim health results. Use an informal, encouraging tone. Write at least 150 words. Begin: Dear Taylor,',
      zh: '在这一虚构情境中，你最近参加了社区中心的初学者烹饪小组，成员练习简单蔬菜菜肴并交流想法。朋友 Taylor 曾表示想学做饭。写信给 Taylor：①描述小组和活动；②说明为何喜欢这种学习方式；③邀请朋友试上一节，并询问有空的时间。下次时间、收费和剩余名额尚未核查，不要编造这些信息或健康效果。使用鼓励性的非正式语气，不少于 150 词，以 Dear Taylor, 开头。',
    },
    authoringBrief: '体验可围绕动手练习、互相提问与分享简单做法，避免捏造资深名厨、获奖或减重。邀请以先确认空位为条件，不暗示已经替朋友报名；保持朋友间自然语气。',
  },
  {
    slug: 'task1-general-informal-house-sitting', task: 'task1-general', category: 'letter-informal', topic: 'service', sortOrder: 990,
    title: { zh: '非正式信：请朋友临时照看住处', en: 'Informal Letter: Asking a Friend to Check Your Home' },
    prompt: {
      en: 'In this fictional situation, you will be away for a week and hope your friend Morgan can check your flat. Two indoor plants need watering once during that week, and letters should be brought in from the mailbox. Write to Morgan. In your letter:\n- explain your request and why you are asking this friend;\n- describe the two tasks clearly;\n- ask whether they can help and offer to arrange a key handover if they agree.\nNo exact travel dates or handover are agreed. Do not invent an address, access code, emergency or extra chores. Use an informal, appreciative tone. Write at least 150 words. Begin: Dear Morgan,',
      zh: '在这一虚构情境中，你将离开一周，希望朋友 Morgan 帮忙查看公寓。两盆室内植物需在该周浇水一次，还需将信箱中的信收进屋。写信给 Morgan：①说明请求和为何向朋友求助；②清楚说明这两项任务；③询问是否方便帮忙，若同意再商量交接钥匙。尚未确定具体出行日期或交接，不编造地址、门禁码、紧急事件或额外家务。使用感激的非正式语气，不少于 150 词，以 Dear Morgan, 开头。',
    },
    authoringBrief: '任务仅两盆植物一周浇一次和收信；不要改成每天浇水或照顾宠物。可说信任朋友做事细心，但不杜撰其过往服务。询问意愿在交钥匙安排之前，不能写朋友已答应。',
  },
  {
    slug: 'task1-general-informal-thank-you-help', task: 'task1-general', category: 'letter-informal', topic: 'society', sortOrder: 1000,
    title: { zh: '非正式信：感谢朋友帮助搬家', en: 'Informal Letter: Thanking a Friend for Moving Help' },
    prompt: {
      en: 'In this fictional situation, your friend Casey helped you move by packing books and labelling boxes. You have now unpacked and settled into your new home. Write to Casey. In your letter:\n- thank your friend for the specific help;\n- explain how it made the move easier and describe settling in;\n- invite your friend for a simple meal and ask when they are free.\nDo not invent a paid service, gift value, address, exact date or confirmed visit. Use a warm, informal tone. Write at least 150 words. Begin: Dear Casey,',
      zh: '在这一虚构情境中，朋友 Casey 帮你打包书籍并给纸箱贴标签，协助搬家。你现已拆箱并在新家安顿下来。写信给 Casey：①感谢这项具体帮助；②解释它怎样让搬家更轻松，并说说安顿情况；③邀请朋友来吃顿便饭，询问何时有空。不要编造付费服务、礼物金额、地址、具体日期或已确定的来访。使用温暖的非正式语气，不少于 150 词，以 Dear Casey, 开头。',
    },
    authoringBrief: '感谢与作用逐一对应：书打包方便搬运、标签便于找到物品；已拆箱可以自然写现在有时间见面。饭局仍待朋友选时间，不补房屋面积或昂贵礼物；高版应更具体自然而非正式客套。',
  },
];
