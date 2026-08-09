import type { Locale } from '@/i18n/routing';

type CelestialLabel = Record<Locale, string>;

export type FourSymbolId = 'azureDragon' | 'vermilionBird' | 'whiteTiger' | 'blackTortoise';

export const FOUR_SYMBOLS: Record<FourSymbolId, { label: CelestialLabel; rgb: string }> = {
  azureDragon: {
    label: { zh: '东方青龙', en: 'Azure Dragon of the East' },
    rgb: '94 234 212',
  },
  vermilionBird: {
    label: { zh: '南方朱雀', en: 'Vermilion Bird of the South' },
    rgb: '248 113 113',
  },
  whiteTiger: {
    label: { zh: '西方白虎', en: 'White Tiger of the West' },
    rgb: '226 232 240',
  },
  blackTortoise: {
    label: { zh: '北方玄武', en: 'Black Tortoise of the North' },
    rgb: '94 129 172',
  },
};

export const MANSION_GROUPS: Array<{
  symbolId: FourSymbolId;
  mansions: readonly string[];
}> = [
  { symbolId: 'azureDragon', mansions: ['角', '亢', '氐', '房', '心', '尾', '箕'] },
  { symbolId: 'vermilionBird', mansions: ['井', '鬼', '柳', '星', '张', '翼', '轸'] },
  { symbolId: 'whiteTiger', mansions: ['奎', '娄', '胃', '昴', '毕', '觜', '参'] },
  { symbolId: 'blackTortoise', mansions: ['斗', '牛', '女', '虚', '危', '室', '壁'] },
];

export const SEVEN_LUMINARIES: Array<{
  id: string;
  label: CelestialLabel;
  gradient: string;
}> = [
  {
    id: 'sun',
    label: { zh: '日曜', en: 'Rì Yào · Sun' },
    gradient: 'radial-gradient(circle at 32% 28%, #fff7d6 0%, #f6c453 42%, #d97706 78%, #78350f 100%)',
  },
  {
    id: 'moon',
    label: { zh: '月曜', en: 'Yuè Yào · Moon' },
    gradient: 'radial-gradient(circle at 32% 28%, #ffffff 0%, #dbe4ef 42%, #94a3b8 78%, #475569 100%)',
  },
  {
    id: 'mercury',
    label: { zh: '辰星', en: 'Chén Xīng · Mercury' },
    gradient: 'radial-gradient(circle at 32% 28%, #ece8e0 0%, #b8aea4 42%, #7a6f63 78%, #453e36 100%)',
  },
  {
    id: 'venus',
    label: { zh: '太白', en: 'Tài Bái · Venus' },
    gradient: 'radial-gradient(circle at 32% 28%, #fffdf1 0%, #eed9a9 42%, #c9a24b 78%, #8a6a2f 100%)',
  },
  {
    id: 'mars',
    label: { zh: '荧惑', en: 'Yíng Huò · Mars' },
    gradient: 'radial-gradient(circle at 32% 28%, #fbd8d0 0%, #e07a5f 42%, #b03a2e 78%, #6e2018 100%)',
  },
  {
    id: 'jupiter',
    label: { zh: '岁星', en: 'Suì Xīng · Jupiter' },
    gradient: 'radial-gradient(circle at 32% 28%, #fbe9c8 0%, #e8b06a 42%, #b5651d 78%, #6e3a10 100%)',
  },
  {
    id: 'saturn',
    label: { zh: '镇星', en: 'Zhèn Xīng · Saturn' },
    gradient: 'radial-gradient(circle at 32% 28%, #faf0cd 0%, #e8cf8a 42%, #c9a24b 78%, #7a5c22 100%)',
  },
];
