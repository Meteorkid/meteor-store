/**
 * 国家级 A 类名称与主办单位来自广师大 2025 校表；年度窗口来自公开竞赛月历。
 * 新增年份时追加 schedules，不覆盖旧年份；没有可信公开日期就保持空，不能推测。
 */
import type { LocalizedText } from './blog-sections';

export interface CompetitionDateWindow {
  year: number;
  /** YYYY-MM; null when the public source only gives a multi-track range. */
  start: string | null;
  end: string | null;
  startLabel: string;
  endLabel: string;
  sourceUrl: string;
}

export interface NationalCompetition {
  id: string;
  order: number;
  name: string;
  organizer: string;
  officialUrl: string | null;
  field: string;
  classificationYear: number;
  schedules: CompetitionDateWindow[];
}

export const competitionCalendarYears = [2026, 2025] as const;
export type CompetitionCalendarYear = (typeof competitionCalendarYears)[number];

export const competitionSources = {
  classification2025: 'https://gpnu.edu.cn/info/1039/61234.htm',
  classification2026: 'https://www.gpnu.edu.cn/info/1039/65303.htm',
  calendar2025: 'https://jwc.svcci.cn/info/1018/1843.htm',
  calendar2026: 'https://jjglxy.sxfu.cn/info/1008/6962.htm',
} as const;

export const nationalCompetitionClassNotes: Record<'a' | 'b', LocalizedText> = {
  a: {
    zh: '按广东技术师范大学 2025 年学科竞赛分类表整理。A 类会随排行榜与学校年度通知动态调整。',
    en: 'Based on Guangdong Polytechnic Normal University’s 2025 competition classification. Class A changes with annual ranking and university notices.',
  },
  b: {
    zh: '国家级 B 类没有固定赛事名单：除学科竞赛排行榜外，由教育部教学委员会、教指委、全国性一级学会（协会）或具有重大影响力的企业主办，并按学校当年要求报备认定。',
    en: 'Class B has no fixed public list. Outside the ranking catalog, it covers national teaching committees, national first-level societies, and highly influential organizer competitions, subject to the university’s current-year review.',
  },
};

