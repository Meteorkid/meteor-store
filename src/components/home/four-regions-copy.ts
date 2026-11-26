import type { Locale } from '@/i18n/routing';

export interface FourRegionEntry {
  label: string;
}

export interface FourRegionsCopy {
  eyebrow: string;
  entries: {
    azureDragon: FourRegionEntry;
    blackTortoise: FourRegionEntry;
    vermilionBird: FourRegionEntry;
    whiteTiger: FourRegionEntry;
  };
}

/**
 * 首页「四象分野」只保留四个入口和一个极短的星区名。
 *
 * 四象不是营销卡，也不是需要读说明的分类系统；
 * 用户只需要一眼知道「作品、实验室、纪事、手册」各在哪。
 */
export const fourRegionsCopy: Record<Locale, FourRegionsCopy> = {
  zh: {
    eyebrow: '四象分野',
    entries: {
      azureDragon: { label: '青龙 · 作品' },
      blackTortoise: { label: '玄武 · 实验室' },
      vermilionBird: { label: '朱雀 · 纪事' },
      whiteTiger: { label: '白虎 · 手册' },
    },
  },
  en: {
    eyebrow: 'FOUR REGIONS',
    entries: {
      azureDragon: { label: 'Dragon · Work' },
      blackTortoise: { label: 'Tortoise · Lab' },
      vermilionBird: { label: 'Bird · Chronicle' },
      whiteTiger: { label: 'Tiger · Manual' },
    },
  },
};
