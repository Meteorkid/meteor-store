/** 浏览器安全的栏目配置；协议校验留在 types.ts。 */
export const DAILY_EDITION_CHANNEL_IDS = ['english', 'papers', 'ai', 'events', 'open-source', 'competitions', 'internships'] as const;
export const DAILY_CHANNEL_IDS = [...DAILY_EDITION_CHANNEL_IDS, 'masters'] as const;

export const dailyChannels = [
  { id: 'english', zh: '每日英语', en: 'Daily English', descriptionZh: '几个表达，一段阅读，一次小练习。', descriptionEn: 'Expressions, a short read and a quick quiz.' },
  { id: 'papers', zh: '每日论文', en: 'Daily Papers', descriptionZh: '从研究问题出发，找到值得读的论文。', descriptionEn: 'Research questions and papers worth reading.' },
  { id: 'ai', zh: 'AI 圈大事', en: 'AI Briefing', descriptionZh: '有出处的消息，读完再看原文。', descriptionEn: 'Sourced updates with links to the original.' },
  { id: 'events', zh: '发布会日历', en: 'Events', descriptionZh: '近期预告、当天活动与官方回放。', descriptionEn: 'Upcoming events, live sessions and replays.' },
  { id: 'open-source', zh: '每日开源项目', en: 'Open-source Pick', descriptionZh: '每天探索一个经过实时核验的开源项目。', descriptionEn: 'Explore one live-checked open-source project each day.' },
  { id: 'competitions', zh: '每日竞赛', en: 'Contest Watch', descriptionZh: '官方编程赛事、开赛时间与参与要求。', descriptionEn: 'Official programming contests, start times and requirements.' },
  { id: 'internships', zh: '每日实习', en: 'Internship Watch', descriptionZh: '仍在招聘的具体岗位，注明地点和申请要求。', descriptionEn: 'Active student roles with locations and eligibility details.' },
  { id: 'masters', zh: '硕士申请', en: 'Master’s applications', descriptionZh: '全年申请日历，关注项目与提交截止。', descriptionEn: 'Year-round application rounds and deadlines.' },
] as const;

export const dailyEditionChannels = dailyChannels.filter(channel => channel.id !== 'masters');