export const nationalCompetitions = [
  {
    "id": "gpnu-competition-2025-01",
    "order": 1,
    "name": "全国高校商业精英挑战赛-①品牌策划竞赛、②会展专业创新创业实践竞赛、③国际贸易竞赛、④创新创业竞赛、⑤会计与商业管理案例竞赛",
    "organizer": "中国国际贸易促进委员会商业行业委员会、中国国际商会商业行业商会、中国商业文化研究会、中国商业经济学会、中国贸易报社",
    "officialUrl": "http://cubec.org.cn/",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-09",
        "end": "2026-03",
        "startLabel": "9月",
        "endLabel": "次年3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-05",
        "startLabel": "2月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-02",
    "order": 2,
    "name": "“工行杯”全国大学生金融科技创新大赛",
    "organizer": "中国工商银行",
    "officialUrl": "https://www.gonghangbei.com",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-11",
        "end": "2026-01",
        "startLabel": "11月",
        "endLabel": "次年1月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-03",
    "order": 3,
    "name": "全国本科院校税收风险管控案例大赛",
    "organizer": "中国注册税务师协会主办，国家税务总局纳税服务司、教育部高等学校财政学类专业教学指导委员会、中国高等教育学会高等财经教育分会",
    "officialUrl": "http://ssfkds.moocollege.com/home",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-06",
        "end": "2025-10",
        "startLabel": "6月",
        "endLabel": "10月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-06",
        "end": "2026-10",
        "startLabel": "6月",
        "endLabel": "10月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-04",
    "order": 4,
    "name": "全国大学生电子商务“创新、创意及创业”挑战赛",
    "organizer": "全国电子商务产教融合创新联盟、西安交通大学",
    "officialUrl": "http://www.3chuang.net/",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-09",
        "end": "2025-12",
        "startLabel": "9月",
        "endLabel": "12月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-05",
    "order": 5,
    "name": "全国大学生市场调查与分析大赛",
    "organizer": "中国商业统计学会",
    "officialUrl": "http://www.china-cssc.org/list-56-1.html",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-09",
        "end": "2025-10",
        "startLabel": "9月",
        "endLabel": "10月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-06",
    "order": 6,
    "name": "全国大学生物流设计大赛",
    "organizer": "教育部高等学校物流类专业教学指导委员会、中国物流与采购联合会",
    "officialUrl": "http://www.clpp.org.cn/html/competition/",
    "field": "经管类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-04",
        "startLabel": "3月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-07",
    "order": 7,
    "name": "中国大学生计算机设计大赛",
    "organizer": "中国教育电视台",
    "officialUrl": "http://jsjds.blcu.edu.cn/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-05",
        "startLabel": "4月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-08",
    "order": 8,
    "name": "全国大学生广告艺术大赛",
    "organizer": "中国传媒大学、大广赛文化传播、中国高等教育学会",
    "officialUrl": "https://www.sun-ada.net/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-06",
        "startLabel": "1月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-06",
        "startLabel": "1月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-09",
    "order": 9,
    "name": "两岸新锐设计竞赛 · 华灿奖",
    "organizer": "中国高等教育学会、中华中山文化交流协会、北京歌华文化发展集团",
    "officialUrl": "http://www.huacanjiang.com/home",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-04",
        "startLabel": "4月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-10",
    "order": 10,
    "name": "米兰设计周-- 中国高校设计学科师生优秀作品展",
    "organizer": "中国教育国际交流协会、中国高等教育学会",
    "officialUrl": "http://www.dandad.cn/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-10",
        "end": "2026-03",
        "startLabel": "10月",
        "endLabel": "次年3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-11",
    "order": 11,
    "name": "中国好创意暨全国数字艺术设计大赛",
    "organizer": "中国好创意暨全国数字艺术设计大赛组织委员会",
    "officialUrl": "https://www.cdec.org.cn/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-10",
        "end": "2026-06",
        "startLabel": "10月",
        "endLabel": "次年6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-05",
        "startLabel": "1月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-12",
    "order": 12,
    "name": "未来设计师·全国高校数字艺术设计大赛",
    "organizer": "未来设计师大赛组委会",
    "officialUrl": "https://www.ncda.org.cn/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-12",
        "end": "2026-06",
        "startLabel": "12月",
        "endLabel": "次年6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-05",
        "startLabel": "1月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-13",
    "order": 13,
    "name": "全国大学生数字媒体科技作品及创意竞赛",
    "organizer": "全国大学生数字媒体科技作品及创意竞赛组委会",
    "officialUrl": "http://mit.caai.cn/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-08",
        "end": "2025-10",
        "startLabel": "8月",
        "endLabel": "10月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-14",
    "order": 14,
    "name": "全国大学生工业设计大赛",
    "organizer": "教育部高等教育司指导,全国工业设计一流专业建设协同创新平台、广东省教育厅、广东省本科高校工业设计专业教学指导委员会",
    "officialUrl": "https://www.cuidc.net/#/",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-06",
        "end": "2025-07",
        "startLabel": "6月",
        "endLabel": "7月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-15",
    "order": 15,
    "name": "“外研社、理解当代中国”全国大学生英语系列赛-①英语演讲、②英语辩论、英语阅读、英语写作",
    "organizer": "外语教学与研究出版社",
    "officialUrl": "http://uchallenge.unipus.cn/",
    "field": "语言类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-10",
        "startLabel": "4月",
        "endLabel": "10月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-16",
    "order": 16,
    "name": "“21世纪杯”全国英语演讲比赛",
    "organizer": "中国日报社",
    "officialUrl": "https://contest.i21st.cn/",
    "field": "语言类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-17",
    "order": 17,
    "name": "中华经典诵写讲系列大赛",
    "organizer": "教育部，国家语委",
    "officialUrl": "https://jdsxj.eduyun.cn/",
    "field": "语言类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-07",
        "startLabel": "4月",
        "endLabel": "7月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-08",
        "startLabel": "3月",
        "endLabel": "8月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-18",
    "order": 18,
    "name": "理律杯全国高校模拟法庭辩论赛",
    "organizer": "清华大学法学院主办、台湾理律文教基金会和台湾理律法律事务所协办",
    "officialUrl": "http://lilvbei.law.tsinghua.edu.cn/",
    "field": "法学类",
    "classificationYear": 2025,
    "schedules": []
  },
  {
    "id": "gpnu-competition-2025-19",
    "order": 19,
    "name": "桃李杯舞蹈比赛",
    "organizer": "中华人民共和国文化部",
    "officialUrl": "https://www.cflac.org.cn/ys/wswd/wdjx/wdjxjs/201111/t20111103_16564.html",
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": []
  },
  {
    "id": "gpnu-competition-2025-20",
    "order": 20,
    "name": "全国大学生音乐大赛",
    "organizer": "共青团中央学校部",
    "officialUrl": null,
    "field": "艺术类",
    "classificationYear": 2025,
    "schedules": []
  },
  {
    "id": "gpnu-competition-2025-21",
    "order": 21,
    "name": "全国大学生电子设计竞赛",
    "organizer": "教育部高等教育司及工业和信息化部人事教育司",
    "officialUrl": "http://www.nuedcchina.com/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-04",
        "startLabel": "3月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-06",
        "end": "2026-08",
        "startLabel": "6月",
        "endLabel": "8月中旬",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-22",
    "order": 22,
    "name": "全国大学生集成电路创新创业大赛",
    "organizer": "工业和信息化部人才交流中心",
    "officialUrl": "http://univ.ciciec.com/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-03",
        "startLabel": "1月",
        "endLabel": "3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-03",
        "startLabel": "1月",
        "endLabel": "3月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-23",
    "order": 23,
    "name": "“大唐杯”全国大学生新一代信息通信技术大赛",
    "organizer": "工业和信息化部人才交流中心、中国通信企业协会",
    "officialUrl": "https://dtcup.dtxiaotangren.com",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-12",
        "end": "2026-02",
        "startLabel": "12月",
        "endLabel": "次年2月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-24",
    "order": 24,
    "name": "全国大学生嵌入式芯片与系统设计竞赛",
    "organizer": "中国电子学会",
    "officialUrl": "http://www.socchina.net/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-04",
        "startLabel": "3月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-25",
    "order": 25,
    "name": "全国大学生光电设计竞赛",
    "organizer": "中国光学学会、中国光学学会光学教育专业委员会",
    "officialUrl": "http://gd.p.moocollege.com/",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-08",
        "startLabel": "4月",
        "endLabel": "8月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-26",
    "order": 26,
    "name": "全国周培源大学生力学竞赛",
    "organizer": "教育部高等学校力学教学指导委员会力学基础课程教学指导分委员会、中国力学学会和周培源基金会",
    "officialUrl": "http://zpy.cstam.org.cn/index.aspx",
    "field": "理学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-03",
        "startLabel": "1月",
        "endLabel": "3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-04",
        "startLabel": "3月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-27",
    "order": 27,
    "name": "全国大学生物理实验竞赛",
    "organizer": "教育部高等学校大学物理课程教学指导委员会;教育部高等学校物理学类专业教学指导委员会;中国物理学会物理教学委员会;高等学校国家级实验教学示范中心联席会",
    "officialUrl": "http://wlsycx.moocollege.com/",
    "field": "理学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-05",
        "startLabel": "1月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-28",
    "order": 28,
    "name": "全国大学生机械创新设计大赛",
    "organizer": "北京中教仪科技有限公司、教育部高校机械科教指导委员会",
    "officialUrl": "http://umic.ckcest.cn/",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-29",
    "order": 29,
    "name": "中国大学生工程实践与创新能力大赛",
    "organizer": "教育部高教司",
    "officialUrl": "http://www.gcxl.edu.cn/new/index.html",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-09",
        "end": null,
        "startLabel": "9月",
        "endLabel": "-",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-30",
    "order": 30,
    "name": "全国大学生先进成图技术与产品信息建模创新大赛",
    "organizer": "教育部高等学校工程图学课程教学指导委员会、中国图学学会制图技术专业委员会、中国图学学会产品信息建模专业委员会",
    "officialUrl": "http://www.chengtudasai.com/",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-04",
        "startLabel": "4月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-31",
    "order": 31,
    "name": "全国大学生金相技能大赛",
    "organizer": "教育部高等学校材料类专业教学指导委员会",
    "officialUrl": "http://www.jxds.tech/",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-12",
        "end": "2026-04",
        "startLabel": "12月",
        "endLabel": "次年4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-32",
    "order": 32,
    "name": "中国大学生机械工程创新创意大赛",
    "organizer": "教育部高等学校机械类专业教学指导委员会、教育部高等学校材料类专业教学指导委员会、教育部高等学校工业工程类专业教学指导委员会",
    "officialUrl": "http://www.gczbds.org",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-02",
        "end": "2025-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-33",
    "order": 33,
    "name": "全国三维数字化创新设计大赛",
    "organizer": "",
    "officialUrl": "https://3dds.3ddl.net/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-34",
    "order": 34,
    "name": "中国高校智能机器人创意大赛",
    "organizer": "中国高校智能机器人创意大赛组委会",
    "officialUrl": "http://www.robotcontest.cn/",
    "field": "机器人类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-35",
    "order": 35,
    "name": "中国机器人及人工智能大赛",
    "organizer": "中国人工智能学会机器人文化艺术专业委员会中国机器人及人工智能大赛组委会",
    "officialUrl": "https://developer.apollo.auto/devcenter/gameOperations_cn.html?target=3",
    "field": "机器人类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-03",
        "startLabel": "3月",
        "endLabel": "3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-36",
    "order": 36,
    "name": "中国高校计算机大赛-①大数据挑战赛、②团体程序设计天梯赛、③ 移动应用创新赛、④网络技术挑战赛、⑤人工智能创意赛",
    "organizer": "教育部高等学校计算机类专业教学指导委员会教育部高等学校软件工程专业教学指导委员会教育部高等学校大学计算机课程教学指导委员会全国高等学校计算机教育研究会",
    "officialUrl": "http://www.c4best.cn/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-06",
        "end": "2025-07",
        "startLabel": "6月",
        "endLabel": "7月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-37",
    "order": 37,
    "name": "蓝桥杯全国软件和信息技术专业人才大赛",
    "organizer": "国信蓝桥教育科技(北京)股份有限公司、工业和信息化部人才交流中心",
    "officialUrl": "http://dasai.lanqiao.cn/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-12",
        "end": "2026-01",
        "startLabel": "12月",
        "endLabel": "次年1月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2025-10",
        "end": "2026-03",
        "startLabel": "10月（上一年）",
        "endLabel": "3月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-38",
    "order": 38,
    "name": "“中国软件杯”大学生软件设计大赛",
    "organizer": "工业和信息化部、教育部和江苏省人民政府",
    "officialUrl": "http://www.cnsoftbei.com/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-07",
        "startLabel": "4月",
        "endLabel": "7月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-39",
    "order": 39,
    "name": "华为ICT大赛",
    "organizer": "华为技术有限公司",
    "officialUrl": "https://e.huawei.com/cn/talent/ict-academy/#/ict-contest?compId=85131973",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-09",
        "end": "2025-11",
        "startLabel": "9月",
        "endLabel": "11月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-04",
        "startLabel": "1月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-40",
    "order": 40,
    "name": "百度之星 · 程序设计大赛",
    "organizer": "百度公司",
    "officialUrl": "https://star.baidu.com/#/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-41",
    "order": 41,
    "name": "全国大学生计算机系统能力大赛",
    "organizer": "全国高校计算机教育研究会",
    "officialUrl": "https://compiler.educg.net/#/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-42",
    "order": 42,
    "name": "全国大学生物联网设计竞赛",
    "organizer": "全国高等学校计算机教育研究会",
    "officialUrl": "https://iot.sjtu.edu.cn/Default.aspx",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-43",
    "order": 43,
    "name": "全球校园人工智能算法精英大赛",
    "organizer": "华为终端云服务、华为南京研究所、江苏省人工智能学会（JSAI）",
    "officialUrl": "https://developer.huawei.com/consumer/cn/activity/digixActivity/digixdetail/101655281685926449?ha_source=HR&ha_sourceId=89000452",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-05",
        "end": "2025-10",
        "startLabel": "5月",
        "endLabel": "10月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-44",
    "order": 44,
    "name": "全国大学生智能汽车竞赛",
    "organizer": "教育部高等学校自动化类专业教学指导委员会",
    "officialUrl": "http://www.eepw.com.cn/event/action/freescale_car2012/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-01",
        "end": "2025-06",
        "startLabel": "1月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-01",
        "end": "2026-06",
        "startLabel": "1月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-45",
    "order": 45,
    "name": "全国大学生节能减排社会实践与科技竞赛",
    "organizer": "中华人民共和国教育部高等教育司、教育部高等学校能源动力学科教学",
    "officialUrl": "http://www.jienengjianpai.org/",
    "field": "其他工学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-04",
        "startLabel": "4月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-06",
        "startLabel": "3月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-46",
    "order": 46,
    "name": "全国大学生数学建模竞赛",
    "organizer": "中国工业与应用数学学会",
    "officialUrl": "http://www.mcm.edu.cn/",
    "field": "理学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-05",
        "end": "2025-09",
        "startLabel": "5月",
        "endLabel": "9月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-08",
        "end": "2026-09",
        "startLabel": "8月中旬",
        "endLabel": "9月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-47",
    "order": 47,
    "name": "全国大学生统计建模大赛",
    "organizer": "中国统计教育学会",
    "officialUrl": "http://tjjmds.ai-learning.net",
    "field": "理学类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-02",
        "end": "2025-05",
        "startLabel": "2月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-48",
    "order": 48,
    "name": "ACM-ICPC国际大学生程序设计竞赛",
    "organizer": "美国计算机协会(ACM)",
    "officialUrl": "https://icpc.global/",
    "field": "计算机类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-05",
        "startLabel": "4月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-04",
        "end": "2026-04",
        "startLabel": "4月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-49",
    "order": 49,
    "name": "全国大学生信息安全竞赛",
    "organizer": "信息安全类专业教学指导委员会、中国互联网发展基金会",
    "officialUrl": "http://www.ciscn.cn/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-06",
        "startLabel": "4月",
        "endLabel": "6月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-50",
    "order": 50,
    "name": "全国大学生信息安全与对抗技术竞赛",
    "organizer": "中国兵工学会、中国兵工学会信息安全与对抗专业委员会",
    "officialUrl": "https://www.isclab.org.cn",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-04",
        "end": "2025-05",
        "startLabel": "4月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-51",
    "order": 51,
    "name": "全国大学生机器人大赛（CURC）",
    "organizer": "共青团中央、全国学联",
    "officialUrl": "https://www.robomaster.com/zh-CN",
    "field": "机器人类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-10",
        "end": "2026-03",
        "startLabel": "10月",
        "endLabel": "次年3月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-52",
    "order": 52,
    "name": "“西门子杯”中国智能制造挑战赛",
    "organizer": "教育部高等学校自动化类专业教学指导委员会、西门子（中国）有限公司和中国仿真学会",
    "officialUrl": "http://www.siemenscup-cimc.org.cn/",
    "field": "电子信息类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-53",
    "order": 53,
    "name": "中国机器人大赛暨RoboCup机器人世界杯中国赛",
    "organizer": "中国自动化学会、RoboCup中国委员会、晋江市人民政府、泉州市科学技术局",
    "officialUrl": "http://crc.drct-caa.org.cn/",
    "field": "机器人类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-03",
        "end": "2025-04",
        "startLabel": "3月",
        "endLabel": "4月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-03",
        "end": "2026-05",
        "startLabel": "3月",
        "endLabel": "5月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-54",
    "order": 54,
    "name": "睿抗机器人开发者大赛 (RAICOM)",
    "organizer": "工业和信息化部人才交流中心和RoboCom国际公开赛组委会",
    "officialUrl": "https://www.robocom.com.cn/",
    "field": "机器人类",
    "classificationYear": 2025,
    "schedules": [
      {
        "year": 2025,
        "start": "2025-02",
        "end": "2025-12",
        "startLabel": "2月",
        "endLabel": "12月",
        "sourceUrl": "https://jwc.svcci.cn/info/1018/1843.htm"
      },
      {
        "year": 2026,
        "start": "2026-02",
        "end": "2026-04",
        "startLabel": "2月",
        "endLabel": "4月",
        "sourceUrl": "https://jjglxy.sxfu.cn/info/1008/6962.htm"
      }
    ]
  },
  {
    "id": "gpnu-competition-2025-55",
    "order": 55,
    "name": "全国职业技术师范院校教学能力比赛（学生组）",
    "organizer": "教育部高等学校中等职业学校教师培养教学指导委员会",
    "officialUrl": null,
    "field": "师范教育",
    "classificationYear": 2025,
    "schedules": []
  },
  {
    "id": "gpnu-competition-2025-56",
    "order": 56,
    "name": "田家炳杯全国师范院校师范生教学技能大赛",
    "organizer": "全国师范院校师范生教学技能竞赛组委会",
    "officialUrl": "http://qgjxjn.zjnu.edu.cn/",
    "field": "师范教育",
    "classificationYear": 2025,
    "schedules": []
  },
  {
    "id": "gpnu-competition-2025-57",
    "order": 57,
    "name": "世界传统武术锦标赛",
    "organizer": "中国武术协会",
    "officialUrl": null,
    "field": "体育类",
    "classificationYear": 2025,
    "schedules": []
  }
] satisfies readonly NationalCompetition[];
