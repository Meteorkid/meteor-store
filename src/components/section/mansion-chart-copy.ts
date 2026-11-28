import type { Locale } from '@/i18n/routing';

export interface MansionChartCopy {
  eyebrow: string;
  title: string;
  description: string;
  active: string;
  future: string;
  line: string;
  lab: string;
  lineNote: string;
  labNote: string;
  futureNote: string;
  total: string;
  mansionSuffix: string;
  reserved: string;
  swipeHint: string;
  guestStar: string;
  guestNote: string;
}

export const mansionChartCopy: Record<Locale, MansionChartCopy> = {
  zh: {
    eyebrow: '二十八宿 · 星图索引',
    title: '作品不按等级分类，按星区落位',
    description: '青龙七宿对应主线，玄武七宿承载实验室；七宿之外的新作记作客星。宿名是作品在星图里的位置与顺序，不是功能或价格等级。',
    active: '当前星区',
    future: '未启用',
    line: '主线作品',
    lab: '实验室作品',
    lineNote: '主线 5 款依次取青龙前五宿，余下两宿留给同线后续作品。',
    labNote: '实验室作品沿玄武七宿依次落位，第 8 件记为客星。',
    futureNote: '四象二十八宿是完整星图；朱雀与白虎保留给未来作品，不为了填满而虚构产品。',
    total: '4 象 · 28 宿',
    mansionSuffix: '宿',
    reserved: '留给后续作品',
    swipeHint: '左右滑动，查看完整四象。',
    guestStar: '客星',
    guestNote: '七宿之外',
  },
  en: {
    eyebrow: 'The Twenty-Eight Mansions · star chart index',
    title: 'Works are placed by star region, not by tier',
    description: 'The seven mansions of the Azure Dragon map to the main line; the seven of the Black Tortoise carry the lab, and later work is recorded as a guest star. A mansion is a position in the chart, not a feature or price tier.',
    active: 'Active region',
    future: 'Not yet used',
    line: 'Main line',
    lab: 'Lab',
    lineNote: 'The five main-line tools take the first five Azure Dragon mansions; the remaining two are reserved for future tools on the same line.',
    labNote: 'Lab works fill the seven Black Tortoise mansions in order; the eighth is recorded as a guest star.',
    futureNote: 'The four symbols and twenty-eight mansions form a complete chart. The Vermilion Bird and White Tiger are reserved for future work; no products are invented just to fill them.',
    total: '4 symbols · 28 mansions',
    mansionSuffix: ' Mansion',
    reserved: 'Reserved for future work',
    swipeHint: 'Swipe sideways to see all four symbols.',
    guestStar: 'Guest star',
    guestNote: 'outside the seven',
  },
};
